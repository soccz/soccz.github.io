# 15. 다이어그램 & 시각화 가이드

> 본 논문의 핵심 개념을 **ASCII 다이어그램** 으로 정리 + **인터랙티브 시각화 카탈로그**.

## 15.1 다이어그램 1 — 표준 PCA vs 표준 Autoencoder

```
[ Standard PCA ]                  [ Standard Autoencoder ]

  r ∈ R^N                            r ∈ R^N
   │                                  │
   │  V' (orthogonal projection)      │  W_1 (linear)
   ▼                                  ▼
  f ∈ R^K (K eigenvectors)           f ∈ R^K (bottleneck)
   │                                  │
   │  V (decoder)                     │  W_0 (linear)
   ▼                                  ▼
  r̂ = V V' r                        r̂ = W_0 W_1 r
   │                                  │
   ▼                                  ▼
  Loss = ||r - r̂||²                 Loss = ||r - r̂||²
                                   
                                     (Prop 1)
                                   W_0 W_1 = V V' (up to rotation)
```

→ **수학적으로 같은 답**.

---

## 15.2 다이어그램 2 — Conditional Autoencoder 전체 구조 (CA1)

```
     ┌─────────────────────────────────┐                  ┌─────────────────────────────────┐
     │      β Network (each stock i)   │                  │     f Network (each time t)     │
     │                                 │                  │                                 │
 z   │  z (P=95) ───┐                  │              x   │  x (P=95) ───┐                  │
 ─►  │              ▼                  │              ─►  │              ▼                  │
     │   Linear(95 → 32) + BN + ReLU   │                  │   Linear(P → K)                 │
     │              │                  │                  │       (단일 선형 변환,           │
     │              ▼                  │                  │        L_f = 1, no hidden)      │
     │   Linear(32 → K=6)              │                  │              │                  │
     │              │                  │                  │              ▼                  │
     │              ▼                  │                  │           f (K=6)               │
     │           β (K=6)               │                  │                                 │
     └─────────────────────────────────┘                  └─────────────────────────────────┘
                       │                                                │
                       └────────────────────┐  ┌────────────────────────┘
                                            ▼  ▼
                                    Dot product β'f
                                            │
                                            ▼
                                       r̂  (predicted return)
                                            │
                                            ▼
                                    Loss = (r - r̂)² + λ Σ|θ|
```

**Key**:
- β-net: 매 주식의 95 특성 (94 firm chars + 1 market const) → K=6 차원 노출도. 1 hidden layer (32 ReLU) for CA1.
- **f-net: 단일 선형 변환** (paper L_f = 1, 모든 CA0–CA3 동일). factor 가 portfolio 의 선형결합이라는 경제적 해석 유지.
- Dot product: 두 출력의 내적 = 예측 수익률

**CA0/CA2/CA3 와의 차이**: β-net 의 hidden layer 수만 변동 (CA0: 0, CA1: 1, CA2: 2, CA3: 3). f-net 은 동일.

---

## 15.3 다이어그램 3 — IPCA 와 CA0/CA1 의 위계

```
                                                   ┌──────────────────────┐
                                                   │     CA3 (3 hidden)   │
                                                   │  nonlinear, deepest  │
                                                   └────────┬─────────────┘
                                                            │ generalizes
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │     CA2 (2 hidden)   │
                                                   └────────┬─────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │     CA1 (1 hidden)   │
                                                   │  nonlinear, shallow  │
                                                   └────────┬─────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │  CA0 (no hidden)     │
                                                   │  linear              │
                                                   └────────┬─────────────┘
                                                            │ Prop. 2 (Z'Z constant)
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │  IPCA (KPS 2019)     │
                                                   │  β = Γ' z (linear)   │
                                                   └────────┬─────────────┘
                                                            │ + z 정보 제거
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │  PCA                 │
                                                   │  latent, static β    │
                                                   └────────┬─────────────┘
                                                            │ ↔ Prop. 1
                                                            ▼
                                                   ┌──────────────────────┐
                                                   │  Standard AE         │
                                                   │  (1-layer linear)    │
                                                   └──────────────────────┘
```

---

## 15.4 다이어그램 4 — 학습 파이프라인 (Rolling OOS)

```
   Year:  1957 ────────────► 1974  1975 ──── 1986  1987
              [   Train    ]    [  Val   ]    │
                                              ▼ Test 1987

   Year:  1957 ────────────────── 1975  1976 ── 1987  1988
              [        Train      ]    [  Val  ]    │
                                                    ▼ Test 1988

   ...

   Year:  1957 ────────────────────────── 2003  2004 ── 2015  2016
              [           Train           ]    [  Val  ]    │
                                                            ▼ Test 2016

   매년 재학습 (30번 반복)
   매번 1-year OOS 예측 → 30년 OOS 누적
```

---

## 15.5 다이어그램 5 — 학습 1 epoch 내부

```
   Forward Pass:
                                                                  
        z (T × N × P)                  r (T × N)                  
            │                              │                      
            ▼                              ▼                      
        β-net                         x = (Z'Z)⁻¹Z'r              
            │                              │                      
            ▼                              ▼                      
        β (T × N × K)                  f-net → f (T × K)          
            │                              │                      
            └──────────► β ⋅ f ◄───────────┘                      
                          │                                       
                          ▼                                       
                       r̂ (T × N)                                  
                                                                  
   Loss:                                                          
       L = (1/NT) Σ (r - r̂)² + λ Σ|θ|                            
                                                                  
   Backward Pass:                                                 
       ∂L/∂θ → Adam → θ_new                                       
                                                                  
   Repeat for batch / epoch
```

---

## 15.6 다이어그램 6 — 변수 중요도 (Fig. 4 의 카테고리 요약)

```
[ Top Categories (paper Section 3.6, K=5 fixed) ]
   ※ 정확한 1~20 순위는 paper Fig. 4 의 막대 길이로만 표시 (수치 미발표).
   아래는 paper 가 명시한 3 카테고리.

  Price Trend  ████████████████████   mom1m, mom12m, chmom, indmom, maxret, mom36m
  Liquidity    ███████████████████    turn, std_turn, mvel1, dolvol, ill, zerotrade, baspread
  Risk         ████████████████       retvol, idiovol, beta, betasq
  Other top-20 ████                   (일부 valuation/profitability 변수)

  나머지 70+    ▓                     near-zero contribution

[ Sparsity ]
                                                                        
  Top 20 특성의 contribution share:                                    
     CA0:  ~80%                                                        
     CA1–CA3:  ~90%                                                    
                                                                        
   → 94 chars 중 ~20개로 거의 모든 explanatory power                    
   → "Factor Zoo" 의 종말 시사
```

**주의**: 본 논문은 Fig. 4 의 막대 그래프로만 ranking 표시. 1, 2, 3, ... 같은 specific 순서는 본문에 명시 안 됨. **size × momentum heatmap** 등의 interaction 시각화는 paper 본문 (22쪽) 에 미포함 — 본 해체의 인터랙티브 viz 에서만 추정 가능.

---

## 15.7 다이어그램 7 — 4가지 모델의 비교 매트릭스

```
                  z 사용?       비선형?       시간변동 β?
   ┌──────────────────────────────────────────────────────┐
   │ FF (K=1~6)  │   ✗     │     ✗     │     ✗            │
   ├──────────────────────────────────────────────────────┤
   │ PCA         │   ✗     │     ✗     │     ✗            │
   ├──────────────────────────────────────────────────────┤
   │ IPCA / CA0  │   ✓     │     ✗     │     ✓            │
   ├──────────────────────────────────────────────────────┤
   │ CA1–CA3     │   ✓     │     ✓     │     ✓            │  ← 본 논문
   └──────────────────────────────────────────────────────┘
                                                            
   결과 (paper Table 3, OOS 30년, K=6, VW long-short Sharpe):
        FF (K=6, FF5+UMD)  -0.53                              
        PCA                -0.08                              
        IPCA               +0.96   ◄── conditional 의 효과    
        CA0                +0.88                              
        CA1                +1.40                              
        CA2                +1.53   ◄── 가장 우수             
        CA3                +1.51                              
```

---

## 15.8 인터랙티브 시각화 카탈로그

본 논문의 핵심 메시지를 **인터랙티브 viz** 로 보여줄 수 있는 곳:

### Viz 1 — Linear vs Nonlinear β(z)
- **슬라이더**: z 의 한 차원 (예: size).
- **출력**: β 의 값 (선형 vs NN).
- **메시지**: 선형은 직선, NN 은 S-curve / saturation.

### Viz 2 — CA0–CA3 의 깊이 효과
- **슬라이더**: hidden layer 수 (0, 1, 2, 3).
- **출력**: Total R², Predictive R², Sharpe.
- **메시지**: 깊이 1만 늘려도 큰 도약, 그 이후는 미세 개선.

### Viz 3 — Size × Momentum interaction heatmap (추정 viz, paper 미발표)
- **2D heatmap**: x=mom1m, y=mvel1, color=predicted return.
- **주의**: paper 본문 Figure 에는 미발표. 본 해체의 추정 시각화 (학계 통념 + Hong-Lim-Stein 2000 기반).

### Viz 4 — Sparsity 시각화 (paper Table 5 가 아닌, 본 해체 추정 viz)
- **슬라이더**: top-k 특성 사용 (1, 5, 10, 20, 50, 94).
- **출력**: OOS R² 와 Sharpe.
- **메시지**: paper Fig.4/5 가 보여주는 top-20 contribution ~90% 를 슬라이더로 재구성.

### Viz 5 — Rolling Sharpe over time (paper 미발표)
- **시계열 plot**: 1987–2016 의 yearly Sharpe.
- **모델 toggle**: FF, IPCA, CA1, CA3.
- **메시지**: 시기별 모델 안정성 시각화 (추정).

### Viz 6 — α 분포 (paper Fig. 3 재현)
- **모델 toggle**: FF5, PCA, CA0, CA1, CA2, CA3.
- **출력**: |α| histogram for 95 managed portfolios.
- **메시지**: FF5 의 37 개 vs CA2 의 8 개 (|t|>3) 비교.

### Viz 7 — Predictive R² 의 K 의존성 (paper Table 2 재현)
- **슬라이더**: K (1–6).
- **출력**: Predictive R² (FF, PCA, IPCA, CA0–CA3).
- **메시지**: K=3 부터 CA1+ 의 격차가 IPCA 대비 급격히 벌어짐.

### Viz 8 — Variable Importance (paper Fig. 4 재현)
- **막대 차트**: 94 특성의 중요도 (CA0/1/2/3 별).
- **메시지**: top-20 contribution = 80% (CA0), 90% (CA1–CA3).

### Viz 9 — Decile Portfolio Cumulative Return (paper Table 3 재현)
- **시계열**: 1987–2016 누적 수익률.
- **선**: top decile (long), bottom decile (short), long-short.
- **모델 toggle**: FF, IPCA, CA2.
- **메시지**: CA2 의 long-short 가 가장 가파른 우상향.

---

## 15.9 발표 슬라이드용 핵심 다이어그램 3개

다른 모든 그림을 빼더라도 **이 3개만 보여주면 본 논문 전달 가능**:

### 슬라이드 1: 위계 다이어그램 (15.3)
- "CA1+ ⊃ CA0 = IPCA ⊃ PCA" 한 줄로 본 논문의 위치.

### 슬라이드 2: 전체 아키텍처 (15.2)
- 두 NN + dot product 의 그림.

### 슬라이드 3: 결과 비교 매트릭스 (15.7)
- 4가지 모델 × 5가지 지표 한 표.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. CA1 의 forward pass 를 한 그림으로 그려보면?
2. IPCA 와 CA0 가 그림에서 같은 위치인 이유는?
3. Sparsity 의 의미를 어떤 다이어그램으로 가장 명확하게 보여줄까?

### 답변
1. z → β-net → β; r → x = (Z'Z)⁻¹Z'r → f-net → f; β · f = r̂. β-net 과 f-net 은 독립적인 두 가지 신경망.
2. Proposition 2 — Z'Z 상수 가정 하에 두 모델의 추정량이 회전을 제외하고 동일. 따라서 함수형 위계에서 같은 노드.
3. **Viz 4** — top-k 슬라이더로 k 변화에 따른 성능 곡선 보여주기. k=20 에서 거의 평탄해지는 것을 시각화 → "94 개가 아니라 20 개로 충분" 메시지가 한눈에 들어옴.
