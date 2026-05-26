# 12 Glossary & References — TimesNet

> **🧒 본 챕터는 "용어와 참고문헌의 길잡이"**: FFT-based period detection + 2D periodic reshaping + Inception block 의 핵심 개념 + reference 정리.

## 12.1 챕터 한 줄 요약

> **"Wu et al. ICLR 2023 의 *FFT-based period + 2D reshape + Inception block* 의 30+ terminology + 20+ references (FFT, periodic decomposition, multi-scale convolution) 의 1-stop dictionary."**

## 12.2 Top-30 핵심 용어

| 용어 | 정의 | 출처 |
|------|------|------|
| TimesNet | FFT period + 2D reshape + Inception backbone | Wu 2023 ★ |
| FFT | Fast Fourier Transform | Cooley-Tukey 1965 |
| Period | dominant frequency 의 inverse | classical TS |
| Spectrum | |FFT(x)|² | classical TS |
| Top-k periods | k highest amplitude frequencies | Wu 2023 |
| 2D Reshape | 1D TS → 2D matrix (period × phase) | Wu 2023 |
| Inception block | multi-scale conv 1×1, 3×3, 5×5 | Szegedy 2014 |
| Channel-mixing | multi-variate interaction | iTransformer |
| Hadamard product | element-wise multiplication | linear algebra |
| Amplitude weighting | period importance scoring | Wu 2023 |
| Multi-period | multiple temporal scales 처리 | Wu 2023 |
| Hierarchical TS | nested periodicity | TS theory |
| Seasonality | periodic component | TS classical |
| Trend | long-term direction | TS classical |
| Stationary | stable statistical properties | TS classical |
| ETTh / ETTm | electricity hourly/minute benchmark | Zhou 2021 |
| Traffic dataset | PEMS road sensor data | TS benchmark |
| Weather dataset | ECMWF weather records | TS benchmark |
| Long-horizon | 96-720 step prediction | TS benchmark |
| Short-horizon | 24-96 step prediction | TS benchmark |
| Multivariate | multiple TS dimensions | TS classical |
| Univariate | single TS dimension | TS classical |
| Anomaly detection | outlier identification | TS classical |
| Imputation | missing value filling | TS classical |
| Classification | TS labeling task | TS benchmark |
| Embedding | TS → R^d projection | NN |
| Encoder-only | no decoder architecture | Wu 2023 (TimesNet) |
| Forecasting head | linear projection at end | TS NN |
| Residual connection | skip connection | He 2016 |
| Layer normalization | per-layer normalization | Ba 2016 |

## 12.3 Notation

```
x_t ∈ R^d         t-step TS value
X ∈ R^{T × d}     full TS
F_k ∈ C^T         k-th FFT coefficient
P_k = T / k       k-th frequency period
A_k = |F_k|²      k-th amplitude
X_2D ∈ R^{P × T/P}  2D reshape
Inception(X)       multi-scale conv block
```

## 12.4 References (20+)

### 12.4.1 TS deep learning lineage
```
Vaswani 2017 — Transformer
Zhou 2021 — Informer
Liu 2024 — iTransformer
Wu 2023 — TimesNet (★ 본 paper)
Nie 2023 — PatchTST
```

### 12.4.2 Frequency analysis
```
Cooley-Tukey 1965 — FFT algorithm
Wu et al. 2021 — Autoformer (FFT in attention)
Zhou et al. 2022 — FEDformer (frequency enhanced)
```

### 12.4.3 Multi-scale convolution
```
Szegedy 2014 — Inception
He 2016 — ResNet
TCN architectures (Bai 2018)
```

### 12.4.4 TS Foundation Model 비교
```
Ansari 2024 — Chronos (token-based)
Woo 2024 — MOIRAI (variate-aware)
Das 2024 — TimesFM (decoder-only)
Wu 2023 — TimesNet (★ pre-TFM specialist)
```

## 12.5 자기점검

### 핵심 3 가지

1. **FFT-based period detection 의 *traditional method 대비 strength*?**
2. **2D Reshape 의 *information geometry* 의미?**
3. **Inception block 의 *multi-scale convolution* 의 TS 적합성?**

### 답변

1. **Data-driven, multi-period, robust**. Traditional STL decomposition: *fixed periodicity assumption* + manual frequency tuning. FFT: *data-driven*, *all frequencies* 동시 평가, top-k 자동 선택. → "*multiple coexisting periodicities*" (e.g., daily + weekly + yearly) 동시 capture. *No prior knowledge required*.

2. **1D 시간 → 2D (period, phase) 변환**. Period P 의 패턴이 1D 에서는 *long-range dependency* (P 만큼 떨어진 위치) — Conv1D 의 *receptive field 비효율*. 2D reshape 후: *period 가 column 축, phase 가 row 축* → P-step 떨어진 위치가 *2D 에서 인접* → Conv2D 의 *small kernel* 로 capture. *Geometric reformulation* 의 *receptive field benefit*.

3. **Multi-scale temporal pattern**. Inception 1×1: pointwise, 3×3: short-range, 5×5: longer-range, 7×7: longest. TS 가 *multiple scales 동시 contain* (e.g., minute fluctuation + hour pattern + day cycle). Inception 의 *parallel multi-scale conv* 가 *each scale 학습*. → Single fixed kernel 보다 *richer representation*.
