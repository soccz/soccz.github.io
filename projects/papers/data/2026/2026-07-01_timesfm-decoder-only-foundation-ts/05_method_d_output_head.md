# 05.d 방법론: 출력 패치 헤드 & Autoregressive 확장

## 왜 이 부분이 필요한가

Transformer 코어를 지나온 마지막 hidden state $h_N$ 은 벡터일 뿐. 이걸 다시 시계열의 **실수값** 으로 되돌려야 예측이 나온다. 그리고 downstream 응용은 예측 horizon 을 몇 시간점 뒤부터 몇 백/천 시간점 뒤까지 다양하게 요구한다. TimesFM 은 이 두 문제를 (i) output residual block 으로 patch 를 한 번에 뽑고, (ii) autoregressive rollout 로 임의 길이 horizon 을 이어붙여 해결.

## 수식

**Output patch prediction**:

$$
\hat{y}_{T+1:T+h} = \text{ResidualBlock}_{\text{out}}(h_N) \; \in \; \mathbb{R}^{h}, \quad h = 128.
$$

여기서 $h_N$ 은 마지막 patch token 위치의 hidden state (dim $d_{\text{model}} = 1280$), output residual block 은 $\mathbb{R}^{1280} \to \mathbb{R}^{128}$ 의 MLP+skip. 즉 **한 forward 로 128 시간점을 한꺼번에 뽑는다.**

**Autoregressive rollout** (긴 horizon 이 요구되면):
1. Round 1: input $x_{1:T}$ → output $\hat{y}_{T+1:T+128}$.
2. Round 2: input $(x_{1:T}, \hat{y}_{T+1:T+128})$ 를 다시 patch 로 잘라 forward → output $\hat{y}_{T+129:T+256}$.
3. …반복.

**Loss**: MSE regression on patch-level targets. 학습 시 각 patch 위치 $i$ 에 대해:

$$
\mathcal{L} = \frac{1}{N \cdot h} \sum_{i=1}^{N} \sum_{j=1}^{h} \bigl( \hat{y}^{(i)}_j - y_{ip + j} \bigr)^2,
$$

즉 각 patch 토큰 위치에서 다음 $h=128$ 시간점을 예측 target 으로 삼아 각 위치가 학습 loss 에 기여. 이는 언어 모델의 **teacher forcing next-token prediction** 과 동형이되, 한 위치가 한 개가 아니라 128 개의 미래를 감독한다.

### 4줄 해석

1. **기호 뜻**:
   - $h_N$: 마지막 patch 위치의 hidden state.
   - $\hat{y}_{T+1:T+h}$: 예측된 미래 patch (실수값 벡터, 길이 $h$).
   - $h = 128$: output patch 길이. 이것이 input patch 길이 $p=32$ 보다 **4배 크다** 는 게 이 논문의 핵심 설계 선택.
   - MSE: 평균제곱오차 (mean squared error), $(\hat{y} - y)^2$ 의 평균.
2. **일상 비유**: 축구 중계 캐스터가 다음 30초를 예측할 때, "다음 1초, 그다음 1초, …" 30번 하는 게 아니라 "다음 30초를 한꺼번에" 예측하고, 그 예측이 실제와 얼마나 다른지로 배운다. 진짜 긴 예측 (예: 90분) 이 필요하면 30초 단위로 rollout 하되 rollout 횟수는 3번뿐.
3. **왜 이 형태**:
   - **$h > p$ 의 정당화**: rollout 횟수를 줄여 오차 누적 방지 + 학습 시 감독 신호 (128 개의 target) 이 언어 모델의 (1 개의 target) 보다 128 배 밀도 높음.
   - **MSE 의 정당화**: 실수값 regression 이라 자연스러움. Cross-entropy 는 값 이산화 후에나 가능 (Chronos 가 이 방향).
   - **Teacher forcing**: 학습 시 각 patch 위치가 실제 관측값을 다음 입력으로 받음 → 학습이 자기회귀보다 훨씬 빠름 + gradient 가 안정.
4. **조심할 점**:
   - **Exposure bias**: 학습은 teacher forcing (ground-truth 이어붙임), 추론은 autoregressive rollout (예측값 이어붙임) → distribution shift. 짧은 horizon 은 무시할 수 있지만 (한 forward 로 끝) 긴 horizon 은 rollout error 가 exponential 로 쌓일 수 있음.
   - **MSE 는 heavy tail 취약**: 극단값 예측이 크게 틀리면 loss 폭발. 저자 v1 README 는 "point forecast 중심" 임을 명시 → 극단값 · 확률 예측 track (금융 tail risk 등) 은 이 loss 로는 부족.
   - **Output patch length 4배 규칙의 일반화**: $h=4p$ 가 최적인지, downstream horizon 이 다르면 다른 비율이 더 나은지, 원 논문은 이 비율의 sensitivity ablation 을 어느 수준으로 했는지 원 PDF 확인 필요.

## Quantile head (실험적)

v1 README verbatim: "**timesfm-1.0-200m** … We experimentally offer quantile heads but they have not been calibrated after pretraining." **timesfm-2.0-500m** … We experimentally offer 10 quantile heads but they have not been calibrated after pretraining.

즉 별도의 10 개 quantile head (각 quantile 을 예측하는 output residual block 을 병렬로 둠) 를 학습하지만, **사후 calibration (예: conformal prediction, isotonic regression) 을 안 함**. 따라서 예측 구간의 명목 신뢰수준 (예: 90% CI) 이 실제 커버리지와 다를 수 있음.

$$
\hat{y}^{(q)}_{T+1:T+h} = \text{ResidualBlock}^{(q)}_{\text{out}}(h_N), \quad q \in \{0.1, 0.2, \dots, 0.9\}
$$

학습 loss 는 quantile loss (pinball loss):

$$
\ell_q(y, \hat{y}) = \max\bigl( q(y - \hat{y}), \; (q-1)(y - \hat{y}) \bigr).
$$

이 loss 가 quantile head 의 학습 신호를 준다. 하지만 각 quantile head 가 독립 학습되면 **quantile crossing** (예: $\hat{y}^{(0.7)} < \hat{y}^{(0.6)}$) 이 발생할 수 있음. v2.5 README verbatim: "`fix_quantile_crossing=True`" 옵션이 이후 등장 — 사후 정렬 트릭.

### 왜 이 논문 시점에는 미완성인가

Point forecast (MSE) 와 quantile forecast (pinball) 을 동시에 학습하는 게 **경쟁적 gradient** 를 만든다. Loss 를 어떻게 weight 할지, quantile 마다 output head 를 따로 둘지 아니면 하나의 head 가 여러 quantile 을 뱉게 할지, 원 논문 시점에는 결론이 없었음. v2.5 (2025-09) 에서 별도 30M 파라미터 continuous quantile head 로 부분 해결.

## 대체 설계 3개

1. **Discretized regression (Chronos 스타일)**: 실수값을 bin 으로 이산화하고 cross-entropy 로 학습. 확률 분포를 자연스럽게 뽑을 수 있지만 이산화 손실 발생. TimesFM 은 이 손실을 원치 않아 real-valued regression 을 택함.
2. **Mixture head (MOIRAI 스타일)**: 4-mixture (Student-T / log-normal / Negative-Binomial / low-var-Normal) 로 flexible probabilistic. 학습 및 sample 이 복잡하지만 확률 예측 정합. TimesFM 은 안 씀 — point forecast 우선.
3. **Diffusion head (TimeGrad 스타일)**: 마지막 hidden state 를 diffusion 조건으로 넣어 미래 시계열을 sample. Rasul et al. 2021 (ICML). Sampling 비용이 큼. TimesFM 은 zero-shot 응용의 실시간 요구에 맞춰 forward 한 번으로 끝나는 regression head 를 택함.

## 이 부분의 핵심 한 문장

**"한 forward 에 128 시간점을 한꺼번에 뽑는 output residual block + MSE regression 이 point forecast 를 담당하고, 10-quantile head 는 미보정 실험 옵션으로 병존한다."**
