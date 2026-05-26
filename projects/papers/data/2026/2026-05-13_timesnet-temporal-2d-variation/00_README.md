# TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis

> **🧒 한 줄 요약**: 본 deep dive 입구 — 16 + 7 chapters. TimesNet = pre-TFM specialist 시대 의 peak.


## 원문 정보

| 항목 | 내용 |
|------|------|
| **원문 제목** | TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis |
| **한국어 제목** | TimesNet: 일반 시계열 분석을 위한 시간적 2D 변화 모델링 |
| **저자** | Haixu Wu, Tengge Hu, Yong Liu, Hang Zhou, Jianmin Wang, Mingsheng Long |
| **소속** | 청화대학교 (Tsinghua University) — THUML 연구실 (Mingsheng Long 교수 그룹) |
| **발표처** | ICLR 2023 (International Conference on Learning Representations) |
| **Canonical identifier** | arXiv:2210.02186 |
| **OpenReview** | https://openreview.net/forum?id=ju_Uqw384Oq |
| **GitHub** | https://github.com/thuml/TimesNet |

## Source Lock

| 항목 | 상태 |
|------|------|
| Canonical identifier | ✓ arXiv:2210.02186 — GitHub citation, OpenReview 포럼, 복수 검색 결과로 확인 |
| Metadata match | ✓ 제목·저자·연도·ICLR 2023 venue — 공식 GitHub citation 및 검색 결과로 일치 확인 |
| Full text access | ✓ 공식 GitHub 저자 코드 TimesNet.py 전문 + README 전문 확인. 논문 PDF arXiv/OpenReview 직접 접근 차단됨 — 저자 공식 코드로 메서드 전체를 독립 확인. 검색 결과에서 실험 수치 일부 확인 |
| Evidence map | ✓ FFT_for_Period(코드), TimesBlock reshape 1D→2D(코드), Inception Block(코드), k=3/5 ablation(검색), CKA 분석(검색), M4 단기 예측 SMAPE 11.829(검색) |

## 태그

- **주 태그**: `ts-as-2d`
- **보조 태그**: `ts-transformer-baseline`, `tsfm-interp`, `non-stationarity-ts`

## 코드·데이터 공개 여부

공개 — 저자 공식 GitHub (thuml/TimesNet) 및 Time-Series-Library 통합 구현 제공.

---

## 한 줄 판결

> **"1D 시계열을 2D 이미지로 접어 CNN으로 보는 것"이라는 발상은 단순하지만 강력하다 — 단, 주기가 없는 금융 시계열에서는 FFT가 거짓 주기를 잡을 위험이 있으며, APF 프로젝트에서는 "2D 어텐션 맵이 시계열 구조를 어떻게 인코딩하는가"라는 질문과 직접 교차한다.**

---

## 목차

| 파일 | 내용 |
|------|------|
| [01_meta.md](01_meta.md) | 0. 메타 & 선정 이유 |
| [02_tldr.md](02_tldr.md) | 1. 3층 TL;DR |
| [03_problem.md](03_problem.md) | 2. 문제 지형도 |
| [04_claims.md](04_claims.md) | 3. 핵심 Claim 해체 |
| [05_method_a_intuition.md](05_method_a_intuition.md) | 4a. 방법론 큰 그림 |
| [05_method_b_fft_period.md](05_method_b_fft_period.md) | 4b. FFT 주기 탐지 |
| [05_method_c_2d_reshape.md](05_method_c_2d_reshape.md) | 4c. 1D→2D 변환 & Inception |
| [06_experiments.md](06_experiments.md) | 5. 실험 해부 |
| [07_limits.md](07_limits.md) | 6. 가정·한계·반박 |
| [08_lineage.md](08_lineage.md) | 7. 이론적 계보 |
| [09_my_research.md](09_my_research.md) | 8. 내 연구와의 연결 |
| [10_extensions_a_questions.md](10_extensions_a_questions.md) | 9a. 자문 질문 5개 |
| [10_extensions_b_followups.md](10_extensions_b_followups.md) | 9b. Follow-up 논문 3편 |
| [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 9c. 실험 아이디어 2개 |
| [11_verdict.md](11_verdict.md) | 10. 한 줄 판결 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **본 deep dive 의 권장 학습 path?**
2. **TimesNet 의 *pre-TFM specialist 시대 peak* 의 의미?**
3. **2024 TFM era 에서 TimesNet 의 *enduring value*?**

### 답변

1. **선형 path**: 02 → 03 → 05a→c → 06 → 17. 시간 부족 시 02 + 05b + 06 + 11 핵심.

2. **Specialist 시대 4-task SOTA**. Pre-TimesNet의 task-specific architectures → TimesNet 의 *general backbone + task heads* 의 *first compelling demonstration*. 후속 TFM 의 generality 의 *direct precursor*.

3. **Per-task fine-tuning 의 *production deployment* value**. TFM 의 zero-shot 좋지만 *critical accuracy* 에서는 *per-task specialist* 가 *수 percent 우위*. TimesNet 의 *small + flexible* = *cost-effective production*.
