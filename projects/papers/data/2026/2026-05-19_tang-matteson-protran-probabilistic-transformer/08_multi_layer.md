# 08 Multi-Layered ProTran (Section 3.2)

paper p.5-6. Single-layer 를 stochastic latent 의 hierarchy 로 확장.

![Fig. 1(c)(d) ProTran 3 layers](figures/Fig1_graphical_models.png)

(Figure 1(c), (d), paper p.2. Multi-layer 의 generation + inference)

---

## Motivation

paper p.5:
> Inspired by recent work on hierarchical VAEs for non-sequential inputs [17, 80, 83, 101], we extend our proposed model to include several layers of latent variables, aiming to further increase its flexibility for modelling sequential data.

**영감**: hierarchical VAEs — Very Deep VAEs (VDVAE), NVAE 등.

**목표**: 표현력 ↑.

### Layer 의 의미 — 친근한 비유

**비유**: 글쓰기에 비유. 
- **1층 (lowest)**: 글자 단위 ("이", "건", "글") — local 디테일
- **2층**: 단어 단위 ("이건", "글이다") — 짧은 의미 단위
- **3층 (top)**: 문장 의미 ("이건 글이다", 전체 맥락) — global structure

각 층이 다른 **추상화 단계**. ProTran 의 multi-layer latents 도 같은 정신:
- 1층: short-term 패턴 (예: 시간 단위 변동)
- 2층: medium-term 패턴 (예: 일 단위 패턴)
- 3층: long-term 패턴 (예: 주간/계절)

**Generation 시 흐름**: bottom-up. 1층이 디테일 결정 → 2층이 그것들 모아 의미 → 3층이 큰 그림.

**Inference 시 흐름**: 모든 층 동시 (parameter sharing).

---

## L-Layer Latent Structure

paper p.5:
> We represent each time step $t$ with a Markov chain of $L$ latent variables $z_t^{(1:L)} = (z_t^{(1)}, \ldots, z_t^{(L)})$ for simplicity (see Figure 1).

**구조**:
- 각 시점 $t$ 에 $L$ 개의 stochastic latent: $z_t^{(1)}, z_t^{(2)}, \ldots, z_t^{(L)}$
- Layer 간 Markov chain ($z_t^{(\ell)}$ 가 $z_t^{(\ell-1)}$ 의존)
- 시점 간 비-Markovian (attention)

→ 2D structure: time ($t$) + layer ($\ell$).

---

## Generative + Inference Decomposition (Eq 12-13)

paper Eq 12:
$$
p_\theta(x_{1:T}, z_{1:T}^{(1:L)} | x_{1:C}) = \prod_{t=1}^{T} p_\theta(x_t | z_t^{(L)}) \cdot \prod_{\ell=1}^{L} \prod_{t=1}^{T} p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C})
$$

paper Eq 13:
$$
q_\phi(z_{1:T}^{(1:L)} | x_{1:T}) = \prod_{\ell=1}^{L} \prod_{t=1}^{T} q_\phi(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:T})
$$

**해석**:
- **Emission only from top layer**: $x_t | z_t^{(L)}$ (가장 위 layer 만 observation 생성)
- **Layer-by-layer**: layer $\ell$ 의 $z_t^{(\ell)}$ 는 같은 layer 의 이전 시점들 + **layer $\ell-1$ 의 모든 시점** + context 의존

paper:
> Intuitively, we generate samples $x_{1:T}$ conditioning on $x_{1:C}$ by following the latent dynamics from the bottom up and using the generative process described earlier within each layer. Analogously, inference proceeds in the same order, resulting in a variational bound similar to Equation (3):

→ **Bottom-up generation**: $z^{(1)} \to z^{(2)} \to \ldots \to z^{(L)} \to x$.

---

## Multi-Layer ELBO (Eq 14-15)

paper Eq 14-15:
$$
\log p_\theta(x_{1:T} | x_{1:C}) \geq \sum_{t=1}^{T} \mathbb{E}_q[\log p_\theta(x_t | z_t^{(L)})]
$$
$$
- \sum_{\ell=1}^{L} \text{KL}(q_\phi(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:T}) \| p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C}))
$$

**Term 별 의미**:
- **Reconstruction**: top layer $z^{(L)}$ → $x$ 만 evaluation
- **KL per layer**: 각 $L$ layer 의 KL 합

→ Single-layer 의 ELBO (Eq 3) 의 일반화. KL 이 $L$ 번 추가.

---

## Per-Layer Generation Steps (Eq 16-20)

paper Eq 16:
$$
\tilde{w}_t^{(\ell)} = \text{LayerNorm}(w_{t-1}^{(\ell)} + \text{Attention}(w_{t-1}^{(\ell)}, w_{1:T}^{(\ell-1)}, w_{1:T}^{(\ell-1)}))
$$

paper Eq 17:
$$
\bar{w}_t^{(\ell)} = \text{LayerNorm}(\tilde{w}_t^{(\ell)} + \text{Attention}(\tilde{w}_t^{(\ell)}, w_{1:t-1}^{(\ell)}, w_{1:t-1}^{(\ell)}))
$$

paper Eq 18:
$$
\hat{w}_t^{(\ell)} = \text{LayerNorm}(\bar{w}_t^{(\ell)} + \text{Attention}(\bar{w}_t^{(\ell)}, h_{1:C}, h_{1:C}))
$$

paper Eq 19:
$$
z_t^{(\ell)} = \text{Sample}(\mathcal{N}(z_t^{(\ell)}; \text{MLP}(\hat{w}_t^{(\ell)}), \text{Softplus}(\text{MLP}(\hat{w}_t^{(\ell)}))))
$$

paper Eq 20:
$$
w_t^{(\ell)} = \text{LayerNorm}(\hat{w}_t^{(\ell)} + \text{MLP}(z_t^{(\ell)}) + \text{Position}(t))
$$

---

## 단계별 의미

### Eq 16 — Cross-layer attention (NEW vs single-layer)

**수식 4줄 풀이**:

**기호 뜻**:
- $w_{t-1}^{(\ell)}$ — Query: "현재 layer $\ell$ 의 이전 시점 hidden"
- $w_{1:T}^{(\ell-1)}$ — Key/Value: "**아래 layer ($\ell-1$) 의 모든 시점**"
- 결과 $\tilde{w}_t^{(\ell)}$: 아래 layer 정보를 끌어올린 representation

**일상 비유**:
- "단어 layer (2층) 가 글자 layer (1층) 의 모든 시점을 보고, 어느 글자 조합이 현재 단어 의미에 중요한지 attention".
- 아래 layer 가 더 디테일한 정보, 위 layer 가 그것들 종합.

**왜 이 형태인가**:
- 시간 self-attention (Eq 17) + context cross-attention (Eq 18) 만으로는 layer 간 정보 전달 불가.
- **Eq 16 이 hierarchical 의 핵심** — 위 layer 가 아래 layer 의 전체 시간 ($w_{1:T}^{(\ell-1)}$) 에 attention.
- $w_{1:T}^{(\ell-1)}$ 가 이미 결정된 후 ($\ell-1$ 층 generation 완료 후) 위 layer 에 입력 → causal.

**조심할 점**:
- Bottom layer ($\ell = 1$) 에서는 $\ell - 1 = 0$ — 이건 input embedding (context $h$).
- $w^{(\ell-1)}$ 는 모든 시점 ($1{:}T$) — causal mask 아님. 다음 시점 ($t+1, ..., T$) 정보도 위 layer 가 참고.
- Memory: $O(LT^2 d)$ — layer 수만큼 attention 비용.

→ Hierarchical 구조에서 추가된 단계. **아래 layer 정보를 위로 전달**.

### Eq 17 — Self-attention within layer (same as Eq 6)
- **Query**: $\tilde{w}_t^{(\ell)}$
- **Key/Value**: $w_{1:t-1}^{(\ell)}$ (같은 layer 의 이전 시점들)
- **결과**: $\bar{w}_t^{(\ell)}$

→ Single-layer 의 Eq 6 와 동일.

### Eq 18 — Cross-attention to context (same as Eq 7)
- **Query**: $\bar{w}_t^{(\ell)}$
- **Key/Value**: $h_{1:C}$
- **결과**: $\hat{w}_t^{(\ell)}$

### Eq 19 — Sample (same as Eq 8)
- Layer-specific Gaussian sampling.

### Eq 20 — Update hidden (same as Eq 9)
- Layer-specific hidden update.

---

## Single → Multi 의 핵심 차이

| Single-layer | Multi-layer (per layer $\ell$) |
|--------------|-------------------------------|
| (Eq 6) Self-attn | (Eq 17) Same self-attn |
| (Eq 7) Cross-attn context | (Eq 18) Same cross-attn |
| (Eq 8) Sample | (Eq 19) Same |
| (Eq 9) Update hidden | (Eq 20) Same |
| — | **(Eq 16) NEW: Cross-layer attn (down-up)** |

→ Multi-layer 는 single-layer 위에 **Eq 16 만 추가**. 우아한 generalization.

---

## 복잡도 변화

paper p.6:
> Stacking multiple layers of latent variables increases model expressiveness, but it also result in a linear increase in running time and the number of parameters. The time complexity for the L-layers transformer is $O(LT^2d)$, while the space complexity remains $O(T^2d)$ due to the Markovian structure of the chain $z_t^{(1:L)}$ at each time step $t$.

| 항목 | Single | Multi (L layers) |
|------|--------|-----------------|
| Time | $O(T^2 d)$ | $O(LT^2 d)$ |
| Memory | $O(T^2 d)$ | $O(T^2 d)$ (layer chain 이 Markov 이므로 동일) |

paper:
> In our experiments, we restrict the number of layers of our hierarchical models to two or three.

→ paper experiments 는 L=2 (HumanEva-I, Wikipedia/Taxi) 또는 L=3 (Human3.6M).

---

## ASCII — Multi-layer architecture

```
                       Layer L (top)
                          │
                          ↓ Eq 19: sample z^{(L)}
                          │
                          ↓ Eq 20: update w^{(L)}
                          │
                       Layer L-1
                          ↑ Eq 16: attention down→up
                          │
                          ⋮
                          │
                       Layer 2
                          ↑ Eq 16
                          │
                       Layer 1 (bottom)
                          ↑ Eq 16 (skipped at l=1)
                          
   Per layer ℓ at each time t:
      Eq 16: cross-layer attn (w^{(ℓ-1)}_{1:T})
      Eq 17: self-attn (w^{(ℓ)}_{1:t-1})
      Eq 18: cross-attn context (h_{1:C})
      Eq 19: sample z^{(ℓ)}_t
      Eq 20: update w^{(ℓ)}_t
   
   Final emission: x_t = MLP(w^{(L)}_t)
```

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Multi-layer 의 단일 새 step (Eq 16) 의 정확한 역할은? 그 이전 / 이후 step 과의 차이는?**
2. **Multi-layer ELBO (Eq 14-15) 가 single-layer ELBO (Eq 3) 와 다른 두 가지는?**
3. **paper experiments 의 L 값 선택 (L=1 / 2 / 3) 이 어떤 dataset 특성에 따라 결정되는가?**

### 답변

1. **Eq 16**: cross-layer attention — 현재 layer 의 query 가 **아래 layer 의 모든 시점** key/value 에 attention. 새로 추가된 유일한 step. **이전 layer ($\ell-1$)** 가 완료된 후 그 정보를 끌어올리는 역할. **이후 step (Eq 17-20)** 은 single-layer 와 동일 — 같은 layer 내 self-attn / context cross-attn / sample / update.
2. (a) **Reconstruction term 위치**: emission 이 **top layer ($L$) 만** 에서 — $\mathbb{E}_q[\log p(x_t | z_t^{(L)})]$. (b) **KL term 합**: 모든 layer 의 KL 합산 — $\sum_\ell \text{KL}(q^{(\ell)} \| p^{(\ell)})$. Single-layer 의 generalization.
3. **데이터 복잡도 + 차원**: Solar/Electricity (137-370 series) → L=1 충분. Traffic/Taxi/Wikipedia (963-2000 series) → L=2 필요. Human3.6M (multi-modal, long sequence) → L=3 (최대). HumanEva-I (smaller) → L=2.

---

다음 [09_related_work.md](09_related_work.md) 에서 paper Section 4 의 4 카테고리 related work.
