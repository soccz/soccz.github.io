# Exploring Representations and Interventions in Time Series Foundation Models

**한국어 제목**: 시계열 파운데이션 모델의 내부 표현과 개입(steering) 탐구

**저자**: Michał Wiliński, Mononito Goswami, Willa Potosnak, Nina Żukowska, Artur Dubrawski
**소속**: Carnegie Mellon University — Auton Lab (MOMENT 팀)
**발표처·연도**: ICML 2025 (Poster), PMLR 267 · Vancouver
**canonical identifier**: arXiv:2409.12915 · OpenReview `goVzfYtj58` · icml.cc/virtual/2025/poster/44453

---

## Source Lock

- **canonical identifier**: arXiv:2409.12915 (ICML 2025 accepted, PMLR v267)
- **공식 원문 URL**: https://arxiv.org/abs/2409.12915 · HTML 전문 https://arxiv.org/html/2409.12915v2
- **확인한 버전**: arXiv v2 (2025-06-05 갱신본, ICML camera-ready 계열). 이후 v3/v5 존재 확인.
- **본문 접근**: ✅ 전문 접근. abstract · §3 Methods(3.1/3.2/3.3) · §4 Results · §5 Discussion(Limitations) · Table 1(MOMENT imputation) · Fig 4/5/6/9 위치 모두 확인.
- **§4-bis 3문 자기시험 통과**:
  - Q1(초록 첫 문장): *"Time series foundation models (TSFMs) promise to be powerful tools for a wide range of applications."*
  - Q2(주 결과 표+수치): Table 1(MOMENT zero-shot imputation) ETTh2 — Vanilla MSE 0.132 / Block-3 pruned MSE 0.133 / All-pruned MSE 0.185 (verbatim)
  - Q3(방법 절+식): §3.1 Eq.(1) CKA 정의, §3.2 Eq.(3) Fisher 판별 손실 $\mathcal{L}_{\text{Fisher}}(c,s)=-(\mu_s-\mu_c)^2/(\sigma_s^2+\sigma_c^2)$ (verbatim)

**태그**: `tsfm-interp` (보조: `mech-interp-circuits`, `causal-intervention`, `ts-transformer-baseline`)

**코드·데이터**: ✅ 공개 — github.com/moment-timeseries-foundation-model/representations-in-tsfms (합성 개념 데이터 생성 + CKA/probing/steering 코드). 분석 대상 모델(MOMENT·Chronos·Moirai) 및 벤치마크(ETT·Weather·Exchange·UCR) 모두 공개.

---

## 한 줄 판결

> **LLM 해석론의 3대 도구(CKA 층 유사도 · 선형 프로빙 · steering 벡터)를 시계열 파운데이션 모델에 처음으로 이식해 "층 중복 → 가지치기"는 정량적으로, "개념 국소화·조종"은 정성적으로 보여준 브릿지 논문 — 내 APF의 causal-intervention 단계에 그대로 쓸 수 있는 방법 템플릿이자, "steering이 합성 데이터에서만 검증됐다"는 빈틈이 곧 내 실험 기회다.**

---

## 목차 (섹션 네비게이션)

| # | 파일 | 내용 |
|---|------|------|
| 0 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 (근거 지도 포함) |
| 1 | [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등/학부/전문가) |
| 2 | [03_problem.md](03_problem.md) | 문제 지형도 — TSFM은 왜 "블랙박스"인가 |
| 3 | [04_claims_a_redundancy-pruning.md](04_claims_a_redundancy-pruning.md) · [04_claims_b_concepts-steering.md](04_claims_b_concepts-steering.md) | 핵심 Claim 4개 해체 |
| 4 | [05_method_a_intuition.md](05_method_a_intuition.md) · [05_method_b_cka-pruning.md](05_method_b_cka-pruning.md) · [05_method_c_concept-probing.md](05_method_c_concept-probing.md) · [05_method_d_steering.md](05_method_d_steering.md) · [05_method_z_implementation.md](05_method_z_implementation.md) | 방법론 해부 |
| 5 | [06_experiments_a_pruning.md](06_experiments_a_pruning.md) · [06_experiments_b_concepts-steering.md](06_experiments_b_concepts-steering.md) | 실험 해부 |
| 6 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 7 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 8 | [09_my_research.md](09_my_research.md) | 내 연구(APF·Grokking)와의 연결 |
| 9 | [10_extensions_a_questions.md](10_extensions_a_questions.md) · [10_extensions_b_followups.md](10_extensions_b_followups.md) · [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 |
| 10 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |
