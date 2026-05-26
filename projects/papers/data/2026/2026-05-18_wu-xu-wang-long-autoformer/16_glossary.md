# 16. Glossary & Notation — 용어집 + 기호 사전

> **🧒 한 줄 요약**: 용어 사전. Series decomposition / auto-correlation / FFT 정리.


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

**일상 비유 — 용어집 의 역할**: *각 용어 가 영어 + 약어 + 출처* 의 *수학/통계 의 cheat sheet*. 본 deep dive 의 *다른 챕터* 에서 만난 용어 의 *빠른 참조*. 본 챕터 는 *순서 무관 + 사전 형식*.

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

## paper References [1]–[48] 전체 (paper p.11–12)

48개 reference 모두를 본 paper 에서의 **역할** 과 함께 정리. paper text 의 어떤 부분 (Sec/Eq/Table/Fig) 에서 인용되는지 명시.

### 시계열 / 분해 관련 (고전 + 현대)

| 번호 | 저자 (연도) | 종류 | 본 paper 에서의 역할 |
|------|-----------|------|--------------------|
| **[1]** | Anderson, Kendall (1976) | 통계 textbook | 시계열 분해 표준 (Sec 2.2, 3.1) + ARIMA implementation (Sec 4 baseline) |
| [2] | Asadi, Regan (2020) | App. Soft Comput. | spatio-temporal decomposition pre-processing — Sec 2.2 |
| [6] | Box, Jenkins (1970) | textbook | ARIMA 의 고전 — Sec 2.1 |
| [7] | Box, Jenkins (1968) | JR Stat Soc | ARIMA 의 출발 — Sec 2.1 |
| [9] | Chatfield (1981) | textbook | stochastic process 이론 (Auto-Corr의 이론적 근거) — Sec 1, 3.2 |
| [11] | Christiano, Fitzgerald (2003) | Int. Econ. Rev. | band-pass filter — Appendix D Table 9 |
| [18] | Hodrick, Prescott (1997) | J. Money Credit Bank | business cycle filter — Appendix D Table 9 |
| **[20]** | Hyndman, Athanasopoulos (2018) | textbook | "Forecasting: principles and practice" — Sec 1, 2.2, 3.1 의 핵심 인용 |
| [30] | Papoulis, Saunders (1989) | textbook | "Probability, random variables, stochastic processes" — Sec 1, 3.2 이론 |
| **[33]** | Cleveland et al. (1990) | J. Off. Stat | STL (Seasonal-Trend Loess decomposition) — Sec 2.2, 3.1, Table 9 |
| [38] | Sorjamaa et al. (2007) | Neurocomputing | long-term prediction methodology — Sec 2.1 |
| [44] | Woitek (1998) | working paper | Baxter-King filter — Appendix D Table 9 |
| **[43]** | Wiener (1930) | Acta Math | Wiener-Khinchin theorem — Eq 8 의 근거 |

### Deep Forecasting Baselines (본 paper 비교 대상)

| 번호 | 저자 (연도) | 모델 / 종류 | 본 paper 에서의 역할 |
|------|-----------|------------|--------------------|
| [4] | Bai, Kolter, Koltun (2018) | **TCN** | Tables 1, 5 baseline (multivariate) |
| [5] | Borovykh, Bohte, Oosterlee (2017) | CNN forecasting | Sec 2.1 surveying |
| [10] | Chen, Tao (2021) | symplectic Hamiltonian | Sec 2.1 classic tools |
| [12] | de Bézenac et al. (2020) | normalizing Kalman | Sec 2.1 filtering |
| **[17]** | Hochreiter, Schmidhuber (1997) | **LSTM** | Tables 1, 10 baseline |
| [24] | Kurle et al. (2020) | Rao-Blackwellised particles | Sec 2.1 |
| **[25]** | Lai et al. (2018, SIGIR) | **LSTNet** | Tables 1, 5 baseline + Exchange dataset 출처 |
| **[26]** | Li et al. (2019, NeurIPS) | **LogTrans (LogSparse)** | Tables 1-4 baseline, $O(L(\log L)^2)$ |
| [28] | Maddix, Wang, Smola (2018) | Deep Gaussian factors | Sec 2.1 |
| **[29]** | Oreshkin et al. (2019, ICLR) | **N-BEATS** | Sec 2.2 + Table 2 univariate baseline |
| [31] | Paszke et al. (2019) | PyTorch | implementation framework |
| [32] | Rangapuram et al. (2018) | deep state space | Sec 2.1 |
| **[34]** | Salinas et al. (2020) | **DeepAR** | Sec 2.1 + Table 2 univariate baseline |
| **[35]** | Sen, Yu, Dhillon (2019) | **DeepGLO (matrix decomp)** | Sec 2.2 — pre-processing decomp |
| [36] | Shih, Sun, Lee (2019) | temporal pattern attention | Sec 2.1 |
| [37] | Song et al. (2018, AAAI) | Attend and Diagnose | Sec 2.1 |
| **[39]** | Taylor, Letham (2018) | **Prophet (trend-seasonality)** | Sec 2.2 + Table 2 univariate baseline |
| [40] | van den Oord et al. (2016) | WaveNet | Sec 2.1 TCN ancestor |
| [42] | Wen et al. (2017, NeurIPS) | multi-horizon quantile | Sec 2.1 |
| [45] | Wu et al. (2020, NeurIPS) | adversarial sparse transformer | Sec 2.1 |
| [46] | Yao et al. (2017, IJCAI) | dual-stage attention RNN | Sec 2.1 |
| [47] | Yu et al. (2017) | tensor-train RNN | Sec 2.1 |

### Transformer 계보 (본 paper 의 직접 비교)

| 번호 | 저자 (연도) | 모델 | 본 paper 에서의 역할 |
|------|-----------|------|--------------------|
| [3] | Bahdanau, Cho, Bengio (2015) | attention NMT | Sec 2.1 + Table 5 LSTMa baseline |
| [8] | Brown et al. (2020) | GPT-3 | Sec 1 — big Transformer 사례 |
| [13] | Devlin et al. (2019) | BERT | Sec 1 — Transformer 응용 |
| [16] | Dosovitskiy et al. (2021) | ViT | Sec 1 — vision 응용 |
| [19] | Huang et al. (2019) | Music Transformer | Sec 1 — audio 응용 |
| **[23]** | Kitaev, Kaiser, Levskaya (2020, ICLR) | **Reformer (LSH)** | Tables 1-4 baseline, $O(L \log L)$ |
| [27] | Liu et al. (2021, ICCV) | Swin Transformer | Sec 1 |
| **[41]** | Vaswani et al. (2017, NeurIPS) | **Transformer** | Sec 1, 3.1 baseline + Eq 7 multi-head 형식 |
| **[48]** | Zhou et al. (2021, AAAI) | **Informer (ProbSparse)** | Tables 1-4 baseline + **ETT dataset 출처** |

### Misc 도구

| 번호 | 저자 (연도) | 의미 | 본 paper 에서의 역할 |
|------|-----------|------|--------------------|
| [14] | Diebold, Kilian (2001) | predictability theory | Sec H Broader Impact 의 robustness 한계 |
| **[15]** | Dong, Du, Gardner (2020, Lancet) | COVID dashboard | **COVID dataset (Appendix F)** 출처 |
| [21] | Ioffe, Szegedy (2015) | batch normalization | Sec G.1 — Algorithm 3/4 의 BN-style speedup 의 inspiration |
| **[22]** | Kingma, Ba (2015) | **Adam** | Sec 4 optimizer |

→ **합계: 48 references, 모두 paper 본문 / Appendix 에서 인용 위치 확인**. 

### Reference 의 분포 분석

```
시계열/분해 (고전): [1, 2, 6, 7, 9, 11, 18, 20, 30, 33, 38, 43, 44] — 13개
Deep Forecasting baselines: [4, 5, 10, 12, 17, 24, 25, 26, 28, 29, 31, 32, 34, 35, 36, 37, 39, 40, 42, 45, 46, 47] — 22개
Transformer 계보: [3, 8, 13, 16, 19, 23, 27, 41, 48] — 9개
Misc: [14, 15, 21, 22] — 4개
```

**Bold (●)** = 본 paper 가 가장 빈번히 인용 / 핵심 baseline. 총 17개.

→ paper 의 학문적 lineage 가 명확:
- **Time series 의 고전** (Box-Jenkins, STL, Hyndman) 위에
- **Stochastic process 이론** (Chatfield, Papoulis, Wiener) 으로 자기상관 정당화
- **Transformer 의 efficient 변형** (Informer, Reformer, LogTrans) 을 baseline
- **분해 기반 forecasting** (Prophet, N-BEATS, DeepGLO) 와 차별화

이 3 학문적 흐름의 통합이 본 paper 의 contribution.

---

## 자기점검

### 핵심 3가지
1. **본 deep dive 에서 가장 자주 쓰이는 *3 약어*?**
2. **본 paper 의 핵심 *symbol notation*?**
3. **48 references 의 *학문적 lineage*?**

### 답변
1. **(1) Auto-Correlation** — Eq 5-7 의 핵심 mechanism. **(2) SeriesDecomp** — Eq 1 의 핵심 block. **(3) FFT** — Eq 8 의 efficient computation 도구. 이 셋 이 *Autoformer 의 핵심 contribution* 의 3 축.
2. **시계열**: $\mathcal{X} \in \mathbb{R}^{L \times d}$, $I$ (input length), $O$ (output length). **분해**: $\mathcal{X}_s$ (seasonal), $\mathcal{X}_t$ (trend). **Encoder/Decoder**: $\mathcal{S}_{en/de}^{l,i}$, $\mathcal{T}_{de}^{l,i}$ — *layer l 의 i-th 분해 후 seasonal/trend*. **Auto-Corr**: $R_{\mathcal{Q},\mathcal{K}}(\tau)$, $\tau_1, ..., \tau_k$, $\text{Roll}(\mathcal{V}, \tau)$. *Paper 의 표기 그대로*.
3. **3 학문적 흐름의 통합**: (1) **시계열 의 고전 분석** (Box-Jenkins, STL, Hyndman) — 13개. (2) **Stochastic process 이론** (Chatfield, Papoulis, Wiener) — Auto-Correlation 의 *수학적 정당화*. (3) **Transformer 변형** (Informer, Reformer, LogTrans) — *baseline + 차별화 대상*. (4) **분해 기반 forecasting** (Prophet, N-BEATS) — *극복 대상*. 총 48 references — *시계열 + 통계 + Deep Learning* 의 *교차*.

---

다음 [17_insights.md](17_insights.md) 에서 메타 통찰.
