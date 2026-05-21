# 05_method_c_intra_inter — 방법론: 주내·주간 어텐션 집계

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Intra-stock attention (한 주식 내) vs Inter-stock attention (주식 간) 의 정확한 차이
- 두 어텐션의 역할 분담과 입출력 텐서 모양
- Multi-head Self-Attention 의 메커니즘 (Q, K, V)
- "Local Embedding as Relay" 메커니즘 — cross-time 종목 상관이 어떻게 흐르는가
- 어텐션 비대칭성 (asymmetry) 과 느린 변화 (slow change) 의 해석 가능성

---

> **배경 사다리**: ① **Multi-head Self-Attention** = 트랜스포머의 핵심 연산. 각 원소가 Query(질문)를 만들고, 다른 원소의 Key(색인)와 비교해 어떤 원소의 Value(값)를 얼마나 가져올지 결정. ② **지역 임베딩** = 한 원소가 주변 원소들로부터 정보를 모아 만든 압축 표현. ③ **Cross-time correlation** = 종목 $i$의 시각 $t$와 종목 $j$의 시각 $t' \neq t$ 사이의 상관관계. ④ **Multi-head** = 어텐션을 $h$ 개 (예: 8개) 병렬로 수행하고 결과 concat → 다양한 패턴 동시 포착. 이 네 개념으로 이 절을 완전히 따라갈 수 있다.

### 🌱 Intra/Inter Attention — 일상 비유

**한 줄로**: "각 종목의 8일 일기를 먼저 자기 안에서 정리(Intra) → 그 정리본을 다른 종목들끼리 공유(Inter)".

- **Intra (주내)**: 각 학생이 자기 일주일치 일기를 다시 읽고 핵심을 추림 → 8일분의 정보가 1개의 "압축 노트"로 정리
- **Inter (주간)**: 학생들끼리 서로의 압축 노트를 보고 영향 주고받음 → 친구의 어제 노트엔 그 친구의 지난주가 다 들어있음
- **숨겨진 트릭**: 노트가 이미 시간 압축이므로, "오늘끼리만 봤는데" 실제론 "지난주 친구 → 오늘 나"의 정보 흐름이 가능 (cross-time relay)

**왜 이 순서**: 만약 Inter를 먼저 하면 N×T×N×T 어텐션이 필요 (4차 폭발). Intra로 T를 압축한 뒤 Inter 하면 N×N으로 절감되면서도 cross-time 효과는 보존.

### 🌱 두 번째 비유 — 학생회 정보 공유

학교에 300개 반 (300 종목), 각 반의 8일치 출석부 (= 8일 데이터):

| 단계 | 비유 |
|------|------|
| **Intra** | 각 반장이 자기 반의 일주일 출석부를 보고 "우리 반 핵심 트렌드" 한 줄로 요약 (지각 빈도 등) |
| **Inter** | 모든 반장이 모여서 서로의 요약본을 보고 "옆 반 트렌드" 흡수 (옆 반 지각률 ↑ 이면 우리도 영향?) |
| **Temporal Agg** | 가장 최근 (오늘 반장) 입장에서 지난주 보고서 중 어느 게 가장 중요했지? 라고 묻기 |

→ 정보 흐름: **종목 자기 시간 → 종목 간 횡적 공유 → 최신 시점 종합**.

---

## 1. 단계 2: 주내 집계 (Intra-Stock Aggregation)

### 1.1 무엇을 하는가

게이팅이 적용된 입력 $\hat{X} \in \mathbb{R}^{N \times T \times F}$를 받아, **각 종목 $n$에 대해 독립적으로** 시간 축 셀프-어텐션을 수행. 결과는 **시간 지역 임베딩** $H \in \mathbb{R}^{N \times T \times d}$.

### 1.2 왜 이 단계가 필요한가

**T=8 거래일** 은 약 1.5~2주에 해당. 이 기간 동안 하나의 종목 안에서도 정보의 흐름이 있다:
- "어제 급등했다면 오늘은 더 신중하게" (모멘텀 vs 평균회귀)
- "5일 전 거래량 spike 가 오늘 가격에 반영" (지연 효과)
- "3일 연속 하락 후 반등 패턴" (추세 전환)

이런 **시간 내 패턴** 을 포착하는 게 intra-stock attention.

**또 다른 역할 — relay 준비**: 이 내부 집계를 통해 시각 $t$의 임베딩 $H_{n,t}$ 는 시각 $t'$ 의 정보를 포함하게 된다 → 이것이 나중에 inter-stock 집계에서 **cross-time 상관의 통로** 가 된다.

### 1.3 수학적 구조

먼저 입력 차원 정리:
- $\hat{X} \in \mathbb{R}^{N \times T \times F}$, $N \approx 300$, $T = 8$, $F = 158$
- 선형 투영: $\hat{X} \to \mathbb{R}^{N \times T \times d}$, $d$ = hidden dimension (≈ 64-256, 원문 미확인)

핵심 수식:

$$H_{n,:} = \text{MultiHeadAttn}\left(\hat{X}_{n,:}, \hat{X}_{n,:}, \hat{X}_{n,:}\right)$$

(여기서 $\hat{X}_{n,:} \in \mathbb{R}^{T \times d}$ 은 종목 $n$ 의 $T$ 개 시점 임베딩.)

풀어 쓰면 single head 의 경우:
$$\text{Attn}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

multi-head 의 경우:
$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W_O$$
$$\text{head}_i = \text{Attn}(QW_Q^i, KW_K^i, VW_V^i)$$

### 1.4 🔣 Intra-Stock Attention 4-단 풀이

| 기호 | 의미 | 차원 | 직관 |
|------|------|------|------|
| $\hat{X}_{n,:} \in \mathbb{R}^{T \times d}$ | 종목 $n$ 의 $T$ 시점 임베딩 (선형 투영 후) | $(8, d)$ | "종목 $n$ 의 일주일치 일기" |
| $Q = \hat{X}_{n,:} W_Q$ | Query — "내가 찾는 패턴" | $(8, d_k)$ | 각 시점이 "내가 어떤 정보 필요해?" 라고 질문 |
| $K = \hat{X}_{n,:} W_K$ | Key — "내가 가진 패턴" | $(8, d_k)$ | 각 시점이 "나는 이런 정보 있어" 라고 표시 |
| $V = \hat{X}_{n,:} W_V$ | Value — 실제 정보 | $(8, d_v)$ | 각 시점의 실제 내용 |
| $QK^\top / \sqrt{d_k}$ | scaled dot-product | $(8, 8)$ | "$i$ 시점이 $j$ 시점에 얼마나 주목할지" raw score |
| $\text{softmax}(\cdot)$ | attention weight | $(8, 8)$ | 각 행이 합 1 인 분포 (어디서 정보 가져올지) |
| $H_{n,:}$ | intra-stock 출력 | $(8, d)$ | "압축 일기" — 각 시점이 다른 시점들 정보 흡수 |

**$\sqrt{d_k}$ 의 역할**: gradient stabilization. $d_k$ 가 크면 dot-product 값도 커져 softmax 가 sharp 해짐 → 학습 불안정. $\sqrt{d_k}$ 로 나눠서 적정 sharpness 유지.

### 1.5 일상 비유 (수식 → 직관)

종목 $n$ 의 8일치 데이터를 "나 자신의 일기장" 이라 하면:

| 어텐션 동작 | 일기장 비유 |
|------------|-------------|
| Query 생성 | "오늘 일기 쓰는데, 과거 어떤 내용 참고할까?" 질문 |
| Key 비교 | 일기장의 각 페이지가 "나는 이런 주제야" 라고 색인 |
| Softmax | "어제 95%, 5일 전 4%, 그제 1% 참고" 같은 분배 결정 |
| Value 가중합 | 어제 내용 0.95 × 그날 일기 + 5일전 0.04 × 그날 일기 ... |

### 1.6 왜 이 형태 — 대안 비교

**대안 1: RNN (LSTM)**:
- 장점: 순차적 처리, 시간 순서 보장
- 단점: 시퀀스 길이가 길수록 vanishing gradient, 병렬 처리 불가

**대안 2: 1D CNN (TCN)**:
- 장점: 병렬 처리, 지역 패턴 강함
- 단점: 고정 수용장 → 장기 의존성 제한

**대안 3: Self-Attention (MASTER 선택)**:
- 장점: 병렬 처리, 장기·단기 의존성 모두 가능, 해석 가능 (attention map)
- 단점: $O(T^2)$ 복잡도. 단 $T = 8$ 이라 $T^2 = 64$ — 매우 작음.

→ $T$ 가 작은 본 setting 에서는 self-attention 이 최선.

### 1.7 조심할 점

- **종목 독립성**: $N$ 개 종목에 독립적으로 적용 → 이 단계 이후에는 종목 간 정보 교환이 없음. 종목 $i$ 의 $H_{i,t}$ 는 여전히 종목 $i$ 의 정보만.
- **위치 정보**: Self-attention 자체는 위치 무관 (permutation-invariant). 시간 순서를 보존하려면 **positional encoding** 필요. 원문이 positional encoding 사용 여부 미확인 (추정: 사용).

### 🔑 핵심 통찰

> Intra-stock attention 은 단순히 "시간 내 패턴" 포착이 아니라, **다음 단계의 cross-time relay 를 위한 정보 압축** 단계. 이게 MASTER 설계의 묘수.

---

## 2. Cross-Time 상관의 메커니즘 (★ 가장 중요한 직관)

### 2.1 문제: 시간 어긋난 종목 상관

**예시 시나리오**:
- 종목 A (반도체 장비 회사)
- 종목 B (메모리 반도체 회사)
- 가정: 종목 A의 공급 계약 체결이 **3일 뒤** 종목 B의 수요 증가로 이어짐

→ 종목 A 의 시각 $t$ 신호가 종목 B 의 시각 $t+3$ 에서 반응으로 나타남. 이게 **cross-time correlation**.

### 2.2 기존 방법 (time-aligned inter-stock attention) 의 한계

**기존 방법 동작**:
- 시각 $t$ 에서 종목 A 와 종목 B 가 **각각 시각 $t$ 의 원시 특징**만 비교
- 시각 $t+3$ 에서 다시 비교

**문제**:
- $t$ 시점에선 A 의 공급 계약 신호가 아직 B 의 가격엔 없음 → 어텐션 거의 0
- $t+3$ 시점에선 A 의 공급 계약 신호는 이미 과거 → 같은 시점 $t+3$ 의 A 데이터엔 없음
- 결과: **3일 시차** 효과를 어디서도 포착 못 함

### 2.3 MASTER 의 해결책 (Local Embedding as Relay)

**Step 1 — Intra-stock 단계**:
- 종목 A 의 $H_{A,t+3}$ 는 intra-stock attention 을 통해 $\hat{X}_{A,t}, \hat{X}_{A,t+1}, \hat{X}_{A,t+2}, \hat{X}_{A,t+3}$ 정보를 모두 담고 있음.
- 즉, $H_{A,t+3}$ 안에 **시각 $t$ 의 공급 계약 신호** 가 압축되어 있음.

**Step 2 — Inter-stock 단계**:
- 시각 $t+3$ 에서 종목 B 가 $H_{A,t+3}$ 를 attention.
- 종목 B 가 종목 A 의 **3일 전 공급 계약 신호** 를 간접 소비.

**Step 3 — 결과**:
- 종목 B 가 종목 A 의 시각 $t$ 신호를 시각 $t+3$ 에서 반응하는 패턴 학습 가능.
- "Cross-time correlation" 모델링 성공.

### 🎯 구체 증거 — relay 효과의 이론적 근거

저자 표현: **"local embedding 이 종목 간 신호를 수송하는 relay 역할을 한다"** (원문 텍스트, 웹 검색 스니펫 기준).

이게 MASTER 가 time-aligned baseline (예: GAT, DTML) 대비 우위를 보이는 핵심 이유. CSI300 ablation 에서:
- "Intra 없이 바로 Inter" 변형 → cross-time 효과 손실 → Rank IC 약 5-10% 하락 추정 (원문 ablation 정확 수치 미확인)

### 🔑 핵심 통찰

> "Intra → Inter" 순서가 단순히 계산 효율을 위한 게 아니라, **cross-time 정보 전송의 메커니즘 자체**. 이게 저자가 "MASTER" 라는 이름에 담은 핵심 design idea.

---

## 3. 단계 3: 주간 집계 (Inter-Stock Aggregation)

### 3.1 무엇을 하는가

지역 임베딩 $H \in \mathbb{R}^{N \times T \times d}$ 를 받아, **각 시각 $t$ 에서 $N$ 개 종목 간** 의 어텐션을 수행. 결과는 교차 종목 임베딩 $Z \in \mathbb{R}^{N \times T \times d}$.

### 3.2 수학적 구조

각 시각 $t$ 에 대해:
$$Z_{n,t} = \text{MultiHeadAttn}\left(H_{n,t}, H_{:,t}, H_{:,t}\right)$$

(여기서 $H_{:,t} \in \mathbb{R}^{N \times d}$ 은 시각 $t$ 의 모든 종목 임베딩.)

### 3.3 🔣 Inter-Stock Attention 4-단 풀이

| 기호 | 의미 | 차원 | 직관 |
|------|------|------|------|
| $H_{n,t}$ | 종목 $n$, 시각 $t$ 의 임베딩 | $(d,)$ | "종목 $n$ 의 시점 $t$ 일기 요약" |
| $H_{:,t}$ | 시각 $t$ 의 모든 종목 임베딩 | $(N, d)$ | "시점 $t$ 의 시장 전체 일기" |
| $Q = H_{n,t} W_Q$ | Query | $(d_k,)$ | "종목 $n$ 이 다른 종목 중 누구 정보 필요?" |
| $K = H_{:,t} W_K$ | Key | $(N, d_k)$ | 각 종목이 "나는 이런 정보 가져" 표시 |
| $V = H_{:,t} W_V$ | Value | $(N, d_v)$ | 각 종목의 실제 정보 |
| $\text{softmax}(QK^\top/\sqrt{d_k})$ | 어텐션 가중치 | $(N,)$ | "종목 $n$ 이 다른 종목들에 얼마나 주목" |
| $Z_{n,t}$ | inter-stock 출력 | $(d,)$ | "종목 $n$ 의 시점 $t$ 임베딩 + 다른 종목 정보" |

### 3.4 차원 변화 추적

```
H ∈ ℝ^(N × T × d)          # intra 출력
    ↓ 각 t 별로 inter-stock attention (T번 반복)
    For t = 1, 2, ..., T:
        For n = 1, 2, ..., N:
            Z[n, t] = MultiHeadAttn(H[n,t], H[:,t], H[:,t])
Z ∈ ℝ^(N × T × d)          # inter 출력 (모양 동일)
```

**유의**: $T$ 번 반복하는 것처럼 보이지만, 실제 구현에서는 batch dimension 으로 처리 → 1번 attention call.

### 3.5 일상 비유

교실에서 시험 전날 밤:
- 각 학생이 다른 학생의 "어제 정리 노트" 를 보고 자기 것을 보완
- 노트에는 여러 날의 내용이 압축되어 있으므로, 어제 노트 보는 것만으로도 며칠 전 수업 내용까지 간접 습득

→ 이게 **relay** 의 본질.

### 3.6 왜 이 형태

**대안 1: 그래프 신경망 (GNN/GAT)**:
- 장점: 명시적 종목 간 그래프 구조 사용 (예: 산업 분류)
- 단점: 고정 그래프 (사전 정의된 edge) → 동적 관계 변화 적응 불가

**대안 2: Full attention (MASTER 선택)**:
- 장점: 모든 종목 쌍의 동적 관계 학습. 시점·국면별 다른 패턴 가능.
- 단점: $O(N^2)$ 복잡도. CSI300 의 $N = 300$ 이면 $90,000$ 쌍 — 여전히 처리 가능.

**대안 3: Sparse attention**:
- 가능하지만 어떤 쌍을 살릴지 정의 필요 → 사전 그래프 가정으로 회귀.

### 3.7 조심할 점

- 이 단계는 "**같은 시각 $t$ 의 종목들끼리**" 어텐션하는 것처럼 보임.
- 그러나 입력 $H_{j,t}$ 가 **이미 cross-time 정보** 를 담음 (intra-stock 덕분).
- 사실상 cross-time 상관을 포착. 논문에서 "momentary AND cross-time" 이라고 부르는 이유.

### 🔑 핵심 통찰

> Inter-stock attention 의 입력 $H_{j,t}$ 가 "압축 시간" 표현이라는 점이 핵심. **표면적 momentary attention** 이지만 **본질은 cross-time relay** 가 작동.

---

## 4. 어텐션 시각화와 해석 가능성

### 4.1 학습된 inter-stock 어텐션 행렬의 발견

저자들은 학습된 inter-stock 어텐션 행렬 $A \in \mathbb{R}^{N \times N}$ 을 시각화해 두 가지 발견 보고 (원문 Figure, 정확 번호 미확인):

#### 발견 1: 비대칭성 (Asymmetry)

$$A_{ij} \neq A_{ji}$$

종목 $i$ 가 종목 $j$ 에 주는 어텐션 $\neq$ 종목 $j$ 가 종목 $i$ 에 주는 어텐션.

**의미**: 실제 시장에서 **리더 종목 (leader)** 이 **팔로워 (follower)** 에게 일방향적 영향을 준다는 점과 일치.

**🎯 구체 예시**:
- 삼성전자 → SK하이닉스 (메모리 반도체 동조)
- 삼성전자가 미국 빅테크 실적 발표에 먼저 반응 → 1-2일 후 SK하이닉스 반응
- 어텐션 행렬: $A_{\text{SK하이닉스}, \text{삼성전자}} > A_{\text{삼성전자}, \text{SK하이닉스}}$

기존 그래프 모델 (GAT 등) 은 보통 **symmetric** (양방향 동등) → 이런 비대칭 캡처 불가.

#### 발견 2: 느린 변화 (Slow Change)

연속된 예측 날짜 $\tau, \tau+1$ 에서 어텐션 패턴이 **급격히 변하지 않고 서서히 진화**.

$$\|A^{(\tau+1)} - A^{(\tau)}\|_F \ll \|A^{(\tau)}\|_F$$

(Frobenius norm 으로 측정 시 변화량이 절대값 대비 작음)

**의미**: 시장 구조 (예: 산업 섹터 묶음) 가 단기간에 크게 변하지 않는다는 **현실과 일치**.

**관찰**: 코로나 충격 (2020-Q1) 같은 급변기엔 어텐션 행렬이 더 빠르게 변할 가능성. (원문 분석 미확인)

### 4.2 📖 어텐션 행렬 시각화 (heatmap) 읽는 법

**무엇이 표시되나** (가상 figure 추정):
- 가로·세로 축: $N$ 개 종목 (보통 산업 섹터별로 정렬)
- 셀: 어텐션 가중치 $A_{ij}$ (0 ~ 1)
- 색상: 진한 색 = 강한 attention

**어디를 봐야 하나**:
1. **대각선 근처**: 같은 섹터끼리 강한 어텐션 (예: 반도체 종목들끼리 진한 색)
2. **비대각 블록**: 다른 섹터 간 어텐션. 의미 있는 cross-sector 관계 발견 가능.
3. **수직선**: 한 열이 전체적으로 진하면 → 그 종목 (열) 이 다른 종목들에게 자주 참조됨 (= 리더 종목)
4. **수평선**: 한 행이 진하면 → 그 종목 (행) 이 다른 종목들을 자주 참조 (= 팔로워)
5. **비대칭 확인**: $A_{ij}$ 와 $A_{ji}$ 가 색 다르면 비대칭 (방향성 있음)

**숨은 함정**:
- 산업 분류 순서로 정렬 안 됐으면 → 섹터 블록 안 보임 → 잘못된 해석
- Multi-head 평균을 본 건지, 특정 head 만 본 건지 확인 (head 별로 다른 패턴 가능)

### 🔑 핵심 통찰

> 어텐션 시각화는 **모델이 합리적인 종목 관계 구조를 학습** 했다는 간접 증거. 해석 가능성 (interpretability) 측면에서도 가치. 단점: 시각화는 학습 후 사후 분석이므로, 모델 신뢰의 **충분조건 X** (sufficient 아님).

---

## 5. 두 어텐션의 역할 분담 요약표

| 항목 | Intra-Stock Attention | Inter-Stock Attention |
|------|----------------------|----------------------|
| **무엇끼리** | 한 종목 내 $T$ 개 시점 | 한 시점 내 $N$ 개 종목 |
| **시퀀스 길이** | $T = 8$ | $N \approx 300$ (CSI300) |
| **어텐션 행렬 크기** | $T \times T = 64$ | $N \times N \approx 90,000$ |
| **목적** | 종목 내 시간 패턴 포착 + cross-time 정보 압축 | 종목 간 동적 관계 학습 |
| **출력 모양** | $(N, T, d)$ | $(N, T, d)$ |
| **반복 횟수** | $N$ 종목 독립 적용 | $T$ 시각 별 적용 |
| **cross-time 효과** | 직접적 (자기 종목 내) | 간접적 (relay 통해) |

---

## 6. 핵심 한 문장

> 주내 어텐션으로 만든 "시간 압축 지역 임베딩" 을 relay 로, 주간 어텐션이 같은 시각에서 진행되더라도 실질적으로 종목 간 cross-time 정보 흐름을 가능하게 하는 것이 MASTER intra-inter 교번 구조의 핵심 설계 원리다.

---

## 7. 자기점검

### 핵심 5가지

1. **Intra-stock vs Inter-stock attention 의 입력·출력 차원?**
2. **Self-attention 의 4-단 풀이 (Q, K, V, softmax)?**
3. **Cross-time correlation 이 어떻게 흐르는가 — relay 메커니즘?**
4. **왜 "Intra → Inter" 순서이고 역순은 안 되는가?**
5. **어텐션 비대칭성 (asymmetry) 의 실무적 의미?**

### 답변

1. **Intra**: 입력 $\hat{X} \in \mathbb{R}^{N \times T \times F}$ → 선형 투영 → $\mathbb{R}^{N \times T \times d}$ → 종목별 독립 self-attention → 출력 $H \in \mathbb{R}^{N \times T \times d}$. 어텐션 행렬 크기 $T \times T = 64$. **Inter**: 입력 $H \in \mathbb{R}^{N \times T \times d}$ → 시각별 종목간 attention → 출력 $Z \in \mathbb{R}^{N \times T \times d}$. 어텐션 행렬 크기 $N \times N \approx 90,000$ (CSI300).

2. **Q** = $H W_Q$ — "내가 찾는 패턴" 질의 벡터. **K** = $H W_K$ — "내가 가진 패턴" 색인 벡터. **V** = $H W_V$ — 실제 정보. **softmax** = $\text{softmax}(QK^\top / \sqrt{d_k})$ — 각 row 가 attention weight 분포 (합 1). $\sqrt{d_k}$ 는 gradient 안정화. 최종 출력 = weight × V 의 가중합. **Multi-head** 는 이걸 $h$ 개 병렬로 (다양한 패턴 동시 포착) + concat + 선형.

3. **종목 A 의 시각 $t$ 신호 → 종목 B 의 시각 $t+3$ 반응** 시나리오: (1) Intra-stock 에서 $H_{A,t+3}$ 가 $\hat{X}_{A,t}, \hat{X}_{A,t+1}, \hat{X}_{A,t+2}, \hat{X}_{A,t+3}$ 모두 정보 흡수. (2) Inter-stock 시각 $t+3$ 에서 종목 B 가 $H_{A,t+3}$ 를 어텐션 → 종목 A 의 3일 전 신호 간접 소비. (3) 결과: cross-time 정보 흐름 성공. **Relay 의 핵심**: intra-stock 의 출력 $H$ 가 "시간 압축 정보" 이므로, 같은 시점의 inter-stock 도 사실상 cross-time.

4. **순방향 (Intra → Inter)**: Intra 가 $T \times T = 64$ 어텐션 (작음, 안정 수렴), Inter 가 $N \times N$ 어텐션. Intra 출력이 시간 압축 → Inter 가 cross-time 정보 활용 가능. **역방향 (Inter → Intra)**: Inter 가 "날것" 특징 $\hat{X}$ 에 적용 → 같은 시각 종목간 비교만 가능, cross-time 효과 불가. 또한 Inter 의 $N \times N = 90,000$ 을 매 시점 적용하면 계산 부담 ↑. **단일 $(NT) \times (NT)$**: $2400^2 = 5.76$M 쌍 — 불가능.

5. **비대칭 $A_{ij} \neq A_{ji}$** 는 **리더-팔로워 관계** 모델링. 예: 삼성전자 → SK하이닉스 (메모리 동조). 기존 그래프 모델 (GAT 등) 의 symmetric 제약을 극복. **실무 의미**: (i) 어텐션 행렬로 시장 리더 종목 발견, (ii) 리더 종목 신호로 팔로워 예측, (iii) 동적 변화 (느린 진화) 로 시장 구조 변동 추적.

---

→ 다음 챕터: [05_method_d_temporal.md](05_method_d_temporal.md) — 마지막 단계 Temporal Aggregation + 학습 설정.
