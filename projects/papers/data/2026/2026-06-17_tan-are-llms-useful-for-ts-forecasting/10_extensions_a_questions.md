# 10-a. 사고 확장 — 자문 질문 5개

본 논문을 *진짜로 내것* 으로 만들기 위해, 본문을 덮어두고 던져야 하는 *날카로운 질문* 5개. 각각에 *왜 이 질문이 중요한가* 2~3줄.

---

## 질문 1 — "PAttn 의 e_layers scan 에서 *언제* saturate 가 일어나는가?"

본 논문은 1-layer attention 으로 충분하다고 결론. 그러나 *몇 layer 까지* 가 *불필요* 하고 *몇 layer 부터* 가 *필수* 인지의 단조성 (monotonicity) 은 *별도 평가* 가 필요. 만약 1 layer 가 충분하다면 2 layer 가 더 좋을 수도 있지만 그게 *한계 이득* 이면, *진정한 capacity bottleneck* 이 어디에 있는지 알 수 있다.

**왜 중요한가**: APF 의 motif typology 가 *깊이별로* 변하는지 측정하려면 baseline 의 capacity profile 이 정량화돼 있어야 함. 또 Grokking track 의 *깊이-grokking 관계* 가설의 직접 검증.

---

## 질문 2 — "셔플 결과는 *어떤 셔플* 에 대한 강건성인가?"

본 논문이 보인 "셔플해도 LLM-based forecaster 성능 안 떨어짐" 의 결론은 *셔플 입자* 에 따라 다를 수 있다. 토큰 (patch) 단위 셔플인가? sub-patch 단위인가? 전체 셔플인가 부분 셔플인가? *coarse* 셔플 (예: patch 의 50% 만 무작위 swap) 에서 LLM 이 안 떨어지면 *진짜* 순서 무시. *fine* 셔플 (예: patch 내부 sub-time index 셔플) 에서 안 떨어지면 다른 이야기.

**왜 중요한가**: EOA / Grokking track 모두 *시간 축* 의 의미를 묻는다. 본 논문의 셔플이 어떤 입자에서의 강건성인지가 *시계열의 inductive bias 분해* 의 기초.

---

## 질문 3 — "사전학습 LLM 의 *PE (positional encoding) 부분* 도 함께 제거됐는가?"

본 ablation 에서 LLM 백본 전체를 제거할 때, *PE 도 함께 제거* 됐는지 *유지* 됐는지가 critical. PE 가 유지된 채 attention block 만 random-init 으로 교체했다면, *PE 정보* 가 부분적으로 흘러 들어가 결과의 robustness 가 *PE 덕분* 일 수 있다. 만약 PE 까지 random 이면 *완전* 무용. 본 환경 미확인.

**왜 중요한가**: APF 의 PE-motif causality 주장 의 모든 baseline 이 *PE 가 attention 의 결과를 결정* 한다고 본다. 본 논문이 *PE 보존 ablation* 이면, PE 효과는 그대로 측정 가능 → APF 의 motif causality 가 *PAttn baseline 위에서도* 검증 가능. PE 까지 제거되면 다른 이야기.

---

## 질문 4 — "본 논문의 결론이 *다변량 cross-channel* dependency 가 강한 데이터에서도 robust 한가?"

본 논문의 7 데이터셋 중 *cross-channel* dependency 가 가장 강한 것은 Traffic (862 sensors with spatial correlation). 그러나 본 평가는 *channel-independent* PAttn / OFA / Time-LLM 모두 채택. *iTransformer* 처럼 variate-wise attention 으로 cross-channel dependency 를 active 하게 모델링하는 setting 에서 ablation 결과는 다를까?

**왜 중요한가**: 금융 시계열은 *intrinsic cross-asset correlation* 이 핵심 (factor structure, lead-lag). 만약 cross-channel attention 자리에 random-init 으로 ablation 하면 다른 결과가 날 가능성. ProTran-TFA 의 multi-asset 응용에 직접 영향.

---

## 질문 5 — "PAttn 자체의 *generalization frontier* 는 어디까지인가?"

본 논문은 PAttn 이 7 데이터셋에서 SOTA LLM-based 와 동등하다는 *충분조건* 만. *PAttn 이 못하는* setting 은 언급 부족. *long-horizon* (예: 2년 forecast), *highly chaotic* (Lorenz, logistic map), *very few-shot* (10-100 samples), *out-of-distribution* (covariate shift 후 평가) 등의 극단 setting 에서 PAttn 의 한계가 어디?

**왜 중요한가**: Grokking track 이 grokking 을 *어디서 관찰할지* 의 task choice 가 본 질문의 답에 직접 좌우. PAttn 이 잘 못하는 setting 이 grokking 의 *자연 서식지* 일 가능성. 또 APF 가 *under-specified* setting 에서 motif causality 를 측정하면 noise dominate 함 — PAttn 의 frontier 가 APF 의 *measurement boundary* 와 일치.
