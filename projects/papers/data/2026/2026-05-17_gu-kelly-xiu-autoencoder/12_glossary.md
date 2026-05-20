# 12. 용어 사전 (Glossary)

> 본 논문에서 자주 등장하는 **용어** 와 **수식 기호** 의 정의 모음.

## 📌 이 챕터 활용법

읽으며 모르는 용어 마주치면 이 챕터에서 찾기. 4 카테고리로 분류:
- **12.1 자산가격결정** (α, β, Sharpe, SDF, no-arbitrage 등)
- **12.2 ML** (autoencoder, ReLU, LASSO, Adam 등)
- **12.3 통계 / 계량경제학** (PCA, IPCA, R² 등)
- **12.4 본 논문 특수 용어** (CA0~CA3, managed portfolio 등)
- **12.5 수식 기호 사전** — 표 형식으로 한눈에
- **12.6 자주 헷갈리는 점** 5개

---

## 12.1 자산가격결정 (Asset Pricing) 용어

### Alpha (α)
- **정의**: 요인모델로 설명되지 않는 자산의 평균 수익률.
- **수식**: $\alpha_i = \mathbb{E}[r_i] - \beta_i' \mathbb{E}[f]$
- 🌱 **일상 비유**: "학생 점수 = 약점×난이도 로 다 설명되어야 하는데, 그래도 안 설명되는 부분" — 모델 실패의 잔재.
- **자산가격결정의 목표**: 모든 $\alpha_i = 0$ (no-arbitrage).

### Beta (β)
- **정의**: 자산의 요인 노출도 (factor exposure).
- **수식**: $r_{i,t} = \alpha_i + \beta_i' f_t + u_{i,t}$
- 🌱 **일상 비유**: "학생의 과목별 약점" — 어떤 시험 (요인) 에 얼마나 민감?
- **본 논문**: $\beta_i = \text{NN}(z_i)$ — 특성의 함수.

### Factor (f)
- **정의**: 자산 수익률의 공통 변동을 설명하는 시점별 변수.
- 🌱 **일상 비유**: "오늘 시험별 난이도" — 모든 학생에게 공통으로 작용.
- **종류**:
  - **Observable**: market, size, value (FF) 등 관측 가능.
  - **Latent**: PCA, IPCA, CA — 데이터에서 추정.

### Risk Premium (λ)
- **정의**: 요인 노출 한 단위당 기대 수익.
- **수식**: $\lambda = \mathbb{E}[f_t]$
- 🌱 **일상 비유**: "**평균** 시험 난이도" — 평소 이 시험이 어렵게 나오는가.
- **해석**: 위험을 감수한 대가.

### No-Arbitrage
- **정의**: 차익거래 기회 없음 = 모든 자산의 α = 0.
- 🌱 **일상 비유**: "공짜 점심 없음" — 위험 없는 초과수익은 없음.
- **본 논문**: 모델 아키텍처에 α 항을 빼서 자동 강제.

### SDF (Stochastic Discount Factor)
- **정의**: 가격결정의 기본 도구. $\mathbb{E}[m_t r_t] = 0$.
- 🌱 **일상 비유**: "각 시점 상황 (m) 에 맞춰 미래 수익률에 부여하는 가중치" — 호황엔 작게, 불황엔 크게.
- **요인모델과 관계**: $m_t = 1 - \lambda' f_t$ 형태 (표준 affine 형식).
- **본 논문 (journal p.430)**: "[our model] is equivalent to a nonparametric model for a stochastic discount factor".

### Sharpe Ratio (SR)
- **정의**: 위험 한 단위당 초과 수익.
- **수식**: $\text{SR} = \frac{\mathbb{E}[r - r_f]}{\text{std}(r - r_f)}$
- 🌱 **일상 비유**: "롤러코스터 강도 (변동성) 1 단위당 받는 보너스 수익". 큰 게 좋음.
- **연환산**: 월별 SR × √12.
- **업계 기준**: < 0 = 손실, 0.5 = 평범, 1.0 = 좋음, 2.0+ = 매우 우수.

### Conditional Factor Model
- **정의**: β 가 시점/주식에 따라 변동 (조건부).
- 🌱 **일상 비유**: "학생 약점이 매 학기 신상에 따라 다시 평가됨".
- **본 논문**: $\beta_{i,t-1}(z_{i,t-1})$ — t-1 시점 특성의 함수.

### Unconditional Factor Model
- **정의**: β 가 시간 불변 (상수).
- 🌱 **일상 비유**: "한 번 정해진 학생 약점이 30 년 같다고 강제".
- **예**: 본 논문의 FF 비교군 (K=1~6 시리즈), PCA. 본 논문은 매년 refit 으로 β 가 거의 불변.

---

## 12.2 머신러닝 (ML) 용어

### Autoencoder
- **정의**: 입력을 압축→복원하는 신경망.
- **구조**: encoder → bottleneck → decoder.
- 🌱 **일상 비유**: "책 한 권 (입력) → 짧은 요약 (bottleneck) → 그 요약으로 책 복원 (decoder)". 좋은 요약이 가능한 모델 = 좋은 autoencoder.
- **본 논문**: encoder = z → β 매핑, "decoder" = β · f → r.

### Encoder
- **정의**: 고차원 입력을 저차원 표현으로 압축.
- 🌱 **일상 비유**: "고해상도 사진을 썸네일로 줄이는 압축기".
- **본 논문**: 두 개의 encoder (z encoder, r encoder).

### Bottleneck (latent dimension)
- **정의**: encoder 의 출력 차원. 정보의 핵심만 남김.
- 🌱 **일상 비유**: "모래시계의 좁은 부분 — 다 통과 못 하니 핵심만 남음".
- **본 논문**: K (요인 수).

### Decoder
- **정의**: 저차원 표현을 고차원으로 복원.
- 🌱 **일상 비유**: "요약을 보고 다시 책을 펴는 작가".
- **본 논문**: β'f 의 dot product 가 "decoder" 역할.

### ReLU (Rectified Linear Unit)
- **정의**: $g(x) = \max(0, x)$.
- 🌱 **일상 비유**: "음수면 0, 양수면 그대로 통과시키는 필터" — 신경망 비선형성의 원천.
- **본 논문 사용**: β 네트워크의 모든 hidden layer. (f-network 는 L_f = 1, 활성화 없음 — 선형 변환만)

### Batch Normalization
- **정의**: 각 층 입력을 미니배치 단위로 정규화.
- 🌱 **일상 비유**: "매번 점수를 z-score (평균 0, 분산 1) 로 표준화 후 평가".
- **효과**: 학습 안정화, 과적합 방지.

### LASSO (L1 Regularization)
- **정의**: 손실에 $\lambda \sum |\theta_j|$ 추가.
- 🌱 **일상 비유**: "1 천 권 중 중요한 20 권만 형광펜으로 표시" — 나머지 weight 자동 0.
- **효과**: 무관한 가중치를 정확히 0 으로.

### Early Stopping
- **정의**: validation loss 가 증가하면 학습 중단.
- 🌱 **일상 비유**: "모의고사 점수가 다시 떨어지기 시작하면 공부 중단".
- **효과**: 과적합 자동 방지.

### Ensemble Averaging
- **정의**: 다른 초기값으로 N개 모델 학습 → 평균.
- 🌱 **일상 비유**: "10 명의 학생이 따로 공부하고 답을 평균 — 개인 운 상쇄".
- **본 논문**: "multiple random seeds, say, 10" (journal p.436).

### Adam Optimizer
- **정의**: SGD 의 변형. Momentum + adaptive learning rate.
- 🌱 **일상 비유**: "잘 안 풀리는 과목엔 더 시간 쓰는 적응형 공부법" + "어제 좋아진 방향으로 계속 (momentum)".

### Universal Approximation
- **정의**: 충분히 크고 깊은 NN 은 어떤 연속 함수도 임의 정밀도로 근사.
- 🌱 **일상 비유**: "어떤 곡선도 충분히 많은 작은 직선 조각으로 흉내 가능" 의 NN 버전.
- **본 논문 함의**: 어떤 비선형 β(z) 도 표현 가능.

### Look-Ahead Bias
- **정의**: 학습에 미래 정보가 누출되는 오류.
- 🌱 **일상 비유**: "오늘 시험 답안지를 어제 미리 본 학생" — 부당.
- **본 논문 대응**: rolling-window training, OOS 30년 격리.

### Out-of-Sample (OOS)
- **정의**: 학습에 사용되지 않은 데이터.
- 🌱 **일상 비유**: "**한 번도 안 푼** 본시험". 학습용 모의고사 외의 진짜 시험.
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

1. **β 와 λ 의 본질적 차이**:
   - **β (Beta) = 자산별 노출도** (asset-specific): 자산 $i$ 의 시점 $t-1$ 의 K 차원 위험 노출도 벡터. **자산마다 다름**, **시점마다 다름** (conditional).
   - **λ (Risk Premium) = 요인별 위험프리미엄** (factor-specific): 요인 $k$ 가 평균적으로 보상하는 수익. **자산 무관**, **시점 무관** (또는 매우 천천히 변동).
   - **관계**: 자산 $i$ 의 기대 수익 = $\beta_i' \lambda$ — 노출도 × 보상.
   - **일상 비유**: β = "이 학생의 5 과목 약점", λ = "각 시험이 평소 평균적으로 어렵게 나오는가" (평균 난이도).
   - **추정 방법**: β 는 시점별 (Z 의 함수로), λ 는 시계열 평균으로 ($\hat\lambda = \bar f$).

2. **Conditional vs Unconditional 의 한 줄 차이**:
   - **Unconditional**: β 가 **시간 불변** 상수. 모든 시점에 같은 β.
     - 예: 정적 Fama-French (β 상수), PCA (latent β 상수).
     - 한계: 회사가 변하는데 β 가 안 변함 — 비현실적.
   - **Conditional**: β 가 **시간/주식 특성** 에 따라 변동.
     - 예: IPCA (β = z'Γ), 본 논문 (β = NN(z)).
     - 강점: 회사 특성 (size, 모멘텀, 변동성) 변화 → β 자동 갱신.
   - **실증 차이** (paper Table 1, K=6): Unconditional FF = -6.1, Conditional IPCA = 14.5, Conditional CA1 = 14.3 → conditional 효과가 20%p 이상.

3. **Total R² vs Predictive R² 가 다른 이유**:
   - **수식 차이**: 
     - **Total**: 분자 = $\sum (r_{i,t} - \hat\beta_i' \hat f_t)^2$ — **실제 시점 요인** $\hat f_t$ 사용.
     - **Predictive**: 분자 = $\sum (r_{i,t} - \hat\beta_i' \bar f)^2$ — **평균 요인** $\bar f$ 사용.
   - **의미 차이**:
     - Total = "오늘 fit" (실현 수익률 변동 설명)
     - Predictive = "평균 예측" (기대 수익률 = expected return = 위험 보상)
   - **분리되는 모델 예시** (PCA): 첫 PC 가 시장 변동 (high variance) 잡음 → Total R² 살아남. 하지만 평균 수익률과 무상관 → Predictive R² 음수.
   - **자산가격결정의 본질**: Predictive R² — **mean prediction** 이 자산가격결정 모델의 진짜 측정값.
   - **본 논문의 강점**: Total 은 IPCA 와 비슷하지만, Predictive 와 Sharpe (mean-based) 에서 CA2 ≈ 2× IPCA.
