# 08. Section 4.3 (Quantile Drift Feature Extraction) — Transformer encoder 의 역할

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Transformer encoder** 가 본 논문 architecture 에서 차지하는 역할
- **5 번 호출되는 encoder** 의 design choice (paper p.4 명시)
- Drift 만 별도로 처리하는 이유 — deterministic 신호의 정확한 추출

---

논문 4쪽 (Section 4.3) 을 풀어본다. 짧지만 모델의 한쪽 backbone — quantile drift $\chi^Q$ 를 Transformer encoder 로 변환.

---

## 8.1 시작하기 전 — Transformer encoder 가 뭔지

영어를 못해도 따라올 수 있도록 처음부터.

### Transformer 의 비유

**일상 비유**: 영어 문장 이해하기.
- "I went to the school yesterday" 라는 문장을 이해할 때.
- "I" 와 "went", "school" 과 "yesterday" 사이의 관계 파악 필요.
- 모든 단어 쌍 사이의 attention (주의) 을 계산하는 것이 self-attention.

**Transformer encoder layer 의 구조**:

```
입력 (= 단어 vector 들)
    │
    ↓ Multi-Head Self-Attention
    │   ("이 단어를 이해할 때 어느 단어들을 봐야 할까?")
    │
    ↓ Residual + LayerNorm (안정화)
    │
    ↓ FFN (Feed-Forward Network, = 2 layer 신경망)
    │   ("각 단어의 표현을 비선형 변환")
    │
    ↓ Residual + LayerNorm
    │
    출력 (= 변환된 단어 vector 들)
```

위 1 layer 를 **N 번 반복** (보통 6 layer).

### Encoder 의 역할

**입력**: 의미 vector 들의 sequence (예: 100 단어, 각 단어가 512차원 vector).
**출력**: 같은 sequence, 각 단어의 vector 가 **문맥 정보를 흡수한 형태** 로 변환.

→ "단어 자체의 의미" 만 있던 입력이 "문장 안에서의 의미" 가 들어간 출력으로 변환.

본 paper 에서는 "단어" 가 아니라 **시계열 시점들** 이 입력.

---

## 8.2 두 종류의 Drift

### 원문 (paper p.4)

> "Cross-time drift captures temporal interactions between data at different time steps, while cross-quantile drift reveals disparities in trends across quantile levels."

### 한국어 풀이

| 종류 | 설명 | 비유 | 모델링 |
|------|------|------|--------|
| **Cross-time drift** | 시간 축 dependency | "$t=10$ 과 $t=20$ 시점 사이의 관계" | Transformer encoder 의 self-attention |
| **Cross-quantile drift** | quantile 축 dependency | "$q=0.5$ 와 $q=0.9$ envelope 사이의 관계" | 같은 encoder 가 multi-quantile 입력으로 받음 |

paper 의 디자인: 별도 분리된 모듈 없이 **단일 Transformer encoder** 가 두 종류 dependency 를 모두 학습.

### Cross-time 의 비유

"오늘 12시 전력 수요가 큰 이유는 어제 같은 시간 + 일주일 전 같은 시간의 패턴 때문" — 이게 cross-time.

### Cross-quantile 의 비유

"오늘 12시의 median 수요가 5MW 일 때 90% quantile 은 8MW" — 이 두 quantile 의 관계가 cross-quantile.
- Median 이 올라가면 90% quantile 도 같이 올라가는 경향 (positive correlation).
- 혹은 변동성이 큰 시기에는 median 변화 없이 90% quantile 만 크게 변할 수도.

→ 이 두 관계를 모델이 학습.

---

## 8.3 Encoder 구조

### 원문 (paper p.4)

> "We apply Transformer encoder on $\chi^Q$ to capture the drift features. The Transformer encoder consists of multiple identical layers (typically 6 layers). Each encoder layer consists of two sub-layers: a Multi-Head Self-Attention Layer and a Fully Connected Feedforward Layer. Residual connections and layer normalization are also included between these two sublayers."

### 한국어 풀이

paper 가 사용하는 encoder = **표준 Transformer encoder** (Vaswani et al., 2017).

| 구성 요소 | 역할 | 비유 |
|---------|------|------|
| Multi-Head Self-Attention | 시점 간 dependency 학습 | "여러 명이 같은 책을 각자 다른 관점으로 읽기" |
| FFN (Feed-Forward Network) | 비선형 변환 | "각 시점의 표현을 다음 layer 가 쓸 형태로 변환" |
| Residual connection | 학습 안정화 | "원래 정보를 잃지 않게 유지" |
| LayerNorm | 정규화 | "각 layer 의 출력 scale 을 일정하게" |

**Default**: 6 layer (paper 가 "typically 6 layers" 라고 명시).

### Multi-Head Attention 풀이 (간략)

**Single-head attention**:
$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

- $Q$ (Query): "내가 알고 싶은 것".
- $K$ (Key): "각 시점이 무엇을 제공하는가".
- $V$ (Value): "각 시점의 실제 정보".

**Multi-head**: 위 attention 을 여러 (보통 8) head 로 병렬 → 결과를 concatenate → 다양한 관점에서 학습.

**비유**: 8명의 reader 가 같은 책을 각자 다른 관점 (인물, 줄거리, 배경, 주제, ...) 으로 분석한 후 종합.

---

## 8.4 Encoder 적용 — 표기 정의

### 원문 (paper p.4)

> "We use $\chi^e_{out} = \text{Encoder}(\chi)$ to represent the Transformer encoder. Thus we have $\chi^Q_{eout} = \{\text{Encoder}(\chi^q)\}_{q \in Q}$ to denote the encoder output of the quantile drift feature."

### 표기 풀이

| 기호 | 의미 |
|------|------|
| $\chi^e_{out} = \text{Encoder}(\chi)$ | 단일 입력 $\chi$ 의 encoder output |
| $\chi^Q_{eout} = \{\text{Encoder}(\chi^q)\}_{q \in Q}$ | **각 quantile 의 drift 를 별도로** encoder 통과 |

### 의미

$|Q|$ 개 (= 5개) 의 drift 가 각각 별도로 처리됨:
- Encoder($\chi^{0.5}$) → 5×500차원 vector (예: length 500, d=500)
- Encoder($\chi^{0.6}$) → 5×500차원 vector
- ... (5개)

→ **Quantile $\{0.5, 0.6, 0.7, 0.8, 0.9\}$ 마다 5번의 encoder 호출** (혹은 batched 로 한번에 — paper 가 구체적 구현은 명시 안 함).

---

## 8.5 데이터 흐름 한눈에

```
χ^Q = {χ^0.5, χ^0.6, χ^0.7, χ^0.8, χ^0.9}   ← 5 quantile drift (length L each)
        │
        ↓ Transformer Encoder × N (N=6)
        │
χ^Q_eout = {Encoder(χ^0.5), Encoder(χ^0.6), ..., Encoder(χ^0.9)}
        │
        ↓ fusion Transformer 의 K, V 입력 (다음 ch09)
```

paper Fig 2 의 상단 "Quantile Drift Feature Extraction" 블록이 이 모듈.

---

## 8.6 Encoder layer 의 ASCII 도식

```
입력: χ^q (shape: L × 1, single quantile drift)
       │
       ↓ Embedding (Linear) → L × d_model
       │
   ┌───↓───────────────────────────┐
   │ Multi-Head Self-Attention      │   ← cross-time dependency 학습
   │ (Q=K=V=current layer state)    │
   └───┬───────────────────────────┘
       │ Residual + LayerNorm
       ↓
   ┌───↓───────────────────────────┐
   │ FFN (2 linear + ReLU)          │   ← 비선형 변환
   └───┬───────────────────────────┘
       │ Residual + LayerNorm
       ↓ × N layers (보통 6)
   χ^q_eout (shape: L × d_model)
```

표준 Transformer encoder 패턴. **새로움은 입력이 quantile drift 라는 점**.

---

## 8.7 Cross-time + Cross-quantile 의 동시 학습 메커니즘

paper 가 명시하지 않은 detail (본 deep dive 의 해석):

### Cross-time 학습

Encoder 의 self-attention 이 시간 축에서 모든 시점 사이의 관계 학습:
- $\text{Attention}(Q_i, K_j, V_j)$ — 시간 $i$ 와 $j$ 의 dot-product.
- 표준 Transformer self-attention 과 동일.

### Cross-quantile 학습

별도 직접 mechanism 없지만 두 가지로 작동:

1. **각 quantile 의 drift 가 별도 encoder 호출** → quantile 마다 다른 representation.
2. **Fusion 단계 (ch09)** 에서 모든 quantile representations 가 합쳐짐 — cross-attention 으로 quantile-aware 합산.

→ 즉 **encoder 자체는 cross-time 만 직접 학습. Cross-quantile 은 후속 fusion 에서.**

---

## 8.8 "왜 6 layers 인가?"

paper 가 "typically 6 layers" 라고 명시. 일반적 Transformer 권장.

본 deep dive 의 해석:

| 모델 | 분해 위치 | Encoder layer 수 | 이유 |
|------|----------|---------------|------|
| Autoformer | 매 layer 마다 (progressive) | 2 | 분해가 layer 마다 반복되므로 적은 layer 로 충분 |
| QuantileFormer | 전처리 (encoder 전 한 번) | **6** | 분해 부담 없이 encoder 가 단순 feature 학습 → 더 깊게 |

→ 디자인 trade-off: "**분해를 어디에 두느냐**" 에 따라 layer 수 다름.

---

## 8.9 Autoformer 와의 비교

| 측면 | Autoformer Encoder | QuantileFormer Encoder |
|------|--------------------|-----------------------|
| 입력 | 원본 series (after embedding) | **5개 quantile drift** ($\chi^Q$) |
| Self-attention 형태 | Auto-Correlation (series-wise, FFT 기반) | 표준 Multi-Head Self-Attention (point-wise) |
| 분해 적용 | Encoder layer 마다 SeriesDecomp 반복 | 분해 = encoder **전** 에 한 번 (pattern-mixture, ch06) |
| Layer 수 | 2 | **6** |
| 학습 부담 | 분해 + Auto-Correlation 의 dual | 분해 사전 처리 → encoder 단순 |

→ QuantileFormer 는 **분해 부담을 사전에 끝내고** encoder 는 표준. 반면 Autoformer 는 분해 + Auto-Correlation 의 dual contribution.

---

## 8.9-bis ★ 왜 5번의 encoder 호출이 비효율이 아닌가

처음 보기에 5번의 별도 encoder 호출은 비효율 같음. 그러나:

| 측면 | 5번 호출 (paper) | 1번 batched 호출 (가정) |
|------|---------------|-------------------|
| 학습 가능 parameter | 같음 (encoder 공유) | 같음 |
| Forward 시간 | 5× (sequential) 또는 1× (parallel batch) | 1× |
| 메모리 | 5× | 5× (같은 sequence 길이) |
| **각 quantile 의 representation 독립성** | **확보** | 약함 (cross-quantile attention 학습됨) |

→ 5번 호출의 **숨은 장점**: 각 quantile drift 가 **독립적 처리** 됨 → fusion 단계 (ch09) 에서 cross-attention 으로 **명시적** 결합. 만약 1번 batched 였다면 encoder 가 implicit 하게 cross-quantile 학습 → fusion 의 역할 불명확.

> ★ **paper 의 design choice "5번 호출" 은 effective architecture isolation** — 각 모듈의 역할이 명확.

---

## 8.10 본 chapter 의 짧은 분량의 이유

paper Section 4.3 자체가 짧음 (약 1/4 페이지). Quantile drift 는 **표준 Transformer encoder 의 단순 적용** → paper 의 주된 새로움은:
- **분해** (Section 4.1, ch06)
- **VAE** (Section 4.2, ch07)
- **Fusion** (Section 4.4, ch09)

이 3개에 있음.

이 chapter (ch08) 는 "encoder 가 어떤 역할" 인지만 확인하면 충분.

---

## 8.11 Section 4.3 핵심 정리

| 항목 | 내용 |
|------|------|
| 입력 | $\chi^Q = \{\chi^q\}_{q \in Q}$ (5개 quantile drift) |
| 처리 | 각 $\chi^q$ 를 별도 Transformer encoder (6 layer) 통과 |
| 출력 | $\chi^Q_{eout}$ = 5개 encoder output (fusion 의 K, V 입력) |
| Encoder 구조 | 표준 Vaswani 2017 (Multi-Head Self-Attention + FFN + Residual + LayerNorm) |
| Layer 수 | 6 (paper default) |
| 학습 dependency 종류 | Cross-time (직접) + Cross-quantile (간접, fusion 에서) |

**한 줄 핵심**:
> **"5개 quantile drift 를 각각 표준 Transformer encoder (6 layer) 로 통과시켜 cross-time dependency 가 들어간 representation 5개를 생성. 이게 fusion Transformer 의 K, V 입력."**

다음 [09_fusion_transformer.md](09_fusion_transformer.md) 에서 두 path (drift + divergence) 의 결합 — Fusion Transformer with Cross-Attention (Eq 16~18).

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **본 chapter 에서 encoder 의 입력과 출력은 각각 무엇인가?**
2. **Cross-time drift 와 cross-quantile drift 의 차이는?**
3. **QuantileFormer 의 encoder layer 수 (6) 가 Autoformer (2) 보다 많은 이유는?**

### 답변

1. **Encoder 의 입력·출력**:
   - **입력**: $\chi^Q = \{\chi^{0.5}, \chi^{0.6}, \chi^{0.7}, \chi^{0.8}, \chi^{0.9}\}$ — 5 개 quantile drift (Eq 4 의 출력).
   - **각 drift 의 처리**: encoder 가 **별도 호출 × 5** 번. 같은 weight 공유 (parameter sharing).
   - **출력**: $\chi^Q_{eout}$ — 5 개 encoder output sequence.
   - **다음 단계**: ch09 의 **fusion Transformer 의 K, V 입력** 으로 사용. divergence path 의 Q 와 cross-attention.
   - **차원**: 입력 [batch, lookback, channels] × 5 → 출력 동일 shape × 5.
   - **왜 5 번 호출?**: 각 quantile drift 가 다른 정보 (예: 0.9 quantile 의 envelope vs 0.5 의 median) → 따로 sequence modeling 해야 함.

2. **Cross-time vs Cross-quantile dependency**:
   - **Cross-time dependency** (시간 축):
     - 예: "오늘 12시 ↔ 어제 12시 ↔ 일주일 전 12시" 의 일/주 cycle.
     - Encoder 의 **self-attention** 으로 직접 학습.
     - 각 quantile drift 안에서 시간 패턴 추출.
   - **Cross-quantile dependency** (quantile 축):
     - 예: "median (0.5) ↔ 90% quantile" 의 관계 (분포 모양).
     - Encoder **자체로는 직접 학습 안 함** — 각 quantile 별도 처리.
     - 대신 **fusion 단계 (ch09) 에서 cross-attention 으로 간접 학습**.
   - **설계 의도**: 두 dependency 를 **다른 단계** 에서 처리 — 모듈성 ↑.
   - **함의**: encoder 가 cross-quantile 안 잡아도 fusion 이 보완. 책임 분담.

3. **Autoformer 의 2 layer vs QuantileFormer 의 6 layer — 차이의 이유**:
   - **Autoformer (2021)** 의 구조:
     - 분해를 **매 layer 마다 반복** (progressive decomposition).
     - 각 layer = 분해 + Auto-Correlation 의 dual contribution.
     - 결과: 적은 layer (2개) 로 충분.
   - **QuantileFormer (본 논문)** 의 구조:
     - 분해를 **전처리** (encoder 전 한 번).
     - Encoder 는 분해 부담 없이 단순 feature 학습.
     - 결과: 더 **깊게 (6 layer)** 필요.
   - **Design trade-off**:
     - "분해를 어디에 두느냐" 에 따라 layer 수 결정.
     - Autoformer: 분해를 **layer 안에** → 분해 자체가 표현력 → 적은 layer 로 OK.
     - QuantileFormer: 분해를 **전처리로 분리** → encoder 가 pure sequence modeling → 더 깊게 필요.
   - **장단점**:
     - Autoformer: 효율적 (적은 layer), but 분해 변경 어려움.
     - QuantileFormer: 유연 (분해와 encoder 독립적 개선 가능), but 더 깊은 모델 필요.
   - **본 논문이 6 layer 선택 이유**: probabilistic forecasting 의 다중 quantile + multi-modal distribution → 표현력 충분히 필요.
