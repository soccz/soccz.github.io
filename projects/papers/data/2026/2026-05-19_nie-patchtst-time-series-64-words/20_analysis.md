# 20 Analysis — paper 결과의 deep 해석

paper 의 실증 결과 (ch10-12, ch18) 를 표면적 수치 너머에서 분석.

---

## 1. Why patching wins — paper 의 3 가지 가정 검증

### 가정 1: Local semantic 보존 (직관)

paper Section 1 claim:
> we enhance the locality and capture comprehensive semantic information that is not available in point-level by aggregating time steps into subseries-level patches.

**증명** (paper Table 7 Original vs P only):
- Original TST (point-wise, no patch): Electricity T=96 MSE 0.177
- P only (patching, no CI): MSE 0.168 — **5% 개선**
- → 패치 자체만으로 5% 개선 = local semantic 보존 효과

→ 가정 1 **확인** ✓

### 가정 2: Quadratic complexity reduction

paper Section 1:
> the memory usage and computational complexity of the attention map are quadratically decreased by a factor of $S$.

**검증** (paper Table 1):
- Traffic L=336, P=16, S=8 → N=42 tokens
- 이론 reduction: $S^2 = 64×$
- 실측: 22× (Traffic), 19× (Electricity), 4× (Weather)
- → 이론 ↔ 실측 차이는 forward/backward overhead, IO 등

→ 가정 2 **확인** (이론치 < 실측, 정성적 일치) ✓

### 가정 3: Longer look-back window 활용

paper Section 1:
> Patching can group local time steps that may contain similar values while at the same time enables the model to reduce the input token length for computational benefit.

**검증** (paper Fig 2):
- PatchTST: $L=24 \to 720$ 으로 가면서 MSE 일관 감소
- Informer/FEDformer/Autoformer: $L$ 증가해도 MSE 거의 변함 없음 (또는 증가)
- → 다른 Transformer 들은 patching 없으면 longer history 활용 못함

→ 가정 3 **확인** (PatchTST 만이 longer L 의 이점을 살림) ✓

---

## 2. Why channel-independence wins — paper Appendix A.7.1 의 3 reasons 검증

### Reason 1: Adaptability — per-series attention pattern

paper Fig 6 의 직접 증거:
> Figure 6 reveals an interesting observation that the prediction of unrelated time series relies on different attention patterns while similar series can produce similar maps (e.g. series 11, 25, and 81 contain similar patterns while they are different from others).

**해석**:
- Electricity 의 321 series 중 series 11, 25, 81 은 attention map **유사** (비슷한 hourly pattern)
- 다른 series 는 attention map **다름** (e.g., residential vs commercial 가구 별 패턴)
- **Channel-mixing 은 모든 series 가 같은 attention map 사용** → 다양성 손실

→ Channel-indep 의 **per-series attention 적응** 이 우위.

### Reason 2: Data efficiency (Fig 7 left)

`pat-fig7-channel-curves` 좌측 panel:
- Channel-indep: train fraction 0.1 만으로 loss 0.19 도달
- Channel-mixing: 같은 loss 도달 위해 fraction 0.6 필요
- **6배 더 효율적인 data 사용**

→ paper Table 2 datasets 대부분 (Weather 52k, ETTh 17k) 가 **channel-mixing 으로는 부족**.

### Reason 3: Overfitting 방지 (Fig 7 right)

`pat-fig7-channel-curves` 우측 panel:
- Epoch 5 부근:
  - Channel-indep: test loss 0.170, 계속 감소
  - Channel-mixing: test loss 0.170, **이후 0.196 까지 증가** (overfitting)
- Best validation 시점: Channel-indep 는 epoch 15+, channel-mixing 은 epoch 5

→ **Channel-mixing 의 flexibility 가 overfitting 의 양면성**.

---

## 3. Where PatchTST loses — 정직한 한계

### 한계 1: ETTh1 — DLinear 와 거의 동등

paper Table 3 ETTh1 T=96:
| Model | MSE | MAE |
|-------|-----|-----|
| PatchTST/64 | 0.370 | 0.400 |
| PatchTST/42 | 0.375 | 0.399 |
| **DLinear** | **0.375** | **0.399** |
| FEDformer | 0.376 | 0.415 |

→ PatchTST/64 만 marginal 우세 (0.370 vs 0.375). PatchTST/42 와 DLinear 는 **identical MSE**.

**해석**:
- ETTh1 은 7 channels, 17,420 timesteps — relatively small
- DLinear 의 linear inductive bias 가 충분 — Transformer 의 complexity advantage 사라짐
- **Small dataset 에서는 linear baseline 도 강함**

### 한계 2: ETTh1 T=192 — DLinear 가 best

paper Table 3 ETTh1 T=192:
| Model | MSE | MAE |
|-------|-----|-----|
| PatchTST/64 | 0.413 | 0.429 |
| PatchTST/42 | 0.414 | 0.421 |
| **DLinear** | **0.405** | **0.416** |

→ **DLinear 가 T=192 에서 best**. PatchTST 패배.

### 한계 3: Cross-channel dependency 미모델링

paper Section 5:
> Channel-independence ... can be further exploited to incorporate the correlation between different channels. It would be an important future step to model the cross-channel dependencies properly.

**실증**: Electricity 의 321 가구는 명백히 cross-correlation 있음 (공휴일, 시간대). 그러나 PatchTST 는 이를 명시적으로 학습 못함.

→ 이후 paper (**iTransformer**, ICLR 2024) 가 정확히 이 gap 을 채움 — token = series, attention = cross-channel.

---

## 4. Self-supervised 의 진정한 가치

### 표면 — Fine-tune vs Sup 

paper Table 4: Self-sup fine-tune > Sup. on large datasets.

| Dataset T=96 | Sup. MSE | Fine-tune MSE | Improvement |
|--------------|----------|---------------|-------------|
| Weather | 0.130 | 0.126 | 3% |
| Electricity | 0.152 | 0.144 | 5% |
| Traffic | 0.367 | 0.352 | 4% |

→ Marginal (3-5%) — 표면적으로 별로 안 큰 효과.

### 진정한 가치 1: Linear probing 만으로 Sup 수준

paper Table 4:
- Linear probing (head 만 학습, 20 epoch): MSE 0.158 (Electricity T=96)
- Sup (scratch, 100 epoch): MSE 0.152
- **3% 차이, but training time 1/5**

→ **Compute 효율** 이 진짜 가치. Pre-train 한 번 + 여러 task fine-tune.

### 진정한 가치 2: Foundation model 의 prerequisite

paper Section 5:
> Our model exhibits the potential to be the based model for future work of Transformer-based forecasting and be a building block for time series foundation models.

**이후 시계열 foundation model 의 시작점**:
- **Chronos** (Ansari 2024): T5 + tokenization, PatchTST 정신
- **TimesFM** (Das 2024): Decoder-only, patching
- **Moirai** (Woo 2024): Multi-resolution masked, masked patches 정신

→ **PatchTST 가 없으면 시계열 foundation model 도 없었음**.

---

## 5. Fig 6 attention maps — 정량적 해석

paper Fig 6 의 series 11, 25, 81 attention maps 가 시사하는 것:

### Heatmap 의 의미

각 series 의 attention map:
- $A_{ij}$ = patch $i$ 가 patch $j$ 를 얼마나 attend
- N=42 patches → 42×42 attention matrix
- 강한 diagonal = local attention (인접 patch 가 중요)
- 강한 off-diagonal = long-range attention (먼 과거가 중요)

### Paper 의 발견

paper:
> The prediction of unrelated time series relies on different attention patterns while similar series can produce similar maps.

**구체적**:
- Series 11, 25, 81: residential 전력 가구 (저녁 peak), attention map 비슷
- Series 30, 45, 200: commercial 가구 (낮 peak), 별도 attention pattern
- **Per-series specialization** — Channel-mixing 으로는 불가능

### Implication

- **PatchTST 는 implicit clustering** — series 마다 다른 attention 으로 적응
- Cross-channel dependency 없이도 **inductive bias 가 자동 학습**
- 이는 channel-indep 의 큰 발견

---

## 6. 21% MSE reduction 의 분해

paper Section 4.1:
> 21.0% reduction on MSE ... compared with the best results that Transformer-based models can offer

**이 21% 가 어디서 오는가**:

| 컴포넌트 | 기여도 (Electricity T=96 기준) |
|---------|---------|
| Vanilla Transformer baseline (Original TST) | 0.177 → 100% |
| + Patching | 0.168 (5% 감소) |
| + Channel-indep | 0.152 (9% 추가 감소) |
| Total reduction vs FEDformer (0.186) | **0.152 = 18% reduction** |
| + Longer L=512 (/64) | 0.149 (마지막 2% 감소) |
| **vs Informer (0.304)** | **51% reduction** |
| **vs Pyraformer (0.386)** | **61% reduction** |

→ **21% 의 baseline 별 다양성**:
- vs FEDformer: 18%
- vs Autoformer: 22%
- vs Informer: 50%+
- 평균 ≈ 21%

→ paper 의 "21%" 는 **best baseline 기준** — 가장 강한 baseline (FEDformer) 와의 비교가 정직.

---

## 7. 시계열 foundation model trajectory 에서의 PatchTST

```
2017: Transformer (Vaswani) ─ NLP backbone
2018: BERT (Devlin) ─ NLP self-sup + subword tokenization
2021: ViT (Dosovitskiy) ─ CV patching paradigm
2021: MAE (He) ─ CV self-sup with patches
2021-22: Informer/Autoformer/FEDformer/Pyraformer ─ 시계열 attention variants
2022: DLinear ─ "Transformer is not effective" 도전

★ 2023: PatchTST (Nie) ─ 시계열의 ViT moment ★
       ↓
       Tokenization-first paradigm 확립
       ↓
2023: TimesNet (Wu) ─ Period decomp + 2D conv
2024: iTransformer (Liu) ─ Channel attention (Cross-channel 보완)
2024: Chronos (Ansari) ─ Foundation model on tokenized series
2024: TimesFM (Das) ─ Decoder-only foundation
2024: Moirai (Woo) ─ Multi-resolution patching
2024: Lag-Llama (Rasul) ─ Patched decoder-only
```

**PatchTST 의 분야적 함의**:
1. **Tokenization 우위** 입증 — variant attention 보다 입력 tokenize 가 중요
2. **Channel-indep** universal 한 trick (Table 15 가 증명)
3. **Vanilla Transformer 의 부활** — 복잡한 architecture 보다 simple + 좋은 inductive bias
4. **Self-sup 가능성** — foundation model 의 길

---

## 8. 시각화

```viz:pat-table14-seeds:title=paper Table 14 — Random seed robustness (interactive),caption=Dataset 토글 + Metric 토글. Supervised 와 Self-supervised 각각 5 random seeds {2019-2023} 평균 ± std. Error bar 가 매우 작음 — 결과 robust. 대형 dataset (Electricity Traffic Weather) variance 가장 작음 ILI 같은 작은 dataset 은 약간 변동.
```

```viz:pat-fig5-model-size:title=paper Fig 5 — Model size sensitivity (interactive),caption=Dataset 토글. 6 가지 (L D) hyperparameter 조합 = (3 128) (3 256) (4 128) (4 256) (5 128) (5 256). MSE 곡선이 거의 평평 — 모델 사이즈 선택에 robust. ILI 만 변동성 있음 (작은 dataset).
```

```viz:pat-fig7-channel-curves:title=paper Fig 7 — Channel-indep vs Channel-mixing curves (interactive),caption=Panel 토글 — Left: train fraction (0.05~1.0) 별 test loss 비교 channel-indep 가 더 빨리 수렴. Right: epoch 1~20 별 test loss channel-mixing 은 5 epoch 후 overfitting test loss 증가 channel-indep 은 계속 감소.
```

```viz:pat-table11-instance-norm:title=paper Table 11 — Instance Norm with/without (interactive),caption=Dataset 토글 + horizon 토글 + metric 토글. PatchTST/64 +IN vs PatchTST/64 -IN vs PatchTST/42 +IN 3 variants 비교. ILI 에서 -IN 으로 MSE 3배 증가 — Instance Norm 이 critical. 대형 dataset 에서는 marginal 효과.
```

---

## 다음 단계

paper 결과의 deep 해석 끝. 다른 chapter:
- [12_ablation.md](12_ablation.md) — 표면적 ablation 수치
- [15_insights.md](15_insights.md) — 15 메타 통찰
- [18_appendix.md](18_appendix.md) — appendix A.1-A.7 detail
- [19_related_work.md](19_related_work.md) — paper Section 2 deep dive
