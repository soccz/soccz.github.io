# 11. Section 5 (Data + Baselines + Metrics) — 6 데이터셋, 8 baseline, q-risk + cpaw

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **6 datasets** (Electricity, ETTm1, ETTh1, Wind, Traffic, Solar) 의 정확한 모양 + 일상 비유
- **8 baselines** (DeepAR, MQRNN, TFT, Transformer, Autoformer, FEDformer, PatchTST, iTransformer) 의 위계
- **2 metrics** — q-risk (각 quantile 정확도) + cpaw (구간 신뢰성 + 폭) — paper 가 새로 제안한 metric
- 본 실험의 **공정성** 검증 — 동일 데이터·동일 분할·동일 hyperparameter 조정

---

논문 5쪽 ~ 6쪽 (Section 5) 을 풀어본다.

이 chapter 는 **"무엇으로 실험했고, 어떻게 비교했고, 어떤 지표로 평가했나"** 를 정리.

핵심 수식: **Eq 20 (q-risk) + Eq 21 (cpaw, paper 가 제안한 새 metric)**.

---

## 11.1 6 Datasets — Table 2

### 📖 처음 보는 사람을 위한 — Table 2 읽는 법

**이 표가 보여주는 것**: 본 논문이 사용한 6 개 시계열 데이터셋의 **크기·변수 수·시간 단위·기간**.

**6 dataset 의 일상 비유**:

| 데이터셋 | 무엇 | 일상 비유 |
|---------|------|-----------|
| **Electricity** | 321 customers 의 시간별 전력 사용량 (3년) | "한 도시의 시간별 전력 수요" |
| **ETTm1** | 변압기 7 변수, 15분 단위 (2년) | "변압기의 분 단위 온도·전압 모니터링" |
| **ETTh1** | 변압기 7 변수, 시간별 (2년) | 위와 같지만 시간 단위 |
| **Wind** | 풍력 3 변수, 15분 단위 (2.5년) | "풍속·풍향·발전량 분 단위 기록" |
| **Traffic** | 861 도로 센서, 시간별 (2년) | "샌프란시스코 모든 도로의 시간별 교통량" |
| **Solar** | 5 변수, 15분 단위 (3년) | "태양광 발전 분 단위 모니터링" |

**왜 6 dataset 인가?**
- **다양성 확보**: 시간 단위 (15분 vs 시간), 변수 수 (3 vs 861), 기간 (2~3년) 모두 다양.
- **일반화 검증**: 한 dataset 에서만 잘하면 우연. 6 개 다 잘하면 진짜 generality.
- **응용 분야 망라**: 전력·교통·날씨·산업 모니터링 모두 포함.

**놓치기 쉬운 한 가지**: Traffic 의 861 변수는 다른 데이터셋의 ~100 배. 본 논문이 high-dimensional time series 에도 작동함을 시사.

### 🔍 6 dataset 의 정밀 비교 — 어느 게 어려운가?

| Dataset | 변수 수 | 빈도 | 샘플 수 | 어려움 | 본 논문 결과 |
|---------|---------|-----|---------|--------|---------------|
| **Electricity** | 321 | 1h | 26K | 중간 (다변수, 일/주 cycle 명확) | **QF 5/5 best** |
| **ETTm1** | 7 | 15min | 70K | 어려움 (변동 큼, 매분 변동) | **QF 4/5 best** |
| **ETTh1** | 7 | 1h | 17K | 중간 (ETTm1 의 시간 단위) | **QF 4/5 best** |
| **Wind** | 3 | 15min | 93K | **매우 어려움** (regime 변화 큼) | **QF 4/5 best, FEDformer 0.9 best** |
| **Traffic** | 861 | 1h | 18K | 어려움 (high-dim, regime 변화) | QF 2/5, mixed |
| **Solar** | 5 | 15min | 108K | 중간 (낮밤 cycle, 계절성) | QF 2/5, mixed |

**어느 dataset 이 가장 어려운가?**
- **Wind**: 풍속의 갑작스러운 변화 (regime shift) — 단일 분포로 못 잡음.
- **Solar**: 낮밤 + 계절 + 날씨 변동 — 다중 시간 척도.
- **Traffic 861**: high-dimensional — overfit 위험.

**왜 QF 가 Wind 에서 강한가?**
- Wind 는 mixture pattern 이 가장 명확 (Fig 1 의 example 가 Electricity 지만 Wind 도 비슷).
- GMM 분해 + VAE 가 wind 의 multi-modal 분포를 정확히 잡음.

### 🌱 6 dataset 일상 비유 통합

| 실세계 | 본 데이터셋 |
|--------|---------|
| "한 도시 모든 가구의 시간별 전력" | Electricity (321 가구) |
| "한 발전기 의 5분마다 온도·전압" | ETTm1, ETTh1 |
| "한 풍력 발전기의 분 단위 발전량" | Wind |
| "샌프란시스코 모든 도로의 시간별 차량" | Traffic (861 도로) |
| "한 태양광 패널의 분 단위 발전량" | Solar |

**원문 위치**: paper Table 2, journal p.6.

---

### paper Table 2 정확 인용 (p.6)

| Dataset | Range | Frequency | Samples | Features |
|---------|-------|-----------|---------|----------|
| **Electricity** | 2016/7/1–2019/7/1 | 1 hour | 26,304 | **321** |
| **ETTm1** | 2016/7/1–2018/6/26 | 15 min | 69,680 | 7 |
| **ETTh1** | 2016/7/1–2018/6/26 | 1 hour | 17,420 | 7 |
| **Wind** | 2020/7/1–2023/2/28 | 15 min | 93,412 | 3 |
| **Traffic** | 2016/7/1–2018/7/2 | 1 hour | 17,544 | **861** |
| **Solar** | 2020/1/1–2023/1/31 | 15 min | 108,192 | 5 |

### 각 dataset 한 줄 설명

#### Electricity (전력)
- **출처**: UCI Machine Learning Repository.
- **내용**: 포르투갈 321 가구의 시간당 전력 소비량 (kWh).
- **특성**: 고차원 multivariate (321 변수 = 321 가구). 일/주/연 cycle 명확.

#### ETTm1, ETTh1 (Electricity Transformer Temperature)
- **출처**: Informer paper (Zhou 2021).
- **내용**: 중국 변압기의 oil temperature + 6 load 변수.
- **m1** = 15분 단위, **h1** = 1시간 단위. 같은 2년 데이터의 다른 해상도.
- **특성**: 7 변수 (작음). 비교적 단순한 일/계절 cycle.

#### Wind (풍속)
- **출처**: 공개 풍력발전 데이터.
- **내용**: 풍력 발전소 3 변수 (풍속, 풍향, 발전량 등).
- **특성**: 15분 단위, 강한 변동성, multimodal 분포 (calm vs storm 모드).

#### Traffic (교통량)
- **출처**: 공개 교통 데이터.
- **내용**: 미국 캘리포니아 861 도로의 시간당 교통량.
- **특성**: 가장 고차원 (861 변수). 출퇴근 peak + 휴일 차이.

#### Solar (태양광)
- **출처**: 공개 태양광 발전 데이터.
- **내용**: 태양광 5 변수 (발전량, 일사량 등).
- **특성**: 15분 단위, 야간 0 + 낮 peak 의 강한 cycle.

### Dataset 특성 분류

| 분류 | Dataset | 특징 |
|------|---------|------|
| 고차원 multivariate | Electricity (321), Traffic (861) | 변수가 매우 많음 |
| 표준 benchmark | ETTm1, ETTh1 | Informer paper 부터 표준 |
| 재생에너지 (15분 단위) | Wind, Solar | 짧은 sample interval |

**Note**: Autoformer paper (Wu 2021) 와 dataset 일부 overlap — Electricity, ETT, Traffic 공통. QuantileFormer 는 Wind, Solar 추가.

---

### ★ 각 dataset 의 깊은 특성 + QuantileFormer 의 적합성

paper 가 명시 안 한 분석. 본 deep dive 의 정리.

#### Electricity (321 가구 시간당 전력 소비)

| 측면 | 분석 |
|------|------|
| Distribution shape | **Multi-modal** (평상시 + 저녁 peak + 야간 valley + 휴일) |
| Periodicity | 강한 일/주/연 cycle |
| Extreme events | 가끔 있음 (한파, 폭염, 휴일) |
| Cross-variable correlation | 강함 (이웃 가구 비슷한 패턴) |
| QuantileFormer 적합도 | **★ 매우 강함** — Fig 1 의 motivation dataset |
| 본 paper 의 결과 | Table 1 의 5/5 quantile best, cpaw best |

→ **QuantileFormer 가 가장 빛나는 dataset**. paper 가 Fig 1 의 예시로 Electricity 를 선택한 것은 우연 아님.

#### ETTm1 (15분 단위 변압기 oil temperature, 7 features)

| 측면 | 분석 |
|------|------|
| Distribution shape | **단순 unimodal** (낮 vs 밤의 단순 cycle) |
| Periodicity | 매우 규칙적 일·계절 cycle |
| Extreme events | 거의 없음 |
| Cross-variable correlation | 중간 (7 변수가 power load 와 oil temp 의 관계) |
| QuantileFormer 적합도 | **약함** — 분해의 추가 정보가 noise 가 됨 |
| 본 paper 의 결과 | Table 1 의 q-risk 4/5 best 지만 **cpaw 5.7배 차이로 패배** |

→ **paper 의 약점 dataset** (ch12 참조). 단순 cycle 만 있는 데이터에는 단순 모델 (Transformer) 가 더 효율적.

#### ETTh1 (1시간 단위, ETTm1 의 다른 해상도)

| 측면 | 분석 |
|------|------|
| ETTm1 과의 차이 | hourly 해상도, sample 수 적음 (17,420 vs 69,680) |
| Sub-hourly 변동 | 없음 (sample 간격이 큼) |
| QuantileFormer 적합도 | **약함** (ETTm1 와 같은 이유) |
| 본 paper 의 결과 | cpaw 3.8배 차이로 패배 |

→ ETTm1 의 변형. 같은 약점.

#### Wind (15분 단위 풍속, 3 features)

| 측면 | 분석 |
|------|------|
| Distribution shape | **강한 multi-modal** (calm + storm 의 2 modes) + heavy-tailed |
| Periodicity | 약함 (날씨는 random) |
| Extreme events | **자주 있음** (storm 시점) |
| Cross-variable correlation | 강함 (풍속, 풍향, 발전량 매우 연관) |
| QuantileFormer 적합도 | **★ 매우 강함** — 특히 0.9 quantile (storm 예측) |
| 본 paper 의 결과 | Table 1 의 0.9 quantile best, ablation 에서 ★ 5배 차이 |

→ **Wind 0.9 가 본 paper 의 가장 강한 cell** — extreme value 예측에서 D-D 분해의 결정적 역할.

#### Traffic (1시간 단위 교통량, 861 features)

| 측면 | 분석 |
|------|------|
| Distribution shape | **multi-modal** (출근 peak + 점심 + 퇴근 peak + 야간) |
| Periodicity | 강한 시간·요일 cycle |
| Extreme events | 가끔 (사고, 이벤트) |
| Cross-variable correlation | **매우 강함** (861 도로 사이 spatial correlation) |
| QuantileFormer 적합도 | **강함** (단 channel-independent backbone 의 약점 일부) |
| 본 paper 의 결과 | Table 1 의 4/5 quantile best, cpaw 거의 동률 |

→ Wind 다음으로 본 paper 가 강한 dataset. 단 변수 간 correlation 학습 못함 (ch15 의 한계 5 참조).

#### Solar (15분 단위 태양광 발전량, 5 features)

| 측면 | 분석 |
|------|------|
| Distribution shape | **bimodal 만** (낮 = peak, 밤 = 0) |
| Periodicity | **매우 강한** 일·계절 cycle (해 뜨고 지는 시간) |
| Extreme events | 거의 없음 (구름의 일시적 영향만) |
| Cross-variable correlation | 중간 |
| QuantileFormer 적합도 | **중간** — 분해의 추가 정보 적음 |
| 본 paper 의 결과 | Table 1 의 1/5 quantile best (DeepAR, MQRNN, Autoformer 가 더 좋음) |

→ Solar 가 약한 이유 = 분포가 너무 단순 (bimodal). 분해 + GMM 의 복잡 처리가 불필요.

### Dataset 별 모델 적합성 요약 표

| Dataset | Distribution | Extreme | 적합도 | 결과 |
|---------|--------------|---------|--------|------|
| Electricity | Multi-modal | 가끔 | **★ 매우 강함** | 5/5 best |
| Wind | Multi-modal + heavy tail | **자주** | **★ 매우 강함** | 4/5 best, 0.9 압도 |
| Traffic | Multi-modal | 가끔 | **강함** | 4/5 best |
| ETTm1 | Unimodal | 거의 없음 | **약함** | q-risk best, cpaw 패배 |
| ETTh1 | Unimodal | 거의 없음 | **약함** | 같은 패턴 |
| Solar | Bimodal | 거의 없음 | **중간** | 1/5 best |

→ **★ 본 paper 의 일반 원칙**: **multi-modal distribution + 자주 발생하는 extreme event** 가 QuantileFormer 의 sweet spot.

---

## 11.2 8 Baselines

### 원문 (paper p.6)

> "We compare the proposed QuantileFormer with three state-of-the-art probabilistic forecasting models, which include TemporalFusionTransformer (TFT), DeepAR and MQRNN. We also compare our model with other Transformer-based models, such as PatchTST, iTransformer, Autofomer, FeDformer and Transformer."

### 8 baseline 분류

#### 확률 forecasting 3 baselines (probabilistic native)

| 모델 | 출처 | 형식 | 비유 |
|------|------|------|------|
| **DeepAR** | Salinas et al. (2020) | Parametric Gaussian (autoregressive RNN) | "일기예보가 매일 '강수량 ~ Normal(5mm, 2)' 라 말함" |
| **MQRNN** | Wen et al. (2017) | Multi-horizon quantile RNN | "RNN 이 미래 여러 시점의 여러 quantile 동시 출력" |
| **TFT** | Lim et al. (2019) | Recurrent + attention, quantile output | "Attention 으로 변수 중요도 학습 + quantile 직접 예측" |

#### Deterministic Transformer 5 baselines (adapted to quantile)

| 모델 | 출처 | 핵심 아이디어 |
|------|------|----------|
| **Transformer** | Vaswani et al. (2017) | Vanilla Transformer |
| **Autoformer** | Wu et al. (2021) | Trend-seasonal decomp + Auto-Correlation |
| **FEDformer** | Zhou et al. (2022) | Frequency-enhanced decomp |
| **PatchTST** | Nie et al. (2022) | Patch tokens + channel-independent |
| **iTransformer** | Liu et al. (2023) | Variable-wise tokens |

### 공정한 비교 — paper 의 조치

paper text (p.6):
> "Note that the later five Transformer-based models were designed for point-wise forecasting and we adapt them to quantile prediction by training them with the proposed quantile loss."

→ **5개 deterministic 모델을 quantile loss (Eq 19) 로 다시 학습** 시켜 quantile output 으로 변환. baseline 도 모두 probabilistic 형태로 비교.

**왜 이렇게 했나**: 단순히 "deterministic 모델은 quantile 못 한다" 가 아니라 **"quantile 학습시킨 같은 backbone 들 중에서도 QuantileFormer 가 좋다"** 를 보이기 위해.

---

## 11.3 Performance Metric 1 — q-risk

### 시작하기 전 — "왜 평균 오차로 quantile 평가 못 하나"

평균 오차 (MAE, MSE) 는 "평균 예측" 평가에는 좋지만 **quantile 예측** 평가에는 부적합:
- 모델이 quantile 0.9 를 잘 예측해도 평균은 아닐 수 있음.
- → quantile 별 정확도를 측정하는 metric 필요.

**답**: q-risk = "quantile 별 pinball loss 의 정규화 버전".

### paper Eq 20 — q-risk 정의

원문:
> "Previous works widely used the q-risk to quantify the accuracy of a $q$-th quantile of the predictive distribution."

$$
\text{q-risk} = \frac{2 \sum_{y_t \in \hat{\Omega}} \sum_{\tau=1}^{\tau_{max}} \left[ q(y - \hat{y})_+ + (1-q)(\hat{y} - y)_+ \right]}{\sum_{y_t \in \hat{\Omega}} \sum_{\tau=1}^{\tau_{max}} |y_t|}
$$

where $(\cdot)_+ = \max(0, \cdot)$.

### 🔣 식이 말하는 것 한 줄

"분자 = 2 × pinball loss 의 합 / 분모 = 실제값 절댓값 합. **실제값 대비 quantile loss 의 비율** = percentage 형식의 quantile 오차".

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\hat{\Omega}$ | test data domain | "OOS test set" | training set 이 아닌 평가 set |
| $\tau_{max}$ | forecasting horizon | "예측 96 시점" | dataset 별 다름 |
| 분자 = $2 \sum [\text{pinball}]$ | pinball loss 의 2배 합 | "quantile 오차 총합" | 2배는 normalization 조정 |
| 분모 = $\sum |y_t|$ | 실제값 절댓값 합 | "기본 변동 크기" | unit normalize |
| q-risk 값 | 0~∞ | "0 = 완벽, 0.5 = 50% 손실" | lower = better |

### 🌱 일상 비유

학생 시험 점수가 평균 100점이고 quantile 예측 오차가 평균 20점이면 q-risk = 0.2 (20%). "실제값 단위에 맞춘 normalized error".

### Eq 20 풀이

**Numerator (분자)**:
$$
2 \sum [\text{pinball loss}] = 2 \times \text{(quantile loss 의 합)}
$$
- $\hat{\Omega}$ = test data domain.
- 2배는 정규화 조정.

**Denominator (분모)**:
$$
\sum |y_t| = \text{(실제값 절댓값의 합)}
$$

**의미**:
$$
\text{q-risk} = \frac{2 \times (\text{quantile loss 의 합})}{\text{실제값 크기 합}}
$$

→ **percentage 형식의 quantile loss**. "실제값 대비 quantile loss 의 비율".
- 1.0 → "평균 true value 와 비교한 100% loss".
- 0.5 → "50% loss" (좋음).
- 0.0 → "완벽".

**lower = better** (낮을수록 좋음).

### 비유

학생들이 시험 친 후 "평균 점수 대비 quantile 오차의 비율" 같은 것. 점수가 100점인데 quantile loss 가 20점이면 q-risk = 0.2.

---

## 11.4 Performance Metric 2 — cpaw (paper 의 새 metric)

### 시작하기 전 — "q-risk 만으로는 부족한 이유"

paper p.6:
> "Since q-risk only considers the accuracy of quantiles, it is lack of consideration to measure the probabilistic interval (PI). To this end, we propose a new performance metric to measure how the true value interact with the predicted probabilistic interval."

### q-risk 의 한계

q-risk 는 quantile 예측의 **정확도** 만 측정.

**문제**: 모델이 매우 **넓은 신뢰 구간** 을 출력하면:
- Coverage (실제값이 구간 안에 들 확률) 가 높아짐.
- 하지만 **useful 하지 않음** — "내일 강수량 0~100mm" 라고 하면 정확하지만 의미 없음.

**필요**: 좁고 정확한 신뢰 구간을 평가하는 metric.

### cpaw 의 답

**cpaw = "정확함 (PICP) × 좁음 (PINAW)"** 의 결합.

### cpaw 의 두 component

#### PICP (Prediction Interval Coverage Probability)

$$
\text{PICP} = \frac{1}{n} \sum_{i=1}^{n} \mathbb{I}(y_i \in [\hat{q}_{i,l}, \hat{q}_{i,u}])
$$

- $\mathbb{I}(\cdot)$ = indicator function (조건 참이면 1, 아니면 0).
- $\hat{q}_{i,l}, \hat{q}_{i,u}$ = predicted lower / upper quantile (예: 0.1, 0.9).
- **의미**: "실제값이 prediction interval 안에 들어갈 확률".
- **클수록 좋음** (1 = 항상 안에).

**비유**: 일기예보가 "내일 강수량 [3, 8] mm" 라고 했을 때, 100일 중 실제 강수량이 [3, 8] 안에 든 비율.

#### PINAW (PI Normalized Averaged Width)

$$
\text{PINAW} = \frac{1}{n} \sum_{i=1}^{n} |\hat{q}_{i,u} - \hat{q}_{i,l}|
$$

- **의미**: prediction interval 의 **평균 폭**.
- **작을수록 좋음** (좁은 신뢰 구간 = useful).

**비유**: 일기예보의 신뢰 구간 폭 평균. [3, 8] mm 면 폭 5mm.

### cpaw 의 결합 — paper Eq 21

$$
\text{cpaw} = \text{PINAW} \cdot \big(1 + \gamma \cdot e^{-(\text{PICP} - \mu)}\big)
$$

### 🔣 식이 말하는 것 한 줄

"cpaw = (구간 폭) × (1 + 부족한 coverage 의 exponential 페널티). **좁고 신뢰성 있으면 작아짐**, 둘 중 하나 부족하면 커짐".

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| PINAW | Prediction Interval Normalized Averaged Width | "예측 구간 평균 폭" | 좁을수록 좋음 |
| PICP | Prediction Interval Coverage Probability | "실제 값이 구간 안에 들어올 확률" | 목표 = $\mu$ |
| $\mu$ | 목표 coverage (예: 0.9-0.1=0.8) | "원하는 신뢰도" | quantile 차이 |
| $\gamma$ | indicator (PICP < μ 면 1) | "under-coverage 일 때만 페널티 켬" | over-coverage 는 페널티 없음 |
| $e^{-(\text{PICP} - \mu)}$ | exponential penalty | "PICP 가 μ 보다 부족하면 폭발적 증가" | 부드러운 페널티 |
| cpaw 값 | 0~∞ | "0 = 완벽, 크면 나쁨" | lower = better |

### 🌱 일상 비유 — "학원 강사의 성적 예측"

| 강사 유형 | 예측 | PICP | PINAW | cpaw | 평가 |
|-----------|------|------|-------|------|------|
| **A (안전주의)** | "50~150점" | 1.0 (100%) | 100 (넓음) | 큼 | 정확하지만 무용지물 |
| **B (자신만만)** | "85~88점" | 0.2 (20%) | 3 (좁음) | **exp 페널티로 큼** | 좁지만 자주 틀림 |
| **C (균형)** | "75~90점" | 0.8 (80%) | 15 (적당) | 작음 | 좁고 정확 ★ |

→ cpaw 가 **두 차원 동시** (정확성·정보량) 평가하는 우아한 metric.

**직관**:
1. **기본**: cpaw = PINAW (좁을수록 좋음).
2. **Penalty**: PICP 가 목표 $\mu$ 보다 작으면 (under-coverage) cpaw 가 exponentially 증가.
3. **Calibration**: PICP ≈ $\mu$ 면 penalty 작음.

**lower = better**.

### cpaw 의 비유

학원 강사의 "성적 예측" 평가:
- **나쁜 강사 A**: "이 학생 50~150점" (PICP=1, 너무 넓음) → useful 안 함 → cpaw 큼.
- **나쁜 강사 B**: "이 학생 85~88점" (PICP=0.2, 너무 좁음) → 자주 틀림 → exponential penalty → cpaw 큼.
- **좋은 강사**: "이 학생 75~90점" (PICP=0.8, 적절 폭) → cpaw 작음.

---

## 11.4-bis ★ cpaw 의 exponential penalty 가 왜 우아한가

cpaw 의 핵심 식:
$$
\text{cpaw} = \text{PINAW} \cdot (1 + \gamma \cdot e^{-(\text{PICP} - \mu)})
$$

### Penalty 곱 디자인의 분석

**Case 1: PICP = $\mu$ (목표 coverage 달성)**
- $e^{-0} = 1$
- cpaw ≈ PINAW (penalty 거의 없음)

**Case 2: PICP < $\mu$ (under-coverage, 실제값이 자주 벗어남)**
- $e^{-(\text{PICP}-\mu)} = e^{\text{positive}} > 1$
- **Exponential penalty** — coverage 가 부족할수록 가파르게 증가.

**Case 3: PICP > $\mu$ (over-coverage, 안전하게 넓은 구간)**
- $e^{-(\text{PICP}-\mu)} = e^{\text{negative}} < 1$
- penalty 거의 0.
- 단 PINAW 자체가 크므로 cpaw 도 큼.

### 비유

학생들의 시험 성적 평가:
- "맞춤 + 좁은 답변" (정확 + 효율) → cpaw 작음 (best).
- "맞춤 + 매우 넓은 답변" (정확 + 비효율, DeepAR 같은) → PINAW 크 → cpaw 큼.
- "틀림 + 좁은 답변" (under-coverage, Autoformer 같은) → exp penalty → cpaw 매우 큼.
- "틀림 + 넓은 답변" → cpaw 최악.

> ★ **cpaw 의 우아함**: 4 가지 시나리오를 자연스럽게 차별화. q-risk 가 못 하는 것 (= 4번째 시나리오 차별화) 을 정확히 잡음.

---

## 11.5 cpaw 의 의의 — 왜 새로 도입했나

### 기존 metric 의 한계

| Metric | 측정 대상 | 한계 |
|--------|----------|------|
| MAE / MSE | 평균 예측의 정확도 | distribution 무시 |
| q-risk | quantile 별 정확도 | **구간 폭 무시** — 넓게 출력해도 정확하면 좋아 보임 |
| CRPS (continuous ranked probability score) | 전체 distribution 의 distance | 복잡, 직관 어려움 |
| **cpaw (이 paper)** | **PICP × PINAW** | **직관적 + 두 측면 동시** |

### cpaw 의 contribution

- 단순 (두 component 의 결합).
- Penalty 형식 (exponential — 미달 시 가파른 panel).
- 연속적 (gradient 정의됨 → 학습에도 활용 가능).

→ paper 의 contribution 중 metric proposal 이 단순한 보조가 아닌 **실질적 기여**.

---

## 11.6 metric 의 진화 — 시각화

```
1990: MSE (평균만)
    ↓
2010: q-risk (quantile 정확도)
    ↓
2024: cpaw (정확도 + 구간 폭, 본 paper)
```

→ **probabilistic forecasting 의 honest evaluation 진화**.

---

## 11.7 5.1 Main Results 예고

paper Table 1 (q-risk) 과 Table 3 (cpaw) 의 두 metric 모두에서 9 models × 6 datasets 비교.

다음 [12_main_results.md](12_main_results.md) 에서 정확한 수치 분석.

---

## 11.8 Section 5 핵심 정리

| 항목 | 내용 |
|------|------|
| 6 Datasets | Electricity, ETTm1, ETTh1, Wind, Traffic, Solar |
| 8 Baselines | DeepAR, MQRNN, TFT, Transformer, Autoformer, FEDformer, PatchTST, iTransformer |
| 공정한 비교 | 5개 deterministic 도 quantile loss 로 재학습 |
| Metric 1 | **q-risk** (Eq 20) — quantile loss / mean |
| Metric 2 | **cpaw** (Eq 21) — PINAW × (1 + γ·exp(-(PICP-μ))) — 본 paper 의 새 metric |
| Metric 방향 | 둘 다 **lower = better** |
| cpaw 의 미덕 | 정확도 (PICP) + 좁음 (PINAW) 동시 평가 |

**한 줄 핵심**:
> **"6개 real-world dataset, 8개 baseline (확률 3 + Transformer 5), 두 metric (q-risk + cpaw, 후자는 본 paper 의 contribution). cpaw 가 q-risk 의 한계 (구간 폭 무시) 를 보완."**

다음 [12_main_results.md](12_main_results.md) 에서 Table 1, 3 의 정확한 수치 분석.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **6 dataset 중 가장 고차원과 가장 단순한 것은?**
2. **5개 deterministic baseline 을 어떻게 probabilistic 비교 가능하게 만들었나?**
3. **cpaw 가 q-risk 의 어떤 한계를 보완하나?**

### 답변

1. **6 dataset 의 변수 수와 complexity 비교**:
   - **가장 고차원**: Traffic (**861 features**), Electricity (321).
   - **가장 단순 (변수 수 적음)**: Wind (3), Solar (5).
   - **표준 benchmark**: ETTm1, ETTh1 (둘 다 7 features).
   - **변수 수 ≠ complexity** — 핵심 통찰:
     - **Wind (3 변수, but 어려움)**: 변수 적지만 **multimodal 분포** (storm vs calm 두 봉우리). GMM 의 가치 가장 큼.
     - **Traffic (861 변수)**: 변수 많지만 패턴 비교적 규칙적 (rush hour cycle). 모델링 어렵지만 multimodal 은 약함.
     - **Solar (5 변수)**: 단순 일/계절 cycle. multi-modal 거의 없음.
   - **함의**: **분포 모양 (multimodal vs unimodal)** 이 변수 수 보다 더 결정적인 difficulty 요인.

2. **공정한 비교의 방법론**:
   - **문제**: deterministic 모델 (Transformer, Autoformer 등) 은 단일 값 출력. probabilistic 비교 불가.
   - **paper 의 해결**: deterministic 모델 5 개 (Transformer, Autoformer, FEDformer, PatchTST, iTransformer) 를 **quantile loss (Eq 19) 로 재학습**.
   - **재학습 절차**:
     - 같은 backbone (예: Autoformer encoder/decoder).
     - 출력 layer 만 단일 값 → 5 quantile 으로 확장.
     - Pinball loss 로 학습.
   - **공정성의 핵심**: "deterministic vs probabilistic 의 차이" 가 아닌 "**같은 quantile loss 학습 setting 에서 backbone 차이**" 를 측정.
   - **함의**: QuantileFormer 의 우위가 단순 "분포 모델링" 때문이 아니라 **architecture 자체 (분해 + VAE + fusion)** 때문임을 입증.

3. **cpaw 의 추가 가치 — q-risk 의 한계 보완**:
   - **q-risk 의 한계**:
     - quantile 정확도**만** 측정.
     - 모델이 **매우 넓은 신뢰 구간** 출력하면 정확도 ↑.
     - 예: "내일 강수량 0~100mm" → 정확하지만 useless (정보 없음).
     - PICP (coverage) 만족하지만 PINAW (폭) 무한.
   - **cpaw 의 결합 평가**:
     - PINAW (구간 폭) × (1 + γ × exp(μ - PICP))
     - PICP 만족 + PINAW 좁음 → cpaw 작음 (좋음).
     - PICP 불만족 → exponential penalty → cpaw 폭증.
     - PINAW 너무 넓음 → cpaw 자체가 큼.
   - **두 metric 의 상호보완**:
     - q-risk = "quantile 마다 정확함?"
     - cpaw = "구간 자체가 useful?"
     - 둘 다 만족해야 진정한 probabilistic forecasting.
   - **paper 의 metric contribution**: cpaw 가 q-risk 의 빈 칸을 메움. 미래 paper 의 표준이 될 가능성.
   - **본 논문 결과의 의미**: QuantileFormer 가 q-risk + cpaw 둘 다 우위 → **정확하면서 좁은** 구간 = 진정한 운용 가치.
