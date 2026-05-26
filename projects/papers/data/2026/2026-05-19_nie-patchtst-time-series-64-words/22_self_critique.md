# 22 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 22.1 챕터 한 줄 요약

> **"4 약점: (1) Channel-independent의 cross-variate 정보 누락, (2) Patch length의 hyperparameter sensitivity, (3) Linear baseline (DLinear)의 *uncomfortable performance*, (4) TFM era에서의 *relative obsolescence*."**

## 22.2 약점 1 — Cross-Variate Information Loss

Channel-independent = 각 variate independently processing → *cross-variate correlation* 무시. Stock returns 의 *sector co-movement* 같은 *strong dependency*에서 *information loss*.

## 22.3 약점 2 — Patch Length Sensitivity

Patch length 8, 16, 24 등 *empirical tuning*. Task / data 별 *optimal length 다름* — *first-principle 부재*.

## 22.4 약점 3 — DLinear의 Uncomfortable

PatchTST보다 *simple DLinear* (단순 linear)가 일부 dataset에서 비슷한 성능. *Architectural complexity의 marginal benefit* 의문.

## 22.5 약점 4 — TFM Era Obsolescence

2024 TFM의 zero-shot SOTA가 PatchTST의 per-task fine-tune 능가. *Specialist value* 감소.

## 22.6 자기점검

### 핵심 3 가지

1. **Cross-variate information loss의 *production scenarios*?**
2. **DLinear의 *simple wins* 의 implication?**
3. **TFM era의 *PatchTST positioning*?**

### 답변

1. **Multi-asset finance, sensor networks, multi-channel medical**. Stock universe = sector co-movement (strong cross-variate). PatchTST의 *per-stock independent* = sector info loss. *iTransformer의 channel-aware* 가 *natural fit*. Sensor networks (다중 센서의 spatial correlation), multi-lead ECG 등 *cross-variate critical* 시나리오.

2. **Architectural complexity의 *premium ratio* 의문**. Zeng et al. 2022 의 DLinear (단순 linear + decomposition) = PatchTST의 비슷한 성능 in 일부 dataset. → "*Complexity 의 marginal value*" 의문. Production: *DLinear의 simplicity + cost-effectiveness* 가 *PatchTST의 marginal accuracy gain*보다 *practical priority*.

3. **Foundation feeder + specialist**. PatchTST = (1) *MOIRAI, Chronos 의 architectural ancestor*, (2) *per-task specialist fine-tune candidate*. TFM era 에서 *standalone specialist value 감소*, but *foundation model 의 building block* 으로 *enduring relevance*. Architectural DNA 가 *industry standard*.
