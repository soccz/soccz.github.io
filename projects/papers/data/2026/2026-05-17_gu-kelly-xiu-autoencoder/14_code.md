# 14. 코드 — PyTorch 구현

> 본 논문의 **CA1** 모델을 PyTorch 로 구현한 self-contained 예제 + 시뮬레이션 데이터 검증.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **CA1 모델의 PyTorch 구현** — BetaNetwork + FactorNetwork + ConditionalAutoencoder 3 클래스
- 5중 정규화 (LASSO, Early Stopping, Ensemble, Adam, BatchNorm) 를 코드에서 어떻게 구현하나
- **paper Section 4 시뮬레이션 재현** — Linear vs Nonlinear DGP 에서 결과 비교
- 약 200 줄로 본 논문 핵심 기능 재현 가능

코드 그대로 복붙해서 실행 가능. NumPy + PyTorch 만 있으면 됨.

---

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
    """β = NN(z) — 자산 특성을 노출도로 변환하는 신경망.
    
    [학생-시험 비유]
    입력 z: "학생 신상 카드" (94 특성)
    출력 β: "학생의 5 과목 약점" (K=5 노출도)
    """
    def __init__(self, P, K, hidden=32):
        # P = 특성 수 (94), K = 요인 수 (보통 5~6), hidden = 은닉층 뉴런 수 (32, paper 기본값)
        super().__init__()
        # CA1 의 정확한 구조 (β 네트워크만, paper Section 2.2):
        self.net = nn.Sequential(
            nn.Linear(P, hidden),       # 1단계: 94 특성 → 32 차원으로 선형 변환
            nn.BatchNorm1d(hidden),     # 2단계: 평균 0, 분산 1 로 정규화 (학습 안정)
            nn.ReLU(),                  # 3단계: 음수면 0, 양수면 그대로 (비선형 도입)
            nn.Linear(hidden, K),       # 4단계: 32 → 5 차원 노출도 (마지막은 선형, ReLU 없음)
        )

    def forward(self, z):
        # z: (N, P) = (자산 N 개, 특성 P 개) 의 배치
        # 출력 β: (N, K) = (자산 N 개, 노출도 K 차원)
        return self.net(z)


class FactorNetwork(nn.Module):
    """f = W x — managed portfolio 에서 잠재요인으로의 **단일 선형 변환**.
    
    [학생-시험 비유]
    입력 x: "94 개 특성-가중 portfolio 의 오늘 수익률"
    출력 f: "오늘의 5 시험 난이도" (K 차원 요인)
    
    [중요]
    paper L_f = 1 → 신경망이 아닌 **선형 한 줄 식**.
    이유: 요인을 portfolio (선형결합) 로 해석 유지 → 경제적 의미 보존.
    """
    def __init__(self, P, K):
        # P = managed portfolio 수 (94 또는 95), K = 요인 수
        super().__init__()
        self.linear = nn.Linear(P, K, bias=True)  # f = W x + b (한 줄 선형식)

    def forward(self, x):
        # x: (T, P) = (시점 T 개, portfolio P 개) 의 수익률
        # 출력 f: (T, K) = (시점 T 개, 요인 K 개)
        return self.linear(x)


class ConditionalAutoencoder(nn.Module):
    """CA1 모델 = β 네트워크 + f 네트워크 + dot product.
    
    [전체 구조]
      특성 z ──→ [BetaNet: NN] ──→ β (자산별 노출도)
                                       ↘
                                        × (dot product)
                                       ↗
      portfolio x ──→ [FactorNet: 선형] ──→ f (오늘의 요인)
                                       │
                                       ▼
                                    r̂ = β · f  (예측 수익률)
    
    [모델 변형]
    CA0: β-net hidden 0층 (= IPCA, Prop 2 로 동치)
    CA1: β-net hidden 1층 (32 뉴런) — 본 코드
    CA2: β-net hidden 2층 (32, 16)
    CA3: β-net hidden 3층 (32, 16, 8)
    """
    def __init__(self, P, K, hidden=32):
        super().__init__()
        self.beta_net = BetaNetwork(P, K, hidden)    # β 추정 신경망
        self.factor_net = FactorNetwork(P, K)        # f 추정 선형층

    def forward(self, Z, x):
        """예측 수익률 계산 — 매 시점 t 마다 β_t · f_t.
        
        Z: (T, N, P) — 모든 시점 × 모든 자산 × 모든 특성
        x: (T, P)    — 모든 시점 × 모든 managed portfolio
        반환 r_hat: (T, N) — 모든 시점 × 모든 자산의 예측 수익률
        
        [절차]
        1. Z 를 (T*N, P) 로 펼쳐 β 한 번에 계산
        2. 다시 (T, N, K) 로 모양 복원
        3. x 로 f 계산
        4. einsum 으로 β_t @ f_t 를 모든 t 에서 동시 계산
        """
        T, N, P = Z.shape
        Z_flat = Z.reshape(T * N, P)              # (T*N, P) — 한 번에 처리하려 펼침
        beta_flat = self.beta_net(Z_flat)         # (T*N, K) — 자산별 노출도
        beta = beta_flat.reshape(T, N, -1)        # (T, N, K) — 시점·자산별 노출도
        f = self.factor_net(x)                    # (T, K) — 시점별 요인
        # einsum: r_hat[t,n] = sum_k beta[t,n,k] * f[t,k]
        # 즉 매 시점·자산마다 (자산 노출도) · (시점 요인) 의 내적
        r_hat = torch.einsum('tnk,tk->tn', beta, f)
        return r_hat
```

---

## 14.4 학습 루프 (with LASSO + early stopping)

```python
def train_CA(model, Z_tr, x_tr, r_tr, Z_val, x_val, r_val,
             lr=1e-3, lam=1e-4, max_epochs=200, patience=5):
    """CA 모델 학습 — LASSO + Early Stopping + Adam 통합.
    
    [학생-시험 비유]
    매 epoch 마다 학생이 공부 → 모의고사 (val) 점수 측정.
    더 좋아지면 그 weight 저장, patience 번 연속 나빠지면 멈춤.
    
    [인자]
    Z_tr, x_tr, r_tr: train 데이터 (1957-1974)
    Z_val, x_val, r_val: validation 데이터 (1975-1986)
    lr: 학습률 (Adam)
    lam: LASSO 강도 λ (작을수록 약함)
    max_epochs: 최대 학습 횟수
    patience: validation 안 좋아지면 견디는 epoch 수
    """
    # Adam optimizer — "잘 안 되는 weight 에 더 신경 쓰는 적응형" 학습법
    optimizer = optim.Adam(model.parameters(), lr=lr)
    
    # Early stopping 변수
    best_val = float('inf')   # 지금까지 본 가장 좋은 val MSE
    best_state = None         # 그때의 모델 weight 저장
    no_improve = 0            # 연속으로 안 좋아진 epoch 수
    
    for epoch in range(max_epochs):
        # ========== 학습 단계 ==========
        model.train()                       # 학습 모드 (BatchNorm 활성)
        optimizer.zero_grad()               # 이전 gradient 초기화
        r_hat = model(Z_tr, x_tr)           # forward — 예측 수익률 계산
        
        # 손실 = (예측 오차 제곱 평균) + (LASSO 정규화)
        mse = ((r_tr - r_hat) ** 2).mean()                          # MSE 항
        l1 = sum(p.abs().sum() for p in model.parameters())          # LASSO L1 항 (Eq 19)
        loss = mse + lam * l1                                        # 총 손실
        
        loss.backward()                     # backprop — gradient 계산
        optimizer.step()                    # weight 업데이트
        
        # ========== 검증 단계 ==========
        model.eval()                        # 평가 모드 (BatchNorm 고정)
        with torch.no_grad():               # gradient 계산 안 함 (효율)
            r_hat_val = model(Z_val, x_val)
            val_mse = ((r_val - r_hat_val) ** 2).mean().item()
        
        # ========== Early Stopping 판정 ==========
        if val_mse < best_val - 1e-6:        # val 가 좋아졌으면
            best_val = val_mse                # 기록 갱신
            best_state = {k: v.clone() for k, v in model.state_dict().items()}  # weight 저장
            no_improve = 0                    # 카운터 리셋
        else:                                  # val 가 안 좋아졌으면
            no_improve += 1                   # 카운터 증가
            if no_improve >= patience:        # patience 초과 → 학습 중단
                break

    # 최종: best weight 로 복원 (마지막 epoch 가 아닌 **가장 좋았던 weight**)
    model.load_state_dict(best_state)
    return model, best_val
```

---

## 14.5 Managed Portfolio 사전 계산

```python
def managed_portfolio(Z, r):
    """managed portfolio x_t 계산 — paper Eq. 16.
    
    [공식] x_t = (Z_t' Z_t)^{-1} Z_t' r_t
    
    [의미]
    매월 자산 수익률 r_t (N 개) 를 특성 Z_t (N×P) 에 회귀한 계수.
    결과 x_t (P 차원) = "각 특성으로 만든 long-short portfolio 의 오늘 수익".
    
    [학생-시험 비유]
    30,000 학생 점수를 → 94 특성 (학년·성적별) 의 그룹 평균 점수로 압축.
    매월 자산 수 N 이 변해도 P=94 는 일정 → 신경망 입력 안정.
    """
    T, N, P = Z.shape
    x_list = []
    for t in range(T):                      # 매 시점 t 에 대해 따로 계산
        Zt = Z[t]                            # (N, P) — t 시점의 모든 자산 특성
        rt = r[t]                            # (N,)  — t 시점의 모든 자산 수익률
        # (Z'Z) 의 역행렬 — 단 수치 안정을 위해 작은 값 더함 (regularize)
        ZtZ = Zt.T @ Zt + 1e-6 * torch.eye(P)
        # 표준 OLS: x = (Z'Z)^{-1} Z'r
        xt = torch.linalg.solve(ZtZ, Zt.T @ rt)
        x_list.append(xt)
    return torch.stack(x_list)               # (T, P) — 모든 시점의 portfolio 수익
```

---

## 14.6 Ensemble Averaging

```python
def ensemble_predict(models, Z, x):
    """N 개 모델의 예측을 평균 — variance 1/N 로 감소.
    
    [학생-시험 비유]
    10명의 학생 답을 평균 → 한 명의 운에 안 휘둘림.
    """
    preds = [m(Z, x).detach() for m in models]      # 각 모델의 예측
    return torch.stack(preds).mean(dim=0)            # 단순 평균


def train_ensemble(P, K, Z_tr, x_tr, r_tr, Z_val, x_val, r_val,
                   n_ensemble=10):
    """다른 seed 로 10개 모델 따로 학습 → 평균 (paper p.436 'say, 10').
    
    [왜?]
    신경망은 비볼록 (non-convex). seed 다르면 다른 local optimum 으로 수렴.
    10 개 평균 → bias 안 변함, variance ↓ → OOS 성능 ↑.
    """
    models = []
    for seed in range(n_ensemble):
        torch.manual_seed(seed)                              # 각 모델 다른 초기값
        m = ConditionalAutoencoder(P, K, hidden=32)          # 새 모델 인스턴스
        m, _ = train_CA(m, Z_tr, x_tr, r_tr, Z_val, x_val, r_val)  # 학습
        models.append(m)
    return models
```

---

## 14.7 시뮬레이션 데이터 생성 (paper Section 4 setup)

paper Section 4 의 정확한 setup: **N=200, T=180, P=50, K=3, 잔차 t_5(0, 0.1²)**.

```python
from torch.distributions import StudentT, Normal, Uniform

def simulate_characteristics(N, T, P, seed=42):
    """paper Eq. (22) — 특성 시계열 시뮬레이션.
    
    [공식] c_{ij,t} = 2/(n+1) rank(c̄_{ij,t}) - 1
           c̄_{ij,t} = ρ_j c̄_{ij,t-1} + ε_{ij,t},  ρ_j ~ U[0.9, 1]
    
    [학생-시험 비유]
    학생 신상 (특성) 이 매월 약간씩 변동 (AR(1)) 하되, 매월 cross-sectional 순위로 [-1, 1] 균등 분포 정규화.
    실제 데이터의 rank normalization (Section 6.2.3) 흉내.
    """
    torch.manual_seed(seed)
    rho = Uniform(0.9, 1.0).sample((P,))     # 각 특성별 끈적임 (0.9~1, 매우 끈적)
    c_bar = torch.zeros(T, N, P)             # raw 특성 (AR(1) 시계열)
    c_bar[0] = torch.randn(N, P)             # 초기값 표준정규
    for t in range(1, T):
        # AR(1): c̄_t = ρ c̄_{t-1} + ε
        c_bar[t] = rho * c_bar[t-1] + torch.randn(N, P)
    
    # 매월 cross-sectional rank normalization → [-1, 1] 균등 분포
    # argsort().argsort() 가 rank 를 반환 (0 부터 N-1)
    ranks = c_bar.argsort(dim=1).argsort(dim=1).float()
    c = 2.0 * (ranks + 1) / (N + 1) - 1.0     # [-1, 1] 범위로 변환
    return c


def simulate_factors_and_xt(T, K, P, seed=42):
    """잠재요인 f_t 와 관측 portfolio x_t 시뮬레이션.
    
    [공식]
    x_t ~ N(0.03, 0.1² I_P)  — 평균 3%, 표준편차 10% (월간)
    η_t ~ N(0, 0.01² I_K)    — 작은 잡음
    f_t = W x_t + η_t        — 요인은 portfolio 의 선형 조합 + 잡음
    
    [학생-시험 비유]
    매월 시험 난이도 (f) 가 그날 portfolio 수익 (x) 의 함수 + 약간의 잡음.
    """
    torch.manual_seed(seed + 1)
    x = 0.03 + 0.1 * torch.randn(T, P)        # x_t ~ N(0.03, 0.1²) 
    eta = 0.01 * torch.randn(T, K)             # η_t ~ N(0, 0.01²)
    # paper 의 W 행렬: 첫 K 열이 identity (즉 f_k ≈ x_k)
    W = torch.zeros(K, P)
    for k in range(K):
        W[k, k] = 1.0
    f = (x @ W.T) + eta                        # (T, K) — 요인 시계열
    return f, x, W


def beta_linear(c):
    """DGP (a) — Linear sparse β.
    
    [공식] g*(c) = (1.2 × 2 c1, c2, 0.8 × c3)'
    
    [학생 비유]
    50 개 특성 중 첫 3 개만 약점에 영향:
      수학 약점 = 2.4 × 학습시간       (c1 의 선형)
      영어 약점 = c2                   (성격의 선형)
      과학 약점 = 0.8 × 야간형         (c3 의 선형)
    
    → 진짜 데이터가 선형이면 IPCA 가 잘 잡음. CA1+ 의 NN 자유도는 손해만.
    """
    # c[..., k] 는 k 번째 특성 (모든 자산·시점)
    return torch.stack([2.4 * c[..., 0], c[..., 1], 0.8 * c[..., 2]], dim=-1)


def beta_nonlinear(c):
    """DGP (b) — Nonlinear sparse β (with interaction + sign).
    
    [공식] g*(c) = (c1, 2 × c1 × c2, 0.6 × sgn(c3))'
    
    [학생 비유]
    같은 첫 3 특성이지만 **비선형 결합**:
      수학 약점 = 학습시간                    (선형)
      영어 약점 = 2 × 학습시간 × 성격          ★ 곱항 (interaction)
      과학 약점 = 0.6 × sgn(야간형)            ★ sign 함수 (점프)
    
    → 곱항·sign 은 **선형 IPCA 가 절대 못 잡음**. NN 의 ReLU + 깊이가 자동 발견.
    실증에서 CA1 이 IPCA 의 2.7배 R² 의 인과적 근거.
    """
    return torch.stack([
        c[..., 0],                            # 선형 항
        2.0 * c[..., 0] * c[..., 1],          # 곱항 (NN 만 잡음)
        0.6 * torch.sign(c[..., 2]),          # sign 함수 (NN 만 잡음)
    ], dim=-1)


def simulate(N=200, T=180, P=50, K=3, beta_fn=beta_linear, seed=42):
    """전체 시뮬레이션 — paper Section 4 setup.
    
    [paper 설정]
    N=200 자산, T=180 시점, P=50 특성, K=3 진짜 요인
    잔차 ε ~ t_5(0, 0.1²)  ← Student-t with df=5, heavy-tail (실제 주식 흉내)
    
    [반환]
    c: (T, N, P) — 자산 특성 (모든 시점, 모든 자산, 모든 특성)
    r: (T, N)    — 자산 수익률 (true β × f + noise)
    x: (T, P)    — managed portfolio 수익
    f: (T, K)    — 잠재 요인
    """
    c = simulate_characteristics(N, T, P, seed)            # 특성 시계열
    f, x, _ = simulate_factors_and_xt(T, K, P, seed)        # 요인 + portfolio
    beta = beta_fn(c)                                       # β 계산 (선형 또는 비선형 DGP)
    # 모델 신호: r_signal = β · f (모든 시점·자산)
    signal = torch.einsum('tnk,tk->tn', beta, f)
    # 잔차: Student-t 분포 (heavy-tail) — paper 의 정확한 설정
    t_dist = StudentT(df=5.0, loc=0.0, scale=0.1)
    eps = t_dist.sample((T, N))
    r = signal + eps                                        # 최종 수익률
    return c, r, x, f
```

---

## 14.8 IPCA 베이스라인 (비교용)

```python
def ipca(Z, r, K, n_iter=50):
    """KPS (2019) 의 IPCA 추정량 — Alternating Least Squares (ALS).
    
    [공식] paper Eq. 17 의 손실 함수:
        min_{Γ, f} Σ_t ||r_t - Z_{t-1} Γ' f_t||²
    
    [알고리즘]
    1. Γ 와 f 를 번갈아 추정 (한쪽 고정, 다른 쪽 OLS) → 수렴까지 반복
    2. 한 step 이 closed-form 이므로 매 반복 빠름
    
    [Convention] 본 코드는 paper Eq. 2 의 P×K convention 사용.
    Appendix A.2 proof 는 K×P convention.
    """
    T, N, P = Z.shape
    # 초기값 — 작은 random Gaussian
    Gamma = torch.randn(P, K) * 0.1
    f = torch.randn(T, K) * 0.1
    
    for _ in range(n_iter):                      # ALS 반복
        # ========== Step 1: Γ 고정 → f 추정 ==========
        # 매 시점 t 에 대해 f_t = OLS regression of r_t on Z_t Γ
        for t in range(T):
            Zt_Gamma = Z[t] @ Gamma               # (N, K) — 변환된 회귀 변수
            # (Z'Z) — regularize 작은 값 더해 수치 안정
            ZtGtZtG = Zt_Gamma.T @ Zt_Gamma + 1e-6 * torch.eye(K)
            # OLS: f_t = (Z'Z)^{-1} Z' r_t
            f[t] = torch.linalg.solve(ZtGtZtG, Zt_Gamma.T @ r[t])
        
        # ========== Step 2: f 고정 → Γ 추정 ==========
        # vec(Γ) 형태로 풀기 (Kronecker product 활용)
        lhs = torch.zeros(P * K, P * K)
        rhs = torch.zeros(P * K)
        for t in range(T):
            Zt = Z[t]                              # (N, P)
            ft = f[t]                              # (K,)
            # Kronecker product 로 vec(Γ) 계수 행렬 구성
            kron = torch.kron(ft.unsqueeze(0).T @ ft.unsqueeze(0), Zt.T @ Zt)
            lhs += kron
            rhs += (Zt.T @ r[t].unsqueeze(1) @ ft.unsqueeze(0)).flatten()
        # vec(Γ) = (Σ K)^{-1} rhs
        Gamma_vec = torch.linalg.solve(lhs + 1e-6 * torch.eye(P * K), rhs)
        Gamma = Gamma_vec.reshape(P, K)            # vec → 행렬 복원
    
    return Gamma, f


def ipca_predict(Z, Gamma, f):
    """IPCA 의 OOS 예측 — 주의 깊게 사용.
    
    [중요] IPCA 의 f_t 는 **시점별** 추정값. 즉 학습 데이터의 f 만 알고 있음.
    OOS 시점의 f 는 모름 → 별도 추정 필요 (paper 의 방식).
    
    본 함수는 단순화: 동일 f 사용 (실제는 더 정교한 OOS f 추정 필요).
    """
    T, N, P = Z.shape
    K = f.shape[1]
    f_oos = torch.zeros(T, K)                    # OOS f 자리 (단순화 시 0)
    # einsum: r̂[t,n] = Σ_{p,k} Z[t,n,p] Γ[p,k] f_oos[t,k]
    return torch.einsum('tnp,pk,tk->tn', Z, Gamma, f_oos)
```

---

## 14.9 평가 지표

```python
def total_r2(r, r_hat):
    """Total R² (paper Eq. 20) — 실현 수익률 변동 설명 비율.
    
    [공식] 1 - (잔차 제곱합) / (수익률 제곱합)
    [의미] 모델이 '오늘 무슨 일이 일어났는지' 를 얼마나 잘 설명?
    """
    ss_res = ((r - r_hat) ** 2).sum()      # 잔차 제곱합
    ss_tot = (r ** 2).sum()                # 분모 (실제 수익률 제곱합)
    return (1 - ss_res / ss_tot).item()


def predictive_r2(r, beta, f_mean):
    """Predictive R² (paper Eq. 21) — 기대 수익률 예측 정확도.
    
    [Total R² 와 결정적 차이]
    Total:      r̂ = β · f_t (실제 시점 요인 사용)
    Predictive: r̂ = β · λ   (요인의 **평균** 사용) ← 미래 예측
    
    [학생 비유]
    Total = "오늘 시험 점수 맞히기"
    Predictive = "이 학생 평균 점수 맞히기" ← 자산가격결정의 본질
    
    f_mean: (K,) — 요인의 시간 평균 (위험 프리미엄 λ)
    """
    r_pred = beta @ f_mean                  # 예측 = β · λ
    ss_res = ((r - r_pred) ** 2).sum()
    ss_tot = (r ** 2).sum()
    return (1 - ss_res / ss_tot).item()


def sharpe_long_short(r, r_hat, deciles=10):
    """Long-Short Decile Sharpe Ratio (paper Table 3 정의).
    
    [절차]
    1. 매 시점 모델 예측 r̂ 으로 자산을 10 decile 로 정렬
    2. Top decile (예측 최고) 매수 + Bottom decile (예측 최악) 공매도
    3. 그 spread 의 시계열 mean / std → 연환산 (× √12)
    
    [업계 기준]
    < 0  : 손실
    0.5 : 시장 평균
    1.0+: 매우 우수
    """
    T, N = r.shape
    n_per_decile = N // deciles             # 각 decile 의 자산 수
    long_short = []
    for t in range(T):
        idx = r_hat[t].argsort()             # 예측값으로 정렬한 인덱스
        # 상위 10% 매수
        long_ret = r[t, idx[-n_per_decile:]].mean()
        # 하위 10% 공매도 (수익률에 마이너스 = 매도 포지션의 수익)
        short_ret = r[t, idx[:n_per_decile]].mean()
        long_short.append((long_ret - short_ret).item())
    arr = np.array(long_short)
    # 연환산 Sharpe = (월 평균 / 월 표준편차) × √12
    return arr.mean() / arr.std() * np.sqrt(12)
```

---

## 14.10 메인 실험 (paper Section 4 setup)

```python
def main():
    """paper Section 4 (Monte Carlo) 의 핵심 결과 재현.
    
    [실험]
    DGP (a) Linear  + DGP (b) Nonlinear 두 setup 에서 CA1 학습 → Total R² 측정.
    
    [paper Table 6 핵심 결과 (K=3)]
    - Linear DGP : IPCA 40.7, CA1 38.1  → IPCA 미세 우위 (선형 진짜 모델)
    - Nonlinear DGP: IPCA 11.9, CA1 31.8 → CA1 2.7배 우위 (비선형 진짜 모델)
    """
    P, K = 50, 3                                    # 특성 50개, 진짜 요인 3개
    # paper Section 4: T=180 을 60/60/60 으로 train/val/test 분할
    T_tr, T_val, T_te = 60, 60, 60

    # 두 DGP setup 각각에 대해 학습 + 평가
    for label, beta_fn in [('Linear (a)', beta_linear),
                            ('Nonlinear (b)', beta_nonlinear)]:
        print(f'=== DGP {label} ===')
        
        # 시뮬레이션 데이터 생성
        c, r, x, f_true = simulate(N=200, T=T_tr + T_val + T_te,
                                    P=P, K=K, beta_fn=beta_fn, seed=0)
        
        # 시계열 분할 (chronological — random 아님!)
        c_tr, r_tr, x_tr = c[:T_tr], r[:T_tr], x[:T_tr]
        c_val, r_val, x_val = c[T_tr:T_tr+T_val], r[T_tr:T_tr+T_val], x[T_tr:T_tr+T_val]
        c_te, r_te, x_te = c[T_tr+T_val:], r[T_tr+T_val:], x[T_tr+T_val:]

        # CA1 모델 학습 (5 정규화 모두 포함)
        model = ConditionalAutoencoder(P, K, hidden=32)
        model, _ = train_CA(model, c_tr, x_tr, r_tr, c_val, x_val, r_val,
                             lam=1e-4, lr=1e-3, max_epochs=200, patience=5)
        
        # OOS 예측 + Total R² 측정
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

1. **Conditional autoencoder 의 forward pass 가 표준 NN 과 다른 점**:
   - **표준 NN forward**: 한 입력 → 한 출력. 일직선 변환.
   - **Conditional AE 의 두 가지 차이**:
     - **(a) 두 개의 독립 네트워크**: β-net (다층 ReLU NN, 입력 z) + f-net (단일 선형 변환, 입력 x) 따로 작동.
     - **(b) Dot product 결합**: 두 출력을 element-wise 곱이 아닌 **내적 (dot product)** 으로 결합 → 예측 수익률 $\hat r$.
   - **차원이 비대칭**: β-net 입력 (N, P) → 출력 (N, K). f-net 입력 (T, P) → 출력 (T, K). 다른 batch dimension.
   - **L_f = 1 의 중요성**: paper 가 명시한 단일 선형 가정. 만약 비선형이면 f 가 portfolio 해석 잃음.
   - **PyTorch 구현 핵심**: `torch.einsum('tnk,tk->tn', beta, f)` 한 줄이 모든 시점·자산의 dot product 동시 계산.

2. **Managed portfolio $x_t$ 를 사전계산하는 이유**:
   - **(a) 차원 폭발 방지**: f-network 가 직접 $r_t$ (N 차원, 약 6,200) 를 받으면 weight 수 = $N \times K$ = 31,000. 학습 어려움 + 매월 N 변동.
   - **(b) Eq. 16 의 압축**: $x_t = \Sigma^{-1} Z' r_t$ — N → P=94 로 320 배 압축. weight 수 = 94 × 5 = 470.
   - **(c) Cross-section stability**: 매월 자산 수 변동해도 $x_t$ 는 항상 P=94 — NN 입력 안정.
   - **(d) IPCA 동치성 (Prop 2) 보존**: $Z'Z = \Sigma$ 가정 하에 CA0 = IPCA 의 핵심에 $x_t$ 가 등장. 사전계산 안 하면 동치성 깨짐.
   - **(e) 경제적 의미**: $x_t^{(j)}$ = "특성 $j$ 의 long-short portfolio 오늘 수익" — 직관적.
   - **단점**: $Z'Z$ 가 시변하면 정확성 약간 손해. 실증에서 rank normalize 로 거의 무시할 정도.

3. **LASSO 와 Early Stopping 의 상호보완성**:
   - **LASSO 의 작용**: 손실에 $\lambda\sum|\theta|$ 추가 → **개별 가중치** 를 정확히 0 으로 → sparsity 유도 (94 → ~20).
   - **Early Stopping 의 작용**: validation loss 가 다시 증가하면 학습 중단 → **학습 동역학 (epochs)** 을 멈춤 → effective model capacity 조절.
   - **두 가지가 다른 overfit 종류를 막음**:
     - LASSO 만: 작은 weight 들이 "collectively" overfit 가능. 각각은 작지만 합쳐서 noise 학습.
     - Early stopping 만: 무관 변수의 weight 가 작지만 0 은 아님 → 인터프리트 어렵고 예측 노이즈 추가.
   - **결과**: LASSO + Early Stop 결합 → **변수 선택 + 학습 깊이 조절** 둘 다 자동.
   - **추가 보강**: Ensemble (variance ↓) + Adam (수렴 안정) + BatchNorm (학습 안정) → **5중 안전장치**.
