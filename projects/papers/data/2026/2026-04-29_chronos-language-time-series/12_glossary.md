# 12 Glossary & References — Chronos

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: TS Foundation Model / Token-based forecasting / Probabilistic forecasting 핵심 개념 + reference.

## 12.1 챕터 한 줄 요약

> **"Ansari et al. ICML 2024 의 *language model-style TS foundation model* 의 30+ terminology + 20+ references (TFM, Tokenization, T5, Probabilistic forecasting) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Chronos | Token-based TS foundation model | Ansari 2024 ★ |
| TFM | Time Series Foundation Model | Chronos / MOIRAI / TimesFM era |
| Tokenization | continuous → discrete token mapping | Ansari 2024 |
| Quantile binning | value → bin index | Ansari 2024 |
| Vocab size | total tokens 수 (default 4096) | Ansari 2024 |
| T5 | encoder-decoder Transformer | Raffel 2020 |
| Encoder-Decoder | sequence-to-sequence architecture | Vaswani 2017 |
| Cross-attention | encoder ↔ decoder attention | Vaswani 2017 |
| Zero-shot forecast | no fine-tuning at inference | Brown 2020 |
| In-context learning | prompt-conditioned prediction | Brown 2020 |
| Mean scaling | per-series normalization | Ansari 2024 |
| Probabilistic forecast | predicted distribution, not point | TS classical |
| Quantile loss | pinball loss for quantile | Koenker 2005 |
| CRPS | Continuous Ranked Probability Score | Gneiting 2007 |
| WAPE | Weighted Absolute Percentage Error | Hyndman 2018 |
| MASE | Mean Absolute Scaled Error | Hyndman 2018 |
| Tokenizer | TS preprocessing (scale + bin) | Ansari 2024 |
| Detokenizer | bin → value reconstruction | Ansari 2024 |
| Pretraining corpus | aggregated TS datasets | Ansari 2024 |
| GIFT-Eval | TS benchmark suite | DeepMind 2024 |
| Monash benchmark | classical TS benchmark | Godahewa 2021 |
| Gluonts | Amazon TS forecasting library | Alexandrov 2020 |
| Patch-based | TS chunking strategy | PatchTST 2023 |
| Channel-independent | per-variate processing | Nie 2023 |
| TimesNet | 2D periodic decomposition | Wu 2023 |
| MOIRAI | variate-aware TFM (Salesforce) | Woo 2024 |
| TimesFM | Google decoder-only TFM | Das 2024 |
| Lag-Llama | Llama-style univariate TFM | Rasul 2024 |
| Time-LLM | LLM as TS forecaster | Jin 2024 |
| Probability mass function | discrete distribution | classical |

## 12.3 References (20+)

### 12.3.1 TFM lineage
```
Ansari et al. ICML 2024 — Chronos (★ 본 paper)
Woo et al. 2024 — MOIRAI (Salesforce)
Das et al. 2024 — TimesFM (Google)
Rasul et al. 2024 — Lag-Llama
Jin et al. 2024 — Time-LLM
```

### 12.3.2 Transformer + TS predecessors
```
Vaswani 2017 — Transformer
Raffel 2020 — T5 (encoder-decoder)
Zhou 2021 — Informer
Wu 2023 — TimesNet
Nie 2023 — PatchTST
```

### 12.3.3 Tokenization
```
Ansari 2024 — TS tokenization
Sennrich 2016 — BPE for text
Kudo 2018 — SentencePiece
```

### 12.3.4 Probabilistic forecasting
```
Gneiting 2007 — CRPS, proper scoring rules
Koenker 2005 — Quantile regression
Hyndman 2018 — Forecasting textbook
```

## 12.4 자기점검

### 핵심 3 가지

1. **Tokenization 의 *quantile binning* vs *uniform binning* 의 차이?**
2. **T5 encoder-decoder 가 TS forecasting 에 *natural fit* 인 이유?**
3. **Zero-shot forecast 의 *foundation model 핵심 가치*?**

### 답변

1. **Distribution-aware vs uniform discretization**. Uniform binning: [min, max] 를 동일 간격 분할 — *heavy-tailed data* 시 tail bins 활용도 낮음. Quantile binning: data 의 *quantile 기준* 분할 — 각 bin 에 *동일 sample 수* 보장. Heavy-tailed TS (금융, sensor) 에서 *better resolution at tail*. Chronos default 가 quantile.

2. **Conditional generation 의 natural architecture**. Encoder: context tokens (past) → encoded representation. Decoder: future tokens generation, *cross-attention to encoder*. TS forecasting = "context past + generate future" = *seq-to-seq*. T5 의 *pre-trained encoder-decoder structure* 가 *direct adoption*. Decoder-only (GPT) 도 가능 (TimesFM) 하지만 *encoder-decoder explicit separation*.

3. **Pre-trained generic capability**. Zero-shot = "*추가 학습 없이*" new TS 처리. *Practical value*: 새 dataset 마다 fine-tuning 불필요 → *deployment cost 0*. Pre-training 의 *diverse corpus* 가 *general TS pattern* 학습 → unseen TS 에도 *reasonable forecast*. Foundation model 의 *defining capability*.
