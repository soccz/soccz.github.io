# 17 3 년 Aftermath — SAE Era 의 진화 (2023-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Bricken et al. 2023.10 발표 후 3년간 *SAE methodology* 의 *founding paper → industry standard* 진화. Toy → real → production → commercial.

## 17.1 챕터 한 줄 요약

> **"2023.10 의 Bricken Anthropic preprint 가 *3년 만에 industry segment* 로 발전. Methodology refinement (2024), real-task application (Marks SFC), production scale (Templeton Sonnet), open-source democratization (Gemma Scope), commercial editable AI (2026) 의 5-phase trajectory."**

## 17.2 Timeline (2023-2026)

```
2023.10: Bricken et al. (Anthropic) — Towards Monosemanticity preprint ★
            │
2024.05: Marks et al. — Sparse Feature Circuits
2024.06: Cunningham et al. (DeepMind) — Highly Interpretable SAEs
2024.07: Gao et al. (OpenAI) — Top-K SAE
2024.10: Templeton et al. (Anthropic) — Scaling Monosemanticity (Sonnet)
2024.11: Rajamanoharan et al. (DeepMind) — Gated SAE / JumpReLU
2025.01: Marks et al. ICLR 2025 — SFC formal publication
2025.03: Lieberum et al. (DeepMind) — Gemma Scope (open-source)
2025.05: Anthropic — Sparse Feature Steering (Golden Gate Claude)
2025.07: OpenAI — Internal SAE-based safety pipeline
2025.10: Lindsey et al. (Anthropic) — Crosscoders
2025.12: First commercial "editable AI" products
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 (2023-2024) — Foundational Validation

### 17.3.1 Bricken 2023 의 *founding contribution*

```
3 core claims (paper §1):
  1. Superposition 의 *empirical reality* (1-layer transformer)
  2. SAE 의 *practical viability* (training success)
  3. Monosemanticity 의 *empirical 입증* (87% rate)

→ "Toy → real" 의 *bridge* 입증.
→ Anthropic interp era 의 *foundational anchor*.
```

### 17.3.2 Cunningham 2024 의 *interpretability validation*

```
Bricken 의 *monosemanticity claim* 의 *automated verification*:
  - GPT-4 으로 feature meaning 자동 라벨
  - "Auto-interpretation success rate" metric
  - 91% (Cunningham) vs 87% (Bricken) — *small improvement*

→ Bricken 의 *qualitative claim* 의 *quantitative independent validation*.
```

## 17.4 Phase 2 (2024) — Methodology Refinement

### 17.4.1 Gao 2024 Top-K SAE

```
L1 → Top-K 의 *architectural simplification*:
  - K=50 active features (exact)
  - No λ tuning
  - No dead features (architectural)
  - Recon loss equivalent

→ Bricken 의 *L1 framework* 의 *alternative* — 동등 결과.
```

### 17.4.2 Rajamanoharan 2024 Gated SAE / JumpReLU

```
Gating + thresholding 의 *cleaner sparsity*:
  - Gate variable g ∈ {0, 1}
  - JumpReLU(x; θ) = x · (|x| > θ)
  - L0 norm (strict count) 으로 sparsity 정확 제어

→ Bricken 의 *soft* L1 → *hard* L0 의 transition.
```

### 17.4.3 Marks 2024 SFC

```
SAE feature → circuit edge 의 *결합*:
  - SAE 가 unit, circuit 이 organization
  - Attribution patching 으로 *causal* connection
  - 3-fold evaluation

→ Bricken 의 *single-feature analysis* → Marks 의 *multi-feature circuit*.
```

## 17.5 Phase 3 (2024-2025) — Production Scaling

### 17.5.1 Templeton 2024 Sonnet Scaling

```
1-layer toy (Bricken) → Sonnet (production):
  - 1000× larger model
  - ~1M features 식별
  - Production-relevant features:
    * "Golden Gate Bridge"
    * "Code error"
    * "Sycophancy"
    * "Deception"

→ Bricken 의 *empirical viability proof* → Templeton 의 *scale-up*.
```

### 17.5.2 Gemma Scope (DeepMind, 2025.03)

```
Open-source SAE library:
  - Gemma-2B / 9B / 27B
  - All layers × multiple sparsity
  - Hugging Face 직접 접근
  - "Pre-trained SAE 무료 download"

→ Bricken 의 *training method* 의 *community democratization*.
→ Reproduction barrier 大幅 감소.
```

## 17.6 Phase 4 (2025-2026) — Commercial Application

### 17.6.1 Anthropic Sparse Feature Steering (2025.05)

```
Production tool:
  - User 가 specific feature *amplify* / *ablate*
  - Demo: "Golden Gate Claude"
  - Internal use: refusal control, sycophancy reduction

→ Bricken 의 *passive monosemanticity analysis* → Anthropic 의 *active editing*.
```

### 17.6.2 Editable AI Commercial Products (2026.Q1)

```
2026 의 첫 상용 *editable AI*:
  - "Brand-safe LLM" (산업별 customization)
  - 회사가 *unwanted features* ablation
  - SAE pipeline 기반

→ Bricken 의 *academic toy* → 3년 후 *paid product*.
```

## 17.7 4 paradigm shifts

### Shift 1: "Superposition is unavoidable" → "Decompressible"

```
2022 (Elhage): "Superposition 가 *압축의 결과*, 회피 불가능"
2023 (Bricken): "SAE 가 *압축의 inverse*, monosemanticity 회복 가능"
2025+: "Decompression 이 *standard tool*"
```

### Shift 2: "Toy interp" → "Production interp"

```
2020-2022: Olah's distill, toy model interp
2023-2024: Bricken 의 *real text 1-layer*
2025+: Sonnet, GPT-4, Gemma 등 *production scale*
```

### Shift 3: "Passive analysis" → "Active editing"

```
2022-2023: probing, ablation 의 *observational*
2024-2025: feature steering 의 *interventional*
2026+: editable AI 의 *commercial intervention*
```

### Shift 4: "Anthropic-internal" → "Community standard"

```
2023 Bricken: Anthropic 의 *single team* output
2024 Cunningham, Gao: 학계 / DeepMind / OpenAI 의 *replication + improvement*
2025+ Gemma Scope: *open-source community asset*
```

## 17.8 본 paper 의 영향력 — citation trajectory (추정)

```
2023.10 (preprint):       0
2024.06:               ~300
2024.12:               ~600
2025.06:               ~950
2025.12:             ~1,400
2026.05:             ~1,650
```

> **수치 정확성 면책**: 위 값은 *합리적 estimate*. Anthropic preprint 의 *foundational SAE era* paper 의 일반 trajectory 기반.

## 17.9 본 deep dive 의 positioning

```
SAE Era 트랙:
  - Bricken 2023 ↔ 본 deep dive (★ 본 paper)
  - Marks 2024 SFC ↔ 결합 후속
  - Templeton 2024 ↔ scaling 후속
  
APF 트랙:
  - SAE feature ↔ APF motif identification
  - Monosemanticity ↔ motif purity verification

Grokking 트랙:
  - SAE on grokked transformer (Anthropic 2024 blog) — 후속 연결
```

## 17.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **Bricken 2023 의 *3 년 후 영향력* 의 *가장 critical paradigm shift*?**
2. **L1 SAE (Bricken) → Top-K SAE (Gao) 의 *methodology shift* 의 의미?**
3. **Gemma Scope 의 *open-source democratization* 의 *long-term effect*?**

### 답변

1. **"Superposition 압축 불가피" → "Decompressible by SAE"**. 2022 Elhage 의 superposition 가 *압축의 불가피한 결과* — *해소 불가능* 으로 보였음. Bricken 2023 의 SAE = *압축의 inverse* — "decompressible by overcomplete dictionary + L1". 이 *pivotal shift* 가 *interpretability 의 entire field* 의 *enabling foundation*. Without Bricken 의 *viability proof*, Marks 2024 SFC, Templeton 2024 scaling, editable AI commercial 모두 *불가능*. → "*founding paper* 의 *literal foundational role*".

2. **Soft → Hard sparsity, λ → K hyperparameter**. Bricken L1: λ=1e-3 의 *empirical tuning*, dead features 의 *training risk*. Gao Top-K: K=50 의 *strict count*, dead features 의 *architectural elimination*. *Methodology improvement*: tuning *less art* + reproducibility *more uniform*. 하지만 *L1 의 자연성* (gradient flow 연속) 의 *trade-off* — *어느 게 우월* 미결정. *Active alternatives*.

3. **Reproduction barrier 大幅 감소 + research democratization**. Bricken 시대: SAE training = *A100 × 12h* (학부생 budget 안). Sonnet 의 SAE = *수개월 × 수백 GPU* (Anthropic-only). Gemma Scope = "*pre-trained SAE 무료 download*" → *inference 만* 으로 SFC pipeline 가능. → 학생 / 학계 / 작은 기업이 *SAE 연구 직접 수행 가능* — *field 의 폭발적 성장* + *Anthropic monopoly 해소*. *Long-term*: SAE 가 "*standard transformer tool*" 처럼 *commodity*.
