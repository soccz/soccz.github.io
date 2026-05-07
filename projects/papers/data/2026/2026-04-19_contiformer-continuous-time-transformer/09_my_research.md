## 8. 내 연구와의 연결

### 8.1 흡수할 기법 (Paper 4 직격)

- **Paper 4 (Continuous Economic Time Attention)** 의 핵심 작업은 ContiFormer의 ODE 독립변수 $t$를 **economic time** $\tau(t)$로 치환하는 것이다. 본 논문 §4 의 식 $z_i(t) = z_i(t_i) + \int_{t_i}^t f_\theta(z_i(s), s)\,ds$ 에서 측도 변환 $ds \to d\tau(s) = \mu(s)\,ds$ 를 도입하면

  $$z_i(\tau) = z_i(\tau_i) + \int_{\tau_i}^{\tau} f_\theta\!\left(z_i(\sigma), \sigma\right) d\sigma$$

  와 동치 형태를 얻는다 (Bochner subordination). 이때 $\mu(s)$ 는 거래량·변동성·정보흐름의 instantaneous rate. **본 논문 §4.2 식을 Paper 4 Lemma 2.1로 직접 인용**한다 — "ODE-based continuous embedding이 임의의 시간 측도 변환에 대해 well-defined" 임을 보이는 출발점.

### 8.2 충돌·경쟁 지점

- ContiFormer는 **vector field $f_\theta(z, s)$ 의 두 번째 인자 $s$가 곧 wall-clock time** 이라는 가정을 깐다. Paper 4의 주장은 "이 $s$가 잘못된 시계"라는 것 — 즉 본 논문의 attention 시각화·표현력 정리 일부는 $s$가 economic time일 때 *재증명되어야* 한다. 충돌은 ContiFormer를 부정하는 게 아니라 **그것의 충분조건 $s = t$를 약화**시키는 형태.
- Paper 1 (When Multiplicative Conditioning Fails) 의 논의에서는 ContiFormer가 **`tau_rope` 계열의 극단적 형태** — 즉 시간을 좌표공간에 침투시키는 가장 강한 방식 — 으로 분류 가능. 입력공간 conditioning (`concat_a`)과의 비교에서, ContiFormer 식 ODE는 *coordinate-space로 갈수록 high-volatility regime에서 absolute prediction이 좋아진다는 우리의 trade-off 가설*을 시험할 자연 후보.

### 8.3 인용 포인트 (어디에, 어떻게)

- **Paper 1 §2 (Related Work)**: "ContiFormer (Chen et al., NeurIPS 2023) takes the strongest coordinate-space conditioning by *dynamically* injecting time into the latent vector field, but does so under wall-clock time only. Our `tau_rope` retains the coordinate-space spirit while restricting parameter cost."
- **Paper 2 (Representation Utility Gap)**: ContiFormer를 *upper-bound capacity* 베이스라인으로 두고, 그러나 ranking-utility (downstream portfolio Sharpe) 에서는 우리의 단순 모델이 따라잡거나 역전한다는 gap을 강조.
- **Paper 3 (TTPA)**: ContiFormer의 attention quadrature를 TTPA의 시간 가중치 정규화 파트의 *general continuous version*으로 인용 — TTPA는 그 이산 최적 근사로 위치.
- **Paper 4 §3 (Methodology)**: 본 논문 식 (4.2)–(4.4)를 **출발 정의**로 그대로 가져오고, $t \to \tau(t)$ 치환으로 economic-time variant를 정의. §4 에서 Clark (1973) subordinated process, Zagatti et al. (2024)의 시간 변환 정리와 결합한 **Theorem 1: Time-Change Equivariance of CT-ATTN** 을 증명.

### 8.4 반면교사 지점

- **NFE 폭주의 비용 보고가 약함** — Paper 4에서는 wall-clock training time과 $\tau$-time training time을 같은 budget으로 두고 비교해 *fair benchmarking* 을 강조해야 한다. ContiFormer 표 그대로 따라가지 말 것.
- **데이터셋의 informative sampling** 문제: 금융 데이터에서 거래 빈도 자체가 정보이므로, mTAND/ContiFormer 직접 비교 시 우리는 **거래량-매칭된 control sampling** 을 별도 ablation으로 둬야 한다. ContiFormer 본문은 이를 다루지 않음.
- **금융 시계열의 야간·주말 gap**을 단일 ODE trajectory로 잇는 가정은 Paper 4의 핵심 비판 포인트로 활용 — "wall-clock ODE는 시장이 닫힌 시간에 fictitious dynamics를 학습한다."
