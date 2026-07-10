# 04. 핵심 Claim 해체

이 논문의 핵심 주장을 4개로 요약한다. 원문 절 번호는 본문 PDF 접근 실패로 정확한 위치를 단정하지 못하며, 이하 위치 표기는 저자 진영 공식 문서 `docs.doubleml.org/stable/guide/basics.html` · `algorithms.html` 로 교차 확인한 정성 골격이다.

---

## Claim 1 — Neyman 직교화가 정규화 편향을 제거한다

### 주장

nuisance 함수 $\eta_0$ (예: covariate 조건부 기댓값 $g_0, m_0$) 를 어떤 ML 예측기로 추정하든, **점수 함수 $\psi(W;\theta,\eta)$ 가 $\eta$ 에 대해 Neyman 직교 조건**  
$$\partial_\eta \mathbb{E}[\psi(W;\theta_0,\eta_0)][\eta - \eta_0] = 0 \quad \forall \eta \in T$$  
을 만족하면, nuisance 추정 오차 $\hat{\eta} - \eta_0$ 는 $\theta$ 추정치의 asymptotic 분포에 **일차 근사에서** 영향을 주지 않는다. 결과적으로 정규화 편향이 $\theta$ 로 흘러들지 않는다.

### 증거

- **위치**: 원문 Introduction §1.3 "The main idea of the paper" · Theorem 3.1 (일반 정리) · Corollary 3.1 (PLR 특수화). 본문 PDF 차단 → DoubleML `basics.html` 의 "Overcoming regularization bias by orthogonalization" 절 verbatim 으로 정성 확인.
- **핵심 진술**: DoubleML `basics.html` verbatim — "The naive plug-in estimator ... exhibits regularization bias ... $|\sqrt{n}(\hat{\theta}_0 - \theta_0)| \to_P \infty$ (slower than $1/\sqrt{n}$)" · "The framework overcomes bias through partialling out X's effect from D, creating orthogonalized regressor $V = D - m(X)$".

### 숨은 전제

1. **regular parametric 존재**: $\theta_0$ 를 identify 하는 점수 방정식 $\mathbb{E}[\psi(W;\theta_0,\eta_0)] = 0$ 이 존재하고, $\psi$ 가 $\theta$ 에 대해 매끄러워야 한다.
2. **nuisance 수렴률 곱**: 두 nuisance 예측기의 $L^2$ 오차의 곱이 $o_P(n^{-1/2})$ — 즉 각 예측기가 $n^{-1/4}$-rate. 이는 lasso · RF · boosting 은 스탠다드 조건에서 만족하지만 NN 은 조건적.
3. **Neyman 직교 점수의 존재성**: 모형에 따라 존재성이 자명하지 않다. IRM 의 AIPW score 처럼 doubly robust 형태로 유도되거나, PLR 의 Robinson 잔차 회귀처럼 canonical 하게 유도되어야 한다.

### 쉬운 말 풀이

"체중계와 자를 함께 재는 상황" 을 생각해 보자. 체중계는 오차 ±1kg, 자는 오차 ±1cm 로 흔들린다. 두 오차가 서로 곱해져서 BMI 로 들어가면, BMI 오차가 두 오차의 곱보다 훨씬 크게 튀어 나올 수 있다. 그런데 만약 우리가 BMI 를 **체중과 신장 각각의 오차에 대해 미분한 첫 항이 0 이 되도록** 재설계할 수 있다면 (이게 Neyman 직교화), 두 도구 오차의 곱만 남고 첫 항은 사라진다. 두 도구 오차 각각이 아주 작지 않아도 곱은 훨씬 작으므로 안심할 수 있게 된다.

---

## Claim 2 — K-fold 교차적합이 과적합 편향을 제거한다

### 주장

같은 표본으로 nuisance 를 학습하고 그 위에서 $\theta$ 를 풀면 ML 예측기가 자기 실수를 **재사용** 하면서 과적합 편향이 $\theta$ 로 흘러든다. 표본을 K 폴드로 나누고, 폴드 $I_k$ 에서 $\theta$ 를 풀 때 $\hat{\eta}$ 은 $I_k^c$ (나머지 K-1 폴드) 로 학습하면 이 문제는 근본적으로 사라진다. 결과적으로 $\hat{\eta}$ 이 강한 **Donsker 클래스 조건** (function class 의 bracketing entropy 유한) 을 만족하지 않아도 remainder 항이 $o_P(n^{-1/2})$ 로 사라진다.

### 증거

- **위치**: 원문 §3 (일반 이론) · Algorithm 1 (DML1) · Algorithm 2 (DML2). 본문 PDF 차단 → DoubleML `algorithms.rst` verbatim pseudocode 로 정성 확인.
- **핵심 진술**: DoubleML `algorithms.rst` verbatim — "Take a K-fold random partition $(I_k)_{k=1}^K$" · DML1 "solve $(1/n)\sum_{i \in I_k} \psi(W_i;\check{\theta}_{0,k},\hat{\eta}_{0,k}) = 0$ ... aggregate $\tilde{\theta}_0 = (1/K)\sum_k \check{\theta}_{0,k}$" · DML2 "solve $(1/N)\sum_k \sum_{i \in I_k} \psi(W_i;\tilde{\theta}_0,\hat{\eta}_{0,k}) = 0$". DoubleML `basics.html` verbatim — "$c^*$ vanishes under sample splitting".

### 숨은 전제

1. **K 는 충분히 크지만 유한**: 통상 K=5 (DoubleML 기본값) 또는 K=10. K=n (leave-one-out) 은 이론적으로는 유효하지만 계산 비용 상 사용 안 함.
2. **폴드 분할이 독립**: 시계열 · 클러스터 데이터에서는 fold 가 correlated 해서 표준 K-fold 는 부적합. block-CV · purged-CV 확장 필요.
3. **DML2 우선 권장**: DoubleML 공식 문서 verbatim — "DML2 is recommended to obtain more stable estimates". 이론 상 둘 다 유효하지만 유한 표본 성능 차이 존재.

### 쉬운 말 풀이

시험 문제를 학생이 스스로 만들고 스스로 풀면, 자신이 잘 아는 부분만 문제로 내고 정답을 알기 때문에 점수가 부풀려진다. 이를 막으려면 학급을 반으로 나눠 한쪽이 문제 를 만들고 다른 쪽이 풀게 해야 한다. 두 반을 K 번 교대하면 모든 학생이 공정하게 시험을 볼 수 있다. 이것이 K-fold 교차적합이 하는 일이다.

---

## Claim 3 — 두 축의 조합이 √n-일치 asymptotic normal 을 회복시킨다

### 주장

Neyman 직교 점수 + K-fold 교차적합 = 표준 CLT: 어떤 ML 예측기든 nuisance rate 조건 (각 예측기 $L^2$ 수렴률 $o_P(n^{-1/4})$, 곱 $o_P(n^{-1/2})$) 만 만족하면  
$$\sqrt{n}(\tilde{\theta}_0 - \theta_0) \to_d N(0, \sigma^2)$$  
가 성립하고, $\sigma^2$ 는 표준적으로 sandwich 형태로 추정 가능. 신뢰구간·가설검정이 통상적 통계 도구로 진행된다.

### 증거

- **위치**: 원문 Theorem 3.1 (일반) · Theorem 4.1/4.2 (PLR/IRM 특수화). DoubleML `basics.html` verbatim — "$\sqrt{n}(\check{\theta}_0 - \theta_0) = a^* + b^* + c^*$, $a^*$ remains asymptotically normal, $b^*$ vanishes asymptotically for many DGPs, $c^*$ vanishes under sample splitting".

### 숨은 전제

1. **$\psi$ 는 $\theta$ 에 대해 미분 가능**: Jacobian 항 $J_0 := \partial_\theta \mathbb{E}[\psi(W;\theta_0,\eta_0)]$ 이 정의되고 역행렬을 가져야 한다. 이는 identification 조건.
2. **표본 iid** (또는 stationary + strong mixing 확장): 시계열 응용에서는 mixing 조건 필요.
3. **remainder 항 $b^*$ 의 소실 조건**: 저자들이 "many DGPs" 라고 부르는 조건은 sufficient 하지만 필요조건은 아님. 특수한 DGP 에서는 $b^*$ 가 살아남을 수 있다.

### 쉬운 말 풀이

Neyman 직교화가 "체계적 편향" 을 없애고, 교차적합이 "우연한 과적합 편향" 을 없앤다. 이 두 편향이 사라지면 남는 것은 표본 크기 $n$ 이 유한해서 생기는 자연 오차뿐이고, 이는 CLT 로 정규분포로 수렴한다. 그 결과 표준 오차 · 신뢰구간 · p-value 를 그대로 쓸 수 있다.

---

## Claim 4 — 이 프레임은 PLR/PLIV/IRM/IIVM 네 canonical 모형에 즉시 적용 가능

### 주장

같은 이론 프레임을 4개의 대표 인과 모형에 특수화한다: (i) PLR $Y = D\theta_0 + g_0(X) + \zeta$, (ii) PLIV (endogenous $D$ + instrument $Z$), (iii) IRM $Y = g_0(D,X) + U$ (fully heterogeneous), (iv) IIVM (endogenous + heterogeneous). 각 모형별로 Neyman 직교 점수 함수를 명시적으로 유도하고, DoubleML 패키지가 이를 그대로 구현.

### 증거

- **위치**: 원문 §4 (PLR) · §5 (IRM 및 401(k) 응용) · Appendix (PLIV/IIVM 확장). DoubleML `plm_models.inc` + `irm_models.inc` verbatim 로 각 점수 함수 확인.
- **PLR partialling-out score verbatim** (`plr_model` doc): $[Y - \ell(X) - \theta(D - m(X))][D - m(X)]$, 여기서 $\ell_0(X) := \mathbb{E}[Y|X] = \theta_0 \mathbb{E}[D|X] + g_0(X)$.
- **IRM ATE score** (`irm_models.inc` verbatim 골격): $\psi_{ATE} = g_1(X) - g_0(X) + \frac{D(Y - g_1(X))}{m(X)} - \frac{(1-D)(Y - g_0(X))}{1 - m(X)} - \theta$ (AIPW/doubly robust form).

### 숨은 전제

1. **관측 가정 (unconfoundedness)**: IRM 에서 $\{Y(0), Y(1)\} \perp D | X$ 가 성립해야 한다. 관측되지 않은 confounder 가 없어야 함.
2. **overlap 조건**: propensity $m_0(X) \in (0, 1)$ almost surely — 처치·통제 그룹이 모든 $X$ 값에서 존재해야 한다. IPW 분모 안정성.
3. **IV 응용의 배제 조건 (exclusion restriction)**: PLIV/IIVM 에서 $Z$ 가 $D$ 를 통해서만 $Y$ 에 영향을 줘야 한다.

### 쉬운 말 풀이

"신약 효과를 재는 표준 실험 셋업" 을 딱 4가지로 정리해 놓았다: 처치가 연속인 경우 (PLR), 처치가 다른 무엇에 영향받는 경우 (PLIV, 도구 변수 필요), 처치가 이산이고 효과가 사람마다 다른 경우 (IRM), 이산 + 도구 (IIVM). 어떤 상황이든 이 논문의 점수 함수를 그대로 쓰면 되고, 각 상황이 뭘 요구하는지도 명시되어 있다.
