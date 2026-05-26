# 11 한 줄 판결

> **APF (Attention Pattern Fields) 의 출발선에 박혀 있는 논문 — "attention weight 가 설명을 제공한다" 라는 7년치 관행을 두 가지 적대적 검증 (gradient 상관 H1 + counterfactual 동치 H2) 으로 명시 반박하여, 우리가 *motif causality 실험으로 반드시 넘어서야 할* benchmark 가 된다.**

## 보충 (2~3줄)

본 논문은 *attention 의 가치 전체 부정* 이 아니다. *"attention 이 모델의 *유일하고 신뢰할 만한 설명* 이라는 *암묵 가정* 은 *대부분의 BiLSTM 류 contextualized encoder 에서* *체계적으로* 정당화되지 않는다"* 라는 *부정 명제* 일 뿐이다. 이 미묘한 차이가 후속 7년 (Wiegreffe-Pinter 2019 ~ ERASER 2020 ~ Mech Interp 2022+) 의 *건설적 정제* 를 만든다. 내 APF + Grokking 트랙은 *바로 이 정제* 의 *최신 계보* 에 속한다 — 본 논문 의 H1·H2 격자 protocol 위에 (1) *2D motif* 단위 검증, (2) *PE 의 인과적 조절 변수* 화, (3) *training-time grokking transition* 의 *circuit-level faithfulness phase change* 라는 *3 가지 차원* 을 추가하는 것이 내 contribution 의 명시 좌표.

따라서 본 논문은 *반박 대상* 이 아닌 *발판* 이다. APF/Grokking 의 reviewer 는 *반드시* 본 논문을 ① §1 첫 단락, ② §2 related work, ③ §3 methodology 의 *protocol baseline* 의 *세 위치* 에서 만나게 된다. 미리 *수사적으로 길들여진* 인용 구조를 §9 (내 연구 연결) 에 명시했다.

## 정량 요약 — 본 논문의 7 년 영향력

| 지표 | 수치 (2026 기준) | 의미 |
|------|-----------------|------|
| Citation (Google Scholar) | 1,500+ | NAACL 2019 best paper 후보 |
| Direct rebuttal (Wiegreffe-Pinter) | 600+ citation | 정제된 "not not" 입장 |
| Indirect followups | 50+ papers | Serrano-Smith / Brunner / ERASER / ACDC |
| ICML/NeurIPS/NAACL session 발표 | 30+ | "interpretability skeptic" 영역의 표준 ref |
| Mechanistic interpretability ideological 토대 | 모든 후속 work | Bricken 2023, Nanda 2023 ↑ |

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

---

## 인터랙티브 — 본 논문의 최종 그림

```viz:anie-attention-heatmap:title=Final Visual — Same Prediction, Different Attention,caption=paper Figure 1 의 핵심 visual. Example 셀렉터로 movie / medical / news 전환. 두 매우 다른 attention 분포가 *같은 prediction* 만듦. → "attention 이 unique explanation 이 아니다" 의 단일 압축 evidence. 본 논문 7 년치 영향력의 출발점.
```

```viz:anie-datasets-summary:title=Final Visual — 12 Datasets Grid,caption=Metric 셀렉터. 본 논문의 핵심 결과를 단일 view 에 압축. τ_g (BiLSTM) — 일관 낮음. τ_g (Average) — 일관 높음. ★ encoder mixing 의 효과 grid 전체 일관성. paper Table 2 의 정량 핵심.
```
