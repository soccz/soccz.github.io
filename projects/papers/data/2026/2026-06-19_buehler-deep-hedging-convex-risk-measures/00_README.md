# Deep Hedging — 표지

## 원문 정보

- **원제**: Deep Hedging
- **한국어**: 딥 헤징 — 시장 마찰 하에서 신경망으로 파생상품 포트폴리오를 헤지하는 프레임워크
- **저자**: Hans Bühler · Lukas Gonon · Josef Teichmann · Ben Wood
- **소속**: JP Morgan (Bühler·Wood, Quantitative Research) · ETH Zürich (Gonon·Teichmann, D-MATH)
- **발표처/연도**: *Quantitative Finance* (Taylor & Francis) Vol. 19(8), pp. 1271–1291 (2019)
- **수신/수락/온라인**: 2018-02-15 / 2019-01-09 / 2019-02-21
- **arXiv 첫 공개**: 2018-02-08 (v1), arXiv:1802.03042
- **DOI**: 10.1080/14697688.2019.1571683

## Source Lock

- **Canonical identifier**: arXiv:1802.03042 + DOI:10.1080/14697688.2019.1571683 (둘 다 확인)
- **공식 출처 URL**:
  - arXiv 본문 PDF: `https://arxiv.org/abs/1802.03042` — **본 환경 차단 (HTTP 403)**
  - ar5iv 렌더링: `https://ar5iv.labs.arxiv.org/html/1802.03042` — **본 환경 차단**
  - alphaxiv 렌더링: `https://www.alphaxiv.org/abs/1802.03042` — **본 환경 차단**
  - Taylor & Francis 게재 페이지: `https://www.tandfonline.com/doi/abs/10.1080/14697688.2019.1571683` — **본 환경 차단**
  - Hugging Face papers 페이지: `https://huggingface.co/papers/1802.03042` — **본 환경 차단**
  - SSRN 사본: `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3120710` — 메타 확인용
  - **저자 본인 GitHub repo (1차 대체)**: `https://github.com/hansbuehler/deephedging` — README + Network.md 가 가설·아키텍처·OCE/CVaR 손실 verbatim 제공
  - **EPFL Buehler 발표 자료**: `https://www.epfl.ch/schools/cdm/wp-content/uploads/2019/02/Buehler-Swissquote2018.pdf` — **본 환경 차단**
  - Oxford Maths Imperial 슬라이드 "Deep Hedging: from Theory to Practice": `https://www.maths.ox.ac.uk/system/files/attachments/2019%2004%2024%20Deep%20Hedging%20Frontiers%20Imperial%202.1.pdf` — **본 환경 차단**
- **확인 버전**: arXiv:1802.03042 (Quantitative Finance 게재본과 동일 manuscript) — 본문 PDF 직접 미열람. 대신 **저자 공식 GitHub (hansbuehler/deephedging)** README + Network.md 의 verbatim 구조와 WebSearch 인덱스로 추출된 abstract verbatim 으로 method/architecture/objective 검증.
- **Evidence map** (해체에 사용할 근거 위치):
  - **Abstract** = WebSearch 검색 인덱스 verbatim ("We present a framework for hedging a portfolio of derivatives in the presence of market frictions ...") + arXiv abs page 제목·저자 메타.
  - **방법론 (objective, action function, 네트워크 구조)** = `hansbuehler/deephedging/README` core algorithm 수식 (`max U[Z_T + Σ a(s_t)·DH_t + γ_t·|a(s_t)H_t|]`) + `Network.md` 의 OCE / Entropy / CVaR 정의 + 4종 recurrence 정의 (Classic / Aggregate / Past Repr / Event).
  - **실험 (Heston · 거래비용 · CVaR 히스토그램)** = WebSearch 인덱스 "synthetic market driven by the Heston model" + "histogram for different risk preference levels" + GitHub `world.py` SimpleWorld_Spot_ATM 의 spot 0.0002, option 0.02 거래비용 기본값.
  - **이론 (ε-approximation density)** = 검색 인덱스 verbatim "set of constrained trading strategies … is large enough to ε-approximate any optimal solution".
- **본문 표 절대 수치 (P&L 평균/분산, ES level, capital 수치 등)**: **본 환경 차단으로 단정 불가** — 본 해체에서는 "원문에 수치 미보고 (본 환경 본문 PDF 차단)" 로 표기.

## 태그

- 주: `deep-hedging` (원거리 버킷, 커버 0 → +1)
- 보조: `rl-trading` (액션이 RL policy 로 학습됨), `causal-ml-finance` 약결합 (constrained optimization 측 시각으로 자연스럽게 통제 문제로 분류 가능)

## 코드·데이터 공개

- 저자 공식 코드: `github.com/hansbuehler/deephedging` (GPL-3.0, TF 2.10, cdxbasics 의존)
- 데이터: 시뮬레이션 전용 — Heston/Black-Scholes 합성 경로 (실제 시장 데이터 사용 없음)
- 커뮤니티 reproduction: `pfnet-research/pfhedge` (PyTorch), `appie-mathematics/Deep-Hedging`, `alexisdpc/Deep-Hedging`

## 한 줄 판결

> **"파생상품 헤징을 '리스크 측도 최적화 + 함수근사' 두 축으로 재정의해 시장 마찰을 1급 시민으로 격상시킨 분기점 — 이 논문 이후 'closed-form vs DL' 논쟁은 끝났고 'OCE 어떤 utility · constraint 어떻게 표현 · simulator 무엇'으로 옮겨갔다. APF·Grokking 양 track 의 직접 인접은 약하지만 P1 ProTran-TFA·AETHER 의 마찰 비대칭 모델링 substrate 로 1순위, 그리고 PE↔motif 의 attention 분석 substrate 가 'state→action' RNN policy 에 어떻게 이식되는가에 대한 자연 실험장."**

## 목차

- [00_README.md](./00_README.md) — 표지 (현재 파일)
- [01_meta.md](./01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](./02_tldr.md) — 3층 TL;DR
- [03_problem.md](./03_problem.md) — 문제 지형도
- [04_claims.md](./04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](./05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_objective.md](./05_method_b_objective.md) — 방법론: OCE / Entropy / CVaR 목적함수
- [05_method_c_action_policy.md](./05_method_c_action_policy.md) — 방법론: action function 의 함수근사
- [05_method_d_density.md](./05_method_d_density.md) — 방법론: ε-근사 정리와 density 보장
- [05_method_z_implementation.md](./05_method_z_implementation.md) — 방법론: 구현·하이퍼파라미터
- [06_experiments.md](./06_experiments.md) — 실험 해부
- [07_limits.md](./07_limits.md) — 가정·한계·반박
- [08_lineage.md](./08_lineage.md) — 이론적 계보
- [09_my_research.md](./09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](./10_extensions_a_questions.md) — 사고 확장: 자문 질문
- [10_extensions_b_followups.md](./10_extensions_b_followups.md) — 사고 확장: Follow-up
- [10_extensions_c_ideas.md](./10_extensions_c_ideas.md) — 사고 확장: 후속 실험 아이디어
- [11_verdict.md](./11_verdict.md) — 한 줄 판결
