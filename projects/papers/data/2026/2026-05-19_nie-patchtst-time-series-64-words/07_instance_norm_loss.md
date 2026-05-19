# 07 Instance Normalization + Loss

paper Section 3.1 의 나머지 두 detail.

## Loss Function — MSE

paper p.4:

> We choose to use the MSE loss to measure the discrepancy between the prediction and the ground truth. The loss in each channel is gathered and averaged over $M$ time series to get the overall objective loss:

$$
\mathcal{L} = \mathbb{E}_x \frac{1}{M} \sum_{i=1}^{M} \|\hat{x}_{L+1:L+T}^{(i)} - x_{L+1:L+T}^{(i)}\|_2^2.
$$

**해석**:
- 각 channel $i$ 마다 MSE 계산
- $M$ 채널 평균
- Batch (=$\mathbb{E}_x$) 에서 평균
- 표준 forecasting MSE — 새로운 것 없음

→ ProTran 같은 probabilistic loss (Laplace + KL) 가 아니라 **단순 MSE**. Deterministic prediction.

---

## Instance Normalization (RevIN 의 정신)

paper p.4:
> This technique has recently been proposed to help mitigating the distribution shift effect between the training and testing data (Ulyanov et al., 2016; Kim et al., 2022). It simply normalizes each time series instance $x^{(i)}$ with zero mean and unit standard deviation. In essence, we normalize each $x^{(i)}$ before patching and the mean and deviation are added back to the output prediction.

**과정**:

```
Step 1: Compute statistics per instance
  μ^(i) = mean(x^(i)_{1:L})
  σ^(i) = std(x^(i)_{1:L})

Step 2: Normalize input
  x'^(i) = (x^(i) - μ^(i)) / σ^(i)

Step 3: Patching + Transformer
  ŷ'^(i) = PatchTST(x'^(i))

Step 4: Denormalize output
  ŷ^(i) = ŷ'^(i) * σ^(i) + μ^(i)
```

---

## 왜 Instance Norm 이 필요한가

**시계열의 분포 shift 문제**:
- Train data: 2020-2021 의 Electricity (낮은 base load)
- Test data: 2022 의 Electricity (높은 base load — 에너지 위기)
- Train 통계 ≠ Test 통계 → 일반화 실패

**기존 BatchNorm 의 약점**:
- Batch 전체의 통계 사용 → batch 안의 다른 sample 에 의존
- 시계열은 sample 마다 독립적 정규화가 필요

**Instance Norm 의 장점**:
- 각 시계열 instance 마다 자기 자신의 mean/std 로 정규화
- Train/test 분포 shift 에 robust
- DLinear (Zeng 2022) 도 같은 idea 사용

---

## Instance Norm 의 효과 — Table 11

paper Table 11 (p.20):
> Multivariate long-term forecasting results of supervised PatchTST with instance normalization (+in) or without instance normalization (-in).

**결과 패턴**:
- 거의 모든 dataset 에서 +in (Instance Norm) > -in
- 특히 large dataset 에서 효과 큼
- 일부 (예: ILI) 는 effect 작음

→ **Instance Norm 은 강력 추천**. Default 로 사용해야 할 trick.

---

## RevIN 와의 관계

**RevIN** (Kim et al. 2022) 가 동일한 아이디어를 "Reversible Instance Normalization" 이름으로 제안:

| 단계 | RevIN | PatchTST Instance Norm |
|------|-------|------------------------|
| Normalize | 각 instance 의 mean/std 로 normalize | 동일 |
| Denormalize | 출력에 mean/std 다시 적용 | 동일 |
| Learnable scaling | $\gamma, \beta$ trainable (affine) | 없음 (단순) |

→ PatchTST 의 Instance Norm 은 RevIN 의 단순화. Learnable scale 없이도 충분.

---

## Output denormalization 의 trick

paper 의 표현 "the mean and deviation are added back" 의 정확한 의미:

**Naive 방식** (틀림):
```python
y_pred = transformer(x_normalized)
y_pred_denorm = y_pred * sigma + mu
```

**올바른 방식**:
- $\mu, \sigma$ 가 input $x_{1:L}$ 에서 계산됨
- Output $\hat{y}_{L+1:L+T}$ 가 같은 normalization 가정
- 따라서 element-wise multiply σ + add μ 가 맞음

→ Instance Norm 은 **invertible** — train/test 모두에서 통계 적용 → forecasting 의 "절대값" 복원.

---

## 작은 detail — encoder 안의 BatchNorm 과 다름

| Norm 종류 | 위치 | 정규화 단위 |
|----------|------|-----------|
| **Instance Normalization** | Patching 전 / output denormalize | 각 channel 의 univariate 시계열 |
| **BatchNorm (encoder 내부)** | Multi-head attention block 안 | Batch 차원 |

→ 두 normalization 이 다른 곳에서 다른 목적으로 작동:
- Instance Norm: 분포 shift 완화 (input 통계 정상화)
- BatchNorm: training stability (attention 출력 정규화)

---

## Loss 의 channel-independent 의미

paper 의 loss 식 다시:
$$
\mathcal{L} = \mathbb{E}_x \frac{1}{M} \sum_{i=1}^{M} \|\hat{x}^{(i)} - x^{(i)}\|_2^2
$$

- 각 channel $i$ 의 loss 가 **독립**으로 계산되고 평균
- Cross-channel coupling 없음 (Channel-indep 의 정신과 일치)
- $M$ 으로 나누어 dataset 별 비교 가능

→ **Channel-indep 의 정신이 loss 까지 일관**. Architecture 와 objective 가 같은 가정.

---

## Comparison — vs ProTran (probabilistic) vs PatchTST (deterministic)

| 측면 | ProTran (NeurIPS 2021) | PatchTST (ICLR 2023) |
|------|------------------------|----------------------|
| Output | Probabilistic (Laplace dist) | Deterministic (point) |
| Loss | L1 + KL divergence (ELBO) | MSE only |
| Latent | Stochastic $z$ | Implicit in patch tokens |
| Uncertainty | Built-in | None (separate uncertainty model 필요) |

→ PatchTST 는 **단순 point forecasting**. Uncertainty 가 필요하면 deep ensemble / dropout MC 등 separate technique 필요.

다음 [08_representation_learning.md](08_representation_learning.md) 에서 self-supervised masked reconstruction.
