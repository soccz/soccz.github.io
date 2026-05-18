# 10-A 자문 질문 5개

## Q1. *Attention 분포의 학습 manifold* 를 직접 모델링할 수 있는가?

Wiegreffe-Pinter 의 *반박* 의 핵심은 "adversarial attention 이 *학습 분포 밖* 의 점일 수 있다" 였다. 그러나 *학습 분포* 가 무엇인가는 명시적으로 정의되지 않은 채 남았다. 만약 우리가 *training trajectory* 의 모든 step 에서 attention 분포를 수집하고 그 *manifold* 를 (예: VAE, normalizing flow) 추정할 수 있다면, *adversarial 분포가 manifold 안인지 밖인지* 의 *수치적* 판정이 가능. 이는 본 논문의 결과를 *manifold-aware* version 으로 *refine* 한다.

**왜 중요한가**: Jain-Wallace ↔ Wiegreffe-Pinter 의 7년 묵은 논쟁의 *수학적 해결 도구* 가 될 잠재력. APF 의 *motif typology* 도 사실상 *manifold* 의 typology 적 분해와 같음.

## Q2. *Faithfulness ↔ Generalization 의 인과 관계* — Grokking transition 에서 attention faithfulness 가 *언제* 형성되는가?

내 Grokking 트랙의 핵심 hypothesis: *generalization circuit* 이 형성되는 transition 직전·직후 에 attention 의 *faithfulness 점수* 가 phase change 를 보이는가? 만약 *post-grok* 에서 faithfulness 가 갑자기 *증가* 한다면 generalization circuit 이 *attention-mediated*. *감소* 한다면 *attention-bypass*. 이 차이가 Nanda 의 Fourier circuit + Marks 의 SAE circuit 의 *attention 외부 component* 의 존재를 *직접* 시사.

**왜 중요한가**: Grokking 트랙에 *circuit-level 새로운 발견* 의 가능성. Nanda 2023 가 *progress measure* 의 correlation 으로 transition 을 측정했다면, 이 질문은 *faithfulness measure 의 transition* 으로 한 단계 더 들어감.

## Q3. *Multi-head 의 redundancy* 는 *시스템-수준 attention 의 faithfulness* 를 어떻게 변형시키는가?

본 논문은 *단일 head*. Multi-head 에서는 한 head 의 adversarial 이 다른 head 의 *보정* 으로 무력화될 가능성. 즉 *head-wise faithfulness 실패 + system-wise faithfulness 성공* 의 분리. 만약 그렇다면 *시스템-수준 attention summary* (rollout, max, *learned mixture*) 가 explanation 후보로 *부활*. 어떤 aggregation 이 가장 *faithful* 인가?

**왜 중요한가**: Transformer 시대의 *attention rollout vs effective attention vs flow* 의 표준 선택에 *경험적 근거* 를 제공. APF 의 2D motif framework 에서 head 별 motif 와 system-level motif 의 *합산 규칙* 의 정당화 방법.

## Q4. *PE choice* 가 H1·H2 결과를 *얼마나 옮기는가* — PE 가 attention 의 faithfulness 의 *조절자* 인가?

본 논문은 *no PE / 단일 sinusoidal PE* 만 testbed. PE choice (NoPE / sinusoidal / learned / RoPE / ALiBi / FIRE / DAPE) 별로 같은 task 에서 H1·H2 의 결과가 *얼마나 다른가*? 만약 PE 가 *큰 조절자* 라면 — RoPE 에서 attention 이 *훨씬 더 faithful* 이라면 — 본 논문의 결과는 *그 시대의 weak PE* 의 함수일 뿐이며 *현대 Transformer* 에서는 *덜* 적용된다는 boundary 가 그어짐. 반대로 PE 가 *큰 영향 없음* 이라면 본 논문의 결론은 PE-robust.

**왜 중요한가**: APF 의 *PE × motif × faithfulness* 격자가 *최초의 체계적 PE-faithfulness sweep* 이 됨. NeurIPS 2027 1순위 / TMLR 의 *methodology contribution* 자체가 됨.

## Q5. *TS 도메인의 attention* 은 *NLP 보다 본질적으로 더 faithful* 인가, 덜 faithful 인가?

TS 는 *연속 시간 신호*. Token = time-step or patch. NLP token (단어) 과 *대칭 단위* 가 아님. TS attention 이 (a) 주기적 신호의 *spectral component* 를 cover 하는가, (b) trend 와 seasonality 를 *분리* 하는가, (c) regime shift 에 *반응* 하는가 의 측면에서 *faithful* 한가. 본 논문의 NLP 결과가 TS 도메인의 *기본 가설* 로 직접 옮겨가는 것이 *위험한 추론* 임을 보일 수 있는가?

**왜 중요한가**: 내 *금융 시계열 ML* 산업 진로의 핵심 — *해석 가능한 TS 모델* 의 *진짜* explanation tool 후보. 만약 TS attention 이 *더 faithful* 임을 보일 수 있다면 *산업 응용에 의미 있는 contribution*. 반대로 *덜 faithful* 이라면 *대안 explanation tool* (예: TimesNet 의 2D-period decomposition) 의 우월성 증거.
