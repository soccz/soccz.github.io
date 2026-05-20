# 05-D. 방법론 (Part D) — Regularization & Training

> Section 2.3 (journal p.435–436) — 신경망 학습의 **overfitting 방지 5가지 장치**.

## 📌 이 챕터, 무지식자도 알아갈 큰 그림

**왜 5 개나 필요한가? 한 줄 비유**:
> "수험생이 너무 똑똑해서 (CA1+의 자유도) 시험 문제의 답을 외우는 게 아니라 **잡음까지 외워버린다 (overfit)**. 5 개 장치는 그 외우기를 막는 5 가지 다른 방법."

각 장치를 학생-시험 비유로 미리 풀어 둠 (자세한 수식은 아래 절):

| 장치 | 학생-시험 비유 | 한 마디 |
|------|----------------|---------|
| **LASSO (ℓ1)** | "교재 1 천 권 중 중요한 20 권만 표시" | 무관한 변수를 자동 0 으로 |
| **Early Stopping** | "모의고사 점수가 다시 떨어지기 시작하면 공부 중단" | 과학습 자동 차단 |
| **Ensemble** | "10 명의 학생이 따로 공부하고 답을 평균" | 한 사람의 운에 안 휘둘림 |
| **Adam** | "잘 안 풀리는 과목엔 더 신경 쓰는 적응형 공부법" | 학습률 자동 조절 |
| **Batch Norm** | "매 시간 답안지를 표준화 (평균 0, 분산 1) 해서 채점 안정" | 학습 안정화 |

**왜 5 개를 다 쓰나?**
- 금융 데이터는 **신호 < 잡음** (SNR ≈ 0.07, paper 인용).
- 한 장치만 쓰면 다른 종류의 overfit 으로 새어나감.
- 5 개를 동시 적용해야 90 만 관측치에서 1 만 모수 학습이 안전.

---

## 5D.1 챕터 한 줄 요약

CA1–CA3 는 비선형 NN 이라 자유도가 매우 높음 (≈ $10^4$ 모수). 90 만 관측치라도 잡음이 크고 SNR (signal-to-noise ratio) 이 낮은 금융 데이터에서는 overfit 위험이 큼. 본 논문은 **(a) LASSO (ℓ1), (b) Early stopping, (c) Ensemble averaging, (d) Adam optimizer, (e) Batch normalization** 의 5중 안전장치를 동시 사용.

---

## 5D.2 LASSO Penalty (ℓ1 정규화) — Eq. (19)

### 🌱 일상 비유 — "교재 1 천 권 중 중요한 20 권만 표시하는 형광펜"

상상: 도서관에 1 천 권의 교재 (특성 = 94 개 × 신경망 weight). 학생 (모델) 은 모든 책을 다 읽으면 잡음 (안 중요한 책) 도 외워버림. LASSO 는 **"각 책을 들 때마다 약간의 부담"** 을 주는 형광펜.

- 중요한 책 → 부담 감수하고 들고 옴 (weight 살아남음)
- 안 중요한 책 → "부담만 있고 이득 없음" → 안 듦 (weight = 0)

→ **자동으로 중요한 20 권만 남고 980 권은 버려짐**. 94 개 특성 중 핵심 ~20 개만 살아나는 본 논문의 sparsity 발견 (Fig 4, 5) 과 정확히 맞음.

**왜 L1 (절댓값) 이 L2 (제곱) 보다 좋은가?**
- L2 (Ridge): "모든 책을 약간씩 덜 무겁게" — 모두 가벼워지지만 한 권도 안 버림.
- L1 (LASSO): "0 만들기를 강제" — 안 중요한 weight 를 정확히 0 으로 → **변수 선택 자동화**.

**한 줄 결론**: LASSO 는 신경망 안에 "중요도 형광펜" 을 박는 장치.

---

**손실 함수에 ℓ1 항 추가**:

$$
\mathcal{L}(\theta) = \frac{1}{NT}\sum_{i,t} \big( r_{i,t} - \beta_{i,t-1}(z; \theta)' f_t(r; \theta) \big)^2 + \lambda \sum_{j} |\theta_j| \tag{19}
$$

### 🔣 식이 말하는 것 한 줄

"손실 = (예측 오차 제곱 평균) + (모든 weight 의 절댓값 합 × λ)" — λ 가 클수록 weight 를 0 으로 만들려는 압력 증가.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\mathcal{L}(\theta)$ | 손실 함수 | "이 weight 값으로 시험 보면 틀린 정도" | 작을수록 좋음 |
| $(r - \beta'f)^2$ | 예측 오차 제곱 | "예측이 얼마나 빗나갔나" | 표준 least squares |
| $\theta$ | 모든 NN 가중치 (β + f network 합쳐) | "94 개 책의 형광펜 표시" | 보통 1만 개 정도 |
| $\lambda$ | LASSO 강도 (hyperparameter) | "**형광펜 부담을 얼마나 무겁게**" | validation 으로 튜닝 |
| $\sum \|\theta_j\|$ | L1 norm | "모든 weight 절댓값의 합" | weight 0 을 만드는 압력 |

**λ 의 효과**:
- λ = 0 → 보통 NN 학습 (정규화 없음, overfit 위험)
- λ 크면 → 거의 모든 weight = 0 (underfit)
- λ 적당 (튜닝) → top ~20 변수만 살아남고 나머지 0

### 🌱 왜 L1 이 L2 (Ridge) 보다 좋은가 — 그림으로

```
   L2 (Ridge):          모든 weight 를 균등하게 작게        
        weight ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  → ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
                       (큰 weight 들이 줄지만 0 없음)        

   L1 (LASSO):          작은 weight 를 0 으로 자르고 큰 것만 유지
        weight ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  → ▒▒▒▒▒        ▒▒▒    
                       (정확히 0 인 weight 가 생김 ★)        
```

L1 의 절댓값 기하학이 **꼭짓점이 좌표축에 있어서 해가 좌표축에 붙음 (= 0)** 이라는 게 이론적 이유.

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

### 🌱 일상 비유 — "모의고사 점수가 다시 떨어지기 시작하면 공부 중단"

상상: 학생이 매주 공부 + 매주 모의고사. 패턴은:
- 1~10주: 공부할수록 본시험 점수 **올라감** (학습)
- 11주~: 모의고사 점수가 **다시 떨어짐** — 학생이 기출 문제만 외우기 시작 (overfit)

Early stopping = "**모의고사가 떨어지기 시작한 그 시점** 에서 공부 중단".

자산가격 맥락:
- 공부 = epoch 별 NN 학습
- 모의고사 = validation set (1975~1986)
- 본시험 = test set (1987~2016, 30년 OOS)
- **모의고사 (validation) 가 다시 나빠지는 순간 = overfit 시작 신호** → 거기서 멈추고 최선 모수 저장.

**왜 좋은가?**
- 자유도 (epoch 수) 를 **자동 조절**. 하이퍼파라미터 수동 튜닝 없음.
- 데이터가 단순하면 일찍 멈추고, 복잡하면 늦게 멈춤 (적응형).

**한 줄 결론**: "공부 그만할 시점을 모의고사가 알려줌" 의 ML 버전.

---

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

### 🌱 일상 비유 — "10명의 학생이 따로 공부하고 답을 평균"

상상: 같은 시험을 10명이 따로 공부. 각자 다른 책상·다른 순서로 공부 (= 다른 random seed). 시험 당일 10명의 답을 **평균** 으로 제출.

- 한 학생만 → 그날 컨디션 운에 갈림 (variance ↑)
- 10 명 평균 → 운이 **상쇄** 됨 → variance ↓

자산가격 맥락:
- 신경망 학습은 **비볼록 (non-convex)** — 시작점에 따라 다른 답 (local optimum) 으로 수렴
- 10 개를 평균하면:
  - **편향 (bias)**: 평균적 함수는 같음 → 안 변함
  - **분산 (variance)**: 1/10 로 감소 (독립이면)
  - → **OOS 성능 향상**

**왜 그냥 한 번 안 돌리나?**
- 신경망의 학습 결과는 **운에 의존** (random init, mini-batch 순서)
- 평균으로 운 효과 제거.

**한 줄 결론**: "10 명의 답 평균 = 한 명 운 의존 제거". paper: "say, 10" (저자가 10 회 정도 추천).

---

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

### 🌱 일상 비유 — "잘 안 풀리는 과목엔 더 신경 쓰는 적응형 공부법"

상상: 학생이 5 과목 공부. 옛날 방식 (SGD) 은 "모든 과목 1 시간씩 균등". Adam 은:
- **잘 풀리는 과목** (gradient 작음): "더 익혔으니 짧게" (작은 학습률)
- **자주 안 풀리는 과목** (gradient 큼): "여기 약하니까 더 오래" (큰 학습률)
- **꾸준한 향상** (momentum): "어제도 좋아졌으니 같은 방향 더" (관성 적용)

**Adam 의 두 트릭**:
1. **Adaptive learning rate**: 각 weight 마다 학습률 다르게. 잡음 큰 weight 는 천천히, 신호 큰 weight 는 빨리.
2. **Momentum**: 과거 gradient 평균 → 진동 없이 부드럽게 내려감.

자산가격 맥락:
- 94 특성 중 어떤 건 자주 등장 (mvel1, mom1m 등), 어떤 건 드물게.
- Adam = "**자주 등장하면 학습률 작게, 드물면 학습률 크게**" 자동 조절.
- 결과: hyperparameter (학습률) 튜닝 거의 안 해도 됨.

**왜 default 인가?**
- 거의 모든 NN 표준 도구. 다른 optimizer (SGD+momentum 등) 도 가능하지만 Adam 이 가장 robust.

**한 줄 결론**: "안 되는 곳에 더 집중하는 자동 공부법". 본 논문 default $\beta_1 = 0.9, \beta_2 = 0.999$.

---

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

### 🌱 일상 비유 — "매번 점수를 평균 0, 분산 1 로 표준화"

상상: 모의고사 점수가 매번 단위가 다름 (한 번은 100점 만점, 한 번은 1000점 만점, 한 번은 평균 50 한 번은 평균 500). 학생이 점수를 봐도 진짜 잘했는지 모름.

Batch norm = "**매 시간 점수를 z-score (평균 0, 표준편차 1) 로 표준화**" 해서 채점.

자산가격 맥락:
- 신경망의 깊은 층 (hidden layer) 입력 분포가 학습 중 자꾸 변동 → 학습 불안정 ("internal covariate shift").
- Batch norm 으로 매 미니배치마다 각 층 입력을 표준화 → 분포 일정 → 학습 안정.

**부가 효과**:
1. **학습률 키울 수 있음** — 폭발/소실 없이.
2. **약한 정규화 효과** — 미니배치 통계에 의존하므로 약간의 잡음 주입 (overfit 추가 방지).
3. **깊은 NN 학습 가능** — CA3 같은 3-layer NN 도 안정적으로 수렴.

**한 줄 결론**: "매번 점수 표준화" 의 NN 버전. 깊은 모델일수록 효과 ↑.

---

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

## 5D.X paper Appendix B 의 정확한 Pseudocode — Algorithm 1·2·3

paper Appendix B (journal p.449) 의 정확한 알고리즘 3 개를 한국어로 재현.

---

### Algorithm 1 — Early Stopping

```
Input:  훈련 셋, 검증 셋
        h ← Adam 의 batch 갱신 횟수
        p ← patience parameter
Output: best parameters θ'

1. 초기화:  j ← 0
            ε ← ∞
            θ ← random initialization
            θ' ← θ

2. 반복 (수렴까지):
   2.1.  h step 동안 훈련 셋으로 Adam 업데이트 → θ
   2.2.  검증 셋에서 prediction error ε' 계산
   2.3.  if ε' < ε:
            ε ← ε'
            θ' ← θ          # best 모수 저장
            j ← 0
         else:
            j ← j + 1
   2.4.  if j ≥ p:
            return θ'        # 종료
```

🌱 **일상 비유**: 학생이 h 시간 공부 → 모의고사 → 점수 좋아지면 그 weight 저장, p 번 연속 안 좋아지면 멈춤. 가장 좋았던 weight 채택.

**paper 명시 안 함**: 정확한 h, p 값. 본 해체의 코드 예시는 h = 1 epoch, p = 5 사용.

---

### Algorithm 2 — Adam Optimizer (정확한 step 절차)

```
Input:  손실 함수 L(θ)
        하이퍼파라미터: α (학습률), β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸
        초기값: θ₀
Output: 최적 θ

1. 초기화:  m₀ ← 0      # 1차 모멘텀
            v₀ ← 0      # 2차 모멘텀
            t  ← 0

2. 반복 (수렴까지):
   2.1.  t ← t + 1
   2.2.  g_t ← ∇_θ L(θ_{t-1})              # 그래디언트
   2.3.  m_t ← β₁ · m_{t-1} + (1-β₁) · g_t  # 1차 EMA
   2.4.  v_t ← β₂ · v_{t-1} + (1-β₂) · g_t ⊙ g_t   # 2차 EMA (element-wise 제곱)
   2.5.  m̂_t ← m_t / (1 - β₁^t)            # bias 보정
   2.6.  v̂_t ← v_t / (1 - β₂^t)
   2.7.  θ_t ← θ_{t-1} - α · m̂_t ⊘ (√v̂_t + ε)   # element-wise 나눗셈
```

🌱 **일상 비유**:
- m̂ = "최근 그래디언트의 평균 방향" — 관성 (momentum)
- v̂ = "최근 그래디언트의 변동성" — 큰 변동에서는 작은 step
- 결과 step = "방향 / 변동성" — 안정적인 방향으로 자신감 있게, 불안정한 방향으로 조심스럽게

**기본값 (paper Algorithm 2)**: β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸.
**튜닝 대상**: α (학습률), batch size b.

---

### Algorithm 3 — Batch Normalization

```
Input:  미니배치 B = {x⁽¹⁾, x⁽²⁾, ..., x⁽ᴮ⁾}
        학습 가능 파라미터: γ (scale), β (shift)
Output: 정규화된 y⁽ᵇ⁾

1. 미니배치 평균:
   μ_B ← (1/B) Σ_{b=1}^B x⁽ᵇ⁾

2. 미니배치 분산:
   σ²_B ← (1/B) Σ_{b=1}^B (x⁽ᵇ⁾ - μ_B)²

3. 정규화 (각 원소):
   x̂⁽ᵇ⁾ ← (x⁽ᵇ⁾ - μ_B) / √(σ²_B + ε)

4. Scale + Shift:
   y⁽ᵇ⁾ ← γ · x̂⁽ᵇ⁾ + β
```

🌱 **일상 비유**:
- Step 1-2: "이 미니배치의 점수 평균·분산 계산"
- Step 3: "z-score 처럼 정규화 (평균 0, 분산 1)"
- Step 4: "학습 가능한 scale γ, shift β 로 다시 조정"

**왜 학습 가능한 γ, β?**
- 정규화는 표현력을 일부 제약. γ, β 가 그 제약을 학습으로 풀어줌.
- 학습 끝나면 "필요하면 다시 unnormalize" 가능.

**기본값** (paper 미명시): γ = 1, β = 0 으로 초기화.

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

1. **LASSO 가 Ridge 보다 선호되는 이유 (수학 + 실증 + 사전정보)**:
   - **(a) 수학적**: L1 norm $\sum|\theta|$ 의 미분이 부호함수 (sgn) → gradient 가 0 근처에서도 일정한 크기 → 정확히 0 으로 보낼 수 있음. L2 ($\sum\theta^2$) 는 미분이 $2\theta$ → 0 근처에서 gradient 가 작아져서 0 에 영원히 못 닿음.
   - **(b) 기하학적**: L1 ball 은 꼭짓점이 좌표축에 있음 → 최적해가 좌표축 위 (= weight 0) 일 가능성 높음.
   - **(c) 사전정보 부합**: 본 논문 발견 (Fig 4, 5) — 94 특성 중 top 20 만 의미. **자연스러운 sparsity → L1 이 정확히 그 구조를 강제**.
   - **(d) 변수 선택 자동화**: L1 이 자동으로 "어느 변수가 중요한가" 선택. L2 는 모든 변수 유지 → 해석 어려움.

2. **Ensemble 이 bias 불변·variance 만 감소시키는 이유**:
   - **Bias-variance decomposition** 의 관점:
     - $\text{MSE} = \text{bias}^2 + \text{variance}$
     - 10 모델 평균 시: bias 는 그대로 (같은 데이터 분포 학습 → 같은 평균 함수로 수렴), variance 는 1/10.
   - **수학**: $\text{Var}(\frac{1}{10}\sum X_i) = \frac{1}{100}\sum\text{Var}(X_i) = \frac{\text{Var}(X)}{10}$ (X_i 독립일 때)
   - **신경망의 비독립성**: 같은 데이터 → 완전 독립은 아니지만 상당 부분 독립적 (다른 random init → 다른 local optimum) → variance 감소 효과 실재.
   - **결과**: 같은 데이터로 1 모델 vs 10 모델 평균 — 평균값은 거의 같지만 **분산 (운에 의한 변동)** 이 작아짐. paper 의 "say, 10" 권장 근거.

3. **매년 학습 재실행의 이유 (3 가지)**:
   - **(a) 새 정보 활용**: 신규 12개월 데이터를 학습에 포함시켜 정보 활용 최대화. 데이터셋이 매년 5% 정도씩 커짐.
   - **(b) Validation 도 이동**: validation window 도 1년 이동시켜 hyperparameter 가 **최신 시장 환경 에 맞춰지게**. 1980s 의 패턴 ≠ 2010s 의 패턴.
   - **(c) Look-ahead bias 완전 차단**: 1990 년 OOS 예측에 1991+ 정보 절대 안 씀.
   - **(d) Computational cost**: 30 년 × 매년 재학습 = 30 회 학습. 본 논문이 ML 표준 (random split 1 회) 의 30 배 엄격.
   - **결과**: OOS Sharpe 1.53 이 우연이 아닌 **30 년 일관된 결과** 의 증거.
