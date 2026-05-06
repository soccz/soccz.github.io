# 10. 사고 확장 — Part A: 자문 5 질문

## Q1. q-similarity 의 measurement noise 는 task / context length 에 어떻게 의존하는가?

저자들이 layer-wise $S_l$ 을 단일 metric 으로 쓰지만, window size $w$ 와 sequence length $T$ 의 비율, 그리고 prompt domain (code / chat / QA / multilingual) 에 따라 $S_l$ 의 estimation variance 가 크게 달라질 수 있다. 만약 $S_l$ 의 noise 가 layer 간 차이보다 크다면 budget allocation 의 신뢰성이 무너진다. **이 질문이 중요한 이유**: 본 framework 의 실용성은 $S_l$ 이 robust signal 임에 달려 있고, robustness 의 한계가 어디인지 모르면 production 적용이 위험.

## Q2. Theorem 5.2 의 bound 가 sharp 한가, 단지 monotonic 한가?

증명 스케치에서 Cauchy-Schwarz 만 쓰면 bound 가 sharp 하지 않다. monotonic (q-sim 높을수록 score deviation 작음) 만 보장되면 ranking metric 으로는 OK 지만 quantitative budget 결정에는 부족. **이 질문이 중요한 이유**: monotonic 만으로 KV cache budget 을 inverse-proportional 로 정하는 게 정당한가? 더 precise allocation function (e.g., $B_l \propto (1-S_l)^\alpha$ with $\alpha$ task-tuned) 이 있을 수 있고, sharp bound 가 있어야 $\alpha$ 도 이론적으로 정해진다.

## Q3. Re-access pattern 과 retrieval head (Wu 2025) 의 set 가 정확히 일치하는가?

TAPPA 가 re-access pattern 을 retrieval head 의 시각적 manifestation 으로 가정했는데, retrieval head 의 인과적 정의 (특정 head ablation 시 long-context recall accuracy drop) 와 re-access pattern (visual motif of attention map) 이 정확히 같은 head set 을 식별하는지 검증 안 됨. **이 질문이 중요한 이유**: 만약 set 가 다르면 (e.g., re-access pattern 은 보이지만 retrieval 에 critical 하지 않은 head 존재) "패턴 → 기능" 의 mediation 이 약해지고, framework 가 functional explanation 이 아니라 단순 visual classification 에 머문다.

## Q4. q-similarity 가 학습 중 어떻게 evolve 하는가? Grokking 과의 관계는?

본 논문은 학습이 끝난 모델의 inference time 만 분석. 그러나 q-similarity 는 학습 중 step-by-step 측정 가능하고, 그것의 trajectory 가 grokking phase transition (Nanda 2023, Lyle 2025) 과 동기되는지 시험할 수 있다. 가설: 학습 초기 (memorization phase) 는 q-sim 이 낮고 (random query), grokking 직전 sharp jump, 후반에 안정. **이 질문이 중요한 이유**: TAPPA 의 inference metric 을 training signature 로 확장하면 사용자 grokking track 과 직접 연결되고, "왜 attention pattern 이 학습 후 그런 모양이 되는가" 의 근원 (학습 dynamics) 까지 설명 가능.

## Q5. NoPE / ALiBi / Learned PE 모델에서 q-similarity 가 같은 역할을 하는가?

Theorem 5.2 가 RoPE 의 simultaneous-shift invariance 에 의존. NoPE 는 PE 가 없으니 invariance 의 algebraic 성질이 다름. ALiBi 는 additive bias 라 곱셈적 회전이 아님. Learned PE 는 학습 dependent. q-similarity 가 PE-agnostic metric 으로 작동하면 framework 의 universality 가 격상, 작동 안 하면 RoPE-specific framework 로 한정. **이 질문이 중요한 이유**: 사용자 APF 가 정확히 multi-PE 비교를 main contribution 으로 삼고 있어 이 질문의 답이 APF 의 niche 크기를 결정.
