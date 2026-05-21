# 03. Introduction — 4가지 도전과 본 논문의 답

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 자산가격결정의 **4 challenges** — 고차원성·함수형·시변·낮은 SNR
- 본 논문이 각 challenge 에 어떻게 답하는지 (GAN + LSTM + adversarial test asset)
- 본 논문이 60년 학계 흐름에서의 위치 (Hansen-Singleton 1982 → Fama-French → ML 시대)

---

> Introduction (journal p.1–6) — 자산가격결정의 4 challenges 와 본 논문이 어떻게 풀었는지.

## 3.1 첫 단락 — 자산가격결정의 fundamental question

> **원문 (p.1)**: "The fundamental question in asset pricing is to explain differences in average returns of assets. No-arbitrage pricing theory provides a clear answer - expected returns differ because assets have different exposure to the stochastic discount factor (SDF) or pricing kernel."

**풀이**:
- **Fundamental question**: 왜 자산마다 평균 수익률이 다른가?
- **No-arbitrage 답**: 자산이 SDF $M$ 에 다른 노출 (β) 을 가져서.
- 본 논문의 출발점: SDF 를 추정하면 모든 자산 가격결정 문제 해결.

---

## 3.2 4가지 도전 (Four Major Challenges)

paper p.1 본문:
> "There are four major challenges that the literature so far has struggled to overcome in a unified framework:"

### 도전 1: 고차원 정보
> "First, the SDF could by construction depend on all available information, which means that the SDF is a function of a potentially very large set of variables."

→ SDF 는 모든 가용 정보에 의존 가능 — 변수 수가 매우 많음 (firm chars + macro = 224+).

### 도전 2: 알 수 없는 함수형
> "Second, the functional form of the SDF is unknown and likely complex."

→ SDF 의 함수형 알 수 없음 + 복잡할 가능성.

### 도전 3: 복잡한 동적 구조
> "Third, the SDF can have a complex dynamic structure and the risk exposure for individual assets can vary over time depending on economic conditions and changes in asset-specific attributes."

→ SDF 동학 복잡 + 자산별 risk exposure 도 시변.

### 도전 4: 낮은 SNR
> "Fourth, the risk premium of individual stocks has a low signal-to-noise ratio, which complicates the estimation of an SDF that explains the expected returns of all stocks."

→ 개별 주식 risk premium 의 SNR 매우 낮음. 학습 어려움.

---

## 3.3 본 논문의 4가지 답

paper p.2 본문:
> "Our estimation approach combines no-arbitrage pricing and three neural network structures in a novel way. Each network is responsible for solving one of the three key questions outlined above."

| 도전 | 답 |
|------|-----|
| **고차원 정보** | Feedforward Network (FFN) — 224+ 변수의 비선형 함수 학습 |
| **복잡한 함수형** | Deep neural network 의 universal approximation |
| **복잡한 동학** | RNN with LSTM — macro 시계열에서 hidden state 추출 |
| **낮은 SNR** | **No-arbitrage condition 을 loss 에 통합** + adversarial test asset |

→ **No-arbitrage + 3가지 NN 구조** = 본 논문의 통합 framework.

---

## 3.4 본 논문의 3가지 방법론적 기여

paper p.2 본문 (Methodological contributions):

### 기여 1: Adversarial GMM
> "First, we introduce a non-parametric adversarial estimation approach to finance and show that it can be interpreted as a data-driven way to construct informative test assets."

- 무한히 많은 moment 후보 → adversarial 로 가장 정보적인 것 선택.
- Hansen-Jagannathan (1997) 의 minimax SDF 추정 idea 의 신경망 일반화.

### 기여 2: LSTM Macro States
> "Second, we introduce a novel way to use neural networks to extract economic conditions from complex time series. We are the first to propose LSTM networks to summarizes the dynamics of a large number of macroeconomic time series in a small number of economic states."

- 178 macro 시계열 → 4 hidden state.
- Short + long-term dependency 동시 학습 (business cycle 등).

### 기여 3: Risk Premium 신호 추출
> "Third, we propose a problem formulation that can extract the risk premium in spite of its low signal-to-noise ratio."

- 일반 ML: variance 설명 (second moment) 중심.
- 본 논문: no-arbitrage condition 으로 **risk premium (first moment)** 직접 학습.
- 무한 conditioning 으로 SNR 향상.

paper 본문:
> "When considering average returns the unpredictable component is diversified away over time and the predictable risk premium signal is strengthened."

---

## 3.5 5가지 empirical 발견 (Empirical findings)

paper p.3–4 본문 (Our empirical main findings are five-fold):

### 발견 1: Economic constraints help ML
> "First, economic constraints improve flexible machine learning models. ... off-the-shelf simple prediction approaches can perform worse than even linear no-arbitrage models."

→ **단순 prediction (FFN) 보다 linear no-arbitrage (EN) 가 더 잘**. 이론 제약이 결정적.

### 발견 2: Linear approximately works in isolation
> "Second, we confirm that non-linear and interaction effects matter. ... when considering firm-specific characteristics in isolation, the SDF depends approximately linearly on most characteristics."

→ **개별 특성은 거의 선형** 효과. 그러나 **interaction (특성 간 곱)** 에서 비선형 본질적.

### 발견 3: Test assets matter
> "Third, test assets matter. ... An asset pricing model estimated on the optimal test assets constructed by the adversarial network has a 20% higher Sharpe ratio than one calibrated on individual stock returns without characteristic managed portfolios."

→ adversarial test asset → SR 20% 향상.

### 발견 4: Macroeconomic states matter
> "Fourth, macroeconomic states matter. Macroeconomic time series data have a low dimensional 'factor' structure, which can be captured by four hidden state processes."

→ 4개 hidden state 가 business cycle 추적.

### 발견 5: Complementary to multi-factor models
> "Fifth, our conceptional framework is complementary to multi-factor models."

→ IPCA (Kelly-Pruitt-Su 2019) 와 결합 가능 (Section III.J).

---

## 3.6 본 논문의 실증 성과 (한 단락)

paper p.3 본문:
> "Our model has an annual out-of-sample Sharpe ratio of **2.6** compared to **1.7** for the linear special case of our model, **1.5** for the deep learning forecasting approach and **0.8** for the Fama-French five-factor model. At the same time we can explain **8% of the variation** of individual stock returns and explain **23% of the expected returns** of individual stocks, which is substantially higher than the other benchmark models. On standard test assets based on single- and double-sorted anomaly portfolios our asset pricing model reveals an unprecedented pricing performance. In fact, on all **46 anomaly sorted decile portfolios we achieve a cross-sectional R² higher than 90%**."

→ 4개 핵심 숫자:
1. **OOS SR 2.6** (annual, train+valid+test 합산)
2. **EV 8%** (시계열 R²)
3. **XS-R² 23%** (횡단면 mean R²)
4. **46개 anomaly decile 의 XS-R² > 90%** (압도적 pricing performance)

---

## 3.7 학계 위치 — Related Literature

paper p.4–5 본문 (Related Literature section).

| 논문 | 본 논문과의 관계 |
|------|------|
| **Gu, Kelly, Xiu (2020) "Empirical Asset Pricing via Machine Learning"** RFS | Benchmark — best FFN forecasting model. 본 논문이 no-arbitrage 추가하여 능가. |
| **Kelly, Pruitt, Su (2019) IPCA** | 선형 conditional factor model. 본 논문 Section III.J 에서 결합. |
| **Gu, Kelly, Xiu (2019) Autoencoder Asset Pricing Models** JoE | IPCA 의 비선형 일반화. 본 논문과 평행한 ML 접근. |
| **Kozak, Nagel, Santosh (2020) "Shrinking the Cross Section"** JFE | Mean-variance optimization + elastic net. 본 논문의 linear EN benchmark (5가지 차이 footnote 22). |
| **Lettau & Pelger (2020) RP-PCA** JoE | 본 논문 저자 (Pelger) 의 이전 작업. PCA 의 risk-premium 일반화. footnote 13, 22 에 언급. |
| **Hansen & Jagannathan (1997)** | Minimax SDF estimation 의 이론적 기반. 본 논문 adversarial 의 motivation. |
| **Hansen (1982) GMM** | Generalized Method of Moments 의 원조. paper Section I.B 의 framework. |
| **Bansal & Viswanathan (1993)** JoF | Neural network 으로 SDF 비모수 추정 (선구자). |
| **Hochreiter & Schmidhuber (1997) LSTM** Neural Comp. | LSTM 원조. 본 논문 RNN+LSTM 의 ML 기반. |
| **Goodfellow, Bengio, Courville (2016) Deep Learning** MIT Press | Deep learning textbook reference. |
| **Kingma & Ba (2014) Adam** | Adam optimizer 원조 (footnote 49). |
| **Srivastava et al. (2014) Dropout** | Dropout regularization 원조 (Section II.E). |
| **Arjovsky, Chintala, Bottou (2017) Wasserstein GAN** | Adversarial NN 의 발전 (paper references). |
| **Lewis & Syrgkanis (2018) Adversarial GMM** | Adversarial 의 GMM 응용 (paper references). |
| **Bryzgalova, Pelger, Zhu (2020) "Forest through the Trees"** | Pelger 공동저자. Cross-sections building with decision trees. footnote 22, Section III.I. |
| **Pelger (2020) "Understanding Systematic Risk"** JoF | Pelger 의 high-frequency factor model. |
| **Pelger & Xiong (2019) "Proximate Factors"** | Extreme portfolio 의 SR vs loading 차이 (footnote 26). |
| **Nagel & Singleton (2011)** | Conditional GMM 의 optimal moments. paper Section I.B 의 contrast. |
| **Sirignano, Sadhwani, Giesecke (2020)** JoF | Mortgage risk + neural network. Variable importance 측정법의 reference (Section III.F). |
| **Horel & Giesecke (2020)** | Neural network significance test. Variable importance reference. |
| **McCracken & Ng (2016) FRED-MD** | 본 논문의 124 macro 변수 출처. |
| **Welch & Goyal (2007)** | 본 논문의 8 추가 macro 예측 변수 출처. |
| **Ludvigson & Ng (2007)** | Macro factor analysis (PCA). 본 논문 LSTM 의 대조 (Section II.C). |
| **Cong, Tang, Wang, Zhang (2020) AlphaPortfolio** | Reinforcement learning portfolio (Section III.I). |
| **Avramov, Cheng, Metzker (2020)** | ML × economic restrictions. 본 논문이 데이터 공유 (footnote 4). |
| **Martin & Nagel (2020)** | Big data 시대 market efficiency. paper Section III.C 인용. |
| **Pesaran & Timmermann (1996)** | Time-varying risk premia 의 reference (footnote 33). |

---

## 3.8 다음 단계

다음 [04_sdf_framework.md](04_sdf_framework.md) — SDF 의 수학적 framework (Section I.A–B).

---

## 3.9 자산가격결정 60년 역사에서 본 논문의 위치

### 1960s-1990s — CAPM 과 single factor 시대

- **CAPM** (Sharpe-Lintner 1964): single factor (market).
- "모든 자산의 risk premium = market beta × market risk premium".
- 단순하지만 cross-section 의 많은 부분 설명 못함.

### 1990s-2010s — Multi-factor 시대

- **Fama-French 3 factor** (1992): market + size + value.
- **Fama-French 5 factor** (2015): + profitability + investment.
- **Carhart 4 factor**: + momentum.
- 점점 더 많은 factor 추가 → "Factor zoo".

### 2010s — Factor zoo 문제

- **Cochrane (2011)** 대통령 연설: "factor zoo" 라는 표현.
- 300+ 개의 anomaly 발견 — 어느 게 진짜 risk factor 인가?
- 통계적으로 의미 있는 factor 가 너무 많음.

### 2017-2020 — ML 도입

- **Gu, Kelly, Xiu (2020) RFS**: FFN 으로 expected return 예측. ML 의 자산가격결정 적용 본격 시작.
- **Kelly, Pruitt, Su (2019) IPCA**: conditional factor model.
- **Kozak, Nagel, Santosh (2020)**: "Shrinking the Cross Section" — elastic net.
- 그러나 모두 **prediction-based** — no-arbitrage 미사용.

### 2021 — 본 paper

- ML + no-arbitrage 통합.
- GAN-based test asset selection.
- LSTM 으로 macro dynamics 자동 추출.
- → "ML × 이론" 통합의 새 표준.

→ 본 paper 가 **factor zoo 시대의 종결자** + **ML × 이론 통합의 시조**.

---

## 3.10 본 paper 의 5 가지 메시지 — 학계 함의

### 메시지 1: 이론 > flexibility

- ML 의 flexibility 만으로는 부족.
- No-arbitrage 같은 이론적 제약 필수.
- → "ML 시대에 economic theory 가 더 중요" 의 선언.

### 메시지 2: Single char linear, interaction nonlinear

- 비선형의 본질이 **char 간 interaction** 에 있음.
- Future research direction.

### 메시지 3: Adversarial test asset 자동화

- Hand-picked test asset (예: 25 FF portfolio) 의 한계.
- Adversarial 로 가장 mispriced asset 자동 발견.
- → 더 robust + comprehensive.

### 메시지 4: Macro state 자동 추출

- LSTM 이 명시적 supervision 없이 business cycle 학습.
- 178 macro vars → 4 hidden state — 차원 축소 + dynamic 보존.

### 메시지 5: 통합 framework

- 본 paper 의 framework 가 기존 factor models, ML approaches 를 special case 로 포함.
- → unified asset pricing framework.

---

## 3.11 자기점검 (이 챕터)

### 핵심 5가지
1. **자산가격결정의 4가지 challenge 와 본 논문의 4가지 답?**
2. **본 논문이 ML 일반 prediction 모델 (FFN) 보다 좋은 이유는?**
3. **"Risk premium 의 low SNR" 문제를 본 논문이 어떻게 해결?**
4. **Factor zoo 문제와 본 paper 의 답?**
5. **paper 의 5 가지 학계 메시지 중 가장 중요한 것은?**

### 답변
1. (a) 고차원 → FFN, (b) 함수형 → deep NN, (c) 동적 구조 → LSTM, (d) 낮은 SNR → no-arbitrage loss + adversarial.
2. 일반 ML 은 **variance** (second moment) 설명 최대화. 자산가격결정의 본질은 **risk premium** (first moment) 예측. No-arbitrage condition $\mathbb{E}[M R^e g]=0$ 을 loss 로 두면 모델이 first moment 에 직접 학습. 결과: GAN OOS SR 0.75 vs FFN 0.44.
3. (a) **No-arbitrage condition** 을 loss 로 강제 — 평균 수익률에 직접 학습. (b) **Adversarial test assets** — 평균 (unpredictable component) 위에 conditioning 으로 signal 강화. paper: "When considering average returns the unpredictable component is diversified away over time and the predictable risk premium signal is strengthened."
4. **Factor zoo** = 300+ 의 anomaly factor 발견, 어느 게 진짜인지 불분명. 본 paper 의 답: GAN 의 SDF factor 가 FF5 와 거의 무관 (max correlation 17%) 인 **새 dimension** — 그러면서도 OOS SR 0.75 로 최고 성능. 따라서 GAN factor 가 진짜 risk premium 잡고 있고, 기존 anomaly 들은 이 underlying factor 의 noisy 한 측면. → **factor zoo 의 한 가지 해결**.
5. **"이론 > flexibility"** — ML 의 flexibility 만으로는 부족, no-arbitrage 같은 이론적 제약 필수. 이게 paper 의 핵심 메시지. 다른 4개도 중요하지만 이게 paradigm shift 의 본질. EN > FFN 의 발견이 직접 증명 (Table I).
