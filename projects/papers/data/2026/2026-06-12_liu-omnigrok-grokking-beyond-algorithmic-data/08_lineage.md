# 08 · 이론적 계보

## 이론적 조상 (Omnigrok 가 직접 흡수·확장한 선행)

### A. Power, Burda, Edwards, Babuschkin, Misra (OpenAI, 2022) — arXiv:2201.02177

**관계**: *발견 → 메커니즘* 의 관계. Power et al. 이 modular arithmetic 에서 grokking 자체를 *발견* 하고 (weight decay × train fraction) 평면의 4-phase diagram (memorize / confusion / grokking / generalize) 을 그렸지만, *왜* 라는 질문에 대답 안 함. Omnigrok 은 동일 task 를 reduced landscape 의 LU 관점에서 *재해석* — Power 의 phase diagram 의 *grokking phase* 가 LU 의 *Goldilocks zone* 에 해당함을 시사 (정확한 매핑은 본문 미접근).

**본 레포 커버**: 2026-05-08 ✓.

**관전 포인트**: Power 의 4 phase 와 Omnigrok 의 LU 가 *같은 현상의 두 표현* 인지, 아니면 *다른 정보* 인지의 명시적 distinction 이 본 논문에 있는가. 만약 있다면 그것이 본 논문의 *원조 task 재해석* 의 가장 강한 contribution.

### B. Liu, Kitouni, Nolte, Michaud, Tegmark, Williams (NeurIPS 2022) — arXiv:2205.10343

**관계**: *축 선언 → 축 확장*. 본 논문의 1 저자 Liu 의 직전 작업. "Effective Theory" 에서 *embedding 의 원형 manifold 구조* 가 generalization 의 조건이고 "Goldilocks zone" 이라는 용어가 이미 등장. Omnigrok 은 이 용어를 *weight norm 축* 위의 spherical shell 로 *재정의·확장* 한다. Toy synthetic 한정 → general ML domain 확장.

**본 레포 커버**: 2026-05-25 ✓ (`liu-effective-theory-grokking/`).

**관전 포인트**: 두 논문의 "Goldilocks zone" 이 정확히 같은 개념인지 (embedding manifold 의 critical radius vs weight norm 의 critical radius) 의 미묘한 명명 차이. Liu et al. 2022 가 *representation level* 의 zone 이라면 Omnigrok 은 *parameter level* 의 zone — 후자가 더 측정 가능하지만 둘이 정확히 1:1 mapping 되는지는 본 논문 추가 검증 가능 영역.

### C. Nanda, Chan, Lieberum, Smith, Steinhardt (ICLR 2023) — arXiv:2301.05217

**관계**: *Mechanism (algorithmic-specific) ↔ Mechanism (universal)* 의 평행 비교. Nanda 는 modular addition 의 grokking 을 *Fourier circuit 의 형성 progress measure* 로 정확히 해부 — 하지만 그 분석은 *Fourier circuit 이 작동하는 task* 에 한정. Omnigrok 은 *circuit-level 정보를 포기하는 대신* weight norm 이라는 *coarser 축* 으로 general domain 으로 확장. 두 논문은 같은 task (mod add) 에서 *다른 abstraction 수준* 에서 grokking 을 본 셈 — 상호 보완.

**본 레포 커버**: 2026-04-27 ✓.

**관전 포인트**: 만약 Nanda 의 Fourier circuit 완성도가 *weight norm 의 함수* 로도 단조 증가한다면 두 framework 가 정확히 호환. 본 논문이 Nanda 의 progress measure 와 LU 의 $w_c$ 의 *시점 일치* 를 직접 plot 했는지는 본문 미접근.

### D. Davies, Langosco, Krueger (arXiv:2303.06173, 2023) — Unifying Grokking & Double Descent

**관계**: *경쟁 가설 → 흡수* 의 관계. Davies et al. 도 grokking 과 double descent 의 공통 메커니즘을 찾으려 했고, "pattern learning speed" 라는 통합 축을 제시. Omnigrok 의 LU 도 double descent (weight norm 축 위 U 자) 의 일종으로 해석 가능 — 검색 카드 verbatim: *"The 'U' curve can be recovered from a double descent simply by changing the x-axis from the number of model parameters to the 2-norm of model parameters."* 즉 Omnigrok 의 U 자가 weight-norm 축 위 double descent 와 *동등* 함을 저자가 명시.

**본 레포 커버**: 미커버 (`_index.md` Tier 3 candidates).

## 평행 연구 (비슷한 시기, 다른 접근)

### E. Thilak et al. 2023 — Slingshot Mechanism

**관계**: *Optimizer-level 가설 vs Landscape-level 가설*. Thilak 은 Adam 의 second-moment 의 slingshot 효과가 grokking timing 을 만든다고 봄. Omnigrok 은 optimizer 의 종류와 독립적으로 *weight norm 의 radial drift* 가 timing 을 결정한다고 봄. 두 가설은 *완전 호환되지 않으나 양립 가능* — Adam 의 slingshot 이 *effective $\gamma$* 의 변동으로 흡수될 수 있음.

**누가 어떤 영역에서 이기는가**: SGD 에서도 grokking 이 일어나는 케이스에서는 Omnigrok 이 우세 (Slingshot 은 Adam-specific). Adam 의 특정 timing 미세 (예: $\beta_2$ 의존성) 에서는 Slingshot 이 더 정밀.

### F. Merrill, Tsilivis, Shukla (2023) — Tale of Two Circuits (arXiv:2303.11873)

**관계**: *Sparse vs Dense subnetwork competition* 가설. Sparse parity task 에서 grokking 의 phase transition 이 *sparse subnetwork 의 빠른 norm growth* 와 *나머지 neuron 의 느린 decay* 의 경쟁임을 식별. Omnigrok 의 *global weight norm* 관점과 *substructure level* 관점이 정확히 호환되는지는 미지수 — Omnigrok 이 global, Merrill 이 local.

**누가 어떤 영역에서 이기는가**: parity 와 같이 *sparsity structure 가 강한 task* 에서는 Merrill 이 더 mechanistic. 일반 표준 ML (MNIST 등) 에서는 Omnigrok 의 global 관점이 더 단순하고 robust.

### G. Lyle, Sokar, Pascanu, György (DeepMind, CoLLAs 2025) — arXiv:2507.20057

**관계**: *학습 phase 의 universal mechanism ↔ Non-stationarity 의 universal mechanism*. Lyle et al. 은 grokking 의 *연속 학습 (continual learning) 비유* 로 primacy bias, plasticity loss 와 연결. Omnigrok 의 weight norm 관점이 continual learning 의 *plasticity loss = weight norm 증가* 와 어떻게 호환되는지 흥미로운 후속 영역.

**본 레포 커버**: 2026-05-01 ✓ (`lyle-grokking-nonstationarity/`).

## 후손 예측 (이 논문에서 파생될 수 있는 연구 방향)

### 1. *Modern transformer 의 LU 검증* (likely 후속)

Omnigrok 은 MLP / LSTM / 작은 transformer 위주. 큰 transformer (GPT-class, ViT) 에서 LU shape 이 그대로 보이는지, 또는 attention layer 의 *post-LN / pre-LN* 차이가 LU 의 형태를 어떻게 바꾸는지 검증. 후속 논문 예시: "Grokking in Large Transformers" 류 (실제로 등장: 검색 인덱스에서 Furuta et al. 2024 "Looped Transformers learn iterative algorithms via grokking" 같은 작업이 본 라인을 어느 정도 연장 — 다만 직접 LU 검증은 별개).

### 2. *Architecture-aware LU* (현재 진행 중)

Layer-wise weight norm 의 분해 → 각 layer 의 *부분 LU* 가 어떻게 결합하는지. 검색 인덱스의 "Bridging Lottery Ticket and Grokking" (Bingbin et al. 2023, arXiv:2310.19470) 가 이 라인의 일부.

### 3. *LU 가 시계열 / non-stationary 데이터로 옮겨갈 때* (사용자 active track)

본 사용자의 Grokking in TS Transformers track 의 핵심 가설 — *시계열 데이터의 비정상성 (non-stationarity) 이 grokking 의 phase 를 다중화하는가?* — 가 직접 후속. logistic map TS 등에서 LU mechanism 의 *변형* (예: 시간축 sliding 에 따른 $w_c$ 의 drift) 을 측정하면 본 논문의 가장 흥미로운 finance/TS 후속이 됨.

## 한 문장 요약

Omnigrok 은 Power → Liu Effective Theory → Nanda → Davies 의 흐름에서 *축 추상화 (axis abstraction)* 단계의 정점에 위치하며, 후속의 architecture-aware / scale-aware / non-stationarity-aware 변형으로 이어질 자연스러운 출발점이다.
