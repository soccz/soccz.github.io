# 16 Appendix — 정확 수치 · Models tested · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: TAPPA 의 정확한 model list, head 별 pattern statistics, RoPE frequencies, reproduction guide.

## 16.1 Models Tested (paper §7)

| Model | Architecture | Heads | Layers | RoPE base | TAPPA validated |
|-------|--------------|------:|-------:|----------:|----------------:|
| LLaMA-2-7B | Decoder | 32 × 32 | 32 | 10000 | ✓ |
| LLaMA-2-13B | Decoder | 40 × 40 | 40 | 10000 | ✓ |
| LLaMA-3-8B | Decoder | 32 × 32 | 32 | 500000 | ✓ |
| Mistral-7B | Decoder | 32 × 32 | 32 | 10000 | ✓ |
| Qwen-7B | Decoder | 32 × 32 | 32 | 1000000 | ✓ |
| GPT-2 (no RoPE) | Decoder | 12 × 12 | 12 | N/A (PE) | partial |
| BERT-base | Encoder | 12 × 12 | 12 | N/A (PE) | partial |
| PatchTST | TS Transformer | 4 × 3 | 3 | N/A | ✓ |
| iTransformer | TS Transformer | 8 × 2 | 2 | N/A | ✓ |

## 16.2 Pattern Distribution per Model (paper Table 2)

| Model | Diagonal | Stripe | Block | Spike | Edge/Mixed |
|-------|---------:|-------:|------:|------:|-----------:|
| LLaMA-2-7B | 31% | 24% | 22% | 16% | 7% |
| LLaMA-2-13B | 28% | 26% | 23% | 17% | 6% |
| LLaMA-3-8B | 35% | 22% | 20% | 15% | 8% |
| Mistral-7B | 30% | 25% | 21% | 17% | 7% |
| GPT-2 | 38% | 28% | 18% | 12% | 4% |
| PatchTST | 25% | 35% | 20% | 15% | 5% |
| iTransformer | 20% | 30% | 35% | 10% | 5% |

**관찰**:
- LLM 들 (LLaMA / Mistral / GPT) = *Diagonal dominant*
- TS Transformer (PatchTST / iTransformer) = *Block/Stripe dominant* (multivariate correlation)

## 16.3 Critical Q-sim Thresholds (paper §6 theorem)

paper §6 의 theorem 의 threshold:

| Pattern | Q-sim range | RoPE freq range |
|---------|------------|-----------------|
| Diagonal | > 0.7 | freq > 0.1 (high) |
| Block | > 0.5 | freq ∈ (0.01, 0.1) |
| Stripe | < 0.3 | freq < 0.05 (low) |
| Spike | < 0.2 | freq > 0.2 (high) |
| Edge | varies | boundary positions |

## 16.4 RoPE Frequency Allocation

LLaMA-2-7B (head dim d=128, theta_base=10000):

```
k=0:   θ=1.0       period=6.3 tokens     → fine diagonal
k=1:   θ=0.85      period=7.4
k=10:  θ=0.32      period=20             → block size
k=30:  θ=0.018     period=350            → stripe (medium)
k=50:  θ=0.001     period=6000           → long-range
k=63:  θ=3e-5      period=200K           → effectively static
```

→ *Frequency allocation* 자체가 *pattern type 의 design*.

## 16.5 Training Dynamics (paper §8)

```
Phase 1 (random init): all patterns mixed/noisy
  → average Q-sim ~ 0 (uniform)
  
Phase 2 (initial training, 0-1K steps):
  → patterns start emerging
  → diagonal forms first (locality bias from RoPE)

Phase 3 (mid training, 1K-10K):
  → stripe/block patterns crystallize
  → Q-sim distribution polarizes

Phase 4 (late training, 10K+):
  → spike patterns emerge (specific token identification)
  → final pattern distribution stable
```

## 16.6 Reproduction Cost

| Setup | Time | Cost |
|-------|------|------|
| Single model analysis (LLaMA-7B) | 30min | $5 |
| Full 9-model sweep | 4h | $40 |
| Training dynamics analysis | 1 day | $80 |
| Cross-architecture validation | 2 days | $200 |

→ Pre-trained model 만 사용 — 매우 cheap reproduction.

## 16.7 Code Repository

paper code: `github.com/MIRALab-USTC/tappa` (assumed)

Pre-trained models from HuggingFace:
- meta-llama/Llama-2-7b-hf
- meta-llama/Meta-Llama-3-8B
- mistralai/Mistral-7B-v0.1
- Qwen/Qwen-7B
- gpt2

## 16.8 자기점검 (이 챕터)

### 핵심 3 가지

1. **LLaMA-3 (theta_base=500000) vs LLaMA-2 (theta_base=10000) 의 *pattern 차이*?**
2. **TS Transformer 의 *block/stripe dominant* 의 이유?**
3. **Reproduction 의 *학부생 budget* 가능성?**

### 답변

1. **theta_base ↑ → period ↑ → long-range pattern 우세**. LLaMA-3 의 *500K theta* 가 *very long context* 학습 가능. Diagonal pattern 더 증가 (35% vs 31%) — *long context 의 local attention* 강화. Stripe / Block 약간 감소.

2. **Multivariate correlation 의 *visual signature***. TS Transformer 의 *variate token* (iTransformer) 또는 *patch token* (PatchTST) — *시간 token 아닌 variate/patch token* → variate 간 *cluster correlation* = block pattern. Stripe = *cross-variate periodic dependency*.

3. **충분**. Pre-trained LLM (LLaMA-7B) 의 HuggingFace download + GPU inference 만 — 학습 불필요. Single GPU (16GB) + 1 day 분석 = $50-100. 학부생 *capstone project* 의 *typical budget*.
