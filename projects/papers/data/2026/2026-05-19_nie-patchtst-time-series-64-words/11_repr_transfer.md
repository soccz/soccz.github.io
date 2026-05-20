# 11. Self-supervised + Transfer Learning 결과

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

### Setup

A dataset 으로 *pre-train* → B dataset 의 *forecasting 에 transfer*.

본 논문이 시도한 transfer:
- *Electricity → Traffic*: 전력 데이터로 pre-train, 교통 forecast.
- *Electricity → Weather*: 전력 → 날씨.
- *Traffic → Electricity*: 교통 → 전력.
- 등 여러 조합.

### Table 5 의 어떻게 읽나?

**Step 1 — 비교**: 

| Setup | MSE |
|-------|------|
| Supervised on B (자체 학습) | X |
| Pre-trained on A → Fine-tune on B | X × (0.95 ~ 1.05) |

**Step 2 — 발견**: *Transfer 가 거의 동등 또는 약간 우월*. 즉 *시계열 representation 이 cross-dataset transferable*.

### 의미 — *Foundation Model 가능성*

이 결과의 의미:
- *한 큰 dataset 으로 pre-train* → *모든 시계열 task 에 적용 가능*.
- *시계열 BERT / GPT 의 실증 가능성*.

→ **후속 시계열 foundation models** (Chronos 2024, TimesFM 2024, Moirai 2024) 의 *직접 motivation*.

---

## 11.4 *Representation 평가* — Table 6

본 논문이 추가로 *학습된 representation 의 quality* 평가:

### 방법 — Linear Probe

Pre-trained encoder 의 output (representation) 을 *frozen* + *간단한 linear classifier* 학습 → *downstream task* 성능.

### 결과

| Encoder | Linear probe accuracy |
|---------|----------------------|
| Random init | Low |
| Supervised | Medium |
| **Self-supervised PatchTST** | **High** |

→ *Self-supervised representation 이 supervised 보다 더 informative*.

---

## 11.5 자기점검

### 핵심 3가지
1. **Table 4 의 *self-supervised vs supervised* 결과?**
2. **Transfer learning 의 의의?**
3. **본 논문 self-supervised 결과의 *학계 임팩트*?**

### 답변
1. **Self-supervised + Linear Probe: supervised 보다 3% MSE 향상. Self-supervised + Fine-tune: 7% 향상**. 즉 *정답 없는 데이터의 pre-training* 이 *직접 정답 학습* 보다 *효과적*. 학생이 *책 많이 읽고 시험* > *책 안 읽고 시험만 본* 학생.
2. **Pre-train on A → Transfer to B 가 *거의 동등 성능***. 즉 *시계열 representation 의 cross-dataset transferability* 증명. *한 큰 dataset 으로 pre-train → 모든 시계열 task 적용* 가능성. *시계열 foundation model 의 직접 motivation*.
3. **시계열 분야의 *BERT moment***. NLP 의 BERT (2018) 가 *NLP foundation model 시대* 시작한 것처럼, *PatchTST self-supervised (2023)* 가 *시계열 foundation model 시대 시작*. 후속: Chronos (Amazon 2024), TimesFM (Google 2024), Moirai (Salesforce 2024) — 모두 PatchTST 위에 build.

---

다음 챕터: [12_ablation.md](12_ablation.md) — Ablation Study (이미 rewrite 완료).
