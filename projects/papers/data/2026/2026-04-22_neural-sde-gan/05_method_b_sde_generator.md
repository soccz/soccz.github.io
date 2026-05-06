# 05b · Neural SDE 생성자

> **배경 사다리**: 이 파일의 핵심은 SDE이다. ① 미분방정식(ODE)은 "변화율 = 결정론적 함수"이다. ② SDE는 거기에 "확률적 진동"을 더한 것이다. ③ 브라운 운동 $W_t$는 각 순간 임의 방향으로 아주 작게 진동하는 랜덤 경로이다. 이 세 가지만 알면 된다.

---

## 1. 왜 SDE를 생성자로 쓰는가?

경로를 생성하는 방법으로는 크게 두 가지가 있다:
1. **이산 순환 모델** (LSTM, GRU): 각 시점의 다음 값을 이전 값에서 예측. 시간 격자가 고정.
2. **연속 시간 모델** (ODE/SDE): 연속 변화율을 정의하고 적분. 시간 격자 자유.

금융 시계열에서 ODE만으로는 불충분하다. 주가 경로의 불확실성(랜덤성)을 표현하려면 **확률 항**이 필요하다. SDE가 그 도구다.

ODE와 SDE의 차이를 한 줄로:

$$\underbrace{dy = f(t,y)\,dt}_{\text{ODE: 결정론적 경로}} \quad \longrightarrow \quad \underbrace{dY = \mu(t,Y)\,dt + \sigma(t,Y)\,dW}_{\text{SDE: 확률적 경로}}$$

---

## 2. Neural SDE의 정의

$$dY_t = \mu_\theta(t, Y_t)\,dt + \sigma_\theta(t, Y_t)\,dW_t, \quad Y_0 \sim p_0$$

**기호 뜻**:
- $Y_t \in \mathbb{R}^d$: 시각 $t$에서의 잠재 상태 벡터 (예: 4차원이면 4개 종목의 잠재 상태)
- $\mu_\theta: [0,T] \times \mathbb{R}^d \to \mathbb{R}^d$: 드리프트 함수 (신경망 파라미터 $\theta$)
- $\sigma_\theta: [0,T] \times \mathbb{R}^d \to \mathbb{R}^{d \times m}$: 확산 행렬 (신경망 파라미터 $\theta$)
- $W_t \in \mathbb{R}^m$: $m$차원 표준 브라운 운동
- $p_0$: 초기 분포 (주로 $\mathcal{N}(0, I)$)

**일상 비유**: 드리프트 $\mu$는 "풍향계" — 현재 위치에서 어느 방향으로 흐르는지. 확산 $\sigma$는 "바람의 세기" — 얼마나 많이 흔들리는지. 브라운 운동 $dW_t$는 "돌풍" — 방향과 크기가 매 순간 랜덤. 배가 항해할 때 풍향계+돌풍의 합으로 실제 경로가 결정된다.

**왜 이 형태**: 이토 공식(Itô's formula)에 의해 SDE의 해(solution)는 확률과정의 경로 공간 $C([0,T]; \mathbb{R}^d)$에 분포를 유도한다. 이 분포를 $\mathbb{P}_\theta$라고 하면, 생성자의 학습 = $\mathbb{P}_\theta$를 실제 데이터 분포 $\mathbb{P}_\text{real}$에 가까워지도록 $\theta$를 조정하는 것이다.

**조심할 점**: 이토 적분 $\int \sigma\,dW$는 Riemann 적분과 다르다. 이토 공식에서는 2차 변동(quadratic variation) 항이 생기므로, 고전 적분처럼 쉽게 계산되지 않는다. 수치 계산에서는 Euler-Maruyama 또는 Milstein 방법을 사용한다.

---

## 3. 수치 적분: Euler-Maruyama

$$Y_{t_{k+1}} \approx Y_{t_k} + \mu_\theta(t_k, Y_{t_k})(t_{k+1} - t_k) + \sigma_\theta(t_k, Y_{t_k})(W_{t_{k+1}} - W_{t_k})$$

**기호 뜻**:
- $t_0 < t_1 < \cdots < t_K = T$: 이산 시간 격자
- $W_{t_{k+1}} - W_{t_k} \sim \mathcal{N}(0, (t_{k+1}-t_k) \cdot I)$: 브라운 증분 (정규분포 샘플)

**일상 비유**: 한 시간 간격으로 배의 위치를 업데이트하는 내비게이션. 현재 방향(드리프트)으로 이동하고, 거기에 랜덤 바람(브라운 증분)을 추가. 시간 간격이 작을수록 정확해진다.

**왜 이 형태**: 가장 단순한 SDE 수치해법. 오차 $O(\sqrt{\Delta t})$. Milstein 방법은 $O(\Delta t)$이지만 확산 함수의 미분이 필요해 계산 복잡도가 높다.

**조심할 점**: 스텝 크기 $\Delta t = t_{k+1} - t_k$가 클수록 수치 오차가 커진다. 또한 확산 계수 $\sigma$의 크기가 크면 경로가 불안정해져 학습이 어렵다.

---

## 4. 잠재 SDE vs. 출력 디코딩

논문에서는 SDE가 **잠재 공간(latent space)**에서 돌아가고, 관측 공간으로의 디코딩은 별도 신경망 $g_\theta: \mathbb{R}^e \to \mathbb{R}^d$로 처리한다:

$$\tilde{Y}_t = g_\theta(Y_t)$$

**기호 뜻**:
- $Y_t \in \mathbb{R}^e$: 잠재 상태 ($e$가 관측 차원 $d$보다 클 수 있음)
- $\tilde{Y}_t \in \mathbb{R}^d$: 관측 공간으로 사영된 생성 경로

이 디자인은 SDE의 표현력(잠재 공간에서 복잡한 동역학)과 관측 공간의 해석 가능성을 분리한다.

---

## 5. 대안과 비교

| 대안 | 차이점 | 이 논문이 SDE를 선택한 이유 |
|------|--------|--------------------------|
| Neural ODE (결정론적) | 확산 항 없음 | 시계열의 확률적 변동을 표현 못함 |
| VAE (변분 오토인코더) | 잠재 변수 이산, 경로 ELBO | 경로 공간에서 명시적 분포 없음 |
| Normalizing Flow | 역방향 흐름 필요 | 경로 공간에 적용 어려움 |
| Diffusion Model | 역방향 SDE 필요 | 이 논문과 다른 방향 (생성 vs. 잡음 제거) |

---

## 6. 이 블록의 핵심 한 문장

> **드리프트 $\mu_\theta$와 확산 $\sigma_\theta$를 신경망으로 파라미터화한 SDE는 경로 공간의 임의 확률 분포를 유연하게 표현하는 연속-시간 생성자이며, Euler-Maruyama 이산화로 미분 가능하게 구현된다.**

> **[다음 파일]** → [05_method_c_cde_discriminator.md](05_method_c_cde_discriminator.md)
