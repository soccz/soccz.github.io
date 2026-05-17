# 00 README — Autoencoder Asset Pricing Models

## 원문 정보

**제목 (영문)**: Autoencoder Asset Pricing Models

**제목 (한국어)**: 오토인코더 자산가격결정 모델 — IPCA의 비선형 일반화

**저자**: Shihao Gu¹, Bryan Kelly², Dacheng Xiu¹
¹Booth School of Business, University of Chicago · ²Yale University, AQR Capital Management, NBER

**발표처·연도**: Journal of Econometrics 222 (2021) 429-450 (Available online 29 July 2020)

**Canonical identifier**: DOI: 10.1016/j.jeconom.2020.07.009

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | DOI 10.1016/j.jeconom.2020.07.009, Elsevier 공식 |
| Metadata match | ✅ | 제목·저자·연도·venue 일치 (Elsevier + author affiliation 교차) |
| Full text access | ✅ | PDF 22쪽 전문 (p.429–450) |
| Evidence map | ✅ | Proposition 1·2, Eq. (1)–(22), Table 1–6, Fig. 1–6, Algorithm 1–3 위치 확인 |

---

## 태그

- **주 태그**: `asset-pricing` · `machine-learning` · `autoencoder`
- **보조 태그**: `nonlinear-factor-model` · `IPCA-generalization` · `neural-networks` · `conditional-beta`

---

## 코드·데이터 공개

- **공식 코드**: 별도 공개 패키지 없음 (저자 Github 미공개). 본 해체에 Python (Keras/TF 또는 PyTorch) 동작 코드 포함.
- **데이터**: CRSP 개별 주식 1957/03–2016/12 (60년), 94개 firm characteristics — Gu, Kelly, Xiu (2019, RFS) 데이터셋과 동일
- **재현성**: 데이터 공개 (Kenneth French + CRSP 학술 라이센스). 본 해체의 Python 코드로 conditional autoencoder 재현 가능 (단 NaN 처리·rolling window 등 디테일은 원논문 참조).

---

## 한 줄 판결

> **IPCA (Kelly·Pruitt·Su 2019) 의 선형성 가정을 β-network 만 신경망으로 풀고 f-network 는 단일 선형층으로 유지한 자연스러운 일반화. β(z)·f 의 dot product 로 r = β'f 형태 유지 — no-arbitrage 보존. 실증에서 long-short VW Sharpe (K=6) — FF −0.53 / PCA −0.08 / IPCA 0.96 / CA1 1.40 / CA2 1.53 / CA3 1.51. autoencoder 가 PCA 의 ML 시대 후예라는 사실을 자산가격결정에 결정적으로 적용한 사례.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 개념 |
| [02_abstract.md](02_abstract.md) | 제목과 Abstract 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 왜 비선형 자산가격결정 모델이 필요한가 |
| [04_factor_model.md](04_factor_model.md) | KPS factor model — 출발점 (Eq. 1, 2) |
| [05_method_a_standard_AE.md](05_method_a_standard_AE.md) | Section 2.1 — 표준 autoencoder + PCA 등가성 (Proposition 1) |
| [05_method_b_conditional_AE.md](05_method_b_conditional_AE.md) | Section 2.2 — Conditional autoencoder (두 신경망 구조) |
| [05_method_c_IPCA_special.md](05_method_c_IPCA_special.md) | Section 2.2.1 — IPCA 가 특수 케이스 (Proposition 2) |
| [05_method_d_regularization.md](05_method_d_regularization.md) | Section 2.3 — LASSO, early stopping, ensemble, Adam, batch norm |
| [06_empirical_data_models.md](06_empirical_data_models.md) | Section 3.1, 3.2 — CRSP 60년, 94 characteristics, 모델 비교 set (FF, PCA, IPCA, CA0–CA3) |
| [07_empirical_R2_sharpe_alpha.md](07_empirical_R2_sharpe_alpha.md) | Section 3.3, 3.4, 3.5 — 통계·경제·misprice 평가 (Table 1, 2, 3, 4; Fig. 3) |
| [08_empirical_characteristics.md](08_empirical_characteristics.md) | Section 3.6, 3.7 — 특성 중요도 + robustness (Fig. 4, 5, 6; Table 5) |
| [09_simulation.md](09_simulation.md) | Section 4 — Monte Carlo (linear vs nonlinear factor loadings, Table 6) |
| [10_conclusion.md](10_conclusion.md) | Section 5 — 결론과 종합 |
| [11_appendix_proofs.md](11_appendix_proofs.md) | Appendix A — Proposition 1, 2 증명 (PCA·IPCA 등가성) |
| [12_glossary.md](12_glossary.md) | 용어집과 표기법 사전 |
| [13_insights.md](13_insights.md) | 통찰·추론 12개 — "이해를 넘어서" |
| [14_code.md](14_code.md) | 실행 코드 (PyTorch CA1 구현 + 시뮬) |
| [15_diagrams.md](15_diagrams.md) | ASCII 도식 + 인터랙티브 viz 카탈로그 |

---

## 인터랙티브 시각화 (8종 인라인 + 카탈로그)

본 해체는 다음 viz 를 챕터 안에 인라인:

| viz type | 챕터 | 내용 |
|----------|------|------|
| `rppca-sharpe-comparison` | 07 | OOS Sharpe ratio 막대 (FF / PCA / IPCA / CA1-3, K=1-6) |
| `rppca-corr-heatmap` | 07 | factor recovery — 추정 factor 와 진짜 factor 상관 |
| `rppca-factor-path` | 09 | Monte Carlo 시뮬 path (linear vs nonlinear) |
| `rppca-eigenvalue-spectrum` | 09 | factor signal strength (K=1-6) |
| `rppca-one-factor-correlation` | 03 | static vs conditional factor model 비교 |
| `rppca-phase-transition` | 09 | linear→nonlinear truth 에서 IPCA vs CA 검출 |
| (신규 viz 후보) `nn-loss-landscape` | 05d | early stopping + LASSO 효과 |
| (신규 viz 후보) `characteristic-importance` | 08 | Fig. 4·5 bar/heatmap 인터랙티브 |

→ 전체 카탈로그는 [15_diagrams.md](15_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | journal p. | 내용 | 삽입 챕터 |
|------|----|------|-----------|
| `figures/page4_Fig1_autoencoder.png` | p.432 | Fig. 1 — Standard autoencoder 도식 (encoder/bottleneck/decoder) | ch05a |
| `figures/page5_Fig2_conditional_AE.png` | p.433 | Fig. 2 — **Conditional autoencoder** (β-net + f-net + dot product). 본 논문 핵심 | ch05b |
| `figures/page13_Fig3_pricing_errors.png` | p.441 | Fig. 3 — OOS α scatter (95 managed portfolios). FF5: 37 vs CA2: 8 (\|t\|>3) | ch07 |
| `figures/page14_Fig4_top20_chars.png` | p.442 | Fig. 4 — Top 20 variable importance (CA0–CA3 별, K=5). price trend + liquidity + risk | ch08 |
| `figures/page15_Fig5_all94_heatmap.png` | p.443 | Fig. 5 — 94 특성 전체 ranking heatmap (IPCA + CA0–CA3) | ch08 |
| `figures/page17_Fig6_separate_importance.png` | p.445 | Fig. 6 — β-net vs factor-net 분리 importance. 두 panel 의 ranking 거의 일치 | ch08 |
