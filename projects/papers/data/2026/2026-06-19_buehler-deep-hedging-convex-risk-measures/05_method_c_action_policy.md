# 4. 방법론 (C) — action function 의 함수근사

## 배경 사다리

이 절은 신경망이 "각 시점의 헤지 액션" 을 어떻게 표현하는지를 다룬다. ① **state vector** = 각 시점의 시장 정보 (가격·변동성·잔존시간 등) 의 묶음, ② **recurrent state** = 시점 간 정보를 옮기는 hidden 변수, ③ **gated update** = "얼마나 옛 정보를 보존하고 얼마나 새 정보로 갱신할지" 의 비율 — 이 셋만 알면 따라온다.

## Per-step 의사결정 구조

저자 `Network.md` verbatim:
> "State composition at time $t$ combines: feature state ($s_t$) from selected available features, previous action and aggregate position (making even 'non-recurrent' agents implicitly recurrent), optional hidden states for recurrence."

즉 시점 $t$ 에서 입력 = [현재 features, 이전 action, 누적 보유 포지션, hidden states] 의 concatenation. 이 묶음을 **augmented state** $\tilde{s}_t$ 라고 부르자.

행동:
$$
\delta_t = \pi_\theta(\tilde{s}_t)
$$

이때 $\pi_\theta$ 가 **L-layer MLP** 또는 **gated recurrent network**. 디폴트 (저자 GitHub README): depth=3, width=20, activation=ReLU. Network.md 예시: depth=5, width=20, activation=softplus.

### 수식 4줄 해석

- **기호 뜻**: $\delta_t$ = 시점 $t$ 의 헤지 도구별 보유량 변경 (단위 = 주식수, 옵션수). 차원 = 헤지 도구 개수. $\pi_\theta$ = 파라미터 $\theta$ 의 신경망 정책.
- **일상 비유**: 자율주행차의 "현재 카메라 + 속도계 + 지도 → 핸들 각도" 매핑과 동일 구조. 시점별 의사결정을 한 함수로 묶음.
- **왜 이 형태**: 정책공간을 명시적으로 함수 (state → action) 의 집합으로 두면 simulator-agnostic. 시장 모델을 바꿔도 $\pi_\theta$ 의 구조 그대로 유지.
- **조심할 점**: 입력에 path-dependent 정보 (이전 action, 누적 포지션) 가 들어가야만 거래비용을 보고 행동을 줄일 수 있다 — markov state $s_t$ 만으론 부족.

## 4종 recurrence (저자 Network.md verbatim)

저자는 4가지 hidden state 갱신 mechanism 을 제공:

### C-1) Classic states

$$
h_t = \tanh\big( F(s_t, h_{t-1}) \big), \quad h_t \in (-1, +1)
$$

표준 RNN. $F$ 는 단일 dense layer.

- **장점**: 표준적, debugging 쉬움.
- **단점**: 장기 의존성 학습 어려움 (vanishing gradient).

### C-2) Aggregate states (gated update)

$$
h_t = h_{t-1} \cdot (1 - z_t) + z_t \cdot F(s_t, h_{t-1}), \quad z_t \in [0,1]
$$

$z_t$ = update gate (GRU 의 reset gate 와 유사). $z_t$ 도 신경망으로 학습.

- **장점**: 거래 빈도가 낮은 영역에서 hidden 보존 — "no-trade region" 의 자연 표현.
- **단점**: gate 학습이 늦으면 결국 vanilla RNN 행세.

### C-3) Past representation states

$$
h_t = h_{t-1} \cdot (1 - z_t) + z_t \cdot F(s_t, h_{t-1}), \quad z_t \in \{0, 1\}
$$

$z_t$ 가 0/1 binary — "지금 갱신하느냐 마느냐" 의 hard decision. discrete 선택이라 reparam trick 또는 Gumbel-softmax 필요.

- **장점**: 결정점 (만기, 옵션 행사, 변동성 점프) 만 hidden 갱신 — 해석 가능.
- **단점**: 학습 불안정 — discrete gate 의 gradient 추정 noise.

### C-4) Event states

$$
h_t = h_{t-1} \cdot (1 - z_t) + z_t \cdot \mathbf{1}\big( F(s_t, h_{t-1}) \big)
$$

$F$ 의 출력이 어떤 임계를 넘으면 indicator 1. barrier event (예: knock-in/knock-out 옵션의 배리어 터치) 의 명시적 모델.

- **장점**: path-dependent payoff (Asian, barrier option) 자연 처리.
- **단점**: indicator 의 미분이 점근적 (sigmoid 근사) — gradient flow 손상 가능.

## Forward pass (Network.md verbatim)

저자:
> "First layer applies activation to: bias + weights × [features; tanh(classic_h); aggregate_h; repr_h; 𝟙(event_h)]"
> "Hidden layers (k=1 to d−1): y^{k+1} = α(b^k + W^k · y^k)"
> "Output layer produces: action vector plus state update functions F and gates z for each recurrence type"

즉 입력 = [현재 feature; classic hidden; aggregate hidden; past repr hidden; event indicator] 의 concatenation. 출력 = (action, 각 hidden 의 새 값, 각 gate 의 새 값) 묶음. 한 forward 호출이 (i) 행동, (ii) hidden 갱신, (iii) gate 결정 — 셋 다 한 번에 생성.

### 수식 4줄 해석

- **기호 뜻**: $W^k, b^k$ = 레이어 $k$ 의 가중치·바이어스. $\alpha$ = 활성함수 (ReLU / softplus). $y^k$ = 레이어 $k$ 의 hidden representation.
- **일상 비유**: 깊은 우물 (deep MLP) 에 두레박 (state) 을 내려 단계마다 두레박 안 내용물 (representation) 을 비선형 변환해 끌어올림.
- **왜 이 형태**: 표준 MLP — 보편근사 (universal approximation) 보장. 비선형 (ReLU/softplus) 없으면 affine 만 — 비선형 정책 표현 불가.
- **조심할 점**: depth 너무 크면 train 불안정 (gradient explode/vanish). 본 논문 디폴트 3~5 — 작은 편. CVaR 의 hinge 와 합쳐지면 더 깊을 필요 적음.

## 초기 조건

저자 Network.md verbatim:
> "Initial delta ($a^{init}$): Separate learnable parameter/network accounting for non-standard starting portfolio hedges"
> "Initial hidden states ($h_{-1}$): Can be constant variables or feature-dependent networks for non-trivial initial market conditions"

즉 $\delta_0, h_{-1}$ 자체도 학습 가능. 이미 시작 시 보유 포트폴리오가 있는 trader 의 setting 을 직접 표현.

## 정책공간의 형식적 정의

$$
\mathcal{H}_{NN} = \big\{ \delta_\theta : \theta \in \Theta \big\}
$$

여기서 $\Theta$ 는 모든 신경망 파라미터의 집합. 다음 절 (05_d) 에서 이 $\mathcal{H}_{NN}$ 이 임의의 측정가능 최적 정책 $\delta^* \in \mathcal{H}$ 에 ε-dense 임을 정리로 보임.

## 대안 비교

| 정책 표현 | 장점 | 단점 |
|---|---|---|
| **닫힌형 (BS-delta)** | 해석 가능, 학습 불필요 | 마찰 무시, 시장모델 종속 |
| **table lookup (격자 PDE)** | 정확 | 차원의 저주 |
| **선형 정책 $\delta = w^T s_t$** | 단순, 분석 가능 | non-linear payoff (barrier 등) 못 표현 |
| **MLP (본 논문)** | 표현력 충분, 학습 효율 | 해석 어려움, 시드 의존성 |
| **Recurrent (본 논문 옵션)** | path-dependent 자연 | gradient 흐름 관리 필요 |
| **Transformer policy** | 장기 의존성 + attention 해석 | 비용 폭증, 시계열 짧음 (본 논문 setting M=10~20) |

본 논문은 **MLP + 4종 recurrence** 으로 sweet spot. 향후 Transformer policy 는 후속 (Adversarial Deep Hedging 등) 에서 등장.

## 핵심 한 문장

> **"action policy 를 (현재 feature + 이전 행동 + 누적 보유 + hidden state) → (행동 + hidden 갱신 + gate) 의 한 신경망 호출로 묶고, 4종 recurrence 를 옵션으로 제공함으로써 BS-delta 부터 GRU-style 까지 한 코드 안에서 사다리화."**
