# 05 · 방법론 (a) — 비교 세팅

본 절은 5 종 PE + NoPE 가 동렬 비교되는 protocol 의 골격을 다룬다. **모든 hyperparameter 와 architecture 값은 저자 공식 GitHub 의 `results/runtime_efficiency.jsonl` (wandb run config) 과 `configs/*.jsonnet` 에서 verbatim 확인된 값** 이다.

## 배경 사다리
이 절을 이해하려면 ① T5 모델이 encoder-decoder 트랜스포머 아키텍처 (Raffel 2020) 라는 점, ② "decoder-only" 모드란 그 중 decoder 만 떼서 GPT 처럼 쓰는 변형이라는 점, ③ "wandb" 가 머신러닝 실험 추적 플랫폼이라는 점 세 가지만 알면 된다.

## 1. 백본 아키텍처 (verbatim 확인)

- **Base 모델**: HuggingFace 의 `t5-base` 를 **custom decoder-only 모드** 로 wrapping.
  - `cfg__model.type = "custom_decoder_only_t5"`
  - `cfg__model.config.type = "seq2seq_t5"`
  - `cfg__model.hf_model_name = "t5-base"`
  - `cfg__model.from_pretrained = false` → **사전학습 가중치 없이 처음부터** 학습 (small-scale main experiment 의 경우).
  - 코드 위치: `src/models/custom_t5_decoder_only.py`.
- **PE 분기**: 동일 백본의 `position_encoding_type` 필드 값만 갈아끼움. 가능한 값 (verbatim):
  - `none` (NoPE)
  - `abs_sinusoid` (APE sinusoidal)
  - `abs_learned` (APE learned, 추가 ablation)
  - `t5_relative_bias`
  - `alibi`
  - `alibi_learned` (ALiBi 의 기울기 $m_h$ 를 학습시키는 변형)
  - `rotary`
  - `new_rotary` (Rotary 의 미세 변형)
  - `transformer_xl_relative_encoding` (TXL, 추가 baseline)
  - `rotary_rerun` (Rotary 의 재실행 / 검증 변형)
- 모델 가중치 외의 다른 하이퍼파라미터는 모두 동일 (정확히 동일한 jsonnet config 합성으로 보장됨).

### 이 부분이 왜 필요한가
PE 비교의 신뢰성은 "PE 외 변수가 모두 동일해야" 보장된다. 실제 NLP 학계에서는 base 모델, 토크나이저, 데이터 분포, training step 수, optimizer 가 서로 다른 채로 PE 가 비교되는 경우가 흔하다. 본 논문의 protocol 은 jsonnet 의 모듈 합성으로 PE 만 다른 점을 보장한다. **이 protocol 자체가 본 논문의 메타-기여 중 하나**.

## 2. 학습 하이퍼파라미터 (verbatim 확인)

| 항목 | 값 | 출처 |
|---|---|---|
| `cfg__trainer.max_steps` | 40000 | runtime_efficiency.jsonl |
| `cfg__trainer.learning_rate` | 3e-05 | runtime_efficiency.jsonl |
| `cfg__trainer.weight_decay` | 0.05 | runtime_efficiency.jsonl |
| `cfg__trainer.warmup_ratio` | 0.06 | runtime_efficiency.jsonl |
| `cfg__trainer.lr_scheduler_type` | "polynomial" | runtime_efficiency.jsonl |
| `cfg__trainer.target_batch_size` | 64 | runtime_efficiency.jsonl |
| `cfg__trainer.target_eval_batch_size` | 32 | runtime_efficiency.jsonl |
| `cfg__trainer.eval_steps` | 2000 | runtime_efficiency.jsonl |
| `cfg__trainer.save_steps` | 2000 | runtime_efficiency.jsonl |
| `cfg__trainer.metric_for_best_model` | "seq_acc" | runtime_efficiency.jsonl |
| `cfg__trainer.predict_with_generate` | true | runtime_efficiency.jsonl |
| `cfg__trainer.generation_max_length` | 256 | runtime_efficiency.jsonl |
| `cfg__trainer.generation_num_beams` | 1 (greedy) | runtime_efficiency.jsonl |
| `cfg__trainer.auto_compute_batch_size` | true | runtime_efficiency.jsonl |
| **시드 (seed sweep)** | 256788 / 234054 / 146317 | `run.sh.template` SEEDS verbatim |

### 4 줄 해석 — `learning_rate = 3e-5` + `warmup_ratio = 0.06` + polynomial scheduler
- **기호 뜻**: lr 은 SGD/Adam 의 보폭, warmup 은 처음 6% step 동안 lr 을 0 → max 까지 선형 증가, polynomial 은 그 이후 lr 을 단계적으로 감소.
- **일상 비유**: 운전을 천천히 시동 (warmup), 본격 주행 (peak lr), 도착지 가까워지면 서서히 감속 (polynomial decay) 하는 패턴.
- **왜 이 형태**: t5-base 규모에서는 lr=3e-5 가 안정 수렴 범위. Warmup 이 부족하면 초기 gradient 폭주, 길면 학습이 늦어진다. 6% × 40000 = 2400 step 이 warmup 인데 이는 T5 paper 의 통상 범위.
- **조심할 점**: 본 lr 이 모든 PE 에 대해 "공정" 한지 의문. 예를 들어 ALiBi 는 PE 임베딩이 없어 파라미터가 약간 적으니 더 큰 lr 이 최적일 수 있다. 본 논문 protocol 은 모든 PE 에 동일 lr 을 쓰는데, 이는 **공정성 보장이지만 동시에 각 PE 의 잠재력 최대화는 아닐 수 있다**.

## 3. 데이터셋 처리 (verbatim 확인)

- **Decoder-only 처리 모드**:
  - `cfg__dataset.is_decoder_only = true`
  - `cfg__dataset.decoder_only_block_size = 128` (학습 시 시퀀스 묶음 단위)
  - `cfg__dataset.decoder_only_mask_inputs = true` (input 토큰에 loss 부과 안 함, 목표 출력에만 부과)
  - `cfg__dataset.decoder_only_padding_side = "right"`
- **시퀀스 최대 길이**:
  - 학습 시: `max_source_length = 256`, `max_target_length = 256`
  - 평가 시: `cfg__analyzers.0.max_length = 2048` (길이 외삽 평가 시 최대 2048 토큰)
  - `cfg__analyzers.0.length_bucket_width = 100` — 길이 100 단위 버킷으로 정확도를 분할 측정
  - `cfg__analyzers.0.num_try_per_length_bucket = 50` — 각 길이 버킷에서 50 instance 평가

### 4 줄 해석 — `decoder_only_block_size = 128`, evaluation `max_length = 2048`
- **기호 뜻**: 학습 컨텍스트는 128 토큰 단위로 묶음. 평가는 최대 2048 토큰까지 시도.
- **일상 비유**: 학습은 짧은 운동장 (128 m) 에서, 시험은 16 배 긴 거리 (2048 m) 에서 달리기.
- **왜 이 형태**: 128 / 2048 의 16 배 외삽 비율은 length generalization 의 표준 범위. 학습 컨텍스트가 너무 길면 PE 의 외삽 한계가 보이지 않고, 평가 컨텍스트가 너무 짧으면 외삽 실험 의의가 약해진다.
- **조심할 점**: 128 컨텍스트는 short reasoning task 에는 충분하지만, 자연어 LM 평가에는 매우 좁다. 본 논문 결과를 그대로 "LLM 의 PE 선택" 으로 외삽하기 어렵게 만드는 핵심 한계 — 이는 1B-scale 후속 모델 (context=1024) 이 별도로 분리되는 이유.

## 4. 데이터셋 (확인된 task 목록)

`results/runtime_efficiency.jsonl` 와 `configs/data/` 의 확인 가능한 task:
- **`s2s_addition`** (sequence-to-sequence 덧셈) — `len_tr8_ts16` 등 길이 split
- **`scan`** (SCAN 명령어 → 액션 데이터) — `mdlen_tr25_ts48` 등 split
- `cfg__dataset.instance_processor.type = "s2s_addition"` 로 verbatim 확인됨

(다른 task 들 — 다항식 계산 / parity / sort / lookup / 그리고 README 가 언급한 "battery of reasoning and mathematical tasks" — 의 정확한 목록은 본 환경에서 `configs/data/` 의 전체 디렉토리 listing 차단 (`api.github.com/repos/...` 403) 으로 미확보. 본 해체에서는 확인된 두 task 만 명시한다.)

## 5. 평가 protocol (verbatim 확인)

- **최적 모델 선택**: `metric_for_best_model = "seq_acc"` — sequence-level exact match 정확도.
- **생성 방식**: greedy (`generation_num_beams = 1`), 최대 256 토큰 생성.
- **길이 일반화 평가**: `length_bucket_width = 100` 단위로 길이 버킷을 만들고 각 버킷에서 50 instance 의 정확도를 측정. 학습 길이 너머 (300, 400, 500, ..., 2000 단위) 의 정확도 곡선이 그려질 것으로 추정 (본 환경에서 plot 본문 미확보).

### 이 부분이 왜 필요한가
PE 별 attention 의 외삽 동학을 보려면 "정확히 어느 길이부터 정확도가 떨어지는가" 의 곡선이 필요하다. 단일 평균 정확도로는 NoPE 의 우위가 길이별로 어떻게 분포되는지 (예: 짧은 길이에선 동등, 긴 길이에서 격차 벌어짐) 가 가려진다. Length bucket 별 측정은 이 곡선을 정확하게 그리기 위한 설계.

## 6. 추가 분석 도구 (코드 verbatim)

- **`src/analyzers/attention_kl_analyzer.py`** — PE 별 모델의 attention 분포를 NoPE reference 와 KL divergence 로 비교.
- **`scripts/experiment_uploaders/attention_kl_analysis.py`** — `cfg__model.position_encoding_type == "none"` 로 NoPE run 을 필터링해 reference 로 사용. Scratchpad config 별로도 분리 분석.
- **`scripts/experiment_uploaders/final_attention_kl_analysis.py`** — `job_type == "attn_analysis2"` 의 결과를 aggregate.
- **`notebooks/plot_attention_distance_final.ipynb`** — attention distance (head 별 query-key 거리 분포) 의 PE 별 시각화.
- **`notebooks/download_attention_similarity_data.ipynb`** — PE 간 attention 유사도 데이터 수집.

이 분석 도구들이 Claim 2 (NoPE 표현력) 와 Claim 3 (NoPE-T5 유사) 의 mechanistic 증거를 만든다. **APF 의 motif probe 와 직접 연관되는 부분** — 다음 절 (05_method_d) 에서 KL 분석을 별도로 다룬다.

## 핵심 한 문장 요약
"본 protocol 의 신뢰성은 jsonnet 모듈 합성으로 PE 외 변수를 0 으로 만든 것에서 온다 — 동일 백본, 동일 optimizer, 동일 데이터, 동일 평가 metric, 3 seed 평균. 그 위에 attention KL 분석을 얹어 mechanistic 증거를 만든다."
