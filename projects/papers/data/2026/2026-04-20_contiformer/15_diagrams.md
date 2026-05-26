# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: ContiFormer 의 *continuous-discrete bridge*, *ODE-driven attention*, *hybrid dynamical system* 을 ASCII 도식 + 인터랙티브 viz 로.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 인터랙티브 viz 로 *irregular observation*, *ODE flow*, *continuous attention*, *piano pedal analogy* 의 visual narrative."**

## 15.2 ASCII 도식 — Irregular Observations + Continuous Flow

```
IRREGULAR TIME SERIES:

  values
    │      ●                              ●
    │     /│\                            /│\
    │    / │ \                          / │ \
    │   /  │  \                        /  │  \
    │  /   │   ●                      /   │   \
    │ /    │   │\                    /    │    \
    │●     │   │ \                  /     │     \
    │  ○○○○○○○○○ \                /        │      \
    │   query     ●              /         │       ●
    │    ?           ?          /           │
    └─────────────────────────────────────────────► time
      t1  t2  t3       t_query     t4    t5   t6

  observations: t1, t2, t3, t4, t5, t6 (irregular)
  query: arbitrary t_query (e.g., 사이 interval)
  
  ContiFormer 의 task:
    "관측 사이 임의 시각의 representation 추론"
```

## 15.3 ASCII 도식 — Piano Pedal Analogy

```
HYBRID DYNAMICAL SYSTEM:

  Sound
    │     ┌──────┐ (pedal pressed)
    │     │      │
    │     │ ODE  │ ┌──────┐
    │     │ flow │ │      │
    │  ●  │      │ │ ODE  │  ●
    │  │  │      │ │      │  │
    │  │  ●──────│ │      │──│
    │──┘         │ │      │  │
    │            ●─┘      ●──┘
    │                                  
    └───────────────────────────────► time

  ● = piano key press (observation = reset)
  ━━━ = pedal sustain (ODE flow continuous)
  
  Music = hybrid: discrete strikes + continuous sustain.
  ContiFormer = same: discrete obs reset + ODE flow.
```

## 15.4 ASCII 도식 — Query / Key / Value Asymmetry

```
ContiFormer LAYER (paper §3.2):

  Input: {(t_i, x_i)}_{i=1..N}, t_query

  Query path (InterpLinear):
    x_i 들의 linear interp → X(t)
    q(t) = W_Q · X(t)
    
    Visual:
    x_1───x_2───x_3───x_4 (linear segments)
       \   |   /
        \  |  /
         q(t_query)
    

  Key path (OdeLinear):
    k_i(t_{i-1}) = W_K · x_{i-1}  (initial)
    dk_i/dt = f_θ^K(k_i, t)        (ODE flow)
    k_i(t_i) = ODE solve to t_i    (final)
    
    Visual:
    k_1   k_2   k_3   k_4
     │     │     │     │
     ↓     ↓     ↓     ↓ (ODE flow with reset)
     ~     ~     ~     ~

  Value path: similar to Key

  → Query 는 *간단*, Key/Value 는 *복잡 dynamics*.
```

## 15.5 ASCII 도식 — Continuous Attention Computation

```
CONTINUOUS ATTENTION (paper §3.3):

   q(t_query) ─┐
               │
   k_1(t_1) ───┤   q · k_i / √d
   k_2(t_2) ───┤───────────────► softmax_i ──► α_i (weights)
   k_3(t_3) ───┤
   k_4(t_4) ───┘
                                    │
                                    ▼
   v_1(t_1) ─── α_1 · v_1 ─┐       
   v_2(t_2) ─── α_2 · v_2 ─┼───── sum ──► z(t_query)
   v_3(t_3) ─── α_3 · v_3 ─┤
   v_4(t_4) ─── α_4 · v_4 ─┘

  → Attention 의 *standard formula*, but at *continuous query time*.
```

## 15.6 ASCII 도식 — RK4 Solver Step

```
RK4 ODE SOLVER:

  At time t_n, want z(t_{n+1}) where h = t_{n+1} - t_n:

  k1 = f(z_n, t_n)
  k2 = f(z_n + h/2 · k1, t_n + h/2)
  k3 = f(z_n + h/2 · k2, t_n + h/2)
  k4 = f(z_n + h · k3, t_n + h)
  
  z_{n+1} = z_n + (h/6) · (k1 + 2·k2 + 2·k3 + k4)

  → 4 function evaluations per step
  → O(h^4) error
  → Adaptive Dopri5 = automatic step size
```

## 15.7 ASCII 도식 — Vector Field Structure

```
VECTOR FIELD f_θ^K(z, t):

  Input: z ∈ R^d, t ∈ R
         │
         │ concatenate
         ▼
    [z, t] ∈ R^{d+1}
         │
         │ Linear (d+1 → d_hid)
         ▼
    h ∈ R^d_hid
         │
         │ activation (tanh or sigmoid)
         ▼
    h' ∈ R^d_hid
         │
         │ Linear (d_hid → d)
         ▼
    dz/dt ∈ R^d

  Hyperparams:
    - d_hid: 128 (typical)
    - activation: tanh (TS) or sigmoid (TPP)
    - layer_type: concat | concatnorm | add
```

## 15.8 ASCII 도식 — ContiFormer vs Vanilla Transformer

```
VANILLA TRANSFORMER (discrete):

  x_1   x_2   x_3   x_4
   │     │     │     │
   ▼     ▼     ▼     ▼
  Embed Embed Embed Embed
   │     │     │     │
   ▼     ▼     ▼     ▼
  ┌─────────────────────┐
  │ Attention (discrete)│
  └─────────────────────┘
   │     │     │     │
  z_1   z_2   z_3   z_4

  Query: only at t_1, t_2, t_3, t_4
  Key/Value: only at observation times
  

CONTIFORMER (continuous):

  (t_1, x_1)  (t_2, x_2)  ...  (t_N, x_N)
       │           │                │
       ▼           ▼                ▼
   Interpolate (Query) + ODE Solve (Key/Value)
       │
       ▼
  ┌──────────────────────────────────────┐
  │ q(t), k(t), v(t) for any t ∈ [0, T] │
  └──────────────────────────────────────┘
       │
       ▼
  z(t_query)  for any t_query

  → Continuous representation 가능.
```

## 15.9 Viz 카탈로그 (인터랙티브)

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `contiformer-ode-flow` | 03, 05, 15 | Irregular obs + ODE flow trajectory | obs spacing slider |
| `contiformer-asymmetric` | 05, 13, 15 | Query/Key/Value asymmetric paths | toggle Q/K/V |
| `contiformer-rk4-step` | 14, 15 | RK4 solver visualization | step size slider |

## 15.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **Piano pedal analogy 의 *technical mapping*?**
2. **Q/K/V asymmetric path 의 *information flow* 분석?**
3. **RK4 의 *4-evaluation per step* 의 *accuracy gain* 의 quantitative?**

### 답변

1. **Discrete reset + continuous flow**. 피아노: 키 누름 = 음 시작 (discrete event) + 페달 = 음 지속 (continuous decay). ContiFormer: 관측 = key/value reset (discrete) + ODE = 관측 사이 flow (continuous). 둘 다 *hybrid dynamical system* — *event-triggered piecewise continuous*. → Music modeling 과 *동일 mathematical structure*.

2. **Query = static snapshot, Key/Value = dynamic context**. Query 는 *질의 시각의 input value* 의 *linear interpolation* — *현재 시점의 정보*. Key = *관측 사이 ODE flow* 결과 — *time-varying context*. Value = same. → Attention score = "*현재 query* 가 *어느 historical dynamic context* 와 일치" — *temporal matching* 의 *information geometry*.

3. **O(h^4) error vs O(h^2) Euler**. Step h=0.1: Euler error ~ 0.01, RK4 error ~ 0.0001 (100× more accurate). Cost: Euler = 1 eval/step, RK4 = 4 eval/step (4× cost). → "*4× cost for 100× accuracy*" — *highly favorable trade*. Dopri5 의 *adaptive* 가 더 최적 — *automatic h adjustment*.

---

## 인터랙티브 시각화

```viz:contiformer-ode-flow:title=paper §3 — Irregular Obs + ODE Flow,caption=Obs spacing slider. continuous representation visualization.
```

```viz:contiformer-asymmetric:title=paper §3.2 — Q/K/V Asymmetric Paths,caption=Q/K/V toggle. InterpLinear vs OdeLinear comparison.
```

```viz:contiformer-rk4-step:title=paper §3.3 — RK4 ODE Solver Step,caption=Step size slider. accuracy vs cost trade-off.
```
