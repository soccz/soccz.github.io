# Transformer Hawkes Process (ICML 2020) — 섹션별 해체

## 원문

- **제목**: Transformer Hawkes Process
- **번역**: 트랜스포머 호크스 과정 (사건 발생 패턴을 트랜스포머의 자기-주의(self-attention) 로 학습하는 시간적 점과정 모델)
- **저자**: Simiao Zuo · Haoming Jiang · Zichong Li · Tuo Zhao · Hongyuan Zha
- **소속**: Georgia Institute of Technology (School of Industrial and Systems Engineering; School of Computational Science and Engineering)
- **발표처**: 제37회 International Conference on Machine Learning (ICML 2020), PMLR Volume 119
- **연도**: 2020 (arXiv v1 2020-02-21, ICML 채택 2020-06)
- **Canonical identifier**: arXiv:2002.09291 · PMLR v119/zuo20a · dblp `conf/icml/ZuoJLZZ20`

## Source Lock 기록

| 게이트 | 상태 | 비고 |
|--------|------|------|
| (1) Canonical identifier | ✅ | arXiv:2002.09291 + PMLR v119/zuo20a + dblp 모두 동일 5인 저자 / 동일 제목 / ICML 2020 |
| (2) Metadata match | ✅ | dblp `ZuoJLZZ20` = Zuo · Jiang · Li · Zhao · Zha 5인. ICML proceedings 인덱스(`http://proceedings.mlr.press/v119/zuo20a.html`) 와 일치 |
| (3) Full text access | ⚠️ 부분 | arxiv.org / proceedings.mlr.press / semanticscholar / huggingface 모두 host_not_allowed (403). **저자 본인 공식 GitHub 리포지토리 `SimiaoZuo/Transformer-Hawkes-Process` (raw.githubusercontent.com) 는 정상 접근**. abstract / method 의 모든 핵심은 (a) 저자 본인 코드(`transformer/Models.py`, `transformer/SubLayers.py`, `transformer/Modules.py`, `transformer/Layers.py`, `Main.py`, `Utils.py`, `preprocess/Dataset.py`, `run.sh`) + (b) WebSearch 검색 인덱스의 abstract verbatim 으로 교차검증 |
| (4) Evidence map | ✅ | 01_meta.md 참조 — 모든 단정의 근거 위치 명시 |

**미접근 항목 — 본 해체에서 단정하지 않는 범위**:

- 본문 Table 1·2·3 의 절대 수치 (각 데이터셋별 log-likelihood, RMSE, accuracy 의 자릿수) — 코드 + abstract 수준에서만 "THP > RMTPP / NHP / SAHP" 의 방향성만 단정
- Figure 1·2·3 의 시각적 패턴 (학습 곡선, attention heatmap 등) — 코드로 재현 가능 구조만 단정
- 본문의 정리(Theorem) 또는 보조정리 — 본 논문에는 명시 정리 없음 (코드/제목으로 확인 가능)

## 태그

- **주 태그**: `point-process` (원거리 버킷, 커버 수 0 → 1)
- **보조 태그**: `ts-transformer-baseline` (수요일 인접의 transformer encoder 라인) · `fin-ts-dl` (Financial transaction 데이터셋 평가) · `attention-as-explanation` (continuous-time attention 의 해석성 논의 잠재)

## 코드·데이터

- **공식 코드**: <https://github.com/SimiaoZuo/Transformer-Hawkes-Process> (Apache 2.0 표기 없음 — license 파일 미확인. PyTorch 1.4, Python 3.7, single GPU 전제)
- **데이터셋**: 저자 Google Drive 제공 (Retweet / StackOverflow / Financial / MIMIC-II / MemeTrack + Synthetic Hawkes — point process 표준 6종)
- **재현 가능성**: 데이터 단위(분/시간/일) 가 reported RMSE 와 불일치한다는 경고가 README 에 명시되어 있음 — 본인이 직접 데이터를 다운받지 않고 reported 수치를 그대로 인용할 때 함정

## 한 줄 판결

**트랜스포머 인코더의 self-attention 으로 호크스 강도(intensity) 의 비선형 누적을 대체한 첫 시도 — RNN 점과정의 4년 패러다임을 "강도 = embedding 의 선형변환 + softplus" 라는 한 줄로 재정의한 anchor 논문이며, APF 의 "PE × motif" 가설을 사건 시각의 sinusoidal time encoding 위에서 재검증할 수 있는 가장 자연스러운 베이스라인이다.**

## 목차

1. [01_meta.md](01_meta.md) — 메타 & 선정 이유
2. [02_tldr.md](02_tldr.md) — 3층 TL;DR
3. [03_problem.md](03_problem.md) — 문제 지형도
4. [04_claims.md](04_claims.md) — 핵심 Claim 해체
5. [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론 (1) 전체 흐름
6. [05_method_b_time_encoding.md](05_method_b_time_encoding.md) — 방법론 (2) 시간 인코딩
7. [05_method_c_attention.md](05_method_c_attention.md) — 방법론 (3) 어텐션·인코더 블록
8. [05_method_d_intensity.md](05_method_d_intensity.md) — 방법론 (4) 연속시간 강도함수
9. [05_method_e_likelihood.md](05_method_e_likelihood.md) — 방법론 (5) 로그가능도와 적분
10. [06_experiments.md](06_experiments.md) — 실험 해부
11. [07_limits.md](07_limits.md) — 가정·한계·반박
12. [08_lineage.md](08_lineage.md) — 이론적 계보
13. [09_my_research.md](09_my_research.md) — 내 연구와의 연결
14. [10_extensions_a_questions.md](10_extensions_a_questions.md) — 사고 확장 (질문 5개)
15. [10_extensions_b_followups.md](10_extensions_b_followups.md) — 사고 확장 (follow-up 3편)
16. [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 사고 확장 (실험 아이디어 2개)
17. [11_verdict.md](11_verdict.md) — 한 줄 판결
