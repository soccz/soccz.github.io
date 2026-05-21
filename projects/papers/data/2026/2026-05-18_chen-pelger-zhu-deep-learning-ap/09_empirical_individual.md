# 09. 실증 결과 — Individual Stocks (Section III.C–D)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Table I (4 models 비교) — 본 논문의 가장 중요한 표
- Tables II, III, IV — 다른 robustness 검정
- 정확한 수치 + 해석

---

paper p.25-29 (Section III.C, III.D). **Table I + Figure 6 (macro inclusion) + Figure 7 (cumulative returns) + Figure 8 (β linear fit) + Table II (pricing errors)**.

이 챕터의 목표: **표/그림을 어떻게 읽고 무엇을 봐야 하는지**, 그리고 paper 의 핵심 주장 "GAN 이 모든 metric 에서 압도" 가 무엇을 의미하는지.

---

## 9.1 챕터 한 줄 요약

paper Table I: **GAN 이 SR/EV/XS-R² 모든 지표에서 압도** (OOS test 1992–2016).
- 월간 SR: GAN 0.75 vs FFN 0.44 vs EN 0.50 vs LS 0.42.
- 연간 환산 (× √12): GAN **2.6** vs FFN 1.5 vs EN/LS 1.7 vs FF5 0.8.
- 핵심 발견: **EN (linear no-arb) ≥ FFN (nonlinear no-no-arb)** — no-arbitrage 가 ML flexibility 보다 더 중요.

---

## 9.2 Table I — 4 Model Performance (paper p.26)

### 📖 처음 보는 사람을 위한 — Table I 읽는 법 (★ 본 논문의 가장 중요한 표)

**이 표가 비교하는 것**: 4 모델 (LS, EN, FFN, **GAN**) × 3 metric (SR, EV, XS-R²) × 3 sample (Train, Valid, **Test**) = 36 cells. **GAN (본 논문) 이 Test 의 모든 metric 에서 1 위**.

**용어 풀이 — 이것만 알면 표 읽힘**:

| 용어 | 의미 | 일상 비유 |
|------|------|-----------|
| **LS** | Least Squares (가장 단순 선형) | "공식 1 개로 답 찾기" |
| **EN** | Elastic Net (선형 + 정규화) | "공식 + 변수 선택" |
| **FFN** | Feedforward Network (비선형, no-arb 무시) | "ML 자유롭게, 이론 무시" |
| **GAN** | 본 논문 (비선형 + no-arbitrage + adversarial test asset) | "ML + 이론 결합 + 최악 test 자동 생성" |
| **SR** | Sharpe Ratio (위험 1 단위당 초과수익) | "롤러코스터 강도 1 단위당 보너스" |
| **EV** | Explained Variation (변동 설명력) | "오늘 일어난 일 얼마나 설명?" |
| **XS-R²** | Cross-Sectional R² (횡단면 평균 설명력) | "이 자산 평균 수익 예측?" |
| **Test** | OOS 1992-2016 (25 년) | "**한 번도 안 본** 본시험" |

**Test 만 봐도 충분 — Train/Valid 는 fit 검증용**.

### 🔣 4-단 기호 풀이 (Table I 의 핵심 7 용어)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| **LS** | Ordinary Least Squares (선형 OLS) | "모든 학생 평균만 보고 답하기" | 정규화 X → overfit 심함 (Train SR 1.80 vs Test 0.42) |
| **EN** | Elastic Net (L1+L2 regularized linear) | "공식 + 중요 변수만 골라쓰기" | linear+no-arb → strongest baseline |
| **FFN** | Feedforward Network (nonlinear, mean-MSE loss) | "ML 자유롭게, 이론 무시" | no-no-arbitrage → EN 보다 못함 (★ 핵심 발견) |
| **GAN** | 본 논문 (nonlinear + no-arb + adversarial g) | "ML + 이론 + 최악 시험 자동생성" | 모든 cell 굵게 (best) |
| **SR (Sharpe Ratio)** | 위험 1 단위당 초과수익 (monthly) | "롤러코스터 강도 1 단위당 보너스" | annualize × √12 (월간 0.75 → 연간 2.6 — 천문학적) |
| **EV (Explained Variation)** | $1 - \mathrm{Var}(\text{residual})/\mathrm{Var}(R)$ | "오늘 일어난 일 얼마나 설명?" | time-series 변동성 설명 (R² 와 다름) |
| **XS-R² (Cross-Sectional)** | 횡단면 평균 수익 설명력 | "이 회사의 장기 평균 예측?" | overall asset pricing 의 핵심 지표 |

**🌱**: **EN Test SR 0.50 > FFN Test SR 0.44** 가 본 논문의 가장 큰 발견 — "linear+이론 (EN) 이 nonlinear+이론없음 (FFN) 보다 낫다". 즉 "**ML flexibility 보다 도메인 이론 (no-arbitrage) 이 더 중요**". GAN 은 둘 다 결합 → 0.75 압도.

**3 개만 보면 됨 (Test 기준)**:
1. **GAN Test SR = 0.75** — FFN (0.44), EN (0.50), LS (0.42) 압도. **모두 50%~78% 이상 우위**.
2. **GAN Test EV = 0.08** — 다른 모델 (~0.03-0.04) 의 2배.
3. **GAN Test XS-R² = 0.23** — 다른 모델 (~0.14-0.19) 보다 우위.

**핵심 발견 — 본 논문의 메시지**:
- **EN (linear, no-arb) Test SR = 0.50** > **FFN (nonlinear, no-no-arb) = 0.44**.
- 즉 "비선형성 보다 **no-arbitrage 이론 제약** 이 더 결정적"!
- → ML 자유도 만으로는 부족. **도메인 이론** 이 필수.

**한 줄 결론**:
> "GAN 이 모든 metric 에서 압도 + EN > FFN 의 의미로 **이론 > ML flexibility** 입증. 본 논문의 핵심 메시지."

**원문 위치**: paper Table I, journal p.26.

---

paper Table I 의 정확한 수치:

| Model | Train SR | Valid SR | **Test SR** | Train EV | Valid EV | **Test EV** | Train XS-R² | Valid XS-R² | **Test XS-R²** |
|-------|----------|----------|-------------|----------|----------|-------------|-------------|-------------|----------------|
| LS    | 1.80     | 0.58     | **0.42**    | 0.09     | 0.03     | **0.03**    | 0.15        | 0.00        | **0.14**       |
| EN    | 1.37     | 1.15     | **0.50**    | 0.12     | 0.05     | **0.04**    | 0.17        | 0.02        | **0.19**       |
| FFN   | 0.45     | 0.42     | **0.44**    | 0.11     | 0.04     | **0.04**    | 0.14        | -0.00       | **0.15**       |
| **GAN** | **2.68** | **1.43** | **0.75**  | **0.20** | **0.09** | **0.08**    | **0.12**    | **0.01**    | **0.23**       |

### Step 1 — 표의 구조 이해

**축 (axes)**:
- **세로 (rows)**: 4 개 모델 (LS, EN, FFN, GAN — 단순한 순으로).
  - LS = Least Squares (간단한 선형 OLS).
  - EN = Elastic Net (선형 + L1/L2 정규화).
  - FFN = Feed-Forward Network (비선형 + no-arb 없이 mean 예측).
  - GAN = paper 의 본 모델 (비선형 + no-arb + adversarial test asset).
  - **마지막 row = GAN** (paper 의 모델, 모든 cell 굵게).
- **가로 (columns)**: 3 metric × 3 sample = 9 columns.
  - **3 metric**: SR (Sharpe ratio), EV (Explained Variation), XS-R² (cross-sectional R²).
  - **3 sample**: Train (1967-1986), Valid (1987-1991), Test (1992-2016).
- **값**: numeric, **higher is better** ↑ (직관과 일치, paper 가 별도 표시 안 함).

### Step 2 — 3 metric 의 의미

| Metric | 정의 | 의미 | Higher better? |
|--------|------|------|---------------|
| **SR (Sharpe Ratio)** | SDF portfolio 의 월간 평균 / 표준편차 | "위험 단위당 수익" | ✓ |
| **EV (Explained Variation)** | $1 - \text{Var}(\text{residual}) / \text{Var}(R)$ | 시계열 변동 설명력 | ✓ |
| **XS-R² (Cross-Sectional R²)** | 횡단면 mean return 의 회귀 R² | 평균 수익 설명력 | ✓ |

**왜 3 metric 인가**:
- SR: SDF 의 **실용 가치** (어떤 portfolio 를 만들 수 있나).
- EV: 모델이 **시계열 변동** 을 얼마나 잡나 (Var(R) 의 어느 비율).
- XS-R²: 모델이 **횡단면 평균** 을 얼마나 잡나 (자산 간 mean return 차이).
- 세 가지가 다른 측면. 모두 좋아야 진짜 "좋은 모델".

### Step 3 — 3 sample 의 의미

| Sample | 기간 | 역할 |
|--------|------|------|
| **Train** | 1967-1986 (20년) | 모델 학습 |
| **Valid** | 1987-1991 (5년) | Hyperparameter 튜닝 |
| **Test** | 1992-2016 (25년) | **최종 평가 (OOS)** |

**왜 이런 분할인가**:
- Time series 의 표준 split — temporal order 유지.
- Train 으로 학습, Valid 로 hyperparameter 선택, Test 로 최종 평가.
- Test 가 **가장 중요** — 진짜 OOS 성능.

**왜 Train SR 이 Test 보다 훨씬 큰가** (모든 모델):
- 모델이 train 에서 overfit.
- 신경망의 일반적 패턴.
- Test 의 성능 차이가 진짜 모델 quality 차이.

### Step 4 — "Lower validation 보다 Test 가 낮은 이유"

Valid 1987-1991 → Test 1992-2016.
- LS Valid SR 0.58 → Test SR 0.42 (큰 drop).
- EN Valid SR 1.15 → Test SR 0.50 (큰 drop).
- GAN Valid SR 1.43 → Test SR 0.75 (큰 drop 이지만 절대값 best).

**이유**:
1. **Time-varying risk premia** — 다른 시기에는 다른 패턴.
2. Valid (5년) 가 Test (25년) 보다 짧음 — Valid 의 표본 변동.
3. 1987 crash 같은 특이 사건이 Valid 에 들어 있음.

→ paper 가 강조 (footnote 33): Pesaran-Timmermann (1996) 의 time variation in risk premia.

### Step 5 — Model 별 ranking 분석 (Test 기준)

#### Test SR (월간 Sharpe ratio)

```
GAN  ████████████████  0.75  ← best
EN   ███████████       0.50
FFN  █████████         0.44
LS   ████████          0.42
```

**연간 환산** (× √12):
- GAN 2.6, EN 1.73, FFN 1.52, LS 1.45.
- paper p.4 본문: "annual out-of-sample Sharpe ratio of 2.6".

#### Test EV (explained variation)

```
GAN  ████████  0.08  ← best
EN   ████      0.04
FFN  ████      0.04
LS   ███       0.03
```

**의미**: GAN 이 **2배** EV — "GAN 은 stock return 의 8% 를 설명, 나머지는 3-4% 만".

#### Test XS-R² (cross-sectional mean explanation)

```
GAN  ████████████  0.23  ← best
EN   ██████████    0.19
FFN  ████████      0.15
LS   ███████       0.14
```

**의미**: GAN 이 횡단면 mean return 의 **23% 설명** — 다른 모델 14-19%.

### Step 6 — 핵심 발견 ❶ — GAN 압도

**Test 의 모든 metric 에서 GAN best**:
- SR: 50% 우위 (GAN 0.75 vs 2nd EN 0.50).
- EV: 2x 우위 (GAN 0.08 vs others 0.03-0.04).
- XS-R²: 1.2-1.6x 우위 (GAN 0.23 vs others 0.14-0.19).

→ **모든 차원에서 SOTA**.

### Step 7 — 핵심 발견 ❷ — EN ≥ FFN (no-arbitrage > flexibility)

paper p.25-26 본문 (가장 중요한 한 줄):
> "Interestingly, the regularized linear model based on the no-arbitrage objective function explains the time-series and cross-section of stock returns at least as good as the flexible neural network without the no-arbitrage condition."

**의미**:
- EN = **linear** + no-arbitrage objective.
- FFN = **nonlinear** + 그냥 mean prediction (no no-arbitrage).
- EN Test EV (0.04) ≥ FFN (0.04) — tie.
- EN Test XS-R² (0.19) > FFN (0.15) — EN 우위.
- EN Test SR (0.50) > FFN (0.44) — EN 우위.

→ **선형 + no-arb 가 비선형 + no-no-arb 보다 좋다**.

**이게 paper 의 가장 큰 메시지**:
- ML 의 nonlinearity 자체보다 **이론적 제약** 이 더 중요.
- No-arbitrage 가 risk premium signal 을 noise 에서 분리.
- "Off-the-shelf simple prediction approaches can perform worse than even linear no-arbitrage models" (paper Abstract).

### Step 8 — GAN 의 우위는 어디서 오나 (분해)

GAN 의 우위 = (선형 → 비선형) + (no-no-arb → no-arb) 의 **곱**.

| 변화 | 효과 (Test SR 기준) |
|------|----------------|
| LS → EN | 0.42 → 0.50 (정규화 효과) |
| EN → GAN (선형→비선형, no-arb 유지) | 0.50 → 0.75 (+50%, 비선형 효과) |
| FFN → GAN (no-no-arb → no-arb, 비선형 유지) | 0.44 → 0.75 (+70%, no-arb 효과) |

→ **GAN = 비선형 × no-arbitrage 의 시너지**. 단독으로는 EN/FFN 정도.

### Step 9 — Interactive viz

```viz:dlap-sdf-performance:title=paper Table I — 4 SDF Models (interactive),caption=Metric 토글로 SR / EV / XS-R² 전환. Sample 토글로 Train / Valid / Test 전환. GAN 이 모든 metric/sample 에서 best. 핵심 발견: EN (linear no-arb) > FFN (nonlinear no-no-arb) — no-arbitrage 가 ML flexibility 보다 더 중요.
```

---

## 9.3 Figure 6 — Macro Inclusion 의 효과 (paper p.27)

![Fig. 6 — Performance with different macroeconomic variables](figures/page27_macro_inclusion.png)

(Figure 6, paper p.27)

### 📖 처음 보는 사람을 위한 — Figure 6 읽는 법

**이 그림이 비교하는 것**: "거시경제 데이터 (실업률·금리·물가 등 178개) 를 모델에 **어떻게 넣어야** 가장 좋은가?".

세 가지 방법을 비교:
1. **LSTM hidden state** (똑똑하게 압축) — 본 논문 권장.
2. **No macro** (안 쓰기) — 안 쓰는 게 차라리 나음?
3. **All macro raw** (날것 다 넣기) — 직접 다 넣음.

**일상 비유 (요리)**:
- LSTM hidden state = "양념 미리 잘 섞어 두기" — 맛 좋음.
- No macro = "양념 빼고 재료만" — 평범하지만 안전.
- All macro raw = "양념 178가지를 다 한꺼번에 넣기" — 망함.

**X-axis (가로)**: Sharpe ratio (높을수록 좋음). Test panel 의 가로 길이를 비교.
**Y-axis (세로)**: 9 가지 모델 setup (위가 좋고 아래가 나쁨, 색깔별로 그룹).

**막대 색깔의 의미**:
- **빨간 (top)**: GAN (hidden state) — 본 논문 baseline.
- **주황**: GAN/FFN/EN/LS (no macro) — macro 안 씀.
- **노랑 (bottom)**: 모든 모델 (all macro raw) — 다 망함.

**어디부터 보면 되나**: Test panel 의 **GAN (hidden state) 막대 (top, 빨강) 가 가장 길고**, **All macro raw (bottom, 노랑) 가 가장 짧음** → 결론.

---

### Step 1 — 그림의 구조 이해

**축**:
- **3 panels** (가로 배치): Test / Validation / Training.
- **각 panel 의 세로 (rows)**: 9 models (위→아래).
- **각 panel 의 가로 (X-axis)**: monthly Sharpe ratio (0.0 ~ ~1.5 in Valid; ~3 in Train; ~0.75 in Test).
- **막대 색**: 모델 그룹별 (GAN red, others orange/yellow).

### Step 2 — 9 models 의 정확한 구성

| Group | Models | Macro 사용 방식 |
|-------|--------|-------------|
| **Baseline** (top) | GAN (hidden state) | LSTM 으로 4 hidden states 추출 ← paper 의 기본 모델 |
| **UNC** | UNC | g = constant (no adversarial), hidden states 사용 |
| **No macro** | GAN/FFN/EN/LS (no macro) | macro 안 씀 |
| **All macro raw** (bottom) | GAN/FFN/EN/LS (all macro) | 178 raw macro 차분 직접 사용 (no LSTM) |

### Step 3 — Test panel (왼쪽) 읽기 — 가장 중요

```
GAN (hidden states):     ~0.75  ← reference, paper Table I 의 GAN
UNC:                     ~0.55  ← g=상수, 20% lower than GAN
GAN (no macro):          ~0.65  ← firm chars only, 10% lower
FFN (no macro):          ~0.45  ← Table I 의 FFN
EN (no macro):           ~0.50  ← Table I 의 EN
LS (no macro):           ~0.40  ← Table I 의 LS
GAN (all macro raw):     ~0.10  ← collapses!
FFN (all macro raw):     ~0.15  ← collapses!
EN (all macro raw):      ~0.20  ← collapses
LS (all macro raw):      ~0.15  ← collapses
```

**핵심 3 발견**:

1. **GAN (hidden state) = best (~0.75)** — paper 의 기본 모델 정당화.
2. **GAN (all macro raw) = collapse (~0.10)** — 178 raw 차분 → noise 폭증.
3. **UNC ~ 0.55** — g=상수 (no adversarial) → 20% drop. Adversarial 의 가치.

### Step 4 — Training panel (오른쪽) 의 의미

Training panel 에서:
- 모든 모델이 매우 큰 SR (1-3) — overfitting 의 증거.
- All macro raw 도 train 에서는 OK (~2-2.5) — 학습 시에는 178 차분 다 외움.
- 그러나 generalize 못 함 → Test 에서 collapse.

→ paper 가 강조: "complete overfitting when the large number of macroeconomic variables is included" (p.26).

### Step 5 — Validation panel 의 역할

Validation 1987-1991 — 5년만.
- Train 보다 낮고, Test 보다 약간 높음.
- Hyperparameter 선택 시 사용한 metric.
- 이 metric 으로 LS/EN/FFN 의 "no macro" 가 최적으로 선택됨 (paper Table I 의 baseline 들).

### Step 6 — "All macro raw" 가 "No macro" 보다도 나쁜 이유

paper p.26 (footnote 32 근처):
> "Including the large number of irrelevant variables actually lowers the performance compared to a model without macroeconomic information."

**이유**:
1. **Signal-to-noise ratio 폭증**: 178 raw 차분 중 진짜 signal 은 소수. 나머지가 noise.
2. **Dynamic pattern 손실**: raw 차분은 last change 만 — business cycle 의 dynamic pattern 못 잡음.
3. **Regularization 한계**: Dropout 등 정규화도 178 차원의 noise 를 다 제거 못함.

→ **차라리 macro 안 쓰는 게 낫다**.

### Step 7 — UNC vs GAN 의 비교 (Adversarial 의 가치)

| 모델 | Sharpe (Test) | 차이 |
|------|------------|------|
| GAN | 0.75 | reference |
| UNC | ~0.55 | -27% (≈ 20% lower as paper 명시) |

**UNC = "GAN with g=constant"**:
- 같은 SDF network architecture.
- 같은 LSTM hidden states.
- **차이는 단지 g = 상수** (adversarial test asset 안 만듬).
- → Adversarial 의 효과만 측정.

**결과**: g 가 adversarial 로 학습할 때 SR ~ 0.75. g = constant 로 고정하면 ~ 0.55.
- **20% drop**.
- → Adversarial 이 test asset 자동 생성하는 효과가 결정적.

paper 결론 (p.27):
> "It is not only important to include all characteristics and the hidden states in the weights and loadings of SDF but also in the conditioning function g to identify the assets and times that matter for pricing."

### Step 8 — 4 가지 macro inclusion 의 trade-off 정리

| Setting | Test SR | 결론 |
|---------|---------|------|
| GAN (hidden states) | ~0.75 | 최적 — paper의 baseline |
| GAN (no macro) | ~0.65 | 차선 — firm chars 만으로도 잘함 |
| UNC (hidden + g=const) | ~0.55 | adversarial 없으면 20% 손해 |
| GAN (all macro raw) | ~0.10 | 최악 — raw 데이터는 절대 안 됨 |

→ **순서**: LSTM hidden states (best) > no macro (good) > UNC > all macro raw (collapse).

### Step 9 — Interactive viz

```viz:dlap-macro-ablation:title=paper Fig 6 — Macro inclusion effect (interactive),caption=Sample 토글로 Train/Valid/Test 전환. LSTM hidden states (baseline) vs No macro vs All macro raw vs UNC (g=const). All macro raw 는 collapses — 178 raw 차분이 너무 noisy. UNC 는 ~20% SR 낮음 — adversarial 의 효과. **주의**: paper Fig 6 본문은 정확 수치 미발표 — 본 viz 의 일부 값은 paper 텍스트 표현 ('completely collapses', '~10% lower') + Table I baseline 기반의 추정.
```

---

### 🆚 자매 paper 와의 OOS Sharpe 비교 (월간 SR, Test)

| Paper | Test SR (월간) | Test SR (연간) | 비고 |
|-------|--------------|-------------|------|
| **본 paper (GAN)** | **0.75** | **2.60** | 본 논문 최고 |
| [RPPCA (Lettau-Pelger)](../2026-05-17_lettau-pelger-rppca/00_README.md) | ~0.50 | ~1.73 | 5 factor RP-PCA |
| [Autoencoder (Gu-Kelly-Xiu)](../2026-05-17_gu-kelly-xiu-autoencoder/00_README.md) | ~0.60 | ~2.08 | CA2 6-factor |
| [VOC (Kelly-Malamud-Zhou)](../2026-05-20_kelly-malamud-zhou-virtue-complexity/00_README.md) | ~0.47 | ~1.63 | RFF + ridge |
| Fama-French 5 | ~0.23 | ~0.80 | benchmark |

→ **본 paper GAN 이 모든 동시기 ML 모델 압도**. 핵심 차이: **no-arbitrage adversarial GMM**.

---

## 9.4 Figure 7 — Cumulative Excess Returns (paper p.28)

![Fig. 7 — Cumulative excess return of decile sorted portfolios](figures/page28_cumulative_returns.png)

(Figure 7, paper p.28)

### 📖 처음 보는 사람을 위한 — Figure 7 읽는 법

**이 그림이 보여주는 것**: "GAN 이 추정한 위험 노출도 (β) 기준으로 주식을 **10 그룹** (decile) 으로 나누고, 각 그룹에 1968 년 \$1 씩 투자하면 50년 후 얼마가 되나"의 시계열.

**일상 비유 (마라톤)**:
- 10 명의 마라톤 주자 (decile 1 부터 10 까지).
- X축 = 시간 (50년 = 1968-2018).
- Y축 = 누적 거리 (= 누적 수익).
- **GAN 이 "발 빠를 사람" (high β = decile 10) 을 미리 식별**.
- 결과: decile 10 가 가장 멀리, decile 1 이 가장 못 옴 → GAN 의 예측 능력 증명.

**축 설명**:
- **X축 (1968-2018)**: 50년 시간.
- **Y축 (-75 ~ +125)**: \$1 투자의 누적 수익 (cumulative excess return).

**색 (10 lines)**:
- **Decile 1** (가장 낮은 β): 가장 아래 (50년 후 약 -50, 손실).
- **Decile 10** (가장 높은 β): 가장 위 (50년 후 약 +110).

**어디부터 보면 되나**: **decile 1 (아래) 과 decile 10 (위) 사이 spread** 가 크게 벌어지는지 — 벌어질수록 GAN 의 β 가 미래 수익 예측 잘함.

**핵심 발견**: 10 lines 가 **순서대로** 분리 (단조성) + spread 매우 큼 → **위험 노출이 미래 수익을 예측한다** 의 시각적 증명.

---

### Step 1 — 그림의 구조 이해

**축**:
- **X-axis**: 시간 (1968 → 2018, 50년).
- **Y-axis**: Cumulative excess return (\$, scale -75 to +125).
- **색**: 10 deciles (decile 1 가장 어두운/아래 → decile 10 가장 밝은/위).
- 각 시점에 10 line.

### Step 2 — Decile sort 의 의미

**Decile 1 (lowest β)**:
- 가장 낮은 risk loading.
- 누적 return 가장 약함 — 50년 후 약 -50 (음수, 손실).

**Decile 10 (highest β)**:
- 가장 높은 risk loading.
- 누적 return 가장 강함 — 50년 후 약 +110.

**Spread 매우 큰**:
- Decile 10 - Decile 1 = ~ 160 (50년 누적).
- 월간 평균 환산: 0.48% (Table II 의 10-1 spread 와 일치).

### Step 3 — 그림이 보여주는 4 가지 관찰

1. **단조성 (monotonicity)**: 10 deciles 가 명확히 분리 — 낮은 decile 일수록 낮은 return.
2. **Spread 의 크기**: 10-1 spread 가 매우 큼 — risk loading 이 future return 을 강하게 예측.
3. **일관성**: 50년 동안 패턴 유지 (몇몇 시기는 약하지만 회복).
4. **위기 시 영향**: 1973-74 oil crisis, 1987 black Monday, 2000 dot-com bust, 2008 financial crisis — 모두 큰 drawdown.

### Step 4 — "Risk loading predicts future returns" 의 의미

paper p.27-28:
> "Portfolios based on higher β's have higher subsequent returns. This clearly indicates that risk loadings predict future stock returns. In particular, the highest and lowest deciles clearly separate."

**의미**:
- t 시점의 β 가 t+1 시점의 return 을 예측.
- 즉 risk exposure 가 **사전적으로 (ex ante)** measure 가능.
- No-arbitrage 의 핵심 implication: $E[R^e] = β \cdot E[F]$ 의 실증.

### Step 5 — Interactive viz

```viz:dlap-cumulative-returns:title=paper Fig 7 — Decile portfolio cumulative excess returns (interactive),caption=GAN β 기준 10 decile portfolio 의 OOS Test 1992–2016 (300 months) 누적수익 시계열. Decile 토글로 보고 싶은 분위 on/off. Decile 10 (highest β) 가 가장 가파르게 상승, Decile 1 가장 약함 — risk loading 이 future return 을 단조롭게 예측. **주의**: paper 가 정확 시계열 미발표 — 본 viz 의 series 는 Table II avg returns + Fig 7 shape 기반의 calibrated 재현.
```

---

## 9.5 Figure 8 — β-Mean Linear Relation (paper p.28)

![Fig. 8 — Expected excess returns of β-sorted portfolios as function of β](figures/page29_beta_sorted.png)

(Figure 8, paper p.28)

### 📖 처음 보는 사람을 위한 — Figure 8 읽는 법

**이 그림이 검증하는 것**: 자산가격결정의 **이론적 예측**:
$$\text{기대 수익률} = \text{위험 노출도} \times \text{위험 가격}$$
이 **실제 데이터에서 직선** 으로 나타나는지.

**일상 비유 (월급)**:
- 월급 = 근무시간 × 시급 ← linear (직선) 관계.
- 만약 점들이 직선 위에 잘 찍히면 → 식이 맞음 (R² = 0.97 등).
- 점들이 흩어지면 → 식이 안 맞음.

**3 sub-panel**:
- **(a) 5 quintiles**: 주식을 5 그룹으로 나눔, 5 점.
- **(b) 10 deciles**: 10 그룹, 10 점.
- **(c) 20 quantiles**: 20 그룹, 20 점.

**각 sub-panel 의 축**:
- **X축**: β (위험 노출도, 평균).
- **Y축**: Excess return (월간 평균 수익률).
- **점**: 각 그룹.
- **직선**: 점들에 fit 한 회귀선.

**어디부터 보면 되나**: 모든 점이 직선 위에 얼마나 잘 위치하는지 → **R² > 0.95** (paper) → 거의 perfect 한 linear.

**핵심 발견**: 5/10/20 quantile 모두 **R² = 0.98 / 0.97 / 0.95** → 무 arbitrage 의 이론적 예측이 **실증으로 거의 perfect 하게 확인**.

---

### Step 1 — 그림의 구조 이해

**3 subpanels** (가로 배치):
- **(a)** 5 quintile portfolios.
- **(b)** 10 decile portfolios.
- **(c)** 20 quantile portfolios.

**각 subpanel 의 축**:
- **X-axis**: β (risk loading, 평균값).
- **Y-axis**: Excess return (월간 평균).
- **점**: 각 portfolio (subpanel (a) 는 5점, (b) 10점, (c) 20점).
- **직선**: linear regression fit.

### Step 2 — Linear fit 의 정확한 $R^2$

| Subpanel | Portfolios | $R^2$ |
|----------|-----------|-------|
| (a) | 5 quintiles | **0.98** |
| (b) | 10 deciles | **0.97** |
| (c) | 20 quantiles | **0.95** |

→ **3 모두 R² > 0.95** — almost perfect linear fit.

### Step 3 — No-arbitrage 와의 연결

paper p.28-29:
> "No-arbitrage imposes a linear relationship and a zero intercept."

**이론적 prediction**:
$$E[R^e_i] = \beta_i \cdot E[F]$$
- $E[F]$ = risk premium (factor 의 기대 수익).
- $\beta_i$ = asset $i$ 의 risk loading.
- 두 변수 사이 **linear**, **intercept = 0**.

**Figure 8 의 실증**:
- 모든 점이 직선 위에 거의 정확히 위치 ($R^2 > 0.95$).
- → No-arbitrage 의 이론적 prediction 이 실증적으로 확인.

### Step 4 — Intercept 가 약간 negative 인 이유

paper p.28-29:
> "However, the intercept seems to be slightly below zero. This indicates a very good but not perfect fit."

**왜 intercept ≠ 0**:
- Limit to arbitrage (예: 거래비용, 차익거래 자본 제약).
- 미세한 model misspecification.
- 표본 변동.

→ Paper 가 honest 명시: "very good but not perfect fit".

### Step 5 — 3 subpanel 의 차이가 의미하는 것

(a) → (c) 로 갈수록 portfolio 가 많아짐 (5 → 10 → 20).
- 더 많은 점 → 더 엄격한 검증.
- $R^2$ 가 약간 떨어짐 (0.98 → 0.97 → 0.95) — 자연스러움.
- 그래도 모두 > 0.95 → **모든 quantile level 에서 linear** 가 유지.

### Step 6 — Interactive viz

```viz:dlap-beta-sorted:title=paper Fig 8 — β-sorted portfolios linear fit (interactive),caption=Quantile 토글로 5 / 10 / 20 quantile 전환. β-mean linear relation 의 R² (paper 의 0.98 / 0.97 / 0.95) 재현. **주의**: paper 가 β 의 정확한 decile 값을 본문 미발표 — 본 viz 의 β 값은 Table II 의 avg return 단조성 + R²=0.97 조건에 맞춘 추정.
```

---

## 9.6 Table II — Time Series Pricing Errors (paper p.29)

### 🔣 4-단 기호 풀이 (Table II columns)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| Average Returns | 평균 수익 | "그 decile 의 평균 월간 점수" | full vs test sample 다름 |
| $\alpha$ | factor model α (intercept) | "factor model 이 설명 못한 잔여" | 0 이어야 좋은 model |
| $t$ | t-statistic | "α 가 0 과 통계적으로 다른가" | $|t| > 2$ → 유의 |
| **CAPM α** | market factor 제외한 잔여 | "시장 (1 factor) 빼고도 남음" | single factor |
| **FF3 α** | market+size+value 제외한 잔여 | "Fama-French 3 factor 빼고도 남음" | 3 factor |
| **FF5 α** | + profit+investment 제외한 잔여 | "FF5 factor 빼고도 남음" | 5 factor |
| **GRS test** | 모든 α=0 검정 (F-stat) | "factor model 이 진짜 fit 하나?" | p<0.05 reject |

**🌱**: "**factor model 의 α (잔여) 가 유의 → factor model 이 부족**".

### 📖 처음 보는 사람을 위한 — Table II 읽는 법

**이 표가 보여주는 것**: GAN 의 β 로 만든 10 decile portfolio 의 평균 수익률이 **기존 factor model (CAPM, FF3, FF5) 로 설명되는가**.

**일상 비유 (성적 책임)**:
- 10 decile portfolio = 10 학생의 시험 점수.
- CAPM/FF3/FF5 = 3 가지 "선생님" 의 평가 모델.
- α (alpha) = "이 선생님이 설명 못 한 잔여 점수" — 0 이어야 좋은 모델.
- **본 paper 결과**: α 가 모두 매우 유의 (t > 6) → CAPM/FF3/FF5 **모두 GAN 의 β-portfolio 못 설명**.
- 즉 **GAN 이 진짜 새 risk dimension 발견**.

**표 구조**:
- **행 (12)**: 10 decile + 10-1 spread + GRS test.
- **열**: Average Returns (Full/Test) | Market-Rf α | FF3 α | FF5 α — 각각 Full + Test sub-column.

**값 의미**:
- **Average Returns**: 그 decile 의 평균 월간 excess return.
- **α (alpha)**: factor model 의 절편 — 0 이면 factor model 이 설명.
- **t-stat**: α 가 0 과 통계적으로 다른지 (|t| > 2 이면 유의).
- **GRS test p-value**: 모든 α = 0 검정 (p < 0.05 이면 reject = factor model 부적합).

**어디부터 보면 되나**:
1. **10-1 row** (가장 중요): decile 10 minus decile 1 의 spread. **Test 0.39**, α 들도 0.38, 0.38, 0.39 → spread 의 거의 100% 가 unexplained.
2. **GRS test 의 p**: 0.00 (모든 모델) → **factor model 모두 fail**.
3. **decile 별 α 의 t**: extreme decile (1, 10) 에서 가장 큼 (절댓값 4-10).

**핵심 발견**: CAPM/FF3/FF5 모두 GAN β 의 risk dimension 못 잡음 → **GAN factor 는 진짜 새로움**.

---

paper Table II 정확 일부 수치 (β-sorted decile portfolios):

| Decile | Avg Ret Full | Avg Ret Test | CAPM α Full | CAPM α Test | FF3 α Test | FF5 α Test |
|--------|-------------|--------------|-------------|-------------|------------|------------|
| 1 | -0.12 | -0.02 | -0.19 (t=-8.92) | -0.11 (t=-3.43) | -0.13 (t=-5.01) | -0.12 (t=-4.35) |
| 2 | -0.00 | 0.05 | -0.07 (t=-4.99) | -0.04 (t=-1.56) | -0.05 (t=-3.22) | -0.05 (t=-2.68) |
| 3 | 0.04 | 0.08 | -0.02 (t=-2.01) | -0.00 (t=-0.16) | -0.02 (t=-1.40) | -0.01 (t=-1.05) |
| 4 | 0.07 | 0.09 | -0.00 (t=-0.03) | 0.01 (t=0.68) | -0.00 (t=-0.35) | -0.01 (t=-0.54) |
| 5 | 0.10 | 0.12 | 0.03 (t=2.75) | 0.04 (t=2.50) | 0.03 (t=2.46) | 0.03 (t=2.17) |
| 6 | 0.11 | 0.12 | 0.04 (t=3.16) | 0.05 (t=2.77) | 0.03 (t=2.85) | 0.02 (t=2.20) |
| 7 | 0.14 | 0.15 | 0.07 (t=5.62) | 0.07 (t=3.92) | 0.05 (t=4.39) | 0.04 (t=3.41) |
| 8 | 0.18 | 0.18 | 0.11 (t=7.41) | 0.10 (t=5.12) | 0.08 (t=5.83) | 0.07 (t=4.86) |
| 9 | 0.22 | 0.21 | 0.15 (t=7.83) | 0.13 (t=5.37) | 0.11 (t=5.71) | 0.11 (t=5.39) |
| 10 | 0.37 | 0.37 | 0.29 (t=9.22) | 0.27 (t=6.05) | 0.25 (t=6.27) | 0.27 (t=6.59) |
| **10-1** | **0.48** | **0.39** | **0.47 (t=18.93)** | **0.38 (t=10.29)** | **0.38 (t=10.14)** | **0.39 (t=9.96)** |
| GRS test | | | 42.23, p=0.00 | 11.58, p=0.00 | 11.25, p=0.00 | 10.75, p=0.00 |

### Step 1 — 표의 구조 이해

**축**:
- **세로 (rows)**: 10 deciles + spread (10-1) + GRS test.
- **가로 (columns)**: 5 column groups, each with Full/Test sub-columns.
  - Average Returns: full sample + test sample.
  - CAPM α: market factor 만으로 회귀 후의 intercept.
  - FF3 α: Fama-French 3-factor 회귀의 intercept.
  - FF5 α: Fama-French 5-factor 회귀의 intercept.
- **t**: t-statistic — α 가 0 과 유의하게 다른지.

### Step 2 — 핵심 cell 의 해석

**10-1 spread**:
- Average return: Full 0.48 → Test 0.39 (월간, %).
- 연간 환산: ~5.8% (Full) / ~4.7% (Test).
- 매우 큰 spread.

**CAPM α (10-1 Test)**: 0.38 (t=10.29).
- 의미: market factor 만으로는 spread 의 0.10 만 설명, 0.38 은 남음.
- t=10.29 — 매우 유의함.

**FF3 α (10-1 Test)**: 0.38 (t=10.14).
- 의미: market + size + value 로도 spread 거의 못 설명.
- α 가 거의 안 줄어듦.

**FF5 α (10-1 Test)**: 0.39 (t=9.96).
- 의미: 5-factor 로도 못 설명.

→ **GAN β-sorted portfolios 는 FF3/FF5/CAPM 으로 설명 안 됨** — 진짜 새로운 risk 정보.

### Step 3 — GRS Test 의 의미

**GRS = Gibbons-Ross-Shanken (1989) test**:
- $H_0$: "모든 portfolio 의 α = 0" (factor model 이 잘 가격결정함).
- 검정 통계량: F-statistic.
- p-value < 0.05 면 reject — factor model 이 부적합.

**Table II 의 GRS**:
- CAPM Test: 11.58, p=0.00 → reject.
- FF3 Test: 11.25, p=0.00 → reject.
- FF5 Test: 10.75, p=0.00 → reject.

→ **세 factor model 모두 GAN β-sorted portfolios 를 가격결정 못 함**.

### Step 4 — t-statistic 의 패턴

Decile 별 t-stat 의 monotonicity:
- Decile 1: t = -3.43 (negative, 유의).
- Decile 5: t = 2.50 (positive, 유의).
- Decile 10: t = 6.05 (positive, 매우 유의).

→ **Extreme deciles (1, 10) 가 가장 mispriced** by FF factor models.

### Step 5 — 이 결과가 의미하는 것

GAN 의 β 가 FF factor 가 못 잡는 **새 risk dimension** 을 잡고 있음:
- FF3 = market + size + value.
- FF5 = + profitability + investment.
- GAN β = 이 5 factor 들의 선형 결합으로 reproduce 안 됨.

→ **GAN 이 진짜 새로운 information** 을 발견.

---

## 9.7 전체 결과 한 그림으로

```
[ Table I — OOS Test 1992-2016 (월간 SR) ]
                                                  
  Model    SR     EV    XS-R²                     
  LS       0.42   0.03  0.14                      
  EN       0.50   0.04  0.19                      
  FFN      0.44   0.04  0.15                      
  GAN      0.75   0.08  0.23   ← 모든 지표 압도
                                                  
  연간 환산 SR:
  GAN 2.6, EN/LS 1.7, FFN 1.5, FF5 0.8

[ Macro inclusion (Figure 6) ]                    
  GAN (LSTM hidden states):     ~0.75 (best)      
  GAN (no macro):               ~0.65 (-10%)      
  UNC (g = const):              ~0.55 (-20%)      
  GAN (all macro raw):          ~0.10 (collapse)  
                                                  
[ β-sorted (Figs 7, 8, Table II) ]                
  Fig 7: 10 decile 누적 50년, 명확 spread          
  Fig 8: linear fit R² = 0.95-0.98 모두 quantile  
  Table II 10-1 spread: 0.39 (월, Test)            
  CAPM/FF3/FF5 α: 0.27-0.39 (t=6-10), 유의         
  GRS: reject 모든 factor model                    
```

---

## 9.8 자기점검 (이 챕터)

### 핵심 5가지
1. **EN (linear no-arb) ≥ FFN (nonlinear no-no-arb) 인 이유?**
2. **Macro inclusion 의 3가지 방식 비교에서 (all macro raw) 가 (no macro) 보다 나쁜 이유?**
3. **β-sorted portfolio 의 R² > 0.95 가 의미하는 것?**
4. **UNC 가 GAN 보다 ~20% SR 낮은 이유?**
5. **GRS test 가 FF3, FF5 를 reject 한 의미?**

### 답변
1. **No-arbitrage 가 ML flexibility 보다 중요**. FFN 은 conditional mean 직접 추정 — but mean 은 low SNR 이라 noise 학습 위험. EN 은 no-arbitrage moments (first moment + second moment 의 quadratic loss) 사용 — risk premium signal 직접 학습 + ℓ1 sparsity 가 noise 자동 차단. paper: "off-the-shelf simple prediction approaches can perform worse than even linear no-arbitrage models."
2. **Noise-to-signal ratio 폭증**. 178 raw macro 시계열 중 진짜 signal 은 소수. raw 차분만 사용시 dynamic pattern 손실 + signal/noise ratio 악화. Dropout regularization 도 178 차원의 noise 를 다 제거 못함. **No macro** 는 적어도 firm chars 의 signal 은 살아있음. **Hidden states** 는 LSTM 으로 noise 제거 + dynamic pattern 추출 — 최적.
3. **No-arbitrage 이론적 예측과 일치**. $\mathbb{E}[R^e_i] = \beta_i \mathbb{E}[F]$ — 평균 수익률은 β 와 linear, intercept = 0. 5, 10, 20 quantile 모두 R² > 0.95 → GAN β 가 진짜 risk exposure 측정. (intercept 가 약간 negative 인 것은 limit to arbitrage 가능성, paper p.29 본문).
4. UNC = "GAN with g=constant" — 같은 SDF network + LSTM hidden states 사용, **다만 g 가 adversarial 안 함**. Adversarial 이 가장 mispriced test asset 을 자동 생성 → SDF network 가 그것을 학습. 이 효과가 SR ~ 20%. Adversarial 가 결정적 component.
5. CAPM, FF3, FF5 모두 GAN β-sorted portfolios 의 α 를 0 으로 만들지 못함 (p < 0.05). 즉 GAN β 가 잡은 risk 가 market/size/value/profitability/investment factor 들의 선형 결합으로 reproduce 안 됨. **GAN 이 진짜 새로운 risk dimension** 을 발견 — 기존 factor model 의 보완 또는 확장이 아닌 별개의 information.

---

다음 [10_empirical_portfolios.md](10_empirical_portfolios.md) 에서 46 anomaly portfolio 의 자세한 분석.
