# 13 Meta Insights — Lyle 2024 (Plasticity)

> **🧒 본 챕터는 "한 발 물러서서 본 통찰"**: Lyle 2024 paper 의 12 meta insight.

## 13.1 챕터 한 줄 요약

> **"Lyle 2024 의 *non-obvious 12 insights*: Plasticity 의 *empirical reality*, ELR 의 *first principled metric*, Re-warm 의 *practical simplicity*, DeepMind 의 *RL alignment*, *continual learning era* 의 enabling work."**

## 13.2 Insight 1 — Plasticity 는 Empirical Reality

```
이론적 가정:
  - "Network 는 학습 가능 무한대" (오해)

Empirical 발견:
  - 학습 중 plasticity 점진적 손실
  - Task 변경 시 *new learning 능력 감소*
  - "Plasticity loss" 의 실재 입증

→ "*Static capacity*" 가 아닌 "*dynamic plasticity*" 의 paradigm 인정.
```

## 13.3 Insight 2 — Effective LR 의 First Principled Metric

```
Plasticity 측정 방법 ad hoc:
  - Dead neuron count
  - Gradient norm
  - Loss curvature

Lyle 의 ELR:
  - ELR = LR × ||∇L|| / ||W||
  - *Scale-invariant*
  - *Layer-comparable*
  - *Time-tracking*

→ Plasticity 의 *quantitative substrate*.
```

## 13.4 Insight 3 — Re-warm 의 Practical Simplicity

```
Continual learning 의 복잡한 solutions:
  - EWC (regularization)
  - Synaptic Intelligence
  - Memory replay

Lyle 의 re-warm:
  - 단순히 LR boost
  - 1 hyperparameter (warmup duration)
  - 효과적
  
→ "*Simple > Complex*" 의 *Occam's razor*.
```

## 13.5 Insight 4 — RL alignment

```
Lyle, Schaul, Hessel (DeepMind):
  - RL 연구자들
  - Non-stationary = RL 의 *fundamental*
  - 본 paper 는 RL motivated

→ "*RL plasticity research*" 의 *foundational*.
```

## 13.6 Insight 5 — Continual Learning Era 의 Enabling Work

```
Pre-Lyle continual learning:
  - 학습된 model fix → 다른 task 학습 시 catastrophic forgetting
  - 다양한 regularization 시도

Post-Lyle:
  - ELR 모니터링 + re-warm
  - "*Maintain plasticity through training*"
  - Continual learning 의 *practical methodology*

→ Continual learning era 의 *practical enabler*.
```

## 13.7 Insight 6 — Grokking 과의 Connection

```
Grokking (Power 2022):
  - Train 100%, OOD 0% → 갑자기 OOD 100%
  - "*Delayed generalization*"

Lyle 의 plasticity:
  - 학습 중 plasticity 가 *변화 가능*
  - Grokking 의 *transition* 도 plasticity 의 *sudden gain* 가능

→ Grokking 의 *plasticity-perspective* 가능.
```

## 13.8 Insight 7 — Network 의 *Dead 영역*

```
Lyle 의 observations:
  - 학습 후 ~30-50% neurons dormant
  - Effective capacity 가 *capacity 보다 훨씬 작음*
  - NAP 가 *capacity 회복*

→ "*Used vs. Capacity*" 의 차이가 *foundational concept*.
```

## 13.9 Insight 8 — Reset 의 Surgical Power

```
Reset network methods:
  - Full reset (continual backprop, Dohare)
  - Partial reset (NAP)
  - Shrink-and-perturb (Ash 2020)

Lyle 의 NAP:
  - Only dormant neurons reset
  - Active neurons preserve
  - "*Surgical capacity restoration*"
```

## 13.10 Insight 9 — Loss Landscape 의 *Flat to Sharp* Transition

```
Plasticity loss:
  - 학습 초기: flat minima 탐색 가능 (high plasticity)
  - 학습 후기: sharp minima 안주 (low plasticity)

Re-warm:
  - LR 증가 → loss landscape 의 *flat 영역 재탐색*
  - Plasticity 회복

→ "*Loss landscape 의 plasticity-conditional geometry*".
```

## 13.11 Insight 10 — Adam vs SGD 의 ELR 차이

```
Adam:
  - Adaptive LR per parameter
  - ELR 더 robust (auto-tune)
  
SGD:
  - Global LR
  - ELR sensitive

→ Optimizer choice 가 plasticity 에 *non-trivial impact*.
```

## 13.12 Insight 11 — Spectral Normalization 의 *Plasticity 효과*

```
Spectral norm (Miyato 2018):
  - Original: GAN training stability
  - Lyle 발견: *plasticity 도 보존*

→ Spectral norm 의 *unexpected benefit*.
```

## 13.13 Insight 12 — RL Foundation 의 *Plasticity 도전*

```
RL foundation models:
  - Massive pre-training
  - Then 새 task fine-tune
  - Plasticity loss 가 *critical bottleneck*

Lyle 의 contribution:
  - RL foundation model 의 *plasticity 유지*
  - Practical methodology

→ RL foundation era 의 *enabling foundation*.
```

## 13.14 자기점검

### 핵심 3 가지

1. **ELR 의 *first principled metric* 의 의의?**
2. **Re-warm 의 *simplicity* 가 *complex methods* 보다 우월한 이유?**
3. **Lyle 2024 의 *RL foundation model* 시대 의 enabler 의 의미?**

### 답변

1. **Scale-invariant + time-trackable plasticity metric**. Pre-Lyle 의 plasticity metric (dead neuron count, gradient norm) = *layer-incomparable* + *scale-dependent*. ELR = LR × ||∇L|| / ||W|| = *dimensionless ratio* — *모든 layer + 모든 time-step 비교 가능*. → "*Plasticity 의 universal yardstick*". 후속 *모든 continual learning paper* 의 reference metric.

2. **Occam's razor + minimal intervention**. EWC, SI 등 = *복잡한 regularization* (각 parameter 의 importance 추적). Re-warm = *LR schedule 만 변경*. **Empirical**: Lyle 의 ablation = *re-warm 단독* 이 EWC 와 *동등 또는 우위*. → *Complex methodology 의 추가 hyperparameter + bug surface* 없이 *simple solution*. *Production-friendly*.

3. **RL foundation 의 *fundamental constraint***. Pre-training Atari 모델 → 새 게임 fine-tune 시 *plasticity loss* 가 *critical bottleneck*. Lyle 의 ELR monitoring + re-warm + NAP = "*RL foundation 의 plasticity 유지 방법*" 의 *practical protocol*. 2024-2025 의 RL foundation model trend 의 *enabling foundation*.
