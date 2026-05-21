# 10. Characteristic Sorted Portfolios — Section III.E

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Characteristic-Sorted Portfolios — Decile 1 vs Decile 10
- Sharpe Ratio 의 정확한 분해
- Long-short portfolio 의 운용 의미

---

paper p.29-32 (Section III.E). **Table III (46 anomaly deciles) + Figure 9/10 (predicted vs actual scatter) + Table A.IV (double-sorted) + SDF structure (Section III.G)**.

이 챕터의 목표: **Table III 의 각 cell 이 무엇을 의미하는지** 깊이 풀고, Figure 9/10 의 4 subpanel scatter plot 을 어떻게 읽는지, double-sorted 결과의 함의를 자세히.

---

## 10.1 챕터 한 줄 요약

paper Table III: **46개 anomaly decile portfolios 모두**에서 GAN 이 **XS-R² > 90%** 달성.
- GAN: 46/46 cell 에서 EV best.
- GAN XS-R²: 거의 모두 > 90% (단 IdioVol, ROA, Variance 등 일부는 0.90 직전).
- EN/FFN 은 일부 anomaly 에서만 GAN 과 유사.
- Figure 9, 10 의 scatter 가 시각적으로 GAN 압도 확인.

---

## 10.2 평가 setup

paper p.29 본문:
> "Our approach achieves an unprecedented pricing performance on standard test portfolios. Asset pricing testing is usually conducted on characteristic sorted portfolios that isolate the pricing effect of a small number of characteristics. We sort the stocks into value weighted decile and double-sorted 25 portfolios based on the characteristics."

### Test assets 구성

| 종류 | 개수 | 의미 |
|------|------|------|
| **Single-sorted decile** | 46 chars × 10 deciles = **460 portfolios** | 한 characteristic 기준 10 분위 |
| **Double-sorted 25** | 5×5 grid, 4 sets | 두 characteristic 의 cross |
| **β-sorted decile** (Sec III.D) | 10 portfolios | risk loading 기준 (이미 09 챕터) |

→ Section III.E 의 주 분석은 **460 single-sorted + 100 double-sorted = 560 portfolios**.

### Sorting 방식

각 단일 정렬 (예: ST_REV):
- 매월: 모든 주식을 ST_REV (1-month reversal) 값 순으로 정렬.
- 10 deciles 로 분할 (가장 낮은 10% = decile 1, ..., 가장 높은 10% = decile 10).
- 각 decile 은 **value-weighted portfolio** (시가총액 비례 가중).
- 시점 변하면 redistribute.

---

## 10.3 Table III — 46 Decile Portfolios (paper p.30)

### 🔣 4-단 기호 풀이 (Table III columns)

| 열 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| **Charact.** | anomaly 이름 | "시험 과목" | 46개 |
| **EN EV** | EN 모델의 EV | "EN 학생의 변동 설명력" | 0-1 (높을수록 좋음) |
| **FFN EV** | FFN 모델의 EV | "FFN 학생의 변동 설명력" | EN 과 비슷한 수준 |
| **GAN EV** | GAN 모델의 EV | "GAN 학생의 변동 설명력" | **거의 모두 best** |
| **EN XS-R²** | EN 모델의 XS-R² | "EN 의 평균 수익 설명력" | 단조성 |
| **FFN XS-R²** | FFN 모델의 XS-R² | "FFN 의 평균 수익 설명력" | |
| **GAN XS-R²** | GAN 모델의 XS-R² | "GAN 의 평균 수익 설명력" | **거의 모두 > 0.90** |

**🌱**: "**6 column = 3 모델 × 2 metric (EV, XS-R²) 의 가로 layout** — 46 anomaly 모두 동시 비교".

### 📖 처음 보는 사람을 위한 — Table III 읽는 법 (★ 본 논문 가장 큰 표)

**이 표가 보여주는 것**: 46 개 anomaly (size, value, momentum, ...) 각각으로 주식을 10 그룹 (decile) 으로 나눠 portfolio 만들고, **3 모델 (EN/FFN/GAN)** 이 그 portfolio 의 (변동 + 평균 수익률) 을 얼마나 설명하나.

**일상 비유 (학생-시험)**:
- 46 anomaly = "46 가지 다른 시험 과목" (size 시험, value 시험, ..., momentum 시험).
- 3 모델 = "3 명의 학생" (EN, FFN, GAN).
- 2 metric (EV / XS-R²) = "2 가지 채점 기준" (변동 설명력 / 평균 설명력).
- **GAN 이 거의 모든 과목에서 1 등** + **XS-R² > 90% 거의 모두**.

**표 구조**:
- **행 (46 개)**: 각 anomaly (paper 2 column layout — 표가 가로로 두 묶음, 각 23 anomaly).
- **열**: 각 anomaly 별로 6 cell — (EN/FFN/GAN) × (EV/XS-R²). **GAN 굵게**.

**값의 의미**:
- **EV (Explained Variation)**: 0-1 사이, 높을수록 좋음. "그 anomaly 의 시계열 변동의 몇 %를 모델이 설명".
- **XS-R² (Cross-Sectional R²)**: 0-1 사이, 높을수록 좋음. "10 그룹의 평균 수익률 차이를 얼마나 예측".

**어디부터 보면 되나**:
1. **GAN 열 (굵게)** 를 먼저 본다 — 거의 모든 row 에서 **EN/FFN 보다 큼**.
2. **XS-R² > 0.90** 인 row 개수 — 거의 46 개 모두.
3. **EN vs FFN** 비교 — 둘이 비슷하지만 GAN 이 둘 다 압도.

**핵심 발견**:
- GAN 의 EV: 46 개 모두 1 등.
- GAN 의 XS-R²: 거의 모두 > 90% (paper "all 46 ... cross-sectional R² higher than 90%").
- 가장 큰 격차 (GAN 우위): ST_REV (r12_2 momentum), IdioVol, Variance (Past Returns + Trading Frictions).
- 가장 작은 격차 (모든 모델 잘): size (LME), value (BEME) — well-known easy.

---

paper Table III 의 **정확한 수치** (46 chars 전부):

| Charact. | EN EV | FFN EV | **GAN EV** | EN XS-R² | FFN XS-R² | **GAN XS-R²** | | Charact. | EN EV | FFN EV | **GAN EV** | EN XS-R² | FFN XS-R² | **GAN XS-R²** |
|----------|-------|--------|------------|----------|-----------|---------------|---|----------|-------|--------|------------|----------|-----------|---------------|
| ST_REV | 0.43 | 0.58 | **0.70** | 0.45 | 0.79 | **0.94** | | Q | 0.68 | 0.70 | **0.78** | 0.97 | 0.92 | 0.96 |
| SUV | 0.42 | 0.75 | **0.83** | 0.64 | 0.97 | **0.99** | | Investment | 0.54 | 0.65 | **0.75** | 0.91 | 0.94 | 0.98 |
| r12_2 | 0.26 | 0.27 | **0.54** | 0.66 | 0.71 | **0.93** | | PM | 0.52 | 0.42 | 0.68 | 0.90 | 0.86 | 0.93 |
| NOA | 0.58 | 0.69 | **0.78** | 0.94 | 0.96 | 0.95 | | DPI2A | 0.57 | 0.70 | **0.78** | 0.90 | 0.95 | 0.97 |
| SGA2S | 0.52 | 0.63 | 0.73 | 0.93 | 0.95 | 0.96 | | ROE | 0.59 | 0.56 | 0.76 | 0.91 | 0.86 | 0.97 |
| LME | 0.83 | 0.78 | **0.86** | 0.96 | 0.95 | 0.97 | | S2P | 0.69 | 0.79 | 0.82 | 0.98 | 0.98 | 0.97 |
| RNA | 0.50 | 0.48 | 0.69 | 0.93 | 0.87 | 0.96 | | FC2Y | 0.56 | 0.71 | 0.76 | 0.91 | 0.94 | 0.95 |
| LTurnover | 0.52 | 0.57 | 0.68 | 0.88 | 0.89 | 0.96 | | AC | 0.63 | 0.79 | 0.82 | 0.96 | 0.98 | 0.98 |
| Lev | 0.52 | 0.63 | 0.73 | 0.90 | 0.92 | 0.95 | | CTO | 0.59 | 0.73 | 0.79 | 0.92 | 0.96 | 0.97 |
| Resid_Var | 0.52 | 0.27 | 0.65 | 0.84 | 0.73 | 0.97 | | LT_Rev | 0.60 | 0.59 | 0.72 | 0.93 | 0.85 | 0.94 |
| ROA | 0.51 | 0.44 | 0.70 | 0.92 | 0.93 | 0.98 | | OP | 0.56 | 0.48 | 0.74 | 0.97 | 0.88 | 0.98 |
| E2P | 0.48 | 0.44 | 0.67 | 0.86 | 0.80 | 0.95 | | PROF | 0.58 | 0.62 | 0.76 | 0.91 | 0.98 | 0.95 |
| D2P | 0.47 | 0.51 | 0.72 | 0.82 | 0.85 | 0.94 | | IdioVol | 0.43 | 0.27 | **0.66** | 0.79 | 0.72 | **0.97** |
| Spread | 0.49 | 0.32 | 0.60 | 0.76 | 0.71 | 0.92 | | r12_7 | 0.37 | 0.42 | 0.66 | 0.84 | 0.86 | 0.93 |
| CF2P | 0.46 | 0.47 | 0.66 | 0.90 | 0.89 | 0.99 | | Beta | 0.45 | 0.46 | 0.62 | 0.83 | 0.87 | 0.97 |
| BEME | 0.70 | 0.75 | **0.82** | 0.97 | 0.94 | 0.98 | | OA | 0.65 | 0.78 | 0.83 | 0.88 | 0.92 | 0.93 |
| Variance | 0.48 | 0.27 | **0.61** | 0.74 | 0.72 | 0.90 | | ATO | 0.58 | 0.70 | 0.77 | 0.96 | 0.98 | 0.99 |
| D2A | 0.57 | 0.71 | 0.78 | 0.96 | 0.96 | 0.97 | | MktBeta | 0.44 | 0.44 | 0.64 | 0.81 | 0.85 | 0.97 |
| PCM | 0.66 | 0.79 | 0.82 | 0.97 | 0.98 | 0.99 | | OL | 0.60 | 0.73 | 0.78 | 0.95 | 0.97 | 0.97 |
| A2ME | 0.72 | 0.79 | 0.83 | 0.97 | 0.96 | 0.98 | | C | 0.51 | 0.65 | 0.73 | 0.90 | 0.93 | 0.95 |
| AT | 0.77 | 0.70 | 0.83 | 0.77 | 0.89 | 0.92 | | r36_13 | 0.54 | 0.53 | 0.69 | 0.92 | 0.82 | 0.93 |
| Rel2High | 0.46 | 0.33 | 0.60 | 0.90 | 0.83 | 0.97 | | NI | 0.51 | 0.60 | 0.75 | 0.88 | 0.96 | 0.99 |
| CF | 0.61 | 0.64 | 0.78 | 0.89 | 0.85 | 0.96 | | r2_1 | 0.51 | 0.52 | 0.69 | 0.87 | 0.90 | 0.95 |

(46 chars 전부, paper Table III)

### Step 1 — 표의 구조 이해

**축**:
- **세로 (rows)**: 46 anomaly characteristics (paper 가 2 columns 으로 배열, 행 23 + 23).
- **가로 (columns)**: 6 columns × 2 (paper 의 2-column layout 으로 12 cells per row).
  - Each row group: EV (EN/FFN/GAN) + XS-R² (EN/FFN/GAN).
- **값**: ratio (0 to 1).

### Step 2 — 46 characteristics 의 정확한 카테고리

paper Appendix 의 6 category 분류:

| Category | 개수 | 대표 chars |
|----------|------|-----------|
| **Past Returns** | 6 | ST_REV, LT_Rev, r12_2 (momentum), r12_7, r36_13, r2_1 |
| **Trading Frictions** | 9 | SUV, LME (size), LTurnover, Variance, IdioVol, Spread, Beta, MktBeta, Rel2High, Resid_Var |
| **Value** | 9 | BEME, D2P, E2P, A2ME, CF2P, Q, S2P, OP, PROF |
| **Profitability** | 8 | ROA, ROE, PM, RNA, OL, ATO, NI, CTO |
| **Investment** | 5 | Investment, NOA, DPI2A, Lev, OA |
| **Intangibles** | 9 | AT, AC, C, CF, D2A, FC2Y, PCM, SGA2S, Q |

→ paper Figs 11, 12 의 색은 이 6 카테고리 색.

### Step 3 — 각 cell 의 의미

**EV (Explained Variation)**:
- 한 anomaly 의 10 decile portfolio 의 시계열 변동 중 모델이 설명하는 비율.
- 예: GAN ST_REV EV = 0.70 → "ST_REV 10 deciles 의 월간 변동의 70% 를 GAN 의 SDF 가 설명".

**XS-R² (Cross-Sectional R²)**:
- 10 decile portfolio 의 mean return 차이를 모델이 예측하는 R².
- 예: GAN ST_REV XS-R² = 0.94 → "ST_REV 10 deciles 의 평균 수익률 spread 의 94% 를 GAN 이 예측".

### Step 4 — 굵게 (bold) cell 의 분석

**EV column**: 46/46 cell 에서 GAN best.

**XS-R² column**: 거의 모두 GAN best.
- 예외: NOA (GAN 0.95 < EN 0.94 / FFN 0.96 — FFN 약간 우위).
- 예외: PROF (GAN 0.95 < FFN 0.98).
- 예외: S2P (GAN 0.97 = EN 0.98 — EN 약간 우위).
- 등등 일부.

→ 그러나 EN/FFN 이 약간 우위인 경우는 모두 **값이 0.95+ 로 매우 높음** — "모든 모델이 거의 perfect 하게 가격결정 가능한 easy anomaly" (paper 본문).

### Step 5 — 가장 큰 격차의 anomaly

GAN 이 EN/FFN 대비 가장 크게 우위인 anomaly:

| Char | EN EV | FFN EV | GAN EV | GAN 우위 |
|------|-------|--------|--------|---------|
| **r12_2** (momentum) | 0.26 | 0.27 | 0.54 | **2x** EV |
| **IdioVol** | 0.43 | 0.27 | 0.66 | 1.5-2.5x EV |
| **Variance** | 0.48 | 0.27 | 0.61 | 1.3-2.3x EV |
| **Spread** | 0.49 | 0.32 | 0.60 | 1.2-1.9x EV |
| **Resid_Var** | 0.52 | 0.27 | 0.65 | 1.3-2.4x EV |
| **Rel2High** | 0.46 | 0.33 | 0.60 | 1.3-1.8x EV |

→ 공통점: **Trading Frictions** + **Past Returns** (momentum/reversal) 영역에서 GAN 우위 가장 큼.

### Step 6 — 가장 작은 격차의 anomaly (easy to price)

모든 모델이 잘 함:

| Char | EN EV | FFN EV | GAN EV | 한 줄 |
|------|-------|--------|--------|------|
| **LME** (size) | 0.83 | 0.78 | 0.86 | size effect — well-known |
| **BEME** (book-to-market) | 0.70 | 0.75 | 0.82 | value effect — well-known |
| **AT** | 0.77 | 0.70 | 0.83 | total assets |
| **A2ME** | 0.72 | 0.79 | 0.83 | assets to market |
| **NOA** | 0.58 | 0.69 | 0.78 | net operating assets |

→ Size, value, asset growth 같은 **고전적 well-studied anomaly** 들은 선형 모델도 잘함.

### Step 7 — 핵심 발견 ❶ (paper p.30)

paper:
> "It is striking that **GAN is always better than the other two models in explaining variation**. At the same time **GAN achieves a cross-sectional R² higher than 90% for all characteristics**. In the few cases where the other models have a slightly higher cross-sectional R², this number is very close to 1, i.e. all models can essentially perfectly explain the pricing information in the deciles."

**번역**:
- GAN 이 EV 항상 best (46/46).
- GAN 의 XS-R² 가 모든 anomaly 에서 > 90%.
- 예외 경우는 모두 0.95+ 영역 — 모든 모델이 거의 perfect.

### Step 8 — 핵심 발견 ❷ — GAN 우위의 분해

paper p.31:
> "The results show (1) that the **non-linearities and interactions matter** as GAN is better than EN and (2) **the no-arbitrage condition extracts additional information** as GAN is better than FFN."

**GAN 우위 = (1) nonlinearity + (2) no-arbitrage 의 곱**:
- GAN > EN: nonlinearity 효과 (FFN 도 좋아짐).
- GAN > FFN: no-arbitrage 효과 (EN 도 좋아짐).
- GAN = nonlinearity + no-arbitrage = **둘의 곱**.

### Step 9 — Interactive viz

```viz:dlap-table3-portfolios:title=paper Table III — 46 anomaly decile portfolios (interactive),caption=Metric 토글로 EV / XS-R² 전환. Sort 슬라이더로 차이가 큰 anomaly 우선 정렬. 46개 anomaly 전부에서 GAN 의 EV 가 EN/FFN 보다 best, XS-R² 는 거의 모두 > 90%. ST_REV / momentum / IdioVol 에서 GAN 우위 가장 크게 벌어짐 — 비선형 + interaction 효과. paper Table III 정확 수치.
```

### Step 10 — Table III 의 6 카테고리별 패턴 분석

46 chars 를 6 anomaly category 별로 grouping 하여 평균 EV 와 XS-R² 분석:

| Category | Avg EN EV | Avg FFN EV | Avg GAN EV | Avg GAN XS-R² | 패턴 |
|----------|-----------|-----------|----------|-------------|------|
| **Past Returns** (ST_REV, r12_2, r12_7, r2_1, r36_13, LT_Rev) | 0.43 | 0.43 | **0.62** | **0.93** | GAN 의 큰 우위 — 비선형 강함 |
| **Trading Frictions** (SUV, LME, LTurnover, Spread, Variance, IdioVol, Beta, MktBeta, Rel2High, Resid_Var) | 0.52 | 0.50 | **0.72** | **0.95** | GAN 우위, mid range |
| **Value** (BEME, D2P, E2P, A2ME, CF2P, Q, S2P, OP, PROF) | 0.56 | 0.59 | **0.74** | **0.96** | 모든 모델 잘 — "easy" anomaly |
| **Profitability** (ROA, ROE, PM, RNA, OL, ATO, NI, CTO) | 0.56 | 0.58 | **0.74** | **0.96** | GAN 약간 우위 |
| **Investment** (Investment, NOA, DPI2A, Lev, OA) | 0.56 | 0.63 | **0.74** | **0.96** | GAN 약간 우위 |
| **Intangibles** (AT, AC, C, CF, D2A, FC2Y, PCM, SGA2S, Q) | 0.57 | 0.61 | **0.76** | **0.96** | 모든 모델 잘 |

### Step 11 — 카테고리별 GAN 우위 정량화

GAN EV / EN EV 비율 (카테고리 평균):
- **Past Returns**: 0.62 / 0.43 = **1.44** (44% 우위) — **최대 우위**.
- **Trading Frictions**: 0.72 / 0.52 = **1.38** (38% 우위).
- **Investment**: 0.74 / 0.56 = **1.32**.
- **Profitability**: 0.74 / 0.56 = **1.32**.
- **Intangibles**: 0.76 / 0.57 = **1.33**.
- **Value**: 0.74 / 0.56 = **1.32**.

→ **Past Returns + Trading Frictions** 에서 GAN 우위 가장 큼. 이는 paper Fig 11 의 top variables (ST_REV, SUV, r12_2 모두 이 두 카테고리) 와 일치.

### Step 12 — 패턴의 의미

**Why Past Returns 가장 큰 우위**:
- Reversal, momentum 효과가 **size 와 interaction** 강함.
- Linear EN: $\omega = \alpha_1 \cdot \text{size} + \alpha_2 \cdot \text{momentum}$ — 곱항 없음.
- GAN: $\omega = f(\text{size}, \text{momentum})$ — interaction 학습.
- → Past Returns 가 가장 nonlinear interaction.

**Why Value/Investment 가 모든 모델 잘**:
- Size, value, BEME 는 **well-known easy** anomalies.
- 60년 학계가 모두 추정 — Linear model 도 OK.
- Marginal 한 GAN 우위.

→ GAN 의 진짜 가치는 **Past Returns + Trading Frictions** 영역 — 이 영역이 GAN 의 비선형 interaction 의 핵심.

---

## 10.4 Figure 9/10 — Predicted vs Actual (paper p.31, 32)

### 📖 처음 보는 사람을 위한 — Figure 9/10 읽는 법

**이 그림이 보여주는 것**: 460 portfolios (46 anomaly × 10 decile) 의 **모델 예측 vs 실제** 비교. 점들이 45° line 가까이 있으면 모델 정확.

**일상 비유 (체중계)**:
- 460 portfolios = "460 사람의 진짜 체중".
- 모델 예측 = "체중계의 측정값".
- 45° line = "예측 = 실제" 라인.
- 점이 line 가까이 → 체중계 정확.
- 점이 흩어짐 → 체중계 부정확.

**그림의 구조**:
- **2×2 sub-panel**: (a) GAN / (b) FFN / (c) EN / (d) LS.
- **각 panel 의 축**:
  - X축: actual mean excess return (실제 평균).
  - Y축: projected excess return (모델 예측).
  - 검은 직선: 45° line (perfect fit).
- **점 색**: 6 anomaly category (Trading Frictions, Value, Intangibles, Profitability, Investment, Past Returns).

**Fig 9 (Value-weighted, VW) vs Fig 10 (Equally-weighted, EW)**:
- 동일한 4 sub-panel.
- VW = 시가총액 비례 가중 / EW = 모든 stock 동일 가중.
- EW 가 약간 더 좋음 (small stock noise 약화).
- 그러나 모델 ranking 동일: GAN > EN ≈ FFN > LS.

**어디부터 보면 되나**:
1. **(a) GAN**: 점들이 line 가까이 집중 — best.
2. **(d) LS**: 점들이 흩어짐 + 일부 음수 — worst.
3. 6 색 (category) 별로 어디에 위치하나 — 모든 category 가 잘 위치하면 모델이 robust.

**핵심 발견**:
- GAN: 점들이 line 따라 monotonic, 약간 mean 으로 bias (regularization 효과).
- LS: scatter 가장 큼.

---

(paper Fig. 9, p.31)

### Step 1 — 그림의 구조 이해

**축**:
- **4 subpanels** (2×2 grid): (a) GAN, (b) FFN, (c) EN, (d) LS.
- **각 subpanel 의 축**:
  - X-axis: Excess return (actual mean, monthly).
  - Y-axis: Projected Excess Return (model 예측 mean).
  - 점: 460 portfolio (46 chars × 10 deciles).
  - 색: 6 category (Trading Frictions, Value, Intangibles, Profitability, Investment, Past Returns).
  - **검은 직선**: 45-degree line (perfect fit).

### Step 2 — 이상적 모델의 시각화

**Perfect prediction**: 모든 점이 45-degree line 위에 있어야 함.
- X = Y → "예측이 정확히 actual 과 일치".
- Line 에서 멀리 떨어진 점 = pricing error 큰 portfolio.

### Step 3 — 4 subpanel 비교

#### (a) GAN
- 점이 line 주변에 **밀집**.
- 일부 small scatter — but 전체적으로 monotonic.
- paper 본문: "GAN SDF captures the correct monotonic behavior, but its prediction is biased towards the mean."
- 의미: GAN 은 큰 actual returns 를 약간 낮게 예측 (mean 으로 끌어당김) — regularization 효과.

#### (b) FFN
- (a) 보다 scatter spread 큰.
- 일부 점이 매우 멀리 떨어짐.
- 의미: FFN 의 prediction 이 actual 과 큰 discrepancy.

#### (c) EN
- (a) 보다 약간 더 scatter, 그러나 (b) 보다는 좋음.
- Linear 모델로서 합리적.

#### (d) LS
- 가장 큰 scatter.
- 일부 점이 음수 영역 (Y axis 가 -0.005 시작).
- 의미: Regularization 없는 linear 모델 → 가장 약함.

### Step 4 — 색 (6 category) 분석

각 subpanel 에서:
- **Trading Frictions** (orange): 다양한 위치 — high/low return 모두.
- **Value** (purple): 중-고 return 영역에 집중.
- **Past Returns** (red): high return 영역에 산재.
- **Profitability** (gray): 중간 return.
- **Investment** (green): 중간.
- **Intangibles** (pink): 중간-약간 high.

**관찰**:
- GAN 에서는 모든 색이 line 가까이 — 6 category 모두 잘 가격결정.
- FFN/EN/LS 에서는 일부 색 (특히 Trading Frictions, Past Returns) 이 line 에서 멀리 떨어짐.

### Step 5 — "Biased towards the mean" 의 의미

paper p.31:
> "The GAN SDF captures the correct monotonic behavior, but its prediction is biased towards the mean."

**의미**:
- GAN 의 prediction range 가 actual range 보다 좁음.
- 예: actual = 0.020 인 portfolio 의 GAN 예측 = 0.015 정도.
- 평균으로 끌려옴 (shrinkage).

**왜**:
- L1/L2 regularization 의 자연스러운 효과.
- 극단값 prediction 을 신중하게.
- → **conservative** prediction.

→ Trade-off: 약간의 bias vs 큰 variance 감소. Net 효과 = 좋음.

---

## 10.5 Figure 10 — Predicted vs Actual (Equally Weighted, paper p.32)

(paper Fig. 10, p.32)

### Step 1 — VW vs EW 의 차이

- **Value-weighted (VW, Fig 9)**: 시가총액 비례 가중.
- **Equally-weighted (EW, Fig 10)**: 모든 stock 동등 가중.

→ 다른 weighting 으로 동일한 분석.

### Step 2 — 결과 비교

paper p.31:
> "Figure 10 shows the prediction results for equally weighted decile portfolios. All models seem to perform slightly better, but the general findings are the same."

**EW 가 VW 보다 약간 더 좋은 이유**:
- 작은 stock 의 idiosyncratic noise 가 평균으로 약화.
- VW 는 large stock 이 dominate → 일부 large mispricing 이 큰 impact.
- EW 는 noise diversification 효과.

### Step 3 — 일반적 발견은 동일

- 4 모델의 ranking 동일: GAN > EN ≈ FFN > LS.
- 6 category 의 패턴 유사.
- GAN 의 mean shrinkage 효과 유지.

→ Robustness check: weighting 방식 무관하게 GAN 우위.

---

## 10.6 Double-Sorted Portfolios (Table A.IV)

### 📖 처음 보는 사람을 위한 — Table A.IV 읽는 법

**이 표가 보여주는 것**: Single-sort (한 char 만) 대신 **두 char 동시 sort** (5×5 grid = 25 portfolios) — interaction effect 검증.

**일상 비유 (조합 시험)**:
- Single sort = "수학 시험 점수만" 으로 분류.
- Double sort = "수학 + 영어 점수" 조합 분류 (5×5 grid).
- Corner cell (e.g., 수학 1등 × 영어 1등) = extreme combination.
- Linear 모델 = "두 점수 합" 만 봄 → corner 의 곱 효과 못 잡음.
- GAN = "두 점수 모든 조합" 학습 → corner 도 정확.

**4 portfolio sets** (paper):
- ST_REV × momentum (reversal + 가속도)
- size × BEME (well-known easy)
- size × momentum
- size × ST_REV

**핵심 발견**:
- Single sort 에서는 EN 도 OK.
- **Double sort, 특히 momentum 관련**: **EN collapse** — corner portfolio 못 잡음.
- GAN 만 잘함 — interaction 학습.

→ 본 paper 의 가장 중요한 비선형성 증거 중 하나.

---

paper p.30:
> "Table A.IV repeats the same analysis on short-term reversal and momentum double-sorted and size and book-to-market double-sorted portfolios. The takeaways are similar to the decile sorted portfolios. **GAN outperforms FFN and EN on the momentum related portfolios, while all three models are able to explain the size and value double-sorted portfolios. Importantly, the linear EN becomes worse on the double-sorted reversal and momentum portfolios. This is due to the extreme corner portfolios, which are in particular low momentum and high short-term reversal stocks. This implies that the linear model cannot capture the interaction between characteristics, while the GAN model successfully identifies the potentially non-linear interaction effects.**"

### Step 1 — Double-sorted setup

**Double-sort**:
- 두 characteristic 동시 sort.
- 5×5 = 25 portfolios per pair.
- 4 pairs studied:
  - ST_REV × momentum
  - size × BEME
  - size × momentum
  - 등등.

### Step 2 — Single-sort vs Double-sort 의 행동 차이

| Setup | EN | FFN | GAN |
|-------|-----|-----|-----|
| Single-sort | OK | OK | best |
| Double-sort (size × BEME, easy) | OK | OK | best |
| Double-sort (momentum × ST_REV, hard) | **collapse** | OK | best |

### Step 3 — Why EN collapses on momentum × ST_REV

**Extreme corner portfolios**:
- (small + low momentum) vs (small + high momentum) — extreme cases.
- 두 characteristic 의 곱 효과가 가장 큼.
- Linear EN: $\omega = \alpha_1 \cdot \text{size} + \alpha_2 \cdot \text{momentum}$ — 곱항 없음.
- → Corner portfolios underfit.

**GAN 의 답**:
- Neural network 가 $\omega = f(\text{size}, \text{momentum})$ 의 일반 함수 학습.
- $\partial^2 \omega / \partial \text{size} \partial \text{momentum} \neq 0$ — interaction effect.
- → Corner portfolios 도 정확히 가격결정.

→ **Double-sorted = interaction effect 검증**. Linear EN collapse, GAN 만 잘함.

---

## 10.7 SDF Structure — Section III.G

paper p.36 (Section G):
> "We study the structure of the SDF weights and betas as a function of the characteristics. Our main findings are two-fold: Surprisingly, **individual characteristics have an almost linear effect on the pricing kernel and the risk loadings**, i.e. non-linearities matter less than expected for individual characteristics. Second, **the better performance of GAN is explained by non-linear interaction effects**, i.e. the general functional form of our model is necessary for capturing the dependency between multiple characteristics."

### Step 1 — 두 핵심 발견

#### 발견 1: 개별 특성 → SDF 는 거의 선형

- SDF weight $\omega$ 와 한 char 의 관계를 plot.
- 대부분의 plot 이 **선형** 또는 monotonic.
- 비선형 효과 작음.

→ 그래서 linear EN 도 single-sorted 잘함.

#### 발견 2: 특성 간 interaction 은 비선형

- 두 char 의 contour plot (Fig 14):
  - $\omega = f(\text{ST\_REV}, \text{r12\_2})$ → saddle 또는 dome shape.
  - $\omega = f(\text{LME}, \text{BEME})$ → 강한 multiplicative pattern.
- 비선형 강함.

→ Linear EN 못 잡고 GAN 만 잡음.

### Step 2 — paper Figure 14 의 시각화

(paper p.36+ Figure 14 — SDF weight as function of two characteristics)

**예시 plot**:
- X-axis: characteristic 1 (예: LME).
- Y-axis: characteristic 2 (예: BEME).
- Z-axis (heatmap color): SDF weight $\omega$.

**관찰**:
- 1D slice (한 char fix, 다른 char 변동): 거의 linear.
- 2D contour: multiplicative interaction.

→ GAN 의 진짜 차별점.

### Step 3 — 함의

**Linear models 의 한계**:
- Single-sort 에서는 OK.
- Multiple chars 의 interaction 못 잡음.
- → 실제 가격결정에서는 부족.

**Nonlinear additive models 의 한계** (예: additive splines):
- 각 char 의 nonlinear 효과는 잡음.
- 그러나 char × char 의 cross term 없음.
- → 여전히 interaction 못 잡음.

**GAN 의 답**:
- Neural network 가 general function approximator.
- 모든 interaction 자연스럽게 학습.
- → 진짜 nonparametric.

---

## 10.8 결과 한 그림으로

```
[ Table III — 46 Anomaly Deciles (OOS Test) ]
                                                   
  EN  EV: 0.26 – 0.83   XS-R²: 0.45 – 0.98          
  FFN EV: 0.27 – 0.79   XS-R²: 0.71 – 0.98          
  GAN EV: 0.54 – 0.86   XS-R²: 0.90 – 0.99          
                                                   
  → GAN 의 EV / XS-R² 가 항상 best                  
  → GAN 의 XS-R² 모두 > 90%                         
                                                   
[ 비선형 / no-arb 의 분해 ]                         
  Linear no-arb (EN) > Nonlinear no-no-arb (FFN)    
  Nonlinear no-arb (GAN) > both                     
  → GAN 우위 = (1) nonlinearity + (2) no-arbitrage  
                                                   
[ Fig 9/10 — Predicted vs Actual scatter ]         
  GAN: 점이 45° line 가까이 집중                    
  FFN/EN: scatter spread 큼                         
  LS: 가장 큰 scatter, 일부 음수                    
                                                   
[ Double-sorted (Table A.IV) ]                     
  Single-sorted: EN, FFN 모두 OK                    
  Double-sorted (momentum × ST_REV): EN collapse    
  → Interaction effect 본질                         
                                                   
[ SDF Structure (Sec III.G) ]                      
  Individual char → SDF: 거의 linear                
  Interaction (char × char) → SDF: 강한 nonlinear   
  → GAN 의 진짜 차별점                              
```

---

## 10.9 자기점검 (이 챕터)

### 핵심 5가지
1. **Table III 에서 GAN 이 ST_REV, IdioVol 에서 특히 우위인 이유?**
2. **Single-sorted vs double-sorted 에서 EN 의 행동 차이?**
3. **"Individual char 선형 + interaction 비선형" 의 의미?**
4. **Fig 9 의 "biased towards the mean" 이 GAN 의 약점인가?**
5. **EW vs VW 결과의 일반적 차이는?**

### 답변
1. **ST_REV (1-month reversal)**: 짧은 시계열 reversal 은 **size 와 interaction** 강함 (small stocks 의 reversal 효과가 더 큼). EN 은 size×ST_REV 곱항 못 잡음. **IdioVol**: lottery-like preference 의 비선형 — 매우 낮은 IdioVol 영역에서만 효과 큼. GAN 의 비선형 FFN 이 이를 잡음. EN/FFN 모두 못 잡음.
2. **Single-sorted**: 한 특성 quantile 만. EN 의 선형 weights 로도 monotonic 효과 잘 잡음. **Double-sorted**: 두 특성 quantile cross. extreme corner (예: small + low momentum) 이 가장 mispriced. EN 은 두 특성의 선형 합만 잡고 곱은 못 잡음 → corner portfolio underfit.
3. paper Section III.G 의 발견. **개별 char × SDF**: SDF weight $\omega$ 와 한 char 의 관계가 거의 선형 (Fig 14 의 각 char 별 plot). → linear model 도 single-sorted 잘함. **char × char × SDF**: 두 char 의 contour 가 saddle/dome shape — 강한 nonlinearity. → linear 못 잡고 GAN 만 잡음. **이게 GAN 의 진짜 차별점**.
4. **No, regularization 의 자연스러운 trade-off**. Conservative prediction 으로 variance 감소. Net 효과 (CRPS_sum, EV, XS-R² 모든 지표) 가 다른 모델보다 우수. 약간의 mean-bias 가 variance 감소를 상회. β-sorted portfolios 의 Linear fit R² = 0.97 (Fig 8) 도 이 trade-off 가 OK 임 증명.
5. **EW 가 VW 보다 약간 더 좋은 결과**. 작은 stock 의 idiosyncratic noise 가 평균으로 약화 → noise diversification. VW 는 large stock 이 dominate. 다만 **일반적 ranking 동일** (GAN > EN ≈ FFN > LS) → robustness check.

---

다음 [11_var_importance_macro.md](11_var_importance_macro.md) 에서 변수 중요도 + LSTM hidden states 분석.
