# 18 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석, *후속 연구로 검증 필요한* 가설.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 가지 잠재 약점: (1) SAE 의 *non-uniqueness*, (2) Attribution 의 *first-order limit*, (3) Threshold τ 의 *empirical 의존*, (4) Production scaling 의 *open question*. 각각의 *honest assessment* + *후속 연구 방향*."**

## 18.2 약점 1 — SAE 의 *Non-Uniqueness*

### 18.2.1 문제 진술

```
SAE training 은 *initialization 의존*:
  - 같은 data + hyperparam → 다른 seed → 다른 features
  - "feature_12 = 'he'" 가 다른 seed 에서는 "feature_47 = 'he'"
  - 의미는 동일하나 *index 가 변경*

→ "단일 정답 SAE" 가 *unique 하지 않음*.
```

### 18.2.2 본 deep dive 의 처리

본 deep dive 는 *single SAE* 가정 — paper 의 specific feature_12 / feature_847 등을 단순 인용.

### 18.2.3 미해결 질문

```
- 다른 seed 의 SAE 의 *circuit overlap* 정도?
- "robust" feature (모든 seed 에 동일 의미 학습) 의 fraction?
- Ensemble SAE 가 의미 있나?
```

### 18.2.4 후속 연구 방향

```
- Cunningham 2024 의 "auto-interpretation consistency" metric 활용
- N-seed SAE 의 *feature alignment* via cosine similarity
- "Universal feature" 의 empirical 정의
```

## 18.3 약점 2 — Attribution 의 *First-Order Limit*

### 18.3.1 문제 진술

```
Attribution patching = first-order Taylor:
  ΔL ≈ ∇_z L · Δz
  
정확 ablation:
  ΔL = L(z - Δz) - L(z)  (full Δ, no linearization)

가정: small-perturbation linearity
실제: full ablation Δz = -z 가 large perturbation
```

### 18.3.2 본 deep dive 의 처리

§3 에서 *correlation 0.95-0.98* 인용 — "거의 정확" 으로 다룸. 하지만:

```
- 0.95 correlation = *5% 정도 mismatch*
- High-order interactions (feature ×feature 의 *synergistic effect*) 잡지 못함
- IOI 같은 *clean task* 에서는 OK, 더 *complex behavior* 에서는?
```

### 18.3.3 미해결 질문

```
- 5% mismatch 의 *bias direction* (over/under-estimate)?
- Multi-feature ablation 의 *non-additivity* 정도?
- Higher-order Taylor (Hessian) 이 5% 의 root cause?
```

### 18.3.4 후속 연구 방향

```
- Second-order attribution (Hessian-based)
- ACDC + SFC 의 *hybrid pipeline* (attribution screening + explicit verification)
- Synergy detection via *interaction term* 분석
```

## 18.4 약점 3 — Threshold τ 의 *Empirical 의존*

### 18.4.1 문제 진술

```
Circuit 선택 = "score > τ" 의 *cutoff*:
  - τ=0.01 표준 — Marks 의 empirical choice
  - τ=0.001 → 200 features (overfit)
  - τ=0.1 → 10 features (underfit)
  
즉 *true circuit size* 는 algorithm hyperparam 에 의존.
```

### 18.4.2 본 deep dive 의 처리

§4 에서 τ=0.01 을 "default" 로 다룸 + Ablation table 인용. 하지만 *fundamental* 질문 회피:

```
- "τ 의 *principled choice*" 가 있나?
- Different tasks → different optimal τ?
- "*data-driven* τ selection" (e.g., elbow point)?
```

### 18.4.3 미해결 질문

```
- Cross-task τ 의 *transferability*?
- Information-theoretic τ (MDL, BIC) 적용 가능?
- "Circuit size" 의 *non-arbitrary* 정의?
```

### 18.4.4 후속 연구 방향

```
- Bayesian SFC (τ 의 *prior + posterior*)
- Cross-validation 기반 τ selection
- Minimal-description-length objective
```

## 18.5 약점 4 — Production Scaling 의 *Open Question*

### 18.5.1 문제 진술

```
Marks 2024 는 Pythia-70M / 2.8B (academic toy):
  - SAE training = 1× A100 × 24h
  - Circuit discovery = 5 min

Templeton 2024 의 Sonnet:
  - SAE training = 수개월 × 수백 GPU
  - 1M+ features
  - Circuit discovery 의 *시간 ?* (paper 미공개)
```

### 18.5.2 본 deep dive 의 처리

§16 에서 reproduction cost 인용 (Pythia 만). Production scale 의 정확 numbers 없음.

### 18.5.3 미해결 질문

```
- Sonnet 의 SAE training 정확 cost?
- 1M features 의 *full circuit discovery* feasibility?
- "*sub-circuit*" 분해 (e.g., topic-conditional circuit) 의 *exponential blow-up*?
```

### 18.5.4 후속 연구 방향

```
- Distributed SFC (multi-GPU circuit discovery)
- Hierarchical SAE (coarse-to-fine feature)
- "*Behavioral cluster*" 별 circuit cache
```

## 18.6 본 deep dive 의 *bias 가능성*

### 18.6.1 Anthropic-centric narrative

본 deep dive 는 Bricken 2023 → Marks 2024 → Templeton 2024 의 *Anthropic axis* 위주. 하지만:

```
- DeepMind 의 SAE (Cunningham 2024) 도 동등 중요
- Meta 의 *circuit discovery* approach 가 paper 에서 누락
- 학계 (Stanford, MIT) 의 *alternative SAE 변형* 부분만 다룸
```

### 18.6.2 "SAE is the answer" 의 over-claim risk

```
SAE 가 *모든 mech interp 의 정답* 처럼 묘사 가능. 하지만:
  - Polytope-based interpretability (Black et al. 2022) 존재
  - Probing classifier (Belinkov 2022) 도 유효
  - Sparse coding 외의 *decomposition* (NMF, PCA) 도 가능
```

### 18.6.3 Recommendation

```
- 본 deep dive 의 추후 update 시:
  * DeepMind / Meta perspective 추가
  * Non-SAE method 의 fair comparison
  * Polytope, probing 의 *complementary* 위치 설명
```

## 18.7 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **SAE non-uniqueness 가 *practical interpretability* 에 미치는 영향?**
3. **본 deep dive 의 *Anthropic-bias* 를 *honestly disclose* 하는 이유?**

### 답변

1. **Threshold τ 의 *principled foundation***. Faithfulness / Completeness / Minimality 의 3-fold metric 이 *circuit 정의* 의 ground truth — 하지만 *τ 선택* 이 *arbitrary*. τ=0.01 이 standard 이지만 *task-dependent*, *data-dependent*, *seed-dependent*. → 본 deep dive 가 이 점을 *명시* 했으나 *해결 방안 제시 X*. **Future work**: information-theoretic 또는 cross-validation 기반 τ selection 이 *open research problem* 으로 남음.

2. **"Feature universality" 의 epistemic uncertainty**. 만약 SAE 가 *unique* 했다면 "feature_12 = 'he' 의 universal substrate" 같은 *strong claim* 가능. 실제로는 *seed-dependent* 이므로 "*seed S 의 feature_12*" 만이 valid. → *Cross-seed alignment* 가 verified 되어야 *generalizable claim* 가능. 본 deep dive 는 이 점을 *simplifying assumption* 으로 회피 — *practical implication*: "*specific SAE 의 specific circuit*" 만 valid, *universal circuit* 은 *strong claim*.

3. **Intellectual honesty 의 * scientific norm***. Marks 2024 paper 자체가 Anthropic-affiliated authors 의 작업 + reference 의 70%+ 가 Anthropic blog. 본 deep dive 가 이를 그대로 따르면 *one-sided narrative* 위험 — DeepMind, Meta, 학계 perspectives 의 fair representation 누락. *Honest disclosure* = "본 deep dive 는 Anthropic-axis 중심" 명시 → 독자가 *complementary literature* 찾을 incentive 제공. Mech interp 의 *field-level pluralism* 보존을 위한 *responsibility*.
