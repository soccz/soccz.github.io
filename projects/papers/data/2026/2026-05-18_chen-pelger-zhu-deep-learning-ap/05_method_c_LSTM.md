# 05c. Section II.C — RNN with LSTM (Macroeconomic Hidden States)

> Section II.C (paper p.15–17) — 178 macro 시계열 → 4 hidden state.

## 5c.1 챕터 한 줄 요약

178개 macroeconomic 시계열을 **4개 hidden state $h_t$** 로 압축. **RNN** (Recurrent Neural Network) 이 시계열 동학을 학습, **LSTM** (Long-Short-Term-Memory) cells 가 short + long-term 의존성 동시 처리. business cycle 같은 long-range pattern 자동 발견.

---

## 5c.2 왜 LSTM 인가?

paper p.15:
> "Many macroeconomic variables themselves are not stationary. Hence, we need to first perform transformations as suggested in McCracken and Ng (2016), which typically take the form of some difference of the time-series. There is no reason to assume that the pricing kernel has a Markovian structure with respect to the macroeconomic information, in particular after transforming them into stationary increments. For example, business cycles can affect pricing but the GDP growth of the last period is insufficient to learn if the model is in a boom or a recession."

→ **단순 increment 만으로는 boom/recession 구별 불가**. 시계열 dynamic pattern 필요.

---

## 5c.3 Figure 3 — Macro 시계열의 비정상성

![Fig. 3 — Examples of Macroeconomic Variables](figures/page16_macro_examples.png)

*paper p.16 Fig. 3 — 3가지 macro 시계열 (Unemployment, S&P 500, Oil Price). 위 행: 원자료 (non-stationary). 아래 행: McCracken-Ng (2016) 변환 후 (stationary increments).*

paper Fig. 3 note:
> "This figure shows examples of macroeconomic time series with standard transformations proposed by McCracken and Ng (2016)."

→ 단순 차분 후 last increment 만 사용 = **business cycle 정보 손실**.

---

## 5c.4 Hidden State Mapping

paper p.16:

목표: 시계열 $\{x_0, \ldots, x_t\}$ → 상태 $h_t$:
$$
h_t = h(x_0, \ldots, x_t) \quad \text{for } t = 1, \ldots, T
$$

**3가지 후보 매핑**:

### (a) Last increment ($h^\Delta$)
$$
h^\Delta_t = x_t
$$
→ 단순 차분의 마지막 값. **시계열 정보 손실**.

### (b) PCA ($h^{PCA}$)
$$
h^{PCA}_t = W_x x_t \quad (W_x \in \mathbb{R}^{p \times K_h})
$$
→ Ludvigson-Ng (2007) 의 macro factor model. cross-sectional 차원 축소만, **dynamic 못 잡음**.

### (c) RNN/LSTM ($h^{LSTM}$)
$$
h^{LSTM}_t = h^{LSTM}(x_0, \ldots, x_t)
$$
→ 본 논문의 선택. **cross-section + time series 동시** 처리.

---

## 5c.5 Vanilla RNN

paper p.17:
$$
h^{RNN}_t = \sigma(W_h h^{RNN}_{t-1} + W_x x_t + w_0)
$$

**기호 뜻**:
- $\sigma$ — activation function.
- $W_h$ — recurrent weight (이전 상태).
- $W_x$ — input weight.

paper 본문:
> "Intuitively, a vanilla RNN combines two steps: First, it summarize cross-sectional information by linearly combining a large vector $x_t$ into a lower dimensional vector. Second, it is a non-linear generalization of an autoregressive process where the lagged variables are transformations of the lagged observed variables."

**한계** (paper):
> "This type of structure is powerful if only the immediate past is relevant, but it is not suitable if the time series dynamics are driven by events that are further back in the past. Conventional RNNs can encounter problems with exploding and vanishing gradients when considering longer time lags."

→ vanilla RNN 은 **long-range dependency** 못 처리.

---

## 5c.6 LSTM Cells

paper p.17:
> "This is why we use the more complex Long-Short-Term-Memory cells. The LSTM is designed to deal with lags of unknown and potentially long duration in the time series, which makes it well-suited to detect business cycles."

**LSTM 의 핵심 idea** (paper Appendix A.B detailed):
- **Forget gate**: 이전 cell state 의 얼마를 기억할지 결정.
- **Input gate**: 새 정보의 얼마를 cell state 에 더할지 결정.
- **Output gate**: cell state 에서 hidden state 로 얼마 출력할지 결정.

이 gate 구조가 **gradient vanishing 방지** + **long-range memory** 가능.

paper 인용:
> "An LSTM uses different RNN structures to model short-term and long-term dependencies and combines them with a non-linear function. We can think of an LSTM as a flexible hidden state space model for a large dimensional system."

---

## 5c.7 LSTM 의 두 가지 역할

paper p.17:
> "On the one hand it provides a cross-sectional aggregation similar to a latent factor model. On the other hand, it extracts dynamics similar in spirit to state space models, like for example the simple linear Gaussian state space model estimated by a Kalman filter. The strength of the LSTM is that it combines both elements in a general non-linear model."

| 역할 | 비유 |
|------|------|
| Cross-sectional aggregation | Latent factor model (PCA-like) |
| Time series dynamics | State space model (Kalman filter-like) |

→ LSTM = **비선형 factor + 비선형 state space** 통합.

---

## 5c.8 Output: 4 Hidden States

paper p.17:
$$
h_t = h^{LSTM}(x_0, \ldots, x_t) \in \mathbb{R}^{K_h}
$$

본 논문 선택: $K_h = 4$.

paper p.18 (hyperparameter tuning):
> "Our optimal model has two layers, four economic states and eight instruments for the test assets."

→ **4 economic states** = LSTM 의 output dimension.

paper p.17 본문:
> "Note, that each state $h_t$ depends only on current and past macroeconomic increments and has no look-ahead bias."

→ **No look-ahead** — 시점 $t$ 의 state 는 $\leq t$ 정보만 사용.

---

## 5c.9 Two LSTMs: SDF Network vs Conditional Network

paper p.18 (Section II.D 의 footnote 18):
> "We allow for potentially different macroeconomic states for the SDF and the conditional network as the unconditional moment conditions that identify the SDF can depend on different states than the SDF weights."

→ SDF network $h_t$ 와 Conditional network $h^g_t$ 는 **별도 LSTM**.

이유:
- SDF $\omega$ 결정에 중요한 macro state ≠ test asset $g$ 결정에 중요한 state.
- 예: SDF 는 recession 에서 변동성 증가에 민감, $g$ 는 momentum reversal 시점에 민감.

---

## 5c.10 Figure 3 의 자세한 해석 — Macro 시계열의 비정상성

![Fig. 3 — Examples of Macroeconomic Variables](figures/page16_macro_examples.png)

(Figure 3, paper p.16)

### Step 1 — 그림의 구조 이해

**3 columns**: 3 macro time series 예시.
- (a) **Unemployment Rate**.
- (b) **S&P 500 Index**.
- (c) **Oil Price**.

**2 rows**:
- 위: 원자료 (level/raw, non-stationary).
- 아래: McCracken-Ng (2016) 변환 후 (stationary increments).

### Step 2 — 각 column 의 패턴 분석

#### (a) Unemployment Rate
- 위 (raw): 1970-2020 의 큰 cyclical pattern. 1980 + 2009 의 큰 peak.
- 아래 (변환): 거의 random 한 noise. dynamic pattern 사라짐.
- → **원자료의 cyclical 정보가 변환 후 손실**.

#### (b) S&P 500
- 위 (raw): exponential growth (long-run trend).
- 아래 (log return): stationary, but mean 0 근처 random 같음.
- → trend 정보 손실.

#### (c) Oil Price
- 위 (raw): 큰 변동 (1973 oil crisis, 2008 spike, 2014 collapse).
- 아래 (변환): stationary, but **regime shifts 정보** 손실.

### Step 3 — 핵심 메시지

**모든 macro time series 의 raw 가 non-stationary**:
- Linear regression 사용 불가 (spurious regression).
- 차분 (differencing) 필요.

**그러나 차분 후 마지막 값 만으로는**:
- Cyclical pattern 손실.
- Boom vs recession 구별 불가.
- → **LSTM 으로 시계열 전체 dynamic 잡아야 함**.

### Step 3b — paper Fig 3 의 6 sub-panel 정확한 값

paper Fig 3 의 6 sub-panel (3 columns × 2 rows):

#### Column (a): Unemployment Rate
- **Top (raw)**:
  - X-axis: 1970-2020.
  - Y-axis: percent, range **2-12%**.
  - 패턴: cyclical, peak ~12% in 1980-82, ~10% in 2009.
- **Bottom (Δ Unemployment Rate)**:
  - Y-axis: change, range **[-1, +1]** percent.
  - 패턴: stationary noise.
  - → **trend + cycle 정보 사라짐**.

#### Column (b): S&P 500
- **Top (raw)**:
  - Y-axis: index value, range **~10 (1970) to ~2500 (2020)**.
  - 패턴: exponential growth (long-run trend).
- **Bottom (Δ log(S&P 500))**:
  - Y-axis: log return, range **[-0.3, +0.2]**.
  - 패턴: stationary returns, monthly volatility.
  - → **level 과 trend 정보 사라짐, returns 만 보임**.

#### Column (c): Oil Price
- **Top (raw)**:
  - Y-axis: dollars per barrel, range **0-140**.
  - 패턴: 1973 oil crisis spike, 2008 peak (~140), 2014 collapse.
  - 큰 regime shifts.
- **Bottom (Δ² log(Oil Price))**:
  - Y-axis: 2nd difference of log, range **[-1, +1]**.
  - 패턴: 더 stationary, but 큰 spike at 1973.
  - → **regime shifts 정보 약화**.

### Step 3c — 변환 후 정보 손실의 정량화

각 series 의 raw vs 변환 후 정보 비교:

| Series | Raw 정보 | 변환 후 (last increment) | 손실 |
|--------|---------|----------------------|------|
| Unemployment | "현재 실업률 8%" | "지난 달 +0.2%p" | **현재 level 손실** |
| S&P 500 | "현재 index 2500" | "지난 달 +1.5%" | **trend 손실** |
| Oil Price | "현재 $80/bbl" | "지난 달 변화" | **regime 손실** |

→ Raw 의 (level + trend + cycle) 정보 → 변환 후 (last change) 만.

### Step 3d — LSTM 이 어떻게 복원하나

**LSTM 의 input**: 변환된 stationary series ($\Delta x_t$, $\Delta \log x_t$, etc.).

**LSTM 의 output**: hidden state $h_t = h^{LSTM}(x_0, \ldots, x_t)$.

**핵심**: LSTM 이 **시계열 전체 history** ($x_0, \ldots, x_t$) 를 누적 → 단순 last increment 보다 풍부.

비유 (영화):
- Last increment = "마지막 1초 영상 frame" — 줄거리 모름.
- LSTM hidden state = "영화 전체 줄거리 요약" — 어디서 어느 시점인지 안다.

### Step 4 — McCracken-Ng (2016) 변환의 의미

paper 인용:
> "macroeconomic variables themselves are not stationary. Hence, we need to first perform transformations as suggested in McCracken and Ng (2016), which typically take the form of some difference of the time-series."

**변환 종류** (McCracken-Ng 표준):
- Level: no transformation.
- 1st difference: $\Delta x_t = x_t - x_{t-1}$.
- Log: $\log(x_t)$.
- Log difference: $\Delta \log x_t$.
- 2nd difference: $\Delta^2 x_t$.

각 series 마다 적절한 변환 (Augmented Dickey-Fuller test 기반).

→ **Stationary 변환** 후 LSTM 입력.

---

## 5c.11 LSTM 의 내부 구조 — Gate 자세히

paper Appendix A.B 의 LSTM 정의:

### Step 1 — 3 gate 의 역할

| Gate | 수식 (단순화) | 역할 |
|------|------------|------|
| **Forget gate** ($f_t$) | $\sigma(W_f \cdot [h_{t-1}, x_t])$ | 이전 cell state 의 얼마를 잊을지 (0=다 잊음, 1=다 기억) |
| **Input gate** ($i_t$) | $\sigma(W_i \cdot [h_{t-1}, x_t])$ | 새 정보의 얼마를 cell state 에 더할지 |
| **Output gate** ($o_t$) | $\sigma(W_o \cdot [h_{t-1}, x_t])$ | Cell state 의 얼마를 hidden state 로 출력할지 |

### Step 2 — Cell state update

$$
\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t])
$$

$$
C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t
$$

**의미**:
- $C_t$ = current cell state.
- $f_t \odot C_{t-1}$ = forget gate 로 이전 state 일부 유지.
- $i_t \odot \tilde{C}_t$ = input gate 로 새 정보 일부 추가.
- → **Cell state 가 long-range memory** 담당.

### Step 3 — Hidden state output

$$
h_t = o_t \odot \tanh(C_t)
$$

**의미**:
- Hidden state = cell state 의 일부 + output gate.
- 다음 step 에 사용 + downstream task (예: SDF prediction) 에 사용.

### Step 4 — Long-range memory 의 비밀

**Cell state $C_t$ 의 update**:
- $C_t = f_t \cdot C_{t-1} + i_t \cdot \tilde{C}_t$.
- $f_t \approx 1$ 이면 $C_t \approx C_{t-1}$ — 정보 유지.
- → **Gradient 가 시간 거슬러 살아있음** (backprop 시).

vs vanilla RNN:
- $h_t = \sigma(W_h h_{t-1} + W_x x_t)$.
- $\partial h_t / \partial h_{t-1} = \sigma'(\cdot) \cdot W_h$.
- $\sigma'$ (예: sigmoid) 는 항상 < 1 → 곱이 exponentially decay.
- → Long-range gradient vanish.

→ **LSTM 의 cell state 가 gradient highway 역할**.

### Step 5 — 비유 (회사 archive)

**LSTM 의 cell state**:
- 회사의 archive (장기 저장소).
- Forget gate: "오래된 문서 폐기 결정".
- Input gate: "새 문서 archive 추가 결정".
- Output gate: "archive 에서 현재 업무에 필요한 것 꺼냄".

**vs vanilla RNN**:
- 매일 모든 문서를 다시 쓰기 — 너무 빨리 잊음.

→ LSTM 이 **선택적 장기 기억** 가능.

---

## 5c.12 자기점검 (이 챕터)

### 핵심 5가지
1. **단순 macro 차분 (vanilla RNN $h^\Delta$) 의 한계는?**
2. **LSTM 의 gate 구조가 vanilla RNN 보다 좋은 이유?**
3. **SDF network 와 conditional network 의 LSTM 이 별도인 이유?**
4. **McCracken-Ng (2016) 변환이 왜 필요한가?**
5. **LSTM 의 cell state 가 long-range memory 담당하는 메커니즘은?**

### 답변
1. **시간 동학 손실**. GDP growth 의 마지막 차분만으로는 boom/recession 구별 불가. business cycle 은 long-range pattern (수년~수십년) 인데 단순 차분은 이를 못 잡음.
2. **Gradient vanishing 해결**. Vanilla RNN 은 backprop 시 $W_h$ 의 곱이 쌓이면서 gradient 가 exponentially decay/explode. LSTM 의 **cell state** 는 gate 로 정보를 선택적으로 통과시켜 long-range gradient 가 살아있음. → "기억할 가치 있는 것만 장기 보관".
3. 두 네트워크의 **objective 가 다름** — SDF 는 pricing error 최소화 (어떤 macro state 가 pricing 에 중요), conditional 은 mispriced asset 발견 (어떤 macro state 가 모델 약점 드러내는지). 다른 task 에 다른 representation 이 필요하므로 **별도 LSTM** 으로 학습.
4. Macro 시계열의 **raw 가 non-stationary** (예: GDP, S&P 500 의 long-run trend). Linear analysis 에서 spurious regression 위험. McCracken-Ng 가 각 series 별 적절한 변환 (1st diff, log diff 등) 제안. 그러나 변환 후에도 **cyclical pattern 필요** → LSTM 으로 시계열 dynamic 복구.
5. Cell state $C_t = f_t \cdot C_{t-1} + i_t \cdot \tilde{C}_t$. Forget gate $f_t \approx 1$ 이면 $C_t \approx C_{t-1}$ — 정보 유지. → Gradient 가 시간 거슬러 갈 때 $\partial C_t / \partial C_{t-1} \approx 1$ — gradient highway 역할. vs vanilla RNN 의 $\sigma' < 1$ exponential decay. **LSTM 이 선택적 장기 기억** 가능.
