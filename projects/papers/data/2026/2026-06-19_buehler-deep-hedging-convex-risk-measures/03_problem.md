# 2. 문제 지형도

## 배경 사다리

이 절을 이해하려면 ① **옵션** (특정 시점에 어떤 가격으로 살/팔 권리를 거래하는 계약 — 보험 상품의 일반화) 이 무엇인지, ② **헤지** (head 에 모자 쓰듯 자산 손실을 다른 자산 이익으로 가리는 행위) 가 왜 필요한지, ③ **변동성** (가격 흔들림의 폭) 이 옵션 가격을 결정한다는 사실 — 이 세 개념만 알면 충분하다. 수학적으로는 미적분과 확률 (정규분포·기댓값) 정도면 따라올 수 있게 풀이를 병기한다.

## 실제 문제는 어떻게 생기는가

### 상황 1 — 옵션을 매도한 트레이딩 데스크

은행은 고객에게 6개월 만기 S&P500 콜옵션 (만기에 S&P500 이 행사가 4500 보다 위면 그 차이를 받는 권리) 을 100만 달러어치 팔았다. 만기까지 S&P500 이 5000 으로 가면 은행은 (5000-4500)×100만/4500 ≈ 11.1 만 달러를 토해내야 한다. 이 위험을 0 으로 만들기 위해 은행은 S&P500 자체 (또는 선물·ETF) 를 살 수 있다. **얼마나? 어떤 빈도로?** — 이게 핵심 질문이다. 블랙-숄즈는 "델타 만큼" 사라고 답하지만, 델타는 가격이 움직일 때마다 바뀌므로 **연속적으로 재조정** 해야 한다. 실제로는 매번 거래비용 (스프레드·수수료) 이 들고, 큰 주문은 시장가격을 움직인다 (market impact).

### 상황 2 — 변동성이 시간에 따라 변할 때

블랙-숄즈는 변동성 $\sigma$ 가 상수라고 가정한다. 실제 S&P500 의 변동성은 **시간에 따라 변하고 자체가 확률과정** 이다 (volatility clustering — 불황기엔 흔들림이 모인다). 1993년 Heston 이 변동성을 별도 확률미분방정식 (변동성도 brownian motion 으로 흔들리며 평균회귀) 으로 모델링했다. 이 stochastic vol 세계에선 옵션 가격이 더 이상 **하나의 자산만으로 완전 복제** 되지 않는다 (incomplete market). 즉 어떤 헤지 전략도 잔여 위험을 0 으로 만들 수 없다. 그러면 **"잔여 위험을 0 으로" 가 아니라 "잔여 위험의 분포를 최대한 나에게 유리하게"** 가 목표가 된다.

### 상황 3 — 거래비용·유동성 제약·리스크 한도

거래비용 (예: tick size 가 1bp 인 경우 거래액의 0.01%) 이 있으면 미세조정 헤지는 비용이 누적돼 손해. 또 유동성 제한 (한 거래당 거래량 제약) 과 리스크 한도 (총 손실이 일정액을 넘으면 거래 중단) 도 시장 마찰이다. 이 모든 제약을 동시에 다루는 **분석적 닫힌형 해** 는 일반적으로 존재하지 않는다.

## 기존 접근 계보 (연대순)

### (1) **Black-Scholes-Merton (1973)** — 완전시장의 닫힌형

블랙·숄즈·머튼은 변동성 $\sigma$ 가 상수이고 거래비용 0, 연속 거래 가능, no-arbitrage 인 이상화된 시장에서 콜옵션 가격이 $C(S,t) = S \cdot N(d_1) - K e^{-r(T-t)} N(d_2)$ 라는 닫힌형을 줬다 (Nobel 1997).

- **무엇이었나**: 옵션 페이오프를 (스팟 + 채권) 의 동적 포트폴리오로 **완전 복제** (replication) — 일종의 자산변환. 헤지비율 = $\partial C / \partial S = N(d_1)$.
- **왜 부족했나**: 가정 5개 모두 현실에서 깨진다. 특히 (a) $\sigma$ 상수 — 실증적으로 변동성이 시간 변화·smile/skew 형성, (b) 거래비용 0 — 실제로는 비용 누적, (c) 연속거래 — 디지털 시장은 이산.
- **교훈**: "헤지 = 복제" 라는 발상의 전환. 후속 모든 헤징 이론의 출발선.

### (2) **Föllmer-Sondermann (1986) · Schweizer (1991, 1995) · Föllmer-Leukert (1999, 2000)** — 비완전시장의 quadratic / shortfall hedging

비완전시장에서 옵션을 정확히 복제 못 하면, **잔여 위험의 어떤 평가함수를 최소화** 해야 하나? Föllmer-Sondermann 은 **이차 (quadratic) 위험** $\mathbb{E}[(Z_T - V_T)^2]$ 를 최소화하는 mean-variance hedging 을 제안. Föllmer-Leukert 는 **shortfall** 만 가중하는 비대칭 손실 (downside 만 페널티) 을 제안.

- **무엇이었나**: 위험측도 $\rho$ 의 선택에 따라 헤지 정책이 달라짐을 일반화. 닫힌형 (BS) → 변분 최적화 (Föllmer 계열) 로 추상화 격상.
- **왜 부족했나**: 거래비용·시장 충격·제약을 모두 포함한 일반 setting 의 **수치적 풀이가 차원의 저주** (high-dim PDE 풀이가 지수적 비용). 또 quadratic 손실 자체는 upside 위험까지 페널티 — 트레이딩 직관 (downside 만 페널티) 과 어긋남.
- **교훈**: "어떤 risk measure 인가" 라는 메타-질문 명시화. 후속 convex risk measure 이론 (Artzner-Delbaen-Eber-Heath 1999 coherent risk measure, Föllmer-Schied 2002 convex risk measure) 의 토대.

### (3) **Davis-Norman (1990) · Hodges-Neuberger (1989) · Whalley-Wilmott (1997)** — 거래비용 하 utility maximization

**Davis-Norman** 은 거래비용이 비례 (proportional) 일 때 최적 거래 정책이 **no-trade region** (재조정 안 함) + 두 경계 (재조정해서 경계로) 라는 구조를 가짐을 보였다. **Hodges-Neuberger** 는 utility indifference price (지수 utility 의 효용 차이로 가격결정) 를 제안. **Whalley-Wilmott** 는 작은 거래비용 점근전개 (asymptotic expansion) 로 no-trade band 의 폭 ∝ $\gamma^{1/3}$.

- **무엇이었나**: 거래비용을 1급 시민으로 다룬 첫 정통 이론. HJB (Hamilton-Jacobi-Bellman) 방정식의 자유경계 문제로 정식화.
- **왜 부족했나**: 1~2개 자산 + 단순 utility 에만 풀이 가능. 다자산·다옵션·다 risk measure 조합은 HJB 의 차원이 폭발. 또 시장 동학을 명시적으로 (예: 기하 brownian motion) 가정해야 풀린다 — 시뮬레이션 기반 일반화는 불가.
- **교훈**: "분석해는 토이 setting 에서만 가능, 실제로는 수치적 / 근사적 접근 필요" — 본 논문이 이를 신경망으로 답함.

### (4) **Heston (1993)** — Stochastic Volatility 모형

변동성을 별도 확률과정 $dv_t = \kappa(\theta - v_t)dt + \xi\sqrt{v_t}dW_t^v$ 로 두고 스팟과의 상관 $\rho$ 를 허용. 옵션 가격이 closed-form (Fourier inversion) 으로 계산 가능하지만, **하나의 자산만으로 완전 복제 불가** (incomplete market).

- **무엇이었나**: 변동성 표면 (smile) 의 실증적 재현. Industry standard.
- **왜 부족했나**: 가격은 닫힌형이지만 **헤지 전략** (어떤 옵션·바닐라 조합으로 vega 도 헤지) 의 일반 해법은 분석적으론 어렵다.
- **교훈**: Deep Hedging 의 실험 simulator 로 그대로 채택됨 — Heston 이 incomplete market 의 표준 toy.

### (5) **Han-Jentzen-E (2017) · Beck-E-Jentzen (2018)** — Deep BSDE / Deep PDE

고차원 PDE 를 신경망으로 푸는 **Deep BSDE** 방법이 등장. 옵션 가격은 BSDE (backward stochastic differential equation) 로 표현 가능 — 즉 신경망으로 고차원 옵션 가격결정 가능. Han-Jentzen-E 이 100차원 nonlinear PDE 를 풀어 보임.

- **무엇이었나**: "PDE 풀이를 신경망으로" 라는 흐름의 결정타. Deep Hedging 직전 1년의 분위기를 만든 선행.
- **왜 부족했나**: 가격결정 (V 의 학습) 만 다루지 헤징 정책 (delta 의 학습) 은 부수적. 거래비용·제약 같은 마찰을 자연스럽게 못 흡수.
- **교훈**: "고차원도 신경망으로 가능" 이라는 자신감 + "그런데 정책 자체를 직접 학습하면?" 이라는 자연스러운 다음 질문. Buehler 등이 그 답을 줌.

### (6) **Bachouch-Hure-Pham-Warin (2018) · Henry-Labordère (2017)** — RL 으로 헤징

거의 동시기에 강화학습 (Q-learning, policy gradient) 으로 헤징을 보는 시도가 다수. 본 논문은 그 흐름과 평행하지만, **convex risk measure 일반화 + ε-density 정리 + Heston 실증** 의 패키지가 가장 정제됨.

- **교훈**: RL 의 "보상함수 ≡ 음수 위험측도" 등치를 명시화. Action function 의 함수공간 density 보장으로 정책기울기의 수렴성에 신뢰 부여.

## 공통의 핵심 gap

이전 모든 접근은 **세 가지 중 최소 하나** 를 분석적 닫힌형이나 격자 PDE 에 의존했다: (a) 시장 동학, (b) risk measure 형태, (c) 거래비용·제약 형태. 세 가지 모두를 데이터 기반·시뮬레이션 기반으로 풀려면 **함수근사 + 변분 최적화 + 확률적 근사** 를 결합해야 했고, 그 결합의 정당성 (density · convergence) 이 누락돼 있었다.

## 이 논문의 메우기 방식

Deep Hedging 은 **헤지 정책을 신경망** $\delta_\theta: \mathcal{S} \to \mathbb{R}^d$ 로 표현하고, **손실을 임의의 OCE-표현 가능 convex risk measure** 로 두고, **시장 동학을 simulator** (Heston 등) 에서 샘플링한다. 이 세 axis 가 분리됨으로써 (a) 시장 모델을 바꿔도 학습 골격 불변, (b) risk measure 를 바꿔도 학습 골격 불변, (c) 제약을 바꿔도 학습 골격 불변. 그리고 정책공간이 ε-dense 임을 정리로 보여 함수근사 오차의 통제 가능성을 확보한다. 이게 "분기점" 인 이유 — 모든 후속 deep hedging 논문이 이 세 axis 의 어느 한 칸을 갈아끼우는 형태로 진행된다.
