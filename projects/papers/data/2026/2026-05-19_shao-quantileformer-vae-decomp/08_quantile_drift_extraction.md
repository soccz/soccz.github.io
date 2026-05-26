# 08 Quantile Drift Feature Extraction — Section 4.3

> **🧒 한 줄 요약**: Quantile drift extraction. Multi-quantile output.


paper p.4 의 Section 4.3. 짧지만 핵심적인 모듈 — quantile drift $\chi^Q$ 를 Transformer encoder 로 변환.

---

## 두 종류의 Drift

paper 가 명시한 2 종류:

> Cross-time drift captures temporal interactions between data at different time steps, while cross-quantile drift reveals disparities in trends across quantile levels.

| 종류 | 설명 | 모델링 |
|------|------|--------|
| **Cross-time drift** | 시간 축에서의 dependency (예: t=10 과 t=20) | Transformer encoder 의 self-attention |
| **Cross-quantile drift** | quantile 축에서의 dependency (예: q=0.5 와 q=0.9) | 같은 encoder 가 multi-quantile 입력으로 받음 |

paper 의 디자인: 별도 분리된 모듈 없이 **단일 Transformer encoder** 가 두 종류 dependency 를 모두 학습.

---

## Encoder 구조 (paper p.4)

> We apply Transformer encoder on $\chi^Q$ to capture the drift features. The Transformer encoder consists of multiple identical layers (typically 6 layers). Each encoder layer consists of two sub-layers: a Multi-Head Self-Attention Layer and a Fully Connected Feedforward Layer. Residual connections and layer normalization are also included between these two sublayers.

표준 Transformer encoder (Vaswani 2017):
- Multi-Head Self-Attention
- FFN
- Residual + LayerNorm

paper default: **6 layers** (typically).

---

## Encoder 적용 (Eq 의 이름 정의)

paper text:
> We use $\chi^e_{out} = \text{Encoder}(\chi)$ to represent the Transformer encoder. Thus we have $\chi^Q_{eout} = \{\text{Encoder}(\chi^q)\}_{q \in Q}$ to denote the encoder output of the quantile drift feature.

**표기**:
- $\chi^e_{out} = \text{Encoder}(\chi)$: 단일 입력 $\chi$ 의 encoder output
- $\chi^Q_{eout} = \{\text{Encoder}(\chi^q)\}_{q \in Q}$: **각 quantile 의 drift 를 별도로** encoder 통과

→ $|Q|$ 개의 drift 가 각각 별도로 처리됨. Quantile $\{0.5, 0.6, 0.7, 0.8, 0.9\}$ → 5번의 encoder 호출.

(혹은 batched 로 한번에 — paper 가 구체적 구현은 명시 안 함)

---

## 데이터 흐름

```
χ^Q = {χ^0.5, χ^0.6, χ^0.7, χ^0.8, χ^0.9}   ← 5 quantile drift (length L each)
        │
        ↓ Transformer Encoder × N (typically N=6)
        │
χ^Q_eout = {Encoder(χ^0.5), Encoder(χ^0.6), ..., Encoder(χ^0.9)}
        │
        ↓ fusion Transformer 의 K, V 입력
```

paper Fig 2 의 상단 "Quantile Drift Feature Extraction" 블록이 이 모듈.

---

## Cross-time + Cross-quantile 의 동시 학습 메커니즘

paper 가 명시하지 않은 detail (본 deep dive 의 해석):

**Cross-time**: Encoder 의 self-attention 이 시간 축에서 모든 시점 사이의 관계 학습.
- $\text{Attention}(Q_i, K_j, V_j)$ — 시간 $i$ 와 $j$ 의 dot-product.
- 표준 Transformer 의 self-attention 과 동일.

**Cross-quantile**: 별도 mechanism 없지만 두 가지로 작동:
1. **각 quantile 의 drift 가 별도 encoder 호출** → quantile 마다 다른 representation.
2. **Fusion 단계** (ch09) 에서 모든 quantile representations 가 합쳐짐 — cross-attention 으로 quantile-aware 합산.

→ 즉 encoder 자체는 cross-time 만 직접 학습. Cross-quantile 은 후속 fusion 에서.

---

## Encoder layer 의 의미

```
입력: χ^q (shape: L × 1 or L × d after embedding)
       │
       ↓ Embedding (Linear) → L × d_model
       │
   ┌───↓───────────────────────────┐
   │ Multi-Head Self-Attention      │
   │ (cross-time dependency)        │
   └───┬───────────────────────────┘
       │ Residual + LayerNorm
       ↓
   ┌───↓───────────────────────────┐
   │ FFN (2 linear + ReLU)          │
   └───┬───────────────────────────┘
       │ Residual + LayerNorm
       ↓ × N layers
   χ^q_eout (shape: L × d_model)
```

표준 Transformer encoder 패턴. 새로움은 **입력 = quantile drift** 라는 점.

---

## Autoformer 와의 비교

| 측면 | Autoformer Encoder | QuantileFormer Encoder |
|------|--------------------|-----------------------|
| 입력 | 원본 series (after embedding) | **5개 quantile drift** |
| Self-attention 형태 | Auto-Correlation (series-wise) | 표준 Multi-Head Self-Attention (point-wise) |
| 분해 적용 | Encoder layer 마다 SeriesDecomp | 분해 = encoder **전**에 한 번 |
| Layer 수 | N=2 | N=6 (typically) |

→ QuantileFormer 는 **분해 부담을 사전에 끝내고** encoder 는 표준. 반면 Autoformer 는 분해 + Auto-Correlation 의 dual contribution.

---

## "왜 6 layers 인가?"

paper 가 "typically 6 layers" 라고 명시. 일반적 Transformer 권장. 본 deep dive 의 해석:

- Autoformer 는 분해를 layer 마다 반복 (progressive) → 2 layers 면 충분 (3-pass decomp in M=1 decoder).
- QuantileFormer 는 분해 사전 처리 → encoder 가 단순 feature 학습 → 더 깊은 6 layers 필요.

→ 디자인 trade-off: "분해를 어디에 두느냐" 에 따라 layer 수가 달라짐.

---

## 본 chapter 의 짧은 분량의 이유

paper Section 4.3 자체가 짧음 (약 1/4 페이지). Quantile drift 는 표준 Transformer encoder 의 단순 적용 → paper 의 주된 새로움은 **분해 (Section 4.1)** 와 **VAE (4.2)** 와 **Fusion (4.4)** 에 있음.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Cross-time drift 와 cross-quantile drift 의 차이와 각각이 어떻게 학습되는가?**
2. **paper 가 표준 Multi-Head Self-Attention 사용 (Autoformer 의 Auto-Correlation 아님) 의 이유 추정?**
3. **Quantile drift 가 5개 quantile 별 별도 encoder 호출 vs batched 처리 — 효율 차이?**

### 답변

1. **Cross-time**: 시간 축 dependency (예: $t=10$ 과 $t=20$). Encoder 의 self-attention 으로 학습. **Cross-quantile**: quantile 축 dependency (예: $q=0.5$ 와 $q=0.9$). Encoder 자체는 단일 quantile 처리 — cross-quantile 은 후속 fusion (ch09) 에서 학습.
2. paper 는 명시 안 함. 본 deep dive 추론: **분해 부담을 사전에 끝냄** (decomp + GMM 이 distribution 정보 추출) → encoder 는 표준 attention 으로 충분. Autoformer 는 분해를 layer 마다 진행 → Auto-Correlation 의 series-wise attention 으로 효율적. QuantileFormer 의 design choice = "분해 사전 + 표준 encoder".
3. **별도 호출**: 5번의 forward — 명확하지만 5배 시간. **Batched**: 5 quantile 을 batch dim 으로 합쳐 한 번 forward — 효율 ↑ 하지만 코드 복잡. Paper 가 명시 안 함 — 본 deep dive PyTorch 코드 (ch18) 에서는 별도 호출 사용 (단순성 우선).

다음 [09_fusion_transformer.md](09_fusion_transformer.md) 에서 두 path (drift + divergence) 의 결합 — Fusion Transformer with Cross-Attention (Eq 16–18).
