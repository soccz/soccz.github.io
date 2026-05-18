# 01 시작하기 전에 — 미리 알아둘 5개 개념

Autoformer 를 읽기 전에 다음 5개를 머릿속에 채워두면 paper 의 모든 한 줄이 즉시 자기 자리에 들어간다.

---

## 1. 시계열 분해(Time Series Decomposition) — STL, AvgPool

시계열 $X_t$ 는 보통 세 성분으로 분해된다 (paper 가 인용하는 표준: Anderson-Kendall [1], Cleveland-STL [33], Hyndman-Athanasopoulos [20]):

$$
X_t = \text{Trend}_t + \text{Seasonal}_t + \text{Residual}_t
$$

- **Trend-cyclical**: 장기 progression. 본 paper 는 단순 moving-average 로 추출 — `AvgPool(Padding(X))`.
- **Seasonal**: 주기성. residual 까지 합쳐서 $X_s = X - X_t$ 로 정의 (Eq 1).

**기존 forecasting 의 관행**: 분해는 사전 처리(pre-processing) 만 가능. 미래는 모르니까 예측 후엔 분해 못함 — Prophet [39], N-BEATS [29], DeepGLO [35].

**Autoformer 의 전환**: 분해를 deep network 의 **inner block** 으로 끌어들임. Decoder 의 hidden representation 단계마다 분해를 수행 → 점진적(progressive) 분해.

---

## 2. 자기상관(Autocorrelation) R(τ)

시계열 $\{X_t\}$ 의 시간 지연 $τ$ 에서의 자기상관(stationary 가정 하):

$$
R_{\mathcal{X}\mathcal{X}}(\tau) = \lim_{L\to\infty} \frac{1}{L} \sum_{t=1}^{L} X_t \, X_{t-\tau}
$$

(Eq 5, paper p.5)

- $R(τ)$ 가 큰 $τ$ → 시계열이 시간 지연 $τ$ 만큼에서 자기 자신과 닮아있음 → **잠재 주기 길이**.
- Self-attention 이 query-key의 내적 ($Q \cdot K^\top$) 으로 **점-사이의 관계**를 본다면, autocorrelation 은 **시간 지연 사이의 관계** 를 본다.

**핵심 직관**: 매일 같은 시각의 traffic 데이터는 비슷한 모양(예: 출근시간대 peak). $\tau = 24$h 의 autocorrelation 이 크면 → "사용자야, 모델이 어제 같은 시간을 봐야 해" 라고 신호.

---

## 3. FFT 와 Wiener–Khinchin 정리

자기상관을 정의대로 모든 lag $\tau \in \{1, \dots, L\}$ 에서 계산하면 $O(L^2)$. 너무 느리다.

**Wiener–Khinchin 정리** [43]: 자기상관은 power spectral density 의 역 푸리에 변환과 같다.

$$
S_{\mathcal{XX}}(f) = \mathcal{F}(X_t) \cdot \mathcal{F}(X_t)^*, \qquad R_{\mathcal{XX}}(\tau) = \mathcal{F}^{-1}(S_{\mathcal{XX}}(f))
$$

(Eq 8)

- $\mathcal{F}$ = FFT, $\mathcal{F}^{-1}$ = IFFT, $*$ = complex conjugate.
- FFT 의 복잡도 $O(L \log L)$ → 모든 lag 자기상관이 **한 번에** 계산됨.
- 즉 "$\text{lag}\ 1, 2, \dots, L$ 의 R(τ) 를 한 번에 얻고 싶다" = FFT 두 번 + 곱 + IFFT 한 번.

**Conjugate(공액)**: 복소수 $a + bi$ → $a - bi$. Power spectrum 이 실수가 되도록 만들기 위함.

---

## 4. Transformer 와 self-attention 의 한계

Transformer [41] 의 self-attention:

$$
\text{Attention}(Q, K, V) = \text{Softmax}\left(\frac{QK^\top}{\sqrt{d}}\right) V
$$

복잡도 $O(L^2)$. 시간점 $i$ 와 시간점 $j$ 사이의 dot-product = **점-사이(point-wise)** 의 관계.

장기 forecasting 의 두 한계 (Section 1):
1. **Quadratic 복잡도**: $L=720$ predict 라면 $L^2 = 518,400$ 연산 per head.
2. **Sparse attention 의 information bottleneck**: Informer [48] (ProbSparse), Reformer [23] (LSH), LogTrans [26] (LogSparse) 가 $L^2$ 를 줄였지만 모두 "선택된 점만 본다" → 정보 손실. 그리고 여전히 point-wise.

**Autoformer 의 답**: point-wise dot-product → series-wise Auto-Correlation (시간 지연 sub-series aggregation).

---

## 5. Encoder–Decoder 구조 (Seq2Seq)

표준 Transformer:
- **Encoder**: 입력 시계열 → 잠재 표현 $X_{en}^{N}$ (N layer 쌓음).
- **Decoder**: encoder 의 잠재 + decoder 의 placeholder 를 입력으로 받아 미래 예측.

**Autoformer 의 변형**:
- Encoder: 입력 length $I$ 의 과거 → 점진적 분해로 **trend 를 제거** (eliminated, paper 의 "$\_$" 기호) → 오직 seasonal 부분만 모델링.
- Decoder: 두 초기 입력 (seasonal init = `[X_ens || X_0]`, trend init = `[X_ent || X_Mean]`) 를 받아, **각 layer 마다 trend 누적**.
- 최종 예측 = `W_S × X_de^M (seasonal) + T_de^M (trend)`.

핵심: trend 는 "**누적**(progressive accumulation)" 으로, seasonal 은 "**refinement**" 로 — 두 path 가 분리.

---

## Wrap-up: 위 5개가 어떻게 결합되는가

| 개념 | Autoformer 에서의 역할 |
|------|----------------------|
| 시계열 분해 | encoder/decoder 의 모든 sub-layer 뒤에 `SeriesDecomp` block 삽입 — Eq 1 |
| 자기상관 R(τ) | self-attention 의 dot-product 대체 — Eq 5–6 |
| FFT + Wiener-Khinchin | R(τ) 를 $O(L\log L)$ 에 계산 — Eq 8 |
| Transformer 한계 | Auto-Correlation 으로 point-wise → series-wise, $O(L^2) \to O(L\log L)$ |
| Encoder-Decoder | 두 경로 (trend 누적 + seasonal refinement) 로 분리 → 점진적 |

이제 다음 chapter 의 Abstract 를 한 문장씩 풀어 읽을 준비가 되었다.
