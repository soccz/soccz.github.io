# 09_my_research — 내 연구와의 연결

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 내 연구와의 연결
- 시그널 활용 방법

---

> 이 절은 `_profile.md`의 APF (Attention Pattern Fields), Grokking in TS Transformers, P1 ProTran-TFA 세 active/paused 트랙과의 구체적 연결을 다룬다. 일반론 나열 금지 — 구체적 mechanism, axis, 수식 요소를 지정한다.

---

## §D 연결: APF (Attention Pattern Fields) — 가장 강한 연결

**연결 강도**: ★★★★☆ (강함)

### 1. Inter-Stock Attention Map ↔ APF의 2D Motif

APF 프로젝트는 TS 트랜스포머의 attention 행렬 $A \in \mathbb{R}^{L \times L}$에서 2D 모티프(diagonal, stripe, block, edge, spike, checker)를 식별하고 해석하는 framework다.

MASTER의 inter-stock 어텐션 행렬 $A_{inter} \in \mathbb{R}^{N \times N}$ (시각 $t$마다 하나)은 APF의 분석 대상과 다른 차원(종목 × 종목)이지만, **같은 2D 패턴 분석 질문**을 적용할 수 있다:

- $A_{inter}$의 block 구조 → 산업 섹터 클러스터링
- $A_{inter}$의 stripe 구조 → 특정 "리더 종목"이 전체에 영향을 주는 패턴
- $A_{inter}$의 diagonal 구조 → 각 종목이 자기 자신만 참고하는 무상관 상태
- 저자 보고: $A_{inter}$가 비대칭이고 날짜별로 서서히 변화함 → APF의 motif causality 실험과 동일한 방법론 적용 가능

**APF 프로젝트에 어떻게 쓸 수 있나**: APF는 현재 시계열 트랜스포머의 Q-K attention 패턴을 UCR Archive 기반 합성 데이터에서 분석하고 있다. MASTER의 금융 도메인 $A_{inter}$ 패턴 분석은 APF 프레임워크가 "실제 비정상 금융 데이터"에서도 유효한지 검증하는 테스트베드로 사용 가능하다.

**구체적 적용 포인트**: APF의 CNN probe (§C의 attention rollout/flow) 방법론을 MASTER의 inter-stock 어텐션 행렬에 적용하면, "어떤 종목 상관 패턴이 수익률 예측에 인과적으로 기여하는지" 실험적 분리가 가능하다 — 이는 07_limits의 반박 1("cross-time 상관이 실제로 학습되는가")을 검증하는 방법이기도 하다.

### 2. Market-Guided Gating ↔ APF의 PE Comparison 실험

APF 프로젝트는 PE 유형(NoPE/sinusoidal/RoPE/ALiBi)에 따라 attention 패턴이 어떻게 달라지는지를 비교한다. MASTER의 market-guided gating은 일종의 "입력 공간의 conditioning"으로, 게이팅이 attention 패턴에 미치는 영향을 APF 방법론으로 분석할 수 있다.

**인용 포인트**: APF 논문의 §3 "PE × Motif 상호작용" 섹션에서 MASTER의 게이팅을 "conditional attention pattern modification"의 사례로 인용 가능.

---

## §E 연결: P1 ProTran-TFA — 중간 연결

**연결 강도**: ★★★☆☆ (중간, 이식 가능)

P1 ProTran-TFA는 probabilistic transformer 기반 tactical factor allocation 모델로 현재 paused 상태다. MASTER와의 연결:

### 1. Market-Guided Gating → ProTran-TFA의 컨디셔닝 모듈

ProTran-TFA는 팩터 포트폴리오(FF5, 모멘텀 등)의 시장 국면별 최적 가중치를 예측한다. MASTER의 market-guided gating ($m_\tau$ → feature 재가중)은 ProTran-TFA의 "국면별 팩터 선택" 문제와 구조적으로 동일하다.

**이식 가능한 설계**: MASTER의 게이팅 메커니즘($m_\tau \to g \to \hat{X} = X \odot g$)을 ProTran-TFA의 입력 전처리 모듈로 직접 이식할 수 있다. 다만 ProTran-TFA의 팩터는 FF5/모멘텀 5~7개 수준으로, Alpha158의 158개보다 훨씬 작다 — 게이팅 복잡도가 낮아 β 조율이 더 용이할 것이다.

**구체적 인용 포인트**: ProTran-TFA 논문의 §3 "Factor Selection Module" (가정) 에서: "시장 국면에 따른 팩터 유효성 변화를 자동화하기 위해, MASTER [Li et al. 2024]의 market-guided gating 메커니즘을 금융 시계열 팩터 선택에 적응했다"는 형태로 인용 가능.

### 2. Cross-Time 종목 상관 → ProTran-TFA의 다중 자산 분석

ProTran-TFA가 단일 자산 예측에 집중한다면, MASTER의 inter-stock 어텐션 구조를 도입해 다중 팩터 간 cross-time 의존관계를 모델링할 수 있다. 예를 들어 "가치 팩터의 3주 전 신호가 모멘텀 팩터의 이번 주 수익률에 미치는 영향"을 cross-time 어텐션으로 포착.

---

## §B 연결: Grokking TS Transformers — 약한 연결

**연결 강도**: ★★☆☆☆ (약함, 전이 가능성만 있음)

Grokking 트랙은 TS 트랜스포머가 non-stationarity 하에서 어떻게 일반화(delayed generalization)하는지를 연구한다. MASTER와의 접점:

- **비정상성(non-stationarity)**: 중국 주식 시장은 극도로 비정상적인 시계열이다. MASTER가 T=8 lookback과 CSZscoreNorm 단면 표준화로 이를 처리하는 방식 → "비정상 TS에서의 어텐션 학습 동역학"의 사례 연구로 참조 가능
- **학습 안정성**: 시장이 급변할 때 inter-stock 어텐션 행렬이 어떻게 변화하는지 → grokking이 일어나는 조건(regime change)에 대한 힌트
- **직접 인용 가능성**: Grokking × non-stationarity 논문에서 "금융 TS의 비정상 환경에서 cross-time 상관 패턴의 변화"를 MASTER를 사례로 인용할 수 있으나, 이는 직접 연결이 아닌 동기 부여 수준의 인용

---

## §C 연결: Attention as Explanation — 부가 연결

**연결 강도**: ★★☆☆☆ (약함)

APF의 §C 라인 (Jain-Wallace 2019 계열)에서 "어텐션이 설명인가, 아닌가"를 다루는데, MASTER의 inter-stock 어텐션이 "어떤 종목이 다른 종목에 영향을 줬는지" 설명으로 해석되는 방식이 이 논쟁의 금융 도메인 사례다. 특히:

- MASTER의 어텐션 비대칭성 → 단순 유사도 기반 어텐션이 아닌 방향성 있는 관계 포착의 증거
- Jain-Wallace 2019의 H2 (adversarial counterfactual attention) 검증을 MASTER에 적용한다면: "inter-stock 어텐션 가중치를 교란해도 예측이 유지되는가?" → 어텐션이 실제 인과 경로인지 테스트 가능

**인용 포인트**: APF 논문 §4 "Causal Intervention Results"에서 MASTER의 inter-stock 어텐션을 "금융 도메인에서 어텐션 해석 가능성 논쟁의 구체적 응용 사례"로 인용 가능.

---

## 반면교사: MASTER가 못한 것을 내가 어떻게 다룰지

**MASTER의 한계 → 내 연구 기회**:

1. **해석 가능성 부재**: MASTER는 "어떤 종목 상관이 왜 예측에 도움이 됐는지" 설명하지 못한다. APF의 causal intervention (attention masking/patching) 방법론을 inter-stock 어텐션에 적용하면 이 gap을 채울 수 있다.

2. **게이팅의 블랙박스성**: 시장 게이팅이 "어떤 팩터가 왜 선택됐는지" 설명하지 못한다. APF의 개념 탐침(concept bottleneck) 접근법이 도움이 될 수 있다.

3. **단일 시장 한계**: Grokking 프레임워크의 비정상성 분석(Lyle 2025 계열)을 결합해 다시장 비정상 환경에서의 학습 동역학을 분석하는 방향.
