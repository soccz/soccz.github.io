# 3. 핵심 Claim 해체

## 배경 사다리

이 절은 논문의 핵심 주장 4개를 추출해 각 주장의 (a) 명제 본문, (b) 원문 어디서 나왔는지, (c) 저자가 당연시한 숨은 전제, (d) 전문 용어 없이 재진술 — 을 정렬한다. 이해를 위해 알아야 할 것: (i) **risk measure** = 확률변수 X 를 실수로 보내는 함수, "이 손실분포의 위험을 한 숫자로 표현" 이라는 추상화. (ii) **convex risk measure** = 양의 선형결합과 가중평균에 대해 위험이 줄어드는 (분산투자 효과) 측도. (iii) **OCE** = 비선형 utility 의 단조변환을 risk measure 로 끌어올리는 표현방식.

## Claim 1 — 헤징 = constrained convex risk measure 최소화

**주장**: 비완전시장에서 파생상품 포트폴리오를 트레이딩 제약 (거래비용·유동성·리스크 한도) 하에 헤지하는 문제는 **임의의 cash-invariant convex risk measure $\rho$ 에 대해 잔여 손실 $L(\delta)$ 의 $\rho$ 최소화** 문제로 형식화 가능하다.

$$
\pi(Z) = \inf_{\delta \in \mathcal{H}} \rho\Big( -Z_T + \sum_{k=0}^{M-1} \delta_k(s_k) \cdot \Delta S_k - \sum_{k=0}^{M-1} c_k(\delta_k, \delta_{k-1}) \Big)
$$

- **증거**: 원문 §2 "Problem formulation" (본 환경 직접 미확인) + 저자 GitHub README 의 core algorithm 표기 `max U[Z_T + Σ a(s_t)·DH_t + γ_t·|a(s_t)H_t|]` (utility 와 risk measure 의 부호 반전 등가).
- **숨은 전제**:
  - **이산시간 그리드** $0=t_0 < t_1 < \cdots < t_M = T$ 에서 거래가 일어난다 — 연속거래 한계 통과 시 추가 정리 필요.
  - **simulator 상의 측도** $\mathbb{P}$ 와 평가 측도 $\rho$ 의 측도 일치 — 즉 $\rho$ 는 실세계 측도에서 평가 (지수 utility 의 risk-neutral 변환 같은 trick 없음).
  - **$\mathcal{H}$ = 측정가능한 정책의 어떤 부분공간** — 정확히 어떤 정규성 (보통 보호된 Borel) 인지는 본 환경에서 확인 불가.
- **쉬운 말 풀이**: "옵션을 팔았으면 만기까지 손실을 줄이는 매매를 해야 한다. 손실의 위험을 '한 숫자' 로 평가하는 방법 (예: 가장 안 좋을 때 10% 의 평균 손실) 을 정하고, 그 숫자를 최소화하는 매매 패턴을 찾는다. 이때 사고팔 때마다 드는 수수료도 손실에 포함."

## Claim 2 — OCE 형태의 risk measure 는 SGD 학습이 가능

**주장**: 임의의 cash-invariant convex risk measure $\rho$ 가 OCE 형식 $\rho(X) = \inf_y \{ y + \mathbb{E}[\ell(-X - y)] \}$ (또는 utility 변환 $\rho(X) = -\sup_y \{\mathbb{E}[u(X+y)] - y\}$) 로 표현된다면, 손실은 **표본평균** 으로 무편추정 가능하고 **신경망 + Adam** 의 일반 학습 골격에 직접 꽂힌다.

- **증거**: 저자 `Network.md` verbatim "U(X) := sup_y: E[u(X+y) - y]". Entropy: $u(x) = (1-e^{-\lambda x})/\lambda$. CVaR: $u(x) = (1+\lambda)\min(0,x)$ 와 $\alpha = \lambda/(1+\lambda)$ (예: $\lambda=1 \Rightarrow$ CVaR@50%). 원문 §3 "Risk measures" 추정.
- **숨은 전제**:
  - **dual variable $y$ 가 학습 가능 변수로 별도 추가** 됨 — 한 칸의 스칼라이지만 손실의 모양에 영향. 잘못 초기화하면 수렴 더딤.
  - **$u$ 의 미분가능성·단조성** — CVaR 의 hinge $\min(0,x)$ 는 0 에서 비미분이지만 subgradient 로 처리.
  - **$X$ 의 적률 조건** — exp utility 는 $\mathbb{E}[e^{-\lambda X}] < \infty$ 가 필요 — heavy tail 분포에서 깨지면 학습 불안정.
- **쉬운 말 풀이**: "여러 가지 위험 평가법 (꼬리 평균, 지수 가중 등) 이 사실은 모두 '비선형 효용함수 + 보조 변수 하나' 의 형태로 표현된다. 그러면 컴퓨터가 손실 평균 대신 이 형태의 손실을 최소화하도록 학습시키면 된다. 이는 표준 학습 코드에 손실함수 줄만 바꾸면 끝."

## Claim 3 — ε-density 정리: 제약된 정책공간이 충분히 크다

**주장**: 거래비용·유동성·리스크 한도 등 제약 하에서 학습 정책 $\delta_\theta \in \mathcal{H}_{NN}$ (신경망으로 표현된 정책 공간) 은 **임의의 측정가능한 최적 정책 $\delta^*$ 를 ε 정확도로 근사** 한다. 즉 학습 가능한 정책 공간이 이론적으로 의미 있는 최적해를 놓치지 않는다.

- **증거**: WebSearch 인덱스 verbatim "the set of constrained trading strategies used by their algorithm is large enough to ε-approximate any optimal solution". 원문 §4 (Theorem 4.3 또는 4.4 추정) — 본 환경에서 정확한 정리 번호와 증명 구조는 단정 불가.
- **숨은 전제**:
  - **Cybenko / Hornik 의 universal approximation** + **제약 영역의 콤팩트성** — 콤팩트하지 않으면 ε 일정 거리 보장이 깨질 수 있다.
  - **상태공간이 적절히 정규** (사실상 $\mathbb{R}^d$ 의 Borel 부분집합) — 비표준 path-dep state 의 경우 추가 정리 필요.
  - **활성함수의 비다항식** (ReLU 가 충족) — 이 조건 없으면 universal approximation 자체가 깨짐.
- **쉬운 말 풀이**: "신경망이 표현할 수 있는 매매 패턴의 집합이 '가능한 모든 매매 패턴' 의 (수학적으로 매우 빽빽한) 부분집합이다. 그래서 학습이 잘 되면 신경망은 이론적으로 가장 좋은 매매 패턴에 임의로 가까이 갈 수 있다." 이는 단순한 universal approximation 의 적용처럼 보이지만 제약 (거래비용·한도) 이 들어간 공간에서 보존된다는 게 비자명한 점.

## Claim 4 — Heston + 거래비용 실증에서 DH > BS-delta

**주장**: Heston 확률변동성 모형 + 비례 거래비용 하에서 deep hedging 정책의 OCE risk 는 **표준 closed-form BS-delta 헤지의 OCE risk 보다 낮다**. 거래비용이 클수록 격차가 커지며, 고차원 (다수 헤지 도구) 에서도 작동.

- **증거**: WebSearch 인덱스 verbatim "synthetic market driven by the Heston model, where they outperform the standard 'complete market' solution" + "experiments with proportional transaction costs show promising results and the approach is also feasible in a high-dimensional setting". 원문 §5 "Experiments" 추정.
- **숨은 전제**:
  - **simulator (Heston) 자체가 실제 시장에 충분히 가깝다** — 미스스펙이면 정책도 미스스펙. 후속 Adversarial Deep Hedging 이 이를 정면 공격.
  - **거래비용이 비례 (proportional)** — 고정비용 (fixed cost) 이나 시장 충격 (impact = 거래량 함수의 가격변화) 은 별도 다룸.
  - **BS-delta 가 fair 한 baseline** — 원래 BS-delta 는 거래비용·stochastic vol 가정에 맞지 않으므로 미스스펙된 baseline 을 이긴다는 게 약간의 strawman 위험.
- **쉬운 말 풀이**: "이상적 세계에서 만들어진 분석 공식을 이상적이지 않은 세계에 그대로 쓰면 잘 안 먹힌다. AI 가 이상적이지 않은 세계 자체를 보고 배우면 더 잘한다. 그리고 옵션이 한 개에서 여러 개로 늘어나도 AI 는 못 따라가지 않는다."

## Claim 들의 관계도

```
  Claim 1 (정식화)
       │
       ▼
  Claim 2 (OCE = SGD 친화) ── 학습 가능 손실 ──┐
       │                                      │
       ▼                                      ▼
  Claim 3 (정책공간 density)           Claim 4 (Heston 실증)
       │                                      ▲
       └─── 최적해에 가까이 갈 수 있음 ──────┘
```

Claim 1·2 가 "**어떻게 풀 것인가**" 의 정식화·계산도구. Claim 3 이 "**왜 풀 수 있다고 믿는가**" 의 근사 보장. Claim 4 가 "**실제로 풀린다**" 의 실증. 이 4개가 서로 받쳐주는 구조 — 셋 중 하나만 빠져도 논문이 안 굴러간다.
