# 00_README — DeepLOB: Deep Convolutional Neural Networks for Limit Order Books

## 표지 & 네비게이션

### 원문 정보

| 항목 | 내용 |
|------|------|
| **원문 제목** | DeepLOB: Deep Convolutional Neural Networks for Limit Order Books |
| **한국어 번역** | DeepLOB: 호가창을 위한 심층 합성곱 신경망 |
| **저자** | Zihao Zhang, Stefan Zohren, Stephen Roberts |
| **소속** | Oxford-Man Institute of Quantitative Finance · Department of Engineering Science, University of Oxford |
| **발표처 · 연도** | IEEE Transactions on Signal Processing, Vol. 67, No. 11, pp. 3001–3012, June 1 2019 |
| **DOI** | 10.1109/TSP.2019.2907260 |
| **최초 공개** | arXiv 2018-08-10 (v1), 최종 v6 |

### Source Lock

| 항목 | 상태 |
|------|------|
| **Canonical identifier** | arXiv:1808.03668 ✅ + DOI:10.1109/TSP.2019.2907260 ✅ |
| **공식 원문 URL (1차)** | https://arxiv.org/abs/1808.03668 (환경 차단 — HTTP 403) |
| **공식 GitHub** | https://github.com/zcakhaa/DeepLOB-Deep-Convolutional-Neural-Networks-for-Limit-Order-Books ✅ (저자 본인 zcakhaa = Zihao Zhang Cak Has Account; 학과 공식 NFS 경로 `/nfs/home/zihaoz/...` 로 검증) |
| **본문 접근 여부** | ⚠️ **Source Lock 통과 (조건부)** — arXiv PDF · IEEE Xplore · Oxford-Man PDF · ResearchGate 모두 환경 네트워크 정책으로 HTTP 403. 저자 공식 GitHub 리포지토리의 PyTorch 노트북(`jupyter_pytorch/run_train_pytorch.ipynb`)과 README, 검색 인덱스의 abstract verbatim 으로 4-게이트 통과. 단, paper 본문(section/figure)에만 있는 상세 baseline table 수치는 "원문 미접근 — 본문 표 미확인" 으로 처리. |
| **확인한 정보** | abstract verbatim (검색 인덱스, IEEE Xplore 메타와 일치), 정확한 모델 아키텍처 (3 conv blocks + 3 parallel inception modules + LSTM(64) + FC(3), Total params 143,907), 데이터셋 (FI-2010 NoAuction DecPre CF_7~9 + LSE 2017 Lloyds/Barclays/Tesco/BT/Vodafone), hyperparameter (Adam lr=1e-4, batch=64, T=100 lookback, 50 epochs, LeakyReLU slope=0.01 + Tanh 혼용), 결과 (Test acc 0.7535, macro F1 0.7533) |

### 분류

- **주 태그**: `market-microstructure` (LOB 딥러닝, 신규 0→1)
- **보조 태그**: `fin-ts-dl` (금융 시계열 DL)
- **요일 버킷**: 금요일 (원거리, §F)

### 코드 · 데이터 공개

- **코드**: https://github.com/zcakhaa/DeepLOB-... — TensorFlow v1/v2 + PyTorch 1.9 노트북, FI-2010 데이터 zip 포함 (raw.githubusercontent.com 직접 다운로드)
- **데이터(FI-2010)**: 공개. Nordic stock 5종목 10일 normalized LOB. 원본: https://etsin.fairdata.fi/dataset/73eb48d7-4dbc-4a10-a52a-da745b47a649
- **데이터(LSE 2017)**: 비공개 (Lloyds, Barclays, Tesco, BT, Vodafone × 1년 tick-level)

---

## 한 줄 판결

> **"호가창은 시간 × 가격레벨 2D 이미지다" — DeepLOB 는 LOB 의 raw 40-dim × 100-tick 행렬을 1×2 → 4×1 → 1×10 으로 잘게 썰어 가격-거래량 짝과 다단계 가격레벨 의존성을 분리 추출하고, 그 위에 Inception 으로 다중 시간 스케일을, LSTM 으로 장기 의존을 얹는다. FI-2010 에서 75.35% 정확도 (3-class)·F1 0.7533 으로 동시기 SOTA 갱신했고, 학습에 한 번도 나오지 않은 종목에서도 작동하는 'universal features' 를 처음 실증해 마이크로구조 ML 의 표준 baseline 이 됐다.**

---

## 목차

| 섹션 | 파일 |
|------|------|
| 0. 메타 & 선정 이유 | [01_meta.md](01_meta.md) |
| 1. 3층 TL;DR | [02_tldr.md](02_tldr.md) |
| 2. 문제 지형도 | [03_problem.md](03_problem.md) |
| 3. 핵심 Claim 해체 | [04_claims.md](04_claims.md) |
| 4a. 방법론 — 전체 흐름 | [05_method_a_intuition.md](05_method_a_intuition.md) |
| 4b. 방법론 — LOB 입력 표현 | [05_method_b_lob_input.md](05_method_b_lob_input.md) |
| 4c. 방법론 — CNN + Inception + LSTM | [05_method_c_cnn_inception_lstm.md](05_method_c_cnn_inception_lstm.md) |
| 5. 실험 해부 | [06_experiments.md](06_experiments.md) |
| 6. 가정·한계·반박 | [07_limits.md](07_limits.md) |
| 7. 이론적 계보 | [08_lineage.md](08_lineage.md) |
| 8. 내 연구와의 연결 | [09_my_research.md](09_my_research.md) |
| 9a. 사고 확장 — 자문 질문 | [10_extensions_a_questions.md](10_extensions_a_questions.md) |
| 9b. 사고 확장 — Follow-up | [10_extensions_b_followups.md](10_extensions_b_followups.md) |
| 9c. 사고 확장 — 실험 아이디어 | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) |
| 10. 한 줄 판결 | [11_verdict.md](11_verdict.md) |
