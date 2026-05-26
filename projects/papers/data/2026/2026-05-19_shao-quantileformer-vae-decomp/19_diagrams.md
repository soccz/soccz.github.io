# 19 Diagrams & Interactive Visualizations

> **🧒 한 줄 요약**: ASCII + interactive viz. Architecture, decomposition, quantile output.


ASCII 도식 + interactive viz 카탈로그.

---

## ASCII 도식 1 — 전체 architecture

```
   원본 시계열 χ
        │
        ↓ Drift-Divergence Decomposition (Eq 4)
        │
   ┌────┴────────────────────────────────┐
   │                                      │
χ^Q = {χ^0.5 χ^0.6 χ^0.7 χ^0.8 χ^0.9}    χ^d = χ - χ^0.5
   │ (5 quantile drifts)                  │ (divergence pattern)
   │                                      │
   ↓ Transformer Encoder × 6              ↓ GMM (Eq 7)
   │ (Section 4.3)                        │
χ^Q_eout                                  D = {(μ_k Σ_k)}_{k=1}^K
   │ (K V)                                │
   │                                      ↓ VAE (Eq 8-15)
   │                                      │ (Section 4.2)
   │                                      │
   │                                  χ^d_out
   │                                      │ (Q)
   │                                      │
   └──────────────┬───────────────────────┘
                  │
                  ↓ Fusion Transformer (Eq 16-17)
                  │ (Section 4.4)
                  │
              Fusion
                  │
                  ↓ W (linear head Eq 18)
                  │
              ŷ ∈ R^{O × |Q|}
                  │
                  ↓ Joint Quantile Loss (Eq 19)
                  │
              Loss + KL
```

---

## ASCII 도식 2 — Pattern-Mixture Decomposition 의 2-stage

```
   Stage 1: Drift-Divergence Decomposition (Eq 4)
   ──────────────────────────────────────────────
   χ ──→ QuantileFilt(·, q=0.5) ──→ χ^{0.5} (median drift)
   χ ──→ QuantileFilt(·, q=0.6) ──→ χ^{0.6}
   χ ──→ QuantileFilt(·, q=0.7) ──→ χ^{0.7}
   χ ──→ QuantileFilt(·, q=0.8) ──→ χ^{0.8}
   χ ──→ QuantileFilt(·, q=0.9) ──→ χ^{0.9} (upper envelope)
   χ - χ^{0.5} ──→ χ^d (divergence)


   Stage 2: GMM Decomposition (Eq 5-7)
   ───────────────────────────────────
   χ^d → EM iteration → D = {(μ_1 Σ_1) (μ_2 Σ_2) ... (μ_K Σ_K)}
              ↑
        K Gaussian distributions optimally fit divergence
```

---

## ASCII 도식 3 — VAE 의 변수 그래프 (Eq 9)

```
   priors (encoder ϕ 가 추정):
   
   ς_k ─┐
        ├──→ Beta(ς_k κ_k) ──→ λ_t ──┐
   κ_k ─┘                              │
                                       ↓
                            Bernoulli(Π λ_tk) ──→ c_t (allocation)
                                                    │
                                                    │
   ν_k ─┐                                           │
        ├──→ N(ν_k ζ_k) ──→ b_t ───────────────────┤
   ζ_k ─┘    (contribution)                         │
                                                    ↓
                                                 z_t = Σ b_tk ż_t (latent)
                                                    │
                                                    ↓ decoder θ
                                                    │
                                                 χ^d_out (reconstructed)
                                                    │
                                                    ↓ Eq 10
                                                    │
                                                π_k (component weights)
                                                    │
                                                    ↓ Eq 8
                                                    │
                                                D̂ = Σ π_k D_k (global)
```

---

## ASCII 도식 4 — Fusion Transformer 의 흐름

```
        χ^Q_eout (drift)             χ^d_out (divergence)
             │                              │
             │                              ↓ W_a (align)
             │                              ↓
             │                              ↓ W_Q (query proj)
             ↓ W_K (key proj)               │
             │                              │
             ↓ W_V (value proj)             │
             │                              │
             │                              │
             K V (drift info)               Q (divergence asks)
             │                              │
             └────────────┬─────────────────┘
                          │
                ┌─────────↓──────────────────┐
                │ SelfAtt(Q Q Q)  ←  Q 자체  │
                │ CrossAtt(Input K V)        │
                │ FFN(Input)                 │
                └─────────┬──────────────────┘
                          │ sum
                          ↓
                       LayerNorm
                          │
                          ↓ × N_fusion layers
                          │
                       Fusion vector
                          │
                          ↓ W (Eq 18)
                          │
                       ŷ ∈ R^{O × |Q|}
```

---

## ASCII 도식 5 — Pinball Loss 의 모양

```
   τ = 0.5 (median):
       ↑
       │ loss
       │   ╲    ╱
       │    ╲  ╱
       │     ╲╱
       │ u=0
       └──────────────→ residual u
   
   τ = 0.9 (upper quantile):
       ↑
       │ loss
       │     ╲╱      ← steep right (under-prediction penalty)
       │   ╱  
       │ ╱   
       │ u=0
       └──────────────→ residual u
        asymmetric V
```

---

## ASCII 도식 6 — cpaw 의 두 component

```
   prediction
   ─────────────────────
   │       Upper bound (q=0.9) ────────⌐
   │                                   │  ← PINAW (width)
   │ ground truth   ●                  │
   │                                   │
   │       Lower bound (q=0.1) ────────┘
   ─────────────────────
   
   PICP = "● 가 [lower upper] 안에 있을 확률"
   PINAW = "평균 (upper - lower) / (range of y)"
   
   cpaw = PINAW × (1 + γ · exp(-(PICP - μ)))
                              └──────────────┘
                                exp grows when PICP < μ (under-coverage)
```

---

## ASCII 도식 7 — Autoformer (2021) vs QuantileFormer (2025) 의 진화

```
   ┌─────────────────── 2021 Autoformer ───────────────────┐
   │                                                        │
   │  X ──→ Trend-Seasonal Decomp ──→ Auto-Correlation     │
   │           (inner block)              (FFT)             │
   │                                       │                │
   │                                       ↓                │
   │                                  Single point Y        │
   │                                                        │
   └────────────────────────────────────────────────────────┘
                            ↓
              "분해 정신 + probabilistic"
                            ↓
   ┌──────────── 2025 QuantileFormer ──────────────────────┐
   │                                                        │
   │  X ──→ Quantile Drift + Divergence + GMM (3 component) │
   │  │            ↓                ↓                       │
   │  │      Transformer        VAE                         │
   │  │      Encoder            (variational)               │
   │  │            │                │                       │
   │  │            └─────┬──────────┘                       │
   │  │                  ↓                                   │
   │  │            Fusion Transformer                       │
   │  │            (Cross-Attention)                        │
   │  │                  ↓                                   │
   │  │            Quantile predictions {q_1 q_2 ... q_5}   │
   │                                                        │
   └────────────────────────────────────────────────────────┘
```

---

## ASCII Decision Tree — 언제 QuantileFormer 를 쓸까?

```
              Probabilistic forecasting 필요?
                     │
                     ↓
                Multi-modal distribution?
                  │           │
                 YES         NO
                  │           │
                  ↓           ↓
            QuantileFormer    DeepAR (Gaussian)
                  │           or TFT (quantile)
                  ↓
            Multi-quantile (3+ quantiles) 출력 필요?
                  │           │
                 YES         NO
                  │           │
                  ↓           ↓
            QuantileFormer    MQRNN (multi-quantile)
                  │
                  ↓
             분해 효과 활용 가능 (시계열에 trend + 복잡 cycle)?
                  │           │
                 YES         NO
                  │           │
                  ↓           ↓
            QuantileFormer    TFT (no decomp)
            (BEST FIT)
```

→ Sweet spot: **multi-modal + multi-quantile + decomposable** 시계열.

---

## 인터랙티브 시각화 카탈로그 (8종)

| viz id | 챕터 | 무엇 | 입력 | 상호작용 |
|--------|------|------|------|---------|
| `qf-qrisk-table1` | 12 | Table 1 의 6 datasets × 5 quantiles × 9 models q-risk | paper Table 1 정확 인용 | dataset toggle + quantile toggle |
| `qf-cpaw-table3` | 12 | Table 3 의 6 datasets × 7 models cpaw | paper Table 3 정확 인용 | dataset toggle |
| `qf-ablation-table4` | 13 | Table 4 의 4 datasets × 3 components × 3 quantiles | paper Table 4 정확 인용 | dataset toggle + quantile toggle |
| `qf-hyperparam-k` | 14 | Figure 3 의 k ∈ [2, 16] 의 q-risk U-shape | paper 권장 범위 + U-shape 추정 | dataset toggle + quantile toggle |
| `qf-drift-divergence` | 06 | Drift-Divergence decomposition viz | synthetic | quantile slider |
| `qf-gmm-decomp` | 06 | GMM 분해 viz | synthetic 1D | K slider |
| `qf-vae-graph` | 07 | VAE 의 변수 의존 graph | (static structure) | K slider |
| `qf-quantile-prediction` | 14 | Figure 4 재현 — 6 model probabilistic interval | synthetic Electricity-like | model toggle |

→ 각 viz 의 구현 = `viz/qf-*.js` (8개 모듈).

---

## 그 외 useful figures (paper 발췌)

| 그림 | paper 위치 | 본 deep dive 의 위치 |
|------|----------|---------------------|
| Fig 1 mixture patterns | p.1 | ch03 |
| Fig 2 architecture | p.3 | ch04, ch06-09 |
| Fig 3 hyperparameter k | p.7 | ch14 |
| Fig 4 visualization | p.7 | ch14 |

전체 figures 폴더: `figures/Fig{1,2,3,4}_*.png`.

---

## Equations Summary (8개 핵심 + 13개 부수)

| Eq | 의미 | Chapter |
|----|------|---------|
| Eq 1 | Quantile 정의 | ch05 |
| Eq 2 | Quantile regression | ch05 |
| Eq 3 | Optimization | ch05 |
| **Eq 4** | **Drift-Divergence Decomp** | ch06 |
| Eq 5 | Gaussian PDF | ch06 |
| Eq 6 | Likelihood | ch06 |
| **Eq 7** | **GMM (GauDe)** | ch06 |
| **Eq 8** | **Global Mixture** | ch07 |
| Eq 9 | Variational sampling | ch07 |
| Eq 10 | Component weight π_k | ch07 |
| Eq 11 | Normalization Z | ch07 |
| Eq 12 | KL min | ch07 |
| Eq 13 | KL divergence | ch07 |
| **Eq 14** | **ELBO** | ch07 |
| Eq 15 | VAE(·) output | ch07 |
| **Eq 16** | **Q, K, V projection** | ch09 |
| **Eq 17** | **Fusion** | ch09 |
| Eq 18 | Final ŷ | ch09 |
| **Eq 19** | **Joint Quantile Loss** | ch10 |
| **Eq 20** | **q-risk** | ch11 |
| **Eq 21** | **cpaw** | ch11 |

**Bold** = paper 의 핵심 contribution. 본 deep dive 의 8 chapter (06-11) 에서 각각 깊이 해체.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **ASCII 도식 1 (전체 architecture) 에서 두 path (drift / divergence) 가 합쳐지는 지점은?**
2. **paper 의 21 equation 중 본 deep dive 가 "**bold = 핵심**" 으로 표시한 9개의 공통점은?**
3. **Interactive viz 카탈로그 8 개 중 Fig 2 architecture 의 4 component 모두 가시화한 viz 는?**

### 답변

1. **Fusion Transformer (Eq 16-17)** — drift 의 $\chi^Q_{eout}$ 이 K, V 로, divergence 의 $\chi^d_{out}$ 이 Q 로 들어가 cross-attention. 그 전까지는 두 path 가 완전 별도 모듈 (encoder vs GMM+VAE).
2. **모두 paper 의 새 contribution 또는 핵심 design choice**. Eq 4 (decomp), 7 (GMM), 8 (global mixture), 14 (ELBO), 16-17 (fusion), 19 (joint quantile loss), 20-21 (metrics). 표준 (Gaussian PDF, KL divergence, Multi-head attention) 은 bold 안 함 — paper 의 contribution 식별 명확화.
3. **`qf-drift-divergence` + `qf-gmm-decomp` + `qf-vae-graph` + (전체 흐름은 ASCII 도식 1 만)** — 단일 viz 가 4 component 모두 가시화하지는 않음. ASCII 도식 1 (architecture) 이 전체 흐름 한 눈에. Interactive viz 는 각 component 별 (Fig 1 mixture patterns, Fig 2 architecture, Fig 3 hyperparam, Fig 4 visualization).
