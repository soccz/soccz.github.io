# 19. Related Work — 본 논문이 인용하는 모든 prior 작품

## 📌 이 챕터 다 읽으면 알 수 있는 것

- 본 논문이 인용하는 모든 prior 작품 (Transformer / Autoformer / DLinear / ViT / BERT)
- 학계 lineage — NLP 의 patching → 시계열 적용
- 본 논문의 학문적 위치

---

> Paper Section 2 의 *모든 인용 작품* 의 brief description + 본 논문과의 관계.

---

## 19.1 챕터 한 줄 요약

> **"본 논문이 인용하는 30+ prior paper 의 cluster 별 정리. (1) Transformer 의 patch 활용 prior (NLP, CV) — ViT 등, (2) 시계열 Transformer baseline 5종 — Informer, Autoformer, FEDformer, Pyraformer, LogTrans, (3) 시계열 representation learning 두 학파 — Contrastive vs Reconstruction."**

---

## 19.2 Cluster 1 — Transformer 의 Patch 활용 Prior

본 논문 *patching* idea 의 origin.

### ViT (Vision Transformer)

**Dosovitskiy et al, ICLR 2021** — "An Image is Worth 16x16 Words"

- **Idea**: 이미지를 *16x16 patch* 로 자르고 *NLP Transformer 그대로* 적용.
- **본 논문과 관계**: PatchTST 의 직접 prior. *"A Time Series is Worth 64 Words"* 제목의 ViT 변형.

### Swin Transformer

**Liu et al, ICCV 2021** — "Hierarchical Vision Transformer using Shifted Windows"

- **Idea**: ViT 의 변형. *Hierarchical patch + sliding window attention*.
- **본 논문과 관계**: Hierarchical patching 의 ablation reference.

### BERT

**Devlin et al, NAACL 2019** — "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"

- **Idea**: *Masked Language Modeling (MLM)* 로 *self-supervised* pre-train.
- **본 논문과 관계**: PatchTST 의 *masked patch reconstruction* 의 직접 prior.

---

## 19.3 Cluster 2 — 시계열 Transformer Baseline 5종

본 논문이 *비교* 한 *prior 시계열 Transformer*.

### Informer (Zhou et al, AAAI 2021)

- **Trick**: *ProbSparse self-attention* — *sparse attention 으로 long-term forecasting 가능*.
- **Limitation**: *복잡한 attention 변형* — 본 논문이 *vanilla 가 더 좋음* 으로 반박.

### Autoformer (Wu et al, NeurIPS 2021)

- **Trick**: *Series Decomposition* (trend + seasonal) + *Auto-correlation* attention.
- **Limitation**: *시계열 specific* — over-engineered.

### FEDformer (Zhou et al, ICML 2022)

- **Trick**: *Fourier domain* + *frequency-enhanced* attention.
- **Limitation**: 마찬가지 *over-engineered*.

### Pyraformer (Liu et al, ICLR 2022)

- **Trick**: *Pyramidal attention* (hierarchical).
- **본 논문 결과**: PatchTST 능가.

### LogTrans (Li et al, NeurIPS 2019)

- **Trick**: *LogSparse* attention.
- **Early Transformer 시계열**.

---

## 19.4 Cluster 3 — 시계열 Representation Learning 두 학파

### 학파 A — Contrastive Learning

**TS2Vec (Yue et al, AAAI 2022)**: Contrastive learning 으로 *시계열 representation* 학습. Anchor + positive + negative samples.

**TNC (Tonekaboni et al, ICLR 2021)**: Temporal Neighborhood Coding.

→ **Contrastive 학파**: *유사한 sample끼리 가깝게, 다른 sample 끼리 멀게* 학습.

### 학파 B — Reconstruction (본 논문 학파)

**SimMTM (Dong et al)**: Masked time series modeling.

**TimeMAE (Cheng et al)**: TS version of Masked AutoEncoder.

→ **Reconstruction 학파**: *masked 부분을 reconstruction* 학습.

본 논문 PatchTST 가 *후자 학파* — *masked patch reconstruction*.

---

## 19.5 Cluster 4 — DLinear 도전

### DLinear (Zeng et al, AAAI 2023)

**"Are Transformers Effective for Time Series Forecasting?"**

- **Idea**: 매우 단순한 *linear 모델*. Decomposition + linear projection.
- **결과**: Informer/Autoformer/FEDformer 능가.
- **본 논문과 관계**: 본 논문이 *정면 반박* 대상.

---

## 19.6 Cluster 5 — Forecasting Foundation

### Goyal & Welch (2008) — for return prediction (다른 도메인)

자산가격 분야의 시장 수익률 예측 prior. 본 논문에서는 *간접 reference*.

### Hyndman + Athanasopoulos — 시계열 예측의 *bible*

표준 forecasting 교과서. 본 논문에서는 *간접 reference*.

---

## 19.7 본 논문이 cover 한 References 분류

| 클러스터 | 개수 | 본 논문에서의 역할 |
|----------|------|-------------------|
| Transformer patch (ViT, BERT) | 5+ | PatchTST 의 *직접 prior* |
| 시계열 Transformer (Informer 등) | 5 | *비교 대상* |
| Representation learning | 5+ | *Self-supervised 의 prior* |
| DLinear | 1 | *정면 반박 대상* |
| 시계열 foundation | 5+ | *간접 reference* |
| 기타 (Hornik, attention 등) | 10+ | *기술적 reference* |

→ 약 30-40 references, 본 deep dive 가 *cluster classified*.

---

## 19.8 자기점검

### 핵심 3가지
1. **PatchTST 의 *직접 prior*?**
2. **DLinear 와 본 논문의 관계?**
3. **시계열 self-supervised 의 두 학파?**

### 답변
1. **(i) ViT (Dosovitskiy 2020)**: *image patching → Transformer*. PatchTST 제목 *"A Time Series is Worth 64 Words"* 의 직접 변형 (*"An Image is Worth 16x16 Words"*). **(ii) BERT (Devlin 2019)**: *Masked Language Modeling*. PatchTST 의 *masked patch reconstruction* 의 prior.
2. **DLinear (2023)**: "*Transformer 시계열 X*" 도전. *간단한 linear 모델이 Informer/Autoformer 능가*. **PatchTST 의 응답**: *Vanilla Transformer + Patching + CI* 로 *DLinear 도 능가*. 21% MSE reduction. 학계 *위기 → restoration*.
3. **(A) Contrastive Learning**: TS2Vec (2022), TNC (2021) — *유사 sample 끼리 가깝게, 다른 sample 끼리 멀게*. **(B) Reconstruction**: SimMTM, TimeMAE, **PatchTST**. *masked 부분 reconstruction*. 본 논문은 *후자 학파* — *시계열 의 BERT 등가물*.

---

다음 챕터: [20_analysis.md](20_analysis.md) — Analysis (결과의 deep 해석).
