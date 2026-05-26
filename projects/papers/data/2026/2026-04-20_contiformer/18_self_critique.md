# 18 Self-Critique — 본 deep dive 의 *missing pieces*

> **🧒 본 챕터는 "자기 비판"**: 본 deep dive 가 *제대로 다루지 못한* 점, *bias 가 있을 수 있는* 해석, *후속 연구로 검증 필요한* 가설.

## 18.1 챕터 한 줄 요약

> **"본 deep dive 의 4 가지 잠재 약점: (1) ODE solver 의 *numerical stability* 미충분, (2) Adjoint method 의 *gradient accuracy* 의문, (3) Vector field 의 *Lipschitz constraint* underplay, (4) Computational cost 의 *production scalability* concerns."**

## 18.2 약점 1 — ODE Solver Numerical Stability

### 18.2.1 문제 진술

```
RK4 / Dopri5 의 *theoretical convergence*:
  - Smooth, well-behaved f_θ 가정
  - Lipschitz continuity 필요

실제:
  - Neural network f_θ 가 non-Lipschitz 가능 (특히 ReLU)
  - Stiff dynamics (rapidly changing)
  - Numerical instability 가능
```

### 18.2.2 본 deep dive 의 처리

§14.3 에서 *RK4 default* 만 언급. *Stability theory* + *failure mode* 미분석.

### 18.2.3 미해결 질문

```
- Vector field 의 *Lipschitz constant* bound?
- Stiff dynamics 의 *detection + handling*?
- Implicit solver (BDF) 의 *adoption need*?
```

### 18.2.4 후속 연구 방향

```
- Spectral normalization on f_θ
- Adaptive solver selection (RK4 vs implicit)
- Stability analysis of trained ContiFormer
```

## 18.3 약점 2 — Adjoint Method Gradient Accuracy

### 18.3.1 문제 진술

```
Adjoint method = reverse-time ODE for gradient:
  - Theoretical: exact gradient
  - Practical: *numerical error 누적*
  
Solver step size 가 forward/reverse 에서 *동일* 가정.
실제: stiff problems 에서 *step mismatch 가능*.
```

### 18.3.2 본 deep dive 의 처리

§14.4 에서 adjoint 의 *memory benefit* 만 강조. *Gradient accuracy* 미분석.

### 18.3.3 미해결 질문

```
- Adjoint vs vanilla autograd 의 *empirical gradient mismatch*?
- Long-horizon (deep network) 의 *error 누적*?
- Hybrid (partial adjoint) 의 *cost-accuracy balance*?
```

### 18.3.4 후속 연구 방향

```
- Adjoint stability theory
- Mixed-precision adjoint (fp32 reverse + fp16 forward)
- Step-doubling for adaptive accuracy
```

## 18.4 약점 3 — Vector Field Lipschitz Constraint Underplay

### 18.4.1 문제 진술

```
Neural ODE 의 *theoretical existence + uniqueness*:
  - f_θ Lipschitz → 해 unique
  - Non-Lipschitz → ill-posed

본 deep dive 의 처리:
  - tanh / sigmoid activation 이 *implicit Lipschitz*
  - 명시적 *Lipschitz constraint* 없음
  - "잘 작동" 만 보고 *theoretical foundation* 회피
```

### 18.4.2 미해결 질문

```
- f_θ 의 *empirical Lipschitz constant*?
- Spectral normalization 의 *adoption benefit*?
- Lipschitz violation 시 *training breakdown* signature?
```

### 18.4.3 후속 연구 방향

```
- Lipschitz-constrained ContiFormer (spectral norm)
- Gradient flow analysis
- Theoretical convergence guarantee
```

## 18.5 약점 4 — Production Scalability

### 18.5.1 문제 진술

```
ContiFormer 의 cost:
  - 5-10× vanilla Transformer
  - ODE solve = sequential (per layer)
  - Batch parallelism 한계

Production scenarios:
  - Real-time clinical alert (<1s)
  - High-throughput ICU monitoring (1000+ patients)
  - Edge device deployment
```

### 18.5.2 본 deep dive 의 처리

§16.6 에서 training cost ($120) 만. *Inference cost* + *latency* 미분석.

### 18.5.3 미해결 질문

```
- Real-time inference latency?
- Batch size scaling 의 *GPU memory*?
- Edge device (low-power) deployment?
```

### 18.5.4 후속 연구 방향

```
- ContiFormer-V2 의 efficient ODE (paper §17.5.1)
- Knowledge distillation to smaller model
- TPU / specialized hardware optimization
```

## 18.6 본 deep dive 의 *bias 가능성*

### 18.6.1 Clinical domain over-emphasis

```
본 deep dive 의 reference 의 60%+ 가 clinical domain.
하지만 ContiFormer 의 적용:
  - 금융 시계열 (irregular trading)
  - Sensor network (sparse readings)
  - Astronomy (irregular observations)
  - Robotics (event-driven control)

→ Clinical only 의 *one-sided narrative* 위험.
```

### 18.6.2 "Continuous = better" over-claim risk

```
ContiFormer 가 *모든 irregular TS 의 정답* 처럼 묘사 가능.
하지만:
  - Sufficient density (e.g., 1Hz 이상): discrete 충분
  - Cost-sensitive: discrete 더 효율
  - Long horizon: Mamba / RNN 도 경쟁력
```

### 18.6.3 Recommendation

```
- 본 deep dive update 시:
  * Non-clinical domain 추가
  * "When to use ContiFormer" vs "When to use alternative"
  * Cost-benefit analysis 상세화
```

## 18.7 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 *가장 critical missing piece*?**
2. **ODE solver stability 의 *production risk*?**
3. **본 deep dive 의 *clinical-centric bias* 의 disclosure 이유?**

### 답변

1. **Production scalability 의 *real-world cost***. Academic SOTA (F1 0.73) 입증은 OK 하지만 *production deployment* (real-time, low-latency, edge device) 의 *engineering challenges* 미분석. 5-10× cost 가 *clinical alert* (<1s latency required) 에서 *practical bottleneck*. ContiFormer-V2 의 *efficient ODE* 가 *partial solution* — but *full production economics* (cost per patient/year, hardware ROI) 미공개. → *deployment 의 hidden cost*.

2. **Stiff dynamics 의 *silent failure***. ODE solver 가 stiff (rapidly changing) 문제 만나면 *step size 가 너무 작아 stuck* — *infinite loop* 또는 *NaN* gradient. Training 시 *간헐 spike* 로 manifest — *crash 또는 garbage output*. Adaptive solver (Dopri5) 가 *partial detection* 하지만 *complete elimination* 어려움. Production 시 *robust fallback* 필요 (e.g., Euler backup) — but ContiFormer paper 미언급.

3. **Intellectual honesty + practical guidance**. Paper 의 *PhysioNet / MIMIC* benchmark 가 *clinical-heavy* — natural. 본 deep dive 가 *clinical narrative* 따르면 *one-sided*. *Honest disclosure* = "본 deep dive 는 clinical 위주" 명시 → 독자가 *finance / sensor / robotics* 적용 가능성 *judgement 자가 수행*. *Cross-domain transferability* 의 *open question* 명시 = *fair representation*.
