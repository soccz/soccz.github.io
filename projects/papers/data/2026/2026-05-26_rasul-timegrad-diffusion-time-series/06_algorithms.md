# 06 Algorithms — Training (Alg 1) + Sampling (Alg 2)

paper p.3-4. **Algorithm 1 (Training)** + **Algorithm 2 (Sampling via annealed Langevin)** — TimeGrad 의 execution loop.

---

## 6.1 챕터 한 줄 요약

> **"Alg 1 (Training): 매 시점 random $n$ + random $\epsilon$ → $\epsilon_\theta$ network noise prediction MSE 학습. Alg 2 (Sampling): $\mathbf{x}^N \sim \mathcal{N}(0, \mathbf{I})$ 시작 → N step reverse loop → $\mathbf{x}^0$ 도출. 100 sample 으로 prediction distribution 추정."**

---

## 6.2 Algorithm 1 — Training (Per Time Step)

paper Algorithm 1:

```
Algorithm 1: Training for each time series step t ∈ [t₀, T]
─────────────────────────────────────────────────────────
Input: data x⁰_t ~ q_X(x⁰_t) and state h_{t-1}

repeat:
    Initialize n ~ Uniform(1, ..., N) and ε ~ N(0, I)
    Take gradient step on:
        ∇_θ || ε - ε_θ(√āⁿ x⁰_t + √(1-āⁿ) ε, h_{t-1}, n) ||²
until converged
```

### 친근한 풀이

**입력**:
- $\mathbf{x}^0_t$ — 시점 $t$ 의 clean observation
- $\mathbf{h}_{t-1}$ — 이전 시점 까지의 RNN hidden state (context 정보)

**Repeat 안의 단계**:

**Step 1: Random sampling**
- $n \sim \text{Uniform}(1, N)$ — random diffusion step
- $\epsilon \sim \mathcal{N}(0, \mathbf{I})$ — random noise

**Step 2: Forward (Eq 3 사용)**
$$
\mathbf{x}^n_t = \sqrt{\bar\alpha_n} \mathbf{x}^0_t + \sqrt{1-\bar\alpha_n} \epsilon
$$
→ closed-form, 단 1 step 으로 $n$ 번째 noisy version 도달.

**Step 3: Noise prediction**
$$
\hat\epsilon = \epsilon_\theta(\mathbf{x}^n_t, \mathbf{h}_{t-1}, n)
$$
→ 네트워크 forward pass.

**Step 4: Loss + Gradient**
$$
\mathcal{L} = \| \epsilon - \hat\epsilon \|^2
$$
→ MSE. backprop 으로 $\theta$ update.

### 일상 비유

학생이 시험 풀이를 학습 — 매 번 **랜덤한 어려움 (random $n$)** + **랜덤한 문제 변형 (random $\epsilon$)** 을 만들어 풀어보고, 답 (true $\epsilon$) 과 비교 학습. 이렇게 다양한 random 케이스로 학습하면 일반화 잘 됨.

### 학습 효율의 핵심

- **One forward pass per random $n$** — N=100 step 마다 전부 forward 안 함.
- Variance reduction: random $n$ + random $\epsilon$ 의 평균이 모든 case 의 unbiased estimator (Ho 2020).
- Batch 32 paper default.

### Full Training Loop (Algorithm 1 + RNN)

```
For each epoch:
    For each batch (context + prediction windows):
        # Step A: Encode context
        h_{t₀-1} = RNN(x⁰_{1:t₀-1}, c_{1:t₀-1})
        
        # Step B: For each t in prediction window:
        for t in [t₀, T]:
            # Algorithm 1
            n ~ Uniform(1, N)
            ε ~ N(0, I)
            x^n_t = √āⁿ x⁰_t + √(1-āⁿ) ε
            L = || ε - ε_θ(x^n_t, h_{t-1}, n) ||²
            Backward + Optimizer step
            
            # Update hidden state (for next t)
            h_t = RNN(concat(x⁰_t, c_t), h_{t-1})
```

paper:
> "Algorithm 1 is the training procedure for each time step in the prediction window using this objective."

---

## 6.3 Algorithm 2 — Sampling via Annealed Langevin Dynamics

paper Algorithm 2:

```
Algorithm 2: Sampling x⁰_t via annealed Langevin dynamics
─────────────────────────────────────────────────────────
Input: noise xᴺ_t ~ N(0, I) and state h_{t-1}

for n = N to 1 do:
    if n > 1 then:
        z ~ N(0, I)
    else:
        z = 0
    end if
    
    x^{n-1}_t = (1/√αn) (x^n_t - βn/√(1-āⁿ) ε_θ(x^n_t, h_{t-1}, n)) + √Σ_θ z

end for

Return: x⁰_t
```

### 친근한 풀이

**입력**:
- $\mathbf{x}^N_t \sim \mathcal{N}(0, \mathbf{I})$ — pure noise (시작)
- $\mathbf{h}_{t-1}$ — RNN hidden state (조건)

**Loop $n = N \to 1$**:

**Step 1: Noise prediction**
$$
\hat\epsilon_n = \epsilon_\theta(\mathbf{x}^n_t, \mathbf{h}_{t-1}, n)
$$

**Step 2: Denoising step**
$$
\mathbf{x}^{n-1}_t = \frac{1}{\sqrt{\alpha_n}} \left( \mathbf{x}^n_t - \frac{\beta_n}{\sqrt{1-\bar\alpha_n}} \hat\epsilon_n \right) + \sqrt{\Sigma_\theta} \mathbf{z}
$$

- Deterministic part: predicted clean version
- Stochastic part: $\sqrt{\Sigma_\theta} \mathbf{z}$ — Langevin noise

**Step 3: Final step ($n = 1$)**
- $\mathbf{z} = 0$ — pure deterministic
- Output: $\mathbf{x}^0_t$ — clean prediction

### Langevin Dynamics — 직관

**Annealed Langevin** (Song-Ermon 2019):
- Large $n$ (큰 noise scale): 많이 흔들리며 sample 공간 widely 탐색.
- Small $n$ (작은 noise scale): 점점 덜 흔들리며 mode 에 수렴.

**일상 비유**: 안개 낀 산에서 가장 낮은 골짜기 (분포 mode) 찾기:
- 안개 짙음 (large $n$): 무작위로 큰 step 이동 — 산 전체 탐색.
- 안개 옅음 (small $n$): 정밀한 작은 step 이동 — 정확한 골짜기 찾기.

### Inference 의 부담

**N=100 loop**: 매 시점 $t$ 마다 100번 $\epsilon_\theta$ forward + S=100 samples for distribution.
- Prediction horizon 24 step × N=100 × S=100 samples = **24만 forward passes per series**.
- paper Section 6 future work: Chen 2021 (improved variance schedule + L1 loss) 또는 Song 2021 (DDIM, non-Markovian) 으로 sampling 가속 가능.

### Inference 의 전체 흐름

```
# Step A: Run RNN over context + warm-up
h_T = RNN(x⁰_{1:T}, c_{1:T})  # use all training history

# Step B: For each forecast step:
for forecast_t = T+1 to T+horizon:
    # Algorithm 2: sample x⁰_{forecast_t}
    x^N_{forecast_t} ~ N(0, I)
    for n = N to 1:
        z ~ N(0, I) if n > 1 else 0
        x^{n-1}_{forecast_t} = ...  # Langevin step
    # x⁰_{forecast_t} obtained
    
    # Update hidden state (autoregressive)
    h_{forecast_t} = RNN(concat(x⁰_{forecast_t}, c_{forecast_t}), h_{forecast_t-1})

# Repeat S=100 times for distribution
```

paper:
> "This process of sampling trajectories from the 'warm-up' state $\mathbf{h}_T$ can be repeated many times (e.g. S = 100) to obtain empirical quantiles of the uncertainty of our predictions."

→ **S=100 sample paths** for empirical distribution.

---

## 6.4 인터랙티브 시각화 — Langevin Sampling

```viz:tg-langevin-sampling:title=Algorithm 2 — Annealed Langevin Sampling (interactive),caption=N slider (1~100) 로 reverse step 진행. 시작 시점 N=100 의 pure noise → 점차 clean prediction 으로 수렴. z noise (stochastic part) 의 contribution 도 visualize. Mode 마다 다른 sample 도착하는 Langevin 의 다양성.
```

---

## 6.5 Training vs Inference 비교

| 측면 | Training (Alg 1) | Inference (Alg 2) |
|------|------------------|---------------------|
| **목적** | $\epsilon_\theta$ 학습 | $\mathbf{x}^0_t$ sampling |
| **$n$** | Random $\sim \text{Uniform}(1, N)$ | Deterministic loop $N \to 1$ |
| **$\epsilon$** | True random noise | Predicted $\hat\epsilon$ |
| **Forward pass** | 1 per training step | N=100 per inference step |
| **Output** | Loss (scalar) | Clean sample $\mathbf{x}^0_t$ |
| **Speed** | Fast (1 forward) | Slow (N=100 forward) ← bottleneck |

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Training (Alg 1) 의 random $n$ vs Inference (Alg 2) 의 deterministic loop 의 이유?**
2. **Algorithm 2 의 마지막 step ($n=1$) 에서 $\mathbf{z} = 0$ 인 이유?**
3. **Inference 의 N=100 loop bottleneck 의 paper-suggested 해결책 2가지?**

### 답변

1. **Training**: 모든 noise step $n \in [1, N]$ 의 학습이 필요 — 한꺼번에 다 forward 하면 batch size $\times N$ 부담. **Random $n$**: 매 step random pick → unbiased gradient estimator (importance sampling). 평균적으로 모든 $n$ 학습. **Inference**: 분포에서 sample 추출 — Markov chain reverse process 의 **정확한 sequential 진행** 필요. $n = N \to 1$ 의 deterministic loop. random pick 하면 chain 안 됨.
2. **마지막 step 의 의미**: $\mathbf{x}^1 \to \mathbf{x}^0$. $\mathbf{x}^0$ 가 final clean output 이어야 — Langevin noise 추가 시 noisy. 다른 step ($n \geq 2$) 은 다음 step 에서 다시 denoising → noise OK. 마지막 step 만 pure deterministic prediction 으로 마무리.
3. (a) **Chen 2021 (WaveGrad)**: improved variance schedule + L1 loss → N step 줄여도 quality 유지. (b) **Song 2021 (DDIM)**: 일반화된 non-Markovian process → faster sampling 가능. **paper 본문**: "A possible strategy to improve sampling times introduced in (Chen et al., 2021) uses a combination of improved variance schedule and an L1 loss to allow sampling with fewer steps at the cost of a small reduction in quality if such a trade-off is required."

다음 [07_data_baselines.md](07_data_baselines.md) — 6 datasets + 11 baselines + CRPS_sum metric.
