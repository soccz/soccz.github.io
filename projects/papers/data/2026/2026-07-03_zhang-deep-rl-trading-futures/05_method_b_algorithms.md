# 05b. 방법론 (B) — DQN · PG · A2C 3-알고리즘 해부

## 배경 사다리

이 절을 이해하려면 세 가지: ① **Q-function** $Q(s, a)$ = "상태 $s$ 에서 행동 $a$ 를 하고 이후 최적 정책을 따랐을 때 얻는 누적 보상의 기댓값". ② **정책 (policy)** $\pi(a | s)$ = 상태에서 행동을 확률적으로 선택하는 함수. ③ **Bellman equation**: $Q(s, a) = R + \gamma \max_{a'} Q(s', a')$ — 지금 값 = 즉시 보상 + 다음 상태의 최대 값. 이 3 개가 있으면 DQN·PG·A2C 를 모두 이해할 수 있다.

## 1. DQN (Deep Q-Network)

### 1.1 원리

**Off-policy value-based RL**. Q-function 을 신경망 $Q_\theta(s, a)$ 로 근사 → 각 시점에서 $\arg\max_a Q_\theta(s, a)$ 로 행동 선택.

### 1.2 학습 목표 (Loss)

$$\mathcal{L}_{\text{DQN}}(\theta) = \mathbb{E}_{(s,a,r,s') \sim \mathcal{D}} \left[ \bigl( r + \gamma \max_{a'} Q_{\bar\theta}(s', a') - Q_\theta(s, a) \bigr)^2 \right]$$

**4줄 해석**:
- **기호 뜻**: $\mathcal{D}$ = experience replay buffer (과거 경험 저장소), $\bar\theta$ = target network 파라미터 (주기적 복사), $\theta$ = 학습 대상 파라미터.
- **일상 비유**: "지금 (s, a) 에서 받은 값" vs "미래에 예상되는 최고값" 의 차이를 줄인다. TD (Temporal Difference) error 최소화.
- **왜 이 형태**: (i) off-policy → sample efficiency 유리 (과거 경험 재사용), (ii) target network 로 학습 안정성 확보, (iii) discrete action 자연 호환.
- **조심할 점**: (a) **replay buffer 크기** 미명세, (b) **target 업데이트 주기** 미명세, (c) fin ML domain 에서 non-stationarity 로 인해 stale replay 가 오히려 해로울 수 있음.

### 1.3 fin ML domain 에서의 장점

- **Sample efficiency**: 과거 시장 데이터 재사용 → 데이터 부족 문제 완화
- **Deterministic policy**: 학습 후 $\arg\max$ 로 확정 → 실무 배포 명확
- **Discrete action 자연**: {-1, 0, 1} 매핑 직접

### 1.4 fin ML domain 에서의 단점

- **과추정 편향 (overestimation bias)**: max 연산이 편향 유발 → Double DQN (van Hasselt 2016) 등 후속 개선 미채택 추정
- **Exploration 어려움**: $\epsilon$-greedy (확률 $\epsilon$ 로 random action) 사용 추정, exploration 스케줄 미명세
- **Non-stationarity**: 시장 국면 변화 시 stale Q-value → 재학습 필요

## 2. PG (Policy Gradient, e.g. REINFORCE)

### 2.1 원리

**On-policy policy-based RL**. 정책 $\pi_\theta(a | s)$ 자체를 신경망으로 파라미터화 → **정책 기울기 정리** (Sutton et al. 2000):

$$\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta} \left[ \sum_{t} \nabla_\theta \log \pi_\theta(a_t | s_t) \cdot G_t \right]$$

**4줄 해석**:
- **기호 뜻**: $G_t = \sum_{k=t}^T \gamma^{k-t} R_k$ = 시각 $t$ 부터 에피소드 종료까지의 할인된 return.
- **일상 비유**: "좋은 결과가 나온 행동은 다음번에 확률을 높이고, 나쁜 결과가 나온 행동은 확률을 낮춘다." — action likelihood 를 return 만큼 강화.
- **왜 이 형태**: policy 를 직접 학습 → discrete/continuous 모두 지원 (본 논문은 discrete 사용).
- **조심할 점**: (a) **분산 폭증** (return 이 큰 값이면 gradient 크기 폭발), (b) **on-policy** → 매 이터레이션 새 rollout 필요, sample 낭비.

### 2.2 fin ML domain 에서의 위치

- 3 알고리즘 중 **가장 단순** → baseline 역할
- On-policy 로 데이터 낭비 큼 → 최소 성능 (본 논문 3위 순위 예상)
- Variance reduction (baseline subtraction $G_t - b(s_t)$) 채택 여부 미확인

## 3. A2C (Advantage Actor-Critic)

### 3.1 원리

**On-policy actor-critic**. 두 신경망:
- **Actor** $\pi_\theta(a | s)$: 정책. Continuous action 을 Gaussian $\mathcal{N}(\mu_\theta(s), \sigma^2)$ 로 파라미터화 → 표준편차 $\sigma$ 도 학습 가능.
- **Critic** $V_\phi(s)$: 상태 가치. Bellman regression 으로 학습.

**Advantage function**:

$$A(s_t, a_t) = Q(s_t, a_t) - V(s_t) \approx R_{t+1} + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)$$

**4줄 해석**:
- **기호 뜻**: $A(s, a)$ = "이 상태에서 이 행동이 평균보다 얼마나 좋은가". Q - V = "행동의 상대적 우수도".
- **일상 비유**: "선생님 (critic) 이 옆에서 '이 정도 상태면 평균적으로 이 정도 수익이 나오는데, 니가 낸 행동은 그것보다 나았다/못했다' 를 실시간 판단." Actor 는 그 판단만큼 정책을 갱신.
- **왜 이 형태**: 순수 PG 의 분산 문제를 baseline (= $V_\phi(s)$) 로 감소, sample 효율 개선.
- **조심할 점**: (i) Actor 와 Critic 의 **학습률 밸런싱** 필수, (ii) Critic 이 부정확하면 Actor 도 잘못 학습, (iii) on-policy → sample 낭비 여전.

### 3.2 학습 목표

- **Actor loss**: $\mathcal{L}_{\text{actor}}(\theta) = - \mathbb{E} \left[ A(s_t, a_t) \cdot \log \pi_\theta(a_t | s_t) \right]$
- **Critic loss**: $\mathcal{L}_{\text{critic}}(\phi) = \mathbb{E} \left[ \bigl(R_{t+1} + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)\bigr)^2 \right]$

### 3.3 fin ML domain 에서의 장점

- **Continuous action** → 미묘한 포지션 조정 가능
- **Advantage** 로 분산 감소 → PG 대비 학습 안정
- **Entropy regularization** 도입 가능 (본 논문 채택 여부 미확인)

### 3.4 fin ML domain 에서의 단점

- **Hyperparameter 민감**: actor lr, critic lr, entropy weight, $\gamma$ 등
- **Cost 흡수 취약**: continuous action → 매일 미세 조정 → cost 누적 → Claim 2 의 실험 결과 배경
- **Multi-network 학습 부담**: sample 부족 시 critic 부정확

## 4. 3-알고리즘 비교표

| 축 | DQN | PG (REINFORCE) | A2C |
|---|---|---|---|
| 학습 스타일 | Value-based | Policy-based | Actor-Critic (혼합) |
| On/Off-policy | Off-policy | On-policy | On-policy |
| Action | Discrete | Discrete or Continuous | Continuous (본 논문) |
| Sample efficiency | 높음 (replay) | 낮음 | 중 |
| Variance | 낮음 (bootstrapping) | 매우 높음 | 중 (advantage 로 감소) |
| Fin ML 순위 (본 논문) | **1위** | 3위 (추정) | **2위** |
| Cost 저항성 | 높음 (discrete → low turnover) | 중 | 낮음 (continuous → high turnover) |
| 배포 명확성 | 높음 (argmax) | 중 | 중 (stochastic policy) |

## 5. 왜 이 3 개를 골랐나

2019 년 시점에서:
- **DQN** (Mnih et al. 2015 Nature) — 가장 유명한 discrete action RL 표준
- **PG** (Williams 1992, Sutton et al. 2000) — RL 이론의 근원 알고리즘, discrete/continuous 겸용
- **A2C** (Mnih et al. 2016) — actor-critic 계열 표준, continuous action 표준

**빠진 3-알고리즘 (본 논문 미포함)**:
- **PPO** (Schulman et al. 2017) — 2019 년 시점 이미 표준. **왜 미포함 인지 미확인**. 
- **DDPG** (Lillicrap et al. 2016) — deterministic policy for continuous, A2C 대체 후보
- **SAC** (Haarnoja et al. 2018) — max-entropy RL

이후 후속 fin ML 논문들 (FinRL, MacroHFT 등) 은 대부분 **PPO + A2C + DDPG** 조합으로 확장. 본 논문의 **DQN + PG + A2C** 조합은 2019 년 시점 최소 대표 3-종 선택으로 이해 가능.

## 이 부분의 핵심 한 문장

**"DQN (value-based, off-policy, discrete) · PG (policy-based, on-policy, discrete) · A2C (actor-critic, on-policy, continuous) 의 3-종 스윕으로 fin ML domain 에서 value vs policy 축, off vs on-policy 축, discrete vs continuous 축의 3-축 성능 격자를 측정, DQN 이 모든 축에서 우위임을 보고했다."**
