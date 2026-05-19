# 17 Diagrams + Viz Catalog

## ASCII — PatchTST 전체 architecture

```
=== Supervised Forecasting (Fig 1b) ===

Multivariate input x ∈ R^{B × M × L}
            │
            ↓
       ┌─────────────────┐
       │  Channel split  │   B × M × L  →  B*M instances of (1, L)
       └─────────────────┘
            │
            ↓
       ┌─────────────────┐
       │ Instance Norm   │   각 (1, L) 에 zero-mean, unit-std
       └─────────────────┘
            │
            ↓
       ┌─────────────────┐
       │  Patching       │   L → P=16, S=8 → N=42 patches
       │  (P, S)         │   (1, L) → (P, N)
       └─────────────────┘
            │
            ↓
       ┌─────────────────┐
       │ Linear proj     │   W_p ∈ R^{D × P}
       │ + Position      │   W_pos ∈ R^{D × N}
       └─────────────────┘
            │ x_d ∈ R^{D × N}
            ↓
   ╔═══════════════════════╗
   ║ Transformer Encoder  ×3║   ←── shared across all M channels
   ║                        ║
   ║  ┌──────────────────┐  ║
   ║  │ Multi-Head Attn  │  ║   Q, K, V = x_d W^{Q,K,V}
   ║  └──────────────────┘  ║   Softmax(QK^T / √d) V
   ║         + BatchNorm    ║
   ║  ┌──────────────────┐  ║
   ║  │  FFN + GELU      │  ║
   ║  └──────────────────┘  ║
   ║         + BatchNorm    ║
   ╚════════════════════════╝
            │ z ∈ R^{D × N}
            ↓
       ┌─────────────────┐
       │  Flatten        │   (D × N) → D·N
       │  + Linear head  │   W_head ∈ R^{(D·N) × T}
       └─────────────────┘
            │
            ↓
       ┌─────────────────┐
       │ Denormalize     │   y_norm * σ + μ
       └─────────────────┘
            │
            ↓
       ┌─────────────────┐
       │ Channel merge   │   B*M instances → (B, M, T)
       └─────────────────┘
            │
            ↓
       output y ∈ R^{B × M × T}
```

---

## ASCII — Self-supervised Pre-training (Fig 1c)

```
Univariate input x^(i) ∈ R^{1 × L=512}
            │
            ↓
     [Instance Norm]
            │
            ↓
     [Patching P=12, S=12 (non-overlap)]
            │ N=42 patches
            ↓
     [Random 40% mask → zero]
            │ 17 of 42 patches zeroed
            ↓
     [Linear proj + Position]
            │
            ↓
     [Transformer Encoder ×3]   ← same encoder as supervised
            │ z ∈ R^{D × N}
            ↓
     [Linear head W_recon ∈ R^{D × P}]    ← P, not T!
            │
            ↓
     [Reconstructed patches x̂_p ∈ R^{P × N}]
            │
            ↓
     [Loss = MSE on masked patches only]
```

---

## ASCII — Channel-independence vs Channel-mixing

```
=== Channel-Mixing (Informer / FEDformer) ===

Input: (B, M, L) — M=321 channels, L=336

Step 1: At each timestep t, concatenate all M variables
        x_t ∈ R^M for each t
        
Step 2: Each timestep → 1 token
        Token sequence: (B, L=336 tokens, M=321 features)
        
Step 3: Single Transformer processes mixed tokens
        Attention over L=336 timesteps
        Each attention weight aggregates ALL M variables

Complexity: O(L²) attention + O(M·D) embedding
Parameters: O(M·D) embedding


=== Channel-Independence (PatchTST) ===

Input: (B, M, L) — M=321 channels, L=336

Step 1: Split M channels into M separate univariate streams
        Each: (B, 1, L)
        
Step 2: Apply patching to each — same P, S
        Each: (B, 1, N=42, P=16)
        
Step 3: Flatten over (B, M) → (B*M, N, P)
        
Step 4: Single Transformer (shared weights!) processes
        All B*M instances pass through SAME encoder
        Attention over N=42 patches per instance
        
Step 5: Reshape back (B*M, N, T) → (B, M, T)

Complexity: O(N²) attention × M instances
Parameters: O(P·D) embedding (independent of M!)
```

---

## ASCII — Patching example (L=24, P=8, S=4 — simplified)

```
Original time series (L=24):
[x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23, x24]

After padding (last value repeated S=4 times):
[x1...x24, x24, x24, x24, x24]   ← length 28

Patches (P=8, S=4):
  Patch 1: [x1,  x2,  x3,  x4,  x5,  x6,  x7,  x8]
  Patch 2: [x5,  x6,  x7,  x8,  x9,  x10, x11, x12]
  Patch 3: [x9,  x10, x11, x12, x13, x14, x15, x16]
  Patch 4: [x13, x14, x15, x16, x17, x18, x19, x20]
  Patch 5: [x17, x18, x19, x20, x21, x22, x23, x24]
  Patch 6: [x21, x22, x23, x24, x24, x24, x24, x24]  ← padded

N = (24-8)/4 + 2 = 6 patches
P = 8 timestep per patch
Overlap = P - S = 4 timestep
```

---

## Viz catalog (interactive — at site)

| viz id | 챕터 | 무엇 | 입력 | 상호작용 |
|--------|------|------|------|---------|
| `pat-patching` | 04 | Patching mechanism — L → P×N | schematic | P/S slider |
| `pat-channel-indep` | 05 | Channel-indep vs mixing | schematic | toggle mode |
| `pat-table3-supervised` | 10 | paper Table 3 multivariate forecasting | exact paper values | dataset + horizon + metric toggle |
| `pat-lookback-window` | 10 | paper Fig 2 lookback vs MSE | exact paper values | dataset + horizon toggle |
| `pat-ablation-table7` | 12 | paper Table 7 ablation (P+CI/CI/P/Orig) | exact paper values | dataset + horizon toggle |
| `pat-masked-recon` | 08 | Self-supervised masked reconstruction | schematic | mask ratio slider |

→ 각 viz 의 구현은 site repo `viz/pat-*.js`.

---

## Figures (paper 발췌)

| 파일 | paper 위치 | 내용 |
|------|----------|------|
| `figures/Fig1_architecture.png` | p.4 | PatchTST architecture (a)(b)(c) |
| `figures/Fig2_lookback_window.png` | p.9 | Look-back window vs MSE on 3 datasets |
| `figures/Fig3_forecast_viz.png` | p.14 | 192-step forecasting visualization |
| `figures/Fig4_patch_length.png` | p.15 | Patch length ablation P=[2..40] |

전체 figures 폴더: `figures/{Fig1,Fig2,Fig3,Fig4}_*.png`.

---

## Reading order

추천 순서:
1. **개요**: 00_README → 01_intro → 02_abstract
2. **이해**: 03_motivation → 04_patching → 05_channel_independence
3. **세부**: 06_transformer_encoder → 07_instance_norm_loss
4. **확장**: 08_representation_learning
5. **실험**: 09_data_baselines → 10_supervised_results → 11_repr_transfer → 12_ablation
6. **종합**: 13_conclusion → 15_insights
7. **구현**: 16_code
8. **참고**: 14_glossary → 17_diagrams (현재)

---

## 이 deep dive 의 위치

```
시계열 deep learning 흐름:
   2017 Transformer
   2021 ProTran (probabilistic, latent attention)   ← 별도 deep dive
   2021 Autoformer (decomposition)                 ← 별도 deep dive
   2022 DLinear (linear baseline)
   2023 ★ PatchTST (patching + channel-indep) ★    ← 본 deep dive
   2024 iTransformer (channel attention)
   2024 Chronos / TimesFM / Moirai (foundation)
```

PatchTST 는 시계열 foundation model 시대의 출발점. 이후 모든 paper 의 baseline.
