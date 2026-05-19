# 14 Glossary + References

## 핵심 용어 사전

| 약어 | 풀이 | 본 paper 에서의 위치 |
|------|------|------|
| **PatchTST** | Patch Time Series Transformer | 본 paper 의 이름 |
| **Patching** | 시계열을 P 길이 patch 로 분할 | Section 3.1, Eq N계산 |
| **Channel-indep** | 모든 channel 이 같은 weight 로 독립 forward | Section 3.1 |
| **CI** | Channel-Independent (Table 7, 15 에서 약어) | Table 7 |
| **P** | Patch length | Section 3.1 |
| **S** | Stride (patch 간 거리) | Section 3.1 |
| **N** | Number of patches | $N = \lfloor (L-P)/S \rfloor + 2$ |
| **L** | Look-back window length | Section 3.1 |
| **T** | Prediction horizon | Section 3.1 |
| **M** | Number of channels (multivariate dimension) | Section 3.1 |
| **D** | Transformer latent dimension | Section 3.1 |
| **H** | Number of attention heads | Section 3.1 |
| **MSE** | Mean Squared Error (loss + metric) | Section 3.1, 4.1 |
| **MAE** | Mean Absolute Error (metric) | Section 4.1 |
| **MAE** (다른 뜻) | Masked Autoencoder (He 2021) | Section 2, 3.2 |
| **TST** | Time Series Transformer (Zerveas 2021) | Table 7 의 "Original" baseline |
| **ViT** | Vision Transformer (Dosovitskiy 2021) | Section 2 — patching 의 영감 |
| **BERT** | Bidirectional Encoder Representations | Section 2 — subword tokenization 의 영감 |
| **DLinear** | Decomposition + Linear (Zeng 2022) | Main competitor baseline |
| **RevIN** | Reversible Instance Normalization (Kim 2022) | Section 3.1 — distribution shift |
| **ETT** | Electricity Transformer Temperature | Dataset family |
| **ILI** | Influenza-Like Illness | Smallest dataset |
| **CRPS** | Continuous Ranked Probability Score | (PatchTST 안 씀, ProTran 비교) |

---

## 인용 mapping — 본 paper 의 핵심 reference

### Transformer Architecture
- **[Vaswani 2017]** — Attention is all you need (Transformer 원조)
- **[Dosovitskiy 2021]** — Vision Transformer (ViT, 16×16 patching)
- **[Devlin 2018]** — BERT (subword tokenization, masked language modeling)
- **[He 2021]** — Masked Autoencoder (CV self-supervised)

### Time Series Transformer 들 (baselines)
- **[Zhou 2021]** — Informer (AAAI Best, ProbSparse attention)
- **[Wu 2021]** — Autoformer (NeurIPS, auto-correlation + decomposition)
- **[Zhou 2022]** — FEDformer (ICML, Fourier-enhanced)
- **[Liu 2022]** — Pyraformer (ICLR, pyramidal attention)
- **[Li 2019]** — LogTrans (NeurIPS, LogSparse)
- **[Cirstea 2022]** — Triformer (patch attention but pseudo timestamp)

### DLinear / Linear Baseline
- **[Zeng 2022]** — DLinear ("Are Transformers Effective for Time Series Forecasting?")

### Representation Learning Baselines
- **[Zerveas 2021]** — TST (Time Series Transformer, masked encoder for classification)
- **[Yang & Hong 2022]** — BTSF (Bilinear Temporal Spectral Fusion)
- **[Yue 2022]** — TS2Vec (universal time series representation)
- **[Tonekaboni 2021]** — TNC (Temporal Neighborhood Coding)
- **[Eldele 2021]** — TS-TCC

### Instance Normalization
- **[Ulyanov 2016]** — Instance Normalization (CV style transfer)
- **[Kim 2022]** — RevIN (Reversible IN for time series)

### Channel-indep precedent
- **[Zheng 2014]** — Channel-indep + CNN for time series
- **[Zeng 2022]** — Channel-indep + linear models (DLinear)

### Subword tokenization (NLP)
- **[Schuster & Nakajima 2012]** — subword tokenization 원조

### Foundation models
- **[Bommasani 2021]** — Foundation Models opportunity paper

### Speech (sub-sequence tokenization)
- **[Baevski 2020]** — Wav2Vec 2.0
- **[Hsu 2021]** — HuBERT

### Linear probing + Fine-tuning
- **[Kumar 2022]** — Linear probing first, then fine-tune

---

## 8 datasets — 출처

paper p.5:
> These datasets have been extensively utilized for benchmarking and publicly available on (Wu et al., 2021).

- Wu et al. 2021 (Autoformer paper) 이 정리한 dataset 집합
- 공식 repo: https://github.com/thuml/Autoformer/tree/main/dataset

| Dataset | 출처 |
|---------|------|
| Weather | German Weather Center |
| Traffic | California Department of Transportation (PeMS) |
| Electricity | UCI ML Repository |
| ILI | US CDC |
| ETT (4 dataset) | Zhou 2021 (Informer paper) — China power station |

---

## Tables 와 Figures 위치 정리

### Tables (15개 — main + appendix)
| # | 위치 | 내용 |
|---|------|------|
| 1 | p.2 | Case study on Traffic (look-back / patch / self-sup) |
| 2 | p.6 | Dataset statistics |
| 3 | p.6 | Multivariate supervised forecasting (main) |
| 4 | p.7 | Multivariate self-supervised forecasting |
| 5 | p.7 | Transfer learning (Electricity → others) |
| 6 | p.8 | Representation learning (vs BTSF/TS2Vec/TNC/TS-TCC) |
| 7 | p.8 | Ablation (P+CI / CI / P / Original) |
| 8 | p.15 | Univariate forecasting (Appendix A.3) |
| 9 | p.17 | Look-back window variation (Appendix A.4) |
| 10 | p.18 | Detailed ablation (Appendix A.4) |
| 11 | p.20 | Instance Norm with/without (Appendix A.6) |
| 12 | p.21 | Self-supervised full (Appendix A.5) |
| 13 | p.21 | Transfer learning full |
| 14 | p.22 | Random seeds variation |
| 15 | p.22 | Channel-indep for other models |

### Figures (7개)
| # | 위치 | 내용 |
|---|------|------|
| 1 | p.4 | PatchTST architecture (a)(b)(c) |
| 2 | p.9 | Look-back window vs MSE |
| 3 | p.14 | Forecast visualization |
| 4 | p.15 | Patch length ablation |
| 5 | p.21 | Model size scaling |
| 6 | p.22 | Attention maps |
| 7 | p.22 | Channel-indep vs mixing training curves |

---

## 시계열 forecasting 분야의 모델 timeline

```
2017 ─ Transformer (Vaswani) ─────────────────
2018 ─ BERT (Devlin) ─ NLP self-sup
2019 ─ LogTrans (Li) ─ 시계열 attention 첫 시도
2020 ─ DeepAR (Salinas) ─ probabilistic RNN
       Informer 발표 →
2021 ─ Informer (Zhou) ─ AAAI Best
       Autoformer (Wu) ─ NeurIPS
       ViT (Dosovitskiy) ─ ICLR
       MAE (He) ─ CV self-sup
       ProTran (Tang) ─ NeurIPS
2022 ─ FEDformer (Zhou) ─ ICML
       Pyraformer (Liu) ─ ICLR
       DLinear (Zeng) ─ "Are Transformers Effective?"
       TS2Vec, TNC, BTSF, TS-TCC ─ contrastive
       RevIN (Kim) ─ ICLR
2023 ─ ★ PatchTST (Nie) ─ ICLR ★
       TimesNet (Wu) ─ ICLR
2024 ─ iTransformer (Liu) ─ ICLR
       Chronos (Ansari)
       TimesFM (Das)
       Moirai (Woo)
       Lag-Llama (Rasul)
```

→ PatchTST 는 2023 의 시계열 deep learning paradigm shift 의 핵심.

---

## 한 줄 cheat sheet

> Vanilla Transformer + Patching (ViT 스타일) + Channel-independence + longer look-back window = SOTA forecasting + self-supervised representation learning.

다음 [15_insights.md](15_insights.md) 에서 15 메타 통찰.
