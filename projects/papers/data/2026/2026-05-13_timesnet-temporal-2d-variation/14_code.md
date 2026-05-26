# 14 PyTorch Code — TimesNet 재현

> **🧒 본 챕터는 "직접 해보기"**: FFT period detection + 2D reshape + Inception block.

## 14.1 의존성

```bash
pip install torch numpy
```

## 14.2 FFT-based Period Detection

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


def FFT_for_Period(x, k=5):
    """
    x: [B, T, d] time series
    Returns: top-k periods and amplitudes
    """
    B, T, d = x.shape
    # FFT along time axis
    xf = torch.fft.rfft(x, dim=1)  # [B, T//2+1, d]
    
    # Mean amplitude across batch and channel
    frequency_list = abs(xf).mean(0).mean(-1)  # [T//2+1]
    frequency_list[0] = 0  # remove DC component
    
    # Top-k frequencies
    _, top_idx = torch.topk(frequency_list, k)
    top_idx = top_idx.detach().cpu().numpy()
    
    # Periods (note: index 0 is DC, so 1-index actually = T-period)
    periods = T // top_idx  # period for each frequency
    
    # Amplitudes
    amplitudes = abs(xf).mean(-1)[:, top_idx]  # [B, k]
    
    return periods, amplitudes
```

## 14.3 2D Reshape + Inception Block

```python
class Inception_Block_V1(nn.Module):
    """ Multi-scale convolution """
    def __init__(self, d_in, d_out, num_kernels=6):
        super().__init__()
        self.num_kernels = num_kernels
        kernels = []
        for i in range(num_kernels):
            kernels.append(nn.Conv2d(d_in, d_out, kernel_size=2*i + 1, padding=i))
        self.kernels = nn.ModuleList(kernels)
    
    def forward(self, x):
        # x: [B, d_in, P, T//P]
        out = sum(k(x) for k in self.kernels) / self.num_kernels
        return out


class TimesBlock(nn.Module):
    def __init__(self, d_model=64, d_ff=128, top_k=5, num_kernels=6):
        super().__init__()
        self.top_k = top_k
        self.conv = nn.Sequential(
            Inception_Block_V1(d_model, d_ff, num_kernels),
            nn.GELU(),
            Inception_Block_V1(d_ff, d_model, num_kernels)
        )
    
    def forward(self, x):
        # x: [B, T, d]
        B, T, d = x.shape
        periods, amplitudes = FFT_for_Period(x, k=self.top_k)
        
        results = []
        for i in range(self.top_k):
            period = periods[i]
            # Pad if needed
            if T % period != 0:
                pad_size = (T // period + 1) * period - T
                padding = torch.zeros(B, pad_size, d, device=x.device)
                x_padded = torch.cat([x, padding], dim=1)
            else:
                x_padded = x
            
            T_padded = x_padded.size(1)
            # Reshape to [B, d, period, T_padded // period]
            x_2d = x_padded.permute(0, 2, 1).reshape(B, d, period, T_padded // period)
            # Apply 2D conv (Inception block)
            out = self.conv(x_2d)
            # Reshape back to [B, T_padded, d]
            out = out.reshape(B, d, T_padded).permute(0, 2, 1)
            # Cut to original length
            results.append(out[:, :T, :])
        
        # Stack: [B, T, d, top_k]
        results = torch.stack(results, dim=-1)
        # Adaptive aggregation via softmax on amplitudes
        amplitudes = F.softmax(amplitudes, dim=1)  # [B, top_k]
        amplitudes = amplitudes.unsqueeze(1).unsqueeze(1)  # [B, 1, 1, top_k]
        out = (results * amplitudes).sum(-1)  # [B, T, d]
        
        return out + x  # residual
```

## 14.4 Full TimesNet Model

```python
class TimesNet(nn.Module):
    def __init__(self, seq_len=96, pred_len=96, d_model=64, e_layers=2,
                 d_ff=128, top_k=5, num_kernels=6, n_features=7):
        super().__init__()
        self.seq_len = seq_len
        self.pred_len = pred_len
        # Embedding
        self.enc_embed = nn.Linear(n_features, d_model)
        # Stacked TimesBlocks
        self.blocks = nn.ModuleList([
            TimesBlock(d_model, d_ff, top_k, num_kernels)
            for _ in range(e_layers)
        ])
        self.norm = nn.LayerNorm(d_model)
        # Forecasting head
        self.head = nn.Linear(seq_len * d_model, pred_len * n_features)
        self.n_features = n_features
    
    def forward(self, x):
        # x: [B, seq_len, n_features]
        # Embedding
        z = self.enc_embed(x)  # [B, seq_len, d_model]
        # Stacked TimesBlocks
        for block in self.blocks:
            z = block(z)
        z = self.norm(z)
        # Flatten and forecasting head
        z = z.reshape(z.size(0), -1)  # [B, seq_len * d_model]
        out = self.head(z)
        out = out.view(z.size(0), self.pred_len, self.n_features)
        return out
```

## 14.5 Training Loop

```python
def train_timesnet(model, dataloader, num_epochs=20, lr=1e-3):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    for epoch in range(num_epochs):
        total_loss = 0
        for x, y in dataloader:
            optimizer.zero_grad()
            pred = model(x)
            loss = F.mse_loss(pred, y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch}: loss={total_loss/len(dataloader):.4f}")
```

## 14.6 Expected Output

```
TimesNet (3M params, 2 layers, 5 periods):
  ETTh1 (96-step input → 96-step forecast):
    Vanilla Transformer: MSE=0.412
    Informer: MSE=0.385
    Autoformer: MSE=0.343
    PatchTST: MSE=0.298
    TimesNet: MSE=0.265 ★

  Classification (UEA archive):
    HIVE-COTE: Acc=0.728
    PatchTST: Acc=0.738
    TimesNet: Acc=0.752 ★

  Multi-task all-around: SOTA average across 4 tasks
```

## 14.7 자기점검

### 핵심 3 가지

1. **FFT_for_Period 의 *top-k=5* 의 *parameter sensitivity*?**
2. **2D reshape 의 *pad/cut* mechanism 의 의미?**
3. **Inception 6 kernels (1×1, 3×3, ..., 11×11) 의 *receptive field*?**

### 답변

1. **k=3-5 의 sweet spot**. k=1: dominant period 1 개만 — *multi-period TS missing*. k=10+: noise frequencies 포함 — *spurious patterns*. k=5: empirical sweet spot — dominant 3-5 periods 의 *real patterns* + 일부 *robust to noise*. Paper §3 의 *ablation* 입증.

2. **Period 와 seq_len 의 *non-aligned cases* 처리**. Period P, seq_len T. T % P ≠ 0 면 *직접 reshape 불가능*. Pad with zeros to T' = ⌈T/P⌉ × P → reshape to [P, T'/P]. 처리 후 *cut to original T*. → *Any (P, T) combination* 처리 가능 — *robust implementation*.

3. **1-11 step reception field**. 6 kernels = 1×1, 3×3, 5×5, 7×7, 9×9, 11×11. In 2D reshape (period, phase) plane: 11×11 = 11-period adjacent + 11-phase adjacent. Original 1D: 11×P (period direction) + 11 (phase direction) step coverage. → *Very long receptive field* with *small effective kernel* — *efficient long-range modeling*.
