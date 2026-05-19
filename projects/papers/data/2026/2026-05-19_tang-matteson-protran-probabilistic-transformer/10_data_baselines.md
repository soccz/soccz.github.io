# 10 Datasets + Baselines + Metrics (Section 5)

paper p.6-7. 두 task (forecasting + motion) 의 실험 셋업.

## Section 5 Overview

paper p.6:
> We present our experiment results on two tasks, namely, time series forecasting and human motion prediction. These tasks are often studied independently, despite being almost identical as conditional prediction problems.

→ 두 task 가 사실상 같은 conditional prediction (context 주고 미래 예측).

---

## 5.1 Time-series Forecasting

### Datasets (5종)

paper p.7:
> Following the experiment setup in [72, 73, 75], we evaluate our models and multiple competitive baselines on five popular public datasets: SOLAR, ELECTRICITY, TRAFFIC, TAXI, and WIKIPEDIA. The data is recorded with hourly or daily frequency and shows seasonal patterns of different frequencies (see Appendix A for more dataset details).

| Dataset | Series | Frequency | Source |
|---------|--------|-----------|--------|
| **Solar** | 137 | hourly | Solar power plants |
| **Electricity** | 370 | hourly | UCI repository |
| **Traffic** | 963 | hourly | San Francisco Bay area freeway |
| **Taxi** | 1,214 | 30-min | New York City |
| **Wikipedia** | 2,000 | daily | Wikipedia page traffic |

(detail in paper Appendix A, 본 deep dive 의 reconstruction 기준 — paper 본문에 fully published 안 됨)

**Covariates** (paper p.7):
> As in [72, 73], the covariates include lagged inputs, fixed time embeddings (e.g. day of week, hour of day), and learnable time-series embeddings. The inputs are scaled using the conditioning examples before being fed into the model, and the predictions are rescaled appropriately afterward.

- Lagged inputs (이전 시점들)
- Time embeddings (요일, 시간)
- Learnable series embeddings

### Metric — CRPS_sum (paper p.7)

paper:
> Following [23, 72, 75], we evaluate our model and all baselines using continuous ranked probability score (CRPS) [65] summed across time series, denoted by CRPS_sum.

**CRPS 정의**:
$$
\text{CRPS}(F, x) = \int_{\mathbb{R}} (F(z) - \mathbb{1}_{\{x \leq z\}})^2 dz
$$

paper:
> As argued in de Bézenac et al. [23], CRPS_sum is a proper scoring rule [35] and can be computed without analytical forecast distributions. We compute the metrics in a rolling fashion and use 100 samples for the distributional forecasts, similar to the aforementioned work.

- **Proper scoring rule**: 진실된 분포가 best score 받는 metric.
- **Rolling**: window 이동하며 평가.
- **100 samples**: distributional forecast 100개 sample 로 empirical CDF.

### Baselines (11 모델)

paper p.7:
> We benchmark our models against various baselines, including (1) VES [43], an innovation state space model; (2) VAR-Lasso and VAR [61], two multivariate linear autoregressive models with and without Lasso regularization; (3) GARCH [84], a multivariate conditional heteroskedastic model; (4) DeepAR [76], an autoregressive recurrent neural network; LSTM-Copula and GP-Copula [75], two RNN-based models that use Gaussian copula to model nonlinearity; (5) KVAE [51], a variational approach based on linear dynamics; (6) NKF [23], a normalizing-flow model coupled with Kalman filters; (7) Transformer [72], a transformer-based model based on masked autoregressive flow; and (8) TimeGrad [73], a recent autoregressive approach that uses a diffusion model.

| # | Baseline | 분류 | 출처 |
|---|---------|------|------|
| 1 | VES | Classical SSM | Hyndman [43] |
| 2 | VAR | Linear autoregressive | [61] |
| 3 | VAR-Lasso | Linear + regularization | [61] |
| 4 | GARCH | Conditional heteroskedastic | [84] |
| 5 | DeepAR | RNN autoregressive | Salinas [76] |
| 6 | LSTM-Copula | RNN + copula | Salinas [75] |
| 7 | GP-Copula | RNN + copula | Salinas [75] |
| 8 | KVAE | Linear SSM + VAE | Fraccaro [51] |
| 9 | NKF | Normalizing flow + Kalman | de Bézenac [23] |
| 10 | Transformer-MAF | Transformer + MAF | Rasul [72] |
| 11 | TimeGrad | Diffusion model | Rasul [73] |

---

### Implementation Details

paper p.7:
> We use 8-head attentions and 2-layers MLPs to parametrize the generative and inference models. The stochastic latent variables $z_t$ are 16-dimensional while the hidden representations $w_t$ are in $\mathbb{R}^{128}$.

| Param | Value |
|-------|-------|
| Attention heads | 8 |
| MLP layers | 2 |
| $z_t$ dimension | 16 |
| $w_t$ dimension | 128 |

paper:
> Our probabilistic transformers for SOLAR and ELECTRICITY have one stochastic layer while those for the other datasets of higher dimensional observations employ two layers.

| Dataset | Layers (L) |
|---------|-----------|
| Solar | 1 |
| Electricity | 1 |
| Traffic | 2 |
| Taxi | 2 |
| Wikipedia | 2 |

→ 고차원 datasets (Traffic 963, Taxi 1214, Wikipedia 2000) 은 L=2.

---

## 5.2 Human Motion Prediction

### Datasets (2종)

paper p.8:
> Following the experiment setup in [97], we evaluation our models on two public motion capture datasets: Human3.6M [44] and HumanEva-I [78]. While Human3.6 is a large-scale dataset with 3.6 million video frames recorded at 50Hz, HumanEva-I is smaller with only 3 subjects and recorded at 60Hz.

| Dataset | 크기 | Frame rate | Skeleton | Setting |
|---------|------|-----------|----------|---------|
| **Human3.6M** | 3.6M frames | 50Hz | 17-joint | 0.5s context → 2s predict |
| **HumanEva-I** | 3 subjects | 60Hz | 15-joint | 0.25s context → 1s predict |

paper:
> We follow the preprocessing steps of previous work [64, 97] and obtain a 17-joint skeleton for Human3.6 and a 15-joint skeleton for HumanEva-I. As in [97], we predict future motion for 2 seconds conditioning on observed motion of 0.5 seconds and 1 second conditioning on 0.25 seconds for Human3.6 and HumanEva-I, respectively.

### Metrics — ADE / FDE

paper p.8:
> Following previous work on trajectory forecasting [2, 37], we adopt two popular metrics, namely, average displacement error (ADE) and final displacement error (FDE).

| Metric | 정의 |
|--------|------|
| **ADE** | Average L2 distance over all time steps between ground truth and closest sample |
| **FDE** | L2 distance for **final** pose only |

**Lower = better** (둘 다).

### Baselines (9 모델)

paper p.8:
> We compare our models against 9 models, including ERD [32] and acLSTM [56], two deterministic RNN-based approaches; MT-VAE [95] and Pose-Knows [87], two conditional VAE models; HP-GAN [6], a conditional GAN; Best-Many [11], GMVAE [25], DeliGAN [38]. and DSP [98], four approaches optimizing for diversity objectives. The results for these baselines are reported as in [97].

| # | Baseline | 분류 |
|---|---------|------|
| 1 | ERD | Deterministic RNN |
| 2 | acLSTM | Deterministic RNN |
| 3 | MT-VAE | Conditional VAE |
| 4 | Pose-Knows | Conditional VAE |
| 5 | HP-GAN | Conditional GAN |
| 6 | Best-Many | Diversity objective |
| 7 | GMVAE | Diversity objective |
| 8 | DeliGAN | Diversity objective |
| 9 | DSP | Diversity objective |
| (+) | DLow | (보고된 baseline) [97] |

### Motion-specific implementation

paper p.8:
> Similar to the previous experiments, we use 8-head attentions and 2-layers MLPs. Since Human3.6M is significantly more complex and multi-modal than the time series forecasting datasets, we make use of 3 stochastic layers, as opposed to 2 layers for HumanEva-I.

| Dataset | Layers (L) |
|---------|-----------|
| Human3.6M | **3** |
| HumanEva-I | 2 |

paper:
> For Human3.6M, the context and target observations are significantly longer and set up for long-term predictions, so we only infer latent variables for target observations.

→ Human3.6M 은 매우 긴 sequence — **target only inference** (Section 3.1 의 alternative mode).

---

## 다음

[11_forecasting_results.md](11_forecasting_results.md) 에서 Table 1 + Fig 2 + Table 2 ablation.
