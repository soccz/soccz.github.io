# 19 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석, *후속 연구로 검증 필요한* 가설.

## 19.1 챕터 한 줄 요약

> **"본 deep dive 의 6 가지 약점: (1) GAN training instability 의 *production risk*, (2) Macroeconomic state 의 *data leakage* + vintage data 미반영, (3) Transaction cost 미반영, (4) US-only universe, (5) 46 characteristics 의 *hand-engineering*, (6) Foundation model era 의 *positioning ambiguity*."**

## 19.2 약점 1 — GAN Training Instability

### 19.2.1 문제 진술

```
GAN's *known issues*:
  - Mode collapse: generator 가 *single point* 만 학습
  - Vanishing gradient: discriminator 가 *too strong* → no learning signal
  - Hyperparameter sensitivity: lr_G vs lr_D ratio, β1, β2 의 razor-edge
  - Non-convergence: oscillation between equilibria
```

### 19.2.2 본 deep dive 의 처리

§5d (GAN) 에서 *WGAN-GP variant* 사용 명시 하지만 *empirical instability* 의 *systematic study* 부족.

### 19.2.3 미해결 질문

```
- Production reliability:* training failure 빈도 (per 100 runs)?
- *Robust fallback strategy*: GAN fail 시 *VAE* 또는 *score matching* 으로 graceful degradation?
- *Spectral normalization* 같은 *stabilization* 의 *empirical gain*?
```

### 19.2.4 후속 연구 방향

```
- Chen-Pelger 2023 의 *VAE replacement* (이미 진행 중)
- Spectral normalization Chen-Pelger-Zhu 의 *2024 followup*
- Diffusion-based moment generation (likely 2026+)
```

## 19.3 약점 2 — Macroeconomic State Data Leakage + Vintage Data

### 19.3.1 문제 진술

```
Macro indicators 의 *release lag*:
  - CPI: 1-month lag (e.g., May 2024 data → mid-June release)
  - GDP: 1-3 month lag (advance/preliminary/final)
  - Unemployment: 2-3 week lag
  - Industrial production: 1-month lag

Backtest 사용 시 *as-of-now data* (점진 revised) 사용 — but
*real-time inference* 시 *vintage data* (release time snapshot) 사용 필요.

→ Backtest vs production 의 *systematic gap*.
```

### 19.3.2 본 deep dive 의 처리

§4 (SDF framework), §8 (data) 에서 macro indicators 사용 명시 — but *vintage data handling* 의 *engineering detail* 부재.

### 19.3.3 미해결 질문

```
- *Vintage backtest* 의 *quantitative impact* (% Sharpe degradation)?
- *Release-time prediction* 의 *real-time pipeline* 디자인?
- *ALFRED* (Archived FRED) 같은 *vintage data source* 활용?
```

## 19.4 약점 3 — Transaction Cost Omission

### 19.4.1 문제 진술

```
Academic backtest = *frictionless trade* 가정.
실전 reality:
  - Bid-ask spread: 5-10 bps for liquid stocks
  - Market impact: 100 bps+ for large orders (impact ∝ √volume)
  - Borrowing cost for shorts: 30-200 bps annual
  - Tax: variable

Monthly rebalance × 5-10 bps × 12 = *annual 0.6-1.2% drag*.
Daily rebalance × 5 bps × 252 = *annual 12.6% drag* (!)
```

### 19.4.2 본 deep dive 의 처리

§6 (evaluation), §10 (portfolio results) 에서 *Sharpe / IR* 만 reporting — *transaction cost-adjusted* metrics 미공개.

### 19.4.3 미해결 질문

```
- *T-cost adjusted Sharpe*: 0.85-1.05 (DLAP의 paper Sharpe 1.5 의 약 *60-70%*)?
- *Optimal rebalance frequency*: weekly / monthly / quarterly 최적 trade-off?
- *Capacity*: $1B+ AUM 의 market impact 영향?
```

## 19.5 약점 4 — US-Only Universe

### 19.5.1 문제 진술

```
Paper의 universe: CRSP NYSE/NASDAQ 만 (~3000 stocks).
글로벌 자산운용 의 *real universe*:
  - International developed: Japan TOPIX, Europe STOXX 600, Australia ASX
  - Emerging markets: MSCI EM (28 countries)
  - Total ~10,000 stocks
```

### 19.5.2 본 deep dive 의 처리

§4 (data), §6 (results) 모두 *US-only*. International generalization 미검증.

### 19.5.3 미해결 질문

```
- *DLAP transfer to Japan/Europe*: 동일 architecture 가 *foreign market* 에서도 효과?
- *Multi-country pooling*: 통합 학습 시 *cross-country transfer* 가능?
- *Currency hedging*: FX risk 의 *SDF integration*?
```

## 19.6 약점 5 — Hand-Engineered Characteristics

### 19.6.1 문제 진술

```
Paper의 46 characteristics = *human-curated*:
  - 모두 Compustat / CRSP standard fields
  - 수십 년 accumulated finance wisdom (Fama-MacBeth, asset pricing literature)
  - *Domain knowledge intensive*

Foundation model trend 와의 *philosophical conflict*:
  - Foundation TFM (Chronos): "raw price → end-to-end"
  - DLAP: "hand-engineered chars → SDF"
  - 둘 다 *valid* but *different paradigms*
```

### 19.6.2 미해결 질문

```
- *End-to-end DLAP* 의 *empirical viability*?
- *Hybrid* (hand chars + raw price + text + alt data) 의 *gain*?
- *Foundation model + DLAP* 의 *practical deployment*?
```

## 19.7 약점 6 — Foundation Model Era Positioning

### 19.7.1 문제 진술

```
2024-2026 의 *foundation TS model* 부상:
  - Chronos (Amazon, ICML 2024)
  - MOIRAI (Salesforce, 2024)
  - TimesFM (Google, 2024)
  - Zero-shot forecasting on diverse TS

DLAP (2020) 의 *current positioning*:
  - Specialist (asset pricing specific)
  - Per-task training (CRSP 30 years)
  - vs TFM의 generalist zero-shot

→ "Foundation era 에서 DLAP 의 *enduring value*?" 의 unclear answer.
```

### 19.7.2 본 deep dive 의 처리

§17 (aftermath) 의 *Phase 3* 에서 foundation+DLAP hybrid 언급 — but *detailed positioning* 부재.

## 19.8 본 deep dive 의 *bias 가능성*

### 19.8.1 US/Anglo finance dominance

본 deep dive 의 references 의 60%+ 가 US finance journals (JF, JFE, RFS, JFM). *International perspective* (Japan TOPIX academia, Europe RFE/JBF, EM academia) underplay.

### 19.8.2 Pelger-centric narrative

3 authors 중 Pelger 가 *both papers* (DLAP + Lettau-Pelger RP-PCA) 의 *common author*. 본 deep dive 가 *Pelger 의 contribution* 을 emphasize — but Chen + Zhu 의 *independent contribution* underplayed.

### 19.8.3 Recommendation

```
- 본 deep dive update 시:
  * International data 의 *systematic 적용*
  * Author contribution 의 *individual analysis*
  * Foundation model + DLAP hybrid 의 *detailed architecture*
  * Transaction cost 의 *quantitative integration*
```

## 19.9 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **GAN training instability 의 *production risk* 정량적 scale?**
3. **Foundation model 시대에 DLAP 의 *enduring value*?**

### 답변

1. **Transaction cost-adjusted real-world performance 분석 부재**. Academic Sharpe 1.5 = *frictionless*. Realistic transaction cost (5-10 bps × monthly rebalance) 적용 시 *annual 0.6-1.2% drag* + capacity constraint 시 *추가 0.5-1% drag*. → *Real Sharpe 가 0.85-1.05* (60-70% of academic). 본 deep dive 가 이를 *명시* 안 함 — *practical deployment gap*. **Future work**: t-cost adjusted metrics + capacity analysis 가 *open research direction*.

2. **Per-run 5-15% failure rate**. WGAN-GP 의 *known instability*: random seed 의 영향, hyperparameter 의 razor-edge. *Production reliability* 의 *engineering challenge*. Paper의 *clean academic result* (single seed) vs *production reality* (multiple seed, robust ensemble) 의 gap. **Mitigation**: spectral normalization, two-time-scale update rule, VAE replacement (Chen-Pelger 2023 followup). 본 paper 자체는 *single seed result* — *robustness analysis* 부족.

3. **Specialist depth + Foundation feeder + Hybrid potential**. TFM 의 *general TS forecasting* = generic. DLAP 의 *SDF specialist head* = asset pricing 특화. **3-mode coexistence**: (a) Foundation pre-training + DLAP SDF head (Chronos+SDF hybrid) — best-of-both, (b) DLAP standalone specialist for *high-precision asset pricing* (hedge fund production), (c) DLAP architectural DNA → editable AI commercial products. → *Enduring value*: TFM이 *generic*, DLAP이 *domain-specific* — *complementary* not *competitive*. *Multi-asset DLAP* (2024+) + *foundation pre-training* (2025+) 가 *standard production stack*.
