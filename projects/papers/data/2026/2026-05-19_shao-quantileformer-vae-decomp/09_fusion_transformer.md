# 09 Fusion Transformer with Cross-Attention — Section 4.4

paper p.4 의 Section 4.4. **두 path 의 결합** — drift ($\chi^Q_{eout}$) 와 divergence ($\chi^d_{out}$) 을 cross-attention 으로 fusion.

![Fig. 2 architecture — 우측 부분](figures/Fig2_architecture.png)

(Figure 2 의 우측 Fusion Transformer 블록)

---

## 디자인 의도

paper p.4:
> To fuse the output features from different components to form the final prediction, we design a Fusion Transformer with cross-attention to establish a soft correspondence between the drift-divergence (i.e., $\chi^Q_{eout}$ and $\chi^d_{out}$).

**Soft correspondence**: drift 와 divergence 가 strict 한 mapping 이 아닌 **유연한** attention 으로 연결.

---

## Linear Projection 으로 Alignment (paper p.4)

> We first align $\chi^d_{out}$ with $\chi^Q_{eout}$ using a linear projection $W^a$. Then we adopt three linear projections $W_K, W_Q, W_V$ to generate the Query-Key-Value triples as follows.

### Eq 16 — Q, K, V projection

$$
Q = \chi^d_{out} \cdot W_a \cdot W_Q, \quad K = \chi^Q_{eout} \cdot W_K, \quad V = \chi^Q_{eout} \cdot W_V
$$

### 수식 4줄 풀이

**기호 뜻**:
- $\chi^d_{out}$: VAE 의 출력 — divergence 의 distribution-enriched representation
- $W_a$: alignment 행렬 — divergence 와 drift 의 차원 맞춤
- $W_Q, W_K, W_V$: 표준 Transformer 의 projection matrices
- $\chi^Q_{eout}$: drift Transformer encoder 출력

**일상 비유**:
- **번역기**: 영어 ($K, V$) 를 한국어 ($Q$) 로 번역.
- divergence (한국어 화자) 가 "지금 알고 싶은 것" 을 query 로.
- drift (영어 데이터베이스) 가 "알고 있는 정보" 의 key/value.
- Cross-attention 으로 divergence 가 drift 에서 정보 가져옴.

**왜 이 형태인가**:
- **Encoder-decoder 의 cross-attention 과 동일**: 표준 Transformer 의 검증된 패턴.
- **Divergence 가 query, drift 가 key/value 의 이유**: drift = smooth, predictable, **알고 있는** 정보. divergence = complex, **알고 싶은** 정보. Query (모름) 가 key/value (앎) 에서 정보 추출.
- $W_a$ 가 필요한 이유: 두 path 의 차원이 다를 수 있음 (VAE output 의 latent dim 이 encoder output 의 dim 과 다름) → alignment 필요.

**조심할 점**:
- $W_a, W_Q, W_K, W_V$ 가 4개 별도 학습 파라미터 — overparameterization 위험. Regularization (dropout) 필요.
- Multi-head 형태 (paper 가 multi-head 라고 명시) → 위 식이 head 별로 별도 계산 후 concat.
- Soft alignment 의 한계: drift 가 매우 sparse 할 때 attention weight 가 너무 집중될 수 있음 → entropy regularization 가능 (paper 명시 안 함).

**각 source**:
- **Query** $Q$: $\chi^d_{out}$ (divergence path, VAE output)
  - 먼저 $W_a$ 로 dimension align
  - 그 다음 $W_Q$ 로 query projection
- **Key** $K$: $\chi^Q_{eout}$ (drift path, encoder output)
- **Value** $V$: $\chi^Q_{eout}$ (drift path, 같은 source)

**해석**:
- Query = "내가 (divergence가) 알고 싶은 것"
- Key/Value = "drift 가 가진 정보"
- → divergence path 가 drift path 에서 **soft-aligned 정보 추출**.

---

## Cross-Attention Fusion (Eq 17)

paper text:
> We then apply cross-attention among Q, K, and V and following by a FeedForward Network (FFN) to enhance the expressive capability of the model.

paper Eq 17:
$$
\text{Fusion} = \text{LayerNorm}\Big(\text{SelfAtt}(Q, Q, Q) + \text{CrossAtt}(\text{Input}, K, V) + \text{FFN}(\text{Input})\Big)
$$

### Component 별 의미

| Component | 입력 | 역할 |
|-----------|------|------|
| **SelfAtt(Q, Q, Q)** | divergence path | Divergence 내부의 self-attention |
| **CrossAtt(Input, K, V)** | Input 이 query / drift path 가 K, V | Divergence 가 drift 에서 정보 가져옴 |
| **FFN(Input)** | Input (=Q or fused) | 비선형 변환 |

세 component 의 **합** 을 LayerNorm 으로 안정화.

paper text 의 "Input" 은 명확히 명시 안 됨. 본 deep dive 의 해석: **CrossAtt 의 query** = previous fusion layer 출력 (또는 첫 layer 에서는 $Q$). FFN 도 same path.

---

## Residual Connection 의 의미

paper p.4:
> The residual connections allow the network to retain the original Gaussian mathematical implications, which contain quantile drift and Gaussian components information to enrich the final predictions.

**왜 residual?**:
- Cross-attention 만으로는 원본 (drift + Gaussian) 정보가 변질될 수 있음.
- Residual 로 원본 정보를 보존 + cross-attention 으로 추가 정보 학습.
- Gaussian distribution 의 mathematical 의미 (분산, 평균, etc) 가 유지.

---

## Final Output (Eq 18)

paper Eq 18:
$$
\hat{y} = W(\text{Fusion})
$$

- $W$ = linear prediction head.
- Output $\hat{y}$ = quantile predictions (5개 quantile 동시 출력).

shape: $\hat{y} \in \mathbb{R}^{O \times |Q|}$ — output 길이 $O$ × quantile 개수 $|Q|$.

---

## 인터랙티브 시각화 — Fusion 의 흐름

`autoformer-fft-acorr` 같은 step-by-step viz 와 비슷한 디자인으로 표현 가능. 본 deep dive 의 ASCII 도식 (ch19) 으로 흐름 표현.

---

## ASCII 도식 — Fusion Transformer

```
        χ^Q_eout (drift path)           χ^d_out (divergence path)
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
                     ┌──────↓──────────────────┐
                     │ CrossAtt(Input, K, V)   │ ← divergence asks, drift answers
                     │ SelfAtt(Q, Q, Q)        │ ← divergence self-context
                     │ FFN(Input)              │ ← non-linear refine
                     └──────┬──────────────────┘
                            │ sum + LayerNorm
                            ↓
                       Fusion vector
                            │
                            ↓ W (prediction head)
                            ŷ (quantile predictions)
```

---

## Multi-Head Attention (paper p.4)

paper text:
> where Att(·, ·, ·) is the multi-head attention module.

→ SelfAtt 과 CrossAtt 둘 다 multi-head. Default Transformer 의 8 head 가능성 (paper 미명시).

---

## Cross-Attention 의 직관

**Encoder-Decoder Transformer 의 cross-attention 과 동등**:
- 기존 encoder-decoder: source language (encoder) → target language (decoder).
- 본 paper fusion: drift path (encoder-like) → divergence path (decoder-like).

→ **다른 representation space 사이의 soft alignment**.

---

## Autoformer 와의 비교

| 측면 | Autoformer Decoder | QuantileFormer Fusion |
|------|--------------------|----------------------|
| Cross-attention 형태 | Auto-Correlation (cross mode) | 표준 Cross-Attention |
| 두 path 의 역할 | Encoder (seasonal) → Decoder (trend accumulation) | Drift (K, V) ← Divergence (Q) |
| 출력 | Single point ($W_S \cdot S + T$) | Multi-quantile (5 quantiles) |

**의의**:
- Autoformer 는 single value 예측을 위해 한 path 가 다른 path 를 보조.
- QuantileFormer 는 multi-quantile 예측을 위해 두 path 가 **동등하게** fusion.

---

## Fig 2 의 fusion 블록 정확히 매핑

paper Fig 2 의 우측 column:
- **Add&Norm + Multi-Head Attention** (× 2): self + cross attention
- **Feed Forward**: FFN
- **Linear (Prediction)**: $W$ in Eq 18

→ 3개 module 이 Eq 17 의 세 항 (SelfAtt + CrossAtt + FFN) 에 대응.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Fusion 의 3 component (SelfAtt + CrossAtt + FFN) 가 각각 어느 역할인가?**
2. **paper Eq 17 의 합 + LayerNorm 구조가 표준 Transformer decoder 와 다른 점은?**
3. **Output $\hat{y} \in \mathbb{R}^{O \times |Q|}$ 의 차원 의미는?**

### 답변

1. **SelfAtt(Q, Q, Q)**: divergence path 내부의 self-context. **CrossAtt(Input, K, V)**: divergence (Q) 가 drift (K, V) 에서 정보 추출. **FFN**: 비선형 변환 + 표현력 ↑. 세 component 가 합쳐져 fusion representation.
2. **표준 decoder**: 각 sublayer (self-attn → cross-attn → FFN) 가 sequential, residual connection 별도. **paper Eq 17**: 3 component 의 **합** 을 한 번에 LayerNorm — 더 compact 한 형식. 동일 효과지만 implementation 단순.
3. **$O$**: forecasting horizon 길이 (예: 96 step). **$|Q|$**: quantile 개수 (5 = 0.5, 0.6, 0.7, 0.8, 0.9). 각 시점에 5개 quantile 동시 출력 → uncertainty interval 표현.

다음 [10_loss_function.md](10_loss_function.md) 에서 joint quantile loss (Eq 19).
