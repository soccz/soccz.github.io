# 04. Section I — 분석 환경 (Assumptions, Timing, Proposition 1)

> 논문 Section I (p.465–470). Assumptions 1–4, Lemma 1, market timing 정의, 평가 기준, Proposition 1 (infeasible Sharpe ratio).

---

## 4.1 챕터 한 줄 요약

**single asset 의 수익률 $R_{t+1} = S_t' \beta + \varepsilon_{t+1}$ (선형, P 차원). 4개 가정 (자산 동학, signal 구조, eigenvalue 수렴, random β) 으로 RMT asymptotic 분석을 가능하게 만들고, **infeasible 한 진짜 β 알 때의 시장 timing Sharpe ratio 가 $1/\sqrt{3 + (b_*\psi_{*,1})^{-1}} < 1/\sqrt{3}$** 라는 normalization benchmark 를 확립한다.**

---

## 4.2 Section I.A — Asset Dynamics (자산 동학)

> **원문 (p.465)**: "This section describes our modeling assumptions and outlines the criteria we use to evaluate machine learning portfolios."

### Assumption 1 — Single asset linear DGP

> **원문 (p.465)**: "**ASSUMPTION 1**: *There is a single asset whose excess return behaves according to*
>
> $$R_{t+1} = S_t' \beta + \varepsilon_{t+1}, \quad (3)$$
>
> *with $\varepsilon_{t+1}$ independent and identically distributed (i.i.d.), $E[\varepsilon_{t+1}] = E[\varepsilon_{t+1}^3] = 0$, $E[\varepsilon_{t+1}^2] = \sigma^2$, $E[\varepsilon_{t+1}^4] < \infty$, and $S_t$ a $P$-vector of predictor variables. Without loss of generality, we normalize $\sigma^2 = 1$.*"

**기호 뜻**:
- $R_{t+1} \in \mathbb{R}$ — 시점 $t+1$ 의 single asset 초과수익 (스칼라).
- $S_t \in \mathbb{R}^P$ — 시점 $t$ 의 P-vector predictor (관측 가능).
- $\beta \in \mathbb{R}^P$ — true regression coefficient (unobserved).
- $\varepsilon_{t+1}$ — 잡음. iid + 0 평균 + 0 skewness + 유한 분산 $\sigma^2$ + 유한 4차 모멘트.
- $\sigma^2 = 1$ — normalization (loss of generality 없음).

**일상 비유**:
시장 수익률 $R$ 을 P 차원 predictor $S$ 의 선형 함수 (+ 잡음) 로 가정. 야구 선수의 시즌 성적을 P 가지 스탯 (홈런, 도루, 출루율, ...) 의 선형 결합으로 예측하는 것과 같음.

**왜 이 형태**:
- *Linear*: 가정 단순화. 비선형성은 $S_t = \tilde f(w_i' G_t)$ 의 feature engineering 으로 흡수 (Equation 2).
- *iid $\varepsilon$*: 시계열 종속 없음. 실증은 monthly return → low autocorrelation 정당화.
- *Zero skewness ($E[\varepsilon^3] = 0$)*: 분석 식 단순화 (각주 11).
- *Finite 4th moment*: RMT 결과의 standard assumption (Marchenko-Pastur 정리 등).
- *Single asset*: cross-section panel 단순화 — market timing 만 분석 (각주 2).

**조심할 점**:
- 실제 monthly return 에 약간의 autocorrelation 있음 — robustness 로 처리 (Section V.F).
- 본 모델은 conditional mean 만 모델링 — conditional volatility ($\varepsilon_{t+1}^2$ 의 시간 변화) 무시. 실증에서 12-month rolling vol-standardization 으로 homoskedastic 가까이 만듦.

각주 11: "*The assumption of zero skewness simplifies the analytical expressions but does not affect our results.*"

---

## 4.3 Section I.A — Signal Structure (signal 구조)

> **원문 (p.466)**: "Assumption 1 establishes the basic return-generating process. Most notably, conditional expected returns depend on a potentially high-dimensional information set embodied by the predictors, $S$. The interpretation of this assumption is not necessarily that asset returns are subject to many fundamental driving forces. Instead, it espouses the machine learning perspective discussed in the introduction: The DGP's functional form is unknown but may be approximated using richly parameterized models using a high-dimensional nonlinear expansion $S$ of some underlying feature set."

→ **재강조**: $S$ 가 P-dim 이지만 그 안의 정보는 작은 underlying feature set ($G$) 의 풍부한 nonlinear expansion.

### Assumption 2 — Signal moments + factor structure

> **원문 (p.466)**: "The covariance structure of $S$ plays a central role in the behavior of machine learning predictions and portfolios. Assumption 2 imposes basic regularity conditions on this covariance.
>
> **ASSUMPTION 2**: *There exist independent random vectors $X_t \in \mathbb{R}^P$ with four finite first moments, and a symmetric, $P$-dimensional positive semidefinite matrix $\Psi$ such that*
>
> $$S_t = \Psi^{1/2} X_t.$$
>
> *Furthermore, $E[X_{i,t}] = E[X_{i,t}^3] = E[X_{i_1,t} X_{i_2,t} X_{i_3,t}] = 0$ and $E[X_{i,t}^2] = 1$, for all $i, i_1, i_2, i_3 = 1, \ldots, P$ and $E[X_{i_1,t} X_{i_2,t} X_{i_3,t} X_{i_4,t}] = 0$ whenever at least three indices among $i_1, i_2, i_3, i_4$ are different. Furthermore, the fourth moments $E[X_{i,t}^4]$ are uniformly bounded.*"

**기호 뜻**:
- $\Psi \in \mathbb{R}^{P \times P}$ — *true population* signal covariance matrix (symmetric, PSD).
- $\Psi^{1/2}$ — $\Psi$ 의 symmetric 제곱근.
- $X_t \in \mathbb{R}^P$ — "raw" signal — 독립적, **uncorrelated 단위분산** ($E[X^2]=1$).
- Moment conditions:
  - 1st: $E[X_{i,t}] = 0$ — 평균 0
  - 2nd: $E[X_{i,t}^2] = 1$ — 단위 분산
  - 3rd: $E[X_{i,t}^3] = 0$ — symmetric distribution (각주 13)
  - $E[X_{i_1} X_{i_2} X_{i_3}] = 0$ — third cross moment 0
  - $E[X^4]$ uniformly bounded
  - $E[X_{i_1} X_{i_2} X_{i_3} X_{i_4}] = 0$ when ≥3 indices differ — *no four-way cross dependence*

**일상 비유**:
$X$ 가 **무차원 standard 잡음 모음**. 그걸 $\Psi^{1/2}$ 로 *covariance 구조* 부여 → $S$ 가 실제 signal. 마치 standard normal $Z$ 를 $\Sigma^{1/2}$ 로 transform 해서 $N(0, \Sigma)$ 만드는 것과 비슷.

**왜 이 형태**:
- *Independence of $X$* 보다 약한 조건만 부과 (4번째 cross moment 의 일부 제약만). 실증의 RFF features 가 strictly iid 아닐 수 있으므로 약한 조건이 필요.
- $\Psi$ separation — covariance 구조 ($\Psi$) 와 standardized noise ($X$) 분리.

**조심할 점**:
- $\Psi$ 가 positive *semi*-definite (PSD) — 일부 eigenvalue 0 가능 (degenerate signals). 각주 12 가 이 경우를 다룸.
- $X_t$ 와 $X_{t'}$ 는 독립 (across time) 인데, $X_{i,t}$ 와 $X_{j,t}$ (cross-section) 는 약한 dependence 만 허용.

각주 12: "*If zero is in the support of H, then $\Psi$ is strictly degenerate, meaning that some signals are redundant.*"

각주 13: "*The assumption of a random coefficient vector $\beta$ is related to that in Gagliardini, Ossola, and Scaillet (2016).*"

---

## 4.4 Section I.A — Eigenvalue Behavior (Assumption 3)

> **원문 (p.466)**: "As we show below, the theoretical properties of machine learning portfolios depend heavily on the distribution of eigenvalues of $\Psi$. We are interested in limiting behavior in the high model complexity regime, that is, as $P, T \to \infty$, with $P/T \to c > 0$. Assumption 3 ensures that estimates of $\Psi$ are well behaved in this limit.
>
> **ASSUMPTION 3**: *We use $\lambda_k(\Psi)$, $k = 1, \ldots, P$, to denote the eigenvalues of an arbitrary matrix $\Psi$. In the limit as $P \to \infty$, the spectral distribution $F^\Psi$ of the eigenvalues of $\Psi$
>
> $$F^\Psi(x) = \frac{1}{P} \sum_{k=1}^P \mathbf{1}_{\lambda_k(\Psi) \le x}, \quad (4)$$
>
> *converges to a nonrandom probability distribution $H$ supported on $[0, +\infty)$. Furthermore, $\Psi$ is uniformly bounded as $P \to \infty$. We use*
>
> $$\psi_{*,k} = \lim_{P \to \infty} P^{-1} \text{tr}(\Psi^k) \quad k \ge 1,$$
>
> *to denote asymptotic moments of the eigenvalues of $\Psi$.*"

**기호 뜻**:
- $\lambda_k(\Psi)$ — $\Psi$ 의 $k$-th eigenvalue (sorted).
- $F^\Psi(x)$ — empirical spectral distribution (eigenvalue 의 비율로 본 CDF).
- $H$ — limiting (nonrandom) spectral distribution. supported on $[0, \infty)$.
- $\psi_{*,k}$ — $\Psi$ 의 $k$-th eigenvalue 의 **점근 모멘트**.
- $c = \lim P/T$ — limiting complexity ratio.

**일상 비유**:
거대한 행렬 $\Psi$ 의 eigenvalue 들을 **density plot** 으로 보면 어떤 모양? 그 모양이 $P \to \infty$ 에서 **확정적** 분포 $H$ 로 수렴한다. 마치 표본 평균이 LLN 으로 ${\mathbb{E}}[X]$ 로 수렴하듯이, eigenvalue density 가 한 distribution 으로 수렴.

**왜 이 형태**:
- *Spectral distribution* — RMT 의 핵심 객체. 개별 eigenvalue 보다 **전체 분포** 가 model 동작 결정.
- *Nonrandom limit* — RMT 의 정상적 가정. Marchenko-Pastur 같은 정리들도 이 가정 하에서 작동.
- *Asymptotic moments $\psi_{*,k}$* — $H$ 의 $k$-th moment ($\int x^k dH(x)$). 본 논문 결과의 building block.

**조심할 점**:
- $\Psi$ 가 일반 deterministic (sequence). Hastie et al. 2022 는 $\Psi$ 가 strictly positive-definite 요구; 본 논문은 PSD 만 (각주 32 의 finite-rank factor structure).
- $P \to \infty$ 의미 — 실제로는 large $P$. 본 논문 실증: $P$ 가 12,000 까지.

---

## 4.5 Section I.A — Random Coefficient $\beta$ (Assumption 4)

> **원문 (p.466)**: "Our last assumption governs the behavior of the true predictive coefficient, $\beta$.
>
> **ASSUMPTION 4**: *We assume that $\beta = \beta_P$ is random, $\beta = (\beta_i)_{i=1}^P \in \mathbb{R}^P$, with i.i.d. coordinates $\beta_i$ that are independent of $S$ and $R$, and such that $E[\beta] = 0$, $E[\beta \beta'] = P^{-1} b_{*,P} I$ for some constant $b_{*,P} = E[\|\beta\|^2]$, and satisfies $b_{*,P} \to b_*$ in probability for some $b_* > 0$. Furthermore, $E[\beta_i^4] \le K P^{-2}$ for some $K > 0$.*"

**기호 뜻**:
- $\beta = (\beta_i)_{i=1}^P$ — **random vector** (논문의 굵직한 가정 — 분석 단순화 위함).
- $E[\beta] = 0$ — mean zero (편의).
- $E[\beta \beta'] = P^{-1} b_{*,P} I$ — covariance matrix 가 **scaled identity**. $b_{*,P}$ scalar.
- $b_{*,P} = E[\|\beta\|^2]$ — $\beta$ 의 squared norm.
- $b_{*,P} \to b_*$ in probability — limit $b_* > 0$ 으로 수렴.
- $E[\beta_i^4] \le K/P^2$ — 4th moment uniformly bounded after $P^{-2}$ scaling.

**일상 비유**:
진짜 회귀 계수 $\beta$ 도 **랜덤** 이라고 가정 — 분석 단순화. 마치 "이 시점에 어떤 $\beta$ 가 자연이 선택했다" 라는 prior. 이 가정으로 **average behavior across $\beta$ realizations** 을 분석 가능.

**왜 이 형태**:
- *Random $\beta$*: 분석 simplification. 실제로 우리는 "이 $\beta$" 의 결과보다 "average $\beta$ realization" 의 통계가 더 의미 있음.
- *Mean zero*: 본 분석에서 $\beta$ mean 0 가정. nonzero mean 으로 일반화 가능하지만 식이 복잡 (각주 14).
- *Isotropic covariance ($P^{-1} b_* I$)*: $\beta$ 가 **rotation-invariant** — 예측 contributions 가 균등 분포. RFF 와 자연스럽게 부합.
- *Scaling $P^{-1}$*: $\|\beta\|^2 = b_* O(1)$, 즉 $\|\beta\|$ 가 $P$ 와 무관한 finite quantity.

**조심할 점**:
- *Isotropic*: 본 가정이 RFF 같은 random feature 에는 잘 맞지만, 자연적 financial predictor (dy, dp 등) 는 isotropic 아님. 그러나 RFF 가 그 raw predictor 를 random mix 해서 isotropic 화.
- 4-th moment bound $K/P^2$ — sub-Gaussian-like tail.
- nonzero mean $\beta$ 가능하지만 분석 복잡 (각주 14).

각주 14: "*This identity follows because $b_* = \text{tr} E[\beta \beta'] = E[\text{tr}(\beta \beta')] = E[\|\beta\|^2]$.*"

각주 15 (각주 깊이): "*From a technical standpoint, it is possible to derive expressions for portfolio performance without this assumption, but the expressions become more complex. In this case, the asymptotic behavior depends on the distribution of projections of $\beta$ on the eigenvectors of $\Psi$ (the signals' principal components). See Hastie et al. (2022). In particular, when $\beta$ is concentrated on the top principal components, the phenomenon of benign overfit emerges (Bartlett et al. (2020), Tsigler and Bartlett (2023)) and the optimal ridge regularization is zero. We leave this generalization for future research.*"

→ **Anisotropic $\beta$** 의 경우 PCA top component 집중 시 ridgeless optimal — Bartlett et al 의 benign overfit. 본 논문은 isotropic 로 단순화.

각주 16: "*It is possible to use the results in Hastie et al. (2022) to extend our analysis to generic $\beta$ distributions. We leave this important direction for future research.*"

---

## 4.6 Lemma 1 — $\beta'A\beta$ 의 점근 동치

> **원문 (p.467)**: "The randomness of $\beta$ in Assumption 4 allows us to characterize the prediction and portfolio problem for generic predictive coefficients. The assumption that $\beta$ is mean zero is inconsequential; we could allow for a nonzero mean and restate our analysis in terms of variances rather than second moments. The assumption $E[\beta \beta'] = P^{-1} b_{*,P} I$ imposes that the predictive content of signals is rotationally symmetric, that is, predictability is uniformly distributed across signals. This may seem restrictive, as commonly used return predictors would not satisfy Assumption 4. But it is closely aligned with the structure of feed-forward neural networks, in which raw features are mixed and nonlinearly propagated into final generated features whose ordering is essentially randomized by the initialization step of network training. Intuitively, we expect (and later confirm empirically) that the random-feature methodology that we use in our empirical analysis satisfies Assumption 4."

→ **Justification**: rotationally symmetric $\beta$ 가 feed-forward NN 의 자연스러운 가정. random feature initialization 으로 정당화.

> **원문 (p.467)**: "When $\beta$ is random and rotationally symmetric, we can focus on average portfolio behavior across signals, which implies that only the traces of the relevant matrices matter, as opposed to entire matrices (which are the source of technical intractability). The proportionality of $E[\beta \beta']$ to $P^{-1}$, and likewise the finite limiting $\ell_2$ norm of $\beta$, controls the 'true' Sharpe ratio. It ensures that Sharpe ratios of timing strategies remain bounded as the number of predictors grows. In other words, our setting is one with many signals, each contributing a little bit of predictability."

**핵심 메시지**:
- $E[\beta\beta'] \propto P^{-1}$ — true SR 유한 (각 signal 이 1/P 의 "약한" 기여).
- "Many weak signals" 구조 — 이게 high-complexity regime 의 자연스러운 경제 모델.

> **원문 (p.467)**: "A key aspect of our paper, and one rooted in Assumptions 2 and 4, is that realized out-of-sample expected returns are independent of the specific realization of $\beta$. This is due to a law of large numbers in the $P \to \infty$ limit and is guaranteed by the following lemma.
>
> **LEMMA 1**: *As $P \to \infty$, we have*
>
> $$\beta' A_P \beta - P^{-1} b_* \text{tr}(A_P) \to 0$$
>
> *in probability for any bounded sequence of matrices $A_P$. In particular, $\beta' \Psi \beta \to b_* \psi_{*,1}$.*"

**기호 뜻**:
- $A_P \in \mathbb{R}^{P \times P}$ — bounded sequence of matrices (deterministic).
- $\beta' A_P \beta$ — quadratic form $\sum_{i,j} \beta_i A_{ij} \beta_j$.
- $P^{-1} b_* \text{tr}(A_P)$ — "expected value" of $\beta' A_P \beta$ given $E[\beta\beta'] = P^{-1} b_* I$.

**일상 비유**:
random vector $\beta$ 의 quadratic form 이 $P \to \infty$ 에서 **deterministic trace** 로 LLN 수렴. 마치 $\frac{1}{N} \sum X_i^2 \to E[X^2]$ 의 vector version.

**왜 이 형태**:
- $\beta$ 가 iid + isotropic 이므로 $\beta_i \beta_j$ 의 covariance 가 $i=j$ 만 nonzero.
- $E[\beta' A \beta] = \sum_i A_{ii} E[\beta_i^2] = P^{-1} b_* \text{tr}(A)$.
- Variance 가 $E[\beta_i^4] \le K/P^2$ 로부터 $O(1/P)$ → LLN.

**조심할 점**:
- $A_P$ 가 *bounded* 일 때만. Unbounded eigenvalues 면 깨질 수 있음.
- "in probability" — almost sure 보다 약한 수렴 (sufficient for our purposes).

**핵심 의의**:
$\beta' \Psi \beta \to b_* \psi_{*,1}$ — **expected return** 등 핵심 quantities 가 $\beta$ realization 무관하게 deterministic limit.

→ 이게 **본 논문 분석을 가능하게 만드는 핵심 lemma**. 모든 후속 Proposition 이 이걸 토대로.

---

## 4.7 Section I.B — Timing Strategies and Performance Evaluation

> **원문 (p.468)**: "We study timing-strategy returns, defined as
>
> $$R_{t+1}^\pi = \pi_t R_{t+1},$$
>
> *where $\pi_t$ is a timing weight that scales the position in the asset up and down to exploit time variation in the asset's expected returns.*"

**기호 뜻**:
- $\pi_t \in \mathbb{R}$ — timing weight (시점 $t$ 의 자산 비중). 양수 = long, 음수 = short.
- $R_{t+1}^\pi$ — timing strategy return.

**일상 비유**:
시장 수익률 $R$ 에 시점마다 "내가 얼마나 자신 있는가" 의 weight $\pi$ 를 곱한다. $\pi=1$ 이면 buy-and-hold, $\pi=0$ 이면 cash, $\pi=-0.5$ 이면 시장 short 50%.

### Sharpe Ratio (Equation 5)

> **원문 (p.468)**: "We are interested in timing strategies that optimize the unconditional Sharpe ratio,
>
> $$SR = \frac{E[R_{t+1}^\pi]}{\sqrt{E[(R_{t+1}^\pi)^2]}}. \quad (5)$$
>
> While there are other possible performance criteria, we focus on this one for its simplicity and ubiquity. It is implied by the quadratic utility function at the foundation of mean-variance portfolio theory. Academics and real-world investors rely nearly universally on the unconditional Sharpe ratio when evaluating empirical trading strategies. The use of centered versus uncentered second moment in the denominator is without loss of generality."

**기호 뜻**:
- $SR$ — unconditional Sharpe ratio.
- 분모: $\sqrt{E[(R^\pi)^2]}$ — **uncentered** second moment (variance 아니라 second moment).

**왜 uncentered**:
- $\widetilde{SR} = E[R^\pi]/\sqrt{Var[R^\pi]}$ 와 직접 관계 (각주 17): $SR = 1/\sqrt{1+\widetilde{SR}^{-2}}$ 의 monotone transformation.
- 분석 식이 깔끔.

각주 17: "*Define $\widetilde{SR} = E[R^\pi]/\sqrt{Var[R^\pi]}$. Direct calculation yields $SR = \frac{1}{\sqrt{1 + \widetilde{SR}^{-2}}}$.*"

각주 19: "*In particular, the Sharpe ratio in equation (5) is less than one due to the Cauchy-Schwarz inequality. We show that the difference in Sharpe ratios for $\pi_t$ versus $\pi_t^{\text{Uncond. MV}}$ is on the order of the Sharpe ratio cubed.*"

→ Eq (5) 의 *uncentered* SR 는 Cauchy-Schwarz 부등식에 의해 1 미만. 또한 본 논문이 사용하는 conditional MV timing $\pi_t = S_t'\beta$ 와 *true* unconditional MV optimizer $\pi_t^{\text{Uncond. MV}} = S_t'\beta / (1 + (S_t'\beta)^2)$ 의 SR 차이가 **SR 의 세제곱 order** — 즉 small SR (예: 0.1) 의 경우 0.001 정도로 무시 가능. 본 분석을 $\pi_t = S_t'\beta$ 의 linear form 으로 simplify 해도 결과 동일.

각주 20: "*By a version of Lemma 1, $1 + (S_t'\beta)^2 \to 1 + b_*\psi_{*,1}$.*"

→ $P \to \infty$ limit 에서 $(S_t'\beta)^2 = \beta'(S_tS_t')\beta$ 가 Lemma 1 적용으로 $b_* P^{-1}\text{tr}(\mathbb{E}[S_tS_t']) = b_*\psi_{*,1}$ 로 수렴. 따라서 $\pi_t^{\text{Uncond. MV}}$ 의 분모 $1 + (S_t'\beta)^2$ 가 **deterministic constant** $1 + b_*\psi_{*,1}$ 로 수렴 → $\pi_t = S_t'\beta$ 와 *동일 scaling* 의 timing 전략. 분석 simplification 의 핵심.

### Timing strategy functional form (Equation 6)

> **원문 (p.468)**: "Our analysis centers on the following timing-strategy functional form:
>
> $$\pi_t(\beta) = S_t' \beta. \quad (6)$$
>
> *This strategy takes positions equal to the asset's conditional expected return. Note that this timing strategy optimizes the* conditional *Sharpe ratio. It achieves the same Sharpe ratio as the conditional Markowitz solution, $\pi_t^{\text{Cond. MV}} = E_t[R_{t+1}]/\text{Var}_t[R_{t+1}] = S_t' \beta$, according to equation (3). While strategy $\pi_t$ is conditionally mean-variance efficient, it is not the optimizer of the unconditional objective in (5), which takes the form $\pi_t^{\text{Uncond. MV}} = S_t' \beta / (1 + (S_t' \beta)^2)$. In the proof of Proposition 1 in the Internet Appendix, we show that $\pi_t$ in equation (6) and $\pi_t^{\text{Uncond. MV}}$ are equal up to third-order terms. We study $\pi_t = S_t' \beta$ for the simplicity of its linearity in both $\beta$ and $S_t$, but note that our conclusions are identical for $\pi_t^{\text{Uncond. MV}}$ because, in the limit as $P \to \infty$, the normalization factor $1 + (S_t' \beta)^2$ converges to a constant.*"

**핵심 식**:
$$\pi_t(\beta) = S_t' \beta$$

즉 **conditional expected return 그대로 timing weight 로 사용**.

**왜 이 형태**:
- *Conditional Markowitz*: $\pi^* = E_t[R]/Var_t[R]$. Var_t = 1 (homoskedastic) 이면 $\pi^* = E_t[R] = S_t' \beta$.
- *Unconditional Markowitz*: $\pi^{**} = S_t' \beta / (1 + (S_t' \beta)^2)$. 분모가 다름.
- 본 논문은 $\pi_t = S_t'\beta$ 사용 — 분석 simpler.
- $P \to \infty$ 시 $1 + (S_t' \beta)^2 \to$ const (Lemma 1 적용), 즉 두 timing 식이 점근적으로 같음.

각주 18-20:
- 18: "*See Hansen and Richard (1987), Ferson and Siegel (2001), Abhyankar, Basu, and Stremme (2012).*"
- 19: "*In particular, the Sharpe ratio in equation (5) is less than one due to the Cauchy-Schwarz inequality. We show that the difference in Sharpe ratios for $\pi_t$ versus $\pi^{\text{Uncond. MV}}_t$ is on the order of the Sharpe ratio cubed.*"
- 20: "*By a version of Lemma 1, $1 + (S_t' \beta)^2 \to 1 + b_* \psi_{*,1}$.*"

---

## 4.8 Proposition 1 — Infeasible Sharpe Ratio (진짜 β 알 때)

> **원문 (p.469)**: "Proposition 1 states the behavior of timing strategy $\pi_t = S_t' \beta$ when $T \to \infty$ and $P/T \to 0$ (i.e., when the predictive parameter $\beta$ is known).
>
> **PROPOSITION 1** (*Infinite Sample*): *The unconditional first and second moments of returns to the infeasible market timing strategy $\pi_t = S_t' \beta$ are*
>
> $$E[\pi_t R_{t+1}] \to b_* \psi_{*,1} > 0 \quad \text{and} \quad E[(\pi_t R_{t+1})^2] \to (3(b_* \psi_{*,1})^2 + b_* \psi_{*,1}).$$
>
> *The infeasible market-timing Sharpe ratio is*
>
> $$SR \to \frac{1}{\sqrt{3 + (b_* \psi_{*,1})^{-1}}} < \left(\frac{1}{3}\right)^{1/2}. \quad (7)$$"

**핵심 식**:

| Quantity | Limit |
|----------|-------|
| Expected return | $E[\pi R] \to b_* \psi_{*,1} > 0$ |
| Second moment | $E[(\pi R)^2] \to 3(b_* \psi_{*,1})^2 + b_* \psi_{*,1}$ |
| Sharpe ratio | $SR \to \frac{1}{\sqrt{3 + (b_* \psi_{*,1})^{-1}}}$ |
| Upper bound | $SR < 1/\sqrt{3} \approx 0.577$ |

**기호 뜻**:
- $b_*$ — limit of $\|\beta\|^2/P$ (Assumption 4).
- $\psi_{*,1} = \lim P^{-1} \text{tr}(\Psi)$ — 1st asymptotic moment of $\Psi$ eigenvalues.
- $b_* \psi_{*,1}$ — *predictive power* 의 합성 measure.

**일상 비유**:
완전 정보 (진짜 $\beta$ 안다) 상황에서도 SR 는 $1/\sqrt{3} \approx 0.577$ 미만. "신은 더 잘하지 않는다"의 upper bound.

**왜 이 형태**:
- $E[\pi R] = E[(S'\beta)(S'\beta + \varepsilon)] = E[(S'\beta)^2] + 0 = \beta' E[SS']\beta = \beta'\Psi\beta \to b_*\psi_{*,1}$ (Lemma 1).
- $E[(\pi R)^2] = E[(S'\beta)^2 (S'\beta + \varepsilon)^2] = E[(S'\beta)^4] + E[(S'\beta)^2 \varepsilon^2]$ (분산 0, skewness 0).
- $E[(S'\beta)^4] = 3 (\beta'\Psi\beta)^2 \to 3(b_*\psi_{*,1})^2$ (Gaussian-like 4th moment property given Assumption 2).
- $E[(S'\beta)^2 \varepsilon^2] = \beta'\Psi\beta \cdot \sigma^2 = b_*\psi_{*,1}$ (with $\sigma^2 = 1$).

**조심할 점**:
- 이건 *infeasible* SR — 진짜 $\beta$ 안다는 비현실적 가정.
- 실제 데이터로 추정한 $\hat\beta$ 의 SR 는 이보다 낮음 (후속 결과들).
- $1/\sqrt 3$ 의 의미: $b_*\psi_{*,1} \to \infty$ 일 때 (limit) SR → $1/\sqrt 3$. predictive content 무한 시 한계.

### Untimed asset 의 SR

> **원문 (p.469)**: "For comparison, under Assumptions 1 to 4, the unconditional first and second moments of the untimed asset return are (see Lemma 1)
>
> $$E[R_{t+1}] = 0, \quad \text{and} \quad E[R_{t+1}^2] \to 1 + b_* \psi_{*,1}.$$
>
> That is, our assumptions imply that the untimed asset has a Sharpe ratio of zero. This is just a normalization so that any positive market timing Sharpe ratio can be interpreted as pure excess performance arising from timing ability."

**핵심**: untimed asset 의 SR = 0 (normalization). 모든 timing SR > 0 = 순수 timing 의 효과.

**왜 normalization**:
- $E[R_{t+1}] = E[S'\beta] + E[\varepsilon] = 0 + 0 = 0$ (because $\beta$ mean zero by Assumption 4).
- Empirical 에서는 $E[R_{t+1}] \neq 0$ (시장 risk premium). 이건 normalization (return 에서 mean 제거) 으로 통일.

---

## 4.9 Section I.C — R² 와 Portfolio Performance 의 관계

> **원문 (p.469)**: "We are ultimately interested in understanding the portfolio properties of a feasible timing strategy, $\hat\pi_t = \hat\beta' S_t$. This is, of course, intimately tied to the prediction accuracy of the estimator $\hat\beta$, summarized by its expected MSE on an independent test sample. This is the fundamental notion of estimator 'risk' from statistical theory, although we use the term 'MSE' here to avoid confusion with portfolio riskiness. We can write MSE as
>
> $$MSE(\hat\beta) = E[(R_{t+1} - S_t' \hat\beta)^2 | \hat\beta] = E[R_{t+1}^2] - 2 \underbrace{E[\hat\pi_t R_{t+1} | \hat\beta]}_{\text{Timing Expected Return}} + \underbrace{E[\hat\pi_t^2 | \hat\beta]}_{\text{Timing Leverage}}. \quad (8)$$"

**기호 뜻**:
- $MSE(\hat\beta)$ — Mean Squared Error of forecast.
- $\hat\pi_t = \hat\beta' S_t$ — feasible timing weight.
- $E[\hat\pi_t R_{t+1} | \hat\beta]$ — timing expected return.
- $E[\hat\pi_t^2 | \hat\beta]$ — timing **leverage** (squared position 의 expectation, i.e., $\hat\pi$ 의 second moment).

**일상 비유**:
prediction 의 MSE 가 portfolio performance 의 두 component (expected return vs leverage) 의 trade-off 로 분해된다. 마치 bias-variance tradeoff 의 portfolio 버전.

**왜 이 form**:
$(R - S'\hat\beta)^2 = R^2 - 2 R \cdot S'\hat\beta + (S'\hat\beta)^2 = R^2 - 2 \hat\pi R + \hat\pi^2$.

> **원문 (p.469)**: "In other words, the higher the strategy's expected return, the lower the MSE. And the larger the positions — or 'leverage' — of the strategy, the larger the MSE. A timing strategy with a higher expected return corresponds to more predictive power, while higher leverage gives the strategy higher variance. Interestingly, these two objects, expected return and leverage of the timing strategy, appear repeatedly throughout our analysis. The expected return/leverage trade-off in (8) is a financial decomposition of MSE analogous to its statistical decomposition into a bias/variance trade-off."

**메시지**: MSE = $E[R^2]$ + (financial 항) = bias-variance 의 finance 버전.

> **원문 (p.470)**: "Note that a strategy $\pi_t = \beta' S_t$ based on the infeasible true $\beta$ satisfies $E[\pi_t R_{t+1}] = E[\beta' \Psi \beta] = E[\pi_t^2]$. In this case, the MSE collapses to $E[R_{t+1}^2] - E[\pi_t R_{t+1}]$ and is minimized, meaning that the leverage taken is exactly justified by the predictive benefits of the strategy. This can also be stated in terms of the infeasible $R^2$ based on equation (3) and Lemma 1:
>
> $$R^2 = \frac{\beta' \Psi \beta}{\beta' \Psi \beta + 1} \to \frac{b_* \psi_{*,1}}{b_* \psi_{*,1} + 1}.$$
>
> Thus, there is a monotonic mapping from the infeasible timing-strategy expected return to the true $R^2$, and from the infeasible Sharpe ratio to the true $R^2$ (see equation (7))."

각주 21: "*Indeed, $E[(\beta' S_t)^2] = E[\beta' S_t S_t' \beta] = \beta' \Psi \beta$.*"

**핵심**:
- Infeasible $R^2 \to b_*\psi_{*,1}/(b_*\psi_{*,1} + 1)$ — monotone in $b_*\psi_{*,1}$.
- Infeasible $SR \to 1/\sqrt{3 + 1/(b_*\psi_{*,1})}$ — monotone in $b_*\psi_{*,1}$.
- 즉 $R^2 \leftrightarrow SR$ **단조 mapping** — *infeasible* 경우엔 R² 가 timing 성능의 충분 통계.

→ **이게 무너지는 게 feasible (estimated $\hat\beta$) 의 경우** — 다음 챕터 (05a, 05b, 05c, 06) 의 핵심.

---

## 4.10 한 그림으로

```
Assumption 1 (asset)      Assumption 2 (signals)
  R_{t+1} = S_t'β + ε       S_t = Ψ^{1/2} X_t (raw X ~ iid moments)
        |                          |
        +───── Assumption 3 ───────+
                eigenvalues F^Ψ → H (limit distribution)
                ψ_{*,k} = lim P^{-1} tr(Ψ^k)
                          |
                Assumption 4 (β random)
                E[ββ'] = P^{-1} b_* I → b_* > 0
                          |
                    LEMMA 1 (LLN)
                β' A β → P^{-1} b_* tr(A) deterministic
                          |
       Timing strategy: π_t = S_t' β
                          |
                  PROPOSITION 1
   E[πR] → b_*ψ_{*,1},  Var(πR) → ...
   SR_∞ = 1/√(3 + 1/(b_*ψ_{*,1})) < 1/√3
                          |
                  (infeasible benchmark)
```

이 framework 위에서:
- Section II 가 ridge estimator 의 RMT 분석을 도구화.
- Section III 가 correctly specified 의 feasible SR / R² 도출.
- Section IV 가 misspecified case 로 일반화하고 **Theorem 1 (Virtue of Complexity)** 확립.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Assumption 1-4 의 핵심 메시지 한 줄씩?**
2. **Lemma 1 이 왜 본 분석의 토대인가?**
3. **infeasible Sharpe ratio 가 $1/\sqrt 3$ 미만인 이유?**

### 답변
1. (1) single asset 선형 DGP $R = S'\beta + \varepsilon$ + iid noise. (2) signal $S = \Psi^{1/2} X$ — covariance 구조와 noise 분리. (3) eigenvalue 분포가 limit $H$ 로 수렴 — RMT 분석 가능. (4) $\beta$ 가 random + isotropic + $\|\beta\|^2 \to b_*$ — average behavior 분석 가능.
2. Lemma 1: $\beta' A_P \beta \to P^{-1} b_* \text{tr}(A_P)$ in probability. 즉 random $\beta$ 의 quadratic form 이 deterministic trace 로 LLN 수렴 (rotational symmetry + $P \to \infty$). 이로부터 portfolio 의 핵심 quantity (expected return, leverage, SR) 가 $\beta$ realization 무관하게 deterministic limit 가짐 → 모든 Proposition (2, 3, 4, 5, 6) + Theorem 1 의 building block.
3. Infeasible SR = $1/\sqrt{3 + (b_*\psi_{*,1})^{-1}}$. $b_*\psi_{*,1} \to \infty$ (predictive power 무한) 의 극한에서 $SR \to 1/\sqrt 3 \approx 0.577$. 이 upper bound 의 이유: $E[(\pi R)^2] = 3 (b_*\psi_{*,1})^2 + b_*\psi_{*,1}$ — 분모의 second moment 가 expected return ($b_*\psi_{*,1}$) 의 *cubic-like* growth. predictive power 가 클수록 leverage 도 커지므로 SR 가 bounded.

---

다음 파일 [05_method_a_rmt.md](05_method_a_rmt.md) — Section II (Machine Learning + Random Matrix Theory) 의 ridge estimator + Stieltjes transform + Proposition 2 풀이.
