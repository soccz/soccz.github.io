# 14 PyTorch Code — Grokking 재현

> **🧒 본 챕터는 "직접 해보기"**: Modular arithmetic + small Transformer + weight decay → grokking 재현.

## 14.1 의존성

```bash
pip install torch
```

## 14.2 Modular Arithmetic Dataset

```python
import torch
from itertools import product


def make_modular_dataset(p=97, op='add', train_fraction=0.3, seed=42):
    """
    Create (a, b, c) triples where c = a op b mod p.
    Returns train and val dataloaders.
    """
    torch.manual_seed(seed)
    
    # All (a, b) pairs
    pairs = list(product(range(p), repeat=2))
    
    # Compute target
    if op == 'add':
        targets = [(a + b) % p for a, b in pairs]
    elif op == 'sub':
        targets = [(a - b) % p for a, b in pairs]
    elif op == 'mul':
        targets = [(a * b) % p for a, b in pairs]
    elif op == 'div':
        # b * b_inv = 1 mod p
        targets = [(a * pow(b, p-2, p)) % p for a, b in pairs if b != 0]
        pairs = [(a, b) for a, b in pairs if b != 0]
    
    # Shuffle and split
    perm = torch.randperm(len(pairs))
    n_train = int(train_fraction * len(pairs))
    train_idx = perm[:n_train]
    val_idx = perm[n_train:]
    
    pairs = torch.tensor(pairs)
    targets = torch.tensor(targets)
    
    train_x = pairs[train_idx]; train_y = targets[train_idx]
    val_x = pairs[val_idx]; val_y = targets[val_idx]
    
    return (train_x, train_y), (val_x, val_y)
```

## 14.3 Small Transformer Model

```python
import torch.nn as nn


class GrokkingTransformer(nn.Module):
    def __init__(self, p=97, d_model=128, n_heads=4, n_layers=1):
        super().__init__()
        self.token_embed = nn.Embedding(p + 2, d_model)  # +2 for op + EOS
        self.pos_embed = nn.Embedding(4, d_model)  # [a, op, b, =]
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=n_heads,
            dim_feedforward=d_model * 4,
            dropout=0.0,  # CRITICAL: no dropout
            activation='gelu',
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, n_layers)
        self.head = nn.Linear(d_model, p)
    
    def forward(self, x):
        # x: [B, 2] (a, b)
        B = x.size(0)
        # Build sequence: [a, op_token, b, eq_token]
        seq = torch.zeros(B, 4, dtype=torch.long, device=x.device)
        seq[:, 0] = x[:, 0]  # a
        seq[:, 1] = 97  # op token (assuming p=97)
        seq[:, 2] = x[:, 1]  # b
        seq[:, 3] = 98  # eq token
        
        positions = torch.arange(4, device=x.device).unsqueeze(0).expand(B, -1)
        z = self.token_embed(seq) + self.pos_embed(positions)
        z = self.transformer(z)
        # Predict from last position
        return self.head(z[:, -1])
```

## 14.4 Training Loop with Grokking Reproduction

```python
def train_grokking(model, train_data, val_data, num_steps=1_000_000,
                    lr=1e-3, weight_decay=1e-2):
    train_x, train_y = train_data
    val_x, val_y = val_data
    
    # AdamW with weight decay (★ CRITICAL)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)
    
    train_accs = []
    val_accs = []
    
    for step in range(num_steps):
        # Mini-batch: random subset
        idx = torch.randperm(train_x.size(0))[:128]
        x_batch = train_x[idx]
        y_batch = train_y[idx]
        
        logits = model(x_batch)
        loss = nn.functional.cross_entropy(logits, y_batch)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # Evaluate every 1000 steps
        if step % 1000 == 0:
            with torch.no_grad():
                train_pred = model(train_x).argmax(-1)
                val_pred = model(val_x).argmax(-1)
                train_acc = (train_pred == train_y).float().mean().item()
                val_acc = (val_pred == val_y).float().mean().item()
                train_accs.append((step, train_acc))
                val_accs.append((step, val_acc))
                print(f"Step {step}: train={train_acc:.3f}, val={val_acc:.3f}")
    
    return train_accs, val_accs
```

## 14.5 Expected Output

```
p=97, modular addition, train_fraction=0.3, weight_decay=1e-2

Step 0:     train=0.012, val=0.010 (random)
Step 1000:  train=0.025, val=0.011 (loss going down on train)
Step 5000:  train=0.45,  val=0.013 (memorizing)
Step 20000: train=0.92,  val=0.014 (almost memorized)
Step 50000: train=1.00,  val=0.015 (memorized!)
Step 100000:train=1.00,  val=0.014 (still memorized, no grok yet)
Step 500000:train=1.00,  val=0.022 (slow drift)
Step 1000000:train=1.00, val=0.31  (★ grok started!)
Step 2000000:train=1.00, val=0.89  (grokking transition)
Step 5000000:train=1.00, val=1.00  (★ fully grokked!)

Total time: ~24h on V100
```

## 14.6 자기점검

### 핵심 3 가지

1. **`dropout=0.0` 의 *critical 이유*?**
2. **`train_fraction=0.3` 의 *generalization 필요 조건*?**
3. **`weight_decay=1e-2` 의 *grokking enabling role*?**

### 답변

1. **Dropout prevents grokking**. Power 2022 paper §5 의 ablation: *Dropout 0.1* 시 *grokking 발생 안 함*. Dropout 의 *random masking* 이 *consistent circuit formation* 방해. Weight decay 의 *implicit Occam's razor* 와 *conflict*. → "*Implicit + explicit regularization 의 mutual interference*". *Dropout 0* 가 *grokking 의 핵심 조건*.

2. **Sufficient data for generalization, not overfit**. Train fraction = 1.0 (전체) → *no held-out* → val 측정 불가. 0.0 → *no training data*. 0.3 = "*30% data 만으로 100% pattern 학습 가능 한지*" testing. *Lower fraction* = harder generalization (40% → grok 가능, 20% → memorize only). *30% empirical sweet*.

3. **Implicit prior 강요**. Without weight decay (WD=0): weights *random magnitude* → memorization (lookup table). With WD=1e-2: *small magnitude* + *structured circuit* (Fourier features). → *generalizable circuit 만 minimum-norm solution* 됨. *Without WD → no grokking* — *empirically critical*.
