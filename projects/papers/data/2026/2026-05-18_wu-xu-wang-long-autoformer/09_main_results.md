# 09 Main Results — Tables 1 & 2

paper Section 4.1 (p.7–8). Multivariate / Univariate 두 setting 에서 Autoformer 의 SOTA.

---

## Table 1 — Multivariate (paper p.7)

> Multivariate results with different prediction lengths $O \in \{96, 192, 336, 720\}$. We set the input length $I$ as 36 for ILI and 96 for the others. A lower MSE or MAE indicates a better prediction.
>
> *ETT means the ETTm2. See Appendix A for the full benchmark of ETTh1, ETTh2, ETTm1.*

### MSE 만 추려서 (paper Table 1 정확 인용)

| Dataset | O | Autoformer | Informer | LogTrans | Reformer | LSTNet | LSTM | TCN |
|---------|---|-----------|----------|----------|----------|--------|------|-----|
| **ETT(m2)** | 96 | **0.255** | 0.365 | 0.768 | 0.658 | 3.142 | 2.041 | 3.041 |
|          | 192 | **0.281** | 0.533 | 0.989 | 1.078 | 3.154 | 2.249 | 3.072 |
|          | 336 | **0.339** | 1.363 | 1.334 | 1.549 | 3.160 | 2.568 | 3.105 |
|          | 720 | **0.422** | 3.379 | 3.048 | 2.631 | 3.171 | 2.720 | 3.135 |
| **Electricity** | 96 | **0.201** | 0.274 | 0.258 | 0.312 | 0.680 | 0.375 | 0.985 |
|          | 192 | **0.222** | 0.296 | 0.266 | 0.348 | 0.725 | 0.442 | 0.996 |
|          | 336 | **0.231** | 0.300 | 0.280 | 0.350 | 0.828 | 0.439 | 1.000 |
|          | 720 | **0.254** | 0.373 | 0.283 | 0.340 | 0.957 | 0.980 | 1.438 |
| **Exchange** | 96 | **0.197** | 0.847 | 0.968 | 1.065 | 1.551 | 1.453 | 3.004 |
|          | 192 | **0.300** | 1.204 | 1.040 | 1.188 | 1.477 | 1.846 | 3.048 |
|          | 336 | **0.509** | 1.672 | 1.659 | 1.357 | 1.507 | 2.136 | 3.113 |
|          | 720 | **1.447** | 2.478 | 1.941 | 1.510 | 2.285 | 2.984 | 3.150 |
| **Traffic** | 96 | **0.613** | 0.719 | 0.684 | 0.732 | 1.107 | 0.843 | 1.438 |
|          | 192 | **0.616** | 0.696 | 0.685 | 0.733 | 1.157 | 0.847 | 1.463 |
|          | 336 | **0.622** | 0.777 | 0.733 | 0.742 | 1.216 | 0.853 | 1.479 |
|          | 720 | **0.660** | 0.864 | 0.717 | 0.755 | 1.481 | 1.500 | 1.499 |
| **Weather** | 96 | **0.266** | 0.300 | 0.458 | 0.689 | 0.594 | 0.369 | 0.615 |
|          | 192 | **0.307** | 0.598 | 0.658 | 0.752 | 0.560 | 0.416 | 0.629 |
|          | 336 | **0.359** | 0.578 | 0.797 | 0.639 | 0.597 | 0.455 | 0.639 |
|          | 720 | **0.419** | 1.059 | 0.869 | 1.130 | 0.618 | 0.535 | 0.639 |
| **ILI** | 24 | **3.483** | 5.764 | 4.480 | 4.400 | 6.026 | 5.914 | 6.624 |
|          | 36 | **3.103** | 4.755 | 4.799 | 4.783 | 5.340 | 6.631 | 6.858 |
|          | 48 | **2.669** | 4.763 | 4.800 | 4.832 | 6.080 | 6.736 | 6.968 |
|          | 60 | **2.770** | 5.264 | 5.278 | 4.882 | 5.548 | 6.870 | 7.127 |

**Bold** = best per row.

→ **MSE 는 24/24 settings 모두 Autoformer 가 best**. Exchange predict-720 의 두 경쟁자가 가장 가까움 (Autoformer 1.447 < Reformer 1.510, ≈4% gap).

⚠️ **MAE 는 21/24** — Traffic dataset 의 3 row 에서 다른 모델이 살짝 앞섬:
- Traffic predict-96 MAE: Autoformer 0.388 vs LogTrans **0.384**
- Traffic predict-192 MAE: Autoformer 0.382 vs Informer **0.379**
- Traffic predict-720 MAE: Autoformer 0.408 vs LogTrans **0.396**

paper text 는 MSE 기준으로만 "consistent SOTA" 라고 표현. MAE 의 작은 격차는 본문에서 언급 없음.

### 개선율 (paper p.7 본문에서 명시)

> Especially, under the input-96-predict-336 setting, compared to previous state-of-the-art results, Autoformer gives 74% (1.334→0.339) MSE reduction in ETT, 18% (0.280→0.231) in Electricity, 61% (1.357→0.509) in Exchange, 15% (0.733→0.622) in Traffic and 21% (0.455→0.359) in Weather. For the input-36-predict-60 setting of ILI, Autoformer makes 43% (4.882→2.770) MSE reduction. Overall, Autoformer yields a 38% averaged MSE reduction among above settings.

| Setting | 이전 SOTA | Autoformer | 감소율 |
|---------|----------|-----------|--------|
| ETT predict-336 | 1.334 (LogTrans) | **0.339** | 74% |
| Electricity predict-336 | 0.280 (LogTrans) | **0.231** | 18% |
| Exchange predict-336 | 1.357 (Reformer) | **0.509** | 61% |
| Traffic predict-336 | 0.733 (LogTrans) | **0.622** | 15% |
| Weather predict-336 | 0.455 (LSTNet) | **0.359** | 21% |
| ILI predict-60 | 4.882 (Reformer) | **2.770** | 43% |
| **평균** | — | — | **38%** |

→ **Abstract 의 "38% relative improvement" 의 출처**: 위 6개 평균.

### 추가 관찰

> Note that Autoformer still provides remarkable improvements in the Exchange dataset that is without obvious periodicity. (p.7)

- Exchange 는 무주기 (8개국 FX 일간) — Auto-Correlation 의 주기성 가정이 약함에도 잘 작동.
- 이유: Top-k 의 $\tau$ 가 단순 주기뿐 아니라 추세 변화 시점을 잡아낼 수 있음.

> Besides, we can also find that the performance of Autoformer changes quite steadily as the prediction length $O$ increases. It means that Autoformer retains better long-term robustness. (p.8)

- ETTm2 의 경우 predict-96 → 720 에서 MSE 가 0.255 → 0.422, 약 1.6배 증가.
- Informer 는 0.365 → 3.379 (9배 증가). LSTM 은 2.04 → 2.72.
- Autoformer 의 horizon-robustness 는 paper 의 핵심 마케팅 포인트.

---

## Table 2 — Univariate (paper p.8)

> Univariate results with different prediction lengths $O \in \{96, 192, 336, 720\}$ on typical datasets. We set the input length $I$ as 96.

### MSE (paper Table 2 정확 인용)

| Dataset | O | Autoformer | N-BEATS | Informer | LogTrans | Reformer | DeepAR | Prophet | ARIMA |
|---------|---|-----------|---------|----------|----------|----------|--------|---------|-------|
| **ETT** | 96 | **0.065** | 0.082 | 0.088 | 0.082 | 0.131 | 0.099 | 0.287 | 0.211 |
|         | 192 | **0.118** | 0.120 | 0.132 | 0.133 | 0.186 | 0.154 | 0.312 | 0.261 |
|         | 336 | **0.154** | 0.226 | 0.180 | 0.201 | 0.220 | 0.277 | 0.331 | 0.317 |
|         | 720 | **0.182** | 0.188 | 0.300 | 0.268 | 0.267 | 0.332 | 0.534 | 0.366 |
| **Exchange** | 96 | 0.241 | 0.156 | 0.591 | 0.279 | 1.327 | 0.417 | 0.828 | **0.112** |
|         | 192 | **0.273** | 0.669 | 1.183 | 1.950 | 1.258 | 0.813 | 0.909 | 0.304 |
|         | 336 | **0.508** | 0.611 | 1.367 | 2.438 | 2.179 | 1.331 | 1.304 | 0.736 |
|         | 720 | **0.991** | 1.111 | 1.872 | 2.010 | 1.280 | 1.894 | 3.238 | 1.871 |

### 본문 인용 (p.8)

> In particular, for the input-96-predict-336 setting, our model achieves 14% (0.180→0.145) MSE reduction on the ETT dataset with obvious periodicity.

⚠️ 주의: Table 2 에는 ETT predict-336 의 Autoformer 값이 **0.154** 로 적혀있음. 본문에 적힌 "0.145" 와 차이 — paper 의 minor inconsistency. Table 의 값 0.154 가 정식 인용 값.

> For the Exchange dataset without obvious periodicity, Autoformer surpasses other baselines by 17% (0.611→0.508) and shows greater long-term forecasting capacity. Also, we find that ARIMA [1] performs best in the input-96-predict-96 setting of the Exchange dataset but fails in the long-term setting. This situation of ARIMA can be benefited from its inherent capacity for non-stationary economic data but is limited by the intricate temporal patterns of real-world series. (p.8)

→ **Exchange 의 단기는 ARIMA 가 가장 좋다** (predict-96 에서 ARIMA=0.112 < Autoformer=0.241). 그러나 predict-336/720 에서 Autoformer 가 ARIMA 를 압도.

**Finance 시사**: 단기 환율 예측은 단순한 모델이 강력. 장기는 deep learning 의 영토.

---

## 표준편차 — Table 10 (Appendix E.4)

> All experiments are repeated three times. ... Table 10 shows the standard deviations. (p.10, Appendix E.4)

Autoformer 의 std 예시 (Table 10, p.17):
- ETT predict-336: $0.339 \pm 0.018$
- Exchange predict-336: $0.509 \pm 0.041$
- Traffic predict-336: $0.622 \pm 0.016$
- ILI predict-48: $2.669 \pm 0.151$

→ std/mean 비율이 5–8% 수준. 안정적.

---

## 핵심 한 그림

```
ETTm2 predict-336 MSE:
LSTM ────────────────────── 2.568
TCN ──────────────────────── 3.105
LSTNet ───────────────────── 3.160
Reformer ─────────────────── 1.549
LogTrans ─────────────────── 1.334
Informer ─────────────────── 1.363
Autoformer ── 0.339 (74% ↓)
                ▲
                여기서 점프
```

→ 단순한 percentage 가 아니라 **MSE 가 한 자리 수 의 줄어듦**. 시각화에서 이 점프가 가장 극적.

다음 [10_ablation.md](10_ablation.md) 에서 Tables 3, 4 의 ablation.
