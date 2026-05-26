# 02 Abstract 풀어 읽기

> **🧒 한 줄 요약**: Abstract. ProTran = SSM latent + Transformer + variational inference.


## 제목: "Probabilistic Transformer for Time Series Analysis"

한국어로 풀면: **"확률적 Transformer — 시계열 분석을 위한"**

### 단어별로 보자

| 영어 | 뜻 | 풀어 설명 |
|------|----|---------|
| Probabilistic | 확률적 | 출력이 한 값이 아닌 **분포** (다양한 그럴듯한 미래) |
| Transformer | 변환기 (NLP 의 그 Transformer) | Attention 기반 신경망 아키텍처 |
| for Time Series | 시계열을 위한 | 시간 순서가 있는 데이터 |
| Analysis | 분석 | 예측 + 모델링 둘 다 포함 |

→ "Transformer 의 표현력 + 확률 모델의 uncertainty 표현 = 시계열 분석에 둘 다 가져옴."

### 저자 정보

- **Binh Tang** — Cornell University, Statistics and Data Science PhD
- **David S. Matteson** — Cornell University, Statistics and Data Science 교수, 시계열 통계 전문가

→ "Pure ML lab 이 아닌 **통계학과** 에서 나온 paper" — SSM 이라는 통계학 framework 를 deep learning 으로 가져온 게 자연스러운 출발.

---

## 영어 원문 (NeurIPS 2021, p.1)

> Generative modeling of multivariate time series has remained challenging partly due to the complex, non-deterministic dynamics across long-distance time steps. In this paper, we propose deep probabilistic methods that combine state-space models (SSMs) with transformer architectures. In contrast to previously proposed SSMs, our approaches use attention mechanism to model non-Markovian dynamics in the latent space and avoid recurrent neural networks entirely. We also extend our models to include several layers of stochastic variables organized in a hierarchy for further expressiveness. Compared to transformer models, ours are probabilistic, non-autoregressive, and capable of generating diverse long-term forecasts with accounted uncertainty. Extensive experiments show that our models consistently outperform competitive baselines on various tasks and datasets, including time series forecasting and human motion prediction.

(총 6 문장)

---

## 한국어 직역

> 다변량 시계열의 생성 모델링은 장거리 시간 step 사이의 복잡한 비결정적 dynamics 때문에 여전히 도전적이다. 본 논문에서 state-space model (SSM) 과 transformer 구조를 결합한 deep probabilistic 방법을 제안한다. 기존 SSM 과 대조적으로, 우리 접근은 attention 메커니즘으로 latent space 의 non-Markovian dynamics 를 모델링하고 RNN 을 완전히 피한다. 더 나아가 hierarchy 로 조직된 stochastic 변수 여러 layer 를 포함하도록 모델을 확장한다. Transformer 와 비교하면 우리 것은 probabilistic 이고 non-autoregressive 이며 uncertainty 가 반영된 diverse 한 장기 forecast 생성 가능. 광범위 실험 결과 시계열 forecasting + human motion prediction 의 다양한 task 와 dataset 에서 baseline 들을 일관되게 능가.

---

## 한 문장씩 풀이

### 문장 1: 문제
> Generative modeling of multivariate time series has remained challenging partly due to the complex, non-deterministic dynamics across long-distance time steps.

- **Generative modeling**: 단순 forecasting 이 아니라 multiple plausible futures **생성**.
- **Multivariate**: 다변량 — 시계열 변수 여러 개 동시에.
- **Complex, non-deterministic dynamics**: 단순 trend / seasonal 이 아닌 복잡한 stochastic.
- **Long-distance time steps**: 장거리 의존성.

### 문장 2-3: 접근법 — SSM + Transformer 결합
> In this paper, we propose deep probabilistic methods that combine state-space models (SSMs) with transformer architectures. In contrast to previously proposed SSMs, our approaches use attention mechanism to model non-Markovian dynamics in the latent space and avoid recurrent neural networks entirely.

**핵심 design 3 choices**:
1. **SSM framework**: latent variable + observation, probabilistic.
2. **Transformer attention**: latent 의존성을 attention 으로 모델링 (RNN 대신).
3. **No RNN at all**: deep SSM 들은 보통 RNN 사용 — 본 paper 는 거부.

→ **non-Markovian latent dynamics**: $z_t$ 가 $z_{t-1}$ 뿐 아니라 $z_{1:t-1}$ 전체 의존 (attention 으로 가능).

### 문장 4: Multi-layer 확장
> We also extend our models to include several layers of stochastic variables organized in a hierarchy for further expressiveness.

- **Hierarchy of latents**: Single layer → multi-layer (L=2, 3) 확장.
- **Inspiration**: hierarchical VAE (NVAE, Very Deep VAE).

### 문장 5: 3가지 차별점 (vs Transformer)
> Compared to transformer models, ours are probabilistic, non-autoregressive, and capable of generating diverse long-term forecasts with accounted uncertainty.

| 측면 | Standard Transformer | ProTran |
|------|--------------------|---------|
| Output | Deterministic | **Probabilistic** (latent variable) |
| Generation | Autoregressive (앞 토큰 → 다음 토큰) | **Non-autoregressive** (latent → 전체 출력) |
| Uncertainty | 명시적 없음 | 명시적 (latent 의 variance) |

### 문장 6: 결과
> Extensive experiments show that our models consistently outperform competitive baselines on various tasks and datasets, including time series forecasting and human motion prediction.

- 2 영역 모두 SOTA: forecasting (Tables 1) + motion (Tables 3).
- 시계열: 5 datasets, 11+ baselines.
- Motion: 2 datasets, 9 baselines.

---

## 한 문단으로 요약

ProTran 은 SSM (latent + observation) framework 에 Transformer attention 을 latent space 에 적용하여 non-Markovian dynamics 모델링. RNN 완전 제거. Multi-layer hierarchical 확장으로 표현력 ↑. 시계열 forecasting (Solar/Electricity/Traffic/Taxi/Wikipedia) + 인간 모션 (Human3.6M/HumanEva-I) 양쪽 SOTA.

---

## 다른 deep dive 와의 관계

| 측면 | Autoformer (2021) | QuantileFormer (2025) | ProTran (이 paper, 2021) |
|------|-------------------|--------------------|----------------------|
| Output | Single point | Multiple quantiles | **Probability distribution (latent)** |
| Decomposition | Trend-Seasonal inner block | Quantile drift + GMM | **State-space (latent z)** |
| Probabilistic | × | ✓ (quantile) | ✓ (variational SSM) |
| Backbone | Auto-Correlation | Pattern decomp + VAE | **SSM + Attention** |
| 응용 | Energy/Traffic/etc | + Wind/Solar | + **Human motion** |

→ ProTran 은 같은 NeurIPS 2021 의 Autoformer 와 다른 axis 의 contribution. Autoformer = "분해 inner block", ProTran = "SSM + Attention".

---

## 한 그림으로 보는 ProTran vs LDS vs Transformer

```
              [LDS — 1960년대 고전]
               z_{t-1} → z_t → z_{t+1}    (Markovian, linear)
                  │       │       │
                  ↓       ↓       ↓
                 x_{t-1}  x_t   x_{t+1}
                 한 step 만 의존, 선형 변환만
                          ↓
                          ↓ 60년 흐름
                          ↓
              [표준 Transformer — 2017]
              x_1 ⇄ x_2 ⇄ ... ⇄ x_T       (observation 에 attention)
              모든 시점 직접 연결, 강력하지만 deterministic
                          │
                          │ + uncertainty?
                          ↓
              [ProTran — NeurIPS 2021]
              z_1 ⇄ z_2 ⇄ ... ⇄ z_T       (latent 에 attention)
                │   │         │
                ↓   ↓         ↓
              x_1  x_2       x_T          + probabilistic + non-autoregressive
              latent 에 attention + 확률 분포 + 다양한 미래 sampling
```

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Abstract 의 6 문장 중 paper 의 핵심 contribution 3가지를 어디서 명시했나?**
2. **"non-autoregressive" 가 의미하는 두 가지는?**
3. **ProTran 이 평가되는 두 task 와 dataset 수는?**

### 답변

1. (i) 문장 2-3: SSM + Transformer 결합 + attention 으로 non-Markovian latent dynamics. (ii) 문장 4: hierarchical latent variables 로 확장. (iii) 문장 5-6: probabilistic + non-autoregressive + uncertainty + 두 task SOTA.
2. (a) **Generation**: latent space 에서 전체 sequence 를 한 번에 결정 (token-by-token X). (b) **Observation 미사용**: $x_t$ 가 $x_{1:t-1}$ 의존 X → error accumulation 회피.
3. (a) **Time series forecasting**: 5 datasets (Solar / Electricity / Traffic / Taxi / Wikipedia). (b) **Human motion prediction**: 2 datasets (Human3.6M / HumanEva-I). 총 7 datasets, 11+9 baselines.

다음 [03_motivation.md](03_motivation.md) 로.
