# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: paper 의 핵심 mechanism 을 ASCII 도식 + 인터랙티브 viz 로 시각화. Composition / Comparison task 의 *task design*, Grokking transition 의 *training dynamics*, Logit Lens / Causal Tracing 의 *mechanistic analysis*.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 5+ 인터랙티브 viz 로 Wang 2024 의 *2 task design* + *grokking transition trajectory* + *mechanistic circuit emergence* + *LLM 비교* 의 full pipeline 을 visual 형태로 압축."**

## 15.2 ASCII 도식 — Composition vs Comparison Task

```
COMPOSITION TASK (2-hop transitive):

  Entity graph:
    A ─── r1 ───→ B ─── r2 ───→ C
    │                              ↑
    └──── (A, r1, r2) → ? ─────────┘

  Input:  [A, r1, r2]
  Target: C

  Train: random (A, r1, r2) triples 의 (X, Y, Z) tuple 학습
  Test ID: same entities, new triples
  Test OOD: novel entities (학습 시 미사용)
  
  
COMPARISON TASK (relational ordering):

  Entity attributes:
    A.attr_k = 0.72
    B.attr_k = 0.31
    C.attr_k = 0.85
    
  Input:  [A, B, attr_k]
  Target: A > B ? (True or False)

  Train: random (A, B, attr_k) pairs
  Test ID: same entities
  Test OOD: novel entities
```

## 15.3 ASCII 도식 — Grokking Training Trajectory

```
Accuracy
   1.0 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (Train, 100% after step 50K)
        │
   0.8 ┤                              ┌─────── (Val ID, after grokking)
        │                              │
   0.6 ┤                              │
        │       Phase 2:              │
   0.4 ┤      memorization            │  Phase 3:
        │  (overfit, no               │  grokking
   0.2 ┤   generalization)            │  transition
        │                              │
   0.0 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘━━━━━━━━━━ (Val OOD, 0% then jump)
        └────┬──────┬───────┬───────┬──────────
             50K   500K    1M     5M    10M
                          Training step

Phase 1 (0-50K):   random predictions
Phase 2 (50K-1M):  train 100%, val OOD 0% (memorization)
Phase 3 (1M-5M):   grokking transition (OOD 0% → 100%)
Phase 4 (5M+):     stable grokked state
```

## 15.4 ASCII 도식 — Logit Lens (Layer-wise prediction)

```
Layer-by-layer prediction confidence on correct answer (Composition task):

  Logit
   0.9 ┤                                              ███
        │                                          ██████
   0.7 ┤                                      ██████████
        │                                  ██████████████
   0.5 ┤                              ██████████████████
        │                          ██████████████████████
   0.3 ┤                      ██████████████████████████
        │                  ██████████████████████████████
   0.1 ┤              ██████████████████████████████████
        │      ██████████████████████████████████████████
   0.0 ┤██████████████████████████████████████████████████
        └──────────────────────────────────────────────────
           L1   L2   L3   L4   L5   L6   L7   L8
                     Transformer Layer

Insights:
  - L1-L2: 정답 logit 0 (no signal)
  - L3-L4: emerging signal (~0.3)
  - L5-L6: strong commitment (~0.6)
  - L7-L8: final refinement (~0.9)
  
  → Generalization circuit 가 *L4-L6* 에 localized
```

## 15.5 ASCII 도식 — Causal Tracing Heatmap

```
Effect of patching specific (layer, position) on prediction:

          Position →
        ┌──────────────────┐
   L1   │ . . . . . . . . │
   L2   │ . . . . . . . . │
   L3   │ . . . . . . . . │
   L4   │ . . . . ★ . . . │  ← 최대 causal effect at L4, pos=4 (mid-token)
   L5   │ . . . ★ ★ . . . │
   L6   │ . . ★ ★ ★ . . . │
   L7   │ . . ★ ★ . . . . │
   L8   │ . . ★ . . . . . │  ← L8 의 final answer 도 약간
        └──────────────────┘
        Pos 1 2 3 4 5 6 7 8

★ = high causal effect (>0.5)
. = low effect

Insights:
  - L4-L7 의 mid-positions = generalization circuit 의 "hot region"
  - Generalization 의 *specific localized component* 식별
```

## 15.6 ASCII 도식 — LLM Comparison Bar Chart

```
Accuracy on Composition Task (1000 test examples):

  Grokked Transformer (12M params)  ████████████████████████ 99.5% ★
  GPT-4 + CoT                       ███████████████          62.0%
  GPT-4 + RAG                       █████████████████        71.0%
  Gemini-1.5-Pro + CoT              █████████████            58.0%
  Random baseline                   ██                        5.0%
                                    └────────────────────────────
                                    0%                       100%

Insights:
  - 0.0007% of GPT-4 size → 99.5% > 62%
  - Parametric memory > prompt-based reasoning (복잡 task)
```

## 15.7 Viz 카탈로그 (인터랙티브)

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `gt-composition-circuit` | 02, 05c, 15 | Composition task 의 2-hop circuit 시각 | step slider |
| `gt-comparison-circuit` | 02, 05c, 15 | Comparison task 의 ordering circuit | attribute selector |
| `gt-grok-trajectory` | 05a, 13, 15 | Training accuracy trajectory (4 phases) | model variant toggle |
| `gt-logit-lens` | 05d, 14, 15 | Layer-by-layer prediction confidence | task selector |
| `gt-llm-comparison` | 02, 13, 15 | LLM vs Grokked bar chart | metric toggle |

## 15.8 자기점검 (이 챕터)

### 핵심 3 가지

1. **Composition vs Comparison ASCII 도식의 *결정적 차이*?**
2. **Grokking trajectory 의 *4 phase* 의 *empirical signature*?**
3. **Logit Lens + Causal Tracing 의 *2-fold visual analysis*?**

### 답변

1. **Reasoning structure 차이**. Composition = *categorical chain* (A→B→C 의 specific entity 의 transitive). Comparison = *continuous ordering* (attr_k 의 *real-valued comparison*). Visual: composition 은 *graph node-edge*, comparison 은 *number line*. → *generalization 의 fundamental 차이* 의 *시각적 표현*.

2. **Phase 2 → Phase 3 transition 의 *sharpness***. Phase 1: random (loss high). Phase 2: train 100%, OOD 0% (long plateau, *delayed* generalization 의 핵심). Phase 3: *sudden* OOD jump (0% → 90%+ in ~100K steps). Phase 4: stable. → "*grokking transition*" 의 *abrupt sigmoid* shape — *predictable* but *delayed*.

3. **Logit Lens** = *layer 축* 분석 ("어느 layer 에서 답 emerge"). **Causal Tracing** = *layer × position 축* 2D 분석 ("어느 component 가 *causal*"). 결합 → "*generalization circuit* 의 spatio-temporal localization" — *circuit identification* 의 standard pipeline.

---

## 인터랙티브 시각화

```viz:gt-composition-circuit:title=paper §3.1 Visualization — Composition Circuit,caption=Stage slider. paper §3 의 task design + circuit emergence.
```

```viz:gt-logit-lens:title=paper Fig 4 — Layer-wise Prediction,caption=Task 토글. Logit Lens.
```

```viz:gt-causal-tracing:title=paper Fig 4 — Causal Effect Heatmap,caption=Layer × Position 의 causal tracing.
```

