# 2026-07-10 · 금 · 원거리 — Double/Debiased Machine Learning for Treatment and Structural Parameters

**한국어 번역**: 처치 효과 및 구조 모수 추정을 위한 이중/편향 제거 머신러닝

## 서지

- **저자**: Victor Chernozhukov(MIT Economics), Denis Chetverikov(UCLA Economics), Mert Demirer(MIT Sloan), Esther Duflo(MIT Economics · 2019 노벨경제학상), Christian Hansen(Chicago Booth), Whitney Newey(MIT Economics), James Robins(Harvard Biostatistics)
- **발표처**: *The Econometrics Journal* 21(1), pp. C1–C68 (2018-01-16)
- **선행 프리프린트**: arXiv:1608.00060 (2016-07-30 v1)
- **DOI**: `10.1111/ectj.12097`
- **NBER Working Paper**: w23564

## Source Lock

- **Canonical identifier**: arXiv:1608.00060 · DOI:10.1111/ectj.12097 · Oxford Academic *Econometrics Journal* 21(1) C1–C68 확정
- **본문 접근**: 본 환경에서 arXiv abs/PDF · onlinelibrary.wiley.com · academic.oup.com · dspace.mit.edu · NBER · ResearchGate · Semantic Scholar · Google Scholar · stats.ox.ac.uk (Evans APTS chapter) 모두 HTTP 403 차단
- **대체 소스**: (1) 저자 그룹 공식 후속작 arXiv:1701.08687 "Double/Debiased/Neyman Machine Learning of Treatment Effects" (동일 저자 5인 서브셋), (2) 저자 진영 공식 패키지 문서 `docs.doubleml.org/stable/guide/basics.html` + `algorithms.html` + `resampling.html`, (3) 저자 진영 공식 GitHub `DoubleML/doubleml-for-py` README + `DoubleML/doubleml-docs` `plm_models.inc`·`irm_models.inc`·`plr_model.rst`·`algorithms.rst` verbatim, (4) DoubleML R 패키지 CRAN reference `DoubleMLPLR`·`fetch_401k` 페이지, (5) WebSearch verbatim 인덱스 6회 (abstract·algorithm·score function·N=9915 401(k) 응용·Angrist–Krueger 1995 split-sample 배경) 로 method·algorithm·PLR/IRM/IIVM 정의·score function·cross-fitting·empirical application 검증
- **미확정 표시**: 본문 PDF Table 1–7 절대 수치 (401(k) ATE point estimate·표준오차·95% CI 소수점), Appendix 정확한 정리 진술·증명 단계, Figure 캡션 원문, seed·hyperparameter grid 세부는 본문 접근 실패 → 본 해체에서 "원문에 수치 미보고" 로 처리

## 태그

- **주 태그**: `causal-ml-finance` (원거리 버킷, 커버 수 0 → 1 로 첫 개시)
- **보조 태그**: `training-dynamics` cross (regularization bias 를 √n-rate consistency 관점에서 재정식화하는 학습 동학 논의)

## 코드·데이터 공개

- **저자 진영 공식 구현**: DoubleML (`DoubleML/doubleml-for-py` Python; `DoubleML/doubleml-for-r` R; MIT-license). 401(k) 데이터셋은 `fetch_401k` 로 재현 가능.
- **커뮤니티 구현**: `EconML` (Microsoft Research), `ddml` (Stata, arXiv:2301.09397).

## 한 줄 판결

> **머신러닝 예측기의 편향을 인과 모수 θ 로부터 "직교화" 로 격리해 √n-일치성을 회수하는 프레임워크 — Neyman orthogonality + K-fold cross-fitting 이라는 두 축의 조합이 이후 EconML·DoubleML·CausalML 계열 전 생태계의 문법을 정한 canonical 논문. P1 ProTran-TFA 의 factor 회귀 alpha 검정과 2022AEL tactical allocation 의 macro covariate 조정에 직접 이식 가능한 도구.**

## 목차

- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 전체 흐름
- [05_method_b_regularization_bias.md](05_method_b_regularization_bias.md) — 방법론: 정규화 편향의 정체
- [05_method_c_neyman_orthogonality.md](05_method_c_neyman_orthogonality.md) — 방법론: Neyman 직교성
- [05_method_d_cross_fitting.md](05_method_d_cross_fitting.md) — 방법론: 교차적합
- [05_method_e_models_and_scores.md](05_method_e_models_and_scores.md) — 방법론: PLR/PLIV/IRM/IIVM 4 모델과 점수
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 사고 확장: 자문 질문
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — 사고 확장: Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 사고 확장: 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
