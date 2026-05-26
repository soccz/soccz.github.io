# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Bricken 의 *superposition → SAE → monosemantic feature* pipeline 의 ASCII 도식 + 인터랙티브 viz.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 인터랙티브 viz 로 Bricken 2023 의 *superposition pathology*, *SAE inverse decompression*, *monosemantic feature emergence*, *dead-feature resampling dynamic* 의 4-act visual narrative."**

## 15.2 ASCII 도식 — Superposition 의 Geometric Picture

```
TOY MODEL OF SUPERPOSITION (Elhage 2022):

  Feature space:      Neuron space:        Recovered:
                                          
   f1 │              n1                    f1 ▲ 
   f2 │              n2  ↑                 f2 ─ (perfect)
   f3 │   →          n3  → → →             f3 ─
   f4 │              n4    ↗  ↘            f4 ◢ (interference)
   f5 │             (only 4 neurons!)      f5 ◤ (interference)
   ...
   fN │                                    
    
  N features 의 *대부분* 을 d=4 neurons 에 압축:
    - Linear combination 으로 encode
    - 일부 feature 는 *interference* (overlap)
    - polysemanticity 가 *불가피한 결과*
```

## 15.3 ASCII 도식 — SAE Decomposition (Inverse Direction)

```
SAE 의 압축 해제:

  raw residual (compressed):
   ┌─────────────────────────┐
   │ n1=0.3 n2=0.8 n3=-0.1 n4=0.5 ...  │  d=512 neurons
   └─────────────────────────┘
                │
                │  W_enc (overcomplete projection)
                ▼
   ┌─────────────────────────────────────────────────────┐
   │ z = ReLU((x - b_dec) @ W_enc + b_enc)               │
   │ Most z[i] = 0 (sparse!)                             │
   │ Only ~50 features active out of 32K                 │
   └─────────────────────────────────────────────────────┘
                │
                │  Active features (~50):
                ▼
   feature_12   = 0.85  → "he/him/his"
   feature_847  = 0.62  → "January/February/..."
   feature_3201 = 0.41  → "<code>/<script>"
   ...
                │  W_dec
                ▼
   x_hat ≈ x  (reconstruction loss < 0.05)
```

## 15.4 ASCII 도식 — Feature Activation Distribution

```
PER-FEATURE ACTIVATION HISTOGRAM:

   Count (log)
        │
   10^5 ┤████  ← spike at 0 (sparse: 95%+ tokens inactive)
        │█
   10^4 ┤█
        │█
   10^3 ┤█  ████████  ← small bumps (rare strong activations)
        │█  █     █
   10^2 ┤█  █     █
        │█  █     █████
   10^1 ┤█  █     █   █
        └────────────────────── activation value
        0   0.5   1.0  1.5

Insights:
  - 95%+ tokens: feature inactive (zero)
  - 4% tokens: weak activation (0.1 - 0.5)
  - 1% tokens: strong activation (> 0.5)
  → "*sparse + heavy-tailed* distribution"
```

## 15.5 ASCII 도식 — Monosemantic Feature 의 Top Contexts

```
FEATURE 12 의 TOP-10 ACTIVATING CONTEXTS:

   1.47  "...where he went to college, ..."
   1.42  "He decided to start his own ..."
   1.38  "...visited him at his apartment, ..."
   1.33  "...gave his daughter the keys ..."
   1.31  "...the king and his men marched ..."
   1.28  "When he was young, his father ..."
   1.25  "Mr. Smith said his proposal ..."
   1.22  "...his lawyer filed the motion ..."
   1.19  "...handed himself in to police ..."
   1.16  "...his older brother lived in ..."

  공통 patterns: "he", "him", "his", "himself", "Mr. X's"
  Concept: ★ MALE PRONOUN ★ (monosemantic ✓)

FEATURE 1289 의 TOP-10 CONTEXTS (polysemantic example):

   1.51  "...the cat sat on the mat ..."        ← "the"
   1.42  "...the answer is forty-two ..."       ← "the"
   1.39  "January is the first month ..."       ← "month"?
   1.35  "the engine roared to life ..."         ← "the"
   1.32  "September is the ninth month ..."     ← "month"?
   ...
   
   공통 patterns: ["the", random]
   → polysemantic (2+ concepts conflated)
```

## 15.6 ASCII 도식 — Dead Feature Resampling Dynamics

```
SAE TRAINING DYNAMICS (paper §3.2):

   Alive features (out of 4096)
        │
   4000 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (after step 30K, stable)
        │                                  ↑ resample at 25K
   3800 ┤                              ┌─── (step 25K rebound)
        │                              │
   3600 ┤      ┌──── step 10K dip      │
        │      │                       │ Resample step 25K:
   3400 ┤      │                       │   - 380 dead features found
        │      │                       │   - re-initialized with
   3200 ┤      │                       │     high-error inputs
        │      │                       │   - all re-activate
   3000 ┤      │     (slow death)      │
        │ ────────────── (without resample) → 3200 dead at step 200K!
        └───────────────────────────────────────
                10K    25K   50K    100K   200K

Insights:
  - Without resample: 20-40% features dead at end of training
  - With resample (every 25K steps): >97% features alive
  → "Resampling = SAE 의 *capacity rescue*"
```

## 15.7 ASCII 도식 — Reconstruction vs Sparsity Trade-off

```
L1 COEFFICIENT λ SWEEP (paper §3.3):

  reconstruction loss          active features (%)
        │                              │
    0.5 ┤                              │       /
        │   /                          │     /
    0.4 ┤  /                       50% ┤   /
        │ /                            │  /
    0.3 ┤/                             │ /
        │                              │/
    0.2 ┤                          10% ┤───── (sweet zone)
        │                              │  ──
    0.1 ┤   ★ sweet zone (λ=1e-3)   1% ┤    ──
        │                              │      ──
    0.0 ┤──                            │
        └───────────────────         0% ┤
        0   1e-5  1e-3  1e-1                  └─────
                  λ                         0  1e-5 1e-3 1e-1

  λ → 0:    recon perfect, but dense (polysemantic)
  λ = 1e-3: recon 0.05, sparse 1-5% ★ Goldilocks
  λ → 1:    recon failure, hyper-sparse
```

## 15.8 ASCII 도식 — SAE Family Tree (Methodology Evolution)

```
SAE 변형의 *evolutionary tree*:

                    Olshausen 1996
                  (sparse coding, V1)
                          │
                          │ (27 year gap)
                          ▼
                    Bricken 2023
                  (L1 SAE, transformer)
                  ★ 본 paper
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    Cunningham 2024              Gao 2024 (OpenAI)
    (highly interpretable)       (Top-K SAE)
            │                           │
            ▼                           ▼
    Rajamanoharan 2024           Templeton 2024
    (Gated SAE / JumpReLU)       (Sonnet, scaled)
            │                           │
            └─────────────┬─────────────┘
                          ▼
                    Lindsey 2024
                    (Crosscoder)
                          │
                          ▼
                   2026 Production
                  (editable AI tools)
```

## 15.9 Viz 카탈로그 (인터랙티브)

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `bricken-superposition` | 03, 13, 15 | Superposition geometry visualization | feature count slider |
| `bricken-sae-training` | 05b, 14, 15 | SAE training dynamics (alive features, recon loss) | resample toggle |
| `bricken-feature-activation` | 05c, 14, 15 | Feature activation distribution histogram | feature index slider |

## 15.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **Superposition geometry 의 *interference* 의 시각적 의미?**
2. **Feature activation 의 *heavy-tailed sparse* distribution 의 의미?**
3. **Resampling 의 *capacity rescue* 효과 의 quantitative scale?**

### 답변

1. **High-dim feature 의 low-dim projection 의 lossy compression**. N features (e.g., 32K) → d neurons (e.g., 512) 의 projection 시 *N > d* 이면 *어떤 feature pair 가 동일 방향* 으로 매핑 (collision) — *interference*. 시각적: N-dim simplex 의 vertex 가 d-dim hyperplane 에 projection 시 *일부 vertex 가 동일 location*. Polysemanticity = "*동일 location 의 multiple features* 가 동시 activate".

2. **Sparse coding 의 *empirical signature***. Active features 의 95%+ token 이 zero, 4% weak, 1% strong = *power-law tail*. 의미: "*대부분 token 은 generic*, *소수 token 이 feature-specific*". e.g., "he" feature 가 "he"-containing context 의 1% token 에서만 strong activation. → *sparse + heavy-tailed* = monosemantic concept 의 *natural distribution*. Gaussian dense 면 polysemanticity 신호.

3. **40% capacity recovery**. Without resample: SAE 의 ~40% features dead → effective d_sae 가 60% 만 (e.g., 4096 → 2458 alive). With resample: 97%+ alive — *full capacity 활용*. → Bricken paper Table 3 (paper §3.2): resample 적용 시 recon loss 0.08 → 0.04 (절반), monosemanticity rate 71% → 87%. *Resampling = methodology 의 *critical step**, not optional.

---

## 인터랙티브 시각화

```viz:bricken-superposition:title=paper §1 — Superposition Geometry,caption=Feature count slider. high-dim → low-dim projection visualization.
```

```viz:bricken-sae-training:title=paper §3 — SAE Training Dynamics,caption=Resample toggle. alive features + recon loss trajectory.
```

```viz:bricken-feature-activation:title=paper §4 — Feature Activation Histogram,caption=Feature index slider. monosemantic vs polysemantic distribution.
```
