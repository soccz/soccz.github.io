# 19 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 19.1 챕터 한 줄 요약

> **"4 약점: (1) Diffusion inference 의 *slow speed* (multi-step denoising), (2) Multivariate-only (univariate 한계), (3) Conditional generation 의 *flexibility 한계*, (4) TFM era 의 *fundamental disruption*."**

## 19.2 약점 1 — Slow Inference

Diffusion = T-step denoising → *T forward passes* per sample. Standard T=100-1000. Production *real-time forecasting* 어려움.

## 19.3 약점 2 — Multivariate Focus

TimeGrad = multivariate optimized. *Univariate forecasting* 시 *overkill*. Specialized univariate models (Chronos, PatchTST) 가 *more efficient*.

## 19.4 약점 3 — Conditional Generation Flexibility

Conditional on past history only. *External conditioning* (text, events, macro indicators) integration 어려움.

## 19.5 약점 4 — TFM Disruption

2024+ TFM (Chronos, MOIRAI, TimesFM) 의 zero-shot SOTA = TimeGrad의 *per-task fine-tuning* 능가. *Relative obsolescence*.

## 19.6 자기점검

### 핵심 3 가지

1. **Diffusion inference speed 의 *production bottleneck*?**
2. **Conditional generation flexibility 의 *future direction*?**
3. **TFM era 에서 TimeGrad 의 *enduring value*?**

### 답변

1. **100-1000× slower than autoregressive**. Diffusion T=100 step denoising = 100 forward passes. Real-time forecasting (<1s) 어려움. **Mitigation**: DDIM, distillation, fewer steps (T=10-50). Paper 후속 work에서 *significant improvement*.

2. **Text-conditioned + multimodal diffusion**. 2024-2026 의 *text-to-TS* (Time-LLM 등). TimeGrad architecture 의 *classifier-free guidance* 적용 가능. *Cross-modal conditional generation* — open research direction.

3. **Probabilistic high-precision specialist**. TFM의 zero-shot probabilistic = generic. TimeGrad = *multivariate diffusion specialist* — 특정 *high-stakes uncertainty quantification* (energy load risk, financial VaR) 에서 *우위*. *Specialist + TFM hybrid* 의 production stack.
