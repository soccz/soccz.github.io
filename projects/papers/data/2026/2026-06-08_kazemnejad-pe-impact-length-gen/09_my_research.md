# 09 · 내 연구 (APF + Grokking) 와의 연결

본 절은 본 논문이 `_profile.md` 의 두 active track — **APF (Attention Pattern Fields)** 와 **Grokking in TS Transformers** — 와 어떻게 연결되는가를 구체 mechanism / 수식 요소 / 보유 자산 단위로 매핑한다. 일반론 금지, 정확한 path / 수식 요소를 지정.

## 연결 강도 평가 — solid (§C 와 매우 강, §A 와 중간, §D 와 약)

| 관심 영역 | 연결 강도 | 핵심 매핑 |
|---|---|---|
| §A Grokking | 중간 | NoPE 와 grokking phase 동학의 관계 (검증 가능 가설) |
| §B Mech interp | 강 | KL 분석 protocol = motif probe 보완 |
| §C Attention-PE | 매우 강 | 5 종 PE 비교 protocol 이 APF PE sweep 의 직접 reference |
| §D TS transformers | 약 | 본 논문 자연어 한정, TS 로의 전이 가능성만 |
| §E 금융 응용 | 거의 없음 | 직접 응용 안 됨 |
| §F 원거리 | 약 | scratchpad / CoT 분석의 형식 인식 |

## 1. APF (Attention Pattern Fields) 와의 연결 — 핵심

### 1.1 PE sweep 의 직접 reference

APF 의 핵심 sweep table:
$$\text{APF sweep: } \mathrm{PE} \in \{ \mathrm{NoPE}, \mathrm{sinusoidal}, \mathrm{learned}, \mathrm{RoPE}, \mathrm{ALiBi} \} \times \text{motif} \in \{\text{diag}, \text{stripe}, \text{block}, \text{edge}, \text{spike}, \text{checker}\}$$

본 논문의 PE 통제 protocol 이 **APF sweep 의 PE 축에 대한 NeurIPS 2023 reference baseline 그 자체**. 따라서 APF 의 PE sweep 결과 절은 이 논문을 다음 형태로 인용해야 한다:

**APF 인용 초안 (Section 4.x — PE sweep 결과 도입부)**:
> "Kazemnejad et al. (NeurIPS 2023, arXiv:2305.19466) 의 통제 비교 protocol 을 기반으로, 본 절은 5 종 PE 의 motif 형성 능력을 비교한다. Kazemnejad et al. 이 reasoning task 에서 NoPE 의 길이 일반화 우위를 보였다면, 본 연구는 attention motif 의 정성적 형태 차이가 그 우위의 source 일 수 있는지를 motif probe 와 causal intervention 으로 검증한다."

### 1.2 APF 의 motif probe 와 본 논문의 KL 분석의 결합

본 논문의 KL 분석 ( `src/analyzers/attention_kl_analyzer.py`) 은:
- Reference = NoPE attention
- 비교 = 각 명시 PE attention
- Output = KL divergence

APF 의 motif probe (현재 진행 중 실험):
- Input = attention map
- Output = motif 종류 분류 + 강도

→ **결합 방식**: NoPE attention 의 motif 종류 분류 결과를 reference 로 두고, 각 명시 PE 의 motif 종류 분류 결과와 비교. 본 논문의 KL 분석은 "attention 분포 거리" 만 보지만, APF motif probe 는 "motif 종류" 까지 분류 — APF 가 한 단계 더 mechanistic.

**APF 의 실험 protocol 보강 (구체)**:
1. NoPE 모델의 attention map 을 motif probe 로 분류 → motif 종류 분포 $P_{\text{NoPE}}$.
2. 명시 PE 모델의 attention map 을 motif probe 로 분류 → $P_{\mathrm{PE}}$.
3. $\mathrm{KL}(P_{\text{NoPE}} \,\|\, P_{\mathrm{PE}})$ 계산. 본 논문 결과의 attention-level 닮음이 motif-level 에서도 유지되는지 검증.

이 실험은 APF status (motif sweep n=8) 의 **n=9 칸 (NoPE) 으로 정확히 자리매김**. 현재 APF status: TMAO method falsified at n=12, motif causality 실험 진행 중. NoPE 가 motif sweep 에 빠져 있다면 빠르게 추가해야 한다.

### 1.3 PE → 2D motif 가설의 부분적 부정 / 확인

APF 가설: "PE 가 2D attention motif 의 형태를 결정한다."

본 논문 결과의 함의:
- NoPE 가 motif 를 형성할 수 있음 → PE 가 motif 의 **유일** 결정자 가 아님. APF 의 hypothesis 는 "PE 가 motif 의 한 결정자" 로 약화해야 가능.
- NoPE attention 이 T5-rel 과 닮음 → 명시 PE 의 motif 가 학습 가능한 (PE 가 더해주는 inductive bias 외에 SGD 가 emerge 시킬 수 있는) 부분도 있다. APF 의 motif probe 가 PE 의 효과와 SGD 의 효과를 분리할 수 있어야 인과적 결론 가능.

**APF 인용 포인트 (Section 5.x — 한계 인정)**:
> "Kazemnejad et al. (2023) 가 NoPE 가 explicit PE 없이도 T5-relative 와 유사한 attention 을 형성함을 보였다. 본 연구의 motif probe 가 'PE 가 motif 의 결정자' 라는 주장을 하려면, 동일 motif 가 NoPE 에서도 emerge 하는지의 control 실험이 필요하다 (§5.3 참조)."

### 1.4 APF 의 causal intervention 과 본 논문의 missing piece

본 논문은 attention KL 만 측정 — **causal intervention 안 함**. APF 의 강점은 motif intervention (motif 를 인공적으로 attention 에 강제하고 출력 변화 측정).

**APF 의 differentiator (본 논문 대비)**:
- 본 논문 측정: 학습된 NoPE 와 PE attention 의 분포 닮음 (상관)
- APF 측정 (제안): NoPE 의 motif 를 명시 PE 모델에 강제 swap 후 출력 변화 (인과)

→ **APF 의 contribution 한 줄**: "Kazemnejad 가 NoPE 와 T5-rel 의 attention 닮음을 보였다면, 본 연구는 motif causality intervention 으로 그 닮음이 출력 동등성으로 이어지는지 검증한다."

### 1.5 APF 의 paper STATUS.md 갱신 필요 (구체)

`/mnt/20t/fin/Attention Pattern Fields/paper/sections/STATUS.md` 에 다음 라인 추가:
> "NoPE control 추가: motif sweep 에 NoPE (no_pe = baseline 0) 칸 추가. Kazemnejad NeurIPS 2023 인용 + KL 분석 결과 보완. 우선순위: high."

`/mnt/20t/fin/Attention Pattern Fields/PRIOR_ART.md` 에 다음 항목 추가:
> "Kazemnejad et al. (2023) NeurIPS — arXiv:2305.19466 · OpenReview Drrl2gcjzl. PE 5 종 (NoPE, APE, T5-rel, ALiBi, Rotary) 의 통제 비교. NoPE 가 reasoning task length-gen 에서 명시 PE 모두 능가. attention KL 분석으로 NoPE attention 이 T5-rel 과 가장 닮음. APF sweep 의 reference baseline."

## 2. Grokking in TS Transformers 와의 연결

### 2.1 NoPE 와 grokking phase 의 관계 (검증 가능 가설)

본 논문은 grokking 을 직접 다루지 않는다. 그러나 grokking 의 핵심 — "long memorization → late generalization phase transition" — 은 PE 의 inductive bias 와 강하게 결합한다.

**가설 (Grokking track 추가 가설)**:
> "NoPE 모델은 명시 PE 모델보다 더 늦게 일반화한다 (grokking 같은 phase transition 더 뚜렷). 명시 PE 의 inductive bias 가 즉시 일반화 가능한 솔루션을 제공하는 반면, NoPE 는 implicit 위치 신호를 학습해야 하므로 memorization phase 가 더 길다."

이 가설은 본 논문이 직접 묻지 않은 question. Grokking track 의 P2 logistic 4-layer 실험에 NoPE 변수를 추가하면 검증 가능.

**Grokking 인용 포인트 (P2 logistic 실험 design)**:
> "Kazemnejad et al. (2023) 가 NoPE 가 명시 PE 보다 길이 일반화에서 우위임을 보였다. 본 실험은 그 우위가 grokking-like phase transition 의 결과인지를 logistic map 의 chaotic regime 에서 검증한다 — NoPE 가 더 늦은 generalization onset 을 가지면서 더 큰 final accuracy 를 달성하는지."

### 2.2 PE 가 training dynamics 에 미치는 영향

`_index.md` 의 Tier 3 priority 에 있는 **Liu et al. 2022 (Effective Theory of Representation Learning, 2026-05-25 covered)** 의 4-phase diagram 과 본 논문을 결합:

- Liu 의 phase diagram: 데이터 분율 / 가중치 decay 의 grid 위에서 memorization vs generalization phase 가 갈림.
- 본 논문: PE 가 그 phase 분포에 영향을 줄 수 있는 변수.
- 결합 가설: "Liu 의 4-phase diagram 을 PE × data-fraction grid 로 확장하면, NoPE 가 generalization phase 의 boundary 를 다른 방향으로 이동시키는지" — 검증 가능.

**Grokking 인용 포인트 (must_cite.md 추가)**:
> "Liu et al. (2022) 의 effective theory 4-phase diagram 을 PE 변수로 확장. Kazemnejad et al. (2023) 의 NoPE 우위 결과가 phase boundary 의 이동으로 해석 가능한지의 가설을 P2 logistic 실험으로 검증."

### 2.3 Grokking 의 must_cite.md 갱신 (구체)

`/mnt/20t/fin/Grokking in Time Series Transformers/references/must_cite.md` 에 다음 추가:
> "Kazemnejad et al. (2023) NeurIPS, arXiv:2305.19466 — PE 5 종 통제 비교. NoPE 우위 발견. Grokking track 의 PE 변수 통제 실험의 reference. 가설: NoPE 가 명시 PE 보다 더 늦은 grokking phase transition 을 가짐."

## 3. 충돌 / 경쟁 지점 (정직)

### 3.1 APF 의 "PE 가 motif 의 결정자" 와 본 논문의 "NoPE 도 motif 형성 가능"

- **충돌**: APF 가 강한 형태로 "PE → motif" 를 주장하면 본 논문이 부분 반박.
- **수용 방법**: APF 의 hypothesis 를 "PE 가 motif 의 sole determinant" 에서 "PE 가 motif 의 one source, SGD 의 emergence 가 또 다른 source" 로 약화. 본 논문 결과를 명시 인정.

### 3.2 본 논문의 "scratchpad 양면성" 과 APF 의 motif intervention 의 task 의존성

- **본 논문의 함의**: Scratchpad format 이 attention 패턴을 바꾼다. 따라서 APF 의 motif intervention 결과가 task / format 의존일 수 있음.
- **수용 방법**: APF 의 실험 protocol 에 scratchpad / task layout 통제 변수를 명시. "동일 scratchpad config 안에서 motif intervention" 의 형식.

## 4. 반면교사 (본 논문이 못한 것을 내가 어떻게 다룰지)

### 4.1 인과 검증의 부재
- 본 논문은 KL 측정만 — attention 분포 닮음의 상관만 본다.
- APF 의 motif intervention 이 정확히 이 gap 을 채우는 contribution. "Kazemnejad et al. 이 상관을 보였다면, 본 연구는 인과를 본다" 라는 framing.

### 4.2 자연어 / 코드 LM 으로의 일반화 미확인
- 본 논문은 reasoning task 한정. 1B-scale CodeLLM 은 별도 contribution 으로 분리.
- APF / Grokking 의 TS 도메인 일반화는 본 논문 framework 의 직접 확장. **"PE 의 영향이 도메인 의존" 을 TS 에서 검증한다** 가 APF 의 contribution 한 줄로 가능.

### 4.3 분산 / 통계적 유의성 보고 형식
- 본 논문이 3 seed 만 사용. 분산 정확한 형식 본문 미확인.
- APF / Grokking 에서는 5+ seed 와 신뢰 구간 명시. "Kazemnejad et al. (3 seed) 의 결론을 5+ seed 로 강화"

## 5. 구체 인용 초안

### APF paper Introduction 의 motivation
> "Recent work has shown that explicit positional encodings (PE) — sinusoidal, T5-relative, ALiBi, Rotary — are not necessarily helpful for length generalization in decoder-only Transformers. Kazemnejad et al. (NeurIPS 2023) report that No-PE (NoPE) outperforms all five explicit PE schemes on reasoning tasks and that its attention pattern most closely resembles T5-relative. This finding raises a deeper mechanistic question: if NoPE emerges T5-rel-like attention by SGD alone, what is the role of explicit PE — does it merely shortcut the emergence of certain motifs, or does it introduce qualitatively distinct motifs that explicit interventions can reveal? The present work (Attention Pattern Fields) answers this question by introducing a motif probe and causal intervention framework."

### APF paper Related Work — PE comparison subsection
> "The closest related work is Kazemnejad et al. (2023), who systematically compared five PE schemes (NoPE, APE, T5-rel, ALiBi, Rotary) on length generalization. They measured KL divergence between NoPE attention and each explicit PE's attention and found T5-relative to be the closest. Our work extends this in two directions: (a) we classify attention patterns into a discrete motif taxonomy (diagonal/stripe/block/edge/spike/checker) rather than measuring distributional distance, and (b) we causally intervene on motifs via swap and ablation to test whether motif identity drives output behavior."

### Grokking paper Section 2 — Background
> "Positional encoding (PE) interacts with training dynamics in a way that has not been studied for grokking. Kazemnejad et al. (2023) found that NoPE generalizes better than explicit PE on reasoning tasks, but did not analyze the training dynamics of this gap. We hypothesize that NoPE exhibits a more pronounced grokking-like delayed generalization than explicit PE, because NoPE must learn implicit positional features via SGD while explicit PE provides them as inductive bias from step 0. We test this hypothesis on logistic map prediction (§4)."

## 핵심 한 문장 요약
"본 논문은 APF 의 PE → motif 가설을 'NoPE 도 motif 형성' 으로 약화시키지만, 동시에 APF 의 motif probe + causal intervention 의 차별점 (vs Kazemnejad 의 KL 상관) 을 명확히 한다. Grokking track 에서는 NoPE 의 phase transition 가설이라는 새 실험 도메인을 연다."
