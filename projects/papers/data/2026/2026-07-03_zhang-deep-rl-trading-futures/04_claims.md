# 04. 핵심 Claim 해체

본 논문에서 저자들이 실제로 방어하고자 하는 주장을 4개로 분해한다. 각 Claim 마다 (i) 주장 · (ii) 증거 위치 · (iii) 숨은 전제 · (iv) 쉬운 말 풀이 를 제시.

---

## Claim 1 — DRL 정책이 TSMOM 을 이긴다 (Sharpe 관점)

### 주장

**DQN · PG · A2C** 3-알고리즘 모두가 **TSMOM** (Time Series Momentum, Moskowitz·Ooi·Pedersen 2012) 벤치마크를 Sharpe ratio 관점에서 상회한다. 특히 **DQN 이 최고 성능**, A2C 가 2 위.

### 증거

- Abstract 마지막 문장 (WebSearch verbatim 다수 확인): *"the method outperforms classical time series momentum strategies, delivering positive profits despite heavy transaction costs"*
- Section 5 Results (추정): DQN 이 3-알고리즘 중 top, A2C 가 2nd — WebSearch 인덱스에서 *"DQN obtains the best performance among all models and the second best is the A2C approach"* verbatim 확인
- 정확한 Sharpe 소수점 값은 Table 3-5 (추정), **본 환경 PDF 차단으로 미확인**

### 숨은 전제

- **선정 편향 (survivorship bias)**: "50 개 유동성 최상위 선물" 은 사후 선정 — 2011 년 시점에서 유동성 컷을 넘긴 상품만 백테스트 대상. 2010 년대에 사라진 illiquid 상품은 제외.
- **동시성 가정**: TSMOM 도 같은 lookback (12 개월) 과 같은 target-vol scaling 을 사용한 실현 가정 (fair baseline). 이 처리가 정확한지는 본문 세부 확인 필요.
- **비용 모델 단순성**: transaction cost 는 spread + fee 만, market impact 미반영 추정 (proprietary 대규모 자본 운용 시 실제 성능 저하 가능).
- **TSMOM 하이퍼파라미터 고정**: TSMOM 의 lookback = 12 개월, target vol = 15% 등 원 저자 (Moskowitz 2012) 설정을 그대로 인용 가정 → 만약 TSMOM 을 최근 표준 실무 조정 (e.g. 3-6-12 개월 blended) 으로 튜닝하면 격차 축소 가능.

### 쉬운 말 풀이

"50 개 상품에서 40 년간 통한 옛말 규칙 (12 개월 이익 방향으로 포지션) 을 AI 에게 새로 짜라고 시켰더니 AI 가 더 좋은 규칙을 만들어냈다. 특히 DQN 이라는 '신중형' AI 가 가장 잘했다." — 다만 "옛말 규칙과 완전 동등하게 대접했는지 (같은 리스크 예산, 같은 조정)" 는 원문 확인 필요.

---

## Claim 2 — Discrete action ({-1,0,1}) 이 Continuous action ([-1,1]) 보다 낫다 (본 논문 조건 하)

### 주장

**DQN·PG (discrete action)** > **A2C (continuous action)** 성능 순서. Discrete action space {-1, 0, +1} 이 **정보 효율성 손실을 감수하고도** continuous [-1,1] 보다 우세.

### 증거

- 결과 순위: DQN (discrete) > A2C (continuous) > PG (discrete) — WebSearch 인덱스 확인
- 3.1/3.2 절 action space 정의 (추정): discrete = target order {-1, 0, 1}, continuous = position size [-1, 1]
- 정확한 성능 차이 수치는 Table 3 (추정), **본문 PDF 차단으로 미확인**

### 숨은 전제

- **A2C 학습 안정성 문제**: continuous action 은 policy gradient 분산이 크고, actor + critic 두 네트워크 공동 학습이 hyperparameter 에 민감. 본 논문 A2C 실패가 **알고리즘 자체 열위** 인지, **하이퍼파라미터 미최적화** 인지 구분 불가.
- **거래비용의 discretization 우호성**: transaction cost 가 있으면 **low turnover** 가 유리. Discrete {-1, 0, 1} 은 자연스레 low turnover 를 유도 (매일 -0.7 → -0.72 → -0.71 같은 미세 재조정 불가). Continuous 는 반대로 매일 미세 조정 → cost 누적.
- **Reward variance 감소**: discrete action 은 reward $R_t$ 분포가 3-modal (음/무/양 각각의 mode) 로 estimator variance 자연 감소.
- **Sample efficiency**: DQN 은 experience replay + target network 로 sample efficiency 유리. A2C 는 on-policy 로 sample 낭비 심.

### 쉬운 말 풀이

"살까 팔까 아무것도 안할까 세 가지 중 하나 고르는 로봇 (discrete) 이, '얼마나 살까 얼마나 팔까 소수점까지 정하는 로봇 (continuous)' 보다 잘한다." — 이는 (i) 계속 조정하면 수수료가 계속 붙고, (ii) 세부 조정 학습이 실제로 더 어렵다는 두 이유의 결합 결과. **directional trading domain 특유** 의 관찰이지 일반 RL 원리 아님.

---

## Claim 3 — Volatility-scaled reward 이 cross-asset 학습을 가능하게 한다

### 주장

Reward 을 raw return $r_t$ 이 아니라 $\sigma_{\text{tgt}}/\sigma_{t-1} \cdot r_t$ 로 정의하면 (i) **cross-asset 간 reward scale 정규화** → 하나의 모델로 다중 자산 학습 가능, (ii) **국면 전환 시 자동 position 축소** → drawdown 완화.

### 증거

- Section 3 or 4 reward function 정의 (추정): $R_t \propto \sigma_{\text{tgt}}/\sigma_{t-1}$
- WebSearch verbatim: *"With a volatility target, the reward Rt is mostly driven by actions instead of being heavily affected by market volatility. The volatility scaling can also be considered as normalising rewards from different contracts to the same scale"*
- 60-day EWMA std 로 $\sigma_{t-1}$ 계산 verbatim 확인
- Ablation 없이 volatility scaling 만 제거한 대조군 결과는 **본문 PDF 차단으로 미확인**

### 숨은 전제

- **$\sigma_{\text{tgt}}$ 는 하이퍼파라미터**: 통상 연 10-15 %. 본 논문 정확 값 확인 필요. 자산 간 일괄 적용 가정.
- **EWMA lookback 60일 고정**: 60일이 fast/slow 사이의 어떤 균형점인지, 다른 lookback 실험 여부 확인 필요.
- **Ex-ante estimate 만**: $\sigma_{t-1}$ 은 $t-1$ 까지 알려진 정보로만 계산 → look-ahead 방지. Ex-post realized vol 을 쓰면 look-ahead bias.
- **Vol scaling 의 위험**: 저-변동성 국면에 포지션을 크게 잡음 → 급변 시 대손. TSMOM 원 논문 (Moskowitz 2012) 이 사용한 target-vol scaling 관행을 그대로 채택했다면 그건 baseline 대비 unfair 는 아님.

### 쉬운 말 풀이

"원유 시장은 하루 2 % 씩 움직이는데 국채 시장은 0.3 % 씩 움직인다. 둘을 같은 로봇으로 학습시키려면 '이 자산 오늘 얼마나 요동치는지 (변동성)' 로 나눠서 리스크 스케일을 맞춰야 한다. 안 그러면 원유가 학습 신호를 다 잡아먹는다." → volatility scaling 은 **리스크 정규화 (risk parity 발상의 축소판)** 이자 **동시에 자연스러운 position sizing 규칙**.

---

## Claim 4 — 거래비용 (transaction cost) 이 있어도 흑자 유지

### 주장

Transaction cost 를 reward 에 명시적으로 반영해도 3-알고리즘 모두 여전히 흑자. TSMOM 대비 우세도 유지.

### 증거

- Abstract verbatim: *"delivering positive profits despite heavy transaction costs"*
- WebSearch verbatim: *"if the cost rate is 1bp, one needs to pay $0.1 to buy one unit of a contract"*  → 즉 basis point 단위 (1bp = 0.01%) 명시
- Cost sweep (1bp, 2bp, 4bp 등) 결과는 Table 6 or Figure 3 (추정) — **본문 PDF 차단으로 미확인**

### 숨은 전제

- **Linear proportional cost 만 고려**: $c \cdot |\Delta a_t|$ 형태. 실무의 slippage (주문 크기 의존), market impact (자기 주문이 가격에 미치는 영향), fixed commission (거래당 정액) 은 미반영 추정.
- **Roll cost 미확인**: futures 는 만기별 계약이라 만기 도래 시 다음 만기로 roll 이 필요. Roll cost (front-back spread) 가 reward 에 반영됐는지 미확인.
- **Discrete action 의 cost 유리성**: {-1, 0, 1} 은 |Δa| ∈ {0, 1, 2} 로 quantized → continuous 대비 average |Δa| 작음. 이 구조가 Claim 2 와 상호작용.
- **Cost 상한선**: "heavy transaction cost" 라는 표현의 정량 기준 (몇 bp 까지) 불명확. 실무 상 futures cost 는 1-3 bp 수준이 표준.

### 쉬운 말 풀이

"사고팔 때마다 수수료가 붙는데, 그걸 감안해도 여전히 돈을 벌었다." — 다만 (i) 수수료를 **얼마까지 부과했는가**, (ii) 슬리피지·마켓임팩트 같은 **더 큰 실무 비용을 넣으면** 여전히 성립하는가 는 원문 확인 필요.

---

## 4-Claim 요약 표

| # | 주장 | 증거 상태 | 숨은 전제 개수 |
|---|---|---|---|
| 1 | DRL > TSMOM | Abstract + 결과 정성 확인, 정확 수치 미확인 | 4 |
| 2 | Discrete > Continuous | 결과 순위 정성 확인 | 4 |
| 3 | Vol-scaled reward 의 필요성 | 정의 verbatim 확인, ablation 미확인 | 4 |
| 4 | Cost 하 흑자 | Abstract verbatim 확인, 정확 스윕 미확인 | 4 |

**공통 사각지대**: 정확 수치 (Sharpe/Sortino/annualized return/max DD) 는 모두 본문 PDF 차단으로 미확인 → 07_limits.md 에서 반박점으로 별도 처리.
