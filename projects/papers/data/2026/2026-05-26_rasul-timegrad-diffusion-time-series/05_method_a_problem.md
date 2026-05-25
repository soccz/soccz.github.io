# 05a Multivariate Forecasting Setup — Section 3 도입

paper p.3. **Multivariate time series forecasting problem** 의 정확한 setup + DeepAR (Salinas 2019b) baseline 의 한계.

---

## 5a.1 챕터 한 줄 요약

> **"Multivariate 시계열 $\mathbf{x}^0_t \in \mathbb{R}^D$. Context window $[1, t_0]$ + Prediction interval $[t_0, T]$. 본 paper 의 task = $q_X(\mathbf{x}^0_{t_0:T} | \mathbf{x}^0_{1:t_0-1}, \mathbf{c}_{1:T})$ 학습 (Eq 8). DeepAR 의 univariate Gaussian 한계 + Vec-LSTM 의 low-rank covariance 한계 → TimeGrad 가 두 한계 모두 극복."**

---

## 5a.2 Multivariate Setup

paper p.3:
> "We denote the entities of a multivariate time series by $x^0_{i,t} \in \mathbb{R}$ for $i \in \{1, \ldots, D\}$ where $t$ is the time index. Thus the multivariate vector at time $t$ is given by $\mathbf{x}^0_t \in \mathbb{R}^D$."

**기호 뜻**:
- $D$ — multivariate dimension (예: Wikipedia $D = 2,000$, Solar $D = 137$)
- $x^0_{i,t}$ — entity $i$ 의 시점 $t$ 의 scalar 값
- $\mathbf{x}^0_t = (x^0_{1,t}, \ldots, x^0_{D,t})^\top$ — 시점 $t$ 의 $D$ 차원 vector
- $\mathbf{x}^0$ 의 $0$ superscript — diffusion step $n=0$ 표기 (원본 data)

**일상 비유**:
- $D=2,000$ Wikipedia: 2,000 개 Wikipedia 페이지의 daily page views — 한 시점에 2,000 차원.
- $D=963$ Traffic: SF Bay area 963 도로의 hourly occupancy — 한 시점에 963 차원.

---

## 5a.3 Context vs Prediction Window

paper:
> "We are tasked with predicting the multivariate distribution some given prediction time steps into the future and so in what follows consider time series with $t \in [1, T]$, sampled from the complete time series history of the training data, where we will split this contiguous sequence into a context window of size $[1, t_0]$ and prediction interval $[t_0, T]$, reminiscent of seq-to-seq models (Sutskever et al., 2014) in language modeling."

```
              context window           prediction interval
   ─────────────────────────────────────────────────────────
   t = 1, 2, ..., t₀-1, t₀ │ t₀+1, t₀+2, ..., T
   ─────────────────────────┴────────────────────────────────
        (학습 + observed)     (forecasting target)
```

**Setup**:
- **Context**: $\mathbf{x}^0_{1:t_0-1}$ — 학습 시 RNN 통과 → hidden state $\mathbf{h}_{t_0-1}$ 만듦.
- **Prediction**: $\mathbf{x}^0_{t_0:T}$ — 분포 학습 target.

**Seq2seq 비유** (Sutskever 2014):
- NLP: context = 영어 문장, target = 한국어 번역.
- 본 paper: context = 과거 history, target = 미래 distribution.

paper Table 1 의 prediction length:
- Exchange: 30 steps (월)
- Solar/Electricity/Traffic/Taxi: 24 steps (일)
- Wikipedia: 30 steps (월)

---

## 5a.4 Baseline 1 — DeepAR (Univariate Probabilistic)

paper:
> "In the univariate probabilistic DeepAR model (Salinas et al., 2019b), the log-likelihood of each entity $x^0_{i,t}$ at a time step $t \in [t_0, T]$ is maximized over an individual time series' prediction window. This is done with respect to the parameters of some chosen distributional model via the state of an RNN derived from its previous time step $x^0_{i,t-1}$ and its corresponding covariates $\mathbf{c}_{i,t-1}$."

**DeepAR (Salinas 2019b)**:
- **Univariate**: 각 entity $i$ 별도 학습.
- **Parametric**: Gaussian 분포 가정 — $\mu, \sigma$ 만 출력.
- **Per-entity RNN**: hidden state $h_{i,t}$ — entity 별.

**한계**:
1. **Cross-entity correlation 무시**: $D = 2,000$ entities 간 상관 못 잡음.
2. **Gaussian assumption**: multimodal distribution 표현 불가.

**일상 비유**: 30 명 학생 의 성적 예측 시, 각 학생을 **독립적으로** 예측 → 같은 시험 의 difficulty 효과 못 잡음.

paper:
> "The emission distribution model, which is typically Gaussian for real-valued data or negative binomial for count data, is selected to best match the statistics of the time series and the network incorporates activation functions that satisfy the constraints of the distribution's parameters, e.g. a `softplus()` for the scale parameter of the Gaussian."

---

## 5a.5 Baseline 2 — Multivariate Gaussian (Vec-LSTM)

paper:
> "A straightforward time series model for multivariate real-valued data could use a factorizing output distribution instead. Shared parameters can then learn patterns across the individual time series entities through the temporal component — but the model falls short of capturing dependencies in the emissions of the model."

**Factorizing output**:
$$
p(\mathbf{x}^0_t | \mathbf{h}_{t-1}) = \prod_{i=1}^D p(x^0_{i,t} | \mathbf{h}_{t-1})
$$

- 각 entity 별도 분포 + shared parameters.
- **한계**: cross-entity dependency 못 잡음 (paper 명시).

### Full Joint Gaussian — 비현실적

paper:
> "For this, a full joint distribution at each time step has to be modeled, for example by using a multivariate Gaussian. However, modeling the full covariance matrix not only increases the number of parameters of the neural network by $O(D^2)$, making learning difficult but also computing the loss by $O(D^3)$ making it impractical."

**Full Gaussian 의 문제**:
- 파라미터 수: $O(D^2)$ — $D = 2,000$ 이면 **4M 파라미터** for covariance only.
- Loss 계산: $O(D^3)$ — Cholesky decomposition. $D = 2,000$ 이면 **80억 연산**.
- → 비현실적.

### Low-Rank Gaussian — Vec-LSTM (Salinas 2019a)

paper:
> "Approximating Gaussians with low-rank covariance matrices do work however and these models are referred to as Vec-LSTM in (Salinas et al., 2019a)."

**Vec-LSTM-lowrank-Copula**:
$$
\Sigma = D + \mathbf{U}\mathbf{U}^\top, \quad \mathbf{U} \in \mathbb{R}^{D \times r}
$$

- $r$ = rank (예: 10).
- 파라미터: $O(Dr)$ → $D = 2,000, r = 10$ → 20K 파라미터.
- Loss: $O(Dr^2)$ → 200K 연산.

**한계**: **statistical dependencies limited to second-order effects** (paper 명시). Linear correlation 만 표현.

---

## 5a.6 TimeGrad 의 답 — Conditional Diffusion (Eq 8)

paper Eq 8:
$$
q_X(\mathbf{x}^0_{t_0:T} | \mathbf{x}^0_{1:t_0-1}, \mathbf{c}_{1:T}) = \Pi_{t=t_0}^T q_X(\mathbf{x}^0_t | \mathbf{x}^0_{1:t-1}, \mathbf{c}_{1:T})
$$

### 수식 4줄 풀이 — Eq 8

**기호 뜻**:
- $\mathbf{x}^0_{t_0:T}$ — prediction window 의 multivariate 시계열
- $\mathbf{x}^0_{1:t_0-1}$ — context window 의 history
- $\mathbf{c}_{1:T}$ — covariates (시점별, time-dependent embedding + time-independent + lag features)
- $\Pi_{t=t_0}^T$ — autoregressive factorization

**일상 비유**:
- "다음 24 시간 의 multivariate 분포" = "각 시간 의 conditional 분포의 곱".
- 매 시간 $t$ 의 분포 = (이전 모든 history + covariates) 에 조건.
- Autoregressive — RNN 의 자연스러운 형태.

**왜 이 형태인가**:
- **Joint distribution decomposition**: chain rule 의 직접 적용.
- **Autoregressive 의 self-justification**: extrapolation power.
- **각 factor 학습**: conditional diffusion 으로.

**조심할 점**:
- **모든 covariate $\mathbf{c}_{1:T}$ 가 known** 가정. 시간 정보 (day of week, hour of day) 는 known. 외생 변수 (다른 시계열 의 mean) 는 lag 처리.
- 분포 $q_X(\mathbf{x}^0_t | \ldots)$ 학습은 **conditional diffusion** 으로 — 다음 챕터.

paper:
> "we assume that the covariates are known for all the time points and each factor is learned via a conditional denoising diffusion model introduced above."

---

## 5a.7 정리 — 3 가지 multivariate 접근법 비교

| 접근법 | 모델 | 분포 형태 | 한계 |
|--------|------|----------|------|
| **Univariate** | DeepAR | Per-entity Gaussian | Cross-entity correlation 무시 |
| **Factorizing** | Independent Gaussian | $\prod_i p(x_{i,t})$ | Cross-entity dependency 무시 |
| **Full Gaussian** | (hypothetical) | $\mathcal{N}(\mu, \Sigma_{D \times D})$ | $O(D^2)$ 파라미터, $O(D^3)$ loss |
| **Low-rank Gaussian** | Vec-LSTM (Salinas 2019a) | $\Sigma = D + \mathbf{U}\mathbf{U}^\top$ | Second-order effects only |
| **Conditional Diffusion** | **TimeGrad** | DDPM | (Sampling N=100 loop 부담) |

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **DeepAR (univariate) vs TimeGrad (multivariate) 의 결정적 차이는?**
2. **Full multivariate Gaussian 의 $O(D^2)$ 파라미터 + $O(D^3)$ loss 가 왜 비현실적인지 Wikipedia ($D=2,000$) 에서 계산?**
3. **Vec-LSTM (low-rank Gaussian) 가 "second-order effects only" 한계는 어떤 분포에서 실패?**

### 답변

1. **DeepAR**: 각 entity 별도 학습 — Solar 137 series 면 137 모델 (또는 shared weights 의 137 prediction). Cross-entity correlation 무시. **TimeGrad**: 매 시점 $D$ 차원 joint distribution 학습 — series 간 의존성 자동 학습. Conditional diffusion 으로 high-dimensional 가능 ($D = 2,000$ 까지).
2. **파라미터**: $D = 2,000$ → covariance $\Sigma$ 의 unique entries = $D(D+1)/2 = 2{,}001{,}000$ ≈ 2M 파라미터 (covariance only, mean 따로). **Loss**: Cholesky decomposition $O(D^3) = 8 \times 10^9$ 연산 per training step. Batch 32 + N=100 diffusion → $32 \times 100 \times 8 \times 10^9 = 2.5 \times 10^{13}$ 연산 — single V100 GPU 로 1 step 처리도 불가능.
3. **Multimodal distribution** (예: 평상시 vs 이벤트 시 의 두 mode). Gaussian (단봉) 의 변형은 항상 single-mode. **Skewed distribution** (heavy tail) — Solar/Wind 같은 재생에너지의 extreme spike. **Discrete-like distribution** — Wikipedia page views 의 spike. 모두 second-order moment 만으로는 표현 불가. TimeGrad 의 diffusion 은 functional form 자유로 가능.

다음 [05_method_b_rnn_diffusion.md](05_method_b_rnn_diffusion.md) — RNN + Conditional Diffusion (Eq 9, 10) 본문.
