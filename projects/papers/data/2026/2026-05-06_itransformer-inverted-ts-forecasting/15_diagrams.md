# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: 본 챕터는 *그림으로만* iTransformer 의 모든 핵심 mechanism 을 설명. ASCII 도식 15+ 와 7 개 인터랙티브 viz 로 vanilla vs iTransformer 의 dimension inversion + multivariate correlation map + lookback robustness + variate generalization 까지 시각.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 7 인터랙티브 viz 로 iTransformer 의 architectural inversion + 7 datasets SOTA + 5 Transformer variants promotion + variate generalization + lookback robustness 의 full mechanism 을 visual 형태로 압축."**

---

## 15.2 ASCII 도식 — Vanilla vs iTransformer 의 Token 차이 (paper Fig 2)

```
VANILLA TRANSFORMER VIEW:

Input X ∈ R^{T×N}:
       time →
   ┌──────────────┐
   │ x_1,1 x_2,1 ...│   variates ↓
   │ x_1,2 x_2,2 ...│
   │ x_1,3 x_2,3 ...│
   │ ...           │
   │ x_1,N x_2,N ...│
   └──────────────┘
            │
            ▼ embed each *column* (time step)
   ┌──────────────┐
   │ token_1 token_2 ... token_T │  ← T tokens
   └──────────────┘
            │
            ▼
   Attention over T temporal tokens
   FFN on each temporal token
            │
            ▼
   Output (S forecasts × N variates)


iTRANSFORMER VIEW:

Input X ∈ R^{T×N}:
       time →
   ┌──────────────┐
   │ x_1,1 x_2,1 ...│   variates ↓
   │ x_1,2 x_2,2 ...│
   │ ...           │
   │ x_1,N x_2,N ...│
   └──────────────┘
            │
            ▼ embed each *row* (variate)
   ┌──────────────┐
   │ token_var1   │  ← N tokens
   │ token_var2   │
   │ ...          │
   │ token_varN   │
   └──────────────┘
            │
            ▼
   Attention over N variate tokens  ← multivariate correlation
   FFN on each variate token       ← series representation
            │
            ▼
   Output (S forecasts × N variates)
```

**Key**: *Same input X*, *axis 만 90° 회전*.

---

## 15.3 ASCII 도식 — paper Fig 4 (Full Architecture)

```
INPUT
  x ∈ R^{T × N}   (T = lookback, N = variates)
       │
       ▼
  [Variate-wise normalization]   (Eq 2 — variate axis 정규화)
       │
       ▼
  EMBEDDING
  for each variate n in 1..N:
    h_n = Linear(T → D)(x[:,n])
  Stack: H ∈ R^{N × D}
       │
       ▼
  ┌────────────────────────────────────┐
  │  TrmBlock × L (paper §3.2)         │
  │                                    │
  │  ┌─────────────┐                  │
  │  │ LayerNorm   │ (variate-wise)   │
  │  └──────┬──────┘                  │
  │         ▼                          │
  │  ┌─────────────────────────────┐   │
  │  │ Multivariate Self-Attention│   │  ← Q,K,V over N variates
  │  └──────┬──────────────────────┘  │
  │         + (residual)              │
  │         ▼                          │
  │  ┌─────────────┐                  │
  │  │ LayerNorm   │                  │
  │  └──────┬──────┘                  │
  │         ▼                          │
  │  ┌─────────────────────────────┐   │
  │  │ Feed-Forward (D → 4D → D)  │   │  ← series representation
  │  └──────┬──────────────────────┘  │
  │         + (residual)              │
  └─────────┼──────────────────────────┘
            │
            ▼  ← H^L ∈ R^{N × D}
  PROJECTION
  for each variate n in 1..N:
    y_n = Linear(D → S)(H[n])
  Stack: Y ∈ R^{S × N}
            │
            ▼
  [De-normalize]
            │
            ▼
  OUTPUT
  Y ∈ R^{S × N}   (S forecasts × N variates)
```

---

## 15.4 ASCII 도식 — 4 Categories of Transformer-based Forecasters (paper Fig 3)

```
                  No Modified Component    Modified Component
                  ┌─────────────────────┬──────────────────────┐
  No Modified    │                     │                      │
  Architecture   │      (Vanilla       │     (I) Autoformer  │
                 │      Transformer)   │     Informer        │
                 │                     │     FEDformer       │
                 │                     │                      │
                 ├─────────────────────┼──────────────────────┤
  Modified       │ (IV) ★ iTransformer │   (III) Crossformer │
  Architecture   │   (OURS)            │                      │
                 │                     │                      │
                 │ (II) PatchTST       │                      │
                 │     NSTransformer   │                      │
                 └─────────────────────┴──────────────────────┘
```

iTransformer 는 **(IV) 의 유일한 paper** — *no component modification + modified architecture only*.

---

## 15.5 ASCII 도식 — Multivariate Correlation Map (paper Fig 9)

```
Attention score A = QK^T / √d_k ∈ R^{N×N}

Example (N=8 variates of Exchange dataset):

           AUD  CAD  CHF  GBP  EUR  JPY  NZD  USD
       ┌──────────────────────────────────────────┐
   AUD │ 1.00 ★0.85 ✦0.32 ✦0.78 ✦0.71 ✦0.15 ★0.92 ✦0.65 │
   CAD │★0.85 1.00 ✦0.28 ✦0.65 ✦0.62 ✦0.18 ✦0.78 ★0.82 │
   CHF │✦0.32 ✦0.28 1.00 ✦0.45 ★0.87 ✦0.55 ✦0.30 ✦0.42 │
   GBP │✦0.78 ✦0.65 ✦0.45 1.00 ★0.81 ✦0.22 ✦0.71 ✦0.58 │
   EUR │✦0.71 ✦0.62 ★0.87 ★0.81 1.00 ✦0.25 ✦0.68 ✦0.55 │
   JPY │✦0.15 ✦0.18 ✦0.55 ✦0.22 ✦0.25 1.00 ✦0.12 ✦0.20 │
   NZD │★0.92 ✦0.78 ✦0.30 ✦0.71 ✦0.68 ✦0.12 1.00 ✦0.62 │
   USD │✦0.65 ★0.82 ✦0.42 ✦0.58 ✦0.55 ✦0.20 ✦0.62 1.00 │
       └──────────────────────────────────────────┘

★ = strong correlation (> 0.8): AUD-NZD (oceania), CAD-USD (NA), CHF-EUR (Europe), GBP-EUR
✦ = moderate (0.3-0.8): regional clusters
JPY = relatively isolated (✦0.12-0.55) — Asia, distinct economic regime
```

**의미**: paper §3.2 의 "*interpretable multivariate correlation*" — 학습된 attention map 이 *economically meaningful clusters*.

---

## 15.6 ASCII 도식 — Lookback Length Paradox (paper Fig 6)

```
MSE
  0.30 ┤    Vanilla Transformer (paradox)
  0.28 ┤   /￣＼
  0.26 ┤  /    \
  0.24 ┤ /      \___ (성능 저하)
  0.22 ┤/
  0.20 ┤
  0.18 ┤━━━━━━━━━━━━━━━ iTransformer (monotone 개선)
  0.16 ┤      \___
  0.14 ┤          \___
  0.12 ┤              \____
  0.10 ┤                   \____ (lookback 길수록 좋음)
       └─────────────────────────────
          48  96  192  336  720
                Lookback Length T

Vanilla:    T↑ → "distracted attention" → MSE 증가
iTransformer: T↑ → FFN 의 more input → richer rep → MSE 감소
```

→ paper §4.2 의 *lookback paradox 해결*.

---

## 15.7 ASCII 도식 — Variate Generalization (paper Fig 5)

```
Setup:
  Train: 20% variates 의 1 folder
  Test:  100% variates (5 folders 평균)

MSE 증가 (small = better generalization):

  ECL (321 variates):
    iTransformer:   0.18 → 0.23  (+28%)
    CI-Transformer: 0.20 → 0.42  (+110%) ★ 큰 손실
  
  Traffic (862 variates):
    iTransformer:   0.43 → 0.52  (+21%)
    CI-Transformer: 0.45 → 0.95  (+111%) ★
  
  Solar-Energy (137 variates):
    iTransformer:   0.23 → 0.31  (+35%)
    CI-Transformer: 0.27 → 0.65  (+141%) ★

→ iTransformer 가 CI 보다 *3-5배 robust* on unseen variates.
→ TSFM (foundation model) 의 enabling property.
```

---

## 15.8 ASCII 도식 — Promotion across Transformer Variants (paper Table 2)

```
ECL MSE:
  Variant         Original  +Inverted  Promotion
  ─────────────────────────────────────────────
  Transformer     0.277  →  0.178      ▼ 35.6%
  Reformer        0.338  →  0.208      ▼ 38.4%
  Informer        0.311  →  0.216      ▼ 30.5%
  Flowformer      0.267  →  0.210      ▼ 21.3%
  Flashformer     0.285  →  0.206      ▼ 27.8%

Traffic MSE:
  Transformer     0.665  →  0.428      ▼ 35.6%
  Reformer        0.741  →  0.647      ▼ 12.7%
  Informer        0.764  →  0.662      ▼ 13.3%
  Flowformer      0.750  →  0.524      ▼ 30.1%
  Flashformer     0.658  →  0.492      ▼ 25.2%

Weather MSE:
  Transformer     0.657  →  0.258      ▼ 60.2%
  Reformer        0.803  →  0.248      ▼ 69.2%  ★ largest
  Informer        0.634  →  0.271      ▼ 57.3%
  Flowformer      0.286  →  0.266      ▼  7.2%
  Flashformer     0.659  →  0.262      ▼ 60.2%

★ 모든 35 configurations 에서 promotion ✓
```

---

## 15.9 ASCII 도식 — Ablation Study (paper Table 3)

```
Design: Variate dim 의 *X*, Temporal dim 의 *Y* 적용

┌──────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Design           │ ECL MSE  │ Traffic  │ Weather  │ Solar    │
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│ iTransformer:    │          │          │          │          │
│   var: Attention │   0.178  │  0.428   │  0.258   │  0.233   │
│   tem: FFN       │     ★    │    ★     │    ★     │    ★     │
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Replace:         │          │          │          │          │
│   Attn, Attn     │   0.193  │  0.913   │  0.255   │  0.261   │
│   FFN,  Attn     │   0.202  │  0.863   │  0.258   │  0.285   │
│   FFN,  FFN      │   0.182  │  0.599   │  0.248   │  0.269   │
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│ w/o:             │          │          │          │          │
│   Attn, --       │   0.189  │  0.456   │  0.261   │  0.258   │
│   --,   FFN      │   0.193  │  0.461   │  0.265   │  0.261   │
└──────────────────┴──────────┴──────────┴──────────┴──────────┘

★ iTransformer (Attention + FFN combo) = best across 4 datasets
★ "Attn-Attn" 의 Traffic 0.913 = vanilla 의 fail 의 정량 확인
```

---

## 15.10 ASCII 도식 — Channel Independence vs iTransformer

```
CI-Transformer (PatchTST 스타일):

  variate 1: ─→ [Transformer_shared] ─→ forecast_1
  variate 2: ─→ [Transformer_shared] ─→ forecast_2  ← N 회 forward
  variate 3: ─→ [Transformer_shared] ─→ forecast_3
  ...
  variate N: ─→ [Transformer_shared] ─→ forecast_N

  → variate 간 attention X (Independence)
  → 추론 시 N 회 forward (시간 O(N))
  → variate correlation 손실


iTransformer:

  variate 1 ─┐
  variate 2 ─┤
  variate 3 ─┤─→ [iTransformer] ─→ [all forecasts]
  ...        │
  variate N ─┘

  → variate 간 attention ✓
  → 추론 시 1 회 forward (시간 O(1))
  → multivariate correlation 학습
```

---

## 15.11 ASCII 도식 — Train/Test 7 datasets (paper Table 1)

```
Dataset           N       T_total    MSE (paper)
─────────────────────────────────────────────────
ECL              321     26K        0.178  ★ SOTA
ETT (avg)         7       7-69K     0.383  ★ SOTA
Exchange          8      7588        0.360  2nd (DLinear 0.354)
Traffic         862     17544       0.428  ★ SOTA
Weather          21     52696       0.258  ★ SOTA
Solar-Energy    137     52560       0.233  ★ SOTA
PEMS (avg)       400+    ~10K        0.119  ★ SOTA

★ = 1st place
2nd = 2nd place (DLinear competitive on Exchange only)

→ 6/7 datasets SOTA, 1/7 close 2nd → paper 의 dominant result
```

---

## 15.12 ASCII 도식 — Computational Complexity

```
Vanilla Transformer (N variates, T time steps):
  Time tokens: T
  Attention: O(T² · D)
  FFN: O(T · D²)
  → Total: O(T² · D + T · D²)
  → Per dataset: T 가 *길수록* attention quadratic 증가

iTransformer:
  Variate tokens: N
  Attention: O(N² · D)
  FFN: O(N · D²)
  → Total: O(N² · D + N · D²)
  → Per dataset: N (variates 수) 가 dominant
  
Memory:
  Vanilla: O(T² + T · D)
  iTransformer: O(N² + N · D)
  
Trade-off:
  ECL: N=321 → O(N²)=100K (manageable)
  Traffic: N=862 → O(N²)=750K
  Solar-Energy: N=137 → O(N²)=19K
  → iTransformer 의 cost 가 variate-quadratic 이지만 dataset 들 모두 부담 X
```

---

## 15.13 ASCII 도식 — TSFM Lineage (post-iTransformer 2024-2025)

```
2024.01  iTransformer (★ this paper)
            │
            ▼
2024.02  MOIRAI (Salesforce) — masked variate token
2024.03  Chronos (Amazon) — T5-based, variate token
2024.04  TimesFM (Google) — decoder-only, variate-aware
2024.05  TimeMixer (Wang) — MLP-only, iTransformer-inspired
2024.06  UniTST (Liu) — universal variate transformer
2024.10  TimeXer (NeurIPS) — exogenous variables + iTransformer

→ ALL major TSFM (2024) adopt variate token from iTransformer
→ iTransformer = TSFM era 의 *direct enabler*
```

---

## 15.14 Viz 카탈로그 (인터랙티브) + paper Figure 매핑

| viz id | paper Figure | 챕터 | 컨트롤 |
|--------|-------------|------|--------|
| `it-token-inversion` | **Figure 2** (vanilla vs iTransformer view) | 02, 05a, 15 | view toggle |
| `it-architecture-flow` | **Figure 4** (overall structure with 4 panels) | 02, 05b, 15 | step highlight |
| `it-multivariate-correlation` | **Figure 9** (attention map heatmap) | 05c, 13, 15 | dataset selector |
| `it-lookback-paradox` | **Figure 6** (MSE vs lookback length) | 06, 13, 15 | model variant toggle |
| `it-variate-generalization` | **Figure 5** (CI vs iTransformer on unseen variates) | 06, 13, 15 | dataset selector |
| `it-promotion-grid` | **Table 2** (5 variants × 3 datasets MSE promotion) | 06, 13, 15 | metric toggle |
| `it-datasets-summary` | **Table 1** (7 datasets × 11 models) | 04, 06, 13 | model highlight |

**paper figure 커버리지**:
- Figure 1 (radar plot): viz 미작성 (Table 1 이 더 정량적)
- Figure 2 (token inversion): ✓ it-token-inversion
- Figure 3 (4 categories): ASCII 도식 §15.4 만 (정적 분류)
- Figure 4 (architecture): ✓ it-architecture-flow
- Figure 5 (variate generalization): ✓ it-variate-generalization
- Figure 6 (lookback paradox): ✓ it-lookback-paradox
- Figure 7 (CKA similarity): ASCII 도식 §15.15 (정적)
- Figure 8 (representation analysis): viz 미작성
- Figure 9 (attention map): ✓ it-multivariate-correlation
- Table 1 (main results): ✓ it-datasets-summary
- Table 2 (promotions): ✓ it-promotion-grid
- Table 3 (ablation): ASCII 도식 §15.9 (정적)

→ **paper 의 9 figures + 3 tables 중 viz JS 7 개로 핵심 9 cover**.

---

## 15.15 ASCII 도식 — CKA Similarity (paper Fig 7)

```
Centered Kernel Alignment between first and last block features:

  CKA
   1.0 ┤      iTransformer (high CKA, 0.85-0.95)
   0.9 ┤      ★★★★★ ★★★★★ ★★★★★ ★★★★★ ← favorable for forecasting
   0.8 ┤
   0.7 ┤
   0.6 ┤
   0.5 ┤
   0.4 ┤      Vanilla Transformer (low CKA, 0.30-0.45)
   0.3 ┤      ◇◇◇◇◇ ◇◇◇◇◇ ◇◇◇◇◇ ◇◇◇◇◇
   0.2 ┤
       └──────────────────────────────────
          ECL  ETT  Traffic  Weather  Solar

★ Higher CKA = first/last block features more similar
  → "low-level generative task prefers higher CKA" (Wu 2023, Dong 2023)
  → iTransformer 의 high CKA = SOTA performance 의 representation-level 증거
```

---

## 15.16 인터랙티브 시각화 — Token Inversion

```viz:it-token-inversion:title=paper Figure 2 — Vanilla vs iTransformer Token View,caption=View 토글로 (a) Vanilla: time token (각 시점의 모든 variates 합쳐 token) vs (b) iTransformer: variate token (각 variate 의 전체 series 가 token). 두 view 의 차이 시각화. paper 의 core architectural choice.
```

---

## 15.17 인터랙티브 시각화 — Architecture Flow

```viz:it-architecture-flow:title=iTransformer 전체 Architecture (paper Figure 4),caption=Step 토글로 4 단계 (a) embedding (raw series → variate token), (b) multivariate attention, (c) FFN (series representation), (d) variate-wise LayerNorm 의 highlight. paper §3.1-3.2 의 module 구성 visual.
```

---

## 15.18 인터랙티브 시각화 — Multivariate Correlation Map

```viz:it-multivariate-correlation:title=iTransformer Attention Map — Multivariate Correlation (paper Figure 9),caption=Dataset 셀렉터로 Exchange / ECL / Weather 의 학습된 attention map 표시. 강한 correlation (★) cluster — economic / geographic / physical 의 meaningful 그룹화. paper §3.2 의 "interpretable multivariate correlation" 직접 증거.
```

---

## 15.19 인터랙티브 시각화 — Lookback Paradox

```viz:it-lookback-paradox:title=Lookback Length Paradox 해결 (paper Figure 6),caption=Model 토글 (vanilla Transformer / iTransformer / variants). Lookback T = {48, 96, 192, 336, 720} 에 따른 MSE 변화. ★ vanilla 의 monotone 비- 개선 vs iTransformer 의 monotone 개선. paper §4.2 의 lookback paradox 해결의 시각.
```

---

## 15.20 인터랙티브 시각화 — Variate Generalization

```viz:it-variate-generalization:title=Variate Generalization — 20% 학습 → 100% 추론 (paper Figure 5),caption=Dataset 셀렉터로 ECL / Traffic / Solar 의 unseen variates 결과. iTransformer 의 MSE 증가 (~25%) vs CI-Transformer 의 MSE 증가 (~110%). → TSFM enabling property 의 정량 증거.
```

---

## 15.21 인터랙티브 시각화 — Promotion Grid

```viz:it-promotion-grid:title=Promotion across 5 Transformer Variants (paper Table 2),caption=Metric 토글 (MSE / MAE). 5 variants (Transformer / Reformer / Informer / Flowformer / Flashformer) × 3 datasets (ECL / Traffic / Weather) 의 promotion. ★ Reformer + Weather 의 -69.2% 최대 개선. 35 configurations 모두 promotion ✓.
```

---

## 15.22 인터랙티브 시각화 — 7 Datasets Summary

```viz:it-datasets-summary:title=7 Datasets × 11 Models MSE/MAE — Table 1,caption=Metric 토글. iTransformer 의 6/7 dataset SOTA (1st), 1/7 (Exchange) 2nd place. Linear forecaster (DLinear) 와의 명료한 차이 + Transformer family 의 통일된 우월성.
```

---

## 15.23 자기점검 (이 챕터)

### 핵심 3 가지

1. **paper Figure 2 (token inversion) 의 *결정적 visual* 의 의미?**
2. **paper Figure 9 (multivariate correlation map) 가 *interpretability* 측면에서의 critical 가치?**
3. **paper Figure 6 (lookback paradox) 의 monotone improvement 가 *왜* linear forecaster 와 같은 방향?**

### 답변

1. **"Same input X, 90° 회전" 의 단일 visual 의미**. paper 의 core claim 의 *압축*: vanilla 의 *token = column* (시간) vs iTransformer 의 *token = row* (variate). *Architecture 자체는 동일*, *input axis 만 swap*. 학계 readers 가 이 Fig 2 를 본 직후 *paper 의 결정적 design choice 즉시 이해*. 본 paper 의 가장 *효과적 communication 도구*.

2. ***post-hoc explainability* 의 직접 도구**. Multivariate forecasting 에서 *어떤 variates 가 상관* 인가의 일관 분석. 예: Exchange (paper Fig 9) — AUD-NZD (oceania), CHF-EUR (Europe) clusters 의 *economically meaningful*. → 학습 후 *attention map 검사* 로 *모델의 reasoning* 부분 검증 가능. Jain-Wallace 2019 의 *attention not explanation* 비판을 *부분 우회* — *variate token* 의 attention 은 *temporal token* attention 보다 *더 meaningful*.

3. **FFN 의 universal approximation + temporal axis 적용**. paper §3.2: "FFN extracts complicated representations to describe a time series". Linear forecaster (DLinear / TiDE) = *linear layer on T input neurons*. iTransformer 의 FFN = *T input neurons × multi-layer + nonlinearity*. → *T ↑ → more input neurons → richer representation*. *Linear forecaster 의 lookback ↑ improvement* 의 *nonlinear extension*. Vanilla Transformer 의 attention on T tokens 의 *quadratic distraction* 회피.

---

다음 [16_appendix.md](16_appendix.md) — paper Table 1/2/3 정확 수치 + reproduction.
