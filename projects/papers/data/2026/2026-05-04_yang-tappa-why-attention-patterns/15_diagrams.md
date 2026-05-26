# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: TAPPA 의 5 pattern types + Q-sim × RoPE 2D plane + spectral decomposition 의 시각.

## 15.1 ASCII — 5 Attention Pattern Types

```
Diagonal:                  Stripe:
    ┌────────────┐             ┌────────────┐
    │■           │             │■  ■  ■  ■ │
    │■■          │             │ ■  ■  ■  ■│
    │ ■■         │             │■  ■  ■  ■ │
    │  ■■        │             │ ■  ■  ■  ■│
    │   ■■       │             │■  ■  ■  ■ │
    └────────────┘             └────────────┘
    → 인접 토큰 attention      → 주기적 attention


Block:                     Spike:
    ┌────────────┐             ┌────────────┐
    │■■■   ■■    │             │            │
    │■■■   ■■    │             │      ■     │
    │■■■   ■■    │             │      ■     │
    │   ■■■■    │             │      ■     │
    │   ■■■■    │             │      ■     │
    └────────────┘             └────────────┘
    → 클러스터 attention       → 단일 토큰


Edge:
    ┌────────────┐
    │■          ■│
    │■          ■│
    │■          ■│
    │■          ■│
    │■          ■│
    └────────────┘
    → 시작/끝 강조
```

## 15.2 ASCII — Q-sim × RoPE Plane (paper main framework)

```
                    Q-similarity (high)
                          │
   Diagonal              │              Block
   (dense local)        │              (cluster)
                          │
─────────────────────────┼──────────────────── RoPE freq
   Mid                    │              Mid                  (Low → High)
                          │
   Stripe                │              Spike
   (periodic)            │              (sparse)
                          │
                    Q-similarity (low)


Region 분류:
  Top-left (high Q, low RoPE freq):   Diagonal — local attention
  Top-right (high Q, high RoPE freq): Block — cluster within
  Bottom-left (low Q, low RoPE freq): Stripe — periodic
  Bottom-right (low Q, high RoPE freq): Spike — sparse
  Edge cases:                          Edge — boundary
```

## 15.3 ASCII — RoPE Spectral Decomposition

```
Head dim d = 64, theta_base = 10000:

  k:        0      1      2     ...    30    31
  θ_k:      1.0   0.56  0.32   ...  1e-4  3e-5
  Period:  6.3   11.2   19.5   ...  60K   200K

  Pattern correspondence:
    k=0 (θ=1):       period 6 tokens → fine diagonal
    k=1 (θ=0.56):    period 11 → tight block
    k=2 (θ=0.32):    period 20 → medium block
    k=5 (θ=0.06):    period 100 → stripe
    k=15 (θ=0.001):  period 6K → long-range
    k=30+ (θ<1e-4):  period 60K+ → effectively static
```

## 15.4 ASCII — Layer × Head Pattern Distribution (LLaMA-7B)

```
Layer ──→
   1  2  3  4  5  6  7  8  9 ...  30  31  32
H1 D  D  D  S  S  B  B  B  B ...  Sp  Sp  Sp
H2 D  D  S  S  B  B  B  S  S ...  Sp  Sp  M
H3 D  S  S  B  B  B  S  S  S ...  Sp  M   Sp
...
H32 D D  S  S  B  B  S  Sp Sp ...  M  Sp  Sp

D = Diagonal, S = Stripe, B = Block, Sp = Spike, M = Mixed

Layer-depth trend:
  Layers 1-5: Diagonal dominant (local context aggregation)
  Layers 6-15: Stripe + Block (mid-range structure)
  Layers 16-25: Block + Spike (object identification)
  Layers 26-32: Spike + Mixed (high-level reasoning)
```

## 15.5 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `tappa-pattern-types` | 02, 13, 15 | 5 pattern types side-by-side | pattern selector |
| `tappa-qsim-rope-plane` | 04, 13, 15 | Q-sim × RoPE 2D plane | model selector |
| `tappa-spectral` | 05c, 14, 15 | RoPE spectral decomposition | head dim |
| `tappa-layer-distribution` | 06, 13, 15 | Layer × head pattern matrix | model selector |

## 15.6 자기점검 (이 챕터)

### 핵심 3 가지

1. **5 pattern types 의 *결정적 visual signature*?**
2. **Q-sim × RoPE plane 의 *4 region* 의 의미?**
3. **Layer-depth pattern trend 의 *learned hierarchy*?**

### 답변

1. **각 pattern 의 *attention matrix shape***. Diagonal = *bottom-left to top-right line*. Stripe = *parallel diagonal lines*. Block = *clustered square regions*. Spike = *single column/row*. Edge = *border-emphasized*. 시각적으로 *immediately distinguishable*.

2. **2-axis classification 의 *full coverage***. *High Q-sim + Low RoPE freq* = local dense (diagonal). *High Q-sim + High RoPE freq* = clustered local (block). *Low Q-sim + Low RoPE freq* = periodic (stripe). *Low Q-sim + High RoPE freq* = sparse focal (spike). → *모든 attention pattern* 이 *2D coordinate* 으로 *unique location*.

3. **Information processing 의 *cascading hierarchy***. Early layers (1-5) = *local context aggregation* (diagonal). Mid layers (6-15) = *medium-range structure* (stripe/block). Late layers (16-32) = *object/concept-specific focus* (spike). → "*shallow → deep* 의 *abstraction increase*" 의 *attention pattern signature*.

---

## 인터랙티브 시각화

```viz:tappa-pattern-types:title=paper §3 — Pattern types,caption=Pattern selector.
```

```viz:tappa-qsim-rope-plane:title=paper main framework,caption=Model selector.
```

```viz:tappa-spectral:title=paper §5,caption=Model selector.
```

