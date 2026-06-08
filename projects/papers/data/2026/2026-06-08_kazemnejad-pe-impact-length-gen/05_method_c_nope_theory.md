# 05 · 방법론 (c) — NoPE 표현력 주장의 해부

본 절은 Claim 2 ("NoPE 가 절대 PE 와 상대 PE 둘 다 표현 가능") 를 푼다. **저자 공식 abstract 의 verbatim 표현 "We theoretically demonstrate that NoPE can represent both absolute and relative PEs"** 가 정리의 존재를 보장하지만, **본 환경에서 정리 본문, 증명, 보조정리 미확보** 이므로 본 절은 표현력 주장이 통상적으로 어떻게 보여지는가 (선행 연구 흐름 + 코드 + abstract) 의 재구성이다. 단정형 statement 는 abstract 에서 verbatim 확인된 부분에만 사용.

## 배경 사다리
이 절을 이해하려면 ① "표현력 (expressive power)" 이 "어떤 함수를 모델이 가중치 선택만으로 정확히 실현할 수 있는가" 의 의미라는 점, ② "학습 가능 (learnable)" 과 "표현 가능 (representable)" 이 다른 차원이라는 점 (전자는 SGD 가 도달하는가, 후자는 가중치 공간에 존재하는가), ③ 트랜스포머의 한 layer 가 어떻게 attention + FFN 의 합성인지 정도만 알면 된다.

## 1. 무엇을 보여야 하는가

### 표현력 주장의 형식 (추정 — 본문 미확보)
"임의의 PE 종류 $\mathcal{P} \in \{$ APE, T5-relative, ALiBi, Rotary $\}$ 가 산출하는 attention pattern $\{ A^{(\mathcal{P})}_{ij} \}$ 에 대해, PE 없는 decoder-only attention layer 가 가중치 $W_Q, W_K$ 의 적절한 선택으로 $\{ A^{(\mathcal{P})}_{ij} \}$ 와 (epsilon 오차 내에서) 일치하는 attention 을 산출할 수 있다."

여기서 "산출" 의 의미는 보통 둘 중 하나 — (a) 단일 layer 내에서 산출, (b) 다중 layer 의 합성으로 산출. Abstract 의 "both absolute and relative PEs" 표현은 single-layer representation 보다는 multi-layer 합성에 가까운 결과일 가능성이 높다 (이론적으로 더 자연).

### 핵심 메커니즘 후보 (추정)
1. **첫 layer 에 카운팅 회로** — `<bos>` 토큰을 anchor 로 삼아, attention 첫 layer 에서 각 토큰이 자기보다 앞의 토큰 수 (즉, 자기 위치) 를 hidden state 에 cumulatively encode.
2. **카운팅 결과의 위치 신호 활용** — 이후 layer 들의 attention 이 그 hidden state 의 "위치 컴포넌트" 를 query/key 의 일부로 끌어와 절대 위치 의존 attention 을 emulate.
3. **상대 위치 추출** — 두 토큰의 absolute 카운트의 차이가 곧 상대 거리. 따라서 absolute representation 이 가능하면 relative representation 도 가능.

이 메커니즘이 본 논문 정리의 실제 구성이라는 보장은 본 환경에서 본문 미확보로 없다. 그러나 코드의 `attention_kl_analyzer.py` 와 `plot_attention_distance_final.ipynb` 가 정확히 "PE 없을 때 attention 이 어떤 거리 의존 패턴을 emerge 시키는가" 를 측정하는 도구라는 점은 이 메커니즘이 본 논문의 분석 framework 안에 있음을 시사한다.

## 2. Causal mask 가 핵심인 이유

NoPE 가 작동하려면 attention 자체가 비대칭이어야 한다. Encoder (양방향) attention 에서 PE 가 없으면 모델은 토큰 집합을 permutation 불변하게 처리하므로 위치 정보 자체를 만들 수 없다.

Decoder-only causal mask:
$$\mathrm{mask}_{ij} = \begin{cases} 0 & j \leq i \\ -\infty & j > i \end{cases}$$

이 비대칭 자체가 위치 차이를 만든다:
- 토큰 0 은 자기 자신만 본다 (1 개)
- 토큰 1 은 자기 + 이전 (2 개)
- 토큰 $i$ 는 $i+1$ 개 토큰을 본다

→ **각 토큰이 보는 토큰 수 = $i + 1$ 이므로 attention 의 "정규화 상수" 가 위치 의존**.

Softmax 출력 분포의 entropy 가 위치 $i$ 에 따라 자연스럽게 달라지고, 이 entropy 자체가 위치 신호의 source 가 된다. 정확히 어떻게 이 entropy 가 hidden state 에 위치 정보로 흡수되는지의 mechanistic 디테일은 본 논문 본문 미확보로 단정 못 함.

### 4 줄 해석
- **기호 뜻**: $\mathrm{mask}_{ij}$ 는 softmax 직전 $A_{ij}$ 에 더해지는 큰 음수. $-\infty$ 는 그 토큰을 attention 분포에서 0 으로 만듦.
- **일상 비유**: 토론 자리에서 "내 차례 이전 사람들의 말만 들을 수 있다" 라는 규칙. 첫 번째 사람은 본인 말만, 마지막 사람은 모두의 말을 듣는다. 들을 수 있는 사람 수 자체가 자기 차례 번호의 단서.
- **왜 이 형태**: Autoregressive language modeling 의 필수 조건. NoPE 의 위치 신호는 이 mask 의 부산물.
- **조심할 점**: Encoder 모델 / bidirectional attention 모델에는 적용 안 됨. 본 논문 주장이 GPT 류에만 한정되는 핵심 이유.

## 3. BOS 토큰의 역할 (READ ME verbatim 신호)

저자 README 의 1B-scale 사용 예시 코드:
```python
input_ids = torch.cat([torch.tensor([[tokenizer.bos_token_id]], device="cuda"), input_ids], dim=1)
```

**입력 앞에 `<bos>` 를 강제 prepend**. 이는 NoPE 모델에서 위치 0 의 anchor 가 항상 BOS 임을 보장한다 — 즉, "위치 인덱스" 라는 추상이 attention 회로에서 "BOS 로부터 몇 단계" 라는 구체로 환원된다.

만약 BOS 가 없거나 일관되지 않으면 NoPE 모델의 implicit 위치 신호의 origin 이 흔들린다. 이는 NoPE 사용 시 inference 시점에서도 BOS 처리에 주의해야 함을 시사한다. 본 논문 본문이 이 BOS 의존성을 어떻게 다루는지는 미확인.

## 4. "Representable" 과 "Learnable" 의 격차

Abstract verbatim: _"...when trained with SGD, it mostly resembles T5's relative PE attention patterns."_

이 한 줄이 정리와 실험의 격차를 직접 인정한다 — **정리는 "표현 가능" 만 보장하고, 실제 SGD 학습은 T5-relative 비슷한 한 가지 형식으로만 수렴한다**.

이 격차의 함의 :
1. NoPE 의 표현력이 절대 PE 를 포함한다고 해도, 실제 SGD 는 절대 PE 형식을 학습하지 않는다. SGD 의 inductive bias 가 상대 거리 표현으로 기울어 있음.
2. 만약 절대 위치 의존 task (예: "10 번째 토큰이 무엇인가") 가 평가에 포함되면 NoPE 의 우위가 흔들릴 가능성. 본 논문이 그런 task 를 포함했는지는 본문 미확보.
3. **이 격차 자체가 mechanistic interpretability 의 흥미로운 측정 대상** — 왜 SGD 는 표현 가능한 다른 form 들 중 T5-relative 형태를 선호하는가? 본 논문 안에서는 측정만 하고 설명은 제한적일 가능성.

## 5. 표현력 정리의 다른 가능한 형식 (선행 비교)

- **Tsai et al. 2019** ("Transformer Dissection") — attention 자체가 절대/상대 위치 정보를 다양한 inductive bias 하에서 인코딩 가능함을 일반화. 본 논문은 이 line 의 NoPE-specific 변형으로 보인다.
- **Haviv et al. 2022** ("Transformer Language Models without Positional Encodings Still Learn Positional Information") — NoPE 가 위치 정보를 학습한다는 EMNLP findings. 본 논문 정리는 Haviv 의 실증을 representational 으로 강화한 형태.
- **Wei et al. 2022** ("Statistically Meaningful Approximation") 류의 expressivity 분석 — 트랜스포머가 dynamic programming / 카운팅 회로를 학습 가능함. NoPE 카운팅 회로의 존재 가능성을 뒷받침.

**본 논문의 신규성**은 (1) NoPE 가 5 종 명시 PE 와 head-to-head 비교에서 이긴다는 경험적 발견 + (2) NoPE attention 이 T5-relative 와 가장 닮는다는 mechanistic 측정 + (3) (추정) 표현력 정리의 결합. (3) 단독이 신규는 아니나, 셋의 통합이 NeurIPS 2023 의 accept 사유로 추정됨.

## 6. 정리 (Theorem) 가능 형식 - 추정 (본문 미확보)

본문 정리 번호와 statement 를 단정하지 못하나, 통상의 형식을 재구성하면:

> **Theorem (추정)**: 임의의 PE 종류 $\mathcal{P}$ 와 임의의 attention pattern $A^{(\mathcal{P})}$ 에 대해, depth $\geq 2$ 인 NoPE causal decoder-only attention 의 가중치 $\{W_Q^{(\ell)}, W_K^{(\ell)}, W_V^{(\ell)}\}_{\ell=1,2}$ 가 존재해 attention pattern $A^{(\text{NoPE})}$ 가 $A^{(\mathcal{P})}$ 와 일치 (또는 epsilon 오차 이내 근사) 한다.

이는 추정이며 본문 검증 필요. 실제 정리는 더 약한 form ("APE 와 T5-rel 형식만") 일 수도, 더 강한 form ("모든 거리 의존 함수에 대해") 일 수도 있다.

## 핵심 한 문장 요약
"NoPE 는 causal mask 의 비대칭과 BOS anchor 로 위치 정보를 implicit 하게 만들 수 있고 (표현 가능), 실제 SGD 는 그 가능한 표현들 중 T5-relative 형식과 닮은 한 가지로 수렴한다 (학습 결과). 표현력 ≠ 학습 결과의 격차가 본 논문 정리와 실험의 결합 지점."
