# 00. 표지 — Why Attention Patterns Exist (TAPPA)

## 원문 정보

- **원제**: *Why Attention Patterns Exist: A Unifying Temporal Perspective Analysis*
- **한국어 번역**: *왜 어텐션 패턴은 존재하는가: 통합적 시간 관점 분석*
- **저자**: Qingyue Yang, Jie Wang, Xing Li, Yinqi Bai, Xialiang Tong, Huiling Zhen, Jianye HAO, Mingxuan Yuan, Bin Li
- **소속**: MIRA Lab @ USTC (중국과학기술대) + Huawei Noah's Ark Lab
- **발표처**: ICLR 2026 (poster/conference)
- **arXiv ID**: [2601.21709](https://arxiv.org/abs/2601.21709) (2026-01-29 등록)
- **코드**: [github.com/MIRALab-USTC/LLM-TAPPA](https://github.com/MIRALab-USTC/LLM-TAPPA) (2026-02-04 KVCache 모듈 공개, Prune/Visualization 모듈은 예정)

## 태그

- 1차: `pe-attention-geometry` (코어 §C — 0회 → 1회)
- 보조: `mech-interp-circuits`, `attention-as-explanation`

## 한 줄 판결

> **"어텐션 패턴 통합 이론" 의 가장 야심찬 ICLR 2026 시도. APF 의 직접 concurrent work — 우리 motif sweep 의 모든 motif (diagonal/sink/reaccess) 를 q-similarity × RoPE-frequency 두 축으로 환원한다. 우리 framework 의 "PE → motif → CNN probe" 사다리 중 첫 두 칸을 닫는 정리(Theorem 5.2) 가 이미 존재한다는 사실은 충격이지만, 그들은 CNN probe 와 causal intervention 단계가 비어 있어 우리에게 niche 가 남아 있다."**

## 목차

1. [01_meta.md](01_meta.md) — 메타 & 선정 이유
2. [02_tldr.md](02_tldr.md) — 3층 TL;DR (초·학·전)
3. [03_problem.md](03_problem.md) — 문제 지형도: "패턴은 왜 존재하는가" 라는 무거운 질문
4. [04_claims_a_predictability.md](04_claims_a_predictability.md) — Claim 1: 예측가능/불가능 이분법
5. [04_claims_b_three_patterns.md](04_claims_b_three_patterns.md) — Claim 2~4: re-access/sink/slash 통합 설명
6. [05_method_a_intuition.md](05_method_a_intuition.md) — 큰 그림: 시간연속 관점
7. [05_method_b_qsim.md](05_method_b_qsim.md) — q-similarity 정의 & 측정
8. [05_method_c_rope_decomposition.md](05_method_c_rope_decomposition.md) — RoPE 주파수 분해
9. [05_method_d_theorem.md](05_method_d_theorem.md) — Theorem 5.2 분해
10. [05_method_e_apps.md](05_method_e_apps.md) — KV cache / pruning 으로의 번역
11. [06_experiments.md](06_experiments.md) — 실험 해부
12. [07_limits.md](07_limits.md) — 가정·한계·반박
13. [08_lineage.md](08_lineage.md) — 이론적 계보
14. [09_my_research.md](09_my_research.md) — APF 와의 연결 (정면 충돌 + 활용)
15. [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 5문
16. [10_extensions_b_followups.md](10_extensions_b_followups.md) — 후속 3편
17. [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
18. [11_verdict.md](11_verdict.md) — 한 줄 판결

## 본문 접근 메모

- arXiv abs/html/pdf, ar5iv, alphaxiv, Semantic Scholar 모두 403 차단
- GitHub README + 다중 검색 스니펫 + 관련 동시기 논문 (arXiv:2601.08297 "Demystifying the Slash Pattern: The Role of RoPE", arXiv:2404.15574 "Retrieval Head", arXiv:2502.00919 "Attention Sinks: Catch-Tag-Release") 으로 보완
- 따라서 본 해체는 **공개 스니펫 + 관련 표준 수학 + 동시기 논문 cross-reference** 로 구성. 정량 표 일부는 검색 스니펫에 노출된 헤드라인 숫자 (+11.34, +5.60) 외엔 정확 재현 불가. 섹션 06·07 에서 그 제약 명시.
