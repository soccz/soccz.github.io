# 09. 내 연구와의 연결 — APF · Grokking · 반면교사

## 첫 번째 축 — APF (Attention Pattern Fields) 와 RoPE 의 직접 결합

### 흡수할 기법 1: RoPE 회전 스펙트럼 → motif 지도의 이론 좌표

APF 의 핵심 가설은 "PE 선택이 attention motif (diagonal / stripe / block / edge / spike / checker) 를 특정 방향으로 편향한다" 이다. RoPE 는 회전 주파수 $\theta_i = 10000^{-2(i-1)/d}$ 의 스펙트럼을 하드코딩하므로, 이 스펙트럼이 어떤 motif 를 유리하게 만드는지가 명확히 예측 가능한 대상이 된다.

- **구체 매칭**: APF main paper §5 (PE 비교 실험) 에서 sinusoidal / learned / **RoPE** / ALiBi / NoPE 5-way 비교의 이론적 기대치를 세울 때, RoPE 의 감쇠 성질 (Claim 3, `05_method_c` §4) 을 근거로 **"RoPE 는 diagonal-band motif 를 강하게 유도, off-diagonal stripe/checker 는 약화"** 라는 사전 예측을 세울 수 있다.
- **수식 활용**: 원 논문 식 (10) 의 상대위치 항등식 $q_m^T k_n = (W_q x_m)^T R^d_{\Theta, n-m} (W_k x_n)$ 을 그대로 APF Lemma 2.x 로 인용해, APF 의 motif classifier CNN 이 감지하는 diagonal-band 패턴이 이 회전 감쇠의 사영이라는 논증 을 만들 수 있다.
- **APF `paper/sections/STATUS.md`** 의 motif causality 실험 진행 중 트랙과 직접 결합: PE=RoPE 세팅에서 motif intervention (특정 diagonal 요소를 인위적으로 지우는 조작) 이 downstream 성능에 미치는 영향을 sinusoidal 세팅과 비교하면, RoPE 의 diagonal band 편향이 실증적으로 causal 인지 검증할 수 있다.

### 흡수할 기법 2: 선형 attention + RoPE 결합 → APF 의 kernel-form 확장

APF 초기 프로토타입은 softmax attention 만 다뤘지만, 실제 시계열 foundation model (Chronos, MOIRAI, TimesFM) 은 causal decoder 로 대규모 학습되어 계산 병목이 커진다. 향후 APF 를 linear attention (Performer 계열) 로 확장하려면 원 논문의 `05_method_d` 결합 형식이 그대로 참조 근거.

- **구체 매칭**: APF Extension Draft (아직 미작성) 에서 `Section: Linear attention extension` 을 만들 때 RoPE 원 논문 §3.5 의 kernel 결합 formula 를 직접 인용.

### 충돌 지점 — APF 관점에서 RoPE 의 "감쇠는 좋다" 는 규범적 판단은 반박 대상

RoPE 저자는 감쇠 성질을 이점으로 서술하나, APF 가 다루는 시계열 도메인 (특히 금융) 은 정확히 **long-range dependency 가 지배적** 인 곳. 어제 뉴스, 지난주 실적, 지난달 정책 변화가 오늘 가격에 영향을 준다. 이 도메인에서 RoPE 의 감쇠는 병목.

- **APF 논문 위치**: §6 (Discussion) 또는 §7 (Limitations of PE choices) 에서 "RoPE 의 sinusoidal-스펙트럼-유래 감쇠는 언어 도메인에서 이점이지만 금융 시계열에서는 장애물이 되며, 이는 우리가 관측한 diagonal-only motif 편향의 원인 중 하나로 보인다" 라는 문장을 배치.

### 인용 초안 (APF main draft 에 붙일 문장 형태)

> "Su et al. (2024) formalise position via block-diagonal rotation $R^d_{\Theta,m}$ with fixed spectrum $\theta_i = 10000^{-2(i-1)/d}$, yielding an inner-product identity $q_m^T k_n = (W_q x_m)^T R^d_{\Theta,n-m}(W_k x_n)$ that induces a natural long-range decay of attention magnitude. We hypothesise that this decay projects into diagonal-band motifs in our motif taxonomy (§3), which our RoPE-vs-NoPE comparison in §5.2 confirms."

## 두 번째 축 — Grokking-in-TS-Transformers 와 PE 축의 실험 그리드

### PE 를 실험 변수로 정하는 근거

사용자 Grokking-in-TS-Transformers plan §4 (실험 그리드) 에서 PE 축을 어떻게 정할지가 미결정 상태. RoPE 원 논문 검토를 통해 **"PE 선택이 grokking timing 에 영향을 준다"** 는 가설을 세울 수 있는 근거가 확보됨.

- **구체 논거**: RoPE 의 감쇠 성질은 attention 이 특정 상대 거리 밴드에 몰리게 만들고, 이는 회로 형성 (Nanda 2023 의 Fourier feature circuit 유사) 의 특정 pathway 를 유리하게 만든다. Grokking timing 이 회로 형성 속도의 함수라면 (Merrill 2023 tale of two circuits 관점), PE 선택이 grokking phase transition 의 timing 을 shift 시킬 수 있다.
- **실험 설계**: TS-Transformer (P2 logistic 4-layer) 을 5-way PE (NoPE / sinusoidal / learned / RoPE / ALiBi) × 3-seed 로 학습해 grokking timing (train/test loss gap 이 최소가 되는 epoch) 을 측정. 예상: NoPE 가 가장 늦고 (편향 없어 더 오래 찾음), RoPE 가 중간 (감쇠 편향으로 특정 pathway 조기 발견), learned 가 가장 빠르되 test 성능은 낮음 (overfit).

### Grokking `LITERATURE.md` 편입

Grokking track 의 `references/must_cite.md` 에 RoPE 원 논문을 새로 추가. 카테고리는 "PE / architecture as grokking modulator" 로 신설.

## 세 번째 축 — 반면교사

### RoPE 가 못한 것을 내가 어떻게 다룰지

1. **주파수 스펙트럼 데이터-의존화**: APF 에서는 도메인별 (금융 vs 언어) 최적 스펙트럼이 다를 것이라는 가설. RoPE 는 고정, 나는 도메인별 학습 가능한 $\theta_i$ 를 실험 조건으로 넣을 것.
2. **감쇠 vs long-range 균형**: RoPE 는 감쇠를 자연 성질로 받아들이지만, 나는 이를 실증 검증 대상으로 삼는다. Motif intervention (§ APF main §5) 을 통해 감쇠가 실제로 downstream 성능에 어떤 영향을 미치는지 measurement.
3. **Content-position 상호작용의 재도입**: RoPE 는 회전을 content 와 무관하게 위치에만 걸지만, 시계열에서는 최근 값 자체가 (예: 큰 변동성) 위치의 "무게" 를 바꿔야 할 수 있다. Content-conditioned rotation frequency ($\theta_i$ 가 $x_m$ 의 함수) 는 미개척 영역이며 APF Extension 후보 아이디어.

## `_profile.md` 관심 영역 매핑

- **§A Grokking / Delayed Generalization**: 위 두 번째 축. PE 가 grokking timing 을 조절하는 지렛대라는 가설을 실증할 substrate.
- **§B Mech interp / Circuit analysis**: RoPE 회전의 회로 관점 해석 (arXiv:2411.07602 Circuit Complexity Bounds, arXiv:2502.11276 Dimension Inefficiency) 은 APF 의 motif 를 회로 primitive 로 재해석하는 다리.
- **§C Attention as explanation / PE-attention geometry**: 직접 매칭. 본 논문이 §C 의 표준 좌표.
- **§D TS transformers / TSFM interp**: 간접 매칭. Chronos·MOIRAI·TimesFM (모두 사용자 커버 완료) 이 RoPE 나 그 유사체를 위치 임베딩으로 사용하므로 APF 를 TSFM 에 적용할 때 필수 이해.
- **§E 금융 시계열 응용**: 간접. 금융 데이터의 long-range dependency 특성 상 RoPE 의 감쇠가 발목잡힐 수 있다는 가설의 이론 근거.
- **§F 원거리**: 연결 약함.

## 보유 자산 활용 매핑

- **APF main track** (`Attention Pattern Fields/`): 이 논문의 회전 항등식 (Claim 2) 을 APF Lemma 로, 감쇠 성질 (Claim 3) 을 motif 편향 가설의 이론 근거로 흡수.
- **Grokking track** (`Grokking in Time Series Transformers/`): PE 축 실험 그리드에서 RoPE 를 5 종 후보 중 하나로 배치, `references/must_cite.md` 에 추가.
- **P1 ProTran-TFA** (paused): 확률예측 quantile head 에는 직접 관련 없음 — 연결 약함.
- **AETHER** (shelved): crypto 시계열 long-range dep 관점에서는 RoPE 의 한계 (반박 1) 가 관련 있으나 코드 부재로 실용성 낮음.

## 종합 판단

RoPE 는 APF track 의 **이론적 좌표계** 를 제공하는 논문이며, Grokking track 의 **실험 변수 근거** 를 제공한다. 인용은 APF main draft §2 (related work), §3 (motif taxonomy), §5 (experiments), §6 (discussion) 에 최소 4 회, Grokking plan §2 (related work) 및 §4 (experimental grid) 에 최소 2 회 예정.
