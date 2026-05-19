# 12 Ablation Study — Table 7 + Figure 4

paper Section 4.3.

## Table 7 — Patching + Channel-independence

paper Table 7 caption:
> Ablation study of patching and channel-independence in PatchTST. 4 cases are included: (a) both patching and channel-independence are included in model (P+CI); (b) only channel-independence (CI); (c) only patching (P); (d) neither of them is included (Original TST model). PatchTST means supervised PatchTST/42. '-' in table means the model runs out of GPU memory (NVIDIA A40 48GB) even with batch size 1. The best results are in bold.

**4 cases**:
| Case | Patching | Channel-indep | 의미 |
|------|----------|---------------|------|
| (a) **P + CI** | ✓ | ✓ | Full PatchTST/42 |
| (b) CI only | × | ✓ | Channel-indep but no patching |
| (c) P only | ✓ | × | Patching but channel-mixing (vanilla TST + patches) |
| (d) Original | × | × | TST (Zerveas 2021) baseline + FEDformer |

### Electricity

| T | P+CI MSE/MAE | CI MSE/MAE | P MSE/MAE | Original MSE/MAE | FEDformer MSE/MAE |
|---|---|---|---|---|---|
| 96 | **0.152** / **0.199** | 0.164 / 0.213 | 0.168 / 0.223 | 0.177 / 0.236 | 0.238 / 0.314 |
| 192 | **0.197** / **0.243** | 0.205 / 0.250 | 0.213 / 0.262 | 0.221 / 0.270 | 0.275 / 0.329 |
| 336 | **0.249** / **0.283** | 0.255 / 0.289 | 0.266 / 0.300 | 0.271 / 0.306 | 0.339 / 0.377 |
| 720 | **0.320** / **0.335** | 0.327 / 0.343 | 0.351 / 0.359 | 0.340 / 0.353 | 0.389 / 0.409 |

### Traffic

| T | P+CI | CI | P | Original | FEDformer |
|---|---|---|---|---|---|
| 96 | **0.367** / **0.251** | 0.397 / 0.271 | 0.595 / 0.376 | 0.205 / 0.318 | 0.576 / 0.359 |
| 192 | **0.385** / **0.259** | 0.411 / 0.276 | 0.612 / 0.387 | - | 0.610 / 0.380 |
| 336 | **0.398** / **0.265** | 0.423 / 0.282 | 0.651 / 0.391 | - | 0.608 / 0.375 |
| 720 | **0.434** / **0.287** | 0.457 / 0.309 | - | - | 0.621 / 0.375 |

**Note**: Traffic 의 "-" — Original TST 가 OOM (GPU memory 부족) — 862 channel 의 channel-mixing 이 너무 큼.

### Weather

| T | P+CI | CI | P | Original | FEDformer |
|---|---|---|---|---|---|
| 96 | **0.130** / **0.222** | 0.136 / 0.231 | 0.196 / 0.307 | - | 0.186 / 0.302 |
| 192 | **0.148** / **0.240** | 0.164 / 0.263 | 0.215 / 0.323 | - | 0.197 / 0.311 |
| 336 | **0.167** / **0.261** | 0.168 / 0.262 | 0.228 / 0.338 | - | 0.213 / 0.328 |
| 720 | **0.202** / **0.291** | 0.219 / 0.312 | 0.244 / 0.345 | - | 0.233 / 0.344 |

---

## Ablation 분석

paper p.8:
> We study the effects of patching and channel-independence in Table 7. We include FEDformer as the SOTA benchmark for Transformer-based model. By comparing results with and without the design of patching / channel-independence accordingly, one can observe that both of them are important factors in improving the forecasting performance.

**Electricity T=96 의 진화**:
- (d) Original TST: 0.177
- (c) P only: 0.168 (+ patching) → 5% 개선
- (b) CI only: 0.164 (+ channel-indep) → 7% 개선
- (a) P+CI: **0.152** (both) → 14% 개선

→ **둘 다 중요**. Channel-indep 가 patching 보다 조금 더 effective. 둘 결합이 시너지.

paper p.8:
> The motivation of patching is natural; furthermore this technique improves the running time and memory consumption as shown in Table 1 due to shorter Transformer sequence input. Channel-independence, on the other hand, may not be as intuitive as patching is in terms of the technical advantages. Therefore, we provide an in-depth analysis on the key factors that make channel-independence more preferable in Appendix A.7.

→ **Patching: 직관적 (complexity), Channel-indep: 효과적이지만 직관 없음**. Appendix A.7 에서 분석.

---

## 인터랙티브 시각화 — Table 7

```viz:pat-ablation-table7:title=paper Table 7 — Patching + Channel-indep ablation (interactive),caption=4 cases (P+CI / CI / P / Original) 비교. Dataset 토글 (Electricity / Traffic / Weather) + horizon 토글 (96/192/336/720). Original TST 는 Traffic, Weather 에서 OOM (GPU memory 부족 표시). P+CI 가 모든 cell 에서 best.
```

---

## Figure 4 — Patch length 영향

paper p.15 Figure 4 caption:
> MSE scores with varying patch lengths $P = [2, 4, 8, 12, 16, 24, 32, 40]$ where the lookback window is 336 and the prediction length is 96.

![Fig 4 Patch length ablation](figures/Fig4_patch_length.png)

paper p.27 분석:
> One observation from Figure 4 is that MSE scores don't vary significantly with different patch length.

**핵심 관찰**:
- P = 2 부터 P = 40 까지 다양한 patch length 시도
- **MSE 거의 변동 없음** — patch length 에 robust
- 즉, P=16 의 선택은 hyperparameter sensitivity 문제 없음

→ Patching 의 효과는 정확한 P 값에 민감하지 않음. 더 robust 한 design.

---

## Look-back window 영향 (Figure 2 와 보완)

paper p.8:
> Varying Look-back Window. In principle, a longer look-back window increases the receptive field, which will potentially improves the forecasting performance. However, as argued in (Zeng et al., 2022), this phenomenon hasn't been observed in most of the Transformer-based models. We also demonstrate in Figure 2 that in most cases, these Transformer-based baselines have not benefited from longer look-back window $L$, which indicates their ineffectiveness in capturing temporal information. In contrast, our PatchTST consistently reduces the MSE scores as the receptive field increases, which confirms our model's capability to learn from longer look-back window.

→ Look-back window 분석은 ch10 의 Figure 2 viz 와 같이 봄.

---

## 추가 ablation — Appendix A.4 (Table 10)

paper p.18 Table 10:
- 모든 8 dataset 에 대해 (P+CI / CI / P / Original) ablation
- Trend 일관: **P+CI > CI ≈ P > Original**
- 큰 dataset (Traffic, Electricity) 에서 ablation 효과 큼

---

## Channel-independence 의 추가 분석 — Figure 7 (Appendix A.7)

paper p.21 Figure 7:
> Channel-independence vs channel-mixing on Weather dataset. The base model is...

paper p.21 분석:
> on left panel of Figure 7. It is clear that channel-independent models converges faster against
> 
> loss on test data and plot on the right panel of Figure 7. Channel-mixing models show overfitting after a few initial epochs, while channel-independent models continue optimizing the

**Key findings** (Figure 7 의 좌/우 panel):
- **Left (train loss)**: Channel-indep 가 더 빨리 수렴
- **Right (test loss)**: Channel-mixing 은 초기 몇 epoch 후 overfitting → loss 증가 / Channel-indep 은 계속 감소

→ **Channel-mixing 의 핵심 약점**: overfitting. Test data 에 일반화 안 됨.

---

## Channel-indep 가 다른 모델에도 적용되나? — Table 15

paper p.22 Table 15:
> Channel-independence for other models. CI denote channel-independence. Baselines without CI are cited from Zeng et al. (2022). The better results between CI and non-CI versions are in bold. PatchTST/42 is placed on the left for easy reference to other CI-based models.

→ Informer-CI / Autoformer-CI / FEDformer-CI 의 결과도 측정. **Channel-indep 추가만으로 다른 모델도 개선**.

| Model | T=96 Weather Original | With CI |
|-------|----------|---------|
| Informer | 0.300 / 0.384 | **0.174** / **0.232** |
| Autoformer | 0.266 / 0.336 | **0.227** / **0.289** |
| FEDformer | 0.217 / 0.296 | **0.214** / **0.278** |

→ **Channel-indep 이 universal**. PatchTST 만의 trick 아니라 시계열 Transformer 의 general principle.

---

## 통합 정리 — Ablation 의 메시지

| Design | 효과 | 메커니즘 |
|--------|------|---------|
| **Patching alone** | 5-10% 개선 | Complexity ↓, longer L |
| **Channel-indep alone** | 7-10% 개선 | Overfitting 방지, weight sharing |
| **Both combined** | 14-20% 개선 | Synergy |
| Patch length robustness | flat curve | P=16 의 선택은 robust |
| Universal | Channel-indep 가 다른 모델에도 적용 | Not PatchTST-specific |

→ **두 design 이 independent + synergistic**. 둘 다 essential.

다음 [13_conclusion.md](13_conclusion.md) 에서 Conclusion + future work.
