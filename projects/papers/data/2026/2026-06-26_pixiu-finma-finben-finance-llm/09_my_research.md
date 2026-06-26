# 09. 내 연구와의 연결

> 배경 사다리: 본 PIXIU 는 사용자의 두 active main candidate (APF, Grokking-in-TS-Transformers) 에 **직접 substrate 가 아니다**. 그러나 paused P1 ProTran-TFA, shelved AETHER, 그리고 §F 원거리 axis 의 전이 가능성에서 **명확한 연결점**이 있다. 본 절은 일반론 ("이 논문은 시계열에 참고 가능") 을 금지하고, 구체적 mechanism / 수식 요소 / 논문 섹션 매핑으로 연결.

## 1. 본 PIXIU 와 사용자 §A~F 의 4-축 점검

| §  | 영역 | PIXIU 와의 연결 강도 | 연결 mechanism |
|---|---|---|---|
| §A | Grokking / Delayed generalization | **약함 (전이 가능성만)** | Instruction tuning 의 phase transition 측정 가능성 (후속 §A 후보) |
| §B | Mech interp / Circuit analysis | **약함 (전이 가능성만)** | FinMA 의 attention 분포 변화 mech interp (후속 §B 후보) |
| §C | Attention as Explanation / PE | **매우 약함** | 직접 매칭 없음 |
| §D | TS Transformers / TSFM | **중간** | Stock prediction 의 multimodal TS-text |
| §E | 금융 시계열 응용 | **강함 (직접 substrate)** | P1 ProTran-TFA 의 finance venue 표준 벤치마크 |
| §F | 원거리 - llm-finance | **매우 강함 (정확 매칭)** | 본 PIXIU 가 §F 의 llm-finance 분기점 자체 |

**연결 강도 최상위 3축**: §F (llm-finance 원거리), §E (P1 ProTran-TFA), §D (TS-text multimodal). 아래 각 축으로 구체화.

## 2. 흡수할 기법 — 어느 수식/방법을 어디에 쓸지

### 흡수 1: FIT 의 instruction format → P1 ProTran-TFA 의 finance venue 재개 시 instruction-form 평가

**현재 상태** (`_profile.md` 의 paused list): "P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/`) — finance venue (IJF/QF) 가능".

**흡수 mechanism**.
- P1 의 핵심 contribution 은 probabilistic Transformer 의 quantile/CVaR loss 확장. **금융 venue (IJF, Quantitative Finance) 의 리뷰어가 reasonable 한 비교 baseline 으로 즉시 요구할 표준 벤치마크가 PIXIU 의 FLARE 의 stock prediction subset**.
- 구체적 사용: P1 의 ProTran-TFA 가 BigData22/ACL18/CIKM18 의 Stock movement prediction task 에서 FinMA-7B-full / GPT-4 / BloombergGPT (자기-보고 수치) 와 비교. 만약 ProTran-TFA 가 LLM-based 모델보다 우수면 "TS-specific architecture 의 가치" 의 강한 증거.
- 인용 포인트: P1 §5 (Experiments) 의 첫 paragraph 에 "We follow the FLARE benchmark (Xie et al. 2023 [PIXIU]) for stock movement prediction, including BigData22, ACL18, CIKM18 datasets, with the corresponding Accuracy and MCC metrics." 형태.

**기대 효과**. P1 의 finance venue 통과 가능성을 직접 높임. Reviewer 가 "왜 LLM baseline 안 봤냐" 라고 묻는 reject path 차단.

### 흡수 2: 9-종 평가 metric 의 dual reporting → 본 사용자 모든 paper 에 적용

**현재 상태**. 사용자 paper draft 들 (Paper 1~4, APF, Grokking) 의 evaluation 절들이 metric 1-2개로 단순 보고 경향.

**흡수 mechanism**.
- PIXIU "Predefined task metrics" 표의 dual reporting 원칙 (Accuracy + F1, Rouge + BARTScore, Acc + Missing Ratio + MCC) 을 standard 로 채택.
- 특히 **Missing Ratio metric** 의 도입: LLM/Generative model 평가 시 "라벨 안 골랐다" 비율을 명시 측정. APF 의 motif 분류, Grokking 의 phase 판정 등 LLM-output 형식 평가에 적용 가능.
- MCC 도입: imbalanced class (Grokking 의 phase 1/2/3/4 분류) 의 robust metric.

**기대 효과**. Paper 의 evaluation 깊이 향상. Reviewer 의 "evaluation 가벼움" 비판 차단.

### 흡수 3: README "Disclaimer" 의 academic-use-only 면책 → 사용자 fin 논문에 동일 도입

**현재 상태**. 사용자 P1 ProTran-TFA 가 finance venue 진출 시, "이게 실거래 권장이냐" 의 윤리적 질문 받을 가능성.

**흡수 mechanism**. PIXIU README "Disclaimer" 절 verbatim: "This repository and its contents are provided for academic and educational purposes only. None of the material constitutes financial, legal, or investment advice." → P1 의 GitHub repo + 논문 결론에 동일 disclaimer 표기.

**기대 효과**. Compliance + 윤리적 진입 장벽 감소.

## 3. 충돌·경쟁 지점 — 사용자 주장과 부딪힐 부분

### 충돌 1: Tan 2024 (NeurIPS 2024 Spotlight, 2026-06-17 cover) 결과와 PIXIU 의 stock prediction 평가

**부딪힘**. Tan 2024 의 결론은 "LLM 백본이 TS forecasting 에 의미있는 가치 없음" — 즉 PIXIU 의 stock prediction task 위에서 FinMA-7B-full 의 정성적 우수성이 의심됨. 만약 PIXIU 본문 표가 FinMA-7B-full 의 stock prediction 우수성을 주장한다면, Tan 2024 와 직접 충돌.

**해결 mechanism**.
- 사용자가 본 PIXIU 를 인용할 때 "stock prediction 의 marginal 결과는 Tan 2024 의 LLM-for-TS forecasting negative result 와 정합" 으로 dual citation. 즉 PIXIU 의 인프라 contribution 은 인정 + stock prediction 의 specific 결과는 신중하게.
- 사용자의 P1 ProTran-TFA 위 비교 실험 자체가 이 충돌 해소의 직접 evidence. ProTran-TFA (TS-specific) 가 FinMA-7B-full (LLM-based) 보다 우수면 사용자 paper 의 contribution 강화 + Tan 2024 와 정합.

### 충돌 2: APF 의 Attention pattern fields theory 와 instruction tuning 의 attention 재배치

**부딪힘**. APF 의 핵심 가설은 "PE 종류 (NoPE/sinusoidal/learned/RoPE/ALiBi) 와 motif (diagonal/stripe/block/edge/spike/checker) 의 매핑이 architecture-determined". Instruction tuning 으로 LLM 의 attention 분포가 어떻게 재배치되는지는 APF 가 다루지 않은 영역 — instruction tuning 이 motif 자체를 재구성할 수 있다는 가설이라면 APF 의 정적 theory 와 충돌.

**해결 mechanism**. APF 의 이론을 "pre-training-induced motif" 와 "fine-tuning-induced motif" 로 dual-level 확장. PIXIU 가 제공하는 FinMA-7B-{nlp, full} 의 attention 분포를 LLaMA-7B base 와 비교 → instruction-tuning marginal motif. APF 의 후속 paper 의 §5 (extensions) 에 정식 일원화.

## 4. 인용 포인트 — 사용자 paper 어느 섹션에 어떤 문장으로

### 인용 1: APF main paper §1 Introduction 의 motivation paragraph

"Recent benchmarks for domain-tuned LLMs (Xie et al. 2023 [PIXIU]; Xie et al. 2024 [FinBen]) demonstrate that instruction-tuning a 7B base model on ~136K domain instructions yields measurable downstream gains in NLP tasks. Our work asks: *how do these gains correlate with re-structured attention motifs?* — a question orthogonal to but complementary to the benchmark line."

### 인용 2: P1 ProTran-TFA main paper §5 Experimental setup

"For stock movement prediction, we follow the FLARE benchmark protocol of Xie et al. 2023 (PIXIU, NeurIPS 2023 D&B), evaluating on BigData22 [Soun 2022], ACL18 [Xu & Cohen 2018], and CIKM18 [Wu 2018] datasets with Accuracy and MCC metrics. We compare ProTran-TFA against (i) FinMA-7B-full [Xie 2023, instruction-tuned LLaMA], (ii) GPT-4 zero-shot via OpenAI API (gpt-4-0613, evaluated 2026-XX-XX), and (iii) a hand-crafted feature baseline (5-day MA + 5-day volatility + tweet sentiment polarity → logistic regression)."

### 인용 3: Grokking-in-TS-Transformers paper §2 Related Work

"While our focus is on grokking in TS transformers, the broader question of *how instruction-tuning interacts with phase-transition dynamics* remains open. Domain instruction-tuned models (PIXIU [Xie 2023]; FinBen [Xie 2024]) exhibit characteristic grokking-like trajectories during fine-tuning (empirical observation in our preliminary experiments) — we leave systematic investigation for future work."

### 인용 4: AETHER (shelved, 재개 시) §2 Background

"The (tweets, price) multimodal stock-prediction substrate established by FLARE (PIXIU [Xie 2023]: BigData22, ACL18, CIKM18) provides a direct precedent for our crypto-cycle prediction setting. We extend this paradigm by (i) replacing daily prices with intra-day OHLCV + funding rate + open-interest time-series, (ii) substituting US stock Twitter feeds with crypto-specific X/Reddit/Discord feeds, and (iii) replacing binary Rise/Fall with multi-class cycle-phase labels (accumulation/markup/distribution/markdown)."

## 5. 반면교사 — 본 PIXIU 가 못 한 것을 어떻게 다룰지

### 반면교사 1: 시계열 직렬화의 명시 부재

PIXIU 가 stock prediction prompt template 의 "가격 시계열을 텍스트로 어떻게 인코딩하는가" 를 README 에서 단정 안 함. 본 사용자가 비슷한 multimodal TS-text 작업을 할 때 **정확한 직렬화 방식 명시 + ablation** 으로 더 sharp 한 contribution 가능. 직렬화 방식 후보:
- (i) numerical: "Day-1: 152.3 153.1 ... \\n Day-2: ..." (CSV-like)
- (ii) decorated: "Day-1 closed at $152.3, up 0.5% from previous..." (자연어 풀이)
- (iii) chunked: "[<TS_START>0.512 0.523 0.518 ...<TS_END>]" (special token)
- (iv) image: VisionTS-style 의 ImageNet MAE patch embedding

각 후보의 ablation 으로 multimodal TS-text 의 directly representation 최적점 발견 → 본 사용자 paper 의 sharp 한 contribution.

### 반면교사 2: Class imbalance 의 정량 분석 부재

PIXIU 의 FIT 가 FPB-×10 (35%) + ACL18-×1 (20%) + 나머지 의 imbalanced 분포. **catastrophic forgetting 분석 부재**. 사용자가 instruction tuning 작업 시 (e.g., FinMA-style 도메인 추가 학습), category 별 sample weight 조정 + per-category test loss 추적 + early-stopping per-category 의 standard recipe 도입.

### 반면교사 3: 시간 분포 변동 (concept drift) 에 대한 평가 부재

ACL18 (2014-2016) + BigData22 (2019-2022) 의 시간 범위 차이가 cross-period generalization 의 자연스러운 implicit test 이지만, PIXIU 가 이 cross-period 분석을 명시 안 함. 사용자 P1 ProTran-TFA 의 finance venue 진출 시 **explicit temporal split + walk-forward evaluation** 으로 시간 분포 변동 평가 추가 → reviewer 의 "테스트 set 이 학습 set 과 같은 시기 아니냐" 비판 차단.

## 6. 한 줄 결론

본 PIXIU 는 사용자 main candidate (APF, Grokking-in-TS-Transformers) 에 **직접 substrate 가 아니지만**, paused P1 ProTran-TFA 의 finance venue 진출 표준 벤치마크 + shelved AETHER 의 multimodal sentiment-price substrate + 9-metric dual reporting 의 evaluation 표준 + Disclaimer 면책 의 4-spec 으로 **사용자의 paused/shelved 자산 재가동의 직접 표준** 이 된다. 이 4-spec 으로 사용자 paper 의 reviewer-resistant 정합성 향상.
