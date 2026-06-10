# 00 · README — VisionTS: Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters

> **원문 제목**: VisionTS: Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters
> **한국어 번역(작업명)**: 시각 MAE는 공짜 점심급 제로샷 시계열 예측기다

## 저자·소속
- **저자**: Mouxiang Chen, Lefei Shen, Zhuo Li, Xiaoyun Joy Wang, Jianling Sun, Chenghao Liu
- **소속**: Zhejiang University · State Street Technology · Salesforce Research Asia
  - State Street 는 미국 자산운용·수탁 대형사 → 본 논문은 학계-금융 IT 합작이라는 점이 **인접 버킷의 fin 연결성 보너스** 다. 다만 본 환경에서 PDF 본문에 직접 접근 못 했으므로 financial application 의 직접 내용을 본문에서 단정하지는 않는다.

## 발표처·식별자
- **Canonical identifier**: arXiv:2408.17253
- **Venue**: ICML 2025 Poster (icml.cc/virtual/2025/poster/46441)
- **OpenReview**: forum?id=5DSj3MfWrB (ICML 2025 submission)
- **Code (공식)**: https://github.com/Keytoyze/VisionTS  · PyPI: `pip install visionts`
- **Hugging Face papers**: huggingface.co/papers/2408.17253
- **확장 후속**: VisionTS++ (arXiv:2508.04379, 2025-08, 동일 저자) — 본 해체에서는 다루지 않음

## Source Lock 기록

본 환경에서 arXiv abs/HTML/PDF, ar5iv, alphaxiv, OpenReview forum/PDF, ICML virtual page, Semantic Scholar, ADS, 저자 개인 PDF 모두 **HTTP 403/404 차단**. 따라서 이전 인덱스의 THP(2026-06-05) / Kazemnejad(2026-06-08) 패턴을 따라 **저자 공식 GitHub 저장소 (Keytoyze/VisionTS) 의 README + 코드 fragment + WebSearch abstract 인덱스 verbatim** 으로 Source Lock 을 통과했다. 본 해체에서 단정하는 모든 내용은 다음 근거에 기반한다:

1. **README.md (verbatim)** — citation BibTeX, 4-grade 벤치마크 그룹(Long-term TSF 6 / Monash 29 / PF 6+3-proprietary / Full-shot 8), 공식 venue 표시 (ICML 2025), PyPI 패키지 명, GIFT-EVAL #1 zero-shot point forecasting (MASE) 주장(2024-11 기준).
2. **`visionts/model.py` (코드 summary verbatim)** — VisionTS / VisionTSpp 클래스, `forward()` 의 TS→image 파이프라인 6 단계 (normalize → segmentation einops.rearrange `b n (p f) -> b n f p` → render input_resize → 입력·예측 영역 horizontal concat to 224×224 → MAE decoder 재구성 → unpatchify+resize+denormalize), `image_size=224`, `patch_size∈{14,16}`, `num_patch=image_size//patch_size`, `periodicity` 하이퍼파라미터, `mask_ratio=num_patch_input/num_patch`, norm_const=0.4.
3. **`visionts/models_mae.py` (코드 summary verbatim)** — `MaskedAutoencoderViT` 기본값 `img_size=224, patch_size=16, in_chans=3, embed_dim=1024, depth=24, num_heads=16, decoder_embed_dim=512, decoder_depth=8, decoder_num_heads=16, mlp_ratio=4., norm_pix_loss=False, quantile=False`, 3 변형(Base 768/12/12, Large 1024/24/16, Huge 1280/32/16), 모두 decoder 512/8/16, VisionTSpp 의 `quantile_head_num=9`.
4. **`long_term_tsf/run.py` (코드 summary verbatim)** — TSlib 포크 기반, 5 태스크(long/short forecasting, imputation, anomaly, classification), default args (`learning_rate=0.0001, batch_size=32, train_epochs=10, patience=3, lradj='type1', d_model=512, n_heads=8, e_layers=2, d_layers=1, dropout=0.1`).
5. **WebSearch abstract 인덱스 (Towards Data Science / aimodels.fyi / HuggingFace Papers 의 verbatim 발췌)** — "reformulating TSF as an image reconstruction task", "visual masked autoencoder pre-trained on ImageNet", "free-lunch zero-shot", "comparable or superior to zero-shot TS-based models".

본문 PDF 의 **정확한 절대 표 수치(MASE/MSE/MAE 절대값, 베이스라인 대비 ranking 외 구체 정수)** 는 확인할 수 없었으므로 06_experiments.md 에서는 "원문 표 확인 불가, README 의 비교 ranking 으로만 단정" 으로 솔직히 처리한다.

## 태그
- 주: `ts-as-2d` (가장 뒤처진 태그, 마지막 2026-05-13 TimesNet)
- 보조: `ts-transformer-baseline`, `tsfm-interp`, `non-stationarity-ts`(zero-shot OOD), `fin-ts-dl`(State Street 공저, 금융 IT 맥락)

## 코드·데이터 공개 여부
- 코드: 공개 (MIT, github.com/Keytoyze/VisionTS, PyPI `visionts`)
- 데이터: 공개 벤치마크 (Monash 29 자동 다운로드 · LTSF 6 ETT/Weather/ECL/Traffic 표준 · PF Walmart/Istanbul Traffic/Turkey Power)

## 한 줄 판결 (11번 섹션과 동일)
**"시계열의 'image 화 → MAE 재구성' 은 NLP-foundation·TS-foundation 경로 외에 제 3 의 free-lunch 경로가 있음을 실증한 ICML 2025 mark — APF 의 attention motif 비교를 cross-modal 로 확장할 수 있는 강한 hook 이지만, periodicity 하이퍼파라미터(FFT 자동탐지 아님) · 224×224 고정 이미지 사이즈 · 단변량 평균 channel 처리 등 세 가지 구조적 가정이 향후 비정상·고변량 도메인에서 무너질 가능성을 검토해야 한다."**

## 목차 (모든 섹션 파일)
- [00_README.md](00_README.md) — 본 표지
- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론 ① 큰 그림
- [05_method_b_ts2img.md](05_method_b_ts2img.md) — 방법론 ② TS → image 변환
- [05_method_c_mae_backbone.md](05_method_c_mae_backbone.md) — 방법론 ③ MAE 백본·재구성
- [05_method_d_inference.md](05_method_d_inference.md) — 방법론 ④ 추론·미세조정·구현
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정·한계·반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결 (APF / Grokking / P1 ProTran-TFA)
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
