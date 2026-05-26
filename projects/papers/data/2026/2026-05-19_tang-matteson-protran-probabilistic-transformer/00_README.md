# 00 README — ProTran (Probabilistic Transformer)

> **🧒 한 줄 요약**: 본 deep dive 입구. ProTran = SSM + Transformer + VAE의 probabilistic forecasting.


## 원문 정보

**제목**: Probabilistic Transformer for Time Series Analysis

**한국어 제목**: 확률적 트랜스포머 — State-Space Model + Transformer 의 결합으로 다변량 시계열 생성 모델링

**저자**: Binh Tang, David S. Matteson
Department of Statistics and Data Science, Cornell University

**발표처**: NeurIPS 2021 (35th Conference on Neural Information Processing Systems)

**Canonical identifier**: NeurIPS 2021 paper

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | NeurIPS 2021 proceedings paper |
| Metadata match | ✅ | 제목·저자·소속·conference 모두 PDF 와 일치 |
| Full text access | ✅ | PDF 17쪽 (본문 10쪽 + References 5쪽 + Appendix 2쪽) |
| Evidence map | ✅ | Eq. (1)–(20), Tables 1–3, Figs 1–3 위치 확인 |

---

## 태그

- **주 태그**: `time-series-forecasting` · `probabilistic-forecasting` · `state-space-model` · `transformer`
- **보조 태그**: `VAE` · `hierarchical-latent` · `human-motion-prediction` · `non-autoregressive` · `attention-mechanism` · `NeurIPS-2021`

---

## 코드·데이터 공개

- **공식 코드**: paper 본문에 명시 안 됨. Cornell 의 corresponding author (bvt5@cornell.edu) 에게 요청 필요.
- **데이터셋 (7종)**:
  - **Solar** — 137 series, hourly
  - **Electricity** — 370 series, hourly
  - **Traffic** — 963 series, hourly (San Francisco freeway)
  - **Taxi** — 1,214 series, 30-min (New York City)
  - **Wikipedia** — 2,000 series, daily
  - **Human3.6M** — 3.6M frames @ 50Hz, 17-joint skeleton, 7 subjects
  - **HumanEva-I** — 60Hz, 15-joint, 3 subjects
- **재현성**: 시계열 5 datasets 모두 PyTorch GluonTS 표준 + 본 deep dive 코드 (ch18) 로 ProTran 단일 layer baseline 재현 가능.

---

## 한 줄 판결

> **State-space model (SSM) + Transformer 결합. 기존 SSM 의 Markovian 한계를 attention 으로 깨고, RNN 없이 latent space 전체에 self-attention. Hierarchical 확장으로 multi-layer stochastic latent 학습. 시계열 forecasting + human motion prediction 양쪽 모두 SOTA. CRPS_sum 5 datasets 중 3 dataset 에서 압도 (Solar 0.194 vs TimeGrad 0.287, Traffic 0.028 vs 0.044, Taxi 0.084 vs 0.114). Probabilistic Transformer 의 시초.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 7개 개념 (SSM, LDS, Kalman filter, VAE, ELBO, Transformer attention, CRPS) |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 4가지 challenge + main contributions |
| [04_preliminaries_ssm.md](04_preliminaries_ssm.md) | Section 2.1 — Variational SSM (Eq 1–3) |
| [05_preliminaries_transformer.md](05_preliminaries_transformer.md) | Section 2.2 — Transformer attention (Eq 4) |
| [06_single_layer_generative.md](06_single_layer_generative.md) | Section 3.1 — Single-layered ProTran generative model (Eq 5–9) |
| [07_single_layer_inference.md](07_single_layer_inference.md) | Section 3.1 — Single-layered ProTran inference model (Eq 10–11) |
| [08_multi_layer.md](08_multi_layer.md) | Section 3.2 — Multi-layered hierarchical extension (Eq 12–20) |
| [09_related_work.md](09_related_work.md) | Section 4 — Deep SSMs + attentive RNNs + forecasting + motion prediction |
| [10_data_baselines.md](10_data_baselines.md) | Section 5 — 7 datasets + 11+9 baselines + 4 metrics |
| [11_forecasting_results.md](11_forecasting_results.md) | Section 5.1 — Table 1 (CRPS_sum) + Fig 2 visualization + Table 2 ablation |
| [12_motion_results.md](12_motion_results.md) | Section 5.2 — Table 3 (ADE/FDE) + Fig 3 pose visualization |
| [13_conclusion.md](13_conclusion.md) | Section 6 — 결론 + limitations |
| [14_glossary.md](14_glossary.md) | 용어집 + 표기법 + References (101 papers) |
| [15_insights.md](15_insights.md) | 메타 통찰 15개 — "이해를 넘어서" |
| [16_code.md](16_code.md) | 실행 코드 (PyTorch ProTran single-layer reference impl) |
| [17_diagrams.md](17_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |

(17 chapters — 더 짧은 paper 라 chapter 수도 적음)

---

## 인터랙티브 시각화

| viz type | 챕터 | 내용 |
|----------|------|------|
| `pt-crps-table1` | 11 | Table 1 재현 — 5 datasets × 12 models CRPS_sum bar |
| `pt-ablation-table2` | 11 | Table 2 재현 — 4 settings ablation on Traffic |
| `pt-motion-table3` | 12 | Table 3 재현 — 11 models × 2 datasets × 2 metrics (ADE/FDE) |
| `pt-graphical-models` | 04 | Fig 1 4-panel 재현 — (a) LDS / (b) ProTran 1-layer / (c) 3-layer Gen / (d) 3-layer Inf (black gen vs red inf arrows) |
| `pt-attention-flow` | 06 | Single-layer generative process (Eq 5-9) 의 attention flow viz |
| `pt-hierarchical-stack` | 08 | Multi-layer (L=1, 2, 3) hierarchy 시각화 |

→ 전체 카탈로그는 [17_diagrams.md](17_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | PDF p. | 내용 | 삽입 챕터 |
|------|--------|------|-----------|
| `figures/Fig1_graphical_models.png` | p.2 | Fig. 1 — Graphical model (LDS / ProTran 1-layer / ProTran 3-layer gen+inf) | ch04, ch06, ch08 |
| `figures/Table1_crps.png` | p.7 | Table 1 — CRPS_sum 5 datasets × 12 models | ch11 |
| `figures/Fig2_traffic_predictions.png` | p.8 | Fig. 2 — Prediction intervals on Traffic (first 16 of 963 series) | ch11 |
| `figures/Fig3_human_poses.png` | p.9 | Fig. 3 — Ground-truth vs predicted poses (Smoking/Walk Together/etc) | ch12 |
| `figures/Table3_motion.png` | p.9 | Table 3 — Motion prediction ADE/FDE (11 models × 2 datasets) | ch12 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 권장 학습 path?**
2. **SSM + Transformer 결합 의의?**
3. **3년 후 TFM era 영향?**

### 답변

1. **선형 path**: 02 → 03 → 04→07 → 08 → 11 → 19.

2. **SSM + Transformer + VAE의 structured probabilistic**. Pre-ProTran ad hoc → structured framework. CRPS 0.218 SOTA.

3. **TFM era foundation + specialist**. TFM의 probabilistic output이 ProTran DNA. Motion prediction, risk forecasting specialist value.
