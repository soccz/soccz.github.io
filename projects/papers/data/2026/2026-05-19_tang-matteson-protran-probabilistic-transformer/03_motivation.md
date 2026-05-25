# 03 Motivation — Section 1 Introduction

## 적용 분야

paper p.1:
> Generative modeling of multivariate time series is a challenging problem with wide-ranging applications in demand forecasting [15, 76], autonomous driving [2, 16], robotics [29, 67], and health care [20, 21, 59].

4가지 응용 — 구체적 예시까지:

| 분야 | 구체 task | 왜 probabilistic 이 필요? |
|------|----------|------|
| **Demand forecasting** | 마트의 다음 주 우유 판매량 예측 | "정확한 한 숫자" 보다 "범위" 가 재고 결정에 결정적 |
| **Autonomous driving** | 보행자의 다음 1초 trajectory | 보행자가 길을 건널지 멈출지 — 다양한 가능성 모두 평가 필요 |
| **Robotics** | 로봇 팔의 다음 동작 | 환경 noise + 센서 noise → 단일 prediction 위험 |
| **Health care** | 환자의 혈압 패턴, 병의 진행 | 다양한 임상 시나리오에 대한 확률 평가 |

→ 4 분야 모두 **확률 분포 출력** 이 단일 point prediction 보다 가치 있음. ProTran 의 출발점.

ProTran 자체는 forecasting + motion 만 실험. 그러나 framework 는 위 4 영역 모두 transfer 가능.

---

## 핵심 challenge

paper p.1:
> Despite remarkable progress in recent years, models that predict high-dimensional future observations from a few past examples have remained intractable, partly due to the complex, non-deterministic temporal dynamics across long-distance time steps.

**High-dimensional + Long-distance + Non-deterministic** 의 3중 trouble.

paper 의 구체적 예 (인간 motion):
> Given a sequence of human poses, for example, such models must internally figure out the involved dynamics of various body components across space and time while maintaining the inherent uncertainty of multiple plausible futures, even though only one such future is observed.

→ 17-joint skeleton × 시간 시퀀스 × 미래는 단 하나만 관측 — 학습 시 model 이 multiple plausible 을 "상상" 해야.

---

## SSM 의 매력 + 한계

paper p.1:
> Among proposed probabilistic approaches, state space models (SSMs) provide a principled framework for learning and drawing inference from sequential inputs [27, 66].

**SSM 의 장점**:
- Probabilistic (uncertainty 표현)
- Latent variable 로 abstract state 학습
- "Efficient state-to-state sampling without the need to render high-dimensional observations" → high-dim 출력 회피 가능

**SSM 의 가장 단순한 형태**: Linear Dynamical System (LDS):
> Gaussian linear dynamical systems (LDSs), one of the best known SSMs [92], for example, postulate linear state transitions and enjoy exact inference via the celebrated Kalman filter algorithm.

LDS 가 가진 두 한계:
1. **Markovian dynamics**: $z_t$ 는 $z_{t-1}$ 만 의존
2. **Linear transitions**: nonlinear 시스템 표현 못함

---

## 기존 deep SSM 의 시도

paper p.1:
> Some approaches retain the Markovian dynamics of LDSs and only replace their linear observation models with feed-forward networks [23, 31, 47, 71], whereas others favor nonlinear state transitions and parametrize such dependencies via recurrent neural networks (RNNs) [22, 23, 30, 39, 51, 75].

**기존 시도들의 두 갈래**:
1. **Linear transition + neural emission**: KVAE (Fraccaro 2017), NKF (de Bézenac 2020).
2. **RNN transition**: VRNN (Chung 2015), DKS (Krishnan), VPN (Hafner 2019).

**기존의 한계**:
> Despite differences, both Markovian transitions and RNNs are often not capable of capturing long-range dependencies in highly structured sequential inputs [36, 100], limiting the capacity of the corresponding SSMs.

→ Markovian 도 한계, RNN 도 한계 (gradient vanishing). 둘 다 long-range dependency 약점.

### "Gradient vanishing" 이 뭔가요?

**비유**: RNN 학습 시 gradient 가 시간 거꾸로 전달되는데, 매 step 마다 **곱셈** 으로 줄어듦. 예를 들어 매 step gradient 가 0.5 배 줄면, 10 step 뒤엔 $0.5^{10} \approx 0.001$ — 사실상 0.

**결과**: 100 step 떨어진 과거 정보가 현재 학습에 거의 영향 못 줌. **장기 의존성 학습 불가능**.

**LSTM/GRU 가 부분 해결**했지만 완전히 못 끝냄. ProTran 의 답: "**RNN 자체를 버리고 attention 으로 모든 시점 직접 연결**" → gradient 가 시간 따라 곱셈 누적되지 않음.

---

## 본 paper 의 답 — SSM + Transformer

paper p.2:
> In this work, we propose to combine the complementary strengths of SSMs and transformer architectures [85], a powerful mechanism for modeling long-term interactions that enjoys success across a variety of sequence modeling tasks [26, 48, 99]. In contrast to most SSMs, our models make extensive use of attention mechanism [5, 85] between latent variables to model non-Markovian dynamics (see Figure 1).

**핵심 아이디어**:
- SSM 의 latent + probabilistic 장점 유지
- RNN 대신 Transformer attention 으로 long-range 학습
- Attention 을 **latent space** 에 직접 적용 (paper 가 강조)

paper:
> Compared to transformer-based methods, our models are probabilistic, non-autoregressive in a similar fashion to LDSs, and capable of generating diverse long-term forecasts with uncertainty estimates.

**Transformer-based forecasting (Informer, Autoformer 등) 와 차별점**:
1. Probabilistic (variational latent)
2. Non-autoregressive (한 번에 전체 시퀀스 생성 가능)
3. Uncertainty estimates 명시

---

## 3 가지 Main Contributions (paper p.2)

paper:
> Our main contributions are threefold.
>
> First, we propose novel SSMs based on transformer architectures for multivariate time series, which include generative models and inference procedures based on variational inference [49, 74].
>
> Second, we extend our models to include several layers of stochastic latent variables organized in a hierarchy for further expressiveness.
>
> Third, we conduct extensive experiments on time series forecasting and human motion prediction and demonstrate that our Probabilistic Transformer (ProTran) performs remarkably well compared to various state-of-the-art baselines.

3 contribution:
1. **Novel SSM + Transformer**: generative + inference 모두 variational.
2. **Hierarchical extension**: L layers of latent variables.
3. **Empirical SOTA**: forecasting + motion 양쪽.

---

## Fig 1 — 본 paper 의 핵심 그림

![Fig. 1 Graphical models](figures/Fig1_graphical_models.png)

(Figure 1, paper p.2)

paper caption:
> Graphical model representations of linear dynamical systems (LDSs) in (a), and our proposed models (ProTran) in (b), (c), and (d). Black arrows denote the generative mechanism and red arrows the inference procedure. The separation of generation and inference in (c) and (d) is for readability. While traditional SSMs such as LDSs are limited to Markovian dynamics and linear dependencies, our models allow for non-Markovian and non-linear interactions between time steps via attention mechanism. A multi-layer extension of our models further increases expressiveness without compromising the tractable inference procedure.

4 panel:
- (a) LDS: $z_{t-1} \to z_t \to z_{t+1}$ (Markovian chain)
- (b) ProTran 1-layer: $z_{t+1}$ 가 $z_{1:t}$ 모두에서 attention (non-Markovian)
- (c) ProTran 3-layer Generation: 3 stochastic layers stacked
- (d) ProTran 3-layer Inference: 같은 3 layers, red arrows (inference 방향)

→ paper 의 visual signature.

---

## 본 motivation 의 미학

3 contribution 의 직교성:
- **Method (SSM + Transformer)**: framework 의 novelty.
- **Hierarchy**: capacity scaling.
- **Empirics**: two domains (forecasting + motion).

각 contribution 이 명료히 분리되어 ablation 으로 검증 가능 (Table 2).

또한 paper 의 자기 평가가 정직:
- "non-autoregressive **in a similar fashion to LDSs**" — LDS 의 정신을 따른다고 명시.
- Transformer-based + SSM-based 양쪽의 한계를 동시에 인정.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **"High-dimensional + Long-distance + Non-deterministic" 3중 trouble 이 인간 motion 의 예에서 각각 어떻게 나타나는가?**
2. **기존 deep SSM 의 두 갈래와 각각의 한계는?**
3. **paper 가 RNN 을 완전히 제거하는 두 가지 정당화는?**

### 답변

1. **High-dimensional**: 17-joint skeleton (각 joint 3D × 17 = 51 차원 / frame). **Long-distance**: 50Hz × 수 초 = 수백 frame. **Non-deterministic**: 같은 motion start 에서 다음 1초가 multiple plausible (걷기 → 멈춤 / 회전 / 가속, ...). 학습 시 ground truth 는 하나만 관측되는데 모델은 multiple 을 internally 표현해야.
2. (a) **Linear transition + neural emission** (KVAE, NKF): linear 가 nonlinearity 제약. (b) **RNN nonlinear transition** (VRNN, DKS): gradient vanishing 으로 장거리 의존성 약함. → 둘 다 long-range dependency 약점.
3. (a) **Long-range dependency**: RNN 의 gradient vanishing 으로 장거리 학습 어려움 — attention 으로 모든 시점 직접 연결. (b) **Information leakage**: autoregressive observation feeding 이 test time error accumulation 야기 — non-autoregressive latent-based generation 으로 회피.

다음 [04_preliminaries_ssm.md](04_preliminaries_ssm.md) 에서 Variational SSM 의 수식 (Eq 1-3).
