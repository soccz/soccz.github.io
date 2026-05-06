# 09 — 내 연구와의 연결

> **사전 주의**: 이 섹션은 `_profile.md`의 active 트랙(APF, Grokking)과 보유 자산에 대해 구체적 연결을 탐색한다. "일반론 나열" 금지 — mechanism/axis/수식 요소 지정 필수. 연결이 약한 부분은 솔직히 표기.

---

## 연결 1 — §A (Grokking track) : ELR 이론이 Grokking 실험 설계에 직접 제공하는 것

**관련 자산**: `Grokking in Time Series Transformers/` 트랙, 22 must-cite 문헌 중 "why grokking happens" 계열.

### 흡수할 기법

**ELR 측정 도구**: 현재 Grokking 트랙에서 시계열 트랜스포머의 grokking을 유도하는 실험을 설계 중이다. Lyle 2025의 핵심 도구인 "훈련 중 ELR 모니터링"을 직접 채택할 수 있다:

$$\text{ELR}_t^{(l)} = \frac{\eta}{\|\theta_t^{(l)}\|}$$

매 스텝마다 각 레이어 $l$의 ELR을 로깅해 "언제 lazy regime에 진입하는가"를 실시간으로 추적한다. 이를 테스트 정확도 곡선과 overlay하면 **"ELR 붕괴 시점 = grokking 지연 시작점"**인지 검증할 수 있다. 이것이 시계열 트랜스포머에서도 성립하는지 확인하는 것 자체가 논문 기여가 될 수 있다.

**ELR Re-warming을 TS Transformer에 적용**: PatchTST, iTransformer 등 시계열 트랜스포머는 대부분 LayerNorm을 사용한다. Lyle의 NaP/Re-warming을 직접 이식 가능하다. 비정상 시계열(regime shift가 있는 ETT, Weather 데이터)에서 ELR re-warming을 적용해 새 regime 적응 속도를 측정하면 Grokking TS 트랙의 **비정상성 × grokking** 교차 실험이 된다.

---

### 인용 포인트

**내 Grokking 논문 §2 (Related Work) 에서:**
```
"Lyle et al. (2025) establish that the same feature-learning dynamics 
underlying grokking—where networks transition from lazy (memorization) 
to rich (generalization) regime—also drive plasticity loss in continual 
learning settings. Their ELR formalism (ELR_t = η/‖θ_t‖) provides 
a mechanistic explanation for why weight decay accelerates grokking: 
L2 regularization bounds ‖θ_t‖, thereby preventing ELR collapse and 
maintaining the network in a feature-learning regime."
```

이 인용은 내 논문의 "왜 weight decay가 grokking에 필요한가"에 대한 답을 제공하고, 동시에 비정상 시계열에서 ELR re-warming의 활용을 정당화하는 근거가 된다.

---

## 연결 2 — §A × §D 교차: 비정상 시계열에서의 Plasticity 문제

**관련 자산**: Grokking 트랙의 "non-stationarity × grokking" 축, ETT-mini/Weather-mini 데이터.

### 직접 연결 메커니즘

시계열 예측에서 **개념 드리프트(concept drift)** — 통계적 분포가 시간에 따라 변하는 현상 — 는 RL의 primacy bias와 구조적으로 동일하다:
- RL: 초기 경험(쉬운 레벨)에 과적합 → 새 분포(어려운 레벨) 적응 실패
- TS: 초기 학습 기간(bull market)에 과적합 → 새 regime(bear market) 예측 실패

이것이 Lyle의 프레임워크에서 **ELR 붕괴 = non-stationarity 적응 실패**로 해석된다. 내 Grokking 트랙의 핵심 질문인 "비정상 TS에서 grokking이 발생하는가, 어떻게 촉진하는가"에 대한 이론적 답이 여기 있다:

> "비정상 시계열의 새 regime 적응이 늦은 이유는 ELR이 낮아졌기 때문이며, ELR re-warming이 이를 해결한다."

이것은 내 논문의 §3(Method)에서 독자적인 실험 설계로 검증할 수 있다.

---

## 연결 3 — §B (APF track): ELR과 Attention Pattern 안정성

**관련 자산**: `Attention Pattern Fields/` 트랙, APF의 "motif causality 실험".

### 연결 약함, 전이 가능성만 있음

APF는 PE × attention motif × CNN probe를 다루는 프레임워크이며, ELR과의 직접 연결은 없다. 그러나 전이 가능성은 있다:

**전이 포인트**: APF 실험에서 주기적 motif(diagonal stripe)는 훈련 초기에 등장했다가 grokking 이후 사라지거나 강화되는 패턴을 보일 수 있다. 만약 이 motif 전환이 ELR 붕괴 시점과 상관관계를 보인다면, "motif 변화 = feature-learning dynamics의 시각적 증거"라는 가설이 성립한다.

APF의 향후 실험 설계에서 훈련 중 ELR을 같이 로깅해두면, motif 안정성·전환과 ELR의 관계를 추후 분석할 수 있다. 이 연결을 APF 논문의 appendix 수준에서 탐색하는 것을 권장한다.

---

## 연결 4 — §E (ProTran-TFA): 금융 TS에서의 ELR 붕괴

**관련 자산**: ⏸️ Paused P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md`)

### 연결 강도: 중간

ProTran-TFA는 확률론적 트랜스포머로 금융 시계열을 예측하는 논문이다. 금융 시계열은 강한 비정상성(regime 전환, 변동성 클러스터링)을 보이므로, ELR re-warming이 실제 개선을 줄 수 있다.

**구체적 인용 경로**: ProTran-TFA §4(Method)의 훈련 스케줄 절에서:
```
"Given the pronounced nonstationarity in financial time series, 
we incorporate periodic ELR re-warming (Lyle et al., 2025) into 
our training procedure to maintain plasticity under distribution 
shifts. Specifically, at each regime transition detected by [method], 
we apply ELR re-warming to facilitate rapid feature adaptation."
```

그러나 ProTran-TFA가 현재 paused 상태이고, 이 연결은 "재개 시 고려할 추가 요소"로 남겨두는 것이 현실적이다.

---

## 반면교사: Lyle 2025가 못한 것

**내가 할 것 1**: Lyle 2025는 ELR re-warming의 이론적 수렴 보장을 제시하지 않았다. 내 Grokking 트랙 논문에서는 단순 ELR 프레임워크를 채택하더라도, "시계열 설정에서 ELR re-warming이 어떤 조건에서 수렴을 보장하는가"에 대한 이론적 스케치를 추가할 수 있다.

**내가 할 것 2**: Lyle 2025는 소규모 실험만 수행했다. 내 ETT, Weather, Traffic 등 실제 시계열 데이터셋에서 ELR re-warming을 테스트하면 Lyle 2025를 실질적으로 확장하는 기여가 된다.

---

## 요약

| 연결 대상 | 연결 강도 | 구체 연결 |
|-----------|----------|-----------|
| §A Grokking 트랙 | **강함** | ELR 모니터링 도구, weight decay 설명, re-warming 실험 |
| §A × §D 비정상 TS | **강함** | concept drift = primacy bias 구조적 동치 |
| §B APF 트랙 | **약함** | motif 전환 × ELR 상관관계 (appendix 수준) |
| §E ProTran-TFA | **중간** | 금융 비정상성 처리 (재개 시 인용 가능) |
