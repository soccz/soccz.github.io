# 07. 실제 미국 시장 1926-2020 — 가장 흥미로운 챕터

> 본 논문이 *이론* 으로 보인 것을 *실제 데이터* 로 검증. CRSP 1926-2020 + Goyal-Welch 15 변수 + 머신러닝 → SR 0.47/year, 14/15 NBER 침체 자동 비중 감소.

---

## 7.1 챕터 한 줄 요약

> **"94년치 (1926-2020) 미국 주식시장 데이터 + Goyal-Welch 15 macro 변수 만으로 머신러닝 (12,000 변수로 확장) timing → 시장 buy-and-hold 대비 Sharpe ratio 0.47 향상 (t-stat 4.5), 14/15 NBER 침체 *자동 비중 감소*, 손실 최대 1.2 표준편차 (vs 단순 모델 98.5). Goyal-Welch (2008) 의 *같은 데이터* 로 *정반대* 결론."**

---

## 7.2 데이터 — 어떤 데이터를 썼나?

### 시장 수익률
- **CRSP value-weighted index** (Center for Research in Security Prices) 의 월간 *초과수익률* (excess return = 시장 - 무위험 자산).
- 기간: **1926년 7월 ~ 2020년**. 약 94년.
- 데이터 수: 약 1,140 개월.

### 15 개 macro 예측 변수 (Goyal-Welch 2008 의 정확한 그것)

| 단축명 | 풀네임 | 친근 설명 |
|------|------|----------|
| dfy | Default yield spread | 신용도 낮은 채권 - 안전 채권 수익률 차 |
| infl | Inflation | 인플레이션 |
| svar | Stock variance | 시장 변동성 (과거 1년) |
| de | Dividend-payout ratio | 배당 / 수익 비율 |
| lty | Long-term bond yield | 장기 채권 금리 |
| tms | Term spread | 장기 - 단기 금리 차 (수익률 곡선 기울기) |
| tbl | T-bill rate | 단기 안전 자산 금리 |
| dfr | Default return | 신용 채권 수익률 |
| dp | Dividend-price ratio | 배당 / 주가 비율 |
| dy | Dividend yield | 배당 수익률 |
| ltr | Long-term bond return | 장기 채권 수익률 |
| ep | Earnings-price ratio | 수익 / 주가 |
| b/m | Book-to-market | 장부가 / 시가 비율 |
| ntis | Net equity issuance | 신규 발행 - 자사주 매입 |
| **lag mkt** | Lagged market return | 전월 시장 수익률 |

→ **15개 (또는 16개 with lag market return)** 의 *standard finance* 변수. 거의 모든 시장 timing 연구가 사용.

### 데이터 표준화

- 시장 수익률: *trailing 12-month 표준편차* 로 정규화 (homoskedastic 가정 충족).
- 예측 변수: *expanding window 표준편차* (predictor 는 더 stable).
- 1930년부터 분석 시작 (36개월 warm-up 필요).

---

## 7.3 핵심 trick — 15 변수를 12,000 변수로

### 문제

15 변수만으로는 *복잡한 nonlinear 관계* 표현 불가. 모델이 *간단해서* — Goyal-Welch (2008) 의 한계.

### 해결 — Random Fourier Features (RFF)

본 논문이 **2007년 발명된 trick** (Rahimi-Recht) 사용:

> **15 변수 → 무작위 방향으로 사영 → sin/cos 통과 → 12,000 개의 *인공 변수* 생성**

```viz:voc-rff-mechanism:title=RFF 메커니즘 시각화,caption=15차원 macro 벡터 G 를 random ω 방향으로 사영 → sin/cos 변환. γ 슬라이더로 nonlinearity 정도. G 슬라이더로 한 component 변화 시 RFF 응답.
```

### 일상 비유

**원본 데이터**: 15 컬럼의 엑셀 표 (배당률, 이자율, ...).

**RFF 변환**:
1. 무작위 *수 (예: -0.5, 1.3, 0.8, ...)* 15개 추첨. 이게 *ω* (방향).
2. 각 월의 15 컬럼을 ω 와 *곱* (내적) → *한 숫자*.
3. 그 숫자에 sin / cos 함수 통과 → *2 개의 새 변수*.
4. 이걸 *6,000번 반복* → *12,000 개의 새 변수 (P)*.

### 왜 작동?

RFF + 선형 회귀 = **wide neural network with random fixed weights**.
- *첫 layer*: random fixed weights (= RFF 변환).
- *마지막 layer*: 학습 (= 선형 회귀의 ridge regression).

즉 *비선형 NN 의 효과* 를 *선형 회귀 처럼 분석 가능* — 본 논문 RMT 분석이 가능해진 이유.

---

## 7.4 머신러닝 timing — *순서 *

본 논문이 한 것:

### Step 1 — RFF 12,000 개 생성

위 trick 으로 1930-2020 데이터의 모든 월에 *12,000 개의 인공 변수* 부여.

### Step 2 — Rolling 학습

학습 window 의 *길이* 를 정함: **T = 12 개월 (1년), 60 개월 (5년), 120 개월 (10년)**.

**예 (T=12)**: 매월 *직전 12개월* 의 (변수 + 수익률) 로 *ridge regression* 학습. 그걸로 *다음 달 수익률 예측*.

### Step 3 — Timing weight

학습된 모델로 *다음 달 수익률 예측 값* 을 그대로 *시장 비중* 으로 사용.

**예**: 예측 = +0.02 → 시장 200% 매수 (leverage 2x). 예측 = -0.01 → 시장 100% short.

### Step 4 — 1,000번 반복

RFF 가 *random* 이므로 *random seed* 마다 다른 결과. 본 논문이 **1,000번 반복 + 평균** 으로 안정화.

---

## 7.5 Figure 7 — 실증 결과 1

![Figure 7](figures/page32_Fig7_T12_panels.png)

*paper p.490 Figure 7 — T=12 의 OOS performance.*

### 4 panels

- **Panel A**: OOS R².
- **Panel B**: $\|\hat\beta\|$ norm (계수 크기).
- **Panel C**: Expected return.
- **Panel D**: Volatility.

### 핵심 발견

**Panel C (Expected return) 가 가장 흥미**:
- *c 작음*: 기대 수익 거의 0 (simple model 못 학습).
- *c ↗*: 기대 수익 *단조 증가*. *c=1 에서 peak*, 그 후 *flat*.

→ 이론 (Figure 5) 와 *놀라운 일치*. 본 논문 메시지의 *실증 검증*.

---

## 7.6 Figure 8 — 실증 결과 2 (★ 가장 중요)

![Figure 8](figures/page33_Fig8_empirical_sharpe.png)

*paper p.491 Figure 8 — T=12 의 Sharpe / α / IR / t-stat.*

### 4 panels

- **A**: Sharpe ratio.
- **B**: Alpha (시장 대비 초과 수익).
- **C**: Information Ratio (alpha / 잔차 변동성).
- **D**: Alpha t-statistic (통계 유의성).

### 핵심 발견

**Panel A (Sharpe)**:
- *모든 z 에서 c 의 monotone increasing*.
- 고복잡도 (c → 1000): SR > 0.4.

**Panel D (t-stat)**:
- 고복잡도: t-stat > 2.5.
- *Statistically significant*.

→ **Theorem 1 의 실증 검증**. 이론과 실증의 일치.

```viz:voc-empirical-sharpe:title=Figure 8 — 실증 SR / α / IR / t-stat (interactive),caption=T 토글 (12/60/120). c, z 슬라이더. 모든 setting 에서 Sharpe 단조 증가, IR 약 0.3, t-stat > 2.5 고복잡도. Theorem 1 의 실증 일치.
```

---

## 7.7 Figure 9 — Longer training windows (T=60, 120)

![Figure 9](figures/page34_Fig9_T60_120.png)

*paper p.492 Figure 9.*

### 결과

- T = 60 (5년): 같은 monotone increasing 패턴. IR ≈ 0.25, t-stat > 2.0.
- T = 120 (10년): 같은 패턴. IR ≈ 0.25.
- **Magnitude 약간 감소** — T 길수록 leverage 작아져서.

**메시지**: *결과가 T 에 *robust***. 정성 패턴 모두 동일.

---

## 7.8 Figure 10 — Market Timing Positions ★★★

![Figure 10](figures/page35_Fig10_positions_recession.png)

*paper p.493 Figure 10 — **가장 흥미로운 그림**.*

### 친근 풀이

**x-axis** = 시간 (1930-2020).

**y-axis** = ML timing 의 *시장 비중* (π).

**3 색 선**: T = 12 (파랑), T = 60 (빨강), T = 120 (주황).

**회색 음영**: **NBER recessions (15 침체)**.
- 1929 대공황, 1937, 1945, 1948-49, 1953-54, 1957-58, 1960-61, 1969-70, 1973-75 (오일쇼크), 1980, 1981-82, 1990-91, 2001 (닷컴), 2007-09 (GFC), 2020 (COVID).

### 핵심 발견 1 — Long-only at heart

ML timing 의 position 이 *거의 항상 양*. 음의 position (short) 드물고 작음.

**놀라운 의미**: Campbell-Thompson (2008) 이 *수동으로 부과한* nonnegativity constraint 를 **ML 이 *constraint 없이* 자동 학습**.

### 핵심 발견 2 — 14/15 NBER 침체 비중 감소

**1926-2020 의 15 침체 중 14개** 에서 ML timing 이 *침체 *전* 시장 비중 자동 감소*.

**유일 예외**: 1945 (8개월, WWII 직후). 본 논문 표현: *"the eight-month recession of 1945"*.

### 더 놀라운 의미

이건 **macro economics 의 holy grail**:
- *real-time recession detection* 은 50년 학자들이 시도해도 *purely OOS* 로 달성 못 한 것.
- NBER Business Cycle Dating Committee 자체도 *6-12개월 lag* 후에 침체 dating.
- ML 이 *Goyal-Welch 15 변수* 만으로 *purely OOS* 로 달성.

```viz:voc-empirical-positions:title=Figure 10 — Market timing + NBER recessions (interactive),caption=T 토글 (12/60/120). 1930-2020 시계열. 회색 음영 = NBER recessions 15개. 14개에서 자동 비중 감소.
```

---

## 7.9 *Table I* — Goyal-Welch 2008 와의 정면 비교 ★

본 논문이 *Goyal-Welch (2008) 의 비관 결론* 을 *어떻게 정면 반박* 하는지 가장 명확한 표.

### 같은 데이터 — 3가지 다른 분석

본 논문이 *같은 1926-2020 CRSP + 같은 Goyal-Welch 15 변수* 로 3가지 모델 비교:

#### 1. Linear ridgeless (Goyal-Welch 2008 의 정확한 setting)
- 15 변수의 *선형 회귀*, *ridge 없음* (z = 0).
- 학습 window T = 12.

#### 2. Linear + ridge ($z = 10^3$)
- 같은 15 변수 *선형* 회귀, 그러나 *적당한 ridge*.

#### 3. **Nonlinear ML** (RFF 12,000 + ridge $z = 10^3$)
- 본 논문의 메인 결과.

### 결과 (T = 12)

| Model | OOS R² | Sharpe ratio | Max Loss | Skewness |
|-------|--------|--------------|----------|----------|
| Linear ridgeless (GW 2008) | **< -100%** (-9764%!) | -0.11 (t = -1.0) | 98.5 SD | -0.9 |
| Linear + ridge | -3.8% | 0.46 (t = 4.4) | 2.4 SD | -0.1 |
| **Nonlinear ML** | **+0.6%** | **0.47 (t = 4.5)** | **1.2 SD** | **+2.5** |

### 핵심 발견

#### Finding 1 — Ridge 만으로 *완전 변신*

Linear ridgeless (망함) → Linear ridge (SR 0.46) — *ridge 안정장치 만으로* 극적 변신.

→ **Goyal-Welch (2008) 의 *결론이 데이터의 한계가 아니라 방법론의 한계* 였다는 증명**.

#### Finding 2 — 비선형성의 추가 이득

Linear ridge (SR 0.46) → Nonlinear ML (SR 0.47) — 약간 추가.

그러나 *더 중요한 차이*:
- *Max loss*: 2.4 → **1.2 표준편차** (vs ridgeless 의 98.5)
- *Skewness*: -0.1 → **+2.5** (positive — 우상향 꼬리)
- *IR vs linear*: **0.26 (t = 2.5)** — 비선형성의 *significant* 추가.

→ **비선형 ML 이 *tail risk 감소* + *alpha 추가* 양쪽**.

```viz:voc-comparison-table1:title=Table I — Goyal-Welch 비교 (interactive),caption=T 토글 + metric 토글 (SR/R²/MaxLoss/Skew). 3 모델 막대 비교. 비선형 ML 의 tail risk 우수.
```

---

## 7.10 Figure 11 — *어떤 변수가 가장 중요?*

![Figure 11](figures/page38_Fig11_var_importance.png)

*paper p.496 Figure 11 — Variable importance.*

### 친근 풀이

각 변수의 *변수 중요도 (VI)* = "이 변수 *없으면* 모델 성능 *얼마나 떨어지나?".

**Top 3 (가장 중요)**:
1. **`lag mkt`** (전월 시장 수익률): R² 1.9% 감소.
2. **`ltr`** (장기 채권 수익률): R² 1.3% 감소.
3. **`dfr`** (default 채권 수익률): R² 0.8% 감소.

### *왜* 이 3개?

세 변수 모두 *12개월 window 내에서 변동 큰* 변수.

**대비**: `dp` (배당-가격), `dy` (배당 수익률) 같은 *느린* 변수는 VI 작음.

**메시지**: ML 이 *short-horizon 변동* 을 효과적으로 활용 (느린 변수 X, 빠른 변수 O).

```viz:voc-variable-importance:title=Figure 11 — 15 predictor VI (interactive),caption=R² (bars) + Sharpe (line) VI. Top 3: lag mkt / ltr / dfr — 12-month window 에서 가장 변동 큰 변수.
```

---

## 7.11 *비선형성 정확히 무엇이 도움?*

본 논문 Section V.F:

### 발견 1 — *Risk on / Risk off* 자동 학습

ML 모델이 *각 변수의 *임계 행동** 학습. 즉:
- *Stock variance (svar)* 가 *낮을 때* → market long.
- *Svar* 가 *높을 때* → cash (timing weight 0).

**일상 비유**: 변동성 지수 (VIX) 가 낮으면 시장 long, 높으면 cash. ML 이 *constraint 없이* 자동 학습.

### 발견 2 — *Time-series momentum* 으로 환원 안 됨

ML 의 시그널 ≠ 단순 *과거 수익률 따라가기*. 본 논문이 robustness check 로 확인.

### 발견 3 — *Linear + Nonlinear 의 *boost*

단순 평균:
- Linear ridge 50% + Nonlinear ML 50% → SR **0.53** (vs 단일 0.46/0.47).

→ **두 모델이 *complementary* 정보 capture**.

---

## 7.12 *Subsample robustness*

본 논문이 검사한 *두 subsample*:
- Half 1: **1930-1974** (45년)
- Half 2: **1975-2020** (45년)

**결과**:
- 두 subsample 에서 *동일 정성적 패턴*.
- *Magnitude*: 후반부 약 *절반*.

**해석**: 시장 efficiency 가설 — *시간 지날수록 알고리즘 어려워짐*. 그래도 후반부에서도 SR 0.2+ — *여전히 의미 있음*.

---

## 7.13 *Internet Appendix 추가 결과* (간략)

본 논문이 *online appendix* 에 보조 결과:

- **IA1, IA2**: T = 60, 120 의 정량 검증 (Figure 7 의 longer T version).
- **IA3**: R² 의 zoom-in 그래프 (高 c + 高 z 에서 *positive* R² 확인).
- **IA4**: 각 변수의 12-month 변동 — Top 3 variable importance 와 일치.
- **IA5**: 각 변수의 *nonlinear prediction pattern* — *risk on/off* 의 정량.
- **IA7**: $\gamma$ (RFF bandwidth) robustness — γ = 0.5, 1, 2 모두 비슷.
- **IA9, IA10, IA11**: subsample 정량 (위 7.12).
- **IA12**: intercept 포함시 결과 거의 동일.
- **IA Table IA1**: ML vs 각 univariate timing — *IR 0.32 (t=2.9)* — nonlinear effect 확인.
- **IA Table IA2**: inflation 제외 시 결과 거의 동일.

→ 모든 추가 결과가 *main paper 메시지 강화*.

---

## 7.14 본 챕터 정리 — *Goyal-Welch 시대의 종료*

본 챕터의 모든 발견:

```
   Goyal-Welch (2008)                      Kelly-Malamud-Zhou (2024)
   ───────────────────                     ───────────────────────

   15 변수 + Linear ridgeless              같은 15 변수 + RFF 12,000 + ridge
              ↓                                       ↓
   "시장 예측 불가능"                       SR 0.47/year (t = 4.5)
   R² < 0, SR ≈ 0                         IR 0.31 vs market (t = 2.9)
              ↓                                       ↓
   학계 약 14년 비관                         Max loss 1.2 SD (vs 98.5)
                                          Skewness +2.5 (downside risk ↓)
                                                    ↓
                                          14/15 NBER recessions divest
                                          (purely OOS, no constraint)
                                                    ↓
                                          Risk on/off 자동 학습
                                          (15 변수의 nonlinear interaction)
                                                    ↓
                                          *복잡함의 미덕 = 실증 확정*
```

→ **본 챕터의 핵심**: *같은 데이터로 정반대 결론*. 본 논문이 *방법론 (ridge + nonlinearity)* 만 바꿔서 *Goyal-Welch 의 비관 → 낙관* 전환.

---

## 7.15 자기점검

### 핵심 3가지
1. **본 논문 실증의 *핵심 trick* 은?**
2. **Table I 의 *3 model* 의 핵심 차이?**
3. **Figure 10 의 *놀라운 발견*?**

### 답변
1. **Random Fourier Features (RFF)** — 15 macro 변수 → *무작위 방향 사영 + sin/cos 변환* → 12,000 개의 *인공 변수*. *Wide neural network with random fixed first-layer weights* 와 같은 효과. 본 논문 RMT 분석이 *linear regression of RFF* 형태에 적용 가능 — 이론이 실증과 직접 연결.
2. **Linear ridgeless** (Goyal-Welch 2008 의 정확한 setting): SR=-0.11, R²<-100%, max loss 98.5 SD — 망함. **Linear ridge** ($z=10^3$): *같은 15 변수* + ridge 만 추가 → SR=0.46 (t=4.4) — *ridge 만으로 극적 변신*. **Nonlinear ML** (RFF + ridge): SR=0.47 + *max loss 1.2 SD* + *skewness +2.5* + *IR vs linear 0.26 (t=2.5)* — *비선형성의 tail risk 감소 + alpha 추가*. 결론: **GW 2008 의 비관은 데이터의 한계가 아니라 방법론의 한계**.
3. **1926-2020 의 *15 NBER 침체* 중 14 개에서 ML timing 이 *침체 직전 시장 비중 자동 감소* — *Campbell-Thompson nonnegativity constraint 없이*, *purely OOS***. 유일 예외: 1945 (WWII 직후). 이건 *macro economics 의 holy grail* (real-time recession detection) 의 달성. ML 이 *Goyal-Welch 15 변수* 만으로 *비선형 결합* 으로 *risk on/off* 패턴 자동 학습.

---

다음 챕터: [08_conclusion.md](08_conclusion.md) — 결론과 의의.
