# 04. Section 2 (Related Work) — 기존 모델들과 어디가 다른가

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문의 **학문적 lineage** — Autoformer (2021) → PatchTST (2023) → 본 논문 (2025)
- 11 referenced 모델 (DeepAR, MQRNN, TFT, Transformer, Informer, Autoformer, FEDformer, PatchTST, iTransformer, ...) 의 위계
- 본 논문이 **3 가지 학문 흐름의 교차점** — Decomposition + VAE + Transformer

---

논문 2쪽 (Section 2) 을 풀어본다. paper 의 Section 2 는 3 subsection 으로 본 paper 의 lineage 를 정리.

이 챕터는 **"본 논문이 어느 학문적 흐름에서 나왔고, 무엇이 새로운가"** 를 보여준다.

---

## 4.1 Section 2.1 — Transformer-based Models (Transformer 기반 모델들)

### 원문

> "Transformer-based models were widely used in time series forecasting." (paper p.2)

이어서 paper 가 인용한 Transformer 모델 5개:

### 인용된 Transformer 모델 5개

| 모델 | 출처 | 한 줄 설명 | 본 paper 에서의 역할 |
|------|------|------|---------------------|
| **Pyraformer** | Liu et al. (2022, ICLR) | Pyramid attention 으로 O(L) 복잡도 | survey only (baseline 아님) |
| **PatchTST** | Nie et al. (2022, ICLR) | Patch token + channel-independent | **Tables 1, 3 의 baseline** |
| **iTransformer** | Liu et al. (2023, ICLR) | Variable-wise token (각 변수 = 1 토큰) | **Tables 1, 3 의 baseline** |
| **MQTransformer** | Eisenach et al. (2020) | Decoder-encoder context alignment for quantile | survey only |
| **TFT** | Lim et al. (2019) | Recurrent + self-attention + quantile output | **Tables 1, 3 의 baseline** |

### 각 모델의 핵심 아이디어 (간단 비유)

- **PatchTST**: 시계열을 작은 patch (예: 16 시점) 로 자르고, 각 patch 를 "토큰" 처럼 취급. **비유**: 영화 → 1초 단위 클립으로 자른 후 각 클립을 한 단어처럼 처리.
- **iTransformer**: 보통 시계열은 "시점 × 변수" 의 2D 데이터인데, 일반 Transformer 는 시점을 토큰으로 봄. iTransformer 는 **변수를 토큰** 으로 봄. **비유**: 보통 책 읽기는 "한 줄 한 줄" 이지만 iTransformer 는 "장 별로 묶어서" 읽음.
- **TFT (Temporal Fusion Transformer)**: Recurrent + attention 결합 + quantile output. 본 논문 이전의 가장 강력한 확률적 forecasting Transformer.

### paper 의 비판

> **paper text (p.2)**: "However, the above mentioned works mainly focused on point-wise forecasting, and very few works adopted Transformer for probabilistic forecasting [Eisenach et al., 2020; Lim et al., 2019]."

**의역**: "위 언급된 작업들은 주로 point-wise (단일값) 예측에 초점. 매우 적은 작업만 Transformer 를 확률적 예측에 사용 (MQTransformer, TFT)."

→ **point-wise vs probabilistic** 의 구분이 핵심. 본 논문은 **probabilistic** 진영.

---

## 4.2 Section 2.2 — Decomposition of Time Series (시계열 분해)

### 원문 — 분해의 고전적 lineage

> "In the realm of time series analysis, the standard methodology of time series decomposition [Cleveland et al., 1990; Tukey, 1960; Hyndman and Khandakar, 2008; De Jong, 1980; McCullough and Renfro, 1990] dissects a temporal sequence into several components, each representing a more predictably discernible underlying pattern." (paper p.2)

### 분해의 고전 5 referenced

| 출처 | 기여 | 비유 |
|------|------|------|
| **STL** (Cleveland 1990) | Seasonal-Trend decomposition by Loess | 가장 표준적 분해 도구. R/Python 의 기본. |
| **Tukey (1960)** | Biostatistical intro to decomposition | 분해 사상의 초기 영감. |
| **Hyndman-Khandakar (2008)** | forecast R package | 자동 ARIMA + 분해 표준 도구. |
| **De Jong (1980)** | seasonal-trend procedure | 계량경제학에서 분해 사용. |
| **McCullough-Renfro (1990)** | signal extraction | 시계열에서 trend·cycle 분리. |

**핵심 사상**: "복잡한 시계열을 더 예측 가능한 component 들로 분해 → 각각 따로 처리 → 합침". 1960년대부터 60년 넘게 사용되어 온 표준.

### 분해를 deep learning 에 가져온 5개 paper

| 모델 | 분해 방식 | 본 paper 와의 관계 |
|------|----------|-------------------|
| **Autoformer** [Wu et al., 2021] | Trend-Seasonal (AvgPool inner block) | **Tables 1, 3 baseline. 본 paper 의 직접 전신** |
| **FEDformer** [Zhou et al., 2022] | Frequency-enhanced decomposition (FFT) | Tables 1, 3 baseline |
| **TimesNet** [Wu et al., 2022] | Period decomposition (2D variation) | reference only |
| **N-BEATS** [Oreshkin et al., 2019] | Basis expansion | reference only |
| **DeepGLO** [Sen et al., 2019] | Matrix decomposition | reference only |

추가로 paper 가 언급한 저자 그룹의 직접 선행 작업:
- **TS3Net** [Ma et al., 2024]: trend / regular / fluctuant 3-part 분해 (저자 group 의 이전 paper). → 본 논문의 직접 영감 가능성.
- **TimeMixer** [Wang et al., 2024]: multiscale seasonal + trend 분해.

### paper 의 차별화 주장

> **paper p.2**: "To the best of our knowledge, we are the first to propose a pattern-mixture method that decomposes long-term series into a mixture of quantile patterns, and design a fusion Transformer architecture for probabilistic time series forecasting."

**의역**: "우리가 아는 한, 장기 시계열을 quantile pattern 의 혼합으로 분해하고 확률적 시계열 예측을 위한 fusion Transformer 아키텍처를 설계한 첫 paper 다."

→ 차별점 2가지:
1. **Quantile-aware decomposition** (분위수 인식 분해) — Autoformer 의 AvgPool 을 QuantileFilt 로 일반화.
2. **Mixture of distributions** (분포 혼합) — divergence 를 GMM 으로 추가 분해.

---

## 4.3 Section 2.3 — Probabilistic Time Series Forecasting Methods

### 원문

> "To capture the parts of the sequence that reflect the probability distribution, several methods have been applied to probabilistic time series forecasting [Bontempi and Ben Taieb, 1999; Hyndman and Athanasopoulos, 2018; Bergmeir and Hyndman, 2015; Salinas et al., 2018; Wang et al., 2021]." (paper p.2)

### 확률 forecasting 의 초기 5 referenced

| 출처 | 기여 | 시대 |
|------|------|------|
| **Bontempi-Ben Taieb (1999)** | Neural net for time series — 초기 NN 적용 | 1990년대 |
| **Hyndman-Athanasopoulos (2018)** | textbook: "Forecasting: principles and practice" | 표준 textbook |
| **Bergmeir-Hyndman (2015)** | Boosted additive models | 2010년대 중반 |
| **Salinas (2018)** | Probabilistic wind speed forecasting | 응용 초기 |
| **Wang (2021)** | Hierarchical Bayesian NN | 2020년대 |

### Modern 확률 forecasting 6 paper (paper 가 비교)

| 모델 | 출처 | 한 줄 설명 | 본 paper 에서의 역할 |
|------|------|------|---------------------|
| **DeepAR** | Salinas et al. (2020) | Autoregressive RNN + Gaussian 가정 | **Tables 1, 3 baseline** |
| **MQRNN** | Wen et al. (2017) | Multi-horizon quantile RNN | **Tables 1, 3 baseline** |
| **P-TSE** | Zhou et al. (2023) | Multi-model ensemble + HMM | reference |
| **Conformalized QR** | Romano et al. (2019) | RIF over input covariates | reference |
| **TimeGrad** | Rasul et al. (2021, ICML) | EBM-based autoregressive | reference |
| **TMDM** | Li et al. (2024, ICLR) | Transformer-modulated diffusion | reference |

### 각 모델 비유

- **DeepAR**: "시계열을 RNN 으로 한 시점씩 예측, 각 시점에 Gaussian 분포 가정". **비유**: 일기예보가 매일 "내일 강수량 ~ 정규분포(평균 5mm, 분산 2)" 를 말함.
- **MQRNN**: "RNN 으로 미래 여러 시점의 여러 quantile 동시 예측". **비유**: 매일 "내일 0.1-quantile 1mm, 0.5-quantile 5mm, 0.9-quantile 8mm" 를 동시에 말함.
- **TFT**: "Recurrent + attention + quantile output 의 결합". 본 논문 이전의 가장 강력한 모델.

---

## 4.3-bis ★ 왜 4년 동안 아무도 안 했나?

본 deep dive 의 질문 — "Autoformer (2021) 와 DeepAR (2020) 가 둘 다 있었는데 왜 결합이 2025년에야?"

본 deep dive 의 답:

1. **학자 분리**: Decomposition 학자 (Wu, Zhou, Liu 등 — 분해 진영) 와 probabilistic 학자 (Salinas, Lim, Rasul 등 — 확률 진영) 가 서로 다른 conference 활동, 서로 잘 안 인용.
2. **기술적 난이도**: 분해 + VAE 의 결합은 hyperparameter 가 폭발 (분해 stage 수 + K + quantile set + ELBO weight 등) — 학습 안정화가 어려움.
3. **Evaluation 합의 부재**: probabilistic forecasting 의 metric 자체가 표준화 안 됨 (q-risk vs CRPS vs cpaw) → 새 모델의 superiority 입증이 어려움. paper 가 **cpaw 새 metric 도입** 으로 이 문제 해결.
4. **GPU 자원**: 분해 + VAE + Transformer 의 3 module 결합은 학습이 무거움 → 최근 GPU 발전이 가능하게 함.

→ **본 paper 가 "필연적 시기" 에 등장**. 4년 동안 못 했던 게 아니라 *조건이 맞은 시기* 에 처음 시도.

---

## 4.4 본 paper 의 학문적 위치

```
[Forecasting]
   ├── Deterministic (point-wise 단일값 예측)
   │     ├── Autoformer, Informer, PatchTST, iTransformer
   │     └── + decomposition (inner block) — Autoformer family
   │
   └── Probabilistic (distribution / quantile 예측)
         ├── Parametric: DeepAR (Gaussian 가정)
         ├── Non-parametric: MQRNN (quantile 직접)
         ├── Bayesian: Wang 2021, P-TSE
         ├── Diffusion: TimeGrad, TMDM
         └── + decomposition (NEW): QuantileFormer  ← 본 논문
```

QuantileFormer 의 contribution = **"decomposition × probabilistic"** 의 교차점.
- Autoformer 의 분해 정신 (deterministic 진영) +
- DeepAR / MQRNN 의 확률 정신 (probabilistic 진영) =
- **QuantileFormer** (decomposition + probabilistic 의 통합).

**비유**: 두 강이 합쳐지는 지점 — 한쪽은 "분해" 강, 한쪽은 "확률" 강. QuantileFormer 가 합류점.

---

## 4.4-bis ★ 8 baseline 의 선택이 의미하는 것

paper 가 비교 대상으로 선택한 8 baseline 의 분포를 보면 paper 의 **자신감의 영역** 이 보임:

| Baseline 유형 | 개수 | paper 의 의도 |
|------------|------|--------------|
| Probabilistic native (DeepAR, MQRNN, TFT) | 3 | "**같은 probabilistic 분야** 의 SOTA 모두 이긴다" |
| Deterministic Transformer (Transformer, Autoformer, FEDformer, PatchTST, iTransformer) | 5 | "**deterministic 모델** 도 quantile loss 로 학습시켜 비교" |
| 누락 | 0 | TimeGrad (2021), TMDM (2024 diffusion) **누락** |

### Diffusion (TimeGrad, TMDM) 누락의 의미

본 deep dive 의 추론:
- Diffusion 모델은 분포 전체 학습 → quantile output 으로 변환 가능.
- paper 가 비교 안 한 이유:
  - (a) 학습 비용이 매우 무거움.
  - (b) Diffusion 의 inference 가 느림.
  - (c) paper 가 diffusion 진영에서 충분히 strong 하지 못할 우려.

→ **paper 의 self-confidence boundary** — 같은 quantile/Gaussian 진영에서는 강하지만 diffusion 진영과의 비교는 회피.

→ 미래 연구 방향 (ch15 의 후속 방향 4): **Diffusion-QuantileFormer** 가 정직한 비교가 될 수 있음.

---

## 4.5 Fig 2 — 본 paper 가 모든 component 를 통합하는 방식

![Fig. 2 Architecture](figures/Fig2_architecture.png)

(Figure 2, paper p.3)

### Figure 2 의 4 모듈 (좌상부터 시계방향)

1. **Pattern-Mixture Decomposition** (좌상) — Drift-Divergence 분해 + Gaussian Mixture 분해.
2. **Quantile Drift Feature Extraction** (상) — Transformer Encoder × N (layer 6개).
3. **Distribution Mixture with Variational Inference** (중하) — VAE (encoder $\phi$ + decoder $\theta$).
4. **Fusion Transformer** (우) — Cross-Attention + FFN + Self-Attention + Linear (prediction head).

각 모듈의 정확한 내부는 다음 chapter 들에서 해체:
- ch06 → 모듈 1 (Pattern-Mixture Decomposition, Eq 4~7)
- ch07 → 모듈 3 (VAE, Eq 8~15)
- ch08 → 모듈 2 (Quantile Drift Feature Extraction)
- ch09 → 모듈 4 (Fusion Transformer, Eq 16~18)

---

## 4.6 본 paper 의 가장 가까운 4 paper — 비교 표

| 모델 | 분해 | 확률 출력 | Backbone | 본 paper 와의 핵심 차이 |
|------|------|----------|----------|----------------------|
| **Autoformer** (2021) | ✓ (2단 trend-seasonal) | ✗ | Transformer | 확률 출력 없음 (deterministic) |
| **DeepAR** (2020) | ✗ | ✓ (Gaussian) | LSTM | 분해 없음, 분포 형태 고정 (Gaussian) |
| **TFT** (2019) | ✗ | ✓ (quantile) | Recurrent + attention | 분해 없음, attention 단순 |
| **TMDM** (2024) | ✗ | ✓ (diffusion) | Transformer + Diffusion | 분해 없음, diffusion 무거움 |
| **QuantileFormer** (본 paper) | ✓ (3단) | ✓ (quantile) | Transformer + VAE | 모든 측면 통합 |

→ 본 paper 의 unique 한 위치: **3단 분해 + Transformer + VAE + 확률 출력** 4가지 동시.

---

## 4.7 Section 2 핵심 정리

| 항목 | 내용 |
|------|------|
| 분야 1 (Transformer 시계열) | Pyraformer, PatchTST, iTransformer, TFT, MQTransformer |
| 분야 2 (분해) | Autoformer, FEDformer, TimesNet, STL (1990), TS3Net (저자 group) |
| 분야 3 (확률 forecasting) | DeepAR, MQRNN, TFT, P-TSE, TimeGrad, TMDM |
| 본 paper 의 위치 | 분야 1 + 2 + 3 의 교차점 |
| 직접 전신 | **Autoformer** (분해 정신) + **DeepAR/MQRNN** (확률 정신) |
| 차별점 | (1) Quantile-aware 분해, (2) Mixture of distributions, (3) Fusion Transformer |

**한 줄 핵심**:
> **"60년 된 '시계열 분해' 전통과 2020년대 '확률 forecasting' 흐름을 Transformer + VAE 로 처음 통합한 모델."**

다음 [05_problem_formulation.md](05_problem_formulation.md) 에서 **quantile regression 의 정식 수학적 정의** 를 다룬다 (Eq 1~3).

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **본 paper 가 인용한 Transformer 기반 forecasting 모델 5개는?**
2. **시계열 분해를 deep learning 에 처음 가져온 핵심 paper 와 본 paper 의 직접 전신은?**
3. **본 paper 의 학문적 위치를 한 그림으로 표현하면?**

### 답변

1. **Tables 1, 3 의 직접 baseline 모델 9 종**:
   - **8 baseline (paper Tables)**: DeepAR (2017), MQRNN (2017), TFT (2019), Transformer (2017), Autoformer (2021), FEDformer (2022), PatchTST (2023), iTransformer (2024).
   - **본 논문 = 9번째**: 위 8 모두를 능가.
   - **위계** (출시 연도 + 강점):
     - DeepAR/MQRNN: RNN 기반, 단일 분포 가정.
     - TFT: Transformer + multi-quantile, 분포 모델링 없음.
     - Autoformer 이후: deterministic, 분포 X.
     - QuantileFormer: 모든 차원 통합.
   - **paper 가 학계 표준 8 모델 다 포함** — 공정한 비교의 증거.

2. **본 paper 의 직접 전신 — Autoformer (2021)**:
   - **Autoformer 의 기여**: 시계열 분해 (trend + seasonal) 를 **모델의 inner block 으로** 가져옴. 이전엔 전처리 단계.
   - **본 논문이 계승하는 것**: "분해를 모델 안으로" 의 paradigm.
   - **본 논문이 일반화하는 것**: 2단 분해 (trend + seasonal) → **3단 분해** (quantile drift + divergence + GMM).
   - **다른 전신**:
     - **FEDformer (2022)**: frequency-domain 확장. 본 논문은 time-domain 유지하되 quantile-aware.
     - **TS3Net (저자 그룹 직전)**: trend-seasonal-stochastic 3 component 분해 의 초기 시도.
     - **TFT (2019)**: multi-quantile 출력. 본 논문이 이걸 받음.
   - **본 논문의 핵심 진보**: Autoformer 의 분해 + TFT 의 multi-quantile + **VAE 의 distribution modeling** 의 3-way 통합.

3. **본 논문의 학계 위치 — 두 줄기의 교차점**:
   - **줄기 1: Deterministic Transformer + 분해**:
     - Autoformer → FEDformer → PatchTST → iTransformer
     - 공통: 시계열 분해, 점 예측 (단일 값).
   - **줄기 2: Probabilistic Forecasting**:
     - DeepAR → MQRNN → TFT
     - 공통: 분포 예측, but 분해 X.
   - **본 논문이 처음 통합**: 두 줄기를 같은 framework 에서.
     - 분해 (줄기 1) + 분포 (줄기 2) + Transformer (둘의 공통 backbone).
   - **함의**: 2025년 IJCAI 의 본 paper 가 **시계열 forecasting 의 두 거대 흐름** 의 첫 통합. 이후 paper 들이 본 논문을 출발점으로 더 발전 가능.
   - **학문적 의미**: "Deterministic + Probabilistic" 의 dichotomy 를 깬 paper.
