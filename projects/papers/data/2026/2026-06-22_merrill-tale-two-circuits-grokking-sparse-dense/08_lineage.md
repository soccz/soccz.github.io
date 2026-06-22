# 08 · 이론적 계보

> **배경 사다리**: ① "이론적 조상 (ancestor)" = 본 논문이 직접 디딘 결과, ② "평행 연구 (parallel)" = 비슷한 시기 다른 접근, ③ "후손 (descendant)" = 본 논문에서 파생되는 방향. 시간 화살표 + idea 화살표를 분리해서 본다.

---

## 1) 이론적 조상 (직접 디딘 결과)

### 조상 1 — Power et al. 2022 "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets" (`arXiv:2201.02177`, OpenAI workshop / `2026-05-08 ✓`)

본 논문이 다루는 *현상 자체* 의 원래 발견자. modular arithmetic 데이터셋에서 작은 transformer 가 train 100% 후 한참 뒤에 test acc 가 sharp jump 하는 "grokking" 을 처음 명명·보고. 본 논문은 Power 의 4-phase diagram (memorization / comprehension / generalization / confusion) 의 **generalization phase 영역** (큰 weight decay × 충분한 epoch) 안에서 작업한다. Power 가 답하지 않은 것 — "phase transition 의 *내부 기계* 가 무엇인가" — 가 본 논문의 직접 출발점.

**직접 연결선**: Power 의 phenomenology 를 "원인 → 결과" 의 인과 그림으로 바꾸기 위해 (a) substrate 를 modular arith → sparse parity 로 (회로 구조가 더 명시적), (b) architecture 를 transformer → MLP (회로 분석 더 단순), (c) 측정을 acc curve → 노름 + 마스킹 + arity (4 종 시계열) 로 격상.

---

### 조상 2 — Nanda et al. 2023 "Progress Measures for Grokking via Mechanistic Interpretability" (`arXiv:2301.05217`, ICLR 2023 / `2026-04-27 ✓`)

grokking 의 **회로 수준 분석** 의 시작점. modular addition 에서 학습된 transformer 의 회로가 *Fourier basis* 임을 발견 + progress measure (gradient symmetry, restricted loss) 가 grokking 을 단조 monitoring 가능한 양으로 환원. 본 논문은 Nanda 의 *회로 발견* protocol 을 받아 — *과제* 는 sparse parity 로, *측정* 은 sparse subnetwork 의 *시간 진화* 로 — 회로의 *역사* 를 추적한다.

**직접 연결선**: Nanda 의 progress measure 는 "한 회로의 *기여도*" 시계열, 본 논문의 $k^\star(t)$ 는 "회로의 *차원*" 시계열. 두 시계열은 *상보적* — Nanda 가 "어떤 양이 변하는가" 라면 본 논문은 "회로의 *모양* 이 어떻게 변하는가" 를 보여준다. 본 논문이 Nanda 의 결과를 sparse parity 에 *복제* 했는지 (본문 PDF 미확인) 는 후속 작업의 빈 자리.

---

### 조상 3 — Liu et al. 2022 "Towards Understanding Grokking: An Effective Theory of Representation Learning" (`arXiv:2205.10343`, NeurIPS 2022 / `2026-05-25 ✓`)

grokking 을 *effective theory* (representation learning 의 두 모드) 로 모형화. 본 논문은 Liu 의 *macroscopic order parameter* (representation quality) 수준 묘사를 *microscopic 회로 수준* 으로 내림. Liu 가 "어떤 두 모드가 *상태공간 위에서* 경쟁하는가" 라면, 본 논문은 "어떤 두 *부분망* 이 *뉴런 공간 위에서* 경쟁하는가" 의 같은 두-population view 의 회로 instantiation.

**직접 연결선**: Liu 의 "fast/slow mode separation" 이 본 논문의 "rapid growth/slow decay" 의 macro-micro 대응. weight decay 의 역할에 대한 둘의 해석은 일관 — 두 모드/집단을 분리시키는 *선택압*.

---

### 조상 4 — Frankle & Carbin 2019 "The Lottery Ticket Hypothesis" (`arXiv:1803.03635`, ICLR 2019)

"잘 학습된 큰 네트워크 안에는 *처음부터 효율적으로 학습 가능* 한 작은 sparse subnetwork (winning ticket) 가 숨어 있다" 의 가설. 본 논문의 sparse subnetwork 는 lottery ticket 의 *동학적 사촌* — 학습이 자연히 그 sparse 구조로 *수렴* 함을 보임. 두 가설의 차이는 (a) lottery: post-hoc *magnitude pruning + rewind retrain*, (b) 본 논문: *자연 학습 도중의 자체 발견*.

**직접 연결선**: 두 sparse subnetwork 가 *같은 것인가* 의 검증이 빠진 부분 — 본 논문이 만든 sparse 와 lottery rewind 이 만든 sparse 가 인덱스로 일치하는지 비교하면 두 가설의 *통합* 가능.

---

## 2) 평행 연구 (비슷한 시기, 다른 접근)

### 평행 1 — Davies, Langosco, Krueger 2023 "Unifying Grokking and Double Descent" (`arXiv:2303.06173`, NeurIPS 2023 ML Safety workshop)

같은 2023년 3월 발표. grokking 과 double descent 를 *pattern learning speed* 의 동일 frame 으로 통합 — "model-wise grokking" 의 첫 데모. 본 논문이 *time-wise* 회로 경쟁이라면 Davies 는 *capacity-wise* 같은 동학의 일반화. 두 접근은 **수직 보완** — 본 논문의 시간 축 회로 경쟁이 Davies 의 capacity 축으로 옮겨가면 "큰 model 의 sparse subnetwork 가 더 빨리 등장" 같은 예측 가능.

→ 두 논문 모두 **다음 월요일 후보** (Davies 는 `_index.md` Tier 3 미커버). 본 논문이 회로 mechanism, Davies 가 unification — 코어 버킷의 다음 사이클에서 Davies 도 cover 가치.

---

### 평행 2 — Thilak et al. 2023 "The Slingshot Mechanism" (식별자 미상)

Adam optimizer 의 second moment normalization 이 만드는 *slingshot* 효과로 weight 가 갑자기 분출하는 mechanism 으로 grokking 을 설명. 본 논문이 SGD + hinge 의 *coherent gradient* 분리를 강조한다면, Thilak 은 *optimizer 의 numerical artifact* 가 phase transition 을 만든다는 직교 관점. 두 mechanism 이 *서로 다른 setup* 에서 *각자 작동* 가능 — Adam 환경에선 slingshot 이 더 결정적일 수 있고, SGD 환경에선 norm-bimodality 가 더 결정적.

→ 비교 실험 가능: 같은 sparse parity 를 Adam 으로 학습 → norm bimodality 가 약화되고 slingshot 형 phase transition 이 등장하는지.

---

### 평행 3 — Bridging Lottery Ticket and Grokking (`arXiv:2310.19470`)

본 논문 7 개월 뒤 후속 작업. lottery ticket 가설과 grokking 의 *직접 통합* 시도. 본 논문의 sparse subnetwork 가 lottery rewind 의 winning ticket 과 같은지의 인덱스 비교를 수행 (검색 인덱스 단편 기반 추정 — 본문 미확인). 본 논문의 차별성을 *명시* 또는 *동일성* 으로 정리하는 후속.

---

### 평행 4 — Omnigrok (Liu·Michaud·Tegmark 2023) `arXiv:2210.01117` (`2026-06-12 ✓`)

같은 Liu 그룹의 후속. weight norm 의 *Goldilocks zone* (좋은 구의 껍질) 이 일반화 영역을 정의함을 *5 도메인 universality* 로 검증. 본 논문이 *개별 뉴런의* 노름 dynamics 라면 Omnigrok 은 *전체 weight 의* 노름 manifold. 두 결과는 **scale 의 사다리** — 본 논문의 individual neuron norm bimodality 가 Omnigrok 의 global norm Goldilocks 의 *마이크로* 기원일 가능성.

---

## 3) 후손 예측 (이미 나왔거나 나올 방향)

### 후손 1 — "Sparse subnetwork 의 representation 분해 via SAE" (Marks 2024 SFC 와 본 논문 결합) `arXiv:2403.19647` (`2026-05-15 ✓`)

본 논문의 sparse subnetwork 가 *어떤 feature* 를 표현하는지의 SAE-level 분해. 본 논문이 "sparse subnetwork 가 존재" 까지라면, SFC 의 framework 로 그 sparse subnetwork 의 각 뉴런이 어떤 *interpretable feature* (= input bit-conjunction) 를 표현하는지 까지 내려갈 수 있음. 본 논문 + SFC 의 결합은 *circuit + feature* 의 dual 해부.

---

### 후손 2 — TS Forecasting Grokking 에서의 회로 경쟁 (사용자 본인 트랙 — `Grokking in Time Series Transformers/`)

본 논문이 *algorithmic* sparse parity 에서 회로 경쟁을 보였다. *TS forecasting* (특히 non-stationarity 가 있는 regime-switching 시계열) 에서 같은 dense → sparse 경쟁이 보이는지의 검증이 사용자의 직접 후속. *regime memorization* 회로 (dense, 각 regime 의 sample 외움) → *regime-invariant* sparse 회로 (regime 검출 + per-regime forecast 의 분리) 의 경쟁 가설. 이 후속이 사용자의 NeurIPS 2027 1순위 plan 의 핵심 검증 가능.

---

### 후손 3 — "Why-grokking-now" 의 인과 개입 — 노름 강제 고정 실험

본 논문이 노름 동학을 *관측* 했다면, 다음 단계는 노름을 *개입* 한다. phase transition 직전에 (a) sparse 후보 뉴런의 노름을 고정 → 회로 형성이 *멈추는가*, (b) dense 뉴런의 노름을 강제로 키움 → 회로 경쟁이 *지연되는가*. 이런 do-calculus 식 개입이 *mechanism* 의 인과적 검증을 만든다. (Marks 2024 SFC 의 *SHIFT* 식 ablation 의 grokking 변형.)
