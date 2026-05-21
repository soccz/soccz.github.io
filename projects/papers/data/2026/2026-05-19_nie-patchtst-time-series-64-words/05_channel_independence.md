# 05. Channel-Independence — 변수 독립 처리

## 📌 이 챕터 다 읽으면 알 수 있는 것

- Channel-Independence 의 정확한 정의
- 본 논문의 결정적 design choice — M 변수를 같은 weight 로 독립 forward
- 왜 cross-channel mixing 보다 좋은가
- iTransformer 등 후속 모델과의 관계

---

> 본 논문의 *두 번째 trick*. M 개 변수 (예: 326 전력 가구) 가 있어도 *각 변수 따로* Transformer 통과 + *모두 같은 weight*.

### 🌱 Channel-Independence — 일상 비유

**한 줄로**: "326 가구를 한 번에 다 보지 말고, **각 가구 따로 처리 + 같은 분석가가 모든 가구 담당**".

| 처리 방식 | 비유 |
|----------|------|
| **Cross-channel mixing** (기존) | 326 가구 회의실에 모아 한 번에 의논. → 가짜 상관 (spurious) 학습 |
| **Channel-Independence** (PatchTST) | 1 가구씩 따로 분석 + 같은 매뉴얼 적용. → 일반화 ↑ |

**왜 좋은가**:
- **Sample 효율 ↑**: M=326 가구 = 326개 학습 샘플 (mixing 은 1개 = 326차원 벡터)
- **Spurious correlation 회피**: 우연히 상관된 가구쌍에 휘둘리지 X
- **Universal**: 다른 transformer (Informer, Autoformer) 에 적용해도 성능 ↑

### 🔣 Channel-Independence 4-단 풀이

| 기호 | 의미 |
|------|------|
| $X \in \mathbb{R}^{L \times M}$ | 입력: L 시점 × M 변수 |
| **Mixing**: $f(X) \in \mathbb{R}^{H \times M}$ | 모든 M 변수를 한 번에 처리 |
| **CI**: $f(X_{:,m}) \in \mathbb{R}^H$ for each $m$ | 각 변수 $m$ 따로 처리, 같은 $f$ |
| 학습 신호 | Mixing = 1 batch, CI = M batch |
| **Test 시** | M 개 출력 합쳐 최종 예측 |

### 🎯 구체 증거 — CI 의 contribution

Ablation (Table 7):
- Patching only: ~3% MSE reduction
- **CI only: ~25-28%** (압도적)
- Patching + CI: ~30-36% (combined)

→ **CI 가 PatchTST 성능의 80% 차지**. Patching 은 부차.

### 🔑 핵심 통찰

> PatchTST 의 진짜 main contribution 은 **Channel-Independence**. 제목의 "patching" 이 강조되지만, 실제 ablation 으로는 CI 가 결정적.

---

## 5.1 챕터 한 줄 요약

> **"326 가구 의 전력 데이터를 한 모델에 넣을 때 *각 가구를 따로* 처리 + *모두 같은 Transformer weight*. *Cross-channel mixing 없음*. 효과: overfitting 방지 + spurious correlation 회피 + sample 효율 ↑."**

---

## ★ Channel-Independence 가 본 논문의 진짜 main contribution

ablation (ch12 Table 7) 의 정확한 수치:

| Trick | 단독 적용 시 MSE reduction |
|-------|--------------------------|
| Patching only | ~3% (minor) |
| **Channel-Independence only** | **~25~28% (major)** |
| Patching + CI | ~30~36% (combined) |

→ **CI 가 22% reduction 의 80% 이상 차지**.

또 paper Table 15 (ch18) 가 보여줌:
- Informer / Autoformer / FEDformer 에 CI 적용 시 **모두 성능 향상**.
- → **CI 는 universal trick** (PatchTST 만의 것이 아님).

또 paper Fig 7 (ch18) 이 보여줌:
- CI 가 **data-efficient** (작은 train size 에서 더 빠른 수렴).
- CI 가 **overfit-resistant** (epoch 늘려도 안정, mixing 은 overfit).

→ **본 논문의 "vanilla Transformer + 두 trick" 의 진짜 message: Channel-Independence 가 paradigm 의 핵심**.

---

## 5.2 Channel-Independence 가 뭐예요? — 일상 비유

### 비유 1 — 의사의 진단

의사가 환자의 *심박수, 혈압, 체온* 분석:
- **Channel-mixing (전통)**: 세 변수 *동시 결합* — *심박 + 혈압 + 체온 = X* 식 모델.
- **Channel-Independence (PatchTST)**: 세 변수 *각각 따로* 분석 — 심박만, 혈압만, 체온만. *각각 동일 모델 weight*.

본 논문 trick: *각 channel 따로* 처리 + 같은 모델.

### 비유 2 — 학생 시험 점수

100 명 학생 각각 *시험 점수* 예측:
- **Channel-mixing**: 100 명 *한꺼번에* 모델에 넣음 — *학생 간 상호 영향* 모델링.
- **Channel-Independence**: 각 학생 *따로* 모델에 넣음 + *모두 같은 모델*.

본 논문: *각 학생 독립* 처리.

### 비유 3 — 326 가구 전력

본 논문 Electricity dataset:
- **326 가구의 시간당 전력 사용량**.
- 326 channel = 326 univariate 시계열.

**Channel-mixing**: 326 channel 을 *한 시점에 vector* 로 묶어 *multivariate* Transformer.

**Channel-Independence**: *각 가구를 따로* Transformer 통과 + 모두 *같은 Transformer weight*.

---

## 5.3 왜 Channel-Independence 가 효과적?

### 이유 1 — Overfitting 방지

**Channel-mixing 의 문제**: M 개 channel 을 한꺼번에 처리 → *parameter 수 폭발*. 학습 데이터 부족 시 *overfitting*.

**Channel-Independence**: M 개 channel 이 *같은 weight* 공유 → *parameter 수 동일*. M 만큼 *학습 데이터 증가 효과*.

**일상 비유**: 한 학생에 *100 model* 만들면 overfitting. 100 학생을 *1 model* 로 처리 + 같은 weight → *100 배 sample size* 효과.

### 이유 2 — Spurious Correlation 회피

**Channel-mixing 의 문제**: M 개 channel 사이 *허위 상관 (spurious correlation)* 학습 — *훈련 데이터의 우연한 패턴* fit, *test 에선 깨짐*.

**예**: 326 가구 의 *2020 데이터* 에서 *가구 A 와 가구 Z 가 같이 증가* 한 *우연한 패턴*. Channel-mixing 이 *이걸 학습* → *2021 에선 false signal*.

**Channel-Independence**: 각 channel 독립 → spurious correlation *원천 차단*.

### 이유 3 — Sample Efficiency

**Channel-mixing**: 한 sample = 한 시점의 *M 차원 vector*. 학습 데이터 수 = $T$.

**Channel-Independence**: 한 sample = 한 channel 의 *한 시점*. 학습 데이터 수 = $T \times M$.

**일상 비유**: *Bag of 강아지 사진* 100 장 (한 사진에 *10 강아지*) vs *Bag of 강아지 사진* 1000 장 (한 사진에 *1 강아지*). 후자가 *더 많은 학습 sample*.

본 논문 Electricity: M = 321. *Channel-Independence 로 321 배 효과적 sample size*.

---

## 5.4 정확한 정의

### 모델 구조

**입력**: $x \in \mathbb{R}^{M \times L}$ — $M$ channel, $L$ timestep.

**Channel-mixing**: $x$ 를 한 번에 forward pass.

**Channel-Independence**:
1. $x$ 를 $M$ 개 univariate 시계열로 *분리*: $x^{(1)}, x^{(2)}, \ldots, x^{(M)}$.
2. 각 $x^{(i)} \in \mathbb{R}^{L}$ 를 *patching + Transformer* 통과 → 예측 $\hat y^{(i)}$.
3. 모두 *같은 Transformer weight 공유*.
4. 최종 예측: $\hat y = (\hat y^{(1)}, \ldots, \hat y^{(M)}) \in \mathbb{R}^{M \times T}$.

### 핵심 — *Same weight*

모든 channel 이 *완전히 같은 모델*. 즉 *"가구 A 의 Transformer"* 와 *"가구 Z 의 Transformer"* 가 *같은 weight*.

**일상 비유**: 모든 학생을 *같은 선생님* 이 가르침. 즉 *학생 변화 무관 동일 가르침*.

```viz:pat-channel-indep:title=Channel-indep vs Channel-mixing (interactive),caption=M 변수 처리 방식 토글. Channel-mixing (전통): 모든 변수 한꺼번에. Channel-indep (PatchTST): 각 변수 독립 + 같은 weight. Sample 수 비교 정량.
```

---

## 5.5 Channel-Independence 의 *trade-off*

### 장점

1. **Overfitting 방지** (위 이유 1).
2. **Spurious correlation 회피** (위 이유 2).
3. **Sample efficiency** (위 이유 3).
4. **병렬화 쉬움** — 각 channel 독립이므로.
5. **새 channel 추가 쉬움** — 기존 weight 그대로 사용.

### 단점 (본 논문 인정)

**Cross-channel dependency 못 활용**:
- 예: 326 가구 중 *가구 A 와 가구 Z 가 같은 동네* — 시간 패턴 *비슷*. Channel-mixing 이 *이 정보 활용 가능*.
- Channel-Independence: *이 정보 무시*.

본 논문 conclusion 이 이걸 limitation 으로 인정. 후속 연구 (iTransformer 2024) 가 *channel-mixing 의 advantage 회복* 시도.

---

## 5.6 *Universal* — Channel-Independence 가 다른 모델에도 적용?

본 논문 *Table 15* (Appendix): Informer, Autoformer, FEDformer 같은 다른 모델에도 *Channel-Independence* 적용 시:
- **모든 모델 성능 향상** — universal trick.

즉 *Channel-Independence 가 모델 specific X*. *모든 Transformer 시계열 모델* 의 *universal improvement*.

```viz:pat-table15-ci-universal:title=Table 15 — Channel-indep universal (interactive),caption=Informer/Autoformer/FEDformer 에 Channel-indep 적용 시 모두 성능 향상. Universal trick.
```

---

## 5.7 자기점검

### 핵심 5가지

1. **Channel-Independence 의 일상 비유?**
2. **Channel-mixing 대비 3가지 이점?**
3. **Channel-Independence 의 limitation?**
4. **Ablation 에서 CI 의 25-28% MSE reduction 기여 — Patching (3%) 보다 큰 이유?**
5. **iTransformer (2024) 가 CI 의 inverse 로 channel-mixing 부활 — 왜 둘 다 valid 한가?**

### 답변

1. **의사가 환자의 *심박, 혈압, 체온* 을 *각각 따로* 분석 + *모두 같은 진단 방식***. M 개 channel (326 전력 가구) 이 있어도 *각 가구를 독립* Transformer 통과 + *모두 같은 weight* (shared parameters). Cross-channel mixing X. **vs 표준 (Channel-Mixing)**: 326 가구를 한 번에 한 Transformer 가 처리, 모든 가구의 시간 패턴 동시 학습. CI 는 이걸 거절.

2. **(1) Overfitting 방지**: M channel 이 *같은 weight* → parameter 수 일정 → 학습 안정. M=862 (Traffic) 도 같은 모델 크기. **(2) Spurious correlation 회피**: 각 channel 독립 → 허위 cross-channel correlation 학습 X. Traffic 의 두 거리가 우연히 비슷한 패턴이라도 모델이 그 spurious 관계 학습 X. **(3) Sample efficiency**: 학습 데이터 *M 배 효과* — 한 batch 에 1 sample (multivariate) 가 아니라 M samples (각 channel 독립). M=326 면 sample 수 326배.

3. **Cross-channel dependency 못 활용**. 예: 326 가구 중 *같은 동네 가구들* 의 *시간 패턴 유사성* 이 있다면, Channel-mixing 은 *그 정보 활용 가능* but Channel-Independence 는 *무시*. 본 논문 conclusion 의 limitation. **후속 iTransformer (2024)** 가 *cross-channel advantage* 회복 — 시계열의 inverted view (channel 차원에 attention). **실무 영향**: 만약 dataset 의 cross-channel 정보가 강하면 (예: stock prediction, ECG multi-lead) iTransformer 가 PatchTST 능가 가능.

4. **Ablation (Table 7) 의 정확 수치**: Patching only ~3%, CI only ~25-28%, Both ~30-36%. **CI 가 80% 차지하는 이유**: (i) **Sample efficiency** — M=326 가구가 326 sample 로 카운트됨 → 데이터 ↑ → overfit ↓ → MSE ↓. (ii) **Inductive bias** — 시계열의 temporal pattern 이 channel 무관 → CI 가 이걸 강제 → 일반화 ↑. (iii) **Regularization 효과** — Shared weight 가 implicit regularization 처럼 작동. **Patching 의 진짜 역할**: Computational enabler (longer L 가능하게 함) — direct MSE 기여는 작지만 enabling effect 큼.

5. **CI vs Channel-Mixing 의 dataset 의존성**: **CI 가 좋은 case**: (i) Cross-channel correlation 약함 (Traffic 의 다른 도로), (ii) Channel 간 패턴 다양 (다른 종류 측정), (iii) Sample 부족. **Mixing 이 좋은 case**: (i) Cross-channel 강함 (stock prediction 의 sector 동조), (ii) Channel 간 패턴 유사 (multi-sensor 같은 quantity), (iii) Channel 수 많음 (충분한 학습 데이터). **iTransformer 의 발견**: Channel attention 이 시간 attention 보다 더 효과적인 dataset 도 존재. **결론**: 둘 다 valid, **dataset 별 선택** 이 핵심. CI = "channel = noise", Mixing = "channel = signal".

---

다음 챕터: [06_transformer_encoder.md](06_transformer_encoder.md) — Transformer Encoder (Vanilla 그대로).
