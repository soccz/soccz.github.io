# 08. Self-Supervised Masked Reconstruction

> 본 논문의 *두 번째 큰 contribution*. 시계열의 *일부 patch 가리고 (mask) 모델이 그 patch 를 예측* 하게 학습 → *transferable representation*.

---

## 8.1 챕터 한 줄 요약

> **"시계열의 *40% patch 를 무작위 mask* → Transformer 가 *mask 된 patch 의 값을 예측* 하도록 학습. ChatGPT 의 BERT 학습 방식의 시계열 버전. *정답 없는 데이터* 로 *transferable representation* 학습."**

---

## 8.2 Self-Supervised Learning 이 뭐예요?

### 일상 비유 — *책 읽기*

학생이 *책을 읽을 때*:
- *밑줄 친 단어 의 의미* 를 *주변 단어* 로 추측.
- 예: "*The ___ sat on the mat*" → "cat" 예측.

이게 *self-supervised*. *정답이 미리 주어진 데이터* 없이 *책의 단어 자체* 가 학습 신호.

### NLP 의 BERT (2018)

같은 원리:
1. 문장의 *15% 단어 mask*.
2. *Mask 된 단어* 를 *주변 문맥* 으로 예측.
3. → *언어의 본질적 구조* 학습.

본 논문: 이 원리를 *시계열에 적용*.

### 본 논문의 *Masked Patch Reconstruction*

1. 시계열을 *patch* 로 자름 (Chapter 04 의 patching).
2. *40% 의 patch 를 무작위 mask*.
3. Transformer 가 *mask 된 patch 의 값* 을 *나머지 patch 로* 예측.
4. → *시계열의 본질적 구조* (autocorrelation, periodicity, trend) 학습.

---

## 8.3 *왜* Masked Patch Reconstruction 이 효과적?

### 이유 1 — *정답 없는 데이터* 도 사용

**Supervised**: 정답 (label) 필요. *수동 라벨링* 비용 큼.

**Self-supervised**: *정답 자체가 데이터 안에* — *자동 학습*.

본 논문: *수십 년치 시계열 데이터* 활용 가능. *수동 라벨링 없이*.

### 이유 2 — *Transferable representation*

Self-supervised pre-training 으로 *시계열의 일반적 구조* 학습. 그 다음 *specific forecasting task* 에 *fine-tune*.

**일상 비유**: 학생이 *책 많이 읽으면* → *언어 이해 잘함* → *시험 잘 봄*. 본 논문: 시계열 *많이 보면* → *시계열 이해 잘함* → *forecasting 잘함*.

### 이유 3 — *Foundation model 의 출발*

본 논문의 self-supervised PatchTST 가 *시계열 foundation model 의 base*. 후속:
- *Chronos (Amazon 2024)*: PatchTST 기반 + 수천 만 시계열 pre-train.
- *TimesFM (Google 2024)*: 비슷한 원리.
- *Moirai (Salesforce 2024)*: 비슷.

→ **PatchTST = 시계열 foundation model 의 시조**.

---

## 8.4 정확한 방법 — Step-by-step

### Step 1 — Patching

시계열을 patch 로 자름 (Chapter 04 의 patching). 본 setting: *Non-overlapping* (P = 12, S = 12).

**왜 non-overlap?**: Mask 된 patch 의 *정보가 다른 patch 와 공유되지 않도록*. 학습 목표 명확.

### Step 2 — Random Masking

각 patch 를 *40% 확률로 mask*.

**Mask 한 patch**: 0 또는 special token 으로 대체.

### Step 3 — Transformer Forward Pass

Mask 된 patch 들이 *Transformer encoder* 통과. Self-attention 으로 *주변 patch 의 정보* 활용.

### Step 4 — Prediction Head

각 *mask 된 patch* 의 값을 예측 (linear projection head).

### Step 5 — Loss

**MSE**: 예측 - 실제 mask patch 의 *제곱 평균*.

→ 학습 신호: *Mask 된 patch 의 진짜 값* (정답 자동 가용).

---

## 8.5 Pre-training + Fine-tuning Pipeline

### Setup 정확히 (paper Section 4.2)

- **Input length L = 512**, **patch length P = 12**, **stride S = 12** (non-overlapping) → **N = 42 patches**.
- **Masking ratio = 40%** — 17 patches mask (zero values).

### Phase 1 — Pre-training (100 epochs)

1. 큰 시계열 dataset (예: Electricity 321 channels) 으로 *Masked Patch Reconstruction* 학습.
2. **100 epoch** 동안 학습.
3. 결과: *시계열의 일반 representation* 학습한 Transformer encoder.

### Phase 2a — Linear Probing (20 epochs, head only)

1. Pre-trained encoder *frozen* (parameter 고정).
2. *Prediction head 만 20 epoch* 학습.
3. 결과: *간단/빠름 + encoder representation quality* 직접 검증.

### Phase 2b — End-to-end Fine-tuning (10 + 20 epochs, 2-step)

1. **Step 1 — Linear probing 10 epoch**: head 만 학습 + encoder frozen.
2. **Step 2 — Full fine-tune 20 epoch**: 전체 unfreeze + 모두 학습.
3. **왜 2-step?**: *Kumar et al. 2022* 가 보임 — *fine-tuning directly* 보다 *linear probing 먼저* 가 *out-of-distribution robust*. 본 논문이 이 *2-step strategy* 채택.

### Phase 3 — Transfer

Pre-trained encoder 를 *다른 dataset* 에 사용:
- A dataset 에서 pre-train → B dataset 에 fine-tune.
- 결과: B dataset 의 *processing 빠름 + 정확도 동등 또는 우월*.
- **핵심**: Channel-Indep 덕분에 *A 의 channel 수 (321) ≠ B 의 channel 수 (7)* 여도 transfer 가능. *encoder 의 weight 가 channel 수 무관*.

---

## 8.6 *결과* — Self-supervised PatchTST 의 성능

본 논문 *Section 4.2* + Table 4-6:

### Table 4 — Self-supervised vs Supervised

| Model | MSE (avg) |
|-------|-----------|
| Supervised PatchTST | X |
| **Self-supervised PatchTST (linear probe)** | **X × 0.97** (3% 향상) |
| **Self-supervised PatchTST (fine-tune)** | **X × 0.93** (7% 향상) |

→ **Self-supervised pre-training 이 supervised 보다 *더 좋음***. *대단히 놀라움*.

### Table 5 — Transfer Learning

| Setup | MSE |
|-------|------|
| Train on Electricity → Test on Traffic | X |
| Train on Electricity → **Transfer to Traffic** | X × 1.02 (거의 동등) |

→ *다른 dataset 으로 transfer 도 거의 동등 성능*. *Transferable representation 의 증명*.

```viz:pat-masked-recon:title=Masked Patch Reconstruction (interactive),caption=40% mask ratio. Transformer 가 masked patch 의 값을 주변 patch 로 예측. 학습 신호: 진짜 값과의 MSE.
```

---

## 8.7 *시계열 Foundation Model* 의 시작

본 논문 self-supervised PatchTST 의 의의:

> **"시계열 분야의 *BERT* / *GPT-pretraining* 등가물."**

NLP 의 발전:
- Word2Vec (2013) → ELMo (2018) → BERT (2018) → GPT-2 (2019) → ChatGPT (2022).

시계열의 발전:
- ARIMA → LSTM → Informer (2021) → **PatchTST self-supervised (2023)** → Chronos / TimesFM / Moirai (2024).

→ PatchTST 가 *시계열의 BERT moment*.

---

## 8.8 자기점검

### 핵심 3가지
1. **Self-supervised learning 의 일상 비유?**
2. **Masked Patch Reconstruction 의 정확한 방법?**
3. **본 논문 self-supervised PatchTST 의 *학계 임팩트*?**

### 답변
1. **학생이 책 읽을 때 *밑줄 친 단어 의 의미를 주변 단어로 추측*** — "*The ___ sat on the mat*" → "cat" 예측. NLP 의 BERT (2018) 가 *문장의 15% 단어 mask + 예측* 으로 학습. 본 논문은 *시계열 patch 의 40% mask + 예측* 으로 *동일 원리* 시계열 적용. *정답 없는 데이터* 로 *transferable representation* 학습.
2. **(1) Patching**: 시계열을 *non-overlap patch* (P=S=12) 로 자름. **(2) Random masking**: 40% 의 patch 를 무작위 mask. **(3) Transformer encoder**: 나머지 patch 로 forward, self-attention 으로 정보 활용. **(4) Prediction head**: mask 된 patch 값 예측. **(5) Loss**: MSE — *진짜 patch 값과의 차이*.
3. **시계열 분야의 *BERT moment***. NLP 의 BERT (2018) 가 *NLP foundation model 시대* 를 연 것처럼, *PatchTST self-supervised (2023)* 가 *시계열 foundation model 시대* 시작. 후속: Chronos (Amazon 2024), TimesFM (Google 2024), Moirai (Salesforce 2024) 모두 PatchTST 위에 build. **시계열 ML 의 paradigm shift**.

---

다음 챕터: [09_data_baselines.md](09_data_baselines.md) — 데이터셋 + Baseline 모델.
