# 04 Related Work — Section 2

paper p.2 의 Section 2 는 3 subsection 으로 본 paper 의 lineage 를 정리.

## 2.1 Transformer-based Models

> Transformer-based models were widely used in time series forecasting. (paper p.2)

paper 가 인용한 4개 Transformer (모두 본 paper 의 baseline):

| 모델 | 출처 | 핵심 | 본 paper 에서의 역할 |
|------|------|------|---------------------|
| **Pyraformer** | Liu et al. (2022, ICLR) | Pyramidal attention, O(L) complexity | Section 2.1 surveying only |
| **PatchTST** | Nie et al. (2022, ICLR) | Patch token + channel-independent | Tables 1, 3 baseline |
| **iTransformer** | Liu et al. (2023, ICLR) | Variable-wise token (각 variable = 1 token) | Tables 1, 3 baseline |
| MQTransformer | Eisenach et al. (2020) | Decoder-encoder context alignment for quantile | Section 2.1 surveying |
| TFT | Lim et al. (2019) | Recurrent + self-attention, quantile forecasting | Tables 1, 3 baseline |

paper text 본문 (p.2):
> However, the above mentioned works mainly focused on point-wise forecasting, and very few works adopted Transformer for probabilistic forecasting [Eisenach et al., 2020; Lim et al., 2019].

→ **point-wise vs probabilistic** 의 구분. 본 paper 는 후자 영역에서 Transformer 사용.

---

## 2.2 Decomposition of Time Series

paper 의 분해 lineage:

> In the realm of time series analysis, the standard methodology of time series decomposition [Cleveland et al., 1990; Tukey, 1960; Hyndman and Khandakar, 2008; De Jong, 1980; McCullough and Renfro, 1990] dissects a temporal sequence into several components, each representing a more predictably discernible underlying pattern. (paper p.2)

5 고전 referenced:
- STL (Cleveland 1990)
- Tukey 1960 (biostatistical intro)
- Hyndman-Khandakar 2008 (forecast R package)
- De Jong 1980 (seasonal-trend procedure)
- McCullough-Renfro 1990 (signal extraction)

### Forecasting 의 분해 사용 — 5 deep learning paper

| 모델 | 분해 방식 | 본 paper 와의 관계 |
|------|----------|-------------------|
| **Autoformer** [Wu et al., 2021] | Trend-Seasonality (AvgPool inner block) | Tables 1, 3 baseline. 본 paper 의 직접적인 전신 |
| **FEDformer** [Zhou et al., 2022] | Frequency-enhanced decomposition | Tables 1, 3 baseline |
| **TimesNet** [Wu et al., 2022] | Period decomposition (2D variation) | Section 2.2 reference only |
| **N-BEATS** [Oreshkin et al., 2019] | Basis expansion | Section 2.2 reference only |
| **DeepGLO** [Sen et al., 2019] | Matrix decomposition | Section 2.2 reference only |

추가:
- **TS3Net** [Ma et al., 2024]: trend / regular / fluctuant 3-part 분해 (저자 group 의 이전 paper).
- **TimeMixer** [Wang et al., 2024]: multiscale seasonal + trend 분해.

paper 는 본인의 분해를 다음과 같이 차별화:
> To the best of our knowledge, we are the first to propose a pattern-mixture method that decomposes long-term series into a mixture of quantile patterns, and design a fusion Transformer architecture for probabilistic time series forecasting. (paper p.2)

→ **quantile-aware + mixture of distributions** 이 차별점.

---

## 2.3 Probabilistic Time Series Forecasting Methods

paper p.2:
> To capture the parts of the sequence that reflect the probability distribution, several methods have been applied to probabilistic time series forecasting [Bontempi and Ben Taieb, 1999; Hyndman and Athanasopoulos, 2018; Bergmeir and Hyndman, 2015; Salinas et al., 2018; Wang et al., 2021].

### 확률 forecasting 의 5 referenced methods

| 모델 | 출처 | 핵심 |
|------|------|------|
| Bontempi-Ben Taieb (1999) | J. Appl. Sci. | Neural net for time series — early NN |
| Hyndman-Athanasopoulos (2018) | textbook | "Forecasting: principles and practice" — 표준 reference |
| Bergmeir-Hyndman (2015) | Int. J. Forecast. | Boosted additive models |
| Salinas (2018) | Int. J. Forecast. | Probabilistic wind speed forecasting |
| Wang (2021) | J. Comput. Graphical Stat. | Hierarchical Bayesian neural net |

### Modern 확률 forecasting 4 paper (paper 가 비교)

| 모델 | 출처 | 핵심 | 본 paper 에서의 역할 |
|------|------|------|---------------------|
| **DeepAR** | Salinas et al. (2020, Int. J. Forecast.) | Autoregressive RNN, parametric (Gaussian) | Tables 1, 3 baseline |
| **MQRNN** | Wen et al. (2017, NeurIPS) | Multi-horizon quantile RNN | Tables 1, 3 baseline |
| **P-TSE** | Zhou et al. (2023) | Multi-model ensemble + HMM | Section 2.3 reference |
| **Conformalized Quantile Regression** | Romano et al. (2019, NeurIPS) | RIF over input covariates | Section 2.3 reference |
| **TimeGrad** | Rasul et al. (2021, ICML) | EBM-based autoregressive | Section 2.3 reference |
| **TMDM** | Li et al. (2024, ICLR) | Transformer-modulated diffusion | Section 2.3 reference |

→ paper 는 **DeepAR + MQRNN + TFT** 와 직접 비교 (Tables 1, 3 의 RNN-based probabilistic).

---

## 본 paper 의 학문적 위치

```
[Forecasting]
   ├── Deterministic (point-wise)
   │     ├── Autoformer, Informer, PatchTST, ITransformer
   │     └── + decomposition (inner block) — Autoformer family
   │
   └── Probabilistic (distribution / quantile)
         ├── Parametric: DeepAR (Gaussian)
         ├── Non-parametric: MQRNN (quantile)
         ├── Bayesian: Wang 2021, P-TSE
         ├── Diffusion: TimeGrad, TMDM
         └── **+ decomposition (NEW)**: QuantileFormer  ← 본 논문
```

QuantileFormer 의 contribution = **"decomposition × probabilistic"** 의 교차점. Autoformer 의 분해 정신 + DeepAR/MQRNN 의 확률 정신.

---

## Fig 2 — 본 paper 가 어떻게 모든 component 를 통합하는가

![Fig. 2 Architecture](figures/Fig2_architecture.png)

(Figure 2, paper p.3)

4 모듈:
1. **Pattern-Mixture Decomposition** (좌상) — Drift-Divergence + Gaussian Mixture
2. **Quantile Drift Feature Extraction** (상) — Transformer Encoder × N
3. **Distribution Mixture with Variational Inference** (중) — VAE
4. **Fusion Transformer** (우) — Cross-Attention + FFN + Self-Attention

각 모듈은 다음 chapter (ch05–ch10) 에서 정확히 해체.

다음 [05_problem_formulation.md](05_problem_formulation.md) 에서 quantile regression 의 수식 (Eq 1–3).
