# 00 — 표지 및 목차

## 원문 제목
**What Can Grokking Teach Us About Learning Under Nonstationarity?**

## 한국어 번역
그로킹(Grokking)은 비정상성(Nonstationarity) 하의 학습에 대해 무엇을 가르쳐주는가?

## 저자 · 소속
Clare Lyle · Ghada Sokar · Razvan Pascanu · András György  
(Google DeepMind)

## 발표처 · 연도 · 식별자
- **발표처**: 4th Conference on Lifelong Learning Agents (CoLLAs 2025)
- **arXiv**: [2507.20057](https://arxiv.org/abs/2507.20057)
- **제출일**: 2025년 7월 26일

## 주 태그
`continual-learning` (primary) · `grokking-delayed-gen` (cross)

## 코드 · 데이터 공개 여부
별도 공개 저장소 미확인. 논문에서 표준 modular arithmetic 및 공개 RL 벤치마크(주로 Atari류)를 사용. 코드 부록 확인 불가(본문 접근 제한으로 추정).

## 한 줄 판결
> **Grokking = ELR(유효학습률) 붕괴의 역전**: 모든 지연된 일반화·원시 편향·소성 상실은 하나의 메커니즘(파라미터 노름 증가 → ELR 붕괴 → 게으른 regime 고착)으로 통합되며, ELR 재가열(Re-warming)이 그 보편 치료제임을 실증한다.

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims.md](04_claims.md) | 3. 핵심 Claim 해체 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 — 큰 그림 |
| [05_method_b_elr.md](05_method_b_elr.md) | 4b. 방법론 — 유효학습률(ELR) |
| [05_method_c_nap_rewarm.md](05_method_c_nap_rewarm.md) | 4c. 방법론 — NaP & ELR Re-warming |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 사고 확장 — 자문 질문 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. 사고 확장 — 후속 논문 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 사고 확장 — 실험 아이디어 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
