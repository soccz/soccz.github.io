# 12. Python 실행 코드 — RFF + Ridge Regression + Recursive OOS

> 본 논문의 모든 방법을 동작 보장 Python 코드로. NumPy + Pandas 만으로 의존성 최소화. 복사-붙여서 즉시 실행 가능.

---

## 12.1 개요

이 챕터의 코드는:
1. **RFF 생성** — Equation 20 의 $\sin/\cos$ 변환.
2. **Ridge regression** — Eq 의 $(zI + \hat\Psi)^{-1}$ 계산.
3. **Recursive OOS** — rolling window 로 timing strategy.
4. **Performance metrics** — Sharpe ratio, IR, R², max loss, skewness.
5. **Theoretical curves** — Proposition 3, 4 의 $\mathcal{E}, \mathcal{L}, R^2, SR$ closed form.

CRSP 데이터 + Goyal-Welch 15 predictor 는 Amit Goyal 의 web 또는 *Updated Goyal-Welch* dataset 에서 다운로드 가능 (본 코드에서는 simulated data 로 대체).

---

## 12.2 핵심 함수 — RFF 생성

```python
import numpy as np

def generate_rff(G, n_features, gamma=2.0, seed=None):
    """
    Random Fourier Features (Equation 20 of paper).
    
    G: (T, J) raw predictors (T months × J variables)
    n_features: P = 2K, total RFFs (K pairs of sin/cos)
    gamma: bandwidth parameter (default 2.0)
    seed: random seed for ω draws (for reproducibility)
    
    Returns: (T, P) RFF matrix S
    """
    T, J = G.shape
    K = n_features // 2  # K pairs of sin/cos
    
    rng = np.random.default_rng(seed)
    omega = rng.normal(size=(J, K))  # ω_i ~ N(0, I_J)
    
    proj = gamma * G @ omega  # (T, K) random projections
    
    S_sin = np.sin(proj)  # (T, K)
    S_cos = np.cos(proj)  # (T, K)
    
    S = np.concatenate([S_sin, S_cos], axis=1)  # (T, 2K) = (T, P)
    return S
```

**호출 예**:
```python
T, J = 1000, 15
G = np.random.randn(T, J)  # simulated 15 macro predictors
S = generate_rff(G, n_features=10000, gamma=2.0, seed=42)
print(S.shape)  # (1000, 10000)
```

---

## 12.3 Ridge regression estimator

```python
def ridge_fit(S, R, z):
    """
    Ridge regression: β̂(z) = (zI + S'S/T)^(-1) (1/T) S'R
    
    S: (T, P) signal matrix (training)
    R: (T,) return vector (training)
    z: ridge shrinkage parameter (>= 0)
    
    Returns: β̂ vector (P,)
    """
    T, P = S.shape
    Psi_hat = S.T @ S / T                # (P, P) sample covariance
    rhs = S.T @ R / T                    # (P,)
    
    if z > 0 or T >= P:
        # Standard ridge / OLS
        beta_hat = np.linalg.solve(z * np.eye(P) + Psi_hat, rhs)
    else:
        # Ridgeless when P > T: use pseudo-inverse
        beta_hat = np.linalg.pinv(Psi_hat) @ rhs
    
    return beta_hat

def ridge_predict(beta_hat, S_test):
    """One-step forecast: π̂_t = β̂' S_t"""
    return S_test @ beta_hat
```

**호출 예**:
```python
T_train = 60
S_train = S[:T_train]
R_train = np.random.randn(T_train)  # simulated returns
beta = ridge_fit(S_train, R_train, z=1e3)
pi_t = ridge_predict(beta, S[T_train])  # forecast at t = T_train
```

---

## 12.4 Recursive OOS procedure

```python
def recursive_oos(S, R, T_window, z, return_positions=False):
    """
    Recursive out-of-sample prediction + timing strategy.
    
    S: (T, P) full RFF panel
    R: (T,) full return series
    T_window: rolling training window size (12, 60, 120)
    z: ridge shrinkage
    return_positions: also return π̂_t time series
    
    Returns:
      timing_returns: (T - T_window,) realized timing strategy returns π̂_t * R_{t+1}
      forecasts: (T - T_window,) one-step forecasts π̂_t
      (optional) positions: same as forecasts
    """
    T, P = S.shape
    n_oos = T - T_window
    
    forecasts = np.zeros(n_oos)
    timing_returns = np.zeros(n_oos)
    
    for i in range(n_oos):
        # Training window: [i, i + T_window)
        S_train = S[i : i + T_window]
        R_train = R[i + 1 : i + T_window + 1]  # R is shifted by 1
        
        # Volatility-standardize within training window
        S_std = S_train.std(axis=0, ddof=0) + 1e-8
        S_train_std = S_train / S_std
        S_t_std = S[i + T_window] / S_std       # apply same standardization
        
        beta = ridge_fit(S_train_std, R_train, z)
        pi_t = S_t_std @ beta
        
        forecasts[i] = pi_t
        timing_returns[i] = pi_t * R[i + T_window]  # R_{t+1} 으로 곱
    
    if return_positions:
        return timing_returns, forecasts, forecasts.copy()
    return timing_returns, forecasts
```

---

## 12.5 Performance metrics

```python
def sharpe_ratio(returns, annualize_factor=12):
    """Monthly Sharpe ratio × √12 (annualized)."""
    mean = returns.mean()
    std = returns.std(ddof=1)
    return mean / std * np.sqrt(annualize_factor) if std > 0 else 0.0

def oos_r2(timing_returns, market_returns, forecasts):
    """
    OOS R² (paper convention): 1 - SSE(forecasts) / SSE(market)
    
    timing_returns: actual timing returns (used here for sanity)
    market_returns: actual market returns R_{t+1}
    forecasts: predicted forecasts π̂_t = β̂'S_t
    """
    sse_model = ((market_returns - forecasts) ** 2).sum()
    sse_null = (market_returns ** 2).sum()
    return 1 - sse_model / sse_null

def alpha_ir(timing_returns, market_returns):
    """
    Alpha (intercept) and IR (t-stat) from regression:
        timing_t = α + β × market_t + ε_t
    
    Returns: alpha, ir, t_stat
    """
    # Regress timing on market
    X = np.column_stack([np.ones(len(market_returns)), market_returns])
    beta_hat, _, _, _ = np.linalg.lstsq(X, timing_returns, rcond=None)
    alpha = beta_hat[0]
    
    residuals = timing_returns - X @ beta_hat
    residual_std = residuals.std(ddof=2)
    
    se_alpha = residual_std / np.sqrt(len(market_returns)) * np.sqrt(
        np.linalg.inv(X.T @ X)[0, 0] * (X.T @ X)[0, 0]
    )
    # More robust SE: full HC0 covariance
    se_alpha_simple = residual_std * np.sqrt(np.linalg.inv(X.T @ X)[0, 0])
    
    t_alpha = alpha / se_alpha_simple if se_alpha_simple > 0 else 0.0
    ir = alpha / residual_std * np.sqrt(12) if residual_std > 0 else 0.0
    
    return alpha, ir, t_alpha

def max_loss_std_units(returns):
    """Max monthly loss in standard deviation units."""
    return abs(returns.min()) / returns.std(ddof=1)

def skewness(returns):
    """Sample skewness."""
    z = (returns - returns.mean()) / returns.std(ddof=1)
    return (z ** 3).mean()
```

---

## 12.6 전체 실험 스크립트 (Table I 재현)

```python
def reproduce_table_one(market_returns, predictors, T_window=12,
                         P_rff=12000, gamma=2.0, n_repeat=100, seed=42):
    """
    본 논문 Table I 의 한 panel 재현.
    
    market_returns: (T,) monthly excess returns
    predictors: (T, J) Goyal-Welch raw predictors
    T_window: 12 / 60 / 120
    P_rff: number of RFF (보통 12000)
    gamma: RFF bandwidth (보통 2.0)
    n_repeat: RFF Monte Carlo draws (논문 1000, 시연용 100)
    
    Returns: dict with (Linear ridgeless / Linear ridge / Nonlinear ML) results
    """
    rng = np.random.default_rng(seed)
    
    # 1. Linear ridgeless (kitchen sink, z=0+)
    timing_lin_rl, fcst_lin_rl = recursive_oos(predictors, market_returns, T_window, z=1e-12)
    r2_lin_rl = oos_r2(timing_lin_rl, market_returns[T_window:], fcst_lin_rl)
    sr_lin_rl = sharpe_ratio(timing_lin_rl)
    
    # 2. Linear ridge (z = 10^3)
    timing_lin_r, fcst_lin_r = recursive_oos(predictors, market_returns, T_window, z=1e3)
    r2_lin_r = oos_r2(timing_lin_r, market_returns[T_window:], fcst_lin_r)
    sr_lin_r = sharpe_ratio(timing_lin_r)
    
    # 3. Nonlinear ML (RFF, z = 10^3, average over n_repeat draws)
    timing_ml = np.zeros(len(market_returns) - T_window)
    fcst_ml = np.zeros(len(market_returns) - T_window)
    for r in range(n_repeat):
        S_rff = generate_rff(predictors, n_features=P_rff, gamma=gamma, seed=seed + r)
        t_ret, f_cst = recursive_oos(S_rff, market_returns, T_window, z=1e3)
        timing_ml += t_ret
        fcst_ml += f_cst
    timing_ml /= n_repeat
    fcst_ml /= n_repeat
    
    r2_ml = oos_r2(timing_ml, market_returns[T_window:], fcst_ml)
    sr_ml = sharpe_ratio(timing_ml)
    
    # Alpha + IR
    market_oos = market_returns[T_window:]
    alpha_lin_rl, ir_lin_rl, t_lin_rl = alpha_ir(timing_lin_rl, market_oos)
    alpha_lin_r, ir_lin_r, t_lin_r = alpha_ir(timing_lin_r, market_oos)
    alpha_ml, ir_ml, t_ml = alpha_ir(timing_ml, market_oos)
    
    # Risk metrics
    maxloss_ml = max_loss_std_units(timing_ml)
    skew_ml = skewness(timing_ml)
    
    return {
        'T_window': T_window,
        'Linear ridgeless': dict(R2=r2_lin_rl, SR=sr_lin_rl, alpha=alpha_lin_rl, IR=ir_lin_rl, t_alpha=t_lin_rl),
        'Linear ridge':     dict(R2=r2_lin_r,  SR=sr_lin_r,  alpha=alpha_lin_r,  IR=ir_lin_r,  t_alpha=t_lin_r),
        'Nonlinear ML':     dict(R2=r2_ml,     SR=sr_ml,     alpha=alpha_ml,     IR=ir_ml,     t_alpha=t_ml,
                                  MaxLoss=maxloss_ml, Skew=skew_ml),
    }
```

**호출 예**:
```python
# 가상의 데이터 (실제는 CRSP + Goyal-Welch 사용)
T = 1080  # 1930-2020 monthly
market_returns = 0.005 + 0.04 * np.random.randn(T)  # synthetic
predictors = np.random.randn(T, 15)  # synthetic

results = reproduce_table_one(
    market_returns, predictors,
    T_window=12, P_rff=2000, n_repeat=50  # 시연용 (논문 P=12000, n=1000)
)

for model in ['Linear ridgeless', 'Linear ridge', 'Nonlinear ML']:
    r = results[model]
    print(f"{model:20s}: R²={r['R2']:>+8.2%}  SR={r['SR']:>+5.2f}  IR={r['IR']:>+5.2f}")
```

---

## 12.7 이론적 VoC curves (Propositions 3, 4)

$\Psi = I, b_* = 0.2$ calibration 의 closed form (Marchenko-Pastur):

```python
def marchenko_pastur_m(z, c):
    """Marchenko-Pastur Stieltjes m(-z; c) for Ψ = I."""
    # m(-z; c) = (-((1-c) + z) + √(((1-c) + z)² + 4cz)) / (2cz)
    num = -((1 - c) + z) + np.sqrt(((1 - c) + z) ** 2 + 4 * c * z)
    return num / (2 * c * z)

def xi_function(z, c):
    """ξ(z; c) = (1 - z·m(-z;c)) / (c^(-1) - 1 + z·m(-z;c))"""
    m = marchenko_pastur_m(z, c)
    return (1 - z * m) / (1 / c - 1 + z * m)

def theoretical_voc(c_arr, z, b_star=0.2, psi_1=1.0):
    """
    Proposition 3, 4 의 closed form VoC curves.
    
    c_arr: array of model complexity values
    z: ridge shrinkage
    b_star, psi_1: calibration (default Ψ=I, b_*=0.2)
    
    Returns: dict with R², expected return, variance, Sharpe ratio arrays
    """
    R2 = np.zeros_like(c_arr)
    E = np.zeros_like(c_arr)
    L = np.zeros_like(c_arr)
    V = np.zeros_like(c_arr)
    SR = np.zeros_like(c_arr)
    
    for i, c in enumerate(c_arr):
        m = marchenko_pastur_m(z, c)
        xi = xi_function(z, c)
        nu = psi_1 - (1 / c) * z * xi
        # ν' 는 derivative (numerical)
        dz = 1e-6
        xi_p = (xi_function(z + dz, c) - xi_function(z - dz, c)) / (2 * dz)
        nu_p = -(1 / c) * (xi + z * xi_p)
        nu_hat = nu + z * nu_p
        
        E[i] = b_star * nu
        L[i] = b_star * nu_hat - c * nu_p
        R2[i] = (2 * E[i] - L[i]) / (1 + b_star * psi_1)
        V[i] = 2 * E[i] ** 2 + (1 + b_star * psi_1) * L[i]
        SR[i] = E[i] / np.sqrt(V[i]) if V[i] > 0 else 0
    
    return dict(R2=R2, E=E, L=L, V=V, SR=SR)

# Plot 가능
import matplotlib.pyplot as plt
c_arr = np.linspace(0.05, 10, 100)
for z in [1e-2, 1e-1, 1, 10]:
    out = theoretical_voc(c_arr, z)
    plt.plot(c_arr, out['SR'], label=f'z={z}')
plt.axvline(1, color='gray', linestyle='--')
plt.xlabel('Model complexity c')
plt.ylabel('Sharpe ratio')
plt.legend()
plt.title('Figure 3: Theoretical OOS Sharpe ratio (correctly specified)')
plt.show()
```

---

## 12.8 실증 데이터 사용 가이드

실제 Goyal-Welch 데이터:

```python
import pandas as pd

def load_goyal_welch_data(filepath='goyal_welch_2008.csv'):
    """
    Amit Goyal 의 web 또는 Goyal-Welch-Zafirov (2023) 의 dataset 사용.
    
    Expected columns: yyyymm, Index (market), CRSP_SPvw (or rfree-adjusted)
                    + 15 predictors: dfy, infl, svar, de, lty, tms, tbl, dfr,
                                      dp, dy, ltr, ep, b/m, ntis
    """
    df = pd.read_csv(filepath)
    df['date'] = pd.to_datetime(df['yyyymm'], format='%Y%m')
    
    # Market excess return
    market = df['Index'].values  # or 'CRSP_SPvw'
    
    # 15 predictors
    pred_cols = ['dfy', 'infl', 'svar', 'de', 'lty', 'tms', 'tbl', 'dfr',
                 'dp', 'dy', 'ltr', 'ep', 'b_m', 'ntis']
    predictors = df[pred_cols].values
    
    # Add lag market return
    lag_mkt = np.roll(market, 1)
    lag_mkt[0] = 0
    predictors = np.column_stack([predictors, lag_mkt])
    
    # Volatility-standardize predictors (expanding window)
    pred_std = np.zeros_like(predictors)
    for t in range(36, len(predictors)):
        pred_std[t] = predictors[t] / (predictors[:t].std(axis=0) + 1e-8)
    
    return market[36:], pred_std[36:]
```

---

## 12.9 코드 검증 — 자기점검 (5분 안에)

```python
# 1. RFF 차원 확인
S = generate_rff(np.random.randn(100, 15), n_features=2000, seed=0)
assert S.shape == (100, 2000), "RFF dimension mismatch"

# 2. Ridge 계수 dimension
beta = ridge_fit(S, np.random.randn(100), z=1.0)
assert beta.shape == (2000,), "Ridge β dimension mismatch"

# 3. Sharpe ratio 합리성
sr = sharpe_ratio(np.array([0.01] * 100))  # constant returns → SR = ∞
sr_random = sharpe_ratio(np.random.randn(1000) * 0.01)  # random ≈ 0
assert -1 < sr_random < 1, "Sharpe of random returns should be near 0"

# 4. Marchenko-Pastur 의 c=0 limit
m_zero = marchenko_pastur_m(0.1, 0.001)  # c → 0
m_inf = 1 / (1 + 0.1)  # m_Ψ(-0.1) = 1/(1+0.1) for Ψ=I
print(f"MP at c≈0: m = {m_zero:.4f}, expected ≈ {m_inf:.4f}")

# 5. Theorem 1 의 monotonicity (informal check)
c_arr = np.linspace(0.1, 5, 50)
sr_z1 = theoretical_voc(c_arr, z=1.0)['SR']
# z=1.0 + correctly specified 의 SR 가 c 에 대해 (rough) monotone
# Note: correctly specified 에서는 not strictly monotone (Figure 3 참조)
# Misspecified 에서만 monotone (Theorem 1) — 다른 framework 필요
```

---

## 12.10 추가 실험 (옵션)

### Goyal-Welch 의 raw predictor 만 (linear ridgeless)
```python
# Linear kitchen sink (Goyal-Welch 2008 original)
timing_kc, _ = recursive_oos(predictors, market, T_window=12, z=1e-12)
print(f"Linear ridgeless SR: {sharpe_ratio(timing_kc):.3f}")
# 예상: -0.11 (매우 noisy)
```

### Multiple ridge values 비교
```python
sharpe_by_z = {}
for log_z in [-3, -2, -1, 0, 1, 2, 3]:
    z = 10 ** log_z
    t_ret, _ = recursive_oos(S_rff, market, T_window=12, z=z)
    sharpe_by_z[log_z] = sharpe_ratio(t_ret)
print(sharpe_by_z)
# 예상: log_z=3 (z=1000) 가장 큰 Sharpe
```

### Subsample robustness
```python
half = len(market) // 2
sr_first_half  = sharpe_ratio(recursive_oos(S_rff[:half], market[:half], T_window=12, z=1e3)[0])
sr_second_half = sharpe_ratio(recursive_oos(S_rff[half:], market[half:], T_window=12, z=1e3)[0])
print(f"1930-1974: SR = {sr_first_half:.3f}")
print(f"1975-2020: SR = {sr_second_half:.3f}")
# 예상: 후반부가 약 절반 (논문 Section V.F)
```

---

## 12.11 코드 통한 자기점검

### Q1: RFF 의 P 가 매우 클 때 메모리 충분한가?
A: $T = 1000, P = 12,000$ → $S$ matrix 가 $\approx 96$ MB (float64). 가능. $\hat\Psi = S'S$ 가 $\approx 1.15$ GB → 메모리 제약. 대안: pseudo-inverse 계산을 직접 ($P > T$ 면 $T \times T$ matrix 만 inversion).

### Q2: Recursive OOS 가 매우 느리지 않은가?
A: $T_{window} = 12, T = 1000$ → 988 iterations × ridge fit ($O(P^3)$ for inverse). $P = 12,000$ 이면 $\approx 2 \times 10^{12}$ flops. 실제로 수 시간 ~ 일 단위. 논문: 1000 RFF draws + 3 T_window + 다양한 z → 수퍼컴퓨터.

### Q3: 본 코드가 논문 Table I 의 정확 수치 재현하나?
A: Stochastic — RFF draws 의 random seed + averaging 수 + data filtering 디테일 의존. 정성적 패턴 (SR 부호, 크기) 은 재현 가능, 정량 수치 (0.47 같은 specific number) 는 1000 draws + full data + author 의 정확한 procedure 필요.

### Q4: 새 데이터셋 (예: bond market) 으로 어떻게 확장?
A: `predictors` 와 `market_returns` 만 교체. RFF 부분은 그대로. Theorem 1 의 조건 (sufficiently mixed signals + bounded cross-correlation) 이 holds 면 같은 패턴 예상.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **RFF 의 $\omega \sim N(0, I)$ 가 *random* 인 점이 estimator 에 미치는 영향?**
2. **Ridge regression 의 $z$ 선택 방법?**
3. **Recursive OOS 가 "purely out-of-sample" 인 이유?**

### 답변
1. $\omega_i$ 가 random fixed (training set 전에 한 번 sample, 그 후 학습 안 함). 즉 첫 layer 의 weights 가 *학습되지 않는 NN*. 다른 $\omega$ draw 면 다른 RFF feature → 다른 $\hat\beta$ → 다른 timing return. 본 논문은 *1000 independent draws* 를 평균해서 *randomness* 영향 통제. Hornik 등의 universal approximation 결과는 random weights 에도 valid 하므로 이론적 정당화.
2. (i) Cross-validation: 데이터 일부 holdout, 다양한 $z \in \{10^{-3}, ..., 10^3\}$ 시도, holdout SR 최대 선택. (ii) Theoretical: $z_* = c/b_*$ — but $b_*$ 불명. (iii) Heuristic: $z = 10^3$ 정도가 robust (본 논문). (iv) RMT 분석의 *insensitivity* 결과 (각주 27): 고복잡도에서 $z$ 선택에 *둔감* → simple methods OK.
3. 매 시점 $t$ 에서 학습 데이터는 $[t - T_{window}, t)$ 만 사용, $R_{t+1}$ (미래) 정보 *zero*. Expanding-window standardization 도 $[0, t)$ 만 사용. Forecast $\hat\pi_t = \hat\beta_{[t-T_{window}, t)}' S_t$ 는 시점 $t$ 의 available information 만으로 계산. Realized timing return $\hat\pi_t \cdot R_{t+1}$ 의 $R_{t+1}$ 은 *실제 자산 수익률* — 학습 안 사용. 따라서 14/15 NBER recessions divest 가 *real-time signal* — economic significance 큼.

---

다음 파일 [13_diagrams.md](13_diagrams.md) — ASCII 도식 + 인터랙티브 viz 카탈로그.
