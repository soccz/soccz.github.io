# 17 2 년 Aftermath — TS Foundation Model Era (2024-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Chronos ICML 2024 발표 후 2년간 *TS Foundation Model 의 explosion*. Industry deployment + family proliferation.

## 17.1 챕터 한 줄 요약

> **"ICML 2024 의 Chronos 가 *TS Foundation Model era* 를 trigger. 2024-2026 의 *Amazon-Salesforce-Google 3-way race*, *open-source ecosystem*, *AWS Forecast V2 integration*, *commercial TFM products* 의 dramatic explosion."**

## 17.2 Timeline (2024-2026)

```
2024.02: Ansari et al. Chronos ICML 2024 ★
            │
2024.04: ContiFormer (irregular TS)
2024.05: MOIRAI (Salesforce variate-aware)
2024.07: TimesFM (Google decoder-only)
2024.08: Lag-Llama (univariate Llama-style)
2024.10: Chronos-Bolt (Amazon update)
2024.11: Time-LLM (LLM as forecaster)
2025.01: AWS Forecast V2 (Chronos-based)
2025.04: TimesFM-2.0 (1B params)
2025.07: Production deployment in retail/energy
2025.10: Foundation model benchmark suites (GIFT-Eval)
2026.03: Multi-modal TFM (TS + text)
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 (2024) — TFM Triangle

### 17.3.1 Three-way race

```
Amazon (Chronos):
  - T5 encoder-decoder
  - Quantile token
  - GluonTS integration

Salesforce (MOIRAI):
  - Patch-based
  - Variate-aware
  - Mixture-of-experts

Google (TimesFM):
  - Decoder-only
  - 200M params
  - Largest pretraining corpus
```

### 17.3.2 Open-source explosion

```
HuggingFace TS:
  - Chronos weights download
  - MOIRAI checkpoints
  - TimesFM weights
  - 학계 + industry 의 *immediate adoption*
```

## 17.4 Phase 2 (2024-2025) — Methodology Refinement

### 17.4.1 Chronos-Bolt (2024.10)

```
Amazon 의 후속:
  - 4× faster inference (efficient decoding)
  - Better long-horizon
  - HuggingFace updated
```

### 17.4.2 TimesFM-2.0 (2025.04)

```
Google 의 scale up:
  - 1B params (5× original)
  - 1T tokens pretraining
  - Marginal improvement (diminishing return)
```

### 17.4.3 Time-LLM (2024.11)

```
LLM as TS forecaster:
  - Pretrained LLM (GPT, Llama) 직접 사용
  - "Text prompt + TS data" 의 unified input
  - Chronos 보다 *more general*, *less efficient*
```

## 17.5 Phase 3 (2025-2026) — Industry Deployment

### 17.5.1 AWS Forecast V2 (2025.01)

```
Amazon 의 commercial product:
  - Chronos-based backbone
  - Customer 가 *zero-shot 또는 fine-tune*
  - Auto-tuning
  - Production-grade SLA
```

### 17.5.2 Retail / Energy Deployment

```
2025-2026 의 *enterprise adoption*:
  - Walmart, Target: demand forecasting
  - Utilities: load forecasting
  - Hedge funds: market microstructure

→ TFM 의 *production tool* 정착.
```

### 17.5.3 Multi-modal TFM (2026.03)

```
2026 의 새 paradigm:
  - TS + Text (news, reports) 결합
  - TS + Image (satellite, sensor map)
  - Cross-modal forecasting

→ Chronos 의 *next-gen direction*.
```

## 17.6 4 paradigm shifts

### Shift 1: "Per-task fine-tuning" → "Zero-shot foundation"
```
Pre-2024: 각 dataset 마다 fine-tune
2024+: Foundation model zero-shot
```

### Shift 2: "Domain-specific architecture" → "Generic LLM-style"
```
Pre-2024: PatchTST, TimesNet, custom
2024+: T5/Llama/GPT-style
```

### Shift 3: "Academic SOTA" → "Industry product"
```
2024: Chronos paper
2025: AWS Forecast V2
2026: Enterprise integrations
```

### Shift 4: "Univariate" → "Multi-variate + Multi-modal"
```
2024: Univariate focus
2025: Multi-variate (MOIRAI)
2026: Multi-modal (TS + text + image)
```

## 17.7 본 paper 의 영향력 — citation trajectory

```
2024.02 (ICML):       0
2024.08:             ~250
2025.02:             ~620
2025.08:             ~900
2026.05:           ~1,100
```

## 17.8 본 deep dive 의 positioning

```
TFM 트랙:
  - Chronos (★ 본 paper) ↔ Amazon axis
  - MOIRAI ↔ Salesforce axis
  - TimesFM ↔ Google axis
  - 3-way active

APF 트랙:
  - TFM attention pattern 분석 가능
  - Token level의 motif identification
```

## 17.9 자기점검

### 핵심 3 가지

1. **Chronos 의 *TFM trigger* 인 이유?**
2. **3-way race (Amazon/Salesforce/Google) 의 *complementary or competing*?**
3. **AWS Forecast V2 의 *commercial significance*?**

### 답변

1. **First compelling open-source TFM**. Pre-2024 의 TS deep learning = *per-task fine-tuning*. Chronos = *first TFM* with (1) *open-source weights* (HuggingFace), (2) *demonstrated zero-shot SOTA*, (3) *production-ready inference*. → "*TS도 foundation model paradigm 적용 가능*" 의 *empirical proof* + *immediate community adoption catalyst*. Subsequent MOIRAI/TimesFM 가 *Chronos 의 trail* 따름.

2. **Both — complementary + competing**. **Competing**: similar zero-shot benchmark performance, similar deployment readiness. **Complementary**: Chronos (univariate, encoder-decoder), MOIRAI (multi-variate, MoE), TimesFM (decoder-only, large pretraining). *Different use cases* optimal — multi-vendor strategy. *Active research field* — 2-3 years more before *single winner* emerges.

3. **Cloud TS forecasting commodification**. AWS Forecast V2 = "*Chronos as a service*" — customer 가 *zero ML knowledge* 로 forecasting 가능. *Pricing*: per-forecast, no infrastructure cost. → *forecasting commodity 화* — 기존 *in-house ML team* 필요 없음. *Industry implication*: 중소기업 의 *foundation TS capability* 접근 enable. *Amazon 의 strategic moat*.
