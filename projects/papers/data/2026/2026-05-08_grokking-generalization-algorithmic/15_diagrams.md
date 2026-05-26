# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Power 2022 의 *grokking trajectory*, *modular task*, *weight decay role*, *phase transition* visualization.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *delayed generalization curve*, *modular arithmetic task*, *phase transition dynamics*, *weight decay ablation* 의 visual narrative."**

## 15.2 ASCII 도식 — Grokking Trajectory (The Canonical Plot)

```
ACCURACY OVER TRAINING (the canonical Power 2022 plot):

  Accuracy
   100% ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Train (100% from step 50K)
        │                                                                       
   90%  ┤                                              ┌────────────── Val (after grok)
        │                                              │                       
   80%  ┤                                              │                       
        │                                              │                       
   70%  ┤                                              │                       
        │      ▮▮ memorization phase                  │                       
   60%  ┤                                              │                       
        │                                              │                       
   50%  ┤                                              │                       
        │                                              │                       
   40%  ┤                                              │                       
        │                                              │                       
   30%  ┤                                              │ grokking transition   
        │                                              │                       
   20%  ┤                                              │                       
        │                                              │                       
   10%  ┤                                              │                       
        │                                              │                       
    0%  ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘ Val (0% before grok)
        └────┬──────┬───────┬────────┬───────┬──────────────────────────
             10K   50K    100K     500K    1M       2M      5M
                                  Training step
                                                                       
Phase 1 (0-50K):    random predictions
Phase 2 (50K-1M):   train 100%, val 0% (memorization plateau)
Phase 3 (1M-2M):    grokking transition (val 0% → 100%)
Phase 4 (2M+):      stable grokked state
```

## 15.3 ASCII 도식 — Modular Arithmetic Task

```
TASK: (a + b) mod p

  Example p=5:
  
   a\b  0   1   2   3   4
   0    0   1   2   3   4
   1    1   2   3   4   0
   2    2   3   4   0   1
   3    3   4   0   1   2
   4    4   0   1   2   3
   
   Total: 25 (a, b) pairs.
   Train fraction 0.3 = 7-8 pairs visible.
   Val fraction 0.7 = 17-18 pairs unseen.
   
   Network must *learn the rule* not *memorize values*.
```

## 15.4 ASCII 도식 — Phase Transition Picture

```
TRAINING DYNAMICS (state-by-state):

  Phase 1: Random initialization
  ──────────────────────────────
  Weights: ~N(0, 1/√d) — Gaussian noise
  Prediction: uniform random
  Accuracy: 1/p (chance level)
  
  Phase 2: Memorization (steps 1K-100K)
  ──────────────────────────────
  Weights: high-magnitude, irregular patterns
  Prediction: memorized (a, b) → c mapping
  Train acc: → 100% (memorized)
  Val acc: ~0% (no generalization)
  
  Phase 3: Slow restructuring (steps 100K-1M)
  ──────────────────────────────
  Weight decay 의 *gradual pressure*
  Weights start to *organize into Fourier-like structure*
  Internal: silent circuit formation
  External: val still ~0% (deceptive)
  
  Phase 4: Grokking transition (steps 1M-2M)
  ──────────────────────────────
  Circuit reaches critical threshold
  Sudden val accuracy jump 0% → ~100%
  Mechanistic: Fourier feature emergence
  
  Phase 5: Stable grokked (steps 2M+)
  ──────────────────────────────
  Circuit stable, val ≈ train ≈ 100%
```

## 15.5 ASCII 도식 — Weight Decay Ablation

```
WEIGHT DECAY 의 GROKKING 영향 (paper §5):

   Final val accuracy
        │
   100% ┤              ★ WD=1e-2 (grok, 5M steps)
        │
    80% ┤
        │
    60% ┤              ▮ WD=1e-3 (grok very slow, 50M steps)
        │
    40% ┤
        │
    20% ┤
        │
     0% ┤  WD=0 ▮     WD=1e-1 ▮ (no grok, over-regularize)
        └───────────────────────────
        0     1e-3    1e-2    1e-1    1.0
              Weight decay coefficient

  → WD=1e-2 가 *Goldilocks zone*.
  → WD=0 = *catastrophic failure*.
  → WD=1e-1 = *over-regularization fail*.
```

## 15.6 ASCII 도식 — Train Fraction vs Grokking Speed

```
TRAIN FRACTION 의 영향:

   Training fraction   Grokking happens?   Steps to grok
   ──────────────────────────────────────────────────────
   0.1 (10%)           ✗ (insufficient data)   ∞
   0.2                 ✗                         ∞
   0.3 (★ paper)       ✓                         ~5M
   0.4                 ✓                         ~3M
   0.5                 ✓                         ~1M
   0.7                 ✓                         ~500K
   0.9                 ✓                         ~100K (near-memorize)
   1.0                 N/A (no val)             N/A
   ──────────────────────────────────────────────────────

  Sweet spot: 0.3-0.5
  Too little: no grokking
  Too much: easy task, no interesting dynamics
```

## 15.7 ASCII 도식 — Internal Weight Visualization

```
WEIGHT MATRIX VISUALIZATION (post-grokking, paper §4):

  Embedding weights (token → R^d):
  
  Pre-grokking (memorized):
   ┌──────────────────────────┐
   │ random noise pattern     │
   │ no structure visible     │
   └──────────────────────────┘
   
  Post-grokking:
   ┌──────────────────────────┐
   │ ▲▲▲ Fourier-like waves   │
   │ ─── periodic patterns    │
   │ structured concentric   │
   └──────────────────────────┘
   
  → Internal weights *transform* from chaos to structure.
  → Nanda 2023 이 이 structure 를 *Fourier circuit* 로 식별.
```

## 15.8 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `power-grokking-curve` | 02, 06, 15 | Train/Val accuracy over time | log/linear toggle |
| `power-modular-task` | 03, 15 | Modular arithmetic visualization | p prime selector |
| `power-wd-ablation` | 05c, 06, 15 | Weight decay ablation | WD slider |

## 15.9 자기점검

### 핵심 3 가지

1. **The canonical plot 의 *visual feature* 가 *grokking discovery*?**
2. **WD=1e-2 의 *Goldilocks 위치*?**
3. **Train fraction 0.3 의 *practical significance*?**

### 답변

1. **Train 100% + Val 0% plateau + sudden Val jump**. The canonical Power 2022 plot 의 visual signature: train 100% 도달 (50K step) + val 0% plateau (500K-1M step) + sudden val jump (1M-2M step). 이 *visual contradiction-to-wisdom* 가 *paper 의 hook*. ML community 가 "*tell me more about this*" 호기심.

2. **Implicit prior strength sweet spot**. WD=0: no prior → memorize. WD=1e-3: weak prior → very slow grok. WD=1e-2: *Goldilocks* — *enough pressure to enforce circuit + not too much to destroy training*. WD=1e-1: over-regularize → no learning. *Razor-edge sensitivity* — *empirical art*.

3. **Generalization 의 difficulty knob**. Train fraction 이 *task difficulty 의 dial*. 0.3 = "*30% data 로 학습된 모델이 70% unseen 에 generalize*" — *challenging but possible*. 0.5 = easier (faster grok). 0.1 = impossible (insufficient signal). 0.3 = *paper 의 default*, *most interesting dynamics* 의 *sweet spot*.

---

## 인터랙티브 시각화

```viz:power-grokking-curve:title=paper Figure 1 — Grokking Curve,caption=Log/linear toggle.
```

```viz:power-modular-task:title=paper §3 — Modular Task,caption=Prime p selector.
```

```viz:power-wd-ablation:title=paper §5 — Weight Decay Ablation,caption=WD slider.
```
