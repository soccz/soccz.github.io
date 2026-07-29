# 9. 사고 확장 (B) — Follow-up 논문 3편

## 선행 (이 논문이 딛고 선 것) — Towards Monosemanticity / Sparse Feature Circuits 계열

**어떤 논문**: Anthropic의 dictionary learning·SAE 해석론(2026-05-22, 2026-05-15 이 큐레이션에서 커버). 개념 = 잠재공간의 방향, 활성 개입으로 인과 검증이라는 **방법론적 원천**.

**관계**: 이 논문의 steering·선형 표현 가설은 여기서 직수입됐다. 선행을 읽으면 "왜 difference-of-means가 개념 방향이 되는가", "왜 선형 프로빙이 정보 존재의 증거인가"의 이론적 근거를 얻는다.

**무엇을 얻나**: 이 논문이 **당연시하고 넘어간 전제**들의 출처. 내 APF에서 steering을 쓸 때 이 선행의 검증 프로토콜(개입의 특이성·부작용 측정)을 그대로 가져오면, 이 논문이 빠뜨린 정량 평가를 채울 수 있다.

## 경쟁 (같은 목표, 다른 길) — Dissecting Chronos: Sparse Autoencoders Reveal Causal Feature Hierarchies (Mishra)

**어떤 논문**: arXiv:2603.10071, ICLR 2026 TSALM Workshop (2026-05-27 커버). SAE로 Chronos의 특징 위계를 **비지도 발굴**.

**관계**: 정면 경쟁 관계. 이 논문은 **개념을 미리 정해(지도)** 위치·조종을 보고, Mishra는 **개념을 모른 채(비지도) 발굴**한다. 같은 대상(TSFM 내부), 반대 인식론.

**무엇을 얻나**: 두 접근의 **상보성**. 내가 APF에 쓴다면 — SAE로 motif와 무관하게 창발하는 특징을 먼저 발굴하고(Mishra식), 그 중 motif에 대응하는 방향만 골라 steering으로 인과 검증(이 논문식)하는 **2단 파이프라인**을 설계할 수 있다.

## 후속 (이 논문에서 파생) — On the Internal Semantics of Time-Series Foundation Models

**어떤 논문**: arXiv:2511.15324 (이 논문 직후 등장한 같은 계열). TSFM 내부 의미 구조를 더 파고듦.

**관계**: 이 논문이 연 "TSFM 해석론" 흐름의 직접 후손. 이 논문의 개념 국소화·steering을 이어받아 확장하는 위치.

**무엇을 얻나**: 이 분야가 1~2년 새 **하나의 서브필드로 굳어지는 궤적**을 확인. 내가 APF/Grokking 논문의 related work를 쓸 때, "TSFM mechanistic interpretability"를 Wiliński(2025)→후속(2025~) 계보로 인용하면 최신성·맥락을 동시에 확보한다.
