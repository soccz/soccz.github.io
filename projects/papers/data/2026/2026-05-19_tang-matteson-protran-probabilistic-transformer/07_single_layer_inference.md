# 07. Single-Layered ProTran — Inference Model (Section 3.1 후반)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Variational inference (Eq 10-11)
- Smoothing — training time 에 미래 활용
- ELBO 의 정확한 유도

---

paper p.4-5 (Section 3.1 의 inference model 부분). 학습 시에만 작동하는 추가 단계 — Eq 10-11.

이 챕터의 목표: **Smoothing 과 filtering 의 차이를 이해하고, 왜 ProTran 이 smoothing 을 가능하게 했는지 설명**.

### 🌱 Inference Model — 일상 비유

**한 줄로**: "학습 시에만 미래 정보 사용 (smoothing) → 학습 신호 ↑ → test 시 prior 만으로도 잘 작동".

| 단계 | 학생 시험 비유 |
|------|--------------|
| **Training (smoothing)** | 학생이 *답안지 보면서* 풀이 학습. 답 알고 학습. |
| **Test (filtering/prior only)** | 학생이 *답안지 없이* 실전 시험. 진짜 능력 평가. |

**Smoothing vs Filtering**:
- **Filtering** (RNN 표준): 현재까지의 정보만 사용 → 모든 시점에서 future-blind
- **Smoothing** (ProTran 의 묘수): training 시 전체 sequence 사용 → 학습 신호 강화

### 🔣 ELBO 의 4-단 풀이

| 기호 | 의미 |
|------|------|
| $\log p_\theta(x \mid x_{1:C})$ | 진짜 likelihood (계산 어려움) |
| **Prior** $p_\theta(z_t \mid z_{<t}, x_{1:C})$ | Context 만 사용 — test 시 쓰는 분포 |
| **Posterior** $q_\phi(z_t \mid z_{<t}, x_{1:T})$ | 전체 sequence 사용 — training 시 쓰는 분포 |
| $D_{KL}(q \| p)$ | 두 분포의 차이 (penalty) |
| **ELBO** | $\geq \log p$ 의 lower bound, 학습 목표 |

**왜 ELBO 가 학습 신호 ↑**:
- $\log p$ 직접 최적화 X (intractable)
- ELBO 최대화 = (i) reconstruction 잘 함 + (ii) $q$ 가 $p$ 와 비슷해짐
- 결과: $p$ 가 informative 해짐 → test 시 잘 작동

### 🔑 핵심 통찰

> **Prior/Posterior 분리** 가 VAE 류 모델의 핵심. ProTran 은 이 패러다임을 transformer 에 적용 + smoothing 으로 학습 신호 강화.

---

## 7.1 큰 그림 — Inference model 이 무엇이고 왜 필요한가

지금까지 (chapter 06) 본 것: **generative model** — test 시 예측에 쓰는 것.

이제 다룰 것: **inference model** — **학습 시에만** 작동하는 추가 component.

### 왜 두 model 이 따로 있나

ELBO (Eq 3) 를 다시 보자:
$$
\log p_\theta(x|x_{1:C}) \geq \sum_t \mathbb{E}_q[\log p_\theta(x_t|z_t)] - D_{KL}(q_\phi(z_t|\ldots, x_{1:T}) \| p_\theta(z_t|\ldots, x_{1:C}))
$$

두 분포가 등장:
- **Prior $p_\theta$**: context 만 사용. **Generative model 의 일부** (Eq 6-9 가 이걸 만듬).
- **Posterior $q_\phi$**: 전체 sequence 사용. **Inference model 의 역할** (Eq 10-11 이 이걸 만듬).

### 학습 vs Test 의 비대칭

| 단계 | 사용 가능한 정보 | 사용하는 분포 |
|------|---------------|------------|
| **학습 (training)** | 전체 $x_{1:T}$ (target 정답 있음) | Posterior $q_\phi$ (Eq 10-11) |
| **테스트 (test)** | Context $x_{1:C}$ 만 | Prior $p_\theta$ (Eq 8) |

→ "학습 시 정답 알고 추정한 $q$" 가 "test 시 정답 모르고 추정하는 $p$" 의 spec 을 가르친다 (KL term 으로).

---

## 7.2 Filtering vs Smoothing — 핵심 개념

이 챕터의 가장 중요한 개념. **filtering 과 smoothing 의 차이** 를 먼저 잡자.

### 일기예보 비유

오늘이 7일이고, "5일의 날씨 잠재 상태" 를 추정하고 싶다.

**Filtering** 방식 (과거만):
- 1, 2, 3, 4, 5일의 관측을 사용.
- "5일 시점까지만 알고 5일의 잠재 추정".
- RNN 의 자연스러운 처리 방식 (한 방향).

**Smoothing** 방식 (과거 + 미래):
- 1, 2, 3, 4, 5, 6, 7일 **모든** 관측 사용.
- "전체 sequence 보고 다시 돌아가서 5일의 잠재 재추정".
- LDS 에서는 Kalman smoother 가 함.

**왜 smoothing 이 더 좋은가**:
- 6일·7일 관측이 5일의 잠재를 추정하는 데 도움.
- 예: 7일에 폭우가 왔다면, 5일의 "기압 잠재 상태" 가 사실 폭우의 전조였을 가능성 ↑.
- **미래 정보가 과거 추정을 개선**.

### 학습 시 smoothing 이 가능한 이유

학습 시에는 **정답 sequence 전체 ($x_{1:T}$) 를 알고 있음**. 그래서 미래 관측도 사용 가능.

→ ProTran 의 inference model 은 **학습 시 smoothing 으로 정확한 $z$ 추정** → KL term 으로 prior 가 따라가도록 학습.

---

## 7.3 RNN 의 한계 — 왜 기존 deep SSM 이 filtering 에 머물렀나

### 원문 (paper p.4-5)
> While the prior only has access to the conditioning observations $x_{1:C}$, the approximate posterior should take into account all observations during training, including the targets $x_{C+1:T}$. Due to the inherent unidirectional aspect of RNNs, previous work that uses RNNs to parametrize the approximate posterior often disregards such a property [22, 30, 51] and often resorts to a filtering routine $p(z_t | z_{1:t-1}, x_{1:t})$.

### 풀어 설명

**RNN 의 한계**:
- RNN 은 **한 방향** (시점 1 → 2 → ... → $T$).
- 미래 관측을 시점 $t$ 의 잠재 추정에 쓰기 어렵다 (반대 방향 RNN 또는 bidirectional 필요).
- 결국 많은 deep SSM 이 **filtering** 으로 만족 — 정확도 손실.

**ProTran 의 답**:
> In contrast, our inference procedure resembles more of the smoothing process of LDSs, factoring in both past and future observations via another application of self-attention.

- **Attention 은 방향성 없음** — 한 번에 전체 sequence 의 양방향 의존성 학습 가능.
- → smoothing 자연스럽게 구현.

비유:
- RNN = "책을 첫 페이지부터 마지막까지 한 방향으로만 읽음" (filtering)
- Attention = "책 전체를 동시에 펴놓고 모든 페이지 동시 참조" (smoothing)

---

## 7.4 Inference 의 추가 Step — Eq 10

### 원문 (paper p.5)
paper Eq 10:
$$
k_t = \text{Attention}(h_{1:T}, h_{1:T}, h_{1:T})
$$

### 풀어 설명 — Bidirectional self-attention

**Attention 의 인자**:
- Query = Key = Value = $h_{1:T}$ — **전체 sequence 의 embedding** (학습 시에만 사용 가능)

**$h_{1:T}$ 가 무엇인가**:
- Eq 5 와 똑같이 만든 hidden — 다만 적용 범위가 $1:T$ (전체) 까지.
- $h_t = \text{LayerNorm}(\text{MLP}(x_t) + \text{Position}(t))$ for $t = 1, \ldots, T$.
- 학습 시 target $x_{C+1:T}$ 도 알고 있으니 가능.

**무엇을 하나**:
- 표준 Transformer encoder 의 self-attention 과 동일.
- 모든 시점이 다른 모든 시점과 attention.
- 각 시점 $t$ 에 대해 "전체 sequence 의 모든 정보" 를 종합한 $k_t$ 산출.

**$k_t$ 의 의미**:
- "시점 $t$ 의 bidirectional summary" — 과거 + 미래 모두 반영한 hidden.

비유:
- 모든 학생의 모든 답안지를 보고, "이 학생의 의도는 무엇이었나" 를 재구성 — 단순히 한 학생의 답만 보는 것보다 정확.

---

## 7.5 Inference Sample — Eq 11

### 원문 (paper p.5)
paper Eq 11:
$$
z_t = \text{Sample}(\mathcal{N}(z_t; \text{MLP}([\hat{w}_t, k_t]), \text{Softplus}(\text{MLP}([\hat{w}_t, k_t]))))
$$

### 풀어 설명 — Eq 8 의 inference 버전

**Eq 8 (생성, test 시)**:
$$
z_t \sim \mathcal{N}(\text{MLP}(\hat{w}_t), \text{Softplus}(\text{MLP}(\hat{w}_t)))
$$

**Eq 11 (추론, training 시)**:
$$
z_t \sim \mathcal{N}(\text{MLP}([\hat{w}_t, k_t]), \text{Softplus}(\text{MLP}([\hat{w}_t, k_t])))
$$

**차이**: Eq 11 은 MLP 입력에 **$k_t$ 가 concatenate** 됨.

| 정보 | Eq 8 (prior) | Eq 11 (posterior) |
|------|------------|----------------|
| $\hat{w}_t$ | ✓ (과거 + context) | ✓ |
| $k_t$ | ✗ | ✓ (target 포함 전체 sequence) |

**의미**:
- Eq 8 은 context 만 보고 $z_t$ 추정 → prior.
- Eq 11 은 context + target 보고 $z_t$ 추정 → posterior (더 정확).

paper 인용:
> Here, we replace Equation (8) in the generative model with Equation (11), where the hidden representation $k_t$ summarizing all information relevant to the current timestep $t$ has been concatenated to the latent-and-context-aware representation $\hat{w}_t$ preceding the Gaussian parametrization.

---

## 7.6 학습 Objective — Eq 3 재인용

### 원문 (paper p.5)
> The generative model and the inference model are trained end-to-end with a single stochastic variational inference objective stated in Equation (3). Such a variational bound includes the reconstruction loss for $x_{1:C}$ and the KL term for $z_{1:C}$. Alternatively, we can exclude these terms from the objective, which is equivalent to starting the inference process from $t = C + 1$ instead of $t = 1$.

### 풀어 설명 — 두 가지 학습 mode

| Mode | 추론 범위 | 의미 |
|------|---------|------|
| **All-time inference** | $t = 1, \ldots, T$ | Context 부분도 reconstruction + KL |
| **Target-only inference** | $t = C+1, \ldots, T$ | Target 만 inference, context 는 prior 만 |

**언제 어느 mode 인가**:
- All-time: 일반적인 학습.
- Target-only: 매우 긴 sequence (Human3.6M) — 계산량 절약.

**paper p.8 인용** (Human3.6M):
> For Human3.6M, the context and target observations are significantly longer and set up for long-term predictions, so we only infer latent variables for target observations.

→ 길이가 길면 target-only 사용. 짧으면 all-time.

---

## 7.7 복잡도

### 원문 (paper p.5)
> Our models incur a time complexity of $\mathcal{O}(T^2 d)$ and a memory cost of $\mathcal{O}(T^2 d)$, where $T$ is the total sequence length and $d$ is the dimensionality of the latent space.

### 풀어 설명

**Time complexity $\mathcal{O}(T^2 d)$**:
- $T^2$ 는 self-attention 의 표준 (모든 시점 ↔ 모든 시점).
- $d$ 는 embedding 차원.

**Memory $\mathcal{O}(T^2 d)$**: 같음 — attention matrix 저장.

**paper 의 솔직한 인정**:
> The recursive latent dynamics also does not allow us to take full advantage of parallelizable attentions. However, we find that our models are still efficient in practice, especially for reasonably small values of $T$.

→ 잠재 생성이 recursive (Eq 6-9 가 매 $t$ 마다 순차) — 완전한 parallel 안 됨. 다만 $T$ 가 작으면 (예: $T < 1000$) 실용적.

**한계**: $T$ 가 매우 크면 (NLP 의 책 한 권, 음악 한 곡) $\mathcal{O}(T^2)$ 가 부담. → paper Section 6 limitation 으로 명시.

---

## 7.8 학습 vs Test 의 비대칭 — 정리

```
              학습 시 (training, full x_{1:T} 알고 있음)
   ───────────────────────────────────────────────────────
   Generative 흐름 (Eq 5-9):       Inference 흐름 (Eq 10-11):
   
   p_θ(z_t | z_{1:t-1}, x_{1:C})   q_φ(z_t | z_{1:t-1}, x_{1:T})
        ↑                                ↑
        ŵ_t (Eq 7)                       [ŵ_t, k_t] (Eq 11)
                                              ↑
                                         k_t = Attn(h_{1:T}, ..)
                                         (Eq 10, 학습 시만)
   
   두 분포 사이 KL → ELBO Loss (Eq 3)
   학습이 진행되면서 prior 가 posterior 를 따라간다
                
                       테스트 시 (test, x_{1:C} 만)
   ───────────────────────────────────────────────────────
   Generative 만 사용:
   z_t ~ p_θ(z_t | z_{1:t-1}, x_{1:C})    (Eq 8 만, k_t 없음)
   x_t = MLP(w_t)
```

---

## 7.9 Generative + Inference 의 architectural summary

| Step | Eq | 입력 | 출력 | 시점 | 비고 |
|------|----|------|------|------|------|
| Context embed | 5 | $x_{1:C}$ | $h_{1:C}$ | Train + Test | 한 번만 |
| Full embed (inf only) | 5 | $x_{1:T}$ | $h_{1:T}$ | **Train only** | target 포함 |
| Self-attn latents | 6 | $w_{1:t-1}$ | $\bar{w}_t$ | Both | Markov 깸 |
| Cross-attn context | 7 | $\bar{w}_t, h_{1:C}$ | $\hat{w}_t$ | Both | context 참조 |
| Sample (gen) | 8 | $\hat{w}_t$ | $z_t$ (prior) | Test | 시험 답안 |
| Bidir attn (inf) | 10 | $h_{1:T}$ | $k_t$ | **Train only** | smoothing |
| Sample (inf) | 11 | $\hat{w}_t, k_t$ | $z_t$ (posterior) | **Train only** | 정답지 보고 |
| Update hidden | 9 | $\hat{w}_t, z_t$ | $w_t$ | Both | 다음 시점 준비 |
| Emission | (Eq 1) | $w_t$ | $x_t$ | Both | 최종 출력 |

---

## 7.10 Eq 11 의 [$\hat{w}_t$, $k_t$] concatenation — 깊이 분석

### 왜 concat 인가 (단순 덧셈이 아니라)

**가능한 선택지**:
1. $\hat{w}_t + k_t$ (덧셈) — 차원 같아야 함, 정보 섞임.
2. $[\hat{w}_t, k_t]$ (concat) — 차원 합쳐짐, 정보 분리 유지.
3. $\text{Attention}(\hat{w}_t, k_t, k_t)$ (attention) — 또 다른 attention 층.

**paper 선택**: concat.

**왜 concat 이 좋은가**:
- 두 source 의 정보를 **분리해서 유지** — MLP 가 어느 source 의 정보를 얼마나 쓸지 학습.
- 덧셈은 정보 섞여서 분리 어려움.
- Attention 은 추가 파라미터 + 복잡성.

→ Concat 이 가장 단순하면서 충분한 표현력.

### Concat 의 차원

| 항 | 차원 |
|----|------|
| $\hat{w}_t$ | $d_{model}$ (예: 128) |
| $k_t$ | $d_{model}$ (예: 128) |
| $[\hat{w}_t, k_t]$ | $2 \cdot d_{model}$ (예: 256) |

→ MLP_inf 의 입력 차원이 2배. paper 의 inf_mu, inf_sigma MLP 가 이 2 배 차원 받음.

---

## 7.11 KL term 의 분석 — Prior vs Posterior

학습 시 ELBO 의 KL 항:

$$
\text{KL}(q_\phi(z_t | z_{1:t-1}, x_{1:T}) \| p_\theta(z_t | z_{1:t-1}, x_{1:C}))
$$

### 두 분포의 정의

| 분포 | 사용 정보 | 어디서 만들어지나 |
|------|---------|--------------|
| $q_\phi$ (posterior) | $\hat{w}_t + k_t$ | Eq 11 |
| $p_\theta$ (prior) | $\hat{w}_t$ 만 | Eq 8 |

**핵심 관찰**: 두 분포 모두 $\hat{w}_t$ 사용. Prior 는 거기서 끝, posterior 는 $k_t$ 추가.

### KL 의 직관적 의미

KL이 0 이려면:
- $\mu_q \approx \mu_p$ — 두 평균이 비슷.
- $\sigma_q \approx \sigma_p$ — 두 분산이 비슷.

즉 "**posterior 가 target 정보 ($k_t$) 를 안 쓰는 듯이** prior 와 같이 행동" 해야 KL=0.

학습 dynamics:
- 초기: $k_t$ 가 random — posterior 가 useful 한 정보를 추출 못 함.
- 학습 진행: $k_t$ 가 의미 있게 됨 → posterior 가 target 활용 → KL ↑.
- 그러면 KL 항 (negative) 이 ELBO 를 깎음.
- 그 trade-off 가 학습 균형.

### Posterior Collapse 의 위험

극단적인 경우:
- Posterior 가 prior 와 동일하게 됨 (KL = 0).
- Posterior 가 target 정보 무시.
- 학습 신호 없어짐 → latent 가 정보 안 가짐.

**해결책 (paper 가 명시 안 했지만 standard practice)**:
- β-annealing: 초기 β=0 (KL 비활성) 으로 시작, 점진 증가.
- Free bits: KL per dim 이 최소 ε 이상 되도록 강제.

→ 16_code.md 의 demo 가 이 문제 보였음 — coverage 0.02.

---

## 7.12 자기점검 (이 챕터)

### 핵심 5가지
1. **Filtering 과 smoothing 의 차이를 한 줄로?**
2. **Inference model 이 학습 시에만 작동하는 이유는?**
3. **Eq 10 의 $k_t$ 가 Eq 11 에서 어떻게 사용되나?**
4. **왜 Eq 11 에서 concat ($[\hat{w}_t, k_t]$) 을 사용하나? 덧셈이 아닌가?**
5. **Posterior collapse 가 무엇이고 왜 위험한가?**

### 답변
1. Filtering = 과거 관측만 사용해서 현재 잠재 추정 (RNN 의 자연스러운 방식). Smoothing = 과거 + 미래 관측 모두 사용해서 잠재 재추정 (Kalman smoother 가 함). 미래 정보가 과거 추정을 개선하므로 smoothing 이 더 정확.
2. 학습 시에는 target sequence $x_{C+1:T}$ 의 정답을 알고 있어서 전체 $x_{1:T}$ 를 사용한 더 정확한 posterior $q_\phi$ 추정 가능. Test 시에는 target 모름 → context 만 쓰는 prior $p_\theta$ 만 사용. KL term 으로 prior 가 posterior 를 따라가도록 학습.
3. Eq 10 이 $k_t$ = "전체 sequence 의 bidirectional summary" 산출. Eq 11 의 Gaussian parameter 계산할 때 $[\hat{w}_t, k_t]$ 로 concatenate → MLP 입력에 들어감. 이렇게 posterior 가 target 정보까지 활용.
4. Concat 은 두 source 정보를 **분리해서 유지** — MLP 가 어느 source 를 얼마나 쓸지 학습. 덧셈은 정보 섞여서 분리 어려움. Concat 이 가장 단순하면서 충분한 표현력. 차원이 $d_{model}$ → $2 \cdot d_{model}$ 로 늘어남 (예: 128 → 256).
5. Posterior collapse = posterior $q_\phi$ 가 prior $p_\theta$ 와 동일하게 됨 (KL = 0) → 잠재 변수가 정보 안 가짐 → 학습 신호 없음. 흔한 VAE 문제. 해결책: β-annealing (KL 점진 활성), free bits (KL per dim 최소 ε 강제). 16_code 의 demo 가 이 문제 보였음 (coverage 0.02).

다음 [08_multi_layer.md](08_multi_layer.md) 에서 hierarchical extension (Eq 12-20).
