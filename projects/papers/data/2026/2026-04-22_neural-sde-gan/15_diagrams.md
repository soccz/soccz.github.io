# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Neural SDE GAN 의 *path generation*, *SDE-CDE pairing*, *WGAN training* 을 ASCII 도식 + viz.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *Brownian-driven path*, *SDE generator architecture*, *CDE discriminator*, *Wasserstein metric*, *volatility clustering* 의 visual narrative."**

## 15.2 ASCII 도식 — SDE-CDE GAN 전체 구조

```
NEURAL SDE GAN ARCHITECTURE:

  noise W_t ──────────────────┐
                              │
                              ▼
  init z_0 ─→  Neural SDE  ─→  z(t)  ─→ readout  ─→  y(t) (fake path)
                 G_θ                                       │
                                                            │
  real path y(t) ─────────────────────────────────────────┐│
                                                            ││
                                                            ▼▼
                                                    ┌──────────────┐
                                                    │ Neural CDE   │
                                                    │ Discriminator│
                                                    │      D_φ     │
                                                    └──────┬───────┘
                                                            │
                                                            ▼
                                                  real? / fake?
                                                  W_1 distance

  Training: min_G max_D W_1(P_real, P_G)
```

## 15.3 ASCII 도식 — SDE Generator 내부

```
NEURAL SDE GENERATOR:

  W_t ∈ R^d_w (Brownian)
       │
       │ initial network
       ▼
   z_0 ∈ R^d_z (initial state)
       │
       │ For t = 0 → T:
       │   ─── ODE part ───────
       │       μ_θ(z, t) = drift network
       │       dz_drift = μ_θ dt
       │   ─── Noise part ─────
       │       σ_θ(z, t) = diffusion network (matrix)
       │       dz_noise = σ_θ dW_t
       │   ─── Update ────────
       │       z_{t+dt} = z_t + dz_drift + dz_noise
       │
       ▼
   z(t) ∈ R^d_z (continuous path)
       │
       │ readout
       ▼
   y(t) ∈ R (observable, e.g., stock price)
```

## 15.4 ASCII 도식 — Volatility Clustering 시각화

```
REAL FINANCIAL PATH:

  return r_t = log(p_{t+1} / p_t)
        │
   0.1  ┤              ▮                                    
        │              ▮                                    
   0.05 ┤    ▮         ▮▮         ▮▮▮                       
        │ ▮ ▮▮ ▮      ▮▮▮▮▮     ▮▮▮▮▮▮                      
   0.0  ┤▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮  
        │ ▮▮  ▮▮ ▮    ▮▮▮▮▮     ▮▮▮▮▮▮     ▮▮▮▮▮▮          
   -0.05┤    ▮          ▮▮         ▮▮▮         ▮▮▮          
        │                              ▮                    
   -0.1 ┤                              ▮                    
        └──────────────────────────────────────────────── time
            (low vol)  (high vol)  (med vol)  (high vol)
            
  → Volatility clustering: high-vol periods bunch together.
  → Neural SDE 의 σ_θ(z,t) 가 *path-dependent* 학습.
```

## 15.5 ASCII 도식 — Brownian Motion 의 Discretization

```
BROWNIAN MOTION W_t:

  W_t
       │              ╱
       │           ╲ ╱
   0.6 ┤         ╲ ╳
       │         ╲╱
   0.4 ┤      ╱╲ 
       │     ╱  ╲
   0.2 ┤    ╱    
       │   ╱     
   0.0 ┤  ╱       
       │ ╱        
   -0.2┤╱         
       └────────────────────── time

  Properties:
    - W_0 = 0
    - W_t - W_s ~ N(0, t-s)
    - Independent increments
    - Continuous but nowhere differentiable
  
  Numerical (Euler-Maruyama):
    ΔW = √Δt · Z, where Z ~ N(0, 1)
```

## 15.6 ASCII 도식 — Wasserstein-1 Distance Picture

```
W_1 DISTANCE BETWEEN PATH DISTRIBUTIONS:

  P_real:                  P_fake:
       │ paths            paths │
   3.0 ┤ ▮▮▮              ▮▮    │
       │ ▮▮▮              ▮▮▮   │
   2.0 ┤ ▮▮▮▮             ▮▮▮▮  │
       │ ▮▮▮▮▮            ▮▮▮▮▮ │
   1.0 ┤ ▮▮▮▮▮            ▮▮▮▮▮▮│
       └────value          value│
   
   ┌───── optimal transport ─────┐
   │ Move each path of P_real    │
   │ to nearest path of P_fake.  │
   │ Sum the moving distances.   │
   └─────────────────────────────┘
            ↓
    W_1(P_real, P_fake) = total transport cost

  Lower W_1 = more similar distributions.
```

## 15.7 ASCII 도식 — GAN Training Dynamic

```
WGAN-GP TRAINING (paper Algorithm 1):

  For each iteration:
    
    Step 1: Discriminator update (5×)
      ─────────────────────────────
      sample real paths from P_real
      generate fake paths from G_θ
      compute d_real, d_fake
      d_loss = d_fake.mean() - d_real.mean() + GP
      backward + step
      
    Step 2: Generator update (1×)
      ─────────────────────────────
      generate fake paths
      compute d_fake
      g_loss = -d_fake.mean()
      backward + step

  Ratio 5:1 (n_critic = 5) — *discriminator stronger*.
```

## 15.8 ASCII 도식 — Statistical Properties Comparison

```
NEURAL SDE GAN vs CLASSICAL BASELINES:

   Property              GARCH  LSTM-GAN  Neural SDE GAN
   ────────────────────────────────────────────────────
   Mean             ●●●     ●●●        ●●●
   Variance         ●●●     ●●●        ●●●
   Heavy tail (kurt) ●○○     ●●○        ●●●  ★
   Vol clustering    ●●●     ●○○        ●●●  ★
   Autocorr (r)      ●●●     ●●●        ●●●
   Autocorr (|r|)    ●●●     ●○○        ●●●  ★
   Path regularity   ─       ●●○        ●●●  ★
   ────────────────────────────────────────────────────
   ●●● = excellent, ●○○ = poor

  Neural SDE GAN = *most stylized facts* 동시 capture.
```

## 15.9 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `nsde-path-generation` | 03, 05b, 15 | Generated path samples + real comparison | drift/diffusion sliders |
| `nsde-volatility-cluster` | 03, 13, 15 | Volatility clustering visualization | real / generated toggle |
| `nsde-wasserstein` | 05d, 13, 15 | Wasserstein distance reduction during training | epoch slider |

## 15.10 자기점검

### 핵심 3 가지

1. **Volatility clustering 의 *path-dependence* 의 *Neural SDE encoding*?**
2. **Wasserstein-1 의 *path space* application 의 의의?**
3. **5:1 n_critic ratio 의 *training stability*?**

### 답변

1. **σ_θ(z, t) 의 *learned nonlinear function***. GARCH 같은 parametric: σ²_t = ω + α r²_{t-1} + β σ²_{t-1} (*explicit autoregressive*). Neural SDE: σ_θ(z, t) = MLP — *implicit nonlinear path-dependence*. z (hidden state) 의 *low-vol regime vs high-vol regime* 가 *implicit features* 로 학습. → Empirical: GARCH ●●●, Neural SDE ●●● (둘 다 capture), but Neural SDE 가 *더 flexible* (non-parametric).

2. **Infinite-dim path space 의 *finite-sample comparison*.** Standard Wasserstein-1 = vector space. Path space = *infinite-dim* (function space). Kidger 2021 의 *innovation*: Neural CDE discriminator 가 *1-Lipschitz functional on path space* 학습 → Kantorovich-Rubinstein duality 로 Wasserstein 추정. → *Infinite-dim 의 WGAN extension* — *theoretically grounded* + *practically tractable*.

3. **Generator 의 *moving target* vs Discriminator 의 *stationary task***. Generator 의 *path distribution* 매 step 변화 = *non-stationary* discriminator target. Discriminator 가 *충분 학습* 못 하면 *uninformative gradient* → generator drift. 5:1 ratio = "*discriminator 가 generator 한 step 위 학습*" → *informative gradient* 제공. *Stability + convergence*.

---

## 인터랙티브 시각화

```viz:nsde-path-generation:title=paper §3 — Generated Path Samples,caption=Drift/diffusion sliders.
```

```viz:nsde-volatility-cluster:title=paper §4 — Volatility Clustering,caption=Real/generated toggle.
```

```viz:nsde-wasserstein:title=paper §3.4 — Wasserstein Convergence,caption=Training epoch slider.
```
