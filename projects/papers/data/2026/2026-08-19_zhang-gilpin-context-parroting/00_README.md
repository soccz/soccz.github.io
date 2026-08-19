# Context parroting: A simple but tough-to-beat baseline for foundation models in scientific machine learning

**한국어 제목**: 맥락 앵무새질 — 과학 기계학습 파운데이션 모델을 이기기 어려운 단순 베이스라인

---

## 서지

| 항목 | 내용 |
|---|---|
| 저자 | Yuanzhao Zhang (Santa Fe Institute), William Gilpin (University of Texas at Austin) |
| 발표처 | **ICLR 2026** (arXiv Comments: "International Conference on Learning Representations (ICLR 2026)") |
| canonical identifier | **arXiv:2505.11349** (v1 2025-05-16 / v2 2025-09-18 / **v3 2026-03-29**) |
| OpenReview | forum id **EUAXc9Hlvm** |
| Subjects | Machine Learning (cs.LG); Chaotic Dynamics (nlin.CD); Computational Physics (physics.comp-ph) |
| 코드·데이터 | 공개 — Reproducibility Statement: *"A Python implementation of the context parroting algorithm and the benchmarks are available at https://github.com/y-z-zhang/parroting"* |

## Source Lock

- **canonical identifier**: arXiv:2505.11349
- **확인한 원문 버전**: **v3** (arXiv 공식 HTML 전문 `arxiv.org/html/2505.11349v3`) — 1차 소스 자격 충족
- **메타데이터 대조**: arXiv abs 페이지의 제목·저자·Comments·Subjects·제출이력과 본문 렌더링이 일치
- **본문 접근**: 가능 (§1~§6 + Appendix A~F 전 구간, Table 1~4, Figure 1~7 확인)
- **OpenReview PDF**: 브라우저 검증 화면으로 차단되어 **미사용**. 본 해체의 모든 수치·번호는 arXiv v3 전문에서만 인용
- **§4-bis 3문 자기시험**: **통과**
  - Q1 초록 첫 문장 verbatim — *"Recent time-series foundation models exhibit strong abilities to predict physical systems."*
  - Q2 **Table 1** 캡션 verbatim *"Performance comparison (MAE @ 50 steps, mean ± standard deviation) of forecasting models across SciML tasks."* + Circuit 행 Parrot 셀 **0.083±0.050**
  - Q3 방법 절 **§3 "Context parroting as a zero-shot forecasting strategy"** + **Algorithm 1 "Context Parroting"** 의 정의 verbatim (입력: *"Context trajectory x1:L={x1,…,xL}, embedding dimension D (i.e., the length of the motif to match), and forecast length H."*)

## 태그

- **주 태그**: `tsfm-interp`
- **보조 태그**: `non-stationarity-ts`, `mech-interp-circuits`, `ts-transformer-baseline`

## 한 줄 판결

**"당신의 시계열 모델이 무엇을 배웠는지 묻기 전에, 그것이 문맥을 베끼고 있지 않은지부터 증명하라" — 이 논문은 TSFM 성능표의 해석 권한을 통째로 회수하는 5줄짜리 반증 장치이며, 내 두 트랙(APF·Grokking) 모두에서 실험 결과를 발표하기 전에 반드시 통과시켜야 할 필수 베이스라인으로 핀을 꽂는다.**

## 목차

| 파일 | 내용 |
|---|---|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 (근거 지도 포함) |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR (초등학생 / 학부생 / 전문가) |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims_a_parrot_beats_tsfm.md](04_claims_a_parrot_beats_tsfm.md) | 3. 핵심 Claim 해체 (1) — 베끼기가 이긴다 |
| [04_claims_b_induction_and_scaling.md](04_claims_b_induction_and_scaling.md) | 3. 핵심 Claim 해체 (2) — induction head와 스케일링 법칙 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4. 방법론 해부 (a) — 전체 그림 |
| [05_method_b_algorithm.md](05_method_b_algorithm.md) | 4. 방법론 해부 (b) — Algorithm 1 한 줄씩 |
| [05_method_c_scaling_law.md](05_method_c_scaling_law.md) | 4. 방법론 해부 (c) — α = 1/d_cor 유도 |
| [05_method_z_implementation.md](05_method_z_implementation.md) | 4. 방법론 해부 (z) — 구현·하이퍼파라미터 |
| [06_experiments_a_chaos.md](06_experiments_a_chaos.md) | 5. 실험 해부 (a) — dysts 135개 카오스계 |
| [06_experiments_b_beyond_chaos.md](06_experiments_b_beyond_chaos.md) | 5. 실험 해부 (b) — 난류·ECG·회로·Kuramoto |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9. 사고 확장 (a) — 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9. 사고 확장 (b) — follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9. 사고 확장 (c) — 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
