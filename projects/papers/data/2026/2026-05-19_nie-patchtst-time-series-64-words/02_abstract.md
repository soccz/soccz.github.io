# 02 Abstract — 6 문장 해부

paper p.1 의 abstract.

## 원문 전체

> We propose an efficient design of Transformer-based models for multivariate time series forecasting and self-supervised representation learning. It is based on two key components: (i) segmentation of time series into subseries-level patches which are served as input tokens to Transformer; (ii) channel-independence where each channel contains a single univariate time series that shares the same embedding and Transformer weights across all the series. Patching design naturally has three-fold benefit: local semantic information is retained in the embedding; computation and memory usage of the attention maps are quadratically reduced given the same look-back window; and the model can attend longer history. Our channel-independent patch time series Transformer (PatchTST) can improve the long-term forecasting accuracy significantly when compared with that of SOTA Transformer-based models. We also apply our model to self-supervised pretraining tasks and attain excellent fine-tuning performance, which outperforms supervised training on large datasets. Transferring of masked pre-trained representation on one dataset to others also produces SOTA forecasting accuracy.

---

## 한국어 번역

> 다변량 시계열 forecasting 과 self-supervised representation learning 을 위한 효율적인 Transformer 기반 모델을 제안한다. 두 가지 핵심 컴포넌트에 기반: (i) 시계열을 subseries-level patch 로 segmentation 하여 Transformer 의 input token 으로 사용; (ii) channel-independence — 각 channel 이 단일 univariate 시계열을 담고 모든 시리즈에 걸쳐 동일한 embedding 과 Transformer weight 를 공유. Patching 디자인은 세 가지 본질적 이점이 있다: local semantic 정보가 embedding 에 보존되고, 같은 look-back window 에서 attention map 의 계산·메모리 사용이 quadratic 으로 감소하며, 모델이 더 긴 history 를 attend 가능. 우리의 channel-independent patch time series Transformer (PatchTST) 는 long-term forecasting 정확도를 SOTA Transformer 들 대비 유의미하게 개선한다. Self-supervised pre-training 에도 적용하여 우수한 fine-tuning 성능을 달성하며, 큰 dataset 에서는 supervised training 을 outperform 한다. 한 dataset 에서 사전학습한 masked representation 을 다른 dataset 으로 transferring 해도 SOTA forecasting 정확도를 산출한다.

---

## 문장별 해부

### 문장 1: Two-task framework

> We propose an efficient design of Transformer-based models for multivariate time series forecasting and self-supervised representation learning.

**핵심**:
- **두 task** 동시 다룸: forecasting + representation learning
- 이전 시계열 Transformer 들은 forecasting 만 (Informer, FEDformer, Autoformer, Pyraformer)
- Self-supervised representation 은 NLP/CV 에서는 standard, 시계열에서는 미흡 영역

→ Single architecture, two paradigms.

---

### 문장 2: 두 핵심 디자인

> It is based on two key components: (i) segmentation of time series into subseries-level patches which are served as input tokens to Transformer; (ii) channel-independence where each channel contains a single univariate time series that shares the same embedding and Transformer weights across all the series.

**컴포넌트 1 — Patching**:
- 시계열 → subseries-level patches → Transformer input tokens
- ViT 의 정신 (이미지 → 16×16 patches → ViT input)
- "Subseries-level" = 한 patch 가 P 개의 timestep (P=16 일 때 16 timestep 의 subseries)

**컴포넌트 2 — Channel-independence**:
- 각 channel 이 **단일 univariate**
- 모든 channel 이 **embedding 과 Transformer weight 를 공유**
- "Share" — weight sharing (forward 는 독립, parameter 는 공통)

→ "embedding 도 공유" 라는 부분이 핵심. M 개 변수마다 다른 embedding 이 아니라 **한 embedding 을 모두 사용**.

---

### 문장 3: Patching 의 3 가지 이점

> Patching design naturally has three-fold benefit: local semantic information is retained in the embedding; computation and memory usage of the attention maps are quadratically reduced given the same look-back window; and the model can attend longer history.

| 이점 | 설명 |
|------|------|
| (a) Local semantic 보존 | 한 patch 안의 P 시점이 함께 처리 → 지역 context 유지 |
| (b) Quadratic 복잡도 감소 | $O(L^2) \to O((L/S)^2)$ — stride $S$ 만큼 토큰 수 감소 |
| (c) Longer history | 같은 compute budget 에서 더 긴 $L$ 가능 |

→ Table 1 의 22× speedup 의 원천.

---

### 문장 4: Supervised SOTA

> Our channel-independent patch time series Transformer (PatchTST) can improve the long-term forecasting accuracy significantly when compared with that of SOTA Transformer-based models.

- 모델 이름 공식화: **PatchTST** = "Patch Time Series Transformer"
- Significantly improve = 21.0% MSE reduction (paper Section 4.1)
- SOTA Transformer = FEDformer / Autoformer / Informer / Pyraformer / LogTrans

→ Transformer 계열의 새 SOTA 선언.

---

### 문장 5: Self-supervised 성능

> We also apply our model to self-supervised pre-training tasks and attain excellent fine-tuning performance, which outperforms supervised training on large datasets.

**핵심 주장**: Self-sup pre-training + fine-tune > 직접 supervised
- "On large datasets" 단서 — 작은 dataset 은 효과 미미
- Excellent fine-tuning = Table 4 의 fine-tune 결과

→ Foundation model 의 정신 도입.

---

### 문장 6: Transfer learning SOTA

> Transferring of masked pre-trained representation on one dataset to others also produces SOTA forecasting accuracy.

- Cross-dataset transfer 도 SOTA
- Pre-train 된 representation 이 dataset-agnostic 으로 작동
- Foundation model 의 가능성 시사

paper Section 5 (Conclusion):
> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting and be a building block for time series foundation models.

→ 시계열 foundation model 의 building block 으로 자임.

---

## Abstract 의 architecture

```
문장 1: Two-task framework (forecasting + repr learning)
   ↓
문장 2: 두 핵심 디자인 — Patching + Channel-independence
   ↓
문장 3: Patching 의 3 이점 (semantic / complexity / longer history)
   ↓
문장 4: Supervised SOTA claim
   ↓
문장 5: Self-sup > Supervised on large data
   ↓
문장 6: Transfer learning SOTA + Foundation model 가능성
```

→ paper 의 narrative arc: "단순 디자인이 큰 효과 + 새 paradigm (self-sup) 도 가능".

다음 [03_motivation.md](03_motivation.md) 에서 왜 patching, 왜 channel-indep — DLinear 의 도전과 응답.
