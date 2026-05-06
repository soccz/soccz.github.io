# Progress Measures for Grokking via Mechanistic Interpretability

> 메커니즘 해석으로 그로킹의 진행도를 재는 법

## 메타

- **원문 제목**: Progress Measures for Grokking via Mechanistic Interpretability
- **한국어 번역**: 메커니즘 해석으로 측정하는 그로킹 진행도
- **저자**: Neel Nanda · Lawrence Chan · Tom Lieberum · Jess Smith · Jacob Steinhardt
- **소속**: Independent · Anthropic / UC Berkeley · DeepMind · UC Berkeley
- **발표처**: ICLR 2023 (poster)
- **arXiv ID**: [2301.05217](https://arxiv.org/abs/2301.05217) (제출 2023-01-12)
- **태그(주)**: `mech-interp-circuits` / `grokking-delayed-gen`
- **태그(보조)**: `causal-intervention` / `training-dynamics`
- **코드·데이터**: 공개. 저자 블로그 + Colab 노트북, 별도 GitHub 레포 (`mechanistic-interpretability/grokking`) 으로 reproduction 사례 다수.
- **본문 접근 상태(2026-04-27)**: arXiv abs / pdf / html / ar5iv / alphaxiv / Semantic Scholar / OpenReview 7개 소스 모두 403 차단. 본 해체는 **(a) 공개 abstract·인용·후속 연구(Wang 2024, Merrill 2023, Lyle 2025)에서 직접 인용된 결과**, **(b) 사용자가 사전 보유한 Power 2022 / Liu 2022 등 인접 문헌 사실관계**, **(c) 1-layer attention transformer 의 Fourier modular-addition 회로에 대한 표준 수식 유도** 위에서 작성됐다. 추정 부분은 §5·§6에 명시.

## 한 줄 판결

> "Grokking 은 generalization 의 지연이 아니라 circuit cleanup 의 지연이다 — 그리고 진행도는 회로의 Fourier sparsity 로 직접 잴 수 있다." Grokking active track 의 **이론 척추** 논문이며, APF 가 motif 진행도를 측정할 때 베껴야 할 *progress measure* 의 원형이다.

## 목차

- `00_README.md` — 본 페이지
- `01_meta.md` — 0. 메타 & 선정 이유
- `02_tldr.md` — 1. 3층 TL;DR
- `03_problem.md` — 2. 문제 지형도
- `04_claims_a_circuit.md` — 3. Claim 1 (Fourier 회로의 발견)
- `04_claims_b_progress.md` — 3. Claim 2~3 (Progress measure & 3단계 동학)
- `05_method_a_intuition.md` — 4. 방법론 ① 큰 그림
- `05_method_b_modadd.md` — 4. 방법론 ② Modular addition setup
- `05_method_c_fourier_circuit.md` — 4. 방법론 ③ Fourier 회로 수식
- `05_method_d_progress_measures.md` — 4. 방법론 ④ 세 progress measure
- `05_method_e_implementation.md` — 4. 방법론 ⑤ 구현 디테일
- `06_experiments.md` — 5. 실험 해부
- `07_limits.md` — 6. 가정·한계·반박
- `08_lineage.md` — 7. 이론적 계보
- `09_my_research.md` — 8. 내 연구와의 연결 (APF + Grokking track)
- `10_extensions_a_questions.md` — 9. 자문 질문 5개
- `10_extensions_b_followups.md` — 9. Follow-up 3편
- `10_extensions_c_ideas.md` — 9. 후속 실험 아이디어 2개
- `11_verdict.md` — 10. 한 줄 판결
