# 00 README — TimeGrad (Autoregressive Denoising Diffusion for Multivariate Probabilistic Time Series Forecasting)

## 원문 정보

**제목**: Autoregressive Denoising Diffusion Models for Multivariate Probabilistic Time Series Forecasting

**한국어 제목**: TimeGrad — 자기회귀 노이즈 제거 확산 모델로 다변량 확률적 시계열 예측

**저자**: Kashif Rasul¹, Calvin Seward¹, Ingmar Schuster¹, Roland Vollgraf¹
¹Zalando Research, Berlin, Germany

**발표처**: ICML 2021 (Proceedings of the 38th International Conference on Machine Learning)

**Canonical identifier**: arXiv:2101.12072v2 (2021-02-02)

**원본 PDF**: [TimeGrad-Rasul-ICML-2021-autoregressive-denoising-diffusion-time-series.pdf](/home/soccz/22tb/study/교수님/deep_dive/TimeGrad-Rasul-ICML-2021-autoregressive-denoising-diffusion-time-series.pdf)

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | arXiv:2101.12072v2 (2021-02-02), pdfTeX-1.40.21 |
| Metadata match | ✅ | 제목·저자·소속·conference 모두 arXiv·ICML proceedings 일치 |
| Full text access | ✅ | PDF 11쪽 (본문 8쪽 + References 3쪽) |
| Evidence map | ✅ | Eq. (1)–(10), Algorithms 1–2, Tables 1–2, Figs 1–4 위치 확인 |

---

## 태그

- **주 태그**: `time-series-forecasting` · `diffusion-model` · `probabilistic-forecasting` · `multivariate`
- **보조 태그**: `DDPM` · `Langevin-dynamics` · `energy-based-model` · `autoregressive` · `RNN-conditioning` · `ICML-2021`

---

## 분류

- **분야**: 다변량 확률적 시계열 예측 + diffusion generative model
- **수준**: 중상 — DDPM (Ho 2020) + autoregressive RNN 이해 필요

---

## 코드·데이터 공개

- **공식 코드**: paper 본문 "The source code of the model will be made available after the review process" — 공개 시점 명시 안 됨. Zalando Research GitHub 또는 PyTorch GluonTS 에 포함된 구현 참조.
- **데이터셋 (6종)** (paper Table 1):
  - **Exchange** — Lai 2018, 8 features, daily, 6,071 steps, 30-step prediction
  - **Solar** — Lai 2018, 137 features, hourly, 7,009 steps, 24-step prediction
  - **Electricity** — UCI, 370 features, hourly, 5,833 steps, 24-step prediction
  - **Traffic** — Caltrans PEMS-SF, 963 features, hourly (값 ∈ [0,1]), 4,001 steps, 24-step prediction
  - **Taxi** — NYC TLC, 1,214 features, 30-min, 1,488 steps, 24-step prediction
  - **Wikipedia** — Github mbohlkeschneider/gluon-ts/mv_release, 2,000 features, daily, 792 steps, 30-step prediction
- **재현성**: 본 deep dive 의 PyTorch 코드 ([14_code.md](14_code.md)) 로 TimeGrad single-step diffusion + RNN conditioning 재현 가능. 단 full hyperparameter (N=100, 8 residual blocks) 학습은 V100 16GB GPU 가 paper 와 동일.

---

## 한 줄 판결

> **DDPM (Ho et al. 2020 의 이미지 diffusion) 를 RNN-conditioned autoregressive 시계열 forecasting 으로 확장한 첫 paper. 매 시점 $t$ 의 다변량 분포를 $N=100$ step diffusion + Langevin dynamics 로 sampling. 6 datasets 중 5개에서 CRPS_sum SOTA (Solar 0.301→0.287, Electricity 0.0207→0.0206, Traffic 0.056→0.044, Taxi 0.179→0.114, Wikipedia 0.063→0.0485) — Transformer-MAF (NormalizingFlow) 와 GP-Copula (Low-rank Gaussian) 능가. Diffusion-based 시계열 forecasting 의 시초로 후속 paper (CSDI, TMDM, Diffusion-TS 등) 의 출발점. 단 $N$ step sampling loop 가 inference 속도 부담 (Chen 2021 / Song-DDIM 2021 으로 후속 개선 가능 명시).**

---

## 30초 요약

> **TimeGrad = (1) RNN 으로 시계열 history 인코딩 → hidden state $h_{t-1}$ + (2) DDPM (Ho 2020) 을 $h_{t-1}$ 에 조건화 → 다음 시점 $x^0_t \in \mathbb{R}^D$ 의 conditional distribution 학습. (3) 학습 = $\epsilon$-prediction (noise prediction) MSE loss. (4) Sampling = Langevin dynamics 로 N=100 step reverse process. 결과 = 6 datasets 중 5개 SOTA, ProTran (NeurIPS 2021) 의 Table 1 baseline 으로 등장한 강력한 모델.**

---

## Chapter 가이드 (19개)

| 챕터 | 내용 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 7개 개념 (시계열 forecasting / multivariate / probabilistic / DDPM / Langevin dynamics / energy-based model / CRPS) |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 4가지 도전 + 본 paper 의 답 |
| [04_diffusion_background.md](04_diffusion_background.md) | Section 2 — DDPM (Ho 2020) 배경 (Eq 1–7) |
| [05_method_a_problem.md](05_method_a_problem.md) | Section 3 도입 — multivariate setup + DeepAR baseline (Eq 8) |
| [05_method_b_rnn_diffusion.md](05_method_b_rnn_diffusion.md) | Section 3 본문 — RNN + conditional diffusion (Eq 9, 10) |
| [05_method_c_scaling_covariates.md](05_method_c_scaling_covariates.md) | Section 3.3–3.4 — scaling + covariates |
| [06_algorithms.md](06_algorithms.md) | Algorithm 1 (Training) + Algorithm 2 (Sampling via Langevin) |
| [07_data_baselines.md](07_data_baselines.md) | Section 4.1–4.2 — 6 datasets + 11 baselines + CRPS_sum metric |
| [08_main_results.md](08_main_results.md) | Section 4.3 — Table 2 CRPS_sum 결과 |
| [09_ablation_viz.md](09_ablation_viz.md) | Section 4.4 — Fig 3 (N ablation) + Fig 4 (Traffic predictions) |
| [10_related_work.md](10_related_work.md) | Section 5 — Energy-based methods + Time series forecasting lineage |
| [11_conclusion.md](11_conclusion.md) | Section 6 — 결론 + Future Work (DDIM, Transformer, graph NN) |
| [12_glossary.md](12_glossary.md) | 용어집 + 표기법 + References |
| [13_insights.md](13_insights.md) | 메타 통찰 12개 — "이해를 넘어서" |
| [14_code.md](14_code.md) | 실행 코드 (PyTorch TimeGrad 핵심 모듈) |
| [15_diagrams.md](15_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |
| [16_after_timegrad.md](16_after_timegrad.md) | TimeGrad 이후 — CSDI / TSDiff / Diffusion-TS / TMDM / MG-TSD / SSSD / TimeDiff 후속 계보 |
| [17_industry.md](17_industry.md) | 산업 적용 — Zalando / GluonTS / AWS / 실제 배포 사례 |
| [18_appendix.md](18_appendix.md) | Appendix — 전체 hyperparameter / 학습 비용 / NLL full / 코드 재현 가이드 |

---

## 인터랙티브 시각화

본 해체는 다음 viz 를 챕터 내 인라인 (carry-over from autoformer / quantileformer / protran):

| viz type | 챕터 | 내용 |
|----------|------|------|
| `pt-crps-table1` (reuse) | 08 | Table 2 재현 — 6 datasets × 11 models CRPS_sum |
| (신규) `tg-diffusion-process` | 04 | $N=100$ step forward/reverse process step-by-step (alpha-bar schedule) |
| (신규) `tg-ablation-N` | 09 | Fig 3 재현 — $N \in \{2,4,...,256\}$ 에서 CRPS_sum 변화 |
| (신규) `tg-langevin-sampling` | 06 | Algorithm 2 step-by-step (annealed Langevin) |
| (신규) `tg-crps-comparison` | 08 | Table 2 의 11 모델 × 6 dataset stacked-bar |
| (신규) `tg-architecture-flow` | 15 | 전체 pipeline 4-단계 flowchart |
| (신규) `tg-noise-prediction` | 04 | $\epsilon_\theta$ 의 noise prediction 분포 비교 |
| (신규) `tg-traffic-predictions` | 09 | Fig 4 재현 — Traffic 6/963 dim 의 50%/90% interval |
| (신규) `tg-vs-successors` | 16 | TimeGrad vs CSDI vs Diffusion-TS vs TMDM CRPS 비교 |
| (신규) `tg-loss-trajectory` | 14 | 학습 4단계 trajectory (Phase 1-4 loss curve) |
| (신규) `tg-sampling-trajectory` | 06 | Inference 시 $x^N \to x^0$ 의 reverse trajectory 시각화 |
| (신규) `tg-hyperparameter-grid` | 18 | 6 dataset × 6 hyperparameter heatmap |

→ 전체 카탈로그는 [15_diagrams.md](15_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | PDF p. | 내용 | 삽입 챕터 |
|------|--------|------|-----------|
| `figures/page4_Fig1_TimeGrad_schematic.png` | p.4 | Fig. 1 — TimeGrad schematic (RNN-conditioned diffusion at time $t-1$) | ch05b |
| `figures/page5_Fig2_network_architecture.png` | p.5 | Fig. 2 — Network architecture ($\epsilon_\theta$: 8 residual blocks, gated activation, dilated Conv1d) | ch05b |
| `figures/page5_Table1_datasets.png` | p.5 | Table 1 — 6 datasets (dim, domain, freq, time/pred steps) | ch07 |
| `figures/page6_Table2_CRPS_results.png` | p.6 | Table 2 — CRPS_sum on 6 datasets × 11 models (TimeGrad 5/6 SOTA) | ch08 |
| `figures/page7_Fig3_ablation_N.png` | p.7 | Fig. 3 — Electricity CRPS_sum vs $N \in \{2,4,...,256\}$, optimal $N \approx 100$ | ch09 |
| `figures/page7_Fig4_Traffic_predictions.png` | p.7 | Fig. 4 — Traffic 6/963 dimension prediction intervals (50%/90%) | ch09 |
