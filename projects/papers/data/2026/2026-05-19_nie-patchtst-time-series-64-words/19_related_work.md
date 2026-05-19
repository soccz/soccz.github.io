# 19 Related Work — Paper Section 2 deep dive

paper Section 2 의 3 sub-section 을 chapter 단위로 정리.

paper Section 2 (p.2):
> **Patch in Transformer-based Models.** Transformer (Vaswani et al., 2017) has demonstrated a significant potential on different data modalities. Among all applications, patching is an essential part when local semantic information is important.

paper Section 2 (p.2):
> **Transformer-based Long-term Time Series Forecasting.** There is a large body of work that tries to apply Transformer models to forecast long-term time series in recent years.

paper Section 2 (p.2):
> **Time Series Representation Learning.** Besides supervised learning, self-supervised learning is also an important research topic since it has shown the potential to learn useful representations for downstream tasks.

---

## 2.1 Patch in Transformer-based Models

paper:
> Among all applications, patching is an essential part when local semantic information is important. In NLP, BERT (Devlin et al., 2018) considers subword-based tokenization (Schuster & Nakajima, 2012) instead of performing character-based tokenization. In CV, Vision Transformer (ViT) (Dosovitskiy et al., 2021) is a milestone work that splits an image into 16×16 patches before feeding into the Transformer model. The following influential works such as BEiT (Bao et al., 2022) and masked autoencoders (He et al., 2021) are all using patches as input. Similarly, in speech researchers are using convolutions to extract information in sub-sequence levels from raw audio input (Baevski et al., 2020; Hsu et al., 2021).

### Patching evolution across modalities

| Modality | Pre-patching | Patching paper | Patch unit |
|----------|-------------|----------------|-----------|
| NLP | Character tokens | **BERT** (Devlin 2018) | Subword (3-7 char) |
| Vision | Pixel (224×224 = 50,176) | **ViT** (Dosovitskiy 2021) | 16×16 patch (196 tokens) |
| Vision (self-sup) | - | **BEiT** (Bao 2022), **MAE** (He 2021) | 16×16 patch + mask |
| Speech | Raw audio | **Wav2Vec 2.0** (Baevski 2020) | Conv sub-sequences |
| Speech | - | **HuBERT** (Hsu 2021) | Conv sub-sequences |
| **Time Series** | timestep tokens | **PatchTST** (Nie 2023) | Subseries (P=16) |

→ **PatchTST 가 시계열의 ViT 모먼트**. NLP 의 BERT, CV 의 ViT 처럼 patching 패러다임 도입.

### Why patching works (universal principle)

paper 의 함축적 메시지:
- **Character / Pixel / Timestep 단위 token 은 의미 단위가 아님**
- Subword / Patch / Subseries 가 진정한 의미 단위
- Local semantic 정보를 보존하면서 attention 의 token 수를 줄임

→ "Multi-modality lesson 의 시계열 도착". Cross-domain transfer 의 정수.

---

## 2.2 Transformer-based Long-term Time Series Forecasting

paper:
> There is a large body of work that tries to apply Transformer models to forecast long-term time series in recent years. We here summarize some of them. LogTrans (Li et al., 2019) uses convolutional self-attention layers with LogSparse design to capture local information and reduce the space complexity. Informer (Zhou et al., 2021) proposes a ProbSparse self-attention with distilling techniques to extract the most important keys efficiently. Autoformer (Wu et al., 2021) borrows the ideas of decomposition and auto-correlation from traditional time series analysis methods. FEDformer (Zhou et al., 2022) uses Fourier enhanced structure to get a linear complexity. Pyraformer (Liu et al., 2022) applies pyramidal attention module with inter-scale and intra-scale connections which also get a linear complexity.

### 5 prior Transformer 시계열 모델 — 정확한 차별점

| Model | Year/Venue | Attention 변형 | Complexity | PatchTST 와 차이 |
|-------|-----------|---------------|------------|--------------|
| **LogTrans** | NeurIPS 2019 | Convolutional sparse + LogSparse | $O(L \log L)$ | 점단위 attention, locality 부족 |
| **Informer** | AAAI 2021 (Best) | ProbSparse + Distilling | $O(L \log L)$ | 점단위 attention, 가장 중요한 key 만 |
| **Autoformer** | NeurIPS 2021 | Auto-correlation + decomposition | $O(L \log L)$ | Auto-correlation 이 patch-level 시도 |
| **FEDformer** | ICML 2022 | Fourier-enhanced | $O(L)$ | 주파수 domain, patch 개념 없음 |
| **Pyraformer** | ICLR 2022 | Pyramidal attention | $O(L)$ | Multi-scale, patch 개념 없음 |

### Paper 의 critique — 점단위 attention 의 한계

paper:
> Most of these models focus on designing novel mechanisms to reduce the complexity of original attention mechanism, thus achieving better performance on forecasting, especially when the prediction length is long. However, most of the models use point-wise attention, which ignores the importance of patches.

paper:
> LogTrans (Li et al., 2019) avoids a point-wise dot product between the key and query, but its value is still based on a single time step.

paper:
> Autoformer (Wu et al., 2021) uses auto-correlation to get patch level connections, but it is a handcrafted design which doesn't include all the semantic information within a patch.

paper:
> Triformer (Cirstea et al., 2022) proposes patch attention, but the purpose is to reduce complexity by using a pseudo timestamp as the query within a patch, thus it neither treats a patch as a input unit, nor reveals the semantic importance behind it.

### Triformer — 가장 가까운 prior work

| 측면 | Triformer (2022) | PatchTST (2023) |
|------|-----------------|-----------------|
| Patch idea | ✓ (pseudo timestamp query) | ✓ (proper patch token) |
| Patch as input unit | ✗ | ✓ |
| Local semantic 보존 | ✗ | ✓ |
| Purpose | Complexity reduction | Local semantic + complexity |

→ Triformer 가 가장 가까운 prior work 지만 patch 를 **complexity reduction 목적** 으로만 사용. PatchTST 는 patch 를 **input unit + semantic carrier** 로 격상.

---

## 2.3 Time Series Representation Learning

paper:
> Besides supervised learning, self-supervised learning is also an important research topic since it has shown the potential to learn useful representations for downstream tasks. There are many non-Transformer-based models proposed in recent years to learn representations in time series (Franceschi et al., 2019; Tonekaboni et al., 2021; Yang & Hong, 2022; Yue et al., 2022). Meanwhile, Transformer is known to be an ideal candidate towards foundation models (Bommasani et al., 2021) and learning universal representations. However, although people have made attempts on Transformer-based models like time series Transformer (TST) (Zerveas et al., 2021) and TS-TCC (Eldele et al., 2021), the potential is still not fully realized yet.

### Time Series Repr Learning 의 두 학파

**학파 A — Contrastive (non-Transformer)**:
| Model | Year | Mechanism | Encoder |
|-------|------|-----------|---------|
| **CPC** (Franceschi 2019) | NeurIPS | Contrastive Predictive Coding | RNN/conv |
| **TNC** (Tonekaboni 2021) | ICLR | Temporal Neighborhood Coding | RNN |
| **BTSF** (Yang & Hong 2022) | ICML | Bilinear Temporal-Spectral Fusion | RNN |
| **TS2Vec** (Yue 2022) | AAAI | Hierarchical contrastive | TCN |

**학파 B — Masked (Transformer-based)**:
| Model | Year | Mechanism | Mask unit |
|-------|------|-----------|-----------|
| **TST** (Zerveas 2021) | KDD | Masked autoencoder | timestep |
| **TS-TCC** (Eldele 2021) | IJCAI | Time-series TCC | augmented sub-seq |
| **PatchTST** (Nie 2023) | ICLR | Masked autoencoder | **patch (subseries)** |

paper p.5:
> the potential is still not fully realized yet.

→ paper 의 자체 평가: TST/TS-TCC 가 시도했지만 **잠재력 미실현**. PatchTST 가 timestep → patch 단위 mask 로 잠재력 실현.

### Foundation models 의 시계열 trajectory

paper:
> Transformer is known to be an ideal candidate towards foundation models (Bommasani et al., 2021) and learning universal representations.

**Bommasani 2021** ("On the Opportunities and Risks of Foundation Models"): Foundation model 의 정의 + 가능성.

PatchTST 가 시계열 foundation model 의 **prerequisites** 충족:
- Universal architecture (channel-indep enables cross-dataset transfer)
- Self-supervised pre-training 가능 (masked patches)
- Scalable (vanilla Transformer)

→ 이후 paper 들 (Chronos / TimesFM / Moirai / Lag-Llama) 이 모두 PatchTST 의 자취 따라감.

---

## 종합 — PatchTST 의 분야적 위치

```
2017 ─ Transformer (Vaswani) ─────────────────
                                              
2018 ─ BERT (subword tokenization)            
       └─→ NLP self-sup paradigm              
                                              
2021 ─ ViT (16×16 patches) ─────────────────  ┐
       └─→ CV self-sup paradigm                │
       │                                       │ Cross-modality
       Informer / Autoformer ── 시계열 Transformer 시작
       LogTrans, TST                                       │
                                                           │
2022 ─ FEDformer / Pyraformer ── 점단위 attention 한계 →   │
       DLinear ── "Transformers are not effective"        │
       BTSF / TS2Vec / TNC / TS-TCC ── 시계열 contrastive │
                                                           │
2023 ─ ★ PatchTST ★ ←── 답: patch + channel-indep + vanilla
       시계열 ViT 모먼트                                   │
                                                           │
2024 ─ iTransformer / Chronos / TimesFM / Moirai ── PatchTST 자취
       시계열 foundation model 시대                       
```

**PatchTST 의 4 가지 분야 contribution**:

1. **Patching paradigm 의 시계열 transfer** (Section 2.1) — NLP/CV/Speech 의 patching 성공을 시계열에 적용
2. **점단위 attention 의 한계 극복** (Section 2.2) — Informer/Autoformer/FEDformer/Pyraformer 모두 point-wise attention 이라는 공통 약점 공격
3. **DLinear 도전에 대한 응답** (paper Section 1) — "Transformer is actually effective"
4. **Foundation model 시대 개막** (Section 2.3) — Channel-indep + masked pre-train + transfer learning 의 3 요소

→ paper 가 **종합한** 4 가지 contribution. 단순한 새 모델 paper 아닌 **분야 paradigm 정리** paper.

---

## Paper Section 2 vs deep dive coverage

| Sub-section | paper page | Deep dive 위치 |
|------------|-----------|--------|
| Patch in Transformer-based Models | p.2 | ch01 intro #3 (ViT) + ch19 (현재) |
| Transformer-based Long-term TS Forecasting | p.2 | ch09 (baselines) + ch19 (현재) |
| Time Series Representation Learning | p.2 | ch08 (self-sup) + ch11 (Table 6) + ch19 (현재) |

→ ch19 가 paper Section 2 의 **dedicated chapter** — paper 의 분야적 맥락 정리.
