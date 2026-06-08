# 02 · 3층 TL;DR

## 🧒 초등학생 수준 (수식 없이)

"길이 일반화 (length generalization)" 라는 말은 어렵게 들리지만 사실 비유는 단순하다. 학교에서 두 자리 곱셈만 풀어본 학생에게 갑자기 세 자리 곱셈을 풀라고 시키는 상황과 같다. 트랜스포머 (transformer, 요즘 챗봇·검색·번역의 기본 모델) 도 비슷한 어려움을 겪는다. 짧은 문장으로만 훈련했는데, 시험은 더 긴 문장으로 보면 갑자기 못한다.

지금까지 사람들은 모델에게 "단어가 몇 번째에 있는지" 알려주는 작은 표시 (이게 위치 인코딩 = Positional Encoding, 줄여서 PE) 를 모델에 붙여줘야 한다고 믿어왔다. 그 표시 방식에는 여러 학파가 있다. 절대좌표를 알려주는 학파, 두 단어 사이 거리만 알려주는 학파, 회전시켜서 알려주는 학파, 거리에 비례한 패널티를 주는 학파.

이 논문은 묻는다. "그 표시를 아예 안 주면 어떻게 될까?"

놀랍게도 그게 제일 잘 했다.

표시를 안 주면 모델이 알아서 위치 감을 만들어내는데, 그게 다섯 가지 PE 방식들보다 길이가 늘었을 때 더 잘 견딘다. 마치 보조 바퀴 (PE) 없이 자전거를 배운 아이가 더 다양한 지형 (긴 문장) 에서 더 잘 타는 것과 비슷하다. 단, "trans+former 본체"가 이미 한 방향으로만 보는 (causal mask) 구조라야 이런 현상이 가능하다.

## 🎓 학부생 수준 (수식 조금)

### 문제
디코더 전용 트랜스포머 (decoder-only Transformer, GPT 류) 가 학습 컨텍스트 길이 $L_{\text{train}}$ 으로 훈련된 뒤, 평가에서 $L_{\text{test}} > L_{\text{train}}$ 인 입력을 받았을 때 정확도가 급락한다. 이걸 **length generalization 문제** 라고 한다.

### 후보 다섯
저자들은 다섯 종류 PE 를 통제 비교한다:
- **APE** (Absolute Positional Embedding, sinusoidal 또는 learned): 토큰 임베딩에 위치 벡터를 더한다. Vaswani 2017 의 원조.
- **T5 Relative PE**: 두 토큰 거리 $i - j$ 를 버킷화 (bucketing) 해서 attention bias 로 더한다. Raffel 2020.
- **ALiBi**: attention score 에 $- m_h \cdot |i - j|$ 라는 선형 감쇠 bias 를 head 별로 다른 기울기 $m_h$ 로 더한다. Press 2022.
- **Rotary (RoPE)**: query/key 를 각 frequency 채널에서 $\theta = i \omega_k$ 만큼 회전시켜 dot product 가 거리 의존이 되도록 한다. Su 2021.
- **NoPE**: PE 를 아예 안 쓴다. 토큰 임베딩만 들어가고, causal mask 만 위치 정보의 소스가 된다.

### 발견
- 길이 일반화 평가 task (SCAN, scratchpad addition 등의 reasoning) 에서 NoPE 가 다른 4 종을 이긴다.
- 저자들은 NoPE 가 **이론적으로** 절대 위치와 상대 위치 둘 다 표현 가능함을 보이고, **실제로** SGD 로 학습된 NoPE 의 attention 패턴이 T5-relative PE 의 attention 패턴과 가장 가깝다 (KL 분석) 는 것을 보인다.
- **Scratchpad** (모델이 중간 계산을 텍스트로 출력하는 기법) 는 항상 도움이 되지 않으며, 그 포맷에 따라 성능이 크게 달라진다.

### 핵심 한 줄
"PE 를 추가하는 것이 NoPE 를 이긴다는 보장은 없다 — 적어도 길이 일반화 평가에서는 명시적 PE 가 추가 표현력보다는 추가 inductive bias 의 함정이 더 크다."

## 🔬 전문가 수준 (contribution 4 개)

1. **5 종 PE 의 통제 비교 protocol 확립** — 동일한 T5-base decoder-only 백본 (`d_model`, `d_ff` 등 동일) 에 PE 만 갈아끼우고, **3 개 seed × 다중 길이 split** 으로 평가. 기존 PE 비교 논문들이 base 모델이나 task suite 가 일관되지 않은 문제를 해결. (verifiable: `configs/t5_dec_base.jsonnet` + `configs/models/pe_*.jsonnet` + SEEDS=256788/234054/146317)

2. **NoPE 의 표현력 정리** — Causal-mask 만으로도 토큰 위치를 implicit 하게 복원 가능함을 이론적으로 보인다. 구체적으로는 (논문 본문 미확보로 정리 번호 단정 안 함) "어떤 NoPE attention layer 가 임의의 절대 PE 또는 상대 PE 형식의 attention pattern 을 표현할 수 있다" 는 형태의 representation result. 실험으로는 SGD 학습 후 NoPE attention 이 T5-relative PE attention 에 가장 가까운 KL 분포를 가진다.

3. **Reasoning task suite 에서 NoPE > APE / T5-rel / ALiBi / Rotary** — `s2s_addition`, `scan` 등 길이 split (`len_tr8_ts16`, `mdlen_tr25_ts48` 등) 에서 길이 일반화 성능을 측정. 본 환경에서 결과 표 본문 미확보이므로 절대 점수는 단정 안 함; 단 abstract 에서 "NoPE outperforms other explicit positional encoding methods" 를 명시.

4. **Scratchpad 의 양면성** — Scratchpad 자체가 만능 해결책이 아니며 포맷이 핵심 변수. Abstract 에서 "scratchpad is not always helpful to solve length generalization and its format highly impacts the model's performance" 를 명시. 이는 후속 chain-of-thought 분석 (CoT-faithfulness, scratchpad layout) 연구의 trigger 가 됨.

### 방어 가능한 주장
- "Decoder-only causal mask 의 비대칭성 자체가 implicit position signal 을 만든다" 라는 표현은 그 자체로는 새로운 게 아니다 (Tsai 2019, Haviv 2022 등 선행). **새로운 부분은 그 implicit signal 이 T5-relative bias 와 같은 explicit signal 보다 실제 task 에서 더 견고하다는 경험적 증거**.

### 알려진 한계 (저자 본인이 README 에서 인정)
- 1B-scale CodeLLM 후속 모델은 paper main result 의 small model 과 "significantly differ" 하므로 직접 평가에 부적합 (README "Important Note"). 즉 main paper 의 결론이 더 큰 모델에 그대로 일반화된다는 보장은 본 논문 안에서 닫혀있지 않다.
- Encoder / encoder-decoder 모델에는 적용 안 함. NoPE 가 작동하는 핵심은 causal mask 의 비대칭이므로, bidirectional attention 에선 동일 주장 못 한다 (이는 후속 Haviv 류 후속 연구의 영역).
