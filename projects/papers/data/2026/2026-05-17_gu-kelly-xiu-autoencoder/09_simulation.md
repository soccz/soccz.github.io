# 09. Monte Carlo 시뮬레이션 — 실증 결과의 인과적 검증

> **🧒 한 줄 요약**: Synthetic data simulation. Method validation. Convergence study.


> Section 4 (journal p.444–446) — Table 6.

## 9.1 챕터 한 줄 요약

진짜 DGP (data-generating process) 를 통제한 시뮬레이션에서:
- **(a) Linear DGP**: IPCA 가 최상 (Total R² 40.7, K=3). CA0–CA3 도 비슷하지만 약간 손해 — NN 의 추가 자유도가 noise 학습 위험.
- **(b) Nonlinear DGP**: CA1, CA2 가 IPCA 압도 (Total R² ≈ 31 vs IPCA 11.9, K=3). → **실증 데이터에서 CA1+ > IPCA 의 격차가 nonlinearity 의 진짜 신호** 임을 인과적으로 검증.

---

## 9.2 시뮬레이션 Setup (paper Section 4)

### 9.2.1 모델 형태 (journal p.444)

$$
r_{i,t} = \beta_{i,t-1}' f_t + \varepsilon_{i,t}, \quad \beta_{i,t-1} = g^*(c_{i,t-1}; \theta), \quad f_t = W x_t + \eta_t
$$

| 객체 | 차원 | 의미 |
|------|------|------|
| $r_{i,t}$ | 스칼라 | 자산 $i$ 의 시점 $t$ 초과 수익 |
| $\beta_{i,t-1}$ | $K \times 1$ | 노출도 |
| $f_t$ | $K \times 1$ | 잠재 요인 |
| $c_{i,t-1}$ | $P_c \times 1$ | 자산 특성 |
| $x_t$ | $P_x \times 1$ | factor component |
| $W$ | $K \times P_x$ | factor weighting |
| $\eta_t$ | $K \times 1$ | factor 잡음 |
| $\varepsilon_{i,t}$ | 스칼라 | 자산 잡음 |

### 9.2.2 분포 (Distribution)

paper 본문 (896–897):
$$
x_t \sim \mathcal{N}(0.03,\, 0.1^2 \cdot I_{P_x}), \quad \eta_t \sim \mathcal{N}(0,\, 0.01^2 \cdot I_3), \quad \varepsilon_{i,t} \sim t_5(0,\, 0.1^2)
$$

**주의**: $\varepsilon_{i,t} \sim t_5$ — **Student-t with 5 degrees of freedom**. heavy-tail 잡음으로 실제 주식 수익률의 leptokurtosis 흉내.

paper 본문: "in which their variances are calibrated so that the **average time series R² is about 45%** and the **average annualized volatility is around 60%**."

### 9.2.3 특성 동학 (Characteristic Dynamics) — Eq. 22

paper 본문 (900):
$$
c_{ij,t} = \frac{2}{n+1}\,\text{rank}(\bar c_{ij,t}) - 1, \quad \bar c_{ij,t} = \rho_j \bar c_{ij,t-1} + \epsilon_{ij,t}
$$

| 모수 | 의미 |
|------|------|
| $\rho_j \sim U[0.9, 1]$ | persistence (시계열 자기상관 큼) |
| $\epsilon_{ij,t} \sim \mathcal{N}(0, 1)$ | 잡음 |
| rank | 매월 cross-sectional 순위 |
| 정규화 | $c \in [-1, 1]$ 균등 분포 |

→ 실증 데이터의 cross-sectional rank normalization (Section 6.2.3) 흉내.

### 9.2.4 차원

paper Table 6 note:
- **N = 200** (자산 수)
- **T = 180** (시점 수)
- **$P_c = P_x = 50$** (특성 수)
- **K = 3** (요인 수)
- **100 Monte Carlo 반복**

→ 실증 (N≈6,200, T=720, P=94) 보다 훨씬 작은 sample 로 finite sample property 강조.

### 9.2.5 분할 (Training / Validation / Test)

paper 본문 (973–977):
> "For each Monte Carlo sample, we divide the whole time series into 3 consecutive subsamples of equal length for training, validation, and testing, respectively."

→ T=180 을 60/60/60 으로 균등 분할.

PCA, IPCA 는 hyperparameter 없으므로 train + val 통합.

---

## 9.3 두 DGP — Linear vs Nonlinear

paper 본문 (904–914):

### DGP (a) — Linear, Sparse

$$
g^*(c_{i,t}; \theta) = (1.2 \times 2\, c_{i1,t},\; c_{i2,t},\; 0.8 \times c_{i3,t})'
$$

**해석**: $\beta$ 가 3개 특성 ($c_{i1}, c_{i2}, c_{i3}$) 의 **선형 함수**. 50 개 특성 중 3 개만 비영 (sparse).
- 첫 요인 노출: $\beta_1 = 2.4\, c_{i1}$
- 둘째 요인 노출: $\beta_2 = c_{i2}$
- 셋째 요인 노출: $\beta_3 = 0.8\, c_{i3}$

### DGP (b) — Nonlinear, Sparse with Interaction

$$
g^*(c_{i,t}; \theta) = \left(c_{i1,t},\; 2\,(c_{i1,t} \times c_{i2,t}),\; 0.6 \times \mathrm{sgn}(c_{i3,t})\right)'
$$

**해석**: 같은 3 개 특성을 쓰지만 **비선형**:
- 첫 요인 노출: $\beta_1 = c_{i1}$ (선형)
- 둘째 요인 노출: $\beta_2 = 2 \cdot c_{i1} \times c_{i2}$ — **interaction term** (두 특성의 곱)
- 셋째 요인 노출: $\beta_3 = 0.6 \cdot \mathrm{sgn}(c_{i3})$ — **sign function** (불연속 dummy)

paper 본문 (968–972):
> "We calibrate the values of $\theta_0$ such that the total R² is around 40%, and the predictive R² is 5%."

---

## 9.4 Table 6 — 결과 (journal p.446)

### Model (a) — Linear DGP

| Model | K=1 | K=2 | K=3 | K=4 | K=5 | K=6 |
|-------|-----|-----|-----|-----|-----|-----|
| **Total R²** | | | | | | |
| PCA | 3.5 | 4.7 | 5.5 | 6.3 | 7.1 | 7.8 |
| IPCA | 18.6 | 32.2 | **40.7** | 41.0 | 41.4 | 41.7 |
| CA0 | 15.6 | 26.7 | 33.7 | 33.5 | 33.4 | 33.2 |
| CA1 | 17.6 | 30.3 | 38.1 | 37.7 | 37.3 | 37.1 |
| CA2 | 17.7 | 29.2 | 36.8 | 36.5 | 36.3 | 35.9 |
| CA3 | 17.6 | 25.6 | 30.0 | 29.5 | 26.3 | 23.4 |
| **Pred R²** | | | | | | |
| PCA | 0.17 | 0.10 | 0.04 | 0.01 | −0.01 | −0.03 |
| IPCA | 2.20 | 2.93 | **3.33** | 3.32 | 3.32 | 3.32 |
| CA0 | 2.04 | 2.84 | 3.17 | 3.14 | 3.12 | 3.13 |
| CA1 | 2.11 | 2.93 | 3.27 | 3.29 | 3.26 | 3.26 |
| CA2 | 2.10 | 2.85 | 3.22 | 3.22 | 3.23 | 3.22 |
| CA3 | 2.06 | 2.57 | 2.89 | 2.86 | 2.58 | 2.39 |

**관찰 (DGP a)**:
- **K=3 (true K)** 에서 IPCA Total R² = 40.7 (최대), CA1 = 38.1, CA0 = 33.7, CA3 = 30.0.
- **IPCA 가 1위** — DGP 가 진짜 선형이므로 선형 모델이 최적.
- **CA1 이 IPCA 에 가장 근접** — CA0 가 약간 더 나쁜 이유: SGD 학습 + LASSO 정규화가 IPCA 의 alternating least squares 보다 noisy.
- **CA3 (3 hidden layers) 가 K 증가에서 악화** — overfit. NN 깊이가 진짜 함수 (선형) 보다 자유로워 잡음 학습.

### Model (b) — Nonlinear DGP

| Model | K=1 | K=2 | K=3 | K=4 | K=5 | K=6 |
|-------|-----|-----|-----|-----|-----|-----|
| **Total R²** | | | | | | |
| PCA | 3.4 | 5.1 | 6.0 | 6.6 | 7.3 | 7.9 |
| IPCA | 11.0 | 11.4 | **11.9** | 12.3 | 12.7 | 13.1 |
| CA0 | 8.5 | 8.2 | 7.9 | 7.6 | 7.4 | 7.2 |
| CA1 | 15.0 | 24.6 | **31.8** | 32.0 | 31.9 | 31.8 |
| CA2 | 15.7 | 23.5 | 30.9 | 31.8 | 30.2 | 28.2 |
| CA3 | 15.9 | 15.6 | 14.6 | 14.0 | 11.2 | 9.2 |
| **Pred R²** | | | | | | |
| PCA | 0.15 | 0.19 | 0.15 | 0.12 | 0.10 | 0.09 |
| IPCA | 0.84 | 0.82 | **0.81** | 0.80 | 0.79 | 0.79 |
| CA0 | 0.80 | 0.76 | 0.77 | 0.76 | 0.72 | 0.70 |
| CA1 | 1.83 | 2.31 | **2.70** | 2.70 | 2.71 | 2.73 |
| CA2 | 1.95 | 2.24 | 2.73 | 2.80 | 2.69 | 2.53 |
| CA3 | 1.77 | 1.43 | 1.32 | 1.26 | 1.06 | 0.86 |

**관찰 (DGP b)**:
- **K=3 (true K)** 에서 CA1 Total R² = 31.8 vs IPCA 11.9 — **2.7배 격차**.
- **CA1 Pred R² = 2.70 vs IPCA 0.81 — 3.3배 격차**.
- 비선형 (interaction + sign) 효과를 **IPCA 가 못 잡고 CA1 이 잘 잡음**.
- **CA1 과 CA2 가 거의 동등** — 1-hidden-layer NN 으로 충분.
- **CA3 가 K 증가에서 악화** — 너무 깊은 NN 이 finite sample 에서 손해.

paper 본문 (979–984):
> "For model (a), IPCA delivers the best OOS total and predictive R² s. This is not surprising given that the true model is sparse and linear in the input covariates. More advanced methods such as CA1, CA2 and CA3 tend to overfit ... By contrast, for model (b), these methods clearly beat IPCA, because the latter cannot capture the nonlinearity in the model."

```viz:autoencoder-sim-table6:title=paper Table 6 — Monte Carlo Linear vs Nonlinear DGP (interactive),caption=DGP 토글 (a Linear / b Nonlinear) + Metric 토글 (Total / Predictive). Linear 에서는 IPCA 가 약간 우위 (Total 40.7 K=3) — CA1+ 가 과적합 손해. Nonlinear 에서 CA1/CA2 가 IPCA 압도 (Total 31.8 vs 11.9, K=3, 약 2.7×). **실증의 CA > IPCA 격차가 진짜 비선형 신호** 임을 인과적으로 검증.
```

---

## 9.5 두 DGP 의 통찰

```
[ DGP (a): Linear True Model ]                [ DGP (b): Nonlinear True Model ]
                                                                              
   K=3:  IPCA 40.7 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        K=3:  IPCA 11.9 ▓▓▓▓▓▓     
         CA1  38.1 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                CA1  31.8 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
         CA2  36.8 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                 CA2  30.9 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 
         CA0  33.7 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    CA3  14.6 ▓▓▓▓▓▓▓▓        
         CA3  30.0 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                       CA0   7.9 ▓▓▓▓             
         PCA   5.5 ▓▓                                   PCA   6.0 ▓▓▓              
                                                                              
   → 선형이 진짜 → IPCA 우위               → 비선형이 진짜 → CA1+ 압도          
                                                                              
   CA1+ 의 overfit 손실은 작음              CA1 의 IPCA 대비 격차 ≈ 2.7배       
```

---

## 9.6 시뮬레이션의 의의

### (1) Identification 의 직접 검증

실제 데이터에서는 진짜 DGP 를 모름. 시뮬레이션은:
- DGP 를 통제 → 모델이 진짜 함수를 recover 하는지 확인.
- → IPCA 의 선형 가정이 **언제** 무너지는지 명확히 입증.

### (2) Overfit vs Genuine Signal

실증 데이터에서 CA1+ > IPCA 차이가 **단순 overfit** 일 수 있음 (NN 이 잡음 학습). 시뮬레이션:
- **Linear DGP**: CA1 ≈ IPCA (격차 작음) → CA1+ 가 overfit 만의 효과는 없음.
- **Nonlinear DGP**: CA1 ≫ IPCA → 진짜 비선형 신호 회복.
- → 실증의 CA1+ > IPCA 격차가 **데이터의 진짜 비선형성** 입증.

### (3) Architecture 의 finite-sample 한계

paper 본문 (983–985):
> "The comparison among autoencoder models demonstrates a stark trade-off between model flexibility and implementation difficulty. As shown in the table, **shallower conditional autoencoders tend to outperform** in our simulation setting, which is consistent with our findings in empirical analysis."

→ **CA1 ≈ CA2 가 sweet spot**. CA3 는 N=200 같은 작은 sample 에서 overfit. 실증 (N≈6,200) 에서도 CA2 가 best (Table 3).

---

## 9.7 시뮬레이션의 한계

본 시뮬레이션은 인위적 DGP — 실제 시장의 모든 복잡성 미반영:

1. **xt 와 ε 의 분포 가정**: 정규 / Student-t 단순화. 실제는 regime shift, jump 등.
2. **시간 불변 W, $\theta$**: 실제는 시점에 따라 변동.
3. **iid 잔차 가정**: 실제는 cross-sectional, 시계열 상관 있음.
4. **fixed N, T**: 실제는 매월 N 변동.

→ 이는 본 논문 이후 후속 연구 (heteroskedasticity, transaction cost, time-varying factor variance) 에서 확장.

---

## 9.8 정리

```
┌────────────────────────────────────────────────────────┐
│ 시뮬레이션의 두 가지 메시지                                  │
│                                                        │
│ 1. Linear DGP (a):                                     │
│    IPCA ≥ CA1 ≈ CA2 > CA0 > CA3                        │
│    → DGP 가 진짜 선형이면 선형 IPCA 가 최적                  │
│    → CA1 이 IPCA 와 거의 동등 (Prop 2 의 실증 + 약간의 학습 cost)│
│    → CA3 는 너무 자유로워 overfit                         │
│                                                        │
│ 2. Nonlinear DGP (b):                                  │
│    CA1 ≈ CA2 ≫ IPCA ≫ CA0 ≈ CA3                        │
│    → 선형 모델 (IPCA, CA0) 이 비선형 못 잡음                │
│    → CA1 이 격차 회복 (≈ 2.7배 Total R²)                   │
│    → CA3 도 깊이 비용으로 손해                              │
│                                                        │
│ ⇒ 실증의 CA1+ > IPCA 는 진짜 비선형 신호                    │
│   "CA1 ≈ CA2 가 sweet spot"                            │
└────────────────────────────────────────────────────────┘
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. DGP (a) Linear 에서 IPCA 가 CA1 보다 약간 좋은 이유는?
2. DGP (b) Nonlinear 에서 CA1 이 IPCA 의 2.7배 Total R² 를 얻는 이유는?
3. CA3 가 두 DGP 모두에서 CA1 / CA2 보다 나쁜 이유는?

### 답변
1. (a) DGP 가 진짜 선형이면 IPCA 의 alternating least squares 가 closed-form 에 가까워 효율적. (b) NN 의 추가 자유도 (활성화, 가중치 sparsity) 가 finite sample 에서 약간의 추정 잡음을 더함. (c) 그래도 격차는 작음 (40.7 vs 38.1, Prop 2 의 약한 형태).
2. (a) DGP (b) 의 $\beta_2 = 2 \cdot c_{i1} \times c_{i2}$ 는 **곱항 (interaction)** → 선형 IPCA 가 절대 못 잡음. (b) NN 의 ReLU 가 자동으로 곱항·sign 같은 비선형을 발견. (c) 결과: CA1 31.8 vs IPCA 11.9.
3. **Finite-sample overfit**: N=200, T=180 같은 작은 sample 에서 3-layer NN 은 너무 많은 모수 (∼수천 개) → noise 학습. 데이터에서 CA3 의 가중치 일부가 노이즈에 맞춰져 OOS 손해. CA1 / CA2 는 표현력과 정규화의 sweet spot.
