# 05b. Section III — Correctly Specified Models

> 논문 Section III (p.474–481). Propositions 3·4 — correctly specified DGP 환경의 R², 기대수익, leverage, Sharpe ratio limit. Figures 1–3 의 이론적 곡선이 여기서 도출.

---

## 5b.1 챕터 한 줄 요약

**True DGP 의 모든 P signal 을 empirical model 이 정확히 capture 하는 (correctly specified) 환경에서: (i) OOS $R^2$ 와 Sharpe ratio 가 $c \to 1$ 부근에서 발산 (interpolation boundary catastrophe), (ii) $c > 1$ ridgeless 가 다시 양수 회복 (benign overfit), (iii) 모든 $c$ 에서 **ridgeless Sharpe ratio 가 양수**, (iv) optimal shrinkage $z_* = c/b_*$ 가 모든 $z, c$ 에서 최고 SR.**

---

## 5b.2 도입

> **원문 (p.474)**: "In this section, we analyze correctly specified models. We present the theoretical characterizations of machine learning models in terms of prediction accuracy and portfolio performance. We then illustrate their behavior in a calibrated theoretical setting."

→ Correctly specified = **empirical model 의 P signals 가 true DGP 의 모든 P signals 를 capture**. 비현실적이지만 분석의 출발점 (Section IV 가 일반화).

---

## 5b.3 Section III.A — Expected Out-of-Sample R²

### MSE limit (Equation 11)

> **원문 (p.474)**: "To understand a model's prediction accuracy in the high-complexity regime, we study its limiting MSE, defined as
>
> $$MSE(z; c) = \lim_{T, P \to \infty, P/T \to c} E[(R_{t+1} - S_t' \hat\beta(z))^2 | \hat\beta(z)]. \quad (11)$$
>
> Notably, while $\hat\beta(z)$ is random and depends on the sample realization, we show below that the limit in (11) is nonrandom. The arguments $z$ and $c$ are central to understanding the limiting predictive ability of least squares. Respectively, they describe the extent of ridge shrinkage and the complexity of the DGP (and thus of the correctly specified model)."

**기호 뜻**:
- $MSE(z; c)$ — OOS Mean Squared Error 의 limit (deterministic).
- $\hat\beta(z)$ — ridge estimator with shrinkage $z$.
- $c$ — model complexity $P/T$.

**왜 deterministic limit**:
- 비록 $\hat\beta(z)$ 는 random, $P \to \infty$ LLN (Lemma 1 + RMT) 으로 limit 이 nonrandom 으로 수렴.

### Out-of-sample R² 정의

> **원문 (p.474)**: "In finance and economics, it is common to state predictive performance in terms of $R^2$ rather than MSE. We denote the limiting out-of-sample $R^2$ as
>
> $$R^2(z; c) = 1 - \frac{MSE(z; c)}{\lim_{T, P \to \infty} E[R_{t+1}^2]},$$
>
> where $E[R_{t+1}^2]$ is the null MSE when $\beta = 0$."

**기호 뜻**:
- $R^2(z; c)$ — OOS R² limit.
- 분모 = "no prediction" baseline MSE.

→ $R^2 > 0$: 모델이 baseline (mean=0) 보다 낫다. $R^2 < 0$: 모델이 baseline 보다 나쁘다.

### Infeasible benchmark R²

> **원문 (p.474)**: "In Section I.C above, we discuss the infeasible maximum $R^2$, or
>
> $$R^2(0; 0) = \frac{b_* \psi_{*,1}}{1 + b_* \psi_{*,1}}.$$
>
> This corresponds to a data-rich environment ($c = 0$, so observations vastly outnumber parameters) and OLS regression ($z = 0$). The $R^2(0; 0)$ is the benchmark for evaluating the loss of predictive accuracy due to high model complexity, even when data are abundant."

→ $R^2(0;0)$ = OLS + infinite data 의 *maximum possible* R² — 이게 benchmark.

---

## 5b.4 Proposition 3 — R² / 기대수익 / leverage

### Proposition 3 stmt

> **원문 (p.474)**: "Specifically, the $R^2$ of the least-squares estimator in the machine learning regime behaves as follows.
>
> **PROPOSITION 3**: *In the limit as $T, P \to \infty$, and $P/T \to c$, we have*
>
> $$\begin{aligned}
\mathcal{E}(z; c) &:= \lim E[\hat\pi_t R_{t+1} | \hat\beta(z)] = b_* \nu(z; c), \\
\mathcal{L}(z; c) &:= \lim E[\hat\pi_t^2 | \hat\beta(z)] = b_* \hat\nu(z; c) - c \nu'(z; c), \\
R^2(z; c) &= \frac{2 \mathcal{E}(z; c) - \mathcal{L}(z; c)}{1 + b_* \psi_{*,1}},
\end{aligned} \quad (12)$$
>
> *where*
>
> $$\nu(z; c) = \psi_{*,1} - c^{-1} z \xi(z; c) \quad = \lim P^{-1} \text{tr}(\hat\Psi (zI + \hat\Psi)^{-1} \Psi) > 0,$$
>
> $$\nu'(z; c) = -c^{-1}(\xi(z; c) + z \xi'(z; c)) = -\lim P^{-1} \text{tr}(\hat\Psi(zI + \hat\Psi)^{-2} \Psi) < 0,$$
>
> $$\hat\nu(z; c) = \nu(z; c) + z \nu'(z; c) = \lim P^{-1} \text{tr}(\hat\Psi^2 (zI + \hat\Psi)^{-2} \Psi) > 0.$$
>
> *As we show in the Internet Appendix, these limits exist in probability.*"

**핵심 quantities (defined)**:

| 기호 | 정의 (trace form) | 의미 |
|------|------------------|------|
| $\nu(z; c)$ | $\lim P^{-1} \text{tr}(\hat\Psi (zI + \hat\Psi)^{-1} \Psi)$ | 양수. expected return 의 building block |
| $\nu'(z; c)$ | $-\lim P^{-1} \text{tr}(\hat\Psi (zI + \hat\Psi)^{-2} \Psi)$ | 음수. derivative info |
| $\hat\nu(z; c)$ | $\lim P^{-1} \text{tr}(\hat\Psi^2 (zI + \hat\Psi)^{-2} \Psi)$ | 양수. leverage building block |
| $\xi(z; c)$ | (Proposition 2) | RMT identity |

**기호 뜻**:
- $\mathcal{E}(z; c)$ — **Expected return** of timing strategy (limit).
- $\mathcal{L}(z; c)$ — **Leverage** ($E[\hat\pi^2]$) of timing strategy.
- $\nu(z; c)$ — eigenvalue-weighted resolvent.
- $\nu'(z; c) < 0$ — derivative in $z$. negative.
- $\hat\nu(z; c)$ — squared resolvent.

**일상 비유**:
ridge regression 의 OOS 동작이 **3개 trace quantity** ($\nu$, $\nu'$, $\hat\nu$) 로 분해된다. 이들은 모두 sample $\hat\Psi$ 의 eigenvalue 분포 함수 — observable. 더 핵심적으로 모두 $m(-z; c)$ 로 표현 가능 (Proposition 2 의 일관성).

**왜 이 form**:
- $\hat\pi = \hat\beta' S$, $\hat\beta = (zI + \hat\Psi)^{-1} T^{-1} \sum S_t R_{t+1}$. 
- $E[\hat\pi R | \hat\beta] = \hat\beta' \Psi \beta$ (Lemma 1 적용으로 $\beta'\Psi\hat\beta \to b_* P^{-1} \text{tr}(\Psi \hat\beta'$ 같은 form).
- 자세한 algebra 는 Internet Appendix.

**조심할 점**:
- $\nu, \nu', \hat\nu$ 는 함수 form 으로 $c, z$ 에 따라 다름. Closed form 가능 (Marchenko-Pastur case).
- $b_*$ (true $\beta$ scale) 와 $\psi_{*,1}$ (true $\Psi$ scale) 가 결과에 들어감.

### Optimal shrinkage $z_*$

> **원문 (p.475)**: "Furthermore, $R^2(z; c)$ is monotone increasing in $z$ for $z < z_* = c/b_*$, and decreasing in $z$ for $z > z_*$. The $R^2(z; c)$ attains its maximum at $z_* = c/b_*$, where it is positive and given by
>
> $$R^2(z_*; c) = R^2(0; 0) - \frac{\xi(z_*; c)}{1 + b_* \psi_{*,1}} = \frac{b_* \nu(z_*; c)}{1 + b_* \psi_{*,1}} > 0.$$"

**Optimal shrinkage**:

$$\boxed{z_* = c / b_*}$$

→ 복잡할수록 ($c$ 큼) heavier shrinkage 필요. true $\beta$ scale ($b_*$) 가 크면 lighter shrinkage.

### Ridgeless limit (Equation 13)

> **원문 (p.475)**: "In the ridgeless limit, assuming $H(0+) = 0$, we have
>
> $$R^2(0; c) = R^2(0; 0) - (1 + b_* \psi_{*,1})^{-1} \begin{cases} (c^{-1} - 1)^{-1}, & c < 1 \\ \mu(c), & c > 1 \end{cases} \quad (13)$$
>
> for some $\mu(c) > 0$, $\mu(1+) = +\infty$. Lastly, we have
>
> $$\lim_{c \to \infty} R^2(0; c) = 0 > \lim_{c \to 1} R^2(0; c) = -\infty. \quad (14)$$"

**핵심 패턴** (ridgeless):

| $c$ 영역 | Behavior |
|---------|----------|
| $c \to 0$ | $R^2(0; c) \to R^2(0; 0)$ (best) |
| $c < 1$ | $R^2(0; c)$ 감소 in $c$ |
| $c \to 1^-$ | $R^2(0; c) \to -\infty$ ★ |
| $c \to 1^+$ | $R^2(0; c) \to -\infty$ ★ |
| $c > 1$ | $R^2(0; c)$ 회복 |
| $c \to \infty$ | $R^2(0; c) \to 0$ |

→ **interpolation boundary catastrophe** at $c = 1$. ridgeless 가 $c=1$ 양쪽에서 발산.

### Section 본문 의의

> **원문 (p.475)**: "When the prediction model is complex ($c > 0$), the limiting eigenvalues of $\hat\Psi$ and $\Psi$ diverge, and this unambiguously reduces the predictive $R^2$ relative to the infeasible best, $R^2(0; 0)$. Intuitively, because the frictionless $R^2(0; 0)$ is fixed, as $c$ increases, the investor must learn the same amount of predictability but spread across many sources, and this dimensionality expansion hinders statistical inference. The degradation in predictive accuracy due to complexity can be so severe that expected out-of-sample $R^2$ becomes extremely negative, particularly in the ridgeless case. Shrinkage can mitigate this and help preserve accuracy amid complexity. Shrinkage controls variance but introduces bias. Proposition 3 points out that the amount of shrinkage that optimizes the bias-variance trade-off is $z_* = c/b_*$. More complex settings benefit from heavier shrinkage, while settings with a higher signal-to-noise ratio (higher $b_*$) benefit from lighter shrinkage (see, for example, Hastie et al. (2022))."

**핵심 통찰**:
- $c > 0$: $R^2$ 가 ${R^2(0; 0)}$ 에서 unambiguously 감소 (degradation due to dispersed predictability).
- ridgeless 에서 $R^2$ 가 극단적으로 음수 (특히 $c \approx 1$).
- Shrinkage 가 bias-variance trade-off 의 optimum 으로 mitigate.
- $z_* = c/b_*$ — heavier complexity → heavier shrinkage; higher SNR → lighter shrinkage.

각주 27 (각주 깊이): "*Note that the optimal shrinkage must be inferred from an estimate of $b_*$. Our theoretical and empirical results indicate a general insensitivity of prediction and timing-strategy performance to the choice of $z$ in the high-complexity regime. As a result, simple shrinkage selection methods like cross-validation tend to perform well.*"

→ practical: cross-validation 으로 $z$ 결정 권장.

---

## 5b.5 Figure 1 — R² and ‖β̂‖ as function of $c$

![Figure 1 — Expected out-of-sample R² + norm of least-squares coefficient](figures/page18_Fig1_R2_norm.png)

*원문 p.476 Figure 1 발췌 — calibrated with Ψ = I, $b_* = 0.2$. Left panel: $R^2$ as function of $c$ for various $z \in \{10^{-2}, 10^{-1}, 1, 10, 50\}$ + ridgeless (black). Right panel: $\|\hat\beta\|$ norm. Ridgeless catastrophe at $c = 1$ (R² 발산, $\|\hat\beta\|$ spike). $c > 1$ 에서 ridgeless 회복 (benign overfit).*

> **원문 (p.476)**: "Figure 1 illustrates the theoretical behavior of the least-squares estimator derived in Proposition 3. The plots set $\Psi$ to the identity matrix and fix $b_* = 0.2$ (recall that $\sigma^2$ is normalized to one). The left panel draws the expected out-of-sample $R^2$ as a function of model complexity $c$ (shown on the $x$-axis) and ridge penalty $z$ (different curves). In this calibration, the infeasible maximum predictive $R^2$ (that uses the true parameter values) is the dotted red line and provides a reference point. Throughout the paper, we refer to plots like these, which describe the model's performance as a function of model complexity, as 'VoC curves.'"

**"VoC curves"** 의 정의: 모델 성능을 $c$ 의 함수로 plot 한 곡선.

### Ridgeless 의 catastrophe + 회복

> **원문 (p.476)**: "The black line shows the $R^2$ in the ridgeless limit. When $c \le 1$, the ridgeless limit corresponds to exactly $z = 0$ (i.e., OLS). On this side of $c = 1$, predictive accuracy deteriorates rapidly as model complexity increases. This captures the well-known property that OLS suffers when the number of predictors is large relative to the number of data points. As $c \to 1$, the denominator of the OLS estimator approaches the singularity, and the expected out-of-sample $R^2$ dives.
>
> To the right of $c = 1$, the number of predictors exceeds the sample size, and the 'ridgeless' case is defined as the limit as $z \to 0$ (i.e., when the least-squares denominator is calculated via the pseudo-inverse of $\hat\Psi$). Counterintuitively, the $R^2$ begins to *rise* as model complexity increases.²⁸ The reason is that, while there are many equivalent $\beta$ solutions that exactly fit the training data when $c > 1$,²⁹ ridgeless regression selects the solution with the smallest norm. As complexity increases, there are more solutions for ridgeless regression to search over, and thus it can find smaller and smaller betas that still exactly fit the training data. This acts as shrinkage, biasing the beta estimate toward zero. Due to this bias, the forecast variance drops, improving the $R^2$. In other words, despite $z \to 0$, the ridgeless solution still regularizes the least-squares estimator, and more so, the larger is $c$. This property of ridgeless least squares is a newly documented phenomenon in the statistics literature and an emerging topic of research.³⁰ It shows that even in very simple DGPs, one may be able to improve the accuracy of return forecasts by pushing model dimensionality well beyond sample size."

**핵심 통찰** (ridgeless 의 implicit regularization):
- $c > 1$: 무한히 많은 zero-training-error 해 중 **smallest norm** 해를 선택.
- $c$ 클수록 더 많은 해 → 더 작은 norm 가능 → forecast variance 감소 → $R^2$ 상승.
- 이게 **benign overfit / double descent** 현상의 통계학적 메커니즘.

각주 28: "*This is an illustration of what the statistics literature refers to as benign overfitting.*"

각주 29: "*That is, $\beta' S_t = R_{t+1}$ for all $t \in [1, \ldots, T]$.*"

각주 30: "*See Spigler et al. (2019), Belkin et al. (2019), Belkin, Rakhlin, and Tsybakov (2019), Belkin, Hsu, and Xu (2020), and Hastie et al. (2022).*"

### Ridge 의 효과

> **원문 (p.477)**: "The remaining curves in Figure 1 show how the out-of-sample $R^2$ is affected by nontrivial ridge shrinkage. Allowing $z > 0$ improves $R^2$ except at very low levels of complexity. This is again a manifestation of the bias-variance trade-off. When $z > 0$, the norm of $\hat\beta$ is controlled, and the associated variance reduction outweighs the effects of bias when the model is complex."

→ ridge $z > 0$ 가 거의 모든 $c$ 에서 ridgeless 보다 좋음. 특히 $c \approx 1$ 부근에서 큰 차이.

### Right panel: ‖β̂‖

→ Right panel: $\|\hat\beta\|$ 가 $c \to 1$ 부근에서 spike (~5+ orders of magnitude). $c > 1$ 에서는 norm 이 감소 (smallest-norm solution).

### 본 논문의 기여 (Hastie et al 과 비교)

> **원문 (p.477)**: "It is useful to place our analysis thus far in the context of the literature. Some formulas of Propositions 2 and 3 have been established in papers on random matrix theory (e.g., Ledoit and Péché (2011)). Hastie et al. (2022) prove an analog of Proposition 3 allowing for arbitrary $\beta$ and expressing all quantities in terms of the distribution of projections of $\beta$ onto the eigenvectors of $\Psi$ (see also Wu and Xu (2020)). Furthermore, they establish nonasymptotic bounds on the rate of convergence. However, both Hastie et al. (2022) and Wu and Xu (2020) require that $\Psi$ be strictly positive definite. By contrast, in our data analysis, we find that $\Psi$ is nearly degenerate. Richards, Mourtada, and Rosasco (2021) also allow for more general $\beta$ structures and $\Psi$ matrices, but require that $X_t$ be i.i.d. Gaussian and Dobriban and Wager (2018) require $X_t$ be i.i.d. This is clearly not applicable to the RFFs used in our empirical analysis (or any other nonlinear signal transformations). In contrast to these papers, we establish our results under much weaker conditions on the distribution of $X_{i,t}$ across $i$. This is important for practical applications, where neither the independence of $X_t$ nor equality (or boundedness) of their higher moments can be guaranteed."

**본 논문의 차별** (이미 motivation 챕터에 다룸; 재강조):
- Hastie et al 2022 — finite sample bounds, strictly PD $\Psi$ 요구.
- Wu-Xu 2020, Richards-Mourtada-Rosasco 2021 — i.i.d. signals 필요.
- **본 논문** — asymptotic + 약한 조건 (rotational symmetric $\beta$, 4th moment bounded, PSD $\Psi$ 가능).

→ RFF 같은 nonlinear feature 에 적용 가능한 결정적 차이.

> **원문 (p.477)**: "Lastly, the novel techniques that we develop allow us to characterize the out-of-sample performance of misspecified models. While Hastie et al. (2022) study misspecification in certain stylized examples, we derive more general results allowing for generic covariance structures. To the best of our knowledge, our characterization is new in the literature (see Section IV)."

→ Section IV 가 본 논문의 *main contribution*.

---

## 5b.6 Section III.B — Expected Out-of-Sample Market Timing Performance

> **원문 (p.477)**: "We analyze the behavior of market timing based on the least-squares estimate,
>
> $$\hat\pi_t(z) = \hat\beta(z)' S_t.$$
>
> Formula (12) derives the expected return of this strategy. The following proposition characterizes the expected out-of-sample risk-return trade-off of market timing in the high-complexity regime."

---

## 5b.7 Proposition 4 — 2nd moment + Sharpe ratio

### Proposition 4 stmt

> **원문 (p.478)**: "**PROPOSITION 4**: *In the limit when $P, T \to \infty$, and $P/T \to c$, the limiting second moment of the market timing strategy is*
>
> $$\mathcal{V}(z; c) := \lim E[(\hat\pi_t(z) R_{t+1})^2 | \hat\beta] = 2(\mathcal{E}(z; c))^2 + (1 + b_* \psi_{*,1}) \mathcal{L}(z; c)$$
>
> *in probability, with $\mathcal{E}$ and $\mathcal{L}$ given in (12). As a result, the Sharpe ratio satisfies*
>
> $$SR(z; c) = \frac{\mathcal{E}(z; c)}{\sqrt{\mathcal{V}(z; c)}} = \frac{1}{\sqrt{2 + (1 + b_* \psi_{*,1}) \frac{\mathcal{L}(z; c)}{(\mathcal{E}(z; c))^2}}}. \quad (15)$$
>
> Furthermore, we have
>
> (i) $\mathcal{E}(z; c)$ is monotone decreasing in $z$ and hence $0 < \mathcal{E}(z; c) < \mathcal{E}(0, c) < \mathcal{E}(0, 0)$, and
>
> (ii) $SR(z; c)$ is monotone increasing in $z$ for $z < z_* = c/b_*$ and monotone decreasing in $z$ for $z > z_*$. Thus, the maximal Sharpe ratio is given by
>
> $$SR(z_*; c) = \frac{1}{\sqrt{2 + (1 + b_* \psi_{*,1}) \frac{1}{b_* \nu(z_*; c)}}} < SR(0, 0), \quad (16)$$
>
> *where $\mathcal{E}(0, 0)$ and $SR(0, 0)$ are the infeasible market-timing expected return and Sharpe ratio from Proposition 1.*"

**핵심 식**:

$$\boxed{SR(z; c) = \frac{1}{\sqrt{2 + (1 + b_* \psi_{*,1}) \frac{\mathcal{L}(z; c)}{(\mathcal{E}(z; c))^2}}}}$$

**기호 뜻**:
- $\mathcal{V}(z; c)$ — second moment of timing return (limit).
- $SR(z; c)$ — limit OOS Sharpe ratio of timing strategy.
- $z_* = c/b_*$ — **same optimal shrinkage** as for $R^2$.

**일상 비유**:
Sharpe ratio 가 두 quantity 의 비율 — expected return $\mathcal{E}$ ($b_*\psi_{*,1}$ 같은 single number 로 압축) 와 leverage $\mathcal{L}$ (squared position). 분모의 $\mathcal{L}/\mathcal{E}^2$ 가 portfolio "efficiency" 의 inverse.

**핵심 properties**:
- (i) $\mathcal{E}$ 는 $z$ 의 *monotone decreasing* (heavier shrinkage → smaller return). 이 단조성이 직관적.
- (ii) $SR$ 는 $z$ 의 *unimodal* — $z_*$ 에서 maximum. ridgeless 보다 ridge 가 더 좋음.

**왜 이 form**:
- $E[(\pi R)^2] = E[\pi^2 \cdot R^2] = E[\pi^2 (S'\beta + \varepsilon)^2] = E[\pi^2 (S'\beta)^2] + E[\pi^2 \varepsilon^2]$.
- 위에서 $\pi = S'\hat\beta$ 이므로 $\pi^2 = (S'\hat\beta)^2$.
- 4-point moments + RMT trace identities → $2\mathcal{E}^2 + (1 + b_*\psi_{*,1}) \mathcal{L}$.

---

## 5b.8 Figure 2 — Expected Return and Volatility

![Figure 2 — Expected out-of-sample risk and return of market timing](figures/page21_Fig3_sharpe.png)

*원문 p.478 Figure 2 (Page 478 PDF) — Left: Expected return $\mathcal{E}$ vs $c$. Right: Volatility $\sqrt{\mathcal{V}}$ vs $c$. Ridgeless (black) 에서 $c < 1$ 에서 expected return constant ($\mathcal{E}(0,c) = \mathcal{E}(0,0)$), $c > 1$ 에서 감소. Volatility 는 $c = 1$ 에서 spike.*

> **원문 (p.478)**: "The left panel of Figure 2 plots the expected out-of-sample return and the right panel plots the expected out-of-sample volatility based on Propositions 3 and 4 using the same calibration as Figure 1. Again, the ridgeless case is in black. The expected returns of least-squares timing strategies are always positive because they are quadratic in beta. When $c < 1$ (i.e., in the OLS case), the ridgeless timing strategy achieves the true expected return even though the corresponding $R^2$ is significantly negative in much of this range. The fact that the out-of-sample expected return is unimpaired reflects the unbiasedness of OLS, while the declining $R^2$ reflects the increasing forecast variance as $c$ rises toward one. The return volatility of the timing strategy is likewise increasing in $c$ for $c \in [0, 1]$ due to the rising forecast variance and maxes out at $c = 1$."

**핵심 통찰** (ridgeless, c < 1):
- Expected return 은 OLS 의 unbiasedness 로 인해 **constant** (impaired 안 됨).
- 그러나 forecast variance 가 c → 1 에서 폭발 → R² 발산, volatility 폭발.

> **원문 (p.479)**: "When $c > 1$, the ridgeless expected return begins to deteriorate. This is more subtle and is related to the rising $R^2$ discussed above. When model complexity is high, the multiplicity of least-squares solutions allows ridgeless regression to find a low-norm beta that exactly fits the training data. So, even though $z \to 0$, the ridgeless beta is biased, and the expected return of the strategy falls. At the same time, the volatility of the strategy falls. The other expected return and volatility curves show that the bias induced by a nontrivial ridge penalty eats into the timing strategy even for $c < 1$. But the bright side of this attenuation is a reduction in the strategy's riskiness. For relatively high shrinkage levels like $z = 1$, the volatility of the timing strategy drops even below that of the infeasible best strategy while maintaining a meaningfully positive expected return."

**핵심 통찰** ($c > 1$, ridgeless):
- Implicit regularization (smallest norm) → biased $\hat\beta$ → expected return 감소.
- 동시에 volatility 도 감소.
- Trade-off 의 net effect 는 $SR$ 의 행동에 영향.

---

## 5b.9 Figure 3 — Sharpe Ratio

![Figure 3 — Expected out-of-sample Sharpe ratio of market timing](figures/page21_Fig3_sharpe.png)

*원문 p.479 Figure 3 — Sharpe ratio vs $c$ for various $z$. 모든 $c$ 에서 ridgeless SR > 0. $c = 1$ 에서 dip 하지만 양수. $z > 0$ (특히 $z = 1, 10$) 이 ridgeless 보다 더 좋음.*

> **원문 (p.479)**: "The net effect of these expected return and volatility behaviors is summarized by the market timing strategy's expected out-of-sample Sharpe ratio, given in Proposition 4. The calibrated Sharpe ratio is shown in Figure 3. Recall that the buy-and-hold Sharpe ratio is normalized to zero. The key implication of Proposition 4 is that despite the sometimes massively negative predictive $R^2$, the ridgeless Sharpe ratio is everywhere positive, even for extreme levels of model complexity. At $c = 1$, the Sharpe ratio drops to near zero, not because the strategy is unprofitable (it remains maximally profitable in an expected return sense) but because of its volatility explodes."

**핵심 발견** (Proposition 4 의 의의):
- **Ridgeless SR > 0 everywhere** (모든 $c$).
- $c = 1$ 에서도 SR > 0 (단지 작아짐).
- **이게 "복잡함의 미덕" 의 핵심 — negative R² 임에도 양의 SR.**

> **원문 (p.479)**: "Another interesting aspect of Figure 3 is that the Sharpe ratio benefits from nontrivial ridge shrinkage regardless of model complexity. Shrinkage is most valuable near $c = 1$, where it reins in volatility substantially more than it reduces expected return. At both low levels of complexity ($c \approx 0$) and high levels of complexity ($c \gg 1$), the Sharpe ratio is relatively insensitive to $z$."

**$z$ 의 효과**:
- Ridge $z > 0$ 가 ridgeless 보다 더 좋은 SR (특히 $c \approx 1$).
- $c \approx 0$ 또는 $c \gg 1$ 에서는 $z$ 의 효과 작음 (relatively insensitive).

### Optimal shrinkage 의 R² + SR 동시 최적화

> **원문 (p.480)**: "Proposition 4 also implies that when the model is correctly specified, the shrinkage that optimizes the expected out-of-sample $R^2$ also optimizes the Sharpe ratio. This is convenient because it means that one can focus on tuning the prediction model and be confident that the tuned $z$ will optimize timing performance. Two caveats, however, are in order. The first is that this statement applies to the Sharpe ratio, so if investors judge their performance with other criteria, then other levels of shrinkage may be optimal. For example, a risk-neutral investor prefers ridgeless regression despite its comparatively poor performance in $R^2$. Second, this statement requires correct specification. If the empirical model is misspecified, the optimal amount of shrinkage can differ depending on whether the objective is to maximize out-of-sample $R^2$ or the Sharpe ratio."

**Correctly specified 의 우연**:
- Same $z_* = c/b_*$ optimizes both $R^2$ and Sharpe ratio.
- Misspecified 에서는 이 일치성이 깨짐 (Section IV 참조).

---

## 5b.10 Section III.C — A Note on R²

> **원문 (p.480)**: "At this point, we already see that a timing strategy with negative $R^2$ can have high average out-of-sample returns and thus positive out-of-sample Sharpe ratios.³¹ More plainly, the positivity of out-of-sample $R^2$ is *not* a necessary condition for an economically valuable timing strategy. The least-squares timing strategies in our framework all have strictly positive out-of-sample expected return and Sharpe ratio regardless of shrinkage or model complexity (despite having enormously negative $R^2$ in many cases)."

**Key insight**:
- **OOS R² > 0 is NOT a necessary condition for positive Sharpe ratio.**
- 모든 least-squares timing 이 strictly positive expected return + Sharpe regardless of $z, c$.

각주 31: "*To see this in a simple example, consider a model with one predictor and imagine estimating a predictive coefficient that happens to be a large scalar multiple of the truth. In this case, the $R^2$ will be pushed negative, but the predictions will be perfectly correlated with the true expected return. Thus, the expected return of the timing strategy will be positive. Furthermore, because the Sharpe ratio is independent of scale effects, this timing strategy will equal the actual Sharpe ratio of the DGP.*"

→ Scale error 만 있고 correlation 은 정확 → R² 음수 but SR 정확.

> **원문 (p.480)**: "This is an important contrast versus the mapping from $R^2$ to the timing Sharpe ratio proposed by Campbell and Thompson (2008), which is an often-used heuristic for interpreting the economic benefits of a predictive $R^2$. Their mapping is population mapping, meaning that it corresponds to the special case of an analyst using a correctly specified model with $c = 0$ (i.e., infinitely more data than parameters). In contrast, our analysis characterizes expected out-of-sample $R^2$ and Sharpe ratios for generic $c$, even with misspecified models (see Section IV)."

**Campbell-Thompson mapping 의 한계**:
- $R^2 \to SR$ heuristic 은 $c = 0$ + correctly specified 의 special case.
- 본 논문은 $c > 0$ + misspecified 의 generic case.

> **원문 (p.480)**: "Out-of-sample $R^2$ and Sharpe ratio measurements serve different purposes. The $R^2$ helps evaluate forecast accuracy, while the Sharpe ratio is appropriate for evaluating the economic value of forecasts in asset allocation contexts. Much of the empirical literature on return prediction and market timing focuses its evaluations on out-of-sample predictive $R^2$ (see, for example, Goyal and Welch (2008)). Proposition 4 ensures that we can worry less about the positivity of out-of-sample $R^2$ from a prediction model and focus more on the out-of-sample performance of timing strategies based on those predictions."

**메시지**: $R^2$ 는 **forecast accuracy**, Sharpe 는 **economic value**. Goyal-Welch (2008) 의 $R^2$ 비관이 economic value 비관과 동일 아님.

---

## 5b.11 한 그림으로 (correctly specified VoC)

```
                   R²(z; c)                              SR(z; c)
                   ────────                              ────────

  c=0       R²(0;0) = b_*ψ/(1+b_*ψ)             SR(0;0) = 1/√(3 + 1/(b_*ψ))
              "infeasible best"                         "infeasible best"
                     |                                       |
                     |  ↓ degradation                        |  ↓ degradation
                     |     in c                              |     in c
                     |                                       |
  c → 1⁻   R²(0;c) → -∞ (catastrophe!)           SR(0;c) → near zero (dip)
                     ↓                                       ↓
  c → 1⁺   R²(0;c) → -∞                          SR(0;c) → near zero
                     ↓                                       ↓
              ridgeless 회복                            ridgeless 회복
                     ↓                                       ↓
  c → ∞    R²(0;c) → 0                            SR(0;c) → some positive

  z* = c/b_*:  R²(z*;c) = max R²                  SR(z*;c) = max SR
                                                  monotone in z up to z*, then down
                                                  same z*!  ← correctly specified 의 결과
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Proposition 3 의 4 quantity ($\mathcal{E}, \mathcal{L}, R^2, \nu/\nu'/\hat\nu$) 의 의미?**
2. **Ridgeless ($z = 0$) 의 $R^2$ 가 $c$ 의 함수로 어떻게 행동하는가?**
3. **Proposition 4 가 R² vs Sharpe ratio 의 관계에 주는 핵심 교훈?**

### 답변
1. $\mathcal{E}(z;c)$ — timing 의 expected return limit. $\mathcal{L}(z;c)$ — leverage (squared position) limit. $R^2(z;c)$ — OOS R² limit (Equation 12). $\nu, \nu', \hat\nu$ — eigenvalue-weighted resolvent trace quantities. 모두 $z, c$ 에 의존, $m(-z;c)$ 와 $\xi(z;c)$ (Proposition 2) 로 계산 가능. 각각 portfolio behavior 의 "building block".
2. $c \to 0$ 에서 $R^2(0;c) \to R^2(0;0) = b_*\psi/(1+b_*\psi)$ (infeasible best). $c < 1$ 에서 단조 감소. $c \to 1$ 에서 $R^2 \to -\infty$ (interpolation boundary catastrophe). $c > 1$ 에서 회복 (smallest-norm ridgeless implicit regularization = benign overfit). $c \to \infty$ 에서 $R^2 \to 0$. 즉 hump pattern with two-sided divergence at $c=1$ ("double descent" 의 OOS R² 버전).
3. **OOS R² > 0 은 양의 Sharpe ratio 의 필요조건이 아니다.** Least-squares timing 의 expected return 이 quadratic in $\beta$ 이므로 항상 양수, R² 가 음수라도 Sharpe > 0. Campbell-Thompson (2008) 의 R² → SR mapping 은 $c = 0$ + correctly specified 의 special case. Generic $c > 0$ + misspecified 환경에서는 R² 와 SR 가 *decoupled* — 즉 "예측 정확도" 와 "경제적 가치" 가 분리된 metric.

---

다음 파일 [05_method_c_misspec.md](05_method_c_misspec.md) — Section IV (Misspecified Models) + Theorem 1 (Virtue of Complexity 본 정리) 풀이.
