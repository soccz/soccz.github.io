# 03. 왜 PatchTST? DLinear 도전 + 본 논문 응답

> 본 논문이 *왜 나왔는지* 의 학계 역사. 2017년 Transformer 등장부터 2023년 PatchTST 까지.

---

## 3.1 챕터 한 줄 요약

> **"2017-2021 학자들이 *Transformer 를 시계열에 적용* 시도 → 2022년 DLinear 가 *간단한 선형 모델이 더 낫다* 도전 → 2023년 PatchTST 가 *Vanilla Transformer + 두 trick* 으로 응답 + SOTA 달성."**

---

## 3.2 2017년 — Transformer 등장

**Vaswani et al "Attention is All You Need"** (NeurIPS 2017).

NLP (자연어 처리) 의 *완전 혁명*. Attention 메커니즘으로 *RNN/LSTM 의 long-term 의존성 문제* 해결.

이후:
- **2018-2020**: BERT, GPT-2, GPT-3 — NLP 모델 의 *모든 SOTA*.
- **2020**: ViT (Vision Transformer) — *이미지* 도 정복. *16x16 image patching* 으로 NLP Transformer 그대로 적용.
- **2023+**: ChatGPT, GPT-4, Claude 등.

**핵심 메시지**: Transformer 는 *시계열 sequence 다루는 universal 도구* 가 됨.

---

## 3.3 2018-2022 — 학자들의 시계열 Transformer 시도

NLP / CV 성공에 자극받은 학자들이 *시계열에 Transformer 적용* 시도.

### 주요 변형 모델 들

#### Informer (Zhou et al, AAAI 2021)
- **Trick**: *ProbSparse self-attention* — *sparse attention 으로 long-term forecasting 가능*.
- **메시지**: "Transformer 가 시계열도 잘 할 수 있다".

#### Autoformer (Wu et al, NeurIPS 2021)
- **Trick**: *Series Decomposition* (trend + seasonal 분리) + *Auto-correlation* attention.
- **메시지**: "시계열의 *seasonality* 를 명시적으로 모델링".

#### FEDformer (Zhou et al, ICML 2022)
- **Trick**: *Fourier domain* 의 sparse representation + *frequency-enhanced* attention.
- **메시지**: "시계열의 *주파수 정보* 효과적 활용".

### 공통 패턴

이 *Informer / Autoformer / FEDformer* 모두 **시계열 specific attention 변형**. 즉:
- Vanilla Transformer 의 *self-attention* 을 *시계열 specific* 으로 *복잡하게* 수정.

**일상 비유**: 의사가 환자 모든 분야 *각각 specialized 의사* — 심장 specialist, 신경 specialist, 호흡기 specialist. *각 분야 특화*.

학계 가정: "*시계열 = 특수 분야, 일반 Transformer (general physician) 안 됨, specialized 모델 필요*".

---

## 3.4 2022 충격 — DLinear (Zeng et al, AAAI 2023)

도전적 paper:

> **"Transformer 는 시계열 forecasting 에 효과적이지 않다."**

### DLinear 모델

- 매우 *간단한 linear 모델*. *Decomposition + linear projection* 만.
- *No Transformer, no attention, no nonlinearity*.

### 충격적 결과

- DLinear 가 *Informer, Autoformer, FEDformer 능가* — 8 datasets × 4 horizons 의 *대부분 cell* 에서.
- *간단한 모델이 복잡한 Transformer 보다 낫다*.

**학계 분위기**: "Transformer 시계열 X. *시계열 = inherently linear*."

→ 이게 *위기*. 시계열 Transformer 의 *2-3년 노력 무력화*.

---

## 3.5 본 논문의 도전 — "vanilla Transformer + 두 trick"

**2023년 PatchTST (Nie et al)** 가 DLinear 도전에 응답.

### PatchTST 의 핵심 메시지

> **"DLinear 가 옳다 — *시계열 specific 변형* 은 over-engineered. 그러나 *Vanilla Transformer + 두 단순 trick* 만으로 SOTA — DLinear 능가."**

### 두 trick

#### Trick 1 — Patching

**일상 비유**: 시계열 (336 시간) 을 *16 시간 짜리 작은 조각 (patch)* 로 자름.

수학적: $N = \lfloor (L-P)/S \rfloor + 2 = \lfloor (336-16)/8 \rfloor + 2 = 42$ patch.

ViT 의 정신: *image 16x16 patch → 한 token*. PatchTST: *시계열 16 timestep → 한 token*.

#### Trick 2 — Channel-Independence

**일상 비유**: 326 가구 의 전력 데이터 가 있다면 *각 가구를 따로* Transformer 통과 + *모두 같은 weight* 공유.

**대비 (Channel-mixing)**: Informer/Autoformer 가 *모든 channel 을 한꺼번에 처리* — *cross-channel mixing*.

---

## 3.6 본 논문의 *핵심 발견 4가지*

본 논문이 *empirically* 보인 것:

### 발견 1 — Patching + Channel-indep = SOTA

8 datasets × 4 horizons 평균:
- **MSE reduction**: 21.0% (PatchTST/64) vs FEDformer.
- **MAE reduction**: 16.7% (PatchTST/64).

→ DLinear 도 능가.

### 발견 2 — Attention complexity 22× 감소

Token 수 N = 42 (P=16, S=8, L=336):
- Patching 없으면: attention $O(L^2) = O(112,896)$.
- Patching: attention $O(N^2) = O(1,764)$.
- Traffic dataset 의 실측: **22× 시간 단축** (10,040초 → 464초, Table 1).

### 발견 3 — Self-supervised pre-training 가능

*Masked patch reconstruction* 으로 사전 학습 → fine-tuning. 결과:
- *Supervised PatchTST 보다 더 좋음*.
- Transfer learning 가능 (한 dataset → 다른 dataset).

→ **시계열 foundation model 의 출발점**.

### 발견 4 — *Channel-independence* 가 *Channel-mixing* 보다 robust

Cross-channel mixing (Informer/Autoformer) 가 *spurious correlation 학습* 가능. Channel-indep 가 *robust*.

---

## 3.6-bis ★ Table 1 — Case Study (0.518 → 0.349 evolution, 정밀 해석)

paper Table 1 (p.4) 이 paper 의 **명함 같은 표**. Traffic dataset 의 한 cell 에서 baseline 부터 PatchTST 까지의 진화를 보여줌.

### Table 1 의 정확한 setup

- **Dataset**: Traffic.
- **Horizon**: $T = 96$.
- **Metric**: MSE.

### Table 1 의 정확한 수치

| Step | Setting | MSE | Cumulative reduction | 추가된 trick |
|------|---------|-----|---------------------|--------------|
| 1 | **Original Transformer (vanilla)** | **0.665** | 0% (baseline) | — |
| 2 | + Instance Normalization | 0.518 | 22.1% | Instance Norm 추가 |
| 3 | + Patching (P=16, S=8) | 0.430 | **35.3%** | Patching 추가 |
| 4 | + Channel-Independence | **0.349** | **47.5%** | CI 추가 = **PatchTST** |

### Step 별 정밀 분석

#### Step 1 → 2 (vanilla → Instance Norm): 22% 개선

- **Instance Normalization** = sample 별 정규화 (RevIN 도 비슷).
- **이유**: 시계열은 distribution shift (train 분포 ≠ test 분포) 가 잦음. Instance Norm 으로 sample 별 통계 정규화 → distribution shift 보정.
- **★ paper 의 자주 무시되는 trick** — 모든 baseline 도 이걸 쓰는 게 fair 한 비교.

#### Step 2 → 3 (Instance Norm → Patching): 17% 추가 개선

- **Patching** = 시계열을 16 시간 patch 로 자르고 한 token 으로.
- **이유**:
  - Attention 복잡도 $O(L^2)$ → $O((L/S)^2)$ → 22배 감소.
  - Local pattern 보존 (한 patch 안의 시간 정보 유지).
  - Token 수 감소 → overfit 방지.
- 17% 개선이 단순 trick 치고 큼.

#### Step 3 → 4 (Patching → +CI): 19% 추가 개선

- **Channel-Independence** = 변수마다 독립 처리, 같은 weight 공유.
- **이유**:
  - Channel-mixing 의 spurious correlation 회피.
  - Cross-channel attention 의 overfit 방지.
  - 변수 간 학습 자체를 안 함.
- **★ Table 1 에서 가장 큰 single trick 개선**.

### ★ Table 1 의 종합 메시지

```
   vanilla Transformer    0.665
        ↓ +Instance Norm
        0.518  (22% ↓)
        ↓ +Patching
        0.430  (17% ↓)
        ↓ +Channel-Indep
        0.349  (19% ↓)    ← PatchTST
        ────────────────
   Total: 47.5% MSE reduction
```

→ **3 trick 의 누적 = 47.5% reduction**. 각 trick 이 독립적으로 contribution.

### ★ Table 1 vs Table 7 (ch12 의 ablation)

| 측면 | Table 1 (case study) | Table 7 (ablation, ch12) |
|------|---------------------|------------------------|
| 비교 방식 | 누적 (Step 1 → 2 → 3 → 4) | 분리 (P only, CI only, P+CI) |
| 사용 dataset | Traffic 만 | 3 datasets |
| 가르치는 것 | "**모든 trick 함께 쓰면 최대**" | "**CI 가 major, P 가 minor**" |

→ Table 1 + Table 7 함께 보면: **CI 가 가장 큰 single contribution, 모든 trick 함께 쓰면 누적 효과**.

```viz:pat-table1-evolution:title=Table 1 — Evolution 시각화 (interactive),caption=0.665 → 0.518 → 0.430 → 0.349 의 4 step. 각 trick 의 cumulative MSE reduction.
```

---

## 3.6-ter ★ Figure 1 — Architecture (3 panel) 정밀 element-level 해석

![Figure 1 — PatchTST Architecture](figures/Fig1_architecture.png)

(paper p.4 Figure 1)

### paper caption (p.4)

> "Figure 1: PatchTST architecture. (a) Multivariate time series data is divided into different channels. They share the same Transformer backbone, but the forward processes are independent. (b) Each channel univariate series is passed through instance normalization and segmented into patches. These patches are used as Transformer input tokens. (c) Masked self-supervised representation learning with PatchTST where patches are randomly selected and set to zero. The model will reconstruct the masked patches."

### Figure 1 의 3 panel 구조

```
                Figure 1
                ────────
       (a) Model Overview (위)
       ─────────────────────
       Multivariate input → Channel-independence → Output

       (b) Transformer Backbone (Supervised, 좌하)
       ─────────────────────────────────────
       Instance Norm + Patching → ... → Linear Head → Prediction

       (c) Transformer Backbone (Self-supervised, 우하)
       ───────────────────────────────────────────
       Instance Norm + Patching → ... → Linear Layer → Reconstructed Masked Patches
```

### Panel (a) — Model Overview (★ Channel-Independence 시각화)

#### 시각 요소

| 요소 | 의미 |
|------|------|
| **좌측 입력** $\mathbf{x} \in \mathbb{R}^{M \times L}$ | M 변수 × L 시점의 시계열 (예: 321 가구 × 336 시간) |
| **M 개의 color-coded 가로 bar** | 각 변수 (channel) 의 시계열 |
| **3개의 화살표** (each channel → backbone) | 각 channel 이 **독립적으로** Transformer 통과 |
| **중앙 박스** "Transformer Backbone" | 같은 backbone (= 같은 weight) |
| **3개의 화살표 → 우측** | 각 channel 의 예측 출력 |
| **우측 출력** $\hat{\mathbf{x}} \in \mathbb{R}^{M \times T}$ | M 변수 × T 미래 시점 |

#### ★ Panel (a) 의 가장 중요한 메시지

> **"M 변수가 같은 backbone 을 공유하지만 forward 는 독립"**. 이게 **Channel-Independence** 의 본질.

대비 (Channel-mixing): 모든 변수가 한꺼번에 attention 계산. PatchTST 는 각 변수 별도 forward.

**일상 비유**: 321 학생이 같은 시험 (같은 문제 = 같은 backbone) 을 보지만 **각자 따로 답안 작성** (= independent forward). 학생끼리 답을 공유 안 함 (= no cross-channel mixing).

### Panel (b) — Transformer Backbone (Supervised)

#### Pipeline (위 → 아래)

```
Input single channel x^(i) ∈ R^L
       ↓
Instance Norm + Patching
       ↓
N=42 patches × P=16 each
       ↓
Projection + Position Embedding
       ↓
N × D_model tensor
       ↓
Transformer Encoder × M_layers
       ↓
N × D_model tensor
       ↓
Flatten + Linear Head
       ↓
Output prediction T 시점 x̂^(i) ∈ R^T
```

#### 각 박스의 element-level 의미

| Figure 박스 | 한국어 의미 | chapter |
|------------|-----------|---------|
| **Input** (맨 위) | Single channel 시계열 (예: 한 가구의 336 시간 전력) | ch04 |
| **Instance Norm** (분홍 박스) | 평균·분산 정규화 (distribution shift 보정) | ch07 |
| **Patching** | 길이 L → P 짜리 N patches | ch04 |
| **Projection + Position Embedding** (파랑 박스) | Linear (P → D_model) + 위치 정보 | ch06 |
| **Transformer Encoder** (녹색 박스, × M_layers) | Multi-head attention + FFN + LayerNorm | ch06 |
| **Flatten + Linear Head** (분홍 박스) | N × D → T 차원 변환 | ch06 |
| **Output prediction** (맨 아래) | T 미래 시점 예측 | - |

### Panel (c) — Transformer Backbone (Self-supervised)

#### Pipeline

```
Input single channel x^(i) ∈ R^L
       ↓
Instance Norm + Patching
       ↓
N patches, 40% mask 적용 (random)
       ↓
Projection + Position Embedding
       ↓
Transformer Encoder × M_layers
       ↓
Linear Layer (reconstruction head)
       ↓
Reconstructed Masked Patches (only masked positions)
       ↓
MSE loss with original patches
```

#### Panel (b) 와의 차이

| 요소 | Panel (b) Supervised | Panel (c) Self-supervised |
|------|---------------------|--------------------------|
| Input | 원본 patches | 일부 patches mask (40%) → 0 |
| Output | T 미래 시점 (forecasting) | 원본 patches (reconstruction) |
| Output head | Flatten + Linear Head (large output) | Linear Layer (per-patch reconstruction) |
| Loss | MSE forecasting | MSE reconstruction (masked positions only) |
| 학습 후 | 바로 예측 | Fine-tune for forecasting |

### ★ Figure 1 의 핵심 통찰

#### 통찰 1: 같은 backbone 두 task

Panel (b) 와 (c) 가 **같은 Transformer encoder** 사용. 차이는 input/output 만.

→ **One backbone, two tasks** — supervised + self-supervised 둘 다 같은 모델로.

#### 통찰 2: ViT 의 정신 그대로

Patch + Projection + Position Embedding + Transformer Encoder + Linear Head 의 sequence = **ViT (Vision Transformer) 그대로**.

→ paper 의 "**A Time Series is Worth 64 Words**" 제목의 의미 = **ViT 가 image 를 16×16 patches 로 본 것처럼, 시계열을 16-step patches 로 보자**.

#### 통찰 3: Channel-Independence 는 시각적으로 panel (a) 만

Panel (a) 만 channel-independence 표현. Panel (b), (c) 는 single channel 의 detail. 즉:

- **Outer level (panel a)**: Channel-Independence.
- **Inner level (panel b, c)**: 표준 Transformer (단순함).

→ **계층적 단순함** — PatchTST 의 design philosophy.

```viz:pat-architecture:title=Fig 1 (a)(b)(c) Architecture (interactive),caption=3 panel toggle. (a) Channel-indep, (b) Supervised backbone, (c) Self-supervised backbone.
```

---

## 3.7 본 논문의 의의 — 학계 흐름의 *turning point*

```
   2017 Transformer (NLP)
              ↓
   2018-2021 시계열 Transformer 시도
   Informer, Autoformer, FEDformer
   "시계열 specific 변형 필요"
              ↓
   2022 DLinear 도전
   "Transformer 시계열 X"
              ↓
   2023 PatchTST ★
   "Vanilla Transformer + 두 trick = SOTA"
              ↓
   2024+ 시계열 foundation model 폭증
   iTransformer (2024), Chronos (2024), TimesFM (2024)
   모두 PatchTST 위에 build
```

**메시지**: PatchTST 는 시계열 분야의 *paradigm restoration*. *복잡한 attention 변형 X, Vanilla + 단순 trick* — *ViT 의 정신* 의 적용.

---

## 3.8 본 논문이 *재고* 시킨 통념

| 학계 통념 (2018-2022) | PatchTST 발견 |
|---------------------|--------------|
| 시계열 specific 변형 필요 | *Vanilla Transformer + 단순 trick* 으로 충분 |
| DLinear: "Transformer 시계열 X" | *21% MSE reduction* 으로 반박 |
| 단순 모델이 좋다 | *적절히 설계된 복잡 모델* 이 더 좋음 |
| Channel-mixing 이 자연 | *Channel-indep 가 더 robust* |
| 시계열 foundation model 불가능 | *PatchTST 가 첫 시도* |

---

## 3.9 자기점검

### 핵심 3가지
1. **2022년 DLinear 도전의 의미?**
2. **PatchTST 의 두 trick 의 직관?**
3. **본 논문의 핵심 수치?**

### 답변
1. **"Transformer 가 시계열 forecasting 에 효과적이지 않다"** 라는 도전. *간단한 linear model* (DLinear) 이 *복잡한 Transformer 변형들 (Informer, Autoformer, FEDformer)* 보다 *낫다* 는 결론. *시계열 Transformer 의 2-3년 노력 무력화* — 학계 *위기*. 본 논문 PatchTST 가 이 도전에 정면 응답.
2. **(1) Patching**: 긴 시계열 (336) 을 *16 짜리 작은 조각* 으로 자름 → *한 조각 = 한 단어* (ViT 의 정신). 효과: attention 복잡도 22× 감소 + longer history + local pattern 보존. **(2) Channel-Independence**: 326 변수 (전력 가구) 가 있어도 *각 변수 독립 Transformer 통과 + 같은 weight*. *Cross-channel mixing X*. 효과: overfitting 방지 + spurious correlation 회피.
3. **21.0% MSE reduction + 16.7% MAE reduction (PatchTST/64)** vs FEDformer/Autoformer/Informer 의 8 datasets × 4 horizons 평균. *Attention 22× 빠름* (Traffic dataset). *Self-supervised pre-training* 우월 + *transfer learning* 가능. 시계열 foundation model 의 *출발점*.

---

다음 챕터: [04_patching.md](04_patching.md) — Patching 메커니즘 *시계열 → 토큰* 변환.
