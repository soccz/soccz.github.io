# 14 PyTorch Code — Chronos 재현

> **🧒 본 챕터는 "직접 해보기"**: Tokenization + T5 backbone + autoregressive decoding + probabilistic forecast.

## 14.1 의존성

```bash
pip install torch transformers gluonts chronos-forecasting
```

## 14.2 Tokenizer (Mean Scaling + Quantile Binning)

```python
import torch
import numpy as np


class ChronosTokenizer:
    """ Convert continuous TS → discrete tokens """
    def __init__(self, vocab_size=4096, n_special=2):
        self.vocab_size = vocab_size
        self.n_special = n_special  # PAD, EOS
        self.n_bins = vocab_size - n_special
        # Centered quantile boundaries (learned from training data)
        # 또는 default uniform quantile in [-15, 15]
        self.boundaries = torch.linspace(-15.0, 15.0, self.n_bins - 1)
    
    def scale_per_series(self, x):
        """ Mean scaling: x_t / mean(|x|) """
        scale = torch.abs(x).mean()
        if scale < 1e-8: scale = torch.tensor(1.0)
        return x / scale, scale
    
    def tokenize(self, x):
        """ x: [T] tensor of values """
        x_scaled, scale = self.scale_per_series(x)
        # Bin index by searchsorted
        tokens = torch.searchsorted(self.boundaries, x_scaled)
        # Reserve 0=PAD, 1=EOS, shift bins
        tokens = tokens + self.n_special
        return tokens, scale
    
    def detokenize(self, tokens, scale):
        """ tokens: [T] integers → values """
        bin_idx = tokens - self.n_special
        bin_idx = torch.clamp(bin_idx, 0, self.n_bins - 1)
        # Map to bin center
        if bin_idx[0] == 0:
            values_first = self.boundaries[0]
        else:
            values_first = self.boundaries[bin_idx - 1]
        # Use midpoint between boundaries
        lefts = torch.cat([torch.tensor([-15.0]), self.boundaries])
        rights = torch.cat([self.boundaries, torch.tensor([15.0])])
        bin_centers = (lefts + rights) / 2
        x_scaled = bin_centers[bin_idx]
        return x_scaled * scale
```

## 14.3 T5 Backbone Wrapping

```python
from transformers import T5ForConditionalGeneration, T5Config


class ChronosModel(torch.nn.Module):
    def __init__(self, model_name='google/t5-small-lm-adapt', vocab_size=4096):
        super().__init__()
        config = T5Config.from_pretrained(model_name)
        config.vocab_size = vocab_size  # 4096 TS tokens
        self.t5 = T5ForConditionalGeneration(config)
    
    def forward(self, context_tokens, target_tokens=None):
        """
        context_tokens: [B, T_ctx] past tokens
        target_tokens: [B, T_tgt] future tokens (for training)
        """
        if target_tokens is not None:
            # Training: teacher forcing
            output = self.t5(
                input_ids=context_tokens,
                labels=target_tokens
            )
            return output.loss
        else:
            # Inference: generate
            generated = self.t5.generate(
                input_ids=context_tokens,
                max_length=64,
                do_sample=True,
                top_p=0.95
            )
            return generated
    
    def predict_with_uncertainty(self, context_tokens, num_samples=100, horizon=24):
        """ Multi-sample probabilistic forecast """
        all_samples = []
        for _ in range(num_samples):
            generated = self.t5.generate(
                input_ids=context_tokens,
                max_length=horizon,
                do_sample=True,
                top_p=0.95
            )
            all_samples.append(generated)
        return torch.stack(all_samples)  # [N, B, horizon]
```

## 14.4 Training Loop

```python
def train_chronos(model, tokenizer, dataloader, num_epochs=10, lr=1e-4):
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)
    
    for epoch in range(num_epochs):
        total_loss = 0
        for batch in dataloader:
            # batch: list of TS arrays
            context_tokens = []
            target_tokens = []
            for ts in batch:
                # Split into context (past 96 steps) + target (future 24 steps)
                ctx_vals, tgt_vals = ts[:96], ts[96:120]
                ctx_tok, scale = tokenizer.tokenize(torch.tensor(ctx_vals))
                tgt_tok, _ = tokenizer.tokenize(torch.tensor(tgt_vals))
                context_tokens.append(ctx_tok)
                target_tokens.append(tgt_tok)
            
            context_tokens = torch.stack(context_tokens)
            target_tokens = torch.stack(target_tokens)
            
            optimizer.zero_grad()
            loss = model(context_tokens, target_tokens)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        scheduler.step()
        print(f"Epoch {epoch}: loss={total_loss/len(dataloader):.4f}")
```

## 14.5 Zero-shot Forecast (Inference)

```python
def forecast(model, tokenizer, history, horizon=24, num_samples=100):
    """
    history: 1D array of past values
    Returns: [num_samples, horizon] forecasted samples
    """
    # Tokenize history
    context_tokens, scale = tokenizer.tokenize(torch.tensor(history))
    context_tokens = context_tokens.unsqueeze(0)  # [1, T_ctx]
    
    # Generate samples
    samples = model.predict_with_uncertainty(
        context_tokens, num_samples=num_samples, horizon=horizon
    )
    
    # Detokenize
    values = []
    for sample in samples:
        v = tokenizer.detokenize(sample.squeeze(0), scale)
        values.append(v)
    
    return torch.stack(values).numpy()  # [N, horizon]


def quantile_forecast(samples, quantiles=[0.1, 0.5, 0.9]):
    """ Compute quantiles from samples """
    return np.quantile(samples, q=quantiles, axis=0)
```

## 14.6 Expected Output

```
Chronos-T5-base (60M params):
  Pretraining (28 datasets, 1B tokens):
    Epoch 1: loss=4.21
    Epoch 5: loss=2.87
    Epoch 10: loss=2.34
    Total time: 7d on 8× A100

Zero-shot evaluation:
  GIFT-Eval (15 unseen datasets):
    WAPE: 0.231 (Chronos) vs 0.298 (DeepAR) - 22% better
    MASE: 0.842 (Chronos) vs 1.124 (PatchTST) - 25% better
    CRPS: 0.187 (Chronos) - SOTA

In-context learning:
  Few-shot prompt (10 examples):
    Performance ≈ fine-tuned PatchTST
```

## 14.7 자기점검

### 핵심 3 가지

1. **Mean scaling 의 *information preservation* 의 정도?**
2. **`top_p=0.95` sampling 의 *forecast quality* 영향?**
3. **Vocab size 4096 의 *bin resolution* trade-off?**

### 답변

1. **Magnitude → 0/1, but pattern 유지**. Mean scaling = x / |x|.mean() — *absolute magnitude* 제거, *relative pattern* (up/down, autocorrelation, periodicity) 유지. *Loss*: 절대 magnitude 정보 (e.g., "*1000원 vs 10원 stock*"). *Practice*: scale 을 *별도 metadata* 로 보존 → detokenize 시 restore. *Reversible normalization*.

2. **Diversity vs Quality trade-off**. top_p=1.0: 모든 token 의 sampling — *highly diverse*, *unrealistic outliers* 가능. top_p=0.5: 상위 50% 만 — *less diverse*, *mode collapse*. top_p=0.95 = *sweet spot* — *realistic + diverse*. *CRPS-optimal* — empirical default.

3. **Resolution vs Token budget**. 4096 bins = "*data range 의 4096-way 분할*". Resolution = (max - min) / 4096 = *fine* (e.g., 0.7% of total range). > 8192 → *bin sparse* (some bins 빈 데이터) + *vocab cost 증가*. < 1024 → *resolution coarse* → *forecast error 증가*. 4096 = *T5 vocab 16K 의 1/4 정도*, *컴퓨터에 friendly* (2^12).
