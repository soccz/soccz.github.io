# 09 내 연구와의 연결 (APF + Grokking)

> **🧒 본 챕터는 "내 manuscript 의 base 정의서"**: 다른 챕터가 *paper 자체의 해석* 이라면, 본 챕터는 *내 연구 트랙 (APF, Grokking) 이 본 paper 의 어디에 *직접 의지* 하는지* 의 명시. 본 paper 가 *baseline reference* 인 4 곳 + *내 contribution 의 *3 가지 새 axis* 의 좌표. 따라서 본 챕터는 *제 3 자 review* 가 아닌 *내 작업 노트* 의 톤.

> **연결 강도 우선 표시**: 본 논문 ↔ **§C (Attention-as-Explanation / PE-Attention Geometry)** = **매우 강함 (APF 의 출발 명제 직격)**. ↔ **§B (Mech interp / Circuit)** = **강함 (intervention 패러다임 공유)**. ↔ **§A (Grokking)** = **중간 (학습 dynamics 와 attention 의 변화 — 간접)**. ↔ **§D (TS Transformer)** = **약함 → 중간 (BiLSTM → Transformer 확장 + TS 도메인 attention 의 explanatory)**.

## 흡수할 기법 — 4 가지

### (1) APF 의 *Motif Causality 검증 protocol* 의 직접 baseline

내 APF (`Attention Pattern Fields`) 프로젝트의 핵심 가설:
> "PE choice → 2D attention motif (diagonal/stripe/block/edge/spike/checker) → motif 가 모델 예측에 *인과적* 으로 기여"

이 가설이 Jain-Wallace 의 H1·H2 검증을 *그대로* 받게 된다.

**구체 흡수 지점**:
- APF 의 *motif causality 실험* 에서 본 논문의 *adversarial attention* 절차를 *2D motif* 버전으로 확장 적용. 즉:
  $$\max_{M \in \mathcal{M}_{\text{motif}}} \text{distance}(M_{\text{orig}}, M^*) \quad \text{s.t.}\quad |\hat{y}(M_{\text{orig}}) - \hat{y}(M^*)| < \epsilon$$
  여기서 $M \in \mathbb{R}^{T \times T}$ 는 *attention 행렬* (motif), $\mathcal{M}_{\text{motif}}$ 는 motif typology constraint set. 본 논문의 1D adversarial 을 2D 로 일반화 + motif typology 제약 추가.
- APF 의 motif 가 *진짜로* 예측에 인과적이라면 adversarial M\* 이 발견되더라도 *motif typology 가 같은 부류 내* 에서만 가능해야 한다는 *부분적 신뢰성* 주장으로 본 논문의 비판을 *부분적* 으로 우회 가능.

**인용 초안 (APF 논문 §3 또는 §4)**:
> "Following Jain and Wallace (2019), we examine whether learned attention patterns provide a *faithful* account of model decisions, using both correlation-based (H1) and counterfactual (H2) probes. Where Jain and Wallace evaluated 1D token-level attention distributions $\alpha \in \Delta^{T-1}$, we extend the protocol to 2D attention matrices $M \in \mathbb{R}^{T \times T}$ and add motif-typology constraints (Eq. X), targeting *motif-level* rather than *token-level* faithfulness. This distinction matters because [...]"

### (2) Grokking 연구의 *attention dynamics over training* 의 *post-grok* validity 검증

내 Grokking 프로젝트 (`Grokking in Time Series Transformers`) 에서, *pre-grok* (memorization 단계) 와 *post-grok* (일반화 단계) 의 attention pattern 차이가 *진짜 의미 있는가* 라는 질문에 본 논문의 H2 가 *그대로* 적용 가능.

**구체 흡수 지점**:
- *Pre-grok* attention 분포의 random permutation 으로 *output 차이가 큰가* vs *post-grok* 에서 *작은가* 의 비교. 만약 *post-grok* 에서 permutation 영향이 *오히려 크다* 면, *일반화하는 회로* 가 *attention 분포에 더 의존* 함을 의미 — *attention 이 회로의 일부* 라는 mechanistic 주장의 보강.
- 반대로 *pre-grok* 에서 permutation 영향이 *더 크다* 면, *memorization 단계의 attention 이 더 specific* 하지만 *generalization 단계에서는 attention 이 redundant* (다른 path 로도 같은 출력 가능) — Nanda 2023 의 *Fourier circuit* 이 *attention 외부* 에 있다는 발견과 일관.

**인용 초안 (Grokking 논문 §X)**:
> "We adapt Jain and Wallace (2019)'s counterfactual attention test to track *how attention faithfulness evolves* across the grokking transition. Specifically, we measure the median TVD under attention permutation at three checkpoints — pre-grok, mid-transition, post-grok — across our synthetic and TS-derived tasks (Sec. X). A monotone *increase* in faithfulness would suggest that the late-emerging generalizing circuit is *attention-mediated*, while a *decrease* would support the hypothesis that the circuit operates through MLP / position-encoded pathways."

### (3) *Encoder mixing 강도 vs faithfulness* 의 메커니즘 가설을 PE 로 확장

본 논문의 *Average < CNN < BiLSTM* 의 mixing 강도 순서 → faithfulness 감소 순서. 이 패턴의 메커니즘 가설을 PE 로 확장:

**가설**: PE choice 도 *mixing 강도* 를 조절 가능. 특히 NoPE → token identity 는 *순수히 self-attention 에 의존* → mixing 패턴이 *학습된* 것이며 *position-agnostic*. RoPE → position 의 *국소* 정보가 query/key 에 *주입* → mixing 이 *position-anchored*. ALiBi → *position 거리 의존 bias* → mixing 이 *기하학적*. 이 3 가지 PE 가 *mixing 강도 + 기하학적 anchoring* 측면에서 다르므로, *faithfulness 도 다를* 것이라는 가설.

**구체 실험**: 같은 task, 같은 architecture, PE 만 바꾼 후 H1·H2 의 차등 측정. 본 논문의 *encoder ablation* 을 *PE ablation* 으로 *대체*. APF 의 *PE × motif* 격자에 H1·H2 layer 를 추가.

### (4) *TS 도메인* 에서 attention 의 explanatory 가 *언제* 유효한가의 boundary 결정

본 논문은 *NLP* 에서 BiLSTM attention 의 *대부분 case* 가 explanatory 가 아니라는 결론. *TS 도메인* (내 두 active 트랙의 응용 영역) 에서는:
- TS 는 *연속적 신호* — token 단위 importance 보다 *time-window/주기* 단위 importance 가 자연스러움.
- *Patch-based* (PatchTST) 또는 *variate-wise* (iTransformer) attention 은 *집계 수준* 이 달라서 본 논문의 결과가 직접 적용되지 않을 가능성.

**구체 흡수**: APF 또는 Grokking 논문 §6 (도메인 일반화 논의) 에 본 논문을 *TS 도메인 boundary 미발견* 의 직접 인용으로 언급. APF 의 실험에서 *TS-specific* attention faithfulness 의 격자 sweep 결과를 *본 논문 결과와 비교* 하여 "*TS 에서는 NLP 보다 attention 이 더 faithful 인가*" 를 답.

## 충돌 / 경쟁 지점

### 충돌 1 — APF 의 motif causality 가 H2 를 통과해야 한다는 *부담*

본 논문의 H2 가 통과 못 한 attention 은 *explanation* 으로 신뢰 불가. APF 가 motif causality 를 주장하려면 motif 의 H2 통과 (adversarial motif 가 *없음* 또는 *typology 제약 하에서만 가능*) 를 보여야 함.

**대응 전략**: APF 의 *constraint set* $\mathcal{M}_{\text{motif}}$ 를 사용. 본 논문은 *unconstrained* simplex 에서 adversarial 을 찾았기에 통과 어렵지만, APF 는 *motif typology* (자연 발생 가능한 분포의 manifold) 안에서만 검색하므로 *질적으로 다른* 검증. "*같은 motif typology 안의 다른 위치* 가 같은 출력을 내는가" vs "*다른 motif typology* 가 같은 출력을 내는가" 의 분리 필요.

### 충돌 2 — *Faithfulness 의 정의* 자체에 대한 입장 차이

본 논문은 *strict faithfulness* (출력의 인과) 만 신뢰. 그러나 APF 의 *motif* 는 *통계적 prior* (PE 가 만들어내는 *기대* 패턴) 이지 *instance-level 결정 인과* 가 아닐 수 있다. APF 가 *population-level* explanation 을 *instance-level* faithfulness 와 *분리* 하여 정당화해야 함.

**대응 전략**: APF 논문에서 *명시적* 으로 "*motif claim* 은 *population-level distributional* 주장이며 *instance-level token-attribution* 주장이 아님" 을 선언. 본 논문 결과는 *후자* 에 대한 비판이므로 APF 의 *전자* 주장을 *원리적으로* 무력화하지 않음. (그러나 reviewer 가 두 주장을 *혼동* 할 위험 — 명료한 글쓰기 필수.)

## 인용 포인트 — 구체 위치

| APF 논문 위치 | 인용 형태 |
|--------------|----------|
| §1 Introduction 첫 문단 | "Attention's role as a faithful explanation has been actively debated since Jain and Wallace (2019)... we operate one level above token attribution, on the *motif* level." |
| §2 Related Work | 본 논문 + Wiegreffe-Pinter + Vashishth 의 3편 *para*. |
| §3 Methodology — Motif Causality 절 | "Our protocol extends Jain and Wallace (2019)'s adversarial attention test [Eq. X] from 1D simplex to 2D motif-constrained search." |
| §6 Discussion — Faithfulness vs Plausibility | "Distinguishing distributional motif claims (population-level) from token-attribution faithfulness (instance-level) clarifies why the Jain-Wallace concern does not directly translate." |

| Grokking 논문 위치 | 인용 형태 |
|-------------------|----------|
| §3 Probe Methodology | Permutation TVD 를 grokking transition tracker 의 하나로 인용. |
| §5 Results — Pre vs Post Grok Attention | "We observe a monotone shift in attention faithfulness (Jain-Wallace TVD metric, Sec. 3) across the grokking transition; this provides circuit-level evidence beyond progress measure correlation." |

## 반면교사 — 본 논문이 *못한 것* 을 내가 다룰 방법

1. **Multi-layer / multi-head 결합 attention 의 검증 부재** → APF 가 *Transformer multi-head* 의 *head-aggregated* motif (max/avg/rollout) 에 대해 H1·H2 를 직접 적용. 본 논문이 못 한 영역을 채움.
2. **PE choice 의 영향 부재** → APF 의 *PE × motif* 격자 자체가 본 논문이 *완전히 누락* 한 차원. PE 가 attention 의 기하학적 prior 를 *조절* 한다는 인과 사슬을 APF 가 *최초로* 격자 sweep.
3. **TS 도메인 부재** → Grokking 트랙이 TS 시계열 (sin, logistic, ETT) 에서 attention faithfulness 가 NLP 와 어떻게 다른지 *최초* 보고 가능.
4. **Faithfulness 의 *circuit-level* 정의 부재** → 본 논문은 *instance-level token attribution* 만 검증. 나는 Nanda 2023 + ACDC + Sparse Feature Circuits 의 *회로 단위* faithfulness 와 결합한 *circuit-attention joint* 검증 protocol 을 시도 가능. (Grokking 트랙의 *novel methodology contribution*.)

## 핵심 한 문장

> 본 논문은 *APF 의 H1·H2 통과* 라는 분명한 reviewer 기대선을 만들어주며, 동시에 *motif level / population level / PE-anchored / TS-domain* 의 4개 차원에서 APF + Grokking 이 *본 논문이 닫지 못한 미발견 영역* 을 *명시적으로 차지* 할 수 있는 *수사적 기회* 를 제공한다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **APF 의 *4 흡수 지점* 중 *manuscript 의 main figure* 후보는?**
2. **2 충돌 (motif H2 통과 / faithfulness 정의) 중 *reviewer 가 더 자주 공격* 할 곳?**
3. **반면교사 4 영역 중 *가장 publishable* 한 새 contribution?**

### 답변

1. **(3) Encoder mixing 강도 → PE 로 확장** — *PE × faithfulness 격자* 의 *quantitative correlation figure*. 본 paper 의 *3-encoder 비교* 의 *PE 변형* — 직접적 *visual continuation*. APF manuscript 의 *Figure 1 / Figure 2* 의 강력한 후보. (1) motif causality 의 2D 적대적은 *intermediate result*, (2) Grokking transition tracker 는 *별 트랙*, (4) TS boundary 는 *future work*.

2. **(2) Faithfulness 정의 충돌** — *population-level distributional* (APF) vs *instance-level token attribution* (본 paper). Reviewer 의 *흔한 confusion*: "*motif* 라 부르나 사실 *attention 분포의 합쳐진 형태* 인데, instance-level 의 attention 분포가 *faithful 아니다* (paper 결론) → motif 도 *faithful 아니다*". 이 *추론 오류* 를 *논문 §1 의 명시 distinction* 으로 사전 차단 필수. APF manuscript 가 *항상 위험* — 마침내 *명료한 wording* 의 critical 작업.

3. **(4) Faithfulness 의 *circuit-level* 정의 부재** — *Grokking 트랙의 novel methodology contribution*. Nanda 의 *progress measure* (correlation) 에 *Jain-Wallace 의 faithfulness probe* 를 *시간 축* 으로 추가. *circuit-attention joint* 검증 protocol = *현재 어떤 paper 도 cover X*. NeurIPS / ICML 의 *methodology figure 1* 후보. (1) Multi-head H1/H2 는 *Abnar-Zuidema 2020 의 부분 cover*, (2) PE 격자는 *APF 가 cover*, (3) TS 도메인은 *Wilinski 2025 의 부분 cover* — 가장 *공간 비어 있음*.
