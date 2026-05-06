# 10-B. 사고 확장 — Follow-up 논문 3편

---

## 선행 논문 — Crossformer (Zhang & Yan, ICLR 2023)

**arXiv ID**: arXiv:2303.06208

**한 줄 설명**: T×T와 N×N 어텐션을 계층적으로 결합한 "양방향 어텐션" 트랜스포머.

**iTransformer와의 관계**: Crossformer는 "시간 방향 + 변수 방향 어텐션 모두 필요하다"는 입장이고, iTransformer는 "변수 방향만으로 충분하다"는 입장이다. 이 대립은 해결되지 않았다. Crossformer는 ETT처럼 변수 수가 적고 시간 구조가 복잡한 데이터에서 더 경쟁력 있을 수 있다.

**무엇을 얻을 수 있는가**: iTransformer와 Crossformer를 같은 데이터에서 비교하면 "양방향 어텐션의 추가 비용 대비 이득"을 정확히 측정할 수 있다. APF 연구에서 "T×T + N×N 하이브리드 어텐션 맵의 2D 모티프"라는 새로운 분석 대상이 나온다.

---

## 경쟁 논문 — TimeMixer (Wang et al., ICLR 2024)

**arXiv ID**: arXiv:2405.14616 (ICLR 2024 Oral)

**한 줄 설명**: 다중 스케일 분해(Past Decomposable Mixing + Future Multipredictor Mixing)로 TS를 예측하는, 트랜스포머 없는 MLP 계열 모델.

**iTransformer와의 관계**: 같은 ICLR 2024 발표, 같은 thuml 랩에서 나온 경쟁 아키텍처. TimeMixer는 어텐션 대신 다중 해상도 MLP 혼합을 사용하며, 일부 벤치마크에서 iTransformer와 비슷하거나 더 높은 성능을 보고한다. "어텐션이 정말 필요한가, 아니면 MLP 혼합으로 충분한가"라는 더 근본적인 질문을 제기한다.

**무엇을 얻을 수 있는가**: Grokking 연구 관점에서, 어텐션이 없는 TimeMixer의 훈련 동학과 이텐션이 있는 iTransformer의 훈련 동학을 비교하면 "어텐션이 Grokking에 필수인가"를 검증할 수 있다. APF 연구 관점에서는, "어텐션 없는 모델이 어텐션 있는 모델과 비슷하게 잘 된다면, T×T 어텐션 모티프의 기능적 역할은 무엇인가"라는 질문을 더 날카롭게 만든다.

---

## 후속 논문 — Interpretability for TS Transformers via Concept Bottleneck (Sprang et al., 2024)

**arXiv ID**: arXiv:2410.06070

**한 줄 설명**: 개념 병목 모델(Concept Bottleneck Model)을 TS 트랜스포머에 통합해, "이 모델이 어떤 시계열 개념(계절성, 추세, 변곡점)을 사용해 예측하는가"를 해석 가능하게 만드는 프레임워크.

**iTransformer와의 관계**: iTransformer의 N×N 어텐션이 "변수 상관관계"를 포착한다고 주장하지만, 이것이 실제로 해석 가능한 개념(예: "냉방 수요가 온도 증가 신호에 반응")으로 분해될 수 있는지 검증하지 않는다. Sprang 2024의 Concept Bottleneck을 iTransformer에 적용하면 N×N 어텐션이 어떤 개념적 단위로 동작하는지 시각화할 수 있다.

**무엇을 얻을 수 있는가**: APF의 "2D 어텐션 모티프 → 예측 개념 연결" 분석을 N×N 어텐션으로 확장하는 구체적 방법론을 제공한다. Amsterdam NLP 그룹(Zuidema)의 해석 가능성 방법론이 TS 도메인에서 어떻게 적용되는지 파악하는 필수 선행 논문이다.
