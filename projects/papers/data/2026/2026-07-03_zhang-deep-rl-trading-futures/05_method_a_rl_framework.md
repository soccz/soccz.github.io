# 05a. 방법론 (A) — 강화학습 정식화 (State · Action · Reward)

## 배경 사다리

이 절을 이해하려면 세 가지만: ① **MDP** (Markov Decision Process) = "상태 → 행동 → 보상 → 다음 상태" 4-tuple 로 순차적 결정 문제를 모델링하는 도구. ② **강화학습** (RL) = MDP 에서 **누적 보상의 기댓값** (= state-value function 또는 action-value function) 을 최대화하는 정책을 시행착오로 학습하는 프레임워크. ③ **정책** (policy) $\pi(a|s)$ = 상태 $s$ 에서 행동 $a$ 를 선택할 확률 (혹은 결정론적일 때 $a = \pi(s)$).

## 1. 왜 강화학습인가

**Supervised learning (지도학습) 의 한계**:
- 타깃 = "미래 수익률 $y_{t+1}$", 손실 = MSE $\|y_{t+1} - \hat{y}(s_t)\|^2$
- 학습 목적 (MSE 최소화) 과 실제 트레이딩 목적 (Sharpe 최대화) 사이 gap
- 거래비용 · 포지션 제약 · 리스크 관리 규칙을 손실에 못 넣음

**강화학습의 대안**:
- 타깃 없음. **환경과 상호작용** 하며 얻는 실제 보상 (= 트레이딩 손익) 을 극대화
- 손실 = "negative reward + regularization" — Sharpe/Sortino 를 목적 함수로 직접 최적화 가능
- 거래비용을 reward 에 명시적으로 포함 가능

이 발상은 **Moody·Wu 1997** (Direct RL for Trading Portfolios) 에 이미 있었으나 shallow network 시대라 확장성 부족. 본 논문은 **modern deep RL (DQN 2015, PG 2000, A2C 2016)** 3-종을 fin ML domain 에 이식.

## 2. 상태 (State) 공간의 설계

### 2.1 어떤 특징 (feature) 을 넣을 것인가

원 데이터는 **일별 종가 시계열** (daily close price). 이를 모델이 볼 수 있는 형태로 변환:

- **원시 수익률** $r_t = \log(P_t / P_{t-1})$ — 로그수익률 (multiplicative 특성을 additive 로 변환하는 표준 처리)
- **MACD (Moving Average Convergence Divergence)** — 두 지수평균 (예: 12일 EMA, 26일 EMA) 의 차이. **추세 강도** 지표.
- **RSI (Relative Strength Index)** — 최근 N 일 (통상 14일) 상승분 vs 하락분 비율. **과매수/과매도** 지표.

**WebSearch verbatim 확인 내용**: 
> *"The paper uses MACD and RSI to represent states, and at a given time step, takes the past 60 observations of each feature to form a single state."*

### 2.2 왜 이 특징들인가

- 두 지표 모두 **테크니컬 아날리시스 표준** — 실무 트레이더가 실제로 보는 신호
- MACD 는 **트렌드 팔로잉 성분** (TSMOM 계보), RSI 는 **역행 (mean-reversion) 성분**
- 두 성분을 함께 넣어 정책이 국면에 따라 자동 전환 가능하도록 유도

### 2.3 State 구성 수식

$$s_t = \bigl[ \phi_{t-59}, \phi_{t-58}, \ldots, \phi_t \bigr] \in \mathbb{R}^{60 \times d}$$

**4줄 해석**:
- **기호 뜻**: $\phi_\tau$ = 시각 $\tau$ 에서 계산한 특징 벡터 (MACD + RSI + 추가 정규화 요소들), $d$ = 특징 차원. $s_t$ 는 지난 60 시점 (≈ 3 개월 거래일) 을 담은 시계열 행렬.
- **일상 비유**: 매일 아침 회의 시 "지난 3 개월 이 상품이 어떻게 움직였는지 요약표" 를 로봇에게 준다. 로봇은 이 표만 보고 오늘 포지션 결정.
- **왜 이 형태**: (i) 60 = 약 3 개월 거래일 (실무 rule-of-thumb 로 short-term momentum 감지 최적 창), (ii) 시계열 그대로 넣어 LSTM 이 시간 순서 처리하게 함 (평균/최대 등 요약 대신 raw 시퀀스).
- **조심할 점**: (a) 60-window 는 하이퍼파라미터, 다른 값 실험 여부 미확인. (b) 특징 정규화 방법 (z-score, min-max 등) 명세 미확인. (c) 미래 정보 누출 방지 위해 $\phi_\tau$ 계산에 $\tau$ 시점 이하 정보만 사용해야 함 (look-ahead 방지).

## 3. 행동 (Action) 공간

### 3.1 Discrete action (DQN, PG 용)

$$a_t \in \mathcal{A}_d = \{-1, 0, +1\}$$

**4줄 해석**:
- **기호 뜻**: -1 = 최대 공매도, 0 = 무포지션, +1 = 최대 매수. **직접 타깃 포지션** 을 지정하는 방식.
- **일상 비유**: "빨간 버튼 (팔아) · 회색 버튼 (가만) · 초록 버튼 (사) 3 개 중 하나만 매일 누른다."
- **왜 이 형태**: (i) DQN 은 원리적으로 discrete action 만 지원 (Q-function 을 action 별 lookup 으로 정의), (ii) 3-옵션 은 실무 rule-based 전략과 자연 호환 (TSMOM 도 +1/-1), (iii) discrete → low turnover → cost 저항성.
- **조심할 점**: 정보 손실 큼. 예를 들어 "이번엔 확신이 낮으니 half position" 같은 미묘한 조정 불가. 이 손실이 continuous action 대비 여전히 우세한 이유는 Claim 2 참조.

### 3.2 Continuous action (A2C 용)

$$a_t \in \mathcal{A}_c = [-1, +1] \subset \mathbb{R}$$

**4줄 해석**:
- **기호 뜻**: 포지션 크기를 실수로 지정. -1 = 최대 공매, 0 = 무포지션, +1 = 최대 매수, 그 사이는 부분 포지션.
- **일상 비유**: "볼륨 조절 다이얼처럼 -100 % 부터 +100 % 까지 원하는 만큼 정할 수 있다."
- **왜 이 형태**: A2C 는 stochastic policy 를 Gaussian 분포로 파라미터화 (평균 $\mu_\theta(s)$, 표준편차 $\sigma$) 하여 continuous action 지원. **정보 활용 최대화** 목적.
- **조심할 점**: (i) 학습 분산 큼, (ii) hyperparameter 민감, (iii) small |a| 미세 조정 → cost 누적 → 실제 실험서 열위 (Claim 2).

## 4. 보상 (Reward) 함수 (개괄)

$$R_t = \text{utility}(\text{return}_t) - \text{cost}(\text{turnover}_t)$$

두 성분:
- **Return 성분**: 포지션 × 실현 수익률 (아래 05c 에서 volatility scaling 상세)
- **Cost 성분**: 포지션 변화량 × 거래비용 계수

**총 목적 함수**:
$$J(\theta) = \mathbb{E}_{\pi_\theta} \left[ \sum_{t=1}^{T} \gamma^{t-1} R_t \right]$$

여기서 $\gamma \in (0, 1]$ = 할인 계수 (통상 $\gamma \to 1$ for episodic finance 문제, 정확 값 미확인).

**4줄 해석**:
- **기호 뜻**: $J(\theta)$ = 정책 파라미터 $\theta$ 하의 누적 보상 기댓값. $\pi_\theta$ = 학습 중인 정책. $T$ = 에피소드 길이 (통상 1 년 거래일 = 252, 정확 값 미확인).
- **일상 비유**: "1 년 동안 매일 결정한 결과의 총합. 미래 보상은 약간 할인 (오늘 100원 = 내일 99원 가치)."
- **왜 이 형태**: RL 표준 objective. Bellman 방정식 성립을 위한 discount 필요 (episodic 이면 $\gamma = 1$ 가능).
- **조심할 점**: (i) $\gamma$ 정확 값 논문 확인 필요, (ii) episodic vs continuing formulation 구분 미확인, (iii) 트레이딩은 실제로 continuing 문제 (마지막 시점이 정해지지 않음) — 저자들이 어떻게 처리했는지 미확인.

## 5. 대안으로 했다면

- **Predict-then-optimize (전통 파이프라인)**: $\hat{y}_{t+1} = f_\theta(s_t)$ 로 예측 → $a_t = \text{sign}(\hat{y}_{t+1})$ 로 규칙 매핑. **본 논문이 극복하려는 대상**. Gap: 학습 목적 ≠ 실제 목적.
- **Model-based RL**: 시장 dynamics $P(s_{t+1} | s_t, a_t)$ 를 학습 후 planning. Fin ML 에서 environment 학습이 어려움 (non-stationary, adversarial) → 본 논문은 **model-free** 선택.
- **Distributional RL** (C51, QR-DQN): reward 분포 자체를 학습 → tail risk 반영 자연. 2019 년 시점에 도입 가능성 있었으나 본 논문 미채택.

## 이 부분의 핵심 한 문장

**"과거 60 일 MACD+RSI 특징 시퀀스를 상태로, {-1,0,1} (혹은 [-1,1]) 을 행동으로, volatility-scaled 수익률을 보상으로 잡은 표준 MDP 정식화를 fin ML domain 에 정착시켰다."**
