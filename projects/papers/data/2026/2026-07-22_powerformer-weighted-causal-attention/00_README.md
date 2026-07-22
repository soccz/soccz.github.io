# Powerformer — 거듭제곱 인과 감쇠 어텐션으로 시계열을 예측하다

> **한국어 해체 (무배경 독자용 · 섹션 분할)**
> 2026-07-22 (수) · 인접 버킷 (§D TS transformer / TSFM interp)

---

## 원문 서지

- **원문 제목**: *Powerformer: A Transformer with Weighted Causal Attention for Time-series Forecasting*
  (AISTATS 2026 게재판 제목)
  — arXiv v2 에서는 *Recency Biased Causal Attention for Time-series Forecasting* 로 개제(改題)됨. 모델 이름은 그대로 **Powerformer**.
- **한국어 번역**: "Powerformer: 시계열 예측을 위한, 가중된 인과(因果) 어텐션 트랜스포머"
- **저자**: Kareem Hegazy, Michael W. Mahoney, N. Benjamin Erichson
- **소속**: UC Berkeley (Dept. of Statistics) · International Computer Science Institute (ICSI) · Lawrence Berkeley National Laboratory (LBNL)
- **발표처·연도**: AISTATS 2026 (제29회 인공지능·통계 학회, Proceedings of Machine Learning Research **Vol. 300**), Tangier, Morocco
- **canonical identifier**: **arXiv:2502.06151** · AISTATS 2026 (PMLR v300)

## Source Lock

- **canonical identifier**: arXiv:2502.06151 (v1 2025-02, v2 2026-04-22)
- **원문 URL/PDF**: `https://arxiv.org/abs/2502.06151` · 전문 HTML `https://arxiv.org/html/2502.06151v2`
- **확인한 버전**: arXiv **v2** 전문 HTML (1차 소스). 저자 공식 코드 `github.com/khegazy/Powerformer` 는 보조(2차) 확인용.
- **본문 접근 여부**: ✅ 전문 접근 성공 — abstract / §3 Method (Eq. 1·3·4·6, §3.3 편향 함수) / §4 Experiments (Table 1, §4.4 ablation, Fig. 1–4) / §5 Conclusion 위치 모두 원문에서 직접 확인.
- **§4-bis 3문 자기시험 통과**:
  - **Q1** 초록 첫 문장 verbatim — "Recency bias is a useful inductive prior for sequential modeling: it emphasizes nearby observations and can still allow longer-range dependencies."
  - **Q2** 주 결과 표 Table 1 수치 verbatim — Powerformer ETTh1(예측길이 96) **MSE 0.361** (baseline PatchTST 0.370).
  - **Q3** 방법 절 §3.2 "Recency-Biased Causal Attention", 정의식 **Eq. 6** `C_h^{(C,L)} = Softmax(S_h^{(C,L)})` + §3.3 거듭제곱 편향 `f^{PL}(t) = -α log(t)` verbatim.

## 태그

- 주 태그: `tsfm-interp` (시계열 파운데이션 모델 해석)
- 보조 태그: `pe-attention-geometry` (거리 기반 어텐션 편향 = ALiBi 계열) · `ts-transformer-baseline`

## 코드·데이터

- 코드 공개 ✅ — `github.com/khegazy/Powerformer` (저자 공식). 데이터셋은 모두 공개 표준 벤치마크(ETT·Weather·Electricity·Traffic).

## 한 줄 판결

> **ALiBi 의 지수 감쇠(exponential decay)를 "거듭제곱 꼬리(power-law tail)"로 바꿔 최근성 편향을 어텐션 로짓에 심은 시계열 트랜스포머 — APF 의 PE 비교 격자에 '거듭제곱 감쇠' 셀을 추가하고, 감쇠형 어텐션이 왜 해석 가능한지(§3.5)를 실증한 ALiBi 의 직계 시계열 후손. 내 PE–motif 축의 필수 대조군으로 핀.**

---

## 목차 (섹션 파일)

0. [메타 & 선정 이유](01_meta.md)
1. [3층 TL;DR](02_tldr.md)
2. [문제 지형도](03_problem.md)
3. [핵심 Claim 해체](04_claims.md)
4. 방법론 해부
   - [a. 직관 — 큰 그림](05_method_a_intuition.md)
   - [b. 표준 멀티헤드 어텐션과 인과 마스킹](05_method_b_standard_attention.md)
   - [c. 최근성 편향 마스크 (RBCA)](05_method_c_rbca_bias.md)
   - [d. 감쇠 함수 4종 (거듭제곱·버터워스·지수)](05_method_d_bias_functions.md)
   - [e. 정규화·복잡도·해석](05_method_e_regularization_interpretation.md)
5. [실험 해부](06_experiments.md)
6. [가정·한계·반박](07_limits.md)
7. [이론적 계보](08_lineage.md)
8. [내 연구와의 연결](09_my_research.md)
9. 사고 확장
   - [a. 자문 질문 5개](10_extensions_a_questions.md)
   - [b. Follow-up 논문 3편](10_extensions_b_followups.md)
   - [c. 실험 아이디어 2개](10_extensions_c_ideas.md)
10. [한 줄 판결](11_verdict.md)
