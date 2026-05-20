# 00 README — The Virtue of Complexity in Return Prediction

## 원문 정보

**제목**: The Virtue of Complexity in Return Prediction

**한국어 제목**: 복잡함의 미덕 — 머신러닝 시대의 수익률 예측

**저자**: Bryan Kelly¹²³, Semyon Malamud⁴⁵⁶, Kangying Zhou¹
¹Yale School of Management · ²AQR Capital Management · ³NBER · ⁴Swiss Finance Institute · ⁵EPFL · ⁶CEPR

**발표처**: *The Journal of Finance*, Vol. LXXIX, No. 1 (February 2024), pp. 459–503

**Canonical identifier**: DOI: 10.1111/jofi.13298

**원본 PDF**: [VirtueOfComplexity-Kelly-Malamud-Zhou-JF-2024.pdf](/home/soccz/22tb/study/교수님/deep_dive/VirtueOfComplexity-Kelly-Malamud-Zhou-JF-2024.pdf)

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | DOI 10.1111/jofi.13298 (Wiley) · ISSN 1540-6261 |
| Metadata match | ✅ | 제목·저자·연도·venue 일치 (JF 공식 페이지 + author homepages 교차 확인) |
| Full text access | ✅ | JF 2024 publish open access (Creative Commons CC BY-NC-ND) — 45쪽 전문 + Internet Appendix |
| Evidence map | ✅ | Assumptions 1–5 / Lemma 1 / Propositions 1–6 / Theorem 1 / Figures 1–11 / Table I / Equations 1–21 모든 위치 확인 |

---

## 태그

- **주 태그**: `return-prediction` · `machine-learning` · `random-matrix-theory` · `ridge-regression`
- **보조 태그**: `random-fourier-features` · `market-timing` · `benign-overfit` · `high-dimensional-regression` · `kelly-asset-pricing` · `JF-2024`

---

## 코드·데이터 공개

- **공식 코드**: JF 의 Supporting Information 에 Replication Code (S1) 게재. AQR/Yale 저자 페이지에서 추가 자료.
- **데이터**: CRSP value-weighted index 월별 초과수익 1926–2020. 15 predictor variables from Goyal & Welch (2008): dfy, infl, svar, de, lty, tms, tbl, dfr, dp, dy, ltr, ep, b/m, ntis + 1-lag market return. 모두 공개 데이터.
- **재현성**: 데이터+방법론 공개 — 본 해체의 Python 코드 ([12_code.md](12_code.md)) 로 RFF 생성 + ridge regression + recursive OOS + SR ≈ 0.47/year (T=12, c=1000, z=10³) 재현 가능.

---

## 한 줄 판결

> **Occam's razor 가 자산가격 예측에서는 Occam's blunder. 직관과 정반대로, 파라미터 수가 표본 크기를 훨씬 초과하는 (P ≫ T) ridgeless / ridge 회귀의 OOS Sharpe ratio 는 모델 복잡도 c=P/T 에 대해 단조 증가한다. Random Matrix Theory 의 Stieltjes transform + Marchenko-Pastur 분포로 이 'virtue of complexity' 를 일반 (misspecified) 환경에서 증명 (Theorem 1). Goyal-Welch 15 predictor 위에 Random Fourier Feature 로 P=12,000 까지 확장한 wide neural network 가 1926-2020 CRSP 시장수익 예측에서 buy-and-hold 대비 OOS Sharpe ratio ≈ 0.47/year (t ≈ 4.5), IR ≈ 0.31 (t ≈ 2.5) — Campbell-Thompson nonnegativity constraint 없이도 14/15 NBER recessions 에서 자동 divest. R² 가 음수 (-100% 이하) 라도 timing 전략이 양의 economic value 를 낼 수 있음을 이론·실증으로 정립한, 머신러닝 자산운용의 이론적 정당화.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 8개 개념 |
| [02_abstract.md](02_abstract.md) | 제목·Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Introduction (p.459–465) — Goyal-Welch 비관 vs ML 약속 |
| [04_environment.md](04_environment.md) | Section I — Assumptions 1–4, timing 전략, Proposition 1 |
| [05_method_a_rmt.md](05_method_a_rmt.md) | Section II — Ridge regression + Stieltjes transform + Proposition 2 |
| [05_method_b_correct.md](05_method_b_correct.md) | Section III — Propositions 3·4 (correctly specified VoC) |
| [05_method_c_misspec.md](05_method_c_misspec.md) | Section IV — Propositions 5·6 + **Theorem 1** (Virtue of Complexity) |
| [06_simulation.md](06_simulation.md) | 이론 시뮬레이션 — Figures 1–6 calibrated curves |
| [07_empirical.md](07_empirical.md) | Section V — CRSP 1926–2020, RFF, Figures 7–11, **Table I** |
| [08_conclusion.md](08_conclusion.md) | Section VI 풀이 + Box 인용 + Occam 의 blunder |
| [09_appendix_proof.md](09_appendix_proof.md) | 핵심 증명 — Proposition 2 (Stieltjes identity) + Theorem 1 (monotonicity) |
| [10_glossary.md](10_glossary.md) | 용어집 + 표기 사전 (Ψ, m, ξ, c, q, z, β, b_*) |
| [11_insights.md](11_insights.md) | 메타 통찰 12개 |
| [12_code.md](12_code.md) | Python 실행 — RFF + recursive ridge OOS + Sharpe 계산 |
| [13_diagrams.md](13_diagrams.md) | ASCII 도식 + viz 카탈로그 |
| [14_references.md](14_references.md) | References 풀이 — paper 가 인용하는 70+ 작품 |

---

## 인터랙티브 시각화 (9종)

| viz type | 챕터 | 내용 |
|----------|------|------|
| `voc-r2-curve` | 06 | Fig 1 — 이론 OOS R² vs c, ridge z 슬라이더 |
| `voc-sharpe-curve` | 06 | Fig 3 — 이론 Sharpe ratio vs c, z 슬라이더 |
| `voc-misspec-monotone` ★ | 05c, 06 | Fig 6 — Theorem 1 단조 증가 (misspecified, c=10), z 슬라이더 (preview viz) |
| `rppca-mp-spectrum` | 05a | Marchenko-Pastur 분포 + spike (Section II) |
| `voc-rff-mechanism` | 07 | Equation 20 — G_t (15-dim) → S_t = [sin(γω'G), cos(γω'G)] 변환 |
| `voc-empirical-sharpe` | 07 | Fig 8 — 실증 Sharpe / α / IR / t-stat vs c, T 토글 (12/60/120) |
| `voc-empirical-positions` | 07 | Fig 10 — timing position 시계열 + NBER recessions 음영 |
| `voc-variable-importance` | 07 | Fig 11 — 15 predictor 의 R² + Sharpe VI bars |
| `voc-comparison-table1` | 07 | Table I — Linear ridgeless / Linear ridge / Nonlinear ML × 3 T |

전체 카탈로그는 [13_diagrams.md](13_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | 페이지 (JF) | 내용 |
|------|------------|------|
| `figures/page18_Fig1_R2_norm.png` | p.476 | Fig 1 — 이론 OOS R² + ‖β‖ vs c (correctly specified, Ψ=I, b_*=0.2) |
| `figures/page20_Fig2_E_Vol.png` | p.478 | Fig 2 — 이론 Expected return + Volatility vs c (correctly specified) |
| `figures/page21_Fig3_sharpe.png` | p.479 | Fig 3 — 이론 OOS Sharpe ratio vs c |
| `figures/page27_Fig4_R2_misspec.png` | p.485 | Fig 4 — 이론 R² + ‖β‖ vs cq (misspecified, c=10) |
| `figures/page27_Fig5_E_Vol_misspec.png` | p.485 | Fig 5 — 이론 Expected return + Volatility vs cq (misspecified, monotone increasing in cq) |
| `figures/page28_Fig6_misspec_monotone.png` | p.486 | Fig 6 — 이론 OOS Sharpe (misspecified, c=10) — **단조 증가, Theorem 1 의 시각화** |
| `figures/page32_Fig7_T12_panels.png` | p.490 | Fig 7 — 실증 R² + ‖β̂‖ + Expected Return + Volatility (T=12, P up to 12,000) |
| `figures/page33_Fig8_empirical_sharpe.png` | p.491 | Fig 8 — 실증 Sharpe / α / IR / t-stat (T=12) |
| `figures/page34_Fig9_T60_120.png` | p.492 | Fig 9 — 실증 IR + t-stat (T=60, 120) |
| `figures/page35_Fig10_positions_recession.png` | p.493 | Fig 10 — Market timing positions + NBER recessions (14/15 자동 divest) |
| `figures/page38_Fig11_var_importance.png` | p.496 | Fig 11 — 15 predictor 의 Variable Importance (R² bars + Sharpe line) |
