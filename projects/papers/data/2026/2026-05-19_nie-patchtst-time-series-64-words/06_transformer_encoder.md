# 06 Transformer Encoder — vanilla 그대로

paper Section 3.1 의 Transformer 사양.

## Encoder backbone — "vanilla"

paper p.4:

> We use a vanilla Transformer encoder that maps the observed signals to the latent representations.

**핵심 결정**:
- **Decoder 없음** — encoder 만 (BERT/ViT 스타일)
- **Vanilla** — 새 attention 변형 없음 (ProbSparse, Auto-correlation, Fourier 등 안 씀)
- 차별점은 **input** (patching + channel-indep), Transformer 본체는 표준

→ "Transformer 의 단순함을 신뢰". 복잡한 attention 변형이 본질이 아님.

---

## Multi-head attention 정의

paper p.4:

> Then each head $h = 1, \ldots, H$ in multi-head attention will transform them into query matrices $Q_h^{(i)} = (x_d^{(i)})^T W_h^Q$, key matrices $K_h^{(i)} = (x_d^{(i)})^T W_h^K$ and value matrices $V_h^{(i)} = (x_d^{(i)})^T W_h^V$, where $W_h^Q, W_h^K \in \mathbb{R}^{D \times d_k}$ and $W_h^V \in \mathbb{R}^{D \times D}$.

**Projection 차원**:
| Matrix | Dimension |
|--------|-----------|
| $Q_h^{(i)}$, $K_h^{(i)}$ | $\mathbb{R}^{N \times d_k}$ |
| $V_h^{(i)}$ | $\mathbb{R}^{N \times D}$ |
| $W_h^Q, W_h^K$ | $\mathbb{R}^{D \times d_k}$ |
| $W_h^V$ | $\mathbb{R}^{D \times D}$ |

---

## Attention 연산

paper p.4 (Eq, 번호 없음):
$$
(O_h^{(i)})^T = \text{Attention}(Q_h^{(i)}, K_h^{(i)}, V_h^{(i)}) = \text{Softmax}\!\left(\frac{Q_h^{(i)} K_h^{(i) T}}{\sqrt{d_k}}\right) V_h^{(i)}
$$

- $O_h^{(i)} \in \mathbb{R}^{D \times N}$
- 표준 Transformer attention (Vaswani 2017, Eq 1)
- $N = 42$ (PatchTST/42) 또는 $64$ (/64) — patch 수만큼만 attention

---

## BatchNorm — LayerNorm 아님

paper p.4 footnote:
> Zerveas et al. (2021) has shown that BatchNorm outperforms LayerNorm in time series Transformer.

**시계열 특이점**:
- NLP / CV 의 Transformer 는 LayerNorm
- 시계열 Transformer 는 **BatchNorm 이 더 좋다** (Zerveas 2021 발견)
- PatchTST 도 이를 따라 BatchNorm 사용

→ 작은 detail 이지만 중요. 다른 시계열 Transformer 들도 BatchNorm 채택 추세.

---

## Multi-head attention block 전체 구성

paper p.4:
> The multi-head attention block also includes BatchNorm layers and a feed forward network with residual connections as shown in Figure 1.

```
Input: x_d^(i) ∈ R^{D×N}
   ↓
[Multi-Head Attention] ─→ residual ─→ BatchNorm
   ↓
[Feed Forward] ─→ residual ─→ BatchNorm
   ↓
Output: z^(i) ∈ R^{D×N}
```

- $z^{(i)}$ 는 patch 별 representation
- $N$ 개 patch 각각이 $D$ 차원

---

## Output head

paper p.4:
> Afterwards it generates the representation denoted as $z^{(i)} \in \mathbb{R}^{D \times N}$. Finally a flatten layer with linear head is used to obtain the prediction result $\hat{x}^{(i)} = (\hat{x}_{L+1}^{(i)}, \ldots, \hat{x}_{L+T}^{(i)}) \in \mathbb{R}^{1 \times T}$.

**Flatten + Linear head**:
1. $z^{(i)} \in \mathbb{R}^{D \times N}$ → flatten → $z_{flat}^{(i)} \in \mathbb{R}^{D \cdot N}$
2. Linear layer: $W_{head} \in \mathbb{R}^{(D \cdot N) \times T}$
3. $\hat{x}^{(i)} = z_{flat}^{(i)} \cdot W_{head}$

→ 단순. 모든 patch 의 representation 을 평탄화하고 한 번에 linear map.

---

## Hyperparameter (paper Appendix A.1)

| 항목 | 값 | 비고 |
|------|-----|------|
| Latent dim $D$ | 16, 64, 128 | dataset 따라 |
| Attention heads $H$ | 4, 8, 16 | |
| FFN dim | 128, 256, 512 | |
| Encoder layers | 3 | 모든 dataset |
| Dropout | 0.05, 0.1, 0.2, 0.3 | |
| Position encoding | learnable | $W_{pos} \in \mathbb{R}^{D \times N}$ |
| Norm | BatchNorm 1D | LayerNorm 아님 |
| Batch size | 32, 128 | |
| Learning rate | 1e-4 | |
| Optimizer | Adam | |

→ paper 의 hyperparameter 표는 Appendix A.1 에 dataset 별로.

---

## Channel-indep 에서 weight 공유 의미

```
M=321 channels (Electricity dataset)
   ↓ split
x^(1), x^(2), ..., x^(321)   ← 모두 같은 형태 (1, L)
   ↓ patching (같은 P, S)
patches^(1), ..., patches^(321)   ← 모두 같은 형태 (P, N)
   ↓ projection (같은 W_p, W_pos)
embeddings^(1), ..., embeddings^(321)   ← 같은 weight!
   ↓ Transformer (같은 instance)
z^(1), ..., z^(321)   ← 같은 attention, FFN, BN weight!
   ↓ head (같은 W_head)
ŷ^(1), ..., ŷ^(321)   ← concatenate → ŷ ∈ (M, T)
```

→ **하나의 모델 instance** 가 모든 321 channel 처리. Memory 효율 + parameter 효율.

---

## Parameter count 비교

**Channel-mixing** (Informer/FEDformer):
- Embedding: $\mathbb{R}^{M \times D}$ — M 에 비례
- 큰 M (Traffic 862, Electricity 321) 에서 parameter 폭발

**Channel-indep** (PatchTST):
- Embedding: $\mathbb{R}^{P \times D}$ — M 과 무관
- 모든 channel 이 같은 weight → 총 parameter ≪ Channel-mixing

paper Appendix Table 4 (parameter count):
- PatchTST/42: 0.4M ~ 1.8M (dataset 따라)
- 다른 Transformer: 1.5M ~ 60M

→ PatchTST 가 가장 작은 모델로 SOTA.

다음 [07_instance_norm_loss.md](07_instance_norm_loss.md) 에서 Instance Norm + MSE loss 세부.
