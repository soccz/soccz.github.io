# 12 Glossary + Notation + References

> **🧒 한 줄 요약**: 용어 사전. Diffusion / DDPM / score matching / CRPS 정리.


## 핵심 약어

| 약어 | 풀이 | 출처 |
|------|------|------|
| DDPM | Denoising Diffusion Probabilistic Model | Ho et al. 2020 |
| EBM | Energy-Based Model | Hinton 2002 / LeCun 2006 |
| RNN | Recurrent Neural Network | Graves 2013 |
| LSTM | Long Short-Term Memory | Hochreiter-Schmidhuber 1997 |
| GRU | Gated Recurrent Unit | Chung 2014 |
| KL | Kullback-Leibler divergence | (표준) |
| MSE | Mean Squared Error | (표준) |
| MLP | Multi-Layer Perceptron | (표준) |
| ELBO | Evidence Lower BOund | Kingma-Welling 2019 |
| CRPS | Continuous Ranked Probability Score | Matheson-Winkler 1976 |
| CRPS_sum | CRPS summed across $D$ dimensions | de Bézenac 2020 |
| VAE | Variational AutoEncoder | Kingma-Welling 2019 |
| GAN | Generative Adversarial Network | Yoon 2019 (TS-GAN) |
| MAF | Masked Autoregressive Flow | Papamakarios 2017 |
| VAR | Vector Autoregression | Lütkepohl 2007 |
| GARCH | Generalized Autoregressive Conditional Heteroskedasticity | van der Weide 2002 |
| VES | (Innovation) State Space Model | Hyndman 2008 |
| KVAE | Kalman VAE | Fraccaro 2017 |
| DDIM | Denoising Diffusion Implicit Models | Song 2021 |
| NCSN | Noise Conditional Score Network | Song-Ermon 2019 |
| OOD | Out-of-Distribution | Nalisnick 2019 |

---

## 표기법 (paper 의 정확 notation)

### Time Series

| 기호 | 의미 |
|------|------|
| $D$ | Multivariate dimension (8 ~ 2,000) |
| $t$ | Time index |
| $T$ | 전체 시간 길이 (Table 1) |
| $t_0$ | Context window 끝 시점 |
| $[1, t_0]$ | Context window |
| $[t_0, T]$ | Prediction interval |
| $x^0_{i,t} \in \mathbb{R}$ | Entity $i$ 의 시점 $t$ scalar 값 |
| $\mathbf{x}^0_t \in \mathbb{R}^D$ | 시점 $t$ 의 multivariate vector |
| $\mathbf{c}_t$ | 시점 $t$ 의 covariates |
| $\mathbf{c}_{1:T}$ | Covariates 전체 sequence |

### Diffusion (Section 2)

| 기호 | 의미 |
|------|------|
| $\mathbf{x}^0$ | Clean data (diffusion step 0) |
| $\mathbf{x}^n$ | Step $n$ 의 noisy version, $n \in [1, N]$ |
| $\mathbf{x}^N$ | Pure noise $\sim \mathcal{N}(0, \mathbf{I})$ |
| $N$ | Total diffusion steps (paper: 100) |
| $\beta_n$ | Forward noise schedule, $\beta_1 = 10^{-4}, \beta_N = 0.1$ |
| $\alpha_n := 1 - \beta_n$ | Single-step preservation |
| $\bar\alpha_n := \Pi_{i=1}^n \alpha_i$ | Cumulative preservation |
| $\tilde\beta_n$ | Eq 5 의 forward posterior variance |
| $\tilde\mu_n$ | Eq 5 의 forward posterior mean |
| $\epsilon \sim \mathcal{N}(0, \mathbf{I})$ | True noise |
| $\epsilon_\theta$ | Noise prediction network (학습 대상) |
| $\mu_\theta, \Sigma_\theta$ | Reverse process mean / variance |
| $q(\cdot)$ | Forward (fixed) Markov chain |
| $p_\theta(\cdot)$ | Reverse (learned) Markov chain |

### TimeGrad (Section 3)

| 기호 | 의미 |
|------|------|
| $\mathbf{h}_t \in \mathbb{R}^{40}$ | RNN hidden state |
| $\mathbf{h}_0 = \mathbf{0}$ | Initial hidden |
| $\text{RNN}_\theta$ | 2-layer LSTM/GRU |
| $\epsilon_\theta(\mathbf{x}^n_t, \mathbf{h}_{t-1}, n)$ | Conditional noise prediction |
| $S$ | Number of sampled trajectories ($S = 100$) |

### Evaluation

| 기호 | 의미 |
|------|------|
| $F$ | Predicted CDF |
| $\hat F$ | Empirical CDF |
| $\hat F_\text{sum}$ | Empirical CDF of $\sum_i x^0_{i,t}$ |
| CRPS | Continuous Ranked Probability Score |
| CRPS_sum | Sum-aggregated CRPS |

### Model parameters

| 기호 | 의미 |
|------|------|
| $\theta$ | All learnable parameters (RNN + diffusion network) |

---

## 핵심 수식 정리

### Eq 1 — Forward Process
$$q(\mathbf{x}^n | \mathbf{x}^{n-1}) := \mathcal{N}(\mathbf{x}^n; \sqrt{1-\beta_n} \mathbf{x}^{n-1}, \beta_n \mathbf{I})$$

### Eq 2 — Variational Bound
$$\min_\theta \mathbb{E}_{q(\mathbf{x}^{0:N})} \left[ -\log p(\mathbf{x}^N) - \sum_{n=1}^N \log \frac{p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n)}{q(\mathbf{x}^n|\mathbf{x}^{n-1})} \right]$$

### Eq 3 — Forward Closed-Form
$$q(\mathbf{x}^n | \mathbf{x}^0) = \mathcal{N}(\mathbf{x}^n; \sqrt{\bar\alpha_n} \mathbf{x}^0, (1-\bar\alpha_n) \mathbf{I})$$

### Eq 4 — Decomposed Loss (KL form)
$$-\log p_\theta(\mathbf{x}^0|\mathbf{x}^1) + D_{KL}(q(\mathbf{x}^N|\mathbf{x}^0) \| p(\mathbf{x}^N)) + \sum_{n=2}^N D_{KL}(q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0) \| p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n))$$

### Eq 5 — Forward Posterior
$$q(\mathbf{x}^{n-1} | \mathbf{x}^n, \mathbf{x}^0) = \mathcal{N}(\mathbf{x}^{n-1}; \tilde\mu_n(\mathbf{x}^n, \mathbf{x}^0), \tilde\beta_n \mathbf{I})$$
where
$$\tilde\mu_n := \frac{\sqrt{\bar\alpha_{n-1}}\beta_n}{1-\bar\alpha_n}\mathbf{x}^0 + \frac{\sqrt{\alpha_n}(1-\bar\alpha_{n-1})}{1-\bar\alpha_n}\mathbf{x}^n$$
$$\tilde\beta_n := \frac{1-\bar\alpha_{n-1}}{1-\bar\alpha_n}\beta_n$$

### Eq 6 — KL as MSE
$$D_{KL}(q \| p_\theta) = \mathbb{E}_q\left[\frac{1}{2\Sigma_\theta} \|\tilde\mu_n - \mu_\theta\|^2\right] + C$$

### Eq 7 — Final Loss
$$\mathbb{E}_{\mathbf{x}^0, \epsilon, n}\left[ \frac{\beta_n^2}{2\Sigma_\theta \alpha_n(1-\bar\alpha_n)} \|\epsilon - \epsilon_\theta(\sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon, n)\|^2 \right]$$

### Eq 8 — TimeGrad Conditional Decomposition
$$q_X(\mathbf{x}^0_{t_0:T} | \mathbf{x}^0_{1:t_0-1}, \mathbf{c}_{1:T}) = \Pi_{t=t_0}^T q_X(\mathbf{x}^0_t | \mathbf{x}^0_{1:t-1}, \mathbf{c}_{1:T})$$

### Eq 9 — RNN
$$\mathbf{h}_t = \text{RNN}_\theta(\text{concat}(\mathbf{x}^0_t, \mathbf{c}_t), \mathbf{h}_{t-1})$$

### Eq 10 — Joint as RNN Conditional
$$\Pi_{t=t_0}^T p_\theta(\mathbf{x}^0_t | \mathbf{h}_{t-1})$$

### Conditional Loss (TimeGrad version of Eq 7)
$$\mathbb{E}\left[ \|\epsilon - \epsilon_\theta(\sqrt{\bar\alpha_n}\mathbf{x}^0_t + \sqrt{1-\bar\alpha_n}\epsilon, \mathbf{h}_{t-1}, n)\|^2 \right]$$

### Langevin Sampling
$$\mathbf{x}^{n-1} = \frac{1}{\sqrt{\alpha_n}}\left(\mathbf{x}^n - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}}\epsilon_\theta(\mathbf{x}^n, \mathbf{h}_{t-1}, n)\right) + \sqrt{\Sigma_\theta}\mathbf{z}$$

### CRPS_sum
$$\text{CRPS}_\text{sum} = \mathbb{E}_t\left[ \text{CRPS}\left(\hat F_\text{sum}(t), \sum_i x^0_{i,t}\right) \right]$$

---

## paper References — 핵심 50+ papers

paper 의 References ~80 paper 중 본 deep dive 가 자주 cite 또는 brief mention:

### Foundations
- **Sohl-Dickstein 2015** — Diffusion 의 원조 (Deep Unsupervised Learning via Nonequilibrium Thermodynamics)
- **Ho 2020** — DDPM (본 paper 의 직접 inspiration)
- **Song-Ermon 2019** — NCSN (score matching diffusion 의 다른 측면)
- **Song-Ermon 2020** — Improved NCSN
- **Hyvärinen 2005** — Score matching
- **Vincent 2011** — Score matching ↔ DAE connection
- **Hinton 2002** — Contrastive divergence (EBM)
- **LeCun 2006** — EBM tutorial

### RNN
- **Graves 2013** — RNN sequence generation
- **Sutskever 2014** — Seq2seq
- **Hochreiter-Schmidhuber 1997** — LSTM
- **Chung 2014** — GRU
- **Charrington 2018** — Categorical embedding

### Audio Diffusion (TimeGrad 의 architecture inspiration)
- **WaveGrad** (Chen 2021)
- **DiffWave** (Kong 2021)
- **WaveNet** (van den Oord 2016a)
- **Gated Activation** (van den Oord 2016b)

### Time Series Forecasting
- **Hyndman-Athanasopoulos 2018** — Forecasting textbook
- **Benidis 2020** — Neural forecasting review
- **DeepAR** (Salinas 2019b) — univariate baseline
- **Vec-LSTM** (Salinas 2019a) — multivariate baseline
- **GP-Copula** (Salinas 2019a) — multivariate baseline
- **N-BEATS** (Oreshkin 2020) — point forecast
- **ES-RNN** (Smyl 2020) — M4 winner
- **LSTNet** (Lai 2018) — multivariate point
- **KVAE** (Fraccaro 2017) — baseline
- **TimeGAN** (Yoon 2019)
- **NKF** (de Bézenac 2020)
- **Transformer-MAF** (Rasul 2021) — Zalando 그룹 의 직전 paper, Table 2 best 경쟁자
- **Tsay 2014** — Multivariate TS Analysis textbook

### Classical Statistics
- **VAR** (Lütkepohl 2007)
- **GARCH** (van der Weide 2002)
- **VES** (Hyndman 2008)
- **Box-Jenkins 1970** (ARIMA)

### Evaluation
- **Matheson-Winkler 1976** — CRPS
- **Jordan 2019** — scoringRules R package (proper scoring rules)

### Optimization
- **Kingma-Ba 2015** — Adam
- **Kingma-Welling 2019** — VAE intro

### Bayesian + Uncertainty
- **Zhu-Laptev 2018** — Bayesian uncertainty in time series (Uber)
- **Wenzel 2020** — Bayesian posterior empirical
- **Du-Mordatch 2019** — EBM OOD detection
- **Nalisnick 2019** — Likelihood OOD failure

### Future Work
- **Song 2021** — DDIM
- **Chen 2021** — WaveGrad (improved schedule, L1 loss)
- **Niu 2020** — Score-based generative on graphs

### Other deep dive papers
- **Chronos** (이미 사이트에 있는 자매 paper) — TS foundation model.
- **iTransformer**, **PatchTST** — 동시기 시계열 Transformer 변형.

---

## 다음

[13_insights.md](13_insights.md) — 메타 통찰 12개 "이해를 넘어서".

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Diffusion forward process 의미?**
2. **DDPM의 ELBO 직관?**
3. **Score matching의 score function 정의?**

### 답변

1. **Gradual noise addition**. q(x_t | x_{t-1}) = N(x_t; √(1-β_t) x_{t-1}, β_t I). T-step noising 까지 *pure noise*.

2. **Variational lower bound**. ELBO = E[log p(x_0|x_1)] - sum KL terms. Reverse process learning 의 objective.

3. **Score = gradient of log density**. ∇_x log p(x). Score matching = denoising target. Generative process의 *direction signal*.
