# 5. 실험 해부

## 평가 세팅 전체 구조 (§4)

저자들은 평가를 세 갈래로 나눈다:

1. **In-distribution (Monash)** — LOTSA *내부* train/test split holdout. *동일 도메인·동일 freq* baseline 대비 일반화 측정.
2. **Out-of-distribution / Zero-shot (Probabilistic 6개)** — LOTSA *외부* 데이터셋. *dataset-specific full-shot SOTA* 와 비교.
3. **Long Sequence Forecasting (ETT + Electricity + Weather)** — LSF 벤치마크의 zero-shot 평가. iTransformer / TimesNet / PatchTST 등 *dataset-trained* baseline 대비.

## 데이터셋 — 산문 해석

### Monash Time Series Forecasting Benchmark (in-dist, §4.1)

**어떤 데이터인가**: Godahewa et al. 2021 NeurIPS Datasets&Benchmarks Round 2 의 *26 가지 시계열 데이터셋 모음*. yearly / quarterly / monthly / weekly / daily / hourly / minutely 까지 7 단계 freq, *tourism / electricity / traffic / weather / kaggle 등 다양한 도메인*.

**왜 적합한가**: 다양한 freq × 도메인 한 곳에 모인 *통합 benchmark*. 단일 모델의 *cross-dataset 일반화* 측정 표준. Naïve / ARIMA / ETS / TBATS / DHR-ARIMA / WaveNet / N-BEATS / DeepAR / TFT / Transformer 등 *baseline 정 표준 보고치* 가 이미 존재 → MOIRAI 가 모든 baseline 과 *공정* 비교 가능.

**숨은 편향**: *LOTSA 가 Monash 의 train split 을 포함*. 따라서 "in-distribution" 이라고 분류되지만 *완전한 in-dist* 가 아니라 *train 본 dataset 의 test holdout*. 진정한 OOD 도 아니고 진정한 in-dist 도 아닌 *회색지대*. 저자 본문 인정 ("we only include the train set, holding out the test set").

### Probabilistic OOD 6개 — Table 18 (Appendix C.2)

| Dataset | Domain | Frequency | Prediction Length | Rolling Evals |
|---------|--------|-----------|-------------------|---------------|
| Electricity (Trindade 2015) | Energy | Hourly | 24 | 7 |
| Solar (Lai 2018) | Energy | Hourly | 24 | 7 |
| Walmart (Kaggle 2014) | Sales | Weekly | 8 | 4 |
| Weather | Climate | 10-Min | 144 | 7 |
| Istanbul Traffic | Transport | Hourly | 24 | 7 |
| Turkey Power | Energy | Hourly | 24 | 7 |

**왜 적합한가**: (i) 4 도메인 × 4 freq (10min / hourly / weekly) 분산, (ii) *prediction length 24 / 8 / 144 다양*, (iii) Kaggle Walmart 처럼 *학습 데이터에서 잘 안 보이는 retail sales* 포함 — LOTSA 의 Sales 도메인이 0.72% 로 가장 작은 축. 모델이 Sales 에 *underfit* 될 위험을 정직하게 측정.

**숨은 편향**: 6 데이터셋 모두 *Energy / Energy / Sales / Climate / Transport / Energy* — Energy 4 개로 편향. 저자가 자신 있는 도메인 (LOTSA 의 59% 점유 Energy) 에서 *유리한* 측정. Health care / Econ-Fin 도메인의 *zero-shot* 평가 없음.

### Long Sequence Forecasting — Table 6 (§4.2)

**어떤 데이터인가**: Wu et al. 2021 (Autoformer) 의 LSF 벤치마크에서 ETTh1, ETTh2, ETTm1, ETTm2, Electricity, Weather. 모두 *프리디플 96/192/336/720 horizon* 표준.

**왜 적합한가**: LSF 분야의 *standard SOTA* (iTransformer / TimesNet / PatchTST / Crossformer / TiDE / DLinear / SCINet / FEDformer) 와 *동일 평가 protocol* 로 비교 가능 — 비교 공정성 보장.

**숨은 편향**: (i) ETT 4 데이터셋은 *동일 변압기의 다른 측정 위치* — 매우 유사. 6 데이터셋이 사실 *3 source* (ETT, Electricity, Weather). 다양성 낮음. (ii) Traffic (Wu 2021 의 표준 데이터셋)이 *제외* 됨 — 저자 본문 "omitting datasets which have datasets from the same source present in our pre-training data". 즉 *LOTSA 와 source overlap* 있는 데이터셋만 제외. ETT 가 정말 *완전 OOD* 인가는 *Energy/Industrial 도메인이 LOTSA 의 60%* 인 점에서 의문 — 저자 주장에 따르면 OOD 이나 *유사 source* 가 학습 데이터에 풍부.

## 베이스라인 공정성

### Monash (Figure 3)
PR-Naïve / SES / Theta / ETS / DHR-ARIMA / TBATS / WaveNet / N-BEATS / DeepAR / TFT / Transformer / Moirai Small/Base/Large 비교. *Monash benchmark 의 보고치 그대로* — 즉 baseline 의 hyperparameter 는 Godahewa 2021 의 표준값. *재현 공정* 하지만 *최신* tuning 은 아님.

### Probabilistic (Table 5)
PatchTST / TiDE / TFT / DeepAR + AutoARIMA / Seasonal Naïve. **저자들이 *직접* GluonTS 로 구현 + Appendix C.3 Table 19 의 hyperparameter search** (15 회 random search) → best validation CRPS 의 5 seed 평균. *공정성 측면에서 매우 양심적* — baseline 을 자기들이 직접 tune, 5 seed 분산도 보고. *MOIRAI 측은 inference-time context length tuning 만* (1000~5000 중 validation CRPS 최선). *학습 자체는* zero-shot.

### Long-Sequence (Table 6)
iTransformer / TimesNet / PatchTST / Crossformer / TiDE / DLinear / SCINet / FEDformer. **본문 인용**: "Full-shot results are obtained from Liu et al. (2023b)" (= iTransformer 논문). *즉 iTransformer 의 보고치 그대로 차용* — 저자들이 *직접 tune 안 함*. iTransformer 가 자기 모델 보여줄 때 *baseline 을 얼마나 공정 tune 했는지* 에 의존. *공정성 약간 떨어짐*.

## 지표 — 왜 그 metric 인가

### CRPS (Continuous Ranked Probability Score, Appendix C.1)

저자 정의 (Gneiting & Raftery 2007):
$$
\text{CRPS} = \int_0^1 2 \Lambda_\alpha(F^{-1}(\alpha), y) d\alpha, \quad \Lambda_\alpha(q, y) = (\alpha - \mathbb{1}_{y<q})(y - q)
$$

실제 계산용 *normalized discrete approximation* (Park 2022):
$$
\text{CRPS} \approx \frac{1}{K} \sum_{k=1}^K \text{wQL}[\alpha_k], \quad \text{wQL}[\alpha] = \frac{2 \sum_t \Lambda_\alpha(\hat q_t(\alpha), y_t)}{\sum_t |y_t|}
$$

$K=9$, $\alpha \in \{0.1, 0.2, \ldots, 0.9\}$.

**왜 CRPS 인가**: 확률 forecasting 의 *strict proper scoring rule* — *예측 분포 전체* 에 대한 quantitative 평가. MSE 가 *point* forecast 만 다루는 것과 대비. CRPS 가 작을수록 분포 예측이 정확.

### MSIS (Mean Scaled Interval Score, M4 Competition)

$$
\text{MSIS} = \frac{\frac{1}{h} \sum_{t=1}^h (U_t - L_t) + \frac{2}{a}(L_t - Y_t)\mathbb{1}_{Y_t<L_t} + \frac{2}{a}(Y_t - U_t)\mathbb{1}_{Y_t>U_t}}{\frac{1}{n-m} \sum_{t=m+1}^n |Y_t - Y_{t-m}|}
$$

$a = 0.05$ (95% 예측 interval), $m$ = seasonal factor.

**왜 MSIS**: *95% interval* 에 *실제값* 이 잘 들어가는지 + interval *폭* 이 좁은지 동시 평가. CRPS 와 *상보적*.

### 만약 다른 metric 으로 평가했다면?

저자들은 *Appendix D.2* 에 deterministic metric (MAE, MASE) 도 함께 보고 — 즉 *median forecast* 의 정확도. 만약 *MASE 만* 으로 평가했다면, mixture distribution head 의 *분포 정확성* 은 측정 안 됨. *Quantile metric* (예: 90% quantile loss) 만 측정했다면 *꼬리* 정확성만. **CRPS + MSIS + MAE + MASE 4-axis 평가가 forecast 평가의 *strict / proper* 통합** — 저자 평가 디자인의 모범.

## 주요 표·그림 해석

### Figure 3 (Monash) — in-distribution 일반화

Moirai-Small/Base/Large 모두 *normalized MAE* 가 *모든 baseline* 보다 낮음 (정확 수치는 막대그래프 — Small ≈ 0.66, Base ≈ 0.60 (추정), Large ≈ 0.50 (추정)). *한 모델로 26 데이터셋 평균* 이 *26 모델로 각각 fit 한 baseline* 보다 우위 — **데이터 규모 + 통합학습이 specialized model 을 능가**.

### Table 5 (Probabilistic OOD, 6 데이터셋)

| Metric | Moirai-Large | PatchTST (best deep baseline) | 우열 |
|--------|-------------|------------------------------|------|
| Electricity CRPS | 0.050 | 0.052±0.00 | Moirai 약간 우 |
| Solar CRPS | 0.406 | 0.518±0.09 | **Moirai 명확 우** |
| Walmart CRPS | 0.098 | 0.082±0.01 | PatchTST 우 |
| Weather CRPS (Small best) | 0.049 | 0.059±0.01 | **Moirai 우** |
| Istanbul Traffic CRPS | 0.112 | 0.112±0.00 | **동률** |
| Turkey Power CRPS | 0.036 | 0.054±0.01 | **Moirai 우** |

**해석**: 6 데이터셋 중 4 개 best/2nd-best, 1 개 동률, 1 개 (Walmart Sales — LOTSA 0.72% 도메인) 열위. *Sales 도메인 underexposure* 가 실측 — 저자 LOTSA 도메인 비율과 *완벽히 일치*.

### Table 6 (Long Sequence, 6 데이터셋)

| Dataset | Moirai-Large MSE | Best Full-shot MSE | 우열 |
|---------|-----------------|-------------------|------|
| ETTh1 | 0.510 | iTrans 0.454 | 열위 |
| ETTh2 | 0.354 | iTrans 0.383 | **Moirai 우** |
| ETTm1 | 0.390 | PatchTST 0.387 | 거의 동률 |
| ETTm2 | 0.276 | iTrans 0.288 | **Moirai 우** |
| Electricity | 0.188 | iTrans 0.178 | 약간 열위 |
| Weather | 0.259 | iTrans 0.258 | 거의 동률 |

**해석**: ETTh2/ETTm2 best, 나머지 거의 동률. *Moirai-Base* 가 *Moirai-Large* 보다 다수 케이스에서 우위 — *모델 크기 ≠ 성능 향상* 의 흥미로운 경향 (저자 §4.2 본문 인정).

### Table 7 (Ablation) — 가장 중요한 표

| Ablation | Normalized MAE | 악화율 vs Small (0.655) |
|----------|----------------|------------------------|
| Moirai-Small | **0.655** | baseline |
| w/o patch size constraints | 0.720 | +9.9% |
| **w/o multi patch size** | **1.156** | **+76.5%** (최대) |
| **w/o Any-variate Attention** | **0.904** | **+38.0%** |
| w/o mixture distribution | 0.740 | +13.0% |
| w/o LOTSA | 0.809 | +23.5% |
| w/o packing | 0.785 | +19.8% |

**해석**: (a) **Multi-patch-size projection 이 가장 critical** (+76.5% 악화) — frequency adaptation 이 universal forecasting 의 핵심. (b) **Any-variate Attention 두 번째** (+38.0%) — variate 차원 적응이 그 다음 critical. (c) Mixture distribution / LOTSA / packing 은 +13~24% 로 *비슷한 중간 효과*. (d) *Patch size constraints* (사전정의 lookup) 가 *constraint 자체* 로 +10% — 자유롭게 patch size 선택 시 학습 신호 충돌. 사전정의 제약이 효과.

### Figure 5 — Context length scaling

ETTm1, Electricity, Weather 3 데이터셋에서 *prediction length 96 고정* + *context length 100~5000 변경*. MAE 가 *context length 증가에 따라 *monotonic 감소* (Moirai). 비교: Zeng 2023, Liu 2023b 가 *conventional Transformer 는 이 monotonic 감소 못 보임* 을 지적 — Moirai 가 *zero-shot 임에도 long-context 친화* 성격.

### Figure 4 — 정성 시각화: mixture vs Student-T

Traffic Hourly 데이터셋의 한 시점에서:
- (a) Mixture distribution Moirai: peak 의 *비대칭 truncation* 잘 따라감.
- (b) Student-T 단일 Moirai: peak 에서 *대칭 distribution* 강제 → 95% interval 의 *상한이 비현실적* (peak 보다 훨씬 위).

저자가 *직접 시각화* 로 mixture 의 효용을 제시. 정량 (Table 7) + 정성 (Figure 4) 모두 *flexible distribution* 가설을 뒷받침.

## Ablation — 일부러 넣은 것 vs 숨긴 것

### 일부러 넣음
- 각 component 의 1-way ablation (Table 7).
- Mixture vs Student-T 시각화 (Figure 4).
- Context length scaling (Figure 5).
- Sequence packing 의 padding 측정 (61.08% → 0.38%).

### 숨겨진 것 (저자 의도적 누락 또는 자원 제약)
- **2-way 교호효과**: Multi-patch × Any-variate 의 동시 제거 효과 미보고. Claim 1 의 *직교성 가정* 검증 불가.
- **Component 분기 해석성**: 각 mixture component 의 활성도 (어느 데이터셋에서 어느 분포가 가중치 큰지) 미보고 → mixture 가 *해석 가능한 형태로 수렴* 했는지 모름.
- **Model size scaling**: Small/Base/Large 3 size 만 — *scaling law* (Kaplan 2020 식 N×D vs loss) 미보고. 저자 §4.2 본문 자인: "this calls for more comprehensive neural scaling laws for LTMs".
- **Variate 수 scaling**: 학습 시 변량 수 *beta-binomial(128, 2, 5)* 만 — 평균 37 변량. 1000+ 변량은 학습 안 봄. 본문 "limited support for high-dimensional time series" 명시.
- **Training compute / wall-clock**: A100-40G 에서 1M step batch 256 — *GPU-hour* 수치 미보고. Appendix D.4 "Computation Costs" 가 있으나 *MOIRAI vs baseline* 의 *학습 자체* 비용 비교만 — *총 학습 cost* (지구의 그 N day GPU hour) 는 회피.

## 부록에 숨은 신호

- **Appendix A — LOTSA 도메인별 세부**: 어떤 dataset 이 어느 도메인에 포함되는지 raw list. *Wikipedia / 정부 공개데이터 / Kaggle* 가 출처. 저자 자랑할 만함 (legal/Apache 2 보장).
- **Appendix C.3 Table 19** — Baseline hyperparameter search 명시. *15 회 random search + 5 seed* — baseline 공정성 보장.
- **Appendix D.1 Figure 추가** — Monash 각 dataset 별 normalized MAE. Walmart 같은 케이스에서 Moirai 의 *underperformance* 가 더 두드러짐.
- **Appendix D.4 Computation Costs** — A100-40G 시간 단위 비용 분석. *inference cost* 가 dataset 별 specialized model 대비 *어떻게 amortize* 되는지.

## 수치 투명성

**원문에 명시 수치** (verbatim 추적):
- LOTSA 27,646,462,733 obs ✓ (Table 2)
- 91M / 311M params ✓ (Table 4)
- Padding 61.08% → 0.38% ✓ (§4.4)
- Table 5 의 6×9 격자 모든 수치 ✓
- Table 6 의 6×9 격자 모든 수치 ✓
- Table 7 의 7 행 ✓

**원문에 미보고**:
- 각 mixture component 의 평균 활성도 → "원문에 수치 미보고"
- 도메인별 zero-shot 성능 (Econ-Fin 등) → "원문에 수치 미보고"
- Model size별 scaling law fit → "원문에 수치 미보고, 저자 future work"
