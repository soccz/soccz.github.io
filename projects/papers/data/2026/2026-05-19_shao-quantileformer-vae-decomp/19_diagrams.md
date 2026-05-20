# 19. Diagrams & Interactive Visualizations

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 핵심 개념을 **ASCII 도식 7 개** 로 정리
- **인터랙티브 viz 카탈로그 8 개** — 챕터별 어느 viz 가 어디 inline 됐는지
- Eq 1-21 의 한 줄 요약 summary
- 발표용 추천 그림 3 개

---

ASCII 도식 + interactive viz 카탈로그.

---

## ★ 본 chapter 의 사용법

본 deep dive 의 모든 시각적 자료를 한 곳에 정리. 두 종류:

1. **ASCII 도식 (7개)**: 종이/터미널에서도 볼 수 있는 정적 도식. 본 chapter 전체.
2. **인터랙티브 viz (8개)**: `qf-*` 식별자로 deep.html / read.html 에 렌더링. 슬라이더·토글 가능.

| 용도 | 추천 자료 |
|------|---------|
| 전체 architecture 이해 | ASCII 도식 1 (전체 architecture) |
| 분해 단계 따라가기 | ASCII 도식 2 (2-stage decomp) + `qf-drift-divergence` viz |
| VAE 내부 변수 흐름 | ASCII 도식 3 (VAE graph) + `qf-vae-graph` viz |
| Fusion attention 이해 | ASCII 도식 4 (fusion flow) |
| Loss 모양 이해 | ASCII 도식 5 (pinball V-shape) |
| Metric 직관 | ASCII 도식 6 (cpaw 의 두 component) |
| 4년 진화 이해 | ASCII 도식 7 (Autoformer→QuantileFormer) |
| Table 분석 | `qf-qrisk-table1`, `qf-cpaw-table3`, `qf-ablation-table4` viz |
| Hyperparameter k 영향 | `qf-hyperparam-k` viz (Fig 3 재현) |
| Probabilistic interval 비교 | `qf-quantile-prediction` viz (Fig 4 재현) |

---

## ASCII 도식 1 — 전체 architecture

> **🎯 한 줄 메시지**: "**본 paper 의 architecture 한 그림** — 시계열 입력 → 두 path 로 분리 (drift / divergence) → 각각 처리 (Transformer / VAE) → fusion 으로 결합 → quantile 예측".

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

> **🎯 한 줄 메시지**: "**시계열을 2 단계로 분해**: (1) drift + divergence (Eq 4), (2) divergence → K Gaussian mixture (Eq 7). Autoformer (1-stage) 의 일반화".

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

> **🎯 한 줄 메시지**: "**VAE 의 잠재 변수 의존 관계** — Beta-Bernoulli prior + Gaussian prior 의 결합으로 mixture weight $\pi$ 학습".

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

> **🎯 한 줄 메시지**: "**Cross-attention 의 정보 흐름** — Query=divergence (모름), Key/Value=drift (앎) → divergence 가 drift 에서 정보 추출 → fusion".

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

> **🎯 한 줄 메시지**: "**비대칭 V-shape loss** — $\tau=0.9$ 일 때 왼쪽 (under-pred) 경사 0.9 vs 오른쪽 (over-pred) 경사 0.1 → 모델이 위로 치우친 예측 학습 = 90 percentile".

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

> **🎯 한 줄 메시지**: "**PINAW (폭) × PICP (coverage) 의 결합** — 좁 + 정확 = best, 넓 + 정확 = useless, 좁 + 부정확 = 위험. cpaw 가 한 metric 으로 다 평가".

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

> **🎯 한 줄 메시지**: "**4 년 진화** — 2 분해 (trend+seasonal) → 3 분해 (drift+divergence+GMM), Auto-Correlation → Cross-Attention, deterministic → probabilistic".

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

## ★ 7개 ASCII 도식의 핵심 통찰 — 한 줄씩

각 도식이 왜 존재하는지, 무엇을 시각화하는지:

| 도식 # | 무엇을 보여주나 | 왜 중요한가 |
|--------|--------------|----------|
| 1. 전체 architecture | 입력 → 분해 → 두 path → fusion → output 의 정신적 모델 | paper Fig 2 를 단순화 — **5초 안에 전체 흐름 파악** |
| 2. 2-stage decomp | drift-divergence (Stage 1) + GMM (Stage 2) 의 순차 | 분해가 **2 stage** 임을 시각적으로 강조 — 기존 1 stage 분해 (Autoformer) 와 차별 |
| 3. VAE 변수 graph | priors (ν, ζ, ς, κ) → samples (b, λ, c) → latent z → output | 가장 복잡한 chapter (ch07) 의 변수들 관계를 한 그림으로 |
| 4. Fusion 흐름 | drift K/V, divergence Q 의 비대칭 cross-attention | Q/K/V 의 source 차이를 시각화 — ch09 의 ★ 통찰과 sync |
| 5. Pinball V-shape | $\tau = 0.5$ 대칭, $\tau = 0.9$ 비대칭 | "**왜 quantile 학습되는가**" 의 시각적 직관 |
| 6. cpaw component | PINAW (width) + PICP (coverage) 의 결합 | metric 의 두 측면을 한 그림으로 |
| 7. Autoformer→QuantileFormer 진화 | 4년 사이의 5가지 진화 | paper 의 **역사적 위치** 명확화 |

→ 7개 도식이 본 deep dive 의 7 chapter 핵심을 시각화 (ch06, 06, 07, 09, 10, 11, 15).

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
