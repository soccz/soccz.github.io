# 0. 메타 & 선정 이유

## 서지 요약

- **저자·소속**: Bryan Lim (당시 Oxford-Man Institute 박사과정 → Google Cloud AI Research 이동 시점의 저작), Sercan Ö. Arık, Nicolas Loeff, Tomas Pfister — 후자 3 인은 Google Cloud AI Research 정규 소속. Arık는 TabNet(2019, tabular deep) 저자이자 Google Brain 알럼나이의 tabular DL 스페셜리스트. Pfister는 Google Cloud AI Research 리드로 interpretable ML의 실무 방향을 주도해 온 시니어.
- **canonical identifier**: arXiv:1912.09363 (v1 2019-12-19, v3 2020-09-27) · DOI:10.1016/j.ijforecast.2021.03.012 · IJF 37(4) 1748-1764 (2021)
- **venue tier**: *International Journal of Forecasting* (IJF) — 예측(forecasting) 도메인의 top venue, Tier 3 도메인-top. Elsevier 발간, 국제예측협회(IIF) 오피셜 저널. 순수 ML 컨퍼런스 기준 Tier 1/2 는 아니지만, forecasting 분과에서는 최상위. arXiv 는 2020년 v3 가 IJF 게재 직전 확정본과 사실상 동일.
- **인용 수**: Google Scholar 기준 수천 회 (본 환경에서 Semantic Scholar/GS 스니펫 차단으로 정확 수치 미확인 — "미확인, 다만 IJF forecasting 논문 중 지난 10년 최다 인용급"). NeuralForecast·PyTorch Forecasting·Darts·Nixtla 등 오픈소스 forecasting 라이브러리 전부가 TFT를 표준 baseline 으로 탑재.

## 근거 지도 (evidence map)

- **핵심 claim (해석 가능성 + 고성능)**: 저자 공식 README + arXiv abstract verbatim + IJF §1 Introduction 요약 verbatim
- **방법론 수식 (VSN/GRN/attention/quantile)**: WebSearch 로 찾은 GRN 정확 수식 verbatim + Google Research 블로그/Emergent Mind 스니펫 verbatim + Nixtla/PyTorch Forecasting 재현 문서로 확인 (본문 정확 절 번호 §4.1-4.7 은 본문 PDF 차단으로 절 번호 단정 안 함)
- **실험 수치 (Electricity/Traffic/Volatility/Retail q-Risk)**: MQTransformer 논문 (KDD MILETS 2022) 의 Table 9 참조 verbatim + N-BEATS 논문 참조 + Google Research 블로그 발표 요약 verbatim — 다만 원 TFT 논문 Table 1-4 절대 소수점 은 단정 안 함
- **한계·재현성**: 저자 공식 GitHub README 의 script_download_data.py / script_train_fixed_params.py / script_hyperparam_opt.py 3-스크립트 워크플로우 + hyperparameter iter 수 (Volatility 240, Traffic 60, others 60 default) verbatim + Apache-2.0 라이선스

## 선정 이유 (지금 이 시점에 왜 봐야 하는가)

1. **`_coverage.md` 뒤처짐 태그**: 수요일 인접 버킷의 `fin-ts-dl` 이 1 회 (2026-05-20 MASTER 이후 7 주 공백) — 뒤처진 태그 최우선 원칙. TFT의 Volatility(OMI 실현 변동성) 실험이 금융 시계열 딥러닝의 **표준 baseline** 이라 fin-ts-dl 태그로 배정 정당.
2. **금융 balance 규칙**: 수요일 fin-ts-dl / probabilistic-forecast 중 월 1 회. 7 월은 07-01 TimesFM (probabilistic cross)이 있었지만 fin-ts-dl 전용은 07 월 아직 0회. TFT 는 두 태그 모두 커버 (Volatility + quantile pinball loss).
3. **Priority 매칭 (약)**: `_index.md` "TS Transformer baselines (수요일 인접)" 명단에는 TFT 미명시. 그러나 tsfm-interp 정신 ("Interpretable" 이 원 제목에 명시)에 부합하며, 사용자 자산 P1 ProTran-TFA (`paper_test/PAPER_DRAFT_V1.md`)의 direct 참조. 사용자 프로파일 §D + §E 걸침.
4. **사용자 자산 직결 3-축**:
   - **P1 ProTran-TFA (paused)**: ProTran (NeurIPS 2021) 은 TFT 이후의 probabilistic transformer 진화 단계. TFT 는 P1 논문의 "baseline 3순위" 필수 후보 — 지금 정리 안 하면 finance venue (IJF/QF) 재개 시 필수 인용에서 늦음.
   - **APF main track**: TFT 의 "Interpretable Multi-Head Attention" 은 head 를 서로 다른 weight 로 두는 대신 head 간 **weight sharing on values** 로 통합하는 변형 — APF motif 분류 방법론이 direct 대상으로 삼을 head-level attention 구조. Jain-Wallace 2019 반박 (attention ≠ explanation) 이 이 attention head 해석의 근본적 한계로 이어짐.
   - **Grokking track**: TFT의 5-input 인터페이스 (static covariate / known future / observed past / target / horizon)는 non-stationarity가 유입되는 지점을 명시적으로 갈라놓은 API — Grokking-under-non-stationarity 실험 설계 시 "어떤 축에서 shift 가 들어오는가"를 구분해서 통제할 표준 참조.
5. **저자 반복 규칙**: Bryan Lim은 이 논문 이후 Momentum Transformer (Wood·Lim·Zohren·Roberts 2022) 저자로 이어짐 — Deep RL for Trading (Zhang·Zohren·Roberts 2020) 이 2026-07-03 커버라 Zohren 반복 우려가 있으나, TFT 는 Zohren 이 저자 아님 (Oxford-Man 지도교수 계열이지만 원 논문 저자 명단에는 없음). 규칙 충돌 없음.
