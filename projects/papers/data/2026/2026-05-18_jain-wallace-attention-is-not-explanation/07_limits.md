# 07 가정·한계·반박

## 명시된 가정 (논문이 대놓고 말한 것)

1. **단일 attention layer**: 본 논문은 BiLSTM/CNN/avg encoder 위 *하나의* attention layer 만 분석. Multi-layer/multi-head Transformer attention 으로의 일반화는 *명시적으로* 본 논문 범위 밖. (이는 약점이 아닌 *scope* 의 honest 표시.)
2. **Faithfulness 의 정의**: "Explanation" 을 *faithful explanation* — 모델 결정의 *실제 원인을 반영* 하는 설명 — 으로 한정. *Plausibility* (사람이 보기에 그럴듯한) 는 별 issue 로 분리.
3. **Gradient·LOO 가 reference importance**: 두 측정이 *적어도 attention 보다는 신뢰할 만한* importance 의 대리. 두 측정이 자체적으로 noisy 할 수 있다는 점은 논문이 부분적으로 인정 (그래서 두 측정의 *합의* 가 더 강한 증거).

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

1. **Attention 분포의 simplex 구조가 충분**: $\boldsymbol{\alpha}^* \in \Delta^{T-1}$ 만 보면 충분하다는 가정. 그러나 모델은 학습 시 *특정 영역의 simplex* 에서만 본 적이 있다. Adversarial 이 *학습 분포 밖* (out-of-distribution) 의 simplex 점을 찾고 있을 가능성 — 즉 *모델이 robust 하지 않은 영역* 에서 사실상 *임의의 출력* 을 만들 수 있을 뿐, 진짜 *대안 설명* 이 아닐 수 있음. (이는 Wiegreffe-Pinter 의 핵심 반론.)
2. **Encoder hidden state $h_i$ 의 *고정성***: Adversarial 최적화에서 $h_i$ 는 *고정* 으로 둔다. 그러나 attention 이 변하면 *gradient 가 다시 흘러* encoder 의 학습 시 어떤 $h_i$ 가 형성되었을지가 *역으로 영향* 받음. 즉 *전체 시스템의 dynamics* 에서 attention 만 분리하는 것 자체가 *비-자연스러운 ablation*.
3. **단어 단위 importance 의 의미성**: 본 논문은 *token* 단위 importance 만 다룸. 그러나 모델은 *phrase* 단위 또는 *문장 구조* 단위로 단서를 사용할 수 있다. Token-level attention 의 *순위* 가 어긋나도 *phrase 수준* 에서 일관될 수 있음. 이 가능성을 본 논문이 *체계적으로 배제하지 않음*.
4. **Test set 의 통계적 typicality**: Kendall τ 의 *median* 이 작다는 진술은 *대다수 instance* 에 대한 것. *소수 instance* (특히 *모델이 매우 확신하는* easy case) 에서는 τ 가 클 수 있음. 이 *비등질성* 이 분포 평균 뒤에 숨어 있음.

## 반박 가능한 지점 — 4 개

### 반박 1 — "Adversarial 분포는 학습 manifold 밖이다" (Wiegreffe-Pinter 2019 의 핵심)

**핵심 주장**: 본 논문의 adversarial attention 은 *gradient 로 찾아낸 점* 이지만, 그 점이 *실제 학습 데이터에서 나올 수 있는* 분포인지는 검증되지 않았다. 만약 *학습 manifold 밖* 의 분포라면, 모델이 그 영역에서 *무관한* 출력을 내는 것은 *over-parameterization* 의 자연 결과일 뿐 *attention 의 비-설명성* 의 증거가 아님.

**검증 실험**: Adversarial $\boldsymbol{\alpha}_{\text{adv}}$ 를 *처음부터* 학습된 모델을 만들 수 있는가? 즉 attention 을 $\boldsymbol{\alpha}_{\text{adv}}$ 로 *고정* 한 채 다른 파라미터를 재학습. 만약 그렇게 학습된 모델이 *동일 성능* 을 보인다면, $\boldsymbol{\alpha}_{\text{adv}}$ 가 자연스럽게 학습 가능한 분포라는 증거. 반대로 학습이 *실패* 하면 adversarial 분포는 *unnatural*.
→ Wiegreffe-Pinter 2019 가 실제로 이 실험을 수행하고 *일부* 데이터에서 학습 실패 — 즉 attention 분포가 *어떤 의미에서는* 모델의 *진짜* 정보를 담는다고 반박. (이 자체가 본 논문의 결론을 완전히 무력화하지는 않지만, *모든 attention 분포가 동등* 이라는 강한 주장은 무너짐.)

### 반박 2 — "Encoder mixing 이 약한 case 에서도 attention 이 explanation 이라는 *증거* 가 아님"

**핵심 주장**: 본 논문은 BiLSTM 에서 attention 이 *덜* explanatory 임을 보이지만, average encoder 에서 τ 가 *높다* 는 사실이 attention 을 *explanation 으로 사용해도 된다* 는 증거는 아님. 단순히 "*average encoder 의 attention 은 입력 단어 importance 와 비례하는 경향이 있다*" 일 뿐. 이는 *trivial* (encoder 가 mixing 안 하면 $h_i = e_i$ 이므로 attention 이 $e_i$ 의 가중치이고, gradient 도 $e_i$ 의 importance — *동어반복*).
→ 즉 attention 이 *해석 도구로서의 추가 정보 가치* 를 가지려면 *BiLSTM 같은 mixing encoder* 에서도 통과해야 한다는 본 논문의 주장은 옳지만, *어떤 encoder 에서든 attention 이 본질적으로 해석적* 이라는 주장이 본 논문에서 *부정* 되는 것도 아님.

**검증 실험**: Average encoder + attention 모델과 *attention 없는 average* 모델의 분류 성능 비교. 두 성능이 *동일* 하면 attention 이 *redundant* (해석성 분리 없이도). 두 성능이 *다르면* attention 이 *학습 가능한 가중치 추가* 라는 의미는 있음.

### 반박 3 — "Multi-head Transformer 에는 일반화되지 않는다"

**핵심 주장**: 2019 년 BERT/Transformer 시대에 본 논문이 *단일 attention layer* 만 분석한 것은 *제한적*. Multi-head 의 *head 간 redundancy* 는 본 논문 framework 로 측정 불가. 한 head 가 무력화돼도 다른 head 가 동일 출력을 만들면 *head-level attention* 이 *system-level explanation* 이 안 되는 것은 *당연*. 그러나 *system-level attention summary* (예: head 간 max, avg, rollout) 가 explanation 일 가능성은 *별개*.

**검증 실험**: Abnar-Zuidema 2020 의 *attention rollout* 또는 *attention flow* 를 본 논문의 H1·H2 protocol 로 시험. 만약 rollout 이 *gradient/LOO 와 더 잘 일치* 한다면, *layer 별 attention* 이 아닌 *flow-aggregated attention* 이 explanation 후보로 부활.

### 반박 4 — "Faithfulness 가 explanation 의 *유일* 기준이 아니다"

**핵심 주장**: 본 논문은 *faithfulness* (인과적 일치) 만 검증. 그러나 사용자 관점에서 *plausibility* (그럴듯함) + *understandability* (이해 용이) + *actionability* (조치 가능성) 가 동시 중요. Attention 이 *faithful 하지는 않지만* *plausible* 하면 *디버깅 단서* 로 가치 있음. 본 논문의 결론은 *attention 의 가치 전체 부정* 으로 *오해 확산* 가능 — 실제로 후속 7년간 그런 오해가 만연했음.

**검증 실험**: 사용자 연구 (user study). Attention heatmap 을 본 사람 vs 안 본 사람의 *모델 디버깅 효율* 비교. 만약 attention 본 사람이 *틀린 예측을 더 잘 찾아낸다* 면 attention 이 *액션성* 측면에서 가치 있음.

## 재현성 평가

| 항목 | 상태 |
|------|------|
| 코드 공개 | ✓ (`successar/AttentionExplanation`, GPL-3.0) |
| 데이터 공개 | ✓ (모든 데이터셋 공개 또는 라이센스 하 접근 가능. Anemia/Diabetes 는 MIMIC 류 — 별 신청 필요) |
| 하이퍼파라미터 보고 | paper §4 본문 + repo config 파일 ([16_appendix.md §16.6](16_appendix.md)) |
| 다중 seed 보고 | paper Table 2 는 single seed 의 mean ± std (over instances). Seed-level analysis 는 Wiegreffe-Pinter 2019 의 추가 검증으로 보강. |
| Adversarial $\epsilon$ 의 sensitivity | paper §4.2.2 — ε=0.10 (binary), ε=0.05 (QA) 만 보고. 다른 ε 값에서의 robustness 는 paper 본문 미보고. |
| PyTorch 의존성 | master branch + torchtext 0.4.0 source build — *재현 어려움*. 2026 년 현재로서는 *historical reconstruction* 필요. |

**재현성 종합**: 코드·데이터는 공개됐으나 *2019 년 시점의 PyTorch nightly* 의존으로 *literal 재현* 은 비-trivial. *Protocol 재구현* 은 쉬움 (H1·H2 절차 자체는 model-agnostic). 따라서 *결론 검증* 은 *protocol 재구현* 으로 가능, *수치 일치* 는 어려움.

## 핵심 한 문장

> 본 논문의 결과는 *attention is NOT the unique explanation* 의 *증거* 이지 *attention has NO explanatory value* 의 *증거* 가 아니라는 미묘한 차이가 핵심이며, 이 차이를 둘러싼 후속 논쟁이 본 분야의 진보를 만든다.

---

## 인터랙티브 — Diabetes 의 예외 (한계의 정량 증거)

```viz:anie-tvd-jsd-2d:title=Diabetes — Adversarial 어려움 (paper 자체 인정 limit),caption=Dataset 셀렉터로 Diabetes 선택. 다른 dataset 과 달리 점들이 diagonal 따라 분포 → high JSD requires high TVD. 즉 *Diabetes 에서 attention 이 부분적 explanation*. paper 의 한계 인정 — "attention 의 explanation 능력은 task-specific, high-precision token 의 존재가 결정 요인".
```
