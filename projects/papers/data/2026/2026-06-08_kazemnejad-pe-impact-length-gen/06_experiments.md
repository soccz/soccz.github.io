# 06 · 실험 해부

본 절은 본 논문의 실험 구조를 해부한다. **모든 hyperparameter / dataset / metric 명시는 저자 공식 GitHub `results/runtime_efficiency.jsonl` 와 `configs/` 디렉토리 verbatim 에서 확인된 값** 이며, 본문 결과 표의 절대 수치는 본 환경에서 본문 미확보로 단정하지 않는다.

## 배경 사다리
이 절을 이해하려면 ① 합성 reasoning task (SCAN, 덧셈 등) 가 LLM 평가에 사용되는 이유, ② "split" 이 "학습/평가의 길이/분포 분리" 라는 점, ③ "scratchpad" 가 모델이 중간 계산 단계를 텍스트로 출력하는 기법 정도만 알면 된다.

## 1. 데이터셋 별 분석

### 1.1 `s2s_addition` (sequence-to-sequence 덧셈)
- **무엇인가**: 두 수의 합을 단계별로 풀이하는 합성 task. 입력 = "13 + 47", 출력 = "= 60" 같은 형식 (정확한 표면 표기는 instance_processor 의 marker 설정에 의함).
- **확인된 split**: `len_tr8_ts16` (verbatim) — 학습 시 최대 입력 길이 8 토큰, 평가 시 16 토큰. **2 배 외삽**.
- **scratchpad marker (verbatim)**:
  - `input_marker = "in"`
  - `output_marker = "out"`
  - `computation_marker = "comp"`
  - `step_separator = " # "`
  - `remaining_input_marker = "re"`
  - `intermediate_variables_marker_begin = "["`, `..._end = "]"`
- **이 데이터가 이 논문의 주장에 적합한 이유**:
  - 길이 확장이 완전히 통제 가능 (몇 자리수 → 몇 자리수)
  - 정답의 alphabet 이 작아 평가가 명확 (exact match)
  - 자릿수마다 carry 가 발생해 위치 의존성이 본질적
- **숨은 편향**:
  - 자릿수가 위치와 1:1 대응 → 위치 의존성이 "강한" task. PE 의 inductive bias 가 결정적이다.
  - 합성 데이터 → 자연어 분포와 다름. NoPE 우위가 자연어 LM 에 그대로 외삽되지 않을 가능성.

### 1.2 `scan` (SCAN: 합성 명령어 → 액션 시퀀스)
- **무엇인가**: Lake & Baroni 2018 의 합성 reasoning task. 명령 "jump twice and walk thrice" → 액션 "JUMP JUMP WALK WALK WALK".
- **확인된 split**: `mdlen_tr25_ts48` (verbatim) — 학습 시 최대 25, 평가 시 48 토큰. **약 2 배 외삽**.
- **이 데이터가 이 논문의 주장에 적합한 이유**:
  - SCAN 은 compositional generalization 의 표준 benchmark
  - 액션 시퀀스 길이가 명령 길이에 비례 → length generalization 의 자연스러운 setup
  - 정답이 deterministic 함수 → 명확한 평가
- **숨은 편향**:
  - SCAN 의 어휘는 제한적 (수십 단어) → 토큰 임베딩의 표현력이 자연어보다 훨씬 단순
  - "PE 가 없으면 더 잘함" 이 SCAN 의 특수성에 의존할 가능성. SCAN 의 정답이 명령의 substring 구조 (parsing tree) 에 의존하므로, 절대 위치보다 상대 거리가 더 유용한 task

### 1.3 본 환경에서 미확인 task
README 의 abstract verbatim: _"Our evaluation encompasses a battery of reasoning and mathematical tasks."_

저자가 평가한 모든 task 목록 (논문 본문 Section 4 또는 5 에 있을 추정) 은 본 환경에서 `configs/data/` 의 디렉토리 listing 차단 (GitHub MCP 권한 미설정 + WebFetch 403) 으로 미확인. 검색 fragment 에서 확인된 task 는 위 두 개와 `s2s_addition` 뿐.

가능한 다른 task (선행 length-gen 연구에서 표준):
- Polynomial evaluation (다항식 계산)
- Parity (홀짝 판별)
- Sort (정렬)
- Lookup / Copy / Reverse
- LEGO (Tafjord 2020 류)

본 논문이 이 중 어느 것을 사용했는지는 본문 미확보. 본 해체에서는 확인된 두 task 만 단정.

## 2. 베이스라인 공정성 평가

### 동일성이 보장된 변수 (verbatim)
- 백본: `t5-base` (custom decoder-only mode)
- Pretrained: false (전부 from scratch)
- Tokenizer: `t5-base` (default)
- max_steps: 40000
- learning_rate: 3e-5
- weight_decay: 0.05
- warmup_ratio: 0.06
- lr_scheduler: polynomial
- batch_size: 64
- generation_max_length: 256
- generation_num_beams: 1 (greedy)
- decoder_only_block_size: 128
- max_source_length: 256, max_target_length: 256
- 3 seed (256788, 234054, 146317)

### 공정성의 불안한 점
1. **모든 PE 에 동일 lr**. ALiBi 는 PE 파라미터 ($m_h$) 가 없거나 매우 적어 다른 lr 이 최적일 수 있음. PE 별 lr 스윕 결과는 본문 미확보 (실제로 했더라도).
2. **모든 PE 에 동일 max_steps**. NoPE 가 더 오래 학습해야 수렴할 수도 있음. Abstract 의 결과가 underfitting NoPE 와 비교한 것이라면 NoPE 의 진짜 잠재력은 더 클 수 있음.
3. **3 seed 만의 평균**. SCAN/덧셈에서 PE 간 차이가 작으면 3 seed 평균의 분산이 결론을 흔들 가능성. 본문에서 분산 보고 형식 (오차 막대, 신뢰 구간) 미확인.

## 3. 지표 선택

- **`metric_for_best_model = "seq_acc"`** (verbatim) — sequence-level exact match.
- **예측 방식**: `predict_with_generate = true`, 즉 autoregressive generation 후 정답 시퀀스와 string 비교.

### 다른 지표였다면 결론이 어떻게 달라졌을지
- **Token-level accuracy** — 시퀀스 일부만 맞은 경우도 부분 점수. NoPE 의 우위가 시퀀스 후반에서 더 강하다면 token-level 에서 격차가 줄어들 수 있음.
- **Perplexity** — 자연어 LM 평가에서 일반적. 본 논문이 perplexity 를 보고했는지 본문 미확보. 만약 perplexity 가 PE 간 비슷한데 seq_acc 만 NoPE 가 우위라면, NoPE 의 우위는 "마지막 토큰 도달 확률 분포" 에서만 발생한다는 mechanistic 해석 가능.
- **Length bucket 별 accuracy** — `cfg__analyzers.0.length_bucket_width = 100` (verbatim) 으로 본 논문도 이를 보고할 것으로 추정. 길이별 곡선이 본 논문의 가장 강력한 시각 증거일 가능성 (본문 미확보).

## 4. 주요 figure / table 추정

**본문 미확보 — 본 절은 README 의 abstract + 코드 fragment + notebook 이름에서 figure 의 존재만 추정한다. 절대 수치 단정 X.**

### 추정 Figure 1 — Length bucket accuracy 곡선
- x 축: 입력 길이 (학습 길이 ~ 외삽 길이)
- y 축: seq_acc
- 5 + 1 곡선 (APE / APE-learned / T5-rel / ALiBi / Rotary / NoPE)
- 학습 길이 내에서는 비슷, 외삽 영역에서 NoPE 가 가장 천천히 감소.

### 추정 Figure 2 — Attention KL heatmap
- 행: 명시 PE (APE / T5-rel / ALiBi / Rotary)
- 열: layer 또는 head
- 색: NoPE 와의 KL
- T5-rel 행이 평균적으로 가장 어두움 (작은 KL).

### 추정 Figure 3 — Attention distance 분포
- `plot_attention_distance_final.ipynb` 에서 도출.
- 각 PE 별로 "각 head 가 query-key 거리 분포의 평균을 어디에 두는가" 시각화.
- NoPE 와 T5-rel 의 곡선이 닮음, 다른 PE 는 다름.

### 추정 Table — Scratchpad format 영향
- 행: scratchpad format 변형 (marker 다양화)
- 열: 각 PE 의 seq_acc
- 어떤 PE 는 특정 format 에서 격차가 크고, 다른 PE 는 robust 한 패턴이 보일 것.

## 5. Ablation

본 논문이 명시적으로 한 ablation 의 후보 (코드 구성에서 추정):
- `pe_alibi_lrnd` (ALiBi 의 기울기 $m_h$ 학습 가능) vs `pe_alibi` (고정 $m_h$)
- `pe_newRot` (Rotary 의 미세 변형) vs `pe_rotary`
- `pe_rotary_rerun` (Rotary 의 재실행 / 검증)
- `pe_txl` (Transformer-XL relative encoding) 추가 baseline
- Scratchpad 의 marker 별 ablation (Claim 4)

본문 미확보로 ablation 결과 단정 X. 그러나 코드에서 8 종 PE 가 모두 존재한다는 사실은 본 논문이 "5 종 main + 3 종 ablation" 수준의 깊이 있는 비교를 했음을 시사.

## 6. 부록에 숨은 신호

본 환경에서 부록 본문 미확보. README 의 "Important Note" 가 한 가지 신호:

> "Please note that these models significantly differ from the small model used to produce the main results reported in our paper, particularly in terms of size and training context size. As such, they are not directly suitable for evaluation on the datasets described in the paper."

→ **Main paper 의 small model 과 1B-scale 후속 모델의 결과가 직접 호환되지 않는다**. 즉 본 논문이 길이 일반화의 큰 규모로의 외삽 (1B 까지) 을 직접 보이지는 못했음을 저자 본인이 인정. 이는 §7 (한계) 에서 다룬다.

## 7. 수치 투명성

본 환경에서 확보 가능한 모든 verbatim 수치:

| 항목 | 값 | 출처 |
|---|---|---|
| max_steps | 40000 | jsonl |
| learning_rate | 3e-5 | jsonl |
| weight_decay | 0.05 | jsonl |
| batch_size | 64 | jsonl |
| Seeds | 256788, 234054, 146317 | run.sh.template |
| Eval max_length | 2048 | jsonl |
| Length bucket width | 100 | jsonl |
| Instances per bucket | 50 | jsonl |
| 1B 모델 d_model | 1024 | README |
| 1B 모델 d_kv | 128 | README |
| 1B 모델 d_ff | 16384 | README |
| 1B 모델 head 수 | 32 | README |
| 1B 모델 context | 1024 | README |
| 1B 모델 pretraining 데이터 | StarCoder 30B token | README |
| 1B 모델 token 비율 | Python 40% / Java 25% / JS 25% / Issues 5% / Commits 5% | README |

**본문 표의 절대 정확도 수치는 본 환경에서 본문 미확보**. 본 해체는 이 절대 수치를 단정하지 않는다.

## 핵심 한 문장 요약
"실험 protocol 의 강점은 변수의 통제 (동일 백본 / 동일 optimizer / 동일 데이터 / 3 seed), 약점은 합성 reasoning task 한정과 1B-scale 후속의 직접 호환 불가. 본 환경에서 본문 표 미확보로 절대 수치 보고 못 함."
