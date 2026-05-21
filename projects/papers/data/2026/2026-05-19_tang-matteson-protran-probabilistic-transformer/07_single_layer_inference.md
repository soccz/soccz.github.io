# 07 Single-Layered ProTran — Inference Model (Section 3.1 part 2)

paper p.4-5. Training time 에만 사용되는 inference model. Generative model 과 parameter share.

---

## Inference Model 의 역할

paper p.4:
> We parametrize the approximate posterior $q_\phi(z_t | z_{1:t-1}, x_{1:T})$ at time step $t$ in a similar fashion to the prior $p_\theta(z_t | z_{1:t-1}, x_{1:C})$. Indeed, these parametrizations share most parameters and are done simultaneously in the same recursive loop, following the exact same steps in Equation (6) and Equation (7) (see Figure 1).

**핵심 차이**:
| 항목 | Prior $p_\theta$ | Posterior $q_\phi$ |
|------|-----------------|-------------------|
| 사용 정보 | context $x_{1:C}$ 만 | 전체 $x_{1:T}$ (target 포함) |
| 시점 | Test + Training | Training only |
| 역할 | "예측" 시 사용 | "더 정확한 latent 추정" 으로 prior 가 따라가도록 학습 |

paper:
> We note that similar sharing techniques between the generative and inference processes have emerged as a common theme among recent successful VAE models [17, 62, 83].

→ Generative + Inference 가 parameter share 는 **modern VAE 의 표준 기법** (Very Deep VAE, NVAE 등).

---

## Smoothing 의 의미

paper p.4-5:
> While the prior only has access to the conditioning observations $x_{1:C}$, the approximate posterior should take into account all observations during training, including the targets $x_{C+1:T}$. Due to the inherent unidirectional aspect of RNNs, previous work that uses RNNs to parametrize the approximate posterior often disregards such a property [22, 30, 51] and often resorts to a filtering routine $p(z_t | z_{1:t-1}, x_{1:t})$.

**RNN 의 한계**: unidirectional → 미래 observation 사용 어려움 → filtering ($x_{1:t}$ 만 사용) 으로 한계.

**ProTran 의 답**:
> In contrast, our inference procedure resembles more of the smoothing process of LDSs, factoring in both past and future observations via another application of self-attention:

→ ProTran 의 inference 는 **smoothing** — Kalman smoothing 처럼 과거 + 미래 observation 모두 활용. Attention 이라 unidirectional 한계 없음.

---

## Inference 의 추가 Step (Eq 10-11)

paper Eq 10:
$$
k_t = \text{Attention}(h_{1:T}, h_{1:T}, h_{1:T})
$$

paper Eq 11:
$$
z_t = \text{Sample}(\mathcal{N}(z_t; \text{MLP}([\hat{w}_t, k_t]), \text{Softplus}(\text{MLP}([\hat{w}_t, k_t]))))
$$

**해석**:

### Eq 10 — Bidirectional self-attention over $h_{1:T}$
- Query = Key = Value = $h_{1:T}$ (전체 sequence 의 embedding)
- 결과 $k_t$: 시점 $t$ 에서 **전체 시퀀스의 정보** 를 모은 hidden representation

→ 표준 transformer encoder 의 self-attention 과 비슷, 다만 길이 $T$ 의 sequence over all time.

### Eq 11 — Concatenate + Sample
- Generative 의 $\hat{w}_t$ (현재까지의 latent + context 정보)
- Inference 의 $k_t$ (전체 sequence 정보, target 포함)
- 둘을 **concat** → MLP → Gaussian 의 평균 + 분산
- Sample $z_t$

paper:
> Here, we replace Equation (8) in the generative model with Equation (11), where the hidden representation $k_t$ summarizing all information relevant to the current timestep $t$ has been concatenated to the latent-and-context-aware representation $\hat{w}_t$ preceding the Gaussian parametrization.

→ **Eq 8 (generation) ↔ Eq 11 (inference) 의 차이**:
- Eq 8: $z_t \sim \mathcal{N}(\text{MLP}(\hat{w}_t), \cdot)$ — context only
- Eq 11: $z_t \sim \mathcal{N}(\text{MLP}([\hat{w}_t, k_t]), \cdot)$ — target 정보까지

---

## 학습 objective (Eq 3 재인용)

paper p.5:
> The generative model and the inference model are trained end-to-end with a single stochastic variational inference objective stated in Equation (3). Such a variational bound includes the reconstruction loss for $x_{1:C}$ and the KL term for $z_{1:C}$. Alternatively, we can exclude these terms from the objective, which is equivalent to starting the inference process from $t = C + 1$ instead of $t = 1$.

**두 가지 학습 mode**:
1. **All-time inference** ($t = 1, \ldots, T$): context 부분도 reconstruction + KL.
2. **Target-only inference** ($t = C+1, \ldots, T$): target 만 inference, context 는 prior 만.

→ 두 mode 모두 정당화 가능 — paper 가 명시.

---

## 복잡도 (paper p.5)

> Our models incur a time complexity of $O(T^2 d)$ and a memory cost of $O(T^2 d)$, where $T$ is the total sequence length and $d$ is the dimensionality of the latent space.

- Self-attention 의 표준 $O(T^2)$ 복잡도.
- Latent dimension $d$ 곱셈.

paper acknowledges:
> The recursive latent dynamics also does not allow us to take full advantage of parallelizable attentions. However, we find that our models are still efficient in practice, especially for reasonably small values of $T$.

→ Recursive 한 latent generation (Eq 6-9) 때문에 완전 parallel 불가능. **Sequential** in time, 다만 short sequence 에서는 issue 없음.

---

## ASCII — Inference flow

```
Context x_{1:C} ──┐
                   │
Target x_{C+1:T} ──┴── x_{1:T}
                       │
                       ↓ Eq 5: MLP + Position + LayerNorm
                       │
                   h_{1:T}  ← full sequence embeddings (training time only)
                       │
                       ↓ Eq 10: Self-Attn over h_{1:T}
                       │
                   k_{1:T} ← bidirectional summary per timestep
                       │
For each t:
   ├── Generation steps Eq 6-7 → ŵ_t (parameter shared)
   │
   └── Eq 11 (inference):
              z_t ~ N(MLP([ŵ_t, k_t]), Softplus(MLP([ŵ_t, k_t])))
                     ↑
                  concat
                     ↑
   At test time → Eq 8 instead (no k_t, posterior unavailable)
```

---

## 학습 vs 테스트 의 비대칭

| 단계 | Generative | Inference | k_t 사용 |
|------|-----------|----------|---------|
| Training | Eq 6-9 (with k_t in Eq 11) | Eq 11 with k_t | ✓ |
| Test | Eq 6-9 (with Eq 8) | N/A | ✗ |

→ Test time 에는 target 없으니 k_t 계산 불가능 → Eq 8 의 prior 만 사용.

---

## Generative + Inference Architecture 의 요약

| Step | Eq | 입력 | 출력 | 시점 |
|------|----|------|------|------|
| Context embed | 5 | $x_{1:C}$ | $h_{1:C}$ | Train + Test |
| Full embed (inf only) | 5 | $x_{1:T}$ | $h_{1:T}$ | Train only |
| Self-attn latents | 6 | $w_{1:t-1}$ | $\bar{w}_t$ | Both |
| Cross-attn context | 7 | $\bar{w}_t, h_{1:C}$ | $\hat{w}_t$ | Both |
| Sample (gen) | 8 | $\hat{w}_t$ | $z_t$ (prior) | Test |
| Bidir attn (inf) | 10 | $h_{1:T}$ | $k_t$ | Train only |
| Sample (inf) | 11 | $\hat{w}_t, k_t$ | $z_t$ (posterior) | Train only |
| Update hidden | 9 | $\hat{w}_t, z_t$ | $w_t$ | Both |
| Emission | (Eq 1) | $w_t$ | $x_t$ | Both |

다음 [08_multi_layer.md](08_multi_layer.md) 에서 hierarchical extension (Eq 12-20).
