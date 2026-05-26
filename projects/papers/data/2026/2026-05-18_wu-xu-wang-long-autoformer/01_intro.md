# 01. 시작하기 전에 — 진짜 쉬운 한 줄 소개

> **🧒 한 줄 요약**: Paper intro. Long-term TS forecasting의 challenges.


> 영어 못 읽거나 수식 두려운 사람을 위한 entry. 여기를 읽으면 *Autoformer 가 뭔지* + *왜 중요한지* 가 한국어 + 일상 비유로 명확해집니다.

---

## 이 논문, 한 줄로 뭐예요?

> **"긴 시계열 (예: 다음 30일 의 전력 사용량) 을 예측할 때, *Transformer (GPT 같은 모델)* 의 *attention* 을 *자기상관 (autocorrelation)* 으로 *통째로 교체* 하고, *시계열 분해 (trend + seasonal)* 를 *모델 내부* 에 끌어들이면 평균 38% MSE 감소한다는 것을 증명한 논문."**

---

## 더 풀어 설명하면

옛날부터 *장기 시계열 예측* 은 큰 도전:
- 한 달 후 전력 사용량?
- 다음 주 도로 교통량?
- 30일 후 환율?
- 인플루엔자 환자 수 한 달 후?

**2017년 — Transformer 등장**: NLP 의 ChatGPT 기본 구조. *Attention* 으로 *문장 안 단어 사이 관계* 학습.

**2019-2021 — 시계열 Transformer 변형**:
- *LogTrans (2019)*: LogSparse attention.
- *Reformer (2020)*: LSH attention.
- *Informer (2021)*: ProbSparse attention.

→ 모두 *self-attention 의 sparse 버전*. 즉 *점 (point) 들 중 일부만 보고* 빠르게.

**2021년 — Autoformer 의 두 가지 큰 깨달음**:

> **깨달음 1**: *Sparse attention 은 정보 손실*. *점만 보면 작은 패턴 못 잡음*.
>
> **깨달음 2**: *시계열 분해 (trend + seasonal)* 를 *사전 처리* 만 하지 말고 *모델 내부* 에서 *반복적* 으로 하자.

→ **결과**: *38% MSE 감소* (평균). ETTm2 dataset 의 *predict-336* 에서는 *74% 감소* (1.334 → 0.339).

---

## 핵심 키워드 — 진짜 친근한 정의

이 논문 읽는 데 알아야 할 7개 단어.

### 1. 시계열 분해 (Time Series Decomposition)

**일상 비유**: 한 달 의 *전력 사용량 그래프* 를 보면 *2가지 패턴* 섞임:
- **추세 (Trend)**: *전체적으로 오르락내리락* 하는 *큰 흐름* (예: 여름 다가올수록 에어컨 ↑).
- **계절성 (Seasonal)**: *매일 똑같이 반복되는 작은 패턴* (예: 아침/저녁 peak).

수식으로:
$$
X_t = \text{Trend}_t + \text{Seasonal}_t
$$

본 논문 trick: 시계열을 *trend + seasonal* 로 *분리* 한 후 *각각 따로 예측*. 마지막에 *합치기*.

### 2. 자기상관 (Autocorrelation) — R(τ)

**일상 비유**: 시계열 의 *어제 값* 과 *오늘 값* 이 *얼마나 비슷한지* 측정.

- *τ = 24시간* 의 autocorrelation 이 크다 = *24시간 주기성* 강함 (예: 매일 같은 시간 출근).
- *τ = 168시간 (1주일)* 의 autocorrelation 이 크다 = *주간 주기성* 강함 (예: 매주 월요일 출근).

본 논문 trick: 시계열 의 *진짜 주기* 를 autocorrelation 으로 자동 발견.

### 3. Attention vs Auto-Correlation — 점 vs 조각

**일상 비유**:
- **Self-Attention (기존 Transformer)**: *각 시간 점* 이 *다른 모든 시간 점* 과의 *관계* 측정 — *점 별 비교*.
- **Auto-Correlation (본 논문)**: *24시간 주기* 의 *sub-series (조각)* 들이 *서로의 관계* 측정 — *조각 별 비교*.

본 논문: *점 비교 (point-wise) → 조각 비교 (series-wise)* 의 *대전환*.

### 4. FFT (Fast Fourier Transform) — *빠른 푸리에 변환*

**일상 비유**: 시계열 의 *모든 주파수 성분* 을 *한꺼번에* 분석하는 *수학 도구*. 영상의 *압축 (MP4, JPEG)* 에 쓰이는 그 *주파수 분석*.

본 논문 활용: autocorrelation $R(\tau)$ 를 *모든 lag* (24시간, 48시간, …) 에서 *동시* 계산 → $O(L \log L)$ 의 *초고속*.

### 5. Wiener-Khinchin 정리

**일상 비유**: *autocorrelation* (시간 영역) = *power spectrum* (주파수 영역) 의 *역 FFT*. 즉 *시간 ↔ 주파수* 의 *수학 다리*.

본 논문: 이 정리로 *Eq 5 의 autocorrelation* 을 *FFT 두 번 + IFFT 한 번* 으로 *$O(L \log L)$* 에 계산.

### 6. Encoder-Decoder

**일상 비유**: ChatGPT 같은 모델 의 *두 부품*:
- **Encoder**: *입력 (과거 시계열)* → *압축된 representation*.
- **Decoder**: *압축된 representation + 시작 신호* → *미래 예측*.

본 논문: 표준 Transformer 의 *encoder-decoder 구조* 유지 + *내부에 분해 block 삽입*.

### 7. Roll 연산 (cyclic shift)

**일상 비유**: 시계열을 *cyclic 으로* (끝과 처음 연결) *τ 만큼 옮김*. 시계 의 *시침* 처럼 *돌려도 같은 자리* 로 돌아옴.

예 ($L=6$, $\tau=2$):
```
원본:    [x_0, x_1, x_2, x_3, x_4, x_5]
Roll +2: [x_4, x_5, x_0, x_1, x_2, x_3]   ← 뒤 2개가 앞으로
```

본 논문: $\tau_i$ 의 *주기* 로 *Roll* 후 *aggregation* — *같은 phase 의 sub-series* 들을 *정렬*.

---

## 이 deep dive 의 구성

본 deep dive 20 챕터의 역할:

| 챕터 | 무엇 |
|------|------|
| **01** (지금) | 진짜 entry. 7 개념 친근 정의 |
| **02** | 논문 제목 / Abstract 풀이 |
| **03** | 왜 Autoformer? 장기 예측의 두 challenge |
| **04** | Related Work — 기존 모델 + 분해 사용 역사 |
| **05** | Architecture — Encoder/Decoder + Series Decomp Block (Eq 1-4) |
| **06** | Auto-Correlation 메커니즘 (Eq 5-7) — 핵심 |
| **07** | Complexity — FFT 기반 $O(L\log L)$ (Eq 8) |
| **08** | Datasets + Baselines + 실험 setup |
| **09** | Main Results — Table 1 (multivariate) + Table 2 (univariate) |
| **10** | Ablation — Table 3 (decomp) + Table 4 (Auto-Corr vs SA) |
| **11** | Analysis — Figs 4-13 의 step-by-step 해석 |
| **12** | Appendix A — ETT 4 variant 전체 벤치마크 |
| **13** | Appendix B-D — Hyperparameter / input length / decoder input |
| **14** | Appendix F — COVID-19 case study |
| **15** | Conclusion + Future Work |
| **16** | Glossary (용어집) |
| **17** | 메타 통찰 — paradigm shifts |
| **18** | PyTorch 코드 |
| **19** | ASCII 도식 + viz 카탈로그 |

---

## 처음 보는 사람의 추천 순서

**시간 30분**: 01 → 02 → 03 → 09 (실증 결과) → 17 (통찰)

**시간 1시간**: 위 + 05 (architecture) + 06 (Auto-Correlation) + 10 (ablation)

**전체 (3시간)**: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 15 → 17

**수식 두렵다면**: 06, 07 의 *수식 박스* 건너뛰기. 일상 비유 + 본문 풀이만 보세요.

---

## 이 논문이 결국 뭘 가르치는가 — 한 그림으로

```
   2017-2021 시계열 Transformer 변형                 2021 Autoformer
   ──────────────────────────                       ────────────────

   LogTrans / Reformer / Informer                    "Sparse 는 정보 손실
   "Sparse self-attention 으로                        + 분해 도 모델 안에서"
    long-term forecasting"                                  ↓
            ↓                                      Auto-Correlation (Eq 5-7)
   여전히 point-wise 비교                            + Inner Decomp Block (Eq 1-4)
   + 분해는 pre-processing 만                                ↓
            ↓                                      38% MSE 감소 (평균)
   Information bottleneck                          ETTm2-336: 1.334 → 0.339 (74%)
                                                            ↓
                                                   $O(L \log L)$ 효율 + 정확도
                                                   (point → series 전환)
```

---

## 한 가지 마음의 자세

본 deep dive 는 *무지식자도 이해할 수 있게* 쓰여 있지만, 그래도 *어렵게 느껴지는 부분* 이 있을 거예요. 그럴 때:

- **건너뛰세요**. 수식 박스 / "전공자용" 박스는 *옵션*.
- **다음 챕터로 가세요**. 한 챕터를 100% 이해 못 해도 다음 챕터가 새 비유로 다시 설명.
- **시각화 (19 챕터) 위주로 보세요**. 그림이 글보다 빠릅니다.
- **결과 (09 챕터) 부터 보셔도 됩니다**. "38% MSE reduction" 의 정량 결과가 가장 흥미.

---

## 자기점검

### 핵심 3가지
1. **이 논문 한 줄 요약?**
2. **"Auto-Correlation" 의 일상 비유?**
3. **"분해 (decomposition) 를 모델 내부에서" 의 의미?**

### 답변
1. **"Transformer 의 attention 을 Auto-Correlation 으로 교체 + 시계열 분해를 모델 내부 block 으로 끌어들임 → 6 dataset 평균 38% MSE 감소"** 임을 증명한 논문. Informer/Reformer/LogTrans 같은 *sparse self-attention* 변형들 의 *information bottleneck* + *point-wise* 한계를 모두 극복. NeurIPS 2021.
2. **시계열 의 *어제 값 vs 오늘 값* 이 *얼마나 비슷한지* 측정**. *τ = 24시간* 이면 *매일 같은 시간 의 패턴 유사성*. 본 논문이 이걸로 *진짜 주기* 자동 발견 + *같은 phase 의 sub-series 끼리 aggregation*. Self-attention 의 *점 별 dot product* 대비 *조각 별 series-wise 비교*.
3. **기존 (Prophet, N-BEATS): 분해를 *사전 처리* 만 (학습 전 1회) + 본 논문: 매 layer 마다 hidden representation 에서 trend 추출 → 분리 → 다시 합침 (progressive decomposition)**. 즉 *반복적 정제*. 학생이 *문제 풀 때마다 답 점검* 하는 것과 같음 — *한 번 풀고 끝* (사전 처리) 이 아닌 *매 단계 점검* (inner block).

---

다음 챕터: [02_abstract.md](02_abstract.md) — 논문 제목 + Abstract 의 진짜 의미.
