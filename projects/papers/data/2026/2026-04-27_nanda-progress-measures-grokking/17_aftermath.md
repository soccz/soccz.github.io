# 17 3 년 Aftermath — Grokking + Mech Interp 의 진화 (2023-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Nanda 2023 (ICLR) 발표 후 3 년간 *grokking + mechanistic interpretability* 분야의 진화. *direct follow-ups* → *automated tools* → *foundation model interp* 까지.

## 17.1 챕터 한 줄 요약

> **"Nanda 2023 의 *Fourier circuit + progress measures* 가 *mechanistic interp era* 의 *technical foundation*. ACDC (2023) automated circuit, Wang 2024 complex reasoning, SFC 2024 sparse features 의 *direct lineage*."**

## 17.2 Timeline (2023-2026)

```
2022.01: Power et al. — Grokking 발견 (mysterious)
2022.07: Olsson et al. (Anthropic) — Induction heads
2022.12: Elhage et al. — Math framework for transformer circuits

2023.04: ★ Nanda et al. (ICLR 2023) — Progress Measures (this paper)
            │
2023.06: Liu et al. — Effective theory of grokking (statistical physics)
2023.10: Conmy et al. — ACDC (automated circuit discovery)
2023.11: Anthropic — Towards Monosemanticity (SAE, Bricken et al.)

2024.01: Wang et al. (ICLR 2024) — Grokked Transformers (practical reasoning)
2024.04: Chughtai et al. — Activation Patching for Grokking
2024.07: Anthropic — Scaling SAE to billions of features
2024.12: Marks et al. (ICLR 2025) — Sparse Feature Circuits

2025.05: Wilinski et al. (ICML) — TSFM mechanistic interpretability
2025.10: MoE paradigm 부상 (Mixtral, GPT-4 MoE)
2026.05: 본 deep dive
```

## 17.3 Phase 1 (2023) — Direct Follow-ups

### 17.3.1 Liu et al. 2023 — Effective Theory of Grokking

```
Statistical physics framework for grokking:
  - Phase transition 의 *effective Hamiltonian*
  - Training dynamics 의 *Lagrangian* formulation
  - Critical exponents 추출

Nanda 와의 관계:
  - Nanda: *mechanistic* (학습된 circuit)
  - Liu: *statistical* (phase transition 의 universal scaling)
  - 두 paper 가 *complementary view*
```

### 17.3.2 ACDC (Conmy et al. 2023, NeurIPS)

```
Automated Circuit Discovery:
  - Nanda 의 *manual circuit identification* → *automated search*
  - Method: edge-by-edge ablation + logit difference

Modular arithmetic task 에서 ACDC 결과:
  - Top-6 critical frequencies *재발견* (Nanda 와 일치 ✓)
  - 추가: 각 frequency 별 *contributing components* 정확 식별
  - Speedup: Nanda 의 *manual* 1 week → ACDC *automated* 1 hour
```

→ Nanda 의 *manual methodology* 의 *automated scaling*.

### 17.3.3 Anthropic SAE (Bricken et al. 2023)

```
Sparse Autoencoder for transformer features:
  - Hidden state → SAE → sparse features
  - 각 feature 의 *interpretable meaning*

Nanda + SAE 결합 (2024):
  - Modular arithmetic transformer 의 SAE 적용
  - 결과: 각 SAE feature = *specific frequency detector*
  - 예: Feature 7 = "frequency 14 detector"
  
→ Nanda 의 *dense Fourier basis* → Anthropic 의 *sparse interpretable features*.
```

## 17.4 Phase 2 (2024) — Practical Scaling

### 17.4.1 Wang 2024 — Grokked Transformers (직접 후속)

```
Nanda (modular arithmetic) → Wang (Composition + Comparison)

방법론 차이:
  - Task scale: 1 task → 2 tasks (2 axes of generalization)
  - Model scale: 1-layer → 8-12 layer
  - Dataset scale: 12K → 1M examples
  - Analysis: Fourier-specific → Logit Lens + Causal Tracing (generic)

Insight 차이:
  - Nanda: "Fourier circuit 의 *수학적 exact form* 발견"
  - Wang: "*Practical reasoning task* 의 grokking + LLM 능가"
```

→ Nanda 가 *methodology proof*, Wang 가 *practical applicability*.

### 17.4.2 Chughtai 2024 — Activation Patching

```
Method: Specific layer/position activation 의 patch
  - "Clean" run의 activation 을 "corrupt" run 의 activation 으로 replace
  - 결과 logit 변화 = causal effect

Nanda 의 *progress measures* 와 결합:
  - 각 phase (memorization vs Fourier circuit) 의 *주요 activation* 식별
  - Phase 3 의 *circuit formation* 의 *specific component* 시점별 추적
```

### 17.4.3 SFC — Sparse Feature Circuits (Marks 2024, ICLR 2025)

```
SAE + Circuit Discovery:
  - Anthropic SAE 의 feature 들 + ACDC 의 circuit search 의 결합
  - 각 task behavior 의 *responsible feature subset* 자동 식별

Nanda 와의 관계:
  - Nanda: dense weight 의 circuit (Fourier basis)
  - SFC: sparse feature 의 circuit (SAE basis)
  - 동일 *circuit notion* 의 *two representations*
```

## 17.5 Phase 3 (2025-2026) — Foundation Model Era

### 17.5.1 Wilinski 2025 — TSFM Mech Interp

```
Time Series Foundation Models (Chronos / MOIRAI / TimesFM) 에 mech interp 적용:
  - Probing: hidden state → future value
  - Ablation: head / layer 의 forecast role
  - Circuit: forecasting subtask 의 decomposition

Nanda 와의 연결:
  - Nanda 의 *task-specific circuit* 의 *TS 도메인* 인스턴스화
  - Progress measures 의 TS adaptation
```

### 17.5.2 MoE 의 부상

```
2024-2025 의 MoE 추세:
  - Mistral Mixtral 8x7B
  - GPT-4 MoE (rumored)
  - Claude Opus MoE

Nanda + Wang 2024 의 *paradigm 연결*:
  - "Specialist > Generalist on narrow task" (Wang 2024)
  - 각 MoE expert = "narrow task 의 grokked-like"
  - Nanda 의 *circuit identification* 가 *각 expert 의 specialization* 분석 base
```

## 17.6 4 Paradigm Shifts (Nanda 2023 가 trigger)

### Shift 1: "Mystery → Mechanism"

```
2022 Power: Grokking 발견, but "Why?" unknown
2023 Nanda: Fourier circuit + progress measures
2024+: Mechanistic understanding 가 default
```

### Shift 2: "Manual → Automated"

```
2023 Nanda: manual SVD + Fourier projection
2023 ACDC: automated edge ablation
2024+: automated circuit tools standard
```

### Shift 3: "Toy → Practical"

```
2023 Nanda: modular arithmetic (toy task)
2024 Wang: complex reasoning (practical)
2025+: foundation model 에 적용
```

### Shift 4: "Dense → Sparse"

```
2023 Nanda: dense weight 의 circuit
2024 SAE / SFC: sparse feature 의 circuit
2025+: interpretable feature decomposition default
```

## 17.7 Citation Trajectory (추정)

```
2023.04 (ICLR 발표):        0
2023.12:                  ~120
2024.06:                  ~380
2024.12:                  ~620
2025.06:                  ~810
2025.12:                  ~920
2026.05:                  ~970
```

> **추정 면책**: 합리적 estimate. ICLR 2023 + mech interp era 의 *seminal* paper trajectory 기반.

## 17.8 본 deep dive 의 positioning

APF / Grokking 트랙의 *시조*:

```
Nanda 2023 → 본 트랙의 *direct ancestor*
APF (Attention Pattern Fields):
  - Nanda 의 Fourier circuit ↔ APF 의 motif typology
  - Progress measures ↔ APF 의 H1/H2 protocol 의 *training-dynamic version*

Grokking 트랙:
  - Nanda 의 mod arithmetic ↔ 본 트랙의 base experiment
  - 4-phase trajectory ↔ 본 트랙의 *measurement framework*
  - Critical frequencies ↔ 본 트랙의 *interpretable feature*
```

## 17.9 자기점검 (이 챕터)

### 핵심 3 가지

1. **Nanda 2023 의 *3 년 후 영향력* 의 *가장 critical* paradigm shift?**
2. **Wang 2024 (Grokked Transformers) 와 *방법론적 차이*의 의의?**
3. **Foundation model era 에서 *Nanda 의 still relevance*?**

### 답변

1. **"Mystery → Mechanism" shift**. 2022 의 Grokking 발견 = *unpredictable mystery* 로 받아들임. Nanda 의 *Fourier circuit + progress measures* = *measurable mechanism* 입증. 2024-2026 의 *모든 mech interp paper* 가 *Nanda 의 methodology* 위에. *Foundation* paper 의 표본.

2. **Methodology generality 의 trade-off**. Nanda = *task-specific exact analysis* (Fourier ground truth 알려짐). Wang = *task-generic generic tools* (Logit Lens / Causal Tracing). 둘 다 *valuable*: Nanda 가 *methodology validation*, Wang 가 *scalability*. ACDC / SFC 가 *Nanda 의 manual* → *Wang 의 generic* 의 *bridge*.

3. **Methodology 의 *baseline reference***. 2026 의 LLM interpretability 연구 시 *Nanda 의 4-phase + progress measures* 가 *training dynamics 분석* 의 *first-pass tool*. *Toy task* 에서 *learned circuit 의 exact analysis* 가 *현재도 valuable* — 학부생 *first project* + *new methodology validation*.
