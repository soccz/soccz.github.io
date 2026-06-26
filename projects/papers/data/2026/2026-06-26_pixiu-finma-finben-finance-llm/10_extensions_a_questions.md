# 10a. 사고 확장 — 자문 질문 5개

> 배경 사다리: 이 절은 본 PIXIU 의 결과를 받아들인 후 던질 만한 5개의 sharp question. 각 질문은 ① 본 PIXIU 가 답하지 않은 (또는 부분적으로만 답한) 부분, ② 본 사용자 (석사) 가 1-2 학기 내에 검증 가능한 scope, ③ 후속 paper 의 motivation 으로 활용 가능한 형태를 갖춘다.

## 질문 1. **136K instruction 의 카테고리 분포 unbalance 가 FinMA 의 zero-shot transfer 에 어떻게 작용하는가?**

**왜 이 질문이 중요한가**. PIXIU 의 FIT 가 FPB ×10 (48,450 인스트럭션, 전체의 35%) + ACL18 ×1 (27,053, 전체의 20%) 의 2-dataset 이 55% 차지. 일반적으로 instruction tuning 의 catastrophic forgetting 은 dominant category 가 minority category 를 displace 하는 동학으로 진행. **FinMA-7B-full 이 ECTSUM (요약) / NER (5%) / ConvFinQA (3%) 같은 minority task 에서 LLaMA-7B base 보다 오히려 못할 가능성**.

**연결**. 사용자 §A (Grokking - delayed generalization) 의 phase transition 동학과 직접 연결. Instruction tuning 의 phase transition (minority task 가 언제 emerge 하는가) 측정은 grokking 의 fine-tuning 확장 version. NeurIPS 2027 Grokking-in-TS-Transformers 의 §extensions 후보.

**검증 방법** (대략). FinMA 의 동일 학습 recipe 로 5가지 다른 carrier mixture 학습 (uniform / FPB-dominant / ACL18-dominant / per-category-balanced / inverse-frequency-weighted). 각각 8-task evaluation 비교. 시간 비용 ~2주 (8 GPU-hours × 5 mixtures × 평가 1-day).

## 질문 2. **FinMA-7B-full 의 stock prediction 정확도가 Tan 2024 의 "LLM-for-TS 무용론" 과 어떻게 정합·충돌하는가?**

**왜 이 질문이 중요한가**. PIXIU 가 stock movement prediction 을 벤치마크의 정식 일원으로 포함 + FinMA-7B-full 이 ChatGPT/GPT-4 보다 우수하다 주장 (정성적). Tan 2024 (NeurIPS 2024 Spotlight) 는 동일 시계열 영역에서 "LLM 백본은 가치 없음, simple PAttn baseline 이 충분" 주장. **둘은 같은 데이터셋 (BigData22/ACL18/CIKM18 vs ETTh/Weather/Illness) 이 아니지만, 영역적으로 같은 LLM-for-TS 질문**.

**연결**. 사용자 P1 ProTran-TFA 의 finance venue 통과 path 의 critical question. 만약 LLM 이 stock prediction 에 의미있다면 P1 의 contribution 이 가치 감소. 만약 LLM 이 의미없다면 P1 의 TS-specific architecture 의 가치 증명.

**검증 방법**. FinMA-7B-full + GPT-4 + ProTran-TFA + simple LSTM + 5-day MA logistic regression baseline 의 ACL18 head-to-head. 동일 split + 동일 metric (Accuracy + MCC + Sharpe-on-PnL). 시간 비용 ~1개월 (P1 ProTran-TFA 재가동 + 비교 실험 + 분석).

## 질문 3. **Instruction tuning 후 LLaMA 의 attention head 분포가 어떻게 재조직되는가 — APF 관점에서 측정 가능한가?**

**왜 이 질문이 중요한가**. APF 의 핵심 가설은 "PE × motif 매핑이 architecture-determined". 그러나 instruction tuning 으로 attention 분포가 재배치된다면, **fine-tuning-induced motif** 가 새로운 type 으로 출현 가능. 본 PIXIU 가 LLaMA-7B → FinMA-7B-nlp → FinMA-7B-full 의 3-step 분리 모델을 공개해놨기에, **3-snapshot attention motif 비교** 가 직접 가능.

**연결**. 사용자 APF main paper 의 §extensions 후보. PE × motif × **fine-tuning level** 의 3-축 확장. 본 사용자 NeurIPS 2027 또는 ICLR 2028 의 directly actionable follow-up.

**검증 방법**. (a) HuggingFace 에서 LLaMA-7B, FinMA-7B-nlp, FinMA-7B-full 다운로드. (b) FIT/FLARE 의 평가 prompt 100-200개 입력 시 32-layer × 32-head 의 attention pattern 추출. (c) APF motif classifier (diagonal/stripe/block/edge/spike/checker) 로 head별 motif 분류. (d) 3-snapshot 간 motif 분포 차이 측정 + statistical significance. 시간 비용 ~3주.

## 질문 4. **시계열 직렬화 방식 (numerical / decorated / chunked / image) 이 stock prediction 정확도에 어떤 영향을 미치는가?**

**왜 이 질문이 중요한가**. PIXIU 의 stock prediction prompt template 이 "Analyze the information and social media posts to determine if the closing price of {tid} will ascend or descend at {point}." 같은 high-level 만. 실제 가격 시계열의 직렬화 방식 (e.g., "Day-1: 152.3 153.1 ..." CSV-like vs 자연어 풀이 "The stock closed at $152.3 on Day-1, then $153.1 on Day-2 (+0.5%)..." vs special-token chunking vs VisionTS-style image patch) 의 비교 실험은 PIXIU 본문에서 명시 부재. **이 비교 자체가 LLM-for-TS forecasting 의 핵심 design choice**.

**연결**. 사용자 VisionTS (2026-06-10 cover) 의 image-as-TS 정신을 LLM context 안의 TS 표현으로 확장. 사용자 보유 GAF/MTF (2026-06-24 cover) 의 polar 좌표 인코딩도 후보.

**검증 방법**. ACL18 stock prediction subset (5,000 샘플) 위에서 4-direct 직렬화 방식 × FinMA-7B-base 의 평가. Metric: Accuracy + MCC. 시간 비용 ~2주 (각 직렬화 방식의 prompt template 작성 + inference 1 GPU-day × 4 + 분석).

## 질문 5. **PIXIU 의 8-task / 15-dataset 벤치마크가 한국 시장 (KOSPI200, KRX) 의 NLP/예측 작업에 transfer 되는가?**

**왜 이 질문이 중요한가**. 사용자 진로 (석사 졸업 후 퀀트 / 차트 분석 industry, 한국 시장 중심) 의 현실적 contribution. PIXIU 가 영어 전용 + 미국 시장 중심. 한국 시장의 (다음공시 NER, 한국 증권사 리포트 sentiment, KOSPI200 종목 movement prediction) 에서 FinMA-7B-full 의 zero-shot 성능. 만약 한국 시장에서 LLM transfer 가 잘 안 된다면 → 한국 시장 특화 instruction tuning 의 directly actionable contribution.

**연결**. 사용자 P1 ProTran-TFA 가 GSPC/IXIC (미국) 위주 → 한국 시장 확장 가능. 한국어 KoFinBERT (이전 작업) + PIXIU prompt template 의 한국어 번역 → KoFinMA 의 가능성.

**검증 방법** (대략). (a) 다음공시 (DART) 의 한국어 어닝 콜 transcript 100개 수집. (b) PIXIU prompt template 의 한국어 번역. (c) FinMA-7B-full vs ChatGPT vs GPT-4 zero-shot 평가. (d) 한국어 instruction tuning 의 marginal value 측정. 시간 비용 ~1-2개월 (데이터 수집이 가장 시간 소요).

## 6. 5 질문의 우선순위 — 본 사용자 timeline

| 우선순위 | 질문 | 사용자 main candidate 연결 | 1-2 학기 timeline 가능 |
|---|---|---|---|
| **1순위** | Q3 (APF + instruction tuning attention) | 🟢 APF 직접 substrate | ✅ 3주 |
| **2순위** | Q2 (Tan 2024 vs PIXIU 정합) | P1 ProTran-TFA paused → finance venue | ✅ 1개월 |
| **3순위** | Q4 (시계열 직렬화 방식 ablation) | VisionTS + GAF/MTF 연결 | ✅ 2주 |
| **4순위** | Q5 (한국 시장 transfer) | 사용자 진로 직접 | ⚠️ 1-2개월 (데이터 수집 시간) |
| **5순위** | Q1 (instruction mixture catastrophic forgetting) | §A grokking 확장 | ⚠️ 2주 (compute 비용) |

가장 sharp 한 follow-up paper 후보는 **Q3** — APF main paper 의 §5 extensions 또는 별도 short paper 로. NeurIPS 2027 Grokking-in-TS-Transformers 의 §2 Related Work 에 PIXIU 인용 포함 가능.
