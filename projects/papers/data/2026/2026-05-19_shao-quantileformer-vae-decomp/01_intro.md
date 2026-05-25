# 01 시작하기 전에 — 미리 알아둘 7개 개념

QuantileFormer 는 (1) 시계열 분해, (2) 확률 분포 추정, (3) Transformer 의 3-way 결합. 다음 7개를 머릿속에 채워두면 paper 의 모든 한 줄이 자리에 들어간다.

각 개념은 **친근한 비유 → 정확한 정의 → QuantileFormer 에서의 역할** 순서로 풀어 설명한다.

---

## 1. Quantile Regression (분위수 회귀)

### 친근한 비유 먼저

**일기예보** 를 생각해보자. 기상청이 "내일 최고기온은 25도" 라고 한 줄로 발표하면 — 이건 평균 예측 (point prediction). 그런데 실제로는 "내일 최고기온이 22~28도 사이일 확률 80%" 같은 **범위** 가 더 유용하다.
- 22도 = 10% 분위수 (Q(0.1))
- 25도 = median (Q(0.5))
- 28도 = 90% 분위수 (Q(0.9))

**Quantile regression** = "여러 분위수를 동시에 예측하기."

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

### 친근한 비유 먼저

**키 분포** 를 생각해보자. 사람 전체의 키 분포는 **단일 Gaussian (정규분포)** 으로 표현 안 됨 — 남녀 평균이 다르니까. 대신:
- 남자 키 분포: $\mathcal{N}(173, 6^2)$
- 여자 키 분포: $\mathcal{N}(160, 5^2)$
- 전체 = 50% 남자 + 50% 여자 = "**두 Gaussian 의 mixture**"

이게 GMM. 시계열도 마찬가지 — **평상시 분포 + 이벤트 시 분포 + 야간 분포** 같이 여러 statistical regime 의 mixture.

### 정확한 정의

**단일 Gaussian**: $f(x | \mu, \Sigma) = \frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(x-\mu)^T \Sigma^{-1}(x-\mu)\right)$

**Mixture of K Gaussians**: $p(x) = \sum_{k=1}^{K} \pi_k \mathcal{N}(x; \mu_k, \Sigma_k)$
- $\pi_k$ = component 의 weight ($\sum \pi_k = 1$) — 각 regime 의 비율
- 각 component 는 다른 평균/분산

**왜 mixture?**: 시계열 데이터가 **여러 statistical regime** 사이를 오감. 예 — 평상시 distribution + 이벤트 시 distribution. 단일 Gaussian 으로는 capture 못함. K Gaussian 의 혼합으로 표현.

**EM 알고리즘** (Expectation-Maximization, Dempster 1977):
- E-step: 각 데이터가 어떤 component 에 속할 확률 추정.
- M-step: 확률 기반으로 $\pi_k, \mu_k, \Sigma_k$ 갱신.

paper 에서 `GauDe(·)` 가 이 EM 절차의 abbreviation.

---

## 3. VAE (Variational AutoEncoder)

### 친근한 비유 먼저

**사진을 작은 코드로 압축 + 복원** 시스템. 일반 AE 는 한 사진 → 정확히 한 코드 (deterministic). VAE 는 한 사진 → **확률 분포 위의 한 코드** (sampling) → 약간 다른 복원. 이 무작위성 덕분에 학습 후 **새로운 그럴듯한 사진 생성** 가능.

핵심: "코드를 점이 아닌 분포로 → 다양성 확보."

### 정확한 정의

**기본 AutoEncoder**: encoder $\phi$ 가 $x \to z$ (latent), decoder $\theta$ 가 $z \to \hat{x}$. Loss = reconstruction error.

**VAE 의 차이**:
- $z$ 가 **확률 분포** 의 sample.
- Encoder: $q_\phi(z | x)$ 의 parameters (예: Gaussian 의 $\mu, \sigma$) 출력.
- Loss = reconstruction + **KL divergence** ($q_\phi$ 와 prior $p(z)$ 사이).

**왜 VAE?**: 단순 AE 는 latent space 가 어수선 — sample 하면 의미 없는 결과. VAE 는 latent space 가 **structured probability** → smooth sampling 가능 → 새로운 데이터 생성.

paper 에서의 역할: GMM 의 component weight, allocation, contribution 의 posterior $q_\phi(\lambda, c, b | D)$ 를 학습하는 도구.

---

## 4. KL Divergence + ELBO

### 친근한 비유 먼저

**KL divergence** = "두 일기예보의 차이". 예보 A 가 비 확률 70%, B 가 비 확률 30% → 두 예보 분포의 "정보이론 거리" 가 KL. 같은 분포면 KL=0, 매우 다르면 KL 큼.

**ELBO** = "VAE 의 학습 목표 = 두 가지 동시 잘 하기". (1) 복원 잘 (reconstruction), (2) 규칙 따르기 (KL 작게).

### 정확한 정의

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

### 친근한 비유 먼저

**번역기** 와 같다. 영어 ($K, V$) 를 한국어 ($Q$) 로 번역. 각 한국어 단어 (query) 가 "영어 문장의 어느 부분을 봐야 할지" cross-attention 으로 결정. QuantileFormer 의 fusion: divergence path ($Q$) 가 drift path ($K, V$) 에서 정보 가져옴.

### 정확한 정의

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

### 친근한 비유 먼저

**인도 뷔페** 에서 손님 100명이 차례로 음식을 고른다고 상상하자. 첫 손님은 다양한 음식을 시도. 둘째 손님은 첫 사람이 인기 많이 고른 음식 + 새로운 것 일부. 100번째 손님은 인기 음식 + 가끔 새로운 것. 결과: **인기 음식은 많은 사람이, drog 음식은 소수만 선택** — 자연스럽게 sparse 한 feature selection.

**Stick-breaking**: 막대 길이 1 을 부러뜨려 가는 과정. 첫 부러뜨림 $\lambda_1$ → 남은 부분에서 다시 $\lambda_2$ ... → 각 $\lambda$ 의 누적곱이 component 의 확률.

### 정확한 정의

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

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Quantile regression 의 pinball loss 가 asymmetric 이라는 게 $\tau = 0.9$ 일 때 무슨 의미?**
2. **Single Gaussian 으로 키 분포 표현이 불가능한 이유와 GMM 의 답은?**
3. **Cross-attention 이 fusion Transformer 에서 어느 path 가 query, 어느 path 가 key/value 이며 그 의미는?**

### 답변

1. $u = y - \hat y > 0$ (under-prediction) 일 때 loss = $0.9u$ (큰 페널티). $u < 0$ (over-prediction) 일 때 loss = $0.1 |u|$ (작은 페널티). 결과: 모델이 90% 확률로 실제값 $\leq$ 예측값 이도록 학습 → **90% 분위수 학습**.
2. **남녀 평균 키가 다름** (남 173, 여 160) → 전체 분포가 두 봉우리 (bimodal). 단일 Gaussian (단봉) 으로 표현 불가. **GMM 의 답**: 두 Gaussian 의 혼합 ($\pi_{남} \mathcal{N}(173,6^2) + \pi_{여} \mathcal{N}(160,5^2)$).
3. **Query**: divergence path ($\chi^d_{out}$) — "내가 알고 싶은 것 (복잡한 stochastic 패턴)". **Key/Value**: drift path ($\chi^Q_{eout}$) — "알고 있는 정보 (smooth quantile trends)". 의미: divergence (모름) 가 drift (앎) 에서 soft alignment 로 정보 추출.
