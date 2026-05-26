# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: paper Marks et al. ICLR 2025 의 정확 수치 (SAE size, sparsity, circuit size, faithfulness/completeness/minimality, bias reduction), hyperparameter table, reproduction cost.

## 16.1 챕터 한 줄 요약

> **"paper Table 1 (SAE specs), Table 2 (IOI / Subject-Verb circuit results), Table 3 (Bias removal numbers), Figure 4 (Attribution correlation) 의 정확 수치 + reproduction guide + 후속 연구 trajectory."**

## 16.2 SAE Specifications (paper Table 1)

| 항목 | 값 |
|------|------|
| Base model | Pythia-70M / Pythia-2.8B |
| SAE input | residual stream (post-LN) |
| Layers covered | 모든 layer (6 / 32 each) |
| `d_model` | 512 (70M) / 2560 (2.8B) |
| `d_sae` | 32,768 (70M) / 131,072 (2.8B) — 64× expansion |
| Sparsity loss | L1, λ=1e-3 |
| Reconstruction loss | MSE |
| Activations | 100M-300M tokens (training data) |
| Active features/token | ~50-150 (≈ 0.15-0.5%) |
| Reconstruction loss | < 0.05 |
| Monosemantic rate | ~85-95% of active features |

## 16.3 Attribution Patching Validation (paper §3, Figure 4)

| Metric | 값 |
|------|------|
| Correlation (attribution vs explicit ablation) | **0.95-0.98** |
| Speed-up (attribution / explicit) | ~1,000× |
| Failure mode | High-order interactions (rare, < 5%) |

**해석**: First-order Taylor 가 *거의 모든 features* 에서 정확. High-order 가 중요한 경우 → ACDC 같은 explicit method 보완.

## 16.4 IOI Circuit Results (paper §4, Table 2)

paper 의 Indirect Object Identification task 의 *circuit identification* :

| Metric | ACDC (Conmy 2023) | SFC (Marks 2024) |
|--------|-------------------|------------------|
| Units | 12 attn heads | 50 SAE features |
| Faithfulness | 0.89 | **0.95** ★ |
| Completeness | 0.91 | **0.97** ★ |
| Minimality | 0.85 | **0.93** ★ |
| Speed (per task) | 6 hours | **5 minutes** ★ |
| Interpretability | "head 6.9 = name mover" | "feature_8K = subject token, feature_12K = name copy" |

**관찰**:
- SFC 의 3 metric 모두 ACDC 보다 5-8% 높음
- 75× speed-up
- Feature-level 의 의미가 head-level 보다 *concrete*

## 16.5 Subject-Verb Agreement Circuit (paper Table 2)

| 항목 | 값 |
|------|------|
| Task | Subject-Verb agreement (singular/plural matching) |
| Circuit size | 35 features × 4 layers = ~140 unit-equivalents |
| Faithfulness | 0.94 |
| Completeness | 0.96 |
| Minimality | 0.91 |
| Identified features | "singular subject", "plural subject", "verb copy", "agreement gate" |

## 16.6 Bias Removal Results (paper §5, Table 3)

| Occupation prompt | Pre-ablation he/she ratio | Post-ablation | Reduction |
|-------------------|-------------------------:|--------------:|----------:|
| "The doctor is" | 78/22 (3.5×) | 51/49 | **46%** |
| "The nurse is" | 18/82 (0.22×) | 49/51 | **44%** |
| "The engineer is" | 88/12 (7.3×) | 52/48 | **48%** |
| "The teacher is" | 28/72 (0.39×) | 49/51 | **40%** |
| Average | - | - | **44.5%** |

**검증**:
- Language modeling perplexity: 4.21 → 4.27 (Δ < 1.5%, negligible)
- Other downstream tasks (NLI, QA): accuracy 변화 < 1%
- → "bias 만 제거, 다른 능력 유지"

## 16.7 Hyperparameters (paper Appendix B)

| 항목 | SAE Training | Circuit Discovery |
|------|-------------|-------------------|
| Optimizer | Adam | - |
| Learning rate | 1e-3 | - |
| Batch size | 4096 (tokens) | 256 (sequences) |
| Training tokens | 100M-300M | 5K-10K examples |
| Threshold τ | - | 0.01 (default), sweep 1e-4 ~ 1e-1 |
| Hardware | 1× A100 | 1× A100 |
| Time | 24h per SAE | 5min per circuit |

## 16.8 Reproduction Cost

| 항목 | 시간 | 자원 | 비용 (AWS A100 $4/h) |
|------|----:|-----|--------------------:|
| Pythia-70M 6× SAE training | 144h | 1× A100 | $576 |
| Pythia-2.8B 32× SAE training | 768h | 1× A100 | $3,072 |
| Circuit discovery (IOI, SV, Bias) | 1h | 1× A100 | $4 |
| **Total (full reproduction)** | **~38 days** | **1× A100** | **~$3,650** |

→ Pythia-70M 만이라면 *학교 cluster* 로 1주일 안에 가능 ($600). Pythia-2.8B 까지는 *연구소* 수준 (>$3K).

## 16.9 Ablation Study (paper §6)

| 변경 | Result | 해석 |
|------|--------|------|
| Baseline (τ=0.01) | Circuit ~50 features, F=0.95 | ★ standard |
| τ=0.001 (low) | Circuit ~200, F=0.99, M=0.62 | over-include, not minimal |
| τ=0.1 (high) | Circuit ~10, F=0.71 | under-include, not faithful |
| `d_sae`=8K (small) | F=0.78 | SAE capacity 부족 |
| `d_sae`=131K (large) | F=0.96 (≈ same) | diminishing return |
| L1 λ=0 | dense (no monosemanticity) | sparsity loss 필수 |
| L1 λ=1e-2 | recon failure | over-regularize |

**결정적 발견**:
- **Threshold τ**: 0.01 이 *Goldilocks zone*
- **SAE expansion**: 16-64× 가 sweet spot
- **L1 coefficient**: 1e-3 표준

## 16.10 후속 paper 의 후속 결과

### Templeton et al. 2024 (Anthropic Scaling Monosemanticity)

```
Marks 2024 의 SFC 의 *production model 확장*:
  - Claude Sonnet-class model 의 SAE training
  - ~1M features 식별
  - Feature steering, bias removal, refusal control
  
→ SFC 의 academic toy → Anthropic production 의 reality bridge
```

### Lieberum et al. 2024 (Gemma Scope)

```
DeepMind 의 Gemma-2B / 9B / 27B 의 *open-source SAE library*:
  - All layers × multiple resolutions
  - Hugging Face 에서 직접 사용
  - SFC pipeline 의 *community democratization*
```

## 16.11 자기점검 (이 챕터)

### 핵심 3 가지

1. **SAE expansion ratio (64×) 의 *justification*?**
2. **IOI circuit 의 *F=0.95* 가 *practical interpretability* 에 의미하는 바?**
3. **Bias 44.5% 감소 + perplexity Δ < 1.5% 의 *trade-off 의미*?**

### 답준

1. **Superposition resolution**. Anthropic 의 *toy model superposition* (2022) 가 시사: N neurons 가 *N 이상의 features 표현* 가능 (superposition). SAE 의 64× expansion = "1 raw neuron 의 64 latent features 풀어내기" — *upper bound* 가 아닌 *empirically sufficient* 수치. Marks 2024: 64× 가 *monosemanticity-recon balance*. > 64× → diminishing return.

2. **"Circuit 만으로 task 의 95% 행위 재현"**. F=0.95 = "ablate non-circuit 시 task accuracy 의 5% 만 잃음". 즉 *5% 의 외부 영향* 은 있지만 *95% 는 circuit 으로 충분*. **Practical implication**: bug fix / behavior modification 시 *50 features 만 건드리면 95% 효과* — *interpretability + intervention 의 efficiency*.

3. **Selective causal isolation 의 success**. 44.5% bias 감소 + perplexity 1.5% 만 증가 = "*gender circuit 이 task-specific* — *generic LM capability 와 cleanly disentangled*". 만약 *entangled* 면: bias 제거 시 perplexity 도 동반 상승 (>10%). 1.5% 만 = "feature-level monosemanticity 가 *concept disentanglement* 의 *causal substrate* 임을 empirical 입증" — *editable AI* 의 foundational result.
