# 13. Appendix — Section A-I

> Appendix A-I (paper p.47–75+) — FFN/LSTM detail, simulation, SDF overview, characteristics list.

## 13.1 챕터 한 줄 요약

본 챕터는 paper Appendix 9개 (A-I) 의 핵심 내용 정리. 가장 중요한 부분: (1) **Appendix B simulation** — 3 evaluation metrics 모두 필요함을 증명, (2) **Appendix C** — conditional SDF 모델 전반의 통합 이론.

---

## 13.2 Appendix A — Estimation Method (FFN, RNN, Implementation)

paper p.47–55 본문.

### A.A Feedforward Network 의 detail
- Multi-layer: $x^{(l)} = \mathrm{ReLU}(W^{(l-1)\top} x^{(l-1)} + w_0^{(l-1)})$, $l = 1, ..., L$.
- Output: $y = W^{(L)\top} x^{(L)} + w_0^{(L)}$.
- Loss: Adam optimizer.

### A.B Recurrent Neural Network (LSTM) — paper Appendix B (journal p.49–51) 정확한 수식

paper opening:
> "The LSTM is composed of a cell (the memory part of the LSTM unit) and three 'regulators', called gates, of the flow of information inside the LSTM unit: an input gate, a forget gate, and an output gate."

**Candidate cell** (current input $x_t = I_t$, previous hidden state $h_{t-1}$):
$$
\tilde c_t = \tanh(W_h^{(c)} h_{t-1} + W_x^{(c)} x_t + w_0^{(c)})
$$

**3 gates** (sigmoid):
$$
\mathrm{input}_t = \sigma(W_h^{(i)} h_{t-1} + W_x^{(i)} x_t + w_0^{(i)})
$$
$$
\mathrm{forget}_t = \sigma(W_h^{(f)} h_{t-1} + W_x^{(f)} x_t + w_0^{(f)})
$$
$$
\mathrm{out}_t = \sigma(W_h^{(o)} h_{t-1} + W_x^{(o)} x_t + w_0^{(o)})
$$

**Memory cell update** ($\circ$ = element-wise product):
$$
c_t = \mathrm{forget}_t \circ c_{t-1} + \mathrm{input}_t \circ \tilde c_t
$$

**Hidden state output**:
$$
h_t = \mathrm{out}_t \circ \tanh(c_t)
$$

paper 본문 (p.50):
> "We use the state processes $h_t$ instead of the macroeconomic variables $I_t$ as input to our SDF network."

→ **3 gates (input, forget, output) + memory cell $c_t$ + hidden state $h_t$**.

**기호 차이 주의**: paper 는 input/forget/output gate 의 weights 를 $h$ vs $x$ 의 **별도 행렬** ($W_h^{(i)}, W_x^{(i)}$) 로 명시. Standard textbook LSTM 의 concatenated form $W^{(i)} [h_{t-1}, x_t]$ 와 수학적으로 동등.

### A.C Implementation
paper p.54–55 — 구체적 코드 detail, batch size, learning rate schedule, validation 절차.

---

## 13.3 Appendix B — Simulation Example

paper p.52–55 (Appendix B 전체) + Table A.I.

### 13.3.1 Setup (paper p.52)

paper 본문:
> "We illustrate with simulations that (1) the no-arbitrage condition in GAN is necessary to find the SDF in a low signal-to-noise setup, (2) the flexible form of GAN is necessary to correctly capture the interactions between characteristics, and (3) the RNN with LSTM is necessary to correctly incorporate macroeconomic dynamics in the pricing kernel."

**Model**: $R^e_{t+1,i} = \beta_{t,i} F_{t+1} + \epsilon_{t+1,i}$
- $F_t \sim \mathcal{N}(\mu_F, \sigma_F^2)$ iid
- $\epsilon_{t,i} \sim \mathcal{N}(0, \sigma_\epsilon^2)$ iid

**Parameters** (paper Table A.I note):
- $N = 500$, $T = 600$
- $T_{train} = 250$, $T_{valid} = 100$, $T_{test} = 250$
- SDF SR = 1, $\sigma_F^2 = 0.1$, $\sigma_\epsilon^2 = 1$
- $\mu_M = 0.05$ (macro trend)

**Two setups**:

**Setup 1 — Two characteristics (multiplicative interaction)**:
$$
\beta_{t,i} = C^{(1)}_{t,i} \cdot C^{(2)}_{t,i}, \quad C^{(1)}, C^{(2)} \sim \mathcal{N}(0, 1)
$$

**Setup 2 — One char + macro state**:
$$
\beta_{t,i} = C_{t,i} \cdot b(h_t), \quad b(h) = \begin{cases} 1 & h > 0 \\ -1 & \text{otherwise} \end{cases}
$$
$$
h_t = \sin(\pi t / 24) + \tilde h_t, \quad \tilde h_t \sim \mathcal{N}(0, 0.25)
$$
관측: $Z_t = \mu_M t + h_t$ (non-stationary, trend + cyclical).

### 13.3.2 Table A.I — Simulation Results (paper p.53, 정확한 수치)

**Setup 1 — Two characteristics (no macro)**:
| Model | Train SR | Valid SR | Test SR | Train EV | Test EV | Train XS-R² | Test XS-R² |
|-------|----------|----------|---------|----------|---------|-------------|------------|
| **Population** | 0.96 | 1.09 | 0.94 | 0.16 | 0.17 | 0.17 | 0.17 |
| **GAN** | 0.98 | 1.11 | 0.94 | 0.12 | 0.13 | 0.10 | 0.07 |
| **FFN** | 0.94 | 1.04 | 0.89 | 0.05 | 0.05 | **-0.30** | **-0.33** |
| **LS** | 0.07 | -0.10 | 0.01 | 0.00 | 0.00 | 0.00 | 0.01 |

paper 본문 (p.52-53):
> "The GAN model outperforms the forecasting approach and the linear model in all categories. Note, that it is not necessary to include the elastic net approach as the number of covariates is only two and hence the regularization does not help. The Sharpe Ratio of the estimated GAN SDF reaches the same value as the population SDF used to generate the data. ... Note, that the simple forecasting approach can generate a high Sharpe Ratio but fails in explaining the systematic component."

**핵심**: 
- **GAN SR = Population SR** (0.94) — 진짜 SDF 회복.
- **FFN SR 높지만 XS-R² 음수 (-0.33)** — extreme portfolio 만 잡고 loading 못 잡음.
- **LS = 거의 0** — multiplicative interaction 못 잡음.

**Setup 2 — One char + macro state**:
| Model | Train SR | Valid SR | Test SR | Test EV | Test XS-R² |
|-------|----------|----------|---------|---------|------------|
| **Population** | 0.89 | 0.92 | 0.86 | 0.17 | 0.15 |
| **GAN** | 0.79 | 0.77 | 0.64 | 0.17 | 0.15 |
| **FFN** | 0.05 | -0.05 | 0.06 | 0.02 | 0.02 |
| **LS** | 0.12 | -0.05 | 0.10 | 0.15 | 0.14 |

paper 본문:
> "Appendix B includes a simulation that illustrates that all three evaluation metrics (SR, EV and XS-R²) are necessary to assess the quality of an SDF."

**핵심**:
- **GAN 만 macro state 잡음** — Test SR 0.64 vs FFN/LS ~0.1.
- **LS 도 EV/XS-R² 잡음** — 우연이 아니라 cross-section 의 linear 효과는 잘 잡지만 macro 동학 못 잡아 SR 낮음.

paper Fig A.2 (p.54): GAN 의 SDF surface 가 Population 의 multiplicative pattern 정확히 재현. FFN 은 diffuse, LS 는 flat.
paper Fig A.3 (p.56): LSTM 의 hidden state 가 true 의 sin(πt/24) cyclical pattern 정확히 추출.

→ Simulation 은 **paper Table I 의 실증 결과가 architectural choices 의 구조적 효과** 임을 입증.

---

## 13.4 Appendix C — Conditional SDF Models 의 통합

paper p.55–66 (Appendix C 전체).

paper Appendix C opening:
> "We survey the most recent advances of relevant machine learning methods in asset pricing and explain their differences. All asset pricing models are captured by the general framework introduced in Section I.A, which is based on the fundamental moment equation $\mathbb{E}_t[M_{t+1} R^e_{t+1,i}] = 0$, which implies the factor representation $R^e_{t+1,i} = \beta^{SDF}_{t,i} F_{t+1} + \epsilon_{t+1,i}$. Different asset pricing model impose different structures on the SDF weights $\omega$ and SDF loadings $\beta^{SDF}$."

### C.A Characteristic Projection & Unconditional Models (paper p.57+)
paper:
> "The most common way is to translate the problem into an unconditional asset pricing model on sorted portfolios. Under additional assumptions one could obtain a valid SDF $M_{t+1}$ conditional on a set of asset-specific characteristics $I_{t,i}$ by its projection on the return space: $M_{t+1} = 1 - \omega_t^\top R^e_t$ with $\omega_{t,i} = f(I_{t,i})$ ..."

→ Fama-French 등의 unconditional model 은 characteristic-managed portfolio 의 mean-variance optimization 으로 환원.

### C.B Inversion of Unconditional Models (paper p.59)
paper:
> "In order to use an SDF, which is estimated as an unconditional model from conditional portfolio sorts or projections, we need to invert the conditional projection. ... We need to estimate the conditional covariance of each stock with the SDF portfolios"

핵심 식 (paper):
$$
\beta^{SDF}_{t,i} = \frac{\mathrm{Cov}_t(R^e_{t+1,i}, F_{t+1})}{\mathrm{Var}_t(F_{t+1})} = \frac{\mathrm{Cov}_t(R^e_{t+1,i}, \tilde w^\top \tilde R_t)}{\mathrm{Var}_t(\tilde w^\top \tilde R_t)}
$$

→ Unconditional SDF 를 individual stocks 에 mapping 하려면 conditional covariance 필요. **Stationary portfolio sort 가 individual stocks 에는 conditional model 임**.

### C.C Unconditional Factor Models (paper p.59 Eq A.3, A.4)
paper:
> "The linear factor model literature imposes the additional assumption that a small number of risk factors based on characteristic managed portfolios should span the SDF."

Factor structure (Eq A.3):
$$
\tilde R_{t,i} = \tilde F_t \tilde \beta_i^\top + e_{t,i}
$$

Tangency portfolio weights (Eq A.4):
$$
\tilde \omega^{\tilde F} = \Sigma_{\tilde F}^{-1} \mu_{\tilde F}
$$

→ **PCA, RP-PCA (Lettau-Pelger 2020), Fama-French** 등이 이 framework.

paper 핵심:
> "The factors can be observed fundamental factors, for example the Fama-French factor model of Fama and French (2015), or latent asset pricing factors estimated from the unconditional moments of $\tilde R_t$ by PCA or its improvement RP-PCA (Lettau and Pelger (2020))."

### C.D Conditional Factor Models (paper p.62)
- KPS / IPCA 의 conditional 일반화.
- Linear conditioning: $\omega_{t,i} = \theta^\top I_{t,i}$.
- 본 논문 의 LS, EN benchmark 와 직접 대응.

### C.E Adversarial Estimation & Mean-Variance Optimization (paper p.65)
- Hansen-Jagannathan (1997) 의 minimax 와 본 논문의 adversarial 의 연결.
- Mean-Variance Optimization 의 dual.
- Bryzgalova-Pelger-Zhu (2020) 의 robust SDF 와 연결.

paper 핵심 메시지 (p.13, Section I.C):
> "Appendix C provides a detailed overview of the various models for conditional SDFs and their relationship to our framework."

→ **모든 기존 SDF 모델 (Fama-French, PCA, IPCA, KNS, RP-PCA)** 이 본 논문 framework 의 special case 로 표현 가능.

### Figure A.3 — Macroeconomic State Dynamics (Appendix C)
paper Fig A.3 (p.56): LSTM 의 hidden state 가 어떻게 추출되는지 시각적 illustration.
- (a) Observed macro variable
- (b) First-order difference (stationary)
- (c) True hidden state (시뮬)
- (d) LSTM-fitted hidden state

→ paper Appendix B simulation 과 함께 LSTM 의 동학 학습 능력 입증.

---

## 13.5 Appendix D — List of Firm-Specific Characteristics

paper p.66–72 (Table A.II 의 전체 list).

**46 characteristics, 6 categories**:

### Past Returns (8)
ST_REV, mom1m, mom6m, mom12m, mom36m, r2_1, r12_2, r12_7, r36_13

### Investment (7)
Investment, NOA, AC, OA, DPI2A, NI, ATO

### Profitability (8)
ROA, ROE, OP, PROF, PM, FC2Y, CTO, RNA

### Intangibles (5)
AT, OL, IdioVol, MktBeta, Beta

### Value (8)
BEME, A2ME, S2P, D2P, E2P, CF2P, Q, CF

### Trading Frictions (10)
SUV, LME, LTurnover, Lev, Resid_Var, Variance, Spread, Rel2High, PCM, betasq, D2A, SGA2S, LT_Rev

(정확한 list 는 paper Table A.II 참조.)

---

## 13.6 Appendix E — Asset Pricing Results for Sorted Portfolios

paper p.72–73 (Tables A.III, A.IV).

추가 표:
- **Table A.III**: 전체 46 characteristics 의 decile portfolios 결과 (Table III 의 확장).
- **Table A.IV**: Double-sorted (ST_REV × momentum, size × BEME) 결과.

GAN 의 압도 패턴 유지.

---

## 13.7 Appendix F — Variable Importance

paper p.73 (Figs A.4-A.8).

추가 figure:
- **Fig A.4**: Macro variable importance for GAN (178 macro 중).
- **Fig A.5, A.6**: Variable importance for EN, LS.
- **Fig A.7**: Conditioning $g$ 의 variable importance.
- **Fig A.8**: GAN No Frict (trading friction 제외) 의 importance.

---

## 13.8 Appendix G — SDF Structure

paper p.73–74 (Fig 14 + functional form).

핵심 발견 (paper 본문 인용):
> "Surprisingly, individual characteristics have an almost linear effect on the pricing kernel and the risk loadings, i.e. non-linearities matter less than expected for individual characteristics. Second, the better performance of GAN is explained by non-linear interaction effects."

**Fig 14**: $\omega$ as function of two chars 의 contour/surface plot.
- ST_REV × r12_2 (momentum × short-term reversal)
- LME × BEME (size × book-to-market)
- 각 plot 이 multiplicative interaction pattern 보임.

---

## 13.9 Appendix H — Machine Learning Investment (paper Section III.I 추가 detail)

paper p.41–42 Section III.I 본문 + Appendix H:

### 13.9.1 GAN SDF 의 risk-return trade-off
paper Table A.VI: monthly Sharpe ratios, max 1-month loss (정규화), max drawdown — GAN 이 SR 최고, drawdown 다른 model 과 comparable.

### 13.9.2 Fig 16 — Cumulative SDF Returns
paper p.41 Fig 16: GAN, FFN, EN, LS 의 cumulative excess returns (vol-normalized). GAN 이 최대 + variance 최소 + drawdown 적음.

### 13.9.3 Trading Friction Cutoffs (paper Fig 17)
paper p.42 본문 — trading friction stocks 제외 시 GAN annualized SR:
- **40% smallest stocks 제외 (by LME)**: SR 1.73
- **40% highest bid-ask spread 제외 (by Spread)**: SR 2.07
- **40% lowest turnover 제외 (by LTurnover)**: SR 1.87

paper 인용 (p.42):
> "Note that these are all lower bounds as GAN has not been re-estimated without these stocks, but we have just set the portfolio weights of the stocks below the cutoffs to zero."

→ **Trading friction 고려 시에도 GAN 의 SR 견고**. Avramov-Cheng-Metzker (2020) 의 "ML portfolio 가 transaction cost 로 deteriorate" 우려에 대응.

### 13.9.4 ML Investment 의 새 paradigm
paper p.42 본문:
> "most paper have separated the construction of profitable machine learning portfolios into two steps. In the first step, machine learning methods extract signals for predicting future returns. In a second step, these signals are used to form profitable portfolios... However, we argue that these two steps should be merged together, that is machine learning techniques should extract the signals that are the most relevant for the overall portfolio design."

→ **본 논문 framework 가 이 통합** — SDF (= conditional mean-variance efficient portfolio) 직접 추정.

---

## 13.9.5 Section III.J — SDF of Multi-Factor Models (paper Table VI)

paper p.42–45 본문 + Table VI.

### IPCA (KPS 2019) 와의 결합

paper Section III.J 의 framework:
- IPCA model: $R^e_{t+1,i} = a_{t,i} + b_{t,i}^\top f^{IPCA}_{t+1} + \epsilon_{t+1,i}$ with $b_{t,i} = I_{i,t}^\top \Gamma_b$.
- SDF as linear combination of IPCA factors: $F = \sum_k \omega^f_k(I_{k,t}, I_t) f^{IPCA}_{t+1,k}$ (Eq 5).

### Table VI — GAN + IPCA 결과 (정확한 수치, OOS Test)

K (IPCA factors): 3 ~ 10. 핵심 K=10 결과:

| Model | SR | EV | XS-R² |
|-------|-----|-----|-------|
| **IPCA GAN** ($\omega^{I-GAN}, \beta^{I-GAN}$) | 0.81 | 0.05 | **0.21** |
| IPCA Max SR FFN Beta | 0.94 | 0.03 | 0.14 |
| IPCA Max SR | 0.94 | 0.01 | -0.04 |
| IPCA Max EV | 0.16 | 0.04 | -0.03 |
| IPCA Max XS-R² | 0.41 | -0.02 | 0.14 |
| IPCA Multifactor | 0.94 | 0.07 | -0.02 |

paper 본문 (p.44):
> "We can replicate the high Sharpe ratios of Kelly, Pruitt, and Su (2019) by forming the unconditional mean variance efficient combination of the IPCA factors."

**핵심 발견**:
- IPCA Max SR (SR 0.94): 높지만 XS-R² **-0.04** — pricing error 못 잡음.
- IPCA Multifactor (SR 0.94): XS-R² **-0.02** — 같은 한계.
- **IPCA GAN (SR 0.81, XS-R² 0.21)**: SR 약간 낮지만 **XS-R² 5배 향상**.

→ **GAN 의 conditioning 이 IPCA framework 와 결합 시 pricing error 까지 잡음**. paper 본문 (p.44):
> "Here we show that using the additional economic structure of spanning the SDF with IPCA factors and combining it with the GAN framework can lead to an even better asset pricing model."

→ 본 논문 framework 가 **multi-factor model 과 complementary** — 두 paradigm 결합 가능.

---

## 13.10 Appendix I — Implementation & Robustness

paper p.74–75 + paper Section III.H (본문 robustness):

### 13.10.1 Table IV — Large Market Cap Stocks

paper Table IV (정확한 수치, OOS Test):

**Estimated on all stocks, evaluated on size ≥ 0.001% of total market cap (≈ top 1,500 stocks)**:
| Model | Test SR | Test EV | Test XS-R² |
|-------|---------|---------|------------|
| LS    | 0.13    | 0.03    | 0.10       |
| EN    | 0.15    | 0.06    | 0.14       |
| FFN   | 0.30    | 0.05    | 0.18       |
| **GAN** | **0.41** | **0.14** | **0.26**  |

**Evaluated on size ≥ 0.01% (≈ top 550 stocks ≈ S&P 500)**:
| Model | Test SR | Test EV | Test XS-R² |
|-------|---------|---------|------------|
| LS    | -0.06   | 0.04    | 0.09       |
| EN    | 0.23    | 0.07    | 0.14       |
| FFN   | 0.24    | 0.09    | 0.26       |
| **GAN** | **0.26** | **0.18** | **0.32**  |

paper p.38–39:
> "an annual out-of-sample Sharpe ratio of 1.4 using only the 1,500 largest stocks. In contrast, the linear models collapse."

→ Monthly 0.41 × √12 ≈ 1.42 annualized — paper 본문과 일치.

### 13.10.2 Table V — Alternative GAN Models (Robustness)

paper Table V (정확한 수치):
| Model | Test SR | Test EV | Test XS-R² | 비고 |
|-------|---------|---------|------------|------|
| GAN 1 | 0.72    | 0.07    | 0.21       | best valid, alt 1 |
| GAN 2 | 0.77    | 0.07    | 0.22       | best valid, alt 2 |
| GAN 3 | 0.74    | 0.09    | 0.25       | best valid, alt 3 |
| GAN 4 | 0.77    | 0.07    | 0.22       | best valid, alt 4 |
| GAN Rolling | **0.88** | 0.08 | 0.24 | 240-month rolling window |
| GAN No Frict | 0.77 | 0.08 | 0.23 | trading friction 제외 |

paper 본문 (p.40):
> "the rolling window GAN SDF has a correlation of 70% with our benchmark SDF... a time-varying estimate of GAN does not lead to major improvements and fits a similar economic structure."

paper 본문 (Section III.H):
> "Our findings are robust to the time periods under consideration, small capitalization stocks, the choice of the tuning parameters, and limits to arbitrage. The SDF structure is surprisingly stable over time."

### 13.10.3 Robustness 요약
- 다른 hyperparameter 조합으로도 거의 같은 SDF (correlation > 80%, paper Section III.H).
- Rolling window — benchmark 와 70% correlation.
- Trading friction 제외 — benchmark 와 78% correlation.
- Large cap subset 에서도 GAN > 다른 모델.
- **결과 매우 robust** — different tuning 으로도 같은 economic model 발견.

---

## 13.10 Appendix I — Implementation & Robustness

paper p.74–75 + paper Section III.H (본문 robustness):

### 13.10.1 Table IV — Large Market Cap Stocks

paper Table IV (정확한 수치, OOS Test):

**Estimated on all stocks, evaluated on size ≥ 0.001% of total market cap (≈ top 1,500 stocks)**:
| Model | Test SR | Test EV | Test XS-R² |
|-------|---------|---------|------------|
| LS    | 0.13    | 0.03    | 0.10       |
| EN    | 0.15    | 0.06    | 0.14       |
| FFN   | 0.30    | 0.05    | 0.18       |
| **GAN** | **0.41** | **0.14** | **0.26**  |

**Evaluated on size ≥ 0.01% (≈ top 550 stocks ≈ S&P 500)**:
| Model | Test SR | Test EV | Test XS-R² |
|-------|---------|---------|------------|
| LS    | -0.06   | 0.04    | 0.09       |
| EN    | 0.23    | 0.07    | 0.14       |
| FFN   | 0.24    | 0.09    | 0.26       |
| **GAN** | **0.26** | **0.18** | **0.32**  |

paper p.38–39:
> "an annual out-of-sample Sharpe ratio of 1.4 using only the 1,500 largest stocks. In contrast, the linear models collapse."

→ Monthly 0.41 × √12 ≈ 1.42 annualized — paper 본문과 일치.

### 13.10.2 Table V — Alternative GAN Models (Robustness)

paper Table V (정확한 수치):
| Model | Test SR | Test EV | Test XS-R² | 비고 |
|-------|---------|---------|------------|------|
| GAN 1 | 0.72    | 0.07    | 0.21       | best valid, alt 1 |
| GAN 2 | 0.77    | 0.07    | 0.22       | best valid, alt 2 |
| GAN 3 | 0.74    | 0.09    | 0.25       | best valid, alt 3 |
| GAN 4 | 0.77    | 0.07    | 0.22       | best valid, alt 4 |
| GAN Rolling | **0.88** | 0.08 | 0.24 | 240-month rolling window |
| GAN No Frict | 0.77 | 0.08 | 0.23 | trading friction 제외 |

paper 본문 (p.40):
> "the rolling window GAN SDF has a correlation of 70% with our benchmark SDF... a time-varying estimate of GAN does not lead to major improvements and fits a similar economic structure."

paper 본문 (Section III.H):
> "Our findings are robust to the time periods under consideration, small capitalization stocks, the choice of the tuning parameters, and limits to arbitrage. The SDF structure is surprisingly stable over time."

### 13.10.3 Robustness 요약
- 다른 hyperparameter 조합으로도 거의 같은 SDF (correlation > 80%, paper Section III.H).
- Rolling window — benchmark 와 70% correlation.
- Trading friction 제외 — benchmark 와 78% correlation.
- Large cap subset 에서도 GAN > 다른 모델.
- **결과 매우 robust** — different tuning 으로도 같은 economic model 발견.

paper 핵심 결론 (Section III.H):
> "Our findings are robust to small cap stocks, the choice of the tuning parameters, the time period under consideration and are not exploiting limits to arbitrage." (paper Section III.H opening, journal p.38) 
> 
> 그리고 Introduction p.4: "Our findings are robust to the time periods under consideration, small capitalization stocks, the choice of the tuning parameters, and limits to arbitrage. The SDF structure is surprisingly stable over time."

→ **결과 매우 robust**. Different tuning 으로도 같은 economic model 발견.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. Appendix B simulation 이 검증하는 가장 중요한 가설은?
2. Appendix C 의 통합 이론이 보여주는 것은?
3. Appendix I 의 robustness 결과가 의미하는 것은?

### 답변
1. **3 evaluation metrics 모두 필요**. FFN, Linear 같은 부분적 모델은 SR 만 높을 수 있다 — 하지만 EV, XS-R² 가 낮음. 시뮬에서 정확히 이 패턴 입증. 따라서 paper Table I 의 GAN 압도 (3 metrics 모두) 가 **structural advantage**.
2. **모든 기존 SDF model (FF, PCA, IPCA, KNS, RP-PCA) 이 본 논문 의 special case**. 본 논문 framework 의 일반성 보장. Linear (LS) 가 Kozak-Nagel-Santosh (2020) 의 mean-variance optimization 과 거의 동일 (paper footnote 22). 이 통합으로 본 논문이 단순히 새로운 ML approach 가 아닌 **conditional SDF 의 가장 일반적 framework** 임을 학계에 알림.
3. **Same economic model under different tuning**. 4가지 best GAN models 의 SDF 가 correlation > 80%. Rolling window 도 70%. Trading friction 제외 모델도 78%. 즉 본 논문의 결과는 **arbitrary hyperparameter choice 의 산물이 아닌, 데이터에 진짜 있는 economic structure**. ML 결과의 reproducibility 와 stability 입증.
