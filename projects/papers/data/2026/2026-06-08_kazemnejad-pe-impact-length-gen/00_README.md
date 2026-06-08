# 00 · README — 표지

## 원문
- **제목 (영)**: The Impact of Positional Encoding on Length Generalization in Transformers
- **제목 (한)**: 트랜스포머의 길이 일반화에 대한 위치 인코딩의 영향
- **저자**: Amirhossein Kazemnejad, Inkit Padhi, Karthikeyan N. Ramamurthy, Payel Das, Siva Reddy
- **소속**: McGill University · Mila · IBM Research · Facebook (Meta) AI · Canada CIFAR AI Chair
- **발표처**: NeurIPS 2023 (Thirty-seventh Conference on Neural Information Processing Systems)
- **연도**: 2023 (Accepted Sept 22, 2023 · Poster Dec 13, 2023)

## Source Lock
- **Canonical identifier**: arXiv:2305.19466 · OpenReview `id=Drrl2gcjzl` · NeurIPS 2023 Conference Proceedings
- **공식 출처 URL**:
  - arXiv abs: `https://arxiv.org/abs/2305.19466` (본 환경에서 HTTP 403)
  - OpenReview: `https://openreview.net/forum?id=Drrl2gcjzl` (본 환경에서 HTTP 403)
  - NeurIPS: `https://neurips.cc/virtual/2023/poster/72346` (본 환경에서 HTTP 403)
  - **저자 공식 코드 저장소 (대체 1차 출처)**: `https://github.com/McGill-NLP/length-generalization` (접근 가능 — README 및 코드 verbatim 확보)
  - HuggingFace 1B 모델 카드: `McGill-NLP/codellm_1b_{nope,rotary,alibi}` (본 환경에서 HTTP 403, 단 README 에서 명시적 인용 확인)
- **확인한 원문 버전**: 저자 공식 GitHub (`McGill-NLP/length-generalization`, branch=main, 최종 readme 갱신 Feb 18 2024) 의 README.md (abstract verbatim), configs/models/*.jsonnet (8 종 PE 구성 파일), results/runtime_efficiency.jsonl (wandb run config 메타데이터), src/models/custom_t5_decoder_only.py (코어 모델 구현).
- **본문 접근 여부**:
  - ✓ **Abstract**: 저자 호스팅 README 에서 verbatim 확보.
  - ✓ **Method (high-level)**: configs/models/ 8 종 PE 구성 + custom_t5_decoder_only.py 의 `POSITION_ENCODING_*` constant 분기로 검증.
  - ✓ **Experiment setup**: 저자 wandb run config (runtime_efficiency.jsonl) 에서 t5-base 백본, max_steps=40000, lr=3e-5, weight_decay=0.05, warmup_ratio=0.06, batch_size=64, decoder_only_block_size=128, scratchpad 변수 등 verbatim 확보.
  - ✗ **결과 표 · 정리 (Theorem) 증명 · 한계 섹션 본문**: PDF/HTML 본문 차단으로 직접 접근 불가. 본 해체는 원문 표의 절대 수치를 단정하지 않고, abstract · 코드 · config · 저자 보충자료 (HF 모델 카드 인용) 에서 확인 가능한 사실만 기록한다.

## 태그
- 주: `pe-attention-geometry` (PE × attention × length-gen)
- 보조: `attention-as-explanation` (NoPE attention pattern 의 T5-relative 유사성 발견), `causal-intervention` (PE 교체를 통한 ablation 형태)

## 코드 · 데이터 공개
- Code: ✓ `github.com/McGill-NLP/length-generalization` (Jsonnet 기반 t5-base 디코더 전용 구현, 8 종 PE, scan / s2s_addition / 기타 합성 데이터 처리기)
- Pretrained 1B-scale models: ✓ HuggingFace `McGill-NLP/codellm_1b_{nope,rotary,alibi}` (StarCoder 30B token, 32 head × d_model 1024 × d_ff 16384)
- Logged runs: ✓ WandB project `kzmnjd/len_gen` (단, results/runtime_efficiency.jsonl 의 일부만 repo 동봉)

## 한 줄 판결
**"명시적 PE 5종을 동렬로 비교한 뒤 NoPE 가 이긴다는 폭로형 결과는, APF 의 PE→motif sweep 에 있어 'PE 부재 = baseline 이 아니라 강력한 비교군' 이라는 6번째 PE 칸을 강제로 만들어주는 reference."**

## 목차
1. [01_meta.md](01_meta.md) — 메타 & 선정 이유
2. [02_tldr.md](02_tldr.md) — 3층 TL;DR (초등생 · 학부생 · 전문가)
3. [03_problem.md](03_problem.md) — 문제 지형도
4. [04_claims.md](04_claims.md) — 핵심 Claim 4개 해체
5. [05_method_a_setup.md](05_method_a_setup.md) — 방법론 (a) 비교 세팅
6. [05_method_b_five_pe.md](05_method_b_five_pe.md) — 방법론 (b) 5종 PE 수식 정리
7. [05_method_c_nope_theory.md](05_method_c_nope_theory.md) — 방법론 (c) NoPE 표현력 주장
8. [05_method_d_attention_kl.md](05_method_d_attention_kl.md) — 방법론 (d) Attention KL 분석
9. [06_experiments.md](06_experiments.md) — 실험 해부
10. [07_limits.md](07_limits.md) — 가정·한계·반박
11. [08_lineage.md](08_lineage.md) — 이론적 계보
12. [09_my_research.md](09_my_research.md) — 내 연구 (APF + Grokking) 와의 연결
13. [10_extensions_a_questions.md](10_extensions_a_questions.md) — 자문 질문 5개
14. [10_extensions_b_followups.md](10_extensions_b_followups.md) — Follow-up 3편
15. [10_extensions_c_ideas.md](10_extensions_c_ideas.md) — 실험 아이디어 2개
16. [11_verdict.md](11_verdict.md) — 한 줄 판결
