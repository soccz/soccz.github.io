# 3-a. 핵심 Claim 해체 (1) — 현상 편

> **배경 사다리**: ① "가소성(plasticity)"은 여기서 **새 데이터를 학습해 성능을 올릴 수 있는 능력**을 뜻한다. 현재 정확도가 아니라 "앞으로 올릴 수 있는 여력"이다. ② "얕은 망(shallow network)"은 층이 사실상 하나뿐인 단순 모델 — 딥러닝이 이겨야 하는 최소 기준선이다. ③ 아래 Claim 들은 전부 *Nature* 게재본에서 위치를 특정할 수 있는 것만 올렸다.

---

## Claim 1. 표준 딥러닝은 연속학습 환경에서 가소성을 잃으며, 끝내는 얕은 망보다 못 배우게 된다

### 주장 (한 문장)
학습을 멈추지 않고 과제를 계속 던지면, 표준 역전파로 학습되는 심층망은 **점진적으로 학습 능력 자체를 상실해** 결국 얕은 망 수준으로 떨어진다.

### 증거
- **초록 verbatim**: *"Here we show that they do not—that standard deep-learning methods gradually lose plasticity in continual-learning settings until they learn no better than a shallow network."*
- **Fig. 1** (Continual ImageNet). 캡션 verbatim: *"In a sequence of binary classification tasks using ImageNet pictures (a), the conventional backpropagation algorithm loses plasticity at all step sizes (b) …"*
- **본문 verbatim**: *"Although these networks learned up to 88% correct on the test set of the early tasks"* / *"by the 2,000th task, they had lost substantial plasticity for all values of the step-size parameter"*
- **Main 절 verbatim**: *"performance first improves and then falls substantially, ending near or below the linear baseline"* — "선형 기준선 근처 또는 그 아래"라는 표현이 "얕은 망보다 못하다"의 실증 근거다.
- **Fig. 2** (class-incremental CIFAR-100): *"By the end, when all 100 classes were available, the accuracy of the incrementally trained base system was 5% lower than the retrained network"*

> **⚠️ 수치 주의 — 널리 인용되는 "89% → 77%"에 대하여**
> 흔히 인용되는 "ImageNet 이진 분류가 89%에서 77%로 떨어졌다"는 **arXiv 프리프린트(arXiv:2306.13812) 초록**의 문장이다: *"In ImageNet, binary classification performance dropped from 89% accuracy on an early task down to 77%, about the level of a linear network, on the 2000th task."*
> **Nature 게재본 초록에는 이 문장이 없다.** 게재본 본문에서 직접 확인한 대응 수치는 *"up to 88% correct on the test set of the early tasks"* 이고, 2,000번째 과제의 정확한 값은 Fig. 1b 그래프에 있어 본문 문장으로는 전사하지 못했다. 따라서 **"89%→77%"를 Nature 판본의 수치로 단정하지 않는다.** 인용 시 판본을 명시할 것. (사소한 트집이 아니다 — 게재 과정에서 초록이 정성적 서술로 바뀌었다는 건 그 단일 숫자쌍의 대표성에 저자 또는 리뷰어가 부담을 느꼈을 가능성을 시사한다.)

### 숨은 전제
1. **"과제 n 에서의 성능"이 곧 "가소성"이다.** 실제 측정되는 건 온라인 분류 정확도이지 "학습 여력"이 아니다. 성능 하락은 (a) 학습 능력 상실 때문일 수도, (b) 후반 과제가 더 어려워서일 수도 있는데, 저자들은 무작위 클래스쌍으로 (b) 를 통제하려 하지만 **과제 난이도 분포가 시간에 대해 정상(stationary)이라는 가정**이 깔린다.
2. **선형/얕은 기준선이 공정하게 튜닝됐다.** "얕은 망보다 못하다"는 비교 주장은 기준선 강도에 전적으로 의존한다.
3. **모든 개별 과제는 독립적으로 학습 가능하다** — 실패 원인이 과제 자체에 있지 않다.

### 쉬운 말 풀이
운동선수가 훈련을 계속하는데, 어느 순간부터 **훈련해도 기록이 안 늘어난다**. 심지어 방금 운동을 시작한 초보자보다도 향상 속도가 느리다. 몸이 굳은 것이다. 이 논문은 신경망에서 정확히 그 일이 일어난다는 걸, 이천 번의 훈련 사이클로 보여준다.

---

## Claim 2. 이 실패는 특정 설정의 버그가 아니라 설계 공간 전반에 걸쳐 나타난다

### 주장 (한 문장)
가소성 상실은 학습률·아키텍처·활성함수·옵티마이저·정규화 기법을 바꿔도 사라지지 않으며, 지도학습과 강화학습 양쪽에서 관측된다.

### 증거
- **초록 verbatim**: *"We show such loss of plasticity using the classic ImageNet dataset and reinforcement-learning problems across a wide range of variations in the network and the learning algorithm."*
- **학습률 축**: *"by the 2,000th task, they had lost substantial plasticity for all values of the step-size parameter"*. Methods "Details of Continual ImageNet" 는 *"step sizes 0.01, 0.001 and 0.0001"* 를 쓸었다고 적는다.
- **활성함수 축**: Methods "Loss of plasticity with different activations in Slowly-Changing Regression" 에서 여섯 종 — *"sigmoid, tanh, ELU, leaky ReLU, ReLU and Swish"* — 을 평가. ReLU 계열만의 문제가 아니라는 뜻이다 (죽은 유닛은 ReLU 특유 현상이므로, 이 축이 없으면 "ReLU 를 버리면 되는 것 아니냐"는 반론에 답할 수 없다).
- **망 크기 축**: Methods "Robust loss of plasticity in permuted MNIST" 에서 *"100, 1,000 and 10,000 units per layer"* 비교 (주 실험은 *"2,000 units per layer"*).
- **변화 속도 축**: 같은 절에서 순열 교체 주기를 *"after each 10,000, 100,000 or 1 million examples"* 로 바꿔가며 *"48 million examples in total"* 를 고정. 즉 "총 데이터량"이 아니라 **"몇 번 바뀌었나"**가 결정 변수임을 분리하려는 설계다.
- **도메인 축**: Fig. 3·Fig. 4 의 Ant 로코모션 RL (비정상/정상 양쪽).
- **정규화·옵티마이저 축**: Methods "Existing deep-learning methods for mitigating loss of plasticity" 에서 L2 / 드롭아웃 / 온라인 정규화 / Shrink and Perturb / Adam 평가.

### 숨은 전제
1. **격자 탐색이 충분히 넓었다.** 학습률 3개 값(0.01/0.001/0.0001)은 로그 스케일로 두 자릿수를 덮지만, 예컨대 스케줄링(감쇠 학습률)은 이 축에 없다. "모든 값에서 실패"는 **탐색한 모든 값에서 실패**로 읽어야 한다.
2. **모든 축을 동시에 최적화한 조합은 시험되지 않았다.** 각 축을 독립적으로 흔들었지, 예컨대 "Swish + L2 + 낮은 학습률 + 넓은 망"의 조합 최적점이 어딘가에 있을 가능성은 배제되지 않는다. 저자의 주장은 "각 축 단독 조작으로는 못 고친다"에 가깝다.
3. **비전 도메인의 귀납 편향이 일반적이다.** 컨볼루션 망과 MLP 가 실험 대부분이다. 트랜스포머는 주 실험에 없다 — 이건 뒤(`07_limits.md`)에서 반박 지점으로 다룬다.

### 쉬운 말 풀이
"우리 팀만 이런 거 아냐?" 하는 의심을 없애려고, 저자들은 **바꿀 수 있는 손잡이를 하나씩 다 돌려봤다.** 학습 속도, 망의 크기, 뉴런의 종류, 규제 방법, 심지어 문제 종류(사진 분류 vs 로봇 걷기)까지. 대부분의 손잡이에서 같은 일이 일어났다. 그러니 이건 우리 팀 코드의 버그가 아니라 **딥러닝이라는 방법 자체의 성질**이다.

---

### 두 Claim 이 함께 하는 일

Claim 1 혼자면 "재현 안 될 수도 있는 관찰"이고, Claim 2 혼자면 "무엇의 강건성인지 모를 지도"다. 둘을 붙이면 **"이건 현상이고, 여기까지가 그 영역이다"**라는 과학적 진술이 된다. *Nature* 스타일의 논문 설계에서 이 조합은 거의 필수다 — 그리고 사용자의 APF·Grokking 두 트랙이 배워야 할 논문 골격이기도 하다 (자세한 건 `09_my_research.md`).
