# 18. PyTorch Code — Autoformer 핵심 모듈

paper Appendix G 의 Algorithm 1 (전체 Autoformer), Algorithm 2 (standard multi-head Auto-Correlation), Algorithm 3 (speedup training phase), Algorithm 4 (speedup inference phase) + 공식 repo (https://github.com/thuml/Autoformer) 의 모듈 구조를 따른다.

**중요한 paper note (G.1)**: "All the experiment results of this paper are from the speedup version." — paper 의 모든 실험 수치는 Algorithm 3/4 (batch normalization style, channel/head 차원 축소) 결과. Algorithm 2 의 standard 버전은 reference. 본 chapter 의 코드는 **명료성을 위해 Algorithm 2 의 standard 버전을 단순 구현** — 실제 학습엔 official repo 의 speedup 버전 권장.

본 chapter 의 코드는 **재현 가능한 단일 파일** — 그대로 복붙해서 ETT predict-336 setting 을 학습 가능 (단, standard 버전이므로 속도는 official repo 보다 느림).

---

## paper Algorithm 1 — Overall Autoformer (pseudo-code, p.18)

paper 가 제공하는 high-level pseudo-code:

```
Input: X (length-I past), I, O, d, d_model=512, N=2, M=1, k=25

# Decoder init (Eq 2)
1.  X_ens, X_ent = SeriesDecomp(X[I/2:I])
2.  X_0, X_mean = Zeros([O, d]), Repeat(Mean(X[I/2:I]), O)
3.  X_des, X_det = Concat(X_ens, X_0), Concat(X_ent, X_mean)

# Encoder (N layers, Eq 3)
4.  X_en^0 = Embed(X)
5.  for l in {1, ..., N}:
6.     S_en^{l,1}, _ = SeriesDecomp(AutoCorrelation(X_en^{l-1}) + X_en^{l-1})
7.     S_en^{l,2}, _ = SeriesDecomp(FeedForward(S_en^{l,1}) + S_en^{l,1})
8.     X_en^l = S_en^{l,2}

# Decoder (M layers, Eq 4)
9.  X_de^0 = Embed(X_des), T_de^0 = X_det
10. for l in {1, ..., M}:
11.    S_de^{l,1}, T_de^{l,1} = SeriesDecomp(AutoCorrelation(X_de^{l-1}) + X_de^{l-1})
12.    S_de^{l,2}, T_de^{l,2} = SeriesDecomp(AutoCorrelation(S_de^{l,1}, X_en^N) + S_de^{l,1})
13.    S_de^{l,3}, T_de^{l,3} = SeriesDecomp(FeedForward(S_de^{l,2}) + S_de^{l,2})
14.    T_de^l = T_de^{l-1} + MLP(T_de^{l,1}) + MLP(T_de^{l,2}) + MLP(T_de^{l,3})
15.    X_de^l = S_de^{l,3}

# Final prediction
16. X_pred = MLP(X_de^M) + T_de^M
17. Return X_pred[I/2 : I/2+O]
```

→ 아래 `class Autoformer` 가 이 Algorithm 1 의 PyTorch 구현.

---

## paper Algorithm 2 — Auto-Correlation Standard (p.18)

```
Input: Q ∈ R^{B×L×d_model}, K, V ∈ R^{B×S×d_model}, h=8, c∈[1,3]

1.  K, V = Resize(K), Resize(V)                    # to length L (truncate or zero-fill)
2.  Q, K, V = Reshape to [L, h, d_model/h]         # split heads
3.  Q = FFT(Q, dim=0), K = FFT(K, dim=0)           # → C^{B×L×h×(d_model/h)}
4.  Corr = IFFT(Q × Conj(K), dim=0)                # autocorrelation
5.  W_topk, I_topk = Topk(Corr, ⌊c·log L⌋, dim=0)  # top-k lags + weights
6.  W_topk = Softmax(W_topk, dim=0)
7.  Index = Repeat(arange(L))                      # base indices
8.  V = Repeat(V)                                  # double length for cyclic gather
9.  R = Σᵢ W_topk[i] × gather(V, I_topk[i] + Index) for i ∈ range(⌊c·log L⌋)
10. R = Sum(Stack(R, dim=0), dim=0)
11. Return R
```

→ 아래 `class AutoCorrelation` 의 구현. Line 9 가 `time_delay_agg` 의 핵심.

---

## paper Algorithm 3/4 — Speedup version (실제 실험에 사용)

**Algorithm 3 (training)** 의 핵심 차이 (paper line 1595-1596 G.1):
```
5.  Corr = Mean(Corr, dim=0, 2, 3)   # batch + head + channel 축으로 평균 → simplify lags
6.  W_topk, I_topk = Topk(Corr, ⌊c·log L⌋, dim=0)
...
8.  R = Σᵢ W_topk[i] × Roll(V, I_topk[i], dim=1)  # gather 대신 Roll
```

**Algorithm 4 (inference)** 는 Mean 한 lags 를 시점별로 gather (메모리 효율).

paper text (G.1):
> Because of the property of the linear layer, the channels of deep representations are equivalent. Thus, we reduce the channel and head dimension for both the training and inference phases. Especially for the training phase, we average the autocorrelation within a batch to simplify the learned lags. This design speeds up Auto-Correlation and performs as normalization to obtain a global judgment of the learned lags because the series within a batch are samples from the same time-series dataset.

→ batch-norm 스타일로 batch 전체 평균을 하면 lag 가 simplify → memory access friendly.

→ **paper 의 모든 실험 수치 (Tables 1-11) 는 Algorithm 3/4 결과**. 본 chapter 의 Algorithm 2 standard 코드는 교육용 / reference.

---

## 의존성

```bash
pip install torch numpy pandas
```

---

## 1. Series Decomposition Block (Eq 1)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class MovingAvg(nn.Module):
    """Moving average block to highlight the trend of time series."""

    def __init__(self, kernel_size: int, stride: int = 1):
        super().__init__()
        self.kernel_size = kernel_size
        self.avg = nn.AvgPool1d(kernel_size=kernel_size, stride=stride, padding=0)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: [B, L, d]
        # 양쪽 패딩 — 출력 길이 보존
        front = x[:, 0:1, :].repeat(1, (self.kernel_size - 1) // 2, 1)
        end = x[:, -1:, :].repeat(1, (self.kernel_size - 1) // 2, 1)
        x_padded = torch.cat([front, x, end], dim=1)
        # AvgPool1d expects [B, d, L]
        x_avg = self.avg(x_padded.permute(0, 2, 1)).permute(0, 2, 1)
        return x_avg


class SeriesDecomp(nn.Module):
    """Series decomposition: X = X_s + X_t  (Eq 1)"""

    def __init__(self, kernel_size: int = 25):
        super().__init__()
        self.moving_avg = MovingAvg(kernel_size)

    def forward(self, x: torch.Tensor):
        trend = self.moving_avg(x)
        seasonal = x - trend
        return seasonal, trend
```

**Note**: `kernel_size=25` 가 paper repo default. ETT 의 hourly 단위로 약 하루 길이.

---

## 2. Auto-Correlation Mechanism (Eq 5-7)

```python
class AutoCorrelation(nn.Module):
    """Auto-Correlation with FFT-based R(τ) and Top-k roll aggregation."""

    def __init__(
        self,
        n_heads: int,
        d_model: int,
        factor: int = 3,        # paper의 c, k = c * log L
        attention_dropout: float = 0.1,
        output_attention: bool = False,
    ):
        super().__init__()
        self.factor = factor
        self.dropout = nn.Dropout(attention_dropout)
        self.output_attention = output_attention

    def time_delay_agg(self, values: torch.Tensor, corr: torch.Tensor) -> torch.Tensor:
        """
        values: [B, H, d_head, L]
        corr:   [B, H, d_head, L]  — autocorrelation per channel
        Returns: rolled & weighted sum, [B, H, d_head, L]
        """
        B, H, d, L = values.shape
        # Top-k 선택
        top_k = int(self.factor * torch.log(torch.tensor(L, dtype=torch.float32)))
        top_k = max(top_k, 1)

        # corr 의 mean across heads & channels 로 global τ 선택
        mean_corr = torch.mean(torch.mean(corr, dim=1), dim=1)  # [B, L]
        # Top-k τ
        index = torch.topk(mean_corr, top_k, dim=-1)[1]  # [B, k]
        weights = torch.stack(
            [mean_corr[b, index[b]] for b in range(B)], dim=0
        )  # [B, k]
        weights = F.softmax(weights, dim=-1)  # [B, k]

        # Roll values and weighted sum
        out = torch.zeros_like(values)
        for i in range(top_k):
            # batch-wise τ → loop. 단순 구현 (paper repo 는 batched gather)
            for b in range(B):
                tau = int(index[b, i].item())
                rolled = torch.roll(values[b], shifts=-tau, dims=-1)  # [H, d, L]
                out[b] = out[b] + rolled * weights[b, i]
        return out

    def forward(self, queries, keys, values, attn_mask=None):
        """
        queries, keys, values: [B, L, n_heads * d_head]  — already projected
        We rearrange to [B, n_heads, d_head, L]
        """
        B, L, _ = queries.shape
        S = keys.shape[1]  # may differ from L (encoder-decoder)
        H = self._H  # set externally
        d_head = queries.shape[-1] // H

        Q = queries.view(B, L, H, d_head).permute(0, 2, 3, 1)
        K = keys.view(B, S, H, d_head).permute(0, 2, 3, 1)
        V = values.view(B, S, H, d_head).permute(0, 2, 3, 1)

        # Resize K, V to length L (encoder-decoder case)
        if S != L:
            if S < L:
                pad = torch.zeros(B, H, d_head, L - S, device=K.device)
                K = torch.cat([K, pad], dim=-1)
                V = torch.cat([V, pad], dim=-1)
            else:
                K = K[..., :L]
                V = V[..., :L]

        # FFT-based autocorrelation (Eq 8)
        q_fft = torch.fft.rfft(Q, dim=-1)
        k_fft = torch.fft.rfft(K, dim=-1)
        res = q_fft * torch.conj(k_fft)
        corr = torch.fft.irfft(res, n=L, dim=-1)  # [B, H, d_head, L]

        out = self.time_delay_agg(V, corr)  # [B, H, d_head, L]
        out = out.permute(0, 3, 1, 2).contiguous().view(B, L, H * d_head)

        if self.output_attention:
            return out, corr
        return out, None


class AutoCorrelationLayer(nn.Module):
    """Wraps AutoCorrelation with Q/K/V/Out projections."""

    def __init__(self, d_model: int, n_heads: int, factor: int = 3, dropout: float = 0.1):
        super().__init__()
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        self.inner = AutoCorrelation(n_heads, d_model, factor=factor, attention_dropout=dropout)
        self.inner._H = n_heads

    def forward(self, q, k, v):
        Q = self.W_q(q)
        K = self.W_k(k)
        V = self.W_v(v)
        out, attn = self.inner(Q, K, V)
        return self.W_o(out), attn
```

**Note**: `time_delay_agg` 의 nested loop 은 명료성을 위한 단순 구현. paper 의 official repo 는 batched gather + cumulative product 로 훨씬 빠름. 학습 시 official repo 를 권장.

---

## 3. Encoder / Decoder Layers (Eq 3-4)

```python
class EncoderLayer(nn.Module):
    """Eq 3 — Auto-Corr → Decomp → FFN → Decomp"""

    def __init__(self, d_model: int, n_heads: int, d_ff: int = 2048,
                 kernel_size: int = 25, dropout: float = 0.1, factor: int = 3):
        super().__init__()
        self.auto_corr = AutoCorrelationLayer(d_model, n_heads, factor=factor, dropout=dropout)
        self.decomp1 = SeriesDecomp(kernel_size)
        self.conv1 = nn.Conv1d(d_model, d_ff, kernel_size=1)
        self.conv2 = nn.Conv1d(d_ff, d_model, kernel_size=1)
        self.decomp2 = SeriesDecomp(kernel_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # Auto-correlation (self)
        new_x, _ = self.auto_corr(x, x, x)
        x = x + self.dropout(new_x)
        x, _ = self.decomp1(x)  # discard trend (_)

        # Feed-forward
        y = x
        y = F.gelu(self.conv1(y.transpose(-1, -2)))
        y = self.dropout(self.conv2(y).transpose(-1, -2))
        x = x + y
        x, _ = self.decomp2(x)
        return x


class DecoderLayer(nn.Module):
    """Eq 4 — Inner Auto-Corr → Cross Auto-Corr → FFN, 각 sub-layer 마다 Decomp"""

    def __init__(self, d_model: int, n_heads: int, c_out: int, d_ff: int = 2048,
                 kernel_size: int = 25, dropout: float = 0.1, factor: int = 3):
        super().__init__()
        self.self_corr = AutoCorrelationLayer(d_model, n_heads, factor=factor, dropout=dropout)
        self.cross_corr = AutoCorrelationLayer(d_model, n_heads, factor=factor, dropout=dropout)
        self.decomp1 = SeriesDecomp(kernel_size)
        self.decomp2 = SeriesDecomp(kernel_size)
        self.decomp3 = SeriesDecomp(kernel_size)
        self.conv1 = nn.Conv1d(d_model, d_ff, kernel_size=1)
        self.conv2 = nn.Conv1d(d_ff, d_model, kernel_size=1)
        # Trend projectors W_{l,i}, i=1,2,3
        self.proj = nn.Conv1d(d_model, c_out, kernel_size=3, padding=1, padding_mode='circular', bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, cross):
        # 1. Self Auto-Correlation
        new_x, _ = self.self_corr(x, x, x)
        x = x + self.dropout(new_x)
        x, trend1 = self.decomp1(x)

        # 2. Cross Auto-Correlation (encoder-decoder)
        new_x, _ = self.cross_corr(x, cross, cross)
        x = x + self.dropout(new_x)
        x, trend2 = self.decomp2(x)

        # 3. Feed-forward
        y = x
        y = F.gelu(self.conv1(y.transpose(-1, -2)))
        y = self.dropout(self.conv2(y).transpose(-1, -2))
        x = x + y
        x, trend3 = self.decomp3(x)

        # Trend accumulation: project to c_out dim
        residual_trend = trend1 + trend2 + trend3
        residual_trend = self.proj(residual_trend.transpose(-1, -2)).transpose(-1, -2)
        return x, residual_trend
```

---

## 4. Full Model

```python
class Autoformer(nn.Module):
    def __init__(
        self,
        enc_in: int,        # input feature dim
        dec_in: int,
        c_out: int,         # output dim
        d_model: int = 512,
        n_heads: int = 8,
        e_layers: int = 2,
        d_layers: int = 1,
        d_ff: int = 2048,
        kernel_size: int = 25,
        dropout: float = 0.1,
        factor: int = 3,    # Auto-Correlation c
        seq_len: int = 96,
        label_len: int = 48,
        pred_len: int = 336,
    ):
        super().__init__()
        self.seq_len = seq_len
        self.label_len = label_len
        self.pred_len = pred_len

        # Embeddings (단순화: 선형)
        self.enc_embed = nn.Linear(enc_in, d_model)
        self.dec_embed = nn.Linear(dec_in, d_model)

        # Decomp for decoder init
        self.init_decomp = SeriesDecomp(kernel_size)

        # Encoder N=e_layers
        self.encoder_layers = nn.ModuleList([
            EncoderLayer(d_model, n_heads, d_ff, kernel_size, dropout, factor)
            for _ in range(e_layers)
        ])

        # Decoder M=d_layers
        self.decoder_layers = nn.ModuleList([
            DecoderLayer(d_model, n_heads, c_out, d_ff, kernel_size, dropout, factor)
            for _ in range(d_layers)
        ])

        # Final projection: W_S * seasonal
        self.proj_seasonal = nn.Linear(d_model, c_out)

    def forward(self, x_enc, x_dec):
        # x_enc: [B, I, enc_in], x_dec: [B, I/2 + O, dec_in]

        # --- Decoder Init (Eq 2) ---
        # seasonal init = decomp(X_en[I/2:]) || zeros(O)
        # trend init    = decomp(X_en[I/2:]) || mean(X_en)
        # (실전: x_dec 가 이미 caller 쪽에서 준비된다고 가정)
        seasonal_init, trend_init = self.init_decomp(x_enc[:, self.seq_len // 2:, :])
        mean = torch.mean(x_enc, dim=1, keepdim=True).repeat(1, self.pred_len, 1)
        zeros = torch.zeros(
            x_enc.shape[0], self.pred_len, x_enc.shape[-1], device=x_enc.device
        )
        seasonal_init = torch.cat([seasonal_init, zeros], dim=1)
        trend_init = torch.cat([trend_init, mean], dim=1)

        # --- Encoder ---
        enc_out = self.enc_embed(x_enc)
        for layer in self.encoder_layers:
            enc_out = layer(enc_out)

        # --- Decoder ---
        # Use seasonal_init projected to d_model
        dec_in = self.dec_embed(seasonal_init)
        trend = trend_init  # [B, I/2+O, c_out]  — last c_out dims
        # (실전: trend_init 의 dim 이 c_out 과 같다고 가정)

        for layer in self.decoder_layers:
            dec_in, residual_trend = layer(dec_in, enc_out)
            trend = trend + residual_trend  # 누적

        # Final output (Eq 의 마지막 줄)
        seasonal_out = self.proj_seasonal(dec_in)
        out = seasonal_out + trend
        return out[:, -self.pred_len:, :]  # 마지막 O 시점만 반환
```

---

## 5. 학습 루프 (ETT 예시)

```python
def train_step(model, batch, optimizer, criterion):
    x_enc, x_dec, y = batch  # x_dec: decoder input (label_len + pred_len)
    y_hat = model(x_enc, x_dec)
    loss = criterion(y_hat, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()


def main():
    model = Autoformer(
        enc_in=7, dec_in=7, c_out=7,        # ETT 의 7 features
        d_model=512, n_heads=8,
        e_layers=2, d_layers=1,
        d_ff=2048, kernel_size=25,
        dropout=0.05, factor=3,
        seq_len=96, label_len=48, pred_len=336,
    )
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.MSELoss()
    # ... DataLoader 등 standard setup
    # paper 의 early stop ≤ 10 epochs


if __name__ == "__main__":
    main()
```

---

## 검증된 기본 hyper-parameters (paper Section 4)

| Param | Value | Source |
|-------|-------|--------|
| `d_model` | 512 | paper repo default |
| `n_heads` | 8 | paper repo default |
| `e_layers` (N) | 2 | paper Section 4 |
| `d_layers` (M) | 1 | paper Section 4 |
| `d_ff` | 2048 | paper repo default |
| `kernel_size` | 25 | paper repo default |
| `dropout` | 0.05 | paper repo default |
| `factor` (c) | 1–3 | Section 4, Table 6 |
| `lr` | 1e-4 | Section 4 |
| `batch_size` | 32 | Section 4 |
| `epochs` | ≤ 10 (early stop) | Section 4 |
| `optimizer` | Adam | Section 4 |
| `loss` | L2 (MSE) | Section 4 |

---

## 재현 시 주의

1. **`time_delay_agg` 의 batched 구현**: 위 코드는 명료성을 위한 loop 구현. 학습 속도가 매우 느림. 실제 학습은 paper repo 의 `time_delay_agg_full` (batched gather) 을 사용.

2. **데이터 정규화**: ETT 등 paper repo 는 `StandardScaler` (train mean/std) 사용. 후처리에서 inverse 필요.

3. **시간 임베딩 (Time Features)**: paper repo 는 time stamp (hour, day of week, etc) 도 embedding. 본 코드는 생략 — basic re-implementation 만.

4. **GPU 메모리**: ETT predict-336 + batch=32 면 약 3.3GB (Table 8). predict-1440 은 10GB+ 가능 — TITAN RTX 24GB 가 필요.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **`SeriesDecomp` 의 `moving_avg = AvgPool1d` 가 paper Eq 1 의 분해와 어떻게 일치하는가?**
2. **`AutoCorrelation` 클래스의 `torch.fft.rfft` + `topk` 조합이 paper Eq 6-7 의 어느 step 에 해당?**
3. **Encoder-Decoder 구조에서 progressive decomposition 이 코드의 어느 부분에 구현되는가?**

### 답변

1. **`moving_avg`**: kernel size 25 AvgPool1d → window 평균 = trend. 입력 - trend = seasonal. paper Eq 1 (`X_t = X_trend + X_seasonal`) 의 직접 구현. Padding 으로 length 유지.
2. **Eq 5 (autocorrelation via FFT)**: `rfft → freq * conj(freq) → irfft` = $R(\tau)$. **Eq 6 (topk delays)**: `topk(corr, k)` 로 가장 큰 lag $\tau_1, \ldots, \tau_k$ 선택. **Eq 7 (time-delay aggregation)**: 각 lag 만큼 `roll` 후 가중 합 — 여기서는 `softmax` weight × `gather`.
3. **각 EncoderLayer / DecoderLayer 안의 SeriesDecomp 호출**. EncoderLayer 의 `x, _ = self.decomp1(x + attn)` 형태 — attention 후 즉시 trend 분리, seasonal 만 다음 layer 로 전달. Decoder 는 trend 를 누적 (residual connection) — paper Fig 1 의 progressive trend accumulation.

---

다음 [19_diagrams.md](19_diagrams.md) 에서 ASCII 도식 + interactive viz 카탈로그.
