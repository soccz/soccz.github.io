# 13. Appendix B — Theorem 2 증명 풀이

> **🧒 한 줄 요약**: Mathematical proofs. Theorem 1-3.


논문 34쪽 ~ 40쪽 (부록 B 전체)을 풀어본다.

이 파트는 **가장 수학적으로 어렵다**. 이해 가능한 수준까지만 풀고, 어려운 부분은 "왜 그런 단계인지"만 설명한다.

---

## 13.1 증명의 큰 그림

증명은 RMT (랜덤 행렬 이론)의 **Benaych-Georges & Nadakuditi (2011)** 의 기법을 따른다.

### 증명 전략

**목표**: $\frac{1}{T}X^\top(I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top)X$ 의 상위 고유값과 고유벡터의 점근 행동을 알아내기.

**기본 트릭**: 대신 **$\frac{1}{T}WXX^\top W$** 를 분석. 이것은 같은 고유값을 가짐 ($W^2 = I + \frac{\tilde\gamma}{T}\mathbb{1}\mathbb{1}^\top$ 으로 정의).

**왜 더 쉬운가?**: 대각화하기 쉬운 형태로 변환 가능.

### 단계
1. 직교 분해 $U = (U_1, U_2)$ 구성.
2. 행렬 $S = \frac{1}{T}U^\top W X X^\top W U$ 분석.
3. $\kappa_T(\lambda)$ 함수의 극한 분석 (RMT 기법).
4. 고유값 위치 결정.
5. 고유벡터 분석으로 $\rho^2$ 도출.

---

## 13.2 출발 — 정의와 표기

> **원문**: "We only prove the statements for RP-PCA. The statements for the conventional PCA based on the covariance matrix are a special case."

**풀어 설명**: RP-PCA 만 증명, PCA는 $\gamma = -1$ 특수 케이스.

### 표기
- $A$: $N \times N$ 행렬. 정렬된 고유값 $\lambda_1(A) \ge \ldots \ge \lambda_N(A)$.
- $\phi_A(z) = \frac{1}{N}\sum_i \delta_{\lambda_i(A)}$: 경험적 고유값 분포 (Dirac 측도 합).
- $\delta_x$: Dirac measure (점 질량).
- $\phi_A$ 는 거의 확실히 약수렴 (Assumption 2 하).

---

## 13.3 직교 분해 — $U = (U_1, U_2)$

> **원문**: "Instead of using $\frac{1}{T}X^\top W^2 X$ we study $\frac{1}{T}WXX^\top W$ with $W = I_T + \frac{\tilde\gamma}{T}\mathbb{1}\mathbb{1}^\top$ and $\tilde\gamma = \sqrt{\gamma+1}-1$. Define the orthonormal matrix $U = (U_1, U_2)$ consisting of the $T \times K+1$ matrix $U_1$ and the $T \times T - K - 1$ matrix $U_2$ by"

$$
U_1 = \left( (I_T - \tfrac{1}{T}\mathbb{1}\mathbb{1}^\top) \tfrac{F}{\sqrt T}\quad \tfrac{\mathbb{1}}{\sqrt T} \right) \begin{pmatrix}(F^\top(I_T - \tfrac{1}{T}\mathbb{1}\mathbb{1}^\top)F)^{-1/2} & 0 \\ 0 & 1\end{pmatrix} \tilde U
$$

### 풀어 설명

**$U_1$ 의 의미**:
- 첫 부분: $(I - \mathbb{1}\mathbb{1}^\top/T) F/\sqrt T$ = 평균을 뺀 요인 (demean).
- 둘째 부분: $\mathbb{1}/\sqrt T$ = 평균 방향.
- 결합: 요인과 평균을 합친 $K+1$ 차원 부분공간.
- 정규화: 그 부분공간의 정규직교 기저로 만듦.
- $\tilde U$: 신호 행렬 $M_{\text{RP-PCA}}$ 의 고유벡터로 추가 회전.

**$U_2$**: $U_1$ 의 직교보완. $T - K - 1$ 차원.

**왜 이렇게 구성?**: 요인 정보가 $U_1$ 공간에, 잡음만 $U_2$ 공간에 들어가도록 분해.

### 신호 행렬 등장

> "where the $K+1 \times K+1$ matrix $\tilde U$ consists of the orthonormal eigenvectors of the 'signal matrix' $M_{\text{RP-PCA}}$:"

$$
\tilde U^\top \begin{pmatrix}\Sigma_F + c\sigma_e^2 & \Sigma_F^{1/2}\mu_F(1+\tilde\gamma) \\ \mu_F^\top\Sigma_F^{1/2}(1+\tilde\gamma) & (1+\gamma)(\mu_F^\top\mu_F + c\sigma_e^2)\end{pmatrix} \tilde U = \begin{pmatrix}\theta_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}\end{pmatrix}
$$

**풀어 설명**: $M_{\text{RP-PCA}}$ 를 대각화하는 회전 $\tilde U$ 가 점근 분석에 직접 등장.

> "$U_2$ are orthonormal vectors orthogonal to $U_1$, i.e. $U_1^\top U_2 = 0$ and $U_2^\top U_2 = I_{T-K-1}$."

---

## 13.4 행렬 $S$ 분석

> **원문**: "We now analyze the spectrum of $S := \frac{1}{T}U^\top WXX^\top WU$, which has the same eigenvalues as $\frac{1}{T}X^\top W^2 X$."

### 핵심 트릭
- $S$ 와 $\frac{1}{T}X^\top W^2 X$ 가 **같은 고유값** 을 가짐.
- $S$ 가 분석하기 더 쉬움.

### 블록 분해
$$
S = \begin{pmatrix}S_{11} & S_{12} \\ S_{21} & S_{22}\end{pmatrix}
$$
$$
S_{11} = \tfrac{1}{T}U_1^\top W(F\Lambda^\top + e)(F\Lambda^\top + e)^\top WU_1
$$
$$
S_{12} = \tfrac{1}{T}U_1^\top W(F\Lambda^\top + e)e^\top WU_2
$$
$$
S_{22} = \tfrac{1}{T}U_2^\top Wee^\top WU_2
$$

**풀어 설명**:
- $S_{11}$: 신호 부공간 안의 신호+잡음.
- $S_{12}$: 신호-잡음 교차항.
- $S_{22}$: 잡음만의 공간.

**핵심 관찰**: $U_2$ 는 신호와 직교 → $S_{22}$ 는 잡음만 포함.

---

## 13.5 고유값 방정식

> **원문**: "An eigenvalue of $S$ that is not an eigenvalue of $S_{22}$ satisfies"
$$
0 = \det(\lambda I_T - S) = \det(\lambda I_{T-K-1} - S_{22})\det(\lambda I_{K+1} - \kappa_T(\lambda))
$$

여기서
$$
\kappa_T(\lambda) = S_{11} + S_{12}(\lambda I_{T-K-1} - S_{22})^{-1} S_{21}
$$

### 풀어 설명

**Schur complement 트릭**: 블록 행렬의 행렬식을 분해.

**결과**:
- $S_{22}$ 의 고유값이 아닌 $\lambda$ 에 대해, $S$ 의 고유값은 $\det(\lambda I_{K+1} - \kappa_T(\lambda)) = 0$ 만족.
- 즉 $\lambda$ 가 $\kappa_T(\lambda)$ 의 고유값이면 됨.

**의의**: $T \times T$ 문제를 $(K+1) \times (K+1)$ 문제로 환원.

> "For sufficiently large $T$ it holds $\det(\lambda I_{T-K-1} - S_{22}) \neq 0$ for the first $K+1$ eigenvalues. Therefore the first $K+1$ eigenvalues satisfy
> $$\det(\lambda I_{K+1} - \kappa_T(\lambda)) = 0.$$"

**풀어 설명**: 큰 $T$ 에서 상위 $K+1$ 고유값은 위 식 만족.

---

## 13.6 $\kappa_T(\lambda)$ 의 극한

> **원문**: "We want to study the limiting behavior of $\kappa_T(\lambda)$ for $T \to \infty$."

여러 단계 계산 (생략 가능). 핵심 결과만:

> "By the law of large numbers and Lemma A.2 in Benaych-Georges and Nadakuditi (2011) it holds first
> $$\frac{\lambda}{T}(U_1^\top W(F\Lambda^\top))(\lambda I_N - \frac{1}{T}U_2^\top W ee^\top WU_2)^{-1}(U_1^\top W(F\Lambda^\top))^\top$$
> $$= \lambda \left(\frac{1}{T}U_1^\top WFF^\top WU_1\right)\frac{1}{N}\text{trace}\!\left((\lambda I_N - \frac{1}{T}U_2^\top Wee^\top WU_2)^{-1}\right) + o_p(1)$$"

**풀어 설명**: $N \to \infty$ 일 때 trace 평균이 결정론적 극한으로.

추가 단계들 모두 합치면 최종 결과:

> "In summary the limit value of $\kappa_T$ is described by
> $$\kappa_T(\lambda) = \lambda \tilde U^\top \!\left( \begin{pmatrix}\Sigma_F & \Sigma_F^{1/2}\mu_F(1+\tilde\gamma) \\ \mu_F^\top\Sigma_F^{1/2}(1+\tilde\gamma) & \mu_F^\top\mu_F(1+\gamma)\end{pmatrix} + \frac{c \cdot \text{trace}(\Sigma)}{N}\begin{pmatrix}I_K & 0 \\ 0 & 1+\gamma\end{pmatrix}\right) \tilde U \cdot \frac{1}{N}\text{trace}\!\left(\!(\lambda I_N - \frac{1}{T}U_2^\top Wee^\top WU_2)^{-1}\!\right) + o_p(1)$$"

### 풀어 설명

**오른쪽 첫째 행렬**: 정확히 신호 행렬 $M_{\text{RP-PCA}}$ (대각화 형태).

**두 번째 행렬 (trace)**: Cauchy transform $G(\lambda)$ 와 관련.

### 최종 극한
$$
\kappa_T(\lambda) \xrightarrow{p} \kappa(\lambda) = \lambda \tilde U^\top M_{\text{RP-PCA}} \tilde U G(\lambda)
$$

여기서 $\tilde U^\top M_{\text{RP-PCA}} \tilde U = \text{diag}(\theta_1, \ldots, \theta_{K+1})$.

---

## 13.7 고유값 위치 — Phase Transition

> **원문**: "Therefore $\lambda$ is eigenvalue of $\begin{pmatrix}\theta_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}\end{pmatrix}G(\lambda)$ which is equivalent to
> $$G(\lambda) = \frac{1}{\theta_i} \quad \text{respectively} \quad \lambda = G^{-1}\!\left(\frac{1}{\theta_i}\right).$$"

### 풀어 설명

**핵심 결과**: 상위 고유값 $\hat\theta_i = G^{-1}(1/\theta_i)$.

**해석**:
- $G(\lambda) = 1/\theta_i$ 라는 방정식을 풀면 $\lambda = G^{-1}(1/\theta_i)$.
- $\theta_i$ 가 클수록 $1/\theta_i$ 작음 → $G^{-1}$ 의 큰 값 → $\hat\theta_i$ 큼.

> "If a solution outside the support of the spectrum of $S_{22}$ exists, then it must satisfy the equation $G(\lambda) = \frac{1}{\theta_i}$ for some $i = 1, \ldots, K+1$. Otherwise by Weil's inequality and the same arguments as in Benaych-Georges and Nadakuditi (2011) $\lambda \xrightarrow{p} b$. For $z > b$ we have $G'(z) < 0$. Therefore if $\theta_i > \frac{1}{G(b)}$ then a solution exists. If $\theta_i < \frac{1}{G(b^+)}$ then no solution exists and $\lambda \xrightarrow{p} b$."

### 풀어 설명 — Phase Transition 증명

**조건 분석**:
- $\theta_i > 1/G(b^+) = \theta_{\text{crit}}$: 방정식 해 존재 → $\hat\theta = G^{-1}(1/\theta_i)$.
- $\theta_i < \theta_{\text{crit}}$: 해 없음 → $\hat\theta \to b$ (잡음 윗 끝).

**왜 $G'(z) < 0$?**: $G(z)$ 는 $z$ 에 대해 감소함수 (bulk 위쪽에서). 그래서 역함수 잘 정의됨.

→ **Theorem 2 의 고유값 부분 증명 완료**.

---

## 13.8 고유벡터 분석 — $\rho^2$ 도출

> **원문**: "Recall that the estimators for the loadings and factors are defined as follows: $\hat\Lambda$ are the first $K$ eigenvectors of $\frac{1}{T}X^\top W^2 X$ and $\hat F = X\hat\Lambda$. For the proofs we will use an equivalent formulation. Denote by $V$ the first $K$ eigenvectors of $\frac{1}{T}U^\top WXX^\top WU$. Then $\hat\Lambda = X^\top WUVD_K^{-1/2}$, where $D_K$ is a diagonal matrix with the first $K$ largest eigenvalues of $\frac{1}{T}U^\top X^\top W^2 XU$, i.e.
> $$\frac{1}{T}V^\top U^\top WXX^\top WUV = D_K.$$
> The factors estimator takes the form $\hat F = X\hat\Lambda = \sqrt T W^{-1}UVD_K^{1/2}$."

### 풀어 설명

**$V$**: $S$ 의 고유벡터.

**$\hat\Lambda, \hat F$ 의 형태**: $V$ 로 표현. 모두 정형화된 형태.

### 고유벡터 방정식

> "We analyze the $K+1$ eigenvectors of $\frac{1}{T}U^\top WXX^\top WU$. Assume $u_i$ is an eigenvector of $S$ associated with $\lambda_i$:
> $$\begin{pmatrix}\lambda_i I_{K+1} - S_{11} & -S_{12} \\ -S_{21} & \lambda_i I_{T-K-1} - S_{22}\end{pmatrix}\begin{pmatrix}u_{i,1} \\ u_{i,2}\end{pmatrix} = \begin{pmatrix}0 \\ 0\end{pmatrix}$$"

**풀어 설명**: 고유벡터를 두 부분으로 분해 ($K+1$ 차원 + $T-K-1$ 차원).

### 풀이
$$
u_{2,i} = (\lambda_i I_{T-K-1} - S_{22})^{-1} S_{21} u_{i,1}
$$
$$
0 = (\lambda_i I_{K+1} - \kappa_T(\lambda_i)) u_{i,1}
$$

**의의**: 고유벡터의 두 부분 모두 $u_{i,1}$ 으로 표현.

### $\theta_i > \theta_{\text{crit}}$ 경우

> "Assume that $\theta_i > \theta_{\text{crit}}$, i.e. $\lambda_i I_{K+1} - \kappa_T(\lambda_i) = 0$ has a solution. Consequently
> $$\left(I_{K+1} - \theta_i^{-1}\begin{pmatrix}\theta_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}\end{pmatrix}\right) u_{i,1} = o_p(1).$$"

**풀어 설명**: $u_{i,1}$ 이 특정 형태가 되어야 함.

> "As a consequence the vector $u_{i,1}$ has all elements equal to zero except at the $i$th position:"
$$
u_{i,1}^\top = (0 \;\cdots\; 0 \;\; \|u_{i,1}\| \;\; 0 \;\cdots\; 0)
$$

**풀어 설명**: 고유벡터의 첫 부분은 $i$번째 위치에만 0 아닌 원소.

### Length 계산
> "The vector $u_{i,2}$ satisfies
> $$u_{i,2}^\top u_{i,2} = u_{i,1}^\top S_{12}(\lambda_i I_{T-K-1} - S_{22})^{-2} S_{21} u_{i,1}$$"

여러 계산 단계 후:

$$
u_{i,2}^\top u_{i,2} = u_{i,1}^\top \begin{pmatrix}\theta_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}\end{pmatrix} u_{i,1} \cdot \text{trace}(\cdot) + o_p(1)
$$

### $B(\lambda)$ 등장

> "By the properties of the trace operator
> $$\text{trace}(...) = \int \frac{z}{(\lambda_i - z)^2} d\tilde\phi_T(z)$$
> which converges almost surely to
> $$\int \frac{z}{(\lambda_i - z)^2} d\tilde\phi(z) = \int \frac{z}{(\lambda_i - z)^2} d(c\phi(z) + (1-c)\delta_0) = c\int \frac{z}{(\lambda_i - z)^2} d\phi(z) = B(\lambda_i).$$"

### 최종 단계

> "Consequently
> $$1 = \|u_{i,1}\|^2 + \|u_{i,2}\|^2 = u_{i,1}^\top u_{i,1}(1 + \theta_i B(\lambda_i)) + o_p(1)$$
> and therefore
> $$\boxed{\;\|u_{i,1}\|^2 \xrightarrow{p} \frac{1}{1 + \theta_i B(\lambda_i)}.\;}$$"

### 풀어 설명 — 결정적 식

**$\|u_{i,1}\|^2 \to \frac{1}{1+\theta_i B(\theta_i)}$**.

이게 바로 $\rho_i^2$ 의 극한!

**왜 $\rho_i^2$ 와 같은가?**: $u_{i,1}$ 은 신호 부공간 성분, $u_{i,2}$ 는 잡음 부공간 성분. 추정 요인과 참 요인의 상관계수 제곱 = 신호 부공간 비율 = $\|u_{i,1}\|^2$.

---

## 13.9 $\theta_i < \theta_{\text{crit}}$ 경우

> "Assume that $\theta_i < \theta_{\text{crit}}$, i.e. $\lambda_i I_{K+1} - \kappa_T(\lambda_i) = 0$ has no solution. It still holds
> $$u_{i,2}^\top u_{i,2} = u_{i,1}^\top \begin{pmatrix}\theta_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \theta_{K+1}\end{pmatrix} u_{i,1} \lim_{z \downarrow b} B(z)$$
> as $\lambda_i$ converges in probability to $b$. If $\lim_{z \downarrow b} B(z) = -\infty$, then $\|u_{i,1}\|^2 \xrightarrow{p} 0$ and
> $$u_{i,1}^\top = (0 \;\cdots\; 0).$$"

### 풀어 설명

**검출 실패 시**:
- $\|u_{i,1}\|^2 \to 0$.
- 즉 추정 고유벡터가 신호 공간과 무관 (모두 잡음 공간).
- → $\rho_i^2 \to 0$.

### 폭발 조건
> "All we need to show is that $\theta_i < \theta_{\text{crit}}$ implies $\lim_{z\downarrow b} B(z) = -\infty$."

**풀어 설명**: $B(z) \to -\infty$ 가 검출 실패의 조건.

Benaych-Georges & Nadakuditi (2011) 의 Theorem 2.3 증명 방식 사용:
$$
B(\lambda_i) = c \int \frac{z}{(\lambda_i - z)^2} d\tilde\phi_T(z) + o_p(1) \le O_p\!\left(\frac{1}{N}\right) \cdot \frac{1}{(\lambda_1(S_{22}) - \lambda_{K+1}(S_{22}))^2} + o_p(1) \le O_p\!\left(\frac{N^{1/3}}{\log(N)^2}\right)
$$

**풀어 설명**: 고유값 사이 간격이 충분히 천천히 줄어들면 $B \to -\infty$. ⇒ 폭발 조건 만족.

---

## 13.10 종합 — $\rho_i$ 형태

> **원문**: "We can now go back to the original problem: Define
> $$\rho_i = \begin{cases}\frac{1}{\sqrt{1 + \theta_i B(G^{-1}(\theta_i))}} & \text{if } \theta_i > \theta_{\text{crit}} \\ 0 & \text{otherwise}.\end{cases}$$"

### 정리

**최종 결과**:
- 검출 시: $\rho_i = \frac{1}{\sqrt{1 + \theta_i B(\hat\theta_i)}}$.
- 검출 실패: $\rho_i = 0$.

이게 Theorem 2 의 $\rho_i$ 식.

### 요인 추정량 형태

> "The estimator for the factors can now be written as
> $$\hat F = \sqrt T W^{-1} UVD_K^{1/2} = \sqrt T W^{-1} U_1 \begin{pmatrix}\rho_1 & 0 & \cdots & 0 \\ 0 & \rho_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \rho_K \\ 0 & 0 & \cdots & 0\end{pmatrix} D_K^{1/2}$$"

**풀어 설명**: $\hat F$ 는 신호 공간 사영 + $\rho_i$ 가중.

### 평균 추정

> "The calculation for $\widehat{\text{Corr}}(F, \hat F)$ is straightforward. Note that the mean can be estimated by
> $$\hat\mu_{\hat F} = \frac{1}{1+\tilde\gamma}\begin{pmatrix}O_K \;\; \mathbb{1}_K\end{pmatrix} \tilde U \begin{pmatrix}\rho_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \rho_K \\ 0 & \cdots & 0\end{pmatrix} D_K^{1/2}.$$"

**풀어 설명**: 추정 요인의 평균도 명시적 형태로 도출.

---

## 13.11 i.i.d. 잔차 케이스 — Marchenko-Pastur 명시 형태

> **원문**: "**Proof for i.i.d. residuals**: For the special case where $e_{t,i}$ i.i.d. $N(0, \sigma_e^2)$, i.e. $\Sigma = \sigma_e^2 I_N$, the matrix $\frac{1}{T}e^\top e$ follows the Marcenko-Pasteur law:
> $$d\phi(z) = \frac{1}{2\pi c \sigma_e^2 z}\sqrt{(b-z)(z-a)} \mathbb{1}_{\{z\in (a,b)\}} dz + \max(0, 1 - \tfrac{1}{c})\delta_0$$
> with $a = \sigma_e^2(1-\sqrt c)^2$ and $b = \sigma_e^2(1+\sqrt c)^2$. $a$ and $b$ are the smallest respectively largest eigenvalue."

### 풀어 설명

**Marchenko-Pastur 밀도 함수**:
- 지지 $[a, b]$ 에서 봉우리 모양.
- $c > 1$ 면 $0$ 에 추가 점질량 (랭크 부족).

### Cauchy transform 명시 형태

> "Calculations as outlined in Bai and Silverstein (2010) lead to
> $$G(z) = \frac{z - \sigma_e^2(1-c) - \sqrt{(z - \sigma_e^2(1+c))^2 - 4c\sigma_e^4}}{2cz\sigma_e^2}.$$
> Simple but tedious calculations show that
> $$G^{-1}(z) = \frac{z\sigma_e^2(1-c) + 1}{z - c\sigma_e^2 z^2}.$$"

**풀어 설명**: $G, G^{-1}$ 모두 닫힌 형태 — i.i.d. 잔차의 장점.

### Corollary 2 증명

> "**Proof of Corollary 2**: Plugging the eigenvalues and eigenvector formulas into Theorem 2 yields:
> $$\widehat{\text{Corr}}(F, \hat F) \xrightarrow{p} (1 \;\; 0) \tilde U \binom{\rho_1}{0} \hat\theta_1^{1/2} \widehat{\text{Var}}(\hat F)^{1/2}$$
> $$\widehat{\text{Var}}(\hat F) \xrightarrow{p} \hat\theta_1 (\tilde U_{1,1}^2 \|u_{1,1}\|^2 + \|u_{1,2}\|^2)$$
> $$\hat\mu^2 \xrightarrow{p} \frac{1}{1+\gamma}\tilde U_{1,2}^2 \rho_1 \hat\theta_1.$$
> The proof for the limit for $\gamma \to \infty$ is based on the insight that
> $$\lim_{\theta \to \infty} B(\theta)\theta^2 \to c\sigma_e^2.$$"

**풀어 설명**: 1-요인 케이스에서 Theorem 2 의 식을 구체적으로 푼 결과.

---

## 13.12 Lemma 2 증명

> **원문**: "**Lemma 2: Detection of weak factors**
> If $\gamma > -1$ and $\mu_F \neq 0$, then the first $K$ eigenvalues of $M_{\text{RP-PCA}}$ are strictly larger than the first $K$ eigenvalues of $M_{\text{PCA}}$, i.e.
> $$\theta_i^{\text{RP-PCA}} > \sigma_{F_i}^2 + c\sigma_e^2.$$
> For $\theta_i > \theta_{\text{crit}}$ it holds that
> $$\frac{\partial \hat\theta_i}{\partial \theta_i} > 0 \quad \frac{\partial \rho_i}{\partial \theta_i} > 0 \quad i = 1, \ldots, K.$$
> Thus, if $\gamma > -1$ and $\mu_F \neq 0$, then $\rho_i^{\text{RP-PCA}} > \rho_i^{\text{PCA}}$.
> **Proof of Lemma 2**: See result (12) on page 75 in Lütkepohl (1996) and straightforward calculations."

### 풀어 설명

**증명 핵심** (Lütkepohl 핸드북 + 단순 계산):

#### Step 1: 신호 비교
- $M_{\text{RP-PCA}}$ 의 신호 부분 = $\Sigma_F + (1+\gamma)\mu_F\mu_F^\top$ + 잡음.
- $M_{\text{PCA}}$ 의 신호 부분 = $\Sigma_F$ + 잡음.
- 차이 = $(1+\gamma)\mu_F\mu_F^\top$ (PSD).

#### Step 2: 고유값 monotone
- PSD 행렬을 더하면 고유값이 (적어도 같거나) 증가 (Weyl 부등식).
- $\mu_F \neq 0$ ⇒ rank 1 PSD 추가 ⇒ 일부 고유값 strict 증가.

#### Step 3: $\theta$ → $\rho$
- $\theta_i > \theta_{\text{crit}}$ 에서 $\rho_i$ 가 $\theta_i$ 의 strict 증가함수.
- → $\rho_i^{\text{RP-PCA}} > \rho_i^{\text{PCA}}$.

---

## 13.13 증명의 큰 그림 — 직관적 요약

### 한 문단 요약

**Theorem 2의 증명**:
1. **분해**: 데이터를 신호 공간 $U_1$ + 잡음 공간 $U_2$ 로 분해.
2. **트릭**: $T \times T$ 문제를 $(K+1) \times (K+1)$ 문제로 환원 (Schur complement).
3. **극한**: RMT (Benaych-Georges-Nadakuditi 2011) 의 기법으로 $\kappa_T(\lambda) \to \tilde U^\top M_{\text{RP-PCA}}\tilde U \cdot G(\lambda)$.
4. **고유값**: $G(\lambda) = 1/\theta_i$ 해의 존재가 phase transition 결정.
5. **고유벡터**: $\|u_{i,1}\|^2 \to 1/(1 + \theta_i B(\theta_i))$ 가 $\rho_i^2$.

### 핵심 통찰

**왜 평균을 더하면 신호가 커지나?**:
- $U_1$ 의 마지막 열에 $\mathbb{1}/\sqrt T$ (평균 방향) 포함.
- 신호 행렬에 $\mu_F$ 가 명시적으로 등장.
- 결과: $M_{\text{RP-PCA}}$ 가 $M_{\text{PCA}}$ 보다 큰 고유값을 가짐.

---

## 13.14 부록 B 핵심 정리

| 단계 | 결과 |
|------|------|
| 직교 분해 $U_1, U_2$ | 신호+평균 / 잡음 부분공간 |
| Schur complement | $T \times T \to (K+1)\times(K+1)$ |
| $\kappa_T(\lambda)$ 극한 | $\tilde U^\top M_{\text{RP-PCA}} \tilde U \cdot G(\lambda)$ |
| 고유값 위치 | $G(\lambda) = 1/\theta_i$ 의 해 |
| Phase transition | $\theta_{\text{crit}} = 1/G(b^+)$ |
| 고유벡터 노름 | $\|u_{i,1}\|^2 \to 1/(1+\theta_i B(\theta_i))$ |
| Lemma 2 | PSD 추가 → 신호 monotone 증가 |

### 한 줄로

> **Theorem 2의 증명은 RMT의 표준 기법을 평균 항이 포함되도록 확장한 것. 핵심은 직교 분해로 신호와 잡음 공간을 분리한 후, 신호 행렬의 고유값으로 추정 행동을 완전히 묘사한 것.**

다음 파일(**14_용어집_표기법.md**)에서는 **논문 전체에서 사용된 기호와 용어를 사전 형태로 정리**한다.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Theorem 2 증명의 가장 큰 트릭은?**
2. **직교 분해 $U_1, U_2$ 가 하는 역할?**
3. **$\rho_i^2 = 1/(1+\theta_i B(\theta_i))$ 가 도출되는 핵심 논리?**

### 답변
1. $T \times T$ 문제를 Schur complement로 $(K+1) \times (K+1)$ 문제 $\det(\lambda I - \kappa_T(\lambda)) = 0$ 으로 환원.
2. $U_1$ = 신호+평균 부공간 ($K+1$차원). $U_2$ = 잡음 부공간. 신호와 잡음을 직교로 분리해 분석 가능.
3. 고유벡터 $u_i$의 신호 공간 성분 노름 $\|u_{i,1}\|^2$ 이 $\rho_i^2$. $\|u_{i,1}\|^2 + \|u_{i,2}\|^2 = 1$ + $\|u_{i,2}\|^2 = \|u_{i,1}\|^2 \theta_i B(\lambda_i)$ 결합으로 도출.
