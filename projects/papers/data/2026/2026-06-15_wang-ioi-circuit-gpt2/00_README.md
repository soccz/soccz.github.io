# 00 · 표지

## 원문 정보
- **원문 제목**: *Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 Small*
- **한국어 번역(직역)**: 야생의 해석가능성 — GPT-2 Small 안의 간접목적어 식별 회로
- **저자**: Kevin Wang, Alexandre Variengien, Arthur Conmy, Buck Shlegeris (Redwood Research) · Jacob Steinhardt (UC Berkeley)
- **발표처**: ICLR 2023 (poster 11341)
- **연도**: 2022 (arXiv v1: 2022-11-01) / 2023 (ICLR proceedings)
- **canonical identifier**: arXiv:2211.00593 · OpenReview `NpsVSN6o4ul` · ICLR 2023 (`iclr.cc/virtual/2023/poster/11341`)

## Source Lock 기록
- **시도한 1차 소스**: `arxiv.org/abs/2211.00593` · `arxiv.org/pdf/2211.00593` · `openreview.net/pdf?id=NpsVSN6o4ul` · `openreview.net/forum?id=NpsVSN6o4ul` · `iclr.cc/virtual/2023/poster/11341` · `ar5iv.labs.arxiv.org/html/2211.00593` · `lesswrong.com/.../walkthrough-ioi` — **모두 403 차단**.
- **확보한 원문 흔적**:
  - **저자 공식 코드 저장소** `github.com/redwoodresearch/Easy-Transformer` (Wang et al. 본인이 paper 동반 release 한 "one-time code drop"). 파일 목록·CIRCUIT 사전·BABA/ABBA 템플릿·`completeness.py`/`minimality.py`/`circuit_discovery.py`/`ioi_circuit_extraction.py`/`ioi_dataset.py` 의 함수 시그니처 · 기본 파라미터 (N=500 데이터셋, N=100 평가) **verbatim** 으로 확인.
  - **Semantic Scholar 인덱스** (`6edd112383ad494f5f2eba72b6f4ffae122ce61f`) — 제목·저자·연도 metadata 일치, 초록 verbatim 일부.
  - **ICLR 2023 poster 11341** 페이지 (search snippet 으로 venue 확정).
- **확인 가능한 본문 위치**: ① IOI 작업 정의·ABBA/BABA 프롬프트 → `ioi_dataset.py` ② 26-head 회로 분류·layer.head 인덱스 → `ioi_circuit_extraction.py` 의 `CIRCUIT` dict ③ Faithfulness/Completeness/Minimality 의 차이 메트릭 `|F(C\K) − F(M\K)|` → `completeness.py` `difference_eval`/`circuit_eval`/`cobble_eval` ④ 헤드 단위 ablation 평가 → `minimality.py` (`logit_diff` 기본 메트릭).
- **단정 회피**: 본문 PDF 의 **절대 수치 표** (logit difference 값, Fig 5 등 정량 평가), Limitation 절의 정확한 표현, Appendix 의 보조 실험 수치, 7-class vs 6-class CIRCUIT 분류 불일치는 **단정 안 함**. 본 해체는 코드와 권위 있는 secondary 인덱스가 합의하는 골격만 사용한다.

## 태그
- 주 태그: **mech-interp-circuits** (코어, `_coverage.md` 기준 마지막 2026-05-11 · 5 주 갭)
- 보조 태그: **causal-intervention** (path patching = 인과 개입의 표본적 형태), **attention-as-explanation** (attention head 가 가설 단위가 됨)

## 코드·데이터 공개
**공개**. 저자 GitHub `redwoodresearch/Easy-Transformer` (이후 TransformerLens 로 권장 이전). `experiments.py` / `completeness.py` / `minimality.py` / `advex.py` 4 종 reproduction notebook 제공. IOI 데이터셋은 `ioi_dataset.py` 의 ABBA·BABA × 15 template × 100+ NAMES × 8 PLACES × 8 OBJECTS 조합으로 절차적 생성 (외부 파일 불요).

## 한 줄 판결
**Mech interp 의 "회로가 무엇인가" 정의를 attention head 단위 + 3-축 평가 (faithfulness/completeness/minimality) + path patching 인과 개입으로 못박은 표준 manual baseline. ACDC·Sparse Feature Circuits 의 "자동화" 모두 이 논문의 수동 회로를 ground truth 로 삼는다.** APF 의 motif 정의 / Grokking 의 generalizing-circuit 식별 둘 다 이 3-축 평가로 정당화되어야 한다.

## 목차
- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_task_dataset.md](05_method_b_task_dataset.md) — 방법론: IOI 작업과 데이터셋
- [05_method_c_path_patching.md](05_method_c_path_patching.md) — 방법론: Path patching
- [05_method_d_circuit_extraction.md](05_method_d_circuit_extraction.md) — 방법론: 회로 추출과 헤드 분류
- [05_method_e_metrics.md](05_method_e_metrics.md) — 방법론: 3-축 평가
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 논문
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어
- [11_verdict.md](11_verdict.md) — 한 줄 판결
