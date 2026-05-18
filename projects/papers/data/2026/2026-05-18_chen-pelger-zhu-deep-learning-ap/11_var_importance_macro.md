# 11. Variable Importance & Macro States — Section III.F–G

> Section III.F–G (paper p.32–37) — 46 firm chars + 178 macro 의 중요도 + LSTM hidden states 의 의미.

## 11.1 챕터 한 줄 요약

GAN 의 SDF 에 가장 중요한 firm chars: **ST_REV, SUV, r12_2 (momentum)** — trading frictions + past returns 카테고리. 6 카테고리 모두 top 20 에 포함. FFN 은 trading friction 만 — penny stock illiquid 에 over-fit 의 의심. 4 LSTM hidden states 가 **NBER 경기침체 기간** 과 명확한 연관 — business cycle 자동 학습.

---

## 11.2 GAN factor vs Fama-French 5 (Table A.V)

paper Section III.F opening (journal p.32):
> "What is the structure of the SDF factor? As a first step in Table A.V we compare the GAN factor with the Fama-French 5 factor model. None of the five factors has a high correlation with our factor with the profitability factor having the highest correlation with 17%. The market factor has only a correlation of 10%. Next, we run a time series regression to explain the GAN factor portfolio with the Fama-French 5 factors. Only the profitability factor is significant. The strongly significant pricing error indicates that these factors fail to capture the pricing information in our SDF portfolio."

**핵심 수치**:
| FF5 factor | Correlation with GAN factor |
|------------|-----------------------------|
| Market | 10% |
| SMB | (low) |
| HML | (low) |
| RMW (Profitability) | **17%** (highest) |
| CMA | (low) |

**해석**: GAN factor 가 Fama-French 5 factors 와 거의 무관 — **새로운 risk dimension** 을 잡고 있음. 회귀에서 profitability 만 유의 + 강한 pricing error → FF5 가 GAN 의 정보 못 잡음.

---

## 11.3 Variable Importance — 측정법

paper p.32 본문 (Section III.F):
$$
\mathrm{Sensitivity}(x_j) = \frac{1}{C} \sum_i \sum_t \left| \frac{\partial \omega(x_i)}{\partial x_j} \right|
$$

**기호 뜻**:
- $\omega$ — SDF weight network.
- $x_j$ — j-th characteristic.
- $\partial / \partial x_j$ — j-th 변수에 대한 partial derivative (gradient).
- $C$ — normalization constant (전체 합 = 1).

paper 본문:
> "This simplifies to the standard slope coefficient in the special case of a linear regression framework. A larger sensitivity means that a variable has a larger effect on the SDF weight ω."

→ **Gradient-based** variable importance (NN 에서 표준).

---

## 11.4 Figure 11 — GAN Variable Importance

![Fig. 11 — Characteristic Importance for GAN SDF](figures/page33_var_importance_GAN.png)

*paper p.33 Fig. 11 — 46 firm chars 의 importance (color = category). 가장 중요: ST_REV (Trading Frictions), SUV, r12_2 (momentum). 6 카테고리 모두 top 20 에 포함.*

### Top variables (GAN, 시각 확인)

| 순위 | 변수 | 카테고리 |
|------|------|---------|
| 1 | **ST_REV** (short-term reversal) | Past Returns |
| 2 | **SUV** (standard unexplained volume) | Trading Frictions |
| 3 | **r12_2** (12-month momentum) | Past Returns |
| 4 | NOA | Investment |
| 5 | SGA2S | Profitability |
| 6 | LME (size) | Trading Frictions |
| 7 | RNA | Profitability |
| 8 | LTurnover | Trading Frictions |
| 9 | Lev | Trading Frictions |
| 10 | Resid_Var | Trading Frictions |
| ... | (Figure 11 참조) | |

paper 본문 (p.33):
> "Figure 11 ranks the variable importance of the 46 firm-specific characteristics for GAN. The sum of all sensitivities is normalized to one. ... All three models GAN, FFN and EN select trading frictions and past returns as being the most relevant categories. **The most important variables for GAN are Short-Term Reversal (ST_REV), Standard Unexplained Volume (SUV) and Momentum (r12_2). Importantly, for GAN all 6 categories are represented among the first 20 variables**, which includes value, intangibles, investment and profitability characteristics."

```viz:dlap-var-importance:title=paper Fig 11 / 12 — 46 chars variable importance (interactive),caption=Model 토글로 GAN vs FFN 전환. Top-K 슬라이더로 표시 개수 조절. GAN 은 6 카테고리 모두 top 20, FFN 은 trading friction + past return 만 집중. paper Section III.F 가 FFN 의 'penny stock 의존 의심' 으로 해석. **주의**: paper 가 정확한 sensitivity 수치 본문 미발표 — viz 값은 Fig 11/12 막대 길이의 시각 reading 기반.
```

---

## 11.5 Figure 12 — FFN Variable Importance (대비)

![Fig. 12 — Characteristic Importance for FFN SDF](figures/page34_var_importance_FFN.png)

*paper p.34 Fig. 12 — FFN benchmark 의 importance. ST_REV, SUV, r12_2, LME 등 trading friction + past return 만 집중. 다른 카테고리 (value, profitability 등) 거의 무시.*

paper 본문 (p.33–34):
> "The SDF composition is different for FNN, where the first 14 characteristics are almost only in the trading friction and past return category. More specifically, this SDF loads heavily on short-term reversal, illiquidity measured by unexplained volume and size, which raises the suspicion that **a simple forecasting approach might focus mainly on illiquid penny stocks**. The no-arbitrage condition with informative test assets seems to be necessary to discipline the model to capture the pricing information in other characteristics."

**관찰**: 
- **GAN**: 6 카테고리 균형. value, intangibles, profitability 도 학습.
- **FFN**: trading friction + past return 집중 — penny stock illiquid 의존 의심.

→ **No-arbitrage 가 다양한 risk source 발견 강제** (single category 의 noise 의존 방지).

---

## 11.6 Variable Importance — Conditioning $g$ (Fig A.7, Appendix)

paper p.34:
> "Figure A.7 shows the variable importance ranking for the conditioning vector g. **The GAN test assets depend on all six major anomaly categories.** These test assets ensure that the GAN SDF also reflects this information."

→ Conditional network 도 6 카테고리 사용. SDF 와 conditional 둘 다 다양 — robust pricing.

---

## 11.7 Macro Variable Importance (Fig A.4, Appendix)

paper p.34 본문:
> "Figure A.4 shows the importance of the macroeconomic variables for the GAN model. These variables are first summarized into the four hidden states processes before they enter the weights of the SDF. First, it is apparent that **most macroeconomic variables have a very similar importance**. This is in line with a model where there is a strong dependency between the macroeconomic time series which is driven by a low dimensional non-linear factor structure."

paper 본문:
> "The two most relevant variables that stand out in our importance ranking are the **median bid-ask spread (Spread)** and the **federal fund rate (FEDFUNDS)**. These can be interpreted as capturing the overall economic activity level and overall market volatility."

→ 178 macro 중에서도 **spread + fed funds rate** 가 top — 경제 활동 + 시장 변동성의 proxy.

---

## 11.8 Figure 13 — LSTM Hidden States 와 NBER Recession

![Fig. 13 — Macroeconomic Hidden State Processes (LSTM)](figures/page36_LSTM_hidden.png)

*paper p.36 Fig. 13 — 4 hidden state 의 시계열 plot (LSTM 출력). 회색 영역 = NBER 경기침체. 특히 state 3, 4 가 경기침체 기간에 peak.*

paper p.35–37 본문:
> "Figure 13 plots the time series of the four hidden macroeconomic state variables. These variables are the outputs from the LSTM that encodes the history of macroeconomic information. ... The grey shaded areas indicate NBER recessions. First, it is apparent that **the state variables, in particular for the third and fourth state, peak during times of recessions**. Second, **the state processes seem to have a cyclical behavior** which confirms our intuition that the relevant macroeconomic information is likely to be related to business cycles."

paper:
> "The cycles and peaks of the different state variables do not coincide at all times indicating that they capture different macroeconomic risks."

→ **LSTM 이 명시적 supervision 없이 business cycle 학습**. NBER recession indicator 를 사후에 비교하니 peak 시점이 일치. 4 hidden state 가 서로 다른 macro risk 잡음.

```viz:dlap-lstm-states:title=paper Fig 13 — 4 LSTM hidden states + NBER (interactive),caption=State 1-4 buttons toggle on/off. 회색 음영 = NBER 경기침체 7개 (1969, 1973, 1980, 1981, 1990, 2001, 2008). State 3, 4 가 recession 기간에 peak. **주의**: paper 가 정확 state 값 미발표 — 본 viz 의 시계열은 paper 본문 ("cyclical + recession peak") 와 NBER 데이터 기반의 정성 재현.
```

---

## 11.9 SDF Structure (Section III.G)

paper p.36 본문 두 핵심 발견:
> "Surprisingly, **individual characteristics have an almost linear effect on the pricing kernel and the risk loadings**, i.e. non-linearities matter less than expected for individual characteristics. Second, **the better performance of GAN is explained by non-linear interaction effects**, i.e. the general functional form of our model is necessary for capturing the dependency between multiple characteristics."

### 11.9.1 Figure 14 — Pairwise Interaction (2D line plot)

paper Fig 14 (journal p.36) — 2 sub-panels, **각 panel 안에 5개 line (10%, 25%, 50%, 75%, 90% quantile of 2nd variable)**:

**(a) ST_REV × r12_2 (momentum)**:
- 좌측: $\omega$ vs ST_REV, conditioned on quantile of r12_2.
- 우측: $\omega$ vs r12_2, conditioned on quantile of ST_REV.

**(b) LME × BEME (size × value)**:
- 좌측: $\omega$ vs LME, conditioned on quantile of BEME.
- 우측: $\omega$ vs BEME, conditioned on quantile of LME.

paper Fig 14 note:
> "These figures show the SDF weight ω as function of short-term reversal, momentum, size and book-to-market ratio for different quantiles of the second variable while keeping the remaining variables at their mean level."

paper 본문 (p.37):
> "In an additive model without interaction all lines would be parallel shifts. This is exactly what we see for the two linear models. Interestingly, for size and value, the FFN model also has almost parallel shifts in the SDF weights, implying that it does not capture interactions. However, for GAN small stocks have a very different exposure to value than large cap stocks. The line plots for GAN reveal more complex interaction patterns than for the other models."

→ **Key test**: parallel shifts = additive (no interaction). GAN 만 non-parallel → **interaction 만 잡음**.

### 11.9.2 Figure 15 — Full 2D Contour + Triple Interaction

paper Fig 15 (journal p.37) — 4 sub-panels, **2D contour heatmap**:

**(a)** ST_REV × r12_2 interaction (2D contour)
**(b)** LME × BEME interaction (2D contour)
**(c)** ST_REV, r12_2, SUV triple interaction
**(d)** LME, BEME, ST_REV triple interaction

paper Fig 15 note:
> "These figures show the SDF weight ω as two- and three-dimensional function of characteristics keeping the remaining variables at their mean level."

paper 본문 (p.37):
> "Instead of conditioning on only five quantiles for the second characteristic, we plot the two-dimensional pricing kernel for GAN in Figure 15. It confirms that the combined size and book-to-market characteristics have a highly non-linear effect on the GAN pricing kernel. The triple interaction in Figure 15 shows that **low short-term reversal, high momentum and high explained volume has the highest positive weight while high reversal, low momentum and low unexplained volume has the largest negative weight in the kernel** when conditioning on these three characteristics. Low reversal and low momentum or high reversal and high momentum have an almost neutral effect independent of unexplained volume. The interaction effect for size, book-to-market and short-term reversal is even more complicated."

→ **3-way interaction** 의 구체적 해석:
- Low ST_REV + High momentum + High SUV → **highest positive weight**.
- High ST_REV + Low momentum + Low SUV → **largest negative weight**.
- 다른 조합 → 거의 neutral.

### 11.9.3 Figure A.9 — Univariate (1D) Relationships

paper p.36 본문:
> "Figure A.9 plots the one-dimensional relationship between the SDF weights ω and one specific characteristic. ... **It is striking how close the functional form of the SDF for GAN and FFN is to a linear function.** This explains why linear models are actually so successful in explaining single-sorted characteristics. For a small number of characteristics, for example short-term reversal, GAN has some non-linearities around the median. These are exactly the decile sorted portfolios for which GAN performs better than FFN and EN."

→ **개별 char → ω 의 1D 관계가 거의 linear**. 비선형은 ST_REV 등 일부 char 의 median 근처에서만 약간.

→ Linear model (LS) 의 single-sorted 성공 설명 + GAN 우위의 정확한 위치 (interaction) 명시.

paper figure note:
> "The figures show the variable importance and functional form of the SDF estimated on a rolling window of 240 months. The sensitivities and SDF weights $\omega$ are the average over those rolling window estimates."

---

## 11.10 정리

```
[ Variable Importance — GAN (Fig 11) ]
                                                     
  Top 10:  ST_REV, SUV, r12_2, NOA, SGA2S,           
           LME, RNA, LTurnover, Lev, Resid_Var       
                                                     
  6 카테고리 모두 top 20 에 포함:                     
   - Trading Frictions (ST_REV, SUV, LME, ...)       
   - Past Returns (r12_2, r36_13, ...)               
   - Investment (NOA, Investment, AC, ...)           
   - Profitability (RNA, ROA, ROE, ...)              
   - Value (BEME, A2ME, ...)                         
   - Intangibles (AT, OL, ...)                       
                                                     
[ vs FFN (Fig 12) ]                                  
  Trading Friction + Past Return 만 집중             
  → Penny stock illiquid 에 over-fit 의 의심          
  → No-arbitrage 가 다양성 강제                       
                                                     
[ LSTM Hidden States (Fig 13) ]                      
  4 states 의 time series                            
  Gray = NBER recession                              
  → State 3, 4 가 recession 에서 peak                
  → 명시적 supervision 없이 business cycle 학습      
                                                     
[ SDF Structure ]                                    
  Single char → ω: 거의 linear                       
  Char × char → ω: strong nonlinear (saddle/dome)    
  → 비선형 interaction = GAN 의 진짜 차별점            
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. GAN vs FFN 의 variable importance 차이가 의미하는 것?
2. LSTM 이 NBER recession 을 학습한다는 게 어떤 의미?
3. "Individual char linear, interaction nonlinear" 발견의 학계 함의?

### 답변
1. **GAN**: 6 anomaly 카테고리 모두 활용 — 다양한 risk source 학습. **FFN**: trading friction + past return 만 집중 — 이는 penny stock 의 illiquid mispricing 에 의존하는 의심. 본 논문 (paper p.34): "raises the suspicion that a simple forecasting approach might focus mainly on illiquid penny stocks." No-arbitrage condition 이 다양한 risk premium 발견 강제 (한 카테고리의 noise 대신).
2. **명시적 supervision 없이 business cycle 학습**. LSTM 은 178 macro 시계열의 다이내믹을 4 hidden state 로 압축. 본 논문은 NBER recession indicator 를 input 으로 주지 않음. 그러나 학습된 hidden state 의 시계열 peak 가 NBER recession 시점과 일치. → **LSTM 이 자율적으로 economic regime 발견**. 후속 연구에서 explicit regime indicator 없이도 cyclical pattern 학습 가능 증명.
3. **학계 함의 2가지**: (1) **Linear models 의 강점 설명** — 왜 단순 Fama-French linear 가 single-sorted 에서 잘하는지 — 개별 특성의 SDF 효과가 진짜 거의 linear 라서. (2) **비선형의 본질** — 비선형은 **interaction 에서** 발현. 따라서 future research 는 single char 보다 **char × char interaction** (또는 char × macro) 발견에 집중해야. 본 논문 paper Fig 14 의 SDF surface plots 가 이 메시지의 시각적 증명.
