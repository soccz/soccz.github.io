# 20 Self-Critique

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive missing pieces.

## 20.1 챕터 한 줄 요약

> **"4 약점: (1) VAE training instability, (2) SSM linearity 가정, (3) Multi-layer architectural complexity, (4) TFM era 의 simpler approaches와 competition."**

## 20.2 약점 1 — VAE Training Instability

Posterior collapse, KL annealing 같은 일반적 VAE issues. Multi-layer가 *cumulative instability*.

## 20.3 약점 2 — SSM Linearity

State-space transition 의 *linear assumption*. *Highly nonlinear dynamics* (chaotic systems)에서 *expressivity 한계*.

## 20.4 약점 3 — Multi-Layer Complexity

Hierarchical multi-layer SSM = *4-layer × 2 (gen/inf) = 8 sub-networks*. Debugging + production maintenance 복잡.

## 20.5 약점 4 — TFM Simpler Approach

Chronos 등 TFM의 *simple token distribution* 이 *probabilistic by construction*. ProTran 의 *explicit SSM* 의 marginal value 의문.

## 20.6 자기점검

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **VAE multi-layer의 *production reliability*?**
3. **TFM era 에서 ProTran 의 *enduring value*?**

### 답변

1. **TFM과의 *fair empirical comparison* 부재**. 2024 TFM (Chronos, MOIRAI) probabilistic output vs ProTran 의 *systematic comparison* paper 미존재. 본 deep dive 가 *historical context* 명시 — *current relevance assessment* 어려움.

2. **Cumulative posterior collapse risk**. Multi-layer VAE = 각 layer 의 instability *cumulative*. Production deployment 시 *checkpoint robust selection* + *training monitoring* 필수. Engineering overhead 큼.

3. **High-precision specialist + motion prediction**. Energy load forecasting의 *strict uncertainty calibration* 요구 시 ProTran 의 *structured framework* 우위. Motion prediction (autonomous driving)의 *temporal dynamics + uncertainty* 에 *natural fit*. TFM 의 *general probabilistic* 보다 *domain-specific 우위 유지*.
