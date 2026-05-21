# 04. SDF Framework — Section I (Model)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- SDF (Stochastic Discount Factor) framework — 자산가격결정의 fundamental equation
- Eq 1 의 정확한 의미 — $\mathbb{E}[M_{t+1} R^e_{t+1,i}] = 0$
- No-arbitrage 의 수학적 정의
- KPS·IPCA·본 논문의 SDF 관계

---

paper p.6-12 (Section I). **No-arbitrage condition + SDF + adversarial GMM (Eq 1-3)**.

이 챕터의 목표: paper 의 모든 수식 (Eq 1, 2, 3) 을 한 줄씩 풀이 + no-arbitrage 의 이론적 토대 + adversarial 의 동기.

---

## 4.1 챕터 한 줄 요약

paper 의 framework:
1. **No-arbitrage condition**: $E[M R^e] = 0$ — 자산 가격결정의 fundamental equation.
2. **SDF**: $M = 1 - \omega^\top R^e$ — affine 정규화.
3. **Tangency portfolio = SDF portfolio**: $\omega$ = mean-variance efficient weights.
4. **Conditional moments (Eq 2)**: $E[M R^e g(I)] = 0$ for any $g$ — 무한 family.
5. **Adversarial GMM (Eq 3)**: $\min_\omega \max_g$ — SDF 가 가장 mispriced 한 test asset 까지 잘.

---

## 4.2 Section I.A — No-Arbitrage Asset Pricing 의 토대

### 🌱 일상 비유 — "학생-시험" 패러다임

본 paper 의 framework 를 학생-시험 비유로 통일:
- **자산 (stock)** = "학생" — 각자 다른 위험과 수익.
- **SDF $M$** = "공정한 채점자" — 모든 학생을 공정하게 평가.
- **No-arbitrage** = "공정 채점 조건" — 모든 학생의 평균 점수가 0 이어야 (위험만큼 수익 = balance).
- **Test asset $g$** = "시험 문제" — 채점자를 평가.
- **GAN minimax** = "출제자 vs 채점자" — 둘이 경쟁해서 최선의 채점자 발견.

이 비유가 본 paper 전체에 일관 적용.

---

### Step 1 — Fundamental no-arbitrage equation

paper p.7:
$$
\mathbb{E}_t [M_{t+1} R^e_{t+1,i}] = 0
$$

### 🔣 4-단 기호 풀이 (Eq 1, 가장 fundamental)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $M_{t+1}$ | Stochastic Discount Factor (SDF) | "공정한 채점자" — 시나리오마다 다른 가중치 | $M > 0$ (positive) 필수 — paper 의 주요 가정 |
| $R^e_{t+1,i}$ | 자산 $i$ 의 excess return | "$i$ 학생의 시험 점수 - 평균" | risk-free $R^f$ 빼야 함 (gross return 아님) |
| $\mathbb{E}_t[\cdot]$ | 시점 $t$ 조건부 기댓값 | "지금 정보 기준 평균 예상" | $t$ 시점 (now) 의 정보만 사용 — no look-ahead |
| $= 0$ | 균형 조건 | "공정한 채점자 의 평균 점수 = 0" | 모든 자산 $i$ 에 대해 동시 성립 |

#### 기호의 의미

| 기호 | 의미 | 비유 |
|------|------|------|
| $M_{t+1}$ | Stochastic Discount Factor (SDF, pricing kernel) | "내일의 행복지수" — 각 시나리오마다 다른 값 |
| $R^e_{t+1,i} = R_{t+1,i} - R^f_{t+1}$ | 자산 $i$ 의 excess return (risk-free 초과) | 위험 자산이 안전 자산보다 더 번 부분 |
| $\mathbb{E}_t[\cdot]$ | 시점 $t$ 정보로 조건부 기댓값 | "지금 정보 기준 평균" |

#### 이 식이 의미하는 것

**한 줄 직관**: "SDF 와 excess return 의 곱의 기대값이 0".

비유 (도박):
- $M$ = "내일 행복했을 때의 점수" (good state = high $M$, bad state = low $M$).
- $R^e$ = "투자해서 번 돈".
- $M \cdot R^e$ = "행복했을 때 + 돈 잘 벎" 가중합.
- $E[M R^e] = 0$ = "행복할 때 잘 벌었고, 불행할 때 잃었음" 의 균형.

→ 효율적 시장에서는 모든 자산이 이 균형 조건 만족.

### Step 2 — Equivalent form (β representation)

$$
\mathbb{E}_t [R^e_{t+1,i}] = \beta_{t,i} \cdot \lambda_t
$$

where:
- $\beta_{t,i} = \frac{\text{Cov}_t(R^e_{t+1,i}, M_{t+1})}{-\text{Var}_t(M_{t+1})}$ — risk exposure.
- $\lambda_t = \frac{\text{Var}_t(M_{t+1})}{\mathbb{E}_t[M_{t+1}]}$ — price of risk.

#### 의미

**자산 $i$ 의 기대 excess return = risk exposure × price of risk**.
- $\beta$ 큰 자산 (risk 많이 exposed) → 더 큰 기대 return.
- $\lambda$ 큰 시점 (risk premium 비쌈) → 모든 자산의 expected return ↑.

→ "위험 단위당 보상" 의 곱셈 형태.

### Step 3 — SDF 의 affine 정규화

paper p.7 (footnote 6):

$$
M_{t+1} = 1 - \sum_{i=1}^{N} \omega_{t,i} R^e_{t+1,i} = 1 - \omega_t^\top R^e_{t+1}
$$

#### 왜 이 형태인가

**3 가지 이유**:

1. **Without loss of generality**: SDF 가 risk-free rate $R^f$ 까지 결정 — affine normalization (constant = 1) 으로 risk-free degree-of-freedom 처리.
2. **Asset return 의 선형 결합**: SDF 가 "어떤 portfolio 의 -1 배" — interpretation 가능.
3. **계산 편의**: weights $\omega$ 가 모델의 학습 parameter.

#### $\omega$ 의 의미

$\omega_{t,i}$ = "시점 $t$ 에서 자산 $i$ 에 얼마 투자" (음수 가능 = short).

→ SDF 가 **portfolio** — $\omega$ 가 portfolio weights.

### Step 4 — Eq (1): Mean-Variance Efficient Portfolio

paper Eq (1):
$$
\omega_t = \mathbb{E}_t[R^e_{t+1} R^{e\top}_{t+1}]^{-1} \mathbb{E}_t[R^e_{t+1}]
$$

### 🔣 4-단 기호 풀이 (Eq 1, Markowitz tangency)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\omega_t$ | SDF portfolio weights | "자산별 투자 비율 (long/short)" | 음수 OK (short selling 가능) |
| $\mathbb{E}_t[R^e R^{e\top}]$ | second moment matrix | "자산 간 같이 움직이는 정도 + 자기 분산" | $N \times N$ matrix (자산 수) |
| $\mathbb{E}_t[R^e]$ | expected excess return vector | "각 자산의 평균 초과 수익률" | $N \times 1$ vector |
| $[\cdot]^{-1}$ | 역행렬 | "공분산 효과 풀기" | 역행렬 존재 = 자산이 redundant 안 함 |

#### 이 식이 의미하는 것

**Markowitz mean-variance optimization 의 해**.
- $\mathbb{E}_t[R^e R^{e\top}]$ = second moment matrix.
- $\mathbb{E}_t[R^e]$ = expected excess return vector.
- 곱 = optimal portfolio weights (tangency portfolio).

#### 핵심 발견 — SDF = Tangency Portfolio

**SDF $\omega$ = mean-variance efficient portfolio weights**.

→ **SDF 추정 = tangency portfolio 추정**. 같은 문제.

비유:
- "최고의 위험조정 수익 portfolio 찾기" = "SDF 추정".
- 두 문제가 mathematically 동일.

paper 인용 (Cochrane 2003):
> "Hence, no-arbitrage implies a one-factor model."

### Step 5 — Tangency Factor (single factor representation)

paper p.8:
$$
F_{t+1} = \omega_t^\top R^e_{t+1}
$$

→ $F$ = tangency portfolio 의 return (한 숫자, 매 시점).

이로부터:
$$
R^e_{t+1,i} = \beta_{t,i} F_{t+1} + \epsilon_{t+1,i}
$$

#### 의미

**No-arbitrage ⇔ one-factor model**.
- 모든 자산이 단일 factor $F$ 에 노출 + idiosyncratic noise.
- $\beta_{t,i}$ = 자산 $i$ 의 risk loading.
- $\epsilon_{t+1,i}$ = idiosyncratic risk (no risk premium).

**조건**: $\mathbb{E}_t[\epsilon] = 0$, $\text{Cov}_t(F, \epsilon) = 0$.

→ Fama-French 류의 multi-factor model 이 사실 multi-factor 의 mean-variance combination 으로 single factor $F$ 만들 수 있음.

### Step 6 — β recovery

paper p.8:
$$
(\beta_t^\top \beta_t)^{-1} \beta_t^\top R^e_{t+1} = F_{t+1} + (\beta_t^\top \beta_t)^{-1} \beta_t^\top \epsilon_{t+1} = F_{t+1} + o_p(1)
$$

#### 의미

**$\beta$ 만 알면 SDF factor $F$ 를 재구성 가능** (단 $\epsilon$ 가 diversifiable 한 경우).

→ Cross-sectional regression of $R^e$ on $\beta$ → recover $F$.

비유 (오케스트라):
- $F$ = 지휘자의 박자 (모든 악기가 따라가는 것).
- $\beta_i$ = 악기 $i$ 가 박자에 얼마나 잘 따라가는지.
- 100 악기의 연주 (cross-section) + 각 악기의 동기화 ($\beta$) → 지휘자 박자 ($F$) 재구성.

---

### 🆚 자매 paper 와의 SDF 비교

| Paper | SDF 형태 | $\omega$ 학습 | No-arbitrage |
|-------|---------|--------------|------|
| **본 paper (GAN)** | $M = 1 - \omega^\top R^e$, $\omega$ = NN | Adversarial GMM | ✓ (loss 자체) |
| [RPPCA (Lettau-Pelger)](../2026-05-17_lettau-pelger-rppca/00_README.md) | PCA factor + premium penalty | PCA + penalty | 간접 (penalty) |
| [Autoencoder (Gu-Kelly-Xiu)](../2026-05-17_gu-kelly-xiu-autoencoder/00_README.md) | factor model, $\beta = NN(z)$ | Autoencoder | ✓ (Prop 2 IPCA 호환) |
| [VOC (Kelly-Malamud-Zhou)](../2026-05-20_kelly-malamud-zhou-virtue-complexity/00_README.md) | ridge on RFF | ridge + complexity | ✗ (단순 prediction) |

→ 본 paper 가 **유일하게 minimax adversarial** 으로 SDF + test asset 동시 학습.

---

## 4.3 Section I.B — Adversarial GMM

### Step 1 — Eq (2): Conditional Moments 의 무한 family

paper Eq (2):
$$
\mathbb{E}[M_{t+1} R^e_{t+1,i} g(I_t, I_{t,i})] = 0
$$

### 🔣 4-단 기호 풀이 (Eq 2)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $I_t \in \mathbb{R}^p$ | 거시경제 정보 (시점 t) | "오늘 경제 환경 (실업률·금리 등 178 변수)" | $p = 178$ |
| $I_{t,i} \in \mathbb{R}^q$ | 자산 i 의 firm-specific 정보 | "회사 i 의 특성 (size, momentum 등 46 변수)" | $q = 46$ |
| $g(I_t, I_{t,i})$ | conditioning function (instrument) | "시험 문제" — 어느 상황·자산에 weight 줄지 | $g: \mathbb{R}^{p+q} \to \mathbb{R}^D$ |
| $D$ | g 의 출력 차원 | "한 자산당 만들 시험 문제 개수" | 본 paper: $D = 8$ |
| $\mathbb{E}[\cdot] = 0$ | unconditional 평균이 0 | "어떤 g 를 곱해도 평균 점수 = 0" | 모든 $g$ 에 대해 성립 (무한 family) |

---

for **any** function $g : \mathbb{R}^p \times \mathbb{R}^q \to \mathbb{R}^D$.

#### 기호의 의미

| 기호 | 의미 |
|------|------|
| $I_t \in \mathbb{R}^p$ | macroeconomic conditioning variables (예: inflation, market return) |
| $I_{t,i} \in \mathbb{R}^q$ | firm-specific characteristics (예: size, BEME) |
| $g$ | conditioning function — paper 의 "test asset 생성기" |
| $D$ | moment 의 개수 |

#### 왜 이게 강력한가

**무한 family**: $g$ 의 임의 선택 → 무한히 많은 moment conditions.
- $g = 1$ → 단일 unconditional moment (Eq 1).
- $g = I_{t,i}$ → instrumented moment (각 char 별).
- $g = f(\text{anything})$ → 일반 nonlinear conditioning.

→ paper 가 활용: $g$ 를 **adversarial NN 으로 학습** — 가장 informative 한 instrument 자동 선택.

### Step 2 — Eq (2) 의 3가지 특수 케이스

paper p.8-9:

**(a) 25 Fama-French portfolios**:
- $g$ = size 와 BEME 의 quantile indicator (5×5 grid).
- 25 portfolios 의 mean return 정확히 가격결정.

**(b) Unconditional moments**:
- $g = 1$ (상수).
- 개별 stock 의 unconditional pricing error 최소화.
- 가장 단순한 case.

**(c) Fama-French 3 factor**:
- $\omega$ 와 $\beta$ 가 size 와 BEME 의 2D kernel function.
- 3 factor model 로 reduce.

→ paper 의 일반 framework 가 기존 다양한 estimation 을 포함.

### Step 3 — Eq (3): Adversarial GMM 의 핵심

paper Eq (3):
$$
\min_\omega \max_g \frac{1}{N} \sum_{j=1}^{N} \left| \mathbb{E}\left[ \left(1 - \sum_{i=1}^{N} \omega(I_t, I_{t,i}) R^e_{t+1,i} \right) R^e_{t+1,j}\, g(I_t, I_{t,j}) \right] \right|^2
$$

### 🔣 4-단 기호 풀이 (Eq 3, ★ 본 논문 핵심 식)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\min_\omega$ | 최소화 (SDF) | "학생: 내 답안 (ω) 의 오답률 최소화" | 외부 optimization |
| $\max_g$ | 최대화 (adversary) | "출제자: 학생이 가장 못 푸는 문제 (g) 찾기" | 내부 optimization (게임 반대편) |
| $\frac{1}{N} \sum_j$ | N 자산 평균 | "N 명의 채점 평균" | $N \approx 10,000$ |
| $1 - \sum_i \omega R^e$ | SDF $M$ | "공정한 채점자" | $M_{t+1}$ 의 정의 (affine) |
| $\omega(I_t, I_{t,i})$ | SDF weight function | "자산 i 의 가중치 = f(경제 + 자산 특성)" | NN 으로 학습 |
| $R^e_{t+1,j}$ | 자산 j 의 다음 시점 수익 | "j 학생 다음 시험 점수" | $j$ 는 test asset 인덱스 (≠ $i$) |
| $g(I_t, I_{t,j})$ | test asset weight | "j 학생을 시험 문제로 만들 weight" | adversarial NN 으로 학습 |
| $|\cdot|^2$ | squared deviation | "오답 정도의 제곱" | L2 loss |

**🌱 한 줄 일상 비유**: "**학생 (SDF) 이 어떤 시험 문제 (g) 에서도 정답에 가깝게 풀게 학습** — 출제자 (adversary) 가 가장 어려운 문제 자동 출제 + 학생이 그것도 풀게 반복".

#### 구조 분해

| 부분 | 의미 |
|------|------|
| 외부 $\min_\omega$ | SDF (player 1) 가 pricing error 최소화 |
| 내부 $\max_g$ | Adversary (player 2) 가 가장 mispriced 한 test asset 선택 |
| $\sum_j$ | 모든 자산에 대한 평균 |
| $\| \cdot \|^2$ | squared pricing error |

#### 이게 왜 "GAN" 인가

**Generative Adversarial Network 의 구조**:
- Player 1 (generator) = ProTran 에서는 image generator.
- Player 2 (discriminator) = real/fake 판별기.
- 본 paper 에서는:
  - Player 1 = SDF network ($\omega$).
  - Player 2 = conditional network ($g$) — "fake" portfolio 가 mispriced 한지 판별.

→ **Asset pricing 의 GAN 정신적 응용**.

### Step 4 — 왜 Adversarial 인가 (Hansen-Jagannathan)

paper 인용:
> "Our adversarial estimation with a minimax objective function is economically motivated and based on the insights of Hansen and Jagannathan (1997). They show that if the SDF implied by an asset pricing model is only a proxy that does not price all possible assets in the economy, then minimizing the largest possible pricing error corresponds to estimating the SDF that is the closest to an admissible true SDF in a least square distance."

#### Hansen-Jagannathan 1997 의 정신

**Misspecification 에 robust 한 SDF 추정**:
- 진짜 SDF 는 unknown.
- 모델 SDF 는 approximation.
- → **가장 큰 pricing error 최소화** = least squared distance 의 SDF.

#### 본 paper 의 일반화

HJ 는 fixed test asset set 사용.
본 paper 는 **test asset 도 학습** — adversary 가 가장 mispriced 한 portfolio 자동 발견.

비유 (시험 출제):
- HJ = 정해진 시험 문제 (test asset) 에서 가장 잘 푸는 학생 (SDF) 찾기.
- 본 paper = **adversary 가 가장 어려운 문제 (mispriced asset) 도 만들면서**, 그 어려운 문제도 잘 푸는 학생 찾기.

→ 더 robust + comprehensive.

### Step 5 — Adversarial GMM 의 3가지 장점

paper p.11:

1. **Misspecification robust** (Hansen-Jagannathan 1997).
2. **Weak factor 문제 해결** — adversary 가 약한 factor 의 mispricing 을 큰 portfolio 로 증폭.
3. **Identification** — 모든 SDF parameter 의 식별 보장.

#### 장점 1 — Misspecification robust

진짜 SDF 가 NN 의 함수 family 에 없을 수 있음.
- HJ minimax → 가장 가까운 SDF 찾음 (least squares).
- → 모델이 진짜와 perfect 일치 못해도 best approximation.

#### 장점 2 — Weak factor 검출

Weak factor (작은 signal) 는 unconditional moment 로 검출 어려움.
- Adversary 가 weak factor 의 mispricing 을 잘 보이게 하는 test asset (예: long/short combination) 자동 생성.
- → SDF 가 weak factor 도 학습 강제.

#### 장점 3 — Identification

모든 conditional moment 사용 → SDF 의 unique 식별.
- 단일 unconditional moment 만으로는 식별 부족.
- 무한 family 의 moment 가 식별 보장.

### Step 6 — Specific 구현 (paper p.10)

paper:
> "In our benchmark model we consider N = 10,000 stocks and D = 8 instruments and therefore average in total over 80,000 instrumented assets."

| 항목 | 값 |
|------|-----|
| Stocks ($N$) | 10,000 |
| Instruments ($D$) | 8 |
| Total test assets | **80,000 instrumented assets** |

→ 매우 큰 GMM problem — 80,000 moment conditions.

### Step 7 — Adversary 의 구체적 작동 — Momentum 예시

paper p.10 의 explicit illustration:
> "Assume that the asset pricing modeler uses the Fama-French 5 factor model, that is M is spanned by those five factors. The adversary might propose momentum sorted test assets, that is g is a vector of indicator functions for different quantiles of past returns. As these test assets have significant pricing errors with respect to the Fama-French 5 factors, the asset pricing modeler needs to revise her candidate SDF, for example, by adding a momentum factor to M. Next, the adversary searches for other mispriced anomalies or states of the economy, which the asset pricing modeler will exploit in her SDF model."

#### 시각화

```
   초기 candidate SDF (예: FF5):
        M_FF5 = market + size + value + profit + invest
                              │
                              ▼
   Adversary 가 momentum portfolio (test asset) 생성:
        g = indicator(momentum quintile)
                              │
                              ▼
   FF5 의 pricing error on momentum portfolio: 큼!
                              │
                              ▼
   SDF revise: M' = FF5 + momentum factor
                              │
                              ▼
   Adversary 가 더 mispriced anomaly 찾음 (예: short-term reversal):
        g' = indicator(ST_REV quantile)
                              │
                              ▼
   SDF revise again...
```

→ **반복**: 자동화된 anomaly discovery + SDF refinement.

### Step 8 — Nagel-Singleton (2011) 와의 결정적 차이

paper p.10-11:
> "Nagel and Singleton (2011) use this argument to build optimal managed portfolios for a particular asset pricing model. Their approach assumes that the set of candidate test assets identify all the parameters of the SDF and they can therefore focus on which test asset provide the most efficient estimator. Our problem is different in two ways that rule out using the same approach. First, we have an infinite number of candidate moments without the knowledge of which moments identify the parameters. Second, our parameter set is also of infinite dimension."

#### 비교 표

| 측면 | Nagel-Singleton (2011) | 본 paper |
|------|----------------------|---------|
| **Parameter** | Finite dimensional | Infinite dimensional (NN weights) |
| **Moment conditions** | Finite | Infinite ($g$ any function) |
| **Goal** | Optimal efficient estimator | Robust SDF |
| **Asymptotic distribution** | Normal (CLT) | N/A (infinite-dim) |
| **Approach** | Most efficient moment selection | Worst-case (minimax) |

→ NS = "이미 알고 있는 moment 중 가장 효율적인 것 선택". 본 paper = "**무한 moment 중 가장 robust 한 것 발견**".

### Step 9 — β 의 second-moment 표현 (paper p.11)

paper:
> "Once we have obtained the SDF factor weights, the loadings are proportional to the conditional moments $\mathbb{E}_t[F_{t+1} R^e_{t+1,i}]$. A key element of our approach is to avoid estimating directly conditional means of stock returns. Our empirical results show that we can better estimate the conditional co-movement of stock returns with the SDF factors, which is a second moment, than the conditional first moment. Note, that in the no-arbitrage one-factor model, the loadings are proportional to $\text{Cov}_t(R^e_{t+1,i}, F_{t+1})$ and $\mathbb{E}_t[F_{t+1} R^e_{t+1,i}]$, where the last one has the advantage that we avoid estimating the first conditional moment."

#### 핵심 design choice

| 추정 대상 | 방식 | 본 paper 의 선택 |
|---------|------|----------------|
| Conditional mean $\mu = E[R^e]$ | FFN forecasting | ✗ (low SNR) |
| Conditional covariance $\text{Cov}(R^e, F) = E[F R^e] - E[F]E[R^e]$ | 2 moments | ✗ (mean 추정 포함) |
| Conditional second moment $E[F R^e]$ | 1 moment | **✓** (paper 의 선택) |

#### 왜 second moment 가 좋은가

**Signal-to-noise ratio 비교**:
- $E[R^e]$ (mean): noise-dominated, 추정 어려움.
- $E[F R^e]$ (second moment): $F$ 가 portfolio 라 noise 가 cancel out → SNR 좋음.

→ **β 를 mean 으로 추정하지 않고 second moment 로 직접 추정** — paper 의 결정적 차이.

vs FFN benchmark:
- FFN: $\beta_{FFN} = \mu_{FFN}$ (proportional to mean).
- GAN: $\beta_{GAN}$ = 별도 FFN 으로 $E[F R^e]$ 추정.
- → GAN 의 β 가 더 정확.

---

## 4.4 Section I.C — Alternative Models (Benchmarks)

본 paper 가 비교하는 4 모델:

### Model 1 — FFN (Forecasting Approach)

paper p.12:
$$
\mu_{t,i} := \mathbb{E}_t[R^e_{t+1,i}] = \beta_{t,i}\, \mathbb{E}_t[F_{t+1}]
$$

#### 특징

- **Conditional mean 직접 추정** — SDF 우회.
- No-arbitrage 미사용 — variance 설명 중심.
- Gu, Kelly, Xiu (2020) 의 best FFN model 채택.

#### 약점

- Mean 은 **low signal-to-noise ratio** (asset return 의 95%+ 가 noise).
- Direct mean prediction → noise 학습 위험.
- → No-arbitrage 의 discipline 없음.

### Model 2 — LS (Linear Special Case)

paper p.12:
- $\omega_{t,i} = \theta^\top I_{t,i}$ (선형 SDF weights).
- Conditioning $g$ 도 선형: $g_{t,j} = I_{t,j}$.

이 경우 Eq (3) 의 해:
$$
\theta = \mathbb{E}[\tilde F_{t+1} \tilde F^\top_{t+1}]^{-1} \mathbb{E}[\tilde F_{t+1}]
$$

where $\tilde F_{t+1} = \frac{1}{N}\sum_i I_{t,i} R^e_{t+1,i}$ — **characteristic managed factors**.

#### 의미

**Mean-variance optimization on characteristic factors**.
- $\tilde F$ = 각 char 의 weighted return — "char $j$ portfolio" 의 return.
- $\theta$ = 이 char portfolios 의 mean-variance 결합.
- → 고전적 factor model 의 기계화.

### Model 3 — EN (Linear with Elastic Net)

paper p.20-21:
$$
\hat\theta_{EN} = \arg\min_\theta \frac{1}{T}\sum_t \left( \tilde F_{t+1} - \frac{1}{T}\sum_t \tilde F_{t+1} \tilde F^\top_{t+1} \theta \right)^2 + \lambda_2 \|\theta\|_2^2 + \lambda_1 \|\theta\|_1
$$

#### 의미

- LS + **Elastic Net regularization** ($L^1 + L^2$).
- $L^1$: sparsity (일부 char 만 선택).
- $L^2$: shrinkage (overfit 방지).

#### vs Kozak-Nagel-Santosh (2020)

paper footnote 22: **"Shrinking the Cross Section"** 의 변형. 5가지 차이점:
1. 다른 prior on $\theta$.
2. Cross-validation 방식 다름.
3. Eq (3) 의 minimax 활용.
4. Macro inclusion 차이.
5. Time period.

### Model 4 — GAN (본 paper)

3 networks + adversarial:
- SDF network: $\omega(I_t, I_{t,i})$ — non-linear NN.
- LSTM: macro 178 → 4 hidden states.
- Conditional network: $g(I_t, I_{t,i})$ — adversarial test asset.

→ 모든 4 components 갖춤.

---

## 4.5 모델 비교 정리 — 4 dimensions

| 모델 | 함수형 | No-arbitrage | Macro 처리 | Adversarial |
|------|--------|--------------|-----------|------------|
| **LS** | 선형 | ✓ (Eq 2 의 특수 case) | 단순 차분 | ✗ |
| **EN** | 선형 + EN regularization | ✓ | 단순 차분 | ✗ |
| **FFN** | 비선형 NN | ✗ (mean 추정) | 단순 차분 | ✗ |
| **GAN** (본 paper) | 비선형 NN | ✓ | **LSTM hidden states** | ✓ |

→ **GAN 만 4 dimensions 모두**.

각 dimension 의 효과 (Table I 의 Test):
- Linear → Non-linear: FFN (0.44) vs LS (0.42) — 미세 효과.
- No-no-arb → No-arb: EN (0.50) vs FFN (0.44) — **+14%** 효과.
- 단순 차분 → LSTM hidden: GAN vs GAN-no-macro — **+10%**.
- Non-adv → Adv: GAN vs UNC — **+20%**.

→ 4 효과의 곱 = GAN 의 최종 SR 0.75.

---

## 4.6 자기점검 (이 챕터)

### 핵심 5가지
1. **SDF $M = 1 - \omega^\top R^e$ 정규화의 의미는?**
2. **Eq (1) 의 $\omega$ = mean-variance efficient portfolio 임이 뭘 의미하는가?**
3. **Eq (2) 가 Eq (1) 의 무한 generalization 인 이유는?**
4. **Minimax 에서 SDF 와 adversary 의 게임이 zero-sum 인 이유는?**
5. **GAN 의 4 design dimension 의 효과를 분해하면?**

### 답변
1. SDF 가 자산 수익률의 **affine 함수** (상수 1 + 선형결합). $\omega$ 가 tangency portfolio weights 와 동일 (Eq 1). Cochrane (2003) 의 표준 normalization — risk-free rate 의 자유도 처리. Without loss of generality.
2. **SDF 추정 = tangency portfolio 추정** — 두 문제가 mathematically 동일. Markowitz mean-variance optimization 의 해가 SDF weights. 따라서 SDF network 가 학습하는 것 = 최적 portfolio weights.
3. Eq (1) 은 unconditional moment ($g = $ 상수) 의 특수 케이스. 일반 conditional moment 는 임의 함수 $g$ 에 대해 $E[M R^e g] = 0$. 무한 family — $g$ 의 선택에 따라 무한히 많은 moment 조건. Paper 가 이 자유도를 **adversarial 로 활용** — 가장 informative 한 $g$ 자동 선택.
4. SDF 는 pricing error 최소화, adversary 는 최대화 — 한쪽이 이기면 다른 쪽이 짐 (정확히 반대). Hansen-Jagannathan (1997) 의 minimax: 가장 mispriced 한 portfolio 까지 잘 가격결정해야 robust SDF. GAN 정신과 동일.
5. (a) Linear → Non-linear: +5% (FFN vs LS). (b) No-no-arb → No-arb: +14% (EN vs FFN). (c) 단순 차분 → LSTM: +10% (GAN vs GAN-no-macro). (d) Non-adv → Adversarial: +20% (GAN vs UNC). 모든 효과의 누적 = GAN 의 SR 0.75. **Adversarial + LSTM 이 가장 큰 contribution**.

---

다음 [05_method_a_loss.md](05_method_a_loss.md) 에서 Loss function 과 모델 아키텍처 (Eq 4).
