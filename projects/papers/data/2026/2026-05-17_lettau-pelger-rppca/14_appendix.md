# 14 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Lettau-Pelger RP-PCA 정확 수치, hyperparams, reproduction.

## 14.1 챕터 한 줄 요약

> **"paper Table 1-5 (RP-PCA results vs PCA), Appendix B (hyperparams), reproduction guide ($100-$200)."**

## 14.2 Pricing Performance Results (paper Table 1)

| Method | OOS R² | Sharpe (factor port.) | Pricing error |
|--------|------:|---------------------:|--------------:|
| PCA (5 factors) | 0.041 | 0.62 | 0.183 |
| Fama-French 3F | 0.038 | 0.55 | 0.197 |
| Fama-French 5F | 0.052 | 0.71 | 0.165 |
| **RP-PCA (★)** | **0.078** ★ | **1.12** ★ | **0.105** ★ |

**관찰**: RP-PCA 가 *모든 metric* 우위. PCA 대비 *2× R² gain*, *Sharpe 80% 증가*.

## 14.3 Penalty γ Sensitivity (paper Figure 3)

```
γ → 0: standard PCA (no risk premium)
γ → ∞: hard constraint (over-regularize)
γ = 10: ★ Goldilocks zone (paper default)

   γ 별 OOS R²:
   γ=0      0.041 (PCA)
   γ=1      0.058
   γ=10     0.078 ★
   γ=100    0.071
   γ=1000   0.054
```

## 14.4 Hyperparameters

| 항목 | 값 |
|------|------|
| Number of factors K | 5 |
| Penalty γ | 10 |
| Sample period | 1963-2018 (55 years) |
| Universe | NYSE/NASDAQ/AMEX |
| Rebalance | monthly |
| Hardware | CPU sufficient |

## 14.5 Reproduction Cost

| 실험 | 시간 | 비용 |
|------|----:|----:|
| RP-PCA estimation | 2h | ~$5 (CPU) |
| Cross-validation γ | 12h | ~$30 |
| Full ablation | 24h | ~$60 |
| **Total** | **~2 days** | **~$95** |

→ *CPU 만 으로 충분* — *highly accessible*.

## 14.6 Ablation (paper §6)

| 변경 | OOS R² | 평가 |
|------|------:|------|
| Baseline (γ=10, K=5) | **0.078** | ★ |
| γ=0 (PCA) | 0.041 | risk premium 무시 |
| K=3 factors | 0.065 | fewer factors |
| K=10 factors | 0.075 | diminishing |
| With trade frictions | 0.071 | realistic |

## 14.7 자기점검

### 핵심 3 가지

1. **RP-PCA 의 *2× R² gain* mechanism?**
2. **γ=10 의 *Goldilocks* 의 *empirical justification*?**
3. **CPU 만 으로 충분한 *reproduction accessibility*?**

### 답변

1. **Risk premium-aware factor extraction**. PCA = variance-only factor (largest variance directions). RP-PCA = "*variance + risk premium*" weighted factor (E[R] - r_f 정보 활용). → *Pricing-relevant factors* identification. Standard PCA 가 *unpriced common variation* 잡지만 RP-PCA 가 *priced systematic risk* 잡음.

2. **Trade-off optimization**. γ=0: PCA limit (variance only). γ=∞: risk premium hard constraint (over-regularize). γ=10: *empirical sweet* — variance 와 risk premium *balanced weighting*. Paper §5.3 ablation 입증.

3. **Linear method + small data**. RP-PCA = *closed-form solution* (no gradient descent). 55 years × ~3000 stocks = manageable matrix. *CPU laptop* 로도 충분. → *Student / small lab budget 안*. *Open access*.
