# 04 Diffusion Probabilistic Model — Section 2 배경

paper p.2-3. **DDPM (Ho et al. 2020)** 의 정확한 수식 (Eq 1-7) — TimeGrad 의 핵심 도구.

---

## 4.1 챕터 한 줄 요약

> **"Diffusion model = 두 Markov chain. Forward: $\beta_n$ schedule 로 데이터 → noise (Eq 1, 3). Reverse: 학습 신경망으로 noise → 데이터 (Eq 2). 학습 목표 = noise prediction MSE (Eq 7). Ho et al. (2020) 의 핵심 simplification 으로 학습 가능 + Langevin sampling 으로 inference."**

---

## 4.2 Setup — Notation

paper p.2:
> "Let $\mathbf{x}^0 \sim q_X(\mathbf{x}^0)$ denote the multivariate training vector from some input space $\mathcal{X} = \mathbb{R}^D$ and let $p_\theta(\mathbf{x}^0)$ denote the probability density function (PDF) which aims to approximate $q_X(\mathbf{x}^0)$ and allows for easy sampling."

**기호 뜻**:
- $\mathbf{x}^0$ — original data (한 시점의 multivariate vector, $D$ 차원)
- $q_X(\mathbf{x}^0)$ — true data distribution (모름)
- $p_\theta(\mathbf{x}^0)$ — model approximation (학습)
- $\theta$ — model parameters

**일상 비유**: 사진 dataset 의 진짜 분포 $q_X$. 우리가 모델 $p_\theta$ 학습 → 그 모델에서 sample 한 게 진짜 사진과 비슷하면 success.

---

## 4.3 Latent Variable Model — Marginal

paper:
> "Diffusion models (Sohl-Dickstein et al., 2015) are latent variable models of the form $p_\theta(\mathbf{x}^0) := \int p_\theta(\mathbf{x}^{0:N}) d\mathbf{x}^{1:N}$, where $\mathbf{x}^1, \ldots, \mathbf{x}^N$ are latents of dimension $\mathbb{R}^D$."

**구조**:
- $\mathbf{x}^0$ — 진짜 data
- $\mathbf{x}^1, \ldots, \mathbf{x}^N$ — latent variables (점진적으로 noise 추가된 버전)
- $\mathbf{x}^N \approx$ pure noise (학습 데이터의 정보 거의 없음)

**Marginal**: $p_\theta(\mathbf{x}^0) = \int p_\theta(\mathbf{x}^{0:N}) d\mathbf{x}^{1:N}$ — latent 들을 marginalize out.

**일상 비유**: 사진 한 장 의 분포 = 그 사진의 **모든 가능한 noise-corrupted 버전** 의 분포의 marginal. 즉 "원본 + 모든 노이즈 변형들" 의 joint 분포에서 원본 만 본 것.

---

## 4.4 Forward Process (Eq 1) — Fixed Markov Chain

paper:
> "Unlike in variational autoencoders (Kingma & Welling, 2019) the approximate posterior $q(\mathbf{x}^{1:N}|\mathbf{x}^0)$, $q(\mathbf{x}^{1:N}|\mathbf{x}^0) = \Pi_{n=1}^N q(\mathbf{x}^n|\mathbf{x}^{n-1})$ is not trainable but fixed to a Markov chain (called the forward process) that gradually adds Gaussian noise to the signal."

### Eq 1 — Forward step

$$
q(\mathbf{x}^n | \mathbf{x}^{n-1}) := \mathcal{N}(\mathbf{x}^n; \sqrt{1-\beta_n} \mathbf{x}^{n-1}, \beta_n \mathbf{I})
$$

### 수식 4줄 풀이

**기호 뜻**:
- $\mathbf{x}^n$ — step $n$ 의 latent (noisy version)
- $\mathbf{x}^{n-1}$ — 직전 step
- $\beta_n \in (0, 1)$ — noise schedule (paper: linear schedule, $\beta_1 = 10^{-4}, \beta_N = 0.1$)
- $\sqrt{1-\beta_n}$ — signal preservation coefficient
- $\sqrt{\beta_n}$ — noise injection scale
- $\mathcal{N}(\mu, \Sigma)$ — Gaussian

**일상 비유**:
- $\sqrt{1-\beta_n} \mathbf{x}^{n-1}$ = "이전 step 의 신호의 (1-β) 만큼 보존" — 점점 어두워지는 사진
- $\beta_n \mathbf{I}$ = "그만큼 새 노이즈 추가" — 점점 모래 끼는 사진
- $\beta_n$ schedule = "어두워지는 속도" (paper: 처음엔 천천히, 끝엔 빨리)

**왜 이 형태인가**:
- **Variance-preserving** schedule: $\text{Var}(\mathbf{x}^n) \to 1$ (큰 $n$ 에서). $\beta_n$ 의 누적이 분산을 1 까지 끌어올림.
- **Markov chain**: $\mathbf{x}^n$ 이 $\mathbf{x}^{n-1}$ 만 의존 — analytical tractability.
- **Fixed (no learning)**: 학습 불필요 — noise schedule $\beta_n$ 만 hyperparameter.

**조심할 점**:
- $\beta_n$ 너무 작으면 → noise 충분히 안 쌓여 $\mathbf{x}^N$ 이 pure noise 안 됨.
- $\beta_n$ 너무 크면 → 정보 너무 빨리 손실 → reverse 학습 어려움.
- Linear schedule (Ho 2020) 외 cosine schedule (improved DDPM, Nichol-Dhariwal 2021) 도 가능.

---

## 4.5 Reverse Process — Learned Markov Chain

paper:
> "The joint distribution $p_\theta(\mathbf{x}^{0:N})$ is called the reverse process, and is defined as a Markov chain with learned Gaussian transitions starting with $p(\mathbf{x}^N) = \mathcal{N}(\mathbf{x}^N; 0, \mathbf{I})$, where each subsequent transition of $p_\theta(\mathbf{x}^{0:N}) = p(\mathbf{x}^N) \Pi_{n=N}^{1} p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n)$ is given by a parametrization of our choosing denoted by"

### Reverse step

$$
p_\theta(\mathbf{x}^{n-1} | \mathbf{x}^n) := \mathcal{N}(\mathbf{x}^{n-1}; \mu_\theta(\mathbf{x}^n, n), \Sigma_\theta(\mathbf{x}^n, n) \mathbf{I})
$$

**기호 뜻**:
- $\mu_\theta(\mathbf{x}^n, n)$ — mean network (학습됨, $\mathbb{R}^D \times \mathbb{N} \to \mathbb{R}^D$)
- $\Sigma_\theta(\mathbf{x}^n, n)$ — variance network (학습됨, $\mathbb{R}^D \times \mathbb{N} \to \mathbb{R}^+$)
- $n$ — current diffusion step (input 으로 받음)
- 시작 조건: $\mathbf{x}^N \sim \mathcal{N}(0, \mathbf{I})$ — pure noise

**일상 비유**: 흐릿한 사진 → 한 step 깨끗하게 → 또 한 step 깨끗하게 → ... → 원본 복원. 매 step 의 "복원" 함수가 신경망 $\mu_\theta, \Sigma_\theta$.

paper 본문:
> "The parameters $\theta$ are learned to fit the data distribution $q_X(\mathbf{x}^0)$ by minimizing the negative log-likelihood via a variational bound using Jensen's inequality."

### Loss (Jensen)

paper:
$$
\min_\theta \mathbb{E}_{q(\mathbf{x}^0)}[-\log p_\theta(\mathbf{x}^0)] \leq \min_\theta \mathbb{E}_{q(\mathbf{x}^{0:N})}[-\log p_\theta(\mathbf{x}^{0:N}) + \log q(\mathbf{x}^{1:N}|\mathbf{x}^0)]
$$

→ Jensen 부등식으로 lower bound.

---

## 4.6 Eq 2 — Variational Bound 단순화

paper Eq 2:
$$
\min_\theta \mathbb{E}_{q(\mathbf{x}^{0:N})} \left[ -\log p(\mathbf{x}^N) - \sum_{n=1}^N \log \frac{p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n)}{q(\mathbf{x}^n|\mathbf{x}^{n-1})} \right]
$$

**의미**:
- 첫 항 $-\log p(\mathbf{x}^N)$: pure noise 의 log-likelihood (constant, no $\theta$).
- 두 번째 항: 각 step 의 KL divergence-like quantity.

---

## 4.7 Eq 3 — Closed-Form Sampling at Arbitrary $n$

paper:
> "As shown by (Ho et al., 2020), a property of the forward process is that it admits sampling $\mathbf{x}^n$ at any arbitrary noise level $n$ in closed form, since if $\alpha_n := 1 - \beta_n$ and $\bar\alpha_n := \Pi_{i=1}^n \alpha_i$ its cumulative product, we have:"

### Eq 3 — Marginal forward

$$
q(\mathbf{x}^n | \mathbf{x}^0) = \mathcal{N}(\mathbf{x}^n; \sqrt{\bar\alpha_n} \mathbf{x}^0, (1-\bar\alpha_n) \mathbf{I})
$$

### 수식 4줄 풀이

**기호 뜻**:
- $\alpha_n := 1 - \beta_n$ — single-step preservation
- $\bar\alpha_n := \Pi_{i=1}^n \alpha_i$ — cumulative preservation
- $\sqrt{\bar\alpha_n} \mathbf{x}^0$ — original data 의 "남은 비율"
- $\sqrt{1-\bar\alpha_n}$ — noise injection scale

**일상 비유**:
- $\bar\alpha_n$ = "$n$ step 후 원본 의 비율" (예: $\bar\alpha_{100} \approx 0$ — 거의 다 noise).
- $\sqrt{\bar\alpha_n} \mathbf{x}^0$ = "축소된 원본"
- $\sqrt{1-\bar\alpha_n}$ = "추가된 noise scale"
- 한 step 씩 진행할 필요 없이 **$n$ step 의 결과를 직접 sample**.

**왜 중요한가**:
- 학습 시 **임의 $n$ 의 noisy version 직접 sample 가능** → 1번의 forward pass.
- $\mathbf{x}^n = \sqrt{\bar\alpha_n} \mathbf{x}^0 + \sqrt{1-\bar\alpha_n} \epsilon$, $\epsilon \sim \mathcal{N}(0, \mathbf{I})$ — reparameterization.
- 이게 DDPM 학습 가능성의 **핵심 trick**.

**조심할 점**:
- $\bar\alpha_N \approx 0$ (작으면) → $\mathbf{x}^N \approx \mathcal{N}(0, \mathbf{I})$ → reverse 시작점이 pure Gaussian.
- $\beta$ schedule 이 적절해야 — Ho 2020 의 linear schedule 이 표준.

---

## 4.8 Eq 4-6 — KL-Divergence Form

paper:
> "By using the fact that these processes are Markov chains, the objective in (2) can be written as the KL-divergence between Gaussian distributions:"

### Eq 4 — Decomposed loss

$$
-\log p_\theta(\mathbf{x}^0 | \mathbf{x}^1) + D_{KL}(q(\mathbf{x}^N | \mathbf{x}^0) \| p(\mathbf{x}^N)) + \sum_{n=2}^N D_{KL}(q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0) \| p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n))
$$

**3 부분**:
- **Reconstruction term** (시작): $-\log p_\theta(\mathbf{x}^0|\mathbf{x}^1)$.
- **Prior term**: $D_{KL}(q(\mathbf{x}^N|\mathbf{x}^0) \| p(\mathbf{x}^N))$ — almost 0 by Eq 3 ($\mathbf{x}^N \approx \mathcal{N}(0, \mathbf{I})$).
- **Denoising terms** (중간): $\sum_{n=2}^N D_{KL}(q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0) \| p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n))$ — **학습 가능 부분**.

### Eq 5 — Tractable forward posterior

paper:
> "(Ho et al., 2020) shows that by the property (3) the forward process posterior in these KL divergences when conditioned on $\mathbf{x}^0$, i.e. $q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0)$ are tractable given by"

$$
q(\mathbf{x}^{n-1} | \mathbf{x}^n, \mathbf{x}^0) = \mathcal{N}(\mathbf{x}^{n-1}; \tilde\mu_n(\mathbf{x}^n, \mathbf{x}^0), \tilde\beta_n \mathbf{I})
$$

with closed-form $\tilde\mu_n$ and $\tilde\beta_n$:

$$
\tilde\mu_n(\mathbf{x}^n, \mathbf{x}^0) := \frac{\sqrt{\bar\alpha_{n-1}}\beta_n}{1-\bar\alpha_n} \mathbf{x}^0 + \frac{\sqrt{\alpha_n}(1-\bar\alpha_{n-1})}{1-\bar\alpha_n} \mathbf{x}^n
$$

$$
\tilde\beta_n := \frac{1-\bar\alpha_{n-1}}{1-\bar\alpha_n} \beta_n
$$

**의의**: forward posterior 가 **closed-form Gaussian** → KL divergence 분석적 계산 가능.

### Eq 6 — KL as MSE

paper:
> "Further, (Ho et al., 2020) shows that the KL-divergence between Gaussians can be written as:"

$$
D_{KL}(q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0) \| p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n)) = \mathbb{E}_q\left[\frac{1}{2\Sigma_\theta} \|\tilde\mu_n(\mathbf{x}^n, \mathbf{x}^0) - \mu_\theta(\mathbf{x}^n, n)\|^2\right] + C
$$

→ KL 이 **mean prediction 의 MSE** 로 환원.

---

## 4.9 Eq 7 — Noise Prediction Simplification (핵심)

paper:
> "So instead of a parametrization (1) of $p_\theta$ that predicts $\tilde\mu$, one can instead use the property (3) to write $\mathbf{x}^n(\mathbf{x}^0, \epsilon) = \sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon$ for $\epsilon \sim \mathcal{N}(0, \mathbf{I})$ and the formula for $\tilde\mu$ to obtain that $\mu_\theta$ must predict $(\mathbf{x}^n - \beta_n \epsilon/\sqrt{1-\bar\alpha_n})/\sqrt{\alpha_n}$, but since $\mathbf{x}^n$ is available to the network, we can choose:"

### Reparameterization

$$
\mu_\theta(\mathbf{x}^n, n) = \frac{1}{\sqrt{\alpha_n}} \left( \mathbf{x}^n - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}} \epsilon_\theta(\mathbf{x}^n, n) \right)
$$

→ $\mu_\theta$ 를 **noise prediction** $\epsilon_\theta$ 로 reparameterize.

### Eq 7 — Final Loss (학습 가능 형태)

$$
\mathbb{E}_{\mathbf{x}^0, \epsilon}\left[\frac{\beta_n^2}{2\Sigma_\theta \alpha_n (1-\bar\alpha_n)} \| \epsilon - \epsilon_\theta(\sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon, n) \|^2\right]
$$

### 인터랙티브 시각화 — ε prediction

```viz:tg-noise-prediction:title=ε_θ Noise Prediction (Eq 7 학습 목표),caption=n 슬라이더로 noise step. 점선 = target x^0, 실선 = noisy x^n, 점점선 = ε_pred 로 reconstructed x^0_pred. n 작으면 (clean) prediction 거의 perfect. n 크면 (noisy) prediction error 누적. 학습 목표 = 모든 n 에서 ε 정확 예측.
```

### 수식 4줄 풀이 — Eq 7

**기호 뜻**:
- $\epsilon \sim \mathcal{N}(0, \mathbf{I})$ — true added noise
- $\epsilon_\theta(\cdot, n)$ — noise prediction network (학습 대상)
- 입력: $\sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon = \mathbf{x}^n$ (noisy version, Eq 3 으로 계산)
- 출력: predicted $\hat\epsilon$
- Loss: predicted vs true noise 의 MSE × weight

**일상 비유**:
- "사진에 noise 추가했을 때 **그 noise 가 정확히 뭐였는지** 맞히기" 학습.
- 학생에게 "이 그림에서 모래 같은 noise 가 어디 끼었는지 표시해봐" 시험.
- 학습 끝나면 inference 시 noise → 원본 복원 가능.

**왜 이 형태인가**:
- **Simplification**: $\mu_\theta$ 직접 학습 (Eq 6) → $\epsilon_\theta$ 학습 (Eq 7) — 더 안정.
- **Resembling score matching**: Song-Ermon 2019 의 NCSN loss 와 동일 형태. EBM lineage 확인.
- **Practical loss**: 단순 MSE — 학습 안정.

**조심할 점**:
- $\frac{\beta_n^2}{2\Sigma_\theta \alpha_n (1-\bar\alpha_n)}$ weight 는 paper Ho 2020 가 **1 로 무시** 하는 경우 더 잘 됨 (simplified loss).
- $\Sigma_\theta$ 도 fixed (Ho 2020 default $= \tilde\beta_n$) — paper 가 $\Sigma_\theta = \tilde\beta_n$ 선택.
- noise prediction이 잘 안 되면 sampling 시 mode collapse 또는 발산.

---

## 인터랙티브 시각화 — Eq 1 + Eq 3 Forward Process

```viz:tg-diffusion-process:title=Forward Diffusion Process (Eq 1, Eq 3),caption=n 슬라이더로 diffusion step 진행 (1→100). View 토글로 noisy sample x^n vs β schedule vs ᾱ_n 누적 확인. n=1 에서 거의 clean (점선 x^0 와 일치). n=100 에서 pure Gaussian noise. ᾱ_n 가 1→0 으로 변하면서 신호 보존 비율 감소. ★ DDPM 의 핵심 형식.
```

---

## 4.10 Sampling (Langevin)

paper:
> "Once trained, to sample from the reverse process $\mathbf{x}^{n-1} \sim p_\theta(\mathbf{x}^{n-1}|\mathbf{x}^n)$ (1) we can compute"

$$
\mathbf{x}^{n-1} = \frac{1}{\sqrt{\alpha_n}}\left(\mathbf{x}^n - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}}\epsilon_\theta(\mathbf{x}^n, n)\right) + \sqrt{\Sigma_\theta}\mathbf{z}
$$

where $\mathbf{z} \sim \mathcal{N}(0, \mathbf{I})$ for $n = N, \ldots, 2$ and $\mathbf{z} = 0$ when $n = 1$.

**해석**:
- Deterministic part: $\frac{1}{\sqrt{\alpha_n}}(\mathbf{x}^n - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}}\epsilon_\theta)$ — predicted clean version.
- Stochastic part: $\sqrt{\Sigma_\theta}\mathbf{z}$ — Langevin noise (마지막 step 제외).

paper:
> "The full sampling procedure for $\mathbf{x}^0$, starting from white noise sample $\mathbf{x}^N$, resembles Langevin dynamics where we sample from the most noise-perturbed distribution and reduce the magnitude of the noise scale until we reach the smallest one."

→ **Annealed Langevin sampling** (Song-Ermon 2019 의 정신).

---

## 4.11 정리 — Section 2 의 5 step

```
[ DDPM 의 5 단계 ]

1. Setup: x⁰ (data), x¹...xᴺ (latents, noise levels)
        │
        ↓
2. Forward (fixed): q(xⁿ|xⁿ⁻¹) = N(√(1-βn) xⁿ⁻¹, βn I)
   Eq 3: q(xⁿ|x⁰) = N(√āⁿ x⁰, (1-āⁿ) I)  ← arbitrary n 직접 sample
        │
        ↓
3. Reverse (learned): pθ(xⁿ⁻¹|xⁿ) = N(μθ(xⁿ,n), Σθ I)
        │
        ↓
4. Loss (Eq 7): MSE(ε, εθ(xⁿ, n))
   ← noise prediction 학습
        │
        ↓
5. Sample (Algorithm 2): N→1 reverse loop
   xⁿ⁻¹ = (1/√αn)(xⁿ - βn/√(1-āⁿ) εθ) + √Σθ z
   ← annealed Langevin
```

---

## 자기점검 (이 챕터)

### 핵심 4가지

1. **Forward process 가 "fixed" 인 반면 reverse process 가 "learned" 인 이유는?**
2. **Eq 3 의 closed-form forward posterior 가 DDPM 학습에 결정적인 이유는?**
3. **Eq 7 의 noise prediction $\epsilon_\theta$ 가 mean prediction $\mu_\theta$ 보다 학습에 좋은 이유는?**
4. **Langevin sampling 의 $\sqrt{\Sigma_\theta}\mathbf{z}$ 가 마지막 step ($n=1$) 에서 0 인 이유는?**

### 답변

1. **Forward**: 단순 Gaussian noise 추가 — 학습 불필요, $\beta_n$ schedule 만 hyperparameter. Markov chain 이라 analytical tractability. **Reverse**: noise → 원본 복원 — 매우 complex, 신경망 학습 필요. **이 비대칭이 DDPM 의 학습 가능성 핵심**: forward 가 fixed Markov chain 이라 KL term 의 forward posterior $q(\mathbf{x}^{n-1}|\mathbf{x}^n, \mathbf{x}^0)$ 가 closed-form Gaussian (Eq 5).
2. **임의 $n$ 의 noisy version 직접 sample** ($n$ step Markov chain 안 돌려도 됨). $\mathbf{x}^n = \sqrt{\bar\alpha_n}\mathbf{x}^0 + \sqrt{1-\bar\alpha_n}\epsilon$ reparameterization — 학습 시 random $n$ pick → 1 forward pass + 1 loss computation. Markov chain 의 $n$ step iterative computation 회피 → 학습 효율 ↑.
3. **수치 안정성**: $\mu_\theta$ 는 $\mathbf{x}^0$ 와 $\mathbf{x}^n$ 의 weighted sum (Eq 5의 $\tilde\mu$) 학습 — 두 다른 scale 의 vector. $\epsilon_\theta$ 는 unit Gaussian noise 학습 — scale invariant + zero-centered. 추가로 **EBM lineage 와 호환** (Song-Ermon 2019 의 NCSN loss 동일 형태) — score matching 정신 직접 계승.
4. **Reverse process 의 마지막 step**: $\mathbf{x}^1 \to \mathbf{x}^0$. $\mathbf{x}^0$ 는 **deterministic data** (원본) 이라야 함 — Langevin noise 추가하면 final output 이 noisy. 그래서 $\mathbf{z} = 0$ — pure deterministic prediction. 다른 step ($n = 2, \ldots, N$) 은 sampling diversity 위해 noise 유지.

---

## 4.X 인터랙티브 — ELBO 유도 체인

```viz:tg-elbo-derivation:title=ELBO Derivation Chain (Eq 4 → Eq 7),caption=Step 슬라이더로 5 단계 진행. Step 0: Direct MLE 불가능 (적분 intractable). Step 1: ELBO (Eq 4) — variational lower bound. Step 2: Forward posterior closed-form Gaussian (Eq 5). Step 3: μ_θ 를 ε_θ 로 reparametrize (Eq 6). Step 4: ★ Simplified L₁ noise prediction loss (Eq 7) — TimeGrad 학습 목표.
```

---

다음 [05_method_a_problem.md](05_method_a_problem.md) — TimeGrad 의 multivariate forecasting setup (Section 3 도입).
