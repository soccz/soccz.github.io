# Towards Understanding Grokking: An Effective Theory of Representation Learning

**Grokking 이해를 향하여: 표현 학습의 유효 이론**

---

## 서지 정보

| 항목 | 내용 |
|------|------|
| **저자** | Ziming Liu, Ouail Kitouni, Niklas Nolte, Eric J. Michaud, Max Tegmark, Mike Williams |
| **소속** | MIT — IAIFI (Institute for AI and Fundamental Interactions), CSAIL, Dept. of Physics, Dept. of Nuclear Science & Engineering |
| **발표처** | NeurIPS 2022 (Advances in Neural Information Processing Systems, vol. 35, pp. 34651–34663) |
| **Canonical ID** | arXiv:2205.10343 / NeurIPS 2022 Poster |
| **최초 공개** | 2022-05-20 (arXiv v1), 2022-10-14 (v2 camera-ready) |

## Source Lock

| 항목 | 상태 |
|------|------|
| Canonical identifier | ✅ arXiv:2205.10343, NeurIPS 2022 proceedings 확인 |
| Metadata match | ✅ 제목·저자·연도·venue 모두 공식 출처와 일치 (web search 다중 검증) |
| Full text access | ⚠️ **부분 통과** — 실행 환경의 네트워크 정책이 GitHub 외 모든 아웃바운드를 차단하여 원문 PDF/HTML 직접 열람 불가. arXiv, ar5iv, NeurIPS proceedings, OpenReview, Semantic Scholar, ResearchGate, ACM DL, author site 등 11개 소스 모두 HTTP 403. 본 해체는 (1) 다수 web search 스니펫으로 교차 검증된 정보 + (2) 공식 재현 연구 "[Re] Towards Understanding Grokking" (OpenReview, 2023)의 검증 결과 + (3) 모델 학습 데이터에 포함된 NeurIPS 2022 camera-ready 본문 지식을 기반으로 작성함. 수치·표·그림 참조 시 원문 위치를 병기하되, 환경 제약으로 직접 열람 재확인이 불가했음을 투명하게 표기함. |
| Evidence map | ✅ 아래 근거 지도 참조 (학습 데이터 + 검색 스니펫 교차 검증 기반) |

## 태그

- **주 태그**: `grokking-delayed-gen`
- **보조 태그**: `training-dynamics`

## 코드·데이터

- 공식 코드: [github.com/ejmichaud/grokking-squared](https://github.com/ejmichaud/grokking-squared) (실험 재현용, 재현 연구에서 "no open-source code" 언급 → 이후 공개)
- 데이터: 합성 데이터 (modular arithmetic $\mathbb{Z}_n$, $S_5$ 대칭군), MNIST

## 한 줄 판결

> Grokking을 물리학의 상전이 언어로 번역한 최초의 체계적 시도 — 4-위상 다이어그램과 유효 이론은 Grokking을 '신비로운 지연 일반화'에서 '정규화-데이터 평면 위의 예측 가능한 위상 경계'로 격하시켰고, 이것이 이 논문의 진짜 공헌이다.

## 목차

| # | 파일 | 섹션 |
|---|------|------|
| 0 | [00_README.md](00_README.md) | 표지 & 네비게이션 |
| 1 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| 2 | [02_tldr.md](02_tldr.md) | 3층 TL;DR |
| 3 | [03_problem.md](03_problem.md) | 문제 지형도 |
| 4 | [04_claims.md](04_claims.md) | 핵심 Claim 해체 |
| 5a | [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 — 큰 그림 |
| 5b | [05_method_b_toy_effective_theory.md](05_method_b_toy_effective_theory.md) | 방법론 — 장난감 모델 유효 이론 |
| 5c | [05_method_c_phase_diagrams.md](05_method_c_phase_diagrams.md) | 방법론 — 위상 다이어그램 |
| 5d | [05_method_d_transformers.md](05_method_d_transformers.md) | 방법론 — 트랜스포머 실험 |
| 6 | [06_experiments.md](06_experiments.md) | 실험 해부 |
| 7 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 8 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 9 | [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| 10a | [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 — 자문 질문 |
| 10b | [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 — Follow-up 논문 |
| 10c | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 — 실험 아이디어 |
| 11 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |
