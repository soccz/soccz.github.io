# 0. 메타 & 선정 이유

## 메타 데이터

- **저자 권위·소속**:
  - **Hans Bühler** — JP Morgan Quantitative Research 이사 (당시), 옵션 가격결정과 변동성 표면 모델링의 산업계 표준 결정자 중 하나. 이전 작업: "Stochastic Volatility Models for Equity Derivatives" (Buehler 2010), "Volatility and Dividends" (Buehler 2010). Deep Hedging 이후 JP Morgan 의 deep hedging 시스템을 실제 production 에 올렸다는 강한 정황 (Buehler 의 후속 SSRN 및 EPFL 발표 참조).
  - **Lukas Gonon** — ETH Zürich (당시 박사과정 → 박사후), 현재 Imperial College London 부교수. 수학적 학습이론과 reservoir computing, deep learning 의 보편근사 정리 후속작 다수.
  - **Josef Teichmann** — ETH Zürich D-MATH 정교수, 금융수학·확률해석학·기계학습 교차분야의 핵심 인물. 신호접근 (rough path, signature methods) 기반 금융 ML 의 본거지.
  - **Ben Wood** — JP Morgan Quantitative Research, 이전에 Bühler 와 변동성 모델링 공동 작업.
- **인용 수**: 본 환경에서 Semantic Scholar / Google Scholar 직접 차단으로 **정확한 인용수 미확인**. 다만 WebSearch 인덱스에 따르면 *Quantitative Finance* 2019 게재 이후 follow-up arXiv 논문 다수 — Deep Bellman Hedging (2207.00932), Deep Hedging: Learning to Remove the Drift (2111.07844), Deep Hedging with Market Impact (2402.13326), Adversarial Deep Hedging (2307.13217), Uncertainty-Aware Deep Hedging (2603.10137), Deep Gamma Hedging (2409.13567), Deep Equal Risk Pricing (2002.08492 / 2102.12694) 등 6편 이상이 본 논문을 "the deep hedging paper" 로 명시 인용. 분야 표준 좌표축 역할.
- **DOI**: 10.1080/14697688.2019.1571683
- **canonical identifier**: arXiv:1802.03042 (v1 2018-02-08, v3 게재본)
- **공식 코드 repo**: `github.com/hansbuehler/deephedging` (저자 본인, GPL-3.0, 345 stars 23-01 기준 — 본 환경 확인) — vanilla deep hedging engine 의 "교육적 참조 구현" 으로 표기되었으되, JP Morgan 내부 production 코드와 동일 골격임이 강하게 추정됨.

## 근거 지도 (Evidence Map)

| 본문 요소 | 1차 출처 (본 환경 접근 가능) | 비고 |
|---|---|---|
| 핵심 claim (마찰 하 최적 헤지 = constrained risk measure 최적화) | WebSearch 인덱스 abstract verbatim | "framework for hedging … in the presence of market frictions" |
| 방법론 (OCE 목적함수, action function 함수근사, ε-density) | 저자 GitHub `Network.md` 의 OCE 정의 + Entropy/CVaR utility 공식 + recurrence 4종 + WebSearch verbatim density 진술 | 본 환경 PDF 차단으로 정리(Theorem) 번호와 보조 lemma 는 단정 불가 |
| 실험 setup (Heston · 거래비용 · CVaR 히스토그램) | WebSearch verbatim "synthetic market driven by the Heston model … outperform the … 'complete market' solution" + GitHub `world.py` 의 SimpleWorld_Spot_ATM 디폴트 (spot 거래비용 γ=0.0002, option γ=0.02, dt=0.02 ≈ 1주) | Heston 파라미터의 정확한 (κ, θ, ξ, ρ, v_0) 값은 본 환경에서 단정 불가 — 원문 실험 표 차단 |
| 한계·반박 가능 지점 | 본 환경 본문 부재 — 후속 논문 (Deep Hedging with Market Impact 2402.13326, Adversarial Deep Hedging 2307.13217, Equal Risk Pricing 2002.08492) 의 명시적 비판/확장 지점을 통해 역추정 | 07_limits.md 에서 "후속 확장의 존재 자체" 가 한계의 증거임을 명시 |

## 선정 이유

- **오늘 = 금요일 = 원거리 버킷**. `_coverage.md` 기준 미커버 태그(0): `llm-finance`, `rl-trading`, `causal-ml-finance`, `deep-hedging`. 그 중 **deep-hedging 의 분기점 논문**이자 *Quantitative Finance* (도메인 Tier 3 top venue) 게재본을 1순위로 선택.
- **`_index.md` priority 목록 매칭**: 직접적 priority 행은 없음 (priority 목록은 주로 §A grokking / §B mech-interp / §C PE / §D TS transformer). 본 논문은 §F 원거리 — 따라서 일반 arXiv 검색 경로지만, Source Lock 4-게이트 모두 통과.
- **사용자 연구 연결** (`_profile.md` §F, §E, 보유 자산):
  - **§F 원거리 (Deep hedging, Buehler 계열)** 에 정확히 명시된 태그. 사용자 본인이 이 분야를 명시적으로 원거리 axis 로 지정.
  - **§E 금융 시계열 응용** — Probabilistic / quantile / distributional forecasting, calibration, tail-aware 와 직접 호환 (CVaR · ES 가 본질적으로 분포 꼬리 정량화).
  - **보유 자산 ⏸️ Paused 의 P1 ProTran-TFA** — Probabilistic Transformer 의 finance 응용 확장에서 "예측 분포 → 헤지 의사결정" 연결고리로 deep hedging 의 OCE 손실을 위에 얹는 시나리오가 자연스럽다.
  - **보유 자산 🔴 Shelved 의 AETHER** — Crypto cycle 모델링에서 BTC 옵션의 헤지비용 비대칭 (펀딩비, 슬리피지) 을 deep hedging 의 거래비용 항으로 흡수 가능. 코드 부재 상태인 AETHER 에 vanilla deep hedging engine 을 직접 이식할 수 있는지 확인 가능.
- **양 active track 과의 연결** (전이 가능성, 직접 아님):
  - **APF (Attention Pattern Fields)**: 본 논문의 RNN action policy 가 state 시퀀스를 받아 action 을 생성하는 구조에서, attention 기반 action policy 로 교체 시 motif 분석 substrate 가 만들어진다. 직접은 아니지만 mech-interp tooling 의 transfer 가능성이 명확.
  - **Grokking in TS Transformers**: Deep hedging 의 OCE 손실은 표준 MSE 가 아닌 비선형 risk-aware 손실 — non-stationary regime 에서 grokking-like delayed generalization 이 나타나는지 자연 실험장. P2 Autonomous Research Loop 의 daemon 복구 시 후보 1.

## 시점 정당화

- 본 논문은 2019년 게재로 7년 전 작업이지만, 분야의 **canonical reference** 로 모든 후속 deep hedging 논문이 (가장 흔하게는 Eq.1~3 의 utility 공식과 Theorem 4.3 의 density 진술) 인용한다. 사용자가 deep hedging 영역으로 진입하려면 반드시 거쳐가야 하는 정거장 — 후속 (Bellman/Adversarial/Market Impact/Equal Risk Pricing) 을 읽기 전에 base layer 확보.
- 또한 **금요일 원거리 axis 의 '금융 ML 원거리' 비중 보충**: 최근 6주 금요일 — 05-01 Lyle (continual), 05-08 Power (grokking), 05-15 Marks (SFC), 05-22 Bricken (mono), 05-29 DeepLOB + Autodeleveraging (LOB/crypto), 06-05 Zuo THP (point process), 06-12 Omnigrok (grokking) — 금융 응용 비중이 LOB/Hawkes/crypto 만이고 derivatives 측은 0. balance 측면에서 derivatives 헤징 분기점 1편 보강.
