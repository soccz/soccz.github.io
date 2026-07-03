# 10c. 사고 확장 — 실험 아이디어 2개

## 아이디어 1: **"LSTM Policy Circuit Discovery"** — RL Policy 를 Sparse Feature Circuits 으로 해체

### 가설

Zhang·Zohren·Roberts (2020) 스타일로 학습된 **2-layer LSTM policy** 의 hidden state 는 다음 **monosemantic feature 로 decompose 가능** 하다:
1. **Trend-follower feature**: 최근 60 일 누적 return 강도에 반응, 매수 action 유도
2. **Volatility-spike detector**: σ_{t-1} 급증 시 활성, 포지션 축소 유도
3. **Mean-reversion feature**: RSI 극단값 (>70 or <30) 에 반응, counter-trend action 유도
4. **Cost-averaging feature**: 최근 |Δa| 이 커진 상태에서 turnover 억제 유도
5. **Regime-shift detector**: return 변동성이 EWMA 대비 급격 이탈 시 활성

### 데이터

- **본 논문 style 학습**: 5 개 futures (WTI 원유, S&P500, TY, EUR/USD, Gold — 자산군 대표 각 1) × 2011-2019 daily close.
- **feature**: MACD (12/26), RSI (14), 로그 수익률, EWMA vol → 각 시점 4-dim feature, 60-lookback → 60×4 state.
- **재구현 baseline**: DQN + PG + A2C 재구현, 5 seed 별.
- **Test period**: 2020-2024 zero-shot.

### 비교 조건

1. **Full-model**: baseline DQN performance
2. **SAE-decomposed**: LSTM hidden state 32-dim → SAE 512 features (Bricken 2023 방식, expansion factor 16)
3. **Feature ablation**: 각 monosemantic feature 별로 activation 억제 → performance 변화 정량화
4. **Cross-asset transfer**: WTI 학습 feature 가 Gold 에 얼마나 transfer 되는가

### 예상 결과

- Trend-follower feature 는 **모든 자산군에서 강한 activation** → transfer 가능
- Volatility-spike detector 는 **자산별로 threshold 다름** (원자재 vs 국채)
- Mean-reversion feature 는 **자산군별 우세** (FX 에 강, 원자재에 약)
- SAE feature 억제 시 performance drop 이 정량적으로 클수록 그 feature 가 정책의 진짜 기여자
- 5-10 개의 monosemantic feature 로 policy 의 대부분 (>70%) 을 설명 가능

### 반증 조건

- SAE 재구성 loss 가 크고 features 이 대부분 polysemantic → "LSTM policy 는 SAE 로 해체 불가" 라는 negative result 도 자체 논문 기여
- Feature ablation 이 performance 에 미미한 영향 → 정책이 features 의 조합 (not individual) 을 활용
- Cross-asset transfer 실패 → asset-specific 학습 강함, 일반화 취약

### 비용 추정

- 재구현 (Python + PyTorch, 5 assets × 3 algos × 5 seeds): **1-2 주 개발** + **GPU 100-200 시간**
- SAE 학습: 표준 dict learning, **1-2 일 GPU 시간**
- Analysis + writing: 2-3 주

**총**: 5-8 주 시간, GPU RTX3090 or A100 accessible 이면 개인 노트북 규모 가능.

### 결과물 위치

`Attention Pattern Fields/experiments/rl_policy_sae/` (APF sub-experiment 로 편입) 또는 `AETHER/experiments/rl_policy_interp/` (AETHER 자원 활용). NeurIPS 2027 track (Grokking + mech interp) or ICML fin ML workshop 진출 가능.

---

## 아이디어 2: **"Vol-Scaled Quantile RL Policy"** — P1 ProTran-TFA 의 quantile forecast 를 vol-scaled RL reward 로 직접 연결

### 가설

P1 ProTran-TFA (paused) 의 quantile forecast $\hat{q}_\tau(t+1|s_t)$, $\tau \in \{0.1, 0.5, 0.9\}$ 를 policy 함수의 **직접 입력** 으로 사용하고, 본 논문의 vol-scaled reward 을 **IQR-scaled reward** 로 확장하면:

1. Deterministic MACD/RSI feature 대비 **분포 정보 활용** → uncertainty-aware 정책
2. Vol-scaling 을 **realized vol (60-day EWMA)** 대신 **implied IQR** ($\hat{q}_{0.9} - \hat{q}_{0.1}$) 로 대체 → forward-looking risk 관리
3. Tail-aware position sizing ($\hat{q}_{0.1}$ 이 매우 낮으면 downside 리스크 인지 → 포지션 축소)

이 접근은 **probabilistic forecast + RL policy** 의 first-class integration 이 되며, 사용자 P1 ProTran-TFA 를 finance venue (IJF/QF) 로 진출시키는 **완결된 확률 예측 → 실행 파이프라인** 이 된다.

### 데이터

- **In-sample**: 25 개 futures (본 논문 subset), 2011-2019
- **Out-of-sample**: 2020-2024 (Covid, 인플레 stress test 포함)
- **Feature**: raw log-return, MACD, RSI, ProTran-TFA quantile forecast (3-quantile: 10/50/90 percentile)

### 비교 조건

**Baseline (본 논문 재현)**:
- A: Zhang 2020 style DQN + MACD/RSI + 60-day EWMA vol scaling
- B: TSMOM 12-month + EWMA vol scaling
- C: Long-only

**Proposed variants**:
- D: ProTran quantile 로 state 확장 + 60-day EWMA vol scaling (state 만 변경)
- E: ProTran quantile 로 state 확장 + IQR vol scaling (state + reward 변경)
- F: ProTran quantile 로 state 확장 + IQR vol scaling + CVaR-tail penalty in reward (Deep Hedging 정신)

### 예상 결과

- **In-sample**: D > A > B > C 순 Sharpe. Quantile feature 가 point feature 대비 우세.
- **Out-of-sample**: F > E > D > A. Tail-aware policy 가 2020 Covid 등 극단 국면에 우세.
- **Turnover**: E, F 가 A 대비 낮음 (uncertainty 인지로 신중한 rebalancing).
- **정책 해석**: SAE 로 decompose 시 "IQR-spike feature" 가 새롭게 등장 (본 논문에는 없던 feature).

### 반증 조건

- Quantile feature 를 넣어도 point feature 대비 성능 향상 미미 → ProTran quantile 의 정보량이 실제로는 낮음
- IQR vol scaling 이 EWMA vol scaling 과 실질적 차이 없음 → 확장의 novelty 부재
- Tail penalty 도입 시 Sharpe 는 낮아지되 MDD 는 개선 안 됨 → tail 최적화 실패

### 비용 추정

- ProTran-TFA 재구현 (paused 상태, `paper_test/PAPER_DRAFT_V1.md` 재개) : **2-3 주**
- RL environment + baseline 학습: **2 주**
- 6-variant × 5-seed 학습: **3-4 주 GPU 시간**
- Analysis + writing: 3-4 주

**총**: 10-13 주. Finance venue (IJF Applied Economic Letters 계열) or NeurIPS Time Series 워크샵 진출 가능.

### 결과물 위치

`paper_test/PAPER_DRAFT_V2.md` (P1 ProTran-TFA 재개판) + `paper_test/experiments/rl_quantile_policy/`. Extended discussion 을 통해 (i) finance venue 진출 + (ii) NeurIPS Time Series workshop 병행 제출 가능.

---

## 두 아이디어의 관계와 우선순위

**아이디어 1** (LSTM Policy SAE decompose) 는 **mech interp 방향, 사용자 §B 심화**. 학술 novelty 높음.
**아이디어 2** (Vol-Scaled Quantile RL Policy) 는 **실무 응용 방향, 사용자 §E 심화**. 응용 novelty 높음 + finance venue 진출 substrate.

**우선순위 추천**:
1. 지도교수 결정에 따라 두 track (APF vs Grokking) 중 하나로 좁혀지면, **APF 이면 아이디어 1** (mech interp 확장 자연), **Grokking 이면 아이디어 2** (fin domain 응용 확장 자연) 우선.
2. 두 아이디어 모두 재현 부담 = 5-13 주 → 병행 어려움. 하나만 선택.
3. Timeline 상 short-term (3 개월) 는 아이디어 1 (규모 작음 + mech interp 성숙), long-term (6-9 개월) 는 아이디어 2 (P1 ProTran 재개 필요).

## 이 부분의 핵심 한 문장

**"LSTM Policy SAE decompose (mech interp 확장) 와 Vol-Scaled Quantile RL Policy (P1 ProTran 확장) 의 두 실험 아이디어는 각각 사용자 §B 와 §E 로 본 논문을 확장하는 direct substrate 이며, 지도교수 결정 후 track 좁힘 시점에서 우선순위 결정 가능."**
