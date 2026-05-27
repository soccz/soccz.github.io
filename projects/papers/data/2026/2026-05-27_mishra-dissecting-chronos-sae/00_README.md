# 00_README — Dissecting Chronos: Sparse Autoencoders Reveal Causal Feature Hierarchies in Time Series Foundation Models

## 표지 & 네비게이션

### 원문 정보

| 항목 | 내용 |
|------|------|
| **원문 제목** | Dissecting Chronos: Sparse Autoencoders Reveal Causal Feature Hierarchies in Time Series Foundation Models |
| **한국어 번역** | Chronos 해부: Sparse Autoencoder가 시계열 파운데이션 모델의 인과적 특징 계층을 드러내다 |
| **저자** | Anurag Mishra |
| **소속** | Rochester Institute of Technology (RIT) |
| **발표처 · 연도** | ICLR 2026 Workshop on Time Series in the Age of Large Models (TSALM), 포스터, 리우데자네이루, 2026 |
| **최초 공개** | arXiv 2026-03-10 |

### Source Lock

| 항목 | 상태 |
|------|------|
| **Canonical identifier** | arXiv:2603.10071 ✅ |
| **공식 원문 URL** | https://arxiv.org/abs/2603.10071 (arXiv) |
| **OpenReview** | https://openreview.net/pdf/1479ada95d2c8d2802f5018310e39961841eac21.pdf |
| **GitHub (공식 코드)** | https://github.com/i-anuragmishra/temporal-monosemanticity (MIT license) ✅ |
| **본문 접근 여부** | ✅ **Source Lock 통과** — arxiv/openreview PDF 직접 접근은 불가(HTTP 403)이나, 저자 공식 GitHub 리포지토리(temporal-monosemanticity)에서 초록 전문, LaTeX 논문 스켈레톤, 실험 데이터(ablation CSV, taxonomy counts), 방법론 코드 전체를 확인. 초록은 검색 스니펫으로 교차 검증. 수치는 raw JSON/CSV 데이터 파일에서 직접 확인. |
| **확인한 정보** | 초록 전문(verbatim), SAE 하이퍼파라미터(d_sae=8,192, k=64, 50k steps, Adam lr=3×10⁻⁴), 6개 추출점 정확한 식별자, 392 ablation raw data(ΔCRPS 테이블 전체), 레이어별 feature taxonomy counts, progressive ablation 곡선, scaling(Mini/Small/Base/Large) |

### 분류

- **주 태그**: `tsfm-interp` (TSFM 해석 가능성)
- **보조 태그**: `sae-features`, `mech-interp-circuits`
- **요일 버킷**: 수요일 (인접)

### 코드 · 데이터 공개

- **공개**: https://github.com/i-anuragmishra/temporal-monosemanticity — MIT 라이선스, Python 95.4%, 실험 raw data 포함

---

## 한 줄 판결

> **"Chronos는 주기보다 돌발 사건을 먹고 산다" — SAE 해부가 최초로 실증한 TSFM 내부 인과 지도는, 파운데이션 모델의 해석 가능성이 NLP에서 TS로 확실히 이식됨을 보여 주며, APF의 '어텐션 패턴 ↔ 예측 기여' 인과 회로 연구에 직접 비교 기준을 제공한다.**

---

## 목차

| 섹션 | 파일 |
|------|------|
| 0. 메타 & 선정 이유 | [01_meta.md](01_meta.md) |
| 1. 3층 TL;DR | [02_tldr.md](02_tldr.md) |
| 2. 문제 지형도 | [03_problem.md](03_problem.md) |
| 3. 핵심 Claim 해체 | [04_claims.md](04_claims.md) |
| 4a. 방법론 — 전체 흐름 | [05_method_a_intuition.md](05_method_a_intuition.md) |
| 4b. 방법론 — SAE 아키텍처 | [05_method_b_sae_architecture.md](05_method_b_sae_architecture.md) |
| 4c. 방법론 — 인과 절제 실험 | [05_method_c_ablation.md](05_method_c_ablation.md) |
| 5. 실험 해부 | [06_experiments.md](06_experiments.md) |
| 6. 가정·한계·반박 | [07_limits.md](07_limits.md) |
| 7. 이론적 계보 | [08_lineage.md](08_lineage.md) |
| 8. 내 연구와의 연결 | [09_my_research.md](09_my_research.md) |
| 9a. 사고 확장 — 자문 질문 | [10_extensions_a_questions.md](10_extensions_a_questions.md) |
| 9b. 사고 확장 — Follow-up | [10_extensions_b_followups.md](10_extensions_b_followups.md) |
| 9c. 사고 확장 — 실험 아이디어 | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) |
| 10. 한 줄 판결 | [11_verdict.md](11_verdict.md) |
