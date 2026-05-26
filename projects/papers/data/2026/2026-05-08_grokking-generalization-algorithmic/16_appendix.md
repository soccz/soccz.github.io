# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Power 2022 정확 수치, hyperparams, reproduction.

## 16.1 챕터 한 줄 요약

> **"paper Table 1-3 (모든 operations × all train fractions), hyperparams, reproduction guide ($60-$120)."**

## 16.2 Grokking Speed (paper Table 1)

p=97, weight_decay=1e-2, lr=1e-3, train_fraction=0.3:

| Operation | Steps to memorize | Steps to grok | Final val acc |
|-----------|------------------:|--------------:|--------------:|
| Addition (a+b) | 50K | 5M | 100% |
| Subtraction (a-b) | 50K | 5M | 100% |
| Multiplication (a*b) | 80K | 8M | 100% |
| Division (a*b^-1) | 100K | 10M | 100% |
| **Complex (a^3+b)** | 150K | 30M+ | 95% (slow) |

## 16.3 Hyperparameter Sensitivity (paper §5)

### Weight Decay

| WD | Result |
|---|--------|
| 0 | No grok (5M test) |
| 1e-4 | No grok (5M test) |
| 1e-3 | Slow grok (~50M steps) |
| **1e-2** | **Standard grok (5M)** ★ |
| 1e-1 | Over-regularize (slow) |
| 1.0 | Fail (no learning) |

### Train Fraction

| Fraction | Result |
|---|--------|
| 0.1 | No grok |
| 0.2 | No grok |
| **0.3** | **Standard grok** ★ |
| 0.5 | Faster grok (~1M) |
| 0.9 | Near-memorize (fast) |

### Other Hyperparameters

| 변경 | Result |
|------|--------|
| Dropout 0.1 | No grok (CRITICAL) |
| LayerNorm only | OK |
| 1-layer model | OK |
| 12-layer model | OK |
| `d_model=64` | OK |
| `d_model=512` | OK |

## 16.4 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Modular prime `p` | 97 |
| Train fraction | 0.3 |
| Architecture | Transformer encoder |
| Layers | 2 |
| Heads | 4 |
| `d_model` | 128 |
| FFN dim | 512 |
| Dropout | 0.0 (★ critical) |
| Activation | GELU |
| Optimizer | AdamW |
| Learning rate | 1e-3 |
| **Weight decay** | **1e-2** (★ critical) |
| Batch size | 512 |
| Total steps | 1-10M (operation-dependent) |
| Hardware | 1× V100 |

## 16.5 Reproduction Cost

| 항목 | 시간 | 비용 (V100 $2.5/h) |
|------|----:|------------------:|
| Single operation (addition) | 24h | $60 |
| 4 operations | 96h | $240 |
| WD ablation (5 values) | 120h | $300 |
| **Full reproduction** | **~10 days** | **~$600** |

→ *학부생 + 소규모 lab budget* 안.

## 16.6 후속 paper 의 후속 결과

### Nanda 2023 (Progress Measures)

```
Power 의 grokking phenomenon → Nanda 의 mechanism:
  - Fourier feature emergence identification
  - "Circuit progress" measurement
  - "Sum of frequencies" feature
```

### Lyle 2024 (Grokking under non-stationarity)

```
Power 의 stationary setting → Lyle 의 *task switching*:
  - Grokking + plasticity loss interplay
  - Non-stationary 의 challenge
```

### Wang 2024 (Grokked Transformers as Reasoners)

```
Power 의 modular toy → Wang 의 complex reasoning:
  - Composition, comparison tasks
  - Grokked Transformer > GPT-4
  - Practical implication
```

## 16.7 자기점검

### 핵심 3 가지

1. **Operations 별 *grokking speed* 차이의 *combinatorial intuition*?**
2. **WD=1e-2 + Dropout 0 의 *razor-edge sensitivity* 의 의미?**
3. **Reproduction $600 의 *학생 접근성*?**

### 답변

1. **Compositional complexity 의 ordering**. Addition: linear modular 가장 단순 (5M). Multiplication: bilinear 더 복잡 (8M). Division: 역원 계산 (10M). a^3+b: cubic + linear (30M+). *Compositional depth 가 grokking time 결정* — *circuit complexity* 의 *direct reflection*.

2. **Implicit + explicit regularization 의 conflict**. WD=1e-2 = *implicit Occam's razor* (Fourier circuit 유도). Dropout = *random masking* (different implicit regularization). 두 가지가 *conflict* → *consistent circuit formation* 방해. → "*Single dominant regularization*" 필요 — *empirical razor-edge*.

3. **$600 학부생 budget 안**. 4 operations + WD ablation = ~$600. 단일 operation 만이라면 $60. *학교 cluster* 사용 시 *완전 무료*. *Open-source code* (Github Anthropic / OpenAI repos) 활용 → *학부 thesis 수준* 의 *완전 reproduction*. *Highly accessible*.
