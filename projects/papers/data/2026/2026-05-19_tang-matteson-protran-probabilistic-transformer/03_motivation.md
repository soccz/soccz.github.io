# 03. 왜 이 연구가 필요했나 — Section 1 Introduction

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 확률적 시계열 forecasting 의 4 challenges
- 본 논문이 도전한 3 의문
- DeepAR (Gaussian 단일) 의 한계

---

paper p.1-2 (Section 1) 을 한국어로 풀어 쓴다.

---

## 3.1 이 문제가 왜 중요한가 — 응용 분야 4가지

### 원문 (paper p.1)
> Generative modeling of multivariate time series is a challenging problem with wide-ranging applications in demand forecasting [15, 76], autonomous driving [2, 16], robotics [29, 67], and health care [20, 21, 59].

### 풀어 설명

paper 가 꼽은 4개 응용:

| 분야 | 무엇을 예측하나 | 왜 분포가 필요한가 |
|------|---------------|------------------|
| **Demand forecasting (수요 예측)** | 재고, 매출, 트래픽 | 안전재고 결정 — "내일 100개 ± 30" 같은 구간 필요 |
| **Autonomous driving (자율 주행)** | 보행자·다른 차량의 trajectory | "이 차가 좌회전할 확률 70%" — 분포 없으면 사고 |
| **Robotics (로봇)** | 로봇 팔 움직임, 다른 객체 위치 | 충돌 방지에 불확실성 정량화 필수 |
| **Health care (의료)** | 환자 상태 변화, 약물 반응 | "이 환자가 48시간 내 악화될 확률 20%" |

→ 네 분야 모두 **"한 점 예측" 으로는 부족** 하고 **분포 형태의 예측** 이 필수.

ProTran 본 paper 는 forecasting + motion 만 실험. 하지만 framework 자체는 4개 분야 모두 transferable.

---

## 3.2 핵심 challenge — 왜 어려운가

### 원문 (paper p.1)
> Despite remarkable progress in recent years, models that predict high-dimensional future observations from a few past examples have remained intractable, partly due to the complex, non-deterministic temporal dynamics across long-distance time steps.

### 풀어 설명 — 3중 trouble

세 가지 어려움이 동시에 겹친다:

1. **High-dimensional output**: 출력이 한 개 숫자가 아니라 수백~수천 개 (예: Traffic 의 963개 도로).
2. **Long-distance dependencies**: 어제 9시 트래픽과 오늘 9시 트래픽처럼 멀리 떨어진 시점도 강한 관련성.
3. **Non-deterministic**: 같은 과거에서도 여러 미래 가능. "한 정답" 학습 불가능.

### Paper 의 구체적 예 — 인간 동작

paper 인용:
> Given a sequence of human poses, for example, such models must internally figure out the involved dynamics of various body components across space and time while maintaining the inherent uncertainty of multiple plausible futures, even though only one such future is observed.

**풀어 설명** (사람이 걷는 동영상):
- 17개 관절 × 시간 sequence = 매 시점마다 51차원 벡터 (3D × 17 joints).
- 모델은 "이 사람이 어떻게 움직일지" 학습해야 함 — 공간적 (관절 간 연결) + 시간적 (관성).
- 하지만 학습 데이터에는 **한 시퀀스만 관측됨** — "이 사람은 이렇게 움직였다" 한 정답만 있음.
- 그럼에도 모델은 **여러 가능한 미래** 를 상상해야 함 ("같은 시작 자세에서도 멈출 수도, 빨라질 수도, 방향 바꿀 수도").

→ "Multiple plausible futures from one observed example" — 확률적 모델만이 이걸 학습 가능.

---

## 3.3 SSM 의 매력 — 왜 이게 좋은 출발점인가

### 원문 (paper p.1)
> Among proposed probabilistic approaches, state space models (SSMs) provide a principled framework for learning and drawing inference from sequential inputs [27, 66]. While autoregressive models feed its predictions back into the dynamics model without any compressed representation of data, SSMs model stochastic transitions between abstract states using latent variables, allowing for efficient state-to-state sampling without the need to render high-dimensional observations.

### 풀어 설명 — SSM 의 3가지 장점

**장점 1: Principled framework (수학적 토대 명확)**
- 60년 동안 통계학·신호처리에서 검증된 표준.
- Bayes rule + 변분 추론으로 학습·예측이 깔끔하게 유도됨.
- 새 모델 만들 때 "어디서 출발할지" 가 명확.

**장점 2: Latent abstract state (압축된 추상 상태)**
- 관측값 $x$ 가 노이즈가 많고 고차원이어도, 잠재 $z$ 가 **본질적 정보만** 추출.
- 비유: 영화의 모든 픽셀을 기억하지 않고 "줄거리" 만 기억 — 그게 잠재 상태.

**장점 3: Efficient state-to-state sampling (잠재 공간에서의 효율적 생성)**
- 잠재 $z$ 가 저차원이면 (예: 16차원) 연산이 가볍다.
- 관측 $x$ 가 고차원이어도 (예: 1000차원) **잠재 공간에서만 추론** 하면 됨.
- "고차원 출력을 매 step 인코딩·디코딩 하지 않아도 된다" — 큰 효율성 이득.

### LDS 의 한계 (출발점이지만 충분하지 않음)

paper 인용:
> Gaussian linear dynamical systems (LDSs), one of the best known SSMs [92], for example, postulate linear state transitions and enjoy exact inference via the celebrated Kalman filter algorithm.

**LDS = SSM 의 가장 단순한 형태**:
- 모든 전이가 직선 (linear).
- Kalman filter 로 정확하게 풀림 (1960 년, Rudolf Kalman).
- 자동차 GPS, 미사일 추적 등 60년 동안 표준.

**두 가지 한계**:
1. **Markovian**: $z_t$ 가 $z_{t-1}$ 만 의존. 장거리 의존성 못 잡음.
2. **Linear**: 모든 관계가 직선. 진짜 세계의 비선형 (회전, 임계점, 비대칭) 표현 불가.

→ 이걸 깨야 진짜 세계에 쓸 수 있다.

---

## 3.4 기존 Deep SSM 의 시도들

### 원문 (paper p.1)
> Some approaches retain the Markovian dynamics of LDSs and only replace their linear observation models with feed-forward networks [23, 31, 47, 71], whereas others favor nonlinear state transitions and parametrize such dependencies via recurrent neural networks (RNNs) [22, 23, 30, 39, 51, 75].

### 풀어 설명 — 두 갈래의 시도

**갈래 1: Markov 유지 + emission 만 신경망화**
- 예: KVAE (Fraccaro 2017), NKF (de Bézenac 2020).
- "전이는 여전히 단순하게, 다만 emission 만 풍부하게" 라는 전략.
- 장점: Kalman 의 깔끔함 유지.
- 한계: **여전히 Markov** — 장거리 의존성 못 잡음.

**갈래 2: RNN 으로 전이 표현**
- 예: VRNN (Chung 2015), DKS (Krishnan), PlaNet (Hafner 2019).
- "전이를 RNN 으로 만들면 비선형 + 비-Markov 가능" 이라는 전략.
- 장점: 표현력 ↑.
- 한계: **RNN 의 gradient vanishing** — 멀리 떨어진 시점은 여전히 약함.

### 두 갈래 모두의 공통 한계

paper:
> Despite differences, both Markovian transitions and RNNs are often not capable of capturing long-range dependencies in highly structured sequential inputs [36, 100], limiting the capacity of the corresponding SSMs.

→ **Markov 도, RNN 도 둘 다 long-range 약점**. 이게 ProTran 이 깨려는 벽.

---

## 3.5 ProTran 의 답 — Section 1 의 핵심 주장

### 원문 (paper p.2)
> In this work, we propose to combine the complementary strengths of SSMs and transformer architectures [85], a powerful mechanism for modeling long-term interactions that enjoys success across a variety of sequence modeling tasks [26, 48, 99]. In contrast to most SSMs, our models make extensive use of attention mechanism [5, 85] between latent variables to model non-Markovian dynamics (see Figure 1).

### 풀어 설명

**핵심 아이디어**:
- SSM 의 좋은 점: 잠재 변수 + 확률성 + 추론 깔끔함.
- Transformer 의 좋은 점: Attention 으로 long-range 의존성 잘 잡음.
- → **둘을 결합** 하되, attention 을 **잠재 변수 사이에** 적용.

**왜 잠재 변수에 attention 인가** (이게 design 의 핵심):
- 일반 Transformer 는 **관측 $x$ 에 attention** — 노이즈 많은 데이터 자체에 가중치.
- ProTran 은 **잠재 $z$ 에 attention** — 정제된 의미에 가중치.
- 비유: "원본 사진들끼리 비교" vs "사진의 캡션들끼리 비교". 후자가 더 의미 있다.

### Figure 1 — 본 paper 의 시각적 핵심

![Fig. 1 Graphical models](figures/Fig1_graphical_models.png)

(Figure 1, paper p.2)

### 📖 처음 보는 사람을 위한 — Figure 1 (본 논문 심장) 읽는 법

**한 줄로**: "**4 panel** — (a) LDS / (b) ProTran 1-layer / (c) 3-layer 생성 / (d) 3-layer 추론. SSM 의 한계와 ProTran 의 답을 한 그림에".

**4 panel 의 의미**:

| panel | 무엇 | 일상 비유 |
|------|------|-----------|
| **(a) LDS** | 표준 Linear Dynamical System | "$z_t$ 가 $z_{t-1}$ 만 봄 (Markov)" — 단기 기억만 |
| **(b) ProTran 1-layer** | $z_t$ 가 $z_{1...t-1}$ **모두** 봄 | "**non-Markovian** — 모든 과거 기억" — attention 덕분 |
| **(c) 3-layer 생성** | hierarchical latent | "3 단계 추상화 — low-level + high-level" |
| **(d) 3-layer 추론** | hierarchical inference | "모든 layer 의 posterior 동시 추론" |

**노드 색 규칙** (graphical model 표준):
- **회색 (음영)**: 관측 변수 ($x_t$) — 우리가 보는 값
- **흰색**: 잠재 변수 ($z_t$) — 추론 대상

**(a) vs (b) 의 결정적 차이**:
- (a) LDS: $z_t \leftarrow z_{t-1}$ (화살표 1 개) — Markov
- (b) ProTran: $z_t \leftarrow z_1, z_2, ..., z_{t-1}$ (화살표 모두) — **non-Markovian**, attention
- → "**기억력의 차이**" — LDS 는 어제만, ProTran 은 전체 과거 기억

**일상 비유**: "오늘 시험 점수 예측"
- (a) LDS: 어제 점수만 봄 (단기 기억)
- (b) ProTran: **전체 점수 기록** 본 후 attention 으로 중요한 시점만 골라 봄

**원문 위치**: paper Fig. 1, journal p.2.

---


이 그림은 paper 전체의 핵심을 한 페이지에 압축한 시각적 signature. **graphical model** notation 의 표준 — 자세히 읽는 법을 단계적으로.

#### Step 1 — 그림의 기본 요소 이해

**노드 (동그라미)**:
- **음영 (회색) 동그라미** $x_{t-1}, x_t, x_{t+1}$ = **관측 변수** (observed). 우리가 보는 값.
- **흰색 (밝은) 동그라미** $z_{t-1}, z_t, z_{t+1}$ = **잠재 변수** (latent). 추론 대상.
- 좌우 방향 = 시간 진행 (왼쪽 과거, 오른쪽 미래).
- 상하 = 변수 종류 (위 = $x$, 아래 = $z$).

**화살표**:
- **검은 화살표**: **생성 방향** (generative). $A \to B$ = "$B$ 가 $A$ 로부터 생성" — 즉 $p(B | A)$.
- **빨간 화살표**: **추론 방향** (inference). 관측 → 잠재 = $q_\phi(z | x)$.

→ 화살표 한 개 = 조건부 의존성 한 개.

#### Step 2 — 각 패널 자세히

##### (a) LDS — 비교용 baseline

```
   x_{t-1}    x_t    x_{t+1}     ← 관측 (회색)
      ↑       ↑       ↑          ← emission (검은 화살표)
      │       │       │
   z_{t-1} → z_t → z_{t+1}       ← 잠재 (흰색)
                                   transition (수평 검은 화살표)
   
   추가 빨간 화살표 (inference):
   x_t → z_t (관측 → 잠재)
```

**그림에서 읽을 수 있는 것**:
- **수평 검은 화살표가 한 개씩** — $z_{t-1} \to z_t \to z_{t+1}$.
- **Markov 가정의 시각화** — 이전 시점 잠재만 영향.
- **수직 검은 화살표**: $z_t \to x_t$ (emission, 잠재가 관측 생성).
- **빨간 화살표**: $x_t \to z_t$ (inference, 관측에서 잠재 추정).
- 60년 SSM 의 표준 구조.

##### (b) ProTran 1-layer — 본 paper 의 단순 버전

```
   x_{t-1}    x_t    x_{t+1}     ← 관측 (회색)
      ↑       ↑       ↑
      │       │       │
   z_{t-1}   z_t   z_{t+1}       ← 잠재
       ↘ ↑ ↗ ↘ ↑ ↗ ↘ ↑ ↗        ← 폭발하는 수평 화살표
        ↘↑↗   ↘↑↗   ↘↑↗
   z_{t+1} 로 가는 화살표: z_1, z_2, ..., z_t 전부에서!
```

**(a) 대비 가장 큰 차이**:
- (a) 의 수평 화살표는 **한 개씩** ($z_{t-1} \to z_t$ 만).
- (b) 의 수평 화살표는 **모든 과거에서** 미래로 흐름.

**구체적**: $z_{t+1}$ 로 가는 화살표가
- (a) LDS: 1개 (오직 $z_t$ 에서).
- (b) ProTran: $t$개 (모든 $z_1, z_2, \ldots, z_t$ 에서).

**시각적 의미**: 화살표 밀도의 폭발 = **non-Markovian** 의 시각화. Attention 으로 가능.

##### (c) ProTran 3-layer Generation

```
   x_{t-1}    x_t    x_{t+1}     ← 관측 (회색)
      ↑       ↑       ↑          ← emission (top layer 에서만)
      │       │       │
   z^(3)_{t-1} z^(3)_t z^(3)_{t+1}  ← Layer 3 (top, 가장 추상)
       ↑       ↑       ↑          ← cross-layer
       │       │       │
   z^(2)_{t-1} z^(2)_t z^(2)_{t+1}  ← Layer 2
       ↑       ↑       ↑
       │       │       │
   z^(1)_{t-1} z^(1)_t z^(1)_{t+1}  ← Layer 1 (bottom, 가장 구체)
   
   각 layer 내부에는 (b) 처럼 수평 화살표 폭발.
   추가로 layer 간 수직 화살표 (검은색).
```

**핵심 관찰**:
- 3 row 의 layer.
- 검은 화살표 (생성 방향): **위 layer 에서 아래 layer 로** + **아래 layer 의 모든 시점에서** 위 layer 의 같은 시점으로 (Eq 16).
- **Emission 은 top layer 만** — $z^{(3)} \to x$.

##### (d) ProTran 3-layer Inference

```
   같은 3-layer 구조, 다만 화살표가 빨강 (inference 방향)
   
   x_{t-1}    x_t    x_{t+1}
      ↓       ↓       ↓          ← 관측 → 잠재 (빨간 화살표)
      │       │       │
   z^(3)_{t-1} z^(3)_t z^(3)_{t+1}
       ↓       ↓       ↓
       │       │       │
   z^(2)_{t-1} z^(2)_t z^(2)_{t+1}
       ↓       ↓       ↓
       │       │       │
   z^(1)_{t-1} z^(1)_t z^(1)_{t+1}
```

**핵심 관찰**:
- 같은 노드 구조, 다만 빨간 화살표만.
- **관측에서 잠재로** 정보 흐름 (학습 시에만).
- (c) 의 검은 화살표 + (d) 의 빨간 화살표 = 학습 시 동시 작동.

#### Step 3 — 왜 (c) 와 (d) 를 분리 그렸나

paper caption 인용:
> The separation of generation and inference in (c) and (d) is for readability.

**이유**: 한 그림에 검은 화살표 (generation) + 빨간 화살표 (inference) 다 그리면 화살표가 너무 많아져 읽기 어려움. 분리 = readability.

**실제로는**: 학습 시 (c) 와 (d) 가 **같은 모델의 두 방향** — 동시에 작동.

#### Step 4 — 그림 전체에서 읽을 수 있는 4 가지 통찰

1. **(a) → (b)**: Markov → Non-Markov 의 시각화 (수평 화살표 폭발).
2. **(b) → (c)**: Single layer → Multi-layer (수직 layer 추가).
3. **(c) vs (d)**: 같은 모델의 두 방향 (생성 vs 추론).
4. **모든 panel 공통**: 잠재 $z$ 가 모든 정보 매개 — emission $p(x|z)$ 는 시점 독립.

#### Step 5 — paper caption 전체 풀이

paper caption:
> Black arrows denote the generative mechanism and red arrows the inference procedure. The separation of generation and inference in (c) and (d) is for readability. While traditional SSMs such as LDSs are limited to Markovian dynamics and linear dependencies, our models allow for non-Markovian and non-linear interactions between time steps via attention mechanism. A multi-layer extension of our models further increases expressiveness without compromising the tractable inference procedure.

**문장별 풀이**:
1. "Black arrows = generation, red = inference" — 두 색의 의미.
2. "Separation for readability" — (c) (d) 분리 이유.
3. "LDS = Markov + linear" — (a) 의 한계.
4. "Our models = non-Markov + non-linear via attention" — (b) 의 차이.
5. "Multi-layer extension increases expressiveness" — (c) (d) 의 의미.
6. "Without compromising tractable inference" — (d) 가 여전히 tractable.

→ caption 한 줄도 그림 한 panel 의 의미를 풀이.

#### Step 6 — 이 그림이 paper 의 signature 인 이유

**한 그림으로 압축된 4 메시지**:
1. SSM 의 한계 (a).
2. ProTran 의 단순 버전 (b).
3. ProTran 의 확장 (c).
4. 학습 방식 (d).

→ paper 의 6 페이지 본문이 이 그림 한 장에 압축. 다른 챕터들이 이 그림의 한 부분씩 자세히 설명.

| 챕터 | Fig 1 의 어느 panel |
|------|--------------------|
| 03 (motivation) | 전체 4 panel — 본 절 |
| 04 (SSM) | (a) LDS — 비교 baseline |
| 06 (single-layer) | (b) ProTran 1-layer — 자세한 수식 |
| 07 (inference) | (b) 의 빨간 화살표 — Eq 10-11 |
| 08 (multi-layer) | (c) (d) — 자세한 수식 |

### Transformer-based 시계열 모델과의 차별 (Informer/Autoformer 류)

paper:
> Compared to transformer-based methods, our models are probabilistic, non-autoregressive in a similar fashion to LDSs, and capable of generating diverse long-term forecasts with uncertainty estimates.

**ProTran vs Informer/Autoformer**:

| 측면 | Informer/Autoformer 등 | ProTran |
|------|----------------------|---------|
| Latent variable | 없음 | **있음 (잠재 $z$)** |
| Output | 점 예측 | **분포 (잠재 sampling)** |
| Generation | 한 step 씩 autoregressive | **잠재에서 한 번에 전체** |
| Uncertainty | 표현 안 됨 | **잠재의 variance 로 표현** |

→ ProTran 의 unique selling point: **probabilistic + latent**.

---

## 3.6 Main Contributions — 본 paper 의 3 가지 공헌

### 원문 (paper p.2)
> Our main contributions are threefold.
> 
> First, we propose novel SSMs based on transformer architectures for multivariate time series, which include generative models and inference procedures based on variational inference [49, 74].
> 
> Second, we extend our models to include several layers of stochastic latent variables organized in a hierarchy for further expressiveness.
> 
> Third, we conduct extensive experiments on time series forecasting and human motion prediction and demonstrate that our Probabilistic Transformer (ProTran) performs remarkably well compared to various state-of-the-art baselines.

### 풀어 설명 — 3 공헌

| # | 공헌 | 의미 | 어느 챕터에서 다루나 |
|---|------|------|-------------------|
| **1** | SSM + Transformer 결합 + 변분 추론 | 새 framework 제안 (Eq 1-11) | 04, 06, 07 |
| **2** | Multi-layer hierarchical 확장 | 표현력 ↑ (Eq 12-20) | 08 |
| **3** | 두 분야 SOTA 실증 | Forecasting (5 datasets) + Motion (2 datasets) | 11, 12 |

**3 공헌의 직교성**:
- 1번: framework 의 novelty (방법론)
- 2번: capacity scaling (확장성)
- 3번: empirical validation (실증)

→ 각각 독립적으로 검증 가능. Ablation (Table 2) 이 1번 + 2번 의 효과를 분리해서 보여준다.

---

## 3.7 정리

Section 1 의 논리 흐름:

```
1. 시계열 생성 모델링은 중요한 문제다
       │
       ↓
2. 3중 trouble: 고차원 + 장거리 + 확률성
       │
       ↓
3. SSM 이 좋은 출발점이다 (잠재 + 확률)
       │
       ↓
4. 하지만 기존 SSM 은 Markov 또는 RNN 한계 (long-range 약함)
       │
       ↓
5. → ProTran: SSM 의 잠재 변수에 Transformer attention
       │
       ↓
6. 3 공헌: framework / hierarchy / empirical
```

이게 Section 1 전체의 골격. 다음 챕터부터는 **수식으로 들어간다**.

---

## 자기점검 (이 챕터)

### 핵심 5가지

1. **"Markov 한계" 가 왜 ProTran 의 출발점이 되었나?**
2. **왜 attention 을 잠재 $z$ 에 적용하지 관측 $x$ 에 적용하지 않았나?**
3. **Figure 1 의 (b) 와 (a) 의 가장 큰 차이는?**
4. **Smoothing 이 RNN/DKF 에서 어려운 이유와 ProTran 의 해결?**
5. **시계열 분야에 attention 적용이 늦었던 이유 (NLP 대비)?**

### 답변

1. **기존 SSM 의 두 갈래 (Markov 유지 / RNN 사용) 모두 long-range dependency 를 못 잡는다는 공통 한계**. ProTran 은 이 벽을 직접 깨려고 attention 을 도입. **Markov 한계의 정확한 의미**: $z_t$ 가 $z_{t-1}$ 만 의존 → 지난 주의 정보 → 이번 주 영향 못 갈 수도. **RNN 의 vanishing gradient**: 멀리 떨어진 정보가 hidden state 통과하며 손실. **둘 다 long-range 미해결** → attention 의 등장 motivation.

2. 관측 $x$ 는 **노이즈가 많은 raw data**. 잠재 $z$ 는 **정제된 추상 상태** (모델이 학습). Attention 을 잠재에 적용하면 "의미 있는 정보들끼리 비교" 가 되고, **노이즈 전파를 회피**. **계산 효율**: 잠재 차원 $d$ ≪ 관측 차원 $N$ (예: $d$=128, $N$=963 Traffic). $O(T^2 d)$ vs $O(T^2 N)$ — 약 7배 효율. **표현력**: 의미적 패턴이 잠재에 압축 → 더 의미 있는 attention.

3. **(a) LDS** 는 $z_t$ 가 $z_{t-1}$ 만 의존하는 단순 체인 → **first-order Markov**. **(b) ProTran** 은 $z_{t+1}$ 이 $z_1, \ldots, z_t$ 모두에 직접 화살표 → **non-Markovian**, 전체 과거를 동시에 본다. **시각적 차이**: (a) 의 화살표는 chain, (b) 의 화살표는 fan-out (한 노드에서 여러 노드로). **의미**: (a) 는 작년 정보 손실 가능, (b) 는 작년 정보 직접 참고 가능.

4. **RNN 의 어려움**: Hidden state 가 정보 압축. Bidirectional RNN 사용해도 forward + backward 결합 만 → mixed signal. **DKF (Deep Kalman Filter)** 같은 deep SSM 도 마찬가지. **ProTran 의 해결**: (i) **bidirectional self-attention** ($k_t$ 생성) 으로 전체 sequence 의 정보 균등 접근, (ii) Posterior 가 prior 와 분리 학습 (KL term 으로 align), (iii) Smoothing 시 미래 정보 활용 → 더 정확한 latent 추정. **결과**: training-only smoothing 이 inference 시 prior 의 quality 향상 → test 시 강력.

5. **NLP 대비 시계열의 늦은 attention 적용 이유**: (i) **dimensionality**: NLP 는 word-level (낮은 차원), 시계열은 multivariate (높은 차원). Attention $O(T^2 N)$ 의 비용. (ii) **noise**: 시계열은 fat-tail noise + non-stationary, NLP 는 비교적 stable. (iii) **interpretation**: NLP 의 token = 의미 단위 명확, 시계열의 timestep = 의미 모호. (iv) **community gap**: NLP 가 transformer 적극 채택 (BERT 2018, GPT 2019) → 시계열 분야는 RNN 고수 (DeepAR 2017). **ProTran (2021)** 이 시계열에서 latent attention 의 길을 염. PatchTST (2023) 가 그 후속.

다음 [04_preliminaries_ssm.md](04_preliminaries_ssm.md) 에서 SSM 의 수학적 정의 (Eq 1-3) 를 풀어본다.
