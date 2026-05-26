# 11 한 줄 판결

> **🧒 한 줄 요약**: 본 paper 의 *4 평가*: (1) practical: ★★★★★ (1000× 가속), (2) novelty: ★★★★ (combination), (3) impact: ★★★★★ (production), (4) reproducibility: ★★★ (cost barrier).


> **SAE 특징과 인과 회로를 하나의 언어로 통합한 첫 번째 논문 — ACDC가 연 "어텐션 헤드 단위 회로 발견"의 바로 다음 계단이고, APF의 mech-interp 툴링 레이어에 직접 이식 가능한 귀환 경로이며, Grokking 국면 전환을 특징 해상도에서 추적하는 아직 아무도 가지 않은 길의 첫 포석이다.**

---

**판결의 이유 (3줄 보충)**:

SFC는 "SAE = 특징 발견 도구"와 "circuit = 인과 구조 도구"를 하나의 프레임워크로 연결하여, 이전까지 평행하게 달리던 두 해석가능성 연구 방향을 합류시켰다. ICLR 2025 Oral이라는 커뮤니티 평가와 David Bau, Belinkov 같은 권위자들의 참여가 이 논문의 패러다임 전환적 위치를 뒷받침한다. 내 연구에서는 APF의 인과 개입 단계에 IE/AP/IG 방법론을 직접 연결하고, Grokking track에서 훈련 체크포인트별 특징 회로 변화를 추적하는 두 방향의 출발점으로 삼는다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Practical 가치 (1000× 가속) 의 *industry impact*?**
2. **Novelty (ACDC + SAE combination) 의 *originality 평가*?**
3. **Reproducibility (cost barrier) 의 *real obstacle*?**

### 답변

1. **Mech interp industry 의 standard 도구화**. 본 paper 의 5min/circuit + interpretable feature 가 Anthropic feature steering, OpenAI superalignment SAE, Gemma Scope 의 *direct foundation*. 2025-2026 의 *editable AI commercialization* 의 *academic seed*. ★★★★★ practical impact.

2. **Combination originality**. SAE (Bricken) + Circuit (ACDC) + Attribution (Sun 2022) 의 *결합* — 각 component 는 *기존 work*. 결합 frame 의 *novelty 는 moderate*. 그러나 *attribution + SAE* 의 *specific synergy* (1000× speed) 가 *non-obvious* — ★★★★ novelty.

3. **Pythia-2.8B SAE training = 32 day × A100**. $3K + 의 *연구 cost* — *학교 cluster* 외 *학생 budget* 어려움. Sonnet 까지 확장 시 *기업 자원* 만 가능. Gemma Scope (open) 가 일부 *democratize* 하지만, *custom model* 의 *full reproduction* 은 *real barrier*.
