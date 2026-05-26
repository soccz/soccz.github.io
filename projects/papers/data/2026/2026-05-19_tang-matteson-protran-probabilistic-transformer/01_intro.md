# 01 시작하기 전에 — 미리 알아둘 7개 개념

> **🧒 한 줄 요약**: Paper intro. Probabilistic Transformer with hierarchical SSM.


ProTran 은 SSM + Transformer 의 결합. 다음 7개를 머릿속에 채워두면 paper 의 모든 한 줄이 자기 자리에 들어간다.

각 개념은 **친근한 비유 → 정확한 정의 → ProTran 에서의 역할** 순서로 풀어 설명한다.

---

## 1. State-Space Model (SSM)

### 친근한 비유 먼저

**운전자의 마음** 을 추측한다고 상상해보자. 우리는 운전자의 **손동작 (핸들·기어·브레이크)** 만 볼 수 있고, 그가 무엇을 **의도** 하는지 (방향 전환? 추월? 신호 대기?) 는 직접 볼 수 없다.
- 보이는 것 = **observation** $x_t$ (손동작)
- 보이지 않는 진짜 상태 = **latent state** $z_t$ (의도)

SSM 은 이 "보이지 않는 진짜를 보이는 것으로부터 추측" 하는 framework.

### 정확한 정의

- **Latent state** $z_t$: 관측되지 않은 시스템의 "진짜" 상태
- **Observation** $x_t$: 우리가 보는 측정값 (noise 포함)
- **Transition model** $p(z_t | z_{t-1})$: latent 사이의 dynamics — "의도가 한 순간에서 다음 순간으로 어떻게 변하는가"
- **Emission model** $p(x_t | z_t)$: latent → observable — "의도가 어떤 손동작으로 나타나는가"

### Markovian 가정의 의미

**Markovian SSM**: $z_t$ 는 $z_{t-1}$ 만 의존 (그 이전은 **잊음**).
- 비유: "운전자가 0.1초 전 의도만 기억하고, 1초 전 의도는 잊는다."
- 이게 단순화에는 좋지만 **장거리 의도 추적**에는 부족.

### ProTran 에서의 역할

paper Eq 1-2 가 이 framework 의 일반화 형식. ProTran 은 **non-Markovian SSM** — $z_t$ 가 $z_{1:t-1}$ **전체** 의존 (attention 으로 가능).
- 즉 "운전자가 1초 전, 10초 전, 1분 전 의도 모두 동시 참고."

---

## 2. Linear Dynamical System (LDS)

### 친근한 비유 먼저

**가장 단순한 운전자** — 매 순간 같은 규칙만 따르는 사람. "지난 0.1초 속도 × 0.99 + 약간의 잡음 = 지금 속도" 처럼 모든 변화가 **곱셈 + 덧셈** (선형).

### 정확한 정의

가장 잘 알려진 SSM. 모든 transition + emission 이 **linear**:

$$
z_t = A z_{t-1} + w_t, \quad x_t = C z_t + v_t
$$

**기호 뜻**:
- $A$ = transition matrix — "이전 상태 → 다음 상태" 변환 (예: 속도 × 0.99)
- $C$ = emission matrix — "내부 상태 → 외부 관측" 변환 (예: 속도 → 속도계 표시)
- $w_t, v_t$ = Gaussian noise — "예상치 못한 흔들림"

**일상 비유**:
- $A z_{t-1}$ = "관성으로 이어지는 상태"
- $w_t$ = "도로 요철 같은 무작위 흔들림"
- $C z_t$ = "센서가 진짜 상태를 어떻게 보여주는가"
- $v_t$ = "센서 자체의 잡음"

**왜 이 형태인가**:
- 선형 + Gaussian 이면 **Kalman filter** 로 **정확한 inference** 가능 (1960년대부터 검증).
- 비선형이면 EKF/UKF 같은 근사 알고리즘 필요.

**조심할 점**:
- 진짜 세상은 비선형 (속도가 마음대로 변함, 운전자가 일관성 없이 행동).
- Markovian (한 step 만 의존) → 장기 의존성 못 잡음.

### ProTran 에서의 역할

ProTran 은 LDS 의 두 한계 (Markovian + linear) 모두 극복. paper Figure 1(a) 가 LDS, Figure 1(b)-(d) 가 ProTran — 직접 비교.

---

## 3. Kalman Filter

### 친근한 비유 먼저

**GPS + 자이로 센서 결합** — GPS 는 정확하지만 0.5초마다 한 번, 자이로는 빠르지만 누적 오차. 둘을 결합하면 **두 정보의 신뢰도에 맞게 가중 평균** 해서 진짜 위치를 추정. 이게 Kalman filter 의 정신.

핵심 아이디어: **"추측 (모델 예측) + 측정 (실제 관측) = 더 정확한 추정"**.

### 정확한 정의

LDS 의 정확한 inference 알고리즘 (Rudolf Kalman 1960).

**두 가지 모드**:

**Filtering**: $p(z_t | x_{1:t})$ — 현재 시점까지의 observation 으로 latent 추정.
- 비유: "지금까지 본 손동작만으로 운전자의 현재 의도 추측."
- 실시간 (online) 처리 가능.

**Smoothing**: $p(z_t | x_{1:T})$ — 모든 observation (과거 + **미래**) 활용.
- 비유: "운전이 다 끝나고 나서 영상을 다시 돌려보며 매 순간의 의도를 정확히 재구성."
- Offline (사후 분석) 만 가능 — 진행 중 미래는 모름.

**조심할 점**:
- Filtering 은 빠르지만 정보 부족.
- Smoothing 은 정확하지만 미래 관측 필요 → test time 에는 불가능.
- 학습 시에는 ground truth 미래가 있으니 smoothing 가능.

### ProTran 에서의 역할

ProTran 의 inference 는 **smoothing 방식**: paper Eq 10 의 $\text{Attention}(h_{1:T}, h_{1:T}, h_{1:T})$ 가 과거 + 미래 모두 봄. Filtering only RNN 보다 우수.
- Training time: smoothing (전체 sequence 활용)
- Test time: prior (context $x_{1:C}$ 만 사용) — 미래 모름

---

## 4. Variational AutoEncoder (VAE)

### 친근한 비유 먼저

**사진을 작은 코드로 압축 + 복원** 하는 시스템. 일반 AutoEncoder 는 한 사진 → 정확히 한 코드 (deterministic). VAE 는 한 사진 → **확률 분포 위의 한 코드** (sampling) → 복원 시 약간 다른 사진. 이 무작위성 덕분에 학습 후 **새로운 그럴듯한 사진 생성** 가능.

핵심: "코드를 점이 아닌 분포로 만들어 다양성 확보."

### 정확한 정의

**기본 AutoEncoder**: encoder $\phi$ 가 $x \to z$, decoder $\theta$ 가 $z \to x$.

**VAE 의 차이**:
- $z$ 가 **확률 분포** (보통 Gaussian $\mathcal{N}(\mu, \sigma^2)$).
- Encoder 가 $\mu, \sigma$ 두 값을 출력 → 거기서 sample 추출.
- Loss = reconstruction (복원 정확도) + **KL divergence** (variational posterior $q_\phi$ vs prior $p$ 의 거리).

**일상 비유 — KL divergence**:
- 두 확률 분포가 얼마나 다른가의 "정보이론 거리".
- "두 사람이 같은 사건에 다른 확률 부여 → KL 큼."
- 0 이면 같은 분포, 클수록 다름.

### 조심할 점

- 너무 큰 KL 가중치 → $z$ 가 prior 와 거의 같아져 정보 못 담음 ("posterior collapse").
- 너무 작은 KL 가중치 → 일반 AE 와 다를 바 없음.

### ProTran 에서의 역할

ProTran 은 **sequential VAE** — 각 시점 $z_t$ 가 latent variable. paper Eq 8 / 11 이 Gaussian sampling, Eq 3 의 KL term 이 regularization.

---

## 5. ELBO (Evidence Lower BOund)

### 친근한 비유 먼저

VAE 의 학습 목표를 **"두 가지를 동시에 잘 하라"** 로 만든 게 ELBO:
1. **복원 잘 하기**: 입력 사진 → 압축 → 복원했을 때 원본과 닮기.
2. **규칙 따르기**: 압축된 코드가 미리 정한 분포 (보통 Gaussian) 와 비슷해야.

"진짜 likelihood 계산은 너무 어려우니, **그 lower bound 를 대신 최대화**" — 이게 ELBO 의 정신.

### 정확한 정의

VAE 학습 objective:

$$
\log p_\theta(x) \geq \mathbb{E}_{q_\phi}[\log p_\theta(x | z)] - D_{KL}(q_\phi(z|x) \| p(z))
$$

**기호 뜻**:
- $\log p_\theta(x)$: "데이터의 진짜 log likelihood" — 직접 계산 불가능 (intractable)
- $\mathbb{E}_{q_\phi}[\log p_\theta(x|z)]$: **reconstruction term** — "압축 코드 $z$ 에서 복원했을 때 원본 $x$ 의 확률"
- $D_{KL}(q_\phi \| p)$: **KL term** — "학습된 posterior $q_\phi$ 와 prior $p$ 의 거리"
- 부등호 ($\geq$): "진짜 likelihood 의 lower bound" — 이 lower bound 를 최대화해도 결국 진짜 likelihood 가 증가.

**왜 이 형태인가**:
- 진짜 $\log p(x)$ 는 적분 $\int p(x|z)p(z)dz$ 가 필요 — 고차원 적분 불가능.
- Jensen 부등식으로 lower bound 만들면 sampling 으로 계산 가능.

**조심할 점**:
- ELBO 와 진짜 likelihood 의 gap = $D_{KL}(q_\phi(z|x) \| p(z|x))$. Posterior 가 진짜와 같으면 gap 0.
- KL term 의 weight 가 결정적 — $\beta$-VAE 처럼 조절.

### ProTran 의 ELBO (Eq 3)

paper Eq 3 가 ProTran 의 ELBO. 시간 축 합 형식:

$$
\sum_{t=1}^{T} \big(\mathbb{E}_q[\log p_\theta(x_t|z_t)] - D_{KL}(q_\phi(z_t|z_{1:t-1}, x_{1:T}) \| p_\theta(z_t|z_{1:t-1}, x_{1:C}))\big)
$$

**구조**:
- 매 시점 $t$ 마다 reconstruction + KL.
- **비대칭**: posterior 는 $x_{1:T}$ (전체) 사용, prior 는 $x_{1:C}$ (context only).
- 이 비대칭이 smoothing → filtering 학습의 핵심.

---

## 6. Transformer Attention

### 친근한 비유 먼저

**회의에서 누구 말을 더 들을지 자동 결정** — 발언자가 10명이고 지금 결정을 내려야 한다면, 무작정 모두 같은 비중 들으면 안 된다. **"지금 주제에 관련된 사람"** 의 말을 더 듣고 무관한 사람은 덜 듣는다. 이게 attention.

수학적으로: "**Query (지금 내가 알고 싶은 것)** 와 각 **Key (각 발언자의 주제)** 를 비교 → softmax 로 가중치 → 그 가중치로 **Value (각 발언자의 실제 말)** 평균."

### 정확한 정의

**Self-attention** (paper Eq 4):

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d}}\right) V
$$

**기호 뜻**:
- $Q$ ($\ell_q \times d$): queries — "지금 알고 싶은 것들"
- $K$ ($\ell_k \times d$): keys — "각 정보의 주제 태그"
- $V$ ($\ell_k \times d$): values — "각 정보의 실제 내용"
- $QK^T$: query-key 유사도 행렬 ($\ell_q \times \ell_k$)
- $\sqrt{d}$ 로 나눔: 차원 커질 때 softmax 너무 sharp 해지는 거 방지
- softmax: 각 행이 합 1 인 가중치
- 결과: 각 query 에 대한 가중 평균된 value

**일상 비유**:
- $QK^T$ = "각 query 가 각 key 와 얼마나 잘 맞는가" 점수
- $\sqrt d$ = "점수가 너무 극단적으로 안 가게 하는 보정"
- softmax = "점수를 비율로 변환"
- $\times V$ = "비율대로 정보 섞기"

**Multi-head**: 여러 attention head 의 concat — "여러 관점에서 동시에 회의 참석" (한 head 는 'who', 다른 head 는 'when', 또 다른 head 는 'why').

### 조심할 점

- $O(\ell^2)$ 복잡도 — sequence 길이의 제곱.
- Long sequence (예: 1만 토큰) 에서 memory 폭발 → Sparse Transformer 등 필요.

### ProTran 의 차별점

- 표준 Transformer 는 **observation $x$ 에 attention** → autoregressive 학습.
- ProTran 은 **latent $z$ 에 attention** → non-autoregressive 생성 가능.
- 비유: "회의록 (observation) 보다 발언자의 머릿속 (latent) 을 직접 attention."

---

## 7. CRPS (Continuous Ranked Probability Score)

### 친근한 비유 먼저

**확률 예측의 점수표** — "내일 비 확률 70%" 라고 했는데 실제로 비가 왔으면 점수 ↑, 안 왔으면 ↓.

더 일반화하면: **"예측한 확률 분포가 실제 관측값에 얼마나 가까운가?"**
- 예측이 sharp 하고 정확 → CRPS 작음 (좋음)
- 예측이 너무 넓거나 빗나감 → CRPS 큼 (나쁨)

### 정확한 정의

paper Section 5.1:
$$
\text{CRPS}(F, x) = \int_{\mathbb{R}} (F(z) - \mathbb{1}_{\{x \leq z\}})^2 dz
$$

**기호 뜻**:
- $F$ = predicted CDF (cumulative distribution function) — 예측 분포의 누적
- $x$ = observed value — 실제 관측된 값
- $\mathbb{1}_{\{x \leq z\}}$ = 0 또는 1 인 step function — "$z$ 가 $x$ 이상이면 1, 미만이면 0"
- 적분 안: 두 함수 차이의 제곱 → 모든 $z$ 에 대해 적분

**그림으로 풀어보면**:
- 예측 CDF $F$: 부드러운 S자 곡선
- 실제 step function: $z = x$ 에서 0 → 1 로 점프
- 둘 사이 면적의 제곱 = CRPS

**왜 이 형태인가**:
- **Proper scoring rule**: 진실된 분포 예측 시 best score → 모델이 정직해야 좋은 점수.
- 단순한 MAE/MSE 는 point prediction 만 평가, 분포는 못 봄.
- CRPS 는 분포 전체 평가.

**조심할 점**:
- 분석적 계산 어려운 분포는 sample 100개로 empirical CDF 추정 → 그걸로 CRPS 계산.
- Multivariate 에는 직접 적용 어려움 → CRPS_sum 으로 단순화.

### CRPS_sum (paper Table 1 metric)

**CRPS_sum**: multivariate 시계열에서 **시간 축에 합산**. paper Table 1 의 평가 metric.
- 모든 series 에서 모든 시점의 CRPS 평균.

**Lower = better**.

---

## Wrap-up

| 개념 | 한 줄 비유 | ProTran 에서의 역할 |
|------|---------|---------------------|
| SSM | 운전자의 마음 추측 | 본 paper 의 framework. latent z + observation x. |
| LDS | 가장 단순한 운전자 (선형 규칙) | baseline (paper Figure 1a). Markovian + linear 한계. |
| Kalman filter | GPS + 자이로 결합 (filtering / smoothing) | inference 방식 — ProTran 은 smoothing 처럼 작동 |
| VAE | 사진을 확률 코드로 압축 | latent variable 학습 위한 tool |
| ELBO | 복원 + 규칙 두 목표 | 학습 objective (Eq 3, 14-15) |
| Attention | 회의에서 누구 말 더 들을지 | latent 사이의 의존성 모델링 (Eq 6-7, 16-18) |
| CRPS_sum | 확률 예측의 점수표 | 시계열 forecasting 평가 metric (Table 1) |

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Markovian SSM vs ProTran 의 non-Markovian SSM 의 핵심 차이는?**
2. **VAE 의 ELBO 가 두 term 으로 구성되는 이유는?**
3. **Filtering 과 Smoothing 의 차이, 그리고 ProTran 이 둘 중 무엇처럼 작동하는가?**

### 답변

1. **Markovian**: $z_t$ 가 $z_{t-1}$ 만 의존 (한 step 만 기억). **Non-Markovian (ProTran)**: $z_t$ 가 $z_{1:t-1}$ 전체 의존 — attention 으로 임의 거리 latent 직접 연결. 비유: 단순 운전자 (Markovian) vs 운전 전체 맥락 기억하는 운전자 (non-Markovian).
2. **Reconstruction term**: encoder 가 만든 코드 $z$ 로 원본 $x$ 를 얼마나 잘 복원하는가. **KL term**: 학습된 posterior $q_\phi(z|x)$ 와 prior $p(z)$ 의 거리 — 코드가 너무 멋대로 가지 않게 regularization. 두 term 의 균형 = "복원 정확 + 규칙 따르기".
3. **Filtering**: $p(z_t | x_{1:t})$ — 현재까지의 observation 만. **Smoothing**: $p(z_t | x_{1:T})$ — 과거 + 미래 모두. ProTran 의 training time inference (Eq 10) 가 **smoothing 처럼** 작동 — paper 가 강조하는 차별점. Test time 에는 미래 없으니 prior 사용.

---

이제 [02_abstract.md](02_abstract.md) 로.
