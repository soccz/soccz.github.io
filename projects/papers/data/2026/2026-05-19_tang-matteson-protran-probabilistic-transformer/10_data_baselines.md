# 10. 데이터셋 + Baseline + 평가 지표 — Section 5 시작

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 5 datasets — Solar, Electricity, Traffic, Taxi, Wikipedia
- 11 baselines (RNN, SSM, Transformer 계열)
- 평가 metric — CRPS (Continuous Ranked Probability Score)

---

paper p.6-7 (Section 5 의 두 task 셋업). **Table 1, Table 3 을 읽기 전에 알아야 할 사전 정보**.

이 챕터의 목표: **각 dataset 이 어떤 데이터이고, 왜 그 baseline 들과 비교하고, 평가 지표가 정확히 무엇을 측정하는지** 깊이 풀어 쓴다.

---

## 10.1 두 task — 같은 framework 의 두 응용

### 원문 (paper p.6)
> We present our experiment results on two tasks, namely, time series forecasting and human motion prediction. These tasks are often studied independently, despite being almost identical as conditional prediction problems.

### 풀어 설명

paper 의 핵심 주장: **두 task 가 사실 같은 문제** — 다만 학계가 나눠서 연구해 왔을 뿐.

| 측면 | Time Series Forecasting | Human Motion Prediction |
|------|-----------------------|----------------------|
| Context | 지난 시점들의 관측 (트래픽, 전력 등) | 0.25s ~ 0.5s 의 동작 |
| Target | 미래 시점들의 관측 | 1s ~ 2s 의 미래 동작 |
| 출력 차원 | 100~2000 변수 | 51 (17 관절 × 3D) |
| Metric | CRPS_sum | ADE / FDE |
| 학계 | 통계학/머신러닝 | 컴퓨터비전/그래픽스 |

→ ProTran 이 둘 다 SOTA 라는 것이 "task-agnostic framework" 의 강력한 증명.

---

## 10.2 시계열 Forecasting — 5 datasets

### 원문 (paper p.7)
> Following the experiment setup in [72, 73, 75], we evaluate our models and multiple competitive baselines on five popular public datasets: SOLAR, ELECTRICITY, TRAFFIC, TAXI, and WIKIPEDIA. The data is recorded with hourly or daily frequency and shows seasonal patterns of different frequencies.

### Dataset 하나씩 풀어보기

#### ① Solar (137 시리즈, hourly)

**무엇**: 미국 137개 태양광 발전소의 매시간 발전량.

**왜 어려운가**:
- 시간대 의존성 큼 (낮 ↔ 밤).
- 날씨 영향 — 구름·계절.
- 발전소 위치별 다른 위도 → 다른 일조 패턴.

**어떻게 보면 좋나**:
- "1주일치 데이터 (24×7=168 시점) 본 후 다음 24시간 예측" 같은 셋업.

#### ② Electricity (370 시리즈, hourly)

**무엇**: 포르투갈 370 가구의 매시간 전력 사용량 (UCI repository).

**왜 어려운가**:
- 가구별 다른 패턴 (출근/재택, 가족 구성).
- 평일/주말 차이.
- 계절 (에어컨/난방).

**의의**: 시계열 forecasting 의 가장 표준적 벤치마크. DeepAR, GP-Copula, TimeGrad 모두 이걸로 평가.

#### ③ Traffic (963 시리즈, hourly)

**무엇**: San Francisco Bay Area freeway 의 963개 sensor 의 매시간 차량 수.

**왜 어려운가**:
- 가장 고차원 (963 변수 동시).
- 도로 사이 공간적 상관 (인접 도로는 비슷).
- 출퇴근 러시아워의 강한 주기성.

#### ④ Taxi (1,214 시리즈, 30분 단위)

**무엇**: New York City 의 1,214개 zone 별 30분 단위 택시 수요.

**왜 어려운가**:
- 매우 고차원 (1,214 변수).
- 30분 단위 → 시간 해상도 높음 → sequence 길어짐.
- 이벤트·날씨 영향.

#### ⑤ Wikipedia (2,000 시리즈, daily)

**무엇**: Wikipedia 2,000개 페이지의 매일 traffic.

**왜 어려운가**:
- 가장 고차원 (2,000 변수).
- 페이지별 매우 다른 패턴 (인기 페이지 vs 마이너).
- Spike 가능 (뉴스 이벤트로 갑작스런 traffic).

### Covariates (보조 정보)

paper:
> As in [72, 73], the covariates include lagged inputs, fixed time embeddings (e.g. day of week, hour of day), and learnable time-series embeddings.

**3 종류 covariates**:
1. **Lagged inputs**: 이전 시점들의 값 (당연한 정보).
2. **Fixed time embeddings**: "이 시점이 월요일이냐 화요일이냐", "오전 9시이냐 밤 11시이냐" — 캘린더 정보.
3. **Learnable time-series embeddings**: 각 시계열에 고유한 학습 가능한 ID 벡터.

→ ProTran 의 입력 $x_t$ 에 이 covariates 가 같이 들어감.

### Normalization

paper:
> The inputs are scaled using the conditioning examples before being fed into the model, and the predictions are rescaled appropriately afterward.

→ Context 부분 (보고 학습한 부분) 의 평균·표준편차로 정규화. 예측 후 다시 원래 스케일로 복원.

---

## 10.3 평가 지표 — CRPS_sum (시계열용)

### CRPS 정의 (paper p.7)

paper:
> Following [23, 72, 75], we evaluate our model and all baselines using continuous ranked probability score (CRPS) [65] summed across time series, denoted by CRPS_sum.

**CRPS** = Continuous Ranked Probability Score.

수식:
$$
\text{CRPS}(F, x) = \int_{\mathbb{R}} (F(z) - \mathbb{1}_{\{x \leq z\}})^2 dz
$$

여기서:
- $F$ = 예측한 분포의 **누적 분포 함수 (CDF)**.
- $x$ = 실제 관측 값.
- $\mathbb{1}_{\{x \leq z\}}$ = "$x \leq z$ 이면 1, 아니면 0" 의 step function.

### 직관적 의미

ASCII 도식으로:

```
   예측 CDF F(z):    1 ───────────.─────────
                       │       ╱╱╱
                       │   ╱╱
                       │ ╱
                     0 ─────────────────── z
                              ↑
                              관측 x
   
   실제 step (x 의 CDF): 1 ──────────.───────
                          │           │
                          │           │
                        0 ────────────┴───── z
                                       x
   
   CRPS = (두 곡선 사이 면적의 제곱)
   → 작을수록 좋음 (예측 분포가 실제와 가까움)
```

**해석**:
- 예측 분포가 $x$ 주변에 잘 모여 있으면 → 두 곡선 차이 작음 → CRPS 작음.
- 예측 분포가 어긋나거나 너무 넓으면 → 두 곡선 차이 큼 → CRPS 큼.

### CRPS_sum 의 sum 의 의미

paper:
> [CRPS] summed across time series, denoted by CRPS_sum.

- 여러 시점 × 여러 시계열 모두에 대해 CRPS 계산 후 합산.
- Multivariate, 다시점 평가의 단일 지표.

paper:
> As argued in de Bézenac et al. [23], CRPS_sum is a proper scoring rule [35] and can be computed without analytical forecast distributions. We compute the metrics in a rolling fashion and use 100 samples for the distributional forecasts, similar to the aforementioned work.

**Proper scoring rule (적격 점수 규칙)**:
- "진짜 분포가 best score 받음" 이 보장된 metric.
- 즉, 모델이 정답 분포를 학습하면 CRPS_sum 이 최소화됨 — 학습 목표로 의미 있음.

**100 samples**: ProTran 은 분포를 직접 출력하지 않음. **100개 sample 을 뽑아서 empirical CDF 추정**.

**Rolling fashion**: window 가 시간 따라 이동하면서 매 시점 새로 평가.

---

## 10.4 시계열 Baselines — 11 모델

### 원문 (paper p.7)

paper 의 baseline 목록:
> We benchmark our models against various baselines, including (1) VES [43], an innovation state space model; (2) VAR-Lasso and VAR [61], two multivariate linear autoregressive models with and without Lasso regularization; (3) GARCH [84], a multivariate conditional heteroskedastic model; (4) DeepAR [76], an autoregressive recurrent neural network; LSTM-Copula and GP-Copula [75], two RNN-based models that use Gaussian copula to model nonlinearity; (5) KVAE [51], a variational approach based on linear dynamics; (6) NKF [23], a normalizing-flow model coupled with Kalman filters; (7) Transformer [72], a transformer-based model based on masked autoregressive flow; and (8) TimeGrad [73], a recent autoregressive approach that uses a diffusion model.

### Baseline 표 — 분류와 의미

| # | Baseline | 분류 | 핵심 아이디어 | 한계 |
|---|---------|------|-------------|------|
| 1 | **VES** | 고전 SSM | Exponential smoothing 의 SSM 버전 | 선형, Markov |
| 2 | **VAR** | 선형 자귀회기 | $x_t = A_1 x_{t-1} + \ldots + A_p x_{t-p} + \epsilon$ | 선형만 |
| 3 | **VAR-Lasso** | 선형 + 정규화 | VAR + L1 penalty | 여전히 선형 |
| 4 | **GARCH** | 조건부 분산 | 분산이 시간 따라 변하는 모델 | 평균은 단순 |
| 5 | **DeepAR** | RNN autoregressive | LSTM 으로 distributional one-step ahead | One-step → 누적 오류 |
| 6 | **LSTM-Copula** | RNN + Copula | LSTM + Gaussian copula 로 multivariate | RNN 한계 |
| 7 | **GP-Copula** | RNN + Copula | LSTM + GP-based copula | 같은 한계 |
| 8 | **KVAE** | Linear SSM + VAE | LDS + neural emission | Linear 전이 |
| 9 | **NKF** | Normalizing flow + Kalman | Flow 로 emission, Kalman filter | 부분적 선형 |
| 10 | **Transformer-MAF** | Transformer + MAF | Masked Autoregressive Flow | No latent variable |
| 11 | **TimeGrad** | Diffusion model | Diffusion process 로 sequence 생성 | 가장 강한 경쟁자 |

### 어떤 부류와 비교하는가

ProTran 의 비교 의미:
- **vs 고전 통계 (VES, VAR, GARCH)**: "딥러닝이 정말 필요한가" 의 sanity check.
- **vs RNN 기반 (DeepAR, LSTM-Copula, GP-Copula)**: "RNN 없이 더 잘 할 수 있는가".
- **vs Linear SSM (KVAE, NKF)**: "동일 SSM 정신에 Transformer 가 더 좋은가".
- **vs Transformer 기반 (Transformer-MAF, TimeGrad)**: "Probabilistic + latent 가 의미 있는가".

특히 **TimeGrad** 가 가장 강한 경쟁자 — 같은 NeurIPS 2021, 같은 분야, 가장 최근 SOTA. ProTran 이 TimeGrad 를 이긴 폭이 핵심 결과.

---

## 10.5 ProTran 의 구현 디테일 (시계열)

### 원문 (paper p.7)
> We use 8-head attentions and 2-layers MLPs to parametrize the generative and inference models. The stochastic latent variables $z_t$ are 16-dimensional while the hidden representations $w_t$ are in $\mathbb{R}^{128}$.

### Hyper-parameters

| Param | Value | 의미 |
|-------|-------|------|
| Attention heads | 8 | 8 개 관점의 multi-head |
| MLP layers | 2 | 각 MLP 가 2 layer |
| $z_t$ dimension | **16** | 잠재가 16차원 (저차원 압축) |
| $w_t$ dimension | **128** | hidden 이 128차원 |

**관찰**: 잠재 $z$ 는 매우 저차원 (16). 모든 정보를 16차원에 압축하도록 강제.

### Dataset 별 layer 수

paper:
> Our probabilistic transformers for SOLAR and ELECTRICITY have one stochastic layer while those for the other datasets of higher dimensional observations employ two layers.

| Dataset | Layers ($L$) | 출력 차원 |
|---------|-----------|---------|
| Solar | 1 | 137 |
| Electricity | 1 | 370 |
| Traffic | 2 | 963 |
| Taxi | 2 | 1,214 |
| Wikipedia | 2 | 2,000 |

→ 고차원 dataset 일수록 $L = 2$. 단순 dataset 은 $L = 1$ 로 충분.

---

## 10.6 인간 동작 예측 — 2 datasets

### 원문 (paper p.8)
> Following the experiment setup in [97], we evaluation our models on two public motion capture datasets: Human3.6M [44] and HumanEva-I [78]. While Human3.6 is a large-scale dataset with 3.6 million video frames recorded at 50Hz, HumanEva-I is smaller with only 3 subjects and recorded at 60Hz.

### Dataset 표

| Dataset | 크기 | Frame rate | Skeleton | Context | Target |
|---------|------|-----------|----------|---------|--------|
| **Human3.6M** | 3.6M frames | 50 Hz | 17-joint | 0.5초 | 2초 |
| **HumanEva-I** | 3 subjects | 60 Hz | 15-joint | 0.25초 | 1초 |

### 셋업 풀이

**Human3.6M**:
- 50 Hz = 1초에 50 frame.
- Context 0.5초 = 25 frame.
- Target 2초 = 100 frame.
- 매 frame 마다 17 joint × 3D = 51차원 벡터.

**HumanEva-I**:
- 60 Hz = 1초에 60 frame.
- Context 0.25초 = 15 frame.
- Target 1초 = 60 frame.
- 매 frame 마다 15 joint × 3D = 45차원 벡터.

### 학습 셋업

paper:
> We follow the preprocessing steps of previous work [64, 97] and obtain a 17-joint skeleton for Human3.6 and a 15-joint skeleton for HumanEva-I. As in [97], we predict future motion for 2 seconds conditioning on observed motion of 0.5 seconds and 1 second conditioning on 0.25 seconds for Human3.6 and HumanEva-I, respectively.

→ "0.5초 보고 2초 예측", "0.25초 보고 1초 예측" — 매우 짧은 context.

---

## 10.7 평가 지표 — ADE / FDE (모션용)

### 원문 (paper p.8)
> Following previous work on trajectory forecasting [2, 37], we adopt two popular metrics, namely, average displacement error (ADE) and final displacement error (FDE). ADE measures the average L2 distance over all time steps between the ground truth motion and the closest sample, while FDE only consider such distance for the final pose.

### 풀어 설명

#### ADE (Average Displacement Error)

**계산**:
1. Target 시점 모두에 대해 예측 sample 과 ground truth 사이 L2 거리 계산.
2. 모든 시점 평균.
3. 100 개 sample 중 **가장 가까운 sample** 사용 (best-of-N).

**의미**: "예측 trajectory 가 전체적으로 ground truth 와 얼마나 가까운가" 의 평균.

#### FDE (Final Displacement Error)

**계산**:
1. **마지막 시점에서만** L2 거리.
2. 100 개 sample 중 가장 가까운 sample.

**의미**: "장기 예측의 끝점이 얼마나 어긋나는가" — long-term accuracy.

### 둘 다 lower = better

비유 (등산):
- ADE = "예측 등산 경로와 실제 경로의 평균 거리" — 길 전체 따라가는 정확도.
- FDE = "마지막 도착점이 얼마나 떨어졌나" — 끝점 정확도.

### "Closest sample" 의 의미 (중요)

- ProTran 은 100 sample 을 생성 → 분포의 multiple modes 표현.
- ADE/FDE 계산 시 100 개 중 **ground truth 와 가장 가까운 sample 1개** 만 사용.
- 이건 stochastic prediction 의 표준 평가 방식 (multi-modal output).

**왜 이렇게 평가하나**:
- 사람의 미래 동작은 multiple plausible (걸을 수도, 멈출 수도).
- "그 중 하나라도 ground truth 와 가깝다면 모델이 그 가능성을 포착했다" — 합리적 평가.

---

## 10.8 모션 Baselines — 9 모델

### 원문 (paper p.8)
> We compare our models against 9 models, including ERD [32] and acLSTM [56], two deterministic RNN-based approaches; MT-VAE [95] and Pose-Knows [87], two conditional VAE models; HP-GAN [6], a conditional GAN; Best-Many [11], GMVAE [25], DeliGAN [38]. and DSP [98], four approaches optimizing for diversity objectives.

### Baseline 분류

| # | Baseline | 분류 | 한계 |
|---|---------|------|------|
| 1 | **ERD** | Deterministic RNN | 결정론적, 분포 없음 |
| 2 | **acLSTM** | Deterministic LSTM | 같음 |
| 3 | **MT-VAE** | Conditional VAE | Global latent (시간 불변) |
| 4 | **Pose-Knows** | Conditional VAE | Global latent |
| 5 | **HP-GAN** | Conditional GAN | Mode collapse 위험 |
| 6 | **Best-Many** | Diversity 최적화 | Heuristic |
| 7 | **GMVAE** | Gaussian mixture VAE | 같음 |
| 8 | **DeliGAN** | Diversity GAN | 같음 |
| 9 | **DSP** | Diverse sample population | 같음 |
| (+) | **DLow** | Diverse latent flow | 가장 강한 경쟁자 |

### ProTran 의 차별점

paper Section 4.4:
> In contrast to earlier work [95, 97] that employ a global latent variable across different time steps via conditional VAE [49], we leverage the principled framework of state space models for learning and inference of hierarchical, time-dependent latent variables.

**기존 VAE 모션 모델 (MT-VAE, DLow)**:
- **Global latent**: 전체 sequence 에 단 한 개 잠재.
- → 시점별 dynamics 표현 어려움.

**ProTran**:
- **Time-dependent + Hierarchical**: 각 시점 × 각 layer 마다 잠재.
- → 시간에 따른 변화 + 다양한 추상화 모두 표현.

---

## 10.9 모션 구현 디테일

### 원문 (paper p.8)
> Similar to the previous experiments, we use 8-head attentions and 2-layers MLPs. Since Human3.6M is significantly more complex and multi-modal than the time series forecasting datasets, we make use of 3 stochastic layers, as opposed to 2 layers for HumanEva-I.

### Hyper-parameters

| Dataset | Layers ($L$) | 이유 |
|---------|-----------|------|
| Human3.6M | **3** | 매우 복잡 + multi-modal |
| HumanEva-I | 2 | 상대적 단순 |

### Long-term 셋업

paper:
> For Human3.6M, the context and target observations are significantly longer and set up for long-term predictions, so we only infer latent variables for target observations.

→ Human3.6M 은 context 25 + target 100 = 125 frame 의 long sequence. **Target-only inference** 사용 (Section 3.1 의 alternative mode).

---

## 10.10 정리

| 측면 | 시계열 | 모션 |
|------|------|------|
| Datasets | 5개 (Solar/Elec/Traffic/Taxi/Wiki) | 2개 (Human3.6M/HumanEva-I) |
| Baselines | 11개 | 9개 |
| Metric | CRPS_sum | ADE / FDE |
| $L$ 범위 | 1~2 | 2~3 |
| Sample 수 | 100 | 100 |

→ 다음 챕터에서 **실제 결과** (Table 1, Table 2, Table 3, Fig 2, Fig 3) 를 자세히 본다.

---

## 10.11 자기점검 (이 챕터)

### 핵심 5가지

1. **CRPS_sum 이 0.028 vs 0.044 인 경우, 어느 쪽이 더 좋은 모델인가?**
2. **ADE/FDE 계산 시 "100 sample 중 가장 가까운 것" 만 쓰는 이유는?**
3. **왜 ProTran 은 dataset 마다 layer 수 ($L$) 가 다른가?**
4. **5 datasets (Solar, Electricity, Traffic, Taxi, Wikipedia) 의 차원별 특징과 비교 의의?**
5. **11 baseline 들의 진화 경로와 ProTran 의 위치?**

### 답변

1. **0.028 이 더 좋음**. CRPS_sum 은 **lower = better** — 예측 분포의 CDF 와 실제 step function 사이 거리. 작을수록 예측 분포가 실제와 가까움. 0.028 vs 0.044 = **36% 개선**. **CRPS 의 직관**: 확률 분포 예측의 표준 metric. 점 예측의 MSE 와 비슷한 역할이지만 분포에 대해. **계산**: $\text{CRPS}(F, y) = \int (F(z) - 1\{z \geq y\})^2 dz$. **sum**: 시계열의 모든 시점 CRPS 의 합.

2. **Multi-modal prediction 의 표준 평가**. 사람의 미래 동작은 multiple plausible (걸을 수도, 멈출 수도, 방향 바꿀 수도). Stochastic 모델은 여러 가능성을 sample 로 표현. "그 중 하나라도 ground truth 와 가깝다면 모델이 그 가능성을 포착했다" 는 합리적 평가. **Best-of-N 평가는 multi-modal prediction 의 표준**. **대안 (단점)**: Mean prediction 만 평가 → multi-modal 의 가치 무시. 모드 평균 = 의미 없는 average pose 가 됨 (예: 왼쪽 걷기 + 오른쪽 걷기 평균 = 정지 자세).

3. **데이터 복잡도에 비례**. Solar/Electricity (137-370 변수) 는 $L=1$ 충분 — 비교적 simple cycle. Traffic/Taxi/Wikipedia (963-2000 변수) 는 $L=2$ — multi-modal cycle + cross-correlation. Human3.6M (매우 복잡 + multi-modal, 17 관절 동작) 는 $L=3$. **paper 의 ablation (Table 2)**: 단순 dataset 에서는 multi-layer 의 marginal gain 만 보임. **선택 원리**: validation set 으로 L 결정, complexity ↓ 면 $L$ ↓ (overfitting 회피).

4. **차원 별 정렬** (low → high): **Solar (137)**: 단일 모달, 단순 cycle. **Electricity (370)**: 단순 cycle but noise ↑. **Traffic (963)**: complex spatial correlation. **Taxi (1214)**: spatial-temporal multi-modal. **Wikipedia (2000)**: 매우 high-dim, 다양한 패턴. **비교 의의**: 차원 ↑ 할수록 ProTran 의 우위 ↑ (Traffic 36% 개선 vs Wikipedia 4% 개선). Why: high-dim 에서 attention 의 가치 ↑. **단**: Wikipedia 도 best — universality 입증.

5. **진화 경로**: **VES (2017)**: ETS (exponential smoothing) — 통계 기반, univariate. **VAR (1980s)**: vector autoregression — multivariate linear. **Vec-GARCH, KVAE**: nonlinear 추가. **DeepAR (Amazon 2017)**: deep RNN, point prediction. **GP-Copula (Salinas 2019)**: probabilistic GP. **Transformer-MAF (2019)**: attention + Mixture-of-Affine flow. **TimeGrad (2021, NeurIPS)**: diffusion-based, 같은 venue 의 SOTA. **★ ProTran (2021)**: 4 lineage 통합 + latent space + smoothing — 모든 차원 ✓. **NKF (Neural Kalman Filter)**: 별도 line, Kalman + flow.

다음 [11_forecasting_results.md](11_forecasting_results.md) 에서 **Table 1 (CRPS_sum) + Fig 2 (Traffic) + Table 2 (ablation) 의 자세한 해석**.
