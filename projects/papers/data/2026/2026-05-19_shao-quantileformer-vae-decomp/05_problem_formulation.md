# 05. Section 3 (Problem Formulation) — Quantile Regression 의 수식 정의

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Quantile** 의 정확한 수학 정의 — CDF 의 역함수
- **Eq 1-3** 의 의미 — quantile 정의 / rolling forecasting / optimization
- **Pinball loss** 가 quantile 학습을 보장하는 수학적 증명 (★ paper 미명시 본 해체 추가)
- 본 논문 의 prediction interval 이 어떻게 학습되는가

---

논문 2쪽 ~ 3쪽 (Section 3) 을 풀어본다. 이 섹션은 **본 논문이 풀려는 수학적 문제** 를 정의한다.

핵심 수식 3개: **Eq 1 (quantile 정의) → Eq 2 (rolling forecasting) → Eq 3 (optimization)**.

---

## 5.1 시작하기 전 — Quantile 이 정확히 뭐인지

영어를 못해도 따라올 수 있도록 처음부터 정의.

### "Quantile (분위수)" 의 일상적 정의

**시나리오**: 학교에서 1000명이 시험을 봤다. 점수를 작은 것부터 큰 것 순으로 줄 세웠다.

- **0.5-quantile** (= 50% 분위수 = **median**): 500번째 사람의 점수. (정확히 가운데)
- **0.9-quantile** (= 90% 분위수): 900번째 사람의 점수. (= **상위 10% 의 경계** = "이 점수 이상은 상위 10%")
- **0.1-quantile** (= 10% 분위수): 100번째 사람의 점수. (= **하위 10% 의 경계**)

**일반화**: $p$-quantile = "전체 데이터의 $p$ 비율 이 이 값 이하" 인 값.

### 수학적 정의 — Eq 1

paper Eq 1 (p.2):

> "For a given probability $p$, the $p$-quantile is defined as the value $x_p$ such that $P(X \leq x_p) = p$, where $X$ is a random variable and $P$ denotes the probability measure. The quantile function, often denoted as $Q(p)$, maps a probability $p$ to the corresponding quantile $x_p$:"

$$
Q(p) = \inf\{x : P(X \leq x_p) \geq p\}
$$

### 🔣 식이 말하는 것 한 줄

"확률 변수 X 의 p-quantile = '이 값 이하의 확률이 p 이상' 을 만족하는 가장 작은 x". 직관: "줄을 세워서 p 위치의 사람".

### 🔣 4-단 기호 풀이 (수식 못 읽어도 따라가는 표)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $X$ | 확률 변수 | "주사위·시험점수·내일 강수량 같은 랜덤 값" | 확률 분포가 있어야 quantile 정의 가능 |
| $p$ | 확률 (0~1 사이) | "줄에서 몇 % 위치인지" | 0.5 = median, 0.9 = 상위 10% 경계 |
| $x_p$ | $p$-quantile 의 값 | "줄세웠을 때 $p$ 위치 사람의 점수" | 같은 분포라도 $p$ 마다 다른 값 |
| $P(X \leq x_p)$ | X 가 $x_p$ 이하일 확률 | "이 점수 이하 사람의 비율" | CDF 의 값 |
| $\inf\{\cdots\}$ | 집합의 최소 (infimum) | "조건을 만족하는 가장 작은 값" | 이산 분포에서 중요 (연속에선 = min) |
| $Q(p)$ | quantile function | "p 를 입력하면 p-quantile 값을 출력하는 함수" | CDF 의 역함수 |

### 🌱 일상 비유로 한 번 더

"학생 1000명 시험 점수" 를 줄 세웠을 때:
- $Q(0.5)$ = 500번째 학생 점수 = median
- $Q(0.9)$ = 900번째 학생 점수 = 상위 10% 경계
- $Q(0.1)$ = 100번째 학생 점수 = 하위 10% 경계

본 논문은 **여러 quantile 동시에 예측** → "이 학생이 내일 시험 보면 50% 확률로 70~80점, 90% 확률로 60~85점" 같은 분포 예측.

**식 자체의 의미**:
- "$P(X \leq x_p) \geq p$" 를 만족하는 $x$ 들 중 **가장 작은** $x$ 가 $Q(p)$.
- 직관: "확률 $p$ 이상이 이 값 이하" 인 가장 빠듯한 경계.

### 예시 계산

데이터: $\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$ (10개).

- $Q(0.5)$ = 5 또는 6 사이 (관습에 따라 5.5)
- $Q(0.9)$ = 9
- $Q(0.1)$ = 1

→ 5명 이하 (50%) 가 5 이하, 9명 이하 (90%) 가 9 이하.

### 응용 — 신뢰 구간 표현

$Q(0.1)$ 과 $Q(0.9)$ 사이 = **80% 신뢰 구간** 의 폭.

예: $Q(0.1) = 3$ MW, $Q(0.9) = 8$ MW → "내일 전력 수요가 80% 확률로 [3, 8] MW".

---

## 5.2 Rolling Forecasting Setting — Eq 2

### 원문

> **paper p.2~3**: "Considering the rolling forecasting setting with a fixed size window, we have the observations at $T$ time points, represented by $X = \{x_i | i = 1, 2, \ldots, T\}$. The objective is to perform quantile regression for time series analysis, i.e., estimating the conditional quantiles of the response variable $y$ at different percentiles $\tau$:"

paper Eq 2:

$$
Q_\tau(y_t | X_t) = X_t \beta_\tau
$$

### Eq 2 의 기호 풀이

| 기호 | 의미 | 비유 |
|------|------|------|
| $T$ | 관측 시점 수 | "데이터를 모은 시점 개수" |
| $X = \{x_i\}$ | 전체 데이터 시퀀스 | "$T$개의 데이터" |
| $X_t$ | 시점 $t$ 의 **입력 변수들** (lookback window) | "오늘부터 과거 $L$ 시점의 데이터" |
| $y_t$ | 시점 $t$ 의 **예측 대상** | "내일의 값" |
| $\tau$ | quantile level (0~1 사이) | "어느 분위수를 예측할지" |
| $\beta_\tau$ | $\tau$-quantile 의 회귀 계수 | "model 의 학습 parameter" |
| $Q_\tau(y_t | X_t)$ | $X_t$ 가 주어졌을 때 $y_t$ 의 $\tau$-quantile | **"입력 $X_t$ 가 주어졌을 때 출력 $y_t$ 의 $\tau$-quantile 추정값"** |

### Eq 2 의 의미

**Linear quantile regression 의 표준 형식**:
- 입력 $X_t$ 를 받아서.
- $X_t \cdot \beta_\tau$ 라는 선형 결합을 계산해서.
- 그 결과가 $y_t$ 의 $\tau$-quantile 이라고 예측.

**왜 "conditional" 인가?**: "$y_t$ 의 quantile 을 그냥 보는" 게 아니라 **"$X_t$ 가 주어졌다는 조건 하에서"** 의 quantile.

**비유**: 학생 점수의 quantile 을 "전체 학생 기준" 으로 보는 것 vs "공부 시간 5시간인 학생 그룹 안에서" 보는 것.

### "Rolling forecasting" 이란?

**Rolling window**: 시간을 따라가며 window 를 이동.
- $t=100$ 일 때: 입력 = 시점 $1\sim100$, 예측 = $101\sim196$.
- $t=101$ 일 때: 입력 = 시점 $2\sim101$, 예측 = $102\sim197$.
- ... 이렇게 window 가 한 칸씩 움직임.

**비유**: 매일 아침 "어제까지의 1주일 데이터" 로 "내일부터 1주일" 을 예측. 매일 반복.

### linear → deep learning 확장

paper 의 핵심: **Eq 2 의 linear $\beta_\tau$ 를 deep neural network 로 일반화**.

→ $Q_\tau(y_t | X_t) = \text{QuantileFormer}_\tau(X_t)$.

QuantileFormer 가 5개의 $\tau \in \{0.5, 0.6, 0.7, 0.8, 0.9\}$ 에 대해 **동시에** quantile 을 출력.

---

## 5.3 Quantile Regression Optimization — Eq 3

### 원문

> **paper p.3**: "The quantile regression problem can be formulated as the following optimization problem:"

paper Eq 3:

$$
\min_{\beta_\tau} \sum_{t=1}^{T} \rho_\tau(y_t - X_t \beta_\tau)
$$

> "where $u = y_t - X_t \beta_\tau$ is the residual for the $t$-th observation; $\rho_\tau(u)$ is the loss function that penalizes the residuals with respect to the $\tau$-th quantile."

### Eq 3 의 기호 풀이

| 기호 | 의미 |
|------|------|
| $u = y_t - X_t \beta_\tau$ | residual (잔차) = 실제값 - 예측값 |
| $\rho_\tau(u)$ | **pinball loss** (paper 의 핵심 loss) |
| $\min_{\beta_\tau}$ | $\beta_\tau$ 를 조정해서 최소화 |
| $\sum_{t=1}^{T}$ | 모든 시점의 loss 합 |

### Eq 3 의 의미

"모든 시점의 residual 에 대해 pinball loss 를 계산하고 합한 것을 최소화 — 그 결과가 $\tau$-quantile 을 잘 예측하는 $\beta_\tau$".

---

## 5.4 Pinball Loss $\rho_\tau$ 풀이

paper 본문이 명시적으로 정의 안 했지만 표준 pinball loss:

$$
\rho_\tau(u) = \max(\tau u, (\tau - 1) u) = \begin{cases} \tau \cdot u & u \geq 0 \\ (\tau - 1) \cdot u & u < 0 \end{cases}
$$

### Pinball loss 의 비대칭성

**핵심 특징**: under-prediction (예측이 작음) vs over-prediction (예측이 큼) 의 weight 가 **다름**.

$u = y - \hat{y}$ 로 보면:
- **Under-prediction** ($\hat{y} < y$, 즉 $u > 0$): loss = $\tau \cdot u$. → $\tau$ 가 크면 큰 penalty.
- **Over-prediction** ($\hat{y} > y$, 즉 $u < 0$): loss = $(\tau - 1) \cdot u = (1-\tau) \cdot |u|$. → $\tau$ 가 크면 작은 penalty.

### 구체 예시

**$\tau = 0.9$ 의 경우**:
- 실제 $y = 10$, 예측 $\hat{y} = 7$ → $u = 3 > 0$ → loss = $0.9 \times 3 = 2.7$. (큰 penalty)
- 실제 $y = 10$, 예측 $\hat{y} = 13$ → $u = -3 < 0$ → loss = $(0.9-1) \times (-3) = 0.3$. (작은 penalty)

→ 모델은 "어차피 over-prediction (예측이 큼) 이 안전" 이라고 학습 → **위로 치우친 예측** → **상위 quantile (= 90%)** 학습.

**$\tau = 0.5$ 의 경우 (= median)**:
- $\rho_{0.5}(u) = 0.5 |u|$ — 양쪽 동일 weight.
- 표준 L1 loss 의 1/2 — 모델은 median 학습.

**$\tau = 0.1$ 의 경우**:
- Under-prediction weight = 0.1, over-prediction weight = 0.9.
- → 모델은 "under-prediction 이 안전" → 작은 값 예측 → **10% 분위수** 학습.

### Pinball loss 의 그림 (V-shape)

```
         loss
          │
       0.9│ \      / 0.1 (slope)
          │  \    /
          │   \  /
        0 │____\/____   u = y - ŷ
              0
            (실제값 - 예측값)
```

- $\tau = 0.9$ 일 때: 왼쪽 (over-prediction, $u<0$) 의 기울기 = 0.1, 오른쪽 (under-prediction, $u>0$) 의 기울기 = 0.9.
- **비대칭 V-shape**.

### "왜 이게 quantile 을 학습시키는가" 의 직관

**증명 (정성적)**:
- 모델이 quantile $Q$ 를 출력한다고 하자.
- Under-prediction 확률 = $P(y > \hat{y}) = P(y > Q)$.
- Over-prediction 확률 = $P(y < \hat{y}) = P(y < Q)$.
- 기대 loss = $\tau \cdot P(y > Q) \cdot E[y - Q | y > Q] + (1-\tau) \cdot P(y < Q) \cdot E[Q - y | y < Q]$.
- 1차 조건 (loss 의 $Q$ 에 대한 도함수 = 0) 을 풀면 $P(y < Q) = \tau$ → $Q = \tau$-quantile.

→ **수학적으로 pinball loss 의 최소화 ⇔ $\tau$-quantile 예측**.

---

## 5.5 본 paper 에서의 quantile set

paper 가 사용하는 quantile set: $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ (Table 1).

**왜 이 5개?**:
- 모두 **median 이상** (0.5, 0.6, ..., 0.9).
- 분포의 **상위 절반** 을 표현 — 전력·풍속 등에서 "최대 부하" 예측에 유용.
- Lower quantile (0.1, 0.2, ...) 은 학습 안 함 (대칭 가정 또는 후처리 활용).

추가로 evaluation 단계 (Fig 4) 에서 **0.1 도 함께 사용**:
> paper text: "We set the upper and lower bound quantile as 0.1 and 0.9."

→ 5개 quantile 학습 + 2개 (0.1, 0.9) 가 신뢰 구간 경계.

### 비유

5개 quantile = **5개의 "예측 후보"**.
- $\hat{y}_{0.5}$ = "median 예측" (가장 흔한 미래값).
- $\hat{y}_{0.9}$ = "상위 10% 예측" (worst case, 최대 부하).
- 이 두 값의 차이 = **모델의 uncertainty 추정치**.

---

## 5.5-bis ★ Pinball loss 가 quantile 을 학습시키는 수학적 증명 (Step 1·2)

paper 가 명시 안 함. 본 deep dive 의 정리.

### Step 1: 기대 loss 의 미분

모델이 quantile $Q$ 를 출력한다고 가정. 기대 loss:
$$
E[\rho_\tau(y - Q)] = \int_{Q}^{\infty} \tau (y - Q) f(y) dy + \int_{-\infty}^{Q} (\tau - 1)(y - Q) f(y) dy
$$

(첫 항: $y > Q$ 일 때 under-prediction loss. 둘째 항: $y < Q$ 일 때 over-prediction loss.)

### Step 2: $Q$ 에 대한 도함수 = 0

$\frac{\partial}{\partial Q} E[\rho_\tau(y - Q)] = 0$ 를 풀면:

$$
\tau \int_{Q}^{\infty} (-1) f(y) dy + (\tau - 1) \int_{-\infty}^{Q} (-1) f(y) dy = 0
$$
$$
-\tau (1 - F(Q)) - (\tau - 1) F(Q) = 0
$$
$$
\tau - \tau F(Q) - \tau F(Q) + F(Q) = 0
$$
$$
F(Q) = \tau
$$

(여기서 $F$ 는 CDF.)

### 결론

$F(Q) = \tau$ ⇔ $Q = F^{-1}(\tau)$ = **$\tau$-quantile**.

→ **수학적으로 pinball loss 의 최소화 = $\tau$-quantile 의 출력**. 모델이 자연스럽게 quantile 학습.

> ★ **이게 pinball loss 가 "magical" 한 이유**. 정해진 quantile 만 출력하도록 강요하는 게 아니라, **loss 자체가 quantile 을 정의** 하는 elegant design.

---

## 5.6 Eq 1~3 의 통합 의미

```
Eq 1 (quantile 정의)         Q(p) = inf{x : P(X≤x_p) ≥ p}
                                    ↓ 시계열 적용
Eq 2 (quantile regression)   Q_τ(y_t | X_t) = X_t β_τ
                                    ↓ 학습 objective
Eq 3 (optimization)          min Σ ρ_τ(y_t - X_t β_τ)
                                    ↓ linear → DNN 확장
                              QuantileFormer
```

**핵심 일관성**:
- Eq 1 = "quantile 이란 무엇인가" (정의).
- Eq 2 = "어떻게 모델링하는가" (linear regression).
- Eq 3 = "어떻게 학습하는가" (pinball loss 최소화).
- 이 3개를 deep learning 으로 확장한 것이 **본 논문의 QuantileFormer**.

---

## 5.7 Section 3 핵심 정리

| 항목 | 내용 |
|------|------|
| Quantile 정의 (Eq 1) | $p$-quantile = "전체의 $p$ 비율이 이 값 이하인 가장 작은 값" |
| Quantile regression (Eq 2) | $Q_\tau(y_t | X_t) = X_t \beta_\tau$ |
| Optimization (Eq 3) | $\min \sum \rho_\tau(y_t - X_t \beta_\tau)$ |
| Loss function $\rho_\tau$ | Pinball loss — 비대칭 V-shape |
| 본 paper 의 quantile set | $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ |
| DNN 확장 | $\beta_\tau$ 를 QuantileFormer 로 대체 |

**한 줄 핵심**:
> **"5개 quantile (0.5, 0.6, 0.7, 0.8, 0.9) 을 동시에 예측하는 deep model 을 pinball loss 로 학습시키는 것이 본 논문의 학습 목표."**

다음 [06_pattern_mixture_decomp.md](06_pattern_mixture_decomp.md) 에서 **본 논문의 핵심 contribution — pattern-mixture decomposition (Eq 4~7)** 을 풀이.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **0.9-quantile 이 일상적으로 무엇을 의미하는가?**
2. **Pinball loss 가 비대칭인 이유는?**
3. **본 paper 가 학습하는 5개 quantile 과 그 의미는?**

### 답변

1. **0.9 quantile 의 의미**:
   - **정의**: "전체 데이터의 90% 가 이 값 이하" 인 값. 즉 **상위 10% 의 경계**.
   - **수식**: $Q(0.9) = x$ s.t. $P(X \leq x) = 0.9$.
   - **응용 예시**:
     - 전력 수요: "내일 90% 확률로 부하가 이 값 이하" = "예상 최대 부하 (peak)".
     - 풍속 예측: "내일 90% 확률로 풍속이 이 값 이하" = "예상 최대 풍속".
     - VaR (Value at Risk): 금융에서 "95% 신뢰수준의 최대 손실" = 0.05-quantile 의 음수.
   - **학생 점수 비유**: "상위 10% 컷오프 점수" = "이 점수 이상이면 상위 10%".
   - **운용 가치**: 안전마진 산정, 위험 관리, capacity planning 에 결정적.
   - **median (0.5) 과의 차이**: median 은 "평균적 예측", 0.9 quantile 은 "안전마진 포함 예측".

2. **Pinball loss 의 가중치 비대칭 — quantile 학습 메커니즘**:
   - **목적**: 모델이 정확히 $\tau$-quantile 을 학습하도록 유도.
   - **가중치 메커니즘**:
     - **$\tau$ 가 크면 (예: 0.9)**: under-prediction (낮게 예측) 에 큰 penalty (×0.9), over-prediction (높게 예측) 에 작은 penalty (×0.1).
     - 모델은 "높게 예측하는 게 안전" 학습 → **위로 치우친 예측** → 결과적으로 90 percentile.
     - **$\tau = 0.5$**: 가중치 대칭 (×0.5 vs ×0.5) → median 학습.
     - **$\tau = 0.1$**: over-prediction 에 큰 penalty → 낮게 예측 → 10 percentile.
   - **수학적 증명**:
     - Pinball loss 의 1차 조건 (∂L/∂$\hat y$ = 0) 을 풀면 정확히 $\tau$-quantile 이 답.
     - 즉 **pinball loss 최소화 ⇔ $\tau$-quantile 예측** (수학적 동치).
   - **함의**: 가중치 조정만으로 임의의 quantile 학습 가능. **분포의 어느 위치든 예측 가능** 한 유연성.

3. **본 논문의 quantile set $Q$ 선택**:
   - **paper 의 $Q$**: $\{0.5, 0.6, 0.7, 0.8, 0.9\}$.
   - **모두 median 이상** — 분포의 **상위 절반에 집중**.
   - **이유**:
     - 0.5 = median (가장 흔한 미래값)
     - 0.9 = 상위 10% (worst case, 안전마진)
     - 0.6, 0.7, 0.8 = 그 사이의 grid
   - **5 개를 동시 예측해 분포 shape 파악**:
     - 0.5 → 0.9 의 5 점이 분포의 상위 절반 모양 그림.
     - 예: 0.5=5, 0.6=5.5, 0.7=6, 0.8=7, 0.9=10 → "꼬리가 두꺼움" 알 수 있음.
   - **Eval 시 80% interval 표현**:
     - 0.1 추가 측정으로 [0.1, 0.9] = 80% 신뢰 구간.
     - 또는 0.05, 0.95 측정으로 90% 신뢰 구간.
   - **응용에 따른 변경**:
     - 금융 VaR: $Q = \{0.01, 0.05, 0.10\}$ (lower tail).
     - 의료 risk: $Q = \{0.5, 0.95, 0.99\}$ (worst case 중요).
   - 본 논문 framework 가 quantile set 만 바꿔서 다양한 응용 가능.
