# 01. 시작하기 전에 — 미리 알아둘 8개 개념

> 본 deep dive 의 모든 챕터를 들어가기 전에, 무배경 독자가 알아야 할 8개 핵심 개념을 친근한 설명으로 정리.

---

## 이 논문이 뭘 하는 논문인가요?

**한 줄**: "단순한 모델이 좋다" 는 60년 통념을 깨고, **복잡한 모델 + 적절한 ridge** 가 OOS Sharpe ratio 를 단조 증가시킴을 증명한 *Journal of Finance 2024* 의 이론·실증 논문.

**풀어 설명** (5-8 문장):

자산가격 학계는 1980년대 부터 시장 수익률을 "예측 가능한가?" 라는 질문에 매달렸다. Goyal & Welch 가 *Review of Financial Studies 2008* 에 "**우리가 다 해봤는데 안 됨** — historical mean 이 어떤 모델보다 나았다" 는 비관적 결론을 낸 이후, 학계의 분위기는 "수익률은 사실상 unpredictable" 로 굳어졌다.

그러나 동시에 머신러닝 시대가 도래하면서 Gu-Kelly-Xiu (2020), Chen-Pelger-Zhu (2023) 같은 논문들이 "**ML 로는 잘 됨**" 을 실증으로 보였다. 두 흐름이 충돌. **왜 ML 만 되는가?**

본 논문 (Kelly-Malamud-Zhou 2024) 이 그 답을 이론으로 제공한다. 핵심 발견: 모델 파라미터 수 $P$ 가 학습 표본 수 $T$ 보다 훨씬 클 때 ($P \gg T$, "high-complexity regime"), **적절한 ridge shrinkage 만 더하면 OOS Sharpe ratio 가 모델 복잡도와 함께 단조 증가**한다 — Random Matrix Theory 로 증명. 이를 *Virtue of Complexity* (Theorem 1) 라 명명.

실증: CRSP 1926-2020 + Goyal-Welch 의 그 15 predictor + Random Fourier Features 로 $P$ 를 12,000 까지 확장. 결과 — Sharpe ratio ≈ 0.47/year improvement vs buy-and-hold, 14/15 NBER recessions 자동 divest (constraint 없이). Goyal-Welch 의 *원본 데이터로 정반대 결론*.

저자 권고: "**Use the largest model you can compute**" + "All plausibly relevant predictors" + "Rich nonlinear models" + "Prudent shrinkage".

---

## 이 가이드 구성

| 챕터 | 내용 |
|------|------|
| 02 | 제목·Abstract 단어별·문장별 풀이 |
| 03 | Introduction 7 단락 — 왜 이 연구가 필요 |
| 04 | Section I (Assumptions 1-4, timing 전략, Proposition 1) |
| 05a | Section II (RMT + Stieltjes + Proposition 2) |
| 05b | Section III (correctly specified, Propositions 3·4) |
| 05c | Section IV (misspecification + **Theorem 1**) |
| 06 | 이론 시뮬 — Figures 1-6 |
| 07 | 실증 — CRSP + RFF + Figures 7-11 + Table I |
| 08 | Conclusion + Box quote + Occam's blunder |
| 09 | Appendix — 증명 풀이 |
| 10 | 용어집 + 기호 사전 |
| 11 | 메타 통찰 12개 |
| 12 | Python 실행 코드 |
| 13 | ASCII 도식 + viz 카탈로그 |

**처음 읽는 사람** 권장 순서: 01 → 02 → 03 → 06 (그림 보기) → 07 (실증) → 11 (통찰).
**이론 관심**: 04 → 05a → 05b → 05c → 09.
**실무 관심**: 03 → 07 → 12 → 08.

---

## 미리 알아두면 좋은 8개 개념

### 1. "Sharpe ratio" 가 뭐예요?

투자 전략의 **위험 대비 수익률** 측정.

$$SR = \frac{\text{기대 초과수익}}{\text{수익률 표준편차}}$$

직관:
- 어떤 두 전략이 같은 평균 수익을 낸다면, **변동성 작은 게 더 좋다**.
- "변동성 1 단위당 얼마의 추가 수익?" 의 비율.

**정량 감각**:
- $SR > 0.5$: 괜찮은 strategy.
- $SR > 1.0$: 매우 좋음 (헤지펀드 업계의 "good" 기준).
- $SR > 2.0$: 극히 드문 (Renaissance Tech의 Medallion fund 추정 ~2).
- Buy-and-hold 시장: $SR \approx 0.4$ historically.

본 논문의 ML timing 결과: SR 0.47 *improvement* vs market — 즉 buy-and-hold 위에 추가 0.47 의 alpha-like 보상.

### 2. "Ridge regression" 이 뭐예요?

선형 회귀 $R = S' \beta + \varepsilon$ 의 변형. 일반 OLS 의 $\hat\beta_{OLS} = (S'S)^{-1} S'R$ 가 $S'S$ 가 singular 일 때 망함. Ridge 는 그걸 막기 위해 대각선에 *작은 상수 $z$* 더함:

$$\hat\beta(z) = (zI + S'S)^{-1} S'R.$$

직관:
- $z = 0$: OLS (no shrinkage).
- $z$ 크면: $\hat\beta$ 가 0 쪽으로 *shrink* (보수적 추정).
- 적절한 $z$: bias 약간 추가 + variance 큰 폭 감소 → **net MSE 감소**.

야구로 비유: 신인 선수의 평균 타율이 0.400 일 때 (적은 표본), "0.250 (전체 평균) 쪽으로 약간 끌어당기는" 것이 ridge. 신뢰성 ↑.

**Ridgeless** ($z \to 0+$): $P > T$ 일 때 OLS 안 됨, 그러나 ridge 의 limit 으로 정의. Moore-Penrose pseudo-inverse 와 동등.

### 3. "OLS 가 P ≈ T 에서 망하는 이유?"

데이터 $T = 100$, 변수 $P = 100$ 라면 OLS 가 데이터 100% 학습 가능 (zero training error). 그러나 *학습한 $\beta$ 가 noise 까지 fit* 한 결과 → OOS 망함.

수학적: $(S'S)$ 의 condition number 가 $P \to T$ 에서 폭발 → $(S'S)^{-1}$ 의 작은 element 가 거대 → $\hat\beta$ explosive.

직관: "데이터 부족한 상태에서 회귀선이 *너무 자유롭게 휘청* — 새 데이터에는 안 맞음".

**핵심 패러독스 (본 논문의 발견)**: $P > T$ ($c > 1$) 에서는 이게 *역전* 된다. Smallest-norm solution (ridgeless) 이 implicit regularization 으로 작동 → **benign overfit**.

### 4. "Random Matrix Theory (RMT)" 이 뭐예요?

큰 행렬 (수천 × 수천) 의 *eigenvalue 분포* 의 limit theorem.

**역사적 발견**: Wigner (1955) 가 nuclear physics 에서 random Hamiltonian 의 eigenvalue 분포 발견. Marchenko-Pastur (1967) 가 random covariance matrix 의 분포 정리.

**핵심 메시지**:
- 데이터 $T \times P$ 행렬 $X$ 에서 $\hat\Sigma = T^{-1} X' X$ 가 sample covariance.
- $T \to \infty, P$ fixed 면 $\hat\Sigma \to \Sigma$ (true). 표준 결과.
- $T, P \to \infty, P/T \to c > 0$ 이면 $\hat\Sigma$ 의 eigenvalue 분포가 *systematically perturbed*. 정확한 perturbation 식: Marchenko-Pastur.

**finance 응용**: 본 논문이 RMT 를 자산가격 예측에 가져온 첫 작품 (Hastie et al 2022 의 일반화).

### 5. "Stieltjes transform" 이 뭐예요?

분포 $F$ 의 모든 정보를 *단일 함수* 로 압축.

$$m_F(z) = \int \frac{1}{x - z} dF(x), \quad z \in \mathbb{C} \setminus \text{supp}(F).$$

직관:
- $F$ 가 discrete (eigenvalues) 이면 $m_F(z) = (1/P) \sum_k 1/(\lambda_k - z)$.
- "$z$ 에서 분포까지의 *resolvent distance* 의 평균".
- $m_F$ 가 $F$ 를 unique 결정 (Stieltjes inversion formula).

본 논문에서: $m(-z; c) = \lim P^{-1} \text{tr}((zI + \hat\Psi)^{-1})$. 모든 portfolio quantity 가 이 함수만 의존 (Proposition 2). 가장 위대한 단순화.

### 6. "Random Fourier Features (RFF)" 가 뭐예요?

Rahimi & Recht (2007) 의 발명. 비선형 특성을 만드는 단순 trick:

원본 데이터 $G \in \mathbb{R}^{15}$ → 무작위 방향 $\omega \sim N(0, I)$ → $G \cdot \omega$ 라는 *random projection* → 그걸 $\sin$ / $\cos$ 에 통과:

$$S_i = [\sin(\gamma \omega_i' G), \cos(\gamma \omega_i' G)].$$

$P$ 개의 random direction 으로 $2P$ 개의 nonlinear feature 생성.

**의미**:
- Gaussian kernel $K(x, y) = \exp(-\gamma \|x-y\|^2/2)$ 의 random approximation.
- $P \to \infty$ 면 universal approximator.
- RFF + linear regression = wide 2-layer neural network (with random fixed first layer weights).

본 논문에서는 Goyal-Welch 15 → RFF P=12,000 (5000 pair + sin/cos) 로 확장.

### 7. "Benign overfit" 이 뭐예요?

통계학계의 최근 (2019+) 발견. 머신러닝의 가장 신비한 현상 중 하나.

**전통 직관**: 모델이 학습 데이터에 *정확히 fit* (zero training error) 하면 *overfit* — OOS 망함.

**새 발견**: 어떤 조건에서는 zero training error 임에도 OOS *정확*. 이를 "**benign overfitting**" (Bartlett, Long, Lugosi, Tsigler 2020).

직관 (smallest norm solution):
- $P > T$ 에서 OLS 해가 무수히 많음 (다 zero training error).
- Ridgeless (Moore-Penrose pseudo-inverse) 가 그 중 *smallest $\ell_2$ norm* 해 선택.
- 작은 norm = 부드러운 함수 = OOS 일반화 잘됨.

**Double descent** (Belkin et al 2019): OOS MSE 가 $c = 1$ 에서 hump 후 양쪽 감소 — interpolation boundary 가 *나쁜* 지점, 그 너머가 *다시 좋아짐*.

본 논문은 이 통계학 발견을 finance 의 timing 문제에 적용.

### 8. "Market timing" 이 뭐예요?

전략 = 자산 비중 ($\pi_t$) 을 시점마다 변화.

$$R^\pi_{t+1} = \pi_t R_{t+1}.$$

- $\pi = 1$: 항상 100% 시장 보유 (buy-and-hold).
- $\pi = 0.5$: 50% 시장 + 50% cash.
- $\pi = -1$: 100% short.
- $\pi_t = f(G_t)$: $G_t$ 로 시장 상황 판단해서 weight 결정.

본 논문의 timing weight: $\pi_t = S_t' \hat\beta(z)$ — 예측된 conditional expected return 그대로.

**왜 timing 이 중요?**
- 시장 risk premium 의 *시간 변화* (Cochrane 2011 의 presidential address) — 자산가격결정의 central question.
- "How much do discount rates vary over time?" — timing 이 그 답을 보여줌.

**Buy-and-hold normalization**: 본 논문의 SR 은 buy-and-hold 위의 *additional* return. SR = 0.47 = market 위에 0.47/year 의 risk-adjusted excess.

---

## 이 논문을 읽을 때의 마음가짐

- **시간 없으면**: [03_motivation.md](03_motivation.md) → [06_simulation.md](06_simulation.md) (Figure 6) → [07_empirical.md](07_empirical.md) (Table I) → [11_insights.md](11_insights.md) 만 읽어도 핵심.
- **이론 관심**: [04_environment.md](04_environment.md) → [05_method_a_rmt.md](05_method_a_rmt.md) → [05_method_c_misspec.md](05_method_c_misspec.md) 의 Theorem 1 → [09_appendix_proof.md](09_appendix_proof.md).
- **실무 응용**: [07_empirical.md](07_empirical.md) → [12_code.md](12_code.md) (Python 실행) → [08_conclusion.md](08_conclusion.md) 의 recommendation.
- **시각화로 이해**: [13_diagrams.md](13_diagrams.md) 의 viz 카탈로그 인터랙티브.

---

## 한 가지 약속

- 모든 수식은 [04_챕터_표준_작성법.md](../../study/교수님/deep_dive/04_챕터_표준_작성법.md) 의 *4줄 원칙* 으로 풀이 (기호/비유/형태/주의).
- 모든 챕터 끝에 *자기점검* — 핵심 3 질문 + 답변.
- 원문 한 줄도 누락 X — 모든 정리·가정·각주 풀이.
- 한국어 + 영어 용어 혼용 — 영어 용어 처음 등장 시 한국어 풀이.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Sharpe ratio 와 Information ratio 의 차이?**
2. **Random Matrix Theory 가 finance 에 빌려와야 하는 이유?**
3. **Benign overfit 의 직관?**

### 답변
1. **Sharpe ratio** = $E[R^\pi]/\sqrt{Var(R^\pi)}$. 절대 위험 대비 수익. **Information ratio** = $\alpha / \sigma_\alpha$ where $\alpha$ 는 market-adjusted (regress on market) excess. **Buy-and-hold 위의 추가 수익**. SR 는 absolute, IR 는 *vs benchmark*. 본 논문 결과: SR≈0.47 (market 보다 좋은 정도), IR≈0.3 (market 위의 alpha-like). 둘 다 SR/IR > 0.4 / 0.3 + t > 2.5 면 robust.
2. 자산가격 ML 에서 $P > T$ 가 자연 ($P = 12,000, T = 12$). 이 영역에서 traditional asymptotic ($T \to \infty$, $P$ fixed) 안 통함 — $\hat\Sigma \to \Sigma$ 보장 X. RMT 가 *$P, T \to \infty, P/T \to c > 0$* 의 limit 에서 sample eigenvalue 의 distributional limit (Marchenko-Pastur) 를 정확히 알려줌. 본 논문이 이 RMT 결과를 timing 의 expected return / variance / Sharpe 의 limit 도출에 사용. 그 덕에 *closed-form theorem 1* 가능.
3. $P > T$ 에서 무수히 많은 zero-training-error 해 중 *smallest norm* 해를 ridgeless 가 선택. 작은 norm = 더 부드러운 함수 = OOS 안 흔들림 = generalization. 직관적으로 "데이터를 외운다 (overfit) 가 아니라 *외우면서도 일반화* 한다". $c$ 증가 → 더 많은 해 → 더 작은 norm 가능 → 더 잘 generalize. 통상의 "overfit = bad" 직관과 정반대. 본 논문이 이 statistical 발견을 finance timing 에 적용해 *마치 데이터에 완벽 fit 한 ML 모델이 OOS Sharpe > 0* 임을 증명.

---

다음 파일 [02_abstract.md](02_abstract.md) — 제목·Abstract 풀이부터 시작.
