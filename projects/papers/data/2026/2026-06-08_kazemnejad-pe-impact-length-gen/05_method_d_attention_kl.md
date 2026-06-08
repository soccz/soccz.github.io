# 05 · 방법론 (d) — Attention KL 분석

본 절은 Claim 3 ("NoPE attention 이 SGD 학습 후 T5-relative PE attention 과 가장 유사") 의 측정 도구인 attention KL 분석을 다룬다. **저자 공식 코드 verbatim 에서 분석기의 존재가 확인** 되며, 이는 APF 의 motif probe 와 직접 비교 가능한 형태.

## 배경 사다리
이 절을 이해하려면 ① "KL divergence" 가 두 확률 분포의 유사도 (정확히는 비대칭 "거리") 측정이라는 것, ② attention 의 출력 가중치가 0~1 의 확률 분포라는 것, ③ 같은 위치에 있는 토큰 페어를 PE 별 모델에서 모은 뒤 분포 비교한다는 점만 알면 된다.

## 1. KL divergence 의 직관

두 확률 분포 $p, q$ 에 대해:
$$\mathrm{KL}(p \,\|\, q) = \sum_x p(x) \log \frac{p(x)}{q(x)}$$

- **기호 뜻**: $p$ 는 "기준 (reference)" 분포, $q$ 는 "비교 대상" 분포. 합은 모든 가능한 결과 $x$ 에 대해.
- **일상 비유**: 내가 가진 우산 vs 친구의 우산. KL 이 작으면 모양이 거의 같음, 크면 다름. 비대칭이라 "내가 친구를 닮음" 과 "친구가 나를 닮음" 의 값이 다를 수 있음.
- **왜 이 형태**: 정보 이론에서 두 분포가 "얼마나 다른 정보를 인코딩하는가" 의 자연스러운 측도.
- **조심할 점**: $q(x) = 0$ 이지만 $p(x) > 0$ 인 점이 있으면 KL 이 무한대. 그래서 분포에 작은 epsilon 을 더하거나 KL 대신 JS divergence 를 쓰기도 함.

## 2. 본 논문이 어떤 분포를 비교하는가 — 코드 verbatim 분석

`src/analyzers/attention_kl_analyzer.py` 의 코드 fragment (verbatim):
```python
if self.no_pe_run_id is None:
    return

current_pe_type = self.model.config.position_encoding_type
assert current_pe_type is not None

if current_pe_type == "none":
    ...
```

이 fragment 와 `scripts/experiment_uploaders/attention_kl_analysis.py` 의 verbatim:
```python
no_pe_run_ids = attn_results[
    (attn_results["cfg__dataset.name"] == ds)
    & (attn_results["cfg__dataset.split"] == ds_split)
    & (attn_results["cfg__model.position_encoding_type"] == "none")
    & (attn_results["scratchpad_config"] == scratchpad_config_filename)
]
```

으로부터 분석 흐름을 재구성:

1. **NoPE run 을 reference 로 fix** — 동일 dataset, 동일 split, 동일 scratchpad config 조건에서 NoPE 의 run id 를 찾는다.
2. **각 명시 PE run 의 attention 분포 추출** — 동일 조건에서 APE / T5-rel / ALiBi / Rotary 의 attention 을 추출.
3. **PE 별 attention 분포 vs NoPE attention 분포의 KL** — 각 명시 PE 가 NoPE 와 얼마나 닮았는지 측정.
4. **PE 별 KL 의 비교** — KL 이 가장 작은 PE 가 NoPE 와 가장 닮은 inductive bias 를 가진 것.

Abstract verbatim 결과: T5-relative PE 가 가장 가깝다.

## 3. KL 계산의 정확한 정의는 (본문 미확보)

코드 fragment 만으로는 KL 이 어떤 axis 위에서 계산되는지 확실치 않다. 가능한 정의들:

### Option A — Head 별 KL 평균
$$\mathrm{KL}_{\text{avg}} = \frac{1}{H \cdot L \cdot N} \sum_{h, \ell, n} \mathrm{KL}\left( A^{(\text{NoPE}, h, \ell, n)}_{i \cdot} \,\|\, A^{(\mathcal{P}, h, \ell, n)}_{i \cdot} \right)$$
- 모든 head $h$, layer $\ell$, 데이터 점 $n$, query 위치 $i$ 에 대한 평균.

### Option B — Marginal attention distance distribution KL
각 head 에서 "attention 가중치가 위치 거리 $d = i - j$ 에 따라 어떻게 분포하는가" 를 marginal 화한 분포에 대한 KL. `notebooks/plot_attention_distance_final.ipynb` 의 존재가 이 정의를 시사.

### Option C — Per-token KL
각 query token 위치 $i$ 마다 KL 을 계산하고 위치별 곡선을 그림.

**본 환경에서 본문 미확보로 단정 불가**. 그러나 코드 notebook 이름 (plot_attention_distance) 에 기반하면 Option B 가 본 논문의 주된 분석 형식일 가능성이 높다.

## 4. KL 분석이 표현력 정리와 결합되는 방식

- **표현력 정리** (Claim 2): NoPE 는 절대 PE 와 상대 PE 둘 다 표현 가능.
- **KL 분석** (Claim 3): SGD 학습 후 NoPE attention 은 T5-relative 와 가장 닮음.

두 결과가 결합되면 다음 진술이 가능 (저자 주장):
> "표현 가능한 공간 안에서, SGD 의 inductive bias 는 T5-relative 비슷한 솔루션을 선호한다. 다른 형식 (APE, ALiBi, Rotary) 은 표현 가능하나 SGD trajectory 위에서 선호되지 않는다."

이는 mechanistic interpretability 의 핵심 질문 — "왜 학습은 표현 공간의 특정 attractor 로 수렴하는가" — 의 한 instance 다. 본 논문 자체는 이 attractor 의 source 를 깊이 분석하지 않을 가능성이 높지만 (본문 미확보), KL 측정 자체가 그 분석의 첫 단계.

## 5. Scratchpad config 별 분석의 의의

Verbatim 코드:
```python
& (attn_results["scratchpad_config"] == scratchpad_config_filename)
```

NoPE 와 명시 PE 의 attention KL 비교가 scratchpad config 별로 따로 수행된다. 이는 Claim 4 ("scratchpad format 영향") 와의 결합:

- 동일 task 에서 scratchpad format 이 바뀌면 attention 패턴이 바뀐다 → NoPE-T5 닮음의 정도도 바뀔 수 있다.
- 따라서 "NoPE attention 이 T5-rel 과 가장 닮음" 의 강도는 scratchpad config 의존. 본 논문이 이 의존성을 보고했는지는 본문 미확보.

본 환경에서 가용한 코드 fragment 가 시사하는 것 — **저자는 scratchpad 의 attention 영향을 통제하려 했고, 동일 scratchpad 안에서 PE 비교를 수행한 뒤 그 결과를 aggregate**. 이는 protocol 의 정밀함을 보여주는 신호.

## 6. APF 와의 직접 연관 (방법론 layer 에서)

APF (Attention Pattern Fields) 의 가설:
> "PE 가 2D attention motif 의 형태를 결정한다. Motif probe 가 그 형태를 분류하고, causal intervention 으로 그 motif 가 출력에 인과적임을 보인다."

본 논문의 KL 분석은 APF 의 motif probe 의 한 형태 — **PE 별 attention 분포의 비교** 자체. 차이점:
- APF: motif 분류기 (CNN probe) 로 motif 종류 (diagonal/stripe/block/edge/spike/checker) 를 출력. 정성적 분류.
- Kazemnejad: attention 분포의 KL 거리. 정량적 metric.

**둘은 보완 관계**. APF 의 motif probe 가 "이 PE 가 어떤 motif 를 만든다" 를 보이면, KL 분석은 "이 PE 의 motif 가 NoPE 의 motif 와 거리 X 이다" 를 보인다. 본 해체의 §9 (내 연구 연결) 에서 이 결합 가능성을 구체적으로 다룬다.

## 핵심 한 문장 요약
"KL 분석은 'NoPE 가 학습 후 어떤 명시 PE 와 닮았는가' 라는 mechanistic 질문에 답하는 첫 단계. 코드 verbatim 에서 reference 가 NoPE 로 고정되고 scratchpad config 별로 통제되는 정밀한 protocol 이 확인됨. APF 의 motif probe 와 보완 관계의 측정 도구."
