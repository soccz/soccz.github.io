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

## 17.10 추가 도식 — Adversarial GMM 의 직관 (게임 비유)

```
   ┌────────────────────────────────────────────────────────┐
   │ Asset Pricing 의 GAN 게임 (체스 비유)                    │
   ├────────────────────────────────────────────────────────┤
   │                                                        │
   │   Player 1: SDF Network ω                              │
   │   목표: pricing error 최소화                            │
   │   "내 portfolio 가 모든 자산 잘 가격결정"               │
   │                                                        │
   │              vs                                        │
   │                                                        │
   │   Player 2: Conditional Network g                      │
   │   목표: pricing error 최대화                            │
   │   "내가 만든 test asset 에서 너 약점 드러내"            │
   │                                                        │
   │   균형 (Nash equilibrium):                              │
   │   "Player 2 가 만들 수 있는 모든 test asset 에 대해     │
   │    Player 1 이 모두 잘 가격결정"                        │
   │   = Robust SDF                                         │
   │                                                        │
   └────────────────────────────────────────────────────────┘
   
   학습 과정 (3-step):
   
   Step 1: Player 1 만 (Player 2 = constant)
            → SDF 의 기본 학습 (unconditional GMM)
            
   Step 2: Player 1 fixed → Player 2 학습
            → 가장 mispriced 한 test asset 발견
            
   Step 3: Player 2 fixed → Player 1 재학습
            → 약점 보완
            
   Converge in 3 steps (paper Internet Appendix Fig IA.1)
```

---

## 17.11 추가 도식 — 4 가지 도전과 4 가지 답

```
   ┌────────────────────────────────────────────────────────┐
   │ paper Section 1 의 4 challenges → 본 paper 의 4 답      │
   ├────────────────────────────────────────────────────────┤
   │                                                        │
   │ 도전 1: 고차원 정보                                      │
   │ "SDF 가 224+ 변수 의 함수"                              │
   │     ↓                                                  │
   │ 답: FFN (universal approximator)                       │
   │                                                        │
   │ 도전 2: 알 수 없는 함수형                                │
   │ "Linear? Polynomial? 알 수 없음"                        │
   │     ↓                                                  │
   │ 답: Deep NN (universal approximation theorem)          │
   │                                                        │
   │ 도전 3: 복잡한 동적 구조                                 │
   │ "macro 시계열의 dynamics"                                │
   │     ↓                                                  │
   │ 답: LSTM (long-range dependency)                       │
   │                                                        │
   │ 도전 4: 낮은 SNR                                         │
   │ "수익률의 95% 가 noise"                                  │
   │     ↓                                                  │
   │ 답: No-arbitrage loss + adversarial                    │
   │                                                        │
   │ → 4 답의 곱 = GAN 의 OOS SR 2.6 (vs FFN 1.5)            │
   │                                                        │
   └────────────────────────────────────────────────────────┘
```

---

## 17.12 Decision Tree — 언제 본 paper 의 GAN 을 쓸까

```
              자산 가격결정 문제?
                   │
                   ↓
            Cross-section of expected returns?
              ┌────┴────┐
              YES        NO
              │          │
              ↓          ↓
         No-arbitrage   다른 분야
         이 의미 있나?    (predictive ML)
           │
           ↓
         Many characteristics
         (>10) 사용?
           ┌────┴────┐
          YES        NO
           │          │
           ↓          ↓
       Nonlinear     Fama-French
       interaction    (linear factor 충분)
       의심?
        ┌──┴──┐
       YES    NO
        │     │
        ↓     ↓
    **GAN**   Elastic Net (KNS 2020)
    (본 paper)  (linear no-arb)
```

→ Many chars + nonlinear interaction + no-arbitrage 가 의미 있을 때 GAN 사용.

---

## 17.13 추가 도식 — Asset Pricing 60년 진화 timeline

```
   1964: CAPM (Sharpe, Lintner)
        - Single factor (market)
        - β × E[market premium]
                │
                ▼  "more factors"
   1976: APT (Ross)
        - Multi-factor framework
                │
                ▼  "specific factors"
   1992-2015: Fama-French (3, 5 factor)
        - market + size + value + profitability + investment
        - Observable factors, static β
                │
                ▼  "latent factors"
   1986: Connor-Korajczyk PCA
        - Statistical factors from cross-section
                │
                ▼  "conditional β"
   2019: KPS IPCA
        - Conditional factor model β = z'Γ (linear)
                │
                ▼  "nonlinear β"
   2021: Gu-Kelly-Xiu Autoencoder
        - Nonlinear conditional factor model
                │
                ▼  "ML + no-arbitrage"
   ┌────────────────────────────────────────────┐
   │ 2021: Chen-Pelger-Zhu GAN (본 paper)        │
   │ - Nonlinear + no-arbitrage loss             │
   │ - Adversarial test asset (GAN)              │
   │ - LSTM macro state                          │
   │ - OOS SR 2.6 (annualized)                   │
   └────────────────────────────────────────────┘
                │
                ▼  Future
   - Causal mechanism
   - Cross-asset (bonds, FX, crypto)
   - Real-time deployment
   - LLM × asset pricing
```

→ 본 paper 가 **factor zoo 시대의 종결자 + ML × 이론 통합의 시조**.

---

## 17.14 paper Fig 11/12 의 시각적 비교 (variable importance)

```
   GAN Fig 11 — 46 chars importance (top 20)
   
   ST_REV  ████████████████ (Past Returns)       
   SUV     ████████████ (Trading Frictions)
   r12_2   ██████████ (Past Returns)
   NOA     █████████ (Investment)
   SGA2S   █████████ (Intangibles)
   RNA     █████████ (Profitability)
   LTurnov ████████ (Trading Frictions)
   Lev     ████████ (Trading Frictions)
   Resid_V ████████ (Trading Frictions)
   ROA     ████████ (Profitability)
   E2P     ███████ (Value)
   D2P     ███████ (Value)
   Spread  ███████ (Trading Frictions)
   CF2P    ███████ (Value)
   BEME    ███████ (Value)
   Variance ███████ (Trading Frictions)
   D2A     ██████ (Intangibles)
   PCM     ██████ (Intangibles)
   A2ME    ██████ (Value)
   AT      ██████ (Intangibles)
   
   → 6 카테고리 모두 top 20
   → Diversified importance
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   FFN Fig 12 — 46 chars importance (top 20)
   
   ST_REV  ████████████████████████ (Past Returns)
   SUV     ███████████████ (Trading Frictions)
   r12_2   █████████████ (Past Returns)
   r2_1    ███████████ (Past Returns)
   D2P     ██████████ (Value)
   LTurnov █████████ (Trading Frictions)
   LME     █████████ (Trading Frictions)
   Rel2Hgh █████████ (Trading Frictions)
   Resid_V █████████ (Trading Frictions)
   Beta    ████████ (Trading Frictions)
   ...
   
   → Top 14 가 Trading Friction + Past Return 만
   → Concentrated importance
   → "Penny stock illiquid 의존" 의심
```

**핵심 차이**:
- GAN: Diversified (6 카테고리 모두).
- FFN: Concentrated (한 두 카테고리).
- → No-arbitrage 가 다양성 강제.

---

## 17.15 paper Fig 13 의 hidden state 시각화

```
   4 LSTM hidden states (1970-2020)
   
   Macro_0 ▁▁▂▃▆▆▃▃▂▂▁▂▁▁▂▂▁▁▁▁▁▁▂▂▂▁▁▁▁▆█▆▃▁▁▁▁▁
   Macro_1 ▆▆▆▃▂▃▂▁▁▂▂▁▁▁▁▁▁▁▁▁▂▆▃▁▁▂▁▁▁▁▁▁▆▆█▆▃▁▁▁
   Macro_2 ▁▁▁▆▆▃█▃█▆▆▃▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▆▆▆▃█▆▃▁▁▁ ← peak in recessions!
   Macro_3 ▁▁▂▃▆▆▆▆▆▃▆▃▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▆██▆▃▁▁ ← peak in recessions!
   
   NBER:   ░░██░░██░░██░░░░░░░░░░░░░░░██░░░░██░░██░░
           1970 1973-75  1980-82       1990 2001 2008
   
   → State 3, 4 가 recession 시점에 명확한 peak
   → LSTM 이 **자율적으로** business cycle 학습
```

---

## 17.16 자기점검 (이 챕터)

### 핵심 4가지
1. **Fundamental no-arbitrage equation 한 줄 그림으로?**
2. **SDF network 와 Conditional network 의 차이를 한 그림으로?**
3. **"Single linear, interaction nonlinear" 의 의미를 시각으로?**
4. **언제 GAN 을 쓰고, 언제 Elastic Net 으로 충분한가?**

### 답변
1. **$\mathbb{E}[M \cdot R^e \cdot g] = 0$**. 좌측: SDF (ω 학습), 우측: test asset (g 학습). 둘이 곱해서 평균이 0 — pricing equation. 무한 $g$ family.
2. 같은 architecture (LSTM + FFN) 다른 weights, 다른 objective. **SDF**: $\omega$ — 어떤 stocks 를 long/short 하여 SDF 만들지. **Conditional**: $g$ — 어떤 test asset 으로 SDF 검사할지. Minimax: SDF 는 pricing error 최소화, Conditional 은 최대화.
3. Plot 1: $\omega(z)$ vs $z$ — 한 char 의 SDF 효과 = 거의 직선. Plot 2: $\omega(z_1, z_2)$ 의 3D surface — saddle/dome (multiplicative). → Linear model 은 plot 1 OK, plot 2 못 잡음. GAN 만 둘 다.
4. **Many chars (>10) + nonlinear interaction 가능성** 있으면 GAN. 그러나 GAN 은 computational cost 높음 (3 days on GPU cluster). **Linear factor (Fama-French) 또는 Elastic Net (KNS 2020)** 이 충분히 잘 작동하면 그것 사용 — paper Table I 의 EN test SR 0.50 도 의미 있음. GAN 의 우위 (0.50 → 0.75) 가 cost 대비 의미 있는 경우만 사용.
