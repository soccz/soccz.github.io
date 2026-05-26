# 16 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 16.1 챕터 한 줄 요약

> **"4 약점: (1) Linear restriction (nonlinear AE 우위), (2) γ hyperparameter sensitivity, (3) US-only universe, (4) Transaction cost 미반영."**

## 16.2 약점 1 — Linear Restriction

RP-PCA = linear factor extraction. Nonlinear interactions (characteristic 간 의 interaction) 미반영. Gu-Kelly-Xiu AE 의 *nonlinear extension* 이 *수 percent 우위*.

## 16.3 약점 2 — γ Sensitivity

γ=10 의 *empirical optimum*. 다른 universe / period 에서 *재조정 필요*. Cross-validation overhead.

## 16.4 약점 3 — US-Only Universe

CRSP US equities only. International market 의 *generalization* 미증명.

## 16.5 약점 4 — Transaction Cost

Academic backtest = frictionless. *Monthly rebalance* 의 *5-10 bps cost* 반영 시 Sharpe 0.8-0.9 (down from 1.12).

## 16.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Linear restriction의 *production impact*?**
3. **γ tuning 의 *practical overhead*?**

### 답변

1. **Foundation era 에서 RP-PCA 의 *relative positioning***. 2020 SOTA → 2024 DL extensions 등장 → relative obsolescence. 본 deep dive 가 *current relevance assessment* 부족. **Future update**: foundation model + RP-PCA hybrid 같은 *complementary positioning*.

2. **수 percent 가치 차이**. RP-PCA R² 0.078 vs AE R² 0.072 (slightly worse) — 실제로는 AE 가 *characteristic conditioning* 으로 더 좋을 가능성. Production: *linear interpretability + nonlinear performance* trade-off. *Domain dependence*.

3. **Annual re-tuning overhead**. Period rolling cross-validation = *수 hour CPU*. 큰 부담 아님 — but *engineering pipeline* 필수. Production 시 *robust γ range* (5-20) 사용으로 *re-tuning 빈도 감소*.
