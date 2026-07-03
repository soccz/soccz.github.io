# 10a. 사고 확장 — 자문 질문 5개

각 질문은 (i) 질문 · (ii) 왜 이 질문이 중요한가 (2~3줄) 구조.

## Q1. Volatility scaling 없이도 DRL 이 TSMOM 을 이기는가?

**질문**: Reward function 에서 $\sigma_{\text{tgt}}/\sigma_{t-1}$ 곱셈을 제거한 (즉 raw return + cost penalty 만) DRL policy 도 여전히 TSMOM 을 상회하는가?

**왜 중요한가**: 본 논문의 성능이 (a) **DRL 알고리즘 자체의 학습력** 인지, (b) **volatility scaling 이라는 domain trick** 인지 분리 필요. 만약 vol-scaling 이 성능의 90 % 이라면 논문의 진짜 기여는 "vol-scaled TSMOM 대비 DRL" 이 아니라 "vol-scaling 관행을 domain 에 정착" 이 됨. 후자는 novel 이지만 저자 주장과 다름. 이 ablation 은 논문 반박점 #5 (07_limits) 의 핵심 검증.

## Q2. Discrete action 이 Continuous 대비 우세한 것은 정말 cost 저항성 때문인가?

**질문**: Transaction cost 를 zero 로 두었을 때도 DQN (discrete) 이 A2C (continuous) 보다 우세한가? 만약 아니라면, cost > 0 조건에서 discrete 이 우세한 임계점은 몇 bp 인가?

**왜 중요한가**: Discrete 우세의 인과 mechanism 을 분리. (i) **cost 저항성 (low turnover)** 이 주 요인이라면 cost sweep 결과가 확답. (ii) **A2C 학습 안정성 부족** 이 주 요인이라면 zero-cost 에서도 DQN 우세. 후자라면 A2C 알고리즘 자체 개선 (PPO 로 교체, TD3, SAC 도입) 이 fin ML 후속작 필수 방향. 실무 응용 시 이 구분은 배포 알고리즘 선택에 직결.

## Q3. LSTM hidden state 의 32 차원 안에 monosemantic feature 가 존재하는가?

**질문**: Trained DQN LSTM 의 2-layer 마지막 hidden state $h_t \in \mathbb{R}^{32}$ 를 **Sparse Autoencoder** (SAE, Bricken 2023 Anthropic 방식) 로 decompose 하면 "trend follower feature", "volatility spike detector feature", "mean-reversion feature" 같은 monosemantic feature 가 등장하는가?

**왜 중요한가**: 이는 **mech interp + rl-trading** 교차 novel 니치의 첫 실험 조건. 만약 monosemantic feature 가 발견되면 (i) fin ML 정책의 해석성 확보, (ii) 규제 대응 (설명 가능한 AI 요구), (iii) 잘못된 학습 (예: news event 편승) 진단 가능. 실패해도 "LSTM policy 는 polysemantic 만" 이라는 negative 결과 자체가 정책 해석성 한계 논문의 기여. 사용자 §B 관심 영역 + AETHER 실무 응용의 다리.

## Q4. Post-2019 out-of-sample 에서 정책은 얼마나 열화하는가?

**질문**: 본 논문 데이터로 학습된 정책을 zero-shot 으로 2020-2024 년에 적용하면 Sharpe 는 얼마나 감소하는가? Regime 별 (Covid 2020 shock, 2022 인플레 급등, 2023 AI 랠리) 어떤 국면에서 실패가 극대화되는가?

**왜 중요한가**: 본 논문의 학습 기간 (2011-2019) 은 **benign regime** (금리 하락 + 낮은 인플레 + risk-on). 실무 배포 시 최근 regime 성능이 진짜 vetting. 만약 열화가 크면 (i) rolling retrain / online adaptation 필수, (ii) regime detection 결합 (Slow Momentum Fast Reversion 계보), (iii) meta-learning 도입 방향. 사용자 non-stationarity-ts 관심 영역 직결.

## Q5. Policy 를 "미시적 이벤트 (news, macro release)" 에 대해 causal 하게 해석할 수 있는가?

**질문**: 학습된 DQN policy 가 "FOMC 회의 발표", "고용 지수 발표", "지정학 이벤트" 등 특정 미시적 이벤트 시점에 어떤 action 을 취하는가? 이 action 이 이벤트에 **causal** 하게 반응하는지 (do-intervention 관점) 아니면 단순 시장 변동에 spurious reactive 한지 구분 가능한가?

**왜 중요한가**: (i) 정책의 "무엇을 학습했나" 를 event-level 로 해석, (ii) 사용자 §F causal-ml-finance 관심 영역과 직결, (iii) 실무 규제 관점에서 "이 알고리즘이 왜 특정 시점에 청산했는가" 를 explainable 하게 답하는 도구. do-calculus / instrumental variables 결합 시 fin ML causal analysis 의 novel 방향.

## 질문 5 개 요약

| # | 검증 방식 | 사용자 track 연결 |
|---|---|---|
| Q1 | Reward ablation | Deep Hedging 계보 + P1 ProTran-TFA |
| Q2 | Cost sweep + algorithm swap | AETHER 실무 배포 |
| Q3 | SAE probe | §B mech interp novel 니치 |
| Q4 | Zero-shot 2020-2024 test | non-stationarity-ts + continual learning |
| Q5 | Event-level causal analysis | §F causal-ml-finance |
