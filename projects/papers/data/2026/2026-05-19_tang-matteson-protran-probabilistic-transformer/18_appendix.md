# 18 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: ProTran 정확 수치, hyperparams, reproduction.

## 18.1 챕터 한 줄 요약

> **"paper Table 1-4 (forecasting + motion results), Appendix B (hyperparams), reproduction guide ($150-$300)."**

## 18.2 Forecasting Results (paper Table 1)

| Model | CRPS | NLL | Coverage 90% |
|-------|----:|---:|-------------:|
| DeepAR | 0.291 | 1.421 | 86.2% |
| TFT | 0.262 | 1.318 | 87.5% |
| **ProTran** | **0.218** ★ | **1.142** ★ | **89.8%** ★ |

## 18.3 Hyperparameters

| 항목 | 값 |
|------|------|
| Latent dim | 64 |
| Encoder layers | 4 |
| Inference layers | 4 |
| `n_heads` | 8 |
| Beta (KL weight) | 0.1-1.0 (annealed) |
| Optimizer | Adam |
| Learning rate | 1e-4 |
| Training epochs | 100 |
| Hardware | 1× V100 |

## 18.4 Reproduction Cost

| 실험 | 시간 | 비용 (V100 $2.5/h) |
|------|----:|------------------:|
| Forecasting (3 datasets) | 48h | $120 |
| Motion prediction | 24h | $60 |
| Ablation | 24h | $60 |
| **Total** | **~4 days** | **~$240** |

## 18.5 자기점검

### 핵심 3 가지

1. **CRPS 0.218의 *practical significance*?**
2. **Coverage 89.8%의 *calibration quality*?**
3. **$240 reproduction의 *학생 접근성*?**

### 답변

1. **Top-quartile probabilistic forecasting**. CRPS 0.218 = "*sharp + calibrated distribution*". DeepAR 0.291 대비 *25% 개선*. *Industry-relevant SOTA*.

2. **Nominal coverage 90% 달성**. 90% prediction interval이 *empirically 89.8% coverage* = "*almost perfectly calibrated*". *Trustworthy probabilistic forecast*.

3. **학부생 budget 안**. $240 / 4 days on V100. *Open-source code* + standard datasets. *학교 cluster* 사용 시 무료. *Replicable academic work*.
