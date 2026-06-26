# 05c. 방법론 — FinMA 학습 (LLaMA → FinMA instruction tuning)

> 배경 사다리: 이 절은 ① LLaMA 가 Meta 가 2023년 2월 공개한 7B/13B/33B/65B 4-크기 decoder-only Transformer 라는 점, ② instruction tuning 은 base LLM 의 모든 파라미터를 다시 업데이트 (full fine-tuning) 하거나, LoRA 등 PEFT 로 일부만 업데이트하는 방식이 있다는 점, ③ 7B 모델의 full fine-tuning 은 1-2장 A100 (80GB) 으로 가능하지만 30B 는 16+장 필요한 규모 차이가 있다는 점을 알면 따라온다.

## 1. FinMA 의 3-변형 분리 — 왜 이 구조인가

README "FinMA v0.1" 절 verbatim:

> "We are pleased to introduce the first version of FinMA, including three models FinMA-7B, FinMA-7B-full, FinMA-30B, fine-tuned on LLaMA 7B and LLaMA-30B. FinMA-7B and FinMA-30B are trained with the NLP instruction data, while FinMA-7B-full is trained with the full instruction data from FIT covering both NLP and prediction tasks."

3-변형의 분리는 본질적으로 **3-축 ablation 의 사전 디자인**:

| 변형 | base | 학습 데이터 | 분석 가능한 효과 |
|---|---|---|---|
| **FinMA-7B** | LLaMA-7B | FIT (NLP only, ~99K 인스트럭션) | NLP fine-tune 의 baseline 효과 |
| **FinMA-7B-full** | LLaMA-7B | FIT 전체 (~137K 인스트럭션) | + prediction task 의 marginal 효과 |
| **FinMA-30B** | LLaMA-30B | FIT (NLP only, ~99K 인스트럭션) | + 모델 크기 (7B→30B) 효과 |

### 3-축 ablation 의 가능한 추론

(A) FinMA-7B vs LLaMA-7B base → **NLP fine-tuning 의 효과**.
(B) FinMA-7B-full vs FinMA-7B → **prediction task 추가의 효과**. 만약 NLP 점수는 비슷 + stock prediction 만 향상 → "prediction 추가는 NLP 에 손해 없이 prediction 성능만 늘림" 의 좋은 결과. 만약 NLP 점수도 떨어졌으면 → "catastrophic forgetting" 의 증거.
(C) FinMA-30B vs FinMA-7B → **모델 크기 효과**. 만약 30B 가 7B 보다 도메인 NLP 에서 큰 향상 없으면 → "도메인 fine-tuning 에서는 7B 도 충분" 의 가성비 의미.

본 환경에서 정확한 수치는 단정 못 하지만, 후속 README 에서 7B-NLP / 7B-full 만 HuggingFace 에 공개되고 (`TheFinAI/finma-7b-nlp`, `TheFinAI/finma-7b-full`) 30B 는 공개 모델 페이지 없음 — 이게 사후 시그널. 30B 학습은 했으나 효용/용량 trade-off 로 공개에 우선순위 낮음.

## 2. Instruction tuning 의 손실 함수 — 자세한 해부

표준 next-token autoregressive loss:

$$\mathcal{L}_{\text{IT}}(\theta) = -\sum_{(x,y) \in \mathcal{D}_{\text{FIT}}} \sum_{t=1}^{|y|} w(t) \cdot \log p_\theta(y_t \mid x, y_{<t})$$

**$w(t)$ 의 두 옵션**:

(α) $w(t) = 1$ (token-uniform). 모든 정답 토큰에 동일 가중치. 긴 응답이 짧은 응답보다 학습 신호가 큼 (단순 합).

(β) $w(t) = 1/|y|$ (sample-uniform). 응답 길이에 정규화. 짧은 응답 ("Rise") 과 긴 응답 (요약문) 의 sample-level 학습 신호가 동등.

README 와 본 환경에서 PIXIU 가 어느 옵션을 썼는지 단정 불가. **추정**: Alpaca / Stanford 코드베이스에서 파생됐을 가능성이 높고, 그쪽이 token-uniform 이라 (α) 일 가능성 큼. 그렇다면 ACL18 (27K) + FPB×10 (48K) 의 두 데이터셋이 학습 신호의 대부분을 차지하게 됨.

- **기호 뜻**: $\theta$ = 학습 가능 파라미터 전체. $x$ = (system prompt + user instruction + input text) 의 토큰 시퀀스. $y$ = 정답 응답의 토큰 시퀀스. $p_\theta$ = causal LM 의 next-token 확률.
- **일상 비유**: 답안지의 각 글자를 학생이 차례로 쓰게 하고, 못 쓴 글자마다 점수를 깎는다. (α) 면 답안지가 긴 학생이 더 많이 혼남, (β) 면 답안지 짧건 길건 학생당 평균적으로 비슷하게 혼남.
- **왜 이 형태**: 분류·NER·QA·요약·예측을 모두 next-token 형식으로 통일하기 위한 가장 단순한 loss. T5 의 unified text-to-text 정신.
- **조심할 점**: Loss 의 token 평균/sample 평균 선택이 카테고리 imbalance 와 어떻게 상호작용하는지 명시 없음. ACL18 (sample 27K, 응답 1 토큰 "Rise"/"Fall") 와 ECTSUM (sample 0.5K, 응답 200+ 토큰 summary) 사이에서 어느 학습 신호가 dominant 한지가 (α)/(β) 선택에 따라 매우 달라짐.

## 3. LoRA vs Full fine-tuning — 알 수 없는 디테일

본 README 에서는 **fine-tuning 방식 (Full / LoRA / Adapter)** 명시 없음. HuggingFace `TheFinAI/finma-7b-nlp` 페이지의 실제 가중치 파일 크기로 추정 가능:
- Full fine-tuning 이면 ~13GB (7B × 2 bytes/parameter for bf16)
- LoRA 면 ~수십~수백 MB (rank-r dimension 따라)

본 환경에서 HuggingFace 페이지 접근 불가로 단정 불가. 추정: 7B-full 변형의 존재 자체가 (NLP only vs full instruction 의 분리) **full fine-tuning** 을 시사 — LoRA 면 같은 base 위에 두 LoRA adapter 를 분리해 공개하는 게 더 자연스러움.

PDF 본문 §FinMA training 절에서 확정 가능. 본 작성에서는 "**Full fine-tuning 가능성이 높으나 단정 안 함**" 으로 기록.

## 4. Hyperparameter — README 에서 단정 가능한 것 / 불가능한 것

**README 본문에서 명시 부재**한 hyperparameter:
- learning rate
- batch size
- epoch 수
- warmup ratio
- optimizer 종류 (AdamW 추정)
- weight decay
- gradient accumulation steps
- precision (bf16 / fp16 / fp32)
- DeepSpeed/FSDP 사용 여부

**LLaMA-7B / LLaMA-30B 의 표준 fine-tuning recipe** (Alpaca 등) 에서 통용되는 값을 일반화 하면 (단 본 PIXIU 에 그대로 적용된다는 보장 없음):
- lr = 2e-5 ~ 5e-5
- batch size (effective) = 128 ~ 256
- epoch = 3 ~ 5
- AdamW, weight_decay = 0
- bf16 precision
- gradient_accumulation_steps = 16 ~ 32 (single A100 에서)

**본 작성에서는 추정값을 단정하지 않는다**. PDF 본문 §FinMA training 또는 Appendix 의 training details 에 정확한 값. 본 환경에서 차단.

## 5. 학습 데이터 형식의 표준화

README "Generating Datasets for FIT" 절 verbatim JSON 포맷:

```json
{
    "id": "unique id",
    "conversations": [
        {"from": "human", "value": "Your prompt and text"},
        {"from": "agent", "value": "Your answer"}
    ],
    "text": "Text to be classified",
    "label": "Your label"
}
```

이 ShareGPT-style 의 `conversations` 배열은 **Vicuna / FastChat** 의 표준 포맷과 동일. FastChat 코드베이스로 fine-tuning 됐을 가능성을 시사 — Stanford Alpaca 의 직접 후속.

`text` 와 `label` 필드는 evaluation 측에서 사용 — 분류 라벨 매칭, NER entity 비교, summarization reference 비교 등에. 학습 시에는 `conversations` 만 사용.

## 6. FinMA 가 LLaMA 외 base 를 안 쓴 이유

본 PIXIU 시점 (2023년 6-9월) 의 공개 7B-30B base LLM 선택지:
- LLaMA (Meta, 2023-02) — 학술 비상업적 라이선스
- LLaMA 2 (Meta, 2023-07) — 학술+상업 라이선스
- MPT / Falcon / Pythia / OPT — 다른 옵션들

README "FinMA v0.1" 절은 **LLaMA** (LLaMA 1) 만 명시. LLaMA 2 출시 (2023-07) 이전 또는 이후 빠른 시점이라 v0.1 은 LLaMA 1. 후속 작업 (FinBen NeurIPS 2024) 에서 LLaMA 2 / 다른 base 로 확장 가능성 있음.

**LLaMA 선택의 정당성**: (a) Alpaca 의 instruction tuning recipe 이미 검증됨. (b) 학술 라이선스로 재배포 허용. (c) 7B/30B 2-크기 분리 가능 (LLaMA 2 는 7B/13B/70B 로 30B 미존재 — 이게 LLaMA 1 선택의 직접 이유로 추정).

## 7. 핵심 한 문장

FinMA 의 학습은 **LLaMA-7B/30B + 136K FIT + token-uniform (추정) next-token loss + FastChat 호환 conversations JSON** 의 4-component 의 표준 instruction-tuning 파이프라인. **새로운 학습 알고리즘은 없음**. Contribution 의 본질은 데이터 큐레이션 (05b) 과 평가 인프라 (05d) 에 있으며, 학습 자체는 검증된 recipe 의 충실한 적용. 본 환경 PDF 차단으로 hyperparameter 단정 불가 — 본 작성 사용 시 "원문 본문 §FinMA training 절 또는 Appendix 의 training details 에 확정 hyperparam 명시 추정" 으로 표기.
