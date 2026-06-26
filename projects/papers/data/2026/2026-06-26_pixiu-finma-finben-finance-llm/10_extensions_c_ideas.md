# 10c. 사고 확장 — 실험 아이디어 2개

> 배경 사다리: 각 실험은 (가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정) 의 6-component 으로 정의. 본 사용자 (석사) 가 1-2 학기 내 직접 진행 가능한 scope.

## 실험 아이디어 1. **"Instruction Tuning Induced Motif Drift" (APF + PIXIU 결합)**

### 가설

LLaMA-7B → FinMA-7B-nlp → FinMA-7B-full 의 3-step instruction tuning 으로 인해, LLaMA 의 attention head 분포가 APF 의 motif typology (diagonal / stripe / block / edge / spike / checker) 기준으로 **체계적 재배치** 된다. 특히:
- (H1) FinMA-7B-nlp 는 LLaMA-7B 보다 **block motif 비율 증가** (domain entity grouping).
- (H2) FinMA-7B-full 은 FinMA-7B-nlp 보다 **stripe motif 비율 증가** (stock prediction 의 시계열 trend 처리).
- (H3) 두 fine-tuning 단계 모두 **diagonal motif 비율 감소** (general next-token 의존 약화, task-specific 의존 강화).

### 데이터

- HuggingFace `meta-llama/Llama-2-7b-hf` (LLaMA-2 가 LLaMA-1 보다 접근 용이) 또는 `huggyllama/llama-7b` (LLaMA-1).
- HuggingFace `TheFinAI/finma-7b-nlp`, `TheFinAI/finma-7b-full`.
- FIT/FLARE 의 평가 prompt 200개 (8-task 각 25개 sample).

### 비교 조건

- 3-snapshot × 8-task × 32-layer × 32-head = 24,576 head-position 의 attention pattern.
- APF motif classifier (사용자 보유, CNN probe + 6-class softmax) 로 motif 분류.
- 3-snapshot 간 motif 분포 chi-square test + 효과 크기 (Cramér's V).
- Control: random baseline (각 snapshot 의 head 를 random shuffle 후 motif 분포).

### 예상 결과

- H1 부분 확인 가능성 70% — domain fine-tuning 으로 block motif 증가 일반적.
- H2 부분 확인 가능성 50% — stock prediction 의 시계열 처리가 stripe 와 직접 연결되는지는 불확실. 오히려 spike motif (event-driven attention) 증가 가능성도.
- H3 강한 확인 가능성 80% — instruction tuning 의 일반적 효과로 task-specific attention 증가.

### 반증 조건

- 만약 3-snapshot 간 motif 분포 차이가 chi-square p > 0.05 → instruction tuning 이 attention pattern 을 의미있게 변경 안 함. APF 의 architecture-determined 가설 강화.
- 만약 motif 분포 차이는 있지만 task 와 무관한 random drift → fine-tuning artifact.

### 비용 추정

- GPU 시간: A100 80GB × 3 days (3-snapshot inference + attention 추출).
- 분석 시간: 1주.
- 합: 3-4주.

### Contribution potential

- APF main paper 의 §5 extensions 또는 별도 short paper (4-page, NeurIPS 2027 workshop 또는 ICLR 2028).
- "PE × motif × **fine-tuning level**" 의 3-축 확장 — 사용자 APF 라인의 directly actionable follow-up.
- 사용자 가장 sharp 한 single-author paper 후보.

---

## 실험 아이디어 2. **"TS Serialization Ablation for LLM-based Stock Prediction"**

### 가설

PIXIU 의 stock prediction prompt template ("Analyze the information and social media posts to determine if the closing price of {tid} will ascend or descend at {point}.") 의 hidden choice 는 **가격 시계열의 직렬화 방식**. 직렬화 방식에 따라 stock prediction 정확도가 다음 순서로 우열을 보인다:
- (H1) Image (VisionTS-style MAE patch embedding) > Decorated (자연어 풀이) > Numerical (CSV-like) > Chunked (special token).
- (H2) Numerical 직렬화는 LLM 의 numerical reasoning weakness 로 인해 일관되게 낮은 정확도.
- (H3) Image 직렬화의 marginal value 는 도메인 (US stocks) 별로 다르고, 시계열 길이가 길수록 (60-day vs 5-day) 강해짐.

### 데이터

- ACL18 (Xu & Cohen 2018) stock movement prediction subset. 5,000 random samples from train/test split.
- 가격 시계열: 5-day, 20-day, 60-day 3-window 길이.
- 텍스트 (tweets): 동일 형식 유지.

### 4-Direct 직렬화 방식

1. **Numerical**: "Day-1: 152.3 153.1 154.0 151.8 \n Day-2: ..." (CSV-like)
2. **Decorated**: "The stock closed at $152.3 on Day-1, then rose to $153.1 on Day-2 (+0.5%), peaked at $154.0 on Day-3..." (자연어 풀이 + percentage delta)
3. **Chunked**: "[<TS_START>0.512 0.523 0.518 0.524 0.510<TS_END>]" (normalized 0-1, special token 경계)
4. **Image**: VisionTS-style — TS → 24×24 patch image (matplotlib PNG, base64 encoded inserted into prompt). Multimodal LLM (GPT-4V) 사용.

### 비교 조건

- Direct 4 × Window 3 = 12 condition × Model 4 (FinMA-7B-full, GPT-4-text, GPT-4V, hand-crafted baseline = logistic regression on 5-day MA + tweet sentiment) = 48 cells.
- Metric: Accuracy + MCC + Sharpe ratio on simulated long-short PnL.
- 5-fold time-stratified cross validation.

### 예상 결과

- H1 부분 확인 가능성 50% — Image > Decorated 일 가능성은 높지만, Numerical < Chunked 인지 불확실.
- H2 강한 확인 가능성 70% — LLM 의 numerical reasoning weakness 는 잘 알려진 phenomenon. 단 정확한 magnitude 미지.
- H3 부분 확인 가능성 60% — 60-day Image 가 5-day 보다 강하면 longer-window 가치 증명. 단 noise 증가 가능성.

### 반증 조건

- 만약 4-direct 모두 Accuracy 차이 1% 이내 → 직렬화 방식 무관. Stock prediction 자체가 noise-dominant. (Tan 2024 결과와 정합.)
- 만약 Numerical 이 가장 좋으면 → LLM 의 numerical reasoning 이 hidden capability 임. 추가 분석 가치.

### 비용 추정

- API 비용: GPT-4 + GPT-4V 의 5,000 sample × 48 cell × 평균 1,000 token = 240M token. 가격 ~$2,400.
- GPU 시간: FinMA-7B-full inference, A100 × 2 days.
- 분석 시간: 2주.
- 합: 4-6주 + $2,400 budget.

### Contribution potential

- LLM-for-TS forecasting 의 critical design choice (시계열 직렬화) 의 systematic ablation. 일반화 가능 결과.
- 사용자 P1 ProTran-TFA 의 finance venue 진출 시 §5 "TS-text fusion design" 의 직접 evidence.
- 사용자 VisionTS (2026-06-10 cover) + GAF/MTF (2026-06-24 cover) 의 multimodal TS 라인의 LLM 통합 응용.

---

## 2-실험의 우선순위

| 실험 | scope | 비용 | 사용자 main candidate 연결 | 우선순위 |
|---|---|---|---|---|
| 실험 1 (Motif Drift) | 3-4주 | A100 × 3 days | 🟢 APF 직접 substrate | **1순위** |
| 실험 2 (TS Serialization) | 4-6주 + $2,400 | A100 × 2 days + API | P1 ProTran-TFA paused | 2순위 |

**1순위 실험 1** 의 결과 가지고 NeurIPS 2027 workshop 또는 ICLR 2028 short paper 직접 submission 가능. 사용자 single-author paper 후보로 sharp.

**2순위 실험 2** 는 P1 ProTran-TFA 재가동 시기 (졸업 직전 1-2 학기) 의 동시 작업으로 적합. API 비용 (~$2,400) 이 학교 자원 매칭 가능성 점검 필요.

## 두 실험의 통합 가능성

실험 1 + 실험 2 를 하나의 paper 로 묶는 design: **"How Instruction Tuning Shapes Attention Motifs in LLMs for Time-Series Reasoning"**. APF mech-interp 측 (실험 1) + LLM-for-TS forecasting 측 (실험 2) 의 cross-axis sharp paper. NeurIPS 2028 또는 ICLR 2029 main track 후보. 사용자 PhD trajectory 의 directly actionable contribution 후보.
