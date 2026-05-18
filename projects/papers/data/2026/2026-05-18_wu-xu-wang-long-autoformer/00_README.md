# 00 README — Autoformer

## 원문 정보

**제목**: Autoformer: Decomposition Transformers with Auto-Correlation for Long-Term Series Forecasting

**한국어 제목**: 오토포머 — 분해 트랜스포머 + 자기상관 메커니즘으로 장기 시계열을 예측한다

**저자**: Haixu Wu, Jiehui Xu, Jianmin Wang, Mingsheng Long (Corresponding)
School of Software, BNRist, Tsinghua University, China

**발표처**: NeurIPS 2021 (35th Conference on Neural Information Processing Systems)

**Canonical identifier**: arXiv:2106.13008v5 (2022/01/07 revision)

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | arXiv:2106.13008v5 (2022-01-07), pdfTeX-1.40.21 |
| Metadata match | ✅ | 제목·저자·소속·conference 모두 arXiv·NeurIPS proceedings 와 일치 |
| Full text access | ✅ | PDF 20쪽 (본문 10쪽 + Appendix A-G 10쪽) |
| Evidence map | ✅ | Eq. (1)–(8), Tables 1–11, Figs 1–14, Algorithms 1–2 위치 확인 |

---

## 태그

- **주 태그**: `time-series-forecasting` · `transformer` · `decomposition`
- **보조 태그**: `auto-correlation` · `FFT` · `long-term-forecasting` · `seasonal-trend` · `series-wise-attention`

---

## 코드·데이터 공개

- **공식 코드**: **https://github.com/thuml/Autoformer** (THUML/Tsinghua, abstract 마지막 줄에 명시)
- **데이터셋 (6종)**:
  - **ETT** [48] — Electricity Transformer Temperature, 15분/시간 단위, 2016/07–2018/07 (ETTh1, ETTh2, ETTm1, ETTm2)
  - **Electricity** — UCI ML Repo, 321 customers, hourly, 2012–2014
  - **Exchange** [25] — 8개국 일간 환율, 1990–2016 (LSTNet 데이터셋)
  - **Traffic** — California DOT, 도로 점유율, hourly
  - **Weather** — Max-Planck-Institut für Biogeochemie (Jena), 21개 기상 변수, 10분 단위, 2020 전체
  - **ILI** [15] — CDC influenza-like illness, weekly, 2002–2021
- **Split**: ETT 6:2:2 / 그 외 5종 7:1:2 (chronological)
- **하드웨어**: NVIDIA TITAN RTX 24GB single GPU, PyTorch, Adam (lr=1e-4), batch=32, early stop ≤ 10 epochs, 3 runs per setting (mean ± std).
- **재현성**: 공식 repo 와 본 해체 PyTorch 코드(ch18)로 ETT predict-336 setting 재현 가능. 모든 dataset 은 공개.

---

## 한 줄 판결

> **장기 시계열 예측을 위해 self-attention 을 series-level Auto-Correlation 으로 교체하고, 시계열 분해(seasonal/trend-cyclical)를 deep network 의 inner block 으로 통합. FFT 로 자기상관 R(τ) 를 $O(L \log L)$ 에 계산 → Top-k 시간 지연으로 sub-series 를 정렬·집계. 6개 dataset (ETT/Electricity/Exchange/Traffic/Weather/ILI) 에서 평균 MSE 38% 감소. ETTm2 predict-336 에서 1.334 → 0.339 (74% 감소). Transformer 의 forecasting 적합화 — "point-wise → series-wise, pre-decomposition → progressive decomposition".**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 7개 개념 (시계열 분해, 자기상관, FFT, Wiener–Khinchin, Transformer, Roll, Cross-correlation) |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 장기 예측의 두 challenge 와 본 논문의 답 |
| [04_related_work.md](04_related_work.md) | Section 2 — Forecasting 모델 + 시계열 분해의 기존 사용법 |
| [05_architecture.md](05_architecture.md) | Section 3.1 — Decomposition architecture (Encoder/Decoder + Series Decomp Block, Eq 1–4) |
| [06_auto_correlation.md](06_auto_correlation.md) | Section 3.2 — Auto-Correlation 메커니즘 (Eq 5–7) |
| [07_complexity_efficiency.md](07_complexity_efficiency.md) | Section 3.2 후반부 — FFT 기반 $O(L\log L)$ 계산 (Eq 8) + Fig 7 |
| [08_data_baselines.md](08_data_baselines.md) | Section 4 — 6 datasets + 10 baselines + 학습 셋업 |
| [09_main_results.md](09_main_results.md) | Section 4.1 — Multivariate (Table 1) + Univariate (Table 2) |
| [10_ablation.md](10_ablation.md) | Section 4.2 — Decomposition (Table 3) + Auto-Correlation vs Self-Attention (Table 4) |
| [11_analysis.md](11_analysis.md) | Section 4.3 — Figs 4–7 + Figs 8–13 (decomposition · dependencies · seasonality · efficiency · predictions) |
| [12_appendix_ett_full.md](12_appendix_ett_full.md) | Appendix A — Table 5, 4개 ETT variant 전체 벤치마크 |
| [13_appendix_hyper_input.md](13_appendix_hyper_input.md) | Appendix B–D — Table 6 (c), Table 7 (input length), Table 8 (decoder input), Table 9 (decomp algorithms) |
| [14_appendix_covid.md](14_appendix_covid.md) | Appendix F — COVID-19 case study (Table 11, Fig 14) |
| [15_conclusion.md](15_conclusion.md) | Section 5 — 결론과 종합 |
| [16_glossary.md](16_glossary.md) | 용어집과 표기법 |
| [17_insights.md](17_insights.md) | 메타 통찰 15개 — "이해를 넘어서" + 후속 paper 흐름 + transfer learning |
| [18_code.md](18_code.md) | 실행 코드 (PyTorch Autoformer 핵심 모듈) |
| [19_diagrams.md](19_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |

---

## 인터랙티브 시각화

본 해체는 다음 viz 를 챕터 내 인라인:

| viz type | 챕터 | 내용 |
|----------|------|------|
| `autoformer-mse-table1` | 09 | Table 1 재현 — 6 datasets × 4 horizons × 7 models 의 MSE/MAE bar |
| `autoformer-decomp-ablation` | 10 | Table 3 재현 — Origin / Sep / Ours 의 MSE 비교 |
| `autoformer-attention-ablation` | 10 | Table 4 재현 — Auto-Corr vs Full/LogSparse/LSH/ProbSparse |
| `autoformer-efficiency` | 07 | Figure 7 재현 — memory/time vs predict length (5 models) |
| `autoformer-fft-acorr` | 06 | FFT 기반 자기상관 R(τ) 계산 step-by-step demo |
| `autoformer-seasonal-trend` | 05 | AvgPool moving-average 분해 + 점진적 누적 (Figure 4 idea) |
| `autoformer-topk-delays` | 06 | Top-k 시간 지연 선택 → Roll → Aggregation 시각화 |
| `autoformer-lag-histogram` | 11 | Figure 6 재현 — 4 dataset 의 학습된 lag 분포 |

→ 전체 카탈로그는 [19_diagrams.md](19_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | PDF p. | 내용 | 삽입 챕터 |
|------|--------|------|-----------|
| `figures/page4_Fig1_architecture.png` | p.4 | Fig. 1 — Autoformer 전체 architecture (Encoder N×, Decoder M×, 점진적 trend 누적) | ch05 |
| `figures/page5_Fig2_autocorr.png` | p.5 | Fig. 2 — Auto-Correlation + Time Delay Aggregation (FFT/IFFT, Roll(τ), Topk) | ch06 |
| `figures/page6_Fig3_attention_compare.png` | p.6 | Fig. 3 — Full / Sparse / LogSparse / Auto-Correlation 4가지 attention 비교 | ch06 |
| `figures/page9_Fig4_decomp_steps.png` | p.9 | Fig. 4 — Decomposition block 0/1/2/3개 누적 시각화 (ETT predict-720) | ch11 |
| `figures/page10_Figs5-7_deps_lags_efficiency.png` | p.10 | Figs 5–7 — 학습된 dependencies / lag 분포 / memory·time 효율 | ch11, ch07 |
| `figures/page15_Figs8-11_predictions.png` | p.15 | Figs 8–11 — ETT 96/192/336/720 prediction showcases | ch11 |
| `figures/page16_Figs12-13_exchange.png` | p.16 | Figs 12–13 — Exchange 비주기 + ETT univariate showcase | ch11 |
| `figures/page17_Fig14_covid.png` | p.17 | Fig 14 — COVID-19 입력 7일 → 예측 15일 (Country 2) | ch14 |
