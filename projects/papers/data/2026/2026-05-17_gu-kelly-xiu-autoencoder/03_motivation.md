# 03. Section 1 (Introduction) — 왜 비선형 자산가격결정 모델이 필요한가

논문 1쪽 후반 ~ 2쪽 전체 (Section 1) 를 풀어본다.

---

## 3.1 첫 단락 — "Anomaly" 와 "Risk factor" 의 대립

> **원문**: "A recent asset pricing literature has emerged challenging the 'anomaly' view of characteristic-based asset return prediction. The anomaly view suggests that certain asset attributes have the power to forecast returns above and beyond the expected return variation warranted as compensation for aggregate risk exposures."

**풀이**:
- **두 가지 관점이 대립**:
  - **(A) Anomaly view**: "size, value, momentum 등 주식 특성이 위험 보상 외의 초과수익을 예측한다" — efficient market 위반
  - **(B) Risk factor view**: "그 특성들은 사실 숨은 위험요인의 **프록시 (proxy)** 일 뿐" — 다 위험 보상으로 설명 가능

- KPS (2019) 가 (B) 를 지지하는 강력한 실증 제공: 특성을 위험노출의 변수로 간주하면 anomaly 가 거의 다 사라짐.

**핵심 함의**: 특성은 anomaly 가 아니라 위험노출의 정확한 측정도구.

---

## 3.2 KPS (Kelly-Pruitt-Su 2019) 모델 — 본 논문의 출발점

> **원문**: "The asset pricing model proposed by KPS assumes that individual returns $r_{i,t}$ possess a K-factor structure:"

$$
r_{i,t} = \beta(z_{i,t-1})' f_t + u_{i,t} \quad \text{(Eq. 1)}
$$

**기호 뜻**:
- $r_{i,t}$ — 자산 $i$ 의 시점 $t$ 초과수익률 (스칼라)
- $f_t$ — 시점 $t$ 의 $K \times 1$ 잠재요인 벡터
- $\beta(z_{i,t-1})$ — 자산 $i$ 의 시점 $t-1$ 특성 $z_{i,t-1}$ 을 노출도 $K \times 1$ 벡터로 변환하는 **함수**
- $z_{i,t-1}$ — 자산 $i$ 의 시점 $t-1$ 의 $P \times 1$ 특성 벡터 (예: 94개 firm characteristics)
- $u_{i,t}$ — 잔차 (idiosyncratic)

**일상 비유**:
$r$ = 학생 점수
$f$ = 시험 난이도 벡터 (각 과목별)
$\beta(z)$ = "학생의 과목별 약점" 을 학생 특성 $z$ (학습 시간, 성격, 학원 종류) 의 **함수**로 매핑

→ "학생마다 약점이 다른 게 학생 특성에 따라 결정된다" 라는 통찰.

**왜 이 형태**:
- 정적 모델 (Fama-French): $\beta_i$ 가 시간 무관 상수 → 30년 같은 노출도 강제. 비현실적.
- KPS: $\beta_{i,t-1} = \beta(z_{i,t-1})$ — 시변. 특성 변화 추적 가능.
- $z_{i,t-1}$ 은 lag (one period prior) → 미래 정보 누설 방지.

---

## 3.3 KPS 의 **결정적 단순화** — 선형성 가정

> **원문**: "KPS make the simplifying assumption that the map from P characteristics to K betas is linear:"

$$
\beta(z_{i,t-1})' = z_{i,t-1}' \Gamma \quad \text{(Eq. 2)}
$$

**기호 뜻**:
- $\Gamma$ — $P \times K$ 매핑 행렬 (모든 자산 공유)
- $z_{i,t-1}' \Gamma$ — $1 \times K$ 행벡터 = 노출도

**일상 비유**: "학생 약점 = (학습 시간 가중치) × (학습 시간) + (성격 가중치) × (성격) + ..." 처럼 **선형 결합**.

**왜 이 형태**:
- 추정 가능성 + 계산 효율. $\Gamma$ 추정 = OLS-like 문제.
- 단점: **현실의 비선형성 무시**. 특성 간 상호작용 무시. 특정 threshold 효과 무시.

**조심할 점**: 본 논문의 **공격 지점**. Eq. 2 의 선형성을 신경망으로 푼다.

---

## 3.4 왜 선형성이 깨질 수 있나 (논문의 주장)

> **원문**: "There are, nonetheless, no obvious theoretical or intuitive justifications for this convenient linearity assumption. To the contrary, there are many reasons to expect that this assumption is violated."

**3개 이론적 근거**:

### (a) 비선형 자산가격결정 모델의 선례
- **Campbell-Cochrane (1999)** — habit 모델: surplus consumption 의 비선형 효용
- **Bansal-Yaron (2004)** — long-run risk: 위험 프리미엄이 분산의 비선형 함수
- **He-Krishnamurthy (2013)** — intermediary asset pricing: 자본 제약의 비선형 효과

→ 이론적으로 **수익 동학이 상태 변수의 비선형 함수**.

### (b) 일반 균형 모델에서의 비선형 risk exposure
- **Santos-Veronesi (2004)**: 시변 risk exposure 가 자산 가격에 비선형 영향

### (c) 선형 근사의 오차
- **Pohl, Schmedders, Wilms (2018)**: 비선형 모델의 선형 근사가 equity premium·return predictability 의 크기 추정에서 **상당한 오차** 야기

**핵심 메시지**: 선형성은 단지 편의를 위한 것. 이론은 비선형을 시사.

---

## 3.5 본 논문의 접근 — Autoencoder 활용

> **원문**: "We generalize the factor model in (1) using models from the autoencoder family."

**Autoencoder 가 본 논문의 도구가 된 이유**:

### (i) Autoencoder = PCA 의 비선형 후예
- Autoencoder 의 한 layer + linear activation = PCA (Proposition 1 에서 증명)
- 다층 + 비선형 activation = nonlinear PCA
- ML 분야의 standard unsupervised dimension reduction tool

### (ii) 자산가격결정과의 자연스러운 연결
- PCA = 자산가격 잠재요인 추출의 표준 (Connor-Korajczyk 1986, Bai-Ng 2002)
- → Autoencoder 는 그 **비선형 일반화**.

### (iii) Bottleneck = 잠재요인 K개
- Autoencoder 의 hidden layer 폭을 $K \ll N$ 으로 좁힘 = parsimonious representation
- Decoder 가 그 K 차원에서 N 차원 수익률 복원 = 요인 모델 estimation

---

## 3.6 표준 autoencoder 의 한계 — Covariates 무시

> **원문**: "Neither method [PCA, autoencoder], in their standard form, uses information in covariates to guide dimension reduction. KPS propose 'instrumented' PCA (IPCA), which allows the information in covariates to guide the reduction via Eq. (2) but remains reliant on the linear model formulation."

**상황 정리**:

| 도구 | 차원 축소 | covariates 사용 | 선형/비선형 |
|------|---------|----------------|------------|
| PCA | ✓ | ✗ | 선형 |
| Standard Autoencoder | ✓ | ✗ | **비선형** |
| IPCA (KPS) | ✓ | ✓ | 선형 |
| **본 논문 (Conditional Autoencoder)** | ✓ | ✓ | **비선형** |

→ 빈 칸 (비선형 + covariates) 을 본 논문이 채움.

---

## 3.7 본 논문의 구체적 기여

> **원문**: "In this paper, we introduce a new conditional autoencoder model for individual stock returns which, like IPCA, allows covariates to help guide dimension reduction."

**3가지 차별점**:
1. **Autoencoder 가 신경망 기반** 으로 수익률을 저차원 요인으로 압축. characteristic covariates 가 노출도에 **비선형·상호작용** 영향.
2. **경제 이론 부과**: 요인을 **개별 자산수익의 선형결합 (portfolio)** 으로 해석 가능. → no-arbitrage 보존.
3. **Nonlinear conditional asset pricing model**: 비선형성이 covariates 의 신경망 매핑에서 발현.

---

## 3.8 실증 결과 예고

> **원문**: "Our empirical analysis of a 60-year history of individual equity returns in the US shows that our autoencoder model dominates observable factor models in the tradition of Fama and French (1993), as well as the more sophisticated models such as the linear conditional beta specification of KPS."

**핵심 수치** (journal p.430 본문 인용, K=3 시):
- 60년 (1957–2016), 약 30,000 stocks, 평균 6,200 stocks/month
- 3-요인 모델 비교:
  - Total OOS R² (월): "preferred autoencoder" (CA1, K=3) = **12.6%**, IPCA = **13.3%**, FF = **3.4%**
  - Predictive OOS R²: autoencoder = **0.50%**, IPCA = **0.23%**, FF = **음수**
- Long-short decile spread Sharpe ratio (3-factor):
  - 본 논문의 "preferred autoencoder" (3-factor): EW **2.16**, VW **0.92**
  - IPCA: EW **1.26**, VW **0.59**
  - FF: EW **−0.40**, VW **−0.69**

→ 모든 지표에서 CA 우세. K=6 에서는 격차 더 큼 (CA2 K=6 VW SR = 1.53, paper Table 3).

---

## 3.9 No-arbitrage 와의 관계

> **원문**: "It [our model] is equivalent to a nonparametric model for a stochastic discount factor, and imposes the economic restriction of no-arbitrage pricing."

**의미**:
- 모든 자산가격 모델은 SDF (stochastic discount factor) 로 표현 가능
- 우리 conditional autoencoder = **비모수 SDF 모델**
- α = 0 강제 → no-arbitrage 충족

**실증**: Fig. 3 에서 |t-stat| > 3.0 인 α 개수가 FF5 의 **37** → CA2 의 **8** 로 (out of 95 managed portfolios) 약 5배 감소. 잔존 α 도 < 7 bps/월 (economically small).

---

## 3.10 자매 / 선조 논문들

| 논문 | 본 논문과의 관계 |
|------|------|
| **KPS (2019, RFS)** | 직접 선조. 선형 IPCA. 본 논문이 그 일반화 |
| **Gu, Kelly, Xiu (2019, RFS)** | 본 저자 트리오의 ML 자산가격결정. 비지도 X (supervised). 본 논문은 unsupervised + 자산가격 prior. |
| **Kozak, Nagel, Santosh (2017, 2018)** | PCA 자산가격결정. Bayesian shrinkage. 본 논문은 비선형 일반화. |
| **Kelly, Pruitt (2015)** | three-pass regression filter |
| **Hinton, Salakhutdinov (2006)** | 깊은 autoencoder 가 PCA 압도 (이미지) — 본 논문의 ML 영감 |
| **Feng, Polson, Xu (2019b)** | 딥러닝 자산가격 |
| **Kozak (2019)** | kernel methods for IPCA (동시기 비선형 접근) |

---

## 3.11 논문 구조 안내

> **원문**: "The rest of the paper is organized as follows. In Section 2, we set up the model and present our methodology. Section 3 presents our empirical studies. Section 4 provides Monte Carlo simulations that demonstrate the performance of our procedures. Section 5 concludes."

| Section | 우리 챕터 | 다루는 것 |
|---------|----------|----------|
| 1 (Intro) | 03 (이 파일) | 동기, KPS 와의 비교 |
| 2.1 (Std AE) | 05a | 표준 autoencoder + PCA 등가성 |
| 2.2 (Cond AE) | 05b | conditional autoencoder (메인 모델) |
| 2.2.1 (IPCA special) | 05c | IPCA = CA 특수 케이스 |
| 2.3 (Regularization) | 05d | LASSO, early stopping, ensemble |
| 3.1–3.2 (Data, Models) | 06 | CRSP 60년, CA0-3 vs FF/PCA/IPCA |
| 3.3–3.5 (Stat·Econ·Misprice) | 07 | R², Sharpe, α |
| 3.6–3.7 (Importance·Robust) | 08 | 94 특성 ranking, robustness |
| 4 (Monte Carlo) | 09 | linear/nonlinear truth 시뮬 |
| 5 (Conclusion) | 10 | 결론 |
| Appendix A | 11 | Proposition 1, 2 증명 |
| Appendix B | (12 또는 14) | Adam, Early Stopping, Batch Norm algorithms |

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **KPS (Eq. 2) 선형성 가정의 약점은? 본 논문이 어떻게 일반화하나?**
2. **표준 PCA / autoencoder / IPCA / CA 4가지 도구를 2 차원 표로?**
3. **이 모델이 "no-arbitrage" 를 강제하는 메커니즘은?**

### 답변
1. KPS: β(z) = z'Γ 선형. 약점: 특성 간 상호작용 + threshold 효과 무시. 본 논문: β(z) = NN(z) 비선형 신경망 매핑. 단 r = β'f 형태는 유지.
2. (도구 / 차원축소 / covariates 활용 / 선형비선형): PCA: 차원축소·없음·선형 / AE: 차원축소·없음·비선형 / IPCA: 차원축소·있음·선형 / **CA: 차원축소·있음·비선형 ← 본 논문이 메우는 빈 칸**.
3. 모델 r = β'f + u 에 절편 α 없음. 모든 기대수익이 β·E[f] 로 강제됨. → α = 0 자동 충족 = no-arbitrage. 실증에서 |t(α)|>3 α 개수 (95 managed portfolios 중) FF5 37 → CA2 8.

다음 [04_factor_model.md](04_factor_model.md) — KPS factor model 의 수학적 setup.
