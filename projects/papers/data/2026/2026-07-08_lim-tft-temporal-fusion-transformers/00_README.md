# Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting

**해체 표지 (00_README)**

## 원문 서지

- **원문 제목**: Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting
- **한국어 번역**: 해석 가능한 다시계열-지평 예측을 위한 시간융합 트랜스포머
- **저자**: Bryan Lim, Sercan Ö. Arık, Nicolas Loeff, Tomas Pfister (Google Cloud AI Research; Bryan Lim은 당시 Oxford-Man Institute 겸직에서 Google로 이동)
- **발표처·연도**: *International Journal of Forecasting (IJF)* 37(4), 1748–1764 (2021). arXiv preprint 첫 등장 2019-12-19, v3 2020-09-27.
- **Canonical identifier**: arXiv:1912.09363 · DOI:10.1016/j.ijforecast.2021.03.012 · ScienceDirect PII S0169207021000637 · Google Research page
- **코드**: `google-research/google-research/tft` (Apache-2.0, TF1.x 기반) — 저자 공식. PyTorch 계열 재현체는 PyTorch Forecasting, Nixtla neuralforecast 등에 다수 이식.
- **데이터**: (1) Electricity Load Diagrams (UCI 370 clients), (2) PEM-SF Traffic (UCI 963 sensors), (3) OMI Realized Volatility (31 stock indices, daily), (4) Favorita Grocery Sales (Kaggle). 4종 모두 공개.

## Source Lock

- **본 환경 접근성**: arXiv abs/PDF/ar5iv/alphaxiv/HuggingFace papers/ScienceDirect/Semantic Scholar/researchgate/personal.soton PDF/Google Research pubs page 모두 HTTP 403 차단.
- **접근한 원문 소스**: (i) 저자 공식 `google-research/google-research/tft` GitHub README verbatim (paper URL·저자·데이터셋·하이퍼파라미터 반복 횟수·모듈 구조 확인), (ii) WebSearch verbatim 인덱스 6회 — abstract 원문 verbatim + GRN 수식 verbatim ("GRN_ω(a, c) = LayerNorm(a + GLU_ω(η₁)), GLU(η₁) = σ(W₁η₁+b₁) ⊙ (W₂η₁+b₂), η₁ = W₃η₂+b₃, η₂ = ELU(W₄a+W₅c+b₄)") + IJF 서지 (37(4) 1748-1764 2021) + Volatility 예측 지평 "next week (5 business days)" verbatim + Retail 지평 "30 days into the future, using 90 days of past information" verbatim + N-BEATS 대비 quantile loss 개선 "3-26% improvement" verbatim.
- **본문 PDF 표 절대 수치는 단정 안 함**: Table 1-4 의 정확한 q-Risk 소수점 값 (P50/P90), Table 5-6 의 ablation 정확 수치, Table 7-8 의 hyperparameter grid 정확한 값, Figure 5-8 캡션 원문, Appendix D의 optimization 세부, seed 통계 σ 는 본문 PDF 차단으로 단정 안 함.

## 태그

- **1차**: `fin-ts-dl` (금융 시계열 딥러닝 — 뒤처진 태그 우선; OMI Volatility 데이터셋 + 사용자 P1 ProTran-TFA 직결)
- **보조**: `tsfm-interp` (VSN/attention head interpretability), `probabilistic-forecast` (quantile output τ ∈ {0.1, 0.5, 0.9})
- **버킷**: 수요일 인접 (`_profile.md` §D + §E)

## 한 줄 판결

**TFT는 "해석 가능성"을 attention·gating·quantile 세 축에 심어 놓았지만, 그 셋 모두 attention-is-not-explanation 계보의 반박에 노출되어 있다 — 실무 표준으로 남을 만큼 강력하지만, mechanistic interpretability 관점에서는 attribution 이 causal intervention 없이 correlation-attribution 수준에 머물러 있음을 명시하고 인용해야 한다.**

(자세한 이유는 `11_verdict.md`.)

## 목차 (섹션 파일 링크)

- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론 A: 5개 입력 소스와 큰 그림
- [05_method_b_vsn.md](05_method_b_vsn.md) — 방법론 B: Variable Selection Network
- [05_method_c_grn.md](05_method_c_grn.md) — 방법론 C: Gated Residual Network
- [05_method_d_lstm_static.md](05_method_d_lstm_static.md) — 방법론 D: LSTM 인코더-디코더 + 정적 공변량 인코더
- [05_method_e_attention.md](05_method_e_attention.md) — 방법론 E: Interpretable Multi-Head Attention
- [05_method_f_quantile.md](05_method_f_quantile.md) — 방법론 F: Quantile 출력 + Pinball 손실
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 사고 확장 A: 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — 사고 확장 B: Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 사고 확장 C: 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결

---
