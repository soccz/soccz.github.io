# 07. 가정·한계·반박

---

## 명시된 가정

논문(직접 접근 불가)과 코드에서 명백히 드러나는 가정들:

1. **다중 주기성 가정**: 실세계 시계열은 FFT로 탐지 가능한 지배적인 주기를 가진다. 코드의 `FFT_for_Period`가 이를 전제한다.
2. **공통 주기 가정**: 모든 채널(변수)이 같은 지배 주기를 공유한다 (`abs(xf).mean(0).mean(-1)` — 채널 평균).
3. **전역 정상성 가정**: FFT는 시퀀스 전체 구간에 걸쳐 주기가 일정하다고 가정한다.
4. **정수 주기 가정**: `period = T // freq_idx`로 정수 주기를 계산한다. 비정수 주기는 근사된다.

---

## 암렵적 가정 (저자가 명시하지 않은 것)

### 암렵적 가정 1: "2D CNN이 시계열 2D 구조를 학습할 수 있다"

TimesNet은 ImageNet 등 자연 이미지로 사전 학습된 CNN을 사용하지 않는다. Inception Block은 무작위 초기화에서 학습된다. 핵심 가정은 "시계열을 2D로 접었을 때 생기는 구조(intraperiod/interperiod)를 2D CNN이 데이터에서 새로 학습할 수 있다"는 것이다. 이것이 항상 성립하는지는 데이터 크기와 태스크에 의존한다.

### 암렵적 가정 2: "FFT 진폭이 큰 주기가 곳 예측에 유용한 주기다"

가중합 가중치 $w_i = \text{softmax}(A_{b,f_i})$는 FFT 진폭을 기준으로 한다. 그러나 진폭이 작더라도 예측에 결정적으로 중요한 주기가 있을 수 있다 (예: 드물지만 큰 영향을 미치는 계절성). 이 가중치는 입력의 주파수 구성을 반영하지, 예측 태스크에서의 정보 가치를 반영하지 않는다.

### 암렵적 가정 3: "Transformer가 아닌 2D CNN이 이 표현에 더 적합하다"

저자는 2D CNN(Inception Block)을 선택했지만, 동일한 2D 표현에 2D Attention이나 다른 구조를 적용했을 때 더 나을 수 있다. 이 설계 선택의 비교 실험이 없다.

### 암렵적 가정 4: "5개 태스크가 동일한 표현 학습에서 이득을 본다"

TimesBlock은 모든 태스크에서 공유되지만, CKA 분석이 보이듯 각 태스크는 다른 층을 주로 활용한다. 멀티태스크 학습 없이 태스크별로 독립 훈련을 하므로, "범용 backbone"이라는 표현은 아키텍처의 공유이지 파라미터의 공유가 아니다.

---

## 반박 가능한 지점

### 반박 1: "Exchange-Rate 같은 금융 데이터에서는 FFT 주기 탐지가 무의미하다"

**반박의 핵심 주장**: 금융 시계열(특히 환율, 주가)은 명확한 주기성이 없다. 단기 추세, 뉴스 충격, 레징 변화가 주된 구조다. FFT로 탐지된 "주기"는 실제로는 노이즈에서 나온 허위 주기(spurious periodicity)일 수 있다.

**실험적 검증 방법**:
- Exchange-Rate 데이터에서 TimesNet의 FFT가 실제로 어떤 주기를 탐지하는지 시각화한다.
- 탐지된 주기 $p$로 데이터를 reshape했을 때 2D 구조에 의미 있는 패턴(예: 대각선, 블록)이 존재하는지 확인한다.
- 주기 탐지를 비활성화하고 (k=1, 고정 주기) 성능 변화를 측정한다.
- PatchTST (고정 패치 크기, 주기 탐지 없음)와의 직접 비교에서 Exchange-Rate 성능을 분리 보고한다.

**현재 상태**: 원문이 Exchange-Rate를 포함한 여러 데이터셋을 통합한 SOTA를 보고하지만, Exchange-Rate 단독 성능 비교는 두드러지지 않는다.

---

### 반박 2: "같은 수의 파라미터로 단순한 구조(DLinear, PatchTST)가 비슷하거나 나은 성능을 낼 수 있다"

**반박의 핵심 주장**: DLinear (Zeng et al., AAAI 2023)는 "단순 선형 모델이 복잡한 Transformer보다 낙다"를 보였다. TimesNet은 DLinear보다 훨씬 복잡하다(FFT + 2D Conv + Inception Block + Residual). 파라미터 효율성 관점에서 복잡성이 정당화되는가?

**실험적 검증 방법**:
- 동일한 파라미터 수 (parameter budget)로 TimesNet vs DLinear vs PatchTST를 비교.
- FLOPs(부동소수점 연산 수)와 추론 시간(inference latency)을 보고.
- 데이터셋 크기가 작을 때 (ETT-mini, 소규모 TS) TimesNet의 복잡도가 오히려 과적합을 유발하는지 확인.

**현재 상태**: TimesNet은 파라미터 수 비교를 주된 결과로 제시하지 않는다.

---

### 반박 3 (추가): "2024년 이후 더 단순한 패치 기반 모델이 여러 태스크에서 TimesNet을 추월했다"

**근거**: Time-Series-Library leaderboard에서 장기 예측 1위는 현재 TimeXer, iTransformer, TimeMixer (검색 결과 확인). TimesNet이 2024년 이후에도 "5개 태스크 통합 SOTA"를 유지하는지는 불명확하다. Imputation과 Anomaly Detection은 여전히 1위를 유지하지만, 이 두 태스크가 TimesNet의 2D 구조에 특히 유리한 이유가 있다 — 맥락 복원(context reconstruction)에서 2D 구조가 명확한 이점을 가지기 때문이다.

---

## 재현성 평가

| 항목 | 상태 |
|------|------|
| 코드 공개 | ✓ thuml/TimesNet, thuml/Time-Series-Library |
| 데이터 공개 | ✓ ETT, M4, Weather, Traffic 등 모두 공개 데이터 |
| 하이퍼파라미터 | 원문 Appendix에 있을 것으로 예상 (직접 확인 불가) |
| 평균·분산 보고 | 불명확 — 원문 표에서 단일 run인지 복수 run인지 확인 불가 |
| 재현 난이도 | 낙음 — Time-Series-Library에 표준 재현 스크립트 포함 |

**중요한 재현성 주의사항**: Time-Series-Library의 TimesNet 구현은 원래 thuml/TimesNet 코드를 통합한 것이다. 그러나 2024년 이후 leaderboard 업데이트와 함께 구현이 미묘하게 변경되었을 수 있다. 정확한 재현을 위해서는 ICLR 2023 제출 당시의 코드를 사용해야 한다.
