# 04. 핵심 Claim 해체

본 PIXIU 의 핵심 주장 4개를 GitHub README "Key Features" 절 verbatim 4-key feature 와 NeurIPS 2023 D&B 트랙 accept 후 검색 verbatim 인덱스로 추출. 각 Claim 마다 **주장 / 증거 / 숨은 전제 / 쉬운 말 풀이**.

> 배경 사다리: 이 절은 ① 본 환경에서 PDF 본문 차단으로 "Section X.Y" 등의 정확한 위치 단정은 불가능하고, GitHub README 의 절 이름으로 대응한다는 점, ② 4-Claim 의 분리가 README "Key Features" 의 4-bullet 과 거의 1:1 매칭이라는 점만 알면 된다.

---

## Claim 1 — 금융 도메인의 **공개 LLM + 공개 instruction 데이터 + 공개 평가 벤치마크** 의 동시 부재를 단번에 해소

**주장**. 2023년 중반 시점, BloombergGPT (Wu 2023) 같은 도메인 LLM 은 비공개·BERT-기반 FinBERT 계열은 작고 태스크 분산되어 있었음. PIXIU 는 FinMA-7B/7B-full/30B (모델) + FIT 136K 지시 데이터 + FLARE 8-task 평가 벤치마크 + EleutherAI lm-evaluation-harness 호환 eval 인프라까지 **네 가지를 MIT 라이선스로 동시에 공개**.

**증거**. README "📢 Update (Date: 09-22-2023)" 절 verbatim "our paper, 'PIXIU: A Comprehensive Benchmark, Instruction Dataset and Large Language Model for Finance', has been accepted by NeurIPS 2023 Track Datasets and Benchmarks". README "Key Features — Open resources" verbatim: "PIXIU openly provides the financial LLM, instruction tuning data, and datasets included in the evaluation benchmark to encourage open research and transparency." HuggingFace 호스팅 모델 페이지: `TheFinAI/finma-7b-nlp`, `TheFinAI/finma-7b-full`. 세 평가 데이터셋 컬렉션 페이지: `TheFinAI/english-evaluation-dataset-…`, `…/spanish-…`, `…/chinese-…`.

**숨은 전제**.
- (i) "공개" 자체가 contribution 으로 NeurIPS 에 통과할 만큼 학계 가치가 있다는 가정 → NeurIPS 2023 D&B Track 의 charter 가 정확히 이런 기여를 인정.
- (ii) LLaMA 라이선스가 도메인 fine-tune 후 재배포를 허용한다는 가정 → 2023년 시점 LLaMA 1 의 라이선스가 학술 비상업적 재배포 허용 (Meta 공식). FinMA-7B 의 HuggingFace 페이지가 그 통과 후 공개됨.
- (iii) MIT 라이선스 + 학술 사용 한정의 dual-license 모델이 도메인 채택을 가속한다는 가정. 후속 FinBen NeurIPS 2024 가 PIXIU 위에 직접 구축됐다는 사실로 사후 검증됨.

**쉬운 말 풀이**. "그동안 금융 AI 분야는 회사들 (Bloomberg) 이 자기 만든 비싼 모델로 자기들끼리만 점수를 매기고, 학자들은 그 점수표가 어떻게 만들어지는지조차 모르는 상황이었다. PIXIU 는 '시험지, 학습 워크북, 모범 답안지, 채점 도구' 를 한꺼번에 무료로 풀어버렸다. 누구나 이 시험지로 자기 모델을 채점할 수 있게 됐다."

---

## Claim 2 — 4-NLP-task + 1-prediction-task 의 **통합 instruction format** 으로 fine-tune 한 FinMA 가 일반 LLM (LLaMA, ChatGPT, GPT-4) 대비 도메인 NLP 태스크에서 향상

**주장**. FIT 의 9-dataset × multiplier 로 약 136K 인스트럭션을 만들고, 이걸로 LLaMA-7B 와 LLaMA-30B 를 instruction-tune 한 FinMA 가 도메인 NLP 태스크 (sentiment, headline classification, NER, QA) 에서 일반 LLM 대비 일관된 향상을 보임.

**증거**. README "FIT — Dataset Statistics" 표 verbatim:

| Data | Task | Raw | Instruction |
|---|---|---|---|
| FPB | sentiment analysis | 4,845 | 48,450 |
| FiQA-SA | sentiment analysis | 1,173 | 11,730 |
| Headline | news headline classification | 11,412 | 11,412 |
| NER | named entity recognition | 1,366 | 13,660 |
| FinQA | question answering | 8,281 | 8,281 |
| ConvFinQA | question answering | 3,892 | 3,892 |
| BigData22 | stock movement prediction | 7,164 | 7,164 |
| ACL18 | stock movement prediction | 27,053 | 27,053 |
| CIKM18 | stock movement prediction | 4,967 | 4,967 |

합 ≈ 137,609 (README 본문에서 "136K" 표기). README "FinBen 2.0" 절 도입부 verbatim: "we provide a detailed performance analysis of FinMA compared to other leading models, including ChatGPT, GPT-4, and BloombergGPT et al." — 즉 GPT-4 까지 명시적 비교 baseline.

**숨은 전제**.
- (i) **Instruction multiplier 의 정당성**. FPB 는 ×10, FiQA-SA 는 ×10, NER 은 ×10 으로 augment 됐으나 ConvFinQA/FinQA 는 ×1. 어떤 데이터는 prompt 변형으로 10배 데이터로 확장됐고 어떤 건 그대로다. 이 비대칭이 학습 신호의 imbalance 를 만들 가능성 (FPB 가 인스트럭션 풀의 35% 차지) — 본 README 에서 명시 정당화 부재.
- (ii) **136K 인스트럭션의 충분성 가정**. Alpaca 의 52K instruction 으로 LLaMA-7B 가 GPT-3.5 와 견줄만했다는 선행 결과 → 도메인에서 136K 면 충분하다는 경험적 가정.
- (iii) **9-dataset 분포의 대표성 가정**. Sentiment 2개, NER 1개, Headline 분류 1개, QA 2개, stock prediction 3개. 다른 중요한 금융 태스크 (credit scoring, fraud detection, ESG classification) 가 FIT 학습에는 빠짐 — 단 FinBen 평가에는 후속 확장 포함.

**쉬운 말 풀이**. "워크북에 9가지 문제 유형을 다양한 분량으로 (어떤 건 4만 8천 문제, 어떤 건 4천 문제) 실어서 학생 (LLaMA 7B) 에게 풀게 했다. 그 학생이 같은 시험을 ChatGPT, GPT-4 와 같이 보면 도메인 일에서는 더 좋은 점수를 받더라. 단, '주가 방향 예측' 처럼 그냥 글만 봐도 안 되는 일은 도움이 제한적."

---

## Claim 3 — Stock movement prediction 의 **(트윗, 가격 시계열) 멀티모달 입력** 을 LLM instruction template 한 줄로 통합

**주장**. 금융 도메인의 핵심 응용인 "주가 방향 예측" 을 LLM 의 시퀀스 생성 형식에 끼워넣는 prompt template 을 제시하고, 이를 FIT 의 9-dataset 중 3개 (BigData22/ACL18/CIKM18) 로 instruction-tune 의 정식 일원으로 포함. 이로써 "LLM 이 시계열을 native modality 로 다룰 수 있는가" 라는 질문에 첫 답을 제공.

**증거**. README "FIT — Modality and Prompts" 표의 stock movement prediction 행 verbatim instruction example: *"Analyze the information and social media posts to determine if the closing price of \{tid\} will ascend or descend at \{point\}. Please respond with either Rise or Fall."* — `{tid}` (ticker id) 와 `{point}` (시점) 의 placeholder slot 을 가진 template. "Modalities" 열에 "Text, Time-Series" 로 명시. "Text Types" 열에 "tweets, Stock Prices".

**숨은 전제**.
- (i) **가격 시계열을 LLM 의 텍스트 토큰으로 어떻게 인코딩하는가** — README 의 prompt 예시는 high-level template 만 보여줘 정확한 가격 시계열의 텍스트 표현 (예: "Day 1: open=152.3, close=153.1, ..." 같은 직렬화 vs. 다른 방식) 은 PDF 본문이 필요. **본 환경에서 단정 불가**. BigData22/ACL18 데이터셋 페이지에서 추가 확인 가능하나, 본 절 작성 시점에서는 single-line template 만 확정.
- (ii) **이진 분류 (Rise/Fall) 의 충분성 가정**. 실제 금융 의사결정은 (정도, 신뢰도, 시간 범위) 모두 필요하지만 PIXIU 는 binary direction prediction 으로 단순화. **단순화의 대가는 reward signal 의 sparsity 증대**.
- (iii) **트윗의 sentiment signal 이 가격 방향에 인과적 영향을 미친다** 는 시장미시구조 가정. 실증적으로 약함 (특히 일별 단위에서). 이 가정 약함이 stock prediction 태스크의 학습 어려움의 근본 원인.

**쉬운 말 풀이**. "글 (트윗) 과 숫자 (가격 흐름) 를 동시에 보고 '내일 오를까 내릴까' 를 맞히는 문제를, LLM 이 익숙한 '글 답변' 형식 한 줄로 표현했다. '주가 153.1, 트윗: 이 회사 회계 의심스러움. 다음 날 오를까 내릴까? Rise/Fall 중 답해.' 같은 식."

---

## Claim 4 — Prediction task 의 정식 벤치마크 일원화로 **GLUE/SuperGLUE 보다 현실에 가까운** 도메인 벤치마크

**주장**. 일반 NLP 벤치마크 (GLUE, SuperGLUE) 가 분류·이해·생성에 머무른 반면, PIXIU 의 FLARE/FinBen 은 **stock movement prediction** 을 정식 평가 일원으로 포함. 이로써 "LLM 이 실세계 금융 의사결정에 얼마나 유용한가" 의 직접적 측정 가능성을 마련.

**증거**. README "Key Features — Diversity" 절 verbatim: "Unlike previous benchmarks focusing mainly on financial NLP tasks, PIXIU's evaluation benchmark includes critical financial prediction tasks aligned with real-world scenarios, making it more challenging." README "FinBen 2.0 — Tasks" 표에 BigData22/ACL18/CIKM18 행 verbatim "stock movement prediction" 카테고리 명시.

**숨은 전제**.
- (i) **"현실 정렬" 의 정의가 prediction-task 포함과 동치라는 가정**. 사실 현실 금융은 prediction + execution + risk management + portfolio construction 의 합인데, PIXIU 는 prediction 만 추가. **부분적 현실 정렬**.
- (ii) **벤치마크 일원화로 prediction task 의 평가 비교가 의미 있어진다** 는 가정. 그러나 prediction task 자체가 noise floor 가 높아서 (시장의 efficient market hypothesis 와 conflict) 모델 간 차이가 metric noise 안에 묻힐 위험. README 의 평가 메트릭 표가 prediction task 에 어떤 metric (Accuracy? MCC?) 을 쓰는지 명시는 일반적으로 README 안에서 확정 불가 — PDF 본문에서 확인 필요.
- (iii) **"more challenging" 의 정의 의 모호함**. 더 어려운 게 학계 가치인지, 더 noisy 한 게 학계 가치인지 — challenge 의 본질을 NLP 와 prediction 으로 통합한 시도는 evaluation 의 가치 자체를 재정의하는 측면이 있다. 이 가정이 향후 비판 대상이 될 여지.

**쉬운 말 풀이**. "예전 NLP 시험은 '문장 이해, 분류, 요약, 번역' 같은 책상 위 일만 다뤘다. PIXIU 시험은 '내일 이 회사 주가 오를까 내릴까' 같은 길거리 일까지 포함시켰다. 더 어렵고 더 실용적이지만, 그만큼 답이 noisy 한 일이라 모델 간 점수 차이가 운빨로 보일 위험도 같이 늘었다."

---

## Claim 간 의존 관계

Claim 1 (공개) 이 **인프라적 contribution**. Claim 2 (FIT instruction tuning) 와 Claim 3 (멀티모달 prompt) 가 **방법론적 contribution**. Claim 4 (prediction task 포함) 가 **벤치마크 디자인 contribution**. 1→4 의 종속 관계: 1번 공개가 없으면 후속 FinBen NeurIPS 2024 / IJCAI FinLLM Challenge 가 생기지 않았을 것. 즉 **1번이 가장 비대칭적으로 강한 contribution**. 본 PIXIU 의 NeurIPS 2023 D&B Track accept 의 본질도 1번에 가깝다고 봐야 한다.
