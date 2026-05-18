# 08 Datasets, Baselines, Setup — Section 4 (p.6–7)

## 6개 Datasets

paper p.6–7 의 Datasets paragraph 정확 인용:

> Here is a description of the six experiment datasets:
> (1) ETT [48] dataset contains the data collected from electricity transformers, including load and oil temperature that are recorded every 15 minutes between July 2016 and July 2018.
> (2) Electricity¹ dataset contains the hourly electricity consumption of 321 customers from 2012 to 2014.
> (3) Exchange [25] records the daily exchange rates of eight different countries ranging from 1990 to 2016.
> (4) Traffic² is a collection of hourly data from California Department of Transportation, which describes the road occupancy rates measured by different sensors on San Francisco Bay area freeways.
> (5) Weather³ is recorded every 10 minutes for 2020 whole year, which contains 21 meteorological indicators, such as air temperature, humidity, etc.
> (6) ILI⁴ includes the weekly recorded influenza-like illness (ILI) patients data from Centers for Disease Control and Prevention of the United States between 2002 and 2021, which describes the ratio of patients seen with ILI and the total number of the patients.

### Dataset 한눈 표

| Dataset | 변수 수 | 빈도 | 기간 | 응용 카테고리 | 본 paper 의 split |
|---------|--------|------|------|--------------|------------------|
| ETT (ETTm2 main) | 7† | 15분 (m) / 1시간 (h) | 2016/07–2018/07 | energy | 6:2:2 |
| Electricity | **321** (paper) | hourly | 2012–2014 | energy | 7:1:2 |
| Exchange | **8** countries (paper) | daily | 1990–2016 | economics (FX) | 7:1:2 |
| Traffic | 862† (sensors) | hourly | California DOT | traffic | 7:1:2 |
| Weather | **21** indicators (paper) | 10min | 2020 전체 | weather | 7:1:2 |
| ILI | 7† | weekly | 2002–2021 | disease | 7:1:2 |

† 표시 = paper Section 4 본문에 정확한 변수 수 미명시. ETT 의 7 (oil temperature + 6 power loads), Traffic 의 862 sensors, ILI 의 7 feature 는 **공식 repo (github.com/thuml/Autoformer) 의 dataset preprocessing 기준**. paper 의 인용 가능한 변수 수는 **굵게** 표시한 것만 (Electricity 321, Exchange 8, Weather 21).

**Split 룰**:
> We follow standard protocol and split all datasets into training, validation and test set in chronological order by the ratio of 6:2:2 for the ETT dataset and 7:1:2 for the other datasets. (p.7)

**ETT 4 variants**:
- ETTh1, ETTh2 — 1시간 단위
- ETTm1, ETTm2 — 15분 단위
- 본문은 ETTm2 만 사용, Appendix A (Table 5) 가 4 variants 전체.

**Footnote URL**:
- ¹ `archive.ics.uci.edu/ml/datasets/ElectricityLoadDiagrams20112014`
- ² `pems.dot.ca.gov`
- ³ `bgc-jena.mpg.de/wetter/` (Max-Planck-Institut für Biogeochemie Jena Weather Station)
- ⁴ `gis.cdc.gov/grasp/fluview/fluportaldashboard.html`

---

## Implementation Details (p.7)

> Our method is trained with the L2 loss, using the ADAM [22] optimizer with an initial learning rate of $10^{-4}$. Batch size is set to 32. The training process is early stopped within 10 epochs. All experiments are repeated three times, implemented in PyTorch [31] and conducted on a single NVIDIA TITAN RTX 24GB GPUs. The hyper-parameter $c$ of Auto-Correlation is in the range of 1 to 3 to trade off performance and efficiency. ... Autoformer contains 2 encoder layers and 1 decoder layer.

| 항목 | 값 |
|------|----|
| Loss | L2 (MSE) |
| Optimizer | Adam |
| Learning rate | $10^{-4}$ |
| Batch size | 32 |
| Epochs | ≤ 10 (early stop) |
| GPU | NVIDIA TITAN RTX 24GB (single) |
| Framework | PyTorch |
| Reps | 3 runs per setting |
| Auto-Correlation $c$ | 1–3 |
| Encoder layers | $N = 2$ |
| Decoder layers | $M = 1$ |

### paper Appendix G.2 — Fair Comparison & Embedding (p.18)

paper 가 baseline 들의 공평한 비교를 위해 두 가지 통일:

> All these transformer-based models are built with two encoder layers and one decoder layer for the sake of the fair comparison in performance and efficiency, including Informer [48], Reformer [23], LogTrans [26] and canonical Transformer [41]. Besides, all these models adopt the embedding method and the one-step generation strategy as Informer [48]. (paper p.18 G.2)

→ **모든 Transformer baselines (Informer/Reformer/LogTrans/Transformer) 도 N=2, M=1**. 동일 architecture depth 에서 메커니즘만 비교.

→ **임베딩 + one-step generation 도 Informer 방식 통일**. Autoformer 만의 advantage 가 아님 — 공평.

### Embedding 의 차이 — Autoformer 만의 변형

> Note that our proposed series-wise aggregation can provide enough sequential information. Thus, we do not employ the position embedding as other baselines but keep the value embedding and time stamp embedding. (G.2)

표준 Transformer / Informer 의 embedding 3종:
1. **Value embedding** — input value → d_model 차원
2. **Position embedding** — 시점 i → d_model 차원 (Transformer의 sinusoidal/learnable)
3. **Time stamp embedding** — calendar feature (hour-of-day, day-of-week 등) → d_model 차원

**Autoformer**: value + time stamp embedding **만 사용**. Position embedding **생략**.

**이유**: Auto-Correlation 의 series-wise aggregation 이 이미 시점 간 관계를 학습 — position 정보가 별도 embedding 으로 주입될 필요 없음.

→ 본 deep dive 의 ch18 PyTorch 코드는 단순화를 위해 value embedding 만 (Linear). time stamp + position 둘 다 생략. paper repo 는 time stamp 까지 포함.

---

## Baselines (10개)

paper p.7:
> We include 10 baseline methods. For the multivariate setting, we select three latest state-of-the-art transformer-based models: Informer [48], Reformer [23], LogTrans [26], two RNN-based models: LSTNet [25], LSTM [17] and CNN-based TCN [4] as baselines. For the univariate setting, we include more competitive baselines: N-BEATS[29], DeepAR [34], Prophet [39] and ARIMA [1].

### Multivariate Baselines (6)
- **Informer** [48] — AAAI 2021 (ProbSparse)
- **Reformer** [23] — ICLR 2020 (LSH)
- **LogTrans** [26] — NeurIPS 2019 (LogSparse)
- **LSTNet** [25] — SIGIR 2018
- **LSTM** [17] — Hochreiter-Schmidhuber 1997
- **TCN** [4] — Bai-Kolter 2018

### 추가 Univariate Baselines (4)
- **N-BEATS** [29] — ICLR 2019
- **DeepAR** [34] — Salinas 2020
- **Prophet** [39] — Taylor-Letham 2018
- **ARIMA** [1] — 1976

### Appendix A 의 추가 baseline (ETT 전체):
- **LSTMa** [3] — Bahdanau-Cho-Bengio attention RNN (Table 5).

---

## 평가 지표

**MSE** (Mean Squared Error) 와 **MAE** (Mean Absolute Error):

$$
\text{MSE} = \frac{1}{O \cdot d} \sum_{i=1}^{O} \sum_{j=1}^{d} (\hat{y}_{i,j} - y_{i,j})^2
$$

$$
\text{MAE} = \frac{1}{O \cdot d} \sum_{i=1}^{O} \sum_{j=1}^{d} |\hat{y}_{i,j} - y_{i,j}|
$$

**Lower is better** (paper Tables 의 모든 caption 명시).

---

## 평가 설정 — Multivariate vs Univariate

**Multivariate**:
- 입력: 모든 dimension $d$ 의 시계열.
- 출력: 모든 dimension 의 미래 $O$ 시점.
- 즉 multi-input multi-output. 본문 Table 1.

**Univariate**:
- 입력: 모든 dimension 사용 (모델에 전달).
- 출력: target 1차원 (Oil Temperature for ETT, OT for Exchange).
- 본문 Table 2.

---

## 입력 길이 $I$

> We set the input length $I$ as 36 for ILI and 96 for the others. (Table 1, p.7)

- ILI 는 weekly → 36주 ≈ 9개월.
- 나머지는 $I=96$ (ETT 의 15분 단위 96 = 24시간, hourly 96 = 4일).

**입력 길이 ablation** (Table 7, ch13):
- ETT, Electricity: $I \in \{96, 192, 336, 720\}$ 시험.
- ILI: $I \in \{24, 36, 48, 60\}$.

---

## 정리

5개 응용 도메인 × 6개 dataset × 4개 horizon × 7개 모델 = 본문 Table 1 의 168 cell. 모두 mean ± std (3 runs) 로 보고 — Table 10 (Appendix E.4).

다음 [09_main_results.md](09_main_results.md) 에서 Tables 1, 2 의 정확한 수치.
