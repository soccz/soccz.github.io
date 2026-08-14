# 0. 메타 & 선정 이유

## 서지·권위

- **Canonical identifier**: arXiv:2301.04213 (v1 2023-01-10, v2 2023-10-16)
- **Venue**: NeurIPS 2023 **Spotlight** (Advances in NeurIPS 36, Main Conference Track) · 공식 proceedings hash `3927bbdcf0e8d1fa8aa23c26f358a281`
- **저자 배경**: Peter Hase·Mohit Bansal은 UNC Chapel Hill 계열의 해석가능성·설명 신뢰성 연구 라인, Been Kim·Asma Ghandeharioun은 Google(DeepMind/Research) 해석가능성 라인. Been Kim은 TCAV(개념 활성 벡터)·"Sanity Checks for Saliency Maps" 계열로 **"해석 기법이 실제로 무엇을 보증하는가"를 반증 실험으로 검증해 온 저자**이며, 본 논문은 그 방법론적 계보 위에 있다. 코드는 Google 조직 계정(`github.com/google/belief-localization`)으로 공개.
- **인용 수**: **미확인** — Semantic Scholar API 조회가 본 실행 환경에서 차단됨. 다만 IJCAI 2024 InstructEdit, WWW 2025 "Explainable and Efficient Editing for LLMs", arXiv:2410.12949 "Mechanistic Unlearning" 등 **지식 편집·기계론적 언러닝 라인이 본 논문을 반박 대상 또는 출발점으로 삼아 형성돼 있음**을 확인. 품질 게이트는 **A(NeurIPS Spotlight)** 로 통과하며 **B는 주장하지 않는다.**

## 근거 지도 (원문 위치)

| 무엇 | 원문 위치 |
|---|---|
| 핵심 claim (국소화 ↮ 편집) | **§4.3 Experiment Results** + **Table 1** (Layer .947 / Tracing .016 / Both .948), 강건성은 **Table 2** (상위 10% 집중 부분표본 .927 / .02 / .929) |
| 방법론 (Causal Tracing 정의) | **§3.2 Causal Tracing** — tracing effect 정의식, 잡음 $\sigma=0.094$, tracing window size 기본 5 |
| 방법론 (편집·지표) | **§3.3 Model Editing with ROME**, **§3.4 Editing Metrics** — rewrite / paraphrase / neighborhood score 정의식 |
| 실험 (변종 5종) | **§5.1 Editing Problem Variants** + **Figure 5**, 결과는 **§5.3** + **Table 3~6** + **Figure 6** |
| 한계 | **§8 Limitations** (3개 항목 명시), 논의는 **§6 Discussion**, 부록 강건성은 **Appendix C Robustness Experiments** |

## 선정 이유 (게이트 통과 사유 — 필수 기재)

**통과 기준: A (NeurIPS 2023 Spotlight = Tier 1 게재 확정) + E (읽을 가치 자기시험).**

**E 통과 사유 2줄**:
1. 이 논문은 독자의 *실무*를 즉시 바꾼다 — "인과 개입으로 중요한 부품을 찾았다 → 그 부품을 고치면 행동이 바뀐다"는 추론은 mechanistic interpretability 실험 설계의 기본 골격인데, 본 논문은 그 골격이 **적어도 사실 지식 도메인에서는 데이터로 지지되지 않음**을 $R^2$ 분해라는 반박 불가능한 형태로 제시한다.
2. 이 레포는 **2026-08-10에 ROME(arXiv:2202.05262)을 커버했다.** ROME만 남겨 두면 "Causal Tracing이 편집할 층을 알려준다"는, 저자 커뮤니티가 이미 정면 반박한 명제를 유통시키게 된다. 짝 논문을 붙여야 지식 상태가 정합적이 된다 — 한 줄 판결이 "읽을 필요 없음"으로 끝날 가능성이 없는 논문이다.

**요일 버킷 처리**: 오늘은 금요일 = 원거리(§F) 버킷이나, `_prompt.md` §3 대원칙("퀄리티 > 커버리지, 버킷은 선호이지 구속이 아니다")에 따라 **코어 버킷 항목으로 월경**했다. 근거는 ⓐ `_index.md` 대기 후보에 **[최우선 · 코어]** 로 등재돼 있고 "반드시 후속 커버" 지시가 붙어 있으며, ⓑ 짝 논문(ROME) 커버로부터 **4일**밖에 지나지 않아 대조 가치가 가장 높은 시점이고, ⓒ 같은 날 검토한 원거리 후보들(아래)이 품질 게이트에서 탈락했기 때문이다.

**검토한 후보 풀 (5편)**

| # | 후보 | 버킷 | 판정 |
|---|---|---|---|
| 1 | **arXiv:2301.04213** Hase et al., *Does Localization Inform Editing?* | 코어 | **선정** — 게이트 A(NeurIPS 2023 Spotlight)+E 통과, Source Lock·§4-bis 전부 통과 |
| 2 | arXiv:2505.11349 Zhang & Gilpin, *Context Parroting* | 인접 | 보류 — 게이트 A 유력하나 주 태그 `tsfm-interp`가 9로 과포화, 짝 논문(2026-08-12) 간격이 2일로 지나치게 촘촘. 대기 후보 유지 |
| 3 | *Deep limit order book forecasting: a microstructural guide* (Quantitative Finance 25(7), 2025) | 원거리 | **탈락** — QF는 게이트 A의 금융 Tier(JF/JFE/RFS/MS/JFQA) 밖, B(인용 속도) 미확인 |
| 4 | *LiT: limit order book transformer* (Frontiers in AI, 2025) | 원거리 | **탈락** — 게이트 A 불충족(워크샵/저널 티어 미달), B 근거 없음 |
| 5 | arXiv:2210.07229 MEMIT (Meng et al.) | 코어 | **탈락(규칙)** — 저자 반복 회피 규칙상 2026-09 이후 재검토(`_index.md` 대기 후보 명시) |

**보조 우선순위 확인**: `causal-intervention` 태그는 커버 6·최종 2026-08-10으로 최근이지만, 위 ⓑ(짝 논문 대조 창) 때문에 **의도적으로 연속 배치**했다. 재현성은 코드 공개(`google/belief-localization`)로 양호.
