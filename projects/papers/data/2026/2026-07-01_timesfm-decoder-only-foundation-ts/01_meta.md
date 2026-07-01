# 01. 메타 & 선정 이유

## 논문 좌표

- **제목**: A decoder-only foundation model for time-series forecasting
- **저자**: Abhimanyu Das · Weihao Kong · Rajat Sen · Yichen Zhou (Google Research)
- **arXiv ID**: 2310.10688 (v1 2023-10-16 → v4 2024-04-17 publication-ready)
- **DOI / venue**: ICML 2024, PMLR Vol. 235, Das et al. 2024c
- **저자 권위 배경**:
  - Rajat Sen: Amazon Research → Google Research; probabilistic TS forecasting (DeepAR-family 계열 후속) 논문 다수 (예: NeurIPS 2019 "Think Globally, Act Locally: A Deep Neural Network Approach to High-Dimensional Time Series Forecasting").
  - Yichen Zhou: Google Trends 예측 시스템 실무 (블로그·백서). Rajat Sen 과 공저.
  - Abhimanyu Das: Google Research 시계열/확률 forecasting 팀 리더.
  - Weihao Kong: TSMixer (arXiv:2303.06053) 공저 → 채널-일반화 시계열 backbone 계보.
  - 팀 전체가 Google 내부 시계열 예측 인프라(Google Trends, 검색 트래픽 예측, 광고 예측) 을 실무로 굴려온 인력 조합.
- **인용 수**: 본 remote 환경에서 Semantic Scholar API/Google Scholar 페이지 접근 차단으로 정확값 미확인. 2024 년 이후 후속 TSFM 논문(In-Context Fine-Tuning for TSFM arXiv:2410.24087, VisionTS ICML 2025 등) 이 모두 TimesFM 을 primary baseline 으로 인용하고 있으므로 "다수 인용" 은 정성적으로 확인.

## 근거 지도

- **핵심 claim (zero-shot TSFM 가능성)**: 원문 Abstract + §1 Introduction — 저자 GitHub v1 README "zero-shot performance on a variety of unseen datasets comes close to state-of-the-art supervised approaches trained explicitly on these datasets" 로 재인용 확인.
- **아키텍처 (input patching + decoder-only Transformer + output residual block)**: 원문 §3 Model architecture — 저자 README + secondary Medium (Karan Bhutani 2026, Vishnu Sivan 2025) 이 논문 원문의 §3 도표를 verbatim 재인용해 "input patch length of 32, output patch length of 128, 20 layers, 16 attention heads, model dim 1280" 을 명기.
- **Pretraining corpus (100B time-points)**: 원문 §4 Pretraining data — Google Research 블로그 요약 + secondary WebSearch 스니펫으로 "majority from Google Trends search interest + Wikipedia pageviews + synthetic augmentation" 확인.
- **Experiment (GIFT-Eval, Monash, Darts, ETT/Weather, Electricity/Traffic)**: 원문 §5 — 저자 v1 README 의 GIFT-Eval 언급 + Marktechpost/aimultiple 2025 스니펫 교차 확인. **정확한 per-dataset MASE/CRPS 표 수치는 본 환경 PDF 차단으로 원문 미확인.**
- **Quantile head / probabilistic forecast**: 원문 §3.x + Appendix — 저자 v1 README verbatim "focuses on point forecasts. We experimentally offer 10 quantile heads but they have not been calibrated after pretraining." 로 논문 시점 상태 확인. v2.5(2025-09) 에서 30M 파라미터 continuous quantile head 도입은 새 README verbatim 확인 (본 논문 밖 발전이지만 lineage 로 §08 에 표기).
- **Limitations**: 원문 §6 (혹은 Discussion) — 본 환경 PDF 차단으로 정확한 문장 미확인. 저자 README 자기-인정 "quantile head not calibrated" 와 GitHub Issues 논의를 self-reported limit 대체 근거로 사용.

## 선정 이유

1. **Priority 매칭**: `_index.md` "TS Transformer baselines (수요일 인접)" priority 표의 미커버 항목 — TimesFM (arXiv:2310.10688, Das et al. ICML 2024). Tier 1 venue (ICML), Google Research 저자 조합, TSFM 카테고리 대표. 같은 표에서 iTransformer(2026-05-06 ✓), Chronos(2026-04-29 ✓), MOIRAI(2026-06-03 ✓), Tan 2024(2026-06-17 ✓), VisionTS(2026-06-10 ✓)는 이미 커버 완료. TimeMixer(ICLR 2024)와 TimesFM 이 남은 두 후보였고 TimesFM 이 더 대표적 TSFM (**decoder-only + patching + zero-shot** 3-축 구현체) 이므로 우선.
2. **Coverage balance**: `_coverage.md` 수요일 버킷에서 ts-transformer-baseline 5(마지막 6-17), probabilistic-forecast 3(마지막 6-10), fin-ts-dl 1(마지막 5-20) 상태. TimesFM 이 ts-transformer-baseline 을 6 으로 올리는 동시에 실험적 quantile head 로 probabilistic-forecast 를 4 로 cross-count 해서 **2026-07 월간 금융 balance 규칙**(수요일 fin-ts-dl / probabilistic-forecast 중 최소 1 개 월 1회 이상) 을 충족.
3. **APF/Grokking 연결성**: APF main paper §3 motif typology 의 외부 통제 baseline 으로 TimesFM 의 attention pattern 을 관찰 대상에 넣을 수 있다 (frozen 200M 체크포인트 = 실험 비용 낮음). Grokking track 은 TimesFM 의 100B corpus pretraining 이 grokking-free regime (충분 데이터, effective theory 4-phase 중 comprehension) 예시로 vs. 소량-학습 grokking 실험의 대조 substrate.
4. **금융 응용 연결**: paused P1 ProTran-TFA 는 확률 예측 track 인데, TimesFM v1 이 정확히 여기서 self-report 한 한계 ("point forecasts, quantile heads not calibrated") 가 P1 의 차별화 지점 (calibrated quantile via ε-mixture) 을 강화한다. 반대 방향으로 TimesFM v2.5 의 30M continuous quantile head 는 P1 이후 pretrained TSFM 이 어떻게 확률 예측을 흡수하는지 로드맵.

## 오늘 실행 컨텍스트

- 요일: 수요일 (인접 버킷)
- 오늘 확인된 Source Lock 실패 경로: arxiv.org/abs, arxiv.org/pdf, arxiv.org/html/v4, ar5iv, alphaxiv, proceedings.mlr.press/v235/das24c, openreview.net/forum?id=jn2iTJas6h, huggingface.co/google/timesfm-1.0-200m, research.google/blog, mint.univ-reims.fr mirror — 모두 HTTP 403.
- Source Lock 통과 경로: `raw.githubusercontent.com/google-research/timesfm/master/README.md` + `master/v1/README.md` (저자 공식, Apache-2.0 라이선스 하 공개) + 3 회의 WebSearch 로 secondary 인용 교차 확인.
- 정확한 표 절대 수치·figure 캡션·정리 증명 단계는 확보 불가 → 해당 위치는 명시적으로 "원문 확인 필요/원문에 수치 미보고" 로 처리.
