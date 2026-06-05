# 10_extensions_c — 사고 확장: 실험 아이디어 2개

> THP 의 frame 을 사용자 active track 으로 직접 옮기는 실험 2개. 각 아이디어 = 가설 / 데이터 / 비교 조건 / 예상 결과 / 반증 조건 / 비용 추정.

---

## 아이디어 1 — Synthetic Hawkes 위에서의 THP grokking 측정

### 가설

> THP 가 Synthetic Hawkes 데이터셋에서 학습될 때, **train NLL 의 plateau 동안 train accuracy 가 100% 인 시점이 있고, 이후 한참 뒤에 test NLL 이 jump 하며 동시에 학습된 강도와 진짜 강도의 L2 거리가 plateau-style 로 떨어지는 phase transition 이 발생한다** (즉 점과정 setup 에서 grokking 의 직접 재현). 그 phase transition 의 시각은 Power 2022 의 modular arith 의 phase transition 처럼 weight decay, lr schedule, data size 에 sensitive 하다.

### 데이터

- **Synthetic Hawkes** (코드: NHP 의 `synthetic_data.py` 표준 generator).
- True parameters: $\mu = [0.1, 0.05, 0.07, 0.04, 0.06]$ (5 type), $\alpha_{kk'}$ 의 mutual-excitation matrix, $\beta = 1$ decay.
- 시퀀스 수: 100 / 500 / 2000 / 10000 (4 size 비교).
- 시퀀스 길이: 50 ± 30.

### 비교 조건

| 조건 | 변경 |
|------|------|
| Base | THP run.sh default (d=512, 4-layer, 4-head, lr=1e-4, dropout=0.1) |
| Small | THP d=64, 2-layer, 2-head |
| Large | THP d=1024, 8-layer, 8-head |
| No-WD | weight decay = 0 |
| High-WD | weight decay = 1e-3 (vs default 1e-5) |
| NHP | continuous-time LSTM, 같은 NLL loss |
| RMTPP | RNN + exp 강도 |

### 측정 지표 (epoch 별)

1. Train NLL
2. Test NLL
3. Train type accuracy
4. Test type accuracy
5. **Strength recovery L2**: 학습된 $\lambda_k^{\text{model}}(t)$ 와 진짜 $\lambda_k^{\text{true}}(t)$ 의 fine grid L2 distance.
6. **Progress measure (점과정 ver)**: 학습된 강도의 "정확한 trigger 구조 회복" 의 quantitative 진단 — 예: $\alpha_{kk'}^{\text{recovered}}$ 의 진짜 행렬과의 frobenius distance.
7. Attention entropy (각 head 별).

### 예상 결과

- (a) THP Large 가 Base 보다 더 늦게 grok 하지만 더 깊이 grok (training cost 와 그루킹 깊이의 trade-off).
- (b) High-WD 가 grokking 가속 (Power 2022 의 일관된 발견).
- (c) NHP 는 grokking phase 없이 점진적 수렴 (RNN 의 implicit bias).
- (d) Attention entropy 가 grokking jump 와 일치하는 시점에 drop — Nanda 2023 의 progress measure 의 점과정 ver.

### 반증 조건

- THP 가 Synthetic 에서 단조 수렴 (no plateau) → 점과정의 grokking 가설 직접 반증.
- High-WD 가 도움 안 됨 → grokking 의 모달리티 의존성 결정.

### 비용 추정

- Synthetic data sampling: 1 시간 (CPU).
- 7 조건 × 4 data size × 5 seeds = 140 학습 runs.
- THP Base = 100 epoch × 작은 데이터 → 약 30 분 / run (A100 1 장).
- 총: 140 × 30 분 = 70 시간 = 약 3 일 (single A100) or 12 시간 (8-GPU parallel).
- 분석·시각화: 추가 1 주.

### 가치 평가

- **Grokking track 의 직접 contribution**: NeurIPS 2027 plan §3 의 "TS forecasting grokking" 의 점과정 ver — 2 번째 domain 으로 확장. **single-domain grokking → cross-domain grokking 의 universality 증거**.

---

## 아이디어 2 — THP attention 의 head specialization 분석 (mech-interp 응용)

### 가설

> THP 의 4-head × 4-layer attention 에서 각 head 는 점과정 특수 기능 (recency, type-recall, mixing, long-range trigger, periodic) 중 하나로 specialize 한다. ACDC-style edge ablation 으로 head 별 기능을 정량 측정 가능하며, head specialize 정도가 (a) 강도 표현력 / (b) 학습 효율 / (c) 일반화 의 직접 predictor 다.

### 데이터

- **Synthetic Hawkes** (위 아이디어 1 과 동일 데이터로 cross-experiment).
- **Retweet** (실제 자기-자극 도메인의 standard).
- **Financial buy-sell** (실 mutual-excitation 도메인).

### 비교 조건

| 조건 | 변경 |
|------|------|
| Base 4×4 | run.sh default |
| Head ablate | 한 layer 의 한 head 를 zero-out → 가능도 변화 측정 |
| Layer ablate | 한 layer 전체 ablate |
| Random init | scratch init head 와 비교 (Random control of Voita 2019) |

### 측정 지표

1. **Per-head function classification**: 학습된 attention map 을 motif typology (APF 의 framework) 로 분류.
2. **Per-head NLL contribution**: edge ablation 시 NLL 변화 (큰 변화 = important head).
3. **Cross-data consistency**: Synthetic vs Retweet vs Financial 에서 같은 head 가 같은 기능을 학습하는가? (universality 가설).
4. **Head specialization → 학습 효율**: layer 1의 head 1 이 recency 학습한 sample 들에서 학습 곡선 measure.

### 예상 결과

- (a) **Layer 1**: recency head (1-2 개), padding-discrimination head.
- (b) **Layer 2**: type-recall head (사건 종류 같으면 attend), 직전 N 사건 mixing head.
- (c) **Layer 3-4**: long-range trigger head (멀리 떨어진 사건에 attention), 분포 균등 head.
- (d) **Retweet** 에선 same-user-recall head 가 specialize, **Financial** 에선 buy/sell type-flip head 가 specialize.
- (e) ACDC ablation 으로 모든 head 의 5% 이하 만 critical → 나머지는 redundancy (mech-interp 의 일반적 발견과 일치).

### 반증 조건

- 모든 head 가 같은 attention pattern 학습 → THP 의 4-head 가 redundancy → 1-head 도 충분히 성능.
- Cross-data 에서 head specialize 가 inconsistent → data-specific learning, universality 가설 반증.

### 비용 추정

- Synthetic + Retweet + Financial 3 데이터셋 × 5 seeds × 100 epoch = 15 runs × 1 시간 = 15 시간.
- ACDC ablation: 4 layer × 4 head = 16 ablation 조합 × 3 데이터셋 = 48 evaluation runs (학습은 1번만 done, ablation 만 추가 forward) = 약 5 시간.
- Motif typology 분류 (APF framework 적용): 2 일 (수동·자동 hybrid).
- 분석 + 시각화: 1 주.

### 가치 평가

- **APF + Grokking 양 track 의 cross-pollination**: APF 의 motif typology + Grokking 의 mech-interp 가 점과정 응용에서 융합.
- **사용자 NeurIPS 2027 plan 의 직접 contribution**: §4 "Mechanistic interpretability for TS event sequences" 의 첫 empirical 결과.

---

## 두 아이디어의 상호 강화

- 아이디어 1 의 grokking 측정 → 아이디어 2 의 head specialize 가 grokking phase 와 동기화되는지 확인 (Nanda 2023 의 progress measure 가 grokking 의 phase 와 일치).
- 둘 다 Synthetic Hawkes 를 공통 baseline → 같은 학습된 모델로 두 분석 모두 수행 가능.
- 사용자 active track 2 개 (APF + Grokking) 의 점과정 응용 cross-track contribution.

---

## 핵심 한 문장

> **THP 의 architecture 와 코드 공개를 활용해 (1) Synthetic Hawkes 위에서의 grokking phase transition 측정, (2) attention head specialization 의 mech-interp 분석 두 실험을 동일 학습된 모델에서 동시 수행하면, 사용자 두 active track 의 직접 contribution 두 개를 약 2-3 주 안에 얻을 수 있다.**
