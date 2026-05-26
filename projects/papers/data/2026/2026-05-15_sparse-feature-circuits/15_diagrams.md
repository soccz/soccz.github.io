# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: SFC 의 핵심 mechanism (SAE feature decomposition + Attribution patching + Sparse circuit + Bias removal) 을 ASCII 도식 + 인터랙티브 viz 로 시각화.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 인터랙티브 viz 로 Marks 2024 의 *SAE feature pipeline*, *attribution patching mechanic*, *3-fold circuit evaluation*, *bias-removal Shift method* 의 full visual narrative 를 압축."**

## 15.2 ASCII 도식 — SAE Decomposition

```
TRANSFORMER HIDDEN STATE 의 SAE 분해:

  raw residual x ∈ R^768
      │
      │   Encoder W_enc ∈ R^{768 × 32768}
      ▼
  z = ReLU((x - b_dec) @ W_enc + b_enc) ∈ R^32768
      │
      │   Top-K 활성: ~1-5% (≈ 300-1600 features)
      │   나머지: 0 (sparse)
      ▼
  active features:
   ┌─────────┬─────────┬─────────┬─────────┬─────────┐
   │ f_12    │ f_847   │ f_3201  │ f_15K   │ f_29K   │
   │ "he"    │ "code"  │ "year"  │ "prof." │ "comma" │
   └─────────┴─────────┴─────────┴─────────┴─────────┘
      │
      │   Decoder W_dec ∈ R^{32768 × 768}
      ▼
  x_hat = z @ W_dec + b_dec  ≈ x  (reconstruction loss < 0.05)

핵심:
  - sparsity = 32K features 중 ~1-5% 만 active
  - monosemantic = 각 feature 가 1 concept (Bricken 2023)
  - reconstruction ≈ identity (recon loss → 0)
```

## 15.3 ASCII 도식 — Attribution Patching Pipeline

```
ATTRIBUTION PATCHING (Marks §3):

  Step 1: clean forward
    inputs ─→ transformer ─→ hidden ─→ SAE ─→ z_clean
                                            │
                                            ▼
                                       L_clean (task loss)

  Step 2: gradient backward
    L_clean ─→ ∇_z L  ∈ R^{B × T × d_sae}
                                            │
                                            │   single backward pass
                                            ▼
  Step 3: attribution per feature
    A_f = ∇_z L · z_clean   (element-wise, then mean over batch/time)
         │
         │   First-order Taylor: ΔL ≈ ∇L · Δz
         │   Full ablation: Δz = -z   →  effect ≈ -∇L · z
         ▼
    score[f] ∈ R  for each of 32K features

비교:
  ACDC (explicit ablation):  32K forward passes per layer (∞ 비용)
  Attribution patching:        1 forward + 1 backward (1000× 빠름)

가정:
  - first-order linearity (full ablation effect ≈ gradient × activation)
  - SFC paper §3: empirical correlation > 0.95 vs explicit ablation
```

## 15.4 ASCII 도식 — Sparse Circuit Discovery

```
SFC ALGORITHM (Marks §4):

  Input:
    - transformer (frozen)
    - SAE_list (one per layer, pre-trained)
    - task data (clean inputs, targets)
    - threshold τ (e.g. 0.01)

  ┌─────────────────────────────────────────────────────┐
  │ 1. For each layer L:                                │
  │      attr_L = attribution_patching(model, SAE_L)    │
  │      [d_sae] = mean over batch, time                │
  │                                                      │
  │ 2. Selection:                                        │
  │      circuit[L] = {f : attr_L[f] > τ}               │
  │                                                      │
  │ 3. 3-fold evaluation:                                │
  │      Faithfulness  = drop after ablating non-circuit│
  │      Completeness  = drop after ablating circuit    │
  │      Minimality    = no proper subset suffices       │
  └─────────────────────────────────────────────────────┘

  Output:
    Layer 0: { f_12, f_847 }              ← 2 features
    Layer 6: { f_3201, f_5K, f_8K, ... }  ← 15 features
    Layer 9: { f_15K, f_18K, ... }        ← 18 features
    Layer 11: { f_28K, f_29K, ... }       ← 9 features

  Total ~50 features (out of 32K × 12 layers ≈ 400K possible)
  → sparsity ≈ 0.012%
```

## 15.5 ASCII 도식 — 3-Fold Circuit Evaluation

```
EVALUATION MATRIX:

                  │ Ablate circuit │ Ablate non-circuit
    ──────────────┼─────────────────┼──────────────────
    Performance   │   ↓ huge drop   │  ≈ unchanged
                  │  (completeness) │  (faithfulness)
    ──────────────┼─────────────────┼──────────────────
    인장 요건      │ "circuit 만이   │ "circuit 충분 set"
                  │  유일 필수"      │
    ──────────────┴─────────────────┴──────────────────

  Minimality (추가 체크):
    For each f in circuit:
      drop_without_f = performance(circuit - {f})
      if drop_without_f ≈ original: f is removable (not minimal)
      else: f is critical
    
    → 최종 circuit = {f : critical}

  Tri-condition satisfied ↔ "true minimal sufficient subset"
```

## 15.6 ASCII 도식 — Bias Removal (Shift Method)

```
SFC SHIFT METHOD (Marks §5):

  Setup:
    Pre-bias model:
      P("doctor is" | _) = 0.78 → "he"   (gender biased)
    
    occupation prompts: ["The doctor is", "The nurse is", ...]

  Pipeline:
    1. Identify gender features
        words = ["he", "she", "his", "her", "man", "woman", ...]
        for each layer:
          features fire on these → gender_features[layer]
        Total: ~20-30 features across layers (sparse!)

    2. Causal ablation
        For prompt in occupation_prompts:
          with hook ablating gender_features:
            P("doctor is" | _) =  0.51 → "he"
                                  0.49 → "she"  (≈ uniform)

    3. Performance check
        General LM task: perplexity 거의 변화 없음 (Δ < 0.1)
        → "bias 만 사라지고 다른 능력 유지"

  결과:
    Bias ratio (he/she preference):
      Before: 78 / 22  =  3.5×  강한 편향
      After:  51 / 49  =  1.04× ≈ neutral
      Reduction: 46% bias 감소
```

## 15.7 ASCII 도식 — Comparison with ACDC

```
ACDC vs SFC 비교:

                  │ ACDC (Conmy 2023)  │ SFC (Marks 2024)
  ────────────────┼─────────────────────┼────────────────────
  Granularity     │ heads / MLPs        │ SAE features
  Unit count      │ ~150 (12L × 12H)    │ ~400K (12L × 32K)
  Search          │ explicit ablation   │ attribution patching
  Speed           │ slow (per-edge)     │ 1000× faster
  Interpretability│ "head 의 role"      │ "feature 의 concept"
  Granularity gain│ -                   │ ★ monosemantic feature
  ────────────────┴─────────────────────┴────────────────────

  → SFC = ACDC + SAE 의 *granularity + speed* 결합.
```

## 15.8 ASCII 도식 — Feature Polysemanticity vs Monosemanticity

```
Polysemantic (raw neuron):
                                    activates on:
   neuron_42                          ┌────────────────┐
   ████ activation = 0.85   ←─────    │ "he"           │
                                       │ "January"      │
                                       │ "<code>"       │
                                       │ "Mr."          │
                                       └────────────────┘
                                       → 4 concepts 혼합

Monosemantic (SAE feature):
                                    activates on:
   feature_12                         ┌────────────────┐
   ████ activation = 0.92   ←─────    │ "he"           │
                                       │ "him"          │
                                       │ "his"          │
                                       │ "himself"      │
                                       └────────────────┘
                                       → 1 concept (male pronoun)

   feature_847                        ┌────────────────┐
   ████ activation = 0.74   ←─────    │ "January"      │
                                       │ "February"     │
                                       │ "March"        │
                                       └────────────────┘
                                       → 1 concept (month)
```

## 15.9 Viz 카탈로그 (인터랙티브)

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `sfc-attribution-flow` | 05c, 14, 15 | Attribution patching 의 forward/backward flow | step slider |
| `sfc-circuit-evaluation` | 05d, 14, 15 | Faithfulness × Completeness × Minimality 의 3-fold metric | threshold slider |
| `sfc-bias-reduction` | 05e, 14, 15 | Pre/post-ablation bias ratio bar chart | feature count toggle |

## 15.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **SAE decomposition 의 *sparsity 수치* 의 의미?**
2. **Attribution patching 의 *1000× 속도* 의 mechanistic 근거?**
3. **3-fold evaluation 이 *single metric* 보다 강력한 이유?**

### 답변

1. **Monosemanticity 의 enabling 조건**. 32K features 중 1-5% active = ~300-1600 features per token. 이 수치가 *너무 dense* (>10%) 면 polysemanticity 회귀, *너무 sparse* (<0.1%) 면 reconstruction 실패. Bricken 2023 의 *Goldilocks zone* — recon loss + sparsity balance 의 empirical sweet spot.

2. **First-order Taylor expansion**. 정확 ablation = N forward passes (각 feature 마다 ablate 후 forward). Attribution = ∇L · z = *gradient × activation* — 단 1 forward + 1 backward 로 *모든 N features 의 effect 동시 추정*. N=32K 의 경우 32K → 2 passes, 즉 16K× 빠름. Marks 2024 §3: 정확 ablation 과 *correlation > 0.95* — *first-order approximation 의 empirical validity*.

3. **Causal directionality 의 양방향 체크**. **Faithfulness** = "circuit 충분" (ablate non-circuit → 영향 X). **Completeness** = "circuit 필요" (ablate circuit → 영향 ✓). **Minimality** = "no redundancy" (proper subset 불가). 단일 metric 은 *false positive* 가능: faithful 만 = "circuit 충분" 인데 *외부도 충분* (over-claim), complete 만 = "circuit 영향 큰 부분" 인데 *부수 features 도 포함* (over-include). 셋 다 만족 시 *true minimal sufficient* — *formal causal claim*.

---

## 인터랙티브 시각화

```viz:sfc-attribution-flow:title=paper §3 Visualization — Attribution Patching Flow,caption=Step slider. clean forward → backward → score 의 3-step animation.
```

```viz:sfc-circuit-evaluation:title=paper §4 — 3-Fold Circuit Metric,caption=Threshold slider. faithfulness × completeness × minimality 의 sweep.
```

```viz:sfc-bias-reduction:title=paper §5 — Bias Removal Result,caption=Feature count toggle. pre/post ablation bias bar chart.
```
