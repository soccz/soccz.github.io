# 02. 제목과 Abstract — 한 줄씩 풀어 읽기

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 논문 제목 ("Probabilistic Transformer") 의 정확한 의미
- 저자 (Cornell Univ) 의 학계 위치
- Abstract 6 문장의 한국어 의역
- 본 논문의 4 핵심 발견 (4/5 datasets best + RNN 없이)

---

## 2.1 제목: "Probabilistic Transformer for Time Series Analysis"

한국어로 풀면: **"시계열 분석을 위한 확률적 트랜스포머"**

단어별로 보자:

| 영어 | 뜻 | 풀어 설명 |
|------|-----|---------|
| Probabilistic | 확률적 | 결정론적이 아니라 분포로 출력 |
| Transformer | 트랜스포머 | 2017년 Vaswani 가 만든 attention 기반 신경망 — 원래 NLP 용 |
| For | ~을 위한 | (목적·용도) |
| Time Series | 시계열 | 시간 순서로 측정한 데이터 |
| Analysis | 분석 | 모델링·예측 |

즉, **"Transformer 를 시계열용으로 변형하되, 출력이 한 점이 아닌 분포가 되도록 만든 모델"** 이다.

### "확률적" 이 강조된 이유

표준 Transformer (NLP 의 BERT, GPT) 는:
- 결정론적 (deterministic) 출력 가능.
- 또는 next-token 확률을 학습 (sequence-level 분포는 자연스럽지 않음).

시계열에서는:
- 미래가 본질적으로 multiple plausible.
- 한 점 예측 → 불충분.
- → **분포 예측 (probabilistic forecasting)** 이 필요.

paper 가 "Probabilistic" 을 제목 맨 앞에 둔 이유 = 이게 ProTran 의 핵심 차별.

---

## 2.2 저자 정보

### Binh Tang
- Cornell University Statistics and Data Science 박사과정 (당시).
- 이메일: bvt5@cornell.edu — paper 의 corresponding author.
- 연구 분야: 시계열, 확률 모델, deep learning.

### David S. Matteson
- Cornell University Statistics and Data Science 교수.
- 확률 모델·시계열·neural network 의 통계학적 분석 전문가.
- 다수의 시계열 paper publication.

### Cornell 의 시계열 연구 전통
- Cornell 의 통계학 학과는 시계열 연구가 강한 전통.
- 본 paper 는 그 전통의 deep learning 시대 작품.

### NeurIPS 란?
- **N**eural **I**nformation **P**rocessing **S**ystems
- ML 분야의 top conference (NeurIPS, ICML, ICLR 의 "Big Three" 중 하나).
- NeurIPS 2021 = 35차 conference, 시계열 paper 들이 동시 폭발한 해.
- Accept rate ~25% — competitive.

---

## 2.3 영어 원문 (NeurIPS 2021, p.1)

> Generative modeling of multivariate time series has remained challenging partly due to the complex, non-deterministic dynamics across long-distance time steps. In this paper, we propose deep probabilistic methods that combine state-space models (SSMs) with transformer architectures. In contrast to previously proposed SSMs, our approaches use attention mechanism to model non-Markovian dynamics in the latent space and avoid recurrent neural networks entirely. We also extend our models to include several layers of stochastic variables organized in a hierarchy for further expressiveness. Compared to transformer models, ours are probabilistic, non-autoregressive, and capable of generating diverse long-term forecasts with accounted uncertainty. Extensive experiments show that our models consistently outperform competitive baselines on various tasks and datasets, including time series forecasting and human motion prediction.

(총 6 문장)

---

## 2.4 한국어 직역

> 다변량 시계열의 생성 모델링은 장거리 시간 step 사이의 복잡한 비결정적 dynamics 때문에 여전히 도전적이다. 본 논문에서 state-space model (SSM) 과 transformer 구조를 결합한 deep probabilistic 방법을 제안한다. 기존 SSM 과 대조적으로, 우리 접근은 attention 메커니즘으로 latent space 의 non-Markovian dynamics 를 모델링하고 RNN 을 완전히 피한다. 더 나아가 hierarchy 로 조직된 stochastic 변수 여러 layer 를 포함하도록 모델을 확장한다. Transformer 와 비교하면 우리 것은 probabilistic 이고 non-autoregressive 이며 uncertainty 가 반영된 diverse 한 장기 forecast 생성 가능. 광범위 실험 결과 시계열 forecasting + human motion prediction 의 다양한 task 와 dataset 에서 baseline 들을 일관되게 능가.

---

## 2.5 한 문장씩 풀이

### 첫째 문장 — 문제 제기

> Generative modeling of multivariate time series has remained challenging partly due to the complex, non-deterministic dynamics across long-distance time steps.

**의역**: "다변량 시계열의 생성 모델링은 장거리 시간 step 사이의 복잡한 비결정적 dynamics 때문에 여전히 도전적이다."

**풀어 설명** — 핵심 단어 하나씩:

| 영어 | 한국어 | 의미 |
|------|--------|------|
| Generative modeling | 생성 모델링 | 단순 예측이 아닌 multiple plausible 생성 |
| Multivariate | 다변량 | 시계열 변수 여러 개 동시 (예: 100개 도로) |
| Has remained challenging | 여전히 도전적 | 30년 연구 됐지만 미해결 |
| Complex | 복잡한 | 단순 trend / seasonal 이 아님 |
| Non-deterministic dynamics | 비결정적 dynamics | 같은 과거에서도 여러 미래 가능 |
| Long-distance time steps | 장거리 시간 step | 어제 9시와 오늘 9시처럼 멀리 떨어진 시점 |

**비유 (날씨 모델링)**:
- Multivariate = 여러 도시의 기온·습도·풍속 동시 예측.
- Non-deterministic = 같은 어제 데이터에서도 오늘 비/맑음 가능.
- Long-distance = 일주일 전 기압 패턴이 오늘 날씨 영향.

→ **세 가지가 동시에 어려움**. 한 문장이지만 3중 trouble 명시.

### 둘째 문장 — 해결 방안의 큰 그림

> In this paper, we propose deep probabilistic methods that combine state-space models (SSMs) with transformer architectures.

**의역**: "본 논문에서 state-space model (SSM) 과 transformer 구조를 결합한 deep probabilistic 방법을 제안한다."

**풀어 설명**:
- "Deep probabilistic methods" = 깊은 (deep learning) + 확률적 (probabilistic) 방법.
- "Combine SSMs with transformers" = 두 정신의 결합.

**왜 이게 새로운가**:
- SSM 만으로는 long-range 약함 (Markov 또는 RNN).
- Transformer 만으로는 latent 없음 (확률적 출력 어려움).
- → 둘의 결합이 ProTran 의 unique 위치.

### 셋째 문장 — 핵심 design choice

> In contrast to previously proposed SSMs, our approaches use attention mechanism to model non-Markovian dynamics in the latent space and avoid recurrent neural networks entirely.

**의역**: "기존 SSM 과 대조적으로, 우리 접근은 attention 메커니즘으로 latent space 의 non-Markovian dynamics 를 모델링하고 RNN 을 완전히 피한다."

**풀어 설명** — 3 가지 design choice:

1. **Attention in latent space** (관측이 아닌 잠재에 attention).
2. **Non-Markovian dynamics** ($z_t$ 가 $z_{1:t-1}$ 전체 의존).
3. **No RNN at all** (완전히 거부).

**강조 부사 "entirely" 의 의미**:
- 단순히 "RNN 안 쓴다" 가 아니라 "**완전히** 안 쓴다".
- 2021년 시점에서는 시계열 모델의 표준이 LSTM — 이 표준에 대한 강한 도전.

### 넷째 문장 — Multi-layer 확장

> We also extend our models to include several layers of stochastic variables organized in a hierarchy for further expressiveness.

**의역**: "더 나아가 hierarchy 로 조직된 stochastic 변수 여러 layer 를 포함하도록 모델을 확장한다."

**풀어 설명**:
- "Several layers of stochastic variables" = 잠재 $z$ 가 한 층이 아니라 여러 층.
- "Hierarchy" = 위계 — 위 layer 가 아래 layer 의존.
- "For further expressiveness" = 표현력 ↑.

**비유 (회사 조직)**:
- Layer 1 = 사원 (한 시점의 미세 변동).
- Layer 2 = 팀장 (출퇴근 시간대).
- Layer 3 = 임원 (평일/주말, 계절).

→ Single-layer (Section 3.1) + Multi-layer (Section 3.2) 의 자연 확장.

### 다섯째 문장 — Transformer 와의 3 가지 차별

> Compared to transformer models, ours are probabilistic, non-autoregressive, and capable of generating diverse long-term forecasts with accounted uncertainty.

**의역**: "Transformer 와 비교하면 우리 것은 probabilistic 이고 non-autoregressive 이며 uncertainty 가 반영된 diverse 한 장기 forecast 생성 가능."

**풀어 설명** — 표로:

| 측면 | 표준 Transformer | ProTran |
|------|---------------|---------|
| Output | 결정론적 한 값 | **분포** (잠재 sampling) |
| Generation | 한 토큰씩 (autoregressive) | **잠재에서 한 번에** (non-autoregressive) |
| Uncertainty | 명시적 표현 없음 | **잠재의 variance** 로 표현 |
| Long-term | 오류 누적 가능 | **잠재 공간 결정** → 안정 |

**Autoregressive vs Non-autoregressive 비유**:
- Autoregressive = 빵을 한 조각씩 자르며 만들기. 앞 조각 실수 → 다음 비뚤어짐.
- Non-autoregressive = 빵 전체 형태를 한 번에 잡고 자르기. 누적 오류 없음.

### 여섯째 문장 — 실험 결과

> Extensive experiments show that our models consistently outperform competitive baselines on various tasks and datasets, including time series forecasting and human motion prediction.

**의역**: "광범위 실험 결과 시계열 forecasting + human motion prediction 의 다양한 task 와 dataset 에서 baseline 들을 일관되게 능가."

**풀어 설명**:
- "Extensive experiments" = 광범위한 실험.
- "Consistently outperform" = 일관되게 우수.
- "Various tasks and datasets" = 두 분야 + 7 dataset.

**구체적**:
- 시계열: 5 datasets × 11 baselines.
- 모션: 2 datasets × 9 baselines.

**왜 두 분야인가**:
- 학계가 분리해서 연구해 왔지만 본질적으로 같은 conditional prediction.
- 같은 framework 가 두 분야 SOTA = **task-agnostic** 의 강력한 증명.

---

## 2.6 Abstract 를 한 그림으로

```
[기존 시계열 모델]
   ├── 통계 (ARIMA, VAR):
   │      └── 선형, univariate, 단순
   ├── RNN (DeepAR, LSTM-Copula):
   │      └── 비선형 OK, but long-range 약함, latent 부족
   └── Transformer (Informer, Autoformer):
          └── Long-range OK, but latent 없음, deterministic
                          
                          ↓
                   [세 부족함 동시 해결]
                          ↓
   [ProTran]
      = SSM (잠재 + 확률) + Transformer (attention) + Multi-layer
            │
            ↓
      "잠재 변수 사이에 attention"
            │
            ↓
   ┌──────────────────────────────────────────┐
   │ 결과:                                      │
   │ • 시계열 5/5 SOTA (4 outright, 1 tie)     │
   │ • 모션 3/4 SOTA                            │
   │ • CRPS_sum 32-36% 개선 vs TimeGrad         │
   │ • Calibration 정확 (Fig 2)                 │
   └──────────────────────────────────────────┘
```

---

## 2.7 여기서 미리 던지는 질문들

이 초록만 봐도 의문이 생긴다:

1. **"SSM 과 Transformer 를 어떻게 결합하나?"** → Section 3.1 (Eq 5-11) 에서 정의.
2. **"왜 attention 을 잠재 변수에 거나? 관측에 거지 않고?"** → Section 3 의 design rationale.
3. **"Multi-layer hierarchy 는 어떻게 작동하나?"** → Section 3.2 (Eq 12-20).
4. **"왜 RNN 을 완전히 거부하나?"** → Section 4 (관련 연구) + Section 2.2 (Transformer 의 long-range 장점).
5. **"두 분야 SOTA 의 의미는?"** → Section 5 (실험).

이 5개 질문이 이 논문 전체의 뼈대다. 각각 답을 찾아가며 읽으면 됨.

---

## 2.8 같은 시기 다른 시계열 paper 와의 비교

NeurIPS 2021 에 시계열 paper 가 동시 폭발 (Cambrian explosion):

| Paper | 핵심 contribution | Output |
|-------|----------------|--------|
| **Autoformer** (Wu et al.) | Auto-Correlation (FFT) + 분해 inner block | 점 예측 |
| **Informer** (Zhou et al.) | ProbSparse attention | 점 예측 |
| **ProTran** (이 paper) | **SSM + Attention + 확률 잠재** | **분포** |
| **TimeGrad** (Rasul et al.) | Diffusion 첫 도입 | 분포 |
| **CSDI** (Tashiro et al.) | Score-based diffusion | 분포 |

→ ProTran 의 unique axis = **확률 잠재 + non-autoregressive**.

**역사적 의미**: 이후 TimeGrad, CSDI, TMDM (2024) 등 diffusion-based 시계열 모델들의 정신적 시조.

---

## 2.9 한 문단으로 요약

ProTran 은 SSM (잠재 + 관측 framework, 확률적) 에 Transformer attention 을 잠재 공간에 적용해 만든 새 시계열 생성 모델. RNN 은 완전히 빼고, 잠재 변수 사이의 비-Markovian 의존성을 attention 으로 모델링. Multi-layer hierarchy 로 표현력 확장. 시계열 예측 (5 datasets, 11 baselines) + 인간 동작 예측 (2 datasets, 9 baselines) 양쪽 SOTA. 같은 NeurIPS 2021 의 Autoformer, Informer, TimeGrad 와 함께 시계열 deep learning 의 paradigm shift 의 한 축. 후속 diffusion 모델들의 정신적 시조.

---

## 2.10 자기점검 (이 챕터)

### 핵심 4가지
1. **"Probabilistic" 이 제목 맨 앞에 있는 이유는?**
2. **"non-Markovian dynamics in the latent space" 의 의미는?**
3. **"avoid recurrent neural networks entirely" 의 의미는?**
4. **이 paper 가 두 분야 (시계열 + 모션) 를 다루는 이유는?**

### 답변
1. ProTran 의 핵심 차별점이 **확률적 출력**. 표준 Transformer 는 deterministic 또는 next-token 확률만 — sequence-level 분포 어려움. ProTran 은 잠재 변수의 stochasticity 로 분포 자연 생성. 제목이 paper 의 unique selling point 를 즉시 보여줌.
2. 잠재 변수 $z_t$ 가 $z_{t-1}$ 만이 아니라 **$z_1, \ldots, z_{t-1}$ 전체** 에 의존. Markov 가정 (직전만 본다) 을 깸. Attention 으로 가능. 이 design 이 SSM 의 60년 한계를 깸.
3. 2021 년 시점에서 시계열 모델의 표준 도구가 LSTM/GRU. paper 는 "**완전히** 거부" 라는 강한 부사로 paradigm shift 의지 명시. 같은 NeurIPS 2021 의 Autoformer, Informer, TimeGrad 모두 같은 정신.
4. paper 의 주장: "시계열 forecasting 과 motion prediction 은 사실 같은 conditional prediction 문제인데 학계가 나눠서 연구해 왔다". 하나의 framework 가 두 분야 모두 SOTA 임을 증명함으로써 **task-agnostic framework** 의 정당성 확보. 이게 paper 의 가장 큰 메시지 중 하나.

다음 [03_motivation.md](03_motivation.md) 에서 paper Section 1 (Introduction) 자세히 풀이.
