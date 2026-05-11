# 0. 메타 & 선정 이유

## 배경 사다리

- 이 절을 이해하려면 ① "circuit" 이 신경망 안에서 특정 행동을 만들어내는 **연결의 부분그래프** 라는 mech interp 의 기본 단어, ② 정답 회로를 "이미 알고 있는" 벤치마크 (IOI 회로 — Wang et al. 2023) 가 존재한다는 점, ③ activation patching (개입을 통해 컴포넌트 영향을 분리하는 절차) 의 기본 개념 정도만 알면 된다.

## 메타 정보

| 항목 | 내용 |
|---|---|
| Canonical ID | `arXiv:2304.14997`, `dl.acm.org/doi/10.5555/3666122.3666841` |
| Venue | NeurIPS 2023 (Spotlight) |
| 저자 | Conmy · Mavor-Parker · Lynch · Heimersheim · Garriga-Alonso |
| 1 저자 권위 | Arthur Conmy: Google DeepMind 합류 전 ARENA 운영, mech interp 커뮤니티 핵심. 직전 작업으로 IOI 회로 후속·activation patching 정형화 기여 |
| 코드/데이터 | Public, `github.com/ArthurConmy/Automatic-Circuit-Discovery` (Poetry, TransformerLens 의존, 6 태스크 reproduce 스크립트) |
| 인용 수 | Semantic Scholar / Google Scholar 페이지 직접 접근 차단으로 **미확인**. NeurIPS 2023 spotlight + EAP·attribution patching 등 후속 비교 논문 (Syed 2023, EAP-IG 2024) 의 baseline 표준이라는 사실로 정성적 인용 영향력은 **mech interp 자동화 표준 비교군** 위치 |
| TL;DR (cross-source 합성) | mech interp 의 "(1) 행동 정의 → (2) activation patching 으로 중요한 abstract unit 찾기 → (3) unit 사이 연결 찾기" 3 단계 workflow 중 **(3) 단계를 알고리즘화** 하고, 단일 임계값 τ 만으로 회로 부분그래프를 자동 추출 |

## 근거 지도 (Evidence Map)

원문 PDF 본문 직접 열람이 차단되어 각 항목의 정확한 section/figure/table 번호는 **원문 본문 미열람** 표기를 우선한다. 본 해체에서 사용한 근거는:

1. **알고리즘 동작 — 1 차 출처**: 저자 GitHub `acdc/TLACDCExperiment.py` (역위상정렬 `reverse_topologically_sort_corr`, `edge.present = False` 후 metric 차이 계산, threshold 비교, `zero_ablation` 플래그, `--threshold=0.71` 데모 기본값, KL div / logit diff / NLL 메트릭 선택자). 이 코드가 본 해체의 알고리즘 절 (05_method_*) 의 직접 근거.
2. **태스크 정의 — 1 차 출처**: 저자 GitHub `acdc/ioi/`, `acdc/greaterthan/`, `acdc/docstring/`, `acdc/induction/`, `acdc/tracr_task/` 의 `utils.py` 들. 각 태스크의 prompt template, clean/corrupted dataset, 메트릭, ground-truth 회로 (tracr-reverse 18 edges, tracr-xproportion 14 edges) 가 직접 확인 가능.
3. **수치 결과 — 2 차 cross-source**: (a) NeurIPS 2023 abstract 페이지 인덱싱, (b) Syed et al. 2024 BlackboxNLP "Attribution Patching Outperforms ACDC" 표 인용, (c) EAP-IG (Hanna et al. 2024, arXiv:2407.00886) 비교 표 인용. 합치된 수치만 사용: GPT-2 Small Greater-Than 회로 **68 edges / 32,000 edges**, **5/5 component-type 재발견**, Docstring KL edge-level **ROC AUC = 0.982**, tracr-reverse·tracr-xproportion zero-ablation **AUC = 1.000**, 6 태스크 평균 ACDC **AUC ≈ 0.596** vs SP **≈ 0.692** (Syed et al. critique 시점).
4. **한계 — 1+2 차 혼합**: 저자 코드 주석 + 후속 비판 논문 (EAP-IG, Syed). 본 해체의 07_limits 는 ACDC 자체의 알고리즘적 한계 (greedy edge 제거, τ 단일 hyperparam, KL 메트릭이 클래스별 차별성을 흐림) 와 후속이 지적한 한계 (계산 비용, attribution patching 대비 ROC 열세) 를 구분 기록.

## 선정 이유

- **오늘 버킷·태그 적합도**: 월요일 코어 + `causal-intervention`(1, 가장 뒤처짐) + `mech-interp-circuits`(2) 동시 cover. _coverage.md 의 두 번째·여섯 번째 태그에 정확히 hit.
- **Axis balance**: 최근 3 주 §A(grokking) 3 회 (04-24 / 05-01 / 05-08), §B(mech interp) 2 회 (04-27 / 05-04), §C(attention-PE) 1 회 (05-04). 본 논문은 §B (mech interp 방법론) + §C 일부 (attention head 단위 회로) 를 cover 하여 axis 회전.
- **사용자 우선 읽기 목록 적합**: `_index.md` Tier 1 — Grokking primary 의 5 개 행 중 미커버 1 개 (`arXiv:2304.14997 ACDC`). Tier 1 항목 우선 선정 규칙 발동.
- **사용자 연구 연결 강도 (높음)**:
  - **APF**: 프로파일 §A 의 "PE → 2D attention motif → CNN probe → **causal intervention**" 4 단계 중 마지막 단계 가 정확히 ACDC 가 자동화한 procedure. APF 가 motif 의 인과성을 검증하려면 ACDC 의 edge-수준 ablation 절차를 그대로 차용 가능. 또한 APF 가 비판하려는 "attention pattern 이 진짜 인과적 기여인가" 질문은 ACDC 의 핵심 가정 (corrupted 분포에서 metric 차이 = 엣지 중요도) 의 타당성과 같은 축.
  - **Grokking in TS**: `must_cite.md` Tier 2 의 mech interp 방법론 backbone. Grokking 의 "phase transition 직후 어떤 circuit 이 형성됐는가" 를 측정하려면 ACDC 류 자동화가 필요. Nanda 2023 (Progress Measures) 가 Fourier circuit 을 **수작업** 으로 분리한 것을 ACDC 가 **자동화** 한다.
- **Source Lock 통과** (4 항목 중 3.5 통과): canonical ID ✓, metadata match ✓, full text 부분 (저자 코드 1 차 + cross-source 수치 2 차) △, evidence map ✓.
- **재현 가능성**: 코드 + 6 태스크 reproduce 스크립트 공개 + Colab 데모 3 개. 외부 (예: APF) 적용 비용 추정 가능.

## 처음 본 사람이 받을 첫 인상

"회로를 자동으로 찾는다" 는 표현은 두 방향으로 해석된다. (a) 신경망 안에서 "회로" 라고 부를 만한 임의의 구조를 발견한다 — 이건 ACDC 가 못 한다. (b) **이미 알려진 회로 (예: IOI, Greater-Than) 를 사람 손 없이 자동 추출한다** — 이건 ACDC 의 정확한 주장. 차이가 중요한 이유: ACDC 는 발견 (discovery) 보다는 **검증·재발견 (rediscovery)** 도구다. 발견 (de novo) 까지 가는 사다리에는 후속 작업 (HyperDAS, SFC, AutoCircuit) 이 필요하다. APF 도 motif 가 사전에 typology 로 지정되어 있고 그 motif 의 인과성을 검증하는 단계라는 점에서 같은 "검증" 입장에 가깝다.
