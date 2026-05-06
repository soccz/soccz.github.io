# 9. 사고 확장 (a) — 자문 질문 5개

> 본 논문이 *닫지 않은* 부분, *사용자 연구의 hook* 이 될 수 있는 부분. 각 질문은 *왜 중요한가* 의 한 단락 동반.

---

## Q1. Progress measure 의 *fixed K* 가 학습 도중 변동하면 어떻게 되는가?

**왜 중요한가**: 본 논문은 $K$ 를 *학습 종료 후* fix. 그러나 실제 학습 trajectory 에서 모델이 $K_{\text{early}}$ → $K_{\text{mid}}$ → $K_{\text{final}}$ 처럼 frequency 를 *바꿀* 가능성이 있다. Doshi 2024 가 multi-task setting 에서 부분 보고. 만약 frequency hopping 이 일어난다면, Nanda 의 단조 곡선은 *artifact* — 진짜 dynamic 은 hopping 의 cumulative envelope.

이 question 은 **사용자 P2 logistic 실험에서 직접 검증 가능**: chaotic regime 의 transformer 학습이 *bifurcation 직전 frequency* 를 사용하다가 chaos 직전에 *broadband* 로 옮겨가는지. 만약 그렇다면 사용자 contribution 의 *cleanest novelty*.

---

## Q2. Cleanup phase 의 *시간 상수* 가 weight decay × LR × init norm 의 어떤 함수인가?

**왜 중요한가**: 본 논문은 cleanup 이 일어남을 보였지만 *얼마나 빨리* 일어나는지의 closed-form 식은 없다. Optimization theory 의 표준 결과 (AdamW 의 weight decay 는 가중치 norm 을 $\|w\| e^{-\lambda t}$ 로 감소시킴) 를 적용하면, cleanup time scale 이 $1/\lambda$ 에 비례할 것. 그러나 *실제 trajectory* 에서는 회로 가중치의 *효율성* (즉 같은 train loss 를 더 작은 norm 으로 달성) 이 cleanup 을 더 느리게 만들 수도, 더 빠르게 만들 수도 있음.

이 질문이 풀리면 — *grokking 시간 예측* 이 가능. 지도교수와 의논 시 *예측 가능성* 은 publication 의 강한 selling point.

---

## Q3. *비algebraic task* (TS forecasting, language modeling) 에서 grokking 의 회로는 어떻게 생겼는가?

**왜 중요한가**: 본 논문 결론의 *generalizability* 가 이 question 에 달림. TS forecasting 이 character theory 가 깨끗히 적용되지 않는 도메인 — 만약 TS Transformer 가 grokking 을 보인다면, 그 회로는 Fourier-sparse 가 아닐 가능성.

가설: TS Transformer 는 *seasonal frequency* + *trend* + *autoregressive* 의 *부분 character* 를 사용 → *partially-Fourier-sparse* 회로. 즉 일부 frequency (계절성) 은 Fourier-sparse, 일부 dimension (trend) 은 polynomial-sparse.

사용자의 Grokking track *정확히 이 question 의 답을 찾는다*. 이게 NeurIPS 2027 target 의 thesis statement.

---

## Q4. *Architecture 의 inductive bias* 가 회로 형태를 결정하는가, 아니면 *task 의 algebraic 구조* 가 결정하는가?

**왜 중요한가**: 본 논문은 transformer 위에서 modular addition 을 *Fourier* 로 풀게 한다. 만약 같은 task 를 *MLP-only* (no attention) 또는 *RNN* 으로 풀면 같은 회로가 나오는가?

- 가설 A (architecture-dominant): transformer 의 bilinear attention 이 character theory 정렬을 *induce*. RNN 은 다른 회로.
- 가설 B (task-dominant): cyclic group 구조가 어떤 architecture 에서도 *Fourier representation* 을 강제.

답을 알면 *PE 선택이 회로 형태에 미치는 영향* 을 일관 frame 으로 다룰 수 있음. 사용자의 APF track 과 직접 연결.

---

## Q5. Progress measure 가 *학습 중* 회로 가설 *없이* 정의될 수 있는가?

**왜 중요한가**: 본 논문 progress measure 는 회로 가설 ($K$) 을 input 으로 받음. *online interpretability* 를 위해서는 회로 가설 없이도 *progressive change* 를 잡는 measure 가 필요. 후보:

- **Effective dimension** (intrinsic dim of weight space) — task-agnostic.
- **Hessian spectrum** 의 변화 — local geometry.
- **Activation rank** — representation diversity.

이런 task-agnostic measure 가 본 논문의 task-specific measure 와 *얼마나 일치* 하는지 비교하면, *general grokking detector* 의 가능성을 본다. Lyle 2025 가 continual learning 위에서 부분 시도. 사용자가 *finance / TS* 에서 이 detector 를 검증하면 *applied 가치* 가 큼.

---

## 종합

이 5 개 질문은 본 논문이 *닫지 않은* 다섯 면이고, 그 중 Q1, Q3 가 사용자 *Grokking track* 의 직접 contribution 영역; Q4 가 사용자 *APF track* 영역; Q2, Q5 가 *generic methodology* 영역. 모두 동시에 풀 필요는 없고, 두 main track 결정 후 1–2 개에 집중하면 박사급 contribution 가능.
