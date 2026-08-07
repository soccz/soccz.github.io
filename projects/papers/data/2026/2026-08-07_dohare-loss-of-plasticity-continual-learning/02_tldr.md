# 1. 3층 TL;DR

> **배경 사다리**: 이 절을 읽으려면 ① "신경망"이 숫자 다이얼(가중치) 수백만 개를 조금씩 돌려가며 정답에 맞춰가는 기계라는 것, ② 보통은 "학습 기간"과 "사용 기간"이 나뉘어 있다는 것, 이 두 가지만 알면 된다. 나머지 용어는 나올 때마다 풀어 쓴다.

---

## 🧒 초등학생 수준

체육관에 스펀지 한 장이 있다고 하자. 스펀지는 물을 잘 빨아들인다. 한 번 짜내고 다시 담그면 또 빨아들인다. 그런데 이 스펀지를 백 번, 천 번 계속 쓰다 보면 어느 날부터 이상해진다. 겉보기엔 멀쩡한데 물을 거의 못 빨아들인다. 스펀지 안쪽 구멍들이 눌려 붙어버렸기 때문이다.

지금 우리가 쓰는 인공지능은 이 스펀지와 비슷하다. 보통은 "공부 기간"에 한 번 왕창 배우고, 그 뒤로는 배운 걸 쓰기만 한다. 그래서 아무도 이 문제를 눈치채지 못했다. 그런데 이 논문의 저자들은 인공지능에게 **새 문제를 계속, 수천 번 던져봤다**. 처음 몇백 번은 잘 배웠다. 그런데 이천 번째 문제쯤 가니까, 이 인공지능은 **새 문제를 거의 못 배우는 상태**가 됐다. 성적이 나빠진 게 아니라 — **배우는 능력이 사라진 것**이다. 나중에는 층을 잔뜩 쌓은 "깊은" 인공지능이 층이 하나뿐인 아주 단순한 기계보다도 못 배우게 됐다.

왜 이렇게 됐을까? 안을 들여다보니 신경망 속의 작은 계산 단위(뉴런)들이 셋 중 하나가 되어 있었다. 아예 잠들어서 아무 반응도 안 하거나, 너무 커져서 꼼짝 못 하거나, 옆 친구랑 똑같아져서 있으나 마나 하거나. 다양성이 사라진 것이다.

저자들의 해결책은 놀랍도록 단순하다. **"제일 안 쓰이는 뉴런 몇 개를 골라서, 가끔씩 새것으로 갈아 끼워라."** 오래된 스펀지 구멍을 조금씩 다시 뚫어주는 셈이다. 이렇게 하면 인공지능은 오천 번째 문제에서도 계속 잘 배웠다. 그리고 이 발상의 진짜 의미는 이것이다 — 지금까지 딥러닝은 "정답 쪽으로 조금씩 굴러가기(경사하강)"만으로 다 되는 줄 알았는데, **계속 배우려면 굴러가기 말고 '주사위 굴리기(무작위)'가 반드시 섞여 있어야 한다**는 것.

---

## 🎓 학부생 수준

**문제.** 표준 딥러닝은 암묵적으로 "학습 단계 → 고정 단계"라는 2단계 구조를 전제한다. 저자들의 초록 표현대로 *"one in which the weights of the network are updated and one in which the weights are held constant"*. 그런데 현실의 많은 응용(추천, 로보틱스, 시장 예측, 강화학습)은 데이터 분포가 계속 바뀌므로 학습이 멈출 수 없다. 이 **연속학습(continual learning)** 상황에서 딥러닝이 잘 작동하는지는 그동안 명확히 검증된 적이 없었다.

**발견.** 저자들은 ImageNet 1,000 클래스에서 두 클래스씩 뽑아 이진 분류 과제를 수십만 개 만들 수 있다는 점을 이용해(*"With the 1,000 classes in our dataset, we were able to form half a million binary classification tasks in this way."*) 과제를 순차적으로 던지는 **Continual ImageNet** 벤치마크를 세웠다. 결과: 초기 과제에서 *"up to 88% correct on the test set of the early tasks"* 를 달성하던 망이, *"by the 2,000th task, they had lost substantial plasticity for all values of the step-size parameter"* — 즉 **학습률(step size, 한 번에 다이얼을 얼마나 돌릴지 정하는 값)을 뭘 쓰든** 가소성을 잃었다. 초록은 이 상태를 *"until they learn no better than a shallow network"* 라고 못 박는다.

**진단.** 왜 그런가. 저자들은 세 가지 상관 지표를 제시한다. ① **죽은 유닛(dead unit)** — ReLU 처럼 음수를 0으로 잘라내는 활성함수에서 출력이 모든 입력에 대해 0이 되어버린 뉴런. Methods 는 *"For the step size of 0.01, up to 25% of units die after 800 tasks."* 라고 적는다. ② **가중치 크기 증가** — 다이얼 값들이 계속 커져 곡률이 나빠지고 움직이기 어려워진다. ③ **유효 랭크(effective rank) 감소** — 뉴런들이 서로 비슷해져 실질적으로 몇 개 방향밖에 표현하지 못하게 된다. 정의는 식 (2), $\text{erank}(\Phi)=\exp\{H(p_1,\dots,p_q)\}$ 로, $p_k=\sigma_k/\|\sigma\|_1$ (특잇값을 합으로 나눈 비율), $H$ 는 섀넌 엔트로피(다양성의 정도를 재는 값)다.

**해법.** **연속 역전파(continual backpropagation)**. 매 갱신마다 각 층에서 **기여 효용(contribution utility)** 이 낮은 유닛을 아주 작은 비율 $\rho$ 만큼 골라 초기값으로 재설정한다. 효용은 식 (1) 로 정의되는데, 그 유닛의 출력 크기 $|h_{l,i,t}|$ 와 그 유닛이 다음 층으로 내보내는 가중치들의 절댓값 합 $\sum_k |w_{l,i,k,t}|$ 의 곱을 지수이동평균(과거값을 $\eta$ 비율로 남기며 갱신하는 평균)한 값이다. 갓 태어난 유닛이 곧바로 잘려나가지 않도록 **성숙 임계치(maturity threshold) $m$** 번의 갱신 동안 보호한다.

**결과.** Fig. 1 캡션이 요약한다: *"the conventional backpropagation algorithm loses plasticity at all step sizes (b), whereas the continual backpropagation, L2 regularization and Shrink and Perturb algorithms maintain plasticity, apparently indefinitely (c)."* 강화학습에서도 같은 그림이 나왔다 — 마찰계수가 2백만 스텝마다 바뀌는 비정상 개미 보행 문제에서 표준 PPO 는 *"fails catastrophically"* 인데, 연속 역전파나 L2 를 더하면 무한히 잘 간다(Fig. 3c).

---

## 🔬 전문가 수준

**Contribution 1 — 현상의 확립과 명명.** "가소성 상실"을 일화가 아니라 **재현 가능한 체제(regime)** 로 확립했다. 핵심 설계는 과제 수를 압도적으로 늘린 것이다(Continual ImageNet 5,000 과제, Online Permuted MNIST 800 과제, Slowly-Changing Regression 3백만 예제). 저자들이 Discussion 에서 직접 짚듯 *"Plasticity loss is often severe when learning continues for many tasks, but may not occur at all for small numbers of tasks."* — 즉 **기존 연구가 이 현상을 놓친 이유는 실험 지평이 짧았기 때문**이라는 메타 주장이 깔려 있다. 이건 벤치마크 설계에 대한 비판이기도 하다.

**Contribution 2 — 강건성의 범위 매핑.** 단일 설정의 실패가 아니라 **설계 공간 전반의 실패**임을 보였다. 프리프린트 초록(arXiv:2306.13812 v3)은 이를 압축해 *"Loss of plasticity occurred with a wide range of deep network architectures, optimizers, activation functions, batch normalization, dropout, but was substantially eased by L2-regularization, particularly when combined with weight perturbation."* 라고 쓴다. 게재본 Methods 에서 완화 후보로 명시적으로 평가된 것은 L2 정규화 / 드롭아웃 / 온라인 정규화 / Shrink and Perturb / Adam 이며, 이 중 **드롭아웃은 오히려 악화**(*"showed higher loss of plasticity"*), **Adam 은 죽은 유닛 비율이 약 60% 에서 정체**(*"an early increase in the percentage of dead units that plateaus at around 60%"*)했다. 즉 "정규화를 더 넣으면 되겠지"라는 반사적 처방이 통하지 않는다.

**Contribution 3 — 알고리즘.** 연속 역전파는 선택적 재초기화(selective reinitialization)를 **유닛 단위 효용 순위**로 정의하고 성숙 임계치로 안정화한 형태다. 비용 구조가 실용적으로 중요하다 — 저자들이 든 예에서 CIFAR-100 실험의 $\rho=10^{-5}$, 층 폭 512 이면 *"roughly 512 × 10⁻⁵ = 0.00512 units are replaced"*, 즉 *"one replacement after every 1/0.00512 ≈ 200 updates or one replacement after every eight epochs"*. 사실상 공짜에 가까운 개입으로 무한 가소성을 산다.

**Contribution 4 — 설계 원칙의 명제화.** 초록의 마지막 문장이 이 논문의 진짜 주장이다: *"Our results indicate that methods based on gradient descent are not enough—that sustained deep learning requires a random, non-gradient component to maintain variability and plasticity."* 이는 경험적 관찰을 **아키텍처·옵티마이저 선택 원칙**으로 승격시킨 것이며, Discussion 에서 *"a form of variation and selection in the space of neuron-like units"* 라고 진화론적 언어로 재기술된다. 방어 가능성 측면에서 이 명제는 강한 편이다 — 반례가 되려면 "순수 경사 기반이면서 무한 가소성을 유지하는 방법"을 제시해야 하는데, L2 정규화가 부분적으로 그 후보다(뒤의 `07_limits.md` 반박 1 참조).

**한계 (저자 자인 포함).** ① Discussion 이 *"will probably require further development to reach its most effective form"* 로 알고리즘의 미성숙을 인정한다. ② ReDo 와의 비교를 저자 스스로 *"a preliminary comparison"* 이라 규정한다. ③ 세 진단 지표(죽은 유닛·가중치 크기·유효 랭크)는 본문 서술상 **상관(associated with)** 수준으로 제시되며, 어느 하나가 원인이라는 인과 실험은 주 결과에 없다. ④ 실험 도메인이 시각(ImageNet/CIFAR/MNIST)과 로코모션 RL 에 국한된다 — 언어 모델, 시계열 예측, 트랜스포머 계열은 주 실험에 없다.
