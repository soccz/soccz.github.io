# 2. 문제 지형도 — 왜 "계속 배우기"가 안 되는가

> **배경 사다리**: ① 신경망 학습은 "예측이 틀린 만큼 가중치를 조금 되돌린다"는 규칙(역전파+경사하강)을 수없이 반복하는 것이다. ② "분포가 바뀐다(non-stationarity)"는 말은 어제까지 맞던 규칙이 오늘은 안 맞는다는 뜻이다. ③ 이 절의 핵심 구분은 **"성능이 나빠진다"와 "배우는 능력이 없어진다"가 다른 사건**이라는 것 — 이 둘을 섞으면 이 논문 전체를 오독하게 된다.

---

## 2.1 현실에서 이 문제는 어떻게 생기는가

**상황 A — 매일 재학습하는 추천/랭킹 시스템.** 실무에서 흔한 구성이다. 어제까지의 로그로 모델을 갱신하고, 오늘 다시 갱신하고, 내일 또 갱신한다. 처음 몇 달은 갱신할 때마다 지표가 좋아진다. 그런데 1년쯤 지나면 이상한 일이 벌어진다 — 새 트렌드가 등장했는데 모델이 그걸 학습하는 데 예전보다 훨씬 오래 걸린다. 팀은 보통 "데이터가 더 어려워졌나", "레이블 품질이 나빠졌나"를 의심한다. 이 논문은 세 번째 가능성을 제시한다: **모델 자체가 배우는 능력을 소진했다.** 그리고 이 가설이 맞다면 처방은 데이터 파이프라인이 아니라 **주기적 재초기화**다.

**상황 B — 환경이 변하는 강화학습 에이전트.** 논문의 Fig. 3 이 정확히 이 상황이다. 시뮬레이션 개미가 걷는 법을 배우는데, *"the coefficient of friction between the feet of the ant and the floor is changed after every 2 million time steps"* — 바닥이 미끄러워졌다 거칠어졌다 한다. 사람이라면 "아, 오늘은 미끄럽네" 하고 걸음걸이를 조정한다. 그런데 표준 PPO 에이전트는 첫 변화까지는 잘 하다가(*"PPO performed well (see the red line in Fig. 3c) for the first 2 million steps, up until the first change in friction"*) 그 뒤로 무너진다. Fig. 3 캡션은 이를 *"fails catastrophically"* 라고 쓴다.

**상황 C — 과제가 늘어나는 시스템.** Fig. 2 의 class-incremental CIFAR-100 이다. 처음엔 5개 클래스만 구분하면 되고, 나중에 5개가 추가되고, 또 추가된다. 상식적으로는 "이전에 배운 게 있으니 새 클래스는 더 빨리 배우겠지"가 맞다. 실제로 초기엔 그렇다 — Fig. 2 캡션: *"Initially, accuracy is improved by incremental training compared with a network trained from scratch"*. 그런데 *"after 40 classes, accuracy degrades substantially in a base deep-learning system."* 누적 학습이 **자산에서 부채로 뒤집히는 지점**이 있다는 것이다. 본문은 최종 상태를 이렇게 적는다: *"By the end, when all 100 classes were available, the accuracy of the incrementally trained base system was 5% lower than the retrained network"*.

세 상황의 공통 구조는 이렇다. **학습을 멈추지 않는다 + 목표가 조금씩 바뀐다 + 그 반복이 아주 많이 쌓인다.** 이 세 조건이 동시에 성립할 때만 현상이 드러난다. 그래서 대부분의 벤치마크(한 번 학습, 한 번 평가)는 이 문제에 구조적으로 눈이 멀어 있다.

---

## 2.2 기존 접근 계보 — 무엇이 이 문제를 계속 비껴갔나

### ① 2단계 패러다임 그 자체 (딥러닝의 기본값)

초록의 두 번째 문장이 이 계보의 출발점이다: *"These methods are almost always used in two phases, one in which the weights of the network are updated and one in which the weights are held constant while the network is used or evaluated."*

**무엇이었나.** 학습(train) → 배포(deploy) 의 분리. ImageNet 한 번 학습하고 정확도를 보고하면 끝.
**왜 부족했나.** 이 프레임에서는 "학습 능력"이 상수처럼 취급된다. 측정 대상이 아니다. 문제가 존재하는지조차 물어볼 수 없다.
**교훈.** 벤치마크의 구조가 발견 가능한 현상의 집합을 결정한다. 저자들의 진짜 첫 기여는 알고리즘이 아니라 **측정 프로토콜**이다.

### ② 파국적 망각 (catastrophic forgetting) 문헌

**무엇이었나.** 1980년대 후반부터의 오랜 줄기. 새 과제를 배우면 옛 과제 성능이 무너진다는 문제, 그리고 EWC·리플레이 버퍼·파라미터 격리 같은 처방들.
**왜 부족했나.** 이 문헌은 **과거 지식의 보존**을 목표 함수로 삼는다. 그런데 이 논문이 지적하는 건 정반대 방향의 손실이다. 프리프린트 초록이 이 구분을 가장 선명하게 쓴다: *"it is well known that they may fail to remember earlier examples. More fundamental, but less well known, is that they may also lose their ability to learn on new examples"* (arXiv:2306.13812 v3 초록).
**교훈.** "안정성 대 가소성(stability-plasticity)" 딜레마에서 지난 30년간 커뮤니티는 **안정성 쪽만 측정해 왔다**. 가소성은 무한 자원이라 가정됐다. 이 논문은 그 가정을 실험으로 부순다.

### ③ 정규화·최적화 처방들 (L2, 드롭아웃, 배치정규화, Adam)

**무엇이었나.** "일반화가 안 되면 정규화를 걸고, 수렴이 느리면 적응적 옵티마이저를 쓴다"는 표준 처방집.
**왜 부족했나.** 저자들은 이들을 하나씩 연속학습 지평에 태워봤다. 결과는 갈렸다. L2 정규화는 효과가 있었다 — *"the weight magnitude does not continually increase … associated with lower loss of plasticity"*. Shrink and Perturb 는 *"almost completely mitigates loss of plasticity in Online Permuted MNIST"*. 반면 **드롭아웃은 악화**시켰고(*"showed higher loss of plasticity"*), 온라인 정규화는 *"had fewer dead units and a higher effective rank than backpropagation in the earlier tasks"* 로 **초기에만** 좋았으며, Adam 은 죽은 유닛이 *"plateaus at around 60%"* 로 정체했다.
**교훈.** 정규화가 듣느냐 아니냐를 가르는 축은 "과적합을 막느냐"가 아니라 **"가중치 크기를 지속적으로 억제하느냐"**와 **"다양성을 지속적으로 재주입하느냐"** 다. 이 재분류 자체가 논문의 부수적 기여다.

### ④ 죽은 ReLU / 표현 붕괴 (representation collapse) 관찰들

**무엇이었나.** "죽은 ReLU 유닛", "표현의 랭크 붕괴", 심층 RL 에서의 암묵적 과소파라미터화 같은, 개별적으로 보고돼 온 국소적 병리들.
**왜 부족했나.** 각각은 특정 설정의 버그처럼 취급됐다. 활성함수를 바꾸거나(Leaky ReLU), 초기화를 손보거나, 학습률을 낮추면 되는 문제로 여겨졌다.
**교훈.** 이 논문은 이들이 **같은 하나의 과정의 서로 다른 얼굴**이라고 주장한다 — 다양성의 단조 감소. Discussion 의 문장이 이 통합을 명시한다: *"many of the networks' neuron-like units become dormant, overcommitted and similar to each other"* — 잠들거나(죽은 유닛), 과잉 개입되거나(가중치 크기), 서로 비슷해지거나(유효 랭크). 셋이 아니라 하나다.

### ⑤ 재초기화 계열의 선행 시도 (Shrink and Perturb 등)

**무엇이었나.** 가중치를 줄이고 노이즈를 더하는 식으로 학습 능력을 회복시키는 개입들. 이 논문에서도 강한 베이스라인으로 등장한다(Fig. 1c 에 명시).
**왜 부족했나.** 망 **전체**를 흔든다. 잘 작동 중인 부분까지 손상된다.
**교훈.** 연속 역전파의 차별점은 여기서 나온다. Discussion 이 정확히 이 대비를 쓴다: *"continual backpropagation restricts this variability to the units of the network that are at present least used, minimizing damage to the operation of the network."* 무작위성을 넣되 **어디에 넣을지 고르는 것** — 그게 효용 함수의 존재 이유다.

---

## 2.3 공통으로 놓친 핵심 gap

> **한 문장**: 기존 문헌 전체가 "신경망의 학습 능력은 시간에 대해 상수"라고 암묵 가정했기에, 아무도 그것을 **시간의 함수로 측정하지 않았고**, 따라서 그것이 단조 감소한다는 사실도, 그 원인이 다양성 고갈이라는 사실도, 해법이 경사 바깥에 있다는 사실도 발견되지 않았다.

---

## 2.4 이 논문은 그 gap 을 어떻게 메우는가

세 겹으로 메운다. **첫째, 측정 장치를 만든다** — 과제를 수천 개 잇는 벤치마크 4종(Continual ImageNet, class-incremental CIFAR-100, Online Permuted MNIST, Slowly-Changing Regression)과 비정상 RL 문제(마찰이 변하는 Ant). 여기서 종속변수는 "최종 정확도"가 아니라 **"n번째 과제에서의 학습 성능"**, 즉 시간의 함수로서의 가소성이다. **둘째, 실패의 범위를 지도로 그린다** — 아키텍처·옵티마이저·활성함수·정규화를 축으로 놓고 어디까지 실패하는지 훑는다. 이 지도가 "특정 설정의 버그"라는 반론을 사전에 차단한다. **셋째, 최소 개입으로 고친다** — 다양성이 원인이라면 다양성을 되돌리면 되어야 한다. 연속 역전파는 그 예측을 검증하는 **개입 실험(intervention)** 의 역할을 겸한다. 알고리즘이면서 동시에 인과 주장의 증거다.

이 세 겹 구조가 이 논문을 *Nature* 급으로 만든 이유다. 현상 발견 → 범위 확정 → 기전 가설 → 개입 검증 이 한 편에 다 들어 있다.
