# 2. 문제 지형도

## 2.1 풀고자 하는 문제

공식적으로는 "**불규칙 샘플링된 시계열에 대한 표현 학습**"이다. 입력은 시각-값 쌍의 가변 길이 집합

$$
\mathcal{S} = \{(t_i, \mathbf{x}_i)\}_{i=1}^{N}, \quad t_1 < t_2 < \dots < t_N,\; \mathbf{x}_i \in \mathbb{R}^{d}
$$

여기서 관측 시각 $\{t_i\}$는 사전에 정해진 격자 위에 있지 않다. 목표 태스크는 세 가지:

1. **연속시간 함수 재구성 / 외삽**: 관측 $(t_i, \mathbf{x}_i)$를 바탕으로, 임의의 시각 $t \in [0, T]$에서 $\hat{\mathbf{x}}(t)$를 예측.
2. **분류**: 전체 궤적 $\mathcal{S}$를 보고 레이블 $y \in \{1,\dots,C\}$를 예측.
3. **TPP (Temporal Point Process)**: 다음 이벤트 시각·타입 $(t_{N+1}, m_{N+1})$을 예측. conditional intensity $\lambda^*(t)$의 모델링.

비공식적으로는 더 큰 문제 — "**시간 축을 좌표로 취급하는 Transformer의 기본 설계가 irregular sampling에서 왜 비효율적인가**"를 증명하고 대안을 제시하는 것이다. 이 "비공식 문제"가 실제로 논문의 방어선이다. 공식 태스크의 성능표는 이 비공식 주장의 경험적 근거일 뿐이다.

## 2.2 기존 접근의 계보 (연대순)

### (A) 불규칙 시계열 진영 — "시간을 dynamics로"

- **Latent ODE (Rubanova et al., NeurIPS 2019)**: 관측을 ODE-RNN으로 encode하고 latent $\mathbf{z}(t)$를 Neural ODE로 propagate. **한계**: RNN encoder가 결국 sequential하므로 attention의 병렬성·long-range benefit을 못 받음.
- **Neural CDE (Kidger et al., NeurIPS 2020)**: 입력을 spline interpolation한 후 CDE로 propagate. "입력 경로 자체가 driving path"라는 우아한 정식화. **한계**: representation이 CDE 한 트랙으로 단일화 — multi-head attention이 주는 "여러 관점"이 없음.
- **CADN / ODE-Transformer (2021~2022)**: Transformer decoder에 ODE block을 끼워 넣는 식의 접합. **한계**: attention 자체는 여전히 이산이고, ODE는 layer-wise depth로만 들어감.

### (B) Transformer 진영 — "시간을 좌표 feature로"

- **Time2Vec (Kazemi et al., 2019)**: 시간을 learnable sinusoidal basis로 임베딩해 입력에 합.
- **Informer (Zhou et al., AAAI 2021)** / **Autoformer (Wu et al., NeurIPS 2021)**: 장기 예측을 타깃으로 sparse attention / decomposition 도입. 불규칙 샘플링은 기본 가정 아님.
- **mTAND (Shukla & Marlin, ICLR 2021)**: Multi-Time Attention — 연속 시각에 대한 attention을 reference point와 관측 시각 간 similarity로 정의. **가장 가까운 전신**.
- **PatchTST / iTransformer (2023~2024)**: 시간 축을 patch하거나 variate로 뒤집는 관점. 여전히 regular grid 가정.

### (C) TPP 진영

- **Hawkes Process**: 고전. exponential kernel.
- **Neural Hawkes (Mei & Eisner, NeurIPS 2017)** / **Transformer Hawkes (Zuo et al., ICML 2020)** / **THP**: intensity를 neural net으로.
- **A-NDTT, ODE-TPP**: ODE-based intensity.

## 2.3 각 계보가 부족한 지점

| 계보 | 결정적 결함 |
|------|------------|
| Latent ODE | encoder 병목. attention 없음. long-range smoothing에서 RNN 한계 |
| Neural CDE | 우아하지만 단일 트랙. multi-scale·multi-view 미흡. output이 latent 궤적 전체가 아니라 종점 중심 |
| Time2Vec 계열 | 시간을 "또 하나의 특징"으로 취급 → irregular sampling의 **정보량 비대칭**(간격이 1분 vs 1일)을 normalize할 유인 부재 |
| mTAND | attention은 있으나 latent state가 여전히 이산 참조점에 묶임. "continuous path"가 아님 |
| Transformer Hawkes | intensity가 부분적으로 parametric. ODE처럼 자연스러운 연속성이 아님 |

## 2.4 ContiFormer가 메우는 gap

논문이 위치시킨 gap은 **"attention과 ODE를 '층 쌓기'가 아닌 '한 식' 안에서 통합"** 이다. 핵심 이미지는:

```
Transformer:   X = {x_1, ..., x_N}  → attention(Q,K,V)가 이산 X에 정의
Neural ODE:    z(t) = ODESolve(z_0, f, t)  → attention 없음
ContiFormer:   K(t), V(t) = ODESolve(K_0, V_0, f_K, f_V, t)
               Attn(t) = ∫ softmax(q(t)·K(s)/√d) · V(s) ds / ∑ ...
```

쉽게 말해, **Key·Value 자체가 시간 t의 함수**가 된다. 그 결과:

1. **연속시간 질의**: 관측 시각 $\{t_i\}$에 없는 임의의 $t$에서 Key·Value를 평가 가능 → irregular·extrapolation 자연스러움.
2. **병렬성 복원**: Latent ODE는 RNN encoder 때문에 잃은 병렬성을, ContiFormer는 구간별 ODE integration이 서로 독립이라 복원.
3. **축소 관계**: Transformer와 Neural ODE가 모두 특수 경우.

## 2.5 숨겨진 질문: "왜 굳이 attention 전체를 연속화했는가?"

저자가 명시하지 않은, 하지만 내가 반드시 의심해야 할 설계 판단은 **"Key·Value만 ODE로, Query는 interpolation linear"**라는 비대칭이다. 이 비대칭은 세 가지 의미가 있다:

1. **계산 비용**: Query 쪽도 ODE로 만들면 query-key pair당 적분이 두 배. 공식 code (`multiheadattention.py`)에서 Query는 `InterpLinear`, Key·Value는 `OdeLinear`로 갈리는 이유가 여기.
2. **semantic 비대칭**: "과거를 '흘려보내는' dynamics가 중요한 건 value 쪽이고, 질의는 '지금 이 순간의 관점'으로 던지면 충분" 이라는 암묵적 prior.
3. **이론적 증명의 깔끔함**: Theorem 4.1에서 Transformer로 환원될 때, Q가 단순 linear면 환원식이 더 짧게 나온다.

이 비대칭이 금융 도메인으로 옮길 때 문제를 만들지 의심할 것: **query 쪽도 "과거를 얼마나 멀리 돌아볼지"가 시간에 따라 변해야 하는 도메인**이 있다 (volatility clustering, economic time zoom). Paper 4 설계 시 이 비대칭의 수정 여부를 결정해야 함.

## 2.6 도메인 scope의 암묵적 경계

저자가 고른 실험 도메인은 — 나선 궤적 / EEG-계열 / Mimic ICU / StackOverflow / BookOrder / Traffic — 모두 **"부드러운 latent dynamics + noise"** 가정이 성립하기 좋은 도메인이다. 금융 log-return은 이 가정이 가장 깨지기 쉬운 영역 (점프, 두꺼운 꼬리, volatility clustering). 이 간극이 내 연구의 출발점이자, 논문이 주장하지 않은 부분을 내가 주장할 수 있는 근거다.
