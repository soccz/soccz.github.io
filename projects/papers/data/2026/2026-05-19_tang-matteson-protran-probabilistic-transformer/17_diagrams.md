# 17 Diagrams & Interactive Visualizations

ASCII 도식 + interactive viz 카탈로그.

---

## ASCII 도식 1 — Single-Layer ProTran 전체 흐름

```
   Context x_{1:C}              Full sequence x_{1:T} (train only)
        │                                │
        ↓ Eq 5: MLP + Position + LN      ↓ Eq 5
        │                                │
   h_{1:C}                          h_{1:T}
        │                                │
        │                                ↓ Eq 10: bidir self-attn
        │                                │
        │                            k_{1:T}
        │                                │
   For t = 1 to T:                       │
        │                                │
        ↓ w_{t-1}                        │
        │                                │
        ↓ Eq 6: Self-Attn(w_{t-1}, w_{1:t-1})
        │                                │
        ↓ ̄w_t                            │
        │                                │
        ↓ Eq 7: Cross-Attn(̄w_t, h_{1:C}) │
        │                                │
        ↓ ŵ_t ←──────────────────────────┤
        │                                │
        ↓ Training:                      │
        │   Eq 11: z_t ~ N(MLP([ŵ_t, k_t]), σ)
        ↓ Test:                          │
        │   Eq 8:  z_t ~ N(MLP(ŵ_t), σ) 
        │                                
        ↓ Eq 9: w_t = LN(ŵ_t + MLP(z_t) + Position(t))
        │
        ↓ x_t = MLP(w_t)
        │
        ↓ Append, continue to t+1
```

---

## ASCII 도식 2 — Multi-Layer (L=3) Architecture

```
                          x_t (emission)
                              ↑
                          MLP(w_t^{(L)})
                              ↑
        Layer 3 (top): ───── w_t^{(3)}
                              │
                              ↑ Eq 16: cross-layer attn
                              │ (Q=w_{t-1}^{(3)}, K,V=w_{1:T}^{(2)})
                              │
        Layer 2:      ─────── w_t^{(2)}
                              │
                              ↑ Eq 16: cross-layer attn  
                              │ (Q=w_{t-1}^{(2)}, K,V=w_{1:T}^{(1)})
                              │
        Layer 1 (bot): ────── w_t^{(1)}
                              │
                              ↑ Eq 6-7-8-9 within layer
                              │
                          From context + previous w_{1:t-1}^{(1)}
   
   Within each layer: Eq 16 (cross-layer) + Eq 17 (self-attn within layer) +
                      Eq 18 (cross-attn to context) + Eq 19 (sample z) + Eq 20 (update w)
```

---

## ASCII 도식 3 — Generative vs Inference (training)

```
                     TRAINING TIME (full x_{1:T} available)
   ───────────────────────────────────────────────────────
   Generative side (uses context):     Inference side (uses full):
   
   p_θ(z_t | z_{1:t-1}, x_{1:C})       q_φ(z_t | z_{1:t-1}, x_{1:T})
        ↑                                     ↑
        ŵ_t (Eq 7)                            [ŵ_t, k_t] (Eq 11)
        ↑                                     ↑
        Eq 6, 7 over h_{1:C}                  + k_t from Eq 10 (h_{1:T})
        
        ⤵                                     ⤵
        
              ELBO Loss (Eq 3):
              E_q[log p_θ(x_t|z_t)] - KL(q_φ || p_θ)
              ↑                       ↑
        reconstruction               regularization
                
                       TEST TIME (only x_{1:C})
   ───────────────────────────────────────────────────────
   Use prior only:
        z_t ~ p_θ(z_t | z_{1:t-1}, x_{1:C})    (Eq 8, no k_t)
        x_t = MLP(w_t)                          ← sample emission
```

---

## ASCII 도식 4 — Attention vs RNN 비교

```
   Standard RNN approach:
   ──────────────────────
        x_{t-1}     x_t      x_{t+1}
           │          │         │
           ↓          ↓         ↓
        h_{t-1} → h_t → h_{t+1}     ← sequential hidden states
           ↑          ↑         ↑
        z_{t-1}     z_t      z_{t+1}    ← latents
        
        Limitation: gradient vanishing for long t
   
   ProTran approach:
   ─────────────────
        Latent space: 
        z_1 ─ z_2 ─ z_3 ─ ... ─ z_T
        ↑↑↑      ↑   ↑          ↑↑↑
        └───── attention ────────┘
        
        All pairs (z_i, z_j) directly connected
        No gradient vanishing
```

---

## ASCII 도식 5 — CRPS 의 직관

```
   Predicted CDF F(z):    1 ───────────────────.--------
                            │            ╱╱╱╱╱╱
                            │       ╱╱╱╱╱
                            │   ╱╱╱
                            │ ╱
                          0 ─────────────────────────── z
                                       ↑
                                       observed x
   
   Ground truth step:     1 ────────────────.────────────
                            │                │
                            │                │
                          0 ─────────────────┴───────── z
                                              x
   
   CRPS = ∫ (F(z) - 1_{x≤z})² dz   = shaded area between curves squared
   
   → 작을수록 좋음 (predicted distribution 이 true 와 가까움)
```

---

## ASCII Decision Tree — 언제 ProTran 을 쓸까?

```
              Probabilistic time series modeling 필요?
                          │
                          ↓
                Multivariate (N > 1) 인가?
                  │           │
                 NO          YES
                  │           │
                  ↓           ↓
              DeepAR        Long-range dependency 필요?
              (univariate    │           │
               probabilistic) NO         YES
                              │           │
                              ↓           ↓
                          Linear SSM    ProTran
                          (LDS, KF)     (best fit)
                              
                                          │
                                          ↓
                                Sequence length T < 1000?
                                  │           │
                                 YES         NO
                                  │           │
                                  ↓           ↓
                              ProTran        Sparse Transformer 변형
                              (단일 layer)    + ProTran (future work)
```

---

## 인터랙티브 시각화 카탈로그 (6종)

| viz id | 챕터 | 무엇 | 입력 | 상호작용 |
|--------|------|------|------|---------|
| `pt-crps-table1` | 11 | Table 1 의 5 datasets × 12 models CRPS | paper exact values | dataset toggle |
| `pt-ablation-table2` | 11 | Table 2 의 4 settings ablation on Traffic | paper exact values | (static bar chart) |
| `pt-motion-table3` | 12 | Table 3 의 11 models × 2 datasets × 2 metrics | paper exact values | dataset + metric toggle |
| `pt-graphical-models` | 04 | Fig 1 의 (a) LDS / (b) 1-layer / (c) 3-layer Gen / (d) 3-layer Inf 4-panel | (schematic) | 4-mode toggle (gen=black arrows, inf=red arrows) |
| `pt-attention-flow` | 06 | Eq 5-9 의 generative process step-by-step | (synthetic) | time slider |
| `pt-hierarchical-stack` | 08 | Multi-layer (L=1, 2, 3) hierarchy 시각화 | (schematic) | L slider |

→ 각 viz 의 구현은 site repo `viz/pt-*.js`.

---

## 그 외 useful figures (paper 발췌)

| 그림 | paper 위치 | 본 deep dive 의 위치 |
|------|----------|---------------------|
| Fig 1 graphical models | p.2 | ch03, ch04, ch06, ch08 |
| Table 1 CRPS | p.7 | ch11 |
| Fig 2 Traffic predictions | p.8 | ch11 |
| Fig 3 human poses | p.9 | ch12 |
| Table 3 motion | p.9 | ch12 |

전체 figures 폴더: `figures/{Fig1,Fig2,Fig3,Table1,Table3}_*.png`.

---

## Equations Summary

| Eq | 의미 | Chapter |
|----|------|---------|
| **Eq 1** | SSM general form | ch04 |
| **Eq 2** | Transition + Emission decomposition | ch04 |
| **Eq 3** | ELBO (single-layer) | ch04, ch07 |
| **Eq 4** | Multi-head attention | ch05 |
| **Eq 5** | Context embedding | ch06 |
| **Eq 6-7** | Self-attn + Cross-attn for latent | ch06 |
| **Eq 8** | Generative sample z | ch06 |
| **Eq 9** | Update w | ch06 |
| **Eq 10** | Bidirectional attention (smoothing) | ch07 |
| **Eq 11** | Inference sample z (training) | ch07 |
| **Eq 12-13** | Multi-layer decomposition | ch08 |
| **Eq 14-15** | Multi-layer ELBO | ch08 |
| **Eq 16-20** | Per-layer generation steps | ch08 |

총 20 equations 모두 cover.
