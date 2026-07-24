# 0. 메타 & 선정 이유

## 서지·권위 배경

- **canonical identifier**: arXiv:2309.08600 · ICLR 2024 Poster (OpenReview `F76bwRSLeK`)
- **인용 수**: Semantic Scholar 직접 접근은 본 실행에서 시도하지 않음 → **정확 수치 미확인**. 정성적으로는 발표 후 2년이 안 된 시점에 SAE(Sparse Autoencoder) 해석가능성 연구의 "표준 인용" baseline 으로 자리 잡았고, 후속 흐름(Gemma Scope, JumpReLU SAE, TopK SAE 등)이 이 논문을 출발점으로 인용한다.
- **저자 권위**: 저자군은 Anthropic 바깥의 **독립 해석가능성 연구자 그룹**이다. 이 연구를 촉발한 것은 저자들 자신의 선행 인터림 리포트 *Sharkey et al. 2023, "[Interim research report] Taking features out of superposition with sparse autoencoders"* 이며, 본 논문 §관련연구에서 "motivated this work"로 명시 인용된다. Lee Sharkey(Apollo Research)는 중첩(superposition)·특징 기하 연구 라인의 대표 인물.

## 근거 지도 (Evidence Map — 원문 위치)

- **핵심 claim**: 초록 + §1 서론 (SAE 가 다른 분해법보다 해석 가능·단의미) + §6.3 (enumerative safety 비전)
- **방법론**: §2 "Taking Features out of Superposition with Sparse Dictionary Learning" — Eq. 1(encoder) / Eq. 2(decoder) / Eq. 4(손실). 학습 세부는 부록 B.
- **실험**: §3 autointerpretability (Table 1, Figure 2, Figure 8·9), §4~5 인과·IOI (Figure 3), §6.2 재구성 손실(perplexity 25→40).
- **한계**: §6.2 "Limitations and Future Work" (재구성 불완전 · MLP 학습 실패 · autointerp 신뢰도 · IOI 일반화 미확인).

## §4-bis NO-ACCESS 3문 자기시험 — **통과** (1차 소스 = ar5iv 전문)

> 소스 등급: ar5iv.labs.arxiv.org/html/2309.08600 는 arXiv 전문 렌더로 **1차(발행 자격)**. 제목·저자가 arxiv.org/abs/2309.08600 공식 메타와 일치 확인.

- **Q1 (초록 첫 문장 verbatim)**: *"One of the roadblocks to a better understanding of neural networks' internals is polysemanticity, where neurons appear to activate in multiple, semantically distinct contexts."*
- **Q2 (주 결과 표 번호 + 수치 1개)**: **Table 1** (layer 1 residual stream 첫 5개 특징의 autointerpretation 점수) — Feature `1-0002` 점수 = **0.55**. (보조: §6.2 재구성 시 The Pile perplexity **25 → 40**.)
- **Q3 (방법 절 번호 + 식 번호)**: **§2**, **Eq. 1** `c = ReLU(Mx + b)`, **Eq. 2** `x̂ = Mᵀc`, **Eq. 4** `ℒ(x) = ‖x − x̂‖₂² + α‖c‖₁`.

세 문항 모두 1차 소스에서 verbatim 회수 → **no-access 아님, 발행 진행.**

## 선정 이유 (2줄 필수 — 품질 게이트 A + E)

1. **품질 게이트 A (탑 티어 게재 확정)**: ICLR 2024 accepted poster. SAE 해석가능성의 독립 계열 원전으로, 이미 후속 연구 흐름(TopK/JumpReLU SAE, Gemma Scope)이 형성된 검증된 임팩트(게이트 B 보조 충족).
2. **읽을 가치 자기시험 E (통과)**: 사용자는 "TS Transformer 기계적 해석"으로 피벗 중이고, 이미 다룬 Bricken 2023(Anthropic 병행작)·Marks 2024(SFC, 후손)·Mishra 2026(Chronos-SAE, 시계열 적용)의 **공통 조상**이 바로 이 논문이다. "SAE 가 왜 작동하는가(중첩 해소)"의 논거와 "특징을 인과적으로 개입하는" 프로토콜을 실제 실무(TS 모델에 SAE 이식)에 그대로 쓸 수 있어, 한 줄 판결이 "읽을 필요 없음"이 될 수 없는 논문이다. (금요일 원거리 §F / sae-features 태그, 2026-05-22 이후 공백 해소.)
