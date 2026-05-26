# 03. Section 2 (Factor Model) — 요인 모델이란 무엇인가

> **🧒 한 줄 요약**: Factor model framework. K latent factors + idiosyncratic noise.


논문 3쪽 후반부 ~ 5쪽 초반부의 Section 2 전체를 풀어본다.

---

## 3.1 모델의 시작 — 한 자산 한 시점

> **원문**: "We assume that excess returns follow a standard approximate factor model and the assumptions of the arbitrage pricing theory are satisfied."

**풀어 설명**:
- "excess returns" = 초과수익 = 자산 수익률 - 무위험 수익률
- "approximate factor model" = 근사 요인 모델 (잔차에 약간의 상관 허용)
- "APT의 가정 만족" = 분산투자 가능한 환경

### 핵심 가정 한 줄
> "This means that returns have a systematic component captured by K factors and a nonsystematic, idiosyncratic component capturing asset-specific risk."

**풀어 설명**: 자산 수익률 = **공통 부분 (요인 K개)** + **개별 부분 (자산별 잡음)**

---

## 3.2 핵심 방정식 — 패널 데이터 식 (Equation, page 3)

자산 $i$, 시점 $t$의 초과 수익률은:

$$
\boxed{\;
X_{t,i} = F_t \Lambda_i^\top + e_{t,i}, \quad i = 1, \ldots, N,\; t = 1, \ldots, T.
\;}
$$

각 기호의 뜻:

| 기호 | 의미 | 크기 | 비유 |
|------|------|------|------|
| $X_{t,i}$ | 자산 $i$의 시점 $t$ 초과수익 | 스칼라 | "엑셀 시트 한 칸의 값" |
| $F_t$ | 시점 $t$의 요인 값들 | $1 \times K$ 행벡터 | "그 시점 K개 요인의 현재 상태" |
| $\Lambda_i$ | 자산 $i$의 요인 노출도 | $1 \times K$ 행벡터 | "이 자산이 K개 요인에 얼마나 민감한가" |
| $e_{t,i}$ | 자산 $i$의 시점 $t$ 잡음 | 스칼라 | "그 칸에 남은 설명 안 되는 부분" |
| $N$ | 자산 개수 | 정수 | "엑셀의 열 개수" |
| $T$ | 시간 길이 | 정수 | "엑셀의 행 개수" |
| $K$ | 요인 개수 | 정수 | "숨은 요인의 수" |

### 식의 직관적 해석

**예시 (K=2 요인 모델)**:
- 요인 1 = "시장 수익"
- 요인 2 = "성장 vs 가치"
- 어떤 시점 $t$ 에 시장이 1% 오르고, 성장주가 0.5% 강세였다면 $F_t = (1\%, 0.5\%)$.
- 자산 $i$ (예: 애플)의 노출도가 $\Lambda_i = (1.2, 0.3)$ 이면 (시장에 1.2배 민감, 성장에 약간 민감).
- 공통 부분 기여 = $1\% \times 1.2 + 0.5\% \times 0.3 = 1.35\%$
- 여기에 애플 고유 사건의 잡음 $e_{t,i}$ 가 더해짐.

---

## 3.3 행렬 표기 — 한꺼번에 다 적기

위 식을 모든 $i, t$에 대해 모아서 행렬로 쓰면:

$$
\boxed{\;
\underset{T \times N}{X} = \underset{T \times K}{F} \cdot \underset{K \times N}{\Lambda^\top} + \underset{T \times N}{e}
\;}
$$

크기 확인:
- $X$: $T$행 $N$열 — 모든 자산의 모든 시점 수익률
- $F$: $T$행 $K$열 — 시간에 따른 K개 요인의 변화
- $\Lambda^\top$: $K$행 $N$열 — 각 자산의 K개 요인 노출도
- $e$: $T$행 $N$열 — 잔차

곱셈 크기 점검: $(T \times K) \times (K \times N) = T \times N$ ✓

---

## 3.4 목표 명시

> **원문**: "Our goal is to estimate the unknown latent factors $F$ and the loadings $\Lambda$. We will work in a large dimensional panel, i.e. the number of cross-sectional observations $N$ and the number of time-series observations $T$ are both large and we use the asymptotics for them jointly going to infinity."

**풀어 설명**:
- **목표**: 알려지지 않은 $F$와 $\Lambda$를 추정.
- **세팅**: $N$과 $T$ 둘 다 큰 패널. 점근은 둘 다 무한대로 보냄.

**왜 "둘 다 무한대"가 중요한가?**
- 전통적 통계: 자산은 적고($N$ 고정), 시간만 길다 ($T \to \infty$)
- 현대 빅데이터: 자산도 많고 ($N \to \infty$), 시간도 길다 — 점근이 다르게 행동

---

## 3.5 잔차와 요인의 독립성 가정

> **원문**: "Assume that the factors and residuals are uncorrelated. This implies that the covariance matrix of the returns consists of a systematic and idiosyncratic part:"

$$
\boxed{\;
\text{Var}(X) = \Lambda \, \text{Var}(F) \, \Lambda^\top + \text{Var}(e)
\;}
$$

**풀어 설명**:
- 요인과 잔차가 상관 없다고 가정.
- 결과: 수익률의 공분산 = (요인 부분) + (잔차 부분)

### 식 풀이
- $\Lambda \text{Var}(F) \Lambda^\top$ = 요인 때문에 생기는 공분산 부분 (**체계적**)
- $\text{Var}(e)$ = 잔차의 공분산 부분 (**개별적**)

**비유**: 학생들 점수의 변동을 보면:
- 공통 시험 난이도 때문에 모두가 떨리는 부분 (체계적) + 학생 개인의 컨디션 (개별적)

---

## 3.6 PCA의 동기

> **원문**: "Under standard assumptions the largest eigenvalues of $\text{Var}(X)$ are driven by the factors. This motivates Principal Component Analysis (PCA) as an estimator for the loadings and factors."

**풀어 설명**:
- 표준 가정 하에서 $\text{Var}(X)$ 의 큰 고유값들은 **요인이 만든 것**.
- 그래서 PCA로 큰 고유값에 해당하는 고유벡터를 뽑으면 그게 곧 요인이다.

**왜 그런가?**:
- $\Lambda \text{Var}(F) \Lambda^\top$ 은 rank $K$ 행렬 → 큰 $K$개 고유값을 만든다.
- $\text{Var}(e)$ 는 대부분 작은 고유값들로 구성 (잡음).
- 그래서 상위 $K$개 고유값/고유벡터 = 요인.

> **원문**: "Essentially all estimators for latent factors only utilize the information contained in the second moment, but ignore information that is contained in the first moment."

**풀어 설명**:
- **기존 모든 추정량**: 2차 모멘트(공분산)만 사용, 1차 모멘트(평균)는 무시.
- 이게 이 논문이 고치고자 하는 점.

---

## 3.7 APT의 함의 — 평균에 대한 식

> **원문**: "Arbitrage-Pricing Theory (APT) has a second implication: The expected excess return is explained by the exposure to the risk factors multiplied by the risk-premium of the factors. If the factors are excess returns APT implies"

$$
\boxed{\;
E[X_i] = \Lambda_i E[F]
\;}
$$

**풀어 설명**:
- 자산 $i$의 기대수익 = $i$의 요인 노출도 × 요인의 기대값.
- "위험 프리미엄" = $E[F]$ (요인이 평균적으로 주는 보상)

**비유**: 영어 학원에 노출되면 평균적으로 영어점수가 오른다. 노출도 (몇 시간 다녔나) × 학원 효과 (한 시간당 점수 향상) = 영어점수 향상.

> **원문**: "Here we assume a strong form of APT, where residual risk has a risk-premium of zero. In its more general form APT requires only the risk-premium of the idiosyncratic part of well-diversified portfolios to go to zero. As most of our analysis will be based on portfolios, there is no loss of generality by assuming the strong form."

**풀어 설명**:
- **강한 형태의 APT** = 잔차 위험에 위험프리미엄 0 (= 잔차로는 못 번다)
- 일반 APT는 약하게: "잘 분산된 포트폴리오의 잔차 위험프리미엄 → 0"만 요구.
- 포트폴리오 기반 분석이라 강한 형태 써도 OK.

---

## 3.8 표준 PCA의 목적함수

> **원문**: "Factors constructed by PCA explain as much common time-series variation as possible. Conventional statistical factor analysis applies PCA to the sample covariance matrix $\frac{1}{T}X^\top X - \bar X \bar X^\top$ where $\bar X$ denotes the sample mean of excess returns."

**풀어 설명**:
- PCA는 공통 시계열 변동을 최대한 설명하는 요인을 찾음.
- 표본 공분산 행렬에 PCA 적용.
- $\frac{1}{T}X^\top X - \bar X \bar X^\top$ = 표본 공분산 (평균 빼고 제곱)

> "The eigenvectors of the largest eigenvalues are proportional to the loadings $\hat\Lambda^{\text{PCA}}$. Factors are obtained from a regression on the estimated loadings."

**풀어 설명**:
- 큰 고유값들의 고유벡터 = 추정 로딩 (까지의 비례)
- 요인은 추정 로딩에 회귀해서 얻음.

### PCA의 목적함수 (식 표기)

> **원문**: "It can be shown that conventional PCA factor estimates are based on the time-series variation objective function:"

$$
\boxed{\;
\min_{\Lambda, F} \frac{1}{NT} \sum_{i=1}^N \sum_{t=1}^T (X_{ti} - F_t \Lambda_i^\top)^2
\;}
$$

**풀어 설명**:
- PCA는 **잔차 제곱합을 최소화**하는 $F, \Lambda$를 찾는다.
- 즉 "$X$ 패널을 $F\Lambda^\top$ 형태로 가장 잘 근사하기".

**비유**: 시험점수 패턴을 학생별 노력×요인 노출로 가장 잘 설명하는 게 목표. PCA는 "패턴 자체를 가장 잘 맞춤"에 초점.

### 각주 5
> "The variation objective function assumes that the data has been demeaned."
- 평균을 미리 빼고 계산한다는 가정.

---

## 3.9 RP-PCA의 등장 — 새 추정량

> **원문**: "We call our approach Risk-Premium-PCA (RP-PCA). It applies PCA to a covariance matrix with overweighted mean"

$$
\boxed{\;
\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top
\;}
$$

**풀어 설명**:
- $\frac{1}{T}X^\top X$ = 2차 모멘트 (분산 + 평균 제곱)
- $\bar X \bar X^\top$ = 평균의 외적 (mean × mean)
- $\gamma$ = 가중치 (튜닝 파라미터)
- 이 합쳐진 행렬에 PCA 적용.

**비교**:
- 표준 PCA: $\frac{1}{T}X^\top X - \bar X \bar X^\top$ (평균을 뺀다 = $\gamma = -1$)
- RP-PCA: $\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ (평균에 +$\gamma$ 가중치)

→ **$\gamma = -1$ 이면 RP-PCA = 표준 PCA**. 그러니까 RP-PCA는 PCA의 **일반화**.

> "The eigenvectors of the largest eigenvalues are proportional to the loadings $\hat\Lambda^{\text{RP-PCA}}$."

**풀어 설명**: 이 변형된 행렬의 큰 고유벡터 = RP-PCA 로딩.

---

## 3.10 RP-PCA의 목적함수

> **원문**: "We show that RP-PCA minimizes jointly the unexplained variation and pricing error:"

$$
\boxed{\;
\min_{\Lambda, F} \;\;
\underbrace{\frac{1}{NT}\sum_{i=1}^N \sum_{t=1}^T (X_{ti} - F_t \Lambda_i^\top)^2}_{\text{unexplained variation}}
\;+\; \gamma \cdot \underbrace{\frac{1}{N}\sum_{i=1}^N (\bar X_i - \bar F \Lambda_i^\top)^2}_{\text{pricing error}}
\;}
$$

**풀어 설명**:
- **첫 항** = 표준 PCA 목적함수 (시계열 패턴 못 맞춘 정도)
- **둘째 항** = 가격결정오차 (자산별 평균을 못 맞춘 정도)
- $\gamma$ = 둘 사이의 트레이드오프 가중치

**여기서 $\bar F = \frac{1}{T}\sum_t F_t$** = 추정된 요인의 평균.

> "Factors are estimated by a regression of the returns on the estimated loadings, i.e. $\hat F = X\hat\Lambda (\hat\Lambda^\top \hat\Lambda)^{-1}$."

**풀어 설명**: 로딩을 추정한 후, 요인은 $X$를 추정 로딩에 회귀해서 얻음.

---

## 3.11 두 가지 요인 모델 해석

> **원문**: "We develop the statistical theory that provides guidance on the optimal choice of the key parameter $\gamma$. There are essentially two different factor model interpretations: a strong factor model and a weak factor model."

이 두 모델은 다음 섹션들의 핵심 분류:

### 강한 요인 모델 (Strong Factor Model)
> "In a strong factor model the factors provide a strong signal and lead to exploding eigenvalues in the covariance matrix. This is either because the strong factors affect a very large number of assets and/or because they have very large variances themselves."

**풀어 설명**:
- 요인 신호가 강해서 공분산 행렬의 큰 고유값들이 **무한대로 폭발** ($O(N)$).
- 이유: (a) 거의 모든 자산에 영향 또는 (b) 요인 분산 자체가 큼.
- 예: 시장 요인.

### 약한 요인 모델 (Weak Factor Model)
> "In a weak factor model the factors' signals are weak and the resulting eigenvalues are large compared to the idiosyncratic spectrum, but they do not explode."

**풀어 설명**:
- 요인 신호가 약해서 고유값이 잡음 스펙트럼보다는 크지만 **폭발하지는 않음** ($O(1)$).
- 분리되어 있지만 크기는 유한.

### 두 경우 모두 $\gamma$의 의미
> "In both cases it is always optimal to choose $\gamma \neq -1$, i.e. it is better to use our estimator instead of PCA applied to the covariance matrix."

**풀어 설명**: 두 경우 모두 **$\gamma = -1$ (PCA)는 비최적**. RP-PCA가 더 좋다.

---

## 3.12 강한/약한 모델에서 $\gamma$의 역할

> **원문**: "In a strong factor model, the estimates become more efficient. In a weak factor model it strengthens the signal of the weak factors, which could otherwise not be detected."

**풀어 설명**:
- **강한 요인**: $\gamma$가 0이 아니면 추정 효율(=분산 작음)이 좋아짐.
- **약한 요인**: $\gamma$가 크면 약한 요인의 신호를 끌어올려서 검출 가능하게 만듦.

> "Depending on which framework is more appropriate, the optimal choice of $\gamma$ varies. A weak factor model usually suggests much larger choices for the optimal $\gamma$ than a strong factor model."

**풀어 설명**:
- 어느 프레임워크에 맞느냐에 따라 최적 $\gamma$ 다름.
- 약한 요인 → 큰 $\gamma$, 강한 요인 → 작은 $\gamma$.

> "However, in strong factor models our estimator is consistent for any choice of $\gamma$ and choosing a too large $\gamma$ results in only minor efficiency losses. On the other hand a too small $\gamma$ can prevent weak factors from being detected at all. Thus in our empirical analysis we opt for the choice of larger $\gamma$'s."

**풀어 설명**:
- **안전 장치**: 강한 모델에선 $\gamma$를 너무 크게 잡아도 손해 작음.
- 반대로 $\gamma$가 너무 작으면 약한 요인 검출 실패.
- → **실증에서는 큰 $\gamma$ (= 10) 사용**.

### 각주 6 — 약한 요인 모델의 의미
> "Arbitrage-Pricing Theory developed by Chamberlain and Rothschild (1983) assumes that only strong factors are non-diversifiable and explain the cross-section of expected returns. As pointed out by Onatski (2012), a weak factors can be regarded as a finite sample approximation for strong factors, i.e. the eigenvalues of factors that are theoretically strong grow so slowly with the sample size that the weak factor model provides a more appropriate description of the data."

**풀어 설명**:
- APT 원조 이론은 강한 요인만 가격결정한다고 가정.
- 하지만 Onatski (2012): **현실 데이터에선 "이론상 강한" 요인이라도 천천히 자라서, 유한 표본에서는 약한 요인 모델이 더 적합한 묘사**.
- → 실증 분석에는 weak factor model 프레임워크가 맞다는 정당화.

---

## 3.13 실증 스펙트럼의 모습

> **원문**: "The empirical spectrum of eigenvalues in equity data suggests a combination of strong and weak factors."

**풀어 설명**: 실제 주식 데이터의 고유값을 보면 강한 + 약한 요인의 혼합.

> "In all the equity data that we have tested the first eigenvalue of the sample covariance matrix is very large, typically around ten times the size of the rest of the spectrum. The second and third eigenvalues usually stand out, but have only magnitudes around twice or three times of the average of the residual spectrum, which would be more in line with a weak factor interpretation."

**풀어 설명**: 패턴은 일관:
- **1번째 고유값**: 나머지의 ~10배 → 시장 요인 (매우 강함)
- **2~3번째 고유값**: 나머지의 ~2-3배 → 약한 요인에 가까움

> "The first statistical factor in our data sets is always very strongly correlated with an equally-weighted market factor. Hence, if we are interested in learning more about factors besides the market, the weak factor model might provide better guidance."

**풀어 설명**:
- 1번째 통계적 요인 ≈ 동일가중 시장 요인.
- 시장 외 요인에 관심 있다면 약한 요인 모델이 더 적절.

---

## 3.14 Section 2 핵심 요약

| 항목 | 내용 |
|------|------|
| 모델 | $X_{t,i} = F_t \Lambda_i^\top + e_{t,i}$ |
| 행렬 | $X = F\Lambda^\top + e$, $X$ is $T \times N$ |
| 표본 크기 | $N, T \to \infty$ (둘 다 큼) |
| APT 함의 | $\text{Var}(X) = \Lambda \text{Var}(F) \Lambda^\top + \text{Var}(e)$, $E[X_i] = \Lambda_i E[F]$ |
| PCA 행렬 | $\frac{1}{T}X^\top X - \bar X \bar X^\top$ ($\gamma=-1$) |
| RP-PCA 행렬 | $\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ ($\gamma > -1$) |
| 두 시나리오 | Strong factor / Weak factor |

다음 파일(**04_RP-PCA_정의_Section3_전반.md**)에서는 **Section 3의 목적함수**를 더 자세히, 공식적으로 다룬다.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **요인 모델 $X = F\Lambda^\top + e$ 에서 각 행렬의 차원은?**
2. **APT의 두 함의를 수식으로 적으면?**
3. **Strong factor와 Weak factor의 정의 차이는?**

### 답변
1. $X$: $T \times N$, $F$: $T \times K$, $\Lambda$: $N \times K$, $e$: $T \times N$.
2. (a) $\text{Var}(X) = \Lambda \text{Var}(F)\Lambda^\top + \text{Var}(e)$, (b) $E[X_i] = \Lambda_i E[F]$.
3. Strong: $\Lambda^\top\Lambda/N \to \Sigma_\Lambda$ (PD), 고유값 폭발 / Weak: $\Lambda^\top\Lambda$ bounded, 고유값 분리되지만 안 폭발.
