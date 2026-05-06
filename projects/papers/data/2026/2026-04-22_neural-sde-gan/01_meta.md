# 01 · 메타 & 선정 이유

## 기본 서지

| 항목 | 내용 |
|------|------|
| 제목 | Neural SDEs as Infinite-Dimensional GANs |
| 저자 | Patrick Kidger, James Foster, Xuechen Li, Harald Oberhauser, Terry Lyons |
| 학회 | ICML 2021 (Proceedings of the 38th ICML, PMLR 139) |
| arXiv | 2102.03657 (제출: 2021-02-07) |
| 인용 수 | ≈ 430+ (Semantic Scholar 접근 차단 — arXiv 제출 이후 3년간 공개 인용 기록 기준, 미확인) |

---

## 저자 권위

**Patrick Kidger** (1저자)는 Oxford Mathematical Institute에서 Terry Lyons 지도 하에 박사를 마치고 Google Brain으로 이동한 연구자다. 이전 작업인 **Neural CDEs (arXiv:2005.08926, NeurIPS 2020)**는 불규칙 시계열을 위한 연속-시간 순환 모델의 이론적 기초가 되었으며, ContiFormer(arXiv:2402.10635)가 직접 이 방법론 위에 구축된 만큼 사용자의 연구와 직접 연결된다.

**Terry Lyons**는 러프 경로 이론(rough path theory)의 창시자로, 확률과정의 경로 공간 분석에서 세계 최고 권위자이다. 이 논문은 그의 러프 경로 언어를 머신러닝으로 가져오는 작업의 핵심 결과물이다.

**James Foster**는 고차 확률미분방정식 수치해법(Runge-Kutta 형태의 SDE solver)을 전문으로 하며, 이 논문에서 SDE 학습의 실용적 안정성을 책임진다.

---

## 선정 이유

오늘(2026-04-22, 수요일 · 인접 버킷)은 `_coverage.md`의 인접 태그 5개가 모두 커버 수 0으로 동률이다. 그 중 **`neural-sde`**를 우선 선정한 이유는 세 가지다:

1. **코어 연결 최단 경로**: 이 논문의 판별자는 **Neural CDE**이고, 사용자의 core 논문 ContiFormer도 Neural CDE 위에 구축된다. 즉 동일한 이론 베이스를 공유하면서도 생성 방향으로 확장하므로, 코어 지식이 그대로 활용된다.

2. **Paper 4 직접 연관**: "Continuous Economic Time Attention"에서 ODE 시간변수를 economic time $\tau(t)$로 교체하는 작업은 결국 *시간-변환된 확률과정*의 수학이다. 이 논문이 다루는 SDE의 드리프트·확산 함수에 시간 변환을 적용하는 방식은 Paper 4의 이론 섹션에서 직접 참조할 수 있다.

3. **인접 태그 중 재현성 최고**: 코드가 `torchsde` 라이브러리로 공개되어 있어, 논문에서 논의한 수식을 직접 실험으로 검증할 수 있다.
