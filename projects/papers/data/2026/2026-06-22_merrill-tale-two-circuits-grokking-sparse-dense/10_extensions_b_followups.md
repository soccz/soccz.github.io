# 10 · 사고 확장 (b) — Follow-up 논문 3 편

> **방법**: 선행 1편 (본 논문이 어디서 왔는가) + 경쟁 1편 (같은 시기 다른 답) + 후속 1편 (본 논문이 어디로 가는가) 의 *시간 화살표* 로 본다.

---

## 선행 1 — Frankle & Carbin 2019 "The Lottery Ticket Hypothesis" (`arXiv:1803.03635`, ICLR 2019)

**무엇인가**: 잘 학습된 (dense) 큰 신경망 안에는 "처음부터 효율적으로 학습 가능" 한 작은 sparse subnetwork (winning ticket) 가 존재한다는 가설. 표준 protocol: (a) 큰 네트워크 학습 후 *magnitude pruning* 으로 작은 weight 제거, (b) pruning mask 를 *처음 학습 init* 에 적용, (c) 그 sparse 구조만으로 *다시 학습* → full network 와 비슷한 acc 도달. ICLR 2019 best paper.

**본 논문과의 관계**: 두 논문 모두 "sparse subnetwork 가 함수의 *지배적* 부분" 이라는 핵심을 공유. 차이는 *발견 절차*:
- Lottery: post-hoc external procedure (pruning + rewind). 학습 *후* 의 분석 도구.
- 본 논문: *자연 학습 자체* 가 sparse 구조로 *수렴*. 학습 *과정* 의 분석.

**무엇을 얻을 수 있는가**: (i) lottery ticket 의 winning ticket 인덱스와 본 논문의 sparse subnetwork 인덱스의 *비교* — 같으면 두 결과의 통합 (`arXiv:2310.19470` 후속이 시도), 다르면 *발견 절차 자체* 가 sparse 의 *정의* 를 만듦을 확인. (ii) 사용자 트랙에서 TS transformer 의 lottery ticket retrain 실험을 grokking-aware 하게 설계할 수 있는 baseline. (iii) Pruning literature 의 *iterative magnitude pruning (IMP)* 절차가 본 논문의 *binary search + faithfulness* 와 어떻게 다른지의 protocol-level 비교.

**구체적 사용**: Grokking in TS Transformers 의 §6 (실험) 또는 §7 (논의) 에 *lottery-vs-grokking* 비교 절을 두고, 두 발견 절차가 같은 winning subnetwork 를 찾는지를 *quantitative ablation* 으로 보고. Frankle 2019 의 "IMP with rewind" + 본 논문의 norm-ranked binary search 를 같은 모델에 적용한 *인덱스 교집합* 측정.

---

## 경쟁 1 — Thilak et al. 2023 "The Slingshot Mechanism: An Empirical Study of Adaptive Optimizers and the Grokking Phenomenon" (식별자 미상, 추정 arXiv 2023)

**무엇인가**: grokking 의 phase transition 을 *adaptive optimizer (Adam)* 의 second moment normalization 이 만드는 *slingshot effect* 로 설명. 학습 중 weight 가 한 방향으로 *천천히* 표류하다가 어느 시점에 *반대 방향으로 분출* — 이 *튕김* 이 phase transition 의 직접 원인이라는 mechanism. SGD 에선 거의 안 일어남.

**본 논문과의 관계**: 직교 mechanism. 본 논문이 *SGD + hinge + weight decay* 의 *coherent gradient* 분리를 mechanism 으로 본다면, Thilak 은 *Adam + adaptive scaling* 의 *artifact* 를 mechanism 으로 본다. 둘은 *서로 다른 optimizer setup* 에서 *각자 작동* 가능 — 한쪽이 다른 쪽을 부정하지 않음.

**무엇을 얻을 수 있는가**: (i) "grokking mechanism = optimizer-dependent" 라는 *meta-level* 통찰. 같은 phenomenon 이 *학습 setup 에 따라 다른 mechanism* 으로 일어날 수 있음을 인정. (ii) 사용자 트랙의 TS forecasting 이 *Adam 표준* 임을 감안할 때, Thilak 의 slingshot 이 본 논문의 norm-bimodality 보다 *더 가까운* mechanism 일 수 있음을 미리 가설로 등록. (iii) 비교 실험 가능: 같은 sparse parity 를 (a) SGD → 본 논문의 mechanism 관측, (b) Adam → Thilak 의 slingshot 관측, (c) AdamW → 두 mechanism 의 *blend* — 어느 영역이 어느 mechanism 인지의 *지도* 작성.

**구체적 사용**: Grokking in TS Transformers 의 §2 Related Work 에 "grokking mechanism literature 의 두 분지 (norm-bimodality / slingshot)" 로 본 논문 + Thilak 을 *대구* 인용. §3 실험 설정에서 사용자 트랙의 optimizer 선택 (Adam vs AdamW vs SGD) 의 정당화를 두 mechanism 비교의 *교차 관점* 으로 명시.

---

## 후속 1 — "Bridging Lottery Ticket and Grokking" (`arXiv:2310.19470`, 2023-10)

**무엇인가**: 본 논문 7 개월 뒤 (2023-10). lottery ticket 가설과 grokking 의 *통합* 시도. 본 논문의 *자연 학습 시간 동학* 에서 등장한 sparse subnetwork 와 lottery 의 *post-hoc winning ticket* 의 직접 비교. weight norm 의 변화가 *충분히* grokking 을 설명하는지의 검증.

**본 논문과의 관계**: 본 논문이 *제시* 한 가설 — sparse-dense 경쟁 — 을 *외부 검증* 의 형태로 검토. 본 논문이 약속하지 않은 lottery 와의 *정량* 통합을 수행 (검색 인덱스 단편 기반 추정 — 본문 PDF 미확인).

**무엇을 얻을 수 있는가**: (i) 본 논문의 *직접 후속* 으로서 lottery-grokking 통합의 *현재 상태* 파악. (ii) 본 논문이 못한 *시간-vs-Static* 통합의 첫 시도가 무엇을 *성공* 했고 무엇이 *실패* 했는지의 분석 — 사용자 트랙의 후속 작업이 *어디서부터* 시작해야 하는지의 anchor. (iii) 사용자 NeurIPS 2027 plan 의 *related work 의 chronological depth* 를 늘리는 인용 (2019 Frankle → 2022 Power → 2023 본 논문 → 2023-10 Bridging → 2024+ 사용자 후속).

**구체적 사용**: Grokking in TS Transformers 의 §2 Related Work 에 "lottery-grokking 통합 line" 의 직접 인용 + 사용자 자신의 contribution 이 *TS 차원* 의 통합으로 자리잡음을 contrast 로 명시. §6 실험에서 *재현 vs 차별* 의 baseline 으로 활용.

---

## 3 편 묶음 의미

이 3 편은 한 시간 화살표를 그린다:

```
2019 Frankle        2023 Merrill         2023-10 Bridging
[Lottery static] ─► [본 논문 dynamic] ─► [둘의 통합 시도]
       ▲                  ▲
       │                  │
       │            2023 Thilak [Adam-specific 경쟁]
       │
       └── 선행 mechanism                 후속 통합
```

**선행**: 본 논문의 sparse-subnetwork 관찰의 *static* 조상.
**경쟁**: 본 논문과 *같은 시기 다른 mechanism* — 두 mechanism 이 *어떤 setup 에서 어느 것이 우세* 한가의 지도.
**후속**: 본 논문의 *시간 동학* 과 *static lottery* 의 *통합* 시도.

사용자 NeurIPS 2027 plan 의 *전체 related work narrative* 가 이 4 편 (본 논문 포함) 의 시간 화살표 + 옆 가지를 기본 골격으로 삼고, *TS 차원* 의 contribution 을 그 너머로 *3 번째 축* 으로 추가하는 형태가 가장 자연스럽다.
