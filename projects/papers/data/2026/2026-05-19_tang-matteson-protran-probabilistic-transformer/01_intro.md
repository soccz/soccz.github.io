# 01. 시작하기 전에 — 이 해설집을 어떻게 읽으면 되나

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 한 문장으로 뭘 하는지 ("SSM + Transformer 결합으로 확률 시계열 예측")
- 7 개 핵심 개념 (SSM / LDS / Kalman / VAE / ELBO / Transformer / CRPS)
- 4 challenges + 3 contributions
- RNN 완전 거부의 의미

---

### 🌱 이 논문 — 일상 비유 (가장 쉽게)

**한 줄로**: "도로 트래픽 같은 시계열 미래 예측 — '한 답' 이 아닌 '여러 가능성 분포'. Transformer + 잠재 변수 결합".

| 비유 | 본 논문 |
|------|--------|
| 일기 예보 (한 줄: 26°C) | Point forecast (구식) |
| 일기 예보 (분포: 60% 25-27°C, 30% 23-25°C, 10% 28+°C) | **Probabilistic forecast (ProTran)** |
| 학생들이 channel chat | RNN (1대1 전달) |
| 학생들이 모두 회의실 모임 | **Transformer (모든 과거 직접 참고)** |
| 학생 머릿속 생각 | 잠재 변수 $z_t$ |
| 시험 전 답안지 보며 공부 | Smoothing (training-only) |

### 🔣 7 개 핵심 개념 4-단 풀이

| 개념 | 한 줄 설명 |
|------|----------|
| **SSM (State-Space Model)** | 잠재 상태 + 관측의 시계열 모델 (Kalman 1960 부터) |
| **LDS (Linear Dynamical System)** | SSM 의 linear 특수 case |
| **Kalman filter** | LDS 의 inference 알고리즘 |
| **VAE (Variational Autoencoder)** | 잠재 변수 + ELBO 최적화 (2014 Kingma) |
| **ELBO** | $\log p(x)$ 의 lower bound, 학습 목표 |
| **Transformer** | Attention 기반 신경망 (2017 Vaswani) |
| **CRPS_sum** | 확률 예측 정확도 metric (낮을수록 좋음) |

### 🔑 핵심 통찰

> 본 논문 = **2017 (Transformer) + 2014 (VAE) + 1960 (SSM)** 의 60년 도구 통합. 60년 전 Kalman 이 만든 SSM 의 정신을 21세기 Transformer 로 부활.

---

## 이 논문이 뭘 하는 논문인가요?

한 문장으로 말하면:

> **"여러 개 시계열의 미래를 '하나의 정답'이 아니라 '가능한 미래들의 분포'로 예측하는 새 모델. 그 모델 안에서, 보이지 않는 잠재 상태들끼리 서로 attention 으로 연결되어 있다."**

조금 더 풀면:

- 우리가 보는 데이터는 시간에 따라 변하는 여러 개의 숫자 묶음 — 예: 100개 도로의 차량 수, 1000개 가구의 전력 사용량, 17개 관절의 위치.
- 보통 "내일 트래픽이 얼마일까?" 같은 질문에는 **한 개의 숫자** 를 답한다.
- 하지만 진짜 세계에서는 미래가 한 개로 정해지지 않는다 — **여러 가능성과 그 확률** 이 더 정확한 답.
- 이 논문은 그 "가능한 미래의 분포" 를 만들어내는 **확률적 시계열 생성 모델** 을 제안한다.
- 모델 구조: **State-Space Model (SSM)** 의 정신 + **Transformer attention** 의 표현력. RNN(LSTM) 은 일절 쓰지 않는다.
- 결과: 5개 시계열 데이터셋 중 4개에서 1등, 인간 동작 예측에서도 1등. CRPS_sum 기준 SOTA.

---

## "Deep dive" 가 무슨 뜻인가요?

이 해설집은 단순한 논문 요약이 아니다. **수식·영어·전문용어를 못 봐도** 논문의 모든 한 줄이 자기 자리에 들어가도록 풀어놓은 것이 목표.

원칙:
- **수식은 모두 보여준다** (원문 그대로). 하지만 **수식 한 줄 한 줄을 일상 언어로 다시 설명** 한다.
- 처음 보는 기호는 **항상 정의부터** 한다.
- 어려운 개념은 **비유** 로 먼저 설명한 후 정확한 정의로 간다.
- 모든 **Table·Figure 는 "어떻게 읽는가" 부터** 보여주고, 그 다음 의미를 풀어준다.

자, 그러면 ProTran 을 처음 보는 사람이 알아야 할 7가지 개념부터 시작하자.

---

## 미리 알아두면 좋은 개념 (초등학생 버전)

### 1. "시계열(time series)" 이 뭐예요?

**시간 순서대로 측정한 숫자들의 줄**.
- 예: 오늘 09시 차량 100대, 10시 120대, 11시 90대 …
- 이 줄이 하나면 **단변량(univariate)**, 여러 개가 동시에 흐르면 **다변량(multivariate)**.
- 이 논문은 **다변량** 만 다룬다. 1000개 도로의 트래픽이 동시에 흐르는 식.

### 2. "잠재 상태(latent state)" 가 뭐예요?

**보이지 않지만 결과를 결정하는 숨은 변수**.

비유:
- 우리는 도로의 차량 수 (관측값 $x$) 만 본다.
- 하지만 그 뒤에는 "출근 시간대인가? 비가 오는가? 사고가 났는가?" 같은 **숨은 상태** 가 있다.
- 이 숨은 상태가 **잠재 변수 $z$**.
- 모델은 $z$ 를 학습으로 알아내며, $z$ 가 정해지면 $x$ 가 따라 정해진다.

→ **차량 수 자체가 아니라 그 뒤의 "교통 상황 상태"** 를 모델링하는 게 SSM 의 정신.

### 3. "State-Space Model (SSM)" 이 뭐예요?

**잠재 상태 $z$ 와 관측값 $x$ 를 분리해서 모델링하는 통계적 틀**.

두 부분으로 나뉜다:
- **Transition (전이)**: 시간이 흐를 때 $z_{t-1} \to z_t$ 가 어떻게 변하나
- **Emission (방출)**: 잠재 상태 $z_t$ 가 주어지면 관측값 $x_t$ 가 어떻게 나오나

비유 (영화관):
- $z_t$ = "영화의 줄거리 상태" (관객은 못 봄)
- $x_t$ = "스크린에 비친 장면" (관객이 봄)
- Transition = "다음 장면으로 줄거리가 어떻게 흘러가나"
- Emission = "줄거리 상태가 정해지면 어떤 장면이 보이나"

→ 60년 동안 통계학·신호처리·로보틱스에서 표준이 된 틀.

### 4. "Markovian (마코프적)" 이 뭐예요?

**"바로 직전만 기억하고 그 이전은 잊는다"** 는 가정.

- 마코프적: $z_t$ 가 $z_{t-1}$ 만 의존. $z_{t-2}, z_{t-3}, \ldots$ 는 안 봄.
- 비 마코프적(non-Markovian): $z_t$ 가 $z_1, z_2, \ldots, z_{t-1}$ **모두** 의존.

비유 (체스):
- 마코프적 체스 = "지금 판 위의 말 위치만 보고 다음 수 결정"
- 비 마코프적 체스 = "이전 30 수의 흐름까지 보고 다음 수 결정"

→ 진짜 세계는 보통 비 마코프적. ProTran 의 핵심 design 도 비 마코프.

### 5. "Linear Dynamical System (LDS)" 가 뭐예요?

**가장 단순한 SSM** — 모든 전이와 방출이 **직선 함수(linear)** 인 경우.

수식: $z_t = A z_{t-1} + \text{noise}$, $x_t = C z_t + \text{noise}$

- $A, C$ = 행렬 (고정된 직선 변환)
- Kalman filter 라는 알고리즘으로 **정확히 풀린다** (1960 년 Kalman).
- 단점: 너무 단순. 진짜 세계의 곡선·복잡함을 못 잡음.

→ ProTran 의 Figure 1(a) 가 LDS. 비교용 baseline.

### 6. "Variational AutoEncoder (VAE)" 가 뭐예요?

**관측 $x$ 를 잠재 $z$ 의 확률 분포로 압축했다가 다시 펼치는 신경망**.

비유 (요리책):
- AutoEncoder = "음식 사진 → 레시피 → 음식 사진" 의 압축·복원
- VAE 의 차이 = 레시피가 **하나로 고정되지 않고 분포** 임. "이 음식의 레시피는 평균적으로 이렇고, 표준편차 만큼 변형 가능"
- 학습 시에는 두 가지를 동시에 최적화: 복원 정확도 + 분포의 단정함

→ ProTran 은 **시간을 가진 VAE** — 매 시점 $t$ 마다 $z_t$ 가 분포로 추정된다.

### 7. "Attention" 이 뭐예요?

**여러 정보 중 지금 중요한 것에 집중하는 메커니즘**.

비유 (도서관):
- 책 100권이 있는데, 지금 내 질문(Query) "이 트래픽 패턴이 평일인가 주말인가?" 에 답하려면 어떤 책(Key) 이 가장 도움 되나?
- 모든 책에 점수 매김 (softmax) → 점수에 비례해서 책의 내용(Value) 을 섞어서 가져옴.

이것이 Transformer 의 핵심 연산. RNN(LSTM) 처럼 한 줄로 순차 읽지 않고, **모든 정보를 한꺼번에 보고 점수로 가중치 부여**.

→ ProTran 은 **잠재 변수 $z$ 사이에서** attention 을 한다 (관측값 $x$ 가 아니라). 이게 가장 큰 design choice.

### 8. "Probabilistic forecasting (확률적 예측)" 이 뭐예요?

**미래를 한 개 숫자가 아니라 "가능한 값들의 분포" 로 예측**.

비유 (날씨):
- Point forecast = "내일 기온 25도"
- Probabilistic forecast = "내일 기온은 평균 25도, 90% 확률로 22~28도 사이"

→ 실제 의사결정 (재고 관리, 리스크 계산, 자율주행) 에서는 분포가 훨씬 유용.

### 9. "CRPS_sum" 이 뭐예요?

**확률적 예측의 정확도 점수** — 작을수록 좋음.

- 정확하게는 "예측한 누적분포(CDF) 와 실제 관측의 step function 사이 거리의 제곱 적분"
- 한 줄 직관: "내 예측 분포가 실제 값에 얼마나 잘 맞는가" 의 한 숫자 요약
- **Sum** 이 붙은 이유: 모든 변수와 모든 시점에 걸쳐 합산한 multivariate 버전
- ProTran 의 Table 1 에서 사용되는 metric

→ "예측 분포가 정답에 잘 맞으면 점수 낮음, 빗나가면 점수 높음" 의 척도.

### 10. "ADE / FDE" 가 뭐예요?

**동작 예측에서 쓰는 거리 척도** — 둘 다 작을수록 좋음.

- **ADE (Average Displacement Error)**: 예측한 동작 trajectory 와 정답 trajectory 의 평균 거리
- **FDE (Final Displacement Error)**: 마지막 시점에서만의 거리

비유 (등산):
- ADE = "예측 경로와 실제 경로의 평균 거리" — 전체적으로 얼마나 잘 따라갔나
- FDE = "마지막 도착점이 얼마나 어긋났나" — 끝까지 정확한가

→ ProTran 의 Table 3 에서 사용.

---

## 이 해설집 구성

ProTran 의 paper 는 **6개 섹션** 으로 되어 있다 (Introduction → Preliminaries → 본 model → Related work → Experiments → Conclusion). 본 해설집은 17개 챕터로 다음처럼 매핑된다:

| 파일 | 다루는 부분 | 한 줄 요약 |
|------|------------|----------|
| **00** | README | 길잡이 |
| **01** | (이 파일) | 미리 알아둘 10개 개념 |
| **02** | Abstract | 6 문장을 한 문장씩 풀어 읽기 |
| **03** | Section 1 (Introduction) | 4 challenge + 3 contribution |
| **04** | Section 2.1 (Variational SSM) | 잠재 변수 + 변분 추론의 수식 |
| **05** | Section 2.2 (Transformer) | Attention 수식의 자세한 풀이 |
| **06** | Section 3.1 전반 (Generative model) | 단일 layer 의 생성 4 step (Eq 5-9) |
| **07** | Section 3.1 후반 (Inference model) | 학습 시에만 쓰는 inference (Eq 10-11) |
| **08** | Section 3.2 (Multi-layer) | 잠재를 여러 층으로 쌓기 (Eq 12-20) |
| **09** | Section 4 (Related work) | 4 부류의 선행 연구 비교 |
| **10** | Section 5 시작 (Datasets/Baselines) | 7개 데이터셋 + 20개 비교 모델 |
| **11** | Section 5.1 (Forecasting) | Table 1 + Fig 2 + Table 2 — 핵심 결과 |
| **12** | Section 5.2 (Motion) | Table 3 + Fig 3 — 동작 예측 결과 |
| **13** | Section 6 (Conclusion) | 결론 + 한계 |
| **14** | 용어집 | 약어·기호 사전 |
| **15** | 메타 통찰 | 15개 깊은 통찰 |
| **16** | 코드 | PyTorch 단일 layer 구현 |
| **17** | 도식 | ASCII 도식 + viz 카탈로그 |

---

## 이 논문을 읽을 때의 마음가짐

이 논문은 두 갈래로 갈라진다:

```
        ┌─────────────────────┐
        │   Section 1, 2      │  ← 모두 읽어야 함 (배경 + SSM/Transformer 정의)
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌────▼─────┐
   │ Section 3.1│       │ Section 3.2│
   │ Single-layer│       │ Multi-layer│
   │ (필수)    │         │ (확장)    │
   └────┬─────┘         └────┬─────┘
        │                     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Section 5 (실증)   │  ← 결과 확인
        └─────────────────────┘
```

- **시간 없으면**: 01, 02, 03, 06, 11 만 봐도 큰 그림 잡힘.
- **이론 보고 싶으면**: 04, 05, 06, 07 차례로 (수식 풀이).
- **실증 관심**: 10, 11, 12 만 집중.
- **응용 관심**: 15 (메타 통찰) + 16 (코드).

---

## 자기점검 (이 챕터)

### 핵심 5가지

1. **ProTran 이 "RNN 을 안 쓴다" 고 강조하는 이유는?**
2. **잠재 변수 $z$ 와 관측값 $x$ 의 차이는?**
3. **확률적 forecasting 과 point forecasting 의 차이는?**
4. **SSM (Kalman 1960) + Transformer (2017) + VAE (2014) 의 결합 의미?**
5. **ProTran 의 4 lineage 통합 (Deep SSM + Attentive RNN + Time Series + Motion) 의 의의?**

### 답변

1. **RNN(LSTM) 은 한 줄로 순차 읽기 때문에 멀리 떨어진 시점 사이 의존성을 잘 못 잡는다 (gradient vanishing)**. Attention 은 모든 시점을 동시에 보므로 long-range dependency 학습이 훨씬 효과적. ProTran 은 이 한계를 정면 돌파. **2021 시점의 학계 trend**: NLP/CV 에서 Transformer 가 RNN 압도 (BERT, GPT, ViT) → 시계열도 마찬가지일 것이라는 가설. ProTran 이 이를 실증. **부수 효과**: parallel training (RNN 의 sequential bottleneck X) → 학습 시간 ↓.

2. **$x$ = 우리가 측정한 값** (트래픽, 전력, 관절 위치) — 관측 가능. **$z$ = 그 뒤에 숨은 의미** (출근 시간대 여부, 사고 발생 등) — 학습으로 발견. **SSM 은 $z$ 를 모델링해서 $x$ 를 설명**. **Plato 의 동굴 비유**: $x$ = 동굴 벽의 그림자, $z$ = 진짜 객체. 그림자만 보고 진짜 객체 추론. **ProTran 의 묘수**: Attention 을 $x$ 가 아닌 $z$ 에 적용 — 의미 있는 패턴 attention.

3. **Point = 한 개 숫자** ("내일 25도"). **Probabilistic = 분포** ("평균 25도, 90% 구간 22~28"). 실제 의사결정에는 분포가 훨씬 정확. **실무 예**: (i) 수요 예측 시 안전재고 = 99% 분위수 → point 만으론 결품 위험, (ii) 자율주행 보행자 trajectory = multiple plausible paths → point 만 보면 사고 위험, (iii) 발전 계획 = 90% 신뢰구간 → backup 용량. **CRPS_sum 의 의미**: probabilistic forecast 의 정확도 metric.

4. **3 도구의 60년 진화 결합**: **SSM (1960 Kalman)**: 잠재 + 관측의 시계열 모델, 미사일 추적 표준. **VAE (2014 Kingma)**: 잠재 변수 + ELBO 학습, image generation 표준. **Transformer (2017 Vaswani)**: Attention, NLP 표준. **ProTran 의 결합**: SSM 의 잠재 정신 + VAE 의 ELBO 학습 + Transformer 의 attention. **결과**: 각 도구의 강점 + 약점 보완 — SSM 의 Markov 한계 → Transformer 가 해결, VAE 의 단일 latent → SSM 의 sequential latent.

5. **4 lineage 의 통합**: **(i) Deep SSM (Linderman 2017, Krishnan 2017)**: SSM 의 deep 화 — ProTran 의 latent 정신. **(ii) Attentive RNN (DeepAR + attention)**: Attention 시계열 적용 — ProTran 의 attention 정신. **(iii) Time Series Forecasting (TimeGrad 2021)**: probabilistic forecasting — ProTran 의 분포 출력. **(iv) Human Motion Prediction (DLow, MT-VAE)**: 모션 sequence 생성 — ProTran 의 universal 적용. **의의**: 4 lineage 각각의 강점 흡수 + cross-domain (시계열 + 모션) 적용. **연구 패러다임**: single innovation 이 아닌 **통합** 의 가치 — 시계열 ML 의 architectural universality 입증.

자, 그러면 **02 번 파일** 로 가서 논문의 초록부터 만나보자.
