# 12 용어집 · 표기법 · References

> **🧒 이 챕터는 사전**: iTransformer 의 *모든 기술 용어* + *수학 기호* + *인용 paper* 의 단일 빠른 참조. "Variate token 이 뭐였더라?" "Channel Independence 와 iTransformer 의 차이?" 같은 질문에 즉시 답하는 페이지.

## 12.1 용어집 (Glossary)

### 핵심 용어

**iTransformer** (inverted Transformer)
Liu et al. 2024 (ICLR) 의 모델 명. *Transformer 의 변형이 아닌 *dimension 의 inversion*. 입력 시계열의 *temporal axis* 와 *variate axis* 를 바꿔 다음 적용:
- Attention → variate dimension (N variates 사이의 multivariate correlation)
- FFN → temporal dimension (각 variate 의 series representation)
- LayerNorm → variate-wise (각 variate token 의 정규화)

**Temporal token** (vanilla Transformer 의 token)
시점 $t$ 의 *모든 variate* (N 개) 를 *한 token* 으로 embed:
$$x_t = (x_{t,1}, x_{t,2}, \ldots, x_{t,N}) \in \mathbb{R}^N \to \text{token}_t \in \mathbb{R}^D$$
**문제**: 다른 *물리적 의미* 의 variates 가 *한 token* 에 섞임 — variate-centric representation X. paper §2 의 main critique.

**Variate token** (iTransformer 의 token)
변수 $n$ 의 *전체 시계열* (T 시점) 을 *한 token* 으로 embed:
$$X_{:,n} = (x_{1,n}, x_{2,n}, \ldots, x_{T,n}) \in \mathbb{R}^T \to \text{token}_n \in \mathbb{R}^D$$
**효과**: 한 token = 한 variate 의 *global representation*. Attention 이 *multivariate correlation* 직접 capture. paper §3.1.

**Channel Independence** (CI, Nie et al. 2023 PatchTST)
Multivariate forecasting 에서 *각 variate 별도 모델*. Backbone 공유, but variate 간 *interaction* X. iTransformer 의 *대안* — paper §4.2 의 비교 대상.

**Inverted dimension**
Transformer 의 입력 차원 $[B, T, N]$ (batch, time, variate) 의 *time ↔ variate swap*:
- Vanilla: $[B, T, N] \to$ time 축으로 token 화 → attention over time
- Inverted: $[B, N, T] \to$ variate 축으로 token 화 → attention over variate

**Multivariate correlation map**
Variate token 들의 attention score:
$$A = \frac{QK^T}{\sqrt{d_k}} \in \mathbb{R}^{N \times N}$$
$A_{i,j}$ = variate $i$ 와 variate $j$ 의 correlation. paper Fig 9 의 visualization.

**Series representation**
Variate token 의 *FFN-processed* 표현. FFN 의 neurons 가 *amplitude, periodicity, frequency spectrum* 의 filter 역할 (paper §3.2). Universal approximation theorem (Hornik 1991) 적용.

**Lookback length** ($T$, paper notation)
입력 시계열의 길이 (예: 96, 192, 336, 720).

**Prediction length** ($S$, paper notation)
출력 forecast 의 길이 (예: 12, 24, 36, 48 for PEMS; 96, 192, 336, 720 for others).

**MSE / MAE**
- **MSE**: Mean Squared Error — $\frac{1}{NS}\sum_{i,t}(y_{i,t} - \hat y_{i,t})^2$
- **MAE**: Mean Absolute Error — $\frac{1}{NS}\sum_{i,t}|y_{i,t} - \hat y_{i,t}|$
- paper 의 두 main metric.

**Permutation invariant attention**
Attention 의 *입력 순서 무관* 성질. *Token 순서 바꿔도 같은 결과*. Vanilla Transformer 에서 *temporal axis* 에 적용 → *시계열 순서 정보 손실*. iTransformer 에서 *variate axis* 에 적용 → *natural fit* (variate 순서는 임의).

**CKA — Centered Kernel Alignment**
두 representation 의 similarity metric. paper §4.3 (Fig 7) 에서 *iTransformer 의 first vs last block representation similarity* 측정. **높은 CKA = generative task 에 favorable** (Wu 2023, Dong 2023).

### 보조 용어

**ECL** (Electricity Consuming Load)
321 가구의 hourly 전기 소비량 시계열. paper main benchmark.

**ETT** (Electricity Transformer Temperature)
4 subsets: ETTh1, ETTh2 (hourly) / ETTm1, ETTm2 (15-min). 7 variates of transformer oil temperature.

**Traffic**
862 도로 의 hourly occupancy. paper benchmark 의 *high-dimensional* 예 (N=862).

**Weather**
21 weather variables, 10-min interval. Max Planck Institute.

**Solar-Energy**
137 solar plants 의 10-min interval power generation. Lai et al. 2018 (LSTNet).

**PEMS** (California PEMS dataset)
4 subsets: PEMS03/04/07/08. Traffic flow data. Liu et al. 2022a (SCINet) benchmark.

**Exchange** (rate)
8 countries 의 daily exchange rate.

**Market** (Alipay)
6 subsets, minute-sampled server load. paper Appendix F.4.

---

## 12.2 표기법 (Notation)

paper §3 의 표기:

| 기호 | 의미 | 차원 |
|------|------|------|
| $X = \{x_1, \ldots, x_T\}$ | historical observations | $T \times N$ |
| $T$ | lookback length (시간) | scalar |
| $N$ | variate 수 (channel) | scalar |
| $Y = \{x_{T+1}, \ldots, x_{T+S}\}$ | future forecasts | $S \times N$ |
| $S$ | prediction length | scalar |
| $X_{t,:} \in \mathbb{R}^N$ | step $t$ 의 모든 variates (temporal token base) | $N$ |
| $X_{:,n} \in \mathbb{R}^T$ | variate $n$ 의 전체 series (variate token base) | $T$ |
| $h_n^0 = \text{Embedding}(X_{:,n})$ | variate $n$ 의 initial embedding | $D$ |
| $H = \{h_1, \ldots, h_N\}$ | variate tokens stack | $N \times D$ |
| $D$ | embedding dimension | scalar |
| $L$ | TrmBlock layer 수 | scalar |
| $\hat{Y}_{:,n} = \text{Projection}(h_n^L)$ | variate $n$ 의 forecast | $S$ |
| $Q, K, V \in \mathbb{R}^{N \times d_k}$ | self-attention 의 query/key/value | $N \times d_k$ |
| $A_{i,j}$ | variate $i, j$ 사이 attention score | scalar |

**iTransformer 의 forward** (paper Eq 1):
$$h_n^0 = \text{Embedding}(X_{:,n})$$
$$H^{l+1} = \text{TrmBlock}(H^l), \quad l = 0, \ldots, L-1$$
$$\hat{Y}_{:,n} = \text{Projection}(h_n^L)$$

**LayerNorm 형식** (paper Eq 2, *variate-wise* 정규화):
$$\text{LayerNorm}(H) = \left\{\frac{h_n - \text{Mean}(h_n)}{\sqrt{\text{Var}(h_n)}} \;\Big|\; n = 1, \ldots, N\right\}$$

---

## 12.3 References (paper 본문 인용)

### 핵심 인용 — Transformer foundation

- **Vaswani, A., et al. (2017).** "Attention is all you need." *NeurIPS 2017*. — Transformer 의 발명.
- **Ba, J. L., et al. (2016).** "Layer normalization." *arXiv:1607.06450*. — LayerNorm.
- **Hornik, K. (1991).** "Approximation capabilities of multilayer feedforward networks." *Neural Networks*. — Universal approximation theorem.

### Transformer-based forecasters (categorized in paper Fig 3)

**Category I (modified component)**:
- **Wu, H., et al. (2021).** Autoformer. *NeurIPS 2021*.
- **Li, S., et al. (2021).** Informer. *AAAI 2021*.
- **Zhou, T., et al. (2022).** FEDformer. *ICML 2022*.

**Category II (modified architecture, no component)**:
- **Nie, Y., et al. (2023).** PatchTST. *ICLR 2023*.
- **Liu, Y., et al. (2022b).** Non-Stationary Transformer (NSTransformer). *NeurIPS 2022*.

**Category III (modified both)**:
- **Zhang, Y., & Yan, J. (2023).** Crossformer. *ICLR 2023*.

**Category IV (modified architecture only — iTransformer)**: **본 paper**.

### Linear forecasters (challengers)

- **Zeng, A., et al. (2023).** DLinear. *AAAI 2023*. — "Are Transformers effective for TS?"
- **Das, A., et al. (2023).** TiDE. *arXiv*.
- **Li, Z., et al. (2023).** RLinear. *arXiv*.
- **Oreshkin, B. N., et al. (2019).** N-BEATS. *ICLR 2020*.

### TCN-based forecasters

- **Liu, Y., et al. (2022a).** SCINet. *NeurIPS 2022*.
- **Wu, H., et al. (2023).** TimesNet. *ICLR 2023*.
- **Bai, S., et al. (2018).** TCN. *arXiv*.

### Efficient attention (for iTransformer variants)

- **Kitaev, N., et al. (2020).** Reformer. *ICLR 2020*. — LSH attention.
- **Wu, H., et al. (2022).** Flowformer. *ICML 2022*.
- **Dao, T., et al. (2022).** FlashAttention. *NeurIPS 2022*. — Hardware-aware.

### Foundational (vision/NLP transfer)

- **Brown, T., et al. (2020).** GPT-3. *NeurIPS 2020*.
- **Dosovitskiy, A., et al. (2021).** ViT. *ICLR 2021*.
- **Kaplan, J., et al. (2020).** Scaling laws. *arXiv*.
- **Box, G. E., & Jenkins, G. M. (1968).** "Some recent advances in forecasting and control." *JRSS*.

### Theoretical foundations + datasets

- **Kornblith, S., et al. (2019).** CKA similarity. *ICML 2019*.
- **Tolstikhin, I., et al. (2021).** MLP-Mixer. *NeurIPS 2021*.
- **Kim, T., et al. (2021).** Reversible Instance Normalization. *ICLR 2022*.
- **Lai, G., et al. (2018).** LSTNet (Solar-Energy dataset). *SIGIR 2018*.
- **Ekambaram, V., et al. (2023).** TSMixer. *KDD 2023*.

### Multivariate correlation modeling

- **Zhang, Y., & Yan, J. (2023).** Crossformer — explicit cross-variate. *ICLR 2023*.
- **Salinas, D., et al. (2020).** DeepAR — univariate baseline. *Int J Forecast*.

---

## 12.3b References Cross-Reference Table

각 reference 의 본 deep dive 내 *첫 인용 챕터* + *재사용 챕터* 의 매핑:

| Reference | 첫 인용 | 재사용 |
|-----------|--------|--------|
| Vaswani et al. 2017 (Transformer) | 03_problem | 08_lineage, 12_glossary, 17_aftermath |
| Ba et al. 2016 (LayerNorm) | 05b/c/d | 12_glossary |
| Hornik 1991 (UAT) | 05d | 12_glossary, 13_insights |
| **Liu et al. 2024 (iTransformer, *this paper*)** | 00_README | **모든 챕터 인용** |
| **PatchTST (Nie 2023)** | 02_tldr | **03_problem, 05a, 08_lineage, 13_insights, 16_appendix, 17_aftermath** (8 챕터) |
| **DLinear (Zeng 2023)** | 02_tldr | 03_problem, 04_claims, 08_lineage, 16_appendix |
| **Crossformer (Zhang-Yan 2023)** | 03_problem | 08_lineage, 13_insights, 16_appendix, 17_aftermath |
| Autoformer (Wu 2021) | 03_problem | 08_lineage, 16_appendix |
| Informer (Li 2021) | 03_problem | 08_lineage, 16_appendix |
| FEDformer (Zhou 2022) | 03_problem | 08_lineage, 16_appendix |
| TimesNet (Wu 2023) | 03_problem | 04_claims, 16_appendix |
| RLinear (Li 2023) | 16_appendix | 11_verdict |
| TiDE (Das 2023) | 16_appendix | 05d, 13_insights |
| SCINet (Liu 2022a) | 16_appendix | — |
| Stationary / NSTransformer (Liu 2022b) | 05b | 12_glossary, 13_insights |
| Reformer (Kitaev 2020) | 13_insights | 16_appendix, 17_aftermath |
| Flowformer (Wu 2022) | 13_insights | 16_appendix |
| FlashAttention (Dao 2022) | 05c | 13_insights, 16_appendix |
| RevIN (Kim 2021) | 05b | 14_code, 12_glossary |
| MLP-Mixer (Tolstikhin 2021) | 05d | 13_insights |
| **MOIRAI (Salesforce 2024)** | 13_insights | 16_appendix, 17_aftermath, 18_self_critique |
| **TimesFM (Google 2024)** | 13_insights | 17_aftermath |
| **Chronos (Amazon 2024)** | 13_insights | 16_appendix, 17_aftermath |
| **TimeMixer (Wang ICLR 2024)** | 13_insights | 17_aftermath |
| UniTST (Liu 2024) | 13_insights | 17_aftermath |
| TimeXer (NeurIPS 2024) | 13_insights | 17_aftermath |
| Wilinski 2025 (TSFM mech interp) | 17_aftermath | 09_my_research |
| CKA (Kornblith 2019) | 02_tldr | 06_experiments, 13_insights |
| **Datasets** | | |
| LSTNet (Lai 2018) — Solar | 03_problem | 16_appendix |
| ECL / ETT / Exchange | 16_appendix | — |
| PEMS (SCINet derived) | 16_appendix | — |

**관찰**: PatchTST (8 챕터 인용) + Liu 2024 self (모든 챕터) 가 *가장 cross-referenced*. PatchTST 가 iTransformer 의 *direct upstream* 의 정량 증거.

---

---

## 12.4 약어집

| 약어 | 풀이 |
|------|------|
| iTransformer | inverted Transformer (this paper) |
| ICLR | International Conference on Learning Representations |
| MSE | Mean Squared Error |
| MAE | Mean Absolute Error |
| CKA | Centered Kernel Alignment |
| CI | Channel Independence |
| FFN | Feed-Forward Network |
| MLP | Multi-Layer Perceptron |
| TCN | Temporal Convolutional Network |
| RNN | Recurrent Neural Network |
| LSH | Locality-Sensitive Hashing |
| ECL | Electricity Consuming Load |
| ETT | Electricity Transformer Temperature |
| PEMS | California Performance Measurement System |
| SOTA | State-of-the-Art |

---

## 12.5 자기점검 (이 챕터)

### 핵심 3 가지

1. **Temporal token (vanilla) vs Variate token (iTransformer) 의 *결정적 차이*?**
2. **Variate token 의 *attention* 이 *multivariate correlation* 을 의미하는 정확한 mechanism?**
3. **LayerNorm 의 *variate-wise vs temporal-wise* 적용의 *효과 차이*?**

### 답변

1. **Variable 의 *섞임 vs 분리***. Vanilla: token $= (x_{t,1}, x_{t,2}, \ldots, x_{t,N})$ — 다른 variates 가 *한 token 의 components* — 다른 *물리적 의미* (예: temperature + pressure + humidity) 가 *embedding 차원에 wiped out*. iTransformer: token $= X_{:,n}$ — *한 variate 의 전체 series* 만 — variate-centric. **결과**: vanilla 의 attention 은 *time step 간 correlation* (정상적이지만 multivariate 무관), iTransformer 의 attention 은 *variate 간 correlation* (multivariate 직접 capture).

2. **Self-attention 의 dot product 자체**. variate $i, j$ token: $h_i, h_j \in \mathbb{R}^D$. Pre-softmax score $A_{i,j} = q_i^T k_j$ — 두 variates 의 *learned representation* 의 *similarity*. 만약 variates 가 *correlated* 면 *유사한 series pattern* → embeddings $h_i, h_j$ 유사 → $A_{i,j}$ 큼. paper §3.2 명시: "the entries can somewhat reveal the variate-wise correlation".

3. **Variate-wise** (iTransformer, Eq 2): 각 variate 의 *series 통계* 로 정규화 — distinct *physical scales* (kWh vs Celsius vs %) 의 *discrepancy* 제거. *non-stationarity* 처리 (Kim 2021, Liu 2022b). **Temporal-wise** (vanilla): 각 time step 의 *모든 variates* 로 정규화 — distinct variates 가 *섞이며* "interaction noise between noncausal or delayed processes" 도입 (paper §3.2). → variate-wise 가 *physical meaning 보존*.

---

다음 [13_insights.md](13_insights.md) — 메타 통찰 12개.
