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

### A.B Recurrent Neural Network (LSTM)
paper p.49–54 — LSTM cells 의 정확한 수식:
$$
i_t = \sigma(W_i [h_{t-1}, x_t] + b_i) \quad \text{(input gate)}
$$
$$
f_t = \sigma(W_f [h_{t-1}, x_t] + b_f) \quad \text{(forget gate)}
$$
$$
o_t = \sigma(W_o [h_{t-1}, x_t] + b_o) \quad \text{(output gate)}
$$
$$
\tilde C_t = \tanh(W_C [h_{t-1}, x_t] + b_C) \quad \text{(candidate cell state)}
$$
$$
C_t = f_t \odot C_{t-1} + i_t \odot \tilde C_t \quad \text{(cell state)}
$$
$$
h_t = o_t \odot \tanh(C_t) \quad \text{(hidden state)}
$$

→ **3 gates (input, forget, output) + cell state + hidden state**.

### A.C Implementation
paper p.54–55 — 구체적 코드 detail, batch size, learning rate schedule, validation 절차.

---

## 13.3 Appendix B — Simulation Example

paper p.55–58 본문 + Table B.1.

### B.1 Setup
- N = 100 stocks, T = 200 months simulated.
- True SDF: $M_{t+1} = 1 - \omega^\top R^e$ with **nonlinear $\omega = f(I, c)$**.
- 2 macroeconomic states 동학.

### B.2 핵심 결과 (Table from paper)
paper Table B.1 (시뮬 결과 일부):
| Model | SR | EV | XS-R² |
|-------|-----|-----|-------|
| GAN | 높음 | 높음 | 높음 |
| FFN | 높음 (extreme portfolio loading) | 중간 | **낮음** |
| Linear | 중간 | **낮음** | 낮음 |
| No macro | **낮음** | 중간 | 중간 |

paper 본문:
> "Appendix B includes a simulation that illustrates that all three evaluation metrics (SR, EV and XS-R²) are necessary to assess the quality of an SDF."

**메시지**:
- FFN: SR 만 높을 수 있다 — XS-R² 낮음.
- Linear: SR 높지만 EV 낮음 — interaction 못 잡음.
- No macro: SR 최저 — business cycle 손실.
- **GAN: 세 지표 모두 좋음**.

→ paper Table I 의 실증 결과가 우연이 아닌 **구조적 차이**.

---

## 13.4 Appendix C — Conditional SDF Models 의 통합

paper p.59–66 본문.

### C.A Characteristic Projection & Unconditional Models
- 모든 unconditional model 은 **characteristic managed portfolios** 의 mean-variance optimization 으로 환원 가능.
- Fama-French, PCA, RP-PCA 등.

### C.B Inversion of Unconditional Models
- Unconditional model → SDF representation.

### C.C Unconditional Factor Models
- PCA, RP-PCA 의 정확한 SDF 형식.

### C.D Conditional Factor Models
- KPS / IPCA 의 conditional 일반화.
- Linear conditioning: $\omega_{t,i} = \theta^\top I_{t,i}$.

### C.E Adversarial Estimation & MVE
- Hansen-Jagannathan (1997) 의 minimax 와 본 논문의 adversarial 의 연결.
- Mean-Variance Optimization 의 dual.

paper 핵심 메시지:
> "Appendix C provides a detailed overview of the various models for conditional SDFs and their relationship to our framework."

→ **모든 기존 SDF 모델 (Fama-French, PCA, IPCA, KNS, RP-PCA)** 이 본 논문 framework 의 special case 로 표현 가능.

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
> "Our results are robust to the time periods under consideration, small capitalization stocks, the choice of the tuning parameters, and limits to arbitrage. **The SDF structure is surprisingly stable over time.**"

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
