# 09. 내 연구와의 연결

본 절은 `_profile.md` 의 관심 영역 §A~F + 보유 자산 (APF, Grokking, ProTran-TFA, EOA) 의 *구체적 mechanism / axis / 수식 요소* 를 지정하여 본 논문과의 연결을 설계한다. 일반론 ("이 논문은 시계열 모델에 참고 가능") 은 의도적으로 피하고, *어디에 어떤 수식을 어떻게 인용하는가* 를 구체화한다.

## A. APF (Attention Pattern Fields) 와의 연결 — §C, §D 직접

### 흡수할 기법 1 — PAttn 을 *APF 의 baseline backbone* 으로 채택

**현재 APF 상태** (보유 자산 `Attention Pattern Fields/`): "PE → 2D attention motif → CNN probe → causal intervention" framework 의 motif 검출 백본으로 *PatchTST 미니 변형* 을 쓰고 있음 (motif sweep n=8). 그러나 PatchTST 의 multi-layer 가 *motif 의 layer-wise 변화* 를 복잡하게 만들어 *clean motif causality* 측정이 어려움.

**채택 방식**: PAttn 의 *1-layer attention* 구조를 APF baseline 으로 채택. 이유:
- 1 layer 만 있으므로 *attention motif → forecast* 의 인과 경로가 *직접*. PE → 1-layer attention → forecast head 의 3-stage 가 명확.
- `d_model=768`, `n_heads=16` 의 GPT-2-equivalent 크기는 APF 의 motif typology (diagonal/stripe/block/edge/spike/checker) 에 충분한 head 다양성 제공.
- 코드가 *공개* (`PAttn/models/PAttn.py`) — bench reproduction 비용 ≈ 0.

**APF 의 *어디에* 인용할지**: APF `paper/sections/STATUS.md` 의 *experimental backbone* 절 (motif sweep n=8 의 base architecture 정당화 부분) 에 PAttn 의 *minimum sufficient* baseline 으로서의 위치를 인용. *문장 초안*:

> "We adopt the PAttn architecture (Tan et al., NeurIPS 2024) as our minimum sufficient baseline. Its single multi-head self-attention layer following patch tokenization isolates attention motifs from confounding multi-layer feature mixing, providing a clean attention map for our motif typology analysis."

### 흡수할 기법 2 — *LLM2Attn 변형* 을 PE motif causality 통제 실험으로

APF 의 PE 비교 (NoPE / sinusoidal / learned / RoPE / ALiBi) × motif 종류 sweep 에서 *통제군* 으로 *random-init 1-layer attention* 을 추가. 이게 본 논문의 LLM2Attn ablation 의 *PE 변종 적용*.

**가설**: PE 별 motif distribution 의 차이가 *진짜 PE 효과* 인지 *random init 변동* 인지 분리. random-init seed 5 개 × PE 5 종 × motif 6 종 = 150 셀의 motif distribution 비교.

**예상 결과**:
- 만약 random-init 변동이 PE 효과보다 크면 → APF 의 PE-motif causality 주장 *약화* (negative result, 논문 가치 있음).
- 만약 PE 효과가 random-init 변동을 *지배* 하면 → APF 의 주장 *robust 화*. 이 통제 실험 자체가 APF paper 의 § Robustness 부분에 들어감.

**APF paper 어디에 인용할지**: `paper/sections/methods.md` 의 *causal intervention* 절. *문장 초안*:

> "To rule out the possibility that motif diversity stems from random initialization variance rather than PE structure, we compare against an LLM2Attn-style control (Tan et al., 2024): 5 random-init seeds × PE schemes × motif categories. Motif distributions are reported with seed variance."

## B. Grokking in TS Transformers 와의 연결 — §A, §D 직접

### 충돌/경쟁 지점

**현재 Grokking track 가설** (보유 자산 `Grokking in Time Series Transformers/`): TS Transformer 가 충분한 학습 + non-stationarity 조건에서 *delayed generalization (grokking)* 을 보일 수 있음. P2 logistic 4-layer 실험 진행 중.

**본 논문이 던지는 도전**: "TS Transformer 의 *진짜 학습 영역* 이 patch + 1-layer attention + projection 의 *얕은* 부분이라면, *deep (multi-layer)* 가 필요한 grokking 이 *처음부터 발생하지 않는다*" 라는 가능성. 즉 본 논문의 *PAttn 충분* 결과는 *Grokking track 자체의 raison d'être* 를 위협한다.

**어떻게 응답할지**:
1. *Grokking-friendly TS task* 정의: 본 논문이 다룬 long-term TSF (ETT/Weather/Traffic) 는 *얕은* task — patch correlation 으로 풀림. Grokking 이 발생하는 task 는 *modular arithmetic* 같은 *구조적* task. TS 의 *modular arithmetic 등가물* — 예: *Lorenz 시스템의 long-horizon 예측*, *logistic map 의 chaotic iterate* — 에서는 *깊이* 가 필수일 가능성.
2. *PAttn 의 e_layers scan*: PAttn 의 `e_layers=1,2,4,8` 을 logistic map 데이터에서 학습. *깊이가 늘수록 grokking* 이 발생하는가? 만약 *깊이 8 에서만* delayed generalization 이 보이면 → Grokking track 의 *task 범위* 가 명확.
3. *본 논문 결과를 Grokking paper 의 § Background 에 반영*: "In standard long-term TSF benchmarks, deep transformers are no better than 1-layer attention (Tan et al., 2024). However, grokking-relevant TS tasks differ structurally — chaotic iterates, modular generation, etc. — and our results target this distinct regime."

**Grokking paper 어디에 인용할지**: `paper/PAPER_PLAN.md` 의 *§ Introduction* 과 *§ Background — Why TS grokking should exist despite shallow-attention sufficiency*. *문장 초안*:

> "Tan et al. (NeurIPS 2024) recently showed that for standard long-term TSF benchmarks (ETT, Weather, Traffic, Illness), deep LLM backbones provide no additional value over a single attention layer. This presents a sharp boundary condition for grokking research: if grokking requires depth, it cannot emerge in these benchmarks. We therefore restrict our grokking experiments to structurally distinct TS tasks (chaotic iterates, regime-switching synthetic) where shallow models demonstrably fail."

### 흡수할 기법 — 본 논문의 baseline 자체 채택

Grokking track 의 P2 logistic 4-layer 실험 에서 *비교 baseline* 으로 PAttn-1L vs PAttn-2L vs PAttn-4L vs PAttn-8L 의 scan 을 자연스럽게 추가. 깊이별 grokking 발생률을 plot 하면 *깊이가 grokking 의 필요조건* 임을 정량화.

## C. ProTran-TFA (P1 paused) 와의 연결 — §E 직접

### 흡수할 기법 — 본 논문의 *반-LLM* 메시지를 fin-TS 에 적용

**현재 ProTran-TFA 상태**: `paused`. paper/PAPER_DRAFT_V1.md 와 protran_tfa/ 코드. probabilistic Transformer 의 finance 응용 (IJF/QF venue 가능). 핵심 가설: 변동성 / quantile / distributional forecast 가 금융 시계열에서 LLM 대신 *작은 probabilistic transformer* 로 충분.

**본 논문의 *직접 인용 포인트***:
- ProTran-TFA paper 의 § Related Work — *LLM-for-finance* 의 한계를 본 논문 인용으로 강조.
- *문장 초안*: "Recent ablation studies show that for standard time series forecasting, LLM backbones provide no measurable advantage over a single patch-attention layer (Tan et al., NeurIPS 2024). We extend this skeptical baseline to financial probabilistic forecasting: instead of LLM-finance hybrids, we ground our model in a minimal probabilistic transformer."

### 흡수할 기법 — PAttn + Quantile head 의 변형 제안

PAttn 의 last layer 인 `Linear out_layer (d_model × N_patch → pred_len)` 을 *quantile heads* (예: 9-quantile output for τ=0.1, 0.2, …, 0.9) 로 갈아끼움. 즉 **PQuantAttn**.

- 학습 손실: pinball loss × 9 quantile 평균.
- 평가: CRPS, MSIS, quantile loss 곡선.
- 비교: ProTran (Tang-Matteson NeurIPS 2021; 2026-05-19 cover), QuantileFormer (Shao IJCAI 2025; 2026-05-19 cover), Time-LLM + quantile head.

이게 *Tan 2024 의 양성 베이스라인 (PAttn) 을 분포 forecast 로 확장* 한 직접적 응용. ProTran-TFA paper 의 *방법* 절에서 *baseline + minimal extension* 으로 채택.

## D. EOA (Paper 4 shelved) 와의 연결 — §D 약함

EOA 는 Economic ODE Attention — economic time axis (event-density time) 위에서 attention 정의. 본 논문과의 연결은 *간접*. 본 논문의 *셔플 실험* (Claim 3) 결과는 EOA 의 핵심 가설 ("attention 이 wall-clock time 의 순서를 본질로 한다" 의 반대) 에 *수렴* 함:

- 본 논문: LLM-based forecaster 는 *순서를 안 본다*.
- EOA: forecaster 는 wall-clock 순서가 아니라 *economic time 순서* 를 봐야 한다.

두 메시지를 *논리적으로 종합*: "wall-clock 순서를 안 보는 LLM forecaster 는 *어떤 다른 순서* 를 보는가? EOA 의 economic time 이 그 답이 될 수 있다." 만약 EOA 가 재개되면 본 논문의 셔플 결과를 *motivation* 으로 인용 가능. *현재 EOA shelved 라 즉시 적용은 안 함*.

## E. 인용 포인트 — 한 줄 요약

| 내 자산 | 인용 위치 | 인용 형태 |
|---|---|---|
| APF paper § Methods (motif backbone) | `paper/sections/methods.md` | "We adopt PAttn (Tan 2024) as minimum sufficient baseline for clean motif causality measurement." |
| APF paper § Robustness | `paper/sections/methods.md` | "Random-init control (Tan 2024 LLM2Attn-style) rules out init variance confounding." |
| Grokking paper § Background | `paper/PAPER_PLAN.md` § 2 | "Tan 2024 sharpens our task boundary: grokking research must focus on structurally deep TS tasks (chaotic, modular)." |
| Grokking paper § Methods | `paper/PAPER_PLAN.md` § 4 | "Depth scan (1/2/4/8 layers, PAttn-style) quantifies depth-as-necessary-condition for grokking." |
| ProTran-TFA paper § Related Work | `paper_test/PAPER_DRAFT_V1.md` § 2 | "Tan 2024 motivates baselining against minimal patch-attention (PAttn) rather than LLM-finance hybrids." |
| ProTran-TFA paper § Methods | `paper_test/PAPER_DRAFT_V1.md` § 3 | "PQuantAttn = PAttn + 9-quantile head, extends Tan 2024 baseline to probabilistic forecasting." |

## F. 반면교사

본 논문이 *못한 것* 중 내가 다룰 가능성:

1. **본 논문은 *분포 forecast* 를 안 다룸**. ProTran-TFA 에서 이걸 *직접* 다룬다. "Tan 2024 가 못 다룬 영역 = 분포 / tail-aware / 금융 응용" 이라는 niche.
2. **본 논문은 *zero-shot* 을 안 다룸**. Grokking track 의 *out-of-distribution generalization* 측면이 이걸 다룰 수 있음. "Tan 2024 + Lyle 2025 (continual + non-stationarity) 의 합성" 이라는 angle.
3. **본 논문은 *attention pattern 자체* 를 분석 안 함**. APF 가 이걸 *정면* 으로 다룬다. "Tan 2024 의 PAttn 위에서 attention motif typology 를 측정" 이라는 niche.

이 셋이 *나의 niche window* 의 핵심 — 본 논문 이후의 *blank space*.

## G. 한 줄 요약 — 본 논문의 *전이 가치*

> **"PAttn 1-layer = APF 의 정제된 baseline, LLM2Attn-style random-init control = APF 의 robustness 검증, 본 논문의 셔플 결과 = EOA / Grokking 의 motivation. 음성 결과 (LLM 무용) 는 ProTran-TFA 의 minimal 노선을 정당화, 양성 결과 (PAttn 충분) 는 APF/Grokking 의 baseline 자체."**
