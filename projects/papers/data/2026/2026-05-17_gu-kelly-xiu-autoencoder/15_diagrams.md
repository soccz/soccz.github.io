# 15. 다이어그램 & 시각화 가이드

> 본 논문의 핵심 개념을 **ASCII 다이어그램** 으로 정리 + **인터랙티브 시각화 카탈로그**.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 7 가지 핵심 개념을 **그림 7장** 으로 정리:
  1. 표준 PCA vs 표준 Autoencoder (Prop 1 의 등가성 시각화)
  2. Conditional Autoencoder 전체 구조 (CA1)
  3. IPCA → CA0 → CA1+ 의 위계
  4. 학습 파이프라인 (Rolling OOS)
  5. 1 epoch 학습 내부
  6. 변수 중요도 카테고리
  7. 4 가지 모델 비교 매트릭스
- **인터랙티브 viz 카탈로그**: 현재 작동 3종 + 미구현 후보 9종 (명확히 분리)
- **발표용 슬라이드 3 장** 추천 (논문 전달의 최소 단위)

---

## 15.1 다이어그램 1 — 표준 PCA vs 표준 Autoencoder

> **🎯 한 줄 메시지**: "이 두 그림이 결국 같은 일을 한다" 의 시각화. 좌측 PCA (수학) 와 우측 autoencoder (신경망) 가 같은 답으로 수렴 — Prop 1 의 그림 버전.

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

> **🎯 한 줄 메시지**: "본 논문의 심장 — 두 신경망 (좌측 β-net, 우측 f-net) 이 따로 일하다가 가운데서 dot product 로 합쳐져 수익률 예측 산출". 본 그림이 paper Fig. 2 의 ASCII 재현.

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

> **🎯 한 줄 메시지**: "CA3 ⊃ CA2 ⊃ CA1 ⊃ CA0 = IPCA ⊃ PCA ⊃ Standard AE" 의 위계 — **본 논문의 4 모델이 학계의 모든 표준을 포함하는 가장 일반적 framework** 임을 시각화.

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

> **🎯 한 줄 메시지**: "60 년 데이터를 매년 한 칸씩 미루며 30 번 재학습. **시간 순서 절대 안 섞음 = look-ahead 차단**" 의 흐름도.

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

> **🎯 한 줄 메시지**: "한 학습 단계 안의 데이터 흐름 — 입력 (z, r) → β·f 네트워크 → dot product → 손실 → backprop → 가중치 업데이트". 5중 정규화가 어디서 작동하는지도 표시.

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

> **🎯 한 줄 메시지**: "94 특성 중 top 20 이 contribution 의 90% 차지. 3 카테고리 (price trend / liquidity / risk) 가 지배" — **Factor Zoo 종말의 시각화**.

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

> **🎯 한 줄 메시지**: "FF, PCA, IPCA, CA 4 모델을 4 차원 (covariates 사용·conditional β·비선형·no-arbitrage) 으로 비교. CA1+ 가 4 개 모두 ✓" — 본 논문의 학계 빈 칸 메우기 시각화.

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

### A. 현재 구현되어 챕터 안에서 작동 (8종 — paper 의 모든 Fig·Table 커버)

| viz type | 챕터 | 무엇 |
|----------|------|------|
| `autoencoder-r2-comparison` | 07 | paper Table 1 + 2 의 Total / Predictive R² (K=1~6, 7 모델 토글) |
| `autoencoder-sharpe-table` | 07 | paper Table 3 의 long-short decile Sharpe (EW/VW 토글, K 슬라이더) |
| `autoencoder-table4-tangency` | 07 | paper Table 4 의 tangency portfolio Sharpe (EW/VW × K) |
| `autoencoder-fig3-alpha` | 07 | paper Fig. 3 의 95 portfolio α scatter (model 토글, |t|>3 highlight) |
| `autoencoder-fig4-importance` | 08 | paper Fig. 4 의 top 20 variable importance (CA0~CA3 토글, 카테고리 색) |
| `autoencoder-fig5-heatmap` | 08 | paper Fig. 5 의 94 특성 ranking heatmap (5 model × 94 var) |
| `autoencoder-table5-robustness` | 08 | paper Table 5 의 odd/even permno robustness (4 시나리오 × 4 지표) |
| `autoencoder-sim-table6` | 09 | paper Table 6 의 Monte Carlo (DGP a/b × Total/Pred 토글) |

→ **paper 본문의 6 Figure + 6 Table 모두 커버**. 본 챕터의 ASCII 다이어그램 7개와 함께 본 deep dive 의 시각 자료.

**참고**: Fig. 1 (Standard AE), Fig. 2 (Conditional AE), Fig. 6 (β vs factor importance) 의 도식은 인터랙티브 보다 정적 그림이 명료 — paper Figure 자체를 [05a 5a.4](05_method_a_standard_AE.md#5a-4-fig-1), [05b 5b.4](05_method_b_conditional_AE.md#5b-4-fig-2), [08 8.5](08_empirical_characteristics.md#8-5) 에서 직접 인용 + 무지식자 callout.

---

### B. 추후 구현 후보 viz (현재 미구현, 설명만)

⚠️ **주의**: 아래 9종은 **개념 스케치 + 설명** 만 작성된 상태. JS viz 파일 없음. paper 본문에 직접 발표된 viz 가 아닌, **본 해체에서 추가 제안하는 시각화 아이디어**. 구현 전까지 본 deep dive 에서는 인터랙티브로 작동 안 함.

#### 후보 1 — Linear vs Nonlinear β(z) (개념)
- **슬라이더**: z 의 한 차원 (예: size).
- **출력**: β 의 값 (선형 vs NN).
- **메시지**: 선형은 직선, NN 은 S-curve / saturation.
- 상태: 개념만. 구현하려면 학습된 CA1 의 weight 추출 + JS 에서 forward pass 시뮬 필요.

#### 후보 2 — CA0–CA3 의 깊이 효과 (개념)
- **슬라이더**: hidden layer 수 (0, 1, 2, 3).
- **출력**: Total R², Predictive R², Sharpe.
- **메시지**: 깊이 1 만 늘려도 큰 도약, 그 이후는 미세 개선.
- 상태: 개념만. 실현은 `autoencoder-r2-comparison` 기능 확장으로 가능.

#### 후보 3 — Size × Momentum interaction heatmap (추정, paper 미발표)
- **2D heatmap**: x=mom1m, y=mvel1, color=predicted return.
- **주의**: paper 본문 Figure 에 **없음**. 본 해체의 추정 시각화 아이디어 (학계 통념 + Hong-Lim-Stein 2000 배경).
- 상태: 추정 viz. paper 의 직접 인용 아님.

#### 후보 4 — Sparsity 시각화 (paper Fig 4/5 재구성)
- **슬라이더**: top-k 특성 사용 (1, 5, 10, 20, 50, 94).
- **출력**: OOS R² 와 Sharpe.
- **메시지**: paper Fig.4/5 가 보여주는 top-20 contribution ~90% 를 슬라이더로 재구성.
- 상태: 개념만. paper 본문에 명시적 수치 없어 실제 구현 시 추정값 사용 필요.

#### 후보 5 — Rolling Sharpe over time (paper 미발표)
- **시계열 plot**: 1987–2016 의 yearly Sharpe.
- **모델 toggle**: FF, IPCA, CA1, CA3.
- **메시지**: 시기별 모델 안정성 시각화 (추정).
- 상태: 추정 viz. paper 미발표 데이터.

#### 후보 6 — α 분포 (paper Fig. 3 재현)
- **모델 toggle**: FF5, PCA, CA0, CA1, CA2, CA3.
- **출력**: |α| histogram for 95 managed portfolios.
- **메시지**: FF5 의 37 개 vs CA2 의 8 개 (|t|>3) 비교.
- 상태: 개념만. paper Fig.3 의 인터랙티브 재현으로 가능.

#### 후보 7 — Predictive R² 의 K 의존성 (paper Table 2 재현)
- **슬라이더**: K (1–6).
- **출력**: Predictive R² (FF, PCA, IPCA, CA0–CA3).
- **메시지**: K=3 부터 CA1+ 의 격차가 IPCA 대비 급격히 벌어짐.
- 상태: 이미 `autoencoder-r2-comparison` 에서 부분 구현. 별도 단순 viz 분리 가능.

#### 후보 8 — Variable Importance (paper Fig. 4 재현)
- **막대 차트**: 94 특성의 중요도 (CA0/1/2/3 별).
- **메시지**: top-20 contribution = 80% (CA0), 90% (CA1–CA3).
- 상태: 개념만. paper 본문에 명시적 ranking 없어 시각만 재현 가능.

#### 후보 9 — Decile Portfolio Cumulative Return (paper 미발표 시계열)
- **시계열**: 1987–2016 누적 수익률.
- **선**: top decile (long), bottom decile (short), long-short.
- **모델 toggle**: FF, IPCA, CA2.
- **메시지**: CA2 의 long-short 가 가장 가파른 우상향.
- 상태: 추정 viz. paper 본문에 누적 수익률 그래프 미발표.

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

1. **CA1 forward pass 한 그림으로**:
   ```
   입력: z (자산 특성, 94 차원) + r (수익률, N≈6,200 차원)
        │                           │
        ▼                           ▼
   β-network                    managed portfolio 사전계산
   (1 hidden 32 ReLU)           x = (Z'Z)⁻¹ Z'r → 94 차원
        │                           │
        ▼                           ▼
   β (자산 노출도, K=5)          f-network (단일 선형)
        │                           │
        ▼                           ▼
                            f (요인, K=5)
        └──────────  ·  ──────────┘
                     │
                     ▼
                 r̂ = β · f
                     │
                     ▼
              Loss = (r - r̂)² + λ|θ|
   ```
   - β-net 과 f-net 은 **독립** 신경망, 다른 입력 받음
   - 마지막에 dot product 로 결합 → 예측 수익률
   - α 없음 → no-arbitrage 자동 강제

2. **IPCA 와 CA0 가 같은 위치인 이유 (Proposition 2)**:
   - **수학적**: $Z'_{t-1}Z_{t-1} = \Sigma$ 상수 가정 하에 두 추정량이 **회전을 제외하고 동일**.
   - **회전 의미**: $\beta \to \beta A^{-1}$, $f \to A f$ 로 동시 변환해도 같은 적합치.
   - **실증적**: 매월 cross-sectional rank normalize 로 $Z'Z$ 가 거의 상수 → 가정 거의 만족 → 두 추정량 거의 동일 (Table 1: CA0 12.4 vs IPCA 14.5, 2.1%p 갭만).
   - **위계 다이어그램 (15.3) 의 위치**: CA0 = IPCA 가 같은 노드 — 모델 가족의 같은 점.

3. **Sparsity 시각화로 어떤 viz 가 가장 명확한가**:
   - **Viz 4 (Sparsity 슬라이더)** 가 가장 직관적:
     - 슬라이더: top-k 특성 사용 (1, 5, 10, 20, 50, 94)
     - 출력: OOS R² 와 Sharpe 곡선
     - 메시지: k=20 근처에서 **곡선이 평탄** 해짐 → "20 개로 충분"
   - **왜 막대그래프 (Fig 4) 보다 좋은가**:
     - Fig 4 는 정적 — 막대 길이 비교만.
     - Viz 4 는 인터랙티브 — 사용자가 직접 k 조절해 "94 → 20 → 10 줄이면 어디까지 안 떨어지나" 체험.
   - **다른 후보**:
     - Heatmap (Fig 5): 94 특성 모두 표시 — 전체 그림 좋지만 "20 으로 충분" 메시지 약함.
     - Bar (Fig 4): 한 모델만 보여주고 정적.
   - **결론**: Viz 4 가 본 논문의 sparsity 메시지를 **체감 가능하게** 전달 — 단 현재 미구현 ([15.8 카탈로그 B](#) 참조).
