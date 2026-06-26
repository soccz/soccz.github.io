# 03. 문제 지형도

> 배경 사다리: 이 절은 ① 일반 NLP 의 GLUE/SuperGLUE 가 "왜 만들어졌고 어떻게 효과를 발휘했는지", ② "금융 도메인 LLM" 이 일반 LLM 과 어떻게 다른지, ③ instruction tuning 이 사전학습된 LLM 을 특정 일에 맞추는 표준 절차라는 정도만 알면 따라올 수 있다.

## 1. 이 논문이 푸는 실제 문제 — 세 가지 현장 시나리오

### 시나리오 A. 금융 NLP 스타트업이 "GPT-4 보다 우리 모델이 더 낫다" 고 주장하고 싶을 때 (2023년 봄)

스타트업이 자체 fine-tune 한 7B 모델로 헤지펀드 영업 PT 를 한다고 하자. 영업 슬라이드 마지막에 "벤치마크 점수" 가 필요하다. 그런데 2023년 5월 시점, 금융 도메인의 표준 벤치마크가 없다. FPB sentiment 만 따로 돌려서 ChatGPT 보다 높은 정확도를 보였다고 한들, 리뷰어/투자자는 "그래서 NER, QA, summarization, 주가 예측은?" 이라고 묻는다. 각 데이터셋을 따로 따로 fork-and-run 해서 보고하는 건 비교 가능성이 낮고, 본인이 좋게 나온 데이터셋만 선별 보고하는 cherry-picking 의심이 즉시 생긴다.

### 시나리오 B. 학계 연구자가 BloombergGPT 를 인용하고 싶지만 비교가 불가능할 때 (2023년 봄)

Bloomberg 가 2023-03-30 발표한 BloombergGPT (50B parameter, 365B token 학습 데이터) 는 도메인 내 SOTA 라고 주장하지만 **모델 비공개, 데이터 비공개, 평가 코드 비공개**. 학계 연구자가 "내 7B 도메인 모델이 BloombergGPT 의 50B 와 어떤 격차가 있는지" 정량적으로 보일 수 없다. 즉 도메인 LLM 의 "공정한 비교" 자체가 봉쇄돼 있다.

### 시나리오 C. 헤지펀드/리서치 데스크가 LLM 으로 자동 리서치 파이프라인을 만들고 싶을 때

리서치 데스크는 "이 모델이 (a) 뉴스 헤드라인을 분류하고, (b) 어닝 콜에서 핵심 수치를 뽑고, (c) 그 수치로 정성적 추론하고, (d) 최종적으로 다음 분기 주가 방향을 예측할 수 있는가" 의 **연쇄 파이프라인 평가** 가 필요하다. 그런데 각 단계마다 별개 데이터셋 (각자 다른 형식, 다른 평가 기준) 으로 분리 평가하면 파이프라인 전체의 약점이 어디인지 안 보인다. 통합 instruction-format + 통합 평가 harness 가 필요하다.

세 시나리오 모두 **"표준 벤치마크 부재"** 라는 동일한 병목으로 수렴. 이게 PIXIU 가 푸는 문제.

## 2. 기존 접근 계보 — 4 이정표

### (가) FinBERT 계열 (2019~2022, encoder-only fine-tuning)

**무엇이었나**. Yiqiu Yang et al. 2019 "FinBERT: A Pretrained Language Model for Financial Communications" (arXiv:2006.08097) 등을 필두로, BERT-base 위에 금융 코퍼스 (Reuters, FOMC, 어닝콜) 추가 사전학습 + sentiment 데이터셋 (FPB, FiQA-SA) fine-tune. encoder-only.

**왜 부족했나**. (i) 태스크별로 모델 인스턴스가 분리됨 — sentiment FinBERT, QA FinBERT-QA, NER FinBERT-NER 각자 별 모델. (ii) 생성 (요약, QA) 태스크에 약함. (iii) zero-shot/few-shot 일반화 능력 없음 — 각 데이터셋마다 라벨된 학습 데이터 필요.

**남긴 교훈**. 도메인 코퍼스 추가 사전학습 + 다운스트림 fine-tuning 의 standard recipe. 도메인 vocabulary (e.g., "EBITDA", "10-K") 의 충실한 표현이 NLP 성능에 직접 기여.

### (나) BloombergGPT (Wu et al. 2023, arXiv:2303.17564)

**무엇이었나**. 50B parameter, 363B 토큰 (절반은 Bloomberg 사내 데이터, 절반은 공개) 학습된 decoder-only 금융 LLM. PILE 의 일반 데이터 + Bloomberg-private financial documents 의 혼합.

**왜 부족했나**. (i) **비공개**. 학계 비교 불가능. (ii) BloombergGPT 자체가 보고한 평가 데이터셋도 자기들이 따로 큐레이션한 set 이라 외부 검증 어려움. (iii) 학습 데이터 절반이 private 라 라이선스/재현성 0.

**남긴 교훈**. "큰 도메인 LLM 이 작은 generalist LLM 보다 도메인 점수가 높다" 는 first proof of concept. PIXIU 가 정면에서 풀어내려 한 비공개성 문제를 부각.

### (다) GLUE / SuperGLUE 의 NLP 표준 (Wang et al. 2018, 2019)

**무엇이었나**. GLUE (9 task) → SuperGLUE (8 task) 의 형태로, 다양한 NLP 태스크를 **하나의 평가 harness** 로 묶어 BERT/RoBERTa/T5 등 일반 LLM 의 줄세우기 가능하게 한 작업. NeurIPS 2019 D&B Track 의 대표적 성공 사례.

**왜 (금융 도메인에서) 부족했나**. 도메인 데이터/태스크가 일반 NLP 와 다르다. e.g., "FOMC 의장 발언의 hawkish/dovish 분류" 는 일반 sentiment 와 다른 라벨 체계. "어닝 리포트의 multi-step 수치 추론" 은 일반 QA 와 reasoning depth 가 다르다. **GLUE 의 정신을 금융 도메인으로 옮기는 작업이 비어 있었음**.

**남긴 교훈**. "벤치마크가 분야를 만든다" — GLUE 가 BERT 시대를, SuperGLUE 가 T5/GPT-2 시대를 열었듯, 도메인 GLUE 가 도메인 LLM 시대를 연다.

### (라) FLAN / Self-Instruct / Alpaca 계열 (Wei et al. 2022, Wang et al. 2023, Taori et al. 2023)

**무엇이었나**. FLAN (Wei 2022) 의 instruction-tuning 멀티태스크 학습으로 LLM 의 zero-shot 능력이 크게 향상됨을 시연. Self-Instruct (Wang 2023) 가 LLM-generated 인스트럭션으로 데이터 부트스트랩. Stanford Alpaca (Taori 2023) 가 LLaMA-7B + 52K instruction 으로 GPT-3.5 와 견줄만한 모델을 만든 사례.

**왜 (금융 도메인에서) 부족했나**. Alpaca 의 일반 instruction 만으로는 금융 도메인 일을 못한다. FOMC 발언 분류, FinQA 의 다단계 수치 추론, stock movement prediction 의 (tweet, price) 멀티모달 입력은 **도메인-특화 인스트럭션 디자인** 이 필요.

**남긴 교훈**. Instruction tuning recipe 자체는 일반 NLP 에서 이미 검증됨. **남은 일은 "도메인 instruction format 의 디자인 + 데이터 큐레이션"**. 이 정확히 PIXIU 의 FIT 가 한 일.

## 3. 기존 방법들이 공통으로 놓친 핵심 gap

**네 가지 자원** — (a) 공개 금융 LLM, (b) 공개 금융 instruction tuning 데이터, (c) 공개 표준 금융 평가 벤치마크, (d) 공개 평가 harness — 이 **모두 동시에** 부재했다는 점. 위 (가)~(라) 중 한두 개를 부분적으로 메운 작업은 있어도, **네 가지를 한 번에** 정리한 작업은 없었다.

특히 **(c) 의 부재가 (a)/(b)/(d) 의 진입 비용을 가장 키웠다**. 표준 벤치마크가 없으니 새 모델/새 데이터/새 metric 을 어디에 정렬할지 매번 처음부터 결정. 진입자마다 "어떤 데이터셋에 어떤 metric 으로 어떻게 split 하지" 부터 다시 결정해야 했다. 이게 도메인 LLM 연구의 **공동 인프라 결핍**.

또 하나, **(e) 시계열-텍스트 멀티모달의 명시적 포함**. 기존 금융 LLM/NLP 벤치마크는 텍스트만 — sentiment, QA, summarization. 그런데 금융의 본질은 "텍스트와 가격이 같이 움직이는 동학" 이다. 트윗 sentiment 가 1분 후 OHLCV 에 어떻게 반영되는지를 **하나의 모델 안에서 처리** 하려면, 벤치마크가 그런 멀티모달 입력을 정식 일원으로 포함해야 한다. 기존 NLP 벤치마크는 이 modality 를 아예 다루지 않았다.

## 4. PIXIU 의 메우기 전략 — 한 단락

PIXIU 의 답은 **"네 가지를 한 번에 + 시계열 포함"**. (a) FinMA = LLaMA-7B/30B 위에 (b) FIT = 136K 인스트럭션 (9-dataset, 4 NLP task + 1 prediction task) 로 instruction-tune → (c) FLARE (후속 FinBen 으로 확장) = 8 task / 15 dataset 표준 평가 → (d) EleutherAI lm-evaluation-harness 호환 `eval.py` + BARTScore 체크포인트 + Docker 이미지로 평가 harness. 모두 **MIT 라이선스로 즉시 공개**. (e) Stock movement prediction (BigData22/ACL18/CIKM18) 의 **(tweets, 가격 시계열)** 멀티모달 입력을 instruction template 한 줄로 통합 ("Analyze the information and social media posts to determine if the closing price of {tid} will ascend or descend at {point}. Please respond with either Rise or Fall." verbatim from README "FIT — Modality and Prompts" 표).

핵심은 **"새 알고리즘 0 개 / 새 인프라 4 개"**. NeurIPS 2023 *Datasets and Benchmarks Track* 의 정신에 정확히 맞춘 작업. 본 논문의 영향력이 알고리즘이 아니라 **공동 인프라의 사회적 채택** 에 있는 이유.
