# 0. 메타 & 선정 이유

## 서지 정보

- **제목**: Exploring Representations and Interventions in Time Series Foundation Models
- **저자**: Michał Wiliński, Mononito Goswami, Willa Potosnak, Nina Żukowska, Artur Dubrawski
- **소속**: Carnegie Mellon University — Auton Lab. 이 그룹은 시계열 파운데이션 모델 **MOMENT**(Goswami et al., ICML 2024)를 만든 팀이다. 즉 "자기가 만든 파운데이션 모델을 자기 손으로 해부한" 논문이다.
- **발표**: ICML 2025 Poster · PMLR v267 · Vancouver
- **식별자**: arXiv:2409.12915 · OpenReview `goVzfYtj58` · icml.cc/virtual/2025/poster/44453
- **인용 수**: 정확 수치 미확인(Semantic Scholar API 직접 조회 안 함). 발표 시점(2024-09 arXiv 최초 → 2025 ICML)과 후속작 존재(`arXiv:2511.15324` "On the Internal Semantics of Time-Series Foundation Models" 등)를 볼 때 이 세부 분야(TSFM 해석론) 안에서 이미 참조되는 초기 표준 중 하나.

## 근거 지도 (원문 위치 — 이 해체의 모든 단정은 아래로 추적 가능)

- **핵심 claim**: §1 Introduction의 4개 contribution + §4 Results 전체.
- **방법론**: §3 Methods — 3.1(CKA 층 유사도 Eq.1~2 + block pruning), 3.2(선형 프로빙 + Fisher 손실 Eq.3 + LDR Eq.4~5로 개념 국소화), 3.3(steering 벡터 = 활성 중앙값 차이, 개입식 $\mathbf{h}_i\leftarrow\mathbf{h}_i+\alpha\mathbf{S}_i$).
- **실험 수치**: Table 1(MOMENT zero-shot imputation, MAE/MSE) · Fig 9/Table 9(MOMENT fine-tuning forecasting MSE) · Fig 6/7/14(CKA 히트맵) · Fig 4(LDR 개념 국소화) · Fig 5/13/15(steering 시각화).
- **한계**: §5 Discussion("Limitations and Future Work") — 합성→실데이터 전이 미검증, 상태공간모델(SSM)·MLP 계열 미포함 명시.

## 선정 이유 (왜 지금 이걸 봐야 하는가)

**품질 게이트 통과 근거**: **A(탑티어 게재 확정)** — ICML 2025 accepted, PMLR v267 (Tier 1). **E(읽을 가치 자기시험)** — 통과. 사용자는 전공을 "금융 시계열 예측 → **TS Transformer를 위한 mechanistic interpretability**"로 pivot했고(`_profile.md` §개요), active track인 **APF**는 명시적으로 "PE → 2D attention motif → CNN probe → **causal intervention**" 프레임워크다(`_profile.md` §연구상태 1). 이 논문은 바로 그 마지막 단계(causal intervention/steering)와 개념 국소화(probe)를 시계열 파운데이션 모델 위에서 실제로 구현한, **내가 쓰려는 방법의 완성된 레퍼런스 구현**이다. 한 줄 판결이 "읽을 필요 없음"이 될 논문이 아니라, 방법 템플릿과 반면교사(합성 데이터 한정 검증)를 동시에 주는 논문이므로 선정한다.

**보조 우선순위**: (1) Priority 목록 "APF — TSFM Interpretability (수요일 인접)"의 "Wilinski et al. (ICML 2025)" 항목 직접 매칭. (2) 사용자 연구 연결 강도 최상(§B mech interp + §D TSFM interp). (3) 재현성 — 코드·합성 데이터·분석 대상 모델 전부 공개. (4) 오늘 버킷(수요일 인접 §D)과 정확히 일치.
