# 9. 사고 확장 (C) — 후속 실험 아이디어 2개

## 배경 사다리

본 절은 본 논문에서 직접 파생되는 후속 실험 2개를 (가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정) 의 6항 격자로 구체화한다. 두 아이디어 모두 사용자 보유 자산을 반영해 실행 가능.

## Idea 1 — "Grokking under OCE loss" — Grokking-TS track 의 OCE loss ablation

### 가설

표준 MSE/CE 손실에서 관측되는 grokking phase transition (train ≫ test → 갑자기 test 도약) 이 OCE-CVaR$_{0.95}$ 손실 하에서는 **사라지거나, 발생 시점이 가속/지연되거나, 변화율이 변형** 된다. 구체적으로:
- $H_1$: OCE-CVaR$_\alpha$ 의 hinge 구조가 implicit regularizer 역할 — grokking 의 delay 가 단축.
- $H_0$: 손실의 형태와 무관 — grokking 은 weight decay × 데이터 부족의 함수, OCE 가 변화 없음.

### 데이터

🟢 Grokking-TS 의 P2 logistic 4-layer 실험 baseline (logistic map $x_{t+1} = r x_t (1 - x_t)$, $r \in [3.5, 4.0]$ chaotic regime, 시계열 1k~10k 점). 입력 lag = 16, 출력 = 1-step-ahead. 동일 데이터 사이즈 sweep (256 / 512 / 1024 / 2048 / 4096).

### 비교 조건

| 조건 | 손실 | 비고 |
|---|---|---|
| C1 (baseline) | MSE | Grokking-TS 기존 |
| C2 | NLL (Gaussian) | 분포적 baseline |
| C3 | Entropic ($\lambda = 1.0$) | OCE-exp |
| C4 | CVaR$_{0.95}$ | OCE-hinge |
| C5 | OCE-mixed (Entropic 50% + CVaR 50%) | hybrid |

다른 hyperparam (lr, wd, depth) 통제. seed 5개씩.

### 예상 결과

- **H_1 시나리오**: C4 (CVaR) 와 C5 (mixed) 에서 grokking phase transition 의 delay 가 C1 (MSE) 대비 30~50% 단축. C3 (Entropic) 는 중간. delay 의 정량 단축이 손실 형태와 monotone.
- **H_0 시나리오**: 모든 조건에서 grokking transition 시점·모양 거의 동일.

### 반증 조건

- 손실별 학습 곡선 (train loss · test loss · gradient norm · weight norm) 을 epoch ∈ {1, ..., 10000} 에서 측정.
- grokking 정의 기준: $\mathrm{test\_acc}(t) - \mathrm{test\_acc}(t-1) > \theta$ 의 sudden jump.
- 가설 기각 조건: 모든 조건에서 phase transition 시점의 평균 차이가 표준편차의 1 sigma 안.

### 비용 추정

- 학습: 5 조건 × 5 데이터 사이즈 × 5 seed = 125 실험.
- 1 실험 = 10000 epoch × 1 batch (작은 모델) ≈ 30분 (1 GPU).
- 총 = 125 × 30분 ≈ 62 GPU-시간 = 약 1.5 GPU-일.
- 분석 + 시각화 = 1 인일.
- **총 비용**: 1 GPU-일 + 1 인일.

### 가치

- (i) Grokking dynamics 의 손실 함수 의존성 — implicit regularization 이론에 새 case.
- (ii) Deep Hedging 의 학습 효율 분석에 직접 응용 — OCE 가 학습을 가속한다면 production 의미.
- (iii) Grokking-TS track 의 새 실험 axis.

## Idea 2 — "Attention-based Deep Hedging Policy + Mech-interp" — APF transferable 의 deep hedging 이식

### 가설

본 논문의 MLP RNN policy 를 **Attention-based policy** 로 교체하면, (a) 동등하거나 더 낮은 CVaR risk + (b) APF 의 motif typology (diagonal/stripe/block/edge/spike/checker) 분석으로 정책의 mech-interp 가능. 구체적으로:
- $H_1$: Attention policy 가 path-dependent 거래비용 처리에서 RNN 보다 동등 (>= 0.95 CVaR 비율) + APF motif probe 로 "거래비용 → action throttling" 의 명시적 회로 식별.
- $H_0$: Attention 의 계산비용 폭증으로 학습 분산 ↑, RNN 보다 CVaR 악화.

### 데이터

저자 SimpleWorld_Spot_ATM 의 디폴트 setting (Heston, 10 step × 1주, 거래비용 spot 2bp · option 200bp, ATM call). Monte Carlo 1000 경로 학습 + 10000 경로 evaluation. baseline = 본 논문 vanilla MLP-RNN (depth=3, width=20).

### 비교 조건

| 조건 | Policy | 파라미터 수 | 비고 |
|---|---|---|---|
| B1 | MLP (본 논문) | ~수백 | baseline |
| B2 | LSTM | ~수백 | recurrent baseline |
| B3 | Transformer (1 head, 2 layer, d_model=32) | ~수천 | 본 실험 |
| B4 | Transformer (4 head, 4 layer, d_model=64) | ~수만 | 본 실험 (큰 버전) |

모두 동일 OCE-CVaR$_{0.95}$ 손실, Adam lr=1e-3, 100 epoch.

### 예상 결과

- **H_1 시나리오**:
  - B3 의 CVaR risk 가 B1 의 ±5% 안 (동등).
  - B3 의 attention pattern 시각화에서 motif 식별: (i) **diagonal** = 평소 BS-delta-like 추적, (ii) **edge** = 만기 근처 빠른 unwinding, (iii) **block** = 거래비용 회피의 grouping behavior.
  - APF motif probe 의 6 motif basis 가 attention pattern 의 ε-cover 임을 보조정리로 보임.
  - intervention (특정 motif 강제) 으로 정책 출력 변화를 측정 — causal direction 입증.
- **H_0 시나리오**:
  - B3 의 CVaR risk 가 B1 대비 10%+ 악화.
  - Attention pattern 의 motif 식별 불가 (no clear structure).

### 반증 조건

- CVaR$_{0.95}$ 의 risk 절대값과 신뢰구간 (시드 10개) 비교.
- Attention map 시각화 + APF motif classifier 의 confidence.
- Intervention 실험: motif 의 강제 제거 후 정책 CVaR 변화의 effect size.
- 가설 기각 조건: B3 가 B1 대비 risk 10% 이상 악화 + motif 식별 confidence < 0.7.

### 비용 추정

- 학습: 4 조건 × 5 거래비용 sweep × 10 seed = 200 실험.
- 1 실험 = 100 epoch × full-batch (1000 paths) ≈ 5분 (1 GPU).
- 총 = 200 × 5분 ≈ 17 GPU-시간 = 약 0.7 GPU-일.
- Attention map 시각화 + motif classifier 학습 + intervention = 3 인일.
- 통합 분석 + paper 초안 = 5 인일.
- **총 비용**: 1 GPU-일 + 8 인일 ≈ 2 주.

### 가치

- (i) Deep Hedging policy 의 mech-interp 가 가능함을 실증 — 본 논문의 큰 부재 보강.
- (ii) APF transferable framework 의 deep hedging 도메인 응용 — APF 의 evidence + Deep Hedging 의 evidence 동시 강화.
- (iii) 본 논문 framework 의 attention 변형 — 후속 분기점 후보 (NeurIPS workshop 또는 Quantitative Finance 후속).

## 두 아이디어의 관계

- **Idea 1** = loss axis 실험 (Grokking-TS 활용).
- **Idea 2** = policy class axis 실험 (APF 활용).
- 함께 진행 시 4 way intersection 의 추가 axis (OCE loss × Attention policy × grokking × motif probe) 의 단일 paper 가능. 단 범위 폭증 — 별도 paper 권장.

## 우선순위 추천

- **단기 (다음 4주)**: Idea 1 — 작은 비용, Grokking-TS 의 기존 baseline 에 손실 한 줄만 바꾸면 끝. Quick win.
- **중기 (2~3 개월)**: Idea 2 — 비용 더 크지만 영향력 (mech-interp × deep hedging) 더 큼.

## 핵심 한 문장

> **"두 실험 모두 본 논문의 framework decomposition (loss / policy class) 의 한 axis 만 갈아끼우는 형태 — 사용자 보유 자산 (Grokking-TS, APF) 으로 직접 실행 가능하며 결과 따라 NeurIPS workshop / Quantitative Finance 후속 1편씩 가능."**
