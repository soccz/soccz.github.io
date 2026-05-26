# 03 Motivation — Section 1 (Introduction)

> **🧒 한 줄 요약**: Probabilistic forecasting의 한계. Diffusion model의 TS 적용.


paper p.1. 시계열 forecasting 의 학계 역사 + 본 paper 의 답.

---

## 3.1 챕터 한 줄 요약

> **"고전 통계 (Hyndman-Athanasopoulos 2018) → DL forecasting (Benidis 2020) → multivariate (Tsay 2014) → tractable distribution (autoregressive, normalizing flow) vs general distribution (EBM). 본 paper: autoregressive + EBM = TimeGrad, multivariate probabilistic forecasting + diffusion 의 첫 결합."**

---

## 3.2 학계 역사 — 4 단계

paper p.1 본문:
> "Classical time series forecasting methods such as those in (Hyndman & Athanasopoulos, 2018) typically provide univariate point forecasts, require hand-tuned features to model seasonality, and are trained individually on each time series."

### 1980-2000년대 — 고전 통계

**Hyndman-Athanasopoulos (2018) "Forecasting: Principles and Practice"** — 시계열 분석의 표준 textbook.
- **Univariate point forecasts**: 한 시계열 한 값 예측.
- **Hand-tuned features**: 학자가 seasonality / trend 수동 모델링.
- **Per-series training**: 각 시계열 마다 별도 모델 (글로벌 학습 X).

**일상 비유**: 학생 30명의 시험 점수 예측 시, **각 학생 마다 별도 모델** + **수능 시즌 같은 패턴 수동 입력**.

### 2010년대 후반 — Deep Learning 시계열

paper:
> "Deep learning based time series models (Benidis et al., 2020) are popular alternatives due to their end-to-end training of a global model, ease of incorporating exogenous covariates, and automatic feature extraction abilities."

**Benidis et al. (2020) "Neural Forecasting"** — DL 시계열의 표준 review.
- **End-to-end + global model**: 모든 시계열 한 모델로 학습. 학습 데이터 풍부.
- **Exogenous covariates**: macro 변수 등 외생 변수 자동 통합.
- **Automatic feature extraction**: 신경망이 학습.

**DeepAR** (Salinas 2019b) 가 대표 — univariate probabilistic forecasting RNN.

### Multivariate 필요성

paper:
> "The task of modeling uncertainties is of vital importance for downstream problems that use these forecasts for (business) decision making. More often the individual time series for a problem data set are statistically dependent on each other. Ideally, deep learning models need to incorporate this inductive bias in the form of multivariate (Tsay, 2014) probabilistic methods to provide accurate forecasts."

**Tsay (2014) "Multivariate Time Series Analysis"** — multivariate 시계열의 표준 textbook.
- **Statistical dependence**: 시계열들이 서로 상관.
- **Inductive bias**: multivariate 구조를 모델에 명시적 도입.

→ 본 paper 의 출발점.

---

## 3.3 두 가지 길 — Tractable vs General

paper:
> "To model the full predictive distribution, methods typically resort to tractable distribution classes or some type of low-rank approximations, regardless of the true data distribution. To model the distribution in a general fashion, one needs probabilistic methods with tractable likelihoods. Till now several deep learning methods have been proposed for this purpose such as autoregressive (van den Oord et al., 2016c) or generative ones based on normalizing flows (Papamakarios et al., 2019) which can learn flexible models of high dimensional multivariate time series."

### 길 1 — Tractable distribution (한계)

| 방법 | 예시 | 한계 |
|------|------|------|
| **Parametric Gaussian** | DeepAR | Gaussian 가정 — multi-modal 불가 |
| **Low-rank Gaussian Copula** | GP-Copula (Salinas 2019a) | Low-rank 제약 |
| **Autoregressive** | PixelCNN, WaveNet | Tractable likelihood 위해 specific architecture 제약 |
| **Normalizing Flow** | Transformer-MAF (Rasul 2021) | Jacobian determinant 제약 (invertible NN) |

paper 본문 (Eq 부재):
> "Even if the full likelihood is not tractable, one can often optimize a tractable lower bound to the likelihood. But still, these methods require a certain structure in the functional approximators, for example on the determinant of the Jacobian (Dinh et al., 2017) for normalizing flows."

→ **Normalizing flow 의 Jacobian 제약**이 모델 자유도 제한.

### 길 2 — General distribution (EBM)

paper:
> "Energy-based models (EBM) (Hinton, 2002) (LeCun et al., 2006) on the other hand have a much less restrictive functional form. They approximate the unnormalized log-probability so that density estimation reduces to a non-linear regression problem. EBMs have been shown to perform well in learning high dimensional data distributions at the cost of being difficult to train (Song & Kingma, 2021)."

**EBM 의 장점**:
- **Functional form 자유** — $E_\theta(x)$ 가 임의 신경망.
- **Unnormalized log-probability** — density estimation = nonlinear regression.

**EBM 의 단점**:
- **Difficult to train** — Normalizing constant $Z(\theta) = \int e^{-E} dx$ intractable.
- **MCMC sampling 필요** — 학습 + inference 비용 ↑.

---

## 3.4 본 paper 의 답 — Autoregressive EBM

paper p.1:
> "In this work, we propose autoregressive EBMs to solve the multivariate probabilistic time series forecasting problem via a model we call TimeGrad and show that not only are we able to train such a model with all the inductive biases of probabilistic time series forecasting, but this model performs exceptionally well when compared to other modern methods."

### TimeGrad 의 4 element

1. **Autoregressive** (RNN): 시계열 history 인코딩.
2. **EBM via DDPM** (Ho 2020): general distribution 학습.
3. **Multivariate**: $D$ 차원 joint distribution.
4. **Probabilistic**: 100 sample → distribution.

### TimeGrad 의 advantage 명시

paper:
> "This autoregressive-EBM combination retains the power of autoregressive models, such as good performance in extrapolation into the future, with the flexibility of EBMs as a general purpose high-dimensional distribution model, while remaining computationally tractable."

**3가지 장점**:
- **Extrapolation power** (autoregressive 의 미덕).
- **General distribution flexibility** (EBM 의 미덕).
- **Computationally tractable** (DDPM 의 simplification 으로).

---

## 3.5 Paper 구조 안내

paper:
> "The paper is organized as follows. In Section 2 we first set up the notation and detail the EBM of (Ho et al., 2020) which forms the basis of our per-time-step distribution model. Section 3 introduces the multivariate probabilistic time series problem and we detail the TimeGrad model. The experiments with extensive results are detailed in Section 4. We cover related work in Section 5 and conclude with some discussion in Section 6."

| paper Section | 본 deep dive 챕터 |
|---------------|------------------|
| Section 2 (DDPM 배경) | [04_diffusion_background.md](04_diffusion_background.md) |
| Section 3 (TimeGrad) | [05_method_a-c.md](05_method_a_problem.md) + [06_algorithms.md](06_algorithms.md) |
| Section 4 (Experiments) | [07_data_baselines.md](07_data_baselines.md) + [08_main_results.md](08_main_results.md) + [09_ablation_viz.md](09_ablation_viz.md) |
| Section 5 (Related Work) | [10_related_work.md](10_related_work.md) |
| Section 6 (Conclusion) | [11_conclusion.md](11_conclusion.md) |

---

## 3.6 본 motivation 의 미학

본 paper 의 design 선택의 **직교성**:
- **Method (autoregressive + diffusion)** → multivariate joint distribution 학습 가능
- **Theory (EBM lineage)** → score matching 의 시계열 적용
- **Empirics (6 datasets SOTA)** → real-world 효과 입증

또한 paper 의 self-honest:
- "Difficult to train (Song & Kingma 2021)" — EBM 의 한계 명시.
- "Foundation for future research" — Section 6 가 sampling 부담 (N=100 loop) 명시.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **고전 통계 (Hyndman 2018) vs DL forecasting (Benidis 2020) 의 3가지 핵심 차이는?**
2. **Normalizing flow 의 한계와 EBM 이 그것을 어떻게 해결하는가?**
3. **TimeGrad 의 "autoregressive + EBM" 결합이 retain 하는 두 가지 미덕은?**

### 답변

1. (a) **Univariate vs global**: 고전은 각 series 별도 모델, DL 은 모든 series 한 글로벌 모델 — 학습 데이터 풍부. (b) **Hand-tuned vs automatic features**: 고전은 학자가 seasonality 수동 모델링, DL 은 신경망 자동 학습. (c) **Point vs probabilistic**: 고전은 한 값, DL (DeepAR 등) 은 분포 출력 가능.
2. **Normalizing flow 한계**: invertible NN + Jacobian determinant 제약 → 모델 자유도 제한. 특정 architecture (RealNVP, MAF) 만 가능. **EBM 의 답**: $E_\theta(x)$ 가 임의 신경망 — functional form 완전 자유. 단점은 normalizing constant $Z$ intractable, but DDPM 이 variational bound 로 회피.
3. (a) **Autoregressive 의 extrapolation power**: 시계열 history 를 명시적 모델링 → long-horizon 예측 안정. (b) **EBM 의 flexibility**: high-dimensional general distribution 학습 가능. Vec-LSTM (low-rank Gaussian) 의 covariance 제약 없음.

---

## 인터랙티브 — Motivation 의 결과 증거

```viz:tg-crps-comparison:title=Motivation 의 실증 근거 — Table 2 (6 datasets, 11 models),caption=paper 의 motivation ("multivariate + probabilistic + flexible") 이 실제 결과로 입증됨. dataset 별 11 model bar 비교. TimeGrad 가 5/6 dataset SOTA. Trans-MAF (Normalizing Flow) / GP-Copula (Low-rank Gaussian) 대비 우월. → motivation 의 정당화.
```

```viz:tg-crps-vs-d:title=Motivation — D 의 250× 변화에 robust,caption=Models 셀렉터로 TimeGrad / Trans-MAF / GP-Copula 표시 전환. log-log scale 로 CRPS vs D scatter. TimeGrad 가 6 datasets 전체 (D=8 to D=2000) 에서 다른 모델 능가 또는 동등. → high-dimensional multivariate 의 EBM 우월성 입증.
```

---

다음 [04_diffusion_background.md](04_diffusion_background.md) — Section 2 의 DDPM (Ho 2020) 배경.
