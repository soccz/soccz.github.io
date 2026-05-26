# 04. Section 3 전반 — 목적함수와 RP-PCA의 정의

> **🧒 한 줄 요약**: RP-PCA objective. Variance + γ×|risk_premium|².


논문 5쪽 ~ 7쪽 (Section 3 앞부분)을 풀어본다.

---

## 4.1 도입부 — 표기 약속

> **원문**: "This section explains the relationship between our estimator and the objective function that is minimized. We introduce the following notation: $\mathbb{1}$ is a vector $T \times 1$ of 1's and thus $F^\top \mathbb{1}/T$ is the sample mean estimator of $F$. The projection matrix $M_\Lambda = I_N - \Lambda(\Lambda^\top \Lambda)^{-1}\Lambda^\top$ annihilates the $K$-dimensional vector space spanned by $\Lambda$. $I_N$ and $I_T$ denote the $N$- respectively $T$-dimensional identity matrix."

**풀어 설명**: 새 기호들 정의.

| 기호 | 의미 | 크기 | 비유 |
|------|------|------|------|
| $\mathbb{1}$ | 모든 원소가 1인 열벡터 | $T \times 1$ | "전부 1로 채운 막대" |
| $F^\top \mathbb{1}/T$ | $F$의 표본 평균 | $K \times 1$ | "K개 요인 각각의 시간 평균" |
| $M_\Lambda$ | 로딩의 annihilator (소멸자) | $N \times N$ | "$\Lambda$ 방향을 0으로 만드는 도구" |
| $I_N$ | $N$차원 단위행렬 | $N \times N$ | "대각선만 1" |
| $I_T$ | $T$차원 단위행렬 | $T \times T$ | 같음 |

### "Annihilator (소멸자)"가 뭔가?
$M_\Lambda = I_N - \Lambda(\Lambda^\top \Lambda)^{-1}\Lambda^\top$ 이라는 행렬은:
- $M_\Lambda \Lambda = 0$ (즉 $\Lambda$ 방향을 다 죽임)
- 임의의 벡터 $v$에 곱하면, $\Lambda$와 직교하는 부분만 남음.

**비유**: $\Lambda$가 "북쪽 방향"이라면, $M_\Lambda$는 "북쪽 성분만 떼어내는 필터". 결과는 동/서 성분만 남는다.

**왜 이걸 쓰나?**: PCA에서 "잔차 = 데이터 - 로딩 설명 부분" 을 깔끔하게 적기 위해.

---

## 4.2 표준 PCA의 목적함수 — 정식 유도

> **원문**: "The objective function of conventional statistical factor analysis is to minimize the sum of squared errors for the cross-section and time dimension, i.e. the estimator $\hat\Lambda$ and $\hat F$ are chosen to minimize the unexplained variance. This variation objective function is"

$$
\boxed{\;
\min_{\Lambda, F} \frac{1}{NT} \sum_{i=1}^N \sum_{t=1}^T (X_{ti} - F_t \Lambda_i^\top)^2
= \min_\Lambda \frac{1}{NT} \text{trace}((XM_\Lambda)^\top (XM_\Lambda))
\quad \text{s.t. } F = X(\Lambda^\top \Lambda)^{-1}\Lambda^\top.
\;}
$$

### 식을 풀어 보자

**왼쪽**: 잔차 제곱합 (모든 자산, 모든 시점). 가장 직관적인 형태.

**오른쪽**: trace 형태. 이걸 어떻게 얻었는지 단계별로 풀면:

#### Step 1: 잔차 행렬
$X - F\Lambda^\top$ 이 잔차 행렬 ($T \times N$).

#### Step 2: $F$를 $\Lambda$로 표현
$F$ 최적화부터 풀면 (1차 조건): **정확한 식은 $F = X\Lambda(\Lambda^\top\Lambda)^{-1}$** (논문 p.5에 적힌 $F = X(\Lambda^\top\Lambda)^{-1}\Lambda^\top$ 는 차원이 맞지 않는 원문 표기 오류 — p.6의 $\hat F = X\hat\Lambda(\hat\Lambda^\top\hat\Lambda)^{-1}$ 형태가 정확).

잔차는:
$$
X - F\Lambda^\top = X - X\Lambda(\Lambda^\top\Lambda)^{-1}\Lambda^\top = X(I_N - \Lambda(\Lambda^\top\Lambda)^{-1}\Lambda^\top) = X M_\Lambda
$$

→ **잔차 = $XM_\Lambda$**.

#### Step 3: 제곱합 = trace
$$
\sum_{i,t} (X_{ti} - F_t\Lambda_i^\top)^2 = \text{trace}((XM_\Lambda)^\top (XM_\Lambda))
$$
(이건 행렬의 Frobenius norm = trace($A^\top A$) 공식 사용)

---

## 4.3 PCA 해의 형태

> **원문**: "The second formulation makes use of the fact that in a large panel data set the factors can be estimated by a regression of the assets on the loadings, $F = X(\Lambda^\top\Lambda)^{-1}\Lambda^\top$, and hence the residuals equal $X - F\Lambda^\top = XM_\Lambda$."

**풀어 설명**: $F$를 회귀로 얻는다는 사실 사용.

> "This is equivalent to choosing $\hat\Lambda$ proportional to the eigenvectors of the first $K$ largest eigenvalues of $\frac{1}{NT}X^\top X$."

**풀어 설명**:
- $\frac{1}{NT}X^\top X$의 상위 $K$ 고유벡터 = $\hat\Lambda$ (비례 상수까지)
- 표준 PCA 해법.

### 각주 7 — 정규화
> "Factor models are only identified up to invertible transformations. Therefore there is no loss of generality to assume that the loadings are orthonormal vectors and that the inner product of factors is a diagonal matrix."

**풀어 설명**: 식별이 회전까지만 가능 → 로딩을 정규직교 벡터로, 요인 내적을 대각행렬로 정규화해도 일반성 안 깨짐.

### 평균 처리
> "In most applications the data is first demeaned, which means that the estimator applies PCA to the estimated covariance matrix of $X$. Thus $\hat\Lambda$ is proportional to the eigenvectors of the first $K$ largest eigenvalues of $\frac{1}{NT}X^\top (I_T - \mathbb{1}\mathbb{1}^\top/T) X$."

**풀어 설명**:
- 보통 데이터를 demean (= 평균 빼기) 후 PCA.
- 이 경우: $\frac{1}{NT}X^\top (I_T - \frac{\mathbb{1}\mathbb{1}^\top}{T}) X$ = 공분산 행렬.

**왜 $(I_T - \mathbb{1}\mathbb{1}^\top/T)$인가?**: 이게 "평균을 빼는 행렬". $X$의 각 열 평균을 빼고 남은 변동만 봄.

**즉** $X^\top (I - \mathbb{1}\mathbb{1}^\top/T) X = X^\top X - T \bar X \bar X^\top$. 정규화하면 표본 공분산.

---

## 4.4 APT가 주는 새 목적함수 — 가격결정오차

> **원문**: "Arbitrage-pricing theory predicts that the factors should price the cross-section of expected excess returns. This yields a pricing objective function which minimizes the cross-sectional pricing error:"

$$
\boxed{\;
\frac{1}{N} \sum_{i=1}^N \left( \frac{1}{T} X_i^\top \mathbb{1} - \frac{1}{T} F_i^\top \mathbb{1} \Lambda_i^\top \right)^2
= \frac{1}{N} \text{trace}\!\left( \left(\frac{1}{T}\mathbb{1}^\top X M_\Lambda\right) \left(\frac{1}{T}\mathbb{1}^\top X M_\Lambda\right)^\top \right)
\;}
$$

### 풀이

**왼쪽**: 자산 $i$에 대해
- $\frac{1}{T} X_i^\top \mathbb{1}$ = 자산 $i$의 시간 평균 ("$X_i$의 평균")
- $\frac{1}{T} F^\top \mathbb{1} \Lambda_i^\top$ = "요인 평균 × 자산 $i$의 로딩" = APT가 예측하는 평균
- 차이의 제곱 = **자산 $i$의 가격결정오차 제곱**

→ 모든 자산에 대해 평균 = **횡단면 가격결정오차의 평균**.

**오른쪽**: 같은 표현의 trace 형태.

### "가격결정오차"의 의미
APT에 따르면 $E[X_i] = \Lambda_i E[F]$. 그런데 추정한 $\hat\Lambda_i \hat E[F]$ 와 실제 $\bar X_i$ 가 다를 수 있다. 그 차이가 **α (알파)** 또는 **pricing error**.

**비유**: "공부 시간 × 한 시간당 향상 효과"로 점수를 예측했는데, 실제 평균 점수와 다르면 "공부 시간 외 다른 효과"가 있다는 신호.

---

## 4.5 두 목적함수를 결합 — RP-PCA의 정식 정의

> **원문**: "We propose to combine these two objective functions with the risk-premium weight $\gamma$. The idea is to obtain statistical factors that explain the co-movement in the data and produce small pricing errors:"

$$
\boxed{\;
\min_{\Lambda, F} \frac{1}{NT} \text{trace}\!\left( (XM_\Lambda)^\top (XM_\Lambda) \right)
+ \gamma \cdot \frac{1}{NT} \text{trace}\!\left( \left(\frac{1}{T}\mathbb{1}^\top X M_\Lambda\right) \left(\frac{1}{T}\mathbb{1}^\top X M_\Lambda\right)^\top \right)
\;}
$$

이걸 정리하면 (논문 page 6 식):

$$
\boxed{\;
\min_\Lambda \frac{1}{NT} \text{trace}\!\left( M_\Lambda X^\top \left( I_T + \frac{\gamma}{T} \mathbb{1}\mathbb{1}^\top \right) X M_\Lambda \right)
\quad \text{s.t. } F = X(\Lambda^\top\Lambda)^{-1}\Lambda^\top
\;}
$$

### 풀이 — 어떻게 이렇게 합쳐졌나?

핵심 관찰: $\frac{1}{T}\mathbb{1}^\top X$ 는 **자산별 시간 평균**의 행벡터.
$$
\left(\frac{1}{T}\mathbb{1}^\top X\right)\left(\frac{1}{T}\mathbb{1}^\top X\right)^\top = \frac{1}{T^2}\mathbb{1}^\top X X^\top \mathbb{1}
$$
이건 스칼라. 그러나 trace 안에서 이걸 변형해 행렬로 만들면:

$$
\text{trace}(\cdot) = \frac{1}{T^2} \mathbb{1}^\top X M_\Lambda M_\Lambda^\top X^\top \mathbb{1}
= \frac{1}{T^2} \text{trace}(M_\Lambda^\top X^\top \mathbb{1}\mathbb{1}^\top X M_\Lambda)
$$

(왜냐하면 trace 안에서 cyclic permutation 가능, 그리고 $M_\Lambda$는 idempotent)

따라서 두 목적함수 합:
$$
\frac{1}{NT}\text{trace}(M_\Lambda X^\top X M_\Lambda) + \frac{\gamma}{NT} \cdot \frac{1}{T} \text{trace}(M_\Lambda^\top X^\top \mathbb{1}\mathbb{1}^\top X M_\Lambda)
$$
$$
= \frac{1}{NT}\text{trace}\!\left( M_\Lambda X^\top \left( I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top \right) X M_\Lambda \right)
$$

→ **표준 PCA의 $X^\top X$를 $X^\top (I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X$로 바꾸기만 했다!**

---

## 4.6 RP-PCA의 해 — 어느 행렬에 PCA?

> **원문**: "The objective function is minimized by the eigenvectors of the largest eigenvalues of $\frac{1}{NT} X^\top (I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X$."

**풀어 설명**:
- 변형된 행렬 $\frac{1}{NT} X^\top (I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X$ 의 상위 $K$ 고유벡터 = 로딩.

> "Hence the factors and loadings can be obtained by applying PCA to this new matrix."

**풀어 설명**: 표준 PCA 방법으로 풀 수 있다 — 단지 행렬을 바꿔서.

### 행렬의 의미 풀이

$X^\top \left( I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top \right) X = X^\top X + \frac{\gamma}{T} X^\top \mathbb{1}\mathbb{1}^\top X$

여기서 $X^\top \mathbb{1} = T \bar X^\top$ (자산별 평균 × T)이므로
$$\frac{1}{T} X^\top \mathbb{1}\mathbb{1}^\top X = T \bar X \bar X^\top$$
(주의: 표기상 $\bar X$를 어떻게 잡느냐에 따라 약간 다름. 논문에서는 평균을 행벡터로 보면 $\frac{1}{T}\mathbb{1}^\top X$가 그것.)

따라서:
$$
\frac{1}{NT} X^\top \left( I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top \right) X = \frac{1}{NT}(X^\top X + \gamma T \bar X \bar X^\top)
$$

논문 Section 2에서 본 형태와 같음 (스케일 차이만): 핵심은
$$
\boxed{\;\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top\;}
$$

---

## 4.7 추정 절차 정리

> **원문**: "The estimator for the loadings $\hat\Lambda$ are the eigenvectors of the first $K$ eigenvalues of $\frac{1}{NT}X^\top(I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X$ multiplied by $\sqrt{N}$. $\hat F$ are $\frac{1}{N}X\hat\Lambda$. The estimator for the common component is simply $\hat C = \hat F \hat\Lambda^\top$. The estimator simplifies to PCA of the covariance matrix for $\gamma = -1$."

### 단계별 절차

**Step 1**: 변형된 행렬 계산
$$M = \frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$$

**Step 2**: $M$의 고유분해. 상위 $K$ 고유값과 고유벡터 추출.

**Step 3**: $\hat\Lambda$ = 고유벡터 × $\sqrt N$ (정규화).

**Step 4**: $\hat F = \frac{1}{N} X \hat\Lambda$ (요인은 회귀로 얻음).

**Step 5**: $\hat C = \hat F \hat\Lambda^\top$ ("공통 부분" 복원).

**특수 케이스**: $\gamma = -1$ → 표준 PCA (공분산 행렬에 적용).

### 구현 난이도
**매우 쉽다**. 두 줄 코드:
```python
M = X.T @ X / T + gamma * mean_X.T @ mean_X
eigvals, eigvecs = np.linalg.eigh(M)
Lambda_hat = eigvecs[:, -K:] * np.sqrt(N)
F_hat = X @ Lambda_hat / N
```

표준 PCA와 계산 비용 동일.

---

## 4.8 상관행렬 트릭 — Q 가중

> **원문**: "In practice conventional PCA is often applied to the correlation instead of the covariance matrix. This implies that the returns are demeaned and normalized by their standard-deviation before applying PCA to their inner product."

**풀어 설명**: 실무에서는 공분산 대신 **상관행렬**에 PCA 적용이 흔함.
- "상관행렬 = 표준편차로 정규화한 공분산"
- 단위가 다른 자산들을 비교할 때 필수.

> "From a statistical perspective this is equivalent to applying a cross-sectional weighting matrix to the panel data."

**풀어 설명**: 통계적으로 = 횡단면 가중행렬 $Q$ 적용과 동치.

### $Q$ 가중행렬

$Q$ = 자산별 표준편차의 역수 대각행렬 (각 자산 신호를 표준화).

가중 목적함수:
$$
\min_{\Lambda, F} \frac{1}{NT} \text{trace}\!\left( Q^\top (X - F\Lambda^\top)^\top (X - F\Lambda^\top) Q \right)
+ \gamma \cdot \frac{1}{N}\text{trace}\!\left( \mathbb{1}^\top (X - F\Lambda^\top) Q Q^\top (X - F\Lambda^\top)^\top \mathbb{1} \right)
$$

이걸 정리하면:
$$
\boxed{\;
\min_\Lambda \text{trace}\!\left( M_\Lambda Q^\top X^\top \left( I + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top \right) X Q M_\Lambda \right)
\;}
$$

### 해법
> "Therefore factors and loadings can be estimated by applying PCA to $Q^\top X^\top (I + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X Q$."

**풀어 설명**: 위 행렬에 PCA 적용. 단, 추정 고유벡터에 $Q^{-1}$ 곱해서 원래 좌표로 돌려놓음.

> "In our empirical application we only consider the weighting matrix $Q$ which is the inverse of a diagonal matrix of standard deviations of each return. For $\gamma = -1$ this corresponds to using a correlation matrix instead of a covariance matrix for PCA."

**풀어 설명**:
- 실증에서 $Q$ = 자산별 표준편차의 역수 대각.
- $\gamma = -1$이면 표준 상관행렬 PCA.

**왜 이걸 쓰나?**:
- 변동성이 큰 자산이 분석을 지배하지 않도록.
- noisy한 자산의 영향 축소.

---

## 4.9 Section 3 전반 핵심 정리

| 항목 | 내용 |
|------|------|
| 표준 PCA 목적함수 | $\min \frac{1}{NT}\text{trace}((XM_\Lambda)^\top XM_\Lambda)$ |
| 가격결정오차 목적함수 | $\min \frac{1}{N}\text{trace}((\frac{1}{T}\mathbb{1}^\top XM_\Lambda)(\frac{1}{T}\mathbb{1}^\top XM_\Lambda)^\top)$ |
| RP-PCA 목적함수 (결합) | $\min \frac{1}{NT}\text{trace}(M_\Lambda X^\top (I + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X M_\Lambda)$ |
| 분해 대상 행렬 | $\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ |
| $\gamma = -1$ | 표준 PCA |
| $\gamma > -1$ | RP-PCA (평균 정보 활용) |
| $\gamma \to \infty$ | 가격결정오차 위주 |
| Q 가중 | 상관행렬 PCA와 동치, 변동성 큰 자산 영향 축소 |

다음 파일(**05_RP-PCA의_4가지_해석_Section3_후반.md**)에서는 **이 목적함수를 4가지 시각으로 해석**한다.

---


---

## 인터랙티브 시각화

```viz:rppca-signal-strengthening:title=RP-PCA의 핵심 원리 — 신호 강화;caption=γ를 키우면 분산이 작은 weak factor 들의 신호가 평균(SR×√σ²_F) 만큼 끌어올려진다. 4번째 요인이 임계값 위로 올라가는지 관찰.
```

## 자기점검 (이 챕터)

### 핵심 3가지
1. **RP-PCA가 PCA를 적용하는 변형된 행렬은?**
2. **$\gamma = -1, 0, \infty$ 각각이 의미하는 것은?**
3. **Q 가중행렬(상관행렬 트릭)의 역할은?**

### 답변
1. $\frac{1}{T}X^\top X + \gamma \bar X \bar X^\top$ — 2차 모멘트 + γ 가중 평균 외적.
2. $\gamma=-1$: 평균 빼는 효과 = 표준 PCA. $\gamma=0$: 분산과 평균제곱 동등 가중. $\gamma\to\infty$: 가격결정 오차 우선.
3. 자산별 표준편차의 역수 대각행렬 적용 → 변동성 큰 자산이 분석을 지배하지 않게 함. $\gamma=-1$에선 상관행렬 PCA와 동치.


```viz:lettau-gamma-sweep:title=paper Fig 3 — γ Sweep,caption=γ selector.
```
