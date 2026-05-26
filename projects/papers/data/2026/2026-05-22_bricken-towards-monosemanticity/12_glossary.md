# 12 Glossary & References — Bricken Monosemanticity

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: SAE / superposition / monosemantic / dictionary learning 의 핵심 개념과 reference 정리.

## 12.1 챕터 한 줄 요약

> **"Bricken et al. 2023 의 *Sparse Autoencoder pipeline* 의 30+ terminology + 25+ references (Anthropic, DeepMind, 학계) 의 1-stop 사전. 각 용어 의 *empirical signature* + cross-reference matrix."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Superposition | N neurons 가 N 이상 features 표현 | Elhage 2022 |
| Polysemanticity | 1 neuron 의 *복수 concept activation* | Elhage 2022 |
| Monosemanticity | 1 neuron / feature 의 *single concept activation* | Olah 2020 |
| Sparse Autoencoder (SAE) | overcomplete + L1 sparse encoder/decoder | Bricken 2023 |
| Dictionary Learning | overcomplete basis 의 *sparse decomposition* 학습 | Olshausen 1996 |
| Encoder W_enc | residual → SAE feature space | Bricken 2023 |
| Decoder W_dec | SAE feature → residual reconstruction | Bricken 2023 |
| Activation z | post-ReLU sparse feature value | Bricken 2023 |
| Reconstruction loss | ||x - x_hat||² | Bricken 2023 |
| L1 sparsity | λ ||z||_1, λ=1e-3 standard | Bricken 2023 |
| Expansion ratio | d_sae / d_model, typical 16-64× | Bricken 2023 |
| Active features/token | 1-5% of d_sae (300-1600 active) | Bricken 2023 |
| Auto-interpretability | LM 으로 feature meaning 자동 라벨 | Cunningham 2024 |
| Dead feature | never-activating feature in SAE | Templeton 2024 |
| Feature splitting | 1 raw concept → multiple SAE features | Bricken 2023 |
| Feature absorption | multiple raw concepts → 1 SAE feature | Bricken 2023 |
| Logit lens | layer-wise prediction probe | nostalgebraist 2020 |
| Residual stream | transformer 의 layer-wise activation flow | Elhage 2021 |
| Hook | activation interception during forward | TransformerLens |
| Ablation | feature 의 effect 측정 위해 0으로 강제 | Olsson 2022 |
| Causal scrubbing | counterfactual hypothesis 검증 protocol | Chan 2022 |
| Attention head | multi-head attention 의 single head | Vaswani 2017 |
| MLP | feedforward 2-layer + nonlinearity | Vaswani 2017 |
| Anthropic toy model | superposition 의 mathematical model | Elhage 2022 |
| ReLU SAE | F.relu(...) gating, Bricken default | Bricken 2023 |
| Top-K SAE | explicit top-K activation | Gao 2024 |
| Gated SAE | sparsity 의 architectural enforcement | Rajamanoharan 2024 |
| JumpReLU | threshold gating | Rajamanoharan 2024 |
| Crosscoder | multi-model SAE alignment | Lindsey 2024 |
| Cross-layer SAE | multi-layer shared dictionary | Templeton 2024 |
| Feature steering | inference-time feature amplify/ablate | Anthropic 2024 |

## 12.3 Notation

```
x ∈ R^d_model        residual stream input
z ∈ R^d_sae          SAE activation (sparse)
W_enc ∈ R^{d×d_sae}  encoder weight
W_dec ∈ R^{d_sae×d}  decoder weight  
b_enc, b_dec         biases
λ                    L1 sparsity coefficient
L_recon              MSE reconstruction loss
L_sparse             λ ||z||_1
L_total              L_recon + L_sparse
```

## 12.4 References (25+)

### 12.4.1 Direct precursors (Anthropic axis)

```
Elhage et al. 2021 — A Mathematical Framework for Transformer Circuits
Elhage et al. 2022 — Toy Models of Superposition
Olsson et al. 2022 — In-context Learning and Induction Heads
Bricken et al. 2023 — Towards Monosemanticity (★ 본 paper)
Templeton et al. 2024 — Scaling Monosemanticity (Sonnet)
Lindsey et al. 2024 — Crosscoders
```

### 12.4.2 Methodological foundations

```
Olshausen & Field 1996 — Sparse coding origin
Olah et al. 2020 — Distill: Zoom in on circuits
Wang et al. 2023 — IOI circuit
Conmy et al. 2023 — ACDC
Marks et al. 2024 — Sparse Feature Circuits
```

### 12.4.3 SAE variants (post-Bricken)

```
Cunningham et al. 2024 — Highly interpretable SAEs
Gao et al. 2024 — Top-K SAE
Rajamanoharan et al. 2024 — Gated SAE / JumpReLU
Lieberum et al. 2024 — Gemma Scope (DeepMind open-source)
```

### 12.4.4 Application papers

```
Anthropic blog 2024 — Feature steering (Golden Gate Claude)
OpenAI 2025 — Superalignment SAE
Lindsey 2024 — Anthropic Sparse Feature Steering
```

## 12.5 Cross-Reference Matrix

| 본 deep dive 챕터 | 직접 reference |
|-------------------|----------------|
| 02_tldr | Bricken 2023 §1 |
| 03_problem | Elhage 2022 (superposition) |
| 04a polysemanticity | Olah 2020, Elhage 2022 |
| 04b SAE evidence | Bricken 2023 §3-4 |
| 05a intuition | Olshausen 1996 |
| 05b architecture | Bricken 2023 §2 |
| 05c evaluation | Cunningham 2024 |
| 06 experiments | Bricken 2023 §3 |
| 07 limits | Bricken 2023 §6 |
| 08 lineage | Marks 2024, Templeton 2024 |
| 13 insights | Lindsey 2024 |
| 14 code | TransformerLens, Anthropic blog |
| 17 aftermath | Templeton 2024, Lieberum 2024 |

## 12.6 자기점검 (이 챕터)

### 핵심 3 가지

1. **Superposition 과 polysemanticity 의 *관계*?**
2. **L1 sparsity coefficient 의 *Goldilocks zone* 의 의미?**
3. **Feature splitting vs absorption 의 *직관적 차이*?**

### 답변

1. **Superposition = 원인, polysemanticity = 결과**. Superposition (Elhage 2022) = "*N neurons 가 N 이상 features 압축*" 의 architectural 현상. Polysemanticity = 그 결과 "*1 neuron 이 복수 concepts 에 반응*" 의 *behavioral signature*. SAE = *superposition 의 inverse* — 압축된 features 를 *separately addressable* unit 으로 분해.

2. **Sparsity-Reconstruction trade-off 의 sweet spot**. λ → 0: z dense (polysemanticity 회귀), reconstruction perfect. λ → ∞: z all-zero, reconstruction failure. λ = 1e-3: *active 1-5%* (300-1600 of 32K) — *monosemanticity 유도 충분* + *reconstruction acceptable* (recon loss < 0.05). Bricken 의 *empirical sweet spot* — *first principle 부재*, *empirical default*.

3. **Concept boundary 의 *granularity 결정***. **Splitting** = "raw neuron 의 *broad concept* (e.g., 'male pronoun') → SAE 가 *finer split* (e.g., 'he', 'his', 'him', 'himself' 각각 별 feature)". **Absorption** = "raw neuron 의 *narrow concepts* (e.g., 'he-in-question', 'he-in-statement') → SAE 가 *broader merge* ('he' single feature)". 둘 다 *desired or undesired* depending on use case — SAE size + λ 조절로 *splitting/absorption 균형*.
