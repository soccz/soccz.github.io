# 10_extensions_b — 사고 확장: Follow-up 논문

이 논문 이전(선행), 병렬(경쟁/보완), 이후(후속) 논문 각 1편씩, 총 3편을 정리한다.

---

## Follow-up 1 (선행): Bricken et al., "Towards Monosemanticity" (2023)

**식별자**: Anthropic Technical Report, 2023. https://transformer-circuits.pub/2023/monosemanticity/index.html

**한 줄 요약**: 1층 MLP 언어 모델에 SAE(L1-penalty)를 적용하여 단일 의미 특징(monosemanticity)을 최초로 체계적으로 발굴한 논문.

**이 논문과의 관계**:
- "Dissecting Chronos"가 방법론적으로 직접 계승하는 부모 논문이다. "temporal-monosemanticity"라는 깃허브 리포지토리 이름 자체가 Bricken에 대한 명시적 경의.
- Bricken은 단일 레이어(MLP 1층)·단일 모달리티(언어)에서 SAE를 적용했고, "Dissecting Chronos"는 6개 레이어·시계열 도메인으로 스코프를 확장했다.
- 핵심 차이: Bricken은 L1-penalty SAE(Vanilla)를 사용했으나 "Dissecting Chronos"는 TopK-SAE를 사용. TopK가 레이어 간 희소성을 고정하여 비교 실험을 더 엄격하게 만든다.
- "Dissecting Chronos"를 이해하기 전에 Bricken의 1~2시간 분량 개념(polysemanticity, dictionary learning, feature visualization) 읽기를 권장. Bricken 없이는 "왜 SAE가 필요한가"가 불명확하다.

**이 논문을 먼저 읽어야 하는 이유**: APF 논문의 related work 섹션에 mechanistic interpretability 방법론을 포함할 경우, Bricken이 가장 직접적인 방법론 선행 논문이다. Grokking 논문에서 "훈련 중 SAE 특징이 어떻게 변하는가"를 실험할 때, Bricken의 L1-SAE vs. Mishra의 TopK-SAE를 선택해야 하므로 두 논문의 비교가 필수적이다.

---

## Follow-up 2 (병렬/경쟁): Wilinski et al., "Mechanistic Interpretability of Time Series Classification" (ICML 2025)

**식별자**: ICML 2025 워크숍. (_index.md_의 §D 항목 중 "Wilinski ICML 2025"로 등재됨.)

**한 줄 요약**: TS 분류(classification) 모델의 내부 회로를 mechanistic interpretability 방법론으로 분석 — "Dissecting Chronos"와 같은 TS 해석 가능성 분야에서 동시대 병렬 연구.

**이 논문과의 관계**:
- "Dissecting Chronos"가 예측(forecasting) TSFM을 분석하는 반면, Wilinski는 분류(classification) 모델을 분석한다. 두 논문은 "TS Transformer의 mechanistic interpretability"라는 동일 필드에서 서로 다른 태스크를 다룬다.
- Wilinski가 사용하는 인과 분석 방법론(circuit discovery, activation patching)이 "Dissecting Chronos"와 어떻게 다른지가 방법론 비교의 핵심이다.
- _profile.md_ §D에 명시된 "Wilinski ICML 2025"가 APF의 concurrent work로 식별되어 있으므로, APF 논문에서 이 두 논문을 함께 관련 연구로 인용해야 한다.
- 차이점: Wilinski는 분류 태스크(출력이 이산적)에서 회로를 분석하므로 인과 지표가 accuracy delta인 반면, "Dissecting Chronos"는 예측(출력이 연속 분포)에서 ΔCRPS를 사용한다.

**읽어야 하는 이유**: TS Transformer mech-interp 분야의 현재 수준을 파악하기 위해 두 논문(Wilinski + Mishra 2026)을 함께 읽어야 한다. APF 논문 제출 시 review에서 "Wilinski와 무엇이 다른가"라는 질문이 올 것이므로 사전 준비 필수.

---

## Follow-up 3 (후속 예측): "멀티-TSFM SAE 비교 연구" (예상 2026~2027)

**가상 제목**: "Are Feature Hierarchies Universal in Time Series Foundation Models? A Comparative SAE Analysis"

**왜 나올 것인가**: "Dissecting Chronos"가 단일 모델(Chronos-T5-Large) 분석이라는 한계를 명시했고, 이를 다수 TSFM으로 확장하는 것이 자연스러운 후속이다. 현재 TSFM 생태계에 Chronos, MOIRAI, TimesFM, MOMENT 등 여러 모델이 공개되어 있어 비교 연구 수요가 높다.

**예상 핵심 발견**:
1. T5 기반 TSFM(Chronos)은 "중간 인코더 우위" 패턴을 보이지만, patch-based TSFM(PatchTST, MOIRAI)은 다른 계층에서 인과 병목이 나타날 것이다.
2. TS-native 아키텍처(MOMENT, TimesFM)는 T5의 토크나이제이션 특성 없이도 유사한 "돌발 역학 감지" 기능을 다른 방식으로 구현할 것이다.
3. 공통 분모: 모든 TSFM에서 "어떤 레이어가 인과적으로 가장 중요한가"는 아키텍처 의존적이지만, "interpretable 특징과 인과 특징이 일치하지 않는다"는 역설적 패턴은 보편적일 것이다.

**이 논문을 지금 읽어야 하는 이유**: 아직 나오지 않은 논문이지만, 그 방향을 예측하고 준비할 수 있다. Grokking 논문에서 "모델 아키텍처별 특징 계층 변화"를 실험 변수로 설정한다면 이 가상 논문의 실험을 부분적으로 선점할 수 있다.

---

*→ 이전: `10_extensions_a_questions.md` | 다음: `10_extensions_c_ideas.md`*
