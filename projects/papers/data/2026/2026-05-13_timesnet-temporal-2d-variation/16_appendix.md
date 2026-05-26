# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: TimesNet 정확 수치 (4 task benchmarks), hyperparams, reproduction.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-7 (4 tasks × 9 datasets), Appendix A (hyperparams), reproduction guide ($100-$300)."**

## 16.2 Long-term Forecasting (paper Table 1)

ETTh1, ETTm1, Weather, Traffic, ECL, Exchange, ILI — average MSE:

| Model | ETTh1 | ETTm1 | Weather | Traffic | ECL | Avg |
|-------|------:|------:|--------:|--------:|----:|----:|
| Informer | 0.385 | 0.421 | 0.231 | 0.652 | 0.198 | 0.377 |
| Autoformer | 0.343 | 0.398 | 0.227 | 0.624 | 0.187 | 0.356 |
| PatchTST | 0.298 | 0.342 | 0.198 | 0.581 | 0.175 | 0.319 |
| **TimesNet** | **0.265** ★ | **0.312** ★ | **0.187** ★ | **0.562** ★ | **0.168** ★ | **0.299** ★ |

**관찰**: TimesNet 이 *모든 dataset 우위*. PatchTST 대비 *5-10% MSE 감소*.

## 16.3 Short-term Forecasting (M4 dataset, paper Table 2)

| Model | M4 SMAPE | M4 MASE |
|-------|--------:|--------:|
| Statistical (best) | 12.23 | 1.674 |
| N-BEATS | 11.82 | 1.612 |
| **TimesNet** | **11.58** ★ | **1.582** ★ |

## 16.4 Classification (UEA archive, paper Table 3)

10 datasets average accuracy:

| Model | Average Accuracy |
|-------|-----------------:|
| HIVE-COTE | 0.728 |
| ResNet | 0.711 |
| PatchTST | 0.738 |
| **TimesNet** | **0.752** ★ |

## 16.5 Anomaly Detection (5 datasets, paper Table 4)

Average F1:

| Model | F1 |
|-------|---:|
| Anomaly Transformer | 0.831 |
| DCdetector | 0.838 |
| **TimesNet** | **0.846** ★ |

## 16.6 Imputation (PhysioNet, paper Table 5)

Average MSE (lower better):

| Model | MSE |
|-------|----:|
| BRITS | 0.187 |
| SAITS | 0.165 |
| **TimesNet** | **0.151** ★ |

## 16.7 Hyperparameters (paper Appendix A)

| 항목 | 값 |
|------|------|
| `d_model` | 64 |
| `d_ff` | 128 |
| `e_layers` | 2 |
| `top_k` (FFT periods) | 5 |
| `num_kernels` (Inception) | 6 |
| Embedding | Linear projection |
| Optimizer | Adam |
| Learning rate | 1e-3 |
| Batch size | 32 |
| Total epochs | 10-30 (task-dependent) |
| Hardware | 1× V100 |

## 16.8 Reproduction Cost

| 항목 | 시간 | 비용 (AWS V100 $2.5/h) |
|------|----:|--------------------:|
| Long-term forecasting (5 datasets) | 8h | $20 |
| Classification (UEA archive) | 12h | $30 |
| Anomaly detection (5 datasets) | 10h | $25 |
| Imputation (PhysioNet) | 4h | $10 |
| **Total all 4 tasks** | **~34h** | **~$85** |

→ *학부생 budget* 안에 *완전 reproduction*.

## 16.9 Ablation Study (paper §4.5)

| 변경 | MSE | 평가 |
|------|----:|------|
| Baseline (top_k=5, num_kernels=6) | **0.265** | ★ standard |
| top_k=1 | 0.298 | single period only |
| top_k=3 | 0.272 | 거의 동등 |
| top_k=10 | 0.268 | diminishing |
| num_kernels=1 | 0.289 | single scale |
| num_kernels=10 | 0.264 | minor gain |
| Without FFT (use fixed period) | 0.305 | manual period inferior |
| Without 2D reshape | 0.295 | 1D conv inferior |

**결정적 발견**:
- **FFT-based dynamic period**: critical (vs fixed)
- **2D reshape**: critical (vs 1D conv)
- **top_k=5, num_kernels=6**: sweet spot

## 16.10 후속 paper 의 후속 결과

### iTransformer (Liu 2024)

```
TimesNet 의 *channel-independent* → iTransformer 의 *channel-aware* (variate tokens):
  - Multi-variate dependency 더 직접
  - Long-horizon 더 좋음
  - Different paradigm
```

### TFM era (Chronos 2024, MOIRAI 2024)

```
TimesNet 의 *specialist* → TFM 의 *generalist*:
  - Per-task training 필요 없음 (zero-shot)
  - 일반 case 에서 TFM 우위
  - 특정 case 에서 TimesNet 우위
```

### Hybrid approaches (2024-2026)

```
- TimesNet backbone + TFM fine-tuning
- FFT-augmented TFM (TimesNet idea 차용)
- Multi-scale TFM (Inception variation)
```

## 16.11 자기점검

### 핵심 3 가지

1. **4 task SOTA 의 *substantive implication*?**
2. **FFT-based dynamic period vs fixed period 의 *robustness 차이*?**
3. **iTransformer / TFM 시대에 TimesNet 의 *unique value*?**

### 답변

1. **General TS backbone 의 *empirical validation***. 4 tasks 모두 SOTA = "*동일 architecture* 가 *forecasting, classification, anomaly, imputation* 모두 작동". *Pre-TimesNet*: 각 task 별 specialized architectures. *Post-TimesNet*: "*backbone + task head*" paradigm. → "*General foundation*" 의 *empirical proof point*.

2. **Non-stationary TS 에서 *robustness***. Fixed period: *prior knowledge 필요* + *non-stationary regime 시 fail*. FFT dynamic: *each window 별 period 자동 감지* + *regime change adaptive*. Real-world TS (금융, sensor) 의 *time-varying periodicity* 에서 *5-15% MSE 차이* — *practical advantage*.

3. **Specialist depth + per-task fine-tune**. TFM 의 *zero-shot generality* 좋음, 하지만 *production critical accuracy* 에서는 *per-task fine-tuned specialist* 가 *수 percent 우위*. TimesNet 의 *small footprint* (3M params) + *high quality per-task* = *deployment cost-effective*. → "*TFM 의 general entry + TimesNet 의 production refinement*" 의 *complementary stack*.
