# 12 Glossary & References — Neural SDE GAN

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Neural SDE / CDE / GAN / 시계열 path generation 의 핵심 개념 + reference.

## 12.1 챕터 한 줄 요약

> **"Kidger et al. NeurIPS 2021 의 *Neural SDE-CDE GAN* 의 30+ terminology + 20+ references (Stochastic calculus, Neural ODE, GAN, 시계열 path generation) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| SDE | Stochastic Differential Equation | Itô 1944 |
| Brownian motion W_t | random walk, *연속시간* | Wiener 1923 |
| Drift term μ(z,t) | deterministic dynamics | Itô 1944 |
| Diffusion term σ(z,t) | random noise scaling | Itô 1944 |
| Itô integral | stochastic integral | Itô 1944 |
| Neural SDE | f_θ, g_θ as neural net | Tzen & Raginsky 2019 |
| Generator G | Neural SDE for path gen | Kidger 2021 ★ |
| Neural CDE | controlled differential | Kidger 2020 |
| Discriminator D | Neural CDE for path discrim | Kidger 2021 ★ |
| GAN | min-max game generator/discriminator | Goodfellow 2014 |
| WGAN | Wasserstein GAN | Arjovsky 2017 |
| WGAN-GP | gradient penalty | Gulrajani 2017 |
| Path space | space of continuous functions [0,T]→R^d | Kolmogorov |
| Wasserstein distance | optimal transport metric | Kantorovich |
| Lipschitz constraint | bounded gradient | Banach |
| `torchsde` | PyTorch SDE solver | Li et al. 2020 |
| `torchcde` | PyTorch CDE solver | Kidger 2020 |
| Euler-Maruyama | 1st-order SDE solver | numerical SDE |
| Milstein | higher-order SDE solver | Milstein 1974 |
| Stratonovich | alternative SDE interpretation | Stratonovich |
| Path-dependent | history-dependent dynamics | finance |
| Heavy-tail | non-Gaussian tail distribution | finance |
| Volatility clustering | autocorrelation in σ²(t) | finance |
| Brownian bridge | conditioned Brownian motion | stochastic |
| Itô's lemma | chain rule for SDE | Itô |
| Variance reduction | Monte Carlo speedup | numerical |
| Quasi-Monte Carlo | low-discrepancy sequence | numerical |
| Reparameterization trick | gradient through stochastic | Kingma 2013 |
| Adjoint SDE | reverse-time SDE | Li 2020 |
| Energy distance | non-parametric path comparison | Szekely |

## 12.3 Notation

```
z_t ∈ R^d         hidden state at time t
W_t ∈ R^m         Brownian motion
μ_θ(z,t)          drift function (neural)
σ_θ(z,t)          diffusion function (neural)
G_θ               generator (Neural SDE)
D_φ               discriminator (Neural CDE)
P_data            real path distribution
P_θ               generator path distribution
W_1               Wasserstein-1 distance
```

## 12.4 References (20+)

### 12.4.1 SDE foundations
```
Itô 1944, Stratonovich 1966, Karatzas & Shreve 1991
Tzen & Raginsky 2019 — Neural SDE concept
Li et al. 2020 — scalable Neural SDE
```

### 12.4.2 Neural ODE/CDE lineage
```
Chen et al. 2018 — Neural ODE
Kidger et al. 2020 — Neural CDE
Rubanova et al. 2019 — Latent ODE
```

### 12.4.3 GAN
```
Goodfellow et al. 2014 — Original GAN
Arjovsky et al. 2017 — WGAN
Gulrajani et al. 2017 — WGAN-GP
```

### 12.4.4 Path generation
```
Kidger et al. NeurIPS 2021 — Neural SDE GAN (★ 본 paper)
Wiese et al. 2020 — Quant GANs
Buehler et al. 2020 — Deep hedging
```

## 12.5 자기점검

### 핵심 3 가지

1. **SDE vs ODE 의 *결정적 차이*?**
2. **Neural CDE 가 *natural discriminator* 인 이유?**
3. **Wasserstein distance 가 path GAN training 에 *적합한* 이유?**

### 답변

1. **Stochastic vs Deterministic dynamics**. ODE: dz/dt = f(z,t) — *deterministic* trajectory (initial condition만 알면 unique). SDE: dz = μ(z,t)dt + σ(z,t)dW_t — *Brownian noise* 가 *random fluctuation* 추가. → ODE = single curve, SDE = *distribution over paths*. 금융 시계열의 *randomness* 가 SDE 의 *natural fit*.

2. **Path-as-input architecture**. Discriminator 는 *전체 path* 를 input 으로 받아 real/fake binary 출력. RNN/Transformer 도 가능하지만 *discrete grid* 가정. Neural CDE = *continuous path X(t) driving* differential equation — *임의 path 직접 처리 + Lipschitz constraint enforceable*. WGAN 의 *Lipschitz discriminator* 요구사항 과 *natural match*.

3. **Distribution distance, not likelihood**. KL/JS divergence 는 *support 가 disjoint* 시 *infinite* — path space 의 *finite samples* 에서 흔함. Wasserstein 은 *optimal transport* — *support 차이* 에 *robust*. Path space 의 *infinite-dim* + *finite samples* 환경에서 *Wasserstein 이 유일 implementable* — *theoretical + practical 동시 fit*.
