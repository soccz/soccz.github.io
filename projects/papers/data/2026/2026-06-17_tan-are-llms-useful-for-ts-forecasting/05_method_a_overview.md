# 05-a. 방법론 — 전체 그림 (3 ablation × 3 base × 7 데이터셋 격자)

## 배경 사다리

이 절을 이해하려면 ① **트랜스포머 백본** 이 "여러 self-attention + FFN 블록의 적층" 이라는 것, ② **forecast head** 가 "백본의 마지막 representation 을 미래 시점의 숫자로 변환" 하는 보통 1~2 층짜리 linear/MLP, ③ **ablation** 이 "한 부품을 빼거나 바꿔서 무엇이 essential 인지 측정" 하는 실험 방식을 알면 된다.

## 1) 평가 격자 — 4D 그리드

본 논문의 *실험 격자* 는 4축으로 정리할 수 있다.

| 축 | 값 |
|---|---|
| Ablation 타입 (3 + original) | original / w/o LLM / LLM2Attn / LLM2Trsf |
| Base method (3) | OneFitsAll (OFA / GPT4TS) / Time-LLM / CALF |
| 데이터셋 (7) | ETTh1, ETTh2, ETTm1, ETTm2, Weather, Traffic, Illness |
| Forecast horizon (4) | 96, 192, 336, 720 (long-term TSF 표준; Illness 는 24, 36, 48, 60 으로 다름) |

총 4 × 3 × 7 × 4 = **336 개의 실험 셀**. 거기에 LLaTA 까지 추가 비교, PAttn 까지 같은 격자에 올림 → 실제 commit 이 그 이상으로 커진다.

이 격자가 *왜 이 형태로* 잡혔는지:

- **ablation 4 단계 (original 포함)**: 원본 → 가장 강한 ablation (w/o LLM 전체 제거) → 중간 (LLM2Attn 1층 attention 교체) → 약한 ablation (LLM2Trsf 1층 transformer 블록 교체). 이 4-tier 가 *LLM 의 "어디까지" 가 무용한가* 를 단조적으로 묻는다. "통째로 빼도 같다" 와 "한 층으로 줄여도 같다" 사이의 *어떤 양 의 LLM 효용도 0* 임을 보여주는 분해.
- **base 3 + LLaTA**: LLM-for-TS 의 *세 가지 주요 패러다임* — (i) freeze + adapter only (OFA), (ii) input reprogramming + prompt (Time-LLM), (iii) cross-modal embedding alignment (CALF) — 를 모두 cover. LLaTA 는 lightweight LLM-TS 변형. 만약 한 패러다임만 했다면 "다른 방식은 다를 것" 이라는 반박이 가능했을 텐데, *세 종류 모두에서 동일 결론* 이라는 점이 결론의 robustness 핵심.
- **7 데이터셋**: long-term TSF 표준 벤치. Informer (Zhou 2021), PatchTST (Nie 2023) 등 모든 비교 가능. 데이터셋 다양성으로 *single-dataset overfitting* 가능성 배제.

## 2) 통제 변수 — *공정한 ablation* 을 위해 보존하는 것

ablation 의 신뢰성은 *변경하는 것 외에는 모두 동일* 일 때만 성립한다. 본 논문이 보존하는 것:

1. **입력/출력 인터페이스**: patch tokenizer, channel-independence 처리, normalization (RevIN 류), forecast head 의 구조. → ablation 셀 간에 fair 한 입력 흐름.
2. **하이퍼파라미터**: base method 의 *원본 하이퍼파라미터* 를 그대로 유지. 이는 "LLM 만 빼서 학습률을 더 잘 잡았다" 식의 비판을 차단.
3. **데이터 split / metric**: 표준 7:1:2 (또는 6:2:2) train/val/test split, MSE/MAE 평가.
4. **seed / averaging**: 본문에 *seed 평균 회수* 가 명시되어 있어야 robust 함 (Source Lock 미확인이지만, README 의 실험 스크립트가 5-seed runner 인 것으로 코드 추적 가능).

## 3) 변경 변수 — *오직 LLM 블록 부분만*

각 ablation 변형은 base model 의 **LLM 블록 부분만** 다음과 같이 교체:

- **w/o LLM**: LLM 블록 제거. 입력 어댑터 직출력 → forecast head 직입력. 즉 `Patch → Linear → (skip LLM) → Linear → Output`.
- **LLM2Attn**: LLM 블록을 *단일 무작위 초기화* multi-head attention 한 층으로 교체. attention 의 head 수·hidden 차원은 base model 의 표준과 일치 (예: `n_heads=16`, `d_model=768`).
- **LLM2Trsf**: LLM 블록을 *단일 무작위 초기화* transformer 블록 (attention + FFN + LN) 한 개로 교체.

여기서 핵심은 *"무작위 초기화"* (randomly-initialized) — 사전학습 가중치가 *완전히 없는* 단일 층. 이게 LLM 의 사전학습 가치 = 0 의 결정적 증거.

수식으로 보면 base method 의 forecasting 함수는

$$
\hat{y} = \mathrm{Head}\big( \mathcal{B}_\theta( \mathrm{Embed}(x) ) \big)
$$

으로 쓸 수 있는데, $\mathcal{B}_\theta$ 가 GPT-2 등 사전학습된 *수십~수억 파라미터 LLM 백본*. ablation 은 $\mathcal{B}_\theta$ 를 다음 셋 중 하나로 교체:

$$
\mathcal{B}_\theta \rightarrow \begin{cases}
\mathrm{Identity}, & \text{w/o LLM} \\
\mathrm{Attn}_{1\text{-layer}, \text{rand init}}, & \text{LLM2Attn} \\
\mathrm{Trsf}_{1\text{-block}, \text{rand init}}, & \text{LLM2Trsf}
\end{cases}
$$

**4줄 해석**:
1. *기호 뜻*: $x$ = 입력 시계열 (길이 $L$ 의 patch 시퀀스), $\mathrm{Embed}$ = patch → embedding 변환, $\mathcal{B}_\theta$ = LLM 백본, $\mathrm{Head}$ = forecast 출력 (보통 linear), $\hat{y}$ = 길이 $H$ 의 예측.
2. *일상 비유*: 비싼 외제 머리(LLM)와 입출력 깔때기(Embed/Head)로 된 깔때기-필터-깔때기 시스템. ablation 은 *가운데 필터를 빼거나 가장 싼 필터로 교체*.
3. *왜 이 형태*: forecast 함수를 *어댑터 / 백본 / 헤드* 의 3-stage 로 명시적으로 분해해야 백본만 ablation 가능. 이게 mech interp 의 *causal scrubbing* 정신 (Conmy ACDC, Wang IOI) 의 architecture-level 적용.
4. *조심할 점*: $\mathrm{Embed}$ 와 $\mathrm{Head}$ 의 파라미터 수가 충분히 크면 $\mathcal{B}_\theta$ 가 작아도 모든 변환을 어댑터가 떠안을 수 있다 → "LLM 백본 무용" 의 진짜 의미는 "이 setting 에서 백본은 어댑터로 흡수된다" 일 수 있음. 본 논문은 이 부분의 인과 분해는 부분적으로만.

## 4) 추가 axis — Sequence shuffling test

Claim 3 ("LLM 은 순차 의존성을 학습하지 않는다") 의 검증을 위한 추가 axis:

- **shuffle input**: 입력 patch 의 순서를 무작위 셔플 후 forecasting. LLM 백본의 표현이 *순서 정보* 를 활용한다면 shuffle 시 성능 폭락이 있어야 함.
- 본 환경에서 셔플 방식의 정확한 구현 (조각 단위? sample 전체? seed?) 은 단정 불가. README 에 별도 스크립트가 있을 가능성.

## 5) 추가 axis — Few-shot training

Claim 2 검증을 위한 추가 axis:

- 훈련 split 비율을 줄임 (5%, 10%, 25% 등). 정확한 비율은 본 환경 미확인.
- 같은 4 × 3 × 7 격자 위에서 few-shot 비교.

## 6) PAttn — 양성 baseline

위 격자와 *별개로* PAttn 베이스라인을 같은 7 데이터셋 × 4 horizon 에서 평가. 다음 절(`05_method_d_pattn.md`) 에서 자세히.

## 7) 전체 기여의 핵심 한 문장 요약

> **"LLM 백본의 *어디까지* 가 무용한지를, 3-tier ablation × 3-base × 7-dataset × 4-horizon 의 4D 격자로 분해해서, 어느 셀에서도 LLM 의 추가 가치가 0 또는 음수임을 보이고, 대안으로 patch + 1-layer attention 의 최소 베이스라인이 충분함을 양성 결과로 결합한 메타-ablation 논문."**
