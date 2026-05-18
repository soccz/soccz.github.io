# 03 Motivation — Section 1 Introduction

## 시계열 forecasting 의 새 압력: "장기"

> Time series forecasting has been widely used in energy consumption, traffic and economics planning, weather and disease propagation forecasting. In these real-world applications, one pressing demand is to extend the forecast time into the far future. (p.1)

**Long-term setting** 의 정의: input-$I$-predict-$O$ 에서 $O$ 가 크다 (paper 가 실험하는 값: 96, 192, 336, 720 / ILI 는 24, 36, 48, 60). 즉 한 step 이 아닌 수백 step.

**Why now?** Transformer [41] 의 self-attention 이 시계열에 적용되며 (LogTrans [26], Reformer [23], Informer [48]) 큰 진전. 그러나 장기에서 두 종류 한계.

---

## 두 challenge — 본 paper 의 출발점

### Challenge 1: 신뢰할 수 없는 의존성
> First, it is unreliable to discover the temporal dependencies directly from the long-term time series because the dependencies can be obscured by entangled temporal patterns. (p.1)

장기에서는 trend (장기), seasonal (주기), noise (잡음) 가 모두 섞여있음 → self-attention 의 query-key 가 무엇과 무엇을 연결해야 할지 불분명.

→ **답**: 분해(decomposition) — entangled 패턴을 풀어내어 각각 더 예측 가능한 component 로.

### Challenge 2: Quadratic complexity → sparse → bottleneck
> Second, canonical Transformers with self-attention mechanisms are computationally prohibitive for long-term forecasting because of the quadratic complexity of sequence length. (p.1)

$O(L^2)$ memory & compute. 해결책으로 LogSparse, LSH, ProbSparse 등장:

> Previous Transformer-based forecasting models [48, 23, 26] mainly focus on improving self-attention to a sparse version. While performance is significantly improved, these models still utilize the point-wise representation aggregation. Thus, in the process of efficiency improvement, they will sacrifice the information utilization because of the sparse point-wise connections, resulting in a bottleneck for long-term forecasting of time series. (p.1)

→ Sparse 화 → 효율은 얻었지만 정보 손실 ↑. **여전히 point-wise**.

---

## 본 paper 의 답 — 두 contribution

### Contribution 1: Decomposition 을 inner block 으로

> To reason about the intricate temporal patterns, we try to take the idea of decomposition, which is a standard method in time series analysis [1, 33]. ... However, under the forecasting context, it can only be used as the pre-processing of past series because the future is unknown [20]. (p.2)

**관행**: Prophet [39] (trend-seasonality), N-BEATS [29] (basis expansion), DeepGLO [35] (matrix decomp) 모두 사전처리.

**Autoformer 의 도약**:
> We attempt to go beyond pre-processing usage of decomposition and propose a generic architecture to empower the deep forecasting models with immanent capacity of progressive decomposition. (p.2)

- "Immanent capacity" = 내재적 능력.
- 각 layer 가 hidden representation 에서 trend 를 뽑아냄 → decoder 의 step-by-step refinement 에서 trend 가 누적.
- Encoder 는 trend 를 **제거** 하고 seasonal 만 모델링 (paper 의 "$\_$" 기호로 표시 — eliminated trend).

### Contribution 2: Auto-Correlation — series-wise periodicity

> Further, decomposition can ravel out the entangled temporal patterns and highlight the inherent properties of time series [20]. Benefiting from this, we try to take advantage of the series periodicity to renovate the point-wise connection in self-attention. We observe that the sub-series at the same phase position among periods often present similar temporal processes. Thus, we try to construct a series-level connection based on the process similarity derived by series periodicity. (p.2)

핵심 관찰: **같은 phase 의 sub-series 는 비슷한 process**.
- 예: 매주 월요일 9시의 traffic, 매년 1월의 ETT, 매 24h 의 hourly Electricity.
- → 이 관찰을 self-attention 의 점-사이 dot-product 대신, series-level connection 으로.

→ **Auto-Correlation 메커니즘**:
- 의존성 발견 = autocorrelation $R(\tau)$ Top-k
- 표현 집계 = `Roll(V, τ_i)` 로 sub-series 정렬 → softmax 가중 합

---

## 세 가지 기여 요약 (paper p.2 bullet)

> • To tackle the intricate temporal patterns of the long-term future, we present Autoformer as a decomposition architecture and design the inner decomposition block to empower the deep forecasting model with immanent progressive decomposition capacity.
>
> • We propose an Auto-Correlation mechanism with dependencies discovery and information aggregation at the series level. Our mechanism is beyond previous self-attention family and can simultaneously benefit the computation efficiency and information utilization.
>
> • Autoformer achieves a 38% relative improvement under the long-term setting on six benchmarks, covering five real-world applications: energy, traffic, economics, weather and disease.

이 셋이 paper 의 모든 챕터의 reference point.

---

## 본 motivation 의 미학

Autoformer 가 도전한 두 한계는 **상호 직교(orthogonal)**:
- Decomposition 은 **표현(representation)** 의 문제 — "무엇을 모델링할 것인가?"
- Auto-Correlation 은 **연결(connection)** 의 문제 — "그것을 어떻게 연결할 것인가?"

자연스럽게 두 contribution 이 **동시 적용** 가능 — Section 4.2 의 ablation 이 보여줄 것: decomposition 만 추가해도 promotion 있음, Auto-Correlation 만 비교해도 self-attention 우위. **둘 다** 일 때 최고.

또한 motivation 자체가 **이론 기반** — Auto-Correlation 은 stochastic process theory (Chatfield, Papoulis) 의 정의를 그대로 사용. 휴리스틱이 아닌, **수학적으로 동일한 양** 을 deep network 에 통합한 것.

이제 [04_related_work.md](04_related_work.md) 에서 forecasting 의 historical landscape 를 빠르게.
