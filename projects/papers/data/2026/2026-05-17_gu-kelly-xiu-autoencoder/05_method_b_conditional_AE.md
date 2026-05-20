# 05b. Section 2.2 — Conditional Autoencoder (메인 모델)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **본 논문이 제안하는 모델 (conditional autoencoder, CA) 의 정확한 구조** — 두 신경망 (β, f) + dot product
- **β 네트워크와 f 네트워크가 각각 뭘 하는지** — 학생 약점 진단 vs 시험 난이도 추정
- **No-arbitrage 가 어떻게 강제되는지** — 모델 아키텍처에서 α 를 빼는 디자인
- CA0, CA1, CA2, CA3 의 정확한 차이 (β 네트워크 깊이만)

---

이 챕터가 본 논문의 **심장**. 두 개의 신경망 + dot product 로 구성된 conditional autoencoder.

---

## 5b.1 동기 — 표준 AE 의 한계

> **원문**: "While the standard autoencoder in (5) is a powerful tool for dimension reduction, it shares the same limitation as PCA that it does not leverage conditioning variables to identify the factor structure, and instead relies only on returns themselves."

**핵심 문제**:
- 표준 AE: 수익률 $r$ 만 입력. 자산 특성 $z$ 무시.
- KPS (IPCA): $z$ 활용 ✓, 하지만 선형 $\beta = z'\Gamma$.
- **본 논문**: $z$ 활용 + **비선형** 매핑.

해결 방향: **autoencoder 구조에 두 입력 경로 (returns + characteristics)** 를 두자.

---

## 5b.2 큰 구조 — 두 개의 분리된 신경망

본 논문이 제안하는 conditional autoencoder 는 다음 **두 신경망의 dot product**:

```
                     ┌─────────────────┐
                     │   Beta Network  │
   z_{i,t-1}  ─→     │  (NN of chars)  │ ─→   β_{i,t-1}   (N×K)
   (N×P)             └─────────────────┘                ↘
                                                          dot
                                                         product
                                                        ↗ r̂_{i,t} = β'_{i,t-1} f_t
                     ┌─────────────────┐
                     │  Factor Network │
   r_t       ─→      │   (Autoencoder  │ ─→     f_t      (K×1)
   (N×1)             │   of returns)   │
                     └─────────────────┘
```

**핵심 통찰**:
- **좌측 (Beta network)**: 자산 특성 $z$ → 노출도 $\beta$ 의 비선형 매핑
- **우측 (Factor network)**: 자산 수익률 $r$ → 잠재요인 $f$ 의 autoencoder
- **결합**: $r \approx \beta' f$ (요인 모델 형태 유지)

**No-arbitrage 보존**: 절편 $\alpha$ 없음. $r$ 가 오직 $\beta' f$ 로만 설명.

---

## 5b.3 모델의 최상위 식

Section 2.2 의 시작 (Eq. 9):

$$
r_{i,t} = \beta_{i,t-1}' f_t + u_{i,t} \quad \text{(Eq. 9)}
$$

### 🔣 식이 말하는 것 한 줄

"수익률 = 노출도 × 요인 + 잡음" — **KPS 와 같은 형태**, 다른 건 β 와 f 를 신경망으로 만들었다는 점.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\beta_{i,t-1}$ | 자산 $i$ 시점 $t-1$ 노출도 | "이 학생 시점 $t-1$ 의 과목별 약점" | **본 논문**: $\beta = \text{NN}(z)$ — 비선형 신경망 |
| $f_t$ | 시점 $t$ 잠재요인 | "시점 $t$ 의 시험별 난이도" | **본 논문**: $f = W_1 x_t$ — **단일 선형층** (신경망 아님!) |
| $\beta' f$ | dot product | "약점 × 난이도 합" | 절편 $\alpha$ 없음 → **no-arbitrage 자동 강제** |
| $u_{i,t}$ | 잔차 | "학생 컨디션·우연" | $f_t$ 와 무상관 가정 |

### 🌱 KPS 와 비교

| | KPS (IPCA) | 본 논문 (CA1+) |
|---|------------|----------------|
| 형태 | $r = \beta' f + u$ | $r = \beta' f + u$ (**같음**) |
| $\beta$ 정의 | $\beta = \Gamma' z$ (선형) | $\beta = \text{NN}(z)$ (**비선형**) |
| $f$ 정의 | latent (직접 추정) | $f = W_1 x_t$ (managed portfolio 의 선형 변환) |
| no-arbitrage | 자동 | 자동 (둘 다 α=0) |

→ **선형 한 군데만 신경망으로**. 나머지는 그대로.

---

## 5b.4 Fig. 2 — Conditional Autoencoder 도식

![Fig. 2 — Conditional autoencoder 구조](figures/page5_Fig2_conditional_AE.png)

*journal p.433 Fig. 2 발췌 — 본 논문의 핵심 그림. 좌측 (beta network) + 우측 (factor network) + 가운데 dot product 결합.*

### 📖 처음 보는 사람을 위한 — Fig. 2 읽는 법

**한 줄로**: "두 개의 신경망이 따로 일하고, 마지막에 만나서 곱하면 주가 예측이 나온다."

**그림 안에 뭐가 있나 — 4 부분만 보면 됨**:

| 위치 | 색 | 무엇 | 일상 비유 |
|------|-----|------|-----------|
| **좌측 위** (노랑) | 노란 격자 | 자산 특성 $Z$ — "이 회사의 size, 모멘텀, ..." | 학생 신상카드 (수강과목·출석률·과외 여부) |
| **좌측 아래** (녹색) | 녹색 점들 + 화살표 | **β 신경망** — 특성을 노출도로 변환 | "학생 신상 → 약점 진단" 변환기 |
| **우측 아래** (파랑) | 파란 점들 | **f 신경망** — 수익률에서 잠재요인 추출 | "오늘 시험 점수표 → 시험별 난이도 추정" 변환기 |
| **가운데 위** | 보라/오렌지 | **dot product** — β · f 결합 | "약점 × 난이도 = 점수 변동" 계산기 |

**왜 두 네트워크인가?**
- 학생 약점은 **학생 정보** (β) 에서, 시험 난이도는 **점수 데이터** (f) 에서 따로 추정해야 의미가 살아남.
- 한 네트워크로 다 하려고 하면 둘이 섞여서 해석 못 함.

**그림에서 알아낼 것 3가지**:
1. **β 네트워크 (좌측)** 는 자산 특성 → 노출도. 본 논문이 신경망 (비선형) 으로 푼 부분.
2. **f 네트워크 (우측)** 는 수익률 → 요인. 단일 선형층 (paper p.6, $L_f = 1$). **여기는 신경망이 아님**.
3. **가운데 dot product** 는 두 출력을 곱해 예측 수익률 생성. **여기서 α (절편) 가 없는 게 핵심** — no-arbitrage 강제.

**놓치기 쉬운 한 가지**: f 네트워크는 신경망 형태로 그려져 있지만 **사실상 선형회귀 한 줄**. CA0, CA1, CA2, CA3 의 차이는 **β 네트워크의 깊이** 한 군데만 (CA0: 0층, CA1: 1층, CA2: 2층, CA3: 3층).

### 📖 처음 보는 사람을 위한 — Fig. 2 의 색 시그널 정밀 풀이

paper Fig. 2 의 색깔 의미가 처음 보면 헷갈리기 때문에 한 번 더 정리:

| 색 | 그림에서의 위치 | 의미 | 차원 |
|-----|----------------|------|------|
| **노란 격자 (좌측 위)** | β-net 입력 | $Z_{t-1}$ — 모든 자산의 특성 행렬 | $N \times P$ (예: 6,200 × 94) |
| **녹색 (좌측 hidden)** | β-net 은닉층 | ReLU activation 통과한 표현 | $N \times \text{hidden}$ (예: 6,200 × 32) |
| **녹색 (좌측 출력)** | β-net 출력 | $\beta_{t-1}$ — 모든 자산의 노출도 | $N \times K$ (예: 6,200 × 5) |
| **분홍 (우측 위, 작은)** | f-net 입력 (옵션 b) | $x_t$ — managed portfolio (Eq 16) | $P \times 1$ (예: 94) |
| **빨강 (우측 위, 큰)** | f-net 입력 (옵션 a) | $r_t$ — 개별 자산 수익률 | $N \times 1$ |
| **파란 (우측 hidden)** | f-net 은닉층 | autoencoder bottleneck | $K \times 1$ |
| **보라 (우측 출력)** | f-net 출력 | $f_t$ — 잠재 요인 | $K \times 1$ (예: 5) |
| **오렌지 (가운데)** | dot product 연산 | $\beta'_{t-1} f_t = \hat r_t$ | $N \times 1$ |

### 🔍 Fig. 2 와 본문 Eq. 의 정확한 매핑

| Fig 2 부분 | 본문 식 | 챕터 위치 |
|------------|---------|-----------|
| 좌측 β-net (z → β) | Eq. 10-12 (β = NN(z)) | [5b.5](#5b-5-beta-network-의-수학-eq-10-12) |
| 우측 f-net (r/x → f) | Eq. 13-15 (f = W₁ x, L_f=1) | [5b.6](#5b-6-factor-network-의-수학-eq-13-15) |
| 가운데 dot product | Eq. 9 (r = β'f + u) | [5b.3](#5b-3-모델의-최상위-식) |
| f-net 입력 $x_t$ | Eq. 16 (managed portfolio) | [5b.9](#5b-9-eq-16-managed-portfolio-inputs) |

### 🌱 Fig. 2 를 한 문장으로

> "**왼쪽 신경망이 학생 신상을 약점으로 변환**, **오른쪽 신경망(사실은 선형 한 줄)이 오늘 시험 점수를 시험별 난이도로 추정**, **가운데서 약점 × 난이도 = 학생 점수 예측**."

### 🆚 Fig. 1 (standard AE) 와의 핵심 차이

| | Fig 1 (Standard AE) | Fig 2 (Conditional AE) |
|---|----------------------|--------------------------|
| 신경망 수 | 1 (encoder + decoder 단일) | **2 (β-net + f-net)** |
| 자산 특성 z | ✗ 사용 안 함 | **✓ β-net 입력** |
| 출력 | 입력 자체 복원 (r → r̂) | 예측 수익률 (β · f → r̂) |
| 한계 | covariates 무시 | (없음 — 본 논문 최종 모델) |

---

**그림 부분별 정밀 해석**:

### 좌측 (Beta network, $N \times K$ 노출도)
- **입력**: $Z_{t-1}$ ($N \times P$, 노란색) — 모든 자산의 특성
- **Hidden layer(s)**: 녹색 — 비선형 변환 (ReLU)
- **출력**: $\beta_{t-1}$ ($N \times K$, 녹색) — 모든 자산의 노출도

### 우측 (Factor network, $K \times 1$ 요인)
- **입력 두 가지** (둘 중 선택):
  - **(P×1)**: $x_t$ — 특성-management 포트폴리오 (분홍, 작은 차원)
  - **(N×1)**: $r_t$ — 개별 자산 수익률 (빨강, 큰 차원)
- **Hidden layer(s)**: 파란 — autoencoder bottleneck
- **출력**: $f_t$ ($K \times 1$, 보라) — 잠재요인

### 가운데 (Dot product)
- $r_{i,t} = \beta_{i,t-1}' f_t + u_{i,t}$ — 두 출력의 dot product

---

## 5b.5 Beta network 의 수학 (Eq. 10–12)

> **원문**: "The first key difference between our model and IPCA is in the formulation of conditional betas. We specify the $K \times 1$ vector $\beta_{i,t-1}$ as a neural network model of lagged firm characteristics, $z_{i,t-1}$."

$$
z_{i,t-1}^{(0)} = z_{i,t-1} \quad \text{(Eq. 10)}
$$

$$
z_{i,t-1}^{(l)} = g\left(b^{(l-1)} + W^{(l-1)} z_{i,t-1}^{(l-1)}\right), \quad l = 1, \ldots, L_\beta \quad \text{(Eq. 11)}
$$

$$
\beta_{i,t-1} = b^{(L_\beta)} + W^{(L_\beta)} z_{i,t-1}^{(L_\beta)} \quad \text{(Eq. 12)}
$$

### 🔣 식이 말하는 것 한 줄

"94 항 신상 (z) 을 여러 단계로 변환하면서 점차 5 항목 약점 (β) 으로 압축". 각 단계마다 ReLU 라는 비선형 필터.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $z_{i,t-1}^{(0)}$ | 입력 (94 차원 특성) | "학생 신상 카드" | 시점 $t-1$ 기준 |
| $z_{i,t-1}^{(l)}$ | $l$ 번째 hidden layer 출력 | "약점 추정 중간 단계 $l$" | 점차 압축됨 |
| $W^{(l-1)}, b^{(l-1)}$ | 각 층의 weight + bias | "이 단계에서 어떻게 섞을지" 의 규칙 | 학습으로 결정 |
| $g(\cdot)$ | ReLU 활성화 = max(y, 0) | "음수면 0, 양수면 그대로 통과" 필터 | **비선형성의 원천**. 없으면 선형 |
| $L_\beta$ | hidden layer 수 | "변환 단계 깊이" | CA0=0, CA1=1, CA2=2, CA3=3 |
| **마지막 layer 만 linear** | 활성화 없는 마지막 변환 | "최종 약점은 음수도 가능 (saturation 안 됨)" | 노출도가 - 도 가능해야 함 |

### 🌱 일상 비유 — "약점 진단의 다단계 필터"

비선형 NN 이 학생 약점을 진단하는 과정:

```
   학생 신상 94 항
        │
        ▼  Layer 1: "학습 패턴 추출" (예: '꾸준한가 vs 벼락치기')
        │         ↓ ReLU: "음수면 0 으로" (강한 패턴만 살림)
        ▼
   추상 표현 (32 차원)
        │
        ▼  Layer 2 (CA2+): "패턴 간 상호작용" (예: '벼락치기 + 야간형')
        │         ↓ ReLU
        ▼
   ...
        │
        ▼  마지막 Layer (선형): "5 과목 약점으로 압축"
        │         (활성화 없음 — 약점은 부호 자유)
        ▼
   β (5 차원) = 학생의 5 과목 약점
```

**왜 마지막만 선형?** 노출도 (약점) 는 + 든 − 든 가능해야 함. ReLU 가 마지막에 있으면 음수 노출도를 못 만듬.

**왜 ReLU 가 중간에?** 비선형성의 원천. 없으면 여러 단계 거쳐도 결국 한 선형 변환 → 그냥 PCA.

**일상 비유**: 학생 특성 (학습 시간·성격·과외 여부 등) 을 여러 단계의 "필터" 로 통과시키면서 점점 "약점" 표현으로 변환.
- Layer 1: "학습 패턴" 추출
- Layer 2: "학습 패턴 × 시험 유형" 상호작용
- Layer L: 최종 "과목별 약점"

**왜 이 형태**:
- 다층 + 비선형 ReLU → 특성 간 상호작용·threshold 효과·saturation 다 표현
- 마지막 layer linear → 노출도의 부호·크기에 제약 없음
- 자산별 $i$ 가 같은 가중치 공유 (모든 자산이 같은 NN 사용) → 자산 간 정보 공유 + 부족한 데이터 보강

**조심할 점**:
- 한 자산만 보는 게 아니라 **모든 자산** 의 같은 시점 특성 동시에 입력 → 자산 간 비교가 노출도에 반영
- $L_\beta = 0$ (no hidden layer, linear) → IPCA 와 동치 (Eq. 2)
- $L_\beta \ge 1$ → 비선형 → 본 논문의 진짜 차별점

---

## 5b.6 Factor network 의 수학 (Eq. 13–15)

> **원문**: "On the right side of Fig. 2, we see an otherwise standard autoencoder for the factor specification."

$$
r_t^{(0)} = r_t \quad \text{(Eq. 13)}
$$

$$
r_t^{(l)} = \tilde g\left(\tilde b^{(l-1)} + \tilde W^{(l-1)} r_t^{(l-1)}\right), \quad l = 1, \ldots, L_f \quad \text{(Eq. 14)}
$$

$$
f_t = \tilde b^{(L_f)} + \tilde W^{(L_f)} r_t^{(L_f)} \quad \text{(Eq. 15)}
$$

### 🔣 식이 말하는 것 한 줄

"수익률 (또는 managed portfolio $x_t$) 을 여러 단계로 변환해 K 차원 잠재 요인 $f_t$ 산출". β-network 와 똑같은 일반 NN 형식이지만 **본 논문은 $L_f = 1$ 로 고정** (선형 한 층).

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $r_t^{(0)}$ | 입력 (수익률 또는 $x_t$) | "오늘 시험 점수표" | 본 논문은 $x_t$ 사용 (Eq 16) |
| $r_t^{(l)}$ | $l$ 번째 layer 출력 | "변환 중간 단계" | $L_f = 1$ 이면 사실 사용 안 됨 |
| $\tilde W^{(l-1)}, \tilde b^{(l-1)}$ | factor network 의 weight + bias | "변환 규칙" | **β-network 와 분리된 가중치** ($\tilde{}$ 표시) |
| $\tilde g(\cdot)$ | factor network activation | "비선형 필터" | **$L_f = 1$ 일 땐 identity (선형)** |
| $L_f$ | factor network hidden layer 수 | "변환 깊이" | **본 논문 = 1** (모든 CA0~CA3 동일) |
| $f_t$ | 잠재 요인 ($K \times 1$) | "오늘 시험 난이도 5 항목" | 다른 자산 공유 |

### 🌱 한 줄 결론

"식 자체는 일반 NN 이지만 **본 논문은 $L_f = 1$ 로 선형 강제** → 사실상 한 줄 식 $f_t = \tilde b + \tilde W x_t$". 이 단순화의 이유는 아래 5b.6 "왜 factor network 는 선형?" 에서 풀이.

**기호 뜻**:
- $r_t^{(l)}$ — factor network 의 layer $l$ 출력
- $L_f$ — factor network 의 hidden layer 수
- $\tilde W, \tilde b$ — factor network 의 weight + bias (beta network 와 별도)
- $\tilde g$ — activation (본 논문은 $L_f = 1$ 가정 → linear)
- $f_t$ — $K \times 1$ 요인 (시점 $t$)

**중요한 단순화**:
> **원문**: "Throughout our empirical analysis, we assume a single linear layer on the factor network, that is, $L_f = 1$, in that this structure maintains the economic interpretation of factors: they are themselves portfolios (linear combination of underlying asset returns)."

→ Factor network 는 **선형 1 layer**. 즉 $f_t = \tilde b + \tilde W r_t$. 비선형 안 함.

**왜 factor network 는 선형?**:
- 요인 = 자산 수익률의 **선형결합** (portfolio) 이 자산가격이론 의 정의
- 비선형 매핑은 "이 자산을 0.3, 저 자산을 0.5 가중평균" 같은 portfolio 해석 어렵게 함
- **경제적 해석성** 유지 위해 선형 강제

---

## 5b.7 결합 — Dot Product Layer

> **원문**: "At last, the 'dotted operation' multiplies the $N \times K$ matrix output from the beta network with the $K \times 1$ output from the factor network to produce the final model fit for each individual asset return."

$$
\hat r_{i,t} = \beta_{i,t-1}' f_t \quad \text{(자산 i 시점 t 모델 fit)}
$$

또는 모든 자산 모음:
$$
\hat r_t = \beta_{t-1} f_t \quad (N \times 1)
$$

**일상 비유**: 학생 약점 (beta) × 시험 난이도 (factor) → 점수 변동 (return).

**손실 함수**:
$$
\mathcal{L} = \frac{1}{NT} \sum_{i, t} \| r_{i,t} - \beta_{i,t-1}' f_t \|^2 + \phi(\theta; \lambda) \quad \text{(Eq. 19, 정규화 포함)}
$$

→ 두 네트워크의 모든 weights ($W^{(l)}, b^{(l)}, \tilde W^{(l)}, \tilde b^{(l)}$) 가 함께 학습됨.

---

## 5b.8 Factor network 의 두 가지 입력 옵션

본 논문은 factor network 의 입력으로 두 가지 선택:

### (a) Individual returns $r_t$ (Fig. 2 빨강)
- $r_t \in \mathbb{R}^{N \times 1}$, $N \approx 30,000$
- 직관적이지만 계산 무겁고 panel 불균형 (매월 다른 stocks 활성)

### (b) Managed portfolios $x_t$ (Fig. 2 분홍)
- $x_t \in \mathbb{R}^{P \times 1}$, $P = 94$ (특성 수)
- $x_t = (Z_{t-1}' Z_{t-1})^{-1} Z_{t-1}' r_t$ ← Eq. 16
- 본 논문 실증에서 **(b) 선택** (계산 효율)

---

## 5b.9 Eq. 16 — Managed Portfolio Inputs

> **원문**: "In practice, using the full cross section of individual stock returns in the factor network faces two daunting obstacles. The first is that the number of individual firms in our sample is roughly 30,000, which means that the number of weight parameters in the factor network can be astronomical."

**해결**: 개별 수익률 대신 **characteristic-managed portfolios** 사용.

$$
x_t = (Z_{t-1}' Z_{t-1})^{-1} Z_{t-1}' r_t \quad \text{(Eq. 16)}
$$

### 🔣 식이 말하는 것 한 줄

"30,000 개별 주식 대신 **94 개 특성-가중 포트폴리오** 의 수익률을 입력으로 쓴다". 차원이 30,000 → 94 로 줄어 학습 효율 ↑, 안정성 ↑.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $Z_{t-1}$ | 특성 행렬 ($N \times P$) | "모든 학생의 신상카드 모음" | 매월 N 변동 (4000~8000) |
| $r_t$ | 수익률 벡터 ($N \times 1$) | "오늘 모든 학생 점수" | 매월 다른 N |
| $(Z'Z)^{-1} Z' r$ | OLS regression coefficient | "수익률을 특성에 회귀한 계수" | 표준 cross-sectional regression 결과 |
| $x_t$ | managed portfolio ($P \times 1$) | "각 특성으로 만든 long-short 펀드 의 오늘 수익" | **항상 P=94**, 시점 무관 |

### 🌱 일상 비유로 한 번 더

"개별 학생 30,000 명 점수 → 학년별·성적별로 그룹 → 그룹 평균 점수만 신경망 입력".

직접 비유:
- $x_t^{(\text{size})}$ = "시가총액 기준 long-short portfolio 의 오늘 수익률" — 즉 "큰 회사 매수 + 작은 회사 매도" 의 결과
- $x_t^{(\text{mom1m})}$ = "1개월 모멘텀 기준 long-short portfolio" — "최근 상승주 매수 + 하락주 매도"
- ...94 개 portfolio 의 오늘 수익률 벡터 = $x_t$

**왜 이 형태가 좋은가?**
1. **차원**: 30,000 → 94 (320배 감소). 신경망 weight 수 비례 감소.
2. **안정성**: 매월 N 변동 → 항상 P=94 고정.
3. **해석성**: 각 $x_t^{(j)}$ 가 "j 특성 anomaly factor" 와 정확히 매핑.

**왜 이 형태**:
1. **차원 축소**: $N=30,000 \to P=94$. weight 수가 30,000 → 94 로 줄어듦.
2. **불균형 해결**: 매월 다른 자산 → managed portfolio 는 항상 P=94.
3. **선례**: KPS, Feng·He·Polson·Xu (2019), Kozak·Nagel·Santosh (2017), Giglio·Xiu (2018) 모두 이 트릭 사용.

**조심할 점**:
- $x_t$ 사용 시 conditional autoencoder 는 사실상 IPCA family 의 부분집합
- 단 beta network 의 비선형성은 그대로 유지

---

## 5b.10 모델 변형 — CA0 ~ CA3

논문에서 비교하는 4가지 conditional autoencoder 변형:

| 모델 | $L_\beta$ (beta NN 깊이) | Beta network 뉴런 수 | Factor network |
|------|------|------|------|
| **CA0** | 0 | (linear, no hidden) | linear, $L_f = 1$ |
| **CA1** | 1 | 32 | linear, $L_f = 1$ |
| **CA2** | 2 | 32, 16 | linear, $L_f = 1$ |
| **CA3** | 3 | 32, 16, 8 | linear, $L_f = 1$ |

**CA0** = linear beta + linear factor → **사실상 IPCA** (proposition 2)

**CA1~CA3** = 깊이 다른 비선형 → 본 논문의 진짜 모델

→ 깊이 1 (CA1) 이 보통 가장 좋음. 깊이 늘려도 큰 개선 X (overfitting).

---

## 5b.11 자기점검 (이 챕터)

### 핵심 3가지
1. **Conditional autoencoder 가 두 신경망 + dot product 인 이유는?**
2. **Beta network 와 Factor network 의 차이는?**
3. **Eq. 16 의 managed portfolio 트릭이 해결하는 두 문제는?**

### 답변

1. **두 신경망 + dot product 의 3 가지 이유**:
   - **(i) 비선형 매핑 필요**: 노출도 $\beta$ 는 자산 특성 $z$ 의 함수 — 본 논문 핵심 차별점이 "선형 한정 → 비선형" 이라 NN 필요.
   - **(ii) 경제적 해석성 유지**: 요인 $f$ 는 자산 수익률의 **portfolio (선형 결합)** 이라는 자산가격 정의에 부합. 그래서 f-network 는 단일 선형 ($L_f=1$).
   - **(iii) No-arbitrage 자동 강제**: dot product 결합으로 $r = \beta'f + u$ 형태 유지 → 절편 $\alpha$ 없음 → 모든 기대수익이 위험 보상 만으로 설명됨.
   - 결합 시너지: 비선형 노출도 + 선형 요인 + 이론 제약 = ML × 경제이론 통합.

2. **β-network vs f-network 의 정확한 차이**:
   | | **β network** | **f network** |
   |---|---------------|---------------|
   | 입력 | $z$ ($N \times P$, 94 특성) | $r$ ($N$ 차원) 또는 $x_t$ ($P$ 차원, managed portfolio) |
   | 깊이 | $L_\beta = 0, 1, 2, 3$ (CA0~CA3) | $L_f = 1$ **고정** (모든 CA) |
   | 활성화 | ReLU (hidden layers) + linear (마지막) | **없음** (모든 layer linear) |
   | 출력 | $\beta$ ($N \times K$, 자산별 노출도) | $f$ ($K \times 1$, 시점 요인) |
   | 경제적 의미 | "특성 → 위험 노출도 비선형 매핑" | "수익률 → 잠재 요인 (portfolio) 선형 변환" |

3. **Eq. 16 (managed portfolio) 가 해결하는 2 문제**:
   - **(a) 모수 폭발 방지**: 직접 $r_t$ (N=30,000 자산) 를 f-network 입력으로 두면 weight = 30,000 × K = 150,000 개 (K=5). 학습 불가능.
     - 대신 $x_t = (Z'Z)^{-1}Z'r_t$ 로 압축 → P=94 차원 → weight 94 × 5 = 470 개. **320 배 감소**.
   - **(b) 불균형 패널 해소**: 매월 자산 수 변동 (4,000~8,000) → 일관된 NN 입력 불가능.
     - $x_t$ 는 **항상 P=94 차원 고정** → 시점 무관 안정.
   - **추가 효과**: 각 $x_t^{(j)}$ 가 "특성 $j$ 의 long-short portfolio 수익" 으로 직관적 해석 가능 (예: $x_t^{\text{size}}$ = 작은 회사 매수 + 큰 회사 매도 의 그달 수익).

다음 [05_method_c_IPCA_special.md](05_method_c_IPCA_special.md) — IPCA 가 본 모델의 특수 케이스.
