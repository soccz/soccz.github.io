# 09 · 내 연구와의 연결

## 배경 사다리
이 절은 IOI Circuit 논문이 사용자 (`_profile.md` 의 석사연구자) 의 두 active 트랙 — **APF (Attention Pattern Fields)** + **Grokking in TS Transformers** — 와 어떻게 부딪히는지 정리. 일반론 금지, 구체 mechanism / axis / 수식 요소 지정.

---

## 1. APF (Attention Pattern Fields) 와의 연결

### 1.1 APF 의 현재 상태
- "PE → 2D attention motif → CNN probe → causal intervention" framework.
- TMAO method falsified at n=12, **motif causality 실험 진행 중**.
- Concurrent works: `arXiv:2511.21514` (Kalnāre 2025, TS classification mech interp), `arXiv:2601.21709` (Yang ICLR 2026, TAPPA).

### 1.2 흡수할 기법

**(A) 3-축 메트릭의 APF motif 버전.** `_profile.md` §C (Attention as Explanation / PE-Attention Geometry) + APF 의 motif causality 실험 검증을 위해, IOI 의 3 축을 **motif-level** 로 격상:

| IOI 의 단위 | APF 의 단위 |
|---|---|
| Head set $C \subseteq M$ | Motif occurrence set $\mathcal{M} \subseteq A$ (attention map 의 motif 인스턴스 집합) |
| $F(C) = \mathbb{E}[\text{LD}(M_{\text{only}(C)})]$ | $F(\mathcal{M}) = \mathbb{E}[\text{Score}(M_{\text{motif-only}(\mathcal{M})})]$ |
| Mean ablation | Motif 외부 attention 패턴을 baseline distribution 으로 대체 |
| Path patching | Motif → downstream layer 의 path patching |

**APF Paper 의 §3 motif intervention 절** 에 본 논문의 3-축 메트릭을 인용하며 도입할 것. 인용 형태 초안: *"To certify that an extracted motif $\mathcal{M}$ is sufficient (faithfulness), closed (completeness; \|F(\mathcal{M}\setminus K) - F(A\setminus K)\| small for all K), and necessary (minimality; F(\mathcal{M}) - F(\mathcal{M}\setminus \{v\}) large for each v ∈ \mathcal{M}), we extend the three-axis validation framework of Wang et al. (2023) from attention-head circuits to motif occurrences."*

**(B) Path patching 의 motif-edge 격상.** IOI 의 sender → receiver 가 head 단위인 것을, APF 에서는 **motif → 다음 layer 의 motif** 의 path 단위로 적용. 이게 APF 의 "motif causality" 실험의 정량 프레임. 코드 ref: `redwoodresearch/Easy-Transformer/utils_circuit_discovery.py` 의 `path_patching()` 시그니처.

**(C) 6-class 분류의 motif-vocabulary 화.** IOI 가 head 를 6 class 로 분류했듯, APF 도 motif 를 (diagonal / stripe / block / edge / spike / checker 의 motif typology) 로 분류한 상태. **두 분류 체계의 매핑** 을 작성하면 APF 의 motif 가 "어떤 IOI-style 기능과 닮은가" 의 비교 가능:
- Diagonal motif ↔ previous-token head (직전 토큰을 본다).
- Block motif ↔ duplicate-token head (동일 token 군집 표시).
- Spike motif ↔ name-mover head (특정 위치로 정보를 옮긴다).
- Stripe motif ↔ s2 inhibition head (특정 위치 군집을 어디로든 보낸다).
- Edge / Checker ↔ TBD (APF 에서 새로 발견된 motif 일 가능성).

이 매핑이 APF Paper §4 의 "motif → function" 의 핵심 표가 될 것.

### 1.3 충돌 / 경쟁 지점

**충돌 1 — 단위 격상의 정당성.** IOI 는 head 가 적정 단위라고 가정. APF 는 **motif (head 의 attention pattern)** 를 단위로 본다. 두 입장은 부분적으로 충돌:
- 같은 head 가 다른 prompt 에서 다른 motif 를 만들면, APF 의 motif 단위가 더 미세하다.
- 반대로 같은 motif 가 여러 head 에서 동시에 발현되면, IOI 의 head 단위가 자연스럽다.
- **APF Paper 에서 명시할 입장**: "motif 가 head 보다 미세한 단위인 경우 (motif type 이 동일하지만 다른 head 에서) 에 한해 motif 단위가 우위 — 그 외에는 head 단위와 호환".

**충돌 2 — Closed-form metric vs sampling-based metric.** IOI 의 completeness 는 $2^{26}$ 부분집합을 sampling 으로 근사. APF 의 motif occurrence 가 충분히 작으면 (예: $|\mathcal{M}| \leq 10$) **전수 평가 가능** 으로 격상 — 이게 APF 의 메트릭 우위.

### 1.4 인용 포인트

APF Paper draft 의 인용 형식 (Lemma·정의 인용):
1. **§2 Background** — "Wang et al. (2023) introduced the three-axis circuit validation framework (faithfulness, completeness, minimality) for attention-head circuits in GPT-2 small; we extend this to motif occurrences."
2. **§3.2 Path patching for motifs** — "Following the path patching primitive of Wang et al. (2023) and Goldowsky-Dill et al. (2023), we define motif-level sender-receiver interventions ..."
3. **§4 Limitations** — "Wang et al. (2023, Section 7) discuss the fragility of discovered circuits under adversarial prompts; our motif-level circuits inherit this fragility and we test it via [our advex protocol]."

### 1.5 반면교사

본 논문이 못한 것 → APF 가 다룰 것:
- IOI 는 **GPT-2 small + 자연어 IOI** 한정. APF 는 **TS Transformer + 시계열 motif** 로 도메인을 옮기되, 같은 framework 의 robustness 를 보여주는 cross-domain 입증.
- IOI 는 **fixed weight** 분석. APF 는 학습 동안의 motif emergence 시간축 (`time × motif × PE`) 분석 — TAPPA / Nanda 의 progress measure 정신.
- IOI 의 **6 vs 7 class 표기 불일치** 가 보여주는 "사후 명명의 임의성" 문제 → APF 는 motif typology 를 **a priori 정의** (k-means clustering before causal intervention) 로 시작해 사후 명명 배제.

---

## 2. Grokking in TS Transformers 와의 연결

### 2.1 Grokking 의 현재 상태
- "Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection.
- 22 must-cite, 5 priority Tier 1, Week 1 setup, P2 logistic 4-layer 실험 진행 중.

### 2.2 흡수할 기법

**(A) Generalizing circuit 의 식별 절차.** Grokking 현상에서는 학습 후반에 **generalizing solution** 이 갑자기 emerge. 그 generalizing solution 이 어떤 head/feature 집합인지를 IOI 의 절차로 식별 가능:
1. Train-end model 에서 IOI-style path patching → generalizing-task-relevant head 집합 $C_G$ 추출.
2. 학습 동안 $C_G$ 의 활성·구조가 어떻게 변하는지 progress measure 로 추적 (Nanda 2023 의 시간축).
3. $C_G$ 가 일정 시점 $t^*$ 에서 emerge 하는지, 또는 점진적으로 형성되는지 결정.

Grokking thesis 의 §3 또는 §4 (실험 설계) 에서 본 논문의 3 축 메트릭 + path patching 을 **timestamp 별 회로 동학** 으로 격상.

**(B) Memorizing vs generalizing circuit 의 동시 추적.** 본 논문이 "회로 (positive) + 견제 회로 (negative name mover)" 를 동시에 그렸듯, grokking 에서 **memorizing circuit $C_M$ + generalizing circuit $C_G$** 의 동시 추적이 가능. 두 회로의 **transition** 이 grokking 의 phase 정의:

$$\text{phase}(t) = \frac{F(C_G)(t)}{F(C_G)(t) + F(C_M)(t)}$$

- **기호 뜻**: 시점 $t$ 에서 generalizing circuit 의 기여 비율.
- **일상 비유**: "두 회로가 같은 일에 협업할 때, 어느 쪽이 더 많이 일하나" 의 시간별 추적.
- **왜 이 형태**: phase 가 0 에서 1 로 sigmoid 형태로 전이하면 grokking; 점진적이면 다른 동학.
- **조심할 점**: 두 회로가 겹칠 수 있음 (head overlap). 분리 가능성에 가정 필요.

### 2.3 충돌 / 경쟁 지점

**충돌 1 — Fixed weight 가정.** IOI 는 train-end 의 단일 weight snapshot 분석. Grokking 은 본질적으로 **training 동안의 weight 동학**. 본 논문의 framework 가 weight 가 변하는 setting 에서 어떻게 작동하는지 미증명 — Nanda 의 grokking 회로 추출이 이 gap 을 일부 메우지만 본 논문의 3 축 메트릭은 시간축으로 격상되지 않은 상태.

**충돌 2 — Natural language 분야 의존.** IOI 는 자연어 LLM. Grokking thesis 는 **TS / logistic map / modular arithmetic**. domain 이 다름. logit difference 의 정의를 TS forecasting 의 MSE / quantile loss 차이로 격상하는 작업 필요.

### 2.4 인용 포인트

Grokking thesis draft 의 인용 형식:
1. **§2 Related work — Mech interp methodology** — "Wang et al. (2023) demonstrated that natural language tasks in small LLMs can be reverse-engineered into attention-head circuits validated by faithfulness, completeness, and minimality; we adapt this framework to track the temporal emergence of grokking circuits in TS Transformers."
2. **§3 Methodology — Circuit dynamics** — "We extend the three-axis validation of Wang et al. (2023) to a time-indexed setting: $F_t(C)$, with weights from training checkpoint $t$, allows us to track the emergence of generalizing circuits during grokking."
3. **§5 Discussion** — "Unlike the fixed-weight IOI circuit of Wang et al. (2023), our grokking circuits exhibit phase-transition emergence around step $t^*$; the three-axis metrics provide a quantitative grokking timestamp."

### 2.5 반면교사

본 논문이 못한 것 → Grokking thesis 가 다룰 것:
- IOI 의 fragility (Claim 4) 는 학습 setting 의 in-distribution 한정. Grokking thesis 가 **non-stationarity (regime shift) 에서의 회로 robustness** 를 cross-test.
- IOI 의 attention head 단위가 LLM scale 의존. Grokking thesis 는 **작은 TS Transformer (4-layer 정도)** 에서 같은 framework 적용 가능성 검증 → small-scale generality 입증.

---

## 3. `_profile.md` §A~F 매핑

본 논문이 가장 강하게 연결되는 영역:
- **§B Mechanistic Interpretability / Circuit Analysis** — 100% match. 본 논문이 §B 의 표준 reference.
- **§C Attention as Explanation / PE-Attention Geometry** — 70% match (attention head 단위 분석이 §C 의 머리 부분).
- **§A Grokking / Delayed Generalization** — 50% match (회로 동학 격상 가능).
- **§D TS Transformers / TSFM Interp** — 30% match (Kalnāre 2025 의 TS 격상으로 연결).
- **§E 금융 시계열 응용** — 10% (간접). 금융 모델의 회로 추출이 가능하다는 일반론적 정당화.
- **§F 원거리** — 10% (간접).

**결론**: 본 논문은 **§B 의 코어 reference + §C/§A 의 보조 toolkit**. APF (§C 중심) + Grokking thesis (§A 중심) 양 track 모두에 적용 가능한 표준 framework 를 제공.

---

## 4. 우선순위 작업 항목

1. **APF Paper draft §3 (motif intervention)** 에 본 논문의 3-축 메트릭 인용 — 우선순위 1.
2. **APF Paper draft §4 (motif typology)** 에 6-class IOI 분류와의 매핑 표 추가 — 우선순위 2.
3. **Grokking thesis §3 (Methodology)** 에 time-indexed faithfulness 격상 인용 — 우선순위 3.
4. **APF 코드 base 에 `path_patching()` 함수 구현** — Easy-Transformer 의 `utils_circuit_discovery.py` 의 시그니처 참고. 우선순위 4.
5. **Motif-level adversarial test (`apf_advex.py`)** 작성 — IOI 의 `advex.py` 정신 — 우선순위 5.

각 항목은 본 논문 인용으로 정당화 가능.
