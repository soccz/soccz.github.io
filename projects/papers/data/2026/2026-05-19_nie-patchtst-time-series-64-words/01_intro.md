# 01 시작하기 전에 — 7개 개념

PatchTST 는 vanilla Transformer + 두 가지 단순 변경. 그래도 이 7개를 머릿속에 두면 paper 의 모든 한 줄이 자기 자리에 들어간다.

---

## 1. Long-term Multivariate Time Series Forecasting

**문제 정의** (paper p.3):

> Given a collection of multivariate time series samples with look-back window $L: (x_1, \ldots, x_L)$ where each $x_t$ at time step $t$ is a vector of dimension $M$, we would like to forecast $T$ future values $(x_{L+1}, \ldots, x_{L+T})$.

- $L$: look-back window length (예: 336 또는 512)
- $T$: prediction horizon (예: 96, 192, 336, 720)
- $M$: 변수 (channel) 개수 (예: Electricity 321, Traffic 862, Weather 21)
- $x_t \in \mathbb{R}^M$: 시점 $t$ 의 multivariate observation

→ "Long-term" 의 의미: $T = 720$ 까지 (이전까지 Transformer 들의 약점).

---

## 2. Vanilla Transformer (Vaswani 2017)

PatchTST 는 Transformer encoder 만 그대로 사용 (decoder 없음).

**핵심 연산** (Multi-head attention):
$$
\text{Attention}(Q, K, V) = \text{Softmax}\!\left(\frac{Q K^T}{\sqrt{d_k}}\right) V
$$

- $Q = X W^Q$, $K = X W^K$, $V = X W^V$ — projection
- $W^Q, W^K \in \mathbb{R}^{D \times d_k}$, $W^V \in \mathbb{R}^{D \times D}$
- Head $h \in \{1, \ldots, H\}$ 가 각각 다른 projection
- Complexity: **$O(N^2 d)$** where $N$ 은 token 수

→ 이 $N^2$ 가 long-term 의 적. PatchTST 는 $N$ 자체를 patching 으로 줄임.

---

## 3. ViT 의 Patching (Dosovitskiy 2021)

Vision Transformer 의 핵심:

> Vision Transformer (ViT) (Dosovitskiy et al., 2021) is a milestone work that splits an image into 16×16 patches before feeding into the Transformer model. (paper Section 2)

- 이미지: $224 \times 224 = 50176$ pixel
- 16×16 patch 로 자르면: $14 \times 14 = 196$ patch = $196$ token
- 한 patch 안의 256 pixel 은 한 token 으로 압축

**PatchTST 가 시계열에 적용**:
- 시계열: 길이 $L = 336$ → patch 길이 $P = 16$, stride $S = 8$ → 토큰 수 $N \approx L/S = 42$
- 한 패치 안의 16 timestep 이 한 token 으로 압축
- 같은 metaphor: "A Time Series is Worth 64 Words" (제목!)

---

## 4. Channel-independence vs Channel-mixing

Multivariate time series 의 두 가지 처리 방식:

| 방식 | 입력 token | Transformer weight |
|------|-----------|-------------------|
| **Channel-mixing** (Informer, FEDformer) | 시점 $t$ 의 모든 $M$ 변수를 한 벡터 → projection | 같은 weight, 모든 변수 한꺼번에 |
| **Channel-independence** (PatchTST) | 한 변수 $i$ 의 patch 만 token | **같은 weight** but 각 변수마다 독립 forward |

paper p.2:
> Channel-mixing refers to the latter case where the input token takes the vector of all time series features and projects it to the embedding space to mix information. On the other hand, channel-independence means that each input token only contains information from a single channel.

→ **각 변수마다 independent forward 지만 weight 는 공유**. CNN 의 weight sharing 정신과 유사.

---

## 5. Masked Autoencoder (BERT / MAE 의 정신)

Self-supervised learning 의 dominant paradigm:

**BERT (Devlin 2018)**: NLP — 토큰 일부를 [MASK] 로 가리고 model 이 복원하도록 학습.

**MAE (He 2021)**: CV — 이미지 patch 일부를 가리고 복원.

**PatchTST**: 시계열 — patch 일부 (40%) 를 zero 로 mask 하고 model 이 복원.

paper p.5:
> we use the same Transformer encoder as the supervised settings. The prediction head is removed and a $D \times P$ linear layer is attached. As opposed to supervised model where patches can be overlapped, we divide each input sequence into regular non-overlapping patches.

→ Self-supervised 단계: prediction head 제거, $D \times P$ linear layer 로 패치 복원.

---

## 6. Instance Normalization (시계열 분포 shift 대처)

paper p.4:
> This technique has recently been proposed to help mitigating the distribution shift effect between the training and testing data (Ulyanov et al., 2016; Kim et al., 2022). It simply normalizes each time series instance $x^{(i)}$ with zero mean and unit standard deviation.

- 각 univariate 시계열 $x^{(i)}$ 마다 독립적으로 평균 0, 표준편차 1 로 normalize
- Patching 전에 normalize, 출력 prediction 에 mean/std 다시 더함
- 시계열 forecasting 의 **distribution shift** 문제 (train/test 분포 다름) 완화

→ ReVIN (Reversible Instance Normalization) 의 정신.

---

## 7. DLinear 와의 대결 (Zeng et al., 2022)

PatchTST 직전에 나온 도발적 paper:
- **DLinear** (decomposition + linear): "Transformer 는 시계열 forecasting 에 효과적이지 않다" 주장
- 단순 linear 모델이 SOTA Transformer 들을 outperform
- Transformer 시계열 분야에 큰 의문 제기

**PatchTST 의 응답**:
- patching + channel-independence + long look-back 으로 Transformer 가 정말 강하다는 것 증명
- Table 3 에서 DLinear 도 outperform (특히 large dataset 에서)

paper Section 1:
> With our PatchTST model, we not only confirm that Transformer is actually effective for time series forecasting, but also demonstrate the representation capability that can further enhance the forecasting performance.

→ "Transformer is actually effective" — DLinear 에 대한 명시적 반박.

---

## 7개 개념의 결합 — PatchTST 한 줄

| 개념 | PatchTST 에서의 역할 |
|------|---|
| Long-term forecasting | 입력 $L = 336$, 출력 $T \leq 720$ |
| Vanilla Transformer | Encoder backbone (decoder 없음) |
| ViT patching | 시계열 $L$ → $N = (L-P)/S + 2$ patches |
| Channel-independence | $M$ 변수 각각 독립 forward, weight 공유 |
| Masked Autoencoder | Self-supervised pre-training (40% mask) |
| Instance Norm | Patching 전 분포 shift 완화 |
| DLinear 도전 | Transformer 가 정말 강하다는 증명 |

다음 [02_abstract.md](02_abstract.md) 에서 paper Abstract 6 문장 정밀 해부.
