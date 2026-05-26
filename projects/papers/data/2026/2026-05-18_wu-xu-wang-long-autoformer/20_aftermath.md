# 20 5 년 Aftermath — Autoformer Era (2021-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Autoformer NeurIPS 2021 발표 후 5년간 *long-term TS forecasting* 의 진화.

## 20.1 챕터 한 줄 요약

> **"NeurIPS 2021 의 Autoformer가 *long-term TS forecasting 의 architectural revolution* trigger. 2021-2026 의 FEDformer, PatchTST, iTransformer 등 후속 + TFM era 의 *transition*."**

## 20.2 Timeline (2021-2026)

```
2021.06: Wu et al. — Autoformer NeurIPS 2021 ★
2022.05: Zhou et al. — FEDformer (frequency enhanced)
2023.04: Wu et al. — TimesNet (FFT + 2D reshape)
2023.06: Nie et al. — PatchTST (patching)
2024.01: Liu et al. — iTransformer (channel-aware)
2024.02: Ansari et al. — Chronos (TFM era)
2025-2026: TFM dominance
```

## 20.3 Phase 1 (2021-2022) — Direct Variants

```
FEDformer (Zhou 2022):
  - Autoformer + frequency enhanced
  - Linear complexity
  - Same series decomposition
```

## 20.4 Phase 2 (2023) — Architecture Revolution

```
TimesNet (Wu 2023, same author group):
  - FFT-based periodicity
  - 2D reshape
  - "*Beyond series decomposition*"

PatchTST (2023):
  - Channel-independent
  - Patching tokens
  - Different paradigm
```

## 20.5 Phase 3 (2024-2026) — TFM Era

```
2024-2026 의 TS Foundation Models:
  - Chronos, MOIRAI, TimesFM
  - Zero-shot generalization
  - Autoformer 의 *per-task specialist* 의 *generalist alternative*
```

## 20.6 paradigm shifts

### Shift 1: "Self-attention" → "Auto-correlation"
### Shift 2: "Vanilla Transformer" → "Series decomposition Transformer"
### Shift 3: "Per-task specialist" → "Foundation generalist"

## 20.7 자기점검

### 핵심 3 가지

1. **Autoformer 의 *5년 후 paradigm shift*?**
2. **TimesNet 과의 *same author 후속* 의 의의?**
3. **TFM era 에서 Autoformer 의 *positioning*?**

### 답변

1. **Series decomposition + Auto-correlation 의 *architectural revolution***. Pre-Autoformer = vanilla Transformer attention. Autoformer = *series decomposition* (trend + seasonal) + *auto-correlation* (FFT-based). → Long-term forecasting 의 *paradigm-defining contribution*. 후속 FEDformer, TimesNet 의 *direct ancestor*.

2. **Authorial continuity → mature methodology**. Wu et al. = Tsinghua TS school. Autoformer (2021) → TimesNet (2023) = 2년 간 *same group 의 evolution*. *Auto-correlation* → *FFT explicit + 2D reshape* 의 *progressive improvement*. *Coherent research trajectory*.

3. **Specialist depth in TFM era**. TFM (Chronos) = *generic forecasting*. Autoformer = *long-term specialist* — particular *long horizon* (720+ step) 의 *specific architecture*. Production 의 *specific high-stakes domain* 에서 *fine-tuned specialist value*. *Hybrid TFM + Autoformer* deployment 가능.
