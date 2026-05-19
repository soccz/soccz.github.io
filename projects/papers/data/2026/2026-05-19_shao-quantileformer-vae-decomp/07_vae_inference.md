# 07 VAE-based Distribution Mixture Inference — Section 4.2

paper p.3–4 의 Section 4.2. GMM components $D$ 를 받아 **global distribution** 의 mixture parameter 를 VAE 로 추론.

---

## 왜 VAE 가 필요한가

paper p.3:
> Due to the intricate nature of data distribution, the local distributions do not linearly constitute the global distribution in a straightforward manner, thereby complicating the derivation of the target distribution.

**문제**:
- GMM 의 $K$ component $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$ 는 **각 시점의 local** distribution 정보.
- 우리가 원하는 것: 전체 데이터의 **global** distribution.
- Local 의 단순 합/평균은 global 이 아님.

**답**: variational inference 로 component weight $\pi_k$ 와 allocation $c_t$, contribution $b_t$ 를 추론 → global distribution 형성.

---

## Target Global Distribution (Eq 8)

paper Eq 8:
$$
\hat{D} = \sum_{k=1}^{K} \pi_k D_k
$$

- $D_k$ = $k$-th Gaussian component (from GMM).
- $\pi_k \geq 0, \sum \pi_k = 1$.

→ 우리가 추정할 것 = mixture weight $\{\pi_k\}_{k=1}^{K}$.

---

## VAE 모델의 변수들

paper p.4 정의:

### Allocation $c_t$
> $c_t \in \{0, 1\}^K$ is a binary vector representing the distribution allocation, where $c_{tk} = 1$ represents the distribution of the $t$-th time step is allocated to the $k$-th Gaussian component.

→ 시점 $t$ 의 데이터가 component $k$ 에 속하는지 1/0 표시.

### Contribution $b_t$
> $b_t = \{b_{tk} \in [0, 1] | k = 1, \ldots, K\}$, subject to $\sum_{k=1}^{K} b_{tk} c_{tk} = 1$, represents the contribution of the $t$-th time step which are hyperparameters in the proposed distribution inference network. Noted that the contribution $b_{tk} \neq 0$ only when the corresponding allocation component $c_{tk} = 1$.

→ $b_{tk}$ = 시점 $t$ 가 component $k$ 에 기여하는 정도 (0~1, sum=1).

---

## Variational Prior (Eq 9)

paper text 에 인용한 **stick-breaking construction of Indian Buffet Process** (Griffiths-Ghahramani 2011):

paper Eq 9:
$$
b_t \sim \mathcal{N}(\nu_k, \zeta_k), \quad \lambda_t \sim \text{Beta}(\varsigma_k, \kappa_k), \quad c_t \sim \text{Bernoulli}\!\left(\prod_{k=1}^{K} \lambda_{tk}\right)
$$

3 변수:
- $b_t$ (contribution) — Gaussian prior $\mathcal{N}(\nu_k, \zeta_k)$
- $\lambda_t$ (Bernoulli prob) — Beta prior $\text{Beta}(\varsigma_k, \kappa_k)$
- $c_t$ (allocation) — Bernoulli($\prod \lambda$) ← stick-breaking 의 cumulative product

**Bernoulli($\prod \lambda$)**: $c_{tk} = 1$ 일 확률이 $\lambda_{t1} \cdot \lambda_{t2} \cdots \lambda_{tk}$ — 막대를 부러뜨려가는 확률.

---

## Component Weight $\pi_k$ (Eq 10–11)

paper Eq 10:
$$
\pi_k = \frac{\exp(\frac{1}{K} S_k)}{Z}, \quad \text{where} \quad S_k = \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}
$$

paper Eq 11 (정규화):
$$
Z = \sum_{k=1}^{K} \exp\!\left(\frac{1}{K} \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}\right)
$$

**해석**:
- $S_k$ = component $k$ 의 **누적 기여도** (모든 시점에 대한 합).
- Softmax 로 정규화 → $\sum \pi_k = 1$ 보장.
- $\frac{1}{K}$ scaling = temperature.

---

## Variational Posterior (Eq 12–13)

paper Eq 12 — KL minimization:
$$
\phi^*, \theta^* = \arg\min_{\theta, \phi} D_{KL}(q_\phi(z_t | D) || p_\theta(z_t | D))
$$

paper Eq 13 — KL divergence 정의:
$$
D_{KL}(q_\phi(z_t | D) || p_\theta(z_t | D)) = \int q_\phi(z_t | D) \log \frac{q_\phi(z_t | D)}{p_\theta(z_t | D)} dz_t
$$

True posterior $p_\theta$ 가 intractable → variational $q_\phi$ 로 근사.

---

## ELBO (Eq 14)

True posterior 계산이 불가능 → **Evidence Lower BOund (ELBO)** 를 maximize:

paper Eq 14:
$$
\mathbb{E}_{q_\phi(z_t | D)}\!\left[\log \frac{p_\theta(z_t, D)}{q_\phi(z_t | D)}\right] = \mathbb{E}_{q_\phi}\!\left[\log \frac{p(z_t)}{q_\phi(z_t | D)}\right] + \mathbb{E}_{q_\phi}[\log p_\theta(D | z_t)]
$$

**두 term**:
1. $\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z_t)}{q_\phi(z_t | D)}\right]$ = negative KL (prior vs posterior) — **regularization**.
2. $\mathbb{E}_{q_\phi}[\log p_\theta(D | z_t)]$ = **reconstruction** likelihood.

→ ELBO 를 최대화 ⇔ KL 최소화 + reconstruction 최대화.

**SGD 학습** (Kingma 2013):
> According to the theory of variational inference, the above problem can be solved with the SGD method using a nonlinear deep neural network to optimize the mean squared error loss function.

---

## Variational Decoder Output (Eq 15)

paper text:
> We summarize the above operation as $\text{VAE}(\cdot, \cdot)$. Thus, we can obtain indications of the global distribution by

$$
\chi^d_{out} = \text{VAE}(\chi^d, D)
$$

(paper Eq 15)

- 입력: divergence pattern $\chi^d$ + GMM components $D$.
- 출력: $\chi^d_{out}$ = divergence pattern 의 **distribution-enriched** 표현.

paper text:
> The output $\chi^d_{out}$ contains rich global distribution information providing insights into the shape, spread, and central tendency of the time series.

→ 단순 divergence 가 아니라 **각 시점이 어떤 distribution 에서 sample 됐는지** 정보를 가진 vector.

---

## 인터랙티브 시각화 — VAE 의 변수 그래프

```viz:qf-vae-graph:title=VAE Variable Dependency Graph (Eq 9-15),caption=K slider 로 component 수 조작. Beta-Bernoulli stick-breaking prior 의 λ → c 와 Gaussian prior 의 b → z. ϕ (encoder) 와 θ (decoder) 의 데이터 flow. paper Fig 2 의 우중간 VAE 블록의 수학적 해체.
```

---

## 통합 — VAE 의 역할

```
D = {(μ_k, Σ_k)}_{k=1}^K       ← GMM 결과 (각 시점의 local distribution)
        │
        ↓ ϕ (variational encoder)
{ν_k, ζ_k, ν'_k, ζ'_k, ς_k, κ_k}    ← prior parameters
        │
        ↓ sample (Eq 9): b_t ~ N, λ_t ~ Beta, c_t ~ Bernoulli
        │
z_t = Σ_k b_tk · ż_t            ← latent variable
        │
        ↓ θ (decoder)
χ^d_out                         ← divergence with distribution info
        │
        ↓
π_k from Eq 10 (component weights)
        │
        ↓
D̂ = Σ π_k D_k (Eq 8) — target global distribution
```

→ **VAE 가 GMM 의 local components 를 결합해 global distribution 을 추정**. 결과 $\chi^d_{out}$ 이 fusion Transformer 의 입력 중 하나.

다음 [08_quantile_drift_extraction.md](08_quantile_drift_extraction.md) 에서 quantile drift $\chi^Q$ 의 Transformer encoder 처리 (Section 4.3).
