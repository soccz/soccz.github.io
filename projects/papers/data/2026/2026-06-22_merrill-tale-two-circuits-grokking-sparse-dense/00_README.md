# 00 · README — A Tale of Two Circuits

## 원문 정보
- **제목**: A Tale of Two Circuits: Grokking as Competition of Sparse and Dense Subnetworks
- **한국어 번역**: 두 회로 이야기 — 희소·조밀 부분망의 경쟁으로서의 그록킹
- **저자**: William Merrill, Nikolaos Tsilivis, Aman Shukla
- **소속**: New York University (NYU, William Merrill 의 lambdaviking.com 페이지 기준)
- **발표처**: ICLR 2023 Workshop on Mathematical and Empirical Understanding of Foundation Models (ME-FoMo)
- **연도**: 2023 (arXiv 첫 제출 2023-03)
- **태그 (주)**: grokking-delayed-gen
- **태그 (보조)**: mech-interp-circuits / training-dynamics
- **버킷**: 코어 (월요일, §A · §B 교차)

## Source Lock 상태
- **Canonical identifier**: `arXiv:2303.11873` · OpenReview ID `8GZxtu46Kx`
- **공식 URL (시도)**:
  - arXiv abs/pdf: 본 환경 **403 차단**
  - ar5iv / alphaXiv / OpenReview pdf / ResearchGate / DeepAI: 모두 **403 차단**
- **대체 검증 소스 (확인 완료)**:
  - **저자 공식 GitHub** `github.com/Tsili42/parity-nn` (raw README + `parity.py` + `utils.py` verbatim 확보)
  - WebSearch 인덱스 (abstract verbatim — "model trained on an algorithmic task first overfits but, then, after a large amount of additional training, undergoes a phase transition to generalize perfectly" / "sparse subnetwork that dominates model predictions" / "a small subset of neurons undergoes rapid norm growth, whereas the other neurons in the network decay slowly in norm")
  - DNF 구성 수치 (3-bit parity: 표준 DNF 8 뉴런 / 변형 DNF 6 뉴런) 다수 출처 일치
- **본문 PDF 직접 열람 여부**: ❌ 차단. 단, 저자 공식 repo 의 `utils.py` (FF1 architecture, parity() 함수, ArityFinder, circuit_discovery_*) + `parity.py` (argparse 디폴트 verbatim: `n=40, k=3, N=1000, B=32, epochs=300, lr=0.1, weight_decay=0.01, width=1000, n_seeds=5, sparsity_sampling=10`) + abstract 의 verbatim 4 단편으로 **claim · 방법 · 아키텍처 · 하이퍼파라미터** 는 검증됨.
- **본문 미확인 항목 (단정 금지)**: Figure 의 정확한 phase transition epoch 수치, sparsity time series 의 정확한 좌표, sparse vs dense logit contribution 의 절대 수치, Theorem (있다면) 의 형식적 진술, Appendix 의 보조 실험.
- **코드 / 데이터 공개**: ✅ GitHub `Tsili42/parity-nn` (MIT-스러운 minimal repo, `python parity.py --train --ind-norms --global-sparsity --subnetworks --faithfulness` 한 줄 실행)

## 한 줄 판결

> **Grokking 의 "느린 일반화" 가 단순한 동학 현상이 아니라 두 부분망이 경쟁하는 "기계론적 사건" 임을 sparse parity 라는 최소 substrate 위에서 입증한 워크샵급 짧은 논문 — Nanda 2023 (Fourier circuit) · IOI Circuit 2023 (path patching) 사이의 "왜 phase transition 인가" 라는 빠진 다리에 해당. 본인 Grokking-in-TS-Transformers 트랙에서 dense (regime memorization) → sparse (regime-generalizing circuit) 의 가설 substrate 로 직접 차용 가능.**

## 목차 (섹션 파일)

- [00_README.md](00_README.md) — 표지 · 네비
- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_task_arch.md](05_method_b_task_arch.md) — 방법론: sparse parity 와 아키텍처
- [05_method_c_subnetwork_discovery.md](05_method_c_subnetwork_discovery.md) — 방법론: 부분망 탐색 (faithfulness + arity)
- [05_method_d_norm_dynamics.md](05_method_d_norm_dynamics.md) — 방법론: 뉴런 노름 동학
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 논문 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
