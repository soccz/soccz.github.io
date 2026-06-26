# 07. 가정·한계·반박

> 배경 사다리: 이 절은 ① 본 PIXIU 가 알고리즘이 아닌 **인프라 contribution** 이라는 점, ② NeurIPS D&B Track 의 채점 기준이 일반 main track 의 "novel algorithm" 과 다르고 "open resource quality" 가 우선이라는 점, ③ 그렇기에 한계 분석도 알고리즘 측의 잘잘못보다 **데이터/벤치마크 디자인의 함정** 에 집중해야 한다는 점을 알면 따라온다.

## 1. 명시된 가정 (논문이 대놓고 말한 것)

### 가정 1. LLaMA base 의 일반 언어 능력은 fine-tuning 후에도 유지됨

FinMA 가 LLaMA 위에 instruction tune 되는 한, LLaMA 의 pre-training 으로 학습된 일반 언어 능력 (문법, 상식, 추론) 은 도메인 fine-tuning 후에도 유지된다는 암묵적 가정. 검증: README 의 비교 표에서 FinMA 가 일반 NLP 능력 측정 task (e.g., 일반 GLUE 의 SST-2 sentiment) 평가 결과는 안 보고됨 — 즉 **이 가정의 직접 검증은 PIXIU 가 안 했다**.

### 가정 2. FIT 의 instruction multiplier (×10 augmentation) 가 학습에 도움

FPB / FiQA-SA / NER 만 ×10 으로 prompt 변형 augmentation. 나머지 ×1. 이 비대칭이 학습에 도움이 된다는 가정. ablation 부재로 검증 안 됨.

### 가정 3. 8 task / 15 dataset 이 금융 LLM 의 representative coverage

FLARE 의 task 선택이 금융 도메인을 대표한다는 가정. credit scoring, ESG, fraud detection, regulatory compliance, derivatives pricing, option chain analysis 등 본 PIXIU 에 빠진 영역이 많음 (후속 FinBen 2.0 에서 일부 추가).

### 가정 4. 자동 평가의 reliability

EleutherAI lm-evaluation-harness 의 자동 평가가 인간 평가와 유사한 ranking 을 준다는 가정. README "Automated Task Assessment" 절에서 NER zero-shot 의 underestimation 을 명시 인정 — **부분 자기-부정**.

## 2. 암묵적 가정 (말 안 했지만 깔려 있는 것)

### 암묵 가정 1. **데이터 누출 (leakage) 의 부재**

LLaMA pre-training 코퍼스 (Common Crawl + GitHub + Wikipedia + Books + ArXiv) 가 FPB (2014), FiQA-SA (2018), ACL18 (2018), FinQA (2021) 등의 데이터를 포함했을 가능성. **본 PIXIU 가 leakage 검증을 수행했는지 README 에서 명시 부재**.

이게 정량적으로 측정 가능한 가설:
- LLaMA-7B 의 zero-shot 평가에서 FPB / ACL18 의 raw 문장이 prompt 의 입력으로 들어갔을 때 base LM 의 perplexity 가 비도메인 corpus 보다 낮은가? 만약 그렇다면 leakage 의 강한 증거.
- **본 환경에서 검증 불가**. 후속 follow-up 으로 가치 있는 실험.

### 암묵 가정 2. **Tweets sentiment 와 주가 방향의 인과 관계**

ACL18 / BigData22 / CIKM18 모두 (tweets, 가격 시계열) → Rise/Fall 예측. 이게 의미있으려면 **tweets 의 정보가 가격에 인과적으로 선행** 해야 한다. 그러나 시장미시구조 연구는 (Tetlock 2007, Heston-Sinha 2017 등) tweets sentiment 의 가격 예측력이 매우 weak 하고 짧은 horizon (분~시) 에서만 효과적임을 보여줌. **일별 단위 stock movement prediction 의 학습 신호 자체가 noise-dominant** 일 가능성.

검증: ACL18 의 Random baseline (전부 Rise 출력) 정확도가 60%+ 라면 (bull market) 그 위 marginal 만 의미. README "FinBen 2.0" 절의 정성 비교는 specific 수치 미공개.

### 암묵 가정 3. **금융 task 의 평가가 NLP task 의 평가와 동일한 metric 으로 비교 가능**

Accuracy 70% 가 sentiment 분류에서는 강력하지만, 주가 방향 예측에서는 random walk + autocorrelation 결합으로 60%+ baseline 가 trivial. 같은 70% Accuracy 가 두 task 에서 완전히 다른 의미. **PIXIU 는 metric 자체는 task 카테고리 별로 분리했지만, "across-task aggregated leaderboard score" 는 의미적 정합성 없음** — 이게 lm-evaluation-harness 기반 leaderboard 의 일반적 함정.

### 암묵 가정 4. **Instruction tuning 이 catastrophic forgetting 을 일으키지 않음**

FIT 의 9-dataset 으로 fine-tune 한 후, LLaMA 의 일반 언어 능력이 손실되지 않았다는 가정. 일반적으로 small-scale (< 1M) instruction tuning 은 forgetting 약하지만, 본 PIXIU 의 7B-full (136K instruction) 의 경우 도메인 vocabulary 학습이 일반 영역 vocabulary 표현을 displace 했을 가능성. **검증 부재**.

### 암묵 가정 5. **MIT 라이선스 모델의 상업 활용 적격성**

PIXIU code 는 MIT, FinMA 가중치는 별도 라이선스 (LLaMA 1 의 학술 비상업적 라이선스). FIT 데이터의 sub-dataset license (FOMC = CC BY-NC, FinArg-ECC = CC BY-NC-SA) 가 **NC (non-commercial)** 포함. 즉 **FinMA-7B-full 의 상업 활용은 라이선스 충돌**. 본 README "Disclaimer" 절은 academic use only 명시하지만, 라이선스 측면의 상업적 활용 한계는 명시 부재.

## 3. 반박 가능한 지점 (최소 2개)

### 반박 1. "PIXIU 의 stock movement prediction 평가는 efficient market hypothesis 와 충돌. LLM 이 trivial baseline 보다 잘 못 하는 게 당연하므로, 본 평가의 정보가치 자체가 의문"

**반박 핵심**. 만약 LLM 모두 (FinMA, ChatGPT, GPT-4) 가 60-65% Accuracy 로 비슷하다면, 그건 "모두 똑같이 못 한다" 는 결론. **차이가 noise floor 안에 묻혀 metric 으로 모델을 ranking 할 의미가 사라짐**. 그럼에도 leaderboard 에 stock prediction 점수를 올려놓는 것은 "벤치마크가 진짜 정보를 주는가" 의 질문에 의문.

**검증 실험**.
1. ACL18 위에서 simple baseline (logistic regression on hand-crafted features: 5-day MA, 5-day volatility, tweet count, tweet sentiment polarity) vs FinMA-7B-full vs GPT-4 의 head-to-head.
2. Same-day baseline (Rise/Fall 50/50 random) 의 분포와 모델 점수 분포의 statistical significance test.
3. Profit-and-Loss 평가: predicted Rise/Fall 로 단순 long-short 전략 backtest. metric: Sharpe ratio.

**가능 결과**. (a) LLM 들이 hand-crafted baseline 보다 못 함 → 본 평가가 정보가치 없음 (Tan et al. 2024 결과와 정합). (b) FinMA-7B-full 만 hand-crafted baseline 초과 → instruction tuning 의 진짜 가치. (c) GPT-4 가 best → 도메인 fine-tuning 의 필요성 의문.

### 반박 2. "PIXIU 의 모든 NLP task 가 영어만. 금융은 본질적으로 multi-lingual + multi-region 시장이라, 영어 전용 벤치마크는 generalist financial AI 의 substrate 가 될 수 없음"

**반박 핵심**. 일본·중국·EU·EM 의 금융 시장이 PIXIU 평가에 부재. 한 회사가 일본 주식 시장에 진출할 때 PIXIU 점수가 의미가 적음. (단 PIXIU 의 후속 *No Language is an Island* (Xie et al. 2024) 와 *Dólares or Dollars?* (Xie et al. 2024) 가 이 한계를 부분적으로 해소.)

**검증 실험**.
1. FinMA-7B-full 를 일본어 어닝 콜 transcript (Tanaka Asset Management, Goldman Sachs Japan reports) 에 zero-shot 평가.
2. 중국어 A-share Stock movement prediction (cn_alpha158, MASTER paper 의 데이터) 평가.
3. multi-lingual instruction tuning 의 marginal value 측정 (영어 only vs +일본어 vs +중국어).

**가능 결과**. (a) 일본어/중국어 평가에서 FinMA 가 LLaMA base 보다도 못함 → 영어-only fine-tuning 의 negative transfer. (b) GPT-4 가 multi-lingual 에서 가장 강함 → 사전학습 다국어 코퍼스가 도메인 fine-tuning 보다 더 중요.

### 반박 3 (보너스). "PIXIU 의 자동 평가는 형식 매칭 (regex pattern) 에 과의존. LLM 의 일관된 형식 출력 능력 자체를 측정하는 셈이라, 실제 추론 능력의 ranking 과 다를 수 있음"

README "Automated Task Assessment" 절의 NER zero-shot underestimation 자기-인정이 이 반박의 강한 근거. 더 나아가:
- 모든 분류 task 에서 "옵션 키워드 (positive/negative/neutral) 가 응답에 포함됐는가" 의 regex 매칭 → "neutral, given the financial context..." 같은 응답이 "neutral" 로 잡힐 수도, 못 잡힐 수도 (regex 디자인 의존).
- 본 PIXIU 의 자동 평가 코드가 정확히 어떤 regex 를 쓰는지 README 에서 명시 부재. 본 환경에서 코드 직접 확인 가능하나 본 절 작성에서는 단정 안 함.

## 4. 재현성 평가

### Strong (재현 잘 됨):
- ✅ **코드**: GitHub The-FinAI/PIXIU MIT 라이선스.
- ✅ **모델**: HuggingFace TheFinAI/finma-7b-nlp, TheFinAI/finma-7b-full 직접 다운로드 가능.
- ✅ **데이터**: HuggingFace TheFinAI/english-evaluation-dataset-… 컬렉션 + 9-dataset 출처 표 명시.
- ✅ **평가 harness**: EleutherAI lm-evaluation-harness 호환 `eval.py` 한 줄 명령.
- ✅ **Docker image**: tothemoon/pixiu:latest pre-built.

### Weak (재현 어려움):
- ⚠️ **Training hyperparameter**: README 에 명시 부재. PDF 본문 §FinMA training 또는 Appendix 에서만 확인 가능.
- ⚠️ **30B 모델**: HuggingFace 에 공개 안 됨. FinMA-30B 결과 재현 불가.
- ⚠️ **API baseline 의 OpenAI model version snapshot**: ChatGPT/GPT-4 의 정확한 평가 일자, model version (gpt-3.5-turbo-0301 vs -0613 등) 미명시. 평가 시점에 따라 baseline 점수 변동.
- ⚠️ **평균만 보고 vs 분산 보고**: 본 환경 차단으로 단정 불가. NeurIPS D&B Track 의 일반 관행상 평균만 보고됐을 가능성 (단일 inference 의 deterministic 결과라면 분산 무의미).

### 종합 재현성 점수
**8/10**. 코드·모델·데이터·harness 의 4-요소 모두 공개로 인프라 재현은 최상위급. Hyperparameter 미명시와 30B 모델 부재만 빼면 거의 완벽. NeurIPS 2023 D&B Track 통과의 결정적 이유.
