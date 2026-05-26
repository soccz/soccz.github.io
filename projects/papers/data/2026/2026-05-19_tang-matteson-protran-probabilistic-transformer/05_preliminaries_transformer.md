# 05 Preliminaries — Transformer Architectures (Section 2.2)

> **🧒 한 줄 요약**: Transformer encoder. Self-attention, positional encoding.


paper p.3. 표준 Transformer attention 복습 + ProTran 만의 사용 방식.

## Multi-Head Attention 표준 형식

paper Eq 4:
$$
O_h = \text{Attention}(Q_h, K_h, V_h) = \text{Softmax}\!\left(\frac{Q_h K_h^T}{\sqrt{d}}\right) V_h
$$

paper text:
> Central to our models and other transformer-based approaches [48, 85] is the notion of attention [5], which allows the models to focus on important parts within a context.

### 수식 4줄 풀이

**기호 뜻**:
- $Q \in \mathbb{R}^{\ell_q \times d}$ — queries: "지금 알고 싶은 것 $\ell_q$ 개, 각각 $d$ 차원 벡터"
- $K, V \in \mathbb{R}^{\ell_k \times d}$ — key/value pairs: "정보 데이터베이스 $\ell_k$ 개의 (태그, 내용) 쌍"
- $h$ 첨자: $H$ 개 attention head 중 $h$ 번째
- $\sqrt{d}$ 나눔: scale factor — 큰 $d$ 에서 softmax 너무 sharp 해지는 거 방지
- $O_h$: head $h$ 의 output, 최종 $O$ 는 모든 head concat

**일상 비유**:
- $QK^T$ = "각 query 가 각 key 와 얼마나 잘 맞는가" 매트릭스 (예: 학생 질문 vs 책 인덱스 매칭)
- softmax: 매칭 점수를 비율로 변환 (sum = 1)
- $\times V$: 비율대로 책 내용 섞기
- Multi-head = 여러 관점에서 동시 검색 (head 1 = 'who', head 2 = 'when', head 3 = 'why', ...)

**왜 이 형태인가**:
- **Dot product** ($QK^T$): 두 벡터의 cosine similarity 와 비례 — 유사한 방향이면 큰 값.
- **Softmax**: 가중치 합이 정확히 1 — 깨지지 않는 weighted average 보장.
- **$\sqrt d$ 나눔**: $Q, K$ 가 $d$ 차원 random 벡터면 $QK^T$ 의 분산이 $d$ 만큼 커짐 → softmax 가 단일 값에 너무 집중되는 것 방지.
- **Multi-head**: single attention 의 단조로움 회피 → 여러 의미축 동시 학습.

**조심할 점**:
- $O(\ell_q \ell_k d)$ time, $O(\ell_q \ell_k)$ memory — long sequence 부담.
- Softmax 의 sharpness 가 학습 안정성 영향 — gradient explosion 가능.
- Position encoding 필수 — attention 자체는 순서 정보 없음.

### Multi-head 분해

**Multi-head 분해**:
$$
Q_h = Q W^Q_h, \quad K_h = K W^K_h, \quad V_h = V W^V_h
$$

learning parameters $W^Q_h, W^K_h, W^V_h$ for each head $h \in [1, H]$.

→ 각 head 가 다른 projection 으로 다른 의미 측면 학습.

---

## Self-attention vs Cross-attention

paper p.3:
> In case $Q = K = V$, we refer to such an attention mechanism as self-attention.

**Self-attention**: $Q = K = V$ — 같은 source 의 내부 dependency.

**Cross-attention**: $Q \neq K = V$ — 다른 source 에서 정보 추출.

ProTran 은 **둘 다 사용**:
- Eq 6: $Q = w_{t-1}, K = V = w_{1:t-1}$ — latent 의 self-attention
- Eq 7: $Q = \bar{w}_t, K = V = h_{1:C}$ — latent → context cross-attention
- Eq 10: $Q = K = V = h_{1:T}$ — observation 의 self-attention (smoothing)

---

## Transformer 의 핵심 장점

paper p.3:
> Given fully observed sequences of inputs, the mapping can be computed efficiently without any imposed sequential order often seen in recurrent neural networks [19, 42]. More importantly, the direct connections between long-distance time steps are baked into the mechanism as information from previous time steps is easily accessible without being compressed into a fixed representation, easing optimization and learning of long-term dependencies [5, 85].

**RNN 대비 두 장점**:
1. **No sequential order**: parallel computation 가능.
2. **Direct long-distance connections**: 정보 손실 없이 어떤 거리도 attention 가능.

→ Long-range dependencies 학습이 RNN 보다 훨씬 효과적. ProTran 이 RNN 완전 제거하는 이유.

---

## Position Embedding (Eq 5 의 일부)

paper p.4:
> Without recurrence, Transformer [85] encodes information about each time step $t$ with predefined sinusoidal positional embeddings $\text{Position}(t) = [p_t(1), \ldots, p_t(d)] \in \mathbb{R}^d$ where the $i$-th embedding is given by $p_t(i) = \sin(t \cdot c^{i/d})$ for even $i$ and $p_t(i) = \cos(t \cdot c^{i/d})$ for odd $i$ and $c$ is some large constant. Empirical results show that such positional embeddings are also important to our models.

**Sinusoidal position embedding**:
$$
p_t(i) = \begin{cases} \sin(t \cdot c^{i/d}) & i \text{ even} \\ \cos(t \cdot c^{i/d}) & i \text{ odd} \end{cases}
$$

표준 Transformer (Vaswani 2017) 와 동일. $c$ 는 large constant (예: 10000).

paper claim: ProTran 에서도 important.

---

## ProTran 의 Transformer 사용 방식 — 차별점

| 항목 | Standard Transformer | ProTran |
|------|--------------------|---------|
| Attention 적용 대상 | Observation tokens $x_{1:T}$ | **Latent variables $z_{1:T}$** + observations |
| Generation | Autoregressive (one token at a time) | **Non-autoregressive** (parallel latent sample) |
| Output | Deterministic | **Stochastic** (sample from $z$) |
| Inference | N/A (just forward pass) | **Variational** (Eq 10-11) |

→ ProTran 은 Transformer 의 **machinery** (attention + layer norm + MLP) 만 빌리고, 그 위에 **SSM의 latent variable structure** 를 입힘.

---

## Eq 4 ~ Eq 5 의 transition

paper Section 2.2 (Eq 4) 가 standard Transformer preliminaries. paper Section 3.1 (Eq 5-9) 부터 ProTran 의 구체적 architecture.

**Eq 4 → Eq 5 의 변화**:
- Eq 4: 일반 Transformer attention 의 정의.
- Eq 5: ProTran 의 context preprocessing — $h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))$.

→ ProTran 은 **context observations 를 가볍게 전처리** (full encoder 안 함). 무거운 작업은 latent 부분에.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Self-attention vs Cross-attention 의 차이? ProTran 의 어느 Eq 가 각각 해당?**
2. **$\sqrt d$ 로 나누는 이유는?**
3. **Sinusoidal position embedding 이 왜 attention 에 필수인가?**

### 답변

1. **Self-attention** ($Q = K = V$): 같은 source 내부 dependency 학습 — ProTran 의 Eq 6 ($w_{1:t-1}$ 의 self-attention) 과 Eq 10 ($h_{1:T}$ 의 bidirectional self-attention). **Cross-attention** ($Q \neq K = V$): 다른 source 에서 정보 추출 — ProTran 의 Eq 7 (latent → context).
2. $Q, K$ 가 $d$ 차원 벡터일 때 dot product $QK^T$ 의 표준편차가 $\sqrt d$ 에 비례 → 큰 $d$ 에서 softmax 가 단일 값에 너무 집중 (gradient vanishing). $\sqrt d$ 나눔으로 변환 후 분산 일정하게 유지 → 학습 안정.
3. Attention 식은 **순서 정보 자체 없음** ($x_1, x_2, x_3$ 와 $x_3, x_2, x_1$ 동일 처리). Position embedding 이 시간 순서 정보를 더해줘야 시계열 의미 유지. ProTran 의 Eq 5 에서 $\text{Position}(t)$ 가 LayerNorm 전에 합산.

---

## 다음

[06_single_layer_generative.md](06_single_layer_generative.md) 에서 single-layered ProTran 의 generative model (Eq 5-9).


```viz:protran-attention-pattern:title=paper §3.2 — Attention Pattern,caption=Head slider.
```
