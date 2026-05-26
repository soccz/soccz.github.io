# 12 Glossary & References — Lyle 2024 (Grokking Nonstationarity)

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Plasticity loss + Effective learning rate (ELR) + Network re-warming + Non-stationary learning 의 핵심 개념 + reference.

## 12.1 챕터 한 줄 요약

> **"Lyle et al. ICML 2024 의 *plasticity 회복* methodology 의 30+ terminology + 20+ references (continual learning, NAP, ELR, grokking) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Plasticity | network capability to learn new tasks | Lyle 2024 ★ |
| Plasticity loss | progressive degradation of plasticity | Lyle 2024 |
| Effective LR (ELR) | LR × ||∇L|| / ||W|| | Lyle 2024 |
| Re-warm | learning rate boost mid-training | Lyle 2024 |
| NAP | Neural Activation Pruning | Lyle 2024 |
| Non-stationary | task / distribution shift over time | RL classical |
| Continual learning | sequential task learning | classical |
| Catastrophic forgetting | losing old task on new task | French 1999 |
| Concept drift | input distribution change | classical |
| Dead neuron | always-zero activation | Lyle 2024 |
| Dormant neuron | low-magnitude activation | Lyle 2024 |
| Weight magnitude | ||W||_2 | classical |
| Gradient magnitude | ||∇L||_2 | classical |
| ELR threshold | minimum useful ELR | Lyle 2024 |
| Warmup | LR ramping at training start | classical |
| Re-warmup | LR ramping mid-training | Lyle 2024 |
| L2 regularization | weight decay | classical |
| Spectral normalization | layer-wise spectral bound | Miyato 2018 |
| Layer norm | per-sample normalization | Ba 2016 |
| Reset network | re-initialize partial weights | Dohare 2024 |
| Shrink-and-perturb | small reset + perturb | Ash 2020 |
| Streaming RL | online RL learning | classical |
| TD learning | temporal difference | Sutton 1988 |
| Distribution shift | input distribution change | ML |
| Loss landscape | parameter space loss | NN |
| Sharp minima | high-curvature minima | Keskar 2017 |
| Flat minima | low-curvature minima | Keskar 2017 |
| Grokking | delayed generalization | Power 2022 |
| Phase transition | rapid behavior change | NN |
| Recovery | post-loss plasticity restoration | Lyle 2024 |

## 12.3 Notation

```
W_t ∈ R^d       parameters at step t
L(W)           loss function
ELR_t = lr_t × ||∇L(W_t)|| / ||W_t||
T = task/dist shift event
Plasticity = capability to reduce L on new T
```

## 12.4 References (20+)

```
Lyle et al. ICML 2024 — 본 paper (★)
Dohare et al. 2024 — Continual backprop
Sutton 1988 — TD learning
Power et al. 2022 — Grokking
Nanda et al. 2023 — Progress measures
Keskar et al. 2017 — Sharp/flat minima
Miyato et al. 2018 — Spectral normalization
Ash & Adams 2020 — Shrink-and-perturb
French 1999 — Catastrophic forgetting
```

## 12.5 자기점검

### 핵심 3 가지

1. **Effective LR (ELR) 의 *intuitive meaning*?**
2. **NAP (Neural Activation Pruning) 의 *목적*?**
3. **Re-warm 의 *plasticity restoration mechanism*?**

### 답변

1. **Relative gradient impact on weights**. ELR = LR × ||∇L|| / ||W||. *Relative weight update magnitude*. ELR ≈ 0 = "*gradient too small relative to weights*" → weights barely change → *plasticity loss*. ELR > 0.01 = "*meaningful update*" → *learning active*. → "*Network learning capacity*" 의 *quantitative metric*.

2. **Dormant neuron 제거**. 학습 중 일부 neurons 의 activation 이 *always-zero* (dead) 또는 *near-zero* (dormant). 이들은 *effective capacity 차감* — *plasticity loss*. NAP = "*low-activation neurons 식별 + reinitialize*" → *capacity restoration*.

3. **LR boost reactivates parameters**. Plasticity loss = *weights stuck in flat minima* + *small effective gradients*. Re-warm = "*LR 일시 증가*" → *weights 가 더 큰 update steps* → *new region 탐색* → *plasticity 회복*. Cosine warm-restart 의 *theoretical foundation*.
