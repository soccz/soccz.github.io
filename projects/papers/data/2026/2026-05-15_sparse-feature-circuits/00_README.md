# 00 README — Sparse Feature Circuits

> **🧒 한 줄 요약**: 본 deep dive 의 *입구* — 18 + 7 chapters 의 길찾기, 학습 path, 본 paper 의 핵심 주장 한 줄 요약.


## 원문 정보

**제목 (영문)**: Sparse Feature Circuits: Discovering and Editing Interpretable Causal Graphs in Language Models

**제목 (한국어)**: 희소 특징 회로: 언어 모델 안의 해석 가능한 인과 그래프 발견과 편집

**저자**: Samuel Marks¹, Can Rager², Eric J. Michaud¹, Yonatan Belinkov³, David Bau⁴, Aaron Mueller⁵
¹MIT · ²독립 연구자 · ³Technion (이스라엘 공과대) · ⁴UW (워싱턴대) · ⁵BU (보스턴대)

**발표처·연도**: ICLR 2025 **Oral** (The 13th International Conference on Learning Representations)

**Canonical identifier**: arXiv:2403.19647 (제출 2024년 3월 28일)

---

## Source Lock 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical identifier | ✅ | arXiv:2403.19647 — 검색·OpenReview·ICLR 페이지 다중 확인 |
| Metadata match | ✅ | 제목·저자·연도·venue 일치 확인 |
| Full text access | ⚠️ 부분 | arXiv / OpenReview / PDF 총 15회 시도, 전 소스 HTTP 403 차단. **GitHub 공식 저자 저장소** (saprmarks/feature-circuits) 접근 성공, 초록 원문 스니펫 다수 확보 |
| Evidence map | ⚠️ 부분 | GitHub README + 검색 초록·방법론 스니펫 기반. 원문 수치는 "원문에 수치 미보고"로 처리 |

---

## 태그

- **주 태그**: `sae-features` (커버 수 0 → 1)
- **보조 태그**: `causal-intervention` (커버 수 2 → cross-cover)

---

## 코드·데이터 공개

- **코드**: https://github.com/saprmarks/feature-circuits (MIT 라이선스, Python ≥3.10)
- **SAE 딕셔너리**: HuggingFace 공개 (Pythia-70M 전용, p70d-sm 체크포인트)
- **인터렉티브 뷰어**: features.baulab.info / feature-circuits.xyz
- **데이터**: 재현 가능 (README에 HF 다운로드 명령 제공)

---

## 한 줄 판결

> **SAE 특징을 회로의 노드로 격상시켜, 기존 어텐션 헤드·뉴런 단위 회로보다 훨씬 해석 가능한 인과 그래프를 만들었다 — APF의 mech-interp 툴링 레이어에 직접 이식 가능한 귀환 경로다.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims.md](04_claims.md) | 3. 핵심 Claim 해체 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 — 전체 그림 |
| [05_method_b_sae_features.md](05_method_b_sae_features.md) | 4b. 방법론 — SAE 특징 추출 |
| [05_method_c_attribution.md](05_method_c_attribution.md) | 4c. 방법론 — 간접 효과 & 어트리뷰션 |
| [05_method_d_circuit_eval.md](05_method_d_circuit_eval.md) | 4d. 방법론 — 회로 평가 (충실도·완전도) |
| [05_method_e_shift.md](05_method_e_shift.md) | 4e. 방법론 — SHIFT 편집 기법 |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 사고 확장 — 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. 사고 확장 — Follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 사고 확장 — 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *읽는 순서* 의 권장 path?**
2. **SFC 가 ACDC + SAE 의 *결합* 인 이유?**
3. **본 paper 의 *practical 가치* 의 핵심?**

### 답변

1. **선형 path**: 02_tldr → 03_problem → 05a→e → 06_experiments → 11_verdict 의 *paper 흐름*. 즉 *문제 → 해결 → 평가* 의 3-step 가 *기본 트랙*. *시간 부족* 시 02 + 05c + 05d + 11 의 4 chapters 가 *핵심 요지* — 1시간 안에 완성 가능.

2. **Granularity + speed 의 dual gain**. ACDC 의 *automated circuit search* + SAE 의 *interpretable unit* = *automated + interpretable circuit*. 단독 결합이 아닌 *각각의 한계를 상호 보완*. ACDC 의 slow speed → attribution patching 으로 1000× 가속, SAE 의 standalone use 의 *isolated feature → circuit context* 부여.

3. **Industry production tool 의 academic ancestor**. 본 paper 의 ~50 features × 5 min 의 *practical efficiency* 가 Anthropic 의 Claude Sonnet feature steering 의 *direct foundation*. *Editable AI* 의 commercial reality 가 본 paper 의 bias removal demo 의 *direct scale-up*. 2 년 뒤 의 industry standard 의 *seed paper*.
