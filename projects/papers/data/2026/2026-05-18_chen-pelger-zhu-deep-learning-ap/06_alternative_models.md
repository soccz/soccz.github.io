# 06. Alternative Models — Section I.C

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 비교한 4 alternative models — LS, EN, FFN, GAN
- 각 모델의 핵심 차이 (linear vs nonlinear, no-arb vs no-no-arb)
- 왜 이 4개로 비교했나

---

> Section I.C (paper p.11–13) — Linear (LS), Elastic Net (EN), FFN forecasting benchmark.

## 6.1 챕터 한 줄 요약

본 논문이 비교하는 3가지 benchmark:
- **LS**: Linear SDF + linear conditioning — 사실상 **characteristic-managed mean-variance optimization**.
- **EN**: LS + elastic net regularization — **Kozak, Nagel, Santosh (2020)** 와 매우 유사.
- **FFN**: Deep NN forecasting (no no-arbitrage) — **Gu, Kelly, Xiu (2020)** 의 best model.

→ GAN 만 비선형 + no-arbitrage + LSTM + adversarial 모두 갖춤.

---

## 6.2 LS — Linear Special Case

paper p.12 본문:
> "The second benchmark model assumes a linear structure in the factor portfolio weights $\omega_{t,i} = \theta^\top I_{t,i}$ and linear conditioning in the test assets:"

$$
\frac{1}{N} \sum_{j=1}^{N} \mathbb{E}\left[ \left( 1 - \frac{1}{N}\sum_{i=1}^{N} \theta^\top I_{t,i} R^e_{t+1,i} \right) R^e_{t+1,j} I_{t,j} \right] = 0
$$

⇔
$$
\mathbb{E}[(1 - \theta^\top \tilde F_{t+1}) \tilde F_{t+1}^\top] = 0
$$

where $\tilde F_{t+1} = \frac{1}{N}\sum_{i=1}^N I_{t,i} R^e_{t+1,i}$ — **q characteristic managed factors**.

### 🔣 4-단 기호 풀이 (LS)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\theta \in \mathbb{R}^q$ | 선형 가중치 | "재료별 일정한 비율" | $\omega = \theta^\top I_{t,i}$ (단순 곱) |
| $I_{t,i} \in \mathbb{R}^q$ | firm chars | "자산 i 의 46 특성" | $q = 46$ |
| $\tilde F_{t+1}$ | char-managed factor | "각 특성으로 weighted 한 portfolio 의 return" | $q$ 차원 vector |
| $\mathbb{E}[\tilde F \tilde F^\top]$ | factor second moment | "factor 간 같이 움직이는 정도" | $q \times q$ matrix |
| $\mathbb{E}[(1-\theta^\top \tilde F) \tilde F^\top] = 0$ | moment condition | "factor 와 SDF 가 직교" | $\theta$ 의 해는 closed form |

**🌱**: "**linear special case** — $\omega$ 가 char 의 단순 선형결합 → Markowitz tangency on factor space".

### 🆚 vs Kozak-Nagel-Santosh (2020)
- LS = KNS 의 simplest version. Cross-product 없음, ridge 없음, demean 없음.
- KNS 가 더 sophisticated 하지만 본질적으로 같은 linear factor model space.

### Solution (closed form)
$$
\theta = \mathbb{E}[\tilde F_{t+1} \tilde F_{t+1}^\top]^{-1} \mathbb{E}[\tilde F_{t+1}]
$$

→ **Tangency portfolio weights** on characteristic factors.

paper 본문:
> "We choose this specific linear version of the model as it maps directly into the linear approaches that have already been successfully used in the literature. This linear framework essentially captures the class of linear factor models."

---

## 6.3 EN — Elastic Net Regularization

paper p.20–21:
$$
\hat\theta_{EN} = \arg\min_\theta \frac{1}{T}\left\| \bar{\tilde F} - \widehat{\Sigma}_{\tilde F} \theta \right\|^2 + \lambda_2 \|\theta\|_2^2 + \lambda_1 \|\theta\|_1
$$

### 🔣 4-단 기호 풀이 (Elastic Net)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\bar{\tilde F}$ | factor 평균 | "각 factor 의 평균 수익률" | $\frac{1}{T}\sum_t \tilde F_t$ |
| $\widehat\Sigma_{\tilde F}$ | factor cov | "factor 간 같이 움직이는 정도 (sample)" | $\frac{1}{T}\sum_t \tilde F \tilde F^\top$ |
| $\lambda_2 \|\theta\|_2^2$ | ridge penalty | "weight 크기 제한 (smooth)" | overfit 방지 |
| $\lambda_1 \|\theta\|_1$ | lasso penalty | "weight = 0 강제 (sparse)" | 일부 factor 자동 선택 |
| $\lambda_1, \lambda_2$ | tuning params | "regularization 강도" | validation 으로 선택 |

**🌱**: "**LS + 두 종류 penalty** — overfit 방지 + sparse feature selection".

where $\bar{\tilde F} = \frac{1}{T}\sum_t \tilde F_{t+1}$, $\widehat{\Sigma}_{\tilde F} = \frac{1}{T}\sum_t \tilde F_{t+1} \tilde F^\top_{t+1}$.

**Elastic net**: ℓ1 (sparsity) + ℓ2 (small weights). Tuning $\lambda_1, \lambda_2$ on validation.

### EN ↔ Kozak-Nagel-Santosh (2020)

paper p.21 본문 + footnote 22:
> "The linear approach with elastic net is closely related to Kozak, Nagel, and Santosh (2020) who perform mean-variance optimization with an elastic net penalty on characteristic based factors."

paper footnote 22 (5가지 차이점):
1. KNS 는 modified ridge (Bayesian prior); 본 논문은 standard ridge.
2. KNS 는 cross-product (interaction) terms 도 포함; 본 논문은 미포함.
3. KNS 는 demeaned returns; 본 논문은 non-demeaned.
4. 본 논문은 long/short leg 별도 weights; KNS 는 equal absolute weights.
5. KNS 는 PCA 후 mean-variance; 본 논문 EN 은 raw factors 사용.

→ **EN ≈ KNS** 이지만 미세 차이.

---

## 6.4 FFN — Forecasting Benchmark (GKX 2020)

paper p.13:
$$
\hat\mu = \min_\mu \frac{1}{T}\sum_{t=1}^T \frac{1}{N_t} \sum_{i=1}^{N_t} \left( R^e_{t+1,i} - \mu(I_t, I_{t,i}) \right)^2
$$

**특징**:
- **Conditional mean 직접 추정** ($\mu_{t,i}$).
- **No-arbitrage condition 미사용**.
- **LSTM 미사용** — macro 는 raw 차분.
- **Adversarial 미사용**.

paper 본문:
> "We only include the best performing feedforward network from Gu, Kelly, and Xiu (2020)'s comparison study. Within their framework this model outperforms tree learning approaches and other linear and non-linear prediction models."

### β 추정 (FFN benchmark)
paper p.19:
> "At the same time $\hat\mu_{FFN}$ is proportional to the SDF factor portfolio weights and hence also serves as $\hat\omega_{FFN}$."

→ FFN 에서는 $\beta_{FFN} \propto \mu_{FFN}$ 사용 (Eq $R = \beta E[F]$ 의 비례).

---

## 6.5 SDF 와 β 의 model-specific 정의

paper p.19:

| 모델 | $\omega$ (SDF weights) | $\beta$ (loadings) |
|------|----------------------|-------------------|
| **GAN** | FFN+LSTM 으로 학습 | $\mathbb{E}[F R^e]$ 를 별도 FFN 으로 추정 |
| **FFN** | $\hat\omega_{FFN} = \hat\mu_{FFN}$ | $\hat\beta_{FFN} = \hat\mu_{FFN}$ (비례) |
| **EN** | $\hat\omega_{EN} = \hat\theta_{EN}^\top I_{t,i}$ | $\mathbb{E}[F R^e]$ 의 elastic net regression |
| **LS** | $\hat\omega_{LS} = \hat\theta_{LS}^\top I_{t,i}$ | $\mathbb{E}[F R^e]$ 의 OLS regression |

---

## 6.6 4가지 모델의 1차 비교

| Feature | LS | EN | FFN | GAN |
|---------|-----|------|------|------|
| 함수형 | 선형 | 선형 + sparsity | 비선형 (deep NN) | 비선형 (deep NN) |
| No-arbitrage loss | ✓ | ✓ | ✗ (mean MSE) | ✓ |
| Macro 처리 | raw 차분 | raw 차분 | raw 차분 | **LSTM hidden states** |
| Conditioning $g$ | 선형 | 선형 + EN | 미사용 | **Adversarial FFN** |
| Regularization | 없음 | Elastic net | Dropout | Dropout |
| Ensemble | — | — | 9 (seeds) | 9 (seeds) |
| 학계 위치 | naive | ≈ KNS (2020) | GKX (2020) | 본 논문 |

→ **GAN 만 4-element 모두**. LS, EN, FFN 각각 한 element 만 갖춤.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. LS 의 closed-form solution 이 mean-variance tangency portfolio 인 이유?
2. EN 과 KNS (2020) 의 핵심 차이?
3. FFN benchmark 가 GKX (2020) 의 best model 인 이유?

### 답변
1. LS 의 FOC: $\mathbb{E}[(1 - \theta^\top \tilde F) \tilde F^\top] = 0$ ⇔ $\theta = (\mathbb{E}[\tilde F \tilde F^\top])^{-1} \mathbb{E}[\tilde F]$. 이는 정확히 **conditional MVE portfolio weights** on $\tilde F$ — second moment matrix 역행렬 × first moment. Markowitz tangency portfolio formula.
2. **(1) Ridge form**: KNS 는 Bayesian prior 기반 modified ridge; 본 논문은 standard ridge. **(2) Interaction**: KNS 는 cross-product terms 포함; 본 논문 EN 은 raw factors only. **(3) Demeaning**: KNS demeaned; 본 논문 non-demeaned (paper footnote 22 의 5가지 차이 중 핵심).
3. paper 인용: "the best performing feedforward network from Gu, Kelly, and Xiu (2020)'s comparison study. Within their framework this model outperforms tree learning approaches and other linear and non-linear prediction models." — GKX (2020) 가 RF, XGBoost 등을 모두 비교 후 FFN 이 최우수라고 결론. 본 논문은 그 FFN 의 architecture (hyperparameter 포함) 를 그대로 채택.

---

## 6.7 4 모델의 Test SR 분해 — 각 element 의 효과 (Table I 기반)

paper Table I 의 Test SR:
- LS 0.42 → EN 0.50 → FFN 0.44 → GAN 0.75.

### Element 별 기여 분해

| 변화 | SR 효과 | 의미 |
|------|---------|------|
| LS → EN | +0.08 (+19%) | **L1/L2 정규화** 효과 (selection + shrinkage) |
| EN → FFN | -0.06 (-12%) | Linear → Nonlinear 하지만 no-arb 잃음 = **net 손해** |
| EN → GAN | +0.25 (+50%) | Linear → Nonlinear + adversarial + LSTM (모두 추가) |
| FFN → GAN | +0.31 (+70%) | No-arb + adversarial + LSTM 추가 효과 |

→ **No-arbitrage 가 가장 큰 contribution** (EN → FFN 의 음의 효과, FFN → GAN 의 큰 양의 효과).

### 4 element 의 ablation (paper Fig 6 + Table I)

| Setting | Components | Test SR |
|---------|-----------|---------|
| LS (no macro) | linear + no-arb (only chars) | 0.42 |
| EN (no macro) | + L1/L2 | 0.50 |
| FFN (no macro) | + nonlinear (but no no-arb) | 0.44 |
| GAN (no macro) | + adversarial + no-arb + nonlinear | ~0.65 |
| GAN (full) | + LSTM macro | 0.75 |
| GAN (all macro raw) | + macro raw (no LSTM) | collapse (~0.10) |
| UNC (no adv) | LSTM + no-arb but g=const | ~0.55 |

### 결론

**4 element 가 모두 필요**:
1. Nonlinear (FFN) — without 시 EN 보다 0.50 → ~0.40 정도.
2. No-arbitrage — without 시 FFN 의 0.44 정도.
3. Adversarial — without 시 UNC 의 0.55 정도.
4. LSTM macro — without 시 0.65 정도.

→ **GAN 0.75** 는 4 element 의 **곱적 효과**.
