# 05d · 학습 프로토콜

> **배경 사다리**: ① WGAN(Wasserstein GAN)이 "판별자가 두 분포 사이의 Wasserstein 거리를 추정하는 GAN"이라는 것. ② Gradient Penalty가 "판별자의 기울기 크기를 1에 가깝게 강제하는 정규화"라는 것. 이 두 가지면 이 파일을 따라갈 수 있다.

---

## 1. 목적 함수

이 논문은 **WGAN-GP** (Wasserstein GAN with Gradient Penalty, Gulrajani et al. 2017)를 사용한다.

$$\mathcal{L}(\theta, \phi) = \underbrace{\mathbb{E}_{X \sim \mathbb{P}_\text{real}}[D_\phi(X)]}_{\text{진짜 경로에서의 판별 점수 평균}} - \underbrace{\mathbb{E}_{Y \sim \mathbb{P}_\theta}[D_\phi(Y)]}_{\text{가짜 경로에서의 판별 점수 평균}} + \underbrace{\lambda \cdot \mathbb{E}_{\hat{X}}[(\|\nabla_{\hat{X}} D_\phi(\hat{X})\| - 1)^2]}_{\text{Gradient Penalty}}$$

**기호 뜻**:
- $\mathbb{P}_\text{real}$: 진짜 경로 데이터 분포
- $\mathbb{P}_\theta$: 생성자 Neural SDE가 만드는 가짜 경로 분포 (파라미터 $\theta$에 의존)
- $D_\phi$: 판별자 Neural CDE (파라미터 $\phi$에 의존)
- $\hat{X}$: 진짜 경로와 가짜 경로를 랜덤 비율로 섞은 보간 경로
- $\lambda > 0$: 페널티 가중치 (논문에서 $\lambda = 10$)

**일상 비유**: 위조지폐 감별 훈련. 첫 번째 항은 "진짜 지폐를 높게 평가". 두 번째 항은 "가짜 지폐를 낮게 평가". 세 번째 항(GP)은 "감별사의 판단 기준이 너무 극단적이지 않도록 제어" — 기울기가 1 근처여야 Wasserstein 거리를 올바르게 추정할 수 있기 때문.

**왜 이 형태**: 기본 GAN의 손실 함수 $\log D + \log(1-D)$는 진짜/가짜를 0/1로 분류하려 하므로 판별자가 너무 강해지면 생성자 기울기가 소실된다. WGAN은 분류 대신 점수 차이를 최대화해 이 문제를 피한다. GP는 gradient clipping보다 안정적인 방법으로 Lipschitz-1 제약을 강제한다.

**조심할 점**: GP는 $\hat{X}$에서만 기울기 제약을 걸므로, 전체 경로 공간에서 Lip-1이 보장되지 않는다. 특히 생성자가 만드는 경로가 훈련 데이터와 크게 다른 구간에서는 판별자가 Lip-1 조건을 어길 수 있다.

---

## 2. 훈련 루프

```python
for iteration in range(num_iterations):
    # 1. 판별자 업데이트 (n_critic 번)
    for _ in range(n_critic):
        X_real = sample_real_data(batch_size)
        z = sample_noise(batch_size)
        Y_fake = sde_generate(theta, z)  # Neural SDE 적분
        
        D_real = neural_cde_discriminate(phi, X_real)   # CDE 적분
        D_fake = neural_cde_discriminate(phi, Y_fake)   # CDE 적분
        
        # 보간 경로
        eps = uniform(0, 1)
        X_hat = eps * X_real + (1 - eps) * Y_fake
        grad = gradient(neural_cde_discriminate(phi, X_hat), X_hat)
        gp = (norm(grad) - 1)^2
        
        L_D = -D_real.mean() + D_fake.mean() + lambda * gp.mean()
        update(phi, L_D, maximize=True)
    
    # 2. 생성자 업데이트 (1번)
    z = sample_noise(batch_size)
    Y_fake = sde_generate(theta, z)
    D_fake = neural_cde_discriminate(phi, Y_fake)
    
    L_G = -D_fake.mean()  # 판별자를 속이는 방향
    update(theta, L_G, maximize=False)
```

`n_critic = 5` (판별자가 생성자보다 5배 더 자주 업데이트) — WGAN 표준 설정.

---

## 3. SDE 역전파: 수반 방법 (Adjoint Method)

생성자 업데이트 시 $\frac{\partial \mathcal{L}}{\partial \theta}$를 계산해야 한다. SDE $Y_T$는 $\theta$에 미분 가능한가?

**Li et al. 2020 (arXiv:2001.01328)**의 SDE 수반 방법:

$$\frac{d\mathbf{a}(t)}{dt} = -\mathbf{a}(t)^\top \frac{\partial f}{\partial y}(y(t), t, \theta)$$

여기서 $\mathbf{a}(t) = \frac{\partial \mathcal{L}}{\partial y(t)}$는 수반 상태(adjoint state). 이 ODE를 역방향으로 풀면 $\frac{\partial \mathcal{L}}{\partial \theta}$를 메모리 효율적으로 계산할 수 있다.

SDE 경우에는 확률 항이 추가되어 역방향 SDE도 풀어야 하지만, Euler-Maruyama 이산화 하에서는 표준 역전파(backpropagation through time, BPTT)가 적용 가능하다.

---

## 4. 하이퍼파라미터 요약

| 항목 | 값 | 비고 |
|------|------|------|
| SDE 스텝 수 | 50–100 | 데이터 길이에 의존 |
| 판별자 업데이트 비율 ($n_\text{critic}$) | 5 | WGAN 표준 |
| GP 가중치 ($\lambda$) | 10 | WGAN-GP 표준 |
| 배치 크기 | 64 | |
| 옵티마이저 | Adam ($\beta_1=0, \beta_2=0.9$) | WGAN 권장 설정 |
| 학습률 | $1 \times 10^{-4}$ | |
| 잠재 차원 ($e$) | 8–16 | 데이터 차원에 의존 |

---

## 5. 이 블록의 핵심 한 문장

> **WGAN-GP 손실 + 수반 역전파의 조합이 Neural SDE 생성자와 Neural CDE 판별자를 안정적으로 공동 학습하게 하며, $n_\text{critic}=5$ 비율로 판별자를 더 자주 업데이트하는 것이 학습 안정성의 핵심이다.**
