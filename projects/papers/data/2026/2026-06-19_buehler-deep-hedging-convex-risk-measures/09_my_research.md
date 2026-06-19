# 8. 내 연구와의 연결

## 배경 사다리

`_profile.md` 의 영역 §A (Grokking) / §B (Mech interp) / §C (PE-Attention) / §D (TS transformer) / §E (금융 응용) / §F (원거리) 와 보유 자산 (APF, Grokking-TS, ⏸️ P1 ProTran-TFA, ⏸️ P2 Autonomous Loop, 🔴 EOA / AETHER / Paper 1-3) 을 본 논문의 4가지 contribution 과 mapping. **원거리 버킷이므로 직접 인접은 약함** — 전이 가능성을 명시화.

## 연결도 (한눈)

| Deep Hedging 요소 | 강한 연결 | 약한 연결 (전이) | 무관 |
|---|---|---|---|
| OCE 손실 (CVaR/Entropic) | ⏸️ P1 ProTran-TFA · 🔴 AETHER | 🟢 Grokking-TS (non-stationary loss) | 🟢 APF (PE 분석) |
| ε-density 정리 | — | 🟢 APF (motif intervention 의 정책공간 정당화) | 🟢 Grokking-TS |
| Heston simulator | 🔴 AETHER (BTC vol surface) | — | 🟢 APF · 🟢 Grokking-TS |
| 4종 recurrence | 🟢 Grokking-TS (P2 daemon 의 logistic 4-layer) | 🟢 APF (motif 의 시간 의존성) | — |
| RNN policy 아키텍처 | 🔴 EOA (action policy 발상 차용 가능) | 🟢 APF (attention-based policy 로 교체 시 motif probe substrate) | — |

## 흡수할 기법 (구체적)

### 흡수 1 — OCE 손실 골격을 P1 ProTran-TFA 의 학습 손실로

**대상**: ⏸️ P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md` + `protran_tfa/`).

**현 상태**: Probabilistic Transformer 의 forecasting 분포를 NLL (negative log-likelihood) 또는 quantile loss 로 학습.

**흡수 방식**:
- 현 NLL → **CVaR$_{0.95}$ on $\hat{r}_{t+1}$** 으로 교체. tail-aware 의 직접 정식화.
- 또는 OCE 골격으로 가서 $\rho^{CVaR}_\alpha(\hat{r}_{t+1}) = \inf_y \{y + (1/(1-\alpha))\mathbb{E}[(-\hat{r}_{t+1}-y)_+]\}$ 를 손실로 채택. $y$ 를 학습 가능 변수로 추가.
- **인용 형태**: "본 손실 (식 X) 의 OCE 표현은 Ben-Tal-Teboulle (2007) 의 정의에 따르며, 금융 응용에서 CVaR 기반 학습의 표준화 (Bühler et al. 2019 [Deep Hedging]) 와 일관성을 확보한다."

**예상 효과**: tail-loss 의 직접 통제 — 2022 AEL 의 tactical allocation 에서 down-month 의 max drawdown 절대 감소가 기대됨.

### 흡수 2 — RNN policy + Recurrent state 4종 → P2 Autonomous Research Loop 의 daemon 재설계

**대상**: ⏸️ P2 Autonomous Research Loop (daemon 죽음, 403 hypothesis × 12k+ CSV).

**현 상태**: daemon 이 실험 결과 CSV 를 받아 다음 실험을 결정하는 RL-like loop 가 daemon 죽음으로 중단.

**흡수 방식**:
- Daemon 의 정책 = "현재 실험 결과 + 누적 결과 → 다음 실험 hyperparam". 이 형태가 정확히 **Deep Hedging 의 RNN policy** 구조.
- 4종 recurrence 중 **Aggregate states** (no-trade 영역에서 hidden 보존) 또는 **Event states** (새 결과가 임계 신호일 때만 hidden 갱신) 를 채택.
- 손실 = "실험당 비용 + 미발견 hypothesis 의 expected information gain 의 음수" — OCE 골격 안에서 표현.
- **인용 형태**: "본 daemon 의 sequential decision policy 는 Bühler et al. (2019) 의 vanilla deep hedging gym 의 4종 recurrence 중 aggregate states 를 채택함."

### 흡수 3 — ε-density 정리 → APF 의 motif intervention causality 정당화

**대상**: 🟢 APF (Attention Pattern Fields) — motif causality 실험 진행 중.

**현 상태**: motif intervention (특정 motif 패턴을 강제 또는 제거) 의 효과를 측정하는 RCT-style 실험. 정책공간 = "어떤 attention pattern 을 강제하는가" 의 집합. 정당화 부족 — "이 motif 집합이 attention 의 전체 space 를 포괄하는가?"

**흡수 방식**:
- APF 의 motif typology (diagonal/stripe/block/edge/spike/checker) 가 attention pattern 의 모든 가능한 구조를 ε-cover 한다는 보조정리를 추가. Deep Hedging 의 ε-density 정리의 구조 (admissible class 의 density) 를 차용.
- 단순 "이 6개로 충분" 이 아니라 "이 6개의 선형결합/혼합으로 임의 attention pattern 을 ε-근사" — formal claim.
- **인용 형태**: "본 motif basis 의 universality 는 (Bühler et al. 2019, Theorem N) 의 admissible policy class ε-density 의 구조와 유사한 보조정리로 정당화 가능 — 학습된 함수공간이 motif causal intervention 의 의미를 잃지 않음을 보장."

## 충돌·경쟁 지점

### 충돌 1 — APF 의 attention-based action policy 가 Deep Hedging 의 MLP-based 와 경쟁

본 논문은 MLP policy + 4종 recurrence 로 sweet spot. APF 의 transferable framework 는 attention-based policy — "state token sequence" → "attention pattern" → "action". 만약 attention policy 가 MLP policy 보다 더 fine-grained 한 path-dependent 의사결정을 보일 수 있다면, APF 의 motif probe 를 deep hedging 에 이식 가능. 단 비용 폭증 — Buehler 의 sweet spot 이 깨질 수 있다.

**수용 방식**: APF transferable framework 로 **attention-based deep hedging policy** 를 구현해 MLP vs Attention 의 CVaR risk · 학습시간 trade-off 측정. 후속 논문 1편 분기점 가능.

### 충돌 2 — Grokking 의 "delayed generalization" 이 OCE 손실에서도 나타나는가

Grokking 은 표준 MSE/CE 손실 + 작은 데이터 + weight decay 의 setting 에서 train-test gap 의 지연 polarization. OCE 손실 (특히 CVaR hinge) 에서 grokking 이 일어나는가는 미답.

**수용 방식**: 🟢 Grokking-TS 의 P2 logistic 4-layer 실험에서 손실을 MSE → OCE-CVaR$_{0.95}$ 으로 교체 — grokking 의 phase transition 이 사라지는지, 강화되는지, 모양이 바뀌는지 측정. **OCE 손실 자체가 implicit regularizer 의 역할을 한다면 grokking dynamics 가 변형됨이 예측됨** — non-trivial 실험.

### 충돌 3 — "simulator = 실세계" 가정과 APF 의 synthetic motif benchmark

APF 도 synthetic motif benchmark (trend/seasonal/regime/anomaly/freq drift) 를 사용. Deep Hedging 의 simulator 의존 한계가 APF 의 synthetic 한계와 평행 — 둘 다 "실세계 일반화" 가 별도 검증 필요.

**수용 방식**: APF 의 후속 작업에서 synthetic → UCR Archive 실데이터로 transfer 의 risk-distance 측정 framework 을 차용. Deep Hedging 후속 (Adversarial) 의 distributionally robust 기법.

## 인용 포인트 (내 논문 어디서, 어떻게)

### 인용 1 — P1 ProTran-TFA 의 손실 정의 절

> "본 모형의 학습 손실은 표준 NLL 대신 CVaR$_{0.95}$ 의 OCE 형식 (Ben-Tal & Teboulle 2007 의 정의; 금융 응용 표준화 Bühler et al. 2019, *Quantitative Finance* 19(8): 1271–1291) 을 채택한다. 이로써 분포 꼬리에 가중치를 두는 loss 가 직접적으로 학습 시그널에 흐른다 (식 X.X)."

### 인용 2 — APF 의 motif intervention 정당화 절

> "본 motif basis 의 6원소 (diagonal / stripe / block / edge / spike / checker) 가 attention pattern space 의 ε-cover 임을 보조정리 X.X 로 보인다. 이는 함수공간 density 의 구조 (cf. Bühler et al. 2019, Section N, 'ε-approximation property of constrained trading strategies') 와 평행하다."

### 인용 3 — Grokking-TS 의 손실 함수 ablation 절

> "본 ablation 의 loss family 는 MSE, NLL, OCE-CVaR$_\alpha$ (Bühler et al. 2019), entropic risk $\rho^{ent}_\lambda$ 의 네 옵션을 포함한다. OCE 손실에서도 grokking phase transition 이 관측되는지가 비자명한 검증 (Figure X.X)."

### 인용 4 — AETHER 의 거래비용 비대칭 모델링 절

> "BTC 옵션 헤지의 거래비용 (펀딩비, 슬리피지) 비대칭은 본 모형의 cost term $c_k(\delta_t - \delta_{t-1})$ 으로 흡수한다. 비대칭 cost 의 일반 framework 는 (Bühler et al. 2019, Eq. X.X) 와 일치하며, 본 모형은 그 framework 의 crypto-specific 인스턴스다."

## 반면교사

본 논문이 못한 것 중 내가 다룰 수 있는 것:

### 반면교사 1 — Simulator 자체의 학습 (APF/Grokking 의 시간축 모형)

본 논문은 Heston 을 fix 한 채 정책만 학습. APF 의 economic time / Grokking 의 logistic-map 의 시간 동학을 **simulator 자체로** 두고 정책을 함께 학습하면, "시간축이 학습 대상" 의 의미가 deep hedging 에 이식. 이는 본 논문의 후속 (Wiese et al. GAN simulator, D-2) 와 평행하지만 economic time 차원에서 새로움.

### 반면교사 2 — Mech-interp tooling 의 부재

본 논문의 RNN policy 가 정확히 무엇을 학습했는지 (interpretation) 는 본 환경에서 부재. APF 의 motif probe + Grokking-TS 의 circuit analysis tooling 을 deep hedging policy 에 이식하면 **"학습된 정책이 BS-delta 의 어디서 어떻게 벗어났는가"** 의 정량 mech-interp. **HyperDAS / Sparse Feature Circuits (Marks 2024) / Bricken Monosemanticity** 의 tool 을 deep hedging RNN 에 적용 — 새로운 분기점 후보.

### 반면교사 3 — Time-grid 결정 의사결정

본 논문의 $M = 10$ (1주 그리드) 는 fix. 실제로는 trader 가 언제 거래할지 자체가 의사결정 — 본 논문은 그리드 결정을 자동화 안 함. APF 의 시간 모티프 분석 + Grokking 의 phase transition 진단을 결합하면 **"내일 vs 1주 후 vs 1달 후" 의 의사결정 시점 자체를 학습** — Davis-Norman 의 no-trade region 의 dynamic 버전.

## 연결 강도 평가

- **§E 금융 응용**: 🟢 **강함** — P1 ProTran-TFA · 🔴 AETHER 의 직접 흡수 가능.
- **§F 원거리 (Deep hedging)**: 🟢 **직결** — 본 논문이 §F 의 명시 태그.
- **§A Grokking · §C PE / §D TS transformer**: 🟡 **전이 가능성만** — 직접 아님. OCE 손실 ablation, ε-density 보조정리, RNN policy 의 mech-interp probing 의 세 다리로 연결.
- **§B Mech interp**: 🟡 **반면교사로 연결** — 본 논문의 부재가 APF/Grokking 의 tooling 기회.

## 핵심 한 문장

> **"본 논문은 P1 ProTran-TFA 의 CVaR 손실 도입과 🔴 AETHER 의 crypto 거래비용 비대칭 모델링 substrate 로 1순위 인용처가 되고, APF/Grokking 의 RNN policy mech-interp 및 ε-density 정당화의 reference 로 보조 인용처가 된다. 직접 인접은 약하나 전이 가능성이 명확하고 비자명함."**
