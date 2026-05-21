# 03. 왜 PatchTST? DLinear 도전 + 본 논문 응답

> 본 논문이 *왜 나왔는지* 의 학계 역사. 2017년 Transformer 등장부터 2023년 PatchTST 까지.

---

## 3.1 챕터 한 줄 요약

> **"2017-2021 학자들이 *Transformer 를 시계열에 적용* 시도 → 2022년 DLinear 가 *간단한 선형 모델이 더 낫다* 도전 → 2023년 PatchTST 가 *Vanilla Transformer + 두 trick* 으로 응답 + SOTA 달성."**

---

## 3.2 2017년 — Transformer 등장

**Vaswani et al "Attention is All You Need"** (NeurIPS 2017).

NLP (자연어 처리) 의 *완전 혁명*. Attention 메커니즘으로 *RNN/LSTM 의 long-term 의존성 문제* 해결.

이후:
- **2018-2020**: BERT, GPT-2, GPT-3 — NLP 모델 의 *모든 SOTA*.
- **2020**: ViT (Vision Transformer) — *이미지* 도 정복. *16x16 image patching* 으로 NLP Transformer 그대로 적용.
- **2023+**: ChatGPT, GPT-4, Claude 등.

**핵심 메시지**: Transformer 는 *시계열 sequence 다루는 universal 도구* 가 됨.

---

## 3.3 2018-2022 — 학자들의 시계열 Transformer 시도

NLP / CV 성공에 자극받은 학자들이 *시계열에 Transformer 적용* 시도.

### 주요 변형 모델 들

#### Informer (Zhou et al, AAAI 2021)
- **Trick**: *ProbSparse self-attention* — *sparse attention 으로 long-term forecasting 가능*.
- **메시지**: "Transformer 가 시계열도 잘 할 수 있다".

#### Autoformer (Wu et al, NeurIPS 2021)
- **Trick**: *Series Decomposition* (trend + seasonal 분리) + *Auto-correlation* attention.
- **메시지**: "시계열의 *seasonality* 를 명시적으로 모델링".

#### FEDformer (Zhou et al, ICML 2022)
- **Trick**: *Fourier domain* 의 sparse representation + *frequency-enhanced* attention.
- **메시지**: "시계열의 *주파수 정보* 효과적 활용".

### 공통 패턴

이 *Informer / Autoformer / FEDformer* 모두 **시계열 specific attention 변형**. 즉:
- Vanilla Transformer 의 *self-attention* 을 *시계열 specific* 으로 *복잡하게* 수정.

**일상 비유**: 의사가 환자 모든 분야 *각각 specialized 의사* — 심장 specialist, 신경 specialist, 호흡기 specialist. *각 분야 특화*.

학계 가정: "*시계열 = 특수 분야, 일반 Transformer (general physician) 안 됨, specialized 모델 필요*".

---

## 3.4 2022 충격 — DLinear (Zeng et al, AAAI 2023)

도전적 paper:

> **"Transformer 는 시계열 forecasting 에 효과적이지 않다."**

### DLinear 모델

- 매우 *간단한 linear 모델*. *Decomposition + linear projection* 만.
- *No Transformer, no attention, no nonlinearity*.

### 충격적 결과

- DLinear 가 *Informer, Autoformer, FEDformer 능가* — 8 datasets × 4 horizons 의 *대부분 cell* 에서.
- *간단한 모델이 복잡한 Transformer 보다 낫다*.

**학계 분위기**: "Transformer 시계열 X. *시계열 = inherently linear*."

→ 이게 *위기*. 시계열 Transformer 의 *2-3년 노력 무력화*.

---

## 3.5 본 논문의 도전 — "vanilla Transformer + 두 trick"

**2023년 PatchTST (Nie et al)** 가 DLinear 도전에 응답.

### PatchTST 의 핵심 메시지

> **"DLinear 가 옳다 — *시계열 specific 변형* 은 over-engineered. 그러나 *Vanilla Transformer + 두 단순 trick* 만으로 SOTA — DLinear 능가."**

### 두 trick

#### Trick 1 — Patching

**일상 비유**: 시계열 (336 시간) 을 *16 시간 짜리 작은 조각 (patch)* 로 자름.

수학적: $N = \lfloor (L-P)/S \rfloor + 2 = \lfloor (336-16)/8 \rfloor + 2 = 42$ patch.

ViT 의 정신: *image 16x16 patch → 한 token*. PatchTST: *시계열 16 timestep → 한 token*.

#### Trick 2 — Channel-Independence

**일상 비유**: 326 가구 의 전력 데이터 가 있다면 *각 가구를 따로* Transformer 통과 + *모두 같은 weight* 공유.

**대비 (Channel-mixing)**: Informer/Autoformer 가 *모든 channel 을 한꺼번에 처리* — *cross-channel mixing*.

---

## 3.6 본 논문의 *핵심 발견 4가지*

본 논문이 *empirically* 보인 것:

### 발견 1 — Patching + Channel-indep = SOTA

8 datasets × 4 horizons 평균:
- **MSE reduction**: 21.0% (PatchTST/64) vs FEDformer.
- **MAE reduction**: 16.7% (PatchTST/64).

→ DLinear 도 능가.

### 발견 2 — Attention complexity 22× 감소

Token 수 N = 42 (P=16, S=8, L=336):
- Patching 없으면: attention $O(L^2) = O(112,896)$.
- Patching: attention $O(N^2) = O(1,764)$.
- Traffic dataset 의 실측: **22× 시간 단축** (10,040초 → 464초, Table 1).

### 발견 3 — Self-supervised pre-training 가능

*Masked patch reconstruction* 으로 사전 학습 → fine-tuning. 결과:
- *Supervised PatchTST 보다 더 좋음*.
- Transfer learning 가능 (한 dataset → 다른 dataset).

→ **시계열 foundation model 의 출발점**.

### 발견 4 — *Channel-independence* 가 *Channel-mixing* 보다 robust

Cross-channel mixing (Informer/Autoformer) 가 *spurious correlation 학습* 가능. Channel-indep 가 *robust*.

---

## 3.7 본 논문의 의의 — 학계 흐름의 *turning point*

```
   2017 Transformer (NLP)
              ↓
   2018-2021 시계열 Transformer 시도
   Informer, Autoformer, FEDformer
   "시계열 specific 변형 필요"
              ↓
   2022 DLinear 도전
   "Transformer 시계열 X"
              ↓
   2023 PatchTST ★
   "Vanilla Transformer + 두 trick = SOTA"
              ↓
   2024+ 시계열 foundation model 폭증
   iTransformer (2024), Chronos (2024), TimesFM (2024)
   모두 PatchTST 위에 build
```

**메시지**: PatchTST 는 시계열 분야의 *paradigm restoration*. *복잡한 attention 변형 X, Vanilla + 단순 trick* — *ViT 의 정신* 의 적용.

---

## 3.8 본 논문이 *재고* 시킨 통념

| 학계 통념 (2018-2022) | PatchTST 발견 |
|---------------------|--------------|
| 시계열 specific 변형 필요 | *Vanilla Transformer + 단순 trick* 으로 충분 |
| DLinear: "Transformer 시계열 X" | *21% MSE reduction* 으로 반박 |
| 단순 모델이 좋다 | *적절히 설계된 복잡 모델* 이 더 좋음 |
| Channel-mixing 이 자연 | *Channel-indep 가 더 robust* |
| 시계열 foundation model 불가능 | *PatchTST 가 첫 시도* |

---

## 3.9 자기점검

### 핵심 3가지
1. **2022년 DLinear 도전의 의미?**
2. **PatchTST 의 두 trick 의 직관?**
3. **본 논문의 핵심 수치?**

### 답변
1. **"Transformer 가 시계열 forecasting 에 효과적이지 않다"** 라는 도전. *간단한 linear model* (DLinear) 이 *복잡한 Transformer 변형들 (Informer, Autoformer, FEDformer)* 보다 *낫다* 는 결론. *시계열 Transformer 의 2-3년 노력 무력화* — 학계 *위기*. 본 논문 PatchTST 가 이 도전에 정면 응답.
2. **(1) Patching**: 긴 시계열 (336) 을 *16 짜리 작은 조각* 으로 자름 → *한 조각 = 한 단어* (ViT 의 정신). 효과: attention 복잡도 22× 감소 + longer history + local pattern 보존. **(2) Channel-Independence**: 326 변수 (전력 가구) 가 있어도 *각 변수 독립 Transformer 통과 + 같은 weight*. *Cross-channel mixing X*. 효과: overfitting 방지 + spurious correlation 회피.
3. **21.0% MSE reduction + 16.7% MAE reduction (PatchTST/64)** vs FEDformer/Autoformer/Informer 의 8 datasets × 4 horizons 평균. *Attention 22× 빠름* (Traffic dataset). *Self-supervised pre-training* 우월 + *transfer learning* 가능. 시계열 foundation model 의 *출발점*.

---

다음 챕터: [04_patching.md](04_patching.md) — Patching 메커니즘 *시계열 → 토큰* 변환.
