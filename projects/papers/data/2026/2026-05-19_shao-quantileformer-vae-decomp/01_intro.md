# 01 시작하기 전에 — 미리 알아둘 7개 개념

QuantileFormer 는 (1) 시계열 분해, (2) 확률 분포 추정, (3) Transformer 의 3-way 결합. 다음 7개를 머릿속에 채워두면 paper 의 모든 한 줄이 자리에 들어간다.

---

## 1. Quantile Regression (분위수 회귀)

**일반 회귀**: $y = X\beta + \varepsilon$, $\beta$ 가 $y$ 의 **평균** 을 예측.

**Quantile regression**: $\beta_\tau$ 가 $y$ 의 **$\tau$-th 분위수** 를 예측. 예 $\tau = 0.9$ → 상위 10% 경계값.

paper Eq 2:
$$
Q_\tau(y_t | X_t) = X_t \beta_\tau
$$

**Pinball loss** (또는 quantile loss):
$$
\rho_\tau(u) = \begin{cases} \tau \cdot u & u \geq 0 \\ (\tau - 1) \cdot u & u < 0 \end{cases}
$$

$u = y - \hat{y}$ 의 부호에 따라 다른 weight 부여 → asymmetric loss. 모델이 $\tau$-quantile 을 학습.

**왜 quantile?**: probabilistic forecasting 의 핵심. 평균 예측 (single point) 만으로는 "내가 얼마나 확실한가?" 답 못함. 여러 quantile 을 함께 예측하면 **uncertainty interval** 표현 가능.

예: $\tau = \{0.1, 0.5, 0.9\}$ 예측 → "median = 5, 10% 분위수 = 3, 90% 분위수 = 8" → 80% 신뢰 구간 [3, 8].

---

## 2. Gaussian Mixture Model (GMM)

**단일 Gaussian**: $f(x | \mu, \Sigma) = \frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(x-\mu)^T \Sigma^{-1}(x-\mu)\right)$

**Mixture of K Gaussians**: $p(x) = \sum_{k=1}^{K} \pi_k \mathcal{N}(x; \mu_k, \Sigma_k)$
- $\pi_k$ = component 의 weight ($\sum \pi_k = 1$)
- 각 component 는 다른 평균/분산

**왜 mixture?**: 시계열 데이터가 **여러 statistical regime** 사이를 오감. 예 — 평상시 distribution + 이벤트 시 distribution. 단일 Gaussian 으로는 capture 못함. K Gaussian 의 혼합으로 표현.

**EM 알고리즘** (Expectation-Maximization, Dempster 1977):
- E-step: 각 데이터가 어떤 component 에 속할 확률 추정.
- M-step: 확률 기반으로 $\pi_k, \mu_k, \Sigma_k$ 갱신.

paper 에서 `GauDe(·)` 가 이 EM 절차의 abbreviation.

---

## 3. VAE (Variational AutoEncoder)

**기본 AutoEncoder**: encoder $\phi$ 가 $x \to z$ (latent), decoder $\theta$ 가 $z \to \hat{x}$. Loss = reconstruction error.

**VAE 의 차이**:
- $z$ 가 **확률 분포** 의 sample.
- Encoder: $q_\phi(z | x)$ 의 parameters (예: Gaussian 의 $\mu, \sigma$) 출력.
- Loss = reconstruction + **KL divergence** ($q_\phi$ 와 prior $p(z)$ 사이).

**왜 VAE?**: 단순 AE 는 latent space 가 어수선 — sample 하면 의미 없는 결과. VAE 는 latent space 가 **structured probability** → smooth sampling 가능 → 새로운 데이터 생성.

paper 에서는 GMM 의 component weight, allocation, contribution 의 posterior $q_\phi(\lambda, c, b | D)$ 를 학습하는 도구로 사용.

---

## 4. KL Divergence + ELBO

**KL divergence**: $D_{KL}(q || p) = \int q(z) \log \frac{q(z)}{p(z)} dz$. 두 분포의 "거리". 0 일 때 동일.

**VAE 의 문제**: true posterior $p_\theta(z | x)$ 계산 어려움 → variational posterior $q_\phi(z | x)$ 로 근사.

**ELBO (Evidence Lower BOund)**:
$$
\mathbb{E}_{q_\phi}[\log p_\theta(x | z)] - D_{KL}(q_\phi(z|x) || p(z))
$$

$\log p_\theta(x)$ 의 하한. 이 ELBO 를 **최대화** ⇔ KL divergence 를 **최소화**.

paper Eq 14: ELBO 의 두 term — reconstruction (encoder-decoder) + KL (regularization).

---

## 5. Transformer 의 Encoder / Decoder

**Encoder layer**:
- Multi-Head Self-Attention
- Feed-Forward Network
- Residual + LayerNorm

**Decoder layer**:
- Masked Self-Attention (causal)
- **Cross-Attention** (encoder output 을 K, V 로)
- FFN
- Residual + LayerNorm

paper QuantileFormer 의 encoder: quantile drift $\chi^Q$ 의 6 layer 표준 encoder.

paper QuantileFormer 의 fusion Transformer: cross-attention 으로 두 path (drift + divergence) 융합.

---

## 6. Cross-Attention

**Self-attention**: $Q, K, V$ 가 같은 source 에서 (예: encoder 자신의 hidden state).

**Cross-attention**: $Q$ 가 source A, $K, V$ 가 source B → A 가 B 에서 정보 가져옴.

paper Eq 16:
$$
Q = \chi^d_{out} \cdot W_a \cdot W_Q, \quad K = \chi^Q_{out} \cdot W_K, \quad V = \chi^Q_{out} \cdot W_V
$$

→ divergence path ($\chi^d_{out}$) 가 query, drift path ($\chi^Q_{out}$) 가 key/value. divergence 가 drift 에서 정보 추출.

**비유**: encoder-decoder Transformer 의 cross-attention 과 같은 메커니즘. 두 다른 "언어" (drift vs divergence) 를 align.

---

## 7. Indian Buffet Process + Stick-Breaking (VAE 의 prior)

paper 가 GMM component allocation 의 prior 로 사용.

**Indian Buffet Process**: 무한 개의 latent feature 중 일부만 "선택" 되는 nonparametric Bayesian process. 비유 — 인도 뷔페에서 손님이 일부 음식만 골라 먹는 모습.

**Stick-breaking construction**: $\lambda_k \sim \text{Beta}(\varsigma_k, \kappa_k)$ — 막대를 부러뜨려 각 component 의 probability 를 결정.

**왜 IBP?**: K 가 fixed 가 아닌 데이터에서 학습되는 효과. 본 paper 의 K 는 hyperparameter 지만, allocation 변수 $c_t$ 의 prior 는 IBP-style.

paper Eq 9: $\lambda_t \sim \text{Beta}, c_t \sim \text{Bernoulli}(\prod \lambda)$.

---

## Wrap-up: 위 7개가 어떻게 결합되는가

| 개념 | QuantileFormer 에서의 역할 |
|------|---------------------------|
| Quantile regression | 출력 = quantile 들. Loss = pinball loss (Eq 19) |
| GMM | divergence pattern $\chi^d$ 를 K Gaussian 으로 분해 (Eq 7) |
| VAE | GMM 의 component weight $\pi_k$ 와 allocation $c_t$ 의 posterior 추론 |
| KL + ELBO | VAE 의 학습 objective (Eq 12–14) |
| Transformer | quantile drift $\chi^Q$ 의 6-layer encoder + fusion |
| Cross-attention | drift path 와 divergence path 의 융합 (Eq 16–17) |
| IBP / stick-breaking | GMM allocation 의 nonparametric prior (Eq 9) |

이제 다음 chapter 의 Abstract 를 한 문장씩 풀어 읽을 준비가 되었다.
