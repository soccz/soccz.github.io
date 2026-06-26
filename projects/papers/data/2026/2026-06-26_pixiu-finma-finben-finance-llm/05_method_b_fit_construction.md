# 05b. 방법론 — FIT 지시튜닝 데이터 구성

> 배경 사다리: 이 절은 ① "instruction tuning" 이 (지시문 $x$, 정답 $y$) 짝의 모음으로 LLM 을 fine-tune 하는 절차라는 점, ② 같은 raw 데이터셋에서도 prompt 변형으로 인스트럭션을 ×N 으로 확장 (augment) 할 수 있다는 점, ③ 카테고리 데이터셋 (예: FPB 의 sentiment classification) 에 자연어 지시문을 붙이려면 라벨을 자연어 토큰 ("negative") 으로 변환하는 작업이 필요하다는 점을 알면 따라온다.

## 1. FIT 의 9-dataset × 카테고리 매핑

README "FIT — Dataset Statistics" 표 verbatim 을 카테고리별로 정리:

### (a) Sentiment analysis (×10 augment, 60,180 인스트럭션)

- **FPB** (Financial PhraseBank, Malo et al. 2014) — Reuters financial 뉴스 4,845 문장의 sentiment (positive/negative/neutral) 3-class 분류. ×10 augment → 48,450 인스트럭션.
- **FiQA-SA** (FiQA-2018, Maia et al.) — news headlines + tweets 1,173 항목의 sentiment. WWW'18 open challenge 발 데이터. ×10 augment → 11,730.

**왜 sentiment 가 카테고리의 35% 를 차지하는가**. Sentiment 가 모든 금융 NLP 의 가장 기본적인 도메인 어휘 노출 task. FPB 의 4,845 raw 가 ×10 으로 가장 많이 augment 된 이유도 sentiment 가 도메인 vocabulary 학습의 backbone 임. ×10 augment 의 정확한 prompt variant 디자인은 README 에 명시 안 됨 — synonym replacement, paraphrase, instruction wording 변형 중 하나일 가능성이 큼.

**Sentiment 의 지시문 예시 (README verbatim)**:
> "Analyze the sentiment of this statement extracted from a financial news article. Provide your answer as either negative, positive or neutral. For instance, 'The company's stocks plummeted following the scandal.' would be classified as negative."

이 형태는 **few-shot 예시 in-context** (마지막 예시 문장) 포함 + **라벨 토큰 명시** ("negative") + **도메인 명시** ("financial news article") 의 3-요소 prompt design. 표준 sentiment classification 보다 정교.

### (b) News headline classification (×1, 11,412 인스트럭션)

- **Headline** (Sinha & Khandait 2021) — 뉴스 헤드라인 11,412개의 multi-label 분류. 금 (gold) 가격에 대한 헤드라인이 "price", "asset comparison", "past general", "future general" 등의 9-class binary label 들로 분류됨.

**Headline 의 지시문 예시 (README verbatim)**:
> "Consider whether the headline mentions the price of gold. Is there a Price or Not in the gold commodity market indicated in the news headline? Please answer Yes or No."

binary classification 의 가장 단순한 형태. Multi-label dataset 을 single-label binary 질문 9번으로 풀어내는 방식.

**Multiplier 가 ×1 인 이유**. Raw 자체가 11K 로 크고, prompt augmentation 의 marginal value 가 sentiment 보다 낮은 (9-label binary 라서 prompt 변형 공간이 좁음) 것이 추정. PDF 본문 §FIT detail 에서 정확한 설명 가능성.

### (c) Named entity recognition (×10, 13,660 인스트럭션)

- **NER** (Salinas Alvarado et al. 2015) — 신용 위험 평가용 금융 문서 1,366개 NER (PER/ORG/LOC). ×10 augment.

**NER 의 지시문 예시 (README verbatim)**:
> "In the sentences extracted from financial agreements in U.S. SEC filings, identify the named entities that represent a person ('PER'), an organization ('ORG'), or a location ('LOC'). The required answer format is: 'entity name, entity type'. For instance, in 'Elon Musk, CEO of SpaceX, announced the launch from Cape Canaveral.', the entities would be: 'Elon Musk, PER; SpaceX, ORG; Cape Canaveral, LOC'"

**디자인 결정**. NER 의 토큰별 라벨 (BIO scheme) 을 "entity name, entity type" 의 한 줄 자연어 출력으로 변환 → LLM generation 형식과 정합. 단점: 토큰 단위 평가 → 자유 형식 출력 매칭 → 평가 정확도 손실. README "Automated Task Assessment" 절의 "for tasks such as NER, the automated evaluation is based on a specific pattern. This might fail to extract relevant information in zero-shot settings" verbatim 자기-인정.

### (d) Question answering (×1, 12,173 인스트럭션)

- **FinQA** (Chen et al. 2021, EMNLP) — 어닝 리포트 8,281 numerical reasoning QA. text + table 멀티모달.
- **ConvFinQA** (Chen et al. 2022, EMNLP) — multi-turn conversational FinQA 확장. 3,892 항목.

**QA 의 지시문 예시 (README verbatim)**:
> "In the context of this series of interconnected finance-related queries and the additional information provided by the pretext, table data, and post text from a company's financial filings, please provide a response to the final question. This may require extracting information from the context and performing mathematical calculations. Please take into account the information provided in the preceding questions and their answers when formulating your response:"

ConvFinQA 의 multi-turn 성격을 명시 — "preceding questions and their answers". 한 줄 prompt 가 multi-turn context 의존성을 자연어로 표현하는 방식.

### (e) Stock movement prediction (×1, 39,184 인스트럭션)

- **BigData22** (Soun et al. 2022) — 7,164 항목 tweets + 가격 시계열.
- **ACL18** (Xu & Cohen 2018) — 27,053 항목, ACL 2018 베스트 리소스. **FIT 의 단일 데이터셋 중 최대**.
- **CIKM18** (Wu et al. 2018) — 4,967 항목 hybrid deep sequential modeling 으로부터 유래.

**Stock prediction 지시문 (README verbatim)**:
> "Analyze the information and social media posts to determine if the closing price of \{tid\} will ascend or descend at \{point\}. Please respond with either Rise or Fall."

`{tid}` (ticker), `{point}` (시점 — "2017-11-23" 형식 추정) 의 template slot. **시계열 자체의 텍스트 인코딩 방식은 README 에서 명시 안 됨** — 본문 PDF 의 §FIT data preparation 섹션에서 확인 필요. ACL18 dataset 의 원 형태가 tweets + historical OHLCV 시계열인 점을 감안하면, OHLCV 가 "Day-N: open=152.3, close=153.1, high=154.0, low=151.8, volume=1.2M" 같은 토큰 직렬화로 prompt 에 삽입되어 있을 가능성이 높음 — 단 본 환경에서 단정 불가.

## 2. FIT 의 핵심 디자인 결정 4가지

### 결정 1. ×10 augmentation 의 비대칭

FPB ×10, FiQA-SA ×10, NER ×10 만 augment, 나머지는 ×1. **이 비대칭의 정당성은 README 에서 명시 안 됨**. 추정:
- 데이터 크기가 작은 (1K~5K 범위) raw 만 ×10. Headline (11K) / FinQA (8K) / ACL18 (27K) 은 raw 자체가 충분.
- Augmentation 으로 prompt variation 공간이 큰 task (classification with multiple label words, NER with multiple entity orderings) 만 ×10.

이 비대칭은 **catastrophic forgetting 의 비대칭** 으로 직결. Sentiment task 가 instruction pool 의 35% 라서 FinMA 의 attention 가중이 sentiment 형식에 기울었을 가능성. ablation 으로 확인 가능한 가설.

### 결정 2. 5-카테고리 통일 prompt 디자인

각 카테고리마다 **(domain context + task description + label tokens + few-shot in-context example)** 의 4-part prompt. README 의 5개 예시 모두 이 구조. **Domain expert designed** (README 명시). 이게 FIT 의 가장 큰 가치 — 데이터 수집보다 prompt 디자인 자체.

### 결정 3. Stock prediction 을 binary direction 으로 단순화

복잡한 연속값 (price change rate) 대신 binary (Rise/Fall). **장점**: LLM 의 텍스트 출력에 정합 + 평가 단순 (Accuracy). **단점**: (i) 정보 손실 (1% 상승 vs 5% 상승 동일 라벨), (ii) reward signal 의 sparsity 증대, (iii) class imbalance (Bull market 구간에서 Rise dominant), (iv) 시간 horizon 미지정 (1일/5일/1개월?).

### 결정 4. Multi-turn 처리 (ConvFinQA)

FinQA 의 multi-turn 확장 ConvFinQA 를 FIT 에 명시 포함. Multi-turn instruction tuning 으로 conversational 능력 일부 확보. 단 README "Generating Datasets for FIT" 절의 JSON 포맷:

```json
{
    "id": "unique id",
    "conversations": [
        {"from": "human", "value": "..."},
        {"from": "agent", "value": "..."}
    ],
    "text": "...",
    "label": "..."
}
```

는 **2-turn (human + agent) 기본** 구조. Multi-turn (3턴 이상) 의 처리는 별도 logic 가능성 (`"For Multi-turn tasks (such as)"` 라는 자르다 만 문장이 README 에 있음 — 미완성된 부분).

## 3. FIT 의 약점 — 본 환경에서 확정 가능한 부분

1. **데이터 시간 범위 명시 부재**. ACL18 의 raw tweets+prices 는 2014-2016 시기. BigData22 는 2019-2022 추정. 그러나 README 에서 정확한 split 범위 미명시. 시간 분포 변동 (concept drift) 에 대한 robustness 측정 부재.
2. **데이터셋 license 의 혼합**. README "License" 열 verbatim: CC BY-SA 3.0 / Public / CC BY-NC 4.0 / MIT / CC BY 4.0 등. NC (non-commercial) 라이선스 (FOMC, FinArg-ECC) 포함 — 상업적 사용 시 라이선스 충돌 가능.
3. **인스트럭션 품질 변동**. Domain expert designed 라고 하나, 5개 카테고리 prompt 가 모두 동일 expert 손인지, 분산된 contributor 들의 일관성이 어떤지 명시 없음.

## 핵심 한 문장

FIT 는 **9-dataset × 5-카테고리 × ×N augmentation × 4-part prompt design** 의 4축 디자인 산물. 데이터 수집 자체보다 **prompt template 의 도메인-특화 디자인** 이 contribution 의 본질. ACL18 (27K) + FPB×10 (48K) 의 두 dataset 이 FIT 의 55% 를 차지하는 비대칭은 향후 ablation 의 대상.
