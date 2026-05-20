# 16. 용어집·표기법·References (비유 포함)

## 📌 이 챕터 활용법

읽으며 모르는 용어 마주치면 이 챕터에서 찾기. 4 카테고리:
- **확률·통계 용어** (quantile, CDF, GMM, ELBO, KL 등)
- **시계열 용어** (lookback, horizon, drift, divergence 등)
- **ML 용어** (Transformer, Attention, VAE, encoder 등)
- **수식 기호 사전** — 표 형식으로 한눈에

각 entry 에 **일상 비유** 추가 — 영어·수식 못 읽어도 따라올 수 있게.

---

본 paper 에 등장하는 모든 약어, 기호, 수식, references 의 사전.

각 entry 에 **비유** 추가 — 영어를 못해도 한국어 + 비유로 이해 가능.

---

## 16.1 핵심 약어 (한국어 + 일상 비유 포함)

각 entry 에 🌱 일상 비유 column 추가 — 영어·수식 못 읽어도 따라올 수 있게.

| 약어 | 영어 풀이 | 한국어 의미 | 🌱 일상 비유 |
|------|----------|-----------|------|
| **VAE** | Variational AutoEncoder | 변분 자동인코더 | "사진 압축기 + 확률 분포로 잠재 vector 학습" |
| **GMM** | Gaussian Mixture Model | 가우시안 혼합 모델 | "K 개의 종 모양 (Gaussian) 가중합 = multi-modal 분포 표현" |
| **KL** | Kullback-Leibler divergence | KL 발산 | "두 분포 사이의 거리 (0 일 때 동일, 클수록 다름)" |
| **ELBO** | Evidence Lower BOund | 증거 하한 | "log p(D) 의 lower bound, maximize 하면 KL 자동 minimize" |
| **FFN** | Feed-Forward Network | 순전파 신경망 | "Transformer block 의 후반 비선형 변환 (2-layer perceptron)" |
| **IBP** | Indian Buffet Process | 인도식 뷔페 과정 | "무한 음식 중 일부만 선택 — nonparametric Bayesian prior" |
| **EM** | Expectation-Maximization | 기대-최대화 | "GMM 학습 표준 알고리즘 — E-step (소프트 할당) + M-step (parameter 갱신)" |
| **PICP** | Prediction Interval Coverage Probability | 예측 구간 포함 확률 | "실제값이 신뢰구간 안에 들어갈 확률" |
| **PINAW** | PI Normalized Averaged Width | 정규화 평균 폭 | "예측 신뢰구간의 평균 폭 (좁을수록 좋음)" |
| **cpaw** | Coverage Probability × Normalized Width | 본 paper 의 새 metric | "PICP + PINAW 의 결합 = 정확도 + 좁음 동시 평가" |
| **q-risk** | quantile risk | 분위수 위험 | "quantile 별 pinball loss / mean — percentage 형식" |
| **RIF** | Re-centered Influence Function | 재중심 영향 함수 | "Conformalized QR 에서 사용" |
| **TFT** | Temporal Fusion Transformer | 시간적 융합 트랜스포머 | "Lim 2019 — recurrent + attention + quantile output" |
| **MQRNN** | Multi-horizon Quantile RNN | 다중 horizon 분위수 RNN | "Wen 2017 — RNN 으로 여러 quantile 동시 출력" |
| **EBM** | Energy-Based Model | 에너지 기반 모델 | "TimeGrad 의 분포 학습 방법" |
| **STL** | Seasonal-Trend decomposition by Loess | LOESS 기반 계절-추세 분해 | "Cleveland 1990 — 분해의 고전" |
| **HMM** | Hidden Markov Model | 은닉 마르코프 모델 | "P-TSE 등에서 regime 표현" |
| **SOTA** | State-of-the-art | 최신 최고 성능 | "현재 가장 좋은 결과" |
| **DNN** | Deep Neural Network | 심층 신경망 | "다층 퍼셉트론" |
| **SGD** | Stochastic Gradient Descent | 확률적 경사 하강법 | "deep learning 표준 학습 알고리즘" |

---

## 16.2 표기법 — 시계열 변수 (비유 포함)

### 시계열 데이터

| 기호 | 영어 의미 | 한국어 + 비유 |
|------|----------|-------------|
| $\chi$ | input time series | "원본 시계열 (예: 1시간 단위 전력 수요 1년치)" |
| $\chi^q$ | $q$-th quantile drift (Eq 4) | "$q$ 분위수의 매끄러운 trend (sliding window quantile)" |
| $\chi^Q = \{\chi^q\}_{q \in Q}$ | set of all quantile drifts | "5개 quantile drift 의 집합 (= 5개 envelope 선)" |
| $\chi^d = \chi - \chi^{0.5}$ | divergence pattern | "원본에서 median 을 뺀 잔차 (= median 으로부터 편차)" |
| $\chi^e_{out}$ | Encoder output | "단일 입력의 Transformer encoder 출력" |
| $\chi^Q_{eout}$ | encoder output set for all $\chi^q$ | "5개 quantile drift 의 encoder 출력 set (fusion 의 K, V)" |
| $\chi^d_{out}$ | VAE output for divergence | "divergence 의 VAE 출력 (distribution-enriched, fusion 의 Q)" |
| $X_t$ | input variables at time $t$ | "시점 $t$ 의 입력 변수들 (lookback window)" |
| $y_t$ | target at time $t$ | "시점 $t$ 의 예측 대상" |
| $\hat{y}$ | predicted value | "모델 출력 (5 quantile prediction)" |

### Quantile Regression

| 기호 | 영어 의미 | 한국어 + 비유 |
|------|----------|-------------|
| $\tau, q$ | quantile level (0~1) | "어느 분위수인가 (예: 0.9 = 상위 10% 경계)" |
| $Q$ | quantile set | "{0.5, 0.6, 0.7, 0.8, 0.9} — 본 paper 의 5개 quantile" |
| $\beta_\tau$ | $\tau$-quantile regression coefficient | "linear quantile regression 의 weight (DNN 으로 대체 가능)" |
| $\rho_\tau(u)$ | pinball loss | "비대칭 V-shape loss — quantile 학습용" |
| $Q_\tau(y_t | X_t)$ | conditional $\tau$-quantile | "$X_t$ 주어졌을 때 $y_t$ 의 $\tau$ quantile" |

### GMM + VAE

| 기호 | 영어 의미 | 한국어 + 비유 |
|------|----------|-------------|
| $K$ | number of Gaussian components | "몇 개의 봉우리로 분해 (= 학생 그룹 수, 권장 8)" |
| $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$ | GMM components | "K 개 Gaussian 의 (평균, 공분산) — local 분포 정보" |
| $\hat{D}$ | global mixture distribution | "$\sum \pi_k D_k$ — VAE 가 추정하는 global 분포" |
| $\pi_k$ | weight of component $k$ | "$k$ 번째 봉우리의 비중 ($\sum \pi_k = 1$)" |
| $c_t \in \{0,1\}^K$ | allocation vector (binary) | "시점 $t$ 가 어느 component 에 속하는지 (이진 mask)" |
| $b_t$ | contribution values | "시점 $t$ 가 component 에 얼마나 기여 (0~1)" |
| $\lambda_t$ | Bernoulli parameter | "Beta 분포에서 sample 된 활성화 확률" |
| $z_t$ | latent variable for decoder | "VAE decoder 의 입력 latent" |
| $\phi$ | variational encoder parameters | "VAE 의 encoder weights" |
| $\theta$ | decoder parameters | "VAE 의 decoder weights" |
| $\nu_k, \zeta_k$ | Gaussian prior parameters for $b_t$ | "$b_t$ 의 prior 평균·분산" |
| $\varsigma_k, \kappa_k$ | Beta prior parameters for $\lambda_t$ | "$\lambda_t$ 의 prior 형태 parameter" |

### Transformer Fusion

| 기호 | 영어 의미 | 한국어 + 비유 |
|------|----------|-------------|
| $W_a$ | divergence alignment projection | "두 path 의 차원을 맞추는 linear (Eq 16)" |
| $W_Q, W_K, W_V$ | Q/K/V projection matrices | "cross-attention 의 표준 3 projection" |
| $W_{output}$ | multi-head combination projection | "multi-head 결합 후 projection" |
| $W$ | final prediction head | "linear (Fusion → quantile predictions)" |

### Metric

| 기호 | 영어 의미 | 한국어 + 비유 |
|------|----------|-------------|
| $\Omega$ | training data domain | "training set 의 모든 sample" |
| $\hat{\Omega}$ | test data domain | "test set 의 모든 sample" |
| $M$ | training samples count | "train set 크기" |
| $\tau_{max}$ | forecasting horizon | "예측할 미래 시점 수 (예: 96)" |
| PICP | $\frac{1}{n} \sum \mathbb{I}(y \in [\hat{q}_l, \hat{q}_u])$ | "신뢰구간 안에 들 확률 (클수록 좋음)" |
| PINAW | $\frac{1}{n} \sum |\hat{q}_u - \hat{q}_l|$ | "신뢰구간의 평균 폭 (작을수록 좋음)" |
| $\mu$ (in cpaw) | quantile 차이 | "예: 0.9 - 0.1 = 0.8" |
| $\gamma$ (in cpaw) | indicator function | "PICP < $\mu$ 면 1, 아니면 0" |

---

## 16.3 핵심 수식 — 21개 (전체 정리)

### Eq 1 — Quantile 정의

$$Q(p) = \inf\{x : P(X \leq x_p) \geq p\}$$

**비유**: "줄세웠을 때 $p$ 위치 사람의 점수".

### Eq 2 — Quantile Regression

$$Q_\tau(y_t | X_t) = X_t \beta_\tau$$

**비유**: "입력 $X_t$ 주어졌을 때 출력 $y_t$ 의 $\tau$-quantile 추정".

### Eq 3 — Optimization

$$\min_{\beta_\tau} \sum_{t=1}^{T} \rho_\tau(y_t - X_t \beta_\tau)$$

**비유**: "pinball loss 의 합을 최소화 = quantile 학습".

### Eq 4 — Drift-Divergence Decomposition (★)

$$\chi^q = \text{QuantileFilt}(\text{Padding}(\chi), q), \quad \chi^d = \chi - \chi^{0.5}$$

**비유**: "이동 평균의 일반화 (이동 분위수) + median 으로부터의 편차".

### Eq 5 — Gaussian PDF

$$f(x | \mu, \Sigma) = \frac{1}{(2\pi)^{d/2} |\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)\right)$$

**비유**: "교과서의 다변량 정규분포 PDF — 종 모양".

### Eq 6 — Likelihood

$$L(\Theta | \chi^d) = \prod_{i=1}^{N} P(x_i; \Theta)$$

**비유**: "데이터를 관측할 확률 — maximize 가 GMM 학습 목적".

### Eq 7 — GMM (GauDe) (★)

$$D = \text{GauDe}(\chi^d)$$

**비유**: "EM 알고리즘으로 K Gaussian 분해 → 평균·공분산 세트 반환".

### Eq 8 — Global Mixture (★)

$$\hat{D} = \sum_{k=1}^{K} \pi_k D_k$$

**비유**: "K 봉우리의 가중합 = global distribution".

### Eq 9 — Variational Sampling

$$b_t \sim \mathcal{N}(\nu_k, \zeta_k), \quad \lambda_t \sim \text{Beta}(\varsigma_k, \kappa_k), \quad c_t \sim \text{Bernoulli}\!\left(\prod_{k=1}^{K} \lambda_{tk}\right)$$

**비유**: "Indian Buffet Process 의 stick-breaking — 막대를 부러뜨려 component 확률 결정".

### Eq 10 — Component Weight

$$\pi_k = \frac{\exp(\frac{1}{K} S_k)}{Z}, \quad S_k = \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}$$

**비유**: "동아리들의 '인기 점수' 를 softmax 정규화 → 비중".

### Eq 11 — Normalization

$$Z = \sum_{k=1}^{K} \exp\!\left(\frac{1}{K} \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}\right)$$

**비유**: "softmax 의 분모 (합 = 1 보장)".

### Eq 12 — KL Minimization

$$\phi^*, \theta^* = \arg\min_{\theta, \phi} D_{KL}(q_\phi(z_t | D) || p_\theta(z_t | D))$$

**비유**: "variational $q_\phi$ 가 true posterior $p_\theta$ 에 가깝게 학습".

### Eq 13 — KL Divergence

$$D_{KL}(q_\phi || p_\theta) = \int q_\phi(z_t) \log \frac{q_\phi(z_t)}{p_\theta(z_t)} dz_t$$

**비유**: "두 분포의 '거리' (비대칭)".

### Eq 14 — ELBO (★)

$$\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z_t)}{q_\phi(z_t|D)}\right] + \mathbb{E}_{q_\phi}[\log p_\theta(D|z_t)]$$

**비유**: "negative KL (regularization) + reconstruction likelihood — maximize 가 학습 목적".

### Eq 15 — VAE Output

$$\chi^d_{out} = \text{VAE}(\chi^d, D)$$

**비유**: "divergence 에 global distribution 정보 추가 → fusion 의 Q 입력".

### Eq 16 — Q, K, V Projection (★)

$$Q = \chi^d_{out} W_a W_Q, \quad K = \chi^Q_{eout} W_K, \quad V = \chi^Q_{eout} W_V$$

**비유**: "divergence (모름) 가 query, drift (앎) 이 key/value".

### Eq 17 — Fusion (★)

$$\text{Fusion} = \text{LayerNorm}(\text{SelfAtt}(Q,Q,Q) + \text{CrossAtt}(\text{Input}, K, V) + \text{FFN}(\text{Input}))$$

**비유**: "SelfAtt (혼자 생각) + CrossAtt (참고 자료) + FFN (최종 정리)".

### Eq 18 — Final Output

$$\hat{y} = W(\text{Fusion})$$

**비유**: "linear 로 5 quantile prediction 동시 출력".

### Eq 19 — Joint Quantile Loss (★)

$$\mathcal{L} = \sum_{y_t \in \Omega} \sum_{q \in Q} \sum_{\tau=1}^{\tau_{max}} \frac{q(y-\hat{y})_+ + (1-q)(\hat{y}-y)_+}{M \tau_{max}}$$

**비유**: "5 quantile × 96 horizon × 모든 sample 의 pinball loss 합".

### Eq 20 — q-risk (★)

$$\text{q-risk} = \frac{2 \sum_{y_t \in \hat{\Omega}} \sum_\tau [q(y-\hat{y})_+ + (1-q)(\hat{y}-y)_+]}{\sum_{y_t \in \hat{\Omega}} \sum_\tau |y_t|}$$

**비유**: "test set 의 quantile loss / mean — percentage 형식, lower better".

### Eq 21 — cpaw (★ paper 의 새 metric)

$$\text{cpaw} = \text{PINAW}(1 + \gamma \cdot e^{-(\text{PICP}-\mu)})$$

**비유**: "신뢰구간 폭 × under-coverage 시 exponential penalty".

---

## 16.4 자주 헷갈리는 점

### 1. $\chi^Q$ vs $\chi^Q_{eout}$
- $\chi^Q$ = quantile drift (분해 직후, encoder 입력 전).
- $\chi^Q_{eout}$ = encoder output (이후 fusion 의 K, V).

### 2. $D$ vs $\hat{D}$
- $D = \{(\mu_k, \Sigma_k)\}$ = GMM components (local distribution info).
- $\hat{D} = \sum \pi_k D_k$ = global mixture distribution (estimated target).

### 3. $c_t$ vs $b_t$
- $c_t$ = binary allocation (이 시점이 어떤 component 에 속하나? 1/0).
- $b_t$ = continuous contribution (어떤 정도로 기여하나? 0~1).

### 4. q-risk vs cpaw
- q-risk = quantile accuracy (Eq 20).
- cpaw = interval tightness + coverage (Eq 21).
- 두 metric 모두 lower better.

### 5. Self-attention vs Cross-attention
- Self: Q, K, V from same source.
- Cross (paper Eq 16): Q from divergence, K, V from drift.

### 6. Pinball loss vs MSE
- MSE: 대칭 — 평균 학습.
- Pinball: 비대칭 ($\tau$ 에 따라) — quantile 학습.

### 7. VAE vs AE
- AE: 잠재값이 단일 값.
- VAE: 잠재값이 확률 분포 + KL regularization.

---

## 16.5 paper References — 분야별 정리

### 시계열 분해 lineage

| 저자 (연도) | 기여 | paper 인용 위치 |
|-----------|------|---------------|
| Cleveland et al. (1990) | STL | Section 2.2 |
| Tukey (1960) | biostatistical decomposition intro | Section 2.2 |
| Hyndman-Khandakar (2008) | forecast R package | Section 2.2 |
| De Jong (1980) | seasonal-trend procedure | Section 2.2 |
| McCullough-Renfro (1990) | signal extraction | Section 2.2 |
| Hyndman-Athanasopoulos (2018) | "Forecasting: principles and practice" textbook | Section 2.3 |

### Probabilistic Forecasting

| 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Salinas et al. (2020)** | **DeepAR** | Table 1, 3 baseline |
| **Wen et al. (2017)** | **MQRNN** | Table 1, 3 baseline |
| **Lim et al. (2019)** | **TFT** | Table 1, 3 baseline |
| Bontempi-Ben Taieb (1999) | initial NN for forecasting | Section 2.3 |
| Bergmeir-Hyndman (2015) | boosted additive | Section 2.3 |
| Salinas (2018) | probabilistic wind speed | Section 2.3 |
| Wang (2021) | hierarchical Bayesian NN | Section 2.3 |
| Romano et al. (2019) | Conformalized QR | Section 2.3 |
| Rasul et al. (2021) | TimeGrad | Section 2.3 |
| Li et al. (2024) | TMDM (Transformer + diffusion) | Section 2.3 |
| Zhou et al. (2023) | P-TSE | Section 2.3 |
| Eisenach et al. (2020) | MQTransformer | Section 2.1 |

### Transformer for Forecasting (point-wise, adapted to quantile in paper)

| 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Vaswani et al. (2017)** | **Transformer (vanilla)** | Table 1, 3 baseline |
| **Wu et al. (2021)** | **Autoformer** | Table 1, 3 baseline + **직접 전신** |
| **Zhou et al. (2022)** | **FEDformer** | Table 1, 3 baseline |
| **Nie et al. (2022)** | **PatchTST** | Table 1, 3 baseline |
| **Liu et al. (2023)** | **iTransformer** | Table 1, 3 baseline |
| Liu et al. (2022) | Pyraformer | Section 2.1 |
| Wu et al. (2022) | TimesNet | Section 2.2 |

### 저자 그룹 (Nanjing University) 의 자기 인용

| 저자 (연도) | 작업 |
|-----------|------|
| Ma et al. (2024) | **TS3Net** (trend/regular/fluctuant 3-part 분해) — 본 paper 의 직전 선행 |
| Lin et al. (2022) | Resource-efficient graph CNN training |
| Duan et al. (2023) | Federated learning data fusion |
| Hong et al. (2024) | Magnet wavelet GNN |
| Hong et al. (2025) | Unify and anchor cross-domain Transformer |
| Wang et al. (2024) | TimeMixer |

### 이론적 도구

| 저자 (연도) | 도구 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Kingma (2013)** | **VAE / auto-encoding variational Bayes** | Eq 14 (variational theory) |
| Dempster et al. (1977) | EM algorithm | Eq 10 (softmax + GMM) |
| Griffiths-Ghahramani (2011) | Indian Buffet Process | Eq 9 (stick-breaking) |
| Ng-Jordan (2001) | discriminative vs generative classifiers | GMM definition |
| Ioffe-Szegedy (2015) | Batch normalization | inference network normalization |
| Cote (2016) | Stick-breaking VAE | Eq 9 의 prior |

### 응용 references (Section 1)

| 응용 | 저자 (연도) |
|------|-----------|
| Renewable energy | Zheng et al. (2023), Huy et al. (2022) |
| Traffic | Zhang et al. (2022), Jiang et al. (2024) |
| Healthcare | Caldas-Soares (2022) |

---

## 16.6 chapter 별 핵심 기호 매핑

| Chapter | 핵심 기호 | 의미 |
|---------|---------|------|
| ch01 | (개념만) | 7 개념 비유 |
| ch02 | (개념만) | Abstract 풀이 |
| ch03 | 3 challenges, 3 contributions | Section 1 |
| ch04 | (모델 이름들) | 11 referenced 모델 |
| ch05 | $Q(p), \tau, \rho_\tau$ | Eq 1-3 |
| ch06 | $\chi^Q, \chi^d, D, K$ | Eq 4-7 |
| ch07 | $\hat{D}, \pi_k, c_t, b_t, \lambda_t, z_t, \phi, \theta$ | Eq 8-15 |
| ch08 | $\chi^Q_{eout}$ | encoder output |
| ch09 | $Q, K, V, W_a, W_{Q/K/V}$ | Eq 16-18 |
| ch10 | $\mathcal{L}, \Omega, \tau_{max}$ | Eq 19 |
| ch11 | $\hat{\Omega}, M$, PICP, PINAW, $\gamma, \mu$ | Eq 20-21 |
| ch12-14 | (결과 분석) | Tables 1, 3, 4 + Fig 3, 4 |
| ch15 | (종합) | Conclusion |

→ 본 deep dive 의 모든 기호 사전이 이 chapter 에 정리.

---

다음 [17_insights.md](17_insights.md) 에서 메타 통찰 15개 (multi-level 분석).
