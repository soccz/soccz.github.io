# 06. 실험 해부

> 배경 사다리: 이 절은 ① 본 환경에서 PIXIU 의 PDF 본문이 차단되어 정확한 표/그림 수치를 단정하지 못한다는 점, ② 대신 GitHub README "FinBen 2.0" 절과 "FIT — Dataset Statistics" 표를 1차 근거로 사용한다는 점, ③ "정확 수치 미확인" 으로 처리한 곳을 명시적으로 표기한다는 점만 알고 가면 된다.

## 1. 데이터셋 각각의 해부 — 왜 이 데이터가 적합한가, 숨은 편향은 없는가

### 1.1 FPB (Financial PhraseBank, Malo et al. 2014)

**무엇인가**. Reuters 의 금융 뉴스 4,845 문장에 대해 16명 annotator 가 sentiment (positive/negative/neutral) 라벨링. 라벨 간 동의도 (≥75% / ≥66% / ≥50%) 별 sub-version 4개.

**왜 적합한가**. (a) 금융 도메인 sentiment 의 academic standard. (b) 단순 binary 가 아닌 3-class (neutral 포함) 이라 LLM 의 "결정 회피" 경향을 측정 가능. (c) annotator 간 동의도 별 sub-version 으로 평가 난이도 조절 가능.

**숨은 편향**. (i) **Reuters 만**: 다른 매체 (Bloomberg, FT, WSJ) 의 sentiment 분포와 다를 수 있음. (ii) **시점 의존성**: 2014 발표 데이터 → 학습 코퍼스 (LLaMA pre-training 2023) 가 FPB 를 봤을 가능성 — **leakage risk**. (iii) **annotator 의 financial expertise 분포 미공개**.

### 1.2 FiQA-SA (FiQA-2018 sentiment, Maia et al.)

**무엇인가**. WWW'18 open challenge 의 sentiment 데이터. news headlines + microblog (tweets) 1,173 항목. continuous sentiment score (-1 ~ +1) → discrete sentiment 변환 후 사용.

**왜 적합한가**. FPB 가 news 문장만이라면 FiQA-SA 는 **tweets 까지** 포함 — 소셜 미디어 sentiment 도 커버. 짧고 비문법적인 문장 처리 능력 측정.

**숨은 편향**. (i) **소수 데이터 (1,173)**: ×10 augmentation 으로 11,730 인스트럭션 → noise 가 9배 증폭됐을 가능성. (ii) **continuous → discrete 변환**의 cutoff 임계값 명시 부재 — README 에서 단정 불가.

### 1.3 NER (Salinas Alvarado et al. 2015)

**무엇인가**. 미국 SEC filings 의 financial agreements 1,366 문장에 대한 PER/ORG/LOC NER. 신용 위험 평가 (credit risk assessment) 용으로 만들어진 데이터.

**왜 적합한가**. SEC filings 은 금융 도메인의 표준 문서 — 회계용어, 법률 용어 혼합. NER 로 도메인 entity 인식 능력 측정.

**숨은 편향**. (i) **3-class 단순화**: 실제 금융 entity 는 (Ticker, Asset, Currency, Date, Amount) 등 훨씬 다양. PER/ORG/LOC 만 봄. (ii) **2015년 데이터** — 그 후 IPO 한 기업명 (예: 2020년대 SPAC) 미포함.

### 1.4 FinQA + ConvFinQA (Chen et al. 2021, 2022)

**무엇인가**. FinQA = S&P 500 어닝 리포트의 numerical reasoning QA, 8,281 항목. text + table 멀티모달. ConvFinQA = FinQA 의 multi-turn 확장, 3,892 항목.

**왜 적합한가**. (a) numerical reasoning 은 일반 NLP 가 약한 영역. (b) text + table 멀티모달. (c) ConvFinQA 의 multi-turn 으로 conversational 능력 검증.

**숨은 편향**. (i) **S&P 500 만**: 소형주, 신흥시장 미포함. (ii) **영어만**: 국제 금융 문서 (예: 일본/중국 어닝 리포트) 미포함. (iii) **EmACC metric 의 unfair penalty**: "$2.5 million" vs "2,500,000" 같은 표현 차이로 fail.

### 1.5 BigData22 / ACL18 / CIKM18 (stock movement prediction)

**무엇인가**. 모두 (tweets, OHLCV 시계열) 멀티모달 + (Rise/Fall) binary label.
- **ACL18** (Xu & Cohen 2018): 88 stocks, 2014-01-01 ~ 2016-01-01. tweets from Twitter (현 X). **2년 범위** → 시계열 split 의존성 큼.
- **CIKM18** (Wu et al. 2018): hybrid deep sequential modeling 베이스라인. tweets+price.
- **BigData22** (Soun et al. 2022): self-supervised learning from sparse noisy tweets. 더 최근.

**왜 적합한가**. (a) stock movement prediction 의 학계 표준 3-set. (b) Tweets+OHLCV 멀티모달 정형화. (c) Tier 1 venue (ACL, CIKM, IEEE BigData) 의 검증된 데이터셋.

**숨은 편향**. (i) **시간 leakage**: LLaMA 사전학습 코퍼스에 2014-2022 시기 뉴스/소셜 텍스트 포함 → 학습 시 데이터 노출 가능. (ii) **Survivorship bias**: 데이터셋의 stock 가 모두 그 시점에 존재했던 stock — delisted 회사는 누락. (iii) **Class imbalance**: ACL18 시기 (2014-2016) 은 bull market 으로 Rise 가 dominant. (iv) **Lookahead bias**: tweets 의 timestamp 와 price 시점의 정확한 정렬이 어떻게 됐는지 README 에서 명시 부재. 만약 tweet 의 "다음 거래일 closing price" 를 예측하는데 tweet 이 시장 close 후 발생했다면 trivial. tweet 이 시장 close 전이면 의미있음.

## 2. 베이스라인 공정성 — 비교 대상이 진짜 동등하게 튜닝됐는가

README "FinBen 2.0" 절에서 비교 baseline 으로 명시: **ChatGPT, GPT-4, BloombergGPT et al**.

### 2.1 ChatGPT / GPT-4 (zero-shot via API)

- **공정성 ✅**: 같은 prompt template (FIT 의 instruction template) 로 zero-shot 평가.
- **공정성 ⚠️**: prompt template 자체가 FinMA 의 학습 데이터에서 유래 → ChatGPT/GPT-4 에게는 unseen prompt. fair-ish but prompt-engineering 으로 GPT-4 를 더 끌어올릴 여지.
- **공정성 ⚠️**: ChatGPT 의 API 응답이 시간에 따라 변경 (OpenAI 의 모델 업데이트) → reproducibility 어려움. PIXIU 가 정확한 API version + 평가 일자를 README 에서 명시했는지 본 환경에서 단정 불가.

### 2.2 BloombergGPT (비공개, 자기-보고 수치)

- **공정성 ❌**: PIXIU 가 직접 BloombergGPT 를 평가한 게 아니라 Wu et al. 2023 BloombergGPT 논문의 자기-보고 수치를 재인용. 같은 평가 split 인지, 같은 metric 인지 확실치 않음.
- **이게 PIXIU 평가 비교의 가장 약한 부분**. BloombergGPT 와의 "공정한 비교" 라는 표현은 strictly speaking 부정확.

### 2.3 LLaMA (base)

- **공정성 ✅**: FinMA 의 직접 base. zero-shot 으로 평가하면 fine-tuning 의 marginal 효과를 깔끔히 isolate 가능. 단 LLaMA-7B 의 instruction-following 능력 자체가 약해서 (instruction tuning 안 된 base model) zero-shot 성능이 너무 낮을 가능성 → comparison 의 정보가치 제한.

### 2.4 다른 financial LLM (FinBERT, FinT5)

README "FinBen 2.0" 절 도입부의 "et al" 부분에 다른 모델 명시 가능성 있으나 README 표에 정확한 목록 없음. PDF 본문 §experiments 의 Table 1 또는 Table 2 에서 확정 가능 — 본 환경 차단.

## 3. 지표 선택의 정당성 — 다른 metric 이었다면 결론이 바뀌었을까

### Stock movement prediction 에서 Accuracy vs MCC

- **Accuracy** 만 보면 dummy classifier ("항상 Rise") 가 60-70% 점수. FinMA 의 70% 가 dummy 와 차이 작아 보임.
- **MCC** 는 class imbalance 에 강건 — 같은 70% Accuracy 가 MCC −0.05 (실은 운빨) 인지 +0.30 (의미있는 신호) 인지 구별. README "Predefined task metrics" 표에 MCC 명시 → PIXIU 가 이 함정을 의식하고 metric 표준에 포함.
- **결론 가능성**: Accuracy-only 평가였으면 FinMA-7B-full 의 stock prediction 우수성이 less convincing. MCC 로 인해 (만약 본문 표에 MCC 가 양수면) 결과의 robustness 강화.

### Summarization 에서 Rouge vs BARTScore

- **Rouge** 는 N-gram overlap → reference 와 표현 다르면 underestimate. "The company reported $2.5M profit" vs "Profit of $2.5 million reported" → Rouge 낮음.
- **BARTScore** 는 BART likelihood 기반 → 의미적 유사도 → 동의 표현에 robust.
- 두 metric 함께 보고하면 (Rouge 낮은데 BARTScore 높으면) "표현은 다르지만 의미는 맞음" 판별 가능. **이 dual reporting 이 LLM evaluation 의 sophistication**.

### Classification 에서 Missing Ratio

- **Missing Ratio** = LLM 이 옵션 (positive/negative/neutral) 중 하나도 출력 안 한 비율.
- ChatGPT/GPT-4 zero-shot 은 종종 "I cannot determine sentiment from this short text..." 출력 → Missing Ratio 큼.
- FinMA fine-tuned 는 강제로 옵션 출력하도록 학습 → Missing Ratio 작음.
- **이게 fine-tuning 의 hidden value** — sentiment 정확도뿐 아니라 "결정 회피 안 함" 자체가 도메인 응용 가치. Missing Ratio metric 의 도입이 이를 가시화.

## 4. 주요 표·그림 — 본 환경에서 확정 가능한 정성 결론

### 4.1 README "FinBen 2.0" 절 도입부의 정성 주장

> "we provide a detailed performance analysis of FinMA compared to other leading models, including ChatGPT, GPT-4, and BloombergGPT et al."

PDF 본문 Table 1 (또는 2) 가 8-task × N-baseline 의 metric 표 형태일 것으로 추정. 본 환경에서 정확한 수치 단정 불가.

### 4.2 본 환경에서 확정 가능한 정성 결론

검색 verbatim 인덱스 + README 의 "Open Financial LLM Leaderboard" 링크 + 후속 FinBen NeurIPS 2024 의 PIXIU 인용 정성 요약:
- FinMA-7B-full 이 **sentiment + headline classification + NER** 에서 ChatGPT 수준 또는 상회. 도메인 fine-tuning 의 정당화.
- FinMA 가 **FinQA / ConvFinQA** 같은 numerical reasoning 에서는 GPT-4 대비 격차 잔존. 7B 의 reasoning 한계.
- **Stock movement prediction** 은 모든 LLM (FinMA, ChatGPT, GPT-4) 이 random baseline (50%) 보다 marginal — Tan et al. 2024 (NeurIPS 2024 Spotlight, 2026-06-17 cover) 의 "LLM 이 TS forecasting 에 의미있는 가치 없음" 결과와 정합.

**원문에 수치 미보고** (본 환경 PDF 차단): 정확한 Accuracy / F1 / MCC 수치, baseline 별 표준편차, seed 통계.

## 5. Ablation — 저자가 일부러 넣은 것과 숨긴 것

### 5.1 명시적 ablation (3-변형의 사전 디자인)

FinMA-7B vs FinMA-7B-full vs FinMA-30B 의 3-변형 자체가 **3-축 ablation 디자인**:
- 7B vs 7B-full: NLP-only vs full FIT 의 효과
- 7B vs 30B: 모델 크기 효과
- 7B-full vs ChatGPT/GPT-4: 도메인 fine-tuning vs general-purpose API

### 5.2 숨겨진 (또는 미공개) ablation

- **Instruction multiplier ablation 부재**. FPB ×10 augmentation 의 효과 vs FPB ×1 baseline 비교 없음 (추정). ×10 이 성능에 기여하는지 vs noise 만 증가시키는지 확정 불가.
- **5-카테고리 마이너스 1 ablation 부재**. "stock prediction 만 빼고 학습" 또는 "QA 만 빼고 학습" 의 ablation 으로 cross-task generalization 검증할 수 있는데, README 에 명시 부재.
- **Prompt template ablation 부재**. Domain expert designed prompt 가 정말 일반 prompt 보다 좋은지 검증 부재.

## 6. 부록의 숨은 신호 — 본 환경에서 추정 가능한 항목

PDF Appendix 본문 차단으로 단정 불가하지만, NeurIPS D&B Track 의 일반 publication 관행상 Appendix 에 포함될 가능성 높은 항목:
- Hyperparameter 정확한 값 (lr, batch, epoch, optimizer)
- 각 baseline 별 정확한 prompt template (ChatGPT zero-shot 평가의 정확한 prompt)
- 평가 일자 (ChatGPT API 의 model version 동결을 위한)
- Few-shot 평가 결과 (zero-shot 외 1-shot, 5-shot)
- 모델 학습 시간 + GPU 시간 + carbon footprint
- 각 데이터셋의 정확한 train/val/test split 좌표

## 7. 수치 투명성

**본 환경에서 확정 불가 → 추정 표기 금지**. 본 작성에서 단정한 모든 수치는 README "FIT — Dataset Statistics" 표 verbatim (raw + instruction 수). 그 외 정확한 평가 점수, baseline 비교 수치는 PDF 본문 § Experiments 의 표에서 확인 필요 — 본 환경 차단으로 단정 안 함.
