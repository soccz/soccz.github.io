# 15 Diagrams & Interactive Visualizations

> **🧒 한 그림이 천 마디 가치**: Chronos 의 *tokenization*, *T5 architecture*, *autoregressive forecast* 의 visual narrative.

## 15.1 챕터 한 줄 요약

> **"15+ ASCII 도식 + 3 viz 로 *value → token mapping*, *encoder-decoder data flow*, *probabilistic forecast distribution*, *zero-shot transfer* 의 visual narrative."**

## 15.2 ASCII 도식 — Tokenization Pipeline

```
CHRONOS TOKENIZATION:

  Raw TS:    142.5  143.1  141.9  144.2  ...
                │
                │ Step 1: Mean scaling
                ▼  (divide by |x|.mean())
  Scaled:    0.98   0.99   0.97   1.00   ...
                │
                │ Step 2: Quantile binning  
                ▼  (4096 bins centered around 0)
  Tokens:    2103   2105   2099   2108   ...
                │
                │ (Token vocabulary)
                ▼
   ┌─────────────────────────────────────────┐
   │ Token 0: PAD                            │
   │ Token 1: EOS                            │
   │ Token 2-2049: quantile bins for x < 0   │
   │ Token 2049-4095: quantile bins for x > 0│
   └─────────────────────────────────────────┘
```

## 15.3 ASCII 도식 — T5 Encoder-Decoder

```
CHRONOS ARCHITECTURE (T5-based):

  Context tokens [t1, t2, ..., t96]
       │
       ▼
  ┌─────────────────────┐
  │ T5 Encoder          │
  │ (12 layers, self-attn) │
  └─────┬───────────────┘
        │
        │ encoded context
        │
        ▼ cross-attention
  ┌─────────────────────┐
  │ T5 Decoder          │
  │ (12 layers, causal) │
  │                     │
  │ self-attn + cross-attn │
  └─────┬───────────────┘
        │
        ▼
  Generated tokens [t97, t98, ..., t120]
        │
        ▼ detokenize
  Forecast values: [142.8, 143.5, ..., 145.2]
```

## 15.4 ASCII 도식 — Autoregressive Decoding

```
GENERATION LOOP:

  Initial:
    decoder_input = [BOS]
    encoded_context = encoder(context_tokens)
  
  For step k = 1 to horizon:
    logits = decoder(decoder_input, encoded_context)  
    # logits: [vocab_size]
    
    Sampling:
      probs = softmax(logits / temperature)
      # top-p filter (nucleus sampling)
      sorted_p = sorted(probs, desc=True)
      cumulative_p = cumsum(sorted_p)
      mask = cumulative_p > 0.95  # threshold
      # Sample from filtered distribution
      token_k = multinomial(filtered_probs)
    
    decoder_input.append(token_k)
  
  Return: decoder_input (generated tokens)
```

## 15.5 ASCII 도식 — Probabilistic Forecast (N samples)

```
N=100 SAMPLES FOR UNCERTAINTY:

  For sample i = 1 to 100:
    sample_i = autoregressive_decode(...)
    # different due to stochastic sampling
  
  Resulting forecast paths:
    sample_1:  [142.8, 143.5, 144.1, ..., 148.2]
    sample_2:  [142.3, 144.1, 143.8, ..., 149.1]
    ...
    sample_100:[143.0, 143.2, 144.5, ..., 147.8]
  
  Quantile estimates:
    Q05:  [142.0, 143.0, 143.5, ..., 146.5]
    Q50:  [142.7, 143.6, 144.0, ..., 148.0]
    Q95:  [143.2, 144.2, 144.6, ..., 149.3]
  
  ┌──────────────────────────────────────┐
  │                                       │
  │     ╱─Q95╲                            │
  │   ╱────Q50───╲                        │
  │  ╱─────Q05────╲                       │
  │                                       │
  │  shaded area = uncertainty band       │
  └──────────────────────────────────────┘
```

## 15.6 ASCII 도식 — Pretraining Corpus Diversity

```
CHRONOS PRETRAINING CORPUS (paper Appendix):

  28+ Datasets across domains:
  ┌────────────────────────────────────┐
  │ Finance:    S&P500, FX, commodities│
  │ Energy:     load forecasting       │
  │ Traffic:    PEMS, METR-LA          │
  │ Weather:    temperature, humidity  │
  │ Retail:     M4/M5, Walmart         │
  │ Web:        Wikipedia views        │
  │ Synthetic:  Gaussian processes     │
  └────────────────────────────────────┘
        │
        │  Total: ~1B tokens
        │  Mixed-domain training
        ▼
  Generic TS pattern learning
  → Zero-shot to *unseen* datasets ✓
```

## 15.7 ASCII 도식 — Zero-shot vs Fine-tuning Comparison

```
EVALUATION (paper Table 1):

   Model              WAPE  MASE  CRPS  Setup
   ────────────────────────────────────────────
   ARIMA              0.345 1.420 0.281  classical
   DeepAR             0.298 1.286 0.245  trained
   N-BEATS            0.312 1.341 0.258  trained
   PatchTST           0.281 1.124 0.218  trained
   Chronos zero-shot  0.231 0.842 0.187  ★ no training!
   Chronos finetune   0.218 0.802 0.179  ★ minor improvement
   ────────────────────────────────────────────

  → Zero-shot Chronos > fine-tuned baselines
  → Fine-tuning provides minor gain
  → "*Foundation model paradigm validated for TS*"
```

## 15.8 ASCII 도식 — Model Size Scaling

```
CHRONOS MODEL FAMILY (paper Table 2):

   Size      Params  WAPE  Inference time
   ─────────────────────────────────────
   T5-tiny    8M     0.281  10 ms
   T5-mini   20M     0.252  15 ms  
   T5-small  60M     0.231  25 ms  ★ default
   T5-base  220M     0.218  60 ms
   T5-large 770M     0.211 150 ms
   ─────────────────────────────────────

  Power law: WAPE ∝ params^(-0.18)
  Diminishing return at T5-base+
  Default (T5-small) = cost-effective sweet spot
```

## 15.9 Viz 카탈로그

| viz id | 챕터 | 내용 | 컨트롤 |
|--------|------|------|--------|
| `chronos-tokenize` | 05b, 14, 15 | Value → token mapping | vocab size slider |
| `chronos-forecast` | 05c, 14, 15 | Probabilistic forecast visualization | sample count slider |
| `chronos-scaling` | 06, 15 | Model size scaling law | size selector |

## 15.10 자기점검

### 핵심 3 가지

1. **Quantile binning 의 *uniform binning* 대비 *information gain*?**
2. **Autoregressive sampling 의 *path coherence*?**
3. **Zero-shot이 fine-tuning과 *비등한 결과* 의 *substantive implication*?**

### 답변

1. **Density-aware resolution**. Uniform binning: [min, max] equal-width 분할 — heavy-tailed data 시 *tail bins sparse* (대부분 데이터가 중앙 bins). Quantile binning: *equal data count per bin* — *tail에 finer resolution*. 금융 (heavy tail), sensor (outliers) 같은 *non-uniform distribution* 에서 *significantly better*. Chronos default = quantile.

2. **Sequential coherence by causal attention**. Each token = *previous tokens 조건부 distribution*. Causal self-attention 이 *past consistency* 보장. → path 가 *plausible trajectory* — random walk 가 아닌 *learned pattern*. Multi-sample 시 *different but coherent* paths — *true distribution sample*.

3. **Foundation model paradigm 의 *validation***. Pre-2024: TS = "*per-task fine-tuning 필수*" 가 conventional wisdom. Chronos zero-shot = WAPE 0.231 < PatchTST fine-tuned 0.281 = "*untrained model > tuned baseline*". → *generic capability* 가 *specific tuning* 능가 가능 — NLP 의 *foundation model paradigm* 의 TS validation. *Industry implication*: 새 dataset 마다 ML pipeline 구축 불필요.

---

## 인터랙티브 시각화

```viz:chronos-tokenize:title=paper §3 — Value-to-Token Mapping,caption=Vocab size slider.
```

```viz:chronos-forecast:title=paper §4 — Probabilistic Forecast,caption=Sample count slider.
```

```viz:chronos-scaling:title=paper Table 2 — Model Scaling Law,caption=Size selector.
```
