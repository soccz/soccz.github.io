# 10a. 사고 확장 — 자문 질문 5개

---

## 질문 1: Chronos 인코더의 Self-Attention 행렬은 어떤 패턴을 형성하는가?

**질문**: 주기성이 강한 시계열(M4 monthly, 전력 소비)과 랜덤워크에 가까운 시계열(금융 일별 수익률)을 Chronos-Large에 입력했을 때, 각 레이어·헤드의 Attention 행렬 $A^{(l,h)}$는 어떻게 다른가? APF가 분류한 6가지 모티프(diagonal/stripe/block/edge/spike/checker) 중 어떤 것이 지배적인가?

**왜 이 질문이 중요한가**: Chronos는 수십억 개의 TS 토큰으로 학습된 파운데이션 모델이다. 이 규모에서 형성되는 어텐션 패턴은 "모델이 어떤 TS 구조를 암묵적으로 학습했는가"를 드러내는 창이다. PatchTST, iTransformer 같은 소형 모델과 비교했을 때 파운데이션 모델의 어텐션 패턴이 더 다양하고 구조적이라면, 규모(scale)가 어텐션 구조를 바꾼다는 새로운 가설이 된다. APF 프레임워크의 자연스러운 다음 실험이다.

---

## 질문 2: Chronos 사전학습 과정에서 Grokking이 발생하는가?

**질문**: Chronos 학습 곡선(학습 loss vs. 검증 loss, 특히 Benchmark II zero-shot loss)에서, 처음에는 검증 loss가 내려가지 않다가 특정 임계점에서 급격히 개선되는 "지연 일반화(delayed generalization)" 패턴이 나타나는가?

**왜 이 질문이 중요한가**: Nanda et al. (2023)은 모듈식 산술 학습에서 grokking이 발생하며, 그 시점에 Fourier 기반 일반화 알고리즘이 형성된다고 보였다. Chronos는 같은 cross-entropy + 이산 토큰 구조이지만, 훈련 데이터가 수치 패턴이다. Grokking이 발생한다면, 이는 "TS 파운데이션 모델도 훈련 후반에 알고리즘적 일반화가 일어난다"는 강력한 증거가 되며, Grokking in TS Transformers track의 핵심 배경 동기를 강화한다.

---

## 질문 3: 균등 bin 대신 분포 적응 bin을 쓰면 금융 TS 예측이 유의미하게 좋아지는가?

**질문**: Chronos의 균등 bin을 log-return 기반 Student-t 분포에 맞춘 bin(heavy-tail을 고려해 꼬리 부분에 더 많은 bin을 할당)으로 교체하고 동일한 아키텍처와 학습 절차를 유지했을 때, 금융 시계열 벤치마크(GluonTS의 Exchange Rate, M4 finance 부분)에서 WQL 및 꼬리 커버리지(5%, 95% 분위수 정확도)가 유의미하게 달라지는가?

**왜 이 질문이 중요한가**: ProTran-TFA의 잠재적 핵심 기술 기여. 균등 bin의 꼬리 실패는 Chronos 논문 자체가 암묵적으로 인정한 문제다. 이 질문에 "예스"라는 답이 나오면, log-return bin이 금융 특화 파운데이션 TS 모델의 차별화 포인트가 된다.

---

## 질문 4: TSMixup과 KernelSynth의 독립 기여도는 어느 쪽이 더 큰가?

**질문**: Chronos의 Ablation이 두 기법을 항상 함께 포함했다. TSMixup만 쓴 모델, KernelSynth만 쓴 모델, 둘 다 쓴 모델, 둘 다 안 쓴 모델의 Benchmark II 성능을 비교하면 어떤 결과가 나오는가?

**왜 이 질문이 중요한가**: 데이터 증강의 어떤 성질이 zero-shot 일반화를 만드는지를 이해하면, 더 효율적인 합성 데이터 전략을 설계할 수 있다. KernelSynth가 더 중요하다면 GP 구조 다양성이 핵심, TSMixup이 더 중요하다면 실제 데이터 패턴의 보간이 핵심이다. 이것은 합성 TS 벤치마크를 만드는 APF에도 직접 적용 가능한 인사이트다.

---

## 질문 5: Chronos의 T5 vs. GPT2 (디코더 전용) 아키텍처 비교 — 인코더의 역할은 무엇인가?

**질문**: Chronos의 인코더-디코더 T5를 동일 파라미터의 디코더 전용 GPT2 스타일로 바꿨을 때 성능 차이가 있는가? 인코더가 만드는 전역 맥락 벡터가 시계열 예측에 실질적으로 기여하는가, 아니면 자기회귀 디코더만으로 충분한가?

**왜 이 질문이 중요한가**: T5 인코더는 전체 과거 시퀀스를 양방향으로 처리해 풍부한 맥락 표현을 만든다. 이 표현이 디코더에 Cross-Attention으로 전달된다. 인코더의 기여가 크다면, Chronos의 어텐션 패턴 분석은 인코더의 Bidirectional Self-Attention에 초점을 맞춰야 한다. 디코더 전용이 충분하다면 인과적(causal) 어텐션 분석이 더 적절하다. APF가 어떤 어텐션을 분석 대상으로 삼아야 하는지를 결정하는 질문이다.
