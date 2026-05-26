# 14 PyTorch Code — Liu Effective Theory 재현

> **🧒 본 챕터는 "직접 해보기"**: Phase diagram experiments + Toy model analysis.

## 14.1 의존성

```bash
pip install torch numpy matplotlib
```

## 14.2 Toy Model (2-layer Linear Network)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class ToyGrokkingModel(nn.Module):
    """ Liu 2023 의 analyzable toy model """
    def __init__(self, p=23, d_hidden=64):
        super().__init__()
        self.p = p
        self.embed = nn.Embedding(p, d_hidden)
        self.fc = nn.Linear(d_hidden * 2, p)
    
    def forward(self, a, b):
        e_a = self.embed(a)
        e_b = self.embed(b)
        # Concatenate + linear
        e = torch.cat([e_a, e_b], dim=-1)
        return self.fc(e)
```

## 14.3 Phase Diagram Experiment

```python
import numpy as np


def classify_phase(train_acc, val_acc, eps=0.05):
    """ Classify into 4 phases based on (train, val) accuracy """
    if train_acc < 0.5 and val_acc < 0.5:
        return 'confusion'
    elif train_acc > 0.9 and val_acc < 0.5:
        return 'memorize'
    elif train_acc > 0.9 and val_acc < 0.9:
        return 'comprehension'
    elif train_acc > 0.9 and val_acc > 0.9:
        return 'generalize'
    else:
        return 'transition'


def phase_diagram_experiment(p=23, train_fraction=0.4, 
                                wd_values=[0, 1e-4, 1e-3, 1e-2, 1e-1, 1.0],
                                lr_values=[1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2],
                                num_steps=200_000):
    """ Sweep WD × LR and record final phase """
    results = np.zeros((len(wd_values), len(lr_values)), dtype=object)
    
    pairs = [(a, b) for a in range(p) for b in range(p)]
    targets = [(a + b) % p for a, b in pairs]
    pairs = torch.tensor(pairs)
    targets = torch.tensor(targets)
    perm = torch.randperm(len(pairs))
    n_train = int(train_fraction * len(pairs))
    train_idx = perm[:n_train]; val_idx = perm[n_train:]
    
    for i, wd in enumerate(wd_values):
        for j, lr in enumerate(lr_values):
            model = ToyGrokkingModel(p)
            opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=wd)
            
            for step in range(num_steps):
                idx = train_idx[torch.randperm(len(train_idx))[:128]]
                a, b = pairs[idx, 0], pairs[idx, 1]
                y = targets[idx]
                logits = model(a, b)
                loss = F.cross_entropy(logits, y)
                opt.zero_grad(); loss.backward(); opt.step()
            
            # Final evaluation
            with torch.no_grad():
                train_a, train_b = pairs[train_idx, 0], pairs[train_idx, 1]
                val_a, val_b = pairs[val_idx, 0], pairs[val_idx, 1]
                train_acc = (model(train_a, train_b).argmax(-1) == targets[train_idx]).float().mean().item()
                val_acc = (model(val_a, val_b).argmax(-1) == targets[val_idx]).float().mean().item()
            
            phase = classify_phase(train_acc, val_acc)
            results[i, j] = phase
            print(f"WD={wd}, LR={lr}: train={train_acc:.2f}, val={val_acc:.2f} → {phase}")
    
    return results
```

## 14.4 Order Parameter Analysis

```python
def measure_circular_structure(embed_weights, p):
    """ 
    Measure 'circular' structure in embeddings.
    Liu 2023: grokking → embeddings form circular structure
    """
    # PCA to 2D
    centered = embed_weights - embed_weights.mean(0)
    U, S, V = torch.svd(centered)
    # Project to first 2 principal components
    proj = centered @ V[:, :2]  # [p, 2]
    
    # Measure circularity: how close to a regular p-gon?
    # Order embeddings by angle
    angles = torch.atan2(proj[:, 1], proj[:, 0])
    sorted_idx = torch.argsort(angles)
    
    # Check if sorted indices form arithmetic progression mod p
    arithmetic_violations = 0
    for i in range(p):
        if sorted_idx[i].item() != (sorted_idx[0].item() + i * k) % p:
            arithmetic_violations += 1
    
    # Circular structure score
    structure_score = 1.0 - arithmetic_violations / p
    return structure_score
```

## 14.5 Phase Boundary Visualization

```python
import matplotlib.pyplot as plt


def plot_phase_diagram(results, wd_values, lr_values):
    phase_colors = {
        'confusion': 0, 'memorize': 1, 'comprehension': 2,
        'generalize': 3, 'transition': 4
    }
    matrix = np.array([[phase_colors[r] for r in row] for row in results])
    
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.imshow(matrix, cmap='RdYlGn', aspect='auto')
    ax.set_xticks(range(len(lr_values)))
    ax.set_xticklabels([f'{lr:.0e}' for lr in lr_values])
    ax.set_yticks(range(len(wd_values)))
    ax.set_yticklabels([f'{wd:.0e}' for wd in wd_values])
    ax.set_xlabel('Learning rate')
    ax.set_ylabel('Weight decay')
    ax.set_title('Phase diagram (Liu 2023 Figure 3)')
    
    # Add phase labels
    for i in range(len(wd_values)):
        for j in range(len(lr_values)):
            ax.text(j, i, results[i][j][:4], ha='center', va='center', fontsize=8)
    
    plt.tight_layout()
    plt.savefig('phase_diagram.png', dpi=120)
```

## 14.6 Expected Output

```
Phase diagram (6×6 grid):
  WD=0:    confusion (all LR)
  WD=1e-4: confusion / memorize
  WD=1e-3: memorize / comprehension
  WD=1e-2: memorize / generalize (★ grokking zone)
  WD=1e-1: comprehension / over-regularize
  WD=1.0:  confusion (over-regularize)

Goldilocks zone: WD~1e-3 to 1e-2, LR~1e-3 to 1e-2
```

## 14.7 자기점검

### 핵심 3 가지

1. **Toy linear model 이 *real Transformer grokking* 과 *equivalent 작동* 의 evidence?**
2. **Phase classification 의 *boundary threshold* (0.9) 의 선택?**
3. **Embedding circular structure 의 *grokking signature*?**

### 답변

1. **Linear toy 의 *qualitative similarity***. Liu 2023: 2-layer linear network + modular addition 도 *grokking* 발생 (delayed val accuracy jump). *Phase diagram 의 동일 4-phase structure*. → "*Grokking 이 architectural detail 의존 아님*" — *universal phenomenon* across models. *Toy analysis 의 mechanism* 이 *real Transformer 에 transferable*.

2. **0.9 = "near-perfect" practical threshold**. Train/Val 0.95+ = grokked, 0.5- = confusion. 0.9 = "*near-perfect but not yet*". 0.5 = "*random vs structured*". 4-phase classification 의 *empirical thresholds*. *Sensitive to choice* — Liu paper 는 *0.85-0.95 range* 의 *boundary 의 fuzziness* 명시.

3. **Circular embedding = Fourier-equivalent representation**. Modular addition 의 *natural representation* = cyclic group Z_p 의 *circular embedding* (regular p-gon). Grokking model 의 embedding PCA → 2D plot 시 *clean circle* 보임. → "*Group structure 의 implicit learning*" 의 *visual evidence*. Nanda 2023 Fourier circuit 의 *embedding-side manifestation*.
