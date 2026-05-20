# 01. 시작하기 전에 — 이 해설집을 어떻게 읽으면 되나

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 **한 문장**으로 뭘 하는지 (확률적 시계열 예측의 새 Transformer)
- 7가지 핵심 개념 (quantile, probabilistic, decomp, GMM, VAE, cross-attention, pinball) 의 **일상 비유**
- 본인의 관심사에 따라 **어느 챕터부터** 읽으면 좋은지
- 본 deep dive 의 약속 — 영어·수식 못 읽어도 따라올 수 있게

수식·영어 못 읽는 분도 따라올 수 있게 디자인. 모르는 용어 마주치면 [16_glossary.md](16_glossary.md) 참조.

---

## 이 논문이 뭘 하는 논문인가요?

한 문장으로 말하면:

> **"내일 전력 수요(또는 풍속, 교통량)를 예측할 때, '딱 하나의 값' 이 아니라 '확률 분포 (= 신뢰 구간)' 로 예측하는 새로운 Transformer 모델을 만들었다"**

조금 더 풀면:

- 지금까지의 시계열 예측 모델 (Autoformer, Informer, PatchTST 등) 은 "내일 오후 3시 전력 수요는 8.5 MW" 라는 **하나의 숫자** 만 내놓았다.
- 그런데 실제로는 "70% 확률로 7.8~9.2 MW 사이" 라는 **범위** 가 필요하다. 전력 회사가 안전마진을 설계해야 하니까.
- 이런 "범위 예측" 을 **확률적 예측 (probabilistic forecasting)** 이라 부른다.
- 저자들은 시계열을 **세 가지 패턴 — quantile drift + divergence pattern + Gaussian mixture** 로 분해 → 각각 다른 모델로 처리 → 마지막에 cross-attention 으로 결합 → 여러 분위수 (0.5, 0.6, 0.7, 0.8, 0.9) 를 동시 출력하는 새 구조를 만들었다.
- 이걸 **QuantileFormer** 라고 부른다.
- 결과: 6개 dataset 에서 평균 q-risk (예측 정확도) 가 baseline 대비 **22~27% 개선**.

---

## 이 해설집의 약속

이 해설집에서는:
- **수식은 모두 보여준다** (원문 그대로)
- 하지만 **수식 한 줄 한 줄을 풀어서 설명한다**
- 처음 보는 영어 단어는 **항상 한국어 번역과 비유부터** 한다
- 어려운 개념은 **일상 비유**로 먼저 설명한 후 정확한 정의로 간다
- 매 챕터 끝에 **자기점검 Q&A** 로 핵심 3가지를 확인한다
- **★ 표시** 는 chapter 의 결정적 통찰 — 다른 곳에서 안 보이는 깊은 분석

영어를 못해도 수식을 못 읽어도 따라올 수 있도록 썼다.

---

## ★ 한 마디로 — 이 paper 의 정신적 모델

> **"일기예보가 '내일 비 5mm' 라고만 말하면 우산을 챙길지 모호. '70% 확률로 3~8mm, 폭풍 가능성 10%' 라야 의사결정 가능. 본 paper 는 시계열 예측에서 정확히 이 변화를 가져온다."**

기존 모델: "내일 12시 전력 = 8.5MW" (단일 값).
QuantileFormer: "내일 12시 전력 50% 분위 = 8.5, 90% 분위 = 9.7, 99% 분위 = 11.2 MW" (분포).

→ 전력 회사가 안전마진을 9.7 - 8.5 = 1.2MW 로 설계 가능.
→ Worst case (11.2 MW) 발생 대비 가능.
→ "더 똑똑한 예보 + 더 똑똑한 의사결정".

이 한 가지 변화가 이 paper 의 모든 것을 motivate.

---

## 미리 알아두면 좋은 7개 개념 (초등학생 버전부터)

이 논문은 7개 개념의 결합이다. 하나씩 일상 비유부터 시작.

### 1. "Quantile (분위수)" 이 뭐예요?

**일상 비유**: 시험 점수가 100개 있다. 점수를 작은 것부터 큰 것 순으로 줄을 세웠다.
- **0.5-quantile (= 50% 분위수 = median)**: 정확히 가운데 사람의 점수.
- **0.9-quantile (= 90% 분위수)**: 위에서 10% 자리 사람의 점수. 즉 "상위 10% 의 경계".
- **0.1-quantile (= 10% 분위수)**: 아래에서 10% 자리 사람의 점수.

**왜 중요한가**:
- 평균만 보면 "이번 시험은 평균 70점" 만 안다.
- Quantile 을 보면 **"상위 10% 는 90점 이상, 하위 10% 는 50점 이하"** 처럼 분포 모양을 안다.

논문에서 사용하는 quantile set: $Q = \{0.5, 0.6, 0.7, 0.8, 0.9\}$ → 5개.

이 5개를 동시에 예측 → "median = 8.5 MW, 90% 분위수 = 9.2 MW" → **신뢰 구간** 표현.

### 2. "Probabilistic forecasting (확률적 예측)" 이 뭐예요?

**일상 비유**: 일기예보.
- **나쁜 예보**: "내일 강수량 5mm". (= deterministic, 단일 값)
- **좋은 예보**: "내일 강수량 70% 확률로 3~8mm". (= probabilistic, 범위)

좋은 예보는 우산을 챙길지 말지 더 잘 판단하게 해준다. 모델이 자기 confidence (확신도) 까지 알려주기 때문.

본 논문이 다루는 task = **probabilistic time series forecasting** = 시계열의 미래 값을 **분포로** 예측.

### 3. "Decomposition (분해)" 이 뭐예요?

**일상 비유**: 음악 신호.
- 한 곡 = **저음 (베이스)** + **중음 (보컬)** + **고음 (심벌즈)**.
- 각각 따로 처리하면 (예: 베이스만 키우기) 더 좋은 mixing 가능.

시계열도 마찬가지:
- 한 시계열 = **trend (장기 추세)** + **seasonal (계절성)** + **noise (잡음)**.
- 각각 따로 모델링하면 더 정확.

**Autoformer (2021)** 가 이 아이디어를 Transformer 안에 처음 집어넣었다. 본 논문 QuantileFormer 는 이걸 **3 패턴으로 더 정교하게 분해**한 후속작.

### 4. "Gaussian Mixture (가우시안 혼합)" 이 뭐예요?

**일상 비유**: 한 학교의 키 분포.
- 단순 종 모양 (Gaussian) 으로는 부족 — 남학생 봉우리 + 여학생 봉우리 = **두 봉우리** 가 있을 수 있다.
- 이걸 "두 Gaussian 의 합" 으로 표현하면 정확.

**Gaussian Mixture Model (GMM)** = "여러 개의 종 모양 (Gaussian) 을 가중합한 분포".
- $K$ = Gaussian 개수 (예: $K=2$ → 남학생 + 여학생).
- 각 Gaussian 의 평균, 분산을 학습.

본 논문은 시계열의 복잡한 분포를 K=8~10 개 Gaussian 으로 분해한다.

### 5. "VAE (Variational AutoEncoder)" 가 뭐예요?

**일상 비유**: 그림 압축기.
- 사진을 작은 크기로 압축 → 작은 크기에서 다시 사진 복원 → 가능한 원본과 비슷하게.
- **Encoder**: 사진 → 작은 잠재값 (latent).
- **Decoder**: 작은 잠재값 → 복원된 사진.

**VAE 의 특별한 점**:
- 일반 압축기는 잠재값을 "딱 하나" 로 만든다.
- VAE 는 잠재값을 **확률 분포** (평균 + 분산) 로 만든다 → 새로운 사진을 sampling 으로 생성 가능.

본 논문에서는 VAE 가 시계열의 분포 정보를 학습하는 도구.

### 6. "Transformer 의 cross-attention" 이 뭐예요?

**일상 비유**: 영한 번역기.
- 영어 문장 (= source) 을 읽으면서 한국어 단어 (= target) 를 출력.
- 한국어 단어를 출력할 때 **"지금 어떤 영어 단어를 봐야 할까?"** 를 결정 — 이게 attention.

**Self-attention vs Cross-attention**:
- **Self-attention**: 한 문장 안에서 단어들 사이의 관계 ("나는 학교에 갔다" 에서 "나는" 과 "갔다" 사이).
- **Cross-attention**: 다른 두 source 사이의 관계 (영어 문장 ↔ 한국어 문장).

본 논문에서는 cross-attention 으로 **drift path (= 한쪽 source)** 와 **divergence path (= 다른쪽 source)** 를 결합한다.

### 7. "Pinball loss (= quantile loss)" 가 뭐예요?

**일상 비유**: 비대칭 벌금.
- 일반적인 MSE loss: 위로든 아래로든 틀리면 똑같이 벌금 — $(\hat{y} - y)^2$.
- Pinball loss ($\tau=0.9$): **아래로 틀리면 큰 벌금, 위로 틀리면 작은 벌금**.
  - 모델은 "어차피 위로 틀리는 게 안전" → 90% quantile 을 학습.

수식 (이건 나중에 ch10 에서 자세히):
$$
\rho_\tau(u) = \begin{cases} \tau \cdot u & u \geq 0 \\ (\tau-1) \cdot u & u < 0 \end{cases}
$$

여기서 $u = y - \hat{y}$ = 실제값 - 예측값.

**핵심**: 이 loss 를 최소화하면 모델이 $\tau$-quantile 을 예측하도록 학습된다.

---

## 7개 개념이 어떻게 결합되는가

```
[원본 시계열 χ]
       │
       ↓ Decomposition (개념 3)
   ┌───┴───┐
   │       │
[Drift]  [Divergence]
   │       │
   │       ↓ Gaussian Mixture (개념 4)
   │   [GMM components D]
   │       │
   │       ↓ VAE (개념 5)
   │   [distribution-enriched divergence]
   │       │
   ↓ Transformer encoder    ↓
   │                       │
   └──── Cross-attention (개념 6) ────┘
              │
              ↓ Pinball loss (개념 7) 로 학습
              │
   ŷ_0.5, ŷ_0.6, ŷ_0.7, ŷ_0.8, ŷ_0.9   ← Quantile (개념 1)
              │
              ↓
   "내일 전력 수요 70% 확률로 7.8~9.2 MW"  ← Probabilistic (개념 2)
```

이 7개가 머릿속에 들어 있으면 논문의 모든 한 줄이 자리에 들어간다.

---

## 이 해설집 구성

논문은 6 section + 7쪽 짧은 본문. 해설집은 다음처럼 나눠놨다:

| 파일 | 다루는 부분 | 한 줄 요약 |
|------|------------|----------|
| **01** | (이 파일) | 길잡이 + 7개 개념 비유 |
| **02** | 제목, Abstract | 논문의 표지·맛보기 |
| **03** | Section 1 (Introduction) | "왜 이걸 연구하나" + Fig 1 정밀 해석 |
| **04** | Section 2 (Related Work) | "기존 모델들과 어디가 다른가" |
| **05** | Section 3 (Problem Formulation) | "Quantile regression 의 수식 정의" |
| **06** | Section 4.1 (Pattern-Mixture Decomp) | "핵심 분해 — Eq 4~7" + Fig 2 좌측 |
| **07** | Section 4.2 (VAE Inference) | "VAE 가 어떻게 분포를 학습하나 — Eq 8~15" |
| **08** | Section 4.3 (Drift Extraction) | "Transformer encoder 의 역할" |
| **09** | Section 4.4 (Fusion Transformer) | "Cross-attention 으로 두 path 결합 — Eq 16~18" |
| **10** | Section 4.5 (Loss Function) | "Pinball loss — Eq 19" |
| **11** | Section 5 (Data + Baselines + Metrics) | "6 데이터셋, 8 baseline, q-risk + cpaw" |
| **12** | Section 5.1 (Main Results) | "Table 1, 3 — 숫자 한 칸씩 해석" |
| **13** | Section 5.2 (Ablation) | "Table 4 — 어떤 component 가 중요한가" |
| **14** | Section 5.3, 5.4 (Hyperparam + Viz) | "Fig 3, 4 — 그래프 한 picture 씩 해석" |
| **15** | Section 6 (Conclusion) | "마무리 + 4년 진화 (Autoformer → QuantileFormer)" |
| **16** | 용어집·표기집 | "기호 사전" |
| **17** | 메타 통찰 15개 | "이해를 넘어서" |
| **18** | PyTorch 코드 | "직접 실행 가능한 구현" |
| **19** | ASCII 도식·viz 카탈로그 | "8개 인터랙티브 시각화" |

---

## 이 논문을 읽을 때의 마음가짐

```
       ┌──────────────────────┐
       │   01, 02, 03         │  ← 모두 읽어야 함 (배경 + 7개 개념)
       └──────────┬───────────┘
                  │
       ┌──────────┴───────────┐
       │                      │
   ┌───▼────┐             ┌───▼────┐
   │ 04, 05 │             │ 06~10  │
   │ 기초    │             │ 핵심 모델│
   │ (쉬움)  │             │ (어려움) │
   └───┬────┘             └───┬────┘
       │                      │
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │   11~14              │  ← 실험 결과
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │   15                 │  ← 결론
       └──────────────────────┘
```

- **시간 없으면**: 01, 02, 03, 12 만 봐도 큰 그림 잡힘.
- **모델 구조 보고 싶으면**: 06, 07, 09 가 핵심 (분해 + VAE + fusion).
- **수치 결과 관심**: 12, 13, 14 만 집중.
- **응용 관심 (시계열 예측 직접 해보고 싶음)**: 18 PyTorch 코드 + 19 도식.

자, 그러면 [02_abstract.md](02_abstract.md) 로 가서 논문의 제목과 초록부터 만나보자.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **이 논문이 풀려는 문제는 무엇인가?**
2. **"확률적 예측" 이 기존 "단일 값 예측" 과 다른 점은?**
3. **7개 개념 중 "분해 (decomposition)" 와 "Gaussian mixture" 가 결합되어 무엇을 만들어내는가?**

### 답변

1. **본 논문이 푸는 핵심 문제 한 줄**:
   - 시계열을 **하나의 값** 이 아닌 **여러 quantile (분포)** 로 예측하는 모델 (= QuantileFormer) 을 만드는 것.
   - 응용 분야: 재생에너지 (풍력·태양광), 교통, 의료, 금융 — uncertainty 가 운영에 결정적인 분야.
   - 본 논문의 차별점: 기존 모델 (DeepAR, TFT) 은 단일 분포 (Gaussian) 가정. 본 논문은 **K 개 Gaussian mixture** 로 multi-modal 분포 모델링.
   - 실증 결과: 6 dataset 평균 q-risk 0.5q 24%↓ / 0.7q 27%↓ / 0.9q 22%↓.

2. **단일 값 vs 확률적 예측 — 의사결정에서의 차이**:
   - **단일 값 예측**: "내일 강수량 5mm" → 우산 챙길지 모호. 신뢰도 모름.
   - **확률적 예측**: "50% 확률로 3~8mm, 90% 확률로 1~12mm" → 우산·우비 등 의사결정 가능.
   - **본 논문이 주는 것**: 각 시점에 5 quantile (0.5~0.9) 예측 → 다양한 신뢰 수준의 구간.
   - **운용 가치**: 풍력 발전 운영자가 "내일 풍속 90% 확률 5~15 m/s" 알면 발전량 reserve 미리 확보 가능.

3. **Pattern-Mixture Decomposition 의 의미** (본 논문의 첫 번째 핵심 contribution):
   - **1차 분해 (drift + divergence)**: 시계열을 smooth trend ($\chi^q$, 매끄러운 quantile 추세) + divergence ($\chi^d = \chi - \chi^{0.5}$, 잔여 편차) 로 가름.
   - **2차 분해 (GMM)**: divergence 를 다시 K=4 (paper default) 개 Gaussian 의 mixture 로 분해.
   - **왜 2단계?**: 추세는 deterministic → Transformer 가 잡음. 편차는 stochastic + multi-modal → GMM 이 잡음. **다른 도구가 각각의 성격에 맞음**.
   - **Autoformer 와의 차이**: Autoformer 는 trend+seasonal (둘 다 deterministic). 본 논문은 deterministic + stochastic 의 진정한 분리.
