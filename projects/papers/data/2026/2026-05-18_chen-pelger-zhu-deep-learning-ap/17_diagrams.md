# 17. 다이어그램 & 시각화 가이드

> 본 논문의 핵심 개념을 **ASCII 다이어그램** + **인터랙티브 시각화 카탈로그**.

## 17.1 다이어그램 1 — Fundamental No-Arbitrage Equation

```
       Conditional moment (paper Eq 2):
                                                          
       E[ M(t+1) · R^e(t+1,i) · g(I_t, I_{t,i}) ] = 0     
                                                          
       └──┬──┘     └──────────┘     └──────────┘          
        SDF       excess return    test asset cond.       
       (modeled by ω)              (modeled by g)         
                                                          
   For any g — infinite family of moment conditions.      
                                                          
   본 논문 :                                             
       Loss = (1/N) Σ_j  | E[M R^e g_j] |² → adversarial 
                                                          
   Eq (3):                                                
                                                          
       min   max    (1/N) Σ_j | E[(1 - Σ_i ω_i R^e_i) R^e_j g_j] |²
        ω      g                                          
                                                          
       └─┬─┘  └─┬─┘                                       
        SDF    Adversary                                  
       network  network                                   
```

---

## 17.2 다이어그램 2 — GAN Model Architecture

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  SDF Network (ω)               Conditional Network   │
│                                       (g)            │
│                                                      │
│  macro I_t (178 dim, time series)                    │
│      │                            │                  │
│      ▼                            ▼                  │
│   ┌────────┐                  ┌────────┐             │
│   │  LSTM  │                  │  LSTM  │             │
│   └────┬───┘                  └────┬───┘             │
│        │ h_t (K_h=4)               │ h^g_t (K_h=4)   │
│        ▼                           ▼                 │
│   ┌─────────────────────┐   ┌─────────────────────┐  │
│   │ concat              │   │ concat              │  │
│   │ chars I_{t,i} (46)  │   │ chars I_{t,i} (46)  │  │
│   └────────┬────────────┘   └────────┬────────────┘  │
│            │                          │              │
│            ▼                          ▼              │
│         ┌──────┐                  ┌──────┐           │
│         │ FFN  │                  │ FFN  │           │
│         │(2L)  │                  │(2L)  │           │
│         └───┬──┘                  └───┬──┘           │
│             │                         │              │
│             ▼                         ▼              │
│          ω_{t,i} (1 dim/stock)     g (D=8 inst.)     │
│             │                         │              │
│             └────────────┬────────────┘              │
│                          ▼                           │
│              Loss = (1/N) Σ |E[M R^e g]|²            │
│                                                      │
│                          │                           │
│                  Minimax: min_ω max_g                │
│                          │                           │
│                          ▼                           │
│                 3-step training                      │
│                          │                           │
│                          ▼                           │
│              Ensemble of 9 → averaged output         │
└──────────────────────────────────────────────────────┘
```

---

## 17.3 다이어그램 3 — 4 Models 비교 매트릭스

```
                  Nonlinear?    No-arb?    LSTM macro?    Adversarial?
   ┌──────────────────────────────────────────────────────────────────┐
   │ LS  (Linear)    │   ✗     │     ✓     │     ✗     │     ✗      │
   ├──────────────────────────────────────────────────────────────────┤
   │ EN  (Linear+EN) │   ✗     │     ✓     │     ✗     │     ✗      │
   ├──────────────────────────────────────────────────────────────────┤
   │ FFN (Forecasting)│   ✓     │     ✗     │     ✗     │     ✗      │
   ├──────────────────────────────────────────────────────────────────┤
   │ GAN (본 논문)   │   ✓     │     ✓     │     ✓     │     ✓      │
   └──────────────────────────────────────────────────────────────────┘
                                                                       
   Test SR (OOS 1992-2016, 월간):                                      
        LS   0.42                                                      
        EN   0.50                                                      
        FFN  0.44                                                      
        GAN  0.75   ← 모든 element 결합의 효과                          
                                                                       
   Annualized:                                                         
        FF5   0.8                                                      
        LS    1.45                                                     
        FFN   1.5                                                      
        EN    1.7                                                      
        GAN   2.6                                                      
```

---

## 17.4 다이어그램 4 — Training Pipeline

```
   Year:  1967 ────────── 1986  1987 ── 1991  1992 ─────────── 2016
              [   Train    ]    [  Val  ]    [    Test (OOS)    ]
              20 years          5 years     25 years

   Step 1 (unconditional SDF):
      - macro_seq, chars → LSTM + FFN → ω
      - Loss = (1/N) Σ |E[M R^e · 1]|²  (g=1)
      - Adam, 50 epochs
      
   Step 2 (adversary):
      - Fix ω, train g
      - Loss = -(1/N) Σ |E[M R^e g]|²  (negate to maximize)
      - Adam, 50 epochs
      
   Step 3 (SDF re-train):
      - Fix g, re-train ω
      - Loss = (1/N) Σ |E[M R^e g]|²
      - Adam, 50 epochs
      
   → 9 ensemble (different seeds)
   → ω_final = (1/9) Σ ω^(j)
   
   Hyperparameter selection (on Valid):
      - Layers: 2 (best)
      - Hidden states: 4 (best)
      - Instruments D: 8 (best)
```

---

## 17.5 다이어그램 5 — SDF Structure 발견

```
┌─────────────────────────────────────────────────┐
│  Single Characteristic → SDF weight ω           │
│                                                 │
│  ω(ST_REV)         linear ─────────             │
│  ω(LME)            linear ─────────             │
│  ω(BEME)           linear ─────────             │
│  ω(r12_2)          linear ─────────             │
│                                                 │
│  → 거의 linear 효과                             │
│  → Linear EN 도 single-sorted 잘 함            │
└─────────────────────────────────────────────────┘
                                                  
┌─────────────────────────────────────────────────┐
│  Two Characteristics → SDF weight ω             │
│                                                 │
│  ω(ST_REV × r12_2):  saddle / multiplicative   │
│       ╱ \                                       │
│      /   ╲                                      │
│     ╱     ╲                                     │
│    ─────────                                    │
│                                                 │
│  ω(LME × BEME):  dome / multiplicative         │
│      ___                                        │
│     /   \                                       │
│   ╱       ╲                                     │
│  ────────────                                   │
│                                                 │
│  → 강한 nonlinear interaction                  │
│  → Linear 불가, GAN 만 가능                    │
└─────────────────────────────────────────────────┘
```

---

## 17.6 다이어그램 6 — Variable Importance Categories

```
[ GAN — 6 categories 모두 top 20 (Fig 11) ]
                                                  
  Trading Frictions  ████████████  SUV, LME, ...  
  Past Returns       ███████████   ST_REV, r12_2  
  Investment         █████████     NOA, Inv, ...  
  Profitability      ████████      ROA, ROE, ...  
  Value              ██████        BEME, A2ME     
  Intangibles        █████         AT, OL, ...    
                                                  
[ FFN — Trading Friction + Past Return 만 (Fig 12) ]
                                                  
  Trading Frictions  ████████████████████  ↑      
  Past Returns       ███████████████        집중  
  Investment         ██                            
  Profitability      █                             
  Value              ░                             
  Intangibles        ░                             
                                                  
  → FFN 은 penny stock illiquid 에 over-fit 의심   
  → No-arbitrage 가 다양한 risk 발견 강제          
```

---

## 17.7 다이어그램 7 — LSTM Hidden States 와 NBER

```
[ Macroeconomic Hidden States (Fig 13) ]
                                                       
  State 1:   ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲                    
              ▒              ▒      ▒                  
            (cyclical, mild peak in recessions)        
                                                       
  State 2:   ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲                    
              ▒              ▒      ▒                  
            (different cycle, different risks)         
                                                       
  State 3:    ╱╲    ╱╲    ╱╲                          
                ▓        ▓                             
            (clear peak in NBER recessions)            
                                                       
  State 4:    ╱╲    ╱╲    ╱╲                          
                ▓        ▓                             
            (clear peak in NBER recessions)            
                                                       
  ▓ = NBER recession period                            
                                                       
  → LSTM 이 명시적 supervision 없이 business cycle 학습 
  → 4 state 가 서로 다른 macro risk 잡음              
```

---

## 17.8 인터랙티브 시각화 카탈로그

### Viz 1 — SDF Performance Comparison (Table I)
- **모델 toggle**: LS, EN, FFN, GAN
- **Metric toggle**: SR, EV, XS-R²
- **Sample toggle**: Train, Valid, Test
- **메시지**: GAN 이 모든 모델·metric·sample 에서 best.

### Viz 2 — Macro Inclusion Effect (Fig 6)
- **버튼**: Hidden states, No macro, All macro (raw), UNC
- **출력**: SR plot
- **메시지**: Hidden states 가 최적. all macro raw 는 붕괴.

### Viz 3 — β-Sorted Linear Relation (Fig 8)
- **슬라이더**: quantile 수 (5, 10, 20)
- **출력**: β-mean scatter + linear fit
- **메시지**: R² > 0.95 — no-arbitrage 와 일관.

### Viz 4 — Variable Importance (Fig 11, 12)
- **모델 toggle**: GAN vs FFN
- **출력**: 46 chars bar chart by category
- **메시지**: GAN 6 카테고리, FFN 2 카테고리.

### Viz 5 — Decile Cumulative Returns (Fig 7)
- **시계열 plot**: 1992-2016 의 10 decile 누적 수익
- **메시지**: Decile 10 vs Decile 1 의 명확한 spread.

### Viz 6 — SDF Structure (Fig 14)
- **2D contour**: ω(char1, char2)
- **char 1, 2 슬라이더**: 두 특성 선택
- **메시지**: Single char linear, interaction nonlinear.

### Viz 7 — GAN vs FFN Predicted Returns (Fig 9, 10)
- **모델 toggle**: GAN, FFN, EN, LS
- **출력**: Predicted vs Actual scatter (45° line)
- **메시지**: GAN 만 45° 근처 align.

### Viz 8 — LSTM Hidden States Time Series (Fig 13)
- **시계열 plot**: 4 state 시계열, NBER recession 음영
- **메시지**: business cycle 자동 발견.

---

## 17.9 발표 슬라이드용 핵심 다이어그램 3개

다른 모든 그림을 빼더라도 **이 3개만 보여주면 본 논문 전달 가능**:

### 슬라이드 1: GAN Architecture (17.2)
- 두 NN + LSTM + minimax 그림.

### 슬라이드 2: 4 Models 매트릭스 (17.3)
- LS/EN/FFN/GAN 의 4-element 비교 + SR 결과.

### 슬라이드 3: SDF Structure 발견 (17.5)
- Single linear + Interaction nonlinear 의 한 그림.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. Fundamental no-arbitrage equation 한 줄 그림으로?
2. SDF network 와 Conditional network 의 차이를 한 그림으로?
3. "Single linear, interaction nonlinear" 의 의미를 시각으로?

### 답변
1. **$\mathbb{E}[M \cdot R^e \cdot g] = 0$**. 좌측: SDF (ω 학습), 우측: test asset (g 학습). 둘이 곱해서 평균이 0 — pricing equation. 무한 $g$ family.
2. 같은 architecture (LSTM + FFN) 다른 weights, 다른 objective. **SDF**: $\omega$ — 어떤 stocks 를 long/short 하여 SDF 만들지. **Conditional**: $g$ — 어떤 test asset 으로 SDF 검사할지. Minimax: SDF 는 pricing error 최소화, Conditional 은 최대화.
3. Plot 1: $\omega(z)$ vs $z$ — 한 char 의 SDF 효과 = 거의 직선. Plot 2: $\omega(z_1, z_2)$ 의 3D surface — saddle/dome (multiplicative). → Linear model 은 plot 1 OK, plot 2 못 잡음. GAN 만 둘 다.
