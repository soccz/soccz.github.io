# 12. 용어 사전 (Glossary)

> **🧒 한 줄 요약**: 용어 사전. AE / IPCA / factor / characteristics / Sharpe ratio 정리.


> 본 논문에서 자주 등장하는 **용어** 와 **수식 기호** 의 정의 모음.

## 12.1 자산가격결정 (Asset Pricing) 용어

### Alpha (α)
- **정의**: 요인모델로 설명되지 않는 자산의 평균 수익률.
- **수식**: $\alpha_i = \mathbb{E}[r_i] - \beta_i' \mathbb{E}[f]$
- **자산가격결정의 목표**: 모든 $\alpha_i = 0$ (no-arbitrage).

### Beta (β)
- **정의**: 자산의 요인 노출도 (factor exposure).
- **수식**: $r_{i,t} = \alpha_i + \beta_i' f_t + u_{i,t}$
- **본 논문**: $\beta_i = \text{NN}(z_i)$ — 특성의 함수.

### Factor (f)
- **정의**: 자산 수익률의 공통 변동을 설명하는 시점별 변수.
- **종류**:
  - **Observable**: market, size, value (FF) 등 관측 가능.
  - **Latent**: PCA, IPCA, CA — 데이터에서 추정.

### Risk Premium (λ)
- **정의**: 요인 노출 한 단위당 기대 수익.
- **수식**: $\lambda = \mathbb{E}[f_t]$
- **해석**: 위험을 감수한 대가.

### No-Arbitrage
- **정의**: 차익거래 기회 없음 = 모든 자산의 α = 0.
- **본 논문**: 모델 아키텍처에 α 항을 빼서 자동 강제.

### SDF (Stochastic Discount Factor)
- **정의**: 가격결정의 기본 도구. $\mathbb{E}[m_t r_t] = 0$.
- **요인모델과 관계**: $m_t = 1 - \lambda' f_t$ 형태 (표준 affine 형식).
- **본 논문 (journal p.430)**: "[our model] is equivalent to a nonparametric model for a stochastic discount factor".

### Sharpe Ratio (SR)
- **정의**: 위험 한 단위당 초과 수익.
- **수식**: $\text{SR} = \frac{\mathbb{E}[r - r_f]}{\text{std}(r - r_f)}$
- **연환산**: 월별 SR × √12.

### Conditional Factor Model
- **정의**: β 가 시점/주식에 따라 변동 (조건부).
- **본 논문**: $\beta_{i,t-1}(z_{i,t-1})$ — t-1 시점 특성의 함수.

### Unconditional Factor Model
- **정의**: β 가 시간 불변 (상수).
- **예**: 본 논문의 FF 비교군 (K=1~6 시리즈), PCA. 본 논문은 매년 refit 으로 β 가 거의 불변.

---

## 12.2 머신러닝 (ML) 용어

### Autoencoder
- **정의**: 입력을 압축→복원하는 신경망.
- **구조**: encoder → bottleneck → decoder.
- **본 논문**: encoder = z → β 매핑, "decoder" = β · f → r.

### Encoder
- **정의**: 고차원 입력을 저차원 표현으로 압축.
- **본 논문**: 두 개의 encoder (z encoder, r encoder).

### Bottleneck (latent dimension)
- **정의**: encoder 의 출력 차원. 정보의 핵심만 남김.
- **본 논문**: K (요인 수).

### Decoder
- **정의**: 저차원 표현을 고차원으로 복원.
- **본 논문**: β'f 의 dot product 가 "decoder" 역할.

### ReLU (Rectified Linear Unit)
- **정의**: $g(x) = \max(0, x)$.
- **본 논문 사용**: β 네트워크의 모든 hidden layer. (f-network 는 L_f = 1, 활성화 없음 — 선형 변환만)

### Batch Normalization
- **정의**: 각 층 입력을 미니배치 단위로 정규화.
- **효과**: 학습 안정화, 과적합 방지.

### LASSO (L1 Regularization)
- **정의**: 손실에 $\lambda \sum |\theta_j|$ 추가.
- **효과**: 무관한 가중치를 정확히 0 으로.

### Early Stopping
- **정의**: validation loss 가 증가하면 학습 중단.
- **효과**: 과적합 자동 방지.

### Ensemble Averaging
- **정의**: 다른 초기값으로 N개 모델 학습 → 평균.
- **본 논문**: "multiple random seeds, say, 10" (journal p.436).

### Adam Optimizer
- **정의**: SGD 의 변형. Momentum + adaptive learning rate.

### Universal Approximation
- **정의**: 충분히 크고 깊은 NN 은 어떤 연속 함수도 임의 정밀도로 근사.
- **본 논문 함의**: 어떤 비선형 β(z) 도 표현 가능.

### Look-Ahead Bias
- **정의**: 학습에 미래 정보가 누출되는 오류.
- **본 논문 대응**: rolling-window training, OOS 30년 격리.

### Out-of-Sample (OOS)
- **정의**: 학습에 사용되지 않은 데이터.
- **본 논문**: 1987–2016 (30년).

---

## 12.3 통계 / 계량경제학 용어

### PCA (Principal Component Analysis)
- **정의**: 분산을 최대화하는 직교 방향 (주성분) 추출.
- **본 논문 관계**: 1-layer 선형 AE = PCA (Prop 1).

### IPCA (Instrumented PCA)
- **정의**: KPS (2019). β 를 z 의 선형 함수로 가정한 PCA 확장.
- **본 논문 관계**: 1-layer 선형 CA = IPCA (Prop 2).

### R² (R-squared)
- **정의**: 모델이 설명하는 변동의 비율.
- **본 논문 2종**:
  - **Total**: realized return 변동 설명.
  - **Predictive**: expected return 예측.

### Bonferroni Correction
- **정의**: 다중 검정 시 유의수준 조정 ($\alpha / m$).
- **본 논문 맥락**: paper Fig. 3 의 95 managed portfolios 동시 검정. 양측 |t|>3 의 chance 확률 ≈ 0.27% × 95 ≈ 12.4 개. FF5 의 37 은 chance 초과, CA2 의 8 은 chance 미만.

---

## 12.4 본 논문 특수 용어

### CA0, CA1, CA2, CA3
- **정의**: 본 논문의 모델 변형.
- **차이**: **β-network 의** hidden layer 수 (CA0:0, CA1:1, CA2:2, CA3:3). 모든 CA0–CA3 의 f-network 는 동일 (단일 선형층, L_f=1).
- **뉴런 수**: CA1: 32 / CA2: 32, 16 / CA3: 32, 16, 8

### Managed Portfolio ($x_t$)
- **정의**: $x_t = (Z_{t-1}'Z_{t-1})^{-1} Z_{t-1}' r_t$.
- **해석**: 각 특성에 비례하는 포트폴리오의 수익률.
- **본 논문 사용**: f 네트워크의 입력 (단순화).

### Characteristic-Based Factor
- **정의**: 자산 특성에 기반한 요인.
- **본 논문**: β 가 특성의 함수.

### Sparsity (희소성)
- **정의**: 의미있는 변수가 소수.
- **본 논문 발견**: 94 특성 중 top 20 이 contribution 의 ~80% (CA0) ~ ~90% (CA1–CA3) (paper Section 3.6).

---

## 12.5 수식 기호 사전

| 기호 | 차원 | 의미 |
|------|------|------|
| $r_t$ | $N \times 1$ | 시점 $t$ 의 N 개 자산 수익률 |
| $r_{i,t}$ | 스칼라 | 자산 $i$ 의 시점 $t$ 수익률 |
| $z_{i,t-1}$ | $P \times 1$ | 자산 $i$ 의 시점 $t-1$ 특성 벡터 |
| $Z_{t-1}$ | $N \times P$ | 시점 $t-1$ 의 특성 행렬 |
| $\beta_{i,t-1}$ | $K \times 1$ | 자산 $i$ 의 노출도 |
| $f_t$ | $K \times 1$ | 시점 $t$ 의 잠재요인 |
| $\lambda$ | $K \times 1$ | 위험프리미엄 |
| $u_{i,t}$ | 스칼라 | 자산 $i$ 의 잔차 |
| $\alpha_i$ | 스칼라 | 자산 $i$ 의 가격결정 오차 |
| $\Gamma$ | $P \times K$ (Eq. 2) 또는 $K \times P$ (Appendix A.2) | IPCA 의 선형 매핑 (paper 내 표기 불일치) |
| $\Sigma$ | $P \times P$ | $Z'Z$ (상수 가정, Prop 2) |
| $x_t$ | $P \times 1$ | managed portfolio |
| $W_0$ | $K \times P$ | β 네트워크의 마지막 가중치 |
| $W_1$ | $K \times P$ | f 네트워크의 (유일한) 선형 가중치 |
| $\theta$ | — | NN 의 모든 학습 모수 |
| $g(\cdot)$ | — | β 네트워크의 활성화 (ReLU) |
| $\tilde g(\cdot)$ | — | f 네트워크의 활성화 (paper L_f=1 에서 항등) |
| $N$ | — | 자산 수 (≈ 6,200/월; 총 unique ≈ 30,000) |
| $T$ | — | 시점 수 (총 718 개월) |
| $P$ | — | 특성 수 (94 firm chars + 1 market = 95 in main spec) |
| $K$ | — | 요인 수 (paper 1~6 보고) |
| $L_\beta$ | — | β 네트워크 hidden layer 수 (CA0:0, CA1:1, CA2:2, CA3:3) |
| $L_f$ | — | f 네트워크 layer (paper L_f = 1, 선형 변환) |

---

## 12.6 자주 헷갈리는 점

### 1. β 와 Γ 의 관계
- **선형 케이스**: $\beta_{i,t-1} = \Gamma' z_{i,t-1}$
- **본 논문**: $\beta_{i,t-1} = \text{NN}(z_{i,t-1})$
- → Γ 는 **선형 모델의 매핑**, NN 은 **그 일반화**.

### 2. Total R² vs Predictive R²
- **Total**: $1 - \frac{\sum (r - \hat\beta'\hat f)^2}{\sum r^2}$ — fit
- **Predictive**: $1 - \frac{\sum (r - \hat\beta' \bar f)^2}{\sum r^2}$ — 평균 사용 → 예측
- → 후자가 **자산가격결정의 본질**.

### 3. EW vs VW
- **EW** (Equal-Weighted): 모든 주식 동가중. 작은 주식 영향 큼.
- **VW** (Value-Weighted): 시가총액 비례. 큰 주식 영향 큼.
- → VW Sharpe 가 운용적 의미.

### 4. CA0 vs IPCA
- **수학적**: 동등 (Prop 2).
- **실증적**: 거의 같지만 학습 절차 차이로 미세 차이.
- **본 논문에서는 둘 다 보고**, 거의 동일함을 강조.

### 5. K 의 의미
- 잠재요인의 수.
- K=1 (단일 요인) → K=6 (다중 요인). paper 가 모든 K=1~6 보고.
- Total R² 는 K=6 에서 max (IPCA 14.5, CA1 14.3). VW Sharpe 도 K=6 CA2 = 1.53 max. Predictive R² 는 K=4~6 에서 plateau (CA2 K=5,6 = 0.57, 0.58).

---

## 12.7 짧은 약어 모음

| 약어 | Full | 한국어 |
|------|------|--------|
| AE | Autoencoder | 오토인코더 |
| CA | Conditional Autoencoder | 조건부 오토인코더 |
| FF | Fama-French | 파마-프렌치 |
| IPCA | Instrumented PCA | 도구화 주성분분석 |
| KPS | Kelly, Pruitt, Su (2019) | (저자명) |
| NN | Neural Network | 신경망 |
| OOS | Out-of-Sample | 표본 외 |
| PCA | Principal Component Analysis | 주성분분석 |
| RP-PCA | Risk-Premium PCA | (Lettau & Pelger 2020) |
| SDF | Stochastic Discount Factor | 확률할인요인 |
| SGD | Stochastic Gradient Descent | 확률경사하강 |
| SNR | Signal-to-Noise Ratio | 신호대잡음비 |
| SR | Sharpe Ratio | 샤프 비율 |
| VW/EW | Value-/Equal-Weighted | 가치/동가중 |

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. β 와 λ 의 본질적 차이는?
2. Conditional 과 unconditional 의 한 줄 차이는?
3. Total R² 와 Predictive R² 가 같은 모델에서 다른 값을 줄 수 있는 이유는?

### 답변
1. **β** = 자산별 노출도 (asset-specific), **λ** = 요인별 위험프리미엄 (factor-specific). 자산의 기대 수익 = β' λ.
2. **Unconditional**: β 가 시간 불변. **Conditional**: β 가 시간/주식 특성에 따라 변동.
3. **Total** 은 $\hat f_t$ (실제 시점 요인) 를 사용해 적합. **Predictive** 는 $\bar f$ (평균 요인) 를 사용해 예측. 모델이 cross-sectional fit 은 잘 하지만 mean prediction 은 잘 못하면 Total R² >> Predictive R² (예: PCA).
