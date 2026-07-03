# 10b. 사고 확장 — Follow-up 논문 3편 (선행 1 / 경쟁 1 / 후속 1)

## 선행 후보 (본 논문의 조상 계보 심화) — **Moody·Wu 1997, "Optimization of Trading Systems and Portfolios"**

### 어떤 논문인가

Moody 팀 (Oregon Graduate Institute) 이 1997 년 발표한 **Direct RL for Trading** 의 원조. 정책 함수 $F_t = \tanh(u \cdot F_{t-1} + \theta^T x_t)$ 을 SGD 로 학습하되 목적함수를 **Differential Sharpe Ratio (DSR)**:

$$\text{DSR}_t = \frac{\Delta A_t \cdot B_{t-1} - \frac{1}{2} A_{t-1} \cdot \Delta B_t}{(B_{t-1} - A_{t-1}^2)^{3/2}}$$

로 정의. $A_t, B_t$ 는 각각 1차, 2차 moment 의 EWMA. Recurrent 구조로 이전 포지션 $F_{t-1}$ 을 상태에 포함.

### 본 논문과의 관계

**직접 선행**. 본 논문의 direct policy learning 아이디어를 22 년 앞서 제안. 다른 점: (i) shallow neural network vs LSTM, (ii) single asset vs 50, (iii) DSR objective 명시 vs multi-algorithm SGD, (iv) 1990 년대 컴퓨팅 한계로 실증 규모 작음.

### 무엇을 얻을 수 있나

- **DSR objective 재도입 가능성**: 본 논문은 rewards-then-sum 방식이지만 Moody-Wu 방식으로 Sharpe 를 매 시점 미분 가능한 형태로 반영하면 정책이 Sharpe 를 직접 최대화 가능.
- **Recurrent 정책 구조**: state 에 이전 포지션 $F_{t-1}$ 명시 포함 → transaction cost 를 정책이 자연스레 학습.
- **P1 ProTran-TFA 확장**: DSR objective 를 quantile-forecast-informed policy 의 학습 target 으로.

## 경쟁 후보 (같은 시기 다른 접근) — **Deep Hedging (Bühler·Gonon·Teichmann·Wood 2019, Quantitative Finance)** [2026-06-19 커버]

### 어떤 논문인가

**같은 정신을 옵션 헤지에 적용**. Cash-invariant convex risk measure $\rho$ (Entropic / CVaR) 를 목적함수로 신경망 정책 $\delta(s)$ 학습. Ben-Tal-Teboulle OCE 표현으로 SGD-friendly 형태. Heston simulator 위 실증.

### 본 논문과의 관계

**사상적 쌍둥이**. 2018-2019 동시기, fin ML SGD-friendly risk 최적화라는 정신은 같음. 다른 점:
- **문제**: 옵션 헤지 vs directional trading
- **환경**: simulator 기반 (Heston) vs 실 시장 데이터
- **정식화**: continuous position 에 특화 vs discrete/continuous 이분
- **리스크 지표**: convex risk measure (OCE 표현) vs vol-scaled reward
- **소속**: JP Morgan QR + ETH vs Oxford-Man

두 논문은 같은 시대 fin ML SGD 정신의 **두 축**: (i) 옵션·risk-neutral world (Deep Hedging), (ii) directional·physical-measure world (본 논문). 후속 통합 연구는 Deep Learning for Options Trading (Wood·Tan 2024 arXiv:2407.21791) 로 실현.

### 무엇을 얻을 수 있나

- **CVaR / Entropic reward 도입 가능성**: 본 논문의 vol-scaled reward 대신 OCE 형태로 tail-aware reward 정의.
- **Simulator 기반 학습 vs 실 데이터 학습 trade-off**: 두 방식의 장단점 대비.
- **P1 ProTran-TFA 자연 확장**: quantile-forecast + Deep Hedging OCE + Zhang directional 을 종합해 확률 예측 → tail-aware risk-optimized policy 파이프라인.

## 후속 후보 (본 논문의 실제 후속작) — **Momentum Transformer (Wood·Giegerich·Roberts·Zohren 2022, arXiv:2112.08534)**

### 어떤 논문인가

**같은 저자팀의 direct 후속작**. 본 논문의 LSTM → Transformer 로 백본 교체. Variable Selection Network (VSN, TFT 계열) 로 feature-level interpretable attention 도입. Financial Data Science 계열 venue 게재 예상.

### 본 논문과의 관계

**직접 후속**. 같은 MDP 정식화 (state = 60-obs feature sequence, action = target position, reward = vol-scaled return), 같은 저자팀. 다른 점:
- **백본**: LSTM 2-layer → **Transformer with attention**
- **Interpretability**: black-box LSTM → VSN 으로 feature-level attribution
- **성능**: LSTM 대비 Sharpe 상승 실증 (정확 수치 후속작 원문 확인 필요)

**"이 논문은 LSTM 시대의 마지막 대표작, Momentum Transformer 는 Transformer 시대의 첫 대표작"** 관점으로 위치.

### 무엇을 얻을 수 있나

- **Attention 도입이 fin ML directional trading 에서 실제 효과** 를 실증한 첫 증거.
- **APF motif dynamics 관점**: daily futures 에 attention 을 도입하면 어떤 motif (diagonal/stripe/block) 가 학습되는가 → APF main track 의 fin ML 확장 substrate.
- **§B mech interp 결합 가능성**: Momentum Transformer 의 attention head 를 ACDC (Conmy 2023) / Sparse Feature Circuits (Marks 2024) 로 해체 → **rl-trading + mech interp** novel 니치의 실행 가능성 증명.
- **VSN 채택**: TFT 스타일 interpretable feature selection 이 실무 규제 대응 (설명 가능한 AI) 에 활용 가능.

## Follow-up 3 편 종합 map

```
Moody·Wu 1997 (선행, DSR direct RL)
     ↓
[본 논문] Zhang·Zohren·Roberts 2020 (LSTM + DQN/PG/A2C + vol-scale)
     ↑                                      ↓
Bühler·Gonon·Teichmann·Wood 2019            Momentum Transformer 2022
(경쟁, 옵션 헤지 OCE)                      (후속, Transformer + VSN)
                                                 ↓
                                          Options Trading (Wood 2024) — 두 계보 종합
```

## 추가 읽기 (선택적)

- **Slow Momentum with Fast Reversion** (Wood 2021, arXiv:2105.13727): 같은 저자팀. Change-point detection + policy 결합.
- **Trading with the Momentum Transformer** (Wood 2021 확장): interpretability 심화.
- **FinRL** (Liu 2020, arXiv:2011.09607): open-source 실무 도구 방향.
- **Deep Direct RL for Financial Signal** (Deng 2016, IEEE TNNLS): 조상 계보 중간 정거장.
