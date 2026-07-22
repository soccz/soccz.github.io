# 9-b. 사고 확장 — Follow-up 논문 3편

읽는 순서로 선행 → 경쟁 → 후속(맥락)을 배치했다.

## 선행 — ALiBi: *Train Short, Test Long: Attention with Linear Biases* (Press, Smith, Lewis, ICLR 2022, arXiv:2108.12409)

Powerformer 의 직계 부모. "어텐션 로짓에 거리 비례 편향을 더한다"는 틀($f^E(t)=-\alpha t$, 지수 감쇠)을 세우고, 학습보다 긴 시퀀스로의 외삽을 가능케 했다. Powerformer 는 이 틀을 그대로 계승하되 감쇠 형태를 지수→거듭제곱으로 바꿨다. **얻을 것**: Powerformer 를 읽기 전 ALiBi 를 보면 "무엇이 새롭고(형태) 무엇이 계승인지(로짓 덧셈 틀)"가 분리돼 보인다. 특히 ALiBi 의 head별 기하수열 기울기 $m$ 과 Powerformer 의 head별 $\alpha$ 를 나란히 두면, 두 논문이 "다중 스케일을 head 로 구현"하는 공통 전략을 쓰되 곡선 형태만 다름이 드러난다. (본 저장소 2026-07-20 커버.)

## 경쟁 — DAPE: *Data-Adaptive Positional Encoding for Length Extrapolation* (Zheng et al., NeurIPS 2024)

정반대 철학의 동시대 연구. Powerformer 가 **고정된 닫힌 형태 감쇠 곡선**(해석 가능·저비용·강건)을 고집한다면, DAPE 는 감쇠/위치 편향을 **데이터 적응적으로 학습**해 표현력을 높인다. **얻을 것**: "표현력 vs 해석 가능성" 트레이드오프의 양 끝을 보게 된다. 내 APF 관점에서 핵심 질문 — 학습형(DAPE)이 유도하는 motif 가 고정형(Powerformer)의 대각 밴드보다 풍부한가, 아니면 결국 비슷한 국소 밴드로 수렴하는가? 이는 "감쇠 형태의 자유도가 motif 다양성으로 이어지는가"를 가르는 실험 축을 준다. (`_index.md` priority, `pe-attention-geometry`.)

## 후속(맥락) — *Positional Encoding in Transformer-Based Time Series Models: A Survey* (Irani & Metsis, 2025, arXiv:2502.12370)

Powerformer 와 거의 동시대에 나온, 시계열 트랜스포머의 PE 방법 전체를 정리한 서베이. Powerformer 가 속한 "거리 감쇠형 상대 PE" 계열을 sinusoidal·learned·RoPE·ALiBi·FIRE 등과 함께 한 지도에 놓는다. **얻을 것**: 내 APF PE 비교 축(NoPE/sinusoidal/learned/RoPE/ALiBi + 새로 추가할 Powerformer 셀)의 **완전성 점검표**. 이 서베이가 분류한 축 중 내 격자에 빠진 게 있는지(예: FIRE, tAPE/eRPE), Powerformer 셀이 서베이 taxonomy 어디에 정확히 앉는지를 대조해, APF 실험 설계의 커버리지 구멍을 메운다. (`_index.md` priority, `pe-attention-geometry`.)
