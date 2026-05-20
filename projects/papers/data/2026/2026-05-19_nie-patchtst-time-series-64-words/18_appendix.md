# 18. Appendix Deep Dive — A.1 ~ A.7

> Paper Appendix (p.13–24) 의 *7 sub-section* 정리. 친근 풀이 + step-by-step.

---

## 18.1 챕터 한 줄 요약

> **"Paper Appendix = (A.1) Implementation 디테일, (A.2) Hyperparameter, (A.3) Robustness checks, (A.4) Model size sensitivity (Fig 5), (A.5) Attention maps (Fig 6), (A.6) Channel-indep universal (Table 15), (A.7) Seed variance (Table 14). 모두 본 논문 main 결과의 *추가 검증*."**

---

## 18.2 A.1 — Implementation 디테일

본 논문 *PyTorch 구현* 의 구체 정보:

### Training setup
- *Optimizer*: Adam.
- *Learning rate*: 1e-4.
- *Batch size*: 128.
- *Epochs*: 100 (early stopping with validation).
- *Dropout*: 0.1.

### Hardware
- *GPU*: NVIDIA A100 80GB.
- *학습 시간*: 1-2 시간/실험 (T=12).

---

## 18.3 A.2 — Hyperparameter sensitivity

본 논문 main result 의 *hyperparameter 의존성* 검사:

### Patch length P 의 sensitivity

이미 *Figure 4 (12 챕터)*. P = 16 의 robust.

### Stride S
S < P (overlapping) vs S = P (non-overlap). Supervised default S = 8. Self-supervised default S = 12.

### Look-back L
L = 96, 192, 336, 512 비교. Longer better (Figure 2, 10 챕터).

---

## 18.4 A.3 — Robustness Checks

본 논문이 검사한 *다양한 변형*:

1. **Different RFF random seeds**: 5 seeds 평균 (Table 14, 20 챕터).
2. **Different splits**: Train/val/test split 의 다른 비율.
3. **Different normalizations**: Instance norm vs no norm.
4. **Larger / smaller models**: Model size sweep (Figure 5, 18.5 아래).

→ 모두 *main result robust*.

---

## 18.5 A.4 — Figure 5: Model Size Sensitivity

![Figure 5](figures/Fig5_model_size.png)

*paper p.20 Figure 5.*

### 어떻게 읽나? (Step-by-step)

**Step 1**: 6 sub-plot (3 datasets × 2 horizons).

**Step 2**: 각 sub-plot 에 *model size 6 combination* 의 MSE.

**Step 3**: Model size = (D, layer, head) 조합. 예: 작은 (D=16, layer=2, head=4), 중간 (D=128, layer=3, head=16), 큰 (D=512, layer=6, head=32).

**Step 4 — 발견**: 
- *모든 model size 에서 비슷한 MSE*.
- PatchTST 가 *hyperparameter 에 robust*.

```viz:pat-fig5-model-size:title=Fig 5 — Model size sensitivity (interactive),caption=6 size combinations × 3 datasets. PatchTST robust to model size.
```

---

## 18.6 A.5 — Figure 6: Attention Maps

![Figure 6](figures/Fig6_attention_maps.png)

*paper p.23 Figure 6.*

### 어떻게 읽나?

**Step 1**: 3 시계열 (Electricity 의 가구 11, 25, 81) 의 *attention map*.

**Step 2**: 각 attention map = $N \times N$ matrix. 행 = 시점 (patch), 열 = 시점 (patch). 색 강도 = *두 patch 간 attention weight*.

**Step 3 — 발견**:
- *Diagonal*: 진한 색 — *인접 patch 의 attention 강함* → *local temporal pattern* 학습.
- *Off-diagonal specific spots*: 진한 색 — *먼 patch 간 attention* → *periodicity (예: 24시간 주기)* 학습.

**Step 4 — 의미**: 
- Transformer 가 *시계열의 진짜 패턴* (local + periodic) *자동 학습*.
- *시계열 specific attention (Autoformer auto-correlation)* 변형 없이도 *충분*.

---

## 18.7 A.6 — Table 15: Channel-Indep Universal

이미 *Chapter 05 의 5.6* 에서 다룸.

**핵심**: Channel-Indep 을 *Informer/Autoformer/FEDformer 에 적용 시* *모두 성능 향상*.

→ **Universal trick**.

```viz:pat-table15-ci-universal:title=Table 15 — CI universal (interactive),caption=다른 model 에 CI 적용 시 모두 성능 향상.
```

---

## 18.8 A.7 — Table 14: Seed Variance

이미 *Chapter 20 의 20.7* 에서 다룸.

**핵심**: PatchTST 가 *5 seeds 의 variance 작음* — *robust*.

```viz:pat-table14-seeds:title=Table 14 — Seed variance (interactive),caption=5 seeds × 7 datasets. PatchTST robust, baseline sensitive.
```

---

## 18.9 자기점검

### 핵심 3가지
1. **Appendix 의 7 sub-section?**
2. **Figure 5 가 보여주는 것?**
3. **Figure 6 의 *attention pattern* 의 의미?**

### 답변
1. **(A.1) Implementation, (A.2) Hyperparameter sensitivity, (A.3) Robustness checks, (A.4) Model size (Fig 5), (A.5) Attention maps (Fig 6), (A.6) Channel-Indep universal (Table 15), (A.7) Seed variance (Table 14)**. 모두 *본 논문 main result 의 추가 검증*.
2. **Model size 6 combination 의 MSE 비교 — *모두 비슷***. 즉 PatchTST 의 *hyperparameter (D, layer, head) 에 robust*. *Hyperparameter tuning 거의 안 필요*. 작은 모델 (D=16) 도 *큰 모델 (D=512) 과 동등 성능*.
3. **(i) Diagonal pattern (인접 patch 의 attention 강함) — *local temporal pattern* 학습. (ii) Off-diagonal specific spots — *먼 patch 간 attention*, *periodicity (예: 24시간 주기)* 학습**. 즉 *Transformer 가 시계열의 진짜 패턴 (locality + periodicity) 자동 학습* — *시계열 specific 변형 (Autoformer auto-correlation) 불필요*.

---

다음 챕터: [19_related_work.md](19_related_work.md) — Related Work (이미 rewrite 완료).
