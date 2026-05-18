# 07. Evaluation Metrics — Section II.F

> Section II.F (paper p.19–20) — SR, EV, XS-R² 세 지표의 정의와 의미.

## 7.1 챕터 한 줄 요약

본 논문은 **3가지 지표** 로 모델 평가: (1) **Sharpe Ratio (SR)** — SDF portfolio 의 운용 효율, (2) **Explained Variation (EV)** — 시계열 R² 같은 것, (3) **Cross-Sectional R² (XS-R²)** — 횡단면 mean R². paper Appendix B simulation 이 **세 지표 모두 필요** 함을 입증.

---

## 7.2 Sharpe Ratio (SR)

paper p.19:
$$
\mathrm{SR} = \frac{\widehat{\mathbb{E}}[F_t]}{\sqrt{\widehat{\mathrm{Var}}(F_t)}}
$$

**기호 뜻**:
- $F_t$ — SDF portfolio return (= $\omega_t^\top R^e_{t+1}$).
- 분자: sample mean.
- 분모: sample std.

**의미**: SDF portfolio 의 **위험 단위당 초과수익**. unconditional Sharpe ratio.

**왜 SR?**
- SDF 는 mean-variance tangency portfolio. 그러므로 **모든 portfolio 중 최고 SR**.
- 좋은 SDF 추정 ⇔ 높은 OOS SR.

paper 본문:
> "First, the SDF is by construction on the globally efficient frontier and should have the highest conditional Sharpe ratio. We use the unconditional Sharpe ratio of the SDF portfolio SR = $\hat E[F] / \sqrt{\widehat{Var}[F]}$ as a measure to assess the pricing performance of models."

---

## 7.3 Explained Variation (EV)

paper p.19:
$$
\mathrm{EV} = 1 - \frac{\frac{1}{T}\sum_{t=1}^{T} \frac{1}{N_t}\sum_{i=1}^{N_t} (\hat\epsilon_{t+1,i})^2}{\frac{1}{T}\sum_{t=1}^{T} \frac{1}{N_t}\sum_{i=1}^{N_t} (R^e_{t+1,i})^2}
$$

**기호 뜻**:
- $\hat\epsilon_{t+1,i}$ — cross-sectional regression of $R^e$ on $\hat\beta$ 의 잔차.
- 분자: 잔차 제곱 평균.
- 분모: total 제곱 평균.

**의미**: **시계열 R²** 같은 것. SDF 노출도 $\beta$ 가 stock returns 의 변동을 얼마나 설명하나.

paper 본문 (Kelly-Pruitt-Su 2019 convention):
> "As in Kelly, Pruitt, and Su (2019) we do not demean returns due to their non-stationarity and noise in the mean estimation. Our explained variation measure can be interpreted as a time series R²."

→ **non-demeaned** 사용 (KPS 2019 convention).

---

## 7.4 Cross-Sectional R² (XS-R²)

paper p.19:
$$
\mathrm{XS\text{-}R}^2 = 1 - \frac{\frac{1}{N}\sum_{i=1}^N \frac{T_i}{T} \left( \frac{1}{T_i}\sum_{t \in T_i} \hat\epsilon_{t+1,i} \right)^2}{\frac{1}{N}\sum_{i=1}^N \frac{T_i}{T} \left( \frac{1}{T_i}\sum_{t \in T_i} R^e_{t+1,i} \right)^2}
$$

**기호 뜻**:
- 분자: 자산 $i$ 의 평균 잔차 ($\hat\alpha_i$) 의 제곱, weighted by $T_i/T$.
- 분모: 자산 $i$ 의 평균 수익률의 제곱, weighted by $T_i/T$.

**의미**: 평균 수익률의 **횡단면 R²**. **자산가격결정의 본질** — 자산 간 평균 차이를 모델이 얼마나 설명.

paper 본문:
> "The third performance measure is the average pricing error normalized by the average mean return to obtain a cross-sectional R² measure"

paper footnote 24:
> "We weight the estimated means by their rate of convergence to account for the differences in precision."

→ Unbalanced panel weighting (SE-style).

---

## 7.5 왜 3가지 지표 모두 필요한가? (paper Appendix B simulation)

paper p.20:
> "Appendix B includes a simulation that illustrates that all three evaluation metrics (SR, EV and XS-R²) are necessary to assess the quality of an SDF."

**시나리오**:
- **FFN**: SR 높지만 EV, XS-R² 낮을 수 있음 — extreme portfolio 만 잘 잡음.
- **Linear**: SR 높지만 interaction 못 잡아 EV/XS-R² 낮음.
- **No macro state**: SR 낮음 — business cycle 손실.

paper 본문:
> "A model like FFN can achieve high Sharpe ratios by loading on some extreme portfolios but it does not imply that it captures the loading structure correctly. Similarly, linear factors can achieve high Sharpe ratios but by construction cannot capture non-linear and interaction effects in the SDF loadings which is reflected in lower EV and XS-R². It does not matter how flexible the model is (e.g. FFN), by conditioning only on the most recent macroeconomic observations, general macroeconomic dynamics are ruled out, which seems to be the most strongly reflected in the Sharpe ratio. The no-arbitrage condition in the GAN model helps to deal with a low signal-to-noise ratio and to correctly estimate the SDF loadings of stocks that have small risk premia which is reflected in the XS-R²."

---

## 7.6 3 지표의 직관적 의미 비교

| 지표 | 측정 대상 | 누가 잘하나? |
|------|----------|-------------|
| **SR** | SDF portfolio 의 운용 효율 | extreme portfolio loading 잘 잡는 model (FFN 도 가능) |
| **EV** | 개별 stock 변동 설명 (시계열) | **함수형 정확** model (interaction 잡는 GAN) |
| **XS-R²** | 평균 수익률 횡단면 설명 | **risk premium 정확** model (no-arbitrage 의 GAN) |

→ **GAN 만 3가지 모두 좋음** (paper Table I 결과).

---

## 7.7 β 정의 — 모델별

paper p.19:
- **GAN**: 별도 FFN 으로 $\mathbb{E}[F R^e]$ 추정 → $\hat\beta_{GAN}$.
- **FFN benchmark**: $\hat\beta_{FFN} = \hat\mu_{FFN}$ (proportional).
- **EN**: $\mathbb{E}[F R^e]$ 의 elastic net regression.
- **LS**: $\mathbb{E}[F R^e]$ 의 OLS regression.

**Residual 계산**:
$$
\hat\epsilon_{t+1} = \left( I_N - \hat\beta_t (\hat\beta_t^\top \hat\beta_t)^{-1} \hat\beta_t^\top \right) R^e_{t+1}
$$

→ **projection 잔차** — β 의 column space 에 직교.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. SR 만으로 모델을 평가하면 안 되는 이유?
2. EV vs XS-R² 의 핵심 차이?
3. β 의 정의가 모델마다 다른 이유?

### 답변
1. SR 은 **extreme portfolio** 의 weight 만 잘 잡으면 높을 수 있음. 그러나 실제 자산가격결정은 **모든** 자산을 잘 가격결정해야 함 — middle quintile 도. paper Pelger-Xiong (2019) 의 "proximate factor" 결과: extreme factor weight 만 정확해도 SR 비슷하지만 loading 자체는 틀릴 수 있음. → EV, XS-R² 가 보완.
2. **EV** 는 **시계열 R²** — 개별 stock 의 cross-sectional regression residual $\epsilon$ 의 분산 비율 (non-demeaned). **XS-R²** 는 **횡단면 mean R²** — $\hat\alpha_i = \bar\epsilon_{T_i}$ 의 분산 비율. EV 는 "stock 변동 설명", XS-R² 는 "stock 평균 설명". 자산가격결정의 본질은 **mean** 이므로 XS-R² 가 더 중요.
3. β 의 정의는 SDF model 의 implications 와 일관해야 함. GAN 은 **second moment** $\mathbb{E}[F R^e]$ 를 직접 추정 (no-arbitrage 의 정확한 표현). FFN 은 conditional mean μ ∝ β (Eq $\mu = \beta E[F]$). EN/LS 는 같은 second moment 의 regression. 모델의 SDF representation 에 맞춰 일관성 유지.
