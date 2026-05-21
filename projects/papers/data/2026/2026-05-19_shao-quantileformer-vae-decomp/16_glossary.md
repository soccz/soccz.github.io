# 16 Glossary + Notation + References

## 핵심 약어

| 약어 | 풀이 | 출처 |
|------|------|------|
| VAE | Variational AutoEncoder | Kingma 2013 |
| GMM | Gaussian Mixture Model | Ng-Jordan 2001 |
| KL | Kullback-Leibler divergence | Eq 12-13 |
| ELBO | Evidence Lower BOund | Eq 14 |
| FFN | Feed-Forward Network | Transformer block |
| IBP | Indian Buffet Process | Griffiths-Ghahramani 2011 |
| EM | Expectation-Maximization | Dempster 1977 |
| PICP | Prediction Interval Coverage Probability | Eq 21 |
| PINAW | PI Normalized Averaged Width | Eq 21 |
| cpaw | Coverage Probability × Normalized Width | Eq 21 (paper 의 새 metric) |
| q-risk | quantile risk | Eq 20 |
| RIF | Re-centered Influence Function | Conformalized QR |
| TFT | Temporal Fusion Transformer | Lim 2019 |
| MQRNN | Multi-horizon Quantile RNN | Wen 2017 |
| EBM | Energy-Based Model | TimeGrad |
| STL | Seasonal-Trend decomposition by Loess | Cleveland 1990 |
| HMM | Hidden Markov Model | P-TSE |

---

## 표기법 (paper 의 표기 그대로)

### 시계열

| 기호 | 의미 |
|------|------|
| $\chi$ | 원본 시계열 (input) |
| $\chi^q$ | $q$-th quantile drift (Eq 4) |
| $\chi^Q = \{\chi^q\}_{q \in Q}$ | 모든 quantile drift 의 set |
| $\chi^d = \chi - \chi^{0.5}$ | divergence pattern (median-centered) |
| $\chi^e_{out}$ | Encoder output |
| $\chi^Q_{eout}$ | quantile drift 의 encoder output set |
| $\chi^d_{out}$ | divergence path의 VAE output |
| $X_t$ | 시점 $t$ 의 입력 변수들 |
| $y_t$ | 시점 $t$ 의 예측 대상 |
| $\hat{y}$ | 예측 결과 |

### Quantile Regression

| 기호 | 의미 |
|------|------|
| $\tau$, $q$ | quantile level (0~1) |
| $Q$ | quantile set (paper: $\{0.5, 0.6, 0.7, 0.8, 0.9\}$) |
| $\beta_\tau$ | $\tau$-th quantile 의 회귀 coefficient |
| $\rho_\tau(u)$ | pinball loss |
| $Q_\tau(y_t | X_t)$ | conditional $\tau$-quantile |

### GMM + VAE

| 기호 | 의미 |
|------|------|
| $K$ | Gaussian components 수 |
| $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$ | GMM components |
| $\hat{D}$ | global mixture distribution |
| $\pi_k$ | component $k$ 의 weight |
| $c_t \in \{0,1\}^K$ | allocation vector (binary) |
| $b_t$ | contribution values |
| $\lambda_t$ | Bernoulli parameter (Beta distributed) |
| $z_t$ | latent variable for decoder |
| $\phi$ | variational encoder parameters |
| $\theta$ | decoder parameters |
| $\nu_k, \zeta_k$ | Gaussian prior parameters for $b_t$ |
| $\varsigma_k, \kappa_k$ | Beta prior parameters for $\lambda_t$ |

### Transformer Fusion

| 기호 | 의미 |
|------|------|
| $W_a$ | divergence path 의 alignment projection |
| $W_Q, W_K, W_V$ | Q/K/V projection matrices |
| $W_{output}$ | multi-head 결합 projection |
| $W$ | final prediction head |

### Metric

| 기호 | 의미 |
|------|------|
| $\Omega$ | training data domain |
| $\hat{\Omega}$ | test data domain |
| $M$ | training samples 수 |
| $\tau_{max}$ | forecasting horizon |
| PICP | $\frac{1}{n} \sum \mathbb{I}(y \in [\hat{q}_l, \hat{q}_u])$ |
| PINAW | $\frac{1}{n} \sum |\hat{q}_u - \hat{q}_l|$ |
| $\mu$ | quantile difference (예: 0.9 - 0.1 = 0.8) |
| $\gamma$ | indicator function |

---

## 핵심 수식 정리

### Eq 1 — Quantile 정의
$$Q(p) = \inf\{x : P(X \leq x_p) \geq p\}$$

### Eq 4 — Drift-Divergence Decomposition
$$\chi^q = \text{QuantileFilt}(\text{Padding}(\chi), q), \quad \chi^d = \chi - \chi^{0.5}$$

### Eq 7 — GMM
$$D = \text{GauDe}(\chi^d)$$

### Eq 8 — Global Mixture
$$\hat{D} = \sum_{k=1}^{K} \pi_k D_k$$

### Eq 10 — Component Weight
$$\pi_k = \frac{\exp(\frac{1}{K} S_k)}{Z}, \quad S_k = \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}$$

### Eq 14 — ELBO
$$\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z_t)}{q_\phi(z_t|D)}\right] + \mathbb{E}_{q_\phi}[\log p_\theta(D|z_t)]$$

### Eq 15 — VAE Output
$$\chi^d_{out} = \text{VAE}(\chi^d, D)$$

### Eq 16-18 — Fusion Transformer
$$Q = \chi^d_{out} W_a W_Q, \quad K = \chi^Q_{eout} W_K, \quad V = \chi^Q_{eout} W_V$$
$$\text{Fusion} = \text{LayerNorm}(\text{SelfAtt}(Q,Q,Q) + \text{CrossAtt}(\text{Input}, K, V) + \text{FFN}(\text{Input}))$$
$$\hat{y} = W(\text{Fusion})$$

### Eq 19 — Joint Quantile Loss
$$\mathcal{L} = \sum_{y_t \in \Omega} \sum_{q \in Q} \sum_{\tau=1}^{\tau_{max}} \frac{q(y-\hat{y})_+ + (1-q)(\hat{y}-y)_+}{M \tau_{max}}$$

### Eq 20 — q-risk
$$\text{q-risk} = \frac{2 \sum_{y_t \in \hat{\Omega}} \sum_\tau [q(y-\hat{y})_+ + (1-q)(\hat{y}-y)_+]}{\sum_{y_t \in \hat{\Omega}} \sum_\tau |y_t|}$$

### Eq 21 — cpaw
$$\text{cpaw} = \text{PINAW}(1 + \gamma \cdot e^{-(\text{PICP}-\mu)})$$

---

## paper References — 핵심 references

paper 의 reference 가 일반적인 인용 (저자명 + 연도) 형식. 본 deep dive 의 ch15 conclusion + ch17 insights 까지 거쳐 mentioned 된 references:

### 시계열 분해 lineage

| 저자 (연도) | 역할 | paper 인용 위치 |
|-----------|------|---------------|
| Cleveland et al. (1990) | STL | Section 2.2 |
| Tukey (1960) | biostatistical intro | Section 2.2 |
| Hyndman-Khandakar (2008) | forecast R package | Section 2.2 |
| De Jong (1980) | seasonal-trend procedure | Section 2.2 |
| McCullough-Renfro (1990) | signal extraction | Section 2.2 |

### Probabilistic Forecasting

| 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Salinas et al. (2020)** | **DeepAR** | Table 1, 3 baseline |
| **Wen et al. (2017)** | **MQRNN** | Table 1, 3 baseline |
| **Lim et al. (2019)** | **TFT** | Table 1, 3 baseline |
| Romano et al. (2019) | Conformalized QR | Section 2.3 |
| Rasul et al. (2021) | TimeGrad | Section 2.3 |
| Li et al. (2024) | TMDM | Section 2.3 |
| Bergmeir-Hyndman (2015) | boosted additive | Section 2.3 |

### Transformer for Forecasting (point-wise, adapted to quantile in paper)

| 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Vaswani et al. (2017)** | **Transformer** | Table 1, 3 baseline |
| **Wu et al. (2021)** | **Autoformer** | Table 1, 3 baseline |
| **Zhou et al. (2022)** | **FEDformer** | Table 1, 3 baseline |
| **Nie et al. (2022)** | **PatchTST** | Table 1, 3 baseline |
| **Liu et al. (2023)** | **iTransformer** | Table 1, 3 baseline |
| Eisenach et al. (2020) | MQTransformer | Section 2.1 |
| Liu et al. (2022) | Pyraformer | Section 2.1 |
| Wu et al. (2022) | TimesNet | Section 2.2 |
| Ma et al. (2024) | TS3Net (저자 group) | Section 2.2 |
| Wang et al. (2024) | TimeMixer | Section 2.2 |

### 이론적 도구

| 저자 (연도) | 도구 | 본 paper 에서의 역할 |
|-----------|------|------------------|
| **Kingma (2013)** | **VAE / auto-encoding variational Bayes** | Eq 14 (variational theory) |
| Dempster et al. (1977) | EM algorithm | Eq 10 (softmax + GMM) |
| Griffiths-Ghahramani (2011) | Indian Buffet Process | Eq 9 (stick-breaking) |
| Ng-Jordan (2001) | discriminative vs generative classifiers | GMM definition |
| Ioffe-Szegedy (2015) | Batch normalization | paper 의 inference network 의 normalization |
| Cote (2016) | Stick-breaking VAE | Eq 9 의 prior |
| Duan et al. (2023) | Federated learning data fusion (저자 group) | VAE 의 latent posterior 영감 |

### Hyndman-Athanasopoulos (2018)

paper 가 Section 2.3 에서 인용한 textbook — "Forecasting: principles and practice". 시계열 분야의 표준 reference.

### 응용 references (Section 1)

| 응용 | 저자 (연도) |
|------|-----------|
| Renewable energy | Zheng et al. (2023), Huy et al. (2022) |
| Traffic | Zhang et al. (2022), Jiang et al. (2024) |
| Healthcare | Caldas-Soares (2022) |

### 저자 group 의 self-references

paper 는 Nanjing University 의 Wenzhong Li (corresponding) 그룹의 작품. 그들의 이전 paper:
- Lin et al. (2022) — Resource-efficient graph CNN training
- Duan et al. (2023) — Federated learning
- Hong et al. (2024) — Magnet wavelet GNN
- Hong et al. (2025) — Unify and anchor cross-domain Transformer
- Ma et al. (2024) — TS3Net

→ 같은 group 이 시계열 forecasting + cross-domain learning 연속 작품.

---

## 자주 헷갈리는 점

1. **$\chi^Q$ vs $\chi^Q_{eout}$**: 
   - $\chi^Q$ = quantile drift (분해 직후, encoder 입력 전)
   - $\chi^Q_{eout}$ = encoder output (이후 fusion 의 K, V)

2. **$D$ vs $\hat{D}$**:
   - $D = \{(\mu_k, \Sigma_k)\}$ = GMM components (local distribution info)
   - $\hat{D} = \sum \pi_k D_k$ = global mixture distribution (estimated target)

3. **$c_t$ vs $b_t$**:
   - $c_t$ = binary allocation (이 시점이 어떤 component 에 속하나? 1/0)
   - $b_t$ = continuous contribution (어떤 정도로 기여하나? 0~1)

4. **q-risk vs cpaw**:
   - q-risk = quantile accuracy (Eq 20)
   - cpaw = interval tightness + coverage (Eq 21)
   - 두 metric 모두 lower better.

5. **Self-attention vs Cross-attention**:
   - Self: Q, K, V from same source.
   - Cross (paper Eq 16): Q from divergence, K, V from drift.

다음 [17_insights.md](17_insights.md) 에서 메타 통찰.
