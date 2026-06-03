# 4-D. Mixture Distribution Head — 분포 형태를 흡수하는 출력층

## 왜 이 부분이 필요한가

확률 forecasting 은 *미래값 자체* 가 아닌 *미래값의 분포* 를 출력. DeepAR (Salinas 2020) 의 표준은 *단일 분포* 가정 — Gaussian / Student-T / Negative Binomial 중 하나를 *데이터셋마다* 사전 선택. *Universal forecaster* 는 데이터셋을 처음 보므로 그 사전 선택 불가능. 한 데이터셋은 양수만(전기 사용량 — log-normal 적합), 다른 건 음수 가능(주식 수익률 — Gaussian/Student-T), 또 다른 건 정수(고객 수 — Negative Binomial), 또 다른 건 매우 좁은 분포(deterministic 신호 — low-var Normal). 단일 head 로 다 못다룬다.

저자 명시 동기 (§3.1.3): "achieve the goal of having a flexible distribution, yet ensuring that operations of sampling and evaluating the loss function remains simple."

## 핵심 수식 — Eq. (4)

$$
p(Y_{t:t+h} | \hat\phi) = \sum_{i=1}^{c} w_i \, p_i(Y_{t:t+h} | \hat\phi_i)
$$

여기서 $\hat\phi = \{w_1, \hat\phi_1, \ldots, w_c, \hat\phi_c\}$.

**4줄 해석**:

1. **기호 뜻**:
   - $Y_{t:t+h}$ = forecast horizon 의 미래값 (벡터, 길이 h).
   - $\hat\phi$ = 모델이 예측한 분포 parameter set.
   - $c$ = 컴포넌트 수 (본 논문 $c=4$).
   - $w_i \in [0,1]$, $\sum_i w_i = 1$ = mixture weights (softmax 로 구현).
   - $p_i(\cdot | \hat\phi_i)$ = $i$ 번째 컴포넌트의 p.d.f. (Student-T / log-normal / Negative Binomial / low-var Normal).

2. **일상 비유**: *"내일 매출이 얼마일지 한 종 모양으로 표현하지 말고, 종 모양 + 한쪽으로 치우친 + 양수만 + 매우 좁은 네 모양을 각각 비율 (예: 35% / 25% / 25% / 15%)로 섞어서 표현"*. 한 변수의 분포가 *고객 수* (count, 양수 정수) 면 Negative Binomial 가중치가 자동으로 커지고, *수익률* (실수) 이면 Student-T 가중치가 커진다.

3. **왜 이 형태**:
   - **Sample-able & differentiable**: mixture 는 *각 컴포넌트에서 sample* 한 후 가중치로 선택 → reparameterization 가능. NLL 계산도 컴포넌트별 NLL 의 log-sum-exp.
   - **Coverage**: 4 컴포넌트가 *대칭/비대칭/이산/연속/양수/실수* 다섯 축을 모두 다룸.
   - **Closed-form NLL**: normalizing flows, copulas 같은 대안은 더 flexible 하나 *학습 시 NLL 의 closed form 이 비싼*. mixture 는 *효율적인 NLL*.

4. **조심할 점**:
   - **Identifiability**: mixture 모델은 *컴포넌트 라벨 permutation* 에 대해 likelihood 동일 — 학습 중 $w_i$ 가 *해석 가능한 형태로 수렴* 한다는 보장 없음. 데이터셋 A 에서 $w_1$ (Student-T) 활성, 데이터셋 B 에서 $w_3$ (log-normal) 활성, 이 자동 분기가 실제로 일어나는지는 본문 정량 미보고.
   - **5 번째 분포가 필요한 경우**: zero-inflated count (예: 산업 사고 — 대부분 0, 가끔 큰 값) / bimodal (예: regime-switching) 은 4 컴포넌트로 정확히 capture 어려움.
   - **Numerical stability**: log-sum-exp 의 underflow / overflow, df>2 lower-bound (Student-T variance 정의역 보장) 같은 디테일 필요 (Appendix B.2 명시).

## 4 컴포넌트의 p.d.f. — Appendix B.2 검증

논문 Appendix B.2 에서 각 분포 명시:

### Student's t-distribution
$$
p(x; \nu, \mu, \tau) = \frac{\Gamma(\frac{\nu+1}{2})}{\Gamma(\frac{\nu}{2}) \sqrt{\pi \nu \tau}} \left(1 + \frac{1}{\nu}\left(\frac{x-\mu}{\tau}\right)^2\right)^{-(\nu+1)/2}
$$
- $\nu > 0$ = degrees of freedom (꼬리 무거움 조절), $\mu \in \mathbb{R}$ = location, $\tau > 0$ = scale.
- 본 논문: $\nu, \mu, \tau$ 모두 예측, softplus 로 양수 제약, $\nu$ 는 lower bound 2 (variance 정의역).
- 역할: *대칭 분포, fat-tail*. 일반 시계열 (수익률, 온도 변동) 의 robust default.

### Log-normal distribution
$$
p(x; \mu, \sigma) = \frac{1}{x \sigma \sqrt{2\pi}} \exp\left(-\frac{(\ln x - \mu)^2}{2 \sigma^2}\right)
$$
- $\mu \in \mathbb{R}$, $\sigma > 0$.
- 본 논문: 둘 다 예측, softplus 로 $\sigma$ 양수.
- 역할: *우측편향 양수 분포*. 경제·자연 현상 (매출, 강수량, 시장 거래량) 의 표준.

### Negative Binomial distribution (연속 확장, Awasthi 2022)
$$
p(x; r, p) \propto \frac{\Gamma(x+r)}{\Gamma(x+1)\Gamma(r)} (1-p)^r p^x
$$
- $r > 0$, $p \in [0,1]$.
- 본 논문: softplus($r$), sigmoid($p$).
- 역할: *이산 양수 (count)* — 주문수, 사고수, 환자수 등.

### Low-variance Normal distribution
$$
p(x; \mu, \sigma) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x - \mu)^2}{2 \sigma^2}\right)
$$
- $\mu$ 만 예측, $\sigma = 10^{-3}$ 고정.
- 역할: *고확신 deterministic 예측*. 거의 noise-free 한 신호 (deterministic 차임벨 등).

## 학습 손실 — NLL

$$
\mathcal{L} = - \mathbb{E}_{(Y,Z) \sim p(D)} \log p(Y_{t:t+h} | \hat\phi)
$$

mixture 의 NLL 은:
$$
-\log p(Y) = -\log \sum_{i=1}^c w_i p_i(Y | \hat\phi_i) = -\text{logsumexp}_i \{\log w_i + \log p_i(Y | \hat\phi_i)\}
$$

저자들이 NLL 학습을 *target metric* (CRPS, MAE, MSE) 학습과 *경쟁력 있다* 고 주장하는 근거는 **Awasthi et al. 2022** ("On the benefits of maximum likelihood estimation for regression and forecasting", ICLR 2022). 그 논문 정리: NLL 이 *consistent* 하게 target metric 과 align 됨 (특정 조건 하 — Bregman divergence 류 target metric).

저자 본 논문은 이를 *재증명하지 않고 인용만*. 따라서 Awasthi 가정 (target metric 의 Bregman 형태) 이 *zero-shot OOD 도메인* 에 모두 성립한다는 가정이 *implicit*.

## 단일 분포 vs Mixture — Lag-Llama 비교 (Appendix B.3)

저자들이 §B.3 에서 직접 정리한 다른 모델 비교:

- **Lag-Llama**: *Student-T 단일* — *대칭 분포만*. 비대칭 데이터 (양수만, 우측편향) 부정확. Lag-Llama 저자들도 §4.3 에서 이를 인정하고 "normalizing flows / copulas" 를 미래 작업으로 명시.
- **TimeGPT-1**: *conformal prediction* 으로 interval 구성. 도메인 constraint 무시 — *양수만 가능한 시계열에 음수 interval* 출력하는 트위터 사례 인용.
- **LLMTime**: *categorical* (LLM tokenizer 가 숫자를 string 으로 처리) — flexibility 보존. 이는 MOIRAI 와 *동등 수준 flexibility* 라고 저자들이 인정.

즉 MOIRAI 의 mixture 는 *Lag-Llama / TimeGPT 의 분포 한계를 정면 해결*, *LLMTime 과는 동등 flexibility* 지만 *효율적 NLL + 빠른 inference* 라는 차별점.

## 대안 디자인 비교

**대안 A — 단일 Student-T**: 가장 단순. 단점은 비대칭 데이터 미대응 (Lag-Llama 경로).

**대안 B — Normalizing Flow (NF) head**: 임의 분포 표현 가능. 단점은 *학습 비용 폭발*, *추론 latency 증가*, *NF 학습 안정성 어려움*.

**대안 C — Quantile regression (TFT 류)**: 분포 대신 *quantile 점들* 만 학습. CRPS 친화. 단점: 분포 구조 (꼬리, 모드) 표현 어려움.

**대안 D — Diffusion (Latent Diffusion 머리, Feng 2024)**: 매우 flexible. 단점: 학습 / 추론 매우 비쌈. 저자들 §5 Limitations 에서 "amenable to exploration of a latent diffusion architecture" 라고 *미래 작업* 으로 명시.

저자 선택의 합리성: **flexibility (5/10 → 8/10), 효율 (10/10), 안정성 (10/10), 해석 (5/10)** 의 합리적 균형. Diffusion / NF 까지 가지 않은 trade-off.

## 이 부분의 핵심 한 문장

**Mixture Distribution Head 는 "대칭/비대칭/이산/연속/양수/실수 다섯 축의 분포 이질성을 4 컴포넌트로 *coverage* 하면서 NLL closed-form 의 효율성을 유지"** — Lag-Llama 의 단일 Student-T 한계를 정면 해결, NF/Diffusion 의 비용 폭발을 회피. 한계는 *컴포넌트 분기 해석성* (어느 데이터셋에서 어느 컴포넌트가 활성?) 가 본문 미보고된 점.
