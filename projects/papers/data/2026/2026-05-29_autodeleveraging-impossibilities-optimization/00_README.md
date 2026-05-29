# 00 · 표지 & 내비게이션

## 논문 정보

| 항목 | 내용 |
|------|------|
| **원문 제목** | Autodeleveraging: Impossibilities and Optimization |
| **한국어 번역** | 자동손실사회화: 불가능성과 최적화 |
| **저자** | Anonymous ("pluriholonomic") — 필명, 소속 미공개 |
| **발표처 · 연도** | arXiv preprint, December 2025 |
| **Canonical identifier** | arXiv:2512.01112 |
| **태그** | `crypto-ml` (주), `market-microstructure` (부) |
| **코드·데이터** | 전체 재현 코드 + HyperReplay 블록체인 데이터 공개 (GitHub: `pluriholonomic/autodeleveraging-analysis`) |

## Source Lock 확인

- **Canonical identifier**: arXiv:2512.01112 (저자 GitHub README에서 확인)
- **공식 원문 URL**: https://github.com/pluriholonomic/autodeleveraging-analysis (전체 LaTeX 소스)
- **확인한 원문 버전**: `paper/main_corrected.tex` (git commit `aae0be8`)
- **본문 접근 여부**: raw.githubusercontent.com을 통해 전체 LaTeX 직접 열람 ✓
- **주의**: arXiv.org 직접 접근 차단(403) → 저자 공식 GitHub를 대체 소스로 사용. 메타데이터(제목·내용·arXiv ID)는 저자 자신이 README에 명기.

## Evidence Map (Source Lock §4)

| 근거 유형 | 원문 위치 |
|-----------|-----------|
| 핵심 Claim (Trilemma) | §5, Theorem 1 |
| 핵심 Claim (Pro-rata 유일성) | §5, Theorems 2–3 |
| 핵심 Claim (도덕적 해이 스케일링) | §5, negative result |
| 방법론 수식 (ADL 형식화) | §2–§4, 정의군 |
| 실험 데이터·수치 | §6, October 10, 2025 Hyperliquid |
| 한계 | 논문 말미 §6 conclusion |

## 한 줄 판결

> **불가능성 증명이 크립토 시장설계를 재정의한다** — ADL 트릴레마는 머신러닝의 No-Free-Lunch와 같은 위상의 결과이며, Hyperliquid 사례는 "최적에서 28배 과잉 적용"이라는 충격적 실증을 제공한다. 원거리 버킷이지만 AETHER 프로젝트의 설계 전제를 완전히 뒤집을 수 있는 논문.

## 목차

| 파일 | 섹션 |
|------|------|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR |
| [03_problem.md](03_problem.md) | 문제 지형도 |
| [04_claims_a_trilemma.md](04_claims_a_trilemma.md) | Claim 1–2: 트릴레마 & 도덕적 해이 |
| [04_claims_b_fairness.md](04_claims_b_fairness.md) | Claim 3–4: 공정성 & 강건 최적화 |
| [05_method_a_model.md](05_method_a_model.md) | 방법론 A: 형식 모델 |
| [05_method_b_mechanisms.md](05_method_b_mechanisms.md) | 방법론 B: ADL 메커니즘 클래스 |
| [05_method_c_algorithms.md](05_method_c_algorithms.md) | 방법론 C: 알고리즘 (미러 강하·볼록 쌍대) |
| [06_experiments.md](06_experiments.md) | 실험 해부 |
| [07_limits.md](07_limits.md) | 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 |
