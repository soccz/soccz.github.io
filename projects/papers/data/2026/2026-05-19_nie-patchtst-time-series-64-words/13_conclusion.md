# 13. Conclusion + Future Work — 무엇이 남았나

> 본 논문 *결론 + 의의 + 미래 연구 방향*.

---

## 13.1 챕터 한 줄 요약

> **"Vanilla Transformer + Patching + Channel-Indep = 시계열 SOTA. ViT 의 시계열 적용. 시계열 foundation model 의 출발점. Future: cross-channel dependency, probabilistic forecasting, online learning."**

---

## ★ 본 paper 의 4년 후 평가 (2023 ICLR → 2025+)

### 정량 임팩트

- **Citations** (2024-05 시점): 1500+ (ICLR 2023 paper 중 top tier).
- **후속 paper**: 시계열 forecasting paper 의 거의 모두가 PatchTST baseline 사용.

### 학계 paradigm shift 의 정확한 그림

| 항목 | Before PatchTST (2022) | After PatchTST (2023+) |
|------|----------------------|---------------------|
| 시계열 attention 변형 | 필수 (Informer/Auto/FED) | **불필요** (vanilla 충분) |
| Channel handling | Mixing default | **Independence default** |
| Long L 활용 | 불가능 (L>96 악화) | **가능** (L=720 까지) |
| Self-supervised | 시도 없음 | **표준** (BERT moment) |
| Foundation model | 불가능 | **가능** (Chronos, TimesFM, Moirai) |
| Transfer learning | 어려움 | **자연스러움** |

→ **6가지 분야의 동시 paradigm shift**.

### 가장 큰 long-term impact

> **본 paper 의 가장 큰 contribution = 21% MSE reduction 이 아니라 "시계열 BERT moment"**.

NLP 의 BERT (2018) 가 NLP foundation model 시대를 시작한 것처럼, PatchTST (2023) 가 시계열 foundation model 시대를 시작.


---

## 13.2 본 논문 *3대 기여*

**일상 비유 — 한 권의 책의 3 부**: 본 논문이 학계에 *3 권* 의 책 같음:
1. *Method 책* — *어떤 도구 만들었나*.
2. *Empirical 책* — *얼마나 효과 있나*.
3. *Foundation 책* — *미래 분야 가능성 열었나*.

### 1. **Method** — Patching + Channel-Independence

> **Vanilla Transformer + 두 단순 trick = SOTA**.

기존 *Informer / Autoformer / FEDformer* 의 *시계열 specific attention 변형* 보다 *효과적 + 간단*. ViT 의 *image patching* 의 시계열 버전.

### 2. **Empirical** — 21% MSE reduction

> **8 datasets × 4 horizons × 7 baselines = 224 cell 비교, PatchTST 가 거의 모든 cell best**.

평균: 21% MSE / 16.7% MAE reduction vs FEDformer. *Statistically robust + economically significant*.

### 3. **Foundation** — Self-supervised + Transfer

> **시계열 foundation model 의 출발점**.

Masked patch reconstruction → pre-training → fine-tuning + transfer learning. *Supervised 보다 better* + *cross-dataset transferable*.

후속 시계열 foundation models (iTransformer 2024, Chronos 2024, TimesFM 2024, Moirai 2024) 모두 *PatchTST 위에 build*.

---

## 13.3 본 논문이 *반박* 한 통념

| 학계 통념 (2018-2022) | PatchTST 발견 |
|---------------------|--------------|
| 시계열 specific Transformer 변형 필요 | Vanilla + 단순 trick 으로 충분 |
| DLinear: "Transformer 시계열 X" | 21% MSE reduction 으로 반박 |
| Channel-mixing 가 자연 | Channel-Indep 가 robust + universal |
| Longer L 어렵다 | Patching 으로 가능 |
| 시계열 foundation model 불가능 | PatchTST 가 first step |

---

## 13.4 본 논문의 *limitation* (저자 명시)

### Limitation 1 — Cross-channel dependency 무시

Channel-Indep 의 *대가*: cross-channel 정보 활용 X.

예: 326 가구 의 *같은 동네 가구* 사이 *correlated demand*. PatchTST 는 *이 정보 무시*.

후속: *iTransformer (2024)* 가 *channel attention* 으로 *cross-channel advantage 회복* 시도.

### Limitation 2 — Point forecast 만

본 논문은 *point estimate*. *Probabilistic (확률) forecast* 제공 X.

후속: *QuantileFormer, ProTran* 같은 *probabilistic 모델*.

### Limitation 3 — Univariate-style 학습

각 channel 이 *univariate 시계열로 처리*. *Multi-variate 의 진짜 가치* 활용 못 함.

---

## 13.5 *미래 연구 방향* (저자가 명시)

### 1. Cross-channel dependency 활용

> "Future work could explore models that leverage cross-channel information while preserving the *robustness benefits of channel-independence*."

→ 이걸 *iTransformer (2024)* 가 시도.

### 2. Probabilistic forecasting

> "Extension to probabilistic forecast (predictive intervals, density estimates)."

### 3. Online learning + Real-time adaptation

> "Recursive 학습 (본 논문) → Online sequential."

### 4. Domain transfer

본 논문이 *equity forecasting, energy* 같은 *cross-domain transfer* 시도 가능성.

---

## 13.6 본 논문 의 *학계 임팩트*

### 단기 (2023-2024)

- ICLR 2023 publication. *시계열 분야 의 새 SOTA*.
- AQR, Two Sigma 같은 *industry quant fund* 의 ML model design 영향.

### 중기 (2024-2025)

- *iTransformer (ICLR 2024)*: PatchTST 의 *cross-channel limitation* 해결.
- *Chronos (Amazon, 2024)*: PatchTST 기반 *시계열 foundation model*.
- *TimesFM (Google, 2024)*: 시계열 foundation model.
- *Moirai (Salesforce, 2024)*: 시계열 foundation model.

→ *PatchTST 가 모든 후속 paper 의 baseline*.

### 장기 (2025+)

- *시계열 foundation model* 의 표준화.
- *Pre-training scale-up* (PatchTST 의 *기본 setting* 이 *scale 의 출발점*).

---

## 13.7 자기점검

### 핵심 3가지
1. **본 논문의 *3대 기여*?**
2. **본 논문의 *3가지 limitation*?**
3. ***미래 연구 방향* 의 가장 중요한 것?**

### 답변
1. **(1) Method**: Vanilla Transformer + Patching + Channel-Indep = SOTA. (2) **Empirical**: 21% MSE / 16.7% MAE reduction (8 datasets × 4 horizons). (3) **Foundation**: Self-supervised + transfer learning — 시계열 foundation model 의 출발점.
2. **(1) Cross-channel dependency 무시** — Channel-Indep 의 대가, iTransformer 가 해결. **(2) Point forecast 만** — probabilistic 없음 (QuantileFormer 가 후속). **(3) Univariate-style 학습** — multi-variate 의 진짜 가치 활용 X.
3. **Cross-channel dependency 활용** — Channel-Indep 의 *robustness* 와 *cross-channel info* 둘 다 가지는 model. 본 논문 이후 *iTransformer (2024)* 가 직접 응답 → channel attention 으로 cross-channel advantage 회복 + Channel-Indep 의 sample efficiency 보존.

---

다음 챕터: [14_glossary.md](14_glossary.md) — 용어집 + 기호 사전.
