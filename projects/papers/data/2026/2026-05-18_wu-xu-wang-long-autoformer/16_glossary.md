# 16 Glossary & Notation

## 핵심 약어

| 약어 | 풀이 | 출처 |
|------|------|------|
| FFT | Fast Fourier Transform | Cooley-Tukey, paper Eq 8 |
| IFFT | Inverse FFT | Eq 8 |
| MSE | Mean Squared Error | Tables 1-11 |
| MAE | Mean Absolute Error | Tables 1-11 |
| SeriesDecomp | 본 paper 의 series decomposition block | Eq 1 |
| Auto-Corr | Auto-Correlation mechanism | Eq 5-7 |
| STL | Seasonal-Trend decomposition by Loess | [33] Cleveland 1990 |
| HP | Hodrick-Prescott filter | [18] |
| CF | Christiano-Fitzgerald filter | [11] |
| BK | Baxter-King filter | [44] |
| LSH | Locality-Sensitive Hashing | Reformer [23] |
| LogSparse | Log-sparse attention | LogTrans [26] |
| ProbSparse | Probability-Sparse (KL-divergence based) | Informer [48] |
| ETT | Electricity Transformer Temperature | Informer [48] dataset |
| ILI | Influenza-Like Illness | CDC |
| FFN | Feed-Forward Network | Transformer block |

---

## 표기법 (paper 의 표기 그대로)

### 시계열

| 기호 | 의미 |
|------|------|
| $\mathcal{X}_t$ | 시점 $t$ 의 시계열 값 (scalar 또는 vector) |
| $\mathcal{X} \in \mathbb{R}^{L \times d}$ | 길이 $L$, 변수 $d$ 의 시계열 |
| $I$ | 입력 길이 (past length) |
| $O$ | 출력 길이 (predict length) |

### 분해

| 기호 | 의미 |
|------|------|
| $\mathcal{X}_s$ | seasonal part |
| $\mathcal{X}_t$ | trend-cyclical part |
| $\mathcal{X}_{ens}$, $\mathcal{X}_{ent}$ | encoder 입력 latter half 의 decomp |
| $\mathcal{X}_{des}$, $\mathcal{X}_{det}$ | decoder 입력 (seasonal init, trend init) |
| $\mathcal{X}_0$ | placeholder 0 (decoder seasonal init 의 미래 부분) |
| $\mathcal{X}_{\text{Mean}}$ | placeholder mean (decoder trend init 의 미래 부분) |
| $\mathcal{S}_{en}^{l,i}$ | $l$-th encoder layer 의 $i$-th SeriesDecomp 후 seasonal |
| $\mathcal{T}_{de}^{l,i}$ | $l$-th decoder layer 의 $i$-th 분해 후 trend |

### Auto-Correlation

| 기호 | 의미 |
|------|------|
| $R_{\mathcal{X}\mathcal{X}}(\tau)$ | $\mathcal{X}$ 의 자기상관, 시간 지연 $\tau$ |
| $R_{Q,K}(\tau)$ | $Q$ 와 $K$ 의 cross-autocorrelation |
| $\hat{R}_{Q,K}(\tau_i)$ | softmax 정규화된 R |
| $\mathcal{S}_{\mathcal{X}\mathcal{X}}(f)$ | power spectral density (frequency $f$) |
| $\tau$ | 시간 지연 (lag) |
| $k$ | Top-k 의 k, $k = \lfloor c \log L \rfloor$ |
| $c$ | Top-k 의 hyperparameter (1-3) |
| $\text{Roll}(V, \tau)$ | $V$ 를 $\tau$ 만큼 cyclic shift |

### 모델

| 기호 | 의미 |
|------|------|
| $N$ | encoder layer 수 (= 2) |
| $M$ | decoder layer 수 (= 1) |
| $d_{\text{model}}$ | hidden 차원 |
| $h$ | multi-head 개수 |
| $W_{l,i}$ | $l$-th decoder layer 의 $i$-th trend projector |
| $W_{\mathcal{S}}$ | 최종 seasonal → output projector |

---

## 핵심 수식 정리

### Eq 1 — Series Decomposition
$$
\mathcal{X}_t = \text{AvgPool}(\text{Padding}(\mathcal{X})), \quad \mathcal{X}_s = \mathcal{X} - \mathcal{X}_t
$$

### Eq 5 — Autocorrelation
$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \lim_{L\to\infty} \frac{1}{L} \sum_{t=1}^{L} \mathcal{X}_t \mathcal{X}_{t-\tau}
$$

### Eq 6 — Auto-Correlation 메커니즘
$$
\tau_1, \dots, \tau_k = \arg\,\text{Topk}_\tau\!(R_{Q,K}(\tau))
$$
$$
\hat{R}_{Q,K}(\tau_i) = \text{Softmax}(R_{Q,K}(\tau_i))
$$
$$
\text{Auto-Corr}(Q, K, V) = \sum_{i=1}^k \text{Roll}(V, \tau_i) \cdot \hat{R}_{Q,K}(\tau_i)
$$

### Eq 8 — Wiener-Khinchin (FFT 기반)
$$
\mathcal{S}_{\mathcal{X}\mathcal{X}}(f) = \mathcal{F}(\mathcal{X}_t) \cdot \mathcal{F}^*(\mathcal{X}_t), \quad R_{\mathcal{X}\mathcal{X}}(\tau) = \mathcal{F}^{-1}(\mathcal{S}_{\mathcal{X}\mathcal{X}}(f))
$$

---

## 자주 헷갈리는 점

1. **Series-wise ≠ Series-prediction**
   - Auto-Correlation 이 series-wise = 연결 단위가 sub-series.
   - 출력은 여전히 시점별 값.

2. **Top-k $\tau$ ≠ Top-k 점 선택 (sparse attention)**
   - $\tau$ = 시간 지연 (어떤 lag 가 중요한지).
   - sparse attention 의 점 = 어떤 시점이 중요한지.
   - $\tau$ 가 선택되면 그 lag 의 **시리즈 전체** 가 참여 → 정보 손실 없음.

3. **Pre-decomposition (Sep) ≠ Inner decomposition (Ours)**
   - Sep: 데이터를 trend/seasonal 로 나눈 후, **두 모델** 로 따로 예측 → 마지막에 합산.
   - Ours: **하나의 모델**, **각 layer** 가 분해. Layer 간 상호작용 가능.

4. **"$\_$" 기호**
   - paper Eq 3 의 encoder 에서 `S, _ = SeriesDecomp(...)` — `_` 는 **버려진 trend**.
   - encoder 는 trend 를 모델링하지 않으므로.

5. **$I/2 + O$ vs $I + O$**
   - decoder 입력 길이의 default 는 $I/2 + O$.
   - $I + O$ 는 marginal benefit, memory 증가 (Table 8).

---

## 참고할 referenced works (paper 의 reference 번호)

| 번호 | 저자 | 본 paper 에서의 역할 |
|------|------|--------------------|
| [1] | Anderson-Kendall (1976) | 시계열 분해 표준 |
| [9] | Chatfield (1981) | stochastic process 이론 |
| [15] | Dong-Du-Gardner (2020) | COVID-19 dataset |
| [17] | Hochreiter-Schmidhuber (1997) | LSTM |
| [22] | Kingma-Ba (2015) | Adam optimizer |
| [23] | Kitaev (2020) | Reformer (LSH) |
| [25] | Lai (2018) | LSTNet, Exchange dataset |
| [26] | Li (2019) | LogTrans (LogSparse) |
| [29] | Oreshkin (2019) | N-BEATS |
| [30] | Papoulis-Saunders (1989) | stochastic process 이론 |
| [33] | Cleveland (1990) | STL |
| [34] | Salinas (2020) | DeepAR |
| [39] | Taylor-Letham (2018) | Prophet |
| [41] | Vaswani (2017) | Transformer (self-attention) |
| [43] | Wiener (1930) | Wiener-Khinchin theorem |
| [48] | Zhou (2021) | Informer, ETT dataset |

다음 [17_insights.md](17_insights.md) 에서 메타 통찰.
