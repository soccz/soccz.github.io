# Grokking at the Edge of Numerical Stability

**한국어 제목**: 수치 안정성의 벼랑 끝에서 일어나는 그로킹

---

## 서지

| 항목 | 내용 |
|---|---|
| 저자 | Lucas Prieto, Melih Barsbey, Pedro A. M. Mediano, Tolga Birdal |
| 소속 | Imperial College London (원문 저자 각주 기준 — 본 실행에서 확인한 범위) |
| 발표처 | **ICLR 2025 (Poster)** |
| canonical identifier | **arXiv:2501.04697** · DOI: 10.48550/arXiv.2501.04697 |
| 버전 | v1 (2025-01-08) / **v2 (2025-05-19)** — 본 해체는 v2 기준 |
| OpenReview | forum id `TvfkSyHZRA` (**페이지 자체는 브라우저 검증 화면으로 차단 → 미사용**) |
| 공식 메타 확인 | `iclr.cc/virtual/2025/poster/29501` (제목·저자·Poster 등급·연도 일치) |

## Source Lock

- **canonical identifier**: `arXiv:2501.04697` ✔
- **1차 소스(전문)**: `arxiv.org/html/2501.04697v2` — 본문 §1~§7 + Appendix A~I 전 구조 렌더링 확인 ✔
- **메타 대조**: `arxiv.org/abs/2501.04697v2` (제목·저자·Subjects·버전이력·초록 전문) ↔ ICLR 2025 공식 가상 포스터 페이지 이중 확인 ✔
- **본문 접근**: 초록 / 방법(§3, §4, §5) / 실험(Figure 1~6, **Table 1**) / 한계(§7 Conclusion and Discussion) 위치 모두 직접 확인 ✔
- **2차 소스 사용**: 없음. 저자 GitHub(README)는 코드 공개 여부 확인 외 인용하지 않음.
- **미확인으로 남긴 것**: OpenReview 결정 등급의 세부(리뷰 점수 등) — forum 차단. arXiv `Comments:` 필드에 venue 표기 **없음**이므로 venue 근거는 ICLR 공식 페이지에 둔다.

### §4-bis 3문 자기시험 — **통과**

- **Q1 (초록 첫 문장, arXiv abs 메타 verbatim)**
  > "Grokking, the sudden generalization that occurs after prolonged overfitting, is a surprising phenomenon challenging our understanding of deep learning."
  ⚠️ 단, `arxiv.org/html/2501.04697v2` 본문 렌더링에서는 같은 자리가 *"Grokking, or sudden generalization that occurs after prolonged overfitting, is a surprising phenomenon that has challenged our understanding of deep learning."* 로 읽혔다. **두 문장 모두 arXiv(1차) 경로**이며, 어느 쪽이 조판 원문인지는 단정하지 않고 **양쪽을 병기**한다.
- **Q2 (주 결과 표 번호 + 수치 1개)** — **Table 1**, 캡션 verbatim:
  > "For the methods introduced in this paper, we report accuracies with standard deviations across five seeds for the CIFAR datasets and three seeds for Imagenet-1k and WikiText-103. We report Top-5 accuracy in the case of WikiText-103."
  수치: **⟂Grad / CIFAR100 = 62.69%±0.1** (동일 표 Softmax CE = 59.98%±0.4)
- **Q3 (방법 절 번호 + 정의/식 번호)** — **§3.1 "Softmax Collapse"**, **식 (2)**:
  > "$\sum_{k=1}^{n} e^{z_k} \doteq e^{z_y}$"
  (부동소수점 흡수 오차로 분모가 정답 클래스 항 하나로 삼켜지는 조건)

## 태그

- **주 태그**: `grokking-delayed-gen`
- **보조 태그**: `training-dynamics` (카운터 미증가, 표기만)
- 버킷: **월요일 코어 / §A (Grokking · Delayed generalization)**

## 코드·데이터

공개. 초록 말미 verbatim: "Code for this paper is available at" → `github.com/LucasPrietoAl/grokking-at-the-edge-of-numerical-stability`. 데이터는 modular arithmetic / sparse parity / MNIST 등 생성·공개 데이터.

---

## 한 줄 판결

> **그로킹 문헌의 "정규화가 있어야 일반화가 온다"는 경험칙은 상당 부분 부동소수점 오차(Softmax Collapse)가 학습을 죽여서 생긴 착시였다 — 그로킹 실험을 설계하는 사람이라면 결과 해석 전에 반드시 통과해야 할 위생 검사(hygiene check) 논문.**

---

## 목차

| # | 파일 | 내용 |
|---|---|---|
| 0 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| 1 | [02_tldr.md](02_tldr.md) | 3층 TL;DR |
| 2 | [03_problem.md](03_problem.md) | 문제 지형도 |
| 3 | [04_claims_a_sc.md](04_claims_a_sc.md) · [04_claims_b_nlm.md](04_claims_b_nlm.md) | 핵심 Claim 해체 |
| 4 | [05_method_a_intuition.md](05_method_a_intuition.md) · [05_method_b_softmax_collapse.md](05_method_b_softmax_collapse.md) · [05_method_c_stablemax.md](05_method_c_stablemax.md) · [05_method_d_nlm.md](05_method_d_nlm.md) · [05_method_e_perpgrad.md](05_method_e_perpgrad.md) · [05_method_z_implementation.md](05_method_z_implementation.md) | 방법론 해부 |
| 5 | [06_experiments_a_grokking_tasks.md](06_experiments_a_grokking_tasks.md) · [06_experiments_b_realistic.md](06_experiments_b_realistic.md) | 실험 해부 |
| 6 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 7 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 8 | [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| 9 | [10_extensions_a_questions.md](10_extensions_a_questions.md) · [10_extensions_b_followups.md](10_extensions_b_followups.md) · [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 |
| 10 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |
