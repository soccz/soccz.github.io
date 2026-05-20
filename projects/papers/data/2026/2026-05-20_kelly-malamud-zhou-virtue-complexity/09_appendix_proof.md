# 09. Appendix — 핵심 증명 풀이

> Internet Appendix 의 핵심 증명 (Proposition 2 의 Stieltjes identity + Theorem 1 의 monotonicity) 풀이. 본 deep dive 의 "직관적 종합" 위주 — 모든 디테일 풀어쓰지는 않고 *전략* 과 *핵심 단계* 만.

---

## 9.1 챕터 한 줄 요약

**(1) Proposition 2 의 핵심 identity 는 Marchenko-Pastur 정리의 generalization. (2) Lemma 1 (LLN for $\beta'A\beta$) 가 모든 후속 결과의 building block. (3) Theorem 1 (monotonicity of SR in $q$) 의 증명 전략은 (i) Proposition 6 의 closed-form 으로 reduction, (ii) optimal $z_*$ 의 비변동성 + cross-correlation 의 boundedness, (iii) $\mathcal{E}/\sqrt{\mathcal{V}}$ 의 first derivative 의 sign 확인.**

---

## 9.2 증명 전략 개관

본 논문의 증명 구조 (Internet Appendix 의 Theorems 1A–6A):

```
LEMMA 1 — β quadratic form 의 LLN
    (Assumption 4 의 isotropic + 4th moment bound)
              ↓
THEOREM 1A — Marchenko-Pastur generalization (non-iid signals)
    m(-z; c) > m_Ψ(-z) for c > 0, RMT Stieltjes identity
              ↓
PROPOSITION 2 — tr((zI + Ψ̂)^{-1} Ψ) → ξ(z; c) closed form
    (Theorem 1A + Lemma 1)
              ↓
PROPOSITION 3, 4 — Correctly specified case의 모든 limit
    (Proposition 2 + algebra of expected returns / second moments)
              ↓
PROPOSITION 5, 6 — Misspecified case 의 모든 limit
    (block matrix algebra + Proposition 2 form 의 reduction)
              ↓
THEOREM 1 — SR monotone increasing in q
    (Proposition 6 + envelope theorem on z_*)
```

---

## 9.3 Lemma 1 의 증명 (핵심 building block)

### Stmt 재확인

> **Lemma 1**: $\beta' A_P \beta - P^{-1} b_* \text{tr}(A_P) \to 0$ in probability for any bounded matrix sequence $A_P$.

### 증명 sketch

**(i) Expectation**:
$$E[\beta' A_P \beta] = \sum_{i,j} A_{P,ij} E[\beta_i \beta_j] = \sum_i A_{P,ii} \cdot P^{-1} b_{*,P} = P^{-1} b_{*,P} \text{tr}(A_P).$$

$b_{*,P} \to b_*$ in probability → $E[\beta' A_P \beta] \to P^{-1} b_* \text{tr}(A_P)$.

**(ii) Variance**:
$$\text{Var}(\beta' A_P \beta) = \sum_{i,j,k,l} A_{P,ij} A_{P,kl} (E[\beta_i \beta_j \beta_k \beta_l] - E[\beta_i \beta_j] E[\beta_k \beta_l]).$$

$\beta$ iid, isotropic → 4th moment 항이 nonzero 인 경우: $i = j = k = l$ (4-way same).

$$\text{Var}(\beta' A_P \beta) \le \sum_i A_{P,ii}^2 \cdot E[\beta_i^4] \le K P^{-2} \sum_i A_{P,ii}^2.$$

$A_P$ bounded → $\sum_i A_{P,ii}^2 \le P \cdot O(1) = O(P)$.

$$\text{Var}(\beta' A_P \beta) \le K P^{-2} \cdot O(P) = O(P^{-1}) \to 0.$$

**(iii) Chebyshev**: variance → 0 + expectation 수렴 → $\beta' A_P \beta \to P^{-1} b_* \text{tr}(A_P)$ in probability.

### 응용 예: $\beta' \Psi \beta \to b_* \psi_{*,1}$

$A_P = \Psi$, $\Psi$ bounded → Lemma 1 직접 적용.

$P^{-1} \text{tr}(\Psi) = \psi_{*,1}^{(P)} \to \psi_{*,1}$ (Assumption 3).

$\therefore \beta' \Psi \beta \to b_* \psi_{*,1}$.

---

## 9.4 Proposition 2 의 증명 sketch

### Stmt 재확인

$$\lim_{T \to \infty} T^{-1} \text{tr}((zI + \hat\Psi)^{-1} \Psi) = \xi(z; c) = \frac{1 - z m(-z; c)}{c^{-1} - 1 + z m(-z; c)}.$$

### 증명 전략

**Step 1**: Sherman-Morrison-Woodbury identity 로 $(zI + \hat\Psi)^{-1}$ 의 trace 표현을 단순화.

**Step 2**: Empirical Stieltjes $m(z; c) = \lim P^{-1} \text{tr}((zI + \hat\Psi)^{-1})$ 정의.

**Step 3**: Marchenko-Pastur generalization (Theorem 1A) — Bai-Zhou (2008), Silverstein-Bai (1995) 의 결과:

$$\text{tr}((zI + \hat\Psi)^{-1} \Psi) = T \cdot \xi(z; c) + o_p(T),$$

where $\xi(z; c)$ 는 위 식.

**Step 4**: Marchenko-Pastur identity (Equation IA4) 가 $m(-z; c)$ 와 $m_\Psi(-z)$ 관계를 명시:

$$m_\Psi(-z) = m(-z; c) - z m^2(-z; c) (1 - 1/c) - 1/c + ...$$

(자세한 식은 Internet Appendix Theorem 2.)

### Marchenko-Pastur 의 직관

$\Psi = I$ + iid signals 의 case:

$$m(-z; c) = \frac{-((1-c)+z) + \sqrt{((1-c)+z)^2 + 4cz}}{2cz}.$$

- $c = 0$: $m(-z; 0) = 1/(1+z) = m_\Psi(-z)$ — 수렴.
- $c > 0$: $m(-z; c) > m_\Psi(-z)$ — perturbation.
- $c = 1$: $m(-z; 1) = (-(z) + \sqrt{z^2 + 4z})/(2z) = (\sqrt{z+4} - \sqrt{z})/(2\sqrt{z})$.
- $c \to \infty$: $m(-z; c) \to 1/(z \sqrt{c})$ (small).

### Stieltjes 의 부호 properties

For $z > 0$:
- $m(-z; c) > 0$ (positive).
- $m'(-z; c) > 0$ (increasing in $-z$).
- $z m(-z; c) \to 0$ as $z \to 0$ (when $c > 1$).

이 properties 가 Proposition 3, 4, 5, 6 의 sign 분석에 사용.

---

## 9.5 Proposition 3, 4 의 증명 sketch (correctly specified)

### Step 1: Trace identity 들

다음 traces 가 portfolio 의 building block:
- $\nu(z; c) = P^{-1} \text{tr}(\hat\Psi (zI + \hat\Psi)^{-1} \Psi) = \psi_{*,1} - c^{-1} z \xi(z; c)$.
- $\nu'(z; c) = \partial \nu / \partial z = - c^{-1}(\xi + z \xi')$.
- $\hat\nu(z; c) = P^{-1} \text{tr}(\hat\Psi^2 (zI + \hat\Psi)^{-2} \Psi) = \nu + z \nu'$.

### Step 2: Expected return

$\hat\pi_t = \hat\beta(z)' S_t$, $\hat\beta(z) = (zI + \hat\Psi)^{-1} T^{-1} \sum_t S_t R_{t+1}$.

$E[\hat\pi_t R_{t+1} | \hat\beta] = \hat\beta' \Psi \beta + 0$ (noise term zero).

Lemma 1 적용 후 trace identities → $\mathcal{E}(z; c) = b_* \nu(z; c)$.

### Step 3: Leverage

$E[\hat\pi_t^2 | \hat\beta] = \hat\beta' \Psi \hat\beta$.

$\hat\beta = (zI + \hat\Psi)^{-1} (T^{-1} \sum_t S_t R_{t+1})$.

$R_{t+1} = S_t' \beta + \varepsilon_{t+1}$ 대입:

$T^{-1} \sum_t S_t R_{t+1} = \hat\Psi \beta + T^{-1} \sum_t S_t \varepsilon_{t+1}$.

→ $\hat\beta = (zI + \hat\Psi)^{-1} (\hat\Psi \beta + \text{noise})$.

$\hat\beta' \Psi \hat\beta = \beta' \hat\Psi (zI + \hat\Psi)^{-1} \Psi (zI + \hat\Psi)^{-1} \hat\Psi \beta + \text{noise terms}$.

Lemma 1 + trace identities → $\mathcal{L}(z; c) = b_* \hat\nu(z; c) - c \nu'(z; c)$ (noise 의 contribution + $\beta$ 의 contribution).

### Step 4: R²

$R^2 = (2 \mathcal{E} - \mathcal{L}) / (1 + b_* \psi_{*,1})$ — Eq (8) 분해 + null MSE.

### Step 5: Second moment

$E[(\hat\pi_t R_{t+1})^2 | \hat\beta] = E[(\hat\beta' S_t)^2 (S_t' \beta + \varepsilon)^2]$.

Gaussian-like 4-point moments (Assumption 2 의 cross-moment 0 조건) → 결과는 $2 \mathcal{E}^2 + (1 + b_*\psi_{*,1}) \mathcal{L}$.

### Step 6: Optimal shrinkage

$\partial R^2 / \partial z = 0$ → $z_* = c/b_*$ (closed form).
$\partial SR / \partial z = 0$ → 같은 $z_*$ (correctly specified 의 우연한 일치).

---

## 9.6 Proposition 5, 6 의 증명 sketch (misspecified)

### Block matrix 분해

$\Psi = \begin{pmatrix} \Psi_{1,1} & \Psi_{1,2} \\ \Psi_{2,1} & \Psi_{2,2} \end{pmatrix}$ — block.

$\hat\Psi_{1,1} = T^{-1} \sum_t S_t^{(1)} (S_t^{(1)})'$ — observed sub-covariance.

$\hat\beta(z; q) = (zI + \hat\Psi_{1,1})^{-1} T^{-1} \sum_t S_t^{(1)} R_{t+1}$.

### Expected return 분해

$R_{t+1} = S_t' \beta + \varepsilon = (S_t^{(1)})' \beta^{(1)} + (S_t^{(2)})' \beta^{(2)} + \varepsilon$.

$E[\hat\pi_t R_{t+1}] = E[\hat\beta(z; q)' S_t^{(1)} R_{t+1}]$
$= \hat\beta(z; q)' (\Psi_{1,1} \beta^{(1)} + \Psi_{1,2} \beta^{(2)})$
$= \hat\beta(z; q)' \Psi_{1,1} \beta^{(1)} + \hat\beta(z; q)' \Psi_{1,2} \beta^{(2)}$.

첫 항: Section III form 의 $b_* q \nu$ (with $cq$ effective complexity).
둘째 항: $\xi_{2,1}$ 의 contribution.

### Cross-correlation term

$E[\hat\beta(z; q)' \Psi_{1,2} \beta^{(2)}]$:

$\hat\beta(z; q) = (zI + \hat\Psi_{1,1})^{-1} (\hat\Psi_{1,1} \beta^{(1)} + (\text{noise from } S^{(2)}, \varepsilon))$.

Lemma 1 + Proposition 2 form → $b_* q \cdot (cq)^{-1} \xi_{2,1}/(1 + \xi)$ (Proposition 5 (i)).

### Leverage 의 $\Delta$ term

$E[\hat\pi_t^2]$ 의 squared resolvent term + cross terms → $\Delta(z; cq; q)$ (Proposition 5 (ii)).

### Proposition 6 의 simplification

$\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ 이면 $\xi_{2,1} = \widehat\xi_{2,1} = 0$.

→ Proposition 6 의 closed form 식들.

### Ridgeless ($z \to 0$) form (Equation 19)

$\Psi = \psi_{*,1} I$ 의 case:
- $cq < 1$ (OLS): $\mathcal{E}(0; cq; q) = b_* \psi_{*,1} q$.
- $cq > 1$ (ridgeless): $\mathcal{E}(0; cq; q) = b_* \psi_{*,1} / c$ = constant.

이게 Figure 5 의 left panel 의 *flat after $cq = 1$* 패턴.

---

## 9.7 Theorem 1 의 증명 sketch (Virtue of Complexity)

### Stmt 재확인

Sufficiently mixed + $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ → $SR(z_*(q;c); cq; q)$ + $R^2(z_*(q;c); cq; q)$ are *strictly monotone increasing and concave in $q \in [0, 1]$*.

### 증명 전략

**Step A**: 가정 simplification — $\xi_{2,1} = \widehat\xi_{2,1} = 0$ (Proposition 6 의 simplification).

**Step B**: Optimal $z_*(q; c)$ 의 closed form. Proposition 6 (ii):
$$z_*(q; c) = c(1 + b_*(\psi_{*,1}(1) - q \psi_{*,1}(q))) / b_*.$$

Sufficiently mixed → $\psi_{*,1}(q) = \psi_{*,1}(1) = \psi_{*,1}$. 그러면:
$$z_*(q; c) = c(1 + b_* \psi_{*,1}(1 - q)) / b_*.$$

$q$ ↗ → $z_*$ ↘ (덜 shrinkage 필요).

**Step C**: $SR^2(z_*; cq; q)$ 의 $q$-derivative.

$SR^2 = \mathcal{E}^2 / \mathcal{V} = \mathcal{E}^2 / (2\mathcal{E}^2 + (1 + b_*\psi_{*,1}) \mathcal{L}) = 1 / (2 + (1 + b_*\psi_{*,1}) \mathcal{L}/\mathcal{E}^2)$.

So $SR^2 \uparrow$ iff $\mathcal{L}/\mathcal{E}^2 \downarrow$.

**Step D**: Sufficiently mixed condition → $\mathcal{E}$, $\mathcal{L}$ 의 $q$-dependence 가 단순화. 

특히 $q = 1$ (correctly specified) 일 때 비교 — empirical model 이 거의 fully specified 면 SR 최대.

**Step E**: Envelope theorem + sign analysis:

$$\frac{d}{dq} SR(z_*(q;c); cq; q) = \underbrace{\frac{\partial SR}{\partial z_*} \cdot z_*'(q)}_{=0 \text{ at optimum}} + \frac{\partial SR}{\partial q} > 0.$$

$\partial SR / \partial q$ 의 sign 이 trace identity 들의 직접 계산으로 양수 — *approximation gain* > *statistical cost*.

**Step F**: Concavity — second derivative analysis. $\mathcal{L}/\mathcal{E}^2$ 의 convexity 확인.

### 핵심 직관

- **Approximation gain**: $q$ ↗ → empirical model 이 true DGP 의 더 큰 fraction capture → $\mathcal{E}$ ↗.
- **Statistical cost**: $q$ ↗ → $cq$ (empirical complexity) ↗ → variance 증가. 그러나 *optimal $z_*$* 가 이걸 mitigate.
- **Net effect**: gain > cost when optimal shrinkage applied. SR monotone in $q$.

---

## 9.8 핵심 트릭 — RMT 와 isotropic $\beta$ 의 결합

본 논문의 분석을 가능하게 만드는 두 가지 핵심 idea:

### Trick 1: Lemma 1 — $\beta$ randomness 의 averaging

Random $\beta$ → quadratic form $\beta' A \beta$ 의 deterministic limit. 이로 specific $\beta$ realization 무관한 "average" portfolio behavior 분석 가능. (Hastie et al 2022 의 generic $\beta$ analysis 보다 단순.)

### Trick 2: Stieltjes transform — eigenvalue distribution 의 compression

$P \times P$ matrix $\Psi$ 의 모든 정보를 *eigenvalue distribution* 으로 압축, 다시 그 distribution 의 *Stieltjes transform* 으로 단일 함수 표현. portfolio 성능이 이 single 함수만 의존 (Proposition 2).

→ RMT 의 standard technique. Bai-Silverstein-Pastur 의 60+ 년 RMT 결과를 finance 에 가져옴.

---

## 9.9 직관적 종합 — 왜 complexity 가 미덕인가

### Two competing forces

1. **Statistical cost** (P 증가 시 negative):
   - Variance of $\hat\beta$ ↑.
   - Forecast variance ↑.
   - 즉 prediction 이 noisy.

2. **Approximation gain** (P 증가 시 positive):
   - $f(G_t) \approx \sum_i S_{i,t} \beta_i$ 의 정확도 ↑.
   - true DGP 의 더 큰 fraction capture.
   - Underlying signal 이 nonlinear → linear 한정에서는 bias.

### Net effect

- *Correctly specified* + *no shrinkage*: cost > gain (cost 가 dominant). Simple > complex.
- *Misspecified* + *no shrinkage*: gain vs cost balanced (ridgeless 가 implicit regularization 으로 cost 일부 mitigate).
- *Misspecified* + *optimal shrinkage*: **gain > cost (always)**. Complex > simple. → Theorem 1.

### Practical implication

세 가지의 결합이 핵심:
1. *Misspecified* — 현실 (모델은 절대 정확하지 않음).
2. *Optimal shrinkage* — bias-variance optimum.
3. *Many random features* (RFF, NN) — universal approximator.

이 셋이 갖춰지면 **"use the largest model you can compute"** 가 정당화.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Lemma 1 의 증명 핵심 두 step?**
2. **Proposition 2 의 RMT 결과의 핵심 contribution?**
3. **Theorem 1 의 monotonicity 증명의 envelope theorem step?**

### 답변
1. **(i) Expectation**: $E[\beta' A \beta] = P^{-1} b_* \text{tr}(A)$ — isotropic $\beta$ 가정의 직접 결과 (off-diagonal $\beta_i \beta_j$ 의 expectation 이 0). **(ii) Variance**: $\text{Var}(\beta' A \beta) \le K P^{-2} \cdot O(P) = O(P^{-1}) \to 0$ — 4th moment bound + $A_P$ bounded. Chebyshev + (i) → convergence in probability.
2. **All portfolio limits depend ONLY on $m(-z; c)$**, the *empirical* Stieltjes transform, which is *observable*. 즉 unknown $m_\Psi$ 가 필요 없음. RMT 의 Marchenko-Pastur generalization 가 $\xi(z; c) = (1 - z m(-z;c))/(c^{-1} - 1 + z m(-z;c))$ form 으로 모든 trace identity 를 압축. 이게 본 논문 분석이 *practical* 한 이유 — sample $\hat\Psi$ 의 eigenvalue 로 직접 계산 가능.
3. $z_*(q; c)$ 가 $SR$ 의 *optimal* shrinkage. Envelope theorem 으로: $\frac{d SR}{dq}|_{z_*} = \frac{\partial SR}{\partial z}|_{z_*} \cdot z_*'(q) + \frac{\partial SR}{\partial q}|_{z_*}$. 첫 항 $\frac{\partial SR}{\partial z}|_{z_*} = 0$ (optimality). 따라서 $\frac{d SR}{dq} = \frac{\partial SR}{\partial q}$ — *direct $q$-derivative* 만 분석. Trace identities (sufficiently mixed + $\xi_{2,1} = 0$ 가정 하) → $\frac{\partial SR}{\partial q} > 0$ (approximation gain > residual statistical cost). 따라서 monotone increasing.

---

다음 파일 [10_glossary.md](10_glossary.md) — 용어집 + 기호 사전.
