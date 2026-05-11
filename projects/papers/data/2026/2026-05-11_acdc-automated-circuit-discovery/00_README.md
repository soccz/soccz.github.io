# 2026-05-11 (월·코어) — ACDC: 회로 발견의 자동화

## 원문 정보

- **원제**: *Towards Automated Circuit Discovery for Mechanistic Interpretability*
- **한국어 제목(임의)**: 기계론적 해석을 위한 회로 발견 자동화
- **저자**: Arthur Conmy, Augustine N. Mavor-Parker, Aengus Lynch, Stefan Heimersheim, Adrià Garriga-Alonso
- **소속**: Independent / UCL / Conjecture / FAR AI 등 (저자 affiliation 은 NeurIPS 2023 페이지 기준; 일부 공저자 정보는 cross-source 검색에서 확인)
- **발표처·연도**: **NeurIPS 2023 Spotlight**
- **Canonical identifier**: `arXiv:2304.14997` · `dl.acm.org/doi/10.5555/3666122.3666841` · `proceedings.neurips.cc/.../34e1dbe95d34d7ebaf99b9bcaeb5b2be`
- **공식 코드**: `https://github.com/ArthurConmy/Automatic-Circuit-Discovery` (Poetry, TransformerLens 의존)
- **태그(주)**: `mech-interp-circuits` (보조: `causal-intervention`)
- **버킷**: 코어 (월요일)

## Source Lock 메모

- arXiv abs/pdf, ar5iv, alphaxiv, OpenReview PDF, NeurIPS proceedings PDF, 모든 알려진 라우트가 외부 403/404 로 차단되어 **원문 PDF 본문은 직접 열람 불가**.
- 대신 **저자의 공식 GitHub 저장소** (`ArthurConmy/Automatic-Circuit-Discovery`) 코드 본체를 직접 읽어 ACDC 알고리즘 구조 (역위상정렬, edge-by-edge 제거, threshold 비교, zero/random ablation), 6 개 태스크 (IOI / Greater-Than / Docstring / tracr-reverse / tracr-xproportion / Induction) 정의·메트릭 (KL div, logit diff, NLL 등) 을 1 차 확인.
- 수치 (ACDC 가 GPT-2 Small 의 32,000 엣지 중 Greater-Than 회로 68 엣지로 5/5 컴포넌트 재발견, Docstring 의 KL 메트릭에서 edge-level ROC AUC 0.982, tracr-reverse/tracr-xproportion zero-ablation 에서 AUC 1.000) 은 NeurIPS proceedings 페이지·후속 비교 논문 (Syed et al. 2024 BlackboxNLP "Attribution Patching Outperforms ACDC", arXiv:2310.10348) 검색 스니펫·EAP-IG (arXiv:2407.00886) 비교 표 텍스트에서 교차 확인.
- 원문 section/figure/table 번호를 직접 가리킬 수 없는 항목은 "원문 본문 미열람" 이라고 명시한다. 알고리즘 동작은 저자 코드 기준, 실험 수치는 다중 cross-source 기준이라는 두 출처를 분리 표기.

## 한 줄 판결

> **ACDC 는 "회로 발견" 이라는 손작업을 **알고리즘 + 단일 하이퍼파라미터 τ** 로 환원시킨 첫 번째 진지한 시도이며, 그 가치는 정답 회로를 잘 찾는다는 사실보다 "회로를 무엇으로 정의하고 어떤 손실로 평가하는가" 의 **삼각관계 (그래프 정의 × 부패 분포 × 메트릭)** 를 처음으로 명시적으로 노출시켜 후속 비판 (EAP, attribution patching, Hypothesis testing) 의 비교 축을 박아둔 것이다. APF (Attention Pattern Fields) 의 "PE → motif → CNN probe → causal intervention" 마지막 단계의 **causal intervention 절차를 그대로 차용할 수 있는 alpha 0** 으로 핀을 꽂는다.**

## 목차

- [01_meta.md](01_meta.md) — 메타·근거 지도·선정 이유
- [02_tldr.md](02_tldr.md) — 3 층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_computational_graph.md](05_method_b_computational_graph.md) — 방법론: 계산 그래프 정의
- [05_method_c_ablation.md](05_method_c_ablation.md) — 방법론: 부패(corruption)·ablation 분포
- [05_method_d_algorithm.md](05_method_d_algorithm.md) — 방법론: ACDC 알고리즘 본체
- [05_method_e_metric_threshold.md](05_method_e_metric_threshold.md) — 방법론: 메트릭 H 와 임계값 τ
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구 (APF / Grokking) 와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5 개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 논문 3 편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2 개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
