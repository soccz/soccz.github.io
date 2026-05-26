# 10. 결론

> **🧒 한 줄 요약**: Conclusion. Deep learning + asset pricing 의 *empirical SOTA*.


> Section 5 (journal p.446–447) — 종합 메시지와 향후 연구 방향.

## 10.1 챕터 한 줄 요약

조건부 오토인코더 (CA) 가 **(a) 전통적 PCA 와 IPCA 를 모두 특수 케이스로 포함**, **(b) 비선형 노출도 자동 학습**, **(c) no-arbitrage 자동 강제**, **(d) OOS Sharpe ≈ 1.5 의 압도적 운용 성과** 를 동시에 달성. ML 과 자산가격결정의 연결을 한 단계 진전.

---

## 10.2 본 논문의 4가지 주요 기여

### 기여 1: 학계 갭 메우기

| 기존 도구 | 한계 |
|-----------|------|
| FF (K=1~6, linear, unconditional) | 시간 불변 β |
| PCA (latent, unconditional) | z 정보 미사용 |
| IPCA / KPS (linear, conditional) | 선형 β |

| 본 논문 | 확장 |
|---------|------|
| **CA1–CA3** (nonlinear, conditional) | 모두 통합 + nonlinearity |

→ 4개 모델 패러다임을 **한 framework** 로 통일.

### 기여 2: 두 가지 동치성 증명

- **Proposition 1**: 1-layer 선형 standard autoencoder = PCA.
- **Proposition 2**: 1-layer 선형 conditional autoencoder = IPCA.

→ 본 모델이 **기존 ML 도구와 기존 계량경제 도구의 자연스러운 일반화** 임을 수학적으로 보장.

### 기여 3: 강력한 실증 결과 (paper Tables 1–3, Fig 3, K=6 기준)

| 지표 | FF (K=6) | IPCA | CA2 | 향상 (FF→CA2) |
|------|---------|------|-----|----------------|
| Total R² (%) | −6.1 | 14.5 | 13.8 | 음수 → +13.8 |
| Predictive R² (%) | <0 | 0.30 | 0.58 | 음수 → +0.58 |
| EW LS Sharpe | −0.21 | 2.25 | 2.63 | 음수 → +2.63 |
| VW LS Sharpe | −0.53 | 0.96 | 1.53 | 음수 → +1.53 |
| # \|t(α)\|>3 (out of 95) | 37 (FF5, K=5) | — | 8 (CA2, K=5) | −78% |

→ **모든 지표에서 압도적 우위**. 60년 OOS 라는 가장 엄격한 검증 통과.

### 기여 4: 해석 가능성 (paper Section 3.6 발견)

- **Top 20 특성이 contribution 의 ~90%** (CA1–CA3) — Cochrane (2011) 의 "Factor Zoo" 비판에 답.
- **3 카테고리 (price trend, liquidity, risk)** 가 일관되게 top — 모든 CA 모델 + Gu-Kelly-Xiu (2019) supervised ML 과 일치.
- → "ML = black box" 비판 반박.

---

## 10.3 경제학적 함의

### 10.3.1 No-Arbitrage 의 ML 적 강제

본 논문의 핵심 통찰: **모델 아키텍처에 α 를 빼고 r = β'f 만 두면**, 학습된 모델은 자동으로 no-arbitrage 와 일치.

→ ML 이 경제이론과 충돌하지 않고 **이론을 강제하는 방향으로 사용** 될 수 있음.

### 10.3.2 "Sparsity" 의 강력한 실증 증거

94 개 특성 중 **top 20 이 contribution 의 ~90%** (paper Section 3.6, Figs. 4–5).

→ Cochrane 의 "Factor Zoo" 비판이 옳음. 학계는 다음 연구에서 **새 factor 발견** 보다 **기존 factor 의 통합** 에 집중해야.

### 10.3.3 Nonlinearity 의 본질적 역할

Predictive R² 가 IPCA 0.30 → CA2 0.58 (≈ 1.9x, paper Table 2 K=6).
- 이 격차는 **선형 모델로는 본질적으로 회복 불가능**.
- → 미래 모든 conditional factor model 은 **nonlinearity 를 고려해야**.

---

## 10.4 ML 관점의 함의

### (1) Domain-Aware Architecture Design

표준 autoencoder 는 reconstruction loss $\| x - \hat x \|^2$ 만 최소화 (unsupervised).

본 논문의 conditional autoencoder 는:
- **Two-input** (z 와 r) → dual encoder.
- **Domain-specific output structure**: dot product β'f.
- → ML 도구를 **도메인 (자산가격결정) 에 맞춰 재설계** 하는 모범.

이 패턴은 다른 도메인에도 적용 가능:
- **추천 시스템**: user × item dot product.
- **NLP**: query × document dot product.
- **신약 발견**: protein × drug dot product.

### (2) Regularization Mix 의 효과

본 논문이 사용한 5중 정규화 (LASSO + early stopping + ensemble + Adam + batch norm) 는:
- 낮은 SNR (금융) 환경에 특화.
- → 의료, 환경 등 비슷한 환경에 응용 가능.

### (3) Out-of-Sample 평가 표준

본 논문의 30년 rolling OOS 는 ML 분야의 표준보다 훨씬 엄격.
- 보통 ML 논문은 random train/test split.
- 금융처럼 시간 의존 데이터에서는 **chronological split + rolling retrain** 필수.

---

## 10.5 향후 연구 방향 (본 해체의 제안)

**참고**: paper Section 5 의 결론은 본 모델의 강점 요약만 담음. 아래는 본 해체가 학계 후속 방향으로 추가 제안:

### (1) Cross-Asset Class 확장

본 논문은 미국 보통주만. 확장 가능:
- **채권 (Treasury, corporate)**: 만기, credit rating 등 특성으로.
- **외환 (FX)**: macro 변수로.
- **상품 (commodity)**: 재고, 계절성으로.
- **암호화폐**: on-chain 특성으로.

### (2) Cross-Section vs Time-Series Integration

본 모델은 cross-sectional 학습 (시점별 N 개 자산). 시계열 정보 (예: macro state, regime) 통합:
- **Recurrent NN** (LSTM/GRU) 으로 시점 정보 추가.
- **Macro variable** 을 z 에 추가.

### (3) Transaction Cost / Capacity Constraints

본 논문의 Sharpe 1.5 는 **거래비용 가정 없음**. 실제 운용에서:
- 매월 rebalance → 거래비용 ≈ 0.1-0.5%/거래.
- 큰 운용규모 → 시장충격 (price impact).
- → 본 모델을 **trader-realistic** 환경에 맞춰야.

### (4) Interpretability 강화

본 논문은 variable importance (zero-out R² reduction) + β/factor network 분리 importance. 더 발전된 도구:
- **SHAP values**: 각 예측에 대한 특성 기여도 분해.
- **Partial dependence / Interaction plots**: 비선형 함수형 시각화 (paper 본문 미발표).
- **Causal inference**: 특성 → 수익률의 **인과** 관계 (correlation 너머).

### (5) High-Frequency Extension

본 논문은 월간. 일/시간/분 단위로 확장:
- **Tick-level data**: microstructure 정보.
- **Realized volatility**: 더 정교한 volatility factor.
- 단점: data 양이 폭증, computational cost 증가.

---

## 10.6 본 논문의 학술적 위치 (재확인)

```
┌──────────────────────────────────────────────────┐
│         Asset Pricing 의 진화                    │
│                                                  │
│  CAPM (1964)                                     │
│    │                                             │
│    ▼  단일 요인                                   │
│  Fama-French 3 (1993)                            │
│    │                                             │
│    ▼  static, observable factors                 │
│  PCA factor models (Connor & Korajczyk 1986)     │
│    │                                             │
│    ▼  latent, static                             │
│  KPS / IPCA (2019)                               │
│    │                                             │
│    ▼  conditional, linear                        │
│  ┌──────────────────┐                            │
│  │  본 논문 (2021) │  ◄── conditional + nonlinear│
│  └──────────────────┘                            │
│    │                                             │
│    ▼  ?                                          │
│  (Future): cross-asset, causal, HF, RL           │
└──────────────────────────────────────────────────┘
```

본 논문은 **30년에 걸친 자산가격결정 발전의 연속선상** 에 자연스럽게 위치. ML 이라는 새 도구를 **경제이론에 충실** 하게 통합한 모범.

---

## 10.7 가장 강력한 한 문장

만약 본 논문을 **딱 한 문장으로 요약** 한다면:

> **"오토인코더의 비선형성을 빌리되 자산가격결정의 no-arbitrage 를 강제함으로써, 우리는 60년 OOS 에서 모든 기존 모델을 압도하는 자산가격결정 모델을 얻었다."**

이 한 문장이 본 논문의:
- **방법론** (오토인코더 + no-arbitrage)
- **결과** (60년 OOS 압도)
- **기여** (ML 과 자산가격결정의 통합)

을 모두 포착.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. 본 논문이 4가지 기존 패러다임 (FF, PCA, IPCA, ML) 을 통합한다는 의미는?
2. No-arbitrage 가 ML 적으로 강제되는 메커니즘은?
3. 본 논문 이후 가장 자연스러운 후속 연구 1가지를 제안한다면?

### 답변
1. FF (linear, unconditional) ⊂ CA0/IPCA (linear, conditional) ⊂ CA1–3 (nonlinear, conditional). PCA 도 standard autoencoder 의 특수 케이스 (Prop. 1). 따라서 **CA 가 4 가지 모두를 포함하는 가장 일반적 모델**, 데이터가 어느 케이스에 가까운지에 따라 자동 적응.
2. 모델 아키텍처에 **절편 α 를 제외**. r = β'f 만 두면 학습된 β, f 가 어떤 형태든 r = α + β'f 의 α 부분이 0 으로 강제됨. → 학습된 모델이 자동으로 no-arbitrage 만족.
3. **Time-varying volatility 통합**: 본 논문은 잔차 분산이 cross-sectional 으로만 변동. 실제는 시계열 (regime, market stress) 변동도 큼. GARCH-NN 같은 hybrid 모델로 확장. → SR 이 더 높아지고 위기 시 drawdown 감소 기대.
