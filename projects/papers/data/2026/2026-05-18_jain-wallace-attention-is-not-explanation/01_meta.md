# 01 메타 & 선정 이유

## 서지 정보

| 항목 | 내용 |
|------|------|
| arXiv ID | **1902.10186** |
| arXiv 제출 | v1: 2019-02-26, v2: 2019-05-08 (NAACL camera-ready) |
| 발표처 | NAACL-HLT 2019 (Minneapolis, USA), Long Paper, Main Conference |
| ACL Anthology | **N19-1357** |
| DOI | **10.18653/v1/N19-1357** |
| 페이지 | 3543–3556 (12 pages + references + appendix) |
| 인용 수 | 원문 직접 미확인 (네트워크 차단). 학계 통용 추정: **2k+ 인용** (2019 발표 이후 6년간, NAACL Best Paper Honorable Mention 급 영향력 — 해석 가능성 분야 거의 모든 review 논문에서 인용) |
| 코드 | `github.com/successar/AttentionExplanation` (저자 Sarthak Jain 의 GitHub username `successar`, GPL-3.0) |

## 저자 권위 배경

- **Sarthak Jain** (1저자, 박사과정 → 졸업 후 Bloomberg/연구 산업으로): NEU 박사. Byron Wallace 지도. 의료 NLP·해석 가능성 트랙. 본 논문이 박사과정 대표 작업.
- **Byron C. Wallace** (교신/지도): NEU 부교수. **EBM (Evidence-Based Medicine) NLP** 와 **clinical NLP** 의 권위자. AI in healthcare 의 해석 가능성·신뢰성을 둘러싼 연구 일관성으로 알려짐. 이전에 의료 도메인 attention 해석 논문 다수 (예: Anemia/Diabetes 데이터셋 사용 배경).

→ 이 페어가 본 논문에서 의료 (Anemia/Diabetes) + 표준 NLP (SST/IMDB/SNLI 등) 양쪽 도메인을 동시에 다룬 이유가 명확: **의료 영역에서 "어텐션이 모델 해석을 제공한다"는 주장이 부적절한 위험을 초래한다는 도메인 비판이 동기**.

## 근거 지도 (Evidence Map)

본 환경에서 원문 PDF 직접 열람 불가. 대신 (a) 저자 공식 코드 repo README, (b) Wiegreffe-Pinter 2019 후속 rebuttal repo 의 §-단위 매핑, (c) 학계 통용 인용 패턴 으로 위치를 추정. **정확한 Table/Figure 번호는 원문 미확인** 으로 표기하고 단정하지 않는다.

| 항목 | 추정 원문 위치 | 확인 경로 |
|------|---------------|-----------|
| 두 검증 가설 H1·H2 | §1 Introduction (말미) + §3 부각 | rebuttal 의 인용 패턴 |
| feature importance 와 attention 상관 (Kendall τ) | §4 (또는 §4.1) | 저자 repo 의 `correlation_analysis.py` 류 분기 |
| Counterfactual permutation | §5 (또는 §4.2) | repo 의 `permutation_test` 분기 |
| Adversarial attention | §5.4 또는 §6 (rebuttal 의 §4 가 "본 논문의 §5 adversarial 모듈" 대응) | rebuttal 의 §4 명시 |
| 데이터셋 표 | §3 또는 부록 A | repo README 의 데이터 목록 |
| Encoder 구조 (BiLSTM/CNN/avg) + Attention (tanh/dot) | §3 Methods | repo `Transparency` 모듈 명세 |
| 한계·반박 가능성 | §7 Discussion 또는 §8 Conclusion | 학계 통용 위치 |

## 선정 이유 (왜 *지금* 이 논문인가)

내가 현재 active 로 진행 중인 두 트랙 중 **APF (Attention Pattern Fields)** 의 *바로 그 출발 명제* 가 이 논문이다. APF 의 핵심 가설은:

> "PE choice → 어텐션 motif 의 통계적 prior 형성 → motif 가 모델 예측에 *인과적으로* 기여한다"

이 가설은 Jain & Wallace 2019 의 결론 — *"attention 은 설명이 아니다"* — 과 직접 충돌한다. APF 가 학계에서 받아들여지려면 본 논문의 두 비판을 **반드시** 통과해야 한다:

1. **gradient/LOO 상관 비판**: APF 의 motif 패턴이 단순히 frequency artifact 가 아니라 입력 단위에 대한 책임을 가진다는 증거를 제시해야 함.
2. **counterfactual 동치 비판**: 동일 예측을 내는 다른 motif distribution 이 *존재하지 않거나*, 존재한다면 그 차이가 *학습 시 PE 분포* 에서 자연 발생하지 않는다는 강한 주장을 만들어야 함.

추가로 **`_coverage.md`** 기준 `attention-as-explanation` 태그 커버 수 = 1 (오직 TAPPA 의 cross-cover 만 존재). 직격 다이브 논문이 없었음. 또 `_index.md` 의 priority "APF — Attention as Explanation foundation" Tier 의 미커버 항목 중 **시발점** 이 본 논문 — 동일 Tier 의 다른 6편(Wiegreffe-Pinter, Clark, Voita, Abnar-Zuidema, Chefer, Sundararajan) 모두 본 논문에 대한 반응 또는 보완. 시발점부터 시작하는 게 합리적.

Axis balance 측면에서도 최근 5회 코어 출현 = TAPPA(§C) / Nanda(§A·§B) / ACDC(§B) / Power(원거리 §A) / SFC(원거리 §B). **§C 직격이 5월 4일 TAPPA 한 번뿐** 으로 §B 대비 부족 → §C 보강 정당.
