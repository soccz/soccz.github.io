# 21 3 년 Aftermath — PatchTST Era (2023-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: PatchTST ICLR 2023 발표 후 3년간 *channel-independent + patching* TS forecasting 의 진화.

## 21.1 챕터 한 줄 요약

> **"ICLR 2023 의 PatchTST가 *channel-independent + patching* 의 paradigm shift. 2023-2026 의 iTransformer 등 후속 + TFM era 의 *foundational architecture*."**

## 21.2 Timeline (2023-2026)

```
2023.04: Nie et al. — PatchTST ICLR 2023 ★
2023.04: Wu et al. — TimesNet (concurrent)
2024.01: Liu et al. — iTransformer (channel-aware alternative)
2024.02: Ansari et al. — Chronos (token-based TFM)
2024.05: Woo et al. — MOIRAI (patch-based TFM)
2025+: TFM dominance with PatchTST DNA
```

## 21.3 Phase 1 (2023) — Direct Adoption

```
PatchTST의 paradigm:
  - Channel-independent
  - Patching (TS → sequence of patches)
  - Standard Transformer encoder
  - "*ViT for TS*"

→ 즉시 다양한 dataset에서 SOTA. Industry 빠른 adoption.
```

## 21.4 Phase 2 (2024) — Paradigm Refinement

```
iTransformer 2024 (counter):
  - PatchTST의 channel-independent → iTransformer의 channel-aware
  - Variate tokens
  - Cross-variate dependency 명시 처리

→ "Channel-independent vs channel-aware" 의 *paradigm debate*.
```

## 21.5 Phase 3 (2024-2026) — TFM Foundation

```
TFM의 PatchTST DNA:
  - MOIRAI: patch-based
  - Chronos: token-based (related)
  - PatchTST 의 *patching 가 TFM standard*

→ "Patching" 이 *TFM era 의 default*.
```

## 21.6 paradigm shifts

### Shift 1: "Channel-aware" → "Channel-independent" → "Channel-aware again"
### Shift 2: "Single-token" → "Patch tokens"
### Shift 3: "Specialist" → "TFM with PatchTST DNA"

## 21.7 자기점검

### 핵심 3 가지

1. **PatchTST의 *3년 후 paradigm impact*?**
2. **Channel-independent vs channel-aware 의 *back-and-forth*?**
3. **TFM era 에서 PatchTST의 *enduring value*?**

### 답변

1. **Patching paradigm 의 TFM standard 정착**. Pre-PatchTST = single-token per step (Informer, Autoformer). PatchTST = *patch tokens* — *ViT-style approach*. MOIRAI, Chronos 등 TFM이 *patching adoption*. → "*Patching 이 TFM era 의 default architectural choice*". PatchTST의 *DNA*가 *모든 후속 TFM에 inherited*.

2. **Empirical exploration of design space**. 2023 PatchTST: channel-independent (simpler, no cross-variate noise). 2024 iTransformer: channel-aware (cross-variate dependency 명시 처리). 둘 다 *empirically valid* — *different trade-offs*. *Active research debate* — 어떤 setting에서 어느 게 우월. *Multi-vendor production*.

3. **Specialist depth + foundation feeder**. TFM이 *generic* — but *specific high-precision domain* (energy load, traffic flow)에서 *fine-tuned PatchTST specialist* 가 *수 percent 우위*. 또한 *PatchTST architecture 가 TFM pre-training의 building block*. *Specialist + foundation feeder 의 dual role*.
