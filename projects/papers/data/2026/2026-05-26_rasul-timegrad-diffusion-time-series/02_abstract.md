# 02 Abstract 풀어 읽기

## 제목: "Autoregressive Denoising Diffusion Models for Multivariate Probabilistic Time Series Forecasting"

한국어로 풀면: **"다변량 확률적 시계열 예측을 위한 자기회귀 노이즈 제거 확산 모델"**

### 단어별 풀이

| 영어 | 뜻 | 풀어 설명 |
|------|----|---------|
| Autoregressive | 자기회귀 | 한 시점의 예측이 이전 시점들에 의존 (RNN 처럼 순차적) |
| Denoising | 노이즈 제거 | 노이즈 추가된 데이터 → 깨끗한 데이터 복원 학습 |
| Diffusion Models | 확산 모델 | DDPM 류 — noise 점진 추가/제거의 Markov chain |
| Multivariate | 다변량 | 한 시점에 $D$ 차원 vector ($D = $ Wikipedia 2,000 까지) |
| Probabilistic | 확률적 | 분포 출력 (point prediction 아님) |
| Time Series Forecasting | 시계열 예측 | 과거 → 미래 추정 |

→ "**자기회귀 (시점별 순차) + diffusion (noise 제거 학습) = 다변량 확률 시계열 예측 모델**".

### 저자 정보

| 저자 | 소속 | 역할 |
|------|------|------|
| **Kashif Rasul** | Zalando Research, Berlin | 1저자 + corresponding (kashif.rasul@zalando.de) |
| **Calvin Seward** | Zalando Research, Berlin | 공저자 |
| **Ingmar Schuster** | Zalando Research, Berlin | 공저자 |
| **Roland Vollgraf** | Zalando Research, Berlin | 공저자 |

**중요**: Zalando Research = 독일 패션 e-commerce 회사 의 ML 연구팀. 같은 그룹의 후속 paper:
- **Transformer-MAF** (Rasul et al. 2021, ICLR) — Transformer + Masked Autoregressive Flow. Table 2 의 가장 강한 경쟁자.
- TimeGrad 가 Transformer-MAF 후속 — flow 대신 diffusion.

---

## 영어 원문 (ICML 2021, p.1)

> In this work, we propose TimeGrad, an autoregressive model for multivariate probabilistic time series forecasting which samples from the data distribution at each time step by estimating its gradient. To this end, we use diffusion probabilistic models, a class of latent variable models closely connected to score matching and energy-based methods. Our model learns gradients by optimizing a variational bound on the data likelihood and at inference time converts white noise into a sample of the distribution of interest through a Markov chain using Langevin sampling. We demonstrate experimentally that the proposed autoregressive denoising diffusion model is the new state-of-the-art multivariate probabilistic forecasting method on real-world data sets with thousands of correlated dimensions. We hope that this method is a useful tool for practitioners and lays the foundation for future research in this area.

(총 5 문장)

---

## 한국어 직역

> 본 연구에서 TimeGrad 를 제안 — 매 시점에 데이터 분포의 gradient 를 추정하여 sampling 하는 다변량 확률적 시계열 예측의 자기회귀 모델. 이를 위해 diffusion probabilistic model (score matching + energy-based method 와 밀접한 latent variable model class) 사용. 본 모델은 data likelihood 의 variational bound 최적화로 gradient 학습 + inference 시 Langevin sampling 으로 white noise → 관심 분포의 sample 변환. 광범위 실증에서 본 autoregressive denoising diffusion model 이 수천 correlated dimensions 의 real-world dataset 에서 multivariate probabilistic forecasting 의 SOTA 임을 입증. 실무자에게 유용 + 이 분야 미래 연구의 토대가 되길 희망.

---

## 한 문장씩 풀이

### 문장 1: 본 paper 의 한 줄 설명
> In this work, we propose TimeGrad, an autoregressive model for multivariate probabilistic time series forecasting which samples from the data distribution at each time step by estimating its gradient.

**핵심 키워드 5개**:
- **TimeGrad** = 모델 이름. "Time" + "Grad" (gradient — Langevin 의 score function).
- **Autoregressive**: 각 시점이 이전 시점에 의존 (RNN).
- **Multivariate**: $D$ 차원 vector.
- **Probabilistic**: 분포 출력.
- **Estimating its gradient**: score function $\nabla \log p(x)$ 추정 — diffusion / EBM 의 표준.

### 문장 2: Diffusion 의 이론적 위치
> To this end, we use diffusion probabilistic models, a class of latent variable models closely connected to score matching and energy-based methods.

- **Diffusion probabilistic models**: Sohl-Dickstein 2015, Ho 2020 의 DDPM.
- **Latent variable models**: $x^0$ (data) + $x^{1:N}$ (latent variables, noise levels).
- **Score matching**: Hyvärinen 2005, Song-Ermon 2019. $\nabla \log p$ 학습.
- **Energy-based methods**: $p \propto e^{-E}$ — EBM.

→ DDPM = score matching + EBM 의 변형. 본 paper 가 이 lineage 시계열로 확장.

### 문장 3: 학습 + Inference
> Our model learns gradients by optimizing a variational bound on the data likelihood and at inference time converts white noise into a sample of the distribution of interest through a Markov chain using Langevin sampling.

**학습**: $\nabla \log p$ 학습 = $\epsilon_\theta$ (noise prediction) 학습 (paper Eq 7). Variational bound = ELBO 의 simplified form.

**Inference**: Markov chain reverse process.
- Step 0: white noise $x^N \sim \mathcal{N}(0, \mathbf{I})$.
- Step 1-N: Langevin → $x^{n-1} = \frac{1}{\sqrt{\alpha_n}}(x^n - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}}\epsilon_\theta) + \sqrt{\Sigma_\theta}\mathbf{z}$.
- Final: $x^0$ — 진짜 같은 sample.

### 문장 4: 결과
> We demonstrate experimentally that the proposed autoregressive denoising diffusion model is the new state-of-the-art multivariate probabilistic forecasting method on real-world data sets with thousands of correlated dimensions.

- **6 datasets**: Exchange (8) / Solar (137) / Electricity (370) / Traffic (963) / Taxi (1,214) / Wikipedia (2,000).
- **"Thousands of correlated dimensions"**: Wikipedia 2,000.
- **SOTA**: 6/6 중 5개에서 best (Table 2). Exchange 만 VAR/VES/Transformer-MAF 와 tie at 0.005-0.006.

### 문장 5: Future research foundation
> We hope that this method is a useful tool for practitioners and lays the foundation for future research in this area.

**Foundation** 의 실현:
- CSDI (Tashiro 2021) — conditional score-based imputation.
- TMDM (Li 2024) — Transformer-modulated diffusion.
- Diffusion-TS (Yuan 2024) — full diffusion for time series.

→ TimeGrad 가 **diffusion 시계열 분야의 출발점**.

---

## 한 문단으로 요약

TimeGrad = **autoregressive RNN + DDPM (Ho 2020) diffusion**. RNN 이 시계열 history 인코딩 → hidden state $h_{t-1}$ + Diffusion model 이 $h_{t-1}$ 조건으로 다음 시점 $x^0_t \in \mathbb{R}^D$ 분포 학습. 학습 = noise prediction MSE. Sampling = N=100 step Langevin. 6 datasets 중 5개 SOTA. Probabilistic time series forecasting + diffusion 의 첫 본격 결합.

---

## 한 그림으로 보는 TimeGrad vs 다른 baseline

```
       [DeepAR (Salinas 2019b)]
        univariate + Gaussian
              │
              │ "multivariate 확장"
              ↓
       [GP-Copula (Salinas 2019a)]
        multivariate + low-rank Gaussian
              │
              │ "Gaussian 한계"
              ↓
       [Transformer-MAF (Rasul 2021)]
        Transformer + Normalizing Flow
              │
              │ "Flow 의 functional 제약"
              ↓
       [TimeGrad (이 paper, 2021)]
        RNN + Diffusion (DDPM)
              ↓
        6/6 SOTA (5/6 outright + Exchange tie)
              │
              ↓
       [후속 — CSDI, TMDM, Diffusion-TS]
```

---

## 다른 deep dive 와의 관계

| 측면 | Autoformer (2021) | ProTran (2021) | QuantileFormer (2025) | **TimeGrad (이 paper, 2021)** |
|------|-------------------|----------------|--------------------|--------------------------|
| Backbone | Transformer + Auto-Correlation | Transformer + SSM | Transformer + VAE | **RNN + Diffusion** |
| Output | Point | Probability sample (latent) | Multi-quantile | **Probability sample (denoising)** |
| Decomposition | Trend-Seasonal | × | Quantile-aware | × |
| Multivariate | ✓ | ✓ | ✓ | ✓ |
| Probabilistic | × | ✓ | ✓ | ✓ |
| 발표 | NeurIPS 2021 | NeurIPS 2021 | IJCAI 2025 | **ICML 2021** |

→ TimeGrad 가 같은 NeurIPS/ICML 2021 시기의 **probabilistic 시계열 forecasting Cambrian explosion** 중 가장 영향력 큰 paper 중 하나. ProTran 의 Table 1 baseline 으로 등장 (ProTran 이 일부 dataset 에서 TimeGrad 능가했지만, TimeGrad 가 diffusion 시계열 분야 개척).

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **본 paper 의 5 문장 Abstract 가 명시한 핵심 contribution 3가지는?**
2. **"Multivariate probabilistic forecasting" 의 두 단어가 각각 무엇을 도전적으로 만드는가?**
3. **TimeGrad 가 "future research foundation" 으로 실현된 후속 paper 3개는?**

### 답변

1. (i) 문장 1: **autoregressive RNN + diffusion** 결합 모델 — 매 시점 gradient 추정으로 sampling. (ii) 문장 2-3: **DDPM 의 score matching + variational bound** 학습 + **Langevin sampling** inference. (iii) 문장 4: **6 datasets 중 5개 SOTA** — multivariate probabilistic forecasting 의 새 표준.
2. **Multivariate**: $D$ 차원 joint distribution → $D=2000$ (Wikipedia) 차원에서 series 간 cross-correlation 학습 어려움. Full covariance Gaussian 은 $D^2 = 4M$ 파라미터. Vec-LSTM (low-rank Gaussian) 같은 우회 필요. **Probabilistic**: distribution 출력 → point prediction 보다 학습 복잡. CRPS 같은 proper scoring rule 평가 필요.
3. (a) **CSDI** (Tashiro 2021) — conditional score-based diffusion imputation. (b) **TMDM** (Li 2024) — transformer-modulated diffusion. (c) **Diffusion-TS** (Yuan 2024) — full diffusion for time series. 모두 TimeGrad 의 RNN + diffusion 정신의 변형.
