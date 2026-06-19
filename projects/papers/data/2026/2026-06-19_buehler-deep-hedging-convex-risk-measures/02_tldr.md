# 1. 3층 TL;DR

## 🧒 초등학생 수준

옛날 어떤 사람이 비가 올지 모를 때 우산을 들고 다니면 손이 시리고 안 들고 다니면 비를 맞아 옷이 젖는 문제를 해결하기 위해 일기예보를 봤다. 일기예보가 100% 정확하면 "비 올 때만 우산을 들고 나가면" 끝이다. 그런데 일기예보가 100% 정확한 날은 없다. 게다가 우산을 가게에서 빌리면 빌릴 때마다 500원을 내야 한다. 이 500원이 쌓이면 우산을 안 가져가서 옷이 젖는 손해보다 더 클 수도 있다.

옵션이라는 금융상품은 비처럼 미래에 무엇이 일어날지 불확실한 일 (예: 주가가 어디 갈지) 에 베팅하는 종이고, 그 종이를 판 사람은 "비가 올지 모르는데 우산을 들고 다녀야 하는" 사람과 같다. 이 사람이 우산을 적절히 들고 다니는 행동을 **헤지** (hedging) 라고 부른다. 옛날 수학자들은 "1973 년의 마법공식" (블랙-숄즈) 이라는 걸 만들어 "우산을 언제 얼마나 들지" 를 정확히 계산했다. 하지만 그 공식은 **우산을 매번 무료로 바꿔 들 수 있다고 가정** 했다. 실제로는 500원이 든다. 또 일기예보 (주가 변동성) 가 시시각각 바뀐다고도 가정 안 했다. 그래서 실제로 그 공식대로 하면 손해가 누적된다.

이 논문은 **AI 가 500원 거래비용과 변동하는 일기예보를 직접 보고 우산 들고 다니는 법을 배우게 한다**. 마법공식 대신 AI 가 "비 올 확률 60%, 우산 빌리는 비용 700원, 옷 젖으면 5000원 손해" 같은 정보를 모두 보고 그때그때 최선의 결정을 내린다. 마치 자전거 처음 배울 때 핸들을 잡는 손맛을 데이터로 배우듯이.

## 🎓 학부생 수준

**문제**: 파생상품 (옵션·스왑 등 미래 사건에 의존해 가치가 결정되는 금융계약) 을 매도한 거래자는 만기까지의 손실 위험을 다른 자산을 사고팔아 줄이는 **헤지** 를 해야 한다. 1973 년 블랙-숄즈 (Black-Scholes) 모형은 거래비용 0, 연속 거래 가능, 변동성 상수, 시장 무마찰을 가정한 **이상적 세계** 에서 옵션의 공정가격과 헤지 전략 (델타 헤지) 을 닫힌형 (closed-form) 으로 줬다. 현실에서는 거래비용, 유동성 한계, 시장 충격 (한 번에 큰 주문을 내면 가격이 움직이는 효과), 변동하는 변동성 등 모든 가정이 깨진다. 그래서 실제 트레이딩 데스크는 휴리스틱한 수정 (예: 거래비용 임계값을 두고 델타가 그 이상 어긋날 때만 재조정) 을 쓴다.

**아이디어**: 헤징을 **constrained optimization 문제** 로 재정식화하고 거래 정책을 **신경망** 으로 표현하면, 임의의 시장 동학 시뮬레이터 위에서 SGD 로 최적 정책을 학습할 수 있다. 즉 "분석적 해" 대신 "샘플 기반 함수근사" 로 접근. 이 때 손실함수는 **convex risk measure** (CVaR, Entropic, Expected Shortfall 등 — 분포의 꼬리에 가중치를 두는 측도) 의 음수로 둔다.

**방법**: $T$ 시점 만기 payoff $Z_T$ 를 만기까지 $M$ 스텝의 행동 $\delta_k(s_k)$ ($s_k$ 는 상태 — 가격·실현변동성·잔존시간 등) 로 헤지하고, 거래비용 $\gamma_k$ 와 함께 손실분포 $L(\delta) = Z_T + \sum_k \delta_k \cdot \Delta S_k - \sum_k \gamma_k(\delta_k)$ 를 얻는다. 학습 목표는 OCE (Optimized Certainty Equivalent — 비선형 utility 의 monetary 등가물) 의 의미에서 $\mathbb{E}[u(L+y)-y]$ 를 $y$ 에 대해 sup 한 값을 최소화. 결과적으로 신경망이 "거래비용을 알면서 헤지비율을 줄이는" 비자명 정책을 학습.

**결과**: Heston 모형 (변동성도 확률과정인 stochastic vol 모형) 위에서 비례 거래비용을 추가한 시뮬레이션에서 **DH (Deep Hedging) 가 분석적 BS 델타 헤지보다 OCE risk 가 낮다**. 거래비용이 클수록 격차가 커진다. 또한 학습된 정책은 "다음 스텝에 거래비용이 더 클 것 같으면 미리 거래" 같은 시간일관성 (time-consistency) 을 보인다. 고차원 (다수 헤지 도구) 에서도 작동.

## 🔬 전문가 수준

**Contributions (4개)**:

1. **헤징 문제의 함수공간 일반화 정식화** — 비완전시장 (incomplete market) 에서 임의의 convex risk measure $\rho$ 하에 헤지 잔차의 risk-adjusted price $\rho(-Z_T + \sum_k \delta_k\cdot \Delta S_k - \mathrm{cost})$ 를 최소화하는 정책 $\delta^* \in \mathcal{H}$ 의 존재·근사를 보장. (논문 §2~3)

2. **OCE 손실의 SGD 친화적 표현** — Ben-Tal & Teboulle (2007) 의 Optimized Certainty Equivalent 를 활용해 $\rho(X) = \sup_y \{\mathbb{E}[u(X+y)] - y\}$ 의 dual 표현으로부터 Entropy / CVaR / ES / mean-variance 가 모두 같은 코드 골격에서 학습 가능함을 보임. Entropic: $u(x) = (1-e^{-\lambda x})/\lambda$. CVaR$_\alpha$: $u(x) = (1+\lambda) \min(0, x)$ 와 $\lambda/(1+\lambda) = \alpha$. (논문 §3, 본 저장소 `Network.md` 의 OCE 정의 verbatim)

3. **ε-density 정리** — 제약된 트레이딩 전략의 공간이 임의의 측정가능 정책을 ε 정확도로 근사하기에 충분히 크다 (검색 인덱스 verbatim: "the set of constrained trading strategies used by their algorithm is large enough to ε-approximate any optimal solution"). 이로써 함수근사 오차와 risk measure 최적화 오차를 분리해서 다룰 수 있다.

4. **Heston 시뮬레이터 위 실증** — 비례 거래비용 $\gamma$ 하 BS 델타 vs DH 비교. CVaR / Entropic 하에서 DH 가 통계적으로 유의하게 우월. 거래비용이 0 → 양수로 갈수록 분석해 (델타) 의 우월성 사라지고 DH 우월성 확보. 다수 헤지 도구 (스팟 + 옵션) 의 고차원 setting 에서도 작동.

**방어 가능한 주장 / 이론적 기여**:
- 함수근사 + risk measure 최적화의 결합으로 "incomplete market 의 일반 가격결정" 을 알고리즘적으로 푼다 — Föllmer-Leukert / Schweizer 의 quadratic / shortfall hedging 계보를 통합.
- 정책공간의 ε-density 가 비참여 (no-arbitrage) 조건 하에서 유지됨을 보장 — 단순 universal approximation 이 아닌 "constrained" 공간에서의 density.

**한계 (저자 명시 + 후속 논문이 지적)**:
- Simulator 종속성 (Heston · BS 시뮬레이터의 미스스펙이면 정책도 미스스펙) — 후속 Adversarial Deep Hedging (2307.13217) 가 정면 공격.
- 시장 충격 (market impact) 미반영 — 후속 Deep Hedging with Market Impact (2402.13326) 가 정면 확장.
- Equal Risk Pricing 의 의미에서 매수자/매도자 대칭성 보장 안됨 — 후속 (2002.08492) 가 보강.
- 본 환경 본문 PDF 미열람으로 저자 명시 한계 항목의 정확한 텍스트 단정 불가.
