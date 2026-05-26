# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: TAPPA (Yang et al. ICLR 2026) "Why Attention Patterns Exist" 의 모든 *기술 용어* + *수학 기호* + *인용 paper* 의 빠른 참조.

## 12.1 용어집 (Glossary)

### 핵심 용어

**Attention Pattern**
Transformer 의 학습된 attention map ($A \in \mathbb{R}^{T \times T}$) 에 나타나는 *시각적 motif*. paper §3:
- **Diagonal**: 인접 토큰 간 attention (시간적 인접성)
- **Stripe**: 일정 거리의 토큰 간 attention (주기성)
- **Block**: 클러스터 내 강한 attention (segment 그룹)
- **Spike**: 특정 토큰 1개 의 강한 attention
- **Edge**: 시퀀스 시작/끝 의 강조

**Q-similarity** (paper §4)
TAPPA 의 핵심 개념. *Query vector* $q_i$ 의 *self-similarity* 가 attention pattern 의 결정 인자:
$$\text{Q-sim}(i, j) = \langle q_i, q_j \rangle$$

paper 의 핵심 발견: **Q-similarity 가 high → diagonal pattern, low → spike pattern**.

**RoPE (Rotary Position Embedding)** (Su et al. 2021)
회전 행렬 기반 position embedding. *Relative position* 의 implicit encoding:
$$\text{RoPE}(q, m) = R_{\theta, m} q$$
where $R$ is a rotation matrix at angle $m\theta$.

paper §5 가 RoPE 의 *spectral decomposition* 분석 — pattern emergence 의 *frequency-based explanation*.

**Spectral Decomposition** (paper §5)
RoPE 의 *Fourier transform-like* 분해. Query/Key 의 *spectral components* 가 *attention pattern type* 결정.

**Unifying Temporal Perspective** (paper main thesis)
*하나의 framework* 로 *모든 attention pattern* 설명. *temporal axis* 의 *위치 정보 transformation* 이 *pattern emergence* 의 root cause.

**Theorem (paper §6)**
TAPPA 의 main theorem — attention pattern 의 *predictability*:
$$\text{Pattern}(A_{ij}) = f(\text{Q-sim}, \text{RoPE freq}, \text{position diff})$$

### 보조 용어

**Rotation angle** ($\theta$)
RoPE 의 회전 frequency. $\theta_k = 10000^{-2k/d}$ 표준 setting.

**Token frequency**
Pattern emergence 의 *temporal signature* — 일부 token 의 *주기적* attention 받음.

**Multi-head attention pattern**
다양한 head 가 *다른 pattern* 학습 — paper 의 *unifying* 의미: *모든 head pattern* 이 *같은 framework* 로 설명.

---

## 12.2 표기법

| 기호 | 의미 |
|------|------|
| $q_i, k_j \in \mathbb{R}^d$ | Query/Key vectors |
| $A \in \mathbb{R}^{T \times T}$ | Attention matrix |
| $A_{ij} = \frac{q_i^T k_j}{\sqrt{d}}$ | pre-softmax score |
| $R_{\theta, m}$ | RoPE rotation matrix |
| $\theta_k$ | RoPE frequency for dim $k$ |
| $T$ | sequence length |
| $d$ | head dim |

---

## 12.3 References

### Attention Pattern foundation

- **Vaswani et al. 2017**: Transformer + attention
- **Su et al. 2021**: RoPE (Rotary Position Embedding)
- **Clark et al. 2019**: BERT attention heads 분석
- **Voita et al. 2019**: head-specific roles
- **Olsson et al. 2022**: Induction heads (Anthropic)

### Mechanistic Interpretability

- **Nanda et al. 2023**: Progress Measures (Fourier circuit)
- **Wang et al. 2024**: Grokked Transformers
- **Bricken et al. 2023**: Anthropic SAE
- **Conmy et al. 2023**: ACDC

### Position Embedding

- **Shaw et al. 2018**: Relative position
- **Press et al. 2021**: ALiBi
- **Sun et al. 2022**: xPos

### TAPPA 의 직접 ancestor

- **Jain & Wallace 2019**: Attention is not Explanation
- **Wiegreffe & Pinter 2019**: rebuttal

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| TAPPA | Why Attention Patterns Exist (paper acronym) |
| RoPE | Rotary Position Embedding |
| ALiBi | Attention with Linear Biases |
| PE | Position Embedding |
| Q-sim | Query similarity |
| MHA | Multi-Head Attention |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **Q-similarity 가 *왜* attention pattern 의 결정 인자?**
2. **RoPE 의 *spectral decomposition* 의 *결정적 insight*?**
3. **"Unifying temporal perspective" 의 *의의*?**

### 답변

1. **Query 의 *similarity 구조* 가 *post-softmax pattern* 의 *causal* 결정**. $A_{ij} = q_i^T k_j / \sqrt{d}$. 만약 $q_i, q_j$ 가 *similar* (high Q-sim) → 같은 *key 분포* → diagonal pattern. *Distinct* (low Q-sim) → different key 분포 → spike pattern. **mathematical 직접 인과**.

2. **RoPE 의 *각 frequency $\theta_k$* 가 *pattern 의 *period*** 결정. Low frequency (small $\theta_k$) → long-range stripe. High frequency → fine diagonal. → "*RoPE 의 frequency selection*" 이 *pattern type 의 design control*.

3. ***다양한 attention patterns* 의 *single framework* 통합**. 기존 papers (Clark 2019 / Voita 2019) 는 *각 head 의 role* 을 *case-by-case* 분석. TAPPA 가 *Q-similarity + RoPE frequency* 의 *2 axis* 로 *모든 pattern type* 위치 — *unifying explanatory framework*.
