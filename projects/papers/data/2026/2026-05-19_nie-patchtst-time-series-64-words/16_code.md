# 16 PyTorch 구현

PatchTST 의 핵심 컴포넌트를 PyTorch 로.

## 1. Patching — L → P × N

```python
import torch
import torch.nn as nn


def patching(x: torch.Tensor, patch_len: int, stride: int) -> torch.Tensor:
    """
    x: (B, M, L) — batch, channels, look-back length
    patch_len P: e.g., 16
    stride S: e.g., 8
    Returns: (B, M, N, P) where N = (L - P) / S + 2
    """
    B, M, L = x.shape
    P, S = patch_len, stride

    # Pad: stride S copies of last value
    last_value = x[..., -1:]  # (B, M, 1)
    padding = last_value.repeat(1, 1, S)  # (B, M, S)
    x_padded = torch.cat([x, padding], dim=-1)  # (B, M, L+S)

    # Unfold into patches
    # x_padded.unfold(dim=-1, size=P, step=S) → (B, M, N, P)
    patches = x_padded.unfold(dimension=-1, size=P, step=S)
    return patches
```

**검증**:
- L=336, P=16, S=8 → padded length 344
- $N = (344 - 16)/8 + 1 = 42$ ✓ (paper 와 일치)

---

## 2. Instance Normalization

```python
class InstanceNorm(nn.Module):
    """
    각 instance (B, M) 의 univariate 시계열 마다 zero mean, unit std.
    RevIN 의 simplified version.
    """
    def __init__(self):
        super().__init__()
        self.mean = None
        self.std = None

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """x: (B, M, L) → normalized (B, M, L)"""
        self.mean = x.mean(dim=-1, keepdim=True)  # (B, M, 1)
        self.std = x.std(dim=-1, keepdim=True) + 1e-5
        return (x - self.mean) / self.std

    def denormalize(self, y: torch.Tensor) -> torch.Tensor:
        """y: (B, M, T) → denormalized (B, M, T)"""
        return y * self.std + self.mean
```

---

## 3. PatchTST encoder block (vanilla Transformer with BatchNorm)

```python
class EncoderBlock(nn.Module):
    """Vanilla Transformer encoder block with BatchNorm (not LayerNorm)."""
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.2):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, n_heads, dropout=dropout, batch_first=True)
        self.bn1 = nn.BatchNorm1d(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
        )
        self.bn2 = nn.BatchNorm1d(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """x: (B*M, N, D) — already flattened over channels"""
        # Self-attention + residual
        h, _ = self.attn(x, x, x)
        x = x + self.dropout(h)
        # BatchNorm: (B*M, N, D) → (B*M, D, N) for BN1d
        x = self.bn1(x.transpose(1, 2)).transpose(1, 2)
        # FFN + residual
        h = self.ffn(x)
        x = x + self.dropout(h)
        x = self.bn2(x.transpose(1, 2)).transpose(1, 2)
        return x
```

---

## 4. PatchTST 전체 모델

```python
class PatchTST(nn.Module):
    def __init__(
        self,
        n_vars: int,      # M
        seq_len: int,     # L (e.g., 336)
        pred_len: int,    # T (e.g., 96)
        patch_len: int = 16,
        stride: int = 8,
        d_model: int = 128,
        n_heads: int = 16,
        n_layers: int = 3,
        d_ff: int = 256,
        dropout: float = 0.2,
    ):
        super().__init__()
        self.n_vars = n_vars
        self.seq_len = seq_len
        self.pred_len = pred_len
        self.patch_len = patch_len
        self.stride = stride

        self.n_patches = (seq_len - patch_len) // stride + 2  # N
        
        self.instance_norm = InstanceNorm()
        
        # Patch projection: (P,) → (D,)
        self.patch_proj = nn.Linear(patch_len, d_model)
        
        # Learnable position embedding (D, N)
        self.pos_embed = nn.Parameter(torch.randn(self.n_patches, d_model) * 0.02)
        
        # Transformer encoder (3 layers)
        self.encoder = nn.ModuleList([
            EncoderBlock(d_model, n_heads, d_ff, dropout) for _ in range(n_layers)
        ])
        
        # Flatten + Linear head
        self.head = nn.Linear(d_model * self.n_patches, pred_len)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        x: (B, M, L) → output: (B, M, T)
        """
        B, M, L = x.shape
        
        # 1. Instance normalization
        x_norm = self.instance_norm(x)  # (B, M, L)
        
        # 2. Patching
        x_patches = patching(x_norm, self.patch_len, self.stride)  # (B, M, N, P)
        
        # 3. Channel-indep: flatten over channels
        x_flat = x_patches.reshape(B * M, self.n_patches, self.patch_len)  # (B*M, N, P)
        
        # 4. Linear projection + Position embedding
        x_emb = self.patch_proj(x_flat) + self.pos_embed.unsqueeze(0)  # (B*M, N, D)
        
        # 5. Transformer encoder (vanilla)
        z = x_emb
        for layer in self.encoder:
            z = layer(z)
        # z: (B*M, N, D)
        
        # 6. Flatten + Linear head
        z_flat = z.reshape(B * M, -1)  # (B*M, N*D)
        y_flat = self.head(z_flat)  # (B*M, T)
        
        # 7. Channel-indep: un-flatten
        y_norm = y_flat.reshape(B, M, self.pred_len)
        
        # 8. Denormalize
        y = self.instance_norm.denormalize(y_norm)
        
        return y
```

---

## 5. 학습 loop

```python
def train_step(model, x, y_true, optimizer):
    """
    x: (B, M, L) input
    y_true: (B, M, T) ground truth
    """
    y_pred = model(x)  # (B, M, T)
    
    # MSE loss — channel-independent average
    # L = (1/M) * sum_i || y_pred[i] - y_true[i] ||^2
    loss = ((y_pred - y_true) ** 2).mean()
    
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    
    return loss.item()


# Setup
model = PatchTST(
    n_vars=321,       # Electricity has 321 channels
    seq_len=336,
    pred_len=96,
    patch_len=16,
    stride=8,
    d_model=128,
    n_heads=16,
    n_layers=3,
)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

# Training (100 epochs typical)
for epoch in range(100):
    for x, y in dataloader:
        loss = train_step(model, x, y, optimizer)
```

---

## 6. Self-supervised pre-training (masked reconstruction)

```python
class PatchTSTSelfSup(nn.Module):
    """Pre-training variant — same encoder, different head."""
    def __init__(self, n_vars, seq_len, patch_len=12, stride=12, **kwargs):
        super().__init__()
        # Same encoder as PatchTST (re-used)
        self.encoder = ...  # build same encoder
        self.patch_len = patch_len
        
        # Reconstruction head: D → P (not T)
        self.recon_head = nn.Linear(kwargs['d_model'], patch_len)

    def forward(self, x: torch.Tensor, mask_ratio: float = 0.4):
        # 1. Patching (non-overlap, P=S=12)
        x_patches = patching(x, self.patch_len, self.patch_len)  # (B, M, N, P)
        B, M, N, P = x_patches.shape
        
        # 2. Random mask
        n_mask = int(N * mask_ratio)
        # Random patch indices
        rand = torch.rand(B, M, N, device=x.device)
        mask_idx = rand.argsort(dim=-1)[..., :n_mask]  # (B, M, n_mask)
        
        x_masked = x_patches.clone()
        # Set masked patches to zero
        for b in range(B):
            for m in range(M):
                x_masked[b, m, mask_idx[b, m]] = 0.0
        
        # 3. Forward through encoder (channel-indep flatten)
        x_flat = x_masked.reshape(B*M, N, P)
        x_emb = self.patch_proj(x_flat) + self.pos_embed
        z = self.encoder(x_emb)  # (B*M, N, D)
        
        # 4. Reconstruct patches
        x_recon = self.recon_head(z)  # (B*M, N, P)
        x_recon = x_recon.reshape(B, M, N, P)
        
        # 5. Loss only on masked patches
        loss = 0.0
        for b in range(B):
            for m in range(M):
                idx = mask_idx[b, m]
                loss = loss + ((x_recon[b, m, idx] - x_patches[b, m, idx]) ** 2).mean()
        loss = loss / (B * M)
        
        return loss
```

---

## 7. Transfer learning protocol

```python
# Stage 1: Pre-train on Electricity (321 channels)
model_pretrain = PatchTSTSelfSup(n_vars=321, seq_len=512, patch_len=12, stride=12)
for epoch in range(100):
    for x in electricity_loader:
        loss = model_pretrain(x, mask_ratio=0.4)
        ...

# Stage 2a: Linear probing on ETTh1 (7 channels)
model_ft = PatchTST(n_vars=7, seq_len=512, pred_len=96, patch_len=12, stride=12)
# Copy encoder weights (channel-indep enables this!)
model_ft.encoder.load_state_dict(model_pretrain.encoder.state_dict())
model_ft.patch_proj.load_state_dict(model_pretrain.patch_proj.state_dict())

# Freeze encoder
for p in model_ft.encoder.parameters():
    p.requires_grad = False
for p in model_ft.patch_proj.parameters():
    p.requires_grad = False
# Only train head

# Stage 2b: End-to-end fine-tuning
# Unfreeze all and continue
for p in model_ft.parameters():
    p.requires_grad = True
```

→ **Channel-indep 덕분에 321 channel 의 weight 를 7 channel 모델로 transfer 가능**.

---

## 8. Padding trick — 끝부분 처리

paper p.3:
> we pad $S$ repeated numbers of the last value $x_L^{(i)} \in \mathbb{R}$ to the end of the original sequence before patching.

```python
# 이미 patching() 함수 안에 구현됨:
last_value = x[..., -1:]              # (B, M, 1)
padding = last_value.repeat(1, 1, S)  # (B, M, S)
x_padded = torch.cat([x, padding], dim=-1)
```

**이유**: 마지막 timestep 도 마지막 patch 에 포함되어야 함. Zero pad 가 아닌 last-value pad — 패딩이 의미 가짐.

---

## 9. Practical tips

1. **Look-back window L**: 큰 dataset 은 L=512 (/64), 작은 dataset 은 L=336 (/42)
2. **Patch length P**: P=16 default, P=4~40 모두 robust
3. **Stride S**: P=2S overlap 권장 (supervised). Self-sup 는 S=P
4. **Mask ratio**: 40% 가 default, 25-50% 모두 작동
5. **Instance Norm**: 거의 항상 도움. Default 로 사용
6. **Batch size**: 32-128, GPU 메모리 따라
7. **Epoch**: 100 ~ 200 (large dataset 은 더 적게 가능)

---

## 10. 공식 구현 link

paper 의 공식 implementation: https://github.com/yuqinie98/PatchTST

본 구현은 paper 의 정신을 단순화한 버전. 실제 fine details (random seed, learning rate scheduler) 는 공식 repo 참조.

다음 [17_diagrams.md](17_diagrams.md) 에서 ASCII diagrams + viz catalog.
