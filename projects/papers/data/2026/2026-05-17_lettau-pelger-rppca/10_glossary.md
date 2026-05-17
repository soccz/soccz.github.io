# 14. 용어집과 표기법 사전

이 파일은 논문 전체에서 등장하는 **모든 기호와 용어를 사전 형태**로 정리.

찾고 싶은 기호가 있으면 여기서 빠르게 찾아볼 수 있게 함.

---

## 14.1 기본 데이터 표기

| 기호 | 정의 | 크기 | 의미 |
|------|------|------|------|
| $X$ | 자산 초과수익 패널 | $T \times N$ | 모든 자산의 모든 시점 수익률 |
| $X_{t,i}$ | 자산 $i$의 시점 $t$ 수익률 | scalar | 패널의 한 원소 |
| $X_i$ | 자산 $i$의 시계열 | $T \times 1$ | 자산 $i$ 의 모든 시점 |
| $X_t$ | 시점 $t$의 모든 자산 | $1 \times N$ | 시점 $t$ 의 횡단면 |
| $\bar X$ | 자산별 시간 평균 | $1 \times N$ | $\frac{1}{T}\sum_t X_t$ |
| $\bar X_i$ | 자산 $i$의 시간 평균 | scalar | $\frac{1}{T}\sum_t X_{t,i}$ |

---

## 14.2 모델 구성요소

| 기호 | 정의 | 크기 | 의미 |
|------|------|------|------|
| $F$ | 잠재요인 시계열 | $T \times K$ | 숨은 요인들의 변동 |
| $F_t$ | 시점 $t$의 요인 | $1 \times K$ | 시점 $t$ 의 $K$ 요인 값 |
| $\Lambda$ | 요인 로딩 | $N \times K$ | 각 자산의 요인 민감도 |
| $\Lambda_i$ | 자산 $i$의 로딩 | $1 \times K$ | 자산 $i$의 $K$ 요인 민감도 |
| $e$ | 잔차 | $T \times N$ | 비체계적 부분 |
| $e_{t,i}$ | 자산 $i$ 시점 $t$ 잔차 | scalar | 한 원소 |
| $C$ | 공통성분 | $T \times N$ | $F\Lambda^\top$ |

---

## 14.3 차원 표기

| 기호 | 정의 | 의미 |
|------|------|------|
| $N$ | 자산 개수 | 횡단면 차원 (예: 370) |
| $T$ | 시간 길이 | 시계열 차원 (예: 650) |
| $K$ | 요인 개수 | 잠재요인 수 (예: 5) |
| $c$ | aspect ratio | $N/T$ |

---

## 14.4 모집단 모멘트

| 기호 | 정의 | 의미 |
|------|------|------|
| $E[F]$ | 요인의 기대값 | 위험 프리미엄 |
| $\mu_F = E[F]$ | 같은 의미 | $K \times 1$ 벡터 |
| $\Sigma_F = \text{Var}(F)$ | 요인 공분산 | $K \times K$ |
| $\sigma_{F_i}^2$ | $i$번째 요인 분산 | $\Sigma_F$ 대각원소 |
| $\sigma_e^2 = \text{trace}(\Sigma)/N$ | 평균 잡음 분산 | 잔차 평균 |
| $\Sigma$ | 잔차 공분산 | $N \times N$ |
| $\Sigma_\Lambda$ | 로딩 공분산 극한 | $\Lambda^\top\Lambda/N \to \Sigma_\Lambda$ (Strong) 또는 $\Lambda^\top\Lambda \to I_K$ (Weak) |

---

## 14.5 표본 모멘트

| 기호 | 정의 | 의미 |
|------|------|------|
| $\hat\mu_F = \frac{1}{T}\sum F_t$ | 표본 평균 | 요인 평균 추정 |
| $\hat\Sigma_F = \frac{1}{T}F_tF_t^\top$ | 표본 (비중심) 공분산 | 분산 추정 |
| $\bar X = \frac{1}{T}\sum_t X_t$ | 자산별 평균 | $1 \times N$ |

---

## 14.6 RP-PCA 추정량

| 기호 | 정의 | 의미 |
|------|------|------|
| $\gamma$ | RP weight | 핵심 튜닝 파라미터; $-1$이면 PCA |
| $\tilde\gamma = \sqrt{\gamma+1}-1$ | 변환된 $\gamma$ | 신호 행렬 표기용 |
| $\hat\Lambda$ | 추정 로딩 | RP-PCA 결과 |
| $\hat F$ | 추정 요인 | $X\hat\Lambda/N$ |
| $\hat C = \hat F\hat\Lambda^\top$ | 추정 공통성분 | 신호 부분 |
| $W^2 = I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top$ | 시간 가중 행렬 | $T \times T$ |
| $W = (W^2)^{1/2}$ | 가중 행렬의 제곱근 | 부록 B에서 사용 |
| $Q$ | 횡단면 가중 행렬 | 자산별 표준편차의 역 (상관행렬 트릭) |

---

## 14.7 식별과 회전

| 기호 | 정의 | 의미 |
|------|------|------|
| $H$ | 회전 행렬 (Strong) | 식별 모호성 해소 |
| $\tilde U$ | $M_{\text{RP-PCA}}$ 고유벡터 행렬 | 신호 행렬 대각화 |
| $\tilde Q, \tilde R$ | Theorem 2 회전 | $\gamma > -1$ 시 비단위 |
| $M_\Lambda = I_N - \Lambda(\Lambda^\top\Lambda)^{-1}\Lambda^\top$ | annihilator | $\Lambda$ 부분공간 소멸 |

---

## 14.8 RMT 도구 (Weak Factor)

| 기호 | 정의 | 의미 |
|------|------|------|
| $G(z)$ | Cauchy/Stieltjes transform | $\lim \frac{1}{N}\sum \frac{1}{z-\lambda_i}$ |
| $B(z)$ | $G$의 도함수 관련 | $\lim \frac{c}{N}\sum \frac{\lambda_i}{(z-\lambda_i)^2}$ |
| $G^{-1}$ | $G$의 역함수 | 고유값 위치 결정 |
| $a, b$ | bulk 지지의 끝값 | $b$ = 윗 끝 |
| $\theta_i$ | 신호 행렬 $M$ 의 $i$번째 고유값 | 모집단 신호 |
| $\hat\theta_i$ | 표본 고유값 | 추정 신호 |
| $\theta_{\text{crit}} = 1/G(b^+)$ | 검출 임계값 | Phase transition 경계 |
| $M_{\text{PCA}}$ | PCA 신호 행렬 | $\Sigma_F + c\sigma_e^2 I_K$ |
| $M_{\text{RP-PCA}}$ | RP-PCA 신호 행렬 | $(K+1) \times (K+1)$ 비대각 |

---

## 14.9 잡음과 신호 관련

| 기호 | 정의 | 의미 |
|------|------|------|
| $\Gamma_e$ | 노이즈-신호비 | $c\sigma_e^2/\sigma_F^2$ |
| $SR$ | 샤프 비율 | $\mu_F/\sigma_F$ |
| $\rho_i$ | 상관계수 | 추정-진짜 요인의 상관 |
| $\rho_i^2 = \frac{1}{1+\theta_i B(\theta_i)}$ | $\rho_i^2$의 극한 (검출 시) | 검출 정확도 |
| $\Phi(\theta_i) = B(\hat\theta_i(\theta_i))$ | Example 2 표기 | 1-요인 모델용 |
| $\Psi(\theta_i)$ | 동일 표기 | Corollary 2 |

---

## 14.10 점근 행동 표기

| 기호 | 의미 |
|------|------|
| $\xrightarrow{p}$ | 확률 수렴 (convergence in probability) |
| $\xrightarrow{d}$ | 분포 수렴 (convergence in distribution) |
| $\xrightarrow{D}$ | 동일 (분포 수렴) |
| $\overset{a.s.}{\to}$ | 거의 확실 수렴 |
| $O_p(\cdot)$ | 확률적 순서 (bounded in probability) |
| $o_p(\cdot)$ | 확률적 0 (converges to 0 in probability) |
| $\overset{i.i.d.}{\sim}$ | 독립동일분포 |

---

## 14.11 행렬 연산

| 기호 | 의미 |
|------|------|
| $A^\top$ | 전치 (transpose) |
| $A^{-1}$ | 역행렬 |
| $\text{trace}(A)$ | 대각원소 합 |
| $\det(A)$ | 행렬식 |
| $\|A\|$ | 노름 (보통 2-norm) |
| $\|A\|^2 = \text{trace}(A^\top A)$ | Frobenius 노름의 제곱 |
| $\otimes$ | Kronecker 곱 (논문에선 거의 안 씀) |
| $\delta_x$ | Dirac 측도 (점 질량) |
| $\phi_A(z)$ | 경험적 고유값 분포 |
| $\mathbb{1}$ | 모든 원소 1인 벡터 |
| $I_K$ | $K$차원 단위행렬 |

---

## 14.12 평가 지표 (실증)

| 기호 | 정의 | 의미 |
|------|------|------|
| SR | Maximum Sharpe-ratio | 요인의 최적 선형결합 SR |
| RMS α | $\sqrt{\frac{1}{N}\sum \alpha_i^2}$ | 횡단면 가격결정오차 |
| α_i | 시계열 회귀 절편 | 자산 $i$의 가격결정오차 |
| Idio Var | 잔차 평균 분산 | 변동 설명력 (작을수록 좋음) |
| OOS | Out-of-sample | 표본 외 |
| IS | In-sample | 표본 내 |

---

## 14.13 가정 표기

| 기호 | 의미 |
|------|------|
| Assumption 1 | Strong Factor Model 가정 (A-F) |
| Assumption 2 | Weak Factor Model 가정 (A-D) |
| 1.A — 1.F | Strong 가정의 6개 서브 |
| 2.A — 2.D | Weak 가정의 4개 서브 |

---

## 14.14 용어 사전 (영어 → 한국어)

| 영어 | 한국어 | 설명 |
|------|--------|------|
| Latent factor | 잠재요인 | 직접 관측 안 되는 숨은 요인 |
| Asset pricing | 자산가격결정 | 자산의 평균 수익을 설명 |
| Approximate factor model | 근사 요인 모델 | 잔차 약상관 허용 |
| APT | 차익거래가격결정이론 | Ross 1976 |
| SDF | 확률적 할인요인 | 자산가격결정의 핵심 객체 |
| Sharpe-ratio | 샤프 비율 | 위험 단위당 수익 |
| Risk-premium | 위험 프리미엄 | $\mu_F$ |
| Pricing error | 가격결정오차 | α |
| Anomaly | 이상현상 | CAPM 미설명 패턴 |
| Decile portfolio | 10분위 포트폴리오 | anomaly별 10그룹 |
| Spurious factor | 가짜 요인 | 우연히 평균만 맞는 요인 |
| Phase transition | 상전이 | 임계값 넘느냐의 갈림 |
| Marchenko-Pastur law | 마르첸코-파스튀르 법 | 큰 랜덤행렬 고유값 분포 |
| Spiked covariance | 뾰족한 공분산 | bulk + spike 분리 |
| Bulk spectrum | 군집 스펙트럼 | 잡음 고유값 군집 |
| Spike | 뾰족 | 신호 고유값 |
| Stieltjes transform | 스틸쳬스 변환 | 고유값 분포 변환 도구 |
| Cauchy transform | 코시 변환 | Stieltjes와 동의어 |
| Random Matrix Theory (RMT) | 랜덤 행렬 이론 | 큰 랜덤행렬 점근이론 |
| Eigenvalue | 고유값 | 행렬의 "강도" |
| Eigenvector | 고유벡터 | 그 강도의 방향 |
| Idiosyncratic | 특이한, 개별적 | 잔차의 특성 |
| Systematic | 체계적 | 요인의 특성 |
| Common component | 공통 성분 | $F\Lambda^\top$ |
| Loading | 로딩, 노출도 | $\Lambda_i$ |
| Annihilator | 소멸자 | $M_\Lambda$ |
| Consistency | 일관성 | 정답으로 수렴 |
| Asymptotic distribution | 점근분포 | 큰 표본에서의 분포 |
| Penalty term | 페널티 항 | 정규화 |
| Cross-sectional | 횡단면 | 자산 간 |
| Time-series | 시계열 | 시간 변동 |
| In-sample | 표본 내 | 학습 기간 |
| Out-of-sample | 표본 외 | 평가 기간 |
| Rolling window | 롤링 윈도우 | 이동 표본 |
| Demean | 평균 빼기 | 중심화 |
| Identifiability | 식별 가능성 | 추정 모호성 |
| Rotation | 회전 | 식별 모호성 처리 |
| GMM | 일반화 적률법 | 모멘트 조건 결합 추정 |
| Moment condition | 모멘트 조건 | $E[g(X, \theta)] = 0$ |
| Efficient | 효율적 | 작은 분산 |
| Robust | 견고한 | 가정 위반에 강함 |

---

## 14.15 자주 등장하는 행렬 — 한눈에

### 데이터 관련
- $X$ ($T \times N$): 수익률 패널
- $X^\top X$ ($N \times N$): "2차 모멘트" 행렬

### 추정 대상
- $\frac{1}{T}X^\top X$: 표준 PCA 적용 행렬 (평균 미포함)
- $\frac{1}{T}X^\top X - \bar X\bar X^\top$: 표본 공분산 ($\gamma = -1$ PCA)
- $\frac{1}{T}X^\top X + \gamma\bar X\bar X^\top$: **RP-PCA의 핵심 행렬**

### 가중
- $W^2 = I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top$: 시간 가중
- $Q$ = diag$(\sigma_i^{-1})$: 횡단면 가중

### 신호 행렬 (Weak factor)
- $M_{\text{PCA}}$ ($K \times K$): $\Sigma_F + c\sigma_e^2 I_K$
- $M_{\text{RP-PCA}}$ ($(K+1) \times (K+1)$): 위 + 평균 항

---

## 14.16 자주 등장하는 한계식 — 한눈에

### Strong factor 점근
$$\sqrt T (H^\top \hat\Lambda_i - \Lambda_i) \xrightarrow{d} N(0, \Phi_i)$$
$$\Phi_i = (\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1} (\Omega_{11,i} + \gamma\mu_F\Omega_{21,i} + \gamma\Omega_{12,i}\mu_F + \gamma^2 \mu_F\Omega_{22,i}\mu_F^\top)(\Sigma_F + (\gamma+1)\mu_F\mu_F^\top)^{-1}$$

### Weak factor 고유값
$$\hat\theta_i \xrightarrow{p} \begin{cases}G^{-1}(1/\theta_i) & \theta_i > \theta_{\text{crit}} \\ b & \text{otherwise}\end{cases}$$

### Weak factor 상관계수
$$\rho_i^2 \xrightarrow{p} \begin{cases}\frac{1}{1+\theta_i B(\theta_i)} & \theta_i > \theta_{\text{crit}} \\ 0 & \text{otherwise}\end{cases}$$

### RP-PCA의 분해 행렬 수렴
$$\frac{1}{T}X^\top X + \gamma\bar X\bar X^\top \to \Lambda(\Sigma_F + (1+\gamma)\mu_F\mu_F^\top)\Lambda^\top + \text{Var}(e)$$

### One-factor $\gamma \to \infty$
$$\widehat{\text{Corr}}^2(F,\hat F) \to \frac{1}{1+\Gamma_e + \Gamma_e^2/SR^2}$$

### i.i.d. 잔차 임계값
$$\theta_{\text{crit}} = \sigma_e^2(c + \sqrt c)$$

---

## 14.17 잘 헷갈리는 것들 — 주의 사항

### $\gamma$ vs $\tilde\gamma$
- $\gamma$: RP weight, $\in [-1, \infty)$
- $\tilde\gamma = \sqrt{\gamma+1} - 1$: 신호 행렬 표기용
- 관계: $(1+\tilde\gamma)^2 = 1+\gamma$
- 둘 다 $\gamma = -1$ 에서 $-1$

### Strong vs Weak 정규화
- Strong: $\Lambda^\top\Lambda/N \to \Sigma_\Lambda$ (분모 $N$)
- Weak: $\Lambda^\top\Lambda \to I_K$ (분모 없음)
- → Weak 케이스에서 로딩이 $O(1/\sqrt N)$ 으로 작음

### PCA 행렬의 두 형태
- 평균 포함: $\frac{1}{T}X^\top X$
- 평균 제외: $\frac{1}{T}X^\top X - \bar X\bar X^\top$ (표본 공분산)
- $\gamma = -1$ RP-PCA = $\frac{1}{T}X^\top X - \bar X\bar X^\top$ (= 평균 제외)

### Theorem 1 vs Bai (2003) 회전
- Bai: $\sqrt T (\Lambda_i - H^{\top-1}\hat\Lambda_i)$
- 본 논문: $\sqrt T (H^\top \hat\Lambda_i - \Lambda_i)$
- 같은 결과지만 표기 다름

### $\rho_i$ 와 $\hat\theta_i$ 의 관계
- $\hat\theta_i = G^{-1}(1/\theta_i)$ (검출 시)
- $\rho_i^2 = \frac{1}{1 + \theta_i B(\hat\theta_i)} = \frac{1}{1 + \theta_i B(G^{-1}(1/\theta_i))}$

---

## 14.18 마무리

이 해설집은 총 15개 파일로 구성:

| 파일 | 내용 |
|------|------|
| 00 | 시작하기 전에 |
| 01 | 제목과 초록 |
| 02 | Section 1 (도입) |
| 03 | Section 2 (요인 모델) |
| 04 | Section 3 전반 (RP-PCA 정의) |
| 05 | Section 3 후반 (4가지 해석) |
| 06 | Section 4 (강한 요인 모델) |
| 07 | Section 5 전반 (RMT 기초) |
| 08 | Section 5 중반 (Theorem 2) |
| 09 | Section 5 후반 (예제) |
| 10 | Section 6 (시뮬레이션) |
| 11 | Section 7 (실증) |
| 12 | Section 8 (결론) |
| 13 | Appendix B (증명) |
| 14 | 용어집 (이 파일) |

원하는 부분을 골라서 읽으면 됨. 차례대로 읽어도 됨.

논문 원문에 충실하면서도, **모든 수식과 개념을 빠짐없이** 다뤘다.

이해 안 되는 부분 있으면 해당 파일로 돌아가 다시 읽기.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **$\gamma$ 와 $\tilde\gamma$ 의 관계?**
2. **Strong vs Weak factor 로딩 정규화 차이?**
3. **RP-PCA 행렬의 한 줄 표기?**

### 답변
1. $\tilde\gamma = \sqrt{\gamma+1} - 1$. 즉 $(1+\tilde\gamma)^2 = 1+\gamma$. 신호 행렬 표기 편의용.
2. Strong: $\Lambda^\top\Lambda / N \to \Sigma_\Lambda$ ($N$으로 나눔). Weak: $\Lambda^\top\Lambda \to I_K$ (나눔 없음, 로딩이 $1/\sqrt N$ 스케일).
3. $\frac{1}{T}X^\top X + \gamma \bar X\bar X^\top$ — 분해 대상 행렬. $\gamma=-1$이면 표본 공분산 (= 표준 PCA).
