# 10. 한 줄 판결

> **"폴리시맨틱 뉴런이 아닌 SAE 특징이 mechanistic interpretability의 올바른 기본 단위임을 4중 증거로 정당화한 창시 논문 — APF 연구에서는 attention motif 원인 규명의 도구로, Grokking 연구에서는 phase transition의 표현-수준 지문으로 직접 활용 가능하다."**

---

## 판결의 이유

**왜 이 논문이 중요한가**: Marks et al. 2024(Sparse Feature Circuits)를 이미 다뤘지만, 그 논문이 "SAE 특징이 올바른 기본 단위다"라는 가정 위에서 출발한다. 그 가정의 실증적 정당화가 바로 이 논문이다. 두 논문을 같이 읽어야 SAE 기반 mech-interp의 전체 주장 구조가 보인다.

**왜 원거리 버킷인데 연결이 강한가**: 표면적으로 `sae-features`는 LLM 해석가능성 이야기처럼 보이지만, APF(attention motif causality)와 Grokking(phase transition mechanics)에 직접 도구를 제공한다. 원거리 버킷의 "전이 가능성 탐색" 원칙에 정확히 부합한다.

**한계 인식**: 1-layer transformer에서의 결과이며, 시계열 도메인 적용은 아직 미지수다. SAE 고유성 문제(ICLR 2025 비판)가 해결되지 않으면 이 논문의 핵심 주장이 약화될 수 있다. 내 연구에서 SAE를 사용할 때 이 caveat를 명시해야 한다.
