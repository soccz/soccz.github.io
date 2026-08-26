# Deep Learning Statistical Arbitrage (딥러닝 통계적 차익거래)

- **저자**: Jorge Guijarro-Ordonez (Stanford, Department of Mathematics) · Markus Pelger (Stanford, Management Science & Engineering) · Greg Zanotti (Stanford, Management Science & Engineering)
- **발표처·연도**: *Management Science* 게재 (Articles in Advance, 2025) · DOI **10.1287/mnsc.2022.03132** — 프리프린트 **arXiv:2106.04028** (v1 2021-06-08 / **v2 2022-10-07**, 본문 표지 "This draft: September 25, 2022 / First draft: March 15, 2019")
- **태그**: `fin-ts-dl` (주) · 보조 `tsfm-interp` / `attention-as-explanation` (§III.N 어텐션 해부) — 카운터는 `fin-ts-dl` 만 +1

## Source Lock

| 항목 | 내용 |
|---|---|
| Canonical identifier | **arXiv:2106.04028v2** (1차) · DOI 10.1287/mnsc.2022.03132 (*Management Science*) |
| 1차 원문 | `arxiv.org/pdf/2106.04028v2` **PDF 전문 60쪽 직접 열람** (본문 §I~§IV + REFERENCES + Appendix A~C) · 교차확인용 `ar5iv.labs.arxiv.org/html/2106.04028` |
| 확인한 버전 | arXiv v2 (2022-10-07 제출, 본문 draft 날짜 2022-09-25) |
| 본문 접근 | **가능** — 초록·§II 식 (1)~(6)·§III.A~N·Table I~IX·Figure 1~18·Appendix A~C 직접 확인 |
| §4-bis 3문 | **통과** (Q1 초록 첫 문장 / Q2 **Table I** CNN+Trans·IPCA·K=5 **SR 4.16** / Q3 **§II.A** + **식 (1)**) |
| ⚠️ 미확인 | *Management Science* **게재본**은 본 환경에서 출판사 페이지 접근 권한 미승인 → **본 해체의 모든 수치는 arXiv v2 기준**이며 게재본과의 차이는 대조하지 않았다. Table A.VI~A.X 의 셀 값은 전사하지 않음(본문 인용 위치만 기록). |
| 코드·데이터 | **코드 공개 명시 없음**(원문에 저장소 URL 미기재). 데이터는 CRSP + Compustat + Kenneth French Data Library — **CRSP/Compustat 유료** → 완전 재현 불가 |

## 한 줄 판결

> **"금융 논문"으로 읽지 말고 — *예측 목적함수 대신 거래 목적함수로 학습시킨 어텐션 모델을 저자 스스로 사후 해부한 사례연구*로 읽어라. Sharpe 4.16 은 마찰 전 숫자이고 마찰을 넣으면 Table IX 에서 0.94~1.24 로 내려앉으며, 내 연구로 가져갈 실물은 성능이 아니라 §III.N 의 해부 절차(H×L 어텐션 가중치 지도 + 합성 사인파 프로브 + NAAG 기울기 중요도)다.**

## 목차

| 파일 | 내용 |
|---|---|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 (근거 지도 포함) |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등학생 / 학부생 / 전문가) |
| [03_problem.md](03_problem.md) | 문제 지형도 — 통계적 차익거래 3대 난제와 계보 |
| [04_claims_a_core.md](04_claims_a_core.md) | 핵심 Claim 1~3 (성능 / 차익 잔존량 / 신호추출 우위) |
| [04_claims_b_structure.md](04_claims_b_structure.md) | 핵심 Claim 4~5 (비대칭 패턴 해석 / 잔차 vs 수익률) |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 (a) 전체 흐름의 큰 그림 |
| [05_method_b_residual.md](05_method_b_residual.md) | 방법론 (b) 차익 포트폴리오 = 잔차 (식 1) |
| [05_method_c_signal_policy.md](05_method_c_signal_policy.md) | 방법론 (c) 신호·배분 함수와 결합 최적화 (식 2~6) |
| [05_method_d_cnn_transformer.md](05_method_d_cnn_transformer.md) | 방법론 (d) CNN+Transformer 필터 |
| [05_method_z_implementation.md](05_method_z_implementation.md) | 방법론 (z) 구현 디테일 |
| [06_experiments_a_main.md](06_experiments_a_main.md) | 실험 (a) 데이터·주 결과 (Table I~VIII) |
| [06_experiments_b_frictions.md](06_experiments_b_frictions.md) | 실험 (b) 마찰·지속성·희소성 (Table IX, Figure 6~12) |
| [07_limits.md](07_limits.md) | 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 (a) 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 (b) follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 (c) 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 |
