# 00. TimesFM — A decoder-only foundation model for time-series forecasting

## 원문 메타

- **원문 제목**: *A decoder-only foundation model for time-series forecasting*
- **한국어 번역**: *시계열 예측을 위한 디코더 전용 파운데이션 모델*
- **저자·소속**: Abhimanyu Das, Weihao Kong, Rajat Sen, Yichen Zhou (Google Research)
- **발표처**: ICML 2024 (International Conference on Machine Learning, PMLR v235)
- **Canonical identifier**: **arXiv:2310.10688** · 저자 공식 GitHub `google-research/timesfm` (Apache-2.0) · Google Research 블로그 · HuggingFace Collection `google/timesfm-release-66e4be5fdb56e960c1e482a6`

## Source Lock

- **Canonical identifier 확정**: arXiv:2310.10688 (저자 공식 GitHub README + v1 README + Google Research 블로그가 모두 이 arXiv ID 를 논문의 유일 canonical source 로 표기).
- **Metadata match**: 제목·저자 4인·연도(2024)·venue(ICML 2024) 모두 저자 공식 GitHub README verbatim 문구 "Paper: [A decoder-only foundation model for time-series forecasting](https://arxiv.org/abs/2310.10688), ICML 2024." 및 v1 README verbatim "Paper: … to appear in ICML 2024" 로 확인.
- **Full text access**: 본 remote 환경에서 arXiv abs/PDF/`arxiv.org/html/2310.10688v4`/ar5iv/alphaxiv/`proceedings.mlr.press/v235/das24c`/`openreview.net/forum?id=jn2iTJas6h`/HuggingFace 모델 카드/Google Research 블로그 모두 **HTTP 403 Forbidden 차단**. 대체 소스로 `raw.githubusercontent.com/google-research/timesfm/master/README.md`(143줄) 및 `master/v1/README.md`(313줄) 두 README 를 verbatim 로드 성공 — 아키텍처(input residual block + patched decoder-only Transformer + output residual block), 체크포인트 세부(1.0-200m: context 512 · input_patch_len 32 · output_patch_len 128 · num_layers 20; 2.0-500m: context 2048 · num_layers 50), frequency 카테고리(0/1/2), quantile head 상태("focuses on point forecasts. We experimentally offer 10 quantile heads but they have not been calibrated after pretraining."), GIFT-Eval TimesFM-2.0 aggregated MASE 우승("6% better than the next best model") 등 확인. 추가로 WebSearch 로 나온 secondary 스니펫(Medium/TowardsAI/MarkTechPost 등)에서 논문 본문 인용 "input patch length of 32, output patch length of 128", "20 layers, 16 attention heads, model dimension 1280", "100B time-points, majority from Google Trends and Wikipedia pageviews" 을 교차 확인. **본문 PDF 표 절대 수치(per-dataset MASE/CRPS, Table 1–8 의 정확한 값), Appendix hyperparameter sweep, ablation 표 정확 값, Figure 캡션 원문, Limitation 절 정확한 문장은 본문 PDF 차단으로 인해 단정하지 않고 "원문에 수치 미보고/원문 확인 필요"로 표기.**
- **Evidence map**:
  - Method §3 (아키텍처): input patching + residual block + stacked decoder-only Transformer + output residual block → v1 README + secondary Medium 인덱스 verbatim
  - Method §3.x (frequency 카테고리): {0: T·MIN·H·D·B·U, 1: W·M, 2: Q·Y} → v1 README verbatim
  - Method §3.x (quantile head): 실험적 10-quantile head 미보정 → v1 README verbatim
  - Pretraining §4 (corpus): 100B real-world time-points (Google Trends + Wikipedia pageviews 다수 + synthetic augmentation) → 블로그 요약 verbatim
  - Experiments §5 (모델 크기): 200M (2.5) / 500M (2.0) / 200M (1.0) → README verbatim
  - Zero-shot benchmark: GIFT-Eval TimesFM-2.0 → aggregated MASE #1 → v1 README verbatim
  - Limitations: 본문 PDF 절 접근 불가 → 저자 공식 README 의 "experimentally offer quantile heads … not calibrated" 를 self-reported limit 으로만 사용

## 태그

- 주 태그: **ts-transformer-baseline** (수요일 인접, Priority Tier 1 uncovered 매칭)
- 보조 태그: **probabilistic-forecast** (v2.5 continuous quantile head + v1/v2 실험적 10-quantile head 정보) → 이 논문으로 **2026년 7월 수요일 금융 balance 규칙 충족 (probabilistic-forecast 월 1회 이상 조건)**
- 보조 태그: **tsfm-interp** (frequency 카테고리·input patching 이 이후 Chronos/MOIRAI/VisionTS 계보의 tokenization·conditioning 해석 기반)

## 코드·데이터 공개

Apache-2.0. 저자 공식 GitHub `google-research/timesfm` (PyPI: `pip install timesfm[torch]` / `[flax]` / `[xreg]`). HuggingFace 3 체크포인트 (`google/timesfm-1.0-200m(-pytorch)`, `google/timesfm-2.0-500m-{jax,pytorch}`, `google/timesfm-2.5-200m-pytorch`). BigQuery ML · Google Sheets · Vertex Model Garden 로 1P 제품 통합. 학습 코퍼스(Google Trends + Wiki pageviews 100B time-points)는 라이선스 사정으로 공개 안 됨 → 재현 불완전.

## 한 줄 판결

TimesFM 은 "패치를 토큰처럼 다루는 디코더 전용 Transformer"라는 언어 모델 문법을 시계열에 최소 손실로 이식해서 100B time-points 코퍼스만으로 zero-shot 성능을 supervised SOTA 근처까지 밀어올린 **TSFM 패러다임의 최소 골격**이지만, 확률 예측 모듈이 논문 시점(2024)에는 미보정·실험적 부속물이었고 학습 코퍼스가 비공개라 재현이 부분적이라는 두 약점이 있다 — APF/Grokking track 의 attention motif 관찰용 zero-shot substrate 로는 iTransformer/Chronos/MOIRAI 와 함께 3-4번째 채점판이지만, ProTran-TFA 같은 정직한 확률 예측 track 에 그대로 이식할 수는 없다.

## 목차

- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_patching.md](05_method_b_patching.md) — 방법론: 입력 패칭 & residual block
- [05_method_c_decoder_transformer.md](05_method_c_decoder_transformer.md) — 방법론: 디코더 전용 Transformer 코어
- [05_method_d_output_head.md](05_method_d_output_head.md) — 방법론: 출력 패치 헤드 & 자동회귀 확장
- [05_method_e_pretraining.md](05_method_e_pretraining.md) — 방법론: 100B 코퍼스 & 학습 설정
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 사고 확장: 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — 사고 확장: Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 사고 확장: 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
