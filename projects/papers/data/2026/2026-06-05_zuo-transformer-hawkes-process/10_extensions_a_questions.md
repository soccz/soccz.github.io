# 10_extensions_a — 사고 확장: 자문 질문 5개

> 본 논문을 읽은 사람이 자기 연구나 응용에 적용할 때 반드시 물어야 할 질문 5개. 각 질문마다 "왜 이 질문이 중요한가" 를 2-3 줄로 답.

---

## Q1. THP 의 강도 헤드가 시간선형(linear in $t - t_j$) + softplus 라는 단순한 형태인데, **사건 사이 강도가 U-shape (감쇠 후 재상승) 인 도메인** (예: refractory period 가 있는 신경 spike, "쿨다운" 후 재가동되는 거래 시스템) 에서 THP 가 어떻게 fail 하는가? 만약 fail 한다면 어떻게 진단할 수 있는가?

**왜 중요한가?** THP 의 자랑 — closed-form 강도 — 의 정확한 trade-off 가 표현력 한계다. 한 사건 사이에서 강도가 비단조여야 하는 도메인은 NHP 의 continuous-time LSTM 처럼 ODE-like 강도가 더 적합할 수 있다. 그 한계의 정확한 진단 (예: synthetic U-shape Hawkes 에서 학습된 강도와 진짜 강도의 KL) 이 표현력 vs 효율의 정량적 비교를 가능하게 한다. 이게 안 풀리면 THP 는 "Hawkes 패러다임의 transformer 단순 대체" 이상으로 발전하기 어렵다.

## Q2. THP 의 sinusoidal time encoding 이 **데이터셋 시간 단위 (초/분/일/ms) 에 어느 정도 robust 한가**? 같은 시퀀스를 초 단위로 표현 vs ms 단위로 표현했을 때 학습된 강도가 동치인가, 아니면 시간 단위가 강도의 학습 가능 dynamics 를 바꾸는가?

**왜 중요한가?** 저자 README 가 직접 "RMSE 단위 불일치 경고" 를 명시 — 단위 의존성이 모델 의 fundamental 특성. 만약 단위에 강건하다면 THP 는 cross-domain transfer 가능 (의료 분 단위 → 금융 ms 단위 transfer). 만약 단위에 sensitive 하다면 각 도메인마다 specialize 한 retrain 필수. 이 답은 THP 가 "범용 점과정 모델" 인지 "단위 specific 모델" 인지를 직접 결정.

## Q3. THP 의 4-head × 4-layer attention 중 어느 head 가 **자기-자극 trigger** (직전 같은 type 사건) 를 학습하고, 어느 head 가 **mutual-excitation** (다른 type cross-trigger) 를 학습하고, 어느 head 가 **분포 평탄화** (baseline μ 의 평균효과) 를 학습하는가? Head specialization 이 자연어 transformer (Voita 2019) 처럼 일어나는가?

**왜 중요한가?** Mech interpretability 의 정통 질문. THP 가 attention 의 학습 가능성으로 NHP 를 이긴다는 가설(Claim 1) 이 옳다면 head 별 specialize 가 관찰되어야 함. 만약 head 가 모두 같은 패턴 학습 (homogeneous) 이면 THP 의 4-head 가 redundancy → 1-head 도 충분. 이 분석은 사용자 mech-interp 관심영역 (§B) 의 직접 점과정 응용. 후속작 (Bhattacharjya 2024) 가 이 방향이지만 본격 회로 분석은 미답.

## Q4. THP 의 Monte Carlo 100-sample unbiased 적분 vs 사다리꼴 biased 적분이 **학습된 강도의 calibration** (예측된 inter-arrival 분포와 진짜 inter-arrival 분포의 KS test) 에 어떤 영향을 주는가? Biased 가 빠르지만 calibration 손실하면 trade-off 가 실용적으로 받아들일 만한가?

**왜 중요한가?** 점과정의 사용 목적이 다음 사건 시각 점 예측이 아니라 **다음 사건의 분포 quantile** (예: VaR-style "95% 확률로 다음 사건은 [t, t+T] 안") 일 때, NLL 의 절대값보다 calibration 이 직접 중요. Biased 사다리꼴이 strong calibration 손상을 주면 unbiased MC 의 100× 비용을 부담해야. 사용자가 금융 응용 (VaR, ES) 에 THP 를 쓸 때 직접 의사결정 항목.

## Q5. THP 의 self-attention 의 **O(L²)** 비용이 **L ~ 10⁵ (1 일 high-frequency 거래 도착) 시퀀스** 에 적용 가능한가? Mamba Hawkes Process (Zhang 2024, 후속작) 가 O(L) selective state space 로 같은 결과를 더 낫게 줄 수 있는가? 사용자 응용 도메인의 시퀀스 길이 분포가 어디서 THP-Mamba 결정 boundary 인가?

**왜 중요한가?** Hardware 비용 = 학술 vs 실무의 직접 경계. THP 가 NeurIPS 2017 NHP 의 RNN 한계를 깬 것처럼, Mamba Hawkes 가 THP 의 transformer 한계를 깰 수 있다면 점과정의 backbone 이 또 바뀐다. 사용자 진로 (quant industry) 에서 inference latency 제약은 모델 선택의 dominant factor — 100ms 제약 하에서 THP 가 사용 가능한 L 한계의 정확한 측정이 직접 의사결정.

---

## 질문들의 상호 관계

- **Q1, Q2** 는 강도 헤드의 표현력·robustness 의 직접 질문 — 모델 자체의 ceiling 정의.
- **Q3** 은 mech-interp 의 점과정 응용 — 사용자 active track 직결.
- **Q4** 는 학습 procedure 의 실용적 trade-off — calibration 의 정량화.
- **Q5** 는 architecture 의 미래 경쟁 (THP vs Mamba Hawkes) — 사용자 진로 직결 의사결정.

이 5 개 질문이 채워지면 THP 는 "anchor 논문" 에서 "사용자가 정확히 적용 boundary 를 아는 도구" 로 격상.
