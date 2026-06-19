# 4. 방법론 (D) — ε-근사 정리와 density 보장

## 배경 사다리

이 절은 "신경망으로 학습되는 정책공간 $\mathcal{H}_{NN}$ 이 진짜 최적 정책 $\delta^*$ 와 임의로 가까이 갈 수 있다" 를 보이는 정리를 다룬다. ① **dense 부분집합** = 어떤 점이든 임의로 가까이 원소가 있는 집합 (유리수는 실수에 dense), ② **콤팩트 (compact)** = 유한히 닫혀 있는 (compactness 가 ε-uniform approximation 의 핵심), ③ **measurable function** = "Borel 측도로 잘 정의되는" 함수 — 이 세 개념이 깔린다.

## 정리의 발음 (WebSearch verbatim 진술)

> "the set of constrained trading strategies used by their algorithm is large enough to ε-approximate any optimal solution"

즉:
$$
\forall \delta^* \in \mathcal{H}_{adm}, \ \forall \varepsilon > 0, \ \exists \theta_\varepsilon : \ \rho\big(L(\delta_{\theta_\varepsilon})\big) - \rho\big(L(\delta^*)\big) < \varepsilon
$$

여기서 $\mathcal{H}_{adm}$ = (a) measurable, (b) 제약 (자본·포지션 한도) 충족, (c) integrability 조건 (필요한 적률 유한) — 의 admissible policy class. 본 환경에서 정확한 정리 번호와 가정 5개의 분류는 단정 불가 — 원문 §4 (정확한 절 번호는 본 환경 차단으로 미확정) 의 main theorem 으로 추정.

### 수식 4줄 해석

- **기호 뜻**: $\delta^*$ = admissible 정책 중 risk measure $\rho$ 의 무한 최소화자 (그 존재 여부도 별도 보장 필요). $\theta_\varepsilon$ = ε 정확도 달성하는 신경망 파라미터. $L(\delta)$ = 정책 $\delta$ 하 손실 random variable.
- **일상 비유**: "어떤 농구 슛 패턴이든, 충분한 키와 팔길이 (네트워크 capacity) 가 있는 농구선수가 ε 거리 안으로 흉내낼 수 있다" — 의 수학적 표현.
- **왜 이 형태**: $\rho$ 의 값에 대한 ε-uniform — pointwise approximation 보다 강함. 손실측도의 보상 (risk-value) 자체가 가까워야 의미 있음.
- **조심할 점**: ε 가 작아질수록 필요한 $\theta_\varepsilon$ 의 차원 (네트워크 크기) 이 폭증할 수 있다. 정리는 "가능" 만 말하지 "효율적으로 가능" 은 말 안 함.

## 증명 스케치 (저자 명시 구조 추정 + 표준 보편근사 정리 보강)

원문에서 직접 정리 본문·증명을 확인하지 못해 본 환경에서는 단정 불가하지만, 표준 RL 이론과 Föllmer-Schied 표현 정리를 결합하면 다음 3단 구조가 자연스럽다:

### Step 1. Admissible policy class 의 분리가능성

$\mathcal{H}_{adm}$ 위에서 다음을 보임:
- $\mathcal{H}_{adm}$ 은 **continuous, bounded measurable** 정책의 집합과 ρ-distance 에서 dense (제약 영역이 닫혀있고 polytope-like 인 경우 표준).
- continuous bounded 정책의 집합은 다시 polynomial 정책의 집합과 dense (Stone-Weierstrass).

### Step 2. 신경망의 universal approximation

Hornik-Stinchcombe-White (1989) / Cybenko (1989) / Leshno (1993) 의 결과: 비다항식 활성함수 (ReLU, softplus) 를 가진 한 hidden layer 신경망 $\mathcal{N}$ 이 continuous bounded function 의 집합과 sup-norm dense.

### Step 3. risk measure 의 연속성으로 lift

$\rho$ 가 cash-invariant + monotone + convex + lower semi-continuous 라면, policy 의 sup-norm convergence 로부터 risk measure 의 convergence 가 따라옴 (Föllmer-Schied 정리 7.17 의 변형).

세 단계를 합치면 $\rho(L(\delta_\theta)) \to \rho(L(\delta^*))$ 의 ε-uniform approximation 보장.

### 핵심 비자명점

표준 universal approximation 의 "함수공간" 은 $\mathcal{F} = \{f: \mathbb{R}^d \to \mathbb{R}\}$ — 단순 함수. 본 정리의 핵심 비자명점은:

(a) **각 시점 $t$ 마다 정책** $\delta_t: \mathcal{S} \to \mathbb{R}^d$ 가 따로 — $M$ 개의 함수를 동시에 ε-근사.
(b) **제약 영역** 안에서 — 자본 한도, 포지션 한도, 신용 한도 등이 정책공간을 자르는 효과.
(c) **path-dependent state** — Markov state 만이 아닌 누적 보유·이전 행동을 포함한 augmented state.

이 셋을 동시에 통과하는 게 본 정리의 진짜 work.

## 가정 5개 (추정)

1. **확률공간** $(\Omega, \mathcal{F}, \mathbb{P})$ 가 표준 정규 (Polish, atomless 등).
2. **price process** $S_t$ 가 적응 (adapted) + integrable.
3. **payoff** $Z_T \in L^p$ for some $p \geq 1$.
4. **risk measure** $\rho$ 가 cash-invariant + monotone + convex + lower semi-continuous on $L^p$.
5. **transaction cost** $c_k$ 가 continuous + $c_k(0) = 0$ (사고팔지 않으면 비용 0).

본 환경에서 정확한 가정 목록 단정 불가. 5개 중 어느 하나가 깨지면 (예: $\rho$ 의 lsc 가 무너지면 sup 의 attainment 손실) 정리 적용 안 됨.

## 대안 비교 — "왜 굳이 함수공간 density 가 필요했나"

| 대안 | 한계 |
|---|---|
| **단순 RL 수렴정리** (Sutton-Barto 류) | tabular 또는 small policy class — high-dim 시장에선 적용 불가 |
| **PDE viscosity solution** (Cont-Tankov 류) | 1~2 차원에서만 풀이, 다차원은 PDE 수치오차 |
| **Föllmer-Leukert quadratic hedging** | quadratic 손실로 제한 — CVaR 같은 비대칭 risk 못 다룸 |
| **본 논문의 ε-density** | 임의 risk measure × 임의 simulator × 임의 제약 — 가장 일반 |

본 논문의 정리는 **함수근사 오차 = ε** 으로 정량화함으로써 후속 모든 deep hedging 연구가 "최적성" 의미를 부여받을 수 있게 만들었다. 단순 SGD 가 수렴하더라도 정책공간 자체가 dense 가 아니면 의미 없다 — 그게 빠진 게 본 정리 이전의 RL-trading 시도들이 갖는 약점.

## 정리의 한계

(i) **rate 가 없다** — ε 가 $1/n$ 정도인지 $1/\sqrt{n}$ 정도인지 (n = neuron 수) 미정량. (ii) **suboptimality bound 가 simulator 의 미스스펙 효과를 흡수 못 한다** — simulator 가 실세계와 다르면 정리의 ε 와 무관한 distributional gap 존재 (이게 후속 Adversarial Deep Hedging 의 공격 지점). (iii) **$\delta^*$ 의 존재 자체** 가 별도 정리 필요 — admissible class 가 비어 있지 않아야 함.

## 핵심 한 문장

> **"ε-density 정리는 '신경망 정책공간 자체가 충분히 크다' 는 보장 — 학습이 잘 되면 진짜 최적해에 임의로 가까이 갈 수 있음을 약속함으로써 SGD 수렴이 의미 있는 작업이 됨을 정당화한다."**
