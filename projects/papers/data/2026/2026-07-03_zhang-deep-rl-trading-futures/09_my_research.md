# 09. 내 연구와의 연결

## 배경 사다리

이 절은 `_profile.md` §A–F 의 관심 영역 + 보유 자산 목록과 본 논문 (Zhang·Zohren·Roberts 2020) 을 연결한다. **원거리 버킷** 논문이라 직접 매칭보다 **전이 가능성** (transferability) 관점이 우선. `_prompt.md` 원칙: "일반론 나열 금지 — 구체적 mechanism / axis / 수식 요소 를 지정".

## 1. 매칭 강도 진단

| 관심 영역 | 매칭 강도 | 주요 축 |
|---|---|---|
| §A Grokking / Delayed Generalization | **약함** | RL curriculum + phase transition 유추만 가능 |
| §B Mech Interpretability / Circuit | **중간** | RL policy 의 attention/hidden state 를 SAE 로 decompose 가능성 |
| §C Attention as Explanation / PE | **약함** | LSTM 백본 → attention 없음. 후속작 Momentum Transformer 로 연결 시 강해짐 |
| §D TS Transformers / 2D Repr / TSFM Interp | **중간** | LSTM baseline → TS Transformer baseline 자연 연결 |
| §E 금융 시계열 응용 | **강함** | 직접 매칭. P1 ProTran-TFA · 실무 domain 접점 |
| §F 원거리 (RL for trading) | **매우 강함** | 원거리 명시적 매칭. AETHER (crypto RL) 직접 substrate |

**주요 매칭 축**: §E 금융 응용 (P1 ProTran-TFA) + §F 원거리 (AETHER) + §B mech interp (novel 니치)

## 2. 흡수할 기법 3 가지

### 흡수 1: Volatility-scaled reward → P1 ProTran-TFA 의 quantile loss extension

**본 논문에서 가져올 것**: $R_t = a_{t-1} \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}} \cdot r_t - c \cdot |a_t - a_{t-1}|$ 의 정식화. 특히 **cross-asset 정규화** 관점.

**P1 ProTran-TFA 에 어디에 쓸지 (구체)**: 
- 현재 P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md`) 는 quantile forecast 만 산출. Downstream trading policy 부재.
- **§4 (Application 절 신설 안)**: Quantile forecast $\hat{q}_\tau(t+h)$ 를 본 논문 style vol-scaled reward 함수로 mapping 하는 파이프라인. 예:
  $$a_t = \text{sign}\bigl(\hat{q}_{0.5}(t+1) - r_{t-1}\bigr) \cdot \bigl( \hat{q}_{0.9}(t+1) - \hat{q}_{0.1}(t+1) \bigr)^{-1}$$
  로 median forecast 방향 × IQR^{-1} 스케일링 (vol-scaling 의 quantile 대체).
- **논문 인용 포인트**: "Following the volatility-scaling scheme of Zhang·Zohren·Roberts (2020) 에서 IQR-based scaling 으로 확장, quantile forecast 를 직접 policy 로 매핑" (인용 초안).

### 흡수 2: 3-알고리즘 스윕 (DQN/PG/A2C) → AETHER 의 basic RL substrate

**본 논문에서 가져올 것**: DQN + PG + A2C 3-종을 표준 baseline 으로 하는 방식.

**AETHER 에 어디에 쓸지 (구체)**: 
- AETHER (`AETHER_IDEA.md` 611 줄) 의 core substrate 는 crypto cycle detection + trading agent. 현재 code 부재.
- **§AETHER §3 (Agent Framework 안)**: 본 논문의 3-알고리즘 스윕을 **crypto domain 최소 baseline** 으로 채택. BTC/ETH/SOL 3-asset 에 (i) DQN with {-1, 0, +1} action, (ii) PG same, (iii) A2C with [-1, +1] 을 first-pass 실증.
- **차별점**: crypto 시장은 24/7 (5min bar or 1H bar 가능) → intraday 로 확장. Vol regime 이 futures 대비 극심 → σ_tgt scaling 이 더 중요.

### 흡수 3: LSTM 백본 → APF motif dynamics 의 non-attention baseline

**본 논문에서 가져올 것**: 2-layer LSTM (64→32) + Leaky-ReLU 의 conservatively simple 백본 아키텍처.

**APF (Attention Pattern Fields) 에 어디에 쓸지 (구체)**:
- APF main track (`Attention Pattern Fields/`) 은 attention motif × PE × task 3-축 실험. **Attention 없는 baseline** 이 부족.
- **§APF §4 (Baseline 절 확장 안)**: 본 논문 style LSTM baseline 을 (i) diagonal motif (locality), (ii) stripe motif (period), (iii) block motif (regime) 태스크에 적용. **attention 없이도 어느 정도 성능이 나오는가** 의 lower bound 확립.
- **차별점**: APF 태스크 (synthetic motif benchmark) 는 fin data 아니지만 attention motif 유무의 순 기여 격리에 LSTM baseline 은 표준.

## 3. 충돌·경쟁 지점 2 가지

### 충돌 1: LSTM vs Transformer (APF 관점)

**본 논문의 주장**: 2019 년 시점 LSTM 이 daily futures 에 충분.
**APF (내 track) 의 주장**: Attention motif 가 시계열 학습의 핵심.

**어떻게 조정하나**: 본 논문의 **후속작 Momentum Transformer (arXiv:2112.08534)** 가 LSTM → Transformer 로 실제 진화. 이는 (i) LSTM 이 충분 이 아니라 "2019 년 baseline" 이었고, (ii) Attention 은 정말 fin ML 에도 유효 → APF 주장 강화. **본 논문은 LSTM 시대의 마지막 대표작** 으로 위치 짓기.

### 충돌 2: Reward-driven learning vs mech interp (§B 관점)

**본 논문의 주장**: End-to-end SGD 로 정책 학습 → 학습된 정책이 뭘 하는지 black-box.
**§B mech interp 의 주장**: 학습된 신경망은 해체·회로 분석 가능해야 함.

**어떻게 조정하나**: 본 논문의 LSTM policy 를 **후속 mech interp 대상** 으로 삼자. Hidden state $h_t \in \mathbb{R}^{32}$ 를 SAE 로 decompose → **"trend follower feature", "volatility spike detector feature", "mean reversion feature"** 등 monosemantic feature 를 찾는다. 이는 (i) 사용자 §B 관심 영역 확장, (ii) Sparse Feature Circuits (Marks 2024, 2026-05-15 커버) 방법론을 fin RL policy 로 이식하는 novel 니치.

## 4. 인용 포인트 초안 3 가지

### 인용 1: P1 ProTran-TFA §4 Application

> "Prior work has demonstrated that direct policy learning outperforms rule-based baselines in the context of futures trading; specifically, Zhang·Zohren·Roberts (2020) show that DQN with volatility-scaled reward beats TSMOM on 50 liquid futures over 2011-2019. We extend this framework by replacing the deterministic MACD/RSI feature-based state with a quantile-forecast-derived state $\hat{q}_\tau(t+h)$, yielding a **probabilistic-forecast-informed RL policy**."

### 인용 2: AETHER §3 Agent Framework

> "We adopt the three-algorithm sweep (DQN, PG, A2C) proposed by Zhang·Zohren·Roberts (2020, JFDS) as our baseline agent set, with the following crypto-domain adaptations: (i) 5-min bar sampling instead of daily, (ii) 3-asset (BTC/ETH/SOL) instead of 50 futures, (iii) 24/7 continuous trading environment. The vol-scaled reward formulation is extended with a crypto-specific $\sigma_{\text{tgt}}$ calibrated to weekly realized volatility."

### 인용 3: APF §4 Baseline Extension

> "As a non-attention baseline, we implement the 2-layer LSTM (64→32 units, Leaky-ReLU) architecture from Zhang·Zohren·Roberts (2020) on our synthetic motif benchmark. This provides a lower bound on task performance in the absence of attention, allowing us to attribute the marginal contribution of specific attention motifs (diagonal/stripe/block) via ablation. In our results, we find that [...]"

## 5. 반면교사: 본 논문이 못한 것을 내가 어떻게 다룰지

### 반면교사 1: Reproducibility 강화

**본 논문의 실패**: 저자 공식 GitHub 미공개, 유료 상용 데이터.
**내 대응**: P1 ProTran-TFA, AETHER 모두 **open-source code + open dataset** 원칙. yfinance / Binance API / Ken French 25 등 공개 데이터에 집중. GitHub repo 를 first-day 부터 유지.

### 반면교사 2: Seed 통계 명시

**본 논문의 실패**: seed 통계 미확인.
**내 대응**: 모든 실험을 **최소 5 seed** 로 반복, mean ± std 필수 보고. worst-seed 결과도 명시.

### 반면교사 3: Post-training out-of-sample stress test

**본 논문의 실패**: 2020+ 미검증.
**내 대응**: Train 기간 이후 **최소 2 년 zero-shot out-of-sample** 을 필수. Regime shift 테스트로 (a) Covid 2020, (b) 인플레 급등 2022, (c) BTC bull-bear cycle 을 stress test 로 채택.

### 반면교사 4: Mech interp 부재

**본 논문의 실패**: End-to-end SGD 로 정책 학습, 해석 부재.
**내 대응**: 학습된 policy 를 (i) Attention Pattern Fields (motif 관점), (ii) Sparse Feature Circuits (feature-level), (iii) probe 실험 (state feature → action mapping) 3-종으로 해체. **RL policy 를 mech interp 대상으로 삼는 novel 니치** 개척.

## 6. 종합: 본 논문의 내 연구 지도에서의 위치

- **Main track (APF + Grokking) 관점**: **약한 연결**. LSTM baseline, attention 부재 → APF 의 counter-example 로 위치.
- **Paused track (P1 ProTran-TFA) 관점**: **강한 연결**. quantile forecast 를 vol-scaled RL reward 로 mapping 하는 확장 substrate. finance venue (IJF/QF) 진출 시 필수 인용.
- **Shelved (AETHER) 관점**: **매우 강한 연결**. crypto RL agent 의 first-pass baseline 그대로 이식 가능.
- **Novel niche 관점**: **RL policy 를 mech interp 대상으로 삼는 방향** — APF/Grokking 방법론 + rl-trading domain 의 교차 → 사용자 진로 (quant industry) 와 학술 (mech interp) 을 잇는 다리 potential.

## 이 부분의 핵심 한 문장

**"본 논문은 §F 원거리 태그이지만 P1 ProTran-TFA (quantile → policy 확장 substrate) + AETHER (crypto RL basic baseline 이식) + APF (non-attention LSTM baseline 표준 참조) 3-축으로 사용자 보유 자산 3 개와 직접 연결되며, 특히 **LSTM policy 를 mech interp 대상으로 삼는 방향** 은 §B 와 rl-trading domain 을 잇는 novel 니치로 개척 가능."**
