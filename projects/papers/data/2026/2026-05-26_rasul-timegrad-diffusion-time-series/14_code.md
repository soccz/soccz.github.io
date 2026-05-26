# 14 PyTorch Code — TimeGrad 핵심 모듈

> **🧒 한 줄 요약**: PyTorch TimeGrad 구현.


paper 가 official 코드 미공개 (post-review). 본 deep dive 의 PyTorch 구현 — paper 의 architecture + Algorithm 1/2 의 충실 구현.

**Caveat**: 본 코드는 **reference implementation**. paper 의 정확한 hyperparameter (8 residual blocks, 8 channels, dilated Conv1d) 동일. paper repo 와 1:1 동일 보장은 못 함 — paper text 가 일부 detail 미명시. GluonTS (https://github.com/awslabs/gluonts) 의 TimeGrad implementation 도 참고.

---

## 의존성

```bash
pip install torch numpy pandas
```

---

## 1. Beta Schedule + Alpha Cumulative Product

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math


def make_beta_schedule(N: int = 100, beta_start: float = 1e-4, beta_end: float = 0.1) -> torch.Tensor:
    """
    Linear beta schedule (paper p.5).
    Returns: betas shape [N]
    """
    return torch.linspace(beta_start, beta_end, N)


def compute_alphas(betas: torch.Tensor) -> tuple:
    """
    Compute alphas + cumulative product.
    Returns: (alphas, alpha_bars)
    """
    alphas = 1.0 - betas          # [N]
    alpha_bars = torch.cumprod(alphas, dim=0)  # [N]
    return alphas, alpha_bars
```

**검증**:
- $\beta_1 = 10^{-4}, \beta_N = 0.1$ (paper).
- $\alpha_n = 1 - \beta_n$.
- $\bar\alpha_n = \prod_{i=1}^n \alpha_i$.
- $\bar\alpha_{100} \approx 0$ → final noise level 거의 pure noise (확인 가능).

---

## 2. Sinusoidal Positional Embedding for Noise Step $n$

```python
class NoiseEmbedding(nn.Module):
    """
    Fourier positional embedding for diffusion step n (paper p.5).
    Output: [batch, emb_dim].
    """
    def __init__(self, emb_dim: int = 32, max_n: int = 500):
        super().__init__()
        self.emb_dim = emb_dim
        self.max_n = max_n
        # Precompute frequencies
        half = emb_dim // 2
        freqs = torch.exp(-math.log(max_n) * torch.arange(half) / half)
        self.register_buffer('freqs', freqs)
        
    def forward(self, n: torch.Tensor) -> torch.Tensor:
        """
        n: [batch] — noise step indices.
        Returns: [batch, emb_dim]
        """
        n = n.float().unsqueeze(-1)  # [batch, 1]
        args = n * self.freqs.unsqueeze(0)  # [batch, half]
        return torch.cat([args.sin(), args.cos()], dim=-1)  # [batch, emb_dim]
```

**해석**: noise step $n \in [1, N]$ 을 32-dim Fourier embedding 으로. Transformer (Vaswani 2017) 의 positional embedding 과 동일 원리.

---

## 3. Conditional Residual Block (Fig 2)

```python
class CondResBlock(nn.Module):
    """
    Conditional residual block (paper Fig 2).
    Conv1x1 + Conv1d (dilated) + Gated Activation + skip.
    """
    def __init__(self, channels: int = 8, hidden_dim: int = 40, noise_emb_dim: int = 32,
                 dilation: int = 1, kernel_size: int = 3):
        super().__init__()
        self.channels = channels
        # x branch
        self.x_conv = nn.Conv1d(channels, channels, kernel_size=1)
        # Noise branch
        self.n_conv = nn.Conv1d(noise_emb_dim, channels, kernel_size=1)
        # Dilated bidirectional Conv1d (circular padding)
        self.dilated_conv = nn.Conv1d(
            channels, 2 * channels,
            kernel_size=kernel_size,
            padding=(kernel_size - 1) * dilation // 2,
            padding_mode='circular',
            dilation=dilation
        )
        # Hidden state branch (h_{t-1})
        self.h_conv = nn.Conv1d(hidden_dim, channels, kernel_size=1)
        # FC layers for up/down sample
        self.fc = nn.Linear(channels, 2 * channels)
        # Output projection
        self.residual_conv = nn.Conv1d(channels, channels, kernel_size=1)
        self.skip_conv = nn.Conv1d(channels, channels, kernel_size=1)

    def forward(self, x: torch.Tensor, n_emb: torch.Tensor, h: torch.Tensor) -> tuple:
        """
        Args:
            x: [B, channels, D] — current state (channels=8, D=data dim)
            n_emb: [B, noise_emb_dim] — noise step embedding (Sinusoidal)
            h: [B, hidden_dim, D] — RNN hidden state expanded
        Returns:
            (out_residual, out_skip): each [B, channels, D]
        """
        # Project x and noise embedding
        x_proj = F.relu(self.x_conv(x))                          # [B, channels, D]
        n_proj = F.relu(self.n_conv(n_emb.unsqueeze(-1)))        # [B, channels, 1]
        h_proj = self.h_conv(h)                                  # [B, channels, D]

        # Combine + dilated conv
        combined = x_proj + n_proj + h_proj                      # [B, channels, D]
        y = self.dilated_conv(combined)                          # [B, 2*channels, D]

        # Gated Activation Unit (van den Oord 2016b): σ(·) ⊙ tanh(·)
        gate, val = y.chunk(2, dim=1)
        y = torch.sigmoid(gate) * torch.tanh(val)                # [B, channels, D]

        # Residual + Skip
        residual = self.residual_conv(y) + x                     # [B, channels, D]
        skip = self.skip_conv(y)                                  # [B, channels, D]
        return residual, skip
```

**Note**: paper Fig 2 의 8 residual blocks (i=0..7) 의 dilation 은 $2^{i \mod 2}$ — block 0: dilation 1, block 1: 2, ... 순환.

---

## 4. Epsilon Prediction Network

```python
class EpsilonNet(nn.Module):
    """
    Noise prediction network ε_θ (paper Fig 2).
    Conditional on noisy x^n, hidden state h_{t-1}, noise step n.
    """
    def __init__(self, D: int, hidden_dim: int = 40, channels: int = 8,
                 n_blocks: int = 8, noise_emb_dim: int = 32, max_n: int = 500):
        super().__init__()
        self.D = D
        self.channels = channels
        # Input projection
        self.input_conv = nn.Conv1d(1, channels, kernel_size=1)
        # Noise embedding
        self.noise_emb = NoiseEmbedding(noise_emb_dim, max_n)
        # Residual blocks
        self.blocks = nn.ModuleList([
            CondResBlock(channels=channels, hidden_dim=hidden_dim,
                         noise_emb_dim=noise_emb_dim,
                         dilation=2**(i % 2))
            for i in range(n_blocks)
        ])
        # Output projection
        self.out_conv1 = nn.Conv1d(channels, channels, kernel_size=1)
        self.out_conv2 = nn.Conv1d(channels, 1, kernel_size=1)

    def forward(self, x_n: torch.Tensor, h: torch.Tensor, n: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x_n: [B, D] — noisy data at step n
            h: [B, hidden_dim] — RNN hidden state h_{t-1}
            n: [B] — noise step indices
        Returns:
            ε_pred: [B, D] — predicted noise
        """
        B, D = x_n.shape
        # Reshape: x as channels-first (B, 1, D)
        x = x_n.unsqueeze(1)                                # [B, 1, D]
        x = self.input_conv(x)                              # [B, channels, D]

        # Noise embedding
        n_emb = self.noise_emb(n)                            # [B, noise_emb_dim]

        # Hidden state: expand to [B, hidden_dim, D]
        h_expanded = h.unsqueeze(-1).expand(-1, -1, D)      # [B, hidden_dim, D]

        # Residual blocks
        skip_sum = 0
        for block in self.blocks:
            x, skip = block(x, n_emb, h_expanded)
            skip_sum = skip_sum + skip

        # Output
        out = F.relu(self.out_conv1(skip_sum))
        out = self.out_conv2(out)                            # [B, 1, D]
        return out.squeeze(1)                                 # [B, D]
```

---

## 5. TimeGrad Full Model

```python
class TimeGrad(nn.Module):
    """
    Full TimeGrad model (paper Algorithm 1 + 2).
    """
    def __init__(self, D: int, covariate_dim: int = 8, hidden_dim: int = 40,
                 n_rnn_layers: int = 2, channels: int = 8, n_blocks: int = 8,
                 N: int = 100):
        super().__init__()
        self.D = D
        self.hidden_dim = hidden_dim
        self.N = N

        # RNN for time encoding
        self.rnn = nn.LSTM(
            input_size=D + covariate_dim,
            hidden_size=hidden_dim,
            num_layers=n_rnn_layers,
            batch_first=True
        )

        # Noise prediction network
        self.eps_net = EpsilonNet(D=D, hidden_dim=hidden_dim, channels=channels,
                                   n_blocks=n_blocks)

        # Beta schedule
        betas = make_beta_schedule(N=N)
        alphas, alpha_bars = compute_alphas(betas)
        self.register_buffer('betas', betas)
        self.register_buffer('alphas', alphas)
        self.register_buffer('alpha_bars', alpha_bars)

    def encode_history(self, x_history: torch.Tensor, c_history: torch.Tensor) -> torch.Tensor:
        """
        Run RNN over history. Returns final hidden state.
        Args:
            x_history: [B, T, D]
            c_history: [B, T, covariate_dim]
        Returns:
            h_T: [B, hidden_dim]
        """
        rnn_input = torch.cat([x_history, c_history], dim=-1)  # [B, T, D + cov_dim]
        _, (h_n, _) = self.rnn(rnn_input)
        # h_n: [n_layers, B, hidden_dim] → 마지막 layer 만
        return h_n[-1]  # [B, hidden_dim]

    def training_step(self, x_t: torch.Tensor, h_prev: torch.Tensor) -> torch.Tensor:
        """
        Algorithm 1 — one training step.
        Args:
            x_t: [B, D] — clean data at time t
            h_prev: [B, hidden_dim] — RNN hidden state h_{t-1}
        Returns:
            loss: scalar
        """
        B = x_t.size(0)
        # Random n ~ Uniform(1, N)
        n = torch.randint(0, self.N, (B,), device=x_t.device)
        # Random ε
        epsilon = torch.randn_like(x_t)
        # Compute x^n_t = √āⁿ x^0_t + √(1-āⁿ) ε
        alpha_bar_n = self.alpha_bars[n].unsqueeze(-1)       # [B, 1]
        x_n = torch.sqrt(alpha_bar_n) * x_t + torch.sqrt(1 - alpha_bar_n) * epsilon
        # Noise prediction
        eps_pred = self.eps_net(x_n, h_prev, n)              # [B, D]
        # MSE loss
        return F.mse_loss(eps_pred, epsilon)

    @torch.no_grad()
    def sample_step(self, h_prev: torch.Tensor) -> torch.Tensor:
        """
        Algorithm 2 — sample x^0_t via annealed Langevin.
        Args:
            h_prev: [B, hidden_dim] — RNN hidden state
        Returns:
            x_0: [B, D]
        """
        B = h_prev.size(0)
        # Start from pure noise
        x = torch.randn(B, self.D, device=h_prev.device)
        for n_step in reversed(range(self.N)):
            n = torch.full((B,), n_step, device=h_prev.device, dtype=torch.long)
            alpha = self.alphas[n_step]
            alpha_bar = self.alpha_bars[n_step]
            beta = self.betas[n_step]
            # Predict noise
            eps_pred = self.eps_net(x, h_prev, n)
            # Compute mean
            mean = (1 / torch.sqrt(alpha)) * (x - beta / torch.sqrt(1 - alpha_bar) * eps_pred)
            # Langevin noise (z = 0 if n_step == 0)
            if n_step > 0:
                z = torch.randn_like(x)
                # Variance Σ_θ = β̃_n (Eq 5)
                if n_step == self.N - 1:
                    sigma = torch.sqrt(beta)
                else:
                    alpha_bar_prev = self.alpha_bars[n_step - 1]
                    sigma_squared = (1 - alpha_bar_prev) / (1 - alpha_bar) * beta
                    sigma = torch.sqrt(sigma_squared)
                x = mean + sigma * z
            else:
                x = mean
        return x  # x^0_t

    def update_hidden(self, x_t: torch.Tensor, c_t: torch.Tensor,
                     h_prev: torch.Tensor) -> torch.Tensor:
        """
        Update RNN hidden state (Eq 9).
        Args:
            x_t: [B, D]
            c_t: [B, covariate_dim]
            h_prev: [B, hidden_dim]
        Returns:
            h_t: [B, hidden_dim]
        """
        rnn_input = torch.cat([x_t, c_t], dim=-1).unsqueeze(1)  # [B, 1, D + cov_dim]
        # Use h_prev as initial state
        h0 = h_prev.unsqueeze(0).expand(2, -1, -1).contiguous()  # [n_layers, B, hidden_dim]
        c0 = torch.zeros_like(h0)
        _, (h_n, _) = self.rnn(rnn_input, (h0, c0))
        return h_n[-1]
```

---

## 6. Training + Inference Loops

```python
def train_step(model: TimeGrad, batch: dict, optimizer):
    """
    Algorithm 1 — train loop over prediction window.
    """
    x_context = batch['context']              # [B, T_context, D]
    x_pred = batch['prediction']               # [B, T_pred, D]
    c_context = batch['c_context']             # [B, T_context, cov_dim]
    c_pred = batch['c_prediction']             # [B, T_pred, cov_dim]

    # Encode context
    h = model.encode_history(x_context, c_context)  # [B, hidden_dim]
    
    total_loss = 0.0
    T_pred = x_pred.size(1)
    for t in range(T_pred):
        x_t = x_pred[:, t, :]                        # [B, D]
        c_t = c_pred[:, t, :]                        # [B, cov_dim]
        loss_t = model.training_step(x_t, h)
        total_loss = total_loss + loss_t
        # Update hidden for next step
        h = model.update_hidden(x_t, c_t, h)

    avg_loss = total_loss / T_pred
    optimizer.zero_grad()
    avg_loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    return avg_loss.item()


@torch.no_grad()
def sample(model: TimeGrad, batch: dict, n_samples: int = 100, horizon: int = 24):
    """
    Algorithm 2 sampling — autoregressive prediction.
    Returns: [n_samples, B, horizon, D]
    """
    x_context = batch['context']
    c_context = batch['c_context']
    c_pred = batch['c_prediction']
    
    B = x_context.size(0)
    samples = []
    for _ in range(n_samples):
        h = model.encode_history(x_context, c_context)
        x_trajectory = []
        for t in range(horizon):
            # Sample x^0_t via Algorithm 2
            x_t = model.sample_step(h)
            x_trajectory.append(x_t)
            # Update h for next step
            c_t = c_pred[:, t, :]
            h = model.update_hidden(x_t, c_t, h)
        samples.append(torch.stack(x_trajectory, dim=1))  # [B, horizon, D]
    return torch.stack(samples, dim=0)  # [n_samples, B, horizon, D]
```

---

## 7. CRPS_sum 평가

```python
def crps_sum(samples: torch.Tensor, ground_truth: torch.Tensor) -> torch.Tensor:
    """
    Empirical CRPS_sum (paper Section 4.1).
    Args:
        samples: [n_samples, B, horizon, D]
        ground_truth: [B, horizon, D]
    Returns:
        crps: scalar
    """
    # Sum across D dimensions
    samples_sum = samples.sum(dim=-1)              # [n_samples, B, horizon]
    truth_sum = ground_truth.sum(dim=-1)            # [B, horizon]
    
    # Empirical CRPS via sample-based formula
    # CRPS = mean(|X - y|) - 0.5 * mean(|X - X'|)
    # X, X' = i.i.d. samples; y = truth
    n_samples = samples.size(0)
    abs_diff_truth = (samples_sum - truth_sum.unsqueeze(0)).abs().mean(dim=0)  # [B, horizon]
    
    # Pairwise sample differences (memory-friendly)
    # |X_i - X_j| for i < j
    pairwise_diff_sum = 0
    n_pairs = 0
    for i in range(n_samples - 1):
        for j in range(i + 1, n_samples):
            pairwise_diff_sum = pairwise_diff_sum + (samples_sum[i] - samples_sum[j]).abs()
            n_pairs += 1
    pairwise_diff_avg = pairwise_diff_sum / n_pairs  # [B, horizon]
    
    crps_per_step = abs_diff_truth - 0.5 * pairwise_diff_avg
    return crps_per_step.mean()
```

---

## 8. Hyperparameters (paper Section 4.2)

| Param | Value | Source |
|-------|-------|--------|
| $N$ | 100 | paper p.5 |
| $\beta_1$ | $10^{-4}$ | paper p.5 |
| $\beta_N$ | $0.1$ | paper p.5 |
| RNN hidden | 40 | paper p.5 |
| RNN layers | 2 | paper p.5 |
| RNN type | LSTM | paper p.5 |
| Residual blocks | 8 | paper Fig 2 |
| Residual channels | 8 | paper Fig 2 |
| Noise emb dim | 32 | paper Fig 2 |
| Noise emb max | 500 | paper Fig 2 |
| Dilation | $2^{i \mod 2}$ | paper Fig 2 |
| Optimizer | Adam | paper p.5 |
| LR | $10^{-3}$ | paper p.5 |
| Batch | 64 | paper p.5 |
| Samples $S$ | 100 | paper p.5 |

---

## 8b. 인터랙티브 — 학습 Loss Trajectory

```viz:tg-loss-trajectory:title=학습 4 단계 Loss Trajectory,caption=Highlight 셀렉터로 4 phases 강조. Phase 1 (0-15 epoch): 평균 fit — Loss 1.0→0.5 급락. Phase 2 (15-40): 분산 fit — Loss 0.5→0.25. Phase 3 (40-70): 다중 모드 학습 — 0.25→0.12. Phase 4 (70-100): refine — 0.12→0.09. 각 phase 의 transition 이 noise prediction 의 다른 측면 학습.
```

---

## 9. 재현 시 주의

1. **Variance schedule**: paper 가 linear schedule 명시. cosine schedule (Nichol-Dhariwal 2021) 시도 가능 — 가속.
2. **Σ_θ choice**: paper 가 $\Sigma_\theta = \tilde\beta_n$ (Eq 5) 사용. $\Sigma_\theta = \beta_n$ 대안도 있음 (Ho 2020 Appendix).
3. **Skip connection sum**: paper Fig 2 가 "skip-connection outputs are summed up" 명시 — 모든 8 blocks 의 skip 누적.
4. **Time embedding**: paper Section 3.4 의 categorical embedding + lag features 미구현 (단순화). Production 에는 추가.
5. **Multi-scale dataset**: Scaling (Section 3.3) 본 코드 미포함. Per-entity mean 으로 normalize 후 학습 권장.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **`training_step` 의 `n = torch.randint(0, N)` random sampling 이 학습에 결정적인 이유는?**
2. **`sample_step` 의 `if n_step > 0: z = randn; else: z = 0` — 마지막 step 의 deterministic 이유는?**
3. **EpsilonNet 의 skip connection sum vs residual sum 의 역할 차이는?**

### 답변

1. **Importance sampling 의 unbiased estimator**. 모든 $n \in [1, N]$ 의 학습이 필요하지만 한 step 에 다 forward 면 batch $\times N$ 부담. **Random $n$**: 매 step random pick → expectation 으로 모든 $n$ 학습 — Ho 2020 의 핵심 trick. Reparameterization $\mathbf{x}^n = \sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon$ + random $\epsilon$ 으로 1 forward pass 로 학습.
2. **Reverse process 의 마지막 step**: $\mathbf{x}^1 \to \mathbf{x}^0$. $\mathbf{x}^0$ 가 final clean output 이어야 — Langevin noise 추가 시 noisy. 다른 step ($n \geq 1$) 은 다음 step 에서 다시 denoising → noise OK. 마지막 step 만 pure deterministic prediction 으로 마무리.
3. **Residual sum** (within each block): gradient flow + deep network 학습 안정. ResNet (He 2016) 의 표준. **Skip connection sum** (across all 8 blocks): multi-scale features 통합 — block 0 (dilation 1, local feature) + block 7 (dilation 더 큼, larger feature) 의 정보 종합. WaveNet/DiffWave 의 표준 architecture choice.

다음 [15_diagrams.md](15_diagrams.md) — ASCII 도식 + viz 카탈로그.
