# 19 Diagrams & Interactive Visualizations

본 deep dive 에서 inline 으로 삽입한 ASCII 도식과 인터랙티브 viz 카탈로그.

---

## ASCII 도식 1 — Autoformer 전체 architecture

```
                 ENCODER  (N=2)                              DECODER  (M=1)
            ┌─────────────────────────┐         ┌──────────────────────────────────┐
            │                         │         │                                  │
 X_en       │ ┌────────────────────┐  │         │ Init S = [decomp(X_en[I/2:]) ||  │
 [I,d]  ──→ │ │ Auto-Corr          │  │         │           zeros]                 │
            │ │      ↓ +           │  │         │ Init T = [decomp(X_en[I/2:]) ||  │
            │ │ SeriesDecomp       │  │         │           mean(X_en)]            │
            │ │      ↓ (drop _)    │  │         │                                  │
            │ │ FeedForward        │  │         │ ┌────────────────────────────┐   │
            │ │      ↓ +           │  │  K, V   │ │ Auto-Corr (self)     S, T₁ │   │
            │ │ SeriesDecomp       │ ─┼────────→│ │       ↓                    │   │
            │ │      ↓ (drop _)    │  │         │ │ Cross Auto-Corr       S, T₂│   │
            │ └────────────────────┘  │         │ │       ↓                    │   │
            │      ×N layers          │         │ │ FeedForward           S, T₃│   │
            │                         │         │ └────────────────────────────┘   │
            │  X_en^N (seasonal only) │         │ Trend accumulate:                │
            │                         │         │   T ← T + Σ W_i · T_i            │
            └─────────────────────────┘         │ Seasonal refine:                 │
                                                │   S = S_3                        │
                                                │      ×M layers                   │
                                                │                                  │
                                                │ Output = W_S · S_final + T_final │
                                                │                                  │
                                                └──────────────────────────────────┘
                                                              ↓
                                                          Y [O, d]
```

---

## ASCII 도식 2 — Auto-Correlation 의 내부 흐름

```
    Q [B,L,d]      K [B,L,d]      V [B,L,d]
        │              │              │
        ↓ FFT          ↓ FFT          │
    F(Q)             F(K)*            │
        └──── × ──────┘                │
              │                        │
              ↓ IFFT                   │
       R_{Q,K}(τ)  for τ=0..L-1        │  (정확히 모든 lag)
              │                        │
              ↓ Top-k                  │
       τ_1, τ_2, ..., τ_k              │   k = ⌊c · log L⌋
              │                        │
              ↓ Softmax                │
       R̂(τ_1), ..., R̂(τ_k)            │
              │                        ↓
              └──→  Σ_i R̂(τ_i) · Roll(V, τ_i)
                                  │
                                  ↓
                          out [B, L, d]
```

---

## ASCII 도식 3 — Encoder vs Decoder 의 SeriesDecomp 사용 차이

```
   Encoder SeriesDecomp:       Decoder SeriesDecomp:
   ─────────────────────       ─────────────────────
   Input X                     Input X
        ↓                            ↓
   AvgPool → trend "_"          AvgPool → trend  T_i (KEEP!)
        ↓                            ↓
   X - trend → seasonal S       X - trend → seasonal S
        ↓                            ↓
   pass S forward                pass S forward
                                AND accumulate T_i into running T
```

Encoder = trend 버림. Decoder = trend 누적. **두 경로 분리** 가 핵심.

---

## ASCII 도식 4 — Top-k τ 시각화

```
   Series X:  ▁▃▆▅▃▁▃▆▅▃▁▃▆▅▃▁
              ↑           ↑           ↑
              t=0         t=5         t=10  ←  명백한 주기 5
              
   Autocorrelation R(τ):
       τ:  0    1    2    3    4    5    6    7    8    9   10
       R: 1.0  0.7  0.3 -0.1 -0.3  0.8  0.7  0.3 -0.1 -0.3  0.7
                                    ▲                         ▲
                              Top-1 τ=5             Top-2 τ=10
                              (정확히 주기 검출)
   
   Roll(V, 5):  V[5:]  || V[:5]   ← 5 steps shift
   Roll(V, 10): V[10:] || V[:10]  ← 10 steps shift
   
   가중합:  0.55 · Roll(V,5)  +  0.45 · Roll(V,10)
```

---

## ASCII 도식 5 — Sparse Attention 대 Auto-Correlation

```
   ProbSparse (Informer):                Auto-Correlation:
   ─────────────────────                 ─────────────────
   * * * * * * * * *                     * * * * * * * * *
   ↑         ↑                           │
   1         5                           │ (모든 점 참여)
   ↑                                     │
   8         (선택된 3 점만)              ↓
                                         Roll(V, 5), Roll(V, 10), ...
                                         가중합 → 모든 점 재배치
                                         
   ※ 선택된 점만 → 정보 손실     ※ 모든 점이 결과에 기여
```

---

## ASCII 도식 6 — Decomposition 의 점진적 효과 (Figure 4 idea)

```
   Layer 0 (no decomp):
   ─────────────────────
   Time series:    ╱╲╱╲╱╲╱╲╱╲ ↗  ← trend + seasonal 섞임
   Prediction:     ───────────  ↗  ← 평균만 따라감
   
   Layer 2 (2 decomp blocks):
   ─────────────────────────
   Trend:          ────────────↗     ← 매끄러운 trend 추출
   Seasonal:       ╱╲╱╲╱╲╱╲╱╲       ← 주기 패턴
   Prediction:     ╱╲╱╲╱╲╱╲╱╲ ↗    ← 둘 합 — 정확
```

---

## 인터랙티브 시각화 카탈로그 (8종)

| viz id | 챕터 | 무엇 | 입력 데이터 | 상호작용 |
|--------|------|------|-----------|---------|
| `autoformer-mse-table1` | 09 | Table 1 의 6 datasets × 4 horizons × 7 models MSE/MAE bar | paper Table 1 정확 인용 | dataset/metric toggle |
| `autoformer-decomp-ablation` | 10 | Table 3 ablation — Origin vs Sep vs Ours | paper Table 3 정확 인용 | backbone toggle |
| `autoformer-attention-ablation` | 10 | Table 4 ablation — Auto-Corr vs 4 self-attentions | paper Table 4 정확 인용 | input length / predict length toggle |
| `autoformer-efficiency` | 07 | Figure 7 재현 — memory & time vs predict length | paper Figure 7 trend 재구성 | model toggle |
| `autoformer-fft-acorr` | 06 | FFT 기반 R(τ) 계산 step-by-step demo | synthetic sinusoid | period 슬라이더 |
| `autoformer-seasonal-trend` | 05 | AvgPool moving-average 의 점진 분해 | synthetic with trend+seasonal | decomp layers 슬라이더 (0-3) |
| `autoformer-topk-delays` | 06 | Top-k τ 선택 → Roll → 가중합 viz | synthetic 주기 series | k 슬라이더, τ 표시 toggle |
| `autoformer-lag-histogram` | 11 | Figure 6 재현 — 4 dataset 의 lag 분포 | paper Figure 6 정확 인용 | dataset selection |

→ 각 viz 의 구현은 site repo `viz/autoformer-*.js` 에 위치.

---

## ASCII Decision Tree — 언제 Autoformer 를 쓸까?

```
                 시계열 forecasting 필요?
                          │
                          ↓
                Horizon 이 input 보다 긴가?
                  │                    │
                 NO                   YES
                  │                    │
                  ↓                    ↓
              주기적인가?          Autoformer 추천
            │            │
           YES          NO
            │            │
            ↓            ↓
        sparse Transf.   ARIMA / simple model
        (Informer 등)    (단기 + 비주기)
```

---

## ASCII 도식 7 — 점진적 trend 누적의 수식 시각화

paper Eq 4 의 마지막 줄:
$$
\mathcal{T}_{de}^l = \mathcal{T}_{de}^{l-1} + W_{l,1} * \mathcal{T}_{de}^{l,1} + W_{l,2} * \mathcal{T}_{de}^{l,2} + W_{l,3} * \mathcal{T}_{de}^{l,3}
$$

ASCII 로 layer-by-layer accumulation:

```
   l=0:  T^0    (initial trend from decoder input X_det)
            │
            ↓ +
   l=1:  T^1  =  T^0 + W₁·trend_from(self-attn) + W₂·trend_from(cross-attn) + W₃·trend_from(FFN)
            │      ↑─── accumulator                    ↑─── 3 new contributions per layer
            ↓ + 
   l=M:  T^M  =  T^{M-1} + W₁·T^{M,1} + W₂·T^{M,2} + W₃·T^{M,3}
            
            
   Final:  Y = W_S · X_de^M (seasonal)  +  T^M (trend)
```

→ **trend 가 layer 를 지나며 단조 누적** — seasonal 처럼 refine 이 아니라 building up.

---

## ASCII 도식 8 — Eq 6 의 Auto-Correlation 흐름

```
   Step 1: 자기상관 계산 (FFT)
   ────────────────────────────
   Q ∈ R^L  ─┐
            ├──→ R_{Q,K}(τ)  for τ = 0, 1, ..., L-1
   K ∈ R^L  ─┘     (Eq 8)
   
   
   Step 2: Top-k 선택
   ────────────────────
   R_{Q,K}(τ) ──→ argTopk ──→ τ_1, τ_2, ..., τ_k     (k = ⌊c·log L⌋)
                              ↓ Softmax
                              ↓
                            R̂(τ_1), ..., R̂(τ_k)
   
   
   Step 3: 가중 합 (Aggregation)
   ────────────────────────────
                V ∈ R^L
                 │
                 ├──→ Roll(V, τ_1)  ─×─ R̂(τ_1)  ─┐
                 ├──→ Roll(V, τ_2)  ─×─ R̂(τ_2)  ─┤
                 │     ...                       │ Σ
                 └──→ Roll(V, τ_k)  ─×─ R̂(τ_k)  ─┘
                                                 │
                                                 ↓
                                          Auto-Correlation(Q,K,V) ∈ R^L
```

---

## ASCII 도식 9 — Wiener-Khinchin 의 FFT 우회

```
   직접 정의 (Eq 5):
   ────────────────
   R(τ) = (1/L) Σ_{t=0}^{L-1-τ} X_t · X_{t-τ}
   복잡도: τ 마다 L 곱 → 모든 τ 의 R: O(L²)
   
   
   FFT 우회 (Eq 8):
   ────────────────
                  ┌── FFT (O(L log L)) ──→ F(X)
   X ∈ R^L  ──────┤
                  └── FFT (O(L log L)) ──→ F(X)
                                              │
                                              ↓
                                       F(X) × F(X)*   (point-wise, O(L))
                                              │
                                              ↓
                                          S(f) ∈ C^L  (power spectrum)
                                              │
                                              ↓ IFFT (O(L log L))
                                              │
                                          R(τ) ∈ R^L  (모든 τ 동시에)
                                              
   총 복잡도: O(L log L) — L^2 의 절감.
```

---

## ASCII 도식 10 — Self-attention vs Auto-Correlation 의 dot-product 형식 비교

```
   Self-Attention 의 [i, j] 셀:
   ────────────────────────────
                  d_model
                    ↓
        Q_i  ────·────  K_j          ← 두 점 사이의 내적
                    
   score[i, j] = Q_i · K_j   (scalar)
   매트릭스: L × L 의 score → softmax → V 의 weighted sum
   
   
   Auto-Correlation 의 τ 값:
   ─────────────────────────
                  L
                  ↓                   (sliding window correlation)
        Q   ────·····────  K_{shifted by τ}
                    
   R_{Q,K}(τ) = (1/L) Σ_t Q_t · K_{t-τ}   (scalar)
   벡터: L 개의 τ 의 R → Top-k → V 의 Roll 가중합
```

→ **점-단위 internal 곱** vs **시리즈-단위 shifted 곱**. 두 paradigm.

---

---

## 그 외 useful figures from paper (본 deep dive 포함된 발췌)

| 그림 | paper 위치 | 본 deep dive 의 위치 |
|------|----------|---------------------|
| Fig 1 architecture | p.4 | ch05 |
| Fig 2 Auto-Corr + Time Delay Agg | p.5 | ch06 |
| Fig 3 Attention family 비교 | p.6 | ch06 |
| Fig 4 Decomp steps | p.9 | ch11 |
| Figs 5-7 Deps/Lags/Efficiency | p.10 | ch07, ch11 |
| Figs 8-11 ETT predictions | p.15 | ch11 |
| Figs 12-13 Exchange | p.16 | ch11 |
| Fig 14 COVID showcase | p.17 | ch14 |

전체 figures 폴더: `figures/page{4,5,6,9,10,15,16,17}_*.png`.
