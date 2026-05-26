# 00 README — Attention is not Explanation

## 표지

| 항목 | 내용 |
|------|------|
| 원문 제목 | **Attention is not Explanation** |
| 한국어 번역 | 어텐션은 설명이 아니다 |
| 저자 | Sarthak Jain, Byron C. Wallace |
| 소속 | Khoury College of Computer Sciences, Northeastern University (NEU) |
| 발표처 | NAACL-HLT 2019 (Main Conference, Long Paper) |
| 연도 | 2019 (arXiv v1: 2019-02-26, v2: 2019-05-08) |
| canonical identifier | **arXiv:1902.10186**, ACL Anthology **N19-1357**, DOI: **10.18653/v1/N19-1357** |
| 코드 공개 | 있음 — `github.com/successar/AttentionExplanation` (저자 공식, GPL-3.0) |
| 데이터 공개 | 공개 코퍼스 사용 (SST/IMDB/20News/AgNews/ADR(tweet)/Anemia/Diabetes/SNLI/CNN/bAbI 1·2·3) |
| 태그 (주) | `attention-as-explanation` |
| 태그 (보조) | `causal-intervention` (counterfactual attention 실험) |
| 버킷 | 코어 (월요일) — §C Attention as Explanation foundation |

## Source Lock 상태

| 항목 | 확인 수단 | 상태 |
|------|----------|------|
| canonical identifier | arXiv:1902.10186v3 (2019-05-08) + ACL Anthology N19-1357 | ✓ |
| metadata match | NAACL-HLT 2019 Long Paper, Best Paper Honorable Mention 후보 | ✓ |
| full text access (PDF) | 본 작업 시점에 PDF 직접 열람 가능 — 본 deep dive 의 *모든 수치 (Table 1/2)* 는 PDF 추출 기반 | ✓ |
| 코드 공개 | `github.com/successar/AttentionExplanation` (GPL-3.0) — 본 14_code 의 PyTorch 재현 코드 base | ✓ |

> **수치 출처**: paper Table 1 (12 dataset stats), Table 2 (Kendall τ correlations) 의 정확한 값은 [16_appendix.md](16_appendix.md) §16.2-16.6 에 추출. Figure 1-7 의 정성적 패턴은 13/15 챕터의 viz block 에 재현.

## 한 줄 판결

> **APF (Attention Pattern Fields) 의 정확히 그 출발선에 박혀 있는 논문 — "attention weight 가 설명을 제공한다" 라는 7년치 관행을 두 가지 적대적 검증 (gradient 상관 + adversarial 동치) 으로 뒤집은, 우리가 motif causality 실험으로 *반드시 넘어서야 할* benchmark.** APF 가 인용해야 할 첫 paper.

## 목차

1. [01_meta.md](01_meta.md) — 메타 & 선정 이유
2. [02_tldr.md](02_tldr.md) — 3층 TL;DR
3. [03_problem.md](03_problem.md) — 문제 지형도
4. [04_claims.md](04_claims.md) — 핵심 Claim 해체
5. 방법론 해부 (분할)
   - [05_method_a_intuition.md](05_method_a_intuition.md) — 전체 흐름
   - [05_method_b_correlation.md](05_method_b_correlation.md) — H1: 어텐션 vs feature importance 상관
   - [05_method_c_counterfactual.md](05_method_c_counterfactual.md) — H2: counterfactual attention (permutation + adversarial)
   - [05_method_d_implementation.md](05_method_d_implementation.md) — 구현 디테일
6. [06_experiments.md](06_experiments.md) — 실험 해부
7. [07_limits.md](07_limits.md) — 가정·한계·반박
8. [08_lineage.md](08_lineage.md) — 이론적 계보
9. [09_my_research.md](09_my_research.md) — 내 연구와의 연결 (APF + Grokking)
10. 사고 확장 (분할)
    - [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
    - [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 3편
    - [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
11. [11_verdict.md](11_verdict.md) — 한 줄 판결
12. [12_glossary.md](12_glossary.md) — 용어집 · 표기법 · References
13. [13_insights.md](13_insights.md) — 메타 통찰 12개
14. [14_code.md](14_code.md) — PyTorch 재현 코드 (H1, H2-a, H2-b)
15. [15_diagrams.md](15_diagrams.md) — ASCII 도식 + viz 카탈로그
16. [16_appendix.md](16_appendix.md) — paper Table 2 정확 수치 · 비교 결과 · reproduction

## 인터랙티브 시각화 (7 viz JS, 22 viz blocks)

| viz id | 챕터 | 내용 |
|--------|------|------|
| `anie-attention-heatmap` | 02, 08, 11, 15 | paper Figure 1 — original vs adversarial heatmap |
| `anie-correlation-hist` | 02, 03, 05b | Kendall τ histogram (BiLSTM vs Average) |
| `anie-permutation-scatter` | 05c | max α vs median ∆ŷ scatter (permutation) |
| `anie-adversarial-search` | 05c, 14 | iter 별 JSD/TVD trajectory |
| `anie-tvd-jsd-2d` | 05c, 07 | 2D plot (TVD, JSD) — adversarial region |
| `anie-encoder-comparison` | 05a, 05d, 06, 13 | BiLSTM vs CNN vs Average τ 비교 |
| `anie-datasets-summary` | 04, 06, 13 | 12 datasets × 5 metrics heatmap |
