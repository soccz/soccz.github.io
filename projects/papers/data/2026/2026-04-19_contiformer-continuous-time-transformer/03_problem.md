## 2. 문제 지형도

### 풀고자 하는 문제

**비정규 시계열(irregular / asynchronously-sampled time series)** 의 표현 학습. 입력은 길이가 가변이고, 관측 시각 $\{t_i\}$가 등간격이 아니다 (의료 EHR, ICU 모니터, 금융 tick, 인간 활동 센서). 목표는 (a) **interpolation** — 미관측 시각의 값 추정, (b) **classification** — 시퀀스 라벨, (c) **prediction** — 미래 시각의 값 예측. 핵심 어려움은 두 토큰 사이의 시간 간격 $\Delta t = t_j - t_i$ 가 정보로 살아 있어야 하면서, 동시에 멀리 떨어진 두 관측 사이의 의미적 관계도 잡아야 한다는 것.

### 기존 접근 계보 (연대순)

1. **RNN-기반 마스킹/decay** — GRU-D (Che et al., 2018): 결측·간격을 input mask와 exponential decay로 처리. 등간격 가정의 패치, 장거리 의존성에 약함.
2. **Neural ODE / ODE-RNN** — Chen et al. (2018), Rubanova et al. (2019): hidden state를 $dh/dt = f_\theta(h, t)$ 로 연속 진화시켜 임의 $t$에서 평가. 시간 흐름은 자연스러우나, 단일 trajectory라 token-간 attention-식 상호작용 부재.
3. **Latent ODE / Neural CDE** — Kidger et al. (2020): controlled differential equation으로 입력을 vector field로 흡수. 수학적으로 우아하지만 여전히 단일 hidden state.
4. **mTAND / SeFT / Multi-time Attention** — Shukla & Marlin (2021): query 시각마다 가까운 관측에 soft attention. 시간이 cross-attention의 *bias*로 들어감, 그러나 token 임베딩 자체는 이산.
5. **Transformer + time embedding** — Time2Vec, Informer, FEDformer 등: 시각을 sinusoidal/learnable embedding으로 더해 query/key에 주입. 본질적으로 인덱스 모델.

### 기존 방법의 부족 지점

- ODE 계열: **token-간 명시적 상호작용**(attention pattern) 부재, soft retrieval이 약함.
- Transformer 계열: **시각을 feature 차원에 더하는 첨가물**로만 다룸 — 두 토큰의 관계가 *시간의 함수* $\rho(t)$ 가 아니라 학습된 상수 행렬의 한 항.
- mTAND: query 시각은 연속이지만 key/value는 이산 관측 그대로.

### 이 논문이 메우는 gap

ContiFormer는 **(query, key, value) 셋 모두를 시간의 함수**로 들어 올린다. 결과적으로 attention map $\alpha_{ij}$ 가 행렬이 아니라 함수 $\alpha_i(t)$ 가 되어 "시각 $t$에서의 관계 강도" 자체가 학습 대상이 된다. 이는 위 5계보를 모두 한 우산 아래 두는 통일적 frame이라는 **이론적 야심**을 가진다 — 그래서 expressive power 정리(특수해 환원)가 핵심 contribution으로 따라온다.
