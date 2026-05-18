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
| 2 | 0.363 | **0.224** | 0.511 | 0.673 | 0.358 | **2.641** |
| 3 | 0.339 | 0.231 | **0.509** | 0.619 | 0.359 | 2.669 |
| 4 | **0.336** | 0.232 | 0.513 | **0.607** | **0.349** | 3.041 |
| 5 | 0.410 | 0.273 | 0.517 | 0.618 | 0.366 | 3.076 |

(per-column **bold** = best $c$ for that dataset)

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

---

## 4 Tables 의 종합 해석 — design choice 가 의미하는 것

### 1. $c$ 의 robustness 의 의미 (Table 6)

$c \in [1, 5]$ 에서 MSE 변화가 10% 이내 — **모델이 hyperparameter 에 둔감**. 이것은:
- **장점**: real-world deployment 에서 hyperparameter tuning 부담 ↓.
- **메커니즘**: Top-k 의 k 가 충분히 크면 (≥ log L) 주요 주기가 다 잡힘.
- **반례**: ILI 에서 c=5 가 급격히 악화 — **비주기 데이터** 에서는 큰 k 가 noise 학습.

→ **Practitioner 권장**: 알려진 주기 데이터는 $c=3$, 비주기/노이즈는 $c=2$.

### 2. Input 길이 의 dataset-specific 특성 (Table 7)

| Dataset | 최적 I | 의미 |
|---------|--------|------|
| ETT | 96 (24h hourly / 24h 15-min) | **1일 = 1 cycle** — 충분 |
| Electricity | 192 (8일) | **1주 cycle 학습 필요** |
| ILI | 48 (1년) | 약한 yearly cycle, 더 긴 history 필요 |

→ paper Table 7 결과는 **각 데이터의 dominant period 에 따라 I 가 결정** 됨.

**Practitioner formula**: $I \approx 2 \times$ (가장 긴 잠재 주기). Electricity 의 weekly period (168h) → I≈192 가 합리.

### 3. Decoder past length $I/2$ 의 함의 (Table 8)

$O$, $I/2 + O$, $I + O$ 의 trade-off:
- $O$ (no past) → MSE 0.360, memory 3029 MB
- **$I/2 + O$** → MSE 0.339, memory 3271 MB (**+8% mem, -5.8% MSE**)
- $I + O$ → MSE 0.333, memory 3599 MB (+19% mem, -7.5% MSE)

→ $I/2$ → $I$ 의 추가 memory 가 marginal benefit. **diminishing returns** 의 명확한 예.

이것은 architecture 디자인의 일반 원칙: **첫 1/2 가 가장 많은 정보 제공, 후반 1/2 는 보너스**. 이건 attention head 수, layer 수 등에도 비슷한 패턴.

### 4. 분해 algorithm 비교 (Table 9) — 가장 도발적

```
STL [33] / HP [18] / CF [11] / BK [44] 4개 정교한 분해 + 2 Transformers
  ↓
Autoformer (단순 AvgPool inner block + 1 Transformer)

predict-720 MSE:
  STL: 3.678
  HP:  2.181
  CF:  2.462
  BK:  2.150
  → 평균 ~2.6
  
  Autoformer: 0.422
  → ~6배 개선
```

→ **단순 + 미분가능 + inner block** 이 **정교 + 외부 + pre-processing** 을 압도. 

이 결과의 일반적 교훈:
- 1990–2000 통계 분해 알고리즘 (STL/HP/CF/BK) 은 시계열 ML 의 표준이었으나, deep learning 시대에는 그 정교함이 **gradient flow 의 단절** 로 손해.
- "**미분가능 단순 < 정교한 외부**" 라는 ML 디자인 원칙의 한 확인.
- 후속 paper (PatchTST, ITransformer, TimesNet) 가 모두 분해를 inner block 으로 다루는 이유.

---

## 4 Tables 의 시너지

```
Table 6 (c robust)  +  Table 7 (I dataset-specific)
        +
Table 8 (I/2 past)  +  Table 9 (AvgPool 우위)
        ↓
"hyperparameter 에 둔감 + I 만 데이터별 튜닝 + 메모리 절감 + 정교한 분해 불필요"
        ↓
       Practical Autoformer 의 설정 룰
```

이 4개 ablation 이 함께 — **practitioner 가 default 만 써도 거의 SOTA 보장**.

다음 [14_appendix_covid.md](14_appendix_covid.md) 에서 COVID-19 case study.
