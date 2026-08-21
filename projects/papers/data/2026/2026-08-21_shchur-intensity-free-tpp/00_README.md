# Intensity-Free Learning of Temporal Point Processes

**한국어 제목**: 강도함수 없이 시간점과정을 학습하기

- **저자**: Oleksandr Shchur, Marin Biloš, Stephan Günnemann
- **소속**: Technical University of Munich, Germany (`{shchur,bilos,guennemann}@in.tum.de` — 원문 저자 블록 verbatim)
- **발표처·연도**: ICLR 2020 (arXiv Comments 필드 verbatim: "International Conference on Learning Representations (ICLR) 2020")
- **Canonical identifier**: `arXiv:1909.12127` (v1 2019-09-26 / v2 2020-01-23) · DOI `10.48550/arXiv.1909.12127` · OpenReview forum `HygOjhEYDH`

## Source Lock

| 항목 | 값 |
|---|---|
| Canonical identifier | arXiv:1909.12127 (arXiv abs 메타에서 제목·저자·Comments·Subjects·제출이력 확인) |
| 1차 소스 (본문) | `https://ar5iv.labs.arxiv.org/html/1909.12127` — arXiv 전문 렌더링, 절 번호·식 번호·표 번호·부록까지 전체 접근 |
| 메타 대조 | `https://arxiv.org/abs/1909.12127` (제목·저자·Comments "ICLR 2020"·Subjects cs.LG/stat.ML·버전 이력 일치) |
| 접근 실패 | OpenReview forum `HygOjhEYDH` → 브라우저 검증 화면으로 차단. **따라서 Spotlight/Poster 등 세부 결정 등급은 단정하지 않는다** (저자 GitHub README의 "Spotlight" 표기는 2차 소스이므로 근거로 쓰지 않음) |
| §4-bis 3문 | **통과** — Q1 초록 첫 문장 / Q2 **Table 4** (Appendix F.1) "Time prediction test NLL on real-world data." LogNormMix Reddit **10.19 ± 0.078** / Q3 방법 절 **§3.2 "Modeling p(τ) with mixture distributions"** + **식 (2)** 로그정규 혼합 밀도 |

## 태그

- 주 태그: `point-process` (원거리 버킷 §F, 마지막 커버 2026-06-05)
- 보조 태그: `probabilistic-forecast`, `non-stationarity-ts` (카운터는 주 태그만 증가)

## 코드·데이터

원문 verbatim: "Code and datasets are available under https://github.com/shchur/ifl-tpp" — 코드·데이터 모두 공개.

## 한 줄 판결

**강도함수(intensity)를 파라미터화하지 말고 사건 간 간격의 분포를 직접 모델링하라 — 로그정규 혼합 헤드 하나로 "유연성 · 닫힌형 우도 · 닫힌형 샘플링 · 닫힌형 기댓값" 네 가지를 동시에 얻는다는 이 논문의 설계 논지는 확률 예측 헤드 설계에 그대로 이식할 수 있고, 반대로 이 논문의 실험표(Table 4)는 그 우위를 표준편차보다 작은 차이로만 보여준다 — 방법론은 핀으로 꽂고, 실증은 반면교사로 꽂는다.**

## 목차

| 섹션 | 파일 |
|---|---|
| 0. 메타 & 선정 이유 | [01_meta.md](01_meta.md) |
| 1. 3층 TL;DR | [02_tldr.md](02_tldr.md) |
| 2. 문제 지형도 | [03_problem.md](03_problem.md) |
| 3. 핵심 Claim 해체 (a) 밀도 > 강도 | [04_claims_a_density_over_intensity.md](04_claims_a_density_over_intensity.md) |
| 3. 핵심 Claim 해체 (b) 혼합 ≥ 흐름 | [04_claims_b_mixture_vs_flows.md](04_claims_b_mixture_vs_flows.md) |
| 4. 방법론 해부 (a) 큰 그림 | [05_method_a_intuition.md](05_method_a_intuition.md) |
| 4. 방법론 해부 (b) TPP 배경 수식 | [05_method_b_tpp_background.md](05_method_b_tpp_background.md) |
| 4. 방법론 해부 (c) 정규화 흐름 | [05_method_c_flows.md](05_method_c_flows.md) |
| 4. 방법론 해부 (d) 로그정규 혼합 | [05_method_d_lognormmix.md](05_method_d_lognormmix.md) |
| 4. 방법론 해부 (e) 조건부 정보 주입 | [05_method_e_conditioning.md](05_method_e_conditioning.md) |
| 4. 방법론 해부 (z) 구현 디테일 | [05_method_z_implementation.md](05_method_z_implementation.md) |
| 5. 실험 해부 | [06_experiments.md](06_experiments.md) |
| 6. 가정·한계·반박 | [07_limits.md](07_limits.md) |
| 7. 이론적 계보 | [08_lineage.md](08_lineage.md) |
| 8. 내 연구와의 연결 | [09_my_research.md](09_my_research.md) |
| 9. 사고 확장 (a) 자문 질문 | [10_extensions_a_questions.md](10_extensions_a_questions.md) |
| 9. 사고 확장 (b) follow-up 3편 | [10_extensions_b_followups.md](10_extensions_b_followups.md) |
| 9. 사고 확장 (c) 실험 아이디어 | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) |
| 10. 한 줄 판결 | [11_verdict.md](11_verdict.md) |
