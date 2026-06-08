# 04 · 핵심 Claim 4 개 해체

본 절의 모든 Claim 은 저자 공식 README 의 abstract 와 공식 코드 저장소의 자료에서 verbatim 추출하거나 그로부터 직접 추론된 것이다. 본문 표/정리 본문 미확보 항목은 "본문 미확보" 로 명시한다.

---

## Claim 1 — "Decoder-only 트랜스포머에 NoPE 가 5 종 명시 PE 보다 길이 일반화에서 더 낫다"

### 주장 (한 문장)
같은 백본 / 같은 데이터 / 같은 평가 protocol 에서, NoPE 가 APE (sinusoidal/learned) · T5-Relative · ALiBi · Rotary 를 평균적으로 능가한다.

### 증거 위치
- **Abstract verbatim** (저자 README): _"Our findings reveal that the most commonly used positional encoding methods, such as ALiBi, Rotary, and APE, are not well suited for length generalization in downstream tasks. More importantly, NoPE outperforms other explicit positional encoding methods while requiring no additional computation."_
- 코드 verifiable: `configs/models/pe_none.jsonnet` 등 8 종 PE 옵션이 동일 백본 (`configs/t5_dec_base.jsonnet`) 위에 PE 만 갈아끼움.
- Wandb run config (`results/runtime_efficiency.jsonl`) 에서 5 종 PE 가 동일한 `cfg__trainer.max_steps=40000`, `cfg__trainer.learning_rate=3e-05`, `cfg__trainer.weight_decay=0.05`, `cfg__trainer.warmup_ratio=0.06`, `cfg__trainer.target_batch_size=64` 로 학습됨이 확인.
- 본문 결과 표 (각 PE × 각 task × 정확도) 는 본 환경에서 본문 미확보 → 절대 수치 단정 안 함.

### 숨은 전제
1. **"길이 일반화" 의 평가 척도가 정확도(accuracy)/시퀀스 정확도(seq_acc) 이다**. `cfg__trainer.metric_for_best_model = "seq_acc"` (verbatim). 다른 척도 (예: perplexity per token, calibration) 였다면 결론이 어떻게 달라졌는지는 모름.
2. **3 개 seed 의 평균이 일반 결론을 대표한다**. SEEDS=256788 / 234054 / 146317 verbatim. 분산이 큰 경우 결론이 흔들릴 수 있는데 본 환경에서 분산 본문 미확보.
3. **Task 분포는 reasoning / mathematical 합성 데이터로 한정**. SCAN 류 명령→액션, s2s 덧셈, scratchpad 류. 자연어 LM perplexity 가 아닌 합성 reasoning. 자연어 LM perplexity 에서도 동일한 NoPE 우위가 성립한다는 보장은 본 논문 안에서 닫혀있지 않다.

### 쉬운 말 풀이
같은 자동차 (백본) 에 다른 5 종 GPS 시스템 (PE) 을 달아보고, GPS 없는 차와 비교했더니, GPS 없는 차가 모르는 동네 (학습 외 길이) 에서 더 잘 달렸다. 이게 가능한 이유는 차의 다른 센서 (causal mask) 가 이미 위치 정보를 충분히 제공하고 있었기 때문이다.

---

## Claim 2 — "NoPE 는 이론적으로 절대 PE 와 상대 PE 둘 다 표현 가능하다"

### 주장 (한 문장)
PE 없는 decoder-only 트랜스포머 attention 이, 적절한 가중치 선택 하에서, APE 또는 T5-relative PE 형식의 attention 분포를 정확히 구현할 수 있다.

### 증거 위치
- Abstract verbatim: _"We theoretically demonstrate that NoPE can represent both absolute and relative PEs, but when trained with SGD, it mostly resembles T5's relative PE attention patterns."_
- 본 환경에서 정리 / 보조정리 / 증명 본문 미확보 → 정리 번호와 증명 디테일 단정 안 함.

### 숨은 전제 (수학적 추정 — 본문 미확보로 단정 X)
- 표현력 정리가 통상적으로 어떻게 보여지는지 (선행연구 Tsai 2019, Haviv 2022 의 흐름) 를 고려하면:
  - **Causal mask 의 비대칭성** 이 핵심. $\mathrm{mask}_{ij} = -\infty$ if $j > i$ 라는 비대칭이 토큰 $i$ 의 "내가 몇 번째인가" 라는 정보를 attention 의 receptive field 크기로 implicit 하게 encode 한다.
  - **첫 layer 의 attention 이 카운팅 회로 (counting head)** 를 학습할 수 있으면, 이후 layer 들이 그 카운트를 위치 신호처럼 사용 가능. 본 논문이 이 카운팅 회로의 존재를 가정할 가능성이 있음 (본문 미확보로 단정 안 함).
  - **첫 토큰 (BOS) 이 absolute origin** 의 역할을 한다는 prior. README 의 `Important Note` 에서 `prompt = "def print_hello_world():"` 앞에 `<bos>` 를 prepend 하는 코드가 명시됨 — BOS 의 존재가 NoPE 의 implicit 위치 신호의 anchor.

### 쉬운 말 풀이
"GPS 가 없어도 차에 이미 달린 다른 센서들 (causal mask, BOS 토큰) 이 충분히 정확한 위치 정보를 만들어낼 수 있음을 수학적으로 증명했다. 더 흥미로운 건, 실제로 학습된 NoPE 모델의 attention 패턴이 T5 의 상대 거리 패턴을 닮았다는 것 — 즉, NoPE 가 자기도 모르게 T5-relative PE 와 비슷한 회로를 만들어낸다."

### Claim 2 의 약점
- "표현 가능 ≠ 학습 가능" 이라는 일반 한계. 이론은 representation 만 보장하고 SGD trajectory 위의 수렴은 별도 문제. 저자들도 abstract 에서 "mostly resembles T5's relative PE" 라는 표현으로 이를 약화시킨다 — "다 표현 가능하지만 SGD 는 T5-rel 비슷하게만 수렴한다".
- "어떤 layer 가 카운팅 회로를 학습하는가" 라는 mechanistic 질문은 본 논문에서 풀린 것으로 보이지 않음. README 의 `attention_kl_analyzer.py` 와 `attention_distance_final.ipynb` 가 이를 측정만 함.

---

## Claim 3 — "SGD 로 학습한 NoPE 의 attention 은 T5-relative PE 의 attention 과 가장 유사하다"

### 주장 (한 문장)
NoPE 모델의 attention 분포와 다른 4 종 PE 모델의 attention 분포 사이 거리 (KL divergence) 를 측정하면, T5-relative PE 가 가장 가까운 거리를 가진다.

### 증거 위치
- Abstract verbatim: _"...when trained with SGD, it mostly resembles T5's relative PE attention patterns."_
- 코드 verifiable: `src/analyzers/attention_kl_analyzer.py` 에 "current_pe_type == 'none'" 분기와 함께 NoPE 의 attention 을 reference 로 두고 다른 PE 모델의 attention 과 KL 을 계산하는 분석기가 있음. `scripts/experiment_uploaders/attention_kl_analysis.py` 에서도 `cfg__model.position_encoding_type == "none"` 으로 NoPE run 을 필터링하는 코드 verbatim 확인.
- Notebook `notebooks/plot_attention_distance_final.ipynb` 와 `notebooks/download_attention_similarity_data.ipynb` 는 PE 별 attention 분포 비교 시각화의 존재를 증명.

### 숨은 전제
1. KL 비교가 attention 평균 분포 (head 평균, layer 평균) 위에서 계산되는지, 토큰별로 계산되는지에 따라 의미가 다름. 본 환경에서 KL 계산식 본문 미확보.
2. T5-relative 와의 유사성은 단지 inductive bias 의 우연한 일치일 수도 있다 — "위치-거리 효과가 학습으로 emerge" 라는 일반 현상의 한 instance.
3. "T5 가 best" 가 아니라 "T5 가 NoPE 와 가장 닮음" 임. NoPE 가 길이 일반화에서 1 위인데 NoPE 가 T5 와 닮았다면, T5 가 명시 PE 중 가장 잘 해야 할 것 같지만 abstract 에서 "ALiBi, Rotary, and APE are not well suited" 만 언급하고 T5 의 별도 지위는 모호하게 둠. 본문 미확보로 그 모호함의 해소 단정 못 함.

### 쉬운 말 풀이
NoPE 모델이 학습 후 "어디를 보는지" 의 패턴을 보면, 그게 T5 가 만든 "거리별 패널티" 패턴과 닮았다. 즉 모델은 PE 가 없을 때 "거리 기반 inductive bias" 를 스스로 만들어내는데, 그게 우연히 T5 가 명시적으로 주는 inductive bias 와 비슷한 모양이다.

---

## Claim 4 — "Scratchpad 는 길이 일반화에 항상 도움이 되지 않으며 그 포맷이 결정적이다"

### 주장 (한 문장)
모델이 중간 계산 단계를 텍스트로 출력하는 scratchpad 기법은 길이 일반화에서 일관되게 도움이 되지 않고, 사용된 marker 포맷에 따라 성능이 크게 변한다.

### 증거 위치
- Abstract verbatim: _"...we find that scratchpad is not always helpful to solve length generalization and its format highly impacts the model's performance."_
- 코드 verifiable: `cfg__dataset.instance_processor.intermediate_variables_marker_begin = "["`, `..._end = "]"`, `step_separator = " # "`, `computation_marker = "comp"`, `input_marker = "in"`, `output_marker = "out"`, `remaining_input_marker = "re"` 등 scratchpad 포맷 변수가 wandb run config 에 verbatim 노출. 이 marker 들의 조합이 "scratchpad format" 의 정량적 차원임을 시사.
- `scratchpad_config` 라는 별도 키워드가 `final_attention_kl_analysis.py` 에 verbatim 등장 → scratchpad 별로 attention 분석이 갈리는 구조.

### 숨은 전제
1. Scratchpad 포맷 차원을 "marker 토큰 선택" 으로 환원. 다른 차원 (자연어 vs 코드, 단계 수, intermediate variable 명명 규칙) 은 분리 분석되었는지 본문 미확보.
2. "도움이 되지 않는다" 의 정량적 의미가 abstract 만으로는 불명확. "평균 정확도가 동일하다", "어떤 task 에서는 도움되지만 다른 task 에선 안 됨", "포맷 sensitivity 가 매우 크다" 중 어느 의미인지 본문 미확보로 단정 못 함.

### 쉬운 말 풀이
"중간 계산을 한 줄 한 줄 쓰면서 풀면 더 잘 풀린다" 는 통념을 본 논문은 깎아내린다. 어떤 marker 로 단계를 구분하느냐 (대괄호? 해시? 공백?) 같은 사소한 디자인이 결과를 크게 바꾼다. 즉 chain-of-thought 자체보다 그 표기법이 본질일 수 있다.

---

## Claim 들의 상호 작용

Claim 1 (NoPE 가 이긴다) 은 abstract level 의 경험적 발견.
Claim 2 (NoPE 가 표현 가능) 는 이론적 가능성.
Claim 3 (NoPE attention 이 T5-rel 닮음) 은 SGD 의 inductive bias 가 "어떤" 표현으로 수렴했는지의 mechanistic 증거.
Claim 4 (scratchpad format 영향) 는 NoPE 우위가 reasoning task 특수성에 의존할 가능성을 시사 — 추론 task 의 layout 자체가 결과의 큰 변수임을 인정.

네 Claim 모두 verbatim abstract 와 공식 코드 자산으로 뒷받침된다. **그러나 각 Claim 의 정량적 강도 (몇 % 차이로 이기는가, KL 이 얼마나 작은가, scratchpad format 별 분산이 얼마인가) 는 본 환경에서 본문 표 미확보로 단정 불가.** 본 해체는 이 한계를 유지한 채 정성적 해석만 한다.
