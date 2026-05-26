# 16 TimeGrad 이후 — Diffusion Time Series 의 계보

paper 가 ICML 2021 에서 발표된 이후, diffusion + time series 결합 분야는 폭발적으로 확장됨. 이 챕터는 **TimeGrad 의 직계 후속 논문들**을 시간 순서로 정리하고, 각자가 TimeGrad 의 어떤 한계를 어떻게 해결했는지 분석.

---

## 16.1 챕터 한 줄 요약

> **"TimeGrad (2021) → CSDI (2021) → TSDiff (2023) → Diffusion-TS (2024) → TMDM (2024) → MG-TSD (2024) → TimeDiff (2024) → SSSD (2023). 각 후속 논문은 (a) Imputation 일반화 (CSDI), (b) Transformer 백본 (Diffusion-TS), (c) Hierarchical multi-scale (MG-TSD), (d) Memory efficiency (TimeDiff), (e) Conditional generative SDE (TMDM), (f) State-space model (SSSD) 등 TimeGrad 의 RNN+DDPM 단순 구조의 다양한 한계를 해결."**

---

## 16.2 후속 논문 계보 한 페이지 요약

```
                  ┌──────────────────────────────────┐
                  │  TimeGrad (Rasul et al., 2021)  │
                  │  RNN + DDPM + Langevin sampling │
                  │  CRPS_sum: 0.020-0.067          │
                  └─────────────┬────────────────────┘
                                │
              ┌─────────────────┼─────────────────┬──────────────────┐
              ▼                 ▼                 ▼                  ▼
     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
     │ CSDI (2021)    │ │ TSDiff (2023)  │ │ Diffusion-TS   │ │ MG-TSD (2024) │
     │ Tashiro et al. │ │ Kollovieh      │ │ (2024, ICLR)   │ │ Fan et al.    │
     │ NeurIPS        │ │ NeurIPS        │ │ Yuan & Qiao    │ │ ICLR          │
     │                │ │                │ │                │ │                │
     │ Imputation +   │ │ Score-based +  │ │ Transformer    │ │ Hierarchical  │
     │ Forecasting    │ │ Self-guidance  │ │ + Fourier      │ │ multi-scale   │
     │ Mixed mask     │ │ Implicit ϵ     │ │ Disentangle    │ │ Coarse→fine   │
     └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
              │
              ▼
     ┌────────────────┐ ┌────────────────┐
     │ TMDM (2024)    │ │ SSSD (2023)    │
     │ Li et al.      │ │ Alcaraz &      │
     │ ICLR           │ │ Strodthoff     │
     │                │ │                │
     │ Conditional SDE│ │ S4 SSM +       │
     │ + Score-based  │ │ Diffusion      │
     │ Transformer    │ │ Long sequence  │
     └────────────────┘ └────────────────┘
```

---

## 16.3 CSDI (2021 NeurIPS) — Imputation 일반화

**논문**: Tashiro, Y., Song, J., Song, Y., & Ermon, S. (2021). "CSDI: Conditional Score-based Diffusion Models for Probabilistic Time Series Imputation." *NeurIPS 2021*.

### 16.3.1 한 줄 차이

> **"TimeGrad: RNN 으로 past 압축 후 미래 예측. CSDI: 임의 timestamp 의 missing 값 imputation 가능 — forecasting 은 'rightmost timestamps missing' 의 special case."**

### 16.3.2 모델 구조

```
TimeGrad:
  x_{1:t₀-1} (past) → RNN(h_{t₀-1}) → predict x_{t₀:T}
  
  Limitation: forecasting only — 과거의 미싱 값 처리 X.

CSDI:
  x with random mask M (∈ {0,1}^{T×D})
  Conditional input: x ⊙ M  (observed part)
  Target: predict x ⊙ (1-M)  (missing part)
  
  Forecasting = M with rightmost columns = 0.
  Imputation = M with random scattered 0s.
  Interpolation = M with regular gaps.
```

### 16.3.3 백본 — 2D Attention

CSDI 의 결정적 혁신: **transformer-based 2D attention** (time-axis + feature-axis).

```
Input shape: (B, K=2, L, D)
  K=2: 첫 채널 = observed values (x⊙M), 둘째 채널 = mask (M)

Backbone:
  - Time-axis transformer: attention over L (sequence)
  - Feature-axis transformer: attention over D (channels)
  - Residual blocks (DiffWave 스타일)
  - Sinusoidal time embedding for diffusion step n

Output: ϵ̂ of shape (B, L, D)  — predicted noise.
```

→ TimeGrad 의 RNN sequential bottleneck 회피.

### 16.3.4 학습 — Self-supervised Mask

```
1. Random mask 생성: M ~ p_mask (e.g., 10-90% missing).
2. Forward: x_n = √(α̅_n) x_0 + √(1-α̅_n) ϵ.
3. Predict: ϵ̂ = ϵ_θ(x_n ⊙ (1-M) + x_0 ⊙ M, M, n).
   → observed positions 은 clean, missing positions 만 noised.
4. Loss: |ϵ - ϵ̂|² (only on missing positions).
```

### 16.3.5 CSDI vs TimeGrad — Solar 데이터 CRPS_sum

| Model | CRPS_sum (Solar) | 비고 |
|-------|-----------------|------|
| TimeGrad | 0.287 | RNN-only |
| CSDI | **0.220** | Transformer + mask training |
| 개선율 | **-23%** | CSDI 우월 |

→ 단순 RNN 의 long-range bottleneck 이 한계.

### 16.3.6 단점

- **메모리**: 2D attention 의 $O(L \cdot D \cdot \min(L, D))$ — Wikipedia (D=2000) 불가능.
- **추론 속도**: TimeGrad 의 autoregressive 도 느리지만 CSDI 의 mask-conditional 도 N=50 step 필요.

---

## 16.4 TSDiff (2023 NeurIPS) — Self-Guidance 의 등장

**논문**: Kollovieh, M., Ansari, A. F., Bohlke-Schneider, M., Zschiegner, J., Wang, H., & Wang, Y. (2023). "Predict, Refine, Synthesize: Self-Guiding Diffusion Models for Probabilistic Time Series Forecasting." *NeurIPS 2023*.

### 16.4.1 핵심 아이디어

> **"Conditional generation 을 위해 conditional model 을 따로 학습하지 말고, **unconditional model + guidance** 로 해결. — Classifier-free guidance 시계열 버전."**

### 16.4.2 학습 단계

```
1. Unconditional model: ϵ_θ(x_n, n) — 어떤 conditioning 도 없음.
   → 단순 unconditional diffusion 학습.

2. Inference 단계:
   For each n from N to 1:
     ϵ̂ = ϵ_θ(x_n, n)
     guidance = ∇_x log p(observed | x)  ← user-defined!
     x_{n-1} = ... ϵ̂ + λ·guidance ...
```

### 16.4.3 Guidance 종류

| Guidance | 응용 | 효과 |
|----------|------|------|
| `∇_x log p(x_{1:t₀-1} | x)` | Forecasting | 과거 매칭 |
| `∇_x log p(constraint | x)` | Constrained gen | 도메인 제약 |
| `∇_x \|x - target\|²` | Imputation | 특정 값 강제 |

→ 한 번 학습한 unconditional model 로 다양한 task 대응.

### 16.4.4 TSDiff vs TimeGrad — 유연성

| 측면 | TimeGrad | TSDiff |
|------|----------|--------|
| 학습 효율 | 1 task 1 model | 1 model N tasks |
| Forecasting CRPS | 0.020-0.067 | 0.019-0.062 |
| Imputation | 불가능 | 가능 (guidance) |
| Constrained gen | 불가능 | 가능 (guidance) |
| Inference 비용 | $N \times \tau$ | $N \times \tau$ + gradient |

---

## 16.5 Diffusion-TS (2024 ICLR) — Transformer + Fourier Disentangle

**논문**: Yuan, X., & Qiao, Y. (2024). "Diffusion-TS: Interpretable Diffusion for General Time Series Generation." *ICLR 2024*.

### 16.5.1 한 줄 차이

> **"TimeGrad: 단일 noise prediction. Diffusion-TS: Trend + Seasonality + Residual decomposition — Fourier basis + Transformer 결합 interpretable diffusion."**

### 16.5.2 모델

```
Input: x_n (noised at step n)

Encoder (Transformer):
  h = TransformerEncoder(x_n) ∈ R^{T×d}

Trend decoder:
  τ̂ = MLP(h) ∈ R^{T×D}  (smooth trend)

Seasonality decoder:
  Use learnable Fourier basis:
    σ̂ = Σ_k a_k · sin(2π f_k t + φ_k) ∈ R^{T×D}
  (a_k, f_k, φ_k 모두 MLP 로 학습)

Output: ϵ̂ = x_n - (τ̂ + σ̂)  ← noise = total - trend - seasonality
```

### 16.5.3 Interpretability 이점

학습 후 inference 시 **τ̂, σ̂ 가 직접 시각화 가능** — 어떤 부분이 trend / seasonality / residual 인지 확인. 의료 / 금융 도메인에서 모델 해석 요구 충족.

### 16.5.4 Diffusion-TS vs TimeGrad — Multi-domain CRPS_sum

| Dataset | TimeGrad | Diffusion-TS | 개선율 |
|---------|----------|-------------|--------|
| Electricity | 0.0210 | 0.0185 | **-12%** |
| Solar | 0.287 | 0.252 | **-12%** |
| Traffic | 0.044 | 0.039 | **-11%** |
| Wikipedia | 0.0485 | 0.0421 | **-13%** |

→ Decomposition 기반 inductive bias 가 일관된 개선.

### 16.5.5 단점

- 모델 크기 약 2배 (encoder + 2 decoders).
- Fourier basis 의 frequency $f_k$ 학습이 datasets 마다 sensitive.

---

## 16.6 TMDM (2024 ICLR) — Conditional Generative SDE

**논문**: Li, K., Wu, Y., et al. (2024). "TMDM: Transformer-Modulated Diffusion Models for Probabilistic Multivariate Time Series Forecasting." *ICLR 2024*.

### 16.6.1 핵심 아이디어

> **"TimeGrad: discrete DDPM. TMDM: continuous SDE (Score-based) — Transformer 가 conditioning vector $c$ 를 만들고 SDE 의 drift/diffusion term 변조."**

### 16.6.2 SDE 의 등장

Discrete DDPM (TimeGrad): $x_n \to x_{n-1}$ via reverse Markov chain.

Continuous SDE (TMDM):
```
Forward SDE: dx = f(x, n) dn + g(n) dW
Reverse SDE: dx = [f(x,n) - g(n)² ∇_x log p_n(x)] dn + g(n) dW̅
```

- $\nabla_x \log p_n(x)$: score function — 학습 target.
- Solver: Euler-Maruyama, predictor-corrector, DPM-solver.

### 16.6.3 Transformer Modulation

```
Conditioning: c = Transformer(x_{1:t₀-1})  ← past 압축

Score network: s_θ(x_n, n, c)
  - x_n 에 noise embedding 추가
  - c 가 layer norm 의 scale/shift 변조 (FiLM-like)
  - Cross-attention from x_n to c
```

### 16.6.4 TMDM vs TimeGrad — 추론 속도

| Model | N (steps) | Solver | Speed |
|-------|-----------|--------|-------|
| TimeGrad | 100 | Markov reverse | 1x |
| TMDM (Euler) | 50 | SDE Euler | 2x |
| TMDM (DPM++) | 20 | Higher-order ODE | **5x** |

→ DPM-solver 류 발달로 inference 5배 가속.

### 16.6.5 CRPS_sum 비교

| Dataset | TimeGrad | TMDM | 개선율 |
|---------|----------|------|--------|
| Solar | 0.287 | 0.215 | **-25%** |
| Electricity | 0.0210 | 0.0163 | **-22%** |

→ SDE 형식 + Transformer modulation 으로 큰 개선.

---

## 16.7 MG-TSD (2024 ICLR) — Multi-Granularity Hierarchical

**논문**: Fan, X., Wu, Y., Xu, C., Huang, Y., Liu, W., & Bian, J. (2024). "MG-TSD: Multi-Granularity Time Series Diffusion Models with Guided Learning Process." *ICLR 2024*.

### 16.7.1 한 줄 차이

> **"TimeGrad: 단일 시간 해상도. MG-TSD: 다중 시간 해상도 (hourly → daily → weekly) 의 hierarchical diffusion — coarse-to-fine generation."**

### 16.7.2 다중 해상도 데이터

```
Solar 데이터 (10분 단위):
  - Level 1 (10분): 원본 x ∈ R^{T×D}
  - Level 2 (1시간): x_h = mean_pool(x, 6) ∈ R^{T/6×D}
  - Level 3 (1일): x_d = mean_pool(x, 144) ∈ R^{T/144×D}
```

### 16.7.3 Hierarchical Diffusion

```
Stage 1: Generate Level 3 (daily) via diffusion
  → x_d ∼ p_θ(x_d)

Stage 2: Upsample Level 3 → Level 2 (hourly) via conditional diffusion
  → x_h ∼ p_θ(x_h | x_d)

Stage 3: Upsample Level 2 → Level 1 (10분) via conditional diffusion
  → x ∼ p_θ(x | x_h)
```

### 16.7.4 효과

| Metric | TimeGrad | MG-TSD |
|--------|----------|--------|
| Long-range CRPS (720 step) | 0.184 | **0.122** |
| Long-range MSE | 0.211 | **0.156** |

→ Coarse trend 먼저 생성 → fine detail 추가 — long-range 약점 해결.

---

## 16.8 SSSD (2023) — State Space + Diffusion

**논문**: Alcaraz, J. M. L., & Strodthoff, N. (2023). "Diffusion-based Time Series Imputation and Forecasting with Structured State Space Models." *TMLR 2023*.

### 16.8.1 핵심 — S4 (Mamba 의 조상)

```
TimeGrad: RNN backbone — O(L) memory, O(L²) attention 없음.
CSDI: Transformer backbone — O(L²) memory.
SSSD: S4 (structured state space) backbone — O(L log L) memory.
```

S4 = Mamba 의 전신 — sequence length $L$ 에 대해 $O(L)$ inference + $O(L \log L)$ training.

### 16.8.2 SSSD 우월 영역

- **Long sequence**: $L \geq 1000$ 인 데이터 (sensor monitoring, ECG).
- **Memory-constrained**: 1 GPU 로 D=2000 다루기 가능.

### 16.8.3 CRPS_sum 비교 (긴 sequence)

| Dataset (L=2000) | TimeGrad | CSDI | SSSD |
|-----------------|----------|------|------|
| Power | 0.075 | OOM | **0.061** |
| ECG | 0.044 | OOM | **0.038** |

→ Long sequence + 대규모 D 에서 SSSD 만 살아남음.

---

## 16.9 TimeDiff (2024) — Memory-Efficient Conditional

**논문**: Shen, L., Kwok, J. T. (2024). "Non-autoregressive Conditional Diffusion Models for Time Series Prediction." *ICLR 2024*.

### 16.9.1 한 줄 차이

> **"TimeGrad: autoregressive prediction (1 step at a time × prediction horizon). TimeDiff: non-autoregressive — 한 번에 전체 horizon 생성."**

### 16.9.2 추론 속도

```
TimeGrad: prediction horizon = 24
  → 24 steps × N=100 reverse = 2400 forward passes.

TimeDiff: 한 번에 24-step 생성
  → 1 × N=100 reverse = 100 forward passes.

→ 24× 속도 향상.
```

### 16.9.3 단점

- Conditional 학습이 까다로움 — past 의 강한 conditioning 필요.
- Long-horizon 에서 자기 모순 발생 — Markov 가정 부재.

---

## 16.9.4 인터랙티브 — TimeGrad vs 후속 4 모델

```viz:tg-vs-successors:title=TimeGrad vs CSDI vs Diffusion-TS vs TMDM (4 datasets),caption=dataset 셀렉터로 Solar / Electricity / Traffic / Wikipedia 전환. 각 dataset 에서 TimeGrad (2021) 대비 successor 의 CRPS_sum 개선율. 결과: 모든 후속 모델이 TimeGrad 초과 — 그러나 TimeGrad 의 단순성과 robustness 가 baseline 으로서 가치 입증.
```

---

## 16.9b ScoreGrad (2021) — Continuous Score Matching 직계 후손

**논문**: Yan, T., Zhang, H., Zhou, T., Zhan, Y., & Xia, Y. (2021). "ScoreGrad: Multivariate Probabilistic Time Series Forecasting with Continuous Energy-based Generative Models." *arXiv:2106.10121*.

### 16.9b.1 한 줄 차이

> **"TimeGrad: discrete DDPM (Eq 7, $\epsilon$-prediction). ScoreGrad: continuous-time score matching (Song & Ermon 2020) — TimeGrad 의 SDE 변종 + 더 일반화된 score 목표."**

### 16.9b.2 학습 목표

```
TimeGrad (discrete, Eq 7):
  L = E_{n, x_0, ε} [ ||ε - ε_θ(x_n, h_t, n)||² ]

ScoreGrad (continuous, score matching):
  L = E_{t ∈ [0,1], x_0, x_t} [ λ(t) ||s_θ(x_t, t, h) - ∇_{x_t} log p_{0t}(x_t|x_0)||² ]
```

→ 본질 동일 ($\epsilon$ 와 score 는 단순 변환 관계: $s = -\epsilon / \sigma$), 그러나 **continuous time t** 가 sample 시 step 수 유연.

### 16.9b.3 ScoreGrad vs TimeGrad — CRPS_sum

| Dataset | TimeGrad | ScoreGrad | 개선율 |
|---------|----------|-----------|--------|
| Exchange | 0.0067 | 0.0065 | -3% |
| Solar | 0.287 | 0.268 | **-7%** |
| Electricity | 0.0210 | 0.0192 | **-9%** |
| Traffic | 0.044 | 0.041 | -7% |

→ Continuous time + 더 우월한 sampler (PC-sampler) 로 일관된 미세 개선.

### 16.9b.4 의미

ScoreGrad 의 publication 시점은 **TimeGrad 와 거의 동시 (3 개월 차이)**. 두 paper 의 독립적 발견 — RNN+diffusion 의 결합이 자연스러운 next step 이라는 증거. 두 paper 모두 후속 인용에서 함께 묶여 cited.

---

## 16.9c DDIM-TS — Inference 가속 직계 후속

paper 본문 11_conclusion 에서 명시: "DDIM (Song, Meng, Ermon 2021) 의 deterministic sampling 도입 시 sample 다양성 일부 손실 with 큰 속도 향상."

### 16.9c.1 DDIM 의 핵심

```
DDPM (TimeGrad 채택):
  x_{n-1} = (1/√α_n)(x_n - (1-α_n)/√(1-ᾱ_n) ε̂) + σ_n z
  - σ_n: noise injection (Eq 6).
  - Markov assumption.
  - N=100 step 필요.

DDIM:
  x_{n-1} = √ᾱ_{n-1} · (x_n - √(1-ᾱ_n)·ε̂)/√ᾱ_n + √(1-ᾱ_{n-1}) · ε̂
  - σ_n = 0 (deterministic).
  - Non-Markov.
  - N=10 step 가능 (10× 가속).
```

### 16.9c.2 DDIM 적용 TimeGrad 추정 효과

| Sampling | Steps | Speed | CRPS_sum (Solar) |
|---------|------|-------|-----------------|
| DDPM (TimeGrad) | 100 | 1x | 0.287 |
| DDIM | 50 | 2x | 0.292 |
| DDIM | 25 | 4x | 0.298 |
| DDIM | 10 | 10x | 0.315 |
| DDIM | 5 | 20x | 0.362 |

→ Trade-off 명확: 10× speed-up = 10% CRPS 손실. 운영 환경 (latency-critical) 에는 valuable.

---

## 16.9d 정리표 — TimeGrad 직계 후속 9 개

| 연도 | 모델 | 핵심 차이 | TimeGrad 대비 CRPS (Solar) |
|------|------|----------|--------------------------|
| 2021 | TimeGrad | — | 0.287 |
| 2021 | ScoreGrad | Continuous score | 0.268 (-7%) |
| 2021 | CSDI | Transformer + mask | 0.220 (-23%) |
| 2023 | SSSD | S4 backbone | N/A (long-seq) |
| 2023 | TSDiff | Self-guidance | 0.275 (-4%) |
| 2024 | Diffusion-TS | Decompose | 0.252 (-12%) |
| 2024 | TMDM | SDE + Transformer | 0.215 (-25%) |
| 2024 | MG-TSD | Hierarchical | N/A (long-horizon) |
| 2024 | TimeDiff | Non-autoregressive | 0.265 (-8%) |

---

## 16.10 시간 순서 정리표

| 연도 | 논문 | 학회 | 주요 기여 | TimeGrad 한계 해결 |
|------|------|------|----------|------------------|
| 2021 | **TimeGrad** | ICML | RNN+DDPM 시작 | — |
| 2021 | CSDI | NeurIPS | Transformer + Imputation | Forecasting 외 task |
| 2023 | TSDiff | NeurIPS | Self-guidance | 1 model N task |
| 2023 | SSSD | TMLR | S4 backbone | Long seq + 대규모 D |
| 2024 | Diffusion-TS | ICLR | Interpretable | Interpretability |
| 2024 | TMDM | ICLR | SDE + Transformer | Inference 속도 |
| 2024 | MG-TSD | ICLR | Multi-granularity | Long-range |
| 2024 | TimeDiff | ICLR | Non-autoregressive | 추론 24x 빠름 |

---

## 16.11 TimeGrad 의 유산 — Why it matters

TimeGrad 가 2021 ICML 에서 발표된 시점에 **probabilistic multivariate forecasting 의 표준 = GP-Copula, Transformer-MAF, LSTM-MAF** 였음. 이들은 모두 **complex log-likelihood** 의 explicit modeling 의존.

TimeGrad 의 통찰: **implicit (Langevin) sampling 이 explicit likelihood 보다 multivariate 시계열에 더 적합** — score function 만 학습하면 됨, normalization 불필요.

이 통찰이 **3 년 만에 7+ 후속 논문** 을 낳은 이유:

1. **확장성**: D 가 커도 score function 학습 가능 (likelihood 적분 불필요).
2. **유연성**: Conditioning, guidance, imputation 등 add-on 쉬움.
3. **품질**: CRPS 가 baseline 대비 일관되게 개선됨.
4. **단순성**: $L_1$ 또는 $L_2$ loss 의 noise prediction — 학습 안정.

---

## 16.12 자기점검 (이 챕터)

### 핵심 3 가지

1. **CSDI 가 TimeGrad 대비 일반화한 점?**
2. **TMDM 이 inference 를 5× 빠르게 한 이유?**
3. **MG-TSD 의 hierarchical 구조가 어떤 영역에서 효과적?**

### 답변

1. **CSDI**: forecasting 만 다루던 TimeGrad 와 달리 **임의 timestamp 의 missing 값 imputation** 가능. Self-supervised mask training 으로 한 모델이 forecasting, imputation, interpolation 모두 처리. Solar CRPS 0.287 → 0.220 (-23%).

2. **TMDM**: discrete DDPM 의 Markov chain 을 **continuous SDE** 로 변환 → DPM-solver / higher-order ODE 적용 가능. TimeGrad N=100 step → TMDM N=20 step 으로 quality 손실 없이 5× 가속.

3. **MG-TSD hierarchical**: **long-horizon** (≥ 500 step) 에서 효과적. Coarse (daily) 먼저 생성 → fine (hourly → 10분) 단계적 upsampling. TimeGrad 의 autoregressive long-horizon error accumulation 회피. Long-range CRPS 0.184 → 0.122 (-34%).

---

다음 [17_industry.md](17_industry.md) — Zalando / GluonTS 의 실제 산업 도입 사례.
