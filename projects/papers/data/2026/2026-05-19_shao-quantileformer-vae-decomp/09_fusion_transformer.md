# 09. Section 4.4 (Fusion Transformer with Cross-Attention) — 두 path 의 결합

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Fusion Transformer** — 두 path (drift + divergence) 가 어떻게 결합되는가
- **Cross-Attention** 의 Q/K/V 비대칭 설계 — 본 논문의 핵심 design choice
- **Eq 16-18** 의 정확한 의미
- Q/K/V 비대칭의 정보론적 의미 (★ paper 미명시, 본 해체 추가)

---

논문 4쪽 (Section 4.4) 을 풀어본다. **두 path (drift + divergence) 를 cross-attention 으로 결합** 하는 모듈.

핵심 수식: **Eq 16 (Q/K/V projection) → Eq 17 (fusion) → Eq 18 (final output)**.

![Fig. 2 architecture — 우측 부분](figures/Fig2_architecture.png)

(Figure 2 의 우측 Fusion Transformer 블록.)

---

## 9.1 시작하기 전 — Cross-Attention 이 정확히 뭔지

영어를 못해도 이해할 수 있도록 처음부터.

### Self-Attention vs Cross-Attention

**Self-Attention** (ch08 에서 본 것):
- 한 source 안에서 단어들 사이의 관계.
- $Q, K, V$ 가 **같은 source** 에서 나옴.

**비유**: "I went to the school" 안에서 "I" 가 "went" 와 어떻게 연관되는지 학습.

**Cross-Attention**:
- **두 다른 source** 사이의 관계.
- $Q$ 가 한 source, $K, V$ 가 **다른 source**.

**비유**: 영한 번역.
- $Q$ = 출력하려는 한국어 단어.
- $K, V$ = 입력 영어 문장.
- "이 한국어 단어를 출력할 때 어느 영어 단어를 봐야 할까?" 학습.

### 본 paper 에서의 cross-attention

paper Eq 16 의 디자인:
- $Q$ = **divergence path** ($\chi^d_{out}$, VAE 출력)
- $K, V$ = **drift path** ($\chi^Q_{eout}$, encoder 출력)

→ **divergence 가 query 가 되어 drift 에서 정보 추출**.

**일상 비유**: 학생 시험 결과를 보면서 ($\chi^d_{out}$ = divergence, 실제 점수 분포) "이 학생의 학습 trend ($\chi^Q_{eout}$ = drift) 가 어떠한가?" 를 묻는 것.
- 시험 결과 (divergence) = "내가 알고 싶은 것" → query.
- 학습 trend (drift) = "참고 자료" → key/value.

→ 시험 결과를 잘 설명하는 학습 trend 의 정보를 추출.

---

## 9.2 디자인 의도

### 원문 (paper p.4)

> "To fuse the output features from different components to form the final prediction, we design a Fusion Transformer with cross-attention to establish a soft correspondence between the drift-divergence (i.e., $\chi^Q_{eout}$ and $\chi^d_{out}$)."

### 한국어 풀이

**의역**: "다른 component 의 출력 feature 들을 합쳐 최종 예측을 만들기 위해, drift-divergence ($\chi^Q_{eout}$ 와 $\chi^d_{out}$) 사이의 soft correspondence 를 만드는 cross-attention 기반 Fusion Transformer 를 설계한다."

**핵심 단어**:
- **Soft correspondence**: drift 와 divergence 가 strict 한 1:1 mapping 이 아닌 **유연한** attention 으로 연결.
- Hard correspondence (예: 단순 concatenation) 의 대안.

### 비유

**Hard correspondence**: 각 학생의 시험 점수 (divergence) 와 학습 시간 (drift) 을 1:1 로 매칭 → "5시간 공부한 학생은 80점".
- 단순하지만 부정확 (다른 요인 무시).

**Soft correspondence (cross-attention)**: 한 학생의 시험 점수를 분석할 때 **모든 학생의 학습 trend** 를 가중치로 참고 → "이 학생은 비슷한 trend 의 학생들과 비교했을 때 ...".
- 더 풍부하지만 계산량 많음.

---

## 9.3 Linear Projection 으로 Alignment

### 원문 (paper p.4)

> "We first align $\chi^d_{out}$ with $\chi^Q_{eout}$ using a linear projection $W^a$. Then we adopt three linear projections $W_K, W_Q, W_V$ to generate the Query-Key-Value triples as follows."

### 왜 alignment 가 필요한가

- $\chi^d_{out}$ (divergence 출력) 과 $\chi^Q_{eout}$ (drift 출력) 의 **dimension 이 다를 수 있음**.
- Cross-attention 을 하려면 **같은 차원** 이어야 함.
- $W^a$ 가 이 dimension 변환을 담당.

### 비유

다른 언어로 된 두 책을 비교하려면 둘 다 한국어로 번역해야 함 — $W^a$ 가 그 번역기.

---

## 9.4 Q, K, V Projection — Eq 16

### paper Eq 16

$$
Q = \chi^d_{out} \cdot W_a \cdot W_Q, \quad K = \chi^Q_{eout} \cdot W_K, \quad V = \chi^Q_{eout} \cdot W_V
$$

### 🔣 식이 말하는 것 한 줄

"Query 는 **divergence** (VAE 출력), Key/Value 는 **drift** (Transformer encoder 출력) — 둘이 비대칭. 'divergence 가 drift 에 attention'".

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\chi^d_{out}$ | divergence path 의 VAE output | "각 시점의 분포 정보" | Eq 15 출력 |
| $\chi^Q_{eout}$ | drift path 의 encoder output | "각 시점의 추세 정보" | Eq 13-14 출력 |
| $W_a$ | dimension alignment 가중치 | "두 path 의 차원 맞추기 어댑터" | 매핑 자유도 ↓ |
| $W_Q, W_K, W_V$ | Q/K/V projection 가중치 | "각 역할에 맞게 변환" | learnable |
| $Q$ | Query | "내가 알고 싶은 것" (divergence) | $\chi^d_{out}$ 기반 |
| $K$ | Key | "각 시점이 무슨 정보 제공" (drift) | $\chi^Q_{eout}$ 기반 |
| $V$ | Value | "각 시점의 실제 정보" (drift) | $\chi^Q_{eout}$ 기반 |

### 🌱 Q/K/V 비대칭의 일상 비유

학생이 시험 점수 예측 받을 때:
- **Query (divergence) = "내 점수 분포 어떻게 될까?"** — 내가 알고 싶은 질문
- **Key (drift) = "학년 trend 정보"** — 참고 자료의 색인
- **Value (drift) = "학년 trend 의 실제 데이터"** — 참고 자료의 내용

→ "내 점수 (Query) 가 어느 학년 trend (Key) 와 비슷한지 찾아 → 그 trend 의 데이터 (Value) 가중합" = 예측.

### 🔑 Q/K/V 비대칭의 정보론적 의미 (★ 본 해체 추가)

**왜 Q=divergence, K/V=drift 인가? (역할이 거꾸로면?)**:
- **divergence 는 stochastic** (복잡, 잡음 많음) → "더 많은 정보가 필요한 쪽" → query 적합.
- **drift 는 deterministic** (smooth, 명확) → "신뢰할 수 있는 참고 자료" → key/value 적합.

만약 반대로 Q=drift, K/V=divergence 면:
- "trend (이미 알고 있는 것) 가 query 가 됨" → information mismatch.
- divergence 의 잡음이 attention weight 에 직접 들어옴 → 학습 불안정.

**원칙**: "더 모르는 쪽이 더 아는 쪽에 query 한다" — 정보 흐름의 자연스러운 방향.

### Eq 16 의 각 source

| 변수 | source | 의미 |
|------|--------|------|
| **Query** $Q$ | $\chi^d_{out}$ (divergence path, VAE output) | "내가 알고 싶은 것" |
| $\quad$ | $W_a$ 로 dimension align | (먼저) |
| $\quad$ | $W_Q$ 로 query projection | (그 다음) |
| **Key** $K$ | $\chi^Q_{eout}$ (drift path, encoder output) | "각 시점이 어떤 정보 제공" |
| **Value** $V$ | $\chi^Q_{eout}$ (drift path, 같은 source) | "각 시점의 실제 정보" |

### 변환 단계

```
χ^d_out (divergence)
      │
      ↓ W_a (dim alignment)
      │
   χ^d_out_aligned
      │
      ↓ W_Q
      Q  ← query

χ^Q_eout (drift)
      │
      ↓ W_K           ↓ W_V
      K               V
```

### 직관

- **Query (모름)**: divergence 는 복잡하고 stochastic → "내가 알고 싶은 것".
- **Key/Value (앎)**: drift 는 smooth 하고 predictable → "참고 자료".
- → **divergence path 가 drift path 에서 soft-aligned 정보 추출**.

---

## 9.5 Cross-Attention Fusion — Eq 17

### 원문 (paper p.4)

> "We then apply cross-attention among Q, K, and V and following by a FeedForward Network (FFN) to enhance the expressive capability of the model."

### paper Eq 17

$$
\text{Fusion} = \text{LayerNorm}\Big(\text{SelfAtt}(Q, Q, Q) + \text{CrossAtt}(\text{Input}, K, V) + \text{FFN}(\text{Input})\Big)
$$

### 🔣 식이 말하는 것 한 줄

"세 항 (self-attention + cross-attention + FFN) 의 합을 LayerNorm 으로 안정화 → fusion output". 분해된 정보를 다시 합치는 핵심.

### 🔣 4-단 기호 풀이

| Component | 입력 | 역할 | 비유 | 조심할 점 |
|-----------|------|------|------|-----------|
| **SelfAtt(Q, Q, Q)** | divergence path 만 (Q 자신) | divergence 내부 패턴 학습 | "혼자 생각 정리" | Q=K=V=divergence |
| **CrossAtt(Input, K, V)** | Input=Q, K/V=drift | divergence 가 drift 에서 정보 추출 | "참고 자료 보기" | ★ fusion 의 핵심 |
| **FFN(Input)** | Input | 비선형 변환 | "최종 정리" | 2-layer MLP + ReLU |
| **+** (3 항 sum) | 위 3 출력 | 결합 | "세 정보를 합침" | residual connection |
| **LayerNorm** | sum 결과 | 정규화 | "값 크기 조정" | 학습 안정화 |

### 🌱 일상 비유 — "학생 진로 상담"

학생이 진로 결정 때:
- **SelfAtt** = "나 혼자 내 상황 정리" (자기 자신과 대화)
- **CrossAtt** = "선배·선생님께 조언 받기" (참고 자료 추출)
- **FFN** = "정리한 내용을 결단으로 변환" (실행 plan)
- **세 항 sum + LayerNorm** = "세 정보를 균형 있게 결합 + 강도 조정"

→ 한 정보원에 의존하지 않고 **다각도 통합**.

### 🔑 왜 3 항 모두 필요?

- **SelfAtt 만**: divergence 내부 패턴만 알고, drift 정보 못 씀.
- **CrossAtt 만**: drift 정보는 있지만 divergence 내부 구조 못 잡음.
- **FFN 만**: 단순 변환, attention 없음 → 시간 dependency 못 잡음.
- **3 항 결합**: 각각의 강점이 보완 → 표현력 최대.

세 component 의 **합** 을 LayerNorm 으로 안정화.

### "Input" 이 무엇인가?

paper text 가 "Input" 을 명확히 명시 안 함. 본 deep dive 의 해석:
- **CrossAtt 의 query** = previous fusion layer 출력 (또는 첫 layer 에서는 $Q$ = $\chi^d_{out} \cdot W_a \cdot W_Q$).
- **FFN 의 입력** = same path.

→ 정확한 구현은 paper repo 가 공개 안 되어 미확정.

---

## 9.6 Residual Connection 의 의미

### 원문 (paper p.4)

> "The residual connections allow the network to retain the original Gaussian mathematical implications, which contain quantile drift and Gaussian components information to enrich the final predictions."

### 풀어 설명

**왜 residual?**:
- Cross-attention 만으로는 원본 (drift + Gaussian) 정보가 변질될 수 있음.
- Residual 로 **원본 정보 보존** + cross-attention 으로 **추가 정보 학습**.
- Gaussian distribution 의 mathematical 의미 (분산, 평균 등) 유지.

**비유**: 사진 편집 시 원본 layer 를 유지하면서 효과 layer 를 위에 겹치는 것. 원본을 잃지 않으면서 보강.

---

## 9.7 Final Output — Eq 18

### paper Eq 18

$$
\hat{y} = W(\text{Fusion})
$$

### 🔣 식이 말하는 것 한 줄

"Fusion output 을 linear projection $W$ 로 변환 → 최종 quantile 예측 $\hat y$". 본 논문의 최종 단계.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| Fusion | Eq 17 의 출력 | "통합된 정보 vector" | $\mathbb{R}^{O \times d}$ |
| $W$ | linear prediction head | "최종 정답 형태로 변환하는 가중치" | $d \to \|Q\|$ projection |
| $\hat{y}$ | quantile predictions | "5 quantile × 96 시점 예측표" | $\mathbb{R}^{O \times \|Q\|}$ |

### 🌱 일상 비유

학생 진로 상담 의 마지막 단계:
- Fusion = "통합된 진로 정보" (선배 조언 + 자기 분석 + 정리).
- $W$ = "구체적 선택지로 변환" (대학·전공 5 옵션 형태로).
- $\hat y$ = "5 옵션의 적합도 점수".

### Eq 18 풀이

- $W$ = linear prediction head (마지막 linear layer).
- Output $\hat{y}$ = quantile predictions (**5개 quantile 동시 출력**).

### Output 의 shape

$\hat{y} \in \mathbb{R}^{O \times |Q|}$

- $O$ = output 길이 (forecasting horizon, 예: 96 timesteps).
- $|Q|$ = quantile 개수 (= 5).

예: $O=96, |Q|=5$ → $\hat{y}$ 는 $96 \times 5$ matrix. 96 시점 × 5 quantile.

### 의미

"미래 96 시점 각각에 대해 5개 quantile (0.5, 0.6, 0.7, 0.8, 0.9) 값을 동시 출력".

---

## 9.8 ASCII 도식 — Fusion Transformer 전체

```
        χ^Q_eout (drift path)             χ^d_out (divergence path)
             │                                  │
             │                                  ↓ W_a (align dim)
             │                                  ↓
             │                                  Q' = W_Q · χ^d_out_aligned
             ↓ W_K                              │
             K = W_K · χ^Q_eout                 │
             ↓ W_V                              │
             V = W_V · χ^Q_eout                 │
             │                                  │
             └──────────────┬───────────────────┘
                            │
                     ┌──────↓──────────────────────────┐
                     │ CrossAtt(Input, K, V)            │ ← divergence asks, drift answers
                     │ SelfAtt(Q, Q, Q)                 │ ← divergence self-context
                     │ FFN(Input)                       │ ← non-linear refine
                     └──────┬──────────────────────────┘
                            │ sum + LayerNorm
                            ↓
                       Fusion vector
                            │
                            ↓ W (prediction head)
                            ŷ (quantile predictions, 96 × 5)
```

---

## 9.9 Multi-Head Attention

paper text:
> "where Att(·, ·, ·) is the multi-head attention module."

→ SelfAtt 과 CrossAtt 둘 다 **multi-head** (보통 8 head). 자세한 head 수는 paper 미명시.

### Multi-head 의 비유 (다시)

8명의 reader 가 한 영어 문장을 각자 다른 관점 (인물, 시간, 장소, 감정, ...) 으로 분석 → 결과를 종합. 단일 reader 보다 풍부한 이해.

---

## 9.10 Cross-Attention 의 비대칭 — 왜 divergence 가 query 인가?

paper 가 명시 안 한 design choice. 본 deep dive 의 해석:

| 측면 | Drift (K, V 역할) | Divergence (Q 역할) |
|------|------|------|
| 특성 | Smooth, predictable | Complex, stochastic |
| 의미 | "알고 있는 정보" | "알고 싶은 정보" |
| 역할 | Context (배경) | Task (작업) |

**Standard encoder-decoder Transformer 의 cross-attention 과 동일 의미**:
- 기존 encoder-decoder: source language (encoder) → target language (decoder).
- 본 paper fusion: drift path (encoder-like) → divergence path (decoder-like).

→ **다른 representation space 사이의 soft alignment**.

### 비유

번역가가 어려운 영어 문장 (divergence, 복잡) 을 번역할 때 사전 (drift, 정리된 정보) 을 참고하는 모습.
- 번역가 = divergence path (query).
- 사전 = drift path (key/value).

---

## 9.10-bis ★ Cross-attention 의 비대칭은 임의가 아니다

paper 가 명시 안 한 design choice 의 깊은 의미:

> **"Drift = K/V (단순, 알고 있음), Divergence = Q (복잡, 알고 싶음)"** 의 선택은 정보의 비대칭에 따른 자연스러운 매핑.

| 만약 거꾸로 했다면 (Drift = Q, Divergence = K/V) | 결과 |
|---|---|
| Smooth path (Drift) 가 자기보다 복잡한 source 에서 정보 추출 | **정보 흐름 비효율** — 단순 정보가 복잡 정보에서 뽑을 게 적음 |
| Cross-attention 의 표준 정신 (단순 ← 복잡) 위배 | 모델 학습 불안정 |
| 결국 fusion 효과 감소 | **q-risk 악화** |

→ paper 의 design 이 **encoder-decoder Transformer 의 정신** (encoder 가 source = K/V, decoder 가 target = Q) 을 분해 모델에 자연스럽게 transfer.

**일반 원칙**:
> "분해 후 두 path 가 있을 때, **complex path 가 query**, simple path 가 key/value" — 다른 분해 모델 (FEDformer, TimeMixer 등) 에도 적용 가능한 architectural pattern.

---

## 9.11 Autoformer 와의 비교

| 측면 | Autoformer Decoder | QuantileFormer Fusion |
|------|--------------------|----------------------|
| Cross-attention 형태 | Auto-Correlation (cross mode, FFT) | 표준 Cross-Attention (dot-product) |
| 두 path 의 역할 | Encoder (seasonal) → Decoder (trend accumulation) | Drift (K, V) ← Divergence (Q) |
| 출력 | Single point ($W_S \cdot S + T$) | **Multi-quantile (5개)** |

### 의의

- Autoformer 는 single value 예측을 위해 한 path 가 다른 path 를 **보조**.
- QuantileFormer 는 multi-quantile 예측을 위해 두 path 가 **동등하게 fusion**.

---

## 9.11-bis ★ Residual connection 의 진짜 역할

paper p.4 의 한 줄:
> "The residual connections allow the network to retain the original Gaussian mathematical implications..."

본 deep dive 의 해석 — **3 가지 기능** 동시:

### 기능 1: Gradient flow 안정화 (표준 Transformer 정신)

깊은 네트워크의 vanishing gradient 방지 (ResNet 2015 정신).

### 기능 2: Gaussian 의 통계적 의미 보존

GMM components $D = \{(\mu_k, \Sigma_k)\}$ 의 **수학적 의미** (분산, 평균) 가 fusion 거치며 변질되지 않음.

→ Cross-attention 의 비선형 mixing 후에도 원본 통계량 유지.

### 기능 3: Original divergence 정보의 short-cut

Divergence 의 원본 정보 ($\chi^d_{out}$ 자체) 가 residual 로 fusion 출력에 직접 흘러감.

→ 모델이 cross-attention 결과 + 원본 둘 다 활용 가능.

### ★ 종합

> **Residual 이 3 가지 기능을 동시에** — 일반 Transformer 의 정신 (gradient flow) + paper 의 specific design (Gaussian 보존) + 정보 손실 방지 (short-cut). 단순 add 연산 하나가 3 가지 역할 — elegant design.

---

## 9.12 Fig 2 의 fusion 블록 정확히 매핑

paper Fig 2 의 우측 column:

| Figure 2 블록 | Eq 17 의 항 |
|-------------|------------|
| **Add&Norm + Multi-Head Attention** (자기 자신) | SelfAtt(Q, Q, Q) |
| **Add&Norm + Multi-Head Attention** (cross) | CrossAtt(Input, K, V) |
| **Feed Forward** | FFN(Input) |
| **Linear (Prediction)** | $W$ in Eq 18 |

→ 3+1 = 4개 블록이 Eq 17 + Eq 18 에 정확 대응.

---

## 9.13 Section 4.4 핵심 정리

| 항목 | 내용 |
|------|------|
| 입력 1 | $\chi^Q_{eout}$ (drift, encoder 출력) → K, V |
| 입력 2 | $\chi^d_{out}$ (divergence, VAE 출력) → Q |
| 핵심 도구 | Cross-Attention (soft correspondence) |
| Fusion (Eq 17) | SelfAtt + CrossAtt + FFN, sum 후 LayerNorm |
| Output (Eq 18) | $\hat{y} = W(\text{Fusion})$ |
| Output shape | $O \times |Q|$ (96 시점 × 5 quantile) |
| Multi-head | Yes (default 8 head 추정) |
| Residual | Original Gaussian 정보 보존 |

**한 줄 핵심**:
> **"두 path (drift, divergence) 를 cross-attention 으로 fusion. Divergence 가 query (알고 싶음), drift 가 K/V (참고 자료). 결과 + linear 로 5개 quantile 동시 출력."**

다음 [10_loss_function.md](10_loss_function.md) 에서 joint quantile loss (Eq 19).

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Eq 16 에서 Q, K, V 가 각각 어느 source 에서 나오는가? 왜 그렇게 디자인했나?**
2. **Fusion (Eq 17) 의 3 component 의 역할은?**
3. **최종 출력 $\hat{y}$ (Eq 18) 의 shape 와 의미는?**

### 답변

1. **Q/K/V 의 source 와 비대칭 이유**:
   - **Q (Query)** = $\chi^d_{out}$ (divergence path, VAE 출력) → $W_a \cdot W_Q$ 통과. **"내가 알고 싶은 것"**.
   - **K (Key)** = $\chi^Q_{eout}$ (drift path, encoder 출력) → $W_K$ 통과. **"각 시점이 어떤 정보 제공"**.
   - **V (Value)** = $\chi^Q_{eout}$ (drift path, **같은 source**) → $W_V$ 통과. **"각 시점의 실제 정보"**.
   - **비대칭 이유**:
     - **divergence 는 stochastic** (복잡, 잡음 ↑) → "더 모르는 쪽" → query 적합.
     - **drift 는 deterministic** (smooth, 명확) → "더 아는 쪽 (참고 자료)" → key/value 적합.
     - 정보론적 원칙: "**더 모르는 쪽이 더 아는 쪽에 query**".
   - **표준 encoder-decoder cross-attention 정신**: NMT 의 decoder (target language, 알고 싶음) 가 encoder (source language, 알려진 정보) 에 attention 하는 것과 동일 구조.

2. **Fusion 블록의 3 항 — 각 역할**:
   - **SelfAtt(Q, Q, Q)**: divergence 내부 self-attention. "**혼자 생각 정리**" — divergence 자체의 시간 패턴 학습.
   - **CrossAtt(Input, K, V)**: divergence 가 drift 에서 정보 추출. "**참고 자료 보기**" — fusion 의 **핵심 동작**.
   - **FFN(Input)**: feed-forward (비선형 변환). "**최종 정리**" — 결합된 정보를 task-specific representation 으로.
   - **결합 방식**: 세 항을 **sum 후 LayerNorm** 으로 안정화. + **Residual connection** 으로 원본 정보 보존.
   - **왜 모두 필요?**: self-attention 만 → drift 정보 못 씀. cross-attention 만 → divergence 내부 구조 못 잡음. 둘 + FFN 의 결합이 표현력 최대.

3. **최종 출력의 shape 와 의미**:
   - **수학적**: $\hat{y} \in \mathbb{R}^{O \times |Q|}$
     - $O$ = forecasting horizon (예: 96 timesteps)
     - $|Q|$ = quantile 개수 (5: 0.5, 0.6, 0.7, 0.8, 0.9)
   - **총 출력 값**: $O \times |Q|$ = **96 × 5 = 480 개 값** 을 한 번에.
   - **의미**: "**미래 96 시점 각각에 대해 5 quantile 값**" → 미래 분포의 **시점 별 신뢰 구간**.
   - **운용 예**: "내일 0시: 50% 확률 5MW, 90% 확률 8MW. 1시: 50% 4MW, 90% 7MW. ..." 같이 96 시점 모두 분포 예측.
   - **vs 다른 모델**: DeepAR 은 한 분포 parameter ($\mu, \sigma$) 만. 본 논문은 5 quantile 직접 → 더 풍부한 분포 정보.
