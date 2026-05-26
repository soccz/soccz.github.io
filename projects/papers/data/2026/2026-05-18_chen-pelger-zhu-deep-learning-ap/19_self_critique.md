# 19 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 19.1 챕터 한 줄 요약

> **"4 약점: (1) GAN training instability, (2) Macroeconomic state의 *data leakage* 위험, (3) Transaction cost 미반영, (4) US-only universe."**

## 19.2 약점 1 — GAN Training Instability

GAN's *known issues*: mode collapse, vanishing gradient, hyperparameter sensitivity. *Production reliability* 의 *engineering challenge*.

## 19.3 약점 2 — Macroeconomic State Data Leakage

Macro indicators (CPI, unemployment 등) = *release lag* 존재. *Real-time inference* 시 *vintage data* 사용 필요 — paper 미명시.

## 19.4 약점 3 — Transaction Cost

Academic backtest의 frictionless trade. Monthly rebalance × 5-10 bps cost = annual 5-10% drag.

## 19.5 약점 4 — US-Only Universe

CRSP US equities only. International (Japan, Europe, EM) generalization 미검증.

## 19.6 자기점검

### 핵심 3 가지

1. **GAN training instability의 *production risk*?**
2. **Macro data leakage의 *backtest distortion*?**
3. **본 deep dive의 *Anglo-American bias*?**

### 답변

1. **Mode collapse + reproducibility**. WGAN-GP 같은 *stabilized variant* 사용 했지만 여전히 *occasional training failure*. Production deployment 시 *robust fallback* + *spectral normalization* 같은 *engineering tools* 필요. Paper의 *clean academic result* 와 *production reality* 의 gap.

2. **Real-time vs backtest 의 *information gap***. Backtest: month-end macro 즉시 사용. Real-time: 1-2 month *release lag*. *Vintage data* (점진 revised) 사용 필요 — paper 미명시. Industry 적용 시 *backtest vs real PnL gap* 의 critical source.

3. **US/Anglo finance dominance**. Paper의 evaluation = CRSP (NYSE/NASDAQ). 본 deep dive 의 references 60%+ US finance journals. *International perspective* (Japan TOPIX, Europe STOXX, EM MSCI) underplay. *Honest disclosure*: 본 deep dive 는 US-centric — *fair representation* 의 *self-aware limitation*.
