# 05-B. 방법론 — 변수 토큰 임베딩

> **🧒 한 줄 요약**: paper §3.1 의 Embedding 단계 — 각 변수 $n$ 의 $T$-length series 를 *D-dim variate token* 으로 변환. *선형 + LayerNorm* 의 단순 구조이지만 *변수 간 단위 차이* 제거 + *학습 가능한 시간 가중 합산*.

> **배경 사다리**: ① MLP(다층 퍼셉트론)는 선형 변환(행렬 곱)과 비선형 함수(ReLU, GELU 등)를 번갈아 쌓은 함수로, 임의의 비선형 매핑을 근사할 수 있다. ② 임베딩(embedding)은 원래 데이터를 모델이 처리하기 좋은 고정 차원 벡터로 변환하는 과정이다.

---

## 왜 임베딩이 필요한가

각 변수 $n$의 관측값 시리즈는 $x_n \in \mathbb{R}^T$ 벡터다 (T-dim 원시 신호). 이 벡터를 트랜스포머가 직접 처리하려면 두 가지 문제가 있다:

1. 어텐션에서 모든 변수가 공통 임베딩 공간 $\mathbb{R}^D$을 공유해야 한다. $T$가 데이터마다 달라지면 변수 비교가 불가능하다.
2. 원시 신호에는 노이즈가 많다. 유용한 시간 패턴 (주기, 추세)을 비선형 변환으로 추출해야 한다.

따라서 각 변수의 $T$-dim 원시 신호를 $D$-dim 표현 벡터로 임베딩해야 한다.

---

## 임베딩 수식

$$h_n = \text{Embed}(x_n) = W_\text{emb} \cdot \text{LN}(x_n) + b_\text{emb}$$

여기서:

| 기호 | 의미 |
|------|------|
| $x_n \in \mathbb{R}^T$ | 변수 $n$의 과거 $T$개 관측값 벡터 |
| $\text{LN}(x_n)$ | LayerNorm — $x_n$의 $T$개 값을 평균 0, 분산 1로 정규화 |
| $W_\text{emb} \in \mathbb{R}^{D \times T}$ | 학습 가능한 임베딩 가중치 행렬 |
| $b_\text{emb} \in \mathbb{R}^D$ | 편향 벡터 |
| $h_n \in \mathbb{R}^D$ | 변수 $n$의 임베딩 벡터 (D-dim) |

**4줄 해석**:
1. **기호 뜻**: $W_\text{emb}$는 "T-dim 시리즈 → D-dim 특징"으로 매핑하는 학습 가능한 선형 변환이다. $D$는 보통 512 또는 1024.
2. **일상 비유**: 악보($T$개 음표로 된 시리즈)를 "이 곡의 장르·분위기·조성"을 요약한 $D$차원 악곡 지문(fingerprint)으로 변환하는 것과 같다. 원본 음표 수($T$)는 달라도 지문은 같은 크기다.
3. **왜 이 형태**: 선형 변환 $W_\text{emb}$는 $T$개 시간 점의 임의 가중 합산을 허용해서, 어느 시간대 패턴을 강조할지 학습으로 결정한다. 단순 평균(1개 파라미터 필요)보다 표현력이 훨씬 크다.
4. **조심할 점**: $W_\text{emb}$의 크기가 $D \times T$이므로, $T=720$이면 임베딩 레이어 단독으로 $D \times 720$개 파라미터가 필요하다. $D=512$이면 약 37만 개, 이는 전체 모델의 상당 비중을 차지할 수 있다.

---

## LayerNorm의 역할: 변수 간 측정 단위 차이 제거

$$\text{LN}(x_n) = \frac{x_n - \mu_n}{\sigma_n + \epsilon}$$

- $\mu_n = \frac{1}{T}\sum_{t=1}^T x_{n,t}$: 변수 $n$의 시간 평균
- $\sigma_n = \sqrt{\frac{1}{T}\sum_{t=1}^T (x_{n,t} - \mu_n)^2}$: 변수 $n$의 표준편차
- $\epsilon$: 분모가 0이 되는 것을 방지하는 작은 상수 (보통 $10^{-8}$)

**왜 중요한가**: 표준 트랜스포머는 타임스텝 $t$에서 $N$개 변수를 혼합한 벡터를 정규화한다. 이는 단위가 서로 다른 변수들을 섞어 정규화하므로 왜곡이 생긴다. iTransformer는 각 변수를 **독립적으로** 정규화한다. 온도는 온도 자체의 평균/분산으로, 전력은 전력 자체의 평균/분산으로. 이로써 "전력이 10^3 kWh 단위, 온도가 10^1 °C 단위"라는 측정 규모 차이가 임베딩 전에 제거된다.

---

## 전체 변수 토큰 행렬

$N$개 변수 각각의 임베딩을 쌓으면:

$$H = [h_1, h_2, \ldots, h_N] \in \mathbb{R}^{N \times D}$$

이것이 트랜스포머 인코더에 들어가는 토큰 시퀀스다. 길이는 $N$(변수 수), 각 토큰 차원은 $D$.

**대안과 비교**:
- **단순 선형 프로젝션 없이 원시 값 사용**: 표현력 부족, 학습 불안정
- **CNN 임베딩 (PatchTST 방식의 패치 CNN)**: 국소 시간 패턴은 잘 잡지만, 변수 전체 시리즈를 하나의 수용 필드(receptive field)로 볼 수 없음
- **선택된 방식 (선형 + LayerNorm)**: 간단하면서 $T$개 타임스텝의 임의 가중 합을 학습할 수 있음; 보편 근사 정리 관점에서 충분

## Embedding 의 *학습된 의미* — 시각 분석

학습 후 $W_\text{emb}$ 의 *각 row* ($i = 1, \ldots, D$) 가 *어떤 시간 pattern* 의 detector 인지의 *post-hoc analysis*:

### Row 별 detector 종류 (paper §3.2 + Tolstikhin 2021 MLP-Mixer 의 시계열 instantiation):

```
Row 1 (Trend detector):
  weights ≈ [-1, -1, -1, ..., 0, ..., +1, +1, +1] (linear ramp)
  → 시계열의 *상승 추세* 감지 (시간 weighted average with monotone ramp)

Row 2 (Recent emphasis):
  weights ≈ [0, 0, 0, ..., 0, 0, 1, 5, 10] (recent-weighted)
  → 최근 시간 강조 — *최신 정보 detector*

Row 3 (Periodic 7-day):
  weights ≈ [+1, -1, +1, -1, ..., +1, -1, +1, -1] (sinusoidal 7-day)
  → 주간 cycle 감지

Row 4 (Periodic 24-hour, if hourly data):
  weights ≈ sin(2π t / 24)
  → 일일 cycle 감지

Row 5 (Variance detector):
  weights = ±1 alternating
  → variability 측정

...

Row 512 (combined feature 의 final):
  학습 후 *복잡 nonlinear pattern* 감지 (학습 데이터의 unique structure)
```

→ *D = 512 개 detector* 의 *시간 feature library*. 각 variate 의 series 가 *512 차원 의 feature signature*.

---

## 학습 과정 — Embedding 의 *gradient flow*

$W_\text{emb}$ 의 학습:

```
Forward:  h_n = W_emb · LN(x_n) + b_emb  (D-dim variate token)
Loss:     L = MSE(forecast, ground_truth)
Backward:
  ∂L / ∂W_emb = ∂L / ∂h_n · LN(x_n)^T
  ≈ (forecast error gradient) × (input series LN)

학습 결과:
  Row i 가 *대부분 instance 에서* gradient 가 일관 방향
  → Row i 의 weight = "이 패턴이 prediction 에 *useful*" 의 distillation
```

**TimesFM / Chronos 와의 차이**:

- **iTransformer**: $W_\text{emb}$ 가 *task-specific learned*. 각 dataset 별 다른 detector library.
- **TimesFM**: $W_\text{emb}$ 가 *pretrained* on 100B time series tokens. *Universal detector library*.
- **Chronos**: token = *quantized vocab 8192*, $W_\text{emb}$ = *embedding table* (NLP transformer style).

→ iTransformer 의 *learned-from-scratch* vs TSFM 의 *pretrained universal*. TSFM 의 *advantage* = transfer learning.

---

다음 파일(05-C)에서 이 $H$를 받아 어텐션이 어떻게 작동하는지 수식화한다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **선형 임베딩 $W_\text{emb}$ 의 *학습된 의미*?**
2. **LayerNorm 의 *variate-wise* 적용의 *결정적 효과*?**
3. **단순 선형 vs CNN/MLP 임베딩 의 *trade-off*?**

### 답변

1. **시간 가중 합산의 *학습된 weighting*$$. $W_\text{emb} \in R^{D \times T}$ 의 row $i$ = "특징 $i$ 를 만들기 위해 $T$ 개 timestamp 의 가중 합산". 예: row 1 가 *최근 24 시간 평균* (linear weight uniform on last 24), row 2 가 *주간 추세* (linear weight increasing 7-day), row 3 가 *분기 cycle* (sinusoidal weight 90-day). 학습 결과 $D$ 개 의 *temporal feature detector*. Universal approximation 의 *시계열 instantiation*.

2. **단위 normalization + non-stationarity 처리**. 변수 의 *physical scale* 차이 (kWh 10^3 vs °C 10^1) 가 *embedding 전* 제거. 또 *non-stationarity* (mean / variance 시간 변화) 의 *implicit handling* — paper §3.2 의 LayerNorm Eq 2 와 일관. Kim 2021 의 RevIN + Liu 2022b 의 NSTransformer 의 정신 적용.

3. **선형 = 단순함 + 보편 충분; CNN/MLP = 표현력 더 크지만 overhead**. **선형 + LayerNorm**: $D \times T$ 파라미터 (예: 512 × 96 = 49K). 단순, GPU friendly, 보편 근사 정리 충족 (단일 linear layer 가 임의 시간 weighting). **CNN**: local pattern 잘 잡지만 *변수 전체 receptive field 부족*. **MLP (2-layer)**: 표현력 더 크지만 *over-parameterization 위험* + *학습 데이터 많이 필요*. → paper choice = *minimalism 일관*.
