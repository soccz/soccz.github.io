# 10-A 자문 질문 5개

> **🧒 본 챕터는 "내가 던지는 5 질문"**: paper 의 *닫지 못한 영역* 을 *내 manuscript 가 답할 5 질문* 으로 명시. (Q1) Adversarial 의 학습 manifold? (Q2) Grokking transition 에서 faithfulness phase change? (Q3) Multi-head redundancy 의 system 효과? (Q4) PE choice 가 faithfulness 조절자? (Q5) TS domain 에서 attention 이 NLP 보다 faithful? *APF / Grokking manuscript 의 §6 Discussion* 의 *5 future work axis*.

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

---

## 5 질문 간의 의존성 — 어떻게 묶일 수 있는가?

```
Q1 (manifold) ─┐
                ├─→ Q2 (Grokking transition) 의 *학습 manifold* 정의
                │   ├─ Q1 의 manifold model 을 Grokking trajectory 위에 적용.
                │   └─ Faithfulness 의 *phase change* 가 manifold 의 *변형* 으로 해석 가능.
                │
                └─→ Q5 (TS domain) 의 *NLP-vs-TS manifold* 비교 framework
                    └─ NLP manifold 의 학습된 모델을 TS 의 attention 분포에 *transfer*
                    
Q3 (multi-head) ─┐
                  ├─→ Q4 (PE choice) 의 *head × PE 격자* 확장
                  │   └─ 다른 PE 별 head 의 *role 분포* 의 faithfulness 측정.
                  └─→ Q5 의 TS Transformer 의 multi-head 일반화
```

**3 단계 실험 sequence**:
1. **Phase 1 (low-hanging fruit)**: Q4 (PE × faithfulness) — 단일 task / 단일 architecture / multiple PE — 1 GPU-week.
2. **Phase 2 (mechanistic)**: Q2 (Grokking transition × faithfulness) — modular arithmetic + Nanda baseline + faithfulness probe — 2-3 GPU-weeks.
3. **Phase 3 (industrial)**: Q5 (TS attention faithfulness) — TimesNet / PatchTST / Autoformer × Solar/Traffic/Wikipedia — 4-6 GPU-weeks.

3 phase 통합 시 NeurIPS 2027 본문 + Appendix 의 6 figure + 4 table 자료.

---

## Q1-Q5 의 메타 메시지

본 논문은 *2019 BiLSTM NLP* 의 결과. 5 질문은 모두 *7년 후의 후속 형태*:

- **Q1**: Wiegreffe-Pinter 의 *plausibility* 정밀화 → 본 논문의 negative claim 을 *qualitative ↔ quantitative* 로 옮김.
- **Q2**: Training dynamics 의 도입 → 본 논문의 *static* analysis 를 *dynamic* 으로 옮김.
- **Q3**: Multi-head 의 일반화 → 본 논문의 *single-head* 를 *system-level* 로 옮김.
- **Q4**: Modern PE 의 도입 → 본 논문의 *2019 sinusoidal* 시대를 *2025 era* 로 옮김.
- **Q5**: TS domain 의 일반화 → 본 논문의 *NLP only* 를 *cross-domain* 으로 옮김.

5 질문 모두 본 논문의 *protocol* 을 *발판* 으로 사용. **본 논문이 *제거* 되거나 *대체* 되는 reference 아닌, *확장* 되는 baseline**.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **5 질문 중 *가장 빠르게* 답할 수 있는 (low-hanging fruit) 은?**
2. **5 질문 모두 *본 paper 의 limitation* 을 다루지만, *완전히 새로운* 측면은?**
3. **5 질문 간 *논리적 dependency* — 어느 것이 *선행* 해야 하나?**

### 답변

1. **Q4 (PE × faithfulness)** — *1 GPU-week* 로 완료. 단일 task, 단일 architecture, 6 PE variants 의 grid sweep. APF 의 *기존 motif sweep* pipeline 위에 *faithfulness probe* 만 add — *최소 추가 작업*. Q2 (Grokking transition) 가 *둘째*, Q5 (TS domain) 가 *셋째 — 큰 비용*.

2. **Q5 (TS domain)** — 본 paper 의 *NLP only* 한계를 *직접* attack. 다른 4 질문 (manifold / Grokking / multi-head / PE) 은 NLP 안에서의 *확장*. **Q5 만** *cross-domain* 일반화 — *industrial relevance 직격* (시계열 forecasting / financial ML 의 *interpretability* 표준). 본 deep dive 작성자의 *산업 진로* 의 *핵심 가치 source*.

3. **Q1 → Q2, Q5; Q3 → Q4, Q5**. Q1 (manifold 모델링) 의 result 가 Q2 (Grokking transition) 의 *manifold 정의*, Q5 (TS) 의 *cross-domain manifold 비교* base. Q3 (multi-head redundancy) 의 result 가 Q4 (PE × multi-head 격자), Q5 (TSFM 의 multi-head) base. Q2 와 Q4 는 *독립적* — 병렬 실행 가능. **3-phase sequence**: Phase 1 (Q4) → Phase 2 (Q2) → Phase 3 (Q1, Q3, Q5).
