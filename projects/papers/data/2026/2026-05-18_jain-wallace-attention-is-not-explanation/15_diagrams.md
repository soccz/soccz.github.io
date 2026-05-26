# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: 본 챕터는 *그림으로만* paper 의 모든 핵심 mechanism 을 설명. ASCII 도식 15+ 와 7 개 인터랙티브 viz 로 attention 의 input→output 흐름 / H1 의 검증 절차 / H2 의 counterfactual 탐색 / paper Figure 1 의 결정적 visual 까지 모두 시각 형태로 압축. "그림으로 먼저 본 뒤 다른 챕터의 본문 으로 들어가는" 진입 경로.

paper 의 핵심 mechanism 을 ASCII 도식 + 인터랙티브 viz 로 시각화.

---

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 7 인터랙티브 viz 로 attention 의 input/output 관계 + H1 correlation + H2 counterfactual + adversarial search 의 full pipeline 을 시각."**

---

## 15.2 ASCII 도식 — Model Architecture (paper §2)

```
INPUT
  x ∈ R^{T × |V|}    (one-hot encoded)
  └→ Embedding E ∈ R^{|V| × d}
       └→ x_e ∈ R^{T × d}
            │
            ▼
       ┌─────────┐
       │ ENCODER │  BiLSTM / Average / CNN
       └────┬────┘
            │
            ▼
       h ∈ R^{T × m}    (T hidden states, m-dim each)
            │
            ├──────────┐
            │          │
            ▼          ▼
       φ(h, Q)    ┌──────────┐
            │     │ Attention│  α = softmax(φ)
            ▼     └────┬─────┘
       SCORES         │
                       ▼
                  α ∈ R^T  (probability dist)
                       │
                       ▼
                  h_α = Σ α_t · h_t  ∈ R^m
                       │
                       ▼
                  ┌─────────┐
                  │ Decoder │  Dense + softmax
                  └────┬────┘
                       │
                       ▼
                  ŷ ∈ R^|Y|   (prediction)
```

---

## 15.3 ASCII 도식 — H1 Correlation Test

```
For each instance x:
  ┌─────────────────────────────────────────────────┐
  │ INPUT x = [The, movie, was, terrible]             │
  └─────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  ATTENTION α    GRADIENT g_t   LEAVE-ONE-OUT
   α = [0.1,     g = [0.05,    Δŷ_t = [0.02,
        0.2,           0.10,            0.05,
        0.1,           0.04,            0.01,
        0.6]           0.45]            0.40]
        │                │                │
        │                │                │
        └────┬───────────┴────────┬───────┘
             ▼                    ▼
         Kendall τ_g          Kendall τ_loo
         = 0.30 (low)         = 0.25 (low)

         FAIL H1 → attention 이 importance 와 *비일치*.
```

---

## 15.4 ASCII 도식 — H2-a Permutation Test (Algorithm 2)

```
ORIGINAL attention:
  α = [0.05, 0.10, 0.05, 0.80]       ← waste 강조
  ŷ = 0.01 (negative)

PERMUTATIONS (100x):
  α^1 = [0.80, 0.05, 0.10, 0.05]     ← was 강조
  ŷ^1 = 0.012                        ← TVD = 0.002 (tiny!)
  
  α^2 = [0.10, 0.80, 0.05, 0.05]     ← movie 강조
  ŷ^2 = 0.015                        ← TVD = 0.005
  
  α^3 = [0.05, 0.05, 0.80, 0.10]     ← was 강조 (다시)
  ŷ^3 = 0.013                        ← TVD = 0.003
  ...
  
MEDIAN ∆ŷ over 100 permutations:
  Δŷ_med = 0.006

FAIL H2-a → attention 위치 무관, 같은 prediction.
```

---

## 15.5 ASCII 도식 — H2-b Adversarial Attention

```
ORIGINAL:                          ADVERSARIAL (gradient-found):

α = [0.05, 0.10, 0.05, 0.80]      α̃ = [0.80, 0.05, 0.10, 0.05]
    [The,  movie, was, terrible]      [The,  movie, was, terrible]
                ↑                           ↑
              "terrible" focus            "The" focus

ŷ = 0.01 (negative)               ŷ̃ = 0.012 (negative)

JSD(α, α̃) = 0.43 (very different!)
TVD(ŷ, ŷ̃) = 0.002 (tiny!)

→ "다른 attention 으로 같은 prediction"
→ FAIL H2-b → attention 은 *unique* explanation 이 아님.
```

---

## 15.6 ASCII 도식 — Encoder mixing 차이

```
BiLSTM encoder:
  h_t = LSTM(x_1, x_2, ..., x_T)
        ↑
  모든 입력의 정보 *섞임*

  ┌────────────────────────┐
  │ token: The   movie was  │
  │        │     │     │    │
  │   h_1 ←┴─────┴─────┴─── │  ← h_1 이 모든 token 정보
  │   h_2 ←┴─────┴─────┴─── │  ← h_2 도 동일
  │   h_3 ←┴─────┴─────┴─── │  ← h_3 도 동일
  └────────────────────────┘
  
  → α_t 가 *큰 위치* 가 "원인 token" 라 단정 어려움.

Average encoder:
  h_t = ReLU(W * x_t + b)
        ↑
  *오직 token t* 의 함수.

  ┌────────────────────────┐
  │ token: The   movie was  │
  │        │     │     │    │
  │   h_1 ←┘     │     │    │
  │   h_2 ────────┘    │    │
  │   h_3 ──────────────┘   │
  └────────────────────────┘
  
  → α_t 가 *큰 위치* = "원인 token" 정확.
```

---

## 15.7 ASCII 도식 — paper Figure 1 (Heat Map)

```
ORIGINAL ATTENTION (waste 강조):

  ┌──────────────────────────────────────────────────────────────────┐
  │ after 15 minutes watching the movie i was asking myself           │
  │  0.02   0.01    0.01     0.02    0.01    0.02  0.01   0.02  0.01 │
  │                                                                    │
  │ what to do leave the theater sleep or try to keep                 │
  │  0.02 0.01 0.01 0.02   0.01    0.02  0.01  0.01 0.01 0.01 0.02   │
  │                                                                    │
  │ watching the movie to see if there was anything worth i           │
  │   0.02     0.01   0.02 0.01 0.01 0.01  0.01  0.01  0.01    0.01 0.01│
  │                                                                    │
  │ finally watched the movie what a [WASTE] of time maybe i am       │
  │  0.01    0.02    0.01  0.02   0.01 0.01 [0.45] 0.02 0.02 0.01 0.01│
  │                                          ↑                          │
  │                                       MAX ATTENTION                 │
  │                                                                    │
  │ not a 5 years old kid anymore                                     │
  │ 0.01 0.01 0.01 0.01 0.01 0.01 0.01                                │
  └──────────────────────────────────────────────────────────────────┘
  
  ŷ = 0.01 (negative)

ADVERSARIAL ATTENTION (was 강조):

  ┌──────────────────────────────────────────────────────────────────┐
  │ after 15 minutes watching the movie i [WAS] asking myself         │
  │  0.02   0.01    0.01     0.02    0.01    0.02  0.01  [0.45]  0.01│
  │                                                       ↑            │
  │                                                    MAX ATTENTION   │
  │                                                                    │
  │ ... (나머지 tokens 의 attention 분산 균등) ...                       │
  └──────────────────────────────────────────────────────────────────┘

  ŷ̃ = 0.01 (same!)
```

---

## 15.8 ASCII 도식 — paper Figure 2 패턴

```
Kendall τ_g (BiLSTM, SST):
  
  Frequency
   0.4 │      ▓▓▓▓
        │     ▓▓▓▓▓▓
   0.3 │    ▓▓▓▓▓▓▓▓
        │   ▓▓▓▓▓▓▓▓▓▓
   0.2 │  ▓▓▓▓▓▓▓▓▓▓▓▓
        │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
   0.1 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
        │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
        └────────────────────────────
       -1.0 -0.5  0.0  0.5  1.0
              ↑
            centered ~ 0.40 (low)

Kendall τ_g (Average, SST):
  
  Frequency
   0.4 │           ▓▓▓▓
        │          ▓▓▓▓▓
   0.3 │         ▓▓▓▓▓▓▓
        │        ▓▓▓▓▓▓▓▓
   0.2 │       ▓▓▓▓▓▓▓▓▓▓
        │      ▓▓▓▓▓▓▓▓▓▓▓
   0.1 │     ▓▓▓▓▓▓▓▓▓▓▓▓▓
        │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
        └────────────────────────────
       -1.0 -0.5  0.0  0.5  1.0
                          ↑
                       centered ~ 0.69 (high)

→ Average 의 단순 encoder → attention 의 explanation 능력 회복.
```

---

## 15.9 ASCII 도식 — paper Figure 6 (∆ŷ vs Max attention)

```
∆ŷ (median over permutations)
  1.0 │                                       ↗ "ideal" line
       │                              ╱   (max attention 클수록 ∆ŷ 커야)
  0.8 │                          ╱
       │                      ╱
  0.6 │                  ╱
       │              ╱
  0.4 │          ╱
       │      ╱
  0.2 │  ╱            ◉ ◉ ◉ ◉ ◉ ◉ ◉ ◉
       │              ◉ ◉ ◉ ◉ ◉ ◉ ◉ ◉  ← actual observation
  0.0 ╱──────────────────────────────────
        0.0    0.2    0.4    0.6    0.8    1.0
                       max α

paper 결과: max attention 큰 경우 (0.6+) 에도 ∆ŷ < 0.05 다수.
            → "큰 attention token 의 위치 무관, 같은 prediction"
```

---

## 15.10 ASCII 도식 — Adversarial Search 의 dynamics

```
Iter 0 (initial):                Iter 250 (mid):              Iter 500 (final):

α̃ = α (start same)              α̃ shifting away             α̃ adversarial converged

JSD = 0.00                       JSD = 0.21                   JSD = 0.42
TVD = 0.00                       TVD = 0.07                   TVD = 0.09 (< eps 0.10)
                                                              
[•••████]                       [██•••███]                  [████••••••]
                                                              ↑
                                                          새 attention
                                                          (very different)
                                                          
Loss = -JSD + 100 * max(0, TVD - 0.10)
     = -0.0 + 0      → 0       = -0.21 + 0   → -0.21       = -0.42 + 0  → -0.42

→ optimization 이 JSD 최대화 (∆ vector 가 |orig - adv|) 하며 TVD constraint 만족.
```

---

## 15.11 ASCII 도식 — Dataset 다양성

```
Dataset                Avg length    Class | Mean τ_g (BiLSTM)
─────────────────────────────────────────────────────────────────
SST                       19           0   |  0.40  (sentiment, short)
                                       1   |  0.38
IMDB                     179           0   |  0.37  (sentiment, long)
                                       1   |  0.37
ADR Tweets                20           0   |  0.45
                                       1   |  0.45
20 News                  115           0   |  0.08  ← outlier (low)
                                       1   |  0.13
AG News                   36           0   |  0.42
                                       1   |  0.35
Diabetes (MIMIC)        1858           0   |  0.47  ← medical, long
                                       1   |  0.38
Anemia (MIMIC)          2188           0   |  0.42
                                       1   |  0.43
CNN-QA                   761           ?   |  0.20
bAbI 1                     8           ?   |  0.23
bAbI 2                    67           ?   |  0.17
bAbI 3                   421           ?   |  0.30
SNLI                      14           0   |  0.36
                                       1   |  0.42
                                       2   |  0.40

→ 12 dataset (×2-3 classes) = ~26 configurations.
→ τ_g 중심 ~ 0.30, 모두 < 0.50 → BiLSTM 의 attention 일관 *fail*.
```

---

## 15.12 ASCII 도식 — Wiegreffe-Pinter Rebuttal 의 추가 검증

```
Jain-Wallace (this paper):                Wiegreffe-Pinter (rebuttal):

Question:                                 Question:
  "Adversarial α̃ exists?"                  "Adversarial α̃ trainable?"

Method:                                   Method:
  Gradient search                         Train model with adversarial α̃ frozen
                                            → 학습 가능한가?
                                          
Result:                                   Result:
  ✓ Adversarial α̃ exists                  ✗ 학습 어려움 (높은 loss, low accuracy)
                                          
Implication:                              Implication:
  Attention is not unique explanation     Original attention is *more plausible*
                                          
                       │                                        │
                       └────────────────┬───────────────────────┘
                                        ▼
                            COMBINED CONCLUSION:
                            
                 Attention 은 *strongly faithful* 이 아니지만
                       *plausible* explanation 으로는 가치 있음.
```

---

## 15.13 ASCII 도식 — paper 의 7년 영향력

```
2014  Bahdanau et al.    ─→ Attention mechanism 발명
2017  Vaswani et al.     ─→ Transformer (multi-head)
2018  Several papers     ─→ "attention as explanation" 표준 가정
                              
2019  ★ JAIN-WALLACE      ─→ "Attention is not Explanation" (NAACL)
                              │
                              ├─→ Wiegreffe-Pinter 2019 (EMNLP) 반박
                              ├─→ Serrano-Smith 2019 (ACL) confirm
                              └─→ Brunner et al. 2019 (transformer identifiability)
                              
2020  ERASER (Mass et al.) ─→ Plausibility metrics
2020  Abnar-Zuidema       ─→ Attention flow rollout
                              
2022  Anthropic dictionary ─→ Mechanistic interpretability shift
                              │
2023  ACDC                  ─→ Automated circuit discovery
2024  Sparse Feat Circuits  ─→ Feature-level explanation
                              
→ paper 가 "surface attention → internal circuit" 의 paradigm shift 의 trigger.
```

---

## 15.14 ASCII 도식 — 본 deep dive 의 챕터 의존성

```
                  ┌─────────────┐
                  │ 00_README   │
                  └──────┬──────┘
                         │
       ┌─────────────────┼──────────────────┐
       ▼                 ▼                  ▼
  ┌─────────┐       ┌─────────┐        ┌─────────┐
  │ 01_meta │       │ 02_tldr │        │ 03_prob │
  └─────────┘       └────┬────┘        └────┬────┘
                          │                  │
                          └────────┬─────────┘
                                   ▼
                            ┌─────────────┐
                            │ 04_claims   │
                            └──────┬──────┘
                                   │
              ┌────────┬───────────┼──────────┬────────┐
              ▼        ▼           ▼          ▼        ▼
          ┌──────┐  ┌──────┐  ┌────────┐  ┌──────┐ ┌──────┐
          │ 05a  │  │ 05b  │  │  05c   │  │ 05d  │ │ 06   │
          │ intu │  │ H1   │  │ H2     │  │ impl │ │ exp  │
          └───┬──┘  └───┬──┘  └────┬───┘  └──┬───┘ └──┬───┘
              └─────────┴──────┬───┴──────┴────────┘
                                ▼
                       ┌─────────────┐
                       │ 07_limits   │  ← Wiegreffe-Pinter
                       └──────┬──────┘
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
            ┌────────┐  ┌─────────┐  ┌─────────┐
            │ 08     │  │ 09      │  │ 10      │
            │lineage │  │ my res  │  │ ext     │
            └────────┘  └─────────┘  └─────────┘
                            │
                  ┌─────────┴────────────┐
                  ▼                      ▼
         ┌─────────────┐         ┌─────────────┐
         │ 11_verdict  │         │ 12-16 add'l │
         └─────────────┘         └─────────────┘
```

---

## 15.15 Viz 카탈로그 (인터랙티브) + paper Figure 매핑

| viz id | paper Figure | 챕터 사용처 | 컨트롤 |
|--------|-------------|------------|--------|
| `anie-attention-heatmap` | **Figure 1** (p.1, heatmap of attention weights — movie review example) | 02, 08, 11, 15 | example 선택 |
| `anie-correlation-hist` | **Figure 2** (p.4, histogram of Kendall τ across instances) | 02, 03, 05b | dataset + metric 토글 |
| `anie-permutation-scatter` | **Figure 6** (p.5, max attention vs median ∆ŷ over permutations) | 05c | dataset 셀렉터 |
| `anie-adversarial-search` | **§4.2.2 algorithm** (p.5, gradient ascent for adversarial α̃) | 05c, 14 | iter slider |
| `anie-tvd-jsd-2d` | **Figure 7** (p.6, 2D plot of Max JSD vs Max attention) | 05c, 07 | dataset 셀렉터 |
| `anie-encoder-comparison` | **Figure 5** (p.4, mean correlation difference for Average vs BiLSTM) + Appendix CNN | 05a, 05d, 06, 13 | highlight 셀렉터 |
| `anie-datasets-summary` | **Table 2** (p.4, summary statistics across 12 datasets) | 04, 06, 13 | metric 셀렉터 |

**paper figure 커버리지**:
- Figure 1 (heatmap): ✓ anie-attention-heatmap
- Figure 2 (correlation histogram): ✓ anie-correlation-hist
- Figure 3-5 (correlation 차이 분석): ✓ anie-encoder-comparison + anie-datasets-summary
- Figure 6 (permutation): ✓ anie-permutation-scatter
- Figure 7 (adversarial 2D): ✓ anie-tvd-jsd-2d
- §4.2.2 algorithm: ✓ anie-adversarial-search
- Table 1 (datasets): 본 deep dive 의 16_appendix §16.6 에 정확 수치 — viz JS 미작성 (정적 표가 더 적합)
- Table 2 (Kendall τ): ✓ anie-datasets-summary + 16_appendix §16.2 정확 수치

→ **paper 의 7 figures + 2 tables 중 viz JS 7 개로 모두 cover** (Table 1 은 정적 표만).

---

## 15.16 인터랙티브 시각화 — Attention Heatmap

```viz:anie-attention-heatmap:title=paper Figure 1 — Original vs Adversarial Attention,caption=example 셀렉터로 paper 의 다양한 예시 (movie review, medical note, news 등) 전환. 왼쪽 = original attention (높은 weight 위치), 오른쪽 = adversarial attention (완전 다른 위치). 두 prediction 거의 동일. → 핵심 결과: attention 이 unique 한 explanation 이 아님.
```

---

## 15.17 인터랙티브 시각화 — Correlation Histogram

```viz:anie-correlation-hist:title=Kendall τ Histogram (BiLSTM vs Average),caption=Dataset 셀렉터 + Encoder 토글. BiLSTM (contextualized) 의 τ 분포는 [0.0, 0.5] 사이 centered ~ 0.3. Average (token-isolated) 의 τ 분포는 [0.5, 1.0] 사이 centered ~ 0.7. → encoder 의 mixing strength 가 attention 의 explanation 능력 결정.
```

---

## 15.18 인터랙티브 시각화 — Permutation Scatter

```viz:anie-permutation-scatter:title=Max Attention vs Median ∆ŷ (Permutation),caption=Dataset 셀렉터로 SST / IMDB / Diabetes / bAbI 전환. 산점도의 x축 = max α (관찰된 attention 의 최대값), y축 = 100 permutation 의 median ∆ŷ (prediction 변화). ★ 핵심 관찰: max α 가 0.6+ 인 경우에도 ∆ŷ < 0.05 다수 — large attention 의 위치가 prediction 의 결정 요인 아님.
```

---

## 15.19 인터랙티브 시각화 — Adversarial Search

```viz:anie-adversarial-search:title=Adversarial Attention 최적화 Trajectory,caption=Iter 슬라이더 (0 → 500) 로 gradient-based 최적화 step 별 JSD/TVD 변화. iter=0: 원본 attention (JSD=0, TVD=0). iter 진행: JSD ↑ (다른 attention), TVD constraint ≤ 0.10 유지. iter=500: 최종 adversarial attention — original 과 매우 다른 분포 + 같은 prediction.
```

---

## 15.20 자기점검 (이 챕터)

### 핵심 3 가지

1. **paper Figure 1 (heatmap) 이 보여주는 핵심 contrast 는?**
2. **BiLSTM vs Average encoder 의 ASCII 도식 (15.6) 의 mechanistic difference?**
3. **Wiegreffe-Pinter rebuttal 의 combined conclusion (15.12)?**

### 답변

1. **"같은 prediction (0.01), 두 매우 다른 attention"**. Original 은 "waste" 강조 (직관적 = "이 영화 망함의 이유"). Adversarial 은 "was" 강조 (직관 X). 그러나 두 prediction 모두 0.01 (negative). 따라서 "waste 가 prediction 의 *원인*" 주장 무너짐 — 다른 attention 으로도 같은 prediction 가능. paper 의 가장 압축된 visual evidence.

2. **BiLSTM**: $h_t = LSTM(x_1, \ldots, x_T)$ — 모든 token 정보 mix. $h_t$ 는 token $t$ 의 위치 정보 + 다른 token 영향. **Average**: $h_t = ReLU(W x_t + b)$ — 오직 $x_t$ 의 함수. $h_t$ 가 token $t$ 만 represent. Attention $\alpha_t$ 의 의미: BiLSTM 에서 "위치 t 가 중요" (불명료), Average 에서 "token $x_t$ 가 중요" (정확).

3. **"Attention 은 *strongly faithful* 은 아니지만 *plausible* explanation 으로는 가치 있음"**. Jain-Wallace: adversarial α̃ exists → attention not unique → fail H2. Wiegreffe-Pinter: adversarial α̃ untrainable → original attention is *more plausible* than adversarial. Combined: 두 결과를 모두 인정하면 *attention 은 limited, contextual explanation* — 강한 unique faithful 아님, 약한 plausible 가치 있음. 후속 학계의 paradigm.

---

다음 [16_appendix.md](16_appendix.md) — 정확한 Table 2 수치 + reproduction 가이드.
