# MOIRAI — Unified Training of Universal Time Series Forecasting Transformers

> *모이라이: 보편 시계열 예측을 위한 마스크드 인코더 트랜스포머의 통합 학습*

## 메타

- **원문 제목**: Unified Training of Universal Time Series Forecasting Transformers
- **저자**: Gerald Woo¹², Chenghao Liu¹, Akshat Kumar², Caiming Xiong¹, Silvio Savarese¹, Doyen Sahoo¹
  - ¹ Salesforce AI Research
  - ² School of Computing and Information Systems, Singapore Management University
- **발표처**: Proceedings of the 41st International Conference on Machine Learning (**ICML 2024, Oral**), PMLR 235
- **Canonical identifier**: arXiv:2402.02592 (v2, 2024-05-22)
- **본문 PDF 메타**:
  - PDF Title: "Unified Training of Universal Time Series Forecasting Transformers"
  - PDF Subject: "Proceedings of the International Conference on Machine Learning 2024"
  - PDF Author: "Gerald Woo, Chenghao Liu, Akshat Kumar, Caiming Xiong, Silvio Savarese, Doyen Sahoo"
  - Creator: pdfTeX-1.40.25 (LaTeX with hyperref)
  - 25 pages 본문, arXiv 헤더 워터마크 "arXiv:2402.02592v2 [cs.LG] 22 May 2024"
- **이름의 유래**: 모이라이는 그리스 신화의 운명의 여신들(Fates) — 어느 시계열이든 그 운명(미래)을 가린다는 함의 (footnote 1 of paper)

## Source Lock

- **canonical identifier**: arXiv:2402.02592 ✓
- **official channel**: ICML 2024 (Oral) Proceedings of PMLR Vol. 235, pp. 53140–53164 ✓
- **공식 코드 / 데이터 / 가중치**: https://github.com/SalesforceAIResearch/uni2ts (Apache 2.0)
- **본 환경 접근**: arxiv.org / proceedings.mlr.press / openreview.net 등 학술 호스트 전부 403. github.com 만 허용. PDF 본문은 github 미러 (`redstone-solution-ou/ts-forecasting-wiki/papers/moirai_2402.02592.pdf`, 25 pages) 에서 SHA-매칭 메타 확인 후 본문 직접 판독. 본 해체의 모든 인용 위치는 그 PDF 본문에서 verbatim 으로 추적했다.
- **확인한 섹션 위치**: Abstract / §1 Intro / §2 Related Work / §3 Method (3.1–3.2) / §4 Experiments (4.1–4.4) / §5 Conclusion + Limitations & Future Work / Appendix A–E 모두 위치 확인 완료.

## 태그

- **Primary**: `ts-transformer-baseline` (인접 버킷, 우선 읽기 목록 priority)
- **Secondary**: `probabilistic-forecast`, `non-stationarity-ts` (다중-도메인 분포 학습)
- **Cross**: `tsfm-interp` (Any-variate Attention 의 해석 가능성 측면), `fin-ts-dl` (Econ/Fin 도메인 24.9M obs 포함)

## 코드·데이터 공개

- **코드**: github.com/SalesforceAIResearch/uni2ts (Apache 2.0, PyTorch Lightning)
- **데이터**: LOTSA (Large-scale Open Time Series Archive) — 27,646,462,733 관측치, 9 도메인 (Energy, Transport, Climate, CloudOps, Web, Sales, Nature, Econ/Fin, Healthcare)
- **모델 가중치**: HuggingFace `Salesforce/moirai-1.0-R-{small,base,large}` — 14M / 91M / 311M parameters

## 한 줄 판결

**Universal Forecaster 패러다임의 가장 깨끗한 ICML 등재본 — Any-variate Attention 의 "이진 attention bias × RoPE × 평탄화" 가 APF 의 "PE → motif → CNN probe" 줄기와 가장 정직하게 충돌하며, Mixture-of-Distribution Head 가 ProTran-TFA 의 분포 헤드 디자인 결정을 정면으로 안내한다.**

## 목차

1. [01_meta.md — 메타 & 선정 이유](01_meta.md)
2. [02_tldr.md — 3층 TL;DR](02_tldr.md)
3. [03_problem.md — 문제 지형도](03_problem.md)
4. [04_claims.md — 핵심 Claim 해체](04_claims.md)
5. **05_method** (5개 분할)
   - [05_method_a_intuition.md — 전체 아키텍처 직관](05_method_a_intuition.md)
   - [05_method_b_multi_patch.md — Multi-Patch-Size Projection](05_method_b_multi_patch.md)
   - [05_method_c_any_variate.md — Any-Variate Attention](05_method_c_any_variate.md)
   - [05_method_d_mixture.md — Mixture Distribution Head](05_method_d_mixture.md)
   - [05_method_e_lotsa_training.md — LOTSA + Unified Training](05_method_e_lotsa_training.md)
6. [06_experiments.md — 실험 해부](06_experiments.md)
7. [07_limits.md — 가정·한계·반박](07_limits.md)
8. [08_lineage.md — 이론적 계보](08_lineage.md)
9. [09_my_research.md — 내 연구와의 연결 (APF + Grokking + ProTran-TFA)](09_my_research.md)
10. **10_extensions** (3개 분할)
    - [10_extensions_a_questions.md — 자문 질문 5개](10_extensions_a_questions.md)
    - [10_extensions_b_followups.md — 선행/경쟁/후속 3편](10_extensions_b_followups.md)
    - [10_extensions_c_ideas.md — 후속 실험 2개](10_extensions_c_ideas.md)
11. [11_verdict.md — 한 줄 판결](11_verdict.md)
