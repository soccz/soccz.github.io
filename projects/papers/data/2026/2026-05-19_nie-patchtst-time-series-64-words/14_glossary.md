# 14. 용어집·표기법·References (비유 포함)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 시계열 forecasting 용어 (lookback / horizon / patching / channel-indep 등)
- ML 용어 (Transformer / attention / BatchNorm / masking)
- 수식 기호 사전
- Reference list

---

> 본 논문에 등장하는 모든 약어·기호·핵심 용어·references 의 사전.

각 entry 에 **비유** 추가 — 영어 못 읽어도 한국어 + 비유로 이해 가능.

---

## ★ 본 chapter 의 사용법

본 deep dive 를 읽다 모르는 용어 마주치면 여기를 찾는다. 7 section:
1. 시계열 기본 표기 (L, T, M, x, y)
2. Patching 관련 (P, S, N)
3. Transformer 관련 (D, Q/K/V, H, #layers)
4. Empirical metrics (MSE, MAE, q-risk)
5. 모델 약어 (PatchTST, ViT, BERT)
6. 분야 도구 (NLP, CV, FFT)
7. 영어 → 한국어 사전 (전체 용어)

---

## 14.1 기본 시계열 표기 (비유 포함)

| 기호 | 의미 | 일상 비유 |
|------|------|---------|
| $t$ | 시점 index | "달력의 날짜 번호" |
| $L$ | Look-back window 길이 (입력 timestep 수). 본 논문: 336 또는 512 | "예측 전 참고할 과거 기간" (예: 지난 2주) |
| $T$ | Forecast horizon (예측할 timestep 수). 본 논문: 96, 192, 336, 720 | "예측할 미래 기간" (예: 다음 4 일) |
| $M$ | Multivariate channel 수. Dataset 별 다름 (7 ~ 862) | "동시에 측정한 변수 수" (예: 가구 수) |
| $x \in \mathbb{R}^{M \times L}$ | Input 시계열 | "M 명 학생의 L 일치 점수 표" |
| $y \in \mathbb{R}^{M \times T}$ | Forecast target | "M 명 학생의 다음 T 일 예측 점수" |
| $\hat y$ | Model 의 예측 | "모델이 출력한 예측값" |
| $x^{(i)}$ | $i$-th channel (single variable) | "$i$ 번째 학생만의 시계열" |

---

## 14.2 Patching 관련 (비유 포함)

| 기호 | 의미 | 일상 비유 |
|------|------|---------|
| **$P$** | Patch length (한 patch 의 timestep 수). 본 논문: 16 | "한 장 안에 몇 시간 데이터? 16 시간" |
| **$S$** | Stride (인접 patch 의 옮김 거리). 본 논문: 8 (supervised) 또는 12 (self-supervised) | "다음 장 시작 위치 = 8 시간 이동" (overlap 가능) |
| **$N$** | Patch 수. $N = \lfloor (L-P)/S \rfloor + 2$ | "전체 장 수 = 42 또는 64" |
| $x_p \in \mathbb{R}^{P \times N}$ | Patched 시계열 | "P 행 × N 열 의 patch 표" |
| **64** (제목) | $L=512, P=16, S=8 \to N \approx 64$ | "한 시계열 = 64 단어 (paper 제목)" |
| **42** (PatchTST/42) | $L=336, P=16, S=8 \to N = 42$ | "한 시계열 = 42 단어 (가벼운 버전)" |

---

## 14.3 Transformer 관련 (비유 포함)

| 기호 | 의미 | 일상 비유 |
|------|------|---------|
| **$D$** | Token embedding dimension. 본 논문: 128 | "한 token 의 정보 양 = 128 숫자" |
| $W_p \in \mathbb{R}^{D \times P}$ | Linear projection (patch → token) | "P=16 짜리 patch 를 D=128 짜리 token 으로 변환" |
| $W_{pos} \in \mathbb{R}^{D \times N}$ | Position embedding | "각 patch 의 위치 (1st, 2nd, ..., Nth) 정보" |
| **$H$** | Multi-head 수. 본 논문: 16 | "동시에 16 가지 관점으로 attention" |
| **#layers** | Transformer encoder 층 수. 본 논문: 3 | "encoder 를 3 번 쌓아 깊게 처리" |
| **$Q, K, V$** | Query, Key, Value (self-attention 의 3 vector) | "Q=질문, K=참고자료 제목, V=참고자료 내용" |
| BatchNorm | Batch Normalization (본 논문 사용) | "한 batch 내 정규화 — Transformer 답지 않은 선택" |
| LayerNorm | Layer Normalization (NLP Transformer 표준) | "한 sample 내 정규화 — 본 논문은 사용 안 함" |

→ **흥미로운 design choice**: 본 논문이 LayerNorm 대신 **BatchNorm** 사용. 시계열의 distribution shift 와 batch 통계 정규화의 결합.

---

## 14.4 Empirical metrics (비유 포함)

| 약어 | 풀네임 | 의미 | 일상 비유 |
|------|--------|------|----------|
| **MSE** | Mean Squared Error | 평균 제곱 오차 | "큰 오차에 더 벌금 (penalty 제곱)" |
| **MAE** | Mean Absolute Error | 평균 절대 오차 | "오차 크기만 — 부호 무시" |
| SOTA | State-of-the-art | 분야 최고 성능 | "현재 1 등" |
| OOS | Out-of-sample | 학습 안 한 데이터 | "시험 본 적 없는 문제" |
| Loss | 손실 | 학습 시 최소화 | "벌금 — 작을수록 좋음" |

---

## 14.5 모델 약어 (비유 포함)

| 약어 | 풀네임 | 일상 비유 |
|------|------|----------|
| **PatchTST** | Patch Time Series Transformer (본 논문) | "시계열을 patch 로 나눈 Transformer" |
| **ViT** | Vision Transformer (2020) | "이미지를 patch 로 나눈 Transformer" (PatchTST 의 영감) |
| **BERT** | Bidirectional Encoder Representations from Transformers (2018) | "NLP foundation model 의 시작" (self-sup 의 영감) |
| **GPT** | Generative Pre-trained Transformer | "ChatGPT 의 기본 구조" |
| RNN | Recurrent Neural Network | "2010년대 시계열 표준" |
| LSTM | Long Short-Term Memory | "RNN 의 long-term 의존성 개선" |
| **CI** | Channel-Independence (본 논문의 trick 2) | "M 변수 각각 독립 처리" |
| BN | Batch Normalization | "batch 내 정규화" |
| LN | Layer Normalization | "sample 내 정규화" |
| MAE (학습) | Masked AutoEncoder (학습 방식) | "ViT 의 self-sup, PatchTST 도 비슷" |
| **DLinear** | Decomposition Linear (Zeng 2023) | "Transformer 도전한 단순 baseline" |

---

## 14.6 본 paper 의 8 baselines (정리)

paper Table 3 의 모든 baseline:

| 모델 | 출처 | 종류 | 한 줄 설명 |
|------|------|------|----------|
| **PatchTST/64** | Nie 2023 (본 논문) | Vanilla TST + Patching + CI | $L=512, N=64$ |
| **PatchTST/42** | Nie 2023 | Vanilla TST + Patching + CI | $L=336, N=42$ |
| **DLinear** | Zeng 2023 | Linear (no Transformer) | Decomposition + linear projection |
| **FEDformer** | Zhou 2022 | Frequency-enhanced Transformer | Fourier domain attention |
| **Autoformer** | Wu 2021 | Auto-correlation + decomp | Series decomposition + Auto-correlation |
| **Informer** | Zhou 2021 | Sparse attention | ProbSparse self-attention |
| **Pyraformer** | Liu 2022 | Pyramidal attention | O(L) complexity |
| **LogTrans** | Li 2019 | Logarithmic sparse | 가장 오래된 baseline |

---

## 14.7 분야 도구 (비유 포함)

| 약어 | 풀네임 | 의미 |
|------|------|------|
| NLP | Natural Language Processing | "자연어 처리" — BERT, GPT 의 분야 |
| CV | Computer Vision | "컴퓨터 비전" — ViT 의 분야 |
| TS | Time Series | "시계열" — 본 논문의 분야 |
| **FFT** | Fast Fourier Transform | "주파수 도메인 변환" (FEDformer 의 기반) |
| **MLM** | Masked Language Modeling (BERT 의 학습 방식) | "단어 일부 가리고 맞추기" (BERT) |
| **MIM** | Masked Image Modeling (MAE 의 학습 방식) | "이미지 patch 일부 가리고 맞추기" |
| **Masked Patch Reconstruction** | 본 논문의 self-sup | "시계열 patch 일부 가리고 맞추기" |

→ **세 분야의 self-sup paradigm 통합**: MLM (NLP) → MIM (CV) → Masked Patch Reconstruction (TS).

---

## 14.8 영어 → 한국어 사전 (전체)

| 영어 | 한국어 | 친근 풀이 |
|------|--------|----------|
| Forecasting | 예측 | 미래 값 추정 |
| Long-term forecasting | 장기 예측 | 96+ timestep 예측 |
| Patch | 패치, 조각 | 시계열의 작은 단위 (16 시간) |
| Patching | 패칭 | 시계열을 patch 로 자르는 작업 |
| Channel | 채널 | 변수 (예: 한 가구의 전력) |
| Channel-Independence | 채널 독립 | 변수마다 독립 처리, 같은 weight |
| Channel-Mixing | 채널 혼합 | 모든 변수를 한꺼번에 처리 (전통) |
| Look-back | 회고 | 과거 (입력 길이 L) |
| Horizon | 지평 | 예측 길이 T |
| Stride | 보폭 | patching 의 옮김 거리 |
| Self-supervised | 자기지도 | 정답 없는 데이터로 학습 |
| Pre-training | 사전 학습 | 본격 task 전에 학습 |
| Fine-tuning | 미세 조정 | 학습된 모델을 specific task 에 적용 |
| Linear Probing | 선형 측정 | encoder frozen + linear head 만 학습 |
| Transfer learning | 전이 학습 | 한 task → 다른 task |
| Foundation model | 파운데이션 모델 | 큰 pre-train + transfer 의 모델 |
| Attention | 어텐션, 주의 | 토큰 간 관계 학습 |
| Self-attention | 자기 어텐션 | 한 sequence 내 토큰 간 관계 |
| Multi-head attention | 다중 머리 어텐션 | 여러 관점 동시 attention |
| Embedding | 임베딩 | 벡터 표현 |
| Token | 토큰 | 처리 단위 (단어, patch) |
| Encoder | 인코더 | 입력 → representation |
| Decoder | 디코더 | representation → 출력 |
| Backbone | 백본 | 모델의 핵심 부분 |
| Reconstruction | 복원 | 가린 데이터를 원본으로 |
| Masking | 마스킹 | 일부 데이터를 가림 (0 으로) |
| Mask ratio | 마스킹 비율 | 가리는 비율 (40%) |
| Instance Normalization | 인스턴스 정규화 | sample 별 평균·분산 정규화 |
| Reversible Instance Norm (RevIN) | 가역 인스턴스 정규화 | Instance Norm + 역변환 가능 |
| Look-back window | 회고 창 | 입력 길이 L |
| Forecasting horizon | 예측 지평 | 예측 길이 T |
| Multivariate | 다변량 | M > 1 (여러 변수) |
| Univariate | 단변량 | M = 1 (한 변수) |
| Patch length | 패치 길이 | P |
| Cross-channel | 교차 채널 | 변수 간 |
| Spurious correlation | 거짓 상관 | 우연의 일치 |
| Overfitting | 과적합 | train 만 잘하고 test 못함 |
| Robustness | 견고성 | 작은 변화에 안정 |

---

## 14.9 핵심 수치 정리

paper text 직접 인용:

| 항목 | 값 | 출처 |
|------|-----|------|
| Average MSE reduction (vs FEDformer) | **21.0%** (PatchTST/64), 20.2% (/42) | Section 4.1 |
| Average MAE reduction | **16.7%** (/64), 16.4% (/42) | Section 4.1 |
| Patching speedup (Traffic) | **22×** (10040s → 464s) | Table 1 |
| Patch length P | **16** | Section 4.1 |
| Stride S | **8** (supervised), **12** (self-sup) | Section 4.1 |
| Default L | **336** (/42) or **512** (/64) | Section 4.1 |
| Mask ratio | **40%** | Section 4.2 |
| Pre-train epochs | 100 | Appendix |
| Linear probe epochs | 20 (head only) | Appendix |
| Fine-tune epochs | 10 lin. + 20 e2e | Appendix |
| Encoder layers | **3** | Appendix |
| Attention heads | **16** | Appendix |
| Hidden dim D | **128** | Appendix |
| Instance Norm contribution | **17%** MSE reduction (Table 11) | Appendix |
| CI standalone contribution | **25%** MSE reduction (Table 7) | Section 4.3 |
| Patching standalone contribution | **3%** MSE reduction (Table 7) | Section 4.3 |

---

## 14.10 paper References — 핵심

### 시계열 Transformer (paper 의 baseline)

| 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|-----------|------|-------------------|
| **Vaswani et al. (2017)** | Transformer (original) | Backbone 영감 |
| **Zhou et al. (2021)** | **Informer** | Tables 3, 7 baseline |
| **Wu et al. (2021)** | **Autoformer** | Tables 3, 7 baseline |
| **Zhou et al. (2022)** | **FEDformer** | Tables 3, 7 baseline |
| **Liu et al. (2022)** | Pyraformer | Tables 3 baseline |
| **Li et al. (2019)** | LogTrans | Tables 3 baseline |
| **Zeng et al. (2023)** | **DLinear** | Tables 3 baseline + paper motivation |

### Paradigm transfer (paper 의 영감)

| 저자 (연도) | 모델 | 본 paper 와의 관계 |
|-----------|------|-----------------|
| **Dosovitskiy et al. (2020)** | **ViT** (Vision Transformer) | **PatchTST 의 직접 영감** ("16×16 words") |
| **Devlin et al. (2018)** | **BERT** | Masked self-sup 의 NLP 원형 |
| **He et al. (2022)** | **MAE** (Masked AutoEncoder) | Self-sup 의 vision 원형 |
| **Kim et al. (2022)** | **RevIN** | Instance Normalization 의 reversible 버전 |

---

## 14.11 자기점검

### 핵심 3가지

1. **L, P, S, N 의 관계와 본 논문의 default 값은?**
2. **PatchTST 의 hyperparameter 핵심 4개 + 그 default 값은?**
3. **MSE vs MAE 의 차이와 본 paper 가 둘 다 보는 이유는?**

### 답변

1. **$L$ (look-back), $P$ (patch length), $S$ (stride). $N$ (patch 수) = $\lfloor (L-P)/S \rfloor + 2$**. 본 논문 default: $L=336, P=16, S=8$ → $N=42$ (PatchTST/42) 또는 $L=512, P=16, S=8$ → $N=64$ (PatchTST/64). **제목 "A Time Series is Worth 64 Words" 의 "64" 가 이 N**.
2. **(i) Patch length $P = 16$**, (ii) **Stride $S = 8$** (supervised) 또는 $12$ (self-supervised), (iii) **Embedding dim $D = 128$**, (iv) **Encoder layers $= 3$, heads $H = 16$**. 추가: dropout 0.1, batch 128, lr 1e-4. **★ Hyperparameter robust** (ch18 Fig 5) — model size 에 둔감.
3. **MSE (Mean Squared Error)**: 평균 **제곱** 오차. **큰 오차에 더 penalty**. Gaussian noise 가정의 MLE. **MAE (Mean Absolute Error)**: 평균 **절대** 오차. 모든 오차에 동일 weight. Laplace noise 가정의 MLE. 본 논문은 **둘 다 보고** (Table 3) — MSE 만 보면 outlier 에 휘둘릴 수 있음, MAE 도 보면 typical performance 확인 가능.

---

다음 챕터: [15_insights.md](15_insights.md) — 메타 통찰 15개.
