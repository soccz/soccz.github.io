# 05. Channel-Independence — 변수 독립 처리

> 본 논문의 *두 번째 trick*. M 개 변수 (예: 326 전력 가구) 가 있어도 *각 변수 따로* Transformer 통과 + *모두 같은 weight*.

---

## 5.1 챕터 한 줄 요약

> **"326 가구 의 전력 데이터를 한 모델에 넣을 때 *각 가구를 따로* 처리 + *모두 같은 Transformer weight*. *Cross-channel mixing 없음*. 효과: overfitting 방지 + spurious correlation 회피 + sample 효율 ↑."**

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

### 핵심 3가지
1. **Channel-Independence 의 일상 비유?**
2. **Channel-mixing 대비 3가지 이점?**
3. **Channel-Independence 의 limitation?**

### 답변
1. **의사가 환자의 *심박, 혈압, 체온* 을 *각각 따로* 분석 + *모두 같은 진단 방식***. M 개 channel (326 전력 가구) 이 있어도 *각 가구를 독립* Transformer 통과 + *모두 같은 weight*. Cross-channel mixing X.
2. **(1) Overfitting 방지**: M channel 이 *같은 weight* → parameter 수 일정 → 학습 안정. **(2) Spurious correlation 회피**: 각 channel 독립 → 허위 cross-channel correlation 학습 X. **(3) Sample efficiency**: 학습 데이터 *M 배 효과* (한 channel = 한 sample 이 아니라 한 timestep = 한 sample, 그러면 $T \times M$ samples).
3. **Cross-channel dependency 못 활용**. 예: 326 가구 중 *같은 동네 가구들* 의 *시간 패턴 유사성* 이 있다면, Channel-mixing 은 *그 정보 활용 가능* but Channel-Independence 는 *무시*. 본 논문 conclusion 의 limitation. 후속 iTransformer (2024) 가 *cross-channel advantage* 회복.

---

다음 챕터: [06_transformer_encoder.md](06_transformer_encoder.md) — Transformer Encoder (Vanilla 그대로).
