# 05 Problem Formulation — Section 3

paper p.2–3 의 Section 3. Quantile regression 의 수학적 정의 (Eq 1–3).

## Quantile 의 정의 (Eq 1)

> A quantile represents a critical value below which a specified proportion of the distribution lies. For a given probability $p$, the $p$-quantile is defined as the value $x_p$ such that $P(X \leq x_p) = p$, where $X$ is a random variable and $P$ denotes the probability measure. The quantile function, often denoted as $Q(p)$, maps a probability $p$ to the corresponding quantile $x_p$:
>
> $$Q(p) = \inf\{x : P(X \leq x_p) \geq p\}$$
>
> (paper Eq 1, p.2)

**해석**:
- $Q(0.5)$ = median (50% 분위수)
- $Q(0.9)$ = 90% 분위수 (상위 10% 경계)
- $Q(0.1)$ = 10% 분위수 (하위 10% 경계)

$Q(0.1)$ 과 $Q(0.9)$ 사이의 길이 = 80% 신뢰 구간의 폭.

---

## Rolling Forecasting Setting (Eq 2)

> Considering the rolling forecasting setting with a fixed size window, we have the observations at $T$ time points, represented by $X = \{x_i | i = 1, 2, \ldots, T\}$. The objective is to perform quantile regression for time series analysis, i.e., estimating the conditional quantiles of the response variable $y$ at different percentiles $\tau$:
>
> $$Q_\tau(y_t | X_t) = X_t \beta_\tau$$
>
> (paper Eq 2)

**표기**:
- $X_t$ = 시점 $t$ 의 입력 변수들 (lookback window)
- $y_t$ = 예측 대상
- $\beta_\tau$ = $\tau$-th quantile 의 회귀 coefficient
- $Q_\tau(y_t | X_t)$ = $X_t$ 가 주어졌을 때 $y_t$ 의 $\tau$ quantile

→ **linear quantile regression** 의 일반 형식. 본 paper 는 이를 deep neural network 로 확장.

---

## Quantile Regression Optimization (Eq 3)

> The quantile regression problem can be formulated as the following optimization problem:
>
> $$\min_{\beta_\tau} \sum_{t=1}^{T} \rho_\tau(y_t - X_t \beta_\tau)$$
>
> where $u = y_t - X_t \beta_\tau$ is the residual for the $t$-th observation; $\rho_\tau(u)$ is the loss function that penalizes the residuals with respect to the $\tau$-th quantile.
>
> (paper Eq 3)

### 수식 4줄 풀이 — Quantile Regression Optimization

**기호 뜻**:
- $y_t$: 실제 관측값 (시점 $t$)
- $X_t$: 입력 변수들 (lookback window)
- $\beta_\tau$: $\tau$-th quantile 의 회귀 coefficient (학습 대상)
- $u = y_t - X_t\beta_\tau$: residual (실제 - 예측)
- $\rho_\tau(u)$: pinball loss

**일상 비유**:
- "활쏘기에서 과녁 중앙 (median) 이 아닌 **9시 방향 1cm** 지점 맞추기 학습".
- $\tau = 0.9$ 면 "90% 확률로 화살이 표적의 X 이하" 가 되는 X 학습.
- $\rho_\tau$ 의 **asymmetric V-shape** 가 학습 방향 결정.

**왜 이 형태인가**:
- **Pinball loss**: $\tau$ 와 $1-\tau$ 의 다른 weight → asymmetric → 모델이 정확히 $\tau$-quantile 학습.
- $\tau = 0.5$ → symmetric V-shape (절대값 / 2) → median 학습.
- $\tau \neq 0.5$ → asymmetric → 다른 quantile.
- 다른 loss (MSE) 는 평균만 학습 — quantile 표현 불가.

**조심할 점**:
- Pinball loss 는 $u=0$ 에서 비미분 → subgradient 사용 (PyTorch 자동 처리).
- 여러 $\tau$ 동시 학습 시 quantile crossing (예: $\hat Q(0.7) > \hat Q(0.8)$) 가능 — paper 가 명시적 보정 안 함.
- $\tau$ 가 양 극단 (0.01 또는 0.99) 일 때 data 부족 — extreme tail estimation 어려움.

### Pinball Loss $\rho_\tau$

paper text 에서 정의하지 않았지만 표준 pinball loss:

$$
\rho_\tau(u) = \max(\tau u, (\tau - 1) u) = \begin{cases} \tau \cdot u & u \geq 0 \\ (\tau - 1) \cdot u & u < 0 \end{cases}
$$

**Asymmetric**: under-prediction ($u > 0$) vs over-prediction ($u < 0$) 의 weight 다름.

**$\tau = 0.5$ (median)**: $\rho_{0.5}(u) = 0.5 |u|$ — 표준 L1 loss 의 1/2.

**$\tau = 0.9$**: under-prediction penalty = $0.9 u$ (큰 부 weight) vs over-prediction penalty = $-0.1 u$ (작은 weight). → 모델이 99%로 actual 보다 작은 예측을 했을 때 큰 penalty.

→ 이 loss 가 최소화되면 모델은 $\tau$-th quantile 을 학습.

---

## 직관: 왜 quantile regression?

### 평균 회귀 (MSE) 의 한계
- $\min \sum (y - \hat{y})^2$ → 평균만 학습.
- "내일 강수량 예측 = 5mm" — 분산은? 비가 안 올 확률은?

### Quantile regression 의 답
- 여러 $\tau$ 를 동시에 예측 → distribution shape 학습.
- $\tau = \{0.1, 0.5, 0.9\}$ → 80% 신뢰 구간 표현.

→ **probabilistic forecasting** 의 정량적 기반.

---

## 본 paper 에서의 quantile set

paper 가 사용하는 quantile set: $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ (Table 1).

추가로 평가에서 0.1 도 사용 (Fig 4): "We set the upper and lower bound quantile as 0.1 and 0.9."

→ 5개 quantile 학습 + 2개 (0.1, 0.9) 가 신뢰 구간의 경계.

---

## Eq 1-3 의 통합 의미

```
quantile 정의 (Eq 1)     →    Q(p) = inf{x : P(X≤x_p) ≥ p}
                                          ↓ 시계열 적용
quantile regression (Eq 2) →   Q_τ(y_t | X_t) = X_t β_τ
                                          ↓ 학습 objective
optimization (Eq 3)        →   min Σ ρ_τ(y_t - X_t β_τ)
                                          ↓ 단순 linear → DNN 으로 확장
                              QuantileFormer
```

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Quantile $Q(p)$ 의 정의 (Eq 1) 에서 $\inf$ 가 필요한 이유는?**
2. **Pinball loss 가 $\tau = 0.5$ vs $\tau = 0.9$ 일 때 모양이 어떻게 다른가?**
3. **paper 가 5개 quantile (0.5, 0.6, 0.7, 0.8, 0.9) 만 사용하는 trade-off 는?**

### 답변

1. CDF $P(X \leq x)$ 가 **점프 (discontinuity)** 있을 수 있어 (이산형 분포). 그래서 "$P(X \leq x_p) \geq p$ 만족하는 가장 작은 $x$" = $\inf$ 가 필요. 연속형 분포에서는 단순 inverse CDF 와 동일.
2. **$\tau = 0.5$**: symmetric V-shape ($0.5 |u|$) — 절대값 절반. **$\tau = 0.9$**: asymmetric — under-prediction ($u > 0$) 은 기울기 0.9 (큰 페널티), over-prediction ($u < 0$) 은 기울기 0.1 (작은 페널티). 결과: 모델이 90% 확률로 실제값 $\leq$ 예측 이도록 학습.
3. **장점**: 단순, 학습 안정, pinball loss 직접 호환. **단점**: 5점 표본 — 분포의 mode 가 quantile 사이에 있으면 놓침. 전체 distribution (TMDM 의 diffusion) 보다 정밀도 낮음. **Trade-off**: 단순성 우선.

다음 [06_pattern_mixture_decomp.md](06_pattern_mixture_decomp.md) 에서 본 paper 의 첫 번째 핵심 contribution — pattern-mixture decomposition (Eq 4–7).
