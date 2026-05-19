# 06 Single-Layered ProTran — Generative Model (Section 3.1)

paper p.4. ProTran 의 가장 기본 architecture.

![Fig. 1(b) ProTran 1 layer](figures/Fig1_graphical_models.png)

(Figure 1(b), paper p.2. Single-layer ProTran 의 graphical model)

---

## Step 1: Context Embedding (Eq 5)

paper Eq 5:
$$
h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))
$$

paper text:
> Given some contexts $x_{1:C}$, we first apply a linear projection and combine it with a positional embedding to obtain $h_{1:C} \in \mathbb{R}^d$.

**해석**:
- 입력 $x_t \in \mathbb{R}^N$ (multivariate observation)
- MLP 로 차원 변환 → hidden $d$ 차원
- Position embedding 더함 (paper Eq 5 의 위치 정보)
- LayerNorm 으로 안정화

**Note (paper):**
> While a traditional transformer model often dedicates an entire encoder for the same purpose [55, 72], we find such a simple mapping works sufficiently well in conjunction with the context-attention module of the corresponding decoder.

→ paper 는 full encoder 대신 **단일 MLP + position** 만 사용. 무거운 인코딩 절약.

---

## Step 2-4: Latent Generation (Eq 6-9)

paper text:
> As implied in Equation (2), our latent dynamics decomposes auto-regressively. At each time step, we parametrize the distribution $p_\theta(z_t | z_{1:t-1}, x_{1:C})$ by a Gaussian with parameters resulting from two sequential steps of attention: a self-attention over the previously inferred states $z_{1:t-1}$ and another attention over the projected contexts $h_{1:C}$.

**핵심 디자인**:
1. Latent 사이의 self-attention (non-Markovian)
2. Latent → context cross-attention

paper:
> These two operations mirror those found in the decoder of Transformer [85], with the stochastic latent variables replacing its decoder inputs.

→ 표준 Transformer decoder 의 구조와 동일, 단 decoder input 자리에 **stochastic latent variables** 가 들어감.

---

## 왜 stochastic z 자체를 attention query 로 안 쓰는가 (paper p.4)

> Unfortunately, using stochastic samples of $z_t$ as attention queries is problematic, as purely stochastic transitions make it difficult for the model to reliably retain information across multiple time steps [17, 30, 39]. We therefore encapsulate the latent variables in hidden representations $w_t$ that also has a deterministic component.

**문제**: 순수 stochastic latent 만 사용하면 정보 retention 어려움.

**답**: $w_t$ 라는 **hybrid representation** 도입 — deterministic component 포함.
- $w_t$ 가 attention query/key/value 로 사용
- $z_t$ 는 $w_t$ 안에 "encapsulate" 됨

---

## 4-Step Generative Process (Eq 6-9)

paper p.4:
> Starting with a learnable, context-agnostic representation $w_0$, we recursively update $w_t$ using a stochastic sample from $p_\theta(z_t | z_{1:t-1}, x_{1:C})$ and the positional embedding for the current time step $t$. The generating process for the time step $t$ can be summarized by the following pseudocode:

paper Eq 6:
$$
\bar{w}_t = \text{LayerNorm}(w_{t-1} + \text{Attention}(w_{t-1}, w_{1:t-1}, w_{1:t-1}))
$$

paper Eq 7:
$$
\hat{w}_t = \text{LayerNorm}(\bar{w}_t + \text{Attention}(\bar{w}_t, h_{1:C}, h_{1:C}))
$$

paper Eq 8:
$$
z_t = \text{Sample}(\mathcal{N}(z_t; \text{MLP}(\hat{w}_t), \text{Softplus}(\text{MLP}(\hat{w}_t))))
$$

paper Eq 9:
$$
w_t = \text{LayerNorm}(\hat{w}_t + \text{MLP}(z_t) + \text{Position}(t))
$$

---

## 각 단계 자세히

### Eq 6 — Self-attention over past latents
- **Query**: $w_{t-1}$ (이전 시점 hidden)
- **Key/Value**: $w_{1:t-1}$ (모든 이전 시점 hidden)
- **결과**: $\bar{w}_t$ — past 의 정보를 모은 representation

→ **Non-Markovian**: $w_t$ 가 $w_{t-1}$ 뿐 아닌 $w_{1:t-1}$ 전체 의존.

### Eq 7 — Cross-attention to context
- **Query**: $\bar{w}_t$
- **Key/Value**: $h_{1:C}$ (context observations 의 embedding)
- **결과**: $\hat{w}_t$ — context 의 정보까지 통합

→ Latent 가 context 에서 정보 추출 (인코더-디코더 attention 형식).

### Eq 8 — Sample latent (Gaussian)
- 평균 $\mu = \text{MLP}(\hat{w}_t)$
- 분산 $\sigma = \text{Softplus}(\text{MLP}(\hat{w}_t))$ (positive)
- $z_t \sim \mathcal{N}(\mu, \sigma^2)$

→ **Stochastic latent** 생성. Softplus 로 분산 positive 보장.

### Eq 9 — Update hidden
- $w_t = \text{LayerNorm}(\hat{w}_t + \text{MLP}(z_t) + \text{Position}(t))$

→ Latent 정보 + position 정보 → 다음 시점의 hidden.

---

## Emission (final output)

paper p.4:
> Each stochastic sample of $w_{1:T}$ is then mapped to a sequence of $x_{1:T}$ via a multi-layer perceptron.

$$
x_t = \text{MLP}(w_t)
$$

paper 가 강조:
> We emphasize that our generation procedure in the latent space is more efficient than others in the observation space, which requires encoding and decoding high-dimensional inputs repeatedly.

→ ProTran 은 latent space 에서 모든 generation 진행, **high-dim observation 의 반복 encode/decode 회피**.

---

## ASCII flow

```
Context observations x_{1:C}
   │
   ↓ Eq 5: MLP + Position + LayerNorm
   │
h_{1:C}  ← context embeddings
   │
   │
For each t in 1..T:
   │
   ↓ Eq 6: Self-Attn (w_{t-1} on w_{1:t-1})
   │
   │
   ↓ Eq 7: Cross-Attn (w_t on h_{1:C})
   │
   │
   ↓ Eq 8: Sample z_t from N(μ, σ²)
   │
   │
   ↓ Eq 9: Update w_t = LN(ŵ_t + MLP(z_t) + Position(t))
   │
   ↓ Append to w_{1:t}
   ↓ (continue to next t)
   │
   ↓ Final emission
   │
x_t = MLP(w_t)
```

---

## 다음

[07_single_layer_inference.md](07_single_layer_inference.md) 에서 inference model (training time only, Eq 10-11).
