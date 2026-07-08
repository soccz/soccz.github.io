# 4. 방법론 E — Interpretable Multi-Head Attention

## 왜 이 부분이 필요한가

LSTM 인코더-디코더가 국소 순차 패턴을 잡아 주었어도, 시계열에는 **장거리 의존성** 이 흔하다: 연 단위 계절성, 주 단위 주기, 지난 달의 사건이 이번 달에 미치는 영향. Attention 은 이런 long-range 의존성을 pairwise weight 로 잡는 데 강하다.

문제는 표준 multi-head attention (Vaswani 2017) 의 attention weight 는 **각 head 마다 서로 다른 subspace** 를 반영하므로, 한 head 의 weight 를 그대로 "시간 중요도" 로 해석하기 어렵다. Head 별 aggregation 도 head 별 value projection $W^V_h$ 가 달라서 attention weight 를 단순 평균해선 안 된다.

TFT 는 이 두 문제 (long-range + interpretability) 를 하나로 봉합. Multi-head attention 의 head 별 attention weight 를 **단일 시간 중요도 지도** 로 aggregate 할 수 있는 변형을 제안한다.

## 표준 Multi-Head Attention 복습

Vaswani 2017 표준:
$$\text{Attention}(Q, K, V) = \text{Softmax}\bigl(QK^\top / \sqrt{d_k}\bigr) V$$
$$\text{Head}_h = \text{Attention}(QW^Q_h, KW^K_h, VW^V_h)$$
$$\text{MHA}(Q, K, V) = [\text{Head}_1, \ldots, \text{Head}_H] W_H$$

- 각 head $h$ 는 자기만의 $W^Q_h, W^K_h, W^V_h$ 를 갖는다. 즉 서로 다른 subspace 에 project 후 attention 계산.
- 결과 head 를 concat 하고 output projection $W_H$.

## TFT 의 변형: Head 별 attention weight, Value projection shared

$$\text{Head}_h = \text{Attention}(QW^Q_h, KW^K_h, VW_V)$$
$$\text{InterpretableMHA}(Q, K, V) = \tilde{H} W_H$$
$$\tilde{H} = \frac{1}{H} \sum_{h=1}^{H} \text{Head}_h = \Bigl(\frac{1}{H} \sum_h A_h\Bigr) V W_V$$

- **결정적 변화**: $W^V_h$ 대신 head 공유 $W_V$. 이 결과 $\text{Head}_h = A_h V W_V$ 이 되고 head 평균이 $\bigl(\frac{1}{H}\sum_h A_h\bigr) V W_V$ — 하나의 시간 중요도 지도 $\bar{A} = \frac{1}{H}\sum_h A_h$ 로 축소.

- **기호 뜻**:
  - $Q, K, V$ = query/key/value 행렬. TFT 에서는 $Q$ 가 decoder 위치의 static-enriched 표현 $\Theta$, $K, V$ 도 encoder+decoder 의 $\Theta$ (자기 자신 이전 위치).
  - $A_h$ = head $h$ 의 attention weight matrix (row-stochastic).
  - $\bar{A}$ = head 평균 weight, "시간 중요도" 해석 대상.

- **일상 비유**: 여러 검토위원 (head) 이 자기 렌즈 (Q/K projection) 로 봤지만 최종적으로 같은 재료 (V) 를 통과시킨다면, 각 위원의 시선 지도를 평균한 결과가 "결국 어디를 봤나" 로 통합된다. 반대로 표준 MHA 는 각 위원이 서로 다른 재료를 보므로 시선 평균이 안 통함.

- **왜 이 형태**: 저자의 명시적 목표 = attention weight 시각화. 단일 표면으로 만들지 않으면 head-wise 시각화가 이해 부담을 급증시킴.

- **조심할 점**:
  - Head 별 value subspace 특수화를 포기 — 표준 MHA 의 표현력 (각 head 가 다른 feature 를 뽑음) 이 줄어듦.
  - 하지만 저자는 실험에서 이 표현력 감소로 인한 성능 저하가 크지 않다고 주장 (본문 §5 ablation 확인 필요).
  - "Attention weight = 중요도" 는 Jain-Wallace 2019 (2026-05-18 커버) 반박에 그대로 노출. TFT 의 interpretable attention 도 correlation-attribution 이지 causal 이 아니다.

## Causal Masking

디코더 위치는 자기 자신 이후를 참조하면 안 된다 (미래 leak):
$$A_h[i, j] = 0 \quad \text{if} \quad j > i$$

Encoder 위치 (과거) 는 서로 자유 참조, decoder 위치 (미래) 는 encoder + 자기 이전 decoder 만 참조. 이는 표준 GPT-style causal mask.

## Static Enrichment 앞과 뒤 (Attention 감싸기)

Attention 의 앞에 static enrichment (GRN with $c_e$), 뒤에는 다시 post-attention gate + Add & Norm + position-wise feed-forward (GRN). 정리하면:
```
θ_t = static-enriched LSTM output      (attention 입력)
θ_att = InterpretableMHA(θ, θ, θ)      (self-attention)
β_t = LayerNorm(θ_t + GLU(θ_att))     (post-attention gate + skip)
ψ_t = GRN(β_t)                          (position-wise FFN)
δ_t = LayerNorm(θ_t + GLU(ψ_t))       (final gate + skip to θ_t, not β_t)
```
마지막 `δ_t` 는 quantile head 의 입력.

**주목할 점**: 최종 skip 이 `θ_t` (attention 입력) 로 돌아가는 게 아니라 실제로 각 논문 아키텍처 세부에서 확인 필요. 위 표기는 TFT paper 원 아키텍처 그림 재구성이며 정확한 skip 대상은 본문 확인.

## 대안 접근

1. **Standard MHA (Vaswani 2017)**: 각 head 별 $W^V_h$ 그대로. Interpretability 통로 없음.

2. **Attention rollout (Abnar-Zuidema 2020)**: 표준 MHA 를 여러 층 통과한 후 attention weight 을 곱 형태로 aggregate 해서 시각화. 학습 이후 사후 처리.

3. **Interpretable attention with attention entropy regularization**: attention 을 sparse 하게 만들어 시각화 용이. 성능-해석 tradeoff.

4. **Attention 제거, LSTM only**: 초기 encoder-decoder LSTM (Cho et al. 2014). 장거리 의존성 손실.

## 이 부분의 핵심 한 문장

**Interpretable MHA 는 "head 별 value subspace 특수화" 를 대가로 "head 평균 attention weight = 시간 중요도" 라는 시각화 통로를 확보하는 조율 — 그러나 이 시각화의 causal 지위는 attention-as-explanation 담론 (Jain-Wallace 2019) 에서 근본적으로 문제 제기된 지점.**
