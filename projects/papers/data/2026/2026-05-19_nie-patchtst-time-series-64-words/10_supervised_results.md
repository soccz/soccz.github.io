# 10 Supervised Forecasting Results — Table 3 + Figure 2

paper Section 4.1.

## Table 3 — Multivariate long-term forecasting (256 cells)

paper Table 3 caption:
> Multivariate long-term forecasting results with supervised PatchTST. We use prediction lengths $T \in \{24, 36, 48, 60\}$ for ILI dataset and $T \in \{96, 192, 336, 720\}$ for the others. The best results are in bold and the second best are underlined.

**8 datasets × 4 horizons × 8 models × 2 metrics = 512 numbers**.

핵심 결과만 발췌 (best in bold).

### Weather (T = 96, 192, 336, 720)

| Model | T=96 MSE | MAE | T=192 MSE | MAE | T=336 MSE | MAE | T=720 MSE | MAE |
|-------|----------|-----|-----------|-----|-----------|-----|-----------|-----|
| **PatchTST/64** | **0.149** | **0.198** | **0.194** | **0.241** | **0.245** | **0.282** | **0.314** | **0.334** |
| PatchTST/42 | 0.152 | 0.199 | 0.197 | 0.243 | 0.249 | 0.283 | 0.320 | 0.335 |
| DLinear | 0.176 | 0.237 | 0.220 | 0.282 | 0.265 | 0.319 | 0.323 | 0.362 |
| FEDformer | 0.238 | 0.314 | 0.275 | 0.329 | 0.339 | 0.377 | 0.389 | 0.409 |
| Autoformer | 0.249 | 0.329 | 0.325 | 0.370 | 0.351 | 0.391 | 0.415 | 0.426 |
| Informer | 0.354 | 0.405 | 0.419 | 0.434 | 0.583 | 0.543 | 0.916 | 0.705 |
| Pyraformer | 0.896 | 0.556 | 0.622 | 0.624 | 0.739 | 0.753 | 1.004 | 0.934 |
| LogTrans | 0.458 | 0.490 | 0.658 | 0.589 | 0.797 | 0.652 | 0.869 | 0.675 |

→ PatchTST/64 가 모든 horizon 에서 best. T=720 에서 PatchTST 0.314 vs FEDformer 0.389 = **19% MSE reduction**.

### Traffic (T = 96, 192, 336, 720)

| Model | T=96 MSE | MAE | T=192 MSE | MAE | T=336 MSE | MAE | T=720 MSE | MAE |
|-------|----------|-----|-----------|-----|-----------|-----|-----------|-----|
| **PatchTST/64** | **0.360** | **0.249** | **0.379** | **0.256** | **0.392** | **0.264** | **0.432** | **0.286** |
| PatchTST/42 | 0.367 | 0.251 | 0.385 | 0.259 | 0.398 | 0.265 | 0.434 | 0.287 |
| DLinear | 0.410 | 0.282 | 0.423 | 0.287 | 0.436 | 0.296 | 0.466 | 0.315 |
| FEDformer | 0.576 | 0.359 | 0.610 | 0.380 | 0.608 | 0.375 | 0.621 | 0.375 |
| Autoformer | 0.597 | 0.371 | 0.607 | 0.382 | 0.623 | 0.387 | 0.639 | 0.395 |
| Informer | 0.733 | 0.410 | 0.777 | 0.435 | 0.776 | 0.434 | 0.827 | 0.466 |

→ Traffic 에서 PatchTST/64 0.360 vs FEDformer 0.576 = **37% MSE reduction**. 가장 큰 격차.

### Electricity

| Model | T=96 MSE | MAE | T=192 MSE | MAE | T=336 MSE | MAE | T=720 MSE | MAE |
|-------|----------|-----|-----------|-----|-----------|-----|-----------|-----|
| **PatchTST/64** | **0.129** | **0.222** | **0.147** | **0.240** | **0.163** | **0.259** | **0.197** | **0.290** |
| PatchTST/42 | 0.130 | 0.222 | 0.148 | 0.240 | 0.167 | 0.261 | 0.202 | 0.291 |
| DLinear | 0.140 | 0.237 | 0.153 | 0.249 | 0.169 | 0.267 | 0.203 | 0.301 |
| FEDformer | 0.186 | 0.302 | 0.197 | 0.311 | 0.213 | 0.328 | 0.233 | 0.344 |
| Autoformer | 0.196 | 0.313 | 0.211 | 0.324 | 0.214 | 0.327 | 0.236 | 0.342 |
| Informer | 0.304 | 0.393 | 0.327 | 0.417 | 0.333 | 0.422 | 0.351 | 0.427 |

→ PatchTST 0.129 vs FEDformer 0.186 = **31% reduction**. DLinear 와 비슷한 격차.

### ILI (T = 24, 36, 48, 60)

| Model | T=24 MSE | MAE | T=36 MSE | MAE | T=48 MSE | MAE | T=60 MSE | MAE |
|-------|----------|-----|----------|-----|----------|-----|----------|-----|
| **PatchTST/64** | **1.319** | **0.754** | **1.579** | **0.870** | **1.553** | **0.815** | **1.470** | **0.788** |
| PatchTST/42 | 1.522 | 0.814 | 1.430 | 0.834 | 1.673 | 0.854 | 1.529 | 0.862 |
| DLinear | 2.215 | 1.081 | 1.963 | 0.963 | 2.130 | 1.024 | 2.368 | 1.096 |
| FEDformer | 2.624 | 1.095 | 2.516 | 1.021 | 2.505 | 1.041 | 2.742 | 1.122 |
| Autoformer | 2.906 | 1.182 | 2.585 | 1.038 | 3.024 | 1.145 | 2.761 | 1.114 |
| Informer | 4.657 | 1.449 | 4.650 | 1.463 | 5.004 | 1.542 | 5.071 | 1.543 |

→ ILI 가 most challenging (작은 dataset). PatchTST/64 1.319 vs DLinear 2.215 = **40% reduction**.

### ETTh1 (T = 96, 192, 336, 720)

| Model | T=96 MSE | MAE | T=192 MSE | MAE | T=336 MSE | MAE | T=720 MSE | MAE |
|-------|----------|-----|-----------|-----|-----------|-----|-----------|-----|
| PatchTST/64 | 0.370 | **0.400** | 0.413 | 0.429 | 0.422 | 0.440 | 0.447 | 0.468 |
| PatchTST/42 | 0.375 | 0.399 | 0.414 | 0.421 | 0.431 | 0.436 | 0.449 | 0.466 |
| **DLinear** | **0.375** | 0.399 | **0.405** | **0.416** | **0.439** | **0.443** | **0.472** | **0.490** |
| FEDformer | 0.376 | 0.415 | 0.423 | 0.446 | 0.444 | 0.462 | 0.469 | 0.492 |
| Autoformer | 0.435 | 0.446 | 0.456 | 0.457 | 0.486 | 0.487 | 0.515 | 0.517 |

→ ETTh1 에서 DLinear 가 PatchTST 와 비슷 (T=96 모두 0.375). PatchTST 가 약간 우세 (특히 T=192 0.413 vs 0.405).

### ETTh2

| Model | T=96 MSE | MAE | T=192 MSE | MAE | T=336 MSE | MAE | T=720 MSE | MAE |
|-------|----------|-----|-----------|-----|-----------|-----|-----------|-----|
| PatchTST/64 | **0.274** | **0.337** | **0.341** | **0.382** | 0.329 | 0.384 | 0.379 | 0.422 |
| PatchTST/42 | 0.274 | 0.336 | 0.339 | 0.379 | **0.331** | 0.380 | 0.379 | 0.422 |
| DLinear | 0.289 | 0.353 | 0.383 | 0.418 | 0.448 | 0.465 | 0.605 | 0.551 |
| FEDformer | 0.332 | 0.374 | 0.407 | 0.446 | 0.400 | 0.447 | 0.412 | 0.469 |

→ ETTh2 의 큰 horizon (T=720) 에서 DLinear 가 무너짐 (0.605). PatchTST 가 robust.

### ETTm1, ETTm2 — 비슷한 PatchTST 우위

→ paper Table 3 의 full 결과는 site 의 viz 에서 (pat-table3-supervised).

---

## Quantitative summary — Section 4.1

paper p.6:
> Overall, our model outperform all baseline methods. Quantitatively, compared with the best results that Transformer-based models can offer, PatchTST/64 achieves an overall **21.0% reduction on MSE** and **16.7% reduction on MAE**, while PatchTST/42 attains an overall **20.2% reduction on MSE** and **16.4% reduction on MAE**. Compared with the DLinear model, PatchTST can still outperform it in general, especially on large datasets (Weather, Traffic, Electricity) and ILI dataset.

| Comparison | PatchTST/64 MSE↓ | MAE↓ | PatchTST/42 MSE↓ | MAE↓ |
|------------|------------------|------|------------------|------|
| vs Transformer baselines | **21.0%** | 16.7% | 20.2% | 16.4% |
| vs DLinear | "in general" outperform | (especially large datasets) | | |

→ **/64 가 약간 더 좋음** (longer L=512). 큰 dataset 에서 /64 우위 확실.

---

## 인터랙티브 시각화 — Table 3

```viz:pat-table3-supervised:title=paper Table 3 — Multivariate supervised forecasting (interactive),caption=8 datasets × 4 horizons × 8 models = 256 cells. Dataset 토글 + horizon 토글 + metric (MSE/MAE) 토글. PatchTST/64 가 거의 모든 cell 에서 best 또는 second-best. Traffic 에서 37% MSE reduction vs FEDformer.
```

---

## Figure 2 — Look-back window 효과

paper p.9 Figure 2 caption:
> Forecasting performance (MSE) with varying look-back windows on 3 large datasets: Electricity, Traffic, and Weather. The look-back windows are selected to be $L = 24, 48, 96, 192, 336, 720$, and the prediction horizons are $T = 96, 720$. We use supervised PatchTST/42 and other open-source Transformer-based baselines for this experiment.

![Fig 2 Look-back window vs MSE](figures/Fig2_lookback_window.png)

paper p.8 (analysis):
> In principle, a longer look-back window increases the receptive field, which will potentially improves the forecasting performance. However, as argued in (Zeng et al., 2022), this phenomenon hasn't been observed in most of the Transformer-based models. We also demonstrate in Figure 2 that in most cases, these Transformer-based baselines have not benefited from longer look-back window $L$, which indicates their ineffectiveness in capturing temporal information. In contrast, our PatchTST consistently reduces the MSE scores as the receptive field increases, which confirms our model's capability to learn from longer look-back window.

**핵심 관찰**:
- **다른 Transformer 들**: $L$ 증가해도 MSE 감소 거의 없음 (또는 오히려 증가)
- **PatchTST**: $L$ 증가하면 MSE 일관 감소 → **longer history 진짜 활용**

→ "Transformer is actually effective" 의 직접 증거.

---

## 인터랙티브 시각화 — Figure 2

```viz:pat-lookback-window:title=paper Figure 2 — Look-back window vs MSE (interactive),caption=L=24,48,96,192,336,720 으로 6개 lookback 에서의 MSE 비교. Dataset 토글 (Electricity / Traffic / Weather) + horizon 토글 (96 / 720). PatchTST 는 L 증가에 따라 일관 감소 — 다른 Transformer 들은 plateau 또는 증가.
```

---

## Qualitative — Figure 3

![Fig 3 Forecast viz](figures/Fig3_forecast_viz.png)

paper p.14 Figure 3 caption:
> Visualization of 192-step forecasting on {Weather, Traffic} datasets with the look-back window $L = 336$. PatchTST is supervised with non-overlapping patches. The black lines are the ground truth and the colored lines are the model predictions.

→ Weather, Traffic 의 192-step prediction 예시. PatchTST 의 forecast 가 다른 baseline 보다 ground truth 에 가깝게 따라감.

paper p.6:
> We also experiment with univariate datasets where the results are provided in Appendix A.3.

→ Univariate 결과는 Appendix A.3 (Table 8).

다음 [11_repr_transfer.md](11_repr_transfer.md) 에서 self-supervised + transfer 결과 (Tables 4, 5, 6).
