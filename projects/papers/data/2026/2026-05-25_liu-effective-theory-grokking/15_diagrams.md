# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Liu Effective Theory 의 *phase diagram*, *4 phases*, *circular embedding* 의 visual narrative.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *phase diagram*, *4-phase classification*, *embedding circular structure*, *phase transition dynamics* 의 visual narrative."**

## 15.2 ASCII 도식 — Phase Diagram (paper Figure 3)

```
PHASE DIAGRAM (WD vs LR):

  Weight Decay
        │  Confusion (no learn)
   1.0  ┤──────────────────────────────
        │
   1e-1 ┤  Comprehension (partial)
        │     ┌──────────────────┐
   1e-2 ┤     │ ★ GENERALIZE     │  ← grokking zone
        │     │   (full grok)    │
   1e-3 ┤     │                  │
        │     └──────────────────┘
   1e-4 ┤  Memorize (overfit)
        │
   0    ┤  Memorize (no regularization)
        └──┬──┬──┬──┬──┬──┬──────────► Learning Rate
           1e-4 3e-4 1e-3 3e-3 1e-2 3e-2

  4 phases:
    - Confusion: WD=0 or too high
    - Memorize: WD too low + high LR
    - Comprehension: borderline regime
    - Generalize: ★ Goldilocks zone
```

## 15.3 ASCII 도식 — 4-Phase Classification

```
TRAIN vs VAL ACCURACY PLANE:

  Val
   100% ┤              ★ GENERALIZE
        │            ┌──────────────────
   90%  ┤            │ (train≈val≈100%)
        │            │
   70%  ┤   COMPREHENSION (partial)
        │     ┌──────────────────
   50%  ┤     │ (train high, val partial)
        │     │
   30%  ┤     │
        │     │
   10%  ┤  CONFUSION   MEMORIZE
        │  (no learn)  (overfit)
    0%  ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━
        └─────┬──────────────────────► Train
        0%   50%               100%

  4 quadrants = 4 phases.
```

## 15.4 ASCII 도식 — Circular Embedding Structure

```
EMBEDDING POST-GROKKING (paper §4):

  Pre-grokking embeddings (PCA to 2D):
  
     ●  random
   ●     ●  scattered
       ●        ●
   ●      ●   ●
     ●         ●
       ●  ●

  Post-grokking embeddings (PCA to 2D):
  
              0
           23 ● ● 1
        22 ●    ● 2
       21 ●      ● 3
       20 ●      ● 4
       19 ●      ● 5
       18 ●      ● 6
        17 ●    ● 7
           16 ● ● 8
              ●...

  → Regular p-gon (cyclic group Z_p representation)
  → "*Group structure 의 implicit learning*"
```

## 15.5 ASCII 도식 — Phase Transition Dynamics

```
ORDER PARAMETER OVER TRAINING:

   Circular structure score
        │
   1.0  ┤                              ┌──── (grokked, structure formed)
        │                              │
   0.8  ┤                              │
        │                              │ rapid jump
   0.6  ┤                              │
        │                              │
   0.4  ┤                              │
        │                              │
   0.2  ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
        │
   0.0  ┤━━━━━━━━━━━━━━━━━━━━━━ (random, no structure)
        └────────────────────────────────────────────────► training step
        0          1M         2M         3M         5M

  Phase transition signature:
    - Slow buildup (0 to 0.2)
    - Rapid jump (0.2 to 1.0 in 100K steps)
    - "*Order from disorder*" emergence
```

## 15.6 ASCII 도식 — Universality Across Tasks

```
LIU 2023 의 universality 가설:

   Different tasks/architectures, same scaling behavior:
   
   Task A (modular addition):
     transition steps ∝ p^α  with α=1.5
   
   Task B (modular multiplication):
     transition steps ∝ p^α  with α=1.6
   
   Task C (parity check):
     transition steps ∝ p^α  with α=1.4
   
   → "Same universality class"?
   → Physics universality applied to ML
```

## 15.7 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `liu-phase-diagram` | 05c, 14, 15 | WD×LR phase diagram | task selector |
| `liu-4-phases` | 05c, 14, 15 | Train vs Val 4-quadrant plot | example selector |
| `liu-circular-embed` | 06, 14, 15 | Embedding circular structure | training step slider |

## 15.8 자기점검

### 핵심 3 가지

1. **Phase diagram 의 *boundary universality*?**
2. **Circular embedding 의 *group structure interpretation*?**
3. **Phase transition 의 *order parameter* 의 *physics analogy*?**

### 답변

1. **Conjectured but not fully validated**. Liu paper 는 *modular addition* 에서 phase boundary 측정 — *similar pattern in other tasks* 가설 제시. 후속 paper (Lyle 2024, Wang 2024) 가 *similar phase structure* 보고 — *partial universality validation*. *Cross-task universal* 인지 *fully proved 아님*. *Open research direction*.

2. **Cyclic group Z_p 의 *representation theory***. Modular addition = *cyclic group* operation. Group theory: cyclic group 의 *natural representation* = "*rotation around circle*". Embedding 의 PCA → *2D circle* 면 "*model 이 group structure 학습*". → *Lie group representation* 의 implicit learning. 후속 *Group equivariant NN* 의 *empirical foundation*.

3. **Physics universality 의 ML 적용**. Physics phase transition 에서 *order parameter* = *macroscopic state descriptor* (e.g., magnetization). ML 에서 *circular structure score* = *learning state descriptor*. → "*Microscopic gradient dynamics* 의 *macroscopic emergent order*" 의 *quantitative measure*. *Statistical mechanics 의 ML* 의 *foundational concept*.

---

## 인터랙티브 시각화

```viz:liu-phase-diagram:title=paper Fig 3 — Phase Diagram,caption=Task selector.
```

```viz:liu-4-phases:title=paper §4 — 4 Phases,caption=Example selector.
```

```viz:liu-circular-embed:title=paper §5 — Circular Embedding,caption=Training step slider.
```
