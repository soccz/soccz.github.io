# 9. 사고 확장 (a) — 자문 질문 5 개

> **🧒 한 줄 요약**: 5 질문 — Multi-task circuit overlap, dynamic during training, etc.


알고리즘을 *내가 이해했는가* 를 검증하기 위한 자문 질문. 각 질문은 단순 사실 확인이 아니라 *논문의 가정이 깨질 때 무엇이 일어날지* 를 시뮬레이션하는 질문.

---

### Q1. *역위상정렬이 아니라 순방향정렬* 로 ACDC 를 돌리면 어떻게 망가지는가?

**왜 이 질문이 중요한가**: 알고리즘의 *방향성* 이 *왜 필요한가* 를 모르면 알고리즘을 변형 (예: token-position 단위로 쪼개기, regime 별로 따로 돌리기) 할 때 직관이 무너진다. 순방향이면 *입력 가까운 edge* 부터 평가 — 그 edge 의 출력이 위 layer 들을 거치며 *비선형 합성* 되어 metric 에 도달. 이 합성이 *위 layer 의 prune 결정에 의존* 하므로 평가가 *순회 중 누적 갱신* 의 의미가 완전 바뀌.

**예측**: 순방향이면 (a) 거의 모든 edge 가 metric 에 큰 영향을 주는 것처럼 보임 (위쪽이 다 켜져 있으므로 신호가 위로 흐름) → over-conservative (너무 큰 회로). (b) 또는 inverse: layer 0 의 edge 가 *individually* 미세하면 prune 됐다가, 위 layer 가 그 정보를 *증폭* 하는 경우를 놓침 → under-conservative (cooperative effect 모두 잃음). 실험으로 확인 가능.

---

### Q2. *RoPE / ALiBi 의 positional encoding* 이 ACDC 의 회로 발견에 어떤 영향을 미치는가?

**왜 이 질문이 중요한가**: APF 의 본 가설이다. PE 종류에 따라 *어떤 motif 가 자연 발생하는가* 가 달라지면, ACDC 가 발견하는 회로의 *모양* 도 PE 에 의존. ACDC 는 이를 *통제 변수* 로 보지 않고 *주어진* 으로 받음. 즉 *같은 task, 다른 PE* 의 모델에 ACDC 를 돌리면 회로가 *얼마나 다르게* 나오는지가 APF 의 직접 검증.

**예측**: (a) Absolute PE (sinusoidal) 는 *특정 token-position 의 head* 에 의존 — 회로가 *position-conditional*. (b) RoPE 는 *상대 position* 만 — 회로가 *translation-invariant*. (c) ALiBi 는 *거리 비례 bias* — 멀리 떨어진 edge 가 자동으로 prune 되는 경향. 같은 task 에서 ACDC 가 발견한 회로의 *edge density vs distance* 그래프가 PE 별로 다를 것.

---

### Q3. *Grokking 의 phase transition* 직후에 ACDC 를 돌리면 *어떤 edge 가 새로 들어오는가*?

**왜 이 질문이 중요한가**: Grokking-TS paper 의 핵심 실험. *pre-grok* 와 *post-grok* checkpoint 의 회로 차이가 *grokking 의 본질* 을 보여준다. Nanda 2023 는 modular arithmetic 에서 *Fourier circuit* 이 형성된다고 보였고, 이는 *post-grok* 시점에 갑자기 *주파수 채널 head* 가 활성화. ACDC 가 이를 자동 포착할까?

**예측**: pre-grok 시점에선 *memorization circuit* — 모든 example 의 (input, output) 짝을 외운 회로. 매우 크고 dense. post-grok 시점에선 *generalization circuit* — 더 작고 모듈성 강함. ACDC 의 회로 크기 곡선이 *grokking 시점에 급격한 sparsification* 을 보일 것. 또 *새로 들어온 edge 의 종류* (Fourier head, modular MLP 등) 가 grokking 의 *기능적 표지*.

---

### Q4. *시계열 forecasting* 에 ACDC 를 적용할 때 corrupted distribution 은 어떻게 정의되는가?

**왜 이 질문이 중요한가**: TS forecasting 은 *single sequence* 단위 task — IOI 처럼 *prompt template + 정답 token* 의 깔끔한 구조가 없다. corrupted = "같은 도메인의 다른 sequence" 또는 "phase-shifted 같은 sequence" 또는 "regime-permuted" 등 선택지가 다양하고 각 선택이 *어떤 정보를 task-relevant 로 정의하느냐* 를 바꿈.

**예측**: (a) *Phase-shifted* corrupted: PE 회로를 분리할 수 있지만 *trend/seasonal* 회로를 못 분리. (b) *Regime-permuted* corrupted: non-stationarity 회로 분리에 좋지만 *local* pattern 회로를 못 분리. (c) *White noise* corrupted: 모든 회로가 일제히 중요해져 회로 분리 무의미. → TS 도메인에서는 *multiple corruption schemes* 의 *교차* 가 회로 분리에 필요. ACDC 의 *단일 corrupted dataset* 가정의 깨짐을 명시적으로 다뤄야 함.

---

### Q5. ACDC 의 회로가 *해석 가능 (interpretable)* 하지 않을 수도 있는가? 즉 "다른 회로지만 같은 metric" 이 흔한가?

**왜 이 질문이 중요한가**: ROC AUC 는 *과거 손작업과의 일치율*. 두 회로가 *완전히 다른 head 집합* 임에도 *같은 metric* 을 만들 수 있다면 (degenerate solution), ACDC 의 *재현 가능성* 과 *해석 가능성* 이 분리됨. 운이 좋아 손작업 회로와 일치한 것이 아니라 *해석 가능 회로 가 유일* 하다는 보증이 없으면 ACDC 의 가치가 줄어든다.

**예측**: (a) *Small task / 작은 모델* (tracr, induction) 에선 회로가 유일에 가까움 — 모듈성이 강제됨. (b) *큰 모델 / 자연 task* (IOI, Greater-Than on GPT-2 small) 에선 backup mechanism + polysemantic head 때문에 *여러 회로* 가 같은 metric 을 줄 수 있음. 즉 ACDC 의 회로는 *one of many*. 이걸 검증하려면 seed (corrupted prompt sampling) 를 바꿔 가며 ACDC 의 회로를 여러 번 추출하고 *Jaccard similarity* 를 측정. 낮으면 degenerate, 높으면 unique.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **low-hanging fruit?**
2. **5 한계 매핑?**
3. **NeurIPS contribution?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
