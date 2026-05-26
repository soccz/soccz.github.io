# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Chronos 정확 수치 (WAPE, MASE, CRPS), model sizes, hyperparams, reproduction cost.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-4 (GIFT-Eval, Monash benchmarks), Appendix A (model variants), Appendix B (hyperparams), reproduction guide."**

## 16.2 GIFT-Eval Results (paper Table 1)

| Model | WAPE | MASE | CRPS | Zero-shot |
|-------|----:|-----:|-----:|----------|
| Naive | 0.412 | 1.821 | 0.345 | yes |
| ARIMA | 0.345 | 1.420 | 0.281 | yes (per-series) |
| DeepAR | 0.298 | 1.286 | 0.245 | no (fine-tuned) |
| N-BEATS | 0.312 | 1.341 | 0.258 | no |
| PatchTST | 0.281 | 1.124 | 0.218 | no |
| Lag-Llama | 0.265 | 1.012 | 0.205 | yes |
| MOIRAI-base | 0.244 | 0.892 | 0.195 | yes |
| **Chronos-T5-small** | **0.231** ★ | **0.842** ★ | **0.187** ★ | **yes** |
| TimesFM | 0.238 | 0.851 | 0.192 | yes |

**관찰**:
- Chronos-T5-small (60M) 이 *대부분 TFM 능가*
- Zero-shot 이 fine-tuned baseline 도 능가
- TFM era 의 *Chronos-MOIRAI-TimesFM 의 close performance*

## 16.3 Model Family (paper Table 2)

| Size | T5 backbone | Params | WAPE | Latency |
|------|-------------|--------|-----:|--------:|
| Chronos-T5-tiny | T5-tiny | 8M | 0.281 | 10 ms |
| Chronos-T5-mini | T5-mini | 20M | 0.252 | 15 ms |
| Chronos-T5-small | T5-small | 60M | 0.231 | 25 ms |
| Chronos-T5-base | T5-base | 220M | 0.218 | 60 ms |
| Chronos-T5-large | T5-large | 770M | 0.211 | 150 ms |

**Power law**: WAPE ∝ params^(-0.18)

## 16.4 Domain-specific Results (paper Table 3)

| Domain | Chronos | Best fine-tuned | Improvement |
|--------|--------:|----------------:|------------:|
| Finance | 0.218 | 0.265 (PatchTST) | 18% |
| Energy | 0.198 | 0.245 (DeepAR) | 19% |
| Traffic | 0.275 | 0.298 (Informer) | 8% |
| Weather | 0.165 | 0.182 (PatchTST) | 9% |
| Retail | 0.301 | 0.342 (N-BEATS) | 12% |

## 16.5 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Backbone | T5-small (default) |
| Vocab size | 4096 |
| Context length | 96-512 (variable) |
| Forecast horizon | 1-64 |
| Optimizer | AdamW |
| Learning rate | 1e-4 cosine decay |
| Batch size | 128 |
| Training tokens | ~1B (28 datasets) |
| Epochs | 200K steps |
| Hardware | 8× A100 |
| Time | ~7 days |

## 16.6 Reproduction Cost

| 항목 | 시간 | 자원 | 비용 (AWS A100 $4/h) |
|------|----:|-----|--------------------:|
| Chronos-T5-tiny | 24h | 1× A100 | $96 |
| Chronos-T5-small | 168h | 8× A100 | $5,376 |
| Chronos-T5-base | 240h | 8× A100 | $7,680 |
| **Fine-tuning** | 4-24h | 1× A100 | $16-96 |
| **Zero-shot inference** | minutes | 1× A100 | $1 |

→ Pre-training expensive ($5K+), but *zero-shot use cheap* ($1).
→ Fine-tuning affordable ($16-96).
→ HuggingFace 의 *open-source weights* 가 *practical foundation*.

## 16.7 Ablation Study (paper §5)

| 변경 | WAPE | 평가 |
|------|----:|------|
| Baseline (T5-small, vocab 4096) | **0.231** | ★ standard |
| Vocab 1024 | 0.248 | resolution loss |
| Vocab 8192 | 0.230 | diminishing |
| Uniform binning (not quantile) | 0.265 | heavy-tail miss |
| No mean scaling | 0.341 | scale dominance |
| Decoder-only (no encoder) | 0.245 | minor degradation |
| Smaller corpus (5 datasets) | 0.298 | domain bias |

**결정적 발견**:
- **Quantile binning**: critical (vs uniform)
- **Mean scaling**: critical (vs no scaling)
- **Corpus diversity**: critical (28 datasets > 5)
- **Vocab 4096**: sweet spot

## 16.8 후속 paper 의 후속 결과

### MOIRAI (Salesforce, 2024.05)

```
Chronos 후속, variate-aware:
  - Multi-variate native handling
  - Patch-based attention
  - Similar zero-shot performance

→ TFM 의 *parallel development* — competing.
```

### TimesFM (Google, 2024.07)

```
Decoder-only TFM:
  - 200B token training corpus
  - 200M params
  - Similar zero-shot to Chronos

→ Architectural alternative.
```

### Chronos-Bolt (Amazon, 2024.10)

```
Chronos 개선:
  - Faster inference (4×)
  - Better long-horizon
  - HuggingFace updated weights

→ Production-grade upgrade.
```

## 16.9 자기점검

### 핵심 3 가지

1. **Chronos-T5-small (60M) 이 MOIRAI-base, TimesFM (~200M) 보다 *similar performance*인 이유?**
2. **Pretraining $5K vs Zero-shot $1 의 *deployment economics*?**
3. **Domain-specific gain (Finance 18%, Traffic 8%) 의 *domain difficulty 차이*?**

### 답변

1. **Data efficiency + T5 prior**. T5-small 의 *pre-trained NLP knowledge* (Raffel 2020) 가 *quasi-initialization* — random init 모델보다 *much faster convergence*. TimesFM = decoder-only random init. MOIRAI = different architecture. → Chronos 의 *NLP-transfer learning* 이 *small params* 로 *competitive performance*. *Architecture choice 의 hidden value*.

2. **One-time pretraining + cheap deployment**. Amazon 의 *$5K pretraining* 는 *one-time*. 이후 *모든 user* 가 HuggingFace 에서 *free download* → AWS 가 *cloud inference cost* 만 부담 ($1/request). → "*Foundation model 의 cost structure*" — *large up-front + cheap ongoing*. *AWS Forecast* 의 *pricing model* 직접 enable.

3. **Domain pattern uniqueness**. Finance: high noise, heavy tail, *complex stylized facts* — 일반 TS model 어려움, Chronos 의 *diverse pretraining* 이 *transferable capability*. Traffic: *strong periodicity* + *clear pattern* — *all models perform well* — Chronos 의 *relative advantage 작음*. → "*difficult domain 에서 TFM 의 큰 gain*, *easy domain 에서 작은 gain*" — *complementary value*.
