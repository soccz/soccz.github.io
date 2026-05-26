# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Lyle 2024 정확 수치, hyperparams, reproduction.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-4 (Atari continual RL results), Appendix B (hyperparams), reproduction guide."**

## 16.2 Continual RL Results (paper Table 1)

10 sequential Atari tasks:

| Method | Avg final performance | Plasticity preserved |
|--------|---------------------:|----------------------|
| Baseline (Adam + fixed LR) | 32% | ✗ |
| EWC | 54% | partial |
| Continual Backprop (Dohare 2024) | 72% | ✓ |
| Shrink-and-perturb (Ash 2020) | 68% | partial |
| **Lyle (Re-warm + NAP)** | **85%** ★ | ✓ |

## 16.3 ELR Trajectory (paper Figure 2)

| Step | ELR (no intervention) | ELR (re-warm) |
|------|--------------------:|---------------:|
| 0 | 0.045 | 0.045 |
| 50K | 0.022 | 0.024 |
| 100K | 0.008 | 0.018 |
| 200K | 0.0015 (loss) | 0.012 |
| 300K | 0.0005 (severe) | 0.010 |

→ Re-warm 이 ELR을 *healthy zone (>0.01)* 유지.

## 16.4 NAP Results (paper Table 3)

| Step | % dormant | % active | Performance |
|------|----------:|---------:|------------:|
| 100K (before NAP) | 38% | 62% | 78% |
| 100K (after NAP) | 5% | 95% | 79% |
| 200K (before) | 42% | 58% | 65% |
| 200K (after NAP) | 8% | 92% | 81% (recovered!) |

## 16.5 Hyperparameters

| 항목 | 값 |
|------|------|
| Base LR | 1e-3 |
| Max LR (re-warm) | 3e-3 (3× base) |
| Warmup duration | 500 steps |
| Cycle period | 10,000 steps |
| NAP interval | 50,000 steps |
| Dormancy threshold | 0.01 |
| Reset fraction | per cycle: ~30-50% of dormant |
| Optimizer | Adam |
| Hardware | 1× V100 |

## 16.6 Reproduction Cost

| Atari task series (10 tasks) | 시간 | 비용 (V100 $2.5/h) |
|--------------------------------|----:|------------------:|
| Baseline (no plasticity tools) | 48h | $120 |
| Re-warm only | 48h | $120 |
| Re-warm + NAP | 50h | $125 |
| **All methods comparison** | **~150h** | **~$380** |

## 16.7 자기점검

### 핵심 3 가지

1. **85% vs 32% baseline 의 *substantive significance*?**
2. **NAP 의 *200K step recovery* (65% → 81%) 의 mechanism?**
3. **Lyle methods 의 *production cost* 의 reasonable 함?**

### 답변

1. **Plasticity tool 이 *continual learning 가능* enable**. 32% = baseline 의 *catastrophic failure* (task 1-10 의 평균). 85% = "*거의 single-task 수준 maintain*". 53%p 차이 = "*plasticity tool 이 continual learning 의 *fundamental enabler*". → Without plasticity tools, *continual RL impossible*.

2. **Capacity restoration via dormant reset**. 200K step 에서 *42% neurons dormant* — *effective capacity 58%*. NAP 후 *active 92%* (5% 만 dormant 잔존). 새 신호로 dormant neurons 재초기화 → *new learning capacity*. 65% → 81% = *capacity restoration 이 performance gain* 으로 전환.

3. **+$5 cost for plasticity tool**. Baseline $120 vs Re-warm + NAP $125 = *5% additional cost*. *85% vs 32% performance*. → *Cost-effective intervention*. *Engineering simplicity* (LR scheduler + activation hook) = *production-ready*.
