# 10 · 사고 확장 ② — Follow-up 3편

## 선행 (Predecessor) — Liu, Kitouni, Nolte, Michaud, Tegmark, Williams (NeurIPS 2022) — Towards Understanding Grokking: An Effective Theory of Representation Learning (arXiv:2205.10343)

본 논문 1 저자 Ziming Liu 의 직전 작업. 본 레포 2026-05-25 ✓ 커버. Effective theory 로 modular arithmetic 의 *embedding 의 원형 manifold* 구조가 grokking 의 결정 인자임을 보임. Goldilocks zone 이라는 용어가 *representation level* 로 처음 등장. Omnigrok 은 같은 용어를 *parameter-level weight norm shell* 로 격상·확장. 두 논문을 같이 읽으면 *어떻게 같은 저자의 같은 직관* 이 toy synthetic 에서 general ML 로 옮겨지는지 라인이 보임.

**관계**: 본 논문이 *parameter-level* 의 zone 이고 선행은 *representation-level* 의 zone. 두 zone 의 *정확한 일치* 를 입증하는 후속 작업이 자연스러운 third paper. 사용자가 paper 의 §2.3 에서 두 framework 의 *equivalence 가설* 을 명시적으로 검증하면 본 논문 인용의 깊이가 강화.

**얻을 수 있는 것**: (a) Goldilocks zone 의 두 정의 (representation vs parameter) 의 일치 가능성, (b) Liu 라인의 framework 일관성, (c) effective theory 의 수식 자세 (parameter 의 정확한 scaling 관계) — 본 논문에서 흐릿하게 다룬 정량 관계가 effective theory 에서는 더 구체화되어 있을 가능성.

## 경쟁 (Competing) — Davies, Langosco, Krueger (2023) — Unifying Grokking and Double Descent (arXiv:2303.06173)

같은 시기 grokking 통합 시도. Davies et al. 의 통합 축 *"pattern learning speed"* vs Omnigrok 의 통합 축 *"weight norm"* 의 두 framework 가 *같은 현상의 두 표현* 인지, *다른 정보* 인지 직접 비교 가능. 검색 카드 verbatim 인용: *"The 'U' curve can be recovered from a double descent simply by changing the x-axis from the number of model parameters to the 2-norm of model parameters."* → 두 framework 가 *축 변환* 으로 연결됨을 명시.

**관계**: 본 논문이 *single mechanism (LU)* 의 강조, Davies 가 *grokking + double descent* 의 통합 — 둘 다 *통합 motivation* 을 공유하지만 다른 abstraction 수준. 같이 읽으면 *어떤 phenomena set 까지 같은 framework 로 묶을 수 있는가* 의 한계가 잡힘.

**얻을 수 있는 것**: (a) double descent 와 grokking 의 mechanistic equivalence 정도, (b) "pattern learning speed" 라는 alternative axis 의 학습 dynamics 측면, (c) 본 논문이 *암묵적으로* 흡수한 double descent 라인의 명시적 framing.

## 후속 (Successor) — Lyle, Sokar, Pascanu, György (Google DeepMind, CoLLAs 2025) — What Can Grokking Teach Us About Learning Under Nonstationarity? (arXiv:2507.20057)

본 레포 2026-05-01 ✓ 커버. Grokking 의 *원인 가설* 을 continual learning 의 *plasticity loss / primacy bias* 로 옮긴 후속 작업. Omnigrok 의 *static LU landscape* 가 *동적 환경 (non-stationary task)* 에서 어떻게 변하는지가 Lyle 의 주제 — Omnigrok 의 정확한 *dynamic 확장* 후보.

**관계**: 본 논문이 *static causal hypothesis*, Lyle 이 *dynamic / continual extension*. Lyle 이 본 논문을 *반박* 하지 않고 *확장* 하는 framing 으로 — 사용자의 paper 도 같은 포지셔닝.

**얻을 수 있는 것**: (a) non-stationary 환경에서 Goldilocks zone 이 어떻게 이동하는지의 실증, (b) plasticity loss 와 weight norm drift 의 관계 (Lyle 의 핵심 finding), (c) continual learning 의 표준 benchmark 위 LU 측정 방법.

**사용자 paper 의 인용 chain**: Power 2022 (discovery) → Liu Effective 2022 (toy mechanism) → **Omnigrok 2023 (universal mechanism)** → Nanda 2023 (algorithmic-specific mechanistic) → Lyle 2025 (dynamic extension) → **사용자 paper 2027 (TS non-stationary extension)**. 이 chain 의 마지막 자리가 사용자 contribution.
