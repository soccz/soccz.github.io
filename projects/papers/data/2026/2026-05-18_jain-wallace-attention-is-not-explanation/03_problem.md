# 03 문제 지형도

> **배경 사다리**: 이 절을 이해하려면 ① **attention mechanism** 이란 입력 시퀀스 $x_1, \dots, x_T$ 에 대해 각 위치에 가중치 $\alpha_i \ge 0$, $\sum_i \alpha_i = 1$ 을 부여하고 그 가중합으로 출력을 만드는 모듈이라는 것, ② NLP 분류 모델 (감성, 의료, QA) 이 BiLSTM + attention 형태로 2015–2018 년 거의 표준이었다는 것, ③ "**해석 가능성** (interpretability)" 이란 모델 출력의 *이유* 를 사람에게 보여주는 능력을 가리킨다는 것 — 이 3 가지만 있으면 된다.

## 실세계 문제 — 세 가지 예시

**예시 1. 의료 차트 분류**. 환자의 EMR (전자건강기록) 텍스트를 입력으로, 모델이 "이 환자는 빈혈 (Anemia) 양성" 이라고 예측한다. 의사는 모델 신뢰 전에 *어디를 보고* 그런 판단을 내렸는지 알아야 한다. 표준 관행은 attention heatmap 을 시각화하고 "모델은 'hemoglobin 8.5' 구절을 보고 판단했다" 라고 설명. 이 설명이 진짜 맞으면 의사는 모델을 신뢰할 수 있다. 틀리면 — 모델이 다른 단어를 보고 결정했지만 attention 만 hemoglobin 에 쏠려 있던 거라면 — 의사는 *잘못된 근거* 로 모델을 신뢰하게 된다. 의료 도메인에서 이는 환자 안전 문제.

**예시 2. 콘텐츠 모더레이션**. 트윗을 입력으로 모델이 "이 글에는 약물 부작용 (Adverse Drug Reaction) 신호가 있다" 라고 분류. 의료 감시 (pharmacovigilance) 시스템에 들어간다. 사람 검토자가 모델이 *어떤 단어* 에 반응했는지 attention 으로 보고 우선순위를 정한다. 만약 attention 이 *모델 결정과 무관한* 단어를 가리키면 — 검토자는 잘못된 단서를 따라가 시간을 낭비한다.

**예시 3. NLI (자연어 추론)**. 전제 "철수는 모자를 샀다" 와 가설 "철수가 무언가를 구매했다" 의 entailment 판정. 모델이 "샀다" ↔ "구매했다" 어휘 매핑에 attention 을 강하게 주었다는 시각화를 보면, 우리는 모델이 *문장-수준 의미* 가 아닌 *어휘 매칭* 만 보고 판단했다는 결론을 자연스럽게 내린다. 이 추론이 정당하려면 attention 이 진짜로 그 매칭 위치를 *원인* 으로 가리켜야 한다.

세 예시 공통 패턴: **"attention heatmap 을 봤다 → 모델 결정의 이유를 안다"** 라는 인과 추론 단계. 본 논문은 이 단계가 *증거 없이 받아들여져* 왔다는 점을 문제로 삼는다.

## 기존 접근 계보

### (i) 2014–2015: Attention 의 등장과 "soft alignment as visualization" — Bahdanau 2015, Luong 2015

기계번역에서 attention 이 등장한 직후, Bahdanau et al. (2015) 가 영-불 번역의 attention matrix 를 *번역 정렬 행렬* 로 시각화한 그림이 매우 유명해졌다. 이 그림은 "attention 이 모델이 *생각하는* 단어 대응" 으로 직관적으로 받아들여졌다. *주장은 정렬* 이지만 *주장 = 설명* 으로 미끄러져 사용되기 시작.

남긴 교훈: **시각화의 직관성** 이 곧 *해석적 정당성* 을 부여한다는 잘못된 등식이 7년간 누적된 출발점.

### (ii) 2016–2017: "attention reveals model focus" 의 도메인 확장 — Yang 2016 (HAN), Choi 2016 (RETAIN), Mullenbach 2018 (CAML)

문서 분류 (HAN), 의료 코딩 (RETAIN, CAML) 등에서 hierarchical attention 또는 multi-level attention 의 시각화가 모델 *해석* 으로 명시 보고됨. 특히 RETAIN 은 *해석 가능성을 핵심 contribution* 으로 내세우면서 attention 을 그 evidence 로 사용. 의료 학회·산업 시스템 으로 침투.

남긴 교훈: 해석 가능성이 *모델 선택 기준* 으로 등극. 그러나 그 attention "설명" 이 *어떤 의미에서 옳은가* 의 정의 없음.

### (iii) 2017–2018: Saliency / gradient methods 와의 비교 부재 — Ribeiro 2016 (LIME), Sundararajan 2017 (IG), Smilkov 2017 (SmoothGrad)

병행하여 saliency / attribution 분야는 *체계적 검증* (axiomatic, sanity check) 을 만들고 있었다 (Adebayo 2018 의 sanity check 가 유명한 예). 그러나 attention 의 해석 주장은 *동등한 검증 없이* 사용. Attention 과 LIME/IG 가 일치하는지 *비교 실험* 자체가 거의 없었음.

남긴 교훈: 인접 분야에서 "post-hoc explanation 의 신뢰성" 검증 도구가 이미 발달했음에도 attention 만 그 검증을 *받지 않은 채* 통용되는 비대칭 상태.

### (iv) 2018: Transformer 의 등장과 multi-head attention 시각화 폭증 — Vaswani 2017, Clark 2019 (BERT)

Transformer 가 표준이 되면서 multi-head × multi-layer attention 시각화가 *각 head 가 무엇을 보는가* 라는 framing 으로 폭발적으로 등장. Clark et al. 2019 ("What Does BERT Look At?") 가 head-별 attention pattern 의 syntactic role 을 보고. 그러나 이것도 *correspondence* (head 의 attention 이 dependency relation 과 같다) 보고이지 *causal explanation* 검증 아님.

남긴 교훈: 시각화 → 패턴 발견 → "이게 모델이 *하는 일*" 이라는 인과 도약은 광범위했으나 *통제된 검증* 은 미흡.

### (v) 2018: 단일 헤드 attention 의 *부분적 비판* — Brunner 2019 (Identifiability), Pruthi 2020 (이후)

Brunner et al. 2019 (본 논문과 거의 동시) 가 Transformer attention 의 *identifiability* — 즉, 동일 출력에 대해 *유일한* attention 분포가 존재하는가 — 를 이론적으로 분석. 결론: BiLSTM 같은 contextualized encoder 에서는 *non-identifiable*. 이는 Jain-Wallace 의 H2 와 정확히 같은 통찰의 *이론 버전*. 그러나 Brunner 는 *empirical scale* 이 작고, Jain-Wallace 가 *대규모 격자 실험* 으로 보강한 것이 본 논문의 위력.

남긴 교훈: 이론적 비-식별성 + 실증적 격자 검증의 결합이 본 논문의 power.

## 핵심 Gap

기존 방법들이 공통으로 놓친 **gap**: *"attention = explanation" 이 만족해야 할 명시적 검증 기준이 정의되지 않았고, 그 기준에 대한 체계적 실증 시험이 부재했다.* "Attention 그림이 그럴듯해 보인다" 라는 *plausibility* 만으로 *faithfulness* (모델 결정의 실제 원인) 가 자동 보장된다고 암묵 가정.

## 본 논문의 접근

Jain & Wallace 는 이 gap 을 **두 단계 검증 protocol** 로 메운다:

1. **H1 — Agreement test**: Attention 분포 $\boldsymbol{\alpha}$ 가 *다른 신뢰할 만한 importance 추정량* (gradient-based, leave-one-out) 과 잘 일치하는가? 일치하지 않으면 attention 이 어떤 *대안적인* 의미에서 모델 결정을 반영하는지 의문.
2. **H2 — Counterfactual test**: $\boldsymbol{\alpha}$ 와 *다른* 분포 $\boldsymbol{\alpha}^*$ 로 같은 예측을 만들 수 있는가? 만들 수 있다면 $\boldsymbol{\alpha}$ 가 그 예측의 *유일한 설명* 이라는 주장은 무너진다.

두 시험을 *모두* 통과해야 "attention = explanation" 이 정당화될 수 있다는 입장. 본 논문은 둘 다 *대부분의 경우 실패* 함을 보임으로써 7년간 누적된 관행에 도전한다.

---

## 인터랙티브 — 문제 설정 시각화

```viz:anie-correlation-hist:title=문제 설정 — H1 의 직관 시각화,caption=Dataset 셀렉터 + Metric 토글. BiLSTM (red) 의 τ 가 [0, 0.5] 안에 centered. *문제: 만약 attention 이 explanation 이라면 τ 가 1 에 가까워야 함*. 실제로는 ~0.3 → "attention 이 importance 와 약하게 상관" — H1 검증의 정량적 결과.
```
