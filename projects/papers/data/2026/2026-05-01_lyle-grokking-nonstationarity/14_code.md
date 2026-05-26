# 14 PyTorch Code — Plasticity Methods 재현

> **🧒 본 챕터는 "직접 해보기"**: ELR monitoring + Re-warm scheduling + NAP.

## 14.1 의존성

```bash
pip install torch numpy
```

## 14.2 Effective Learning Rate (ELR) Monitor

```python
import torch
import torch.nn as nn


def compute_ELR(model, optimizer):
    """ Compute Effective LR per parameter group """
    elrs = []
    for group in optimizer.param_groups:
        lr = group['lr']
        for p in group['params']:
            if p.grad is None: continue
            grad_norm = p.grad.norm().item()
            weight_norm = p.norm().item()
            elr = lr * grad_norm / (weight_norm + 1e-8)
            elrs.append(elr)
    return sum(elrs) / len(elrs)  # average ELR
```

## 14.3 Re-warm Learning Rate Scheduler

```python
class ReWarmScheduler:
    """ Periodic LR re-warmup to maintain plasticity """
    def __init__(self, optimizer, base_lr=1e-3, warmup_steps=500,
                 rewarm_steps=10000, max_lr=3e-3):
        self.optimizer = optimizer
        self.base_lr = base_lr
        self.warmup_steps = warmup_steps
        self.rewarm_steps = rewarm_steps
        self.max_lr = max_lr
        self.step_count = 0
    
    def step(self):
        self.step_count += 1
        # Cycle position within rewarm period
        cycle_step = self.step_count % self.rewarm_steps
        if cycle_step < self.warmup_steps:
            # Re-warmup phase
            progress = cycle_step / self.warmup_steps
            lr = self.base_lr + (self.max_lr - self.base_lr) * progress
        else:
            # Decay phase (cosine)
            progress = (cycle_step - self.warmup_steps) / (self.rewarm_steps - self.warmup_steps)
            lr = self.base_lr + 0.5 * (self.max_lr - self.base_lr) * (1 + torch.cos(torch.tensor(progress * 3.14159)).item())
        for group in self.optimizer.param_groups:
            group['lr'] = lr
        return lr
```

## 14.4 Neural Activation Pruning (NAP)

```python
def neural_activation_pruning(model, dataloader, dormancy_threshold=0.01,
                                reset_fraction=0.1):
    """ Detect and reset dormant neurons """
    activation_magnitudes = {}
    
    # Hook to capture activations
    def hook_factory(name):
        def hook(module, input, output):
            if name not in activation_magnitudes:
                activation_magnitudes[name] = []
            # Per-neuron mean absolute activation
            act = output.abs().mean(dim=tuple(range(output.dim() - 1)))
            activation_magnitudes[name].append(act.detach().cpu())
        return hook
    
    hooks = []
    for name, module in model.named_modules():
        if isinstance(module, nn.Linear):
            h = module.register_forward_hook(hook_factory(name))
            hooks.append(h)
    
    # Run inference to collect activations
    model.eval()
    with torch.no_grad():
        for batch in dataloader:
            model(batch)
    
    for h in hooks: h.remove()
    
    # Detect dormant neurons
    reset_info = []
    for name, mags in activation_magnitudes.items():
        mean_act = torch.stack(mags).mean(dim=0)
        dormant_mask = mean_act < dormancy_threshold
        n_dormant = dormant_mask.sum().item()
        if n_dormant > 0:
            # Reset dormant weights
            module = dict(model.named_modules())[name]
            with torch.no_grad():
                module.weight.data[dormant_mask] = torch.randn_like(module.weight.data[dormant_mask]) * 0.01
                if module.bias is not None:
                    module.bias.data[dormant_mask] = 0
            reset_info.append((name, n_dormant))
    
    return reset_info
```

## 14.5 Training Loop with Plasticity Tools

```python
def train_with_plasticity(model, dataloader, num_epochs=100, lr=1e-3,
                            nap_interval=10):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    scheduler = ReWarmScheduler(optimizer, base_lr=lr, max_lr=3*lr)
    
    elr_history = []
    
    for epoch in range(num_epochs):
        for batch, target in dataloader:
            optimizer.zero_grad()
            loss = model.compute_loss(batch, target)
            loss.backward()
            
            # Track ELR
            elr = compute_ELR(model, optimizer)
            elr_history.append(elr)
            
            optimizer.step()
            scheduler.step()
        
        # Periodic NAP
        if (epoch + 1) % nap_interval == 0:
            reset_info = neural_activation_pruning(model, dataloader)
            if reset_info:
                print(f"Epoch {epoch}: reset {sum(n for _, n in reset_info)} dormant neurons")
        
        # Log plasticity
        avg_elr = sum(elr_history[-100:]) / 100
        print(f"Epoch {epoch}: avg ELR={avg_elr:.5f}")
```

## 14.6 Expected Output

```
Atari Continual RL (10 tasks sequentially):
  Without plasticity tools:
    Task 1: solved
    Task 5: 80% performance
    Task 10: 30% (plasticity lost)
    Final avg ELR: 0.0005

  With re-warm + NAP:
    Task 1: solved
    Task 5: 90%
    Task 10: 85% (plasticity preserved)
    Final avg ELR: 0.008
```

## 14.7 자기점검

### 핵심 3 가지

1. **ELR threshold (0.001) 의 *empirical justification*?**
2. **NAP reset 의 *learning catastrophe* 위험?**
3. **Re-warm 의 *cycle period* (10K steps) 의 *trade-off*?**

### 답변

1. **Empirical threshold from continual RL experiments**. Lyle 의 Atari 실험: ELR < 0.001 시 *plasticity loss 시작* (다음 task 학습 능력 50%+ 감소). > 0.01 = healthy. 0.001-0.01 = warning zone. *Universal threshold 아닌 task-specific* — 본 paper 는 *general guideline* 제공.

2. **Surgical reset minimizes risk**. NAP = *only dormant neurons reset* (activation < threshold) — *active learning neurons preserve*. 만약 *active reset* 시 *catastrophic forgetting*. Dormant neurons 는 *contribution 없으므로* reset 시 *performance 변화 없음* + *capacity 회복*. *Surgical surgery* analogy.

3. **Frequent re-warm → slow convergence, infrequent → plasticity loss**. 1K steps = *너무 잦음* (학습 못 끝남). 100K = *너무 드뭄* (plasticity loss 이미 발생). 10K = *empirical sweet spot* — *training convergence + plasticity maintenance balance*. Lyle 의 ablation 입증.
