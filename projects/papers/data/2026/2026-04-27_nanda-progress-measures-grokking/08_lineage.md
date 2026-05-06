# 7. 이론적 계보

> 이 논문은 *어디서 와서*, *동시기에 누구와 경쟁* 했고, *어디로 갔는가*.

## 7.1 이론적 조상 (직접 연결)

### 조상 1. Power et al. (2022) — "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets" (arXiv:2201.02177)

Grokking 현상을 *발견* 한 논문. 본 논문은 정확히 이 발견을 *설명* 한다. Power 가 "이런 신기한 일이 일어난다" 까지 갔고, Nanda 는 "왜 그런지" 를 닫는다. 두 논문은 *paired* 로 인용된다 — 발견 ↔ 메커니즘.

직접 연결: Power 의 modular arithmetic task setup 을 그대로 차용. weight decay 의존성 관찰을 그대로 가져옴. 그 위에 회로 분석 + progress measure 추가.

### 조상 2. Anthropic — "A Mathematical Framework for Transformer Circuits" (Elhage et al. 2021, transformer-circuits.pub)

Transformer 의 weight matrix 들을 *circuit-component* 로 분해하는 방법론적 *조상*. attention head 의 OV (output-value) circuit, QK (query-key) circuit 분해, MLP 의 *associative memory* 해석 — 이 모든 vocabulary 를 본 논문이 가져온다.

직접 연결: 본 논문의 회로 분석 (embedding → attention → MLP → unembedding 의 spectral decomposition) 은 *Anthropic 의 framework 의 알고리즘적 instantiation*. 

### 조상 3. Olsson et al. (2022) — "In-context Learning and Induction Heads" (arXiv:2209.11895)

In-context learning 의 메커니즘을 *induction head* 라는 specific circuit 으로 환원한 paper. 이 paper 가 "회로를 reverse-engineer 하면 ML behavior 가 설명된다" 는 mech interp 의 *경험적* 정당성을 처음 강하게 보였다.

직접 연결: Nanda 본 논문은 induction heads 의 *algorithmic version* — 모듈러 덧셈 회로. methodology (causal intervention + circuit hypothesis) 가 동일.

### 조상 4. Liu et al. (2022) — "Towards Understanding Grokking: An Effective Theory of Representation Learning"

Grokking 을 representation manifold 의 phase transition 으로 모델링. order parameter 추출 시도. 본 논문이 *order parameter 의 구체적 형태* 를 progress measure 로 닫음.

직접 연결: phase transition 에 *측정 가능한 단조 변수* 가 있다는 발상이 progress measure 의 *철학적 조상*.

---

## 7.2 평행 연구 (동시기, 다른 접근)

### 평행 1. Merrill et al. (2023) — "A Tale of Two Circuits"

본 논문과 *동시기*. sparse parity task 위에서 dense memorization circuit + sparse generalization circuit 의 *경쟁* 을 모델링. 본 논문의 "두 가중치의 cleanup 시간 비대칭" 과 거의 같은 결론을 *다른 task* 에서 도출.

본 논문이 *이긴* 영역: closed-form 회로 (Fourier basis), 정량적 progress measure. Merrill 측이 *나은* 영역: task generality (sparse parity 가 modular addition 보다 더 많은 task family 에 추상화 가능).

두 논문은 *서로를 cite* 하며 grokking 의 "two-circuit" frame 을 정착시킨다.

### 평행 2. Davies et al. (2023) — "Unifying Grokking and Double Descent"

같은 시기. grokking 을 model-wise + sample-wise double descent 의 일종으로 통합. EDM (effective dimension of model) 척도 도입. *통계학적* 시각으로 grokking 을 generic 현상으로 환원.

본 논문이 *상보적*: Davies 가 phenomenon 의 *generic* 성을 보였다면, Nanda 는 *specific* 메커니즘을 닫는다. 두 시각이 결합하면 "grokking = double descent 의 mechanistic instantiation".

### 평행 3. Thilak et al. (2023) — "Omnigrok"

같은 시기. Grokking 이 *weight norm 의 함수* 로 임의 induce/억제 가능함을 보임. weight 를 외부에서 sphere projection 으로 강제하면 grokking 이 단축. 

본 논문이 *상보적*: Thilak 가 weight norm 변수를 발견했다면, Nanda 는 norm 변화의 *내적 의미* (Fourier sparsification) 를 닫는다. Norm 이 *원인* 이 아니라 *증상* — 진짜 원인은 회로 cleanup.

### 평행 4. Kumar et al. (2023) — "Grokking as the Transition from Lazy to Rich Training Dynamics"

Lazy/rich regime 의 NTK 시각에서 grokking 을 분석. lazy regime 에서 rich regime 으로의 전이가 grokking 의 본질. 본 논문과 *수직 보완* — Kumar 가 *학습률 / NTK eigenvalue* 시각, Nanda 가 *circuit 시각*. 둘 다 동일 phenomenon 의 다른 면.

---

## 7.3 후손 (이 논문이 낳은 것)

### 후손 1. Conmy et al. (2023) — "Towards Automated Circuit Discovery for Mechanistic Interpretability" (ACDC, arXiv:2304.14997)

본 논문의 *수동 회로 분석* 을 *자동화* 한 후속. 회로 가설을 사람이 세우는 대신, gradient-based pruning 으로 회로를 *자동 발견*. 본 논문의 progress measure 와 같이 사용 가능.

### 후손 2. Doshi et al. (2024) — multi-task grokking

본 논문 frame 을 *여러 modular operation 동시 학습* 으로 확장. Frequency hopping 현상 발견 (학습 도중 $K$ 가 변함). 본 논문의 *post-hoc fixed K* 가정의 부분 부정.

### 후손 3. Wang et al. (2024) — "Grokked Transformers are Implicit Reasoners" (arXiv:2405.15071, 2026-04-24 본 레포에서 cover)

Grokking 이 algorithmic task 외 *implicit reasoning* (knowledge composition) 에서도 일어남을 보임. 본 논문의 frame 을 더 의미 있는 task 로 확장.

### 후손 4. Lyle et al. (2025) — "Grokking and Primacy Bias in Continual Learning"

Continual learning 에서 grokking 이 어떻게 변형되는지 — non-stationarity 가 들어오면 본 논문의 깔끔한 3-phase 가 어떻게 무너지는지. 사용자의 Grokking active track 과 *직접 관련* 한 후속.

### 후손 5. Stander et al. (2024) — "Grokking Group Multiplication with Cosets"

Nonabelian group ($S_5$ etc.) 에서의 grokking 회로. 본 논문의 character theory 가 *matrix-valued representation* 으로 일반화되며 회로가 더 복잡한 형태가 됨을 보임.

---

## 7.4 계보의 한 줄 요약

> Power 2022 (현상 발견) → Anthropic 2021 + Olsson 2022 (mech interp 방법론) → **Nanda 2023 (메커니즘 닫음 + progress measure)** → Conmy 2023 (자동화), Doshi 2024 (multi-task), Wang 2024 (implicit reasoning), Lyle 2025 (continual + non-stationarity)

본 논문은 grokking 의 *현상학* 을 *메커니즘론* 으로 전환한 *축* 의 paper. 이 전환 이후 grokking 연구는 "왜 일어나는가" 가 아니라 "어떻게 측정/조작/예측하는가" 의 질문으로 옮겨갔다.
