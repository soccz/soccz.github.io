# 01 시작하기 전에 — 미리 알아둘 7개 개념

ProTran 은 SSM + Transformer 의 결합. 다음 7개를 머릿속에 채워두면 paper 의 모든 한 줄이 자기 자리에 들어간다.

---

## 1. State-Space Model (SSM)

**기본 형식**:
- **Latent state** $z_t$: 관측되지 않은 시스템의 "진짜" 상태
- **Observation** $x_t$: 우리가 보는 측정값 (noise 포함)
- **Transition model** $p(z_t | z_{t-1})$: latent 사이의 dynamics
- **Emission model** $p(x_t | z_t)$: latent → observable

**핵심 가정** (Markovian SSM):
- $z_t$ 는 $z_{t-1}$ 만 의존 (그 이전은 잊음).

paper Eq 1-2 가 이 framework 의 일반화 형식. ProTran 은 **non-Markovian SSM** — $z_t$ 가 $z_{1:t-1}$ 전체 의존.

---

## 2. Linear Dynamical System (LDS)

가장 잘 알려진 SSM. 모든 transition + emission 이 **linear**:

$$
z_t = A z_{t-1} + w_t, \quad x_t = C z_t + v_t
$$

- $A$ = transition matrix
- $C$ = emission matrix
- $w_t, v_t$ = Gaussian noise

**장점**: Kalman filter 로 **exact inference**.

**한계**:
- Markovian (한 step 만 의존)
- Linear (real-world 의 nonlinearity 불가능)

→ ProTran 은 두 한계 모두 극복.

---

## 3. Kalman Filter

LDS 의 정확한 inference 알고리즘 (Rudolf Kalman 1960).

**Filtering**: $p(z_t | x_{1:t})$ — 현재 시점까지의 observation 으로 latent 추정.

**Smoothing**: $p(z_t | x_{1:T})$ — 모든 observation (과거 + 미래) 활용.

→ ProTran 의 inference 가 **smoothing 방식**: paper Eq 10 의 `Attention(h_{1:T}, h_{1:T}, h_{1:T})` 가 과거 + 미래 모두 봄. Filtering only RNN 보다 우수.

---

## 4. Variational AutoEncoder (VAE)

**기본 AutoEncoder**: encoder $\phi$ 가 $x \to z$, decoder $\theta$ 가 $z \to x$.

**VAE 의 차이**:
- $z$ 가 **확률 분포**.
- Loss = reconstruction + **KL divergence** (variational posterior $q_\phi$ vs prior $p$).

ProTran 은 sequential VAE — 각 시점 $z_t$ 가 latent variable.

---

## 5. ELBO (Evidence Lower BOund)

VAE 학습 objective:

$$
\log p_\theta(x) \geq \mathbb{E}_{q_\phi}[\log p_\theta(x | z)] - D_{KL}(q_\phi(z|x) \| p(z))
$$

- 첫 항: reconstruction
- 둘째 항: KL — regularization

paper Eq 3 가 ProTran 의 ELBO. 시간 축 합 형식:

$$
\sum_{t=1}^{T} \big(\mathbb{E}_q[\log p_\theta(x_t|z_t)] - D_{KL}(q_\phi(z_t|z_{1:t-1}, x_{1:T}) \| p_\theta(z_t|z_{1:t-1}, x_{1:C}))\big)
$$

---

## 6. Transformer Attention

**Self-attention**:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d}}\right) V
$$

**Multi-head**: 여러 attention head 의 concat.

paper Eq 4 가 standard Transformer attention 형식.

ProTran 의 차별점:
- Attention 을 **latent space** $z_{1:T}$ 에 적용 (observation $x$ 가 아님).
- 표준 Transformer 는 observation 에 attention → autoregressive 학습.
- ProTran 은 latent 에 attention → non-autoregressive 생성 가능.

---

## 7. CRPS (Continuous Ranked Probability Score)

확률 forecasting 의 표준 metric.

paper Section 5.1:
$$
\text{CRPS}(F, x) = \int_{\mathbb{R}} (F(z) - \mathbb{1}_{\{x \leq z\}})^2 dz
$$

- $F$ = predicted CDF
- $x$ = observed value

**의미**: 예측 distribution 의 CDF 와 actual observation 의 step function 사이의 squared distance.

**CRPS_sum**: multivariate 시계열에서 시간 축에 합산. paper Table 1 의 평가 metric.

**Lower = better**.

---

## Wrap-up

| 개념 | ProTran 에서의 역할 |
|------|---------------------|
| SSM | 본 paper 의 framework. latent z + observation x. |
| LDS | baseline (paper Figure 1a). Markovian + linear 한계. |
| Kalman filter / smoothing | inference 방식 — ProTran 은 smoothing 처럼 작동 |
| VAE | latent variable 학습 위한 tool |
| ELBO | 학습 objective (Eq 3, 14-15) |
| Transformer attention | latent 사이의 의존성 모델링 (Eq 6-7, 16-18) |
| CRPS_sum | 시계열 forecasting 평가 metric (Table 1) |

이제 [02_abstract.md](02_abstract.md) 로.
