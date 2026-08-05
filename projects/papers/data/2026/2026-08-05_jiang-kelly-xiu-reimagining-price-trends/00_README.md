# (Re-)Imag(in)ing Price Trends — 섹션 단위 해체

**원문 제목**: (Re-)Imag(in)ing Price Trends
**한국어 번역**: 가격 추세를 (다시) 이미지화하기 / (다시) 상상하기
— 원제는 중의적 언어유희다. `Imag(in)ing` 안에 **Imaging**(이미지로 만들기)과 **Imagining**(다시 상상하기)이 겹쳐 있고, 앞의 `(Re-)`는 "기술적 분석을 다시 한다"는 뜻을 얹는다. 즉 "가격 차트를 **이미지로 만들어** 추세 연구를 **다시 상상한다**".

**저자·소속** (원문 각주 `*`, p.3193 verbatim):
- **Jingwen Jiang** — University of Chicago (원문 첫 페이지 저자란: Department of Computer Science)
- **Bryan Kelly** — Yale University, AQR Capital Management, NBER (교신저자: Yale School of Management)
- **Dacheng Xiu** — University of Chicago

**발표처·연도**: *The Journal of Finance*, Vol. LXXVIII, No. 6, December 2023, pp. 3193–3249 (© 2023 the American Finance Association)

---

## Source Lock

| 항목 | 내용 |
|---|---|
| **Canonical identifier** | **DOI: 10.1111/jofi.13268** (원문 p.3193 하단 verbatim) |
| 서지 | *The Journal of Finance* 78(6) 3193–3249 (2023) |
| 확인한 원문 버전 | **JF 게재 최종본 PDF** (PDF 메타데이터 `Subject: The Journal of Finance 2023.78:3193-3249`, `Title: (Re‐)Imag(in)ing Price Trends`, 57 pages, PDF 1.6) |
| 1차 소스 URL | `economics.yale.edu/sites/default/files/2023-11/The Journal of Finance - 2023 - JIANG - Re‐ Imag in ing Price Trends_0.pdf` — **저자 소속기관(Yale) 게시 게재본 PDF** = §4-bis 소스 등급 **1차** |
| 본문 접근 여부 | **전문 접근 성공.** 초록·§I~§VI 본문·Table I~XII·Figure 1~9·Appendix(CNN 구조) 전부 텍스트 레벨 확인. Internet Appendix(별도 부속 파일 IA.I~IA.XIX)는 본 PDF에 미포함 → 본문이 인용한 범위만 "저자가 본문에서 그렇게 보고했다"로 표기 |
| 보조 확인 | Semantic Scholar API (DOI 조회): `venue: Journal of Finance`, `year: 2023`, `citationCount: 68` — **인용 수 확인 용도만**, 본문 해체의 근거로 쓰지 않음 |

**§4-bis NO-ACCESS 3문 자기시험 — 통과 (1차 소스 verbatim)**
- **Q1 (초록 첫 문장)**: "We reconsider trend-based predictability by employing flexible learning methods to identify price patterns that are highly predictive of returns, as opposed to testing predefined patterns like momentum or reversal." (p.3193)
- **Q2 (주 결과 표 번호 + 수치)**: **Table I** "Short-Horizon (One-Week) Portfolio Performance", Equal-Weight 패널, I5/R5 열의 **H-L 행 = Ret `0.83***`, SR `7.15`** (p.3207)
- **Q3 (방법 절 번호 + 식 번호)**: **§II.C "Training the CNN"**, **식 (1)** — `L(y, ŷ) = −y log(ŷ) − (1 − y) log(1 − ŷ)` (p.3205)

---

## 태그

- **주 태그**: `ts-as-2d` (시계열을 2차원 표현으로 바꾸는 계열)
- **보조 태그**: `fin-ts-dl` (금융 시계열 딥러닝)

## 코드·데이터 공개 여부

저자 공식 코드 레포지토리는 원문에 명시되지 않았다. Dacheng Xiu의 소속기관 페이지(`dachxiu.chicagobooth.edu`)가 **"IPython Imaging Example.html"** 과 **"Image Data.zip"** 링크를 제공한다 — 이미지 생성 절차의 예시·이미지 데이터 배포로 보이며, **2차 소스(구현 세부 전용)** 등급이다. 원 데이터는 CRSP(미국)·Datastream(국제 25개국)·CSMAR(중국 본토)로 **전부 유료 라이선스**이며, 7,846개 기술적 트레이딩 룰 코드는 원문 각주 13에서 "Olivier Scaillet이 코드를 공유해 주었다"고 밝힌 **비공개 제공** 자산이다. → **완전 재현은 불가, 부분 재현만 가능.**

---

## 한 줄 판결

> **이 논문은 "시계열을 2D 이미지로 바꾸면 이긴다"의 결정적 증거가 아니라, 그 반대로 "이득의 대부분은 2D 기하가 아니라 이미지가 강제하는 min–max 재척도화(rescaling)에서 온다"는 것을 저자 자신의 Table IX로 폭로한 논문이다 — 그러므로 APF의 2D motif 축에는 '2D가 이긴다'의 근거가 아니라 **1D 대조군을 반드시 넣어야 한다는 반증 프로토콜**로 핀을 꽂는다.**

---

## 목차

| # | 파일 | 내용 |
|---|---|---|
| 0 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 (품질 게이트 통과 근거·근거 지도) |
| 1 | [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등학생 / 학부생 / 전문가) |
| 2 | [03_problem.md](03_problem.md) | 문제 지형도 — 기술적 분석 100년 논쟁의 계보 |
| 3 | [04_claims_a_claim1_2.md](04_claims_a_claim1_2.md) | 핵심 Claim 1~2 (예측력 · 기존 신호와의 독립성) |
| 3 | [04_claims_b_claim3_5.md](04_claims_b_claim3_5.md) | 핵심 Claim 3~5 (재척도화 · 전이 · 차티스트 반박) |
| 4 | [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 — 전체 흐름의 큰 그림 |
| 4 | [05_method_b_imaging.md](05_method_b_imaging.md) | 방법론 — "이미징": OHLC 바를 픽셀로 |
| 4 | [05_method_c_cnn.md](05_method_c_cnn.md) | 방법론 — CNN 구성요소 해부 (합성곱·활성·풀링) |
| 4 | [05_method_d_training.md](05_method_d_training.md) | 방법론 — 학습·정규화·구현 디테일 |
| 5 | [06_experiments_a_us.md](06_experiments_a_us.md) | 실험 — 미국 주식 포트폴리오 성과 |
| 5 | [06_experiments_b_interpret_transfer.md](06_experiments_b_interpret_transfer.md) | 실험 — 해석(§IV)과 전이학습(§V) |
| 6 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 7 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 8 | [09_my_research.md](09_my_research.md) | 내 연구와의 연결 (APF · Grokking · P1) |
| 9 | [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 — 자문 질문 5개 |
| 9 | [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 — follow-up 논문 3편 |
| 9 | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 — 실험 아이디어 2개 |
| 10 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |
