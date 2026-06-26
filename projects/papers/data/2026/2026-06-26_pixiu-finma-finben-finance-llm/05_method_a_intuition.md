# 05a. 방법론 — 큰 그림 (4-요소 패키지)

> 배경 사다리: 이 절은 ① LLM 이 사전학습 → instruction tuning → 평가의 3단 파이프라인을 거친다는 것, ② "벤치마크" 는 데이터셋 모음 + 평가 코드 + 메트릭 표준의 묶음이라는 것 정도만 알면 따라온다.

## PIXIU 의 4-요소 — 한눈에 보는 다이어그램 (텍스트 도식)

```
                            ┌──────────────────────────────────┐
                            │   LLaMA-7B (base)                │
                            │   LLaMA-30B (base)               │
                            └───────────┬──────────────────────┘
                                        │
                                        │  ②  Instruction tuning
                                        │      (next-token loss, FIT)
                                        ▼
            ┌─────────────────────────────────────────────────────┐
            │  ①  FIT — Financial Instruction Dataset (136K)      │
            │  ──────────────────────────────────────────────     │
            │   • FPB sentiment       4,845 → 48,450 (×10)        │
            │   • FiQA-SA sentiment   1,173 → 11,730 (×10)        │
            │   • Headline classify  11,412 → 11,412 (×1)         │
            │   • NER                 1,366 → 13,660 (×10)        │
            │   • FinQA QA            8,281 →  8,281 (×1)         │
            │   • ConvFinQA QA        3,892 →  3,892 (×1)         │
            │   • BigData22 stock     7,164 →  7,164 (×1)         │
            │   • ACL18 stock        27,053 → 27,053 (×1)         │
            │   • CIKM18 stock        4,967 →  4,967 (×1)         │
            └───────────────────────────┬─────────────────────────┘
                                        ▼
                            ┌──────────────────────────────────┐
                            │   FinMA-7B (NLP)                 │
                            │   FinMA-7B-full (NLP+prediction) │
                            │   FinMA-30B (NLP)                │
                            └───────────┬──────────────────────┘
                                        │
                                        │  ③  Evaluation
                                        ▼
            ┌─────────────────────────────────────────────────────┐
            │  ④  FLARE / FinBen — 평가 벤치마크 (8 task / 15 ds) │
            │  ──────────────────────────────────────────────     │
            │   ChatGPT, GPT-4, BloombergGPT 비교                 │
            │   eval.py (lm-evaluation-harness 호환)              │
            │   9-종 metric (Acc, F1, MCC, Rouge, EmACC, ...)     │
            └─────────────────────────────────────────────────────┘
```

각 요소를 짧게 풀어보자.

### ① FIT (Financial Instruction Dataset)

**왜 필요한가**. 일반 LLM (LLaMA) 은 "이건 어닝 콜이고 hawkish 분류해라" 같은 도메인 지시문에 익숙하지 않다. 그렇다고 처음부터 사전학습을 다시 할 (50B token 짜리) 자원은 학계에 없다. **타협점이 instruction tuning** — 사전학습은 그대로 두고, 도메인 지시문 ~10만 개 정도로 추가 학습. Alpaca (Taori 2023) 가 일반 도메인에서 52K 로 충분함을 보임. 도메인 특화에서는 더 많은 (136K) 인스트럭션이 안전.

**FIT 의 핵심 설계 선택**:
- 9 데이터셋으로 한정 (벤치마크에 들어가는 15 데이터셋의 부분집합). 평가 시 unseen 카테고리를 일부 남겨두기 위한 분리.
- Multiplier — FPB/FiQA-SA/NER 만 ×10 으로 prompt 변형 augmentation. 나머지는 ×1.
- 4-NLP-task + 1-prediction-task 의 5-카테고리 구조. README "FIT — Modality and Prompts" 표 verbatim.

### ② Instruction tuning (LLaMA → FinMA)

**왜 필요한가**. Base LLaMA 는 "다음 단어 맞히기" 사전학습만 됐을 뿐. "이 sentiment 를 negative/positive/neutral 셋 중 골라" 같은 분류용 답변 형식을 학습한 바 없다. Instruction tuning 은 이 답변 형식 정합성과 도메인 어휘를 동시에 가르치는 절차.

**핵심 손실**:

$$\mathcal{L}_{\text{IT}}(\theta) = -\frac{1}{|\mathcal{D}_{\text{FIT}}|}\sum_{(x,y) \in \mathcal{D}_{\text{FIT}}} \frac{1}{|y|}\sum_{t=1}^{|y|} \log p_\theta(y_t \mid x, y_{<t})$$

- **기호 뜻**: $\theta$ = LLaMA 7B 또는 30B 의 파라미터 (각각 7×10⁹, 3×10¹⁰ 개의 float32 또는 bfloat16 가중치). $\mathcal{D}_{\text{FIT}}$ = 136K 인스트럭션 짝의 집합. $x$ = 지시 입력 (예: "Analyze the sentiment of this statement: 'The company's stocks plummeted ...'"). $y$ = 정답 출력 (예: "negative"). $|y|$ = $y$ 의 토큰 길이.
- **일상 비유**: 만능 비서 (LLaMA) 에게 워크북 (FIT) 의 문제 ($x$) 를 보여주고, 정답 ($y$) 의 첫 글자, 두 글자, ... 를 차례로 채워넣게 한 다음, 못 채운 만큼 혼낸다. 평균 (1/|y|) 을 취해서 답이 짧은 문제 ("Rise") 와 긴 문제 (요약문) 의 학습 신호가 비슷한 크기가 되게 함.
- **왜 이 형태**: 모든 태스크를 텍스트→텍스트 형식으로 통일하려면 단일 next-token loss 가 가장 자연스럽다. 분류 head/회귀 head 따로 만들지 않아 도메인 추가 시 confining 안 됨. FLAN (Wei 2022) 의 표준 recipe.
- **조심할 점**: $\mathcal{D}_{\text{FIT}}$ 안에서 FPB 가 35% (48,450/137,609) 차지. **카테고리 불균형**. 특정 태스크가 catastrophic forgetting 으로 묻힐 위험. 본 README 에서는 명시 정당화 없음 — 본문 PDF 의 §FIT detail 또는 §experiment 의 ablation 에 있을 가능성 높음.

### ③ FinMA 변형 3개의 분리

**왜 3개인가**. (a) **FinMA-7B (NLP only)** = 4-NLP-task instruction 만으로 학습. NLP 측 baseline. (b) **FinMA-7B-full (NLP + prediction)** = 9-dataset 전체로 학습. 멀티모달 영역까지 커버. (c) **FinMA-30B (NLP only)** = 스케일 효과 검증용. NLP 만 학습한 큰 모델.

3-변형의 구조는 **ablation 자체** — "도메인 NLP fine-tuning 의 효과 vs prediction task 추가의 효과 vs 모델 크기 효과" 의 3축을 따로 분리해 측정할 수 있게 디자인. 본 README 절 "FinMA v0.1" verbatim: "FinMA-7B and FinMA-30B are trained with the NLP instruction data, while FinMA-7B-full is trained with the full instruction data from FIT covering both NLP and prediction tasks."

### ④ FLARE / FinBen 평가

**왜 필요한가**. ① ~ ③ 만으로는 "이 모델이 좋다" 를 증명할 수 없다. 같은 시험지 (FLARE) 위에서 ChatGPT, GPT-4, BloombergGPT, 그리고 FinMA 자신을 동시에 채점해야 비교 가능.

**FLARE 의 핵심 디자인**:
- 8 task × 15 dataset (PIXIU 원판). 후속 FinBen 으로 30+ dataset 확장.
- 9-종 metric (Acc / F1-weighted, macro / Missing Ratio / MCC / seqeval F1 / Label F1 / Precision / Recall / Rouge-N, Rouge-L / EmACC). Task 카테고리에 따라 적절한 metric 자동 적용.
- EleutherAI `lm-evaluation-harness` 호환 — `eval.py` 한 줄 명령으로 zero-shot/few-shot 평가 자동화.
- BARTScore 체크포인트 외부 의존 — 요약 태스크의 의미적 평가용. README 의 Google Drive 링크로 별도 다운로드.
- 상용 API (OpenAI, Anthropic) 와 self-hosted 모델 모두 평가 가능 (README 의 3-mode: HuggingFace transformer / commercial API / self-hosted inference backend).

## 4-요소의 핵심 한 문장 요약

PIXIU 는 **새 알고리즘 0개**. 4-요소 (인스트럭션 데이터 큐레이션 + LLaMA fine-tuning + 평가 벤치마크 + 평가 harness) 의 **인프라 패키지** 를 동시 공개해, 금융 LLM 의 비교 가능성을 처음으로 마련했다. 본 패키지의 가치가 알고리즘이 아닌 **사회적 채택** 으로 검증된다 — NeurIPS 2024 FinBen, IJCAI 2024 FinLLM Challenge, HuggingFace Open Financial LLM Leaderboard 가 모두 이 위에 구축됐다.

다음 절 (05b ~ 05d) 에서 4-요소를 하나씩 더 깊게.
