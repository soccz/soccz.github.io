# 08. 데이터셋 + Baseline 모델 — 실험 setup

> **🧒 한 줄 요약**: ETT, Weather, Traffic, ECL 5 datasets. 7 baselines.


> 본 논문이 사용한 *6 datasets* + *10 baseline 모델*. 무지식자 친화로.

---

## 8.1 챕터 한 줄 요약

> **"6 datasets (다양한 domain — 에너지/교통/경제/날씨/질병) + 10 baseline (Transformer 변형 5종 + RNN/CNN 5종) = *광범위 검증*. Autoformer 가 *모든 dataset 의 거의 모든 cell 에서 best* — 38% MSE reduction 평균."**

---

## 8.2 6 Datasets — 5 응용 분야

본 논문이 *광범위한 dataset 비교* 위해 6 개 사용:

### Table 통계 (paper Section 4 + Appendix)

| Dataset | M (변수 수) | 시간 단위 | 총 timestep | Domain |
|---------|------------|-----------|------------|--------|
| **ETT** (ETTh1, h2, m1, m2) | 7 | 15분/시간 | 17,420 ~ 69,680 | 에너지 (변압기) |
| **Electricity** | 321 | 시간 | 26,304 | 에너지 (전력) |
| **Exchange** | 8 | 일 | 7,588 | 경제 (환율) |
| **Traffic** | 862 | 시간 | 17,544 | 교통 |
| **Weather** | 21 | 10분 | 52,696 | 날씨 |
| **ILI** | 7 | 주 | 966 | 질병 (인플루엔자) |

### 각 dataset 의 *친근 설명*

#### ETT (Electricity Transformer Temperature)

- **풀네임**: 전력 변압기 온도.
- **수집**: 2016년 7월 ~ 2018년 7월 (China).
- **4 가지 sub-dataset**:
  - **ETTh1, ETTh2**: 시간 단위 (h = hourly). 변압기 위치 1, 2.
  - **ETTm1, ETTm2**: 15분 단위 (m = minutes). 변압기 위치 1, 2.
- **M = 7 변수**: 변압기 작동 변수 (전력 부하, 온도, 등).
- **Use case**: 변압기 *과열 방지*, *유지보수 계획*.

#### Electricity

- **수집**: 2012-2014 (UCI ML Repo).
- **M = 321 가구**: 시간당 전력 사용량.
- **일상 비유**: 한 도시 의 *321 가구* 의 *시간당 전력 데이터*.

#### Exchange

- **수집**: 1990-2016 (LSTNet dataset).
- **M = 8 국가**: 일간 환율 (vs USD).
- **일상 비유**: *8 개국 통화* 의 *일별 가치 변동*.
- **특징**: *비주기성* — 환율 은 *random walk* 에 가까움.

#### Traffic

- **수집**: California DOT (Department of Transportation).
- **M = 862 도로**: 시간당 차량 점유율.
- **일상 비유**: *고속도로 862 구간* 의 *시간당 차량 통과 비율*.

#### Weather

- **수집**: Max Planck Institute (Jena, Germany), 2020 전체.
- **M = 21 변수**: 기온, 습도, 풍속, 등.
- **단위**: 10분.
- **일상 비유**: *21 가지 기상 변수* 의 *10분 단위 기록*.

#### ILI (Influenza-Like Illness)

- **수집**: CDC (Centers for Disease Control), 2002-2021.
- **M = 7 지역**: 인플루엔자 환자 비율.
- **단위**: 주.
- **일상 비유**: *7 지역* 의 *주간 인플루엔자 환자 수*.

### 핵심 — *다양한 domain*

**일상 비유**: 의사가 *심장 약 효과* 를 검증할 때 *한 병원* 만 보면 *general 효과 모름*. *여러 병원, 인종, 나이대 (다양한 dataset)* 에서 *모두 효과* 보여야 *진짜 universal*.

본 논문 도 마찬가지 — *에너지, 교통, 경제, 날씨, 질병* 의 *5 분야* 에서 *모두 SOTA* 보여야 *진짜 universal model*.

### Dataset 의 *변수 수 (M)* 의 차이

- *작은 M* (ETT 7, ILI 7, Exchange 8): *단순 multivariate*.
- *중간 M* (Weather 21): *moderate*.
- *큰 M* (Electricity 321, Traffic 862): *high-dimensional* — Transformer 의 *진가 발휘*.

---

## 8.3 10 Baseline 모델

본 논문이 비교한 *baseline*:

### Transformer 기반 (4 종) — 핵심 baseline

#### 1. Informer (Zhou et al, AAAI 2021)

- **Trick**: *ProbSparse self-attention* — KL divergence 로 *important query 선택*.
- **Complexity**: $O(L \log L)$.
- **본 논문에서**: *Main competitor*. Table 1-4 의 *가장 강한 baseline*.

#### 2. Reformer (Kitaev et al, ICLR 2020)

- **Trick**: *LSH (Locality-Sensitive Hashing) attention*.
- **Complexity**: $O(L \log L)$.

#### 3. LogTrans (Li et al, NeurIPS 2019)

- **Trick**: *LogSparse attention* — log 간격.
- **Complexity**: $O(L (\log L)^2)$.

#### 4. Transformer (Vaswani 2017)

- **Trick**: Full self-attention.
- **Complexity**: $O(L^2)$.
- **Note**: Ablation Table 3 등 에 등장 (full attention baseline).

### RNN 기반 (2 종)

#### 5. LSTNet (Lai et al, SIGIR 2018)

- **Trick**: CNN + RNN + Skip connection.
- **본 논문**: *Multivariate baseline*.

#### 6. LSTM (Hochreiter 1997)

- **Trick**: 표준 LSTM.
- **본 논문**: *Multivariate baseline*.

### CNN 기반 (1 종)

#### 7. TCN (Bai et al 2018)

- **Trick**: Causal Convolution.
- **본 논문**: *Multivariate baseline*.

### Univariate 전용 (3 종) — Table 2 에서만

#### 8. N-BEATS (Oreshkin et al 2019)

- **Trick**: *Basis expansion* (Fourier basis 등).
- **Univariate forecasting** 의 SOTA.

#### 9. DeepAR (Salinas et al 2020)

- **Trick**: *Autoregressive RNN + Gaussian likelihood*.
- *Amazon 의 공식 forecasting tool*.

#### 10. Prophet (Taylor & Letham 2018)

- **Trick**: *Trend + Seasonal + Holiday* 분해 + Bayesian.
- *Facebook 의 비즈니스 forecasting 표준*.

#### 11. ARIMA (Box & Jenkins 1970)

- **Trick**: 통계 표준.

---

## 8.4 *실험 setup*

### Train / Validation / Test 분할

각 dataset 의 시계열을 *시간 순서대로* 분할:
- *ETT*: train 6 + val 2 + test 2 (6:2:2).
- *그 외 5종*: train 7 + val 1 + test 2 (7:1:2).

**중요**: *Chronological (time order)* 유지 — *future data 가 train 에 포함 X* (data leakage 방지).

### Forecasting Horizons

각 dataset 에서 *4 가지 미래 timestep* 예측:
- **ILI 제외 5 datasets**: $O \in \{96, 192, 336, 720\}$.
- **ILI 만**: $O \in \{24, 36, 48, 60\}$ — 주 단위 데이터.

### Input Length

- **ILI**: $I = 36$ (주 단위 36 = 9개월).
- **그 외**: $I = 96$ (시간 단위 96 = 4일).

### Hyperparameters

본 논문 default:
- *Hidden dimension*: $d_{\text{model}} = 512$.
- *Number of heads*: $h = 8$.
- *Encoder layers*: $N = 2$.
- *Decoder layers*: $M = 1$.
- *Moving average window*: $k = 25$ (Series Decomp).
- *Auto-Correlation factor*: $c = 1 \sim 3$ ($k = c \log L$).
- *Optimizer*: Adam, learning rate $10^{-4}$.
- *Batch size*: 32.
- *Early stopping*: ≤ 10 epochs.

### Hardware

- *GPU*: NVIDIA TITAN RTX 24GB (단일 GPU).
- *Framework*: PyTorch.
- *3 runs per setting* (mean ± std).

### Metric

**MSE + MAE** 두 metric. *낮을수록 좋음*.

---

## 8.5 자기점검

### 핵심 3가지
1. **6 dataset 의 *5 응용 분야*?**
2. **DLinear 대신 *Informer 가 main competitor* 인 이유?**
3. **Train/Validation/Test 분할 의 *time order* 중요성?**

### 답변
1. **에너지 (ETT + Electricity) + 경제 (Exchange) + 교통 (Traffic) + 날씨 (Weather) + 질병 (ILI) = 5 응용**. M = 7 (작음, ETT/ILI) ~ 862 (큼, Traffic). 시간 단위 10분 ~ 주. *광범위 domain* 의 universality 검증 — *Autoformer 가 특정 분야 만 잘 되는 게 아니라 모든 도메인 에서 best*.
2. **2021년 시점 에서 *DLinear 는 아직 등장 X*** (DLinear 는 2022 AAAI 2023 paper). 따라서 *시계열 Transformer 의 가장 강한 baseline 은 Informer (2021)*. ProbSparse attention 으로 *$O(L \log L)$* + *주요 query 선택* — *Autoformer 와 같은 복잡도 + 다른 attention*. Autoformer 가 *Informer 를 38% MSE 감소* 로 *paradigm shift* 증명.
3. **Time series 에서는 *future data 가 train 에 포함되면 안 됨* — data leakage**. 따라서 분할은 *시간 순서대로*: train (처음 60-70%) → validation (다음 10-20%) → test (마지막 20%). 일반 random shuffle 분할은 *cheating* — *미래 정보 활용*. 본 논문이 *purely chronological 분할* 사용 → *실증 결과 trustworthy*.

---

다음 챕터: [09_main_results.md](09_main_results.md) — Main Results (Table 1 + Table 2).
