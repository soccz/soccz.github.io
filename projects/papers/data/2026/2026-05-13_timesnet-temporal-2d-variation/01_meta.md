# 01. 메타 & 선정 이유

## 기본 메타

| 항목 | 내용 |
|------|------|
| **제목** | TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis |
| **저자** | Haixu Wu, Tengge Hu, Yong Liu, Hang Zhou, Jianmin Wang, Mingsheng Long |
| **소속** | Tsinghua University — THUML Lab (Mingsheng Long 교수 그룹) |
| **Venue** | ICLR 2023 (International Conference on Learning Representations) |
| **arXiv** | 2210.02186 |
| **OpenReview** | https://openreview.net/forum?id=ju_Uqw384Oq |
| **GitHub** | https://github.com/thuml/TimesNet · Time-Series-Library 통합 |
| **인용 수** | 미확인 (Semantic Scholar 접근 차단) — Tsinghua THUML 그룹의 주요 논문이며 2023년 ICLR 이후 TS 분야에서 매우 높은 인지도를 지님. iTransformer, Chronos 등 후속 논문들이 이 논문을 baseline 또는 비교 대상으로 직접 언급. |

## 근거 지도 (Evidence Map)

| 구성요소 | 출처 |
|---------|------|
| **핵심 Claim**: 1D 시계열 → 2D 변환으로 intraperiod + interperiod 동시 모델링 | 저자 공식 코드 TimesNet.py의 TimesBlock.forward(), FFT_for_Period() |
| **방법론**: FFT 주기 탐지 → reshape → 2D Inception → reshape back → 가중합 | TimesNet.py 전체 (FFT_for_Period, TimesBlock 클래스, Inception_Block_V1) |
| **실험**: 5개 태스크 (장·단기 예측, 결측 보완, 이상 탐지, 분류) SOTA | GitHub README, Time-Series-Library leaderboard (imputation·anomaly 1위 유지) |
| **한계·ablation**: k=3 (imputation/classification/anomaly) vs k=5 (단기 예측); CKA로 계층 표현 분석 | 웹 검색 결과 (스니펳) — 원문 Table 번호 직접 확인 불가 |
| **단기 예측 수치**: M4 SMAPE 11.829, MASE 1.585, OWA 0.851 | 웹 검색 결과 (스니펳) |

## THUML 그룹 이전 작업

Mingsheng Long (뇱밍성) 교수는 도메인 적응 (Deep Adaptation Network, DAN 2015; DANN 2016; CDAN 2018), 전이학습 분야에서 저명. THUML은 이후 시계열 분야로 확장하여:
- Autoformer (Wu et al., NeurIPS 2021) — Auto-Correlation 메커니즘
- FEDformer (Zhou et al., ICML 2022) — Frequency domain decomposition
- TimesNet (ICLR 2023) — 2D transformation
- iTransformer (Liu et al., ICLR 2024 Spotlight) — Inverted attention (이 레포 2026-05-06 해체)

로 이어지는 TS transformer 계열 연구의 중심 그룹.

## 선정 이유

**수요일 인접 버킷, ts-as-2d 태그 0커버 → Priority 목록 매칭**: `_index.md`의 "APF — TS as 2D" 섹션에서 첫 번째 항목 (arXiv:2210.02186, TimesNet). 커버리지 규형상 ts-as-2d는 현재 0회로 가장 뒤즘마닥 태그.

**APF 연결성**: APF 프로젝트의 핵심 아이디어("어텐션 맵을 2D 패턴으로 분석")는 TimesNet의 "1D 시계열을 2D 이미지로 접어 CNN으로 분석"이라는 발상과 **표현 공간(2D)에서 직접 겨친다**. 어텐션 패턴이 왜 특정 2D 구조를 갖는가를 설명하는 데 "시계열이 2D로 접히면 어떤 구조가 드러나는가"는 선행 질문이다.

**Grokking 연결성**: TimesNet이 GELU + LayerNorm + residual을 사용하는 Transformer-like 구조이며, 여러 주기 성분을 동시에 학습한다는 점에서, "주기 성분을 FFT 기반으로 hardcode하는 것 vs Transformer가 스스로 주기를 학습하는 것"의 대비가 Grokking 트랙의 "latent frequency learning" 논의와 직접 연결된다.
