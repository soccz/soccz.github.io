# 17. 핵심 도식 모음 — 그림으로 보는 ProTran

ASCII/박스 도식으로 핵심 개념을 시각화. 텍스트 100줄보다 한 그림이 직관적.

이 챕터는 **15+ 도식** 을 한 곳에 모음 — 본문에서 한 번씩만 본 그림들의 카탈로그.

---

## 17.1 ProTran 전체 흐름 — 한 페이지에

```
┌────────────────────────────────────────────────────────────────┐
│                  [출발: 다변량 시계열 패널 x_{1:T}]               │
│   x_t ∈ ℝ^N: 시점 t 의 N 변수 관측 (예: 도로 트래픽, 관절 위치)  │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│             [SSM Framework] x = emission(z), z = transition(x) │
│   잠재 z_t (보이지 않음) + 관측 x_t (보임) 의 분리                │
└────────────────────────┬───────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
   [기존 SSM 의 한계]         [ProTran 의 답]
   ─────────────────         ───────────────
   ① LDS: Linear+Markov      Attention 으로 non-Markov
   ② Deep SSM: RNN+Markov    잠재 z 사이 직접 attention
   ③ 표준 Transformer:        SSM 의 잠재 변수 + Transformer
      관측 attention, no z    잠재 attention + variational
            │                         │
            └────────────┬────────────┘
                         ▼
              ┌────────────────────┐
              │   ProTran          │
              │   = SSM ∩ Trfmr    │
              │   ∩ VAE ∩ Hierar.  │
              └─────────┬──────────┘
                        ▼
              ┌────────────────────┐
              │   결과: 분포 예측   │
              │   100 sample →     │
              │   CRPS_sum SOTA    │
              │   (5/5 시계열)     │
              │   ADE/FDE SOTA     │
              │   (3/4 모션)       │
              └────────────────────┘
```

---

## 17.2 Single-Layer ProTran 전체 흐름

```
   Context x_{1:C}              Full sequence x_{1:T} (train only)
        │                                │
        ↓ Eq 5: MLP + Position + LN      ↓ Eq 5
        │                                │
   h_{1:C}                          h_{1:T}
        │                                │
        │                                ↓ Eq 10: bidir self-attn
        │                                │      (smoothing)
        │                            k_{1:T}
        │                                │
   For t = 1 to T:                       │
        │                                │
        ↓ w_{t-1} (from previous step)   │
        │                                │
        ↓ Eq 6: Self-Attn(w_{t-1}, w_{1:t-1}, w_{1:t-1})
        │     [과거 잠재 종합]            │
        │                                │
   ̄w_t ← "non-Markov hidden"            │
        │                                │
        ↓ Eq 7: Cross-Attn(̄w_t, h_{1:C})│
        │     [context 참고]              │
        │                                │
   ŵ_t ← "context-aware hidden"          │
        │                                │
        ↓ Training:                      │
        │   Eq 11: z_t ~ N(MLP([ŵ_t, k_t]), σ)
        ↓ Test:                          │
        │   Eq 8:  z_t ~ N(MLP(ŵ_t), σ)
        │                                
        ↓ Eq 9: w_t = LN(ŵ_t + MLP(z_t) + Position(t))
        │
        ↓ x_t = MLP(w_t)  ← final emission
        │
        ↓ Append, continue to t+1
```

---

## 17.3 Multi-Layer (L=3) Architecture

```
                            x_t (emission)
                              ↑
                          MLP(w_t^{(L)})
                              ↑
        Layer 3 (top): ───── w_t^{(3)}  ← 가장 추상 (긴 timescale)
                              │
                              ↑ Eq 16: cross-layer attn
                              │ (Q=w_{t-1}^{(3)}, K,V=w_{1:T}^{(2)})
                              │  └─ 아래 layer 의 전체 sequence
                              │
        Layer 2:      ─────── w_t^{(2)}  ← 중간 추상
                              │
                              ↑ Eq 16: cross-layer attn  
                              │ (Q=w_{t-1}^{(2)}, K,V=w_{1:T}^{(1)})
                              │
        Layer 1 (bot): ────── w_t^{(1)}  ← 가장 구체 (짧은 timescale)
                              │
                              ↑ Eq 17-18-19-20 within layer
                              │ (Eq 16 skipped at l=1, 아래 layer 없음)
                              │
                          From context + previous w_{1:t-1}^{(1)}
   
   각 layer ℓ 에서 매 시점 t 의 단계:
      Eq 16: cross-layer attn (Q=w^{(ℓ)}, K,V=w^{(ℓ-1)}) — ℓ>1 일 때만
      Eq 17: self-attn within layer (Q=w^{(ℓ)}_{t-1}, K,V=w^{(ℓ)}_{1:t-1})
      Eq 18: cross-attn to context (Q=w^{(ℓ)}, K,V=h_{1:C})
      Eq 19: sample z^{(ℓ)}_t from Gaussian
      Eq 20: update w^{(ℓ)}_t = LN(... + MLP(z) + position)
```

---

## 17.4 Generative vs Inference — 학습 시 비대칭

```
                     TRAINING TIME (full x_{1:T} available)
   ───────────────────────────────────────────────────────────
   Generative 흐름 (test 시에도 사용):    Inference 흐름 (학습 시만):
   
   p_θ(z_t | z_{1:t-1}, x_{1:C})         q_φ(z_t | z_{1:t-1}, x_{1:T})
        ↑                                       ↑
        ŵ_t (Eq 7 출력)                         [ŵ_t, k_t] (Eq 11 입력)
        ↑                                       ↑
        Eq 6, 7 over h_{1:C}                    + k_t = Attn(h_{1:T}, ..)
                                               (Eq 10, 학습 시만)
        
        ⤵                                       ⤵
        
                  ELBO Loss (Eq 3):
                  L = E_q[log p_θ(x_t|z_t)] - KL(q_φ || p_θ)
                       ↑                          ↑
                  reconstruction               regularization
                  (좋은 emission)              (prior → posterior)
                
                       TEST TIME (only x_{1:C})
   ───────────────────────────────────────────────────────────
   Generative 만 사용 (k_t 없음):
   
        z_t ~ p_θ(z_t | z_{1:t-1}, x_{1:C})    (Eq 8 만)
        x_t = MLP(w_t)                          ← sample emission
   
   → 100 sample → empirical distribution → CRPS_sum 평가
```

---

## 17.5 Attention vs RNN — 의존성 패턴 비교

```
   ┌─────────────────────────────────────────────────────────────┐
   │ Standard RNN approach (LSTM, GRU)                           │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │      x_{t-2}    x_{t-1}    x_t      x_{t+1}    x_{t+2}      │
   │         │         │         │         │         │           │
   │         ↓         ↓         ↓         ↓         ↓           │
   │     h_{t-2} → h_{t-1} → h_t → h_{t+1} → h_{t+2}             │
   │                                                             │
   │     ┌──────────────────────────────────┐                    │
   │     │ 정보는 hidden state 를 통해서만   │                    │
   │     │ 흐른다. Gradient vanishing 발생.  │                    │
   │     │ 멀리 떨어진 시점 사이 약함.        │                    │
   │     └──────────────────────────────────┘                    │
   └─────────────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────────────┐
   │ ProTran approach (Attention 잠재 공간)                       │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │     z_1 ────── z_2 ────── z_3 ────── ... ────── z_T         │
   │      ╲   ╱╲   ╱   ╲    ╱   ╲             ╱                 │
   │       ╲ ╱  ╲ ╱     ╲  ╱     ╲           ╱                  │
   │        ╳    ╳       ╳        ╳         ╱                   │
   │       ╱ ╲  ╱ ╲     ╱  ╲     ╱  ╲     ╱                    │
   │      ╱   ╲╱   ╲   ╱    ╲   ╱    ╲   ╱                     │
   │     ↓     ↓    ↓  ↓     ↓ ↓      ↓ ↓                      │
   │                                                             │
   │     ┌─────────────────────────────────────┐                 │
   │     │ 모든 시점 쌍이 직접 attention!       │                 │
   │     │ 거리 무관, gradient vanishing 없음.  │                 │
   │     │ 정보 손실 없이 long-range 학습.      │                 │
   │     └─────────────────────────────────────┘                 │
   └─────────────────────────────────────────────────────────────┘
```

---

## 17.6 Latent attention vs Observation attention — 핵심 차이

```
   ┌─────────────────────────────────────────────────────────────┐
   │ Standard Transformer (NLP, Informer, Autoformer)            │
   │ Attention 을 관측 x 에 적용                                   │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │   x_1 (noisy raw)  ←attention→  x_2 (noisy raw)  ←→  ...    │
   │                                                             │
   │   문제: noise 가 attention 으로 전파                          │
   │         "관련 없는 noisy 패턴들도 비교"                       │
   └─────────────────────────────────────────────────────────────┘
   
                              vs
   
   ┌─────────────────────────────────────────────────────────────┐
   │ ProTran                                                      │
   │ Attention 을 잠재 z (의 hidden w) 에 적용                     │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │   x_1 (raw)     x_2 (raw)     x_3 (raw)     ...             │
   │     │             │             │                           │
   │     ↓ encoding    ↓             ↓                           │
   │     │             │             │                           │
   │   w_1 (refined)←attention→w_2 (refined)←attention→...       │
   │   (clean abstract state)                                    │
   │                                                             │
   │   장점: 정제된 의미들끼리 비교                                 │
   │         "본질적 관계만 추출"                                   │
   └─────────────────────────────────────────────────────────────┘
   
   비유:
   - 관측 attention = 원본 사진 100장 비교 (pixel-level noise 도 비교)
   - 잠재 attention = 각 사진의 한 줄 caption 100개 비교 (의미만)
```

---

## 17.7 Smoothing vs Filtering — 시계열 잠재 추정의 두 방식

```
   ┌─────────────────────────────────────────────────────────────┐
   │ FILTERING (RNN 의 자연 방식)                                  │
   │ 과거 + 현재 관측만 사용                                        │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │   시점:  1     2     3     4     5     6     7     ...      │
   │   관측: x_1   x_2   x_3   x_4  [x_5]                        │
   │                                  ↑                          │
   │                                  │                          │
   │   잠재 추정 z_5 의 정보 = x_1, x_2, x_3, x_4, x_5            │
   │                          ┌─────────────────┐                │
   │                          │ 과거 + 현재만   │                │
   │                          └─────────────────┘                │
   │                                                             │
   │   p(z_t | x_{1:t})                                          │
   └─────────────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────────────┐
   │ SMOOTHING (Kalman smoother, ProTran 의 Eq 10)                │
   │ 과거 + 현재 + 미래 관측 모두 사용                              │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │   시점:  1     2     3     4     5     6     7     ...      │
   │   관측: x_1   x_2   x_3   x_4  [x_5]  x_6   x_7             │
   │                                  ↑    │    │                │
   │                                  └─ ← 미래 정보도 사용!     │
   │                                                             │
   │   잠재 추정 z_5 의 정보 = x_1, ..., x_5, x_6, x_7 (전체)     │
   │                          ┌─────────────────┐                │
   │                          │ 과거+현재+미래    │                │
   │                          └─────────────────┘                │
   │                                                             │
   │   p(z_t | x_{1:T})  ← T 까지 다 본 후 z_t 추정              │
   └─────────────────────────────────────────────────────────────┘
   
   왜 smoothing 이 더 정확:
   - 7일에 폭우 → 5일의 기압 상태가 사실 폭우의 전조였을 가능성 ↑
   - 미래 관측이 과거 추정을 개선
   - 학습 시 정답 미래 알고 있으니 사용 가능
   - Test 시: 미래 모름 → filtering 처럼 작동 (Eq 8)
```

---

## 17.8 Eq 6-9 의 매 step — 4 step 상세

```
   매 시점 t 의 4 step:
   
   Step 1: Self-Attention over Past Latents (Eq 6)
   ──────────────────────────────────────────────
   
        w_{t-1}  ────Q────►  ┌──────────────────┐
                              │                  │
        w_1, ..., w_{t-1} ──K,V─► Attention(Q,K,V)│
                              │                  │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ̄w_t (과거 종합한 hidden)
   
   Step 2: Cross-Attention to Context (Eq 7)
   ──────────────────────────────────────────
   
        ̄w_t  ────Q────►  ┌──────────────────┐
                          │                  │
        h_{1:C} ──K,V─► Attention(Q,K,V)    │
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ŵ_t (context까지 종합)
   
   Step 3: Sample z_t from Gaussian (Eq 8)
   ────────────────────────────────────────
   
        ŵ_t ──► MLP_μ ──► μ_t
        ŵ_t ──► MLP_σ + Softplus ──► σ_t (>0)
        
                              ┌──────────────┐
                              │ N(μ_t, σ_t²) │
                              └──────┬───────┘
                                     │
                                     ▼
                                   z_t (stochastic latent)
   
   Step 4: Update Hidden w_t (Eq 9)
   ────────────────────────────────
   
        ŵ_t          ────┐
        MLP(z_t)     ────┼──► LayerNorm ──► w_t
        Position(t)  ────┘
        
        w_t 가 다음 시점 (t+1) 의 Step 1 입력으로 사용됨
```

---

## 17.9 Multi-layer 의 bottom-up generation

```
   각 시점 t 에서 (모든 시점에 대해 동시 진행):
   
   ┌──────────────────────────────────────────────────┐
   │ Layer 3 (L=3, top, 가장 추상)                     │
   │   z^{(3)}_t (가장 큰 timescale, 평일/주말, 계절) │
   │           ↑                                       │
   │           │ Eq 16: attention(w^{(2)}_{1:T}) 모두 │
   │           ▲                                       │
   ├──────────────────────────────────────────────────┤
   │ Layer 2 (중간 abstraction)                        │
   │   z^{(2)}_t (출퇴근 시간대, 시간 카테고리)       │
   │           ↑                                       │
   │           │ Eq 16: attention(w^{(1)}_{1:T}) 모두 │
   │           ▲                                       │
   ├──────────────────────────────────────────────────┤
   │ Layer 1 (bottom, 가장 구체)                       │
   │   z^{(1)}_t (한 시점의 미세 변동)                │
   │           ↑                                       │
   │           │ Context + previous w^{(1)}_{1:t-1}    │
   └──────────────────────────────────────────────────┘
   
   최종:
   x_t = MLP(w^{(L)}_t)  ← top layer 만 관측 생성
   
   비유 (회사 조직):
   - Layer 1 = 사원 (오늘 어느 도로 트래픽이 평균보다)
   - Layer 2 = 팀장 (출퇴근 러시아워인가)
   - Layer 3 = 부장 (평일/주말, 계절)
   - 회사 행동 (x_t) = 임원(top) 의 결정에서 나옴
```

---

## 17.10 ELBO 의 두 항 — 학습 동학

```
   ELBO Loss (Eq 3):
   
   L = - E_q[log p_θ(x_t | z_t)]  +  β · KL(q_φ || p_θ)
       └──────────┬─────────────┘     └────────┬────────┘
            ❶ Reconstruction              ❷ Regularization
            
   ❶ 의 효과: 학습이 진행되면서
   ───────────────────────────
   
        시작:        Loss 큼
                    │
                    │       ────❶──────────►
                    │       emission MLP 가
                    ▼       정확해짐
        epochs ──►  ─────────────────────►
                    │
                    │  Loss 작아짐
                    ▼
        끝:         Reconstruction 정확
   
   ❷ 의 효과: 동시에
   ──────────────────
   
        시작:        q 와 p 가 다름
                    │
                    │  ────❷──────────►
                    │  prior p 가
                    ▼  posterior q 를 따라감
        epochs ──►  ─────────────────────►
                    │
                    │  KL 작아짐
                    ▼
        끝:         q ≈ p (test 시 prior 만으로 OK)
   
   β 의 역할 (β-VAE):
   ──────────────────
   
   β 작음 (~0.01):  ❶ 우선, q 자유 → reconstruction 좋음
                    하지만 q ≠ p → test 시 generation 약함
   
   β 큼 (~10):     ❷ 우선, q ≈ p 강제
                    하지만 reconstruction 희생
   
   최적 β: cross-validation 으로 찾음 (paper 권장)
```

---

## 17.11 CRPS 의 직관 — Lower is Better

```
   예측한 누적 분포 F(z):     실제 관측 x 의 step:
   
       1 ──────────.───────       1 ──────────.───────
         │       ╱╱                 │           │
         │     ╱╱                   │           │
         │   ╱                      │           │
         │ ╱                        │           │
       0 ──────────────► z        0 ───────────┴────► z
                  ↑                              ↑
                  observed x                     observed x
   
   CRPS = 두 곡선 사이의 squared area 적분
   
   ┌───────────────────────────────────────────┐
   │  CRPS(F, x) = ∫ (F(z) - 𝟙_{x ≤ z})² dz   │
   └───────────────────────────────────────────┘
   
   ✓ 작은 CRPS: 예측 분포가 x 주변에 잘 모임
   ✗ 큰 CRPS: 예측 분포가 어긋나거나 너무 넓음
   
   CRPS_sum = 여러 시점 + 여러 시계열 합산
   → 한 숫자로 multivariate 시계열의 분포 예측 quality 평가
   
   paper Table 1 의 값들:
   - ProTran Solar 0.194 — best
   - TimeGrad Solar 0.287 — 2위
   - VES Solar 0.900 — 고전 baseline (4-5배 차이)
```

---

## 17.12 Probabilistic Forecast 의 calibration

```
   Time series example (Traffic, Fig 2):
   
   real value
   ▲
   │                                        ░░░░░░
   │                                   ░░░░░░░░░░░░░░░    ← 예측 분포
   │                              ░░░░░░░░│░░░░░░░░░░░░░░     (넓음 = 불확실)
   │                         ░░░░░░░░░░░│░░░░░░░░░░░░░░░░░░
   │            ███          ░░░░░░░░░░│░░░░░░░░░░░░░░░░░░░░
   │         ████████░░░░░░░░░░░░░░░░░░│░░░░░░░░░░░░░░░░░░░░░
   │      ███      ████ █████  █████ ●●●●●●●●●●●●●●●  ← 실제 ground truth
   │    ██               █  ██████   │                  
   │  ██                              │                  
   └───┼─────────────────────────────┼─────────────────► time
       context (관측)                  target (예측)
                                       │
                                       │  ✓ Good calibration:
                                       │    먼 미래일수록 분포 넓음
                                       │    큰 값일수록 분포 넓음
                                       │    
                                       │  ProTran 의 paper Fig 2 가
                                       │  이걸 시각적으로 보여줌
                                       ▼
```

---

## 17.13 paper Fig 1 graphical models — 4 panel 비교

```
   (a) LDS                          (b) ProTran 1-layer
   ─────                            ─────────────────
   
   x_{t-1}  x_t  x_{t+1}            x_{t-1}  x_t  x_{t+1}
      ↑     ↑     ↑                    ↑     ↑     ↑
   z_{t-1}→z_t→z_{t+1}              z_{t-1}↘ z_t ↗z_{t+1}
   (linear chain,                   (z_{t+1} attends to all
    Markovian)                       previous z_1, ..., z_t)
   
   (c) ProTran 3-layer Generation   (d) ProTran 3-layer Inference
   ──────────────────────────────   ────────────────────────────
   
   Black arrows = generation        Same structure with
   Top → Bottom → x                 Red arrows = inference
                                    (observation → latent)
   
                                    학습 시 둘 다 동시 작동
                                    Test 시 (c) 만 사용
```

paper caption: "Black arrows denote the generative mechanism and red arrows the inference procedure."

---

## 17.14 ASCII Decision Tree — 언제 ProTran 을 쓸까

```
              다변량 시계열의 확률적 예측이 필요?
                          │
                          ↓
              Multivariate (N > 1) 인가?
                ┌─────────┴─────────┐
               NO                  YES
                │                   │
                ↓                   ↓
            DeepAR             장거리 의존성 있나?
            (univariate          ┌─────────┴─────────┐
             probabilistic)     NO                  YES
                                 │                   │
                                 ↓                   ↓
                             Linear SSM         ProTran
                             (LDS, KF)          (best fit)
                                                 │
                                                 ↓
                                       Sequence length T 작나?
                                         ┌──────┴──────┐
                                        YES (T<1000)  NO (T>10000)
                                         │             │
                                         ↓             ↓
                                     ProTran        Sparse Transformer 변형
                                     (1-3 layer)    + ProTran (future work)
                                                    또는 Informer
```

---

## 17.15 ProTran의 5 가지 차별점 — 한 그림에

```
   ┌──────────────────────────────────────────────────────────────┐
   │ ProTran 의 5 차별점 vs 표준 Transformer / RNN SSM             │
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │ 1. Attention 의 대상:                                         │
   │    표준 Transformer: 관측 x                                   │
   │    ProTran:        잠재 z (정확히는 w)                       │
   │    → noise 전파 회피                                          │
   │                                                              │
   │ 2. RNN 사용:                                                  │
   │    Deep SSM: RNN 으로 transition                              │
   │    ProTran: RNN 완전 거부, attention 만                        │
   │    → gradient vanishing 회피                                  │
   │                                                              │
   │ 3. Generation 방식:                                           │
   │    표준 Transformer: autoregressive (한 token 씩)             │
   │    ProTran: 잠재 공간 결정 + non-autoregressive emission       │
   │    → error accumulation 회피                                  │
   │                                                              │
   │ 4. Latent variable:                                          │
   │    표준 Transformer: 없음                                     │
   │    ProTran: variational latent                                │
   │    → probabilistic, uncertainty 표현                          │
   │                                                              │
   │ 5. Inference 방식:                                            │
   │    RNN SSM: filtering (과거만)                                │
   │    ProTran: smoothing (과거+미래) — attention 으로 자연         │
   │    → 더 정확한 posterior, 더 좋은 prior 학습                   │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘
```

---

## 17.16 자기점검 (이 챕터)

### 핵심 4가지
1. **17.5 의 RNN vs ProTran 도식에서, 두 모델의 정보 흐름 차이를 한 줄로?**
2. **17.7 의 filtering 과 smoothing 도식에서, ProTran 이 학습 시 어느 방식을 쓰나?**
3. **17.8 의 4 step 중, 어느 step 에서 stochasticity 가 도입되나?**
4. **17.10 의 ELBO 두 항이 각각 무엇을 최적화하나?**

### 답변
1. RNN = 정보가 한 줄로 hidden state 를 거쳐서만 흐름 (gradient vanishing). ProTran = 모든 시점 쌍이 attention 으로 직접 연결 (거리 무관).
2. **Smoothing** — Eq 10 의 bidirectional self-attention 으로 전체 sequence (과거+현재+미래) 활용. Test 시에는 미래 없어서 filtering 처럼 작동 (Eq 8, k_t 없이).
3. **Step 3 (Eq 8 또는 Eq 11)** — Gaussian 에서 sample 하는 단계. Reparameterization $z = \mu + \sigma \epsilon$ 으로 random 부분 분리.
4. ❶ Reconstruction = $E_q[\log p(x|z)]$ — emission MLP 가 $z$ 에서 $x$ 잘 복원하도록. ❷ Regularization = $KL(q||p)$ — prior $p$ 가 posterior $q$ 를 따라가도록 (test 시 prior 만으로 작동하기 위해).

---

## 17.17 인터랙티브 시각화 카탈로그 (4종 — 현재 구현)

| viz id | 챕터 | 무엇 | 입력 | 상호작용 |
|--------|------|------|------|---------|
| `pt-crps-table1` | 11 | Table 1 의 5 datasets × 12 models CRPS | paper exact values | dataset toggle |
| `pt-ablation-table2` | 11 | Table 2 의 4 settings ablation on Traffic | paper exact values | static bar chart |
| `pt-motion-table3` | 12 | Table 3 의 11 models × 2 datasets × 2 metrics | paper exact values | dataset + metric toggle |
| `pt-graphical-models` | 03, 04, 06, 08 | Fig 1 의 4-panel (LDS / 1-layer / 3-layer Gen / 3-layer Inf) | schematic | 4-mode toggle |

→ 각 viz 의 구현은 site repo `viz/pt-*.js`.

### 미구현 (future work)
- `pt-attention-flow`: Eq 5-9 의 generative process step-by-step viz.
- `pt-hierarchical-stack`: Multi-layer (L=1, 2, 3) hierarchy viz.

→ 위 두 가지는 paper Fig 1 의 (b)(c)(d) 가 이미 시각화. 인터랙티브 구현은 추후.

---

## 17.18 paper 의 원본 Figure 발췌 (재게시)

| 그림 | paper 위치 | 본 deep dive 위치 |
|------|----------|------------------|
| Fig 1 graphical models | p.2 | ch03, ch04, ch06, ch08 |
| Table 1 CRPS | p.7 | ch11 |
| Fig 2 Traffic predictions | p.8 | ch11 |
| Fig 3 human poses | p.9 | ch12 |
| Table 3 motion | p.9 | ch12 |

전체 figures 폴더: `figures/{Fig1,Fig2,Fig3,Table1,Table3}_*.png`.

---

## 17.19 Equations Summary

| Eq | 의미 | Chapter |
|----|------|---------|
| Eq 1 | SSM general form | ch04 |
| Eq 2 | Transition + Emission decomposition | ch04 |
| Eq 3 | ELBO (single-layer) | ch04, ch07 |
| Eq 4 | Multi-head attention | ch05 |
| Eq 5 | Context embedding | ch06 |
| Eq 6-7 | Self-attn + Cross-attn for latent | ch06 |
| Eq 8 | Generative sample z (test) | ch06 |
| Eq 9 | Update w | ch06 |
| Eq 10 | Bidirectional attention (smoothing) | ch07 |
| Eq 11 | Inference sample z (training) | ch07 |
| Eq 12-13 | Multi-layer decomposition | ch08 |
| Eq 14-15 | Multi-layer ELBO | ch08 |
| Eq 16-20 | Per-layer generation steps | ch08 |

총 **20 equations 모두 본 deep dive 에서 cover**.

---

## 17.20 마무리

ProTran 의 핵심 도식 15+ 개를 한 곳에. 텍스트로 풀어쓴 본문 (ch01-13) 과 함께 보면 시각 + 텍스트의 dual mode 학습 가능.

이 챕터는 reference 성격 — 본문 읽다가 "그 도식 어디 있더라" 할 때 돌아와 보는 카탈로그.

본 deep dive 17 챕터 완성. 논문이 "**무엇을 말하는가**" (ch01-13) + "**무엇을 가르치는가**" (ch15 메타 통찰) + "**어떻게 코드로 구현하는가**" (ch16) + "**그림으로는 어떻게 보이는가**" (ch17) 의 4 가지 layer 가 모두 갖춰짐.
