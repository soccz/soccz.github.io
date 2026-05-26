# 10a. 자문 질문 5개

> **🧒 한 줄 요약**: 10 open question: dynamic kernel choice, non-stationary FFT, channel-aware extension, multi-scale embedding.


---

## 질문 1: "FFT 진폭이 아닌 *예측 기여도*로 주기를 가중할 수 있는가?"

TimesNet의 가중치 $w_i = \text{softmax}(A_{b,f_i})$는 FFT 진폭(입력 신호에서 그 주파수가 얼마나 강한가)을 기반으로 한다. 그러나 입력에서 진폭이 작은 주기가 예측에는 결정적으로 중요할 수 있다 — 예를 들어 드문 계절성 충격, 드문 주간 패턴.

**왜 이 질문이 중요한가**: 현재 가중치 설계는 *입력 표현*에 충실하지만, *예측 태스크*에는 최적이 아닐 수 있다. 가중치를 task-adaptive하게 학습하려면 추가 파라미터가 필요하다. 하지만 이렇게 하면 FFT 진폭을 쓰는 것의 장점(학습 불필요, 입력마다 즉시 계산)을 잃는다. 이 트레이드오프는 "데이터 드리븐 표현 vs 태스크 드리븐 최적화" 간의 근본 긴장이며, Grokking 트랙의 "inductive bias vs learned representation" 질문과 직접 맞닿는다.

---

## 질문 2: "2D 변환 후 Inception Block이 실제로 intraperiod와 interperiod를 분리해서 학습하는가?"

TimesNet의 핵심 주장은 2D 변환이 intraperiod(column 방향)와 interperiod(row 방향) 정보를 공간적으로 분리한다는 것이다. 그러나 2D CNN(Inception Block)이 실제로 이 방향 구분을 활용하는지는 실험적으로 확인되지 않았다.

**왜 이 질문이 중요한가**: row 방향만 보는 커널(intraperiod 전문)과 column 방향만 보는 커널(interperiod 전문)이 독립적으로 존재한다면, TimesNet의 주장이 맞다. 그러나 Inception Block이 실제로는 대각선 방향을 주로 활용한다면, 2D 변환이 의도한 분리가 학습에서 실현되지 않는 것이다. APF 트랙의 CNN 프로브 방향으로, Inception Block의 activated filter 패턴을 시각화하는 실험이 필요하다. 이 질문에 답하지 않으면 "왜 2D CNN인가"라는 반박에 실증적으로 대응할 수 없다.

---

## 질문 3: "k=1 (주기 하나)과 k=3 (주기 세 개)의 성능 차이는 어느 데이터에서 가장 크고, 왜인가?"

저자들은 k에 대해 안정적이라고 주장하지만, 안정성의 *범위*와 *데이터 의존성*이 중요하다. M4 데이터셋처럼 다양한 빈도(시간별·일별·월별)가 섞인 경우, 단일 주기로는 데이터의 복잡성을 포착하지 못할 것이다. 반면 단일 강한 주기를 가진 기상 데이터에서는 k=1도 충분할 수 있다.

**왜 이 질문이 중요한가**: k의 역할이 데이터셋마다 다르다면, TimesNet의 "k에 안정적"이라는 주장은 *평균적* 주장이지 *보편적* 주장이 아니다. Exchange-Rate처럼 지배 주기가 없는 데이터에서 k를 늘리는 것이 오히려 노이즈 주기를 추가하는 역효과를 낼 수 있다. 이 질문은 "TimesNet이 어떤 데이터에 적합한가"를 정확히 한정짓는 데 핵심이다.

---

## 질문 4: "TimesNet의 2D 표현에서 비주기적 트렌드는 어디에 인코딩되는가?"

FFT로 탐지된 주기로 접은 2D 텐서에서, *순수한 트렌드*(단조증가, 레짐 변화)는 어느 2D 구조를 만드는가? 예를 들어 선형 증가 트렌드를 주기 $p$로 접으면 각 row가 이전 row보다 전체적으로 높은 값을 가지는 형태 — row 방향의 gradient가 된다. 이것을 Inception Block이 포착하는가?

**왜 이 질문이 중요한가**: 트렌드는 시계열 예측에서 가장 중요한 구조 중 하나다. 그런데 TimesNet은 FFT(주기 성분)로 2D 변환을 설계했기 때문에, 트렌드의 2D 인코딩이 *의도하지 않은 부산물*이다. 트렌드가 2D 텐서에서 어떻게 표현되는지 이해하면, TimesNet이 트렌드를 처리하는 메커니즘을 APF처럼 circuit 분석으로 추적할 수 있다.

---

## 질문 5: "CKA(Centered Kernel Alignment, 중심화 커널 정렬) 분석 결과 — 예측과 이상탐지가 early layers를 주로 쓴다는 것이 무엇을 의미하는가?"

저자들의 CKA 분석에 따르면 예측과 이상탐지는 초기 층(early TimesBlock)의 표현을 주로 사용하고, 보완과 분류는 층을 거칠수록 표현이 크게 변한다(hierarchical). 이 패턴은 직관적이지 않다 — 예측이 가장 어려운 태스크인데 왜 early layers로 충분한가?

**왜 이 질문이 중요한가**: 이 결과의 한 해석은 "예측과 이상탐지는 low-level 주기 패턴 복원으로 충분하고, 보완과 분류는 고차 추상화가 필요하다"는 것이다. 다른 해석은 "CKA가 어떤 층이 *정보*를 담는지보다 어떤 층이 *변환*을 많이 하는지를 측정하므로, 예측에서 early layers가 이미 충분히 변환을 완료한다"는 것이다. 이 두 해석을 구분하는 실험 — activation patching으로 각 TimesBlock 층의 인과적 기여를 측정하는 것 — 이 Grokking/APF 메서드와 직접 연결된다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Dynamic kernel 의 *NAS approach*?**
2. **Wavelet / STFT 의 *non-stationary alternative*?**
3. **Channel-aware TimesNet 의 *architectural change*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
