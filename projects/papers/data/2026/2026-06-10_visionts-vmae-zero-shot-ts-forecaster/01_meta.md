# 01 · 메타 & 선정 이유

## 기본 메타

- **인용 수**: 본 환경에서 Semantic Scholar 차단으로 정수 미확인. WebSearch 결과 페이지에서 "GIFT-EVAL 2024-11 zero-shot point forecasting (MASE) #1, surpassing Moirai/TimesFM/Chronos" 라는 모델 ranking 만 확인. 정확한 citation count 는 "원문/SS 미확인" 으로 처리한다.
- **DOI / canonical**: arXiv:2408.17253 (v1 2024-08-29, 최신 v3 까지 확인). ICML 2025 official poster 46441. OpenReview submission ID 5DSj3MfWrB. PMLR v267 proceedings 페이지 자체는 차단되어 PMLR DOI 미확인.
- **저자 권위 배경**:
  - Mouxiang Chen (Zhejiang Univ) — TS-related ML / foundation model 연구. 본 논문이 ICML 2025 accept.
  - Lefei Shen (Zhejiang Univ).
  - Zhuo Li, Xiaoyun Joy Wang (저자 리스트). Joy Wang 은 State Street Technology 소속 (BibTeX/GitHub 공저 표기에서 확인).
  - Jianling Sun (Zhejiang Univ, 시니어). 시계열·DL 연구 그룹 시니어.
  - Chenghao Liu (Salesforce Research Asia) — MOIRAI(2024 인덱스 06-03), Time-Series-Library 계열에 깊이 관여한 코어 저자. 본 인덱스 안에서 MOIRAI 와 Chronos 사이를 잇는 "Salesforce TS foundation model 그룹" 코어이다.
  - 즉 저자진은 **(a) TS foundation model 최전선 (Liu)** + **(b) 대형 금융 IT (State Street, Wang)** + **(c) Zhejiang ML 그룹** 의 3 자 협업.
- **공개**: 코드 (MIT, github.com/Keytoyze/VisionTS, PyPI `visionts`), 모델 가중치는 ImageNet pre-trained MAE checkpoint 를 외부에서 로딩 (Facebook MAE 공식 weight).

## 근거 지도 (Evidence Map)

본 환경에서 본문 PDF 차단 → 다음 근거 위치로 매핑한다:

| 항목 | 출처 | 위치 |
|---|---|---|
| 핵심 claim (image MAE = zero-shot TS forecaster) | README abstract / WebSearch verbatim 발췌 | README 1단 + abstract 1번째 문장 |
| TS→image 파이프라인 6 단계 | `visionts/model.py` `forward()` 코드 fragment | `b n (p f) -> b n f p` einops + horizontal concat to 224×224 |
| MAE 아키텍처 default | `visionts/models_mae.py` `MaskedAutoencoderViT.__init__` | embed_dim=1024 / depth=24 / heads=16 (Large) |
| 4-grade 벤치마크 그룹 | README "Evaluation" 섹션 | Long-term TSF 6 / Monash 29 / PF 6+3-proprietary / Full-shot 8 |
| training defaults | `long_term_tsf/run.py` argparse 기본값 | `lr=1e-4, bsz=32, epochs=10, patience=3, lradj='type1'` |
| zero-shot ranking 주장 | README "Key Achievement" 단락 | "GIFT-EVAL #1 zero-shot point forecasting (MASE), 2024-11" |
| 한계 (다음 PR / VisionTS++) | 후속 arXiv:2508.04379 의 motivation | multi-channel / probabilistic 확장 = 본 논문의 가정에서 출발 |

**확인 불가 영역**: PDF Table 1~6 의 절대 수치 (MASE/MSE/MAE/CRPS 정수), Appendix 의 정리 증명, Figure 의 attention map / image reconstruction 시각화, Related Work 의 정확한 인용 범위, Limitation 절의 자기 명시. 이들은 본 해체에서 "원문 미확인" 으로 명시한다.

## 왜 지금 이 논문인가 (선정 이유 — `_profile.md` 와 연결)

1. **`_coverage.md` 기준 `ts-as-2d` 가 가장 뒤처진 태그** (커버 수 1, 마지막 2026-05-13 TimesNet). 인접 버킷 5 개 태그(ts-as-2d, fin-ts-dl, tsfm-interp, ts-transformer-baseline, non-stationarity-ts) 중에서 ts-as-2d 와 fin-ts-dl 둘 다 1 점인데, **VisionTS 는 ts-as-2d 직격 + tsfm-interp/ts-transformer-baseline cross + State Street 공저로 fin 맥락까지 자연스럽게 잇는다.**
2. **§D (TS Transformers / 2D / TSFM Interp)** 의 정확한 교집합 논문이다. TimesNet 이 "FFT top-k → reshape 2D → Inception 2D CNN" 으로 TS 자체를 학습하는 방향이라면, VisionTS 는 **"image MAE 의 pretrained weight 를 그대로 받아서 TS 를 그 위에 얹는다"** — pretraining domain transfer 라는 한 단계 더 강한 주장. 코어 TS foundation model 5 종(Chronos, iTransformer, MOIRAI, TimesNet, PatchTST) 을 이미 다뤘기 때문에 **"이 5 종 외 4 번째 경로"** 가 무엇인지 자연스러운 다음 자리.
3. **APF (`_profile.md` §C, Active 1번)** 와 직접 연결. APF 의 모티프 분류(diagonal / stripe / block / edge / spike / checker) 가 image vision 의 attention motif 와 비교 가능. VisionTS 의 MAE encoder/decoder attention 을 같은 motif 분류로 측정한 사례는 (현재까지 인덱스 기준) 없다. APF 의 cross-modal 확장 hook.
4. **Grokking (`_profile.md` §A, Active 2번)** 측면에서는 zero-shot transfer 의 representation 이 어떻게 형성됐는지(image MAE 가 TS 를 "이해" 한 게 아니라 "재구성" 만 잘하는지) 라는 representation utility 질문에 직접 닿는다. Liu 2022 effective theory 의 "structured representation ↔ generalization" 와 cross-modal transfer 가 어떻게 작동하는지 비교 자산.
5. **P1 ProTran-TFA (paused, finance venue 가능)** 측면에서는 VisionTSpp 의 quantile head 9 개가 직접 distributional forecasting 인터페이스이고, State Street 공저 라는 점이 IJF/QF/Finance 응용 발표 시 인용 무게로 쓰일 수 있다.
6. **금융 비율 규칙** (인접 버킷에서 fin-ts-dl / probabilistic-forecast 중 월 1 회 이상). 6 월 인접: 06-03 MOIRAI (probabilistic cross). VisionTS 는 fin-ts-dl cross + tsfm-interp 두 개로 6 월 두 번째 금융-연관 등장 보장.

**부적합 후보 폐기 기록**: TimesFM (arXiv:2310.10688) 도 강력하나 ts-transformer-baseline 이미 3 — balance 어긋남. TimeMixer (arXiv:2405.14616) 는 동일 이유. Powerformer/AttnEmbed/Sprang 은 tsfm-interp(3) 쪽으로 또 쏠림. fin-ts-dl 후보로 HIST/StockMixer 등 검토했으나 ts-as-2d 의 뒤처짐이 더 시급 + VisionTS 가 fin cross 도 자연스럽게 채움. **VisionTS 1차 선정 → Source Lock 통과 → 확정.**
