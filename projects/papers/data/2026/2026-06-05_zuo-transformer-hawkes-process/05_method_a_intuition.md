# 05_method_a_intuition — 방법론 (1) 전체 흐름

## 배경 사다리

이 절을 이해하려면 ① **사건 시퀀스** $\{(t_i, k_i)\}_{i=1}^L$ 이 입력이라는 것, ② transformer 의 self-attention 이 "각 token 이 다른 모든 token 에 가중치를 두어 표현을 만든다" 는 것, ③ 점과정의 학습 신호는 **로그가능도** $\sum_i \log \lambda(t_i) - \int \lambda(t) dt$ 라는 것 — 이 셋이면 본 절의 전체 그림이 잡힌다.

---

## 한 장 다이어그램 (지문)

```
입력: 사건 시퀀스
  (t_1, k_1), (t_2, k_2), ..., (t_L, k_L)
   │
   ▼
[1] 임베딩 층
   - event type k_i → 학습 가능 embedding U[k_i]   (차원 d_model)
   - 시각 t_i → temporal_enc(t_i)  (sin/cos sinusoidal, 차원 d_model)
   - 합산: x_i = U[k_i] + temporal_enc(t_i)
   │
   ▼
[2] Transformer Encoder (4 layer × 4 head)
   - 각 EncoderLayer: MultiHeadAttention(self-attn, causal mask) → FFN(GELU)
   - causal mask: i 번째 사건은 1..i-1 까지만 attention
   - 출력: h_1, h_2, ..., h_L  (각 차원 d_model = 64 default / 512 in run.sh)
   │
   ▼
[3] Optional RNN layers (run.sh 에서 hidden=256 LSTM 1-layer)
   - h_j → LSTM → h_j' (옵션, 사용 시 transformer 위에 stack)
   │
   ▼
[4] 강도 헤드 (각 사건 종류 k 마다)
   - 사건 j 직후 사이 시각 t ∈ [t_j, t_{j+1}) 에 대해
   - λ_k(t) = softplus( α_k · (t - t_j)/t_j  +  w_k^T h_j  +  b_k )
   │
   ▼
[5] 예측 헤드 두 개
   - Type predictor: h_j → linear → softmax → P(k_{j+1} | h_j)
   - Time predictor: h_j → linear → scalar → t_{j+1} - t_j 예측 (RMSE 평가)
   │
   ▼
손실 = − log L = − [ Σ_i log λ_{k_i}(t_i) − ∫_{t_1}^{t_L} λ(t) dt ]
        + λ_type · cross_entropy(P(k_{j+1}), k_{j+1}_true)
        + λ_time · MSE(time_pred, time_true) · 100   ← Main.py scaling
```

---

## 왜 이 흐름인가

### 발상의 핵심: "사건 사이의 강도 = 마지막 사건의 표현 + 시간 효과"

호크스 과정의 직접 자기-자극 가정:
$$\lambda(t) = \mu + \sum_{t_i < t} \phi(t - t_i)$$
은 강도가 **모든 과거 사건의 영향 합** 이라는 명제. 이 합을 transformer 가 **사건 $j$ 의 hidden state $h_j$ 라는 한 vector** 로 압축한다고 보면, 사건 사이 $t \in [t_j, t_{j+1})$ 에서의 강도는

$$\lambda(t) = f(h_j, t - t_j)$$

로 환원된다. 즉 **"마지막 사건까지의 이력 압축 $h_j$ + 마지막 사건 이후 경과 시간 $t - t_j$"** 만으로 결정. THP 는 $f$ 를 가장 단순한 형태 — **시간선형 + softplus** — 로 두고, 표현력의 부담을 모두 transformer 인코더($h_j$) 에 떠넘긴다.

이게 왜 좋은가?

1. **사건 사이 임의 시각의 강도를 닫힌형으로 계산**: NHP 처럼 ODE 풀 필요 없음.
2. **적분 $\int \lambda(t) dt$ 가 사건 사이 구간마다 1차원 적분으로 분리** — 수치적분 또는 Monte Carlo 가 쉬움.
3. **Long-range trigger 는 transformer 가 직접 attention 으로 학습** — 강도 헤드의 단순함이 표현력 손실을 일으키지 않음.

### 다이어그램 단계별 코드 매핑

| 단계 | 코드 위치 |
|------|----------|
| [1] event type embedding | `transformer/Models.py::Encoder.__init__` 의 `self.event_emb = nn.Embedding(num_types + 1, d_model, padding_idx=Constants.PAD)` |
| [1] temporal encoding | `Encoder.temporal_enc(time)` — sinusoidal 변환 |
| [2] encoder layer | `transformer/Layers.py::EncoderLayer.forward` |
| [2] self-attn | `transformer/SubLayers.py::MultiHeadAttention.forward` |
| [2] causal mask | `Models.py::get_subsequent_mask` + `get_non_pad_mask` |
| [3] optional RNN | `Models.py::RNN_layers` (LSTM with pack_padded_sequence) |
| [4] intensity head | `Models.py::Predictor` (λ = softplus(α·t_norm + linear(h))) |
| [5] type predictor | `Models.py` 의 `type_predictor = nn.Linear(d_model, num_types)` |
| [5] time predictor | `Models.py` 의 `time_predictor = nn.Linear(d_model, 1)` |
| 학습 손실 | `Utils.py::log_likelihood` + `type_loss` + `time_loss` |

---

## 다른 접근으로 했다면

### 대안 A — NHP 처럼 LSTM 만

- 장점: 적은 데이터에서 빠른 수렴.
- 단점: long-range trigger 표현력 손실. THP 의 가설(Claim 1) 무력화.

### 대안 B — Continuous-time Attention

- 강도 헤드를 단순화하지 않고, attention 자체가 사건 시각 $t$ 의 연속함수가 되도록 변형 (예: attention key/query 에 sinusoidal time embedding 을 곱).
- 장점: 사건 사이 강도가 attention 의 비선형성을 직접 활용.
- 단점: 적분 $\int \lambda(t) dt$ 가 attention 의 시간 의존성 때문에 닫힌형 어려움.
- THP 는 이 대안의 일부 (sinusoidal time encoding) 를 임베딩 층에서만 사용하고 attention 자체는 표준 self-attention 유지.

### 대안 C — Neural ODE 강도

- $\frac{d\lambda}{dt} = g_\theta(\lambda, h_j)$ 로 강도를 ODE 의 해로 정의.
- 장점: 사건 사이 임의 비선형 동력학 표현 가능.
- 단점: 적분이 ODE solver 호출. 추론·학습 비용 큼.
- 후속작 (Neural Hawkes ODE, 2021) 에서 시도되지만 본 논문은 채택 안 함.

---

## 핵심 한 문장 요약

> **THP 의 전체 흐름은 "transformer 인코더가 사건 이력을 한 벡터로 압축 → 그 벡터와 경과시간의 linear-softplus 가 강도" 라는 2-단 architecture 이며, 표현력의 무게중심은 인코더에 있고 강도 헤드는 닫힌형 적분이 가능한 가장 단순한 형태로 의도적으로 두었다.**

다음 절들(`05_method_b` ~ `05_method_e`) 에서 각 단계의 수식과 코드를 4줄 구조(기호뜻 / 일상비유 / 왜이형태 / 조심할점)로 해부.
