# 09. Section 5 후반 — 예제들 (Example 2, 3 + Corollaries)

논문 16쪽 ~ 18쪽 (Section 5.3 전체)을 풀어본다.

추상적인 Theorem 2 를 **구체적 두 예시**로 직관 잡기.

---

## 9.1 Example 2 — One-Factor Model

> **원문**: "**Example 2: One-factor model**
> Assume that there is only one factor, i.e. $K = 1$. We introduce the following notation
> - Noise-to-signal ratio: $\Gamma_e = c\sigma_e^2/\sigma_F^2$
> - Sharpe-ratio: $SR = \mu_F/\sigma_F$
> - $\Phi(\theta_i) := B(\hat\theta_i(\theta_i))$."

### 풀어 설명

**가장 단순한 케이스**: 요인이 1개뿐.

### 새 표기
- $\Gamma_e$ (잡음-신호비): 잡음 분산 / 요인 분산. **클수록 잡음 많음**.
- $SR$ (샤프 비율): 요인의 평균 / 표준편차. **클수록 위험대비 수익 좋음**.
- $\Phi(\theta_i) = B(\hat\theta_i(\theta_i))$: $B$ 함수를 추정 고유값에서 평가.

### 신호 행렬 (단순화)

> "The signal matrix $M_{\text{RP-PCA}}$ simplifies to
> $$M_{\text{RP-PCA}} = \sigma_F^2 \begin{pmatrix}1+\Gamma_e & SR\sqrt{1+\gamma} \\ SR\sqrt{1+\gamma} & (SR^2 + \Gamma_e)(1+\gamma)\end{pmatrix}$$"

### 풀이

**$K=1$ 일 때 $M_{\text{RP-PCA}}$ 는 $2 \times 2$ 행렬**:
- 좌상: $\sigma_F^2 (1+\Gamma_e) = \sigma_F^2 + c\sigma_e^2$ (PCA 신호)
- 우상: $\sigma_F^2 \cdot SR \sqrt{1+\gamma} = \sigma_F^2 \cdot \frac{\mu_F}{\sigma_F}\sqrt{1+\gamma} = \sigma_F \mu_F \sqrt{1+\gamma}$
- 좌하: 같음
- 우하: $\sigma_F^2 (SR^2 + \Gamma_e)(1+\gamma) = (1+\gamma)(\mu_F^2 + c\sigma_e^2)$

→ Section 5.2의 일반식과 일치 확인.

### 최대 고유값

> "and has the largest eigenvalue:
> $$\theta = \tfrac{1}{2}\sigma_F^2 \Bigl(1 + \Gamma_e + (SR^2+\Gamma_e)(1+\gamma) + \sqrt{(1+\Gamma_e + (SR^2+\Gamma_e)(1+\gamma))^2 - 4(1+\gamma)\Gamma_e(1 + SR^2 + \Gamma_e)}\Bigr)$$"

### 풀이

**$2 \times 2$ 행렬의 큰 고유값** = $\frac{1}{2}(\text{trace} + \sqrt{\text{trace}^2 - 4\det})$.

복잡해 보이지만 본질은:
- trace = $\sigma_F^2(1+\Gamma_e) + \sigma_F^2(SR^2+\Gamma_e)(1+\gamma)$
- det = $\sigma_F^4 \cdot [(1+\Gamma_e)(SR^2+\Gamma_e)(1+\gamma) - SR^2(1+\gamma)]$
- 평방근 안: trace² - 4det

**$\gamma$ 의 효과**: $\gamma$ 클수록 trace와 det 모두 변함, 결과적으로 $\theta$ 증가.

---

## 9.2 Corollary 2 — One-Factor 결과

> **원문**: "**Corollary 2: One-factor model**
> Assume Assumption 2 holds and $K=1$. The correlation between the estimated and true factor has the following limit:
> $$\widehat{\text{Corr}}(F,\hat F)^2 \xrightarrow{p} \frac{1}{1 + \theta\Psi(\theta)\!\left(\frac{(\frac{\theta}{\sigma_F^2} - (1+\Gamma_e))^2}{SR^2(1+\gamma)} + 1\right)}$$
> and the estimated Sharpe-ratio converges to
> $$\widehat{SR} \xrightarrow{p} \frac{\frac{\theta}{\sigma_F^2} - (1+\Gamma_e)}{SR(1+\gamma)} \widehat{\text{Corr}}(F, \hat F)$$"

### 풀어 설명

**1번째 식 (상관계수)**:
- 분자 1: 완벽 추정이면 1
- 분모의 추가 항: 신호 크기, 잡음, 샤프 비율, $\gamma$ 모두 들어감
- 분모가 1에 가까울수록 상관계수 1에 가까움 = 완벽 추정.

**2번째 식 (샤프 비율 추정)**:
- 추정 샤프 비율은 진짜 샤프 비율과 상관계수의 곱 형태.
- 상관계수 작으면 SR 추정도 작음.

### $\gamma \to \infty$ 극한 — ★ 발표 핵심 인사이트

> "For $\gamma \to \infty$ these limits converge to
> $$\widehat{\text{Corr}}(F,\hat F)^2 \xrightarrow{p} \frac{1}{1 + \Gamma_e + \frac{\Gamma_e^2}{SR^2}}$$
> $$\widehat{SR} \xrightarrow{p} (SR + \frac{\Gamma_e}{SR})\frac{1}{\sqrt{1 + \Gamma_e + \frac{\Gamma_e^2}{SR^2}}}$$"

### 풀이 — 극한의 의미

**$\gamma \to \infty$ (평균에 무한 가중치)** 의 극한:

$$
\widehat{\text{Corr}}^2 \to \frac{1}{1 + \Gamma_e + \frac{\Gamma_e^2}{SR^2}}
$$

**관찰**:
- $\Gamma_e \to 0$ (잡음 없음): $\widehat{\text{Corr}}^2 \to 1$ (완벽 추정).
- $SR \to \infty$ (샤프 비율 매우 큼): $\frac{\Gamma_e^2}{SR^2} \to 0$ → $\widehat{\text{Corr}}^2 \to \frac{1}{1+\Gamma_e}$.

→ **샤프 비율 큰 요인은 $\gamma$ 크게 해서 잘 잡힘**.

**★ 핵심**: 분산 약해도 (= $\Gamma_e$ 커도) $SR$ 크면 검출 가능.

### PCA 케이스 ($\gamma = -1$)

> "In the case of PCA, i.e. $\gamma = -1$ the expression simplifies to
> $$\widehat{\text{Corr}}(F, \hat F)^2 \xrightarrow{p} \frac{1}{1 + \theta\Psi(\theta)}$$
> with $\theta_{\text{PCA}} = \sigma_F^2(1+\Gamma_e)$."

**풀어 설명**:
- $\gamma = -1$ → 회전 단순화, $\theta = \sigma_F^2(1+\Gamma_e)$ ($M_{\text{PCA}}$ 의 1번째 고유값).
- 상관계수 = $1/(1 + \theta_{\text{PCA}} \Psi(\theta_{\text{PCA}}))$.

→ **이게 PCA의 baseline**. RP-PCA가 이것보다 항상 더 큰 상관계수를 줌.

### 트레이드오프

> "A smaller noise-to-signal ratio $\Gamma_e$ and a larger Sharpe-ratio combined with a large $\gamma$ lead to a more precise estimation of the factors. In the simulation section we find the optimal value of $\gamma$ to maximize the correlation. Note that a larger value of $\gamma$ decreases $\theta\Psi(\theta)$, while it increases $\frac{(\frac{\theta}{\sigma_F^2} - (1+\Gamma_e))^2}{SR^2(1+\gamma)}$, creating a trade-off. In all our simulations $\gamma = -1$ was never optimal."

### 풀어 설명

**$\gamma$ 효과의 트레이드오프**:
- **장점**: $\theta\Psi(\theta)$ 감소 → 상관계수 분모 작아짐 → 추정 좋아짐
- **단점**: $\frac{(\cdot)^2}{SR^2(1+\gamma)}$ 증가 → 분모 커짐 → 추정 나빠짐
- → **최적 $\gamma$ 존재**.

**★ 강력한 실증 주장**: "**모든 시뮬레이션에서 $\gamma = -1$ (PCA) 이 최적인 경우는 한 번도 없었다**".

---

## 9.3 Example 3 — PCA with i.i.d. Residuals

> **원문**: "Now we study PCA for the special case of cross-sectionally uncorrelated residuals but many factors.
> **Example 3: PCA for model with independent residuals**
> Assume that $e_{t,i} \overset{i.i.d.}{\sim} N(0, \sigma_e^2)$, i.e. $\Sigma = \sigma_e^2 I_N$. In this case the residual eigenvalues follow the well-known Marcenko-Pasteur Law. For simplicity assume that $\frac{N}{T} \to c$ with $c > 1$. The results can be easily extended to the case $0 < c < 1$."

### 풀어 설명

**가정**: 잔차가 i.i.d. 정규 → 잔차 공분산 행렬 = $\sigma_e^2 I$ (스칼라 다중).

**결과**: 잔차 표본 고유값이 **Marchenko-Pastur 분포** 따름.

### Marchenko-Pastur 결과

> "The maximum residual eigenvalue equals $b = \sigma_e^2(1+\sqrt c)^2$. The Cauchy transform takes the form
> $$G(z) = \frac{z - \sigma_e^2(1-c) - \sqrt{(z - \sigma_e^2(1+c))^2 - 4c\sigma_e^4}}{2cz\sigma_e^2}$$
> Hence, the critical value for detecting factors is now $\theta_{\text{crit}} = \frac{1}{G(b^+)} = \sigma_e^2(c + \sqrt c)$."

### 풀이

**MP 분포의 핵심 값**:
- 최대 잔차 고유값: $b = \sigma_e^2(1 + \sqrt c)^2$
- 최소: $a = \sigma_e^2(1 - \sqrt c)^2$
- Cauchy transform: 위 식 (명시적 형태)
- **검출 임계값**: $\theta_{\text{crit}} = \sigma_e^2(c + \sqrt c)$

### 임계값의 의미

$\theta_{\text{crit}} = \sigma_e^2 (c + \sqrt c)$

**해석**: 
- $c = N/T$ (자산수/시간).
- 자산이 많아질수록 ($c$ 큼) 검출이 더 어려워짐.

**예시** (실증 비슷한 셋팅):
- $\sigma_e^2 = 2.5$ (실증 값)
- $c = 370/650 \approx 0.57$ → $\sqrt c \approx 0.75$
- $\theta_{\text{crit}} \approx 2.5 \times (0.57 + 0.75) \approx 3.3$
- 즉 요인의 분산 신호가 3.3 이상이어야 PCA로 검출.

### 역함수 등

> "The inverse of the Cauchy transform and the B-function are given explicitly by
> $$G^{-1}\!\left(\frac{1}{z}\right) = z\!\left(\frac{1 + \frac{\sigma_e^2(1-c)}{z}}{1 - \frac{c\sigma_e^2}{z}}\right)$$
> $$B(z) = \frac{z - \sigma_e^2(1+c)}{2\sigma_e^2\sqrt{z^2 - 2(1+c)\sigma_e^2 z + (c-1)^2 \sigma_e^4}} - \frac{1}{2\sigma_e^2}$$"

**풀어 설명**: i.i.d. 잔차 케이스에서는 $G, B$ 모두 명시적 닫힌 형태. **시뮬레이션 검증에 이상적**.

---

## 9.4 Corollary 3 — PCA with i.i.d. Residuals

> **원문**: "**Corollary 3: PCA for model with independent residuals**
> Assumption 2 holds and $e_{t,i}$ i.i.d. $N(0, \sigma_e^2)$. The largest $K$ eigenvalues of the sample covariance matrix have the following limiting values:
> $$\hat\lambda_i \xrightarrow{p}
> \begin{cases}
> \sigma_{F_i}^2 + \frac{\sigma_e^2}{\sigma_{F_i}^2}(c + 1 + \sigma_e^2) & \text{if } \sigma_{F_i}^2 + c\sigma_e^2 > \theta_{\text{crit}} \Leftrightarrow \sigma_{F_i}^2 > \sqrt c \sigma_e^2 \\
> \sigma_e^2(1+\sqrt c)^2 & \text{otherwise}
> \end{cases}$$"

### 풀이

**$i$번째 표본 고유값의 극한**:

**Case A**: $\sigma_{F_i}^2 > \sqrt c \sigma_e^2$ (신호 충분히 큼)
- $\hat\lambda_i \to \sigma_{F_i}^2 + \frac{\sigma_e^2}{\sigma_{F_i}^2}(c + 1 + \sigma_e^2)$
- 진짜 분산 + 보정 항.

**Case B**: $\sigma_{F_i}^2 < \sqrt c \sigma_e^2$ (신호 작음)
- $\hat\lambda_i \to \sigma_e^2(1+\sqrt c)^2 = b$ (잡음 윗 끝)
- → 검출 실패.

**임계 조건**: $\sigma_{F_i}^2 > \sqrt c \sigma_e^2$.

### 상관계수의 극한

> "The correlation between the estimated and true factors converges to
> $$\widehat{\text{Corr}}(F, \hat F) \xrightarrow{p} \begin{pmatrix}\rho_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \rho_K\end{pmatrix}$$
> with
> $$\rho_i^2 \xrightarrow{p}
> \begin{cases}
> \dfrac{1 - \frac{c\sigma_e^2}{\sigma_{F_i}^2}}{1 + \frac{c\sigma_e^2}{\sigma_{F_i}^2} + \frac{\sigma_e^2}{\sigma_{F_i}^2}(c^2 - c)} & \text{if } \sigma_{F_i}^2 + c\sigma_e^2 > \theta_{\text{crit}} \\
> 0 & \text{otherwise}
> \end{cases}$$"

### 풀이

**$\rho_i^2$ 극한**: 

**Case A**: 검출 시 $\rho_i^2$ 의 명시적 형태.
- $\sigma_{F_i}^2 \to \infty$ (신호 매우 강함) → $\rho_i^2 \to 1$ (완벽).
- $\sigma_{F_i}^2 \to \sqrt c \sigma_e^2$ (임계 부근) → $\rho_i^2 \to$ 작은 값.

**Case B**: 검출 실패 시 $\rho_i^2 = 0$.

### 극한의 흥미로운 결과

> "Note that for $\sigma_{F_i}^2$ going to infinity, we are back in the strong factor model and the estimator becomes consistent."

**풀어 설명**:
- $\sigma_{F_i}^2 \to \infty$ → 약한 요인 모델이 강한 요인 모델로 환원.
- 추정량이 일관됨 ($\rho_i^2 \to 1$).

→ **강한/약한 요인 모델은 연속적**으로 연결됨.

### 각주 16
> "These results have already been shown in Onatski (2012), Paul (2007) and Benaych-Georges and Nadakuditi (2011). We present them to provide intuition for the model."

**풀어 설명**: 이 결과들은 기존 RMT 문헌에 있는 것. 본 논문에서는 **참고용** 으로 제시. 새로운 기여는 RP-PCA로 확장한 부분.

---

## 9.5 두 예제의 관계

### Example 2 (1-factor, 일반 잔차)
- 요인 1개, 잔차 구조 일반.
- $\gamma$ 가 어떻게 작용하는지 직관.
- 핵심: $\gamma \to \infty$ 극한.

### Example 3 (다 요인, i.i.d. 잔차)
- 요인 여러 개, 잔차 i.i.d.
- PCA의 명시적 임계값.
- 핵심: $\theta_{\text{crit}} = \sigma_e^2(c + \sqrt c)$.

**두 예제를 합치면**: 일반 RP-PCA 결과의 두 가지 단면.

---

## 9.6 비유로 정리

### Example 2 비유 — 라디오 듣기
- 라디오 방송국 한 개 ($K=1$).
- $\Gamma_e$ = 백그라운드 잡음 비율
- $SR$ = 방송의 평균 음량
- $\gamma$ = 안테나 방향 조절 다이얼

방송 출력 약해도 ($\Gamma_e$ 큼), 평균 음량 크면 ($SR$ 큼) 안테나 잘 맞추면 ($\gamma$ 키우면) 들림.

### Example 3 비유 — 별 관측
- 별 여러 개 ($K$개), 하늘 잡음 균일 ($\sigma_e^2 I$).
- 임계 밝기: $\sigma_e^2(c + \sqrt c)$
- 별의 진짜 밝기가 임계 이상이면 보임, 미만이면 안 보임.

i.i.d. 잡음일 때 임계값이 가장 깔끔히 떨어짐.

---

## 9.7 Section 5.3 핵심 정리

| 항목 | Example 2 | Example 3 |
|------|-----------|-----------|
| 가정 | $K=1$, 잔차 일반 | 다 $K$, 잔차 i.i.d. |
| 핵심 결과 | $\widehat{\text{Corr}}^2$ 극한 식 | $\theta_{\text{crit}} = \sigma_e^2(c+\sqrt c)$ |
| $\gamma \to \infty$ | $\widehat{\text{Corr}}^2 \to \frac{1}{1+\Gamma_e + \Gamma_e^2/SR^2}$ | (해당없음) |
| 의미 | RP-PCA가 약한 요인 검출 | PCA의 임계값 명시 |

### 한 줄로

> **약한 요인 검출의 임계값은 잡음 분산과 자산 수에 의해 결정. RP-PCA는 평균 정보를 활용해 이 임계값을 효과적으로 낮춤 (= 더 약한 요인도 검출).**

다음 파일(**10_시뮬레이션_Section6.md**)에서는 **시뮬레이션을 통해 이론을 검증**한다.

---


---

## 인터랙티브 시각화

```viz:rppca-mp-spectrum:title=Example 3 — i.i.d. 잔차의 Marchenko-Pastur;caption=이 경우 임계값이 σ²_e(c + √c) 로 명시적. c와 spike를 조작해보자.
```

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Example 2의 $\gamma\to\infty$ 극한에서 추정-진짜 상관계수 식?**
2. **Example 3 (i.i.d. 잔차)의 검출 임계값?**
3. **두 예제가 시사하는 핵심 메시지?**

### 답변
1. $\widehat{\text{Corr}}^2 \to \frac{1}{1 + \Gamma_e + \Gamma_e^2/SR^2}$. SR 클수록, 잡음비 $\Gamma_e$ 작을수록 1에 가까움.
2. $\theta_{\text{crit}} = \sigma_e^2(c + \sqrt c)$ ($c = N/T$). 신호가 이보다 작으면 PCA 검출 불가.
3. 분산이 작아도 (= 약한 요인) Sharpe-ratio가 크면 RP-PCA로 잡힘. "분산 + 평균" 결합의 본질.
