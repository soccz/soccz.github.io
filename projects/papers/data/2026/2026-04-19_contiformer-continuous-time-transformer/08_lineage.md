## 7. 이론적 계보

### 7.1 이론적 조상

1. **Neural ODE — Chen et al. (NeurIPS 2018)**: hidden state $h(t)$를 ODE로 진화. ContiFormer의 $z_i(t)$는 직계 후손. Adjoint method로 메모리 효율 backprop.
2. **Latent ODE / ODE-RNN — Rubanova et al. (NeurIPS 2019)**: ODE를 비정규 시계열에 처음 본격 적용. ContiFormer는 이 구조의 단일 trajectory 한계를 token-별 trajectory + attention으로 극복.
3. **Neural CDE — Kidger et al. (NeurIPS 2020)**: 입력 자체를 vector field에 흡수 (controlled differential equation). ContiFormer는 입력을 임베딩 후 ODE로 lift — CDE의 "input as control"보다 약하지만 attention과 호환 쉬움.
4. **Multi-time Attention (mTAND) — Shukla & Marlin (ICLR 2021)**: query를 시간 함수로 두는 첫 시도. ContiFormer는 query뿐 아니라 key/value까지 시간함수로 — mTAND의 자연스러운 일반화.

### 7.2 평행 연구 (비슷한 시기, 유사 방향)

1. **TADA / TimesNet (2023)**: 시계열의 다중 주기를 명시 — 비정규성보다 다중 스케일에 초점. ContiFormer와 직교.
2. **PrimeNet (Chowdhury et al., 2023)**: irregular TS contrastive pretraining. ContiFormer는 supervised, PrimeNet은 self-supervised — 결합 가능.
3. **CRU (Continuous Recurrent Unit, Schirmer et al., ICML 2022)**: Kalman-style continuous filtering + recurrence. ContiFormer 대비 Bayesian 입장이 강함.
4. **STraTS / SeFT (2022)**: triplet (time, variable, value) 형태로 sparse multivariate를 처리. ContiFormer는 dense embedding 후 ODE — 입력 표현이 다름.

### 7.3 후손 예측 (파생될 수 있는 방향)

1. **Continuous SDE-Transformer**: deterministic ODE를 SDE로 일반화 → uncertainty quantification 자연 도입. 금융 변동성 모델링에 직접 유용. (실제로 2024-2025 일부 follow-up 등장 추정.)
2. **시간 변환 기반 ContiFormer (Time-changed ContiFormer / Paper 4 line)**: ODE의 독립변수 $t$를 economic time $\tau(t)$로 치환. Clark (1973) subordination + Bochner 정리와 결합.
3. **Sparse / efficient ContiFormer**: full attention의 $O(N^2)$를 시간적 locality로 줄이는 sliding-window 또는 routing mechanism. ODE solve와 결합 시 NFE 절감 큰 도전.
4. **State-space hybrid**: S5 / Mamba의 효율성과 ContiFormer의 attention 표현력을 합치는 설계 — irregular TS의 새로운 SOTA 후보.
