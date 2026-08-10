# Locating and Editing Factual Associations in GPT (ROME)

**한국어 제목:** GPT 안에서 사실 연관 관계를 찾아내고 편집하기

---

## 서지

| 항목 | 내용 |
|---|---|
| 저자 | Kevin Meng\* (MIT CSAIL), David Bau\* (Northeastern University), Alex Andonian (MIT CSAIL), Yonatan Belinkov† (Technion – IIT) |
| \* / † | \* 공동 제1저자(Equal contribution) · † Technion Viterbi Fellowship 지원 |
| 발표처 | 36th Conference on Neural Information Processing Systems (**NeurIPS 2022**) |
| canonical identifier | **arXiv:2202.05262** (v1 2022-02-10 → **v5 2023-01-13**) |
| arXiv comments | "NeurIPS 2022. 35 pages, 30 figures." |
| 공식 프로젝트 | https://rome.baulab.info/ (논문 초록 말미에 명시) |

## Source Lock

- **canonical identifier**: arXiv:2202.05262
- **확인한 원문 버전**: `arxiv.org/pdf/2202.05262v5` — 로컬 다운로드 후 `pdftotext -layout` 전문 변환 (본문 + Appendix A~J 전체)
- **본문 접근 여부**: **성공 (1차 소스)**. 초록 / §1~§6 / Eqn.(1)~(17) / Table 1~6 / Figure 1~30 / Appendix A·B·D·E·F·G·I·J 위치를 모두 눈으로 확인
- **메타데이터 일치**: arXiv abs 페이지에서 제목·저자 4인·버전 이력·"NeurIPS 2022" journal ref 일치 확인
- **§4-bis 3문 자기시험**: **통과**
  - **Q1** 초록 첫 문장 verbatim — "We analyze the storage and recall of factual associations in autoregressive transformer language models, finding evidence that these associations correspond to localized, directly-editable computations."
  - **Q2** 주 결과 표 = **Table 4** (Quantitative Editing Results), GPT-2 XL **ROME Score S = 89.2**, Neighborhood Score **NS = 75.4 (0.7)** verbatim
  - **Q3** 방법 절 = **§3.1** (Rank-One Model Editing), **Eqn. 2** `minimize ‖ŴK − V‖ such that Ŵk∗ = v∗ by setting Ŵ = W + Λ(C⁻¹k∗)ᵀ` verbatim

## 태그

- **주 태그**: `causal-intervention` (코어 버킷 최장 공백 — 직전 2026-06-15 IOI Circuit)
- **보조 태그**: `mech-interp-circuits`

## 코드·데이터 공개

공개. 논문 초록과 §5 결론이 코드·데이터셋·시각화·인터랙티브 노트북을 https://rome.baulab.info 에 오픈소스로 공개했다고 명시. C OUNTER FACT 데이터셋(21,919 records)도 함께 공개.

---

## 한 줄 판결

> **"어텐션 가중치를 들여다보는 해석"과 "가중치를 직접 바꿔 반증하는 해석" 사이의 경계선을 그은 논문 — 상관을 인과로 바꾸는 2단 프로토콜(추적 → 편집)을 통째로 훔쳐올 것.**

---

## 목차

| 파일 | 섹션 |
|---|---|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims_a_localization.md](04_claims_a_localization.md) | 3-A. Claim 해체 — 국소화 |
| [04_claims_b_editing.md](04_claims_b_editing.md) | 3-B. Claim 해체 — 편집 가능성 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4-A. 방법론 — 큰 그림 |
| [05_method_b_causal_tracing.md](05_method_b_causal_tracing.md) | 4-B. 방법론 — Causal Tracing |
| [05_method_c_rank_one_update.md](05_method_c_rank_one_update.md) | 4-C. 방법론 — Rank-One 업데이트 |
| [05_method_d_key_value.md](05_method_d_key_value.md) | 4-D. 방법론 — k\*·v\* 결정 |
| [05_method_z_implementation.md](05_method_z_implementation.md) | 4-Z. 구현 디테일 |
| [06_experiments_a_benchmarks.md](06_experiments_a_benchmarks.md) | 5-A. 실험 — zsRE·C OUNTER FACT |
| [06_experiments_b_localization.md](06_experiments_b_localization.md) | 5-B. 실험 — 국소화 교차검증 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9-A. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9-B. Follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9-C. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
