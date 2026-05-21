# 13. Appendix — Section A-I

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Appendix 의 핵심 — Simulation (Section B), 통합 이론 (Section C), Robustness (Section I)
- 13.10 Implementation & Robustness 의 의미
- 본 논문이 다른 SDF model 의 superset 임을 증명

---

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

### 📖 처음 보는 사람을 위한 — Table A.I 읽는 법

**이 표가 보여주는 것**: **시뮬레이션** — 알려진 진짜 SDF 로 데이터 생성 → 4 모델이 그 SDF 회복 가능한가? **3 metric 모두 필요함** 의 증명.

**일상 비유 (시험)**:
- "Population" = 정답지 (진짜 SDF, simulator 가 알고 있음).
- 4 모델 = 4 응시자.
- 정답에 가깝게 푸는 모델 (= Population 수치와 일치) 이 승.

**표 구조 (2 sub-table)**:
- **Setup 1**: Two characteristics + multiplicative interaction (no macro).
  - True $\beta = C^{(1)} \cdot C^{(2)}$ (곱).
- **Setup 2**: One char + macro state (cyclical).
  - True $\beta = C \cdot b(h_t)$, $h_t = \sin(\pi t/24)$.
- **각 sub-table**: 4 모델 × 3 metric × 3 sample.

**어디부터 보면 되나**:
1. **Population row** 의 수치 = 정답.
2. **GAN row** 가 Population 에 가까움 → GAN 이 진짜 SDF 회복.
3. **FFN row** 의 SR 높지만 XS-R² 음수 — 가짜 정보 학습.
4. **LS row** 거의 0 — interaction 못 잡음.

**핵심 발견**: 3 metric 모두 봐야 진짜 모델 vs 가짜 모델 구별.

---

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

### 📖 처음 보는 사람을 위한 — Table A.III/A.IV 읽는 법

**Table A.III 의 의미**:
- 본문 **Table III** = **single-sorted decile portfolios** (1 char 으로 10 분위 정렬)
- **Table A.III** = Table III 의 **전체 46 characteristics 확장 version**
- → "본문이 보여준 패턴 (GAN > FFN ≈ EN > LS) 이 **다른 char 으로 정렬해도 유지되나?**" 의 robust check

**Table A.IV 의 의미** (★ 더 어려운 시험):
- **Double-sort** = 2 char 동시 사용 (e.g. ST_REV × momentum)
- 5×5 grid → 25 portfolios → 한 표
- single-sort 보다 **훨씬 변별력 있는 시험** (interaction 검증)

**🔣 4-단 기호 풀이 (single-sort vs double-sort)**:

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| **Single-sort** | 1 char 으로 10 분위 정렬 | "수학점수만으로 학생 줄세우기" | 다른 정보 무시 |
| **Double-sort** | 2 char (5×5 = 25 grid) | "수학+영어 같이 봐서 5×5 칸 분류" | interaction 검증, 차이 더 큼 |
| **Conditional sort** | char1 으로 큰 분류 후 char2 로 세부 분류 | "수학 등급별로 영어 잘 하는 학생 vs 못하는" | 비-symmetric |
| **GAN 의 우위** | double-sort 에서 더 큼 | "interaction 잡아내는 능력" | **GAN > FFN 격차 ↑** in double-sort |

**🌱**: Table III (single-sort) 에서 GAN 의 우위 = X%, Table A.IV (double-sort) 에서 X+α%. **α = interaction 효과** — GAN 의 진짜 차별점. paper p.72: GAN 이 double-sort 에서 **압도적**.

---

## 13.7 Appendix F — Variable Importance

paper p.73 (Figs A.4-A.8).

추가 figure:
- **Fig A.4**: Macro variable importance for GAN (178 macro 중).
- **Fig A.5, A.6**: Variable importance for EN, LS.
- **Fig A.7**: Conditioning $g$ 의 variable importance.
- **Fig A.8**: GAN No Frict (trading friction 제외) 의 importance.

### 📖 처음 보는 사람을 위한 — Appendix F 의 5 figures 읽는 법

**왜 5 figures?** Main text Fig 11 (GAN char importance), Fig 12 (FFN char importance) 의 **자매 figures** — 본문에 다 못 넣은 보충 결과를 Appendix 에 모아둠.

**5 figures 의 의미** (한 문장씩):

| Fig | 무엇을 보여줌 | 핵심 메시지 |
|-----|--------------|------------|
| **Fig A.4** | GAN 의 **178 macro 변수** 중 어떤 것이 중요한가 | top 5 = NBER 경기변동 + inflation + credit spread (LSTM 이 자동 선택) |
| **Fig A.5** | **EN (linear)** 의 46 char importance | 단순한 패턴 — 굵직한 char 몇개만 강조 |
| **Fig A.6** | **LS (no regularization)** 의 46 char importance | 모든 char 비슷 — 정규화 없이는 변별력 없음 |
| **Fig A.7** | Conditioning network $g$ (adversarial test asset) 의 char importance | $g$ 가 SDF 와 **다른 char** 골라냄 → 진짜 "최악 test" |
| **Fig A.8** | **GAN No Frict** (trading friction 5 char 제외) 의 importance | friction 제외해도 GAN 의 ranking 유사 → robust |

**🌱**: "**선생님이 학생 평가할 때** 어느 항목 (시험점수, 출석률, 과제 등) 을 가장 중요하게 봤는지 막대그래프로 그린 것 — 학생 = 회사, 항목 = char. GAN 은 SDF 만 보는 게 아니라 'SDF 가 무엇을 보는지' 자체를 시각화."

**Fig A.4 와 본문 Fig 11 의 차이**:
- Fig 11 (본문) = **firm-specific char** (46 개) 의 importance.
- Fig A.4 (Appendix) = **macro variable** (178 개) 의 importance.
- 두 figure 가 합쳐져야 "GAN 의 전체 input importance map" 완성.

---

## 13.8 Appendix G — SDF Structure

paper p.73–74 (Fig 14 + functional form).

핵심 발견 (paper 본문 인용):
> "Surprisingly, individual characteristics have an almost linear effect on the pricing kernel and the risk loadings, i.e. non-linearities matter less than expected for individual characteristics. Second, the better performance of GAN is explained by non-linear interaction effects."

**Fig 14**: $\omega$ as function of two chars 의 contour/surface plot.
- ST_REV × r12_2 (momentum × short-term reversal)
- LME × BEME (size × book-to-market)
- 각 plot 이 multiplicative interaction pattern 보임.

### 📖 처음 보는 사람을 위한 — Appendix G + Fig A.9 읽는 법

**Appendix G 의 핵심 figures** (paper p.74-75):
- **Fig A.9**: **Univariate** SDF weight $\omega$ vs 각 char (개별 4 char × 1D)
- Fig 14/15 (본문 11_var_importance_macro.md 참조): **bivariate, trivariate** SDF surface

**Fig A.9 의 의미**:

| 화면 요소 | 의미 | 어떻게 읽나 |
|----------|------|------------|
| **X축** | char 값 (quantile, e.g. [-0.5, 0.5]) | "small → large char" |
| **Y축** | SDF weight $\omega$ | "이 char 이 SDF 에 얼마나 기여?" |
| **각 panel** | 1 char (e.g. ST_REV, r12_2, LME, BEME) | total 4 panels |
| **GAN line vs FFN line** | nonlinear 의 진짜 정도 비교 | 거의 겹침 = "individual 효과는 linear" |
| **median 근처 굴곡** | nonlinearity 의 강도 | ST_REV 만 약간 굴곡 |

**🌱**: "**한 학생의 한 항목만** (예: 수학점수) 보면 거의 직선 — 점수↑ → 등수↑. 그런데 **수학+영어 조합** 으로 보면 (Fig 14/15) 갑자기 비선형 — '수학 잘하면서 영어도 잘하는 학생' 이 특별. paper 의 발견 = '진짜 정보는 항목 조합 (interaction) 에 있다'."

**핵심 메시지** (paper p.74):
> "It is striking how close the functional form of the SDF for GAN and FFN is to a linear function. This explains why linear models are actually so successful in explaining single-sorted characteristics."

→ **"Linear 모델이 single-sorted 에서 잘 하는 이유 = 개별 char 의 효과가 진짜 linear 라서"**. 비선형은 오직 **interaction** 에서.

---

## 13.9 Appendix H — Machine Learning Investment (paper Section III.I 추가 detail)

paper p.41–42 Section III.I 본문 + Appendix H:

### 13.9.1 GAN SDF 의 risk-return trade-off
paper Table A.VI: monthly Sharpe ratios, max 1-month loss (정규화), max drawdown — GAN 이 SR 최고, drawdown 다른 model 과 comparable.

### 13.9.2 Fig 16 — Cumulative SDF Returns (paper p.42)

### 📖 처음 보는 사람을 위한 — Figure 16 읽는 법

**이 그림이 보여주는 것**: 4 SDF 모델 (GAN, FFN, EN, LS) 의 **50년 누적 수익률** — $1 투자가 50년 후 얼마가 되나.

**일상 비유 (4 회사 주식의 50년)**:
- GAN, FFN, EN, LS = 4 회사.
- Y축 = $1 → 50년 후 가치 (normalized).
- 가장 가파르게 올라간 회사 = best.

**그림 구조**:
- **X축**: 1968-2018 (50년).
- **Y축**: Cumulative excess return (vol-normalized, 0 ~ 600).
- **4 lines (색)**:
  - **GAN (파랑)**: 가장 가파른 상승 → ~600.
  - **EN (녹색)**: 2위 → ~300.
  - **LS (빨강)**: 3위 → ~200.
  - **FFN (주황)**: 4위 → ~100.

**어디부터 보면 되나**:
1. **GAN 라인 (파랑)** 이 다른 모든 라인보다 위 — 모든 시점에서 best.
2. 라인의 **smoothness** — GAN 이 가장 smooth (적은 drawdown).
3. 1988 + 2008 crisis 시점에서도 GAN 의 drawdown 작음.

**핵심 발견**: GAN 의 누적 수익 = 다른 모델의 **2-6 배** + 변동성 작음 → risk-adjusted return 압도.

paper p.41 Fig 16: GAN, FFN, EN, LS 의 cumulative excess returns (vol-normalized). GAN 이 최대 + variance 최소 + drawdown 적음.

### 13.9.3 Trading Friction Cutoffs — Figure 17 (paper p.43)

### 📖 처음 보는 사람을 위한 — Figure 17 읽는 법

**이 그림이 보여주는 것**: "거래비용 큰 주식들을 제외하면" SR 이 어떻게 변하나. **거래비용 robust** 검증.

**일상 비유 (실전 투자)**:
- 작은 / 비유동적 주식 = "거래비용 큰 주식" (실제 매매 어려움).
- GAN 모델이 그런 주식만 이용해서 SR 높은 거 아닌가? 의심.
- 그런 주식을 **점진적으로 제외** (X축 cutoff) 하면 SR 떨어지는가?

**그림 구조 — 3 sub-panel**:
- **(a) Size cutoff**: X축 = LME (size) quantile cutoff (0.0 = all stocks, 0.6 = top 40% 큰 stocks 만).
- **(b) Spread cutoff**: bid-ask spread cutoff (0.6 = spread 작은 top 40% 만).
- **(c) Turnover cutoff**: turnover cutoff.

**각 panel 의 축**:
- X축: cutoff quantile (0.0 ~ 0.6).
- Y축: monthly SR (0.0 ~ 0.8).
- 4 색 lines: GAN (파랑), FFN (주황), LS (녹색), EN (빨강).

**어디부터 보면 되나**:
1. **GAN (파랑)** 이 모든 cutoff 에서 다른 모델 위 — **robust**.
2. GAN SR cutoff 0.4 (40% 제외) 에서도 여전히 높음.
3. 다른 모델들은 cutoff 늘리면 빠르게 감소.

**핵심 발견** (paper p.42):
- GAN without 40% smallest stocks: SR **1.73** (연간).
- GAN without 40% highest bid-ask spreads: SR **2.07** (연간).
- GAN without 40% lowest turnover: SR **1.87** (연간).
- 모두 strong → GAN 의 우위는 illiquid stocks 만의 산물 아님.

---

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

### 📖 처음 보는 사람을 위한 — Table VI 읽는 법

**이 표가 보여주는 것**: GAN framework 와 **IPCA (Kelly-Pruitt-Su 2019) 의 multi-factor 모델 결합** — IPCA 가 K 개 factor 를 만들면, GAN 이 그 factor 의 conditional mean-variance optimal combination 추정.

**일상 비유 (재료 + 셰프)**:
- IPCA = "재료 K 개 만드는 사람" (multi-factor 추출).
- GAN = "재료 조합하는 셰프" (optimal weighting).
- 둘 결합 = 더 나은 SDF.

**표 구조**:
- **행 (6 rows)**: 6 가지 IPCA-기반 SDF estimator.
  - **IPCA GAN**: GAN 이 IPCA factor 의 weight + loading 추정 (본 paper 의 best 결합).
  - **IPCA Max SR**: IPCA factor 의 unconditional mean-variance combo (SR 최대화).
  - **IPCA Max EV**: explained variation 최대화.
  - **IPCA Max XS-R²**: cross-sectional R² 최대화.
  - **IPCA Multifactor**: 기존 multi-factor 형식.
  - **IPCA Max SR FFN Beta**: SR + FFN loadings.
- **열 (8 columns)**: K = 3 ~ 10 (IPCA factor 개수).
- **각 cell**: SR / EV / XS-R² 3 행씩.

**어디부터 보면 되나**:
1. **IPCA Max SR** row: K=10 에서 SR **0.94** (가장 높음) — 그러나 **XS-R² = -0.04 (음수!)** — pricing error 못 잡음.
2. **IPCA GAN** row: SR 0.81 (조금 낮음) + **XS-R² = 0.21 (양수, 5배 향상)** — pricing 정확.
3. → **trade-off**: SR vs XS-R² — IPCA GAN 이 가장 balanced.

**핵심 발견**:
- IPCA + GAN 결합이 **3 metric 모두 balanced** — 본 paper framework 의 multi-factor 확장 가능성.
- paper 본문 (p.44): "GAN framework can lead to an even better asset pricing model".

---

### 🔣 4-단 기호 풀이 (Table VI columns)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| **K** | IPCA factor 개수 | "재료 K 개" | 3 ~ 10 시도 |
| $f^{IPCA}_{t+1}$ | IPCA factor return | "K 개 factor 의 수익률" | latent factor |
| $\omega^f$ | factor weight | "factor 별 weight" | combination |
| **$\omega^{I-GAN}$** | GAN 의 IPCA factor weight | "GAN 셰프가 IPCA 재료 결합" | NN 학습 |
| **$\omega^{I-SR}$** | unconditional max SR | "단순 mean-variance 결합" | linear |
| **$\omega^{I-EV}$** | max EV combination | "변동 설명력 최대화" | trade-off |
| **$\omega^{I-XS}$** | max XS-R² combination | "평균 설명력 최대화" | trade-off |

**🌱**: "**같은 IPCA factor 를 다른 objective 로 결합** — GAN 이 3 metric 모두 balanced 결합".

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

### 📖 처음 보는 사람을 위한 — Table IV 읽는 법

**이 표가 보여주는 것**: GAN 의 결과가 **큰 주식 (large cap) 에서도** 유효한가? Small cap (penny stocks) 영향만이 아닌가?

**일상 비유 (챔피언 시험)**:
- "모든 사람 (small + big stocks) 이겼다" 만으로는 부족.
- "고수 (large cap stocks) 도 이겼는지" 확인 필요.
- **본 paper 결과**: large cap 만 봐도 GAN > 다른 모델 → 모델이 진짜 강력.

**표 구조 (3 sub-table)**:
- Top: All stocks 학습, **size ≥ 0.001%** (top 1,500 stocks) 평가.
- Middle: All stocks 학습, **size ≥ 0.01%** (top 550 stocks, S&P 500 급) 평가.
- Bottom: **size ≥ 0.001% 만 학습 + 평가**.

**어디부터 보면 되나**:
1. Top 의 GAN Test SR **0.41** → 연간 1.42 (paper "1.4 using only the 1,500 largest stocks").
2. **LS SR = -0.06** (음수!) — linear 모델 large cap 에서 collapse.
3. GAN XS-R²: large 에서 더 큼 (0.32 > 0.26).

**핵심 발견**: GAN 의 우위는 small cap 만의 산물이 아님 — large cap 에서도 유지.

---

### 🔣 4-단 기호 풀이 (Table IV 의 size cutoff)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| **size ≥ 0.001%** | top 1,500 stocks (시총 비례) | "회사 시총이 전체의 0.001% 이상" | mid + large cap |
| **size ≥ 0.01%** | top 550 stocks (S&P 500 급) | "전체 시총의 0.01% 이상" | large cap only |
| **Estimated on all** | 모든 주식 학습, subset 평가 | "전 학생으로 학습, 큰 학생만 시험" | original GAN |
| **Estimated on subset** | subset 학습 + 평가 | "큰 학생만으로 학습+시험" | 별도 모델 |

**🌱**: "**모델은 모든 주식 학습 + 평가는 large cap 만** → small cap 효과 제외 후 robust check".

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

### 📖 처음 보는 사람을 위한 — Table V 읽는 법

**이 표가 보여주는 것**: GAN 의 결과가 **hyperparameter 선택에 robust** 한가? 다른 setup 으로 학습해도 비슷한 성능 나오는가?

**일상 비유 (요리 robustness)**:
- 같은 요리 (GAN) 를 4 명의 다른 셰프 (GAN 1, 2, 3, 4) 가 약간 다른 setup 으로 만든다.
- 모두 같은 맛이 나면 → robust recipe.
- + Rolling window (매년 재학습) 도 비슷 → time-stable.
- + No Frictions (특정 chars 제외) 도 비슷 → 다른 chars 의존 안 함.

**표 구조**:
- **행 (6 rows)**: 4 GAN variants (best valid 선택) + Rolling + No Frict.
- **열**: SR / EV / XS-R² × 3 sample.

**어디부터 보면 되나**:
1. **GAN 1, 2, 3, 4 의 Test SR**: 0.72, 0.77, 0.74, 0.77 — 모두 **0.7-0.8 range, 매우 close**.
2. **GAN Rolling Test SR 0.88** — 약간 더 높음 (time-varying 효과).
3. **GAN No Frict Test SR 0.77** — friction chars 빼도 비슷.

**핵심 발견**:
- 4 best GAN 의 SDF correlation > 80% → **다른 hyperparameter 로도 같은 economic model 발견**.
- Rolling window → benchmark 와 70% correlation.
- **결과가 매우 robust** = 진짜 economic structure 잡음.

---

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
