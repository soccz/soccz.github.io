# 10 · 사고 확장 (a) — 자문 질문 5개

> **이 절의 목적**: 본 논문을 *디딘 채* 던질 질문들. 질문 자체보다 "왜 이 질문이 *지금* 중요한가" 가 본 절의 무게.

---

## Q1. Sparse subnetwork 의 *index identity* 는 random init 의 함수인가, task 의 함수인가?

**질문 풀이**: 본 논문은 5 seed 학습 후 sparse subnetwork 가 "어디서나 등장" 함을 보였을 것으로 추정. 그러나 seed 마다 *어떤 인덱스* (1000 개 뉴런 중 어느 6~8 개) 가 sparse subnetwork 가 되는지는 다를 수 있음. 만약 seed 마다 *완전히 다른* 인덱스 라면 lottery ticket 식 *random winning*; 만약 seed 마다 *비슷한* 인덱스 (정렬 후 ranking 일치) 라면 task 자체가 *특정 init 패턴* 을 favor 한다는 의미.

**왜 중요한가**: (i) lottery ticket 가설과의 *정량* 차별화 — 본 논문이 못한 자리. (ii) 회로 *발견 가능성* 의 *robustness* 측정 — 사용자 트랙에서 회로 측정을 cross-seed 평균할 때 *공통 회로* 가 존재하는지의 검증 도구.

---

## Q2. Phase transition 의 *시점* 을 task 의 어떤 양으로 *예측* 할 수 있는가?

**질문 풀이**: 본 논문은 phase transition 의 *시점* 을 hyperparameter (lr, wd) 의 함수로 측정했을 가능성. 그러나 task 의 *복잡도 양* (k, n, $N$, entropy of input distribution) 의 함수로 phase transition 시점이 어떻게 scaling 하는가의 *closed-form prediction* 이 가능한가? "phase transition epoch = $f(k, n, N, \alpha, \lambda, W)$" 같은 식.

**왜 중요한가**: (i) grokking 의 *공학적 예측 가능성* — "이 task 에 이만큼 학습하면 phase transition 이 옵니다" 를 사전에 답할 수 있게 함. (ii) 사용자 TS 트랙에선 TS dataset 의 어떤 *통계량* (non-stationarity 정도, regime 수, sample 길이) 이 grokking 시점을 결정하는지 예측 가능. NeurIPS 2027 plan 의 §5 (실험) 의 *scaling law 분석* 절을 만들 수 있음.

---

## Q3. Dense subnetwork 는 *학습 후* 무엇이 되는가 — 죽는가, 잠자는가?

**질문 풀이**: 본 논문은 dense → sparse 교체를 묘사하지만, dense subnetwork 의 *post-grokking 운명* 은 본문 PDF 미확인. (a) dense subnetwork 의 뉴런들이 0 근처로 수렴해 "죽는가" — 그러면 lottery ticket 의 winning ticket 식 *살아남은 sparse* 만 model 이 됨. (b) 살아있지만 logit 에 *기여 안 하는* 상태로 잠자는가 — 그러면 *재활성화 (catastrophic forgetting / re-grokking)* 가 가능한 latent capacity 가 됨.

**왜 중요한가**: (i) **continual learning** axis (`_profile.md` §F) 와 Lyle 2025 *under non-stationarity* 의 연결. (b) 시나리오에선 task 가 바뀌면 dense subnetwork 가 다시 깨어나 *새 sparse subnetwork* 의 등장을 *방해* 또는 *촉진* 할 수 있음. (a) 시나리오면 모델이 *고착* 되어 continual learning 자체가 어려움. (ii) APF 의 motif 가 *학습 후* 도 head 안에 *잠자는 형태* 로 남아 있는지의 직접 비교 가능.

---

## Q4. "Sparse" 의 정의가 *measure-dependent* 인가?

**질문 풀이**: 본 논문의 sparse 정의는 "norm-ranked top-$k^\star$ 가 faithfulness=1" 의 *operational* 정의. 그러나 다른 measure 로 정의하면:
- *L1 sparsity* of weight matrix: weight 의 0 비율.
- *Activation sparsity*: 평균 ReLU 출력의 0 비율.
- *Functional sparsity*: "input 의 어떤 변화에만 반응" 의 mutual information.
- *Spectral sparsity*: weight matrix 의 effective rank.
- *Topological sparsity*: weight graph 의 *small-world* 정도.

이 5 측정이 같은 sparse subnetwork 를 가리키는가, 아니면 *서로 다른* 회로를 가리키는가?

**왜 중요한가**: (i) 회로 분석의 *measurement invariance* 의 첫 단계. 만약 5 측정이 모두 일치하면 "회로 = 객관적 실체"; 일치하지 않으면 *measure choice 가 정의를 결정* 함을 인정해야 함. (ii) APF 의 motif 도 measure-dependent 일 수 있어 — Yang 2026 TAPPA 의 q-similarity 와 Kalnāre 2025 의 raw attention pattern 이 정의하는 motif 가 *같은가* 의 별도 질문.

---

## Q5. 만약 phase transition 을 *인위적으로 트리거* 할 수 있다면?

**질문 풀이**: 본 논문이 phase transition 의 *기계* 를 노름 동학으로 환원했다면, 다음 단계는 *제어*. 학습 중 어느 시점에서:
- sparse 후보 뉴런들의 노름을 *밀어주면* phase transition 이 *앞당겨* 지는가?
- dense 뉴런들의 노름을 *강제로 감쇠* 시키면 phase transition 이 *건너뛰어* 지는가?
- 둘 다 했을 때 *grokking 없이 처음부터 generalize* 하는 학습이 가능한가?

**왜 중요한가**: (i) **공학적 제어 가능성** — "느린 grokking" 의 시간 비용을 줄임. 실무 ML 의 *학습 효율* 직접 영향. (ii) Power 2022 의 4-phase diagram 에서 *generalization phase* 로 빨리 들어가는 *지름길* 을 제공. (iii) 인과 mechanism 의 *검증* — 만약 노름 개입으로 phase transition 이 *제어 가능* 하다면 노름 동학이 phenomenon 의 *원인* 임이 인과 그래프 상에서 확인됨 (associational → causal 격상). 사용자 트랙에서는 "regime-switching 시계열의 grokking 을 노름 개입으로 *trigger* 하여 학습 시간을 단축" 의 응용 가설로 격상 가능.

---

## 5 질문의 묶음 의미

이 5 질문은 한 줄로 묶을 수 있다: **"본 논문이 보여준 phenomenon 이 (a) 외부 측정자 시각의 *실체* 인가, (b) 측정 lens 의 *artifact* 인가, (c) 인과적으로 *제어 가능* 한가."** Q1, Q4 가 (b), Q3 가 (a), Q5 가 (c), Q2 가 (a) + (c) 의 교차. 본 논문은 (a) 의 *질적* 답만 했고 — 사용자 트랙의 후속이 (b), (c) 를 *정량적* 으로 답할 자리.
