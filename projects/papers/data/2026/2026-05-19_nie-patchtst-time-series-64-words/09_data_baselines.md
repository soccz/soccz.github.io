# 09 Datasets + Baselines

paper Section 4 의 experimental setup.

## 8 Datasets

paper p.5:
> We evaluate the performance of our proposed PatchTST on 8 popular datasets, including Weather, Traffic, Electricity, ILI and 4 ETT datasets (ETTh1, ETTh2, ETTm1, ETTm2).

paper Table 2:

| Dataset | Features | Timesteps | 특성 |
|---------|----------|-----------|------|
| **Weather** | 21 | 52,696 | 기상 (10분 단위) |
| **Traffic** | 862 | 17,544 | 캘리포니아 고속도로 사용률 (시간 단위) |
| **Electricity** | 321 | 26,304 | 클라이언트별 전력 (시간 단위) |
| **ILI** | 7 | 966 | 미국 인플루엔자 환자 (주 단위) |
| **ETTh1** | 7 | 17,420 | 전력 변압기 (시간 단위, station 1) |
| **ETTh2** | 7 | 17,420 | 전력 변압기 (시간 단위, station 2) |
| **ETTm1** | 7 | 69,680 | 전력 변압기 (15분 단위, station 1) |
| **ETTm2** | 7 | 69,680 | 전력 변압기 (15분 단위, station 2) |

paper p.5:
> We would like to highlight several large datasets: Weather, Traffic, and Electricity. They have many more number of time series, thus the results would be more stable and less susceptible to overfitting than other smaller datasets.

→ **Large**: Weather (21), Traffic (862), Electricity (321) — 변수 많고 timestep 많음, 결과 stable
→ **Small**: ILI (7, 966 timestep) — 가장 작음, 결과 noisy
→ **ETT**: 4 dataset — 시계열 forecasting benchmark 의 표준

---

## Prediction horizons

paper p.5:
> All of the models are following the same experimental setup with prediction length $T \in \{24, 36, 48, 60\}$ for ILI dataset and $T \in \{96, 192, 336, 720\}$ for other datasets as in the original papers.

| Dataset | Horizons $T$ |
|---------|------------|
| ILI | 24, 36, 48, 60 |
| Others (7 dataset) | 96, 192, 336, 720 |

→ ILI 가 weekly 단위라 짧은 horizon, 다른 dataset 은 hourly/sub-hourly 라 긴 horizon.

---

## Baselines — 7 models

paper p.5:
> We choose the SOTA Transformer-based models, including FEDformer (Zhou et al., 2022), Autoformer (Wu et al., 2021), Informer (Zhou et al., 2021), Pyraformer (Liu et al., 2022), LogTrans (Li et al., 2019), and a recent non-Transformer-based model DLinear (Zeng et al., 2022) as our baselines.

| # | Model | Year/Venue | 핵심 mechanism |
|---|-------|-----------|---------------|
| 1 | **LogTrans** | NeurIPS 2019 | Convolutional sparse attention (LogSparse) |
| 2 | **Informer** | AAAI 2021 (Best) | ProbSparse attention + distilling |
| 3 | **Autoformer** | NeurIPS 2021 | Auto-correlation + decomposition |
| 4 | **Pyraformer** | ICLR 2022 | Pyramidal attention (linear complexity) |
| 5 | **FEDformer** | ICML 2022 | Fourier-enhanced (linear complexity) |
| 6 | **DLinear** | AAAI 2023 | Decomposition + Linear (non-Transformer) |

→ 6개 모델 (5 Transformer + 1 linear). 모두 SOTA 시계열 forecasting models.

paper Table 3 에서는 추가로 **TS2Vec, BTSF, TNC, TS-TCC** 가 representation learning baseline 으로 사용.

---

## Fair comparison — look-back window 선택

paper p.5:
> We collect baseline results from Zeng et al. (2022) with the default look-back window $L = 96$ for Transformer-based models, and $L = 336$ for DLinear. But in order to avoid under-estimating the baselines, we also run FEDformer, Autoformer and Informer for six different look-back window $L \in \{24, 48, 96, 192, 336, 720\}$, and always choose the best results to create strong baselines.

**중요 detail**:
- Transformer baseline 들은 default $L=96$ 가 fair
- 그러나 PatchTST 가 $L=336$ 또는 $L=512$ 사용
- "PatchTST 가 cheating" 비판 방지 위해 FEDformer/Autoformer/Informer 도 $L \in \{24, 48, 96, 192, 336, 720\}$ 6개로 실행
- 각 baseline 의 **best** look-back 결과를 채택

→ "PatchTST 가 unfair advantage 받는다" 비판에 대한 사전 대응.

---

## Model Variants — PatchTST/64 vs PatchTST/42

paper p.5:
> We propose two versions of PatchTST in Table 3. PatchTST/64 implies the number of input patches is 64, which uses the look-back window $L = 512$. PatchTST/42 means the number of input patches is 42, which has the default look-back window $L = 336$. Both of them use patch length $P = 16$ and stride $S = 8$.

| Variant | $L$ | $N$ | 용도 |
|---------|-----|-----|------|
| **PatchTST/64** | 512 | 64 | "larger model" — 큰 dataset 에서 best performance |
| **PatchTST/42** | 336 | 42 | "fair comparison" — DLinear 와 같은 $L$ |

paper:
> Thus, we could use PatchTST/42 as a fair comparison to DLinear and other Transformer-based models, and PatchTST/64 to explore even better results on larger datasets.

→ /42 가 fair comparison, /64 가 maximum performance.

---

## Metrics — MSE + MAE

paper p.5:
> We calculate the MSE and MAE of multivariate time series forecasting as metrics.

- **MSE** (Mean Squared Error): $\frac{1}{N} \sum (y - \hat{y})^2$ — squared error, outlier 에 민감
- **MAE** (Mean Absolute Error): $\frac{1}{N} \sum |y - \hat{y}|$ — absolute error, robust

→ 모든 Table 의 결과는 (MSE, MAE) pair.

---

## 시계열 분야 표준 — 왜 이 8 dataset 인가

이 8 dataset 은 시계열 forecasting 의 **de facto 벤치마크**:
- Wu et al. 2021 (Autoformer paper) 이 처음 정리
- 이후 모든 paper 가 이를 그대로 사용
- 공통 train/val/test split 도 표준화

paper p.5:
> These datasets have been extensively utilized for benchmarking and publicly available on (Wu et al., 2021).

→ Reproducibility 보장. 직접 비교 가능.

---

## Train/Val/Test split

(paper 본문에 직접 명시 안 됨, 표준 관례 따름)

- Weather/ETT/Electricity/Traffic/ILI: 70%/10%/20% chronological split
- 즉, 처음 70% 가 train, 다음 10% val, 마지막 20% test

→ Time-series 의 표준: train 이 과거, test 가 미래 (no leakage).

---

## Implementation summary

paper p.5:
> More details about the baselines could be found in Appendix A.1.2.

| 항목 | 값 |
|------|-----|
| 입력 길이 $L$ | 336 (/42) 또는 512 (/64) |
| Patch length $P$ | 16 |
| Stride $S$ | 8 |
| Latent dim $D$ | 16 ~ 128 (dataset 따라) |
| Heads $H$ | 4 ~ 16 |
| Encoder layers | 3 |
| Optimizer | Adam |
| Learning rate | 1e-4 |
| Epoch | 100 |
| Batch size | 32 ~ 128 |
| Hardware | NVIDIA A40 48GB |

→ paper Appendix A.1 에 dataset 별 상세 hyperparameter.

다음 [10_supervised_results.md](10_supervised_results.md) 에서 Table 3 의 256 cell paper-by-paper.
