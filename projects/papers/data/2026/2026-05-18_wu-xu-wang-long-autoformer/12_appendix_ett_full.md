# 12 Appendix A — Full ETT Benchmark (Table 5)

paper p.13–14 Appendix A. 본문 Table 1 의 ETT 는 ETTm2 만. 여기서 **4 variants** (ETTh1, ETTh2, ETTm1, ETTm2) 전체.

---

## ETT Dataset 의 4 variants

| Variant | 빈도 | 길이 |
|---------|------|------|
| ETTh1 | 1시간 | 24개월 |
| ETTh2 | 1시간 | 24개월 |
| ETTm1 | 15분 | 24개월 |
| ETTm2 | 15분 | 24개월 |

→ 총 4가지. paper Section 4 본문은 ETTm2 만 사용. Appendix A 가 나머지를 보충.

---

## Table 5 — 4 variants × 7 horizons (paper p.13)

> Multivariate results on the four ETT datasets with predicted length as $\{24, 48, 168, 288, 336, 672, 720\}$. We fix the input length of Autoformer as 96. The experiments of the main text are on the ETTm2 dataset.

### MSE 만 (paper Table 5 정확 인용)

| Dataset | O | Autoformer | Informer | LogTrans | Reformer | LSTNet | LSTMa |
|---------|---|-----------|----------|----------|----------|--------|-------|
| **ETTh1** | 24  | **0.384** | 0.577 | 0.686 | 0.991 | 1.293 | 0.650 |
|         | 48  | **0.392** | 0.685 | 0.766 | 1.313 | 1.456 | 0.702 |
|         | 168 | **0.490** | 0.931 | 1.002 | 1.824 | 1.997 | 1.212 |
|         | 336 | **0.505** | 1.128 | 1.362 | 2.117 | 2.655 | 1.424 |
|         | 720 | **0.498** | 1.215 | 1.397 | 2.415 | 2.143 | 1.960 |
| **ETTh2** | 24  | **0.261** | 0.720 | 0.828 | 1.531 | 2.742 | 1.143 |
|         | 48  | **0.312** | 1.457 | 1.806 | 1.871 | 3.567 | 1.671 |
|         | 168 | **0.457** | 3.489 | 4.070 | 4.660 | 3.242 | 4.117 |
|         | 336 | **0.471** | 2.723 | 3.875 | 4.028 | 2.544 | 3.434 |
|         | 720 | **0.474** | 3.467 | 3.913 | 5.381 | 4.625 | 3.963 |
| **ETTm1** | 24  | 0.383 | **0.323** | 0.419 | 0.724 | 1.968 | 0.621 |
|         | 48  | **0.454** | 0.494 | 0.507 | 1.098 | 1.999 | 1.392 |
|         | 96  | **0.481** | 0.678 | 0.768 | 1.433 | 2.762 | 1.339 |
|         | 288 | **0.634** | 1.056 | 1.462 | 1.820 | 1.257 | 1.740 |
|         | 672 | **0.606** | 1.192 | 1.669 | 2.187 | 1.917 | 2.736 |
| **ETTm2** | 24  | **0.153** | 0.173 | 0.211 | 0.333 | 1.101 | 0.580 |
|         | 48  | **0.178** | 0.303 | 0.427 | 0.558 | 2.619 | 0.747 |
|         | 96  | **0.255** | 0.365 | 0.768 | 0.658 | 3.142 | 2.041 |
|         | 288 | **0.342** | 1.047 | 1.090 | 2.441 | 2.856 | 0.969 |
|         | 672 | **0.434** | 3.126 | 2.397 | 3.090 | 3.409 | 2.541 |

### 핵심 개선율 (paper p.13)

> For the input-96-predict-336 long-term setting, Autoformer surpasses previous best results by 55% (1.128→0.505) in ETTh1, 80% (2.544→0.471) in ETTh2. For the input-96-predict-288 long-term setting, Autoformer achieves 40% (1.056→0.634) MSE reduction in ETTm1 and 66% (0.969→0.342) in ETTm2. These results show a 60% average MSE reduction over previous state-of-the-art.

| Setting | 이전 SOTA | Autoformer | 감소율 |
|---------|----------|-----------|--------|
| ETTh1 predict-336 | 1.128 (Informer) | **0.505** | 55% |
| ETTh2 predict-336 | 2.544 (LSTNet) | **0.471** | 80% |
| ETTm1 predict-288 | 1.056 (Informer) | **0.634** | 40% |
| ETTm2 predict-288 | 0.969 (LSTMa) | **0.342** | 66% |
| **평균** | — | — | **60%** |

→ **4 ETT variants 의 평균 60% 감소**. 본문의 평균 38% (6 datasets) 보다 큰 폭.

---

## 한 가지 예외 — ETTm1 short horizon

ETTm1 predict-24 만 Informer (0.323) < Autoformer (0.383).

paper 는 이 예외를 본문에서 명시하지 않지만, Table 5 가 그대로 보여줌. **단기에서는 sparse Transformer 가 가끔 더 낫다** — Autoformer 의 강점은 **장기**.

이 관찰은 Univariate Exchange predict-96 에서 ARIMA 가 최강 (ch09) 인 것과 동일한 결로:

- **단기 + 비주기**: ARIMA (Exchange-96), Informer (ETTm1-24).
- **장기 + 주기 명확**: Autoformer 압도.

---

## Predict-720 의 robustness

ETTh1 의 predict 길이 증가에 따른 Autoformer MSE:
24 → 48 → 168 → 336 → 720 = 0.384 → 0.392 → 0.490 → 0.505 → 0.498

→ predict-336 과 predict-720 이 거의 같은 수준 (오히려 720 이 약간 낮음). **horizon-robust**.

Informer 와 비교:
24 → 48 → 168 → 336 → 720 = 0.577 → 0.685 → 0.931 → 1.128 → 1.215

→ Informer 는 horizon 에 따라 MSE 가 monotonic 증가. Autoformer 는 plateau.

이것이 paper Section 4.1 의 한 줄
> Autoformer retains better long-term robustness, which is meaningful for real-world practical applications, such as weather early warning and long-term energy consumption planning.

의 정량적 근거.

다음 [13_appendix_hyper_input.md](13_appendix_hyper_input.md) 에서 hyperparameter & input 관련 4개 Table.
