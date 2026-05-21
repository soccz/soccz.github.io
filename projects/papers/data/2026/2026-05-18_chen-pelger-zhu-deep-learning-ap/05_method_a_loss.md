# 05a. Section II.A — Loss Function & Model Architecture

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 핵심 — **no-arbitrage 를 신경망 loss 로 변환**
- Eq 의 loss function 정의 + 정확한 의미
- 다른 ML paper 와의 결정적 차이 (이론 제약을 architecture 가 강제)

---

> Section II.A (paper p.12–14) — 신경망 학습의 loss function 과 전체 아키텍처.

## 5a.1 챕터 한 줄 요약

Eq (4) — sample 손실 함수. **무한 stock unbalanced panel** 의 SR-weighted squared moment deviation. 두 네트워크 (SDF $\omega$ + conditional $\hat g$) 가 함께 학습.

---

## 5a.2 Empirical Loss Function — Eq (4)

paper Eq (4):

$$
L(\omega \mid \hat g, I_t, I_{t,i}) = \frac{1}{N} \sum_{i=1}^{N} \frac{T_i}{T} \left| \frac{1}{T_i} \sum_{t \in T_i} M_{t+1} R^e_{t+1,i}\, \hat g(I_t, I_{t,i}) \right|^2 \tag{4}
$$

### 🔣 4-단 기호 풀이 (Eq 4, 학습 loss)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $L$ | empirical loss | "전체 학생 평균 오답 점수" | 학습 objective (낮을수록 좋음) |
| $N$ | 자산 수 | "학생 수 (≈ 10,000)" | unbalanced panel |
| $T_i$ | 자산 i 관측 시점 수 | "i 학생의 응시 횟수" | 자산마다 다름 (IPO 신규 등) |
| $T_i / T$ | weighting | "오래 관측된 학생 weight ↑" | $\sqrt{T_i / T}$ 의 standard GLS |
| $M_{t+1}$ | SDF | "공정한 채점자" | $1 - \omega \cdot R^e$ |
| $R^e_{t+1,i}$ | 자산 i 의 t+1 excess return | "i 학생의 t+1 시점 점수" | risk-free 초과 |
| $\hat g(I_t, I_{t,i})$ | test asset weight | "i 자산의 시험 문제 가중치" | adversary network 의 출력 |

**🌱 한 줄**: "**N 자산 × T_i 시점 의 squared pricing error 의 weighted 평균** — weighting 은 관측 시점 비율".

**기호 뜻**:
- $N$ — 총 자산 수 (≈ 10,000).
- $T_i$ — 자산 $i$ 가 관측된 시점 수 (자산마다 다름).
- $T$ — 전체 시점 수.
- $T_i / T$ — 자산 $i$ 의 weight. 짧게 관측된 자산은 noisy 하므로 down-weight.

paper p.13 본문:
> "We deal with an unbalanced panel in which the number of time series observations $T_i$ varies for each asset. As the convergence rates of the moments under suitable conditions is $1/\sqrt{T_i}$, we weight each cross-sectional moment condition by $\sqrt{T_i}/\sqrt{T}$, which assigns a higher weight to moments that are estimated more precisely and down-weights the moments of assets that are observed only for a short time period."

→ **GLS-type weighting** for unbalanced panel.

---

## 5a.3 두 네트워크의 역할

paper p.13:
$$
\hat\omega = \min_\omega L(\omega \mid \hat g, I_t, I_{t,i}) \quad \text{(SDF network)}
$$

$$
\hat g = \arg\max_g L(\omega \mid g, I_t, I_{t,i}) \quad \text{(Conditional / adversary network)}
$$

→ 두 네트워크 모두 같은 loss 의 다른 쪽을 최적화 (minimax).

paper 본문:
> "The SDF network has two parts: (1) A LSTM estimates a small number of macroeconomic states. (2) These states together with the firm-characteristics are used in a FFN to construct a candidate SDF for a given set of test assets. The conditioning network also has two networks: (1) It creates its own set of macroeconomic states, (2) which it combines with the firm-characteristics in a FFN to find mispriced test assets for a given SDF M."

→ **각 네트워크 = LSTM (macro) + FFN (full conditioning)**.

---

## 5a.4 Figure 1 — GAN Model Architecture

![Fig. 1 — GAN Model Architecture](figures/page13_GAN_architecture.png)

*paper p.13 Fig. 1 — 본 논문의 핵심 그림. 좌측 SDF network, 우측 Conditional network. 각각 LSTM (macro → hidden state) + FFN (chars + hidden state → output). 두 네트워크가 minimax 로 경쟁.*

### 📖 처음 보는 사람을 위한 — Fig. 1 (본 논문 심장) 읽는 법

**한 줄로**: "**두 신경망이 minimax 게임** — 좌측 SDF 가 pricing error 최소화, 우측 Conditional 이 mispriced asset 최대화. 둘이 수렴 = 최선의 SDF".

**그림 구조 — 좌·우 두 큰 박스**:

| 위치 | 무엇 | 일상 비유 |
|------|------|-----------|
| **좌측 — SDF Network** | M 만드는 신경망 | "정답지 만드는 학생" |
| **├ LSTM** | 178 macro 시계열 → 4 hidden state | "경제 환경 (호황/불황) 자동 파악" |
| **├ FFN** | (firm chars + hidden) → ω | "회사 신상 + 경제 환경 → 자산 가중치" |
| **└ 출력 M** | candidate SDF | "이번 시점의 정답지" |
| **우측 — Conditional Network** | g 만드는 adversarial 신경망 | "최악 시험 문제 만드는 출제자" |
| **├ LSTM** | 자체 macro → hidden state (h^g) | "출제자의 경제 분석" |
| **├ FFN** | (chars + h^g) → g | "최악 mispricing 자산 자동 발견" |
| **└ 출력 g** | mispriced test asset | "이 자산이 가장 안 맞춰지지!" |

**왜 두 네트워크 minimax?**
- SDF 혼자: 자기가 만든 test asset 으로만 검증 → 편향.
- Conditional adversarial: SDF 가 못 푸는 worst-case 자동 생성 → SDF 가 더 강해질 수밖에.
- 수렴 = 둘 다 못 개선 = best SDF + most challenging test 발견.

**그림에서 알아낼 것 3가지**:
1. **두 네트워크의 대칭성** — 같은 (LSTM + FFN) 구조지만 다른 역할.
2. **LSTM 의 중요성** — 둘 다 macro hidden state 사용 → business cycle 학습.
3. **두 LSTM 이 별도** ($h_t$ vs $h_t^g$) — 같은 macro 데이터라도 다른 hidden state 학습.

**원문 위치**: paper Fig. 1, journal p.13.

---

paper Fig. 1 note:
> "This figures shows the model architecture of GAN (Generative Adversarial Network) with RNN (Recurrent Neural Network) with LSTM cells. The SDF network has two parts: (1) A LSTM estimates a small number of macroeconomic states. (2) These states together with the firm-characteristics are used in a FFN to construct a candidate SDF for a given set of test assets. The conditioning network also has two networks: (1) It creates its own set of macroeconomic states, (2) which it combines with the firm-characteristics in a FFN to find mispriced test assets for a given SDF M. These two networks compete until convergence, that is neither the SDF nor the test assets can be improved."

---

## 5a.5 본 논문 model 의 4가지 element

paper Section II.A 의 architecture 요약:

### Element 1: FFN (Section II.B)
- 4가지 활용: ω, g, μ (FFN benchmark), β.
- ReLU activation.

### Element 2: LSTM (Section II.C)
- macro 시계열 → hidden state.
- SDF network 와 Conditional network 가 **별도 LSTM** 사용 ($h_t$ vs $h^g_t$).

### Element 3: GAN (Section II.D)
- minimax 게임.
- 3-step training.

### Element 4: Ensemble & Hyperparameters (Section II.E)
- 9 ensemble.
- Dropout regularization.

각 element 는 챕터 05b–05d 에서 상세.

---

## 5a.6 Forecasting Benchmark (FFN, GKX 2020)

paper p.13–14:
$$
\hat\mu = \min_\mu \frac{1}{T}\sum_t \frac{1}{N_t} \sum_{i=1}^{N_t} \left( R^e_{t+1,i} - \mu(I_t, I_{t,i}) \right)^2
$$

→ **Gu, Kelly, Xiu (2020)** 의 best FFN model 과 동일.

paper 본문:
> "We only include the best performing feedforward network from Gu, Kelly, and Xiu (2020)'s comparison study. Within their framework this model outperforms tree learning approaches and other linear and non-linear prediction models. ... the simple forecasting approach does not include an adversarial network or LSTM to condense the macroeconomic dynamics."

→ FFN benchmark = **LSTM 없음 + adversarial 없음 + no-arbitrage 없음**. 순수 prediction.

---

## 5a.7 정리

```
[ GAN 모델 (본 논문) ]                  [ FFN 모델 (GKX 2020) ]
                                                       
  macro I_t      chars I_{t,i}            macro I_t (raw)
       │              │                        │      \
       ▼              │                        │       \
     LSTM             │                        │        \
   (4 states)         │                        ▼         ▼
       │              │                       FFN
       └─── concat ───┘                     (chars + macro)
              │                                  │
              ▼                                  ▼
             FFN                              μ̂ (mean prediction)
        (SDF weights ω)                          │
              │                                  ▼
              ▼                          → β̂ = μ̂ (proportional)
         SDF M_{t+1}
              │
              ↓ ↑
        Conditional network (adversary)
              │
              ▼
        Test assets g
              ↓
        ┌─────────────────────────┐
        │ Loss = (1/N) Σ |E[M·R·g]|² │
        └─────────────────────────┘
              │
        Minimax: min_ω max_g
```

---

## 5a.8 Figure 1 의 자세한 해석 — GAN Architecture (paper p.13)

![Fig. 1 — GAN Model Architecture](figures/page13_GAN_architecture.png)

(Figure 1, paper p.13)

본 paper 의 **시각적 핵심 그림**. ProTran 의 Figure 1 처럼 step-by-step 으로 자세히.

### Step 1 — 그림의 전체 구조

paper Fig 1 의 전체 layout (위→아래, 좌→우):

```
   ┌──────────────────────────────────────────────────────────┐
   │  SDF Network (위)                                          │
   │  ┌─────────────────────────────────────────────────┐      │
   │  │   State RNN  →  h_t  →  Feed Forward  →  ŵ(h_t, I_{t,i}) │
   │  │   (initial)                Network                       │
   │  └────────────────────┬──────────┬─────────────────┘      │
   │  (Update params to minimize loss)                          │
   └──────────────────┬────┴──────────┴────────────────────────┘
                      │              │
                      │  I_1,...,I_t │  I_{t,i}
                      │              │              
                      ▼              ▼              ▼
                ┌──────────────────────────┐  ┌────────────┐
                │ Construct SDF M_{t+1}    │  │ Loss       │
                └─────────────┬────────────┘  │ Calculation│
                              │               │      │     │
                              └──────────────►│      │     │
                                              │      ▼     │
   ┌──────────────────────────────────────────│  L   │     │
   │  Conditional Network (아래)               │      │     │
   │  ┌─────────────────────────────────────┐ │      │     │
   │  │  Moment RNN  →  h^g_t  → Feed Fwd  →│ │      │     │
   │  │                            ĝ(h^g_t, │ │      │     │
   │  │                            I_{t,i}) │ │      │     │
   │  └────────────────────┬────────┬───────┘ │      │     │
   │  (Update params to maximize loss)        │      │     │
   └──────────────────┬────┴────────┴─────────│      │     │
                      │            │          │      │     │
                      │  I_1,...,I_t  I_{t,i} │ R^e_{t+1} │
                                              └──────┬────┘
                                                     │
                                                     ▼
                                          ┌──────────────────┐
                                          │ Iterative        │
                                          │ Optimizer with   │
                                          │ GAN              │
                                          └──────────────────┘
```

### Step 2 — 좌우 두 network 의 대칭 구조

| 측면 | SDF Network (상단, **녹색 점선 박스**) | Conditional Network (하단, **빨간 점선 박스**) |
|------|---------------------------------|----------------------------------------|
| 목적 | $\omega$ (portfolio weights) 학습 | $g$ (test asset) 학습 |
| Macro 입력 | $I_1, \ldots, I_t$ (전체 history) | $I_1, \ldots, I_t$ (같은 history) |
| Firm 입력 | $I_{t,i}$ (46 chars at time $t$) | $I_{t,i}$ (같은 chars) |
| LSTM 이름 | **"State RNN"** | **"Moment RNN"** |
| Hidden state | $h_t$ (4-dim) | $h^g_t$ (4-dim) |
| FFN 출력 | $\hat{\omega}(h_t, I_{t,i})$ | $\hat{g}(h^g_t, I_{t,i})$ |
| Update 방향 | "minimize loss" | "maximize loss" |
| Box 색 | **녹색 (green)** | **빨간 (red)** |

→ paper Fig 1 의 두 색 box 가 두 network 의 다른 objective 강조.

### Step 3 — 가운데 "Construct SDF" 와 "Loss Calculation"

**Center node 1: Construct SDF $M_{t+1}$**:
- 입력: $\hat{\omega}$ (SDF network 출력) + $R^e_{t+1}$ (excess returns).
- 출력: $M_{t+1} = 1 - \hat{\omega}^\top R^e_{t+1}$.
- → SDF 공식 (Eq).

**Center node 2: Loss Calculation**:
- 입력 3개: $M_{t+1}$, $\hat{g}$, $R^e_{t+1}$.
- 출력: $L = \frac{1}{N}\sum_i |\frac{1}{T_i}\sum_t M_{t+1} R^e_{t+1,i} \hat{g}_i|^2$ (Eq 4).
- → squared pricing error.

### Step 4 — "Iterative Optimizer with GAN"

오른쪽 끝의 node:
- 입력: $L$ (loss).
- 작동: 3-step training (Section II.D).
  - Step 1: SDF minimize $L$ with $g=1$.
  - Step 2: Conditional maximize $L$ with $\omega$ fixed.
  - Step 3: SDF minimize $L$ with $g$ fixed.
- 출력: optimal $\hat{\omega}, \hat{g}, \hat{h}_t, \hat{h}^g_t$.

### Step 5 — 화살표 의 정확한 의미

화살표 (→) = data/gradient flow:

| 화살표 | 의미 |
|--------|------|
| $I_1, \ldots, I_t \to$ State RNN | Macro history 가 LSTM 입력 |
| State RNN $\to h_t$ | LSTM 의 hidden state 출력 (마지막 시점) |
| $h_t + I_{t,i} \to$ Feed Forward Network | LSTM state + char 가 FFN 입력 |
| FFN $\to \hat{\omega}$ | SDF weights 출력 |
| $\hat{\omega} + R^e \to M_{t+1}$ | SDF 계산 |
| $M + \hat{g} + R^e \to L$ | Loss 계산 |
| $L \to$ Iterative Optimizer | Gradient backprop |
| Optimizer $\to$ SDF/Cond params | weights update |

→ 화살표가 정확한 dataflow + backprop 의 정신.

### Step 6 — Figure 1 의 caption 문장별 풀이

paper Fig 1 caption:
> "This figures shows the model architecture of GAN (Generative Adversarial Network) with RNN (Recurrent Neural Network) with LSTM cells. The SDF network has two parts: (1) A LSTM estimates a small number of macroeconomic states. (2) These states together with the firm-characteristics are used in a FFN to construct a candidate SDF for a given set of test assets. The conditioning network also has two networks: (1) It creates its own set of macroeconomic states, (2) which it combines with the firm-characteristics in a FFN to find mispriced test assets for a given SDF M. These two networks compete until convergence, that is neither the SDF nor the test assets can be improved."

**문장별 풀이**:

**문장 1**: "GAN with RNN with LSTM cells".
- GAN paradigm + RNN type + LSTM 구체 cell.
- 본 paper 의 모든 NN component 한 줄 요약.

**문장 2-3**: "SDF network has two parts: (1) LSTM (2) FFN".
- SDF network = LSTM (macro processing) + FFN (chars + macro hidden → weight).
- 두 sub-component 의 division.

**문장 4-5**: "Conditional network also has two networks: (1) own LSTM (2) FFN to find mispriced".
- Conditional 도 같은 구조 — separate LSTM + FFN.
- 목표: mispriced test asset 발견.

**문장 6**: "Two networks compete until convergence".
- Minimax 의 본질.
- Convergence = neither can improve (Nash equilibrium).

### Step 7 — Figure 1 이 paper 의 시각적 signature 인 이유

**한 그림으로 압축된 5 메시지**:
1. **두 NN 의 minimax** (좌우 대칭).
2. **각 NN 의 내부** (LSTM + FFN).
3. **다른 LSTM** (State RNN vs Moment RNN).
4. **공통 입력** (macro + chars).
5. **공동 loss** (SDF + g + R^e → L).

→ paper 의 12 페이지 Section II 가 이 그림 한 장에 압축. 다른 챕터들이 이 그림의 한 부분씩 자세히 설명.

| 챕터 | Fig 1 의 어느 부분 |
|------|--------------------|
| 04 | 전체 framework (Section I.A-B) |
| 05a (이 챕터) | Architecture overview + loss |
| 05b | FFN 부분 (양 network 의 FFN) |
| 05c | LSTM 부분 (State RNN, Moment RNN) |
| 05d | GAN 학습 절차 (Iterative Optimizer) |

| 측면 | SDF Network (좌) | Conditional Network (우) |
|------|---------------|------------------------|
| 목적 | $\omega$ (portfolio weights) 학습 | $g$ (test asset) 학습 |
| Macro 입력 | $I_t$ (178 macro vars) | $I_t$ (같은 macro) |
| Firm 입력 | $I_{t,i}$ (46 chars) | $I_{t,i}$ (같은 chars) |
| LSTM | 별도 LSTM (4 hidden states $h_t$) | **별도 LSTM** (4 hidden states $h^g_t$) |
| FFN | 별도 FFN | 별도 FFN |
| 출력 | $\omega(I_t, I_{t,i})$ | $g(I_t, I_{t,i})$ |
| 학습 | $\min$ pricing error | $\max$ pricing error |

### Step 2 — 정보 흐름

```
   Macroeconomic I_t (178 vars)
        │
        ├──> SDF LSTM ──> hidden h_t (4-dim)
        │
        └──> Cond. LSTM ──> hidden h^g_t (4-dim)
   
   Firm chars I_{t,i} (46 chars)
        │
        ├──> SDF FFN (h_t + I_{t,i}) ──> ω
        │
        └──> Cond. FFN (h^g_t + I_{t,i}) ──> g
   
   ω × R^e ──> M = 1 - ω·R^e (SDF)
   M × R^e × g ──> Pricing error: |E[M R^e g]|²
                            │
                            ├──> SDF: minimize
                            └──> Cond: maximize
```

### Step 3 — 왜 두 network 가 별도 LSTM 인가

**SDF network 의 LSTM**:
- "SDF 결정에 중요한 macro state" 학습.
- → 가격결정 dynamics 잡음.

**Conditional network 의 LSTM**:
- "Mispriced asset 식별에 중요한 macro state" 학습.
- → 시간에 따른 mispricing pattern 잡음.

**다른 정보 필요**:
- SDF: "현재 risk premium 이 어떤가"
- Conditional: "어느 자산이 가격결정 안 됐나"
- → 두 task 가 다른 macro state 필요 → 별도 LSTM.

### Step 4 — Network sizes (paper Appendix)

paper Appendix 의 hyperparameter:

| Component | Architecture |
|-----------|------------|
| LSTM (each) | 1 layer × 4 hidden units |
| FFN (SDF) | 2 hidden layers, ReLU |
| FFN (Conditional) | 2 hidden layers, ReLU |
| Dropout | 0.1-0.5 (cross-validated) |
| Ensemble | 9 models |

### Step 5 — 학습 과정 (3-step)

paper p.14:
1. **Step 1**: $g = $ constant (=1) → SDF network 학습 (unconditional).
2. **Step 2**: $\omega$ fixed → Conditional network $g$ 학습 (find mispriced).
3. **Step 3**: $g$ fixed (new) → SDF network $\omega$ 재학습.

→ Steps 2-3 반복 until convergence.

비유 (경기):
- Step 1: 선수 (SDF) 가 기본 실력 학습.
- Step 2: 상대 (Conditional) 가 선수의 약점 분석.
- Step 3: 선수가 약점 보완.
- 반복.

---

## 5a.9 자기점검 (이 챕터)

### 핵심 5가지
1. **Eq (4) 의 $T_i/T$ weight 가 의미하는 것?**
2. **SDF network 와 Conditional network 의 차이?**
3. **FFN benchmark 가 GAN 보다 단순한 이유 3가지?**
4. **왜 SDF 와 Conditional 이 별도 LSTM 가지는가?**
5. **3-step training 의 의미는?**

### 답변
1. **Unbalanced panel weighting**. 자산 $i$ 가 더 오래 관측되었으면 (큰 $T_i$) moment 추정이 정확하므로 weight 높임. $\sqrt{T_i}/\sqrt{T}$ — GLS-type. 짧게 관측된 자산 (예: 신생 IPO 직후 만 보임) 의 noise 영향 차단.
2. **SDF network**: $\omega(I_t, I_{t,i})$ 학습 → portfolio weights for SDF. **Conditional network**: $g(I_t, I_{t,i})$ 학습 → test asset conditioning. 둘 다 LSTM (macro → hidden state) + FFN (full) 구조지만 **다른 LSTM, 다른 FFN** — 다른 task 에 필요한 macro state 다름.
3. (a) **LSTM 없음** — macro 는 raw 차분만. (b) **Adversarial 없음** — conditioning $g$ 학습 없음. (c) **No-arbitrage 없음** — loss 가 conditional mean MSE.
4. SDF 는 "현재 risk premium 이 어떤가" task. Conditional 은 "어느 자산이 mispriced 인가" task. 두 task 가 다른 macro state 필요 — 같은 LSTM 으로 둘 다 못 잡음. 별도 LSTM 으로 각 task 의 적합한 hidden state 학습.
5. (1) $g=1$ 으로 SDF 기본 학습 (unconditional GMM). (2) $\omega$ fix, $g$ 학습 (가장 mispriced 발견). (3) $g$ fix, $\omega$ 재학습 (약점 보완). 2-3 반복 → minimax convergence. GAN 의 standard alternating optimization.
