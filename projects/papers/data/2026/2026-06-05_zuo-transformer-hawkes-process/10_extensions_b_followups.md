# 10_extensions_b — 사고 확장: Follow-up 논문 3편

> THP 와 본질적으로 같은 frame 에서 분기한 (또는 선행한) 후속·경쟁·선행 논문 3편. 각각 4-6 줄: 어떤 논문인지, 본 논문과 어떤 관계인지, 무엇을 얻을 수 있는지.

---

## 선행 1편 — Mei & Eisner (NeurIPS 2017): The Neural Hawkes Process

**무엇인가?** Continuous-time LSTM 을 통해 강도 $\lambda_k(t)$ 를 사건 사이 임의 시각에 대해 정의. RMTPP 의 exp 강도 제약 (단조성) 을 LSTM 의 hidden state 가 시간에 따라 연속적으로 evolve 하도록 함으로써 깸. **THP 의 직계 부모**. NHP 의 last author Hongyuan Zha 가 THP 의 last author 로 직접 연속.

**THP 와의 관계**: THP 는 NHP 의 (i) softplus 강도 헤드, (ii) NLL 학습 신호, (iii) 6 벤치마크 셋업 을 그대로 계승. 다만 **continuous-time LSTM → transformer self-attention** 으로 backbone 만 교체. NHP 의 강도가 사건 사이에서 LSTM hidden 의 시간 연속함수 (비단조 가능) 였다면, THP 의 강도는 사건 사이에서 hidden 고정 + 시간선형 (단조). 표현력 일부를 attention 의 long-range 이점으로 교환.

**무엇을 얻을 수 있나?** (i) **점과정 강도의 ODE-like 표현** 의 정통 방식. (ii) **NHP > THP 인 도메인** 식별 (사건 사이 비단조 강도가 중요한 경우). (iii) 사용자 Grokking track 의 "neural network 동학" 연구에 LSTM-Hawkes 의 학습 곡선을 비교 baseline 으로 활용. canonical: arXiv:1612.09328, GitHub: HMEIatJHU/neurawkes.

---

## 경쟁 1편 — Zhang, Lipton, Li, Smola (ICML 2020): Self-Attentive Hawkes Process

**무엇인가?** **THP 와 동시기** (같은 ICML 2020 의 평행 작업) 의 self-attention 점과정. 강도 헤드의 시간 의존성을 **attention score 에 직접 주입** — sin/cos time embedding 을 query/key 에 곱하는 형태. THP 는 임베딩 층에서만 시간 인코딩.

**THP 와의 관계**: 같은 발상 ("transformer 가 RNN 점과정을 대체") 의 두 가지 path. THP 가 결과적으로 더 simple 한 강도 헤드 + 더 정통한 transformer 인코더 로 후속 인용 anchor 가 되었지만, SAHP 의 attention-time 직접 결합은 본질적으로 더 표현력 ↑ 가능. 후속작 (TAA-THP 2021) 이 SAHP path 를 일부 흡수.

**무엇을 얻을 수 있나?** (i) **점과정 attention 의 두 디자인 패턴** 의 직접 비교 — 임베딩 결합 vs score 결합 의 장단점. (ii) **APF 의 PE × motif 가설**의 점과정 응용에서 SAHP path 가 다른 motif 분포를 만들 가능성 (사용자 APF 의 추가 검증 case). (iii) ICML 2020 의 같은 세션 두 논문의 비교 분석은 사용자 thesis 의 lit review 에 자연스러운 narrative. canonical: arXiv:2002.00641 (확인 필요).

---

## 후속 1편 — Zhang, Yang, Yan, Hu, Cui, Zhao (2024): Mamba Hawkes Process

**무엇인가?** THP 의 transformer backbone 을 **Mamba (selective state space model)** 로 교체. SSM 의 **O(L)** 비용으로 self-attention 의 **O(L²)** 한계 (매우 긴 시퀀스) 를 깬다. 강도 헤드 정의는 THP 의 softplus(α·Δt + linear(h)) 그대로 채택 → THP frame 의 영향력 입증.

**THP 와의 관계**: 직계 후손. THP 의 **모든 디자인 결정 (강도 헤드, NLL 학습, 6 벤치마크 평가)** 을 그대로 계승. backbone 만 교체. 따라서 비교 실험에서 attention vs SSM 의 직접 차이만 isolated 측정 가능 — 점과정의 backbone 효과 분리 실험의 정통 셋업.

**무엇을 얻을 수 있나?** (i) **THP의 가장 큰 한계 (O(L²) 비용)** 의 직접 해결 후보. (ii) **AETHER 의 BTC perpetual swap 같은 매우 긴 high-freq 시퀀스** 에 적용 가능. (iii) 사용자의 mech-interp 관점에서 **transformer attention 의 head specialization** ↔ **Mamba 의 state evolution** 의 점과정 응용 차이 분석. canonical: arXiv:2407.05302.

---

## 추가 (4편째 — 선택적) — Dong, Yan, Zhao (2023): SMURF-THP

**무엇인가?** Score Matching-based Uncertainty for THP. NLL 학습 대신 **score matching** 으로 점과정 학습. 그 결과 학습된 강도가 **uncertainty quantification** 을 직접 제공.

**THP 와의 관계**: Architecture 그대로 유지, **학습 목적함수만 변경**. THP 의 NLL + 100-sample MC unbiased integral 의 비용 부담을 score matching 으로 회피. Calibration 의 직접 개선 (Q4 의 자문 질문에 정확한 답).

**무엇을 얻을 수 있나?** 사용자의 **금융 응용 VaR / ES** 직접 응용 — THP-style 강도의 quantile uncertainty. ProTran-TFA 의 확률 헤드와 결합 가능. canonical: arXiv:2310.16336.

---

## 사용자 추적 우선순위

1. **NHP (Mei-Eisner 2017)** — 점과정 강도 표현의 정통. APF + Grokking 양 track 의 must-reference 후보. canonical: arXiv:1612.09328.
2. **Mamba Hawkes Process (2024)** — 사용자 진로 (quant industry latency) 직결. AETHER 응용에 직접. canonical: arXiv:2407.05302.
3. **SAHP (2020)** — APF 의 PE × motif 검증 추가 case. canonical: 확인 필요.

3 편의 공통 axis: **사건 시퀀스의 backbone 표현 ↔ 강도 헤드 정의 ↔ 학습 목적함수** 의 trade-off 가 점과정 + DL 의 핵심 디자인 결정 3 축임을 보여줌. 사용자의 다음 깊이 읽기 candidate.
