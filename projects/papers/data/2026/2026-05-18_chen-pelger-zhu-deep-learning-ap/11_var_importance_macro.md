# 11. Variable Importance & Macro States — Section III.F–G

> Section III.F–G (paper p.32–37) — 46 firm chars + 178 macro 의 중요도 + LSTM hidden states 의 의미.

## 11.1 챕터 한 줄 요약

GAN 의 SDF 에 가장 중요한 firm chars: **ST_REV, SUV, r12_2 (momentum)** — trading frictions + past returns 카테고리. 6 카테고리 모두 top 20 에 포함. FFN 은 trading friction 만 — penny stock illiquid 에 over-fit 의 의심. 4 LSTM hidden states 가 **NBER 경기침체 기간** 과 명확한 연관 — business cycle 자동 학습.

---

## 11.2 Variable Importance — 측정법

paper p.32:
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

## 11.3 Figure 11 — GAN Variable Importance

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

---

## 11.4 Figure 12 — FFN Variable Importance (대비)

![Fig. 12 — Characteristic Importance for FFN SDF](figures/page34_var_importance_FFN.png)

*paper p.34 Fig. 12 — FFN benchmark 의 importance. ST_REV, SUV, r12_2, LME 등 trading friction + past return 만 집중. 다른 카테고리 (value, profitability 등) 거의 무시.*

paper 본문 (p.33–34):
> "The SDF composition is different for FNN, where the first 14 characteristics are almost only in the trading friction and past return category. More specifically, this SDF loads heavily on short-term reversal, illiquidity measured by unexplained volume and size, which raises the suspicion that **a simple forecasting approach might focus mainly on illiquid penny stocks**. The no-arbitrage condition with informative test assets seems to be necessary to discipline the model to capture the pricing information in other characteristics."

**관찰**: 
- **GAN**: 6 카테고리 균형. value, intangibles, profitability 도 학습.
- **FFN**: trading friction + past return 집중 — penny stock illiquid 의존 의심.

→ **No-arbitrage 가 다양한 risk source 발견 강제** (single category 의 noise 의존 방지).

---

## 11.5 Variable Importance — Conditioning $g$ (Fig A.7, Appendix)

paper p.34:
> "Figure A.7 shows the variable importance ranking for the conditioning vector g. **The GAN test assets depend on all six major anomaly categories.** These test assets ensure that the GAN SDF also reflects this information."

→ Conditional network 도 6 카테고리 사용. SDF 와 conditional 둘 다 다양 — robust pricing.

---

## 11.6 Macro Variable Importance (Fig A.4, Appendix)

paper p.34 본문:
> "Figure A.4 shows the importance of the macroeconomic variables for the GAN model. These variables are first summarized into the four hidden states processes before they enter the weights of the SDF. First, it is apparent that **most macroeconomic variables have a very similar importance**. This is in line with a model where there is a strong dependency between the macroeconomic time series which is driven by a low dimensional non-linear factor structure."

paper 본문:
> "The two most relevant variables that stand out in our importance ranking are the **median bid-ask spread (Spread)** and the **federal fund rate (FEDFUNDS)**. These can be interpreted as capturing the overall economic activity level and overall market volatility."

→ 178 macro 중에서도 **spread + fed funds rate** 가 top — 경제 활동 + 시장 변동성의 proxy.

---

## 11.7 Figure 13 — LSTM Hidden States 와 NBER Recession

![Fig. 13 — Macroeconomic Hidden State Processes (LSTM)](figures/page36_LSTM_hidden.png)

*paper p.36 Fig. 13 — 4 hidden state 의 시계열 plot (LSTM 출력). 회색 영역 = NBER 경기침체. 특히 state 3, 4 가 경기침체 기간에 peak.*

paper p.35–37 본문:
> "Figure 13 plots the time series of the four hidden macroeconomic state variables. These variables are the outputs from the LSTM that encodes the history of macroeconomic information. ... The grey shaded areas indicate NBER recessions. First, it is apparent that **the state variables, in particular for the third and fourth state, peak during times of recessions**. Second, **the state processes seem to have a cyclical behavior** which confirms our intuition that the relevant macroeconomic information is likely to be related to business cycles."

paper:
> "The cycles and peaks of the different state variables do not coincide at all times indicating that they capture different macroeconomic risks."

→ **LSTM 이 명시적 supervision 없이 business cycle 학습**. NBER recession indicator 를 사후에 비교하니 peak 시점이 일치. 4 hidden state 가 서로 다른 macro risk 잡음.

---

## 11.8 SDF Structure (Section III.G)

paper p.36 본문:
> "Surprisingly, **individual characteristics have an almost linear effect on the pricing kernel and the risk loadings**, i.e. non-linearities matter less than expected for individual characteristics. Second, **the better performance of GAN is explained by non-linear interaction effects**, i.e. the general functional form of our model is necessary for capturing the dependency between multiple characteristics."

paper Figure 14 (위 본문에 인용된 plot):
- $\omega$ as function of single char: 거의 linear.
- $\omega$ as function of two chars (예: ST_REV × r12_2, LME × BEME): saddle/dome — **multiplicative interaction**.

paper 본문:
> "The figures show the variable importance and functional form of the SDF estimated on a rolling window of 240 months. The sensitivities and SDF weights $\omega$ are the average over those rolling window estimates."

---

## 11.9 정리

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
