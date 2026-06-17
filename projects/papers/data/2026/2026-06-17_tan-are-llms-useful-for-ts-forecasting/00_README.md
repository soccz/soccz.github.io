# 00. 표지 — Are Language Models Actually Useful for Time Series Forecasting?

> **원문 제목**: Are Language Models Actually Useful for Time Series Forecasting?
> **한국어 가제**: 언어 모델은 시계열 예측에 정말 쓸모가 있는가?

## 메타

- **저자**: Mingtian Tan, Mike A. Merrill, Vinayak Gupta, Tim Althoff, Thomas Hartvigsen
- **소속**: University of Virginia (Tan, Gupta, Hartvigsen) · University of Washington (Merrill, Althoff)
- **발표처**: NeurIPS 2024 **Spotlight**
- **연도**: 2024 (v1 2024-06-24, v2 2024-10-26)
- **Canonical identifier**: arXiv:2406.16964 · OpenReview `DV15UbHCY1` · NeurIPS Proceedings 2024 hash `6ed5bf446f59e2c6646d23058c86424b` · ACM DL DOI 10.5555/3737916.3739838
- **태그(주)**: `non-stationarity-ts`
- **태그(보조)**: `ts-transformer-baseline`, `tsfm-interp`
- **코드/데이터**: 저자 공식 GitHub [BennyTMT/LLMsForTimeSeries](https://github.com/BennyTMT/LLMsForTimeSeries) — 4 디렉토리(`CALF/`, `OFA/`, `Time-LLM-exp/`, `PAttn/`) × 7 데이터셋 스크립트 공개

## Source Lock 메모

- **본 환경 접근 상태(2026-06-17)**: arXiv abs/html, OpenReview forum, NeurIPS 공식 proceedings, ar5iv, alphaxiv, Semantic Scholar, Liner, TowardsAI 모두 HTTP 403 Forbidden.
- **대체 1차 출처**: 저자 본인이 운영하는 공식 GitHub repo `BennyTMT/LLMsForTimeSeries`.
  - 루트 README (저자 명·NeurIPS 2024 Spotlight·BibTeX·3 변형·7 데이터셋 verbatim)
  - 폴더 트리(`/CALF`, `/OFA`, `/Time-LLM-exp`, `/PAttn`, `/pic`)
  - `PAttn/main.py` argparse 디폴트(`seq_len=512`, `pred_len=96`, `d_model=768`, `n_heads=16`, `e_layers=3`, `d_ff=512`, `dropout=0.2`, `batch_size=512`, `lr=1e-4`, `epochs=10`, `patience=3`, `patch_size=16`)
  - `PAttn/models/PAttn.py` 아키텍처(ReplicationPad1d + unfold patch + Linear in/out + MultiHeadAttention)
- **WebSearch 인덱싱 verbatim**: 3 ablation 정의 — *"w/o LLM; LLM2Attn, which replaces the language model with a single randomly-initialized multi-head attention layer; LLM2Trsf, which replaces the language model with a single randomly-initialized transformer block"* 그리고 학습시간 배수 — *"Time-LLM, OneFitsAll, and LLaTA taking on average 28.2, 2.3 and 1.2 times longer than the modified models"*.
- **단정 범위**: abstract 메인 주장 / 3-ablation 정의 / 3-base 모델 식별 / 7-데이터셋 목록 / PAttn 아키텍처 + 디폴트 하이퍼파라미터 / 28.2x·2.3x·1.2x 학습 시간 배수.
- **단정하지 않는 것**: 본문 PDF 의 표·그림 절대 수치(MSE/MAE 소수점 모든 자리), Figure 8/Table 11 등 개별 표 내용, Limitation 절 정확한 문장, Appendix 보조 실험 디테일, "in most cases" 의 정확한 분율 — 본문 PDF 자체에 접근할 수 없으므로 수치는 "원문에 보고되었으나 본 환경 미확인"으로 둠.

## 한 줄 판결

> **"LLM-for-TS 라는 '대유행'에 대해, '플라시보를 빼도 같다' 는 ablation 으로 1년치 hype 의 공기를 빼버린 NeurIPS 24 Spotlight. APF·Grokking 양 트랙의 '시계열 트랜스포머가 정말 뭘 학습하는가'를 묻는 모든 후속 논문의 의무 인용 baseline."**

## 목차

- [01. 메타 & 선정 이유](01_meta.md)
- [02. 3층 TL;DR](02_tldr.md)
- [03. 문제 지형도](03_problem.md)
- [04. 핵심 Claim 해체](04_claims.md)
- [05. 방법론 해부](05_method_a_overview.md)
  - [05-a. 전체 흐름 (3 ablation × 3 base × 7 데이터셋)](05_method_a_overview.md)
  - [05-b. w/o LLM — 그냥 빼버리기](05_method_b_wo_llm.md)
  - [05-c. LLM2Attn / LLM2Trsf — 무작위 초기화로 교체](05_method_c_llm2attn_llm2trsf.md)
  - [05-d. PAttn — 패칭 + 어텐션 한 층의 단순 베이스라인](05_method_d_pattn.md)
- [06. 실험 해부](06_experiments.md)
- [07. 가정·한계·반박](07_limits.md)
- [08. 이론적 계보](08_lineage.md)
- [09. 내 연구와의 연결](09_my_research.md)
- [10. 사고 확장](10_extensions_a_questions.md)
  - [10-a. 자문 질문 5개](10_extensions_a_questions.md)
  - [10-b. Follow-up 논문 3편](10_extensions_b_followups.md)
  - [10-c. 실험 아이디어 2개](10_extensions_c_ideas.md)
- [11. 한 줄 판결](11_verdict.md)
