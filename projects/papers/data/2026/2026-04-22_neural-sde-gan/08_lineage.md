# 08 · 이론적 계보

---

## 이론적 조상 (이 논문이 직접 건 어깨)

### 조상 1 — Neural ODE (Chen et al., NeurIPS 2018, arXiv:1806.07366)

**어떤 논문인가**: 신경망의 레이어를 ODE의 이산화로 해석하고, ODE solver를 사용해 연속 깊이 신경망을 정의한 논문. 이 논문이 없었으면 Neural SDE도 없었다.

**직접 연결선**: Neural SDE의 생성자 구조 $dY = \mu_\theta\,dt$의 결정론적 부분은 정확히 Neural ODE다. SDE는 여기에 브라운 운동 항 $\sigma_\theta\,dW$를 추가한 것. 역전파를 위한 수반 방법(adjoint method)도 Neural ODE에서 가져와 SDE로 확장.

**남긴 교훈**: "연속 시간 깊이 = 미분방정식"이라는 패러다임. 이 논문의 성공이 Neural SDE, Neural CDE 등 후속 연구의 문을 열었다.

---

### 조상 2 — Neural CDE (Kidger et al., NeurIPS 2020, arXiv:2005.08926)

**어떤 논문인가**: 불규칙 시계열을 처리하는 연속-시간 순환 모델. ODE의 "시간 구동"을 "입력 경로 구동"으로 교체. LSTM보다 불규칙 관측에서 우수한 성능.

**직접 연결선**: 이 논문(Neural SDE GAN)의 판별자가 정확히 Neural CDE다. 판별자의 이론적 근거(경로 범함수 보편 근사성)가 이 논문의 정리에 의존한다. 저자 Kidger가 두 논문 모두의 1저자이므로, 자기 선행 작업을 판별자로 채용한 셈이다.

**남긴 교훈**: "입력 경로 전체를 처음부터 끝까지 읽는 CDE가 시계열 처리에 최적"이라는 아이디어.

---

### 조상 3 — Scalable Gradients for SDEs (Li et al., NeurIPS 2020, arXiv:2001.01328)

**어떤 논문인가**: SDE를 역전파로 학습하기 위한 수반 방법(adjoint sensitivity)을 개발. SDE의 log-likelihood를 효율적으로 최적화하는 프레임워크.

**직접 연결선**: Neural SDE GAN의 생성자 학습은 이 논문의 SDE 역전파 기술에 의존한다. WGAN 손실에서 $\partial\mathcal{L}/\partial\theta$를 계산할 때 수반 방법을 사용.

**남긴 교훈**: "SDE를 미분 가능하게 만드는 수학"이 논문.

---

### 조상 4 — WGAN-GP (Gulrajani et al., NeurIPS 2017)

**어떤 논문인가**: Wasserstein GAN의 Lipschitz 제약을 gradient clipping 대신 gradient penalty로 구현한 논문. 훈련 안정성을 크게 향상시켜 이후 GAN 훈련의 표준이 됨.

**직접 연결선**: 이 논문의 목적 함수와 훈련 알고리즘이 WGAN-GP를 그대로 사용. 경로 공간으로 확장한 것이 기여.

---

## 평행 연구 (비슷한 시기, 다른 접근)

### 평행 1 — TimeGAN (Yoon et al., NeurIPS 2019)

**다른 점**: 이산 RNN 기반. supervised loss를 추가해 안정화. 이론적 근거 없음.

**누가 이겼나**: 수치 지표에서 Neural SDE GAN이 동등하거나 우세. 하지만 TimeGAN은 구현이 단순하고 튜닝이 쉬워 실용에서 더 널리 사용된다. "이론적 우아함 vs. 실용적 단순함"의 트레이드오프.

---

### 평행 2 — Score-Based Generative Modeling (Song et al., ICLR 2021, arXiv:2011.13456)

**다른 점**: 정방향 노이즈 추가 + 역방향 SDE로 복원. GAN이 아닌 Langevin dynamics/score matching 접근. 이미지 생성에서 혁명적 성과.

**왜 이 논문이 다른 영역에서 상대보다 나은가**: 시계열 경로 생성에서는 역방향 SDE 접근이 시간 조건화를 복잡하게 만든다. Neural SDE GAN은 순방향 생성이라 시간 해석이 직관적이다. 반면 고품질 이미지 생성에서는 Diffusion이 GAN을 압도.

---

## 후손 예측 (파생 연구 방향)

### 후손 1 — Latent SDEs with Economic Time (실제로 없음, 예측)

Clark (1973)의 subordinated process 아이디어와 결합: $dY_\tau = \mu_\theta(\tau, Y_\tau)\,d\tau + \sigma_\theta(\tau, Y_\tau)\,dW_\tau$ 에서 $\tau = \tau(t)$를 거래량 기반 시간으로 교체. 이는 사용자의 Paper 4와 직접 연결된다.

### 후손 2 — Rough Neural SDE

브라운 운동 $W_t$ 대신 fractional Brownian motion $W^H_t$ ($H \neq 1/2$)을 사용. 금융에서 변동성의 러프 경로(Rough volatility, Gatheral et al. 2018)와 연결되며, 더 현실적인 팻테일과 장기 기억을 표현 가능.

### 후손 3 — Conditional Neural SDE GAN

조건부 생성(conditional generation): 시장 레짐 변수나 매크로 지표를 조건으로 받아 그에 맞는 경로 분포를 생성. 리스크 시나리오 생성(stress testing)에 직접 응용 가능.
