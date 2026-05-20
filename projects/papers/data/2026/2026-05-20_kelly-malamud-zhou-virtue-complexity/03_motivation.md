# 03. 왜 이 연구가 필요했나 — 60년 학계 역사 (영어/수식 없이)

> 무지식자가 이 논문의 *맥락* 을 이해할 수 있게, 1960년대부터 2024년까지의 학계 흐름을 친근하게.

---

## 3.1 챕터 한 줄 요약

> **"60년 학계는 *시장 예측 불가능* 이라 결론냈지만, 머신러닝 시대에 새 진실 발견 — *적절한 방법론* 만 쓰면 같은 데이터로 정반대 결론. 본 논문이 그 진실의 *수학적 증명*."**

---

## 3.2 1960-1980년대 — 시장 예측 시도의 시작

학자들이 처음 던진 질문:

> "주식 시장이 다음 달 오를지 내릴지, *지금 보이는 정보* 로 예측할 수 있을까?"

**보이는 정보 (예측 변수)**:
- 배당률 (dividend-price ratio): 현재 주가 대비 배당이 얼마나 큰가
- 이자율 (interest rate): 안전 자산 수익률
- 인플레이션
- 경기 지표

**상식적 직관**: "*배당률이 높으면* (주가가 상대적으로 낮으면) *내년 시장이 오를 것* 같다."

**1980년대 발견**: 통계적으로 *어느 정도 맞아 보이는* 결과들 등장. 학계의 hope.

---

## 3.3 1990-2000년대 — 표준 *간단한* 모델

학자들이 합의한 *표준 도구*: **선형 회귀** (단순한 통계 방법).

**일상 비유**: "수익률 = a × 배당률 + b × 이자율 + ... + 잡음" 같은 단순한 *덧셈 모델*. 변수 5-15 개.

이런 모델을 **simple model (간단한 모델)** 이라 부름. *Occam's razor (오컴의 면도날)* — 통계학자 George Box (1976) 의 영향 — "*모델은 단순할수록 좋다*" 의 철학.

**그러나 결과**: 학자들 사이에서 *반신반의*. 일부 데이터에선 잘 되고, 다른 데이터에선 안 되고.

---

## 3.4 2008년 — 학계 거의 무너짐 (Goyal-Welch shock)

두 학자 (Amit Goyal, Ivo Welch) 가 *Review of Financial Studies* 에 충격의 논문 발표:

> **"우리가 다 해봤다. 안 된다."**

### Goyal-Welch (2008) 가 한 것

15 개의 *대표적 macro 변수* (배당률, 이자율, 인플레, ...) 로:
1. 1926-2005 의 *80년 데이터* 사용.
2. 다양한 모델 (단변량, 다변량, kitchen sink) 시도.
3. 모두 *Out-of-sample* (실전 모의) 평가.

### 결과 (충격)

> **"가장 단순한 *과거 평균* 으로 예측하는 것 (즉 *no prediction*) 이 어떤 정교한 모델보다도 *낫다*."**

**예측 정확도 (OOS R²)**: 대부분 *음수*. 즉 모델이 *과거 평균보다 더 나쁨*.

### 학계 반응

이 논문이 *완전 게임체인저*. 약 10년간 학계 분위기:
- "*시장 수익률 예측은 사실상 불가능* — 받아들이자"
- "*Bayesian 평균 / 모델 평균* 같은 더 정교한 통계만 약간 효과"
- "*머신러닝 도 안 될 거*"

### 본 논문 (2024) 의 도전

본 논문이 정확히 이 *Goyal-Welch (2008) 의 결론* 을 **정면 반박**. 같은 데이터 + 같은 변수로 *정반대* 결론.

→ **왜?** 답: *방법론* 이 잘못이었다. *R² 가 잘못된 metric* 이었고, *간단한 모델 + ridgeless* 가 가장 *나쁜 조합* 이었다. 본 논문 [Table I (07 챕터)](07_empirical.md) 에서 정량.

---

## 3.5 2010년대 — 머신러닝 등장

같은 시기, 컴퓨터 과학 분야에서 머신러닝 (특히 neural network) 이 *모든 곳에서 잘 됨*:
- 이미지 인식 (ImageNet 2012)
- 자연어 처리 (GPT 2018+)
- 알파고 (Go 게임 2016)

**일부 자산가격 학자들**: "혹시 우리 분야에서도?"

### 2018-2023 머신러닝 wave

자산가격 분야에 *empirical (실증) 결과* 들이 쏟아짐:
- **Gu, Kelly, Xiu (2020)**: 머신러닝으로 cross-section 자산 예측 → 잘 됨. [Deep dive ✓](../2026-05-17_gu-kelly-xiu-autoencoder/)
- **Chen, Pelger, Zhu (2023)**: GAN (no-arbitrage 제약) 으로 더 잘. [Deep dive ✓](../2026-05-18_chen-pelger-zhu-deep-learning-ap/)
- **Freyberger, Neuhierl, Weber (2020)**: nonparametric characteristic.
- **Kozak, Nagel, Santosh (2020)**: ridge regression on anomaly portfolios.
- **Lettau, Pelger (2020) RP-PCA**: weak factor 검출. [Deep dive ✓](../2026-05-17_lettau-pelger-rppca/)
- **Dong, Li, Rapach, Zhou (2022)**: 100 anomaly portfolios → 시장 예측.

### 학계의 미스터리

> "머신러닝 (변수 수천 개) 이 *왜 잘 되는지* 모름."

상식: "*변수 > 데이터 면 과적합 → 망한다*" 인데 *실제로는* 잘 됨. 학자들 *empirically 잘 됨을 보임*, but *왜* 는 답 없음.

이 미스터리 위에 본 논문이 등장 (2024).

---

## 3.6 본 논문의 핵심 발견 — 미스터리의 답

> **"적절한 안정장치 (ridge shrinkage) 만 더하면, 모델이 *복잡할수록* (변수 많을수록) *예측 성능 단조 증가*. 통상 직관과 정반대."**

**증명 도구**: Random Matrix Theory (RMT) + Marchenko-Pastur 정리. 60년 된 *순수 수학 분야* 의 결과를 *자산가격* 에 처음 적용.

**구체적 정리**: **Theorem 1 (Virtue of Complexity)** — 본 논문의 최고 정리. [05c 챕터](05_method_c_misspec.md) 에서 풀이.

---

## 3.7 본 논문의 사고 실험 — *가상의 세계*

논문 본문은 *thought experiment* (사고 실험) 으로 시작:

> **"진짜 시장 수익률 = 어떤 함수 f(macro 변수들) + 잡음"**

여기서:
- *macro 변수들* = 15개 (Goyal-Welch 의 dy, dp, dfy, ...).
- *함수 f* = 우리가 모르는 *진짜 자연 법칙*. 비선형 (단순 덧셈 아닌 복잡한 모양).
- *잡음* = 예측 불가능한 random noise.

학자의 역할: **함수 f 를 데이터로 추정**.

**핵심 질문**: 학자가 모델 *어떻게 만들까*?

### 옵션 A — 간단한 모델 (전통)

- 변수 5-15개 의 *덧셈 모델*. 
- 장점: *과적합 위험 적음*.
- 단점: *진짜 f 가 복잡하면* 그 복잡함을 못 잡음 — **거친 근사** (coarse approximation).

### 옵션 B — 복잡한 모델 (본 논문 권장)

- 변수 12,000개 의 *비선형 결합* (Random Fourier Features).
- 단점 (통상 직관): *과적합 위험 큼*.
- 장점 (본 논문 발견): *진짜 f 를 정확히 근사* + *ridge 안정장치* 로 과적합 막음.

→ **본 논문 답**: 옵션 B 가 항상 우월. *"can compute" 한 가장 큰 모델 써라*.

---

## 3.8 OLS — *전통 추정의 한계* 의 이유

자, 옵션 B (복잡한 모델) 의 *통상 문제* 가 뭐냐?

### 데이터 수 < 변수 수

**일상 비유**: 학생 10명 데이터로 12 과목 시험 점수를 예측하는 회귀? *12 변수 > 10 데이터* — 통상의 *최소 자승 (OLS)* 가 무너짐.

수학적으로: $(X'X)^{-1}$ 가 *역행렬 안 됨*. 추정값 *폭발*.

**결과**: OOS R² → -∞, Sharpe ratio → 0.

이게 *Goyal-Welch (2008) 가 본 것*. 15 변수 + 12개월 데이터 = *interpolation boundary* 부근 (변수 ≈ 데이터). 이 영역이 *최악*.

---

## 3.9 본 논문의 *놀라운 발견* — Ridgeless

### Ridgeless regression 이 뭐예요?

**일상 비유**: 12 변수 > 10 데이터 인데도 *추정 가능* 한 trick. 무한히 많은 *완벽 fit* 해 중에서 *가장 작은* 해 선택.

수학적으로: *Moore-Penrose pseudo-inverse* (ridge 의 z=0 limit).

### 왜 작동?

**놀라운 발견** (통계학 2019+): 변수가 *훨씬* 많으면 (P >> T), ridgeless 가 *implicit regularization* 으로 작동 — 즉 *과적합 같이 보이지만 OOS 잘 됨*. 

학자들이 이걸 **benign overfit (자비로운 과적합)** 이라 부름 — Bartlett et al (2020), Belkin et al (2019).

본 논문이 이 *통계학 발견* 을 *자산가격 timing* 에 처음 적용.

---

## 3.10 본 논문의 4가지 추가 결론

본 논문이 이론으로 보이는 4가지:

### 추가 결론 1 — Ridgeless 가 *모든* 복잡도에서 양의 Sharpe

> **"변수 수가 *임의로 커도* (1만, 10만, 100만), ridgeless regression 이 *양의 Sharpe ratio 향상* 을 만든다."**

직관: "변수 100만, 데이터 12 면 *완전 과적합 zero training error* → 망해야 할 것 같은데" — *아니다*. **Surprisingly, this intuition is wrong**. 

### 추가 결론 2 — R² ≠ 경제적 가치

> **"OOS R² 가 *마이너스 100%* 이하 일지라도 *Sharpe ratio 는 양수* 가능."**

직관: "예측 정확도 (R²) 가 나쁘면 돈 못 번다" — *아니다*. R² 는 *forecast variance* 에 heavy 하게 영향받음 — *방향은 맞지만 scale 이 큰* 예측이 R² 음수 + Sharpe 양수 가능.

본 논문 결론: **finance 분야가 R² 비관에서 벗어나서 *Sharpe / IR* 같은 *경제 measure* 로 evaluate 해야**.

### 추가 결론 3 — Correctly specified vs Misspecified

- *Correctly specified*: empirical model = true DGP (이상적, 비현실).
- *Misspecified*: empirical model 이 true 의 *일부만* capture (현실적).

본 논문 *main result* 는 **misspecified case** 에 대한 것 (Theorem 1). Correctly specified 는 *비교 baseline*. [05b, 05c 챕터](05_method_b_correct.md).

### 추가 결론 4 — Ridge 가 ridgeless 보다 더 좋다

> **"Ridgeless 도 양의 Sharpe; 거기에 *약간의 ridge (z > 0)*  더하면 *더* 좋다."**

특히 *interpolation boundary (변수 ≈ 데이터)* 부근에서 효과 크다. Ridge 가 *variance 감소* 가 *bias 증가* 능가.

---

## 3.11 본 논문의 *분석 도구* — Random Matrix Theory

### 왜 새 도구 필요?

전통 통계 (1900-1960): "*데이터 무한대로 늘리면* (T → ∞) 추정값이 진짜 값에 *수렴* 한다."

본 논문 환경: *변수 (P) 도 무한대로 늘림*. 그것도 *데이터와 같은 속도* (P/T → 상수 c).

이 영역에서 *전통 통계가 깨짐*. 추정값 ≠ 진짜 값 even as T → ∞.

### Random Matrix Theory (RMT) 의 역할

> **"P, T 둘 다 무한대로 가는 영역의 통계 — 1967년 우크라이나 수학자 Marchenko-Pastur 가 발명."**

**일상 비유**: 거대한 표 (P × P) 의 *전체 패턴 (eigenvalue 분포)* 이 어떻게 행동하는지 한 *함수* (Stieltjes transform) 로 압축.

본 논문이 이 RMT 결과를 *자산가격 timing 의 Sharpe ratio limit* 도출에 활용. **Section II 가 그 도구 chapter**. [05a 챕터](05_method_a_rmt.md).

---

## 3.12 실증 결과 미리보기

본 논문의 실증 (Section V, [07 챕터](07_empirical.md)):

### 데이터
- **CRSP value-weighted index 월간 수익**: 1926-2020 (94년).
- **15 개 macro 변수**: Goyal-Welch 의 정확히 그 dy, dp, dfy, infl, lty, ... + lag market return.
- **학습 window**: T = 12, 60, 120 개월 (1년 / 5년 / 10년 rolling).
- **변수 수 P**: 2 → 12,000 (Random Fourier Features 로 확장).

### 결과 1 — Sharpe ratio
- **Linear ridgeless (Goyal-Welch 의 정확한 setting)**: SR = -0.11 (망함, 확정).
- **Linear + ridge (z=10³)**: SR = 0.46 (*ridge 만 추가했는데* 극적 향상).
- **Nonlinear ML (P=12k + ridge)**: SR = **0.47 (t=4.5)** — 본 논문 main result.

→ 같은 데이터로 *3배 다른 결론*.

### 결과 2 — Recession divestment
- 1926-2020 의 **NBER 침체 15개** 중 **14개** 에서 ML timing 이 *침체 전 시장 비중 자동 감소*.
- 유일 예외: 1945 (WWII 직후).
- **Purely out-of-sample** — 미래 정보 0 사용.

이건 **macro economics 의 holy grail** (real-time recession detection). ML 이 *Goyal-Welch 15 변수* 만으로 자동 달성.

### 결과 3 — Low downside risk
- *Max loss*: 1.2 표준편차 (vs Linear ridgeless 의 98.5).
- *Skewness*: +2.5 (positive — 우상향 fat tail).

→ ML 모델이 *극단 손실 회피* + *극단 수익 잘 잡음*.

---

## 3.13 본 논문이 *반박* 하는 학계 통념 정리

| 학계 통념 (1960-2010) | 본 논문 발견 |
|---------------------|------------|
| 단순한 모델이 좋다 (Occam's razor) | 복잡한 모델 + ridge 가 *Theorem 1 monotone 증가* |
| 변수 > 데이터 면 망함 | Benign overfit 으로 *오히려 잘 됨* |
| OOS R² 가 economic value 측정 | R² ≠ Sharpe — *경제 measure* 로 evaluate |
| Goyal-Welch (2008) "예측 불가능" | 같은 데이터로 *극적 성공* |
| Campbell-Thompson nonnegativity 가 필요 | ML 이 *constraint 없이* 자동 학습 |
| Box 의 *parsimony* (Box 1976) | *Occam's razor may be Occam's blunder* |

---

## 3.14 자기점검

### 핵심 3가지
1. **Goyal-Welch (2008) 가 학계에 미친 영향?**
2. **머신러닝 시대 자산가격의 *미스터리* 가 뭐였나?**
3. **본 논문이 그 미스터리에 준 답?**

### 답변
1. **"시장 수익률 예측은 사실상 불가능"** 결론. 80년 데이터로 15 macro 변수 모두 OOS R² 음수. 학계 약 10년 비관기. **그러나 같은 데이터로 본 논문이 정반대 결론 (Sharpe 0.47)** — 즉 GW 의 데이터 문제 아니라 *방법론 (linear ridgeless + R² metric)* 의 한계였다.
2. **2018-2023 머신러닝 (변수 수천 개) 이 자산가격 예측에 *empirically 잘 됨* 이 보였지만, *왜 잘 되는지* 의 *이론* 이 없었다**. 통상 통계 직관 ("변수 > 데이터 → 과적합 → 망함") 과 정반대 결과. *이론적 black box*.
3. **Random Matrix Theory (RMT) + ridge regression 의 *Theorem 1 (Virtue of Complexity)***. *Sufficiently mixed signals* + *적절한 ridge shrinkage* 만 만족하면 SR 가 모델 복잡도의 monotone 증가. *Benign overfit* 의 통계학 발견을 자산가격 timing 에 *처음 정리*. 학자들이 머신러닝을 *empirically* 만 쓰던 시대 → *이론적 정당화* 의 시대로 전환.

---

다음 챕터: [04_environment.md](04_environment.md) — 본 논문의 *수학적 설정* 을 친근하게.
