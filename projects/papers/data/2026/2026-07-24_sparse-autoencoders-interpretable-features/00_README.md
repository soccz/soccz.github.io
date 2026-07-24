# Sparse Autoencoders Find Highly Interpretable Features in Language Models

**한국어 제목**: 희소 오토인코더는 언어모델에서 고도로 해석 가능한 특징을 찾아낸다

---

## 서지 정보

- **저자**: Hoagy Cunningham, Aidan Ewart, Logan Riggs, Robert Huben, Lee Sharkey
- **소속** (2차 확인 — 접근한 1차 소스 본문에는 소속 미표기): EleutherAI (Cunningham·Ewart·Riggs), MATS (Cunningham), Bristol AI Safety Centre (Ewart), Apollo Research (Sharkey)
- **발표처**: ICLR 2024 (Poster) — `iclr.cc/virtual/2024/poster/19081`, OpenReview `F76bwRSLeK`
- **canonical identifier**: arXiv:2309.08600 (v1 2023-09-15 / v3 2023-10-04) · DOI 없음(학회 poster)
- **태그**: `sae-features` (보조: `mech-interp-circuits`, `causal-intervention`)

## Source Lock

- **canonical identifier**: arXiv:2309.08600 ✅
- **공식 원문 URL**: `arxiv.org/abs/2309.08600` (메타), `ar5iv.labs.arxiv.org/html/2309.08600` (전문)
- **확인한 원문 버전**: ar5iv HTML 전문 (abstract·§2 방법·§3 autointerp·§4~5 인과·§6 한계·부록 A~G 모두 렌더 확인) — arXiv ID·제목·저자 공식 arXiv 메타와 일치
- **본문 접근 여부**: ✅ 전문 접근 성공 (§4-bis 3문 자기시험 통과 — 01_meta 참조)
- **주의**: `arxiv.org/html/2309.08600v3` 는 404(HTML 미제공 버전), ar5iv 는 전문 정상. 1차 근거는 ar5iv 전문에서만 인용.

## 코드·데이터 공개

- 저자 공개 코드: `github.com/HoagyC/sparse_coding` (dictionary 학습·autointerp 파이프라인). 활성값 데이터는 The Pile / OpenWebText 로 재생성 가능. 분석 대상 모델은 EleutherAI Pythia-70M / Pythia-410M (완전 공개).

## 한 줄 판결

> **SAE(희소 오토인코더)를 "중첩 해소 → 단의미 특징 사전 → 인과 개입"의 한 파이프라인으로 처음 실증한 독립 계열의 원전.** 내 "TS Transformer 기계적 해석" 피벗의 특징-사전 방법론 앵커이자, APF의 attention motif 를 "특징(feature)"이 아니라 "패턴(pattern)"으로 봐야 하는 이유를 되비추는 대조군이다. 다만 재구성 손실(perplexity 25→40)·MLP 학습 실패·ground-truth 부재라는 세 구멍을 그대로 물려받는다.

---

## 목차 (섹션 네비게이션)

| # | 파일 | 내용 |
|---|------|------|
| 0 | [01_meta.md](01_meta.md) | 메타 & 선정 이유 (§4-bis 자기시험 기록) |
| 1 | [02_tldr.md](02_tldr.md) | 3층 TL;DR (초등학생/학부생/전문가) |
| 2 | [03_problem.md](03_problem.md) | 문제 지형도 — 다의성·중첩과 해석 실패 계보 |
| 3 | [04_claims_a_claim12.md](04_claims_a_claim12.md) · [04_claims_b_claim34.md](04_claims_b_claim34.md) | 핵심 Claim 1~4 해체 |
| 4 | [05_method_a_intuition.md](05_method_a_intuition.md) · [05_method_b_sparse_autoencoder.md](05_method_b_sparse_autoencoder.md) · [05_method_c_training.md](05_method_c_training.md) | 방법론 해부 |
| 5 | [06_experiments_a_autointerp.md](06_experiments_a_autointerp.md) · [06_experiments_b_causal_ioi.md](06_experiments_b_causal_ioi.md) | 실험 해부 |
| 6 | [07_limits.md](07_limits.md) | 가정·한계·반박 |
| 7 | [08_lineage.md](08_lineage.md) | 이론적 계보 |
| 8 | [09_my_research.md](09_my_research.md) | 내 연구(APF·Grokking-in-TS)와의 연결 |
| 9 | [10_extensions_a_questions.md](10_extensions_a_questions.md) · [10_extensions_b_followups.md](10_extensions_b_followups.md) · [10_extensions_c_ideas.md](10_extensions_c_ideas.md) | 사고 확장 |
| 10 | [11_verdict.md](11_verdict.md) | 한 줄 판결 |
