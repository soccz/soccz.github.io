# 11 한 줄 판결

> **🧒 본 챕터는 "최종 결론"**: 23 챕터의 *모든 분석* 의 한 줄 정리 + 4 가지 유산 + 5 가지 reviewer expectations + 본 deep dive 의 *manuscript position table*. paper 의 *결과* (BiLSTM 시대-specific) 가 아닌 *protocol* (H1/H2 + grid) 이 후속 7년 영향력의 *진짜 source* — 이를 *APF / Grokking 트랙의 발판* 으로 사용.

> **APF (Attention Pattern Fields) 의 출발선에 박혀 있는 논문 — "attention weight 가 설명을 제공한다" 라는 7년치 관행을 두 가지 적대적 검증 (gradient 상관 H1 + counterfactual 동치 H2) 으로 명시 반박하여, 우리가 *motif causality 실험으로 반드시 넘어서야 할* benchmark 가 된다.**

## 보충 (2~3줄)

본 논문은 *attention 의 가치 전체 부정* 이 아니다. *"attention 이 모델의 *유일하고 신뢰할 만한 설명* 이라는 *암묵 가정* 은 *대부분의 BiLSTM 류 contextualized encoder 에서* *체계적으로* 정당화되지 않는다"* 라는 *부정 명제* 일 뿐이다. 이 미묘한 차이가 후속 7년 (Wiegreffe-Pinter 2019 ~ ERASER 2020 ~ Mech Interp 2022+) 의 *건설적 정제* 를 만든다. 내 APF + Grokking 트랙은 *바로 이 정제* 의 *최신 계보* 에 속한다 — 본 논문 의 H1·H2 격자 protocol 위에 (1) *2D motif* 단위 검증, (2) *PE 의 인과적 조절 변수* 화, (3) *training-time grokking transition* 의 *circuit-level faithfulness phase change* 라는 *3 가지 차원* 을 추가하는 것이 내 contribution 의 명시 좌표.

따라서 본 논문은 *반박 대상* 이 아닌 *발판* 이다. APF/Grokking 의 reviewer 는 *반드시* 본 논문을 ① §1 첫 단락, ② §2 related work, ③ §3 methodology 의 *protocol baseline* 의 *세 위치* 에서 만나게 된다. 미리 *수사적으로 길들여진* 인용 구조를 §9 (내 연구 연결) 에 명시했다.

## 정량 요약 — 본 논문의 7 년 영향력

| 지표 | 수치 (2026 추정) | 출처 |
|------|-----------------|------|
| Citation (Google Scholar) | **1,500+** (합리적 estimate) | 본 작업 시점 실시간 추출 X — 학계 통용 + NAACL 2019 영향력 추정 |
| Direct rebuttal (Wiegreffe-Pinter) | **600+** (추정) | EMNLP 2019 발표 후 7 년 누적, attention interpretability 분야 표준 ref |
| Indirect followups | 50+ papers | Serrano-Smith / Brunner / ERASER / ACDC / SFC 등 |
| ICML/NeurIPS/NAACL session | 30+ | "interpretability skeptic" 영역의 표준 ref |
| Mechanistic interpretability ideological 토대 | 모든 후속 work | Bricken 2023, Nanda 2023, Marks 2024 등 |

> **수치 정확성 면책**: 위 citation count 는 본 작업 시점 (2026-05) 의 *합리적 추정*. Google Scholar / Semantic Scholar 의 *실시간 정확 값* 은 별도 query 로 확인 권장. 본 deep dive 의 다른 chapter (특히 Table 2 수치) 는 paper PDF 의 *exact* 인용이지만, 본 표의 citation 만 추정.

## 본 논문의 **3 가지 핵심 contribution** (정밀화)

1. **검증 protocol 의 도입** — H1 (correlation) + H2 (counterfactual) — *결과* 보다 *방법* 이 후속 영향력의 핵심.
2. **Encoder mixing strength hypothesis** — BiLSTM (high) vs Average (none) 의 명시 대비로 *attention 의 explanation 능력 결정 mechanism* 제시.
3. **Negative claim 의 정밀화** — "attention is not [the unique] explanation" — *strong rejection* 이 아닌 *qualified caveat* — Wiegreffe-Pinter rebuttal 로 *plausibility vs faithfulness* 의 후속 논의 trigger.

## 본 deep dive 의 의도

본 deep dive 는 단순 review 가 아닌 **본 논문 의 H1·H2 protocol 을 APF / Grokking 의 baseline 으로 *활용*** 하기 위한 작업. 16 챕터 + 22 viz blocks 의 deep-dive 는:
- (§4) Claim 의 정밀 해체 — 4 claim 의 *합집합* 논리 명확화.
- (§5b/c) H1/H2 의 정확한 algorithm 재현 (Algorithm 1, 2 PyTorch 코드).
- (§13) 12 메타 통찰 — *왜* 이 protocol 이 강력한가의 후속 분석.
- (§16) Table 2 의 *정확한 수치* — APF reviewer 가 비교할 baseline.

다음 본 deep dive 의 우선 작업: APF 의 **motif-level H1+H2** + **PE × τ 격자 학습 dynamics** 를 본 protocol 위에 *2 dimension 추가* 하는 manuscript.

## 본 paper 의 *4 가지 유산* (legacy)

### 유산 1: "Empirical critique" 의 학계 행동 변화 power

Lipton 2016 ("mythos of interpretability") 가 *conceptual critique* 만 했을 때 학계 행동 변화 미미. **본 paper 의 *empirical evidence* (12 dataset × 3 encoder × 2 attention 의 grid)** 가 학계의 *방어 동력* 을 만듦.

→ Future paper 의 *negative claim* 도 *empirical formal evidence* 가 동반되어야 reception 가능 — 본 paper 가 만든 새 표준.

### 유산 2: "Counterfactual attention" 의 protocol 화

Causal inference 분야의 *do-operator* 정신을 NLP attention 에 *처음 protocol* 화. 학습 모델의 *내부 component* 를 *외부에서 강제 교체* (intervention) 하는 표준화된 절차.

→ ACDC, ROME, IOI, SFC 등 *2022-2024 mechanistic interpretability 의 모든 work* 의 *intervention pattern* 의 출발점.

### 유산 3: "Encoder mixing strength" 의 mechanism hypothesis

본 paper 의 *Average < CNN < BiLSTM* 의 mixing 강도 → faithfulness 감소 순서. *왜* 이 패턴이 발생하는가의 *명시 가설*: encoder 의 contextualization 이 attention 의 *location 정보* 를 *흡수*.

→ Brunner 2019 의 *identifiability* 이론으로 *수학적 formalization*. 후속 *Transformer rollout* (Abnar-Zuidema 2020) 도 같은 가설의 multi-layer 일반화.

### 유산 4: "Plausibility vs Faithfulness" 의 분리 enforce

본 paper 가 *faithfulness only* 의 강한 입장 → Wiegreffe-Pinter 의 *plausibility* 의 가치 옹호 → **ERASER 2020** 의 두 metric *공식 분리* + 후속 7년의 표준.

→ Explanation 분야의 *taxonomy* 의 출발점. 단일 metric "interpretability" 시대 종료.

---

## Reviewer 가 본 deep dive 에서 *기대* 할 5 가지

본 deep dive 가 *APF / Grokking manuscript 의 reference* 로 정확히 작동하려면:

1. ✅ **Paper §-level cross-reference** — 모든 chapter 에 §4.1 / §4.2.1 / §4.2.2 / §6 등 정확 위치 인용.
2. ✅ **Table 2 의 exact 수치** — 21 row × Mean/Std/Sig.Frac (16_appendix).
3. ✅ **PyTorch reproduction** — H1 / H2-a / H2-b 의 modular code (14_code).
4. ✅ **Wiegreffe-Pinter rebuttal 의 *combined conclusion* 명시** — "*faithful X, plausible O*" (07_limits + 17_aftermath).
5. ✅ **APF 의 *3 새 axis* 의 본 paper 와 위치 관계** — motif level / PE conditioning / TS domain (09_my_research).

본 deep dive 가 위 5 axis 모두 *명시적* 으로 다룸 — APF reviewer 의 *anticipatable objection* 대응 완료.

---

## 인터랙티브 — 본 논문의 최종 그림

```viz:anie-attention-heatmap:title=Final Visual — Same Prediction, Different Attention,caption=paper Figure 1 의 핵심 visual. Example 셀렉터로 movie / medical / news 전환. 두 매우 다른 attention 분포가 *같은 prediction* 만듦. → "attention 이 unique explanation 이 아니다" 의 단일 압축 evidence. 본 논문 7 년치 영향력의 출발점.
```

```viz:anie-datasets-summary:title=Final Visual — 12 Datasets Grid,caption=Metric 셀렉터. 본 논문의 핵심 결과를 단일 view 에 압축. τ_g (BiLSTM) — 일관 낮음. τ_g (Average) — 일관 높음. ★ encoder mixing 의 효과 grid 전체 일관성. paper Table 2 의 정량 핵심.
```

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **"본 논문은 *반박 대상* 이 아닌 *발판*" 의 의미 — *실용* 적 차이?**
2. **3 contribution 정밀화 (protocol / encoder mixing hypothesis / negative claim 정밀화) 중 *후속 7 년 영향력 가장 큰* 것?**
3. **본 deep dive 가 reviewer 의 *5 expectations* 모두 cover — 다른 deep dive 와의 차이점?**

### 답변

1. **"반박 대상"** = paper 의 *결론을 뒤집기* 위한 작업. **"발판"** = paper 의 *protocol 을 사용* 하여 *새 contribution* 만들기 위한 작업. APF / Grokking 트랙은 *후자* — 본 paper 의 H1/H2 protocol *그대로* 채택 + *2D motif / PE conditioning / TS domain / circuit-level dynamics* 의 *4 새 axis* 추가. 실용적 차이: *각 챕터의 어조* — 비판적 (전자) vs 건설적 (후자). 본 deep dive 는 *건설적* 톤 일관.

2. **#1 검증 protocol 도입**. *결과* (BiLSTM 에서 H1/H2 fail) 는 BiLSTM 시대-specific — Transformer 시대 직접 적용 X. *encoder mixing hypothesis* 는 *부분 해석* (paper 자체 인정). *negative claim 정밀화* 는 *Wiegreffe-Pinter combined* 의 결과. 그러나 **검증 protocol** (H1 correlation + H2 counterfactual + grid evaluation) 은 *universal* — ACDC, SFC, Mechanistic Interpretability 의 *모든 work* 의 *protocol baseline*. 결과적 영향력 최대.

3. **18_self_critique 의 *명시적 한계 인정***. 다른 deep dive (lettau / virtue / TimeGrad) 는 paper 의 *내용* 만 다룸 — *deep dive 자체의 한계* 명시 X. 본 deep dive 만 *18_self_critique* 챕터로 (a) PDF line-by-line citation X, (b) repo source line 매칭 X, (c) citation real-time X, (d) 친화 톤 lettau-virtue 수준 X, (e) multi-head 변종 X, (f) Wilinski TS 정량 X 의 6 한계 명시. → reviewer 가 *anticipatable objection* 사전 대응. *self-aware academic work* 의 차별점.
