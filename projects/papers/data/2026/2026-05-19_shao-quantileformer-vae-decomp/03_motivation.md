# 03 Motivation — Section 1 Introduction

## Probabilistic Forecasting 의 정의

> The primary objective of probabilistic time series forecasting is to provide probability distribution information regarding uncertainty for predicting values at future time points. Unlike traditional time series forecasting, probabilistic forecasting aims to comprehensively describe the potential range of future values, which is achieved by estimating various quantiles (including median and percentiles) to offer a range of potential outcomes, thereby enhancing decision-making under uncertainty. (paper p.1)

**Deterministic vs Probabilistic**:
- **Deterministic** (Autoformer, Informer 등): "내일 오후 3시 전력 수요는 8.5 MW".
- **Probabilistic** (DeepAR, TFT, QuantileFormer): "내일 오후 3시 전력 수요는 70% 확률로 [7.8, 9.2] MW 사이".

→ uncertainty-aware decision making 에 본질적.

---

## Fig. 1 — 핵심 motivation 이미지

![Fig. 1 Mixture patterns in Electricity](figures/Fig1_mixture_patterns.png)

(Figure 1, paper p.1)

> Illustration of mixture patterns in the Electricity dataset. It contains diverse patterns in different time period, with mixture distribution parameters and various statistical characteristics. (Fig 1 caption)

**시계열 데이터의 3가지 복잡성**:
1. **Diverse patterns**: 시간대마다 다른 모양 (daily peak vs weekly cycle).
2. **Mixture of distributions**: 평상시 + 이벤트 시 → 단일 Gaussian 으로 표현 불가.
3. **Various statistical characteristics**: 평균/분산/skewness 등이 시점마다 변함 (concept drift).

→ 기존 forecasting 모델은 이 3가지를 동시에 다루지 못함.

---

## 3 가지 핵심 Challenge (paper p.2)

paper 본문:
> First, it is difficult to extract temporal patterns which are entangled and diversified. Second, the mixed distribution of data exacerbates the challenge of capturing probabilistic distribution information. Third, the diverse statistical properties of data complicate models' ability to simultaneously capture quantile information from multiple variates.

### Challenge 1: Entangled diversified patterns
- 시계열에 여러 패턴이 섞여 있음.
- Autoformer 의 trend-seasonal 분해로는 충분하지 않음 — quantile-level 차이를 못 잡음.

→ **답**: Quantile Drift 분해 — 여러 quantile level 마다 별도 trend 추출.

### Challenge 2: Mixed distribution
- 데이터의 underlying distribution 이 단일 Gaussian 이 아님.
- Multimodal, heavy-tailed, skewed 등.

→ **답**: Gaussian Mixture decomposition + VAE — divergence pattern 을 K Gaussian 의 mixture 로 분해.

### Challenge 3: Diverse statistical properties (multi-variate)
- 변수마다 다른 statistical 특성 (variance, autocorrelation).
- 단일 모델로 모든 변수에 quantile 정보 추출 어려움.

→ **답**: Fusion Transformer with cross-attention — drift + divergence + distribution 3개 path 의 통합.

---

## 본 paper 의 3 contribution (paper p.2)

paper 의 bullet 인용:

> • We propose a pattern-mixture decomposition method that decomposes long-term time series into quantile drift, divergence patterns, and Gaussian mixture components, which can effectively capture the intricate temporal patterns and stochastic characteristics in time series data.

→ **Contribution 1**: 새 분해 방법 (pattern-mixture).

> • We propose a novel Transformer-based model called QuantileFormer for probabilistic time series forecasting. Based on pattern-mixture decomposition, the quantile drift part is proceeded by a Transformer encoder and the statistical patterns are captured by a Variational AutoEncoder (VAE) network, which are fed into a fusion Transformer to obtain the quantile prediction results.

→ **Contribution 2**: 새 아키텍처 (QuantileFormer = Transformer encoder + VAE + fusion Transformer).

> • We conduct comprehensive experiments to rigorously assess the efficacy of our proposed method. In addition to employing conventional metrics, we introduce a new performance metric, cpaw (Coverage Probability with Normalized Averaged Width), specifically designed to quantify the precision of the predicted probabilistic intervals. Experimental results show that the proposed method consistently outperforms the baseline methods by a large margin and achieves state-of-the-art performance on six real-world benchmarks.

→ **Contribution 3**: 새 metric (cpaw) + 6 dataset SOTA.

---

## 본 motivation 의 미학

3 contribution 이 직교 + 시너지:
- **분해** (representation 측면) — challenge 1, 2 해결
- **아키텍처** (model 측면) — challenge 3 해결
- **metric** (evaluation 측면) — probabilistic interval 의 정확한 평가

이 셋이 함께 — **probabilistic forecasting 의 end-to-end framework**.

---

## Autoformer 와의 관계

| 측면 | Autoformer (2021) | QuantileFormer (2025) |
|------|-------------------|----------------------|
| 분해 | Trend + Seasonal | Quantile drift + Divergence + GMM |
| 분해 도구 | AvgPool (moving average) | QuantileFilt (moving quantile) + GMM |
| Attention 단위 | Series-wise (Auto-Correlation) | Cross-attention (drift × divergence) |
| 출력 | Single point | Multiple quantiles |
| Loss | MSE | Pinball (quantile loss) |
| 응용 | Deterministic forecasting | **Probabilistic forecasting** |

→ Autoformer 의 "분해를 inner block 으로" 정신을 **확률적 setting** 에 확장. AvgPool 의 quantile-aware 일반화 = QuantileFilt.

다음 [04_related_work.md](04_related_work.md) 에서 paper 의 3 학문적 흐름 (Transformer + 분해 + 확률 forecasting) 정리.
