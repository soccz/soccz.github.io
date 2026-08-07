# 5-a. 실험 해부 (1) — 지도학습 4종

> **배경 사다리**: ① "이진 분류"는 둘 중 하나를 고르는 문제(고양이냐 개냐). ② "에폭"은 학습 데이터를 한 번 다 훑는 것. ③ 이 논문의 실험 설계에서 가장 중요한 건 **"과제 하나"가 아니라 "과제 수천 개의 수열"**이 실험 단위라는 점이다.

---

## 5-a-1. Continual ImageNet — 이 논문의 주 무대 (Fig. 1)

### 데이터와 설계

Methods "Details of Continual ImageNet" 에서 확인한 구성:
- ImageNet **1,000 클래스, 클래스당 700 장** (600 훈련 / 100 테스트).
- 과제 하나 = **두 클래스를 골라 이진 분류**. 훈련 1,200 장, 테스트 200 장.
- 과제당 *"250 passes through the training set using mini-batches of size 100"* — 즉 250 에폭. 과제 하나를 **끝까지 학습시킨다**는 점이 중요하다.
- 망: *"three convolutional-plus-max-pooling layers, followed by three fully connected layers"*, 최종 층은 클래스 두 개에 대응하는 헤드 2개.
- 학습률: *"step sizes 0.01, 0.001 and 0.0001"*.
- 반복: *"30 runs for each hyperparameter value, varying the sequence of tasks."*

### 왜 이 데이터가 이 주장에 적합한가

세 가지 이유로 잘 골랐다.

**첫째, 과제 공급이 사실상 무한하다.** 본문 verbatim: *"With the 1,000 classes in our dataset, we were able to form half a million binary classification tasks in this way."* 50만 개의 과제를 만들 수 있으므로 **실험 지평이 데이터에 의해 제약되지 않는다.** 5,000 과제까지 밀어붙여도 과제 재사용이 없다. 이건 "과제가 반복돼서 외운 것 아니냐"는 반론을 구조적으로 차단한다.

**둘째, 과제 난이도가 통계적으로 균질하다.** 무작위 클래스쌍이므로 100번째 과제와 2,000번째 과제의 기대 난이도가 같다. 따라서 성능 하락을 "후반 과제가 어려워서"로 설명할 수 없다. `04_claims_a_core.md` 에서 지적한 숨은 전제 1 을 저자들이 나름대로 방어한 방식이다.

**셋째, 각 과제가 개별적으로는 쉽다.** 이진 분류 88% 는 어려운 문제가 아니다. 즉 망의 용량 부족이 아니라 **학습 능력의 소진**이 원인임을 분리하기 좋다.

### 숨은 편향 — 내가 보는 두 가지

**편향 1 — "과제당 250 에폭"은 매우 공격적이다.** 1,200 장을 250 번 반복하면 심한 과적합 체제다. 이 설정은 가중치를 크게 키우고 유닛을 극단으로 특화시키는 방향으로 압력을 준다. 즉 **가소성 상실을 관측하기에 유리한 조건**일 수 있다. 실무의 연속학습은 보통 과제당 몇 에폭이다. 이게 현상을 만들어낸 게 아니라 **가속시킨 것**이라는 게 저자들의 암묵적 입장이겠지만, "과제당 에폭 수"를 축으로 놓은 스윕은 확인된 본문 범위에 없다.

**편향 2 — 헤드 재사용 여부.** 매 과제마다 클래스쌍이 바뀌는데 출력 헤드 2개는 유지된다. 그렇다면 헤드의 의미가 매번 바뀐다 (이번엔 "고양이 vs 개", 다음엔 "비행기 vs 바나나"). 이 출력층의 극심한 비정상성이 하위 층으로 얼마나 전파되는지는 별도 분석 대상이다. 헤드만 매번 재초기화하는 대조군이 자연스러운 통제인데, 확인된 본문 범위에는 없다.

### 주요 그림 해석

**Fig. 1b** — 표준 역전파, 학습률 3종. 캡션 verbatim: *"the conventional backpropagation algorithm loses plasticity at all step sizes (b)"*. 이 패널의 수사적 기능은 "학습률만 잘 고르면 되는 것 아니냐"를 죽이는 것이다. 본문의 *"for all values of the step-size parameter"* 와 짝을 이룬다.

**Fig. 1c** — 연속 역전파 / L2 / Shrink and Perturb. 캡션 verbatim: *"maintain plasticity, apparently indefinitely (c)"*. **"apparently"** 라는 부사가 붙어 있다는 점을 놓치면 안 된다 — 5,000 과제까지 관측했다는 것이지 무한을 증명한 게 아니다. 저자들의 조심스러운 어휘 선택이다.

**본문 성능 궤적** verbatim: *"performance first improves and then falls substantially, ending near or below the linear baseline"*. **먼저 올라갔다가 떨어진다**는 이 U 자 반전이 핵심이다. 단조 하락이었다면 "그냥 계속 나빠지네"로 읽혔을 텐데, 상승 국면이 있다는 건 초기엔 전이 학습이 실제로 이득이었다는 뜻이고, 따라서 **같은 메커니즘(누적)이 어느 지점에서 부호를 바꾼다**는 더 흥미로운 주장이 된다.

---

## 5-a-2. class-incremental CIFAR-100 — 가장 실무적인 실험 (Fig. 2)

### 설계 (Methods "Class-incremental CIFAR-100")

- **ResNet-18** (*"18-layer deep residual network"*, 세부는 Extended Data Table 1).
- 5 클래스로 시작해 5 개씩 추가, 100 개까지. 매번 출력 유닛 5개 추가.
- 증분마다 200 에폭, 총 *"4,000 epochs for all 20 increments"*.
- 학습률 스케줄이 증분마다 리셋: *"0.1 for the first 60 epochs"* → *"0.02 for the next 60 epochs"* → *"0.004 for the next 40 epochs"* → *"0.0008 for the last 40 epochs"*.
- 미니배치 90, SGD *"with a momentum of 0.9, a weight decay of 0.0005"*, **30 runs**.
- 하이퍼파라미터 선택(Methods 본문 서술): 기본 시스템 weight decay {0.005, 0.0005, 0.00005} 중 **0.0005**; Shrink and Perturb 노이즈 표준편차 {10⁻⁴, 10⁻⁵, 10⁻⁶} 중 **10⁻⁵**; 연속 역전파 성숙 임계치 {1,000, 10,000} × 교체율 {10⁻⁴, 10⁻⁵, 10⁻⁶} 중 **임계치 1,000, 교체율 10⁻⁵**.

### 왜 이 실험이 중요한가

Continual ImageNet 이 "현상 증명"이라면 이건 **"현실 침투 증명"**이다. 세 가지 이유다.

**① 실무에서 실제로 쓰는 구성이다.** ResNet-18 + SGD momentum + weight decay + 계단식 학습률 스케줄은 컴퓨터 비전의 표준 레시피 그 자체다. 여기서도 무너진다면 "특이한 설정에서만 나타나는 현상"이라는 방어선이 사라진다.

**② weight decay 가 이미 켜져 있다.** 기본 시스템에 0.0005 의 weight decay 가 들어 있다. 즉 **L2 정규화가 있는 상태에서도 가소성이 무너졌다.** 이건 앞서 지적한 "L2 면 되는 것 아니냐"(Claim 4 의 긴장)에 대한 부분적 답변이다 — 표준 강도의 weight decay 로는 부족하다. 다만 논문이 이 논점을 명시적으로 이 실험과 연결지어 논증하지는 않는다.

**③ 비교 기준선이 강하다.** "매번 처음부터 재학습한 망(retrained network)"과 비교한다. 이건 연속학습이 이겨야 할 진짜 상대다 — 계산 비용을 무시한다면 언제나 쓸 수 있는 방법이니까. 결과 verbatim: *"By the end, when all 100 classes were available, the accuracy of the incrementally trained base system was 5% lower than the retrained network"*. **증분 학습이 재학습보다 5% 나쁘다.** 이게 이 논문에서 실무자에게 가장 아픈 숫자다.

### 그림 해석

**Fig. 2 캡션** verbatim: *"Initially, accuracy is improved by incremental training compared with a network trained from scratch, but after 40 classes, accuracy degrades substantially in a base deep-learning system."* **40 클래스**라는 전환점이 명시돼 있다. Continual ImageNet 의 U 자와 같은 구조이며, 두 실험이 서로 다른 데이터·아키텍처에서 같은 질적 패턴을 낸다는 점이 이 논문 논증의 힘이다.

**Fig. 2c,d** — Fig. 4 캡션이 *"compare with Fig. 2c,d"* 라고 지시하는 것으로 보아 내부 진단(죽은 유닛 / 유효 랭크 등) 패널이다. 지도학습과 강화학습에서 **같은 내부 신호**가 나온다는 게 저자들의 통합 논증이다.

---

## 5-a-3. Online Permuted MNIST — 축을 흔드는 실험

### 설계 (Methods "Robust loss of plasticity in permuted MNIST")

- 3 은닉층 피드포워드 망, 주 실험 층당 **2,000 유닛**, 크기 스윕 *"100, 1,000 and 10,000 units per layer"* (크기 스윕은 *"only 150 tasks"* 로 축소 실행).
- **800 개 과제**, 과제당 *"60,000 images one by one in random order"* — 온라인 학습(예제 하나씩).
- 활성함수·학습률 조합마다 *"100 independent runs"*.
- 변화 속도 스윕: 순열 교체를 *"after each 10,000, 100,000 or 1 million examples"*, 총량은 *"48 million examples in total"* 고정.

### 이 실험의 방법론적 역할

이건 결과를 보여주려는 실험이 아니라 **교란 변수를 하나씩 죽이는 실험**이다.

- **망 크기 스윕** → "더 큰 망을 쓰면 되지 않나"를 죽인다. 10,000 유닛도 무너진다면 용량 문제가 아니다.
- **변화 속도 스윕 (총 예제 수 고정)** → 이 설계가 특히 영리하다. 총 데이터량을 48M 으로 묶어두고 **"몇 번 바뀌었는가"만** 바꾼다. 만약 성능 저하가 단순히 "오래 학습해서"라면 세 조건이 같아야 한다. 다르다면 원인은 **변화의 횟수**다. 즉 이 실험이 "비정상성이 원인"이라는 주장의 핵심 통제다.
- **100 runs** → 통계적 신뢰도. Continual ImageNet 의 30 runs 보다 훨씬 많다 (문제가 가벼워서 가능).

### 숨은 편향

Permuted MNIST 는 **비정상성이 완전히 인공적**이다. 픽셀 순서를 무작위로 섞는 변화는 현실의 분포 이동과 구조가 다르다 — 현실의 변화는 보통 **국소적이고 부분적**이며(일부 특징만 바뀜), 순열 이동처럼 **모든 구조를 동시에 파괴하지 않는다.** 따라서 이 벤치마크는 비정상성의 **최악 사례**에 가깝다. 이건 강건성 논증에는 유리하지만("이렇게 극단적 조건에서도"), 실무 전이 논증에는 불리하다("현실이 이 정도로 험하진 않다"). 저자들이 Continual ImageNet 과 CIFAR-100 을 함께 놓은 이유가 여기 있다.

---

## 5-a-4. Slowly-Changing Regression — 활성함수 축 전담

### 설계 (Methods "Loss of plasticity with different activations in Slowly-Changing Regression")

- 입력: *"a binary vector of size m + 1"* — *"f slow-changing bits, m − f random bits and then one constant bit"*.
- 목표 함수: 은닉층 1개에 **LTU(linear threshold unit)** 활성, *"100 hidden units"*, 임계값 *"θᵢ = (m + 1) × β − Sᵢ"*.
- 학습 망: *"just five hidden units"* — **목표보다 훨씬 작다**.
- 비정상성: *"After every T examples, one of the first f bits is chosen uniformly at random"* 하여 뒤집는다.
- 규모: *"3 million examples"*, *"100 independent runs"*.
- 활성함수 6종: *"sigmoid, tanh, ELU, leaky ReLU, ReLU and Swish"*.

### 이 실험이 하는 일

**활성함수 축을 전담**하는 최소 실험이다. 왜 ImageNet 이 아니라 합성 회귀에서 했을까? 세 가지 이유가 보인다. ① 6개 활성 × 여러 학습률 × 100 runs 를 ImageNet 에서 돌리면 계산이 감당 안 된다. ② 목표 함수를 정확히 알므로 "이 문제는 원리적으로 풀 수 있다"가 보장된다. ③ 비정상성의 **속도 $T$ 를 정확히 제어**할 수 있다.

**학습 망이 목표보다 작다(5 유닛 vs 100 유닛)**는 설계가 특히 중요하다. 이건 의도적 **과소 파라미터화**다. 망이 목표를 완벽히 표현할 수 없으므로 항상 "더 배울 것이 남아 있고", 따라서 성능 정체를 "다 배워서"로 설명할 수 없다. 가소성 측정에 이상적인 조건이다.

**결과의 의미**: 이 실험 덕분에 논문은 "ReLU 를 안 쓰면 되는 것 아니냐"에 답할 수 있다. 죽은 유닛이 정의되지 않는 sigmoid/tanh 에서도 가소성이 상실된다면, 죽은 유닛은 **증상이지 원인이 아니다**. `05_method_d_diagnostics.md` 에서 지적한 "죽은 유닛은 필요조건이 아니다"의 실험적 근거가 정확히 여기다.

---

## 5-a-5. 지표 선택에 대한 총평

이 논문의 종속변수는 **"과제 n 에서의 온라인 정확도"**다. MSE 나 AUC 같은 통상적 선택지가 아니라 **"시간의 함수로서의 성능"** 이라는 점이 요점이다.

**다른 지표였다면 결론이 바뀌었을까?**
- **"최종 성능"만 봤다면** → 현상이 안 보인다. 이게 기존 문헌이 놓친 이유다.
- **"평균 성능"을 봤다면** → 초기 상승과 후기 하락이 상쇄돼 희석된다.
- **"수렴까지의 에폭 수"를 봤다면** → 오히려 더 직접적인 가소성 측정이었을 것이다. "가소성 = 배우는 능력"이라면 "얼마나 빨리 배우는가"가 더 정확한 조작적 정의다. 논문이 과제당 250 에폭으로 **끝까지 학습**시킨 뒤 최종 정확도를 보는 건, 학습 속도 저하와 학습 도달점 저하를 구분하지 않는다는 뜻이다. 두 가지는 실무적 함의가 다르다 (전자는 "기다리면 됨", 후자는 "못 배움"). 이건 이 논문 실험 설계의 실질적 아쉬움이다.

**Ablation 관점.** 저자들이 일부러 넣은 것은 명확하다 — 학습률·망 크기·활성함수·변화 속도·정규화 기법 축. 반면 **넣지 않은 것**도 읽힌다: 과제당 에폭 수 축, 무작위 선택 대조군(효용 함수의 필요성 검증), 헤드 재초기화 대조군, 트랜스포머 아키텍처. 앞의 셋은 저자에게 불리할 수 있는 통제이고, 마지막은 2023년 시점의 범위 설정으로 이해할 수 있다.
