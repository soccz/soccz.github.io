# 09. 데이터셋 + Baseline 모델 — 실험 setup

> 본 논문이 사용한 **8 datasets** + **8 baseline 모델**. 무지식자 친화로.

---

## 9.1 챕터 한 줄 요약

> **"8 datasets (다양한 domain) + 8 baseline (전통 + Transformer + Linear) = 광범위 검증. PatchTST 가 32/32 cells 중 약 29 cells (91%) 에서 best."**

---

## ★ 본 chapter 의 핵심 결론 (미리 보기)

| Dataset | PatchTST 적합도 | 결과 |
|---------|---------------|------|
| Weather, Traffic, Electricity, ILI, ETTm1, ETTm2 | **★ 강함** | 4/4 horizons best |
| ETTh1, ETTh2 | **약함** | DLinear 와 격차 작음 |

→ **PatchTST 의 sweet spot**: 고차원 multivariate + 강한 cycle + many samples.
→ **약점**: 단순 cycle dataset (ETT h1/h2) — Linear baseline 으로도 충분.

자세한 분석은 ch10.

---

## ★ Dataset 별 deep 특성 + PatchTST 적합도 매트릭스

paper 가 명시 안 한 분석. 본 deep dive 의 정리.

### 8 dataset 의 정확한 통계 (Table 1 + Appendix Table 2)

| Dataset | M (변수) | Length | Frequency | Sample 수 |
|---------|---------|--------|----------|----------|
| Weather | 21 | - | 10 분 | 52,696 |
| Traffic | 862 | - | 1 시간 | 17,544 |
| Electricity | 321 | - | 1 시간 | 26,304 |
| ILI | 7 | - | 1 주 | 966 |
| ETTh1 | 7 | - | 1 시간 | 17,420 |
| ETTh2 | 7 | - | 1 시간 | 17,420 |
| ETTm1 | 7 | - | 15 분 | 69,680 |
| ETTm2 | 7 | - | 15 분 | 69,680 |

### Dataset 별 깊은 특성

#### Weather (21 기상 변수, 10 분 단위)
- **특성**: 강한 daily/seasonal cycle + 가끔 storm event.
- **PatchTST 적합도**: ★ **매우 강함** (4/4 horizons best, 37% reduction vs FED).
- **이유**: 21 변수의 multi-scale pattern + longer L (PatchTST 의 강점).

#### Traffic (862 도로 점유율, 시간당)
- **특성**: 강한 시간·요일 cycle + 출퇴근 peak.
- **PatchTST 적합도**: ★ **매우 강함** (4/4 horizons best, 38% reduction).
- **이유**: 862 변수의 spatial-temporal pattern + 22× speedup 가 가능 (Table 1).
- **★ 특별**: Patching 의 가장 큰 computational benefit dataset.

#### Electricity (321 가구, 시간당)
- **특성**: 강한 일/주/연 cycle + 가구 다양성.
- **PatchTST 적합도**: ★ **매우 강함** (4/4 horizons best).
- **이유**: 321 변수의 channel-independence 가 결정적 (Fig 7, ch18).

#### ILI (7 인플루엔자 환자, 주별)
- **특성**: Few-shot setting (966 weeks ≈ 18년).
- **PatchTST 적합도**: ★ **매우 강함** (4/4 horizons best, **72% reduction vs Informer**).
- **이유**: Few-shot 에서도 channel-independence + patching 이 효과적 → **foundation model 방향 시사**.

#### ETTm1 (변압기, 15분)
- **특성**: 강한 일·계절 cycle, 15분 sub-hourly 변동.
- **PatchTST 적합도**: ★ **강함** (4/4 horizons best).
- **이유**: 69K samples + sub-hourly variation 으로 PatchTST 작동.

#### ETTm2 (변압기 v2, 15분)
- **특성**: ETTm1 와 유사.
- **PatchTST 적합도**: **우수** (3/4 horizons best).
- **이유**: PatchTST/42 가 일부 horizons 에서 더 좋음.

#### ETTh1 (변압기, 시간) — **★ PatchTST 약점 dataset**
- **특성**: 단순 일/계절 cycle, sub-hourly 변동 없음, 적은 samples (17K).
- **PatchTST 적합도**: **약함** — DLinear 와 격차 작음.
- **이유**: 단순 cycle 만 있는 dataset 에는 Linear model 도 충분. PatchTST 의 복잡함이 noise.

#### ETTh2 (변압기 v2, 시간) — **★ PatchTST 약점 dataset**
- **특성**: ETTh1 와 유사한 단순 cycle.
- **PatchTST 적합도**: **약함** (PatchTST/42 가 일부 horizons best, /64 는 약함).
- **이유**: ETTh1 와 같음.

### ★ Dataset 별 종합 매트릭스

| Dataset | M | Sample 수 | Complexity | PatchTST 적합도 | Best in 4 horizons |
|---------|----|----------|----|--------------|----------|
| Weather | 21 | 52,696 | High | ★★★ | **4/4** |
| Traffic | 862 | 17,544 | **Very High** | ★★★ | **4/4** |
| Electricity | 321 | 26,304 | High | ★★★ | **4/4** |
| ILI | 7 | 966 | Medium (few-shot) | ★★★ | **4/4** |
| ETTm1 | 7 | 69,680 | Medium | ★★ | **4/4** |
| ETTm2 | 7 | 69,680 | Medium | ★★ | 3/4 |
| ETTh1 | 7 | 17,420 | **Low (단순 cycle)** | ★ | **4/4 (격차 작음)** |
| ETTh2 | 7 | 17,420 | **Low** | ★ | 2/4 |
| **합계** | - | - | - | - | **29/32 (91%)** |

→ **★ 일반 원칙**: **PatchTST 는 complex dataset 에서 빛난다**. 단순 cycle (ETTh1/h2) 에서는 Linear baseline (DLinear) 도 경쟁력.

→ **응용 시사**: 새 dataset 적용 전에 **distribution complexity 분석** 필요. Multi-modal/high-variance/many-channel 이면 PatchTST 선택, 단순 cycle 이면 DLinear 부터 시도.

---

## 9.2 8 Datasets — 다양한 domain

본 논문이 *광범위한 dataset 비교* 위해 8 개 사용:

### Table 2 — Dataset 통계 (paper p.6)

| Dataset | Features (M) | Timesteps |
|---------|-------------|-----------|
| Weather | 21 | 52,696 |
| Traffic | 862 | 17,544 |
| Electricity | 321 | 26,304 |
| ILI | 7 | 966 |
| ETTh1 | 7 | 17,420 |
| ETTh2 | 7 | 17,420 |
| ETTm1 | 7 | 69,680 |
| ETTm2 | 7 | 69,680 |

→ *작은 dataset* (ILI 966 timestep) ~ *큰 dataset* (ETTm 69,680). **Weather, Traffic, Electricity 3 개** 가 *large datasets* — 본 논문이 *결과 안정 + overfitting 회피* 위해 강조.

### Weather (날씨)

- **변수 수 (M)**: 21 (기온, 습도, 풍속 등).
- **시간 단위**: 10 분.
- **총 timestep**: 약 52,000.
- **Use case**: 단기 날씨 예측.

### Traffic (교통)

- **M = 862**: 862 개 도로의 *차량 점유율*.
- **시간 단위**: 시간.
- **총 timestep**: 약 17,500.
- **Use case**: 교통 혼잡 예측.

### Electricity (전력)

- **M = 321**: 321 가구의 *시간당 전력 사용량*.
- **시간 단위**: 시간.
- **총 timestep**: 약 26,000.
- **Use case**: 전력 수요 예측, 그리드 관리.

### ILI (Influenza-Like Illness)

- **M = 7**: 인플루엔자 환자 수 (지역별).
- **시간 단위**: 주.
- **총 timestep**: 약 950.
- **Use case**: 전염병 outbreak 예측.

### ETT (Electricity Transformer Temperature)

4가지 sub-dataset (시간 단위 + 위치):
- **ETTm1**: 15 분 단위, 변압기 위치 1.
- **ETTm2**: 15 분 단위, 변압기 위치 2.
- **ETTh1**: 시간 단위, 변압기 위치 1.
- **ETTh2**: 시간 단위, 변압기 위치 2.

- **M = 7**: 변압기 작동 변수 (전력, 온도 등).
- **Use case**: 전력 변압기 유지보수 + 부하 예측.

### 핵심 — *다양한 domain*

8 dataset 이 *날씨, 교통, 전력, 의료, 변압기* 분야 — *광범위*. *PatchTST 의 universal 성능* 검증.

**일상 비유**: 의사가 *심장 약 효과* 를 검증할 때 *한 병원 한 인종 한 나이대* 만 보면 *general 효과 모름*. *여러 병원, 인종, 나이대 (다양한 dataset)* 에서 *모두 효과* 보여야 *진짜 universal*. 본 논문 도 마찬가지 — *날씨, 교통, 전력, 의료, 변압기* 의 *완전 다른 domain* 에서 *모두 SOTA* 보여야 *진짜 universal model*.

### Dataset 의 *변수 수 (M)* 의 차이

| Dataset | M | Note |
|---------|---|------|
| ETT (4종) | 7 | 작은 변수 — 변압기 의 7 작동 변수 |
| ILI | 7 | 작은 변수 — 7 지역의 인플루엔자 환자 수 |
| Weather | 21 | 중간 — 21 기상 변수 |
| Electricity | 321 | 큼 — 321 가구의 전력 |
| Traffic | **862** | 매우 큼 — 862 도로 |

**일상 비유**: *변수 수 = 동시 다루는 시계열 수*. 7 (작은 시험) vs 862 (한 학년 전체) 만큼 *복잡도 차이*. Channel-Indep 가 *M=862 의 큰 dataset* 에서도 *학습 가능* 하게 만드는 핵심.

---

## 9.2.5 *제외* 된 dataset — Exchange-rate

본 논문이 *Exchange-rate dataset (8개국 일일 환율)* 을 *제외*:

**이유 1 — Efficient Market Hypothesis (Fama 1970)**: *효율 시장* 에서 *환율의 best prediction* 은 단순히 *$x_t = x_{t-1}$* (직전 값). 즉 *random walk*. *예측 불가능* — *모든 모델 의 MSE 가 비슷*.

**이유 2 — Rossi (2013) 의 분석**: Exchange-rate forecasting 은 *random walk with drift* 가 *toughest baseline*. 어떤 정교한 모델도 이걸 *현저히 능가 X*.

**이유 3 — DLinear (Zeng et al 2022)**: *Look-back window 의 마지막 값 반복* 만으로 *MSE 가 best result 와 동등*. 즉 *모델 비교 의미 X*.

→ 본 논문 결론: **Exchange-rate 는 *모델 비교 benchmark 부적합***.

## 9.2.6 *제외* 된 baseline 종류 — Traditional models

본 논문이 *전통 모델* (LSTM, TCN, DeepAR, ARIMA) 을 *baseline 에 포함 X*:

| Model | Year | 종류 |
|-------|------|------|
| ARIMA | Box & Jenkins 1970 | 전통 통계 |
| LSTM | Hochreiter & Schmidhuber 1997 | RNN |
| TCN | Bai et al 2018 | CNN |
| DeepAR | Salinas et al 2020 | Autoregressive RNN |

**이유**: Informer (Zhou et al 2021) + Autoformer (Wu et al 2021) 가 *이미 입증* — *Transformer-based models 가 traditional models 보다 long-term forecasting 에서 능가*. 따라서 *Transformer baseline 5종* 만 비교하면 *충분*.

## 9.3 7 Baseline 모델

본 논문이 비교한 *baseline*:

### 1. DLinear (Zeng et al, AAAI 2023)

- **종류**: Linear (no Transformer).
- **메시지**: "*Linear 가 Transformer 보다 낫다*" 도전 paper.
- **본 논문에서 의 역할**: *가장 강한 baseline*.

### 2. FEDformer (Zhou et al, ICML 2022)

- **종류**: Transformer + Fourier domain attention.
- **이전 SOTA**.

### 3. Autoformer (Wu et al, NeurIPS 2021)

- **종류**: Transformer + Auto-correlation + Decomposition.
- **유명 baseline**.

### 4. Informer (Zhou et al, AAAI 2021)

- **종류**: Transformer + ProbSparse attention.
- **Transformer 시계열의 origin**.

### 5. Pyraformer (Liu et al, ICLR 2022)

- **종류**: Transformer + Pyramidal attention.
- **Hierarchical 변형**.

### 6. LogTrans (Li et al, NeurIPS 2019)

- **종류**: Transformer + LogSparse attention.
- **Early Transformer 시계열**.

### 7. Reformer (Kitaev et al, ICLR 2020)

- **종류**: Transformer + LSH attention.
- **Memory efficient 변형**.

---

## 9.4 *실험 setup*

### Train / Validation / Test 분할

각 dataset 의 시계열을 *시간 순서대로* 분할:
- *Train*: 처음 70%.
- *Validation*: 다음 10%.
- *Test*: 마지막 20%.

**중요**: *Time order 유지* — *future data 가 train 에 포함 X* (data leakage 방지).

### 4 Forecasting Horizons

각 dataset 에서 *4 가지 미래 timestep* 예측:
- **ILI 제외 7 datasets**: $T \in \{96, 192, 336, 720\}$ — 단기 (96) ~ 장기 (720).
- **ILI 만**: $T \in \{24, 36, 48, 60\}$ — *주 단위* 데이터라 *짧은 horizon*.

**일상 비유**: 시간 단위 데이터 (Traffic, Electricity 등) 는 *수십 일 앞* 예측. 주 단위 데이터 (ILI 인플루엔자) 는 *수십 주 앞* 예측 — *시간 척도 자체가 다름*.

### Baseline result collection — 공정 비교

본 논문이 *공정한 baseline 비교* 위한 protocol:
- *원본 paper 의 result* 사용 (Zeng et al 2022 의 reproduction).
- *Default L = 96* (Transformer baseline) 또는 *L = 336* (DLinear).
- 추가: FEDformer/Autoformer/Informer 를 *6 가지 L* ($L \in \{24, 48, 96, 192, 336, 720\}$) 에서 *다시 실행* → *각 dataset 마다 best L 선택*.
- 이유: baseline 들이 *L 의 영향* 으로 *과소평가* 되지 않도록 — *strong baseline* 만들기.

### Hyperparameters

본 논문 default:
- *Look-back window L*: 336 (PatchTST/42) or 512 (PatchTST/64).
- *Patch length P*: 16.
- *Stride S*: 8.
- *Transformer*: 3 layer × 16 head × D=128.
- *Ridge / dropout*: 표준.

### Metric

**MSE + MAE** 두 metric. *낮을수록 좋음*.

---

## 9.5 자기점검

### 핵심 3가지
1. **8 dataset 의 *다양성* 의의?**
2. **DLinear 가 *가장 강한 baseline* 인 이유?**
3. **Train/Validation/Test 분할 의 *time order* 중요성?**

### 답변
1. **8 dataset = 날씨 (Weather) + 교통 (Traffic) + 전력 (Electricity, ETT) + 의료 (ILI)**. M = 7 (작음, ETT) ~ 862 (큼, Traffic). 시간 단위 10분 ~ 주. *광범위한 domain 의 universality* 검증 — *PatchTST 가 특정 분야만 잘 되는 게 아니라 *모든 도메인* 에서 best*.
2. **DLinear (2023) 가 "Transformer 시계열 X" 도전 + *간단한 linear 모델 로 Informer/Autoformer/FEDformer 능가***. 즉 *가장 강한 baseline* — *복잡한 Transformer 변형* 보다도. PatchTST 가 *DLinear 도 능가* 함으로써 *진짜 universal SOTA* 증명.
3. **Time series 에서는 *future data 가 train 에 포함되면 안 됨* — data leakage**. 따라서 분할은 *시간 순서대로*: train (처음 70%) → validation (다음 10%) → test (마지막 20%). 일반 random shuffle 분할은 *cheating* — *미래 정보 활용*. 본 논문이 *purely time-ordered* 분할 사용 → *실증 결과 trustworthy*.

---

다음 챕터: [10_supervised_results.md](10_supervised_results.md) — Supervised 결과 (이미 rewrite 완료).
