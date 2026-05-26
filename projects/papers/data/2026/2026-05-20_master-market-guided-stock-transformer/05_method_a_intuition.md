# 05_method_a_intuition — 방법론 전체 구조 (큰 그림)

> **🧒 한 줄 요약**: 직관: stock = time history × cross-sectional context × market regime. 3-axis modeling.


> **배경 사다리**: ① 텐서(Tensor) = 다차원 배열. `(N, T, F)` 텐서는 N개 종목 × T개 시간 단계 × F개 특징으로 이루어진 3D 배열. ② 임베딩(Embedding) = 원본 데이터를 고차원 실수 벡터로 변환한 표현. ③ 게이팅(Gating) = 일부 정보만 통과시키는 필터; 값이 0이면 차단, 1이면 전부 통과. 이 세 개념으로 전체 파이프라인을 따라갈 수 있다.

---

## 1. 전체 파이프라인 조감도

MASTER의 입력은 다음 두 종류다:

**A. 종목 데이터** $X \in \mathbb{R}^{N \times T \times F}$
- $N$: 종목 수 (CSI300: ≈300, CSI800: ≈800)
- $T$: lookback 창 길이 = **8 거래일** (약 1.5~2주)
- $F$: 특징 수 = **222** = Alpha158 팩터 158개 + 시장 특징 63개 + 레이블 1개

실제 모델 입력으로 쓰이는 팩터는 **158개 Alpha158 팩터**이며, 나머지는 후처리로 분리된다.

**B. 시장 정보** $m_\tau \in \mathbb{R}^{D_m}$, $D_m = 63$
- 중국 3대 지수(CSI300, CSI500, CSI800) 각각에 대해:
  - 현재일 수익률
  - 5, 10, 20, 30, 60일 rolling 평균 수익률 및 표준편차
  - 같은 window의 거래량 통계
- 예측 시각 $\tau$ 기준의 시장 "온도"를 요약한 63차원 벡터

출력은 각 종목의 **5거래일 뒤 수익률 예측값**으로, 이를 내림차순 정렬해 포트폴리오를 구성한다.

---

## 2. 5단계 파이프라인

```
입력: X (N × T × F),  m_τ (D_m)
  │
  ▼
[단계 1] 시장 유도 게이팅 (Market-Guided Gating)
  │     m_τ → 게이팅 계수 g ∈ ℝ^F
  │     X̂ = X * g  (특징 재가중치)
  ▼
[단계 2] 주내 집계 (Intra-Stock Aggregation)
  │     각 종목 n에 대해, T×T self-attention
  │     → 시간 지역 임베딩 H ∈ ℝ^(N × T × d)
  ▼
[단계 3] 주간 집계 (Inter-Stock Aggregation)
  │     각 시각 t에 대해, N×N cross-stock attention
  │     → 교차 종목 임베딩 Z ∈ ℝ^(N × T × d)
  ▼
[단계 4] 시간 집계 (Temporal Aggregation)
  │     각 종목의 마지막 시각 임베딩이 전체 T개 임베딩을 쿼리
  │     → 종합 종목 임베딩 e ∈ ℝ^(N × d)
  ▼
[단계 5] 예측 (Prediction)
        선형 레이어 → 5일 뒤 수익률 스코어 s ∈ ℝ^N
```

---

## 3. 왜 이 순서인가: 설계 직관

**"intra 먼저, inter 나중"의 이유**는 두 가지다:

**이유 1 — 어텐션 필드 크기의 위계**: 
- Intra-stock 어텐션의 필드: $T \times T = 8 \times 8 = 64$ 쌍
- Inter-stock 어텐션의 필드: $N \times N \approx 300 \times 300 = 90,000$ 쌍

더 작고 관리하기 쉬운 intra를 먼저 해결한다. 이렇게 만들어진 지역 임베딩 $H$는 이미 각 종목의 시간 패턴을 압축했으므로, 이후 inter-stock 어텐션의 입력 질이 높아진다.

**이유 2 — 분포의 단순성**: 
단일 종목 내 T=8 시간 단계의 상관관계 분포(예: 추세, 역전)는 종목 간 상관관계 분포보다 구조가 단순하고 예측 가능하다. Self-attention이 더 안정적으로 수렴한다.

**대안과의 비교**:

| 설계 | 문제점 |
|------|--------|
| 단일 $(N \cdot T) \times (N \cdot T)$ 어텐션 | $2400^2 = 5.76$백만 쌍, 계산 불가 |
| Inter → Intra (역순) | 종목 간 정보 교환이 "날것" 특징에서 이루어짐, cross-time 상관 모델링 불가 |
| 병렬 Intra + Inter | 두 어텐션이 서로의 출력을 참고하지 않아 상호작용 손실 |

---

## 4. 데이터 흐름 치수 추적

| 단계 | 입력 | 출력 |
|------|------|------|
| 게이팅 | $(N, T, F)$ + $m_\tau (D_m)$ | $(N, T, F)$ (재가중) |
| Intra | $(N, T, F)$ → 선형 투영 → $(N, T, d)$ | $(N, T, d)$ (지역 임베딩) |
| Inter | $(N, T, d)$ | $(N, T, d)$ (교차 임베딩) |
| 시간집계 | $(N, T, d)$ | $(N, d)$ (종합 임베딩) |
| 예측 | $(N, d)$ | $(N, 1)$ (스코어) |

($d$ = 모델 hidden dimension, 정확한 값 원문에서 미확인)

---

## 5. "Local Embedding as Relay"의 핵심 직관

inter-stock 집계에서 종목 $i$는 종목 $j$의 **지역 임베딩** $H_j \in \mathbb{R}^{T \times d}$를 어텐션의 입력으로 사용한다. $H_j$의 각 행 $H_{j,t}$는 intra-stock 어텐션을 통해 이미 종목 $j$의 $t'=1,\ldots,T$ 시각 정보를 압축하고 있다. 따라서 종목 $i$가 $H_{j,t}$를 참고할 때, 실질적으로 종목 $j$의 $T$ 시각 전체 정보를 간접적으로 소비하는 것이다. 

저자들은 이를 "local embedding이 종목 간 신호를 수송하는 relay 역할을 한다"고 표현한다 (원문 텍스트, 웹 검색 스니펫 기준). 이것이 cross-time 상관을 모델링하는 메커니즘이다.

→ **다음 파일에서 각 단계의 수학적 상세를 다룬다.**

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **3-axis (time + cross + market) 의 *직관*?**
2. **Regime-conditional modeling 의 *necessity*?**
3. **Multi-source signal fusion?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
