# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: ACDC (Conmy et al. NeurIPS 2023 Spotlight) 의 *기술 용어* + *수학 기호* + *인용 paper* 의 빠른 참조.

## 12.1 용어집 (Glossary)

### 핵심 용어

**ACDC** (Automated Circuit Discovery)
Conmy et al. 2023 의 알고리즘 명. *Trained transformer 의 internal circuit* 을 *자동으로 식별*. Mechanistic interpretability 의 *automation milestone*.

**Circuit** (paper §3)
*Specific behavior* 를 만드는 *모델 component 의 subgraph*. Example:
- Components = attention heads + MLP layers + embeddings
- Edges = component 간 information flow
- Circuit = behavior 의 *causally sufficient subgraph*

**IOI (Indirect Object Identification)** (paper §4 main task)
Test task: "Then, Mary and John went to the store. John gave a drink to ___" → "Mary".
- Subject (Mary) 와 Object (John) 의 *grammatical role* 추적
- Indirect Object 식별 능력
- paper 가 *26-edge circuit* 발견

**Edge-by-Edge Ablation** (paper §3.2 ACDC algorithm)
ACDC 의 핵심 알고리즘:
1. Full computational graph 시작 (모든 edges 포함)
2. 각 edge 를 *ablate* (제거 또는 noise 로 corrupt)
3. Performance drop 측정
4. Drop 이 *threshold 이하* 인 edge 제거 (해당 behavior 에 *unnecessary*)
5. 반복 — *minimal sufficient circuit* 도출

**Patching** (paper §3.1 + ROME 계보)
*Activation patching* 의 일반화:
- *Clean run*: 정상 input + 정답 prediction
- *Corrupt run*: corrupted input (예: 다른 entity) + wrong prediction
- *Patched run*: corrupt run 의 *특정 activation* 을 clean run 의 값으로 교체
- 측정: patched run 이 *정답 prediction 복원* 정도 = 해당 component 의 *causal effect*

**Resampling Ablation** (paper §3.1)
ACDC 의 default ablation 방법. *Edge 의 input* 을 *다른 random input* 의 activation 으로 대체:
$$\text{Resample}(e_{i \to j}) = \text{replace}(h_j^{\text{input}}, h_j^{\text{from corrupt}})$$

**Performance Threshold** ($\tau$, paper §3.3)
Edge 제거 시 *허용 가능한 performance drop*. 너무 작으면 *over-pruning* (essential edges 제거), 너무 크면 *under-pruning* (irrelevant edges 잔존).

**KL Divergence Metric**
ACDC 의 *performance metric*. Clean run 의 output distribution 과 ablated run 의 *KL divergence*. Lower = better preserved.

### Computational Graph 개념

**Direct Path** vs **Indirect Path**
- Direct: Component A → output (1 hop)
- Indirect: Component A → Component B → output (2+ hops)

**Edge Importance** ($I(e)$)
$$I(e) = \text{KL}(\hat{y}_{\text{full}} || \hat{y}_{\text{ablate } e})$$
edge $e$ 제거 시 *output distribution 변화*.

**Critical Frequencies**
Nanda 2023 에서 빌려온 개념 — *Fourier circuit 의 specific frequencies*. ACDC 는 *general circuit* 의 *critical edges* 식별.

---

## 12.2 표기법

| 기호 | 의미 |
|------|------|
| $G = (V, E)$ | Computational graph (vertices = components, edges = info flow) |
| $V$ | Components: attention heads, MLP layers, embeddings |
| $E$ | Edges between components |
| $\tau$ | Performance threshold for edge pruning |
| $I(e)$ | Edge importance (KL divergence) |
| $C^* \subset G$ | Discovered minimal sufficient circuit |
| $\text{KL}(\cdot \| \cdot)$ | Kullback-Leibler divergence |

---

## 12.3 References

### Mechanistic Interpretability 시조

- **Olsson et al. 2022**: Induction Heads (Anthropic).
- **Elhage et al. 2021**: A Mathematical Framework for Transformer Circuits.
- **Wang et al. 2022**: Interpretability in the Wild (IOI task 정의).
- **Meng et al. 2022 (ROME)**: Locating and Editing Factual Associations.
- **Nanda et al. 2023**: Progress Measures (Fourier circuit).

### ACDC 의 후속

- **Marks et al. 2024 (SFC)**: Sparse Feature Circuits.
- **Chughtai et al. 2024**: Activation patching for grokking.
- **Lieberum et al. 2024**: Patchscopes.

### Computational Graph 분석

- **Vig & Belinkov 2019**: Attention head 분석 framework.
- **Goldowsky-Dill et al. 2023**: Direct + Indirect effect 분해.

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| ACDC | Automated Circuit Discovery |
| IOI | Indirect Object Identification |
| KL | Kullback-Leibler divergence |
| ROME | Rank-One Model Editing |
| SAE | Sparse Autoencoder |
| SFC | Sparse Feature Circuits |
| MHA | Multi-Head Attention |
| FFN | Feed-Forward Network |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **ACDC 의 *edge-by-edge* approach 가 *node-by-node* 보다 *왜 효과적*?**
2. **Resampling ablation 의 *clean vs corrupt* design 의 이유?**
3. **IOI 의 *26 edges* 의 *significance*?**

### 답변

1. **Information flow 의 *fine-grained* 분석**. Node ablation = "*component 전체* 제거" — 너무 *coarse*. Edge ablation = "*specific information path* 제거" — 같은 node 가 *여러 path* 에 참여 시 *각 path 의 contribution* 분리 가능. *Causal sufficiency* 검증 의 더 정밀 도구.

2. **Distribution shift 의 *조작된 변화***. Corrupt input = *trained distribution 안* 의 *similar* input (다른 entity 등). 만약 *random noise* corrupt 면 → *out-of-distribution* 의 nonsense output. **Resampling** 이 *meaningful baseline* 유지 → *circuit ablation* 의 *interpretable causal effect*.

3. **Complex multi-step reasoning 의 *minimal sufficient subgraph***. IOI = *3-step reasoning* (subject 식별 → object 식별 → IO 결론). *26 edges* = "이 reasoning 의 *minimal causal flow*". GPT-2 의 *total ~144 attention heads × multiple FFN* 의 *대부분* 이 IOI 와 *무관*. 26 = *task-specific causal subgraph* 의 *sparse 정도*.
