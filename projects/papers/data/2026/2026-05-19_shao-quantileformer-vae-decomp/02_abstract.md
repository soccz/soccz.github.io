# 02 Abstract 풀어 읽기

## 영어 원문 (IJCAI 2025, p.1)

> Probabilistic time series forecasting has attracted an increasing attention in machine learning community for its potential applications in the fields of renewable energy, traffic management, healthcare, etc. Previous research mainly focused on extracting long-range dependencies for point-wise prediction, which fail to capture complex temporal patterns and statistical characteristics for probabilistic analysis. In this paper, we propose a novel pattern-mixture decomposition method that decomposes long-term series into quantile drift, divergence patterns, and Gaussian mixture components, which can effectively capture the intricate temporal patterns and stochastic characteristics in time series. Based on pattern-mixture decomposition, we propose a novel Transformer-based model called QuantileFormer for probabilistic time series forecasting. It takes the the comprehensive drift-divergence mixture patterns as features, and designs a variational inference based fusion Transformer architecture to generate quantile prediction results. Extensive experiments show that the proposed method consistently boosts the baseline methods by a large margin and achieves state-of-the-art performance on six real-world benchmarks.

(총 6 문장. paper text 의 "the the comprehensive drift-divergence" 는 paper 자체 typo — 한 번만 "the" 가 와야 함.)

---

## 한국어 직역

> 확률적 시계열 예측은 재생에너지·교통관리·헬스케어 등 분야의 응용 잠재력으로 인해 ML 커뮤니티에서 점점 더 큰 관심을 받고 있다. 기존 연구는 주로 long-range 의존성 추출을 통한 point-wise 예측에 초점을 맞춰, 복잡한 시간 패턴과 통계적 특성을 확률 분석을 위해 포착하지 못했다. 본 논문에서 우리는 장기 시계열을 quantile drift / divergence pattern / Gaussian mixture component 로 분해하는 새로운 pattern-mixture 분해 방법을 제안한다 — 이는 복잡한 시간 패턴과 확률적 특성을 효과적으로 포착할 수 있다. 이 분해 위에, 확률적 시계열 예측을 위한 Transformer 기반 모델 QuantileFormer 를 제안한다. 종합적인 drift-divergence mixture 패턴을 feature 로 받아, variational inference 기반 fusion Transformer 아키텍처로 quantile 예측 결과를 생성한다. 광범위 실험 결과, 본 방법은 baseline 들을 큰 차이로 능가하며 6개 real-world benchmarks 에서 SOTA 를 달성.

---

## 한 문장씩 풀이

### 문장 1: Probabilistic forecasting 의 등장
> Probabilistic time series forecasting has attracted an increasing attention in machine learning community for its potential applications in the fields of renewable energy, traffic management, healthcare, etc.

- **Probabilistic forecasting** = single point 예측 (평균/최우도) 이 아닌 **distribution** 예측. 신뢰 구간 + uncertainty quantification.
- 응용: 재생에너지 (예 — 내일 태양광 발전량의 90% 신뢰 구간), 교통 (출근시 traffic 의 변동 범위), 의료 (환자 회복 시간의 분포).

### 문장 2: 기존 연구의 한계
> Previous research mainly focused on extracting long-range dependencies for point-wise prediction, which fail to capture complex temporal patterns and statistical characteristics for probabilistic analysis.

기존 Transformer 들 (Autoformer, Informer, PatchTST, ITransformer 등):
- "long-range dependency" 추출에 집중 → MSE 최소화로 평균 예측.
- **point-wise prediction** — 시간점 마다 single 값.
- **probabilistic 측면 무시**: 모델의 confidence, 미래 distribution 의 다양한 양상 표현 못함.

### 문장 3: 본 paper 의 첫 contribution — Pattern-Mixture Decomposition
> In this paper, we propose a novel pattern-mixture decomposition method that decomposes long-term series into quantile drift, divergence patterns, and Gaussian mixture components, which can effectively capture the intricate temporal patterns and stochastic characteristics in time series.

**3 component 분해**:
1. **Quantile drift** $\chi^Q = \{\chi^q\}_{q \in Q}$: 여러 quantile 의 trend (예 — 0.5, 0.6, 0.7, 0.8, 0.9 quantile 의 moving filter 결과).
2. **Divergence patterns** $\chi^d = \chi - \chi^{0.5}$: median 으로부터의 편차 — 복잡 주기 + distribution 특성.
3. **Gaussian mixture** $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$: divergence pattern 의 K Gaussian 으로 추가 분해.

→ Autoformer 의 trend-seasonal 분해를 **quantile-aware + distribution-aware** 로 일반화.

### 문장 4: 본 paper 의 두 번째 contribution — QuantileFormer 아키텍처
> Based on pattern-mixture decomposition, we propose a novel Transformer-based model called QuantileFormer for probabilistic time series forecasting.

- 분해 결과를 받아, 4 component 로 처리:
  1. Quantile Drift Feature Extraction (Transformer encoder)
  2. Distribution Mixture Inference (VAE)
  3. Fusion Transformer (cross-attention)
  4. Quantile prediction head

### 문장 5: 본 paper 의 세 번째 contribution — variational inference
> It takes the the comprehensive drift-divergence mixture patterns as features, and designs a variational inference based fusion Transformer architecture to generate quantile prediction results.

- "variational inference" — VAE 의 핵심.
- "fusion Transformer" — drift + divergence 의 cross-attention 결합.
- 출력 = quantile predictions (5개 quantile $\tau \in \{0.5, 0.6, 0.7, 0.8, 0.9\}$).

### 문장 6: 결과 요약
> Extensive experiments show that the proposed method consistently boosts the baseline methods by a large margin and achieves state-of-the-art performance on six real-world benchmarks.

- 6 benchmarks: Electricity, ETTm1, ETTh1, Wind, Traffic, Solar.
- "Consistently boosts by large margin": q-risk 평균 24% (0.5 quantile) 감소.
- Note: paper text 본문에서는 모든 dataset/quantile 에서 1위 아님 — 단순 "consistently boosts" 정도.

---

## 한 문단으로 요약

QuantileFormer 는 시계열을 quantile drift + divergence pattern + Gaussian mixture 세 컴포넌트로 분해하고, Transformer encoder (drift) + VAE (distribution) + cross-attention fusion 으로 처리하여 quantile 예측을 출력하는 확률적 forecasting 모델. 6 dataset 평균 q-risk 0.5 quantile 24% 감소.

---

## 본 abstract 가 다른 probabilistic forecasting paper 와 다른 점

| 측면 | DeepAR (2020) | TFT (2019) | TMDM (2024 diffusion) | QuantileFormer (이 논문) |
|------|---------------|------------|----------------------|--------------------------|
| 모델 backbone | LSTM | Recurrent + self-attention | Diffusion model | **Transformer + VAE** |
| 분포 추정 | Parametric (Gaussian) | Quantile output | Diffusion forward/reverse | **Pattern-mixture + GMM** |
| 분해 사용 | 없음 | 없음 | 없음 | **Quantile-aware decomposition** |
| 핵심 metric | q-risk | q-risk | q-risk | **q-risk + cpaw (new)** |

→ Autoformer 가 deterministic forecasting 에 분해를 가져왔다면, QuantileFormer 는 **probabilistic forecasting** 에 분해를 가져왔다. 두 paper 의 정신적 후속.

---

## 단어별 풀이 — 제목 "QuantileFormer"

| 영어 | 뜻 | 풀어 설명 |
|------|----|---------|
| Quantile | 분위수 | 분포의 특정 % 경계값 (0.5 = median, 0.9 = 상위 10% 경계) |
| Former | Transformer 의 짧은 형 | 기본 backbone 이 Transformer 임을 시사 |

→ "Quantile 예측에 특화된 Transformer". Autoformer / Informer / PatchTST 등의 family 명.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Probabilistic forecasting 이 deterministic forecasting 과 다른 점은?**
2. **Pattern-mixture decomposition 의 3 component 와 각각의 후속 처리는?**
3. **Autoformer (2021) 와 QuantileFormer (2025) 의 정신적 후속 관계는?**

### 답변

1. **Deterministic**: 한 점 (예: "내일 전력 8.5 MW") 예측. **Probabilistic**: 분포 또는 분위수 (예: "내일 전력 70% 확률 7.8~9.2 MW"). uncertainty-aware decision making 에 본질적 — 전력 수급, 풍력 발전, 의료 진단 등 응용에 결정적.
2. **Quantile drift $\chi^Q$**: Transformer encoder 처리. **Divergence pattern $\chi^d$**: GMM 분해 → VAE 추론. **GMM components $D$**: VAE 의 입력 → global distribution mixture 학습. 마지막 fusion Transformer 가 3 path 결합.
3. **Autoformer**: deterministic forecasting 에 inner block 분해 (trend-seasonal) 도입. **QuantileFormer**: 같은 정신을 **probabilistic forecasting** 에 가져옴 — quantile drift + divergence + GMM 로 일반화. AvgPool → QuantileFilt 의 generalization 이 핵심.

이제 [03_motivation.md](03_motivation.md) 의 Introduction 으로.
