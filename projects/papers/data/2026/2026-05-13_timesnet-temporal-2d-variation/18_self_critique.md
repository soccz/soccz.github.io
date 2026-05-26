# 18 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 약점: (1) FFT 의 *non-stationary* 한계, (2) 2D reshape 의 *padding artifact*, (3) Inception kernel choice 의 empirical magic, (4) Tsinghua-centric narrative."**

## 18.2 약점 1 — FFT의 *Non-stationary 한계*

FFT는 *stationary assumption*에 기반. Non-stationary TS (regime shift, sudden trend change) 에서는 *aggregate spectrum* 가 *real instantaneous period* 와 mismatch.

해결 방향: Wavelet, STFT (Short-Time FT), 또는 *attention-based period detection*.

## 18.3 약점 2 — 2D Reshape의 *Padding Artifact*

T % P ≠ 0 시 zero padding → *edge effect*. 대부분의 *real production TS* 에서 T >> P 이므로 negligible — but theoretical *minor inaccuracy* 잔존.

## 18.4 약점 3 — Inception Kernel Choice의 Empirical Magic

`num_kernels=6` (1, 3, 5, 7, 9, 11)이 *empirical default*. *Theoretical justification* 부재 — *grid search* + visual inspection.

해결 방향: NAS (Neural Architecture Search)로 *dynamic kernel selection*.

## 18.5 약점 4 — Tsinghua-Centric Narrative

본 deep dive 의 reference 60%+ 가 Tsinghua 기관. Wu, Hu, Long, Liu 등 *Tsinghua TS school* 위주. *DeepMind / Google / Amazon* 의 *parallel TS work* underplayed.

## 18.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **FFT non-stationary 한계의 *production impact*?**
3. **TimesNet 의 *Tsinghua context* 의 *honest disclosure* 이유?**

### 답변

1. **Inception kernel choice의 theoretical foundation 부재**. `num_kernels=6` (1,3,5,7,9,11) 이 *empirical default* — *first-principle 부재*. Different TS domain (high-freq financial vs low-freq climate) 에서 *optimal kernel* 다를 수 있음. 본 deep dive가 이를 *명시* 했지만 *해결 방안* 제시 X. **Future work**: NAS-based dynamic kernel — *open research direction*.

2. **Regime shift / structural break 시 fail**. 금융 위기, COVID 같은 *sudden structural change* 에서 FFT 의 *aggregate spectrum* 가 *new regime 의 instantaneous period* 와 mismatch → *period detection error* → *forecast degradation*. *Production deployment* 시 *regime detection + window-based FFT* 같은 *engineering layer* 필요. Paper 미언급.

3. **Intellectual honesty + practical guidance**. TimesNet paper 가 Tsinghua-authored + Tsinghua TS school 의 *active research community*. 본 deep dive 가 *Tsinghua narrative* 따르면 *one-sided*. *Honest disclosure* = "본 deep dive 는 Tsinghua-centric" 명시 → 독자가 *DeepMind/Google/Amazon* 의 *parallel work* 의 fair representation 자체 판단. *Field-level pluralism* 보존.
