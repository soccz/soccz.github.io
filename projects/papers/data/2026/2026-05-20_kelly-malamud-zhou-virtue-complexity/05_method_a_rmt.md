# 05a. Section II — Machine Learning + Random Matrix Theory

> 논문 Section II (p.470–474). Ridge estimator 정의, ridgeless limit, Random Matrix Theory 의 Stieltjes transform, Proposition 2 (모든 limit 이 empirical $m(-z;c)$ 로 결정).

---

## 5a.1 챕터 한 줄 요약

**High-complexity regime ($P/T \to c > 0$) 에서 ridge regression 의 limit 동작은 random matrix theory 의 Stieltjes transform 으로 깔끔히 표현된다. 핵심 단일 quantity 인 empirical Stieltjes $m(-z;c) = \lim P^{-1} \text{tr}((zI + \hat\Psi)^{-1})$ 하나로 모든 R² / expected return / leverage / Sharpe 의 limit 이 도출됨 (Proposition 2). 이게 본 논문 모든 후속 결과의 building block.**

---

## 5a.2 도입 — 왜 RMT 가 필요한가

> **원문 (p.470)**: "The central premise of machine learning is that large data sets can be used in flexible model specifications to improve prediction. This can be understood in the environment above by considering the regime in which the number of predictors, $P$, is large, perhaps even larger than $T$. Our main objective is thus to understand the behavior of optimal timing portfolios as the prediction model becomes increasingly complex, that is, as $P \to \infty$. Because this involves estimating infinite-dimensional parameters, traditional large-$T$ asymptotics do not apply, and hence we instead resort to random matrix theory. In this section, we discuss the ridge estimator and present random matrix theory results at the foundation of our theoretical characterization of high-complexity timing strategies."

**핵심 관점 전환**:
- *Traditional asymptotic*: $T \to \infty$, $P$ fixed. Standard LLN, CLT.
- *Machine learning asymptotic*: $P, T \to \infty$, **$P/T \to c > 0$ 비율 유지**.
- 이 경우 $\hat\Psi - \Psi$ 가 0 으로 수렴 안 함 — traditional 결과 무너짐.
- **Random Matrix Theory (RMT)** — eigenvalue distribution 의 limit theorem 으로 분석.

---

## 5a.3 Section II.A — Least Squares Estimation (Ridge)

> **원문 (p.470)**: "Throughout, we analyze (regularized) least-squares estimators taking the form
>
> $$\hat\beta(z) = \left(zI + T^{-1} \sum_t S_t S_t'\right)^{-1} \frac{1}{T} \sum_t S_t R_{t+1}$$
>
> *for a given ridge shrinkage parameter, $z$. The ridge-regularized form is necessary for characterizing $\hat\beta(z)$ in the high-complexity regime, $P/T \to c > 1$, although we will see that it also has important implications for the behavior of $\hat\beta(z)$ when $P/T < 1$.*"

**핵심 식 (Ridge estimator)**:

$$\hat\beta(z) = \left(zI + \hat\Psi\right)^{-1} \frac{1}{T} \sum_t S_t R_{t+1}, \quad \hat\Psi := T^{-1} \sum_t S_t S_t'$$

**기호 뜻**:
- $\hat\Psi$ — **sample signal covariance matrix** ($P \times P$, sample 이용).
- $z \ge 0$ — ridge shrinkage parameter. $z = 0$ 이면 OLS.
- $(zI + \hat\Psi)^{-1}$ — ridge regularization. $z$ 크면 $\hat\beta$ 가 0 쪽으로 shrink.

**일상 비유**:
OLS $\hat\beta_{OLS} = (\hat\Psi)^{-1} \cdot$ (sample covariance of $S, R$). $\hat\Psi$ 가 singular 에 가까우면 inversion 폭발 → ridge 가 대각선에 $z$ 더해서 stabilize.

학생 점수 평균 추정에서 outlier 1개가 있을 때 약간의 prior (mean 0 쪽으로 shrink) 가 더 좋은 추정량을 주는 것과 같음.

**왜 이 form**:
- *Bias-variance trade-off*: $z > 0$ 이 $\hat\beta$ 의 bias 를 도입 (작은 값 쪽으로) 하지만 variance 를 줄임. 적절한 $z$ 에서 net MSE 감소.
- *Necessary in high-complexity*: $P > T$ 면 $\hat\Psi$ 가 rank $\le T < P$ → singular. ridge 가 invertible 만들어 줌.
- *Useful in low-complexity*: $P < T$ 라도 finite sample $\hat\Psi$ 가 ill-conditioned 가능 → ridge 가 도움.

**조심할 점**:
- $z$ 가 클수록 bias 큼, variance 작음. trade-off.
- $z \to \infty$ 면 $\hat\beta \to 0$ (full shrinkage).
- $z = 0$ + $P < T$ → OLS (regular).
- $z = 0$ + $P > T$ → Moore-Penrose pseudo-inverse → ridgeless.

각주 22: "*One could alternatively analyze 'sparse' least-squares models that combine shrinkage with variable selection (e.g., based on LASSO). First, recent evidence of Giannone, Lenza, and Primiceri (2021) suggests that sparsity of predictive relationships in economics and finance is likely an illusion. Second, our empirical focus is on nonparametric models that seek to approximate a generic nonlinear function as a linear combination of generated features, and sparsity in the generated feature space is difficult to identify (see, for example, Ghorbani et al. (2020)). Third, analysis with $\ell_1$ shrinkage is significantly more taxing from a theoretical standpoint. We thus leave sparse least-squares models to future research.*"

→ **Ridge ($\ell_2$) 선택의 이유**: (i) 경제 데이터의 sparsity 는 illusion (Giannone et al 2021), (ii) generated feature 의 sparsity 어려움, (iii) LASSO ($\ell_1$) 의 이론이 더 복잡.

### OLS 의 결함 (P → T)

> **원문 (p.470)**: "Consider first the OLS estimator, $\hat\beta(0)$. As $P$ approaches $T$ from below, the denominator of the least-squares estimator approaches the singularity. This produces explosive variance of $\hat\beta(0)$ and, in turn, explosive forecast error variance. As $P \to T$, the model begins to fit the data with zero error, so a common interpretation of the explosive variance of $\hat\beta(0)$ is an insidious overfit that does not generalize out-of-sample."

→ $P \to T^-$: OLS 폭발. ridge $z > 0$ 이 막아준다.

### Ridgeless = z → 0+ limit (P > T)

> **원문 (p.471)**: "When $P$ moves beyond $T$, there are more parameters than observations and the least-squares problem has multiple solutions. A particularly interesting solution invokes the Moore-Penrose pseudo-inverse, $(T^{-1} \sum_t S_t S_t')^+ \frac{1}{T} \sum_t S_t R_{t+1}$. This solution is equivalent to the ridge estimator as the shrinkage parameter approaches zero:
>
> $$\hat\beta(0^+) = \lim_{z \to 0^+} \left(zI + T^{-1} \sum_t S_t S_t'\right)^{-1} \frac{1}{T} \sum_t S_t R_{t+1}.$$
>
> The solution $\hat\beta(0^+)$ is often referred to as the 'ridgeless' regression estimator. When $P < T$, OLS is the ridgeless estimator. At $P = T$, there is still a unique least-squares solution, but the model can exactly fit the training data (for this reason, $P = T$ is called the 'interpolation boundary'). When $P > T$, the ridgeless estimator is one of many solutions that exactly fit the training data, but among these, it is the only solution that achieves the *minimum $\ell_2$ norm* $\hat\beta(z)$ (Hastie et al. (2022)). The machine learning literature has recently devoted substantial attention to understanding ridgeless regression in the high-complexity regime. The counterintuitive insight from this literature is that, beyond the interpolation boundary, allowing the model to become *more* complex in fact *regularizes* the behavior of least-squares regression despite using infinitesimal shrinkage. We explore the implications of this idea for market timing in the subsequent sections."

**핵심 정의**:
- **Ridgeless** $\hat\beta(0^+) = $ Moore-Penrose pseudo-inverse solution = $\lim_{z \to 0^+}$ ridge.
- $P > T$: 무수히 많은 zero-training-error solutions. ridgeless 가 그 중 **smallest $\ell_2$ norm**.
- *Interpolation boundary*: $P = T$. 정확히 fit 가능하지만 unique solution.

**핵심 통찰** (counterintuitive):
- $P > T$ 영역에서 *more complex* → *regularizes* (smallest norm solution 이 implicit regularization).
- 이게 benign overfit 의 핵심.

각주 23: "*Recall that the Moore-Penrose pseudo-inverse $A^+$ of a matrix $A$ is defined as $A^+ = \lim_{z \to 0+} (zI + A'A)^{-1} A' = \lim_{z \to 0+} A'(zI + AA')^{-1}$.*"

---

## 5a.4 Section II.B — RMT Connection

> **원문 (p.471)**: "We analyze the $\hat\beta(z)$ behavior and associated market-timing strategies in the limit as $P \to \infty$. This is possible due to a remarkable connection between ridge regression and random matrix theory.
>
> In regression analysis, the sample covariance matrix of signals, $\hat\Psi := T^{-1} \sum_t S_t S_t'$, naturally plays a central role. But no general characterization exists for the behavior of $\hat\Psi$ in the limit as $P, T \to \infty$. However, the tools of random matrix theory characterize one aspect of $\hat\Psi$ — the distribution of its eigenvalues. Fortunately, as we show, the prediction and portfolio performance properties of least-squares estimators rely only on the eigenvalue distribution of $\hat\Psi$. Thus, random matrix theory facilitates a rich understanding of machine learning portfolios."

**핵심**:
- RMT 가 모든 $\hat\Psi$ 의 동작 (matrix 전체) 을 알려주진 않음.
- 하지만 *eigenvalue distribution* (스칼라 분포) 은 정확히 알려줌.
- Lucky: portfolio 성능이 **eigenvalue distribution 만 의존**.

---

## 5a.5 Stieltjes Transform — 핵심 도구

> **원문 (p.472)**: "Here, we elaborate on the core results from the random matrix theory that we build upon.
>
> First, to understand the central role of $\hat\Psi$'s eigenvalue distribution in determining the limiting behavior of the least-squares estimator, suppose for the moment that we could replace $\hat\Psi$ with its true unobservable signal covariance, $\Psi$. For any symmetric matrix $\Psi$, a convenient matrix identity states that
>
> $$\frac{1}{P} \text{tr}((\Psi - zI)^{-1}) = \frac{1}{P} \sum_{i=1}^{P} (\lambda_i(\Psi) - z)^{-1},$$
>
> where $\lambda_i(\Psi)$ are the eigenvalues of $\Psi$. Using formula (4), we can rewrite this identity as
>
> $$\frac{1}{P} \text{tr}((\Psi - zI)^{-1}) = \int \frac{1}{x - z} dF^\Psi(x), \quad z < 0.$$"

**기호 뜻**:
- $\text{tr}((\Psi - zI)^{-1})$ — *resolvent* (변형 행렬의 trace).
- $(\Psi - zI)^{-1} = \sum_i (1/(\lambda_i - z)) v_i v_i'$ — eigendecomposition.
- $\int \frac{1}{x-z} dF^\Psi(x)$ — *spectral integral* (eigenvalue distribution 적분).

**일상 비유**:
$P$ 개 eigenvalue 들의 $1/(λ_i - z)$ 평균. 이게 **Stieltjes transform** — eigenvalue distribution 을 단일 함수로 압축.

**왜 이 form**:
- Matrix inversion 의 trace 가 eigenvalue 의 단순 합 (linearity of trace + spectral decomposition).
- $z$ negative 면 $(λ - z) > 0$ 이므로 $1/(λ-z)$ 발산 X.

### Stieltjes transform 정의 (Equation 9)

> **원문 (p.472)**: "From this identity, we immediately see the fundamental connection between ridge regularization and the distribution of eigenvalues for $\Psi$. The right-hand side is the *Stieltjes transform* of the eigenvalue distribution of $\Psi$, denoted $F^\Psi$. By Assumption 3, this distribution is well behaved when $P \to \infty$ and converges to a nonrandom distribution $H$. We therefore have
>
> $$m_\Psi(z) := \int \frac{1}{x - z} dH(x) = \lim_{P \to \infty} \frac{1}{P} \text{tr}((\Psi - zI)^{-1}). \quad (9)$$"

**핵심 정의**:

$$\boxed{m_\Psi(z) = \int \frac{1}{x - z} dH(x) = \lim_{P \to \infty} \frac{1}{P} \text{tr}((\Psi - zI)^{-1})}$$

**기호 뜻**:
- $m_\Psi: \mathbb{C} \setminus \mathbb{R}_+ \to \mathbb{C}$ — limiting Stieltjes transform of $\Psi$ eigenvalues.
- $H$ — limit distribution (Assumption 3).
- Argument $z$ 는 보통 negative real 또는 complex with positive imaginary.

**의미**:
- $m_\Psi(z)$ 가 $H$ 를 unique 하게 결정 (Stieltjes inversion formula).
- $\Psi$ 의 모든 spectral 정보를 **한 함수** 로 요약.

**일상 비유**:
신문지의 모든 인쇄정보를 디지털 압축 (zip 파일) 하는 것과 비슷. eigenvalue 무한히 많지만 $m_\Psi$ 한 함수로 다 표현.

### 문제: 우리는 $\Psi$ 를 모름 — $\hat\Psi$ 만 관측

> **원문 (p.472)**: "The function $m_\Psi(z)$ is the *limiting* Stieltjes transform of the eigenvalue distribution of $\Psi$. Equation (9) is a powerful step toward understanding the least-squares estimator in the machine learning regime (and hence machine learning predictions and portfolios). It states that key properties of the limiting inverse of the ridge-regularized signal covariance matrix can be characterized entirely if we know $\Psi$'s eigenvalue distribution.
>
> The problem, of course, is that the true $\Psi$ is unobservable. We only observe its sample counterpart, $\hat\Psi$, and thus, we only have empirical access to the Stieltjes transform of $\hat\Psi$'s eigenvalues. The empirical counterpart to the unobservable $m_\Psi(z)$ is
>
> $$m(z; c) := \lim_{P \to \infty} \frac{1}{P} \text{tr}((\hat\Psi - zI)^{-1}).$$"

**두 Stieltjes transform**:
- $m_\Psi(z)$ — **population** Stieltjes (unobservable, 진짜 $\Psi$).
- $m(z; c)$ — **empirical** Stieltjes (observable, sample $\hat\Psi$, depends on complexity $c$).

**조심할 점**:
- $m_\Psi(z) \neq m(z; c)$ in general. $c > 0$ 이면 sample $\hat\Psi$ 의 eigenvalue 가 true $\Psi$ 의 eigenvalue 와 systematically 다름 (RMT 의 핵심 발견).

### Marchenko-Pastur identity

> **원문 (p.472)**: "In traditional finite $P$ statistics, we would have a convergence between the sample covariance $\hat\Psi$ and the true covariance $\Psi$ as $T \to \infty$. One might be tempted to think that $\lim_{P \to \infty} \frac{1}{P} \text{tr}((\hat\Psi - zI)^{-1})$ and $\lim_{P \to \infty} \frac{1}{P} \text{tr}((\Psi - zI)^{-1})$ also converge as $T \to \infty$. But this is not the case. The limiting eigenvalue distributions of $\hat\Psi$ and $\Psi$ remain divergent in the limit as $T \to \infty$ if $P/T \to c > 0$. Here, we see a first glimpse of the complexity of machine learning and how random matrix theory can help us understand it. In the Internet Appendix (see Theorem 2), we show that $m(-z; c)$ can be computed from $m_\Psi(-z)$ using results of Silverstein and Bai (1995) and Bai and Zhou (2008). In particular, $m(-z; c) > m(-z; 0) = m_\Psi(-z)$ for all $c > 0$.²⁴"

**핵심 발견** (RMT 의 비직관):
- Standard intuition: $\hat\Psi \to \Psi$ as $T \to \infty$, so spectra match.
- **RMT reality**: $P, T \to \infty$, $P/T \to c > 0$ 이면 spectra **systematically divergent**.
- $m(-z; c) > m(-z; 0) = m_\Psi(-z)$ — empirical Stieltjes 가 population 보다 큼 (negative argument 기준).

각주 24 (각주 자체가 굵직): "*Theorem 2 in the Internet Appendix is a generalized version of the Marčenko and Pastur (1967) theorem that accommodates non-i.i.d. $S_t$. When signals are i.i.d. with $\Psi = I$ and $m_\Psi(z) = (1 - z)^{-1}$, Marčenko and Pastur (1967) show that
$$m(-z; c) = \frac{-((1-c) + z) + \sqrt{((1-c) + z)^2 + 4cz}}{2cz}.$$
By direct calculation, the expression above is indeed the unique positive solution to (IA4) when $m_\Psi(z) = (1-z)^{-1}$. While the eigenvalue distributions of the sample and true covariance matrices do not coincide, Theorem 2 describes the precise nonlinear way they relate to each other. In particular, when $P > T$, the matrix $\hat\Psi$ has $P - T$ zero eigenvalues and therefore, $P^{-1} \text{tr}((zI + \hat\Psi)^{-1})$ contains a singular part, $P^{-1}(P - T)z^{-1} = (1 - c^{-1}) z^{-1}$.*"

→ **Marchenko-Pastur 정리** (1967) 의 정량적 형태 (i.i.d. signals + $\Psi = I$):

$$m_{MP}(-z; c) = \frac{-((1-c) + z) + \sqrt{((1-c) + z)^2 + 4cz}}{2cz}$$

이게 본 논문 분석의 building block. $\Psi = I$ + iid signals 의 가장 단순한 case 의 closed form.

$P > T$ ($c > 1$) 이면 $\hat\Psi$ 는 $P - T$ 개의 zero eigenvalue 가짐 — singular part $(1 - 1/c) z^{-1}$ 발생.

```viz:rppca-mp-spectrum:title=Marchenko-Pastur 분포 (RMT 의 출발점),caption=Ψ = I, iid signals 의 sample eigenvalue 분포. c = P/T 슬라이더로 spectrum 변화. c < 1: bulk + spike. c = 1: 가장 spread. c > 1: P-T 개의 zero eigenvalue + bulk. 본 논문의 모든 분석의 foundation 인 RMT distribution.
```

---

## 5a.6 Proposition 2 — 모든 limit 이 empirical Stieltjes 로 결정

> **원문 (p.473)**: "The next result shows that, remarkably, if we constrain ourselves to linear ridge regression estimators, all asymptotic expressions depend only on $m(z; c)$ and do not require $m_\Psi$.²⁵
>
> **PROPOSITION 2**: *We have*
>
> $$\lim_{T \to \infty} \frac{1}{T} \text{tr}((zI + \hat\Psi)^{-1} \Psi) \to \xi(z; c) \quad (10)$$
>
> *almost surely, where*
>
> $$\xi(z; c) = \frac{1 - z m(-z; c)}{c^{-1} - 1 + z m(-z; c)}.$$
>
> *The quantity $\text{tr} E[(zI + \hat\Psi)^{-1} \Psi]$ appears in virtually every expression we analyze to describe portfolio behavior. It depends on the interaction between the sample and true signal covariance matrix and arises in the computation of both the expected return and leverage of the timing strategy (see equation (8)). One might imagine, therefore, that we need to know the limiting eigenvalue distribution of both matrices (or their Stieltjes transforms, $m$ and $m_\Psi$) to compute $\text{tr} E[(zI + \hat\Psi)^{-1} \Psi]$. Proposition 2 shows that this is not the case—we only need to know the empirical version, $m(-z; c)$. This is a powerful result. It will allow us to quantify the expected out-of-sample behavior of machine learning portfolios based only on the eigenvalue distribution of the sample signal covariance $\hat\Psi$ (which is observable) without requiring that we know the eigenvalues of $\Psi$.*²⁶"

**핵심 정리**:

$$\boxed{\xi(z; c) := \lim_{T \to \infty} T^{-1} \text{tr}((zI + \hat\Psi)^{-1} \Psi) = \frac{1 - z m(-z; c)}{c^{-1} - 1 + z m(-z; c)}}$$

**기호 뜻**:
- $\xi(z; c)$ — RMT identity 의 핵심 quantity. **expected return + leverage** 양쪽 식에 모두 등장.
- $m(-z; c)$ — empirical Stieltjes evaluated at $-z$. observable 함수.
- $c$ — complexity ratio $P/T$.

**일상 비유**:
"내가 *진짜* $\Psi$ 를 보지 않고 *sample* $\hat\Psi$ 만 봐도, portfolio 의 모든 limit 을 단일 함수 $m(-z; c)$ 로 계산 가능". 마치 X-ray 안 찍고 청진기만으로 정확한 진단.

**왜 이 form**:
- Stieltjes 와 trace 의 algebra. 자세한 증명은 Internet Appendix (Theorem 1A).
- $\Psi$ 와 $\hat\Psi$ 가 systematic 한 관계 (Marchenko-Pastur generalization) — 그 관계가 정확히 $\xi$ 의 form 으로 나타남.

**조심할 점**:
- $c = 0$ 의 limit: $\xi(z; 0) = (1 - z m_\Psi(-z))/(0 + z m_\Psi(-z)) \to \infty/0$ — careful with limit (standard $T \to \infty$ asymptotic).
- $\xi(z; c)$ 가 $c, z$ 의 함수 — 두 parameter 로 indexed.

각주 25: "*It is possible to develop nonlinear shrinkage estimators analogous to those developed by Ledoit and Wolf (2020) for covariance matrices. Such estimators would require knowledge of the true eigenvalue distribution of $\Psi$, which can be recovered from $m(z; c)$ using equation (IA4).*"

각주 26: "*Heuristically, $E[\hat\Psi] = \Psi$ and hence $\text{tr} E[(zI + \hat\Psi)^{-1} \Psi] \approx \text{tr} E[(zI + \hat\Psi)^{-1} \hat\Psi]$. However, random matrix corrections make the true relationship nonlinear.*"

---

## 5a.7 Model complexity $c$ 의 역할

> **원문 (p.473)**: "We refer to the constant $c$ as 'model complexity,' which (as the preceding results show) plays a critical role in understanding model behavior. It describes the limiting ratio of predictors to data points: $P/T \to c$. When $T$ grows at a faster rate than the number of predictors (i.e., $c \to 0$), the limiting eigenvalue distributions of $\hat\Psi$ and $\Psi$ converge: $m(-z; c) \to m_\Psi(-z)$. As $c$ becomes positive, these distributions fail to converge, and their divergence is wider for larger $c$. It is, therefore, clear that the behavior of the least-squares estimator in the machine learning regime will differ from the true coefficient, even when $T \to \infty$, as long as $c > 0$. As a result, machine learning portfolios will suffer relative to the infeasible performance in Proposition 1 despite abundant data. However, while machine learning portfolios underperform the infeasible strategy, they can continue to generate substantial trading gains. This is true even in the ridgeless case. Additional ridge shrinkage can boost performance even further. We precisely characterize these behaviors in the following sections."

**핵심 메시지**:

| $c$ 값 | Spectra 관계 | OOS 성능 |
|--------|------------|----------|
| $c \to 0$ | $m(-z;c) \to m_\Psi(-z)$ (수렴) | infeasible $\hat\beta = \beta$ 에 수렴 |
| $c > 0$ | $m(-z;c) \neq m_\Psi(-z)$ (발산) | infeasible 보다 성능 저하 |
| $c \to \infty$ | spectra 완전 발산 | ridgeless 가 implicit regularization 으로 작동 |

→ **$c$ 는 본 논문의 핵심 분석 변수**. portfolio 성능을 $c$ 의 함수로 plot 하는 "VoC curves" 가 모든 시뮬·실증의 표준.

---

## 5a.8 한 그림으로

```
True coefficient & covariance         Sample observation
  Ψ (P × P, unknown)                    Ŝ = T^{-1} Σ S_t S_t' (P × P)
        ↓                                       ↓
  eigenvalues → F^Ψ → H               eigenvalues → F^Ŝ → ?
  (Assumption 3)                       (depends on c = P/T)
        ↓                                       ↓
  m_Ψ(z) = ∫ 1/(x-z) dH(x)           m(z; c) = lim P^{-1} tr((Ŝ - zI)^{-1})
  (population Stieltjes)               (empirical Stieltjes — observable!)
        ↓                                       ↓
        +───── Marchenko-Pastur ──────+
        |  Theorem 2 (Internet App)
        |  m(-z; c) > m_Ψ(-z)  for c > 0
        |  if Ψ=I, c.f.:
        |  m(-z;c) = ((1-c)+z + √(...)) / (2cz)
        ↓
                Proposition 2
   ξ(z; c) = lim T^{-1} tr((zI + Ŝ)^{-1} Ψ)
          = (1 - z m(-z;c)) / (c^{-1} - 1 + z m(-z;c))
                              ↓
                   ALL portfolio limits (R², SR, expected return, leverage)
                   depend ONLY on m(-z; c) — observable!
```

이 framework 가 Sections III, IV 의 모든 후속 Proposition (3, 4, 5, 6) + Theorem 1 의 토대.

---

## 5a.9 RMT 개념 정리 (무배경 독자용)

**Q1: Stieltjes transform 이 왜 spectral 정보를 다 담는가?**
A: $m(z) = \int 1/(x-z) dF(x)$ 가 $F$ 를 unique 하게 결정 (Stieltjes inversion). 즉 $m$ 함수 하나만 알면 $F$ 도 알 수 있음.

**Q2: Marchenko-Pastur 가 뭔가?**
A: 1967년 두 우크라이나 수학자가 증명한 RMT 의 핵심 정리. iid normal 잡음 행렬 $X$ 의 sample covariance $T^{-1} X'X$ 의 eigenvalue 가 $T \to \infty, P/T = c$ 에서 specific distribution (MP distribution) 로 수렴. RMT 의 출발점.

**Q3: $m(-z; c) > m_\Psi(-z)$ 의 직관?**
A: sample $\hat\Psi$ 의 eigenvalue 는 true $\Psi$ 의 eigenvalue 보다 **spread out**. $c > 0$ 이면 small eigenvalue 가 0 쪽으로, large eigenvalue 가 더 큰 쪽으로 perturbed. resolvent $(\hat\Psi - zI)^{-1}$ 의 trace 가 (negative $z$ 기준) 더 큼 — 작은 eigenvalue 의 contribution 이 더 크기 때문.

**Q4: 본 논문이 RMT 를 빌리는 이유?**
A: $P, T \to \infty, P/T \to c$ 의 limit 에서 traditional LLN 안 됨. $\hat\Psi \to \Psi$ in operator norm 보장 안 됨. 그러나 **eigenvalue distribution** 은 nonrandom limit 갖음 (RMT). portfolio 성능이 distribution 만 의존 → RMT 가 답.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Ridgeless regression 의 정확한 정의는?**
2. **Stieltjes transform 의 의미와 $m_\Psi$ vs $m$ 의 차이?**
3. **Proposition 2 의 의의?**

### 답변
1. **$\hat\beta(0^+) = \lim_{z \to 0^+} (zI + \hat\Psi)^{-1} T^{-1} \sum_t S_t R_{t+1}$**. $P > T$ 에서 Moore-Penrose pseudo-inverse 와 같음. 무수히 많은 zero-training-error 해 중 **smallest $\ell_2$ norm** 해. 학습 데이터에 완전 fit 하지만 implicit regularization (small norm) 으로 OOS 성능 보유 → benign overfit.
2. Stieltjes transform $m(z) = \int 1/(x-z) dF(x)$ 가 eigenvalue distribution $F$ 를 unique 하게 결정 (단일 함수로 spectral 정보 압축). $m_\Psi(z)$ 는 *population* (true $\Psi$, unobservable), $m(z;c)$ 는 *empirical* (sample $\hat\Psi$, observable, $c = P/T$ 의존). $c > 0$ 이면 $m_\Psi \neq m$ — 즉 sample 이 true 의 perturbed version.
3. **Proposition 2**: portfolio 의 모든 핵심 limit 이 $\xi(z;c) = (1 - z m(-z;c))/(c^{-1} - 1 + z m(-z;c))$ 라는 단일 함수로 결정되며, 이 함수가 **empirical** $m(-z;c)$ 만으로 표현됨. 즉 unobservable $m_\Psi$ 가 필요 없음. 이게 본 논문 분석이 *practical* 한 이유 — 실제 데이터에서 $m(-z;c)$ 는 sample $\hat\Psi$ 의 eigenvalue 로 직접 계산 가능.

---

다음 파일 [05_method_b_correct.md](05_method_b_correct.md) — Section III (Correctly Specified Models) 의 Proposition 3, 4 (R², 기대수익, leverage, Sharpe ratio) 풀이.
