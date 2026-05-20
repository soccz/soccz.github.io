# 06. 실증 (Part A) — 데이터와 비교 모델

> Section 3.1–3.2 (journal p.436–437) — 실증분석 setup.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **데이터 60년·6,200 주식·94 특성** 의 구체 모양 — 표 한 장으로 무지식자도 이해
- 비교 모델 7개 (FF, PCA, IPCA, CA0~CA3) **각각이 뭐가 다른지** 한 표로
- **OOS 30년 rolling** 평가 방식 — 왜 이렇게 엄격하게 하는지

---

## 📖 무지식자용 — 데이터 큰 그림 한 장으로

본 논문이 다루는 데이터를 일상 비유로:

```
   60년 (1957~2016)          94 특성 (size, momentum, 등)
   ┌─────────────────┐       ┌─────────────────────────┐
   │ 매월 6,200 주식  │       │  애플 size  =  300조원   │
   │ 30,000 회사 총  │  ×    │  애플 모멘텀 = +12% (1년) │
   │ ≈ 4,500,000 obs │       │  애플 변동성 = 25%       │
   └─────────────────┘       │  ...                     │
                              └─────────────────────────┘
   
   각 행: "이 회사의 이번달 수익률은?" 한 점 (예: 애플 2020/3 = +6.3%)
   각 열: "이 특성을 모든 회사에서 본다" (94 개)
```

**규모 비유**:
- 학생-시험 비유로: "60년 동안 매월 시험 (총 718번), 매 시험에 평균 6,200명 학생, 학생마다 94 항 신상" — 즉 **거대한 학생-시험 패널**.
- 데이터 양: **약 450 만 관측치**. ML 모델 학습에 충분.

**왜 60년인가?**
- 자산가격결정은 **regime change** (1970년대 스태그플레이션, 2000년대 닷컴, 2008 금융위기 등) 가 빈번.
- 30년만 보면 운으로 좋은 결과 가능. **60년이면 4-5번의 위기·평시 사이클** 포함 → 진짜 검증.

**왜 평균 6,200 주식 (매월)?**
- 미국 NYSE+AMEX+NASDAQ 상장 보통주 전체. 시점에 따라 4,000-8,000 변동.
- 작은 주식도 포함 (penny stock 도 거름 없음) — 가장 엄격한 universe.

**왜 94 특성?**
- 학계에서 1960s 이후 발견된 거의 모든 anomaly 변수 망라 (Gu, Kelly, Xiu 2019 데이터셋 재사용).
- size, value, momentum, profitability, liquidity, volatility 등 **6 카테고리** 약 94 항.
- 시그널이 약한 것·중복된 것 다 포함 → ML 이 자동으로 골라야 함.

---

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

### 📖 무지식자용 — 7개 모델을 한 줄로

학생 약점 진단 비유로:

| 모델 | 약점 진단법 | 일상 비유 |
|------|-------------|-----------|
| **FF** | 미리 정해진 4-6 개 안에 학생을 분류 | "수학형/영어형/암기형 ... 미리 정한 4 카테고리" |
| **PCA** | 시험 점수 패턴에서 잠재 약점 추출 | "데이터에서 자동으로 그룹 찾기" (신상 무시) |
| **IPCA** | 신상 (z) 의 **선형 결합** 으로 약점 산출 | "학습시간 × 0.3 + 성격 × 0.2 + ..." 의 선형 |
| **CA0** | IPCA 와 같지만 SGD 로 학습 | "같은 결과지만 학습 방법만 ML 식" |
| **CA1** | 신상 → 1층 신경망 → 약점 | "비선형 변환 1 단계" — 상호작용 약간 잡음 |
| **CA2** | 신상 → 2층 신경망 → 약점 | "**본 논문 추천**. 비선형 2 단계, sweet spot" |
| **CA3** | 신상 → 3층 신경망 → 약점 | "비선형 3 단계 — 자유도 너무 커 overfit 위험" |

---

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

### 📖 무지식자용 — 왜 이렇게 엄격하게 분할?

학생-시험 비유로:

```
   1957 ─── 1974 ─── 1986 ─── 1987 ─── ... ─── 2016
   [ 18년 공부 ]  [ 12년 모의 ]  [ 본시험 1년 ]
        ↓              ↓              ↓
       학습         hyperparameter  실제 평가
       데이터       튜닝, early stop  (절대 학습에 못 씀)

   매년 1년씩 데이터 추가:
   1988 평가  →  학습 19년 + 모의 12년
   1989 평가  →  학습 20년 + 모의 12년
   ...
   2016 평가  →  학습 47년 + 모의 12년 
```

**왜 이렇게 복잡?**
- ML 의 평소 방식 (random 80/20 split) 은 **시점이 섞임** → 미래 데이터로 과거 예측 가능 → 부당.
- 금융에서는 **chronological split (시간 순)** 가 필수 — 1990 예측에 1991 이후 정보 절대 못 씀.
- 매년 **재학습** 으로 모델이 최신 시장 환경 반영.

**얼마나 엄격?**
- 30년 OOS = 자산가격 분야에서 **가장 엄격한 표준**.
- 학계 보통 5-10년 OOS. 본 논문은 그 3 배 이상.

---

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

1. **CA0 → CA3 의 정확한 차이**:
   - **β-network 의 hidden layer 수만** 변동:
     - CA0: hidden 0 (단일 선형 = IPCA, Prop 2)
     - CA1: hidden 1 (32 neurons + ReLU)
     - CA2: hidden 2 (32, 16 neurons + ReLU)
     - CA3: hidden 3 (32, 16, 8 neurons + ReLU)
   - **f-network 는 모든 모델 동일**: 단일 선형 변환, $f = W_1 x$, paper $L_f = 1$ 강제.
   - **왜 f 만 안 깊게 하나?**: 요인이 portfolio (선형 결합) 라는 자산가격 해석 유지.
   - **CA2 가 sweet spot** 인 이유: paper Table 3 에서 K=6 VW Sharpe = 1.53 (최고).

2. **Cross-sectional rank normalization 의 2 효과**:
   - **(a) Prop 2 가정 충족**: 모든 특성을 $[-1, 1]$ 균등 분포로 만들면 $Z_{t-1}'Z_{t-1}$ 가 시점에 거의 무관 ($\approx \Sigma$ 상수). → CA0 ≈ IPCA 보장.
   - **(b) Outlier robustness**: 값이 아닌 **rank** 만 사용 → 극단치가 자동 제거. 예: 어떤 회사 시가총액이 100조원이든 1000조원이든 cross-sectional rank 상위 1% 면 같은 값 (1.0).
   - **부수 효과**: cross-sectional 비교가 단위 무관 (size 도 dimensionless, mom 도 dimensionless) → 변수 간 비교 가능.

3. **K=4 와 K=5 의 FF 모델 비교 — 단순 누적인가?**:
   - **아님**. K 마다 FF 모델 구성 다름:
     - K=1: Market 만
     - K=2: Market + SMB
     - K=3: Market + SMB + HML (FF3)
     - K=4: Market + SMB + HML + **UMD** (Carhart 4-factor)
     - K=5: **FF5** = Market + SMB + HML + **CMA + RMW** (UMD 빠짐!)
     - K=6: FF5 + UMD
   - K=4 → K=5 에서 UMD 가 **빠지고** CMA·RMW 가 추가 — **단순 누적이 아닌 학계 표준 FF 변형**.
   - 이유: FF5 (2015) 가 학계의 표준 5-factor 모델. UMD 는 별도 추가.
   - 본 논문이 이걸 그대로 사용 → 학계 비교 가능성 유지.
