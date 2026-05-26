# 00 README — Estimating Latent Asset-Pricing Factors (RP-PCA)

> **🧒 한 줄 요약**: 본 deep dive 입구. Lettau-Pelger RP-PCA = risk-premium-aware factor extraction의 founding paper.


## 원문 정보

**제목**: Estimating Latent Asset-Pricing Factors

**한국어 제목**: 잠재 자산가격결정 요인 추정 — RP-PCA

**저자**: Martin Lettau¹, Markus Pelger²
¹UC Berkeley Haas School of Business · ²Stanford University, Management Science & Engineering

**발표처·연도**: NBER Working Paper No. 24618 (May 2018, revised Jun 2018) → *Journal of Econometrics* (2020)

**Canonical identifier**: NBER w24618 · DOI: 10.3386/w24618

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | NBER w24618, JoE 2020 |
| Metadata match | ✅ | 제목·저자·연도·venue 일치 (NBER + author homepages 교차 확인) |
| Full text access | ✅ | NBER PDF 직접 다운로드 — `Lettau_Pelger_2020_Estimating_Latent_Asset_Pricing_Factors.pdf` (44쪽 전문) |
| Evidence map | ✅ | 정리 1·2·Lemma 1·2·Corollary 1·2·3·Example 1·2·3·Table 1·2·Figures 1–9 원문 위치 확인 |

---

## 태그

- **주 태그**: `asset-pricing` · `factor-models`
- **보조 태그**: `random-matrix-theory` · `weak-factors` · `PCA-generalization`

---

## 코드·데이터 공개

- **공식 코드**: 별도 공개 패키지 없음. 본 해체에 동작 가능한 Python 5줄 구현 + 시뮬레이션 스크립트 포함 ([12_code.md](12_code.md))
- **데이터**: Kozak, Nagel & Santosh (2017) 의 N=370 anomaly decile portfolios, 1963/07–2017/12 (T=650), Kenneth French의 무위험수익률
- **재현성**: 데이터셋 공개. 본 해체의 Python 코드로 SR 2배 결과 재현 가능

---

## 한 줄 판결

> **통계학(보편 도구)과 자산가격이론(특수 prior)의 60년 분리를 끝낸 사례. PCA에 평균(위험프리미엄) 페널티를 더한 단순 변형으로 PCA가 영원히 못 잡는 약한+높은 SR 요인을 검출, 실증에서 Sharpe-ratio 2배. RP-PCA의 사상 — "도메인 prior를 정규화로 끼워넣기" — 은 자산가격을 넘어 모든 응용 분야에 일반화 가능.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_intro.md](01_intro.md) | 시작하기 전에 — 미리 알아둘 개념 |
| [02_abstract.md](02_abstract.md) | 제목과 초록 풀어 읽기 |
| [03_motivation.md](03_motivation.md) | Section 1 — 왜 이런 연구가 필요한가 |
| [04_factor_model.md](04_factor_model.md) | Section 2 — 요인 모델이란 무엇인가 |
| [05_method_a_objective.md](05_method_a_objective.md) | Section 3 전반 — RP-PCA의 정의 |
| [05_method_b_four_views.md](05_method_b_four_views.md) | Section 3 후반 — 4가지 해석 |
| [05_method_c_strong.md](05_method_c_strong.md) | Section 4 — 강한 요인 모델 이론 |
| [05_method_d_rmt.md](05_method_d_rmt.md) | Section 5 전반 — 랜덤 행렬 이론 입문 |
| [05_method_e_theorem2.md](05_method_e_theorem2.md) | Section 5 중반 — Theorem 2와 Lemma 2 |
| [05_method_f_examples.md](05_method_f_examples.md) | Section 5 후반 — Example 2, 3 |
| [06_simulation.md](06_simulation.md) | Section 6 — 시뮬레이션 검증 |
| [07_empirical.md](07_empirical.md) | Section 7 — 실증 분석 (Sharpe-ratio 2배) |
| [08_conclusion.md](08_conclusion.md) | Section 8 — 결론과 종합 정리 |
| [09_appendix_proof.md](09_appendix_proof.md) | Appendix B — Theorem 2 증명 풀이 |
| [10_glossary.md](10_glossary.md) | 용어집과 표기법 사전 |
| [11_insights.md](11_insights.md) | 통찰과 추론 — "이해를 넘어서" (12개) |
| [12_code.md](12_code.md) | 실행 코드와 시뮬레이션 (Python) |
| [13_diagrams.md](13_diagrams.md) | 핵심 도식 모음 + 인터랙티브 viz 카탈로그 |

---

## 인터랙티브 시각화 (8종)

본 해체는 다음 인터랙티브 시각화를 챕터 안에 인라인으로 포함:

| viz type | 챕터 | 내용 |
|----------|------|------|
| `rppca-phase-transition` | 03, 05e | θ vs ρ² 검출 임계값 + γ 슬라이더 |
| `rppca-signal-strengthening` | 05a, 05b | 분산 + 평균 신호 적층 (γ 슬라이더로 임계 돌파) |
| `rppca-mp-spectrum` | 05d, 05f | Marchenko-Pastur 분포 + spike |
| `rppca-sharpe-comparison` | 07 | Table 1 막대그래프 (K=3/5, IS/OOS) |
| `rppca-factor-path` | 06 | Figure 1 재현 (약한 요인 검출) |
| `rppca-eigenvalue-spectrum` | 07 | Figure 9 재현 (γ별 고유값) |
| `rppca-corr-heatmap` | 07 | 4×4 추정-진짜 상관 행렬 |
| `rppca-one-factor-correlation` | 05e | Example 2 한계 곡선 |

전체 카탈로그는 [13_diagrams.md](13_diagrams.md).

---

## 원문 Figure 발췌

| 파일 | 페이지 | 내용 |
|------|--------|------|
| `figures/page19_Figure1.png` | p.19 | 4-요인 시뮬 path (Figure 1) |
| `figures/page22_Figure4.png` | p.22 | 이론 vs Monte-Carlo 상관 (Figure 4) |
| `figures/page23_Figure5.png` | p.23 | ρ² 곡선 (Figure 5) |
| `figures/page27_Figure8.png` | p.27 | 실증 γ 효과 (Figure 8) |
| `figures/page28_Figure9.png` | p.28 | 실증 eigenvalue (Figure 9) |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 권장 학습 path?**
2. **RP-PCA의 risk-premium-aware 의의?**
3. **6년 후 DL era 영향?**

### 답변

1. **선형 path**: 02 → 03 → 04 → 05a-b → 07 → 15.

2. **Risk-premium-aware factor framework의 founding**. PCA variance-only → RP-PCA = variance + risk premium. Pricing-relevant factors 직접 추출.

3. **DL extensions의 theoretical ancestor**. Gu-Kelly-Xiu AE, Chen-Pelger-Zhu의 risk-premium 핵심 인사이트 = RP-PCA에서 유래.
