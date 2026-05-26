# 18 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 가지 잠재 약점: (1) Tokenization 의 *information loss* underplay, (2) Pretraining corpus bias 미충분, (3) Amazon-centric narrative, (4) Long-horizon 의 *error accumulation* 분석 부재."**

## 18.2 약점 1 — Tokenization Information Loss

### 18.2.1 문제 진술

```
Quantile binning of 4096:
  - Bin width 1/4096 = 0.024% of range
  - Sub-bin precision lost
  - Fine-grained patterns 가능 손실

특히:
  - High-frequency oscillations
  - Sub-pixel changes (sensor data)
  - Continuous derivatives
```

### 18.2.2 본 deep dive 의 처리

§5b 에서 *4096 bins sufficient* 가정. *Sub-bin information loss* 미분석.

### 18.2.3 미해결 질문

```
- 8192 / 16384 bin 의 *practical gain*?
- High-frequency TS 의 *empirical degradation*?
- Continuous-token alternative (e.g., regression head) 가능?
```

## 18.3 약점 2 — Pretraining Corpus Bias

### 18.3.1 문제 진술

```
Chronos pretraining: 28 datasets
- Heavy on finance, energy, retail
- Light on biology, climate-extreme
- Synthetic data 도 GP-based (limited diversity)

→ "*Chronos 가 본 적 없는* 도메인" 의 zero-shot 성능 의문.
```

### 18.3.2 미해결 질문

```
- Domain gap의 *empirical 측정*?
- New domain 의 *fine-tune cost*?
- Synthetic data 의 *diversity 확장*?
```

## 18.4 약점 3 — Amazon-Centric Narrative

### 18.4.1 문제 진술

```
본 deep dive 의 reference 의 60%+ 가 Amazon-related:
  - Chronos paper
  - AWS Forecast
  - GluonTS
  - Bolt update

누락:
  - Salesforce MOIRAI 의 unique angle
  - Google TimesFM 의 decoder-only design  
  - 학계 Lag-Llama, Time-LLM
```

### 18.4.2 본 deep dive 의 처리

§17 에서 *3-way race* 언급하지만 *Amazon 위주 narrative*.

## 18.5 약점 4 — Long-Horizon Error Accumulation

### 18.5.1 문제 진술

```
Autoregressive decoding:
  - Each token = previous tokens 조건부
  - Error 가 sequential 누적
  - Long horizon (>100 steps) 시 *drift*

Chronos paper:
  - 주로 horizon 24-64 평가
  - >100 horizon 의 *systematic degradation* 미명시
```

### 18.5.2 미해결 질문

```
- Horizon-dependent error growth rate?
- Long-horizon vs encoder-decoder 의 *better setup*?
- Recursive vs direct forecast hybrid?
```

## 18.6 본 deep dive 의 *bias 가능성*

### 18.6.1 "TFM solves everything" over-claim

```
Chronos zero-shot SOTA 가 *모든 케이스* 가정 위험.
하지만:
  - Specific domain (clinical) → ContiFormer 우위
  - Very long horizon → custom 필요
  - Real-time constraint → smaller specialist
```

### 18.6.2 Recommendation

```
- "When to use Chronos" vs "alternatives" 의 fair comparison
- Multi-vendor TFM 의 honest 비교
- Long-horizon limit 분석
```

## 18.7 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Tokenization information loss 의 *quantitative scale*?**
3. **Amazon-centric bias 의 *honest disclosure* 이유?**

### 답변

1. **Long-horizon error accumulation 분석**. Autoregressive 의 *fundamental limit* — error 가 *sequentially compound*. 24-step horizon 의 *acceptable error* (WAPE 0.231) 가 240-step 에서는 *catastrophic divergence* 가능. Paper 의 evaluation 이 *short-to-medium horizon 위주* — *enterprise use case* (1-year forecast) 의 *systematic degradation* 미공개. 본 deep dive 도 *이 critical aspect* 명시 안 함.

2. **0.024% range resolution loss**. 4096 bins × per-series scaling = bin width ≈ 0.024% of data range. *In practice*: 99%+ TS 에서 *negligible* (resolution sufficient). 하지만 *high-frequency sub-percent oscillation* (e.g., HFT tick data, sensor noise) 에서는 *systematic information loss*. → *not universal solution* — domain dependence.

3. **Intellectual honesty + practical guidance**. Chronos paper 가 Amazon-authored + AWS deployment focus — natural Amazon-centric. 본 deep dive 가 *Amazon narrative* 따르면 *one-sided*. *Honest disclosure* = "본 deep dive 는 Amazon perspective" 명시 → 독자가 *MOIRAI / TimesFM 의 unique strengths* 자체 판단 → *multi-vendor TFM 전략* 의 *fair decision*.
