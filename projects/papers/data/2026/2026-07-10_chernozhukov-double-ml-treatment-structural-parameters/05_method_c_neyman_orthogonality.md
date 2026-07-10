# 05c. 방법론 — Neyman 직교성

## 왜 이 부분이 필요한가

§05b 에서 확인했듯 정규화 편향은 nuisance 오차의 **1차 항** 이 점수 함수를 통해 $\theta$ 로 흘러드는 데서 온다. Neyman 직교성은 이 1차 항을 원천적으로 0 으로 만드는 점수 함수 재설계 원리다. 이 조건이 세워지면, 남는 편향은 nuisance 오차의 **2차 항 (곱)** 뿐이고 rate 조건으로 관리 가능해진다.

## 정의

**Neyman 직교 조건** (원문 Definition 3.1 위치, 본 환경 원본 PDF 차단 → DoubleML `basics.html` verbatim 골격):

점수 함수 $\psi(W; \theta, \eta)$ 가 참값 $(\theta_0, \eta_0)$ 에서 **모든 방향 $\eta - \eta_0 \in T$** 에 대해  
$$\left. \frac{d}{dt} \mathbb{E}[\psi(W; \theta_0, \eta_0 + t(\eta - \eta_0))] \right|_{t=0} = \partial_\eta \mathbb{E}[\psi(W; \theta_0, \eta_0)] [\eta - \eta_0] = 0$$

이면 $\psi$ 는 $\eta$ 에 대해 Neyman 직교라고 부른다.

**수식 4줄 해석**:
1. **기호 뜻**: $t$ 는 실수 방향 파라미터. $\eta_0 + t(\eta - \eta_0)$ 는 참값 $\eta_0$ 에서 방향 $\eta - \eta_0$ 로 조금 벗어난 nuisance. $\partial_\eta$ 는 Gâteaux 미분 (함수 공간의 방향 도함수).
2. **일상 비유**: 등산 지도에서 정상 (참값) 근처의 평평한 정도. 정상 근처가 완전히 평평하면 (기울기 = 0) 조금 잘못 서 있어도 높이 (= $\theta$ 에 대한 영향) 는 큰 차이 안 남.
3. **왜 이 형태**: $\eta$ 방향 1차 미분이 0 이라는 것은 **모든 방향에서** 성립해야 한다. 특정 방향만 0 이면 그 외 방향으로 편향 흘러들 수 있음.
4. **조심할 점**: 이 조건은 $\theta = \theta_0$ 에서만 요구된다. $\theta$ 가 참값에서 벗어나면 성립하지 않아도 무관.

## Robinson (1988) 잔차 회귀는 왜 Neyman 직교인가

PLR 을 예로 이 조건이 어떻게 유도되는지 보자.

### 소박한 점수 (직교 X)

$$\psi^\text{naive}(W;\theta,g) = D \cdot [Y - D\theta - g(X)]$$

이 점수의 $g$ 에 대한 Gâteaux 미분:  
$$\partial_g \mathbb{E}[\psi^\text{naive}] [g - g_0] = -\mathbb{E}[D \cdot (g(X) - g_0(X))] = -\mathbb{E}[D \cdot (g - g_0)]$$

일반적으로 $D$ 와 $(g - g_0)$ 는 상관되므로 (둘 다 $X$ 의 함수) 이 값은 **0 이 아니다**. 즉 소박한 점수는 직교 X.

### Robinson 잔차 점수 (직교 O)

DoubleML `plm_models.inc` verbatim:  
$$\psi^\text{Rob}(W;\theta,\eta) = [Y - \ell(X) - \theta(D - m(X))][D - m(X)]$$

여기서 $\eta = (\ell, m)$, $\ell_0(X) = \mathbb{E}[Y|X]$, $m_0(X) = \mathbb{E}[D|X]$.

**핵심 대수**: $\ell_0(X) = \theta_0 m_0(X) + g_0(X)$ (이 identity 는 원 모형의 conditional expectation 을 양변에서 취하면 유도됨).

$\ell$ 방향 Gâteaux 미분:  
$$\partial_\ell \mathbb{E}[\psi^\text{Rob}] [\ell - \ell_0] = -\mathbb{E}[(D - m_0(X))(\ell(X) - \ell_0(X))]$$

$D - m_0(X) = V$ 이고 $\mathbb{E}[V|X] = 0$ (모형 가정) 이므로 $\mathbb{E}[V \cdot (\ell - \ell_0)] = \mathbb{E}[\mathbb{E}[V|X] \cdot (\ell - \ell_0)] = 0$. **직교 성립**.

$m$ 방향 Gâteaux 미분:  
$$\partial_m \mathbb{E}[\psi^\text{Rob}] [m - m_0] = \mathbb{E}\left[ \theta_0 (m(X) - m_0(X))(D - m_0(X)) - (Y - \ell_0(X) - \theta_0 (D - m_0(X)))(m(X) - m_0(X)) \right]$$

첫 항: $\mathbb{E}[V \cdot (m - m_0) \theta_0] = 0$ (조건부 무상관).  
둘째 항: $Y - \ell_0(X) - \theta_0(D - m_0(X)) = \zeta$ 이고 $\mathbb{E}[\zeta|X,D] = 0$ 이므로 이 항도 0.  
**직교 성립**.

**결론**: $\psi^\text{Rob}$ 은 $\ell$ 과 $m$ 두 nuisance 방향에서 모두 Neyman 직교. 이것이 Robinson 잔차 회귀가 유일하게 유효한 이유의 이론적 배경.

## Semiparametric Efficiency 와의 연결

Neyman 직교 조건을 만족하는 점수 함수는 사실 통계학의 오래된 개념인 **efficient influence function (EIF)** 과 같다. Robins-Rotnitzky-Zhao 계열 semiparametric efficiency 이론은 이미 1990년대에 다음을 보였다: 임의의 tangent space $T$ 상에서 EIF 는 canonical 하게 유도 가능하며, EIF 를 점수로 쓰면 정확히 Neyman 직교가 성립한다.

이 논문의 새로움은 EIF 를 **ML 예측기와 결합** 하는 이론적 절차를 정식화한 것. EIF 자체는 오래된 개념이다.

## 왜 이 형태가 아니면 안 되는가

**대안 1 — 다른 점수 함수를 쓸 수 있는가?**

원칙적으로 Neyman 직교 조건을 만족하는 $\psi$ 는 unique 하지 않다. 여러 후보가 있을 수 있지만, semiparametric efficiency bound 를 달성하는 것은 EIF 뿐이다. 다른 직교 점수는 유효하지만 asymptotic variance $\sigma^2$ 가 EIF 것보다 크다 (덜 효율적).

**대안 2 — 직교 조건 없이 정확한 $\hat{\eta}$ 을 얻으면?**

nuisance 를 $o_P(n^{-1/2})$ 로 수렴시키면 소박한 plug-in 도 √n-일치. 하지만 이는 저차원 kernel/series 에서만 가능. 고차원에서는 불가능.

**대안 3 — targeted maximum likelihood (TMLE)**

van der Laan 계열의 TMLE 는 nuisance 를 "targeting step" 으로 조정해서 직교 조건을 강제한다. 이론적으로 DML 과 close cousin. 실용적으로는 TMLE 가 finite-sample 안정성에 강점, DML 이 구현 단순성에 강점.

## 이 부분의 핵심 한 문장

**"Neyman 직교 조건은 nuisance 방향 1차 편향의 원천적 제거이며, 이는 semiparametric efficiency 이론의 EIF 를 ML 예측기와 결합하는 canonical 통로다."**
