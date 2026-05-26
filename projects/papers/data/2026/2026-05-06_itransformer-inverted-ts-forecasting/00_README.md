# 00. README — iTransformer: 축을 뒤집은 트랜스포머

> **🧒 한 줄 정리**: 본 deep dive 는 *Liu et al. 2024 (ICLR Spotlight)* 의 24 챕터 + 23 viz blocks + 7 viz JS 의 *체계적 해체*. *APF / Grokking manuscript 의 iTransformer baseline* 으로 *직접 사용 가능*. 본 README 는 *전체 구조의 진입 페이지*.

## 원문 정보

| 항목 | 내용 |
|------|------|
| 원문 제목 | iTransformer: Inverted Transformers Are Effective for Time Series Forecasting |
| 한국어 제목 | iTransformer: 축을 뒤집은 트랜스포머는 시계열 예측에 효과적이다 |
| 저자 | Yong Liu, Tengge Hu, Haoran Zhang, Haixu Wu, Shiyu Wang, Lintao Ma, Mingsheng Long |
| 소속 | Tsinghua University · Ant Group |
| 발표처 | ICLR 2024 **Spotlight** |
| arXiv ID | arXiv:2310.06625v4 (제출 2023-10-10, v4 2024-03-14) |
| 주 태그 | `ts-transformer-baseline` |
| 보조 태그 | `non-stationarity-ts`, `tsfm-interp`, `variate-token`, `multivariate-correlation` |
| 코드 공개 | ✅ https://github.com/thuml/iTransformer (MIT, pip 패키지 + NeuralForecast/GluonTS 통합) |

## Source Lock 상태

| 항목 | 확인 수단 | 상태 |
|------|----------|------|
| canonical identifier | arXiv:2310.06625v4 + ICLR 2024 Spotlight 공식 발표 | ✓ |
| metadata match | OpenReview + arXiv + thuml/iTransformer repo 일치 | ✓ |
| full text access (PDF) | 본 작업 시점 PDF 직접 열람 가능 — 모든 수치 (Table 1/2/3) PDF 추출 | ✓ |
| 코드 공개 | thuml/iTransformer (MIT, 1.5K+ stars) — 14_code PyTorch 재현 base | ✓ |

## 한 줄 판결

> **"시간(T) 방향 어텐션"이라는 트랜스포머 TS 적용의 암묵적 가정을 정면으로 뒤집어, 변수(N) 방향 어텐션 + 시간 방향 FFN으로 다변량 예측 SOTA를 달성한 논문 — APF 연구에서 T×T 어텐션 모티프 분류 체계의 '대안 축' 비교군으로, Grokking 연구에서 FFN이 시간 패턴을 학습하는 회로 구조 분석의 초기점으로 필수 참조한다.**

## 30초 요약

> **iTransformer = (1) 시계열 X ∈ R^{T×N} 의 *axis 만 swap*: 시간 token (vanilla) → variate token. (2) Attention over variates (N tokens) → multivariate correlation 직접 학습. (3) FFN on series (T-length input) → universal approximator + linear forecaster 의 강점 흡수. (4) LayerNorm variate-wise (Eq 2) → non-stationarity 처리. (5) 결과: 7 datasets 중 6개 SOTA, 5 Transformer variants 모두 평균 30%+ 개선, TSFM era 의 *direct enabler*.**

## 목차 (24 챕터)

| 파일 | 내용 |
|------|------|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등생/학부생/전문가) |
| [03_problem.md](03_problem.md) | 문제 지형도 — Transformer 의 TS forecasting 한계 |
| [04_claims.md](04_claims.md) | 핵심 Claim 해체 (3개 main contributions) |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 A — 큰 그림: 축 전환 직관 |
| [05_method_b_embedding.md](05_method_b_embedding.md) | 방법론 B — 변수 토큰 임베딩 (paper §3.1) |
| [05_method_c_attention.md](05_method_c_attention.md) | 방법론 C — 변수 방향 어텐션 (paper §3.2 attention) |
| [05_method_d_ffn_arch.md](05_method_d_ffn_arch.md) | 방법론 D — FFN + LayerNorm + 전체 architecture (paper §3.2) |
| [06_experiments.md](06_experiments.md) | 실험 해부 — Table 1/2/3 + Ablation + CKA |
| [07_limits.md](07_limits.md) | 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 — 4 categories of Transformer-based forecasters |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 (APF + Grokking) |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 A — 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 B — Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 C — 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 + legacy |
| [12_glossary.md](12_glossary.md) | 용어집 · 표기법 · References |
| [13_insights.md](13_insights.md) | 메타 통찰 12개 — "이해를 넘어서" |
| [14_code.md](14_code.md) | PyTorch 재현 코드 |
| [15_diagrams.md](15_diagrams.md) | ASCII 도식 + viz 카탈로그 |
| [16_appendix.md](16_appendix.md) | Table 1/2/3 정확 수치 · 보조 결과 · Reproduction |
| [17_aftermath.md](17_aftermath.md) | 2 년 Aftermath — TSFM era 의 진화 (2024-2026) |
| [18_self_critique.md](18_self_critique.md) | 본 deep dive 의 자기비판 + 추가 작업 |

## 인터랙티브 시각화 (7 viz JS, 23 viz blocks)

| viz id | 챕터 | 내용 |
|--------|------|------|
| `it-token-inversion` | 02, 05a, 15 | paper Figure 2 — Vanilla vs iTransformer token view |
| `it-architecture-flow` | 02, 05b, 15 | paper Figure 4 — Full architecture step-by-step |
| `it-multivariate-correlation` | 05c, 13, 15 | paper Figure 9 — Attention map (variate correlation) |
| `it-lookback-paradox` | 06, 13, 15 | paper Figure 6 — Lookback length paradox resolution |
| `it-variate-generalization` | 06, 13, 15 | paper Figure 5 — Unseen variate generalization |
| `it-promotion-grid` | 06, 13, 15 | paper Table 2 — Promotion across 5 variants |
| `it-datasets-summary` | 04, 06, 13 | paper Table 1 — 7 datasets × 11 models |

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *대상 독자* 와 *최소 reading path*?**
2. **24 챕터 + 7 viz JS 의 *어느 5* 가 *APF reviewer 의 baseline reference* 핵심?**
3. **iTransformer 가 *ICLR 2024 Spotlight* 받은 *결정적 이유*?**

### 답변

1. **APF / Grokking manuscript 작업자 + reviewer + ML 학부생**. 최소 reading: (a) 02_tldr (3-tier), (b) 04_claims (3 main contributions), (c) 05_method_a (intuition), (d) 16_appendix (Table 1 정확 수치), (e) 11_verdict (4 legacies). **30분 으로 paper 의 core**.

2. **16_appendix (Table 1/2/3 수치), 13_insights (12 메타), 14_code (PyTorch), 09_my_research (APF connection), 17_aftermath (TSFM lineage)**. 5 챕터가 *manuscript 의 §1-§6 + Appendix* 의 *모든 explicit reference position* 충족.

3. **(a) Architectural minimalism**: no new component, only inversion → 학계의 *innovation-by-default* 압박 회피. **(b) Robust empirical**: 7 datasets × 6 SOTA + 5 variants 평균 30%+ promotion. **(c) Foundation model enabler**: variate generalization (Fig 5) 의 TSFM era trigger. → 셋 합쳐 *paradigm-shifting* 평가.
