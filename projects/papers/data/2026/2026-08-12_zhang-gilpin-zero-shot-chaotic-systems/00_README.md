# Zero-shot forecasting of chaotic systems — 섹션 단위 해체

**원문 제목**: Zero-shot forecasting of chaotic systems
**한국어 제목**: 카오스계의 제로샷 예측

**저자·소속**
- Yuanzhao Zhang — Santa Fe Institute, Santa Fe, NM, USA
- William Gilpin — Department of Physics, University of Texas at Austin, Austin, TX, USA (교신저자 표시 `*`)

**발표처·연도**: ICLR 2025 (Published as a conference paper at ICLR 2025 — 원문 각 페이지 헤더 verbatim)
**canonical identifier**: **arXiv:2409.15771** (v3, 2025-03-18) · DOI:10.48550/arXiv.2409.15771

---

## Source Lock

| 항목 | 내용 |
|---|---|
| Canonical identifier | arXiv:2409.15771 · DOI:10.48550/arXiv.2409.15771 |
| 공식 원문 | `https://arxiv.org/pdf/2409.15771v3` (arXiv 공식 PDF 전문 다운로드 성공, 13.7MB) |
| 확인한 버전 | **v3 [cs.LG] 18 Mar 2025** (PDF 좌측 여백 스탬프 `arXiv:2409.15771v3 [cs.LG] 18 Mar 2025` 육안 확인) |
| 메타데이터 일치 | arXiv abs 페이지 Comments 필드 = "13th International Conference on Learning Representations (ICLR 2025)" · 제목·저자 2인 일치 · Subjects cs.LG / nlin.CD / physics.comp-ph |
| 본문 접근 | **전문 접근 성공** — `pdftotext -layout` 변환(104,603 bytes)으로 초록 · §1~§8 · Figure 1~16 · Appendix A~G · References 전부 확인 |
| §4-bis 3문 자기시험 | **통과** (Q1/Q2/Q3 상세는 `01_meta.md`) |
| 원문 표(Table) | **0개** — 이 논문에는 번호 붙은 표가 하나도 없다. 모든 정량 결과가 Figure 1~16에 있다 (전문 대소문자 무시 `table` 검색 4건 전부 본문 산문 중 `predictable`·`Tractable`·`interpretable` 부분문자열) |

> **수치 인용 원칙**: 이 해체의 모든 수치는 원문 본문 문장 또는 그림 캡션에서 verbatim 확인된 것만 적는다. 그림 **내부 축·마커의 눈금값은 벡터 그래픽이라 텍스트로 추출되지 않으므로 읽지 않았고**, 따라서 "Chronos가 NBEATS 대비 몇 % 개선" 류의 표 기반 개선폭은 **원문에 수치 미보고**로 처리한다.

---

## 태그

- **주 태그**: `non-stationarity-ts` (수요일 인접 버킷 최장 공백 태그 — 직전 2026-06-17 Tan et al.)
- **보조 태그**: `tsfm-interp`, `ts-transformer-baseline`

## 코드·데이터 공개

공개 — §8 Reproducibility Statement verbatim: 벤치마크 예측 결과·스크립트 `https://github.com/williamgilpin/dysts_data`, 카오스계 데이터셋 `https://github.com/williamgilpin/dysts`.

---

## 한 줄 판결

**시계열 파운데이션 모델이 보여주는 "제로샷 일반화"의 상당 부분은 물리 학습이 아니라 문맥 복사(context parroting)였다 — 이 논문은 오염 불가능한 135개 카오스계 테스트셋으로 그것을 증명하는 동시에, "점 예측이 죽은 뒤에도 어트랙터의 기하·통계는 살아남는다"는 두 번째 평가 축을 열었다.**

---

## 목차

| 파일 | 내용 |
|---|---|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 (§4-bis 3문 답안 포함) |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR (초등학생 / 학부생 / 전문가) |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 — 왜 카오스가 파운데이션 모델의 시험지인가 |
| [04_claims_a_competitive.md](04_claims_a_competitive.md) | 3-A. Claim 1 — 제로샷이 전용 학습 모델과 대등하다 |
| [04_claims_b_attractor.md](04_claims_b_attractor.md) | 3-B. Claim 2 — 점 예측이 실패한 뒤에도 어트랙터는 남는다 |
| [04_claims_c_parroting.md](04_claims_c_parroting.md) | 3-C. Claim 3·4 — 문맥 복사와 셔플 문맥 in-context learning |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4-A. 방법론 큰 그림 |
| [05_method_b_benchmark.md](05_method_b_benchmark.md) | 4-B. dysts 벤치마크와 Lyapunov 시간이라는 자 |
| [05_method_c_metrics.md](05_method_c_metrics.md) | 4-C. 네 개의 지표 (sMAPE · VPT · 상관차원 · KL) |
| [05_method_d_parroting_probe.md](05_method_d_parroting_probe.md) | 4-D. 문맥 복사 측정과 k-gram 셔플 개입 |
| [05_method_z_implementation.md](05_method_z_implementation.md) | 4-Z. 구현 디테일 (하이퍼파라미터·계산량·파인튜닝 실패) |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9-A. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9-B. Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9-C. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
