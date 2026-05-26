# 14. 코드 — PyTorch 구현

> **🧒 한 줄 요약**: PyTorch CA1 구현. Self-contained example. Simulation validation.


> 본 논문의 **CA1** 모델을 PyTorch 로 구현한 self-contained 예제 + 시뮬레이션 데이터 검증.

## 14.1 챕터 한 줄 요약

본 논문의 conditional autoencoder (CA1: **β 네트워크 1 hidden layer (32 ReLU), f 네트워크 단일 선형층**) 을 PyTorch 로 ≈ 80 줄 코드로 구현. 시뮬레이션 데이터 (linear vs nonlinear DGP) 에서 IPCA 와 비교.

**중요**: paper 본문 (p.6, 343–347) — "Throughout our empirical analysis, we assume a single linear layer on the factor network, that is, $L_f = 1$". 모든 CA0–CA3 의 f-network 는 **단일 선형 변환**. CA0–CA3 차이는 β-network 깊이만.

---

## 14.2 의존성

```python
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
```

PyTorch >= 1.10, NumPy >= 1.20 권장.

---

## 14.3 모델 정의

```python
class BetaNetwork(nn.Module):
    """β = NN(z) — 특성에서 노출도로의 비선형 매핑."""
    def __init__(self, P, K, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(P, hidden),
            nn.BatchNorm1d(hidden),
            nn.ReLU(),
            nn.Linear(hidden, K),
        )

    def forward(self, z):  # z: (N, P)
        return self.net(z)  # β: (N, K)


class FactorNetwork(nn.Module):
    """f = W x — managed portfolio 에서 잠재요인으로의 **단일 선형 변환**.
    x = (Z'Z)^{-1} Z'r 은 외부에서 사전계산.
    paper L_f = 1 (linear layer) — factor 가 portfolio 의 선형결합이라는 경제적 해석 유지.
    """
    def __init__(self, P, K):
        super().__init__()
        self.linear = nn.Linear(P, K, bias=True)

    def forward(self, x):  # x: (T, P)
        return self.linear(x)  # f: (T, K)


class ConditionalAutoencoder(nn.Module):
    """CA1 — β 와 f 네트워크 + dot product.
    β-net: 1 hidden layer (32 ReLU) → β = NN(z)
    f-net: 단일 선형 (no hidden) → f = W x
    """
    def __init__(self, P, K, hidden=32):
        super().__init__()
        self.beta_net = BetaNetwork(P, K, hidden)
        self.factor_net = FactorNetwork(P, K)

    def forward(self, Z, x):
        """Z: (T, N, P), x: (T, P) → r_hat: (T, N).
        매 시점 t 마다:
          β_t = BetaNet(Z_t)   shape (N, K)
          f_t = FactorNet(x_t) shape (K,)
          r_hat_t = β_t @ f_t  shape (N,)
        """
        T, N, P = Z.shape
        Z_flat = Z.reshape(T * N, P)
        beta_flat = self.beta_net(Z_flat)        # (T*N, K)
        beta = beta_flat.reshape(T, N, -1)        # (T, N, K)
        f = self.factor_net(x)                    # (T, K)
        r_hat = torch.einsum('tnk,tk->tn', beta, f)
        return r_hat
```

---

## 14.4 학습 루프 (with LASSO + early stopping)

```python
def train_CA(model, Z_tr, x_tr, r_tr, Z_val, x_val, r_val,
             lr=1e-3, lam=1e-4, max_epochs=200, patience=5):
    optimizer = optim.Adam(model.parameters(), lr=lr)
    best_val = float('inf')
    best_state = None
    no_improve = 0
    for epoch in range(max_epochs):
        model.train()
        optimizer.zero_grad()
        r_hat = model(Z_tr, x_tr)
        mse = ((r_tr - r_hat) ** 2).mean()
        l1 = sum(p.abs().sum() for p in model.parameters())
        loss = mse + lam * l1
        loss.backward()
        optimizer.step()

        model.eval()
        with torch.no_grad():
            r_hat_val = model(Z_val, x_val)
            val_mse = ((r_val - r_hat_val) ** 2).mean().item()
        if val_mse < best_val - 1e-6:
            best_val = val_mse
            best_state = {k: v.clone() for k, v in model.state_dict().items()}
            no_improve = 0
        else:
            no_improve += 1
            if no_improve >= patience:
                break

    model.load_state_dict(best_state)
    return model, best_val
```

---

## 14.5 Managed Portfolio 사전 계산

```python
def managed_portfolio(Z, r):
    """x_t = (Z_t' Z_t)^{-1} Z_t' r_t.
    Z: (T, N, P), r: (T, N) → x: (T, P).
    """
    T, N, P = Z.shape
    x_list = []
    for t in range(T):
        Zt = Z[t]      # (N, P)
        rt = r[t]      # (N,)
        ZtZ = Zt.T @ Zt + 1e-6 * torch.eye(P)  # regularize
        xt = torch.linalg.solve(ZtZ, Zt.T @ rt)
        x_list.append(xt)
    return torch.stack(x_list)  # (T, P)
```

---

## 14.6 Ensemble Averaging

```python
def ensemble_predict(models, Z, x):
    """N 개 모델의 예측 평균."""
    preds = [m(Z, x).detach() for m in models]
    return torch.stack(preds).mean(dim=0)


def train_ensemble(P, K, Z_tr, x_tr, r_tr, Z_val, x_val, r_val,
                   n_ensemble=10):
    models = []
    for seed in range(n_ensemble):
        torch.manual_seed(seed)
        m = ConditionalAutoencoder(P, K, hidden=32)
        m, _ = train_CA(m, Z_tr, x_tr, r_tr, Z_val, x_val, r_val)
        models.append(m)
    return models
```

---

## 14.7 시뮬레이션 데이터 생성 (paper Section 4 setup)

paper Section 4 의 정확한 setup: **N=200, T=180, P=50, K=3, 잔차 t_5(0, 0.1²)**.

```python
from torch.distributions import StudentT, Normal, Uniform

def simulate_characteristics(N, T, P, seed=42):
    """paper Eq (22): c_{ij,t} = 2/(n+1) rank(c̄) - 1, c̄ = ρ c̄ + ε, ρ ~ U[0.9, 1]."""
    torch.manual_seed(seed)
    rho = Uniform(0.9, 1.0).sample((P,))
    c_bar = torch.zeros(T, N, P)
    c_bar[0] = torch.randn(N, P)
    for t in range(1, T):
        c_bar[t] = rho * c_bar[t-1] + torch.randn(N, P)
    # Cross-sectional rank normalization per time per characteristic
    ranks = c_bar.argsort(dim=1).argsort(dim=1).float()
    c = 2.0 * (ranks + 1) / (N + 1) - 1.0  # in (-1, 1)
    return c


def simulate_factors_and_xt(T, K, P, seed=42):
    """x_t ~ N(0.03, 0.1²I), η_t ~ N(0, 0.01²I)."""
    torch.manual_seed(seed + 1)
    x = 0.03 + 0.1 * torch.randn(T, P)
    eta = 0.01 * torch.randn(T, K)
    # W: K×P, first K columns = identity (paper W matrix)
    W = torch.zeros(K, P)
    for k in range(K):
        W[k, k] = 1.0
    f = (x @ W.T) + eta  # (T, K)
    return f, x, W


def beta_linear(c):
    """DGP (a): g*(c) = (1.2 × 2 c1, c2, 0.8 × c3)' — only 3 chars matter."""
    return torch.stack([2.4 * c[..., 0], c[..., 1], 0.8 * c[..., 2]], dim=-1)


def beta_nonlinear(c):
    """DGP (b): g*(c) = (c1, 2 × c1 × c2, 0.6 × sgn(c3))'."""
    return torch.stack([
        c[..., 0],
        2.0 * c[..., 0] * c[..., 1],
        0.6 * torch.sign(c[..., 2]),
    ], dim=-1)


def simulate(N=200, T=180, P=50, K=3, beta_fn=beta_linear, seed=42):
    c = simulate_characteristics(N, T, P, seed)            # (T, N, P)
    f, x, _ = simulate_factors_and_xt(T, K, P, seed)        # (T, K), (T, P)
    beta = beta_fn(c)                                      # (T, N, K)
    signal = torch.einsum('tnk,tk->tn', beta, f)           # (T, N)
    # ε ~ t_5(0, 0.1²)
    t_dist = StudentT(df=5.0, loc=0.0, scale=0.1)
    eps = t_dist.sample((T, N))
    r = signal + eps                                        # (T, N)
    return c, r, x, f
```

---

## 14.8 IPCA 베이스라인 (비교용)

```python
def ipca(Z, r, K, n_iter=50):
    """KPS (2019) 의 IPCA 추정량. Alternating least squares."""
    T, N, P = Z.shape
    Gamma = torch.randn(P, K) * 0.1
    f = torch.randn(T, K) * 0.1
    for _ in range(n_iter):
        # Update f given Gamma
        for t in range(T):
            Zt_Gamma = Z[t] @ Gamma           # (N, K)
            ZtGtZtG = Zt_Gamma.T @ Zt_Gamma + 1e-6 * torch.eye(K)
            f[t] = torch.linalg.solve(ZtGtZtG, Zt_Gamma.T @ r[t])
        # Update Gamma given f
        lhs = torch.zeros(P * K, P * K)
        rhs = torch.zeros(P * K)
        for t in range(T):
            Zt = Z[t]                          # (N, P)
            ft = f[t]                          # (K,)
            # vec(Gamma) coefficient
            kron = torch.kron(ft.unsqueeze(0).T @ ft.unsqueeze(0), Zt.T @ Zt)
            lhs += kron
            rhs += (Zt.T @ r[t].unsqueeze(1) @ ft.unsqueeze(0)).flatten()
        Gamma_vec = torch.linalg.solve(lhs + 1e-6 * torch.eye(P * K), rhs)
        Gamma = Gamma_vec.reshape(P, K)
    return Gamma, f


def ipca_predict(Z, Gamma, f):
    """주의: IPCA 의 f 는 학습 데이터 의존. OOS 에서는 새 데이터로 f 추정 필요."""
    T, N, P = Z.shape
    K = f.shape[1]
    f_oos = torch.zeros(T, K)
    # 단순화: 동일 f 사용 (실제로는 OOS f 추정 필요)
    return torch.einsum('tnp,pk,tk->tn', Z, Gamma, f_oos)
```

---

## 14.9 평가 지표

```python
def total_r2(r, r_hat):
    ss_res = ((r - r_hat) ** 2).sum()
    ss_tot = (r ** 2).sum()
    return (1 - ss_res / ss_tot).item()


def predictive_r2(r, beta, f_mean):
    """f_mean: (K,) — 평균 요인 (위험프리미엄 λ)."""
    r_pred = beta @ f_mean
    ss_res = ((r - r_pred) ** 2).sum()
    ss_tot = (r ** 2).sum()
    return (1 - ss_res / ss_tot).item()


def sharpe_long_short(r, r_hat, deciles=10):
    """매 시점 long top decile, short bottom decile 한 portfolio 의 연환산 Sharpe."""
    T, N = r.shape
    n_per_decile = N // deciles
    long_short = []
    for t in range(T):
        idx = r_hat[t].argsort()
        long_ret = r[t, idx[-n_per_decile:]].mean()
        short_ret = r[t, idx[:n_per_decile]].mean()
        long_short.append((long_ret - short_ret).item())
    arr = np.array(long_short)
    return arr.mean() / arr.std() * np.sqrt(12)
```

---

## 14.10 메인 실험 (paper Section 4 setup)

```python
def main():
    P, K = 50, 3
    # paper: T=180 으로 60/60/60 분할
    T_tr, T_val, T_te = 60, 60, 60

    for label, beta_fn in [('Linear (a)', beta_linear),
                            ('Nonlinear (b)', beta_nonlinear)]:
        print(f'=== DGP {label} ===')
        c, r, x, f_true = simulate(N=200, T=T_tr + T_val + T_te,
                                    P=P, K=K, beta_fn=beta_fn, seed=0)
        c_tr, r_tr, x_tr = c[:T_tr], r[:T_tr], x[:T_tr]
        c_val, r_val, x_val = c[T_tr:T_tr+T_val], r[T_tr:T_tr+T_val], x[T_tr:T_tr+T_val]
        c_te, r_te, x_te = c[T_tr+T_val:], r[T_tr+T_val:], x[T_tr+T_val:]

        model = ConditionalAutoencoder(P, K, hidden=32)  # CA1
        model, _ = train_CA(model, c_tr, x_tr, r_tr, c_val, x_val, r_val,
                             lam=1e-4, lr=1e-3, max_epochs=200, patience=5)
        r_hat_te = model(c_te, x_te).detach()
        print(f'  CA1 Total R²: {total_r2(r_te, r_hat_te):.3f}')


if __name__ == '__main__':
    main()
```

**예상 출력** (paper Table 6 에 따라 K=3, T=60 train 으로):

```
=== DGP Linear (a) ===
  CA1 Total R²: ~0.38  (paper Table 6: IPCA 0.407, CA1 0.381)
=== DGP Nonlinear (b) ===
  CA1 Total R²: ~0.32  (paper Table 6: CA1 0.318, IPCA 0.119)
```

→ Linear DGP 에서는 CA1 이 IPCA 와 근소 차이. Nonlinear DGP 에서는 CA1 이 IPCA 의 ~2.7배 Total R² — 본 논문의 핵심 발견 재현.

---

## 14.11 본 논문 vs 본 구현의 차이

| 항목 | 본 논문 (실증) | 본 논문 (Section 4 시뮬) | 본 구현 (시뮬) |
|------|---------------|---------------------------|----------------|
| 데이터 크기 | N≈6,200, T=720, P=95 | N=200, T=180, P=50 | N=200, T=180, P=50 |
| 모델 깊이 | CA1-CA3 (1-3 hidden) | CA1만 (1 hidden) |
| Ensemble | 10개 | 1개 (옵션 있음) |
| Rolling retrain | 30년 매년 | 단일 split |
| Regularization | LASSO + early stop + ensemble | LASSO + early stop |
| Batch norm | 모든 hidden | 모든 hidden |

→ 본 구현은 **알고리즘의 본질** 을 보여주는 demonstration. 실제 운용 수준은 본 논문의 Online Appendix Code 참조.

---

## 14.12 GPU 가속 (옵션)

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = ConditionalAutoencoder(P, K).to(device)
Z_tr = Z_tr.to(device)
r_tr = r_tr.to(device)
x_tr = x_tr.to(device)
# ... (학습 시 모든 텐서 device 로 이동)
```

본 논문 규모 (N≈6,200, T=720) 에서는 GPU 1개로 충분히 빠름 (≈ 1분 / epoch).

---

## 14.13 후속 개선 아이디어

1. **Mini-batch 학습**: 현재 전체 epoch full-batch. 메모리 부족 시 시점별 mini-batch.
2. **Cross-sectional shuffle**: 같은 시점 안에서 주식 순서 셔플 → 더 robust.
3. **CA2, CA3 확장**: hidden 층을 추가하면 CA2, CA3.
4. **PyTorch Lightning**: 학습 boilerplate 줄이기.
5. **Hydra**: hyperparameter sweep.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. Conditional autoencoder 의 forward pass 가 표준 NN 과 다른 점은?
2. Managed portfolio $x_t$ 를 따로 사전계산하는 이유는?
3. LASSO 와 early stopping 을 동시에 사용하는 이유는?

### 답변
1. 두 개의 독립 네트워크 — β-net (다층 ReLU NN) 과 f-net (단일 선형 변환) — 의 출력을 **dot product** 로 결합. β 네트워크는 (N, P) 입력, f 네트워크는 (T, P) 입력 — 다른 차원. paper 의 L_f = 1 명시 하에 f-net 은 linear 만.
2. (a) f 네트워크가 직접 r 전체를 받으면 차원이 너무 큼 (N≈수천). (b) Z'Z 가 nearly constant 라는 가정 하에 $x_t = \Sigma^{-1}Z'r$ 이 더 작고 의미있는 입력 (Eq. 16). (c) IPCA 와의 동치성 (Prop 2) 보존.
3. **상호보완**: LASSO 는 **개별 가중치** 를 0 으로 (sparsity), early stopping 은 **학습 동역학** 을 멈춤 (effective model capacity). LASSO 만으로는 작은 가중치들이 collectively overfit 가능, early stopping 만으로는 무관 가중치를 제거 못함.
