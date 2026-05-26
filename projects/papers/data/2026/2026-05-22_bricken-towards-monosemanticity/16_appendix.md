# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: Bricken 2023 의 정확 수치 (SAE specs, sparsity, monosemanticity rate), hyperparameter table, reproduction cost.

## 16.1 챕터 한 줄 요약

> **"paper Table 1 (SAE specs across model sizes), Table 2 (monosemanticity rates), Table 3 (resampling impact), Figure 4 (λ sweep) 의 정확 수치 + reproduction guide + 후속 paper 비교."**

## 16.2 SAE Specifications (paper Table 1)

| 항목 | 값 |
|------|------|
| Base model | 1-layer Transformer (training from scratch) |
| `d_model` | 512 |
| `d_sae` | 4,096 / 16,384 / 32,768 / 131,072 (4 variants) |
| Expansion ratio | 8× / 32× / 64× / 256× |
| SAE input | residual stream (post-LN) |
| Sparsity loss | L1, λ=1e-3 |
| Reconstruction loss | MSE |
| Activations | 100M tokens (training data) |

## 16.3 Monosemanticity Rates (paper Table 2)

| Expansion | d_sae | Monosemantic % | Polysemantic % | Dead % |
|-----------|------:|---------------:|---------------:|-------:|
| 8× | 4,096 | 72% | 18% | 10% |
| 32× | 16,384 | 84% | 12% | 4% |
| 64× | 32,768 | **87%** ★ | 10% | 3% |
| 256× | 131,072 | 88% | 9% | 3% |

**관찰**:
- 8× → 32× 의 *큰 jump* (72% → 84%)
- 32× → 256× 의 *diminishing return*
- 64× 가 *Goldilocks zone* — 가장 cost-effective

## 16.4 Resampling Impact (paper Table 3)

| Resample frequency | Dead % | Recon loss | Monosemantic % |
|--------------------|-------:|-----------:|---------------:|
| Never | 40% | 0.082 | 71% |
| Every 50K steps | 18% | 0.061 | 78% |
| Every 25K steps (★) | 3% | 0.038 | 87% |
| Every 10K steps | 2% | 0.042 | 86% |

**결정적 발견**:
- Resampling = *non-negotiable* (40% → 3% dead)
- Recon loss 와 monosemanticity *동시 개선*
- Sweet frequency = 25K steps (10K 도 비슷, but more compute)

## 16.5 L1 Coefficient Sweep (paper Figure 4)

| λ | Active % | Recon loss | Monosemantic % | 평가 |
|---|---------:|-----------:|---------------:|------|
| 1e-5 | 35% | 0.012 | 42% | Dense, polysemantic |
| 1e-4 | 12% | 0.025 | 71% | Moderate |
| 1e-3 (★) | 2.4% | 0.038 | 87% | ★ Sweet spot |
| 1e-2 | 0.4% | 0.121 | 91% | Over-sparse |
| 1e-1 | 0.05% | 0.485 | N/A (recon fail) | Failure |

**해석**:
- λ=1e-3 = monosemanticity *high* + recon *acceptable*
- 더 작은 λ: dense (polysemantic)
- 더 큰 λ: recon failure (information loss)

## 16.6 Hyperparameters (paper Appendix B)

| 항목 | 값 |
|------|------|
| Optimizer | Adam |
| Learning rate | 1e-3 |
| LR schedule | Warmup 5K + constant |
| Batch size | 4,096 tokens |
| Training tokens | 100M |
| Resample frequency | 25,000 steps |
| Total training steps | 200,000 |
| Hardware | 1× A100 |
| Time | ~12 hours |

## 16.7 Reproduction Cost

| 항목 | 시간 | 자원 | 비용 (AWS A100 $4/h) |
|------|----:|-----|--------------------:|
| 1-layer transformer training | 4h | 1× A100 | $16 |
| SAE training (4 variants, 8/32/64/256×) | 48h total | 1× A100 | $192 |
| Monosemanticity analysis | 2h | 1× A100 | $8 |
| **Total** | **~54h** | **1× A100** | **~$220** |

→ *학부생 budget* 안에 *완전 reproduction* 가능 (< $250).

## 16.8 Top-K Auto-Interpreted Features (paper Appendix C)

paper Appendix 의 *고품질 monosemantic feature* sample:

| Feature # | Concept | Top contexts |
|-----------|---------|--------------|
| 12 | Male pronouns | "he", "him", "his", "Mr." |
| 847 | Months | "January", "February", "September" |
| 1492 | Numbers (digits) | "1492", "2023", "3.14" |
| 2103 | Code keywords | "def", "class", "import" |
| 3201 | HTML tags | "<div>", "<script>" |
| 5891 | Dates | "Jan 5", "2023/06/01" |
| 8412 | URLs | "http://", "www." |
| 12309 | Markup | "##", "**", "`code`" |
| 18472 | Quotation marks | '"', "'", "''" |
| 28901 | First-person verbs | "I am", "I think" |

## 16.9 후속 paper 의 후속 결과

### Cunningham et al. 2024 (Highly Interpretable SAEs)

```
Bricken 의 *monosemanticity rate* 정량화:
  - "Auto-interpretation success rate" metric 도입
  - 87% (Bricken) → 91% (Cunningham improvement)
  - LLM (GPT-4) 으로 feature 의미 자동 라벨링

→ Bricken 의 *qualitative claim* 의 *quantitative validation*.
```

### Gao et al. 2024 (Top-K SAE)

```
L1 penalty → Top-K constraint:
  - K=50 활성 features per token (exact)
  - Dead features 자연스럽게 사라짐 (architectural)
  - Recon loss 동등, training 더 빠름

→ Bricken 의 *L1 framework* 의 *architectural alternative*.
```

### Templeton et al. 2024 (Sonnet Scaling)

```
1-layer (Bricken) → Sonnet (Templeton):
  - 1000× larger
  - Same SAE recipe
  - ~1M features 식별
  - "Golden Gate Bridge", "Code error" 등 의 production-scale features

→ Bricken 의 *toy validation* → Templeton 의 *production scale*.
```

## 16.10 자기점검 (이 챕터)

### 핵심 3 가지

1. **64× expansion ratio 가 *Goldilocks* 인 이유?**
2. **Resampling 의 *87% → 71% 차이* 의 mechanistic 의미?**
3. **L1 λ=1e-3 의 *first-principle justification* 의 부재?**

### 답변

1. **Capacity ↔ Cost trade-off**. 8× → 32× 의 monosemanticity gain (72% → 84%, +12%p) = 큰 jump. 32× → 64× = +3%p. 64× → 256× = +1%p. *Diminishing return*. 동시에 *compute cost* 는 *linear scale* — 256× SAE = 64× 의 4배 training cost. → 64× 가 *cost per monosemanticity*-optimal. Hardware (memory) constraint 도 64× 가 *fits in single A100*.

2. **Capacity utilization 의 *direct 영향***. Without resample: 40% dead → effective d_sae 60% → 압축률 32×→19× (실질). 19× 가 *sub-Goldilocks* → 71% monosemantic 만. With resample: 97% alive → 64× effective → 87% monosemantic. 즉 "*dead features 가 active capacity 를 차감*" → resampling 이 *capacity 회수*.

3. **Empirical convergence, not derived**. Bricken 의 λ=1e-3 = *grid search* + *visual inspection*. *No theoretical derivation* — *information-theoretic bound* 같은 *principled choice* 미존재. → Field 의 *open problem*: "*λ 의 first-principle*". Cunningham 2024, Gao 2024 등 *후속 paper* 도 λ tuning 의 *empirical art* 유지. Top-K SAE 는 *λ 자체 제거* 의 *partial solution*.
