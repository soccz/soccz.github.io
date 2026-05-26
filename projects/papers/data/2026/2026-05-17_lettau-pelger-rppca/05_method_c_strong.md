# 06. Section 4 (Strong Factor Model) — 강한 요인 모델 이론

> **🧒 한 줄 요약**: Strong factor case. Identification conditions.


논문 7쪽 후반 ~ 11쪽 초반 (Section 4 전체)을 풀어본다.

---

## 6.1 도입 — 강한 요인 모델이란?

> **원문**: "In a strong factor model RP-PCA provides a more efficient estimator of the loadings than PCA. Both RP-PCA and PCA provide consistent estimator for the loadings and factors."

**풀어 설명**:
- **강한 요인 모델**: 요인의 신호가 매우 강해서 공분산 행렬의 고유값이 **무한대로 폭발** ($O(N)$).
- 두 추정량 (PCA와 RP-PCA) 모두 **일관성**은 있음 (정답으로 수렴).
- 차이점: **효율성** — RP-PCA가 더 작은 분산으로 추정.

### "Consistent (일관성)"이 뭔가요?
**비유**: 동전을 100번 던져 앞면 비율을 측정하면 0.5에 가까워진다. 1000번 던지면 더 가까워진다. **무한히 던지면 정확히 0.5**. 이게 일관성.

### "Efficient (효율성)"이 뭔가요?
같은 일관성을 가진 두 추정량이 있을 때, **추정값이 정답 주위에서 덜 흔들리는** 쪽이 더 효율적.

**비유**: 활쏘기에서 둘 다 평균적으로 과녁 중앙을 맞히지만, 한 사람은 화살이 중앙 ±1cm에 분포, 다른 사람은 ±5cm에 분포. 앞사람이 더 효율적.

---

## 6.2 강한 요인의 수학적 정의

> **원문**: "In a strong factor model, the systematic factors are so strong that they lead to exploding eigenvalues. This is captured by the assumption that $\frac{1}{N}\Lambda^\top \Lambda \to \Sigma_\Lambda$ where $\Sigma_\Lambda$ is a full-rank matrix. This could be interpreted as the strong factors affecting an infinite number of assets."

### 풀어 설명

**가정**: $\frac{1}{N}\Lambda^\top \Lambda \to \Sigma_\Lambda$ (full rank).

**의미**:
- $\Lambda^\top\Lambda$ 는 $K \times K$ 행렬, 자산이 늘면 $O(N)$ 으로 커짐.
- $N$으로 나눠도 유한값으로 수렴 → "로딩이 거의 모든 자산에 의미 있게 들어 있다".

**비유**: 만 명이 한 표씩 던지면 표는 만 표. 강한 요인은 "거의 모든 자산이 이 요인에 영향을 받는다" → 자산 늘면 늘수록 누적 효과 폭발.

### 각주 10 — 정규화
> "In latent factor models only the product $F\Lambda$ is identified. Hence without loss of generality we will normalize $\Sigma_\Lambda$ to the identity matrix $I_K$ and assume that the factors are uncorrelated."

**풀어 설명**: 식별 문제 때문에 $\Sigma_\Lambda = I_K$ 로 정규화. 요인은 상관없게.

---

## 6.3 추정량 (다시 정리)

> **원문**: "The estimator for the loadings $\hat\Lambda$ are the eigenvectors of the first $K$ eigenvalues of $\frac{1}{N}\left(\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top\right)$ multiplied by $\sqrt N$."

### 추정 절차
1. 행렬 $M = \frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ 계산 (N×N)
2. 상위 $K$개 고유값/고유벡터 추출
3. 로딩: $\hat\Lambda$ = 고유벡터 × $\sqrt N$
4. 요인: $\hat F = X\hat\Lambda / N$ (회귀)
5. 공통성분: $\hat C = \hat F \hat\Lambda^\top$

> "Up to rescaling the estimators are identical to those in the weak factor model setup."

**풀어 설명**: 약한 요인 모델 셋업과도 (재스케일링까지) 동일.

---

## 6.4 Bai (2003)와의 비교

> **원문**: "Bai (2003) shows that under Assumption 1 the PCA estimator of the loadings has the same asymptotic distribution as an OLS regression of the true factors $F$ on $X$ (up to a rotation). Similarly, the estimator for the factors behaves asymptotically like an OLS regression of the true loadings $\Lambda$ on $X^\top$ (up to a rotation)."

### 풀어 설명

**Bai (2003)의 결과** (표준 PCA): 추정 로딩은 **회전(rotation)** 까지 $F$를 $X$에 회귀한 OLS와 같은 점근분포.

### "Rotation"이 왜 나오나?
요인 모델 $X = F\Lambda^\top + e$ 에서, 임의의 가역행렬 $G$ 에 대해:
$$
X = (FG)(G^{-1}\Lambda^\top) + e
$$
즉 $(F, \Lambda) \to (FG, \Lambda G^{-1\top})$ 로 바꿔도 같은 데이터. → **요인과 로딩은 회전까지만 식별 가능**.

**비유**: 좌표축을 어떻게 잡든 거리는 같다. "북쪽" 대신 "북북동"으로 잡아도 본질은 같음.

**해결**: 비교할 때는 회전 행렬 $H$ 만큼 보정해서 비교.

> "Under slightly stronger assumptions we will show that the estimated loadings under RP-PCA have the same asymptotic distribution up to rotation as an OLS regression of $WF$ on $WX$ with $W^2 = (I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top)$."

### 풀어 설명

**RP-PCA의 결과**: $WF$ 를 $WX$ 에 회귀한 OLS와 같은 점근분포.

여기서 $W^2 = I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top$ 는 "시간 가중 행렬".

**비유**: PCA가 "모든 시간을 동등하게 가중"한다면, RP-PCA는 "평균이 중요한 정도($\gamma$)에 따라 시간을 다르게 가중".

> "Surprisingly, estimated factors under RP-PCA and PCA have the same asymptotic distribution."

**풀어 설명**:
- **놀라움**: 강한 요인 모델에서는 **요인 자체**의 추정 분포는 PCA와 RP-PCA가 같다.
- 차이는 **로딩** 추정에서.

---

## 6.5 가정 1 (Assumption 1) — Strong Factor Model

이 가정은 Bai (2003) 의 가정 A–G + 작은 추가.

### 가정 1.A — 요인
> "**Factors**: $E[\|F_t\|^4] \le M < \infty$ and $\frac{1}{T}\sum_{t=1}^T F_t F_t^\top \xrightarrow{p} \Sigma_F$ for some $K \times K$ positive definite matrix $\Sigma_F$ and $\frac{1}{T}\sum_{t=1}^T F_t \xrightarrow{p} \mu_F$."

**풀어 설명**:
- 요인의 4차 모멘트 유한 (분포가 너무 두꺼운 꼬리 가지면 안 됨)
- 표본 공분산 $\to$ 모집단 공분산 $\Sigma_F$ (PD)
- 표본 평균 $\to$ 모집단 평균 $\mu_F$ ← **새로 추가된 부분** (표준 PCA에는 없음)

### 가정 1.B — 로딩
> "**Factor loadings**: $\|\Lambda_i\| \le \bar\lambda < \infty$, and $\|\Lambda^\top \Lambda/N - \Sigma_\Lambda\| \to 0$ for some $K \times K$ positive definite matrix $\Sigma_\Lambda$."

**풀어 설명**:
- 각 자산의 로딩 크기 유계.
- $\Lambda^\top\Lambda/N$ 이 PD 행렬로 수렴 (= 강한 요인 정의).

### 가정 1.C — 시간·횡단면 종속 + 이분산
> "**Time and cross-section dependence and heteroskedasticity**: There exists a positive constant $M < \infty$ such that for all $N$ and $T$: [1] $E[e_{t,i}] = 0$, $E[|e_{t,i}|^8] \le M$. [2] $E[N^{-1}\sum_{i=1}^N e_{s,i} e_{t,i}] = \gamma(s,t)$, $|\gamma(s,s)| \le M$ for all $s$ and for every $t \le T$ it holds $\sum_{s=1}^T |\gamma(s,t)| \le M$. [3] $E[e_{t,i}e_{t,j}] = \tau_{ij,t}$ with $|\tau_{ij,t}| \le |\tau_{ij}|$ for some $\tau_{ij}$ and for all $t$ and for every $i \le N$ it holds $\sum_{j=1}^N |\tau_{ij}| \le M$. [4] $E[e_{t,i}e_{s,j}] = \tau_{ij,ts}$ and $(NT)^{-1}\sum_{i=1}^N \sum_{j=1}^N \sum_{t=1}^T \sum_{s=1}^T |\tau_{ij,st}| \le M$. [5] For every $(t,s)$, $E[|N^{-1/2}\sum_{i=1}^N (e_{s,i}e_{t,i} - E[e_{s,i}e_{t,i}])|^4] \le M$."

**풀어 설명** (5개 조건):
1. 잔차 평균 0, 8차 모멘트 유한.
2. 시계열 자기상관 약함 (절대값 합 유계).
3. 횡단면 동시점 상관 약함.
4. 시계열-횡단면 교차 상관 약함.
5. 표본 4차 모멘트의 분산 유계.

**의미**: 잔차는 **약하게 종속** 가능하지만, ARMA 같은 구조 정도. 너무 강한 종속은 안 됨.

### 가정 1.D — 요인과 잔차의 약한 종속
> "**Weak dependence between factors and idiosyncratic errors**: $E\left[\frac{1}{N}\sum_{i=1}^N \|\frac{1}{\sqrt T}\sum_{t=1}^T F_t e_{t,i}\|^2\right] \le M$."

**풀어 설명**: 요인 $F_t$ 와 잔차 $e_{t,i}$ 가 약하게만 상관됨.

### 가정 1.E — 모멘트 + 중심극한정리
> "**Moments and Central Limit Theorem**: There exists an $M < \infty$ such that for all $N$ and $T$:
> 1. For each $t$, $E[\|\frac{1}{\sqrt{NT}}\sum_{s=1}^T \sum_{k=1}^N F_s (e_{s,k} e_{t,k} - E[e_{s,k}e_{t,k}])\|^2] \le M$
> 2. The $K \times K$ matrix satisfies $E[\|\frac{1}{\sqrt{NT}}\sum_{t=1}^T \sum_{i=1}^N F_t \Lambda_i^\top e_{t,i}\|^2] \le M$
> 3. For each $t$ as $N \to \infty$: $\frac{1}{\sqrt N}\sum_{i=1}^N \Lambda_i e_{t,i} \xrightarrow{d} N(0, \Gamma_t)$, where $\Gamma_t = \lim_{N \to \infty} \frac{1}{N}\sum_i \sum_j \Lambda_i \Lambda_j^\top E[e_{t,i}e_{t,j}]$.
> 4. For each $i$ as $T \to \infty$: $\begin{pmatrix}\frac{1}{\sqrt T}\sum F_t e_{t,i} \\ \frac{1}{\sqrt T}\sum e_{t,i}\end{pmatrix} \xrightarrow{D} N(0, \Omega_i)$, $\Omega_i = \begin{pmatrix}\Omega_{11,i} & \Omega_{12,i}\\ \Omega_{21,i} & \Omega_{22,i}\end{pmatrix}$
> where $\Omega_i = p\lim_{T \to \infty} \frac{1}{T}\sum_{s=1}^T\sum_{t=1}^T E[\begin{pmatrix}F_t F_s^\top e_{s,i} e_{t,i} & F_t e_{s,i} e_{t,i} \\ F_s^\top e_{s,i} e_{t,i} & e_{s,i}e_{t,i}\end{pmatrix}]$."

**풀어 설명** (4개 조건, 단순화):
1. 2차 모멘트 유계 (잔차×요인 교차 합).
2. 같은 식 다른 조합.
3. 횡단면 CLT: $N$ 늘면 $\Lambda \cdot e$ 합이 정규분포로 수렴.
4. 시계열 CLT: $T$ 늘면 $F \cdot e$ 합이 정규분포로 수렴. **여기서 $\Omega_i$ 가 점근분산의 핵심 재료**.

**핵심 포인트**: 조건 [4]에서 $\Omega_i$ 는 $2K \times 2K$ 행렬, 4개 블록으로 구성. 이 중 $\Omega_{22,i}$ 가 **잔차의 분산** 부분이고, 이게 RP-PCA의 점근분산에 등장한다.

### 가정 1.F — 고유값 distinct
> "**Distinct eigenvalues**: The eigenvalues of the $K \times K$ matrix $\Sigma_\Lambda \Sigma_F$ are distinct."

**풀어 설명**: $\Sigma_\Lambda \Sigma_F$ 의 고유값이 서로 다름.

**왜 필요?**: 고유값이 같으면 고유벡터가 유일하게 정해지지 않음 → 추정이 모호해짐.

---

## 6.6 Theorem 1 — 점근분포 (논문의 핵심 정리 중 하나)

> "Theorem 1 provides a complete inferential theory for the strong factor model."

이 정리는 **4파트**로 구성.

### Part 1 — 일관성
> "If $\min(N,T) \to \infty$, then for any $\gamma \in [-1, \infty)$ the factors and loadings can be estimated consistently pointwise."

**풀어 설명**:
- $N, T$ 둘 다 무한대로 보내면 $\gamma$ 가 어떤 값이든 **일관 추정**.
- $\gamma$ 선택이 일관성을 깨지 않음 → 안전.

### Part 2 — 로딩의 점근정규성 (핵심)
> "If $\sqrt T / N \to 0$, then the asymptotic distribution of the loadings estimator is given by
> $$\sqrt T (H^\top \hat\Lambda_i - \Lambda_i) \xrightarrow{d} N(0, \Phi_i)$$
> $$\Phi_i = (\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1} (\Omega_{11,i} + \gamma\mu_F\Omega_{21,i} + \gamma\Omega_{12,i}\mu_F + \gamma^2 \mu_F\Omega_{22,i}\mu_F^\top)(\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1}$$
> $$H = \left(\frac{1}{T}F^\top W^2 F\right)\left(\frac{1}{N}\Lambda^\top \hat\Lambda\right) V_{TN}^{-1}$$
> and $V_{TN}$ is a diagonal matrix of the largest $K$ eigenvalues of $\frac{1}{NT}X^\top W^2 X$ and $W^2 = (I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top)$. For $\gamma = -1$ this simplifies to the conventional case $\Sigma_F^{-1}\Omega_{11,i}\Sigma_F^{-1}$."

### Part 2 풀이

**핵심 결과**: 추정 로딩 $\hat\Lambda_i$ 는 진짜 로딩 $\Lambda_i$ 주위에서 정규분포로 수렴.
- 수렴 속도: $\sqrt T$
- 분산: $\Phi_i$

### $\Phi_i$ 해부

$$
\Phi_i = \underbrace{(\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1}}_{A} \underbrace{(\Omega_{11,i} + \gamma\mu_F\Omega_{21,i} + \gamma\Omega_{12,i}\mu_F + \gamma^2 \mu_F\Omega_{22,i}\mu_F^\top)}_{B} \underbrace{(\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1}}_{A}
$$

**$A$ 부분**: $\Sigma_F + (\gamma+1)\mu_F\mu_F^\top$ 의 역. $\gamma$ 가 커질수록 $A$ 가 작아짐 (PSD 더함 → 역 작아짐).

**$B$ 부분**: 4개 항의 합. $\gamma$가 들어간 모든 모멘트 조합.

**$\gamma = -1$ (PCA)**: $A = \Sigma_F^{-1}$, $B = \Omega_{11,i}$. 따라서 $\Phi_i = \Sigma_F^{-1}\Omega_{11,i}\Sigma_F^{-1}$. ← **Bai (2003) 의 결과**.

### $H$ (회전 행렬)
- 식별 문제 해결을 위한 회전.
- $\sqrt T (H^\top \hat\Lambda_i - \Lambda_i)$ → 추정과 진짜를 회전 보정 후 비교.

### Part 3 — 요인 자체의 점근분포 (놀라운 결과)
> "If $\sqrt N / T \to 0$, then the asymptotic distribution of the factors is not affected by the choice of $\gamma$."

**풀어 설명**:
- **놀라움**: 요인 $F_t$ 자체의 추정 분포는 $\gamma$ 에 영향 받지 않음.
- 차이는 로딩에서만.

**왜 그런가?**: 요인 추정은 $\hat F = X\hat\Lambda/N$ 회귀로 얻는데, $N$ 늘면 회귀 점근분포가 $\gamma$ 무관해짐.

### Part 4 — 공통성분 ($C = F\Lambda$)
> "For any choice of $\gamma \in [-1, \infty)$ the common components can be estimated consistently if $\min(N,T) \to \infty$. The asymptotic distribution of the common component depends on $\gamma$ if and only if $T/N$ does not go to zero. For $T/N \to 0$
> $$\sqrt T (\hat C_{t,i} - C_{t,i}) \xrightarrow{D} N(0, F_t^\top \Phi_i F_t)."$$

**풀어 설명**:
- 공통성분 = $F\Lambda^\top$ ($X$ 중 잔차 빼고 모델로 설명되는 부분).
- 일관성 OK.
- 점근분포는 $T/N$ 비에 따라 $\gamma$ 의존성 결정.

### 부연 설명 (Bai 2003 와의 표기 차이)
> "Note that Bai (2003) characterizes the distribution of $\sqrt T(\Lambda_i - H^{\top -1}\hat\Lambda_i)$, while we rotate the estimated loadings $\sqrt T(H^\top \hat\Lambda_i - \Lambda_i)$. Our rotated estimators are directly comparable for different choices of $\gamma$. The proof of the theorem is essentially identical to the arguments of Bai (2003)."

**풀어 설명**:
- Bai (2003)는 진짜 $\Lambda$를 회전한 형태로 표현.
- 본 논문은 추정 $\hat\Lambda$를 회전 → **$\gamma$ 다른 값들 비교 직접 가능**.
- 증명은 Bai와 본질적으로 같음.

---

## 6.7 점근 전개 (Asymptotic Expansion) — 증명의 핵심

> "The key argument is based on an asymptotic expansion. Under Assumption 1 we can show that the following expansions hold:"

세 개의 식:

### 식 1 — 로딩 전개
$$
\sqrt T \left(H^\top \hat\Lambda_i - \Lambda_i\right) = \left(\frac{1}{T}F^\top W^2 F\right)^{-1} \frac{1}{\sqrt T} F^\top W^2 e_i + O_p\!\left(\frac{\sqrt T}{N}\right) + o_p(1)
$$

**풀어 설명**:
- 추정 오차 = "회귀 분산 항^-1 × 회귀 공분산 항" + 작은 잔차.
- $W^2 = I + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top$ 는 시간 가중.

### 식 2 — 요인 전개
$$
\sqrt N \left(H^{\top-1} \hat F_t - F_t\right) = \left(\frac{1}{N}\Lambda^\top \Lambda\right)^{-1} \frac{1}{\sqrt N} \Lambda^\top e_t + O_p\!\left(\frac{\sqrt N}{T}\right) + o_p(1)
$$

**풀어 설명**: 요인의 추정 오차. $\gamma$ 가 안 들어감 → Part 3 결과의 이유.

### 식 3 — 공통성분 전개
$$
\sqrt\delta \left(\hat C_{t,i} - C_{t,i}\right) = \frac{\sqrt\delta}{\sqrt T} F_t^\top \left(\frac{1}{T}F^\top W^2 F\right)^{-1} \frac{1}{\sqrt T} F^\top W^2 e_i + \frac{\sqrt\delta}{\sqrt N} \Lambda_i^\top \left(\frac{1}{N}\Lambda^\top\Lambda\right)^{-1} \frac{1}{\sqrt N}\Lambda^\top e_t + o_p(1)
$$

$\delta = \min(N,T)$.

**풀어 설명**: 공통성분 = 로딩 효과 + 요인 효과 + 작은 잔차.

### 전개의 의미
> "We just need to replace the factors and asset space by their projected counterpart $WF$ and $WX$ in Bai's (2003) proofs. Conventional PCA, i.e. $\gamma = -1$ is a special case of our result, which typically leads to inefficient estimation."

**풀어 설명**:
- Bai (2003) 증명에서 $F \to WF$, $X \to WX$ 치환만 하면 본 논문 증명.
- **표준 PCA ($\gamma = -1$) 는 특수 케이스, 일반적으로 비효율**.

---

## 6.8 Lemma 1 — PCA의 비효율성

> "**Lemma 1**: If $\mu_F \neq 0$, then it is not efficient to use the covariance matrix for estimating the loadings and common components, i.e. the choice of $\gamma = -1$ does not lead to the smallest asymptotic covariance matrix for the loadings and common components."

### 풀어 설명

**명제**: 요인 평균이 0이 아니면 ($\mu_F \neq 0$), **공분산 행렬 PCA ($\gamma = -1$) 는 비효율** = 분산 최소가 아니다.

**증명 직관**: $\Phi_i$ 공식에서 $\gamma$를 어떤 값으로 설정하느냐에 따라 분산이 달라짐. $\gamma = -1$ 이 최소가 아닌 경우가 발생.

**의미**: 자산가격 응용에서 $\mu_F \neq 0$ 은 거의 항상 성립 (위험프리미엄이 0이 아니므로) → **PCA는 거의 항상 비효율**.

---

## 6.9 Example 1 — Simplified Strong Factor Model

> "In order to get a better intuition we consider an example with i.i.d. residuals over time. This simplified model will be more comparable to the weak factor model in the next section."

### 가정 (4개)
1. **Rate**: $N/T \to c$ with $0 < c < \infty$.
2. **Factors**: 서로 무상관, $e, \Lambda$ 와 독립, 1차/2차 모멘트 유한.
   - $\hat\mu_F = \frac{1}{T}\sum F_t \xrightarrow{p} \mu_F$
   - $\hat\Sigma_F = \frac{1}{T}F_tF_t^\top \xrightarrow{p} \Sigma_F = \text{diag}(\sigma_{F_1}^2, \ldots, \sigma_{F_K}^2)$
3. **Loadings**: $\Lambda^\top\Lambda/N \to I_K$ 이고 모두 유계. 요인, 잔차와 독립.
4. **Residuals**: $e = \epsilon \Sigma$, $\epsilon_{t,i} \overset{iid}{\sim} N(0,1)$. $\Sigma$ 원소·행합 유계.

**의미**: 가능한 단순한 케이스 — 요인 무상관, 로딩 정규, 잔차 i.i.d. 정규.

---

## 6.10 Corollary 1 — Simplified Model의 점근분포

> "**Corollary 1: Simplified Strong Factor Model**: The assumptions of example 1 hold. The factors and loadings can be estimated consistently. The asymptotic distribution of the factors is not affected by $\gamma$. The asymptotic distribution of the loadings is given by
> $$\sqrt T (H^\top \hat\Lambda_i - \Lambda_i) \xrightarrow{D} N(0, \Omega_i)$$
> where $E[e_{t,i}^2] = \sigma_{\epsilon_i}^2$ and
> $$\Omega_i = \sigma_{\epsilon_i}^2 (\Sigma_F + (1+\gamma)\mu_F\mu_F^\top)^{-1}(\Sigma_F + (1+\gamma)^2 \mu_F\mu_F^\top)(\Sigma_F + (1+\gamma)\mu_F\mu_F^\top)^{-1}$$
> The optimal choice for the weight minimizing the asymptotic variance is $\gamma = 0$. Choosing $\gamma = -1$, i.e. the covariance matrix for factor estimation, is not efficient."

### 풀이

**점근 분산** (단순화):
$$
\Omega_i = \sigma_{\epsilon_i}^2 (\Sigma_F + (1+\gamma)\mu_F\mu_F^\top)^{-1}(\Sigma_F + (1+\gamma)^2 \mu_F\mu_F^\top)(\Sigma_F + (1+\gamma)\mu_F\mu_F^\top)^{-1}
$$

**최적 $\gamma$**: $\gamma = 0$.

### 왜 $\gamma = 0$이 최적인가?

**확인 1**: $\gamma = -1$ (PCA): 
$$\Omega_i = \sigma_{\epsilon_i}^2 \Sigma_F^{-1} \Sigma_F \Sigma_F^{-1} = \sigma_{\epsilon_i}^2 \Sigma_F^{-1}$$

**확인 2**: $\gamma = 0$:
$$\Omega_i = \sigma_{\epsilon_i}^2 (\Sigma_F + \mu_F\mu_F^\top)^{-1}(\Sigma_F + \mu_F\mu_F^\top)(\Sigma_F + \mu_F\mu_F^\top)^{-1} = \sigma_{\epsilon_i}^2 (\Sigma_F + \mu_F\mu_F^\top)^{-1}$$

**비교**: $\Sigma_F^{-1}$ vs $(\Sigma_F + \mu_F\mu_F^\top)^{-1}$.
$\mu_F\mu_F^\top$ 은 PSD → 더하면 행렬이 커짐 → 역행렬은 작아짐.
**∴ $(\Sigma_F + \mu_F\mu_F^\top)^{-1} < \Sigma_F^{-1}$ (Loewner 순서)**

→ **$\gamma = 0$이 $\gamma = -1$보다 분산 작음**.

**일반 $\gamma > 0$**: 풀면 $\gamma = 0$ 이 더 작아짐을 확인 가능 (양변 미분).

### ★ 이것이 매우 중요한 사실 — 발표 주의점

이 결과는 **"강한 요인의 단순 케이스에서 최적 $\gamma$ = 0"** 이라는 것.

**그런데 실증에서는 $\gamma = 10$ 권장** — 왜?

**이유**: 실증 데이터는 약한 요인 모델에 더 가까움 (다음 섹션). 약한 요인 검출에는 큰 $\gamma$ 필요. → **강한/약한 모델에서 최적 $\gamma$ 가 다르다**.

---

## 6.11 GMM 해석 — Section 4 마무리

> "The estimator in the strong factor model can be formulated as a GMM problem. Up to a remainder term that vanishes under appropriate rate conditions the loading estimator is given by
> $$H^\top \hat\Lambda_i = (F^\top W^2 F)^{-1} F^\top W^2 X_i$$"

### 풀어 설명

**로딩 추정량**: 시간 가중행렬 $W^2$ 을 이용한 **가중회귀**.
- $W^2 = I + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top$
- $W^2 = I$ ($\gamma = 0$) 면 표준 OLS
- $\gamma > 0$ 이면 평균 부분에 더 무게

### GMM 형태로

> "This is equivalent to combining the OLS and the pricing moment conditions with a weight $\gamma$. More specifically, we define the following $K+1$ population and sample moments
> $$G(\Lambda_i) = E\!\begin{bmatrix}(X_{t,i} - F_t\Lambda_i^\top) F_t (E[F_t F_t^\top])^{-1/2} \\ E[X_i - F_t\Lambda_i^\top]\end{bmatrix}$$
> $$\hat G(\Lambda_i) = \begin{pmatrix}\frac{1}{\sqrt T} (X_i - F\Lambda_i^\top)^\top F (F^\top F)^{-1/2} \\ \frac{1}{T}(X_i - F\Lambda_i^\top)^\top \mathbb{1}\end{pmatrix}$$
> The first $K$ moments are identical to the OLS first order condition of a regression of $X$ on $F$. The last moment is the APT pricing moment equation. The GMM estimator
> $$\arg\min \hat G^\top \begin{pmatrix}I_K & 0\\ 0 & \gamma\end{pmatrix} \hat G$$
> has the solution $H^\top \hat\Lambda_i$."

### 풀어 설명

**$K+1$ 개 모멘트 조건**:
- 첫 $K$개: OLS의 1차조건 ($X$를 $F$에 회귀)
- 마지막 1개: APT 가격결정 모멘트 (평균 매칭)

**가중치 행렬**: $\binom{I_K \; 0}{0 \; \gamma}$ — 마지막 모멘트에 $\gamma$ 가중.

**해**: RP-PCA 추정량과 동일.

### "왜 더 효율적인가?"의 답
**GMM 효율성 정리**: 같은 모수에 대해 모멘트가 더 많으면 GMM이 더 효율적.
- PCA = $K$ 모멘트 (OLS만)
- RP-PCA = $K+1$ 모멘트 (OLS + 가격결정)

→ **RP-PCA가 더 효율적인 건 단순히 모멘트가 하나 더 있기 때문**.

### 비유
**비유**: 학생의 실력을 평가할 때:
- 방법 A: 시험 점수만 본다 (1개 정보)
- 방법 B: 시험 점수 + 평소 학점도 본다 (2개 정보)

A는 평소 학점 정보를 버리니까 B보다 추정이 부정확.

---

## 6.12 Section 4 핵심 요약

| 결과 | 한 줄 요약 |
|------|-----------|
| Theorem 1 | 일관성 + 점근정규성, $\gamma$ 에 따라 분산 다름 |
| Lemma 1 | $\mu_F \neq 0$이면 PCA ($\gamma=-1$)는 비효율 |
| Corollary 1 | 단순 케이스에서 **최적 $\gamma = 0$** |
| GMM 해석 | OLS FOC + APT pricing moment의 결합 |
| 점근 전개 | Bai (2003) 증명을 $F \to WF$ 치환으로 일반화 |

**핵심 메시지**:
> "강한 요인 모델에서 RP-PCA는 PCA보다 더 효율적. 단순 케이스에서 최적 $\gamma = 0$ (모멘트 동등 가중). $\gamma \neq -1$ 이면 항상 PCA보다 좋거나 같다."

다음 파일(**07_약한_요인_모델_RMT기초_Section5_전반.md**)에서는 **약한 요인 모델의 분석에 필요한 랜덤 행렬 이론(RMT) 기초**를 다룬다.

---

## 자기점검 (이 챕터)

### 핵심 4가지
1. **Theorem 1의 4 파트는 각각 무엇을 말하는가?**
2. **Lemma 1의 결론은?**
3. **Corollary 1에서 단순 케이스의 최적 $\gamma$는?**
4. **GMM 해석에서 $K+1$ 모멘트 조건이란?**

### 답변
1. (1) 일관성 (모든 γ), (2) 로딩의 점근정규성 (γ 의존), (3) 요인의 점근분포는 γ 무관, (4) 공통성분 일관성.
2. $\mu_F \neq 0$ 이면 $\gamma=-1$ (PCA)는 비효율 — 분산 최소가 아님.
3. **$\gamma = 0$** (균등 가중). $\gamma=-1$ (PCA)도 아니고 $\gamma\to\infty$ 도 아님 — 균형이 핵심.
4. OLS first-order condition $K$개 + APT pricing moment 1개. RP-PCA = 이 $K+1$ 조건의 가중 GMM.
