# 13 Appendix B–D — Hyperparameters & Input

paper p.13–14 의 Appendix B (Table 6), C (Tables 7, 8), D (Table 9). 4개 ablation Table.

---

## Table 6 — Hyperparameter $c$ (Appendix B)

Auto-Correlation 의 Top-k 계수 $c$ 에 대한 robustness.

> We can verify the model robustness with respect to hyper-parameter $c$ (Equation 6 in the main text). To trade-off performance and efficiency, we set $c$ to the range of 1 to 3. It is also observed that datasets with obvious periodicity tend to have a large factor $c$, such as the ETT and Traffic datasets. For the ILI dataset without obvious periodicity, the larger factor may bring noises. (p.13)

### MSE (paper Table 6 정확 인용; input-96-predict-336 / ILI는 input-36-predict-48)

| c | ETT | Electricity | Exchange | Traffic | Weather | ILI |
|---|-----|------------|----------|---------|---------|-----|
| 1 | 0.339 | 0.252 | 0.511 | 0.706 | 0.348 | 2.754 |
| 2 | 0.363 | 0.224 | 0.511 | 0.673 | 0.358 | 2.641 |
| 3 | 0.339 | 0.231 | 0.509 | 0.619 | 0.359 | **2.669** |
| 4 | 0.336 | 0.232 | 0.513 | 0.607 | 0.349 | 3.041 |
| 5 | 0.410 | 0.273 | 0.517 | 0.618 | 0.366 | 3.076 |

→ ETT/Electricity/Exchange/Weather 는 $c \in \{1,2,3,4\}$ 모두 안정. Traffic 은 $c=4$ 가 최고지만 $c=3$ 도 충분. ILI 는 $c=2$ 가 최고, $c \ge 4$ 에서 급격히 악화 (비주기 → 큰 $c$ 가 noise).

paper 의 default 권장: **$c \in [1, 3]$**.

---

## Table 7 — Input Length (Appendix C.1)

> Because the forecasting horizon is always fixed upon the application's demand, we need to tune the input length in real-world applications. Our study shows that the relationship between input length and model performance is dataset-specific. (p.13)

### MSE (paper Table 7 정확 인용)

| I | ETT (predict-336) | Electricity (predict-336) | I (ILI) | ILI (predict-48) |
|---|----|----|----|----|
| 96  | 0.339 | 0.231 | 24 | 3.406 |
| 192 | 0.355 | 0.200 | 36 | 2.669 |
| 336 | 0.361 | 0.225 | 48 | 2.656 |
| 720 | 0.419 | 0.226 | 60 | 2.779 |

**해석**:
- ETT (predict-336): I=96 이 최고 (0.339), I 가 늘어날수록 약간 악화.
- Electricity: I=192 가 최고 (0.200), too long (I=720) 은 큰 변화 없음.
- ILI: I=48 이 가장 좋음 (2.656), 비주기 데이터는 **긴 입력** 이 유리.

paper p.13:
> For the ETT dataset with obvious periodicity, an input with length-96 is enough to provide enough information. But for the ILI dataset without obvious periodicity, the model needs longer inputs to discover more informative temporal dependencies.

---

## Table 8 — Decoder Input Past Information (Appendix C.2)

> For the decoder input of Autoformer, we attach the length-$\frac{I}{2}$ past information to the placeholder. ... As shown in Table 8, the model with more past information will obtain a better performance, but it also causes a larger memory cost. Thus, we set the decoder input as $\frac{I}{2} + O$ to trade off both the performance and efficiency. (p.13)

### ETT predict-336 (paper Table 8 정확 인용)

| Decoder input | MSE | MAE | Memory |
|--------------|-----|-----|--------|
| $O$ (no past) | 0.360 | 0.383 | 3029 MB |
| **$I/2 + O$ (half)** | **0.339** | **0.372** | 3271 MB |
| $I + O$ (full past) | 0.333 | 0.369 | 3599 MB |

→ Full past 가 marginal 하게 좋지만 memory cost ↑. **Half past (논문 기본값)** 이 trade-off 최적.

이게 Eq 2 의 `X_{en, I/2:I}` (latter half) 가 paper choice 인 이유.

---

## Table 9 — Decomposition Algorithms (Appendix D)

paper p.14:
> In this section, we attempt to further verify the effectiveness of our proposed progressive decomposition architecture. We adopt more well-established decomposition algorithms as the pre-processing for separate prediction settings.

### ETT MSE (paper Table 9 정확 인용; backbone = canonical Transformer)

| Decomposition | predict-96 | predict-192 | predict-336 | predict-720 |
|--------------|----|----|----|----|
| **Separately** STL [33] | 0.523 / 0.516 | 0.638 / 0.605 | 1.004 / 0.794 | 3.678 / 1.462 |
| Hodrick-Prescott Filter [18] | 0.464 / 0.495 | 0.816 / 0.733 | 0.814 / 0.722 | 2.181 / 1.173 |
| Christiano-Fitzgerald Filter [11] | 0.373 / 0.458 | 0.819 / 0.668 | 1.083 / 0.835 | 2.462 / 1.189 |
| Baxter-King Filter [44] | 0.440 / 0.514 | 0.623 / 0.626 | 0.861 / 0.741 | 2.150 / 1.175 |
| **Progressively** Autoformer | **0.255 / 0.339** | **0.281 / 0.340** | **0.339 / 0.372** | **0.422 / 0.419** |

(MSE / MAE; **bold** = best)

### 4가지 분해 알고리즘 (paper 의 reference)

- **STL** [33]: Seasonal-Trend Loess decomposition (Cleveland 1990).
- **Hodrick-Prescott Filter** [18]: 경제학 표준 — business cycle 분해 (Hodrick-Prescott 1997).
- **Christiano-Fitzgerald Filter** [11]: band-pass filter (2003).
- **Baxter-King Filter** [44]: business cycle band-pass (Woitek 1998).

paper p.14:
> Despite the latter being with mature decomposition algorithms and twice bigger model.

→ 사전처리 + **두 개의 Transformer** (seasonal + trend 따로) 를 써도 Autoformer 의 inner-block 분해 (단일 모델) 가 압승.

---

## 결론: $c$, $I$, decoder past, decomp 알고리즘의 4가지 design choice

| 선택 | paper 권장 | 근거 |
|------|-----------|------|
| Auto-Correlation $c$ | 1-3 | Table 6, 모든 dataset stable, ILI 만 작게 |
| 입력 길이 $I$ | 96 (ILI 36) | Table 7, ETT 는 96 충분, ILI 는 좀 더 |
| Decoder past length | $I/2$ | Table 8, performance/memory trade-off |
| Decomp algorithm | AvgPool inner block | Table 9, 정교한 알고리즘들 압도 |

이 4가지 design choice 가 paper 의 기본 setting. 본 deep dive 의 코드 ([18_code.md](18_code.md)) 가 이 default 를 사용.

다음 [14_appendix_covid.md](14_appendix_covid.md) 에서 COVID-19 case study.
