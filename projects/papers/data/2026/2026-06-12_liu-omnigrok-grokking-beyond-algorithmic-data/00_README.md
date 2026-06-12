# 00 · README — Omnigrok: Grokking Beyond Algorithmic Data

## 표지

- **원문 제목**: Omnigrok: Grokking Beyond Algorithmic Data
- **한국어 번역**: 옴니그록 — 알고리즘 데이터셋을 넘어선 그록킹
- **저자 / 소속**: Ziming Liu, Eric J. Michaud, Max Tegmark — Department of Physics & Institute for AI and Fundamental Interactions (IAIFI), Massachusetts Institute of Technology
- **발표처 / 연도**: ICLR 2023 (Spotlight)
- **Canonical identifier**: arXiv:2210.01117 · OpenReview `zDiHoIWa0q1`
- **코드**: 저자 공식 GitHub `github.com/KindXiaoming/Omnigrok` (Jupyter 100%, 65 stars 시점 기준 — 본 환경에서는 README 만 직접 확인 가능)
- **태그**: `algorithmic-grok` (1차) / `grokking-delayed-gen` · `training-dynamics` (보조)

## Source Lock 보고

본 환경에서는 다음 정식 출처들이 모두 HTTP 403 으로 차단된다: `arxiv.org/abs/2210.01117`, `arxiv.org/pdf/2210.01117`, `openreview.net/pdf?id=zDiHoIWa0q1`, `ar5iv.labs.arxiv.org/html/2210.01117`, `alphaxiv.org/abs/2210.01117`, `semanticscholar.org/...` (paper page + figure pages), `ui.adsabs.harvard.edu/abs/2022arXiv221001117L/abstract`, `researchgate.net/publication/364126431`, `scispace.com`, `lesswrong.com` 후기, `arxiv-vanity.com`, `liner.com` 요약, `iclr.cc/virtual/2023/poster/...`. 본문 PDF / HTML rendering 어디에도 직접 접근하지 못했다.

대신 다음 두 종류의 보조 출처가 작성의 1차 근거가 된다 — 모두 본 환경에서 실제로 응답을 받은 경로만 인용한다:

1. **저자 공식 GitHub `KindXiaoming/Omnigrok` README + 리포 디렉터리 구조** (`github.com/KindXiaoming/Omnigrok` 및 `/tree/main/{folder}` 접근). 본문 abstract 한 줄(저자 본인 표기), 코드 폴더 6 개(teacher-student / mod-addition / mnist / mnist-repr / imdb / qm9), 각 폴더 내 `landscape/` (고정 weight norm 실험) 과 `grokking/` (표준 학습) 의 2-way 분기, ICLR 2023 Spotlight 표기, 라이선스/스타 수.
2. **WebSearch verbatim 인덱스** — 동일 abstract 텍스트가 복수 결과(검색 결과 페이지 카드)에서 정확히 같은 문장 시퀀스로 인용된 것만 사용. Abstract verbatim, 저자 명·소속(MIT Physics, IAIFI), `Goldilocks zone` 의 정의 (radius $w_c$ 의 spherical shell, "녹색 영역"), LU mechanism 의 정성적 dynamics (large init → quick overfit → small weight decay $\gamma$ 가 weight vector 를 Goldilocks zone 으로 천천히 끌어가서 grokking time $\propto \gamma^{-1}$), 적용 데이터셋 5 종(teacher-student, MNIST, IMDb LSTM, QM9 GCNN, modular addition) 의 도메인 범위, 각 figure 와 폴더 매핑(Fig 2 teacher-student, Fig 3 MNIST, Fig 4 IMDb, Fig 5 QM9, Fig 6 & 8 mod-addition, Fig 7 mnist-repr).

**단정 금지 항목**: 본문 PDF 표·그림의 절대 수치(정확도, loss curve 좌표, weight norm 스칼라 값), 본문 수식의 정확한 변수명·하첨자·정규화 상수 (예: weight decay 의 $\gamma$ 표기는 abstract 외부 source 의 후기 paraphrase 라서 본문에서 실제로 그 기호인지는 단정 안 함), Discussion / Limitation 절의 명시적 문장, 부록 (Appendix) 의 보충 실험 수치, 인용 문헌 리스트, citation count 의 현재 값. 이 모두는 "원문 PDF 미접근 → 본 해체에서는 미보고" 로 표기한다.

**Evidence map**: abstract → WebSearch verbatim 카드; method 의 큰 틀(weight norm vs loss 의 L/U 형태, Goldilocks zone, $\gamma^{-1}$ grokking time 정성 관계) → 저자 GitHub README + 복수 검색 카드 일치; 실험 데이터셋 식별 → 저자 GitHub 폴더 구조; 폴더-figure 매핑 → 저자 GitHub README; venue (ICLR 2023 Spotlight) → 저자 GitHub README. 그 외 모든 본문 단정은 위 두 1차 근거 외 자료(다른 paper, 블로그) 에 의존하므로 적지 않는다.

## 태그

- `algorithmic-grok` (원거리 버킷, 커버 수 2 → 3 으로 갱신 예정)
- 보조: `grokking-delayed-gen` (4 → 4 유지, 본 항목은 algorithmic-grok 으로만 카운트), `training-dynamics` (3 → 3 유지)

## 한 줄 판결

Omnigrok 은 grokking 의 "원인 가설" 을 *데이터·작업 종류* 가 아니라 *weight norm 공간 위 loss landscape* 의 기하학(L-자 train · U-자 test) 으로 옮기면서, 그 정성적 메커니즘 하나로 알고리즘 데이터셋(modular addition) · 표준 분류(MNIST · IMDb) · 분자 회귀(QM9) 까지 한 우산으로 묶는 데 성공한 — **Grokking in TS Transformers track 의 "랜드스케이프-수준 원인 가설" 슬롯에 정확히 들어맞는 ICLR 2023 Spotlight 이정표** 이며, APF (Attention Pattern Fields) 의 "PE 별로 attention motif 가 달라진다" 라는 framing 에도 (weight norm 대신 PE 종류를 축으로 두는) 평행한 landscape 분해 발상의 가능성을 던진다.

## 목차

- [00_README.md](00_README.md) — 본 문서 (표지 · Source Lock · 한 줄 판결)
- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3 층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법 ① LU 메커니즘 큰 그림
- [05_method_b_weight_norm_decomp.md](05_method_b_weight_norm_decomp.md) — 방법 ② weight norm 축 분해
- [05_method_c_landscape_analysis.md](05_method_c_landscape_analysis.md) — 방법 ③ 고정-norm landscape 분석
- [05_method_z_implementation.md](05_method_z_implementation.md) — 방법 ④ 구현·재현 디테일
- [06_experiments.md](06_experiments.md) — 실험 해부 (5 도메인)
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구 (APF · Grokking · ProTran-TFA) 와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 사고 확장 ① 자문 질문 5
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — 사고 확장 ② Follow-up 3 편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 사고 확장 ③ 실험 아이디어 2
- [11_verdict.md](11_verdict.md) — 한 줄 판결
