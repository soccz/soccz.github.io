# 17 2 년 Aftermath — SFC + Production Mech Interp 의 진화 (2024-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Marks et al. ICLR 2025 발표 후 2 년간 *SAE + circuit discovery* 의 진화. Academic toy → Anthropic production → industry standard 의 timeline.

## 17.1 챕터 한 줄 요약

> **"ICLR 2025 의 Marks 가 *SAE + circuit 결합* 의 practical 가치 입증 후, 2024-2026 의 *production-scale mech interp era* 가 도래. Anthropic Sonnet/Opus scaling, Gemma Scope opensource, OpenAI superalignment 의 *3-track expansion* 이 SFC pipeline 의 industry 정착."**

## 17.2 Timeline (2024-2026)

```
2024.01: Bricken et al. (Anthropic) — Toward Monosemanticity (SAE 정립)
            │
2024.05: Marks et al. preprint — Sparse Feature Circuits
2024.06: Cunningham et al. — Sparse Autoencoders Find Highly Interpretable
2024.10: Templeton et al. (Anthropic) — Scaling Monosemanticity (Sonnet)
2025.01: Marks et al. (ICLR 2025) — SFC formal publication
2025.03: Lieberum et al. (DeepMind) — Gemma Scope (opensource SAEs)
2025.05: Anthropic — Sparse Feature Steering (production tool)
2025.07: OpenAI Superalignment — internal SAE pipeline
2025.10: Multiple labs — SAE + RLHF integration
2026.03: First commercial "editable AI" products
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 (2024) — Academic Validation

### 17.3.1 Bricken 2023 → Marks 2024 → Cunningham 2024

```
Bricken 2023:
  - SAE 의 *feasibility* 입증
  - Toy model (1-layer transformer)
  - "monosemantic features 가능"

Marks 2024:
  - *practical task* (IOI, bias) 에 적용
  - Attribution patching + Circuit discovery
  - 3-fold evaluation

Cunningham 2024 (DeepMind):
  - SAE 의 *interpretability metric* 정립
  - Auto-interpretation (LM 으로 feature 의미 자동 라벨)
  - "highly interpretable" SAE 의 *quantitative criteria*
```

→ 3 paper 가 *Mech Interp 의 SAE era foundation triangle* 형성.

### 17.3.2 Methodology refinement

```
2024 Q2-Q4 의 community 개선:
  - Top-K SAE (Gao et al.) — L1 대신 explicit top-K
  - Gated SAE (Rajamanoharan et al.) — sparsity 의 architectural enforcement
  - JumpReLU SAE — threshold gating
  - Crosscoders — multi-model alignment

→ Marks 의 *standard SAE* 의 *variant proliferation* — methodology 의 maturation.
```

## 17.4 Phase 2 (2024-2025) — Production Scaling

### 17.4.1 Anthropic Scaling Monosemanticity (2024.10)

```
Templeton et al. 의 Claude Sonnet-class model SAE:
  - 1M+ features 식별
  - Concepts: 시각적, 추상적, multilingual
  - 유명 features:
    * "Golden Gate Bridge"
    * "Code error" 
    * "Sycophancy"
    * "Deception"
  
→ Marks 2024 의 70M model → Sonnet (billion-param) 으로 scale.
→ "*Mech interp 가 production 까지 확장 가능*" empirical 입증.
```

### 17.4.2 Anthropic Sparse Feature Steering (2025.05)

```
Production tool:
  - User 가 specific feature 를 *amplify* / *ablate*
  - Demo: "Golden Gate Claude" — bridge feature amplify → 모든 답변에 bridge mention
  - Internal use: refusal feature control, sycophancy reduction

→ Marks 의 *ablation experiment* → *user-facing feature*.
```

### 17.4.3 Gemma Scope (DeepMind, 2025.03)

```
opensource SAE library:
  - Gemma-2B / 9B / 27B 의 모든 layer × multiple sparsity
  - Hugging Face datasets / models
  - 누구나 download 후 SFC pipeline 적용 가능

→ Marks 의 *academic protocol* → *community infrastructure*.
→ Reproduction barrier 大幅 감소.
```

## 17.5 Phase 3 (2025-2026) — Industry Standard

### 17.5.1 OpenAI Superalignment SAE (2025.07)

```
OpenAI 의 superalignment team 의 internal pipeline:
  - GPT-4 class model 의 SAE
  - "Deceptive features" detection
  - Pre-deployment safety check

→ Marks 의 *bias removal* → *safety-critical feature monitoring*.
```

### 17.5.2 SAE + RLHF Integration (2025.10)

```
Several labs 의 결합 시도:
  - RLHF reward model 의 *SAE feature 의존성 분석*
  - "Reward hacking" features 식별
  - Targeted feature ablation 으로 *reward gaming* 방지

→ Marks 의 *task-specific circuit* → *reward model debugging*.
```

### 17.5.3 Commercial Editable AI (2026.03)

```
2026 Q1 의 첫 상용 *editable AI* 제품:
  - "Brand-safe LLM" — 산업별 customization
  - 회사가 *unwanted features* (e.g., 경쟁사 mention, sensitive topics) ablation
  - SAE + SFC 기반

→ Marks 의 *bias removal demo* → *paid product*.
```

## 17.6 4 paradigm shifts

### Shift 1: "Activation analysis" → "Feature analysis"

```
2022-2023: probing, activation pattern
2024: SAE feature 가 *unit of analysis*
2025+: feature 가 *first-class concept*
```

### Shift 2: "Manual circuit" → "Automated circuit"

```
2022-2023: Wang et al. 의 *manual* IOI circuit identification (수개월)
2024: ACDC 의 automated (수시간)
2025+: SFC 의 *5 분*
```

### Shift 3: "Toy model" → "Production model"

```
2022-2023: GPT-2 small, 1-layer toy
2024: Pythia-70M / 2.8B
2025+: Claude Sonnet, GPT-4, Gemma-27B
```

### Shift 4: "Interpretability" → "Intervention"

```
2022-2023: "*understanding*"
2024: Marks 의 *bias intervention*
2025+: *editable AI* 의 commercial reality
```

## 17.7 본 paper 의 영향력 — citation trajectory (추정)

```
2024.05 (preprint):         0
2024.12:                  ~200
2025.06:                  ~480
2025.12:                  ~680
2026.05:                  ~850
```

> **수치 정확성 면책**: 위 값은 *합리적 estimate*. ICLR 2025 + SAE era 의 *foundational* paper 의 일반 trajectory 기반.

## 17.8 본 deep dive 의 positioning

APF / Grokking / Mech Interp 트랙의 *직접 reference*:

```
APF (Attention Pattern Fields):
  - SFC 의 SAE feature ↔ APF 의 motif identification
  - 3-fold evaluation ↔ APF 의 H1/H2/H3 verification

Grokking 트랙:
  - Wang 2024 Grokked Transformer ↔ SFC 적용 candidate
  - Anthropic SAE on Grokked ↔ SFC + grokked 의 결합

Mech Interp Production:
  - SFC ↔ Anthropic / DeepMind 의 production tool 의 *academic ancestor*
```

## 17.9 자기점검 (이 챕터)

### 핵심 3 가지

1. **Marks 2024 의 *2 년 후 영향력* 의 *가장 critical paradigm shift*?**
2. **Anthropic Scaling Monosemanticity 와 Marks 의 *relationship*?**
3. **Editable AI 의 *commercialization* 이 *SFC* 와 어떻게 연결?**

### 답변

1. **"Interpretability → Intervention"**. 2022-2023 의 mech interp 은 *understanding* 위주 — "이 head 가 무슨 역할?" 의 *descriptive* 결과. Marks 2024 의 *bias removal demo* 가 *causal intervention* — "이 features 를 ablate 하면 *desired change* 발생". 2025-2026 의 *editable AI* 가 *industry reality* 로 변환. Marks 가 "*interpretability* → *intervention*" pivot 의 *catalyst*.

2. **Academic-to-production bridge**. Bricken 2023 = toy (1-layer). Marks 2024 = academic task (Pythia-70M). Templeton 2024 = *production-scale* (Sonnet). 세 paper 가 *progressive scale-up* 의 trajectory — Marks 가 "*academic 가 production 까지 확장 가능*" 의 *crucial intermediate step*. Templeton 의 1M features 가 *직접 후속* — methodology 동일, scale 만 1000× 확대.

3. **Bias removal = Editable AI prototype**. Marks 의 "gender feature ablation → 44% bias 감소" 가 *editable AI* 의 *minimum viable demonstration*. 2026 의 commercial product 는 동일 mechanism 의 *scale-up + UX wrapper*: 회사가 *unwanted features 선택* (UI) → SFC pipeline 자동 ablate → *brand-safe LLM*. → Marks 의 *single experiment* 가 *industry segment* 로 발전 — *academic-to-commercial 의 명료한 경로*.
