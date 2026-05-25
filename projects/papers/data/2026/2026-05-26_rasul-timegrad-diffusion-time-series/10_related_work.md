# 10 Related Work — Section 5

paper p.7-8. **5.1 Energy-Based Methods** + **5.2 Time Series Forecasting** — TimeGrad 의 학문적 lineage.

---

## 10.1 챕터 한 줄 요약

> **"5.1: EBM (Ho 2020 DDPM 기반) + Stein Score function (Hyvärinen 2005, Vincent 2011) + Langevin dynamics (Song-Ermon 2019, 2020). Concurrent: WaveGrad (Chen 2021), DiffWave (Kong 2021). EBM 의 OOD 우월성 (Du-Mordatch 2019, Nalisnick 2019). 5.2: classical (Hyndman) + univariate point (N-BEATS, Smyl) + univariate probabilistic (DeepAR) + multivariate (LSTNet, Li 2019) + Gaussian copula (Salinas 2019a) + GAN (Yoon 2019) + normalizing flow (de Bézenac 2020, Rasul 2021) + Bayesian (Zhu-Laptev 2018)."**

---

## 10.2 Section 5.1 — Energy-Based Methods

paper p.7:
> "The EBM of (Ho et al., 2020) that we adapt is based on methods that learn the gradient of the log-density with respect to the inputs, called Stein Score function (Hyvärinen, 2005; Vincent, 2011), and at inference time use this gradient estimate via Langevin dynamics to sample from the model of this complicated data distribution (Song & Ermon, 2019)."

### Stein Score function

**Stein Score** = $\nabla_x \log p(x)$.

**핵심 아이디어** (Hyvärinen 2005):
- 직접 $p(x)$ 학습 어려움 (normalizing constant $Z$ intractable).
- 대신 **score function** $\nabla_x \log p(x)$ 학습 — $Z$ 무관.
- Score matching (Hyvärinen 2005): $\frac{1}{2} \mathbb{E}_{p(x)}[\|s_\theta(x) - \nabla_x \log p(x)\|^2]$.

**Vincent (2011) Connection**: denoising autoencoder ↔ score matching equivalence. Noise 추가 + 복원 = score 학습.

**Song-Ermon (2019) NCSN**: noise conditional score network. Multiple noise scales (DDPM 의 forward process 와 등가).

### Diffusion Models 의 위치

paper:
> "These models achieve impressive results for image generation (Ho et al., 2020; Song & Ermon, 2020) when trained in an unsupervised fashion without requiring adversarial optimization. By perturbing the data using multiple noise scales, the learnt Score network captures both coarse and fine-grained data features."

**DDPM (Ho 2020) 의 image generation 성공**:
- CIFAR-10 / CelebA / LSUN 에서 BigGAN 같은 GAN 능가.
- Adversarial training 없이 stable.
- Multiple noise scales (coarse + fine) 학습 — 다양한 abstraction 동시.

### TimeGrad 와 가장 가까운 작업

paper:
> "The closest related work to TimeGrad is in the recent non-autoregressive conditional methods for high fidelity waveform generation (Chen et al., 2021; Kong et al., 2021)."

**WaveGrad (Chen 2021)** + **DiffWave (Kong 2021)**:
- Audio synthesis 의 conditional diffusion.
- Mel-spectrogram → waveform 생성.
- TimeGrad 의 **architecture inspiration** (Fig 2 의 8 residual blocks 가 DiffWave 직접 채택).

### Audio vs Time Series 차이

paper:
> "Although these methods learn the distribution of vector valued data via denoising diffusion methods, as done here, they do not consider its temporal development. Also neighboring dimensions of waveform data are highly correlated and have a uniform scale, which is not necessarily true for multivariate time series problems where neighboring entities occur arbitrarily (but in a fixed order) and can have different scales."

**Audio**:
- Single time series (univariate waveform).
- Neighboring samples 강한 상관 (sound wave continuity).
- Uniform scale (-1 ~ +1).

**Multivariate time series (TimeGrad task)**:
- Multiple time series (Wikipedia 2,000 entities).
- Neighboring entities **arbitrary order** (sortable but no inherent spatial structure).
- **Different scales** (Traffic 도로별 점유율 4 자릿수 차이).

→ TimeGrad 의 architectural design (scaling, ordering-agnostic Conv1d) 가 audio paper 와 차별.

### Du-Mordatch (2019) — EBM Advantage

paper:
> "(Du & Mordatch, 2019) also use EBMs to model one and multiple steps for a trajectory modeling task in an non-autoregressive fashion."

**Implicit Generation and Modeling with Energy-Based Models** (Du-Mordatch 2019):
- EBM 의 OOD detection 우월성.
- Trajectory modeling (multi-step).
- Non-autoregressive (TimeGrad 와 차이).

paper continuing:
> "As noted in (Du & Mordatch, 2019) EBMs exhibit better out-of-distribution (OOD) detection than other likelihood models. Such a task requires models to have a high likelihood on the data manifold and low at all other locations. Surprisingly (Nalisnick et al., 2019) showed that likelihood models, including flows, were assigning higher likelihoods to OOD data whereas EBMs do not suffer from this issue since they penalize high probability under the model but low probability under the data distribution explicitly. Future work could evaluate the usage of TimeGrad for anomaly detection tasks."

**Likelihood 모델의 OOD 문제**:
- Nalisnick 2019: normalizing flows 가 OOD data 에 **더 높은 likelihood** 부여 (counterintuitive).
- 이유: likelihood 모델 은 data manifold 가 아닌 위치도 학습.
- EBM은 다른 위치 explicit penalize → OOD 잘 분리.

**TimeGrad future work**: **anomaly detection**. 시계열의 OOD point (이상치) 자동 감지.

### Future Architectural Improvements

paper:
> "For long time sequences, one could replace the RNN with a Transformer architecture (Rasul et al., 2021) to provide better conditioning for the EBM emission head. Concurrently, since EBMs are not constrained by the form of their functional approximators, one natural way to improve the model would be to incorporate architectural choices that best encode the inductive bias of the problem being tackled, for example with graph neural networks (Niu et al., 2020) when the relationships between entities are known."

**Future 1**: **Transformer 로 RNN 교체** (Rasul 2021, Transformer-MAF 의 backbone). Long-range dependency 학습.

**Future 2**: **Graph Neural Networks** — entities 간 relationship 알려진 경우 (Niu 2020 의 score-based generative modeling on graphs).

---

## 10.3 Section 5.2 — Time Series Forecasting

paper p.8:
> "Neural time series methods have recently become popular ways of solving the prediction problem via univariate point forecasting methods (Oreshkin et al., 2020; Smyl, 2020) or univariate probabilistic methods (Salinas et al., 2019b)."

### Univariate Point Forecasting

| 모델 | 출처 | 핵심 |
|------|------|------|
| **N-BEATS** | Oreshkin 2020 | Basis expansion ANN |
| **ES-RNN** | Smyl 2020 | Exponential smoothing + RNN (M4 winner) |

→ Univariate + point prediction. 본 paper 와 다른 task.

### Univariate Probabilistic

| 모델 | 출처 | 핵심 |
|------|------|------|
| **DeepAR** | Salinas 2019b | RNN + Gaussian likelihood |

→ TimeGrad 의 baseline (univariate version 의 source).

### Multivariate Point Forecasting

paper:
> "In the multivariate setting we also have point forecasting methods (Lai et al., 2018; Li et al., 2019) as well as probabilistic methods, like this method, which explicitly model the data distribution using Gaussian copulas (Salinas et al., 2019a), GANs (Yoon et al., 2019), or normalizing flows (de Bézenac et al., 2020; Rasul et al., 2021)."

| 모델 | 출처 | 핵심 |
|------|------|------|
| **LSTNet** | Lai 2018 | CNN + RNN + skip connections |
| **LogTrans-like** | Li 2019 | Attention with locality + sparsity |

### Multivariate Probabilistic

| 모델 | 출처 | 핵심 |
|------|------|------|
| **GP-Copula** | Salinas 2019a | Gaussian Copula + low-rank Gaussian |
| **Vec-LSTM** | Salinas 2019a | RNN + low-rank Gaussian (Vec) |
| **TimeGAN** | Yoon 2019 | GAN for time series |
| **NKF** | de Bézenac 2020 | Normalizing flow + Kalman filter |
| **Transformer-MAF** | Rasul 2021 | Transformer + Masked Autoregressive Flow |

→ TimeGrad 의 모든 Table 2 baseline.

### Bayesian Neural Networks

paper:
> "Bayesian neural networks can also be used to provide epistemic uncertainty in forecasts as well as detect distributional shifts (Zhu & Laptev, 2018), although these methods often do not perform as well empirically (Wenzel et al., 2020)."

**Bayesian NN**:
- **Epistemic uncertainty**: model uncertainty (data 외).
- **Distributional shift detection**: OOD identification.
- 한계 (Wenzel 2020): "How good is the Bayes posterior in deep neural networks really?" — empirical 성능 부족.

→ TimeGrad 의 EBM 이 같은 task (OOD detection) 에 강함.

---

## 10.4 Lineage 정리

```
[ Score Matching ]
   Hyvärinen 2005 → Vincent 2011 (DAE)
        ↓
[ Energy-Based Models ]
   Hinton 2002 → LeCun 2006 → Du-Mordatch 2019 (OOD)
        ↓
[ Score-Based Generative Models ]
   Song-Ermon 2019 (NCSN) → Song-Ermon 2020 (improved)
        ↓
[ Denoising Diffusion ]
   Sohl-Dickstein 2015 → Ho 2020 (DDPM)
        ↓
   ┌────────────────────┐
   ↓                    ↓
[ Audio ]            [ Time Series ]
   WaveGrad (Chen 2021)   TimeGrad (이 paper, 2021)
   DiffWave (Kong 2021)
        ↓                    ↓
[ Image / Audio SOTA ]   [ Multivariate Probabilistic Forecasting SOTA ]
                              ↓
                         [ Future ]
                         CSDI (Tashiro 2021)
                         TMDM (Li 2024)
                         Diffusion-TS (Yuan 2024)
```

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **EBM 의 OOD detection 우월성 (Du-Mordatch 2019, Nalisnick 2019) 의 의미와 TimeGrad 의 future work?**
2. **WaveGrad/DiffWave (audio diffusion) vs TimeGrad (시계열 diffusion) 의 3가지 차이?**
3. **paper Section 5.2 의 multivariate probabilistic forecasting 6 가지 접근법과 각각의 한계?**

### 답변

1. **EBM 의 OOD 우월성**: likelihood models (flows) 는 OOD data 에 **더 높은 likelihood** 부여 (counterintuitive, Nalisnick 2019). EBM 은 explicit penalize → OOD low likelihood. **이유**: EBM 은 "data manifold + 그 외 low energy" 학습, likelihood 는 "data manifold + 어디든 high probability" 학습. **TimeGrad future work**: anomaly detection — 시계열의 outlier point 자동 감지. 본 paper future work 명시.
2. (a) **Univariate vs Multivariate**: Audio = single waveform (univariate). Time series (TimeGrad) = $D$ 차원 vector (Wikipedia D=2000). (b) **Neighboring correlation**: Audio = neighboring samples 강한 상관 (sound continuity). Time series = neighboring entities **arbitrary order** + 서로 다른 dynamics. (c) **Scale**: Audio = uniform [-1, +1]. Time series = entities 간 order-of-magnitude 차이 (Traffic 도로별). TimeGrad 의 scaling, ordering-agnostic Conv1d 가 audio paper 와 다른 architectural choice.
3. **(a) Gaussian Copula** (Salinas 2019a): low-rank Gaussian 한계 (second-order only). **(b) Vec-LSTM** (Salinas 2019a): 같은 low-rank 한계. **(c) TimeGAN** (Yoon 2019): GAN 의 학습 불안정 (mode collapse). **(d) NKF** (de Bézenac 2020): normalizing flow + Kalman — Jacobian determinant 제약. **(e) Transformer-MAF** (Rasul 2021): Transformer + MAF — flow 의 architectural 제약. **(f) Bayesian NN** (Zhu-Laptev 2018): empirical 성능 부족 (Wenzel 2020). **TimeGrad**: EBM의 functional form 자유 + diffusion 학습 안정 → 6 baseline 모두 능가 (Table 2).

다음 [11_conclusion.md](11_conclusion.md) — Section 6 (Conclusion + Future Work).
