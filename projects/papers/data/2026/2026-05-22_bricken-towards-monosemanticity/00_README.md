# 네비게이션 — Towards Monosemanticity

**원문 제목**: Towards Monosemanticity: Decomposing Language Models With Dictionary Learning
**한국어 번역**: 단의미성을 향하여: 딕셔너리 러닝으로 언어 모델 해체하기

**저자 · 소속**: Trenton Bricken, Adly Templeton, Joshua Batson, Brian Chen, Adam Jermyn, Tom Conerly, Nick Turner, Cem Anil, Carson Denison, Amanda Askell, Robert Lasenby, Yifan Wu, Shauna Kravec, Nicholas Schiefer, Tim Maxwell, Nicholas Joseph, Zac Hatfield-Dodds, Alex Tamkin 외 (Anthropic)

**발표처 · 연도**: Transformer Circuits Thread (transformer-circuits.pub), 2023-10-04

**Canonical Identifier**: `transformer-circuits.pub/2023/monosemanticity/index.html`

---

## Source Lock 상태

| 항목 | 결과 |
|------|------|
| Canonical identifier | ✅ transformer-circuits.pub/2023/monosemanticity/index.html (Anthropic 공식 연구 채널, 웹 검색으로 확인) |
| Metadata match | ✅ 제목·저자·연도·venue 웹 검색 결과와 일치 |
| Full text access | ⚠️ **이 실행 환경의 WebFetch가 모든 외부 URL에 대해 전면 차단됨** (example.com 포함 403 Forbidden 확인). 본문 콘텐츠는 pre-August-2025 훈련 지식 + 웹 검색 스니펫 조합 활용. 수치는 검색에서 확인된 것만 명시, 불확실한 것은 "원문에 수치 미보고" 처리 |
| Evidence map | ✅ (훈련 지식 + 검색 확인) 핵심 수치 — 4,096 features / 512 neurons; ≥65% variance explained; <300 active features per token 검색 스니펫 확인 |

**주요 섹션 위치** (훈련 지식 기반):
- Claim: Problem Setup section (§ Superposition Hypothesis)
- Method: §SAE Architecture, §Loss Function
- Experiment: §Evidence for Monosemanticity (4 lines of evidence), §Feature Properties
- Limitation: §Limitations (명시 섹션)

---

## 태그

**1차**: `sae-features`
**보조**: `mech-interp-circuits`, `causal-intervention`

**코드 · 데이터**: transformer-circuits.pub 내 인터랙티브 시각화 존재 (원문 직접 확인 불가)

---

## 한 줄 판결

> 폴리시맨틱 뉴런을 스파스 오토인코더 사전으로 4,096개의 단의미 특징으로 분해하는 첫 대규모 실증 — APF의 attention motif 원인 규명에 직접 연결되는 mech-interp 도구 체계를 제공하며, Grokking 연구에서는 "학습이 완료될 때 어떤 특징이 결정화되는가"라는 질문에 SAE-기반 접근을 제시한다.

---

## 목차

| 파일 | 섹션 |
|------|------|
| [00_README.md](00_README.md) | 네비게이션 (이 파일) |
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims_a_polysemanticity.md](04_claims_a_polysemanticity.md) | 3-A. Claim 1~2 (폴리시맨틱·슈퍼포지션) |
| [04_claims_b_sae_evidence.md](04_claims_b_sae_evidence.md) | 3-B. Claim 3~4 (SAE 해체·회로 분석) |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4-A. 방법론 큰 그림 |
| [05_method_b_sae_architecture.md](05_method_b_sae_architecture.md) | 4-B. SAE 아키텍처 & 손실함수 |
| [05_method_c_evaluation.md](05_method_c_evaluation.md) | 4-C. 해석가능성 평가 프로토콜 |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9-A. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9-B. Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9-C. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
