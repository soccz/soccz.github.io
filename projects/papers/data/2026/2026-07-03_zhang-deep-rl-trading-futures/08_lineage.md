# 08. 이론적 계보

## 1. 이론적 조상 (4편)

### 조상 1: Moody·Wu 1997 — *Optimization of Trading Systems and Portfolios*

**Direct Recurrent Reinforcement Learning (DRRL)** 의 원조. Neural network 로 파라미터화된 정책 $F_t = \tanh(u \cdot F_{t-1} + \theta^T x_t)$ 을 **Differential Sharpe Ratio** 목적함수 위에서 SGD 로 학습. Trading policy 를 예측 없이 직접 최적화하는 **direct policy learning** 발상.

**본 논문과의 직접 연결**: 본 논문의 policy $\pi_\theta$ 학습 objective 는 Moody·Wu 의 direct RL 목적을 modern deep RL (DQN/PG/A2C) 로 대체. Neural architecture 는 shallow → LSTM 2-layer 로 확장. Asset 는 single → 50 개 futures 로 확장. 22 년의 시간 격차로 컴퓨팅·이론·데이터 3 축이 모두 진화한 자연 후계.

### 조상 2: Moskowitz·Ooi·Pedersen 2012 — *Time Series Momentum* (JFE)

TSMOM 을 학계 표준으로 확립. 58 개 유동성 최상위 선물에 지난 12 개월 수익률 부호대로 포지션 + vol-scaling 을 결합, 40 년 (1965-2009) 백테스트로 연 Sharpe 1.5 실현. 통계적 유의성 강력.

**본 논문과의 직접 연결**: 본 논문의 **핵심 baseline**. TSMOM 의 (i) vol-scaling 관행, (ii) 다-asset universe (25 comm + 11 eq + 5 FI + 9 FX 는 Moskowitz 2012 의 asset class 구성과 유사), (iii) 연 Sharpe metric 을 그대로 채택하되, **hand-crafted rule (12 개월 부호)** 을 **learned policy (DRL)** 로 대체.

### 조상 3: Mnih et al. 2015 — *Human-level control through deep RL* (DQN, Nature)

Deep Q-Network 를 Atari 게임에서 표준화. Experience replay + target network 조합으로 학습 안정성 확보 → discrete action RL 의 modern deep 시대 개막.

**본 논문과의 직접 연결**: DQN 알고리즘 그대로 채택 (LSTM 백본으로 변경). Experience replay 로 sample efficiency 확보 → 시장 데이터 부족 문제 완화. Off-policy 성격이 non-stationary 시장에 얼마나 유효한지는 논문 결과가 실증.

### 조상 4: Mnih et al. 2016 — *Asynchronous Methods for Deep RL* (A3C/A2C)

Advantage Actor-Critic 프레임워크의 modern 시대 표준화. Continuous action + stochastic policy + baseline subtraction 의 종합.

**본 논문과의 직접 연결**: A2C 알고리즘 그대로 채택. LSTM 백본 위에 actor + critic head 배치. Continuous action [-1, 1] 로 fine-grained position sizing 시도. 다만 fin domain 특유의 cost 부담 때문에 discrete DQN 대비 열위.

## 2. 평행 연구 (4편, 비슷한 시기 다른 접근)

### 평행 1: Bühler·Gonon·Teichmann·Wood 2019 — *Deep Hedging* (2026-06-19 커버)

**같은 정신, 다른 문제**. 옵션 헤지 문제를 cash-invariant convex risk measure 최소화로 정식화, SGD-friendly 목적함수 (Entropic / CVaR) + 시장마찰 + 신경망 정책. Bühler 팀 (JP Morgan QR + ETH) vs Zhang 팀 (Oxford-Man) 은 **fin ML SGD-friendly risk 최적화 계보의 쌍벽**.

**왜 본 논문이 이겼나 vs 어느 영역서 Deep Hedging 우세**:
- **본 논문 우세**: directional trading, multi-asset, discrete action space 통합
- **Deep Hedging 우세**: 옵션 헤지 정식화 (Greek 대체), 이론적 근거 (ε-density 정리), 위험 지표 이론 (OCE 표현)
- **결론**: 같은 정신을 **다른 문제** 에 적용한 자매작. 승패 없음.

### 평행 2: Deng·Bao·Kong·Ren·Dai 2016 — *Deep Direct Reinforcement Learning for Financial Signal Representation and Trading* (IEEE TNNLS)

**첫 modern DRL for trading** 이나 단일 자산 (S&P500), fuzzy inference 활용. 2016 시점 시대적 제약.

**왜 본 논문이 이겼나**: (i) asset diversity (50 vs 1), (ii) algorithm 다양성 (3-종 vs 1-종), (iii) discrete/continuous action space 이분법 명시화, (iv) fuzzy inference 대신 standard LSTM.

### 평행 3: Jiang·Xu·Liang 2017 — *A Deep RL Framework for the Financial Portfolio Management Problem*

Crypto portfolio management (11 개 crypto), CNN policy + PG. Portfolio-level.

**왜 본 논문이 이겼나 vs 어느 영역서 Jiang 우세**:
- **본 논문 우세**: futures universe 성숙도, TSMOM baseline 표준, asset class 다양성
- **Jiang 우세**: portfolio-level 통합 (asset 간 correlation 활용), crypto 도메인 최초
- **결론**: **single-asset trading vs portfolio construction** 은 다른 문제. 본 논문 후속작 (Momentum Transformer arXiv:2112.08534) 이 attention 으로 cross-asset 정보 통합 방향으로 진화.

### 평행 4: Liu et al. 2020 — *FinRL* (NeurIPS 2020 DRL Workshop, arXiv:2011.09607)

DRL library 표준화. PPO + A2C + DDPG 조합 + open-source. Educational + research prototyping.

**왜 본 논문이 이겼나 vs 어느 영역서 FinRL 우세**:
- **본 논문 우세**: Tier 3 venue (JFDS) 학술적 인정, TSMOM baseline 명시 비교, futures universe
- **FinRL 우세**: open-source (재현성), 더 최근 알고리즘 (PPO), 커뮤니티 확장성
- **결론**: **논문 (novelty) vs 라이브러리 (usability)** 은 다른 축. 본 논문은 학술 baseline, FinRL 은 실무·교육 도구.

## 3. 후손 예측 (3편)

### 후손 1: Wood·Giegerich·Roberts·Zohren 2022 — *Momentum Transformer* (arXiv:2112.08534) [실제 후속]

같은 저자팀 Oxford-Man 그룹의 direct 후속작. LSTM → Transformer 로 백본 교체 + interpretable variable selection network + attention 도입. 본 논문의 정식화 그대로 계승하고 아키텍처 진화. **APF motif dynamics 관점에서 관심** — daily futures 에 attention 도입하면 어떤 패턴이 학습되는가.

### 후손 2: Slow Momentum with Fast Reversion (Wood 2021, arXiv:2105.13727) [실제 후속]

같은 저자팀. 정책에 **change-point detection** 을 결합해 regime shift 대응. 본 논문의 static policy 를 dynamic regime-aware policy 로 확장. Non-stationarity 문제 정면 대응 → 본 논문 반박 4 (post-2019 미검증) 의 대응 방향.

### 후손 3: Deep Learning for Options Trading (Tan·Wood·Roberts·Zohren 2024, arXiv:2407.21791) [실제 후속]

같은 저자팀. Directional trading → 옵션 trading 으로 확장. Deep Hedging 과 본 논문의 결합. **P1 ProTran-TFA 의 quantile forecast → option-implied risk premium → RL policy** 파이프라인 참조 substrate.

**추가 후손 예측 (아직 없는 것)**:
- RL for trading + **mech interpretability** (본 논문 policy 가 무엇을 학습했는가 circuit-level 분석)
- RL for trading + **sparse feature circuits** (LSTM hidden state 를 SAE 로 decompose)
- RL for trading + **causal ML** (신호가 정말 causal 하게 트레이딩 성과에 기여하는가)

## 4. 계보 요약도

```
Moody·Wu 1997 (Direct RL)
     ↓ 22년, deep RL 성숙
Deng 2016 (single asset DRL) → Jiang 2017 (crypto portfolio)
     ↓                                ↓
   Zhang·Zohren·Roberts 2019/2020 (본 논문, 50 futures DRL)
     ↓ 저자팀 계승
Momentum Transformer 2022 → Slow Momentum Fast Reversion 2021 → Options Trading 2024
     ↓ (아직 없는 후손)
mech-interp + rl-trading (본 사용자 연구 potential 니치)

병렬 계보:
Moskowitz·Ooi·Pedersen 2012 (TSMOM baseline) ─ 본 논문의 target
Bühler·Gonon·Teichmann·Wood 2019 (Deep Hedging) ─ 사상적 쌍
FinRL 2020 (library) ─ 실무 도구 방향
```

## 이 부분의 핵심 한 문장

**"Moody·Wu 1997 의 direct policy learning 발상 + Moskowitz 2012 의 TSMOM baseline + Mnih 2015/2016 의 modern deep RL 3-축 조상 → 본 논문 → Momentum Transformer + Slow Momentum + Options Trading 3-후속작 계보를 저자팀이 직접 이어가는 자연스러운 lineage 의 primary 정거장."**
