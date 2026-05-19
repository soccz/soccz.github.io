# 05 Preliminaries — Transformer Architectures (Section 2.2)

paper p.3. 표준 Transformer attention 복습 + ProTran 만의 사용 방식.

## Multi-Head Attention 표준 형식

paper Eq 4:
$$
O_h = \text{Attention}(Q_h, K_h, V_h) = \text{Softmax}\!\left(\frac{Q_h K_h^T}{\sqrt{d}}\right) V_h
$$

paper text:
> Central to our models and other transformer-based approaches [48, 85] is the notion of attention [5], which allows the models to focus on important parts within a context.

**표기**:
- $Q \in \mathbb{R}^{\ell_q \times d}$ — queries (길이 $\ell_q$, dimension $d$)
- $K, V \in \mathbb{R}^{\ell_k \times d}$ — key/value pairs (길이 $\ell_k$)
- $O = [O_1, \ldots, O_H] \in \mathbb{R}^{\ell_q \times d}$ — multi-head output

**Multi-head 분해**:
$$
Q_h = Q W^Q_h, \quad K_h = K W^K_h, \quad V_h = V W^V_h
$$

learning parameters $W^Q_h, W^K_h, W^V_h$ for each head $h \in [1, H]$.

---

## Self-attention vs Cross-attention

paper p.3:
> In case $Q = K = V$, we refer to such an attention mechanism as self-attention.

**Self-attention**: $Q = K = V$ — 같은 source 의 내부 dependency.

**Cross-attention**: $Q \neq K = V$ — 다른 source 에서 정보 추출.

ProTran 은 **둘 다 사용**:
- Eq 6: $Q = w_{t-1}, K = V = w_{1:t-1}$ — latent 의 self-attention
- Eq 7: $Q = \bar{w}_t, K = V = h_{1:C}$ — latent → context cross-attention
- Eq 10: $Q = K = V = h_{1:T}$ — observation 의 self-attention (smoothing)

---

## Transformer 의 핵심 장점

paper p.3:
> Given fully observed sequences of inputs, the mapping can be computed efficiently without any imposed sequential order often seen in recurrent neural networks [19, 42]. More importantly, the direct connections between long-distance time steps are baked into the mechanism as information from previous time steps is easily accessible without being compressed into a fixed representation, easing optimization and learning of long-term dependencies [5, 85].

**RNN 대비 두 장점**:
1. **No sequential order**: parallel computation 가능.
2. **Direct long-distance connections**: 정보 손실 없이 어떤 거리도 attention 가능.

→ Long-range dependencies 학습이 RNN 보다 훨씬 효과적. ProTran 이 RNN 완전 제거하는 이유.

---

## Position Embedding (Eq 5 의 일부)

paper p.4:
> Without recurrence, Transformer [85] encodes information about each time step $t$ with predefined sinusoidal positional embeddings $\text{Position}(t) = [p_t(1), \ldots, p_t(d)] \in \mathbb{R}^d$ where the $i$-th embedding is given by $p_t(i) = \sin(t \cdot c^{i/d})$ for even $i$ and $p_t(i) = \cos(t \cdot c^{i/d})$ for odd $i$ and $c$ is some large constant. Empirical results show that such positional embeddings are also important to our models.

**Sinusoidal position embedding**:
$$
p_t(i) = \begin{cases} \sin(t \cdot c^{i/d}) & i \text{ even} \\ \cos(t \cdot c^{i/d}) & i \text{ odd} \end{cases}
$$

표준 Transformer (Vaswani 2017) 와 동일. $c$ 는 large constant (예: 10000).

paper claim: ProTran 에서도 important.

---

## ProTran 의 Transformer 사용 방식 — 차별점

| 항목 | Standard Transformer | ProTran |
|------|--------------------|---------|
| Attention 적용 대상 | Observation tokens $x_{1:T}$ | **Latent variables $z_{1:T}$** + observations |
| Generation | Autoregressive (one token at a time) | **Non-autoregressive** (parallel latent sample) |
| Output | Deterministic | **Stochastic** (sample from $z$) |
| Inference | N/A (just forward pass) | **Variational** (Eq 10-11) |

→ ProTran 은 Transformer 의 **machinery** (attention + layer norm + MLP) 만 빌리고, 그 위에 **SSM의 latent variable structure** 를 입힘.

---

## Eq 4 ~ Eq 5 의 transition

paper Section 2.2 (Eq 4) 가 standard Transformer preliminaries. paper Section 3.1 (Eq 5-9) 부터 ProTran 의 구체적 architecture.

**Eq 4 → Eq 5 의 변화**:
- Eq 4: 일반 Transformer attention 의 정의.
- Eq 5: ProTran 의 context preprocessing — $h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))$.

→ ProTran 은 **context observations 를 가볍게 전처리** (full encoder 안 함). 무거운 작업은 latent 부분에.

---

## 다음

[06_single_layer_generative.md](06_single_layer_generative.md) 에서 single-layered ProTran 의 generative model (Eq 5-9).
