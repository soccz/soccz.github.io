# 12 Glossary & References — MASTER

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Market-guided gating + Intra/Inter-stock attention + Stock universe modeling 의 핵심 개념 + reference.

## 12.1 챕터 한 줄 요약

> **"Li et al. AAAI 2024 의 *MASTER* (Market-guided Stock Transformer) 의 30+ terminology + 20+ references (cross-sectional stock prediction, gating, multi-stock dependency) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| MASTER | Market-guided Stock Transformer | Li 2024 ★ |
| Cross-sectional return | 동일 시점 multi-stock 의 returns | finance |
| Stock universe | 모든 거래 stocks 의 set | finance |
| Market indicators | 시장 전체 의 macro indicators | finance |
| Market-guided gating | market signal 로 stock attention 조절 | Li 2024 |
| Intra-stock attention | single stock 의 *time-wise* attention | Li 2024 |
| Inter-stock attention | stocks 간의 *cross-sectional* attention | Li 2024 |
| Temporal aggregation | time 축 의 sequence 집계 | Li 2024 |
| Stock embedding | per-stock 의 *latent representation* | Li 2024 |
| Feature engineering | hand-crafted technical indicators | finance |
| Lookback window | 과거 N-day 의 input | finance |
| Forecasting horizon | 미래 N-day 의 prediction | finance |
| IC | Information Coefficient (correlation) | finance |
| ICIR | IC mean / IC std | finance |
| Annual return | yearly portfolio return | finance |
| Sharpe ratio | risk-adjusted return | finance |
| Max drawdown | worst peak-to-trough decline | finance |
| Long-short portfolio | top N - bottom N quantile | finance |
| Top-K portfolio | top K predicted stocks | finance |
| Daily rebalancing | every-day portfolio update | finance |
| Stock factor model | factor-based expected return | Fama-French |
| Alpha | excess return over benchmark | finance |
| Beta | market sensitivity | CAPM |
| Risk premium | expected excess return | finance |
| Cross-sectional rank | within-day stock ranking | finance |
| Causal attention | future-blind for forecasting | NN |
| Multi-task learning | predict multiple horizons | NN |
| Stock market | A-share (China), US, etc | finance |
| Sector / Industry | stock categorization | finance |
| Concept drift | market regime change | finance |

## 12.3 References (20+)

### 12.3.1 Stock prediction lineage
```
Li et al. AAAI 2024 — MASTER (★ 본 paper)
Cui et al. 2024 — DTML
Yang et al. 2023 — GraphFlow
Kim et al. 2019 — HATS (Hierarchical attention)
```

### 12.3.2 Cross-sectional finance
```
Fama & French 1993 — 3-factor model
Carhart 1997 — 4-factor model
Gu Kelly Xiu 2020 — Empirical asset pricing via ML
Chen Pelger Zhu 2024 — Deep learning in asset pricing
```

### 12.3.3 Transformer + Finance
```
Vaswani 2017 — Transformer
Zhou 2021 — Informer
Wu 2023 — TimesNet
Liu 2024 — iTransformer
```

### 12.3.4 Attention 변형
```
Vaswani 2017 — Self-attention
Lin 2017 — Structured attention
Cheng 2016 — LSTMN (intra-attention)
```

## 12.4 자기점검

### 핵심 3 가지

1. **MASTER 의 *cross-sectional vs time-series prediction* 의 차이?**
2. **Market-guided gating 의 *mechanism*?**
3. **Intra-stock vs Inter-stock attention 의 *complementary roles*?**

### 답변

1. **Within-stock vs Across-stocks**. Time-series: *single stock 의 future from its history*. Cross-sectional: *동일 시점 모든 stocks 의 ranking* (long top, short bottom). MASTER 는 *cross-sectional rank prediction* — *relative performance*. *Hedge fund standard* — *market-neutral* portfolio.

2. **Multiplicative scaling by market state**. Market indicators (VIX, market return, volume) → gate vector g(market) ∈ [0, 1]^d. Stock embedding e_stock → e_stock ⊙ g(market). *High-volatility regime*: gate 가 *defensive features* 강화. *Bull market*: gate 가 *momentum features* 강화. → "*Regime-adaptive feature emphasis*".

3. **Within-stock vs Across-stocks signal**. Intra-stock attention: *single stock 의 time history* 에서 *important time-step* 식별 (e.g., earnings announcement). Inter-stock attention: *동일 시점 모든 stocks* 의 *correlation 학습* (e.g., sector co-movement). 둘 다 *complementary* — *temporal dependency* + *cross-sectional dependency*. MASTER 의 *unique combination*.
