# 21 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 21.1 챕터 한 줄 요약

> **"4 약점: (1) Auto-correlation 의 *stationary 가정*, (2) Long-horizon error 누적, (3) Single-variate channel-independent 한계, (4) TFM era 의 *relative obsolescence*."**

## 21.2 약점 1 — Stationary 가정

Auto-correlation 계산이 *stationarity* 가정. *Non-stationary TS* (regime change, structural break)에서 *accuracy 저하*.

## 21.3 약점 2 — Long-Horizon Error 누적

96 → 720 step prediction = encoder-decoder 통합 forward. 더 긴 horizon (1440+) 에서 *systematic error*. Production *1-year forecast* 미증명.

## 21.4 약점 3 — Channel-Independent

Multi-variate 의 *cross-variable dependency* 미명시 처리. iTransformer 같은 *channel-aware* 의 후속 paper 가 *gap fill*.

## 21.5 약점 4 — TFM Era 의 Obsolescence?

2024 의 TFM 부상 = zero-shot SOTA. Autoformer 의 *per-task specialist value* 가 *relative obsolescence*. 본 deep dive 가 *modernity caveat* 부족.

## 21.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **Stationary 가정의 *real production risk*?**
3. **TFM era에서 Autoformer 의 *enduring value*?**

### 답변

1. **TFM era 의 *positional context* 부재**. 2021 Autoformer = SOTA at time. 2024+ TFM 의 zero-shot 우위. 본 deep dive 가 *historical context* 명시 안 함 — *current reader 의 perspective* 부족. Future update 시 "*pre-TFM specialist peak*" 의 *temporal framing*.

2. **Regime change 시 fail**. 금융 위기, COVID, 정책 변화 등 *structural break* 시 *auto-correlation pattern* 변화 → *forecast degradation*. Production 시 *regime detection + model retraining* 같은 *engineering layer* 필요.

3. **Specialist depth value**. TFM의 *broad zero-shot* + Autoformer의 *long-horizon specialist* = *complementary stack*. 특정 domain (energy load forecasting, traffic 같은 *strong periodicity*)에서 Autoformer가 *fine-tuned우위*. *Pre-TFM specialist 의 enduring practical value*.
