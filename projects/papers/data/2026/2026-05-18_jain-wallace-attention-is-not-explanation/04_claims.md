# 04 핵심 Claim 해체

> **🧒 paper 의 4 개 주장 한 줄 요약**: (C1) "attention 이 가리키는 단어 ≠ 진짜 중요한 단어" (상관 약함). (C2) "어텐션 위치 무작위로 섞어도 같은 답" (permutation OK). (C3) "어텐션 *일부러* 바꿔도 같은 답 가능" (adversarial 성공). (C4) "encoder 가 정보 *섞을수록* 1-3 더 심함" (BiLSTM 가장 나쁨, Average 괜찮음). 본 챕터는 각 claim 의 *증거* + *숨은 가정* + *쉬운 말 풀이*.

> **배경 사다리**: 이 절은 ① "**feature importance**" 가 입력 token 하나하나가 예측에 미치는 영향의 측정량 (gradient $|\partial \hat{y}/\partial x_i|$ 또는 leave-one-out $\Delta\hat{y}|_{x_i \to 0}$) 이라는 것, ② "**Kendall τ**" 가 두 순위 매김 사이의 순서 일관성 척도 (-1 ~ +1) 라는 것, ③ "**JS divergence**" 가 두 확률 분포 사이의 대칭 거리 ($0$ = 동일, $\log 2$ = 완전 분리) 라는 것 — 이 3 개를 알면 본 절 의 모든 claim 이 이해된다.

## Claim 1 — 어텐션과 feature importance 의 *일관성* 은 약하다 (H1 실패)

**주장 (한 문장)**: 학습된 attention 분포 $\boldsymbol{\alpha}$ 와 gradient·LOO 기반 feature importance 사이의 순위 상관 (Kendall τ) 은 대부분의 데이터셋·BiLSTM 조합에서 *낮음* — 즉 attention 이 큰 위치와 모델 출력에 *실제로* 큰 영향을 주는 위치가 잘 일치하지 않는다.

**증거**: paper **§4.1 (Correlation Between Attention and Feature Importance Measures)** — Table 2 (mean ± std + Sig. Frac.) + Figure 2 (Kendall τ histogram). 21 row (12 datasets × class) 의 instance-wise Kendall τ. BiLSTM 의 mean τ_g 평균 ~ 0.32 (Anemia 0.43 — Diabetes 0.43 의 medical 이 *높은* 편), Average encoder 의 mean τ_g 평균 ~ 0.69 (+0.37p). → [16_appendix.md §16.2](16_appendix.md).

**숨은 전제** (저자가 당연시한 것):
- gradient $|\partial \hat{y}/\partial x_i|$ 와 LOO 가 "*ground truth* feature importance" 의 신뢰할 만한 대리. (이 자체가 saliency literature 에서 논쟁적 — Adebayo 2018 sanity check 등). 만약 gradient 자체가 noisy 면 *낮은* τ 는 attention 결함이 아니라 *gradient 결함* 일 수도.
- Kendall τ 가 "일치" 의 적절한 지표. 분포가 매우 sparse 한 경우 (예: 한두 위치에만 attention 집중) 순위가 ill-defined 가 됨에 대한 보정 미명시.

**쉬운 말 풀이**: "이 단어가 중요해 보이는 정도" 를 어텐션으로 잰 순위와, "그 단어를 지웠을 때 답이 진짜 바뀌는 정도" 로 잰 순위가 별로 안 맞는다는 결과. 같은 학생의 시험점수에 대해, 본인이 "이 문항을 잘 풀었다" 라고 가리킨 문항과, 채점 결과 실제로 점수에 크게 기여한 문항이 다르다는 상황.

## Claim 2 — 어텐션과 예측 사이의 *유일성* 은 깨진다 (H2 실패 ─ Permutation 버전)

**주장**: 학습 후 attention 분포 $\boldsymbol{\alpha}$ 를 *임의 순열* $\boldsymbol{\alpha}^\pi$ 로 무작위 섞어 추론에 사용해도, 많은 instance 에서 예측 $\hat{y}^\pi$ 가 원래 $\hat{y}$ 와 거의 같다 (output JS divergence 작음).

**증거**: paper **§4.2.1 (Attention Permutation)** — Algorithm 2 (100 permutations per instance, median TVD recorded). Figure 6 (max α vs median ∆ŷ scatter). 대부분 dataset 에서 median ∆ŷ < 0.05 — large max α 인 instance 도 minimal change. Diabetes 만 예외 (medical high-precision token).

**숨은 전제**:
- *Inference-time* 만 permutation. 모델은 학습 때 본 attention 으로 훈련됐고, 추론 시 다른 분포를 강제. 이 setting 이 *학습 일관성* 을 깨므로 "그래도 예측이 같다" 가 더 충격적인 결과로 해석됨. 그러나 *모델이 permutation 에 강건하도록 학습되지 않았는데도 강건* 한 것이 어텐션 본질의 비-필요성을 의미하는지, 또는 BiLSTM encoder 의 contextualization 이 입력 위치 정보를 이미 흡수해버려 attention 이 무관해진 것인지 — 두 해석이 가능.
- Permutation 이 "다른 분포" 의 적절한 표본. Convex region 의 *모든* 대안 분포를 cover 하지 않음.

**쉬운 말 풀이**: 학생에게 답지를 다 가린 채 "어느 문항을 본 거지?" 라고 물어보고 답을 다시 받았더니, 손가락 위치를 무작위로 바꿔도 답이 같았다. → 손가락 위치가 답의 *원인* 이라고 하기 어려워진다.

## Claim 3 — *Adversarial* 한 attention 분포가 거의 모든 instance 에서 *존재* 한다 (H2 실패 ─ Adversarial 버전)

**주장**: Gradient 기반 최적화로 *예측을 거의 보존* 하면서 ($\text{TVD}(\hat{y}, \hat{y}_{\text{adv}}) < \epsilon$) 동시에 *attention 분포 distance 를 최대화* 하는 적대적 분포 $\boldsymbol{\alpha}_{\text{adv}}$ 가 대부분의 instance 에서 구성 가능. 이는 단순 random permutation 보다 강한 검증 — *최악의* 대안 분포를 *명시적으로* 찾아낸다.

**증거**: paper **§4.2.2 (Adversarial Attention)**. Figure 7 — 2D plot (x: Max JSD, y: Max attention; with eps=0.10 for binary, 0.05 for QA). paper 인용 (§4.2.2):
> "For all the corpora except for Diabetes, we are able to find adversarial attention distributions that achieve a JSD divergence larger than 0.4 yielding a TVD of at most 0.1 from the original prediction with relatively high frequency."

→ 95%+ instance 에서 adversarial 가능. Diabetes 만 예외 (medical high-precision token).

**숨은 전제**:
- 적대적 최적화의 *수렴 보장* — gradient descent 가 local minima 에 갇히지 않고 진짜 distance maximizer 를 찾는다는 보장 없음. 따라서 "*최대* 가능한 차이" 이지 *상한* 은 아님.
- 출력 보존 기준 $\epsilon$ 의 선택. $\epsilon$ 이 너무 크면 너무 쉽게 통과, 너무 작으면 통과 사례 없음. 이 hyperparameter 가 결과 인상을 좌우.
- 분포의 *기하학* 무시: simplex $\Delta^{T-1}$ 위에서 adversarial 분포가 *학습 분포의 manifold 안* 인지 *밖* 인지 구분 안 함. Wiegreffe-Pinter 의 핵심 반론.

**쉬운 말 풀이**: "손가락 위치만 진짜로 *완전히 다르게* 짚되 점수는 같이 나오는 시나리오를 *일부러* 찾아봤더니, 거의 모든 학생 사례에서 그런 시나리오를 만들 수 있었다." → "원래 손가락 위치가 점수의 *유일한 설명* 이라는 주장" 은 깨진다.

## Claim 4 — Encoder 의 contextualization 강도가 위 결과를 *조절* 한다

**주장**: H1·H2 의 실패 정도는 encoder 의 *입력 mixing 강도* 와 양의 상관. 즉,
$$
\text{Avg (mixing 없음)} \;\prec\; \text{CNN (국소 mixing)} \;\prec\; \text{BiLSTM (전역 mixing)}
$$
순으로 attention 이 *덜 explanatory* 해진다.

**증거**: 동일 데이터셋에 대해 인코더 만 바꾼 ablation. Average encoder 는 token 임베딩의 단순 평균이라 hidden state $h_i$ 가 곧 $x_i$ 의 일대일 대응 → attention 이 *진짜로* 입력 위치에 매핑됨 → Kendall τ 큼. BiLSTM 은 $h_i$ 가 *문맥 전체* 의 요약 → attention 이 $h_i$ 에 주는 가중치는 *위치 $i$ 의 입력* 이 아닌 *위치 $i$ 까지의 context summary* 에 주는 가중치. 후자는 입력-수준 importance 와 *원리적으로* 일치할 필요가 없다.

**숨은 전제**:
- 이 메커니즘 가설은 *해석* 이지 *증명* 이 아님. 본 논문은 패턴을 관측만 했고 그 원인을 *추측* 으로 제시. 검증되려면 layer-wise mixing 측정 (Brunner 2019 의 effective attention) 또는 ROME-식 causal probing 이 필요.
- *Average encoder* 도 "성능이 좋다" 는 전제. 만약 성능이 낮으면 *좋은 성능 + attention explanatory* 의 결합이 불가능하다는 더 강한 결론이 따라옴 (no free lunch).

**쉬운 말 풀이**: "단어를 그대로 보는 모델" → 어텐션이 의미 있다. "단어들을 잘 섞어 보는 모델" → 어텐션이 가리키는 위치는 *그 위치의 단어* 가 아니라 *그 위치까지 흘러온 정보* 다. 후자가 더 정확한 모델 (BiLSTM) 이지만 attention 의 해석력은 약하다 — *성능 ↔ 해석성* 트레이드오프의 한 형태.

## 종합 — Claim 들의 논리 구조

(C1 = attention 이 *다른 importance 측정* 과 *불일치*) **OR** (C2/C3 = 동일 출력의 *다른* attention 이 *존재*) → "**attention 은 *유일하고 신뢰할 만한 설명* 이 아니다**". 두 조건은 *합집합* — 둘 중 하나만 깨져도 "explanation" 주장이 무너진다. C4 는 *왜* 그런가에 대한 *부분적 메커니즘* 가설로 보조.

따라서 본 논문의 결론은 *부정 명제* — "attention 은 *반드시* 설명이다 라는 주장은 정당화되지 않는다" — 이며, *어떤 의미에서도 설명이 아니다* 라는 강한 주장은 아니다. 이 미묘한 차이가 후속 Wiegreffe-Pinter 와의 논쟁의 핵심.

---

## 인터랙티브 — Claim 1 (Correlation) 시각화

```viz:anie-datasets-summary:title=12 Datasets Summary — Claim 별 Heatmap,caption=Metric 셀렉터로 τ_g (BiLSTM) / τ_loo (BiLSTM) / τ_g (Average) / ∆ŷ (permute) / Adv JSD 전환. 12 dataset 전체에서 τ_g (BiLSTM) 가 일관 낮음 (대부분 < 0.5) — Claim 1 의 grid 증거. Average encoder 로 전환 시 일관 high (> 0.6) → Claim 4 (encoder mixing 의 효과) 의 증거.
```
