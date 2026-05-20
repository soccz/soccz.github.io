# 07. Section V — Empirical: 1926–2020 CRSP + RFF + Figures 7–11 + Table I

> 논문 Section V (p.487–499). Data, Random Fourier Features, OOS recursive procedure, Figures 7–11, **Table I (Goyal-Welch comparison)**, Variable importance, robustness. **본 논문의 모든 실증 결과.**

---

## 7.1 챕터 한 줄 요약

**CRSP 1926-2020 월간 시장 수익률 + Goyal-Welch 15 predictor + Random Fourier Features 로 P=2-12,000, T=12/60/120 rolling OOS recursive prediction. 결과: Sharpe ratio 가 모델 복잡도와 함께 단조 증가하여 T=12, c=1000, z=10³ 에서 OOS SR ≈ 0.47 (t≈4.5), IR vs market ≈ 0.31 (t≈2.5), 14/15 NBER recessions 자동 divest — purely OOS. Linear ridgeless kitchen sink (Goyal-Welch original) 는 SR≈-0.11, R²≈-100%. 이 모든 패턴이 Section IV 의 misspecified 이론 (Theorem 1) 과 정확히 일치.**

---

## 7.2 Section V.A — Data

> **원문 (p.487)**: "Our empirical investigation centers on a cornerstone of empirical asset pricing research—forecasting the aggregate stock market return. To make the conclusions from this analysis as easy to digest as possible, we perform our analysis in a conventional setting with conventional data. Our forecast target is the monthly excess return of the CRSP value-weighted index. The information set we use for prediction consists of the 15 predictor variables from Goyal and Welch (2008) available monthly over the sample from 1926 to 2020.³³"

**데이터 요약**:

| 항목 | 값 |
|------|-----|
| Forecast target | CRSP value-weighted index monthly excess return |
| 기간 | 1926–2020 (94 년) |
| Predictors | 15 from Goyal-Welch (2008) + 1 lag market return |
| 표본 | T = 1,140 months (94 × 12), 표준화 후 ≈ 1,091 |

**15 Goyal-Welch predictors** (mnemonics):

| Code | 변수 |
|------|------|
| dfy | Default yield spread |
| infl | Inflation |
| svar | Stock variance |
| de | Dividend-payout ratio |
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
| (+ lag market return) | One-month lagged CRSP return |

각주 33: "*This list includes (using mnemonics from their paper): dfy, infl, svar, de, lty, tms, tbl, dfr, dp, dy, ltr, ep, b/m, and ntis, as well as one lag of the market return. Most of these variables are based on market prices and are available at month end. Our date convention for inflation is that used by Goyal, Welch, and Zafirov (2023) and the data set graciously provided by Amit Goyal. Note that while inflation for month $t$ is typically reported two weeks into month $t+1$, the Goyal, Welch, and Zafirov (2023) date convention views the price data upon which the official inflation statistic is based as part of the time-$t$ information set. We show in Internet Appendix Figure IA2 and Table IA2 that our results are essentially unchanged if we exclude inflation from our analysis.*"

→ Inflation timing convention 은 robustness OK.

> **원문 (p.487)**: "We volatility-standardize returns and predictors using backward-looking standard deviations that preserve the out-of-sample nature of our forecasts. Returns are standardized by their trailing 12-month return standard deviation (to capture their comparatively fast-moving conditional volatility).³⁴ In contrast, predictors are standardized using an expanding window historical standard deviation (given the much higher persistence of most predictors). We require 36 months of data to ensure enough stability in our initial predictor standardization, so the final sample we bring to our analysis began in 1930. We perform this standardization to align the empirical analysis with our homoskedastic theoretical setting. Our results are insensitive to this step—none of our findings are sensitive to variations in how standardizations are implemented."

**Volatility-standardization**:
- Returns: trailing 12-month std (fast-moving conditional vol).
- Predictors: expanding-window std (slow-moving).
- 시작: 1930 (36-month warm-up).

각주 34: "*For returns, we calculate standard deviation from the uncentered second moment due to the noisiness of estimating mean monthly returns in short windows.*"

---

## 7.3 Section V.B — Random Fourier Features (RFF)

> **원문 (p.487)**: "We seek models that take the form of equation (3).³⁵ To evaluate our theory, we also seek a framework that will allow us to smoothly transition from low- to high-complexity models. To do so, we adopt an influential methodology from the machine learning literature known as RFF (Rahimi and Recht (2007), Rahimi and Recht (2008)).³⁶ Let $G_t$ denote our $15 \times 1$ vector of predictors. The RFF methodology converts $G_t$ into a pair of new signals,
>
> $$S_{i,t} = [\sin(\gamma \omega_i' G_t), \cos(\gamma \omega_i' G_t)]', \quad \omega_i \sim i.i.d. N(0, I), \quad (20)$$
>
> where $S_{i,t}$ uses the vector $\omega_i$ to form a random linear combination of $G_t$, which is then fed through the trigonometric functions.³⁷ The advantage of RFF is that for a fixed set of input signals, $G_t$, we can create an arbitrarily large (or small) set of features based on the information in $G_t$ through the nonlinear transformation in (20). If one desires a very low-dimensional model in (3), say $P = 2$, one can generate a single pair of RFFs. For a very high-dimensional model, say $P = 10,000$, one can instead draw many random weight vectors $\omega_i$, $i = 1, \ldots, 5,000$. The larger the number of random features, the richer the approximation that (3) provides to the general functional form $E[R_{t+1} | G_t] = f(G_t)$, where $f$ is some smooth nonlinear function. Indeed, the RFF approach is a wide two-layer neural network with fixed weights in the first layer (in the form of $\omega_i$) and optimized weights in the second layer (in the form of the regression estimates for $\beta$)."

**핵심 RFF 식 (Equation 20)**:

$$\boxed{S_{i,t} = \begin{pmatrix} \sin(\gamma \omega_i' G_t) \\ \cos(\gamma \omega_i' G_t) \end{pmatrix}, \quad \omega_i \sim N(0, I), \quad \gamma = 2}$$

**기호 뜻**:
- $G_t \in \mathbb{R}^{15}$ — Goyal-Welch raw predictors.
- $\omega_i \in \mathbb{R}^{15}$ — random projection vector (iid Gaussian).
- $\gamma$ — bandwidth parameter (Gaussian kernel scale). Default $\gamma = 2$.
- $S_{i,t} \in \mathbb{R}^2$ — $(sin, cos)$ pair (2 features per $\omega_i$).
- $P = 2 K$ — $K$ pairs of RFF.

**일상 비유**:
15 차원 raw predictor 를 **무작위 방향** ($\omega_i$) 으로 dot product → 그 결과를 sin/cos 에 통과 → nonlinear feature. P 개의 random 방향이 P 차원 NN의 hidden layer 와 등가.

**왜 이 form** (Rahimi-Recht 2007):
- Gaussian kernel $K(x, y) = \exp(-\|x-y\|^2/2)$ 의 *random Fourier approximation*.
- $K(x, y) \approx \frac{1}{P} \sum_i [\sin(\gamma \omega_i' x), \cos(\gamma \omega_i' x)] \cdot [\sin(\gamma \omega_i' y), \cos(\gamma \omega_i' y)]'$.
- 즉 RFF 의 inner product 가 kernel 근사. 그래서 RFF + linear regression 이 **kernel regression** 과 등가.
- $P \to \infty$ 면 universal approximator.

**조심할 점**:
- $\gamma$ 가 kernel bandwidth — Section V.F 에서 robustness 확인.
- $\omega_i$ 가 random fixed — 학습 안 됨. 학습은 마지막 $\beta$ 만.

각주 35: "*As in equation (3), we exclude the intercept from our regressions. We show in Internet Appendix Figure IA12 and Table IA1 that our results are essentially unchanged if we include a constant in our high-complexity regressions, the associated intercept is shrunken so heavily that it has no effect on the results reported in Table I.*"

각주 36: "*Rahimi and Recht (2007) describe how RFF approximation accuracy improves as one increases the level of model complexity. In the limit of zero complexity ($P, T \to \infty, P/T \to 0$), RFF regression approximates any sufficiently smooth nonlinear function arbitrarily well. Subsequent papers (see, for example, Rudi and Rosasco (2017)) further characterize rates of convergence. The case of nonzero complexity is less well understood. Recent results (Mei and Montanari (2022), Mei, Misiakiewicz, and Montanari (2022), Ghorbani et al. (2020)) show that, for nonzero complexity, random features methods cannot learn the true function and only learn its projection on a specific functional subspace.*"

각주 37: "*The parameter $\gamma$ controls the Gaussian kernel bandwidth in the generation of RFFs. Random features can be generated in several ways (for a survey, see Liu et al. (2021)). Our choice of functional form in (20) is guided by Sutherland and Schneider (2015), who document tighter error bounds for this functional approximation relative to some alternative random feature formulations. We find, however, that our results are insensitive to using other random feature schemes.*"

---

## 7.4 Section V.C — Out-of-Sample Performance Procedure

> **원문 (p.488)**: "To conduct the empirical analogue of the theoretical analysis in Figures 4, 5, and 6, we consider one-year, five-year, and 10-year rolling training windows ($T = 12, 60$, or $120$) and a large set of RFFs (as high as $P = 12,000$). These choices are guided by our desire to investigate the role of model complexity, defined in the empirical analysis as $c = P/T$. The advantages of short training samples like $T = 12$ are (i) we can reach extreme levels of model complexity with smaller $P$ and thus less computing burden and (ii) it shows that the virtue of complexity can be enjoyed in small samples. But none of our conclusions are sensitive to this choice as we document all of the same patterns for training windows of $T = 60$ and $120$."

**Procedure 4-step**:

1. **Generate 12,000 RFFs** with $\gamma = 2$ (각주 38).
2. **Fix model** with $P \in \{2, \ldots, 12000\}$ features, ridge $\log_{10}(z) \in \{-3, ..., 3\}$. Use first $P$ RFFs (subset).
3. **Recursive OOS prediction + timing** (각주 39):
   - For each $t \in \{T, \ldots, 1091\}$, estimate (3) using $(R_{t-1}, S_{t-1}), \ldots, (R_{t-T+1}, S_{t-T})$.
   - Forecast $\hat\beta' S_t$, timing return $\hat\beta' S_t R_{t+1}$.
4. **Compute** ‖β̂‖², OOS R², SR, alpha, IR (각주 40).

각주 38: "*We set $\gamma = 2$. Our results are generally insensitive to $\gamma$, as discussed in Section V.F.*"

각주 39: "*Prior to estimation, we volatility-standardize the training sample RFFs $\{S_{t-1}, \ldots, S_{t-T}\}$ and out-of-sample RFFs $S_t$ by their standard deviations in the training sample.*"

각주 40: "*Our empirical $R^2$ calculation is one minus the ratio of out-of-sample forecast error variance to out-of-sample realized return variance. Our empirical Sharpe ratio calculation uses the centered standard deviation in the denominator.*"

> **원문 (p.489)**: "The inherent randomness of RFFs means that estimates of out-of-sample performance tend to be noisy for models with low $P$. We therefore repeat the analysis steps from (i) to (iv) 1,000 times with independent draws of the RFFs, and then average the performance statistics across repetitions."

→ **1,000 RFF draws 평균** — Monte Carlo over random features.

```viz:voc-rff-mechanism:title=RFF 메커니즘 (Equation 20),caption=G_t (15차원 macro vector) 를 random ω_i 방향으로 사영 → sin/cos 변환. ω_i ~ N(0,I), γ=2. P=2K pairs 의 RFF. 슬라이더로 G_t 한 component 변화시 RFF 의 sin/cos 진동 표시.
```

---

## 7.5 Figure 7 — T=12 Empirical VoC curves (R², ‖β‖, Expected Return, Volatility)

> **원문 (p.489)**: "The VoC curves in Figures 7 and 8 plot out-of-sample prediction and market timing performance as a function of model complexity and ridge shrinkage for the case $T = 12$. The wide range of complexity that we consider (e.g., $c \in [0, 1000]$ when $T = 12$) can make it difficult to read plots. To better visualize the results while emphasizing both behaviors near the interpolation boundary and behavior for extreme complexity, we break the $x$-axis at an intermediate value of $c$.
>
> The first conclusion from these figures is that the out-of-sample empirical behavior of machine learning predictions is a strikingly close match to the VoC curves predicted by our theory. In particular, compare the empirical results of Figure 7 to the theoretical results under model misspecification from Figure 4. The beta estimates and out-of-sample $R^2$ demonstrate explosiveness at the interpolation boundary and recovery in the high-complexity regime. Figures IA1 and IA2 (reported in the Internet Appendix in the interest of space) document identical patterns for training windows of 60 and 120 months."

**핵심 발견**: 실증 패턴이 misspecified 이론 (Figure 4) 과 **정확히 일치**.

![Figure 7 — Out-of-sample market timing performance T=12 (R², ‖β̂‖, Expected Return, Volatility)](figures/page32_Fig7_T12_panels.png)

*원문 p.490 Figure 7 — T=12, RFF count $P$ 2-12000, $\gamma = 2$. 4 panels: A (R²), B (‖β̂‖), C (Expected Return), D (Volatility). $c$ 의 함수로 plot, $c = 1$ 부근 break (양쪽 50, 990, 1000). 실증 패턴이 Figure 4 (misspecified 이론) 와 정확 일치.*

**Figure 7 panels** (T=12):

| Panel | Content | 패턴 |
|-------|---------|------|
| A | OOS $R^2$ | $c = 1$ 발산 (-100% 이하), $c$ 크면 회복 (~0). Ridge $z$ 클수록 $R^2$ 안정 |
| B | $\|\hat\beta\|$ | $c \approx 1$ spike, $c > 1$ 에서 감소 (smallest norm). Ridge $z$ 큼 → $\|\hat\beta\|$ 작음 |
| C | Expected Return | **단조 증가 in $c$**. $z = 10^{-3}$ ridgeless ~linear 상승 c<1, 그 후 평탄 (Equation 19). 더 큰 $z$ 는 천천히 |
| D | Volatility | $c = 1$ spike, $c > 1$ 감소. $z$ 클수록 volatility 작음 |

> **원문 (p.490)**: "Extreme behavior at the interpolation boundary makes it difficult to fully appreciate the patterns in $R^2$. Figure IA3 in the Internet Appendix provides more detail by plotting the out-of-sample $R^2$ zooming-in on the range $[-10\%, 1\%]$. Here, we see more clearly that high complexity and regularization together produce a positive out-of-sample $R^2$. In this plot, regularization comes in two forms, both directly through higher $z$ and more subtly through higher $c$ (which allows ridgeless regression to find solutions with small $\hat\beta$ norm). For large $z$, the $R^2$ is almost everywhere positive for all training windows."

**핵심 관찰**:
- High $c$ + high $z$ → **positive OOS R²** (zoomed-in IA3).
- Regularization 의 두 form: (i) explicit $z > 0$, (ii) implicit (large $c$ ridgeless).

> **원문 (p.490)**: "The most intriguing aspect of Figure 7 is the clear increasing pattern in out-of-sample expected returns as model complexity rises. For $z = 10^{-3}$, which roughly approximates the ridgeless case, we see a nearly linear upward trend in average returns as $c$ rises from zero to one. Beyond $c = 1$, the ridgeless expected return is nearly flat, just as predicted by equation (19) in Proposition 6. For higher levels of ridge shrinkage, the rise in expected return is more gradual and continues into the range of extreme model complexity."

→ Expected return panel 이 가장 흥미. ridgeless 는 linear ↗ 후 flat (Eq 19 와 정확 일치). ridge 는 gradual ↗ continue.

---

## 7.6 Figure 8 — T=12 Sharpe Ratio + Alpha + IR (★ 본 논문 main empirical result)

![Figure 8 — Out-of-sample market timing performance (T=12)](figures/page33_Fig8_empirical_sharpe.png)

*원문 p.491 Figure 8 — T=12. Panel A: Sharpe ratio. Panel B: Alpha. Panel C: IR vs market. Panel D: Alpha t-statistic. **모두 단조 증가 in $c$**, ~0.4 + Sharpe achievable, IR 0.3 + 고복잡도. Theorem 1 의 실증 일치.*

> **원문 (p.491)**: "Internet Appendix Figures IA1 and IA2 again document an identical expected return pattern for longer training windows.
>
> The increasing pattern in out-of-sample expected return and the decreasing pattern in volatility above $c = 1$ translate into a generally increasing pattern in the out-of-sample market-timing Sharpe ratio, shown in Figure 8. The exception is a brief dip near $c = 1$ at low levels of regularization as the spike in variance compresses the Sharpe ratio. For high complexity, the Sharpe ratio generally exceeds 0.4."

**Panel A (Sharpe ratio)**:
- 모든 $z$: $c$ 의 monotone increasing.
- ridgeless ($z = 10^{-3}$): $c = 1$ 부근 dip (double ascent).
- $z \ge 1$: smooth monotone (permanent ascent).
- 고복잡도 ($c \to 1000$): **SR > 0.4** for $z = 10^{-2}$ to $z = 1$.

> **원문 (p.491)**: "In our theoretical setting, we normalize the expected return of the untimed asset to zero. This is not the case of course for the U.S. market return. Therefore, to adjust for buy-and-hold market exposure, we calculate the out-of-sample alpha, alpha $t$-statistic, and information ratio (IR) of the timing strategy via time-series regression on the untimed market. Figure 8 shows that the market timing alpha and IR inherit the same patterns as the average return and Sharpe ratio. In the high-complexity regime, we find IRs around 0.3 and significant alpha $t$-statistics ranging from 2.6 to 2.9 depending on the amount of ridge shrinkage. Figure 9 repeats this analysis for training windows of 60 and 120 months, where we find similar IRs of roughly 0.25 with $t$-statistics above 2.0 for high-complexity models."

**Buy-and-hold adjustment**:
- Alpha = excess return after regressing timing on market.
- IR = alpha / residual std.

**Panel B (Alpha)**:
- 고복잡도: alpha $\approx 0.025$/month (≈ 30 bps/month).

**Panel C (IR vs market)**:
- 고복잡도: IR $\approx 0.3$.

**Panel D (Alpha t-statistic)**:
- 고복잡도: t-stat $\approx 2.6-2.9$. Statistically significant.

```viz:voc-empirical-sharpe:title=Figure 8 — 실증 Sharpe + Alpha + IR + t-stat (interactive),caption=T 토글 (12/60/120), z 슬라이더, c 슬라이더. Sharpe / alpha / IR / t-stat 4-panel display. 단조 증가 패턴 확인. Theorem 1 의 실증 일치.
```

### Figure 9 (T=60, 120) — Longer training windows

![Figure 9 — Out-of-sample market timing performance (T=60, 120)](figures/page34_Fig9_T60_120.png)

*원문 p.492 Figure 9 — IR + t-stat panels for T=60 (top: A IR, B t-stat) and T=120 (bottom: C IR, D t-stat). $cT$ range: T=60 은 [0, 200], T=120 은 [0, 100]. 같은 monotone increasing 패턴. IR ≈ 0.25, t-stat > 2.0 고복잡도. T=12 보다 작은 magnitude (각주 41 의 "leverage 가 작아짐") 지만 동일 정성적 패턴.*

---

## 7.7 Figure 10 — Market Timing Positions (★ NBER recessions 14/15)

![Figure 10 — Market timing positions](figures/page35_Fig10_positions_recession.png)

*원문 p.493 Figure 10 — Three lines: $\hat\pi$ for T=12 (파란), T=60 (빨강), T=120 (주황). $P = 12,000$, $z = 10^3$, $\gamma = 2$. Positions averaged across 1,000 RFF draws. Six-month moving average for readability. NBER recession gray-shaded. **14 out of 15 recessions 에서 timing 이 시장 비중 줄임 (purely OOS, no constraint)**.*

> **원문 (p.492)**: "What do market timing strategies look like in the high-complexity regime? Figure 10 plots $\hat\pi_t(z, c)$ for the highest complexity and shrinkage configurations of our empirical model ($P = 12,000$ and $z = 10^3$), averaged across 1,000 sets of random feature weights. The three lines correspond to training windows of 12, 60, and 120 months. Positions show the same patterns for all training windows; their time-series correlations are 90% (T = 12 with T = 60), 87% (T = 12 with T = 120), and 97% (T = 60 with T = 120).⁴¹ The plot shows six-month moving averages of raw positions for better readability (our trading results are based on the raw positions and not the moving averages)."

각주 41: "*While the time-series patterns in positions are the same for all training windows, the scale of positions is smaller for longer training windows. This is because the 'leverage' of a strategy is driven by the norm of beta, and this is typically smaller for larger T.*"

> **원문 (p.493)**: "The timing positions in Figure 10 are remarkable. First, they show that the high-complexity strategy is long-only at heart. Negative bets are infrequent and small relative to positive bets. The machine learning model thus heeds the guidance of Campbell and Thompson (2008) 'that many predictive regressions beat the historical average return, once weak restrictions are imposed on the signs of coefficients and return forecasts.' However, unlike Campbell and Thompson (2008), the machine seems to learn this rule without being given an explicit constraint.⁴²
>
> Second, the machine learning strategy learns to divest leading up to recessions. NBER recession dates are shown in the gray-shaded regions. For 14 out of 15 recessions in our test sample, the timing strategy substantially reduces its position in the market before the recession (the exception is the eight-month recession of 1945). And it does this on a purely out-of-sample basis."

**두 핵심 발견**:

1. **Long-only at heart**: 음의 position 드물고 작음. Campbell-Thompson (2008) 의 nonnegativity constraint 와 일치 — **constraint 없이 학습**.
2. **14/15 NBER recessions divest**: timing 이 침체 전 시장 비중 자동 감소. 유일 exception: 1945 (8-month, WWII 직후).

각주 42: "*Strictly imposing the Campbell and Thompson (2008) constraint boosts the Sharpe ratio from 0.47 to 0.54 in the T = 12 case, from 0.42 to 0.50 for T = 60, and from 0.41 to 0.49 for T = 120.*"

→ Campbell-Thompson constraint 명시적 부과 시 SR 추가 향상 0.47 → 0.54.

```viz:voc-empirical-positions:title=Figure 10 — Market timing positions + NBER recessions (interactive),caption=T 토글 (12/60/120). 시계열 positions 1930-2020. 회색 음영 = NBER recessions 15개. 14개에서 자동 divest 확인 — purely OOS, no constraint.
```

---

## 7.8 Section V.D — Comparison with Goyal-Welch (2008) (★ Table I)

> **원문 (p.493)**: "Our results seem at odds with the primary conclusion of Goyal and Welch (2008). These authors argue that the enterprise of market return prediction, which has occupied a large amount of attention in the asset pricing literature for decades, is by and large a failed endeavor: 'these models seem unstable, as diagnosed by their out-of-sample predictions and other statistics; and these models would not have helped an investor with access only to available information to profitably time the market.' But we use the same predictive information as in that paper. What is the source of the discrepancy?"

**Question**: 같은 15 predictor 인데 왜 결론이 정반대?

> **원문 (p.494)**: "The conclusions of Goyal and Welch (2008) are based on their findings of consistently negative out-of-sample prediction $R^2$. They do not analyze the performance of timing strategies based on expected returns or Sharpe ratios.⁴³ We revisit their analysis with a focus on timing strategy performance using the same recursive out-of-sample prediction scheme as in the analysis of Figures 7 and 8. We use rolling 12-, 60-, and 120-month training windows (Panels A, B, and C, respectively), and we focus on a version of what Goyal and Welch (2008) call the 'kitchen sink' regression. Our implementation uses 15 monthly predictors in a linear ridgeless regression.⁴⁴
>
> The first finding of Table I is that we confirm the conclusions of Goyal and Welch (2008). Note that with monthly data, a model with 15 regressors already has nontrivial complexity even for long training windows, and for the 12-month training window, its complexity already even exceeds one. Monthly return forecasts using linear ridgeless regression behave egregiously. The monthly out-of-sample $R^2$ from ridgeless regression ($z = 0^+$) is large and negative at less than $-100\%$ ($-9764\%$ to be precise!). The timing strategy based on these predictions is also poor. The Sharpe ratio is $-0.11$ and is insignificantly different from zero. This seems perhaps not so terrible given the wildness of the forecasts, but it is due to the fact that the strategy's volatility is so high. Its maximum loss is 98 standard deviations. In light of our theoretical analysis, this agreement with the conclusions of Goyal and Welch (2008) is perhaps unsurprising. With $P = 15$ and $T = 12$, this analysis takes place near the interpolation boundary. Thus, forecasts and timing-strategy returns are expected to be highly volatile, as our estimates confirm. In Panels B and C, we repeat the analysis with longer training windows ($T = 60$ and $120$). Longer training windows lead to less variable ridgeless regression estimates, producing higher (though still negative) $R^2$, and improving the Sharpe ratio."

각주 43: "*Updating the original Goyal and Welch (2008) analysis, Goyal, Welch, and Zafirov (2023) provide some evidence of timing-strategy performance for market return predictors.*"

각주 44: "*To remain consistent with our other analyses, the forecast target is the monthly market return standardized by its rolling 12-month volatility standardization. We continue to refer to this as the 'market' throughout. As discussed in the robustness section, our results across the board are generally insensitive to, and our conclusions entirely unaffected by, whether we work with the raw or volatility-standardized market return.*"

### Table I — Comparison with Goyal-Welch

원문 (p.495) Table I:

| Panel | Model | Shrinkage | R² | SR | t-stat (SR) | IR v.Mkt | t-stat (IR v.Mkt) | IR v.Linear | t-stat | Max Loss | Skew |
|-------|-------|-----------|-----|-----|-----|----------|---------|-------------|--------|---------|------|
| **A: T=12** | Linear | $z=0^+$ | <-100% | -0.11 | -1.0 | -0.16 | -1.6 | — | — | 98.5 | -0.9 |
|             | Linear | $z=10^3$ | -3.8% | 0.46 | 4.4 | 0.33 | 3.1 | — | — | 2.4 | -0.1 |
|             | **Nonlinear ML** | $z=10^3$ | **0.6%** | **0.47** | **4.5** | **0.31** | **2.9** | **0.26** | **2.5** | **1.2** | **2.5** |
| **B: T=60** | Linear | $z=0^+$ | -96.6% | 0.00 | 0.0 | -0.07 | -0.6 | — | — | 35.8 | -11.1 |
|             | Linear | $z=10^3$ | -0.5% | 0.44 | 4.1 | 0.10 | 0.9 | — | — | 1.4 | -0.3 |
|             | **Nonlinear ML** | $z=10^3$ | **0.5%** | **0.42** | **3.9** | **0.25** | **2.3** | **0.27** | **2.5** | **0.5** | **1.7** |
| **C: T=120** | Linear | $z=0^+$ | -26.6% | 0.20 | 1.8 | 0.14 | 1.2 | — | — | 15.4 | -6.5 |
|             | Linear | $z=10^3$ | 0.1% | 0.49 | 4.4 | 0.13 | 1.2 | — | — | 0.8 | -0.9 |
|             | **Nonlinear ML** | $z=10^3$ | **0.3%** | **0.41** | **3.7** | **0.24** | **2.2** | **0.24** | **2.2** | **0.3** | **0.9** |

**핵심 발견**:

1. **Linear ridgeless ($z=0^+$, kitchen sink)**:
   - T=12: SR=-0.11 (insignificant), R²=-9764%, max loss 98.5 SD. **사실상 망한 strategy** (Goyal-Welch 결론 확인).
   - T=60: SR=0.00, R²=-96.6%, max loss 35.8 SD.
   - T=120: SR=0.20 (t=1.8), R²=-26.6%, max loss 15.4 SD.

2. **Linear ridge ($z=10^3$)**:
   - T=12: SR=0.46 (t=4.4), R²=-3.8%, max loss 2.4 SD. **Shrinkage 만으로도 dramatic 향상**.
   - T=60: SR=0.44 (t=4.1).
   - T=120: SR=0.49 (t=4.4).

3. **Nonlinear ML ($P=12000$, $c=1000$, $z=10^3$)**:
   - T=12: **SR=0.47 (t=4.5), R²=0.6%, max loss 1.2 SD, skew +2.5**.
   - **IR vs linear = 0.26 (t=2.5)** — nonlinear 의 incremental gain.

**메시지**:
- Shrinkage 만으로 large gain (linear $z=10^3$).
- Nonlinear 가 추가 alpha (IR vs linear t=2.5). **비선형성의 진짜 효과**.
- Max loss + skew 가 nonlinear 가 가장 좋음 — downside risk 작음.

```viz:voc-comparison-table1:title=Table I — Goyal-Welch comparison (interactive),caption=T 토글 (12/60/120). 막대 그래프: Linear ridgeless / Linear ridge / Nonlinear ML 비교. SR/R²/Max Loss/Skew 토글. 비선형성의 incremental gain 직관 확인.
```

> **원문 (p.494)**: "Our theoretical analysis suggests that, in circumstances like the linear kitchen sink where the regression takes place near the interpolation boundary, the benefits from additional ridge shrinkage are potentially large. We, therefore, reestimate the Goyal and Welch (2008) kitchen sink regression with the same range of ridge parameters that we used in our machine learning models. The $R^2$ from even heavily regularized regressions can remain negative, as seen in the out-of-sample $R^2$ of $-3.8\%$ when $z = 10^3$. However, with this much shrinkage, the benefits of market timing become large. The annualized out-of-sample Sharpe ratio of the strategy is 0.46 with a $t$-statistic of 4.4. This performance is not due to static market exposure. In the column 'IR v. Mkt,' we report performance after regressing on the volatility-standardized market return. The linear model with $z = 10^3$ has an IR of 0.33 ($t = 3.1$) versus the market. Shrinkage also produces more attractive maximum loss and skewness. These patterns align with the behavior predicted by our theoretical analysis. Near the interpolation boundary, models can seem defective in terms of $R^2$, yet they can nonetheless confer large economic benefits to investors. In Panels B and C, we see that shrinkage also benefits performance amid longer training windows. For T = 120, the linear strategy Sharpe ratio is 0.49 for $z = 10^3$ (the alpha versus the market is insignificant, however)."

→ Linear + heavy ridge 만으로도 SR 0.46-0.49. R² 가 여전히 음수임에도 economic value 큼.

> **원문 (p.495)**: "The 'Nonlinear' model in Table I refers to the machine learning timing strategy with $c = 1,000$ and $z = 10^3$ (averaged across 1,000 sets of random weight draws). In Panel A, the out-of-sample $R^2$ is $1\%$ per month, with a Sharpe ratio of 0.46 and an IR of 0.31 versus the market. It also has a significant IR of 0.26 ($t = 2.5$) versus the best linear strategy ($z = 10^3$). One of the most attractive aspects of the machine learning strategy is its low downside risk. Its worst month was a loss of 1.23 standard deviations, and its skewness is positive, 2.48. These attractive tail risk properties of the machine learning model are not reflected in the Sharpe ratio. Still, they would be an important utility boost for investors who care about non-Gaussian risks. Note that the machine learning strategy accomplishes this using the identical information set as the linear strategy; it exploits this information in a high-dimensional, nonlinear way. Using longer training windows (Panels B and C) leads to the same conclusions."

**Tail risk** 의 우월:
- Max loss = 1.23 SD (vs Linear ridge 2.4, vs ridgeless 98.5).
- Skewness = +2.48 (positive, 우상향 chunky tail).
- 같은 정보 (Goyal-Welch 15) 를 **비선형 활용** 만으로 달성.

---

## 7.9 Section V.E — Variable Importance (Figure 11)

> **원문 (p.496)**: "These results above beg the question: how can such large models learn predictive patterns in training windows as short as 12 months, particularly when several raw predictors are highly persistent (e.g., dividend yield and T-bill rate)? The short answer is that a number of the 15 raw predictors are, in fact, highly variable over short horizons, and these variables are the most important contributors to the performance of the high-complexity model. To shed more detailed light on this answer, we analyze the contribution of each variable to overall model performance. We reestimate the machine learning model omitting each of the 15 predictor variables one by one. We calculate 'variable importance' (VI) for the $i^{th}$ predictor as the change in performance (defined as out-of-sample $R^2$ or Sharpe ratio) moving from the full model with 15 variables to the reestimated model using 14 variables (excluding variable $i$)."

**VI 정의**:

$$VI_i = \text{Performance}_{\text{full}} - \text{Performance}_{\text{without } i}$$

큰 양의 VI = 그 변수 중요. 작거나 음수 = 그 변수 안 도움.

### Figure 11 — VI bars (T=12, P=12000, z=10³, 1000 RFF draws averaged)

![Figure 11 — Variable importance for 15 Goyal-Welch predictors](figures/page38_Fig11_var_importance.png)

*원문 p.496 Figure 11 — 15 predictor 의 VI (변수 1개 제거 시 모델 성능 변화). Blue bars = VI(R²), red line = VI(Sharpe). T=12, P=12,000, z=10³, 1000 RFF draws 평균. Top 3: lag mkt / ltr / dfr (12-month window 에서 variation 가장 큰 변수들).*

원문 (p.496) Figure 11:

**Top 3 변수** (R² + Sharpe 둘 다):
1. **`lag mkt`** (lag market return): 가장 큰 VI. R² drop ~1.9%, Sharpe drop 큰 폭.
2. **`ltr`** (long-term bond return): 두 번째. R² drop ~1.3%.
3. **`dfr`** (default return): 세 번째. R² drop ~0.8%.

> **원문 (p.497)**: "Excluding the lagged market return ('lag mkt'), long-term bond return ('ltr'), and default return ('dfr') from the random features model reduces the out-of-sample monthly prediction $R^2$ by $1.9\%$, $1.3\%$, and $0.8\%$, respectively. In other words, the complex model is particularly adept at leveraging information from short-horizon fluctuations among predictors. The VI calculations tell the same story when we measure it in terms of $R^2$ (bars) or Sharpe ratio (line)."

**핵심 통찰**: Top 3 가 **highest variation in 12-month windows** (least persistent). 즉 high-complexity 모델이 *short-horizon fluctuation* 을 효과적으로 활용.

각주 45: "*Figure IA4 in the Internet Appendix reports the average variation of each predictor in 12-month training windows.*"

```viz:voc-variable-importance:title=Figure 11 — Variable importance (interactive),caption=15 predictor 의 R² + Sharpe VI bars. T=12, P=12000, z=10³ 평균. Top 3: lag mkt / ltr / dfr (most variable in 12-month windows). 정적 viz with toggle (R² / SR).
```

> **원문 (p.497)**: "VI helps us identify which of the 15 predictors are the most dominant information sources. But our results further show that the key differentiator of the high-complexity model is its ability to extract nonlinear prediction effects. The first evidence of this is its alpha versus the linear model shown in Table I. The linear model has access to the same predictors, but incorporating nonlinearities generates significant alpha over the linear model."

→ **Nonlinear effect 의 incremental contribution**: Table I 의 IR vs Linear = 0.26 (t=2.5). 같은 정보, 비선형 활용만으로 alpha.

> **원문 (p.497)**: "The VI results show that some linear predictors have impressive individual performance. To show that machine learning performance is not driven by these simple linear effects, Internet Appendix Table IA1 reports IRs of the machine learning strategy on the linear univariate timing strategy of each predictor (the univariate timing strategy is defined as the product of a predictor at time $t$ with the market return at $t + 1$). The machine learning model has a large and highly significant IR over every linear strategy. We also calculate its IR versus all 15 univariate strategies simultaneously ('All').⁴⁶ In this case, we find an IR of 0.32 ($t = 2.9$), providing further direct evidence for the nonlinear benefits of complexity."

→ ML vs "All" (15 univariate combined): IR 0.32, t=2.9. 더 명확한 nonlinear evidence.

각주 46: "*We cannot run in-sample versus all 15 univariate strategies simultaneously because this would be equivalent to using the in-sample tangency portfolio of the 15 timing strategies as a benchmark. This is not an apples-to-apples comparison because the machine learning strategy is out-of-sample, so it should be benchmarked to a similarly out-of-sample strategy. To this end, we build the out-of-sample tangency portfolio of the 15 timing strategies (scaled to have an expected volatility of 20%) using an expanding window. We use this combined strategy as the regressor when calculating alpha for the 'all' case.*"

> **원문 (p.497)**: "Naturally, interpretation is a challenge for complex nonlinear models. Internet Appendix Figure IA5 makes progress in this direction by illustrating the nonlinear prediction patterns associated with each of the 15 predictors. To trace the impact of predictor $i$ on expected returns, we fix the prediction model estimated for a given training sample and fix the values of all variables other than $i$ at their values at the time of the forecast. Next, we vary the value of the $i^{th}$ predictor from its full-sample min (corresponding to $-1$ in the plots) to its full-sample max (corresponding to $+1$) and record how the return prediction varies. We then average this prediction response function across all training windows and plot the result."

> **원문 (p.497)**: "The figure illustrates a few interesting patterns. First, we see that when certain indicators of macroeconomic risk are at their lowest (in particular, stock market variance 'svar' and credit spreads on risky corporate debt 'dfy'), the machine learning model forecasts positive returns. However, once these variables reach even moderate levels, the return prediction drops to zero. This is consistent with the time-series pattern in Figure 10, which shows that timing positions (i.e., expected returns) drop to zero heading into recessions. In fact, all predictors demonstrate a similar 'risk on/risk off' predictive pattern in which certain values trigger positive market bets; otherwise, they advocate positions near zero."

**"Risk on / Risk off" 패턴**:
- 일정 임계 이하: 양의 expected return (long).
- 일정 임계 이상 (risk indicator high): expected return 0 (cash).
- → 자동 risk regime detection.

---

## 7.10 Section V.F — Robustness (Nonlinearity + Subsamples)

> **원문 (p.498)**: "It is interesting to note that the linear strategy and the nonlinear machine learning strategy each have beneficial performance relative to buy-and-hold. Yet, they are distinct from each other (e.g., the nonlinear strategy has significant alpha versus the linear strategy). The parameter $\gamma$ controls the degree of nonlinearity in the RFF approximation. It turns out that the linear kitchen sink regression is equivalent to an RFF model in the limit when $\gamma \approx 0$. In particular, note that
>
> $$\sin(\gamma \omega_i' G_t) = \gamma \omega_i' G_t + O(\gamma^2), \quad \cos(\gamma \omega_i' G_t) = 1 - \gamma \omega_i' G_t + O(\gamma^2). \quad (21)$$
>
> Suppose for simplicity that we only have the sin features. Then, defining $\Omega = \frac{1}{P^{1/2}}(\omega_i)_{i=1}^P \in \mathbb{R}^{15 \times P}$, we have that the model is equivalent to a model with random linear features, $S_t = \Omega' G_t$.⁴⁷"

**$\gamma \to 0$ limit**:
- RFF 가 linear regression of $G_t$ on random projections.
- $\gamma$ 가 *degree of nonlinearity* 조절.

각주 47: "*See Proposition IA1 in Section V of the Internet Appendix.*"

> **원문 (p.498)**: "This begs the question: is there an optimal degree of nonlinearity? In general, the answer is no. In the high-complexity regime, different choices of $\gamma$ deliver different approximations of the true DGP, with none strictly dominating the others. Mei, Misiakiewicz, and Montanari (2022) show that high model complexity poses an insurmountable obstacle for any random feature regression — it is impossible to learn the 'true' dependency $R_{t+1} = f(G_t) + \varepsilon_{t+1}$ when the model is complex. In this case, different random feature generators recover different aspects (projections) of the truth on different subspaces. As a result, we would expect linear and nonlinear random features to contain complementary information. This is clearly reflected in the results of Table I.⁴⁸"

→ Linear vs nonlinear 의 *complementary* — 둘 다 다른 subspace projection. Average 가 더 좋을 수 있음.

각주 48: "*Related, the machine learning model and the linear kitchen sink (with $z = 10^3$) have alpha versus each other, suggesting that there are benefits to model averaging. For example, an equal-weighted average of the two strategies (after they are rescaled to have the same volatility) produces a Sharpe ratio of 0.53 and a significant IR of 0.37 versus the market.*"

→ **Equal-weighted ensemble (linear + nonlinear)**: SR 0.53, IR vs market 0.37. **단순 averaging 으로 추가 향상**.

> **원문 (p.498)**: "We assess robustness of our results to various degrees of nonlinearity ($\gamma = 0.5$ or 1, versus $\gamma = 2$ in our main analysis) in Section VI of the Internet Appendix. We also investigate the effect of excluding volatility standardization of the market return. The brief summary of these analyses is that our conclusions are robust to each variation in empirical information."

### Subsample robustness

> **원문 (p.498)**: "Next, we analyze the robustness of our main findings in subsamples. We report model performance splitting the test sample into halves, as shown in Internet Appendix Figures IA9, IA10, and IA11 for training windows T = 12, 60, and 120, respectively. The left side of each figure reports machine learning timing-strategy out-of-sample performance from 1930 to 1974, and the right side from 1975 to 2020. The figures show that the patterns of out-of-sample timing-strategy performance with respect to complexity and shrinkage do not depend on the subsample. Average out-of-sample returns rise monotonically with complexity and decrease with ridge shrinkage; volatility abates when we move past the interpolation boundary and is further dampened by shrinkage. IRs rise with complexity and are fairly insensitive to shrinkage. In the interest of space, we do not plot the out-of-sample $R^2$ or $\hat\beta$ norm, but these also follow identical patterns to those for the full sample."

**Subsample 분할** (1930-1974 vs 1975-2020):
- 정성적 패턴 동일.
- Magnitudes 약간 차이 — 후반부 평균 수익 더 작음 ⇒ IR 작음.
- Robustness 확인.

> **원문 (p.499)**: "While the patterns are the same across subsamples, the magnitudes differ. Average returns in the second sample are about half as large as in the first sample. But volatilities are roughly the same, so IRs are about half as large in the second sample. This is consistent with the machine's trading patterns plotted in Figure 10. Starting around 1968, the machine finds notably fewer buying opportunities and, when it does, takes smaller positions than in the earlier sample."

### Time-series momentum comparison

> **원문 (p.499)**: "Finally, we compare the performance of the machine learning model with a 12-month training window to a 12-month time-series momentum strategy (Moskowitz, Ooi, and Pedersen (2012)). If regressors are highly persistent, they will appear roughly static in a typical 12-month window. In this case, forecasts from a high-complexity regression will behave very similarly to time-series momentum.⁴⁹ In Section VII of the Internet Appendix, we explain this issue in more detail. We also show that our results are not driven by this 'short window and persistent regressor' mechanism. Instead, as emphasized in Section V.E, our machine learning model performance is driven by relatively high-frequency fluctuations among the predictors. We also show that the machine learning timing strategy has economically large and statistically significant alpha over time-series momentum."

→ **Time-series momentum 으로 환원 안 됨**. ML 이 별도의 nonlinear signal.

---

## 7.11 Internet Appendix Results — Section V 의 보조 결과

### IA Figure IA1 / IA2 — Longer training windows (T=60, 120)

Section V.C 의 Figure 7 (T=12) 의 longer training windows 버전.

**IA1 (T=60)**:
- $c$ range [0, 200] (P up to 12,000).
- Patterns 정성적으로 동일: R² 가 $cq=1$ 발산, 회복; $\|\hat\beta\|$ spike; Expected return monotone ↗.
- Magnitude 약간 감소 — T 클수록 forecast variance 작아짐.

**IA2 (T=120)**:
- $c$ range [0, 100].
- 동일 정성적 패턴, magnitude 더 감소.

→ Section V.C 의 결론 "all training windows show same patterns" 의 정량 근거.

### IA Figure IA3 — R² zoomed [-10%, 1%]

본문 Figure 7 panel A 의 R² 가 $c \approx 1$ 부근에서 -100% 까지 발산해서 다른 영역의 detail 안 보임. IA3 가 [-10%, 1%] range 로 zoom-in.

**핵심 발견** (Section V.C 의 본문 인용):
- High $c$ + high $z$ → **positive R²**.
- $z = 10^3$ 이면 거의 모든 $c$ 에서 R² > 0.
- Regularization 의 두 form: explicit ($z$) + implicit (large $c$ smallest norm).

### IA Figure IA4 — Predictor 의 12-month window variation

Figure 11 의 VI 결과를 보조하는 측정. 15 predictor 의 12-month rolling window 내 표준편차.

**Top 3 (most variable)**:
- `lag mkt`: 가장 큰 month-over-month 변동.
- `ltr` (long-term bond return): 큰 변동.
- `dfr` (default return): 큰 변동.

이게 Figure 11 의 VI top 3 와 정확 일치 — *high-frequency fluctuation* 변수가 모델 성능에 기여.

### IA Figure IA5 — Nonlinear prediction pattern (per predictor)

각 predictor 의 *partial dependence plot* 같은 시각화. 

**Method**:
1. Training sample 의 평균값으로 모든 변수 fix.
2. Predictor $i$ 만 [-1, +1] range (full-sample min-max) 변동.
3. ML model 의 prediction 변화 plot.

**Key pattern**: "Risk on / Risk off" — predictor 가 *낮을 때* (risk indicator low) → positive return prediction; 어느 임계 이상이면 → drop to zero (cash).

특히:
- `svar` (stock variance) low → long market.
- `dfy` (default spread) low → long market.
- 일정 임계 이상 → 0.

→ 모든 predictor 가 비슷한 *threshold-like* pattern. Section V.E 의 본문 인용.

### IA Figure IA7 — $\gamma$ robustness

본 분석 $\gamma = 2$. IA7 가 $\gamma \in \{0.5, 1, 2\}$ 비교.

**결과**: 정성적 패턴 모두 동일. SR magnitude 약간 차이만 (γ=2 가 가장 큼).

각주 37 의 robustness 주장의 정량 근거.

### IA Figures IA9 / IA10 / IA11 — Subsample (1930-1974 vs 1975-2020)

본문 V.F 에서 언급. 

**Subsample 분할**:
- Half 1: 1930-1974 (~45 years)
- Half 2: 1975-2020 (~45 years)

**핵심 발견**:
- 정성적 패턴 양쪽 동일 (모든 $c, z$ 에서).
- *Average return*: 후반부가 절반 수준 (시장 effiency 가설 일치).
- *Volatility*: 비슷.
- **IR**: 후반부가 절반 (return 작아져서).

본문 Figure 10 의 "1968년 이후 timing 의 fewer buying opportunities" 와 일치.

### IA Figure IA12 — Intercept 포함 시 robustness

본 분석은 intercept 없는 regression (각주 35). IA12 가 intercept 포함시 결과 거의 동일 — intercept 가 heavily shrunken 되어 무영향.

### IA Table IA1 — ML vs 15 univariate timing 의 IR

본 ML model 의 IR 을 각 univariate (single-predictor) timing 전략 대비 계산.

**핵심 결과**:
- ML 의 IR 이 *모든 single-predictor strategy* 대비 large + significant.
- ML 의 IR vs "all 15 combined tangency" = **0.32 (t=2.9)** (본문 Section V.E 인용).

→ ML 의 *nonlinear interaction* 이 단순 linear combination 으로 환원 불가.

### IA Table IA2 — Inflation 제외 시 robustness

각주 33 의 inflation timing convention 의 문제. IA2 가 inflation 변수 제거시 결과 거의 동일 — convention 의 robustness.

### IA Theorem 1A — Generalized Marchenko-Pastur

각주 24 + Section 5a.5 에 statement. Bai-Zhou (2008) 의 generalization:

**Statement**: For non-iid $S_t$ with finite 4-moments + bounded $\Psi$, the empirical Stieltjes $m(-z; c)$ satisfies fixed-point equation IA4. Furthermore, $m(-z; c) > m_\Psi(-z)$ for $c > 0$.

증명 (sketch): Section 9.4 의 Step 3-4 에 풀이.

### IA Theorem 2 — Sample-population spectra divergence

각주 24 의 핵심 statement. **For $c > 0$, $\hat\Psi$ 와 $\Psi$ 의 spectra 가 $T \to \infty$ 에서도 systematically 다름**. Marchenko-Pastur 의 closed form 으로 정량화.

### IA Proposition IA1 — Linear feature γ → 0 limit

각주 47. RFF 의 $\gamma \to 0$ limit 이 linear regression of $G_t$ on random projections 와 같음.

**Statement (sketch)**:
$$\sin(\gamma \omega' G) \approx \gamma \omega' G + O(\gamma^2), \quad \cos(\gamma \omega' G) \approx 1 - \gamma \omega' G + O(\gamma^2).$$

$\gamma$ 작을수록 linear, 클수록 nonlinear. 본 논문 $\gamma = 2$.

→ Linear kitchen sink (Table I) 가 RFF model 의 limit case 임을 정량화.

각주 49: "*We are grateful to the editor for pointing this out.*"

---

## 7.11 실증 요약 (한 표로)

| 항목 | Linear ridgeless | Linear ridge ($z=10^3$) | **Nonlinear ML** ($c=1000, z=10^3$) |
|------|-----------------|------------------------|-------------------------------------|
| OOS Sharpe ratio (T=12) | -0.11 (t=-1.0) | 0.46 (t=4.4) | **0.47 (t=4.5)** |
| OOS R² (T=12) | <-100% (-9764%) | -3.8% | **+0.6%** |
| IR vs market (T=12) | -0.16 (t=-1.6) | 0.33 (t=3.1) | **0.31 (t=2.9)** |
| IR vs linear (T=12) | — | — | **0.26 (t=2.5)** |
| IR vs "all 15 univariate" (T=12) | — | — | **0.32 (t=2.9)** |
| Max loss (SD) (T=12) | 98.5 | 2.4 | **1.2** |
| Skewness (T=12) | -0.9 | -0.1 | **+2.5** |
| NBER recessions divested | — | — | **14/15** |

→ **본 논문 main empirical message**: ML timing 이 같은 정보 (Goyal-Welch 15) 로 buy-and-hold 대비 SR ~0.47, 비선형성으로 linear 대비 IR 0.26, max loss 1.2 SD (vs ridgeless 98.5), 14/15 recessions 자동 divest — **purely out-of-sample**.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Random Fourier Feature 의 핵심 식 + 의미?**
2. **Table I 의 세 모델 (Linear ridgeless / Linear ridge / Nonlinear ML) 의 핵심 비교 요약?**
3. **Figure 10 의 두 surprising 발견?**

### 답변
1. $S_{i,t} = [\sin(\gamma \omega_i' G_t), \cos(\gamma \omega_i' G_t)]'$ with $\omega_i \sim N(0, I)$, $\gamma = 2$. Raw predictor $G_t$ (15-dim) 을 random direction $\omega_i$ 로 사영 → sin/cos 비선형 변환. Rahimi-Recht (2007) 의 결과로 RFF + linear regression 이 **wide neural network (one hidden layer with random fixed first-layer weights)** 와 등가. $\gamma \to 0$ limit 이 linear kitchen sink, $\gamma > 0$ 이 nonlinear 정도 조절. $P$ 키울수록 universal approximator.
2. **Linear ridgeless** (Goyal-Welch 2008 original): SR=-0.11, R²<-100%, max loss 98.5 SD — 거의 사용 불가 (GW 2008 비관 결론 확인). **Linear ridge ($z=10^3$)**: SR=0.46, R²=-3.8%, max loss 2.4 SD — *shrinkage 만으로* 결정적 향상, but alpha vs market t=3.1. **Nonlinear ML ($P=12k, z=10^3$)**: SR=0.47, R²=+0.6%, **max loss 1.2 SD, skewness +2.5**, IR vs Linear ridge=0.26 (t=2.5). 같은 information set 으로 비선형성이 incremental alpha.
3. **(i) Long-only at heart**: high-complexity ML timing 의 position 이 거의 항상 양 — Campbell-Thompson (2008) 의 nonnegativity constraint 를 **constraint 없이 자동 학습**. **(ii) NBER recession 14/15 자동 divest**: 1930-2020 의 15개 NBER recession 중 14개에서 timing 이 침체 직전 시장 비중 줄임 (예외: 1945 WWII 직후). Purely out-of-sample, expanding window — *forecast* 아닌 *real-time signal*. 이게 **risk on/risk off** 패턴의 시각화.

---

다음 파일 [08_conclusion.md](08_conclusion.md) — Section VI (Conclusion) 의 Box 인용 + Occam's blunder 풀이.
