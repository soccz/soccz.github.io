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

## 13.9 Appendix H — Machine Learning Investment

paper p.74:
- ML 기반 portfolio 의 실제 운용 성과.
- Transaction cost 고려 시 SR 보정.

---

## 13.10 Appendix I — Implementation & Robustness

paper p.74–75:
- **Table A.IX**: Tuning parameters 의 best 4 GAN models (independent re-estimation).
- **Robustness**:
  - 다른 hyperparameter 조합으로도 거의 같은 SDF 학습 (correlation > 80%).
  - Rolling window estimation (240 month) — benchmark 와 70% correlation.
  - Trading friction 제외 — benchmark 와 78% correlation.

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
