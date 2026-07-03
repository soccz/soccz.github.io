# 05d. 방법론 (D) — LSTM 백본 아키텍처와 구현 디테일

## 배경 사다리

이 절을 이해하려면 두 가지: ① **LSTM** (Long Short-Term Memory, Hochreiter·Schmidhuber 1997) = 순환신경망 (RNN) 의 대표 변형. 3 개 게이트 (forget/input/output) + cell state 로 장기 의존성을 학습. 시계열 표준. ② **Leaky-ReLU** = 활성화 함수. 표준 ReLU $\max(0, x)$ 에 음수 영역에도 작은 기울기 $\alpha x$ (예: $\alpha = 0.01$) 를 준 변형 — dying ReLU (죽은 뉴런) 문제 완화.

## 1. 백본 아키텍처

**WebSearch verbatim 확인**: 
> *"The authors use two-layer LSTM networks with 64 and 32 units in all models, and leaky rectifying linear units (Leaky-ReLU) are used as activation functions."*

**구조 (재구성)**:

```
Input: s_t ∈ R^{60 × d}  (past 60 obs × d features)
     ↓
LSTM Layer 1: 64 hidden units, Leaky-ReLU
     ↓
LSTM Layer 2: 32 hidden units, Leaky-ReLU
     ↓
Output head (algorithm-dependent):
  DQN: Linear(32 → 3) for Q(s, a) over {-1, 0, 1}
  PG:  Linear(32 → 3) + Softmax for π(a | s)
  A2C: Actor: Linear(32 → 1) for μ(s), σ shared
       Critic: Linear(32 → 1) for V(s)
```

**4줄 해석**:
- **기호 뜻**: 두 LSTM 층이 시퀀스를 처리. 첫 층은 raw feature → 64-dim latent, 둘째 층은 64-dim → 32-dim 압축. 마지막 시점 hidden state 를 output head 로 매핑.
- **일상 비유**: "60 일 기록을 두 층 관리자가 압축한다. 첫 관리자는 raw 데이터 → 64 개 요약 신호로 압축. 두 관리자는 64 → 32 개 최종 신호. 사장 (output head) 은 이 32 개 신호만 보고 결정."
- **왜 이 형태**: (i) 2-layer 는 표준 baseline (충분한 깊이, 과적합 위험 낮음), (ii) 64 → 32 tapered → capacity 감소로 정규화 효과, (iii) LSTM 은 daily 시계열 에서 여전히 강한 baseline (2019 년 시점 Transformer 로 대체 전).
- **조심할 점**: (a) Dropout 여부 미확인, (b) LayerNorm 여부 미확인, (c) hidden state init 방식 (zero init 표준) 확인 필요, (d) bidirectional LSTM 여부 (아마 unidirectional, 시퀀스 causality 유지).

## 2. Output Head 상세

### 2.1 DQN Head

$$Q_\theta(s_t, a) = W_Q h_t + b_Q, \quad a \in \{-1, 0, +1\}$$

여기서 $h_t \in \mathbb{R}^{32}$ 는 LSTM 2 층 마지막 시점 hidden state, $W_Q \in \mathbb{R}^{3 \times 32}$, $b_Q \in \mathbb{R}^3$.

Action 선택:
- **학습 시**: $\epsilon$-greedy — 확률 $\epsilon$ 로 random, $1-\epsilon$ 로 $\arg\max_a Q_\theta(s_t, a)$
- **평가 시**: $\arg\max$ 만

### 2.2 PG Head

$$\pi_\theta(a | s_t) = \text{Softmax}(W_\pi h_t + b_\pi), \quad a \in \{-1, 0, +1\}$$

Softmax 로 3-class 분포 → 학습 시 sampling, 평가 시 argmax (또는 확률적 유지).

### 2.3 A2C Head

**Actor** (continuous action):
$$\mu_\theta(s_t) = \tanh(W_\mu h_t + b_\mu) \in [-1, +1]$$
$$\sigma_\theta = \text{softplus}(W_\sigma h_t + b_\sigma) > 0$$
$$\pi_\theta(a | s_t) = \mathcal{N}(a; \mu_\theta(s_t), \sigma_\theta^2)$$

$\tanh$ 로 action bound [-1, 1] 강제, softplus 로 $\sigma > 0$ 보장. 정확한 형태 (state-dependent σ vs global σ 등) 미확인.

**Critic**:
$$V_\phi(s_t) = W_V h_t^{\text{critic}} + b_V$$

Actor 와 Critic 이 LSTM backbone 을 공유하는지, 별도 backbone 인지 미확인 (통상 공유가 표준).

## 3. Hyperparameter (알려진 것 + 미확인)

| 항목 | 값 (알려짐) | 상태 |
|---|---|---|
| LSTM layer 수 | 2 | 확인 |
| LSTM hidden units | 64 → 32 | 확인 |
| 활성화 | Leaky-ReLU | 확인 |
| Lookback window | 60 (거래일) | 확인 |
| Features | MACD, RSI (+ 추가?) | 확인 (일부) |
| σ_tgt | 미확인 (통상 10-15%) | **미확인** |
| σ EWMA λ | 미확인 (통상 0.94) | **미확인** |
| Optimizer | 미확인 (통상 Adam) | **미확인** |
| Learning rate | 미확인 | **미확인** |
| Batch size | 미확인 | **미확인** |
| Discount γ | 미확인 (통상 0.99 or 1.0) | **미확인** |
| $\epsilon$-greedy schedule | 미확인 | **미확인** |
| Replay buffer size | 미확인 | **미확인** |
| Target network update freq | 미확인 | **미확인** |
| Training episodes/steps | 미확인 | **미확인** |
| Random seeds | 미확인 | **미확인** |
| Weight init | 미확인 | **미확인** |

**본문 PDF 차단**으로 정확한 hyperparameter table 확인 불가. 이 부분은 07_limits.md 재현성 항목에서 별도 반박점 처리.

## 4. 학습 파이프라인 (추정 순서)

1. **데이터 준비**: 50 개 futures, 2011-2019 daily 종가, feature (MACD+RSI) 계산
2. **Train/Val/Test split**: 통상 시간 순서 splits (예: 2011-2016 train, 2017 val, 2018-2019 test) — 정확 split 미확인
3. **σ_{t-1} 사전 계산**: 60-day EWMA std
4. **Environment 구성**: 각 asset 별 독립 environment (혹은 batched multi-asset), reward 함수 = vol-scaled return - cost
5. **Agent 초기화**: LSTM 랜덤 init
6. **학습**: 에피소드 반복, replay buffer 축적 (DQN) 또는 on-policy rollout (PG/A2C), gradient step
7. **평가**: test period 백테스트, Sharpe/Sortino/return/drawdown 계산

## 5. 대안으로 했다면

- **Transformer backbone**: 2019 년 arXiv 시점 이미 시장에 있었으나 daily 시계열에서 LSTM 대비 명확 우세 미실증. **Momentum Transformer** (arXiv:2112.08534, 같은 저자팀 후속) 로 나중에 attention 도입 → LSTM → Transformer 자연 진화.
- **CNN backbone**: DeepLOB (2018, 같은 저자팀 이전작) 의 CNN + Inception 조합. Micro-level LOB 에는 CNN 우세, macro daily 에는 LSTM 자연.
- **TCN (Temporal Convolutional Network)**: parallelizable, long-range. 2018-19 시점 대안이나 본 논문 미채택.
- **N-BEATS / Neural ODE**: 2019-2020 등장, 본 논문 대상 시점 이후 성숙 → cross-reference 불가.

## 이 부분의 핵심 한 문장

**"2-layer LSTM (64→32 units) + Leaky-ReLU 의 conservatively simple 백본 위에 알고리즘별 output head (DQN 3-class Q / PG 3-class softmax / A2C μ+σ+V) 를 얹은 표준 아키텍처 — 2019 년 fin ML 표준 시대의 LSTM+RL 조합의 대표 사례."**
