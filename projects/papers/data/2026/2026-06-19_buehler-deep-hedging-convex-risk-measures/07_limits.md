# 6. 가정·한계·반박

## 배경 사다리

이 절은 본 논문의 (a) 저자가 명시한 가정, (b) 말 안 했지만 깔린 암묵적 가정, (c) 반박 가능한 지점을 정리한다. 본 환경 본문 PDF 차단으로 (a) 의 정확한 텍스트는 단정 불가 — 후속 인용 논문들이 "본 논문의 한계" 로 명시 지적한 내용에서 역추정 + 표준 deep hedging 비판 문헌의 합의로 보강.

## 명시된 가정 (추정)

원문 §2 의 "assumptions" 절에 다음이 포함될 가능성이 높다:

1. **이산시간** $0 = t_0 < t_1 < \cdots < t_M = T$ 의 거래 그리드. 연속거래 한계는 부록 또는 별도 논의.
2. **유한 horizon** $T < \infty$. infinite horizon 은 별도.
3. **$\mathcal{H}_{adm}$** 의 admissibility = (i) measurable, (ii) integrability $L^p$, (iii) 제약 (position bound, capital bound) 충족.
4. **price process** $S_t$ 의 적응성 + integrable.
5. **transaction cost** $c_k$ 가 lower semi-continuous + $c_k(0) = 0$.
6. **risk measure** $\rho$ 가 cash-invariant, monotone, convex, lower semi-continuous on $L^p$.

본 환경에서 정확한 가정 목록 단정 불가. 위 6개는 표준 convex risk measure 이론 (Föllmer-Schied) 의 기본 가정과 deep hedging 의 RL 정식화의 교집합.

## 암묵적 가정 (저자 명시 안 함)

### 암묵적 1 — Simulator 의 분포 = 실세계 분포

가장 큰 암묵적 가정. simulator (Heston 등) 가 실세계 시장 분포 $\mathbb{P}_{real}$ 에 가까워야 학습된 정책 $\delta_\theta$ 가 실세계에서도 작동. simulator 미스스펙이면 정책도 미스스펙.

- **반박 지점**: Heston 은 jump 가 없다, fat tail 이 약하다, vol-of-vol 의 동학 자체가 시간 변화 — 모두 실세계와 어긋남.
- **후속의 정면 공격**: **Adversarial Deep Hedging (Imaki et al. 2307.13217)** 가 simulator 없이 (또는 worst-case simulator 위에서) 헤지를 학습 — 본 논문의 핵심 약점을 직접 타격.

### 암묵적 2 — Drift 의 정확성 = 무관

OCE 손실은 실세계 측도 $\mathbb{P}$ 에서 평가되므로 drift $\mu$ 가 학습 정책에 직접 영향. 그런데 실제 drift 추정은 본질적으로 어렵다 (Merton 1980, "drift 추정에 50년 데이터 필요"). 본 논문은 drift = 0.10 같은 known constant 로 fix — 실세계 적용 시 drift uncertainty 가 정책에 노이즈를 준다.

- **반박 지점**: drift 의 ε-perturbation 에 정책이 얼마나 robust 한지 본 논문 표 부재.
- **후속**: distributionally robust deep hedging — drift 에 대한 ambiguity set 을 두고 worst-case 학습.

### 암묵적 3 — Path-independence of payoff

ATM call 의 payoff 는 path-independent ($Z_T = (S_T - K)_+$ 만에 의존). 본 논문 setting 이 단순 European 으로 좁혀짐. 실무의 path-dependent (Asian, lookback, barrier) 옵션은 별도 처리 — Event states recurrence 로 가능하지만 demo 안 됨.

### 암묵적 4 — No model risk

Heston 자체가 fix — 실무에선 quant 가 사용할 모델이 (Heston, SABR, local stochastic vol, rough vol) 중 어떤 것인지 결정해야. 본 논문 framework 에서 model risk 는 "다른 simulator 로 같은 학습" 의 robustness check 외엔 없음.

### 암묵적 5 — Time-invariant network

신경망 $\pi_\theta$ 는 시간 의존 입력 (time-to-maturity) 을 받지만, 가중치 $\theta$ 자체는 시간 무관. 즉 "BS-delta 가 시간에 따라 변하는 정책 패밀리" 를 한 신경망이 흉내. 이건 OK 지만, 매우 긴 horizon (예: 30년 라이프보험) 에선 보장 안 됨.

## 반박 가능한 지점

### 반박 1 — "Closed-form BS-delta 와 비교는 strawman"

**주장**: BS-delta 는 거래비용 0 가정 하의 최적해. 본 논문이 거래비용 양수 setting 에서 BS-delta 를 baseline 으로 두는 건 미스스펙 baseline 과의 비교 — 정상적이지 않은 비교.

**실험적 검증법**: 거래비용 양수 setting 의 정통 baseline 인 **Whalley-Wilmott no-trade band** (작은 거래비용 점근 해) 또는 **Davis-Norman 의 자유경계 PDE 풀이** 를 baseline 으로 두고 DH 와 비교. 이 비교에서도 DH 가 우월한가가 진짜 검증. 후속 (Ahn-Wilmott 등) 이 이를 추가했는지 추적 필요.

### 반박 2 — "Risk measure 자체의 선택이 임의적"

**주장**: 실무의 진짜 손실은 trader 의 (i) 보너스 구조, (ii) 회사 capital charge, (iii) 규제 (Basel III FRTB) 의 복합. CVaR$_{0.975}$ + ES 보조 같은 표준이 있지만 firm-specific 변형 다수. 본 논문이 Entropic / CVaR 으로 결과 보임 ≠ 모든 risk measure 에서 우월.

**실험적 검증법**: risk measure 패밀리 (Wang transforms, distortion risk measure, spectral risk measure) 에서 OCE 표현 안 되는 것들이 있다 — 그런 측도에서 본 논문의 OCE 골격은 무력. 그 sample 에서 alternative method (예: dual representation 의 sup_Q 를 직접 학습) 와 비교 필요.

### 반박 3 — "ε-density 정리가 rate 없음"

**주장**: 정리 본문은 "ε > 0 어떤 ε 든 가능" — 즉 점근적 결과. 실제로 ε = 0.01 정확도에 필요한 네트워크 크기 / 학습 시간을 모름. production 도입에는 rate 필요.

**실험적 검증법**: width / depth / 학습 epoch 의 sweep curve 를 그려 ε vs network capacity 의 empirical scaling 추정. 본 논문에 이 sweep 이 있을 가능성은 있으나 정확한 결과 본 환경 미확인.

### 반박 4 — "Heston 의 변동성 risk premium 처리"

**주장**: Heston 은 $\mathbb{P}$ 와 $\mathbb{Q}$ 측도 사이 변동성 risk premium 이 있다. 본 논문은 $\mathbb{P}$ 측도에서 손실평가 — 옵션 헤지의 P&L 이 vega risk premium 만큼 systematic gain/loss. 본 논문이 이를 정확히 처리하는지 명확치 않음.

**실험적 검증법**: vol risk premium 의 다양한 수준에서 DH 가 BS 보다 우월한지 sweep. 또 risk premium 의 부호가 바뀌면 DH 도 부호 바뀌는지.

## 재현성 평가

### 코드·데이터 공개

- ✅ 저자 본인 코드 `github.com/hansbuehler/deephedging` (GPL-3.0).
- ✅ 데이터는 시뮬레이션 — reproducibility 본질적 100% (단, seed 보고 필요).
- ⚠️ 본 vanilla repo 는 "교육적 참조" — 본 논문 정확한 figure 재현 코드인지 불명.

### 논문에 안 나온 디테일 (추정)

- **JP Morgan 내부 production 코드** 와의 일치도 — 외부에 공개된 vanilla 와 production 의 차이.
- **시드별 분산** — 본 논문이 평균만 보고했는지 분산도 보고했는지 본 환경 미확인.
- **Risk-aversion $\lambda$ 의 calibration** — $\lambda$ 가 실무에서 어떻게 정해지는가 — 본 환경 미확인.

### 평균 vs 분산 보고

- ML 논문 일반 표준은 평균 ± std (시드 3~5개). 본 논문이 이를 따랐는지 본 환경 미확인. *Quantitative Finance* 게재본은 통상 ML 표준보다 statistical rigor 가 더 엄격하므로 (수학금융 저널) — 보고됐을 가능성 높음.

## 핵심 한 문장

> **"본 논문의 가장 큰 한계는 'simulator = 실세계' 라는 암묵적 가정 — 후속 Adversarial / Distributionally Robust 계열이 정면으로 공격한 약점. 그러나 그 한계 자체가 이 논문이 분기점인 이유 — 모든 후속이 이 논문의 어느 한 axis 를 강화하는 형태로 진행."**
