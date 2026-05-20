# 10. Supervised 결과 — 21% MSE reduction (★ 가장 흥미)

> 본 논문의 *실증 main result*. Table 3 (256 cell 정량) + Figure 2 (look-back window effect) 의 step-by-step 풀이.

---

## 10.1 챕터 한 줄 요약

> **"8 datasets × 4 horizons × 8 models = 256 cell. 거의 모든 cell 에서 PatchTST 가 best. 평균 21% MSE reduction vs FEDformer/Autoformer/Informer. + Look-back window L 늘릴수록 MSE 감소 — Patching 이 longer history 활용 가능."**

---

## 10.2 Table 3 — 8 datasets × 4 horizons × 8 models

본 논문 *가장 핵심 표*. 256 cell 정량.

### Table 3 의 8 datasets

| Dataset | 의미 | 변수 수 | 시간 단위 |
|---------|------|--------|---------|
| Weather | 21 기상 변수 | 21 | 10 분 |
| Traffic | 862 도로 교통량 | 862 | 시간 |
| Electricity | 321 가구 전력 | 321 | 시간 |
| ILI | 인플루엔자 환자 수 | 7 | 주 |
| ETTm1 | 전력 변압기 (m1) | 7 | 15 분 |
| ETTm2 | 전력 변압기 (m2) | 7 | 15 분 |
| ETTh1 | 전력 변압기 (h1) | 7 | 시간 |
| ETTh2 | 전력 변압기 (h2) | 7 | 시간 |

→ *다양한 도메인* (날씨, 교통, 전력, 의료) + *다양한 시간 단위* (10분 ~ 주). 광범위 검증.

### Table 3 의 4 horizons

미래 예측 timestep 수:
- $T = 96$ (1년 시간 데이터 의 약 4 일 앞).
- $T = 192$.
- $T = 336$.
- $T = 720$ (약 30 일 앞).

→ *Short-term 부터 long-term 까지*.

### Table 3 의 8 models

| Model | 종류 |
|-------|------|
| PatchTST/64 | 본 논문 ($L = 512$) |
| PatchTST/42 | 본 논문 ($L = 336$) |
| DLinear | Linear baseline (Zeng et al 2023) |
| FEDformer | Transformer (Zhou et al 2022) |
| Autoformer | Transformer (Wu et al 2021) |
| Informer | Transformer (Zhou et al 2021) |
| Pyraformer | Transformer |
| LogTrans | Transformer |

→ **8 model 비교**. 2023년 시점 의 *모든 SOTA*.

### 어떻게 읽나? (Step-by-step)

**Step 1 — 표 구조**

256 cell = 8 datasets × 4 horizons × 8 models. 각 cell 에 *MSE + MAE* 두 수치.

**Step 2 — 비교 방법**

각 row (dataset × horizon) 에서:
1. 8 model 의 MSE 중 *가장 작은 값* = best.
2. PatchTST/64 가 best 인지 확인.
3. PatchTST/64 vs 다른 model 의 *상대적 차이*.

**Step 3 — 핵심 발견**

PatchTST/64 가 *거의 모든 cell 에서 best*:
- Electricity, Traffic, Weather: 모든 horizon best.
- ETTm1, ETTm2, ETTh1: 거의 모든 horizon best.
- ETTh2, ILI: 일부 horizon best.

### 핵심 수치

**8 datasets × 4 horizons 평균** (paper Table 3 summary):

| Metric | PatchTST/64 vs FEDformer | PatchTST/42 vs FEDformer |
|--------|--------------------------|--------------------------|
| **MSE reduction** | **21.0%** | 20.2% |
| **MAE reduction** | **16.7%** | 16.4% |

→ **21% 의 MSE 감소** — 매우 큰 향상.

```viz:pat-table3-supervised:title=Table 3 — 256 cell 비교 (interactive),caption=8 datasets × 4 horizons × 8 models. PatchTST/64 가 거의 모든 cell 에서 best. 21% MSE reduction.
```

---

## 10.3 Figure 2 — Look-back Window 효과

본 논문의 *가장 중요한 그림 중 하나*. PNG inline:

![Figure 2 — Look-back window effect](figures/Fig2_lookback_window.png)

*paper p.9 Figure 2 — Look-back window L 의 MSE 효과 (3 datasets × 2 horizons).*

### 어떻게 읽나? (Step-by-step)

**Step 1 — 그래프 구조**

이 그림은 *6 sub-plot* (3 datasets × 2 horizons). 각 sub-plot 이 *L 의 함수로 MSE*.

**Step 2 — 축 의미**

- **X-axis**: $L$ (look-back window). $L \in \{24, 48, 96, 192, 336, 720\}$ — 즉 *과거 24-720 시간*.
- **Y-axis**: MSE. *낮을수록 좋음*.

**Step 3 — Sub-plot 분포**

- Row 1: Traffic dataset, horizon = 96 / 720.
- Row 2: Electricity dataset, horizon = 96 / 720.
- Row 3: Weather dataset, horizon = 96 / 720.

**Step 4 — 비교 model**

각 sub-plot 에 *여러 model 선*:
- PatchTST/42 (본 논문, 빨강).
- FEDformer (보라).
- Autoformer (주황).
- Informer (회색).
- DLinear (녹색).

**Step 5 — 핵심 발견 3가지**

#### ★ 발견 1 — PatchTST 가 *longer L 활용*

PatchTST 의 빨강 선이 *$L$ 늘릴수록 monotone 감소*. 즉 *더 많은 history → 더 정확*.

대비:
- FEDformer/Autoformer/Informer (보라/주황/회색): $L > 96$ 부터 *오히려 MSE 증가* — *longer history 활용 못 함*.

#### 발견 2 — 21% 의 직접 시각

PatchTST 의 빨강 선이 *다른 모든 선 아래*. 즉 *어떤 L 에서도 best*.

#### 발견 3 — Patching 의 *진짜 효과*

Patching 의 *진짜 이점*: 같은 compute 로 *longer L 가능* → *MSE 감소*. 

**일상 비유**: 학생 시험 예측 — *지난 1년* (L=24, 짧음) vs *지난 5년* (L=720, 김). 5년이 *더 좋음 — 본 논문이 가능하게 함*.

```viz:pat-lookback-window:title=Fig 2 — Look-back window 효과 (interactive),caption=PatchTST 가 longer L 활용. FEDformer/Autoformer 는 L > 96 에서 MSE 증가. Patching 의 진짜 효과.
```

---

## 10.4 Figure 3 — Forecasting Visualization

![Figure 3 — 192-step forecasting on Weather/Traffic](figures/Fig3_forecast_viz.png)

*paper p.14 Figure 3 — Weather + Traffic 의 192 timestep 예측 시각화.*

### 어떻게 읽나?

**Step 1**: 4 sub-plot (2 datasets × 2 model comparisons).

**Step 2**: 각 sub-plot 에 *Ground truth (검정)* + *PatchTST 예측 (빨강)* + *baseline 예측*.

**Step 3 — 발견**:
- PatchTST 예측 (빨강) 이 *진짜 (검정) 와 거의 일치*.
- Baseline (보라/주황) 은 *큰 편차*.

→ *눈으로 확인* 가능한 SOTA.

---

## 10.5 본 챕터 정리

```
   Table 3 (256 cells)                       Figure 2 (Look-back window)
   ──────────────────                         ──────────────────────────

   8 datasets × 4 horizons × 8 models         L 의 함수로 MSE
   PatchTST 가 거의 모든 cell best             PatchTST 가 longer L 활용
              ↓                                       ↓
   평균 21% MSE / 16.7% MAE reduction         FEDformer/Autoformer 는
   vs FEDformer/Autoformer/Informer            L > 96 에서 오히려 악화
              ↓                                       ↓
                Figure 3 (Visual confirmation)
                ────────────────────────────
                Weather + Traffic 의
                192 timestep 예측 시각화
                PatchTST = ground truth 거의 일치
```

---

## 10.6 자기점검

### 핵심 3가지
1. **Table 3 의 256 cell 의 의미?**
2. **PatchTST 의 21% MSE reduction 이 얼마나 큰가?**
3. **Figure 2 의 가장 흥미로운 발견?**

### 답변
1. **8 datasets (Weather, Traffic, Electricity, ILI, ETTm1/m2/h1/h2) × 4 horizons (96, 192, 336, 720) × 8 models (PatchTST/64, /42, DLinear, FEDformer, Autoformer, Informer, Pyraformer, LogTrans)**. PatchTST/64 가 *거의 모든 cell 에서 best*. 자산가격 학계에서 *각 cell 의 가장 작은 MSE* 가 *best model* 의 증거.
2. **8 datasets × 4 horizons = 32 cell 평균 21% MSE reduction**. 자산가격 학계 / 시계열 ML 학계에서 *5% reduction* 도 *significant*. **21% 는 *paradigm shift 수준***. 실제 응용 (전력, 교통, 날씨 예측) 에서 *경제적 가치 매우 큼*.
3. **PatchTST 가 *L (look-back window) 늘릴수록 monotone MSE 감소***. 즉 *과거 정보 많이 활용 가능*. 반면 FEDformer/Autoformer/Informer 는 *L > 96 부터 오히려 MSE 증가* — *longer history 활용 못 함*. Patching 의 *진짜 효과* = "같은 compute 로 longer L 가능" → *MSE 감소*.

---

다음 챕터: [11_repr_transfer.md](11_repr_transfer.md) — Self-supervised + Transfer Learning 결과.
