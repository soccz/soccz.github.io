# 13 Conclusion + Future Work

paper Section 5.

## 원문 (paper p.9)

> This paper proposes an effective design of Transformer-based models for time series forecasting tasks by introducing two key components: patching and channel-independent structure. Compared to the previous works, it could capture local semantic information and benefit from longer look-back windows. We not only show that our model outperforms other baselines in supervised learning, but also prove its promising capability in self-supervised representation learning and transfer learning.

> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting and be a building block for time series foundation models. Patching is simple but proven to be an effective operator that can be transferred easily to other models. Channel-independence, on the other hand, can be further exploited to incorporate the correlation between different channels. It would be an important future step to model the cross-channel dependencies properly.

---

## 한국어 요약

> 본 논문은 시계열 forecasting 을 위한 효과적 Transformer 디자인을 제안 — 두 가지 핵심: **patching** 과 **channel-independent** 구조. 이전 work 들 대비 (1) local semantic 정보 보존, (2) longer look-back window 활용. supervised 뿐 아니라 self-supervised representation learning + transfer learning 에서도 SOTA.

> 우리 모델은 미래 Transformer 기반 forecasting 의 **base model** 가능성, 그리고 시계열 foundation model 의 **building block** 가능성을 보인다. Patching 은 단순하지만 효과적인 operator — 다른 모델에도 쉽게 transfer 가능. Channel-independence 는 cross-channel correlation 을 다루지 못하는 한계 — 미래 work 에서 cross-channel dependency 를 적절히 modeling 하는 것이 중요.

---

## 핵심 contribution 재정리

| 측면 | 본문 인용 |
|------|---------|
| Method | "an effective design of Transformer-based models for time series forecasting tasks by introducing two key components: patching and channel-independent structure" |
| 효과 1 | "capture local semantic information" |
| 효과 2 | "benefit from longer look-back windows" |
| Supervised | "our model outperforms other baselines in supervised learning" |
| Self-supervised | "promising capability in self-supervised representation learning and transfer learning" |

---

## 한계 — Limitations

paper 는 conclusion 에서 한 가지 한계를 명시적으로 언급:

> Channel-independence, on the other hand, can be further exploited to incorporate the correlation between different channels. It would be an important future step to model the cross-channel dependencies properly.

**Cross-channel dependency 미모델링**:
- 모든 변수가 같은 weight 로 독립 처리 → 변수 간 명시적 dependency 학습 안 됨
- 예: 전력 사용량 × 기온 × 풍속 — 이 변수들의 implicit interaction 활용 못함
- Real-world 시계열에서 cross-channel pattern 은 분명 존재

→ **PatchTST 는 의도적 simplification**. Trade-off: simplicity vs cross-channel modeling.

---

## Future work — paper 의 명시적 방향

paper Section 5 의 미래 방향 3 가지:

### 1. Base model for Transformer-based forecasting
> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting

→ PatchTST 가 future 시계열 Transformer 의 standard baseline. 이후 paper 들 (iTransformer, TimeXer, ChannelFormer 등) 이 PatchTST 를 baseline 으로 사용.

### 2. Building block for foundation models
> and be a building block for time series foundation models

→ Channel-indep + weight sharing → multiple dataset 학습 가능. Foundation model (Chronos, TimesFM, Moirai) 들이 이 방향 발전.

### 3. Patching transferability
> Patching is simple but proven to be an effective operator that can be transferred easily to other models.

→ Patching 자체를 다른 architecture (e.g., MLP-Mixer, State-space model) 와 결합 가능.

### 4. Cross-channel modeling (미해결 문제)
> Channel-independence ... can be further exploited to incorporate the correlation between different channels.

→ PatchTST 이후 work (iTransformer 등) 의 동기.

---

## 한 줄 평가 — 이 paper 의 의의

> "DLinear 의 도전에 vanilla Transformer 가 두 가지 단순한 변경 (patching + channel-indep) 만으로 응답했고, 시계열 foundation model 의 길을 열었다."

---

## paper 의 broader impact / ethics — 없음

ICLR 2023 paper 라 NeurIPS 의 checklist 같은 broader impact 명시 의무 없음.
시계열 forecasting 자체가 dual-use 우려 적음.

---

## Connection — 이후 분야 발전

PatchTST (2023.3) 이후의 시계열 deep learning 발전:

| 시기 | 모델 | 핵심 contribution |
|------|------|------|
| 2023.3 | **PatchTST** (Nie 2023) | Patching + Channel-indep |
| 2023.6 | TimesNet (Wu 2023) | 2D periodicity decomposition |
| 2024.1 | **iTransformer** (Liu 2024) | Channel attention (reverse direction) |
| 2024.3 | Chronos (Ansari 2024) | Foundation model |
| 2024.6 | TimesFM (Das 2024) | Decoder-only foundation model |
| 2024.7 | Moirai (Woo 2024) | Multi-resolution masked encoder |

→ PatchTST 는 이 흐름의 **출발점**. 모든 이후 paper 가 PatchTST 를 baseline 또는 reference 로 인용.

---

## 5 ML design principles — paper 가 시사하는 lesson

1. **Borrow from successful domain**: ViT 의 patching → 시계열에 transfer
2. **Simplicity wins**: 새 attention 변형 없이 vanilla Transformer + 두 단순 trick
3. **Inductive bias matters**: Channel-indep 가 cross-channel 의 spurious correlation 제거
4. **Longer context with same compute**: Patching 으로 22× speedup → longer L 가능
5. **Self-supervised opens new capability**: Same architecture + masked pre-train → foundation model 방향

→ 이 5 lesson 이 PatchTST 의 영향력의 본질.

다음 [14_glossary.md](14_glossary.md) 에서 용어 + references 정리.
