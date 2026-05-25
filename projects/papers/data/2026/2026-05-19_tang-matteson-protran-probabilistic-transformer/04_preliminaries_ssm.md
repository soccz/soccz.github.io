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

### 수식 4줄 풀이

**기호 뜻**:
- $p_\theta(x_{1:T} | x_{1:C})$: 우리가 정말 알고 싶은 것 — "context 를 보고 미래 포함 전체 sequence 의 분포"
- $\theta$: generative model 의 학습 파라미터들
- $z_{1:T}$: latent variable sequence (운전자 의도 시리즈)
- $\int ... dz_{1:T}$: 모든 가능한 latent 에 대해 적분 (marginalize out)
- 적분 안: **emission × transition** 의 곱

**일상 비유**:
- "관객 (우리) 이 보는 운전자의 손동작 시퀀스" = $x_{1:T}$
- "운전자의 의도 시퀀스" = $z_{1:T}$ (관객은 모름)
- 식이 말하는 것: "**가능한 모든 의도 시나리오 × 그 의도가 그런 손동작 만들 확률** 의 합 = 손동작 시퀀스 확률"

**왜 이 형태인가**:
- 직접 $p(x_{1:T})$ 모델링 어려움 — $x$ 가 고차원, 변수 많음.
- **Latent 도입** 으로 "보이지 않는 진짜 구조" 학습 → 단순한 emission 으로 충분.
- 표준 SSM 의 60년된 framework.

**조심할 점**:
- 적분 $\int dz_{1:T}$ 는 일반적으로 **계산 불가능** (intractable) → variational inference 필요 (Eq 3).
- 두 part 의 곱이 자연스럽게 분해되는 건 다음 가정 (Eq 2) 덕분.

### 두 part 의 의미

- **Transition model** $p_\theta(z_{1:T} | x_{1:C})$: context 에서 latent 시퀀스 생성 — "context 를 보고 의도 시퀀스를 어떻게 그려낼까"
- **Emission model** $p_\theta(x_{1:T} | z_{1:T})$: latent 에서 observation — "의도가 손동작으로 어떻게 변환되나"

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

### ELBO 수식 4줄 풀이

**기호 뜻**:
- 좌변 $\log p_\theta(x_{1:T} | x_{1:C})$: 정말 알고 싶은 것 (계산 불가능한 진짜 log likelihood)
- 우변: 그 lower bound — 우리가 실제로 maximize 할 수 있는 것
- $\sum_t$: 시간 축 합 — sequence 모든 시점의 contribution
- $\mathbb{E}_q$: posterior $q_\phi$ 에서 sample 한 $z_t$ 에 대한 평균
- $\log p_\theta(x_t | z_t)$: emission likelihood — "이 latent 에서 이 observation 얼마나 그럴듯한가"
- $D_{KL}(q \| p)$: posterior 와 prior 의 KL distance

**일상 비유**:
- 학생이 시험 문제 푸는 것에 비유:
  - **Reconstruction**: "내가 찍은 답이 정답과 얼마나 가까운가" (좋을수록 ↑)
  - **KL term**: "내 풀이가 정해진 풀이법에서 얼마나 벗어났나" (벗어날수록 페널티 ↑)
- 두 가지 균형 — "정답 맞추기 + 정해진 풀이법 따르기".

**왜 이 형태인가**:
- 진짜 $\log p(x)$ 직접 계산 불가능 (적분 intractable).
- **Jensen 부등식** 으로 lower bound 만듦 → sampling 으로 계산 가능.
- ELBO 최대화 ↔ 진짜 likelihood 최대화 + posterior $q_\phi$ 가 진짜 posterior 에 가까워지기.

**조심할 점**:
- **KL 너무 크면**: posterior $q_\phi$ 가 prior 와 같아져 latent 정보 못 담음 ("posterior collapse").
- **KL 너무 작으면**: 그냥 deterministic AE 와 같아짐 — generative 불가능.
- $\beta$-VAE 처럼 KL 가중치 조절 필요 (paper p.3 에서 cross-validated $\beta$).

### KL divergence 자세히

**KL divergence** $D_{KL}(q \| p)$:
$$
D_{KL}(q \| p) = \int q(z) \log \frac{q(z)}{p(z)} dz
$$

**일상 비유**:
- 두 사람이 같은 사건에 다른 확률 부여할 때 그 "차이의 정도".
- 예: 일기예보 A 가 비 확률 70%, B 가 비 확률 30% → 두 예보 분포의 KL 거리 큼.
- 같은 분포 ($q = p$) → KL = 0. 매우 다른 분포 → KL 큼.

**주의**:
- **비대칭**: $D_{KL}(q \| p) \neq D_{KL}(p \| q)$ — 진짜 "거리" 가 아님.
- $D_{KL}(q \| p)$ 에서 $q$ 가 0 인데 $p$ 가 0 아닌 곳은 KL 무한대 — $q$ 가 "모든 곳에서 가능성 인정" 해야.

### Prior vs Posterior 의 비대칭

**중요한 비대칭**:
- Prior $p_\theta$: context $x_{1:C}$ 만 사용 (test time 에 사용 가능한 것)
- Posterior $q_\phi$: 전체 sequence $x_{1:T}$ 사용 (training time 에만 가능)

**왜 비대칭?**:
- 학습 시: ground truth 미래까지 있음 → posterior 가 prior 보다 정확.
- KL term 이 prior 를 posterior 흉내내도록 학습.
- 결과: prior 가 점점 정확해져서 test time 에 좋은 generation.

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

---

## 자기점검 (이 챕터)

### 핵심 4가지

1. **Eq 1 의 적분 $\int dz_{1:T}$ 가 직접 계산 불가능한 이유와, 그 대안은?**
2. **ELBO 의 두 term (reconstruction + KL) 이 학생 비유에서 각각 무엇에 해당?**
3. **paper 의 emission $p(x_t | z_t)$ 가 $z_t$ 만 의존 (다른 시점 $z$ 나 observation $x$ 무의존) 인 3가지 이유는?**
4. **Posterior $q_\phi(z_t | z_{1:t-1}, x_{1:T})$ 의 $x_{1:T}$ vs prior $p_\theta(z_t | z_{1:t-1}, x_{1:C})$ 의 $x_{1:C}$ — 이 비대칭의 의도는?**

### 답변

1. **이유**: 고차원 latent space 의 적분, 표준 quadrature 불가. **대안**: variational inference — 학습 가능한 $q_\phi$ 로 진짜 posterior 근사 → Jensen 부등식으로 ELBO (lower bound) 만들고 최대화 → sampling 으로 계산 가능.
2. **Reconstruction**: 내가 찍은 답이 정답과 얼마나 가까운가 (높을수록 ↑). **KL**: 내 풀이가 정해진 풀이법 (prior) 에서 얼마나 벗어났나 (벗어날수록 페널티 ↑). 두 가지 균형이 학습 목표.
3. (a) **Information leakage 회피**: latent 가 모든 정보 담당 강제. (b) **Long-term prediction error 누적 방지**: autoregressive $x_{1:t-1}$ 사용은 test time 누적 error. (c) **Computational efficiency**: encode-decode 반복 안 함.
4. **Training-test asymmetry**: training 시에는 ground truth 미래 있음 → posterior 가 그것 활용해 더 정확한 latent 추정. KL term 이 prior 를 posterior 흉내내도록 학습 → test time 에 prior 만으로도 좋은 generation.

다음 [05_preliminaries_transformer.md](05_preliminaries_transformer.md) 에서 Transformer attention preliminaries.
