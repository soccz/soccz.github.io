# 02 · 3 층 TL;DR

## 🧒 초등학생 수준 (400~600자)

학교에서 어떤 문제집을 풀 때, 문제집 답을 다 외워 버린 다음에도 한참 동안 새로운 문제를 풀 줄 모르다가, 어느 날 갑자기 "아, 이 문제집은 이런 규칙으로 만들어졌구나!" 하고 깨달아 새 문제를 다 풀 수 있게 되는 일을 상상해 보자. 인공지능을 훈련시킬 때도 비슷한 일이 일어난다 — 답을 다 외운 다음에도 오래 가르치면 갑자기 "진짜 규칙" 을 깨우치는 순간이 온다. 이걸 "그록킹 (Grokking)" 이라고 부른다.

원래 이 그록킹은 "구구단 같은 수학 문제만" 잘 보인다고 알려져 있었다. 그런데 이 논문 저자들은 "그게 사실은 어디서나 일어날 수 있다" 고 주장한다. 비밀은 신경망 안에 든 "다이얼들의 크기 (가중치 노름)" 라는 한 가지 숫자에 있다고 한다. 그 숫자가 너무 크면 외우기 모드, 너무 작으면 백지 모드, 그 사이의 **딱 알맞은 띠 (Goldilocks 구간 — 곰돌이 푸의 '너무 뜨겁지도 너무 차갑지도 않은 죽' 비유에서 따온 이름)** 안에 들어와야 진짜 규칙을 깨우친다는 것. 학습이 천천히 이 띠를 향해 굴러가는데, 출발이 멀면 멀수록 도착이 늦어진다 — 이것이 그록킹이 늦게 오는 이유다. 저자들은 이 한 가지 그림으로 손글씨 숫자 (MNIST), 영화 리뷰 (IMDb), 분자 데이터 (QM9), 그리고 원래의 구구단 같은 모듈러 산수까지 모두 같은 메커니즘이라 보여 준다.

## 🎓 학부생 수준 (500~800자)

Grokking 은 Power et al. (2022, OpenAI) 가 modular arithmetic 에서 처음 보고한 현상 — 훈련 정확도가 100% 에 도달하고도 한참 (수천 ~ 수만 step) 뒤에야 test 정확도가 갑자기 0% → 100% 로 점프하는 delayed generalization. 본 논문 (Omnigrok, ICLR 2023 Spotlight) 의 핵심 주장은 "이건 algorithmic 데이터의 특이 현상이 아니라, **가중치 norm $\|w\|$ 축 위 train loss 와 test loss 의 모양 mismatch** 라는 보편 메커니즘이다" 라는 것이다.

저자들은 그 모양을 LU mechanism 이라 부른다 — 가중치 norm 을 x 축에 놓으면 train loss 는 norm 이 작을 때 매우 크고 norm 이 어느 임계값 $w_c$ 를 넘으면 거의 0 으로 떨어지는 **L 자**, test loss 는 $w_c$ 부근에서 골짜기를 만들고 그 양 옆에서 다시 올라가는 **U 자** 가 된다. 두 곡선 사이의 어긋남 때문에, large initialization (norm 이 큰 곳에서 시작) → 빠른 overfit → 작은 weight decay $\gamma$ 가 천천히 weight vector 를 $w_c$ 의 **Goldilocks zone** 쪽으로 끌어내리는 동안 test loss 가 갑자기 떨어진다. 그록킹 시간은 weight decay 의 역수에 대략 비례한다 (정성적 관계 — 정확한 비례 상수는 본문 미접근으로 단정 안 함).

실험은 다섯 도메인 — teacher-student MLP, modular addition (원조 Power 셋업), MNIST 분류, IMDb 영화 리뷰 LSTM 분류, QM9 분자 회귀 (GCNN) — 에서 같은 LU 모양을 보이고, 각 도메인에서 train 시 weight norm 을 고정하면 (Goldilocks zone 위로 또는 아래로 고정) grokking 이 사라지거나 induce 된다는 것을 보여 준다.

## 🔬 전문가 수준 (600~1,000자)

**Contribution 1 — Phenomenon expansion**. Grokking 을 modular arithmetic 등 algorithmic / teacher-student toy 영역 밖으로 끌고 나와 *image classification (MNIST)*, *text sentiment (IMDb LSTM)*, *molecular regression (QM9 GCNN)* 에서 직접 유도한다. 표준 학습 설정에서는 IMDb 의 경우 "약한 grokking signal" 이 large initialization + 1k 데이터 조건에서 관찰된다고 명시 — 기본 init 에서는 안 나타난다는 점도 같이 보고하는 게 정직한 framing.

**Contribution 2 — LU mechanism 가설**. weight norm 축 위 reduced train/test loss landscape 의 L/U 형태와 그 mismatch 를 grokking 의 *원인 가설* 로 제시. 두 곡선의 교차 영역 (저자 표기로 spherical shell radius $\approx w_c$) 을 **Goldilocks zone** 이라 명명. 이 zone 외부에서는 generalize 하지 않고 zone 내부에서만 generalize.

**Contribution 3 — Mechanistic explanation of grokking time**. Large initialization → fast convergence to overfitting manifold (norm 이 큰 쪽) → weight decay $\gamma$ 에 의한 radial drift 가 Goldilocks zone 으로 향함. Radial 속도가 $\gamma$ 에 비례하므로 grokking time $\propto \gamma^{-1}$ — small weight decay 가 huge generalization delay 를 만드는 정성적 관계를 설명. (정량적 상수와 모델 의존성은 원문 본문 미접근 → 본 해체는 정성 관계만 단정.)

**Contribution 4 — Falsifiable knobs**. (a) weight norm 을 Goldilocks zone 으로 강제 고정 → grokking induction 이 즉시 일어남 (즉, time 축이 norm 축으로 정확히 변환됨). (b) initialization scale 을 키우면 grokking gap 증대. (c) weight decay 제거 시 generalization 자체가 안 일어남 — 단순 epoch 부족 문제와 구별됨. 이 세 knob 이 LU 가설의 시험 가능한 예측이다.

**한계 (해체 시점에 명시 안 되는 부분)**. 본문 PDF 미접근으로 (i) 일부 dataset 에서 grokking 의 강도가 약함을 어떻게 framing 했는지, (ii) LU mechanism 의 *깊이 (depth) 가 깊은 transformer* 에서의 적용 가능성에 대한 저자의 입장, (iii) Appendix 의 보충 실험 (다른 task, optimizer, scheduler) 을 단정하지 않는다.
