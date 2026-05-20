# 08. Data & Illustrative GAN Example — Section III.A–B

> Section III.A–B (paper p.20–25) — 50년 데이터 + GAN 의 작동 원리를 size-value-investment example 로 보여주기.

## 8.1 챕터 한 줄 요약

CRSP 1967–2016 (50년), 약 10,000 stocks (모든 firm characteristic 보유 sample), 46 firm chars + 178 macro 시계열. 간단한 SVI (size, value, investment) example 로 **adversarial test asset 의 effect** 가 SR 2배 향상 보임.

---

## 8.2 Section III.A — Data

### 8.2.1 Stock Returns (paper p.20–21)

paper:
> "We collect monthly equity return data for all securities on CRSP. The sample period spans January 1967 to December 2016, totaling 50 years."

- **기간**: 1967/01 – 2016/12 = **50 years**
- **유니버스**: CRSP 전 종목
- **무위험**: Kenneth French Data Library 의 one-month Treasury bill

### 8.2.2 Sample Split (paper p.21)

| Period | Years | Use |
|--------|-------|-----|
| Training | 1967–1986 | 20 years |
| Validation | 1987–1991 | 5 years (hyperparameter) |
| **Test (OOS)** | **1992–2016** | **25 years** |

→ 25 년 OOS — **매우 엄격한 검증**.

### 8.2.3 Firm Characteristics (46개)

paper p.21:
> "we collect the 46 firm-specific characteristics listed either on Kenneth French Data Library or used by Freyberger, Neuhierl, and Weber (2020)."

**6 categories** (paper Table A.II):
1. **Past returns** (예: ST_REV, mom1m, mom6m, mom12m, r36_13)
2. **Investment** (예: Investment, NOA, AC, OA)
3. **Profitability** (예: ROA, ROE, OP, PROF)
4. **Intangibles** (예: AT, OL, BEME, A2ME)
5. **Value** (예: BEME, D2P, E2P, S2P)
6. **Trading frictions** (예: SUV, LME, IdioVol, Spread, LTurnover)

### 8.2.4 Stock Universe

paper p.21:
> "The number of all available stocks from CRSP is around 31,000. As in Kelly, Pruitt, and Su (2019) or Freyberger, Neuhierl, and Weber (2020), we are limited to the returns of stocks that have all firm characteristics information available in a certain month, which leaves us with around **10,000 stocks**."

paper footnote 28:
> "Using stocks with missing characteristic information requires data imputation based on model assumptions. Gu, Kelly, and Xiu (2019) replace a missing characteristic with the cross-sectional median of that characteristic during that month. However, this approach introduces an additional source of error and ignores the dependency structure in the characteristic space."

→ 본 논문은 **complete observations only** (대신 N=10,000 으로 줄어듦).

### 8.2.5 Quantile Transformation

paper p.21:
> "For each characteristic variable in each month, we rank them cross-sectionally and convert them into quantiles."

→ Cross-sectional rank → quantile. Gu-Kelly-Xiu (2021) Autoencoder paper 와 같은 처리.

### 8.2.6 Long-Short Factor 의 구성

paper p.21:
> "In the linear model the projection $\tilde F_{t+1} = \frac{1}{N}\sum I_{t,i} R^e_{t+1,i}$ results in long-short factors with an increasing positive weight for stocks that have a characteristic value above the median and a decreasing negative weight for below median values."

→ **Quantile-weighted long-short portfolio**. Kelly-Pruitt-Su (2019) 와 동일.

추가 flexibility:
> "We increase the flexibility of the linear model by including the positive and negative leg separately for each characteristic"

→ Long leg, short leg **별도 weights** — 비대칭 가능.

### 8.2.7 Macroeconomic Variables (178개)

paper p.22:
> "We collect 178 macroeconomic time series from three sources."

| Source | 개수 | 내용 |
|--------|-----|------|
| **FRED-MD** (McCracken & Ng 2016) | 124 | 표준 macro predictors |
| **46 cross-sectional medians** | 46 | 각 firm characteristic 의 cross-sectional median time series |
| **Welch-Goyal (2007)** | 8 | equity premium predictors |
| **합계** | **178** | |

paper 본문:
> "We apply standard transformations to the time series data. We use the transformations suggested in McCracken and Ng (2016), and define transformations for the 46 median and the 8 time series from Welch and Goyal (2007) to obtain stationary time series."

---

## 8.3 Section III.B — Illustrative Example (SVI)

### 8.3.1 Setup

paper p.22:
> "We illustrate how GAN works with a simple example that uses only the three characteristics size (LME), book-to-market ratio (BEME) and investment (Investment) for all stocks in our sample but leaves out the macroeconomic information."

**모델 variants** (SDF weights / conditioning function):
- **UNC (SV)**: ω depends on size + value, $g = $ 상수 (unconditional)
- **UNC (SVI)**: ω depends on size + value + investment, $g = $ 상수
- **GAN (SVI-SV)**: ω depends on SVI, $g$ depends on size + value
- **GAN (SVI-SVI)**: ω depends on SVI, $g$ depends on SVI
- **GAN (benchmark)**: full model (46 chars + 178 macro)

### 8.3.2 Test Assets

paper p.22:
> "We evaluate the asset pricing performance on two well-known sets of test assets: 25 portfolios double-sorted on size and book-to-market (SV 25) and 35 portfolios that include in addition 10 decile portfolios sorted on investment (SVI 35)."

---

## 8.4 Figure 4 — Illustration Results (paper p.24)

![Fig. 4 — GAN Illustration](figures/page24_GAN_illustration.png)

(Figure 4, paper p.24)

### Step 1 — 그림의 구조 이해

**축**:
- **5 panels** (가로 배치):
  - SR (Sharpe ratio).
  - EV (SV 25 Portfolios).
  - EV (SVI 35 Portfolios).
  - XS-R² (SV 25 Portfolios).
  - XS-R² (SVI 35 Portfolios).
- **세로 (rows)**: 6 models (위→아래):
  - GAN (top, full benchmark, red).
  - GAN (SVI-SVI).
  - GAN (SVI-SV).
  - GAN (SV-SV).
  - UNC (SVI).
  - UNC (SV) (bottom).
- **막대 색**: GAN red, others orange/yellow.

### Step 2 — 5 panel 의 의미

| Panel | 측정 | Test Asset |
|-------|------|----------|
| SR | OOS monthly Sharpe ratio | - |
| EV (SV 25) | 시계열 변동 설명 | 25 size×value portfolios |
| EV (SVI 35) | 시계열 변동 설명 | 25 + 10 investment = 35 |
| XS-R² (SV 25) | 횡단면 mean 설명 | 25 portfolios |
| XS-R² (SVI 35) | 횡단면 mean 설명 | 35 portfolios |

### Step 3 — 6 model 의 구성

| Model | ω depends on | g depends on | 의미 |
|-------|------------|------------|------|
| GAN | 46 chars + macro | 46 chars + macro | Full benchmark |
| GAN (SVI-SVI) | size, value, investment | SVI | Subset baseline |
| GAN (SVI-SV) | SVI | SV | g 가 investment 안 봄 |
| GAN (SV-SV) | size, value | SV | g 가 investment 안 봄 |
| UNC (SVI) | SVI | g = constant | Unconditional |
| UNC (SV) | SV | g = constant | Unconditional |

### Step 4 — 핵심 발견 — Test asset 정보의 중요성

**SR 비교**:
- GAN (full, top): SR ~ 0.75.
- GAN (SVI-SVI): SR ~ 0.55 — 75% of full.
- GAN (SVI-SV): SR ~ 0.4.
- UNC (SVI): SR ~ 0.2 — adversarial 없음.

**EV (SVI 35) 비교**:
- GAN (SVI-SVI) 가 SVI 35 잘 가격결정 (~0.7).
- UNC (SVI) 는 약함 (~0.4).

**핵심 메시지** (paper p.23):
> "GAN (SVI-SVI) is roughly twice as good as UNC (SVI)."

→ **g 가 SVI 정보 포함** 시 GAN 효과 2배. **Adversarial 의 가치** + **test asset 의 conditioning 의 중요성**.

### Step 5 — 발견의 의미

**"Test asset 의 정보 = SDF 정확도"**:
- 같은 ω 학습 capacity 라도 g 가 무엇 보느냐에 따라 SDF 의 학습 방향 달라짐.
- g 가 SVI 보면 → SDF 도 investment 정보 학습.
- g 가 SV 만 보면 → SDF 가 investment 정보 무시.

→ **Test asset 의 선택 = research question 의 선택**. GAN 은 이 선택을 자동화.

### Step 6 — Figure 4 의 5 panel 정확한 막대 값

paper Fig 4 의 5 panels × 6 models 의 정확한 값 (시각 reading 기반):

#### Panel 1: SR (X-axis: 0.2 to 0.6)
- GAN (top, dark red): **~0.65** — full benchmark with all chars + macro.
- GAN (SVI-SVI): **~0.55** — only SVI in both ω and g.
- GAN (SVI-SV): **~0.45** — ω uses SVI but g only SV.
- GAN (SV-SV): **~0.40** — both only SV.
- UNC (SVI): **~0.20** — unconditional with SVI weights, no adversarial.
- UNC (SV): **~0.15** — most restricted.

#### Panel 2: EV (SV 25 Portfolios) (X-axis: 0.4 to 0.7)
- GAN: ~0.70.
- GAN (SVI-SVI): ~0.65.
- GAN (SVI-SV): ~0.55.
- GAN (SV-SV): ~0.50.
- UNC (SVI): ~0.45.
- UNC (SV): ~0.40.

#### Panel 3: EV (SVI 35 Portfolios)
- GAN: ~0.70.
- GAN (SVI-SVI): **~0.60** — investment 정보 활용.
- GAN (SVI-SV): ~0.50 — investment 정보 g 가 없어 일부 손실.
- GAN (SV-SV): ~0.45.
- UNC (SVI): ~0.45.
- UNC (SV): ~0.40.

#### Panel 4: XS-R² (SV 25 Portfolios) (X-axis: 0.6 to 0.9)
- GAN: ~0.90.
- GAN (SVI-SVI): ~0.85.
- GAN (SVI-SV): ~0.80.
- GAN (SV-SV): ~0.75.
- UNC (SVI): ~0.65.
- UNC (SV): ~0.60.

#### Panel 5: XS-R² (SVI 35 Portfolios)
- GAN: ~0.85.
- GAN (SVI-SVI): ~0.80.
- GAN (SVI-SV): ~0.75.
- GAN (SV-SV): ~0.70.
- UNC (SVI): ~0.60.
- UNC (SV): ~0.55.

### Step 7 — 4 변수 효과의 분해 (Fig 4 기반)

각 panel 의 값 변화에서 4 효과 분해:

| 변화 | SR 효과 | EV 효과 | XS-R² 효과 |
|------|---------|---------|----------|
| UNC (SV) → UNC (SVI) | +0.05 | +0.05 | +0.05 |
| UNC (SVI) → GAN (SV-SV) | +0.20 | +0.05 | +0.10 |
| GAN (SV-SV) → GAN (SVI-SV) | +0.05 | +0.05 | +0.05 |
| GAN (SVI-SV) → GAN (SVI-SVI) | +0.10 | +0.10 | +0.05 |
| GAN (SVI-SVI) → GAN (full) | +0.10 | +0.05 | +0.05 |

→ **각 element 가 marginal 하게 contribute**. 곱적 효과.

---

## 8.5 Figure 5 — Conditioning Function g 의 의미 (paper p.25)

![Fig. 5 — Conditioning function g + portfolio pricing](figures/page25_g_function.png)

(Figure 5, paper p.25)

### Step 1 — 그림의 구조 이해

**4 sub-panels** (2×2):
- (a) **Heatmap**: $g$ for GAN (SV-SV). 2D plot of LME × BEME.
- (b) **3D plot**: $g$ for GAN (SVI-SVI). LME × BEME × Investment.
- (c) **Scatter**: Portfolio pricing for GAN (SVI-SVI).
- (d) **Scatter**: Portfolio pricing for UNC (SVI).

### Step 2 — Sub-panel (a) — GAN (SV-SV) 의 $g$ 시각화

**축**:
- X-axis: LME (size, [-0.4, 0.4] range — quantile).
- Y-axis: BEME (book-to-market, [-0.4, 0.4]).
- 색 (heatmap): $g$ value, range [-0.4084, 0.4243] (purple → orange).

**관찰**:
- Top-left corner (low LME, high BEME): **highest** $g$ (orange).
- Bottom-right (high LME, low BEME): **lowest** (purple).
- → **g 가 small-value vs large-growth long-short portfolio 의 구조**.

**해석**:
- $g$ 가 큰 자산 = test asset 으로 long.
- $g$ 가 작은 자산 = short.
- → **Adversary 가 small-value 와 large-growth 의 차이가 mispriced 라 판단**.

### Step 3 — Sub-panel (b) — GAN (SVI-SVI) 의 $g$

**3D contour with 5 slices** (Investment 의 5 quantile):
- 각 slice = 한 investment level 에서의 LME × BEME 의 $g$.
- 색 range: [-0.4972, 0.3812].

**관찰**:
- Investment 영향으로 $g$ pattern 이 변함.
- → **Triple interaction** (LME × BEME × Investment).
- "small, conservative value vs large, aggressive growth" 의 4D mispricing 패턴.

paper 본문 (p.25):
> "When we add investment information, the test assets become essentially long-short portfolios with extreme weighs for small, conservative value stocks and large, aggressive growth stocks. **GAN has in a data driven way discovered the structure of the Fama-French type test assets!**"

### Step 4 — Sub-panel (c) — GAN (SVI-SVI) 의 pricing

**축**:
- X-axis: Actual excess return (mean).
- Y-axis: Projected (model-implied) excess return.
- **직선**: 45-degree line (perfect fit).
- 색: blue = Size-Value 25 portfolios, orange = Size-Value-Investment 35 portfolios.

**관찰**:
- 점이 line 가까이 분포 — GAN 의 prediction 이 actual 과 align.
- 양쪽 portfolio set 모두 잘.

### Step 5 — Sub-panel (d) — UNC (SVI) 의 pricing

**같은 축**:
- 점이 line 에서 **멀리 떨어짐** — UNC 의 prediction 이 부정확.
- 특히 high actual return 영역에서 model 이 underpredict.

**vs (c)**: GAN 의 명백한 우위.

### Step 6 — 핵심 메시지

paper 결론 (Section III.B):
> "In summary, the simple example illustrates that the problem of estimating an asset pricing model cannot be separated from the problem of choosing informative test assets."

**Adversary 의 역할**:
1. Test asset 을 **자동 발견** — 인간 직관 (예: Fama-French) 의 자동화.
2. 발견된 test asset 이 **mispricing 의 핵심** 잡음.
3. SDF 가 그 mispricing 학습 → robust pricing.

→ **모델 추정과 test asset 선택은 분리할 수 없다**.

### Step 7 — Figure 5 의 4 sub-panel 정확한 값

paper Fig 5 의 각 sub-panel 의 colorbar / scatter range:

#### Sub-panel (a): g for GAN (SV-SV) — 2D Heatmap
- **X-axis**: LME (size), range $[-0.4, 0.4]$ — quantile range.
- **Y-axis**: BEME (book-to-market), range $[-0.4, 0.4]$.
- **Colorbar 값**: **-0.4084 ~ 0.4243** (paper Fig 5 caption 의 정확 값).
- **Color scheme**: purple (low) → orange (high).

**구체 패턴**:
- Top-left (low LME, high BEME) = small + value stocks → **highest g (~0.42, orange)**.
- Bottom-right (high LME, low BEME) = large + growth → **lowest g (~-0.41, purple)**.
- → **Long small-value, short large-growth** = classic value/size factor pattern.
- **Adversary 가 데이터에서 size + value 의 mispricing 패턴 자동 발견**.

#### Sub-panel (b): g for GAN (SVI-SVI) — 3D Plot
- **Axes**: LME × BEME × Investment, 모두 $[-0.4, 0.4]$.
- **5 slices** (Investment 의 5 quantile).
- **Colorbar 값**: **-0.4972 ~ 0.3812**.

**구체 패턴**:
- Investment 영향으로 색 pattern 변함.
- "small, conservative value vs large, aggressive growth" 의 4D pattern (paper p.25).
- → Triple interaction (LME × BEME × Investment) 의 mispricing.

#### Sub-panel (c): Portfolio pricing for GAN (SVI-SVI) — Scatter
- **X-axis**: Excess return (actual mean), range $[0.004, 0.016]$ — monthly.
- **Y-axis**: Projected excess return (model implied), 같은 range.
- **Blue line**: Size Value 25 portfolios (25 점).
- **Orange line**: Size Value Investment 35 portfolios (35 점).
- **Black line**: 45-degree (perfect fit).

**관찰**:
- 점이 45° line **가까이 분포** — GAN 의 prediction 이 actual 과 align.
- 양쪽 portfolio set (25 + 35) 모두 잘.

#### Sub-panel (d): Portfolio pricing for UNC (SVI) — Scatter
- 같은 axes, 같은 색 코드.
- **Y-axis range**: $[0.002, 0.016]$ — UNC 가 더 작은 range 만 사용.

**관찰**:
- 점이 line **에서 멀리 떨어짐** — UNC 의 prediction 이 부정확.
- 특히 high actual return 영역에서 model 이 underpredict.
- UNC 의 한계 시각화.

### Step 8 — 두 sub-panel (c)(d) 의 비교가 의미하는 것

GAN (c) vs UNC (d):
- 같은 ω 학습 capacity.
- 차이는 **g 가 adversarial 인가 (GAN) 아닌가 (UNC, g=상수)**.
- → Adversarial 의 **20% SR 향상** 효과의 시각화.

paper 본문 (p.25):
> "UNC (SVI) fails in explaining small value stocks while the GAN formulation captures mean returns very well for all quantiles."

→ UNC 는 small value 영역에서 system fail. GAN 은 잘 잡음.

### Step 9 — Adversary 의 정신 (paper 가 학계에 가르치는 것)

paper p.25:
> "GAN has in a data driven way discovered the structure of the Fama-French type test assets!"

**핵심 메시지**:
- Fama-French (1992) 는 인간 (Eugene Fama, Kenneth French) 이 **직관으로** size, value 의 long-short portfolio 만들음.
- 본 paper 의 GAN 은 **데이터 driven** 으로 같은 구조 발견.
- → ML 의 자동화가 인간 직관과 일치 (validation) + 더 풍부 (4D triple interaction 까지).

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. paper 가 31,000 stocks 중 10,000 만 사용한 이유?
2. 178 macro 시계열의 3가지 출처?
3. SVI illustrative example 이 입증하는 핵심?

### 답변
1. **Missing characteristic 문제**. 31,000 stocks 전체 중 모든 46 firm characteristics 를 가진 stock 은 ≈ 10,000. Gu-Kelly-Xiu (2019) 는 missing 을 median imputation 했지만, 본 논문은 (Kelly-Pruitt-Su 2019, Freyberger-Neuhierl-Weber 2020 처럼) **complete cases only** 채택. Imputation 의 추가 error 와 dependency structure 무시 방지.
2. **(1) FRED-MD (McCracken-Ng 2016)**: 124 macro predictors. **(2) 46 cross-sectional medians** of firm characteristics — quantile 분포 + median level 이 raw characteristic 정보 거의 동등 (정규화 form). **(3) Welch-Goyal (2007)**: 8 equity premium predictors (dividend-price ratio 등).
3. **Test asset 정보 = SDF 정확도**. GAN (SVI-SVI) 는 GAN (SVI-SV) 보다 두 배 좋음 — 같은 SDF weight 정보지만 **test asset 의 conditioning 이 investment 정보 포함** 으로 학습 quality 다름. 또한 GAN 이 Fama-French type 의 small-value × large-growth 구조를 **자동 발견** — 데이터 driven 으로 적절한 test asset 학습 가능.
