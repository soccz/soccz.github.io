# 11. Self-supervised + Transfer Learning 결과

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Self-supervised pre-train → fine-tune 의 정확한 setup
- Source = Electricity → 6 target datasets
- Lin. Prob. vs Fine-tuning vs Supervised 비교
- Foundation model 시대의 출발

---

> 본 논문 Section 4.2 의 *self-supervised 결과* 와 *transfer learning 결과*.

---

## 11.1 챕터 한 줄 요약

> **"Self-supervised pre-training → fine-tune 으로 supervised 보다 *3-7% 더 좋음*. Pre-trained on A → transfer to B 도 거의 동등 성능. *시계열 foundation model 의 실증*."**

---

## 11.2 *Self-supervised vs Supervised* — Table 4

### Setup

- **Supervised**: 처음부터 forecasting 학습.
- **Self-supervised + Linear Probe**: Pre-train (masked patch reconstruction) → *prediction head 만 학습* (encoder frozen).
- **Self-supervised + Fine-tune**: Pre-train → *전체 fine-tune* (encoder + head).

### Table 4 의 어떻게 읽나? (Step-by-step)

**Step 1 — 구조**: 4 datasets (ETTh1, ETTh2, Weather, Electricity) × 4 horizons (96, 192, 336, 720) = 16 cell.

**Step 2 — 비교**: 각 cell 에서 3 모델 의 MSE 비교.

**Step 3 — 발견**:

| Setup | MSE (avg) | vs Supervised |
|-------|-----------|---------------|
| Supervised | X | 0% (reference) |
| Linear Probe | X × 0.97 | **3% 향상** |
| Fine-tune | X × 0.93 | **7% 향상** |

**핵심**: *Self-supervised pre-training* 이 *supervised 보다 좋음*. 즉 *정답 없는 데이터의 pre-training* 이 *직접 정답 학습* 보다 *더 효과적*.

### 일상 비유

학생이 *책 많이 읽고 (pre-training)* 시험 보면 (fine-tune), *책 안 읽고 시험만 본 (supervised)* 학생보다 *시험 더 잘 봄*.

---

## 11.3 *Transfer Learning* — Table 5

### Setup (paper p.7)

**Source dataset (pre-train)**: **Electricity 만** (321 channels). 가장 큰 dataset 의 하나 — pre-train 의 풍부한 학습 신호.

**Target datasets (fine-tune)**: 6 개:
- Weather (M=21)
- Traffic (M=862)
- ETTh1 (M=7)
- ETTh2 (M=7)
- ETTm1 (M=7)
- ETTm2 (M=7)

**핵심**: Channel-Indep 덕분에 *source 의 channel 수 (321) ≠ target 의 channel 수 (7-862)* 여도 *transfer 가능*. *encoder weight 가 channel 수 무관*.

### Table 5 의 어떻게 읽나?

**Step 1 — 3 column 비교** (각 target dataset 마다):
- *Fine-tuning*: Electricity pre-train → target 에 fine-tune.
- *Lin. Prob.*: Electricity pre-train → target 에 linear probing (head 만).
- *Sup.*: target 의 *처음부터 supervised* 학습.

**Step 2 — 비교 의 의미**:

| 결과 | 해석 |
|------|------|
| Transfer fine-tuning < Sup | Transfer 가 *자체 학습 이김* (예상치 못한 결과) |
| Transfer ≈ Sup | *동등* — transferable representation 확인 |
| Transfer linear probe ≈ Sup | *encoder representation 자체 가 informative* (head 만으로 충분) |

**Step 3 — 발견**: 
- 대부분 cell 에서 *Transfer fine-tuning 이 Sup 와 거의 동등 또는 약간 우월*.
- *Linear probe* 도 *상당히 경쟁력* — *encoder representation 자체* 가 *task-agnostic 시계열 representation*.

### 의미 — *Foundation Model 가능성*

이 결과의 의미:
- *한 큰 dataset (Electricity)* 으로 *pre-train* → *6 다른 dataset 에 transfer* 가능.
- *시계열 BERT / GPT 의 실증 가능성*.
- *작은 dataset (M=7 의 ETT 4종)* 에서도 *transfer 가능* — *low-resource setting 의 가능성*.

→ **후속 시계열 foundation models** (Chronos 2024, TimesFM 2024, Moirai 2024) 의 *직접 motivation*.

### 일상 비유

영어 *책 많이 읽은 사람 (Electricity pre-train)* 이 *프랑스어 (Weather), 독일어 (Traffic), 라틴어 (ETT) 4종* 공부 시 *각 언어 처음부터 공부한 사람 보다 빠르고 잘함*. *언어 의 본질적 구조* (시계열의 trend, periodicity, autocorrelation) 가 *언어 (dataset) 무관 transferable*.

---

## 11.4 *Representation 평가* — Table 6 (Contrastive Baseline 과의 비교)

본 논문이 *PatchTST 의 self-supervised representation* 을 *전통 시계열 representation learning 방법들* 과 비교:

### Baseline 들 — 4 종 (모두 contrastive learning 방법)

| Method | Paper | 정신 |
|--------|-------|------|
| **BTSF** | Yang & Hong, ICML 2022 | Bilinear temporal-spectral fusion |
| **TS2Vec** | Yue et al, AAAI 2022 | Universal time series representation, contrastive |
| **TNC** | Tonekaboni et al, ICLR 2021 | Temporal Neighborhood Coding |
| **TS-TCC** | Eldele et al, IJCAI 2021 | Temporal + Contextual Contrasting |

→ 모두 *contrastive learning 학파* (유사 sample 가깝게, 다른 sample 멀게).

### Setup — ETTh1 dataset

- *Linear probing* 만 사용 (encoder frozen + linear head 학습).
- 두 PatchTST setup:
  - **Transferred**: Traffic dataset 으로 pre-train → ETTh1 transfer.
  - **Self-supervised**: ETTh1 자체로 pre-train + linear probing.
- 4 horizons: $T \in \{24, 48, 168, 720\}$.

### 결과 — Table 6 의 IMP 컬럼

본 논문 *Table 6 의 IMP (improvement) 컬럼*: PatchTST 의 *best result* 가 *best baseline 보다 얼마나 좋은지* 정량.

| Horizon T | IMP (%) |
|-----------|---------|
| 24 | **42.3%** |
| 48 | **44.7%** |
| 168 | **34.5%** |
| 720 | **48.8%** |

→ **PatchTST self-supervised 가 contrastive baseline 들 보다 *34.5% ~ 48.8% MSE 향상***. *Massive*.

### 의미 — *Reconstruction 학파 > Contrastive 학파*

본 논문 결과의 *학계 의미*:
- *시계열 representation learning* 의 *주류* 는 contrastive (TS2Vec, TNC, TS-TCC, BTSF).
- 본 논문이 *reconstruction (masked patch)* 으로 *주류 능가*.
- 즉 *NLP 의 BERT (reconstruction) > GPT-3 contrastive* 와 같은 패턴 — *시계열 도 reconstruction 학파 우월*.

**일상 비유**: 학생이 *외국어 공부* 시 *문장 만들기 (reconstruction)* 가 *비교 학습 (contrastive: 이건 비슷, 저건 다름)* 보다 *깊은 이해*.

---

## 11.5 자기점검

### 핵심 5가지

1. **Table 4 의 *self-supervised vs supervised* 결과?**
2. **Transfer learning 의 의의?**
3. **본 논문 self-supervised 결과의 *학계 임팩트*?**
4. **Table 6 의 contrastive baseline (TS2Vec, BTSF) 대비 34-48% 향상의 의미?**
5. **시계열 foundation model 의 후속 진화 (Chronos, TimesFM, Moirai) 와 PatchTST 의 위치?**

### 답변

1. **Self-supervised + Linear Probe: supervised 보다 3% MSE 향상. Self-supervised + Fine-tune: 7% 향상**. 즉 **정답 없는 데이터의 pre-training 이 직접 정답 학습보다 효과적**. 학생이 *책 많이 읽고 시험* > *책 안 읽고 시험만 본* 학생. **놀라운 결과**: 보통 self-supervised < supervised (NLP, CV 에서도). 시계열에서 self-supervised > supervised 의 발견은 **시계열의 sequential 구조가 self-supervised 와 자연 적합** 함을 시사. **메커니즘**: Masked patch reconstruction 이 시계열의 inherent 구조 (cycle, trend) 학습 강제 → forecasting 에도 유용한 표현.

2. **Pre-train on A → Transfer to B 가 *거의 동등 성능***. 즉 **시계열 representation 의 cross-dataset transferability 증명**. *한 큰 dataset 으로 pre-train → 모든 시계열 task 적용* 가능성. **Channel-Indep 의 universality 덕분**: source M=321 (Electricity) → target M=7 (ETT) 또는 M=862 (Traffic) 도 같은 encoder 사용 가능. **시계열 foundation model 의 직접 motivation**. **실무 의미**: low-resource setting (M=7 의 ETT) 에서도 transfer 로 활용 가능 — 작은 시계열 dataset 도 deep learning 의 혜택.

3. **시계열 분야의 *BERT moment***. NLP 의 BERT (2018) 가 *NLP foundation model 시대* 시작한 것처럼, *PatchTST self-supervised (2023)* 가 *시계열 foundation model 시대 시작*. 후속: Chronos (Amazon 2024), TimesFM (Google 2024), Moirai (Salesforce 2024) — 모두 PatchTST 위에 build. **5-10년 영향**: Supervised result (21% MSE) 는 incremental, self-supervised 는 paradigm shift. **연구 영향**: PatchTST 후 self-supervised 시계열 연구 폭증, 2024-2025 foundation model 시리즈.

4. **Table 6 의 결과**: PatchTST self-supervised vs 4 contrastive baseline (BTSF, TS2Vec, TNC, TS-TCC) **MSE 34.5-48.8% 향상**. **의의**: (i) **Reconstruction > Contrastive** for time series — NLP 의 BERT (reconstruction) > GPT-3 contrastive 패턴과 일치. (ii) **시계열 representation learning 의 학계 주류 (contrastive) 능가**. (iii) **PatchTST 의 representation 가치** — supervised 결과 만이 아니라 representation 자체도 우수. **메커니즘 차이**: Contrastive = "이건 비슷, 저건 다름" 학습 → 시계열의 sequential 구조 일부 손실. Reconstruction = "구체적 값 예측" → sequential 구조 보존.

5. **PatchTST 후속 시계열 foundation models**: **Chronos (Amazon 2024)**: T5 architecture + tokenization, 시계열 → token sequence 변환. **TimesFM (Google 2024)**: Patch-based decoder, PatchTST 의 patching 직접 차용. **Moirai (Salesforce 2024)**: Multi-variate handling, in-context learning. **공통점**: PatchTST 의 patching + 시계열 specific tokenization + masked pre-training. **PatchTST 의 위치**: 4세대 시계열 foundation model 의 **direct prerequisite**. **현재 (2026)**: 이 foundation models 가 zero-shot/few-shot forecasting 의 standard — finance, energy, retail 등 다양한 domain. PatchTST 가 시계열 ML 의 ImageNet+ResNet moment 였다면, Chronos/TimesFM 이 시계열의 GPT moment.

---

다음 챕터: [12_ablation.md](12_ablation.md) — Ablation Study (이미 rewrite 완료).
