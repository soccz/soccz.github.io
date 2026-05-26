# 08 이론적 계보

> **🧒 본 챕터는 "가계도"**: 본 paper 가 *어디에서* 왔고 *어디로* 갔는가의 *11 paper 매핑*. 4 ancestors (Bahdanau / Sundararajan / Brunner / Adebayo) + 4 parallels (Wiegreffe-Pinter / Serrano-Smith / Vashishth / Pruthi) + 3 descendants (ERASER / Abnar-Zuidema / Mechanistic Interp). 본 paper 의 *학문적 위치 좌표*.

## 이론적 조상 — 4 편

### (A1) Bahdanau et al. 2015 — Neural Machine Translation by Jointly Learning to Align and Translate

**연결선**: Attention 그 자체의 발명. 본 논문은 Bahdanau attention 의 *additive (tanh)* 형태를 그대로 testbed 로 사용. 더 중요한 점은 *Bahdanau 의 alignment 시각화* 가 7년간 "attention = explanation" 의 *문화적 등식* 의 출발점이라는 사실. 본 논문은 그 등식을 *명시적으로* 검증·반박. 따라서 *방법론적* 출발점이자 *반박 대상*. Jain-Wallace 가 Bahdanau attention 위에서 검증한 것은 *시발점에 직접 펀치를 날리는* 수사적 선택.

### (A2) Bach et al. 2015 (LRP) / Sundararajan et al. 2017 (Integrated Gradients) — Attribution methods

**연결선**: Gradient·LOO 가 본 논문의 *reference importance*. 이 측정 자체가 attribution literature 의 산물. Sundararajan 의 *axiomatic* 접근 — sensitivity, implementation invariance, completeness — 은 *attribution 이 만족해야 할 공리* 를 제시. 본 논문은 *vanilla gradient + LOO* 만 사용하므로 IG 의 보정 (path integral) 을 받지 않은 *raw* attribution. 후속 비판이 이 부분을 공격: "*vanilla gradient* 자체가 noisy 한데 이 noise 를 attention 의 결함으로 돌리는 것은 부당".

### (A3) Brunner et al. 2019 — Identifiability of Attention

**연결선**: 본 논문과 거의 동시기 (2019 년 초). Transformer attention 의 *identifiability* — *주어진 출력에 대응하는 attention 분포가 유일한가* — 를 *이론적으로* 분석. 결론: contextualized encoder 에서는 *non-identifiable*. 즉 *수학적으로* 본 논문의 H2 (counterfactual attention 의 존재) 가 *왜* 가능한지 *설명*. 두 논문은 *이론 + 실증* 의 짝.

### (A4) Adebayo et al. 2018 — Sanity Checks for Saliency Maps

**연결선**: 인접 분야 (saliency map 의 해석성 검증) 에서 *체계적 검증 protocol* 의 모범. Adebayo 는 *cascading parameter randomization* 같은 sanity check 를 제안 — "*무관한 perturbation* 에 saliency map 이 변하지 않으면 그 map 은 *모델의 진짜 정보* 가 아니라 *입력 자체* 의 함수일 뿐". 본 논문의 H1·H2 는 saliency 의 sanity check 의 *attention 분야 instantiation*. 같은 방법론적 정신 — "*검증되지 않은 해석은 신뢰될 수 없다*".

## 평행 연구 — 4 편

### (B1) Wiegreffe & Pinter 2019 — Attention is not not Explanation (EMNLP 2019)

**관계**: *직접 rebuttal*. 본 논문 발표 후 7 개월 만의 응답. 핵심 주장: (1) 본 논문의 adversarial attention 이 *학습 가능한* 분포인지 *별 검증* 필요, (2) attention 의 *고정* (uniform) baseline 모델이 *성능 떨어지면* attention 이 *어떤 정보를 담는다* 는 증거, (3) *plausibility* 와 *faithfulness* 는 분리해야 함. 본 논문의 결론을 *부분 무력화* 하지만 *완전 부정* 하지는 않음. 두 논문이 *합쳐서* attention interpretability 논의의 *표준 좌표계*.

**왜 본 논문이 "이겼나"** (또는 어떤 영역에선 졌나):
- 본 논문이 *문제 제기의 우선권* 을 가짐 — 해석 가능성 비판 분야에서 *최초의 체계적 격자 검증*.
- Wiegreffe-Pinter 는 *반론으로서* 영향력이 크지만 *후속 작업* 의 출발점은 본 논문에 더 가깝다.
- 의료 도메인 reviewer 에게는 본 논문이 더 강한 인상 — *경계* 신호를 보냄.
- *Transformer* 시대로의 확장성에서는 둘 다 한계 — 둘 다 BiLSTM 위에서만 검증.

### (B2) Serrano & Smith 2019 — Is Attention Interpretable? (ACL 2019)

**관계**: 본 논문 발표 와 비슷한 시기 (ACL 2019). 핵심 질문: *attention weight 의 magnitude 와 token 의 model decision 기여도가 일치하는가*. 본 논문의 H1 과 유사한 검증을 *다른 방법* (intermediate representation erasure) 으로 수행. 결론도 유사: *대부분의 경우 attention 이 decision-driving feature 의 신뢰할 만한 indicator 가 아니다*. 본 논문보다 *덜 인용* 되지만 학계 내부에서 *cross-validate* 역할.

### (B3) Vashishth et al. 2019 — Attention Interpretability Across NLP Tasks

**관계**: 본 논문 의 *반대 결론* 일부 보고. NMT 같은 *sequence-to-sequence* task 에서는 attention 이 *더 유의미한* 해석을 제공한다고 주장. Task type (seq-to-seq vs classification) 에 따라 결과가 *다르다* 는 nuance 추가.

### (B4) Pruthi et al. 2020 — Learning to Deceive with Attention-Based Explanations

**관계**: 본 논문의 *adversarial* 아이디어를 *훈련 단계* 로 끌어올림. *학습 가능한 deception* — 일부러 *그럴듯한* attention 분포를 만들면서 *비-그럴듯한* 결정을 내리도록 모델을 *학습 가능*. 본 논문이 *post-hoc adversarial* 을 *훈련 시 adversarial* 로 전환. 본 논문의 *심각도를 올림* — 단순 추론 시점의 attention 조작이 아닌 *학습 자체가 deceptive* 할 수 있음.

## 후손 예측 — 3 방향

### (C1) Plausibility vs Faithfulness 의 *분리된 metric*: ERASER benchmark (DeYoung et al. 2020)

이미 실현. ERASER (Evaluating Rationales And Simple English Reasoning) 가 *plausibility* (사람 평가) 와 *faithfulness* (인과 검증) 의 분리된 metric 을 제안. 본 논문의 결론이 *어떤 explanation 도 무가치한 게 아니라 둘을 분리해서 평가해야 한다* 는 *건설적* 방향으로 진화. 본 논문이 이 분리의 *동기* 를 제공.

### (C2) Transformer 의 *attention rollout / flow / norm-based attribution* (Abnar-Zuidema 2020, Kobayashi 2020)

이미 실현. *단일 layer attention* 이 아닌 *layer 간 attention 의 누적/전파* 를 attribution 으로 사용. 본 논문의 비판 (단일 attention 은 explanation 아님) 을 받아 *다른 형태의 attention summary* 가 explanation 후보로 부활. Abnar-Zuidema 의 rollout 은 multi-layer Transformer 의 *attention 누적 효과* 가 *입력 token 의 영향력* 을 더 잘 반영한다는 입장.

### (C3) Mechanistic Interpretability 의 *causal intervention* — 본 논문의 H2 의 *진화형* (Anthropic 의 ROME, ACDC, IOI, sparse feature circuits)

이미 실현. 본 논문이 *attention 분포 자체* 를 perturbation 한 것을 *모델 내부 activation* 또는 *edge* 의 perturbation 으로 확장. ACDC 의 *recursive edge pruning*, ROME 의 *MLP rank-one editing*, Sparse Feature Circuits 의 *SAE feature 의 attribute patching*. 모두 *intervention-based* 검증의 정신을 공유. 본 논문이 *interpretation* 분야에 *intervention* 패러다임을 *대중화* 한 출발점 중 하나.

## 핵심 한 문장

> Bahdanau 의 attention 발명 + saliency-attribution 의 검증 정신 + Brunner 의 identifiability 이론이 합류한 *해석 가능성의 메타-검증* 분야의 *시조* 논문 중 하나로, ERASER · rollout · mechanistic interpretability 모두에 *DNA* 를 남겼다.

---

## 인터랙티브 — 본 논문의 핵심 visual

```viz:anie-attention-heatmap:title=paper Figure 1 — Lineage 의 출발점,caption=Example 셀렉터. 본 논문이 *7년 영향력의 시작* 인 단일 visual: 두 매우 다른 attention 으로 *같은 prediction*. 이 visual 이 (a) Wiegreffe-Pinter rebuttal 의 출발점, (b) ERASER 의 plausibility metric 의 motivation, (c) Mechanistic Interpretability paradigm shift 의 ideological 토대 — 모두를 만들었다.
```

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **4 ancestors 중 *방법론적 빚 가장 큰* paper 는?**
2. **4 parallels (Wiegreffe-Pinter / Serrano-Smith / Vashishth / Pruthi) 중 *가장 인용되는* 이유?**
3. **3 descendants 중 *현재 (2026) 활발* 한 movement?**

### 답변

1. **Adebayo et al. 2018 (Sanity Checks for Saliency Maps)** — *검증 protocol 의 정신* 의 직접 ancestor. Bahdanau 는 *attention* 자체의 발명, Brunner 는 *동시기* 의 *이론 짝*. Sundararajan 은 *attribution method* 의 ancestor. **Adebayo** 만 *"검증되지 않은 해석은 신뢰될 수 없다"* 의 *meta-level* 정신 — paper 의 *H1·H2 protocol* 의 *직접 영감*. paper 가 *attention 에 sanity check 를 명시 적용* 한 첫 작업.

2. **Wiegreffe-Pinter** — *direct rebuttal* + *유일한 reframing*. Serrano-Smith 는 *independent confirm* (동일 방향), Vashishth 는 *부분 반대* (seq-to-seq 에서 attention 의미), Pruthi 는 *adversarial training* 으로 *방향 확장*. **W-P 만** *plausibility vs faithfulness* 분리의 *학계 표준* 을 만듦 — 본 paper 와 *합쳐* attention interpretability 의 *cited together* 표준.

3. **(C3) Mechanistic Interpretability**. (C1) ERASER 는 *benchmark 완성*, (C2) Abnar-Zuidema rollout 은 *부분 사용* (Llama-Index 등 implementation 있으나 *최첨단 아님*). **(C3) Mech Interp** = Anthropic SAE (2023) / Nanda Modular arithmetic (2023) / ACDC (2023) / SFC (2024) — *2022-2024* 의 *가장 활발 movement*. 본 paper 의 *intervention paradigm* 의 *직계 후손*. 본 deep dive 의 09 챕터가 *이 movement 내 APF 의 위치* 명시.
