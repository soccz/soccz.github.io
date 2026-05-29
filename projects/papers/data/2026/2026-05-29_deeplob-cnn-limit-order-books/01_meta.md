# 01_meta — 메타 & 선정 이유

## 논문 메타데이터

| 항목 | 내용 |
|------|------|
| **저자** | Zihao Zhang, Stefan Zohren, Stephen Roberts |
| **소속** | Oxford-Man Institute of Quantitative Finance · Department of Engineering Science, University of Oxford (모두 동일 그룹) |
| **발표처** | IEEE Transactions on Signal Processing, Vol. 67, No. 11, pp. 3001–3012, 2019-06-01 |
| **arXiv 최초 공개** | 2018-08-10 (v1), 마지막 개정 v6 |
| **Canonical ID** | arXiv:1808.03668 · DOI:10.1109/TSP.2019.2907260 |
| **인용 수** | 1,000회+ 추정 (직접 미확인 — Semantic Scholar 접근 차단). LOB 딥러닝 표준 인용 baseline. |
| **카테고리** | q-fin.TR (Trading & Microstructure) · stat.ML · cs.LG |

## 근거 지도 (Evidence Map)

원문 본문 절 번호는 추정. 본 해체의 모든 단정은 아래 직접 검증 경로에서 도출.

| 내용 | 검증 경로 |
|------|----------|
| Abstract / 핵심 주장 (CNN+LSTM 융합 / FI-2010 SOTA / universal features) | 검색 인덱스 abstract verbatim (IEEE Xplore 메타 일치) |
| 입력 표현 (40-dim × 100-tick, 10-level bid/ask 가격·거래량) | GitHub notebook cell 6, 7 (`dec_train.shape = (149, 203800)`, `data_classification(...)` 의 T=100) |
| CNN 블록 3개 + Inception 3개 + LSTM(64) + FC(3) 아키텍처 | GitHub notebook cell 11 (`class deeplob(nn.Module)`) |
| Conv 커널 (1×2 → 4×1 ×2 → 1×2 → 4×1 ×2 → 1×10 → 4×1 ×2) | notebook cell 11 + `summary(model, (1, 1, 100, 40))` 출력 (cell 13) |
| 활성 함수 (LeakyReLU slope 0.01 + Tanh 혼용) | notebook cell 11 (`nn.LeakyReLU(0.01)` + `nn.Tanh()`) |
| Hyperparameter (Adam lr=1e-4, batch=64, T=100, 50 epochs) | notebook cell 8, 14, 17 |
| 데이터셋 (FI-2010 NoAuction DecPre CF_7/8/9) | notebook cell 7 |
| 결과 (Test acc 0.7535, macro F1 0.7533) | notebook cell 20, 22 |
| LSE 2017 데이터 (Lloyds/Barclays/Tesco/BT/Vodafone, 1년) | WebSearch (제목 + arXiv 1808.03668 키워드) |
| baseline 비교 table (vs SVM/MLP/CNN-I/LSTM/BoF/N-BoF/MCSDA) | ⚠️ 원문 본문 표 미확인 — 본 해체에서 수치 주장 안 함 |
| 한계 / 가정 명시 위치 | ⚠️ 본문 §VI 추정 — 직접 미확인. 본 해체의 한계는 코드 + abstract 로부터 도출. |

*총평*: 모델 정의·하이퍼파라미터·결과·데이터셋은 저자 본인 코드로 직접 검증. 본문 표/그림에서만 확인 가능한 baseline 절대 수치만 미확인.

## 선정 이유

### 왜 지금 이 논문인가?

**오늘 버킷**: 금요일 = 원거리 버킷 (§F: 금융 ML 원거리).

`_coverage.md` 의 원거리 태그 중 **`market-microstructure`** 가 커버 수 0. 사용자 프로파일 §F 에 "Market microstructure ML (LOB), Deep hedging (Buehler)" 가 명시되어 있고, 사용자의 진로(석사 졸 후 quant / 차트 분석 industry)와 가장 직접 연결되는 영역이다. LOB 딥러닝의 표준 baseline 인 DeepLOB 를 다루는 것이 자연스럽다.

후보 비교 (Source Lock 통과 기준):

| 후보 | venue | Source Lock | 결정 |
|------|-------|-------------|------|
| **DeepLOB (Zhang 2019)** | IEEE TSP (Tier 3) | 저자 공식 GitHub + abstract verbatim ✅ | **선정** |
| Deep Hedging (Buehler 2019) | Quantitative Finance | 공식 코드 repo 부재. arXiv 차단 | 폐기 |
| Neural Hawkes (Mei & Eisner 2017) | NeurIPS 2017 (Tier 1) | GitHub README 짧음 (코드만), arxiv 차단 | 폐기 |

### 저자 권위 배경

- **Oxford-Man Institute (OMI)** 는 Oxford 의 양적 금융 연구소로 Manfred Man Group 자금으로 운영. 금융 시계열 DL 연구의 톱 그룹.
- Stefan Zohren · Stephen Roberts 는 OMI 의 ML 라인을 이끌며, 후속 작업(BDLOB 2018 Bayesian, Sirignano-Cont 2019 와 평행 시기 연구)을 다수 산출.
- Zihao Zhang 의 박사 논문 주제이며, 본 논문이 첫 출판 결과로 IEEE TSP 단독 게재.

### 사용자 연구 연결도 (한 줄씩)

1. **§F 원거리 직접**: market-microstructure 첫 커버 — 사용자 진로 직결.
2. **§D 인접**: TS 를 2D 이미지로 다루는 발상 (TimesNet, GAF/MTF 와 동궤) — APF 의 "2D attention motif" 표현 가설과 비교 대상.
3. **§E 부차**: 금융 시계열 DL — fin-ts-dl 의 직접 후속 (MASTER 2024 의 selectivity 와 비교 가능).
4. **APF 와 연결**: DeepLOB 의 conv kernel 설계가 "어떤 spatial pattern 을 추출하는가" — APF 의 motif 가설(diagonal/stripe/block) 과 본질적으로 같은 질문.
5. **Grokking 과 약한 연결**: 직접 연결은 약함. 단, "지도 학습된 LOB 모델이 universal feature 를 grok 하는가" 라는 질문은 transfer 의미에서 의의.
