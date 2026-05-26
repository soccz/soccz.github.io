# 17 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 17.1 챕터 한 줄 요약

> **"4 약점: (1) RFF features 의 *interpretability 부재*, (2) Ridge 외 regularization 미탐구, (3) Transaction cost 미반영, (4) Survivorship bias."**

## 17.2 약점 1 — RFF Interpretability

Random Fourier features = *random projection*. 각 feature 의 *economic 의미* 불명. *Black-box high-dim model*.

## 17.3 약점 2 — Ridge-Only

Ridge L2 regularization 의 *implicit virtue*. Lasso L1, ElasticNet 등 *alternative regularization* 미실험.

## 17.4 약점 3 — Transaction Cost

Sharpe 1.43 = *frictionless*. 실전 5-10 bps cost 반영 시 *수 percent drag*.

## 17.5 약점 4 — Survivorship Bias

US universe = current S&P 500 etc — *delisted stocks* 일부 누락.

## 17.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **RFF의 *interpretability 부재* 의 *production concern*?**
3. **Ridge 외 *alternative regularization* 의 *unexplored direction*?**

### 답변

1. **Foundation model context 부재**. KMZ 의 *high-dim ridge* + *foundation TFM* 의 *millions params* 의 *theoretical bridge* — 본 deep dive 미상세. **Future**: KMZ paradigm 이 *foundation model justification* 임을 *explicit framework* 화.

2. **Hedge fund interpretability requirement**. Quant fund 의 *regulatory + risk management* 가 *interpretable factors* 요구. RFF 의 black-box 가 *production deployment 한계*. → *SHAP, feature importance, attribution methods* 보완 필요. KMZ paper 미반영.

3. **Sparsity-aware learning**. Lasso L1 = sparse → *feature selection*. ElasticNet = mix. Dropout-based regularization = *Bayesian connection*. KMZ의 ridge-only focus = *limited exploration*. *Future work*: comparing regularization families in finance.
