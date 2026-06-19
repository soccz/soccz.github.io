# 9. 사고 확장 (A) — 자문 질문 5개

## 배경 사다리

본 절은 deep hedging 의 framework 를 받아들이고 그 다음 자연스럽게 던질 수 있는 자문 질문 5개를 추출하고, 각 질문에 대해 "왜 중요한가" 와 "어떻게 답할 수 있는가" 를 짧게 정리한다.

## Q1 — OCE 손실에서도 grokking phase transition 이 나타나는가?

**왜 중요한가**: Grokking 은 표준 MSE/CE 손실의 implicit bias + weight decay + 작은 데이터 의 setting 에서 train-test gap 의 지연 polarization. OCE 손실 (특히 CVaR 의 hinge) 은 표준 loss 와 본질적으로 다른 implicit regularizer — grokking dynamics 가 OCE 하에서 어떻게 변형되는지는 미답. 만약 grokking 이 OCE 하에서 사라지거나 가속되거나 모양이 바뀐다면, 그 자체로 (i) Grokking-TS track 의 새 실험 axis, (ii) Deep Hedging 의 학습 효율 개선 방향, (iii) implicit regularization 이론에 새로운 case study.

**어떻게 답할 수 있는가**: P2 logistic 4-layer 실험에서 손실 → OCE-CVaR$_{0.95}$ 으로 교체, 동일 weight decay sweep + 동일 데이터 수 sweep. grokking phase transition 의 (i) 발생 여부, (ii) 발생 시점 (delay 길이), (iii) 변화율 (slope) 을 MSE 와 head-to-head 비교. 3주 실험.

## Q2 — Heston-simulator 기반 정책이 실세계 (S&P 옵션 데이터) 에서 얼마나 잘 일반화되는가?

**왜 중요한가**: 본 논문의 가장 큰 한계 (simulator 의존) 의 실증 검증. 후속 Adversarial Deep Hedging 이 정면 공격했지만, 본 논문 자체의 일반화 deficit 의 정량 측정은 부재. "DH 가 BS 보다 우월" 이 simulator 안에서만 성립이라면 production 가치 의문.

**어떻게 답할 수 있는가**: Heston 으로 학습한 정책을 (i) CBOE S&P 옵션 데이터 (2010-2024), (ii) 한국 KOSPI200 옵션 데이터 (KRX) 에서 forward-walking out-of-sample 평가. BS-delta vs DH 의 실제 P&L 분포 비교. 데이터 정합·시간동기화·corporate action 처리에 3개월 소요. 결과 따라 (i) simulator 신뢰성 입증 또는 (ii) Adversarial 변형 필요성 입증.

## Q3 — RNN policy 가 학습한 것이 정확히 무엇인가? (mech-interp)

**왜 중요한가**: 본 논문의 RNN policy 는 "BS-delta 보다 좋다" 는 결과만 보여줌. 그 정책이 정확히 어떤 정책을 학습했는지 — (a) Davis-Norman 의 no-trade region 을 emergent 하게 발견했는지, (b) 새로운 비자명 패턴인지 — 미답. mech-interp 가 답해야 할 자연스러운 질문.

**어떻게 답할 수 있는가**: APF 의 motif probe + Grokking-TS 의 circuit analysis 를 deep hedging RNN 에 이식. (i) Activation patching 으로 어떤 입력 채널이 정책 출력에 가장 영향, (ii) Sparse Feature Circuits (Marks 2024) 로 RNN hidden 의 dictionary learning, (iii) ACDC (Conmy 2023) 로 회로 자동 발견. 결과: "거래비용 → action throttling" 의 명시적 회로 발견 기대.

## Q4 — Crypto 옵션 (BTC, ETH) 의 deep hedging 은 어떻게 다른가?

**왜 중요한가**: 🔴 AETHER 의 직접 연결. Crypto 옵션 (Deribit, OKX 등) 은 (i) 24/7 거래, (ii) 펀딩비 (perpetual swap) 의 거래비용 흡수, (iii) 변동성이 주식보다 5~10배 큼, (iv) 변동성 표면이 더 비대칭 (negative skew 가 강함). 본 논문 framework 가 이 차원에서 어떻게 조정되는지 미답.

**어떻게 답할 수 있는가**: SimpleWorld_Spot_ATM 을 BTC parameter 로 calibration (vol 0.80, drift 0.40, mean reversion 약함). 옵션 거래비용을 perpetual funding rate 의 absolute value 로 modeling. Hyperliquid 또는 Deribit 의 실제 funding history 로 cost term 보정. 결과: BS-delta vs DH 의 crypto-specific 격차 측정.

## Q5 — 시장 마찰의 "비대칭" 이 무엇을 함의하는가?

**왜 중요한가**: 본 논문의 거래비용은 대칭 (buy/sell 같은 비용). 실제는 비대칭 — long 포지션은 buy spread, short 포지션은 borrow cost + recall risk. crypto 의 funding rate 도 long/short 비대칭. 이 비대칭이 정책에 어떤 emergent 효과를 주는지 — directional bias, end-of-day position 의 쏠림 — 미답.

**어떻게 답할 수 있는가**: cost term 을 $c_k^+ \delta_t^+ + c_k^- \delta_t^-$ 로 분리 (long/short 비대칭). Heston simulator 위에서 비대칭 sweep ($c^+/c^-$ ratio 0.5 → 1.0 → 2.0). 정책의 directional bias 측정: 시점 평균 $\bar{\delta}_t$ 의 시간 의존성. 추가 분석: 비대칭이 클 때 정책이 "한쪽 헤지만 적극 + 다른 쪽은 underhedge" 의 emergent 비대칭 보이는지.

## 메타 질문 — 위 5개 질문의 공통 패턴

모두 (a) 본 논문의 어떤 가정·축을 갈아끼우고 (b) 학습된 정책의 emergent 특성을 mech-interp / 일반화 / cross-domain 의 측면에서 측정. **Deep hedging 의 framework 가 axis 별로 분해 가능** 한 본 논문의 구조 때문에 가능한 질문들. 이게 본 논문이 "분기점" 인 이유의 사용자 관점 확인.

## 핵심 한 문장

> **"5개 질문 모두 'simulator / loss / policy class / cost / domain' 중 한 axis 만 갈아끼우는 형태 — 본 논문의 framework decomposition 이 만든 자연스러운 후속 질문 격자."**
