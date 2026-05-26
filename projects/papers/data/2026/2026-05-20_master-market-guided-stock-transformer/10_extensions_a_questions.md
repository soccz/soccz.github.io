# 10_extensions_a_questions — 사고 확장: 자문 질문 5개

> **🧒 한 줄 요약**: 10 open question: sparse inter-attention, multi-market transfer, alternative data integration.


---

## Q1. Cross-Time 상관이 실제로 포착되고 있는 것인가, 아니면 Intra-Stock 어텐션이 성능을 다 설명하는가?

**왜 이 질문이 중요한가**: MASTER의 핵심 주장은 "cross-time inter-stock 상관 포착"이다. 그러나 성능 향상의 원인이 (a) cross-time 종목 상관인지 (b) 기존 DTML보다 강력한 intra-stock 시간 어텐션(Transformer vs. LSTM)인지 분리되지 않으면, 논문의 novelty claim이 흔들린다.

검증 실험을 설계한다면: (1) intra만 있고 inter 없는 모델, (2) inter만 있고 intra 없는 모델, (3) MASTER (둘 다) 세 가지를 비교. 만약 (1)과 (3)의 차이가 거의 없다면, inter-stock 어텐션의 기여는 미미하고 intra 어텐션이 전부라는 뜻이다. 이 질문에 대한 답은 MASTER의 설계 원리를 재평가하게 만들 수 있다.

---

## Q2. 짧은 T=8 Lookback이 Cross-Time 상관 포착에 충분한가?

**왜 이 질문이 중요한가**: 실제 주식 시장에서 "종목 A의 신호가 종목 B에 영향을 미치는" 지연 시간은 하루(T=1) 수준일 수도 있고, 3개월(T≈60) 수준일 수도 있다. T=8이면 최대 8일 시차의 cross-time 상관만 포착 가능하다. 모멘텀 효과(3~12개월)나 계절성(분기 실적 발표 주기)은 완전히 놓친다.

더 긴 lookback window (T=20, T=60)를 사용할 때 성능이 어떻게 변하는지, 그리고 longer T에서 cross-time 상관이 더 명확하게 포착되는지 실험하면 T=8 선택의 합리성을 평가할 수 있다.

---

## Q3. 시장 게이팅을 통해 선택되는 팩터들이 금융 이론과 일치하는가?

**왜 이 질문이 중요한가**: MASTER의 게이팅은 블랙박스다 — "이 시장 국면에서 어떤 팩터가 선택됐는지" 해석이 없다. 만약 강세장에서 게이팅이 실제로 모멘텀 팩터를 강화하고, 폭락장에서 유동성 팩터를 강화하는지 확인한다면, 금융 이론과의 일관성이 모델의 신뢰성을 높인다.

구체적 해석 방법: 학습된 게이팅 계수 $g$를 시장 국면(VIX 레벨, 지수 수익률 구간)별로 군집화해 "국면 A에서는 팩터 묶음 B가 선택됨"을 보여주면 금융적 해석 가능성이 열린다.

---

## Q4. MASTER의 구조를 비주식 금융 시계열(금리, 외환, 원자재)에 적용했을 때 성능이 유지되는가?

**왜 이 질문이 중요한가**: 주식 시장의 cross-time 종목 상관 구조가 금리·외환·원자재 시장에도 유사하게 존재하는가? 예를 들어 달러-엔 환율이 3일 뒤 원유 가격에 영향을 주는 패턴이 있다면, MASTER의 intra-inter 구조가 그것을 포착할 수 있다.

이 질문은 MASTER의 fin-ts-dl 공헌을 단순 "중국 주식 논문"을 넘어 "금융 TS 일반 모델링 원칙"으로 확장할 수 있는지 평가한다. 실패한다면 구조 자체가 중국 A주의 특성에 과적합된 것일 수 있다.

---

## Q5. Market-Guided Gating과 시장 상태 표현의 충분성: 63차원 지수 통계가 국면을 충분히 표현하는가?

**왜 이 질문이 중요한가**: MASTER의 63차원 시장 벡터는 중국 3대 지수의 rolling 통계로만 구성된다. 그러나 시장 국면을 결정하는 요인에는 금리 수준, 달러 강세/약세, 원자재 가격, 지정학적 리스크, 투자자 심리(공포-탐욕 지수) 등이 있다. 이들을 $m_\tau$에 추가하면 게이팅 품질이 향상되는가?

또한, 63차원이 정보 이론적으로 "충분한" 차원인가? mutual information $I(m_\tau; \text{optimal}_g)$를 측정하면 현재 $m_\tau$가 얼마나 많은 국면 정보를 담는지 평가할 수 있다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Sparse inter-attention 의 *production efficiency*?**
2. **Multi-market transfer 의 *unique challenges*?**
3. **Alternative data 의 *integration approach*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
