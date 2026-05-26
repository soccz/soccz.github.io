# 14 PyTorch Code — MASTER 재현

> **🧒 본 챕터는 "직접 해보기"**: Intra/Inter-stock attention + Market gating + Cross-sectional ranking loss.

## 14.1 의존성

```bash
pip install torch numpy pandas
```

## 14.2 Market-Guided Gating

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class MarketGating(nn.Module):
    """ Gate stock features by market state """
    def __init__(self, d_market, d_stock, d_hidden=64):
        super().__init__()
        self.gate_net = nn.Sequential(
            nn.Linear(d_market, d_hidden),
            nn.ReLU(),
            nn.Linear(d_hidden, d_stock),
            nn.Sigmoid()
        )
    
    def forward(self, stock_feat, market_feat):
        # stock_feat: [B, N_stock, T, d_stock]
        # market_feat: [B, T, d_market]
        gate = self.gate_net(market_feat)  # [B, T, d_stock]
        gate = gate.unsqueeze(1)  # [B, 1, T, d_stock]
        return stock_feat * gate  # element-wise gating
```

## 14.3 Intra-stock Attention (Time-wise)

```python
class IntraStockAttention(nn.Module):
    """ Self-attention along time axis for each stock """
    def __init__(self, d_model, n_heads=4, dropout=0.1):
        super().__init__()
        self.mha = nn.MultiheadAttention(d_model, n_heads, dropout, batch_first=True)
        self.norm = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_model * 2),
            nn.GELU(),
            nn.Linear(d_model * 2, d_model)
        )
        self.norm2 = nn.LayerNorm(d_model)
    
    def forward(self, x):
        # x: [B, N_stock, T, d_model]
        B, N, T, d = x.shape
        # Reshape: process each stock independently
        x_flat = x.reshape(B * N, T, d)
        attn_out, _ = self.mha(x_flat, x_flat, x_flat)
        x_flat = self.norm(x_flat + attn_out)
        x_flat = self.norm2(x_flat + self.ffn(x_flat))
        return x_flat.reshape(B, N, T, d)
```

## 14.4 Inter-stock Attention (Cross-sectional)

```python
class InterStockAttention(nn.Module):
    """ Self-attention across stocks at each time """
    def __init__(self, d_model, n_heads=4, dropout=0.1):
        super().__init__()
        self.mha = nn.MultiheadAttention(d_model, n_heads, dropout, batch_first=True)
        self.norm = nn.LayerNorm(d_model)
    
    def forward(self, x):
        # x: [B, N_stock, T, d_model]
        B, N, T, d = x.shape
        # Reshape: process each time independently
        x_flat = x.permute(0, 2, 1, 3).reshape(B * T, N, d)
        attn_out, _ = self.mha(x_flat, x_flat, x_flat)
        x_flat = self.norm(x_flat + attn_out)
        return x_flat.reshape(B, T, N, d).permute(0, 2, 1, 3)
```

## 14.5 MASTER Model

```python
class MASTER(nn.Module):
    def __init__(self, n_stock_feat=158, n_market_feat=10, d_model=128,
                 lookback=10, n_intra_layers=2, n_inter_layers=1):
        super().__init__()
        self.stock_embed = nn.Linear(n_stock_feat, d_model)
        self.market_embed = nn.Linear(n_market_feat, d_model // 2)
        
        # Market gating
        self.gating = MarketGating(d_model // 2, d_model)
        
        # Intra-stock attention layers
        self.intra_layers = nn.ModuleList([
            IntraStockAttention(d_model) for _ in range(n_intra_layers)
        ])
        
        # Inter-stock attention layers
        self.inter_layers = nn.ModuleList([
            InterStockAttention(d_model) for _ in range(n_inter_layers)
        ])
        
        # Temporal aggregation
        self.temporal_agg = nn.Linear(lookback * d_model, d_model)
        
        # Prediction head
        self.head = nn.Linear(d_model, 1)
    
    def forward(self, stock_x, market_x):
        # stock_x: [B, N_stock, T, n_stock_feat]
        # market_x: [B, T, n_market_feat]
        B, N, T, _ = stock_x.shape
        
        # Embed
        z_stock = self.stock_embed(stock_x)  # [B, N, T, d]
        z_market = self.market_embed(market_x)  # [B, T, d/2]
        
        # Market gating
        z_stock = self.gating(z_stock, z_market)  # [B, N, T, d]
        
        # Intra-stock attention
        for layer in self.intra_layers:
            z_stock = layer(z_stock)
        
        # Inter-stock attention
        for layer in self.inter_layers:
            z_stock = layer(z_stock)
        
        # Temporal aggregation: flatten time
        z_stock = z_stock.reshape(B, N, -1)  # [B, N, T*d]
        z_stock = self.temporal_agg(z_stock)  # [B, N, d]
        
        # Predict
        pred = self.head(z_stock).squeeze(-1)  # [B, N]
        return pred
```

## 14.6 Cross-sectional Ranking Loss

```python
def cross_sectional_loss(pred, target):
    """
    Pearson correlation loss per batch.
    Maximize correlation between pred and target (across stocks).
    """
    pred = pred - pred.mean(dim=1, keepdim=True)  # center across stocks
    target = target - target.mean(dim=1, keepdim=True)
    
    num = (pred * target).sum(dim=1)
    den = torch.sqrt((pred ** 2).sum(dim=1) * (target ** 2).sum(dim=1) + 1e-8)
    corr = num / den
    return -corr.mean()  # maximize correlation
```

## 14.7 Training Loop

```python
def train_master(model, dataloader, num_epochs=50, lr=1e-4):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    for epoch in range(num_epochs):
        total_loss = 0
        for stock_x, market_x, target in dataloader:
            optimizer.zero_grad()
            pred = model(stock_x, market_x)
            loss = cross_sectional_loss(pred, target)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch}: loss={total_loss/len(dataloader):.4f}")
```

## 14.8 Expected Output

```
MASTER on CSI-300 (Chinese A-share):
  Daily IC: 0.072 (LSTM baseline: 0.045)
  ICIR: 0.521 (baseline: 0.312)
  Annual return: 23.4% (baseline: 14.8%)
  Sharpe: 1.84 (baseline: 1.12)

  CSI-500: similar improvements
  CSI-800: similar
```

## 14.9 자기점검

### 핵심 3 가지

1. **Intra vs Inter attention 의 *parallel parallelization*?**
2. **Cross-sectional ranking loss 의 *Pearson correlation* 적용?**
3. **Market gating 의 *element-wise scaling* 의 information geometry?**

### 답변

1. **Reshape via permute**. Intra: `[B,N,T,d] → reshape [B*N, T, d]` → time-axis attention. Inter: `[B,N,T,d] → permute [B,T,N,d] → reshape [B*T,N,d]` → stock-axis attention. *Each operation parallelizable* across (B*N) or (B*T) dimensions. → GPU parallelism preserved.

2. **Maximize ranking correlation, not MSE**. MSE loss → 절대 가격 prediction 의 fit — but *ranking 무관*. Pearson correlation = "*pred 와 target 의 ranking 일치도*". Cross-sectional 이므로 *동일 시점 내* — *long-short portfolio* 의 *direct relevance*. *Quant standard loss*.

3. **Multiplicative regime adjustment**. Gate g ∈ [0,1]^d, feature x ∈ R^d. g ⊙ x = feature 의 *dimension-wise rescaling*. Bull market regime: g_momentum_features → 1, g_defensive → 0. Bear: opposite. → *Feature space 의 regime-conditional reshaping* — *non-linear modeling* via gating. *Sigmoid output* 이 *smooth boundary* 보장.
