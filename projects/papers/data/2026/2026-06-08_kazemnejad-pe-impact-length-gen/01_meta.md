# 01 · 메타 & 선정 이유

## 인용 · 식별자
- **인용 수**: 본 환경에서 Semantic Scholar / Google Scholar 접근 모두 HTTP 403 → 미확인. 2026-06 시점 정성적 관찰: 본 논문은 NoPE (No Positional Encoding) 라는 용어를 표준화시킨 reference 로 후속 PE 연구 (Yang TAPPA 2026, Kazemnejad 가 인용한 FIRE 2024, DAPE 2024 등) 가 사실상 "Kazemnejad et al. (2023) 의 NoPE 실험을 따라" 라는 식으로 인용함. 정확한 인용 수치는 원문 출처 접근 불가.
- **Canonical**: `arXiv:2305.19466` · `OpenReview Drrl2gcjzl` · NeurIPS 2023.
- **저자 권위 배경**:
  - **Amirhossein Kazemnejad** — McGill University · Mila 의 박사과정생 (Reasoning 연구라인). 본 논문 publication 이후 LongLoRA / scratchpad / chain-of-thought 라인의 PE 분석으로 인용된다.
  - **Inkit Padhi** / **Karthikeyan N. Ramamurthy** / **Payel Das** — IBM Research. Padhi & Das 는 IBM 의 foundation model 그룹. Ramamurthy 는 분석론 baseline 연구 다수.
  - **Siva Reddy** — McGill / Mila / Facebook AI 의 교수, Canada CIFAR AI Chair. NLP reasoning 평가 (CoQA 등) 의 저자.
  - 저자진은 PE 자체의 새 기법을 제안하는 그룹이 아니라 "PE 의 영향을 회로/평가 관점에서 본 그룹" 이라는 점이 중요하다. 그래서 NoPE 라는 "PE 부재" 라는 결과가 더 신뢰성을 얻는다 (PE 신 기법 옹호의 incentive 가 작다).

## 근거 지도 (Evidence Map)

본 해체에 사용한 원문 위치 — 본 환경에서 PDF 본문 직접 접근은 불가하므로, 저자 공식 자산에서 확인 가능한 근거만 사용한다.

| 항목 | 위치 | 본 환경 접근 |
|---|---|---|
| Abstract (verbatim) | 저자 공식 repo README.md `Abstract` 절 | ✓ 직접 확보 |
| 5 + 추가 PE 종류 | `configs/models/pe_{none,t5,alibi,rotary,abs_sin,abs_lrnd,alibi_lrnd,newRot,txl,rotary_rerun}.jsonnet` | ✓ 직접 확보 |
| 모델 백본 (custom decoder-only T5) | `src/models/custom_t5_decoder_only.py` (POSITION_ENCODING_* 분기) | ✓ 부분 확보 |
| Training hyperparam | `results/runtime_efficiency.jsonl` (wandb run config 메타데이터) | ✓ 직접 확보 |
| 1B-scale CodeLLM 후속 | README 1B Scale Pretrained Models 절 | ✓ 직접 확보 |
| Attention KL 분석 메서드 | `src/analyzers/attention_kl_analyzer.py`, `notebooks/plot_attention_distance_final.ipynb` | ✓ 코드 fragment 확보 |
| 정리 (NoPE 표현력) 증명 / 본문 그림 / 본문 표 | 논문 PDF 본문 (현재 차단) | ✗ 본문 미확보 → 본 해체에서 절대 수치 단정 안 함 |
| 한계 섹션 | 논문 PDF 본문 (현재 차단) | ✗ 본문 미확보 → README 의 "Important Note" 와 abstract 의 함의로 보강하고 한계로 표기 |

원문에서 직접 확인하지 못한 수치는 본 해체 전반에서 "원문 본문 미확보" 로 처리한다.

## 선정 이유 (오늘 이 시점에 내가 이걸 봐야 하는 이유)

`_profile.md` 와 `_index.md` 의 두 active track 관점에서 본 논문의 의의는 매우 명확하다.

1. **APF (Attention Pattern Fields) 의 PE sweep 설계와 직접 충돌·합류**.
   APF 의 핵심 sweep 은 PE ∈ {NoPE, sinusoidal, learned, RoPE, ALiBi} × motif 종류 (diagonal/stripe/block/edge/spike/checker) 이다. 본 논문은 **정확히 동일한 5 종 PE** 를 통제 비교한 NeurIPS 2023 paper 이며, 결과적으로 "NoPE 가 길이 일반화에서 가장 강하다" 는 결과를 낸다. APF 가 "PE → 2D attention motif → CNN probe → causal intervention" 을 주장하려면, NoPE 가 "기본적으로 약한 ablation" 이 아니라 "강한 baseline" 임을 인정하고 시작해야 한다. 본 논문은 그 인정을 강제하는 reference 이다.

2. **`_coverage.md` 의 `pe-attention-geometry` 태그가 1 회 cover · 마지막 2026-05-04 로 가장 뒤처짐**. 5-04 의 TAPPA (Yang et al. 2026) 는 PE 의 frequency 채널 관점이 강하지만 "PE 없으면 어떤가" 라는 음의 대조군이 약했다. 본 논문은 그 음의 대조군 역할을 한다.

3. **`_index.md` Priority 목록의 "(NeurIPS 2023) Kazemnejad et al. PE length-gen" 행은 식별자가 `(NeurIPS 2023)` 로만 적혀있어 Source Lock 전 후보였다**. 본 해체에서 canonical identifier 를 `arXiv:2305.19466` / `OpenReview Drrl2gcjzl` 로 확정하고 priority 목록을 보강한다.

4. **Grokking track 측면**. NoPE 가 "PE 가 없으니 학습 초기 표현 폭발 / 늦은 일반화" 형태의 grokking-유사 dynamics 를 보이는지는 본 논문에서 분석 대상이 아니다. 그러나 PE 의 유무 자체가 "early memorization → late generalization" 의 phase 를 가른다면, Grokking in TS Transformers 의 P2 logistic 실험에 NoPE 변수가 추가될 수 있다. 이는 본 해체의 §10.c 에서 후속 아이디어로 발전시킨다.

5. **Axis balance**. 최근 4 주 코어 버킷에서 §C (attention-PE) 는 2 회 (TAPPA, Jain-Wallace), §A (grokking) 2 회, §B (mech-interp) 1 회. §C 의 "PE geometry" 칸은 1 회뿐이라 우선순위가 가장 높다. 본 논문은 §C 의 두 번째 칸을 채운다.

## 정직한 한계 시인 (Selection 단계)
- 본 환경에서 arXiv·OpenReview·NeurIPS proceedings·저자 PDF (kazemnejad / mila 페이지) 모두 차단. 저자 공식 GitHub 만 접근 가능.
- 결과적으로 본 해체는 **"논문의 코드 + abstract + 자산"** 을 1차 출처로 사용하고, **"논문 본문 표/그림/정리"** 는 본문 미확보로 추정하지 않는다.
- 본 해체의 모든 수치 단정은 wandb run config (jsonl) 에서 verbatim 확인된 hyperparam 으로 국한한다.
