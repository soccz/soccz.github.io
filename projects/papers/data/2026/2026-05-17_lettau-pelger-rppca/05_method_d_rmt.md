# 07. Section 5 전반 — 약한 요인 모델: 랜덤 행렬 이론 기초

> **🧒 한 줄 요약**: Random matrix theory. Spike eigenvalues, threshold.


논문 11쪽 ~ 14쪽 초반 (Section 5 도입부 + Subsection 5.1, 5.2 전반)을 풀어본다.

이 파트는 **수학적으로 가장 어렵다**. 천천히 풀어가자.

---

## 7.1 도입 — 왜 새 이론이 필요한가

> **원문**: "If factors are weak rather than strong RP-PCA can detect factors that are not estimated by conventional PCA. Weak factors affect only a smaller fraction of the assets. After normalizing the loadings, a weak factor can be interpreted as having a small variance. If the variance of a weak factor is below a critical value, it cannot be detected by PCA."

### 풀어 설명

**핵심 메시지**:
- 약한 요인은 일부 자산에만 영향 = 분산이 작음.
- 분산이 **임계값 이하**면 PCA로 검출 불가.
- RP-PCA는 평균 정보를 활용해 검출 가능.

### 약한 요인의 두 가지 해석
**해석 A**: 일부 자산에만 영향 ($\Lambda$가 sparse).
**해석 B**: 정규화 후 보면 분산이 작음.
→ 둘은 동치 (수학적 변환으로).

> "However, the signal of RP-PCA depends on the mean and the variance of the factors. Thus, RP-PCA can detect weak factors with a high Sharpe-ratio even if their variance is below the critical detection value."

**핵심**: RP-PCA의 신호 = 분산 + 평균.
**∴ 분산 작아도 평균 크면 (= 샤프 비율 크면) 검출 가능**.

> "Weak factors can only be estimated with a bias but the bias will generally be smaller for RP-PCA than for PCA."

**풀어 설명**: 약한 요인은 **편향**된 추정 가능 (= 정확히 못 잡고 약간 어긋남). RP-PCA가 편향 더 작음.

---

## 7.2 강한 vs 약한 — 수학적 차이

> **원문**: "In a weak factor model $\Lambda^\top \Lambda$ is bounded in contrast to a strong factor model in which $\frac{1}{N}\Lambda^\top \Lambda$ is bounded."

### 정의 비교

| 구분 | 정의 | 직관 |
|------|------|------|
| **Strong** | $\Lambda^\top\Lambda / N \to \Sigma_\Lambda$ (full rank) | 로딩이 $N$ 자산에 골고루 분포 |
| **Weak** | $\Lambda^\top\Lambda \to I_K$ (bounded) | 로딩이 매우 분산됨 ($1/\sqrt N$ 스케일) |

**비유**:
- Strong: 모든 학생이 영향 받는 시험 난이도 (요인)
- Weak: 특정 과목 선택자만 영향 받는 그 과목의 출제 경향

### 정규화의 차이
- **Strong**: 로딩이 자산 수 $N$ 으로 정규화 ($\Lambda_i$가 $O(1)$)
- **Weak**: 로딩이 정규화 없음 ($\Lambda_i$가 $O(1/\sqrt N)$)

---

## 7.3 Spiked Covariance Model — RMT의 핵심 모델

> **원문**: "The statistical model for analyzing weak factor models is based on spiked covariance models from random matrix theory. It is well-known that under the assumptions of random matrix theory the eigenvalues of a sample covariance matrix separate into two areas: (1) the bulk spectrum with the majority of the eigenvalues that are clustered together and (2) some spiked large eigenvalues separated from the bulk."

### 풀어 설명

**Spiked covariance model**: 큰 잡음 행렬 + 약간의 "튀어나온 신호".

**고유값 분포가 두 영역**으로 나뉨:
1. **Bulk**: 다수의 고유값이 모여 있는 군집 (잡음)
2. **Spike**: 군집에서 분리되어 튀어나온 몇 개의 큰 고유값 (신호)

**비유**: 잔잔한 호수 표면 위에 솟은 봉우리.
- 호수 = bulk (잡음의 군집)
- 봉우리 = spike (요인 신호)

### Marchenko-Pastur 분포
> "Under appropriate assumptions the bulk spectrum converges to the generalized Marchenko-Pastur distribution."

**Marchenko-Pastur (MP) 분포**: $N, T$ 둘 다 큰 잡음 행렬의 고유값 분포의 극한.

**i.i.d. 정규 잡음 예시**:
- $N/T = c < 1$ 면 지지가 $[a, b] = [\sigma_e^2(1-\sqrt c)^2, \sigma_e^2(1+\sqrt c)^2]$
- 봉우리 모양의 밀도 함수.

**비유**: 동전 1만 개 던지면 앞면 비율이 정확히 0.5 정도지만, 분포는 정해진 모양 (이항분포). MP 분포는 큰 행렬 고유값의 "정해진 모양".

### Stieltjes Transform — bulk 묘사 도구

> "The largest eigenvalues are estimated with a bias which is characterized by the Stieltjes transform of the generalized Marchenko-Pastur distribution."

**Stieltjes transform (Cauchy transform)**: 분포를 묘사하는 변환.

수학적 정의:
$$
G(z) = \int \frac{1}{z - \lambda} d\phi(\lambda)
$$
여기서 $\phi(\lambda)$ 는 고유값 분포 함수.

**왜 이걸 쓰나?**: 고유값들 합/평균을 직접 계산하기 어려우니, **변환된 형태로** 작업.

**비유**: 적분이 어려울 때 부분적분, 치환적분 같은 변환 쓰는 것과 비슷.

### Phase Transition — 검출 임계값
> "If the largest population eigenvalues are below some critical threshold, a phase transition phenomena occurs. The estimated eigenvalues will vanish in the bulk spectrum and the corresponding estimated eigenvectors will be orthogonal to the population eigenvectors."

### 풀어 설명

**상전이 (Phase transition)**:
- 신호 $\theta$ > 임계값 → 검출 가능 (spike가 bulk 위로 떠 있음)
- 신호 $\theta$ < 임계값 → **검출 불가능** (spike가 bulk에 빨려들어감)

**두 가지 결과 동시 발생** (검출 실패 시):
1. 추정 고유값이 잡음 bulk로 빨려들어감 ($\hat\theta \to b$, bulk의 윗 끝값)
2. 추정 고유벡터가 **참 고유벡터와 직교** ← 신호와 정반대 방향!

### 직관적 비유

**물의 상전이 비유**: 
- 100°C 넘으면 액체 → 기체 (한순간에)
- 100°C 미만이면 영원히 액체

**약한 요인 검출**:
- 분산 신호 $\sigma_F^2$ > 임계값 → 평균적으로 잡음 위로 솟음 → 검출
- 분산 신호 $\sigma_F^2$ < 임계값 → 영원히 잡음에 묻혀 못 잡음

**핵심**: **데이터를 무한히 늘려도** 이 임계값은 사라지지 않음.

### 각주 11 — Onatski (2012)와의 차이
> "Onatski (2012) studies weak factor models and shows the phase transition phenomena for weak factors estimated with PCA. Our paper provides a solution to this factor detection problem. It is important to notice that essentially all models in random matrix theory work with processes with mean zero. However, RP-PCA crucially depends on using non-zero means of random variables. Hence, we need to develop new arguments to overcome this problem."

**풀어 설명**:
- Onatski (2012): 약한 요인 + PCA + 상전이.
- 본 논문: **이 문제의 해결책** = RP-PCA.
- 기술적 어려움: 기존 RMT는 "평균 0" 가정. 본 논문은 평균 ≠ 0 → 새 증명 필요.

---

## 7.4 추정량 (다시 정리)

> **원문**: "The estimator of the loadings $\hat\Lambda$ are the first $K$ eigenvectors of $\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$. Conventional PCA of the sample covariance matrix corresponds to $\gamma = -1$. The estimators of the factors are the regression of the returns on the loadings, i.e. $\hat F = X\hat\Lambda$."

### 풀어 설명

추정 절차는 강한 요인 모델과 본질적으로 같음:
1. $M = \frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ 계산
2. 상위 $K$ 고유벡터 = $\hat\Lambda$
3. $\hat F = X\hat\Lambda$ (요인은 회귀)

**약한 요인에서의 차이**: 점근 분석할 때 정규화가 달라짐.

---

## 7.5 가정 2 (Assumption 2) — Weak Factor Model

### 가정 2.A — Rate
> "$N/T \to c$ with $0 < c < \infty$."

**풀어 설명**: $N$ 과 $T$가 비례하면서 함께 무한대로. RMT의 표준 셋팅.

### 가정 2.B — 요인
> "The factors $F$ are uncorrelated among each other and are independent of $e$ and $\Lambda$ and have bounded first two moments.
> $\hat\mu_F := \frac{1}{T}\sum F_t \xrightarrow{p} \mu_F$ and $\hat\Sigma_F := \frac{1}{T} F_t F_t^\top \xrightarrow{p} \Sigma_F = \text{diag}(\sigma_{F_1}^2, \ldots, \sigma_{F_K}^2)$."

**풀어 설명**:
- 요인끼리 무상관.
- 잔차·로딩과 독립.
- 평균과 분산이 표본에서 잘 추정됨.

### 가정 2.C — 로딩
> "$\Lambda^\top\Lambda \xrightarrow{p} I_K$ and the column vectors of the loadings $\Lambda$ are orthogonally invariant (e.g. $\Lambda_{i,k} \sim N(0, 1/N)$) and independent of the factors and residuals."

**풀어 설명**:
- 로딩 행렬의 정규화: $\Lambda^\top\Lambda \to I_K$ (강한 요인의 $/N$ 빠진 형태).
- **Orthogonally invariant**: 로딩 벡터의 분포가 회전 불변.
- 구체적 예: $\Lambda_{i,k} \sim N(0, 1/N)$.

### "Orthogonally invariant"이 뭔가요?
$Q$ 직교행렬 ($Q^\top Q = I$) 에 대해 $\Lambda$ 와 $Q\Lambda$ 가 같은 분포.

**비유**: 정규분포 $N(0, \sigma^2 I)$ 는 회전해도 같은 분포 (구면 대칭). 이 가정도 비슷.

### 가정 2.D — 잔차
> "The empirical eigenvalue distribution function of $\Sigma$ converges almost surely weakly to a non-random spectral distribution function with compact support. The supremum of the support is $b$ and the largest eigenvalues of $\Sigma$ converge to $b$."

**풀어 설명**:
- 잔차 공분산 $\Sigma$ 의 고유값 분포가 컴팩트 지지로 수렴.
- 최대 고유값 → $b$ (지지의 윗 끝).

### Assumption 2 해설 (논문 본문)

> "Assumption 2.C can be interpreted as considering only well-diversified portfolios as factors. It essentially assumes that the portfolio weights of the factors are random with a variance of $1/N$."

**풀어 설명**: 가정 2.C = 요인을 "잘 분산된 포트폴리오"로 보는 것과 동치.

> "The orthogonally invariance assumption on the loading vectors is satisfied if for example $\Lambda_{i,k} \overset{i.i.d.}{\sim} N(0, 1/N)$. This is certainly a stylized assumption, but it allows us to derive closed-form solutions that are easily interpretable."

**풀어 설명**: 정형화된 가정이지만 **닫힌 형태 해**를 줘서 해석 가능.

> "Assumption 2.D is a standard assumption in random matrix theory. The assumption allows for non-trivial weak cross-sectional correlation in the residuals, but excludes serial-correlation."

**풀어 설명**:
- RMT 표준 가정.
- 횡단면 약한 상관은 허용.
- **시간상관은 배제** (강한 요인 모델보다 좀 더 엄격).

> "It implies clustering of the largest eigenvalues of the population covariance matrix of the residuals and rules out that a few linear combinations of idiosyncratic terms have an unusually large variation which could not be separated from the factors."

**풀어 설명**: 잔차의 고유값이 군집을 이뤄야 함. 잔차 중 몇 개가 너무 튀어서 요인과 구분 안 되는 상황 배제.

### 가정 강도 비교 (Strong vs Weak)
- Strong factor: 잔차의 시간·횡단면 종속 모두 허용 (ARMA 등).
- Weak factor: 시간상관 배제. 횡단면도 sparse·ARMA-like 만 허용.

**왜 더 엄격?**: RMT 분석을 가능하게 하기 위해.

---

## 7.6 RMT 도구들 — 본격적 수학

논문 Section 5.2 시작.

### 평균 잔차 고유값
> "We define the average idiosyncratic noise as $\sigma_e^2 := \text{trace}(\Sigma)/N$, which is the average of the eigenvalues of $\Sigma$. If the residuals are i.i.d. distributed $\sigma_e^2$ would simply be their variance."

**풀어 설명**:
- $\sigma_e^2$ = 잔차 공분산 $\Sigma$의 평균 고유값.
- i.i.d. 잔차면 단순히 잔차 분산.

### 정렬된 잔차 고유값
> "Our estimator will depend strongly on the dependency structure of the residual covariance matrix which can be captured by their eigenvalues. Denote by $\lambda_1 \ge \lambda_2 \ge \ldots \ge \lambda_N$ the ordered eigenvalues of $\frac{1}{T}e^\top e$."

**풀어 설명**: 잔차 행렬 $\frac{1}{T}e^\top e$ 의 고유값을 큰 순으로 정렬.

### Cauchy (Stieltjes) Transform

> "The Cauchy transform (also called Stieltjes transform) of the eigenvalues is the almost-sure limit:"

$$
\boxed{\;
G(z) = a.s. \lim_{T \to \infty} \frac{1}{N} \sum_{i=1}^N \frac{1}{z - \lambda_i}
= a.s. \lim_{T \to \infty} \frac{1}{N} \text{trace}\!\left( (z I_N - \tfrac{1}{T}e^\top e)^{-1} \right)
\;}
$$

### 풀이 — 한 줄씩

**왼쪽**: 잔차 고유값들에 대한 $\frac{1}{z-\lambda}$ 의 평균. 거의 확실하게 극한.

**오른쪽**: 같은 것의 행렬 표현. $(zI - A)^{-1}$ = resolvent. trace 평균.

**이 함수의 성질**:
- $z$ 가 잡음 지지 $[a, b]$ 밖에 있을 때 정의됨.
- $z \to \infty$ 면 $G(z) \to 0$.
- $z$ 가 지지 윗 끝 $b$ 에 가까워지면 $G(z) \to$ 어떤 유한값.

**왜 중요?**: 추정 고유값 위치 = $G^{-1}(1/\theta)$ 로 표현됨. 즉 **신호 $\theta$ 를 알면 추정 고유값 어디에 위치할지 예측 가능**.

### B 함수

> "A second important transformation of the residual eigenvalues is"

$$
\boxed{\;
B(z) = a.s. \lim_{T \to \infty} \frac{c}{N} \sum_{i=1}^N \frac{\lambda_i}{(z-\lambda_i)^2}
= a.s. \lim_{T \to \infty} c\, \text{trace}\!\left( ((zI_N - \tfrac{1}{T}e^\top e)^{-2})(\tfrac{1}{T}e^\top e) \right)
\;}
$$

### 풀이

**$B(z)$ 는 $G(z)$의 도함수와 관련**: 사실 $B(z) \propto G'(z)$.

**왜 정의?**: 추정-참 요인 상관계수 $\rho^2$ 계산에 사용됨. 곧 나옴.

---

## 7.7 신호 행렬 (Signal Matrix) — Section 5.2 핵심

> "The crucial tool for understanding RP-PCA is the concept of a 'signal matrix' $M$. The signal matrix essentially represents the largest true eigenvalues."

### 풀어 설명

**신호 행렬 $M$**: 진짜(모집단) 신호의 크기를 표현하는 행렬. 표본 고유값이 어디에 위치할지 예측하기 위함.

### PCA의 신호 행렬

> "For PCA estimation based on the sample covariance matrix the signal matrix $M_{\text{PCA}}$ equals:"

$$
\boxed{\;
M_{\text{PCA}} = \Sigma_F + c\sigma_e^2 I_K = \begin{pmatrix}\sigma_{F_1}^2 + c\sigma_e^2 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \sigma_{F_K}^2 + c\sigma_e^2\end{pmatrix}
\;}
$$

### 풀이

**$K \times K$ 대각행렬**:
- 대각: $\sigma_{F_i}^2 + c\sigma_e^2$ (각 요인의 분산 + 잡음 평균)
- $c = N/T$.

**의미**: PCA에서 $i$번째 요인의 신호 = $\sigma_{F_i}^2 + c\sigma_e^2$.

**왜 $c\sigma_e^2$ 가 더해지나?**: 잡음의 영향. 표본 공분산은 잡음 평균분산만큼 부풀려짐.

### RP-PCA의 신호 행렬

> "The 'signal matrix' for RP-PCA $M_{\text{RP-PCA}}$ is defined as"

$$
\boxed{\;
M_{\text{RP-PCA}} = \begin{pmatrix}\Sigma_F + c\sigma_e^2 & \Sigma_F^{1/2}\mu_F(1+\tilde\gamma) \\ \mu_F^\top \Sigma_F^{1/2}(1+\tilde\gamma) & (1+\gamma)(\mu_F^\top\mu_F + c\sigma_e^2)\end{pmatrix}
\;}
$$

### 풀이

**$(K+1) \times (K+1)$ 행렬** (PCA보다 1 차원 큼).
- 좌상 $K \times K$: $\Sigma_F + c\sigma_e^2 I_K$ (PCA와 같음)
- 우상 $K \times 1$: $\Sigma_F^{1/2}\mu_F(1+\tilde\gamma)$ (평균과 분산 결합)
- 좌하: 우상의 전치.
- 우하 스칼라: $(1+\gamma)(\mu_F^\top\mu_F + c\sigma_e^2)$.

### $\tilde\gamma$ 의 정의
> "We define $\tilde\gamma = \sqrt{\gamma+1}-1$ and note that $(1+\tilde\gamma)^2 = 1+\gamma$."

**풀어 설명**: 표기 편의를 위한 변환. $\tilde\gamma$ 와 $\gamma$ 는 일대일 대응.
- $\gamma = -1 \iff \tilde\gamma = -1$
- $\gamma = 0 \iff \tilde\gamma = 0$
- $\gamma = 3 \iff \tilde\gamma = 1$

### 신호 행렬의 의미

> "The RP-PCA 'signals' are the $K$ largest eigenvalues $\theta_1^{\text{RP-PCA}}, \ldots, \theta_K^{\text{RP-PCA}}$ of $M_{\text{RP-PCA}}$. Intuitively, the signal of the factors is driven by $\Sigma_F + (1+\gamma)\mu^\top$, which has the same eigenvalues as"

$$
\begin{pmatrix}\Sigma_F & \Sigma_F^{1/2}\mu_F(1+\tilde\gamma) \\ \mu_F^\top \Sigma_F^{1/2}(1+\tilde\gamma) & (1+\gamma)(\mu_F^\top\mu_F)\end{pmatrix}
$$

> "This is disturbed by the average noise which adds the matrix $\begin{pmatrix}c\sigma_e^2 & 0 \\ 0 & (1+\gamma)c\sigma_e^2\end{pmatrix}$. Note that the disturbance also depends on the parameter $\gamma$."

### 풀어 설명

**신호 부분**: $\Sigma_F + (1+\gamma)\mu_F\mu_F^\top$ 와 같은 고유값을 가지는 행렬.

**잡음 영향**: 위에 $c\sigma_e^2$ 가 더해짐.

### 핵심 관찰
> "We denote the corresponding orthonormal eigenvectors of $M_{\text{RP-PCA}}$ by $\tilde U$:"
$$
\tilde U^\top M_{\text{RP-PCA}} \tilde U = \begin{pmatrix}\theta_1^{\text{RP-PCA}} & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}^{\text{RP-PCA}}\end{pmatrix}
$$

> "Unlike the conventional case of the covariance matrix with uncorrelated factors we cannot link the eigenvalues of $M_{\text{RP-PCA}}$ with specific factors. The rotation $\tilde U$ tells us how much the first eigenvalue contributes to the first $K$ factors, etc."

### 풀이 — 매우 중요

**중요한 차이**:
- **PCA**: $M_{\text{PCA}}$ 가 대각 → $i$번째 고유값 = $i$번째 요인 (자동 매핑)
- **RP-PCA**: $M_{\text{RP-PCA}}$ 가 비대각 → 고유값과 요인의 매핑이 **선형결합** (회전 $\tilde U$ 필요)

**비유**: 표준 좌표축 (PCA) vs 회전된 좌표축 (RP-PCA).
- PCA: $x$축이 요인 1, $y$축이 요인 2, ... (깔끔)
- RP-PCA: 회전된 축들이 요인의 선형결합 (회전 풀어줘야 함)

### 왜 이렇게 복잡해지나?
**원인**: 평균 $\mu_F$ 가 신호 행렬에 들어가면서 비대각 항이 생김.
$\Sigma_F$ 는 대각 (요인 무상관 가정), 하지만 $\mu_F\mu_F^\top$ 는 비대각 → 둘 합치면 비대각.

---

## 7.8 Section 5 전반 핵심 정리

| 개념 | 정의/의미 |
|------|----------|
| Spiked covariance | 잡음 bulk + 신호 spike의 분리 |
| Bulk spectrum | 잡음 고유값 군집 (MP 분포) |
| Spike | 신호 고유값 (bulk 위로 솟음) |
| Stieltjes transform $G(z)$ | $\frac{1}{N}\sum \frac{1}{z-\lambda_i}$ — bulk 묘사 도구 |
| B 함수 | $\frac{c}{N}\sum \frac{\lambda_i}{(z-\lambda_i)^2}$ — $\rho^2$ 계산용 |
| Phase transition | 신호 > 임계 → 검출, 신호 < 임계 → 검출 불가 |
| Weak factor 정의 | $\Lambda^\top\Lambda \to I_K$ (vs Strong: $\Lambda^\top\Lambda/N$) |
| 신호 행렬 $M_{\text{PCA}}$ | $\Sigma_F + c\sigma_e^2 I_K$ ($K \times K$ 대각) |
| 신호 행렬 $M_{\text{RP-PCA}}$ | $(K+1) \times (K+1)$ 비대각 행렬 |
| 회전 $\tilde U$ | RP-PCA 고유벡터와 진짜 요인 사이의 매핑 |

**핵심 공식 (한 줄)**:
$$
M_{\text{RP-PCA}}\text{의 신호 = } \Sigma_F + (1+\gamma)\mu_F\mu_F^\top \text{ 의 고유값}
$$

→ $\sigma_F^2$ 작아도 $\mu_F$ 크면 신호 살아남음 = signal-strengthening.

다음 파일(**08_약한_요인_모델_Theorem2_Section5_중반.md**)에서는 **Theorem 2 (상전이의 수학적 정리)** 와 **Lemma 2 (RP-PCA의 PCA 지배)** 를 다룬다.

---


---

## 인터랙티브 시각화

```viz:rppca-mp-spectrum:title=Marchenko-Pastur 분포 + Spike;caption=잡음(bulk)과 신호(spike)의 분리. θ가 임계값을 넘어야 spike가 bulk 위로 분리되어 보임.
```

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Bulk spectrum과 spike의 차이는?**
2. **Cauchy/Stieltjes transform $G(z)$ 의 정의와 용도?**
3. **신호 행렬 $M_{\text{PCA}}$와 $M_{\text{RP-PCA}}$ 의 차원·구조 차이?**

### 답변
1. Bulk = 잡음 고유값의 군집 (Marchenko-Pastur 분포로 수렴). Spike = bulk 위로 분리된 큰 고유값 (진짜 신호).
2. $G(z) = \lim \frac{1}{N}\sum \frac{1}{z-\lambda_i}$. 표본 고유값이 어디 위치할지(=$G^{-1}(1/\theta_i)$) 예측.
3. $M_{\text{PCA}}$: $K \times K$ 대각. $M_{\text{RP-PCA}}$: $(K+1) \times (K+1)$ 비대각 — 평균 정보가 비대각 항으로 끼어듦.


```viz:lettau-rppca-spectrum:title=paper §3 — Eigenvalue Spectrum,caption=γ slider.
```
