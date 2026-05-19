# 04 Preliminaries — Variational State-Space Models (Section 2.1)

paper p.2-3. SSM 의 수학적 정의 + ELBO.

## 표기법

paper p.2:
> Let $\{x^{(i)}_{1:T_i}\}_{i=1}^N$ consist of $N$ univariate time series where $x^{(i)}_{1:T_i} = (x^{(i)}_1, x^{(i)}_2, \ldots, x^{(i)}_{T_i})$ and $x^{(i)}_t$ denotes the value of the $i$-th time series at time $t$.

- $N$: 시계열 개수
- $T_i$: $i$-th 시계열의 길이
- $x^{(i)}_t$: $i$-th 시계열의 시점 $t$ 값

**Multivariate form**:
> $x_{1:T} = (x_1, x_2, \ldots, x_T)$ where $x_t = (x^{(1)}_t, \ldots, x^{(N)}_t) \in \mathbb{R}^N$.

→ 모든 시계열을 vector form 으로 쌓아 $x_t \in \mathbb{R}^N$.

---

## Context vs Target

paper:
> Conditioning on observed values up to time $C$, we aim to produce distributional forecasts into the future $p(x_{C+1:T} | x_{1:C})$. For clarity, we refer to $x_{1:C}$ and $x_{C+1:T}$ as contexts and targets, respectively.

- **Context** $x_{1:C}$: 시점 1~$C$ 의 관측값 (입력)
- **Target** $x_{C+1:T}$: 시점 $C+1$~$T$ 의 예측 대상 (출력)

→ 이 둘이 ProTran 의 핵심 구분.

---

## SSM Framework (Eq 1)

paper p.2 (Section 2.1):
> We are interested in probabilistic models parametrized by $\theta$ of the form

paper Eq 1:
$$
p_\theta(x_{1:T} | x_{1:C}) = \int p_\theta(x_{1:T} | z_{1:T}) p_\theta(z_{1:T} | x_{1:C}) dz_{1:T}
$$

**해석**:
- 출력 $p(x_{1:T} | x_{1:C})$ = context 가 주어졌을 때 전체 시퀀스의 분포.
- Integral 분해: latent $z_{1:T}$ 를 도입하여 두 part 로 분리.
  - **Transition model** $p_\theta(z_{1:T} | x_{1:C})$: context 에서 latent 시퀀스 생성.
  - **Emission model** $p_\theta(x_{1:T} | z_{1:T})$: latent 에서 observation.

→ 표준 SSM 의 latent variable 형식.

---

## 두 가지 핵심 가정 (Eq 2)

paper Eq 2:
$$
p_\theta(z_{1:T} | x_{1:C}) = \prod_{t=1}^{T} p_\theta(z_t | z_{1:t-1}, x_{1:C})
$$
$$
p_\theta(x_{1:T} | z_{1:T}) = \prod_{t=1}^{T} p_\theta(x_t | z_t)
$$

**가정 1**: Latent transition 이 auto-regressive 로 분해 — $z_t$ 가 $z_{1:t-1}$ + $x_{1:C}$ 의존.

**가정 2**: Emission 이 시점별 독립 — $x_t$ 가 $z_t$ 만 의존 (다른 시점 또는 다른 observations 영향 없음).

**핵심 차이점 (paper p.3)**:
> the latent variable $z_{t+1}$ depends not only on $z_t$ but also on all of its preceding latent variables, including $z_{t-1}$, in contrast to linear dynamical systems (LDSs).

→ **Non-Markovian dynamics**: $z_t$ 가 $z_{t-1}$ 뿐 아닌 **모든 이전 latent** 의존.

---

## 왜 emission model 이 단순한가 (paper의 정당화)

paper p.3:
> However, neither $x_{1:t-1}$ nor $z_{1:t-1}$ are included in the emission model $p(x_t | z_{1:T}, x_{1:C})$. Such assumptions are important, as it has been argued previously that a leakage of information from the latent space in autoregressive models can hinder long-term predictions [23, 47]. While all ground truth observations are available during training, the entire sequence has to be generated sequentially at test time, making the dependencies on $x_{1:t-1}$ prone to accumulated errors over multiple time steps.

3 reasons for "$x_t$ depends only on $z_t$":
1. **Information leakage avoidance**: latent 가 모든 정보 담당, observation 의존 X.
2. **Long-term prediction**: autoregressive (이전 observation 사용) 은 error 누적.
3. **Computational efficiency**: encode-decode 반복 안 함.

→ **Latent z 가 모든 정보를 capture** 하도록 강제하는 design.

---

## Variational Inference (Eq 3)

paper p.3:
> The inclusion of nonlinear state transitions and observation models necessarily requires approximate inference. We follow the stochastic variational inference framework [49, 74] and assume that the variational posterior parametrized by $\phi$ can be decomposed auto-regressively as $q_\phi(z_{1:T} | x_{1:T}) = \prod_t q_\phi(z_t | z_{1:t-1}, x_{1:T})$, which leads to a lower bound on the log likelihood:

**Variational posterior**:
$$
q_\phi(z_{1:T} | x_{1:T}) = \prod_{t=1}^{T} q_\phi(z_t | z_{1:t-1}, x_{1:T})
$$

**ELBO** (paper Eq 3):
$$
\log p_\theta(x_{1:T} | x_{1:C}) \geq \sum_{t=1}^{T} \big(\mathbb{E}_q[\log p_\theta(x_t | z_t)] - D_{KL}(q_\phi(z_t | z_{1:t-1}, x_{1:T}) \| p_\theta(z_t | z_{1:t-1}, x_{1:C}))\big)
$$

**Term 별 의미**:
| Term | 의미 |
|------|------|
| $\mathbb{E}_q[\log p_\theta(x_t | z_t)]$ | Reconstruction — emission model 의 likelihood |
| $D_{KL}(q_\phi(z_t | z_{1:t-1}, x_{1:T}) \| p_\theta(z_t | z_{1:t-1}, x_{1:C}))$ | KL — variational posterior 와 prior 사이 |

**중요한 비대칭**:
- Prior $p_\theta$: context $x_{1:C}$ 만 사용 (test time 에 사용 가능한 것)
- Posterior $q_\phi$: 전체 sequence $x_{1:T}$ 사용 (training time 에만 가능)

→ Posterior 가 ground truth 활용해 더 좋은 latent 추정, prior 가 그것을 흉내내도록 KL 최소화.

---

## Laplace 분포 + L1 loss (paper의 implementation choice)

paper p.3:
> For computational stability, we assume homoscedasticity and choose Laplace distribution with scale parameter $\beta$ as a parametric form for $p_\theta(x_t | z_t)$, i.e. we optimize for L1 reconstruction loss with a cross-validated factor $\beta$ for the KL term, following similar variational autoencoder (VAE) work [24, 41, 86].

**Practical choice**:
- Emission $p_\theta(x_t | z_t)$ = Laplace distribution.
- Reconstruction loss = **L1** (Laplace 의 negative log-likelihood).
- KL term 에 $\beta$ weighting (β-VAE 형식).
- $\beta$ 는 cross-validation 으로 tuning.

**이유**:
- Computational stability
- L1 이 outlier 에 robust
- β-VAE [Higgins 2016] 의 영향

---

## 인터랙티브 시각화 — Fig 1 graphical models

```viz:pt-graphical-models:title=Fig 1 (a)(b)(c)(d) — LDS vs ProTran graphical model (interactive),caption=Paper Fig 1 의 4 panel 모두 토글. (a) LDS — Markovian z_t depends only on z_{t-1}. (b) ProTran 1-layer — non-Markovian via attention. (c) 3-layer Generation — black arrows top-down emission. (d) 3-layer Inference — red arrows observations → latents (smoothing). Generation 과 Inference 의 분리는 paper Fig 1 caption 의 'separation for readability' 와 일치.
```

## SSM framework 의 일반화 정도

paper p.3 의 한 줄:
> Such an assumption does not necessarily limit the capacity of our models, as powerful stochastic transitions and flexible emission models can theoretically characterize arbitrary noise covariance [66].

→ Laplace 가정 + 단순 emission 이 **수학적 generality 제약은 아님**. Stochastic latent 가 충분히 복잡하면 어떤 noise covariance 도 표현 가능.

다음 [05_preliminaries_transformer.md](05_preliminaries_transformer.md) 에서 Transformer attention preliminaries.
