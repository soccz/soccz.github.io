# 09_my_research — 내 연구와의 연결

> ⚠️ 본 절은 `_profile.md` 의 관심 영역 §A~F + 보유 자산 목록과 THP 를 mechanism / axis / 수식 요소 단위로 직접 연결한다. 일반론 (예: "참고 가능") 금지. 구체 paper §, 수식, 코드 위치 지정.

---

## A. APF (Attention Pattern Fields) 와의 연결 — 가장 강함

### A-1. PE × motif 가설의 연속시간축 검증 setup

**APF 의 핵심 가설** (`/mnt/20t/fin/Attention Pattern Fields/README.md`): "PE 변경(NoPE/sinusoidal/learned/RoPE/ALiBi)이 attention motif(diagonal/stripe/block/edge/spike/checker)의 형태를 직접 결정한다."

**THP 가 제공하는 것**: APF 의 기존 실험이 모두 **정수 position index** 에서 진행. THP 의 `temporal_enc(t)` 는 **실수 시간** 을 같은 sinusoidal 공식에 넣는다. 즉 **PE 의 입력 분포(정수 vs 실수, dense vs sparse)** 의 변화가 motif 형태에 미치는 영향을 검증할 가장 자연스러운 baseline.

**구체 연결**:
- APF §3 (가칭) motif 실험에 **"input 이 사건 시퀀스인 경우"** 를 한 PE family 로 추가. THP 의 sinusoidal time enc 를 그대로 채택.
- APF 의 motif typology 의 적용 — THP 의 학습된 attention 에서 `enc_slf_attn` (코드 verbatim 확인됨) 의 heatmap 을 motif 분류.
- 실험 설계: Synthetic Hawkes 데이터로 ground-truth 강도 알려진 환경에서, THP 학습 후 attention motif 가 (a) diagonal (직전 사건만 attention) vs (b) block (과거 batch 에 균등 attention) vs (c) spike (특정 사건에 집중) 중 어느 패턴이 우세한지 분류. RoPE / ALiBi 로 PE 만 교체했을 때 motif 변화 측정.

### A-2. 사용 인용 초안 (APF 논문에서)

> "본 연구의 motif 가설은 정수 position index 위에서 검증되었으나, 점과정 응용에서는 사건 시각이 연속 실수다. Zuo et al. (2020) 의 THP 는 Vaswani 2017 의 sinusoidal 공식을 실수 시간에 직접 적용한 첫 시도로, 본 연구의 PE family analysis 에 **'연속 시간축 PE'** 를 추가하는 자연스러운 확장 경로를 제공한다 [본 연구 §3.4 에서 실험]."

### A-3. 충돌·경쟁 지점

- **THP 의 attention 은 학습 가능한 PE 검증 대상으로는 한계**: temporal_enc 가 학습 가능 파라미터 0 → APF 의 learned PE 비교군에 안 맞음. **흡수 방법**: THP 의 코드에 `nn.Parameter` 로 learnable time encoding 옵션 추가하는 코드 패치.

---

## B. Grokking in Time Series Transformers 와의 연결 — 강함

### B-1. 사건 시퀀스에서의 grokking 가능성

**Grokking track 의 핵심 가설** (`/mnt/20t/fin/Grokking in Time Series Transformers/README.md`): "비정상 시계열 forecasting 에서 transformer 의 generalization phase 가 지연된다."

**THP 가 제공하는 것**: 사건 시퀀스의 학습 동학 → grokking 의 새 domain.
- THP 의 학습 곡선은 본문 미접근. 그러나 **사건 시퀀스 학습에서 train NLL 이 빠르게 떨어지고 test NLL 이 한참 뒤 떨어지는** 현상이 logistic map (사용자 thesis 비교 대상) 의 grokking 과 같은 mechanism 일 가능성.
- 특히 **Synthetic Hawkes parameter recovery** 는 grokking 의 정의에 가장 가까운 setup — "진짜 함수 회복" 의 시점이 train fit 시점보다 한참 뒤일 수 있음.

### B-2. 구체 실험 아이디어 (Grokking track 의 must-cite)

Power 2022 / Nanda 2023 / Lyle 2025 의 grokking 분석을 **점과정 setup 으로 이전**:
- 데이터: Synthetic Hawkes (진짜 $\mu, \alpha, \beta$ 알려진 작은 데이터셋).
- 모델: THP 의 4-layer encoder + 강도 헤드.
- 측정: epoch 별 (a) train NLL, (b) test NLL, (c) 학습된 강도와 진짜 강도의 L2 거리.
- 가설: train NLL 의 plateau 동안 강도 L2 가 떨어지는 시점 (Nanda 의 progress measure 와 같은 의미의 점과정 progress measure 발견 가능성).

### B-3. 사용 인용 초안

> "그리고 Zuo et al. (2020) 의 Transformer Hawkes Process 는 사건 시퀀스에서 self-attention 의 학습 동학이 RNN 점과정 (Mei & Eisner 2017) 보다 빠르게 generalize 하는 경향을 보고하지만, **그 generalization 의 phase 가 grokking 의 정의 (Power et al. 2022) 를 만족하는지 — train fit 후 한참 뒤 test 성능이 jump 하는지 — 는 본 연구의 새 검증 대상이다** [본 연구 §4.3]."

---

## C. P1 ProTran-TFA (paused) 와의 연결 — 중간

### C-1. 강도 헤드를 확률 헤드의 옵션으로

**P1 ProTran-TFA 의 핵심** (`/mnt/20t/fin/paper_test/PAPER_DRAFT_V1.md`): ProTran (Tang-Matteson NeurIPS 2021) 의 확률 예측을 변형. 분포 헤드 디자인의 옵션 다양화.

**THP 가 제공하는 것**: THP 의 강도 헤드 $\lambda_k(t) = \mathrm{softplus}(\alpha_k \Delta t / t_j + w_k^\top h + b_k)$ 는 **연속시간 단위시간 확률** 의 가장 단순한 parametric 형태. ProTran-TFA 가 Gaussian / Student-T / quantile 헤드를 비교하는데, **점과정의 강도 헤드** 옵션을 추가 가능.

**구체 연결**:
- ProTran-TFA §4 (강도 헤드 옵션 절) 에 THP-style softplus + 선형 시간 항을 비교군으로 추가.
- 사건 도착 사이의 시간 자체를 inter-arrival distribution 으로 보면, $f(\Delta t) = \lambda(t) \exp(-\int_0^{\Delta t} \lambda(s) ds)$ → THP 헤드 자체가 distribution 함의.

### C-2. 사용 인용 초안 (ProTran-TFA 논문에서)

> "분포 헤드의 옵션으로 Gaussian/Student-T 외에 점과정 강도 (Zuo et al. 2020) 를 검토한다. 강도 $\lambda(t) = \mathrm{softplus}(\alpha \Delta t / t_j + w^\top h + b)$ 는 양수성과 closed-form inter-arrival 분포 ($f(\Delta t) = \lambda \exp(-\int \lambda)$) 를 동시에 보장하여, regime-switching 의 burst 와 quiet phase 를 단일 함수로 표현 가능하다 [본 연구 Appendix B]."

### C-3. 충돌·경쟁 지점

- ProTran 은 **양 끝 timestamp 사이의 분포** 를 모델링 (interpolation). THP 는 **사건 도착 시각** 을 모델링 (point). 도메인 자체가 다름 → ProTran-TFA 에서 THP 는 distinct option 으로만 비교 가능.

---

## D. AETHER (shelved, crypto-ml) 와의 연결 — 강함 (개념적)

### D-1. 청산 cascade 와 mutual-excitation

**AETHER 의 도메인** (`/mnt/20t/fin/AETHER_IDEA.md`): 비트코인 시장 microstructure. 청산 cascade (한 청산이 다음 청산을 유발) 는 **자기-자극 점과정의 정의** 그 자체.

**THP 가 제공하는 것**: AETHER 의 청산 도착을 marked point process 로 직접 모델링. 사건 type = (long-liquidation, short-liquidation, large-trade, regime-flip). THP 의 multi-type 강도가 자연스럽게 적용.

**구체 연결**:
- AETHER 설계의 BTC perpetual swap 데이터로 THP 학습.
- Mutual-excitation 측정: long-liq → short-liq 의 cross-excitation (사건 종류 간 $w_k$ 학습 가중치) 를 attention map 으로 시각화.
- 결과: 청산 cascade 의 trigger 시각·trigger type 식별.

### D-2. 한계

- THP 의 attention 은 binary causality (mask) → mutual-excitation 강도 정량화는 attention weight 의 사후 해석에 의존. AETHER 가 직접 요구하는 **multi-asset Hawkes** (예: BTC liquidation → ETH liquidation cross-excitation) 는 THP single-asset 확장 필요.

---

## E. EOA / F6 (shelved) 와의 연결 — 약함

`economic_ode_attention/` 의 wall-clock vs economic-time 가정. THP 의 `temporal_enc(t)` 는 wall-clock t. **연결 약함** — economic time 으로 transform 한 t 를 THP 에 넣는 것은 trivial 응용. 별도 contribution 없음.

---

## F. Mechanistic Interpretability 와의 연결 — 잠재력 강함

### F-1. THP attention 의 head specialization 분석

**관심 영역 §B** (Olsson 2022 / Wang 2023 / Marks 2024 / Bricken 2023): transformer attention 의 head 들이 어떤 특수 기능을 학습하는지.

**THP 가 제공하는 것**: 4-head × 4-layer 의 attention `enc_slf_attn` (코드 verbatim) 를 사후 해석. 각 head 가 (a) 최근 사건만 attention (recency head), (b) 같은 type 사건 attention (type-recall head), (c) 분포 균등 attention (mixing head), (d) 멀리 떨어진 trigger attention (long-range head) 중 어느 패턴인지 분류.

**구체 실험**:
- Synthetic Hawkes 학습 THP 의 attention 패턴을 motif 분류 (APF 의 framework 적용).
- 각 head 를 ACDC-style edge ablation → 가능도 변화 측정.
- Head 별 기능 표 (Voita 2019 의 자연어 transformer 분석을 점과정 transformer 로 이전).

### F-2. Sparse Feature Circuits 응용

**Marks 2024 (이미 커버 — 2026-05-15 ✓)** 의 SAE feature circuit 을 THP 의 hidden state $h_j$ 에 적용. 각 사건 후 hidden 의 sparse feature 가 어떤 강도 효과를 갖는지 인과적 분석. **mech interp + point process 의 융합** — 사용자의 두 active track 모두에 연결.

---

## 보유 자산 활용 매핑

| 자산 | THP 와의 연결 | 활용 방안 |
|------|--------------|----------|
| **APF** (active) | A 절 — PE × motif 검증의 연속시간 case | THP 의 sinusoidal time encoding 을 PE family 의 한 옵션으로 추가 |
| **Grokking** (active) | B 절 — 사건 시퀀스 grokking | Synthetic Hawkes 에서 THP 학습 동학의 phase transition 측정 |
| **ProTran-TFA** (paused) | C 절 — 분포 헤드 옵션 | THP softplus 헤드를 ProTran 의 분포 옵션으로 추가 |
| **AETHER** (shelved, idea) | D 절 — 청산 cascade | BTC liq 데이터로 THP 학습, mutual-excitation 분석 |
| **Synthetic data (logistic/regime/sin)** | B 절 grokking 비교 + A 절 motif 검증 | THP 의 synthetic Hawkes baseline 과 동일 frame |
| **금융 backup (GSPC/IXIC/Ken French)** | D 절 mutual-excitation | 일별 사건 (시장 큰 변동) 의 점과정 모델링 |

---

## 핵심 결합 mechanism (한 문장)

> **THP 의 기여 중 사용자 연구에 가장 즉시 적용 가능한 것은 (1) 연속시간 sinusoidal PE 의 APF motif 검증 추가, (2) Synthetic Hawkes 위에서의 grokking 학습 동학 측정, (3) attention head specialization 의 mech-interp 분석 의 셋이며, 이 셋은 APF + Grokking 두 active track 의 다음 실험 캘린더에 직접 꽂힌다.**

---

## 반면교사

- **THP 가 못한 것**: 본 환경에서 본문 미접근으로 정확한 ablation 의 hyperparameter sensitivity 표 미확인. 사용자 자신의 실험에선 **데이터셋 단위 정규화** + **seed 다중 실행** + **std 보고** 를 명시 채택.
- **README 의 시간 단위 경고**: 사용자의 APF / Grokking 코드에서 시간 단위 추적은 메타데이터로 명시 (예: `time_unit: 'seconds'` 같은 dataset 메타 필드).
- **사건 type 수 한계 (K~22)**: 더 큰 K 도메인에서 강도 헤드의 $w_k$ matrix 폭발이 발생할 수 있으므로, 사용자 도메인 (예: token-level event) 에선 hierarchical type 임베딩 검토.
