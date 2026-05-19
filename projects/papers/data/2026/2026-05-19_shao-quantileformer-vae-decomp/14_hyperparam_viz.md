# 14 Hyperparameter Analysis + Visualization — Section 5.3–5.4

paper p.7 의 Section 5.3 (Fig 3) 와 Section 5.4 (Fig 4).

---

## Section 5.3 — Hyperparameter k (GMM Components)

![Fig. 3 Hyperparameter k analysis](figures/Fig3_hyperparam_k.png)

(Figure 3, paper p.7)

paper text:
> We analysis the impact of hyperparameters. i.e., selection of the number of Gaussian components $k$ on the model's final performance, and the results are illustrated in Figure 3.

### Fig 3 의 의미

- X-axis: $k$ (GMM component 수)
- Y-axis: q-risk (lower better)
- 3 datasets: Electricity / Wind / ETTm1
- 2 quantiles: 0.5 (q-risk for median) + 0.9 (q-risk for upper bound)

### 결과 (paper p.7)

paper text:
> According to the figure, if $k$ is too small (e.g., $k \leq 4$), the performance is relative poor due to no enough Gaussian components to describe the mixture distribution. If $k$ is too large (e.g., $k \geq 12$), the performance also degrade, probably due to overfitting. A suitable $k$ is within [8,10] for Electricity, within [6,10] for Wind, and within [8,11] for ETTm1.

### 권장 $k$ 범위 (dataset 별)

| Dataset | 최적 $k$ 범위 |
|---------|-------------|
| Electricity | **[8, 10]** |
| Wind | [6, 10] |
| ETTm1 | [8, 11] |

→ **dataset-specific tuning** 필요. 데이터의 distributional complexity 가 다름.

### "왜 너무 작은 k 가 나쁜가"

$k \leq 4$ — Gaussian component 수 부족:
- Mixture 의 모드 (mode) 수가 데이터 분포의 모드 수보다 적음.
- Underfit — 실제 distribution 의 multi-modality 표현 못함.
- 예: 평상시 + 이벤트 시 + 야간 = 3 modes 인데 $k=2$ 면 부족.

### "왜 너무 큰 k 가 나쁜가"

$k \geq 12$:
- Overfit — 노이즈를 component 로 잘못 학습.
- VAE 의 latent space 가 너무 커져 학습 불안정.
- 각 component 가 데이터의 일부분에만 fit → generalization 약화.

### Hyperparameter 의 design choice

paper 가 사용한 default $k$ (Table 1, 3, 4 의 experiment 셋업):
- 본문 명시 안 됨. Fig 3 의 sweet spot 기준 추정: $k \approx 8$.

본 deep dive 의 권장:
- 일반 dataset: $k = 8$ 부터 시도.
- Complex multi-modal (Wind, Traffic): $k = 8$~$10$.
- Simple periodic (ETT): $k = 10$~$11$.

---

## 인터랙티브 시각화 — Figure 3 재현

```viz:qf-hyperparam-k:title=Figure 3 — Hyperparameter k Analysis (interactive),caption=Dataset 토글 (Electricity / Wind / ETTm1) + Quantile 토글 (0.5 / 0.9). U-shape curve — k 가 너무 작거나 (≤4) 너무 크면 (≥12) q-risk 증가. Sweet spot [6 10]. 주의 — paper Fig 3 의 정확 수치 미공개. 본 viz 는 paper 권장 범위 + U-shape 일반 모양 기반 추정.
```

---

## Section 5.4 — Visualization (Figure 4)

![Fig. 4 Visualization](figures/Fig4_visualization.png)

(Figure 4, paper p.7. 6 models on Electricity dataset)

paper text:
> We visualize the probabilistic forecasting results of different models in Figure 4 (the Electricity dataset). These visualizations offer insights into how different models perform in capturing the underlying uncertainty and predictive trends within each respective dataset.

### Fig 4 의 구조

6 panel (모두 Electricity, q=0.1 lower bound, q=0.9 upper bound):
- (a) QuantileFormer
- (b) iTransformer
- (c) DeepAR
- (d) PatchTST
- (e) TFT
- (f) Autoformer

### 6 panel 의 시각 요소

paper text:
> The dark lines stand for the ground truth and the light shadow stand for the predicted probabilistic intervals. The gray line represents the prediction upper bound, and the yellow line represents the prediction lower bound. We set the upper and lower bound quantile as 0.1 and 0.9.

| 요소 | 의미 |
|------|------|
| **Dark line** (진한) | Ground truth |
| **Light shadow** | Prediction interval (10% – 90%) |
| **Gray line** | Prediction upper bound (q=0.9) |
| **Yellow line** | Prediction lower bound (q=0.1) |

### 핵심 관찰 (paper p.7)

paper text:
> It demonstrates that the QuantileFormer is more in line with the ground truth, with a much narrower probabilistic interval (PI) and a lower q-risk. This verify the effectiveness of the pattern-mixture decomposed Transformer model.

**QuantileFormer 의 차별점**:
1. **Narrower PI**: 신뢰 구간 폭이 좁음.
2. **Lower q-risk**: 정확도 높음.

→ cpaw metric 의 의미와 일치 — 정확한 좁은 interval.

### 다른 모델들의 한계 (본 deep dive 의 추론)

- **iTransformer (b)**: variable-wise token 으로 cross-time 잘 잡지만 quantile distribution 약함.
- **DeepAR (c)**: Gaussian parametric → multi-modal 표현 못함.
- **PatchTST (d)**: patch 단위 학습 → 짧은 변동 놓침.
- **TFT (e)**: recurrent overhead 로 quantile 정확도 손실.
- **Autoformer (f)**: deterministic 모델을 quantile loss 로 학습 → distribution 학습 약함.

---

## 인터랙티브 시각화 — Probabilistic Forecasting Visualization

```viz:qf-quantile-prediction:title=Figure 4 — Probabilistic Forecasting Visualization (interactive),caption=Model 토글 (QuantileFormer / iTransformer / DeepAR / PatchTST / TFT / Autoformer). 합성 Electricity-like 데이터에서 prediction interval (10%-90%) 의 너비 + ground truth coverage. QuantileFormer 가 narrowest PI + 정확한 trend 추적. paper Fig 4 의 정확 데이터 미공개 — 본 viz 는 paper 설명 + 모델 별 특성 기반 합성.
```

---

## 5.3 + 5.4 의 통합 의미

두 section 이 보여주는 것:

| Section | 무엇을 입증? |
|---------|------------|
| 5.3 ($k$ tuning) | 모델의 **practical 사용** 측면 — 어떻게 hyperparameter 선택? |
| 5.4 (visualization) | 모델의 **메커니즘 작동** — narrow PI + accurate trend = pattern-mixture decomp 의 효과 |

→ paper 의 결과가 단순 수치 잘 나옴이 아닌 **메커니즘 의도대로 작동**.

---

## 다음

- [15_conclusion.md](15_conclusion.md) — Section 6 결론
- [16_glossary.md](16_glossary.md) — 용어 + References 전체
- [17_insights.md](17_insights.md) — 12-15 메타 통찰
- [18_code.md](18_code.md) — PyTorch 구현
- [19_diagrams.md](19_diagrams.md) — ASCII + viz catalog
