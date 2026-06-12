# 03 · 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① **신경망 (NN) 학습** 은 손실 함수 $L(w)$ 가 작아지도록 가중치 벡터 $w$ 를 조금씩 움직이는 일이라는 것, ② **train loss** 는 훈련 때 본 데이터에 대한 손실, **test loss** 는 본 적 없는 데이터에 대한 손실이라는 것, ③ **overfitting** 은 train 은 잘 맞추지만 test 는 못 맞추는 상태라는 것 — 이 세 가지만 알면 된다. 보통 "train 100% 도달했는데 test 0%" 면 그 모델은 "외운 것" 이라고 본다. Grokking 은 이 상식을 깬다.

## 실제 문제 — 현실에서 어떻게 생기나

### 예시 상황 1 — 구구단 외운 학생

초등학생에게 mod-97 덧셈 표 (97 칸 × 97 칸 = 9 409 개의 (a, b, c) 셀, c = (a+b) mod 97) 의 **반** 만 보여 주고 외우게 한다. 며칠 후 학생은 그 반은 완벽히 외운다 — 안 외운 반은 못 한다. 그런데 같은 학생에게 같은 표를 **계속 반복해서 보여 주기만 한다**. 한 달 뒤 어느 순간 갑자기 학생이 "아 이거 그냥 둘을 더해서 97 로 나눈 나머지구나" 하고 안 보여 준 반까지 다 맞춘다. 이게 grokking 의 원형. Power et al. (2022) 가 이걸 신경망에서 처음 발견했다.

### 예시 상황 2 — 시험 직전 벼락치기와 천천히 익히는 학생

같은 표를 두 명의 학생에게 가르친다. A 는 처음부터 답을 빠르게 외워서 short-term 점수가 높지만 한 달 뒤에도 새 문제는 못 푼다 (overfit 영구화). B 는 외우는 속도는 느려도 같은 시간 끝에 갑자기 규칙을 깨우친다. 두 학생의 차이는 "초기 답안 외우는 강도" — A 의 출발점이 표를 외우기에 더 유리한 영역이라서, 답 외운 뒤에는 그 동네에 갇혀 버린다. 이것이 large initialization 가 grokking 을 더 어렵게 (또는 더 늦게) 만든다는 본 논문의 관찰의 일상 비유.

### 예시 상황 3 — 알고리즘 데이터 너머

"근데 구구단 같은 *순수 규칙 데이터* 말고, 실제 사진이나 글에서도 이런 일이 나는가?" 라는 질문이 자연스럽다. Power et al. 이후 1 년 가까이 학계 일반론은 "Grokking 은 modular arithmetic 같은 좁은 algorithmic toy 에서만 보이는 phase transition" 이었다. Omnigrok 의 출발은 바로 이 통념을 깨는 것 — *MNIST · IMDb · QM9 에서도 같은 상이 보인다* 를 보이고, 그러려면 algorithmic-specific 가설이 아니라 **모든 도메인에 공통인 메커니즘** 이 있어야 한다는 압박을 만든다.

## 기존 접근 계보

### 1. Power et al. 2022 (OpenAI, arXiv:2201.02177) — 발견의 단계

modular arithmetic 의 단일 - 2 층 transformer 에 weight decay 를 적용하면 train 0 loss 후 수천~수만 step 뒤 test 0 loss 가 발생함을 처음 보고. 4 phase diagram (memorize / confusion / grokking / generalize) 을 weight decay × train fraction 평면에서 그림. 단점: **왜** 일어나는지에 대한 메커니즘 없음. "phase transition" 이라는 명명만 있고 분석 도구 부재.

### 2. Liu, Kitouni, Nolte, Michaud, Tegmark, Williams 2022 (NeurIPS, arXiv:2205.10343) — Effective Theory 단계

같은 1 저자 (Liu) 의 이전 작업. Effective theory of representation learning — embedding vector 의 구조 (modular 의 경우 원형 manifold) 가 generalization 의 사전 조건이고, "Goldilocks zone" 이라는 표현이 처음 등장. 한계: 이론이 toy synthetic + 작은 dataset 에 한정. 실제 ML 데이터로 확장 안 됨.

### 3. Nanda, Chan, Lieberum, Smith, Steinhardt 2023 (ICLR, arXiv:2301.05217) — Mechanistic Interpretability 단계

modular arithmetic 의 grokking 을 Fourier circuit 발생으로 mechanistically 해석. Progress measure 로 "내부 circuit 완성도" 를 측정해서 grokking phase 를 sub-phase 로 나눔. 단점: modular arith 에 묶인 specific circuit 분석 — 일반 도메인에 일반화 어렵다.

### 4. Thilak et al. 2023 (Slingshot) — Optimizer dynamics 단계

Adam optimizer 의 second-moment slingshot effect 가 grokking 의 timing 을 만든다는 가설. 우아하지만 optimizer-specific. SGD 에서도 grokking 이 일어나는 것은 일부 잘 안 설명됨.

### 5. Davies, Langosco, Krueger 2023 (arXiv:2303.06173) — Double Descent 통합 시도

Grokking 과 double descent 를 "pattern learning speed" 라는 공통 axis 로 통합 시도. 하지만 그 axis 자체가 모델 의존적이라 universal mechanism 으로 못 굳음.

## 공통으로 놓친 핵심 gap

위 5 라인 모두 (1) algorithmic 데이터 의존성을 못 벗어남, (2) "왜 weight decay 와 grokking time 이 관계 있나" 를 정성을 넘어 *기하학적 메커니즘* 으로 통합 못 함, (3) "내가 weight norm 을 직접 고정해 본다" 같은 직접 개입 (intervention) 으로의 falsifiability 가 없음. 종합하면 — **"grokking 의 정의는 시간 (학습 step) 의 함수인데, 정작 *원인은 어디서 오는가*" 의 axis 가 아직 안 잡혀 있다**.

## Omnigrok 의 gap 메우기

저자들의 답: "원인 axis 는 *시간이 아니라 weight norm $\|w\|$ 이다*." Step 은 단지 $\|w\|$ 가 small weight decay 에 의해 천천히 Goldilocks zone 으로 흘러가는 데 걸리는 시간일 뿐이고, 진짜 메커니즘은 weight-norm 축 위 L 자 train loss + U 자 test loss 의 mismatch 다. 이 axis 변환이 맞다면 (a) weight norm 을 직접 Goldilocks zone 에 고정하면 grokking 이 즉시 generalize 로 이어져야 하고, (b) initialization scale 을 키우면 grokking gap 이 커져야 하고, (c) 이 메커니즘은 데이터·작업 종류에 의존하지 않아야 한다 — 다섯 도메인 실험이 모두 (c) 의 시연이다. 본 논문은 grokking 의 *원인 가설* 을 데이터 영역에서 weight-norm 기하 영역으로 옮기는 데 의의가 있다.
