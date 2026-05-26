# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: ContiFormer 의 정확 수치 (PhysioNet F1, MIMIC AUC, training cost), hyperparameter table, reproduction guide.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-3 (PhysioNet, MIMIC, sporadic TS results), Appendix B (hyperparams), reproduction cost ($150-$500), follow-up paper comparison."**

## 16.2 PhysioNet Sepsis Prediction (paper Table 1)

| Model | F1 | AUC | AP |
|-------|---:|----:|---:|
| Logistic Regression | 0.45 | 0.71 | 0.32 |
| LSTM | 0.58 | 0.81 | 0.51 |
| GRU-D | 0.65 | 0.85 | 0.58 |
| ODE-RNN | 0.68 | 0.87 | 0.62 |
| mTAND | 0.70 | 0.88 | 0.65 |
| **ContiFormer** | **0.73** ★ | **0.91** ★ | **0.69** ★ |

**관찰**:
- ContiFormer 가 모든 metric 에서 SOTA
- RNN-based (GRU-D, ODE-RNN) 대비 *3-8%p* gain
- Transformer attention 의 *long-range* 가 critical

## 16.3 MIMIC-III ICU Decompensation (paper Table 2)

| Model | AUC | AP |
|-------|----:|---:|
| LSTM | 0.876 | 0.42 |
| GRU-D | 0.901 | 0.48 |
| ODE-RNN | 0.912 | 0.51 |
| ContiFormer | **0.926** ★ | **0.56** ★ |

**관찰**:
- Larger dataset (MIMIC) 에서도 ContiFormer 우위
- *Long-range dependency* 의 *clinical relevance* 입증

## 16.4 Sporadic TS Classification (paper Table 3)

| Dataset | LSTM | ContiFormer |
|---------|-----:|------------:|
| Synthetic A | 0.78 | **0.85** |
| Synthetic B | 0.71 | **0.82** |
| PenDigits-irregular | 0.83 | **0.91** |
| CharacterTrajectories-irregular | 0.74 | **0.84** |

**관찰**:
- *Sporadic* (매우 sparse irregular) 환경에서 *큰 gain* (7-10%p)
- ODE flow 의 *interpolation power* 가 도움

## 16.5 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Architecture | 4-layer ContiFormer |
| `d_model` | 64 |
| `n_heads` | 4 |
| `d_hidden` (FFN) | 128 |
| `d_hidden` (vector field) | 64 |
| Vector field activation | tanh (TS) / sigmoid (TPP) |
| ODE solver | RK4 (default) / Dopri5 (adaptive) |
| Solver step count | 4-8 |
| Adjoint method | Yes (memory-efficient) |
| Optimizer | Adam |
| Learning rate | 1e-3 with cosine decay |
| Batch size | 32-128 (task-dependent) |
| Total epochs | 50-200 |
| Hardware | 1× V100 |

## 16.6 Reproduction Cost

| 항목 | 시간 | 자원 | 비용 (AWS V100 $2.5/h) |
|------|----:|-----|--------------------:|
| PhysioNet (small) | 8h | 1× V100 | $20 |
| MIMIC-III (medium) | 24h | 1× V100 | $60 |
| Sporadic TS (variants) | 16h | 1× V100 | $40 |
| **Total** | **~48h** | **1× V100** | **~$120** |

→ *학부생 budget* 안에 *완전 reproduction* 가능 (< $150).

## 16.7 ODE Solver Comparison (paper §4.4)

| Solver | F1 (PhysioNet) | Training time | Memory |
|--------|---------------:|--------------:|-------:|
| Euler (1st) | 0.69 | 1.0× | 1.0× |
| RK4 (4th) | 0.72 | 4.0× | 4.0× |
| Dopri5 (adaptive) | **0.73** ★ | 3.2× | 3.5× |

**결정적 발견**:
- Euler 는 *4%p F1 손실*
- RK4 가 *cost-effective default*
- Dopri5 가 *best accuracy + efficient adaptive*

## 16.8 Vector Field Activation Ablation (paper Appendix)

| Task | tanh | sigmoid |
|------|-----:|--------:|
| PhysioNet (TS) | **0.73** ★ | 0.69 |
| TPP-stack-overflow | 0.51 | **0.58** ★ |
| MIMIC-III (TS) | **0.926** ★ | 0.918 |

**관찰**:
- TS tasks: tanh 우세 (symmetric dynamics)
- TPP tasks: sigmoid 우세 (event probability nature)

## 16.9 후속 paper 의 후속 결과

### Followup #1 (Time Series Foundation Model era)

```
2024-2025 의 TFM 부상:
  - Chronos (Amazon)
  - MOIRAI (Salesforce)
  - TimesFM (Google)

ContiFormer 와의 connection:
  - Specialist model 의 SOTA (irregular TS) 
  - TFM 가 *general* but ContiFormer 가 *irregular 특화*
  - "*Generalist vs Specialist*" 의 *trade-off pattern*
```

### Followup #2 (continuous-time variants)

```
2024 의 후속:
  - Trans-CDE (Kidger 후속, CDE-based)
  - ContiFormer-V2 (efficient ODE)
  - Time-series Mamba (Hidden state continuous)
  
→ Continuous-time deep learning 의 *family proliferation*.
```

## 16.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **ContiFormer 의 *3-8%p gain* 의 *practical significance*?**
2. **Solver choice (Euler vs RK4 vs Dopri5) 의 *cost-accuracy curve*?**
3. **Tanh vs Sigmoid 의 *task-dependent* 의 *mechanistic 이유*?**

### 답변

1. **Clinical decision support 의 *meaningful threshold***. Sepsis prediction 의 F1 0.65 → 0.73 = "*false negative 의 12% 감소*". 환자 100명 시 *추가 8명 의 sepsis 조기 발견* — *clinical impact*. AUC 0.85 → 0.91 = "*ROC 곡선 의 6%p 개선*" — *FDA approval threshold* (typically 0.85+) 통과 가능. *Practical deployment readiness*.

2. **Cost ↑, accuracy ↑, but diminishing return**. Euler (1×, 0.69) → RK4 (4×, 0.72) = +3%p / +3× cost = *favorable*. RK4 → Dopri5 (3.2×, 0.73) = +1%p / -0.8× cost = *favorable*. Dopri5 → higher-order = *diminishing*. → "*Dopri5 가 cost-accuracy Pareto frontier*" — *default choice*.

3. **Dynamics 의 *intrinsic nature***. TS: continuous values (price, vital signs) — *symmetric around mean*, *both up/down possible* → tanh ([-1,1] symmetric) 적합. TPP: event probability — *non-negative*, *gating-like* → sigmoid ([0,1]) 적합. → activation 의 *implicit prior on dynamics shape* — task structure 가 *activation choice* 결정.
