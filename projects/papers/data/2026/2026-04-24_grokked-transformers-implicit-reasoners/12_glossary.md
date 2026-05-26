# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: Grokked Transformers (Wang et al., ICLR 2024) 의 *모든 기술 용어* + *수학 기호* + *인용 paper* 의 단일 빠른 참조. "Grokking 이 뭐였더라?", "Composition vs Comparison task 차이?", "Logit lens 작동 원리?" 같은 질문에 즉시 답하는 페이지.

## 12.1 용어집 (Glossary)

### 핵심 용어

**Grokking** (Power et al., 2022)
신경망의 *지연된 일반화* (delayed generalization) 현상. 학습 시 *훈련 정확도 100% 도달 후에도* 검증 정확도가 *낮게 유지되다가*, 추가 학습 step (수만 - 수십만 step) 후 *갑자기 일반화*. paper 의 핵심 분석 대상.

**Implicit Reasoning**
명시적 reasoning trace (Chain-of-Thought) 없이 *parametric memory* (모델 가중치 자체) 로 추론. Grokked Transformer 의 핵심 능력 — 학습 후 *직접 답* 산출, intermediate 추론 step 시각화 없음.

**Composition task** (paper §3)
$(A \to B) + (B \to C) \Rightarrow (A \to C)$ 의 transitive 관계 추론. 
- Train: $(A_i \to B_i)$ pairs 학습
- Test (in-distribution): 학습된 entity 의 새 composition
- Test (OOD): 미관측 entity 의 composition

**Comparison task** (paper §3)
$\text{attr}(A) > \text{attr}(B)$ 의 비교 추론.
- Train: 다양한 entity pair 의 attribute comparison
- Test: in-distribution vs OOD

**Edge of generalization**
Grokking transition 의 *경계 영역* — 학습 후반 small data shift 에서 정확도 급변. paper 의 핵심 발견: *training distribution 의 영역 밖* 에서 모델이 *완전 실패* (composition) 또는 *부분 성공* (comparison).

**Generalization circuit** (Nanda 2023 lineage)
Grokking transition 후 *형성되는 internal circuit*. Composition task 의 generalization circuit = *2-hop reasoning* 의 *learned attention pattern*.

**Logit Lens** (nostalgebraist 2020)
Transformer 의 *각 layer hidden state* 를 *unembedding matrix* 로 직접 변환하여 *예측 분포* 분석. 각 layer 가 *어떤 답으로 수렴* 하는지 추적.

**Causal Tracing** (ROME, Meng 2022)
*특정 layer/position 의 activation* 을 *clean vs corrupt run* 비교로 *causal effect* 측정. *어느 component 가 prediction 의 결정* 인가 정밀 검증.

**Parametric Memory** (paper main contribution)
모델 *가중치 자체* 에 저장된 지식. CoT (in-context) 또는 RAG (external retrieval) 와 *대비*. Grokked transformer 의 *parametric memory* 가 *LLM 의 CoT* 보다 *복잡 추론* 에 우월.

**ID** (In-Distribution) vs **OOD** (Out-of-Distribution)
- ID: 학습 데이터와 *같은 분포* 의 test
- OOD: 학습 데이터와 *다른 분포* (예: 새 entity, 새 attribute combination)
- paper 의 핵심 발견: composition task 가 OOD 에 *완전 실패*, comparison 은 *부분 성공*.

**Training Step / Convergence**
- Train accuracy 100% 도달: 일반적 *수만 step*.
- Grokking transition: *추가 수십-수백만 step*.
- paper 의 *극단 학습 시간* — generalization 의 *cost*.

### 보조 용어

**1-hop / 2-hop reasoning**
- 1-hop: $A \to B$ 직접 lookup
- 2-hop: $A \to B \to C$ 의 chained inference
- paper 의 composition task 는 *2-hop*.

**Attribute / Entity / Relation**
- Entity: 고유 토큰 (A, B, C, ...)
- Attribute: entity 의 속성 (예: age, height)
- Relation: entity 간 관계 (예: parent_of, taller_than)

**Logit difference**
Causal tracing 의 metric — *clean run logit* vs *corrupted run logit* 차이. *clean* prediction 의 정확도.

---

## 12.2 표기법 (Notation)

paper §3 의 표기:

| 기호 | 의미 |
|------|------|
| $E = \{e_1, \ldots, e_N\}$ | entity set (예: N=2000) |
| $A = \{a_1, \ldots, a_M\}$ | attribute set (예: M=200) |
| $R = \{r_1, \ldots, r_K\}$ | relation set |
| $(e_i, r_k, e_j) \in F$ | training fact triple |
| $\text{ID-test}$ | in-distribution test |
| $\text{OOD-test}$ | out-of-distribution test (novel entities) |
| $L$ | number of transformer layers (예: 8) |
| $H$ | attention heads per layer (예: 8) |
| $d$ | model dim (예: 768) |

**Forward pass**:
$$h^{l+1} = \text{TrmBlock}(h^l), \quad l = 0, \ldots, L-1$$
$$\hat{y} = \text{Unembed}(h^L_{\text{[CLS]}})$$

---

## 12.3 References (paper 본문 인용)

### 핵심 인용 — Grokking foundation

- **Power, A., et al. (2022).** "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets." *arXiv:2201.02177*. — Grokking 발견.
- **Nanda, N., et al. (2023).** "Progress Measures for Grokking via Mechanistic Interpretability." *ICLR 2023*. — Modular arithmetic 의 Fourier circuit 분석.
- **Liu, Z., et al. (2022).** "Towards Understanding Grokking: An Effective Theory of Representation Learning." *NeurIPS 2022*. — Effective theory.

### Mechanistic Interpretability

- **nostalgebraist (2020).** "Interpreting GPT: the Logit Lens." — Layer-wise prediction.
- **Meng, K., et al. (2022).** "Locating and Editing Factual Associations in GPT (ROME)." *NeurIPS 2022*. — Causal tracing.
- **Wang, K., et al. (2023).** "Interpretability in the Wild: Indirect Object Identification (IOI)." *ICLR 2023*. — Circuit 분석.

### Transformer + Reasoning

- **Vaswani, A., et al. (2017).** "Attention is all you need." *NeurIPS 2017*.
- **Wei, J., et al. (2022).** "Chain-of-Thought Prompting Elicits Reasoning." *NeurIPS 2022*. — CoT.
- **Lewis, P., et al. (2020).** "Retrieval-Augmented Generation (RAG)." *NeurIPS 2020*.

### LLM 비교 baseline

- **OpenAI (2023).** GPT-4 technical report.
- **Anil, R., et al. (2023).** "Gemini" — Google.

### 후속 paper (2024-2026)

- **Chughtai, B., et al. (2024).** "Understanding Grokking with Activation Patching." — Causal intervention.
- **Anthropic (2024-2026).** Mechanistic interpretability research updates.

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| ICLR | International Conference on Learning Representations |
| OOD | Out-of-Distribution |
| ID | In-Distribution |
| CoT | Chain-of-Thought |
| RAG | Retrieval-Augmented Generation |
| ROME | Rank-One Model Editing |
| IOI | Indirect Object Identification |
| MLP | Multi-Layer Perceptron |
| FFN | Feed-Forward Network |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **Composition vs Comparison task 의 *결정적 차이*?**
2. **Parametric memory 가 *CoT / RAG* 대비 *우월한 영역*?**
3. **Edge of generalization 의 *practical 의미*?**

### 답변

1. **데이터 분포 의존성 차이**. **Composition**: $(A \to B \to C)$ 의 *transitive chain* — OOD entity 시 *완전 실패* (학습 시 본 chain 외 일반화 X). **Comparison**: $\text{attr}(A) > \text{attr}(B)$ 의 *relational* — OOD entity 시 *부분 성공* (attribute 의 *연속 ordering* 학습). → composition 이 *더 어려운* generalization, comparison 은 *easier transfer*.

2. **복잡 추론 + 정확도 중요 영역**. **CoT**: trace 의 *자연어 추론*, 인간 readable but error propagation (GPT-4 의 multi-step accuracy 저하). **RAG**: external retrieval, latency + 비용. **Parametric memory (grokked transformer)**: *직접 답*, *fast inference*, *near-perfect accuracy* on trained domain. 단점: *학습 비용 매우 큼* (grokking transition).

3. **"모델이 학습 범위 벗어나면 *왜 실패* 하는가" 의 mechanistic answer**. Composition 의 OOD 실패 = *generalization circuit* 이 *학습 distribution 의 특수 entity-relation pair* 에 *bound*. Comparison 의 *부분 OOD 성공* = attribute 의 *continuous ordering* 학습 → unseen entity 도 ordering 위에 mapping. → "*어떤 generalization* 이 *real generalization* 인가" 의 *empirical guideline*.
