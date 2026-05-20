# 04. Variational State-Space Models — Section 2.1 풀이

paper p.2-3 (Section 2.1) 의 수식 Eq 1-3 을 한국어로 풀어 쓴다.

이 챕터의 목표: **수식 한 줄 한 줄을 일상 언어로 다시 설명한다**. 처음 보는 기호는 모두 정의부터.

---

## 4.1 표기법 — 기호 사전 먼저

### 원문 (paper p.2)
> Let $\{x^{(i)}_{1:T_i}\}_{i=1}^N$ consist of $N$ univariate time series where $x^{(i)}_{1:T_i} = (x^{(i)}_1, x^{(i)}_2, \ldots, x^{(i)}_{T_i})$ and $x^{(i)}_t$ denotes the value of the $i$-th time series at time $t$.

### 풀어 설명 — 기호 하나씩

| 기호 | 의미 | 비유 |
|------|------|------|
| $N$ | 시계열 개수 | 도로 100개 → $N=100$ |
| $T_i$ | $i$ 번째 시계열의 길이 (시점 개수) | 도로 1의 측정 시점 24개 → $T_1=24$ |
| $x^{(i)}_t$ | $i$ 번째 시계열의 $t$ 시점 값 (한 개 숫자) | 도로 1의 09시 차량 수 = 100 |
| $x^{(i)}_{1:T_i}$ | $i$ 번째 시계열의 전체 sequence | 도로 1의 0시~23시 24개 값 묶음 |

**한 줄 요약**: "$N$ 개의 시계열이 있고, 각각의 시계열은 시간 1부터 $T_i$ 까지의 숫자들."

### Multivariate form (다변량 형식)

원문:
> $x_{1:T} = (x_1, x_2, \ldots, x_T)$ where $x_t = (x^{(1)}_t, \ldots, x^{(N)}_t) \in \mathbb{R}^N$.

**풀어 설명**:
- $x_t$ = 시점 $t$ 에서 **모든 시계열의 값을 동시에 묶은 벡터**.
- 차원은 $N$ — 시계열 개수.
- 비유: 시점 09시에 100개 도로의 차량 수를 한꺼번에 적은 100차원 벡터.

→ 이렇게 합치면 "다변량 시계열" 이 **벡터의 시간 sequence** 가 된다: $x_1, x_2, \ldots, x_T$.

---

## 4.2 Context vs Target — 입력과 출력의 구분

### 원문 (paper p.2)
> Conditioning on observed values up to time $C$, we aim to produce distributional forecasts into the future $p(x_{C+1:T} | x_{1:C})$. For clarity, we refer to $x_{1:C}$ and $x_{C+1:T}$ as contexts and targets, respectively.

### 풀어 설명

| 용어 | 기호 | 의미 |
|------|------|------|
| **Context (맥락)** | $x_{1:C}$ | 시점 1 부터 $C$ 까지의 관측값 — **입력** |
| **Target (목표)** | $x_{C+1:T}$ | 시점 $C+1$ 부터 $T$ 까지의 값 — **예측 대상** |

**비유**: 일기예보.
- Context: 지난 7일 (시점 1~7) 의 날씨 기록.
- Target: 앞으로 3일 (시점 8~10) 의 날씨.
- 모델의 일: $p(\text{target} | \text{context})$ — context 가 주어졌을 때 target 의 분포 예측.

**왜 분포를 예측하나**:
- Point forecast = "내일 25도" (한 값).
- Distributional forecast = "내일은 평균 25도, 표준편차 2도" (분포).
- 의사결정 (재고 결정, 위험 회피) 에는 분포가 훨씬 유용.

---

## 4.3 SSM Framework — 잠재 변수를 통한 분해 (Eq 1)

### 원문 (paper p.2)
> We are interested in probabilistic models parametrized by $\theta$ of the form

paper Eq 1:
$$
p_\theta(x_{1:T} | x_{1:C}) = \int p_\theta(x_{1:T} | z_{1:T}) p_\theta(z_{1:T} | x_{1:C}) dz_{1:T}
$$

### 풀어 설명 — 이 식이 의미하는 것

**전체 구조**: "context $x_{1:C}$ 가 주어졌을 때 전체 sequence $x_{1:T}$ 의 분포" 를 두 part 로 쪼갠다.

좌변 (목표): $p_\theta(x_{1:T} | x_{1:C})$
- = "context 주면 전체 sequence 의 분포가 어떻게 되나"
- 우리가 알고 싶은 것.

우변 (분해): integral 로 잠재 $z$ 를 끼워 넣음.

**두 part 의 의미**:
1. $p_\theta(z_{1:T} | x_{1:C})$ = **Transition model** — context 에서 잠재 sequence 생성. "context 보면 줄거리(잠재) 가 어떻게 흘러갈까?"
2. $p_\theta(x_{1:T} | z_{1:T})$ = **Emission model** — 잠재에서 관측 생성. "줄거리(잠재) 정해지면 관측은 어떻게 나올까?"

**$\int dz_{1:T}$ 의 역할**: 모든 가능한 잠재 sequence 에 대해 더해줌 (평균화). 잠재가 한 개로 고정되지 않고 분포니까.

**비유 (영화 만들기)**:
- $x_{1:T}$ = 영화의 모든 프레임 (보이는 것).
- $z_{1:T}$ = 영화의 줄거리 (안 보이지만 결정자).
- $x_{1:C}$ = 영화의 첫 30분 (이미 본 것).
- 식의 의미: "첫 30분 보고 → 가능한 모든 줄거리를 평균 → 가능한 모든 프레임의 분포".

**왜 잠재를 끼워 넣나**:
- 직접 $p(x_{1:T} | x_{1:C})$ 를 모델링하려면 너무 복잡 (고차원 + 장거리 + 비선형).
- 잠재 $z$ 를 끼우면 "context → $z$" + "$z$ → $x$" 두 단계로 쪼개져 다루기 쉬워짐.
- 또한 $z$ 가 저차원이면 (예: 16차원) 연산 효율.

---

## 4.4 두 가지 핵심 가정 (Eq 2)

### 원문 (paper p.3)
paper Eq 2:
$$
p_\theta(z_{1:T} | x_{1:C}) = \prod_{t=1}^{T} p_\theta(z_t | z_{1:t-1}, x_{1:C})
$$
$$
p_\theta(x_{1:T} | z_{1:T}) = \prod_{t=1}^{T} p_\theta(x_t | z_t)
$$

### 풀어 설명 — 두 가정을 따로 보자

#### 가정 1: Transition 의 분해 (첫째 식)

$$
p_\theta(z_{1:T} | x_{1:C}) = \prod_{t=1}^{T} p_\theta(z_t | z_{1:t-1}, x_{1:C})
$$

**무엇을 말하나**:
- "전체 잠재 sequence 의 분포" 를 "매 시점 잠재의 조건부 분포" 들의 곱으로 쪼갠다.
- 시점 $t$ 의 잠재 $z_t$ 는 다음 두 정보에 의존:
  - $z_{1:t-1}$ = 이전 시점들의 잠재 모두 (**non-Markovian** — 직전만이 아님)
  - $x_{1:C}$ = context (입력으로 받은 관측)

**LDS 와의 결정적 차이** (paper 강조):
> the latent variable $z_{t+1}$ depends not only on $z_t$ but also on all of its preceding latent variables, including $z_{t-1}$, in contrast to linear dynamical systems (LDSs).

- LDS: $z_t$ 가 $z_{t-1}$ 만 의존 (Markov).
- ProTran: $z_t$ 가 $z_1, z_2, \ldots, z_{t-1}$ **전체** 의존 (non-Markov).

→ **이게 ProTran 의 핵심 design choice**. Attention 이 이걸 가능하게 한다 (다음 챕터에서 자세히).

#### 가정 2: Emission 의 시점 독립 (둘째 식)

$$
p_\theta(x_{1:T} | z_{1:T}) = \prod_{t=1}^{T} p_\theta(x_t | z_t)
$$

**무엇을 말하나**:
- 관측 $x_t$ 는 **그 시점의 잠재 $z_t$ 만** 의존.
- 다른 시점의 $z$ 나 다른 시점의 $x$ 는 안 봄.

**비유**: 영화의 각 프레임은 "그 순간의 줄거리 상태" 만 반영. 이전 프레임이나 이전 줄거리는 영향 없음 (이미 $z_t$ 에 다 들어가 있으니).

---

## 4.5 왜 emission 이 이렇게 단순한가 — paper 의 정당화

### 원문 (paper p.3)
> However, neither $x_{1:t-1}$ nor $z_{1:t-1}$ are included in the emission model $p(x_t | z_{1:T}, x_{1:C})$. Such assumptions are important, as it has been argued previously that a leakage of information from the latent space in autoregressive models can hinder long-term predictions [23, 47]. While all ground truth observations are available during training, the entire sequence has to be generated sequentially at test time, making the dependencies on $x_{1:t-1}$ prone to accumulated errors over multiple time steps. By letting the latent variable $z_t$ capture all information needed to render $x_t$, we also avoid the computational costs associated with repeatedly decoding and encoding $x_t$ in multi-step predictions.

### 풀어 설명 — 3 가지 이유

| 이유 | 설명 |
|------|------|
| **① Information leakage 방지** | 잠재가 모든 정보 담당해야 함. emission 이 다른 잠재를 보면 "정보 새는" 효과 → 학습 약화 |
| **② Long-term prediction 안정** | Autoregressive (이전 $x$ 사용) 은 test time 에 자기 예측을 다시 입력 → 오류 누적 |
| **③ 계산 효율** | $x_t$ 마다 encode-decode 안 해도 됨. 잠재 공간에서만 작업 |

**비유 (이어쓰기)**:
- "이전 문장 보고 다음 문장 쓰기" (autoregressive) = 한 문장 틀리면 다 틀어짐.
- "줄거리 정해놓고 모든 문장 한꺼번에 쓰기" (latent-only) = 한 문장 실수해도 줄거리는 그대로.

→ ProTran 은 두 번째 방식을 선택. **잠재 $z$ 가 모든 무게를 진다**.

---

## 4.6 Variational Inference — 학습 방법 (Eq 3)

### 원문 (paper p.3)
> The inclusion of nonlinear state transitions and observation models necessarily requires approximate inference. We follow the stochastic variational inference framework [49, 74] and assume that the variational posterior parametrized by $\phi$ can be decomposed auto-regressively as $q_\phi(z_{1:T} | x_{1:T}) = \prod_t q_\phi(z_t | z_{1:t-1}, x_{1:T})$, which leads to a lower bound on the log likelihood:

paper Eq 3:
$$
\log p_\theta(x_{1:T} | x_{1:C}) \geq \sum_{t=1}^{T} \big(\mathbb{E}_q[\log p_\theta(x_t | z_t)] - D_{KL}(q_\phi(z_t | z_{1:t-1}, x_{1:T}) \| p_\theta(z_t | z_{1:t-1}, x_{1:C}))\big)
$$

### 왜 variational inference 가 필요한가

**문제**: 직접 $p_\theta(x_{1:T} | x_{1:C})$ 의 우도 (likelihood) 를 계산하려면 Eq 1 의 $\int dz_{1:T}$ 를 풀어야 함.
- Linear 라면 (LDS) 풀림 (Kalman filter).
- Nonlinear 면 (ProTran) **풀리지 않음** (intractable integral).

**해법**: variational inference — 풀 수 있는 lower bound (ELBO) 를 대신 maximize.

### Variational posterior 의 정의

$$
q_\phi(z_{1:T} | x_{1:T}) = \prod_{t=1}^{T} q_\phi(z_t | z_{1:t-1}, x_{1:T})
$$

**$q_\phi$ 가 뭐인가**:
- 진짜 posterior $p_\theta(z | x)$ 를 흉내내는 **근사 분포**.
- 파라미터 $\phi$ 로 parameterized 된 신경망.
- 학습 시에 **전체 sequence $x_{1:T}$** 를 사용 (target 포함 — 학습 시에는 정답이 있음).

**prior $p_\theta$ 와의 비대칭**:
- Prior $p_\theta(z_t | z_{1:t-1}, x_{1:C})$: **context $x_{1:C}$ 만** 사용 (test 시에 사용 가능한 것)
- Posterior $q_\phi(z_t | z_{1:t-1}, x_{1:T})$: **전체 $x_{1:T}$** 사용 (학습 시에만 가능한 것)

→ 학습 시 "정답 알고 추정한 $q$" 가 "정답 모르고 추정한 $p$" 의 spec 을 가르친다.

### ELBO (Evidence Lower BOund) 의 의미

수식을 해체하면:

| Term | 의미 | 역할 |
|------|------|------|
| $\mathbb{E}_q[\log p_\theta(x_t | z_t)]$ | Reconstruction loss | "$z$ 에서 $x$ 를 잘 복원하나" |
| $D_{KL}(q_\phi \| p_\theta)$ | KL divergence | "$q$ 와 $p$ 가 얼마나 비슷한가" |

**ELBO 의 학습 효과**:
1. **Reconstruction term** 을 키운다 → emission 이 정확해진다.
2. **KL term** 을 줄인다 → prior $p_\theta$ 가 posterior $q_\phi$ 를 닮아간다 → test 시 prior 만 써도 잘 작동.

**비유 (선생-학생)**:
- $q_\phi$ = 정답지 보고 푼 학생 (정답 안다)
- $p_\theta$ = 정답지 없이 푼 학생 (시험 봐야 함)
- KL term: "정답 안 본 학생도 정답 본 학생만큼 풀도록 학습"
- Test 시: 정답 없이 (= prior 만으로) 추정.

---

## 4.7 Laplace 분포 + L1 loss — 실용적 선택

### 원문 (paper p.3)
> For computational stability, we assume homoscedasticity and choose Laplace distribution with scale parameter $\beta$ as a parametric form for $p_\theta(x_t | z_t)$, i.e. we optimize for L1 reconstruction loss with a cross-validated factor $\beta$ for the KL term, following similar variational autoencoder (VAE) work [24, 41, 86].

### 풀어 설명

**Implementation choice** (이건 architecture 가 아니라 학습 디테일):
- $p_\theta(x_t | z_t)$ 의 분포 형태 = **Laplace 분포** (Gaussian 의 사촌 — 꼬리가 두꺼움).
- Reconstruction loss = **L1** (= Laplace 의 음의 로그 우도).
- KL term 에 **$\beta$ 가중치** 추가 (β-VAE 형식, Higgins 2016).
- $\beta$ 는 cross-validation 으로 튜닝.

**왜 Laplace + L1 인가**:
1. Computational stability (Gaussian + L2 보다 안정).
2. L1 이 outlier 에 robust (큰 오차에 둔감).
3. β-VAE 패러다임 따름 (생성 품질과 latent 표현력의 trade-off 조절).

**Laplace 가정의 의미**:
> Such an assumption does not necessarily limit the capacity of our models, as powerful stochastic transitions and flexible emission models can theoretically characterize arbitrary noise covariance [66].

→ "Laplace 가정 자체는 제약이지만, 잠재 $z$ 가 충분히 강력하면 어떤 noise 패턴도 표현 가능" — 이론적 정당화.

---

## 4.8 ASCII 로 본 전체 흐름

```
                  Context x_{1:C}
                       │
                       ↓ (encode somehow)
                       │
   ┌──────────────── Latent dynamics ─────────────┐
   │                                              │
   │   z_1 ←→ z_2 ←→ z_3 ←→ ... ←→ z_T          │
   │   (서로 attention 으로 연결, non-Markov)     │
   │                                              │
   │   Eq 2 첫 식: p(z_t | z_{1:t-1}, x_{1:C})  │
   └──────────────────────────────────────────────┘
                       │
                       ↓ (each z_t → x_t independently)
                       │
   x_1   x_2   x_3   ...   x_T   ← Eq 2 둘째 식: p(x_t | z_t)
   
   학습 시 추가:
   ┌────────────────────────────────────────────┐
   │ q_φ(z_t | z_{1:t-1}, x_{1:T})              │
   │   ← 전체 x 사용 (target 포함)              │
   │                                            │
   │ ELBO: log p(x|context) ≥                   │
   │   E_q[log p(x|z)] - KL(q || p)             │
   └────────────────────────────────────────────┘
```

---

## 4.9 LDS 와의 line-by-line 비교

ProTran 의 Eq 1-3 가 LDS 와 어떻게 다른지 직접 대조:

### Eq 1 (general SSM) 의 LDS instance

**LDS 의 Eq 1 instance**:
$$
p_\theta(x_{1:T} | x_{1:C}) = \int \prod_t \mathcal{N}(x_t | Cz_t, R) \prod_t \mathcal{N}(z_t | Az_{t-1}, Q) dz_{1:T}
$$
- Emission: $\mathcal{N}(Cz_t, R)$ — linear + Gaussian noise.
- Transition: $\mathcal{N}(Az_{t-1}, Q)$ — linear + Markov.

**ProTran 의 Eq 1**:
- Emission: $p_\theta(x_t | z_t)$ — Laplace, parametrized by neural net.
- Transition: $p_\theta(z_t | z_{1:t-1}, x_{1:C})$ — Gaussian, parametrized by attention.

→ **차이**: Linear → neural, Markov → non-Markov.

### Eq 2 (decomposition) 의 LDS instance

**LDS**:
- $z_t = Az_{t-1} + w_t$ — 직전만 의존.
- $x_t = Cz_t + v_t$ — 그 시점만 의존.

**ProTran**:
- $z_t = f_\theta(z_{1:t-1}, x_{1:C}) + \text{stochasticity}$ — **전체 과거** 의존.
- $x_t = g_\theta(z_t) + \text{stochasticity}$ — 같음 (시점 독립).

→ **차이**: Transition 의 dependency 가 폭발적으로 늘어남.

### Eq 3 (ELBO) 의 LDS instance

**LDS 의 exact inference** (Kalman filter):
- 미분 불가능한 적분이 closed-form (Gaussian × Gaussian = Gaussian).
- ELBO 없이 정확한 likelihood 계산.

**ProTran 의 variational inference** (Eq 3):
- Non-Gaussian × non-Gaussian = intractable 적분.
- ELBO lower bound 로 우회.
- $q_\phi$ 로 posterior 근사.

→ **차이**: Exact 추론 → variational 추론 — 비선형의 대가.

### 한 줄로

LDS 는 **선형성 + Markov + Gaussian** 의 우아한 closed-form 세계.
ProTran 은 **비선형 + non-Markov + general 분포** 의 풍부하지만 변분 추론 필요한 세계.

---

## 4.10 ELBO 의 진정한 의미 — 더 깊이

### 왜 ELBO 가 "Lower Bound" 인가

증명 sketch (Jensen's inequality):

$$
\log p_\theta(x) = \log \int p_\theta(x, z) dz = \log \int q_\phi(z) \frac{p_\theta(x, z)}{q_\phi(z)} dz
$$

Jensen's inequality (concavity of $\log$):
$$
\geq \int q_\phi(z) \log \frac{p_\theta(x, z)}{q_\phi(z)} dz = \mathbb{E}_q[\log p_\theta(x, z)] - \mathbb{E}_q[\log q_\phi(z)]
$$

이를 reconstruction + KL 로 정리:
$$
= \mathbb{E}_q[\log p_\theta(x|z)] - \text{KL}(q_\phi(z) \| p_\theta(z))
$$

→ **ELBO**.

**핵심 인사이트**:
- $q_\phi = p_\theta(z|x)$ (true posterior) 이면 ELBO = $\log p_\theta(x)$ (정확한 likelihood).
- 그러나 true posterior 는 intractable — $q_\phi$ 가 근사.
- ELBO 를 maximize = (a) likelihood maximize + (b) $q$ 가 true posterior 와 가깝게.

### 학습 동학 — gradient 흐름

**Reconstruction term** $\mathbb{E}_q[\log p(x|z)]$:
- $\theta$ 에 대한 gradient: emission network 학습.
- $\phi$ 에 대한 gradient: posterior network 가 "재구성 잘 되는 잠재 산출" 하도록.

**KL term** $-\text{KL}(q_\phi \| p_\theta)$:
- $\theta$ 에 대한 gradient: prior 가 posterior 따라가도록.
- $\phi$ 에 대한 gradient: posterior 가 prior 와 너무 멀지 않도록 (regularization).

→ 두 항이 동시에 학습 — 균형이 핵심 (β-VAE 의 정신).

### Reparameterization trick — 왜 필요한가

문제: $\mathbb{E}_q[\cdot]$ 의 Monte Carlo 추정 시 $z \sim q$ 가 random — gradient 흐름 끊김.

해법: $z = \mu_\phi + \sigma_\phi \cdot \epsilon$, $\epsilon \sim \mathcal{N}(0, I)$.
- Random 부분 ($\epsilon$) 이 분리됨.
- $\mu_\phi, \sigma_\phi$ 에 대한 gradient 계산 가능.

**ProTran 의 Eq 8, 11 의 `Sample`** = 이 reparameterization.

---

## 4.11 자기점검 (이 챕터)

### 핵심 5가지
1. **Eq 1 의 integral $\int dz$ 가 의미하는 것은?**
2. **Prior $p_\theta$ 와 Posterior $q_\phi$ 가 사용하는 정보의 차이는?**
3. **왜 ProTran 의 emission $p(x_t | z_t)$ 는 $z_t$ 만 의존하나?**
4. **LDS 의 Kalman filter 와 ProTran 의 variational inference 의 근본적 차이는?**
5. **Reparameterization trick 이 왜 필요한가?**

### 답변
1. "잠재 sequence 의 모든 가능한 값에 대해 평균" 의 의미. 잠재가 분포라서 한 개로 고정되지 않으므로, 가능한 모든 잠재에 대해 합산. 이것이 SSM 의 "latent variable 을 통한 marginalization" 의 핵심.
2. Prior = context $x_{1:C}$ 만 (test 시 사용 가능). Posterior = 전체 $x_{1:T}$ 사용 (target 포함, 학습 시에만). 학습 시 posterior 가 prior 를 가르치고, test 시 prior 만 작동.
3. (a) Information leakage 방지 — 잠재가 모든 정보 담당, (b) Long-term prediction 안정 — autoregressive 오류 누적 회피, (c) 계산 효율 — 매 시점 encode-decode 안 함. 이 세 이유로 emission 을 단순화.
4. LDS = linear + Gaussian → 적분이 closed-form (Gaussian × Gaussian = Gaussian) → Kalman filter 로 exact inference. ProTran = nonlinear + general 분포 → 적분 intractable → ELBO 의 lower bound 로 우회 (variational inference). Exact 추론의 우아함을 포기하고 표현력 얻음.
5. 적분 $\mathbb{E}_q[\cdot]$ 의 Monte Carlo 추정 시 $z \sim q$ 의 sampling 은 random — gradient 흐름 끊김. $z = \mu + \sigma \epsilon$ 으로 random 부분 ($\epsilon$) 을 분리하면 $\mu, \sigma$ 에 대한 gradient 계산 가능. 모든 VAE 의 표준 trick.

다음 [05_preliminaries_transformer.md](05_preliminaries_transformer.md) 에서 Transformer attention 의 수식 (Eq 4) 을 풀어본다.
