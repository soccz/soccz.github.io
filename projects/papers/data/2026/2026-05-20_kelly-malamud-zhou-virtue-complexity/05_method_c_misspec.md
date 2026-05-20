# 05c. Section IV — Misspecification + Theorem 1 (Virtue of Complexity)

> 논문 Section IV (p.481–487). Assumption 5, Propositions 5·6, **Theorem 1 (Virtue of Complexity)**, Figures 4–6 의 misspecified case 풀이.

---

## 5c.1 챕터 한 줄 요약

**현실: true DGP 는 P-dim 인데 empirical model 은 P₁ ≤ P 의 subset 만 사용 (misspecified). 새 complexity ratio q = P₁/P 도입. Theorem 1 (Virtue of Complexity): sufficiently mixed signals + bounded $\Psi_{1,2}\Psi_{2,1}$ 의 조건 하에서, optimal shrinkage $z_*$ 와 함께 SR(z_*; cq; q) 와 R²(z_*; cq; q) 가 q ∈ [0,1] 에서 strictly monotone increasing and concave. 이게 본 논문의 main theoretical result — "use the largest model you can compute".**

---

## 5c.2 도입 — 왜 misspecification 이 핵심인가

> **원문 (p.481)**: "So far we have studied the behavior of machine learning portfolios as a function of the complexity of the true DGP while assuming we have the correctly specified model. Under correct specification, the complexity comparative statics in Figures 1 to 3 change both the empirical and the true model as we vary $c$, and thus, these theoretical comparative statics cannot be taken to the data. Nevertheless, theory grounded on correct model specification is powerful for developing a conceptual understanding of machine learning portfolios.
>
> A more empirically relevant theoretical setting would consider a single true DGP. It would then consider empirical models that are always a misspecified approximation to this DGP. Finally, it would consider comparisons by increasing the complexity of the empirical model to achieve an increasingly accurate approximation of the true DGP. We develop this theory now."

**핵심 패러다임 전환**:
- *Correctly specified* (Section III): true DGP 변화시키며 비교 — 이론적 이해.
- *Misspecified* (Section IV): **true DGP fix**, empirical model 의 complexity 만 변화시키며 비교 — 데이터 분석에 적용 가능.

---

## 5c.3 새 분할 — Observed vs Unobserved signals

> **원문 (p.481)**: "We consider a true DGP with $P$ predictors. We consider an expanding set of empirical models to approximate the DGP. Each model is indexed by $P_1 = 1, \ldots, P$ and corresponds to an economic agent observing only a subset of the signals, $S_t^{(1)} = (S_{i,t})_{i=1}^{P_1}$. We use $S_t^{(2)} = (S_{i,t})_{i=P_1+1}^P$ to denote the remaining unobserved signals. The signal covariance matrix corresponding to this partition is
>
> $$\Psi = \begin{pmatrix} \Psi_{1,1} & \Psi_{1,2} \\ \Psi_{1,2}' & \Psi_{2,2} \end{pmatrix}.$$
>
> Naturally, misspecified estimator behavior depends on the correlation structure between observed and unobserved signals captured by the off-diagonal blocks of $\Psi$."

**기호 뜻**:
- $P_1$ — empirical model 에서 *관측되는* signal 수 ($1 \le P_1 \le P$).
- $P$ — true DGP 의 *전체* signal 수.
- $S^{(1)}$ — observed signals ($P_1$-dim).
- $S^{(2)}$ — unobserved signals ($P - P_1$ dim).
- $\Psi_{1,1}$ — observed signals 의 covariance ($P_1 \times P_1$).
- $\Psi_{2,2}$ — unobserved signals 의 covariance.
- $\Psi_{1,2}$ — observed-unobserved cross-covariance.

**일상 비유**:
경제학자가 시장 수익률 예측에 15 개 macro 변수를 사용한다고 하자. 진짜 시장 수익률은 사실 1000 개 변수에 의존 ($P = 1000$). 경제학자는 그 중 15 개만 ($P_1 = 15$). 나머지 985 개는 unobserved. observed 와 unobserved 사이 correlation ($\Psi_{1,2}$) 에 따라 모델 동작 변화.

---

## 5c.4 Assumption 5 — Empirical signals 의 eigenvalue 분포

> **원문 (p.481)**: "We make the following technical assumption, which ensures that estimators in the machine learning regime have well-behaved limits.
>
> **ASSUMPTION 5**: *For any sequence $P_1 \to \infty$ such that $P_1/P = q > 0$, the eigenvalue distribution of the matrix $\Psi_{1,1}$ converges to a nonrandom probability distribution $H(x; q)$. We say that signals are sufficiently mixed if $H(x; q)$ is independent of $q$. We also use*
>
> $$\psi_{*,k}(q) = \lim_{P_1 \to \infty} P_1^{-1} \text{tr}(\Psi_{1,1}^k) \quad k \ge 1,$$
>
> *to denote asymptotic moments of the eigenvalues of $\Psi_{1,1}$.*"

**기호 뜻**:
- $q = P_1 / P$ — empirical/true ratio. $q \in (0, 1]$.
- $H(x; q)$ — limiting eigenvalue distribution of $\Psi_{1,1}$, possibly $q$-dependent.
- $\psi_{*,k}(q) = \lim P_1^{-1} \text{tr}(\Psi_{1,1}^k)$ — $k$-th moment of $\Psi_{1,1}$.
- **Sufficiently mixed**: $H(x; q)$ 가 $q$ 와 무관 — 즉 어떤 $P_1$-subset 을 잡아도 spectral distribution 이 같음.

**일상 비유**:
"random 으로 어떤 subset 의 $P_1$ signal 을 골라도 그 covariance 의 eigenvalue 분포가 같다" 는 가정. RFF 의 random feature 가 이를 만족 (모든 feature 가 같은 random distribution).

**왜 이 form**:
- *Sufficiently mixed* 조건이 단순화 — H 가 q-independent 이면 Section III 의 결과 형식으로 reduction.
- RFF + isotropic $\beta$ (Assumption 4) 의 combination 이 자연스럽게 mixed.

**조심할 점**:
- Mixed 조건은 RFF 같은 random feature 에 자연. 자연적 macro variable (15 Goyal-Welch) 는 strictly mixed 아닐 수도. RFF 로 변환하면서 mixed 됨.
- Mixed 가 아닌 경우엔 일반화된 Proposition 5 form 이 적용.

---

## 5c.5 Misspecified ridge estimator

> **원문 (p.481)**: "In a misspecified model, the (regularized) least-squares estimator is
>
> $$\hat\beta(z; q) = (zI + \hat\Psi_{1,1})^{-1} \frac{1}{T} \sum_t S_t^{(1)} R_{t+1} \in \mathbb{R}^{P_1},$$
>
> where
>
> $$\hat\Psi_{1,1} = T^{-1} \sum_t S_t^{(1)} (S_t^{(1)})' \in \mathbb{R}^{P_1 \times P_1}.$$"

**기호 뜻**:
- $\hat\beta(z; q) \in \mathbb{R}^{P_1}$ — misspecified ridge estimator ($P_1$-dim, smaller than true $\beta \in \mathbb{R}^P$).
- $\hat\Psi_{1,1}$ — empirical model 의 sample covariance.

### Auxiliary objects — observed-unobserved correlation traces

> **원문 (p.482)**: "We also introduce the following auxiliary objects:
>
> $$\xi_{2,1}(z; cq; q) = \lim_{T \to \infty} T^{-1} \text{tr} E[(zI + \hat\Psi_{1,1})^{-1} \Psi_{1,2} \Psi_{1,2}'] \ge 0, \quad (17)$$
>
> $$\widehat{\xi}_{2,1}(z; cq; q) = \lim_{T \to \infty} T^{-1} \text{tr} E[(zI + \hat\Psi_{1,1})^{-1} \Psi_{1,1} (zI + \hat\Psi_{1,1})^{-1} \Psi_{1,2} \Psi_{1,2}'] \ge 0.$$
>
> The quantities in (17) account for covariances between observed and unobserved signals. While the existence of the limits in (17) cannot be guaranteed in general, the expectations are uniformly bounded for $z > 0$ (as the $\Psi$ matrices are uniformly bounded for $z > 0$). Hence, by passing to a subsequence of $T, P$, we can always assume that the limits in (17) exist. In the Internet Appendix, we show that these limits actually exist for a class of correlation structures."

**기호 뜻**:
- $\xi_{2,1}(z; cq; q) \ge 0$ — trace of resolvent applied to $\Psi_{1,2}\Psi_{1,2}'$. observed-unobserved correlation 의 기여.
- $\widehat{\xi}_{2,1}$ — 더 복잡한 form. squared resolvent.

→ 이들 quantity 가 misspecification gap 의 정량적 measure.

---

## 5c.6 Proposition 5 — Misspecified case 의 모든 limit

### Proposition 5 stmt

> **원문 (p.482)**: "With the additional assumptions for the misspecified setting in place, we have the following analog of Propositions 2, 3, and 4.
>
> **PROPOSITION 5**: *In the limit $T, P, P_1 \to \infty$, $P/T \to c$, and $P_1/P \to q \in (0, 1]$,*
>
> $$\lim_{T \to \infty} \frac{1}{T} \text{tr}((zI + \hat\Psi_{1,1})^{-1} \Psi_{1,1}) \to \xi(z; cq; q)$$
>
> *in probability, where*
>
> $$\xi(z; cq; q) = \frac{1 - z m(-z; cq; q)}{(cq)^{-1} - 1 + z m(-z; cq; q)}$$
>
> *and*
>
> $$m(-z; cq; q) = \lim P_1^{-1} \text{tr}((zI + \hat\Psi_{1,1})^{-1}).$$
>
> *Furthermore,*
>
> $$\nu(z; cq; q) = \psi_{*,1}(q) - (qc)^{-1} z \xi(z; cq; q) > 0,$$
>
> $$\nu'(z; cq; q) = -(qc)^{-1}(\xi(z; cq; q) + z \xi'(z; cq; q)) < 0,$$
>
> $$\hat\nu(z; cq; q) = \nu(z; cq; q) + z \nu'(z; cq; q) > 0.$$"

**기호 뜻**:
- $\xi(z; cq; q)$ — Proposition 2 의 generalization. arguments: ($z$, **empirical complexity** $cq = P_1/T$, **misspec ratio** $q = P_1/P$).
- $m(-z; cq; q)$ — empirical Stieltjes of $\hat\Psi_{1,1}$.
- $\nu, \nu', \hat\nu$ — Proposition 3 의 generalization (with $\Psi_{1,1}$ instead of $\Psi$).

**핵심**:
- 이 모든 quantity 가 Proposition 2/3 의 form 과 동일 — 단지 $\Psi \to \Psi_{1,1}$, $c \to cq$ 변경.
- **Sufficiently mixed** 가정 하에서.

### Proposition 5 (i)-(v): 모든 portfolio quantity

> **원문 (p.482)**: "*In addition, we have*
>
> *(i) The expected return on the market timing strategy converges in probability to*
>
> $$\mathcal{E}(z; cq; q) := \lim E[\hat\pi_t(z) R_{t+1} | \hat\beta] = b_* q \left(\nu(z; cq; q) + \frac{(cq)^{-1} \xi_{2,1}(z; cq; q)}{1 + \xi(z; cq; q)}\right).$$
>
> *(ii) Expected leverage converges in probability to*
>
> $$\mathcal{L}(z; cq; q) := \lim E[\hat\pi_t(z)^2 | \hat\beta] = q(b_* \hat\nu(z; cq; q) - c(1 + b_*(\psi_{*,1}(1) - q \psi_{*,1}(q)))\nu'(z; cq; q)) + \Delta(z; cq; q),$$
>
> *where*
>
> $$\Delta(z; cq; q) = b_* \frac{(qc)^{-1} \widehat{\xi}_{2,1}(z; cq; q) + 2(1 + \xi(z; cq; q))\nu'(z; cq; q) \xi_{2,1}(z; cq; q)}{(1 + \xi(z; cq; q))^2}.$$
>
> *(iii) $R^2$ converges in probability to*
>
> $$R^2(z; cq; q) = \frac{2 \mathcal{E}(z; cq; q) - \mathcal{L}(z; cq; q)}{1 + b_* \psi_{*,1}(1)}. \quad (18)$$
>
> *(iv) The second moment of the market timing strategy converges in probability to*
>
> $$\mathcal{V}(z; cq; q) := \lim E[(\hat\pi_t(z) R_{t+1})^2] = 2(\mathcal{E}(z; cq; q))^2 + (1 + b_* \psi_{*,1}(1)) \mathcal{L}(z; cq; q).$$
>
> *(v) And, as a result, the Sharpe ratio satisfies*
>
> $$SR(z; cq; q) = \frac{\mathcal{E}(z; cq; q)}{\sqrt{\mathcal{V}(z; cq; q)}} = \frac{1}{\sqrt{2 + (1 + b_* \psi_{*,1}(1)) \frac{\mathcal{L}(z; cq; q)}{(\mathcal{E}(z; cq; q))^2}}}.$$"

**핵심 식**들:

| Quantity | Limit |
|----------|-------|
| Expected return $\mathcal{E}(z;cq;q)$ | $b_* q (\nu + (cq)^{-1} \xi_{2,1}/(1+\xi))$ |
| Leverage $\mathcal{L}(z;cq;q)$ | $q(b_*\hat\nu - c \cdots \nu') + \Delta$ |
| OOS R² | $(2\mathcal{E} - \mathcal{L}) / (1 + b_*\psi_{*,1}(1))$ |
| Second moment | $2 \mathcal{E}^2 + (1 + b_*\psi_{*,1}(1)) \mathcal{L}$ |
| Sharpe ratio | $\mathcal{E}/\sqrt{\mathcal{V}}$ |

**왜 이 form** (직관):
- Expected return $\mathcal{E}$: 첫 term ($b_* q \nu$) 는 observed signals 만 사용했을 때 Section III form (with effective complexity $cq$). 두 번째 term ($(cq)^{-1} \xi_{2,1}/(1+\xi)$) 은 observed-unobserved correlation 으로 인한 추가 contribution.
- Leverage $\mathcal{L}$: 마찬가지로 Section III form + $\Delta$ (correlation 의 효과).
- $\Delta$: $\xi_{2,1}$ 과 $\widehat\xi_{2,1}$ 의 nonlinear combination.

**조심할 점**:
- $q = 1$ 이면 correctly specified case 와 동일 (Proposition 3, 4 reduction).
- $\xi_{2,1} = 0$ 이면 (no observed-unobserved correlation) misspecification 의 영향이 사라짐.

---

## 5c.7 Proposition 6 — 단순화 case (no cross-correlation)

> **원문 (p.483)**: "In general, the behavior of the quantities in Proposition 5 depends in complex fashion on the correlations between observable and unobservable signals, as captured by the quantities (17). When both quantities (17) are zero, the expressions simplify significantly. It is straightforward to show that both quantities in (17) are zero if the matrices $\Psi_{1,2}, \Psi_{2,1}$ have uniformly bounded traces. For example, this is when $\Psi_{1,2}$ has a finite, uniformly bounded rank when $P, P_1 \to \infty$ (due to, say, a finite-dimensional factor structure in the signals). We thus obtain the following result.
>
> **PROPOSITION 6**: *Suppose that $\text{tr}(\Psi_{1,2} \Psi_{2,1}) = o(P)$.³² Then, $\xi_{2,1} = \widehat\xi_{2,1} = 0$. Furthermore,*
>
> *(i) $\mathcal{E}(z; cq; q)$ is monotone decreasing in $z$ and hence $0 < \mathcal{E}(z; cq; q) < \mathcal{E}(0; cq; q) < \mathcal{E}(0, 0; 0)$.*
>
> *(ii) Both $R^2(z; cq; q)$ and $SR(z; cq; q)$ are monotone increasing in $z$ for $z < z_* = c(1 + b_*(\psi_{*,1}(1) - q \psi_{*,1}(q)))/b_*$ and monotone decreasing in $z$ for $z > z_*$.*
>
> *(iii) And in the ridgeless limit as $z \to 0$, we have*
>
> $$\mathcal{E}(0; cq; q) = b_* q (\psi_{*,1}(q) - (cq)^{-1 \cdot 2} m_*(cq; q)^{-1} \mathbf{1}_{q > 1/c}),$$
>
> $$\mathcal{L}(0; cq; q) = \mathcal{E}(0; cq; q) + (1 + b_*(\psi_{*,1}(1) - q \psi_{*,1}(q))) \begin{cases} ((cq)^{-1} - 1)^{-1}, & q < 1/c \\ \bar\mu(cq; q), & q > 1/c, \end{cases}$$
>
> $$\mathcal{V}(0; cq; q) = 2(\mathcal{E}(0; cq; q))^2 + (1 + b_* \psi_{*,1}(1)) \mathcal{L}(0; cq; q),$$
>
> $$SR(0; cq; q) = \frac{\mathcal{E}(0; cq; q)}{\sqrt{\mathcal{V}(0; cq; q)}}$$
>
> *for some $m_*(cq; q) > 0$ and some $\bar\mu(cq; q) < 0$ with $\bar\mu(1+; c) = -\infty$. In particular, if $\Psi$ is proportional to the identity matrix, $\Psi = \psi_{*,1} I$, then*
>
> $$\mathcal{E}(0; cq; q) = b_* \psi_{*,1} \min\{q, c^{-1}\} \quad (19)$$
>
> *is constant for $q > 1/c$.*"

**Proposition 6 의 의의**:
- $\Psi_{1,2}$ 가 *finite rank* (또는 trace o(P)) 이면 cross-correlation 의 영향 0.
- 그러면 Proposition 6 의 closed form (혹은 매우 단순한 form).
- **(ii) 가 핵심**: $R^2$, $SR$ 가 $z$ 에 대해 **unimodal** (z_* 에서 max). same form as Proposition 4 but for misspecified.

각주 32: "*This is the case, for example, when $\Psi_P = D_P + Q_P$, where $\lim \sup_{P \to \infty} \text{rank} Q_P < \infty$, while $D_P$, $Q_P$ are diagonal matrices and $D_P$, $Q_P$ are uniformly bounded. In this case, we can replace $\Psi_P$ with $D_P$ in all expressions. Perhaps more tangibly, this condition obtains when the signals satisfy a finite-dimensional factor structure. Furthermore, if the signals have similar idiosyncratic variance, they satisfy the necessary mixing condition.*"

→ **Finite-dimensional factor structure**: signals 가 factor model 형태 ($\Psi = D + QQ'$ where $\text{rank}(Q)$ finite) 이면 cross-correlation 무시 가능.

### Ridgeless 의 명시적 form (Equation 19)

$\Psi = \psi_{*,1} I$ (isotropic) 의 case 에서 ridgeless expected return:

$$\boxed{\mathcal{E}(0; cq; q) = b_* \psi_{*,1} \min\{q, c^{-1}\}}$$

- $q < c^{-1}$ (i.e., $cq < 1$, empirical model not at interpolation): $\mathcal{E} = b_* \psi_{*,1} q$, **linear in q** (monotone increasing).
- $q > c^{-1}$ (i.e., $cq > 1$, ridgeless regime): $\mathcal{E} = b_* \psi_{*,1} c^{-1}$, **constant**.

→ Ridgeless expected return 이 $q = 1/c$ 에서 peak 하고 그 이후 flat.

---

## 5c.8 Section III.B vs IV — 본질적 차이

> **원문 (p.484)**: "The comparative statics of Section III.B highlight how, even when the empirical model is correctly specified, complexity hinders the model's ability to hone in on the true DGP because there is not enough data to support the model's heavy parameterization. That analysis shows that when models are correctly specified, the best performance (in terms of $R^2$ and Sharpe ratio) comes from simple models. Naturally, a small correctly specified model will converge on the truth faster than a large correctly specified model. But this is not a very helpful comparison.
>
> The fundamental difference in this section is that while raising $cq$ brings the usual statistical challenges of heavy parameterization without much data, the added complexity also brings the benefit of improving the empirical model's approximation of the true DGP. A simple model will tend to suffer from poor approximation and thus fare poorly in terms of both statistical metrics like $R^2$ and portfolio metrics like the expected return and Sharpe ratio. Thus, our misspecification analysis tackles the most important question about high complexity: Does the improvement in approximation justify the statistical cost of heavy parameterization when it comes to out-of-sample forecast and portfolio performance? The answer is yes, as established by the following theorem."

**핵심 본질의 차이**:
- *Section III* (correctly specified, $q = 1$ implicit): complexity 가 *statistical cost* 만 가져옴 (data 부족). **Simple > complex**.
- *Section IV* (misspecified): complexity ($q$ 증가) 가 *statistical cost* + **approximation benefit** 둘 다. **Complex > simple** if approximation 효과가 더 큼.
- 본 논문의 main question: approximation 효과가 statistical cost 를 능가하나? 답: **YES** (Theorem 1).

---

## 5c.9 Theorem 1 — Virtue of Complexity (본 논문의 main result)

### Theorem 1 stmt

> **원문 (p.484)**: "**THEOREM 1** (*Virtue of Complexity*): *Suppose that signals are sufficiently mixed (so that $H(x; q)$ does not depend on $q$) and $\text{tr}(\Psi_{1,2} \Psi_{2,1}) = o(P)$. Then, with the optimal amount of shrinkage $z_*$, the Sharpe ratio $SR(z_*(q; c); cq; q)$ and $R^2(z_*(q; c); cq; q)$ are strictly monotone increasing and concave in $q \in [0, 1]$.*"

**핵심 식**:

$$\boxed{\frac{\partial SR(z_*; cq; q)}{\partial q} > 0, \quad \frac{\partial^2 SR(z_*; cq; q)}{\partial q^2} < 0, \quad \forall q \in [0, 1]}$$

**기호 뜻**:
- $z_*(q; c)$ — q 에 따른 optimal shrinkage. Closed form (Proposition 6 (ii)).
- $SR(z_*; cq; q)$ — optimal-shrinkage Sharpe ratio.
- **Strictly monotone increasing** — q 증가 (empirical model 복잡도 증가) → SR 증가.
- **Concave** — increment 가 점차 감소 (diminishing returns).

**조건**:
1. **Sufficiently mixed** signals: $H(x; q)$ 가 $q$ 무관.
2. **Bounded cross-correlation**: $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ — finite-dim factor structure.

**일상 비유**:
"내가 사용할 수 있는 모든 predictor 를 다 사용하고, 적절한 ridge 만 더하면, 그 predictor 수에 비례해서 Sharpe ratio 가 좋아진다. 단, 추가 효과는 점차 감소."

**왜 이 form**:
- 두 효과의 net:
  - (+) Approximation gain — $P_1$ 늘릴수록 true DGP 의 더 큰 fraction 을 capture.
  - (-) Statistical cost — heavier parameterization, variance 증가.
- Optimal shrinkage $z_*$ 가 statistical cost 를 효과적으로 mitigate.
- Net effect: monotone increasing.

**조심할 점**:
- *With optimal shrinkage* 가 핵심 조건. ridgeless 에서는 Theorem 1 보장 안 됨 (double descent 의 hump 발생).
- Sufficiently mixed + bounded cross-correlation 도 핵심.

### 본 논문의 main theoretical result

**의의**: Theorem 1 은 본 논문의 *central message* — **"Use the largest model you can compute"** 의 수학적 정당화.

각 deep dive 영역의 핵심 정리:
- RP-PCA (Lettau-Pelger): phase transition + Sharpe ratio 2x.
- Autoencoder AP (Gu-Kelly-Xiu): conditional autoencoder consistency.
- DLAP (Chen-Pelger-Zhu): no-arbitrage GAN equilibrium.
- **VoC (Kelly-Malamud-Zhou): Theorem 1 — monotone SR in complexity**.

---

## 5c.10 Figures 4, 5, 6 — Misspecified VoC curves

> **원문 (p.484)**: "Figures 4, 5, and 6 illustrate the behavior of misspecified machine learning predictions and portfolios derived in Proposition 5. In this calibration, the true unknown DGP is assumed to have a complexity of $c = 10$. We continue to calibrate $\Psi$ as identity and $b_* = 0.2$. We analyze the behavior of approximating empirical models that range in complexity from very simple ($cq \approx 0$ and thus severely misspecified) to highly complex ($q = 1$, $cq = 10$ and thus correctly specified). The left panel of Figure 4 shows the expected out-of-sample $R^2$. The cost of misspecification for low $c$ is seen as a shift downward in the $R^2$ relative to Figure 1. The challenges of model complexity highlighted in previous sections play an important role here as well. Intermediate levels of complexity ($cq \approx 1$) dilate the size of beta estimates (Figure 4, right panel), driving down the $R^2$ and inflating portfolio volatility (Figure 5, right panel). These effects abate once again for $cq > 1$ due to the implicit regularization of high-complexity ridgeless regression, just as in the earlier analysis. More generally, the patterns for $R^2$, $\hat\beta$ norm, and portfolio volatility share similar qualitative patterns as those in Figure 1."

### Figure 6 — **본 논문의 가장 중요한 그림**

![Figure 6 — Expected out-of-sample Sharpe ratio from misspecified models](figures/page28_Fig6_misspec_monotone.png)

*원문 p.486 Figure 6 — Sharpe ratio vs $cq$ for various $z$. True DGP complexity $c = 10$, $\Psi = I$, $b_* = 0.2$. 모든 $z$ 에서 Sharpe **단조 증가 in $cq$** (Theorem 1 의 시각화). Ridgeless 에서 $cq = 1$ 부근 약한 dip 있지만 단조 증가 추세.*

> **원문 (p.486)**: "The most important difference compared to Figure 1 is the pattern for the out-of-sample expected return of the market timing strategy (Figure 5, left panel). Expected returns are now low for simple strategies due to their poor approximation of the DGP. Increasing model complexity monotonically increases expected timing returns. In the ridgeless case, the benefit of added complexity reaches its maximum of $\mathcal{E}(0; 1; c^{-1}) = b_* \psi_{*,1} c^{-1}$ when $cq = 1$. A surprising fact is that the ridgeless expected return is exactly flat as complexity rises beyond $cq = 1$, in which case the benefits of incremental improvements in DGP approximation are exactly offset by the gradually rising bias of ridgeless shrinkage; see formula (19).
>
> This new fact that the expected return rises monotonically with model complexity in the misspecified setting induces a similar pattern in the out-of-sample Sharpe ratio, shown in Figure 6. Rather than decreasing in complexity as we saw in the correctly specified setting, the expected return improvement from additional complexity leads the Sharpe ratio to also increase with complexity. Consistent with Theorem 1, this is particularly true with nontrivial ridge shrinkage but is even true in the ridgeless case as long as $cq$ is sufficiently far from unity. In summary, in the realistic case of misspecified empirical models, complexity is a virtue. It improves the expected out-of-sample market timing performance in terms of both expected return and Sharpe ratio."

**Misspecified 의 결정적 차이**:
- Expected return 이 **$q$ 의 monotone increasing** (Equation 19).
- 그 결과 Sharpe ratio 도 monotone increasing (Theorem 1).
- *Correctly specified* 에서는 SR 이 $c \to 1$ 부근에서 dip.
- *Misspecified* 에서는 monotone 증가 — **이게 본 논문의 가장 강력한 그림**.

```viz:voc-misspec-monotone:title=Theorem 1 시각화 — SR monotone in q (★ deep dive preview),caption=cq 슬라이더로 empirical complexity, z 슬라이더로 shrinkage. **모든 z 에서 Sharpe ratio 가 cq 의 monotone increasing** (Theorem 1). Ridgeless 에서 cq=1 약한 dip (double ascent), z>0 에서 smooth (permanent ascent). True DGP c=10 고정. 본 논문 가장 핵심 그림.
```

### Double descent vs permanent ascent

> **원문 (p.486)**: "It is instructive to compare our findings with the phenomenon of double descent, where by absent regularization, out-of-sample MSE has a nonmonotonic pattern in model complexity (Belkin et al. (2019), Hastie et al. (2022)). The mirror image of double descent in MSE is the 'double ascent' behavior of the ridgeless Sharpe ratio (Figure 6). As Theorem 1 shows, Sharpe ratio double ascent is an artifact of insufficient shrinkage. With the right amount of shrinkage, complexity becomes a virtue even in the low-complexity regime (when $cq < 1$): The hump disappears, and 'double ascent' turns into 'permanent ascent.'"

**개념 명명**:
- **Double descent** (통계학): MSE 가 $cq = 1$ 에서 hump 하고 양쪽으로 다시 감소.
- **Double ascent** (본 논문, ridgeless): SR 이 $cq = 1$ 양쪽에서 증가 (dip 만 있음).
- **Permanent ascent** (본 논문, optimal shrinkage $z_*$): SR 이 monotone increasing — hump 사라짐. **Theorem 1**.

→ **충분한 shrinkage 만 더해주면 "double" 안 가고 "permanent" ascent**.

---

## 5c.11 Misspecified case 의 의의

**왜 misspecification 이 main result 인가**:

1. **현실 적합성**: 실제로 우리는 true DGP 의 일부만 capture. predictor 가 충분하지 않음 → misspecified 가 default.
2. **추가 trade-off**: approximation benefit 이 statistical cost 와 trade-off — 이게 *진짜* trade-off.
3. **Empirical mapping**: Section V 의 실증 (Goyal-Welch 15 → RFF P=12,000) 이 exactly misspecified case. true DGP 는 무엇인지 모르지만, 우리가 RFF P 늘리는 게 $q$ 증가 와 같음.
4. **"Virtue of Complexity" 의 진정한 의미**: complex model 이 **simple model 보다 더 좋은 approximation**. statistical cost 를 능가하는 approximation gain.

---

## 5c.12 한 그림으로 (misspecified VoC)

```
                    True DGP
                P-dim signals: S = (S^{(1)}, S^{(2)})'
                Covariance:  Ψ = [Ψ_11  Ψ_12 ]
                              [Ψ_21  Ψ_22 ]
                                  ↓
                Empirical model: 
                S^{(1)} 만 사용 (P_1 ≤ P 차원)
                ridge ℬ̂(z;q) = (zI + Ψ̂_11)^{-1} ...
                                  ↓
                q = P_1/P  (misspec ratio)
                cq = P_1/T (empirical complexity)
                                  ↓
                ASSUMPTION 5: H(x;q) (mixed if q-indep)
                                  ↓
                PROPOSITION 5: All limits in terms of m(-z;cq;q), ξ, ξ_{2,1}
                                  ↓
                PROPOSITION 6: tr(Ψ_12 Ψ_21) = o(P) → ξ_{2,1} = 0
                                  ↓
                          ┌─────────────┐
                          │  THEOREM 1  │
                          │   (Virtue)  │
                          └──────┬──────┘
                                  ↓
              SR(z_*; cq; q), R²(z_*; cq; q) 
              strictly monotone increasing + concave in q
                                  ↓
                "Use the largest model you can compute"
                                  ↓
              Ridgeless: "double ascent" (Sharpe hump at cq=1)
              z_*: "permanent ascent" (no hump, smooth)
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Correctly specified (Section III) vs Misspecified (Section IV) 의 본질적 차이?**
2. **Theorem 1 의 정확한 stmt 와 조건?**
3. **"Double ascent" vs "Permanent ascent" 의 의미?**

### 답변
1. *Correctly specified*: complexity $c$ 변화시 empirical 과 true 양쪽이 동시에 변함. statistical cost (data 부족) 만 영향 — simple > complex. *Misspecified*: true DGP fix 하고 empirical model complexity $q = P_1/P$ 만 변화. statistical cost + **approximation gain** 동시. complex > simple if approximation 효과가 cost 능가. **본 논문 main result 인 Theorem 1 이 후자에서만 성립**.
2. **Theorem 1**: signals sufficiently mixed ($H(x;q)$ 가 $q$ 무관) + $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ (finite-dim cross-correlation) 의 조건 하에서, **optimal shrinkage $z_*(q;c)$ 와 함께** $SR(z_*; cq; q)$ 와 $R^2(z_*; cq; q)$ 가 $q \in [0,1]$ 에서 strictly monotone increasing and concave. 즉 empirical model 의 complexity 를 끝까지 키울수록 SR 가 단조 증가 (단, 추가 효과 감소).
3. **Double ascent** — ridgeless regression 의 OOS Sharpe ratio 가 $cq$ 의 함수로 hump pattern: $cq = 1$ 부근 dip, 그 양쪽으로 다시 증가 (Figure 6 의 black line). **Double descent** (MSE 의 nonmonotone) 의 거울 이미지. **Permanent ascent** — optimal shrinkage $z_*$ 와 함께 SR 가 **monotone increasing** (hump 사라짐, smooth). Theorem 1 의 시각적 implication — *insufficient* shrinkage 가 hump 의 원인, 충분한 shrinkage 면 permanent ascent.

---

다음 파일 [06_simulation.md](06_simulation.md) — Figures 1-6 의 calibrated 이론 시뮬레이션 풀이.
