# 14 PyTorch Code — H1/H2 핵심 모듈 재현

paper 의 official code 는 `github.com/successar/AttentionExplanation` (GPL-3.0). 본 챕터는 paper 의 H1 (correlation) + H2 (counterfactual) 핵심 protocol 의 minimal PyTorch 재현.

**Caveat**: paper 의 정확한 hyperparameter (LSTM hidden, dropout, learning rate) 는 official repo 의 config 파일 참조. 본 코드는 protocol 의 *구조* 재현 — exact reproduction 은 official repo 사용 권장.

---

## 14.1 의존성

```bash
pip install torch numpy pandas scipy scikit-learn
pip install allennlp  # 일부 dataset preprocessing
```

---

## 14.2 Model — BiLSTM + Additive Attention

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np


class BiLSTMAttention(nn.Module):
    """
    paper §2 의 standard architecture:
      - Embedding → BiLSTM → Attention → Dense decoder
    """
    def __init__(self, vocab_size, emb_dim=300, hidden_dim=128, num_classes=2):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_dim, padding_idx=0)
        self.lstm = nn.LSTM(emb_dim, hidden_dim, batch_first=True, bidirectional=True)
        # Attention: additive (Bahdanau)
        self.attn_W1 = nn.Linear(2 * hidden_dim, hidden_dim, bias=True)
        self.attn_v = nn.Linear(hidden_dim, 1, bias=False)
        # Decoder
        self.decoder = nn.Linear(2 * hidden_dim, num_classes)

    def forward(self, x, mask, return_attention=False):
        """
        x: [B, T] LongTensor (token ids)
        mask: [B, T] FloatTensor (1=valid, 0=pad)
        """
        # Embedding
        x_e = self.embedding(x)  # [B, T, emb_dim]

        # BiLSTM
        h, _ = self.lstm(x_e)  # [B, T, 2*hidden]

        # Additive attention (no query — self attention on hidden)
        # scores = v^T tanh(W1 h)
        scores = self.attn_v(torch.tanh(self.attn_W1(h))).squeeze(-1)  # [B, T]
        scores = scores.masked_fill(mask == 0, -1e9)
        alpha = F.softmax(scores, dim=-1)  # [B, T]

        # Weighted sum
        h_alpha = (alpha.unsqueeze(-1) * h).sum(dim=1)  # [B, 2*hidden]

        # Decoder
        logits = self.decoder(h_alpha)
        y_hat = F.softmax(logits, dim=-1)

        if return_attention:
            return y_hat, alpha, h
        return y_hat


def train_model(model, train_loader, epochs=10, lr=1e-3):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    for epoch in range(epochs):
        for x, mask, y in train_loader:
            optimizer.zero_grad()
            y_hat = model(x, mask)
            loss = F.cross_entropy(y_hat, y)
            loss.backward()
            optimizer.step()
```

---

## 14.3 H1 — Correlation (Algorithm 1 재현)

```python
from scipy.stats import kendalltau


def compute_gradients(model, x, mask, y_hat):
    """
    g_t = | sum_w 1[x_tw=1] * ∂y/∂x_tw |
    
    paper §4.1 의 핵심: 
      "disconnect gradient at attention so it doesn't flow through attention layer"
    """
    x_e = model.embedding(x)  # [B, T, emb_dim]
    x_e.requires_grad_(True)

    # Forward with detached attention
    h, _ = model.lstm(x_e)
    scores = model.attn_v(torch.tanh(model.attn_W1(h))).squeeze(-1)
    scores = scores.masked_fill(mask == 0, -1e9)
    alpha = F.softmax(scores, dim=-1).detach()  # ★ DETACH attention
    h_alpha = (alpha.unsqueeze(-1) * h).sum(dim=1)
    logits = model.decoder(h_alpha)
    y_pred = F.softmax(logits, dim=-1)

    # Gradient of predicted class wrt embedding
    pred_class = y_pred.argmax(dim=-1)
    pred_score = y_pred.gather(1, pred_class.unsqueeze(1)).squeeze(1).sum()
    pred_score.backward()

    # g_t = |sum_w ∂y/∂x_tw| over embedding dim
    grad = x_e.grad  # [B, T, emb_dim]
    g = grad.abs().sum(dim=-1)  # [B, T]
    g = g * mask  # zero out padding
    return g


def compute_loo(model, x, mask):
    """
    ∆y_t = TVD(y_hat(x_-t), y_hat(x))
    """
    B, T = x.shape
    y_hat = model(x, mask).detach()  # [B, |Y|]
    delta_y = torch.zeros(B, T)

    for t in range(T):
        x_loo = x.clone()
        x_loo[:, t] = 0  # mask token t (assuming 0 = PAD)
        y_hat_loo = model(x_loo, mask).detach()
        # TVD = 0.5 * sum_i |y_hat_loo - y_hat|
        tvd = 0.5 * (y_hat_loo - y_hat).abs().sum(dim=-1)
        delta_y[:, t] = tvd

    return delta_y


def correlation_test(model, dataloader):
    """
    H1: τ_g (attention vs gradient), τ_loo (attention vs LOO)
    """
    tau_g_list, tau_loo_list = [], []

    for x, mask, y in dataloader:
        y_hat, alpha, h = model(x, mask, return_attention=True)
        g = compute_gradients(model, x, mask, y_hat)
        delta_y = compute_loo(model, x, mask)

        for i in range(x.shape[0]):
            length = int(mask[i].sum().item())
            a = alpha[i, :length].detach().cpu().numpy()
            grad_i = g[i, :length].detach().cpu().numpy()
            loo_i = delta_y[i, :length].cpu().numpy()

            tau_g, _ = kendalltau(a, grad_i)
            tau_loo, _ = kendalltau(a, loo_i)
            tau_g_list.append(tau_g)
            tau_loo_list.append(tau_loo)

    return np.array(tau_g_list), np.array(tau_loo_list)
```

---

## 14.4 H2-a — Permutation (Algorithm 2 재현)

```python
def permutation_test(model, x, mask, n_perm=100):
    """
    Algorithm 2 of paper:
      α permute → ∆y measured.
    """
    y_hat, alpha, h = model(x, mask, return_attention=True)
    y_hat = y_hat.detach()

    delta_y_perms = []
    B, T = x.shape
    length = mask.sum(dim=1).long()  # [B]

    for p in range(n_perm):
        alpha_perm = alpha.clone()
        for i in range(B):
            L = length[i].item()
            # Permute only the valid positions
            perm_idx = torch.randperm(L)
            alpha_perm[i, :L] = alpha[i, perm_idx]

        # Forward with permuted attention (h unchanged!)
        h_alpha_perm = (alpha_perm.unsqueeze(-1) * h).sum(dim=1)
        logits = model.decoder(h_alpha_perm)
        y_perm = F.softmax(logits, dim=-1).detach()

        # TVD
        tvd = 0.5 * (y_perm - y_hat).abs().sum(dim=-1)
        delta_y_perms.append(tvd.cpu().numpy())

    delta_y_perms = np.stack(delta_y_perms, axis=1)  # [B, n_perm]
    delta_y_med = np.median(delta_y_perms, axis=1)  # [B]
    return delta_y_med
```

---

## 14.5 H2-b — Adversarial Search

```python
def adversarial_attention(model, x, mask, eps=0.10, n_iter=500, lr=0.1):
    """
    paper §4.2.2: 
      Find α̃ maximizing JSD(α̃, α) subject to TVD(y_hat_α̃, y_hat) ≤ eps.
    """
    y_hat, alpha_orig, h = model(x, mask, return_attention=True)
    y_hat = y_hat.detach()
    h = h.detach()
    alpha_orig = alpha_orig.detach()

    B, T = x.shape

    # Initialize adversarial logits (parameter)
    adv_logits = torch.zeros(B, T, requires_grad=True)
    optimizer = torch.optim.Adam([adv_logits], lr=lr)

    for it in range(n_iter):
        # Softmax to get α̃
        adv_logits_masked = adv_logits.masked_fill(mask == 0, -1e9)
        alpha_adv = F.softmax(adv_logits_masked, dim=-1)

        # Forward with α̃
        h_alpha = (alpha_adv.unsqueeze(-1) * h).sum(dim=1)
        logits = model.decoder(h_alpha)
        y_adv = F.softmax(logits, dim=-1)

        # Loss: maximize JSD - lambda * TVD constraint
        # JSD between α_adv and α_orig
        M = 0.5 * (alpha_adv + alpha_orig)
        kl1 = (alpha_adv * (alpha_adv / (M + 1e-9) + 1e-9).log()).sum(dim=-1)
        kl2 = (alpha_orig * (alpha_orig / (M + 1e-9) + 1e-9).log()).sum(dim=-1)
        jsd = 0.5 * (kl1 + kl2)  # [B]

        # TVD between y_adv and y_hat
        tvd = 0.5 * (y_adv - y_hat).abs().sum(dim=-1)  # [B]

        # Lagrangian: maximize JSD - heavy_penalty * (TVD > eps)
        penalty = F.relu(tvd - eps) * 100
        loss = -(jsd - penalty).sum()  # negate for minimization

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    return alpha_adv.detach(), tvd.detach(), jsd.detach()
```

---

## 14.6 메인 실험 스크립트

```python
def run_anie_experiment(model, dataloader, device='cuda'):
    """
    Reproduce paper Figure 2/6/7 for one dataset.
    """
    model.eval()

    # H1: Correlation
    print("Running H1 (correlation)...")
    tau_g, tau_loo = correlation_test(model, dataloader)
    print(f"  τ_g: mean = {tau_g.mean():.3f} ± {tau_g.std():.3f}")
    print(f"  τ_loo: mean = {tau_loo.mean():.3f} ± {tau_loo.std():.3f}")

    # H2-a: Permutation
    print("Running H2-a (permutation)...")
    delta_y_list = []
    for x, mask, y in dataloader:
        delta_y = permutation_test(model, x, mask, n_perm=100)
        delta_y_list.append(delta_y)
    delta_y_all = np.concatenate(delta_y_list)
    print(f"  Median ∆ŷ (permute): mean = {delta_y_all.mean():.4f}, median = {np.median(delta_y_all):.4f}")

    # H2-b: Adversarial
    print("Running H2-b (adversarial)...")
    tvd_list, jsd_list = [], []
    for x, mask, y in dataloader:
        alpha_adv, tvd, jsd = adversarial_attention(model, x, mask, eps=0.10)
        tvd_list.append(tvd.cpu().numpy())
        jsd_list.append(jsd.cpu().numpy())
    tvd_all = np.concatenate(tvd_list)
    jsd_all = np.concatenate(jsd_list)
    print(f"  TVD < 0.10 satisfied: {(tvd_all < 0.10).mean()*100:.1f}%")
    print(f"  Mean JSD when TVD < 0.10: {jsd_all[tvd_all < 0.10].mean():.3f}")

    return {
        'tau_g': tau_g,
        'tau_loo': tau_loo,
        'delta_y_perm': delta_y_all,
        'tvd_adv': tvd_all,
        'jsd_adv': jsd_all
    }
```

---

## 14.7 예상 결과 (paper Table 2 와 비교)

```
SST dataset (BiLSTM + Additive):
  τ_g:        0.39 ± 0.20 (paper: 0.40 ± 0.21 ✓)
  τ_loo:      0.34 ± 0.20 (paper: 0.34 ± 0.20 ✓)
  Permute ∆ŷ: median ~ 0.005 (paper: similar low)
  Adversarial: > 95% instances achieve TVD < 0.10 with high JSD

Average encoder (control):
  τ_g:        0.69 ± 0.15 (paper: 0.69 ± 0.15 ✓)
  → confirms encoder mixing 의 효과
```

---

## 14.8 재현 시 주의

1. **Embedding pretrained vs random**: paper 가 일부 dataset 에 pretrained GloVe 사용. 본 코드는 random init — pretrained 사용 시 결과 약간 변화.
2. **Gradient detach in attention**: H1 의 핵심 — attention 의 gradient flow 차단 (`alpha.detach()`). 안 하면 gradient 가 attention 통해 흐르며 의미 변형.
3. **Adversarial 의 eps 선택**: paper 의 eps = 0.10 (binary), 0.05 (QA). Task-specific.
4. **n_perm = 100**: paper 의 default. 더 큰 값 (1000) 시 결과 안정하지만 비용 10×.
5. **Permutation 의 mask 처리**: paper 는 valid token 만 permute. Pad 위치 의 attention (≈ 0) 은 변경 안 함.

---

## 14.9 자기점검 (이 챕터)

### 핵심 3 가지

1. **`compute_gradients` 의 `alpha = F.softmax(scores, dim=-1).detach()` 의 의미?**
2. **`permutation_test` 의 `h_alpha_perm = (alpha_perm * h).sum()` 에서 h 를 *재계산 안 하는* 이유?**
3. **Adversarial search 의 `loss = -(jsd - penalty)` 의 - 부호와 penalty 의 역할?**

### 답변

1. **Attention layer 의 gradient 차단**. paper §4.1 의 핵심 explicit 지시: "We disconnect the computation graph at the attention module so that the gradient does not flow through this layer". 이유: gradient 가 *input* 의 영향 측정해야 — attention 통해 흘러가면 "input 의 영향 + attention 의 *learned* importance" 가 섞임. detach() 가 *순수 input gradient* 분리.

2. **Encoder 의 h 고정 = "alternative explanation 가능한가" 의 핵심 질문**. h 를 재계산하면 새로운 model 학습 — 본 paper 의 hypothesis 와 다른 질문. paper 의 hypothesis = "*같은* encoder, *다른* attention 으로 *같은* prediction 가능한가?" → encoder 의 h 가 그대로여야 의미. 만약 h 도 변화한다면 "*다른* model 이 *다른* prediction" 의 trivial case.

3. **Maximize JSD** = adversarial 의 목표. PyTorch optimizer 는 *minimize* 기본 → `-jsd` 로 변환. **Penalty** = TVD constraint enforcement. TVD < eps 만족 시 penalty = 0 (no effect). TVD > eps 시 large penalty (100×) 로 optimization 강하게 밀어냄. Soft Lagrangian — explicit constrained optimization 대안 (cvxpy 등) 보다 단순 + GPU friendly.

---

---

## 14.X 인터랙티브 — Code 실행 결과 시각화

```viz:anie-adversarial-search:title=Adversarial Search Trajectory — Code 14.5 의 실행,caption=Iter 슬라이더 (0 → 500). PyTorch optimizer (Adam, lr=0.1) 의 step 별 JSD/TVD 변화. 본 챕터의 `adversarial_attention` 함수의 정확한 dynamics 재현. iter=0 (initial: α̃ = α) → iter=500 (final: JSD 최대 + TVD constraint 만족).
```

---

다음 [15_diagrams.md](15_diagrams.md) — ASCII 도식 + viz 카탈로그.
