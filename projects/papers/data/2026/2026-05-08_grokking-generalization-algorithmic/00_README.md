# 00 — 표지 및 네비게이션

> **🧒 한 줄 요약**: 본 deep dive 입구 — 16 + 7 chapters. Power 2022 = Grokking founding paper.


## 원문 정보

| 항목 | 내용 |
|------|------|
| **제목** | Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets |
| **한국어 번역** | 그로킹: 소규모 알고리즘 데이터셋에서 과적합을 넘어서는 일반화 |
| **저자** | Alethea Power, Yuri Burda, Harri Edwards, Igor Babuschkin, Vedant Misra |
| **소속** | OpenAI |
| **발표처** | ICLR 2022 Math-AI Workshop |
| **canonical identifier** | arXiv:2201.02177 |
| **제출일** | 2022년 1월 6일 |

## Source Lock

| 항목 | 상태 | 비고 |
|------|------|------|
| Canonical ID | ✅ 확인 | arXiv:2201.02177 — 웹 검색 다중 출처 교차 확인 |
| 메타데이터 일치 | ✅ 확인 | 제목·저자·연도·발표처 일치 |
| 전문 접근 | ⚠️ 제한적 | 네트워크 환경 차단으로 PDF 직접 열람 불가. 대신 공식 코드 저장소(github.com/openai/grok), 논문을 인용한 다수 학술 스니펫(xanderdavies 복제 README 포함)으로 방법론·실험·결과 교차 검증 완료 |
| 근거 지도 | ✅ 작성 | 코드 기반 방법론·과제 확인, 스니펫 기반 결과 확인 (섹션 01 참조) |
| 코드 공개 | ✅ | github.com/openai/grok (MIT 라이선스 없음, 공개 저장소) |
| 데이터 공개 | ✅ | 코드 내 자동 생성 (data.py) |

## 한 줄 판결

> **"그로킹"은 단순한 실험 관찰이 아니라, 정규화가 느린 회로에 복잡도 패널티를 가해 '알고리즘적 일반화' 회로를 강제 점화시키는 위상 전이다 — Grokking track의 출발점이자, Nanda 2023 Fourier 해석의 직접 전구체.**

---

## 목차

| 파일 | 섹션 | 분량 |
|------|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 | ~700자 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR | ~2,000자 |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 | ~3,000자 |
| [04_claims.md](04_claims.md) | 3. 핵심 Claim 해체 | ~3,500자 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 — 큰 그림 | ~2,000자 |
| [05_method_b_architecture.md](05_method_b_architecture.md) | 4b. 방법론 — 트랜스포머 구조 | ~2,500자 |
| [05_method_c_tasks_training.md](05_method_c_tasks_training.md) | 4c. 방법론 — 과제·훈련 설정 | ~2,000자 |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 | ~3,000자 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 | ~2,000자 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 | ~2,000자 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 | ~3,000자 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 사고 확장 — 자문 질문 | ~1,500자 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. 사고 확장 — 후속 논문 | ~1,500자 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 사고 확장 — 실험 아이디어 | ~1,500자 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 | ~300자 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 권장 학습 path?**
2. **Power 2022 grokking founding paper 의 의의?**
3. **4년 후 mech interp era 의 trigger?**

### 답변

1. **선형 path**: 02 → 03 → 05a→c → 06 → 17. 시간 부족 시 02 + 06 + 11.

2. **Grokking phenomenon 의 founding discovery**. Train 100% 후도 generalization 가능 — *기존 ML wisdom contradiction*. 후속 *all grokking research* 의 motivation.

3. **Phenomenon → Mechanism → Application 의 trajectory trigger**. Power 2022 (discovery) → Nanda 2023 (Fourier mech) → Wang 2024 (reasoning) → 2025-2026 industry. 4년 systematic translation.
