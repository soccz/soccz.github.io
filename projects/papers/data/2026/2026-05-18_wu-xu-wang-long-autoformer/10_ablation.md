# 10 Ablation Studies — Tables 3 & 4 (Section 4.2)

paper p.8–9. 본 paper 의 두 contribution 을 각각 따로 검증.

## 인터랙티브 시각화 — 두 ablation 결합

```viz:autoformer-decomp-ablation:title=paper Table 3 — Decomposition architecture ablation (interactive),caption=Backbone 토글 (Transformer / Informer / LogTrans / Reformer) 로 Origin vs Sep vs Ours 의 MSE 비교. 모든 4 backbones × 4 horizons 에서 Ours (progressive inner-block) 가 압승. 사전 분해 (Sep) 는 종종 악영향 — Transformer-720 과 Informer-336 이 대표적.
```

```viz:autoformer-attention-ablation:title=paper Table 4 — Auto-Correlation vs Self-Attention (interactive),caption=I → O setting 토글 (9 combinations). Auto-Correlation 이 9/9 settings 에서 MSE best. predict-1440 에서 Full/LogSparse/LSH 모두 OOM. Auto-Correlation 만 학습 가능.
```

---

## Table 3 — Decomposition Architecture Ablation (p.8)

> Ablation of decomposition in multivariate ETT with MSE metric. Ours adopts our progressive architecture into other models. Sep employs two models to forecast pre-decomposed seasonal and trend-cyclical components separately. Promotion is the MSE reduction compared to Origin.

### 정확한 인용 (paper p.8 Table 3)

| Input-96 Predict-O | Transformer Origin | Sep | Ours | Informer Origin | Sep | Ours | LogTrans Origin | Sep | Ours | Reformer Origin | Sep | Ours | Promotion Sep | Promotion Ours |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 96  | 0.604 | 0.311 | **0.204** | 0.365 | 0.490 | **0.354** | 0.768 | 0.862 | **0.231** | 0.658 | 0.445 | **0.218** | 0.069 | **0.347** |
| 192 | 1.060 | 0.760 | **0.266** | 0.533 | 0.658 | **0.432** | 0.989 | 0.533 | **0.378** | 1.078 | 0.510 | **0.336** | 0.300 | **0.562** |
| 336 | 1.413 | 0.665 | **0.375** | 1.363 | 1.469 | **0.481** | 1.334 | 0.762 | **0.362** | 1.549 | 1.028 | **0.366** | 0.434 | **1.019** |
| 720 | 2.672 | 3.200 | **0.537** | 3.379 | 2.766 | **0.822** | 3.048 | 2.601 | **0.539** | 2.631 | 2.845 | **0.502** | 0.079 | **2.332** |

(MSE; **bold** = best per backbone)

### 해석

3가지 설정 비교:
1. **Origin**: 원본 모델 (Transformer, Informer, LogTrans, Reformer) 직접 사용.
2. **Sep**: 사전 분해 (STL 류) 후 두 모델로 separate prediction.
3. **Ours**: 본 paper 의 progressive inner-block 분해 architecture 를 해당 backbone 에 적용.

paper p.8:
> With our proposed progressive decomposition architecture, other models can gain consistent promotion, especially as the prediction length $O$ increases (Table 3). This verifies that our method can generalize to other models and release the capacity of other dependencies learning mechanisms.

**관찰 1**: 본 paper 의 분해 architecture 를 다른 backbone (Transformer/Informer/LogTrans/Reformer) 에 적용해도 promotion. → **decomposition contribution 이 backbone-agnostic**.

**관찰 2**: 사전 분해 (Sep) 는 종종 **악영향** (Transformer predict-720: 2.672 → 3.200, Informer predict-336: 1.363 → 1.469). 즉 분해를 잘못 쓰면 손해.

> Especially, pre-decomposing may even bring negative effect because it neglects the interaction of components during long-term future, such as Transformer [41] predict-720, Informer [48] predict-336. (p.9)

**관찰 3**: predict 길이가 길수록 promotion 가 커짐. predict-720 의 Transformer 의 Promotion Ours = 2.332 (MSE 감소량) — 압도적.

---

## Table 4 — Auto-Correlation vs Self-Attention (p.9)

> Comparison of Auto-Correlation and self-attention in the multivariate ETT. We replace the Auto-Correlation in Autoformer with different self-attentions. The "−" indicates the out-of-memory.

### 정확한 인용 (paper p.9 Table 4)

| Input I → Predict O | Auto-Correlation MSE | MAE | Full Attention MSE | MAE | LogSparse MSE | MAE | LSH MSE | MAE | ProbSparse MSE | MAE |
|---|---|---|---|---|---|---|---|---|---|---|
| **96 → 336** | **0.339** | **0.372** | 0.375 | 0.425 | 0.362 | 0.413 | 0.366 | 0.404 | 0.481 | 0.472 |
| **96 → 720** | **0.422** | **0.419** | 0.537 | 0.502 | 0.539 | 0.522 | 0.502 | 0.475 | 0.822 | 0.559 |
| **96 → 1440** | **0.555** | **0.496** | 0.667 | 0.589 | 0.582 | 0.529 | 0.663 | 0.567 | 0.715 | 0.586 |
| **192 → 336** | **0.355** | **0.392** | 0.450 | 0.470 | 0.420 | 0.450 | 0.407 | 0.421 | 0.404 | 0.425 |
| **192 → 720** | **0.429** | **0.430** | 0.554 | 0.533 | 0.552 | 0.513 | 0.636 | 0.571 | 1.148 | 0.654 |
| **192 → 1440** | **0.503** | **0.484** | − | − | 0.958 | 0.736 | 1.069 | 0.756 | 0.732 | 0.602 |
| **336 → 336** | **0.361** | **0.406** | 0.501 | 0.485 | 0.474 | 0.474 | 0.442 | 0.476 | 0.417 | 0.434 |
| **336 → 720** | **0.425** | **0.440** | 0.647 | 0.491 | 0.601 | 0.524 | 0.615 | 0.532 | 0.631 | 0.528 |
| **336 → 1440** | **0.574** | **0.534** | − | − | − | − | − | − | 1.133 | 0.691 |

(MSE 와 MAE 모두; **bold** = best per row)

### 해석

paper p.9:
> As shown in Table 4, our proposed Auto-Correlation achieves the best performance under various input-I-predict-O settings, which verifies the effectiveness of series-wise connections comparing to point-wise self-attentions. Furthermore, we can also observe that Auto-Correlation is memory efficiency from the last column of Table 4, which can be used in long sequence forecasting, such as input-336-predict-1440.

**관찰 1**: **9 setting / 9 setting 모두 Auto-Correlation 이 best** — 한 번도 패배 안 함.

**관찰 2**: 긴 predict (1440) 에서 Full Attention / LogSparse / LSH 가 OOM (−). Auto-Correlation 만 학습 가능.

**관찰 3**: ProbSparse (Informer) 도 input-336-predict-1440 에서 1.133 vs Auto-Correlation 0.574 — 거의 2배 차.

---

## 두 contribution 의 시너지

Table 3 와 Table 4 가 함께 보여주는 그림:

- Table 3: Decomposition 만 추가 (다른 backbone) 해도 **promotion**.
- Table 4: Auto-Correlation 만 비교 (다른 self-attention 대신) 해도 **win**.
- **Autoformer = 두 contribution 의 결합** → main results (Table 1) 의 SOTA.

```
                              ┌─ Decomp Off ─┐
                Auto-Corr On  │   →  ?       │  Auto-Corr 단독 효과 (Table 4)
                              │              │
                Auto-Corr Off │   →  ?       │  Decomp 단독 효과 (Table 3)
                              └──────────────┘
                ┌─ Decomp On ─┐
                │   →  Best   │  ← Autoformer
                │              │
                └──────────────┘
```

Table 4 는 "Decomp On 상태에서" Auto-Correlation 을 바꿔치기 함. Table 3 는 "다른 attention 의 backbone" 에 Decomp 만 추가. 결국 두 ablation 모두에서 **각 contribution 이 독립적으로** 효과가 있고 **함께 쓰면 최고**.

---

## Decomp 의 다른 알고리즘 비교 (Table 9, Appendix D)

paper p.14 Table 9 — Separate prediction 의 분해 알고리즘 4가지를 비교:

| 분해 알고리즘 | predict-96 | predict-192 | predict-336 | predict-720 |
|--------------|----|----|----|----|
| STL [33] (Cleveland) | 0.523 | 0.638 | 1.004 | 3.678 |
| Hodrick-Prescott Filter [18] | 0.464 | 0.816 | 0.814 | 2.181 |
| Christiano-Fitzgerald Filter [11] | 0.373 | 0.819 | 1.083 | 2.462 |
| Baxter-King Filter [44] | 0.440 | 0.623 | 0.861 | 2.150 |
| **Progressively (Autoformer)** | **0.255** | **0.281** | **0.339** | **0.422** |

(MSE, ETT predict-O)

→ **모든 horizons 에서 progressive inner block 이 압승**. STL/HP/CF/BK 같은 정교한 분해를 사전처리로 쓰는 것보다 단순 AvgPool 을 inner block 으로 쓰는 게 낫다 — 본 paper 의 가장 도발적 주장의 정량적 근거.

다음 [11_analysis.md](11_analysis.md) 에서 Figs 4–6 의 visualization 해석.
