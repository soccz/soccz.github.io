# 09. Appendix — 핵심 증명 풀이

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Theorem 1 의 정확한 증명 단계
- RMT 의 Marchenko-Pastur + Stieltjes 의 활용
- 핵심 도구의 정밀 해석

---

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

## 9.3 Lemma 1 의 증명 (핵심 building block) — Detailed

### Stmt 재확인

> **Lemma 1**: $\beta' A_P \beta - P^{-1} b_* \text{tr}(A_P) \to 0$ in probability for any bounded matrix sequence $A_P$.

### 증명 — Step 1 (Expectation 계산)

$\beta = (\beta_1, \ldots, \beta_P)' \in \mathbb{R}^P$, Assumption 4: $E[\beta] = 0$, $E[\beta\beta'] = P^{-1} b_{*,P} I$.

이는 **각 $\beta_i$ iid, $E[\beta_i] = 0$, $E[\beta_i^2] = P^{-1} b_{*,P}$** 를 의미.

Quadratic form expansion:
$$\beta' A_P \beta = \sum_{i=1}^P \sum_{j=1}^P A_{P,ij} \beta_i \beta_j.$$

Expectation:
$$E[\beta' A_P \beta] = \sum_{i,j} A_{P,ij} E[\beta_i \beta_j].$$

$\beta$ iid 이고 mean zero 이므로:
- $i = j$: $E[\beta_i^2] = P^{-1} b_{*,P}$
- $i \neq j$: $E[\beta_i \beta_j] = E[\beta_i] E[\beta_j] = 0$

→ $E[\beta' A_P \beta] = \sum_i A_{P,ii} \cdot P^{-1} b_{*,P} = P^{-1} b_{*,P} \text{tr}(A_P)$.

Assumption 4: $b_{*,P} \to b_*$ in probability → $E[\beta' A_P \beta] \to P^{-1} b_* \text{tr}(A_P)$.

### 증명 — Step 2 (Variance computation, 4-point moment)

$$\text{Var}(\beta' A_P \beta) = E[(\beta' A_P \beta)^2] - (E[\beta' A_P \beta])^2.$$

$E[(\beta' A_P \beta)^2]$ 의 expansion:
$$E[(\beta' A_P \beta)^2] = \sum_{i,j,k,l} A_{P,ij} A_{P,kl} E[\beta_i \beta_j \beta_k \beta_l].$$

iid 의 4th moment property:
- $i = j = k = l$ (4-way same): $E[\beta_i^4]$ — nonzero, $\le K P^{-2}$ (Assumption 4 의 4th moment bound).
- $i = j, k = l, i \neq k$ (pair-pair): $E[\beta_i^2] E[\beta_k^2] = (P^{-1} b_{*,P})^2 = P^{-2} b_{*,P}^2$.
- $i = k, j = l, i \neq j$ (cross-pair): $E[\beta_i^2] E[\beta_j^2] = P^{-2} b_{*,P}^2$.
- $i = l, j = k, i \neq j$ (cross-pair 2): 동일.
- 그 외: $E[\beta_i^3] E[\beta_k]$ 같은 항 → mean zero 이므로 0.

따라서:
$$E[(\beta' A_P \beta)^2] = \sum_i A_{P,ii}^2 E[\beta_i^4] + P^{-2} b_{*,P}^2 \cdot 2 \sum_{i \neq j} A_{P,ii} A_{P,jj} + P^{-2} b_{*,P}^2 \cdot 2 \sum_{i \neq j} A_{P,ij}^2.$$

(첫 항: 4-way same; 둘째: pair-pair; 셋째: cross-pair 두 종류 합쳐 2배)

$(E[\beta'A_P\beta])^2 = (P^{-1} b_{*,P} \text{tr}(A_P))^2 = P^{-2} b_{*,P}^2 (\sum_i A_{P,ii})^2 = P^{-2} b_{*,P}^2 \sum_{i,j} A_{P,ii} A_{P,jj}$.

빼면:
$$\text{Var} = \sum_i A_{P,ii}^2 (E[\beta_i^4] - P^{-2} b_{*,P}^2) + 2 P^{-2} b_{*,P}^2 \sum_{i \neq j} A_{P,ij}^2.$$

### 증명 — Step 3 (Variance → 0 bound)

Bounded matrix sequence $A_P$ 이므로 (Frobenius norm bounded): $\sum_{ij} A_{P,ij}^2 \le P \cdot \|A_P\|_{op}^2 \le P \cdot C$ (const $C$).

또한 $\sum_i A_{P,ii}^2 \le \sum_{ij} A_{P,ij}^2 \le P \cdot C$.

Assumption 4: $E[\beta_i^4] \le K P^{-2}$.

따라서:
- 첫 항: $\sum_i A_{P,ii}^2 \cdot K P^{-2} \le P \cdot C \cdot K P^{-2} = O(P^{-1})$.
- 둘째 항: $P^{-2} b_{*,P}^2 \cdot 2 P C = O(P^{-1})$.

**총 variance**: $\text{Var}(\beta' A_P \beta) = O(P^{-1}) \to 0$ as $P \to \infty$.

### 증명 — Step 4 (Chebyshev)

For any $\epsilon > 0$:
$$P(|\beta' A_P \beta - P^{-1} b_{*,P} \text{tr}(A_P)| > \epsilon) \le \frac{\text{Var}(\beta' A_P \beta)}{\epsilon^2} = \frac{O(P^{-1})}{\epsilon^2} \to 0.$$

이로써 $\beta' A_P \beta \to P^{-1} b_{*,P} \text{tr}(A_P)$ in probability.

$b_{*,P} \to b_*$ in probability + Slutsky → $\beta' A_P \beta \to P^{-1} b_* \text{tr}(A_P)$. **QED Lemma 1**.

### 응용 예 1: $\beta' \Psi \beta \to b_* \psi_{*,1}$

$A_P = \Psi$, $\Psi$ uniformly bounded as $P \to \infty$ (Assumption 3 후반) → Lemma 1 직접 적용.

$P^{-1} \text{tr}(\Psi) = \psi_{*,1}^{(P)} \to \psi_{*,1}$ (Assumption 3).

$\therefore \beta' \Psi \beta \to b_* \psi_{*,1}$.

### 응용 예 2: $(S_t'\beta)^2 \to b_* \psi_{*,1}$

$E[(S_t'\beta)^2 | \beta] = \beta' E[S_t S_t'] \beta = \beta' \Psi \beta \to b_* \psi_{*,1}$ (응용 예 1).

각주 20 의 주장 ($1 + (S_t'\beta)^2 \to 1 + b_*\psi_{*,1}$) 가 이로부터 직접.

### 응용 예 3: $\hat\beta' \Psi \beta$ 의 limit

$\hat\beta(z) = (zI + \hat\Psi)^{-1} T^{-1} \sum_t S_t R_{t+1}$.

$R_{t+1} = S_t' \beta + \varepsilon_{t+1}$:
$$T^{-1} \sum_t S_t R_{t+1} = T^{-1} \sum_t S_t S_t' \beta + T^{-1} \sum_t S_t \varepsilon_{t+1} = \hat\Psi \beta + \mathbf{u},$$
where $\mathbf{u} = T^{-1} \sum_t S_t \varepsilon_{t+1}$ — noise term with $E[\mathbf{u}|\beta] = 0$, $\text{Cov}(\mathbf{u}) = T^{-1} \sigma^2 \Psi$.

$\hat\beta = (zI + \hat\Psi)^{-1}(\hat\Psi \beta + \mathbf{u})$.

$\hat\beta' \Psi \beta = \beta' \hat\Psi (zI + \hat\Psi)^{-1} \Psi \beta + \mathbf{u}'(zI + \hat\Psi)^{-1} \Psi \beta$.

첫 항: $\beta' B \beta$ form with $B = \hat\Psi (zI + \hat\Psi)^{-1} \Psi$. Lemma 1 → $b_* P^{-1} \text{tr}(B) = b_* \nu(z;c)$.

둘째 항: $E[\mathbf{u}|\beta] = 0$ + $\text{Var}(\mathbf{u}) = O(T^{-1})$ → second term $o_p(1)$.

$\therefore E[\hat\pi_t R_{t+1}|\hat\beta] = \hat\beta' \Psi \beta \to b_* \nu(z;c) = \mathcal{E}(z;c)$ (Proposition 3 의 첫 line).

---

## 9.4 Proposition 2 의 증명 sketch — Detailed

### Stmt 재확인

$$\lim_{T \to \infty} T^{-1} \text{tr}((zI + \hat\Psi)^{-1} \Psi) = \xi(z; c) = \frac{1 - z m(-z; c)}{c^{-1} - 1 + z m(-z; c)}.$$

### Step 1: Sherman-Morrison-Woodbury identity

$\hat\Psi = T^{-1} \sum_t S_t S_t' = T^{-1} S' S$ where $S \in \mathbb{R}^{T \times P}$ is the data matrix.

Woodbury identity (matrix inversion lemma):
$$(zI_P + T^{-1} S' S)^{-1} = z^{-1} I_P - z^{-1} S' (zT I_T + SS')^{-1} S z^{-1}.$$

→ $P \times P$ inversion 을 $T \times T$ inversion 으로 변환. $P > T$ 일 때 핵심.

### Step 2: Trace of resolvent → empirical Stieltjes

$P^{-1} \text{tr}((zI + \hat\Psi)^{-1}) \to m(-z; c)$ by definition (Section 5a.5 의 정의).

Equivalent form (using Woodbury):
$$m(-z;c) = z^{-1}(1 - c^{-1}) + z^{-1} c^{-1} \cdot T^{-1} \text{tr}((zI + \tilde{\Psi})^{-1}),$$
where $\tilde\Psi = T^{-1} SS' \in \mathbb{R}^{T \times T}$ (dual covariance).

→ $P > T$ ($c > 1$) 면 $\hat\Psi$ 가 rank ≤ T (P - T zero eigenvalues) — $P^{-1} \text{tr}((zI+\hat\Psi)^{-1})$ 에 $(1 - 1/c) z^{-1}$ singular part 등장 (각주 24 의 언급).

### Step 3: Bai-Zhou (2008) 의 일반화 Marchenko-Pastur

For non-iid signals $S_t = \Psi^{1/2} X_t$ (Assumption 2): Bai-Zhou (2008, *Statistica Sinica*) 가 다음 fixed-point equation 의 unique solution 을 보임:

$$m(-z; c) = \int \frac{1}{x(1 - c - cz \cdot m(-z;c)) + z} dH(x), \tag{IA4}$$

where $H$ 는 $\Psi$ 의 limit eigenvalue distribution (Assumption 3).

→ $m(-z; c)$ 가 단일 fixed-point equation 으로 정해짐. unique positive solution.

### Step 4: $\text{tr}((zI + \hat\Psi)^{-1} \Psi)$ 의 closed form

위 fixed-point 의 약간 변형:
$$T^{-1} \text{tr}((zI + \hat\Psi)^{-1} \Psi) = c \cdot \int \frac{x}{x(1 - c - czm(-z;c)) + z} dH(x).$$

대수 변형 (IA의 Theorem 1A) → 위 적분이 closed form:
$$= \frac{1 - z m(-z;c)}{c^{-1} - 1 + z m(-z;c)} = \xi(z; c). \tag{Eq 10}$$

### Step 5: Marchenko-Pastur ($\Psi = I$) 의 closed form 도출

$\Psi = I$ 면 $H$ 가 단위 점질량 (point mass at 1): $\int f(x) dH(x) = f(1)$.

IA4 가 단일 식으로 reduce:
$$m(-z; c) = \frac{1}{1 - c - cz m(-z;c) + z}.$$

분모-분자 cross-multiply:
$$m \cdot (1 - c - czm + z) = 1,$$
$$m + zm - cm - cz m^2 = 1,$$
$$cz m^2 - (1 - c + z) m + 1 = 0.$$

이차 방정식 → quadratic formula:
$$m = \frac{(1 - c + z) \pm \sqrt{(1 - c + z)^2 - 4cz}}{2cz}.$$

Wait — 부호 확인: $1 - c - czm + z = 1 + z - c(1 + zm)$. positive solution 선택:
$$m(-z; c) = \frac{-((1-c) + z) + \sqrt{((1-c)+z)^2 + 4cz}}{2cz}.$$

(각주 24 의 식과 일치.)

### Step 6: Limit relations

- $c \to 0$: $m(-z;c) \to 1/(1+z) = m_\Psi(-z)$ for $\Psi = I$.
- $c = 1$: $m(-z;1) = (-z + \sqrt{z^2 + 4z})/(2z) = (\sqrt{z+4} - \sqrt z)/(2\sqrt z)$.
- $c \to \infty$: $m(-z;c) \to 1/(z\sqrt c) \to 0$.

각주 24 의 statement: "$m(-z; c) > m_\Psi(-z)$ for $c > 0$" — 직접 확인 가능 (Marchenko-Pastur 의 closed form 의 monotonicity).

**Proposition 2 QED**.

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

## 9.7 Theorem 1 의 증명 — Detailed (Envelope Theorem)

### Stmt 재확인

Sufficiently mixed + $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ → $SR(z_*(q;c); cq; q)$ + $R^2(z_*(q;c); cq; q)$ are *strictly monotone increasing and concave in $q \in [0, 1]$*.

### Step A: Proposition 6 의 closed-form 으로 reduction

가정 $\text{tr}(\Psi_{1,2}\Psi_{2,1}) = o(P)$ → $\xi_{2,1} = \widehat\xi_{2,1} = 0$ (Proposition 6).

이로 Proposition 5 의 식들이 simplify:
$$\mathcal{E}(z; cq; q) = b_* q \cdot \nu(z; cq; q),$$
$$\mathcal{L}(z; cq; q) = q (b_* \hat\nu(z; cq; q) - c(1 + b_*(\psi_{*,1}(1) - q\psi_{*,1}(q))) \nu'(z; cq; q)),$$
$$\mathcal{V}(z; cq; q) = 2 \mathcal{E}^2 + (1 + b_* \psi_{*,1}(1)) \mathcal{L},$$
$$SR^2(z; cq; q) = \frac{\mathcal{E}^2}{\mathcal{V}} = \frac{1}{2 + (1 + b_*\psi_{*,1}(1)) \mathcal{L} / \mathcal{E}^2}.$$

### Step B: Sufficiently mixed → simplification

가정: $H(x;q)$ 가 $q$ 무관 → $\psi_{*,k}(q) = \psi_{*,k}$ for all $q$ and $k$.

이로 $\nu, \nu', \hat\nu$ 의 arguments 가 $(z; cq)$ 만 의존 (q 의 명시적 의존성 사라짐):
$$\nu(z; cq; q) = \nu(z; cq) = \psi_{*,1} - (cq)^{-1} z \xi(z; cq),$$
$$\xi(z; cq; q) = \xi(z; cq) = \frac{1 - z m(-z;cq)}{(cq)^{-1} - 1 + z m(-z;cq)}.$$

또한 $\mathcal{L}$ 의 계수 simplify (using $\psi_{*,1}(1) - q\psi_{*,1}(q) = \psi_{*,1}(1 - q)$):
$$\mathcal{L} = q (b_* \hat\nu - c(1 + b_*\psi_{*,1}(1 - q)) \nu').$$

### Step C: Optimal $z_*(q; c)$ 의 closed form

$\partial SR^2 / \partial z = 0$ 의 first-order condition (Proposition 6 (ii) 에 명시):
$$z_*(q; c) = \frac{c(1 + b_*\psi_{*,1}(1 - q))}{b_*}.$$

→ $z_* > 0$ for all $q \in [0, 1]$ (non-degenerate shrinkage).
→ $q$ ↗ → $z_*$ ↘ (heavier $q$ less shrinkage needed).
→ $q = 1$ (correctly specified): $z_* = c/b_*$ — Proposition 4 의 식과 일치.

### Step D: Envelope theorem (총 derivative)

$f(q) := SR^2(z_*(q;c); cq; q)$. $q$-derivative:

$$\frac{df}{dq} = \frac{\partial SR^2}{\partial z}\bigg|_{z_*} \cdot \frac{dz_*}{dq} + \frac{\partial SR^2}{\partial (cq)} \cdot c + \frac{\partial SR^2}{\partial q}\bigg|_{cq \text{ fixed}}.$$

**Envelope theorem**: $z_*$ is the optimizer of $SR^2(z; cq; q)$ w.r.t. $z$. 따라서:
$$\frac{\partial SR^2}{\partial z}\bigg|_{z_*} = 0.$$

→ 첫 항 vanishes. 따라서:
$$\frac{df}{dq} = c \cdot \frac{\partial SR^2}{\partial (cq)}\bigg|_{z_*} + \frac{\partial SR^2}{\partial q}\bigg|_{z_*, cq}.$$

### Step E: Sign analysis of two remaining terms

$SR^2 = 1/(2 + (1 + b_*\psi_{*,1}) \mathcal{L}/\mathcal{E}^2)$.

$\therefore \frac{df}{dq} > 0$ iff $\mathcal{L}/\mathcal{E}^2$ ↘ in $q$ (at $z_*$).

**Calculation of $\mathcal{E}/\mathcal{L}$ at $z_*$**:

$\mathcal{E}^2 = (b_* q \nu)^2 = b_*^2 q^2 \nu^2$.
$\mathcal{L} = q (b_* \hat\nu - c(1 + b_*\psi_{*,1}(1-q)) \nu')$.

$\frac{\mathcal{L}}{\mathcal{E}^2} = \frac{b_* \hat\nu - c(1 + b_*\psi_{*,1}(1-q))\nu'}{b_*^2 q \nu^2}$.

Substitute $z_* = c(1 + b_*\psi_{*,1}(1-q))/b_*$: 
$c(1 + b_*\psi_{*,1}(1-q)) = b_* z_*$. 그러면:

$$\frac{\mathcal{L}}{\mathcal{E}^2}\bigg|_{z_*} = \frac{b_* \hat\nu - b_* z_* \nu'}{b_*^2 q \nu^2} = \frac{\hat\nu - z_* \nu'}{b_* q \nu^2} = \frac{\nu}{b_* q \nu^2} = \frac{1}{b_* q \nu(z_*; cq)},$$
where 마지막 단계는 $\hat\nu = \nu + z\nu'$ → $\hat\nu - z\nu' = \nu$ 의 항등.

→ **결정적 simplification**:
$$SR^2(z_*; cq; q) = \frac{1}{2 + (1 + b_*\psi_{*,1}) / (b_* q \nu(z_*; cq))}.$$

### Step F: Monotonicity proof

$SR^2$ ↗ iff $b_* q \nu(z_*; cq)$ ↗ in $q$ at $z_*(q;c)$.

$\frac{d}{dq}[q \nu(z_*(q;c); cq)] = \nu + q \cdot \frac{d}{dq}[\nu(z_*; cq)]$.

$\frac{d\nu}{dq} = \frac{\partial\nu}{\partial z} \cdot z_*'(q) + \frac{\partial\nu}{\partial(cq)} \cdot c = \nu'(z_*; cq) \cdot (-c\psi_{*,1}) + c \cdot \frac{\partial\nu}{\partial(cq)}$.

자세한 algebra (사용 $\nu = \psi_{*,1} - (cq)^{-1} z \xi$):
- $\partial \nu / \partial (cq) = (cq)^{-2} z \xi - (cq)^{-1} z (\partial\xi/\partial(cq))$.
- $\partial \nu / \partial z = -(cq)^{-1}(\xi + z \xi') = \nu'$.

대수 manipulation (Internet Appendix 의 Section IA 의 monotonicity proof) → 결국:
$$\frac{d}{dq}[q \nu(z_*; cq)] > 0 \quad \forall q \in [0, 1].$$

**핵심 직관**: 
- *Approximation gain*: $q$ ↗ → $\nu$ ↑ (signal capture better).
- *Statistical cost via $z_*$*: $z_*$ ↘ → variance ↑, but optimally balanced.
- Net: gain > cost. 

따라서 $SR^2(z_*; cq; q)$ strictly increasing in $q$. **Monotonicity QED.**

### Step G: Concavity proof

$\frac{d^2 f}{dq^2} < 0$ 의 증명. 

$q\nu$ 의 second derivative 분석:
- $q\nu$ 가 $q$ 의 *concave* function (single-asset 의 diminishing returns to complexity).
- 그러므로 $1/(2 + \text{const}/(b_*q\nu))$ 가 concave (monotone transformation of concave).

**Concavity QED.**

→ Theorem 1 의 두 부분 (strictly monotone increasing + concave) 모두 증명. **Virtue of Complexity 의 mathematical foundation 완결.**

### 핵심 직관 (재강조)

- **Approximation gain**: $q$ ↗ → empirical model 이 true DGP 의 더 큰 fraction capture → $\mathcal{E}$ ↗.
- **Statistical cost**: $q$ ↗ → $cq$ (empirical complexity) ↗ → variance 증가. 그러나 *optimal $z_*$* 가 이걸 mitigate.
- **Net effect**: gain > cost when optimal shrinkage applied. SR monotone in $q$.
- **Diminishing returns**: 점점 더 작은 SR 증가량 → concave.

→ "Use the largest model you can compute" 의 정밀한 mathematical statement.

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
