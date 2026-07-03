# 02. 3층 TL;DR

## 🧒 초등학생 수준 (수식 금지, 그림 그리듯 비유)

"내일 원유값이 오를까 내릴까"를 매일 저녁 정해서 오전에 사고팔아야 하는 상황을 상상해 보자. 예전에는 어른들이 만들어 놓은 규칙 (**"12개월 동안 값이 오르는 물건은 계속 오를 확률이 높다"** 같은 옛말 규칙, 이걸 시계열 모멘텀이라고 부른다) 을 그대로 따랐다. 이 논문은 그 규칙을 **로봇 (AI 에이전트) 이 스스로 시행착오로 배우게** 하면 어떨까 하는 실험이다.

로봇에게 세 가지 성격을 준다:
- **성격 1 (DQN, 신중형)**: "사자 · 팔자 · 아무것도 안 함" 세 가지 중 하나만 고르는 로봇. 매번 "이 선택이 얼마나 좋았는지" 점수를 표에 적고 다음번엔 점수 높은 걸 고른다.
- **성격 2 (PG, 도전형)**: 같은 세 가지 중에서 고르되, "다음번에도 이거 고를 확률을 확 높여야지" 하고 확률 자체를 조정한다.
- **성격 3 (A2C, 유연형)**: 세 가지가 아니라 "**얼마나** 많이 살까 얼마나 많이 팔까" **연속적인 양** 을 결정한다. 옆에서 "지금 그 선택이 잘한 거야" 조언하는 코치 (**critic**) 를 같이 붙인다.

50 개 물건 (원유·금·구리 같은 원자재 25 + 주가지수 11 + 국채 5 + 환율 9) 을 2011 년부터 2019 년까지 9 년 시간 여행하며 시켰다. 결과: **성격 1 (DQN) 이 1등**, 성격 3 (A2C) 이 2등. 옛말 규칙 (TSMOM) 은 다 이겼다. 그리고 사고팔 때 내는 수수료 (거래비용) 를 감안해도 여전히 흑자였다.

핵심 발상의 전환: "예측을 잘하면 트레이딩도 잘 될 것" 이라는 종전 순서 대신, "**트레이딩 액션을 직접 학습**" 하는 순서로 바꾼 것.

## 🎓 학부생 수준 (수식 인라인 허용, 개념 병기)

**문제 정의**. 금융 시계열에서 "다음 시점 수익률" 을 회귀로 예측한 뒤 그 예측을 규칙 기반으로 포지션으로 바꾸는 파이프라인 (예: "예측 > 0 이면 매수") 은 두 가지 결함이 있다: (i) 예측 손실 함수 (MSE, 평균제곱오차) 는 트레이딩 손익과 무관, (ii) 시장마찰 (거래비용 · 슬리피지) 이 예측 단계에서 반영되지 않음. 저자들은 이 두 결함을 우회하기 위해 **강화학습** (Reinforcement Learning, 시행착오로 누적 보상을 극대화하는 에이전트 학습법) 을 채택한다.

**정식화**. 시각 $t$ 에서 에이전트가 관측하는 상태 $s_t$ 는 지난 60 시점 (약 3 개월 거래일) 의 특징 벡터 — **MACD** (Moving Average Convergence Divergence, 두 지수평균의 차이로 추세 강도를 재는 지표) 와 **RSI** (Relative Strength Index, 최근 상승분·하락분 비율로 과매수 여부를 판단하는 지표) 를 계산해 얻는다. 행동 $a_t$ 는 두 형태:

- **이산 (DQN, PG)**: $a_t \in \{-1, 0, +1\}$ (최대 공매 / 무포지션 / 최대 매수)
- **연속 (A2C)**: $a_t \in [-1, +1]$ (포지션 크기 실수)

보상 $R_t$ 는 **변동성 스케일링된 수익률**:

$$R_t = a_{t-1} \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}} \cdot r_t \cdot p_{t-1} - c \cdot |a_t - a_{t-1}| \cdot \ldots$$

여기서 $r_t$ 는 시각 $t$ 의 자산 로그수익률, $\sigma_{t-1}$ 은 60 일 EWMA (Exponentially Weighted Moving Average, 지수가중이동평균) 로 계산된 사전 변동성 추정, $\sigma_{\text{tgt}}$ 는 목표 연간 변동성 (e.g. 10%), $c$ 는 거래비용 계수 (1 bp = 0.0001). **변동성 스케일링의 요점**: 자산마다 변동성이 다르면 보상 스케일도 달라져 학습이 불안정. $\sigma_{\text{tgt}}/\sigma_{t-1}$ 곱으로 **모든 자산을 같은 리스크 단위로 정규화**.

**아키텍처**. 정책 함수 $\pi_\theta(a_t | s_t)$ (혹은 Q 함수 $Q_\theta(s_t, a_t)$) 의 표현은 **2 층 LSTM** (Long Short-Term Memory, 게이트 구조로 장기 의존성을 학습하는 순환 신경망) — 은닉 유닛 64 → 32, 활성화 Leaky-ReLU (Leaky Rectified Linear Unit, ReLU 의 음수 영역에 작은 기울기를 준 변형).

**결과**. 50 개 유동성 최상위 선물 (원자재 25 + 주가지수 11 + 국채 5 + FX 9) 을 2011–2019 년 백테스트. **DQN 이 Sharpe/Sortino 지표에서 최고**, A2C 가 2 위, PG 가 3 위. 모든 3 알고리즘이 **TSMOM** (Time Series Momentum, Moskowitz·Ooi·Pedersen 2012) 벤치마크를 상회. 거래비용 부과 후에도 흑자. 자산군별로 편향이 있으나 (원자재 우세, FX 열세 추정) 정확한 breakdown 수치는 본문 PDF 차단으로 미확인.

## 🔬 전문가 수준

**Contribution 4개** (본문 PDF 차단 하에서 verbatim WebSearch 인덱스로 검증 가능한 항목만):

1. **DRL의 futures asset class 스윕**: MDP 정식화 하에 DQN + PG (discrete action) + A2C (continuous action) 3-종의 direct policy learning 을 4-asset-class (commodities/equity indices/fixed income/FX) 50 종목에 일괄 적용, TSMOM baseline (Moskowitz·Ooi·Pedersen 2012) 을 modern DRL 로 대체 가능함을 실증. 이전 RL for trading 연구가 stock 단일 시장 또는 single-asset 에 집중한 것에 비해 asset class 다양성을 확보.
2. **Volatility-scaled reward의 도입**: reward 을 raw return $r_t$ 이 아니라 $\sigma_{\text{tgt}}/\sigma_{t-1}$ 로 스케일링한 형태로 정의. 이는 (i) cross-asset 학습 안정성 (자산 간 변동성 이질성 정규화), (ii) 시장 국면 전환 시 포지션 자동 축소 (high-vol → downscale), (iii) 실무 리스크 관리 관행 (target volatility strategy) 과의 자연 호환의 3 가지 이점을 한 번에 확보. Deep Hedging (Bühler 2019, 2026-06-19 커버) 의 CVaR/Entropic risk measure 최적화 계보와 사상적 친척.
3. **LSTM backbone 이 아직 유효함을 실증**: 2019 년 시점에서 Transformer 계열이 아직 fin ML 에 침투 전인 시기 — 2-layer LSTM (64→32) + Leaky-ReLU 조합이 daily-frequency futures 에 충분함을 실험적으로 보임. 이는 후속작 **Momentum Transformer** (arXiv:2112.08534) 로의 자연 확장 여지를 남기는 baseline.
4. **거래비용 하 흑자**: transaction cost (1 bp 규모) 를 reward 에 반영한 상태에서도 3 알고리즘 모두 TSMOM 을 상회함을 백테스트로 실증. 이는 (a) discrete action ({-1,0,1}) 의 low turnover 특성이 cost 저항성을 만들고, (b) volatility scaling 이 unnecessary rebalancing 을 억제한다는 가설과 일관.

**방어 가능한 이론적 기여**. RL 이론 자체는 새로운 기여 없음 — DQN (Mnih et al. 2015), PG (Sutton et al. 2000), A2C (Mnih et al. 2016) 모두 기존 방법. 기여는 **domain-specific reward engineering (volatility-scaled reward)** 과 **fin ML domain 에서 RL for trading 의 systematic asset-class benchmarking** 두 축.

**한계 (본문 PDF 차단 하에서 추정)**. (i) survivorship bias (2011–2019 유동성 최상위만 선정), (ii) look-ahead bias 방어 세부 미확인, (iii) 재현성 (공식 코드 미공개), (iv) hyperparameter sensitivity (본문 표 미확인), (v) transaction cost 모델의 단순성 (linear proportional 만 고려, slippage · market impact 미반영 추정), (vi) 2019 년 이후 (Covid, 유동성 shock) 시기 out-of-sample 미검증.
