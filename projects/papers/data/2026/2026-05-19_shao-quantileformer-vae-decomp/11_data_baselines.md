# 11 Datasets, Baselines, Metrics — Section 5

paper p.5–6 의 Section 5. 6 datasets + 8 baselines + 2 metrics.

## 6 Datasets (paper Table 2)

paper Table 2 정확 인용:

| Dataset | Range | Frequency | Samples | Features |
|---------|-------|-----------|---------|----------|
| **Electricity** | 2016/7/1–2019/7/1 | 1 hour | 26,304 | **321** |
| **ETTm1** | 2016/7/1–2018/6/26 | 15 min | 69,680 | 7 |
| **ETTh1** | 2016/7/1–2018/6/26 | 1 hour | 17,420 | 7 |
| **Wind** | 2020/7/1–2023/2/28 | 15 min | 93,412 | 3 |
| **Traffic** | 2016/7/1–2018/7/2 | 1 hour | 17,544 | **861** |
| **Solar** | 2020/1/1–2023/1/31 | 15 min | 108,192 | 5 |

(Table 2, paper p.6)

### Dataset 특성

- **Electricity** & **Traffic**: 고차원 multivariate (321 / 861 features). 도시 단위 의미.
- **ETT** (m1, h1): 표준 forecasting benchmark, 7 features (oil temperature + 6 power loads).
- **Wind** & **Solar**: 재생에너지, 짧은 sample interval (15분).

**Note**: Autoformer paper (Wu 2021) 와 dataset overlap — Electricity, ETT, Traffic 모두 공통. QuantileFormer 는 Wind, Solar 를 추가 사용.

---

## 8 Baselines (paper p.6)

paper text:
> We compare the proposed QuantileFormer with three state-of-the-art probabilistic forecasting models, which include TemporalFusionTransformer (TFT), DeepAR and MQRNN. We also compare our model with other Transformer-based models, such as PatchTST, iTransformer, Autofomer, FeDformer and Transformer.

### 확률 forecasting 3 baselines
| 모델 | 출처 | 형식 |
|------|------|------|
| **DeepAR** | Salinas et al. (2020) | Parametric Gaussian (autoregressive RNN) |
| **MQRNN** | Wen et al. (2017) | Multi-horizon quantile RNN |
| **TFT** | Lim et al. (2019) | Recurrent + attention, quantile output |

### Deterministic Transformer 5 baselines (adapted to quantile)
| 모델 | 출처 | 핵심 |
|------|------|------|
| **Transformer** | Vaswani et al. (2017) | Vanilla Transformer |
| **Autoformer** | Wu et al. (2021) | Trend-seasonal decomp + Auto-Correlation |
| **FEDformer** | Zhou et al. (2022) | Frequency-enhanced decomp |
| **PatchTST** | Nie et al. (2022) | Patch tokens + channel-independent |
| **iTransformer** | Liu et al. (2023) | Variable-wise tokens |

paper text:
> Note that the later five Transformer-based models were designed for point-wise forecasting and we adapt them to quantile prediction by training them with the proposed quantile loss.

→ **공정한 비교**: 5개 deterministic 모델을 quantile loss 로 학습시켜 quantile output 으로 변환. baseline 도 모두 probabilistic 형태.

---

## Performance Metric 1 — q-risk

paper p.6 정의:
> Previous works widely used the q-risk to quantify the accuracy of a $q$-th quantile of the predictive distribution.

paper Eq 20:
$$
\text{q-risk} = \frac{2 \sum_{y_t \in \hat{\Omega}} \sum_{\tau=1}^{\tau_{max}} \left[ q(y - \hat{y})_+ + (1-q)(\hat{y} - y)_+ \right]}{\sum_{y_t \in \hat{\Omega}} \sum_{\tau=1}^{\tau_{max}} |y_t|}
$$

where $(\cdot)_+ = \max(0, \cdot)$.

**해석**:
- Numerator: pinball loss 의 sum × 2.
- Denominator: $|y_t|$ 의 sum — normalization.

→ **percentage 형식**의 quantile loss. 1.0 = average true value 와 비교한 100% loss.

**lower = better**.

---

## Performance Metric 2 — cpaw (paper 의 새 metric)

paper p.6:
> Since q-risk only considers the accuracy of quantiles, it is lack of consideration to measure the probabilistic interval (PI). To this end, we propose a new performance metric to measure how the true value interact with the predicted probabilistic interval. We combine the coverage probability with normalized averaged width to form the metric called cpaw.

### cpaw 공식 (Eq 21)

$$
\text{cpaw} = \text{PINAW} \cdot \big(1 + \gamma \cdot e^{-(\text{PICP} - \mu)}\big)
$$

### 2 component

**PICP (Prediction Interval Coverage Probability)**:
$$
\text{PICP} = \frac{1}{n} \sum_{i=1}^{n} \mathbb{I}(y_i \in [\hat{q}_{i,l}, \hat{q}_{i,u}])
$$

→ true value 가 prediction interval 안에 들어갈 확률. **클수록 좋음** (1 = 항상 안에).

**PINAW (PI Normalized Averaged Width)**:
$$
\text{PINAW} = \frac{1}{n} \sum_{i=1}^{n} |\hat{q}_{i,u} - \hat{q}_{i,l}|
$$

→ prediction interval 의 평균 폭. **작을수록 좋음** (좁은 신뢰 구간).

### 결합 의미

$$
\text{cpaw} = \text{PINAW} \cdot \big(1 + \gamma \cdot e^{-(\text{PICP} - \mu)}\big)
$$

- $\mu$ = quantile 의 difference (예: 0.9 - 0.1 = 0.8)
- $\gamma$ = indicator function (whether PICP exceeds $\mu$)

**직관**:
- PINAW 가 작아야 (좁은 구간) cpaw 작아짐 → 좋음.
- PICP 가 $\mu$ 보다 크면 penalty 작음 (well-calibrated).
- PICP 가 $\mu$ 보다 작으면 penalty 커짐 (under-coverage).

**lower = better**.

---

## cpaw 의 의의

기존 metric 의 한계:
- q-risk: quantile prediction 의 정확도만 측정. 신뢰 구간의 **폭** 무시.
- 예: 매우 넓은 구간을 항상 출력하면 coverage 100% 가능. 하지만 useful 안 함.

cpaw 의 답:
- **정확도 (PICP)** + **타이트함 (PINAW)** 의 동시 평가.
- 모델이 "안전한" 넓은 구간을 출력하면 PINAW 증가 → cpaw 증가 → penalty.
- 모델이 "정확한 좁은 구간" 출력해야 cpaw 작아짐.

→ **probabilistic forecasting 의 honest evaluation metric**.

---

## 비교 — Probabilistic Metric 의 진화

| Metric | 측정 대상 | 한계 |
|--------|----------|------|
| MAE / MSE | 평균 예측의 정확도 | distribution 무시 |
| q-risk | quantile 별 정확도 | 구간 폭 무시 |
| CRPS (continuous ranked probability score) | 전체 distribution 의 distance | 복잡, 직관 어려움 |
| **cpaw (이 paper)** | PICP × PINAW | 직관적, 두 측면 동시 |

→ paper 의 contribution 중 metric proposal 이 단순한 보조가 아닌 **실질적 기여**.

---

## 자기점검 (이 챕터) — Block 1

### 핵심 3가지

1. **6 datasets 중 가장 고차원 (Electricity 321 / Traffic 861) 과 저차원 (Wind 3) 의 모델 학습 부담 차이는?**
2. **5개 deterministic Transformer baseline 을 quantile loss 로 adapt 한 이유와 그 의의는?**
3. **cpaw 가 q-risk 보다 honest 한 metric 인 이유는?**

### 답변

1. **고차원 (Electricity 321)**: 각 시점에 321 series 동시 처리 → attention $O(L^2 \cdot 321^2)$ 또는 channel-independent 시 batch 321배 — memory 부담. **저차원 (Wind 3)**: 단순. 따라서 고차원에서 paper 의 advantage 더 큼 (Table 1 의 Electricity 결과 우위 확인).
2. **이유**: fair comparison — 모든 baseline 을 같은 output 형식 (5 quantile) 으로 통일. 단순 deterministic 모델도 quantile loss 로 학습 → quantile prediction 가능. **의의**: QuantileFormer 의 우위가 단순 architecture 차이가 아닌 **probabilistic design** (decomp + GMM + VAE) 때문임을 입증.
3. **q-risk**: quantile accuracy 만 측정 — 매우 넓은 interval 출력해도 coverage 100% 가능. **cpaw = PINAW × penalty(PICP)**: 넓은 interval 출력하면 PINAW ↑ → cpaw ↑ (페널티). **결과**: cpaw 는 "**정확하고 좁은 interval**" 만 좋은 점수 → useful forecasting 만 보상.

---

## 5.1 Main Results 예고

paper Table 1 (q-risk) 과 Table 3 (cpaw) 의 두 metric 모두에서 비교.

→ 다음 [12_main_results.md](12_main_results.md) 에서 정확한 수치 분석.

---

## 5.1 Main Results 예고

paper Table 1 (q-risk) 과 Table 3 (cpaw) 의 두 metric 모두에서 비교.

→ 다음 [12_main_results.md](12_main_results.md) 에서 정확한 수치 분석.
