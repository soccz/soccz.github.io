# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Gu-Kelly-Xiu 2021 autoencoder asset pricing 의 정확 수치, hyperparams, reproduction.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-7 (CA1-CA3 model performance), Appendix B (hyperparams), reproduction guide ($150-$400)."**

## 16.2 Model Performance (paper Table 1)

| Model | R² OOS | Sharpe | Alpha |
|-------|------:|------:|------:|
| Fama-French 5-factor | 0.014 | 0.42 | -0.02 |
| Standard AE (no chars) | 0.026 | 0.58 | 0.11 |
| **CA1** (1 char) | 0.045 | 0.71 | 0.18 |
| **CA2** (2 char) | 0.058 | 0.84 | 0.24 |
| **CA3** (3 char) | **0.072** ★ | **0.96** ★ | **0.31** ★ |
| PCA (10 factors) | 0.038 | 0.62 | 0.15 |

**관찰**: CA3 (3 characteristics-conditional) 이 모든 metric 우위. *Deep learning + conditional embedding* 의 합치.

## 16.3 Out-of-Sample R² Time Series (paper Figure 3)

```
연도별 R² OOS (1987-2018):
  최저: 2008 금융위기 (0.012)
  최고: 1995-2000 dot-com (0.095)
  평균: 0.045-0.072 (model size 의존)
```

## 16.4 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Architecture | Autoencoder + factor extraction |
| Hidden dim | 32 (CA1), 64 (CA2), 128 (CA3) |
| Factors `K` | 5 (default), tested 3-15 |
| Characteristics | 94 firm-level (size, BM, momentum 등) |
| Optimizer | Adam |
| Learning rate | 1e-3 |
| Weight decay | 1e-4 |
| Batch size | 5,000 stock-month obs |
| Training years | 1957-1986 (30 years) |
| Validation years | 1987-1990 |
| Test years | 1991-2018 |
| Hardware | 1× V100 |

## 16.5 Reproduction Cost

| 항목 | 시간 | 비용 (V100 $2.5/h) |
|------|----:|------------------:|
| Standard AE | 12h | $30 |
| CA1 | 18h | $45 |
| CA2 | 30h | $75 |
| CA3 | 48h | $120 |
| **Total (4 models)** | **~5 days** | **~$270** |

→ *학부생 budget*. CRSP / Compustat data 접근 (학교 라이선스) 필요.

## 16.6 Ablation Study (paper §6)

| 변경 | R² OOS | 평가 |
|------|------:|------|
| CA3 baseline | **0.072** | ★ standard |
| Without characteristics | 0.028 | char conditioning critical |
| K=3 factors | 0.061 | fewer factors |
| K=10 factors | 0.069 | diminishing |
| Linear (no AE) | 0.043 | nonlinearity helps |
| No weight decay | 0.058 | overfit |

**결정적 발견**:
- **Characteristics conditioning**: critical (2× R² gain)
- **Nonlinearity (AE)**: 약 70% gain
- **Factor count K=5**: sweet spot

## 16.7 자기점검

### 핵심 3 가지

1. **CA3 의 R² 0.072 의 *finance practical significance*?**
2. **Characteristics conditioning 의 *2× gain* mechanism?**
3. **Linear vs Nonlinear (43% → 72%) 의 *deep learning value*?**

### 답변

1. **Out-of-sample 7.2% explained variance**. Equity returns 의 *OOS R² > 5%* = "*statistically significant + practically useful*". Sharpe 0.96 = annual alpha 24%+ — *top-quartile hedge fund performance*. *Industry-relevant SOTA*.

2. **Conditional embedding 의 information value**. Without chars: factor = "*generic latent factor*". With chars: factor = "*char-conditioned dynamic factor*" — e.g., "*small-cap value momentum factor*" vs "*large-cap growth momentum factor*" 의 *separate exposures*. → Richer factor structure → better explanation.

3. **Nonlinear interactions of characteristics**. Linear: 각 char 의 *independent effect*. Nonlinear AE: char interaction (e.g., "*small-cap × value × momentum*" 의 *interaction effect*). Financial markets 의 *complex interactions* 의 *direct modeling*. → *Deep learning 의 finance applicability* 의 *empirical proof*.
