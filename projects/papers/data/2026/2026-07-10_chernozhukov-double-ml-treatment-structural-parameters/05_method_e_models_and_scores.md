# 05e. 방법론 — 4 모형과 점수 함수

## 왜 이 부분이 필요한가

Neyman 직교화 (§05c) 와 교차적합 (§05d) 은 이론 프레임. 실제 응용에서는 **어떤 인과 모형** 을 세우고, 그 모형에 맞는 **점수 함수 $\psi$** 를 명시해야 한다. 이 논문은 4개의 canonical 모형에 대해 완전한 점수 함수를 제공한다. 이 절은 각 모형의 세팅과 점수를 정리한다. 모든 정의는 DoubleML `plm_models.inc`, `irm_models.inc` verbatim + 저자 공식 문서 `docs.doubleml.org` 로 확인.

---

## 1. PLR — Partially Linear Regression

### 모형

$$Y = D\theta_0 + g_0(X) + \zeta, \qquad \mathbb{E}[\zeta | X, D] = 0$$
$$D = m_0(X) + V, \qquad \mathbb{E}[V | X] = 0$$

- $Y$: 결과 (연속)
- $D$: 처치 (연속 또는 이산)
- $X$: covariate
- $\theta_0 \in \mathbb{R}$: 관심 인과 모수

### 점수 함수 — Partialling-out (기본)

DoubleML `plr_model` verbatim:  
$$\psi^\text{PO}(W;\theta,\eta) = [Y - \ell(X) - \theta(D - m(X))][D - m(X)]$$

- $\eta = (\ell, m)$
- $\ell_0(X) := \mathbb{E}[Y|X]$: outcome 조건부 기댓값 (nuisance)
- $m_0(X) := \mathbb{E}[D|X]$: propensity (nuisance)

**수식 4줄 해석**:
1. **기호 뜻**: 안쪽 브래킷은 "잔차화된 결과 - $\theta$ × 잔차화된 처치". 바깥 곱은 orthogonalized regressor.
2. **일상 비유**: 신장 → 속도 관계에서 나이·건강 영향을 각각 뺀 잔차만으로 회귀.
3. **왜 이 형태**: Robinson (1988) 이 이미 이 형태를 유도. 여기서는 $\ell, m$ 을 ML 로 학습해도 이론이 통용됨을 보임.
4. **조심할 점**: $\ell_0$ 은 $g_0$ 이 아니다. $\ell_0(X) = \theta_0 m_0(X) + g_0(X)$ 인 별개 nuisance. 이걸 혼동하면 코드 버그.

### 점수 함수 — IV-type (대안)

DoubleML verbatim — "IV-type score" 라는 대안이 있고, $g_0$ 을 명시적으로 사용. 세부 정확한 식은 원문 확인 필요.

### 응용

- **연속 처치의 인과 효과**: 광고 지출액 → 매출, 교육 연수 → 소득
- **가격 → 수요**: $Y$ = 수요, $D$ = 가격, $X$ = 지역·시간·경쟁자 가격

---

## 2. PLIV — Partially Linear IV Regression

### 모형

$$Y = D\theta_0 + g_0(X) + \zeta$$
$$D = m_0(X, Z) + V$$
$$Z = ?$$ (외생 instrument)

- $Z$: 도구 변수 (instrument) — $D$ 에 영향 주지만 $Y$ 에 직접 영향은 안 주는 변수
- $D$: **내생** 처치 (endogenous — unobserved confounder 존재 가능)

### 점수 함수

$$\psi^\text{PLIV}(W;\theta,\eta) = [Y - \ell(X) - \theta(D - r(X))][Z - m(X)]$$

- $\eta = (\ell, m, r)$, $\ell_0(X) = \mathbb{E}[Y|X]$, $m_0(X) = \mathbb{E}[Z|X]$, $r_0(X) = \mathbb{E}[D|X]$
- 3 개 nuisance 로 확장

**핵심 통찰**: 바깥 곱을 $D - r(X)$ 가 아니라 **$Z - m(X)$** 로 바꾼 게 핵심. $Z$ 는 unobserved confounder 와 무관하므로 identify 가 유효.

### 응용

- **금융 factor 회귀에서 alpha 검정 (endogenous factor)**: $Y$ = 자산 수익률, $D$ = 관심 factor loading, $Z$ = macro instrument, $X$ = 다른 factor 통제
- **교육 → 소득 인과**: $D$ = 교육 연수 (선택 편향 있음), $Z$ = 자녀 태어난 분기 (Angrist-Krueger 1991), $X$ = 다른 controls

---

## 3. IRM — Interactive Regression Model

### 모형

$$Y = g_0(D, X) + U, \qquad \mathbb{E}[U|X,D] = 0$$
$$D \in \{0, 1\}, \qquad \Pr(D=1|X) = m_0(X)$$

DoubleML `irm_models.inc` verbatim 골격 — "Y = g_0(D, X) + U, where treatment effects are fully heterogeneous."

- $D \in \{0,1\}$: 이산 이항 처치
- $g_0(D,X)$: **처치별로 다른** conditional expectation. $g_0(1,X), g_0(0,X)$ 를 각각 학습.
- $m_0(X)$: propensity score
- 관심 모수: ATE $\theta_0 = \mathbb{E}[g_0(1,X) - g_0(0,X)]$

### 점수 함수 — ATE (AIPW / Doubly Robust)

$$\psi^\text{ATE}(W;\theta,\eta) = g_1(X) - g_0(X) + \frac{D(Y - g_1(X))}{m(X)} - \frac{(1-D)(Y - g_0(X))}{1 - m(X)} - \theta$$

- $\eta = (g_0, g_1, m)$
- $g_1(X) := g_0(1, X) = \mathbb{E}[Y|D=1,X]$
- $g_0(X) := g_0(0, X) = \mathbb{E}[Y|D=0,X]$

**수식 4줄 해석**:
1. **기호 뜻**: 첫 두 항 = 회귀 기반 ATE 추정. 다음 두 항 = IPW (Inverse Propensity Weighting) 보정. 뺀 $\theta$ = moment equation form.
2. **일상 비유**: 신약 그룹과 위약 그룹의 예측 회복률 차이 (회귀 부분) + 실제 관측된 잔차를 propensity 로 재가중한 보정 (IPW 부분).
3. **왜 이 형태**: **Doubly robust** 성질 — $g$ 정확 하나만 맞아도 (또는 $m$ 정확 하나만 맞아도) $\theta$ 추정 무편향. Bang-Robins 2005 계열 canonical.
4. **조심할 점**: overlap 위반 시 IPW 분모 $m(X) \to 0$ 또는 $1$ 로 발산 → 추정치 불안정. 실무에서는 $m(X)$ 를 $[0.01, 0.99]$ 로 clipping 하는 hack 사용.

### 점수 함수 — ATTE (Average Treatment Effect on Treated)

관심 모수 $\theta_0^{ATTE} = \mathbb{E}[Y(1) - Y(0) | D=1]$ 에 대한 별개 점수 함수. DoubleML verbatim 로 지원.

### 응용

- **401(k) 참여의 자산 효과**: $D$ = 참여 여부, $Y$ = 순자산, $X$ = 소득·교육·연령·저축성향
- **온라인 광고 인과 매출**: $D$ = 노출, $Y$ = 구매, $X$ = 과거 로그

---

## 4. IIVM — Interactive IV Model

### 모형

$$Y = g_0(Z, X) + U, \quad D = m_0(Z, X) + V, \quad Z \in \{0,1\}$$

- $Z$: 이산 instrument
- $D$: 이산 endogenous treatment
- 관심 모수: LATE (Local Average Treatment Effect) — complier group 의 처치 효과

### 점수 함수

LATE 를 정의하는 canonical Wald-type identification 을 AIPW 형식으로 확장한 점수. DoubleML `iivm` 문서 참조.

### 응용

- **의무교육법 → 소득**: $Z$ = 의무교육 연장 여부, $D$ = 실제 교육 이수 여부, $Y$ = 소득

---

## 4 모형의 축약 지도

| 모형 | 처치 $D$ | 도구 $Z$ | Heterogeneity | Nuisance 수 |
|------|---------|---------|--------------|-------------|
| PLR | 연속 | 없음 | 없음 (평균 효과만) | 2 ($\ell, m$) |
| PLIV | 연속 endogenous | 필요 | 없음 | 3 ($\ell, m, r$) |
| IRM | 이산 이항 | 없음 | 완전 heterogeneous | 3 ($g_0, g_1, m$) |
| IIVM | 이산 endogenous | 이산 | 완전 heterogeneous | 4+ |

## 대안 접근

- **G-computation only**: $g_0(D,X)$ 만 추정하고 $\theta = \mathbb{E}[g_1 - g_0]$ 을 plug-in. 문제: propensity 편향 방어 없음.
- **IPW only**: $m_0(X)$ 만 추정하고 $\theta = \mathbb{E}[\frac{DY}{m} - \frac{(1-D)Y}{1-m}]$. 문제: outcome 편향 방어 없음.
- **AIPW = 이 논문 IRM ATE score**: 둘 다 결합. Doubly robust.

## 이 부분의 핵심 한 문장

**"PLR/PLIV/IRM/IIVM 4 개 모형은 인과 추론에서 마주치는 대부분 문제 (연속/이산 처치 × 도구 유무 × heterogeneity 유무) 를 커버하며, 각 모형별로 canonical 하게 유도된 Neyman 직교 점수 함수는 DoubleML 패키지에서 그대로 사용 가능하다."**
