# 01 · 메타 & 선정 이유

## 식별자
- **arXiv**: 2211.00593 (v1: 2022-11-01)
- **OpenReview**: `NpsVSN6o4ul` (ICLR 2023)
- **ICLR 2023 poster**: `iclr.cc/virtual/2023/poster/11341`
- **Semantic Scholar paper hash**: `6edd112383ad494f5f2eba72b6f4ffae122ce61f`
- **DOI**: 미부여 (conference paper, OpenReview only)
- **인용 수**: 본 환경에서 SemanticScholar 직접 접근 차단, 검색 인덱스로만 노출 → **정확 수치 미확인** (저자 후속 ACDC 2023, SFC 2024 가 본 논문을 ground truth 로 인용하는 사실에서 mech-interp 분야의 reference standard 위치는 정황 확정)

## 저자 권위
- **Kevin Wang**, **Alexandre Variengien**, **Arthur Conmy**, **Buck Shlegeris** — Redwood Research (LLM 안전·해석 비영리). 이 중 **Conmy** 는 본 논문 직후 **ACDC** (NeurIPS 2023 Spotlight, 2026-05-11 본 레포에서 cover) 1저자로 IOI 회로 발견 절차를 자동화. **Variengien** 은 후속 mech interp 논문 다수.
- **Jacob Steinhardt** — UC Berkeley CS, alignment·robustness 분야 시니어. Anthropic Mathematical Framework (Elhage 2021) 의 외부 협업 라인과 연결.
- 저자 라인업이 그대로 mech-interp 의 "수동 표준 → 자동화" 진화 축을 형성. 본 논문은 그 축의 **수동 endpoint** 다.

## 근거 지도 (Evidence map)
원문 PDF 본문은 본 환경에서 차단. 아래 4 지점은 **저자 공식 GitHub** `redwoodresearch/Easy-Transformer` 코드에서 확인 가능하며, 본 해체의 1차 근거다.

| 본 해체 위치 | 원문 추정 위치 | 코드 근거 (직접 확인) |
|---|---|---|
| §3 IOI 작업 정의·15+15 템플릿·NAMES/PLACES/OBJECTS | Section 3 (Task definition) / Appendix B (Dataset details) 추정 | `easy_transformer/ioi_dataset.py` BABA_TEMPLATES (15), ABBA_TEMPLATES (15), NAMES (~100), PLACES (8), OBJECTS (8), default N=500 |
| §4 회로 구조 26-head × 6/7-class | Section 4 (Circuit description) / Fig 1 또는 Fig 2 추정 | `easy_transformer/ioi_circuit_extraction.py` `CIRCUIT` dict (name mover 11, negative 2, s2 inhibition 4, induction 4, duplicate token 3, previous token 2) |
| §5 Path patching 절차 | Section 5 (Discovering the circuit) 추정 | `circuit_discovery.py` + `easy_transformer/utils_circuit_discovery.py` `path_patching()` 함수 시그니처 |
| §6 Faithfulness/Completeness/Minimality | Section 6 (Validation) / Fig 5-7 추정 | `easy_transformer/completeness.py` `difference_eval`(`F(C\K) − F(M\K)` 형식), `circuit_eval`, `cobble_eval` · `minimality.py` (head-wise drop) |
| §7 한계·실패 사례 | Section 7 또는 Appendix E (Limitations) 추정 | 코드 `advex.py` (adversarial examples) 의 존재로 "fragility under prompt distribution shift" 보고를 정황 확정 |

**원문 PDF 의 정확 수치 (Table N 의 logit difference, Fig N 의 accuracy bar) 는 확인 불가** → 본 해체는 정성적 구조와 코드 verbatim 만 단정.

## 선정 이유 (왜 지금 이걸 봐야 하는가)

1. **버킷·태그·우선순위 일치**: 오늘 = 월요일 코어 버킷. `_index.md` Tier 2 (Mech interp methodology) 의 미커버 priority 항목. mech-interp-circuits 태그는 `_coverage.md` 기준 마지막 2026-05-11 (5 주 갭) → §B 코어 axis 의 가장 큰 공백.
2. **Axis balance 회복**: 최근 4 회 월요일 코어 = §A(05-25 Liu Effective) → §C(05-18 Jain-Wallace) → §B(05-11 ACDC) → §C(06-08 Kazemnejad). §B 5 주 부재. 본 논문이 정확히 §B 코어.
3. **사용자 active 프로젝트 직접 연결**:
   - **APF**: APF 의 핵심 가설 — "PE × motif → 회로 기능" — 은 motif 가 "회로 단위" 임을 전제한다. IOI 는 motif 가 아니라 **attention-head 단위** 로 회로를 정의했고, 그 정의에 3-축 평가를 부여했다. APF 가 회로 발견 후 motif 의 **유효성을 검증** 하려면 faithfulness/completeness/minimality 의 motif 버전을 만들어야 한다.
   - **Grokking**: Grokking circuit (Nanda 2023) 은 "Fourier-feature circuit" 을 식별하지만 IOI 처럼 ablation-기반 3-축 평가는 통상 한 축 (faithfulness) 만 보고한다. 본 논문이 정의한 completeness/minimality 를 grokking circuit 에 이식하면, "이 회로가 진짜로 generalize 메커니즘인가" 의 **반증 가능한 검증** 이 가능해진다.
4. **계보적 핵심성**: ACDC (Conmy 2023) 가 자동화한 절차의 **수동 ground truth** 가 IOI. SFC (Marks 2024, 2026-05-15 cover) 가 비지도로 회로를 찾을 때도 IOI 를 benchmark 로 사용. 이미 다룬 두 자동화 논문을 진정으로 비판하려면 그 원점인 IOI 를 알아야 한다.
5. **Tier 1 venue**: ICLR 2023 (Top conference). Source Lock 통과 후보 중 priority 매칭 + venue tier 모두 1순위.
