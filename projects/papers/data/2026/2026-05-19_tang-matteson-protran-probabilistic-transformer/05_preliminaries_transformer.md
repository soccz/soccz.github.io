# 05. Transformer Architectures — Section 2.2 풀이

paper p.3 (Section 2.2) 의 Eq 4 와 그 주변 텍스트를 풀어 쓴다.

이 챕터의 목표: **Attention 메커니즘이 무엇이고, ProTran 이 어떻게 다르게 쓰는가**.

---

## 5.1 Attention 이 뭔가요 — 일상 비유로 먼저

### 도서관 비유

당신이 도서관에서 책을 찾는다. 손에 든 질문: "이 트래픽 패턴이 평일인가 주말인가?"

전통적 방식 (RNN 비유):
- 책 100권을 **하나씩 순서대로** 읽으면서 답을 찾는다.
- 마지막 책 읽을 때쯤이면 첫 책 내용을 거의 잊었다.
- 책 1과 책 100 사이의 연관성? 거의 잡지 못함.

Attention 방식:
- 책 100권 모두에 대해 **"내 질문과 얼마나 관련 있는가" 점수** 를 매긴다.
- 점수 높은 책은 많이 참고, 낮은 책은 조금 참고.
- 점수에 비례한 가중합으로 답을 구성.
- **모든 책을 동시에 봄** — 100번 책과 1번 책 사이 거리에 무관.

→ 이게 Transformer 의 핵심 아이디어. ProTran 은 이 아이디어를 **잠재 변수 사이** 에 적용.

---

## 5.2 Multi-Head Attention 표준 형식 (Eq 4)

### 원문 (paper p.3)
> Central to our models and other transformer-based approaches [48, 85] is the notion of attention [5], which allows the models to focus on important parts within a context. Multi-head attention, for example, maps a sequence of queries $Q \in \mathbb{R}^{\ell_q \times d}$ of length $\ell_q$ to a sequence of outputs $O = [O_1, \ldots, O_H] \in \mathbb{R}^{\ell_q \times d}$ of the same size by attending over given $\ell_k$ key-value pairs $K \in \mathbb{R}^{\ell_k \times d}$, $V \in \mathbb{R}^{\ell_k \times d}$.

paper Eq 4:
$$
O_h = \text{Attention}(Q_h, K_h, V_h) = \text{Softmax}\!\left(\frac{Q_h K_h^T}{\sqrt{d}}\right) V_h
$$

### 풀어 설명 — Q, K, V 가 무엇인가

도서관 비유로 매칭:

| 기호 | 영어 | 도서관 비유 | 수식 모양 |
|------|------|----------|---------|
| $Q$ | Queries | "내 질문" | $\ell_q$ 개 질문 × $d$ 차원 |
| $K$ | Keys | "각 책의 표지/제목" | $\ell_k$ 개 책 × $d$ 차원 |
| $V$ | Values | "각 책의 내용" | $\ell_k$ 개 책 × $d$ 차원 |

**$\ell_q, \ell_k$** = 시퀀스 길이 (질문 개수, 책 개수).
**$d$** = 임베딩 차원 (예: 128).

### Eq 4 한 줄씩 해체

$$
O_h = \text{Softmax}\!\left(\frac{Q_h K_h^T}{\sqrt{d}}\right) V_h
$$

순서대로:

**1단계**: $Q_h K_h^T$
- 모양: $\ell_q \times \ell_k$ 의 행렬.
- 의미: "각 질문 ↔ 각 책 의 매칭 점수" (내적 = 유사도).
- 도서관 비유: 내 질문 5개 × 책 100권 = 500개 점수.

**2단계**: $/ \sqrt{d}$
- 스케일 조정. $d$ 가 크면 점수 분산이 커져서 softmax 가 극단으로 가는 걸 방지.

**3단계**: $\text{Softmax}(\cdot)$
- 각 행 (각 질문에 대해) 점수를 확률로 변환 (합 = 1).
- 의미: "이 질문에 책 1번을 30% 참고, 책 2번을 5% 참고, ..." 같은 가중치.

**4단계**: $\times V_h$
- 가중치 × 책 내용 = 가중합.
- 결과 $O_h$: 각 질문에 대해 "관련 책들의 내용을 가중평균한 답".

**한 줄 직관**: "각 질문에 대해 모든 책의 관련성 점수를 계산하고, 점수 비율로 책 내용을 섞어서 답을 만든다."

---

## 5.3 Multi-Head — 왜 여러 머리인가

### 원문 (paper p.3)
원문은 multi-head 의 분리만 설명:
$$
Q_h = Q W^Q_h, \quad K_h = K W^K_h, \quad V_h = V W^V_h
$$

여기서 $h \in [1, H]$ 는 각 head 의 인덱스, $W^Q_h, W^K_h, W^V_h$ 는 학습 가능한 투영 행렬.

### 풀어 설명

**왜 여러 head 인가**:
- Head 1: "단어의 의미적 유사성" 에 집중
- Head 2: "단어의 위치적 관계" 에 집중
- Head 3: "단어의 문법 역할" 에 집중
- 각 head 는 다른 관점에서 attention.

**최종 출력**: 모든 head 의 결과를 concat → 추가 projection.

**ProTran 의 설정** (paper p.7): **8-head**.

비유 (회의):
- 한 사람이 회의록 정리: 한 관점만.
- 8명이 회의록 정리: 8개 관점, concat 해서 풍부한 요약.

---

## 5.4 Self-attention vs Cross-attention

### 원문 (paper p.3)
> In case $Q = K = V$, we refer to such an attention mechanism as self-attention.

### 풀어 설명

| 종류 | 정의 | 비유 | ProTran 에서의 예 |
|------|------|------|------------------|
| **Self-attention** | $Q = K = V$ (같은 source) | 같은 책 안에서 단락끼리 관계 찾기 | Eq 6: 잠재 $w_{1:t-1}$ 끼리 |
| **Cross-attention** | $Q \neq K = V$ (다른 source) | 책 (Q) 에 대해 다른 책 (K,V) 참고 | Eq 7: 잠재 → context |

**ProTran 에서의 3가지 attention 용도**:

| Eq | 종류 | Q | K, V | 의미 |
|----|------|---|------|------|
| 6 | Self | $w_{t-1}$ | $w_{1:t-1}$ | 현재 잠재가 과거 잠재들 참고 |
| 7 | Cross | $\bar{w}_t$ | $h_{1:C}$ | 잠재가 context 관측 참고 |
| 10 | Self | $h_{1:T}$ | $h_{1:T}$ | 학습 시 전체 sequence 의 자기 attention (smoothing) |

→ 다음 챕터에서 자세히.

---

## 5.5 Transformer 가 RNN 보다 좋은 이유

### 원문 (paper p.3)
> Given fully observed sequences of inputs, the mapping can be computed efficiently without any imposed sequential order often seen in recurrent neural networks [19, 42]. More importantly, the direct connections between long-distance time steps are baked into the mechanism as information from previous time steps is easily accessible without being compressed into a fixed representation, easing optimization and learning of long-term dependencies [5, 85].

### 풀어 설명 — 두 가지 결정적 장점

**장점 1: No sequential order (병렬 계산 가능)**
- RNN: 시점 1 → 시점 2 → ... → 시점 $T$ 를 **순서대로** 처리. 병렬화 불가능.
- Attention: 모든 시점을 **동시에** 처리. GPU 효율.

**장점 2: Direct long-distance connections (장거리 직접 연결)**
- RNN: 시점 1 의 정보가 시점 100 에 도달하려면 99 개 hidden state 를 거쳐야 함. 정보 손실 (vanishing gradient).
- Attention: 시점 1 과 시점 100 사이 **직접 화살표**. 거리 무관.

비유 (전화 통화):
- RNN = 100명이 한 줄로 서서 귓속말 전달. 끝에 가면 내용이 바뀜.
- Attention = 100명이 동시에 마이크 사용. 한 사람의 말이 모든 사람에게 직접 전달.

→ ProTran 이 "RNN 완전 거부" 라고 강조하는 이유.

---

## 5.6 Position Embedding — 시간 정보 주입

### 원문 (paper p.4)
> Without recurrence, Transformer [85] encodes information about each time step $t$ with predefined sinusoidal positional embeddings $\text{Position}(t) = [p_t(1), \ldots, p_t(d)] \in \mathbb{R}^d$ where the $i$-th embedding is given by $p_t(i) = \sin(t \cdot c^{i/d})$ for even $i$ and $p_t(i) = \cos(t \cdot c^{i/d})$ for odd $i$ and $c$ is some large constant. Empirical results show that such positional embeddings are also important to our models.

### 풀어 설명 — 왜 position embedding 이 필요한가

**문제**: Attention 은 순서 정보가 없다.
- "월요일, 화요일, 수요일" 과 "수요일, 화요일, 월요일" 을 같게 본다.
- 시간순서가 의미 있는 시계열에서는 치명적.

**해결**: 각 시점에 **고유한 위치 신호** 를 더한다.

수식:
$$
p_t(i) = \begin{cases} \sin(t \cdot c^{i/d}) & i \text{ 짝수} \\ \cos(t \cdot c^{i/d}) & i \text{ 홀수} \end{cases}
$$

$c$ = 큰 상수 (보통 10000).

**왜 sin/cos 인가**:
- 주기적 함수라서 어떤 $t$ 값에 대해서도 유일한 패턴.
- 차원 $i$ 가 다르면 주기가 달라서 (높은 $i$ = 긴 주기) 다양한 timescale 동시 표현.
- 학습 안 한 새 시점에도 일반화 가능.

비유 (시계):
- 시계의 초침·분침·시침이 서로 다른 속도로 회전 — 어떤 시각도 유일한 조합으로 표현.
- Position embedding 도 같은 원리 — 차원마다 다른 주기로 시간을 인코딩.

**ProTran 의 사용**:
- Eq 5 의 context embedding 에 더해짐.
- Eq 9, 20 의 hidden update 에 또 더해짐.
- paper: "ProTran 에서도 important" 라고 명시.

---

## 5.7 ProTran 이 Transformer 를 다르게 쓰는 점

### 핵심 차별점 — 표로 정리

| 항목 | 표준 Transformer (NLP) | ProTran |
|------|---------------------|---------|
| **Attention 대상** | 관측 토큰 $x_{1:T}$ | **잠재 변수 $z_{1:T}$ + 관측 일부** |
| **Output** | 결정론적 (한 토큰) | **확률적 (잠재 sampling)** |
| **Generation** | Autoregressive (한 토큰씩) | **Non-autoregressive (잠재에서 한 번에)** |
| **Inference** | 그냥 forward pass | **Variational (Eq 10-11)** |
| **확률성** | 명시적 없음 | **잠재 variance 로 명시** |

### 왜 잠재에 attention 을 적용하는가 (재강조)

**관측 vs 잠재 의 차이**:
- 관측 $x_t$: 노이즈 많음, 고차원, raw.
- 잠재 $z_t$: 정제됨, 저차원, abstract.

**Attention 을 어디에 거는가의 효과**:
- 관측에 attention: "노이즈 많은 raw 데이터들끼리 비교" → 노이즈 전파 가능.
- 잠재에 attention: "정제된 의미들끼리 비교" → 의미 있는 관계 추출.

비유:
- 관측 attention = 원본 사진 100장을 비교 — pixel-level noise 도 같이 비교.
- 잠재 attention = 각 사진의 caption 100개를 비교 — 의미만 비교.

→ ProTran 의 이 design 이 **TimeGrad / CSDI 등 후속 시계열 diffusion 모델들** 에 영향을 줌.

---

## 5.8 Eq 4 에서 Eq 5 로의 transition

paper Section 2.2 (Eq 4) 가 일반 Transformer 의 정의. Section 3.1 (Eq 5-9) 부터 ProTran 의 구체 architecture.

**Eq 4 → Eq 5 의 변화**:
- Eq 4: Attention 의 일반 수식 (어떤 sequence 든 적용).
- Eq 5: ProTran 의 **context 전처리** 단계 — 관측 $x_t$ 를 hidden $h_t$ 로 변환.

paper p.4 인용:
> While a traditional transformer model often dedicates an entire encoder for the same purpose, we find such a simple mapping works sufficiently well in conjunction with the context-attention module of the corresponding decoder.

→ ProTran 은 context 전처리를 **단일 MLP + position** 으로 끝낸다 (full encoder 안 함). 무거운 작업은 latent 단계에 맡김.

---

## 5.9 Eq 4 의 단계별 numerical example

추상적인 수식을 구체화. $\ell_q = 3, \ell_k = 4, d = 4$ 의 작은 예.

### Setup

$$
Q = \begin{pmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 0 & 1 \\ 1 & 1 & 0 & 0 \end{pmatrix}, \quad
K = \begin{pmatrix} 1 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \\ 1 & 0 & 0 & 1 \end{pmatrix}
$$

$V$ 는 K 와 같다고 가정 (self-attention 형태).

### Step 1: $QK^T$

$$
QK^T = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 1 & 1 & 1 & 1 \\ 2 & 1 & 0 & 1 \end{pmatrix}
$$

해석: 각 query 와 각 key 의 내적. (3, 4) 행렬.

### Step 2: $/\sqrt{d} = /2$

$$
QK^T / 2 = \begin{pmatrix} 0.5 & 0.5 & 0.5 & 0.5 \\ 0.5 & 0.5 & 0.5 & 0.5 \\ 1.0 & 0.5 & 0 & 0.5 \end{pmatrix}
$$

### Step 3: Softmax (각 행마다)

Row 1: softmax([0.5, 0.5, 0.5, 0.5]) = [0.25, 0.25, 0.25, 0.25] (균등).
Row 2: same.
Row 3: softmax([1.0, 0.5, 0, 0.5]) ≈ [0.43, 0.26, 0.16, 0.26] (3번째 query 는 1번째 key 에 가장 큰 attention).

$$
\text{Softmax}(QK^T/2) = \begin{pmatrix} 0.25 & 0.25 & 0.25 & 0.25 \\ 0.25 & 0.25 & 0.25 & 0.25 \\ 0.43 & 0.26 & 0.16 & 0.26 \end{pmatrix}
$$

### Step 4: × V

$$
O = \begin{pmatrix} \ldots \end{pmatrix} \times V
$$

각 query 마다 V 의 행들을 attention weight 으로 가중합.

→ 출력 $O$ 는 (3, 4) 행렬 — 각 query 에 대해 V 행의 가중합.

### 의미 정리

| 단계 | 의미 |
|------|------|
| $QK^T$ | "각 query 와 각 key 의 유사도" |
| $/\sqrt{d}$ | "유사도 점수가 너무 극단으로 가지 않게 조정" |
| Softmax | "유사도를 확률로 변환 (각 query 의 attention 분포)" |
| × V | "value 를 attention 비율로 섞어서 출력" |

---

## 5.10 Multi-head 의 numerical 의미

$H = 8$ head 의 경우:
- 각 head 는 $W^Q_h, W^K_h, W^V_h$ 의 다른 학습 행렬.
- Head 마다 다른 "관점" 의 attention.

비유 (전문가 회의):
- 8명의 전문가가 같은 질문에 다른 관점에서 답.
- 8개 답을 모두 결합 → 더 풍부한 답.

→ ProTran 의 $H=8$ 은 8개 관점의 latent attention.

---

## 5.11 자기점검 (이 챕터)

### 핵심 5가지
1. **Eq 4 의 Softmax 가 하는 일을 한 줄로?**
2. **Self-attention 과 Cross-attention 의 차이는?**
3. **왜 ProTran 은 잠재 $z$ 에 attention 을 거나? 관측 $x$ 에 거지 않고?**
4. **$\sqrt{d}$ 로 나누는 이유는?**
5. **Multi-head 가 single-head 보다 좋은 이유는?**

### 답변
1. "각 query 에 대해, 모든 key 와의 매칭 점수를 확률(softmax) 로 변환" — 즉 "이 query 에 어떤 책을 얼마나 참고할지" 의 가중치 계산.
2. Self = Q, K, V 가 같은 source (한 sequence 안에서 자기 참조). Cross = Q 는 한 source, K/V 는 다른 source (예: query 가 잠재, key/value 가 context). ProTran 은 둘 다 사용.
3. 관측 $x$ 는 노이즈 많은 raw 데이터 — 거기에 attention 을 걸면 노이즈가 전파된다. 잠재 $z$ 는 정제된 추상 상태 — 잠재에 attention 을 걸면 의미 있는 관계만 추출된다. 이게 ProTran 의 핵심 design choice 이고, 후속 시계열 diffusion 모델들에 영향을 줌.
4. $d$ 가 클 때 $QK^T$ 의 분산이 $d$ 에 비례해서 큼 → softmax 가 극단으로 (한 key 만 1, 나머지 0) → gradient 작아짐. $\sqrt{d}$ 로 나누면 분산이 $O(1)$ 로 유지 → softmax 가 부드럽게 → gradient 안정.
5. 한 head 는 한 관점만 학습. Multi-head (예: 8) = 다른 $W^Q_h, W^K_h, W^V_h$ 행렬로 8개 다른 관점의 attention → 더 풍부한 표현력. 8명 전문가 회의 비유.

다음 [06_single_layer_generative.md](06_single_layer_generative.md) 에서 ProTran 의 핵심 — single-layer generative model (Eq 5-9) 을 step-by-step.
