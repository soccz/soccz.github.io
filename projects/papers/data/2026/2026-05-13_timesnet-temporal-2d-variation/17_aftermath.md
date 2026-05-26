# 17 3 년 Aftermath — Pre-TFM Specialist 의 Evolution (2023-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: TimesNet ICLR 2023 발표 후 3년간 *specialist deep learning TS → TFM era → hybrid stack* 진화.

## 17.1 챕터 한 줄 요약

> **"ICLR 2023 의 TimesNet 가 *pre-TFM specialist era 의 peak*, 2024 의 *TFM era 부상* 으로 *paradigm shift*, 2025-2026 의 *specialist + TFM hybrid stack* 으로 *coexistence*."**

## 17.2 Timeline (2023-2026)

```
2023.04: Wu et al. TimesNet ICLR 2023 ★
            │
2023.06: PatchTST 부상 (channel-independent)
2023.10: Bricken SAE (interpretability era)
2024.01: ContiFormer (irregular TS)
2024.02: Chronos (★ TFM trigger)
2024.04: iTransformer (channel-aware Transformer)
2024.05: MOIRAI (Salesforce TFM)
2024.07: TimesFM (Google TFM)
2025.01: AWS Forecast V2 (Chronos commercial)
2025.05: Hybrid TimesNet + TFM stack
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 (2023) — Pre-TFM Specialist Peak

### 17.3.1 TimesNet 의 *4-task SOTA*

```
2023.04 TimesNet:
  - Forecasting, Classification, Anomaly, Imputation
  - 동일 backbone, 4 task SOTA
  - "*General TS backbone*" 의 *empirical proof*

→ Specialist era 의 *peak*.
```

### 17.3.2 Concurrent specialist (2023)

```
- PatchTST (Nie 2023): channel-independent + patching
- DLinear (Zeng 2022): simple linear baseline
- Crossformer (Zhang 2023): cross-time + cross-variable

→ Specialist landscape 의 *flourishing*.
```

## 17.4 Phase 2 (2024) — TFM Disruption

### 17.4.1 TFM 부상의 *paradigm 변화*

```
2024.02 Chronos:
  - Zero-shot SOTA
  - HuggingFace 즉시 download

2024.05 MOIRAI, 2024.07 TimesFM:
  - 3-way TFM race
  - 모두 zero-shot 우위

→ Specialist 시대 의 *immediate threat*.
```

### 17.4.2 TimesNet 의 *positioning shift*

```
Pre-2024: "*General TS backbone*"
Post-2024: "*Per-task specialist 의 SOTA*"

TFM 의 *general zero-shot* 가 TimesNet 의 *general specialist value* 잠식.
하지만 *per-task fine-tuned* 은 *여전히 우위* (specific domain).
```

## 17.5 Phase 3 (2024-2025) — Methodology Refinement

### 17.5.1 iTransformer (Liu 2024.04)

```
TimesNet 의 *channel-independent* → iTransformer 의 *channel-aware*:
  - Variate tokens (D dimensions)
  - Cross-variate attention
  - Multi-variate dependency 더 직접

→ TimesNet 의 *complementary alternative*.
```

### 17.5.2 PatchTST 의 surge

```
Channel-independent + patching:
  - Production deployment 쉬움
  - Forecasting 만에 specialized
  - TimesNet 보다 *simpler*
  
→ TimesNet 의 *4-task generality* 가 *production cost*.
```

## 17.6 Phase 4 (2025-2026) — Hybrid Stack

### 17.6.1 TimesNet + TFM Hybrid

```
2025-2026 의 production stack:
  - TFM (Chronos) for zero-shot baseline
  - TimesNet for *per-task refinement*
  - Specialist tuning *small datasets*

→ "*Best-of-both*" deployment strategy.
```

### 17.6.2 FFT 의 *TFM augmentation*

```
일부 TFM 의 *TimesNet idea 차용*:
  - FFT-augmented attention
  - Multi-scale embedding
  - Periodic awareness

→ TimesNet 의 *partial inheritance*.
```

## 17.7 4 paradigm shifts

### Shift 1: "Specialist 4-task" → "TFM generalist"
```
2023: TimesNet 4-task SOTA
2024+: TFM zero-shot SOTA
2026: Hybrid stack
```

### Shift 2: "Channel-independent" → "Channel-aware"
```
2023: TimesNet, PatchTST channel-independent
2024+: iTransformer channel-aware
```

### Shift 3: "FFT + conv" → "Pure Transformer"
```
2023: TimesNet FFT-based
2024+: TFM 들 *Transformer 중심*
```

### Shift 4: "Per-task fine-tune" → "Pre-train + zero-shot"
```
2023: TimesNet per-task training
2024+: TFM zero-shot
```

## 17.8 본 paper 의 영향력 — citation trajectory

```
2023.04 (ICLR):       0
2023.10:             ~200
2024.04:             ~500
2024.10:             ~850
2025.10:           ~1,300
2026.05:           ~1,400
```

## 17.9 본 deep dive 의 positioning

```
TS 트랙:
  - TimesNet (★ 본 paper) ↔ pre-TFM specialist peak
  - iTransformer ↔ channel-aware alternative
  - Chronos / MOIRAI / TimesFM ↔ TFM era

APF 트랙:
  - TimesNet 의 FFT + 2D reshape ↔ APF motif identification
  - Multi-scale Inception ↔ multi-resolution attention
```

## 17.10 자기점검

### 핵심 3 가지

1. **TimesNet 의 *3년 후 paradigm shift* 의 가장 critical?**
2. **TFM era 에서 TimesNet 의 *enduring value*?**
3. **Hybrid stack (TFM + TimesNet) 의 *practical deployment*?**

### 답변

1. **"4-task generalist 의 redefinition"**. 2023 의 TimesNet 의 *"general TS backbone"* claim 이 *unique selling point*. 2024 의 TFM 등장으로 *generalist 의 의미가 변경* — *zero-shot generalist* (TFM) vs *per-task generalist* (TimesNet). TimesNet 의 *generalist value* 가 *per-task fine-tuning 효율* 로 *redefined*. → *Paradigm shift* 는 *technical 가 아닌 conceptual* — *generalist 의 definition 변경*.

2. **Per-task fine-tuning 의 *cost-quality optimum***. TFM 의 zero-shot 좋지만, *specific high-stakes domain* (의료, 금융 의 critical forecast) 에서는 *per-task fine-tuning* 이 *수 percent 우위 추가 가치*. TimesNet 의 *small footprint* (3M params) + *flexible 4-task* = *production deployment cost-effective*. → *TFM 의 entry + TimesNet 의 refinement* 의 *complementary roles*.

3. **2-tier deployment**. Tier 1 (TFM): *broad coverage zero-shot* — 새 dataset, 데이터 부족, fast iteration. Tier 2 (TimesNet): *production refinement* — critical accuracy, 충분한 training data, fine-tune cost 정당화. *Workflow*: TFM 으로 *quick baseline* → TimesNet 으로 *production model*. → *industry adoption pattern*.
