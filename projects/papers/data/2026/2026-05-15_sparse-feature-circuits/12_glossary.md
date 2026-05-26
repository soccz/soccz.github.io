# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: SFC (Marks et al. ICLR 2025) "Sparse Feature Circuits" 의 기술 용어 + 인용 paper 의 빠른 참조.

## 12.1 용어집

### 핵심 용어

**SFC (Sparse Feature Circuits)**
Marks et al. 2025 의 paper 명. *SAE features* 사이의 *circuit discovery* — Anthropic SAE 와 ACDC algorithm 의 결합.

**Sparse Autoencoder (SAE)**
Hidden state → sparse activation vector 의 autoencoder.
$$z = \text{ReLU}(W_{\text{enc}}(x - b_{\text{dec}}))$$
$$\hat{x} = W_{\text{dec}} z + b_{\text{dec}}$$
- $x \in \mathbb{R}^d$: original hidden state
- $z \in \mathbb{R}^N$ (large): sparse feature activation ($N \gg d$, 1-5% 만 non-zero)
- $\hat{x}$: reconstruction
Loss: $\|x - \hat{x}\|^2 + \lambda \|z\|_1$ (L1 sparsity)

**SAE Feature**
$z$ 의 각 component $z_i$. Interpretable 의미:
- "Trump-related" feature
- "Negation handling" feature
- "Code completion" feature

**Sparse Circuit**
Circuit nodes = SAE features (~수만), edges = inter-feature dependencies. ACDC algorithm 으로 *task-specific responsible subset* 식별.

**Attribution Patching** (paper §3)
SFC 의 핵심 algorithm. Gradient × activation 의 *attribution score*:
$$A_f = \nabla_f \mathcal{L} \cdot f(x)$$
- $f$: feature
- $\mathcal{L}$: task loss
- 높은 $A_f$ = task에 critical

**Circuit Evaluation**
3 방법:
1. **Faithfulness**: ablating circuit → task performance drop
2. **Completeness**: 외부 features ablation → drop 없음
3. **Minimality**: 더 작은 subset 으로 task 수행 불가

**Shift Method** (paper §5)
Circuit-level editing — 특정 feature 제거 또는 amplify 로 *behavior 변경*. Gender bias 의 *gender feature 제거* 등.

### 보조 용어

**Feature Dictionary**
SAE 의 학습된 *features 의 집합*. Bricken 2023 의 GPT-2 small 에서 *수만 features* 학습.

**Auto-Interpretability**
SAE feature 의 *자동 의미 부여* — LLM 으로 feature 의 *examples* 분석, *자연어 description* 생성.

**Effect Score**
Feature 가 task 에 미치는 영향. Causal effect 의 *quantitative measure*.

**Multi-task Circuits**
같은 SAE features 가 *다른 tasks* 에 *얼마나 reused*. Cross-task feature overlap 분석.

---

## 12.2 표기법

| 기호 | 의미 |
|------|------|
| $f_i$ | SAE feature $i$ |
| $z = \text{SAE}(x)$ | sparse activation vector |
| $A_f$ | attribution score for feature $f$ |
| $C$ | discovered circuit (subset of features) |
| $\mathcal{L}_\text{task}$ | task-specific loss |
| $N$ | SAE feature count |
| $\lambda$ | L1 sparsity coefficient |

---

## 12.3 References

### Sparse Autoencoder foundation

- **Bricken et al. 2023 (Anthropic)**: Towards Monosemanticity (initial SAE).
- **Cunningham et al. 2024**: Sparse Autoencoders Find Highly Interpretable Features.
- **Templeton et al. 2024 (Anthropic)**: Scaling SAE to Claude models.

### Circuit Discovery

- **Conmy et al. 2023 (ACDC)**: Automated Circuit Discovery.
- **Olsson et al. 2022**: Induction heads.
- **Wang et al. 2022**: IOI circuit.

### SFC 의 후속

- **Lieberum et al. 2024**: Patchscopes.
- **Templeton et al. 2024**: Anthropic production SAE.
- **Bills et al. 2023 (OpenAI)**: Auto-interpretability.

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| SFC | Sparse Feature Circuits |
| SAE | Sparse Autoencoder |
| ACDC | Automated Circuit Discovery |
| MLP | Multi-Layer Perceptron |
| KL | Kullback-Leibler divergence |
| L1 | L1 norm (sparsity penalty) |
| MoE | Mixture-of-Experts |
| ROME | Rank-One Model Editing |

---

## 12.5 자기점검

### 핵심 3 가지

1. **SAE features 가 *heads/MLPs* 보다 *더 interpretable* 인 이유?**
2. **Attribution patching 의 *gradient × activation* 의 의미?**
3. **Shift method 의 *causal editing* 의 power?**

### 답변

1. **Sparse encoding 의 *monosemanticity***. Dense head/MLP activation = *polysemantic* (한 component 가 *여러 concepts* 표현). SAE features = *sparse + monosemantic* (한 feature = *single concept*). 예: "Trump" feature 가 *trump-related contexts only* fire. *one-to-one* mapping 가능 → *interpretable description* 자동 생성.

2. **First-order Taylor approximation of effect**. $A_f = \nabla_f \mathcal{L} \cdot f(x)$ = "*feature $f$ 가 *0* 으로 변경 시 loss 변화 추정". *Gradient* 가 *sensitivity*, *activation* 이 *magnitude*. 곱 = *expected effect on output*. **ACDC 의 full ablation** 보다 *훨씬 빠름* — gradient 계산만으로 *모든 features 동시 평가*.

3. **Targeted behavior modification**. Circuit identification 후 *specific feature ablation* 또는 *amplification*. 예: *Gender bias circuit* 발견 → *gender features* 제거 → bias 감소 *without retraining*. **production safety** 의 *editable AI* paradigm.
