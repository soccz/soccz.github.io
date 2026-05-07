# 00 — 표지 & 네비게이션

## 원문 정보

| 항목 | 내용 |
|------|------|
| **원제** | Grokked Transformers are Implicit Reasoners: A Mechanistic Journey to the Edge of Generalization |
| **한국어 제목** | 그로킹된 트랜스포머는 암묵적 추론자다: 일반화 경계로의 메커니즘 여행 |
| **NeurIPS 표제** | Grokking of Implicit Reasoning in Transformers |
| **저자** | Boshi Wang, Xiang Yue, Yu Su, Huan Sun |
| **소속** | Ohio State University (OSU NLP Group) |
| **발표처** | NeurIPS 2024 (Proceedings) |
| **arXiv ID** | 2405.15071 (v2) |
| **코드** | github.com/OSU-NLP-Group/GrokkedTransformer (공개, PyTorch) |
| **데이터** | 합성 데이터셋 (SharePoint 배포 또는 Jupyter 노트북 생성) |
| **태그** | `algorithmic-grok` (주), `mech-interp-circuits` (보조) |

## 한 줄 판결

> **암묵적 추론은 그로킹 없이는 불가능하다 — 단 Composition의 OOD 일반화는 트랜스포머 아키텍처의 비순환성으로 구조적으로 막힌다. 이 논문은 Grokking track의 "왜 grokking이 필요한가"에 대한 가장 깊은 메커니즘 근거다.**

---

## 목차

| 파일 | 섹션 |
|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims_a_main.md](04_claims_a_main.md) | 3a. 핵심 Claim 1~3 |
| [04_claims_b_ood.md](04_claims_b_ood.md) | 3b. 핵심 Claim 4~5 (OOD·아키텍처) |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 — 큰 그림 |
| [05_method_b_tasks.md](05_method_b_tasks.md) | 4b. 방법론 — Composition vs Comparison 태스크 |
| [05_method_c_circuits.md](05_method_c_circuits.md) | 4c. 방법론 — 회로 경쟁 메커니즘 |
| [05_method_d_analysis.md](05_method_d_analysis.md) | 4d. 방법론 — Logit Lens·Causal Tracing |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |
