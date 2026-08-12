# 7. 이론적 계보

---

## 7.1 이론적 조상

### ① Chronos (Ansari et al., 2024) — 이 논문의 피시험체이자 전제

원문 §3 verbatim: "Chronos internally uses a large language model based on the text-to-text T5 transformer model family (Raffel et al., 2020). It introduces a scaling and quantization layer, which converts continuous-valued univariate time series into a set of discrete tokens, with vocabulary size acting as a model hyperparameter. The model was trained on diverse time series spanning $\sim 10^{11}$ observations drawn from 42 synthetic and real-world settings, but the training data does not contain any dynamical systems."

**연결선.** 이 논문의 모든 결과는 Chronos 의 두 설계 결정 위에 서 있다. (i) **양자화 토큰화** — 연속값을 이산 토큰으로 바꾸었기 때문에 "언어 모델의 문맥 복사"라는 비유가 문자 그대로 성립한다. 토큰화 없이 연속값 회귀 헤드였다면 "복사"라는 개념 자체가 덜 자연스러웠을 것이다. (ii) **단변량 처리** — 이것이 이 논문 전체를 채널 독립 조건으로 몰아넣었고, 그 결과 §3 의 "$x$ 만 보고 $y$ 와의 부호 상관을 유지한다"는 Takens 스타일 관찰이 가능해졌다.
_(이 레포 2026-04-29 Chronos 해체 참조.)_

### ② `dysts` 벤치마크 (Gilpin, 2021; 2023) — 시험지 자체

원문 §4 verbatim: "The dysts dataset represents a standardized benchmark of 135 low-dimensional chaotic systems, described by ordinary differential equations that have been aligned with respect to their dominant timescales and integration steps".

**연결선.** 이 논문의 방법론적 기여 대부분($\tau$ 정규화, 불변량 주석, 계별 하이퍼파라미터 튜닝 프로토콜)은 이 선행 벤치마크에서 상속된 것이다. 이 논문이 새로 한 일은 **그 시험지에 파운데이션 모델이라는 새 응시자를 앉힌 것**이다. `07_limits.md` 반박 4에서 지적한 이해상충의 근원이기도 하다.

### ③ Takens 매장 정리 (Huke, 2006 경유) — 부분 관측이 왜 작동하는가

**연결선.** §3 verbatim: "this process is possible due to Takens' theorem, which states that low-dimensional measurements can reveal unmeasured dynamical variables using delay embedding". 이 정리가 없으면 "단변량 모델이 다변량 카오스를 예측한다"는 것이 원리적으로 이상해 보인다. 동시에 §5.5 의 17 $\tau$ 문맥 결과는 이 정리의 **통상 적용 범위를 벗어나는** 현상이므로, 조상이면서 동시에 반증 대상이다 — verbatim: "This regime also exceeds the typical range of Takens' embedding theorem".

### ④ 저장소 컴퓨팅 / 동기화 (Jaeger & Haas 2004, Pathak 2018, Lu & Bassett 2020)

**연결선.** §5.4 verbatim: "This process resembles the warm-up time in reservoir computers, a type of recurrent neural network used for dynamical systems forecasting (Jaeger & Haas, 2004; Pathak et al., 2018). In this setting, extended context allows the reservoir to gradually synchronize with the dynamical system being learned (Lu & Bassett, 2020)." — 긴 문맥의 이득을 **동기화**로 재해석하는 이 비유는, 어텐션의 문맥 처리와 순환망의 상태 수렴을 같은 틀에 놓으려는 시도다. 이 논문에서 가장 이론적으로 야심 있는 문장이지만 정량 검증은 없다.

---

## 7.2 평행 연구 (같은 시기, 다른 접근)

### ① Tan, Merrill, Gupta, Althoff, Hartvigsen (NeurIPS 2024 Spotlight) — "Are Language Models Actually Useful for Time Series Forecasting?"

원문 §2 가 회의론 진영으로 명시 인용한다. **차이점**: Tan 등은 실세계 벤치마크에서 LM 구성요소를 **제거(ablate)** 해도 성능이 안 떨어진다는 방식으로 회의론을 편다. 이 논문은 정반대로 **오염 없는 데이터에서 성능이 실제로 난다**는 것을 인정한 뒤, 그 성능의 **메커니즘이 저수준**임을 밝힌다.

**어느 쪽이 이겼나.** 두 논문은 경쟁이 아니라 상보적이다. Tan 은 "LM 구조가 기여하지 않는다"를, 이 논문은 "기여하는 것은 문맥 복사다"를 말한다. 합치면 "TSFM 의 성능은 대규모 사전학습이 만든 **패턴 검색 능력**이지 시계열에 대한 구조적 이해가 아니다"라는 하나의 명제가 된다. 다만 이 논문 쪽이 **처방**을 더 준다(불변량 채점축, 비정상성 진단, 문맥 길이 활용).
_(이 레포 2026-06-17 Tan et al. 해체 참조.)_

### ② Liu et al. (2024a) — LLM 으로 확률적 동역학계 제로샷 예측

§2 verbatim: "A recent study used an open-source language model to evaluate zero-shot forecasting performance on stochastic dynamical systems (like Markov chains) as well as the Lorenz attractor Liu et al. (2024a), finding evidence of a neural scaling law relating context length and prediction accuracy, consistent with prior works Gruver et al. (2024); Jin et al. (2023)."

**차이점과 이 논문의 우위.** 규모($10^2$ 계 vs 소수 계)와 채점축(불변량 재구성 추가). 저자들의 차별화 선언 verbatim: "to the best of our knowledge, this work is the first large-scale evaluation of the zero-shot learning ability of foundation models on over 100 chaotic systems, both in terms of short-term forecast accuracy and long-term attractor reconstruction performance."

### ③ Wiliński, Goswami, Potosnak, Żukowska, Dubrawski (ICML 2025) — TSFM 표현·개입 탐구

이 레포가 2026-07-29 에 커버한 논문(arXiv:2409.12915). **대비가 선명하다**: Wiliński 등은 TSFM **내부**(CKA 층 유사도, 선형 프로빙, steering 벡터)를 열어 본다. 이 논문은 TSFM **행동**만 보고 데이터 쪽을 설계해 메커니즘을 추론한다.

**어느 영역에서 누가 나은가.** 내부 인과 국소화는 Wiliński 쪽이 압도적으로 강하고, 일반화 조건의 정량화(정상성·문맥 길이·상태 밀도)는 이 논문이 강하다. **두 논문을 붙이면 "문맥 복사가 어느 층·어느 헤드에서 일어나는가"라는 질문이 즉시 실행 가능해진다** — 이것이 `10_extensions_c_ideas.md` 실험 1의 출발점이다.

### ④ Powerformer (Hegazy, Mahoney, Erichson, AISTATS 2026) — 최근성 편향의 명시적 주입

이 레포 2026-07-22 커버. **평행성**: 두 논문 모두 "시계열 예측에서 문맥의 어느 부분이 쓰이는가"를 묻는다. 답이 정반대다 — Powerformer 는 **가까운 과거를 더 보게** 마스크를 설계해 이득을 얻고, 이 논문은 **먼 과거(17 $\tau$ 까지)도 계속 도움이 된다**고 보고한다. 모순이 아니라 과제 차이(예측 대상이 추세·주기 중심인가, ergodic 어트랙터인가)일 가능성이 크며, 이 대비 자체가 좋은 연구 질문이다.

---

## 7.3 후손

### ① 실제로 나온 직계 후손 — Zhang & Gilpin, "Context parroting: A simple but tough-to-beat baseline for foundation models in scientific machine learning" (arXiv:2505.11349, **ICLR 2026**)

같은 두 저자의 후속작이며, 이 논문 §5.3 의 관찰을 **논문 한 편으로 승격**시켰다. arXiv 초록 기준: 문맥 창에서 직접 복사하는 단순 베이스라인이 카오스·난류·결합 진동자 등 다양한 동역학계에서 주요 파운데이션 모델을 능가하며 계산량은 훨씬 적다고 보고하고, 이 현상을 **LLM 의 induction head** 와 연결하며, 예측 정확도 스케일링을 카오스 어트랙터의 **프랙탈 차원**과 관계짓는다.

**함의가 크다.** (i) 이 논문의 Claim 1(제로샷이 대등하다)이 후속작에서 **"복사만 해도 이긴다"로 뒤집힌다** — 즉 이 논문만 인용하면 TSFM 에 유리한 방향으로 오독하게 되고, 후속작까지 읽어야 그림이 완성된다. (ii) induction head 연결은 이 논문의 최대 결핍(내부 증거 부재)에 대한 저자들의 자기 응답이다.

### ② 예측되는 후손 A — 불변량 인지 학습 목표 (invariant-aware training)

이 논문이 채점축으로만 쓴 상관차원·$D_{stsp}$ 를 **손실 함수**로 올리는 방향. 점 예측 MSE 에 어트랙터 통계 항을 더해 학습하면, 점 예측이 무너진 뒤의 궤적 품질을 명시적으로 최적화할 수 있다. Appendix E 의 처방 3("rarer states 를 오버샘플링")이 사실상 같은 방향을 가리킨다.

### ③ 예측되는 후손 B — 비정상성 진단기로서의 파운데이션 모델

Appendix E 의 식 (3) 스윕을 뒤집어 쓰는 아이디어. "Chronos 의 VPT 열화 정도"를 **주어진 실세계 시계열의 비정상성 측정치**로 사용하는 것이다. 레짐 전환 탐지에 학습 없이 쓸 수 있고, 금융·산업 데이터에 즉시 적용 가능하다. 이 논문은 비정상성을 독립변수로만 썼지 진단 도구로 뒤집지는 않았다.

### ④ 예측되는 후손 C — RoPE 이식 TSFM

Appendix E 의 처방 1이 문자 그대로 지목하는 방향: Chronos 토크나이저 + RoPE 를 쓰는 현대 LM 백본. 이 레포 2026-07-06(RoFormer)·2026-07-20(ALiBi) 커버와 정확히 이어지며, "위치 인코딩이 추세·비정상성 대응에 기여하는가"라는 반증 가능한 질문을 만든다.
