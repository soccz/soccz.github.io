# 09 — 내 연구와의 연결

> **이 섹션은 `_profile.md`의 관심 영역 §A~F 및 보유 자산과 직접 연결한다.** 일반론 나열 금지 — 구체적 메커니즘·수식·draft 섹션을 지칭한다.

---

## §B (Grokking/Mech Interp) — 코어 연결: Grokking Track

### 연결 강도: ★★★★★ (직접 코어)

사용자는 2026-04-22 저녁에 "Grokking in Time Series Transformers" 트랙을 시작했다. 이 논문은 그 트랙의 **직접 이론적 토대**가 된다.

#### 흡수할 기법 1: Two-Circuit Competition Framework

본 논문의 $\mathcal{C}_\text{mem}$ vs $\mathcal{C}_\text{gen}$ 경쟁 프레임을 Grokking track에 그대로 가져올 수 있다.

가설 형태:
> "시계열 트랜스포머가 주기적 패턴을 학습할 때, 초기엔 특정 주기 값을 직접 암기하는 $\mathcal{C}_\text{mem}^{TS}$를 형성하고, 충분한 훈련 후 DFT 기반 주기 감지 알고리즘 $\mathcal{C}_\text{gen}^{TS}$로 전환된다."

이 가설은 Power (2022)와 Nanda (2023)의 모듈 덧셈 Fourier 회로 발견 + 본 논문의 KG 추론 two-circuit frame을 시계열 도메인으로 확장한 것이다. Grokking track 논문의 핵심 가설 섹션(§2.2 정도)에 다음 형태로 인용:

> "Wang et al. (NeurIPS 2024)은 KG 추론에서도 grokking이 암기 회로에서 일반화 회로로의 전환임을 보였다. 우리는 이 framework가 시계열 주기 패턴 학습에도 적용된다고 가설한다."

#### 흡수할 기법 2: Logit Lens 방법론

본 논문이 사용한 logit lens를 PatchTST·iTransformer에 적용해 "언제 grokking이 일어나는가, 어느 레이어에서 패치-레벨 특징이 형성되는가"를 추적할 수 있다.

구체적 실험: PatchTST를 sin 합성 데이터 + 로지스틱 맵에서 훈련하면서, 각 중간 레이어의 hidden state에 output head를 직접 붙여 "이 레이어까지의 예측 정확도"를 훈련 스텝별로 추적. Grokking 이전·이후의 레이어별 정확도 프로파일 비교.

이 실험 설계는 `Grokking in Time Series Transformers/` 폴더의 실험 계획 섹션에 즉시 추가 가능하다.

#### 충돌·경쟁 지점

본 논문의 주요 결과 중 하나는 "Composition OOD 실패가 트랜스포머의 비순환 구조에서 기인한다"다. 이를 TS 도메인에 적용하면: **시계열 트랜스포머가 훈련 분포 밖의 주기(OOD period)에서 일반화하지 못하는 것도 같은 구조적 한계인가?**

만약 그렇다면, Grokking track 논문은 "OOD 주기에서의 실패가 아키텍처 한계"라는 부정적 발견을 포함할 수 있다. 이것은 오히려 EOA(§A)의 연속시간 구조 — which allows recurrent-like information flow — 가 필요한 이유로 연결된다.

---

## §A (Economic Time / PE / Conditioning) — EOA (Paper 4)와의 연결

### 연결 강도: ★★★☆☆ (간접, 설계 교훈)

EOA의 핵심 아이디어는 "경제적 시간(economic time, τ(t))"을 attention에 condition하는 것이다. 본 논문의 parameter sharing 실험이 EOA 설계에 시사하는 바:

**교훈**: 복잡한 다단계 정보 처리(≈ KG에서의 two-hop)를 위해 레이어 간 정보 재순환이 필요하다. EOA가 Neural ODE 기반의 연속 시간 레이어를 사용하면, 이 "recurrent-like 흐름"이 자연스럽게 내장된다.

구체 연결:

`economic_ode_attention/` draft의 §3.2에서 τ(t) 정의 부분 아래에 다음 주석 형태로 인용 가능:
> "비순환 트랜스포머는 다단계 추론에서 레이어 간 정보 재순환 없이 OOD 실패를 보인다 (Wang et al., 2024). EOA의 Neural ODE 레이어는 연속 시간 흐름으로 이 한계를 구조적으로 완화하는 잠재력을 갖는다."

단, 이 연결은 가설적이며 실증하려면 별도 실험이 필요하다. EOA draft에 넣기엔 주의가 필요하다 — 강제 매칭 금지 원칙을 유의.

---

## §D (금융 시계열 / 자산가격 응용) — P1 ProTran-TFA와의 연결

### 연결 강도: ★★☆☆☆ (약함, 데이터 설계 교훈만)

P1 ProTran-TFA는 금융 시계열 예측 트랜스포머다. 본 논문의 $\phi$ (inferred/atomic 비율) 발견이 P1의 **데이터 설계**에 하나의 교훈을 준다:

> 학습 데이터에서 "두 번에 걸친 패턴 합성(예: 추세 × 계절성 조합)"의 예시가 충분히 포함돼야 트랜스포머가 이를 내재화한다. 원자적 패턴(단순 추세, 단순 계절성)만 있고 합성 패턴(추세 + 계절성)이 없으면 모델이 합성 예측 능력을 얻기 어렵다.

이것은 ProTran-TFA의 데이터 증강(data augmentation) 설계에 반영할 수 있다. 단, 금융 시계열에서 "원자적 패턴"과 "추론된 패턴"을 어떻게 정의할지는 별도 고민이 필요하다.

---

## §E (금융 × ML 원거리) — AETHER와의 연결

### 연결 강도: ★★☆☆☆ (개념적, 약한 전이)

AETHER는 암호화폐 시장 ML 프레임워크 설계다. 본 논문의 composition/comparison 구분이 AETHER의 추론 구조 설계에 하나의 프레임을 제공한다:

- **Composition 추론**: "BTC 가격 → DeFi TVL → altcoin 흐름" 같은 다단계 causal chain. Grokking 기반 composition이 필요하다면 직접 학습이 아닌 장기 훈련이 필요.
- **Comparison 추론**: "BTC vs ETH 모멘텀 강도 비교". 이 유형은 OOD 일반화가 더 잘 되므로 실용적으로 더 신뢰 가능.

단, 이 연결은 느슨하다. "연결 약함, 전이 가능성만 있음"으로 명시한다.

---

## 반면교사: 이 논문이 못한 것

1. **실제 언어 모델 검증 부재**: 본 논문의 발견이 GPT-2 수준 합성 KG에 한정된다는 한계를 반면교사 삼아, Grokking track 논문은 **실제 시계열 데이터(ETT, GEFCom)**에서의 실험을 핵심에 두어야 한다. 합성 sin/로지스틱 맵만으로는 충분하지 않다.

2. **분산 미보고 문제**: Grokking 발생 타이밍의 시드 의존성이 보고되지 않았다. Grokking track 논문에서는 **최소 5개 랜덤 시드**에서 grokking 발생 여부와 타이밍을 보고해야 한다.

3. **$\phi$ 개념의 TS 적용**: KG의 inferred/atomic 비율 $\phi$ 개념을 TS 도메인에서 어떻게 정의할지 — 논문이 답하지 않은 이 질문이 Grokking track의 핵심 contribution 후보가 될 수 있다.
