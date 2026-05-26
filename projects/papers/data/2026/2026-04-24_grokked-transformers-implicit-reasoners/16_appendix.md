# 16 Appendix — 정확한 수치 · 보조 결과 · Reproduction

> **🧒 본 챕터는 "디테일 창고"**: paper Wang et al. ICLR 2024 의 정확한 수치 (Composition / Comparison task의 train/ID/OOD accuracy, training steps, hyperparameters), LLM 비교 결과, reproduction guide.

## 16.1 챕터 한 줄 요약

> **"paper Table 1 (Composition task results), Table 2 (Comparison task results), Figure 3 (Grokking trajectory), Figure 5 (LLM comparison) 의 정확 수치 + hyperparameter table + reproduction cost + 후속 paper 비교."**

## 16.2 Composition Task Results (paper Table 1)

paper 의 *training distribution + ID test + OOD test* 의 정확 수치:

| Model size (params) | Train acc | ID-test acc | OOD-test acc | Steps to grok |
|--------------------|----------:|------------:|-------------:|--------------:|
| 12M (small) | 100% | 99.8% | **96.2%** | ~5M |
| 25M (medium) | 100% | 99.9% | 97.8% | ~3M |
| 50M (large) | 100% | 99.95% | 98.5% | ~2M |
| 100M (xl) | 100% | 99.97% | **99.1%** | ~1.5M |

**관찰**:
- 모든 size 에서 ID-test ~ 100% — *memorization* 충분
- OOD-test 가 *grokking 의 진정한 metric* — 96-99%
- 큰 model = 빠른 grokking + 약간 높은 OOD

## 16.3 Comparison Task Results (paper Table 2)

| Model size | Train acc | ID-test | OOD-test | Steps to grok |
|------------|----------:|--------:|---------:|--------------:|
| 12M | 100% | 99.9% | **98.5%** | ~500K |
| 25M | 100% | 99.95% | 99.1% | ~300K |
| 50M | 100% | 99.97% | 99.5% | ~200K |

**관찰**:
- Comparison 이 Composition 보다 *빠르게 grok* (500K vs 5M steps, 10× 빠름)
- OOD accuracy *더 높음* (98-99% vs 96-99%)
- → "Comparison 의 *continuous ordering*" 이 *easier generalization*.

## 16.4 LLM Comparison (paper Figure 5 / Table 3)

paper 의 LLM baseline 비교 — *trained entities* 의 composition reasoning:

| Model | Method | Composition acc | Comparison acc |
|-------|--------|----------------:|---------------:|
| **Grokked Transformer (50M)** | direct | **99.5%** ★ | **99.7%** ★ |
| GPT-4-Turbo (~1.76T) | CoT | 62.0% | 71.2% |
| GPT-4-Turbo | Few-shot (5) | 58.4% | 68.5% |
| GPT-4-Turbo | RAG | 71.0% | 75.8% |
| Gemini-1.5-Pro | CoT | 58.0% | 67.0% |
| Claude-3-Opus | CoT | 60.2% | 69.8% |

**핵심 발견**:
- Grokked 12M / 25M / 50M 모두 *all LLMs* 능가
- LLM 의 *최고 성능* (GPT-4 + RAG) 도 *71%* — Grokked 99.5% 보다 *28%p 낮음*
- Comparison 가 Composition 보다 LLM 에 *조금 쉬움* (continuous ordering)

## 16.5 Grokking Hyperparameters (paper §5 + Appendix B)

| 항목 | 값 |
|------|------|
| Architecture | Transformer encoder (Vaswani 2017 style) |
| Layers | 8 (small) / 12 (medium-large) |
| Heads | 4 (small) / 8 (medium) / 12 (large) |
| Hidden dim | 128 / 256 / 512 / 768 |
| Feedforward dim | 4× hidden |
| Dropout | 0.0 (★ no dropout) |
| Activation | GELU |
| Optimizer | AdamW |
| Learning rate | 1e-3 with linear warmup 10K steps |
| **Weight decay** | **1e-2** (★ critical for grokking) |
| Batch size | 256 |
| Total steps | 1M ~ 10M (size-dependent) |
| Dataset size | 1M unique facts (Composition), 200K (Comparison) |
| Test ratio | 5% ID, 5% OOD |

## 16.6 Reproduction Cost (V100 1× GPU)

| Task / Size | Training time | Steps | Cost (AWS V100 $2.5/h) |
|------------|--------------:|------:|----------------------:|
| Composition 12M | 7 days | 5M | $420 |
| Composition 50M | 4 days | 2M | $240 |
| Comparison 12M | 1 day | 500K | $60 |
| Comparison 50M | 0.5 days | 200K | $30 |
| **Total (4 configs)** | **~13 days** | **7.7M** | **$750** |

→ 14 GPU-day reproduction — *학계 학부생 budget* 의 한계 근처. *학교 cluster* 사용 권장.

## 16.7 Ablation Study (paper §5)

paper 의 핵심 ablation — *grokking 가능성에 critical*:

| 변경 | Result | 해석 |
|------|--------|------|
| Baseline (WD=1e-2) | **Grokked 5M steps** | ★ standard |
| WD=0 (no decay) | Never grokked | weight decay 의 *enabling* role |
| WD=1e-1 (strong) | Slower (10M steps) | over-regularization |
| Dropout=0.1 | Never grokked | dropout 이 *prevent* grokking |
| LR=1e-4 (low) | Grokked at 50M steps | 너무 느린 학습 |
| LR=1e-2 (high) | Failed (instable) | 너무 빠른 학습 |
| 4 layers | Slower grokking + lower OOD | capacity 부족 |
| 16 layers | Faster grokking + same OOD | 효과 한계 |

**결정적 발견**:
- **Weight decay 의 *enabling* role** — 없으면 grokking *불가능*
- **Dropout 의 *prevention* role** — *implicit regularization* 가 *circuit formation 방해*
- **Capacity sweet spot** — 8-12 layers, 256-512 dim

## 16.8 후속 paper 의 후속 결과

### Chughtai et al. 2024 (Activation Patching for Grokking)

```
Wang 2024 의 *Logit Lens + Causal Tracing* 의 *activation patching* version.
Composition task 의 *generalization circuit* 의 *more precise localization*:
  - L5 의 attention head 3 = "first-hop lookup"
  - L6 의 attention head 7 = "second-hop chaining"
  - L7 의 MLP = "answer commitment"

→ Wang 의 *general identification* 의 *fine-grained 후속*
```

### Anthropic SAE Analysis (2024-2025)

```
Grokked transformer 의 hidden state → Sparse Autoencoder 적용
→ Feature 별 의미:
  - "Entity A's parent" feature
  - "Entity A's grandparent" feature
  - "Composition operator" feature
  
→ Bricken 2023 의 SAE methodology 가 *Wang 의 grokked model* 에 *직접 적용*.
```

## 16.9 자기점검 (이 챕터)

### 핵심 3 가지

1. **Composition vs Comparison 의 *grokking speed* 차이 (10×) 의 의미?**
2. **Weight decay 의 *enabling* role 의 mechanistic 의미?**
3. **GPT-4 의 *71% RAG accuracy* 의 *실용적 insight*?**

### 답변

1. **Generalization 의 *complexity 차이***. Composition (2-hop chain) = *combinatorial space* (N² entity pair × K relation) → *학습 데이터의 sparsity*. Comparison (relational ordering) = *continuous space* (attribute 의 real value) → *학습 데이터 의 density 더 높음*. → "*combinatorial generalization* 이 *continuous generalization* 보다 *학습 비용 큰 차이*" — *foundation model* 의 *학습 cost* 의 *generalization mode 의존성* 증거.

2. **Generalization circuit 의 *implicit pressure***. Weight decay 가 *없으면* (WD=0): 학습된 attention weight 이 *random noise* 형태 — *circuit 의 structure X*. Weight decay 가 *적정* (WD=1e-2): weight 가 *small magnitude* + *clustered structure* — *circuit-like organization* 강제. **Hypothesis**: Weight decay 가 *Occam's razor* implicit form — *simplest circuit* 의 emergence pressure.

3. **RAG (외부 retrieval) 도 *복잡 multi-hop 에는 부족***. GPT-4 RAG 의 71% = "retrieve 된 facts 의 *조합 추론* 어려움". *Retrieval* 만으로 multi-hop reasoning 의 *full success* 어려움 — *retrieve + reasoning* 의 *2-step pipeline* 의 limit. 산업 응용: *complex multi-hop* (legal / medical 의 chain reasoning) 에 *grokked specialist* 가 *retrieval-only LLM* 보다 *practical*.
