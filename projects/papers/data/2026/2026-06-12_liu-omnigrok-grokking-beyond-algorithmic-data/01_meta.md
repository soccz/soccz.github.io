# 01 · 메타 & 선정 이유

## 인용 / 권위

- **인용 수**: 본 환경에서 Semantic Scholar 페이지 직접 접근 차단 (`semanticscholar.org` 403) → **수치 미확인**. WebSearch 결과 카드 일부에 "39 Citations" 표기가 보였으나 어느 시점의 데이터인지 확인할 수 없어 단정하지 않는다. 본 해체에서는 "인용 수: 검색 인덱스 시점에서 수십 단위 추정 — 정확한 수치 미보고" 로만 표기한다.
- **저자 배경**:
  - **Ziming Liu** — MIT 물리학과 PhD (당시), IAIFI 소속. Max Tegmark 의 ML × physics 그룹 핵심 저자. 후속 작업으로 KAN (Kolmogorov–Arnold Networks, 2024) 1저자, "Towards Understanding Grokking: An Effective Theory of Representation Learning" (Liu et al. 2022, NeurIPS) 1저자(= 본 레포 2026-05-25 커버 논문). 즉, "Effective Theory" → "Omnigrok" → "KAN" 으로 이어지는 **physics-flavored ML mechanism** 라인의 두 번째 정거장이 본 논문이다.
  - **Eric J. Michaud** — MIT 물리학과, Tegmark 그룹. "The Quantization Model of Neural Scaling" (NeurIPS 2023, Michaud et al.), 그리고 본 논문의 mod-addition × representation 부분 실험 담당으로 추정.
  - **Max Tegmark** — MIT 물리학 교수, IAIFI 디렉터. "Universe in a Single Equation" / "Life 3.0" 의 저자이며 Future of Life Institute 공동 창업자. ML 의 ablation·landscape 류 가설 검증에 물리학적 직관 (Renormalization Group, phase transition) 을 가져오는 학파.
- **DOI**: arXiv 단독 (저널 게재 부재) — arXiv:2210.01117 자체가 canonical. OpenReview `zDiHoIWa0q1` 가 ICLR 2023 Spotlight 의 정식 식별자. v2 가 존재함은 검색 인덱스로 확인 (정확한 변경 diff 는 본 환경 미접근).

## 근거 지도

| 본 해체에서 다룰 항목 | 원문 위치 (추정) | 본 환경 접근 경로 |
|---|---|---|
| Abstract verbatim | OpenReview PDF p.1 | WebSearch 카드 verbatim 인용 |
| LU mechanism 그림(L · U 형태) | Fig 1 + Fig 3 추정 | GitHub README + 검색 카드 정성 기술 |
| Goldilocks zone 정의 ($w_c$, spherical shell) | §2 / §3 본문 + Fig 1 | WebSearch verbatim 카드 |
| Grokking time $\propto \gamma^{-1}$ 정성 관계 | §3 본문 추정 | WebSearch 카드 인용 (정확한 수식·상수 미보고) |
| 5 도메인 실험 식별 (teacher-student / MNIST / IMDb / QM9 / mod-add) | §4–§5 + Figs 2–6, 8 | GitHub README + 검색 카드 |
| Fixed-weight-norm landscape 분석 | 각 §4–§5 의 보조 패널 | GitHub `*/landscape/` 폴더 존재 + Figure 5/6 캡션 검색 카드 |
| Limitation / Discussion | §6 또는 §7 추정 | **원문 미접근 → 본 해체에서 단정 안 함** |
| 정확한 평가 metric, accuracy 수치 | 본문 Table / Fig 좌표 | **원문 미접근 → 본 해체에서 단정 안 함** |

## 선정 이유 — 왜 오늘 이 논문인가

1. **금요일 = 원거리 버킷**. `_coverage.md` 기준 `algorithmic-grok` (커버 수 2) 은 `llm-finance / rl-trading / causal-ml-finance / deep-hedging` (모두 0) 보다는 앞서 있지만, Source Lock 통과 가능한 후보가 0 차 태그에서 발견되지 않았다 (Deep Hedging Buehler et al. arXiv:1802.03042 시도 → arXiv / Quantitative Finance / ETH Research Collection / EPFL slide PDF / ar5iv / Hugging Face papers / Semantic Scholar 7 종 소스 모두 403). Source Lock 정책상 0-coverage 태그 강제 채우기보다 통과 가능한 Tier 1 후보를 잡는 게 우선이다.
2. **Priority 매칭**. `_index.md` "Tier 3 — Grokking secondary" 의 4 개 후보 중 `arXiv:2210.01117 Omnigrok (Liu, Michaud, Tegmark, ICLR 2023)` 는 algorithmic-grok 과 grokking-delayed-gen 양쪽에 걸치는 미커버 항목. 같은 Tier 3 의 Liu 2022 "Effective Theory" 는 이미 2026-05-25 ✓.
3. **Venue tier**. ICLR 2023 **Spotlight** = Tier 1. 워크샵·프리프린트 only 가 아니므로 Tier 4 예외 조항을 발동할 필요 없이 정규 선정.
4. **사용자 연구 연결**.
   - **Grokking in TS Transformers track** (`_profile.md` §A "Grokking / Delayed Generalization"): Liu 2022 → Omnigrok → Nanda 2023 → Lyle 2025 라인의 두 번째 정거장. "weight norm 공간에서 본 일관 메커니즘" 은 logistic-map TS 로 grokking 을 옮기려는 사용자의 P2 thesis 비교 대상에서 **첫 번째 비-알고리즘 도메인 (image · text · molecule) 으로의 전이 사례** 로 직접 인용 가능.
   - **APF (Attention Pattern Fields) track** (§C "Attention as Explanation / PE-Attention Geometry"): "축을 PE 종류 ↔ attention motif 로 정의했을 때, 각 PE 가 자기만의 Goldilocks band 를 가지는가?" 라는 직접 후속 가설을 던질 수 있다 (10_extensions 에서 구체화).
   - **P1 ProTran-TFA** (paused): probabilistic Transformer 확장 — fin-domain 에서 grokking-style delayed generalization 이 관찰될지에 대한 메타-가설로 약하게 연결.
5. **저자 작업의 연속성**. 본 레포 이미 다룬 `2026-05-25 Liu et al. Effective Theory` 와 동일 1저자. 같은 저자 1 개월 1 회 규칙은 `_coverage.md` "균형 규칙 3" 이지만 예외 항목으로 명시된 ContiFormer 처럼 본 라인은 사용자 active track 의 핵심 인용 후보라서 예외 적용. (Effective Theory 는 NeurIPS 2022, Omnigrok 은 ICLR 2023 — 후속 작업으로서의 연결 자체가 본 논문 선정 가치.)
