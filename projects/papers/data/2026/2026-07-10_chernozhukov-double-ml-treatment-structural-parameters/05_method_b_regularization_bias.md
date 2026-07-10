# 05b. 방법론 — 정규화 편향의 정체

## 왜 이 부분이 필요한가

DML 이라는 프레임을 이해하려면 먼저 "그냥 ML 을 쓰면 왜 안 되는가?" 를 정확히 이해해야 한다. 이 절은 **정규화 편향 (regularization bias)** 이라는 원흉을 해부해 소박한 plug-in 이 왜 발산하는지 (`|\sqrt{n}(\hat{\theta}_0 - \theta_0)| \to_P \infty`) 를 밝힌다. 이해하고 나면 §05c 의 Neyman 직교화가 정확히 이 발산을 어떻게 잡는지가 자명해진다.

## 세팅 (PLR 을 예시로)

DoubleML `basics.html` verbatim 세팅을 그대로 쓴다:  
$$Y_i = D_i \theta_0 + g_0(X_i) + \zeta_i, \qquad \zeta_i \sim N(0,1)$$  
$$D_i = m_0(X_i) + V_i, \qquad V_i \sim N(0,1)$$  

- $Y$: 결과 (outcome)
- $D$: 처치 (treatment) — 관심 있는 인과 원인
- $X$: 고차원 covariate (혼란변수 후보)
- $\theta_0$: 관심 인과 모수 (처치 효과)
- $g_0(X)$: outcome 의 conditional expectation 잔여 (nuisance)
- $m_0(X)$: propensity — treatment 의 conditional expectation (nuisance)

**수식 4줄 해석**:
1. **기호 뜻**: $\zeta, V$ 는 표준정규 오차. 실제 논문에서는 iid + $\mathbb{E}[\zeta|X,D] = 0, \mathbb{E}[V|X] = 0$ 만 가정.
2. **일상 비유**: 신약 실험에서 회복률 $Y$, 신약 복용 $D$, 나이·건강 $X$ 라고 하자. $g_0(X)$ 는 "나이/건강만 봤을 때 예상 회복", $m_0(X)$ 는 "나이/건강만 봤을 때 신약 처방 확률".
3. **왜 이 형태**: $Y$ 에는 $D$ 가 선형으로 들어가지만 $X$ 는 nonparametric $g_0$ 로 들어감. 이 "partial linearity" 가 $\theta_0$ identify 를 편하게 만든다.
4. **조심할 점**: unconfoundedness 가정 — $\zeta \perp D | X$. 관측되지 않은 confounder 가 있으면 identify 자체가 불가능.

## 소박한 plug-in 추정 — 발산하는 이유

가장 자연스러운 접근:

$$\hat{\theta}_0^{\text{naive}} = \left( \frac{1}{n}\sum_i D_i^2 \right)^{-1} \frac{1}{n}\sum_i D_i (Y_i - \hat{g}_0(X_i))$$

즉 $Y$ 에서 ML 예측 $\hat{g}_0(X)$ 을 빼서 잔차를 만들고, $D$ 와 회귀. 이 식은 $\mathbb{E}[\zeta|X,D]=0$ 아래서 population level 로 identify 는 맞지만 finite-sample 성능이 참담하다.

### 편향 분해

$\sqrt{n}(\hat{\theta}_0^{\text{naive}} - \theta_0)$ 를 대수적으로 분해하면 다음 세 성분이 나온다 (DoubleML `basics.html` verbatim 골격):

$$\sqrt{n}(\hat{\theta}_0^{\text{naive}} - \theta_0) = a^\text{naive} + b^\text{naive} + c^\text{naive}$$

- $a^\text{naive}$: 통상 CLT 로 $N(0, \sigma^2)$ 로 수렴 — **좋은 항**
- $b^\text{naive}$: $\hat{g}_0 - g_0$ 의 **1차 편향** 이 $\theta$ 로 흘러드는 항 — 이 항이 문제
- $c^\text{naive}$: 자기 표본 재사용으로 인한 과적합 편향 항

**핵심 문제**: $b^\text{naive} = O_P(\sqrt{n} \cdot \|\hat{g}_0 - g_0\|_{L^2})$ 형태. 만약 $\|\hat{g}_0 - g_0\|_{L^2} = O_P(n^{-\alpha})$ 이면 $b^\text{naive} = O_P(n^{1/2 - \alpha})$. lasso · RF · boosting 은 통상 $\alpha \le 1/4$ 밖에 안 되므로 $b^\text{naive} \to_P \infty$. 이것이 발산 원인.

### 왜 ML 이면 반드시 $\alpha \le 1/4$ 이 되는가

이는 curse of dimensionality 의 다른 이름이다. covariate 차원 $\dim X = d$ 가 커지면 minimax nonparametric rate 는 $n^{-s/(2s+d)}$ 로 떨어진다 (Hölder smoothness $s$). $d$ 가 두 자리 수만 되어도 $s/(2s+d) < 1/4$ 는 사실상 강제된다. 이것이 semiparametric literature (Robinson 1988) 이 저차원에만 통했던 이유.

**정규화 편향의 3 가지 원천**:
1. **shrinkage**: lasso · ridge · elastic net 은 $L_1/L_2$ 페널티로 계수를 0 쪽으로 당긴다. 이 shrinkage 가 잔차의 평균에 남는다.
2. **early stopping**: boosting · NN 에서 검증 오차 최소화 지점에 멈추면 잔여 편향이 있다.
3. **tree ensemble 의 boundary bias**: RF 는 leaf 경계에서 nonparametric bias 지속.

## 왜 Neyman 직교화가 이 문제를 해결하는가 (미리보기)

이 절의 결론: **$b^\text{naive}$ 는 $\hat{g}_0 - g_0$ 의 1차 항이다. 만약 우리가 점수 함수를 재설계해서 $\eta$ 방향의 1차 미분이 0 이 되게 한다면, $b^\text{naive}$ 자리에는 2차 항 (즉 $\hat{g}, \hat{m}$ 두 오차의 곱) 만 남는다.** 두 오차의 곱은 $O_P(\|\hat{g}-g\|_{L^2} \cdot \|\hat{m}-m\|_{L^2})$. 각 오차가 $O_P(n^{-1/4})$ 이면 곱은 $O_P(n^{-1/2})$, 즉 $\sqrt{n}$ 을 곱해도 $O_P(1)$ 로 정리되어 asymptotic normal 이 살아남는다.

이것이 다음 절 §05c 에서 정식화될 통찰의 원자.

## 대안 접근과 비교

| 접근 | 편향 항 | ML 예측기 종류 | 표본 크기 요구 |
|------|---------|----------------|----------------|
| Robinson (1988) kernel | $b^\text{kernel} = O_P(\sqrt{n} \cdot n^{-2/(4+d)})$ | kernel/series only | 저차원 $d \le 5$ |
| 소박 plug-in ML | $b^\text{naive} = O_P(n^{1/2 - \alpha})$, $\alpha \le 1/4$ | 아무 ML | 발산 |
| BCH 2014 sparse | $b^\text{BCH} = O_P(\sqrt{n} \cdot s \log p / n)$ | lasso only | sparsity $s$ 조건 |
| **이 논문 DML** | $b^\text{DML} = O_P(\sqrt{n} \cdot \|\hat{g}-g\| \cdot \|\hat{m}-m\|)$ | 아무 ML | rate 조건만 |

DML 은 마지막 행에 해당한다. 편향 항이 두 오차의 곱으로 바뀌면서 각 예측기 요구가 $n^{-1/4}$ 로 완화된다.

## 핵심 한 문장

**"소박한 plug-in 이 발산하는 이유는 nuisance 오차가 점수 함수에 1차 항으로 침투하기 때문이며, 이 침투 경로를 없애면 (Neyman 직교화) 문제는 정확히 두 오차의 곱만큼으로 축약된다."**
