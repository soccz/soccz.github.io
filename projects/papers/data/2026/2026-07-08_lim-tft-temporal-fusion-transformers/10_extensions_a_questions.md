# 9. 사고 확장 A — 자문 질문 5개

## Q1. TFT 의 head-averaged attention weight 는 causal intervention 결과와 얼마나 일치하는가?

**왜 이 질문이 중요한가**: TFT 의 "interpretable" 이름표는 attention weight 시각화에 근거한다. 그러나 attention-as-explanation 담론 (Jain-Wallace 2019 → Wiegreffe-Pinter 2019 → 여러 후속 반박) 은 attention weight 가 causal 이 아니라 correlational 이라고 지적. TFT 시대에는 mechanistic interpretability (ACDC, IOI Circuit) 가 아직 성숙 안 했지만, 지금은 도구가 있다. Volatility 데이터에 학습된 TFT 에 path patching 을 적용해 head-averaged attention 이 진짜 causal 지도인지 검증하는 것이 next-step.

## Q2. Interpretable MHA 의 "head 별 value shared" 가정이 표현력을 얼마나 희생하나?

**왜 이 질문이 중요한가**: TFT 의 핵심 architectural choice — head 별 $W^V_h$ 대신 shared $W_V$ — 는 induction bias 를 명시적으로 포기한다. 표준 MHA 의 head 특수화가 없어져도 성능이 유지된다는 게 저자 주장이지만, 이는 forecasting task 특성 (변수가 상대적으로 적고, long-range 가 그렇게 복잡하지 않음) 때문일 수 있음. 훨씬 복잡한 task (예: multivariate 100 개 변수, horizon 500+) 에서도 이 tradeoff 가 성립하는지 검증 필요.

## Q3. VSN weight 는 correlational-attribution 인가 predictive-importance 인가?

**왜 이 질문이 중요한가**: VSN 은 supervised loss 로 학습된 softmax gating. 그 weight 를 "변수 중요도" 로 시각화하는 것은 attention 시각화와 같은 함정에 노출. Correlated feature 끼리는 weight 이 나뉘어 저평가, spurious correlation 도 weight 을 얻음. Shapley value 나 LOCO (Leave-One-Covariate-Out) 같은 진짜 predictive importance 와 VSN weight 의 Kendall τ 상관을 재보면 이 시각화의 신뢰도가 정량화됨.

## Q4. 5-tier 인터페이스가 없는 데이터 (예: pure multivariate return series) 에도 TFT 를 이식할 수 있는가?

**왜 이 질문이 중요한가**: TFT 는 static / known future / observed past / target / horizon 라벨링이 이미 있는 데이터를 전제. 그러나 순수 multivariate 금융 return 시계열 (예: 500 종목 daily return) 은 이 라벨링이 자연스럽지 않음 — 종목 코드는 static 인가 known future 인가? Volatility 데이터는 TFT 저자가 이 라벨링을 "index code = static, day-of-week = known future, past volatility = observed" 로 수동 배치한 결과인데, 이 배치가 임의적일 수 있다. 다른 배치를 시도해 성능이 얼마나 바뀌는지 = TFT architectural choice 의 sensitivity.

## Q5. Quantile crossing 을 architectural constraint 로 강제하면 성능이 어떻게 바뀌는가?

**왜 이 질문이 중요한가**: TFT 는 여러 quantile head 를 독립 학습해 crossing 을 허용. TimesFM v2.5 (2025) 가 `fix_quantile_crossing=True` 옵션을 도입 → post-hoc 정렬로 해결. 하지만 architectural constraint (예: cumulative softplus + monotone parameterization) 로 애초에 crossing 을 원천 봉쇄하면 학습 dynamics 가 바뀌고, pinball loss 최적점이 달라질 수 있음. Cross-rate 0 이 되면서 성능이 얼마나 이득/손실인지 정량화하는 실험은 확률 예측 계보 (MOIRAI, TimesFM) 표준을 바꿀 힘 이 있음.
