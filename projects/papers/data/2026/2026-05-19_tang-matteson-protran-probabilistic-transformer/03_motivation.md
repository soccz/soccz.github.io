# 03 Motivation — Section 1 Introduction

## 적용 분야

paper p.1:
> Generative modeling of multivariate time series is a challenging problem with wide-ranging applications in demand forecasting [15, 76], autonomous driving [2, 16], robotics [29, 67], and health care [20, 21, 59].

4가지 응용:
- Demand forecasting (재고/수요 예측)
- Autonomous driving (자율주행 — 미래 trajectory)
- Robotics (로봇 control)
- Health care (병의 진행, 진단)

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

다음 [04_preliminaries_ssm.md](04_preliminaries_ssm.md) 에서 Variational SSM 의 수식 (Eq 1-3).
