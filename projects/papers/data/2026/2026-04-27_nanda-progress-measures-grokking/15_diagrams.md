# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Modular arithmetic 의 4-phase trajectory + Fourier circuit + Progress measures + Critical frequencies 의 시각적 압축.

## 15.1 ASCII 도식 — Grokking 4-Phase Trajectory

```
Accuracy
   1.0 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (Train, 100% after step 30K)
        │                                                    
   0.8 ┤                                          ┌────────── (Val, after grokking)
        │                                          │
   0.6 ┤                                       ╱── 
        │                                  ╱──
   0.4 ┤                              ╱──
        │                          ╱──
   0.2 ┤                      ╱──
        │ Phase 1 │ Phase 2 │  Phase 3       │ Phase 4
   0.0 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        └────┬──────┬───────┬───────┬────────┬───────
              1K   30K   50K     80K    100K        200K
                          Training step (log scale)

Phase 1 (0-1K):     random — both train and val at chance
Phase 2 (1K-30K):   train→100%, val stays chance (memorization)
Phase 3 (30K-100K): ★ grokking — val gradually rises (Fourier circuit emerging)
Phase 4 (100K+):    stable grokked state (memorization circuit pruned)
```

## 15.2 ASCII 도식 — Fourier Circuit Structure

```
Modular Addition Circuit (학습된 transformer):

Input: a, b, '='     (3 tokens, each in [0, p-1] or '=')
   │
   ▼
Embedding W_E (paper §3.2):
  Each token → d-dim vector
  ★ Top-K singular vectors of W_E = Fourier basis vectors
  
  For token a:
    W_E[a] ≈ Σ_k c_k · [cos(2πk·a/p), sin(2πk·a/p), ...]
    where K = {k_1, ..., k_6} 의 critical frequencies
   │
   ▼
Attention + MLP:
  ★ Trigonometric identity 의 implementation:
    cos((a+b)k) = cos(ak)cos(bk) - sin(ak)sin(bk)
   │
   ▼
Unembed W_U (paper §3.2):
  Fourier basis 의 transpose
  Hidden state → logit
   │
   ▼
Output: (a+b) mod p
```

## 15.3 ASCII 도식 — Progress Measures Evolution

```
Restricted Loss:
   4.5 ┤━━━━━━━━━━━━━━━━━━ (Phase 1-2: high)
        │                       
   3.0 ┤                  ╲───
        │                      ╲╲ (Phase 3 start)
   1.5 ┤                          ╲╲╲╲
        │                              ╲╲╲╲
   0.0 ┤                                  ━━━━━━━━━━━━━━━━ (grokked)
        └────────────────────────────────────────
              1K  10K  30K  50K  80K  100K

Gradient Symmetry:
   0.30 ┤━━━━━━━━━━━ (high asymmetry: random)
        │
   0.20 ┤        ╲─── (memorization phase)
        │            ╲╲
   0.10 ┤                ╲╲╲
        │                    ╲╲━━━━━━━━━━ (Fourier symmetric)
   0.00 ┤
        └────────────────────────────────────────
              1K  10K  30K  50K  80K  100K

Trigonometric Loss:
   4.7 ┤━━━━━━━━━━━━━━━━━ (high)
        │                  
   2.0 ┤                  ╲╲
        │                     ╲╲╲
   0.5 ┤                         ╲╲╲╲━━━━━━━━ (Fourier projection clean)
   0.04 ┤
        └────────────────────────────────────────
              1K  10K  30K  50K  80K  100K
```

→ 3 measures 의 *parallel evolution* 가 *progress 의 multi-axis tracking*.

## 15.4 ASCII 도식 — Critical Frequencies

```
Top-6 critical frequencies (paper §3.2, p=113):

Frequency k:    14   25   36   45   62   78
                
Cosine vectors of these k:
  cos(2π·14·n/113)  → "주파수 14" basis
  cos(2π·25·n/113)  → "주파수 25" basis
  ...
  
Sine vectors:
  sin(2π·14·n/113)
  ...

Total 12 critical basis vectors (6 cos + 6 sin) = 모델이 *implicit Fourier transform*
```

## 15.5 ASCII 도식 — Weight Decay Sensitivity

```
WD = 0:
  Train acc 100% at step 30K
  Val acc 0% → never grok
  Reason: Memorization circuit 가 sufficient
                  
WD = 0.01:
  Train acc 100% at step 30K
  Val acc starts at step ~200K
  Slow grokking
                  
WD = 0.1:
  Train acc 100% at step 30K
  Val acc starts at step ~100K
  Standard grokking
                  
★ WD = 1.0 (paper default):
  Train acc 100% at step 30K
  Val acc starts at step ~50K
  Fast grokking
                  
WD = 10 (too large):
  Train acc never reaches 100%
  → training collapse

→ WD 의 *Goldilocks zone*: 0.1 - 1.0
```

## 15.6 Viz 카탈로그 (인터랙티브)

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `nanda-grok-phases` | 02, 13, 15 | 4-phase trajectory | seed slider |
| `nanda-fourier-circuit` | 05c, 14, 15 | Fourier basis vectors of W_E | frequency selector |
| `nanda-progress-measures` | 05d, 13, 15 | 3 measures parallel evolution | measure toggle |
| `nanda-wd-sweep` | 06, 13, 15 | Weight decay sensitivity | WD value selector |

## 15.7 자기점검 (이 챕터)

### 핵심 3 가지

1. **4-Phase trajectory 의 *Phase 3 의 sigmoid shape* 의 의미?**
2. **Fourier circuit 의 *top-K=6* 의 의의?**
3. **3 Progress Measures 의 *temporal ordering*?**

### 답변

1. **Generalization circuit 의 *gradual emergence*. Sudden jump 가 아닌 *sigmoid*. *Memorization 에서 Fourier circuit 로의 *gradual switching*. Phase 3 의 *width* (50K steps) = *circuit transition 의 time scale*. Weight decay 가 *steeper sigmoid* 의 enabler — circuit simplification pressure.

2. **Modular addition 의 *minimal sufficient Fourier basis***. paper §3.2: 학습된 모델이 *all 113 frequencies* 가 아닌 *top-6* 만 사용 — *학습된 sparsity*. **Why 6**: prime $p=113$ 의 *symmetric structure* + cyclic group 의 *6-fold* approximation. *task-specific optimal* — 더 적은 frequencies (1-2) 면 *insufficient*, 더 많은 (10+) 면 *redundant*.

3. **Gradient Symmetry → Restricted Loss → Trigonometric Loss**. **Gradient Symmetry** *earliest* signal — 학습 dynamics 의 *Fourier emergence* 시작. **Restricted Loss** *intermediate* — circuit *output* 의 generalization. **Trigonometric Loss** *latest* — Fourier projection 의 *fidelity*. → "Circuit forms in gradients → predicts output → cleans up to pure Fourier" 의 *3-stage internal logic*.

---

## 인터랙티브 시각화

```viz:nanda-grok-phases:title=paper Fig 1 — 4-phase trajectory,caption=Seed slider.
```

```viz:nanda-fourier-circuit:title=paper Fig 2 — Fourier basis,caption=Frequency selector.
```

```viz:nanda-progress-measures:title=paper Fig 5 — Progress measures,caption=Measure 토글.
```

