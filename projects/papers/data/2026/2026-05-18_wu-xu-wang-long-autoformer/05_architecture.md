# 05 Decomposition Architecture — Section 3.1

paper p.3–4 의 Section 3.1 — 본 paper 가 propose 하는 architecture 의 본체.

![Fig. 1 Autoformer architecture](figures/page4_Fig1_architecture.png)

(Figure 1, paper p.4. Encoder N× 가 trend 를 제거해 seasonal 만 모델링, Decoder M× 가 trend 를 점진적으로 누적)

---

## 문제 정의

> The time series forecasting problem is to predict the most probable length-O series in the future given the past length-I series, denoting as input-I-predict-O. The long-term forecasting setting is to predict the long-term future, i.e. larger O. (p.3)

- 입력: $X_{en} \in \mathbb{R}^{I \times d}$ (과거 $I$ 시점, $d$ 변수)
- 출력: 미래 $O$ 시점.

본 paper 가 사용하는 $O$ 값:
- ETT/Electricity/Exchange/Traffic/Weather: $O \in \{96, 192, 336, 720\}$
- ILI: $O \in \{24, 36, 48, 60\}$ (정확히 paper Table 1, p.7)

---

## Series Decomposition Block (Eq 1)

가장 작은 단위 블록부터.

> Concretely, we adapt the moving average to smooth out periodic fluctuations and highlight the long-term trends. For length-L input series $\mathcal{X} \in \mathbb{R}^{L \times d}$, the process is:
> $$
> \begin{aligned}
> \mathcal{X}_t &= \text{AvgPool}(\text{Padding}(\mathcal{X})) \\
> \mathcal{X}_s &= \mathcal{X} - \mathcal{X}_t
> \end{aligned}
> $$
> where $\mathcal{X}_s, \mathcal{X}_t \in \mathbb{R}^{L \times d}$ denote the seasonal and the extracted trend-cyclical part respectively. (p.3, Eq 1)

- `AvgPool` 은 fixed kernel size $k$ 의 1D moving average. paper code 에서 보통 $k=25$ (시계열 길이의 일부분).
- `Padding` 은 양쪽 끝에 동일 길이 복제 → 출력 길이 = 입력 길이.
- 표기: $\mathcal{X}_s, \mathcal{X}_t = \text{SeriesDecomp}(\mathcal{X})$ — paper 의 inner block alias.

**Important nuance**: `AvgPool` 만으로 분해라 부르는 건 STL 등 정교한 알고리즘에 비하면 매우 단순. 그러나 paper 의 주장 — *progressive iteration 으로 layer 가 쌓이며 정교화* — 이 Table 9 ablation 으로 입증됨 (단순 AvgPool inner block 이 STL pre-processing 보다 우수).

---

## Model Inputs (Eq 2)

decoder 입력의 **초기화** 가 본 paper 의 묘미.

> The input of Autoformer decoder contains both the seasonal part $\mathcal{X}_{des} \in \mathbb{R}^{(I/2 + O) \times d}$ and trend-cyclical part $\mathcal{X}_{det} \in \mathbb{R}^{(I/2 + O) \times d}$ to be refined. Each initialization consists of two parts: the component decomposed from the latter half of encoder's input $\mathcal{X}_{en}$ with length $I/2$ to provide recent information, placeholders with length $O$ filled by scalars. (p.3)

수식 (Eq 2):
$$
\begin{aligned}
\mathcal{X}_{ens}, \mathcal{X}_{ent} &= \text{SeriesDecomp}(\mathcal{X}_{en\,\, I/2:I}) \\
\mathcal{X}_{des} &= \text{Concat}(\mathcal{X}_{ens}, \mathcal{X}_0) \\
\mathcal{X}_{det} &= \text{Concat}(\mathcal{X}_{ent}, \mathcal{X}_{\text{Mean}})
\end{aligned}
$$

- $\mathcal{X}_0 \in \mathbb{R}^{O \times d}$ = 모두 0.
- $\mathcal{X}_{\text{Mean}} \in \mathbb{R}^{O \times d}$ = $\mathcal{X}_{en}$ 의 mean 으로 채움.
- 입력의 최근 절반 ($I/2$) 만 디코더에 주는 이유는 ch13 의 Table 8 ablation 으로 검증 — half past 가 trade-off 최적.

---

## Encoder (Eq 3)

> As shown in Figure 1, the encoder focuses on the seasonal part modeling. The output of the encoder contains the past seasonal information and will be used as the cross information to help the decoder refine prediction results. (p.4)

수식 ($l$-th encoder layer, $X_{en}^l = \text{Encoder}(X_{en}^{l-1})$):

$$
\begin{aligned}
\mathcal{S}_{en}^{l,1}, \_ &= \text{SeriesDecomp}\big(\text{Auto-Correlation}(\mathcal{X}_{en}^{l-1}) + \mathcal{X}_{en}^{l-1}\big) \\
\mathcal{S}_{en}^{l,2}, \_ &= \text{SeriesDecomp}\big(\text{FeedForward}(\mathcal{S}_{en}^{l,1}) + \mathcal{S}_{en}^{l,1}\big)
\end{aligned}
$$

(Eq 3, paper p.4)

- `_` 는 **eliminated trend** — encoder 는 trend 를 버린다.
- $\mathcal{X}_{en}^l = \mathcal{S}_{en}^{l,2}$.
- Residual + SeriesDecomp 가 standard Transformer 의 LayerNorm 자리에 들어감.

paper 의 설정: $N=2$ encoder layers (Section 4 implementation details).

**왜 trend 를 버리나?** Encoder 가 cross-attention 으로 decoder 에게 줘야 할 것은 **과거의 seasonal 정보** 만. Decoder 는 자신의 trend init ($\mathcal{X}_{det}$) 으로 trend 를 별도 누적하므로 encoder 의 trend 가 중복.

---

## Decoder (Eq 4)

decoder 가 핵심:

> Each decoder layer contains the inner Auto-Correlation and encoder-decoder Auto-Correlation, which can refine the prediction and utilize the past seasonal information respectively. (p.4)

수식 ($l$-th decoder layer, $X_{de}^l = \text{Decoder}(X_{de}^{l-1}, X_{en}^N)$):

$$
\begin{aligned}
\mathcal{S}_{de}^{l,1}, \mathcal{T}_{de}^{l,1} &= \text{SeriesDecomp}\big(\text{Auto-Correlation}(\mathcal{X}_{de}^{l-1}) + \mathcal{X}_{de}^{l-1}\big) \\
\mathcal{S}_{de}^{l,2}, \mathcal{T}_{de}^{l,2} &= \text{SeriesDecomp}\big(\text{Auto-Correlation}(\mathcal{S}_{de}^{l,1}, \mathcal{X}_{en}^N) + \mathcal{S}_{de}^{l,1}\big) \\
\mathcal{S}_{de}^{l,3}, \mathcal{T}_{de}^{l,3} &= \text{SeriesDecomp}\big(\text{FeedForward}(\mathcal{S}_{de}^{l,2}) + \mathcal{S}_{de}^{l,2}\big) \\
\mathcal{T}_{de}^l &= \mathcal{T}_{de}^{l-1} + W_{l,1} * \mathcal{T}_{de}^{l,1} + W_{l,2} * \mathcal{T}_{de}^{l,2} + W_{l,3} * \mathcal{T}_{de}^{l,3}
\end{aligned}
$$

(Eq 4, paper p.4)

각 decoder layer 의 흐름:
1. **Inner Auto-Correlation** (self) → SeriesDecomp 1 → $(\mathcal{S}^{l,1}, \mathcal{T}^{l,1})$
2. **Encoder-Decoder Auto-Correlation** (cross) → SeriesDecomp 2 → $(\mathcal{S}^{l,2}, \mathcal{T}^{l,2})$
3. **FeedForward** → SeriesDecomp 3 → $(\mathcal{S}^{l,3}, \mathcal{T}^{l,3})$
4. **Trend 누적**: $\mathcal{T}_{de}^l$ 는 이전 layer 의 trend + 이번 layer 의 3개 분해 trend (각각 projector $W_{l,i}$ 통해).

이렇게 **trend 가 누적**되는 데 반해, **seasonal 은 refine** ($\mathcal{X}_{de}^l = \mathcal{S}_{de}^{l,3}$).

paper 의 설정: $M=1$ decoder layer.

**최종 예측**:
$$
\hat{Y} = W_{\mathcal{S}} * \mathcal{X}_{de}^M + \mathcal{T}_{de}^M
$$

- $W_{\mathcal{S}}$ 는 last seasonal 표현을 target dimension 으로 projection.
- Trend 는 그대로 더함.

---

## Architecture 의 다이어그램 직관

```
              ┌────────────── Encoder (N layers) ──────────────┐
   X_en  ──→  │  Auto-Corr → SeriesDecomp → FFN → SeriesDecomp │ → X_en^N (seasonal only)
              │            (trend buried "_")                   │
              └─────────────────────────────────────────────────┘
                                                           ↓ (K, V)
                                                           ↓
              ┌───────────────── Decoder (M layers) ─────────────────┐
   Init S ──→ │  Auto-Corr ──→ S, T₁                                 │
   Init T ──→ │  Cross Auto-Corr (with X_en^N) ──→ S, T₂             │ → Y
              │  FFN ──→ S, T₃                                       │
              │  Accumulate trend: T ← T_prev + Σ W_i · T_i          │
              └──────────────────────────────────────────────────────┘
                                                  ↓
                              Y = W_S · S_final + T_final
```

---

## Decomposition + 두 path 분리의 이점

1. **Trend path**: 단조롭게 누적 → 장기 추세 예측에 안정.
2. **Seasonal path**: refine → 주기 패턴 학습.
3. **사후 합산**: 마지막에 합쳐 → 두 path 의 학습 신호가 independent → loss landscape 가 평탄.

이 점진 분해 효과는 paper Figure 4 (ch11) 에서 시각화 — decomposition block 을 0/1/2/3 개로 늘릴 때 seasonal/trend 가 깔끔하게 분리.

---

## 다음

[06_auto_correlation.md](06_auto_correlation.md) 에서 본 paper 의 두 번째 주력 기여 — Auto-Correlation 메커니즘.
