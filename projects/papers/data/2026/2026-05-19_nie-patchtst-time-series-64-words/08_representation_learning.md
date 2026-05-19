# 08 Self-Supervised Representation Learning

paper Section 3.2 — patching 의 second use.

## 모티브 — Masked Autoencoder 의 시계열 도입

paper p.4:

> Self-supervised representation learning has become a popular approach to extract high level abstract representation from unlabelled data. In this section, we apply PatchTST to obtain useful representation of the multivariate time series. We will show that the learnt representation can be effectively transferred to forecasting tasks.

**핵심**: NLP (BERT) / CV (MAE) 처럼, 시계열에서도 masked autoencoder 로 representation 학습.

paper p.4:
> Among popular methods to learn representation via self-supervise pre-training, masked autoencoder has been applied successfully to NLP (Devlin et al., 2018) and CV (He et al., 2021) domains. This technique is conceptually simple: a portion of input sequence is intentionally removed at random and the model is trained to recover the missing contents.

---

## TST (Zerveas 2021) 의 두 가지 문제

paper p.5:
> Masked encoder has been recently employed in time series and delivered notable performance on classification and regression tasks (Zerveas et al., 2021). The authors proposed to apply the multivariate time series to Transformer, where each input token is a vector $x_i$ consisting of time series values at time step $i$-th. Masking is placed randomly within each time series and across different series. However, there are two potential issues with this setting:

**문제 1 — Mask 단위가 너무 작음**:
> First, masking is applied at the level of single time steps. The masked values at the current time step can be easily inferred by interpolating with the immediate proceeding or succeeding time values without high level understanding of the entire sequence, which deviates from our goal of learning important abstract representation of the whole signal.

→ 시점 단위 mask 는 **interpolation 으로 trivially 복원** 가능. Model 이 abstract pattern 학습 안 함.

**문제 2 — Output layer parameter 폭발**:
> Second, the design of the output layer for forecasting task can be troublesome. Given the representation vectors $z_t \in \mathbb{R}^D$ corresponding to all $L$ time steps, mapping these vectors to the output containing $M$ variables each with prediction horizon $T$ via a linear map requires a parameter matrix $W$ of dimension $(L \cdot D) \times (M \cdot T)$. This matrix can be particularly oversized if either one or all of these four values are large.

- $L=336$, $D=128$, $M=321$ (Electricity), $T=720$
- $W$ 크기: $43,008 \times 231,120 ≈ 10$ B parameters
- Overfit on small fine-tuning data 위험

---

## PatchTST 의 해결

paper p.5:
> Our proposed PatchTST can naturally overcome the aforementioned issues. As shown in Figure 1, we use the same Transformer encoder as the supervised settings. The prediction head is removed and a $D \times P$ linear layer is attached. As opposed to supervised model where patches can be overlapped, we divide each input sequence into regular non-overlapping patches. It is for convenience to ensure observed patches do not contain information of the masked ones. We then select a subset of the patch indices uniformly at random and mask the patches according to these selected indices with zero values. The model is trained with MSE loss to reconstruct the masked patches.

**해결 방식**:

| 문제 | TST | PatchTST |
|------|-----|----------|
| Mask 단위 | timestep | **patch** (subseries) |
| Trivial inference | 가능 (interpolation) | **불가능** (전체 patch 가 사라짐) |
| Output dim | $(L \cdot D) \times (M \cdot T)$ | **$D \times P$** |
| Overlap | - | **Non-overlap** (mask 정보 leak 방지) |

---

## Patching 의 self-sup spec

| 항목 | 값 |
|------|---|
| Patch length $P$ | 12 (self-sup, 다름!) |
| Stride $S$ | 12 (= P, non-overlapping) |
| Look-back $L$ | 512 |
| Number of patches $N$ | 42 |
| Mask ratio | **40%** |
| Mask value | 0 |
| Loss | MSE (reconstruction of masked patches) |

paper p.5:
> Otherwise stated, across all representation learning experiments the input sequence length is chosen to be 512 and patch size is set to 12, which results in 42 patches. We consider high masking ratio where 40% of the patches are masked with zero values.

---

## Architecture diff — Supervised vs Self-supervised

```
=== Supervised (Fig 1(b)) ===

Input x^(i) ∈ R^{1×L}
   ↓
Instance Norm + Patching (P=16, S=8, overlap)
   ↓
x_p^(i) ∈ R^{P×N}
   ↓
Projection + Position Embedding (W_p, W_pos)
   ↓
x_d^(i) ∈ R^{D×N}
   ↓
Transformer Encoder (3 layers)
   ↓
z^(i) ∈ R^{D×N}
   ↓
Flatten + Linear Head (W_head ∈ R^{D·N × T})
   ↓
ŷ^(i) ∈ R^{1×T}   ← prediction


=== Self-supervised (Fig 1(c)) ===

Input x^(i) ∈ R^{1×L=512}
   ↓
Instance Norm + Patching (P=12, S=12, non-overlap)
   ↓
x_p^(i) ∈ R^{P×N=42}
   ↓
Random Mask 40% of patches (set to 0)
   ↓
x_p_masked^(i)
   ↓
Projection + Position Embedding (same W_p, W_pos)
   ↓
Transformer Encoder (same 3 layers)
   ↓
z^(i) ∈ R^{D×N}
   ↓
Linear Layer (W_recon ∈ R^{D × P})   ← P, not T!
   ↓
x̂_p^(i) ∈ R^{P×N}   ← reconstructed patches
   ↓
Loss = MSE(x̂_p^(i)[masked indices], x_p^(i)[masked indices])
```

---

## Cross-learned representation — paper 의 강조

paper p.5:
> We emphasize that each time series will have its own latent representation that are cross-learned via a shared weight mechanism. This design can allow the pre-training data to contain different number of time series than the downstream data, which may not be feasible by other approaches.

**중요 함의**:
- Pre-train 시 $M_{pre}$ channel, fine-tune 시 $M_{ft}$ channel — **다른 수여도 OK**
- 예: Electricity (321 channel) 로 pre-train → ETTh1 (7 channel) 로 fine-tune
- Channel-indep + weight sharing 의 직접적 이점

→ **시계열 foundation model 의 가능성**. 다양한 dataset 에서 pre-train 가능.

---

## Fine-tuning protocol — 두 옵션

paper p.6:
> Once the pre-trained model on each dataset is available, we perform supervised training to evaluate the learned representation with two options: (a) linear probing and (b) end-to-end fine-tuning. With (a), we only train the model head for 20 epochs while freezing the rest of the network; With (b), we apply linear probing for 10 epochs to update the model head and then end-to-end fine-tuning the entire network for 20 epochs.

| 옵션 | Process | Epochs |
|------|--------|--------|
| (a) Linear probing | head 만 학습, encoder freeze | 20 |
| (b) End-to-end fine-tune | head 10 + 전체 20 | 30 total |

paper:
> It was proven that a two-step strategy with linear probing followed by fine-tuning can outperform only doing fine-tuning directly (Kumar et al., 2022).

→ Kumar (2022) 의 발견: head 먼저 (10 epoch linear probe) → 전체 (20 epoch fine-tune) 이 직접 fine-tune 보다 좋음.

---

## 인터랙티브 시각화

```viz:pat-masked-recon:title=Self-supervised masked reconstruction (interactive),caption=Patching 후 40% patch 를 random mask. Transformer 가 mask 안 된 patch 들로부터 mask 된 patch 를 복원. Reconstruction loss = MSE on masked patches only. ViT 의 MAE 와 동일 정신을 시계열에 적용.
```

---

## Self-supervised 가 왜 효과적인가

paper p.7:
> on large datasets our pre-training procedure contributes a clear improvement compared to supervised training from scratch. By just fine-tuning the model head (linear probing), the forecasting performance is already comparable with training the entire network from scratch and better than DLinear. The best results are observed with end-to-end fine-tuning.

**가설**:
1. **Pre-training 이 abstract pattern 학습** — trend, seasonality, anomaly 의 universal representation
2. **Large dataset 의 정보 추출** — supervised 가 missing 한 signal
3. **Fine-tuning data 가 적어도** pre-trained representation 으로 빠르게 적응

paper Table 4:
- Self-sup fine-tuning 이 Sup. 보다 거의 모든 경우 우수
- 특히 Electricity, Traffic, Weather (large dataset)

→ paper 의 핵심 claim: **"self-sup pre-training > scratch training on large data"**.

다음 [09_data_baselines.md](09_data_baselines.md) 에서 dataset 8 개 + baseline 7 개.
