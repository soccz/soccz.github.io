# 08 · 이론적 계보

## 배경 사다리
이 절은 본 논문의 **직계 조상**, **동시기 평행 연구**, **직계 자손** 을 정리. mech interp 분야의 짧은 (4-5 년) 역사에서 본 논문이 차지하는 위치를 그린다.

---

## 1. 이론적 조상 (4 편)

### 조상 1 — A Mathematical Framework for Transformer Circuits (Elhage et al., Anthropic 2021)
**위치**: `transformer-circuits.pub/2021/framework/index.html`. arXiv ID 없음, Anthropic interpretability blog.

**직접 연결선**:
- **QK / OV circuit 의 분해**: head 의 attention pattern = QK circuit, output projection = OV circuit. 본 논문이 head 의 기능 명명을 "어떤 OV direction 인가" 로 검증할 때 이 분해를 그대로 사용.
- **Residual stream as communication channel**: 회로의 sender → receiver 가 residual stream 을 통해 통신한다는 정형화 — path patching 의 정확한 의미 (sender output 만 stream 에 다르게 더해도 receiver 입장에서는 stream 의 변화만 본다) 의 근거.
- **Virtual attention head**: 두 head 의 composition 이 사실상 새로운 "virtual head" 를 만든다는 발상. 본 논문의 induction-prev-token composition (Olsson 2022 의 induction head 발견) 이 이 framework 의 직접 응용.

**한 문장**: 본 논문이 **수학적 어휘** 를 빌려온 자리.

### 조상 2 — In-context Learning and Induction Heads (Olsson et al., Anthropic 2022, arXiv:2209.11895)
**직접 연결선**:
- **Induction head** 라는 구체적 회로 단위의 발견. 본 논문의 induction class (4 head, layer 5-6) 가 이 head 의 IOI-task 내 instantiation 임을 확인.
- **Composition (previous-token + induction)** 의 2-head 회로가 자연어 LM 안에서 작동한다는 첫 사례. 본 논문이 이를 **6-class 26-head 의 더 큰 회로** 로 확장.
- 본 논문의 발견 절차의 영감원 — "회로를 발견할 수 있다" 는 existence proof.

**한 문장**: 본 논문이 **방법론적 영감** 을 받은 자리.

### 조상 3 — Locating and Editing Factual Associations in GPT (Meng et al., NeurIPS 2022, arXiv:2202.05262 = ROME)
**직접 연결선**:
- **Causal mediation analysis** 를 GPT 모델에 처음 본격 적용. ROME 의 activation patching 이 본 논문의 path patching 의 단순한 (path 없이) 버전.
- ROME 은 MLP 위주, 본 논문은 attention head 위주 — 두 component 의 분담을 명확히 한 쌍.
- **"인과 개입이 회로 발견의 정답"** 이라는 메타를 mech interp 분야에 박은 자리.

**한 문장**: 본 논문이 **인과 추적의 정당성** 을 빌려온 자리.

### 조상 4 — Causal abstractions / Interchange Intervention Training (Geiger et al. 2021/2022)
**직접 연결선**:
- "활성을 다른 prompt 의 활성으로 swap" 이라는 swap-intervention 의 형식화. 본 논문의 path patching 의 sender swap 이 이의 직계.
- **Causal abstraction** 으로서 neural network 의 일부를 알고리즘으로 mapping 하는 framework. 본 논문이 26-head 회로를 IOI-알고리즘 의 abstraction 으로 본다는 메타와 일치.

**한 문장**: 본 논문이 **수학적 인과 도구** 를 빌려온 자리.

---

## 2. 평행 연구 (3 편)

### 평행 1 — Progress Measures for Grokking via Mechanistic Interpretability (Nanda et al., ICLR 2023, arXiv:2301.05217)
**같은 시기, 다른 접근**: 본 레포 2026-04-27 cover.
- **공통점**: attention head 단위 회로 발견 + ablation 검증.
- **차이점**:
  - Nanda 는 **toy 합성 task** (modular addition) + **1-layer**, Wang 은 **자연어** + **12-layer**.
  - Nanda 는 **Fourier feature** 라는 task-specific representation 발견, Wang 은 **6 functional class** 의 head 분류.
  - Nanda 는 **progress measure** (학습 동안 발현 추적), Wang 은 **end-of-training circuit** 만.

**왜 본 논문이 평행에서 우세** (자연어 분야):
- 자연어 LLM 분석의 표준을 제공.
- 회로 검증의 3-축 메트릭이 후속 표준이 됨.

**왜 Nanda 가 우세** (학습 동학 분야):
- Grokking 동안 회로가 어떻게 emerge 하는지 시간 축 추적 — Wang 은 fixed weight 분석만.

### 평행 2 — Discovering Latent Knowledge (Burns et al. 2022, CCS)
**같은 시기, 다른 접근**: representation-level interpretability.
- **공통점**: LLM 의 internal representation 에서 task-relevant 정보 추출.
- **차이점**: Burns 는 unsupervised, contrastive — representation space 의 direction 발견. Wang 은 supervised, ablation — head 식별.

**왜 본 논문이 우세**: 인과 검증 (ablation) 이 표현 검증 (linear probe) 보다 강한 evidence.

**왜 Burns 가 보완적**: scale 가능 — representation 단위가 head 단위보다 자동화 친화적.

### 평행 3 — Localizing Model Behaviors with Path Patching (Goldowsky-Dill et al. 2023)
**같은 시기, 동일 도구**: Goldowsky-Dill 이 path patching 의 도구를 정식 정의한 paper. 본 논문이 path patching 을 task-specific 으로 적용. 두 논문은 doctor-patient 관계 — 도구 개발자 vs 도구 사용자.

**왜 본 논문이 더 인용됨**: 도구 자체보다 **도구의 첫 large case** 가 분야 표준이 되기 쉬움.

---

## 3. 직계 자손 (3 편)

### 자손 1 — Towards Automated Circuit Discovery (ACDC) (Conmy et al., NeurIPS 2023 Spotlight, arXiv:2304.14997)
**본 레포 2026-05-11 cover.**

**관계**:
- 본 논문의 **수동 발견 절차의 자동화**. Conmy 가 본 논문 1 저자 중 한 명 — 본인이 직접 자동화.
- ACDC = recursive reverse-topological edge prune. 본 논문의 manual top-down search 를 알고리즘화.
- **벤치마크로 본 논문의 IOI 회로를 ground truth** 로 사용. ACDC 의 recall/precision 은 IOI 회로 = ground truth 가정 위에서 측정.
- **확장**: edge 단위 ablation + KL/LD/NLL 3 메트릭 비교 + 6 tasks (IOI 포함).

**메타 의미**: 자동화가 manual baseline 을 추월한 게 아니라 manual baseline 을 **재현·확장** 했다 — 본 논문의 회로 정의가 옳음을 입증.

### 자손 2 — Sparse Feature Circuits (Marks et al., ICLR 2025 Oral, arXiv:2403.19647)
**본 레포 2026-05-15 cover.**

**관계**:
- 단위 격상: attention head → SAE feature.
- 본 논문의 3-축 메트릭 (faithfulness/completeness/minimality) 의 본질을 SAE feature 단위에서 재현.
- **SHIFT** 기법 (bias 제거를 위한 feature ablation) 이 본 논문의 head ablation 의 직계 후손.
- 본 논문에서 fragility 였던 "polysemanticity 문제" 를 SAE 단위 격상으로 부분 해결.

**메타 의미**: 본 논문의 한계 (head 단위의 한계) 를 진정으로 메운 자손. 단위만 바꿔도 같은 framework 적용 가능 — 본 논문의 framework 의 universality 입증.

### 자손 3 — Adaptive Circuit Behavior and Generalization in Mechanistic Interpretability (2024+, arXiv:2411.16105)
**관계**:
- 본 논문의 IOI 회로의 **adversarial fragility** (Claim 4) 를 정면으로 다룬 후속.
- 회로가 prompt 분포 변화에 어떻게 적응하는지 검증.
- 본 논문의 한계가 **연구 화두** 가 된 직접 자손.

**메타 의미**: 본 논문이 정직하게 공개한 fragility 가 분야의 다음 화두를 만듦.

---

## 4. 후손 예측 (이미 일부 나옴)

1. **TS-task 의 IOI** — 시계열 작업에서 head 단위 회로를 같은 절차로 발견하는 연구. Kalnāre 2025 (`arXiv:2511.21514`) 가 본 논문의 framework 를 TS classification 에 적용. **APF 의 motif 발견이 정확히 이 방향**.
2. **Multi-task 회로 재사용** — 같은 head 가 여러 task 의 회로에서 어떻게 재사용되나. polysemanticity vs reuse 의 경계.
3. **Train-time circuit emergence** — Nanda 의 grokking circuit 처럼 IOI 회로가 학습 동안 언제·어떻게 emerge 하는지 — Grokking track 의 잠재 주제.

---

## 5. 본 논문의 분야 위치

본 논문은 mech interp 의 **manual endpoint** 다:
- **이론적 prequel** (Elhage Mathematical Framework) → **toy validation** (Olsson Induction Heads, Nanda Modular Addition) → **manual large case (Wang IOI)** → **automated extension** (Conmy ACDC) → **unit shift** (Marks SFC) → **adaptive analysis** (현재 진행).

본 논문 없이는 ACDC·SFC 의 evaluation 이 ground truth 가 없어 진행 불가능. **수동 ground truth 의 정직한 endpoint** 가 본 논문의 정체.
