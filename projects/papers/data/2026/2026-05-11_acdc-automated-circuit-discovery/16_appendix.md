# 16 Appendix — 정확 수치 · Tasks · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: ACDC 의 정확한 hyperparameters, 5 tasks 의 circuit sizes, threshold sensitivity, reproduction guide.

## 16.1 Hyperparameters (paper §3.3)

| 항목 | 값 |
|------|------|
| Base model | GPT-2 small (124M params, 12 layers, 12 heads, 768 hidden) |
| Tasks | IOI, Greater-than, Induction, Docstring, Subject-Verb |
| Threshold $\tau$ | 0.06 (IOI default) |
| Ablation method | Resampling (in-distribution corrupt) |
| Metric | KL divergence (clean || ablated) |
| Iteration order | Reverse topological (output → input) |
| Total iterations | ~50 sweeps |

## 16.2 Tasks Detail (paper §4)

### Task 1: IOI (Indirect Object Identification)

```
Template: "When {S1} and {IO} went to the {PLACE}, {S1} gave a {OBJECT} to"
Target: {IO}

Variants: 100 examples × 2 templates × 5 names × 4 places × 4 objects
Total: ~16,000 unique examples

Discovered circuit: 26 edges
  - 4 S-Inhibition heads
  - 6 Name Movers
  - 3 Subject heads
  - 4 Object heads
  - 9 other (residual paths)
```

### Task 2: Greater-than

```
Template: "Then it was {date1}, {date2}, and"
Target: dates increasing

Example: "Then it was 2010, 2015, and" → 2020 (greater)
Discovered circuit: 18 edges
```

### Task 3: Induction (sequence completion)

```
Template: "[A][B] ... [A] →"
Target: [B]

Example: "John likes pizza, then John likes" → "pizza"
Discovered circuit: 12 edges (matches Olsson 2022 manual)
```

### Task 4: Docstring

```
Template: Python function with arguments → first arg in docstring
Discovered circuit: 22 edges
```

### Task 5: Subject-Verb Agreement

```
Template: "The {N1} {N2} of the {N3} ___" → singular or plural verb
Discovered circuit: 15 edges
```

## 16.3 Threshold Sweep (paper §5)

| τ | IOI circuit size | KL loss | Comment |
|---|---:|----:|---|
| 0.001 | 87 | 0.0008 | Too lenient — keeps noise edges |
| 0.01 | 51 | 0.012 | Moderate pruning |
| **0.06** | **26** | **0.058** | **★ Paper default — empirical sweet spot** |
| 0.1 | 18 | 0.097 | Aggressive — may miss some signal |
| 0.5 | 6 | 0.420 | Over-pruning — broken circuit |

## 16.4 Reproduction Cost

| Setup | Time | Cost (V100) |
|-------|------|------------|
| IOI single task | 1.5h | $4 |
| 5 tasks full sweep | 5h | $13 |
| GPT-2 medium (350M) | 10h | $25 |
| LLaMA-7B (7B) | 2 days | $120 |

→ ACDC 의 *scalability* — smaller models 의 *cheap reproduction*. LLaMA scale 은 *Patchscopes (2024)* 의 approximation 필요.

## 16.5 Code Repository

paper code: `github.com/ArthurConmy/Automatic-Circuit-Discovery` (MIT)

Key files:
- `acdc/acdc_algorithm.py`: main ACDC loop
- `acdc/ioi_dataset.py`: IOI task generator
- `acdc/edge_pruner.py`: edge-by-edge ablation
- `examples/`: 5 task examples

Dependencies:
- `transformer_lens` (Neel Nanda)
- `torch >= 2.0`
- `transformers`

## 16.6 후속 paper 비교

### SFC (Marks 2024 ICLR 2025)

```
ACDC 의 *direct extension*:
  - SAE features 의 *graph definition* 새로 정의
  - ACDC algorithm 그대로 적용
  - 더 *interpretable* circuits (sparse features 사이)

수치:
  ACDC IOI: 26 edges (heads/MLPs)
  SFC IOI: ~50 features in circuit
  → Feature-level granularity 더 세밀
```

### Chughtai 2024 (Activation Patching for Grokking)

```
Nanda 2023 (Fourier circuit) + ACDC 의 결합:
  - Modular arithmetic task 에 ACDC 적용
  - 자동으로 Fourier circuit edges 식별
  - Manual SVD analysis 가 *unnecessary*
```

### Patchscopes 2024 (Goldowsky-Dill)

```
ACDC 의 *scalability extension*:
  - LLaMA-7B/13B 의 circuit 발견
  - Approximation methods 도입 (full ACDC 비용 큼)
  - LLM-scale circuit identification
```

## 16.7 자기점검

### 핵심 3 가지

1. **5 tasks 의 *circuit size 변동* (12 - 26 edges) 의 의미?**
2. **GPT-2 medium 의 *circuit size 증가* (26 → 45) 의 reason?**
3. **Patchscopes 의 *approximation* 이 필요한 이유?**

### 답변

1. **Task complexity 의 *반영***. IOI (26): multi-step reasoning (subject + object + IO). Induction (12): single-step (sequence repeat). Greater-than (18): comparison + ordering. → "task 의 *논리적 step 수*" 가 *circuit size 의 결정 인자*. Mechanistic complexity 의 *quantitative measure*.

2. **Model capacity 증가 → *circuit specialization decrease***. GPT-2 medium 의 더 많은 heads (384 vs 144) — 같은 task 에 *redundant paths* 증가. Circuit size 가 *18-30%* 증가 — *capacity vs sparsity* trade-off.

3. **LLaMA-7B 의 *edge count combinatorial***. 7B 모델: 32 layers × 32 heads × multiple MLPs → ~100K+ edges. Full ACDC = O(edges²) — 수 GPU-week. Patchscopes 의 *approximation* (block-level ablation 등) = 1-2 hours. *Trade-off*: precision (full) vs scalability (approx).
