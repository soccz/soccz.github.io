# 4. 방법론 (B) — OCE / Entropy / CVaR 목적함수

## 배경 사다리

이 절을 이해하려면 ① **utility function** $u(\cdot)$ 이 "돈의 효용" — 같은 100만원이라도 부자에겐 작은 효용, 가난한 이에겐 큰 효용 — 을 모델링한다는 점, ② **monetary risk measure** $\rho(X)$ 가 손실분포 $X$ 를 "버틸 수 있게 만드는 현금량" 으로 정의된다는 점, ③ **sup / inf 가 단순한 "어떤 변수에 대해 가장 큰/작은 값"** 일 뿐임 — 이 세 가지면 충분하다.

## OCE 의 정의

저자 GitHub `Network.md` verbatim:

$$
U(X) := \sup_y \big\{ \mathbb{E}[u(X+y)] - y \big\}
$$

이를 risk measure 로 변환하면 $\rho(X) := -U(-X)$. 즉

$$
\rho(X) = \inf_y \big\{ y + \mathbb{E}[\ell(-X-y)] \big\} \quad \text{where} \quad \ell(\cdot) = -u(-\cdot)
$$

이 OCE 정의는 **Ben-Tal & Teboulle (Math. Finance 2007)** 의 "Optimized Certainty Equivalent" 에서 따왔다. 핵심 통찰: cash-invariant convex risk measure 의 (특별한) 부분집합이 OCE 로 표현된다 — Entropic, Expected Shortfall, mean-CVaR, mean-deviation 등 실용 측도가 거의 모두 포함.

### 수식 4줄 해석

- **기호 뜻**: $X$ 는 손익 (random variable, 단위 = 통화). $y$ 는 스칼라 (단위 = 통화) — "기준 현금량". $u$ 는 단조증가·오목 utility — 한계효용 체감. $\mathbb{E}$ 는 simulator 측도 $\mathbb{P}$ 하의 기댓값.
- **일상 비유**: 가난한 친구에게 도움 줄 때 "월 50만원을 미리 주고 + 의외의 흑자가 났을 때 추가 효용" 식의 거래. $y$ 가 미리 주는 액수, $\mathbb{E}[u(X+y)] - y$ 가 거래의 순 효용. 가장 좋은 $y$ 를 찾아 sup.
- **왜 이 형태**: $\sup_y$ 가 1차원 — gradient 가 1 차원으로 흐름. CVaR 같은 비미분 측도도 단순 dual 로 풀린다 (Rockafellar-Uryasev 2000 의 CVaR optimization 공식이 정확히 이 OCE 형태).
- **조심할 점**: $u$ 가 미분가능하지 않으면 (CVaR 의 hinge) subgradient 로 SGD. heavy-tail $X$ 에서 $\mathbb{E}[u(X+y)] < \infty$ 가 깨지면 학습 발산.

## 4가지 구체적 utility

### B-1) Entropic / Exponential

저자 `Network.md` verbatim:
$$
u(x) = \frac{1 - e^{-\lambda x}}{\lambda}, \quad \lambda > 0
$$

이로부터 risk measure 는 entropic
$$
\rho^{ent}_\lambda(X) = \frac{1}{\lambda} \log \mathbb{E}[e^{-\lambda X}]
$$
(Ben-Tal & Teboulle 의 OCE-Entropic 등치). $\lambda$ 는 위험회피 강도. $\lambda \to 0^+$ 면 $\rho \to -\mathbb{E}[X]$ (위험중립), $\lambda \to \infty$ 면 worst-case.

- **기호 뜻**: $\lambda$ = 위험회피계수 (단위 = 1/통화). $\mathbb{E}[e^{-\lambda X}]$ 는 손실의 moment generating function — heavy tail 일수록 매우 큼.
- **일상 비유**: "1억 손실의 두려움 = 1억의 effective 가치를 (1-e^{-λ·1억})/λ 배 정도로 평가" — λ 크면 손실을 더 무겁게.
- **왜 이 형태**: 지수 utility 는 absolute risk aversion 일정 ($u''/u' = -\lambda$) — 부의 절대수준 무관 (CARA). 분석적으로 가장 친화 — entropic risk 의 dual representation 이 KL divergence 와 연결.
- **조심할 점**: $\mathbb{E}[e^{-\lambda X}] = \infty$ 이면 (예: $X$ 가 Cauchy 꼬리) 정의 불가. 실제 금융 손실분포는 fat-tail 일 수 있어 작은 $\lambda$ 사용 권장.

### B-2) CVaR / Expected Shortfall

저자 `Network.md` verbatim:
$$
u(x) = (1+\lambda) \min(0, x), \quad \text{with} \quad \alpha = \frac{\lambda}{1+\lambda}
$$

이로부터
$$
\rho^{CVaR}_\alpha(X) = \frac{1}{1-\alpha} \mathbb{E}[(-X - \mathrm{VaR}_\alpha)_+] + \mathrm{VaR}_\alpha
$$
(Rockafellar-Uryasev 2000 의 표현과 본질적 등가). $\alpha$ 는 신뢰수준 — 보통 $\alpha \in \{0.95, 0.975, 0.99\}$. 저자 예시 $\lambda=1 \Rightarrow \alpha=0.5$ (실무에선 잘 안 씀, 데모용).

- **기호 뜻**: $\alpha$ = 꼬리 신뢰수준. CVaR$_\alpha(X)$ = "최악 $(1-\alpha)$ 비율에서의 평균 손실".
- **일상 비유**: "내 인생 최악의 10일 평균 손실은 얼마인가" 가 CVaR$_{0.9}$. 보험사·은행이 자본 산출에 표준 사용.
- **왜 이 형태**: CVaR 는 coherent (subadditive + monotone + cash-invariant + positive homogeneous). VaR (quantile 자체) 와 달리 분산투자 효과 보장 (Artzner et al. 1999). Rockafellar-Uryasev 의 dual 형식이 OCE 와 정확히 같은 모양 — Buehler 가 활용한 핵심 통찰.
- **조심할 점**: hinge 가 비미분 — SGD 는 subgradient 로 안정. 단 $\alpha \to 1$ (극꼬리) 면 표본수 부족으로 분산 폭증.

### B-3) Mean-CVaR / Mean-Variance / Power utility 등

저자 코드는 이외에도 (i) **mean-variance** $\rho(X) = -\mathbb{E}[X] + \lambda \mathrm{Var}(X)$ — 표본 추정으로 약간 트릭 필요, (ii) **power utility** $u(x) = -((-x)^p)$ — penalty 가중 비대칭, (iii) 사용자 정의 utility — 구조 동일. 모두 OCE 골격 안에서 처리.

### B-4) Risk-neutral baseline

비교용 baseline 으로 $u(x) = x$ (linear utility, risk-neutral) — 이 경우 $\rho(X) = -\mathbb{E}[X]$ 가 되고 학습은 단순 기대 P&L 최적화. 거래비용 부재 + GBM simulator 면 BS-delta 의 정확 재현이 기대됨 (sanity check).

## 학습 시 dual variable $y$ 의 취급

OCE 정의에 따라 $y$ 는 학습 가능 변수다. 저자 `Network.md`:
> "OCE intercept ($y$): Optionally network-parameterized for variable initial states"

즉 (i) 단순 스칼라 변수, (ii) 초기상태 $s_0$ 의 함수 $y = y_\phi(s_0)$ 로 신경망 — 두 옵션. 후자는 path-dependent 시작 (예: 이미 보유 포트폴리오가 있는 경우) 에서 유리. 학습 시 $\theta$ (정책) 와 $y$ (또는 $\phi$) 를 함께 Adam.

## 대안 비교

| 손실 | 장점 | 단점 |
|---|---|---|
| MSE / quadratic | SGD 친화, 분산공식 명시 | upside 위험까지 페널티 — 트레이더 직관 위배 |
| Entropic | dual = KL, 분석 친화 | heavy tail 발산 위험 |
| CVaR | coherent, 실무 표준 | hinge 비미분 (SGD 는 OK), 극꼬리 분산 |
| OCE-arbitrary | utility 만 갈아끼우면 끝 | utility 디자인 자체가 비자명 |

본 논문의 결정은 **OCE 골격 통일** + **Entropic + CVaR 의 두 대표 utility 로 실험**. 이게 표준이 됨.

## 핵심 한 문장

> **"손실함수를 utility 한 함수 $u$ 와 스칼라 $y$ 의 (sup 또는 inf) 으로 표현하면, 모든 실용 risk measure 가 같은 SGD 코드 한 줄 안에 들어온다. 이게 deep hedging 의 공학적 핵심."**
