# 05d. 방법론 — FLARE / FinBen 평가 프로토콜과 9-종 메트릭

> 배경 사다리: 이 절은 ① "벤치마크 (benchmark)" 는 데이터셋 모음 + 평가 코드 + 평가 메트릭의 묶음이라는 것, ② EleutherAI 의 `lm-evaluation-harness` 가 LLM zero/few-shot 평가의 사실상 표준 frameworks 이라는 것, ③ token-level F1 vs entity-level F1 vs Exact Match Accuracy 의 미세한 차이가 NER/QA/요약 같은 자유 형식 출력에서 model 점수를 크게 바꾼다는 것 정도만 알면 따라온다.

## 1. FLARE (Financial Language Understanding and Prediction Evaluation) — 8 task / 15 dataset

PIXIU 원판의 FLARE 는 8 task × 15 dataset. 후속 FinBen 2.0 에서 30+ dataset 으로 확장 (README "FinBen 2.0 — Tasks" 표). 원 PIXIU 의 15-dataset 골격은 README 표의 상위 15행이며, 이것이 NeurIPS 2023 D&B 발표 시점의 FLARE 구성이라 추정:

| Task 카테고리 | 데이터셋 | Raw size | 데이터 타입 |
|---|---|---|---|
| Sentiment analysis (1) | FPB | 4,845 | news |
| Sentiment analysis (2) | FiQA-SA | 1,173 | news headlines, tweets |
| Sentiment analysis (3) | TSA (SemEval-2017 Task5) | 561 | news headlines |
| Hawkish-dovish classification | FOMC | 496 | FOMC transcripts |
| News headline classification | Headlines | 11,412 | news headlines |
| Argument unit classification | FinArg-ECC-Task1 | 969 | earnings calls |
| Argument relation classification | FinArg-ECC-Task2 | 690 | earnings calls |
| Multi-class classification | Multifin EN | 546 | article headlines |
| Deal completeness classification | M&A | 500 | news, tweets |
| ESG Issue Identification | MLESG EN | 300 | news articles |
| Named entity recognition | NER | 1,366 | financial agreements |
| Question answering | FinQA | 8,281 | earnings reports + table |
| Question answering | TatQA | 1,670 | reports + table |
| Text summarization | ECTSUM | 495 | earnings calls |
| Stock movement prediction | BigData22 | 7,164 | tweets + price |
| Stock movement prediction | ACL18 | 27,053 | tweets + price |
| Stock movement prediction | CIKM18 | 4,967 | tweets + price |

(위 표는 README "FinBen 2.0 — Tasks" 표의 일부. 본 PIXIU 원판 15-dataset 의 정확한 구성은 PDF 본문 §FLARE 의 표에서 확정 가능 — 본 환경 차단으로 README 의 superset 에서 8-task 카테고리 매핑으로 재구성.)

### 8 카테고리의 카테고리 인덱싱

README "Key Features — Multi-task" 절 verbatim: "The instruction tuning data and benchmark in PIXIU cover a diverse set of financial tasks, including four financial NLP tasks and one financial prediction task." → FIT 학습에는 5-카테고리지만, **FLARE 평가에서는 8 카테고리** 로 확장:

1. Sentiment analysis (FPB / FiQA-SA / TSA)
2. Classification (Headlines / FinArg-ECC / Multifin / M&A / MLESG / FOMC) — 평가 전용 (FIT 에 없음)
3. Named entity recognition (NER / Finer Ord) — 평가 전용 Finer Ord 추가
4. Relation extraction (FinRED / FinCausal) — 평가 전용 (FIT 에 없음)
5. Question answering (FinQA / TatQA / FNXL / FSRL) — 평가 전용 TatQA 등 추가
6. Text summarization (ECTSUM / EDTSUM) — 평가 전용 (FIT 에 없음)
7. Credit scoring (German / Australian / Lending Club 등 7개) — 평가 전용 (FIT 에 없음, FinBen 2.0 확장)
8. Stock movement prediction (BigData22 / ACL18 / CIKM18)

**핵심 디자인**: FIT 학습에 포함되지 않은 카테고리 (classification, relation extraction, summarization, credit scoring) 가 **out-of-distribution 평가** 의 핵심. 학습한 5-카테고리 능력이 미학습 3-카테고리로 zero-shot transfer 되는가 — 이게 instruction-tuning 효과의 진짜 측정.

## 2. 9-종 메트릭 표 — README "Predefined task metrics" verbatim

| 태스크 카테고리 | 메트릭 | 정의 |
|---|---|---|
| Classification | Accuracy | (TP + TN) / Total Observations. 정답 비율. |
| Classification | F1 Score (weighted + macro) | precision·recall 의 조화평균. macro = 클래스 단순평균 (imbalance 무관), weighted = 클래스 크기 가중. |
| Classification | Missing Ratio | 모델이 옵션 중 하나도 출력하지 않은 응답의 비율. **LLM-specific metric** — 자유 형식 출력에서 라벨 외 응답 측정용. |
| Classification | Matthews Correlation Coefficient (MCC) | $\text{MCC} = \frac{TP \cdot TN - FP \cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$. −1~+1. class imbalance 에 강건. |
| Sequential Labeling | seqeval F1 (entity-level) | NER entity 의 span+type 둘 다 정확히 매칭해야 TP. |
| Sequential Labeling | Label F1 | label 만 정확하면 TP (span 무시). |
| Relation Extraction | Precision / Recall / F1 | 표준 정의. |
| Summarization | Rouge-N (N=1, 2) | N-gram overlap 비율. |
| Summarization | Rouge-L | Longest Common Subsequence 기반. |
| QA | EmACC (Exact Match Accuracy) | reference 와 word-for-word 정확 일치. |

### 메트릭 디자인의 핵심 결정

**(i) Missing Ratio 의 도입**. 일반 NLP 벤치마크 (GLUE) 에는 없는 LLM-specific metric. LLM 의 free-form 출력에서 "옵션을 안 골랐다" 의 비율 자체를 측정. ChatGPT/GPT-4 가 zero-shot 에서 "I cannot determine..." 류 응답을 자주 출력하는 현상을 정량화하기 위한 metric. **이게 PIXIU 의 작지만 중요한 contribution**.

**(ii) MCC 의 활용**. Stock movement prediction 의 Rise/Fall 이진 분류에서, class imbalance (Bull market 구간에서 Rise dominant) 대응을 위한 robust metric. Accuracy 만 보면 "전부 Rise 출력" baseline 이 60-70% 나오는 함정 회피.

**(iii) EmACC 의 엄격함**. QA 에서 word-for-word 매칭. ChatGPT 의 "$2.5 million" 응답이 reference 의 "2,500,000" 과 다른 표현이면 fail. **이게 LLM 평가의 unfair penalty 가능성**. soft-matching metric (BERTScore, BARTScore — README 에서 BARTScore checkpoint 별도 제공) 으로 보완.

## 3. 평가 실행 — `eval.py` 의 3-mode

README "Automated Task Assessment" 절 verbatim 3-mode:

### Mode 1: HuggingFace Transformer

```bash
python eval.py \
    --model "hf-causal-llama" \
    --model_args "use_accelerate=True,pretrained=TheFinAI/finma-7b-full,tokenizer=TheFinAI/finma-7b-full,use_fast=False" \
    --tasks "flare_ner,flare_sm_acl,flare_fpb"
```

EleutherAI `lm-evaluation-harness` 의 `--model "hf-causal-llama"` 어댑터 사용. `--tasks` 콤마 구분 task 이름. FinMA 모델은 `TheFinAI/finma-7b-full` HuggingFace 페이지에서 자동 다운로드. **자동 평가** — 즉 각 데이터셋의 표준 split (test set) 위에서 batch inference + metric 계산.

### Mode 2: Commercial API

```bash
export OPENAI_API_SECRET_KEY=YOUR_KEY_HERE
python eval.py \
    --model gpt-4 \
    --tasks flare_ner,flare_sm_acl,flare_fpb
```

OpenAI GPT-4 (또는 ChatGPT, GPT-3.5) 의 API 평가. **이게 LLM 평가의 가장 중요한 부분** — local model 과 API model 을 같은 코드로 평가 가능. baseline (ChatGPT/GPT-4) 평가가 reproducible.

### Mode 3: Self-Hosted

자체 inference backend (`scripts/run_interface.sh`) + `data/*/evaluate.py` 실행. 회사 내부 모델을 PIXIU 평가에 올릴 때 사용.

## 4. BARTScore 외부 의존

README "Automated Task Assessment" 절: "Before evaluation, please download BART checkpoint to `src/metrics/BARTScore/bart_score.pth`." Google Drive 링크로 별도 다운로드. **요약 태스크의 의미적 평가용**. BARTScore (Yuan, Neubig, Liu 2021) 는 BART 의 likelihood 를 reference vs candidate 의 의미적 유사도 측정에 활용. ECTSUM/EDTSUM 평가에 필수.

## 5. 0-shot 평가의 한계 자기-인정

README "Automated Task Assessment" 절 verbatim:

> "Please note, for tasks such as NER, the automated evaluation is based on a specific pattern. This might fail to extract relevant information in zero-shot settings, resulting in relatively lower performance compared to previous human-annotated results."

이게 본 PIXIU 의 가장 중요한 **저자 자기-인정 한계**. NER 의 자유 형식 출력 (예: "Elon Musk, PER; SpaceX, ORG") 을 regex pattern 매칭으로 entity 추출하는데, zero-shot 에서 LLM 이 형식을 살짝 어기면 (예: "PER: Elon Musk") pattern 못 잡아서 underestimate. **인간 평가 대비 자동 metric 이 낮게 나오는 known underestimation**.

## 6. 평가 외부 baseline — ChatGPT, GPT-4, BloombergGPT

README "FinBen 2.0" 절 도입부 verbatim: "we provide a detailed performance analysis of FinMA compared to other leading models, including ChatGPT, GPT-4, and BloombergGPT et al."

- **ChatGPT (gpt-3.5-turbo)**: API mode 로 평가.
- **GPT-4**: API mode 로 평가.
- **BloombergGPT**: 비공개 모델. README 가 비교한다고 했지만, BloombergGPT 의 정확한 점수가 PIXIU 본문 표에 있다면 그건 BloombergGPT 의 자기-보고 수치 (Wu 2023 논문 표) 의 재인용. **본 PIXIU 가 BloombergGPT 를 직접 평가한 게 아님**.

## 7. 후속 FinBen 의 leaderboard 화

README "FinBen 2.0" 절: "All model results of FinBen can be found on our leaderboard!" → HuggingFace Spaces `TheFinAI/flare` (또는 `finosfoundation/Open-Financial-LLM-Leaderboard`) 의 실시간 leaderboard. **벤치마크가 단발 publication 에서 사회적 채택 인프라로** 진화한 사례. PIXIU 의 long-term impact 의 핵심.

## 핵심 한 문장

FLARE 는 **8 task × 15 dataset (원판) → 30+ dataset (FinBen 2.0) × 9 metric × 3 mode (HF/API/self-host) × EleutherAI harness 호환** 의 5-축 평가 인프라. **새 metric 1개 (Missing Ratio) + 외부 baseline 표준화 (ChatGPT/GPT-4/BloombergGPT)** 가 contribution. NER zero-shot 자동 평가의 underestimation 을 저자 스스로 README 에서 명시 인정 — **honest evaluation infrastructure** 가 NeurIPS 2023 D&B 통과의 핵심 요인.
