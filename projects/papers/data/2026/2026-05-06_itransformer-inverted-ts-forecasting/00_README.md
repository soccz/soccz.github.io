# 00. 네비게이션 — iTransformer: 축을 뒤집은 트랜스포머

## 원문 정보

| 항목 | 내용 |
|------|------|
| 원문 제목 | iTransformer: Inverted Transformers Are Effective for Time Series Forecasting |
| 한국어 제목 | iTransformer: 축을 뒤집은 트랜스포머는 시계열 예측에 효과적이다 |
| 저자 | Yong Liu, Tengge Hu, Haoran Zhang, Haixu Wu, Shiyu Wang, Lintao Ma, Mingsheng Long |
| 소속 | Tsinghua University · Ant Group |
| 발표처 | ICLR 2024 **Spotlight** |
| arXiv ID | arXiv:2310.06625 (제출 2023-10-10) |
| 주 태그 | `ts-transformer-baseline` |
| 보조 태그 | `non-stationarity-ts`, `tsfm-interp` |
| 코드 공개 | ✅ https://github.com/thuml/iTransformer (pip 패키지 + NeuralForecast/GluonTS 통합) |

## 한 줄 판결

> **"시간(T) 방향 어텐션"이라는 트랜스포머 TS 적용의 암묵적 가정을 정면으로 뒤집어, 변수(N) 방향 어텐션 + 시간 방향 FFN으로 다변량 예측 SOTA를 달성한 논문 — APF 연구에서 T×T 어텐션 모티프 분류 체계의 '대안 축' 비교군으로, Grokking 연구에서 FFN이 시간 패턴을 학습하는 회로 구조 분석의 초기점으로 필수 참조한다.**

## 목차

| 파일 | 내용 | 목표 분량 |
|------|------|----------|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 | 700자 |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR | 2,000자 |
| [03_problem.md](03_problem.md) | 문제 지형도 | 3,000자 |
| [04_claims.md](04_claims.md) | 핵심 Claim 해체 (3개) | 3,500자 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 A — 큰 그림: 축 전환 직관 | 1,800자 |
| [05_method_b_embedding.md](05_method_b_embedding.md) | 방법론 B — 변수 토큰 임베딩 | 1,800자 |
| [05_method_c_attention.md](05_method_c_attention.md) | 방법론 C — 변수 방향 어텐션 | 1,800자 |
| [05_method_d_ffn_arch.md](05_method_d_ffn_arch.md) | 방법론 D — FFN + 전체 아키텍처 | 1,800자 |
| [06_experiments.md](06_experiments.md) | 실험 해부 | 3,000자 |
| [07_limits.md](07_limits.md) | 가정·한계·반박 | 2,000자 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 | 2,000자 |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 | 3,000자 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 A — 자문 질문 5개 | 1,500자 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 B — Follow-up 논문 3편 | 1,500자 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 C — 실험 아이디어 2개 | 1,500자 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 | 300자 |
