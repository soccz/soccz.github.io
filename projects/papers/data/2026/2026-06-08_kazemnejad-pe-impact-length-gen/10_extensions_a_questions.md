# 10 · 사고 확장 (a) — 자문 질문 5 개

이 절은 본 논문을 읽으며 자기에게 던지는 질문 5 개와 그 질문이 왜 중요한지를 기록한다. 답을 다 내지는 않고 — 다음 연구로 가는 방향 표시.

## Q1. NoPE 의 implicit 위치 신호는 정확히 몇 번째 layer 에서 emerge 하는가?

**왜 중요한가**: 본 논문은 "NoPE attention 이 T5-rel 과 닮음" 을 평균적으로 보였지만, 어느 layer 에서 그 닮음이 형성되는지의 mechanistic 깊이는 미해결. ACDC / Sparse Feature Circuits 같은 mech interp 도구로 측정 가능한 질문. 만약 1 번째 layer 에서 카운팅 회로가 emerge 하고 그 이후 layer 들이 그것을 사용한다면, NoPE 의 "위치 인식 메커니즘" 의 첫 layer 를 disable 했을 때 무슨 일이 일어날지 검증 가능 — 이는 APF 의 causal intervention 의 가장 자연스러운 후속.

## Q2. NoPE 의 우위는 task 길이 외삽 비율 (test/train) 에 어떻게 의존하는가?

**왜 중요한가**: 본 논문의 `len_tr8_ts16`, `mdlen_tr25_ts48` split 은 2 배 외삽 정도. 만약 16 배, 32 배 외삽에서 NoPE 의 우위가 사라진다면, NoPE 의 implicit 위치 신호도 결국 어떤 길이 한계를 가진다는 의미. 본 논문의 `eval max_length = 2048`, `decoder_only_block_size = 128` 가 16 배 비율을 시사하지만, 16 배 너머의 결과가 본 환경에서 본문 미확보. 이 질문은 NoPE 의 한계의 양적 경계를 정한다.

## Q3. SCAN 외의 task — 특히 자연어 LM perplexity — 에서 NoPE 의 우위가 유지되는가?

**왜 중요한가**: 본 논문 결론의 일반화 가능성을 결정. 만약 자연어 LM 에서 NoPE 가 ALiBi 보다 perplexity 가 높다면, 본 논문의 framing 은 "reasoning task 한정 NoPE 우위" 로 약화. 1B-scale CodeLLM 후속이 부분적 답이지만, README 의 Important Note 가 "main result 와 직접 호환 안 됨" 을 인정한 이유. 자연어 LM 후속 실험이 본 논문 framing 의 직접 검증 trigger.

## Q4. NoPE attention 이 T5-rel 과 가장 닮은 이유 — SGD 의 inductive bias 의 source 는?

**왜 중요한가**: 표현 가능한 PE form 의 공간 안에서 SGD 가 왜 T5-rel-like attention 으로 수렴하는지의 mechanistic 설명은 본 논문 안에 없다. 가능 후보:
- "거리 기반 inductive bias" 가 학습 안정성 측면에서 더 큰 basin 의 attractor
- 토큰 임베딩의 statistical 구조가 거리 기반 attention 을 자연스럽게 emerge
- Optimizer (Adam) 의 step size adaptation 이 거리 기반 pattern 의 학습을 가속

이 질문에 답이 나오면 PE design 자체가 더 정확해진다 — "SGD 가 좋아하는 attention form 을 inductive bias 로 명시적으로 주입" 하는 식으로.

## Q5. NoPE 가 TS Transformer 에서도 우위인가? — APF 의 직접 검증 가능

**왜 중요한가**: TS 의 PE 는 시간성 / 주기성 의미를 가지므로 자연어 PE 와 본질적으로 다르다. 만약 TS 에서도 NoPE 가 우위라면, "PE 의 inductive bias 가 학습을 방해" 라는 본 논문 framing 이 도메인 무관 truth 에 가까워진다. 만약 TS 에서 NoPE 가 약하다면, 본 논문 결론은 "PE 의 의미가 없는 도메인 (위치가 단지 인덱스인 reasoning task) 한정". 이는 APF 가 PatchTST / iTransformer 의 patch token 위에서 NoPE control 실험을 추가하면 직접 측정 가능. P2 ProTran-TFA 의 finance TS forecasting 에서도 NoPE 가 ALiBi / RoPE 를 이기는지의 sub-experiment 가능.
