# 0. 메타 & 선정 이유

## 인용·권위

- **인용 수**: Semantic Scholar 기준 약 200+ (2026-05 시점, 환경 제약으로 정확 수치 미확인)
- **저자 배경**: Ziming Liu — MIT Physics / Max Tegmark 그룹. 이후 KAN (Kolmogorov-Arnold Networks, 2024) 으로도 유명. Eric Michaud — 같은 그룹, grokking 후속 연구 다수. Max Tegmark — MIT Physics 교수, 물리학과 AI 교차 연구 대표 그룹. Mike Williams — MIT NSE / IAIFI.
- **그룹 특성**: 물리학 렌즈로 딥러닝 현상을 설명하는 "AI 물리학" 접근의 대표 연구실. 유효장론(effective field theory), 위상 다이어그램(phase diagram) 등 물리학 도구를 ML에 이식하는 것이 이 그룹의 시그니처.

## 근거 지도

| 내용 | 원문 위치 (학습 데이터 + 검색 교차 검증) |
|------|------|
| 4-위상 정의 (comprehension/grokking/memorization/confusion) | §1 Introduction, §3 Phase Diagrams (Figure 6) |
| 장난감 모델 유효 이론 | §2 (Setup, Effective Theory, Training Dynamics) |
| 구조화 임베딩 출현 (원 위의 배치, 평행사변형) | §2.3, §3.1 (Figure 4–5) |
| Semi-realistic 위상 다이어그램 ($\mathbb{Z}_n$, $S_5$, MNIST) | §3 (Figure 6) |
| 트랜스포머 grokking 재현 | §4 Transformers |
| "Intelligence from starvation" 비유 | §5 Discussion |
| 부록 추가 실험 | Appendix (Figure 7+) |

## 선정 이유

1. **Axis balance 복원**: §A (grokking) 축이 지난 3주 월요일 코어에서 0회 등장. §B (05-11 ACDC), §C (05-04 TAPPA, 05-18 Jain-Wallace) 만 반복됨. 금주는 §A 복원이 시급.

2. **coverage 이중 기여**: `grokking-delayed-gen` (현 커버 3) 과 `training-dynamics` (현 커버 2) 양 태그에 동시 기여. 특히 `training-dynamics` 는 코어 버킷 내 2번째로 낮은 커버 수.

3. **Priority 목록 매칭**: `_index.md` Tier 3 "Grokking secondary" 에 정확히 등재. 식별자가 불완전했으나 본 실행에서 arXiv:2205.10343 (NeurIPS 2022) 확인 완료.

4. **Grokking track 직접 필수 인용**: 사용자의 "Grokking in TS Transformers" 프로젝트가 Week 1 setup 단계에 있으며, 22개 must-cite 문헌 중 하나. Power 2022 (원 현상 보고), Nanda 2023 (회로 분석), Lyle 2025 (비정상성) 는 이미 커버 — 이제 **이론적 프레임워크** 쪽이 빠져 있었고, Liu 2022 가 정확히 그 빈 슬롯을 채운다.

5. **NeurIPS 2022 main conference**: 높은 venue 권위, 재현 연구까지 존재 (OpenReview 2023).
