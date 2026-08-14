# Does Localization Inform Editing? — 국소화는 편집을 알려주는가?

> **Surprising Differences in Causality-Based Localization vs. Knowledge Editing in Language Models**
> (인과 기반 국소화와 지식 편집 사이의 놀라운 차이)

## 서지

| 항목 | 내용 |
|---|---|
| 저자 | Peter Hase, Mohit Bansal, Been Kim, Asma Ghandeharioun |
| 발표처 | **NeurIPS 2023 (Spotlight)** — Advances in Neural Information Processing Systems 36 |
| Canonical identifier | **arXiv:2301.04213** (v1 2023-01-10 / **v2 2023-10-16**) |
| 공식 proceedings | `proceedings.neurips.cc/paper_files/paper/2023/hash/3927bbdcf0e8d1fa8aa23c26f358a281-Abstract-Conference.html` |
| arXiv Comments (원문) | "NeurIPS 2023 (Spotlight). 26 pages, 22 figures" |
| Subjects | Machine Learning (cs.LG); Artificial Intelligence (cs.AI); Computation and Language (cs.CL) |
| 코드 | **github.com/google/belief-localization** (초록 말미 "Our code is available at ...") |

## Source Lock

- **Canonical identifier**: arXiv:2301.04213 — 공식 arXiv abs 페이지에서 제목·저자·Comments·Subjects·제출이력(v1/v2) 직접 확인.
- **Metadata match**: 제목·저자 4인이 arXiv 공식 메타 ↔ NeurIPS 2023 공식 proceedings 페이지에서 일치. Spotlight 지정은 arXiv Comments 원문 문자열로 확인.
- **Full text access**: **1차 소스 = ar5iv.labs.arxiv.org/html/2301.04213 전문**(arXiv 원문 렌더링). 초록 / §1~§9 / Table 1~6 / Figure 1~6 / Appendix A~C 위치 확인. arXiv PDF 직접 다운로드는 본 실행 환경의 네트워크 제약으로 불가 → ar5iv 렌더링 사용(§4 허용 경로: arXiv ID·제목·저자가 공식 메타와 일치 확인됨).
- **§4-bis 3문 자기시험**: **통과**
  - **Q1** 초록 첫 문장 verbatim — *"Language models learn a great quantity of factual information during pretraining, and recent work localizes this information to specific model weights like mid-layer MLP weights."* (arXiv abs · ar5iv 이중 확인)
  - **Q2** 주 결과 표 = **Table 1**, 수치 verbatim — ROME 행 **Layer .947 / Tracing Effect .016 / Both .948**
  - **Q3** 방법 절 = **§3.2 Causal Tracing**, 정의 verbatim — tracing effect $= p_\theta(o_{true}\mid s_{noise}, r, v_{(t,\ell)}) - p_\theta(o_{true}\mid s_{noise}, r)$ (식 번호는 원문에서 확인 못 함 → **번호 없이 절 번호만 표기**)

## 태그

- **주 태그**: `causal-intervention`
- 보조: `mech-interp-circuits`

## 한 줄 판결

> **"여기에 저장돼 있다"와 "여기를 고쳐야 바뀐다"는 서로 다른 질문이며, 이 논문은 그 둘이 실제로 무관함을 회귀분석으로 못 박은 반증 논문이다 — 내 APF의 motif 인과 개입 실험에서 '국소화 결과 = 개입 지점'이라는 암묵적 등식을 쓰기 전에 반드시 통과해야 할 안전핀.**

## 목차

| 파일 | 내용 |
|---|---|
| [01_meta.md](01_meta.md) | 메타 & 선정 이유 (근거 지도 포함) |
| [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등 / 학부 / 전문가) |
| [03_problem.md](03_problem.md) | 문제 지형도 — 국소화 신앙은 어디서 왔나 |
| [04_claims_a_claim1.md](04_claims_a_claim1.md) | Claim 1 — 편집 성공은 저장 위치와 무관하다 |
| [04_claims_b_claim2.md](04_claims_b_claim2.md) | Claim 2 — 문제를 바꿔도 상관은 거의 살아나지 않는다 |
| [04_claims_c_claim3.md](04_claims_c_claim3.md) | Claim 3 — 기계론적 이해 ≠ 개입 처방 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 큰 그림 |
| [05_method_b_causal_tracing.md](05_method_b_causal_tracing.md) | Causal Tracing 해부 |
| [05_method_c_edit_metrics.md](05_method_c_edit_metrics.md) | 편집 성공 지표 3종 해부 |
| [05_method_d_regression.md](05_method_d_regression.md) | 회귀 설계 — 이 논문의 진짜 무기 |
| [05_method_z_variants.md](05_method_z_variants.md) | 편집 문제 변종 5종 + 구현 디테일 |
| [06_experiments_a_setup.md](06_experiments_a_setup.md) | 실험 해부 (1) 데이터·모델·베이스라인 |
| [06_experiments_b_results.md](06_experiments_b_results.md) | 실험 해부 (2) 표·그림 읽기 |
| [07_limits.md](07_limits.md) | 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | Follow-up 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 한 줄 판결 |

## 이 레포의 짝 논문

본 해체는 **2026-08-10 커버한 ROME**([2026-08-10_rome-locating-editing-factual-associations](../2026-08-10_rome-locating-editing-factual-associations/))의 **직접 반박 논문**이다. ROME만 읽고 인용하면 "Causal Tracing이 편집 지점을 알려준다"는 이미 반박된 명제를 유통시키게 된다. 두 파일은 반드시 함께 읽는다.
