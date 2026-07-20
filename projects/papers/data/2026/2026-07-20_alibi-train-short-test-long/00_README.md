# Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation

**한국어 제목**: 짧게 학습하고 길게 시험하라 — 선형 편향 어텐션(ALiBi)으로 입력 길이 외삽을 가능하게 하다

- **저자·소속**: Ofir Press (University of Washington · Facebook AI Research), Noah A. Smith (University of Washington · Allen Institute for AI), Mike Lewis (Facebook AI Research)
- **발표처·연도**: ICLR 2022 (Poster) · 2021-08 arXiv 최초 공개
- **canonical identifier**: arXiv:2108.12409 · ICLR 2022 poster (iclr.cc/virtual/2022/poster/6261)

## Source Lock

- **canonical identifier**: arXiv:2108.12409
- **공식 원문**: `https://arxiv.org/abs/2108.12409` · 읽기용 전문 렌더 `https://ar5iv.labs.arxiv.org/abs/2108.12409`
- **확인한 버전**: ar5iv 전문(HTML) — arXiv ID·제목·저자가 공식 arXiv 메타데이터와 일치함을 확인
- **본문 접근 여부**: ✅ **전문 접근 성공**. 초록·§3(방법)·§4(실험, 표 2·표 3 수치)·부록 §B(early token curse 분석)를 원문에서 직접 확인. (최근 3회 실행은 proxy 차단으로 SKIP-DAY였으나, 본 실행에서 ar5iv 전문 접근이 복구됨.)
- **§4-bis 3문 자기시험**: **통과** — Q1 초록 첫 문장, Q2 표 2의 수치(ALiBi L=512→L_valid=3512에서 18.40 perplexity), Q3 §3의 어텐션 편향 식 모두 원문에서 verbatim 확인.

## 태그

- **주 태그**: `pe-attention-geometry` (3→4)
- **보조 태그**: `attention-as-explanation` (cross), `training-dynamics` (recency-bias inductive bias 관점)

## 코드·데이터 공개

공개 ✅ — 저자 공식 저장소 `github.com/ofirpress/attention_with_linear_biases` (구현 + Fairseq 통합). WikiText-103는 공개 벤치마크, 대규모 코퍼스는 CC-100 영어부 + Toronto Book Corpus.

## 한 줄 판결

> **위치를 "더하지" 말고 어텐션 점수에서 "거리만큼 깎아라" — 학습 파라미터 0개짜리 최근성 편향(recency bias)이 길이 외삽을 공짜로 얻게 해준다. APF의 PE 5-셀 비교에서 ALiBi는 "content×position을 곱으로 얽는 RoPE"의 정확한 대척점(순수 additive distance penalty)이며, Grokking-TS의 PE 축 실험에서 반드시 넣어야 할 셀이다.**

## 목차

- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims_a_claim12.md](04_claims_a_claim12.md) — 핵심 Claim 1·2
- [04_claims_b_claim34.md](04_claims_b_claim34.md) — 핵심 Claim 3·4
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법 직관(큰 그림)
- [05_method_b_linear_bias.md](05_method_b_linear_bias.md) — 선형 거리 편향 식
- [05_method_c_slopes.md](05_method_c_slopes.md) — head별 기울기 m의 설계
- [05_method_z_implementation.md](05_method_z_implementation.md) — 구현 디테일
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
