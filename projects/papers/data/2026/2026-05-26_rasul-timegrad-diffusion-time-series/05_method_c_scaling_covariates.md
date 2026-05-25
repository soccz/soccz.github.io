# 05c Scaling + Covariates — Section 3.3–3.4

paper p.4. 실용적 detail — scaling (varying magnitudes 처리) + covariates (categorical embedding + time features + lag).

---

## 5c.1 챕터 한 줄 요약

> **"Scaling: 각 entity 의 context window mean 으로 나누기 → varying magnitudes (Solar/Traffic 의 4 자릿수 차이) normalization. Covariates: time-dep (hour/day) + time-indep (categorical embedding) + lag features. 결합으로 RNN 입력 풍부 + 학습 안정."**

---

## 5c.2 Section 3.3 — Scaling

paper p.4:
> "In real-world data, the magnitudes of different time series entities can vary drastically. To normalize scales, we divide each time series entity by their context window mean (or 1 if it's zero) before feeding it into the model. At inference, the samples are then multiplied by the same mean values to match the original scale."

### Scaling 의 필요성

paper Fig 4 caption:
> "Note that neighboring entities have an order of magnitude difference in scales."

**예 — Traffic dataset**:
- 도로 A: 일평균 점유율 0.05 (5% 사용)
- 도로 B: 일평균 점유율 0.8 (80% 사용)
- 16배 차이 — 같은 모델 입력에 직접 넣으면 큰 값에 모델이 편향.

### Scaling 방법

```
1. Per-entity context mean: μ_i = mean(x^0_{i, 1:t₀-1})
2. Scale input: x̃^0_{i,t} = x^0_{i,t} / μ_i  (if μ_i = 0, use 1)
3. Train on x̃^0_t
4. Inference: predict x̃^0_t → multiply by μ_i to get x^0_t
```

paper:
> "This rescaling technique simplifies the problem for the model, which is reflected in significantly improved empirical performance as shown in (Salinas et al., 2019b)."

→ **DeepAR (Salinas 2019b)** 의 표준 trick.

### Short-cut 회피

paper:
> "The other method of a short-cut connection from the input to the output of the function approximator, as done in the multivariate point forecasting method LSTNet (Lai et al., 2018), is not applicable here."

**LSTNet (Lai 2018)** 의 trick: input → output 의 residual connection (linear) — point forecasting 에 효과적. **TimeGrad 에 안 맞음**: $\epsilon_\theta$ 의 output 은 noise prediction — input 시계열과 직접 연결 의미 없음.

---

## 5c.3 Section 3.4 — Covariates

paper p.4:
> "We employ embeddings for categorical features (Charrington, 2018), that allows for relationships within a category, or its context, to be captured when training time series models. Combining these embeddings as features for forecasting yields powerful models like the first prize winner of the Kaggle Taxi Trajectory Prediction¹ challenge (De Brébisson et al., 2015)."

### Covariate 의 3 종류

**1. Time-dependent embeddings**:
- Hour of day (0-23)
- Day of week (0-6)
- Day of month (1-31)
- Month of year (1-12)

→ 각각 learnable embedding vector. paper: 시계열 frequency 에 맞춰 자동 선택.

**2. Time-independent embeddings**:
- Categorical features (예: 도로 ID, 가구 ID).
- 본 paper 의 6 datasets 는 대부분 사용 안 함 (entity ID 가 단순 인덱스).

**3. Lag features**:
- $x^0_{t-1}, x^0_{t-7}, x^0_{t-24}, \ldots$ 같은 과거 시점 값 직접 입력.
- 시계열 frequency 에 따라 lag 선택 (daily: 1, 7, 14, 30; hourly: 1, 24, 168).

### Covariates 의 통합

paper:
> "The covariates $\mathbf{c}_t$ we use are composed of time-dependent (e.g. day of week, hour of day) and time-independent embeddings, if applicable, as well as lag features depending on the time frequency of the data set we are training on. All covariates are thus known for the periods we wish to forecast."

**Eq 9 의 RNN input**:
$$
\text{concat}(\mathbf{x}^0_t, \mathbf{c}_t)
$$

- $\mathbf{x}^0_t \in \mathbb{R}^D$ — observation
- $\mathbf{c}_t$ — covariates (time emb + lag features + ...)
- Concatenated vector → RNN input.

### "Known for all periods" 의 의미

**중요**: covariates $\mathbf{c}_{1:T}$ 가 **prediction window 에도 known**. 가능 이유:
- Time features (hour, day of week) — 미래 시점도 calendar 로 결정.
- Lag features — 단 lag ≥ prediction horizon 만 사용 (예: predict 24 steps → lag 24 이상 만 사용).

→ TimeGrad 가 미래 covariates 활용 가능 — autoregressive prediction 의 power.

---

## 5c.4 Kaggle Taxi 예시 (paper 인용)

paper footnote 1:
> "https://www.kaggle.com/c/pkdd-15-predict-taxi-service-trajectory-i"

**De Brébisson et al. (2015)** — Kaggle 1위 winner:
- Categorical embedding (taxi driver ID, call type) + time features → ANN.
- Embedding 의 forecasting 효과 입증.
- → TimeGrad 의 covariate design 의 영감.

---

## 5c.5 정리 — Section 3.3–3.4 의 3 trick

| Trick | 효과 | Source |
|-------|------|--------|
| **Per-entity scaling** | Varying magnitude 처리 | DeepAR (Salinas 2019b) |
| **Categorical embedding** | Entity ID / context 학습 | De Brébisson 2015 (Kaggle) |
| **Lag features** | Periodicity 직접 입력 | 시계열 표준 |

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Scaling 이 어떤 dataset 에서 가장 결정적?**
2. **LSTNet 의 short-cut connection 이 TimeGrad 에 안 맞는 이유?**
3. **Covariates 가 "known for all periods" 가정의 두 가지 종류는?**

### 답변

1. **Solar, Wind, Traffic 같은 varying scale 데이터**. Solar: 일조량 0 (밤) ~ 100 (정오) — 4 자릿수 차이. Traffic: 도로 점유율 0.01 ~ 0.99 — 100배 차이. Per-entity mean 으로 normalize 안 하면 RNN/Conv 가 큰 값 entity 에 편향. paper Table 1: Traffic 만 "Traffic 은 scale 필요 없음" 명시 — 이미 $[0,1]$ 범위.
2. **LSTNet 의 input→output residual**: point forecasting 에 효과적 — output 이 input 의 가까운 변형. **TimeGrad**: output 이 **noise prediction** ($\epsilon$) — input 시계열과 분포 완전 다름 ($\epsilon \sim \mathcal{N}(0, \mathbf{I})$). Residual connection 의 mismatched scale 가 학습 방해.
3. (a) **Time features (deterministic by calendar)**: hour of day, day of week, day of month 등 — 미래 시점도 정확히 알 수 있음. (b) **Lag features (with appropriate lag ≥ prediction horizon)**: 예측 horizon = 24 라면 lag 24 이상만 사용 — leakage 회피. **categorical embedding** 은 time-invariant 라 항상 known.

다음 [06_algorithms.md](06_algorithms.md) — Algorithm 1 (Training) + Algorithm 2 (Sampling via annealed Langevin).
