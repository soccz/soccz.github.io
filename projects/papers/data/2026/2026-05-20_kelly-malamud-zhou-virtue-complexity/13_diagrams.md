# 13. ASCII 도식 + 인터랙티브 viz 카탈로그

> **🧒 한 줄 요약**: ASCII + interactive viz. Complexity curves, phase transition.


> 본 deep dive 의 모든 시각 자료를 한 곳에 — ASCII 도식 (텍스트로 직관적 그림) + 인터랙티브 viz block 카탈로그 (슬라이더로 만지기).

---

## 13.1 논문 전체 흐름 (ASCII)

```
                      The Virtue of Complexity
                  Kelly · Malamud · Zhou (JF 2024)
                              ↓
   ┌──────────────────────────────────────────────────────────────┐
   │ Q: Should an analyst use a simple or complex model?           │
   │ Trade-off: approximation gain vs statistical cost              │
   └──────────────────────────────────────────────────────────────┘
                              ↓
                Section I — Environment
       Assumption 1: R = S'β + ε (single asset)
       Assumption 2: S = Ψ^{1/2} X (signal structure)
       Assumption 3: F^Ψ → H (eigenvalue limit)
       Assumption 4: β random isotropic
                              ↓
            LEMMA 1: β' A β → P^{-1} b_* tr(A)
                              ↓
                PROPOSITION 1 (Infeasible)
        SR_∞ = 1 / √(3 + 1/(b_*ψ_*,1)) < 1/√3
                              ↓
                Section II — Random Matrix Theory
        ξ(z; c) = (1 - z m(-z;c)) / (c^{-1} - 1 + z m(-z;c))
                              ↓
              PROPOSITION 2 (RMT identity)
        All limits depend ONLY on m(-z; c) — observable
                              ↓
        ┌─────────────────────┐          ┌─────────────────────┐
        │  Section III        │          │  Section IV         │
        │  Correctly Specified│          │  Misspecified       │
        │  Prop 3: R², ε, L    │          │  Prop 5: all limits │
        │  Prop 4: SR          │          │  Prop 6: simplified │
        │  Fig 1: R² catastrophe│         │  Theorem 1: VoC!   │
        │  Fig 3: SR positive  │          │  Fig 6: monotone SR │
        │  z_* = c/b_*         │          │  Fig 5: E monotone │
        └─────────────────────┘          └─────────────────────┘
                                                    ↓
                Section V — Empirical
       Data: CRSP 1926-2020 + Goyal-Welch 15
       Method: Random Fourier Features (P = 12,000)
       Procedure: recursive OOS, T = 12/60/120
                              ↓
       ┌──────────────────────────────────────────────┐
       │  Figure 7: Empirical VoC (R², β̂, E, Vol)     │
       │  Figure 8: Sharpe / α / IR / t-stat ≈ 0.47   │
       │  Figure 9: T=60, 120 ditto                   │
       │  Figure 10: Position + NBER 14/15 divest    │
       │  Figure 11: Variable importance              │
       │  Table I: vs Goyal-Welch original           │
       └──────────────────────────────────────────────┘
                              ↓
                Section VI — Conclusion
       "Use the largest model you can compute"
       "Occam's razor may be Occam's blunder"
```

---

## 13.2 핵심 알고리즘 단계

```
┌────────────────────────────────────────────────────────────────┐
│  MACHINE LEARNING TIMING STRATEGY (논문의 procedure)            │
└────────────────────────────────────────────────────────────────┘

Step 1. Generate RFFs (one-time)
    ω_i ~ N(0, I_J),  i = 1, ..., K = P/2
    S_{i,t} = [sin(γ ω_i' G_t), cos(γ ω_i' G_t)]
    →  S_t ∈ R^P  (P features, T months)

Step 2. Rolling OOS prediction (for each t = T_window, ..., T-1)
    Training: { (R_{s+1}, S_s) : s ∈ [t - T_window, t) }
    β̂_t = (z I + Ŝ' Ŝ / T_window)^{-1}  · Ŝ' R / T_window
    Forecast: π̂_t = β̂_t' S_t
    
Step 3. Realize timing return
    R^π_{t+1} = π̂_t · R_{t+1}

Step 4. Evaluate
    OOS R² = 1 - Σ(R_{t+1} - π̂_t)² / Σ R_{t+1}²
    Sharpe = mean(R^π) / std(R^π) × √12
    IR = α / σ_residual (after regression on market)

Step 5. (Optional) Average over 1000 RFF draws
    Repeat Step 1-4 with different seeds, average performance.
```

---

## 13.3 Bias-Variance Trade-off 시각화

```
   Model complexity P
   ─────────────────→
   Simple (P=15)               Interpolation (P≈T)          Complex (P=12,000)
   ════════════════════════════════════════════════════════════════════════
   
   Bias:        ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                ↑ high (coarse approximation)                  ↓ low (rich)
   
   Variance:    ░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░░░░░
                                ↑ spike at P=T                
                                  (forecast variance ↑)
   
   OOS MSE:     ██████████░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░
                ↑              ↑                ↑                 ↑
                approximation  catastrophe      benign overfit    flat
                error           (R² → -∞)        + ridgeless reg
   
   OLS:         ✓ works         ✗ singular       ✗ undefined
   Ridge z>0:   ✓ small bias    ✓ stabilizes    ✓ implicit reg
   Ridgeless:   ✓ ≈ OLS         ✗ explosive     ✓ smallest norm
```

---

## 13.4 RMT 의 두 Stieltjes 비교

```
              True Ψ                       Sample Ψ̂
              (unobservable)                (observable)
              
   Eigenvalues:                            Eigenvalues:
   λ_1, ..., λ_P ~ H (Assumption 3)        λ̂_1, ..., λ̂_P
                                           
   F^Ψ → H (as P → ∞)                       F^Ψ̂ → ?
                                           
   m_Ψ(z) = ∫ 1/(x-z) dH(x)                m(z; c) = ?
   
                       ↓
            Marchenko-Pastur Theorem
   
   For Ψ = I (iid noise), c = P/T:
   m(-z; c) = (-((1-c)+z) + √(((1-c)+z)²+4cz)) / (2cz)
   
   For c → 0:   m(-z; 0) = 1/(1+z) = m_Ψ(-z)   (수렴)
   For c > 0:   m(-z; c) > m_Ψ(-z)   (perturbed)
   For c → ∞:   m(-z; c) → 1/(z√c)   (수렴)
                       ↓
   ┌──────────────────────────────────────┐
   │  Proposition 2:                       │
   │  All portfolio limits use m(-z; c)   │
   │  only — observable!                   │
   └──────────────────────────────────────┘
```

---

## 13.5 Theorem 1 의 monotonicity 패턴

```
                        Sharpe Ratio
                              ↑
                              │
   1/√(3+1/(b_*ψ_*1))         ┤ . . . . . . . . . . . . . . infeasible upper bound
                              │
                              │                  z_* trajectory (Theorem 1)
                              │                          ╱
                              │                         ╱  ↗ "permanent ascent"
                              │                       ╱
                              │                     ╱
                              │                   ╱
                              │                 ╱  ridgeless
                              │   ╱╲          ╱           (double ascent — hump)
                              │  ╱  ╲       ╱                 ↗
                              │ ╱    ╲    ╱     ┄ ┄ ┄ ┄ ┄ ┄ ┄
                              ╱       ╲ ╱
                          0   ┼────────●─────────────────────────────→
                                       cq = 1                          q (empirical/true ratio)
                                  (interpolation boundary)             
                                                        
   Theorem 1: With optimal z_*, ∂SR/∂q > 0 + ∂²SR/∂q² < 0
                                       (monotone increasing + concave)
```

---

## 13.6 ML Timing Position 의 시계열 패턴 (Figure 10)

```
   ML timing π̂_t (T=12, P=12000, z=10^3)
   
   ┌────────────────────────────────────────────────────────────────┐
   │       ╱╲                                                        │
   │      ╱  ╲                                                       │
   │     ╱    ╲                                                      │
   │    ╱      ╲    ╱╲                                              │
   │   ╱        ╲  ╱  ╲                                              │
   │  ╱          ╲╱    ╲          ╱╲              ╱╲                 │
   │ ╱            ╲     ╲        ╱  ╲            ╱  ╲                │
   │              ░██░    ╲░░░░░╱    ░░░░░░░░░░░╱   ░░░░░░░░░░░░░░░ │
   │              ↑          ↑         ↑              ↑              │
   │            1930       1940      1950           1960            ... │
   │           GD recession  WWII    Korea         Vietnam            │
   │           (divest!)    (1945    (recovery     (recovery          │
   │                         exception)            adjustment)        │
   └────────────────────────────────────────────────────────────────┘
   
   Pattern:
   - Long-only at heart (음의 position 드물)
   - NBER recession 직전 (gray shaded) 자동 divest
   - 14 out of 15 recessions in test sample
   - Exception: 1945 (8-month, WWII 직후, structural break)
   - Purely OOS — no future information used
```

---

## 13.7 Linear vs Nonlinear ML 비교 (Table I)

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                       Linear      Linear       Nonlinear ML       │
   │                       ridgeless   ridge z=10³   ridge z=10³       │
   │                       (Goyal-     (간단 fix)    (RFF P=12,000)    │
   │                        Welch                                       │
   │                        original)                                   │
   │ ─────────────────────────────────────────────────────────────────│
   │  Panel A (T=12)                                                    │
   │    OOS R²             <-100%       -3.8%          +0.6%           │
   │    Sharpe             -0.11        0.46           **0.47**         │
   │    Sharpe t-stat      -1.0         4.4            4.5             │
   │    Alpha (vs market)  -            0.33 (t=3.1)   0.31 (t=2.9)    │
   │    Alpha (vs linear)  -            -              0.26 (t=2.5)    │
   │    Max loss (SD)      98.5         2.4            **1.2**         │
   │    Skewness           -0.9         -0.1           **+2.5**        │
   │                                                                    │
   │  Panel B (T=60)                                                    │
   │    Sharpe             0.00         0.44           0.42            │
   │    Alpha vs linear    -            -              0.27 (t=2.5)    │
   │                                                                    │
   │  Panel C (T=120)                                                   │
   │    Sharpe             0.20         0.49           0.41            │
   │    Alpha vs linear    -            -              0.24 (t=2.2)    │
   └──────────────────────────────────────────────────────────────────┘
   
   메시지:
   1. Shrinkage 만으로 dramatic 향상 (linear ridgeless → linear ridge)
   2. Nonlinear 의 incremental gain (linear ridge → nonlinear ML) ≈ IR 0.26
   3. Tail risk (max loss, skewness) 가 nonlinear 가 가장 좋음
```

---

## 13.8 분야 흐름도 — 본 논문의 위치

```
                     자산가격결정 학계 (1960s-2024)
                              │
   ┌──────────────────────────┴────────────────────────────┐
   │                                                          │
1960s-1980s: CAPM, APT (Ross 1976)                       Theory
1990s: Fama-French 3 factor (1992-93)                     ↓
2000s: Conditional models, Bayesian                       Empirical
2010-2015: Empirical anomaly explosion (factor zoo)        ↑
                                                          │
2018-2020: ML wave 1 — empirical                           │
  ├─ Gu-Kelly-Xiu (2020) Autoencoder                       │
  ├─ Chen-Pelger-Zhu (2023) GAN no-arbitrage             ML × AP
  ├─ Freyberger-Neuhierl-Weber (2020) nonparametric         │
  ├─ Kozak-Nagel-Santosh (2020) shrinking cross-section    │
  └─ Lettau-Pelger (2020) RP-PCA                            │
                                                          │
2024: ML wave 2 — theoretical                              │
  ├─ Kelly-Malamud-Zhou ★ (본 논문)                        │
  │  Random matrix theory + ridge regression               │
  │  Theorem 1: Virtue of Complexity                       │
  └─ Hastie et al (2022) — finite sample                   │
                              │
                     ┌────────┴────────┐
                     │                  │
              Future direction 1   Future direction 2
              Cross-section VoC    Time-varying β (regime)
              (각주 2)              (각주 14, 15, 16)
              (Multi-asset)        (Online learning)
```

---

## 13.9 인터랙티브 viz 카탈로그 (9개)

본 deep dive 의 모든 viz block 을 한 곳에 모음. 슬라이더로 직접 만지기.

### viz 1 — Marchenko-Pastur 분포 (Section II)

```viz:rppca-mp-spectrum:title=Marchenko-Pastur 분포 (RMT 출발점),caption=c = P/T 슬라이더로 sample eigenvalue 분포 변화. Ψ = I (iid) 일 때 sample eigenvalue 가 MP distribution 으로 수렴. c 클수록 spread (작은 eig 0 쪽 large 쪽). Bulk + spike 시각화.
```

### viz 2 — Figure 1 R² VoC curve (correctly specified)

```viz:voc-r2-curve:title=Figure 1 — 이론 OOS R² vs c (correctly specified),caption=c 슬라이더로 complexity, z 슬라이더로 shrinkage. Ridgeless (z≈0) 가 c=1 부근에서 -∞ 발산, c>1 에서 회복 (benign overfit). z>0 ridge 가 catastrophe 완화. b_* 슬라이더로 signal-to-noise 조절.
```

### viz 3 — Figure 3 Sharpe ratio (correctly specified)

```viz:voc-sharpe-curve:title=Figure 3 — 이론 OOS Sharpe ratio vs c,caption=동일 calibration. 모든 z 에서 ridgeless SR > 0 — negative R² 임에도 positive SR. c=1 부근 dip. z = 1 부근이 가장 robust. infeasible upper bound 1/√(3+1/(b_*ψ_*1)) red dashed.
```

### viz 4 — Figure 6 Theorem 1 (Virtue of Complexity) ★

```viz:voc-misspec-monotone:title=Figure 6 — Theorem 1 (Virtue of Complexity),caption=★ 본 논문의 가장 중요한 시각화. cq 슬라이더로 empirical complexity 변화, z 슬라이더로 shrinkage. **모든 z 에서 SR monotone increasing in cq** — Theorem 1 의 시각적 의미. Ridgeless 에서 cq=1 dip (double ascent), z > 0 에서 smooth monotone (permanent ascent). True DGP c = 10.
```

→ 이게 **본 deep dive 의 preview viz** (LANDING 의 preview).

### viz 5 — RFF mechanism (Section V.B)

```viz:voc-rff-mechanism:title=Random Fourier Features 메커니즘,caption=Equation 20 의 변환 시각화. G_t (15차원 macro vector, 사용자 슬라이더로 component 1 변화) → ω_i ~ N(0, I) 무작위 사영 → sin(γ ω'G), cos(γ ω'G). γ 슬라이더로 bandwidth 조절 (작으면 linear, 크면 nonlinear). P=2K pairs 생성.
```

### viz 6 — Figure 7/8 Empirical OOS Sharpe + α + IR

```viz:voc-empirical-sharpe:title=Figure 8 — 실증 Sharpe / Alpha / IR / t-stat,caption=T 토글 (12/60/120), z 슬라이더, c 슬라이더. Sharpe / Alpha / IR / t-stat 4-panel. 모든 panel 에서 c 의 monotone increasing — Theorem 1 의 실증 일치. 고복잡도 SR > 0.4, IR ≈ 0.3, t-stat > 2.5.
```

### viz 7 — Figure 10 Market timing positions + NBER recessions

```viz:voc-empirical-positions:title=Figure 10 — Market timing positions + NBER recessions,caption=T 토글 (12/60/120). 1930-2020 monthly timing positions. 회색 음영 = NBER recessions 15개. **14/15 에서 timing 이 침체 전 자동 divest** (예외: 1945 WWII 직후). Long-only at heart. Purely out-of-sample.
```

### viz 8 — Figure 11 Variable importance

```viz:voc-variable-importance:title=Figure 11 — 15 predictor 의 Variable importance,caption=15 predictor 의 R² (bars) + Sharpe (line) VI. Top 3: lag mkt / ltr / dfr (most variable in 12-month windows). 정적 viz with toggle (R² / SR). T=12, P=12000, z=10³ 평균 (1000 RFF draws).
```

### viz 9 — Table I comparison

```viz:voc-comparison-table1:title=Table I — Goyal-Welch comparison (Linear / Linear+ridge / Nonlinear ML),caption=T 토글 (12/60/120). 막대 그래프: Linear ridgeless / Linear ridge (z=10³) / Nonlinear ML (RFF P=12k, z=10³) 3 모델 비교. Metric 토글: SR / R² / Max Loss / Skew. 비선형성의 incremental gain (IR vs linear 0.26, t=2.5) 직관 확인.
```

---

## 13.10 결과 비교 요약 표

```
   ┌─────────────────────────────────────────────────────────────────┐
   │                                  Theory       Empirical          │
   │ ─────────────────────────────────────────────────────────────│
   │  Sharpe ratio (correctly spec.)  > 0 ridgeless  +0.47 (T=12)    │
   │  Sharpe ratio (misspecified)     monotone ↗     monotone ↗     │
   │  Optimal shrinkage z_*           = c/b_*        ≈ 10³ (heuristic)│
   │  R² magnitude                    near 0          0.6% (best)    │
   │  R² < 0 ⊥ SR > 0                 Proposition 4   Table I 확인   │
   │  ↗  Hump at c = 1 (no shrinkage) Fig 3 dip      Fig 7 spike     │
   │  ↗  Permanent ascent (z = z_*)    Theorem 1      Fig 8 monotone │
   │  ↗  Long-only at heart            -              Fig 10         │
   │  ↗  14/15 NBER divest             -              Fig 10         │
   │  ↗  Linear vs nonlinear alpha     IR vs linear   t = 2.5        │
   │  IR vs market                     -              ~0.3 t≈2.9      │
   └─────────────────────────────────────────────────────────────────┘
```

---

## 13.11 Cauchy / Stieltjes transform 직관

```
   Spectral distribution 의 "압축"
   
   F^Ψ (eigenvalue distribution, P-dim)
                  ↓ (모든 정보를 한 함수로)
   m_Ψ(z) = ∫ 1/(x - z) dF^Ψ(x)   for z ∈ C\R₊
                  ↓
   "resolvent average" — z 에서 모든 eigenvalue 까지의 거리의 역수의 평균
                  ↓
   Stieltjes inversion formula:
   f^Ψ(x) = (1/π) lim_{ε→0+} Im m_Ψ(x + iε)
                  ↓
   모든 spectral 정보 복원 가능
   
   ┌───────────────────────────────────────┐
   │  본 논문에서:                          │
   │  sample m(-z; c) 만으로 모든 limit      │
   │  → unobservable m_Ψ 필요 없음          │
   │  → Proposition 2 의 magic              │
   └───────────────────────────────────────┘
```

---

## 13.12 Risk on / off 의 시각화

```
   Predictor (e.g., stock variance "svar") at percentile rank
   ↓
   0%       25%        50%        75%       100%
   ─────────────────────────────────────────→
   
   ML expected return:
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   ↑                  ↑                                                ↑
   high E[R]          drops to ~0                              consistently
   (long market)      (cash)                                    cash
   
   Interpretation:
   - Low variance (calm market): ML expects positive return → long
   - High variance (volatile market): ML expects ~0 return → cash
   - "Risk on / risk off" automatic detection
   
   This pattern emerges WITHOUT explicit programming —
   purely from learning on Goyal-Welch 15 predictors
   nonlinearly transformed via RFF.
```

---

## 13.13 자기점검 (이 챕터)

### 핵심 3가지
1. **viz `voc-misspec-monotone` 가 preview viz 인 이유?**
2. **Figure 10 의 시각화가 economic 으로 시사하는 가장 큰 메시지?**
3. **본 deep dive 가 RP-PCA / Autoencoder / DLAP 와 형성하는 Kelly-Pelger lineage 의 흐름?**

### 답변
1. Figure 6 — Theorem 1 (Virtue of Complexity) 의 시각적 statement. 본 논문 가장 중요한 결론을 한 그래프로: "모든 $z$ 에서 Sharpe ratio 가 모델 복잡도 $cq$ 의 monotone increasing". 슬라이더로 $z$ 조절하면 ridgeless (z≈0) 의 hump 와 z>0 의 smooth permanent ascent 가 동시 시각화. 30초 안에 "*복잡함의 미덕*" 의 의미 전달.
2. **"14/15 NBER recessions 자동 divest, purely out-of-sample"** — 같은 정보 (Goyal-Welch 15) 가 60년 학계에 있었지만, *적합 methodology* (RFF + ridge + nonlinear) 만 더하면 *recession leading signal* 가 출현. Real-time signal: 침체 전 시장 비중 자동 감소. *Macro economics 의 holy grail* 을 finance ML 이 달성 — without explicit constraints. 본 deep dive 의 가장 *visceral* 한 발견.
3. **Lineage**: (a) [Lettau-Pelger 2020 RP-PCA](../2026-05-17_lettau-pelger-rppca/) — 약한 요인 검출 (분산 + 평균). (b) [Gu-Kelly-Xiu 2020 Autoencoder AP](../2026-05-17_gu-kelly-xiu-autoencoder/) — nonlinear conditional factor model. (c) [Chen-Pelger-Zhu 2023 DLAP](../2026-05-18_chen-pelger-zhu-deep-learning-ap/) — no-arbitrage GAN. (d) **VoC 2024** — Kelly-Pelger 계보의 **이론적 정당화**. 이전 세 편이 *실증* 으로 ML 의 효과를 보였다면 (a) 약한 요인, (b) nonlinear factor, (c) interaction effect, **(d) 가 그 모든 효과의 *RMT-based foundation* 을 제공**. 즉 *"왜 ML 이 작동하는가"* 의 통일된 답. Lineage 의 **마지막 정점**.

---

이것으로 본 deep dive 의 모든 챕터 (총 19개) 작성 완료.

전체 분량: 약 80,000 + 한국어 글자 (목표 30,000-40,000 의 2배). 각 챕터:
- 원문 모든 정리·가정·각주·equation 풀이
- 수식 4줄 원칙 일관 적용
- 자기점검 3 Q&A 모든 챕터에 포함
- Figure 마크다운 + 인터랙티브 viz fence 인라인

라이브 URL: https://soccz.github.io/projects/papers/deep.html?slug=2026-05-20_kelly-malamud-zhou-virtue-complexity
