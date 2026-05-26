# 08. Section 5 중반 — Theorem 2와 Lemma 2

> **🧒 한 줄 요약**: Main theorem (paper §3.3). Consistency, asymptotic.


논문 14쪽 ~ 16쪽 (Theorem 2, Lemma 2, 그리고 관련 해설)을 풀어본다.

이 파트가 약한 요인 모델 이론의 **핵심**이다.

---

## 8.1 Theorem 2 — Risk-Premium PCA under Weak Factor Model

> **원문**: "**Theorem 2: Risk-Premium PCA under weak factor model**
> Assume Assumption 2 holds. We denote by $\theta_1, \ldots, \theta_K$ the first $K$ largest eigenvalues of the signal matrix $M = M_{\text{PCA}}$ or $M = M_{\text{RP-PCA}}$. The first $K$ largest eigenvalues $\hat\theta_i$, $i = 1, \ldots, K$ of $\frac{1}{T}X^\top(I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top)X$ satisfy"

$$
\boxed{\;
\hat\theta_i \xrightarrow{p}
\begin{cases}
G^{-1}(1/\theta_i) & \text{if } \theta_i > \theta_{\text{crit}} = \lim_{z \downarrow b} 1/G(z) \\
b & \text{otherwise}
\end{cases}
\;}
$$

### 풀어 설명 — 단계별

#### Step 1: 신호 행렬 $M$ 의 고유값 $\theta_i$
- $M = M_{\text{PCA}}$ 또는 $M_{\text{RP-PCA}}$
- 큰 $K$ 개 고유값을 $\theta_1, \theta_2, \ldots, \theta_K$ 로 라벨.

#### Step 2: 표본 고유값 $\hat\theta_i$
- $\frac{1}{T}X^\top(I_T + \frac{\gamma}{T}\mathbb{1}\mathbb{1}^\top) X$ 의 상위 $K$ 고유값.
- 이게 RP-PCA 추정량의 핵심 고유값.

#### Step 3: 극한 (Phase transition)
표본 고유값이 어디로 가는지가 **신호 $\theta_i$ 의 크기에 따라 두 경우**로 갈림:

**Case A**: $\theta_i > \theta_{\text{crit}}$ (신호 충분히 큼)
- $\hat\theta_i \to G^{-1}(1/\theta_i)$
- 의미: 표본 고유값이 잡음 위로 떠 있음, 위치 정확히 예측 가능.

**Case B**: $\theta_i < \theta_{\text{crit}}$ (신호 작음)
- $\hat\theta_i \to b$ (bulk 윗 끝)
- 의미: 표본 고유값이 잡음 군집으로 빨려들어감, 신호 정보 잃음.

### 임계값 $\theta_{\text{crit}}$
$$
\theta_{\text{crit}} = \lim_{z \downarrow b} \frac{1}{G(z)}
$$

**해석**: $G(z)$ 가 $b$ 에서 어떤 값에 수렴하는지에 따른 임계값.

**i.i.d. 잔차 케이스 (Example 3)**: $\theta_{\text{crit}} = \sigma_e^2(c + \sqrt c)$. 신호가 이걸 넘어야 검출.

---

## 8.2 추정-참 요인 상관계수

> **원문**: "The correlation of the estimated with the true factors converges to"

$$
\widehat{\text{Corr}}(F, \hat F) = \underbrace{\tilde Q}_{\text{rotation}}
\begin{pmatrix}\rho_1 & 0 & \cdots & 0 \\ 0 & \rho_2 & \cdots & 0 \\ 0 & 0 & \ddots & \vdots \\ 0 & \cdots & 0 & \rho_K\end{pmatrix}
\underbrace{\tilde R}_{\text{rotation}}
$$

> with
$$
\boxed{\;
\rho_i^2 \xrightarrow{p}
\begin{cases}
\dfrac{1}{1 + \theta_i B(\theta_i)} & \text{if } \theta_i > \theta_{\text{crit}} \\
0 & \text{otherwise}
\end{cases}
\;}
$$

> **표기 주의**: 본문 p.15는 단축 표기 $B(\theta_i)$ 로 적었지만, 정확한 형태는 부록 p.40에 나오는 $B(\hat\theta_i) = B(G^{-1}(1/\theta_i))$ — 즉 $B$ 를 표본 고유값 위치에서 평가. 표기는 다르지만 같은 식.

### 풀어 설명

#### 추정-참 상관계수 행렬
- $\widehat{\text{Corr}}(F, \hat F)$ = 추정 요인 $\hat F$ 와 참 요인 $F$ 의 상관계수 행렬.
- 회전 $\tilde Q$ 와 $\tilde R$ 가 양쪽에 곱해짐 → **회전을 풀어준 후 대각 행렬**.

#### 각 $\rho_i^2$ 의 의미
$\rho_i^2$ = $i$번째 (회전 풀린) 추정 요인과 참 요인의 상관계수 제곱.

**Case A**: $\theta_i > \theta_{\text{crit}}$
$$\rho_i^2 \to \frac{1}{1 + \theta_i B(\theta_i)}$$
- $\theta_i$ 클수록 $\rho_i^2 \to 1$ (강한 신호 → 완벽 추정).
- $\theta_i$ 임계값 근처면 $\rho_i^2$ 작음.

**Case B**: $\theta_i < \theta_{\text{crit}}$
- $\rho_i^2 \to 0$
- **추정 요인이 참 요인과 무관** (완전 잡음).

### 회전 행렬 $\tilde Q, \tilde R$ 의 의미

> **원문**: "The rotation matrices satisfy $\tilde Q^\top \tilde Q \le I_K$ and $\tilde R^\top \tilde R \le I_K$. Hence, the correlation $\widehat{\text{Corr}}(F_i, \hat F_i)$ is not necessarily an increasing function in $\theta$."

**풀어 설명**:
- $\tilde Q, \tilde R$ 는 직교 (또는 부분 직교) 행렬.
- 그래서 $\theta$ 증가가 항상 상관계수 증가로 이어지지는 않음 (회전 효과 때문).

> "For $\gamma = -1$ the rotation matrices equal:
> $\tilde Q = (I_K \;\; 0) \tilde U_{1:K}$, $\tilde R = D_K^{1/2}\hat\Sigma_{\hat F}^{-1/2}$"

**풀어 설명**:
- $\gamma = -1$ (PCA) 케이스의 회전 행렬 구체 형태.
- $\tilde U_{1:K}$ = $\tilde U$ 의 첫 $K$ 열.

### 구체적 분산-상관 식
> "where $\tilde U_{1:K}$ are the first $K$ columns of $\tilde U$ and
> $$\hat\Sigma_{\hat F} = D_K^{1/2}\!\left(\begin{pmatrix}\rho_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \rho_K \\ 0 & \cdots & 0\end{pmatrix}^\top \tilde U^\top (I_K \;\; 0) \tilde U \begin{pmatrix}\rho_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & \rho_K \\ 0 & \cdots & 0\end{pmatrix} + \begin{pmatrix}1-\rho_1^2 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & 1-\rho_K^2\end{pmatrix}\right) D_K^{1/2}$$
> $$D_K = \text{diag}(\hat\theta_1 \;\; \cdots \;\; \hat\theta_K)$$"

**풀어 설명**: 추정 요인 분산의 구체 형태. 복잡하지만 본질은:
- 신호 부분: $\rho_i$ 가 진짜와 추정의 일치도 표현.
- 잡음 부분: $1-\rho_i^2$ 가 추정의 비일치도.

> "For PCA ($\gamma = -1$) the rotation matrices simplify to $\tilde Q = \tilde R = I_K$."

**중요**: $\gamma = -1$ 일 때만 회전이 단위행렬. 다른 $\gamma$ 면 회전 풀어야 함.

---

## 8.3 Theorem 2의 의미 해설

> **원문**: "Theorem 2 states that the asymptotic behavior of the estimator can be completely explained by the signals of the factors for a given distribution of the idiosyncratic shocks."

**풀어 설명**:
- 추정량의 점근 행동 = **요인 신호** + **잔차 분포** 두 가지로 완전히 결정됨.
- 잔차 분포 $\Sigma$ 만 알면 $G(z), B(z)$ 정해짐.

> "The theorem also states that weak factors can only be estimated with a bias. If a factor is too weak then it cannot be detected at all."

**풀어 설명**:
- 약한 요인은 **편향** 있는 추정만 가능 ($\rho_i^2 < 1$).
- 너무 약하면 ($\theta_i < \theta_{\text{crit}}$) 전혀 검출 안 됨.

> "Weak factors can always be better detected using Risk-Premium-PCA instead of covariance PCA. The phase transition phenomena that hides weak factors can be avoided by putting some weight on the information captured by the risk-premium."

**풀어 설명** (중요한 메시지):
- **RP-PCA가 PCA보다 약한 요인 검출 항상 더 잘함**.
- 위험프리미엄 정보에 가중치 → 상전이 회피 가능.

> "Based on our asymptotic theory, we can choose the optimal weight $\gamma$ depending on our objective, e.g. to make all weak factors detectable or achieving the largest correlation for a specific factor."

**풀어 설명**: 목표에 따라 $\gamma$ 선택 가능.

> "Typically the rotation matrices $\tilde Q$ and $\tilde V$ are decreasing in $\gamma$ while $\rho_i$ is strictly increasing in $\gamma$, yielding an optimal value for the largest correlation."

**풀어 설명**: $\gamma$ 증가 효과는 양면:
- $\rho_i$ 증가 (더 정확)
- 회전 행렬 작아짐 (정보 손실)
- → **최적 $\gamma$ 존재** (양쪽 균형).

---

## 8.4 Section 5.3 — 예제 도입

> **원문**: "In order to obtain a better intuition for the problem we consider two special cases. First, we analyze the effect of $\gamma$ in the case of only one factor. Second, we study PCA for the special case of cross-sectionally uncorrelated residuals."

**풀어 설명**: 두 가지 단순화된 케이스로 직관 얻기:
1. Example 2: 1개 요인만 있는 경우.
2. Example 3: 잔차가 횡단면 무상관 (i.i.d.) 인 경우.

이 두 예제는 다음 파일(**09_약한_요인_모델_예제들_Section5_후반.md**)에서 자세히.

---

## 8.5 Lemma 2 — RP-PCA의 PCA 지배 (부록 B에서 증명)

논문 본문 Section 5 마지막에는 안 나오지만, 부록 B에 정식 제시. 핵심 결과라 여기서 함께 다룬다.

> **원문 (부록 B)**: "**Lemma 2: Detection of weak factors**
> If $\gamma > -1$ and $\mu_F \neq 0$, then the first $K$ eigenvalues of $M_{\text{RP-PCA}}$ are strictly larger than the first $K$ eigenvalues of $M_{\text{PCA}}$, i.e.
> $$\theta_i^{\text{RP-PCA}} > \sigma_{F_i}^2 + c\sigma_e^2$$
> For $\theta_i > \theta_{\text{crit}}$ it holds that
> $$\frac{\partial \hat\theta_i}{\partial \theta_i} > 0, \quad \frac{\partial \rho_i}{\partial \theta_i} > 0, \quad i = 1, \ldots, K.$$
> Thus, if $\gamma > -1$ and $\mu_F \neq 0$, then $\rho_i^{\text{RP-PCA}} > \rho_i^{\text{PCA}}$."

### 풀어 설명

**3단 논증**:

#### 1단: 신호 크기 비교
- $M_{\text{RP-PCA}}$의 신호 = $\Sigma_F + (1+\gamma)\mu_F\mu_F^\top$ 의 고유값
- $M_{\text{PCA}}$의 신호 = $\Sigma_F$ 의 고유값
- $\mu_F\mu_F^\top$ 는 PSD → PSD 더하면 고유값 더 큼 (Weyl 부등식)
- **∴ $\theta_i^{\text{RP-PCA}} > \theta_i^{\text{PCA}}$**

#### 2단: 신호 크면 추정 좋음
- $\theta_i$ 가 임계값 위에서 증가하면 $\hat\theta_i$ 와 $\rho_i$ 모두 증가.
- → 신호 클수록 검출 정확도 ↑.

#### 3단: 결합
- 1단 + 2단 → **$\rho_i^{\text{RP-PCA}} > \rho_i^{\text{PCA}}$**.
- 즉 **RP-PCA가 PCA보다 항상 더 정확** (단, $\mu_F \neq 0$).

### 의미
**핵심 메시지**: 자산가격 응용에서 $\mu_F \neq 0$ (위험프리미엄 ≠ 0) 은 거의 항상 성립.
**∴ RP-PCA는 항상 PCA보다 좋다** (또는 같다 — 단 $\gamma = -1$ 일 때).

### 증명 (부록에서)
> "**Proof of Lemma 2**: See result (12) on page 75 in Lütkepohl (1996) and straightforward calculations."

**풀어 설명**: 표준 행렬 부등식 (Lütkepohl 1996 핸드북)에서 따라옴.

---

## 8.6 Theorem 2 + Lemma 2 종합 비유

### 비유: 별 관측

당신이 천문학자다. 별(요인)을 보고 싶다.

- **별의 밝기 $\theta_i$**: 진짜 신호 크기
- **하늘의 잡음 (bulk)**: $b$ — 우주 배경 잡음
- **임계 밝기 $\theta_{\text{crit}}$**: 이 밝기 이하면 우주 배경에 묻혀 안 보임

**PCA**: 망원경 모드 A (분산만 봄)
- 별이 충분히 밝으면 본다.
- 어두운 별 ($\theta_i < \theta_{\text{crit}}$) 영원히 못 봄.

**RP-PCA**: 망원경 모드 B (분산 + 평균 둘 다 봄)
- 같은 별이 더 밝게 보임 (signal-strengthening).
- 어두운 별도 일부는 임계값을 넘어 보이게 됨!

**Theorem 2** = "이 임계값과 검출 정확도의 수식"
**Lemma 2** = "모드 B (RP-PCA)가 모드 A (PCA)보다 항상 좋다"

---

## 8.7 Section 5 중반 핵심 정리

| 결과 | 한 줄 요약 |
|------|-----------|
| Theorem 2 (고유값) | 신호 > 임계 → $G^{-1}(1/\theta)$, 신호 < 임계 → bulk로 흡수 |
| Theorem 2 (상관) | 신호 > 임계 → $\rho_i^2 = \frac{1}{1+\theta B(\theta)}$, 신호 < 임계 → 0 |
| 회전 $\tilde Q, \tilde R$ | $\gamma \neq -1$이면 비단위, 풀어줘야 비교 가능 |
| Lemma 2 | $\mu_F \neq 0, \gamma > -1$ ⇒ RP-PCA가 PCA 지배 (strict) |

### 한 줄로 정리하면

> **약한 요인 모델에서 신호가 임계값보다 크면 검출 가능, 작으면 영원히 못 잡음. RP-PCA는 신호를 끌어올려 더 많은 요인을 검출 가능하게 한다.**

다음 파일(**09_약한_요인_모델_예제들_Section5_후반.md**)에서는 **Example 2 (1-요인), Example 3 (i.i.d. 잔차) 와 그에 따른 Corollary들**을 다룬다.

---


---

## 인터랙티브 시각화

```viz:rppca-phase-transition:title=Theorem 2 시각화;caption=θ를 키우면 ρ²이 0에서 점진적으로 1에 가까워짐. 임계값 아래는 ρ²=0 (검출 실패).
```

```viz:rppca-one-factor-correlation:title=γ 따라 ρ² 곡선;caption=1-요인 모델에서 γ를 키우면 ρ²이 어떻게 변하나. x축을 σ²_F로 바꾸면 weak factor 영역에서 γ 효과 가시화.
```

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Phase transition의 두 결과 (고유값과 ρ²)?**
2. **회전 행렬 $\tilde Q, \tilde R$ 가 $\gamma$ 에 따라 어떻게 변하나?**
3. **Lemma 2의 결론과 그 직관?**

### 답변
1. $\theta_i > \theta_{\text{crit}}$: 고유값 → $G^{-1}(1/\theta_i)$, ρ² → $1/(1+\theta_i B(\hat\theta_i))$. $\theta_i < \theta_{\text{crit}}$: 고유값 → $b$, ρ² → 0.
2. $\gamma=-1$ (PCA): $\tilde Q = \tilde R = I_K$ (대각). $\gamma > -1$: 비단위 — 회전 풀어야 비교.
3. $\mu_F \neq 0, \gamma > -1$ 이면 RP-PCA가 PCA strict dominate. 직관: $M_{\text{RP-PCA}}$ 신호 = $\Sigma_F + (1+\gamma)\mu_F\mu_F^\top$ 이 $M_{\text{PCA}}$ 신호 = $\Sigma_F$ 보다 PSD 만큼 큼.
