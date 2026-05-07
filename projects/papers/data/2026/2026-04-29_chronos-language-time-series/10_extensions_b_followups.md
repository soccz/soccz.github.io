# 10b. 사고 확장 — Follow-up 논문 3편

---

## Follow-up 1 (선행) — "Probabilistic Transformer for Time Series Analysis" (NeurIPS 2021)

**어떤 논문**: NeurIPS 2021에 발표된 확률 예측 Transformer. 시계열을 Gaussian process로 모델링하고, 어텐션 메커니즘으로 시계열 간의 복잡한 시간적 의존성을 포착한다.

**본 논문(Chronos)과의 관계**: Chronos의 이산화 접근에 대한 선행 대안. Probabilistic Transformer는 연속 확률 모델(GP 기반)을 유지하면서 Transformer의 표현력을 활용한다. Chronos가 "이산화로 단순화"한 반면, 이 논문은 "연속 분포로 정밀화"를 택했다.

**무엇을 얻을 수 있는가**: 확률 예측의 두 접근(이산 토큰 vs. 연속 분포)의 트레이드오프를 이해할 수 있다. ProTran-TFA는 이 두 접근의 중간점에 위치할 수 있다 — 금융 수익률의 fat-tail 분포에는 연속 분포가, 파운데이션 모델 재사용에는 이산화가 유리하다. _index.md의 "사전 독파 논문" 섹션에 이미 포함된 논문이다.

---

## Follow-up 2 (경쟁) — "Exploring Representations and Interventions in Time Series Foundation Models" (Wilinski et al., ICML 2025)

**어떤 논문**: TS 파운데이션 모델(MOIRAI, Chronos 등 포함 가능)의 내부 표현 공간을 분석하고, 개입(intervention)을 통해 어떤 표현이 예측에 기여하는지를 실험한다.

**본 논문(Chronos)과의 관계**: Chronos를 분석 대상으로 하는 해석론 후속 연구. APF의 어텐션 패턴 분석과 상호 보완적 — Wilinski는 "표현 공간"에서, APF는 "어텐션 공간"에서 같은 현상을 봄.

**무엇을 얻을 수 있는가**: Chronos의 인코더 표현이 어떤 TS 특성(추세, 계절성, 불규칙성)을 분리해 인코딩하는지에 대한 실증적 증거를 얻을 수 있다. APF 논문 Related Work에서 이 논문을 "표현 공간 분석"으로 인용하고, APF를 "어텐션 공간 분석"으로 차별화하는 데 사용 가능. _index.md 우선 읽기 목록의 "APF — TSFM Interpretability" 섹션 항목이다.

---

## Follow-up 3 (후속) — "Chronos-2: From Univariate to Universal Forecasting" (arXiv:2510.15821, 2025)

**어떤 논문**: Chronos의 단변량 한계를 극복한 직접 후속작. 그룹 어텐션(Group Attention) 레이어를 인코더에 추가해 여러 관련 시계열 간의 정보 공유를 가능하게 한다. 다변량 + 공변량(covariate) 지원.

**본 논문(Chronos)과의 관계**: 동일 저자군(Amazon)의 직접 확장. Chronos의 핵심 설계(mean-scaling, bin quantization, T5)를 유지하면서 그룹 어텐션만 추가.

**무엇을 얻을 수 있는가**: (1) 그룹 어텐션이 어떤 어텐션 패턴을 형성하는지 — APF에서 "관련 시계열 간의 Cross-Series Attention 패턴"이라는 새로운 분석 차원이 열린다. (2) 다변량 TS를 처리하는 Transformer의 채널 간 어텐션 패턴 — iTransformer가 "역전된 채널 어텐션"을 사용하는 것과 비교 가능. (3) Grokking track에서: 단변량 → 다변량 전환 학습 시 훈련 동학 변화가 있는가?
