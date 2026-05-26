# 11 한 줄 판결

> **APF (Attention Pattern Fields) 의 출발선에 박혀 있는 논문 — "attention weight 가 설명을 제공한다" 라는 7년치 관행을 두 가지 적대적 검증 (gradient 상관 H1 + counterfactual 동치 H2) 으로 명시 반박하여, 우리가 *motif causality 실험으로 반드시 넘어서야 할* benchmark 가 된다.**

## 보충 (2~3줄)

본 논문은 *attention 의 가치 전체 부정* 이 아니다. *"attention 이 모델의 *유일하고 신뢰할 만한 설명* 이라는 *암묵 가정* 은 *대부분의 BiLSTM 류 contextualized encoder 에서* *체계적으로* 정당화되지 않는다"* 라는 *부정 명제* 일 뿐이다. 이 미묘한 차이가 후속 7년 (Wiegreffe-Pinter 2019 ~ ERASER 2020 ~ Mech Interp 2022+) 의 *건설적 정제* 를 만든다. 내 APF + Grokking 트랙은 *바로 이 정제* 의 *최신 계보* 에 속한다 — 본 논문 의 H1·H2 격자 protocol 위에 (1) *2D motif* 단위 검증, (2) *PE 의 인과적 조절 변수* 화, (3) *training-time grokking transition* 의 *circuit-level faithfulness phase change* 라는 *3 가지 차원* 을 추가하는 것이 내 contribution 의 명시 좌표.

따라서 본 논문은 *반박 대상* 이 아닌 *발판* 이다. APF/Grokking 의 reviewer 는 *반드시* 본 논문을 ① §1 첫 단락, ② §2 related work, ③ §3 methodology 의 *protocol baseline* 의 *세 위치* 에서 만나게 된다. 미리 *수사적으로 길들여진* 인용 구조를 §9 (내 연구 연결) 에 명시했다.

---

## 인터랙티브 — 본 논문의 최종 그림

```viz:anie-attention-heatmap:title=Final Visual — Same Prediction, Different Attention,caption=paper Figure 1 의 핵심 visual. Example 셀렉터로 movie / medical / news 전환. 두 매우 다른 attention 분포가 *같은 prediction* 만듦. → "attention 이 unique explanation 이 아니다" 의 단일 압축 evidence. 본 논문 7 년치 영향력의 출발점.
```
