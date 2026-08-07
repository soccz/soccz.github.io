# 5-b. 실험 해부 (2) — 강화학습, 그리고 가장 흥미로운 대조

> **배경 사다리**: ① 강화학습(RL)은 정답 레이블 없이 **보상**만 받으며 행동을 배우는 방식이다. ② PPO(Proximal Policy Optimization)는 현재 가장 널리 쓰이는 표준 RL 알고리즘. ③ 이 절의 핵심은 "비정상 환경"과 "정상 환경" 두 실험을 **나란히** 놓은 데 있다 — 그 대조가 이 논문에서 가장 값진 결과다.

---

## 5-b-1. 왜 RL 실험이 필요했나

지도학습만으로도 Claim 1·2 는 성립한다. RL 을 추가한 이유는 셋으로 읽힌다. **① 연속학습이 선택이 아니라 필연인 도메인** — 지도학습에서는 "학습을 멈추면 되지"가 가능하지만 RL 에서는 불가능하다. 정책이 바뀌면 수집하는 데이터 분포도 바뀌므로 **RL 은 본질적으로 비정상**이고, 가소성 상실이 여기서 일어난다면 그건 특수 상황이 아니라 기본 조건이다. **② 저자들의 홈그라운드** — Sutton·Mahmood 라인의 본업이 RL 이며, RL 커뮤니티에 메시지를 꽂는 것이 전략적 목표로 보인다. **③ 실무적 파급이 가장 큰 곳** — "심층 RL 은 불안정하다"는 오랜 상식의 원인이 대체로 탐색이나 신용 할당으로 귀속돼 왔는데, 이 논문은 **네 번째 원인**(망 자체의 가소성 소진)을 제시한다.

---

## 5-b-2. 비정상 Ant — 마찰이 변하는 세계 (Fig. 3)

### 설계 (Methods "Details and further analysis in reinforcement learning")

- 환경: *"the Ant-v3 environment from OpenAI Gym"*.
- 비정상성: *"We changed the coefficient of friction by sampling it log-uniformly from the range [0.02, 2.00]."* 변경 시점은 *"at the first episode boundary after 2 million time steps had passed since the last change"*.
- 망: *"Two separate networks were used for the policy and the value function, and both had two hidden layers with 256 units."*
- 최적화: *"These networks were trained using Adam alongside PPO"*. 나머지 하이퍼파라미터는 Extended Data Table 5 (**셀 전사 불가 → 수치 미확인**).
- 반복: Fig. 3 캡션 verbatim *"These results are averaged over 100 runs; the solid lines represent the mean and the shaded regions represent the 95% bootstrapped confidence interval."*

### 왜 이 환경이 적절한가

마찰계수를 [0.02, 2.00] 에서 log-uniform 으로 뽑는 건 **100 배 범위**(얼음판부터 사포까지)를 로그 균등하게 훑는다는 뜻이다. 중요한 건 **과제의 난이도 구조는 유지된다**는 점 — 어떤 마찰에서도 "잘 걷는 법"이 존재하므로 성능 붕괴를 "환경이 불가능해져서"로 설명할 수 없다 (Continual ImageNet 의 무작위 클래스쌍과 같은 통제 논리). 또 2백만 스텝마다 바뀌므로 **적응할 시간이 충분하다** — 빠른 변화에 못 따라가는 게 아니라 느린 변화에도 못 따라가게 되는 것이다.

### 결과

- 본문 verbatim: *"PPO performed well (see the red line in Fig. 3c) for the first 2 million steps, up until the first change in friction"* — **첫 변화 전까지는 정상**이다. 알고리즘이 원래 못하는 게 아니다.
- Fig. 3c 캡션 verbatim: *"The standard PPO learning algorithm fails catastrophically on the non-stationary ant problem. If the optimizer of PPO (Adam) is tuned in a custom way, then the failure is less severe, but adding continual backpropagation or L2 regularization is necessary to perform well indefinitely."*
- 본문 verbatim: *"PPO augmented with a specially tuned Adam optimizer performed much better"*.

비교군 5종: PPO / PPO+튜닝된 Adam / PPO+L2 / PPO+연속 역전파 / PPO+L2+연속 역전파.

### 이 결과의 해석 — Adam 튜닝이라는 단서

"Adam 을 특별히 튜닝하면 실패가 덜 심각하다"는 짧지만 무거운 문장이다. 그런데 확인된 본문 범위에서 **어느 하이퍼파라미터를 어떻게 바꿨는지는 명시되지 않는다**(Extended Data Table 5 에 있을 가능성이 크나 전사 불가 → **수치 미확인**). "Adam 을 어떻게 튜닝하라는 건가"가 바로 다음 질문인데 본문만으로는 답할 수 없는 아쉬운 공백이다.

동시에 이 결과는 Claim 4 를 다시 흔든다 — Adam 튜닝은 명백히 **순수 경사 기반 개입**인데 상당한 개선을 낸다. 저자 방어는 *"the failure is less severe"*(덜 심각할 뿐 무한히 유지되지는 않는다)이고, 그래서 *"necessary to perform well indefinitely"* 로 "무한 지평"을 기준선 삼는다. **"무한히"라는 기준을 채택하는 순간에만 Claim 4 가 성립**하는 구조이며, 유한 지평 실무자에게는 Adam 튜닝이나 L2 로 충분할 수도 있다.

---

## 5-b-3. 정상 Ant — 이 논문에서 가장 값진 실험 (Fig. 4)

### 왜 이게 가장 값진가

Fig. 4 는 **마찰이 안 바뀌는** 표준 Ant 문제다. 상식적으로는 "정상 환경이니 가소성 상실이 없어야" 한다. 그런데 결과는 정반대다.

Fig. 4 캡션 verbatim:
> *"(a) The four reinforcement-learning algorithms performed similarly on this and the non-stationary problem (compare with Fig. 3c). (b,c) A closer look inside the networks reveals a similar pattern as in supervised learning (compare with Fig. 2c,d). (d) The absolute values of the weights of the networks increased steadily under standard and tuned PPO, whereas they decreased and stayed small under L2 regularization with or without continual backpropagation."*
> *"These results are averaged over 30 runs."*

**"performed similarly on this and the non-stationary problem"** — 이 한 구절이 논문 전체의 함의를 확장한다.

### 이게 왜 중요한가 — 세 겹의 해석

**해석 1 (저자 의도).** 외부 환경이 고정돼도 RL 은 내부적으로 비정상이다 — 정책이 바뀌면 방문 상태 분포가 바뀌고, 가치 함수의 타깃도 부트스트래핑 때문에 계속 움직인다. 즉 **"정상 RL 문제"라는 건 애초에 없다.**

**해석 2 (넓은 함의).** 그렇다면 심층 RL 의 고질적 불안정성 — 시드 간 분산, 학습 도중 성능 붕괴, 재현 곤란 — 의 상당 부분이 가소성 상실로 설명될 수 있다. RL 문헌 전체에 대한 재해석 제안이다.

**해석 3 (내가 보는 것).** 이 실험은 **"비정상성"이 이 논문의 필수 전제가 아님**을 보여준다. 앞의 지도학습 실험들은 모두 명시적 과제 전환을 넣었기에 "가소성 상실 = 비정상성의 결과"로 읽히기 쉬웠는데, Fig. 4 는 그 인과 사슬을 느슨하게 만든다 — 오히려 **"학습을 오래 지속하는 것" 자체**가 충분조건일 수 있다. 논문의 프레이밍(제목부터 "continual learning")보다 강한 주장인데 저자들이 전면에 내세우지 않은 게 의아하다.

> **다만 조심할 점**: Fig. 4a 의 *"performed similarly"* 는 **알고리즘 간 상대 순위**가 비슷하다는 뜻으로 읽는 게 자연스럽다. "정상 문제에서도 절대 성능이 붕괴한다"는 더 강한 주장인지, "정상 문제에서도 같은 내부 패턴(b,c,d)이 보인다"는 약한 주장인지는 그림 자체를 봐야 확정된다. 본 해체는 **캡션이 명시한 것(내부 패턴의 유사성, Fig. 4d 의 가중치 증가)까지만 단정**하고, 절대 성능 붕괴 여부는 단정하지 않는다.

---

## 5-b-4. 베이스라인 공정성 평가

**잘한 점.** ① 비교군에 **튜닝된 Adam** 을 넣고 실제로 *"much better"* 라 정직하게 보고한다 — 저자에게 불리할 수 있는 강한 기준선이다. ② L2 정규화를 계속 나란히 그린다 (자기 알고리즘만 돋보이게 하려면 뺐어야 할 비교군). ③ 반복 횟수가 넉넉하다 (RL 100/30 runs, Permuted MNIST 100 runs, ImageNet·CIFAR 30 runs) — RL 에서 100 runs 는 이 분야 기준 매우 후하다. ④ 95% 부트스트랩 신뢰구간을 그린다.

**아쉬운 점.** ① RL 설정에서 각 베이스라인이 얼마나 튜닝됐는지는 Extended Data Table 5 에 의존하며 **전사 불가로 확인할 수 없었다** → 공정성 판정 유보. (CIFAR-100 은 기본 시스템 weight decay 도 3개 값에서 골라 대칭적이다.) ② **무작위 선택 대조군의 부재** (`05_method_c_algorithm.md` 대안 3). ③ **ReDo 비교가 "예비적"이다** — 원문 verbatim: *"In our next experiment, we perform a preliminary comparison with ReDo. ReDo is another selective reinitialization method that builds on continual backpropagation but uses a different measure of utility and strategy for reinitializing."* 가장 가까운 경쟁자와의 비교를 저자 스스로 한정했고, **정량 결과는 PMC 렌더 절단으로 미확인**이다. 인용 시 "연속 역전파가 ReDo 보다 낫다"고 쓰면 안 된다.

---

## 5-b-5. 부록에 숨은 신호

Extended Data Fig. 2(Slowly-Changing Regression) · Fig. 3(Online Permuted MNIST) · Fig. 4(그 위의 기존 기법들) · Fig. 5(정상 RL 추가 결과) — **본문 4개 그림 뒤에 부록 그림이 4개 더** 있다. 실질 실험량이 본문의 두 배라는 뜻이고, 특히 "기존 기법들"이 부록으로 밀린 건 편집상 선택이다. **드롭아웃이 오히려 악화시킨다**는 실무자에게 가장 유용한 정보가 부록에 있다.

**Extended Data Table 1~5 는 전부 아키텍처·하이퍼파라미터 표다.** 즉 이 논문에는 **결과 표가 없고 모든 주 결과가 그림**이다. "시간에 따른 궤적"이 결과인 논문의 자연스러운 형식이지만, 동시에 **특정 시점의 정확한 수치를 인용하기 어렵게** 만든다 — 이 해체가 수치 인용에서 계속 조심스러웠던 구조적 이유다.
