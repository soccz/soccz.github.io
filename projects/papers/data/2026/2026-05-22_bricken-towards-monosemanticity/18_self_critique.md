# 18 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석, *후속 연구로 검증 필요한* 가설.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 가지 잠재 약점: (1) SAE non-uniqueness 의 *practical 의미 underplay*, (2) λ 의 *empirical magic*, (3) 1-layer toy 의 *generalization 의문*, (4) Anthropic-centric narrative."**

## 18.2 약점 1 — SAE Non-Uniqueness 의 Underplay

### 18.2.1 문제 진술

```
같은 model + 같은 data + 다른 seed → 다른 SAE features:
  - "feature_12 = 'he'" 가 다른 seed 에서 "feature_47 = 'he'"
  - 의미 동일, index 변경
  - "Universal feature index" 불존재
```

### 18.2.2 본 deep dive 의 처리

§4 의 monosemanticity claim 은 *single seed* 의 SAE 만 언급. *Seed variation* 의 *cross-seed analysis* 부족.

### 18.2.3 미해결 질문

```
- 다른 seed 의 SAE 의 *feature concept overlap* 정도?
- "Robust feature" (모든 seed 동일 의미) 의 fraction?
- Ensemble SAE 가 *more interpretable*?
```

### 18.2.4 후속 연구 방향

```
- Cross-seed cosine similarity matrix
- "Universal concept" 의 empirical 정의
- Lindsey 2024 Crosscoder 의 cross-model alignment 분석
```

## 18.3 약점 2 — λ 의 *Empirical Magic*

### 18.3.1 문제 진술

```
λ = 1e-3 의 *justification*:
  - Empirical grid search result
  - Visual inspection of feature quality
  - No first-principle derivation
  
즉 *theoretical foundation 부재*.
```

### 18.3.2 본 deep dive 의 처리

§5b 에서 λ=1e-3 을 "Goldilocks zone" 으로 다룸. 하지만 *theoretical analysis* 부재 — *empirical accept*.

### 18.3.3 미해결 질문

```
- λ 의 *information-theoretic foundation* (MDL, BIC)?
- Task-dependent λ 의 *systematic study*?
- λ → 0 limit 의 *theoretical behavior*?
```

### 18.3.4 후속 연구 방향

```
- Bayesian SAE (λ 의 hyperprior)
- MDL-based λ selection
- Top-K SAE (Gao 2024) 의 *λ-free alternative* — 일부 답.
```

## 18.4 약점 3 — 1-Layer Toy 의 *Generalization 의문*

### 18.4.1 문제 진술

```
Bricken 2023 의 SAE: 1-layer transformer (small, trained from scratch).
실제 LLM: 12+ layers, pre-trained on internet.

가정: "1-layer 의 SAE 성공 → multi-layer 도 가능"
근거: empirical (Templeton 2024 가 Sonnet 까지 확장)

하지만:
  - 1-layer = no superposition cascading
  - Multi-layer = layer 간 feature interaction
  - "*깊이 의존 phenomenon*" 미연구
```

### 18.4.2 본 deep dive 의 처리

§6 에서 1-layer result 만 다룸. *Multi-layer extension* 의 *technical challenge* 분석 부족.

### 18.4.3 미해결 질문

```
- Multi-layer SAE 의 *layer 간 feature alignment*?
- Cross-layer SAE (Templeton 2024) 의 *technical detail*?
- Depth-dependent monosemanticity rate 차이?
```

### 18.4.4 후속 연구 방향

```
- Hierarchical SAE (coarse + fine features)
- Cross-layer feature trajectory tracking
- Depth ablation study (1, 4, 12, 32 layers)
```

## 18.5 약점 4 — Anthropic-Centric Narrative

### 18.5.1 문제 진술

```
본 deep dive 의 references 의 70%+ 가 Anthropic publication:
  - Elhage (toy model)
  - Olah (Distill circuits)
  - Bricken (SAE)
  - Templeton (scaling)
  - Lindsey (crosscoders)
  
누락 / underplayed:
  - DeepMind: Cunningham, Lieberum, Rajamanoharan
  - OpenAI: Gao Top-K
  - 학계: MIT/EleutherAI 의 Pythia, Stanford CRFM
  - Polytope-based interp (Black 2022)
  - Probing classifier (Belinkov 2022)
```

### 18.5.2 본 deep dive 의 처리

§8 lineage 가 *Anthropic axis* 위주. §13.13 (3년 timeline) 도 Anthropic centric.

### 18.5.3 미해결 질문

```
- Non-SAE interpretability method 의 fair comparison?
- DeepMind / OpenAI / 학계 의 *unique contributions*?
- Field 의 *real diversity*?
```

### 18.5.4 후속 연구 방향

```
- 본 deep dive update 시:
  * DeepMind / Meta perspective 추가
  * Non-SAE method (polytope, probing) 의 fair comparison
  * Open-source community contributions
```

## 18.6 본 deep dive 의 *bias 가능성*

### 18.6.1 "SAE solves everything" 의 over-claim risk

```
SAE 가 *모든 mech interp 의 정답* 처럼 묘사 가능. 하지만:
  - Polysemanticity 의 *upper limit* 미증명
  - Multi-modal feature 의 *unsolved*
  - Non-text domain (TS, vision) 의 *generalization 의문*
  - Causal direction (feature → behavior) 의 *correlational concern*
```

### 18.6.2 "Monosemanticity = ground truth" 의 epistemic risk

```
87% monosemantic rate = "auto-interp success rate".
하지만:
  - LLM 의 auto-interp 가 *유일 진실*?
  - Human evaluation 의 *gold standard*?
  - "Interp 의 *objective measure*" 미존재
```

### 18.6.3 Recommendation

```
- 본 deep dive 의 추후 update 시:
  * Non-SAE method 의 strength 명시
  * "Auto-interp" 의 limitation 분석
  * Human-evaluation 의 *complementary* 위치
```

## 18.7 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **SAE non-uniqueness 가 *practical interpretability* 에 미치는 영향?**
3. **본 deep dive 의 *Anthropic-bias* 를 *honestly disclose* 하는 이유?**

### 답변

1. **λ 의 *theoretical foundation 부재***. SAE 의 *유일 quasi-hyperparameter* 가 λ — *grid search 의 empirical magic*. *First-principle* 부재 가 *all SAE work* 의 *Achilles heel*: "왜 1e-3? 왜 1e-4 아닌가?" 의 답 = "empirical works best". → *field 전체의 open problem*. 본 deep dive 가 *명시* 했으나 *해결 방안 제시 X*. **Future work**: information-theoretic λ derivation 이 *open research direction*.

2. **"Feature universality" 의 epistemic uncertainty**. SAE 가 *unique* 했다면 "feature_12 = 'he' 의 universal substrate" 같은 *strong claim* 가능. 실제로는 *seed-dependent* 이므로 "*specific SAE 의 feature_12*" 만 valid. → *Practical implication*: feature engineering (steering, ablation) 시 *per-SAE 재학습 + re-identification* 필요. *Production deployment* 시 *cross-seed alignment* 가 *engineering overhead*. → *editable AI 의 hidden cost*.

3. **Intellectual honesty 의 *scientific norm***. Bricken paper 자체가 Anthropic-only authors + reference 의 70%+ 가 Anthropic publication. 본 deep dive 가 이를 그대로 따르면 *one-sided narrative*. *Honest disclosure* = "본 deep dive 는 Anthropic-axis 중심" 명시 → 독자가 *complementary literature* (DeepMind, OpenAI, 학계) 찾을 incentive. *Field-level pluralism* 보존을 위한 *responsibility*. *Anthropic-internal* 시각 만으로는 *field 의 real diversity* 누락.
