# 08. Multi-Layered ProTran (Section 3.2)

paper p.5-6 (Section 3.2). Single-layer 를 잠재 변수의 hierarchy 로 확장.

이 챕터의 목표: **"왜 잠재를 여러 층으로 쌓는가" 의 직관을 잡고, Eq 12-20 의 새 단계 (Eq 16) 만 추가됨을 이해**.

---

## 8.1 왜 multi-layer 인가 — 직관

### 회사 조직 비유

회사를 보자:
- 사원: "오늘 어느 도로 트래픽이 평균보다 높음" — 짧은 시간의 미세 패턴.
- 팀장: "오늘은 출퇴근 러시아워" — 시간대 카테고리.
- 부장: "이번 주는 평일 5일" — 주간 패턴.
- 임원: "여름 휴가철" — 계절 trend.

각 층마다 **다른 시간 스케일·다른 추상화 수준**.

**Single-layer ProTran**: 잠재 $z_t$ 한 층 — 모든 정보가 한 곳에 압축.

**Multi-layer ProTran**: $z^{(1)}, z^{(2)}, z^{(3)}$ 여러 층 — 각 층이 다른 시간 스케일·다른 추상화.

→ 표현력 ↑. 복잡한 데이터 (예: Human3.6M 동작) 에서 결정적.

### 이미지 분야의 hierarchical VAE 영감

paper p.5:
> Inspired by recent work on hierarchical VAEs for non-sequential inputs [17, 80, 83, 101], we extend our proposed model to include several layers of latent variables, aiming to further increase its flexibility for modelling sequential data.

**영감 받은 모델들**:
- **VDVAE** (Very Deep VAE, Child 2020) — 이미지 생성 SOTA.
- **NVAE** (Vahdat & Kautz 2020) — NVIDIA 의 hierarchical VAE.
- **Ladder VAE** (Sønderby).

**왜 이미지에서 작동했나**:
- Layer 1 = "픽셀 단위 디테일" (edges, textures).
- Layer 2 = "객체 부분" (눈, 코).
- Layer 3 = "전체 객체" (얼굴).
- 각 층이 다른 추상화.

**ProTran 의 transfer**: 같은 정신을 **시간 sequence** 에 적용.

---

## 8.2 L-Layer 잠재 구조

### 원문 (paper p.5)
> We represent each time step $t$ with a Markov chain of $L$ latent variables $z_t^{(1:L)} = (z_t^{(1)}, \ldots, z_t^{(L)})$ for simplicity (see Figure 1).

### 풀어 설명

**구조**:
- 매 시점 $t$ 마다 $L$ 개의 잠재 변수: $z_t^{(1)}, z_t^{(2)}, \ldots, z_t^{(L)}$.
- 같은 시점 안에서 layer 간 **Markov chain** ($z_t^{(\ell)}$ 가 $z_t^{(\ell-1)}$ 의존).
- 시점 간 (= time 축) 비-Markovian (attention).

**2D 구조** (시간 $t$ × layer $\ell$):

```
              t=1     t=2     t=3     ...     t=T
  Layer L:   z₁⁽ᴸ⁾   z₂⁽ᴸ⁾   z₃⁽ᴸ⁾   ...    zₜ⁽ᴸ⁾  (가장 추상)
             ↑       ↑       ↑              ↑
  Layer L-1: z₁⁽ᴸ⁻¹⁾ z₂⁽ᴸ⁻¹⁾ z₃⁽ᴸ⁻¹⁾  ...   zₜ⁽ᴸ⁻¹⁾
             ↑       ↑       ↑              ↑
  ...        ...     ...     ...     ...    ...
             ↑       ↑       ↑              ↑
  Layer 1:   z₁⁽¹⁾   z₂⁽¹⁾   z₃⁽¹⁾   ...    zₜ⁽¹⁾  (가장 구체)
```

화살표 (위→아래) = layer 의존성. 같은 layer 안에서는 시간 방향 attention.

→ 위로 갈수록 추상, 아래로 갈수록 구체.

### Figure 1(c) 의 시각화

![Fig. 1(c)(d) ProTran 3 layers](figures/Fig1_graphical_models.png)

(Figure 1(c)(d), paper p.2. (c) Generation, (d) Inference. 3 layer 의 경우.)

**Figure 1(c) 어떻게 읽나**:
- 3 row × 3 col 의 격자 — 3 layer × 3 시점 보여줌.
- **검은 화살표**: generation 방향. layer 위→아래, 시점 좌→우.
- 위 layer → 아래 layer 의존 (Eq 16 — cross-layer attention).
- 아래 layer 의 모든 시점이 위 layer 의 같은 시점에 영향.

---

## 8.3 Generative + Inference Decomposition (Eq 12-13)

### paper Eq 12 (Generative):
$$
p_\theta(x_{1:T}, z_{1:T}^{(1:L)} | x_{1:C}) = \prod_{t=1}^{T} p_\theta(x_t | z_t^{(L)}) \cdot \prod_{\ell=1}^{L} \prod_{t=1}^{T} p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C})
$$

### paper Eq 13 (Inference):
$$
q_\phi(z_{1:T}^{(1:L)} | x_{1:T}) = \prod_{\ell=1}^{L} \prod_{t=1}^{T} q_\phi(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:T})
$$

### 풀어 설명

#### Eq 12 — Generative 분해

**좌변**: 전체 분포 (관측 + 모든 layer 잠재).

**우변 첫 번째 product**: $\prod_t p(x_t | z_t^{(L)})$ — **emission 은 top layer 만**.
- 가장 추상적인 layer 가 관측을 결정.
- 즉, 위 → 아래 → 관측 의 흐름.

**우변 두 번째 product**: $\prod_\ell \prod_t p(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C})$
- $z_t^{(\ell)}$ 가 의존하는 정보:
  - $z_{1:t-1}^{(\ell)}$: 같은 layer 의 이전 시점들 (단일 layer 의 Eq 6 와 동일)
  - $z_{1:T}^{(\ell-1)}$: **아래 layer 의 모든 시점들** (Eq 16, **NEW**)
  - $x_{1:C}$: context

→ 핵심 추가: **아래 layer 의 정보가 위 layer 로 전달** ($z^{(\ell-1)} \to z^{(\ell)}$).

#### Eq 13 — Inference 분해

같은 구조, 다만 prior $p_\theta$ 자리에 posterior $q_\phi$, context $x_{1:C}$ 자리에 전체 $x_{1:T}$.

#### Bottom-up generation

paper:
> Intuitively, we generate samples $x_{1:T}$ conditioning on $x_{1:C}$ by following the latent dynamics from the bottom up and using the generative process described earlier within each layer.

→ **$z^{(1)} \to z^{(2)} \to \ldots \to z^{(L)} \to x$** 흐름.

비유 (회의):
- 사원 발언 ($z^{(1)}$) → 팀장 정리 ($z^{(2)}$) → 부장 요약 ($z^{(L)}$) → 임원 결정 → 회사 행동 ($x$).

---

## 8.4 Multi-Layer ELBO (Eq 14-15)

### paper Eq 14-15:
$$
\log p_\theta(x_{1:T} | x_{1:C}) \geq \sum_{t=1}^{T} \mathbb{E}_q[\log p_\theta(x_t | z_t^{(L)})]
$$
$$
- \sum_{\ell=1}^{L} \text{KL}(q_\phi(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:T}) \| p_\theta(z_t^{(\ell)} | z_{1:t-1}^{(\ell)}, z_{1:T}^{(\ell-1)}, x_{1:C}))
$$

### 풀어 설명 — Single-layer 의 일반화

**Term 별 의미**:

| Term | 의미 | Single-layer 와 비교 |
|------|------|----------------|
| $\sum_t \mathbb{E}_q[\log p(x_t \| z_t^{(L)})]$ | Reconstruction — **top layer 만** | Eq 3 에서는 $z_t$ 였음, 이제 $z_t^{(L)}$ |
| $\sum_\ell \text{KL}$ | KL — **각 layer 마다 합산** | Eq 3 에서는 한 layer 만, 이제 $L$ layer 모두 |

**핵심 변화**:
- Reconstruction 은 top layer 만 — 가장 추상적 잠재가 관측 결정.
- KL 은 모든 layer — 각 층마다 prior 와 posterior 가 일치하도록 학습.

→ Single-layer ELBO (Eq 3) 의 자연스러운 일반화.

---

## 8.5 Per-Layer Generation — Eq 16-20

### paper Eq 16-20:
각 layer $\ell$ 의 각 시점 $t$ 에서 다음 5 step 수행:

**Eq 16** (NEW):
$$
\tilde{w}_t^{(\ell)} = \text{LayerNorm}(w_{t-1}^{(\ell)} + \text{Attention}(w_{t-1}^{(\ell)}, w_{1:T}^{(\ell-1)}, w_{1:T}^{(\ell-1)}))
$$

**Eq 17** (= Eq 6):
$$
\bar{w}_t^{(\ell)} = \text{LayerNorm}(\tilde{w}_t^{(\ell)} + \text{Attention}(\tilde{w}_t^{(\ell)}, w_{1:t-1}^{(\ell)}, w_{1:t-1}^{(\ell)}))
$$

**Eq 18** (= Eq 7):
$$
\hat{w}_t^{(\ell)} = \text{LayerNorm}(\bar{w}_t^{(\ell)} + \text{Attention}(\bar{w}_t^{(\ell)}, h_{1:C}, h_{1:C}))
$$

**Eq 19** (= Eq 8):
$$
z_t^{(\ell)} = \text{Sample}(\mathcal{N}(\text{MLP}(\hat{w}_t^{(\ell)}), \text{Softplus}(\text{MLP}(\hat{w}_t^{(\ell)}))))
$$

**Eq 20** (= Eq 9):
$$
w_t^{(\ell)} = \text{LayerNorm}(\hat{w}_t^{(\ell)} + \text{MLP}(z_t^{(\ell)}) + \text{Position}(t))
$$

### 핵심 관찰

| Single-layer | Multi-layer (per layer $\ell$) | 차이 |
|--------------|-------------------------------|------|
| — | **Eq 16 (NEW)**: cross-layer attention | **아래 layer 의 모든 시점에 attention** |
| Eq 6: self-attn | Eq 17: 동일 | 변화 없음 |
| Eq 7: cross-attn context | Eq 18: 동일 | 변화 없음 |
| Eq 8: sample | Eq 19: 동일 | 변화 없음 |
| Eq 9: update hidden | Eq 20: 동일 | 변화 없음 |

→ **Multi-layer 는 single-layer 위에 Eq 16 한 단계만 추가**. 우아한 generalization.

---

## 8.6 Eq 16 — Cross-Layer Attention 상세

### paper Eq 16:
$$
\tilde{w}_t^{(\ell)} = \text{LayerNorm}(w_{t-1}^{(\ell)} + \text{Attention}(w_{t-1}^{(\ell)}, w_{1:T}^{(\ell-1)}, w_{1:T}^{(\ell-1)}))
$$

### 풀어 설명

**Attention 인자**:
- **Query**: $w_{t-1}^{(\ell)}$ — 현재 layer 의 이전 시점 hidden
- **Key/Value**: $w_{1:T}^{(\ell-1)}$ — **아래 layer 의 모든 시점 hidden**

**의미**:
- 위 layer 가 아래 layer 의 **전체 시간 sequence** 를 참고.
- 아래 layer 가 충분히 학습 완료된 후, 위 layer 가 그 패턴을 더 추상화.

**비유** (회의 단계):
- 사원들 ($w^{(1)}_1, w^{(1)}_2, \ldots, w^{(1)}_T$) 의 **하루 종일 모든 발언** 을 팀장 ($w^{(2)}_t$) 이 듣고 정리.
- 단순히 한 시점이 아니라 **하루 전체** 를 봄.

**왜 $1:T$ 인가** (단순히 $1:t-1$ 이 아니라):
- 아래 layer 는 이미 생성된 상태로 가정 (bottom-up).
- 위 layer 입장에서는 아래 layer 의 **모든 시점 정보 사용 가능** (학습 완료된 결과).

---

## 8.7 복잡도

### 원문 (paper p.6)
> Stacking multiple layers of latent variables increases model expressiveness, but it also result in a linear increase in running time and the number of parameters. The time complexity for the L-layers transformer is $\mathcal{O}(LT^2d)$, while the space complexity remains $\mathcal{O}(T^2d)$ due to the Markovian structure of the chain $z_t^{(1:L)}$ at each time step $t$.

### 풀어 설명

| 항목 | Single-layer | Multi-layer ($L$ layers) |
|------|------------|----------------------|
| Time | $\mathcal{O}(T^2 d)$ | $\mathcal{O}(L T^2 d)$ |
| Memory | $\mathcal{O}(T^2 d)$ | $\mathcal{O}(T^2 d)$ |

**Time complexity**: layer 마다 한 번씩 attention → $L$ 배 증가.

**Memory**: 신기하게도 단일 layer 와 동일.
- 이유: layer chain $z_t^{(1:L)}$ 이 한 시점 안에서 Markov (한 layer 만 메모리에).
- 시점 간 attention matrix 가 메모리의 dominant factor → 그건 그대로.

### paper 의 실험적 선택

paper:
> In our experiments, we restrict the number of layers of our hierarchical models to two or three.

| Dataset | Layers ($L$) |
|---------|-----------|
| Solar | 1 |
| Electricity | 1 |
| Traffic | 2 |
| Taxi | 2 |
| Wikipedia | 2 |
| HumanEva-I | 2 |
| Human3.6M | **3** |

→ 데이터가 복잡할수록 layer 많이 ($L=3$ 은 Human3.6M).
→ 단순한 데이터 (Solar, Electricity) 는 $L=1$ 으로 충분.

---

## 8.8 ASCII — Multi-layer Architecture

```
                            x_t (emission)
                              ↑
                          MLP(w_t^{(L)})
                              ↑
        Layer L (top): ───── w_t^{(L)} (가장 추상)
                              │
                              ↑ Eq 17-18-19-20: within-layer steps
                              │
                              ↑ Eq 16: cross-layer attention
                              │   Q = w_{t-1}^{(L)}
                              │   K,V = w_{1:T}^{(L-1)} (아래 layer 전체)
                              │
        Layer L-1:    ─────── w_t^{(L-1)}
                              │
                              ↑ (Eq 16 + 17-18-19-20)
                              │
                          ...
                              │
        Layer 1 (bot): ────── w_t^{(1)} (가장 구체)
                              │
                              ↑ Eq 17-18-19-20 (Eq 16 skipped, layer 0 없음)
                              │
                          From context + previous w_{1:t-1}^{(1)}
   
   각 layer ℓ 에서 매 시점 t:
      Eq 16: cross-layer attention (위→아래에서 정보 가져옴, ℓ>1 일 때만)
      Eq 17: within-layer self-attention (시간 축 과거)
      Eq 18: context cross-attention
      Eq 19: sample z^{(ℓ)}_t (Gaussian)
      Eq 20: update w^{(ℓ)}_t (다음 시점 준비)
   
   최종: x_t = MLP(w^{(L)}_t)  ← top layer 만 emission
```

---

## 8.9 정리 — Single → Multi 의 핵심

| 측면 | Single-layer | Multi-layer |
|------|------------|----------|
| 잠재 변수 | $z_t$ 한 개 | $z_t^{(1)}, \ldots, z_t^{(L)}$ |
| Attention 종류 | 2개 (self + cross-context) | **3개** (+ cross-layer) |
| 새 수식 | Eq 5-11 | + Eq 16 만 추가 |
| 표현력 | 한 추상화 수준 | $L$ 개 추상화 수준 |
| Emission | $x_t = \text{MLP}(w_t)$ | $x_t = \text{MLP}(w_t^{(L)})$ (top 만) |
| Time complexity | $\mathcal{O}(T^2 d)$ | $\mathcal{O}(L T^2 d)$ |
| Memory | $\mathcal{O}(T^2 d)$ | $\mathcal{O}(T^2 d)$ (동일) |

→ Multi-layer 는 single-layer 위에 **layer 간 attention 한 단계** 만 추가한 우아한 확장.

---

## 8.10 자기점검 (이 챕터)

### 핵심 3가지
1. **Multi-layer 가 single-layer 와 비교해서 새로 추가된 수식은?**
2. **Emission 이 top layer ($z^{(L)}$) 만 의존하는 이유는?**
3. **데이터 복잡도에 따라 layer 수 ($L$) 를 어떻게 선택하나?**

### 답변
1. Eq 16 — cross-layer attention. 위 layer ($\ell$) 가 아래 layer ($\ell-1$) 의 **모든 시점 ($1:T$)** 에 attention. Eq 17-20 은 single-layer 의 Eq 6-9 와 동일.
2. Bottom-up 정신: $z^{(1)} \to z^{(2)} \to \ldots \to z^{(L)} \to x$ 흐름. 가장 추상적 layer 가 모든 정보를 종합한 상태이므로, emission 은 거기서만 발생. 사원-팀장-부장 비유: 회사 행동은 임원(top) 의 결정에서 나옴.
3. paper 의 실험: 단순한 데이터 (Solar, Electricity) 는 $L=1$, 중간 (Traffic, Taxi, Wikipedia, HumanEva-I) 은 $L=2$, 가장 복잡한 (Human3.6M, 3.6M frames × 17 joints) 는 $L=3$. 데이터의 multi-modal 성, 시간 길이가 클수록 $L$ 늘림.

다음 [09_related_work.md](09_related_work.md) 에서 paper Section 4 의 4 부류 관련 연구.
