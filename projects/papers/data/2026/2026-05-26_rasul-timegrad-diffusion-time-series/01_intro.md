# 01 시작하기 전에 — 미리 알아둘 7개 개념

TimeGrad 는 (1) 시계열 forecasting, (2) 다변량 확률 분포 추정, (3) Diffusion model 의 3-way 결합. 다음 7개를 머릿속에 채워두면 paper 의 모든 한 줄이 자리에 들어간다.

각 개념은 **친근한 비유 → 정확한 정의 → TimeGrad 에서의 역할** 순서로 풀어 설명한다.

---

## 1. 시계열 Forecasting (Time Series Forecasting)

### 친근한 비유 먼저

**일기예보** 를 생각해보자. 과거 며칠치 (기온/습도/풍속) 데이터를 보고 **다음 며칠** 예측. 본질적으로 같은 문제.

본 paper 예시:
- 다음 24시간 의 **전력 사용량** (Electricity 370 가구)
- 다음 24시간 의 **도로 교통량** (Traffic 963 도로)
- 다음 30일 의 **환율** (Exchange 8 통화)
- 다음 30분 단위 의 **택시 수요** (Taxi 1,214 지역)

### 정확한 정의

시계열 $\{x_1, x_2, \ldots, x_T\}$ 가 주어졌을 때, **미래 $h$ 단위 의 $\hat{x}_{T+1}, \ldots, \hat{x}_{T+h}$** 추정.

**Context window** $[1, t_0]$ 으로 학습 → **Prediction interval** $[t_0, T]$ 예측.

### TimeGrad 에서의 역할

paper Section 3 의 setup. **Long-term multivariate probabilistic forecasting** 의 새 표준 제안.

---

## 2. Multivariate (다변량) vs Univariate (단변량)

### 친근한 비유 먼저

**한 학생의 점수 시계열 (수학)** = univariate. **30명의 점수 시계열 (수학)** = multivariate (각 학생이 한 dimension).

본 paper: $x_t \in \mathbb{R}^D$ — $D$ 는 dimensions 수. 예: Wikipedia $D = 2,000$.

### 정확한 정의

- **Univariate**: $x_t \in \mathbb{R}$ — 한 시점에 한 값.
- **Multivariate**: $x_t \in \mathbb{R}^D$ — 한 시점에 $D$ 차원 vector.

### 왜 multivariate 가 어려운가?

- $D$ 개 series 가 **서로 상관** 있을 수 있음.
- Joint distribution $p(x^{(1)}_t, x^{(2)}_t, \ldots, x^{(D)}_t)$ 학습 필요.
- 단순 Gaussian: $D^2$ 파라미터 (full covariance) → $D = 2000$ 이면 4M 파라미터 — 학습 부담.

### TimeGrad 의 답

**Diffusion model** 로 joint distribution 학습. 차원 수 무관하게 같은 framework 적용 가능. paper 가 Vec-LSTM (low-rank Gaussian copula) 같은 기존 multivariate 방법들의 한계 (low-rank 제약) 극복.

---

## 3. Probabilistic (확률적) vs Deterministic (결정적)

### 친근한 비유 먼저

**일기예보 의 두 표현**:
- **Deterministic**: "내일 비 온다" — 한 값 (yes/no).
- **Probabilistic**: "내일 비 올 확률 70%" — 분포.

후자가 의사결정에 결정적. "비 올 확률 70%" 면 우산 챙기기. "비 올 확률 20%" 면 안 챙기기.

### 정확한 정의

- **Deterministic**: 한 시점에 한 값 ($\hat{x}_t$) 출력.
- **Probabilistic**: 분포 또는 분위수 ($\hat{x}_t \sim \hat{p}_t$) 출력. 100 sample → empirical distribution.

### TimeGrad 의 역할

**Probabilistic forecasting** 의 표준 모델. 매 시점 $t$ 의 **100 sample** 으로 prediction interval (50%, 90%) 계산. Fig 4 가 Traffic 의 6 dimension prediction intervals 시각화.

---

## 4. DDPM (Denoising Diffusion Probabilistic Model)

### 친근한 비유 먼저

**손상된 사진 복원** 을 두 단계로 학습:
1. **Forward (학습 데이터 만들기)**: 원본 사진에 **N=100 단계** 노이즈 점진적 추가 → 완전 무작위 noise.
2. **Reverse (복원 학습)**: 모델이 **noise → 원본** 으로 한 step 씩 복원하는 법 학습.

학습 후: **순수 noise** 에서 시작해 **N step 복원** → 진짜 같은 새 사진 생성.

### 정확한 정의

**DDPM** (Ho et al. 2020): Sohl-Dickstein 2015 의 diffusion model + 학습 simplification.

**Forward process** (fixed):
$$
q(x^n | x^{n-1}) = \mathcal{N}(x^n; \sqrt{1-\beta_n} \cdot x^{n-1}, \beta_n \mathbf{I})
$$

**Reverse process** (learned):
$$
p_\theta(x^{n-1} | x^n) = \mathcal{N}(x^{n-1}; \mu_\theta(x^n, n), \Sigma_\theta(x^n, n) \mathbf{I})
$$

**학습 목표** (paper Eq 7 단순화):
$$
\mathbb{E}_{x^0, \epsilon, n}\big[ \| \epsilon - \epsilon_\theta(\sqrt{\bar\alpha_n} x^0 + \sqrt{1-\bar\alpha_n} \epsilon, n) \|^2 \big]
$$

→ **noise prediction** task. $\epsilon_\theta$ 가 noise $\epsilon$ 를 예측.

### TimeGrad 의 역할

**핵심 contribution**: DDPM 을 **시계열에 조건화** ($h_{t-1}$ 으로). $\epsilon_\theta(x^n_t, h_{t-1}, n)$ 형태. 다음 [04_diffusion_background.md](04_diffusion_background.md) 에서 자세히.

---

## 5. Langevin Dynamics

### 친근한 비유 먼저

**언덕 위에서 공 굴리기** + **약간의 흔들림**. 공이 자연스럽게 가장 낮은 곳 (분포의 mode) 으로 굴러가지만, 흔들림 덕분에 한 mode 에만 갇히지 않고 분포 전체를 탐색.

수학적으로: $x_{t+1} = x_t - \eta \nabla \log p(x_t) + \sqrt{2\eta} \mathbf{z}$, $\mathbf{z} \sim \mathcal{N}(0, \mathbf{I})$.
- $-\nabla \log p$ = "분포의 mode 향한 방향" (gradient 등반)
- $\sqrt{2\eta} \mathbf{z}$ = "흔들림" (random noise)

### 정확한 정의

**Langevin dynamics**: 분포 $p(x)$ 에서 sampling 하는 stochastic process. 충분한 step 후 분포의 sample 에 수렴.

**Annealed Langevin** (Song-Ermon 2019, 본 paper Algorithm 2): noise scale 을 점진적 감소 시키면서 sampling — diffusion 의 reverse process 와 등가.

### TimeGrad 의 역할

paper Algorithm 2 의 sampling — N 번 loop. $x^{n-1}_t = \frac{1}{\sqrt{\alpha_n}}(x^n_t - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}}\epsilon_\theta(x^n_t, h_{t-1}, n)) + \sqrt{\Sigma_\theta} \mathbf{z}$.

→ **단점**: N=100 loop 가 inference 속도 부담 (paper Section 6 가 미래 작업 명시).

---

## 6. Energy-Based Model (EBM)

### 친근한 비유 먼저

**에너지 표면** 비유. 평지 + 깊은 골짜기들. 분포의 mode = 골짜기 깊은 곳. 공이 굴러가면 골짜기에 도달.

**EBM** = "에너지 함수 $E(x)$ 학습 → 분포 $p(x) \propto e^{-E(x)}$ 자동 정의".

### 정확한 정의

**EBM**: $p_\theta(x) = \frac{e^{-E_\theta(x)}}{Z(\theta)}$, $Z(\theta) = \int e^{-E_\theta(x)} dx$.

- 장점: **flexible functional form** — $E$ 가 임의 신경망 가능.
- 단점: **$Z$ 가 intractable** — normalizing constant 계산 어려움.
- 해결: **Score matching** ($\nabla \log p$ 직접 학습) — Hyvärinen 2005, Song-Ermon 2019.

### TimeGrad 의 역할

paper 가 명시: "**EBM 의 시계열 적용**" — Ho 2020 의 DDPM 이 score matching 의 변형 (Eq 7). TimeGrad = autoregressive EBM 시계열.

paper Section 5.1 (Related Work): "EBMs have been shown to perform well in learning high dimensional data distributions at the cost of being difficult to train (Song & Kingma, 2021)." TimeGrad 가 그 cost 를 diffusion 으로 회피.

---

## 7. CRPS (Continuous Ranked Probability Score)

### 친근한 비유 먼저

**확률 예측의 점수표**. "내일 비 확률 70%" 라고 했는데 실제로 비 옴 → 점수 ↑. 실제로 안 옴 → 점수 ↓.

CRPS = 예측 CDF $F$ 와 실제 관측 $x$ 의 step function 사이 squared distance.

### 정확한 정의

$$
\text{CRPS}(F, x) = \int_\mathbb{R} (F(z) - \mathbb{1}_{\{x \leq z\}})^2 dz
$$

- $F$ = predicted CDF
- $x$ = observed value

**Proper scoring rule**: 모델이 진실된 분포 출력 시 최소 점수 → 모델이 정직해야 좋은 점수.

**CRPS_sum** (multivariate): paper p.6 정의:
$$
\text{CRPS}_\text{sum} = \mathbb{E}_t\left[\text{CRPS}\left(\hat{F}_\text{sum}(t), \sum_i x^0_{i,t}\right)\right]
$$
→ $D$ dimensions 의 합 ($\sum_i x^0_{i,t}$) 의 CDF 비교.

### TimeGrad 의 역할

paper Table 2 의 평가 metric. 6 datasets × 11 models 의 CRPS_sum 비교. **Lower = better**. TimeGrad 가 5/6 datasets 에서 best.

---

## Wrap-up: 위 7개가 어떻게 결합되는가

| 개념 | 한 줄 비유 | TimeGrad 에서의 역할 |
|------|----------|---------------------|
| 시계열 forecasting | 일기예보 | 본 paper 의 task |
| Multivariate | 30명 점수 vs 1명 점수 | $x_t \in \mathbb{R}^D$ 다차원 |
| Probabilistic | "비 확률 70%" | 100 sample → distribution |
| DDPM | 손상 사진 복원 학습 | 다음 시점 $x^0_t$ 의 분포 생성 |
| Langevin dynamics | 언덕 위 공 굴리기 + 흔들림 | Sampling (Algorithm 2) |
| EBM | 에너지 표면 (분포의 골짜기) | DDPM 의 이론적 토대 |
| CRPS | 확률 예측 점수표 | 평가 metric (Table 2) |

이제 [02_abstract.md](02_abstract.md) — 제목 + Abstract 풀어 읽기.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Univariate (DeepAR) vs Multivariate (TimeGrad) 의 결정적 차이는?**
2. **DDPM 의 forward process 가 "fixed" 인 반면 reverse process 가 "learned" 인 이유는?**
3. **CRPS 가 단순 MAE/MSE 와 다른 점은?**

### 답변

1. **DeepAR (Salinas 2019b)**: 각 시점에 **한 값** (univariate Gaussian) 예측 — series 간 cross-correlation 못 잡음. **TimeGrad**: 매 시점 **$D$ 차원 vector** 의 joint distribution 학습 — series 간 의존성 자동. 예: Traffic 963 도로의 인접 도로 간 상관 + Electricity 370 가구의 동시 peak 같은 multivariate 의존성.
2. **Forward**: 단순 Gaussian noise 추가 — analytical, 학습 불필요. **Reverse**: noise → 원본 복원 — complex, 신경망 학습 필요. **이 비대칭이 DDPM 의 학습 가능성 핵심**: forward 가 fixed Markov chain 이라 KL term 이 closed-form ($q(x^{n-1}|x^n, x^0)$ analytical), reverse 만 학습.
3. **MAE/MSE**: point prediction 정확도만. "내일 강수량 5mm" 의 정확도. **CRPS**: 분포 전체의 정확도. "내일 강수량 분포 $\hat{F}$" 가 실제 관측과 얼마나 가까운가. 신뢰 구간의 폭 + coverage 동시 평가. Proper scoring rule — 모델이 정직한 분포 출력 시에만 좋은 점수.
