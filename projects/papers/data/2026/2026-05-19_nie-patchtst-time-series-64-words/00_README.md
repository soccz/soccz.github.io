# 00 README — PatchTST (A Time Series is Worth 64 Words)

> **🧒 한 줄 요약**: 본 deep dive 입구. PatchTST = channel-independent + patching의 TS forecasting paradigm.


## 원문 정보

**제목**: A Time Series is Worth 64 Words: Long-term Forecasting with Transformers

**한국어 제목**: 패치 트랜스포머 — 시계열을 64개 단어로 보고 long-term 예측

**저자**: Yuqi Nie¹, Nam H. Nguyen², Phanwadee Sinthong², Jayant Kalagnanam²
¹ Princeton University · ² IBM Research

**발표처**: ICLR 2023 (Published as conference paper)

**Canonical identifier**: arXiv:2211.14730v2

**원본 PDF**: [PatchTST-Nie-ICLR-2023-time-series-64-words.pdf](/home/soccz/22tb/study/교수님/deep_dive/PatchTST-Nie-ICLR-2023-time-series-64-words.pdf)

---

## 태그

- **주 태그**: `time-series-forecasting` · `transformer` · `patching` · `channel-independence`
- **보조 태그**: `self-supervised` · `representation-learning` · `transfer-learning` · `long-term-forecasting` · `ICLR-2023`

---

## 분류

- **분야**: 시계열 deep learning, 특히 long-term multivariate forecasting + masked autoencoder
- **수준**: 중상 — vanilla Transformer + ViT-style patching 이해 필요

---

## 한 줄 판결

> **Vanilla Transformer 에 ViT-style 두 가지 단순 변경 = SOTA. (1) Patching: 시계열을 P=16, stride S=8 의 패치로 잘라 토큰화 — L=336 → N=42 토큰, attention 복잡도 O(L²) → O((L/S)²) 약 22배 단축 + longer look-back window 활용. (2) Channel-independence: M 개 변수 각각을 동일 weight 의 Transformer 에 독립 통과 (channel-mixing 아님). 추가로 40% masked self-supervised reconstruction 도입 → fine-tune / linear probing / transfer 전부 SOTA. 21.0% MSE / 16.7% MAE reduction vs FEDformer · Autoformer · Informer. ViT 의 시계열판이자 self-supervised TS foundation model 의 출발점.**

---

## 30초 요약

> **Vanilla Transformer + ViT-style 두 가지 단순 변경 = SOTA. (1) Patching: 시계열을 길이 P=16, stride S=8 의 패치로 자르고 각 패치를 토큰화 → 입력 길이 L=336 일 때 N=42 개의 토큰. (2) Channel-independence: M 개 변수 각각을 독립적으로 동일 Transformer 에 통과 (channel-mixing 아님). 두 가지로 (a) attention 복잡도 O(L²) → O((L/S)²) 22배 단축, (b) longer look-back window 활용 가능, (c) self-supervised masked reconstruction 도입 → fine-tune / linear probing / transfer 전부 SOTA. 21% MSE reduction vs FEDformer/Autoformer/Informer.**

---

## Chapter 가이드 (21개)

| 챕터 | 내용 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 7개 개념 (Transformer / ViT patching / Time series forecasting / Channel-indep vs mixing / Masked Autoencoder / Instance Norm / Look-back window) |
| [02_abstract.md](02_abstract.md) | Paper Abstract 정밀 번역 + 문장별 해부 |
| [03_motivation.md](03_motivation.md) | 왜 patching? 왜 channel-indep? DLinear 의 도전과 응답 |
| [04_patching.md](04_patching.md) | Section 3.1 Patching — L → P×N 분해, padding, complexity |
| [05_channel_independence.md](05_channel_independence.md) | Section 3.1 Channel-independence — M 변수 모두 같은 weight |
| [06_transformer_encoder.md](06_transformer_encoder.md) | Section 3.1 Transformer encoder — projection + position + multi-head attention + BatchNorm |
| [07_instance_norm_loss.md](07_instance_norm_loss.md) | Section 3.1 Instance Normalization + MSE Loss |
| [08_representation_learning.md](08_representation_learning.md) | Section 3.2 Masked self-supervised pretraining |
| [09_data_baselines.md](09_data_baselines.md) | Section 4 — 8 datasets + 7 baselines + experimental setup |
| [10_supervised_results.md](10_supervised_results.md) | Section 4.1 — Table 3 multivariate supervised forecasting + 21% MSE reduction |
| [11_repr_transfer.md](11_repr_transfer.md) | Section 4.2 — Table 4 self-sup + Table 5 transfer + Table 6 repr learning |
| [12_ablation.md](12_ablation.md) | Section 4.3 — Table 7 ablation (P+CI / CI / P / Original) + Figure 4 patch length |
| [13_conclusion.md](13_conclusion.md) | Section 5 — Conclusion + limitations + future work (cross-channel) |
| [14_glossary.md](14_glossary.md) | 핵심 용어 + reference [1]-[N] 정리 |
| [15_insights.md](15_insights.md) | 12 메타 통찰 — DLinear 대 PatchTST, ViT 의 transfer, Foundation model 방향 |
| [16_code.md](16_code.md) | PyTorch 구현 — Patching 함수, Channel-indep loop, Loss, Training step |
| [17_diagrams.md](17_diagrams.md) | ASCII diagrams + viz catalog |
| [18_appendix.md](18_appendix.md) | Appendix A.1–A.7 — 모델 hyperparameter, robustness, channel-indep 분석 (Figs 5-7, Tables 8-15) |
| [19_related_work.md](19_related_work.md) | Paper Section 2 — Patch in Transformer / TS Transformer baseline 5종 / TS representation learning 두 학파 |
| [20_analysis.md](20_analysis.md) | 결과 deep 해석 — 21% MSE reduction 분해 + Fig 6 attention 의미 + 한계 (DLinear vs ETTh1) + foundation model 위치 |

---

## Figures (원본 발췌)

| 파일 | paper 위치 | 내용 | 사용 chapter |
|------|----------|-----|---|
| `figures/Fig1_architecture.png` | p.4 | Fig. 1 — PatchTST architecture (a)(b)(c) | ch04, ch05, ch08 |
| `figures/Fig2_lookback_window.png` | p.9 | Fig. 2 — Look-back window vs MSE (3 datasets, 2 horizons) | ch10 |
| `figures/Fig3_forecast_viz.png` | p.14 | Fig. 3 — 192-step forecasting on Weather/Traffic | ch10 |
| `figures/Fig4_patch_length.png` | p.15 | Fig. 4 — Patch length ablation P=[2,4,8,12,16,24,32,40] | ch12 |
| `figures/Fig5_model_size.png` | p.20 | Fig. 5 — Model size sensitivity (6 hyperparameter combinations) | ch18 |
| `figures/Fig6_attention_maps.png` | p.23 | Fig. 6 — Attention maps (Electricity series 11/25/81) | ch18 |
| `figures/Fig7_channel_curves.png` | p.24 | Fig. 7 — Channel-indep vs mixing (train size / epoch) | ch18 |

---

## Interactive 시각화 (viz 모듈)

| viz id | 챕터 | 내용 |
|--------|------|------|
| `pat-patching` | 04 | Patching 메커니즘 — L=336 입력을 P=16, S=8 로 N=42 patch 로 자르는 슬라이딩 윈도우 |
| `pat-channel-indep` | 05 | Channel-independence vs channel-mixing — M 변수 처리 방식 토글 |
| `pat-table3-supervised` | 10 | paper Table 3 의 supervised 결과 — 8 datasets × 4 horizons × 8 models bar viz |
| `pat-lookback-window` | 10 | paper Figure 2 의 look-back vs MSE 라인 차트 |
| `pat-ablation-table7` | 12 | paper Table 7 ablation — P+CI / CI / P / Original 4 cases × 3 datasets |
| `pat-masked-recon` | 08 | Masked self-supervised reconstruction 시각화 (40% mask ratio) |
| `pat-table1-evolution` | 03 | paper Table 1 의 case study — 0.518→0.349 evolution bars |
| `pat-fig4-patch-length` | 12 | paper Fig 4 의 patch length sensitivity — 8 datasets toggle |
| `pat-architecture` | 03 | Fig 1 (a)(b)(c) interactive architecture — 3 panel toggle |
| `pat-table15-ci-universal` | 18 | paper Table 15 — channel-indep applied to Informer/Autoformer/FEDformer |
| `pat-table14-seeds` | 20 | paper Table 14 — random seed variance with error bars (5 seeds × 7 datasets) |
| `pat-fig5-model-size` | 20 | paper Fig 5 — model size sensitivity (6 hyperparameter combos × 8 datasets) |
| `pat-fig7-channel-curves` | 20 | paper Fig 7 — channel-indep vs mixing curves (train size + epoch panels) |
| `pat-table11-instance-norm` | 20 | paper Table 11 — Instance Norm with/without (+in vs -in) |

→ 전체 카탈로그는 [17_diagrams.md](17_diagrams.md).

---

## 핵심 수치 (paper 에서 직접 인용)

| 항목 | 값 | 출처 |
|---|---|---|
| MSE reduction vs Transformer baselines | **21.0%** (PatchTST/64), 20.2% (/42) | Section 4.1 |
| MAE reduction vs Transformer baselines | **16.7%** (/64), 16.4% (/42) | Section 4.1 |
| Patching speedup (Traffic) | **22×** (10040s → 464s) | Table 1 |
| Patch hyperparameters | P=16, S=8 | Section 4.1 |
| Default look-back window | L=336 (/42) or L=512 (/64) | Section 4.1 |
| Masking ratio | **40%** | Section 4.2 |
| Pre-training epochs | 100 | Section 4.2 |
| Linear probing epochs | 20 (head only) | Section 4.2 |
| Fine-tuning epochs | 10 lin. + 20 e2e | Section 4.2 |

→ 자세한 ablation + 추가 수치는 ch10-12.

---

## 다음 단계

- 처음 읽는 사람: [01_intro.md](01_intro.md) → [02_abstract.md](02_abstract.md) 순서
- 빠른 핵심: [03_motivation.md](03_motivation.md) → [10_supervised_results.md](10_supervised_results.md) → [15_insights.md](15_insights.md)
- 구현 관심: [04_patching.md](04_patching.md) → [05_channel_independence.md](05_channel_independence.md) → [16_code.md](16_code.md)
- Self-supervised 관심: [08_representation_learning.md](08_representation_learning.md) → [11_repr_transfer.md](11_repr_transfer.md)

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 권장 학습 path?**
2. **Channel-independent + patching paradigm 의의?**
3. **3년 후 TFM era 영향?**

### 답변

1. **선형 path**: 02 → 03 → 04 → 05 → 10 → 21.

2. **Channel-independent + patching의 first compelling**. "TS = sequence of patches" = ViT for TS. 단순 + effective + SOTA.

3. **TFM era foundation**. MOIRAI, Chronos 등 TFM이 patching DNA inherit. Architectural standard.
