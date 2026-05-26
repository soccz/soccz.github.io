# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 의 missing pieces.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 약점: (1) Transaction cost 미반영, (2) Survivorship bias 다루기 미흡, (3) Chinese A-share 의 *unique characteristic* underplay, (4) Production deployment 의 *operational risk* 미분석."**

## 18.2 약점 1 — Transaction Cost 미반영

Academic backtest 의 *zero transaction cost* 가정. 실전 deployment 시 *daily rebalance* 의 *5-10 bps cost* — *annual 12-25% drag*. MASTER 의 23.4% return → 실전 ~13-18%.

## 18.3 약점 2 — Survivorship Bias

Stock universe = current CSI-300 stocks → *delisted stocks 누락*. MASTER paper 의 *full universe* 사용 claim 이지만 detailed *bias quantification* 미공개.

## 18.4 약점 3 — Chinese A-Share 의 Unique Characteristics

A-share 의 *retail-dominant trading, ±10% daily limit, T+1 settlement* 등 *unique structure* — *US/EU market 으로 transferability* 의문. 본 deep dive 는 *cross-market generalization* 명시적으로 다루지 않음.

## 18.5 약점 4 — Production Deployment Operational Risk

Regime change (COVID 같은), data quality issues, exchange downtime 등 *operational risk* — academic paper 가 *시스템적 다루지 않음*. 본 deep dive 도 *이 critical aspect* 미반영.

## 18.6 자기점검

### 핵심 3 가지

1. **Transaction cost 의 *real-world impact* 의 quantitative scale?**
2. **Chinese A-share 의 transferability 우려?**
3. **Production deployment risk 의 *critical importance*?**

### 답변

1. **40-60% return reduction**. Academic 23.4% → with 5 bps transaction cost (~250 trades/year) → ~17%. *Daily rebalance 의 cumulative cost*. Industry 실전 deployment 시 *weekly rebalance* 또는 *capacity-aware sizing* 으로 *cost 감소* — but *academic backtest 와 real PnL 의 substantial gap*.

2. **A-share unique structure**. ±10% daily limit = *return distribution truncation*. T+1 settlement = *intraday strategy 불가*. Retail-dominant = *behavioral pattern* 다름 (e.g., momentum strong). → US market 의 *institutional dominant + no daily limit + T+0* 와 *fundamentally different*. *MASTER 의 US application* 시 *retraining + architectural adjustment* 필요.

3. **Hidden bottleneck in deployment**. Academic paper = *clean backtest*. Production = (1) *data pipeline reliability* (delayed/missing data), (2) *model serving latency* (real-time inference < 1s), (3) *regime change adaptation* (model retraining frequency), (4) *capacity management* (large fund 시 *market impact*). → 본 deep dive 가 *이 4 deployment risks* 미반영. *Quant hedge fund 의 real engineering*.
