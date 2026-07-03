# 03. 문제 지형도

## 배경 사다리

이 절을 이해하려면 세 가지만 알면 된다: ① **선물 (futures) 은 미래 시점의 자산 가격을 지금 확정하는 계약** 이고 (원유 · 금 · 코스피200 지수 · 미국채 · 엔달러 등이 모두 표준화된 선물로 거래됨), ② **트레이딩 전략 = 시각 $t$ 마다 "얼마나 매수/공매도 할지 (포지션)" 를 결정하는 함수** 이며, ③ **시계열 모멘텀 (TSMOM) 이란 "지난 12 개월 수익이 양이면 매수, 음이면 공매도" 라는 아주 단순한 규칙** 으로 40 년 넘게 학계·업계가 반복 검증한 가장 강력한 fin ML baseline 이다.

## 문제의 실제 상황

**상황 1: 원자재 트레이더의 아침 회의**. 어떤 헤지펀드가 50 개 선물 시장 (원유·금·구리·옥수수·코스피200·S&P500·독일 Bund·엔달러·유로파운드 등) 에서 매일 아침 6 시에 "오늘 이 상품을 얼마나 매수/공매도할지" 를 결정해야 한다. 사람이 하나하나 판단할 수 없으니 **자동화 알고리즘** 을 넣는다. 지난 20 년 표준 알고리즘은 TSMOM (Moskowitz·Ooi·Pedersen 2012, *Journal of Financial Economics*) — "지난 12 개월 수익률의 부호대로 포지션". 이건 매우 단순한 규칙이지만 통계적 유의성이 강하고 여러 자산군에 걸쳐 재현된다.

**상황 2: 예측 모델과 트레이딩 손익의 괴리**. 요즘엔 딥러닝으로 "다음 시점 수익률" 을 예측하는 회귀 모델을 만든다. 문제는 **예측 정확도 (MSE 감소) 와 트레이딩 손익 (Sharpe 상승) 이 일치하지 않는다**. 극단적으로 방향은 잘 맞추는데 크기가 어긋나면 예측은 성공했다 판단하는데 트레이딩은 손해다. 또 **거래비용** (매매 시 지불하는 spread + commission + market impact) 은 예측 손실 함수에 안 들어간다 → 학습 신호와 실제 목적 함수 사이의 gap.

**상황 3: 자산군 이질성**. 원자재 (원유) 는 하루 변동성 2 % , 국채 (미국 10 년) 는 0.3 %. 같은 반환 규칙을 두 자산에 적용하면 원유가 리스크 예산의 90 % 를 잡아먹는다. **자산 간 리스크 정규화** (일반적으로 target-vol scaling) 가 실무 필수.

## 기존 접근의 계보 (연대순 6 정거장)

### 정거장 1: Moody·Wu 1997 — *Optimization of Trading Systems and Portfolios* (첫 direct RL for trading)

- **무엇이었나**: 시계열 예측 없이 **직접 트레이딩 정책 함수** $F(s_t; \theta)$ 를 정의하고 **Sharpe ratio 를 목적 함수로** SGD 로 학습. 강화학습이라는 이름을 명시적으로 붙이진 않았으나 **direct RL / recurrent RL** 이라는 이름으로 정확히 같은 아이디어.
- **왜 부족했나**: 얕은 신경망 (당시 컴퓨팅 한계), Sharpe 를 목적 함수로 쓰기 위한 **미분 가능성 처리** 가 복잡, 단일 자산 실험.
- **교훈**: "예측 → 규칙 → 포지션" 을 **"관측 → 정책 → 포지션"** 으로 압축 가능하다는 발상의 원조.

### 정거장 2: Moskowitz·Ooi·Pedersen 2012 — *Time Series Momentum* (TSMOM 확립)

- **무엇이었나**: **지난 12 개월 수익률 부호** 로 포지션 결정하는 규칙을 **58 개 유동성 최상위 선물** (모든 asset class) 에 적용, **연간 sharpe 1.5** 수준의 놀라운 실증 결과. Journal of Financial Economics 게재로 학계 최상위 인정.
- **왜 부족했나**: (i) 12 개월 lookback 은 **hyperparameter**, (ii) 국면 전환 (regime change) 시 급격한 drawdown (예: 2008–09 momentum crash), (iii) 예측 signal 이 **1 개 통계량** 뿐 (지난 12 개월 부호) 으로 정보 활용 낭비.
- **교훈**: **단순 규칙이 이미 매우 강한 baseline** 이라는 사실. 모든 후속 DL for trading 은 반드시 TSMOM 을 이겨야 함.

### 정거장 3: Bühler·Gonon·Teichmann·Wood 2019 — *Deep Hedging* (사상적 친척, 2026-06-19 커버)

- **무엇이었나**: 옵션 헤지 문제를 **cash-invariant convex risk measure $\rho$ 의 최소화** 로 정식화, 시장마찰 하에서 신경망 정책을 SGD 로 학습. 본 논문과 **정확히 같은 시기 (2018–2019 arXiv), 같은 도메인 (fin ML), 같은 정신 (SGD-friendly 위험 지표)**.
- **왜 부족했나 (본 논문 관점)**: (i) 옵션 헤지 domain 은 continuous action, hedging = position sizing 의 자연 정식화이나 **directional trading 은 다름** (매수/공매도/무포지션 의 3-분할 vs continuous), (ii) simulator 기반 학습 (Heston) 으로 real-market 마찰 미반영.
- **교훈**: **위험 지표를 목적 함수로** 쓰는 흐름이 fin ML 전반에 성숙기. Deep Hedging 은 이걸 옵션에, 본 논문은 이걸 directional trading 에 적용한 자매 논문.

### 정거장 4: Deng·Bao·Kong·Ren·Dai 2016 — *Deep Direct Reinforcement Learning for Financial Signal Representation and Trading* (IEEE TNNLS)

- **무엇이었나**: 종전 handcrafted feature 대신 **feature learning + RL 을 통합** 한 first serious modern DRL for trading. Direct RL objective (수익률 시퀀스) 를 CNN feature + fuzzy inference 로 학습.
- **왜 부족했나**: (i) 단일 자산 (S&P500), (ii) fuzzy inference 는 이후 대세 이탈, (iii) discrete/continuous action 이분법 미구축.
- **교훈**: **feature learning 을 RL 안에 통합** 하는 흐름의 첫 정거장. 본 논문은 이걸 LSTM 으로, asset class 다양성 확보로 확장.

### 정거장 5: Jiang·Xu·Liang 2017 — *A Deep RL Framework for the Financial Portfolio Management Problem* (crypto portfolio)

- **무엇이었나**: 크립토 시장 portfolio management 에 DRL 적용 (11 개 crypto), CNN policy + PG. 실 시장 데이터 백테스트.
- **왜 부족했나**: (i) crypto 만, (ii) survivorship bias (사후 선정 코인), (iii) transaction cost 반영 미흡.
- **교훈**: **portfolio-level DRL** 의 초창기 이정표. 본 논문은 portfolio 가 아닌 **per-asset independent trading**, 나중에 Momentum Transformer (2021) 로 attention-based cross-asset 확장.

### 정거장 6: Zhang·Zohren·Roberts 2019 — *DeepLOB* (같은 저자팀, 2026-05-29 커버)

- **무엇이었나**: LOB (Limit Order Book, 지정가 주문장) 의 **10-level 주문 depth** 를 CNN + Inception + LSTM 조합으로 학습, mid-price movement classification. Micro-level (초·분 단위) 예측.
- **왜 부족했나 (본 논문 관점)**: (i) **prediction** 만, 트레이딩 policy 미정의, (ii) LOB micro 는 daily-macro 로 transfer 어려움, (iii) 3-class classification 을 실제 포지션으로 mapping 하는 층 없음.
- **교훈**: 같은 저자팀이 **"micro prediction 만" → "macro policy 도"** 로 자연 진화. **DeepLOB → 본 논문 = signal → policy** 라는 저자 계보의 명확한 진화 축.

## 공통 gap (기존 방법이 놓친 것)

**한 문장**: 2019 년 시점까지의 fin ML 은 (i) **direct policy learning** (예측 우회) + (ii) **volatility-scaled reward** (자산 간 정규화) + (iii) **discrete + continuous action 통합 비교** + (iv) **50-scale asset class 다양성** 의 4 요소를 **동시 결합한 프레임워크가 없었다**.

- Moody·Wu 1997: (i) 있음, (ii)~(iv) 없음
- TSMOM 2012: rule-based (i) 없음
- Deep Hedging 2019: (i)(ii) 있음, (iii) hedging 정식화로 대체, (iv) 옵션만
- Deng 2016: (i) 있음, (iii) 미구축, (iv) 단일 자산
- Jiang 2017: (i)(iii)(iv 부분) 있음, (ii) crypto 만
- DeepLOB 2019: (i) 없음 (prediction only)

## 본 논문의 답

**"관측 → 3-알고리즘 정책 → 변동성 스케일링된 액션 → 4-asset-class 50 종목 백테스트"** 의 4 요소 통합 프레임워크. 특히 volatility-scaled reward 로 cross-asset 학습 안정성 확보 + discrete (DQN/PG) vs continuous (A2C) 성능 격차 정면 측정 + TSMOM 을 direct-comparison baseline 으로 명시 → 이후 Momentum Transformer (arXiv:2112.08534) · Deep Learning for Options Trading (arXiv:2407.21791) · Slow Momentum Fast Reversion (arXiv:2105.13727) 등 같은 저자팀의 후속작들이 모두 이 정식화를 계승한다.
