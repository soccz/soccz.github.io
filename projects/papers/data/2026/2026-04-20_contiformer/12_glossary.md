# 12 Glossary & References — ContiFormer

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: Neural ODE / 연속시간 attention / irregular time series 의 핵심 개념 + reference 정리.

## 12.1 챕터 한 줄 요약

> **"Chen et al. NeurIPS 2024 의 *continuous-time Transformer* 30+ terminology + 20+ references (Neural ODE, ResNet→ODE, irregular TS papers) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| Neural ODE | ResNet 의 *infinite-depth limit* | Chen 2018 |
| ODE Solver | dh/dt = f(h,t) 의 numerical 해 | Hairer 1993 |
| RK4 | Runge-Kutta 4th-order solver | Hairer 1993 |
| Dopri5 | adaptive RK4(5) | Dormand 1980 |
| Adjoint method | ODE 의 *memory-efficient backprop* | Chen 2018 |
| ContiFormer | ODE-driven attention transformer | Chen 2024 ★ |
| `torchdiffeq` | PyTorch ODE solver | Chen open-source |
| `torchcde` | controlled differential equations | Kidger 2020 |
| Neural CDE | input path-driven ODE | Kidger 2020 |
| Latent ODE | latent dynamics | Rubanova 2019 |
| ODE-RNN | RNN + ODE between obs | Rubanova 2019 |
| GRU-D | masked GRU for missing | Che 2018 |
| mTAND | multi-time attention | Shukla 2021 |
| Irregular time series | non-uniform sampling intervals | Che 2018 |
| Sporadic data | very sparse irregular | Rubanova 2019 |
| Time embedding | t → R^d learned | Vaswani 2017 |
| RoPE | rotary position embed | Su 2021 |
| InterpLinear | linear interpolation projection | Chen 2024 |
| OdeLinear | ODE-driven projection | Chen 2024 |
| Vector field f_θ | learnable ODE dynamics | Chen 2018 |
| Initial condition | h(t_0) value | Chen 2018 |
| Hybrid dynamical system | reset at observation | Chen 2024 |
| Continuous attention | attention(q(t), k(t)) | Chen 2024 |
| TPP | Temporal Point Process | Du 2016 |
| EHR | Electronic Health Records | irregular TS canonical domain |
| `physiopro` | physiology benchmark library | Chen 2024 |
| Concat coupling | f(z, t) = MLP([z, t]) | Chen 2024 |
| Sigmoid activation | smooth gating | Chen 2024 |
| Tanh activation | bounded dynamics | Chen 2024 |
| Continuous-discrete bridge | discrete obs → continuous flow | Chen 2024 |

## 12.3 Notation

```
S = {(t_i, x_i)}     irregular observations
t ∈ [0, T]            continuous query time
X(t) ∈ R^d            interpolated input
q(t) ∈ R^d_k          continuous query
k_i(t), v_i(t) ∈ R^d  continuous key/value (ODE-driven)
f_θ^K, f_θ^V         vector fields (MLPs)
W_Q, W_K, W_V        projection matrices
Attn(t)               continuous attention output
```

## 12.4 References (20+)

### 12.4.1 Neural ODE foundations

```
Chen et al. 2018 — Neural ODE (★ foundational)
Rubanova et al. 2019 — Latent ODE for irregular TS
Kidger et al. 2020 — Neural CDE
Chen et al. 2018 — ODE adjoint method
```

### 12.4.2 Irregular TS predecessors

```
Che et al. 2018 — GRU-D (masked RNN)
Rubanova et al. 2019 — ODE-RNN
Shukla & Marlin 2021 — mTAND
De Brouwer et al. 2019 — GRU-ODE-Bayes
```

### 12.4.3 Transformer + TS

```
Vaswani et al. 2017 — Original Transformer
Li et al. 2019 — Informer (long-range TS)
Zhou et al. 2021 — Autoformer
Wu et al. 2023 — TimesNet
```

### 12.4.4 ContiFormer ecosystem

```
Chen et al. NeurIPS 2024 — ContiFormer (★ 본 paper)
Open-source: physiopro library
Benchmarks: PhysioNet, MIMIC-III, sporadic TS
```

## 12.5 Cross-Reference Matrix

| 본 deep dive 챕터 | 직접 reference |
|-------------------|----------------|
| 02_tldr | Chen 2024 §1 |
| 03_problem | Che 2018, Rubanova 2019 |
| 04_claims | Chen 2024 §3-4 |
| 05_method | Chen 2024 §3 + physiopro code |
| 06_experiments | Chen 2024 §4 + benchmarks |
| 13_insights | Chen 2018, Kidger 2020 |
| 14_code | torchdiffeq, physiopro |
| 17_aftermath | follow-up TS papers |

## 12.6 자기점검 (이 챕터)

### 핵심 3 가지

1. **Neural ODE 와 Neural CDE 의 *차이*?**
2. **ContiFormer 의 InterpLinear vs OdeLinear 의 *비대칭 설계*?**
3. **`torchdiffeq` 의 *adjoint method* 의 *memory benefit*?**

### 답변

1. **Driving signal 의 차이**. Neural ODE: dz/dt = f(z, t) — *internal* dynamics only. Neural CDE: dz = f(z) dX(t) — *external input path* X(t) 가 driving. CDE 는 *input 의 continuous flow* 직접 학습 — 더 표현적. ContiFormer = Neural ODE 선택 (CDE 의 vector field 차원 폭발 회피).

2. **Query = *순간 질의*, Key/Value = *과거 dynamics***. Query 도 ODE 면 "*질의가 과거 얼마나 돌아봄*" 의 *identifiability 문제* (query path + key path 의 *2D ambiguity*). Linear interpolation Query 가 *snapshot 의 명확함* + ODE Key/Value 가 *temporal flow*. *비대칭이 design 의 핵심*.

3. **Backpropagation 의 O(1) memory**. Vanilla autograd: ODE solver 의 *모든 intermediate state* 저장 → O(N) memory. Adjoint method: reverse-time ODE 로 gradient 재계산 → O(1) memory. *Tradeoff*: 2× compute. → *deep ODE network 학습 가능* — Chen 2018 의 *key technical innovation*.
