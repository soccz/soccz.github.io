# 09 · 내 연구와의 연결

본 절은 `_profile.md` 의 관심 영역 §A~F + 보유 자산 (Grokking in TS Transformers track, APF, P1 ProTran-TFA paused, AETHER shelved) 과 Omnigrok 을 *구체적으로* 연결한다. 일반론 ("시계열 모델에 참고 가능") 금지 — Paper / draft / 수식 위치를 명시한다.

## 흡수할 기법 — 어디에 어떻게 쓸지

### 흡수 1 — `Grokking in Time Series Transformers/paper/sections/` 의 *원인 가설 절* 에 LU mechanism 인용

**위치**: 사용자의 active track `Grokking in TS Transformers/` 의 PAPER_PLAN.md 가 9 ~ 10 개월 plan 으로 NeurIPS 2027 1 순위 / TMLR backup. 그 paper 의 §"왜 grokking 이 일어나는가" 절이 필요한데, 현재 must-cite 22 편 중 *원인 가설을 universal mechanism 으로 framing 한 가장 강한 후보* 가 Omnigrok 임.

**어떻게**: §"Background / Causal Hypotheses for Grokking" 안에서 다음 sub-paragraph 를 작성:

> "Liu, Michaud, Tegmark (2023) propose the *LU mechanism*: in the reduced weight-norm landscape, the train loss takes an L-shape and the test loss takes a U-shape, with their mismatch producing the Goldilocks zone of generalization. Their argument is universal across image (MNIST), text (IMDb LSTM), molecule (QM9 GCNN), and algorithmic (modular addition) domains. We extend their framework to *non-stationary time series*, where we additionally test whether the Goldilocks zone *drifts* under regime change — a hypothesis their static landscape cannot directly address."

이 sub-paragraph 가 본 논문의 *최강 인용 포인트*. Omnigrok 의 universal framing 을 인용하면서 동시에 *TS 의 non-stationary 측면이 새로운 변수* 라는 사용자의 differentiator 가 즉시 드러난다.

### 흡수 2 — `Grokking in TS Transformers/references/must_cite.md` 의 Tier 1 priority 행 갱신

현재 `must_cite.md` 는 22 편 + Tier 1 priority 5 편. Omnigrok 은 이 중 *Tier 1 priority 5 편* 의 한 자리에 정확히 들어맞음 (Power, Nanda, Liu Effective Theory, Lyle 와 함께). 따라서:

- **현재**: must_cite.md 에 "Omnigrok (Liu, Michaud, Tegmark, ICLR 2023)" 항목 추가.
- **인용 위치**: paper 의 *Introduction* 의 "previous work" 절, *Background* 의 LU 인용, *Discussion* 의 limitation 반박 ("non-stationarity 가 추가 변수" 라는 점에서 Omnigrok 정적 landscape 의 한계 보강).

### 흡수 3 — `Attention Pattern Fields/PRIOR_ART.md` 의 *training dynamics axis* 인용

APF 의 핵심 framing 은 "PE → 2D attention motif → CNN probe → causal intervention" 의 4 단계 framework. 이 framework 의 *training dynamics 측면* — "motif 가 학습 도중 어떤 *order* 로 등장하는가" — 가 본 논문의 LU mechanism 의 직접 후속이 될 수 있음. 즉:

- **가설**: 각 PE (NoPE / sinusoidal / RoPE / ALiBi) 별로 *attention motif 의 emergence* 가 *layer-wise weight norm* 의 함수로 표현된다. 즉, 각 motif 가 자기만의 *Goldilocks band* 를 가질 수 있다.
- **PRIOR_ART.md 의 위치**: §"Training Dynamics / Phase Transitions in Attention Mechanism" 라는 새 sub-section 을 만들어 Omnigrok 을 그 첫 인용으로 — 현재 PRIOR_ART.md 는 attention-as-explanation / PE-attention-geometry 위주이고, training dynamics axis 가 약함. 이 보강이 reviewer 의 *"왜 APF 가 다른 mech-interp 와 다른가"* 질문에 한 줄 답이 된다.

### 흡수 4 — `Grokking in TS Transformers/` 의 P2 logistic 4-layer 실험 baseline 수정

**현재 status**: Week 1 setup, P2 logistic 4-layer 실험 background 진행 중. logistic map 의 chaotic iterate 가 *얼마나 grokking 을 보여 줄 수 있는가* 가 P2 의 핵심 질문.

**Omnigrok 를 흡수**: P2 의 실험 protocol 에 *Omnigrok-style landscape 측정* (sphere projection 으로 reduced landscape 측정) 을 추가 — 즉, logistic-map task 에서도 L 자 train + U 자 test 가 나오는지 직접 측정. 만약 나온다면 본 논문의 가장 강한 후속 실증. 안 나오면 *왜 non-stationary task 에서 LU 가 깨지는가* 라는 새 contribution.

**구체 implementation**: 사용자의 logistic_map_grokking experiment 코드 (현재 background 진행 중) 에 `landscape/` mode 추가 — Omnigrok 의 `mod-addition/landscape/` notebook 을 참고해서 sphere projection 함수 borrow.

## 충돌 / 경쟁 지점

### 충돌 1 — Omnigrok 의 *정적 landscape* vs 사용자 TS track 의 *시간 의존 landscape*

**충돌 내용**: Omnigrok 의 reduced landscape 는 *데이터·모델 고정* 후의 *정적* 형태. TS forecasting 에서 데이터 분포가 시간에 따라 변하면 (non-stationarity) Goldilocks zone 의 *위치 $w_c$ 자체가 시간의 함수* 가 될 수 있다 — 사용자의 P2 가설.

**어떻게 다루나**: 사용자 paper 의 *Discussion* 절에서 Omnigrok 의 *static* 한계를 명시하고 *dynamic Goldilocks zone* 을 도입. 인용 문장 초안: *"While Liu et al. (2023) characterize the Goldilocks zone as a fixed spherical shell of radius $w_c$ in a stationary loss landscape, time series data with non-stationary distributions induce a time-varying $w_c(t)$. We show that under regime shift, the zone center can drift faster than weight decay can track, producing a *delayed grokking under regime change* phenomenon previously unobserved in algorithmic settings."*

이 문장은 사용자 differentiator 의 직접적 표현 — Omnigrok 을 *반박* 하지 않고 *확장* 하는 포지셔닝.

### 충돌 2 — Omnigrok 의 *global weight norm* vs APF 의 *attention pattern locality*

**충돌 내용**: Omnigrok 의 axis 는 *모델 전체* 의 $\|w\|$. APF 의 axis 는 *각 layer 의 attention motif*. 두 framework 가 직접 호환되지 않음.

**어떻게 다루나**: APF 의 PRIOR_ART.md 에 한 줄: *"While Omnigrok works with global weight norm, APF observes that attention motifs (per-layer, per-head) emerge in a specific order during training. The natural extension is to define a layer-wise reduced landscape $\tilde L^{(\ell)}(r_\ell)$ and to ask whether each layer has its own Goldilocks zone."* 즉 *layer-wise LU* 라는 확장 가설을 제안. 본 논문 자체와의 충돌이 아니라 *extension 의 가능성* 으로 포지셔닝.

## 인용 포인트 — paper 어느 섹션에, 어떤 문장 형태로

### Grokking in TS Transformers paper (NeurIPS 2027 plan)

- **Introduction §1.2 "Why Grokking in TS?"**: Omnigrok 의 *universal claim* 인용 → "TS 도 같은 framework 안에 들어와야 함" 의 동기.
- **Background §2.3 "LU Mechanism and Goldilocks Zone"**: Omnigrok 의 Claim 2 + Claim 3 을 상세 인용. Fig 1 schematic 참조.
- **Method §3.2 "Time-varying Goldilocks Zone"**: 사용자 differentiator — $w_c$ 가 $t$ 함수임을 정식화하고 Omnigrok 의 정적 가정을 *generalize*.
- **Experiments §4.1 "Reduced Landscape under Regime Shift"**: Omnigrok-style sphere projection 측정을 TS task 로 옮긴 첫 실험.
- **Discussion §5.2 "Limitations of Static Landscape"**: Omnigrok 의 *direction stationary* 가정이 modern transformer 에서 깨질 수 있음을 *내 데이터로 보여 줌*.

### APF paper

- **PRIOR_ART §B.4 "Training Dynamics"**: Omnigrok 의 LU 가설을 *layer-wise* 로 generalize 할 수 있다는 후속 가설.
- **Discussion (final paper)**: APF 의 *motif emergence order* 가 *layer-wise weight norm growth order* 와 일치하는지의 후속 실험 약속.

## 반면교사 — Omnigrok 이 못한 것 / 내가 다룰 것

### 반면교사 1 — Multi-seed 통계 부재 (추정)

Omnigrok 이 single-run schematic 위주라면, 내 paper 에서는 *seed 별 grokking time 분산* 을 직접 보고. 이게 사용자 paper 의 *경험적 robustness* 차별점.

### 반면교사 2 — 실제 표준 finance / TS data 부재

Omnigrok 의 5 도메인은 ML 표준 dataset 한정 (MNIST / IMDb / QM9). 내 paper 는 *finance TS* (P1 ProTran-TFA 의 fin 데이터, Fama-French 25, GSPC/IXIC) 에서 LU 가 어떻게 보이는지 (보이는지 아닌지) 보고. 이게 본 논문이 *application 측면에서 못 한 차별점*.

### 반면교사 3 — Causal intervention 부재

Omnigrok 의 evidence 는 *correlative* — landscape 측정과 grokking 시점의 일치. 직접 *causal intervention* (예: weight 를 인위적으로 Goldilocks 밖으로 밀면 grokking 이 사라지는가?) 은 본문에서 일부만 다뤘을 가능성. APF 의 *causal intervention* axis 가 이 약점을 보강 — *attention motif 를 인위적으로 망가뜨려도 grokking 이 일어나는가* 같은 실험으로 LU 의 *충분 vs 필요* 조건을 distinguish.

## 한 문장 요약

Omnigrok 은 사용자 Grokking track 의 *원인 가설 슬롯* 의 정확한 인용 후보이며, 사용자의 *non-stationary TS 차별점* 과 APF 의 *attention motif locality 차별점* 두 곳에서 본 논문을 *확장하는 포지셔닝* 으로 paper 의 framing 을 단번에 정돈할 수 있다.
