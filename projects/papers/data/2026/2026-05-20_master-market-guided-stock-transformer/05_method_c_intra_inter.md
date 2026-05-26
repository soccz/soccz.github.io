# 05_method_c_intra_inter — 방법론: 주내·주간 어텐션 집계

> **🧒 한 줄 요약**: Intra: per-stock time attention. Inter: cross-stock attention at each time. Complementary.


> **배경 사다리**: ① Multi-head Self-Attention = 트랜스포머의 핵심 연산. 각 원소가 Query(질문)를 만들고, 다른 원소의 Key(색인)와 비교해 어떤 원소의 Value(값)를 얼마나 가져올지 결정. ② 지역 임베딩 = 한 원소가 주변 원소들로부터 정보를 모아 만든 압축 표현. ③ Cross-time correlation = 종목 $i$의 시각 $t$와 종목 $j$의 시각 $t' \neq t$ 사이의 상관관계. 이 세 개념이면 이 절을 따라갈 수 있다.

---

## 1. 단계 2: 주내 집계 (Intra-Stock Aggregation)

### 무엇을 하는가

게이팅이 적용된 입력 $\hat{X} \in \mathbb{R}^{N \times T \times F}$를 받아, 각 종목 $n$에 대해 독립적으로 시간 축 셀프-어텐션을 수행한다. 결과는 **시간 지역 임베딩** $H \in \mathbb{R}^{N \times T \times d}$.

### 왜 이 단계가 필요한가

T=8 거래일은 약 1.5~2주에 해당한다. 이 기간 동안 하나의 종목 안에서도 정보의 흐름이 있다: "어제 급등했다면 오늘은 더 신중하게 봐야 한다"는 식의 시간 내 패턴을 포착한다. 또한, 이 내부 집계를 통해 시각 $t$의 임베딩 $H_{n,t}$는 시각 $t'$의 정보를 포함하게 된다 — 이것이 나중에 inter-stock 집계에서 cross-time 상관의 통로가 된다.

### 수학적 구조

$$H_{n,t} = \text{MultiHeadAttn}\left(\hat{X}_{n,t}, \hat{X}_{n,:}, \hat{X}_{n,:}\right)$$

풀어서 쓰면:

$$\text{Attn}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

| 기호 | 의미 |
|------|------|
| $Q = \hat{X}_{n,t} W_Q$ | 종목 $n$의 시각 $t$에서 "내가 찾는 패턴이 무엇인가" |
| $K = \hat{X}_{n,:} W_K$ | 모든 시각의 "내가 어떤 패턴을 가지고 있는가" |
| $V = \hat{X}_{n,:} W_V$ | 실제로 가져올 정보 |
| $d_k$ | key 차원 (scale factor로 사용, gradient 안정화) |

**일상 비유**: 종목 $n$의 8일치 데이터를 "나 자신의 일기장"이라고 하면, intra-stock 어텐션은 "오늘 일기를 쓸 때 이 일기장의 어떤 날 내용을 가장 많이 참고할지" 결정하는 과정이다.

**왜 이 형태**: 표준 트랜스포머 셀프-어텐션을 각 종목 독립적으로 적용하는 것이다. 시간 내 패턴 포착에는 RNN보다 어텐션이 병렬 처리 가능하고 장기 의존성 포착에 유리하다. T=8이 짧으므로 $T^2 = 64$의 어텐션 행렬이 계산 가능하다.

**조심할 점**: N개 종목에 독립적으로 적용되므로 이 단계 이후에는 종목 간 정보 교환이 없다. 종목 $i$의 $H_{i,t}$는 여전히 종목 $i$의 정보만 담고 있다.

---

## 2. Cross-Time 상관의 메커니즘 해설

이 단계가 어떻게 "cross-time 종목 상관"의 기반이 되는지를 구체적 예시로 보자.

**예시**: 
- 종목 A (예: 반도체 장비)
- 종목 B (예: 메모리 반도체)
- 가정: 종목 A의 공급 계약 체결이 3일 뒤 종목 B의 수요 증가로 이어짐

기존 방법 (time-aligned inter-stock attention):
- 시각 $t$에서 종목 A와 종목 B는 각각 시각 $t$의 원시 특징만 비교
- 3일 뒤 효과를 포착할 수 없음

MASTER의 방법:
1. Intra-stock 단계: 종목 A의 $H_{A,t+3}$는 $\hat{X}_{A,t}$ 정보를 이미 어텐션을 통해 담고 있음
2. Inter-stock 단계: 시각 $t+3$에서 종목 B가 $H_{A,t+3}$을 어텐션하면, 종목 A의 3일 전 신호를 간접 소비
3. 결과: 종목 B가 종목 A의 시각 $t$ 신호를 시각 $t+3$에서 반응하는 패턴 학습 가능

이것이 저자가 "local embedding이 relay 역할을 한다"고 표현한 메커니즘의 실체다.

---

## 3. 단계 3: 주간 집계 (Inter-Stock Aggregation)

### 무엇을 하는가

지역 임베딩 $H \in \mathbb{R}^{N \times T \times d}$를 받아, 각 시각 $t$에서 $N$개 종목 간의 어텐션을 수행한다. 결과는 교차 종목 임베딩 $Z \in \mathbb{R}^{N \times T \times d}$.

### 수학적 구조

$$Z_{n,t} = \text{MultiHeadAttn}\left(H_{n,t}, H_{:,t}, H_{:,t}\right)$$

| 기호 | 의미 |
|------|------|
| $H_{n,t}$ (Query) | 종목 $n$이 시각 $t$에서 "다른 어떤 종목 정보가 필요한가" |
| $H_{:,t}$ (Key) | 시각 $t$의 모든 종목 지역 임베딩 |
| $H_{:,t}$ (Value) | 실제로 가져올 정보 |

**일상 비유**: 교실에서 시험 전날 밤, 각 학생이 다른 학생의 "어제 정리 노트"를 보고 자기 것을 보완하는 과정이다. 노트에는 여러 날의 내용이 압축되어 있으므로, 어제 노트를 보는 것만으로도 며칠 전 수업 내용까지 간접 습득한다.

**왜 이 형태**: 
- inter-stock 어텐션도 표준 multi-head attention을 사용하되, 배치 차원이 시간 $t$이고 시퀀스 차원이 종목 $n$이다.
- 이를 통해 각 시각 $t$에서 $N \times N$ 어텐션 행렬이 생성되는데, 이 행렬의 $(i, j)$ 원소가 "시각 $t$에서 종목 $j$가 종목 $i$에 미치는 영향"을 나타낸다.
- 단, $H_{j,t}$ 자체가 종목 $j$의 여러 시각 정보를 담으므로, 실질적으로 cross-time 정보가 흐른다.

**조심할 점**: 이 단계는 "같은 시각 $t$의 종목들끼리" 어텐션하는 것처럼 보이지만, 입력 $H_{j,t}$가 이미 cross-time 정보를 담고 있어 사실상 cross-time 상관을 포착한다. 논문의 그림이나 설명에서 "momentary AND cross-time"이라고 부르는 이유다.

---

## 4. 어텐션 시각화와 해석 가능성

저자들은 학습된 inter-stock 어텐션 행렬을 시각화해 두 가지 발견을 보고한다 (원문 Figure, 정확한 번호 미확인):

1. **비대칭성 (Asymmetry)**: 종목 $i$가 종목 $j$에 주는 어텐션 $\neq$ 종목 $j$가 종목 $i$에 주는 어텐션. 이는 실제 시장에서 리더 종목(leader)이 팔로워(follower)에게 일방향적 영향을 준다는 점과 일치한다.

2. **느린 변화 (Slow Change)**: 연속된 예측 날짜에서 어텐션 패턴이 급격히 변하지 않고 서서히 진화한다. 시장 구조(예: 산업 섹터 묶음)가 단기간에 크게 변하지 않는다는 현실과 일치한다.

이 시각화는 모델이 합리적인 종목 관계 구조를 학습했다는 간접 증거를 제공하며, 해석 가능성(interpretability) 측면에서도 가치가 있다.

---

## 5. 핵심 한 문장

> 주내 어텐션으로 만든 "시간 압축 지역 임베딩"을 relay로, 주간 어텐션이 같은 시각에서 진행되더라도 실질적으로 종목 간 cross-time 정보 흐름을 가능하게 하는 것이 MASTER intra-inter 교번 구조의 핵심 설계 원리다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Intra attention 의 *time pattern* capture?**
2. **Inter attention 의 *cross-sectional dependency*?**
3. **Parallel computation via reshape?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
