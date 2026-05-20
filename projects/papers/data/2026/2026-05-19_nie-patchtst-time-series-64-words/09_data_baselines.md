# 09. 데이터셋 + Baseline 모델 — 실험 setup

> 본 논문이 사용한 *8 datasets* + *7 baseline 모델*. 무지식자 친화로.

---

## 9.1 챕터 한 줄 요약

> **"8 datasets (다양한 domain) + 7 baseline (전통 + Transformer + Linear) = *광범위 검증*. PatchTST 가 *거의 모든 cell 에서 best*."**

---

## 9.2 8 Datasets — 다양한 domain

본 논문이 *광범위한 dataset 비교* 위해 8 개 사용:

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
- T = 96 (단기).
- T = 192.
- T = 336.
- T = 720 (장기).

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
