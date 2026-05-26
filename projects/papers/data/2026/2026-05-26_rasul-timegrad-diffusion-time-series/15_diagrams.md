# 15 Diagrams & Interactive Visualizations

> **🧒 한 줄 요약**: ASCII + interactive viz. Diffusion process, RNN+diffusion architecture.


ASCII 도식 + interactive viz 카탈로그.

---

## 15.1 ASCII 도식 1 — TimeGrad 전체 architecture

```
   Context window: x⁰_{1:t₀-1}, c_{1:t₀-1}
        │
        ↓ RNN (LSTM 2 layer, hidden=40)
        │
   h_{t₀-1} ────────────────────────────────────┐
                                                  │ (conditioning)
   For each prediction step t = t₀, ..., T:      │
                                                  │
   At time t:                                     │
        x^N_t ~ N(0, I)                           │
        │                                          │
        ↓ Reverse Markov chain (N=100 steps)      │
        │                                          │
        For n = N to 1:                            │
            ε_pred = ε_θ(x^n_t, h_{t-1}, n) ──────┘
            x^{n-1}_t = (1/√αn)(x^n_t - (βn/√(1-āⁿ)) ε_pred) + √Σ_θ z
        │
        ↓ x⁰_t  (clean prediction)
        │
        ↓ Update RNN: h_t = RNN(concat(x⁰_t, c_t), h_{t-1})
        │
   For next time step t+1, ...
```

---

## 15.2 ASCII 도식 2 — Diffusion Forward + Reverse

```
   Forward (fixed Markov chain):
   ─────────────────────────────
   x⁰ ─→ q(x¹|x⁰) ─→ x¹ ─→ q(x²|x¹) ─→ x² ─→ ... ─→ q(xᴺ|xᴺ⁻¹) ─→ xᴺ ≈ N(0, I)
        adds noise        adds noise              adds noise
        β₁                β₂                       βₙ
        │
   Eq 1: q(xⁿ|xⁿ⁻¹) = N(√(1-βn) xⁿ⁻¹, βn I)
        │
   Eq 3: q(xⁿ|x⁰) = N(√āⁿ x⁰, (1-āⁿ) I)  ← arbitrary n 직접 sample 가능!


   Reverse (learned Markov chain):
   ────────────────────────────────
   xᴺ ─→ p_θ(x^{N-1}|xᴺ, h) ─→ x^{N-1} ─→ ... ─→ p_θ(x¹|x², h) ─→ x¹ ─→ p_θ(x⁰|x¹, h) ─→ x⁰
        removes noise               removes noise                    removes noise
        ε_θ(·, h, N)                ε_θ(·, h, 2)                     ε_θ(·, h, 1)
```

---

## 15.3 ASCII 도식 3 — Algorithm 1 (Training) vs Algorithm 2 (Sampling)

```
   ALGORITHM 1 — Training (per t in prediction window)
   ────────────────────────────────────────────────────
   Input: x⁰_t (clean data), h_{t-1} (RNN hidden)
   
   1. n ~ Uniform(1, ..., N)     ← random noise step
   2. ε ~ N(0, I)                 ← random noise
   3. x^n_t = √āⁿ x⁰_t + √(1-āⁿ) ε   ← compute noisy version (Eq 3)
   4. ε_pred = ε_θ(x^n_t, h_{t-1}, n)  ← noise prediction
   5. L = || ε - ε_pred ||²       ← MSE
   6. ∇_θ L → optimizer step
   
   → 1 forward pass per training step (fast)

   ALGORITHM 2 — Sampling (per t in prediction)
   ────────────────────────────────────────────
   Input: h_{t-1}
   
   1. x^N_t ~ N(0, I)                ← pure noise start
   2. for n = N to 1:                ← reverse loop (slow!)
      a. ε_pred = ε_θ(x^n_t, h_{t-1}, n)
      b. mean = (1/√αn)(x^n_t - (βn/√(1-āⁿ)) ε_pred)
      c. if n > 1:  z ~ N(0, I)
         else:      z = 0           ← deterministic final
      d. x^{n-1}_t = mean + √Σ_θ z
   3. Return x⁰_t

   → N=100 forward passes per inference step (bottleneck)
```

---

## 15.4 ASCII 도식 4 — DeepAR vs TimeGrad

```
   DeepAR (Salinas 2019b)              TimeGrad (이 paper)
   ──────────────────────             ──────────────────────
                                                            
   x⁰_{t-1} ─┐                        x⁰_{t-1} ─┐
             │                                   │
   ┌─────────▼──────┐                  ┌─────────▼──────┐
   │ RNN per entity │                  │ RNN multivariate│
   │ (univariate)   │                  │ (joint D-dim)  │
   └─────────┬──────┘                  └─────────┬──────┘
             │                                   │
   ┌─────────▼──────┐                  ┌─────────▼──────┐
   │ Gaussian emission│                  │ Diffusion model │
   │ μ, σ output      │                  │ ε_θ network     │
   └─────────┬──────┘                  └─────────┬──────┘
             │                                   │
        x_t ~ N(μ, σ²)                      x⁰_t ~ DDPM
        ↑                                   ↑
        univariate                         multivariate joint
        Gaussian                            general distribution
        per entity                          full functional 자유

   Cross-entity correlation: 무시           학습 가능
   Multi-modal distribution: 불가          가능
```

---

## 15.5 ASCII 도식 5 — TimeGrad vs Other Multivariate Baselines

```
   Baseline 의 multivariate joint distribution 표현법
   ────────────────────────────────────────────────────

   [VAR + GARCH]          [Vec-LSTM-Copula]         [Transformer-MAF]        [TimeGrad]
   linear AR + Gaussian   RNN + low-rank Gaussian   Transformer + flow      RNN + diffusion
        │                       │                          │                      │
   linear params           low-rank (rank=10)         invertible NN          Free 신경망
        │                       │                          │                      │
   Σ = full but linear     Σ = D + UU^T              Jacobian determinant   functional 자유
        │                       │                          │                      │
   limit: linear           limit: 2nd-order           limit: architectural   no limit
                                                                                  │
   ↓                       ↓                          ↓                      ↓
   매우 약함               second-order               flow 제약                SOTA
   in high-D + multimodal  in disconnected modes      in disconnected modes  in everything!
```

---

## 15.6 ASCII 도식 6 — N Ablation (Fig 3 시각화)

```
   CRPS_sum on Electricity vs N (paper Fig 3)
   ─────────────────────────────────────────────
   CRPS_sum (log scale)
   ↑
   │
   10⁻¹ ●  (N=2)
   │    │
   │    │
   │     ╲
   │      ╲
   │       ●  (N=4)
   │        ╲
   │         ╲
   │          ●  (N=8)
   │           ╲
   │            ●  (N=16)
   │              ●  (N=32)
   │                ●  (N=64)
   10⁻² ─────────────●●●●●●●  (N=100~256) ← plateau
   │
   └─────────────────────────────────────────────→  N (log scale)
       2    4    8   16   32   64  100  256

   관찰:
   - N=2-4: 매우 나쁨 (Gaussian 가정 위반)
   - N=8-32: 빠른 개선
   - N≈100: plateau (paper optimal)
   - N=256: marginal 또는 약간 worse
```

---

## 15.7 ASCII 도식 7 — Lineage Tree

```
   [ Score Matching / EBM ]
        Hyvärinen 2005, Vincent 2011, Du-Mordatch 2019
              │
              ↓
   [ Score-Based Generative Models ]
        Song-Ermon 2019 (NCSN), 2020 (improved)
              │
              ↓
   [ Denoising Diffusion ]
        Sohl-Dickstein 2015 → Ho 2020 (DDPM)
              │
              ↓
   [ Audio Diffusion ]                    [ Time Series Diffusion ]
        WaveGrad (Chen 2021)                    TimeGrad (이 paper, 2021)
        DiffWave (Kong 2021)                            │
              │                                          ↓
              ↓                              [ Concurrent ICML/NeurIPS 2021 ]
        Audio synthesis SOTA                  ProTran (SSM+Attention)
                                              Autoformer (Auto-Correlation)
                                              Transformer-MAF (flow)
                                                       │
                                                       ↓
                                              [ 후속 paper (2021-2024) ]
                                                  CSDI (Tashiro 2021)
                                                  TMDM (Li 2024)
                                                  Diffusion-TS (Yuan 2024)
                                                  TSDiff (Kollovieh 2023)
```

---

## 15.8 ASCII 도식 8 — TimeGrad 의 Future Work 4 방향

```
                       ┌──────────────────┐
                       │ TimeGrad (2021)  │
                       │ N=100 loop       │
                       │ RNN backbone     │
                       │ Continuous data  │
                       └─────────┬────────┘
                                 │
                ┌────────────────┼─────────────────┬──────────────┐
                ↓                ↓                  ↓              ↓
        [ Sampling 가속 ]    [ Long sequence ]   [ Discrete ]   [ Anomaly ]
        DDIM (Song 2021)    Transformer 교체     EBM 직접 학습  Detection
        WaveGrad (Chen 21)  Graph NN (Niu 20)   D3PM 같은         OOD score
        N=10 ~ 25            Long-range RNN      후속
                                                                  │
                ↓                ↓                  ↓              ↓
        후속 paper        TMDM (Li 2024)        future            future
        CSDI (2021)       
        TSDiff (2023)     
```

---

## 15.9 ASCII 도식 9 — 단계적 깊이 (Insights 의 시각화)

```
                       [ 표면 메시지 ]
                       "RNN + DDPM = 시계열 SOTA"
                              │
                              ↓
                       [ 한 층 ]
                "EBM functional 자유 + Langevin generality 의 시계열 적용"
                              │
                              ↓
                       [ 두 층 ]
                "Image domain 의 SOTA tool 을 시계열에 paradigm transfer"
                              │
                              ↓
                       [ 세 층 ]
                "Multivariate distribution = image generation 과 본질 동일 task"
                              │
                              ↓
                       [ 네 층 ]
                "분야 dominant tool 의 변형 < 인접 분야 paradigm 의 직접 transfer"
                "ViT → 시계열 (PatchTST), DDPM → 시계열 (TimeGrad) 의 동일 정신"
```

---

## 15.10 인터랙티브 시각화 카탈로그 (신규 7개)

| viz id | 챕터 | 무엇 | 상호작용 |
|--------|------|------|---------|
| `tg-diffusion-process` | 04 (preview) | Forward Markov chain (Eq 1, Eq 3) — noisy sample x^n + β schedule + ᾱ_n | n 슬라이더 + view 토글 |
| `tg-noise-prediction` | 04 | ε_θ noise prediction — noisy x^n vs predicted x^0_pred | n 슬라이더 |
| `tg-architecture-flow` | 05b | Full architecture — RNN encoding + diffusion reverse loop | 4-step 토글 |
| `tg-langevin-sampling` | 06 | Algorithm 2 — annealed Langevin trajectory | n 슬라이더 + seed |
| `tg-crps-comparison` | 08 | Table 2 의 6 datasets × 11 models CRPS_sum | dataset 슬라이더 |
| `tg-ablation-N` | 09 | Fig 3 의 N ablation on Electricity | N index 슬라이더 (log) |
| `tg-traffic-predictions` | 09 | Fig 4 의 6/963 dim 의 50%/90% intervals | dimension 슬라이더 |

→ 각 viz 의 구현은 site repo `viz/tg-*.js` 신규 작성. paper exact values + paper trend 기반 reproduction. ★ deep.html preview 의 default 는 `tg-diffusion-process`.

---

## 15.10b ASCII 도식 10 — Loss Landscape (학습 phase 별 변화)

```
   Phase 0 (초기): Loss ≈ 1.0
   ─────────────────────────
   ε_θ output: random
   학습 신호: 모든 n 에서 strong gradient
   
   ↓ epoch 1-3
   
   Phase 1 (빠른 학습):
   ────────────────────
   Loss ≈ 0.3-0.5
   큰 n (noisy) 부터 학습 — ε 식별 쉬움
                 │
                 ↓
   Loss curve:   ╲
                  ╲
                   ╲___    (큰 n)
                       ╲___
   
   ↓ epoch 4-10
   
   Phase 2 (꾸준한 개선):
   ────────────────────
   Loss ≈ 0.1-0.2
   작은 n 도 학습 시작 — fine detail
   
   ↓ epoch 11-30
   
   Phase 3 (수렴):
   ──────────────
   Loss ≈ 0.05-0.1 (plateau)
   Sample quality 시각적 OK
   Validation CRPS_sum stable
```

---

## 15.10c ASCII 도식 11 — Audio vs Time Series Diffusion 비교

```
   Audio Diffusion (WaveGrad/DiffWave)        Time Series Diffusion (TimeGrad)
   ──────────────────────────────────         ─────────────────────────────────

   x ∈ R^L (single waveform)                  x ∈ R^{T × D} (multivariate)
   length L = thousands                       D = 8 ~ 2000 (paper)
                                              T = horizon (24 steps)

   Neighbors strongly correlated              Neighbors arbitrary order
   (sound wave continuity)                    (Wikipedia page IDs ≠ semantic order)

   Uniform scale [-1, +1]                     Order-of-magnitude scale 차이
                                              (Traffic per-road occupancy)

   Conditioning: mel-spectrogram              Conditioning: RNN hidden h_{t-1}
   (frequency representation)                 (autoregressive history)

   Output: single waveform                    Output: multivariate vector at next t
   (1 time scale)                             (1 + autoregressive next t+1, t+2, ...)
```

---

## 15.10d ASCII 도식 12 — Forward Posterior 의 Mean (Eq 5) 시각화

```
   q(x^{n-1} | x^n, x^0) = N(x^{n-1}; μ̃_n, β̃_n I)
   
   Mean μ̃_n 의 두 contribution:
   
              √ᾱ_{n-1} β_n            √α_n (1 - ᾱ_{n-1})
   μ̃_n = ─────────────────── x^0 + ─────────────────── x^n
               1 - ᾱ_n                  1 - ᾱ_n
              └────┬────┘             └────┬────┘
                  weight on x^0          weight on x^n
   
   극한:
   - n=1 일 때: weight on x^0 ≈ 1 (clean original 거의 그대로)
   - n=N 일 때: weight on x^0 ≈ 0 (pure noise contribution 없음)
                weight on x^n ≈ 1 (pure noise 가 dominate)
   
   → DDPM 의 reverse process 가 시점별 다른 weight 로
     x^0 의 기여 점점 줄이고 x^n 의 (noisy) input 점점 늘림
```

---

## 15.10e ASCII 도식 13 — Inference 비용의 정량

```
   Single forward (ε_θ at N=100):
   ─────────────────────────────
   V100 GPU 16GB, batch 1, D=370 (Electricity):
   1 ε_θ forward ≈ 2-3 ms
   
   Single time-step prediction (one x^0_t):
   ──────────────────────────────────────
   N=100 × 2.5 ms = 250 ms
   
   Single trajectory (horizon=24):
   ─────────────────────────────
   24 × 250 ms = 6 seconds
   
   Distribution (S=100 samples):
   ────────────────────────────
   100 × 6 sec = 10 minutes
   
   Production (1000 series):
   ──────────────────────────
   1000 × 10 min = 167 hours ≈ 7 days  (!!)
   
   With DDIM (Song 2021, N=10):
   ────────────────────────────
   10x faster → 17 hours
   
   With DDIM + parallel inference:
   ───────────────────────────────
   10 GPU → 1.7 hours per 1000 series
```

---

## 15.10f ASCII 도식 14 — Diffusion vs 기존 generative model

```
                        Approach Family
                              │
      ┌───────────┬───────────┼───────────┬───────────┐
      ↓           ↓           ↓           ↓           ↓
   [GAN]      [VAE]       [Flow]      [EBM]      [Diffusion]
   생성+      Encoder+     Invertible  Energy     Forward+
   판별기     Decoder      함수 + Jac.  function   Reverse Markov
      │         │           │           │           │
   adversarial KL constr.  Jacobian    Z intractable variational
   mode collapse Constraint  determinant  MCMC slow  bound 안정
   학습 어려움  posterior   on dim       sampling   학습 안정
                 collapse   functional             + sample 가능
                            제약                    + flexible
      │         │           │           │           │
   GAN-TS     KVAE       NKF/MAF     ─          TimeGrad
   (Yoon 2019) (Fraccaro)  (Rasul 2021)           (Rasul 2021)
      │         │           │                       │
   Mode       Posterior  Jacobian                  GAN의 안정 +
   collapse   collapse   constraint                EBM의 자유 +
                                                   Flow의 학습
```

---

## 15.10g ASCII 도식 15 — Cambrian Explosion 2021 (시계열 Generative)

```
                  NeurIPS / ICML 2021 의 시계열 generative paper

   Sept 2020 ──── DDPM (Ho et al.) 의 image SOTA
                              ↓
                              ↓ "1년 안에 시계열에 적용"
                              ↓
   ──────── 2021 ────────────────────────────────────────
   
   ICML 2021 ──── TimeGrad (Rasul) ★ 이 paper
                  RNN + DDPM diffusion
                  6 datasets 중 5 SOTA
                              │
                              ↓ "확장 + 변형 + 가속"
                              ↓
   
   NeurIPS 2021 ── ProTran (Tang-Matteson)
                   Variational SSM + Transformer
                   TimeGrad 의 Table 1 baseline 으로 등장
                   (TimeGrad 의 5/5 dataset 능가)
                              │
                              ↓
   
   NeurIPS 2021 ── Autoformer (Wu)
                   Auto-Correlation + decomposition
                              │
                              ↓
   
   NeurIPS 2021 ── CSDI (Tashiro)
                   Conditional score-based imputation
                              │
                              ↓
   ──────── 2022-2024 ─────────────────────────────────────
   
   2022     ──── Improved DDPM (Nichol-Dhariwal) for time series
   2024     ──── TMDM (Li, ICLR) Transformer-modulated diffusion
   2024     ──── Diffusion-TS (Yuan)
```

---

## 15.11 그 외 useful figures (paper 발췌)

---

## 15.11 그 외 useful figures (paper 발췌)

| 그림 | paper 위치 | 본 deep dive 의 위치 |
|------|----------|---------------------|
| Fig 1 TimeGrad schematic | p.4 | ch05b |
| Fig 2 Network architecture | p.5 | ch05b, ch14 |
| Table 1 Datasets | p.5 | ch07 |
| Table 2 CRPS_sum results | p.6 | ch08 |
| Fig 3 N ablation | p.7 | ch09 |
| Fig 4 Traffic predictions | p.7 | ch09 |

전체 figures 폴더: `figures/{page4_Fig1, page5_Fig2, page5_Table1, page6_Table2, page7_Fig3, page7_Fig4}_*.png`.

---

## 15.12 Equations Summary

| Eq | 의미 | Chapter |
|----|------|---------|
| **Eq 1** | Forward step (Gaussian noise) | ch04 |
| Eq 2 | Variational bound (decomposed log-likelihood) | ch04 |
| **Eq 3** | Forward closed-form $q(\mathbf{x}^n\|\mathbf{x}^0)$ | ch04 |
| Eq 4 | KL-divergence form of loss | ch04 |
| Eq 5 | Forward posterior $q(\mathbf{x}^{n-1}\|\mathbf{x}^n, \mathbf{x}^0)$ | ch04 |
| Eq 6 | KL as MSE | ch04 |
| **Eq 7** | **Final noise prediction loss** | ch04 |
| **Eq 8** | TimeGrad conditional decomposition | ch05a |
| **Eq 9** | RNN update | ch05b |
| Eq 10 | Joint as RNN conditional | ch05b |
| (no Eq) | Conditional Eq 7 with $\mathbf{h}_{t-1}$ | ch05b |
| (no Eq) | Langevin sampling step | ch06 |

**Bold** = paper 의 핵심 contribution. 본 deep dive 의 5 chapter (04, 05a, 05b, 06) 에서 깊이 해체.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **ASCII 도식 1 (전체 architecture) 에서 RNN 의 output 이 어디로 흘러가는가?**
2. **ASCII 도식 5 (Multivariate baselines 비교) 에서 TimeGrad 가 "no limit" 인 이유의 본질은?**
3. **단계적 깊이 (도식 9) 의 "네 층" 메시지 — TimeGrad 의 paradigm 의 일반화 가능성?**

### 답변

1. **RNN hidden state $\mathbf{h}_{t-1}$ 가 모든 diffusion step 의 conditioning** 으로 사용. 즉 매 reverse step $n$ 에서 $\epsilon_\theta(\mathbf{x}^n_t, \mathbf{h}_{t-1}, n)$ 의 입력 — same $\mathbf{h}_{t-1}$ 이 $N=100$ step 모두 활용. Diffusion 끝나면 (예측한 $\mathbf{x}^0_t$ 가 나옴) 다시 RNN update — $\mathbf{h}_t = \text{RNN}(\text{concat}(\mathbf{x}^0_t, \mathbf{c}_t), \mathbf{h}_{t-1})$ — next time step 의 conditioning 으로.
2. **EBM 의 functional form 자유**: $\epsilon_\theta$ 가 임의 신경망 (여기서는 8 residual blocks of Conv1d). VAR (linear), Vec-LSTM (low-rank Gaussian), Transformer-MAF (invertible NN) 모두 **architecture 제약** 있음. EBM 은 그런 제약 없이 universal approximator 사용 가능. Multivariate high-D distribution + disconnected modes 모두 표현. Trade-off = 학습 + sampling 비용.
3. **"분야 dominant tool 의 변형보다 인접 분야 paradigm 의 직접 transfer 가 효과적"**. 이게 PatchTST (ViT → 시계열), iTransformer (Transformer → 시계열 variable), TimeGrad (DDPM → 시계열) 의 동일 정신. **일반화**: 같은 정신이 다른 분야에도 적용 가능 — Foundation model 의 cross-domain 학습이 결국 이 paradigm 의 극단. Sequence data 의 통일된 framework (image + audio + time series + text) 으로 발전 중.
