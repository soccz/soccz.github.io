# 00 README — QuantileFormer

## 원문 정보

**제목**: QuantileFormer: Probabilistic Time Series Forecasting with a Pattern-Mixture Decomposed VAE Transformer

**한국어 제목**: 퀀타일포머 — 패턴-혼합 분해 + VAE + Transformer 로 확률적 시계열 예측

**저자**: Yimiao Shao, Wenzhong Li (Corresponding), Kang Xia, Kaijie Lin, Mingkai Lin, Sanglu Lu
Nanjing University

**발표처**: IJCAI 2025 (Proceedings of the Thirty-Fourth International Joint Conference on Artificial Intelligence), pp. 6147–6154

**Canonical identifier**: IJCAI 2025 paper (no arXiv ID provided in metadata)

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | IJCAI 2025 proceedings p.6147–6154, PDF title/subject metadata 일치 |
| Metadata match | ✅ | 제목·저자·소속·conference 모두 PDF metadata 와 일치 |
| Full text access | ✅ | PDF 8쪽 (본문 7쪽 + references 1쪽) |
| Evidence map | ✅ | Eq. (1)–(21), Tables 1–4, Figs 1–4 위치 확인 |

---

## 태그

- **주 태그**: `time-series-forecasting` · `probabilistic-forecasting` · `transformer`
- **보조 태그**: `pattern-mixture-decomposition` · `VAE` · `quantile-regression` · `gaussian-mixture` · `IJCAI-2025`

---

## 코드·데이터 공개

- **공식 코드**: paper 에 명시 안 됨. Nanjing University 의 corresponding author (lwz@nju.edu.cn) 에게 요청 필요.
- **데이터셋 (6종)**:
  - **Electricity** — 321 customers, hourly, 2016/7/1–2019/7/1, 26,304 samples
  - **ETTm1** — 7 features, 15분 단위, 2016/7/1–2018/6/26, 69,680 samples
  - **ETTh1** — 7 features, hourly, 2016/7/1–2018/6/26, 17,420 samples
  - **Wind** — 3 features, 15분 단위, 2020/7/1–2023/2/28, 93,412 samples
  - **Traffic** — 861 features, hourly, 2016/7/1–2018/7/2, 17,544 samples
  - **Solar** — 5 features, 15분 단위, 2020/1/1–2023/1/31, 108,192 samples
- **재현성**: paper 데이터 출처 모두 공개 (Electricity UCI, ETT Informer paper, Wind/Traffic/Solar 공개). 본 deep dive 의 PyTorch 코드 (ch18) 로 baseline 재현 가능.

---

## 한 줄 판결

> **확률적 시계열 예측을 위해 시계열을 (1) quantile drift + (2) divergence pattern + (3) Gaussian mixture 세 가지 패턴으로 분해 → 각각 Transformer encoder / VAE / cross-attention fusion 으로 처리 → joint quantile loss 로 학습. Autoformer 의 trend-seasonal 분해를 quantile-aware 분해로 일반화. 6 dataset 평균 q-risk 0.5/0.7/0.9 quantile 에서 24%/27%/22% 감소. cpaw (Coverage Probability × Normalized Averaged Width) 새 metric 도입. Probabilistic forecasting × Transformer × VAE 의 3-way 결합.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 7개 개념 (quantile regression, GMM, VAE, KL divergence, ELBO, Transformer, cross-attention) |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 3가지 challenge 와 본 논문의 답 |
| [04_related_work.md](04_related_work.md) | Section 2 — Transformer + 시계열 분해 + 확률 forecasting 의 기존 접근 |
| [05_problem_formulation.md](05_problem_formulation.md) | Section 3 — Quantile regression 수식 (Eq 1–3) |
| [06_pattern_mixture_decomp.md](06_pattern_mixture_decomp.md) | Section 4.1 — Drift-Divergence + GMM 분해 (Eq 4–7) |
| [07_vae_inference.md](07_vae_inference.md) | Section 4.2 — VAE 기반 distribution mixture inference (Eq 8–15) |
| [08_quantile_drift_extraction.md](08_quantile_drift_extraction.md) | Section 4.3 — Quantile Drift Feature Extraction (Transformer encoder) |
| [09_fusion_transformer.md](09_fusion_transformer.md) | Section 4.4 — Fusion Transformer with Cross-Attention (Eq 16–18) |
| [10_loss_function.md](10_loss_function.md) | Section 4.5 — Joint quantile loss (Eq 19) |
| [11_data_baselines.md](11_data_baselines.md) | Section 5 — 6 datasets + 8 baselines + 2 metrics (q-risk + cpaw, Eq 20–21) |
| [12_main_results.md](12_main_results.md) | Section 5.1 — Tables 1, 3 (q-risk + cpaw) |
| [13_ablation.md](13_ablation.md) | Section 5.2 — Table 4 (3가지 component ablation) |
| [14_hyperparam_viz.md](14_hyperparam_viz.md) | Section 5.3–5.4 — Fig 3 (k tuning) + Fig 4 (visualization) |
| [15_conclusion.md](15_conclusion.md) | Section 6 — 결론과 종합 |
| [16_glossary.md](16_glossary.md) | 용어집 + 표기법 + References 전체 표 |
| [17_insights.md](17_insights.md) | 메타 통찰 15개 — "이해를 넘어서" |
| [18_code.md](18_code.md) | 실행 코드 (PyTorch QuantileFormer 핵심 모듈) |
| [19_diagrams.md](19_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |

---

## 인터랙티브 시각화

본 해체는 다음 viz 를 챕터 내 인라인:

| viz type | 챕터 | 내용 |
|----------|------|------|
| `qf-qrisk-table1` | 12 | Table 1 재현 — 6 datasets × 5 quantiles × 9 models 의 q-risk bar |
| `qf-cpaw-table3` | 12 | Table 3 재현 — 6 datasets × 9 models cpaw |
| `qf-ablation-table4` | 13 | Table 4 재현 — 4 datasets × 3 components × 3 quantiles |
| `qf-hyperparam-k` | 14 | Figure 3 재현 — k ∈ [2, 16] 에서 q-risk 변화 (Electricity / Wind / ETTm1) |
| `qf-drift-divergence` | 06 | Drift-Divergence decomposition 시각화 — quantile filter 작동 |
| `qf-gmm-decomp` | 06 | GMM 분해 시각화 — divergence pattern → K Gaussian components |
| `qf-vae-graph` | 07 | VAE 모델의 변수 의존 그래프 (Beta-Bernoulli + Gaussian prior) |
| `qf-quantile-prediction` | 14 | Figure 4 재현 — 6 모델 × probabilistic interval viz (synthetic Electricity-like data) |

→ 전체 카탈로그는 [19_diagrams.md](19_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | PDF p. | 내용 | 삽입 챕터 |
|------|--------|------|-----------|
| `figures/Fig1_mixture_patterns.png` | p.1 | Fig. 1 — Mixture patterns in Electricity (diverse + mixture distribution + statistical chars) | ch03 |
| `figures/Fig2_architecture.png` | p.3 | Fig. 2 — QuantileFormer architecture (4 components: decomp / drift extraction / VAE / fusion) | ch04, ch06–09 |
| `figures/Fig3_hyperparam_k.png` | p.7 | Fig. 3 — k (Gaussian components 수) 의 q-risk 영향 (Electricity / Wind / ETTm1) | ch14 |
| `figures/Fig4_visualization.png` | p.7 | Fig. 4 — Probabilistic forecasting visualization (6 models, Electricity) | ch14 |
