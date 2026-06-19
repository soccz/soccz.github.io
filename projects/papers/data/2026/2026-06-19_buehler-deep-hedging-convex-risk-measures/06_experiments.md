# 5. 실험 해부

## 배경 사다리

이 절은 본 논문의 실험 setup·표·그림을 해체한다. **본 환경 본문 PDF 차단** 으로 정확한 표·그림 절대 수치 (P&L 평균, ES 절댓값 등) 는 단정 불가. WebSearch 인덱스 + 저자 GitHub 코드 + 후속 논문의 본 논문 인용에서 재구성한 setup 만 단정. ① **Monte Carlo benchmark** = 시뮬레이션 경로 N 개에서 통계로 평가, ② **out-of-sample** = 학습 안 본 경로로 평가, ③ **risk-adjusted price** = trader 가 받아야 할 OCE 등가 수수료 — 이 셋이 평가의 축.

## 실험 setup (verbatim 확보분)

### 시장 모형

- **Heston model** (WebSearch 인덱스 verbatim: "synthetic market driven by the Heston model")
  - 스팟: $dS_t = \mu S_t dt + \sqrt{v_t} S_t dW^S_t$
  - 변동성: $dv_t = \kappa(\theta - v_t)dt + \xi\sqrt{v_t}dW^v_t$
  - 상관: $d\langle W^S, W^v\rangle_t = \rho dt$
  - **정확한 파라미터 (κ, θ, ξ, ρ, v_0) 값**: 본 환경에서 단정 불가 — 원문 표 차단. 저자 코드 `SimpleWorld_Spot_ATM` 디폴트는 vol = 0.20 (annualized), drift = 0.10, mean reversion 설정 가능.
- **Black-Scholes 비교** (baseline 으로 등장 — closed-form BS-delta 와 비교)

### 옵션

- **단일 ATM 콜옵션** (만기 $T$ 이고 행사가 = 현 스팟) 의 헤지가 메인 케이스.
- 다수 옵션 portfolio 의 high-dim setting 도 추가 — "feasible in a high-dimensional setting" verbatim.

### 헤지 도구

- **스팟 자체** — primary hedging instrument.
- **추가 옵션** (스팟 외 vega 헤지용) — high-dim setting 에서 활성.

### 거래비용

- **proportional** $c_k(\delta_t - \delta_{t-1}) = \gamma |\delta_t - \delta_{t-1}| S_t$.
- 디폴트 $\gamma_{spot} = 2$ bp, $\gamma_{option} = 200$ bp (저자 코드 verbatim).
- $\gamma$ 를 0 → 양수로 sweep 하며 BS-delta 대비 DH 우월성의 거리를 측정 — 핵심 figure.

### 시간 그리드

- $M$ 스텝 (디폴트 10) × $dt = 0.02$ (1주) → 총 horizon 0.2 년.
- 더 큰 $M$ (50, 100) 도 실험 — recurrence 의 효과 평가.

### 손실 (risk measure)

- **Entropic** ($\lambda = 1.0$ 디폴트) — 메인 결과.
- **CVaR** ($\alpha = 0.5$ 데모용, 실무용 0.95) — 보조 결과.

### 학습 setup

- depth=3 width=20 ReLU MLP.
- Adam lr=1e-3, 100 epochs, full-batch (1000 paths).
- out-of-sample: 10000 paths 별도 생성하여 evaluation — **정확한 평가 N** 은 본 환경에서 미확인.

## 데이터셋 적합성

이 setup 이 본 논문 주장에 적합한가? 각 차원에서:

### Heston 의 정당성

- **장점**: stochastic vol 의 표준 모형 — implied vol smile 의 정성적 재현. incomplete market 의 표준 toy.
- **숨은 편향**: (i) Heston 은 **continuous path** — jump 가 없다. 실제 시장의 fat-tail 사건 (코로나 2020, 리먼 2008) 미반영. (ii) $\kappa, \theta, \xi$ 의 calibration 이 fix — implied vol surface 의 시간 동학 미반영. (iii) **drift $\mu$ 가 상수** — drift estimation 의 어려움 (1% 추정에 50년 데이터 필요) 회피.
- **본 논문 setting 에 맞는가**: 헤징은 본질적으로 $\mathbb{E}_\mathbb{Q}$ 하 (risk-neutral) 가 아닌 $\mathbb{P}$ 하 (실세계) 의 분포를 직접 평가. Heston 이 toy 임을 인정한 채 "그래도 incomplete market 에서 학습이 가능" 의 입증으로 OK. 단 실세계 일반화는 별도 평가 필요 — 후속 Adversarial Deep Hedging 의 공격 지점.

### 거래비용 sweep 의 정당성

- $\gamma = 0$ → 양수로 sweep 하면서 "BS-delta vs DH" gap 의 monotone 증가 — 본 논문 핵심 narrative. $\gamma = 0$ 에서 둘이 거의 같음 (sanity), $\gamma > 0$ 에서 DH 가 점차 우월. 이게 "거래비용을 인식하는 정책" 의 가치를 직접 보임.

## 베이스라인 공정성

### BS-delta 헤지 (baseline)

- $\delta^{BS}_t = N(d_1)$ 의 closed-form. 거래비용 0 가정 하에 도출.
- **공정성 문제**: 거래비용 $\gamma > 0$ 인 setting 에 BS-delta 를 그냥 끼우는 건 약간 strawman — BS 는 거래비용을 모름. 더 공정한 baseline 은 **Whalley-Wilmott no-trade band** 또는 **Davis-Norman 의 자유경계** 인데, 본 환경에서 본 논문이 이들을 비교에 포함했는지 단정 불가.

### Risk-neutral baseline

- 본 논문이 추가로 risk-neutral utility ($u(x) = x$) 하 DH 학습 결과를 BS-delta 와 비교했을 가능성 — sanity check. 이 경우 거래비용 0 면 둘이 같아야 함.

### 다수 헤지 도구 baseline

- vega 헤지를 위해 옵션을 추가 사용할 때, 분석 baseline 은 **BS-delta + BS-vega 매칭** — but BS 는 vega = $\partial C/\partial \sigma$ 로 정의된 1계 헤지뿐. higher-order 헤지가 BS framework 에서 안 됨. DH 는 자연스럽게 처리.

## 지표 선택

### OCE risk 값 (primary)

- $\rho(L^{DH}) - \rho(L^{BS})$ — risk 측도 단위로 평가. **숫자가 작으면 좋음**.
- 단위가 통화 (예: USD) 이므로 직접 해석 가능.

### CVaR 의 별도 보고

- $\rho^{ent}$ 로 학습했더라도 $\rho^{CVaR_{0.95}}$ 를 별도 측정 — 다른 risk measure 에서도 잘 작동하는지 robustness check.

### P&L 히스토그램

- 단일 숫자가 아니라 분포 자체. "꼬리가 얼마나 줄었는가" 시각화.

### 학습 시간 / 추론 시간

- production 도입 가능성. 학습은 GPU 시간 단위, 추론은 ms 단위.

### 정확한 수치

본 환경 본문 PDF 차단으로 다음은 단정 불가:
- BS vs DH 의 OCE risk 절대 수치
- 거래비용 sweep curve 의 정확한 break-even 지점
- 다수 헤지 도구 setting 의 정확한 차원 수와 결과
- 학습 시간 / GPU 시간

후속 논문이 본 논문의 정확한 표를 reproduce 했는지 추적은 향후 follow-up.

## 주요 그림 추정 해석 (Figure 1~5)

원문 본문에서 figure 번호와 정확한 내용은 단정 불가. 후속 인용 패턴과 저자 GitHub 의 6-panel 시각화에서 추정한 figure 구조:

### Figure (추정) — 거래비용 sweep curve

- $x$: 거래비용 $\gamma$ (0 → 0.001 → ... → 0.01 등)
- $y$: $\rho^{ent}_\lambda(L^{\cdot})$
- 두 선: BS-delta vs DH
- 해석: $\gamma = 0$ 에서 둘이 거의 같음, $\gamma$ 증가 시 BS 가 가파르게 악화, DH 는 완만 — gap 이 monotone 증가.

### Figure (추정) — P&L 히스토그램

- $\gamma$ 고정 (예: 5bp) 에서 BS vs DH 의 P&L 분포.
- DH 의 분포가 (i) 평균은 비슷하거나 약간 낮을 수 있지만 (ii) **왼쪽 꼬리 (큰 손실) 가 잘림** — CVaR / Entropic 측도 하 우월.

### Figure (추정) — Actions over time

- 각 시점 $t$ 에서 BS-delta vs DH-action 을 path 평균/percentile 비교.
- DH 의 action 이 BS-delta 의 step-change 보다 **부드러움** — 거래비용 회피의 직접 증거.

### Figure (추정) — Risk-adjusted price 비교

- "거래자가 받아야 할 최소 수수료" 의 BS vs DH 비교.
- DH 가 더 낮은 risk-adjusted price 를 가능케 함 — 시장 경쟁력 향상의 직접 함의.

## Ablation

저자가 자연스럽게 포함했을 가능성:

1. **Network depth/width sweep** — 작은 네트워크 (depth=1) 도 충분한가, 큰 (depth=10) 이 필요한가.
2. **Recurrence on/off** — 4종 recurrence 중 어떤 게 가장 도움.
3. **$\lambda$ sweep** — 위험회피 강도가 정책에 미치는 영향.
4. **Time grid 미세도** — $M = 10, 50, 100$ 비교 — 더 많은 의사결정 시점이 DH 우월성을 증가시키는지.

본 환경에서 정확한 ablation 표 단정 불가.

## 부록에 숨은 신호 (추정)

저자 본인의 후속 자료 (EPFL 발표, Imperial 슬라이드 — 본 환경 차단) 가 "appendix details" 를 인용하는 패턴으로 미루어:
- 학습 시드별 분산 보고
- BS-delta 의 정확한 implementation (Heston 의 closed-form delta 사용 — Heston-delta 와 BS-delta 의 차이 별도 검토)
- 시장 충격 (impact) 의 별도 소절 (가능)
- VaR / ES 의 BS vs DH 비교 (CVaR 와 별도)

이들은 본 환경에서 PDF 미확인.

## 핵심 한 문장

> **"실험은 'Heston + 비례 거래비용' 의 단순한 toy 위에서 BS-delta 의 우월성이 거래비용 sweep 으로 무너지고 DH 가 자리잡는 narrative 를 보이는 것이 메인 — 정확한 절대 수치는 본 환경 본문 PDF 차단으로 단정 불가, narrative 의 구조 자체는 후속 인용 패턴과 저자 GitHub 의 6-panel 표준 시각화로 검증 가능."**
