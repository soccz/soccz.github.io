# 06_experiments — 실험 해부

**배경 사다리**: ① ETT(Electricity Transformer Temperature) 벤치마크가 전력 변압기의 온도·전력 로드 시계열 데이터(ETTh1/h2: 1시간 간격, ETTm1/m2: 15분 간격)임, ② CRPS(Continuous Ranked Probability Score)가 확률적 예측의 정확도 지표로 낮을수록 좋음, ③ 진행 중인 실험을 "ultra-fast mode"로 빠르게 돌렸다는 점이 결과 해석에 중요하다.

---

## 데이터셋

### ETT (Electricity Transformer Temperature)

- **출처**: 중국 두 지역의 전력 변압기 데이터
- **변수**: ETTh1/h2 — 7개 변수, 1시간 간격; ETTm1/m2 — 7개 변수, 15분 간격
- **특성**: 강한 일별/계절별 주기성 + 간헐적 돌발 충격(설비 과부하, 온도 급변)
- **왜 이 데이터인가**: TS 예측 연구의 표준 벤치마크 (Autoformer, PatchTST, iTransformer 등 대부분의 TSFM 논문이 사용). Chronos도 공개 평가에 이 데이터를 사용하므로 공정한 비교 가능.

**숨은 편향**: ETT는 특정 물리 시스템(전력 변압기)에 특화된 데이터다. 금융 시계열, 생체 신호, 소매 수요 등 다른 도메인에서 같은 결론이 나올지 보장이 없다. 특히 "주기보다 돌발 역학" 결론은 ETT의 특성(강한 계절성 대비 간헐적 충격이 모델 차별화 포인트)과 부합하지만, 다른 도메인에서는 반대일 수 있다.

---

## 실험 규모와 설정

### Ultra-Fast Mode의 의미

이 논문의 ablation 실험은 "ultra-fast ablation mode"로 수행됐다:
- 컨텍스트 윈도우: 최대 256개 (전체 ETT 데이터가 수천 개이므로 샘플링)
- 샘플 수(Chronos의 몬테카를로 샘플): num_samples = 4 (통상적으로 Chronos 논문은 20~100 사용)
- 예측 길이: 64 스텝

이는 워크숍 논문의 계산 제약을 반영한 것이다. 따라서 보고된 CRPS 수치들은 **참고 수준**이며 exhaustive 설정에서는 달라질 수 있다.

---

## 주요 실험 결과 해부

### 결과 1: 단일 특징 절제 — 레이어별 비교

| 레이어 | 평균 ΔCRPS | 최대 ΔCRPS | 최솟값 | 긍정 비율 |
|--------|-----------|-----------|--------|---------|
| encoder.block.5 (초기) | 3.0479 | 26.3161 (feat#1707) | 0.6587 | **100%** |
| encoder.block.11 (중간) | **5.1461** | **38.6073** (feat#4616) | 0.8347 | **100%** |
| encoder.block.23 (최종) | 3.7297 | 11.6467 (feat#7596) | 1.6584 | **100%** |

- **baseline CRPS**: block.5 = 1.3355, block.11 = 1.3920, block.23 = 1.3723

**해석**: 
- 중간 인코더가 세 레이어 중 평균·최대 모두에서 가장 높은 인과 중요도를 보인다.
- 최솟값도 중간 인코더(0.8347)와 초기 인코더(0.6587)가 유사한 반면, 최종 인코더(1.6584)는 최솟값도 더 높다 → 최종 인코더에서는 "덜 중요한" 특징이 없고 모두 일정 수준 기여함. 그러나 그 기여가 중간 인코더만큼 치명적이지 않음.
- 긍정 비율 100%: 어떤 특징도 예측을 개선하지 않는다(= 모두 기여). 이것이 Claim 1의 핵심 근거.

**특이점**: feat #4616 (block.11) 하나가 CRPS를 1.392 → 39.999로 만든다 (약 28.7배 증가). 이는 베이스라인 CRPS의 27배에 해당하는 단일 특징 의존성 — 극단적으로 중요한 "병목 특징(bottleneck feature)"의 존재를 시사한다.

### 결과 2: 특징 분류 분포 (taxonomy)

| 추출점 | interpretable 비율 | 상위 3개 개념 (갯수) |
|--------|------------------|-------------------|
| encoder.block.5 | 4.93% | frequency_high(97), high_volatility(68), level_shift_up(66) |
| encoder.block.11 | **25.84%** | level_shift_up(1,024), noise(413), high_volatility(268) |
| encoder.block.23 | **59.81%** | seasonality(1,439), level_shift_up(1,097), frequency_high(668) |
| decoder.block.11 | 3.06% | frequency_low(83), seasonality(33), low_volatility(33) |
| decoder.block.11.layer.1 | 4.15% | seasonality(91), frequency_low(82), low_volatility(43) |
| decoder.block.23 | 5.49% | low_volatility(94), frequency_low(93), seasonality(64) |

**해석**:
- **최종 인코더(59.81%)가 가장 해석 가능하지만 인과적으로 덜 중요** — "해석 가능성 ≠ 인과 중요도"의 핵심 증거.
- **중간 인코더의 top 개념이 level_shift_up(1,024개)**:  "level shift" = 시계열에서 갑자기 수준이 올라가는 사건. 이것이 Chronos의 핵심 기제가 "돌발 역학 감지"라는 주장의 직접 증거.
- **최종 인코더의 top 개념이 seasonality(1,439개)**: 가장 많은 계절성 특징이 여기에 모여 있지만, 이들을 제거해도 예측이 덜 나빠진다(심지어 개선) → 계절성 표현이 예측에 실제로 기여하는 것인지 의문.
- **디코더 레이어들의 낮은 해석 가능성(3~5%)**: T5 디코더는 자기회귀 생성에 특화되어 있어, 잔차 스트림의 특징이 인코더처럼 명확한 의미 단위로 조직되지 않을 수 있다.

### 결과 3: 점진적 절제 곡선의 비단조성

encoder.block.5의 점진적 절제에서 흥미로운 현상이 관찰된다:

| 절제 수 | CRPS |
|---------|------|
| 0 | 1.336 |
| 1 | 7.055 |
| 2 | 8.823 |
| 4 | 15.415 |
| 8 | **10.226** ← 4일 때보다 낮아짐 |
| 16 | 9.642 |
| 32 | 18.556 |
| 64 | 21.541 |

CRPS가 단조적으로 증가하지 않고 n=4에서 정점 후 n=8에서 감소한다. 이 비단조성의 가능한 해석:
1. **상호 상쇄 효과**: 특징들 사이에 redundancy가 있어, 하나를 제거하면 다른 특징이 보완하는데, 여러 개를 제거하면 전체 시스템이 재조정됨
2. **순서 의존성**: 디코더 노름 랭킹 순서로 제거할 때, 나중에 제거되는 특징이 앞서 제거된 특징의 부정적 효과를 부분적으로 상쇄하는 경우

---

## 베이스라인 공정성 평가

이 논문은 Chronos와 다른 모델을 직접 비교하지 않는다. 절제 실험에서의 비교 기준은:
- **Original Chronos (변형 없음)**: 베이스라인
- **SAE-patched Chronos**: SAE 특징 하나를 제거한 버전

즉, 이 논문은 *모델 간 비교*가 아닌 *동일 모델 내부의 특징 기여도 분석*이다. 공정성 문제는 발생하지 않지만, 대신 "다른 TSFM에서도 동일한 계층 구조가 나타나는가"는 미답이다.

---

## Ablation: 저자가 일부러 넣은 것 vs 숨긴 것

**명시적으로 한 것**:
- 3가지 SAE 변형 비교: VanillaSAE(L1), TopKSAE(primary), GatedSAE
- 팽창 비율 4x~32x 스윕
- 4가지 모델 크기(Mini/Small/Base/Large) 분석 (scaling)

**숨인 것/미보고된 것**:
- VanillaSAE vs TopKSAE vs GatedSAE의 ablation 결과 비교 수치 (어느 SAE가 더 나은 인과 특징을 발굴하는가?)
- 팽창 비율별 결과 차이
- 모델 크기별 계층 구조 차이 (Mini vs Large에서 계층이 다른가?)
- 각 데이터셋(ETTh1/h2/m1/m2)별 결과 분리 보고

---

## 수치 투명성

- 확인된 수치 (GitHub raw data): ΔCRPS 테이블 전체, taxonomy counts, progressive ablation curves
- 미보고 or 확인 불가: VanillaSAE/GatedSAE 결과 수치, ETT 데이터셋 분리 결과, scaling 분석 수치
- ultra-fast mode의 제약으로 전체 데이터 exhaustive 결과는 다를 수 있음
