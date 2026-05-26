# 14 PyTorch Code — Grokked Transformer 재현

> **🧒 본 챕터는 "직접 해보기"**: paper 의 official code 는 *unannounced*. 본 챕터는 *minimal* 재현 — Composition / Comparison task setup + Grokking training loop + Logit Lens + Causal Tracing.

## 14.1 의존성

```bash
pip install torch numpy pandas einops transformer_lens
```

`transformer_lens` (Nanda 의 mechanistic interpretability 라이브러리) — Logit Lens / Causal Tracing 의 *표준 도구*.

## 14.2 Task Generation

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import random


class CompositionTask:
    """
    paper §3.1: A → B, B → C 의 transitive composition
    """
    def __init__(self, N_entities=2000, N_relations=200):
        self.N = N_entities
        self.K = N_relations
        # Random graph: 각 (entity, relation) → unique target entity
        self.graph = {}  # (e_i, r_k) → e_j
        for e_i in range(N_entities):
            for r_k in range(N_relations):
                self.graph[(e_i, r_k)] = random.randint(0, N_entities-1)

    def gen_2hop(self, e_a, r1, r2):
        """ A → r1 → B → r2 → C 의 2-hop """
        e_b = self.graph[(e_a, r1)]
        e_c = self.graph[(e_b, r2)]
        return e_a, r1, r2, e_c  # input: (a, r1, r2), target: c


class ComparisonTask:
    """
    paper §3.2: attr(A) > attr(B) 의 binary comparison
    """
    def __init__(self, N_entities=2000, N_attributes=100):
        self.N = N_entities
        self.M = N_attributes
        # Random attribute matrix: entity × attribute → continuous value
        self.attrs = torch.randn(N_entities, N_attributes)

    def gen_compare(self, e_a, e_b, attr_k):
        """ attr_k 에서 A > B? """
        return e_a, e_b, attr_k, int(self.attrs[e_a, attr_k] > self.attrs[e_b, attr_k])
```

## 14.3 Transformer Model

```python
class GrokkingTransformer(nn.Module):
    """
    paper §3.3: standard transformer encoder-only
    """
    def __init__(self, vocab_size, d_model=128, n_heads=4, n_layers=8, max_len=16):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos = nn.Parameter(torch.randn(max_len, d_model))
        encoder_layer = nn.TransformerEncoderLayer(d_model, n_heads, dim_feedforward=4*d_model, batch_first=True)
        self.encoder = nn.TransformerEncoder(encoder_layer, n_layers)
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        # x: [B, T] token ids
        h = self.embedding(x) + self.pos[:x.shape[1]]
        h = self.encoder(h)
        # Use last position for prediction
        return self.head(h[:, -1])
```

## 14.4 Grokking Training Loop

```python
def train_grokking(model, train_loader, val_id_loader, val_ood_loader,
                   total_steps=10_000_000, weight_decay=1e-2, lr=1e-3):
    """
    paper §5: weight decay critical for grokking transition.
    Train accuracy 100% 도달 후 추가 학습 = grokking.
    """
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)
    
    history = {'train_acc': [], 'val_id_acc': [], 'val_ood_acc': [], 'step': []}
    
    for step in range(total_steps):
        model.train()
        x, y = next(iter(train_loader))
        logits = model(x)
        loss = F.cross_entropy(logits, y)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        if step % 1000 == 0:
            model.eval()
            with torch.no_grad():
                # Train accuracy
                train_acc = (model(x).argmax(-1) == y).float().mean().item()
                # ID + OOD test accuracy
                val_id_acc = evaluate(model, val_id_loader)
                val_ood_acc = evaluate(model, val_ood_loader)
            
            history['step'].append(step)
            history['train_acc'].append(train_acc)
            history['val_id_acc'].append(val_id_acc)
            history['val_ood_acc'].append(val_ood_acc)
            
            print(f"Step {step}: train={train_acc:.3f}, val_id={val_id_acc:.3f}, val_ood={val_ood_acc:.3f}")
            
            # Grokking transition detection
            if train_acc > 0.99 and val_ood_acc > 0.95:
                print("★ GROKKED!")
    
    return history


def evaluate(model, loader):
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for x, y in loader:
            pred = model(x).argmax(-1)
            correct += (pred == y).sum().item()
            total += y.size(0)
    return correct / total
```

## 14.5 Logit Lens (Layer-wise prediction)

```python
def logit_lens(model, x, target_y):
    """
    paper §4.1: 각 layer 의 hidden state → unembed → 예측 분포
    """
    h = model.embedding(x) + model.pos[:x.shape[1]]
    layer_predictions = []
    
    for layer in model.encoder.layers:
        h = layer(h)
        # Unembed to get layer-wise prediction
        logits = model.head(h[:, -1])  # last position
        pred = logits.argmax(-1)
        target_logit = logits.gather(-1, target_y.unsqueeze(-1)).squeeze(-1)
        layer_predictions.append({
            'pred': pred,
            'target_logit': target_logit,
            'correct': (pred == target_y).float().mean().item()
        })
    
    return layer_predictions
```

## 14.6 Causal Tracing (ROME-style)

```python
def causal_tracing(model, x_clean, x_corrupt, target_y, layer_idx, pos_idx):
    """
    paper §4.2: clean run 의 activation 을 corrupt run 에 복사 → effect 측정
    """
    # Clean run
    h_clean = model.embedding(x_clean) + model.pos[:x_clean.shape[1]]
    clean_activations = []
    for layer in model.encoder.layers:
        h_clean = layer(h_clean)
        clean_activations.append(h_clean.clone())
    clean_logit = model.head(h_clean[:, -1]).gather(-1, target_y.unsqueeze(-1)).item()
    
    # Corrupt run with one activation patched
    h_corrupt = model.embedding(x_corrupt) + model.pos[:x_corrupt.shape[1]]
    for i, layer in enumerate(model.encoder.layers):
        h_corrupt = layer(h_corrupt)
        if i == layer_idx:
            # Patch: replace position pos_idx with clean
            h_corrupt[:, pos_idx, :] = clean_activations[i][:, pos_idx, :]
    
    patched_logit = model.head(h_corrupt[:, -1]).gather(-1, target_y.unsqueeze(-1)).item()
    
    # Causal effect = how much clean activation restores target prediction
    return (patched_logit - clean_logit) / clean_logit  # relative effect
```

## 14.7 Expected Results

```
Composition task (N=2000 entities, 200 relations):
  Train accuracy 100% 도달: step ~ 50K
  Grokking transition begin: step ~ 1M
  Full grokked: step ~ 5M (val_ood > 0.95)
  
Comparison task:
  Faster grokking: train 100% at step ~ 10K, OOD generalization at step ~ 500K
  Higher final OOD accuracy: ~ 98%
```

## 14.8 자기점검 (이 챕터)

### 핵심 3 가지

1. **`weight_decay = 1e-2` 의 *critical* 역할?**
2. **`logit_lens` 가 *수십 layer* 의 정보를 *어떻게 정리*?**
3. **Causal tracing 의 *clean vs corrupt* design 의 의미?**

### 답변

1. **Grokking 의 *enabler***. Weight decay 가 *없으면* (= 0) → train accuracy 100% 후 *generalization circuit* 의 emergence X. Weight decay *너무 크면* (> 1) → 학습 불가. **1e-2 ~ 1e-1** = *implicit regularization* 가 *circuit*  formation 의 *pressure*. paper §5 의 *systematic exploration*.

2. **Layer 별 *cumulative refinement* 추적**. 각 layer 의 hidden state → unembed → logit. **Phase 1** (early layers): 정답 logit *낮음*. **Phase 2** (middle layers): 정답 logit *상승* (intermediate reasoning). **Phase 3** (final layer): 정답 logit *peak*. → "*어느 layer 에서 generalization circuit 가 fire*" 의 *temporal slicing*.

3. **"Component 의 *causal sufficiency*" 측정**. Clean run = 정답 prediction. Corrupt run = wrong prediction. *Specific layer/position 의 activation* 을 *clean → corrupt 에 patch* → patched run 이 *clean 의 정답 복원* 시 → 그 component 가 *prediction 의 causal sufficient*. ROME (Meng 2022) 의 *standard methodology*.
