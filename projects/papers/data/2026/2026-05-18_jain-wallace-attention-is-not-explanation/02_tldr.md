# 02 3층 TL;DR

## 🧒 초등학생 수준 (수식 금지)

선생님이 작문 채점할 때 "어느 줄에 가장 큰 점수를 주었나요?" 라고 물어보면, 선생님이 손가락으로 짚으면서 "여기, 여기" 답한다고 하자. 그러면 우리는 그 줄들이 *정말 중요해서* 점수가 그렇게 나왔다고 믿고 싶다.

이 논문은 두 가지 시험을 한다.
1. **선생님이 짚은 줄을 다른 방법으로 재 보면 진짜 그 줄이 점수에 큰 기여를 했나?** — 답은 *대체로 아니다*. 선생님이 짚은 곳과, 그 줄을 지웠을 때 점수가 진짜 변하는 곳이 별로 안 겹친다.
2. **선생님에게 일부러 *완전히 다른* 줄을 짚게 해도 똑같은 점수를 줄 수 있나?** — 답은 *놀랍게도 그렇다*. 짚는 손가락 위치를 바꿔도 같은 점수가 나오는 경우가 많다.

그래서 결론: *선생님이 어디를 짚었는지로 점수의 이유를 설명하는 건 위험하다*. 어텐션이라는 게 이 "선생님 손가락" 인데, 7년 동안 모두가 "손가락 = 설명" 처럼 써왔던 관행에 처음으로 제동을 건 논문이다.

(여기서 "선생님" = 신경망, "줄을 짚는 손가락" = attention weight, "점수" = 모델 예측, "줄을 지운다" = gradient/LOO 같은 feature importance 측정.)

## 🎓 학부생 수준

**문제**: NLP 에서 BiLSTM + attention 으로 만든 분류기 — 의료(Anemia/Diabetes 차트 분류), 감성(SST, IMDB), 뉴스(20News, AgNews, ADR tweet), QA/추론(SNLI, CNN, bAbI) — 의 attention weight $\alpha_i$ 가 모델 예측을 설명한다고 주장하는 관행이 만연해 있다. 즉 $\alpha_i$ 가 크면 단어 $x_i$ 가 예측의 *원인* 이라고 해석. 그러나 이 등식이 진짜인지는 체계적으로 검증된 적이 없다.

**아이디어**: "설명" 이라는 단어가 의미하려면 (가설 1) attention 분포가 다른 feature importance 측정(예: gradient 크기 $|\partial \hat{y}/\partial h_i|$, leave-one-out $\Delta \hat{y}|_{x_i \to 0}$)과 잘 *일치* 해야 하고, (가설 2) 예측을 보존하면서 동시에 attention 분포를 크게 바꿀 수 있으면 안 된다(*counterfactual exclusivity*). 만약 둘 중 하나라도 깨지면 "attention = 설명" 은 보장되지 않는다.

**방법**:
- H1 검증: 각 사례마다 attention 벡터 $\boldsymbol{\alpha}$ 와 gradient/LOO 벡터를 만들고 Kendall $\tau$ (순위 상관) 로 비교.
- H2 검증 (a) Permutation: 학습된 $\boldsymbol{\alpha}$ 를 무작위 순열 $\boldsymbol{\alpha}^\pi$ 로 바꿔 *추론 시* 차이 $\Delta \hat{y}$ 분포를 본다. (b) Adversarial: 예측을 거의 유지하면서 ($|\hat{y}_{\text{adv}} - \hat{y}| < \epsilon$) JS divergence $\text{JSD}(\boldsymbol{\alpha}, \boldsymbol{\alpha}_{\text{adv}})$ 를 최대화하는 *적대적 attention 분포* 를 명시적으로 찾는 최적화.

**결과** (paper Table 2 정확 수치):
- (1) **Kendall τ (BiLSTM + τ_g)**: SST 0.40, IMDB 0.37, ADR 0.45, 20News 0.11, AG News 0.39, Diabetes 0.43, Anemia 0.43, CNN 0.20, bAbI 1/2/3 = 0.23/0.17/0.30, SNLI 0.39. — 모두 < 0.5, 평균 0.32.
- (2) **Average encoder 의 대비** (control): SST 0.69, Anemia 0.81, bAbI 2 0.84 — 일관 0.6+. → encoder 차이 +0.30p~0.67p.
- (3) **Permutation ∆ŷ 중앙값**: 대부분 dataset < 0.05 (예: SST 0.005, AG News 0.008). Diabetes 만 0.15 — 예외.
- (4) **Adversarial 존재**: paper §4.2.2 — "*all corpora except Diabetes* allow JSD > 0.4 with TVD ≤ 0.1". → 95%+ instance 에서 adversarial 가능.
→ "attention = explanation" 은 비-안전 가정.

(정확한 수치 표는 [16_appendix.md](16_appendix.md) §16.2 참조.)

## 🔬 전문가 수준

본 논문의 contribution 은 다음 4개로 정리할 수 있다.

**C1. 해석 가능성 가설을 두 개의 검증 가능한 명제로 환원.** 이전까지 "attention provides explanation" 은 막연한 주장이었지만, 본 논문은 이를 (i) attention 과 다른 feature attribution 의 *상관* (H1) 및 (ii) 동일 예측을 보존하는 *대안적 attention 분포의 부재* (H2) 의 결합으로 명시화. 이 분해는 이후 후속 (Wiegreffe-Pinter 2019, Bastings-Filippova 2020, Pruthi 2020) 의 비판·반비판 모두의 공통 좌표계가 된다.

**C2. Counterfactual 어텐션의 명시적 최적화 절차.** 단순 permutation 보다 강한 검증 — *예측을 유지* 하면서 *attention divergence 를 최대화* 하는 분포를 gradient 기반으로 직접 찾는 절차. 이는 일종의 *causal sufficiency 반증* — 어텐션이 인과적으로 충분조건이라면 이런 분포가 존재해서는 안 된다. (단 본 절차가 BiLSTM 내부의 contextualization 으로 인해 *encoder state* 가 이미 입력 정보를 흡수해버린 점을 *반박* 으로 활용 가능하다는 점이 Wiegreffe-Pinter 의 핵심 재반론).

**C3. 인코더 의존성 정량화.** Attention 의 "설명력" 은 인코더가 token-level 정보를 얼마나 *섞는가* (contextualization 강도) 에 직접 의존. Average encoder (섞지 않음) 와 CNN 은 attention 과 feature importance 가 강하게 일치 (Kendall τ 큼) 하지만 BiLSTM 처럼 강하게 mixing 하는 encoder 에서는 일치가 약하다는 차등 패턴 — 이는 attention 의 정보가 *해당 위치의 입력* 이 아닌 *해당 위치까지의 context summary* 를 가리키기 때문이라는 메커니즘 가설로 연결된다. (paper §6 Discussion: "the encoder induces representations that may encode arbitrary interactions between individual inputs; presenting heatmaps of attention weights placed over these inputs can then be misleading.")

**C4. 다중-도메인 + 다중-인코더 검증.** 12 개 데이터셋 × 3 인코더 (BiLSTM/CNN/avg) × 2 attention (tanh/dot) 의 격자를 일관된 파이프라인으로 돌려, 발견이 *특정 데이터셋 우연* 이 아닌 *구조적 현상* 임을 보임. 결과는 의료(Anemia/Diabetes)·감성·뉴스·QA 전반에 걸쳐 일관된 패턴.

**한계 (저자 시인 + 본 해체 시점 추가 비판)**:
- 단일-head, 단일-layer attention 만 다룸. Transformer 의 multi-head·multi-layer attention 으로 직접 일반화되지 않음 (이 점은 본 논문 ≠ Transformer interpretability 논문이라는 사실로 자주 오해됨).
- Adversarial 최적화가 "*존재 가능* 하다" 만 보일 뿐, 그 분포가 *학습 시 자연 발생* 하는가는 별개 문제 (Wiegreffe-Pinter 의 *plausibility* 반론의 기반).
- "Explanation" 의 정의를 *faithfulness* 의 강한 형태로 한정. Plausibility (사람이 보기에 그럴듯) 또는 사후 합리화 (post-hoc rationalization) 로서의 가치는 부정하지 않음.

---

## 인터랙티브 — 핵심 결과 한 눈에

```viz:anie-attention-heatmap:title=paper Figure 1 — Original vs Adversarial Attention,caption=Example 셀렉터로 paper 의 movie review / medical note / news 예시. 왼쪽 = original attention (직관적 — "waste" 강조), 오른쪽 = adversarial attention (무관 — "was" 강조). 두 prediction 이 *같다* — ★ paper 의 가장 압축된 visual evidence.
```

```viz:anie-correlation-hist:title=Kendall τ Histogram — BiLSTM vs Average Encoder,caption=Dataset 셀렉터 + Metric 토글 (τ_g, τ_loo). BiLSTM (red, contextualized) 분포는 τ ~ 0.3 centered. Average (blue, token-isolated) 분포는 τ ~ 0.7 centered. → encoder mixing 의 단일 변경 → attention 의 explanation 능력 일관 회복. paper Figure 2 의 핵심 패턴.
```
