# 03. Introduction 풀이 — 왜 이런 연구가 필요한가

> Section I (p.459 본문 시작) 의 7개 단락을 한 문단씩 풀이.

---

## 3.1 챕터 한 줄 요약

**Goyal-Welch (2008) 가 "수익률 예측은 사실상 불가능" 이라고 결론낸 후 15년간 학계는 비관 — 그러나 진실은 정반대로 "복잡 모델 + ridge 만 더하면 SR 단조 증가". 본 논문은 이 'virtue of complexity' 를 RMT 로 증명하고 RFF kernel 로 실증한다.**

---

## 3.2 첫 단락 — 분야의 최근 흐름

> **원문 (p.459)**: "The finance literature has recently seen rapid advances in return prediction methods borrowing from the machine learning canon. The primary economic-use case of these predictions has been portfolio construction. While a number of papers document significant empirical gains in portfolio performance through the use of machine learning, there is little theoretical understanding of return forecasts and portfolios formed from heavily parameterized models."

**풀어 설명**:
- *Finance literature × ML canon* — 머신러닝 기법이 finance 에 빠르게 침투. 핵심 응용은 **portfolio construction (자산운용)**.
- *Empirical gains* — Gu-Kelly-Xiu (2020 RFS), Chen-Pelger-Zhu (2023 MS), Freyberger-Neuhierl-Weber (2020), Kozak-Nagel-Santosh (2020) 등이 deep learning / ridge / LASSO 로 cross-section / time-series 모두 large improvement 보고.
- *Little theoretical understanding* — 실증 효과는 명백하지만, **왜 heavily parameterized 모델이 작동하는지** 의 이론적 분석이 부족.
- → **본 논문이 메우는 공백**: machine learning portfolio 의 **이론적 분석**.

연결되는 이전 deep dive:
- [Gu-Kelly-Xiu 2020 (Autoencoder Asset Pricing)](../2026-05-17_gu-kelly-xiu-autoencoder/) — conditional autoencoder
- [Chen-Pelger-Zhu 2023 (DLAP)](../2026-05-18_chen-pelger-zhu-deep-learning-ap/) — GAN no-arbitrage
- [Lettau-Pelger 2020 (RP-PCA)](../2026-05-17_lettau-pelger-rppca/) — RP-PCA 약한 요인 검출

이 세 편 모두 실증 효과를 보였지만, "왜 ML 이 그렇게 잘 되는지" 의 이론적 정당화는 없었다. 본 논문이 그 이론을 제공.

---

## 3.3 둘째 단락 — Thought Experiment (사고 실험)

> **원문 (p.460)**: "We provide a theoretical analysis of such 'machine learning portfolios.' Our analysis can be summarized by the following thought experiment. Imagine there is a true predictive model of the form
>
> R_{t+1} = f(G_t) + ε_{t+1}, (1)
>
> where R is an asset return, G is a fixed set of predictive signals, and f is a smooth function. The predictors G may be known to the analyst, but the prediction function f is unknown. Rather than futile guess the functional form, the analyst relies on the universal approximation rationale (see, for example, Hornik, Stinchcombe, and White (1990)), that f can be approximated with a sufficiently wide neural network,
>
> f(G_t) ≈ Σᵢ₌₁ᴾ S_{i,t} β_i,
>
> where S_{i,t} = f̃(w_i' G_t) is a known nonlinear activation function with known weights w_i and P is sufficiently large."

### Equation (1): True predictive model

**기호 뜻**:
- $R_{t+1}$ — 자산 (특히 시장 지수) 의 시점 $t+1$ 초과수익 (스칼라, 월간)
- $G_t$ — 시점 $t$ 까지의 **predictive signals** (J-dimensional vector, 본 논문 J=15)
- $f$ — *unknown* smooth function $\mathbb{R}^J \to \mathbb{R}$ (true conditional expectation $\mathbb{E}[R_{t+1} | G_t]$ 모양)
- $\varepsilon_{t+1}$ — 잡음 (iid, $\mathbb{E}[\varepsilon]=0$, $\mathbb{E}[\varepsilon^2]=\sigma^2$)

**일상 비유**:
시장 수익률을 예측하는 진짜 함수 $f$ 가 존재한다고 가정하자 — 마치 자연법칙처럼. 학자는 그 함수의 **input** ($G_t$, 예: dividend-price ratio, term spread, default spread) 는 알지만, **함수 모양** ($f$ 의 형태) 은 모른다.

**왜 이 형태**:
- 자산가격결정의 **conditional expectation 패러다임** — Cochrane (2011) presidential address.
- Smooth function 가정 — 일상 macro/finance 변수가 step 함수 같지 않다는 약한 가정.
- 가산성 가정 ($+ \varepsilon$) — predictable + unpredictable 분리.

**조심할 점**:
- $f$ 가 **시간 변화** 하면 (regime change) 본 분석 무너짐. 본 논문은 stationary assumption.
- $G_t$ 의 차원 J 가 finite 면 학습 가능; infinite 이면 nonparametric 문제.

### Universal Approximation 식 (NN 등가)

**핵심**:
$$f(G_t) \approx \sum_{i=1}^{P} S_{i,t} \beta_i, \quad S_{i,t} = \tilde{f}(w_i' G_t)$$

**기호 뜻**:
- $P$ — **features 수 (모델 복잡도)**. 본 논문의 핵심 변수
- $S_{i,t}$ — $i$번째 nonlinear feature (스칼라). $G_t$ 의 linear combination 을 nonlinear activation $\tilde{f}$ (예: tanh, sigmoid, ReLU) 에 통과
- $w_i$ — 고정된 (학습 안 됨) random weights ($\mathbb{R}^J$ vector)
- $\beta_i$ — 학습 대상 coefficient (선형)
- $\tilde{f}$ — known activation function (본 논문 실증: $\sin$, $\cos$ — Random Fourier Features)

**일상 비유**:
$G_t$ (예: 15차원 macro vector) 를 **무작위로 P 개 방향** ($w_i$) 으로 사영하고 각 사영에 sigmoid 같은 비선형 함수를 씌운 **인공 변수 $S_{i,t}$** 를 만든다. 이 $S_{i,t}$ 들을 **선형 회귀** 의 regressor 로 쓴다.

→ 이게 사실 **wide neural network 의 한 hidden layer 와 등가**. 첫 layer 의 weights ($w_i$) 가 고정 random 이고 마지막 layer 의 weights ($\beta_i$) 만 학습한다는 점이 표준 NN 과 다를 뿐. 그러나 Hornik-Stinchcombe-White (1990) 의 universal approximation 이 이 random weight version 에도 성립함 — Rahimi & Recht (2007, 2008).

**왜 이 형태**:
- ReLU/tanh 같은 nonlinear activation 이 있으니 P 키우면 어떤 smooth $f$ 도 임의 정확도로 근사 가능 (universal approximation).
- 가중치 fixed random + linear final layer 라서 분석 가능 (linear ridge regression 의 RMT 활용).
- 실제 NN 의 학습된 weights 는 random init 으로부터 약간만 움직임 (NTK 이론) — random fixed weights 가 deep NN 의 lazy regime 과 등가.

**조심할 점**:
- $\tilde{f}$ 가 polynomial 같이 한정된 차수 면 universal X — sigmoid/ReLU/tanh 같은 squashing function 또는 무한급수 표현 가능 함수 필요.
- P → ∞ 일 때 sum 이 RKHS norm 같은 적분 형태로 수렴 (kernel regression).
- $w_i$ 의 분포 가정 — iid Gaussian (RFF) / iid uniform (특정 activation) 등. 본 논문은 $w_i \sim N(0, I)$.

### Equation (2): Approximation model

$$R_{t+1} = \sum_{i=1}^P S_{i,t} \beta_i + \tilde\varepsilon_{t+1}$$

여기서 $\tilde\varepsilon = \varepsilon + (f(G_t) - \sum S_i \beta_i)$ — 본래 잡음 + approximation error.

→ 이게 **본 논문의 분석 대상** 모델. linear regression of $R_{t+1}$ on $S_t = (S_{1,t}, \ldots, S_{P,t})'$.

각주 1: "Assuming known weights $w_i$ is innocuous, as the universal approximation result applies even if weights are randomly generated Rahimi and Recht (2007). Our empirical analysis uses the random Fourier feature (RFF) method of Rahimi and Recht (2007) to generate features as in (2)."

→ 핵심: weights 가 random fixed 라는 가정이 약점 아님. NN 학습이 어차피 weights 의 작은 perturbation 이라는 NTK 결과로 정당화됨.

---

## 3.4 셋째 단락 — 핵심 연구질문

> **원문 (p.460)**: "The training sample for this regression has a fixed number of data points, T, and the analyst must decide on the 'complexity,' or the number of features P, to use in their approximating model. A simple model, one with P ≪ T, will have low variance thanks to parsimonious parameterization but will be a coarse approximator of f, while a high-complexity model (P > T) has better approximation potential but may be poorly behaved and will require shrinkage/bias. Our central research question therefore is, which level of model complexity (i.e., which P) should the analyst opt for? Does the approximation improvement from large P justify the statistical costs (higher variance and/or higher bias)?"

**풀어 설명** — 본 논문의 **central research question**:

| 옵션 | 특성 | 장점 | 단점 |
|------|------|------|------|
| **Simple** (P ≪ T) | Parsimonious | Low variance | Coarse approximation (bias 큼) |
| **Complex** (P > T) | Heavy parameterization | Better approximation (bias 작음) | Poorly behaved, shrinkage 필요 |

→ trade-off 의 균형점은? **이게 본 논문의 핵심 질문**.

전통적 답: parsimony 우선 → Goyal-Welch 의 simple model.
본 논문 답: complexity 우선 → "Use the largest model you can compute."

---

## 3.5 넷째 단락 — Answer (핵심 주장)

> **원문 (p.460)**: "Answer: We prove that expected out-of-sample forecast accuracy and portfolio performance are *strictly increasing* in model complexity when appropriate shrinkage is applied (indeed, we derive the optimal degree of shrinkage to maximize expected out-of-sample model performance). The analyst should always use the largest approximating model that she can compute. In other words, when the true data-generating process (DGP) is unknown, the approximation gains achieved through model complexity dominate the statistical costs of heavy parameterization. The interpretation is not necessarily that asset returns are subject to a large number of fundamental driving forces. Rather, even when the driving variables (G_t) have low dimension, complex models better leverage the information content of G_t by more accurately approximating the unknown and likely nonlinear prediction function."

**핵심 한 줄**: "**Use the largest model you can compute.**"

**왜 그게 가능한가**:
- 적절한 ridge shrinkage 와 함께 — OOS forecast accuracy 와 portfolio performance 모두 **strictly increasing in P**.
- 직관: $G_t$ (15 차원) 의 정보를 충분히 활용하려면 nonlinear function $f$ 의 풍부한 expression 이 필요. P 가 작으면 그 표현이 거칠어서 (coarse) **approximation bias** 가 큼. P 키우면 그 bias 가 줄어드는 효과가 P 큰 모델의 variance 증가 비용보다 큼.

**오해 방지** (각주 + 본문):
- "*Interpretation is not necessarily that asset returns are subject to a large number of fundamental driving forces.*"
- 즉 **fundamental driver 수가 많다는 뜻 아님**. driver 는 적을 수 있음 (15개 macro 변수). 단지 그 driver 들의 nonlinear interaction 이 풍부할 뿐.

---

## 3.6 다섯째 단락 — 단순화 가정

> **원문 (p.461)**: "To provide intuitive characterizations of forecast and portfolio behavior in complex models, our theoretical environment has two simplifying aspects. First, the machine learning models we study are restricted to high-dimensional linear models. As suggested by equation (2), this sacrifices little generality as a number of recent papers establish an equivalence between high-dimensional linear models and more sophisticated models such as deep neural networks (Jacot, Gabriel, and Hongler (2018), Allen-Zhu, Li, and Song (2019), Hastie et al. (2022)). In fact, equation (2) is a neural network with one hidden layer with P neurons and fixed input weights. Second, we focus on a single risky asset. Prediction is therefore isolated to the time-series dimension, and the portfolio optimization problem reduces to market timing."

**두 단순화**:

1. **High-dimensional linear model** — 마지막 layer 만 학습. Deep NN 와 equivalence 는 Neural Tangent Kernel (NTK, Jacot-Gabriel-Hongler 2018) 으로 보장. 즉 "NN 라는 부르지만 사실 linear regression on high-dim features".
2. **Single asset (market index)** — cross-section 무시. 시간 차원만 — **market timing problem**. 본 분석을 single asset 으로 한정해도 결론 의의는 일반.

각주 2: "The single-asset time-series case is economically important in its own right. It coincides with predictive regression for the market return, which has been the primary method for investigating a central organizing question of asset pricing: How much do discount rates vary over time? While our analysis can be applied to a panel of many assets, the roles of covariances in asset returns and signals across stocks complicate the theory."

→ 시장 timing 자체가 finance 의 핵심 질문 (할인율 변화). cross-section panel 로 확장은 가능하지만 covariance complication 발생.

---

## 3.7 여섯째 단락 — OLS 의 결함 (Baseline)

> **원문 (p.461)**: "To provide a baseline for our findings, consider the well-known deficiency of ordinary least squares (OLS) prediction in high dimensions. As the number of regressors, P, approaches the number of data points, T, the expected out-of-sample R² tends to negative infinity. An immediate implication is that a portfolio strategy attempting to use OLS return forecasts in such a setting will have divergent variance. In turn, its expected out-of-sample Sharpe ratio collapses to zero. The intuition behind this is simple: When the number of regressors is similar to the number of data points, the regressor covariance matrix is unstable and its inversion induces wild variation in coefficient estimates and forecasts. This is commonly interpreted as overfitting: With P = T, the regression exactly fits the training data and performs poorly out-of-sample."

**핵심**: P → T- 에서 OLS 의 OOS 가 **모두 망함**:
- $R^2_{\text{OOS}} \to -\infty$
- Portfolio strategy variance divergent → SR → 0
- 이유: $(X'X)^{-1}$ 가 singular 에 가까워짐 — 작은 데이터 변동이 coefficient 의 거대 변동 야기.

이게 통념의 출발점. P=T 가 "interpolation boundary" — 학습 데이터에 정확히 fit 하지만 OOS 망함.

각주 3 (각주가 깊이 추가): "*The statistics and machine learning community often refer to P > T as the 'high-dimensional' or 'overparameterized' regime. We avoid terminology like 'overparameterized' and 'overfit' as it suggests the model uses too many parameters, which is not necessarily the case. For example, the true DGP may be highly complex (i.e., P is large relative to T) and thus a correctly specified model would require P > T. When an empirical model has the same specification as the true model, we prefer to call it correctly parameterized as opposed to overparameterized.*"

→ **terminology 주의**: P > T 를 "overparameterized" 라고 부르는 통념이 잘못. 본 논문은 "high-complexity" 또는 "correctly parameterized" (true DGP 가 그렇게 복잡한 경우) 라는 용어 사용.

---

## 3.8 일곱째 단락 — Ridgeless 의 마법

> **원문 (p.461)**: "We are particularly interested in the behavior of portfolios in the *high model complexity* regime, where the number of predictors exceeds the number of observations (P > T). In this case, standard regression logic no longer holds because the regressor inverse covariance matrix is not defined. However, the pseudo-inverse is defined and it corresponds to a limiting ridge regression with infinitesimal shrinkage, or the 'ridgeless' limit. An emerging statistics and machine learning literature shows that, in the high-complexity regime, ridge-less regression can achieve accurate out-of-sample forecasts despite fitting the training data perfectly."

**핵심**: P > T 에서 OLS 는 정의 불가지만 **Moore-Penrose pseudo-inverse** 가 정의됨. 이게 **z → 0+ 의 ridge regression** 과 같음 → "ridgeless regression".

놀랍게도 ridgeless 가 OOS 예측을 정확하게 한다 — **despite fitting training data perfectly (zero training error)**.

각주 4: "*This seemingly counterintuitive phenomenon is sometimes called 'benign overfit' (Bartlett et al. (2020), Tsigler and Bartlett (2023)).*"

→ **benign overfit (자비로운 과적합)** — 통계학·머신러닝의 최근 (2019+) 발견. P > T 에서 zero training error 임에도 OOS 정확.

본 논문은 이 benign overfit 이 **return prediction + market timing** 에서도 작동함을 finance 응용으로 가져옴.

---

## 3.9 여덟째 단락 — 추가 결론들 (3가지)

> **원문 (p.462)**: "We analyze related phenomena in the context of return prediction and portfolio optimization. We establish the striking theoretical result that market timing strategies based on ridgeless least-squares predictions generate positive Sharpe ratio improvements for arbitrarily high levels of model complexity. Stated more plainly, when the true DGP is highly complex (i.e., has many more parameters than there are training data observations), one might think that a timing strategy based on ridgeless regression is bound to fail. After all, it *exactly* fits the training data with zero error. Surprisingly, this intuition is wrong. We prove that strategies based on extremely high-dimensional models can thrive out-of-sample and outperform strategies based on simpler models under fairly general conditions."

**첫 번째 결과**: Ridgeless ML timing 의 OOS Sharpe ratio 가 **임의로 큰 P 에서도 양수**.

> **원문 (p.462)**: "Our theoretical analysis delivers a number of additional conclusions. First, it shows that the out-of-sample R² from a prediction model is an incomplete measure of its economic value. A market timer can generate significant economic profits even when the predictive R² is negative."

**둘째 결과**: **OOS R² 는 economic value 의 incomplete measure**. 음의 R² 임에도 timing 이 양의 profit. 이유: R² 는 forecast variance 에 heavy하게 영향 받음 — 매우 변동성 큰 timing 전략이 양의 expected return 갖더라도 R² 가 음수일 수 있음.

각주 5: "*That is, R² is not just about predictive correlation. Consider a simple model with a single predictor and a coefficient estimate many times larger than the true value. This scale error will tend to drive the R² negative, but it will not affect the correlation between the model fits and the true conditional expectation. The R² is negative only because the variance of the fits is off. Related, Rapach, Strauss, and Zhou (2010) show that mean square forecast error (MSE) decomposes into a scale-free (correlation) component and a scale-dependent component. It is the scale-free component that is important for trading strategy performance.*"

→ R² 음수가 곧 "예측 무능" 이 아니라 "scale error" 일 수 있음. correlation 만 잘 잡으면 timing 은 됨.

> **원문 (p.462)**: "Second, we study two theoretical cases, one for correctly specified models and one for misspecified models. The correctly specified case develops the behavior of timing portfolios when the true DGP varies from simple to complex, holding the data size fixed. This is valuable for developing a general understanding of machine learning portfolios for various DGPs. But the correct model specification is unrealistic — it is unlikely that we ever have a predictor data set that nests all relevant conditioning information, and it is also unlikely that we use information in the proper functional form. Our main theoretical results pertain to misspecified models, and this analysis coincides with the thought experiment above."

**셋째 결과**: Correctly specified (Section III) vs **Misspecified** (Section IV). 후자가 더 현실적 — predictor 가 true DGP 의 일부만 capture. 본 논문의 **main result** 가 misspecified case (Theorem 1).

> **원문 (p.463)**: "Third, while the results discussed so far refer primarily to the case of ridgeless regression, we show that machine learning portfolios tend to incrementally benefit from moving away from the ridgeless limit by introducing nontrivial shrinkage. The bias induced by heavier ridge shrinkage lowers the expected returns to market timing, but the associated variance reduction reins in the volatility of the strategy. The Sharpe ratio tends to benefit from higher shrinkage because the variance reduction overwhelms the deterioration in expected timing returns. This is especially true when P ≈ T, where the behavior of ridgeless regression is most vulnerable."

**넷째 결과**: Ridgeless 보다 **nontrivial ridge (z > 0)** 가 더 좋다. Bias 가 변동성을 더 크게 줄여 SR 향상. 특히 P ≈ T 부근 (variance explosion 영역) 에서 효과 큼.

---

## 3.10 아홉째 단락 — 분석 도구 + 실증 예고

> **원문 (p.463)**: "From a technical standpoint, we characterize the behavior of portfolios in the high-complexity regime using asymptotic analysis, as the model's size grows with the number of observations at a fixed rate (T → ∞ and P/T → c > 0). When P → ∞, the regular asymptotic results, such as laws of large numbers and central limit theorems, do not hold. Such analysis requires the apparatus of random matrix theory, on which we draw heavily to derive our results. Conceptually, this delivers an approximation of how a machine learning model behaves as we gradually increase the number of parameters holding the amount of data fixed."

**분석 framework**: **High-complexity asymptotics** — T → ∞, P/T → c > 0 의 limit (regular asymptotic 안 통함). **Random Matrix Theory (RMT)** 가 도구.

> **원문 (p.463)**: "We conduct an extensive empirical analysis that demonstrates the virtues of model complexity in a canonical asset pricing problem: predicting the aggregate U.S. equity market return. In particular, we study market timing strategies based on predictions from very simple models with a single parameter to extremely complex models with over 10,000 parameters (applied to training samples as few as 12 monthly observations). The data inputs to our models are 15 standard predictor variables from the finance literature compiled by Goyal and Welch (2008). To map our data analysis to the theory, we require a method that smoothly transitions from low- to high-complexity models while holding the underlying information set fixed. The random feature method of Rahimi and Recht (2007) is ideal for this. We use it to construct expanding neural network architectures that take the Goyal and Welch (2008) predictors as inputs and maintain the core ridge regression structure of our theory."

**실증**:
- 데이터: 1926-2020 CRSP, **Goyal-Welch (2008) 의 15 predictor**.
- Model 복잡도: P = 2 → 12,000 (5,000 paris of sin/cos).
- 학습 표본: T = 12, 60, 120 (1년 / 5년 / 10년 rolling).
- 방법: **Random Feature method (Rahimi-Recht 2007)** — RFF — 가 low-complexity 부터 high-complexity 까지 smooth transition 가능.

> **원문 (p.463)**: "We find extraordinary agreement between empirical patterns and our theoretical predictions. Over the standard Center for Research in Security Prices (CRSP) sample from 1926 to 2020, out-of-sample market timing Sharpe ratio improvements (relative to market buy-and-hold) reach roughly 0.47 per annum with t-statistics near 3.0. This is despite the fact that the out-of-sample predictive R² is substantially negative for the vast majority of models, consistent with the theoretical argument that predictive R² is inappropriate for judging the economic benefit of a machine learning model."

**핵심 수치**:
- **OOS Sharpe ratio improvement ≈ 0.47/year** vs market buy-and-hold.
- **t-statistic ≈ 3.0** (statistically significant).
- **그럼에도 OOS R² 는 거의 모두 음수** — 직관적 충돌.

> **원문 (p.464)**: "Timing positions from high-complexity models are remarkable. They behave similarly to long-only strategies, following the Campbell and Thompson (2008) recommendation to impose a nonnegativity constraint on expected market returns. But our models learn this behavior as opposed to being handed a constraint. Moreover, machine learning strategies learn to divest leading up to National Bureau of Economic Research (NBER) recessions, successfully doing so in 14 out of 15 recessions in our test sample on a purely out-of-sample basis."

**경이로운 발견**:
- ML timing 이 **long-only-ish** 로 자동 학습 (Campbell-Thompson 의 nonnegativity 권고 와 일치).
- **14 out of 15 NBER recessions** 에서 자동 divest. Purely out-of-sample.

이 두 가지 발견이 본 논문의 가장 강력한 실증.

---

## 3.11 열번째 단락 — 관련 문헌 (이론 + 실증)

> **원문 (p.464)**: "This paper relates most closely to emerging literature that studies the theoretical properties of machine learning models. A number of recent papers show that linear models combined with random matrix theory help characterize the behavior of neural networks trained by gradient descent. In particular, wide neural networks (many nodes in each layer) are effectively kernel regressions, and 'early stopping' in neural network training is closely related to ridge regularization (Ali, Kolter, and Tibshirani (2019)). Recent research also emphasizes the phenomenon of benign overfit and 'double descent,' in which expected forecast error drops in the high-complexity regime."

**연결되는 이론 문헌** (각주 7):
- Jacot-Gabriel-Hongler (2018) — Neural Tangent Kernel
- Hastie-Montanari-Rosset-Tibshirani (2022) — *Annals of Statistics* benchmark on ridgeless
- Du-Lee-Li-Wang-Zhai (2019) — gradient descent for over-parameterized NN
- Ali-Kolter-Tibshirani (2019) — early stopping ≈ ridge

각주 8: **Double descent** 현상 — OOS error 가 P/T=1 에서 peak 후 다시 감소. Spigler et al (2019), Belkin et al (2019), Bartlett et al (2020).

> **원문 (p.464)**: "In this literature, the paper closest to ours is Hastie et al. (2022), who derive nearly optimal error bounds in finite samples for bias and risk in the ridge(less) regression under very general conditions. They are also the first to introduce misspecified models in which some of the signals may be unobservable. In this paper, we focus on the (easier) asymptotic regime. We use a different method of proof and relax some of the technical conditions on the distributions of signals, using recent results of Yaskov (2016). In particular, we allow for nonuniformly positive-definite covariance matrices."

**Hastie et al (2022) 와의 차이**:
- 동일: misspecified, ridge(less) regression.
- 본 논문 차이:
  - (i) Asymptotic limit (T,P→∞), Hastie 는 finite-sample.
  - (ii) Method of proof — Yaskov (2016) 기반.
  - (iii) Ψ 의 nonuniform positive-definite 허용.
  - (iv) **Focus 가 forecast accuracy variance 가 아닌 OOS expected return / Sharpe ratio** — finance 관점.

> **원문 (p.464)**: "Most importantly, instead of focusing on the prediction model forecast error variance, we characterize expected out-of-sample expected returns, volatility, and Sharpe ratios of market timing strategies based on machine learning predictions."

**본 논문의 finance-specific 기여**: 통계 metric (R², MSE) 이 아닌 **economic metric (expected return, volatility, Sharpe ratio)** 의 high-complexity asymptotic 도출.

> **원문 (p.464)**: "Our paper also relates closely to a growing empirical literature that uses machine learning methods to analyze stock returns. The state-of-the-art market return prediction uses high-dimensional models with shrinkage and demonstrates robust out-of-sample predictive power. Rapach, Strauss, and Zhou (2010) use predictors from Goyal and Welch (2008) and forecast combination methods (which they show exert a strong shrinkage effect). Ludvigson and Ng (2007) and Kelly and Pruitt (2013) use principal components regression and partial least squares, respectively, to leverage large predictor sets for market return prediction and achieve shrinkage through dimension reduction."

**실증 문헌** (시장 수익률 예측):
- Rapach-Strauss-Zhou (2010) — forecast combination = implicit shrinkage
- Ludvigson-Ng (2007) — PCA on macro
- Kelly-Pruitt (2013) — PLS on present value identity
- Dong et al (2022) — 100 long-short anomaly portfolios → market

**실증 문헌** (cross-section):
- Rapach-Zhou (2020) — survey
- Kozak-Nagel-Santosh (2020) — shrinking cross-section
- Freyberger-Neuhierl-Weber (2020) — nonparametric characteristics
- Gu-Kelly-Xiu (2020) — ML asset pricing baseline
- Chen-Pelger-Zhu (2023) — DLAP

→ 본 논문이 이 모든 흐름의 **이론적 정당화**.

---

## 3.12 마지막 단락 — 논문 구조 안내

> **원문 (p.465)**: "The paper is organized as follows. In Section I, we lay out the theoretical environment. Section II presents the foundational results from random matrix theory from which we derive our main theoretical results. Section III characterizes the behavior of machine learning portfolios in the correctly specified setting and emphasizes the intuition behind the portfolio benefits of high-complexity prediction models. Section IV extends these results to the more practically relevant setting of misspecified models. We present our main empirical results in Section V. Section VI concludes. The Internet Appendix contains a variety of supplementary theoretical results and empirical robustness analyses. We invite readers that are primarily interested in the qualitative theoretical points and the empirical analysis to skip the technical material of Sections I and II."

**구조 매핑** (논문 → 본 deep dive):

| 논문 Section | Pages | Deep dive 챕터 |
|--------------|-------|----------------|
| I. Environment | 465–470 | [04_environment.md](04_environment.md) |
| II. ML + RMT | 470–474 | [05_method_a_rmt.md](05_method_a_rmt.md) |
| III. Correctly specified | 474–481 | [05_method_b_correct.md](05_method_b_correct.md) |
| IV. Misspecification | 481–487 | [05_method_c_misspec.md](05_method_c_misspec.md) |
| V. Empirical | 487–498 | [07_empirical.md](07_empirical.md) |
| VI. Conclusion | 499–500 | [08_conclusion.md](08_conclusion.md) |
| Internet Appendix | 별도 | [09_appendix_proof.md](09_appendix_proof.md) 에 핵심 발췌 |

저자 가이드: "Sections I, II 의 기술적 내용을 건너뛰고 III–V 만 봐도 핵심 메시지 이해 가능."

본 deep dive 는 **모든 정리·가정·각주·equation 풀어쓰기** 원칙이므로 I, II 도 전부 풀이.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **본 논문의 "central research question" 은?**
2. **OLS 가 P → T 에서 망하는데 P > T 에서는 왜 작동하는가?**
3. **"이론적 분석" 과 "실증 분석" 의 핵심 결과 한 줄씩?**

### 답변
1. **모델 복잡도 P 를 어디로 정해야 OOS forecast + portfolio 성능이 최대화되는가?** 단순 (P≪T) vs 복잡 (P>T) 의 bias-variance trade-off 결정. 본 논문 답: **P 를 가능한 한 크게 (largest you can compute), 적절한 ridge shrinkage 와 함께**.
2. P → T- 에서 $(X'X)^{-1}$ 의 singularity 가 OLS 계수를 발산시킴. 그러나 P > T 에서는 **Moore-Penrose pseudo-inverse** 가 정의되고 이게 **z → 0+ ridge** 와 같음. P 커질수록 ridgeless 의 implicit regularization 이 강해져서 $\hat\beta$ norm 이 작은 (smallest-norm) solution 으로 가는 **benign overfit**.
3. **이론**: Theorem 1 — sufficiently mixed signals 의 misspecified 환경에서, optimal shrinkage $z_*$ 와 함께 Sharpe ratio $SR(z_*; cq; q)$ 가 $q \in [0,1]$ 에서 **strictly monotone increasing and concave** (Section IV). **실증**: CRSP 1926-2020, Goyal-Welch 15 predictor + RFF P=12,000, T=12: **OOS Sharpe ratio improvement ≈ 0.47/year (t≈3.0)** vs market buy-and-hold, **14/15 NBER recessions 자동 divest** purely OOS.

---

다음 파일 [04_environment.md](04_environment.md) — Section I (Environment) 의 Assumptions 1-4, timing 전략, Proposition 1 풀이.
