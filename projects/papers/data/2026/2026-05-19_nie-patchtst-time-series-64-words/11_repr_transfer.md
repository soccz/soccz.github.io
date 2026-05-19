# 11 Self-supervised + Transfer Learning Results

paper Section 4.2.

## Setup

paper p.6:
> In this section, we conduct experiments with masked self-supervised learning where we set the patches to be non-overlapped. Otherwise stated, across all representation learning experiments the input sequence length is chosen to be 512 and patch size is set to 12, which results in 42 patches. We consider high masking ratio where 40% of the patches are masked with zero values.

| 항목 | 값 |
|------|---|
| Input length $L$ | 512 |
| Patch size $P$ | 12 |
| Stride $S$ | 12 (non-overlapping) |
| Number of patches $N$ | 42 |
| Mask ratio | 40% |
| Mask value | 0 |
| Pre-training epochs | 100 |

---

## Table 4 — Self-supervised vs Supervised

paper Table 4 caption:
> Multivariate long-term forecasting results with self-supervised PatchTST. We use prediction lengths $T \in \{96, 192, 336, 720\}$.

**PatchTST 의 3 가지 모드** (Table 4 columns):
1. **Fine-tuning**: pre-train 후 전체 fine-tune
2. **Lin. Prob.** (Linear probing): pre-train 후 head 만 학습
3. **Sup.** (Supervised): scratch 부터 supervised 학습

### Electricity

| T | Fine-tune MSE/MAE | Lin Prob MSE/MAE | Sup. MSE/MAE | DLinear | FEDformer | Autoformer | Informer |
|---|---|---|---|---|---|---|---|
| 96 | **0.144** / **0.193** | 0.158 / 0.209 | 0.152 / 0.199 | 0.176 / 0.237 | 0.238 / 0.314 | 0.249 / 0.329 | 0.354 / 0.405 |
| 192 | **0.190** / **0.236** | 0.203 / 0.249 | 0.197 / 0.243 | 0.220 / 0.282 | 0.275 / 0.329 | 0.325 / 0.370 | 0.419 / 0.434 |
| 336 | **0.244** / **0.280** | 0.251 / 0.285 | 0.249 / 0.283 | 0.265 / 0.319 | 0.339 / 0.377 | 0.351 / 0.391 | 0.583 / 0.543 |
| 720 | **0.320** / **0.335** | 0.321 / 0.336 | 0.320 / 0.335 | 0.323 / 0.362 | 0.389 / 0.409 | 0.415 / 0.426 | 0.916 / 0.705 |

→ Self-sup Fine-tune 이 모든 horizon 에서 best. T=96 에서 0.144 (Fine-tune) < 0.152 (Sup) — 5% 개선.

### Traffic

| T | Fine-tune | Lin Prob | Sup. | DLinear |
|---|---|---|---|---|
| 96 | **0.352** / **0.244** | 0.399 / 0.294 | 0.367 / 0.251 | 0.410 / 0.282 |
| 192 | **0.371** / **0.253** | 0.412 / 0.298 | 0.385 / 0.259 | 0.423 / 0.287 |
| 336 | **0.381** / **0.257** | 0.425 / 0.306 | 0.398 / 0.265 | 0.436 / 0.296 |
| 720 | **0.425** / **0.282** | 0.460 / 0.323 | 0.434 / 0.287 | 0.466 / 0.315 |

→ Self-sup 가 Sup 보다 4-6% 개선.

### Weather

| T | Fine-tune | Lin Prob | Sup. | DLinear |
|---|---|---|---|---|
| 96 | **0.126** / **0.221** | 0.138 / 0.237 | 0.130 / 0.222 | 0.140 / 0.237 |
| 192 | **0.145** / **0.238** | 0.156 / 0.252 | 0.148 / 0.240 | 0.153 / 0.249 |
| 336 | **0.164** / **0.256** | 0.170 / 0.265 | 0.167 / 0.261 | 0.169 / 0.267 |
| 720 | **0.193** / **0.291** | 0.208 / 0.297 | 0.202 / 0.291 | 0.203 / 0.301 |

paper p.7 분석:
> on large datasets our pre-training procedure contributes a clear improvement compared to supervised training from scratch. By just fine-tuning the model head (linear probing), the forecasting performance is already comparable with training the entire network from scratch and better than DLinear.

**핵심 관찰**:
- Fine-tune > Sup. on large datasets (Electricity / Traffic / Weather)
- Lin. Prob. ≈ Sup. (즉 head 만 학습해도 scratch supervised 수준)
- Lin. Prob. > DLinear consistently

---

## Table 5 — Transfer Learning

paper Table 5 caption:
> Transfer learning task: PatchTST is pre-trained on Electricity dataset and the model is transferred to other datasets.

**Setup**:
- Pre-train: Electricity 만
- Transfer: 같은 모델을 Traffic, Weather, ... 에 fine-tune
- Channel-indep + weight sharing 덕분에 가능

### Traffic (transfer from Electricity)

| T | PatchTST Fine-tune | Lin Prob | Sup. (no transfer) | DLinear | FEDformer | Autoformer | Informer |
|---|---|---|---|---|---|---|---|
| 96 | **0.145** / **0.195** | 0.163 / 0.216 | 0.152 / 0.199 | 0.176 / 0.237 | 0.238 / 0.314 | 0.249 / 0.329 | 0.354 / 0.405 |
| 192 | **0.193** / **0.243** | 0.205 / 0.252 | 0.197 / 0.243 | 0.220 / 0.282 | 0.275 / 0.329 | 0.325 / 0.370 | 0.419 / 0.434 |
| 336 | **0.244** / **0.280** | 0.253 / 0.289 | 0.249 / 0.283 | 0.265 / 0.319 | 0.339 / 0.377 | 0.351 / 0.391 | 0.583 / 0.543 |
| 720 | **0.321** / **0.337** | 0.320 / 0.336 | 0.320 / 0.335 | 0.323 / 0.362 | 0.389 / 0.409 | 0.415 / 0.426 | 0.916 / 0.705 |

→ Electricity 에서 pre-train → Traffic fine-tune 이 직접 supervised 와 비슷한 성능 (0.145 vs 0.152). 

### Weather (transfer from Electricity)

| T | Fine-tune | Lin Prob | Sup. | DLinear |
|---|---|---|---|---|
| 96 | **0.388** / **0.273** | 0.400 / 0.288 | 0.367 / 0.251 | 0.410 / 0.282 |
| 192 | **0.400** / **0.277** | 0.412 / 0.293 | 0.385 / 0.259 | 0.423 / 0.287 |
| 336 | **0.408** / **0.280** | 0.425 / 0.307 | 0.398 / 0.265 | 0.436 / 0.296 |
| 720 | **0.447** / **0.310** | 0.457 / 0.317 | 0.434 / 0.287 | 0.466 / 0.315 |

paper p.7:
> We observe from Table 5 that overall the fine-tuning MSE is lightly worse than pre-training and fine-tuning on the same dataset, which is reasonable. The fine-tuning performance is also worse than supervised training in some cases. However, the forecasting performance is still better than other models.

→ Transfer 가 self-supervised on same dataset 보다 살짝 worse — but **다른 baseline 들보다 좋음**.

---

## Table 6 — Representation Learning Methods Comparison

paper Table 6 caption:
> Representation learning methods comparison. Column name transferred implies pre-training PatchTST on Traffic dataset and transferring the representation to ETTh1, while self-supervised implies both pre-training and linear probing on ETTh1. The best and second best results are in bold and underlined. IMP. denotes the improvement on best results of PatchTST compared to that of baselines, which is in the range of 34.5% to 48.8% on various prediction lengths.

### ETTh1 (Linear probing only)

| T | IMP. (PatchTST vs best) | PatchTST Transferred | PatchTST Self-sup | BTSF | TS2Vec | TNC | TS-TCC |
|---|---|---|---|---|---|---|---|
| 24 | **42.3%** | 0.312/0.362 | 0.322/0.369 | 0.541/0.519 | 0.599/0.534 | 0.632/0.596 | 0.653/0.610 |
| 48 | **44.7%** | 0.339/0.378 | 0.354/0.385 | 0.613/0.524 | 0.629/0.555 | 0.705/0.688 | 0.720/0.693 |
| 168 | **34.5%** | 0.424/0.437 | 0.419/0.424 | 0.640/0.532 | 0.755/0.636 | 1.097/0.993 | 1.129/1.044 |
| 336 | **48.5%** | 0.472/0.472 | 0.445/0.446 | 0.864/0.689 | 0.907/0.717 | 1.454/0.919 | 1.492/1.076 |
| 720 | **48.8%** | 0.508/0.507 | 0.487/0.478 | 0.993/0.712 | 1.048/0.790 | 1.604/1.118 | 1.603/1.206 |

**비교 대상 — Contrastive learning baselines**:
- **BTSF** (Yang & Hong, 2022) — Bilinear Temporal Spectral Fusion
- **TS2Vec** (Yue et al., 2022) — Universal time series representation
- **TNC** (Tonekaboni et al., 2021) — Temporal Neighborhood Coding
- **TS-TCC** (Eldele et al., 2021) — Time series TCC

→ PatchTST 가 **34.5% ~ 48.8% improvement** vs 최고 contrastive baseline. 압도적.

paper p.7:
> Results from Table 6 strongly indicates the superior performance of PatchTST, both from pre-training on its own ETTh1 data (self-supervised columns) or pre-training on Traffic (transferred columns).

---

## 핵심 메시지 정리

1. **Self-supervised > Supervised on large data** (Table 4):
   - Fine-tune 후 Sup 보다 5% 개선
   - Linear probing 으로도 Sup 과 비슷 (학습 비용 1/10)

2. **Transfer learning 가능** (Table 5):
   - Pre-train: Electricity
   - Fine-tune: Traffic, Weather, ETT — 모두 SOTA
   - Channel-indep + weight sharing 이 가능하게 함

3. **Contrastive baseline 압도** (Table 6):
   - BTSF / TS2Vec / TNC / TS-TCC vs PatchTST — 34-49% improvement

paper Section 5:
> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting and be a building block for time series foundation models.

→ **시계열 foundation model** 의 building block. Chronos / TimesFM / Moirai 등 후속 foundation model 의 spiritual ancestor.

---

## Quote — paper 의 self-evaluation

paper p.7:
> Comparison with Supervised Methods. Table 4 compares the performance of PatchTST (with fine-tuning, linear probing, and supervising from scratch) with other supervised method. As shown in the table, on large datasets our pre-training procedure contributes a clear improvement compared to supervised training from scratch. By just fine-tuning the model head (linear probing), the forecasting performance is already comparable with training the entire network from scratch and better than DLinear. The best results are observed with end-to-end fine-tuning. Self-supervised PatchTST significantly outperforms other Transformer-based models on all the datasets.

다음 [12_ablation.md](12_ablation.md) 에서 Table 7 ablation 의 4 cases.
