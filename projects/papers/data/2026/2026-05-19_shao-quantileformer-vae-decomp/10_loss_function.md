# 10. Section 4.5 (Loss Function) — Pinball Loss 정밀 풀이

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Pinball Loss** — quantile 학습을 보장하는 손실 함수
- **Eq 19** 의 정확한 의미 — 5 quantile (0.5~0.9) 동시 학습
- 응용에 따른 quantile set 변경 가이드 (★ 본 해체 추가)
- MSE vs Pinball loss 비교

---

논문 4쪽 (Section 4.5) 을 풀어본다. 짧지만 모델 학습의 핵심.

핵심 수식: **Eq 19 (joint quantile loss)**.

---

## 10.1 시작하기 전 — "왜 MSE 가 아닌가" 의 근본적 이유

### MSE (평균 제곱 오차) 의 한계

표준 회귀에서는 MSE 사용:
$$
\text{MSE} = \sum (y - \hat{y})^2
$$

**MSE 의 특성**:
- 위로 틀리든 아래로 틀리든 **똑같이** 벌금.
- 이 loss 를 최소화하면 모델은 **조건부 평균** $E[y | X]$ 을 학습.
- 즉 "평균만 알려주고 끝".

### 본 paper 가 풀려는 문제

**확률적 예측 (probabilistic forecasting)** = 분포 전체 (또는 여러 quantile) 예측.
- "내일 5MW" 가 아니라 "70% 확률로 4~6MW".
- 5개 quantile (0.5, 0.6, 0.7, 0.8, 0.9) 을 동시 학습해야 함.

**MSE 로는 불가능**: MSE 는 평균만 학습.

→ **Pinball loss (= quantile loss)** 가 답.

### Pinball loss 의 핵심 사상

"$\tau$-quantile 을 학습시키려면 **비대칭 벌금** 을 줘라":
- $\tau = 0.9$ → "아래로 틀리면 큰 벌금, 위로 틀리면 작은 벌금" → 모델이 위로 치우친 예측 → 0.9-quantile 학습.
- $\tau = 0.5$ → 대칭 (median 학습).
- $\tau = 0.1$ → "위로 틀리면 큰 벌금" → 아래로 치우친 예측 → 0.1-quantile 학습.

**핵심**: pinball loss 의 1차 조건을 풀면 정확히 $\tau$-quantile 이 답이 됨 (ch05.4 에서 증명 sketch).

---

## 10.2 Joint Quantile Loss — Eq 19

### 원문 (paper p.4)

> "In order to synthesize the information of the context vectors, we train our model by combining the losses of three parts, and each part of the loss is measured by a quantile loss function. In line with previous works [Wen et al., 2017; Lim et al., 2019; Zhou et al., 2023], we use a jointly quantile loss which sums across all quantile outputs for horizons in the future, i.e., $\tau \in 1, \ldots, \tau_{max}$, to train our model:"

### paper Eq 19

$$
\mathcal{L}(\Omega, W) = \sum_{y_t \in \Omega} \sum_{q \in Q} \sum_{\tau = 1}^{\tau_{max}} \frac{q(y - \hat{y})_+ + (1 - q)(\hat{y} - y)_+}{M \tau_{max}}
$$

### 🔣 식이 말하는 것 한 줄

"5 quantile × $\tau_{max}$ horizon × M sample 의 **pinball loss** 평균. q 가 클수록 under-prediction (낮게 예측) 에 더 큰 페널티 → 그 quantile 학습".

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\mathcal{L}$ | total loss | "학습 시 최소화할 총 벌금" | 작을수록 좋음 |
| $\Omega$ | training data domain | "train set 모든 sample" | OOS 에선 사용 안 함 |
| $M$ | training sample 수 | "train set 크기" | normalization 분모 |
| $W$ | 모델 weights | "QuantileFormer 의 모든 파라미터" | 학습 대상 |
| $Q$ | quantile set | "5개 quantile {0.5, 0.6, 0.7, 0.8, 0.9}" | 응용 따라 변경 가능 |
| $\tau_{max}$ | forecasting horizon | "미래 몇 시점 예측 (예: 96 step)" | dataset 별 다름 |
| $y, \hat{y}$ | 실제값, 예측값 | "true vs model output" | $y - \hat y$ 의 부호가 핵심 |
| $(\cdot)_+ = \max(0, \cdot)$ | positive part | "음수면 0, 양수면 그대로" | pinball 의 비대칭 만드는 도구 |
| $q$ vs $(1-q)$ | under-pred vs over-pred 가중치 | "낮게 예측 페널티 vs 높게 예측 페널티" | $q > 0.5$ 면 under-pred 더 페널티 |

### 🌱 일상 비유 — "내일 비 예측"

내일 강수량을 90% quantile (q=0.9) 로 예측 학습:
- **under-prediction** (실제 10mm 인데 5mm 예측): 페널티 = 0.9 × 5 = 4.5
- **over-prediction** (실제 10mm 인데 15mm 예측): 페널티 = 0.1 × 5 = 0.5
- → 모델이 **under-pred 페널티가 9배** 크니 자연스럽게 높게 예측 → 90% quantile 학습.

반대로 q=0.1 (10% quantile):
- under-prediction 페널티 = 0.1, over-prediction 페널티 = 0.9
- → 모델이 낮게 예측하도록 학습 → 10% quantile.

### 🔑 Eq 19 가 quantile 학습을 보장하는 직관

q quantile 의 정의: "$P(Y \leq Q) = q$" — 즉 실제값의 q 비율이 예측 이하.

Pinball loss 의 1차 조건 (∂L/∂$\hat y$ = 0) 을 풀면 정확히 그 조건을 만족하는 $\hat y$ = q-quantile 이 답. 따라서 SGD 가 이 loss 를 최소화하면 자동으로 q-quantile 예측 학습.

### Pinball Loss 의 정의 (Eq 19 의 핵심 항)

$$
\rho_q(u) = q \cdot \max(0, u) + (1 - q) \cdot \max(0, -u)
$$

with $u = y - \hat{y}$.

### Pinball Loss 의 경우 분석

#### Case 1: Under-prediction ($y > \hat{y}$, $u > 0$)

- 모델이 작게 예측함.
- $\max(0, u) = u$, $\max(0, -u) = 0$.
- loss = $q \cdot u$.
- **$q$ 가 크면 (e.g., 0.9) 큰 penalty**.

#### Case 2: Over-prediction ($y < \hat{y}$, $u < 0$)

- 모델이 크게 예측함.
- $\max(0, u) = 0$, $\max(0, -u) = -u = |u|$.
- loss = $(1-q) \cdot |u|$.
- **$q$ 가 크면 작은 penalty**.

### $\tau$ 별 학습 효과

| $q$ | Under-pred weight | Over-pred weight | 학습 결과 |
|-----|------------------|------------------|----------|
| 0.5 | 0.5 | 0.5 | **Median** (대칭) |
| 0.9 | 0.9 | 0.1 | **90% quantile** (위로 치우침) |
| 0.7 | 0.7 | 0.3 | 70% quantile |
| 0.1 | 0.1 | 0.9 | 10% quantile (아래로 치우침) |

### 직관

모델이 "90% 의 cases 에서 실제값이 prediction 이하" 가 되도록 학습 → 정확히 **90 percentile 예측**.

---

## 10.3 3 가지 평균 (Eq 19 의 3중 sum)

Eq 19 의 3중 sum 의 의미:

| 변수 | 의미 | 평균 단위 |
|------|------|----------|
| $\sum_{y_t \in \Omega}$ | training samples 평균 | "모든 데이터에 대해" |
| $\sum_{q \in Q}$ | quantile 평균 | "5개 quantile 모두" |
| $\sum_{\tau=1}^{\tau_{max}}$ | forecasting horizon 평균 | "예측 96 시점 모두" |

Normalization: $\frac{1}{M \tau_{max}}$ — sample 수와 horizon 길이로 나눔.
- **주의**: quantile 수 $|Q|$ 는 명시적 normalize 안 함 (loss 가 quantile 수에 비례).

---

## 10.4 "3 parts" 의 의미

paper text 의 한 문장:
> "we train our model by combining the losses of three parts"

이 "3 parts" 의 정확한 정의가 paper 본문에 명시 안 됨. 본 deep dive 의 해석 (두 가지 가능성):

### 가능성 1: 3 path 별 loss

1. **Drift path loss**: $\chi^Q_{eout}$ 에서의 quantile loss
2. **Divergence/VAE path loss**: $\chi^d_{out}$ 의 ELBO loss (KL + reconstruction)
3. **Final fusion loss**: $\hat{y}$ 에서의 quantile loss

### 가능성 2: VAE 분리

1. Quantile loss (Eq 19)
2. KL divergence (Eq 13)
3. Reconstruction error (within VAE)

paper 본문이 명시하지 않아 **정확한 분류는 implementation 의존**. 본 deep dive 의 ch18 PyTorch 코드는 가능성 1 에 가까운 구현.

---

## 10.5 Pinball Loss 의 그림 (V-shape)

```
loss
 │
 │  q · u (under-prediction)
 │   /
 │  /                          ← q=0.9 일 때 기울기 = 0.9
 │ /
 │/                            ← y - ŷ = 0 (정확)
─┼─────────────────────────── u = y - ŷ
 │\
 │ \                           ← q=0.9 일 때 기울기 = 0.1
 │  \                          ←   (1-q) · |u|
 │   \   (over-prediction)
```

### $\tau = 0.9$ 의 비대칭 V-shape

- 오른쪽 (under-prediction): 가파른 기울기 (0.9).
- 왼쪽 (over-prediction): 완만한 기울기 (0.1).
- → 모델이 학습 후 위로 치우친 예측 = 90% quantile.

### $\tau = 0.5$ (median) 의 대칭

- 좌우 기울기 모두 0.5.
- 표준 L1 loss 의 1/2 — median 학습.

---

## 10.6 왜 quantile loss? — 응용 시사

### MSE loss 의 응용 한계

- $\min \sum (y - \hat{y})^2$ → 평균 학습.
- 모델은 "예측의 confidence" 를 모름.
- Worst case prediction 의 안전성 보장 못함.

### Quantile loss 의 응용 답

- 여러 quantile 을 동시에 학습 → distribution shape 파악.
- $\hat{y}_{0.1}$ 과 $\hat{y}_{0.9}$ 사이의 거리 = **모델의 uncertainty**.
- 의사결정자가 worst case (e.g., 5% 분위수) 기반 판단 가능.

### 본 paper 의 응용 시사

- **전력 (Electricity dataset)**: "내일 최대 부하 90% 분위수" → 전력 회사가 안전마진 설계.
- **풍력 (Wind)**: "내일 풍속 10% 분위수" → 최소 발전량 예측.
- **태양광 (Solar)**: "내일 발전량 50% / 90% 분위수" → 전력 거래 계획.

---

## 10.6-bis ★ "왜 0.5~0.9 만 학습? 0.1~0.4 는 무시?"

paper 의 quantile set $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ — 모두 median 이상.

**이유** (paper 가 명시 안 함):

1. **응용 motivation**: 본 paper 의 dataset 들 (Electricity, Wind, Solar, Traffic) 은 **upper bound 예측** 이 더 중요. 전력 회사·풍력 발전소 모두 "최대 부하" 가 의사결정의 핵심.
2. **분포 대칭 가정**: 분포가 대칭이면 lower quantile = $2 \times \text{median} - \text{upper quantile}$ 로 후처리 가능.
3. **학습 효율**: 5개만 학습 → 학습 시간 ↓.

**약점** (본 deep dive 의 평가):
- **비대칭 분포** (skewed) 에서는 lower quantile 추정 부정확.
- 응용이 다르면 (예: 금융 VaR = lower tail 이 핵심) quantile set 재정의 필요.

→ ch15 의 응용 가이드: **응용에 따라 quantile set 을 변경** (의료: {0.5, 0.95, 0.99}, 금융: {0.01, 0.05, 0.1, 0.5} 등).

> ★ **"quantile set 자체가 응용에 의존하는 design choice"** — 본 paper 의 framework 는 quantile set 만 바꾸면 전혀 다른 응용에 transfer 가능.

---

## 10.7 Eq 19 의 implementation — PyTorch 한 줄

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

## 10.8 학습 셋업 (paper 명시 안 함)

paper text 가 hyperparameter 명시 안 함. 본 deep dive 의 추론 (DeepAR/TFT/Autoformer 표준 setup 기반):

| Hyperparameter | 추정 default | 근거 |
|---------------|------------|------|
| Optimizer | Adam | 표준 |
| Learning rate | ~1e-4 | 표준 Transformer |
| Batch size | 32~64 | GPU 메모리 의존 |
| Epochs | 10~20 with early stopping | 표준 |
| $\tau_{max}$ (horizon) | 96 | Fig 3 x-axis "20-96" 으로 추정 |
| Encoder layers | 6 (paper p.4) | paper 명시 |
| Decoder layers | 미명시 | 추정 1~2 |

### 재현성 위험

paper 가 정확한 hyperparameter 미공개 + 코드 미공개 → 재현 시 hyperparameter tuning 부담.

---

## 10.9 비교 — 다른 probabilistic forecasting model 의 loss

| 모델 | Loss | 학습 결과 |
|------|------|----------|
| DeepAR (2020) | NLL (Gaussian 가정) | $\mu, \sigma$ 동시 학습 |
| MQRNN (2017) | Pinball | 여러 quantile 직접 |
| TFT (2019) | Pinball | 여러 quantile 직접 |
| TimeGrad (2021) | NLL + Diffusion | 분포 전체 |
| TMDM (2024) | Diffusion | 분포 전체 |
| **QuantileFormer (본 paper)** | **Joint Pinball** | **5 quantile 동시** |

→ MQRNN, TFT 와 유사한 loss family. 다른 점: backbone (Transformer + VAE + 분해) 의 새로움.

---

## 10.10 Section 4.5 핵심 정리

| 항목 | 내용 |
|------|------|
| Loss 종류 | Joint quantile loss (Eq 19) |
| 핵심 항 | Pinball loss $\rho_q(u)$ |
| 5개 quantile | $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ |
| 3중 sum | training samples × quantile × horizon |
| Normalization | $\frac{1}{M \tau_{max}}$ (quantile 수 미정규화) |
| 학습 결과 | 5개 quantile 동시 예측 |
| "3 parts" | paper 본문 미명시 (구현 의존) |

**한 줄 핵심**:
> **"비대칭 V-shape pinball loss 를 5개 quantile × 96 horizon × 모든 sample 에 대해 합산해 minimize. 결과: 모델이 각 quantile 을 정확히 학습 → probabilistic prediction 가능."**

다음 [11_data_baselines.md](11_data_baselines.md) 에서 6 datasets + 8 baselines + 2 metrics.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **MSE 와 pinball loss 의 본질적 차이는?**
2. **$\tau = 0.9$ 일 때 pinball loss 의 비대칭이 모델 학습에 미치는 영향은?**
3. **Eq 19 의 3중 sum 이 각각 무엇에 대한 평균인가?**

### 답변

1. **MSE vs Pinball loss — 본질적 차이**:
   - **MSE** ($L = (y - \hat y)^2$):
     - 위·아래로 틀리든 **똑같이 대칭 벌금**.
     - 모델이 **평균 (mean)** 학습.
     - 단일 값 예측, deterministic forecasting.
   - **Pinball loss** ($L = q \cdot \max(0, y-\hat y) + (1-q) \cdot \max(0, \hat y-y)$):
     - $\tau$ 에 따라 **비대칭 벌금**.
     - 모델이 **$\tau$-quantile** 학습.
     - 분포의 특정 위치 (quantile) 학습 가능.
   - **함의**:
     - MSE = "이 학생 평균 점수 맞히기" (단일 답).
     - Pinball = "이 학생 상위 10% 컷오프" 등 분포 모양 학습.
   - **본 논문이 5 개 quantile 동시 학습**: 분포의 5 위치 예측 → 분포 모양 그림.

2. **$\tau = 0.9$ 의 학습 메커니즘 — 정확한 단계**:
   - **가중치 비대칭**:
     - under-prediction (낮게 예측, $y > \hat y$): weight = 0.9 (크게 벌금).
     - over-prediction (높게 예측, $y < \hat y$): weight = 0.1 (작게 벌금).
   - **학습 진행**:
     - 처기엔 모델이 무작위 예측 → 평균 정도 출력.
     - SGD 가 손실 줄이려면 under-prediction 피해야 → 예측값 ↑.
     - 점차 예측값이 위로 치우침.
   - **수렴 상태**:
     - "**위로 틀리는 게 9 배 안전**" 학습 완료.
     - 결과적으로 **90% 의 cases 에서 실제값이 예측값 이하** = 90 percentile 예측.
   - **수학적 증명**:
     - Pinball loss 의 1차 조건 (∂L/∂$\hat y$ = 0) 을 풀면:
     - 답 = $F^{-1}(\tau)$ = $\tau$-quantile of $Y$.
     - 즉 SGD 수렴 → $\tau$-quantile.

3. **Eq 19 의 3 중 sum 의미 + Normalization**:
   - **첫 번째 sum** ($\sum_{y_t \in \Omega}$):
     - training samples 평균 (모든 sample).
     - Normalize: $1/M$ (M = sample 수).
   - **두 번째 sum** ($\sum_{q \in Q}$):
     - quantile 평균 (5 개 quantile 모두: 0.5, 0.6, 0.7, 0.8, 0.9).
     - **Normalize 안 함** (loss 가 quantile 수에 비례 — 의도적).
   - **세 번째 sum** ($\sum_{\tau=1}^{\tau_{max}}$):
     - forecasting horizon 평균 (예: 96 시점 모두).
     - Normalize: $1/\tau_{max}$.
   - **Total normalization**: $\frac{1}{M \tau_{max}}$.
   - **함의**:
     - sample 과 horizon 으로는 평균.
     - quantile 로는 단순 sum → quantile 추가 시 loss 증가 → 각 quantile 이 학습에 동등 기여.
   - **Normalization 의 trade-off**:
     - quantile 수에 따라 loss scale 변동 — learning rate 재조정 필요.
     - 다른 paper 가 quantile 수로도 normalize 하는 경우 있음.
