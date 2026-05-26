# 07 Single-Layered ProTran — Inference Model (Section 3.1 part 2)

> **🧒 한 줄 요약**: Variational inference. q(z|x) encoder. ELBO.


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

### Eq 10 수식 4줄 풀이 — Bidirectional Self-Attention

**기호 뜻**:
- $h_{1:T}$: 전체 sequence (context + target) 의 embedding — training time 에만 가능
- $\text{Attention}(h_{1:T}, h_{1:T}, h_{1:T})$: $Q = K = V = h_{1:T}$ — self-attention
- 결과 $k_t \in \mathbb{R}^d$: 시점 $t$ 에서 **전체 sequence 의 정보** 를 모은 hidden representation

**일상 비유**:
- "**운전이 다 끝난 영상을 다시 돌려보며**, 시점 $t$ 에서의 운전자 의도를 영상 전체 맥락에서 재해석".
- $h_{1:T}$ = 전체 영상, $k_t$ = "시점 $t$ 의 의도, 전체 맥락에서 본 것".
- BERT 의 bidirectional attention 과 정신 동일 (NLP 의 2019 advances 가 시계열에 도착).

**왜 이 형태인가**:
- 표준 RNN inference 는 **filtering** 만 가능 — unidirectional 한계.
- Attention 은 모든 시점이 모든 시점에 접근 가능 → **smoothing** 자연스럽게.
- $k_t$ 가 target 정보 ($x_{C+1:T}$) 까지 포함 → posterior 가 prior 보다 정확.

**조심할 점**:
- $k_t$ 는 **training time only** — test time 에는 미래 모름.
- Test time 에는 Eq 11 대신 Eq 8 (prior) 사용.
- KL term 이 train 의 정확한 posterior 와 test 의 prior 사이를 좁히는 역할.

### Eq 11 수식 4줄 풀이 — Concatenate + Sample

**기호 뜻**:
- $[\hat{w}_t, k_t]$: 두 hidden 의 **concatenation** ($\mathbb{R}^{2d}$ 차원)
- $\hat{w}_t$: generative 의 step 7 output (현재까지의 latent + context 정보, $\mathbb{R}^d$)
- $k_t$: inference 의 step (target 정보 포함, $\mathbb{R}^d$)
- 둘 concat → MLP → Gaussian 의 평균 + 분산 → sample

**일상 비유**:
- $\hat{w}_t$ = "내가 시점 $t$ 까지 알게 된 것" (context only)
- $k_t$ = "전체 맥락에서 본 시점 $t$ 의 의도" (target 포함)
- Concat = "두 정보를 합쳐서 더 정확한 의도 추정"
- Sample = "그 정확한 정보로 latent $z_t$ 결정"

**왜 concat?**:
- 만약 $k_t$ 만 사용하면 generative 와 parameter share 안 됨.
- $\hat w_t$ 도 같이 사용 → MLP layer 만 다르고 attention 은 공유.
- "Generative + Inference parameter sharing" 의 표준 trick.

**조심할 점**:
- Eq 8 (generative) → Eq 11 (inference) 의 차이: input 이 $\hat w_t$ vs $[\hat w_t, k_t]$.
- 결과적으로 posterior $q_\phi$ 는 prior $p_\theta$ 보다 더 sharp 한 분포 (정보 많으니).

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

---

## 자기점검 (이 챕터)

### 핵심 4가지

1. **Filtering vs Smoothing — 두 inference 방식의 차이와 ProTran 이 smoothing 처럼 작동하는 이유는?**
2. **Eq 10 의 $k_t = \text{Attn}(h_{1:T}, h_{1:T}, h_{1:T})$ 에서 $h_{1:T}$ 가 세 번 들어가는 의미는?**
3. **Training 의 Eq 11 vs Test 의 Eq 8 — 어느 부분이 다르고, 왜 그 비대칭이 학습에 핵심인가?**
4. **Generative + Inference parameter share 의 이점은?**

### 답변

1. **Filtering**: $p(z_t | x_{1:t})$ — 과거만. RNN 의 unidirectional 한계로 강제됨. **Smoothing**: $p(z_t | x_{1:T})$ — 과거 + 미래. Training 시 ground truth 미래 있을 때 활용. ProTran 의 Eq 10 이 $h_{1:T}$ 전체에 attention → smoothing 처럼 작동 (BERT 의 bidirectional 정신).
2. Self-attention 의 $Q = K = V$ 형식 — "전체 sequence 의 각 시점이 전체 sequence 의 모든 시점에 attention". 결과 $k_t$ 는 시점 $t$ 에서 "전체 맥락에서 본 의도".
3. **Eq 11 (training)**: $z_t \sim \mathcal{N}(\text{MLP}([\hat{w}_t, k_t]), \cdot)$ — $k_t$ 가 target 정보 포함, posterior. **Eq 8 (test)**: $z_t \sim \mathcal{N}(\text{MLP}(\hat{w}_t), \cdot)$ — context only, prior. 비대칭의 핵심: training KL term 이 prior 를 posterior 흉내내도록 학습 → test time 에 prior 만으로도 좋은 generation 가능.
4. **Computational**: 동일 attention/LN/MLP block 재사용 — 학습 + inference 파라미터 절반 절약. **Statistical**: posterior 와 prior 가 비슷한 representation 공간 사용 → KL 최소화 자연스러움. **Practical**: VDVAE, NVAE 등 modern VAE 의 표준 기법.

---

다음 [08_multi_layer.md](08_multi_layer.md) 에서 hierarchical extension (Eq 12-20).


```viz:protran-elbo:title=paper Eq 10 — ELBO,caption=β slider.
```


```viz:protran-smoothing-vs-filtering:title=paper §3.2 — Smoothing vs Filtering,caption=Mode selector.
```
