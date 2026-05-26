# 06. 실증 (Part A) — 데이터와 비교 모델

> **🧒 한 줄 요약**: CRSP/Compustat 1957-2018. 94 characteristics. US equities universe.


> Section 3.1–3.2 (journal p.436–437) — 실증분석 setup.

## 6.1 챕터 한 줄 요약

1957/03–2016/12 (60년), CRSP 미국 보통주 (NYSE/AMEX/NASDAQ), **약 30,000 unique 주식** (월평균 6,200). **94 firm characteristics** (산업 더미 미포함 in main spec) + 1 market portfolio constant regressor. 비교 모델: **FF (K 별 점진 확장), PCA, IPCA (KPS), CA0–CA3 (본 논문)**.

---

## 6.2 데이터 (paper Section 3.1)

### 6.2.1 수익률 (CRSP)

paper 본문 (508–511):
> "We analyze the same dataset studied in Gu et al. (2019), which contains monthly individual stock returns from the Center for Research in Securities Prices (CRSP) for all firms listed in the three major exchanges: NYSE, AMEX, and NASDAQ. ... Our sample begins in March 1957 (the start date of the S&P 500) and ends in December 2016, totaling 60 years."

- **기간**: 1957/03 – 2016/12 = 60 년 = 718 개월
- **유니버스**: NYSE, AMEX, NASDAQ 상장 보통주 — share code 등 필터 없음
- **무위험 수익**: Treasury bill rate
- **샘플 크기** (paper 528): **약 30,000 unique 주식**, 매월 평균 **6,200+ 주식**

paper 본문 (524–528):
> "Unlike the existing literature, we do not impose any filters based on stock prices or share codes, or rule out financial firms. ... The total number of stocks in our sample is nearly 30,000, with the average number of stocks per month exceeding 6,200."

### 6.2.2 특성 (94 firm characteristics)

paper 본문 (512–514):
> "These include 94 characteristics (61 of which are updated annually, 13 updated quarterly, and 20 updated monthly), see Gu et al. (2019) for a full list."

**업데이트 빈도**:
| 빈도 | 개수 |
|------|------|
| 연간 | 61 |
| 분기 | 13 |
| 월간 | 20 |
| **합계** | **94** |

**Look-ahead 방지** (515–518):
- 월간: t-1 의 가장 최신 데이터 사용
- 분기: t-4 의 가장 최신 데이터
- 연간: t-6 의 가장 최신 데이터

→ 미래 정보 누설 완벽 차단.

### 6.2.3 데이터 전처리

**결측치** (518–519):
> "Observations are occasionally missing some characteristics. We replace a missing characteristic with the cross-sectional median of that characteristic during that month."

**rank-normalize** (520–522):
> "Distributions of some characteristics are highly skewed and leptokurtic ... we rank-normalize all characteristics into the interval (−1, 1) for each month t."

→ 매월 cross-sectional rank → $[-1, 1]$ 균등 분포. 이상치 영향 제거 + Proposition 2 의 $Z'Z = \Sigma$ 가정 거의 충족.

### 6.2.4 Managed Portfolios + Market Constant

paper 본문 (522–523):
> "We then form 94 managed portfolios using (16). We also include one equal-weighted market portfolio that corresponds to a constant regressor in $Z_{t-1}$."

→ **94 특성 + 1 market = 95 columns** in $Z_{t-1}$. (산업 더미 미포함 in main spec)

**Managed portfolio (Eq. 16)**:
$$
x_t = (Z_{t-1}' Z_{t-1})^{-1} Z_{t-1}' r_t
$$
- $x_t$ 는 $P \times 1$ 벡터 (P = 95 in main spec).
- 각 element 는 한 특성으로 sort 한 long-short portfolio 의 수익률에 가까움.
- 이게 factor 네트워크의 입력 (Section 2.2, Eq 16).

---

## 6.3 비교 모델 (paper Section 3.2)

본 논문이 비교한 모든 모델은 latent factor 모델 (관측 요인 모델 FF 와 잠재 요인 모델 PCA/IPCA/CA 모두 포함).

### 6.3.1 PCA (Eq. 5)

$$
r_t = \beta f_t + u_t
$$

- $\beta$ : $N \times K$ 노출도 (시간 불변)
- $f_t$ : $K \times 1$ 잠재 요인
- 추정: covariance matrix 의 PCA. **Unbalanced panel** (매월 자산 수 변동) 대응: **EM algorithm for PCA** (Stock & Watson 2002) 적용 — paper footnote 13.

**Missing data 대응** (paper footnote 13):
- PCA: EM algorithm.
- IPCA: KPS algorithm 자체가 missing data 에 robust.
- CA (autoencoder): SGD 의 mini-batch 가 자동으로 missing 처리 (없는 obs 는 batch 에서 제외).

**특징**: covariates 무사용. 시간 불변 β.

### 6.3.2 IPCA (KPS 2019, Eq. 1+2)

$$
\beta(z_{i,t-1})' = z_{i,t-1}' \Gamma, \quad r_{i,t} = z_{i,t-1}' \Gamma' f_t + u_{i,t}
$$

- $\Gamma$ : $P \times K$ 매핑 (시간 불변, 자산 공통)
- $\beta_{i,t-1}$ : 특성의 선형 변환

**특징**: covariates 활용. β 시변. **선형** 매핑.

추정: Eq. (17) — Alternating least squares.

### 6.3.3 CA0–CA3 (본 논문)

**모든 CA0–CA3 의 공통점** (journal p.437):
> "CA0 through CA3 all maintain a **one-layer linear specification on the factor side** of the model."

→ Factor network (f) 는 모든 CA 모델에서 **단일 선형 변환** ($f_t = W_1 x_t$). 깊이 차이 없음.

**β 네트워크 깊이만 변동**:

| 모델 | β 네트워크 구조 (paper 538–541) |
|------|--------------------------------|
| **CA0** | 단일 선형 변환 ($\beta = W_0 z$). hidden layer 0개. |
| **CA1** | 1 hidden layer (32 neurons) + ReLU |
| **CA2** | 2 hidden layers (32, 16 neurons) + ReLU |
| **CA3** | 3 hidden layers (32, 16, 8 neurons) + ReLU |

**K (요인 수)**: 1, 2, 3, 4, 5, 6 — paper 가 모두 보고.

paper 본문 (538–544):
> "We then consider a range of conditional autoencoder (CA) architectures with varying degrees of complexity. The simplest, which we denote CA0, uses a single linear layer in both the beta and factor networks as described in (18), making it similar (but not identical) to IPCA. Next, CA1 adds a hidden layer with 32 neurons in the beta network. Finally, CA2 and CA3 add a second and third hidden layer, with 16 and 8 neurons respectively, to the beta side."

### 6.3.4 FF (Observable Factors)

paper 본문 (journal p.437):
> "The first observable factor is the **excess market return**, then we add **SMB, HML, and UMD**, sequentially. The five-factor model is the **market, SMB, HML, CMA, and RMW**, and the six-factor model again appends **UMD**."

**Data 출처** (paper footnote 14): "Market, SMB, HML, CMA, RMW, and UMD factor returns are from Ken French's website."

→ K 마다 다른 FF 변형:

| K | FF 모델 |
|---|---------|
| 1 | Market 만 |
| 2 | Market + SMB |
| 3 | Market + SMB + HML |
| 4 | Market + SMB + HML + UMD |
| 5 | **FF5**: Market + SMB + HML + CMA + RMW |
| 6 | FF5 + UMD |

**주의**: K=4 와 K=5 가 단순 누적이 아님 — K=5 에서 UMD 가 빠지고 CMA+RMW 가 추가. K=6 에서 UMD 가 다시 들어옴.

**특징**: $\beta_i$ 가 시간 불변 (또는 5년 rolling 으로 추정, paper 의 rare refit).

---

## 6.4 비교 매트릭스 (Summary)

| 모델 | β 함수 | covariates | 비선형 | 시간변동 β | 자유 모수 수 |
|------|--------|-----------|--------|------------|-------------|
| **FF (K)** | Pre-defined sort | ✗ | ✗ | ✗ | $\sim KN$ |
| **PCA (K)** | Latent | ✗ | ✗ | ✗ | $\sim KN$ |
| **IPCA (K)** | $\Gamma' z$ | ✓ | ✗ | ✓ | $\sim KP$ |
| **CA0 (K)** | $W_0 z$ | ✓ | ✗ | ✓ | $\sim KP$ |
| **CA1 (K)** | NN_2(z) | ✓ | ✓ | ✓ | $\sim 32P + 32K$ |
| **CA2 (K)** | NN_3(z) | ✓ | ✓ | ✓ | $\sim 32P + 32 \cdot 16 + 16K$ |
| **CA3 (K)** | NN_4(z) | ✓ | ✓ | ✓ | $\sim 32P + 32 \cdot 16 + 16 \cdot 8 + 8K$ |

**핵심 차별점**:
- FF/PCA: unconditional (시간 불변 β)
- IPCA/CA0: conditional 선형
- CA1–CA3: conditional **비선형** (깊이만 다름)
- **모든 CA0–CA3 의 factor network 는 동일 (단일 선형)**

---

## 6.5 학습-검증-테스트 분할

paper 본문 (549–553):
> "We divide the 60 years of data into 18 years of training sample (1957–1974), 12 years of validation sample (1975–1986), and the remaining 30 years (1987–2016) for out-of-sample testing. Because machine learning algorithms are computationally intensive, we **avoid recursively refitting models each month. Instead, we refit once every year** as most of our signals are updated once per year. **Each time we refit, we increase the training sample by one year. We maintain the same size of the validation sample, but roll it forward** to include the most recent twelve months."

**프로토콜**:
| 시작 OOS | Train | Validation | Test (1년) |
|----------|-------|------------|------------|
| 1987 | 1957–1974 (18년) | 1975–1986 (12년) | 1987 |
| 1988 | 1957–1975 (19년) | 1976–1987 (12년) | 1988 |
| 1989 | 1957–1976 (20년) | 1977–1988 (12년) | 1989 |
| ... | ... | ... | ... |
| 2016 | 1957–2003 (47년) | 2004–2015 (12년) | 2016 |

매 1년마다 **재학습**. 총 **30번** 학습. 모든 OOS 예측이 그 시점 이전 정보만 사용 → Look-ahead 차단.

**Validation 의 역할**:
- Hyperparameter tuning (LASSO λ, learning rate 등)
- Early stopping 의 stopping criterion

---

## 6.6 평가 지표 (paper Section 3.3)

자세한 정의는 [07_empirical_R2_sharpe_alpha.md](07_empirical_R2_sharpe_alpha.md) 참조.

5가지 지표:

1. **Total R²** (Eq. 20) — 모델이 realized return 의 변동을 얼마나 설명?
2. **Predictive R²** (Eq. 21) — 모델이 expected return 을 얼마나 예측?
3. **Long-Short Decile Sharpe** — Table 3, EW + VW.
4. **Tangency Portfolio Sharpe** — Table 4.
5. **α |t-stat| > 3 개수** — Fig. 3 (95 managed portfolios 대상).

→ **변량 / mean / 운용 / no-arbitrage** 의 4개 차원 종합 평가.

---

## 6.7 본 setup 의 어려움 — 왜 이 데이터셋이 ML 에게 도전적인가?

1. **낮은 SNR**: 월 수익률 표준편차 ≈ 15%, 평균 ≈ 1%. SNR ≈ 0.07.
2. **이질적 패널**: 매월 주식 수가 4,000–8,000 사이로 변동. 결측치 흔함.
3. **시계열 변동**: 1970s 스태그플레이션, 2000s 닷컴, 2008 금융위기 등 regime shift.
4. **장기 추세**: 60년 동안 시장 구조 자체 변함.
5. **횡단면 분산 ≫ 시계열 분산**: 같은 시점 주식 간 차이 > 같은 주식 시점 차이.

→ 이런 환경에서 OOS CA2 VW Sharpe 1.53 (Table 3) 을 달성하는 게 본 논문의 핵심 성과.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. CA0 부터 CA3 까지의 차이는 정확히 어디인가?
2. 데이터 전처리에서 cross-sectional rank normalize 의 두 가지 효과는?
3. K=4 와 K=5 의 FF 모델 비교는 단순한 누적인가?

### 답변
1. **β-network 의 hidden layer 수만** 차이: CA0=0, CA1=1 (32 neurons), CA2=2 (32, 16), CA3=3 (32, 16, 8). **f-network 는 모두 동일** (단일 선형 변환, $f = W_1 x$).
2. (a) 모든 특성을 $[-1, 1]$ 균등 분포로 만들어 $Z'Z \approx \Sigma$ 상수 가정 (Proposition 2) 거의 충족. (b) 이상치 (outlier) 영향을 자동 제거 — 값이 아닌 rank 만 사용.
3. **아님**. K=4 = Market + SMB + HML + UMD (4-factor 모델). K=5 = FF5 = Market + SMB + HML + CMA + RMW (UMD 빠지고 CMA/RMW 추가). K=6 = FF5 + UMD. 단순 누적이 아닌 학계 표준 FF 변형.
