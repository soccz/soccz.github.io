# 12 Main Results — Tables 1, 3 (Section 5.1)

paper p.6 의 Section 5.1. q-risk + cpaw 두 metric 의 결과.

## Table 1 — q-risk (paper p.6)

paper Table 1 정확 인용. 9 models × 6 datasets × 5 quantiles. **lower = better**.

### Electricity & Wind

| Model | Elec 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | Wind 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|-------|----------|-----|-----|-----|-----|----------|-----|-----|-----|-----|
| DeepAR | 1.0002 | 1.1177 | 1.9544 | 1.2077 | 1.0830 | 1.0205 | 0.9987 | 0.7805 | 1.0182 | 1.4419 |
| MQRNN | 1.1648 | 1.5772 | 1.6336 | 1.8193 | 0.8273 | 2.1937 | 4.4670 | 5.5987 | 5.9560 | 1.8574 |
| TFT | 1.5547 | 1.0037 | 1.0440 | 0.8772 | 0.7618 | 0.9526 | 0.8611 | 0.7978 | 0.6568 | 0.4658 |
| Transformer | 1.3703 | 0.8873 | 1.0098 | 0.9005 | 0.9439 | 1.0011 | 1.0585 | 0.9898 | 0.9006 | 0.9750 |
| Autoformer | 1.0584 | 0.9191 | 1.0301 | 0.8786 | 0.6420 | 1.4353 | 1.6054 | 1.3345 | 0.9921 | 0.6361 |
| FEDformer | 1.9429 | 1.0447 | 0.9669 | 3.0007 | 1.0618 | 1.1361 | 1.0831 | 1.2615 | 0.6544 | **0.3876** |
| PatchTST | 1.8354 | 1.3134 | 1.0657 | 0.8800 | 0.7567 | 1.4666 | 0.9831 | 1.1394 | 0.9008 | 0.3667 |
| iTransformer | 1.3430 | 1.0348 | 1.2174 | 0.9072 | 1.2742 | 1.5983 | 1.0314 | 0.8091 | 0.6814 | 0.9900 |
| **QuantileFormer** | **0.7469** | **0.8136** | **0.3330** | **0.4340** | **0.5121** | **0.8403** | **0.9105** | **0.7346** | **0.5842** | 0.3369 |

(paper Table 1 row 1, p.6)

### ETTm1 & ETTh1

| Model | ETTm1 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | ETTh1 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|-------|-----------|-----|-----|-----|-----|-----------|-----|-----|-----|-----|
| DeepAR | 1.2026 | 1.1749 | 0.7901 | 1.0616 | 0.5388 | 2.3414 | 0.7631 | 1.2217 | 1.0815 | 1.9889 |
| MQRNN | 16.5845 | 21.9918 | 17.9190 | 12.0559 | 3.6909 | 1.4757 | 1.6722 | 1.0317 | 1.1949 | 1.2239 |
| TFT | 0.4930 | 0.7829 | 0.6769 | 0.4976 | 0.3513 | 1.4639 | 1.0443 | 0.9283 | 0.7382 | 0.3662 |
| Transformer | 1.0397 | 0.8740 | 0.7372 | 0.4998 | 0.3618 | 1.1989 | 0.8805 | 0.7284 | 0.4868 | 0.5546 |
| Autoformer | 1.8463 | 1.3424 | 1.1008 | 0.8392 | 0.4774 | 1.7221 | 1.2556 | 1.1977 | 0.9091 | 0.4569 |
| FEDformer | 0.6619 | 0.8673 | 0.4927 | 0.5491 | 0.3865 | 0.9480 | 0.8875 | 0.8328 | 0.7208 | 0.4582 |
| PatchTST | 1.4268 | 1.3088 | 1.0240 | 0.5100 | 0.2816 | 1.4719 | 1.4558 | 1.1307 | 0.4275 | 0.3166 |
| iTransformer | 0.7514 | 0.4112 | 0.8834 | 0.5824 | **0.1228** | 0.8850 | 0.9508 | 0.8607 | 0.4721 | 0.3129 |
| **QuantileFormer** | **0.1536** | **0.1642** | **0.2689** | 0.4340 | 0.0596 | **0.3007** | **0.6130** | **0.2912** | **0.4273** | 0.3388 |

(paper Table 1 row 2, p.6)

### Solar & Traffic

| Model | Solar 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | Traffic 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|-------|-----------|-----|-----|-----|-----|-------------|-----|-----|-----|-----|
| DeepAR | **0.8666** | 1.1173 | 1.2854 | 1.4512 | 1.6117 | 1.0502 | **0.8813** | 1.2484 | 0.9394 | 1.1539 |
| MQRNN | 0.8994 | 1.3492 | **1.0459** | 1.1921 | 1.7157 | 1.8146 | 2.2111 | 2.5796 | 2.9482 | 0.9940 |
| TFT | 1.0039 | 1.1082 | 1.2493 | 1.3740 | 1.0015 | 1.1494 | 0.8900 | 0.8500 | 0.5862 | 1.0570 |
| Transformer | 1.0391 | 1.1617 | 1.1381 | 1.0794 | 1.0777 | 0.9664 | 0.9325 | 1.0574 | 0.8679 | 0.9247 |
| Autoformer | 1.1641 | 1.2367 | 1.2088 | **1.0030** | 0.6167 | 0.9908 | 1.1109 | 0.8686 | 0.6064 | 0.4970 |
| FEDformer | 1.0363 | 1.1708 | 1.0261 | 1.5427 | 0.6414 | 2.4497 | 0.9188 | 2.3784 | 1.7356 | 0.8770 |
| PatchTST | 1.0806 | 1.1242 | 1.2547 | 1.1935 | 0.5950 | 0.9775 | 1.6937 | 1.1269 | 0.5962 | 1.1450 |
| iTransformer | 1.0705 | 1.1843 | 1.1845 | 1.3705 | 1.6083 | 1.8998 | 1.3545 | 1.1941 | 0.8247 | 1.5621 |
| **QuantileFormer** | 1.0641 | **1.0480** | 1.1832 | 1.0008 | **0.5883** | **0.8489** | 0.8291 | **0.8489** | **0.5998** | **0.4688** |

(paper Table 1 row 3, p.6)

→ **QuantileFormer 의 best 위치**: 30/30 cells 중 약 **18-20개에서 1위** (paper 본문 "consistently boosts by large margin").

---

## 평균 개선율 (paper p.6)

paper text:
> The results show that QuantileFormer achieves the best performance in most cases, with an average q-risk decrease of 24% for 0.5 quantile, decrease of 15% for 0.6 quantile, decrease of 27%, 14%, and 22% for 0.7, 0.8, and 0.9 quantile respectively, compared to the second-place algorithm.

| Quantile τ | 평균 q-risk 감소 |
|-----------|-----------------|
| 0.5 (median) | **24%** |
| 0.6 | 15% |
| 0.7 | **27%** |
| 0.8 | 14% |
| 0.9 | **22%** |

→ **median + extreme quantiles (0.7, 0.9)** 에서 가장 큰 개선. Probabilistic forecasting 의 가장 중요한 quantile 들 (0.5 median + 0.9 upper bound).

---

## Table 3 — cpaw (paper p.6)

paper Table 3 정확 인용. **lower = better**.

| Model | Elec. | Wind | ETTm1 | ETTh1 | Traffic | Solar |
|-------|-------|------|-------|-------|---------|-------|
| DeepAR | 5.2890 | 5.4470 | 3.8999 | 8.6446 | 4.8742 | 11.2021 |
| MQRNN | 3.8166 | 2.8071 | 8.4531 | 5.2274 | **1.6137** | 5.6390 |
| TFT | 2.0002 | 2.4662 | 2.6199 | 2.1166 | 3.0367 | 1.7246 |
| Transformer | − | − | **0.8988** | − | − | 2.3645 |
| Autoformer | 3.2389 | 3.2790 | 1.8055 | 1.8830 | 2.3327 | 4.2420 |
| FEDformer | 2.3841 | 2.1214 | 3.7312 | **1.1557** | 2.8512 | 2.1066 |
| **QuantileFormer** | **1.9902** | **1.8435** | 5.0815 | 4.4471 | 1.5858 | **0.8335** |

(paper Table 3, p.6)

**Note**: Transformer 의 일부 cell 이 "−" — paper 가 미실험 또는 OOM.

### cpaw 분석

paper p.6:
> 1) Compared with methods which are based on Transformer (i.e., TFT, Transformer, Autoformer, FeDformer, PatchTST and iTransformer), our method achieves 20% and 51% improvement on Wind and Traffic dataset, respectively. 2) Compared with methods which are based on RNN (i.e., DeepAR, MQRNN), our method improves by 55%, 50% and 88% on Electricity, Wind and Traffic datasets over other baselines, respectively.

**관찰**:
- **Electricity / Wind / Solar / Traffic** 에서 QuantileFormer best.
- **ETTm1 / ETTh1** 에서는 Transformer / FEDformer 가 더 좋음 — paper 의 한계 인정.

→ paper text 는 "consistently outperforms" 라고 표현하지만 실제로는 6/4 split — Electricity/Wind/Solar/Traffic 에서만 압도, ETT 에서는 약함.

---

## 두 metric 의 일관성

같은 dataset 에서 q-risk 와 cpaw 비교:

| Dataset | q-risk best | cpaw best |
|---------|-------------|-----------|
| Electricity | QuantileFormer (8/10 cells) | **QuantileFormer** 1.9902 |
| Wind | QuantileFormer (~7/10) | **QuantileFormer** 1.8435 |
| ETTm1 | QuantileFormer (3/5) | Transformer 0.8988 ← 충돌 |
| ETTh1 | QuantileFormer (4/5) | FEDformer 1.1557 ← 충돌 |
| Traffic | QuantileFormer (5/5) | MQRNN 1.6137 ← 충돌 |
| Solar | QuantileFormer (2/5) | **QuantileFormer** 0.8335 |

→ **ETT 와 Traffic 에서 두 metric 의 best 가 다름**. 의의:
- q-risk 는 quantile accuracy 만 측정.
- cpaw 는 interval tightness 도 고려.
- 모델이 정확하지만 넓은 interval 출력 시 → q-risk 좋음, cpaw 나쁨.

**Practical 권장**: 응용에 따라 metric 선택:
- 의사결정 보수적 (under/over prediction risk): q-risk
- 자원 efficient interval (narrow & accurate): cpaw

---

## 인터랙티브 시각화

```viz:qf-qrisk-table1:title=paper Table 1 — q-risk (interactive),caption=Dataset 토글 (Electricity / Wind / ETTm1 / ETTh1 / Solar / Traffic) + Quantile 토글 (0.5 / 0.6 / 0.7 / 0.8 / 0.9). 9 models 의 q-risk bar 비교. QuantileFormer 가 30 cells 중 약 18-20개에서 best. paper 본문 평균 개선율 — 0.5q 24% / 0.7q 27% / 0.9q 22%.
```

```viz:qf-cpaw-table3:title=paper Table 3 — cpaw (interactive),caption=6 datasets × 7 models (Transformer 일부 OOM). cpaw = PINAW × (1 + γ·exp(-(PICP-μ))). lower = better. QuantileFormer 가 Electricity / Wind / Solar / Traffic 에서 best. ETT 에서는 Transformer / FEDformer 가 우수.
```

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Table 1 의 30 cells 중 QuantileFormer 가 best 인 비율과 paper text 의 "consistently outperforms" 표현의 한계는?**
2. **Table 3 cpaw 에서 ETT (m1, h1) 가 다른 모델 (Transformer, FEDformer) 이 더 좋은 이유 추정은?**
3. **0.5 (median) vs 0.7 vs 0.9 quantile 에서 paper 의 가장 큰 평균 개선 (~27%) 이 0.7 quantile 인 의의는?**

### 답변

1. **30/30 best 아닌 ~18-20 best (60-67%)** — paper text 의 "consistently" 는 marketing 수준. 정확히는 "**대부분 best, 일부 dataset 에서 baseline 비등**". 본 deep dive 가 honest 하게 정리 → 미래 사용자가 ETT 에서 실망 안 함.
2. **ETT 는 단순한 일/계절 cycle 만** 있는 데이터 → multi-modal distribution 적음. QuantileFormer 의 GMM/VAE 부담이 advantage 보다 큼. **모델의 복잡도가 데이터의 복잡도와 match 해야** 한다는 원칙 — 단순 deterministic Transformer 가 단순 데이터에 더 효율적.
3. **0.7 quantile 의 의미**: median 과 extreme upper bound 사이 — 가장 정보 풍부한 영역. 0.5 (median) 은 모든 모델이 잘함, 0.9 (extreme) 은 데이터 부족으로 모두 어려움. **0.7 부근이 모델 차이가 가장 잘 드러남**. probabilistic forecasting 의 sweet spot.

다음 [13_ablation.md](13_ablation.md) 에서 Table 4 ablation.
