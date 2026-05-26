# 18 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석, *후속 연구로 검증 필요한* 가설.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 가지 잠재 약점: (1) SDE solver numerical accuracy, (2) GAN training instability 의 *real-world risk*, (3) Lipschitz constraint 의 *expressivity 제약*, (4) Finance-centric narrative bias."**

## 18.2 약점 1 — SDE Solver Numerical Accuracy

### 18.2.1 문제 진술

```
Euler-Maruyama (1st order):
  - dz = μ dt + σ dW
  - Weak convergence O(√Δt)
  - Strong convergence O(√Δt)

Milstein (1.5th order):
  - Higher order term
  - Better accuracy
  - Higher computation cost
```

본 deep dive 는 *Euler-Maruyama default* 사용. *Milstein 의 better accuracy* 미분석.

### 18.2.2 미해결 질문

```
- Milstein vs Euler-Maruyama 의 *empirical gain*?
- Adaptive SDE solver 의 *adoption need*?
- Stiff SDE 의 *implicit method* 필요?
```

### 18.2.3 후속 연구 방향

```
- Adaptive Milstein for stiff SDE
- Spectral analysis of solver error
- Multi-step methods (Adams-Bashforth)
```

## 18.3 약점 2 — GAN Training Instability

### 18.3.1 문제 진술

```
WGAN-GP의 *known issues*:
  - Mode collapse (rare)
  - Slow convergence
  - Hyperparameter sensitivity (n_critic, gp_weight)
  - Diffusion model 이 *more stable* alternative
```

### 18.3.2 본 deep dive 의 처리

§5d 와 §14 에서 WGAN-GP 사용 강조. *Instability risk* 의 *empirical signature* 미분석.

### 18.3.3 미해결 질문

```
- Production failure rate?
- Mode collapse 의 frequency?
- Diffusion alternative 의 *empirical comparison*?
```

### 18.3.4 후속 연구 방향

```
- Spectral normalization (architectural Lipschitz)
- Two-time-scale update rule
- Hybrid GAN + diffusion training
```

## 18.4 약점 3 — Lipschitz Constraint 의 Expressivity 제약

### 18.4.1 문제 진술

```
LipSwish activation:
  - Lipschitz constant exactly 1
  - Architecturally enforced
  - Trade-off: *expressivity 감소*

Theoretical:
  - 1-Lipschitz network 의 *universal approximation* 제약
  - Some functions 표현 못함
```

### 18.4.2 미해결 질문

```
- Spectral normalization 의 *gentler Lipschitz*?
- Multi-Lipschitz layers (Lipschitz > 1 inside)?
- Expressivity-stability trade-off curve?
```

### 18.4.3 후속 연구 방향

```
- Anisotropic Lipschitz constraints
- Soft Lipschitz penalty (gradient norm penalty only)
- Layer-wise Lipschitz tuning
```

## 18.5 약점 4 — Finance-Centric Narrative

### 18.5.1 문제 진술

```
본 deep dive 의 examples 의 70%+ 가 finance:
  - Stock prices
  - Volatility clustering
  - Heavy tails
  - Option pricing

Neural SDE GAN 의 *broader applications*:
  - Climate path generation (irregular)
  - Medical vital signs
  - Astronomy light curves
  - Robotics control trajectories
```

### 18.5.2 미해결 질문

```
- Non-finance domain 의 quantitative results?
- Cross-domain transferability?
- Domain-specific architectural choices?
```

## 18.6 본 deep dive 의 *bias 가능성*

### 18.6.1 "Neural SDE = best path generator" over-claim

```
SDE 만이 path generation 의 *정답* 아님:
  - Discrete TS GAN 도 *충분한 cases*
  - Diffusion model 이 *more stable*
  - Foundation Model 이 *general*
  
→ "When to use Neural SDE" vs "alternatives" 의 *fair comparison* 미충분.
```

### 18.6.2 Heavy tail capture 의 *fragile claim*

```
Kurtosis 8.1 vs real 8.7 = *good match*.
하지만:
  - 8.1 일 때 *some tail events 무시 가능*
  - Tail risk 의 *underestimate*
  - VaR 계산 시 *systematic bias*
```

### 18.6.3 Recommendation

```
- Cross-domain quantitative analysis
- Diffusion alternative 의 fair comparison
- Tail-specific evaluation metric (e.g., expected shortfall)
```

## 18.7 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **GAN training instability 의 *production risk*?**
3. **Finance-centric bias 의 *honest disclosure* 이유?**

### 답변

1. **Cross-domain transferability 검증**. 본 deep dive 가 finance heavy — *medical, climate, energy* 적용 시 *paper claim 그대로 transfer 가능한지* 미증명. *Volatility clustering, heavy tails* = *finance-specific stylized facts*. Climate path 의 *seasonal cycle, sudden regime shift* = *different challenges*. → *Per-domain empirical validation* 필요 — 본 deep dive 가 *generalization 가정* 만 — *cross-domain rigor* 부족.

2. **Mode collapse + non-convergence**. WGAN-GP 의 *theoretical stability* (Wasserstein loss) 가 *practical guarantee* 아님. Production 시 *간헐 mode collapse* (generator 가 *single typical path* 만 생성) 가능. *Detection*: energy distance 의 *non-monotonic improvement*. *Mitigation*: spectral normalization, two-time-scale update — paper 미언급. → *Production deployment 시 fallback strategy* 필수.

3. **Intellectual honesty + practical guidance**. Kidger 2021 paper 의 *benchmark* 가 financial (S&P 500 returns) — natural focus. 본 deep dive 가 *finance narrative* 따르면 *one-sided*. *Honest disclosure* = "본 deep dive 는 finance 중심" 명시 → 독자가 *climate / medical / robotics* 의 적용 가능성 *자체 판단*. Cross-domain *open question* 명시 = *intellectual integrity*.
