# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 18.1 챕터 한 줄 요약

> **"4 약점: (1) Transaction cost 미반영, (2) Survivorship bias, (3) US-only universe, (4) Characteristics curation 의 *hand-engineering*."**

## 18.2 약점 1 — Transaction Cost 미반영

Academic backtest 의 *frictionless trade*. 실전 *monthly rebalance* 의 *5-10 bps cost* — *annual return 5-10% 차감*.

## 18.3 약점 2 — Survivorship Bias

CRSP 사용 시 *survivorship bias* 부분적 처리 — but *delisted stocks* 의 *return -100%* 완전 capture 어려움.

## 18.4 약점 3 — US-Only Universe

Paper 의 evaluation = US equities only (NYSE, NASDAQ). *International generalization* (Japan, Europe, Emerging) 미검증.

## 18.5 약점 4 — Hand-Engineered Characteristics

94 firm characteristics = *human-curated*. *End-to-end learning* (raw text + numbers) 미시도. *Foundation model* trend 의 *contrast*.

## 18.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Transaction cost 의 *production impact* 의 quant scale?**
3. **Hand-engineered characteristics 의 *foundation era* 의문?**

### 답변

1. **End-to-end learning vs hand-engineering**. Paper 의 *94 characteristics* = *human accumulated wisdom*. *Foundation era* (Chronos, MOIRAI) = "*raw data → end-to-end learning*". Gu-Kelly-Xiu 의 *hand-engineered approach* 가 *next-gen ML wave* 와 *philosophical conflict*. 본 deep dive 가 이 *tension* 명시 부족 — *epistemic open question*.

2. **5-10% annual return 차감**. Academic *Sharpe 0.96 + alpha 24%* → with realistic transaction cost (5 bps × 250 trades/year = 12.5%) → *production alpha 11-12%*. *여전히 우수* but *academic vs real PnL gap* 의 *quantitative reality*.

3. **Best-of-both 가능성**. Hand-engineered chars = *domain knowledge encoded*. Foundation model = *data-driven discovery*. 결합: *characteristics + raw text + multi-modal* = *richer feature space*. 2025-2026 의 *hybrid approach* — 본 deep dive 가 *direction* 제시 가능. *Future work*.
