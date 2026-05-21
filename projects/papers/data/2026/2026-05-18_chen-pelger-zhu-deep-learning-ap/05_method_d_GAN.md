# 05d. Section II.D–E — GAN & Hyperparameters

## 📌 이 챕터 다 읽으면 알 수 있는 것

- GAN (Generative Adversarial Network) 의 minimax framework
- 본 논문에서 GAN 의 정확한 구조 — SDF network vs Conditional network
- 3-step training algorithm 의 정확한 의미
- Ensemble 9 의 design choice

---

> Section II.D–E (paper p.17–19) — Generative Adversarial Network 와 학습 setup.

## 5d.1 챕터 한 줄 요약

SDF network 와 Conditional network 가 minimax 게임. **3-step training**: (1) unconditional loss 로 SDF 초기화, (2) 그 SDF 고정 → g 최대화, (3) 그 g 고정 → SDF 재최소화. paper 는 **3 step 만으로 수렴** 한다고 보고.

---

## 5d.2 GAN의 학습 절차 (paper p.17–18)

paper Section II.D 본문:
> "We take three steps to train the model. Our initial first step SDF minimizes the unconditional loss. Second, given this SDF we maximize the loss by optimizing the parameters in the conditional network. Finally, given the conditional network we update the SDF network to minimize the conditional loss."

**3-step 학습**:

### Step 1: Unconditional SDF 초기화
$$
\hat\omega^{(0)}, \hat h_t = \arg\min_{\omega, h_t} L(\omega \mid \hat g = 1, \cdot)
$$
→ $g = $ 상수 (unconditional moments).

### Step 2: Adversary 학습
$$
\hat g, \hat h^g_t = \arg\max_{g, h^g_t} L(\hat\omega^{(0)} \mid g, \cdot)
$$
→ 고정된 SDF 에 대해 가장 mispriced 한 $g$ 찾음.

### Step 3: SDF 업데이트
$$
\hat\omega, \hat h_t = \arg\min_{\omega, h_t} L(\omega \mid \hat g, \cdot)
$$
→ 새 $g$ 에 대해 SDF 재학습.

paper 인용:
> "A conventional GAN network iterates this procedure until convergence. We find that our algorithm converges already after the above three steps, i.e. the model does not improve further by repeating the adversarial game."

→ **3 step 만으로 수렴** (paper Internet Appendix Fig IA.1 에서 확인).

---

## 5d.3 전체 minimax problem

paper p.18 (footnote 18 위):
$$
\{\hat\omega, \hat h_t, \hat g, \hat h^g_t\} = \min_{\omega, h_t} \max_{g, h^g_t} L(\omega \mid \hat g, h^g_t, h_t, I_{t,i})
$$

### 🔣 4-단 기호 풀이 (GAN 의 4 quantity 동시 최적화)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\hat\omega$ | SDF weights (학습값) | "학생의 최종 답안" | NN parameter, 학습으로 결정 |
| $\hat h_t$ | SDF LSTM state (학습값) | "학생의 경제 환경 이해" | 별도 LSTM weight 학습 |
| $\hat g$ | conditioning function | "출제자의 최종 시험 문제" | adversary NN parameter |
| $\hat h^g_t$ | adversary LSTM state | "출제자의 경제 분석" | 별도 LSTM (SDF 와 다름) |
| $\min_{\omega, h_t}$ | SDF 측 최소화 | "학생이 답안 + 경제이해 모두 최소화" | 외부 |
| $\max_{g, h^g_t}$ | adversary 측 최대화 | "출제자가 문제 + 자기분석 모두 최대화" | 내부 |

**🌱 한 줄**: "**학생 (SDF) 측 2 quantity 와 출제자 (adversary) 측 2 quantity 가 minimax 게임** — 4 NN parameter 동시 학습".

→ **4가지 quantity 동시 최적화**: SDF weights $\omega$, SDF LSTM state $h_t$, conditioning $g$, adversary LSTM state $h^g_t$.

---

## 5d.4 Section II.E — Hyperparameters & Ensemble

### 5d.4.1 Dropout Regularization

paper p.18:
> "We prevent the model from overfitting and deal with the large number of parameters by using 'Dropout', which is a form of regularization that has generally better performance than conventional l1/l2 regularization."

**Dropout**: 학습 중 각 layer 의 neuron 일부를 randomly **0 으로** 만듦.
- **효과 1**: noise 주입 — overfit 방지.
- **효과 2**: Implicit ensemble — 각 dropout pattern 이 다른 sub-network.

### 5d.4.2 Adam Optimizer

paper:
> "We optimize the objective function accurately and efficiently by employing an adaptive learning rate for a gradient-based optimization."

→ Adam (paper Appendix A.C 에서 detail).

### 5d.4.3 Ensemble Averaging

paper p.18:
$$
\hat\omega = \frac{1}{9}\sum_{j=1}^{9} \hat\omega^{(j)}, \quad \hat\beta = \frac{1}{9}\sum_{j=1}^{9} \hat\beta^{(j)}
$$

**9 ensemble** — 같은 architecture, 다른 random seed.

paper 본문:
> "An ensemble over nine models produces very robust and stable result and there is no effect of averaging over more models. The results are available upon request."

→ **9 가 충분** — 더 늘려도 성능 변동 없음.

### 5d.4.4 Vector-valued outputs 의 ensemble 주의

paper:
> "Note that for vector valued functions, for example the conditioning function $g$ and macroeconomic states $h$, it is not meaningful to report their model averages as different entries in the vectors are not necessarily reflecting the same object in each fit."

→ $g$ 와 $h$ 는 **vector 별 entry 가 model 마다 다른 의미** — 평균 X. ω 와 β 같은 scalar/conformable output 만 평균.

---

## 5d.5 Hyperparameter Tuning Grid

paper p.18 + Appendix I:

| Hyperparameter | 후보 |
|----------------|------|
| Layers (FFN depth) | 1, 2, 3 |
| Nodes per layer | 32, 64 |
| LSTM states $K_h$ | 2, 4 |
| Instruments $D$ (g dimension) | 4, 8, 16 |
| Dropout rate | (Appendix I 의 table 참조) |
| Learning rate $\alpha$ | (Appendix I) |

**선택 기준**: Validation Sharpe ratio 최대화.

paper 본문:
> "We choose the best configuration among all possible combinations of hyperparameters by maximizing the Sharpe ratio of the SDF on the validation data. The optimal model is evaluated on the test data. **Our optimal model has two layers, four economic states and eight instruments for the test assets.**"

---

## 5d.6 Data Split

paper p.20–21 (Section III.A 의 일부):
- **Training**: 1967–1986 (20 years)
- **Validation**: 1987–1991 (5 years) — hyperparameter 선택
- **Test**: 1992–2016 (25 years) — OOS 성능 평가

→ **50 년 전체**, **25 년 OOS**.

---

## 5d.7 Best Model 의 Architecture 요약

paper p.18 본문 + Fig 1:

```
SDF Network                         Conditional Network
                                                       
  macro I_t (178)                     macro I_t (178)
       │                                   │
       ▼                                   ▼
     LSTM                                 LSTM
   (4 states)                           (4 states)
       │                                   │
       ▼                                   ▼
   h_t (4)         chars I_{t,i} (46)   h^g_t (4)
       │                  │                │
       └──────── concat ──┴────────────────┘
              │                                  
              ▼                                  
         FFN (2 hidden layers, ReLU)
              │
              ▼
         ω_{t,i}     OR     g_{t,j} (8 instruments)
              │                     │
              ↓                     ↓
         SDF M_{t+1}        Test assets
              │                     │
              └────────┬────────────┘
                       ▼
              Loss = (1/N) Σ_j |E[M R^e g]|²
                       │
                       │ minimax: min_ω max_g
                       ▼
              3-step training to convergence
                       │
                       ▼
              ┌─ Ensemble of 9 ─┐
              └─ Output averaged ┘
```

---

## 5d.8 GAN 의 직관 — Image GAN 과의 비교

### Step 1 — Original GAN (Goodfellow 2014)

**Image generation GAN**:
- **Generator** $G$: random noise → fake image.
- **Discriminator** $D$: image → "real or fake?" probability.
- **Minimax game**:
  $$
  \min_G \max_D \mathbb{E}[\log D(\text{real}) + \log(1 - D(G(\text{noise})))]
  $$

→ $G$ 가 진짜 같은 image 만들고, $D$ 가 구별 시도. 균형에서 $G$ 가 perfect image 생성.

### Step 2 — Chen-Pelger-Zhu 의 Asset Pricing GAN

**구조 동일**:
- $\omega$ = generator (SDF portfolio weights 학습).
- $g$ = discriminator (mispriced asset 찾기).
- **Minimax**:
  $$
  \min_\omega \max_g \frac{1}{N} \sum_j |\mathbb{E}[(1 - \omega^\top R^e) R^e_j g_j]|^2
  $$

| 측면 | Original GAN | Chen-Pelger-Zhu |
|------|-------------|---------|
| Generator | 신경망 $G$ — image 생성 | SDF network $\omega$ — pricing model |
| Discriminator | $D$ — real/fake 구별 | Conditional $g$ — mispriced asset 발견 |
| 게임 | $G$ 가 $D$ 를 속이려 | $g$ 가 $\omega$ 의 약점 드러내려 |
| 균형 | Perfect image | Robust SDF |

### Step 3 — 게임 이론적 해석

**Zero-sum minimax**:
- 한쪽이 이기면 다른 쪽이 짐 (정확히 반대).
- Nash equilibrium 에서 균형.

**경기 비유 (체스)**:
- $\omega$ = player 1 (SDF). 자기 약점 최소화 시도.
- $g$ = player 2 (adversary). 상대 약점 최대화 시도.
- → 균형에서 player 1 은 모든 가능 약점 처리 = robust SDF.

### Step 4 — 왜 본 paper 의 GAN 이 image GAN 보다 안정적인가

**Image GAN 의 어려움**:
- Mode collapse (generator 가 단일 image 만 생성).
- Training instability (oscillation).
- Hundreds of iterations 필요.

**본 paper 의 GAN 의 안정성**:
- **3 step 만으로 수렴** — paper 실증.
- 이유: 금융 데이터의 noise 가 많아 over-training 위험.
- Loss function (squared moment deviation) 이 image GAN 의 log-loss 보다 안정.

---

## 5d.9 Adam Optimizer 자세히

paper p.17:
> "We optimize the objective function accurately and efficiently by employing an adaptive learning rate for a gradient-based optimization."

### Step 1 — Adam 의 핵심

**Adaptive Moment estimation** (Kingma-Ba 2015):
- 각 parameter 마다 다른 learning rate.
- 1st moment (mean) 와 2nd moment (variance) 를 추적.

### Step 2 — Adam 의 update rule

$$
m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t \quad \text{(1st moment)}
$$
$$
v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2 \quad \text{(2nd moment)}
$$
$$
\theta_t = \theta_{t-1} - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
$$

where $\hat{m}_t = m_t / (1 - \beta_1^t)$, $\hat{v}_t = v_t / (1 - \beta_2^t)$ (bias correction).

### Step 3 — 왜 Adam 인가

**vs SGD (vanilla)**:
- SGD: 모든 parameter 같은 learning rate.
- Adam: gradient magnitude 따라 자동 조절.
- → Sparse gradient 에서도 학습 (Asset Pricing 처럼).

**vs RMSProp**:
- RMSProp: 2nd moment 만.
- Adam: 1st + 2nd moment 모두 — **momentum** + **adaptive rate**.

---

## 5d.10 자기점검 (이 챕터)

### 핵심 5가지
1. **GAN 의 3-step training 이 conventional GAN (수많은 iteration) 보다 더 좋은 이유?**
2. **Dropout 이 l1/l2 정규화보다 본 논문에서 더 좋은 이유?**
3. **Ensemble 9 가 충분한 이유?**
4. **Original GAN 과 본 paper 의 GAN 의 가장 큰 차이는?**
5. **Vector-valued outputs ($g$, $h$) 의 ensemble averaging 이 왜 무의미한가?**

### 답변
1. (a) 본 논문은 **금융 데이터 SNR 이 낮음** — 무한 iteration 하면 noise 학습. (b) Step 1 (unconditional) 으로 SDF 의 큰 그림을 먼저 잡고, step 2-3 으로 fine-tune. (c) paper Internet Appendix Fig IA.1 에서 추가 iteration 의 성능 향상 없음 확인.
2. (a) **Implicit ensemble** — 각 dropout pattern 이 다른 sub-network 학습. (b) **No tuning required** — l1/l2 의 $\lambda$ 같은 strength parameter 가 dropout rate 하나로 충분. (c) **NN 의 highly non-linear interaction** 에서는 dropout 이 더 잘 generalization (Srivastava et al. 2014 의 실증).
3. (a) Ensemble 의 variance reduction 효과는 $\sim 1/\sqrt{n}$. 9 에서 이미 충분히 작음. (b) paper 가 더 큰 ensemble 시도했지만 성능 변동 없음 ("available upon request"). (c) Computational cost 와 trade-off — 9 가 sweet spot.
4. **Application domain + training stability**. Original GAN = image 생성, hundreds of iteration, mode collapse 위험. 본 paper GAN = asset pricing, **3 step convergence**, stable — 금융 데이터의 noise 가 over-training 위험 있어 적은 iteration 이 적절. Loss function 도 squared moment deviation 이 image GAN 의 log-loss 보다 안정.
5. Latent representation 의 identification 불가. Ensemble 1 의 $g$ 의 첫 entry 와 ensemble 2 의 $g$ 의 첫 entry 가 같은 meaning 을 가지지 않음 (순서, 부호, scaling 이 학습 random initialization 에 의존). 평균하면 **의미 없는 noise**. Scalar output (SR, EV, XS-R²) 또는 well-identified vector ($\omega$, $\beta$ — portfolio weights) 만 평균 가능.
