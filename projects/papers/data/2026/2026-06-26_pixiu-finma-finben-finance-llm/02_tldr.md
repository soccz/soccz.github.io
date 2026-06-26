# 02. 3층 TL;DR

> 배경 사다리: 이 절을 읽으려면 ① **LLM (Large Language Model, 대형 언어모델)** 이 "엄청나게 많은 텍스트로 사전학습된 다음, 작은 양의 '예시-정답' 으로 추가 학습 (instruction tuning) 을 받아 특정 일을 잘 하는 도구가 된다" 는 흐름과, ② **벤치마크** 가 "여러 일을 표준화된 형식으로 묶어, 모든 모델을 같은 점수표로 비교할 수 있게 한 시험 모음" 이라는 정도만 알면 된다.

---

## 🧒 초등학생 수준 — 그림으로 그리기 (수식 금지)

세상에는 영어를 아주 잘하는 만능 비서 (ChatGPT 같은 것) 가 있어요. 이 비서는 시 쓰기, 요리법 설명, 수학 문제 풀기 등 거의 다 잘하지만, **"이 기업의 1년치 재무제표를 읽고 다음 분기에 주가가 오를지 떨어질지 맞춰봐"** 같은 **금융 전문 일**을 시키면 갑자기 막막해 합니다. 왜냐하면 그 비서는 일반 인터넷 글만 잔뜩 읽었지, 회계용 표·뉴스 헤드라인·트윗·재무 보고서를 "한 묶음의 일" 로 풀어본 적이 없거든요.

그래서 이 논문의 저자들이 한 일은 세 가지를 한꺼번에 만든 거예요.

1. **"문제집"** 을 만들었어요. 금융 관련 8가지 일 (뉴스 감정 분석 / 헤드라인 분류 / 회사 이름 찾기 / 사실 추출 / 질문 답변 / 글 요약 / 신용 평가 / 주가 방향 예측) 을 **15개 데이터셋** 으로 정리했어요. 시험 문제 모음집 같은 거죠. 이름은 **FLARE** (나중에는 **FinBen** 으로 확장).
2. **"학습 워크북"** 을 만들었어요. 진짜 학생이 풀 문제집과 비슷한 형식의 **136,000개 연습 문제 (instruction data)** 를 만들었어요. 이름은 **FIT**. "이 문장을 보고 긍정/부정/중립을 골라봐" 같은 자연어 지시 형태로 정리.
3. **"금융 모범생"** 을 길렀어요. Meta 가 공개한 LLaMA 라는 만능 비서를 가져다가, 위 학습 워크북으로 추가 교육시킨 **FinMA** 라는 금융 전문 모델을 만들었어요. 7B (70억) 와 30B (300억) 파라미터 두 크기로.

가장 멋진 점은 **세 가지를 모두 무료로 공개** 한 거예요. 누구나 시험지 (FLARE/FinBen), 워크북 (FIT), 모범생 (FinMA) 을 받아다가 자기 만든 금융 AI 가 얼마나 잘 하는지 같은 잣대로 잴 수 있게 됐어요. 그 전까지는 회사들 (Bloomberg 같은) 이 자기들끼리만 비교하고 공개를 안 했거든요.

그리고 또 하나 — **트윗 같은 "글"** 과 **주가 같은 "숫자 시계열"** 을 **함께** 보고 판단하게 만든 것도 새로웠어요. 보통 LLM 은 글만 보는데, 이 논문은 "글 + 가격 흐름" 을 같이 입력으로 받아서 주가 방향을 예측하는 일까지 시험에 포함시켰어요.

---

## 🎓 학부생 수준 — 핵심 흐름

**문제 정의**. 2023년 중반 시점, 금융 도메인에는 (i) 공개된 금융 전문 LLM, (ii) 공개된 금융 instruction tuning 데이터, (iii) 표준화된 금융 NLP/예측 벤치마크가 모두 **부재**했다. BloombergGPT (Wu et al. 2023) 같은 도메인 LLM 은 존재했지만 비공개 모델·비공개 데이터로 학계 비교가 불가능했다. 일반 NLP 의 GLUE/SuperGLUE 처럼 "한 점수표로 줄 세우기" 가 안 됐던 상황.

**아이디어**. **4-요소 패키지를 동시에** 공개:

1. **FIT (Financial Instruction Dataset)** — 9 데이터셋 × 인스트럭션 multiplier 로 약 **136K** 인스턴스. README "Dataset Statistics" 표 verbatim: FPB 4,845 → 48,450 (×10), FiQA-SA 1,173 → 11,730 (×10), Headline 11,412 → 11,412 (×1), NER 1,366 → 13,660 (×10), FinQA 8,281 → 8,281 (×1), ConvFinQA 3,892 → 3,892 (×1), BigData22 7,164 → 7,164 (×1), ACL18 27,053 → 27,053 (×1), CIKM18 4,967 → 4,967 (×1). 합계 ≈ 137K (README 본문에서 "136K" 로 표기).
2. **FinMA-7B / FinMA-7B-full / FinMA-30B** — LLaMA-7B / LLaMA-30B 위에 FIT 으로 instruction-tune. -7B 와 -30B 는 NLP 일부만, -7B-full 은 prediction 포함 전체로.
3. **FLARE 평가 벤치마크** — 8 task × 15 dataset 으로 확장. 카테고리: sentiment analysis, news headline classification, NER, relation extraction, QA, text summarization, credit scoring, **stock movement prediction**. 마지막 항목이 NLP-only 벤치마크와 가장 큰 차별점.
4. **9-종 자동 평가 메트릭** — Accuracy, F1 (weighted/macro), Missing Ratio, MCC (Matthews Correlation Coefficient, 이진분류용 −1~+1 점수), seqeval F1 (entity-level), Label F1, Precision/Recall, Rouge-N/Rouge-L (summarization), EmACC (Exact Match Accuracy).

**핵심 수식 (verbose - 4줄 해석)**. instruction tuning 의 표준 손실은 다음과 같이 단순한 next-token autoregressive loss 다.

$$\mathcal{L}_{\text{IT}}(\theta) = -\sum_{(x, y) \in \mathcal{D}_{\text{FIT}}} \sum_{t=1}^{|y|} \log p_\theta(y_t \mid x, y_{<t})$$

- **기호 뜻**: $\theta$ 는 LLaMA 7B/30B 의 파라미터. $\mathcal{D}_{\text{FIT}}$ 는 약 136K 의 (지시 입력 $x$, 정답 출력 $y$) 짝. $p_\theta$ 는 모델이 출력할 다음 토큰 확률. $y_{<t}$ 는 $t$ 이전까지의 정답 토큰.
- **일상 비유**: 학생 (LLaMA) 에게 워크북 (FIT) 의 문제 ($x$) 를 보여주고, 정답 ($y$) 의 첫 글자, 두 글자, ... 를 차례로 맞추게 하면서, 못 맞춘 만큼 혼낸다 (loss 가 큼).
- **왜 이 형태**: 모든 태스크 (분류·NER·QA·요약·예측) 를 **하나의 텍스트-시퀀스 생성 형식** 으로 통일해, 같은 모델 같은 손실로 동시에 학습 가능. classifier head 따로, regression head 따로 — 가 아니라 모두 "다음 토큰 맞히기".
- **조심할 점**: 정답이 "Rise" / "Fall" 같은 짧은 토큰일 때 token-level loss 의 신호가 매우 sparse 하다. 또 stock movement prediction 의 "정답" 자체가 시장 noise 가 큰 라벨이라 학습 signal-to-noise 가 낮다. → 본 논문이 FinMA-7B-full 에서 prediction task 도 학습하지만, 평가에서 "지도학습 인코더가 더 잘하는 영역" 이라고 솔직히 한계 표명할 여지.

**결과**. README 본문에서 ChatGPT, GPT-4, BloombergGPT 와 비교했다고 명시 ("FinBen 2.0" 절 도입부 verbatim). 정확한 수치는 본 환경 PDF 차단으로 단정하지 않는다. **정성적으로**: FinMA 가 NLP 태스크 일부 (특히 sentiment, headline classification, NER) 에서 도메인 fine-tuning 효과로 ChatGPT 를 상회. **반면** stock movement prediction 같은 시계열 의존 태스크에서는 도메인 전문 시계열 모델 대비 한계가 잔존 — 본 GitHub README 의 후속 *FinMem* (LLM trading agent, memory + profiling 보강) 도입이 이를 시사.

**가치**. 일반 NLP 의 GLUE (Wang et al. 2018) 가 BERT/RoBERTa 시대를 열었듯, PIXIU 의 FLARE/FinBen + FIT + FinMA 묶음이 **금융 LLM 의 "GLUE-순간"** 을 만들었다. 후속 FinBen (NeurIPS 2024 D&B) → No Language is an Island (다국어) → IJCAI 2024 FinLLM Challenge 로 라인이 1년 만에 확립.

---

## 🔬 전문가 수준 — 4개 contribution + 정확한 한계

본 PIXIU 의 contribution 을 GitHub README "Key Features" 절과 NeurIPS abstract 부재 환경에서 검색 verbatim 인덱스로 재구성하면:

1. **(Open resources)** 금융 도메인에서 **공개 LLM + 공개 instruction tuning 데이터 + 공개 평가 벤치마크** 의 **동시 부재** 를 단번에 해소한 첫 작업. BloombergGPT 가 모델·데이터 모두 비공개였던 것과 정면 대비. MIT 라이선스 + HuggingFace 호스팅으로 재현·확장의 마찰을 거의 0 으로 낮춤. 이것이 본 논문이 NeurIPS 2023 *Datasets and Benchmarks Track* 으로 통과한 가장 큰 이유.

2. **(Multi-task instruction tuning)** 4-NLP-task + 1-prediction-task 의 **5-카테고리 통합 instruction format** 을 제시. README "FIT — Modality and Prompts" 표에 5개 카테고리 prompt 예시 verbatim. Sentiment analysis 의 "Analyze the sentiment of this statement extracted from a financial news article. Provide your answer as either negative, positive or neutral. For instance, 'The company's stocks plummeted following the scandal.' would be classified as negative." 처럼 **태스크별 자연어 지시문 디자인 자체가 contribution**. Domain expert designed.

3. **(Multi-modality)** Stock movement prediction 의 **(tweets, 가격 시계열)** 멀티모달 입력을 instruction 형식 한 줄로 표현 ("Analyze the information and social media posts to determine if the closing price of {tid} will ascend or descend at {point}. Please respond with either Rise or Fall."). 시계열 데이터를 LLM 의 텍스트 토큰 흐름에 어떻게 끼워넣을지 — 이 단순한 prompt template 으로 통일. *VisionTS* (Chen et al. ICML 2025) 의 "시계열을 이미지로" 와 정확히 같은 정신: **LLM 의 native modality 로 시계열을 reframe**.

4. **(Diversity — prediction task as benchmark item)** GLUE/SuperGLUE 같은 일반 NLP 벤치마크와 가장 큰 차이는 **prediction task (stock movement)** 를 벤치마크의 정식 일원으로 포함시킨 것. NLP 일반 벤치마크는 분류·생성·이해까지인데, PIXIU 는 "이 모델이 실세계 가격 방향을 맞힐 수 있는가" 를 같은 시험지에 넣었다. README "Key Features — Diversity" 절 verbatim: "Unlike previous benchmarks focusing mainly on financial NLP tasks, PIXIU's evaluation benchmark includes critical financial prediction tasks aligned with real-world scenarios, making it more challenging."

**방어 가능한 주장**:
- 모든 4-요소 (FIT/FinMA/FLARE/metrics) 가 **자가완결적으로 재현 가능** — HuggingFace 모델·데이터·EleutherAI lm-evaluation-harness 호환 `eval.py` + BARTScore 체크포인트까지 제공.
- 후속 FinBen NeurIPS 2024 가 30+ task 로 확장된 사실이 본 벤치마크의 사회적 채택을 입증.

**한계**:
- **자동평가 metric 의 한계 명시**: README "Automated Task Assessment" 절에 "for tasks such as NER, the automated evaluation is based on a specific pattern. This might fail to extract relevant information in zero-shot settings, resulting in relatively lower performance compared to previous human-annotated results." verbatim — 즉 NER 같은 토큰 추출 태스크의 zero-shot 자동 평가는 인간 평가 대비 underestimate.
- **시점 의존성**: 학습/평가 데이터의 시간 범위 (특히 ACL18 = 2014-2016 tweets+prices) 가 2026년 시점에서 보면 leakage/시간 분포 변동 문제가 남아 있다. README 본문에 시간 범위 표기 부재.
- **금융 조언 면책**: README "Disclaimer" 절 verbatim ("This repository and its contents are provided for academic and educational purposes only. None of the material constitutes financial, legal, or investment advice."). 즉 **실거래 사용을 명시적으로 배제**.

**이론적 기여**: 새로운 모델 아키텍처나 새 알고리즘은 없다. **인프라 기여** — instruction-tuning recipe (LLaMA + 136K FIT) 와 **공개 평가 인프라** (8-task FLARE + 9-metric harness) 의 가치를 강조한 NeurIPS D&B Track 의 대표 사례.
