# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: ACDC 의 알고리즘 + IOI circuit + KL threshold sweep + manual vs automated 비교 의 시각.

## 15.1 ASCII — ACDC Algorithm Pipeline

```
Step 1: Build full computational graph G
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │ Embed   │ ──▶ │ Layer 1 │ ──▶ │ Layer 2 │ ──▶ ... ──▶ Output
  └─────────┘     │ heads   │     │ heads   │
                   │ MLPs    │     │ MLPs    │
                   └─────────┘     └─────────┘
                       │                │
                       └────────────────┘
                       (all edges enumerated)

Step 2: For each edge e (reverse topological order):
  - Compute KL(clean || ablate(e))
  - If KL < τ: edge is unnecessary → remove
  - Else: edge is necessary → keep

Step 3: Final circuit C* = kept edges
```

## 15.2 ASCII — IOI Circuit (paper §4 Figure 2)

```
IOI: "When Mary and John went to the store, John gave a drink to ___"
Answer: "Mary"

Discovered 26-edge circuit:

  Embed
    │
    ├──→ L0 H1 (S1 token detection) ──┐
    ├──→ L0 H7 (IO token detection) ──┤
    │                                  ▼
    │                              L4 H5 (S-Inhibition head)
    │                                  │
    ├──→ L5 H3 (Subject Head) ─────────┤
    │                                  ▼
    │                              L9 H9 (Name Mover head 1)
    │                                  │
    └──→ L10 H7 (Name Mover head 2) ──┤
                                      ▼
                                 Output: "Mary"

Key heads:
  - S-Inhibition (L4 H5): inhibit duplicate name (S1 instance #2)
  - Name Movers (L9 H9, L10 H7): move name to output position
  - Subject heads (L5 H3): track subject identity
```

## 15.3 ASCII — KL Threshold Sweep

```
Threshold (τ) effect on circuit size:

  Circuit size
  150 ┤━ (full graph)
       │
   80 ┤    ┌── τ=0.001 (too small, almost no pruning)
       │    │
   50 ┤    │    ┌── τ=0.01 (some pruning)
       │    │    │
   26 ┤    │    │    ★ τ=0.06 (paper default — IOI 26 edges)
       │    │    │   
   10 ┤    │    │    │    ┌── τ=0.5 (too aggressive)
       │    │    │    │    │
    0 ┤────────────────────┘ (over-pruning, broken)
       └────┴────┴────┴────┴───
           0.001  0.01  0.06  0.5
                  Threshold τ

Goldilocks: τ = 0.05 - 0.1
```

## 15.4 ASCII — Manual vs Automated Comparison

```
Olsson 2022 (Manual induction heads):
  - Team: 3 Anthropic researchers
  - Time: 2 weeks of analysis
  - Output: "L2 H7 is induction head" (1 finding)
  - Reproducibility: requires expertise

ACDC 2023 (Automated):
  - Team: 1 person + GPU
  - Time: 1 hour
  - Output: All induction circuit edges (rediscovers Olsson)
  - Reproducibility: 100% (deterministic algorithm)

Speedup: 100×
Coverage: 10× (more edges)
Replicability: ★★★
```

## 15.5 ASCII — Task Validation Matrix

```
Task             Circuit size   ACDC time   Manual baseline
─────────────────────────────────────────────────────────────
IOI                  26 edges    1.5h       2 weeks (Wang 2022)
Greater-than         18 edges    1.0h       1 week (manual)
Induction            12 edges    0.5h       2 weeks (Olsson 2022)
Subject-Verb         15 edges    0.8h       1 week
Docstring            22 edges    1.2h       Not done previously
─────────────────────────────────────────────────────────────
Total                93 edges    5h         6 weeks+
```

## 15.6 ASCII — Circuit Sparsity Across Models

```
Model            Total heads   IOI circuit   Sparsity
─────────────────────────────────────────────────────
GPT-2 small         144          26          18%
GPT-2 medium        384          ~45         12%
GPT-2 large         900          ~80         9%
LLaMA-7B           1024          ~70         7%

→ Larger models = sparser circuits per task
   (specialized circuits emerge more clearly)
```

## 15.7 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `acdc-algorithm-flow` | 05c/d, 13, 15 | ACDC step-by-step | iteration slider |
| `acdc-ioi-circuit` | 02, 06, 15 | IOI 26-edge graph | edge highlight |
| `acdc-threshold-sweep` | 05e, 13, 15 | τ vs circuit size | threshold slider |
| `acdc-task-comparison` | 06, 13, 15 | 5 task circuit comparison | task selector |

## 15.8 자기점검

### 핵심 3 가지

1. **IOI circuit 의 *S-Inhibition head* 의 role?**
2. **Threshold τ=0.06 의 *empirical Goldilocks*?**
3. **Manual vs Automated 의 *speedup 100×* 의 implications?**

### 답변

1. **Duplicate name 의 *suppression***. IOI = "Mary and John went... John gave to ___". *John* 이 *두 번* 나타남 (S1 = first occurrence, S2 = second). 모델이 *S2 (second John)* 가 *target 이 아님* 인식해야 — *Mary (IO)* 를 outputting. S-Inhibition head 가 *S2 의 contribution suppress* — *Indirect Object identification* 의 *negative path*.

2. **KL = 0.06 의 *bits 환산*. log2(e) × 0.06 ≈ 0.087 bits — *output distribution* 의 *information change*. **너무 작음** (< 0.01): noise level. **너무 큼** (> 0.5): catastrophic change. **0.06** = "small but measurable" — *true causal effect* 의 threshold.

3. **Mechanistic interpretability 의 *democratization***. Pre-ACDC: *Anthropic-tier expertise* + *수주 시간* 필요. Post-ACDC: *학부생 + 1 hour* 로 *similar 깊이*. **결과**: (a) replication studies 폭증, (b) cross-model comparisons, (c) educational tool, (d) industry production-ready mech interp.

---

## 인터랙티브 시각화

```viz:acdc-algorithm-flow:title=Algorithm,caption=Step.
```

```viz:acdc-ioi-circuit:title=IOI Circuit,caption=Highlight.
```

```viz:acdc-threshold-sweep:title=τ Sweep,caption=τ slider.
```

