# 00. RoFormer — 회전형 위치 임베딩 (RoPE) 표지

- **원문 제목**: RoFormer: Enhanced Transformer with Rotary Position Embedding
- **한국어 번역**: RoFormer — 회전형 위치 임베딩(RoPE)을 얹은 강화 트랜스포머
- **저자**: Jianlin Su, Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu
- **소속**: Zhuiyi Technology Co., Ltd. (追一科技, 中国深圳)
- **발표처 · 연도**: Neurocomputing 568 (2024), article 127063 · arXiv v1 2021-04-20 (v5 2023-11-08)
- **Canonical identifier**: arXiv:2104.09864 · DOI 10.1016/j.neucom.2023.127063

## Source Lock 상태

- **arXiv abs/PDF · ar5iv · alphaxiv · HuggingFace papers · ScienceDirect · ResearchGate · Semantic Scholar**: 본 환경 HTTP 403 차단
- **저자 공식 GitHub**: `https://github.com/ZhuiyiTechnology/roformer` — 접근 성공. README + BibTeX + 사전학습 8종 중국어 RoFormer 체크포인트 + Apache-2.0 코드 트리(`train.py`, `finetune_scm.py`, `test_roformer_gpt.py` 등) 확인
- **WebSearch verbatim 인덱스**: (i) abstract "we propose a novel method named Rotary Position Embedding (RoPE)" verbatim + "encodes the absolute position with a rotation matrix and meanwhile incorporates the explicit relative position dependency in self-attention formulation" verbatim + "flexibility of sequence length, decaying inter-token dependency with increasing relative distances, and the capability of equipping linear self-attention with relative position encoding" verbatim, (ii) 방법 수식 (block-diagonal rotation matrix $R^d_{\Theta,m}$, $\theta_i = 10000^{-2(i-1)/d}$, inner product identity $\langle f_q(x_m,m), f_k(x_n,n) \rangle = g(x_m, x_n, m-n)$) 검증, (iii) 실험 (WMT2014 En-De 27.5 BLEU / vanilla Transformer 27.3 BLEU; CAIL2019-SCM 512→1024 토큰 확장 시 68.29%→69.79%; RoFormer vs WoBERT +1.5% 절대 향상; GLUE MRPC/SST-2/QNLI/STS-B/QQP/MNLI; Enwik8) 검증
- **본문 PDF 표 절대 수치**: 정확한 hyperparameter 표, 전체 GLUE dev/test score 소수점, PerFormer+RoPE 학습 곡선의 정확한 좌표, appendix 세부, Figure 캡션 원문, "future work" 절 정확 문장, seed 통계 σ 는 **본문 PDF 차단으로 단정 안 함**

## 태그

- **주 태그**: `pe-attention-geometry` (커버 수 2 → 3)
- **보조 태그**: `attention-as-explanation` (RoPE는 attention 패턴의 위치의존성을 명시적으로 재구성하므로 attention 해석 담론과 직결)

## 코드 · 데이터 공개

- 코드: 저자 공식 GitHub `ZhuiyiTechnology/roformer` (Apache-2.0) + HuggingFace `junnyu/roformer_*` + `transformers` 라이브러리 `RoFormerModel` 통합
- 데이터: WMT2014 En-De (공개), GLUE (공개), Enwik8 (공개), CAIL2019-SCM (공개; 중국 사법 데이터)

## 한 줄 판결

**RoPE는 "위치를 벡터에 더하지 말고, 벡터를 회전시켜라"라는 한 줄 발상으로 상대위치 attention 을 dot-product 항등식 하나에 압축한 21세기 위치 임베딩의 표준이며, APF 프로젝트의 PE→motif 지도에서 "RoPE 회전 주파수 대역 ↔ diagonal/stripe motif 위치" 라는 미검증 가설의 이론적 근거를 제공하는 회로 진화의 분기점이다.**

## 목차

- [01_meta.md](01_meta.md) — 메타 & 선정 이유
- [02_tldr.md](02_tldr.md) — 3층 TL;DR
- [03_problem.md](03_problem.md) — 문제 지형도
- [04_claims.md](04_claims.md) — 핵심 Claim 해체
- [05_method_a_intuition.md](05_method_a_intuition.md) — 방법론: 큰 그림
- [05_method_b_2d_rotation.md](05_method_b_2d_rotation.md) — 방법론: 2차원 회전 유도
- [05_method_c_d_dim_extension.md](05_method_c_d_dim_extension.md) — 방법론: d차원 확장 & 주파수 스펙트럼
- [05_method_d_linear_attention.md](05_method_d_linear_attention.md) — 방법론: 선형 attention 결합
- [06_experiments.md](06_experiments.md) — 실험 해부
- [07_limits.md](07_limits.md) — 가정 · 한계 · 반박
- [08_lineage.md](08_lineage.md) — 이론적 계보
- [09_my_research.md](09_my_research.md) — 내 연구와의 연결 (APF + Grokking)
- [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
- [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 3편
- [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
- [11_verdict.md](11_verdict.md) — 한 줄 판결
