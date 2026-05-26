# 21 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 21.1 챕터 한 줄 요약

> **"4 약점: (1) VAE training instability, (2) Quantile crossing 위험, (3) Multi-component architectural complexity, (4) TFM era의 *simpler approach* 와 competition."**

## 21.2 약점 1 — VAE Training Instability

VAE의 *posterior collapse*, *KL annealing* 등 instability issues. Hyperparameter sensitivity.

## 21.3 약점 2 — Quantile Crossing

Multi-quantile output (Q10, Q50, Q90)이 *monotonic increasing* 가정. 학습 시 *quantile crossing* (Q90 < Q10) 가능 — *invalid distribution*.

## 21.4 약점 3 — Architectural Complexity

Pattern decomposition + VAE + quantile + Transformer = *4 component*. Debugging, maintenance complexity 高.

## 21.5 약점 4 — TFM Simpler Approach

Chronos 같은 token-based TFM = *probabilistic by construction* (token distribution). Additional VAE + decomposition layer 의 *marginal value* 의문.

## 21.6 자기점검

### 핵심 3 가지

1. **VAE training instability의 *production risk*?**
2. **Quantile crossing의 *engineering solution*?**
3. **TFM 의 *simpler probabilistic approach* 와의 trade-off?**

### 답변

1. **Posterior collapse + reproducibility**. VAE의 KL annealing schedule sensitive. *Production reliability* 의 challenge. *Robust solutions* (beta-VAE, GE-VAE) 도입 필요 — paper 미언급. *Production deployment* 시 *fallback strategy* 필수.

2. **Sorting + monotonicity constraint**. Engineering fix: post-prediction sort (Q10 ≤ Q50 ≤ Q90) 또는 *monotonic neural network* 사용. Paper 미명시 — *deployment time engineering*. 또는 *single quantile* (Q50)만 predict 후 *spread estimation*.

3. **Decomposition value vs token distribution**. TFM token = *unconditional distribution per step*. QuantileFormer = *decomposition-conditional distribution*. *Information gain*: trend / seasonal 의 *separate uncertainty quantification*. *High-precision domain* (energy load forecasting)에서 *meaningful*. *Generic forecasting*에서는 *marginal*.
