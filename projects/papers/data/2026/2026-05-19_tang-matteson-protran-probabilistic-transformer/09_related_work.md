# 09. 관련 연구 — Section 4 풀이 + 시계열 deep learning 전체 lineage

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 학문적 lineage
- SSM literature (Linderman 2017, Krishnan 2017) + Transformer literature
- DeepAR, TFT, MQRNN 과의 비교

---

paper p.6 (Section 4) 의 4 카테고리를 깊이 풀고, 거기서 더 나아가 **시계열 deep learning 의 전체 역사** 속에 ProTran 의 위치를 짚어본다.

이 챕터의 목표: 단순 baseline 목록이 아닌, **각 baseline 이 왜 등장했고 어떤 한계가 ProTran 을 낳았는지** 의 흐름을 이해.

---

## 9.1 paper 가 정리한 4 카테고리

paper Section 4 는 ProTran 의 위치를 4 가지 lineage 로 정리:

1. **Deep State Space Models** (SSM 의 deep 화)
2. **Attentive Recurrent Networks** (Attention 을 가진 시계열)
3. **Time Series Forecasting** (시계열 예측 일반)
4. **Human Motion Prediction** (인간 동작 예측)

각각이 어디서 시작해서 ProTran 으로 어떻게 수렴하는가.

---

## 9.2 카테고리 1 — Deep State Space Models

### 출발점: Linear Dynamical System (LDS, 1960)

**LDS** 는 SSM 의 원조:
- Kalman (1960) 의 filter — 미사일·GPS 추적의 표준.
- Linear transition + Gaussian noise + exact inference.
- 60년간 통계학·신호처리의 backbone.

**한계**: Linear + Markovian. 진짜 세계의 nonlinear 동학 표현 불가.

### Deep SSM 의 두 갈래

LDS 의 한계를 깨려는 시도 = "neural network 를 어딘가에 끼워 넣자".

#### 갈래 1: Linear transition + Neural emission

**철학**: "전이는 LDS 그대로, emission 만 신경망화" — Kalman 의 깔끔함 유지하면서 표현력 ↑.

| 모델 | 출처 | 핵심 |
|------|------|------|
| **KVAE** (Kalman VAE) | Fraccaro 2017 [31, 51] | LDS + Variational Auto-Encoder. Encoder/decoder 가 신경망. Transition 은 linear. |
| **NKF** (Normalizing Kalman Filter) | de Bézenac 2020 [23] | LDS + Normalizing Flow 로 emission. **Table 1 의 baseline**. |
| **Deep State Space Models** | Rangapuram 2018 [71] | Amazon 의 자체 패키지 — DSSM 라이브러리. |
| **Karl et al** | [47] | Deep Variational Bayes Filter. |

**공통 한계**: 여전히 transition 이 Markovian (또는 linear). 장거리 의존성 못 잡음.

#### 갈래 2: RNN transition + Latent

**철학**: "전이를 RNN 으로 만들면 비선형 + 비-Markov 가능" — 표현력 극대화.

| 모델 | 출처 | 핵심 |
|------|------|------|
| **VRNN** (Variational RNN) | Chung 2015 [22] | RNN hidden + latent z at each step. |
| **DKS** (Deep Kalman Smoother) | Krishnan [51] | Backward RNN 으로 smoothing. **Table 1 의 baseline** (KVAE 와 같이 인용). |
| **PlaNet** (DRecCMD) | Hafner 2019 [39] | World model — image observation 의 SSM. |
| **DSSM 변형들** | [3, 8, 30, 77] | 다양한 sequential VAE 모델. |

**공통 한계**: RNN 의 gradient vanishing — 멀리 떨어진 시점 (예: 100 step 전) 사이 의존성 약함.

### ProTran 의 차별

paper 인용 (재구성):
> Our models are similarly non-Markovian, but the dependencies on the past states are done via attention, which allows for easy connections between long-distance time steps. In addition, while most existing deep SSMs represent each time step with a single latent variable, our models include several layers of hierarchical latent variables with tractable inference mechanism.

**두 가지 차별**:
1. **Non-Markovian via attention** (RNN 이 아님) — long-range 직접 연결.
2. **Hierarchical latents** (한 시점 한 잠재가 아니라 $L$ 개 layer).

### 비유 — Deep SSM 의 진화

| 세대 | 도구 | 비유 |
|------|------|------|
| 1세대 (LDS, 1960) | Linear + Kalman | 자전거 — 단순, 안정, but 한계 |
| 2세대 (KVAE, NKF) | Linear + 신경망 emission | 전기 자전거 — 좀 더 표현력 |
| 3세대 (VRNN, DKS, PlaNet) | RNN + 잠재 | 자동차 — 강력하지만 좁은 길에선 약함 (gradient vanishing) |
| **4세대 (ProTran)** | **Attention + 잠재 + Hierarchy** | **드론** — 어디든 직접 닿음 |

---

## 9.3 카테고리 2 — Attentive Recurrent Networks

paper 인용:
> Attention mechanism has also been widely adopted in recent time series work using sequence-to-sequence models [1, 28] or transformer architectures [14, 55, 57, 72, 81, 94].

### Seq2Seq with Attention (RNN 시대의 attention)

**철학**: RNN 의 hidden state 위에 attention 을 추가해 long-range 보완.

| 모델 | 출처 | 핵심 |
|------|------|------|
| **Attentive SSM** | Alaa-van der Schaar 2019 [1] | Disease progression — discrete latent + attention |
| **Multi-horizon ATT** | [28] | Multiple time horizon 동시 예측 |

**ProTran 과의 관계**:
paper 명시:
> Our work, however, can be considered as an extension of the attentive state space model proposed in [1], with discrete latent states replaced by their continuous analogs.

→ ProTran 은 Alaa-van der Schaar 2019 의 **continuous latent 확장**.

### Transformer for Time Series

**철학**: Attention 만으로 (RNN 없이) 시계열 모델링.

| 모델 | 출처 | 핵심 | ProTran 비교 |
|------|------|------|----------|
| **Informer** | Zhou 2021 (NeurIPS) | ProbSparse attention — $O(L \log L)$ 효율 | Latent 없음, point 예측 |
| **Autoformer** | Wu 2021 (NeurIPS) | Auto-Correlation + 분해 inner block | Latent 없음, point 예측 |
| **Transformer-MAF** | Rasul 2021 [72] | Transformer + Masked Autoregressive Flow | **Table 1 의 baseline**. Latent 없음. |
| **Convolutional Transformer** | Li 2019 [55] | Local convolution + attention | Time-series 특화 |
| **Temporal Transformer** | Cao 2020 [14] | 시계열 attention 변형 | Standard Transformer 계열 |

### ProTran 의 차별

paper 인용:
> While our models are equipped with latent variables, these transformer approaches [55, 72] lack inference mechanism and are susceptible to feeding back observation noise into the dynamics model at test time.

**두 가지 차별**:
1. **Latent variables 있음** — probabilistic + uncertainty.
2. **Inference mechanism (변분 추론)** — test time observation noise 누적 회피.

**Observation noise 누적 문제** (paper 가 강조하는 점):
- 표준 Transformer-MAF 는 autoregressive — 매 step 예측을 다시 입력.
- 예측에 noise 가 있으면 그 noise 가 다음 입력 → 누적.
- ProTran 은 latent 공간에서 작업 → noise 누적 없음.

---

## 9.4 카테고리 3 — Time Series Forecasting 일반

paper Section 4.3 가 시계열 예측의 전체 역사 정리.

### 고전 통계 시대 (1970s ~ 2010s)

paper 인용:
> Traditional univariate time series models, such as Box-Jenkins methods [12] and exponential smoothing [43], often assume independence between any collection of time series.

| 모델 | 시기 | 특징 |
|------|------|------|
| **ARIMA** (Box-Jenkins) [12] | 1970s | Univariate, stationary 가정 |
| **Exponential Smoothing** | Hyndman [43] | Univariate, **Table 1 의 VES baseline** |
| **VAR** (Vector AR) | Lutkepohl [82, 61] | Multivariate, linear, **Table 1 의 VAR baseline** |
| **GARCH** | Tsay [84] | 조건부 분산, **Table 1 의 GARCH baseline** |
| **Multivariate GARCH** | Bauwens [7] | 다변량 + 시변 분산 |

**공통 한계**: Stationarity, homoscedasticity, manual covariate selection. **고차원 안 됨** — 수십~수백 변수까지.

### Deep Learning 시대 (2015 ~)

paper 인용:
> Deep learning methods for time series forecasting have recently emerged as an expressive, scalable framework for industrial applications.

#### Point forecasts (점 예측만)

| 모델 | 출처 | 핵심 |
|------|------|------|
| **WaveNet for TS** | [53] | Dilated convolution |
| **N-BEATS** | [70] | Trainable basis functions |
| **TCN** | [96] | Temporal convolutional network |

→ ProTran 의 baseline 은 아니지만 deep learning 시계열의 다른 가지.

#### Probabilistic forecasts (분포 예측)

| 모델 | 출처 | 핵심 | ProTran 비교 |
|------|------|------|----------|
| **DeepAR** | Salinas 2020 [76] | RNN + Gaussian output | **Table 1 baseline**. Autoregressive RNN. |
| **Spline Quantile** | Gasthaus [33] | RNN + quantile spline | Univariate |
| **GP-Copula** | Salinas 2019 [75] | RNN + Gaussian copula | **Table 1 baseline**. Multivariate. |
| **LSTM-Copula** | [75] | LSTM + copula | **Table 1 baseline** |
| **NKF** | de Bézenac 2020 [23] | Normalizing flow + Kalman | **Table 1 baseline**, 강한 경쟁자 |
| **TimeGrad** | Rasul 2021 [73] | **Diffusion model** | **Table 1 baseline**, 가장 강함 |

### ProTran 의 차별

paper 인용:
> In contrast, our models are entirely devoid of such recurrent architectures and rely on latent variables to output distributional forecasts.

**두 가지 차별**:
1. **No RNN at all** — 위 거의 모든 모델이 RNN 사용.
2. **Latent variables 로 분포 출력** — DeepAR/GP-Copula 처럼 head 에서 분포 파라미터 출력하지 않고, latent 의 stochasticity 가 분포 만듬.

### 시계열 예측의 역사 다이어그램

```
1970s ─ ARIMA, Exponential Smoothing (univariate, linear)
         ↓
1980s ─ VAR, GARCH (multivariate, linear)
         ↓
1990s-2000s ─ State Space Models, Kalman filter
         ↓
2010s ─ Deep Learning 진입 (DeepAR, RNN+Copula)
         │
         ├── RNN 기반 (DeepAR, GP-Copula, ...)
         ├── Linear SSM + 신경망 (KVAE, NKF)
         └── Transformer 도입 (Transformer-MAF, Informer)
                │
                ↓
2021 ─ Cambrian explosion (NeurIPS 2021)
       │
       ├── Autoformer — series-wise + 분해
       ├── Informer — sparse attention
       ├── ProTran (이 paper) — SSM + Attention + Latent
       ├── TimeGrad — Diffusion
       └── CSDI — Score-based diffusion
                ↓
2022-2024 ─ Diffusion 시대 (TMDM, Diffusion-TS, ...)
                ↓
2025 ─ Foundation models (Chronos, TimeGPT, ...)
```

ProTran 의 위치: **RNN 시대의 끝 + Probabilistic Transformer 시대의 시작**.

---

## 9.5 카테고리 4 — Human Motion Prediction

paper 인용:
> Despite being almost identical in formulation, human motion prediction has often been studied independently from time series forecasting.

→ 학계가 분리되어 있지만 본질적으로 같은 문제. ProTran 이 통합.

### Deterministic motion generation

| 모델 | 출처 | 한계 |
|------|------|------|
| **ERD** (Encoder-Recurrent-Decoder) | Fragkiadaki [32] | **Table 3 baseline**. 결정론적 RNN. |
| **acLSTM** | Li [56] | **Table 3 baseline**. 결정론적 LSTM. |
| **(기타)** | [13, 34] | Variants |

**한계**: Deterministic. 사람의 multiple plausible futures 표현 불가.

### Probabilistic motion (HMM/GP)

| 모델 | 출처 | 한계 |
|------|------|------|
| **HMM-based** | [93] | Discrete latent, limited expressiveness |
| **Gaussian Processes** | [89] | Computational cost, kernel design 어려움 |

### Conditional VAE for motion

paper 가 가장 비교하는 부류.

| 모델 | 출처 | Global vs Time-dependent | ProTran 비교 |
|------|------|---------------------|----------|
| **MT-VAE** | Yan [95] | Global latent | **Table 3 baseline** |
| **DLow** (Diversifying Latent Flows) | Yuan-Kitani 2020 [97] | Global latent + diversity selection | **Table 3 가장 강한 경쟁자** |
| **Pose-Knows** | Walker [87] | Conditional VAE | **Table 3 baseline** |
| **HP-GAN** | Barsoum 2018 [6] | Conditional GAN | **Table 3 baseline** |
| **Best-Many** | Bhattacharyya [11] | Diversity loss | **Table 3 baseline** |
| **GMVAE** | Dilokthanakul [25] | Gaussian mixture VAE | **Table 3 baseline** |
| **DeliGAN** | Gurumurthy [38] | Mixture of Gaussians GAN | **Table 3 baseline** |
| **DSP** | Yuan [98] | Diverse sample population | **Table 3 baseline** |

### ProTran 의 차별

paper 인용:
> In contrast to earlier work [95, 97] that employ a global latent variable across different time steps via conditional VAE [49], we leverage the principled framework of state space models for learning and inference of hierarchical, time-dependent latent variables.

**두 가지 차별**:
1. **Time-dependent latent** (Global 이 아님) — 매 시점 다른 $z_t$.
2. **Hierarchical latents** — 깊은 추상화 가능.

### Global vs Time-dependent latent 의 의미

**Global latent** (MT-VAE, DLow):
- 전체 sequence 에 단 한 개 잠재 $z$.
- "이 sequence 의 스타일은 무엇인가" 같은 한 줄 요약.
- 시점별 dynamics 표현 어려움.

**Time-dependent latent** (ProTran):
- 매 시점 $t$ 마다 다른 $z_t$.
- 시간에 따른 dynamics 자연스러움.
- 더 풍부한 표현력.

비유 (영화):
- Global = "이 영화는 액션이다" (한 라벨).
- Time-dependent = "씬 1 은 추격, 씬 2 는 폭발, 씬 3 은 대화" (각 씬마다 다른 상태).

---

## 9.6 ProTran 의 lineage 통합 — 4 카테고리의 수렴

```
                  ┌──────────────────────────────┐
                  │  ProTran (Tang-Matteson 2021)│
                  │                              │
                  │  SSM ∩ Transformer ∩ VAE     │
                  │  ∩ Hierarchical Latents      │
                  └─────────────┬────────────────┘
                                │
        ┌───────────────────────┴──────────────────────┐
        │                                              │
   [1. Deep SSM]    [2. Attentive Networks]    [3. TS Forecasting]    [4. Motion]
        │                                              │
   LDS → KVAE       Alaa-van der Schaar          ARIMA → DeepAR        Deterministic
        → DKS       → ProTran (continuous z)      → TimeGrad           → MT-VAE
        → ProTran   Transformer-MAF                                     → DLow
                                                  → ProTran            → ProTran
   (Attention      (Inference mechanism)         (No RNN +              (Time-dep +
    via latent)                                   latent)                hierarchy)
```

각 카테고리의 한계를 **하나의 framework** 가 동시에 해결.

---

## 9.7 빠진 비교 — paper 가 직접 명시 안 한 동시기 연구

paper 가 publish 된 NeurIPS 2021 의 다른 시계열 paper 들:

### Autoformer (Wu et al. 2021)
- 분해 (trend-seasonal) 를 inner block 으로.
- Auto-Correlation (FFT 기반).
- Point forecast.
- ProTran 과의 관계: 다른 axis 의 contribution (representation vs probabilistic).

### Informer (Zhou et al. 2021)
- ProbSparse attention — $O(L \log L)$.
- Distillation 으로 long sequence 처리.
- Point forecast.
- ProTran 과의 관계: efficiency 축 vs latent 축.

### TimeGrad (Rasul et al. 2021)
- Diffusion model 시계열에 첫 도입.
- Probabilistic.
- ProTran 과의 관계: 같은 probabilistic 분야의 다른 접근 (latent VAE vs diffusion).

### CSDI (Tashiro et al. 2021)
- Conditional score-based diffusion (CSDI).
- Imputation + Forecasting.
- ProTran 과의 관계: probabilistic + score-based.

→ **2021 = 시계열 deep learning 의 Cambrian explosion** 의 해.

---

## 9.8 paper Section 4 가 시사하는 더 깊은 통찰

### 통찰 1: "거의 같은 문제를 다른 학계가 따로 푼다"

- 시계열 (Section 4.3) 과 인간 동작 (Section 4.4) 이 **본질적으로 같은 conditional prediction**.
- 그러나 학계는 분리 (통계 vs 컴퓨터비전).
- ProTran 이 둘을 통합한 **첫 paper 중 하나**.

→ 분야 경계를 넘는 시각이 새로운 기여를 만든다.

### 통찰 2: "Attention 의 보편성"

- NLP 에서 시작한 attention 이 시계열 (Section 4.2) + 동작 (Section 4.4) + SSM (Section 4.1) 모두에 적용.
- ProTran 이 attention 의 **시계열 잠재 변수 적용** 의 첫 본격적 시도.

→ 새로운 도구 (attention) 가 여러 분야에 같은 방식으로 transfer.

### 통찰 3: "VAE 정신의 transfer"

- 이미지의 hierarchical VAE (VDVAE, NVAE) 가 시계열로 transfer.
- 같은 정신: "잠재를 여러 layer 로 쌓아 capacity 확장".

→ 분야 간 architectural pattern 의 이동.

### 통찰 4: "RNN 거부의 일반화"

- 같은 NeurIPS 2021 에 Autoformer, Informer, ProTran, TimeGrad 모두 RNN 거부.
- "시계열 = RNN" 이라는 통념이 무너진 해.

→ 한 분야의 paradigm shift 는 동시에 여러 paper 에서 발생.

---

## 9.9 자기점검 (이 챕터)

### 핵심 4가지
1. **Deep SSM 의 두 갈래는?**
2. **ProTran 이 표준 Transformer 시계열 모델 (Informer, Transformer-MAF) 과 다른 점은?**
3. **Global latent (MT-VAE) 와 time-dependent latent (ProTran) 의 차이를 비유로?**
4. **왜 2021 년이 시계열 deep learning 의 Cambrian explosion 의 해인가?**

### 답변
1. (a) **Linear transition + neural emission** (KVAE, NKF) — Kalman 의 깔끔함 유지, emission 만 풍부. 한계: 여전히 Markov. (b) **RNN transition + latent** (VRNN, DKS) — 비선형 + 비-Markov 가능. 한계: RNN 의 gradient vanishing.
2. (a) Latent variables 있음 — probabilistic + uncertainty. (b) Inference mechanism 있음 (variational) — test time 의 observation noise 누적 회피. Informer/Transformer-MAF 는 둘 다 없음.
3. Global = "이 영화는 액션이다" (한 라벨로 sequence 전체 요약). Time-dependent = "씬 1 추격, 씬 2 폭발, 씬 3 대화" (각 시점 다른 잠재 상태). 후자가 dynamics 표현에 훨씬 풍부.
4. NeurIPS 2021 에 Autoformer (분해), Informer (sparse), ProTran (latent), TimeGrad (diffusion), CSDI (score-based) 모두 동시 publish. 각자 다른 axis 의 contribution. 모두 RNN 거부. → 시계열 deep learning 의 paradigm shift 가 한 해에 응축.

다음 [10_data_baselines.md](10_data_baselines.md) 에서 실험 셋업의 자세한 풀이.
