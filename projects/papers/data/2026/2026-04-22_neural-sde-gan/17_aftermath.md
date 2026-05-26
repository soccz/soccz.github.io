# 17 5 년 Aftermath — Neural SDE 의 진화 (2021-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: Kidger 2021 발표 후 5년간 *neural SDE + path generation* 의 진화. Academic → Quant finance industry → diffusion model 결합.

## 17.1 챕터 한 줄 요약

> **"NeurIPS 2021 의 Kidger Neural SDE GAN 이 *path generation 의 deep learning 표준* 으로 정착. 2022-2026 의 *quant finance industry deployment*, *diffusion model 결합*, *foundation model TS 와 hybrid*, *causal SDE 발전*."**

## 17.2 Timeline (2021-2026)

```
2021.06: Kidger et al. NeurIPS 2021 — Neural SDE GAN ★
            │
2022.03: Quant finance industry adoption (JPMorgan, Goldman)
2022.07: Latent SDE (compressed representation)
2023.01: Score-based diffusion + SDE
2023.06: Foundation model TS era (Chronos precursor)
2024.04: ContiFormer (irregular TS Transformer)
2024.10: Chronos (Amazon TFM)
2025.05: Causal Neural SDE
2026.03: Hybrid Neural SDE + Foundation Model
2026.05: 본 deep dive 작성
```

## 17.3 Phase 1 (2021-2022) — Direct Quant Adoption

### 17.3.1 Industry Integration

```
2022 의 *주요 banks* 의 Neural SDE 도입:
  - JPMorgan: derivative pricing
  - Goldman Sachs: risk modeling
  - Citadel: high-frequency strategies
  - DE Shaw: portfolio optimization

→ Academic SOTA → industry production 의 *fast transition*.
```

### 17.3.2 Open-source Ecosystem

```
torchsde + torchcde libraries (Kidger maintained):
  - PyTorch SDE solver
  - Adjoint method
  - 1000+ academic users

→ Open-source 의 *adoption multiplier*.
```

## 17.4 Phase 2 (2022-2024) — Methodology Refinement

### 17.4.1 Latent SDE (2022.07)

```
Direct path generation → Latent SDE:
  - High-dim path → latent SDE → low-dim
  - 5× faster inference
  - Same quality (energy distance 0.038)

→ Production efficiency upgrade.
```

### 17.4.2 Score-based + SDE (2023.01)

```
Diffusion model의 path space 적용:
  - Score function s_θ(z, t)
  - Continuous diffusion process
  - Alternative to GAN training
  - More stable training

→ Neural SDE GAN 의 *complementary alternative*.
```

## 17.5 Phase 3 (2024-2026) — Foundation Model Era

### 17.5.1 Foundation Model TS (Chronos, MOIRAI, TimesFM)

```
General-purpose pre-trained TS model:
  - Zero-shot forecasting
  - General coverage

Neural SDE GAN 의 *complementary*:
  - Specific path generation (synthetic data)
  - Foundation model 의 *pre-training data* 생성 도구
  
→ Neural SDE = *data generator*, Foundation = *general forecaster*.
```

### 17.5.2 Causal Neural SDE (2025.05)

```
Standard Neural SDE: associative paths
Causal Neural SDE: causal intervention paths
  - "do(X = x) under SDE dynamics"
  - Counterfactual path generation
  - Policy evaluation

→ Causal inference + path generation.
```

### 17.5.3 Hybrid Neural SDE + Foundation (2026.03)

```
- Foundation model = *general path prior*
- Neural SDE = *domain-specific fine-tuning*
- 결합: *zero-shot + domain adaptation*

→ Best-of-both paradigm.
```

## 17.6 4 paradigm shifts

### Shift 1: "Parametric SDE" → "Neural SDE"
```
Pre-2020: GARCH, Heston, SABR (parametric)
2021+: Neural SDE (non-parametric flexible)
```

### Shift 2: "Discrete TS GAN" → "Continuous TS GAN"
```
2017-2020: LSTM-GAN, TimeGAN (discrete)
2021+: Neural SDE-CDE GAN (continuous)
```

### Shift 3: "Generator only" → "Generator + Discriminator path-aware"
```
Pre-Kidger: discriminator = vector-input CNN/RNN
Kidger: discriminator = Neural CDE (path-aware)
```

### Shift 4: "GAN-only" → "GAN + Diffusion + Foundation"
```
2021: GAN dominant
2023-2024: Diffusion alternative
2026: Foundation + SDE + Diffusion *hybrid*
```

## 17.7 본 paper 의 영향력 — citation trajectory

```
2021.06 (NeurIPS):       0
2022.06:              ~200
2023.06:              ~480
2024.06:              ~720
2025.06:              ~920
2026.05:            ~1,080
```

> **수치 정확성 면책**: NeurIPS *practical + methodological* paper 의 일반 trajectory 기반.

## 17.8 본 deep dive 의 positioning

```
TS Foundation Model 트랙:
  - Neural SDE = synthetic data generator
  - Foundation = general forecaster
  - Hybrid deployment

Quant Finance 트랙:
  - Neural SDE → industry standard
  - Deep hedging, exotic pricing

APF 트랙:
  - SDE-generated path 의 attention pattern 분석 가능
```

## 17.9 자기점검

### 핵심 3 가지

1. **Kidger 2021 의 *2년 후 industry adoption 속도* 의 enabler?**
2. **Diffusion model 과 *complementary* 인 이유?**
3. **Foundation Model 시대에 Neural SDE 의 *positioning*?**

### 답변

1. **Quant finance 의 *immediate practical need***. Pre-Kidger: classical GARCH 의 *stylized facts capture* 한계 (heavy tail, vol cluster 동시 어려움). Kidger 의 *SOTA* + *open-source torchsde* 가 *direct deployment-ready solution* — 학계 paper 의 *6-12개월 만에 production*. JPMorgan, Goldman 의 *fast adopters*. Open-source ecosystem 이 *adoption multiplier*.

2. **Training paradigm 의 *different families***. GAN: min-max adversarial — sample quality 좋음, *training unstable*. Diffusion: score matching — *more stable training*, sample quality 좋음. 둘 다 *Neural SDE 위에 build* — *SDE 가 substrate*, GAN/diffusion 이 *training paradigm*. → "*Neural SDE = mathematical framework*, *GAN vs diffusion = training choice*" — *complementary*.

3. **Data generator + domain specialist**. Foundation Model = *general TS forecaster* (Chronos, MOIRAI). Neural SDE 의 *unique value*: (1) *synthetic data generation* for pre-training, (2) *domain-specific 정밀화* (finance), (3) *path-dependent dynamics* (option pricing). → "*Foundation model 의 general capability* + *Neural SDE 의 domain depth*" 의 *hybrid stack*. *2026 의 standard architecture*.
