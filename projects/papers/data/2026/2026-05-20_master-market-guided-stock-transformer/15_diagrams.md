# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: MASTER 의 *intra/inter attention*, *market gating*, *cross-sectional ranking* 의 visual narrative.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *stock universe modeling*, *3-axis attention (time + cross + market)*, *gating mechanism*, *long-short portfolio* 의 visual narrative."**

## 15.2 ASCII 도식 — Stock Universe (Cross-Sectional View)

```
DAILY STOCK UNIVERSE (e.g., CSI-300):

  At time t:
   Stock 1  (AAPL):  features = [vol, return, indicators]
   Stock 2  (MSFT):  features = [vol, return, indicators]
   Stock 3  (GOOG):  features = [vol, return, indicators]
   ...
   Stock 300 (XYZ):  features = [vol, return, indicators]
   
   Market state: [VIX, market return, volume, ...]
   
   Targets:
     return_{t+1} for each stock
     → rank top 30 (long), bottom 30 (short)
```

## 15.3 ASCII 도식 — Three-Axis Attention

```
MASTER ATTENTION ARCHITECTURE:

  Axis 1: Time (intra-stock)
  ───────────────────────────
  For each stock, attend over its T-day history:
  
     Stock 1:  [t1, t2, t3, ..., tT]
                 │   │   │        │
                 └───┴───┴────────┘
                  intra-attention

  Axis 2: Stocks (inter-stock)
  ───────────────────────────
  For each time, attend across N stocks:
  
     Day t:  [Stock1, Stock2, ..., StockN]
                │       │            │
                └───────┴────────────┘
                 inter-attention (cross-sectional)

  Axis 3: Market (gating)
  ───────────────────────────
  Market state → feature mask:
  
     market_t → g(market_t) ∈ [0,1]^d
                    │
                    ▼ element-wise
              stock_feat × g(market_t)
                    │
                    ▼
              regime-conditioned features
```

## 15.4 ASCII 도식 — Market Gating Mechanism

```
MARKET-GUIDED GATING:

   market features (VIX, return, etc.)
        │
        │ MLP encoding
        ▼
   z_market ∈ R^{d/2}
        │
        │ Gate network
        ▼
   g_t = sigmoid(MLP(z_market)) ∈ [0,1]^d

  Bull market (low VIX, high return):
    g_t ≈ [0.9, 0.8, 0.7, ..., 0.2]
    → momentum features 강조

  Bear market (high VIX, low return):
    g_t ≈ [0.2, 0.3, 0.8, ..., 0.9]
    → defensive features 강조

  Stock features = raw_features × g_t
    → "regime-conditioned representation"
```

## 15.5 ASCII 도식 — Long-Short Portfolio Construction

```
PORTFOLIO CONSTRUCTION (paper §4):

  At time t, predict r̂_{t+1} for all N stocks:
  ┌────────────────────────────────────┐
  │ Stock 1: predicted_rank = 8        │
  │ Stock 2: predicted_rank = 142      │
  │ Stock 3: predicted_rank = 23       │
  │ ...                                 │
  │ Stock 300: predicted_rank = 269    │
  └────────────────────────────────────┘
        │
        │ Sort by predicted_rank
        ▼
  ┌────────────────────────────────────┐
  │ Top 30 (rank 1-30):    LONG  ($X)  │
  │ Middle 240:            (ignored)   │
  │ Bottom 30 (rank 271-300): SHORT ($X)│
  └────────────────────────────────────┘
        │
        │ Equal weight, daily rebalance
        ▼
  Portfolio return = Long return - Short return
                   = market-neutral excess return
```

## 15.6 ASCII 도식 — Performance Comparison

```
MASTER vs Baselines (paper Table 1):

   Model          IC      ICIR    Annual    Sharpe
   ────────────────────────────────────────────────
   LSTM           0.045   0.312   14.8%    1.12
   GAT            0.052   0.385   16.5%    1.28
   HATS           0.058   0.421   18.2%    1.45
   DTML           0.063   0.461   20.1%    1.62
   **MASTER**     0.072   0.521   23.4%    1.84  ★
   ────────────────────────────────────────────────

  Improvement over best baseline:
    IC: +14%, Sharpe: +14%, Annual return: +16%
```

## 15.7 ASCII 도식 — Computational Cost

```
COMPUTATIONAL COMPLEXITY:

   N stocks, T time-steps, d hidden:
   
   Intra-stock attention: O(N · T² · d)
   Inter-stock attention: O(T · N² · d)
   Total per layer: O(NT(T+N)·d)
   
   For N=300, T=10, d=128:
     Intra: 300·100·128 = 3.8M
     Inter: 10·90000·128 = 115M
     → Inter-stock dominates with large N

   Optimization:
     - Sparse attention for inter-stock
     - Sector-based clustering for attention masks
```

## 15.8 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `master-stock-universe` | 03, 15 | Stock universe + cross-sectional view | num stocks slider |
| `master-gating` | 05b, 14, 15 | Market gating visualization | market regime selector |
| `master-portfolio` | 06, 14, 15 | Long-short portfolio performance | top-K selector |

## 15.9 자기점검

### 핵심 3 가지

1. **Three-axis attention 의 *information flow* 의 의의?**
2. **Long-short portfolio 의 *market-neutral 핵심*?**
3. **Inter-stock attention 의 *quadratic complexity* 의 production impact?**

### 답변

1. **3-fold conditioning**. Axis 1 (intra): "*Stock 자체 의 history*" 정보. Axis 2 (inter): "*동일 시점 다른 stocks*" 정보. Axis 3 (market): "*전체 시장 regime*" 정보. → Stock prediction = "*history + peers + regime*" 의 *3-way fusion*. *Information geometry* 의 *multi-source* — classical single-stock LSTM 대비 *richer signal*.

2. **Market beta hedge**. Long top 30 + Short bottom 30 = *equal dollar amount* on both sides. Market가 *uniformly 상승* 시: long 이익 + short 손실 → *net 0* (market exposure cancel). 우리가 잡는 것 = "*long stocks 이 short stocks 보다 outperform*" 의 *relative bet*. → "*market-neutral excess return*" — *hedge fund alpha*.

3. **N=300 시 manageable, N=10000 시 critical**. Inter-stock = O(N²d) = 300×300×128 = 11.5M per time. T=10 시 총 115M — *V100 GPU 에서 acceptable*. *Russell 3000* (N=3000) 의 경우 100x cost — *training cost prohibitive*. *Solution*: sparse attention (sector-based clustering, top-K attention) — paper 미반영, *production engineering* 필요.

---

## 인터랙티브 시각화

```viz:master-stock-universe:title=paper §3 — Stock Universe,caption=Stock count slider.
```

```viz:master-gating:title=paper §3.2 — Market Gating,caption=Regime selector.
```

```viz:master-portfolio:title=paper §4 — Long-Short Portfolio,caption=Top-K selector.
```
