# 16 PyTorch Code — ProTran 핵심 모듈

paper 가 공식 코드 미공개. 본 deep dive 의 PyTorch 구현 — single-layer ProTran 의 충실한 구현.

---

## 의존성

```bash
pip install torch numpy
```

---

## 1. Position Embedding

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math


class PositionalEmbedding(nn.Module):
    """Sinusoidal positional embedding (Vaswani 2017 style)."""

    def __init__(self, d_model: int, max_len: int = 1024):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * -(math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe)

    def forward(self, length: int) -> torch.Tensor:
        return self.pe[:length]  # [length, d_model]
```

---

## 2. Multi-Head Attention (Eq 4)

```python
class MultiHeadAttention(nn.Module):
    """Standard multi-head attention."""

    def __init__(self, d_model: int, n_heads: int = 8):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)

    def forward(self, Q, K, V, mask=None):
        """Args: Q, K, V each [B, L_*, d_model]. mask: optional [B, L_q, L_k]."""
        B = Q.size(0)
        Lq, Lk = Q.size(1), K.size(1)
        # Project + reshape into heads
        Q = self.W_Q(Q).view(B, Lq, self.n_heads, self.d_head).transpose(1, 2)
        K = self.W_K(K).view(B, Lk, self.n_heads, self.d_head).transpose(1, 2)
        V = self.W_V(V).view(B, Lk, self.n_heads, self.d_head).transpose(1, 2)
        # Attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_head)
        if mask is not None:
            scores = scores.masked_fill(mask.unsqueeze(1) == 0, float('-inf'))
        attn = F.softmax(scores, dim=-1)
        # Output
        out = torch.matmul(attn, V).transpose(1, 2).contiguous().view(B, Lq, self.d_model)
        return self.W_O(out)
```

---

## 3. ProTran Single Layer (Eq 5–11)

```python
class ProTranSingleLayer(nn.Module):
    """
    Single-layer ProTran.
    Eq 5: context embedding
    Eq 6-9: generation
    Eq 10-11: inference (training)
    """

    def __init__(self, N: int, d_model: int = 128, d_latent: int = 16, n_heads: int = 8, max_len: int = 1024):
        super().__init__()
        self.N = N  # observation dim
        self.d_model = d_model
        self.d_latent = d_latent

        # Embeddings
        self.input_proj = nn.Sequential(
            nn.Linear(N, d_model), nn.ReLU(),
            nn.Linear(d_model, d_model)
        )
        self.pos_emb = PositionalEmbedding(d_model, max_len)
        self.input_ln = nn.LayerNorm(d_model)

        # Initial hidden w_0 (learnable)
        self.w0 = nn.Parameter(torch.zeros(1, 1, d_model))
        nn.init.normal_(self.w0, std=0.02)

        # Attentions for Eq 6, 7, 10
        self.self_attn = MultiHeadAttention(d_model, n_heads)
        self.context_attn = MultiHeadAttention(d_model, n_heads)
        self.bidir_attn = MultiHeadAttention(d_model, n_heads)  # for k_t in Eq 10

        # LayerNorms
        self.ln_eq6 = nn.LayerNorm(d_model)
        self.ln_eq7 = nn.LayerNorm(d_model)
        self.ln_eq9 = nn.LayerNorm(d_model)

        # Gaussian param networks
        # Generation (Eq 8): input = ŵ_t [d_model]
        self.gen_mu = nn.Sequential(nn.Linear(d_model, d_model), nn.ReLU(), nn.Linear(d_model, d_latent))
        self.gen_sigma = nn.Sequential(nn.Linear(d_model, d_model), nn.ReLU(), nn.Linear(d_model, d_latent))
        # Inference (Eq 11): input = concat(ŵ_t, k_t) [2 d_model]
        self.inf_mu = nn.Sequential(nn.Linear(2 * d_model, d_model), nn.ReLU(), nn.Linear(d_model, d_latent))
        self.inf_sigma = nn.Sequential(nn.Linear(2 * d_model, d_model), nn.ReLU(), nn.Linear(d_model, d_latent))

        # z → w update (Eq 9)
        self.z_to_w = nn.Sequential(nn.Linear(d_latent, d_model), nn.ReLU(), nn.Linear(d_model, d_model))

        # Emission
        self.emit = nn.Sequential(nn.Linear(d_model, d_model), nn.ReLU(), nn.Linear(d_model, N))

    def embed(self, x: torch.Tensor) -> torch.Tensor:
        """Eq 5: h_t = LN(MLP(x_t) + Position(t))"""
        B, L, _ = x.shape
        pos = self.pos_emb(L).unsqueeze(0).expand(B, -1, -1)
        return self.input_ln(self.input_proj(x) + pos)

    def forward(self, x_context: torch.Tensor, x_full: torch.Tensor = None, T: int = None):
        """
        Args:
            x_context: [B, C, N] — context observations
            x_full: [B, T, N] — full sequence (training only). None for inference time.
            T: target length when x_full=None.
        Returns:
            x_hat: [B, T, N] generated observations
            kl_loss: scalar (KL term for ELBO) or None at test time
        """
        B = x_context.size(0)
        device = x_context.device
        if x_full is not None:
            T = x_full.size(1)
            assert T >= x_context.size(1)
            h_full = self.embed(x_full)  # for k_t in Eq 10
            k_all = self.bidir_attn(h_full, h_full, h_full)  # [B, T, d_model]
        else:
            assert T is not None
            k_all = None

        h_ctx = self.embed(x_context)  # [B, C, d_model]

        # Initial w_0
        w_list = [self.w0.expand(B, 1, -1)]  # placeholder at index 0
        z_list = []
        x_hat_list = []
        kl_terms = []

        pos = self.pos_emb(T + 1).unsqueeze(0).expand(B, -1, -1)  # +1 for w0

        for t in range(T):
            # Concatenate past w's (length t+1, including w_0)
            w_past = torch.cat(w_list, dim=1)  # [B, t+1, d_model]
            w_prev = w_past[:, -1:, :]  # [B, 1, d_model]

            # Eq 6: self-attention over past
            bar_w = self.ln_eq6(w_prev + self.self_attn(w_prev, w_past, w_past))
            # Eq 7: cross-attention to context
            hat_w = self.ln_eq7(bar_w + self.context_attn(bar_w, h_ctx, h_ctx))

            # Eq 8 or 11: sample z_t
            if k_all is not None:
                # Inference (training): use k_t
                k_t = k_all[:, t:t+1, :]  # [B, 1, d_model]
                cat = torch.cat([hat_w, k_t], dim=-1)
                mu_q = self.inf_mu(cat)
                sigma_q = F.softplus(self.inf_sigma(cat)) + 1e-6
                eps = torch.randn_like(mu_q)
                z_t = mu_q + sigma_q * eps  # reparameterization
                # Also compute prior for KL
                mu_p = self.gen_mu(hat_w)
                sigma_p = F.softplus(self.gen_sigma(hat_w)) + 1e-6
                # KL(q||p) for diagonal Gaussians
                kl = 0.5 * (
                    (sigma_q / sigma_p).pow(2) + ((mu_q - mu_p) / sigma_p).pow(2) - 1 +
                    2 * (sigma_p.log() - sigma_q.log())
                ).sum(dim=-1)  # [B, 1]
                kl_terms.append(kl)
            else:
                # Generation (test): sample from prior
                mu_p = self.gen_mu(hat_w)
                sigma_p = F.softplus(self.gen_sigma(hat_w)) + 1e-6
                eps = torch.randn_like(mu_p)
                z_t = mu_p + sigma_p * eps

            z_list.append(z_t)

            # Eq 9: update w_t
            w_t = self.ln_eq9(hat_w + self.z_to_w(z_t) + pos[:, t+1:t+2, :])
            w_list.append(w_t)

            # Emission
            x_hat_list.append(self.emit(w_t))

        x_hat = torch.cat(x_hat_list, dim=1)  # [B, T, N]
        if kl_terms:
            kl_total = torch.cat(kl_terms, dim=1).sum(dim=1).mean()  # scalar
            return x_hat, kl_total
        return x_hat, None
```

---

## 4. Loss Function

```python
def protran_loss(x_target: torch.Tensor, x_hat: torch.Tensor, kl: torch.Tensor, beta: float = 1.0) -> torch.Tensor:
    """
    Laplace + KL loss (Eq 3).
    Args:
        x_target: [B, T, N] ground truth
        x_hat: [B, T, N] predictions
        kl: scalar
        beta: KL weight
    Returns: scalar loss
    """
    # L1 reconstruction (Laplace NLL)
    recon = F.l1_loss(x_hat, x_target, reduction='mean')
    return recon + beta * kl
```

---

## 5. Training Step + Inference

```python
def train_step(model: ProTranSingleLayer, batch, optimizer, beta=1.0):
    x_full = batch  # [B, T, N]
    B, T, N = x_full.shape
    C = T // 2  # context length, e.g. half

    x_context = x_full[:, :C, :]

    x_hat, kl = model(x_context, x_full=x_full, T=T)
    loss = protran_loss(x_full, x_hat, kl, beta=beta)

    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    return loss.item()


@torch.no_grad()
def predict(model, x_context, n_samples=100, target_len=24):
    """Sample n_samples forecasts from prior."""
    samples = []
    for _ in range(n_samples):
        x_hat, _ = model(x_context, x_full=None, T=target_len)
        samples.append(x_hat)
    return torch.stack(samples, dim=0)  # [n_samples, B, T, N]
```

---

## 6. Hyperparameters (paper Section 5)

| Param | Value | Note |
|-------|-------|------|
| $d_{model}$ ($w_t$ dim) | 128 | paper p.7 |
| $d_{latent}$ ($z_t$ dim) | 16 | paper p.7 |
| Attention heads | 8 | paper p.7 |
| MLP layers | 2 | paper p.7 |
| Layers (L) | 1 / 2 / 3 | dataset-dependent |
| $\beta$ (KL weight) | cross-validated | Laplace scale |
| Optimizer | Adam (assumed standard) | not specified |
| LR | 1e-3 ~ 1e-4 (assumed) | not specified |

---

## 재현 시 주의

1. **Multi-layer 확장**: 본 코드는 single-layer. Multi-layer 는 Eq 16 (cross-layer attention) 추가 필요. 위 `ProTranSingleLayer` 를 L 번 stack + Eq 16 inject.

2. **Causal masking**: Eq 6 의 self-attention 은 $w_{1:t-1}$ 만 attention — 현재 코드는 `w_past = cat(w_list[:t+1])` 로 시점별 처리 (parallelization 손해). Production 에는 causal mask 사용.

3. **$\beta$ tuning**: KL weight 가 generation quality 결정. 너무 작으면 latent collapse, 너무 크면 reconstruction 약화.

4. **Multivariate emission**: Laplace 가정은 univariate. Multivariate 는 component-wise independent Laplace 또는 Gaussian copula 사용.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **`ProTranSingleLayer` 의 `bidir_attn` (Eq 10) 은 왜 inference time 에만 호출되는가?**
2. **`reparameterization trick` (Eq 8 의 `z_t = mu + sigma * eps`) 가 backpropagation 에 결정적인 이유는?**
3. **KL term 계산이 두 Gaussian 사이 closed-form 인 이유와 식의 의미는?**

### 답변

1. `bidir_attn` 은 $h_{1:T}$ (전체 sequence) 를 입력으로 받음 — **target observation 필요**. Training time 에는 ground truth 미래 있으니 OK. **Test time 에는 미래 모름** → `k_all = None` → Eq 8 (prior only) 사용.
2. **Sample 은 본래 미분 불가** — random 결과라서. `z_t = mu + sigma * eps` 형태로 쓰면 randomness (`eps`) 가 leaf node 가 되고, `mu`, `sigma` 는 deterministic — gradient 가 `mu`, `sigma` 통과해 backprop 가능. 이 trick (Kingma 2013) 이 VAE 학습 가능하게 한 핵심.
3. 두 diagonal Gaussian $q = \mathcal{N}(\mu_q, \sigma_q^2)$, $p = \mathcal{N}(\mu_p, \sigma_p^2)$ 사이 KL: $\frac{1}{2}\left[\frac{\sigma_q^2}{\sigma_p^2} + \frac{(\mu_q - \mu_p)^2}{\sigma_p^2} - 1 + 2\log\frac{\sigma_p}{\sigma_q}\right]$. **Closed-form 인 이유**: 두 분포 모두 분석적 형태 (Gaussian) → 적분 명시적. **의미**: 첫 두 term = 평균/분산 차이, 마지막 term = 분산 비율의 log entropy 보정.

---

다음 [17_diagrams.md](17_diagrams.md) 에서 ASCII 도식 + viz 카탈로그.
