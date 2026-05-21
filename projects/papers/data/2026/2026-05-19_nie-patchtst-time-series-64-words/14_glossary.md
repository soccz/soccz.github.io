# 14. 용어집 + 기호 사전

> 본 논문의 모든 *기호 + 약어 + 핵심 용어* 를 사전 형태로.

---

## 14.1 기본 시계열 표기

| 기호 | 의미 |
|------|------|
| $t$ | 시점 index |
| $L$ | Look-back window 길이 (입력 timestep 수). 본 논문: 336 또는 512 |
| $T$ | Forecast horizon (예측할 timestep 수). 본 논문: 96, 192, 336, 720 |
| $M$ | Multivariate channel 수. Dataset 별 다름 (7 ~ 862) |
| $x \in \mathbb{R}^{M \times L}$ | Input 시계열 |
| $y \in \mathbb{R}^{M \times T}$ | Forecast target |
| $\hat y$ | Model 의 예측 |

---

## 14.2 Patching 관련

| 기호 | 의미 |
|------|------|
| $P$ | Patch length (한 patch 의 timestep 수). 본 논문: 16 |
| $S$ | Stride (인접 patch 의 옮김 거리). 본 논문: 8 (supervised) 또는 12 (self-supervised) |
| $N$ | Patch 수. $N = \lfloor (L-P)/S \rfloor + 2$ |
| $x_p \in \mathbb{R}^{P \times N}$ | Patched 시계열 |

---

## 14.3 Transformer 관련

| 기호 | 의미 |
|------|------|
| $D$ | Token embedding dimension. 본 논문: 128 |
| $W_p \in \mathbb{R}^{D \times P}$ | Linear projection (patch → token) |
| $W_{pos} \in \mathbb{R}^{D \times N}$ | Position embedding |
| $H$ | Multi-head 수. 본 논문: 16 |
| #layers | Transformer encoder 층 수. 본 논문: 3 |
| $Q, K, V$ | Query, Key, Value (self-attention 의 3 vector) |

---

## 14.4 Empirical metrics

| 약어 | 풀네임 | 의미 |
|------|--------|------|
| MSE | Mean Squared Error | 평균 제곱 오차 |
| MAE | Mean Absolute Error | 평균 절대 오차 |
| SOTA | State-of-the-art | 분야 최고 성능 |
| OOS | Out-of-sample | 학습 안 한 데이터 |

---

## 14.5 모델 약어

| 약어 | 풀네임 |
|------|------|
| PatchTST | Patch Time Series Transformer (본 논문) |
| ViT | Vision Transformer |
| BERT | Bidirectional Encoder Representations from Transformers |
| GPT | Generative Pre-trained Transformer |
| RNN | Recurrent Neural Network |
| LSTM | Long Short-Term Memory |
| CI | Channel-Independence |
| BN | Batch Normalization |
| LN | Layer Normalization |
| MAE (학습) | Masked AutoEncoder (학습 방식) |

---

## 14.6 분야 도구

| 약어 | 풀네임 |
|------|------|
| NLP | Natural Language Processing |
| CV | Computer Vision |
| TS | Time Series |
| FFT | Fast Fourier Transform (Fourier domain attention 의 base) |
| MLM | Masked Language Modeling (BERT 의 학습 방식) |

---

## 14.7 영어 → 한국어 사전

| 영어 | 한국어 | 친근 풀이 |
|------|--------|----------|
| Forecasting | 예측 | 미래 값 추정 |
| Patch | 패치, 조각 | 시계열의 작은 단위 |
| Channel | 채널 | 변수 (예: 한 가구의 전력) |
| Look-back | 회고 | 과거 |
| Self-supervised | 자기지도 | 정답 없는 데이터로 학습 |
| Pre-training | 사전 학습 | 본격 task 전에 학습 |
| Fine-tuning | 미세 조정 | 학습된 모델을 specific task 에 적용 |
| Transfer learning | 전이 학습 | 한 task → 다른 task |
| Foundation model | 파운데이션 모델 | 큰 pre-train + transfer 의 모델 |
| Attention | 어텐션, 주의 | 토큰 간 관계 학습 |
| Embedding | 임베딩 | 벡터 표현 |
| Token | 토큰 | 처리 단위 (단어, patch) |
| Encoder | 인코더 | 입력 → representation |
| Decoder | 디코더 | representation → 출력 |

---

## 14.8 자기점검

### 핵심 3가지
1. **L, P, S, N 의 관계?**
2. **PatchTST 의 hyperparameter 핵심 4개?**
3. **MSE vs MAE 의 차이?**

### 답변
1. **$L$ (look-back), $P$ (patch length), $S$ (stride). $N$ (patch 수) = $\lfloor (L-P)/S \rfloor + 2$**. 본 논문 default: $L=336, P=16, S=8$ → $N=42$. 또는 $L=512, P=16, S=8$ → $N=64$ (논문 제목의 *64*).
2. **(i) Patch length $P = 16$, (ii) Stride $S = 8$ (supervised) 또는 $12$ (self-supervised), (iii) Embedding dim $D = 128$, (iv) Transformer layer = 3, head = 16**.
3. **MSE (Mean Squared Error)**: 평균 *제곱* 오차. *큰 오차에 더 penalty*. Gaussian noise 가정 의 MLE. **MAE (Mean Absolute Error)**: 평균 *절대* 오차. *모든 오차에 동일 weight*. Laplace noise 가정 의 MLE. 본 논문은 *둘 다 보고* (Table 3).

---

다음 챕터: [15_insights.md](15_insights.md) — 메타 통찰 12개 (이미 rewrite 완료).
