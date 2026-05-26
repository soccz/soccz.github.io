# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: TimesNet 의 *FFT period*, *2D reshape*, *Inception block* 의 visual narrative.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *frequency spectrum*, *1D→2D geometric reformulation*, *Inception multi-scale*, *multi-task SOTA* 의 visual narrative."**

## 15.2 ASCII 도식 — FFT Period Detection

```
TIME SERIES → FFT → TOP-K PERIODS:

  Original TS (T=96):
    x = [x_1, x_2, ..., x_96]
       │
       │ FFT
       ▼
  Frequency spectrum |X(f)|:

   amplitude
        │
   1.0  ┤    ▮            ▮              
        │    ▮            ▮              
   0.8  ┤    ▮            ▮              
        │    ▮      ▮     ▮     ▮         
   0.6  ┤    ▮      ▮     ▮     ▮         
        │    ▮      ▮     ▮     ▮         
   0.4  ┤    ▮      ▮     ▮     ▮     ▮   
        │    ▮      ▮     ▮     ▮     ▮   
   0.2  ┤  ▮ ▮  ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮  ▮ ▮  
        └─────────────────────────────────► frequency
        0   1   2   3   4   5   6  ...
        DC  f1  f2  f3  f4  f5  f6  ...

  Top-5 frequencies (highest amplitudes):
    f1 → P_1 = 96 / 1 = 96 (very long)
    f2 → P_2 = 96 / 2 = 48
    f3 → P_3 = 96 / 4 = 24
    f4 → P_4 = 96 / 8 = 12
    f5 → P_5 = 96 / 16 = 6
```

## 15.3 ASCII 도식 — 1D → 2D Reshape (Period View)

```
1D representation (period P=4):
  [x_1, x_2, x_3, x_4, x_5, x_6, x_7, x_8, ...]

  Period-4 pattern: x_1 ≈ x_5 ≈ x_9 ≈ ...
  Pattern at distance 4 in 1D.

2D reshape [4 × T/4]:
   ┌────────────────────────────┐
   │  x_1   x_5   x_9   x_13  ...│   row 1: phase 0
   │  x_2   x_6   x_10  x_14  ...│   row 2: phase 1
   │  x_3   x_7   x_11  x_15  ...│   row 3: phase 2
   │  x_4   x_8   x_12  x_16  ...│   row 4: phase 3
   └────────────────────────────┘
                 ↓
   Period-4 pattern = *adjacent rows (vertical)*
   Phase pattern    = *adjacent columns (horizontal)*

   Conv2D 3×3 kernel sees:
   ┌───┐
   │ • │ ← period adjacent + phase adjacent
   │ • │
   │ • │
   └───┘
   → Both periodicity + phase 동시 처리.
```

## 15.4 ASCII 도식 — Inception Block (Multi-Scale Conv)

```
INCEPTION BLOCK (paper §3.3):

  Input: [B, d_in, P, T/P]
       │
       ├──── Conv 1×1 ────┐
       │                  │
       ├──── Conv 3×3 ────┤
       │                  │
       ├──── Conv 5×5 ────┤  Average
       │                  ├────────► Output
       ├──── Conv 7×7 ────┤
       │                  │
       ├──── Conv 9×9 ────┤
       │                  │
       └──── Conv 11×11 ──┘
       
  Each conv catches *different temporal scale*:
    1×1: pointwise transformation
    3×3: nearest-neighbor pattern
    11×11: 11-step pattern (in 2D)
         = up to 11P-step in 1D (very long!)
```

## 15.5 ASCII 도식 — Multi-Period Adaptive Aggregation

```
TIMESNET WORKFLOW:

  Input TS [B, T, d]
       │
       │ FFT → top-5 periods
       ▼
  Periods: P_1, P_2, P_3, P_4, P_5
  Amplitudes: a_1, a_2, a_3, a_4, a_5
       │
       │ For each period i:
       │   2D reshape with P_i columns
       │   Apply Inception block
       │   Reshape back to 1D
       ▼
  Results: r_1, r_2, r_3, r_4, r_5
       │
       │ Adaptive weighted sum:
       │   w_i = softmax(a_i)
       │   r = sum(w_i * r_i)
       ▼
  Output: r + Input (residual)
```

## 15.6 ASCII 도식 — Multi-Task Generality

```
TIMESNET 의 *1 backbone, 4 tasks*:

   Input TS [B, T, d]
        │
        ▼
   ┌─────────────────────┐
   │   TimesNet Backbone │
   │  (TimesBlock × N)   │
   └─────┬───────────────┘
         │
         ├── Forecast head    → Long/short-term forecast
         │
         ├── Classify head    → TS classification
         │
         ├── Detect head      → Anomaly detection
         │
         └── Impute head      → Missing value filling

  Each task: same backbone + *task-specific head*.
  → "*General TS foundation*" pre-TFM era.
```

## 15.7 ASCII 도식 — Computational Cost Comparison

```
COMPUTATIONAL COMPLEXITY (per layer):

   Architecture       Time complexity   For T=1000
   ──────────────────────────────────────────────
   Transformer        O(T² · d)          1M
   Informer           O(T log T · d)     10K
   Autoformer         O(T log T · d)     10K
   TimesNet           O(T log T · d)     10K  ★

   FFT cost: O(T log T)
   2D conv cost: O(T · d · k²)
   Total: O(T log T + T · d · k²)

  → "*Efficient long-sequence modeling*".
```

## 15.8 ASCII 도식 — Performance Across Tasks (paper Tables)

```
PAPER BENCHMARK RESULTS:

   Task: Long-term Forecasting (ETTh1, MSE)
   ┌──────────────────────────────────┐
   │ Informer        0.385            │
   │ Autoformer      0.343            │
   │ PatchTST        0.298            │
   │ TimesNet        0.265 ★          │
   └──────────────────────────────────┘

   Task: Classification (UEA, Accuracy)
   ┌──────────────────────────────────┐
   │ HIVE-COTE       0.728            │
   │ ResNet          0.711            │
   │ TimesNet        0.752 ★          │
   └──────────────────────────────────┘

   Task: Anomaly Detection (F1)
   ┌──────────────────────────────────┐
   │ Anomaly Trans   0.831            │
   │ TimesNet        0.846 ★          │
   └──────────────────────────────────┘

   → *SOTA on all 4 tasks* with same backbone.
```

## 15.9 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `timesnet-fft-period` | 05b, 14, 15 | FFT spectrum + top-k periods | k slider |
| `timesnet-2d-reshape` | 05c, 14, 15 | 1D → 2D geometric reshape | period selector |
| `timesnet-inception` | 05c, 14, 15 | Inception multi-scale conv | kernel size toggle |

## 15.10 자기점검

### 핵심 3 가지

1. **FFT spectrum 의 *top-k 선택* 의 *interpretability*?**
2. **2D reshape 의 *pad strategy* 의 *information loss*?**
3. **Multi-task SOTA 의 *substantive implication*?**

### 답변

1. **Frequency 의 *amplitude weight* = pattern strength**. Top-k = "*amplitude 가장 큰 k frequencies*" = "*pattern 가장 강한 k periodicities*". Daily (period=24) + weekly (168) + monthly (720+) 등 *natural periods* 자동 감지. *Interpretability*: 분석자가 "*어느 periodicity 가 critical*" 직접 확인 가능. *No manual frequency tuning*.

2. **Pad with zeros + post-cut**. Period P, seq T. T % P ≠ 0 → pad zeros to T' = ⌈T/P⌉ × P. *Information added* = zeros (no signal). 처리 후 cut to T → *original signal 보존*. *Edge effect*: 마지막 P-step 의 reshape 가 *zero-padding 영향* — *small artifact*. Practice: *negligible* in *T >> P* 상황.

3. **Specialist depth value across tasks**. Pre-TimesNet: *task-specialized architectures* (Informer for forecast, ResNet-TS for classify). TimesNet: *single backbone* + *4 tasks SOTA*. → "*General TS backbone*" 의 *first compelling demonstration* — *pre-TFM specialist 시대 의 peak*. *후속 TFM 의 task-agnostic generality* 의 *direct precursor*.

---

## 인터랙티브 시각화

```viz:timesnet-fft-period:title=paper §3.1 — FFT Period Detection,caption=Top-k slider.
```

```viz:timesnet-2d-reshape:title=paper §3.2 — 2D Reshape,caption=Period selector.
```

```viz:timesnet-inception:title=paper §3.3 — Inception Block,caption=Kernel size toggle.
```
