# 4. 방법론 (A) — 큰 그림

## 배경 사다리

이 절을 이해하려면 ① **신경망이 함수를 표현하는 도구** (입력 → 가중합 → 비선형 → ... → 출력) 라는 점, ② **Monte Carlo 시뮬레이션** (확률과정에서 샘플 경로를 뽑아 평균으로 기댓값 근사) 의 의미, ③ **Adam 같은 SGD optimizer 가 gradient 의 noise 를 견디며 손실 최소화** 한다는 사실 — 이 세 가지면 충분하다.

## 한 장으로 본 Deep Hedging

```
┌───────────────────────────────────────────────────────────────┐
│  STEP 1. SIMULATOR — 시장 경로 생성                              │
│    Heston / Black-Scholes / SimpleWorld_Spot_ATM                │
│    Output: N 개의 가격경로 {S_0^{(n)}, ..., S_M^{(n)}}            │
│    + 옵션 페이오프 Z_T^{(n)} + 상태 변수 s_t^{(n)}                  │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  STEP 2. AGENT (NEURAL NET POLICY)                              │
│    각 시점 t 마다 상태 s_t (+ 이전 행동, 보유 포지션, hidden)         │
│    을 입력받아 행동 δ_t = π_θ(s_t) 를 출력.                          │
│    "feed-forward · recurrent · gated recurrence" 옵션 가능.        │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  STEP 3. P&L 계산                                                │
│    L^{(n)} = -Z_T^{(n)}                                          │
│           + Σ_t δ_t^{(n)} · ΔS_t^{(n)}        ← 헤지 손익          │
│           - Σ_t γ_t |δ_t^{(n)} - δ_{t-1}^{(n)}| · S_t^{(n)} ← 비용 │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  STEP 4. RISK MEASURE LOSS                                       │
│    Loss(θ, y) = - (1/N) Σ u(L^{(n)} + y) + y                     │
│    (Entropy / CVaR / OCE 등 — Network.md verbatim)                │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  STEP 5. SGD UPDATE — θ ← θ - η ∇_θ Loss, y ← y - η ∇_y Loss     │
└───────────────────────────────────────────────────────────────┘
                           │
                           └→ (iterate until Loss converges)
```

이게 전체 다이어그램. 4개 블록 (Simulator / Agent / P&L / Risk Loss) 이 서로 결합 가능 — 어느 한 블록을 바꿔도 다른 셋은 그대로 작동. 이게 본 논문의 "framework" 성격.

## 왜 이 구조여야 했나

### "분석적 닫힌형 대신 함수근사" 의 정당성

블랙-숄즈는 PDE 의 닫힌형 해를 줬다. 닫힌형은 (a) 시장 동학이 단순 (geometric Brownian), (b) 거래비용 0, (c) 위험측도 = 분산 → variance hedging — 이 세 조건이 만족될 때만 닫힌다. 한 조건만 바꿔도 PDE 풀이는 (i) 자유경계 (Davis-Norman 의 no-trade region 같은), (ii) 다차원 PDE 의 차원의 저주, (iii) viscosity solution 의 약풀이 — 처럼 어렵다. 신경망은 "PDE 의 형태를 알 필요 없이 simulator 와 손실만 있으면 학습" 으로 이 차원의 저주를 깬다.

### "policy 직접 학습 vs price 학습" 의 차이

Han-Jentzen-E (2017) Deep BSDE 는 PDE 의 **value function** $V(t, S)$ 를 학습한다 ($V$ 의 그래디언트로 $\delta$ 를 얻음). Deep Hedging 은 **policy $\delta$ 자체** 를 학습한다. 후자의 장점:
- (a) value function 이 정의되지 않는 setting (제약·penalty 가 정책공간 자체를 바꾸는 경우) 도 다룸.
- (b) value function 의 미분을 추가로 안 빼도 됨 — gradient 가 한 번만 흐름.
- (c) Risk measure 가 비선형 (예: CVaR) 인 경우 V 의 정의가 모호한데, policy 학습은 그냥 손실 표본평균 → SGD 로 직접 풂.

단점:
- Policy 학습은 value function 의 보간성·정규성 정보를 안 활용 — 학습 효율은 데이터 양에 더 민감.

### "convex risk measure 의 OCE 표현" 의 의미

임의의 monetary convex risk measure $\rho$ 는 다음 표현을 갖는다 (Föllmer-Schied 2002 의 dual representation 의 OCE 특수형):
$$
\rho(X) = \sup_{\mathbb{Q} \in \mathcal{Q}} \{ \mathbb{E}_\mathbb{Q}[-X] - \alpha(\mathbb{Q}) \}
$$
이 형태는 SGD 와 친하지 않다 (측도 $\mathbb{Q}$ 에 대한 sup 가 명시적). OCE 형식 $\rho(X) = -\sup_y \{\mathbb{E}_\mathbb{P}[u(X+y)] - y\}$ 는 sup 가 **스칼라 변수 $y$ 1개에 대한 것** 이고 기댓값은 simulator 측도 $\mathbb{P}$ 에서 평가. SGD 에 그대로 꽂힌다. 이 호환성이 본 논문의 "공학적 발견" 의 핵심.

## 각 블록의 1줄 요약 (이후 절들로의 다리)

- **05_b: 목적함수 (OCE / Entropy / CVaR)** — 어떤 위험 평가를 손실로 둘 것인가, 표본평균으로 어떻게 추정하는가.
- **05_c: action 함수의 함수근사** — 신경망이 어떻게 $\delta$ 를 표현하는가. 4종 recurrence.
- **05_d: ε-density 정리** — 학습 가능 정책공간이 최적해를 놓치지 않는다는 보장.
- **05_z: 구현 디테일** — Heston/BS world 의 디폴트, depth=3 width=20, Adam lr=1e-3, 100 epochs.

## 핵심 한 문장

> **"Deep Hedging 의 발상은 '시장 마찰을 다루는 헤지 = (시장 simulator) × (신경망 정책) × (OCE 손실) 의 합성' 이라는 분해 — 한 axis 만 바꿔도 학습 골격이 무너지지 않는 분리 가능성이 모든 후속 연구의 기반이 됐다."**
