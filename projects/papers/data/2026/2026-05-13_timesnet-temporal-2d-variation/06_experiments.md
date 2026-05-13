# 06. 실험 해부

> **배경 사다리**: ① MSE(Mean Squared Error, 평균제곱오차) = 예측값과 실제값 차이의 제곱 평균 — 큰 오차에 민감. ② MAE(Mean Absolute Error, 평균절대오차) = 예측값과 실제값 차이의 절덧값 평균 — 직관적. ③ SMAPE(Symmetric Mean Absolute Percentage Error) = 백분율 오차 기반 지표, 단기 예측 평가에 많이 쓰임.

---

## 태스크 1: 장기 예측 (Long-term Forecasting)

### 사용 데이터셋

| 데이터셋 | 설명 | 채널 수 | 주기 특성 |
|---------|------|--------|-------|
| ETTh1, ETTh2 | 변압기 온도·전력 (시간 단위) | 7 | 일·주·계절 주기 |
| ETTm1, ETTm2 | 변압기 온도·전력 (15분 단위) | 7 | 동일, 더 저밀한 해상도 |
| Weather | 21개 기상 변수 | 21 | 강한 일·계절 주기 |
| Traffic | 도로 점유율 (862개 센서) | 862 | 일·주간 주기 |
| Electricity | 전력 소비 (321개 소비자) | 321 | 일·주간 주기 |
| Exchange-Rate | 8개국 환율 | 8 | **주기 미약** — 금융 도메인 |
| ILI | 독감 유사 질환 비율 | 7 | 강한 계절 주기 |

**데이터셋 선택의 함의**: ETT·Weather·Traffic·Electricity는 모두 강한 주기성을 가진다 — TimesNet의 FFT 주기 탐지가 효과적인 도메인이다. Exchange-Rate는 의도적으로 포함된 "어려운" 케이스다. 주기가 약한 금융 환율 데이터에서 TimesNet의 성능이 어떻게 달라지는지가 중요한 신호다.

### 예측 horizon

96, 192, 336, 720 시간 단계의 4개 horizon으로 평가. 입력 길이는 보통 96 또는 336 시간 단계.

### 주요 결과

- 전체 결과 수치: 원문 Table(PDF 직접 접근 불가) — 정확한 ETT MSE/MAE 수치는 원문 확인 필요.
- 검색 결과 확인: "TimesNet records first place in over 80% of all cases" for long-term forecasting (Time-Series-Library README)
- 주요 baseline: DLinear (2위), Non-stationary Transformer (3위), FEDformer, Autoformer
- **주의**: 2024년 이후 Time-Series-Library leaderboard에서 장기 예측 1위는 TimeMixer, iTransformer, TimeXer로 교체됨

**지표 선택에 대한 비판적 시각**: MSE와 MAE를 둘 다 보고하는 것은 타당하지만, 금융 응용에서는 방향성(directional accuracy)이나 분위수 점수(quantile score)가 더 중요할 수 있다. TimesNet은 이런 지표를 보고하지 않는다.

---

## 태스크 2: 단기 예측 (Short-term Forecasting, M4)

### M4 데이터셋

M4(Makridakis 4)는 100,000개의 다양한 빈도(시간별·일별·주별·월별·분기별·연별) 시계열을 포함하는 대규모 예측 경쟁 데이터셋. 매우 다양한 도메인과 패턴을 포함한다.

### 결과 (검색 결과 스니펳에서 확인)

| 지표 | TimesNet | 비고 |
|------|---------|------|
| SMAPE | 11.829 | (전체 빈도 평균) |
| MASE | 1.585 | (Mean Absolute Scaled Error) |
| OWA | 0.851 | (Overall Weighted Average — M4 공식 지표) |

**이 데이터셋이 적합한 이유**: M4는 실세계에서 나온 매우 다양한 시계열을 포함한다. 단일 아키텍첸의 범용성을 테스트하는 데 최적. TimesNet이 M4에서 SOTA를 달성했다는 것은 다양한 주기 구조를 가진 데이터에 일반화됨을 보인다.

---

## 태스크 3: 결측값 보완 (Imputation)

### 사용 데이터셋

ETTh1, ETTh2, ETTm1, ETTm2, Electricity, Weather에서 랜덤 마스킹(12.5%, 25%, 37.5%, 50% 비율).

### 지표

MSE, MAE (원문 수치 직접 확인 불가 — 원문 Table 필요).

### Time-Series-Library leaderboard 현황 (2024~2025)

Imputation 태스크에서 TimesNet이 **1위를 유지** (GitHub Time-Series-Library README 확인). 이는 주목할 만한 결과다 — 장기 예측에서는 추월당했지만, 보완에서는 여전히 선두.

**왜 보완에서 강한가**: 보완은 주변 맥락으로 빠진 값을 추정하는 문제다. TimesNet의 2D 구조가 "같은 주기의 다른 시점"(column 방향)과 "인접한 주기"(row 방향) 정보를 동시에 활용하면서, 결측 위치 주변의 주기적 구조를 잘 복원할 수 있다.

---

## 태스크 4: 이상 탐지 (Anomaly Detection)

### 사용 데이터셋 (5개 벤치마크)

| 데이터셋 | 도메인 | 설명 |
|---------|--------|------|
| SMD (Server Machine Dataset) | IT 서비스 모니터링 | 28개 서버, 38개 변수 |
| MSL, SMAP | 우주/지구 탐사 | NASA 데이터 |
| SWaT | 수처리 | 물 처리 시스템 51개 변수 |
| PSM | IT 모니터링 | eBay 내부 서버 |

### 지표

Precision, Recall, F1-Score

### 결과

Time-Series-Library leaderboard에서 Anomaly Detection 태스크 **1위 유지** (GitHub). 원문 수치(각 데이터셋별 F1) 직접 확인 불가.

**이상 탐지의 독특한 평가 방식**: 이상 탐지 벤치마크에서는 종종 "point-adjust"라는 후처리를 사용한다 — 이상 구간의 한 점을 맞추면 그 구간 전체를 맞춘 것으로 처리. 이 방식은 F1 점수를 인위적으로 높일 수 있어 논란이 있다. TimesNet이 이 방식을 사용하는지는 원문 확인 필요.

---

## 태스크 5: 분류 (Classification)

### 사용 데이터셋

UEA archive — 30개 다변량 시계열 분류 데이터셋. 의료, 제스첸, 음성, 교통 등 다양한 도메인.

### 지표

정확도(Accuracy)

### 결과

원문 수치 직접 확인 불가. GitHub README와 검색 결과 모두 "state-of-the-art" 주장.

---

## Ablation Study: k (top 주기 수) 민감도

검색 결과에서 확인된 ablation:

| 태스크 | 사용 k | 이유 |
|--------|--------|------|
| 단기 예측 | k=5 | 다양한 주기를 많이 볼수록 유리 |
| 결측 보완, 분류, 이상탐지 | k=3 | 안정적이고 충분함 |

**저자 설명**: "k에 대해 안정적인 성능을 보인다" — k가 1~5 범위에서 성능이 크게 달라지지 않음. 이는 모델이 k에 지나치게 민감하지 않음을 시사하나, ablation 수치 자체는 원문 Table 직접 확인 불가.

---

## CKA 표현 분석 (해석 실험)

### 실험 설계

여러 층의 TimesBlock 출력 사이의 CKA(Centered Kernel Alignment) 유사도를 태스크별로 비교.

### 관산 (검색 결과 스니펳 확인)

- **예측·이상탐지**: 초기 층 ~ 후기 층 간 CKA가 높음 → 층 간 표현이 크게 변하지 않음 → "low-level" 피처 재현(입력을 크게 변형하지 않고 보존)
- **보완·분류**: 층 간 CKA가 점차 낙아집 → 각 층이 다른 표현을 학습 → "hierarchical" 피처 추상화

**이 분석의 의미**: TimesNet이 단순히 모든 태스크에서 같은 방식으로 동작하는 것이 아니라, 태스크에 따라 표현의 깊이를 다르게 활용한다는 evidence. Foundation model의 초기 증거로 제시됨.

---

## 실험 설계의 공정성 평가

### 브이스라인 공정성

- 모든 baseline에 대해 동일한 입력 길이(96 또는 336 시간 단계)를 사용했는지 확인 필요
- DLinear 같은 단순 모델은 파라미터 수가 극히 작으므로, 파라미터 수 대비 성능 비교가 필요
- 원문 Appendix에 하이퍼파라미터 설정이 있을 것으로 예상되나 직접 확인 불가

### 숨어있는 편향

1. **데이터 선택 편향**: 강한 주기성을 가진 데이터셋(ETT, Weather, Traffic)이 많다 — TimesNet이 불리한 데이터셋(aperiodic, regime-shifting)은 덜 포함되어 있다. Exchange-Rate가 예외적으로 포함됐으나, 이 데이터에서의 성능은 두드러지지 않는다.
2. **시간점 편향**: 2023년 초 제출 시점의 비교. 이후 등장한 PatchTST, iTransformer는 포함되지 않았다.
3. **태스크 간 비일관성**: 각 태스크마다 서로 다른 데이터셋, 서로 다른 baseline을 사용한다. "5개 태스크에서 SOTA"는 5개의 서로 다른 비교 실험의 결과지, 단일 통합 벤치마크가 아니다.

### 재현성 평가

| 항목 | 상태 |
|------|------|
| 코드 공개 | ✓ thuml/TimesNet, thuml/Time-Series-Library |
| 데이터 공개 | ✓ ETT, M4, Weather, Traffic 등 모두 공개 데이터 |
| 하이퍼파라미터 | 원문 Appendix에 있을 것으로 예상 (직접 확인 불가) |
| 평균·분산 보고 | 불명확 — 원문 표에서 단일 run인지 복수 run인지 확인 불가 |
| 재현 난이도 | 낙음 — Time-Series-Library에 표준 재현 스크립트 포함 |

**중요한 재현성 주의사항**: Time-Series-Library의 TimesNet 구현은 원래 thuml/TimesNet 코드를 통합한 것이다. 그러나 2024년 이후 leaderboard 업데이트와 함께 구현이 미묘하게 변경되었을 수 있다. 정확한 재현을 위해서는 ICLR 2023 제출 당시의 코드를 사용해야 한다.
