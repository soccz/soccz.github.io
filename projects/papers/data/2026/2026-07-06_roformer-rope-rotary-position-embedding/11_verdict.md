# 11. 한 줄 판결

**RoPE 는 "위치를 벡터에 더하지 말고 벡터를 회전시켜라" 라는 곱셈적 재정식화 하나로 상대위치 attention 을 dot-product 항등식에 압축한 21 세기 위치 임베딩의 표준이며, APF 프로젝트의 "PE → motif" 지도에서 sinusoidal-스펙트럼-유래 감쇠가 diagonal-band motif 를 유리하게 만든다는 미검증 가설의 이론 좌표계, Grokking-in-TS-Transformers 실험 그리드의 5-way PE 축을 정하는 필수 참조점, 그리고 시계열·금융 도메인에서는 오히려 감쇠가 병목이 될 수 있다는 반면교사의 표본이다.**

---

APF track 에서는 §3 motif taxonomy 의 이론 근거로 인용하고, §5 PE 비교 실험의 baseline 세 축 (sinusoidal / RoPE / ALiBi) 중 하나로 반드시 포함. Grokking track 에서는 `references/must_cite.md` 의 "PE / architecture as grokking modulator" 카테고리 신설의 시발점. 시계열 도메인에서는 회전 감쇠의 병목 가능성을 §7 discussion 에서 정면 다뤄야 하며, LearnRoPE 로 domain-adaptive 스펙트럼을 실증하는 것이 APF paper 의 실전적 기여점이 될 수 있다.
