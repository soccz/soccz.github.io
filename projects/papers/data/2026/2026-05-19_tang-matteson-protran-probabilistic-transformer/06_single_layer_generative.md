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

### 수식 4줄 풀이

**기호 뜻**:
- $x_t \in \mathbb{R}^N$: 시점 $t$ 의 multivariate observation ($N$ = series 수, 예: Traffic 의 963 도로)
- $\text{MLP}$: 2-layer perceptron, $N \to d$ 차원 변환
- $\text{Position}(t)$: sinusoidal position vector
- $+$ (덧셈): MLP 출력과 position 의 element-wise 합
- $\text{LayerNorm}$: 평균 0, 분산 1 로 정규화

**일상 비유**:
- $x_t$ = "도로 963 개의 점유율 측정값"
- $\text{MLP}(x_t)$ = "측정값들을 의미 있는 hidden 코드로 압축"
- $\text{Position}(t)$ = "이건 어느 시점의 정보인지 도장 찍기" (전화번호의 지역번호 같음)
- $\text{LayerNorm}$ = "다른 시점들과 scale 일관성 보장"

**왜 이 형태인가**:
- **MLP**: linear projection 만으론 비선형 패턴 못 잡음.
- **Position 덧셈**: attention 자체에 순서 정보 없음 → 명시적 주입.
- **LayerNorm**: gradient flow 안정 + scale invariance.
- 표준 Transformer 의 input layer 와 동일 구조.

**조심할 점**:
- $\text{Position}(t)$ 가 너무 크면 $\text{MLP}(x_t)$ 의 정보 묻힘. 두 scale 맞추는 게 중요.
- paper p.4 가 단순 MLP 사용 — full encoder 대신. 무거운 인코딩 절약.

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

## 각 단계 자세히 (4 단계의 비유 + 정확한 풀이)

### Eq 6 — Self-attention over past latents (Look Back)

$$
\bar{w}_t = \text{LayerNorm}(w_{t-1} + \text{Attention}(w_{t-1}, w_{1:t-1}, w_{1:t-1}))
$$

**비유**: "다음 의도를 결정하기 전, **이전 모든 의도들을 한 번 살펴봄**". $w_{t-1}$ 이 query, $w_{1:t-1}$ 이 key/value — "지금까지의 모든 마음 상태에서 관련된 부분 찾기."

- **Query**: $w_{t-1}$ (가장 최근 시점 hidden)
- **Key/Value**: $w_{1:t-1}$ (모든 이전 시점 hidden)
- **결과**: $\bar{w}_t$ — past 의 정보를 모은 representation

→ **Non-Markovian**: $w_t$ 가 $w_{t-1}$ 뿐 아닌 $w_{1:t-1}$ 전체 의존. 운전자가 0.1초 전 + 1초 전 + 10초 전 모두 동시 참고.

### Eq 7 — Cross-attention to context (Look at Input)

$$
\hat{w}_t = \text{LayerNorm}(\bar{w}_t + \text{Attention}(\bar{w}_t, h_{1:C}, h_{1:C}))
$$

**비유**: "이전 의도들 살펴본 후, 이제 **외부 입력 (실제 도로 상황)** 도 참고". $\bar w_t$ 가 query, context 의 $h_{1:C}$ 가 key/value — "지금까지 알게 된 패턴이 외부 context 와 어떻게 맞물리나."

- **Query**: $\bar{w}_t$
- **Key/Value**: $h_{1:C}$ (context observations 의 embedding)
- **결과**: $\hat{w}_t$ — context 의 정보까지 통합

→ Latent 가 context 에서 정보 추출 (인코더-디코더 attention 형식).

### Eq 8 — Sample latent (확률 결정)

$$
z_t = \text{Sample}(\mathcal{N}(\hat{w}_t \to \mu, \hat{w}_t \to \sigma))
$$

**기호 뜻**:
- 평균 $\mu = \text{MLP}(\hat{w}_t)$: latent 의 "중심"
- 분산 $\sigma = \text{Softplus}(\text{MLP}(\hat{w}_t))$: latent 의 "퍼짐"
- Softplus: $\text{softplus}(x) = \log(1 + e^x) > 0$ — 분산은 항상 positive
- $z_t \sim \mathcal{N}(\mu, \sigma^2)$: Gaussian 에서 sample

**일상 비유**:
- "이전 의도 + context 다 봤으니 이번 의도를 확률로 결정 — 정확한 한 값이 아닌, **그럴듯한 값들의 분포**".

**왜 stochastic?**: 미래는 deterministic 하지 않음. 같은 과거에서 여러 미래 가능 — paper 의 핵심 주장.

→ **Stochastic latent** 생성. Softplus 로 분산 positive 보장.

### Eq 9 — Update hidden (Carry Forward)

$$
w_t = \text{LayerNorm}(\hat{w}_t + \text{MLP}(z_t) + \text{Position}(t))
$$

**비유**: "결정된 의도를 hidden state 에 합쳐서 다음 시점에 carry forward."

**기호 뜻**:
- $\hat{w}_t$: 직전 step 의 attention output
- $\text{MLP}(z_t)$: sampled latent 를 hidden 차원으로 변환
- $\text{Position}(t)$: 현재 시점 도장
- 셋 합 + LayerNorm

**왜 이 형태**:
- $\hat w_t$ 유지 (residual connection) → gradient flow 보장.
- $z_t$ 정보 inject → stochastic 본질.
- Position 재추가 → 다음 step 에서 시점 정보 잃지 않음.

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

## 자기점검 (이 챕터)

### 핵심 4가지

1. **paper 가 stochastic $z_t$ 자체를 query 로 안 쓰고 hybrid $w_t$ 도입한 이유는?**
2. **Eq 6 (self-attn) → Eq 7 (cross-attn) → Eq 8 (sample) → Eq 9 (update) 의 4 단계를 한 단어씩으로 비유하면?**
3. **$w_0$ (초기 hidden) 가 "learnable, context-agnostic" 인 이유는?**
4. **Emission 이 $x_t = \text{MLP}(w_t)$ 로 매우 단순한 이유는?**

### 답변

1. **순수 stochastic latent 만 사용 시 정보 retention 어려움** (gradient 가 sampling 통과 시 noisy). $w_t$ 가 **deterministic component 포함한 hybrid** — attention query/key/value 안정성 + $z_t$ 의 정보 도 인코딩. paper 가 [17, 30, 39] 인용하여 명시.
2. **Look Back (Eq 6)** → **Look at Input (Eq 7)** → **Decide (Eq 8)** → **Carry Forward (Eq 9)**. 운전자가 "지금까지 결정 회상 → 현재 도로 확인 → 다음 행동 결정 → 그 결정 기억" 의 4 단계.
3. **Learnable**: 모델이 학습으로 좋은 initial state 찾을 수 있게. **Context-agnostic**: $w_0$ 가 모든 sample 에 동일 — context 정보는 Eq 7 의 cross-attention 으로 유입.
4. **Latent $w_t$ 가 모든 정보 담당** — emission 은 단순 decoder 역할만. Information leakage 회피 + computational efficiency. 복잡한 emission 은 latent 학습 부담 → simple MLP 가 최선.

---

## 다음

[07_single_layer_inference.md](07_single_layer_inference.md) 에서 inference model (training time only, Eq 10-11).
