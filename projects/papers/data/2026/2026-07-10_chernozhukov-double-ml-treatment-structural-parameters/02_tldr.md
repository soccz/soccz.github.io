# 02. 3층 TL;DR

## 🧒 초등학생 수준 — 400~600자

숲속 오솔길에서 어른들의 신장 차이가 걷는 속도에 얼마나 영향을 주는지 알고 싶다고 해 보자. 사실 신장은 나이·성별·건강 상태 같은 수많은 다른 조건과 얽혀 있다. 그냥 신장과 속도만 놓고 재면 나이의 영향이 신장으로 착각돼 섞여 들어간다. 그래서 우리는 "나이·성별·건강 상태를 다 알고 있는 예언자" 를 옆에 두고, 예언자가 예상한 신장·속도를 빼고 남은 "예상 밖의 부분" 만 가지고 비교하는 것이 정답이다.

이 논문의 아이디어는 예언자로 아무 머신러닝 모델이나 쓰라는 것이다. 랜덤 포레스트든 딥러닝이든 상관없다. 대신 두 가지 트릭이 붙는다. 첫째, 예언자를 만들 때 쓴 자료로 다시 비교하면 예언자가 자기 실수를 감춰 버리기 때문에, **자료를 반으로 갈라 한쪽으로 예언자를 만들고 다른 쪽에서 예언자를 시험하는 방식** 을 K 번 반복한다 (교차적합). 둘째, 비교하는 공식을 "예언자가 조금 틀려도 결과가 흔들리지 않는 특별한 모양" 으로 만들어 둔다 (직교화). 이 두 트릭을 합치면 어떤 예언자를 쓰더라도 "신장이 속도에 미치는 진짜 영향" 을 편향 없이 잴 수 있게 된다.

## 🎓 학부생 수준 — 500~800자

관심 있는 인과 모수는 저차원 $\theta_0$ (예: 처치 효과) 이고, 그와 얽힌 방해 요인은 고차원 nuisance $\eta_0$ (예: covariate 함수 $g_0(X)$, $m_0(X)$) 라고 하자. 고전적 접근은 $\eta_0$ 를 parametric 모형으로 명시하고 MLE/GMM 으로 함께 추정했지만, 현실은 $\dim X$ 가 너무 커서 parametric 가정을 붙일 수 없다. 그렇다고 $\hat{\eta}_0$ 을 임의의 ML 예측기 (lasso · RF · boosting · NN) 로 갈아 끼우고 소박하게 $\hat{\theta}_0$ 을 얻으면, ML 의 정규화 편향 (regularization bias) 이 $\hat{\theta}_0$ 에 직접 흘러들어 $\sqrt{n}(\hat{\theta}_0 - \theta_0) \to_P \infty$ 로 발산한다.

논문은 이 문제를 두 축으로 해결한다. **① Neyman 직교화**: 점수함수 $\psi(W;\theta,\eta)$ 를 $\eta$ 에 대한 Gâteaux 미분 $\partial_\eta \mathbb{E}[\psi(W;\theta_0,\eta_0)][\eta - \eta_0] = 0$ 이 성립하도록 재설계한다 (예: PLR 에서 $Y$ 와 $D$ 를 각각 $\ell(X), m(X)$ 로 잔차화). 이 조건이 있으면 nuisance 추정 오차가 $\theta$ 추정에 **일차 근사에서** 영향을 주지 않는다. **② K-fold 교차적합**: 표본을 K 폴드로 나눠, $k$-폴드에서 $\theta$ 를 풀 때 쓰는 $\hat{\eta}$ 은 나머지 K-1 폴드로 학습한다. 이는 ML 예측기의 강한 엔트로피 조건 (Donsker class) 없이도 remainder 항이 $o_P(n^{-1/2})$ 로 사라지게 만든다. 두 축 합계로 $\sqrt{n}(\tilde{\theta}_0 - \theta_0) \to N(0, \sigma^2)$ 의 표준 asymptotic 을 회복한다.

## 🔬 전문가 수준 — 600~1,000자

**주요 기여 4가지**:

1. **일반 프레임워크의 정식화**: 관심 모수 $\theta_0 \in \Theta \subset \mathbb{R}^{d_\theta}$ 를 nuisance $\eta_0 \in T$ (임의 차원 — 함수, 밀도, 분포 등) 를 포함하는 점수 방정식 $\mathbb{E}[\psi(W;\theta_0,\eta_0)] = 0$ 로 identify 하고, **Neyman 직교 조건** $\partial_\eta \mathbb{E}[\psi(W;\theta_0,\eta_0)][\eta - \eta_0] = 0$ (모든 $\eta \in T$) 을 만족하는 $\psi$ 를 사용할 때 원하는 asymptotic normality 를 얻는 일반 정리 (Theorem 3.1/3.2 로 알려짐).

2. **DML1/DML2 알고리즘**: $K$-fold 교차적합 (fold $I_k$ 의 nuisance 를 $I_k^c$ 로 학습, $I_k$ 에서 $\theta$ 를 evaluate) 을 **fold 별 해 → 평균** (DML1) 과 **전역 stacking → 단일 해** (DML2) 두 형태로 정식화. 저자 진영 공식 문서는 DML2 를 안정성 이유로 기본값 권장.

3. **4개 대표 모델의 완전 구현**: (i) Partially Linear Regression (PLR) $Y = D\theta_0 + g_0(X) + \zeta$, $D = m_0(X) + V$ 의 partialling-out 점수 $\psi = [Y - \ell(X) - \theta(D - m(X))][D - m(X)]$; (ii) Partially Linear IV (PLIV) 의 lasso-free 확장; (iii) Interactive Regression Model (IRM) $Y = g_0(D,X) + U$ 의 ATE score $\psi_{ATE} = g_1(X) - g_0(X) + \frac{D[Y-g_1(X)]}{m(X)} - \frac{(1-D)[Y-g_0(X)]}{1-m(X)}$ (AIPW/doubly robust score); (iv) Interactive IV (IIVM) 의 LATE 점수.

4. **실증 응용**: 401(k) 저축 계획 자산 (N=9,915) 에서 계획 참여의 순자산 효과 추정. Angrist-Krueger 1995 계열 IV 결과와 비교해, 다양한 ML nuisance 예측기 (regression tree, RF, boosting, lasso, NN) 를 갈아 끼워도 DML 추정치가 강건하게 유지됨을 보임.

**방어 가능한 주장**: (a) Neyman 직교 조건은 통계적 방편이 아니라 semiparametric efficiency bound 로부터 canonical 하게 유도되는 조건 — 아무 재정식화가 아니다. (b) K-fold 는 sample splitting 을 다시 쓰지 않아 통계 검정력 손실이 없으면서 Donsker 조건을 우회한다. **한계**: nuisance rate 조건 $\|\hat{m} - m_0\|_{L^2} \cdot \|\hat{\ell} - \ell_0\|_{L^2} = o_P(n^{-1/2})$ 는 "각 예측기가 $n^{-1/4}$ 로 수렴" 이라는 실무적 요구를 남기며, 이는 sparse lasso · RF · boosting 은 표준 조건에서 만족되지만 딥러닝은 network 폭·깊이·정규화에 강한 제약 필요.
