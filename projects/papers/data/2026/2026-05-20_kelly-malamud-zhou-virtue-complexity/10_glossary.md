# 10. 용어집 + 기호 사전

> **🧒 한 줄 요약**: 용어 사전. RFF / ridge / double descent / P/T ratio 정리.


> 본 논문에 나오는 모든 기호·약어·핵심 용어를 사전 형태로.

---

## 10.1 기본 데이터 표기

| 기호 | 의미 |
|------|------|
| $t$ | 시점 index (월 단위 monthly) |
| $T$ | 학습 표본 크기 (training window). 본 논문: T=12, 60, 120 |
| $R_{t+1}$ | 시점 $t+1$ 의 자산 (시장 지수) 초과수익 (스칼라) |
| $G_t \in \mathbb{R}^{15}$ | Raw predictors (Goyal-Welch 15 + lag market return) |
| $S_t \in \mathbb{R}^P$ | Signal vector at time $t$ (P-dim, RFF 변환 또는 raw) |
| $\varepsilon_{t+1}$ | iid 잡음, $E[\varepsilon] = 0$, $E[\varepsilon^2] = \sigma^2 = 1$ |

---

## 10.2 모델 구성요소

| 기호 | 의미 |
|------|------|
| $\beta \in \mathbb{R}^P$ | True regression coefficient (Assumption 4: random, isotropic) |
| $\hat\beta(z) \in \mathbb{R}^P$ | Ridge estimator with shrinkage $z$ |
| $\hat\beta(0^+)$ | Ridgeless estimator (Moore-Penrose pseudo-inverse) |
| $z \ge 0$ | Ridge shrinkage parameter |
| $z_*$ | Optimal shrinkage. Correctly specified: $z_* = c/b_*$ |
| $\hat\pi_t(z) = \hat\beta(z)' S_t$ | Timing weight at time $t$ |
| $R_{t+1}^\pi = \hat\pi_t R_{t+1}$ | Timing strategy return |

---

## 10.3 차원 + complexity

| 기호 | 의미 |
|------|------|
| $P$ | Number of predictors (signal dimension) |
| $P_1 \le P$ | Number of observed signals (misspecified) |
| $c = P/T$ | **Model complexity** (limiting ratio). 본 논문 핵심 |
| $q = P_1/P$ | Misspecification ratio ($q \in (0, 1]$, $q = 1$ = correctly specified) |
| $cq = P_1/T$ | Empirical complexity (misspecified) |

---

## 10.4 Covariance 행렬

| 기호 | 의미 |
|------|------|
| $\Psi \in \mathbb{R}^{P \times P}$ | True signal covariance (Assumption 2, PSD) |
| $\Psi_{1,1} \in \mathbb{R}^{P_1 \times P_1}$ | Observed signals' covariance (misspecified) |
| $\Psi_{1,2}$ | Observed-unobserved cross-covariance |
| $\Psi_{2,2}$ | Unobserved signals' covariance |
| $\hat\Psi = T^{-1} \sum_t S_t S_t'$ | Sample signal covariance |
| $\hat\Psi_{1,1}$ | Sample covariance of observed signals |
| $X_t = \Psi^{-1/2} S_t$ | Standardized signals (Assumption 2) |

---

## 10.5 Asymptotic moments

| 기호 | 의미 |
|------|------|
| $\lambda_k(\Psi)$ | $k$-th eigenvalue of $\Psi$ |
| $F^\Psi(x) = P^{-1} \sum_k \mathbf{1}_{\lambda_k \le x}$ | Empirical spectral CDF of $\Psi$ (Eq 4) |
| $H(x)$ | Limit spectral distribution (Assumption 3) |
| $H(x; q)$ | Limit spectral distribution of $\Psi_{1,1}$ (Assumption 5) |
| $\psi_{*,k} = \lim P^{-1} \text{tr}(\Psi^k)$ | $k$-th asymptotic moment of $\Psi$ eigenvalues |
| $\psi_{*,k}(q) = \lim P_1^{-1} \text{tr}(\Psi_{1,1}^k)$ | $k$-th asymptotic moment of $\Psi_{1,1}$ |
| $b_* = \lim \|\beta\|^2 / P$ | $\beta$ scale parameter (Assumption 4) |
| $b_* \psi_{*,1}$ | Predictive power composite |

---

## 10.6 Stieltjes transform + RMT

| 기호 | 의미 |
|------|------|
| $m_\Psi(z) = \int 1/(x - z) dH(x)$ | Limit *population* Stieltjes of $\Psi$ (unobservable) |
| $m(z; c) = \lim P^{-1} \text{tr}((\hat\Psi - zI)^{-1})$ | Limit *empirical* Stieltjes of $\hat\Psi$ |
| $m(-z; c; q)$ | Misspecified version (with $\hat\Psi_{1,1}$) |
| Marchenko-Pastur formula | $\Psi = I$ 의 case 의 $m(-z; c)$ closed form |

---

## 10.7 RMT identity quantities (Propositions 2, 3, 5)

| 기호 | 정의 (trace) | 의미 |
|------|------|------|
| $\xi(z; c)$ | $\lim T^{-1} \text{tr}((zI+\hat\Psi)^{-1}\Psi)$ | Core RMT identity |
| $\xi(z; cq; q)$ | Misspecified version | (Proposition 5) |
| $\nu(z; c)$ | $\lim P^{-1} \text{tr}(\hat\Psi (zI+\hat\Psi)^{-1} \Psi)$ | Expected return building block |
| $\nu'(z; c)$ | $-\lim P^{-1} \text{tr}(\hat\Psi (zI+\hat\Psi)^{-2} \Psi)$ | $\partial \nu / \partial z$ (negative) |
| $\hat\nu(z; c)$ | $\lim P^{-1} \text{tr}(\hat\Psi^2 (zI+\hat\Psi)^{-2} \Psi)$ | Leverage building block |
| $\xi_{2,1}(z; cq; q)$ | $\lim T^{-1} \text{tr}((zI+\hat\Psi_{1,1})^{-1} \Psi_{1,2} \Psi_{1,2}')$ | Cross-correlation (misspec) |
| $\widehat\xi_{2,1}$ | Squared resolvent version | |

---

## 10.8 Portfolio performance limits

| 기호 | 의미 | 식 |
|------|------|------|
| $\mathcal{E}(z; c)$ | OOS expected return limit | $b_* \nu(z; c)$ (correct) |
| $\mathcal{L}(z; c)$ | OOS leverage ($E[\hat\pi^2]$) limit | $b_* \hat\nu - c \nu'$ |
| $\mathcal{V}(z; c)$ | OOS second moment of $R^\pi$ | $2\mathcal{E}^2 + (1 + b_*\psi_{*,1}) \mathcal{L}$ |
| $R^2(z; c)$ | OOS R² limit | $(2\mathcal{E} - \mathcal{L})/(1 + b_*\psi_{*,1})$ |
| $SR(z; c)$ | OOS Sharpe ratio | $\mathcal{E}/\sqrt{\mathcal{V}}$ |
| $MSE(z; c)$ | Mean squared error | $E[R^2] - 2\mathcal{E} + \mathcal{L}$ |
| Infeasible $SR$ | $\beta$ known, $c = 0$ | $1/\sqrt{3 + (b_*\psi_{*,1})^{-1}} < 1/\sqrt 3$ |
| Infeasible $R^2$ | $\beta$ known, $c = 0$ | $b_*\psi_{*,1}/(1 + b_*\psi_{*,1})$ |

---

## 10.9 평가 지표 (실증)

| 약어 | 풀네임 | 의미 |
|------|--------|------|
| $SR$ | Sharpe Ratio | $E[R^\pi]/\sqrt{E[(R^\pi)^2]}$ — uncentered |
| $\alpha$ | Alpha | Excess return after market regression |
| $IR$ | Information Ratio | Alpha / residual std |
| $MSE$ | Mean Squared Error | Forecast error variance |
| $R^2$ | Coefficient of determination | $1 - MSE/Var(R)$ |
| Max Loss | Maximum monthly loss | In SD units |
| Skew | Skewness | Distribution shape |

---

## 10.10 Random Fourier Features (RFF)

| 기호 | 의미 |
|------|------|
| $G_t \in \mathbb{R}^{15}$ | Raw Goyal-Welch predictors |
| $\omega_i \sim N(0, I)$ | iid Gaussian projection vector |
| $\gamma$ | Bandwidth parameter (본 논문: $\gamma = 2$) |
| $S_{i,t} = [\sin(\gamma \omega_i' G_t), \cos(\gamma \omega_i' G_t)]$ | RFF feature pair |
| $P = 2K$ | Number of RFFs (K pairs) |
| 1,000 RFF draws | Monte Carlo averaging |

---

## 10.11 Goyal-Welch 15 predictors

| Code | Full name |
|------|------|
| dfy | Default yield spread |
| infl | Inflation rate |
| svar | Stock variance |
| de | Dividend payout ratio |
| lty | Long-term bond yield |
| tms | Term spread |
| tbl | T-bill rate |
| dfr | Default return |
| dp | Dividend-price ratio |
| dy | Dividend yield |
| ltr | Long-term bond return |
| ep | Earnings-price ratio |
| b/m | Book-to-market |
| ntis | Net equity issuance |
| lag mkt | One-month lagged market return |

---

## 10.12 핵심 정리·정리·가정

| 기호 | 내용 |
|------|------|
| Assumption 1 | $R = S'\beta + \varepsilon$ (single-asset linear DGP) |
| Assumption 2 | $S = \Psi^{1/2} X$ (signal decomposition + moment conditions) |
| Assumption 3 | $F^\Psi \to H$ (eigenvalue distribution converges) |
| Assumption 4 | $\beta$ random, isotropic, $E[\beta\beta'] = P^{-1} b_* I$ |
| Assumption 5 | $H(x; q)$ exists; *sufficiently mixed* if $q$-independent |
| Lemma 1 | $\beta' A \beta \to P^{-1} b_* \text{tr}(A)$ (LLN) |
| Proposition 1 | Infeasible SR $\to 1/\sqrt{3 + 1/(b_*\psi_{*,1})}$ |
| Proposition 2 | $T^{-1} \text{tr}((zI+\hat\Psi)^{-1}\Psi) \to \xi(z; c)$ |
| Proposition 3 | Correctly specified: $\mathcal{E}, \mathcal{L}, R^2$ in $\nu, \nu', \hat\nu$ |
| Proposition 4 | Correctly specified: $\mathcal{V}, SR$, $z_* = c/b_*$ |
| Proposition 5 | Misspecified: all limits |
| Proposition 6 | $\xi_{2,1} = 0$ case의 simplification |
| **Theorem 1** | **Virtue of Complexity** — SR monotone increasing in $q$ with $z_*$ |

---

## 10.13 분야 도구·약어

| 약어 | 풀네임 |
|------|------|
| RMT | Random Matrix Theory |
| OLS | Ordinary Least Squares |
| MSE | Mean Squared Error |
| OOS | Out-of-sample |
| IS | In-sample |
| RFF | Random Fourier Features |
| NN | Neural Network |
| NTK | Neural Tangent Kernel (Jacot-Gabriel-Hongler 2018) |
| GW | Goyal & Welch (2008) |
| CRSP | Center for Research in Security Prices |
| NBER | National Bureau of Economic Research |
| MP | Marchenko-Pastur (1967) |
| LLN | Law of Large Numbers |
| CLT | Central Limit Theorem |

---

## 10.14 점근 행동 표기

| 표기 | 의미 |
|------|------|
| $\xrightarrow{p}$ | Convergence in probability |
| $\xrightarrow{d}$ | Convergence in distribution |
| $\xrightarrow{a.s.}$ | Almost sure convergence |
| $o_p(\cdot)$ | Little-o in probability |
| $O_p(\cdot)$ | Big-O in probability |
| $o(P)$ | $f(P)/P \to 0$ as $P \to \infty$ |
| $P, T \to \infty$, $P/T \to c$ | "Machine learning regime" |
| $T \to \infty$, $P$ fixed | "Traditional asymptotic" |

---

## 10.15 핵심 용어 (개념)

| 용어 | 의미 |
|------|------|
| **Virtue of Complexity** | 복잡한 모델이 단순 모델보다 좋다 (Theorem 1) |
| **Ridgeless** | $z \to 0+$ ridge limit, Moore-Penrose pseudo-inverse |
| **Interpolation boundary** | $P = T$ — model fits data exactly with unique solution |
| **High-complexity regime** | $P > T$, $c > 1$ |
| **Benign overfit** | $P > T$ with zero training error 이지만 OOS 정확 (Bartlett 2020) |
| **Double descent** | $c = 1$ 부근 MSE hump → 양쪽 감소 (Belkin 2019) |
| **Double ascent** | Ridgeless SR 의 $c = 1$ dip → 양쪽 증가 |
| **Permanent ascent** | Optimal-shrinkage SR 의 monotone increasing |
| **Sufficiently mixed** | $H(x; q)$ 가 $q$-independent (Assumption 5) |
| **Correctly specified** | Empirical model = true DGP (Section III) |
| **Misspecified** | Empirical = subset of true DGP (Section IV) |
| **Approximation gain** | Complex model 의 truth 근사 정확도 ↑ |
| **Statistical cost** | Complex model 의 estimator variance ↑ |
| **Long-only at heart** | 음의 position 드물고 작음 (Figure 10) |
| **Risk on / risk off** | Predictor 의 일정 임계 기준 long/cash switch |

---

## 10.16 영어 → 한국어 사전

| 영어 | 한국어 |
|------|--------|
| Return prediction | 수익률 예측 |
| Market timing | 시장 timing (시장 진입/이탈) |
| Ridge regression | 릿지 회귀 |
| Shrinkage | 수축 (penalty) |
| Predictor | 예측 변수 |
| Signal | 신호 |
| Random matrix | 랜덤 행렬 |
| Eigenvalue distribution | 고유값 분포 |
| Stieltjes transform | 스틸체스 변환 |
| Resolvent | 해상도 |
| Misspecification | 모형 오설정 |
| Heavy parameterization | 거대 매개변수화 |
| Sharpe ratio | 샤프 비율 |
| Information ratio | 정보비율 |
| Buy-and-hold | 매수 후 보유 |
| Recession | 침체 |
| Tail risk | 꼬리 위험 |
| Skewness | 왜도 |
| Maximum loss | 최대 손실 |
| Benign overfit | 자비로운 과적합 |
| Universal approximator | 보편 근사자 |
| Random feature | 랜덤 피처 |

---

## 10.17 자주 헷갈리는 표기 주의

- $c$ vs $cq$:
  - $c = P/T$ — **true** DGP complexity.
  - $cq = P_1/T$ — **empirical** complexity (misspecified).
  - $c = 10, q = 0.5$ 면 $cq = 5$ — empirical model 이 true 의 절반.

- $\psi_{*,1}$ vs $\psi_{*,1}(q)$:
  - $\psi_{*,1} = \psi_{*,1}(1)$ — true $\Psi$ 의 first moment.
  - $\psi_{*,1}(q)$ — $\Psi_{1,1}$ 의 first moment ($P_1$ subset).
  - Sufficiently mixed 이면 $\psi_{*,1}(q) = \psi_{*,1}$ for all $q$.

- $m_\Psi$ vs $m(z; c)$:
  - $m_\Psi$ — **true** Stieltjes (unobservable).
  - $m(z; c)$ — **sample** Stieltjes (observable).
  - $c > 0$ 이면 두 함수 다름.

- $z$ vs $z_*$:
  - $z$ — generic ridge shrinkage.
  - $z_*$ — *optimal* shrinkage. Correctly specified: $z_* = c/b_*$.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **모델 complexity 의 3가지 measure 구분?**
2. **본 논문에서 $\psi_{*,k}$ 의 역할?**
3. **Stieltjes transform $m_\Psi$ vs $m(z;c)$ 의 본질적 차이?**

### 답변
1. (i) $P$ — raw predictor 수. (ii) $c = P/T$ — true DGP complexity (limit ratio). (iii) $cq = P_1/T$ — empirical complexity (misspecified case 의 effective). $c$ 는 자연이 결정, $cq$ 는 분석자가 선택 (RFF 의 P 결정으로). Theorem 1 이 *empirical* complexity $q$ ($cq$ 도 동시 증가) 의 monotonicity.
2. $\psi_{*,k} = \lim P^{-1} \text{tr}(\Psi^k)$ — $\Psi$ eigenvalues 의 $k$-th asymptotic moment. 본 논문 결과의 모든 closed-form 식에 등장. 특히 $\psi_{*,1} = \lim P^{-1} \text{tr}(\Psi)$ 가 *infeasible expected return* $b_* \psi_{*,1}$ 의 핵심. $\Psi = I$ calibration 에서는 $\psi_{*,1} = 1$ — single number.
3. $m_\Psi$ 는 *true* eigenvalue 분포의 Stieltjes — unobservable (실제 $\Psi$ 모름). $m(z;c)$ 는 *sample* eigenvalue 분포의 Stieltjes — observable (sample $\hat\Psi$ 의 eigenvalue 로 직접 계산). $c > 0$ 이면 $m \neq m_\Psi$ — sample eigenvalue 가 true 의 *perturbed* version (Marchenko-Pastur). Proposition 2 의 핵심 결과는 모든 portfolio limit 이 **observable $m(-z;c)$ 만 의존** — practical 한 이유.

---

다음 파일 [01_intro.md](01_intro.md) — 본 deep dive 의 시작 챕터 (사전 8 개념 + 가이드).
