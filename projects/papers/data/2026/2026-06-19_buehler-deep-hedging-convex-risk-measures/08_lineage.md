# 7. 이론적 계보

## 배경 사다리

이 절은 Deep Hedging 이 어디서 왔고 어디로 가는지의 좌표계를 그린다. ① **계보 (lineage)** = 직접 영향을 받은 선행 논문, ② **평행 연구 (parallel work)** = 비슷한 시기, 다른 접근, ③ **후손 (descendant)** = 본 논문에서 파생된 연구. 본 환경에서 정확한 인용 카운트는 차단되어 단정 불가 — 인용 관계는 후속 논문의 본 논문 인용 패턴에서 역추정.

## 직접 조상 (Ancestors)

### A-1) Föllmer-Schied (2002, 2011) — Convex Risk Measures

**책**: H. Föllmer & A. Schied, "Stochastic Finance: An Introduction in Discrete Time", de Gruyter.

**핵심**: cash-invariant convex risk measure $\rho: L^p \to \mathbb{R}$ 의 dual representation
$$
\rho(X) = \sup_{\mathbb{Q} \in \mathcal{Q}} \{\mathbb{E}_\mathbb{Q}[-X] - \alpha(\mathbb{Q})\}
$$
와 OCE 특수형 — Entropic, AVaR, mean-deviation 등을 한 framework 으로 통합.

**본 논문과의 연결**: Deep Hedging 의 손실 정의가 **이 OCE 형식의 직접 응용**. Föllmer-Schied 의 "risk measure 가 최적화 문제의 목적함수" 라는 추상화 없이는 본 논문이 존재 불가.

### A-2) Ben-Tal & Teboulle (2007) — OCE

**논문**: A. Ben-Tal, M. Teboulle, "An old-new concept of convex risk measures: The optimized certainty equivalent", *Math. Finance* 17(3), 449–476 (2007).

**핵심**: OCE 의 명시적 형식 $\rho(X) = \inf_y \{y + \mathbb{E}[\ell(-X-y)]\}$ 와 SGD 친화성. CVaR/Entropic 의 OCE 표현 명시.

**본 논문과의 연결**: 본 논문이 OCE 를 손실로 채택한 직접 출처. 학습 가능 변수 $y$ 의 도입이 이 논문에서 옴.

### A-3) Föllmer-Leukert (1999, 2000) — Quadratic Hedging & Efficient Hedging

**논문**: H. Föllmer & P. Leukert, "Quantile hedging" (Finance Stoch. 1999) + "Efficient hedging: cost versus shortfall risk" (Finance Stoch. 2000).

**핵심**: 비완전시장에서 cost vs shortfall 의 trade-off, partial hedging 의 정식화.

**본 논문과의 연결**: "비완전시장에서 어떤 손실을 최소화" 라는 메타-질문 명시화. 본 논문은 그 질문에 "임의 convex risk measure" 로 대답.

### A-4) Han-Jentzen-E (2017) — Deep BSDE

**논문**: J. Han, A. Jentzen, W. E, "Solving high-dimensional partial differential equations using deep learning", arXiv:1707.02568 → PNAS 2018.

**핵심**: 100차원 PDE 를 신경망으로 풀이. BSDE 표현을 forward SDE + 신경망 control 로 변환해 SGD 학습.

**본 논문과의 연결**: "고차원에서도 신경망으로 헤지 가능" 의 분위기를 만든 직접 선행. 본 논문은 PDE 자체를 안 풀고 **policy 를 직접 학습** — 한 단계 더 직접화.

### A-5) Davis-Norman (1990) · Hodges-Neuberger (1989) — 거래비용 하 헤지

**논문**: M. Davis, A. Norman, "Portfolio selection with transaction costs", *Math. Oper. Res.* 1990. S. Hodges, A. Neuberger, "Optimal replication of contingent claims under transaction costs", *Review Futures Markets* 1989.

**핵심**: 비례 거래비용 하 단일 자산 utility maximization 의 자유경계 PDE 정식화 + utility indifference price.

**본 논문과의 연결**: 본 논문의 거래비용 항이 이 계보의 명시적 확장. Davis-Norman 의 "no-trade region" 이 본 논문 학습 정책에서 emergent 하게 나타남이 기대됨.

## 평행 연구 (Parallel Work, 2017–2018)

### P-1) Bachouch-Hure-Pham-Warin (2018) — RL for stochastic control

**논문**: A. Bachouch, C. Hure, H. Pham, X. Warin, "Deep neural networks algorithms for stochastic control problems on finite horizon", arXiv:1812.04300 (later: SIAM J. Numer. Anal.).

**핵심**: 이산시간 stochastic control 의 DNN 풀이. Heston-like setting 에서 표준 RL.

**본 논문과 비교**:
- 공통: simulator 위에서 신경망 policy 학습.
- 차이: 이 논문은 quadratic loss / value iteration 중심. 본 논문은 OCE convex risk measure 중심 — **risk measure 일반화가 본 논문의 우위**.

### P-2) Buehler-Horvath-Lyons (2018) — Deep Hedging variant for variance swaps

**논문**: Buehler 본인의 다른 그룹 작업. Variance swap 에 특화.

**본 논문과 비교**: 본 논문이 더 general framework, 이 work 는 더 instrument-specific. 본 논문 이후 통합.

### P-3) Henry-Labordère (2017) — Probabilistic representation of hedging

**논문**: P. Henry-Labordère, "Deep primal-dual algorithm for BSDEs", SSRN preprint.

**본 논문과 비교**: BSDE 의 primal-dual 학습. policy 가 아닌 BSDE 의 forward + backward 동시 학습. 본 논문은 policy 만 학습 — 더 단순.

### P-4) Carmona-Lauriere (2019) — Mean-field game hedging

**논문**: R. Carmona, M. Lauriere, "Convergence Analysis of Machine Learning Algorithms for the Numerical Solution of MFGs", arXiv:1907.05980.

**본 논문과 비교**: 단일 trader 가 아닌 mean-field 의 trader pool. 본 논문보다 일반적이나 single-trader hedging 에선 본 논문이 단순·실용.

## 후손 (Descendants, 2019–2026)

### D-1) Deep Hedging: from Theory to Practice (Buehler-Phillips-Wood 2019)

**자료**: Imperial 슬라이드 + Oxford Maths PDF (본 환경 차단).

**핵심**: 본 논문의 industry 도입 후기 + JP Morgan production 시스템 stub. Recurrent 정책의 효과 강조.

**본 논문과 관계**: 후속 industry 검증.

### D-2) Deep Hedging: Learning to Simulate Equity Option Markets (Wiese-Bai-Wood-Buehler 2019)

**논문**: SSRN ID 3470756.

**핵심**: simulator 자체를 GAN 으로 학습 → 본 논문의 "simulator 주어짐" 가정 완화. 본 논문의 가장 큰 한계 (simulator 미스스펙) 의 직접 보강.

### D-3) Deep Bellman Hedging (Buehler-Murray-Wood 2022)

**논문**: arXiv:2207.00932.

**핵심**: 본 논문의 OCE 손실을 Bellman recursion 으로 분해 — 더 긴 horizon 의 학습 효율. Q-learning 과의 연결.

### D-4) Deep Hedging: Learning to Remove the Drift under Trading Frictions with Minimal Equivalent Near-Martingale Measures (Buehler-Murray-Pak-Wood 2021)

**논문**: arXiv:2111.07844.

**핵심**: 본 논문의 drift uncertainty 문제 해소 — minimal near-martingale measure 로 drift 영향 제거.

### D-5) Deep Hedging with Market Impact (Pasini et al. 2024)

**논문**: arXiv:2402.13326.

**핵심**: 본 논문의 비례 거래비용 → 시장 충격 (market impact) 으로 확장. Almgren-Chriss 모델과 결합.

### D-6) Adversarial Deep Hedging (Imaki et al. 2023)

**논문**: arXiv:2307.13217.

**핵심**: simulator 없이 (또는 worst-case simulator) 학습. 본 논문의 simulator 의존 한계 정면 공격.

### D-7) Equal Risk Pricing (Marzban-Delage-Li 2020, 2021)

**논문**: arXiv:2002.08492 + arXiv:2102.12694.

**핵심**: 매수자/매도자 대칭 가격. 본 논문이 매도자 중심 → 양방향 확장.

### D-8) Uncertainty-Aware Deep Hedging (2026)

**논문**: arXiv:2603.10137 (HTML 인덱스 확인).

**핵심**: Bayesian / ensemble 으로 정책 uncertainty 정량화. production deployment 신뢰성.

### D-9) Deep Gamma Hedging (2024)

**논문**: arXiv:2409.13567.

**핵심**: vega 외 gamma (2계 그릭) 까지 학습. 본 논문의 정책공간을 second-order risk 까지 확장.

### D-10) pfhedge (Imaki et al.) — PyTorch reproduction

**Repo**: `github.com/pfnet-research/pfhedge`.

**핵심**: 본 논문의 PyTorch 표준 reproduction. Industry 도입 가속.

## 평행 연구의 맥락 — 왜 본 논문이 이겼나

본 논문이 후속 분야의 표준 좌표축이 된 이유:

1. **Framework 의 일반성** — risk measure × simulator × constraint 의 3축 분리.
2. **이론적 보장** — ε-density 정리로 함수근사 의미 부여.
3. **단순 구현** — 200 lines 로 production-grade.
4. **저자의 산업 자리** — Buehler 가 JP Morgan QR — 도입 신뢰성.
5. **저널 선택** — *Quantitative Finance* (도메인 top venue).

## 본 논문이 못한 것 → 후속에서 보강된 axis 매핑

| 본 논문 한계 | 보강 후속 |
|---|---|
| simulator 의존 | Deep Hedging GAN simulator (D-2), Adversarial (D-6) |
| drift uncertainty | Drift removal (D-4) |
| 짧은 horizon | Bellman recursion (D-3) |
| 거래비용만 (impact 없음) | Market impact (D-5) |
| 매도자 편향 | Equal Risk Pricing (D-7) |
| policy uncertainty | Uncertainty-Aware (D-8) |
| 1계 헤지 | Gamma hedging (D-9) |

7개 axis 각각이 별도 논문 — 본 논문이 분기점이라는 정성적 증거.

## 핵심 한 문장

> **"Föllmer-Schied 의 convex risk measure + Ben-Tal-Teboulle 의 OCE + Han-Jentzen-E 의 deep PDE 의 세 흐름이 Buehler 의 손에서 합쳐져 분기점 논문이 됐고, 그 결과 향후 7개 axis (simulator / drift / horizon / impact / 가격대칭 / uncertainty / 그릭차수) 의 후속 연구가 격자형으로 펼쳐졌다."**
