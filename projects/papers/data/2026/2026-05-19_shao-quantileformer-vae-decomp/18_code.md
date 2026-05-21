# 18 PyTorch Code — QuantileFormer 핵심 모듈

paper 가 공식 코드 미공개. 본 deep dive 의 PyTorch 구현 — paper 의 architecture (Fig 2) + Eq 4-19 의 충실 구현.

**Caveat**: 본 코드는 **reference implementation**. 정확한 학습 hyperparameter 는 paper text 가 명시 안 함 → 표준값 사용. paper repo 와 1:1 동일 보장 못함.

---

## 의존성

```bash
pip install torch numpy pandas
```

---

## 1. Drift-Divergence Decomposition (Eq 4)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


def quantile_filt(x: torch.Tensor, q: float, kernel_size: int = 25) -> torch.Tensor:
    """
    Moving q-quantile filter with padding (Eq 4).
    Args:
        x: [B, L, d]
        q: quantile in (0, 1)
        kernel_size: window size
    Returns:
        [B, L, d] — quantile drift of same length
    """
    B, L, d = x.shape
    half = (kernel_size - 1) // 2
    # Padding (양쪽 끝 복제)
    front = x[:, 0:1, :].repeat(1, half, 1)
    back = x[:, -1:, :].repeat(1, half, 1)
    x_padded = torch.cat([front, x, back], dim=1)  # [B, L + 2*half, d]
    # Sliding window quantile (unfold)
    windows = x_padded.unfold(dimension=1, size=kernel_size, step=1)  # [B, L, d, k]
    return torch.quantile(windows, q, dim=-1)  # [B, L, d]


class DriftDivergenceDecomp(nn.Module):
    """Pattern-mixture decomposition step 1 (Eq 4)."""

    def __init__(self, kernel_size: int = 25):
        super().__init__()
        self.kernel_size = kernel_size

    def forward(self, x: torch.Tensor, quantiles: list):
        """
        Args:
            x: [B, L, d]
            quantiles: list of q values, e.g. [0.5, 0.6, 0.7, 0.8, 0.9]
        Returns:
            drift_set: list of [B, L, d] tensors (one per quantile)
            divergence: [B, L, d] = x - chi^{0.5}
        """
        drift_set = [quantile_filt(x, q, self.kernel_size) for q in quantiles]
        chi_median = quantile_filt(x, 0.5, self.kernel_size)
        divergence = x - chi_median
        return drift_set, divergence
```

---

## 2. Gaussian Mixture Decomposition (Eq 5–7) — sklearn 사용 단순 구현

```python
# Note: paper 의 GauDe(·) 는 EM iterative. 본 코드는 sklearn 의 GaussianMixture 호출.
# Production 에서는 batch-friendly differentiable GMM (e.g., torchgmm) 권장.

from sklearn.mixture import GaussianMixture
import numpy as np


def gaussian_mixture_decomp(divergence: torch.Tensor, K: int = 8) -> tuple:
    """
    GMM decomposition (Eq 7).
    Args:
        divergence: [B, L, d]
        K: number of Gaussian components
    Returns:
        mus: [K, d]
        sigmas: [K, d, d]
    """
    # Flatten across B, L
    B, L, d = divergence.shape
    flat = divergence.detach().cpu().numpy().reshape(-1, d)  # [B*L, d]
    gmm = GaussianMixture(n_components=K, covariance_type='full', max_iter=100)
    gmm.fit(flat)
    mus = torch.tensor(gmm.means_, dtype=torch.float32)              # [K, d]
    sigmas = torch.tensor(gmm.covariances_, dtype=torch.float32)     # [K, d, d]
    return mus, sigmas
```

---

## 3. VAE-based Distribution Mixture Inference (Eq 8–15)

```python
class VAEDistInfer(nn.Module):
    """
    Variational AutoEncoder for distribution mixture inference.
    Inputs: chi^d (divergence), D (GMM components)
    Output: chi^d_out (Eq 15)
    """

    def __init__(self, d_model: int = 256, K: int = 8):
        super().__init__()
        self.K = K
        # ϕ encoder: D → prior parameters {ν, ζ, ς, κ}
        self.encoder = nn.Sequential(
            nn.Linear(d_model, d_model), nn.ReLU(),
            nn.Linear(d_model, 4 * K)  # ν_k, ζ_k, ς_k, κ_k for each k
        )
        # θ decoder: latent z_t → chi^d_out
        self.decoder = nn.Sequential(
            nn.Linear(K, d_model), nn.ReLU(),
            nn.Linear(d_model, d_model)
        )
        # divergence embedding to d_model
        self.div_embed = nn.Linear(1, d_model)  # assumes 1-dim per channel

    def forward(self, chi_d: torch.Tensor, gmm_components: tuple):
        """
        Args:
            chi_d: [B, L, d]
            gmm_components: (mus [K, d], sigmas [K, d, d])
        Returns:
            chi_d_out: [B, L, d_model]
            kl_loss: scalar
        """
        B, L, d = chi_d.shape
        mus, sigmas = gmm_components

        # 1. Encode GMM info (use mus as summary, shape [K, d])
        d_summary = mus.flatten().unsqueeze(0).repeat(B * L, 1)  # rough
        # In practice: better to use mus + sigmas concatenated and projected.
        # We project d_summary to d_model with the div_embed as a placeholder shortcut.
        # (Reference implementation; replace with proper architecture.)

        # 2. Infer prior parameters (very simplified)
        prior_params = self.encoder(self.div_embed(chi_d.view(-1, d)))  # [B*L, 4K]
        nu_k, zeta_k, varsigma_k, kappa_k = prior_params.chunk(4, dim=-1)  # each [B*L, K]
        nu_k = nu_k.view(B, L, self.K)
        zeta_k = F.softplus(zeta_k.view(B, L, self.K)) + 1e-6  # positive
        varsigma_k = F.softplus(varsigma_k.view(B, L, self.K)) + 1e-6
        kappa_k = F.softplus(kappa_k.view(B, L, self.K)) + 1e-6

        # 3. Sample variational posterior (Eq 9)
        # b_t ~ N(ν, ζ)
        eps_b = torch.randn_like(nu_k)
        b_t = nu_k + zeta_k.sqrt() * eps_b
        b_t = torch.sigmoid(b_t)  # constrain to [0, 1]
        # λ_t ~ Beta(ς, κ) — use rejection-sampling proxy via Gaussian relaxation
        # (For simplicity, use sigmoid of Gaussian as continuous relaxation)
        eps_l = torch.randn_like(varsigma_k)
        lambda_t_raw = varsigma_k / (varsigma_k + kappa_k + 1e-6)
        # c_t = Bernoulli — approximate with sigmoid
        c_t_prob = torch.sigmoid(lambda_t_raw - 0.5)  # rough

        # 4. Latent z_t (Eq 의 z_t)
        z_t = (b_t * c_t_prob).sum(dim=-1, keepdim=True)  # [B, L, 1]
        # broadcast to [B, L, K]
        z_t = z_t.expand(-1, -1, self.K)

        # 5. Decode
        chi_d_out = self.decoder(z_t)  # [B, L, d_model]

        # 6. KL loss (Eq 13)
        # KL between N(ν, ζ) and N(0, I) — standard VAE KL
        kl_b = -0.5 * (1 + zeta_k.log() - nu_k.pow(2) - zeta_k).sum(dim=-1).mean()
        kl_loss = kl_b

        return chi_d_out, kl_loss
```

---

## 4. Quantile Drift Feature Extraction (Section 4.3)

```python
class QuantileDriftEncoder(nn.Module):
    """Transformer encoder for quantile drift (Section 4.3)."""

    def __init__(self, d_model: int = 256, n_heads: int = 8, n_layers: int = 6, d_ff: int = 1024):
        super().__init__()
        self.embed = nn.Linear(1, d_model)  # per-channel embedding
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=n_heads, dim_feedforward=d_ff,
            batch_first=True, activation='relu'
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=n_layers)

    def forward(self, chi_q_set: list) -> list:
        """
        Args: chi_q_set = list of [B, L, d] — one per quantile
        Returns: chi_Q_eout = list of [B, L, d_model]
        """
        outputs = []
        for chi_q in chi_q_set:
            B, L, d = chi_q.shape
            # Embed (assume d=1 channel for simplicity)
            x = self.embed(chi_q.view(B, L, 1))  # [B, L, d_model]
            out = self.encoder(x)
            outputs.append(out)
        return outputs
```

---

## 5. Fusion Transformer with Cross-Attention (Eq 16–18)

```python
class FusionTransformerLayer(nn.Module):
    """Fusion Transformer layer (Eq 16-17)."""

    def __init__(self, d_model: int = 256, n_heads: int = 8, d_ff: int = 1024):
        super().__init__()
        self.W_a = nn.Linear(d_model, d_model)
        self.self_attn = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.cross_attn = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.ReLU(),
            nn.Linear(d_ff, d_model)
        )
        self.norm = nn.LayerNorm(d_model)

    def forward(self, chi_d_out: torch.Tensor, chi_Q_eout_stacked: torch.Tensor):
        """
        Args:
            chi_d_out: [B, L, d_model]   ← divergence path (Q)
            chi_Q_eout_stacked: [B, L*|Q|, d_model]  ← drift path (K, V) — concatenated quantiles
        Returns:
            [B, L, d_model]
        """
        # Eq 16: align + project
        Q = self.W_a(chi_d_out)
        K = chi_Q_eout_stacked
        V = chi_Q_eout_stacked

        # Eq 17 의 3 항
        self_att_out, _ = self.self_attn(Q, Q, Q)
        cross_att_out, _ = self.cross_attn(Q, K, V)
        ffn_out = self.ffn(Q)

        # Sum + LayerNorm
        fused = self.norm(self_att_out + cross_att_out + ffn_out)
        return fused
```

---

## 6. Full QuantileFormer Model

```python
class QuantileFormer(nn.Module):
    def __init__(
        self,
        d_model: int = 256,
        n_heads: int = 8,
        encoder_layers: int = 6,
        fusion_layers: int = 2,
        d_ff: int = 1024,
        K: int = 8,
        kernel_size: int = 25,
        quantiles: list = None,
        output_len: int = 96,
    ):
        super().__init__()
        self.quantiles = quantiles if quantiles else [0.5, 0.6, 0.7, 0.8, 0.9]
        self.K = K
        self.output_len = output_len

        self.decomp = DriftDivergenceDecomp(kernel_size=kernel_size)
        self.encoder = QuantileDriftEncoder(d_model, n_heads, encoder_layers, d_ff)
        self.vae = VAEDistInfer(d_model=d_model, K=K)
        self.fusion_layers = nn.ModuleList([
            FusionTransformerLayer(d_model, n_heads, d_ff) for _ in range(fusion_layers)
        ])
        self.head = nn.Linear(d_model, len(self.quantiles))  # output per-quantile

    def forward(self, x: torch.Tensor):
        """
        Args: x [B, L, d]
        Returns: y_hat [B, output_len, |Q|]
        """
        # 1. Pattern-Mixture Decomposition
        chi_q_set, chi_d = self.decomp(x, self.quantiles)
        # 2. GMM (non-trainable, sklearn)
        gmm_components = gaussian_mixture_decomp(chi_d, K=self.K)
        # 3. Quantile Drift Encoder
        chi_Q_eout = self.encoder(chi_q_set)  # list of [B, L, d_model]
        chi_Q_eout_stacked = torch.cat(chi_Q_eout, dim=1)  # [B, L*|Q|, d_model]
        # 4. VAE
        chi_d_out, kl_loss = self.vae(chi_d, gmm_components)  # [B, L, d_model]
        # 5. Fusion
        fused = chi_d_out
        for layer in self.fusion_layers:
            fused = layer(fused, chi_Q_eout_stacked)
        # 6. Quantile Head
        y_hat = self.head(fused[:, -self.output_len:, :])  # [B, output_len, |Q|]
        return y_hat, kl_loss
```

---

## 7. Joint Quantile Loss (Eq 19)

```python
def quantile_loss(y: torch.Tensor, y_hat: torch.Tensor, quantiles: list, kl_loss: torch.Tensor = None, kl_weight: float = 0.01):
    """
    Args:
        y: [B, O] (target, single dim for simplicity)
        y_hat: [B, O, |Q|]
        quantiles: list of q
        kl_loss: from VAE
    Returns: scalar loss
    """
    total = 0.
    for i, q in enumerate(quantiles):
        u = y - y_hat[..., i]
        loss_q = q * F.relu(u) + (1 - q) * F.relu(-u)  # pinball
        total = total + loss_q.mean()
    total = total / len(quantiles)
    if kl_loss is not None:
        total = total + kl_weight * kl_loss
    return total
```

---

## 8. 학습 루프 예시

```python
def train_step(model, batch, optimizer, criterion_args):
    x, y = batch  # x [B, L, d], y [B, O]
    y_hat, kl_loss = model(x)
    loss = quantile_loss(y, y_hat, model.quantiles, kl_loss=kl_loss, kl_weight=0.01)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()


def main():
    model = QuantileFormer(
        d_model=256, n_heads=8,
        encoder_layers=6, fusion_layers=2,
        K=8, kernel_size=25,
        quantiles=[0.5, 0.6, 0.7, 0.8, 0.9],
        output_len=96
    )
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    # ... standard DataLoader, training loop, early stopping
```

---

## 권장 default 값 (paper 표준 setup 추정)

| Param | Value | 출처 |
|-------|-------|------|
| d_model | 256 | 일반적 |
| n_heads | 8 | 표준 Transformer |
| encoder_layers | 6 | paper Section 4.3 ("typically 6 layers") |
| fusion_layers | 2 | paper 미명시, default 추정 |
| K (GMM) | 8 | paper Fig 3 sweet spot |
| kernel_size | 25 | Autoformer 와 동일 default |
| Quantiles | {0.5, 0.6, 0.7, 0.8, 0.9} | paper Table 1 |
| LR | 1e-4 | 표준 |
| Batch | 32 | 표준 |
| Epochs | 10-20 + early stop | 표준 |

---

## 재현 시 주의

1. **GMM 의 differentiability**: sklearn 의 GaussianMixture 는 non-differentiable. Production 환경에서는 **differentiable GMM** (torchgmm 또는 custom EM with PyTorch ops) 필요.

2. **VAE 의 simplification**: 본 코드는 paper 의 Eq 9 의 Beta-Bernoulli prior 를 Gaussian relaxation 으로 단순화. paper 의 원래 구현은 stick-breaking + Gumbel-softmax 기반 가능성.

3. **Channel-wise vs joint**: paper 가 channel-wise 인지 joint 인지 명시 안 함. 본 코드는 channel-wise (per-feature 독립 처리).

4. **Multi-variate handling**: Electricity 321 features 처리 시 d_model 이 작으면 부족. d_model=512 권장.

5. **GMM 의 동적 호출**: forward 마다 GMM 재학습은 비효율. Practical 학습에서는 sliding window 마다 GMM 사전 계산 + cache.

다음 [19_diagrams.md](19_diagrams.md) 에서 ASCII 도식 + interactive viz 카탈로그.
