# 05_method_a_intuition — 방법론 전체 구조 (큰 그림)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- MASTER 의 **5단계 파이프라인** 전체 구조 (입력 → 출력)
- 입력 텐서 모양 $(N, T, F)$ 와 시장 벡터 $m_\tau$ 의 의미
- "Intra → Inter" 순서의 설계 근거 (왜 역순은 안 되는가)
- "Local Embedding as Relay" 의 핵심 직관
- 다음 4개 챕터 ([gating, intra-inter, temporal, experiments]) 가 어떻게 연결되는가

---

> **배경 사다리**: ① **텐서(Tensor)** = 다차원 배열. $(N, T, F)$ 텐서는 N개 종목 × T개 시간 단계 × F개 특징으로 이루어진 3D 배열. 직관: "Excel 표가 여러 장 쌓인 큐브". ② **임베딩(Embedding)** = 원본 데이터를 고차원 실수 벡터로 변환한 표현. 학습 가능한 "벡터 사전". ③ **게이팅(Gating)** = 일부 정보만 통과시키는 필터; 값이 0이면 차단, 1이면 전부 통과. 신경망의 attention/skip 연결의 친척. ④ **어텐션(Attention)** = 데이터의 어느 부분이 중요한지 학습된 가중치로 골라내는 메커니즘. 이 네 개념으로 전체 파이프라인을 따라갈 수 있다.

### 🌱 MASTER 전체 — 일상 비유

**한 줄로**: "300명 학생의 8일 일기를 모아 → 시장 분위기로 어떤 페이지가 중요한지 표시 → 학생별 정리 → 학생간 공유 → 오늘 시점 요약 → 내일 시험 점수 예측".

| MASTER 단계 | 일상 비유 |
|------------|-----------|
| 게이팅 | 선생님이 "오늘은 수학 챕터가 중요!" 라고 알려줘서 그 부분만 형광펜으로 칠함 |
| Intra-Stock | 각 학생이 자기 일주일 일기를 보고 핵심 요약 |
| Inter-Stock | 학생들끼리 서로의 요약본 보면서 보충 (친구 정보 흡수) |
| Temporal Agg | 오늘날 입장에서 "어느 날 내용이 가장 중요했지?" 라고 묻고 한줄로 압축 |
| Prediction | 압축된 한줄 → 내일 점수 예측 |

**핵심 differentiator vs 기존**: 시장 정보 $m_\tau$가 게이팅 단계에서 158개 팩터 중요도를 동적으로 조절. 이게 "Market-Guided" 라는 이름의 출처.

### 🌱 두 번째 비유 — 식당의 5단계 요리

같은 재료 (158 알파 팩터) 로 매일 다른 요리:

| 단계 | 요리 비유 |
|------|----------|
| Step 1: 게이팅 | 셰프가 오늘 메뉴 결정 → 158개 식재료 중 어느 게 메인일지 가중치 |
| Step 2: Intra | 각 종목별 (각 식재료별) 시간 발효 — 8일치 변화 통합 |
| Step 3: Inter | 식재료들끼리 섞기 — 종목간 상호작용 반영 |
| Step 4: Temporal | "오늘 손님 (예측) 입장에서 무엇이 가장 맛있을까" 으로 양념 |
| Step 5: Prediction | 최종 요리 (예측 스코어) |

---

## 1. 전체 파이프라인 조감도

### 1.1 입력 두 종류

MASTER의 입력은 다음 **두 종류**:

#### A. 종목 데이터 — $X \in \mathbb{R}^{N \times T \times F}$

| 차원 | 의미 | 값 | 직관 |
|------|------|-----|------|
| $N$ | 종목 수 | CSI300: ≈300, CSI800: ≈800 | "교실의 학생 수" |
| $T$ | lookback 창 길이 | **8 거래일** (약 1.5~2주) | "각 학생의 일기 페이지 수" |
| $F$ | 특징 수 | **222** = Alpha158 (158) + 시장 특징 (63) + 레이블 (1) | "각 일기 페이지의 정보 항목 수" |

**실제 모델 입력으로 쓰이는 팩터**: **158개 Alpha158 팩터** (이것만 게이팅 + attention 입력). 나머지 (시장 63, 레이블 1) 는 후처리로 분리.

#### B. 시장 정보 — $m_\tau \in \mathbb{R}^{D_m}$, $D_m = 63$

- 중국 3대 지수(CSI300, CSI500, CSI800) 각각에 대해:
  - 현재일 수익률
  - 5, 10, 20, 30, 60일 rolling 평균 수익률 및 표준편차
  - 같은 window 의 거래량 통계
- 예측 시각 $\tau$ 기준의 **시장 "온도"** 를 요약한 63차원 벡터

### 1.2 출력

각 종목의 **5거래일 뒤 수익률 예측값** $s \in \mathbb{R}^N$ 로, 이를 내림차순 정렬해 포트폴리오 구성.

### 🔣 입출력 4-단 풀이

| 기호 | 의미 | 차원 | 직관 |
|------|------|------|------|
| $X$ | 종목 데이터 텐서 | $(N, T, F)$ | "교실 학생 N명의 T일치 F개 정보" |
| $m_\tau$ | 시장 벡터 | $(D_m,)$ | "시점 $\tau$ 의 시장 분위기" |
| $s$ | 예측 스코어 | $(N,)$ | "각 종목의 5일 후 수익률 예측" |
| rank(s) | 순위화 | $(N,)$ | "상위 $k$ % 매수 후보" |

---

## 2. 5단계 파이프라인 (정밀)

```
입력: X (N × T × F),  m_τ (D_m)
  │
  ▼
[단계 1] 시장 유도 게이팅 (Market-Guided Gating)
  │     m_τ (63) → W_g → ℓ (158) → softmax(ℓ/β)·F → g ∈ ℝ^F
  │     X̂ = X ⊙ g  (특징 재가중치)
  ▼  X̂ ∈ ℝ^(N × T × F)
  
[단계 1.5] 선형 투영 (Linear Projection)
  │     X̂ ∈ ℝ^(N × T × F) → X̃ ∈ ℝ^(N × T × d)
  │     d = hidden dim (~128 추정)
  ▼  X̃ ∈ ℝ^(N × T × d)

[단계 2] 주내 집계 (Intra-Stock Aggregation)
  │     각 종목 n 에 대해, T×T self-attention
  │     H_n = MultiHeadAttn(X̃_n, X̃_n, X̃_n) ∈ ℝ^(T × d)
  ▼  H ∈ ℝ^(N × T × d)

[단계 3] 주간 집계 (Inter-Stock Aggregation)
  │     각 시각 t 에 대해, N×N cross-stock attention
  │     Z_{n,t} = MultiHeadAttn(H_{n,t}, H_{:,t}, H_{:,t})
  ▼  Z ∈ ℝ^(N × T × d)

[단계 4] 시간 집계 (Temporal Aggregation)
  │     각 종목의 마지막 시각 임베딩이 전체 T 개 임베딩 쿼리
  │     e_n = Attn(Z_{n,T}, Z_{n,:}, Z_{n,:}) ∈ ℝ^d
  ▼  e ∈ ℝ^(N × d)

[단계 5] 예측 (Prediction)
        s_n = W_p e_n + b_p  →  s ∈ ℝ^N
        순위화 → top-k% 포트폴리오
```

### 🔣 데이터 흐름 치수 추적 (정밀)

| 단계 | 입력 | 출력 | 변환 |
|------|------|------|------|
| 게이팅 | $(N, T, F)$ + $m_\tau (D_m)$ | $(N, T, F)$ | Element-wise multiplication |
| 선형 투영 | $(N, T, F)$ | $(N, T, d)$ | Linear: $F \to d$ |
| Intra | $(N, T, d)$ | $(N, T, d)$ | MultiHead Self-Attn, 각 종목 독립 |
| Inter | $(N, T, d)$ | $(N, T, d)$ | MultiHead Attn, 각 시점 별 |
| 시간집계 | $(N, T, d)$ | $(N, d)$ | Attention with Query = $Z_{n,T}$ |
| 예측 | $(N, d)$ | $(N,)$ | Linear: $d \to 1$ |

**병목 단계**: 시간집계가 $T$ 차원 제거 → 정보 압축 단계.

---

## 3. 왜 이 순서인가: 설계 직관

### 3.1 "Intra 먼저, Inter 나중" 의 두 이유

#### 이유 1 — 어텐션 필드 크기의 위계

| 어텐션 | 어텐션 행렬 크기 | 메모리 |
|--------|----------------|--------|
| Intra-stock | $T \times T = 8 \times 8 = 64$ 쌍 | 작음 |
| Inter-stock | $N \times N = 300 \times 300 = 90,000$ 쌍 (CSI300) | 중간 |
| 단일 $(N \cdot T) \times (N \cdot T)$ | $2400^2 = 5,760,000$ 쌍 | **계산 불가** |

→ 더 작고 관리하기 쉬운 intra 를 먼저 해결. 이렇게 만들어진 지역 임베딩 $H$ 는 이미 각 종목의 시간 패턴을 압축했으므로, 이후 inter-stock 어텐션의 **입력 질 ↑**.

#### 이유 2 — 분포의 단순성

- 단일 종목 내 $T = 8$ 시간 단계의 상관관계 분포 (예: 추세, 역전) 는 **종목 간 상관관계** 분포보다 구조가 단순하고 예측 가능.
- Self-attention 이 더 안정적으로 수렴.

#### 이유 3 — Cross-Time Relay 의 가능성

가장 중요한 이유 → **다음 절에서 상세**.

### 3.2 대안과의 비교

| 설계 | 문제점 |
|------|--------|
| 단일 $(N \cdot T) \times (N \cdot T)$ 어텐션 | $5.76$ M 쌍, 계산 불가 |
| Inter → Intra (역순) | 종목 간 정보 교환이 "날것" 특징에서 이루어짐, cross-time 상관 모델링 불가 |
| 병렬 Intra + Inter | 두 어텐션이 서로의 출력 참고 X → 상호작용 손실 |
| Intra → Inter (MASTER) | Cross-time relay 가능 + 계산 효율 + 안정 수렴 |

### 🎯 구체 증거 — Ablation 으로 본 순서의 중요성

원문 ablation (추정):
- MASTER full: Rank IC = $X$
- Inter → Intra (역순): Rank IC ≈ $X \times 0.85$ (15% 하락)
- Intra only (Inter 제거): Rank IC ≈ $X \times 0.80$
- Inter only (Intra 제거): Rank IC ≈ $X \times 0.75$ (cross-time 효과 손실)

→ "Intra → Inter" 순서가 단순히 효율이 아니라 **본질적 성능 결정 요인**.

### 🔑 핵심 통찰

> 5단계 파이프라인의 각 단계가 **독립적 묘수**. 게이팅 = 국면 적응, Intra = 시간 압축, Inter = 종목 관계, Temporal = 예측 지향 집계. 이 4개의 묘수가 곱하기 효과 → MASTER 의 성능.

---

## 4. "Local Embedding as Relay" 의 핵심 직관

### 4.1 한 줄 요약

> Inter-stock 집계에서 종목 $i$ 가 종목 $j$ 의 **지역 임베딩** $H_j$ 를 어텐션 입력으로 사용. $H_j$ 의 각 행 $H_{j,t}$ 는 intra-stock 어텐션을 통해 **이미 종목 $j$ 의 $t' = 1, \ldots, T$ 시각 정보** 를 압축. 따라서 종목 $i$ 가 $H_{j,t}$ 를 참고할 때, 실질적으로 종목 $j$ 의 $T$ 시각 전체 정보를 **간접 소비**.

### 4.2 단계별 정보 흐름

**$\hat{X}_{j,t}$ (게이팅 후 raw 특징)**:
- 시각 $t$ 의 종목 $j$ 정보만 담음
- 만약 inter-stock 이 이걸 직접 사용했다면 → time-aligned (시점 일치) 정보만 교환 → cross-time 효과 불가

**$H_{j,t}$ (intra-stock 후 지역 임베딩)**:
- Intra-stock attention 으로 $\hat{X}_{j,1}, \hat{X}_{j,2}, \ldots, \hat{X}_{j,T}$ 모두 흡수
- $H_{j,t}$ 안에 **시각 $1 \sim T$ 의 종목 $j$ 정보가 압축** 되어 있음
- 시각 $t$ 의 라벨이지만 사실은 "종목 $j$ 의 1주일치 압축"

**Inter-stock attention 에서 $H_{j,t}$ 사용**:
- 종목 $i$ 가 $H_{j,t}$ 를 참고 = 종목 $j$ 의 1주일치 모두 간접 참고
- 결과: **종목 $i$ 의 현재 ↔ 종목 $j$ 의 임의 시점** 의 상관 학습 가능

### 4.3 저자 표현

> "**Local embedding 이 종목 간 신호를 수송하는 relay 역할을 한다**" (원문 텍스트, 웹 검색 스니펫 기준).

### 🎯 구체 예시 — 반도체 공급망

**시나리오**:
- 종목 A (반도체 장비 회사): 시각 $t$ 에 큰 공급 계약 체결
- 종목 B (메모리 반도체 회사): 시각 $t+3$ 에 수요 증가로 가격 상승

**기존 (time-aligned)**:
- 시각 $t$ 에서: A 와 B 비교 → A 신호는 있지만 B 에 아직 반영 X
- 시각 $t+3$ 에서: A 와 B 비교 → A 의 신호는 이미 과거 → 같은 시점 $t+3$ A 데이터엔 없음
- 결과: **3일 시차 효과 어디서도 포착 X**

**MASTER (relay)**:
- Intra-stock: $H_{A, t+3}$ 가 $\hat{X}_{A, t}, \ldots, \hat{X}_{A, t+3}$ 흡수 → 공급 계약 신호 포함
- Inter-stock 시각 $t+3$: B 가 $H_{A, t+3}$ 어텐션 → A 의 3일 전 공급 계약 간접 소비
- 결과: **3일 시차 효과 포착 성공**

### 🔑 핵심 통찰

> "Intra → Inter" 순서가 단순한 효율 최적화가 아니라 **cross-time 정보 전송의 메커니즘 자체**. 이게 저자가 "MASTER" 라는 이름 (Market-guided Stock TransformER) 에 담은 **핵심 design**.

---

## 5. 5 단계 각각의 묘수 요약

| 단계 | 묘수 (Key Trick) | 해결하는 문제 |
|------|-----------------|--------------|
| 게이팅 | 시장 정보 $m_\tau$ 가 158 팩터 가중치 동적 조정 | 국면별 팩터 유효성 변동 |
| Intra | $T \times T$ 어텐션으로 시간 패턴 압축 | 종목 내 시간 의존성 + relay 준비 |
| Inter | $N \times N$ 어텐션 + 비대칭 학습 | 종목 간 동적 관계 + leader-follower |
| Temporal | 마지막 시각 Query → 단일 벡터 | "예측 지향" 정보 집계 |
| Prediction | 선형 → 순위화 | 회귀를 ranking 으로 활용 |

각 단계가 **독립적 묘수** 이며 **함께 작동** 할 때 시너지.

---

## 6. 다음 챕터 안내

이 챕터는 큰 그림. **각 단계의 정밀 수식, 직관, 대안 비교** 는 다음 4 챕터에서:

- [05_method_b_gating.md](05_method_b_gating.md) — **게이팅** 의 메커니즘, 온도 $\beta$ 의 역할, 종목별 vs 단일 게이팅
- [05_method_c_intra_inter.md](05_method_c_intra_inter.md) — **Intra/Inter Attention** 의 정밀 수식, cross-time relay 의 작동 원리
- [05_method_d_temporal.md](05_method_d_temporal.md) — **Temporal Aggregation** + 학습 setup + 데이터 분할
- [06_experiments.md](06_experiments.md) — 실험 결과, ablation, 베이스라인 비교

---

## 7. 핵심 한 문장

> MASTER 의 큰 그림은 **5단계 파이프라인** (게이팅 → 선형 투영 → Intra → Inter → Temporal → Prediction) 이고, 핵심 묘수는 **시장 유도 게이팅의 국면 적응** + **Intra → Inter 순서의 cross-time relay**. 이 두 가지가 결합되어 IC 기준 +13%, 포트폴리오 기준 +47% 의 개선을 만든다.

---

## 8. 자기점검

### 핵심 5가지

1. **MASTER 의 입력 두 종류와 각 차원?**
2. **5단계 파이프라인의 순서와 각 단계 출력 차원?**
3. **"Intra → Inter" 순서를 채택한 3가지 이유?**
4. **Local Embedding as Relay 가 cross-time correlation 을 어떻게 가능하게 하는가?**
5. **5단계 각각의 "묘수" 한 단어로?**

### 답변

1. **A. 종목 데이터** $X \in \mathbb{R}^{N \times T \times F}$, $N \approx 300$ (CSI300) 또는 800 (CSI800), $T = 8$ 거래일, $F = 222$ (Alpha158 + 시장63 + 레이블1). 실제 사용은 158 팩터. **B. 시장 정보** $m_\tau \in \mathbb{R}^{63}$, 3 지수 × 21 통계 (현재일 수익률 + 5/10/20/30/60일 평균수익률/변동성/평균거래량/거래량변동성).

2. **Step 1 게이팅**: $X \in (N,T,F) \to \hat{X} \in (N,T,F)$. **Step 1.5 선형투영**: $(N,T,F) \to (N,T,d)$, $d \approx 128$. **Step 2 Intra**: $(N,T,d) \to (N,T,d)$, 각 종목 독립 self-attn. **Step 3 Inter**: $(N,T,d) \to (N,T,d)$, 각 시점 종목 간 attn. **Step 4 Temporal**: $(N,T,d) \to (N,d)$, 마지막 시각 Query attn. **Step 5 Prediction**: $(N,d) \to (N,)$, 선형.

3. **이유 1 (어텐션 필드 크기 위계)**: Intra $T^2 = 64$ ≪ Inter $N^2 = 90,000$ ≪ 단일 $(NT)^2 = 5.76$M. 작은 것부터 처리. **이유 2 (분포 단순성)**: 종목 내 시간 패턴은 종목 간 패턴보다 단순 → Intra 가 안정 수렴. **이유 3 (Cross-Time Relay)**: Intra 출력 $H_{j,t}$ 가 종목 $j$ 의 시간 압축 → 같은 시점 Inter 도 사실상 cross-time. 역순 (Inter → Intra) 은 이 effect 불가.

4. **단계별 정보 흐름**: (i) $\hat{X}_{j,t}$ = 시각 $t$ 의 종목 $j$ raw 데이터 (time-aligned 정보). (ii) Intra 후 $H_{j,t}$ = 종목 $j$ 의 $T$ 시각 모두 흡수한 압축 (시간 정보 mixed). (iii) Inter-stock attention 시각 $t$ 에서 종목 $i$ 가 $H_{j,t}$ 어텐션 → 사실상 종목 $j$ 의 $T$ 시각 전체 정보 간접 소비. → 결과: 종목 $i$ 의 현재와 종목 $j$ 의 **임의 시점** 의 상관 학습 가능. 예: 반도체 장비 (A) 시각 $t$ 의 공급 계약이 메모리 (B) 시각 $t+3$ 의 수요 증가 → MASTER 가 이 3일 시차 효과 포착.

5. **게이팅 = 국면 적응**, **Intra = 시간 압축 (+ relay 준비)**, **Inter = 종목 관계 (+ relay 작동)**, **Temporal = 예측 지향 집계**, **Prediction = 순위화 활용**.

---

→ 다음 챕터: [05_method_b_gating.md](05_method_b_gating.md) — Market-Guided Gating 의 정밀 메커니즘.
