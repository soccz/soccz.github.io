# 01. 시작하기 전에 — 진짜 쉬운 한 줄 소개

> 영어 못 읽거나 수식 두려운 사람을 위한 entry. 여기를 읽으면 *PatchTST 가 뭔지* + *왜 중요한지* 가 한국어 + 일상 비유로 명확해집니다.

---

## 이 논문, 한 줄로 뭐예요?

> **"긴 시계열 (몇 년치 일별 데이터 같은 것) 의 미래를 예측할 때, *Transformer (GPT 같은 모델)* 에 *두 가지 단순한 trick* 만 더하면 *최고 성능* 이 된다는 걸 증명한 논문."**

---

## 더 풀어 설명하면

옛날부터 *시계열 예측* 은 학자들의 큰 도전. 예:
- 다음 달 전력 사용량?
- 다음 주 도로 교통량?
- 내일 날씨?
- 다음 분기 매출?

**2010년대 — RNN/LSTM 시대**: 시계열 모델의 표준은 *순환 신경망 (RNN, LSTM)*. 그러나 *long-term 의존성* 잘 못 잡음.

**2017년 — Transformer 등장**: NLP (자연어 처리) 에서 *완전 혁명*. ChatGPT 의 기본 구조.

**2018-2022년**: 학자들이 *Transformer 를 시계열에 적용* 시도. Informer (2021), Autoformer (2021), FEDformer (2022) 등.

**2022년 — DLinear shock**: 한 학자가 "*Transformer 가 시계열에 효과적이지 않다*" 라는 도전적 paper 발표. *간단한 선형 모델 (DLinear) 이 복잡한 Transformer 보다 낫다* 는 결론. 학계 충격.

**2023년 — 본 논문 (PatchTST)**: DLinear 도전에 *Vanilla Transformer + 두 trick* 으로 응답.

> **두 trick**:
> 1. **Patching** — 시계열을 *patch (작은 조각)* 로 자르고 *한 patch = 한 단어* 처럼 다룸.
> 2. **Channel-independence** — *각 변수* 를 *독립적으로* 처리 (예: 전력 / 기온 / 습도 각각 따로).

→ 결과: **SOTA (state-of-the-art) 시계열 forecasting**. DLinear 도전에 *Transformer 가 정직하게 응답*.

논문 제목의 의미: **"A Time Series is Worth 64 Words"** = "*시계열 = 64개 단어 (token)*". ViT (Vision Transformer) 의 *"An Image is Worth 16x16 Words"* 와 같은 정신:
- **ViT (2020)**: 이미지를 16x16 patch 로 자르고 각 patch = 한 단어. NLP Transformer 그대로 image 에 적용.
- **PatchTST (2023)**: 시계열을 64 patch 로 자르고 각 patch = 한 단어. NLP Transformer 그대로 time series 에 적용.

---

## 핵심 키워드 — 진짜 친근한 정의

이 논문 읽는 데 알아야 할 7개 단어.

### 1. 시계열 (Time Series)

**일상 비유**: 매일 *체중 측정 기록*. 또는 매시간 *주식 가격 기록*. **시간 순서의 숫자 sequence**.

본 논문 예: 시간당 *전력 사용량 326개 가구* (Electricity 데이터셋), 시간당 *도로 교통량 862개 도로* (Traffic 데이터셋).

### 2. Forecasting (예측)

**일상 비유**: 지난 1년 *몸무게* 봤더니 *3개월 후 어떻게 될지* 예측.

본 논문: **Long-term forecasting** — *수백 timestep 앞* 예측. 예: 지난 336 시간 데이터 → 다음 96, 192, 336, 720 시간 예측.

### 3. Transformer

**일상 비유**: ChatGPT 의 *기본 구조*. 2017년 Google 발명. *Attention* 이라는 메커니즘으로 *문장 안 단어 사이 관계* 학습.

본 논문에서: *NLP 의 Transformer 를 시계열에 그대로 적용*.

### 4. Patch (조각)

**일상 비유**: 긴 시계열 (336 시간) 을 *16 시간 짜리 작은 조각* 으로 자름. 그 *조각 하나하나* 가 *문장의 한 단어* 처럼.

- *Patch length (P)*: 한 조각의 길이 = 16 시간.
- *Stride (S)*: 다음 조각이 *얼마나 옮겨* 가는지 = 8 시간 (50% overlap).

본 논문 핵심 trick. ViT (Vision Transformer) 의 *image patching* 의 시계열 버전.

### 5. Channel-Independence (채널 독립)

**일상 비유**: 의사가 환자 분석할 때 *심박수, 혈압, 체온* 을 *각각 따로* 본다. 함께 결합 X. *Cross-talk 없음*.

본 논문 두 번째 trick. *M 개 변수* (예: 326 가구 의 전력) 가 있을 때 *각 변수* 를 *독립적으로* Transformer 통과. *모두 같은 모델 weight* 사용.

### 6. Look-back window (회고 창)

**일상 비유**: 미래 예측 위해 *과거 몇 timestep 을 볼 것인가*. 학생의 시험 점수 예측에 *지난 5개월* vs *지난 5년* 봐서 예측 — 정확도 다름.

본 논문: $L$ = 336 (또는 512). *과거 336 시간 데이터* 로 *미래 96 시간* 예측.

### 7. Self-supervised Learning (자기지도 학습)

**일상 비유**: *정답 없는* 데이터를 *모델이 스스로* 학습.

본 논문 방법:
1. 시계열의 *일부 patch 를 가리고 (masked)* 모델에게 *그 patch 를 예측* 시킴.
2. 진짜 값 비교 → 학습.
3. → *Pre-training (사전 학습)*.
4. 그 다음 *진짜 forecasting* 작업에 *fine-tuning* — *Transfer learning*.

ChatGPT 의 학습 방식과 *같은 원리*.

---

## 이 deep dive 의 구성

본 deep dive 21 챕터의 역할:

| 챕터 | 무엇 |
|------|------|
| **01** (지금) | 진짜 entry. 7 개념 친근 정의 |
| **02** | 논문 제목 / Abstract 풀이 |
| **03** | 왜 PatchTST? DLinear 도전 + 본 논문 응답 |
| **04** | Patching 메커니즘 — *시계열 → 토큰* |
| **05** | Channel-Independence — *변수 독립 처리* |
| **06** | Transformer Encoder — *Vanilla 그대로* |
| **07** | Instance Norm + Loss — *마이너 trick* |
| **08** | Self-supervised Masked Reconstruction |
| **09** | 데이터셋 + Baseline 모델 |
| **10** | Supervised 결과 — *21% MSE reduction* |
| **11** | Transfer Learning + Representation 결과 |
| **12** | Ablation Study — *P+CI 의 효과 분해* |
| **13** | Conclusion + Future Work |
| **14** | Glossary (용어집) |
| **15** | 메타 통찰 12개 (DLinear 대 PatchTST, ViT transfer, Foundation model 등) |
| **16** | PyTorch 코드 |
| **17** | ASCII 도식 + viz 카탈로그 |
| **18** | Appendix Deep Dive (옵션) |
| **19** | Related Work (Paper Section 2 상세) |
| **20** | Analysis — *결과 의 deep 해석* |

---

## 처음 보는 사람의 추천 순서

**시간 30분만 있으면**: 01 → 02 → 03 → 10 (실증 결과) → 15 (통찰)

**시간 1시간**: 위 + 04 (patching) + 05 (channel-indep) + 12 (ablation)

**전체 (3시간)**: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 15 → 20

**수식 두렵다면**: 04, 05, 06, 07 의 *수식 박스* 건너뛰기. 일상 비유 + 본문 풀이만 보세요. 메시지 이해 가능.

---

## 이 논문이 결국 뭘 가르치는가 — 한 그림으로

```
   2022 DLinear 도전                       2023 PatchTST 응답
   ───────────────────                    ──────────────────

   "Transformer 는 시계열에                "Vanilla Transformer + 두 trick
    효과적이지 않다"                         (patching + channel-indep) =
                                            SOTA"
         ↓                                          ↓
   학계 분위기:                             21% MSE reduction
   "Transformer 시계열 X"                    vs FEDformer, Autoformer, Informer
         ↓                                          ↓
   Linear model 회귀                       시계열 foundation model 의 출발점
   (Are Transformers Effective?)            (iTransformer, Chronos, TimesFM
                                            모두 PatchTST 위에 build)
                                                    ↓
                                          ViT 의 정신을 시계열에 transfer
                                          (image → time series 동일 원리)
```

---

## 한 가지 마음의 자세

본 deep dive 는 *무지식자도 이해할 수 있게* 쓰여 있지만, 그래도 *어렵게 느껴지는 부분* 이 있을 거예요. 그럴 때:

- **건너뛰세요**. 수식 박스 / 영어 인용 박스 / "전공자용" 박스는 *옵션* 입니다.
- **다음 챕터로 가세요**. 한 챕터를 100% 이해 못 해도 다음 챕터가 새 비유로 다시 설명.
- **시각화 (17 챕터) 위주로 보세요**. 그림이 글보다 빠릅니다.
- **결과 (10 챕터) 부터 보셔도 됩니다**. "21% MSE reduction" 의 정량 결과가 가장 흥미.

---

## 자기점검

### 핵심 3가지
1. **이 논문 한 줄 요약?**
2. **"Patching" 의 일상 비유?**
3. **"Channel-independence" 의 의미?**

### 답변
1. **"Vanilla Transformer + 두 단순 trick (patching, channel-indep) = 시계열 SOTA"** 임을 증명한 논문. DLinear (2022) 의 *"Transformer 시계열 X"* 도전에 정면 반박. 21% MSE reduction vs 기존 Transformer 변형 (FEDformer, Autoformer, Informer). 후속 시계열 foundation model (iTransformer, Chronos, TimesFM 등) 의 building block.
2. **긴 시계열 (336 시간) 을 *16 시간 짜리 작은 조각* 으로 자르고 *조각 하나하나* 를 *문장의 한 단어* 처럼 다룸**. ViT (2020) 의 *16x16 image patching* 의 시계열 버전. 효과: (i) attention 복잡도 22× 감소, (ii) longer look-back 가능, (iii) local pattern (trend, periodicity) 보존.
3. **M 개 변수 (예: 326 전력 가구) 가 있을 때 *각 변수를 독립적으로* Transformer 통과 + *모두 같은 weight* 공유**. *Cross-channel mixing 없음*. 의사가 환자의 *심박, 혈압, 체온 각각 따로* 보는 것과 같음. 효과: (i) overfitting 방지, (ii) cross-channel spurious correlation 회피, (iii) channel 간 *완전 독립 forward* 로 병렬화 쉬움.

---

다음 챕터: [02_abstract.md](02_abstract.md) — 논문 제목 + Abstract 의 진짜 의미.
