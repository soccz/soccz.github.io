# 05_method_d — 방법론 (4) 연속시간 강도함수

## 이 부분이 왜 필요한가

점과정의 모든 학습 신호는 **조건부 강도함수** $\lambda_k(t \mid \mathcal{H}_t)$ 의 정확한 값을 사건 시각과 사건 사이 시각 모두에서 평가할 수 있어야 가능하다. 사건 시각 $t_i$ 에서의 값은 $\log \lambda$ 항 (사건 발생 확률 기여), 사건 사이 시각 $t \in [t_j, t_{j+1})$ 에서의 값은 $\int \lambda(t) dt$ 항 (사건 미발생 확률 기여) 에 들어간다. 따라서 **transformer 의 출력 $h_j$ (사건 $j$ 직후 마지막 hidden) → 사건 사이 임의 시각 $t$ 의 강도 $\lambda_k(t)$** 라는 함수가 **닫힌형으로 정의되어야** 한다.

THP 는 이 함수를 가장 단순한 형태로 둔다.

---

## 핵심 수식

사건 종류 $k \in \{1, \ldots, K\}$ 의 시각 $t \in [t_j, t_{j+1})$ 에서의 강도:

$$\boxed{\lambda_k(t \mid \mathcal{H}_t) = f_k\!\left( \alpha_k \cdot \frac{t - t_j}{t_j} + w_k^\top h_j + b_k \right)}$$

여기서 $f_k(x) = \beta_k \log(1 + \exp(x / \beta_k))$ 는 **temperature-scaled softplus** ($\beta_k > 0$ 는 "softness" 학습 가능).

전체 강도(모든 종류 합):

$$\lambda(t) = \sum_{k=1}^K \lambda_k(t)$$

### 4줄 해석

1. **기호 뜻**:
   - $h_j \in \mathbb{R}^d$ : transformer 인코더가 사건 1, ..., $j$ 까지의 이력을 압축한 hidden state
   - $w_k \in \mathbb{R}^d$ : 종류 $k$ 의 강도 헤드 weight (학습 가능)
   - $b_k \in \mathbb{R}$ : 종류 $k$ 의 base bias
   - $\alpha_k \in \mathbb{R}$ : 종류 $k$ 의 **시간 계수** — 사건 사이 시간이 지남에 따라 강도가 얼마나, 어느 부호로 변하는지
   - $(t - t_j) / t_j$ : **상대 경과 시간** (현재 시각 $t$ 가 마지막 사건 $t_j$ 의 몇 배인가의 normalized 값)
   - softplus: $\log(1 + \exp(\cdot))$, 출력 항상 양수
2. **일상 비유**: 마지막 폭죽이 터진 직후의 다음 폭죽 강도는 (a) **방금 폭죽까지 본 풍경 기억 $h_j$** 가 결정한 출발값 $w_k^\top h_j + b_k$, 거기에 (b) **시간이 지남에 따라 올라가거나 내려가는 효과** $\alpha_k \cdot (t - t_j)/t_j$ 를 더한 뒤, (c) **음수가 되지 않도록 softplus 로 부드럽게** 위로 누르는 식. 부호 자유도 = 폭죽 종류에 따라 시간이 지나면 빈도가 늘기도(잔향) 줄기도(피로) 함을 학습.
3. **왜 이 형태**:
   - **(a) 시간선형 + softplus 가 최소 표현**: 시간에 대해 단조 변화 (선형) 하다가 softplus 가 음수를 차단. 가장 단순한 nonparametric 단조성 보장.
   - **(b) 학습 가능 $\alpha_k$ 의 부호**: $\alpha_k > 0$ 이면 강도 증가 (자기-자극 잔향), $\alpha_k < 0$ 이면 감소 (피로/소진). RMTPP 의 단조 가정과 일치하지만 부호 학습.
   - **(c) softplus 의 numerical stability**: ReLU 처럼 hard cut 없이 부드럽게 양수 보장 → gradient 안정.
   - **(d) 닫힌형**: $h_j$ 는 사건 $j$ 시점에 한 번만 계산 → 사건 사이 어느 $t$ 든 위 수식으로 직접 강도 계산. ODE solver 호출 불필요.
4. **조심할 점**:
   - **$t_j$ 가 0 또는 매우 작으면**: $(t - t_j)/t_j$ 가 폭발. 시퀀스의 첫 사건이 $t_1 = 0$ 이면 0 나눗셈. 데이터 전처리에서 $t_1$ 을 offset 으로 빼거나 epsilon 더해야 함.
   - **선형 시간 항의 표현력**: 강도가 사건 사이에서 U-shape (감쇠 후 재상승) 인 패턴은 표현 불가. 다만 attention 으로 $h_j$ 가 이미 풍부한 이력 정보를 담고 있으면, 다음 사건 직전의 사건 (또 다른 $j+1$) 이 다른 $h_{j+1}$ 로 재시작 → 시퀀스 단위로는 비단조 표현 가능.
   - **다중 사건 종류 간 상호작용**: $\lambda_k$ 가 모두 같은 $h_j$ 에 의존 → 사건 종류 간 의존성은 $w_k$ 의 학습으로만 표현. 명시적 mutual-excitation 행렬 ($\alpha_{k, k_i}$ 같은) 없음.
   - **$\beta_k$ 의 역할**: softplus 의 softness 가 학습 가능 → 작은 $\beta_k$ = ReLU 에 가깝게 sharp, 큰 $\beta_k$ = 매우 부드러움. 데이터셋의 강도 spiky 정도에 자동 적응.

---

## 코드 verbatim 매핑

`transformer/Models.py::Predictor` 클래스 (강도 헤드):

```python
class Predictor(nn.Module):
    """ Prediction of next event type. """

    def __init__(self, dim, num_types):
        super().__init__()
        self.linear = nn.Linear(dim, num_types, bias=False)
        nn.init.xavier_normal_(self.linear.weight)

    def forward(self, data, non_pad_mask):
        out = self.linear(data)
        out = out * non_pad_mask
        return out
```

위는 type 예측 헤드. 강도 헤드는 `Models.py::Transformer.__init__` 에서:

```python
# convert hidden vectors into a scalar
self.linear = nn.Linear(d_model, num_types)
# parameter for the weight of time difference
self.alpha = nn.Parameter(torch.tensor(-0.1))
# parameter for the softplus function
self.beta = nn.Parameter(torch.tensor(1.0))
```

그리고 `forward`:

```python
def forward(self, event_type, event_time):
    ...
    enc_output = self.encoder(event_type, event_time, non_pad_mask)
    enc_output = self.rnn(enc_output, non_pad_mask) if self.has_rnn else enc_output
    time_prediction = self.time_predictor(enc_output, non_pad_mask)
    type_prediction = self.type_predictor(enc_output, non_pad_mask)
    return enc_output, (type_prediction, time_prediction)
```

`Utils.py::softplus` (numerical stability):

```python
def softplus(x, beta):
    # hard thresholding at 20
    temp = beta * x
    temp[temp > 20] = 20
    return 1.0 / beta * torch.log(1 + torch.exp(temp))
```

**상세 해석**:
- `alpha = nn.Parameter(torch.tensor(-0.1))` : **단일 스칼라** (사건 종류별 분리되어 있지 않음 — 초기 구현은 종류 무관 동일 $\alpha$). 후속 layer 에서 종류별로 확장하거나 코드에서 broadcast.
- `beta = nn.Parameter(torch.tensor(1.0))` : softplus softness. 학습 가능.
- `temp[temp > 20] = 20` : $\exp$ 의 overflow 방지. softplus 의 hard threshold. $\exp(20) \approx 4.85 \times 10^8$ 이상은 cap.

`Utils.py::compute_event` (사건 시각의 $\log \lambda$):

```python
def compute_event(event, non_pad_mask):
    """ Log-likelihood of events. """
    # add 1e-9 in case some events have 0 likelihood
    event += math.pow(10, -9)
    event.masked_fill_(~non_pad_mask.bool(), 1.0)
    result = torch.log(event)
    return result
```

`event` 는 사건 시각에서 평가한 $\lambda_{k_i}(t_i)$ 값. log 안정성을 위해 $10^{-9}$ 더하기.

---

## 강도 헤드의 부호 자유도가 핵심인 이유

**예제 1 — 자기-자극 도메인 (트위터 리트윗)**

리트윗 사건은 한 번 발생하면 다음 리트윗이 곧이어 발생할 확률이 잠시 ↑ 한다. 즉 사건 직후 강도가 ↑ 다음 천천히 ↓. THP 강도식에서 $\alpha_k < 0$ 이면 시간 지남에 따라 강도 ↓ (자기 감쇠). $w_k^\top h_j > 0$ 이 초기값을 끌어올림.

**예제 2 — 소진 도메인 (은행 출금)**

한 명이 ATM 에서 인출하면 그 다음 같은 사람이 곧 다시 인출할 확률은 ↓. 강도가 시간 지남에 따라 ↑ 천천히 회복. THP 에서 $\alpha_k > 0$ 이면 시간 지남에 따라 강도 ↑.

**예제 3 — 진동 도메인 (24시간 주기 거래)**

낮에 매수, 밤에 매도가 반복. THP 의 선형 시간 항으로는 단일 주기 표현 불가. 단 $h_j$ 가 사건 시각의 sinusoidal time encoding 을 이미 머금고 있으므로, attention 이 적절히 가중하면 다음 사건 직전 (다음 $h_{j+1}$ 재계산) 에 시각 정보가 복원. 한 구간 안에서의 진동은 표현 불가 (한계).

---

## 다른 접근으로 했다면

### 대안 A — Hawkes parametric 강도

$\lambda_k(t) = \mu_k + \sum_{t_i < t} \alpha_{k k_i} \exp(-\beta (t - t_i))$. **장점**: 해석 가능. **단점**: 표현력 제한. THP 가 transformer 의 표현력을 활용해 이 한계를 깬다.

### 대안 B — NHP continuous-time LSTM

$\lambda_k(t) = f(\text{LSTM}_c(t))$. **장점**: 사건 사이에서 강도가 비단조 변할 수 있음. **단점**: ODE-like 적분 필요. 학습/추론 비용.

### 대안 C — Flow-based 강도 (Normalizing Flow Hawkes)

$\lambda_k(t) = \exp(\text{NF}(t, h_j))$. **장점**: 임의 분포 표현. **단점**: 적분의 닫힌형 어려움.

### 대안 D — Discrete-time mixture (모든 시각을 bin 으로)

$\lambda_k(t)$ 를 bin 의 확률로 근사. **장점**: 직관. **단점**: bin 크기 결정의 임의성.

### THP 의 선택

**가장 단순한 시간선형 + softplus**. 표현력을 자제하고 **닫힌형 적분 가능 + 추론 효율** 을 우선. attention 의 표현력이 $h_j$ 에 모두 들어가도록 책임 분담.

---

## 핵심 한 문장 요약

> **THP 의 강도 헤드는 "transformer hidden state 의 affine + 단조 시간선형 + softplus" 라는 3-항 minimal 구조이며, 표현력의 무게중심을 attention 인코더로 이동시키고 강도 헤드는 사건 사이 임의 시각의 강도를 closed-form 으로 계산 가능하게 만드는 인터페이스 역할만 한다.**

다음 절(`05_method_e`) 에서 이 강도를 가지고 어떻게 로그가능도를 계산해 학습 신호를 만드는지 본다.
