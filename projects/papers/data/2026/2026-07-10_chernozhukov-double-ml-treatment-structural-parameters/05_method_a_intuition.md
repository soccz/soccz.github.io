# 05a. 방법론 — 전체 흐름 (수식 최소)

## 배경 사다리

이 절을 이해하려면 세 가지만 알면 된다. ① **점수 방정식** — $\theta_0$ 를 identify 하는 방정식 $\mathbb{E}[\psi(W;\theta_0,\eta_0)] = 0$. GMM · MLE 는 모두 이 형태의 특수한 경우. ② **nuisance** — 관심 없지만 추정 안 하면 안 되는 부수 함수 $\eta_0$. 여기서는 조건부 기댓값 $\mathbb{E}[Y|X], \mathbb{E}[D|X]$ 같은 것. ③ **plug-in 추정** — nuisance 를 먼저 추정한 $\hat{\eta}$ 을 방정식에 대입한 뒤 $\theta$ 를 푸는 것.

## 큰 그림 — 3 단계 프로토콜

이 논문의 방법은 딱 3 단계로 이해할 수 있다.

### 단계 1: 모형 선택 + Neyman 직교 점수 함수 정의

관심 인과 모수 $\theta_0$ 에 대해, **어떤 nuisance 오차에도 일차적으로 무감한 점수 함수 $\psi$** 를 유도한다. 예를 들어 PLR $Y = D\theta_0 + g_0(X) + \zeta$ 에서는 소박한 회귀식 $[Y - D\theta - g(X)]D$ 대신 **Robinson 잔차** 형식 $[Y - \ell(X) - \theta(D - m(X))][D - m(X)]$ 를 쓴다. 여기서 $\ell_0(X) := \mathbb{E}[Y|X]$, $m_0(X) := \mathbb{E}[D|X]$. 이 재정식화가 곧 Neyman 직교 조건을 만족한다.

**핵심 통찰**: "$Y$ 를 $X$ 로 잔차화" + "$D$ 를 $X$ 로 잔차화" 를 각각 독립적으로 한 뒤 잔차끼리 회귀. 이 형태가 $\ell, m$ 의 nuisance 오차의 **1차 항** 을 없앤다. 남는 것은 두 오차의 곱 (2차 항) 뿐이며 이는 rate 조건으로 관리 가능.

### 단계 2: K-fold 교차적합

표본 $\{W_i\}_{i=1}^N$ 을 K 개 disjoint 폴드 $(I_k)_{k=1}^K$ 로 무작위 분할. 각 fold $k$ 마다:  
(a) **out-of-fold 학습**: 나머지 $I_k^c$ (= $\{W_i : i \notin I_k\}$) 로 ML 예측기를 학습해 $\hat{\eta}_{0,k}$ 를 얻는다. 어떤 ML 이든 상관없다 (lasso, RF, boosting, NN).  
(b) **in-fold 평가**: $I_k$ 의 관측치들로 점수 함수 $\psi(W_i; \theta, \hat{\eta}_{0,k})$ 를 계산.

**핵심 통찰**: fold 내 데이터로 nuisance 를 학습한 적이 없으므로, 예측기가 과적합했더라도 그 편향이 in-fold 평가에 흘러들 수 없다. 이는 통계 이론에서 "clean" sample splitting 이라고 부르는 것.

### 단계 3: DML1 또는 DML2 로 $\theta$ 추정

DoubleML `algorithms.rst` verbatim:

- **DML1** (fold-wise): 각 fold $k$ 에서 $(1/n)\sum_{i \in I_k} \psi(W_i; \check{\theta}_{0,k}, \hat{\eta}_{0,k}) = 0$ 을 풀어 $\check{\theta}_{0,k}$ 를 얻고, $\tilde{\theta}_0 = (1/K)\sum_k \check{\theta}_{0,k}$ 로 평균.
- **DML2** (pooled): 모든 fold 를 합쳐 단일 방정식 $(1/N)\sum_k \sum_{i \in I_k} \psi(W_i; \tilde{\theta}_0, \hat{\eta}_{0,k}) = 0$ 을 한 번에 풂. DoubleML 기본값.

**핵심 통찰**: DML1 은 fold 별 표본 크기 $n = N/K$ 가 작을 때 finite-sample 편향 큼. DML2 는 fold 정보를 nuisance 에만 쓰고 $\theta$ 는 전역에서 풀어 더 안정적.

## 왜 이 3 단계 구성인가 (대안과 비교)

- **대안 1 — 소박한 plug-in**: $\hat{\eta}$ 을 한 번 학습해서 그대로 대입. 문제: 자기 표본 재사용 + Neyman 직교화 없음 → 정규화 편향 그대로 계승. `basics.html` verbatim — "$|\sqrt{n}(\hat{\theta}_0 - \theta_0)| \to_P \infty$".
- **대안 2 — 단순 sample splitting**: 데이터를 반으로 갈라 A 로 학습, B 로 평가. 문제: 절반 표본만 씀 → 통계 검정력 절반 소실. 이 논문의 K-fold 는 K 번 순환해 절반 손실을 회피.
- **대안 3 — 직교화만 하고 교차적합 없음**: Neyman 직교 점수 + 같은 표본 재사용. 문제: 강한 Donsker 조건 필요 → RF · boosting · NN 사용 불가.

## 이 3 단계의 시너지

**정규화 편향** (nuisance 예측기의 shrinkage/bias 가 $\theta$ 로 흘러드는 문제) → Neyman 직교화가 잡음.  
**과적합 편향** (같은 표본을 두 번 쓰면서 자기 실수를 재사용하는 문제) → K-fold 교차적합이 잡음.  
두 편향이 사라지면 남는 것은 표본 크기 유한 오차뿐 → 표준 CLT 회복 → 표준 신뢰구간 · p-value 재활용.

이 시너지가 이 논문의 미니멀한 아름다움이다. 두 축이 각자 서로 다른 문제를 잡고, 둘 다 필요한 이유가 완전히 orthogonal 하다.

## 한 문장 요약

**"nuisance 를 어떻게 학습하든 상관없다 — 학습된 nuisance 를 어떤 점수 함수 형태로 조합해서 어떤 데이터 분할 프로토콜로 평가할지가 이론을 정한다."**
