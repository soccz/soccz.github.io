# 03. 문제 지형도

> **🧒 한 줄 요약**: Multi-period TS의 *long-range dependency*. 1D Conv 의 receptive field 한계.


> **배경 사다리**: ① 시계열(time series) = 시간 순서로 기록된 측정값의 수열. ② 푸리에 변환(Fourier Transform) = 신호를 주파수 성분으로 분해하는 것 — "이 곡이 어떤 음표(진동수)로 이뤄졌는가"를 보는 것. ③ 합성곱 신경망(CNN, Convolutional Neural Network) = 이미지의 지역 패턴을 감지하는 인공신경망 구조.

---

## 실제 문제가 현실에서 어떻게 생기는가

### 상황 1: 기온 예측

기상청이 72시간 뒤 기온을 예측하고 싶다. 기온 데이터에는 **하루 주기**(낙이 따뜻하고 밤이 추다), **주간 주기**(주말 도시열섬 효과 감소), **계절 주기**(여름↔겨울)가 동시에 존재한다. 단순히 "최근 24시간만 보겠다"고 하면 계절 효과를 놓치고, "1년치 데이터 전체를 평탄하게 보겠다"고 하면 오늘 하루의 미세한 변동을 놓친다. **단기(intraperiod)와 장기(interperiod)를 동시에 처리하는 방법**이 필요하다.

### 상황 2: 산업 센서 이상 탐지

제조 공장 센서가 수체 채널을 1초에 한 번씩 기록한다. 정상 기계는 분당·시간당 규칙적인 진동 패턴을 보인다. 이상이 생기면 이 주기 패턴이 무너진다. 이상 탐지기가 "이 데이터는 평소와 다르다"를 판별하려면 **주기 내부 패턴의 변화(intraperiod anomaly)**와 **주기 간 추세의 변화(interperiod anomaly)** 둘 다 감지해야 한다.

### 상황 3: 임상 시계열 결측 보완 (도메인 무관 예시)

ICU 환자 바이탈 신호가 장비 오류로 3분간 누락됩다. 이를 채우려면 "이 환자는 보통 이 시간대에 어떤 패턴을 보이는가(intraperiod)"와 "지난 몇 일간 어떤 추세였는가(interperiod)"를 모두 고려해야 한다.

---

## 기존 접근 계보

### 1세대: 전통 통계 모델 (ARIMA, Exponential Smoothing, ~2010)

**무엇이었나**: ARIMA(자기회귀 통합 이동평균 — 과거 값과 오차의 선형 조합으로 다음 값을 예측)는 수십 년간 TS 예측의 표준이었다. TBATS 같은 확장은 다중 주기성을 처리할 수 있었다.

**왜 부족했나**: 선형 가정에 갇혀 있어 비선형 패턴을 잡기 어렵다. 다중 변량(여러 채널)을 통합하는 데 약하다. 특히 긴 입력 시퀀스에서 장기 의존성(long-term dependency)을 잡는 데 구조적 한계가 있다.

**교훈**: 주기성을 명시적으로 모델링하는 것 자체는 좋은 아이디어지만, 비선형 + 다변량 + 대규모 데이터에서는 딥러닝이 필요하다.

---

### 2세대: RNN·LSTM 계열 (~2015~2019)

**무엇이었나**: LSTM(Long Short-Term Memory — 게이트 구조로 장기 기억을 유지하는 순환신경망)은 시계열 딥러닝의 첫 번째 대세였다. DeepAR(Amazon, 2017)은 LSTM에 확률적 예측을 결합해 실용성을 높였다.

**왜 부족했나**: 순차(sequential) 처리 구조 때문에 병렬화가 어렵고 훈련이 느리다. LSTM도 매우 긴 시퀀스(T=720 이상)에서 장기 의존성 소실 문제가 남는다. 1D 합성곱 커널의 수용 범위(receptive field)가 제한적이다.

**교훈**: 순환 구조보다 병렬 처리 가능한 구조가 필요하다 → Transformer로 이어집.

---

### 3세대: Transformer 계열 (Informer→Autoformer→FEDformer, 2020~2022)

**무엇이었나**: Transformer(Vaswani 2017)의 Self-Attention이 TS에 도입되었다. **Informer**(Zhou et al., AAAI 2021)는 ProbSparse Attention으로 O(T log T)로 복잡도를 줄였다. **Autoformer**(Wu et al., NeurIPS 2021 — THUML)는 Auto-Correlation 메커니즘으로 주기적 의존성을 찾았다. **FEDformer**(Zhou et al., ICML 2022 — THUML)는 주파수 도메인 분해로 효율성을 높였다.

**왜 부족했나**: 이 모델들은 모두 **1D 시퀀스를 1D로 처리**한다는 패러다임 안에 있다. Attention이 장거리 의존성을 처리하더라도, **intraperiod 패턴(한 주기 내의 세밀한 형태)**과 **interperiod 패턴(주기 간 추세)**을 동시에, 명시적으로, 효율적으로 처리하는 메커니즘이 없다. 또한 여러 논문(DLinear, Zeng et al. AAAI 2023)이 "단순 선형 모델이 복잡한 Transformer보다 낙다"는 충격적인 결과를 보고하면서, 기존 TS Transformer의 설계 원칙에 의문이 제기되었다.

**교훈**: Transformer의 Attention이 1D 시계열을 그대로 받는 한, 시계열 고유의 **주기적 구조**를 충분히 활용하지 못한다. 입력 표현(representation)을 바꽐야 한다.

---

### 4세대 도전자: "단순성의 반격" (DLinear, PatchTST, 2022)

**무엇이었나**: **DLinear**(Zeng et al., AAAI 2023)는 단순 선형 회귀가 복잡한 Transformer를 이긴다는 결과로 충격을 줌다. **PatchTST**(Nie et al., ICLR 2023)는 시계열을 패치(작은 구간)로 잘라 Transformer에 입력해 국지적 패턴을 포착했다.

**왜 이것으로도 부족한가**: DLinear는 비선형 패턴을 처리 못 한다. PatchTST는 단일 고정 패치 크기를 사용해 다중 주기 구조를 동시에 다루지 못한다. 5개 태스크를 단일 아키텍첸로 커버하는 범용성이 부족하다.

---

## 공통으로 놓친 핵심 Gap

> **기존 모든 방법은 시계열을 1D 수열로만 다루기 때문에, 실세계 시계열이 진닌 "다중 주기가 격치는 2D 구조"를 모델이 자연스럽게 활용할 수 없다.**

단기 패턴(intraperiod)을 보려면 짧은 수용 범위가 필요하고, 장기 패턴(interperiod)을 보려면 긴 수용 범위가 필요하다. 이 두 가지를 **동시에, 단일 메커니즘으로** 해결한 방법이 없었다.

---

## TimesNet이 Gap을 메우는 방식

TimesNet은 1D 시계열을 FFT로 탐지한 지배 주기에 따라 2D 텐서로 "접는다". 이 접기(folding) 연산 하나로:
- 2D 텐서의 **열(column)** = intraperiod 방향 — 한 주기 안의 패턴
- 2D 텐서의 **행(row)** = interperiod 방향 — 주기 간 추세

두 축이 자연스럽게 분리되고, 2D 합성곱 커널이 두 축을 동시에 볼 수 있다. 복잡한 Attention 계산 없이 O(T log T)(FFT) + O(T)(2D Conv)으로 효율적이다.

5개 태스크 모두를 같은 TimesBlock 위에 다른 head를 얹어 처리함으로써 "범용 TS 분석 백본"이라는 새로운 포지션을 확보한다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Multi-period의 *long-range 한계*?**
2. **Conv1D 의 *receptive field* 부족?**
3. **Frequency analysis 의 *natural fit*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
