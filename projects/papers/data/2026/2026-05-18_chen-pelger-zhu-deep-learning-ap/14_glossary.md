# 14. 용어 사전 (Glossary)

> 본 논문에서 자주 등장하는 **용어** 와 **수식 기호** 의 정의 모음.

## 14.1 자산가격결정 (Asset Pricing) 용어

### Stochastic Discount Factor (SDF, $M$)
- **정의**: 모든 자산의 가격을 결정하는 universal discount factor.
- **기본 조건**: $\mathbb{E}_t[M_{t+1} R^e_{t+1,i}] = 0$ (모든 $i$).
- **본 논문**: $M_{t+1} = 1 - \omega_t^\top R^e_{t+1}$ — SDF 가 자산 portfolio 의 affine 함수.

### No-Arbitrage
- **정의**: 위험 없는 초과수익 없음. 동등하게: strictly positive SDF 존재.
- **본 논문 implication**: pricing error α = 0 for all assets (with appropriate conditioning).

### Tangency Portfolio (Mean-Variance Efficient)
- **정의**: 위험 단위당 초과수익 최대화 portfolio.
- **본 논문**: $F_{t+1} = \omega_t^\top R^e_{t+1}$ — SDF 의 factor 표현. tangency portfolio 와 동일.

### Conditional vs Unconditional
- **Conditional**: $\mathbb{E}_t[\cdot]$ — 시점 $t$ 정보 conditional.
- **Unconditional**: $\mathbb{E}[\cdot]$ — full sample.
- 본 논문: conditional moments (Eq 2) 가 핵심.

### Excess Return ($R^e$)
- **정의**: $R^e_{t+1,i} = R_{t+1,i} - R^f_{t+1}$. 무위험 수익 제외.

### β (Risk Loading / Exposure)
- **정의**: SDF factor 에 대한 자산의 노출. $\mathrm{Cov}(R^e, F) / \mathrm{Var}(F)$.
- **One-factor form**: $R^e_i = \beta_i F + \epsilon_i$.

### α (Pricing Error)
- **정의**: 모델이 설명 못 하는 평균 수익. $\alpha_i = \mathbb{E}[R^e_i] - \beta_i \mathbb{E}[F]$.
- **No-arbitrage**: 모든 α = 0.

### Risk Premium
- **정의**: 위험 노출의 보상 = $\beta \times \lambda$ (where $\lambda = \mathbb{E}[F]$).

---

## 14.2 GMM 및 계량경제학 용어

### Moment Condition
- **정의**: $\mathbb{E}[m(\theta, X)] = 0$ — 모수 $\theta$ 의 추정 조건.
- **본 논문**: $\mathbb{E}[M R^e g(I)] = 0$ for any $g$ — 무한 family.

### Conditioning Function ($g$)
- **정의**: instrumented test asset 의 weight function.
- **본 논문**: $g : \mathbb{R}^p \times \mathbb{R}^q \to \mathbb{R}^D$. $D = 8$ instruments.

### Adversarial Estimation
- **정의**: min-max 추정. 가장 mispriced 한 test asset 으로 학습.
- **본 논문 기원**: Hansen-Jagannathan (1997).

### Minimax (Saddle Point)
- **정의**: $\min_\omega \max_g L(\omega, g)$ — zero-sum 게임.
- **본 논문**: SDF vs adversary.

### Test Assets
- **정의**: 모델을 평가하는 portfolio 들.
- **본 논문**: $R^e \cdot g(I)$ — instrumented stocks. $N \times D$ 개.

---

## 14.3 머신러닝 (ML) 용어

### Feedforward Network (FFN)
- **정의**: 입력 → 다층 hidden → 출력의 일방향 신경망.
- **본 논문**: 4가지 활용 (ω, g, μ, β).

### Recurrent Neural Network (RNN)
- **정의**: 시간 dimension 이 있는 NN. 이전 hidden state → 현재 state.

### LSTM (Long Short-Term Memory)
- **정의**: gate 구조의 RNN. long-range dependency 학습.
- **3 gates**: input, forget, output.
- **본 논문 활용**: 178 macro 시계열 → 4 hidden state.

### Generative Adversarial Network (GAN)
- **정의**: Generator vs Discriminator 의 minimax 게임 (Goodfellow 2014).
- **본 논문 응용**: SDF network vs Conditional network.

### ReLU (Rectified Linear Unit)
- **정의**: $\max(x, 0)$.
- **장점**: gradient 안 사라짐, 빠른 계산.

### Dropout
- **정의**: 학습 중 hidden neuron 일부를 randomly 0 으로.
- **효과**: Implicit ensemble + overfit 방지.

### Adam Optimizer
- **정의**: Adaptive learning rate SGD.
- **default**: $\beta_1=0.9, \beta_2=0.999, \epsilon=10^{-8}$.

### Ensemble Averaging
- **정의**: 다른 seed 의 N 개 model 평균.
- **본 논문**: 9 ensembles.

---

## 14.4 본 논문 특수 용어

### SDF Network
- **정의**: $\omega_{t,i}$ 학습 신경망. FFN + LSTM.

### Conditional Network / Adversary
- **정의**: $g(I_t, I_{t,i})$ 학습 신경망. FFN + LSTM. SDF 의 약점 발견.

### Macroeconomic State / Hidden State ($h_t$)
- **정의**: LSTM 의 output. 4 차원 vector.
- **의미**: 178 macro 시계열의 dynamic 압축.

### Characteristic Managed Portfolio
- **정의**: $\tilde F = \frac{1}{N}\sum_i I_{t,i} R^e_{t+1,i}$ — 특성 quantile 가중 long-short.
- **참고**: Kelly-Pruitt-Su (2019), Kozak-Nagel-Santosh (2020).

### 4 Models (LS, EN, FFN, GAN)
- **LS**: Linear special case (선형 SDF + linear conditioning).
- **EN**: LS + Elastic Net regularization (≈ KNS 2020).
- **FFN**: Forecasting benchmark (Gu-Kelly-Xiu 2020).
- **GAN**: 본 논문 의 full model.

---

## 14.5 평가 지표 (Section II.F)

### Sharpe Ratio (SR)
$$
\mathrm{SR} = \mathbb{E}[F] / \sqrt{\mathrm{Var}(F)}
$$
SDF portfolio 의 위험 단위당 초과수익.

### Explained Variation (EV)
$$
\mathrm{EV} = 1 - \frac{\sum (\hat\epsilon)^2}{\sum (R^e)^2}
$$
시계열 R² (non-demeaned, KPS 2019 convention).

### Cross-Sectional R² (XS-R²)
$$
\mathrm{XS\text{-}R}^2 = 1 - \frac{\sum_i \frac{T_i}{T} \bar\epsilon_i^2}{\sum_i \frac{T_i}{T} \bar R^e_i^2}
$$
횡단면 mean R² (unbalanced weighting).

---

## 14.6 수식 기호 사전

| 기호 | 차원 | 의미 |
|------|------|------|
| $R_{t+1,i}$ | 스칼라 | 자산 $i$ 의 시점 $t+1$ raw return |
| $R^e_{t+1,i}$ | 스칼라 | 자산 $i$ 의 excess return |
| $R^f_{t+1}$ | 스칼라 | risk-free rate |
| $M_{t+1}$ | 스칼라 | SDF |
| $\omega_t$ | $N \times 1$ | SDF portfolio weights |
| $F_{t+1}$ | 스칼라 | tangency factor = $\omega^\top R^e$ |
| $\beta_{t,i}$ | 스칼라 | risk loading |
| $\alpha_i$ | 스칼라 | pricing error |
| $I_t$ | $p \times 1$ | macroeconomic conditioning (178 dim, raw) |
| $I_{t,i}$ | $q \times 1$ | firm-specific characteristics (46 dim) |
| $g(I_t, I_{t,i})$ | $D \times 1$ | conditioning function (8 instruments) |
| $\tilde F_{t+1}$ | $q \times 1$ | characteristic managed factors |
| $h_t$ | $K_h \times 1$ | LSTM hidden states (SDF network, $K_h=4$) |
| $h^g_t$ | $K_h \times 1$ | LSTM hidden states (Conditional network) |
| $x^{(l)}$ | $K^{(l)} \times 1$ | FFN layer $l$ output |
| $W^{(l)}, w_0^{(l)}$ | matrix, vector | layer $l$ weights, bias |
| $\sigma, \mathrm{ReLU}, \tanh$ | — | activation functions |
| $N$ | — | total stocks (≈ 10,000) |
| $T_i$ | — | 자산 $i$ 관측 시점 수 |
| $T$ | — | total time periods |
| $p$ | — | macro 변수 수 (178) |
| $q$ | — | firm chars 수 (46) |
| $D$ | — | conditioning instruments 수 (8) |
| $K_h$ | — | LSTM hidden state dim (4) |

---

## 14.7 자주 헷갈리는 점

### 1. $g$ (conditioning) vs $h$ (hidden states)
- **$g$**: instrumented test asset 의 weight function. $D=8$ dim.
- **$h$**: macroeconomic state. $K_h=4$ dim. **다른 quantity**.
- 둘 다 LSTM 의 output 일 수 있지만, **다른 LSTM**.

### 2. SDF network vs Conditional network
- 둘 다 같은 architecture (LSTM + FFN). 그러나 **별도 모델**, 별도 weights.

### 3. EV vs XS-R² vs SR
- **EV**: 시계열 변동 설명. KPS (2019) convention (non-demeaned).
- **XS-R²**: 횡단면 mean 설명. 자산가격결정의 본질.
- **SR**: 운용 효율. SDF portfolio 자체의 위험·수익.
- **세 지표 모두 좋아야** 진짜 모델.

### 4. GAN training 의 3 steps
- Step 1: $\omega$ 최소화 with $g=1$.
- Step 2: 그 $\omega$ 고정 → $g$ 최대화.
- Step 3: 그 $g$ 고정 → $\omega$ 최소화.
- **3 step 만으로 수렴** (paper Internet Appendix Fig IA.1).

### 5. SR (월간) vs SR (연간)
- Paper Table I 는 **월간 SR** 보고 (예: GAN 0.75).
- Paper 본문은 **연간 SR** 보고 (예: GAN 2.6).
- 환산: 연간 = 월간 × √12.
- 0.75 × √12 = 0.75 × 3.46 ≈ 2.6 ✓.

### 6. EV vs Time-series R²
- 일반 R² = $1 - SSE/SST$ (demeaned).
- 본 paper EV = $1 - \frac{\sum \hat\epsilon^2}{\sum (R^e)^2}$ (**non-demeaned**, KPS 2019 convention).
- 이유: $R^e$ 의 mean 추정이 noisy → demean 하면 noise 추가.
- → EV 가 일반 R² 보다 약간 보수적 (낮음).

### 7. 46 chars vs 178 macro
- **46 chars**: firm-specific (size, value, momentum 등). $I_{t,i}$.
- **178 macro**: economy-wide (inflation, GDP, federal funds 등). $I_t$.
- 둘이 다른 dimension — 46 = cross-section, 178 = time series.

### 8. ω (SDF weights) vs β (loadings)
- **ω**: SDF portfolio 의 weights ($M = 1 - \omega^\top R^e$).
- **β**: 자산이 SDF factor 에 노출되는 정도 ($R^e = \beta F + \epsilon$).
- 관계: $\omega \propto$ tangency portfolio, $\beta = \text{Cov}(R^e, F)/\text{Var}(F)$.
- 두 quantity 가 dual — 어느 하나 알면 다른 것 derive 가능.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. SDF 와 tangency factor $F$ 의 관계?
2. GAN 의 SDF network 와 Conditional network 의 architecture 차이?
3. EV 와 XS-R² 의 핵심 차이 (한 문장)?

### 답변
1. **동등** (up to affine transformation). $M_{t+1} = 1 - \omega^\top R^e$ and $F_{t+1} = \omega^\top R^e$ 이므로 $M = 1 - F$. SDF 추정 = tangency portfolio 추정 = mean-variance optimization. Cochrane (2003) 의 표준 normalization.
2. **같은 architecture** (FFN + LSTM) 지만 **다른 weights**. SDF network 의 LSTM ≠ Conditional network 의 LSTM (다른 hidden states $h_t \neq h^g_t$). 다른 objective: SDF 는 pricing error 최소화, Conditional 은 최대화.
3. **EV**: 시계열 변동 설명 (분산 기반, second moment). **XS-R²**: 횡단면 평균 설명 (mean 기반, first moment). 자산가격결정의 본질은 mean — XS-R² 가 더 핵심.
