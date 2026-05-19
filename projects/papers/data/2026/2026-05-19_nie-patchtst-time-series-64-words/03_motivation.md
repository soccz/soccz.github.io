# 03 Motivation — DLinear 의 도전과 PatchTST 의 응답

## 배경 — 2022 의 위기

2017-2021 동안 Transformer 가 NLP, CV 를 차례로 정복.

**시계열에도 적용**:
- LogTrans (2019) — convolutional sparse attention
- Informer (2021 AAAI Best) — ProbSparse attention
- Autoformer (2021 NeurIPS) — auto-correlation
- FEDformer (2022 ICML) — Fourier enhanced
- Pyraformer (2022 ICLR) — pyramidal attention

→ 모두 vanilla Transformer 의 $O(L^2)$ 복잡도를 해결하려는 attention 변형들.

---

## 2022 의 폭탄 — DLinear (Zeng et al.)

**DLinear** 가 정식 제목은 "Are Transformers Effective for Time Series Forecasting?".

**도발적 주장**:
- 단순 decomposition + linear 모델이 Informer/Autoformer/FEDformer/Pyraformer 를 **모두 outperform**
- "Transformer 는 시계열 forecasting 에 효과적이지 않다"
- 복잡한 attention 메커니즘 < 단순 linear

→ 시계열 Transformer 전체 분야에 정체성 위기.

---

## PatchTST 의 응답 전략

paper Section 1:
> With our PatchTST model, we not only confirm that Transformer is actually effective for time series forecasting, but also demonstrate the representation capability that can further enhance the forecasting performance.

"Transformer is actually effective" — DLinear 에 대한 정면 반박.

**전략 3 가지**:
1. **Patching**: 시계열을 patch 단위로 추상화 → 점단위 attention 의 한계 극복
2. **Channel-independence**: DLinear 가 잘 작동하는 이유 (channel-by-channel 학습) 를 Transformer 에 이식
3. **Longer look-back window**: $L=336$ 이상으로 늘려야 Transformer 가 강해짐

---

## 왜 Patching 인가 — paper 의 직접 설명

paper Section 1:
> Channel-mixing refers to the latter case where the input token takes the vector of all time series features and projects it to the embedding space to mix information. On the other hand, channel-independence means that each input token only contains information from a single channel.

paper Section 1:
> Patch in Transformer-based Models. Transformer (Vaswani et al., 2017) has demonstrated a significant potential on different data modalities. Among all applications, patching is an essential part when local semantic information is important. In NLP, BERT (Devlin et al., 2018) considers subword-based tokenization (Schuster & Nakajima, 2012) instead of performing character-based tokenization. In CV, Vision Transformer (ViT) (Dosovitskiy et al., 2021) is a milestone work that splits an image into 16×16 patches before feeding into the Transformer model.

→ **다른 modality 들의 lesson**: 점단위 token 보다 patch 단위가 잘 작동.
- NLP: character → subword (BERT)
- CV: pixel → 16×16 patch (ViT)
- Speech: raw audio → conv subseq (Wav2Vec)
- **시계열: timestep → patch (PatchTST)**

---

## 왜 Channel-independence 인가

paper p.2:
> Channel-independence... was proven to work well with CNN (Zheng et al., 2014) and linear models (Zeng et al., 2022), but hasn't been applied to Transformer-based models yet.

**역설**:
- DLinear (linear, channel-indep) — 잘 작동
- Informer/Autoformer (Transformer, channel-mix) — 덜 작동
- PatchTST 의 가설: **Transformer 가 약한 게 아니라, channel-mixing 이 문제**

→ Channel-independence 를 Transformer 와 결합 = 가설 검증.

---

## Table 1 의 case study — 한 dataset 의 진화

paper Table 1 (Traffic dataset, T=96):

| 구성 | look-back L | tokens N | patching | self-sup | MSE |
|------|------------|---------|----------|---------|-----|
| Channel-indep, no patch | 96 | 96 | × | × | 0.518 |
| Channel-indep, downsampled | 380 | 96 | × | × | 0.447 |
| Channel-indep, no patch | 336 | 336 | × | × | 0.397 |
| Channel-indep, patch | 336 | 42 | **✓** | × | 0.367 |
| Channel-indep, patch, self-sup | 336 | 42 | **✓** | **✓** | **0.349** |
| Channel-mixing FEDformer | 96 | - | × | × | 0.597 |
| DLinear | 336 | - | × | × | 0.410 |

**Story**:
- 0.518 → 0.447 (longer L + downsampling) — longer history helps
- 0.447 → 0.397 (no downsampling, more tokens) — full history > downsampling
- 0.397 → 0.367 (patching) — patching > raw timestep tokens
- 0.367 → 0.349 (self-supervised) — pre-training > scratch
- vs FEDformer 0.597 / DLinear 0.410 — PatchTST 0.349 beats both

→ 0.518 → 0.349 = **33% reduction** 의 진화.

---

## 또 다른 motivation — running time

paper Table 1 running time gain (L=336):

| Dataset | Patching ON (s) | Patching OFF (s) | Speedup |
|---------|----------------|------------------|---------|
| Traffic | 464 | 10040 | **22×** |
| Electricity | 300 | 5730 | **19×** |
| Weather | 156 | 680 | **4×** |

→ Patching 은 정확도뿐 아니라 학습 속도도 22배 빠르게.

---

## 3 contributions (paper Section 1 끝)

paper Section 1:
> To summarize, our contributions are: (i) we propose a channel-independent patch time series Transformer (PatchTST) that can capture the local semantic information and benefit from longer look-back windows; (ii) we apply our PatchTST for self-supervised representation learning, where we demonstrate that the model can learn abstract representation of the data beyond forecasting; (iii) our model outperforms SOTA Transformer-based models on multivariate time series forecasting and self-supervised representation learning tasks.

| # | Contribution |
|---|---|
| 1 | **Method**: channel-indep + patching + longer window |
| 2 | **Self-supervised**: representation learning capability |
| 3 | **Empirical**: SOTA on forecasting + representation tasks |

---

## Fig 1 — 핵심 그림

![Fig 1 PatchTST architecture](figures/Fig1_architecture.png)

(Figure 1, paper p.4)

paper Fig 1 caption:
> PatchTST architecture. (a) Multivariate time series data is divided into different channels. They share the same Transformer backbone, but the forward processes are independent. (b) Each channel univariate series is passed through instance normalization operator and segmented into patches. These patches are used as Transformer input tokens. (c) Masked self-supervised representation learning with PatchTST where patches are randomly selected and set to zero. The model will reconstruct the masked patches.

**3 sub-panels**:
- (a) **Model overview**: M channels → 같은 Transformer backbone, 독립 forward
- (b) **Supervised backbone**: Instance Norm + Patching → Projection + Position → Transformer Encoder → Flatten + Linear Head → output
- (c) **Self-supervised backbone**: 같은 구조, prediction head 대신 Linear Layer 로 patch reconstruction

다음 [04_patching.md](04_patching.md) 에서 Patching 메커니즘 수식 + 시각화.
