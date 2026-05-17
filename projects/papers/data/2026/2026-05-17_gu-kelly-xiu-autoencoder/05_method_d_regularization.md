# 05-D. 방법론 (Part D) — Regularization & Training

> Section 2.3 (journal p.435–436) — 신경망 학습의 **overfitting 방지 5가지 장치**.

## 5D.1 챕터 한 줄 요약

CA1–CA3 는 비선형 NN 이라 자유도가 매우 높음 (≈ $10^4$ 모수). 90 만 관측치라도 잡음이 크고 SNR (signal-to-noise ratio) 이 낮은 금융 데이터에서는 overfit 위험이 큼. 본 논문은 **(a) LASSO (ℓ1), (b) Early stopping, (c) Ensemble averaging, (d) Adam optimizer, (e) Batch normalization** 의 5중 안전장치를 동시 사용.

---

## 5D.2 LASSO Penalty (ℓ1 정규화) — Eq. (19)

**손실 함수에 ℓ1 항 추가**:

$$
\mathcal{L}(\theta) = \frac{1}{NT}\sum_{i,t} \big( r_{i,t} - \beta_{i,t-1}(z; \theta)' f_t(r; \theta) \big)^2 + \lambda \sum_{j} |\theta_j| \tag{19}
$$

| 기호 | 의미 |
|------|------|
| $\theta$ | NN 의 모든 가중치 (β, factor 양쪽) |
| $\lambda$ | hyperparameter (tuning set 으로 결정) |
| $\sum |\theta_j|$ | L1 norm — 작은 가중치를 정확히 0 으로 만듦 |

**왜 L1 이고 L2 (Ridge) 가 아닌가?**
- L2 는 모든 가중치를 균등하게 작게 만들 뿐 0 을 만들지 못함.
- L1 은 **sparsity** (희소성) 를 유도 → 중요하지 않은 특성/뉴런을 자동 제거.
- 94 개 특성 중 실제로 가격 결정에 중요한 것은 소수 (Section 3.6 의 mvel1, mom1m, idiovol, retvol 등) → L1 이 자연스럽게 그것만 선택.

**Hyperparameter $\lambda$**: validation sample 으로 tuning (paper 본문 Section 2.3.2). 정확한 grid 는 본 논문 본문 22쪽 내 미발표.

---

## 5D.3 Early Stopping

**아이디어**: 학습 손실 (training loss) 은 epoch 이 늘수록 계속 감소하지만, 검증 손실 (validation loss) 은 어느 시점부터 다시 증가 (overfit 시작). 그 시점에서 학습 중단.

**프로토콜** (paper Algorithm 1, journal p.449):
1. 데이터를 train (1957–1974, 18년) / validation (1975–1986, 12년) / test (1987–2016, 30년) 로 분할.
2. Initialize counter $j=0$, best val error $\varepsilon = \infty$, patience parameter $p$.
3. **h-step block 마다** (Adam 의 h steps 후) training 업데이트, 그 후 validation 의 prediction error $\varepsilon'$ 계산.
4. $\varepsilon' < \varepsilon$ 이면: $j \leftarrow 0$, $\varepsilon \leftarrow \varepsilon'$, $\theta' \leftarrow \theta$ (best 모수 저장). 아니면 $j \leftarrow j+1$.
5. $j \geq p$ 면 중단 → $\theta'$ 채택.

(paper 는 정확한 $p$, $h$ 값을 본문 명시 안 함.)

→ "**자동 capacity 조절**": 데이터가 단순하면 일찍 멈추고, 복잡하면 늦게 멈춤.

---

## 5D.4 Ensemble Averaging

**아이디어**: 같은 아키텍처를 **서로 다른 초기값 (random seed)** 으로 10 회 학습 → 10 개 모델의 예측을 평균.

**이유**:
- 신경망 학습은 **non-convex** — 시작점에 따라 다른 local optimum 에 빠짐.
- 단일 모델은 그 local optimum 에 의존 → 운에 따라 성능 변동.
- 10 개를 평균하면:
  - **Bias**: 각 모델이 평균적으로 같은 함수에 수렴하므로 변하지 않음.
  - **Variance**: 1/10 로 감소 (서로 독립적인 추정값이면).
  - → MSE 감소, OOS 성능 향상.

본 논문 (journal p.436): "we use multiple random seeds, **say, 10**, to initialize neural network estimation and construct model predictions by averaging estimates from all networks."

---

## 5D.5 Adam Optimizer

**SGD 의 변형 — adaptive learning rate** + **momentum**.

업데이트 식:
$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2
$$
$$
\hat m_t = \frac{m_t}{1-\beta_1^t}, \quad \hat v_t = \frac{v_t}{1-\beta_2^t}
$$
$$
\theta_t = \theta_{t-1} - \frac{\eta}{\sqrt{\hat v_t} + \epsilon}\, \hat m_t
$$

| 기호 | 의미 | 기본값 |
|------|------|--------|
| $g_t$ | 시점 $t$ 에서 미니배치 그래디언트 | — |
| $m_t$ | 1차 모멘텀 (그래디언트 EMA) | — |
| $v_t$ | 2차 모멘텀 (그래디언트^2 EMA) | — |
| $\beta_1$ | 1차 모멘텀 감쇠 | 0.9 |
| $\beta_2$ | 2차 모멘텀 감쇠 | 0.999 |
| $\eta$ | 학습률 | 0.001 |
| $\epsilon$ | 0 나눗셈 방지 | $10^{-8}$ |

**왜 Adam 인가?**
- **Adaptive**: 자주 등장하는 특성에는 작은 step, 드물게 등장하는 특성에는 큰 step.
- **Robust**: hyperparameter 에 덜 민감.
- 표준 NN 학습의 거의 default 선택.

paper Algorithm 2 (journal p.449) 의 정확한 default 값:
- $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$
- Tuning: learning rate $\alpha$, batch size $b$
- $g_t \odot g_t$ 는 element-wise 곱 (footnote 17)
- $\hat v_t$ 에 element-wise 제곱근 $\sqrt{\hat v_t}$ 적용, $\oslash$ 는 element-wise 나눗셈

---

## 5D.6 Batch Normalization

**아이디어**: 신경망의 각 층 입력을 **미니배치 단위로 정규화** (평균 0, 분산 1).

식: 미니배치 $\{x^{(1)}, ..., x^{(B)}\}$ 에 대해
$$
\mu = \frac{1}{B}\sum_b x^{(b)}, \quad \sigma^2 = \frac{1}{B}\sum_b (x^{(b)}-\mu)^2
$$
$$
\hat x^{(b)} = \frac{x^{(b)} - \mu}{\sqrt{\sigma^2 + \epsilon}}, \quad y^{(b)} = \gamma\, \hat x^{(b)} + \beta
$$

여기서 $\gamma, \beta$ 는 학습 가능한 affine 파라미터.

**효과**:
1. **Internal covariate shift 감소** — 깊은 층의 입력 분포가 학습 중 자꾸 변하는 문제 완화.
2. **Gradient 안정화** — 학습률을 더 크게 써도 폭발/소실 없음.
3. **Regularization 부수효과** — 미니배치 통계에 의존하므로 약간의 잡음 주입 효과.

본 논문 Section 2.3.3: batch normalization 채택 (Algorithm 3). 정확한 적용 위치 (어떤 layer 들 사이) 는 본문 명시 미발견.

---

## 5D.7 Hyperparameter Tuning Protocol

**Step 1**: Training set 으로 학습, validation set 으로 hyperparameter 선택.

**Step 2**: validation 으로 hyperparameter 선택:
- LASSO $\lambda$ : tuning
- Learning rate (Adam α) : tuning
- Batch size, patience for early stopping : 본 논문 본문 명시 미발견 (Online Appendix 가능)
- Ensemble size : "say, 10" (journal p.436)

(정확한 grid 는 paper 본문 22쪽 미명시. 본 해체의 코드 예시는 Adam (β1=0.9, β2=0.999, ε=1e−8 paper Algorithm 2 기본값) 사용.)

**Step 3**: 매년 학습을 재실행:
- 1987 년 OOS 예측 → 1957–1974 train, 1975–1986 val
- 1988 년 OOS 예측 → 1957–1975 train, 1976–1987 val
- ...
- 2016 년 OOS 예측 → 1957–2003 train, 2004–2015 val

→ **rolling-window** + **expanding training**. 미래 정보 누출 (look-ahead bias) 완전 차단.

---

## 5D.8 5중 정규화의 효과 — 직관

| 장치 | 막는 overfit 종류 |
|------|------------------|
| LASSO | 무관한 특성 자동 제거 |
| Early stopping | epoch 과다로 인한 train 노이즈 학습 |
| Ensemble | 단일 초기값의 local optimum 운 |
| Adam | 부적절한 학습률로 인한 발산/저성능 |
| Batch norm | 깊은 층의 학습 불안정 |

→ **5개 장치를 동시 적용** 했기에 90만 관측치 × 1만 모수 라는 빡빡한 환경에서도 OOS 성능이 안정적.

---

## 5D.9 Out-of-Sample 평가 프로토콜 (paper Section 3.2)

본 논문의 모든 결과 표 (Table 1–5) 는 **OOS 30년 (1987–2016)** 기준.

| 단계 | 기간 | 용도 |
|------|------|------|
| Initial Training | 1957–1974 (18년) | 모수 학습 |
| Initial Validation | 1975–1986 (12년) | hyperparameter, early stopping |
| Test | 1987–2016 (30년) | OOS 성능 평가 |

매년 train+val 윈도우를 1 년 확장하며 다시 학습.

**왜 이렇게 엄격한가?**
- 금융에서 OOS 성능은 **결코 우연이 아닌, 인과적으로 검증된** 결과만 의미가 있음.
- ML 모델은 in-sample 성능을 부풀리기 쉬워 OOS 가 진짜 시험.

---

## 5D.10 정리

```
[ Training Pipeline ]
                                                   
  데이터 (z, r)                                     
       ↓                                            
  ┌───────────┐    Adam        ┌────────────┐
  │ NN 모수 θ │ ──────────► │ Loss + L1 │
  └───────────┘    ↑↓grad      └────────────┘
       ↑                              │
       │  Batch norm                  │
       │  (각 은닉층)                  │
       │                              │
       └────── Early stop ◄───── Val loss
       
  10회 반복 (다른 seed)
       ↓
  Ensemble 평균
       ↓
  최종 모델
       ↓
  OOS 1년 예측
       ↓
  Rolling expansion: train+val 윈도우 +1년
       ↓
  다시 학습 → 다음 OOS 1년 예측
       ↓
  ... 30년 반복
```

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. LASSO 와 Ridge 의 차이가 본 논문에서 LASSO 가 선호되는 이유는?
2. Ensemble 이 bias 는 줄이지 않고 variance 만 줄이는 이유는?
3. 매년 학습을 다시 하는 이유는?

### 답변
1. LASSO (ℓ1) 는 작은 가중치를 정확히 0 으로 만들어 sparsity 유도. 94 개 특성 중 소수만 의미 있다는 사전 정보와 일치. Ridge (ℓ2) 는 모두 작게 만들지만 0 을 못 만듦.
2. 10 개 모델이 같은 데이터 분포에 학습되므로 평균적 함수는 동일 (bias 불변). 그러나 각 모델은 서로 다른 local optimum 에 빠져 변동이 있음 → 평균으로 그 변동이 1/10 로 감소.
3. (a) 신규 12개월 데이터를 학습에 포함시켜 정보 활용 최대화. (b) Validation 윈도우도 1년 이동시켜 hyperparameter 가 최신 시장 환경에 맞춰지게. (c) Look-ahead bias 완전 차단.
