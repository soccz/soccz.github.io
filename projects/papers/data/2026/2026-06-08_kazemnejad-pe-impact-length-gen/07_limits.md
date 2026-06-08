# 07 · 가정·한계·반박

## 명시된 가정 (저자가 README 와 abstract 에서 인정한 부분)

### G1. 평가 scope 가 reasoning / mathematical tasks 에 한정
Abstract verbatim: _"Our evaluation encompasses a battery of reasoning and mathematical tasks."_
→ **자연어 LM perplexity 가 아닌 합성 reasoning 평가**. 본 논문의 NoPE 우위 결론은 자연어 분포의 LM 평가로 자동 확장되지 않는다.

### G2. 1B-scale 후속 모델과 main paper 모델의 직접 호환 불가
README 의 "Important Note" verbatim: _"these models significantly differ from the small model used to produce the main results reported in our paper, particularly in terms of size and training context size. As such, they are not directly suitable for evaluation on the datasets described in the paper."_
→ **저자 본인이 main paper 의 결론이 1B-scale 까지 그대로 외삽되지 않음을 인정**. 1B CodeLLM 은 별도 contribution 으로 분리됨.

### G3. NoPE 의 SGD 학습 결과는 T5-relative attention 형식으로 수렴
Abstract verbatim: _"...when trained with SGD, it mostly resembles T5's relative PE attention patterns."_
→ NoPE 가 절대 PE 형식으로 학습 가능함은 이론 (representation) 의 가능성일 뿐, SGD trajectory 가 가는 곳은 한 가지 form.

### G4. Scratchpad 의 양면성을 인정
Abstract verbatim: _"...scratchpad is not always helpful to solve length generalization and its format highly impacts the model's performance."_
→ Chain-of-thought 만능론을 부정. 그러나 어떤 조건에서 도움되는지의 양적 경계는 본문 미확보.

## 암묵적 가정 (말 안 했지만 깔려 있는 것 — 최소 5 개)

### A1. Causal mask 와 BOS 토큰의 일관 처리
NoPE 의 위치 신호는 (a) causal mask 의 비대칭과 (b) `<bos>` 의 anchor 에 의존. README 의 1B 모델 사용 예시에서 BOS 가 명시적으로 prepend 되는 것은 이 의존성을 시사. 만약 inference 시 BOS 가 누락되거나 batch 내 패딩으로 인해 BOS 위치가 흔들리면 NoPE 의 implicit 위치 신호가 손상될 가능성. 본 논문이 이 의존성을 보고했는지 본문 미확인.

### A2. Tokenizer 가 위치 정보의 leak 을 주지 않는다
`t5-base` tokenizer 는 SentencePiece 기반으로 토큰 자체에 위치 의미가 없다. 그러나 만약 어떤 토크나이저 (예: BPE 의 word-initial marker `▁`) 가 토큰의 "위치적 역할" 을 sub-token level 에서 인코딩한다면 NoPE 가 그 신호로 위치를 복원할 가능성. T5-base tokenizer 의 이 특성은 검토 안 됨.

### A3. 시드 3 개의 분산이 결론을 흔들지 않는다
3 seed 평균이 PE 간 차이의 신호로 충분히 크다는 가정. 만약 분산이 차이만큼 크면 통계적 유의성이 의심됨. 분산 / 신뢰 구간 형식의 보고 여부 본문 미확인.

### A4. 학습 컨텍스트 128 토큰의 PE 패턴이 외삽 컨텍스트 2048 토큰에 일반화
학습 컨텍스트 = 128, 평가 컨텍스트 = 2048 (16 배). PE 별 attention 의 외삽이 단조 감소만 한다는 가정. 만약 attention 의 외삽이 비단조 (예: 128~512 에서는 정확, 그 너머 갑자기 깨짐) 라면 평균 정확도가 misleading. Length bucket 별 곡선이 이를 드러낼 것이나 본문 미확인.

### A5. Decoder-only causal 구조의 보편성
본 논문의 NoPE 우위 주장은 decoder-only 에 한정. README 도 "decoder-only Transformers" 를 명시. 그러나 실용 LLM 의 거의 모두가 decoder-only 이므로 이 한정은 실용적 한계라기보단 학문적 정확성에 가깝다. 단 encoder / encoder-decoder 모델에 대한 NoPE 의 implication 은 없다는 점 — TS 분야의 일부 모델 (PatchTST 의 encoder 분기, MOIRAI 의 mask reconstruction) 에는 직접 적용 안 됨.

## 반박 가능한 지점 (최소 3 개)

### R1. "T5-relative 와 닮음" 의 인과 vs 상관 모호성
**주장**: Abstract 가 "NoPE attention 이 T5-rel 과 가장 닮음" 을 보고하지만, "닮음" 이 인과 관계인지 단순 상관인지 불명.

가능성 1: NoPE 가 SGD 하에서 T5-rel 비슷한 솔루션을 선호한다 (저자 framing).
가능성 2: 둘 다 "거리 기반 inductive bias" 라는 broader equivalence class 에 속하고, 그 class 안의 다른 representations 도 동등하게 닮을 가능성. 닮음의 1 위가 T5-rel 인 것은 측정 metric (KL) 의 우연.

**어떻게 검증할 수 있는가**: 
- 같은 KL 측정을 인공적인 "거리 기반" PE 변형들 (예: log-distance bias, quadratic bias) 에 대해서도 적용. NoPE 가 그것들과도 비슷하게 닮으면 "거리 기반 bias class 와 닮음" 으로 결론을 약화해야 함.
- Causal intervention: NoPE 모델의 attention 을 T5-rel attention pattern 으로 강제 swap. 출력 변화 없으면 닮음이 결정적, 출력 변화 크면 닮음은 superficial.

### R2. 합성 reasoning task 의 외삽 결론을 자연어로 일반화 불가
**주장**: NoPE 의 우위가 SCAN / s2s_addition 같은 합성 task 에 한정될 가능성. 자연어 LM 에서는 PE 가 학습된 의미 표현에 들어가는 inductive bias 가 다를 수 있음.

**증거**: 1B-scale 후속 모델 (StarCoder 30B token, 코드 LM) 이 별도 contribution 으로 분리된 점 자체가 "자연어/코드 LM 에서는 main paper 의 결론을 그대로 못 한다" 의 시사. README 의 Important Note 도 이를 인정.

**어떻게 검증할 수 있는가**:
- 자연어 LM perplexity 평가 (예: WikiText-103, PG-19, C4) 에서 NoPE 가 명시 PE 와 어떻게 비교되는지. ALiBi paper (Press 2022) 는 WikiText 에서 sinusoidal 과 비교했으니, 그 setup 의 NoPE 변형이 검증 가능.
- 길이 일반화의 정의 자체가 자연어에서 reasoning task 와 다른 의미일 수 있음 — 자연어에서 "긴 문맥 활용" 은 정답 토큰의 long-distance dependency, reasoning 에서는 단계별 계산의 chain. 두 종류의 length 가 PE 에 같은 영향을 주는지 검증 필요.

### R3. ALiBi / Rotary 가 "not well suited" 라는 결론의 task 의존성
**주장**: Abstract 의 "ALiBi, Rotary, and APE are not well suited for length generalization in downstream tasks" 가 본 논문의 task suite (reasoning 중심) 에서만 성립할 가능성. ALiBi / Rotary 가 자연어 LM (Press 2022 의 setup) 에서는 외삽 잘 함이 알려져 있음.

**증거**: ALiBi 원 논문은 WikiText-103 에서 256 학습 → 1024 평가의 외삽이 잘 됨을 보임. 본 논문 결론은 그것과 정면으로 충돌하는 게 아니라 "외삽 가능 여부" 와 "다른 PE 와 비교 시 우위" 는 다른 질문이라는 점을 정리. 본 환경에서 ALiBi 본문 미확보로 그 비교의 정량적 격차 단정 불가.

**어떻게 검증할 수 있는가**:
- ALiBi paper 와 본 논문의 평가 setup 의 task 분포를 매트릭스로 정리. 자연어 LM vs reasoning task 에서 PE 의 ranking 이 task-dependent 임을 명시.
- 본 논문의 task suite 를 ALiBi paper 의 setup 에 추가해 evaluation 의 합집합에서 동일 결론이 나오는지 검증.

## 재현성 평가

### 강점
- **코드 공개**: ✓ (`github.com/McGill-NLP/length-generalization`)
- **Pretrained model 공개**: ✓ (HuggingFace `McGill-NLP/codellm_1b_{nope,rotary,alibi}`)
- **WandB run config 공개**: ✓ (`results/runtime_efficiency.jsonl`)
- **Seed 명시**: ✓ (256788, 234054, 146317)
- **Hyperparameter 완전 명시**: ✓ (jsonl 에서 verbatim)
- **Singularity container 제공**: ✓ (`library://kzmnjd/deeplr/pt:v7`)

### 약점
- **분산 / 신뢰 구간 보고 형식 본문 미확인**. 3 seed 의 mean ± std 형식인지, 단순 best run 인지 확인 필요.
- **계산 비용** — `runtime_efficiency.jsonl` 의 `sum___wandb#runtime` 필드에서 PE 별 학습 시간 차이:
  - `pe_alibi`: 55924 sec
  - `pe_none`: 60743 sec (NoPE 가 약간 더 오래)
  - `pe_abs_sin`: 17117 sec (가장 짧음?)
  - `pe_t5`: 79207 sec (가장 김)
  - `pe_newRot`: 41766 sec
  
  위 수치는 `efficiency_measure` 라는 별도 분석 (s2s_addition + len_tr8_ts16) 의 runtime 이므로 main result 의 학습 시간은 아니다. 그러나 PE 별 계산 비용 차이가 크다는 점은 주목할 만하다 — abstract 의 "NoPE...requires no additional computation" 주장은 이 runtime 수치만으로는 검증 안 됨 (NoPE 가 abs_sin 보다 약 3.5 배 더 김).

- **본문 결과 표 / 그림 본 환경 미확보** → 본 해체에서 절대 정확도 수치를 단정하지 못 함. 이는 본 환경의 한계이지 논문 자체의 한계가 아니다.

## 종합

본 논문의 핵심 약점은 **scope 한정** (decoder-only + reasoning task) 과 **mechanistic 깊이의 부족** (KL 측정은 있으나 인과 검증 부족). 강점은 **PE 비교 protocol 의 정확성** 과 **NoPE 라는 강력한 baseline 의 정립**. 

APF / Grokking 의 관점에서 본 논문의 가치는 (1) NoPE 가 강력한 baseline 임을 인정해야 한다는 강제, (2) attention KL 분석을 motif probe 와 비교할 수 있는 measurement framework, (3) scratchpad / format sensitivity 가 attention 패턴의 측정 변수임을 인정. 본문 자세한 절대 수치를 본 환경에서 확인하지 못하지만, 이 framework-level 의 contribution 은 의심의 여지가 없다.
