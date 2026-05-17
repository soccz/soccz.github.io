# 11. Section 7 (Empirical Application) — 진짜 주식 데이터로 검증

논문 25쪽 ~ 28쪽 (Section 7 전체)을 풀어본다.

이 섹션은 **실제 주식 데이터에서 RP-PCA의 우수성**을 확인하는 부분.

---

## 11.1 데이터셋

### 데이터 출처와 구성
> **원문**: "We apply our estimator to a large number of anomaly sorted portfolios. The same data is studied in more detail in our companion paper Lettau and Pelger (2018). Based on the universe of U.S. firms in CRSP, we consider 37 anomaly characteristics following standard definitions in Novy-Marx and Velikov (2016), McLean and Pontiff (2016) and Kogan and Tian (2015)."

### 풀어 설명

| 항목 | 내용 |
|------|------|
| 자산 universe | CRSP US 주식 (모든 미국 주식) |
| 사용 anomaly 개수 | 37개 |
| Anomaly 정의 출처 | Novy-Marx & Velikov (2016), McLean & Pontiff (2016), Kogan & Tian (2015) |

### "Anomaly"가 뭔가요?
**Anomaly (이상현상)** = 자본자산가격결정모형(CAPM)으로 설명되지 않는 수익률 패턴.

**대표적 예시**:
- **Size effect**: 작은 회사 주식이 큰 회사보다 평균적으로 더 좋은 수익.
- **Value effect**: 장부가/시가 비율 높은 주식이 낮은 주식보다 좋은 수익.
- **Momentum**: 최근 잘 오른 주식이 계속 잘 오름.
- **Profitability**: 이익률 높은 회사 주식이 더 좋은 수익.
- **Investment**: 투자 적은 회사가 많은 회사보다 더 좋은 수익.

→ **37개 다양한 anomaly**를 사용.

### Decile sort
> "We use the same data set as Kozak, Nagel and Santosh (2017) who have sorted the stock returns in yearly rebalanced decile portfolios."

**풀어 설명**:
- 각 anomaly에 대해 주식을 10개 그룹 (decile)으로 정렬.
- **매년 rebalance** (다시 정렬).
- 각 decile이 하나의 포트폴리오.

### 포트폴리오 개수
> "This gives us a total cross-section of $N = 370$ portfolios of monthly returns from 07/1963 to 12/2017 (T = 650)."

**풀어 설명**:
- 37 anomaly × 10 decile = **N = 370 포트폴리오**.
- **T = 650 monthly** (1963년 7월 ~ 2017년 12월 = 약 55년).

### Risk-free rate
> "The risk-free rate to obtain excess returns is from Kenneth French's website."

**풀어 설명**: 무위험 수익률 = Kenneth French 데이터.

### 각주 22, 23
> "We thank the authors for sharing the data."
> "Kozak, Nagel and Santosh (2017) create a data set based on 50 anomalies, but 13 of these anomalies are only available for a significantly shorter time horizon. We choose only those anomalies that are available for the whole time horizon of $T = 650$ observations."

**풀어 설명**:
- 원래 KNS 데이터셋은 50개 anomaly, 13개는 시계열 짧음.
- **시계열 일정한 37개만** 사용.

---

## 11.2 평가 지표

> **원문**: "We estimate statistical factors for different choices of $\gamma$ and evaluate the maximum Sharpe-ratio, average pricing error and explained variation in- and out-of-sample."

세 가지 지표:

### 지표 1: Maximum Sharpe-ratio (SR)
> "Table 1 reports the results for $K = 3$ and $K = 5$ factors for RP-PCA with $\gamma = 10$ and PCA ($\gamma = -1$). $SR$ denotes the maximum Sharpe-ratio that can be obtained by a linear combination of the factors, i.e. it combines the factors with the weights $\Sigma_F^{-1}\mu_F$. It measures how well the factors can approximate the stochastic discount factor."

### 풀어 설명

**최대 샤프 비율**: 추정 요인들을 어떻게 선형결합하면 SR이 가장 클까?

**최적 가중치**: $\Sigma_F^{-1}\mu_F$ — Markowitz 최적 포트폴리오.

**의미**: 
- 추정 요인의 정보가 얼마나 좋은가의 척도.
- **확률적 할인요인(SDF)** 근사 능력.

**SDF란?**: 모든 자산의 기대수익을 결정하는 이론적 객체. SR이 크면 SDF 잘 근사.

### 지표 2: RMS α
> "The root-mean-squared pricing error ($RMS \alpha$) equals $\sqrt{\frac{1}{N}\sum_{i=1}^N \alpha_i^2}$, where the pricing error $\alpha_i$ is the intercept of a time-series regression of the excess return of asset $i$ on the factors."

### 풀어 설명

**Pricing error α**: 자산 $i$ 수익률을 요인에 회귀했을 때 **절편**.

수식적: $X_{t,i} = \alpha_i + F_t \Lambda_i^\top + e_{t,i}$.

**의미**: α는 모델이 설명 못 한 평균 수익. 진짜 자산가격 요인이라면 α = 0.

**RMS α**: 모든 자산의 α를 제곱평균. 작을수록 모델 좋음.

### 지표 3: Idiosyncratic Variation (Idio. Var)
> "The idiosyncratic variation is the average variance of the residuals after regressing out the factors."

### 풀어 설명

**잔차 분산 평균**: 모델이 설명 못 한 변동.

**의미**: 요인들이 변동을 얼마나 잘 설명하는가의 보완 지표.

---

## 11.3 In-sample vs Out-of-sample

### In-sample
> "The in-sample analysis is based on the whole time horizon of $T = 650$ months."

**풀어 설명**: 전체 650개월 데이터를 모두 사용 → 추정·평가 함께.

### Out-of-sample 절차
> "The out-of-sample analysis estimates the loadings with a rolling window of 20 years ($T = 240$). With these estimated loadings including information up to time $t$ we predict the systematic return and obtain a pricing error out-of-sample at $t + 1$. This corresponds to a cross-sectional pricing regression with out-of-sample loadings."

### 절차 — 단계별

**Step 1**: 시점 $t$ 까지의 최근 20년 (240개월) 데이터로 $\hat\Lambda$ 추정.

**Step 2**: $t+1$ 시점의 자산 수익 $X_{t+1}$ 을 $\hat\Lambda$ 에 사영해 횡단면 회귀 → $\hat\alpha_{t+1}$.

**Step 3**: 모든 $t$ 에 대해 반복.

**Step 4**: $\hat\alpha_{t+1}$ 의 평균·분산 → OOS pricing error 와 OOS idio var.

> "The mean and variance of the out-of-sample errors are used to calculate the average pricing error and the idiosyncratic variation. We use the optimal portfolio weights for the maximum Sharpe-ratio portfolio estimated in the rolling window period to create an out-of-sample optimal return giving us the maximum Sharpe-ratio portfolio out-of-sample."

**OOS Sharpe**:
- Rolling window에서 최적 포트폴리오 가중치 계산.
- 그 가중치를 다음 달 수익에 적용 → OOS 수익.
- 모든 $t$ 의 OOS 수익으로 OOS SR 계산.

### 왜 OOS가 중요한가?
- In-sample은 overfitting 가능.
- OOS = **실제 투자 시뮬레이션** → 진짜 성능 측정.

---

## 11.4 Table 1 — 핵심 결과

> **원문 (Table 1)**:
> | | In-sample | | | Out-of-sample | | |
> |---|---|---|---|---|---|---|
> | | SR | RMS α | Idio. Var. | SR | RMS α | Idio. Var. |
> | RP-PCA 3 factors | 0.23 | 0.17 | 12.75% | 0.18 | 0.15 | 14.57% |
> | PCA 3 factors | 0.17 | 0.17 | 12.68% | 0.14 | 0.15 | 14.66% |
> | RP-PCA 5 factors | 0.53 | 0.14 | 10.76% | 0.45 | 0.12 | 12.70% |
> | PCA 5 factors | 0.24 | 0.14 | 10.66% | 0.17 | 0.14 | 12.56% |

> "Table 1: Maximal Sharpe-ratios, root-mean-squared pricing errors and idiosyncratic variation for different number of factors. RP-weight $\gamma = 10$."

### 결과 해석

#### K=3 (3개 요인)
- **In-sample SR**: RP-PCA 0.23 vs PCA 0.17 → **35% 향상**.
- **OOS SR**: RP-PCA 0.18 vs PCA 0.14 → **29% 향상**.
- **RMS α, Idio Var**: 거의 동일.

#### K=5 (5개 요인) — ★ 가장 강력한 결과
- **In-sample SR**: RP-PCA 0.53 vs PCA 0.24 → **121% 향상 (≈ 2.2배)**.
- **OOS SR**: RP-PCA 0.45 vs PCA 0.17 → **165% 향상 (≈ 2.6배)**.
- **OOS RMS α**: RP-PCA 0.12 vs PCA 0.14 → 14% 작음.
- **Idio Var**: 거의 동일.

### 핵심 메시지

> **원문**: "RP-PCA and PCA differ the most in terms of the maximum Sharpe-ratio. For $K = 5$ factors the in- and out-of-sample Sharpe-ratio of RP-PCA is twice as large as for PCA."

**풀어 설명**: 가장 큰 차이는 **Sharpe-ratio** — K=5에서 2배.

> "For $K = 3$ factors there is still a sizeable difference in Sharpe-ratios, but it is less pronounced than for a larger number of factors. A possible reason is that the 4th or 5th factor is weak with a high Sharpe-ratio and only picked up by RP-PCA, while the first four factors are stronger and hence can be detected by PCA."

### ★ 결정적 통찰

**K=3과 K=5의 차이**가 의미하는 것:
- **1~3번 요인**: 강한 요인 → PCA로도 잡힘 → 효과 차이 작음.
- **4~5번 요인**: **약한 요인 + 높은 SR** → PCA로 못 잡고 **RP-PCA로만 잡힘**.
- 이게 K=5에서 SR이 급증하는 이유.

> "Surprisingly, the pricing errors and the unexplained variation are very close for the two methods. Only the out-of-sample pricing error of RP-PCA is smaller than for PCA."

### 변동 설명력 비교
- **놀라움**: RMS α 와 Idio Var 는 두 방법이 거의 같음.
- → **"같은 변동을 설명하면서도 SR만 크게 향상"**.

> "It seems that RP-PCA selects high Sharpe-ratio factors with smaller out-of-sample pricing errors without sacrificing explanatory power for the variation."

**풀어 설명**: RP-PCA는 **변동 설명력을 희생하지 않고 SR과 가격결정력만 향상**시킨다.

---

## 11.5 Figure 8 — $\gamma$의 효과

> **원문**: "Figure 8 analyzes the effect of $\gamma$ and the number of factors on the three criteria maximum Sharpe-ratio, pricing error and variation."

### Figure 8 구조
- 6개 sub-plot: (SR, RMS α, Idio Var) × (IS, OOS)
- x축: $\gamma \in [0, 20]$
- 색: 요인 수 $K \in \{1, 2, 3, 4, 5, 6\}$

### 관찰

**SR (in-sample 좌상)**:
- K=1, 2, 3 (3개 이하): $\gamma$ 변화에 따른 SR 큰 변화 없음.
- K=4 (검정선): $\gamma$ 0 → 5에서 급증 (~0.2 → ~0.4), 이후 포화.
- **K=5 (파랑/녹색)**: $\gamma$ 0 → 10에서 급증 (~0.3 → ~0.6), 가장 큰 효과.
- K=6: K=5와 거의 동일 (추가 요인 효과 미미).

**SR (OOS 우상)**: 비슷한 패턴, 값만 약간 작음.

**RMS α**: $\gamma$ 영향 미미 (K 영향이 더 큼).

**Idio Var**: $\gamma$ 무관, $\gamma = 0$ 부터 일정.

### 핵심 메시지
> **원문**: "The Sharpe-ratio and pricing error change significantly when including the 5th factor. This 5th factor is also strongly affected by the choice of $\gamma$ and seems to require $\gamma > 5$ to be detected by RP-PCA. Adding the 6th factor has only a very minor effect on the three criteria. That is why we opt for a 5-factor model. The figure illustrates that the amount of unexplained variation is insensitive to the choice of $\gamma$. Hence, our factors capture more pricing information while explaining the same amount of variation in the data."

### 결론
1. **K=5**가 적정 (K=6 추가 효과 미미).
2. **5번째 요인은 $\gamma > 5$ 필요** (약한 + 높은 SR).
3. **변동은 $\gamma$ 무관** — 가격결정만 좋아짐.

---

## 11.6 Table 2 — 분산 신호 (Variance Signals)

> **원문**: "Table 2 shows that the variance signal for different factors suggests the existence of weak factors. Here we extract the first 6 factors with RP-PCA ($\gamma = 10$) and PCA. In addition, we include the popular Fama-French 5 factors (market, size, value, profitability and investment) from Kenneth French's website."

### Table 2

| 요인 | PCA | RP-PCA ($\gamma = 10$) | FF5 |
|------|-----|---------|-----|
| 1번 ($\sigma_1^2$) | 8.05 | 8.05 | 8.00 |
| 2번 ($\sigma_2^2$) | 0.27 | 0.27 | 0.21 |
| 3번 ($\sigma_3^2$) | 0.21 | 0.21 | 0.17 |
| 4번 ($\sigma_4^2$) | 0.14 | 0.14 | 0.03 |
| 5번 ($\sigma_5^2$) | 0.05 | 0.05 | 0.02 |
| 6번 ($\sigma_6^2$) | 0.03 | 0.04 | 0 |

### 풀어 설명

**분산 신호**: $\Lambda\Sigma_F\Lambda^\top$ 의 큰 고유값 (잡음 분산 $\sigma_e^2$ 로 정규화).

**관찰**:
- 1번 요인 (시장): 신호 8.05 → **매우 강함** (>>임계값 ~3.3).
- 2, 3번: 0.21~0.27 → **약한 요인 영역**.
- 4번: 0.14 → 더 약함.
- **5번: 0.05** → **시뮬 디자인의 weak factor 영역과 일치** ($\sigma_F^2 = 0.05$).
- 6번: 0.03~0.04 → 매우 약함.

### 시뮬과의 매칭
> "We normalize these eigenvalue by the same constant $\sigma_e^2 = \frac{1}{N}\sum_{i=1}^N \sigma_{e,i}^2$ based on the residuals from 6 PCA factors. This makes the variance signals comparable to our simulation design. The 5th factor has a variance signal around 0.05 which based on our simulation is well described by a weak factor model. The simulations also predict that these weak factors can be better estimated by RP-PCA if they have a large Sharpe-ratio. This is exactly what we observe in the data."

### ★ 핵심 — 시뮬과 실증의 일치

**시뮬 디자인**:
- $\sigma_F^2 = 0.03 \sim 0.1$ = "매우 약한 ~ 약한 요인"
- 이 영역에서 RP-PCA가 PCA 압도

**실증**:
- 5번째 요인 신호 = 0.05 = 시뮬 디자인 영역 정확히 일치
- → **시뮬레이션이 실증을 정확히 묘사** → 실증 결과 신뢰성 ↑

### 각주 24
> "The results do not change if we regress out more PCA or RP-PCA factors and are available upon request."

**풀어 설명**: 잔차 추출 방식이 달라도 결과 robust.

---

## 11.7 Figure 9 — Eigenvalue 비교

> **원문**: "The left plot in Figure 9 shows the eigenvalues of the matrix $\frac{1}{N}\left(\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top\right)$ normalized by the average idiosyncratic variance."

### Figure 9 좌측 (정규화 고유값)
- x축: 고유값 순위 (1, 2, 3, ...)
- y축: 정규화된 고유값
- 색: $\gamma \in \{-1, 0, 1, 5, 10, 20\}$

**관찰**:
- 1번째 고유값 (~8): 모든 $\gamma$ 에서 거의 동일 (강한 시장 요인).
- **2~6번째**: $\gamma$ 클수록 점점 큼 (signal-strengthening).
- 7번째 이후: 모든 $\gamma$ 비슷 (잡음 영역).

> "Our weak factor model predicts that the signal of this matrix should be larger for RP-PCA compared to PCA. The eigenvalue curves confirm that the signal for the weaker factors clearly separates from the PCA signal. $\gamma = 10$ seems to be sufficient for strengthening the signal."

### Figure 9 우측 (PCA 대비 비율)
- y축: RP-PCA 고유값 / PCA 고유값.

**관찰**:
- 1번째 = 1 (시장은 변화 없음).
- **5번째**: $\gamma = 20$ 에서 ~1.5 (50% 증폭).
- 6번째 이후: 다시 1 근처 (잡음).

> "The right plot in Figure 9 normalizes the eigenvalues by the corresponding PCA eigenvalues. In particular the signal for the 6th factor is strengthened."

### 의미
**Signal-strengthening의 실증 증거** — 4, 5, 6번째 약한 요인의 고유값이 RP-PCA에서 명확히 강화됨.

---

## 11.8 권장 hyperparameter

이 섹션에서 도출된 실증 권장 설정:

| Hyper-parameter | 권장값 | 근거 |
|----------------|------|------|
| $\gamma$ | **10** | Figure 8: $\gamma > 5$ 면 5번째 요인 검출, 너무 크면 overfitting |
| $K$ | **5** | Figure 8: K=6 추가 효과 미미 |
| Q | 표준편차 역수 (correlation matrix) | 자산 변동성 차이 정규화 |
| OOS window | 20년 ($T=240$) | 충분한 표본 + 시변 허용 |

---

## 11.9 실증 결과 종합

### 5가지 핵심 발견

1. **K=5, $\gamma = 10$ RP-PCA가 PCA를 압도** (SR 2배 이상).
2. **변동 설명력은 동일** (Idio Var 같음) → "공짜 점심" 같은 결과.
3. **5번째 요인이 약함 + 높은 SR** → RP-PCA만 잡음.
4. **OOS에서도 우수** → overfitting 아님, 진짜 성능.
5. **시뮬과 실증 일치** → 이론 신뢰성.

### 비유
**전등 비유**:
- 방에 5개 전구가 있다.
- 4개는 큰 100W 전구 → PCA로도 보임.
- 1개는 작은 5W 전구지만 **위치가 절묘함** (= 높은 SR).
- PCA: 큰 전구 4개만 본다. 작은 전구 못 봄.
- RP-PCA: **작은 전구의 위치(평균) 정보를 활용**해서 작은 전구도 잡아낸다.
- 결과: RP-PCA 사용자는 5개 다 보고, 방 전체를 더 잘 이해.

---

## 11.10 Section 7 핵심 정리

| 항목 | 내용 |
|------|------|
| 데이터 | CRSP, 37 anomaly × 10 decile = N=370 |
| 기간 | 1963/07 ~ 2017/12 (T=650 month) |
| 권장 설정 | $K=5, \gamma=10$ |
| 핵심 결과 | **SR PCA의 2배** (IS, OOS 모두) |
| 변동 설명력 | RP-PCA와 PCA 거의 동일 |
| 5번째 요인 분산신호 | 0.05 (시뮬 디자인 영역과 일치) |
| 실증-시뮬 일치 | 약한 + 높은 SR 요인을 RP-PCA만 잡음 |

**한 줄 핵심**:
> **"실제 미국 주식 시장 데이터에서, 5개 요인 RP-PCA가 PCA 대비 샤프 비율 2배 이상. 변동 설명력은 같음. 약한 요인 검출이 그 차이의 원인."**

다음 파일(**12_결론_Section8.md**)에서는 **논문의 결론과 기여**를 정리한다.

---


---

## 인터랙티브 시각화

```viz:rppca-sharpe-comparison:title=Table 1 — PCA vs RP-PCA Sharpe-ratio;caption=K=5에서 RP-PCA가 PCA의 2배 이상. K와 IS/OOS 버튼으로 비교.
```

```viz:rppca-eigenvalue-spectrum:title=Figure 9 재현 — γ별 고유값 곡선;caption=γ가 클수록 4·5·6번째 고유값이 PCA 대비 강화. 5번째 요인이 핵심.
```

```viz:rppca-corr-heatmap:title=추정-진짜 요인 상관 행렬;caption=PCA는 4번째 요인 매칭이 ~0.18 (거의 잡음). RP-PCA(γ=10)는 ~0.78로 강한 매칭.
```

## 자기점검 (이 챕터)

### 핵심 3가지
1. **데이터셋의 N, T, K, γ는?**
2. **Table 1에서 K=5의 SR 비교 결과?**
3. **5번째 요인 분산 신호 0.05 의 의미는?**

### 답변
1. N=370 (37 anomaly × 10 decile), T=650 (1963/07~2017/12 월간), K=5 권장, γ=10 권장.
2. In-sample: RP-PCA 0.53 vs PCA 0.24 (2.2배). OOS: RP-PCA 0.45 vs PCA 0.17 (2.6배). Idio Var는 거의 동일.
3. 시뮬 디자인의 "weak factor" 영역과 정확히 일치 → 시뮬과 실증이 같은 구조를 묘사. RP-PCA만이 이 요인을 활용 가능.
