# 10 Loss Function — Section 4.5

paper p.4 의 Section 4.5. 짧지만 모델 학습의 핵심.

---

## Joint Quantile Loss (Eq 19)

paper text:
> In order to synthesize the information of the context vectors, we train our model by combining the losses of three parts, and each part of the loss is measured by a quantile loss function. In line with previous works [Wen et al., 2017; Lim et al., 2019; Zhou et al., 2023], we use a jointly quantile loss which sums across all quantile outputs for horizons in the future, i.e., $\tau \in 1, \ldots, \tau_{max}$, to train our model:

paper Eq 19:
$$
\mathcal{L}(\Omega, W) = \sum_{y_t \in \Omega} \sum_{q \in Q} \sum_{\tau = 1}^{\tau_{max}} \frac{q(y - \hat{y})_+ + (1 - q)(\hat{y} - y)_+}{M \tau_{max}}
$$

### 수식 4줄 풀이

**기호 뜻**:
- $\Omega$: training data domain ($M$ samples)
- $Q$: quantile set ($\{0.5, 0.6, 0.7, 0.8, 0.9\}$)
- $\tau_{max}$: forecasting horizon length
- $(\cdot)_+ = \max(0, \cdot)$ — ReLU
- 3중 sum: samples × quantiles × horizon
- Normalize: $1/(M \tau_{max})$

**일상 비유**:
- **3 영역에서 동시 활쏘기 학습**: 여러 표적 ($Q$ = 5개 quantile 위치) × 여러 거리 (horizon) × 여러 학생 (samples).
- 각 표적 위치의 정확도 (pinball loss) 를 모두 합산 → 균형 학습.
- 한 quantile (예: 0.5 median) 만 잘 맞으면 안 됨, 모든 quantile 잘 맞춰야.

**왜 이 형태인가**:
- **Pinball loss** ($q(y-\hat y)_+ + (1-q)(\hat y - y)_+$): asymmetric — quantile 학습의 표준.
- **Multi-quantile sum**: 단일 quantile 학습보다 quantile crossing 위험 ↓.
- **Multi-horizon sum**: 모든 시점 균등 학습 — 후반 timestep 도 학습.
- **Normalize**: sample 수 + horizon 길이로 평균 → batch / horizon length 독립.

**조심할 점**:
- $|Q| = 5$ → quantile loss 가 quantile 수에 비례 (normalize 안 함). 다른 loss term (KL 등) 과 균형 주의.
- $u = 0$ 에서 non-differentiable → subgradient 사용 (PyTorch 자동 처리).
- Quantile crossing — paper 명시 안 함, 후속 보정 가능.

---

## Pinball Loss 의 재인용

paper Eq 19 의 핵심 항:
$$
\rho_q(u) = q \cdot \max(0, u) + (1 - q) \cdot \max(0, -u)
$$

with $u = y - \hat{y}$.

**경우 분석**:
- **Under-prediction** ($y > \hat{y}$, $u > 0$): loss = $q \cdot u$. $q$ 가 크면 (e.g., 0.9) 큰 penalty.
- **Over-prediction** ($y < \hat{y}$, $u < 0$): loss = $(1-q) \cdot |u|$. $q$ 가 크면 작은 penalty.

→ **$q = 0.9$ 일 때**: 모델은 90%의 cases 에서 실제값이 prediction 이하가 되도록 학습 (= 90 percentile 예측).

→ **$q = 0.5$ 일 때**: under/over 가 동일 weight → median 예측.

---

## 3 가지 평균

Eq 19 의 3중 sum:

| 변수 | 의미 |
|------|------|
| $\sum_{y_t \in \Omega}$ | training samples 평균 ($M$ samples) |
| $\sum_{q \in Q}$ | quantile 평균 (5개 quantile $\{0.5, 0.6, 0.7, 0.8, 0.9\}$) |
| $\sum_{\tau=1}^{\tau_{max}}$ | forecasting horizon time step 평균 |

Normalization: $\frac{1}{M \tau_{max}}$ — sample 수와 horizon 길이로 나눔. quantile 수 $|Q|$ 는 명시적 normalize 안 (loss 가 quantile 수에 비례).

---

## "3 parts" 의 의미

paper text 의 한 문장:
> we train our model by combining the losses of three parts

이 "3 parts" 의 정확한 정의가 paper 본문에 명시 안 됨. 본 deep dive 의 해석:

가능한 3 parts:
1. **Drift path loss**: $\chi^Q_{eout}$ 에서의 quantile loss
2. **Divergence/VAE path loss**: $\chi^d_{out}$ 의 ELBO loss (KL + reconstruction)
3. **Final fusion loss**: $\hat{y}$ 에서의 quantile loss

또는:
1. Quantile loss (Eq 19)
2. KL divergence (Eq 13)
3. Reconstruction error (within VAE)

paper 본문이 명시하지 않아 정확한 분류는 implementation 의존.

---

## Loss landscape 의 직관

```
           y (true value)
            │
            ↓                 q=0.9 의 quantile loss:
       ↗ |
      ↗  | 큰 penalty           ┌───────
     ↗   |                    /
    ↗    |                  /  0.9 · u (for u>0)
   ↗     |                /
   y─────┼──────────       
          \  0.1 · |u| (for u<0)
           \
            \  작은 penalty
             ↘
              ↘
            ŷ (prediction)
```

→ **asymmetric V-shape**. q=0.9 면 오른쪽 (under-prediction) 이 가파른 기울기.

---

## 왜 quantile loss?

### MSE loss 의 문제
- $\min \sum (y - \hat{y})^2$ → 평균 학습.
- 모델은 "예측의 confidence" 를 모름.
- Worst case prediction 의 안전성 보장 못함.

### Quantile loss 의 답
- 여러 quantile 을 동시에 학습 → distribution shape 파악.
- $\hat{y}_{0.1}$ 과 $\hat{y}_{0.9}$ 사이의 거리 = 모델의 uncertainty.
- 의사결정자가 worst case (e.g., 5% 분위수) 기반 판단 가능.

paper 의 응용 시사:
- 전력 (Electricity dataset): "내일 최대 부하 90% 분위수" → 전력 회사가 안전마진 설정.
- 풍력 (Wind): "내일 풍속 10% 분위수" → 최소 발전량 예측.

---

## Eq 19 의 implementation 한 줄

```python
def quantile_loss(y, y_hat, quantiles):
    # y: [B, O], y_hat: [B, O, Q]
    losses = []
    for i, q in enumerate(quantiles):
        u = y - y_hat[..., i]
        loss = q * F.relu(u) + (1 - q) * F.relu(-u)  # pinball
        losses.append(loss.mean())
    return sum(losses)
```

paper repo 가 공개 안 됐지만 본 deep dive 의 ch18 PyTorch 코드에서 이 형식 사용.

---

## 학습 셋업 (paper 명시 안 함)

paper text 가 hyperparameter 명시 안 함. 본 deep dive 의 추론 (DeepAR/TFT/Autoformer 표준 setup 기반):
- Optimizer: Adam, lr ≈ 1e-4
- Batch size: 32~64
- Epochs: 10~20 with early stopping
- $\tau_{max}$ (horizon): 96 (paper text 의 96-step prediction implied by Fig 3 x-axis "20-96")

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Multi-quantile 합 학습이 단일 quantile 학습보다 좋은 두 가지 이유는?**
2. **Pinball loss 의 $u=0$ 에서 비미분 — 학습 시 어떻게 처리되는가?**
3. **paper "3 parts" 의 정확한 정의 미명시 — 본 deep dive 의 두 가지 해석은?**

### 답변

1. (a) **Quantile crossing 회피**: $\hat Q(0.7) > \hat Q(0.8)$ 같은 모순 자연 감소. (b) **Distribution shape 학습**: 5개 점 동시 학습 → 분포의 형태 (skewness, tail) 정보 더 풍부.
2. **Subgradient 사용**: $u > 0$ 일 때 gradient = $q$, $u < 0$ 일 때 gradient = $-(1-q)$. PyTorch 의 `max(0, u)` 가 자동으로 subgradient 처리. $u = 0$ 정확히 일 때는 사실상 발생 거의 없음 (continuous data).
3. **해석 1**: (i) drift path quantile loss, (ii) divergence/VAE path ELBO, (iii) final fusion quantile loss. **해석 2**: (i) quantile loss (Eq 19), (ii) KL divergence (Eq 13), (iii) reconstruction error. paper 본문 명시 안 — implementation 의존.

다음 [11_data_baselines.md](11_data_baselines.md) 에서 6 datasets + 8 baselines + 2 metrics (q-risk + cpaw).
