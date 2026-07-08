# 4. 방법론 C — Gated Residual Network (GRN)

## 왜 이 부분이 필요한가

시계열 데이터는 크기가 천차만별이다. Electricity 처럼 수천만 sample 이 있으면 큰 모델이 되고, 특정 도메인 소규모 데이터 (수백 시계열, 각 짧은 길이) 에는 큰 모델이 over-parameterize 되어 학습이 흐트러진다. 저자가 원한 것은 **데이터 복잡도에 따라 자동으로 depth 를 조절** 하는 성질 — 필요 없으면 각 처리단이 자기 자신을 건너뛰고 (skip), 필요하면 비선형 처리를 수행하는 유연한 블록.

GRN 은 이걸 gating (GLU) + residual (skip) + LayerNorm 세 요소의 조합으로 구현한다. TFT 아키텍처의 **거의 모든 sub-module** (VSN 내부, static enrichment, post-LSTM, post-attention, position-wise feed-forward) 이 GRN 으로 짜여 있어, TFT 의 "만능 부품" 이다.

## 수식 (verbatim, WebSearch 로 확인)

$$\eta_2 = \text{ELU}(W_4 a + W_5 c + b_4)$$
$$\eta_1 = W_3 \eta_2 + b_3$$
$$\text{GLU}(\eta_1) = \sigma(W_1 \eta_1 + b_1) \odot (W_2 \eta_1 + b_2)$$
$$\text{GRN}_\omega(a, c) = \text{LayerNorm}(a + \text{GLU}_\omega(\eta_1))$$

- **기호 뜻**:
  - $a$ = primary input (필수). 이 GRN 이 처리하려는 대상.
  - $c$ = optional context (없어도 됨). Static covariate 로부터 온 조건화 신호.
  - $\text{ELU}$ = Exponential Linear Unit. $\text{ELU}(x) = x$ if $x > 0$, else $\alpha(e^x - 1)$. 음수 영역에서 부드럽게 saturate.
  - $\sigma$ = sigmoid, $[0,1]$ 로 gate 여닫음.
  - $\odot$ = element-wise product (Hadamard).
  - $W_1, \ldots, W_5, b_1, \ldots, b_4$ = 학습 가능한 파라미터. 아래 첨자 $\omega$ 는 이 GRN 인스턴스의 가중치 세트.
  - $\text{LayerNorm}$ = 층 정규화, 배치 크기와 무관하게 안정된 학습.

- **일상 비유**:
  - $\eta_2$ = ELU 로 통과한 primary + context 의 조합 = "재료를 예비 손질한 결과".
  - $\eta_1$ = 이 조합을 한 층 더 선형 변환 = "예비 처리를 마무리".
  - $\text{GLU}(\eta_1)$ = "sigmoid 밸브" ($\sigma(W_1 \eta_1 + b_1)$) 와 "실제 신호" ($W_2 \eta_1 + b_2$) 의 곱. 밸브가 0 이면 신호 통과 안 됨, 1 이면 통과.
  - LayerNorm(a + GLU(η₁)) = 원본 $a$ 와 처리 결과의 합을 정규화 = "손질 안 한 재료 + 손질한 재료를 섞고 냄비에 담기 전 최종 정리".

- **왜 이 형태**:
  - **Residual $a + \text{GLU}$**: skip connection. Gate 가 0 이면 결과가 $\text{LayerNorm}(a)$ 로 축소 = "이 처리단을 skip 한 것과 같음". 하지만 LayerNorm 이 껴 있어 완전 identity 는 아니다 (여기가 함정).
  - **GLU 안의 sigmoid 곱**: gate 를 학습 데이터로부터 스스로 배움. Transformer FFN 의 GeGLU/SwiGLU 계보와 같은 정신.
  - **Optional context $c$**: static 정보를 GRN 이 자연스럽게 흡수 (없으면 $W_5 c$ 항 생략).

- **조심할 점**:
  - LayerNorm 이 skip 을 완전 skip 이 아니게 만든다. Gate 가 0 이어도 $\text{LayerNorm}(a) \neq a$. 이는 저자가 명시적으로 논의 안 함.
  - $W_4 a + W_5 c$ 는 additive 결합만 표현 가능. 예를 들어 static 이 dynamic 을 "곱셈적으로" (multiplicatively) 조건화하는 상호작용은 GRN 으로 잡기 어려움 (FiLM/HyperNetwork 계열이 이 gap 을 메움).
  - $\eta_1 = W_3 \eta_2 + b_3$ 은 사실 하나의 선형층. 즉 GRN 의 nonlinearity 는 ELU 한 층 + GLU 의 sigmoid 뿐. 얕은 nonlinearity.

## GRN 이 다시 등장하는 지점 (아키텍처 내)

TFT 안에서 GRN 은 최소 다음 6 지점에 반복 등장:
1. VSN 안의 variable weight 계산 (`GRN_{v_χ}(Ξ_t, c_s)`)
2. VSN 안의 변수별 임베딩 처리 (`GRN_{ξ^(j)}(ξ^(j)_t)`) — 총 $m_\chi$ 개
3. Static covariate encoder — 4 개 context 벡터 (`c_s, c_c, c_h, c_e`) 각각을 위한 GRN
4. Static enrichment (attention 앞) — `c_e` 로 조건화된 GRN 이 LSTM 출력을 enrich
5. Position-wise feed-forward (attention 뒤) — GRN 하나
6. Post-quantile output 직전 dense projection

즉 파라미터의 상당 부분이 GRN 에 몰려 있고, 이 부품 하나가 잘 동작해야 전체가 동작.

## 대안 접근으로 했다면 어떻게 달랐을까

1. **표준 Transformer FFN + Residual**: `LayerNorm(a + FFN(a))` with `FFN(a) = W_2 \text{ReLU}(W_1 a + b_1) + b_2`. GLU gate 없이 그냥 통과. Depth-adaptive 성질 부재.

2. **Highway Networks (Srivastava et al. 2015)**: `y = T(x) \cdot H(x) + (1 - T(x)) \cdot x` — GRN 과 유사한 gate 이지만 gate 를 sigmoid $T(x)$ 하나로 두고 GLU 가 아닌 형태. 계보상 GRN 의 직접 선조.

3. **Squeeze-and-Excitation Networks (Hu et al. 2018)**: 채널별 gate 를 global pooling + sigmoid 로. Vision 에서 흔하지만 시계열에는 시간 축이 있어 그대로 이식 어려움.

4. **Standard ResNet block**: `LayerNorm(a + f(a))` with $f$ = conv 또는 MLP. Gate 없이 skip 만. TFT 저자가 GLU gate 를 붙인 것은 시계열의 heterogeneity (한 도메인엔 필요, 다른 도메인엔 불필요) 를 반영하려는 명시적 induction bias.

## 이 부분의 핵심 한 문장

**GRN 은 "skip + gate + norm" 세 요소로 depth-adaptive 처리를 구현하는 TFT 의 만능 부품이지만, LayerNorm 이 residual 을 완전 통과시키지 않고 additive 조건화만 지원하는 두 가지 미묘한 제약이 있다.**
