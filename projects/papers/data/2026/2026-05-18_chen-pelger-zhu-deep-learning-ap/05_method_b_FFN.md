# 05b. Section II.B — Feedforward Network (FFN)

> Section II.B (paper p.14–15) — FFN 의 4가지 활용.

## 5b.1 챕터 한 줄 요약

Feedforward Network — covariates $x = [I_t, I_{t,i}]$ 의 비선형 함수 $y = f(x)$ 추정. ReLU activation, 다층. **4가지 활용**: (1) SDF weights $\omega$, (2) conditioning $g$, (3) conditional mean $\mu$ (forecasting), (4) loadings $\beta$ via $\mathbb{E}_t[F_{t+1} R^e_{t+1,i}]$.

---

## 5b.2 FFN 의 정의

paper p.14:
> "A feedforward network (FFN) is a flexible non-parametric estimator for a general functional relationship $y = f(x)$ between the covariates $x$ and a variable $y$."

**왜 FFN?**
- Universal approximation: 충분히 크고 깊으면 어떤 연속 함수도 근사.
- **Interaction effects** 자동 학습 — kernel/spline 같은 additive 가정 없음.

---

## 5b.3 4가지 활용

paper p.14 본문:
> "We will consider four different FFNs: For the covariates $x = [I_t, I_{t,i}]$ we estimate (1) the optimal weights in our GAN network ($y = \omega$), (2) the optimal instruments for the moment conditions in our GAN network ($y = g$), (3) the conditional mean return ($y = \mathbb{E}_t[R^e_{t+1,i}]$) and (4) the second moment ($y = \mathbb{E}_t[R^e_{t+1,i} F_{t+1}]$) to obtain the SDF loadings $\beta_{t,i}$."

| 활용 | 입력 | 출력 | 사용처 |
|-----|-----|------|--------|
| (1) | $[I_t, I_{t,i}]$ | $\omega_{t,i}$ | SDF network |
| (2) | $[I_t, I_{t,i}]$ | $g(I_t, I_{t,i})$ | Conditional network |
| (3) | $[I_t, I_{t,i}]$ | $\mu_{t,i} = \mathbb{E}_t[R^e]$ | FFN benchmark (GKX 2020) |
| (4) | $[I_t, I_{t,i}]$ | $\mathbb{E}_t[F R^e]$ | β recovery for GAN |

---

## 5b.4 1-layer FFN 의 수학

paper p.14–15:
- 입력: $x = x^{(0)} \in \mathbb{R}^{K^{(0)}}$
- Hidden layer:
$$
x^{(1)} = \mathrm{ReLU}(W^{(0)\top} x^{(0)} + w_0^{(0)})
$$
- Output:
$$
y = W^{(1)\top} x^{(1)} + w_0^{(1)}
$$

**기호 뜻**:
- $W^{(0)} \in \mathbb{R}^{K^{(1)} \times K^{(0)}}$
- $W^{(1)} \in \mathbb{R}^{K^{(1)}}$
- $w_0^{(\ell)}$ — bias

**ReLU activation**:
$$
\mathrm{ReLU}(x_k) = \max(x_k, 0)
$$

paper footnote 16:
> "ReLU activation functions have a number of advantages including the non-saturation of its gradient, which greatly accelerates the convergence of stochastic gradient descent compared to the sigmoid/hyperbolic functions (Krizhevsky et al. (2012)) and fast calculations of expensive operations."

---

## 5b.5 Figure 2 — FFN Illustration

![Fig. 2 — Feedforward Network with Single Hidden Layer](figures/page14_FFN_illustration.png)

*paper p.14 Fig. 2 — 1-hidden-layer FFN. 입력 layer $x^{(0)}$ → hidden layer $x^{(1)}$ (ReLU) → output $y$. 다층은 여러 hidden layer 를 stack.*

---

## 5b.6 Deep Network — 다층 확장

paper p.15:
> "A deep neural network combines several layers by using the output of one hidden layer as an input to the next hidden layer. The details are explained in Appendix A.A. The multiple layers allow the network to capture non-linearities and interaction effects in a more parsimonious way."

→ paper 의 **best model 은 2-layer FFN** (Section II.E 의 hyperparameter tuning 결과).

---

## 5b.7 본 논문 의 best FFN 설정 (hyperparameters)

paper p.18 (Section II.E):
> "Our optimal model has two layers, four economic states and eight instruments for the test assets."

**2-layer FFN** + 4 LSTM states + 8 instruments = baseline GAN model.

paper Appendix I (p.66–67) 의 tuning grid:
- Layers: 1, 2, 3
- Nodes per layer: 32, 64
- LSTM states: 2, 4
- Instruments D: 4, 8, 16

→ validation Sharpe ratio 최대화로 선택.

---

## 5b.8 학습 방법 (paper Appendix A.A)

paper Appendix A:
- **Optimizer**: Adam (adaptive learning rate)
- **Activation**: ReLU
- **Regularization**: Dropout (paper p.18) — "form of regularization that has generally better performance than conventional l1/l2 regularization"
- **Ensemble**: 9 models with different seeds, predictions averaged.

paper 본문 (p.18):
> "All our neural networks including the forecasting approach are averaged over nine model fits. Let $\hat w^{(j)}$ and $\hat \beta^{(j)}$ be the optimal portfolio weights respectively SDF loadings given by the j-th model fit. The ensemble model is an average of the outputs from models with the same architecture but different starting values for the optimization, that is $\hat\omega = \frac{1}{9}\sum_{j=1}^{9} \hat\omega^{(j)}$ and $\hat\beta = \frac{1}{9}\sum_{j=1}^{9} \hat\beta^{(j)}$."

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. FFN 의 4가지 활용 중 (1)-(2) 와 (3)-(4) 의 차이?
2. ReLU 가 다른 activation 보다 본 논문에서 적합한 이유?
3. 본 논문의 best FFN 설정 (layers, states, instruments) 은?

### 답변
1. **(1)-(2)** 은 GAN 의 두 네트워크 (SDF $\omega$, conditional $g$) 의 main 모델. **(3)** 은 별도 benchmark (FFN forecasting, GKX 2020 의 best model). **(4)** 는 GAN 학습 후 β 계산용 보조 — $\mathbb{E}[F R^e]$ 를 별도 FFN 으로 추정.
2. (a) **Non-saturation of gradient** — sigmoid/tanh 는 큰 입력에서 gradient ≈ 0 (vanishing). ReLU 는 양수 영역에서 gradient = 1 (vanish 안 함). (b) **Fast computation** — max(0, x) 는 single comparison. (c) Krizhevsky et al. (2012) ImageNet 성공의 핵심.
3. **2 layers** (depth), **4 economic states** (LSTM output dim), **8 instruments** (conditioning $g$ dimension $D$). Validation Sharpe ratio 최대화로 선택.
