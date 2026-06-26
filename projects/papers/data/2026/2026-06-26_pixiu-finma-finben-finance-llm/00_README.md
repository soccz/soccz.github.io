# 00. README — PIXIU: 금융 도메인 첫 번째 공개 LLM·지시튜닝 데이터·평가 벤치마크 통합 프레임워크

> 2026-06-26 (금) · 원거리 버킷 · llm-finance 태그 (커버 0 → +1)

## 원문 메타

- **원문 제목 (NeurIPS 카메라레디판)**: *PIXIU: A Comprehensive Benchmark, Instruction Dataset and Large Language Model for Finance*
- **arXiv 제목 (preprint판)**: *PIXIU: A Large Language Model, Instruction Data and Evaluation Benchmark for Finance*
- **한국어 번역**: "PIXIU(피슈): 금융을 위한 종합 평가 벤치마크·지시튜닝 데이터셋·대형 언어모델"
- **저자 (NeurIPS 카메라레디 / arXiv 짧은 BibTeX 7인)**: Qianqian Xie, Weiguang Han, Xiao Zhang, Yanzhao Lai, Min Peng, Alejandro Lopez-Lira, Jimin Huang
- **소속**: The Fin AI · Wuhan University · The University of Manchester · University of Florida (Warrington College of Business) · Southwest Jiaotong University 등 7개 기관 (BibTeX) — GitHub 공식 페이지의 확장된 PIXIU 프로젝트는 13개 기관 32명 공저자로 갱신되어 있으나, 본 해체는 **NeurIPS 2023 D&B 카메라레디판** (7-author) 을 1차 출처로 한다
- **발표처**: *Advances in Neural Information Processing Systems 36 (NeurIPS 2023) — Datasets and Benchmarks Track*
- **공개 일자**: arXiv v1 2023-06-08, NeurIPS 카메라레디 2023-12
- **Venue tier**: **Tier 1** (NeurIPS — Datasets and Benchmarks 정식 트랙. 일반 main track 과 동일하게 peer-reviewed 정식 publication)

## Canonical Identifier 와 Source Lock 결과

| 항목 | 값 |
|---|---|
| arXiv ID | [arXiv:2306.05443](https://arxiv.org/abs/2306.05443) |
| OpenReview ID | vTrRq6vCQH ([forum URL](https://openreview.net/forum?id=vTrRq6vCQH)) |
| NeurIPS proceedings hash | 6a386d703b50f1cf1f61ab02a15967bb ([Abstract page](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6a386d703b50f1cf1f61ab02a15967bb-Abstract-Datasets_and_Benchmarks.html)) |
| 저자 공식 GitHub | [`The-FinAI/PIXIU`](https://github.com/The-FinAI/PIXIU) — README 657줄, MIT 라이선스 |
| HuggingFace 모델 페이지 | `TheFinAI/finma-7b-nlp`, `TheFinAI/finma-7b-full` |
| HuggingFace 데이터셋 컬렉션 | `TheFinAI/english-evaluation-dataset-…`, `…/spanish-…`, `…/chinese-…` |

**본 환경 접근 상태 (Source Lock 4-gate)**:

1. **Canonical identifier** — ✅ 확보 (arXiv ID + OpenReview ID + NeurIPS proceedings hash)
2. **Metadata match** — ✅ arXiv·NeurIPS·GitHub 세 출처에서 제목·저자·연도·트랙 일치 확인. GitHub README 자체에 "🚀 We're thrilled to announce that our paper, 'PIXIU: A Comprehensive Benchmark, Instruction Dataset and Large Language Model for Finance', has been accepted by NeurIPS 2023 Track Datasets and Benchmarks!" verbatim 명시
3. **Full text access** — ⚠️ **부분 차단**. arXiv abs/abstract page, ar5iv HTML, NeurIPS proceedings hash page, OpenReview forum/PDF, HuggingFace papers 모두 본 환경에서 HTTP 403. 대신 **저자 공식 GitHub README** 가 657줄 분량으로 abstract·기여·8 task·15 dataset (FinBen) / 4 task·9 dataset (FIT) · 136K 인스트럭션 (Dataset Statistics 표 verbatim) · FinMA-7B/FinMA-7B-full/FinMA-30B (LLaMA-7B/30B base) · 9 종 평가 메트릭 · BARTScore 체크포인트 · BibTeX 인용 정보 verbatim 으로 1차 검증 통과
4. **Evidence map** — ✅ 아래 4지점 모두 GitHub README 의 verbatim 위치 확보:
   - 핵심 claim (4 Key Features): README "Key Features" 절 (Open resources / Multi-task / Multi-modality / Diversity)
   - 방법론 (FIT 지시 데이터 구성 + FinMA fine-tuning): README "FIT: Financial Instruction Dataset" 절 + "FinMA v0.1" 절
   - 실험 (8 tasks × 15 datasets 벤치마크, ChatGPT·GPT-4·BloombergGPT 비교): README "FinBen 2.0" 절 + "Tasks" 표 verbatim
   - 한계 (Disclaimer 절 명시 + 평가 기반의 NER 자동평가 0-shot 한계): README "Disclaimer" 절 + "Automated Task Assessment" 절의 0-shot NER 패턴 매칭 자기-경고

**🚫 본 해체에서 단정 금지 항목** (PDF 본문 차단으로 절대 수치/표 좌표/figure 위치 확인 불가):
- Section 5 main results 표의 절대 정확률·F1·MCC 수치
- 각 baseline 별 정확한 평균/표준편차/seed 통계
- Appendix 의 hyperparameter sweep 디테일
- "Limitations" 절의 정확한 문장 (논문 본문 PDF 차단)
- Figure 1/2 등의 시각화 정확한 디자인

이런 항목은 본문에서 "원문 PDF 차단으로 정확한 수치/위치 단정 안 함, GitHub README + 인용 BibTeX 으로 정성 검증" 으로 명시 표기.

## 태그

- **주 태그**: `llm-finance` (커버 0 → 1, **원거리 버킷의 최뒤 태그 3개 (llm-finance/rl-trading/causal-ml-finance) 중 venue tier 가 가장 높은 후보 선택**)
- **보조 태그**: `non-stationarity-ts` (Stock Movement Prediction 태스크에 tweets+OHLCV 시계열 멀티모달 포함), `tsfm-interp` (벤치마크 정렬·instruction-tuning 데이터 큐레이션 metholology 측면에서 시계열 LLM interp 의 기초 작업)

## 코드·데이터 공개 여부

✅ **MIT 라이선스 전면 공개**. 코드 (`The-FinAI/PIXIU`), FinMA 모델 (HuggingFace), 9-dataset FIT 인스트럭션 + 30+ dataset FinBen 평가 데이터셋 (HuggingFace collections) 모두 공개. EleutherAI `lm-evaluation-harness` 와 호환되는 `eval.py` 실행 스크립트 + BARTScore 체크포인트 + Docker 이미지 (`tothemoon/pixiu:latest`) 까지 재현 인프라가 갖춰져 있다. **재현성은 본 버킷에서 만난 모든 논문 중 최상위급**.

## 한 줄 판결 (섹션 11 재게시)

> **금융 도메인 LLM 의 "GLUE-순간" — 8 태스크 / 15 데이터셋 / 136K 인스트럭션 / FinMA 3-변형의 4-요소 패키지로 "공개 데이터 + 공개 모델 + 표준 평가" 의 동시 부재를 단번에 해소했다. 본 연구 (APF/Grokking-in-TS-Transformers) 에는 직접 substrate 가 아니지만, P1 ProTran-TFA 의 finance venue (IJF/QF) 재개 시 "벤치마크 정합성 표준" 으로 인용해야 할 1순위 reference. 또한 stock movement prediction 의 tweets+OHLCV 멀티모달 데이터셋 (BigData22/ACL18/CIKM18) 은 AETHER (crypto cycle) 의 sentiment+price fusion 설계의 직접 사전 작업.**

## 목차 (모든 섹션)

| 번호 | 파일 | 섹션 |
|---|---|---|
| 00 | [00_README.md](00_README.md) | 표지 (본 파일) |
| 01 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 |
| 02 | [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등/학부/전문가) |
| 03 | [03_problem.md](03_problem.md) | 문제 지형도 |
| 04 | [04_claims.md](04_claims.md) | 핵심 Claim 해체 (4-Claim) |
| 05a | [05_method_a_intuition.md](05_method_a_intuition.md) | 방법론 (1) 큰 그림 — 4-요소 패키지 |
| 05b | [05_method_b_fit_construction.md](05_method_b_fit_construction.md) | 방법론 (2) FIT 지시튜닝 데이터 구성 |
| 05c | [05_method_c_finma_training.md](05_method_c_finma_training.md) | 방법론 (3) FinMA 학습 — LLaMA 기반 instruction tuning |
| 05d | [05_method_d_flare_evaluation.md](05_method_d_flare_evaluation.md) | 방법론 (4) FLARE/FinBen 평가 프로토콜 |
| 06 | [06_experiments.md](06_experiments.md) | 실험 해부 |
| 07 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 08 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 09 | [09_my_research.md](09_my_research.md) | 내 연구와의 연결 |
| 10a | [10_extensions_a_questions.md](10_extensions_a_questions.md) | 사고 확장 (1) 자문 질문 5개 |
| 10b | [10_extensions_b_followups.md](10_extensions_b_followups.md) | 사고 확장 (2) Follow-up 3편 |
| 10c | [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 (3) 실험 아이디어 2개 |
| 11 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |

목표 분량: 22,000~28,000 한글자. PDF 본문 차단 환경에서 GitHub README 와 검색 verbatim 으로 정성 검증된 부분만 단정한다.
