# 4. 방법론 (Z) — 구현 & 하이퍼파라미터 (저자 코드 verbatim)

## 배경 사다리

이 절은 저자 본인 GitHub repo `hansbuehler/deephedging` 의 코드 디테일을 그대로 정리한다. ① **Config-driven** = 코드 한 줄 안 고치고 yaml/dict 만 바꿔 실험 — production 친화. ② **Keras `fit()` wrapper** = TensorFlow 의 표준 학습 인터페이스 — Adam, callback, validation 자동.

## 디렉토리 구조 (verbatim)

저자 README 에서:

```
deephedging/
├── gym.py           # VanillaDeepHedgingGym — Monte Carlo 메인 루프 (~200 lines)
├── trainer.py       # Keras 학습 wrapper (~50 lines)
├── plot_training.py # 6-panel 시각화 (라이브)
├── agents.py        # SimpleDenseAgent factory (FF / recurrent)
├── layers.py        # Variable / dense 레이어
├── objectives.py    # OCE / Entropy / CVaR utility 구현
├── world.py         # SimpleWorld_Spot_ATM 시뮬레이터 (BS / stochastic vol)
├── base.py          # TF 헬퍼 (casting, stats, binning)
├── plot_bs_hedge.py # BS 비교 차트
├── softclip.py      # action bounding
└── fd.py            # finite difference 도구
```

## 디폴트 하이퍼파라미터 (저자 README verbatim)

### World

| 파라미터 | 디폴트 | 비고 |
|---|---|---|
| samples | 1000 | Monte Carlo 경로 수 |
| steps | 10 | 시간 그리드 분할 수 |
| dt (time per step) | 0.02 | 1주 (= 0.02 년) |
| realized volatility | 0.20 | 20% 연율 |
| implied volatility | 0.20 | 20% 연율 |
| drift | 0.10 | 10% 연율 |
| strike (relative) | 1.0 | ATM 옵션 |
| **transaction cost spot** | **0.0002** | **2 basis point** |
| **transaction cost option** | **0.02** | **200 bp** (옵션 거래는 비싸다는 시장 사실 반영) |

총 horizon = 10 × 0.02 = 0.2 년 ≈ **10주** (약 두 달 반).

### Network

| 파라미터 | 디폴트 | 비고 |
|---|---|---|
| depth | 3 | hidden layer 수 |
| width | 20 | 레이어당 unit 수 |
| activation | ReLU | softplus 옵션 |
| recurrence | 0 | 비활성 |

매우 작은 네트워크 — 총 파라미터 수가 수백~수천 정도. 본질적으로 "simulator + risk 손실" 의 정보가 단순해 큰 네트워크 불필요.

### Training

| 파라미터 | 디폴트 | 비고 |
|---|---|---|
| optimizer | Adam | TF Keras 표준 |
| learning rate | 0.001 | Adam 표준 |
| epochs | 100 | 본 환경 검증 |
| batch size | full dataset | (즉 1000 path 가 한 batch) |
| clipvalue / clipnorm | None | gradient 클리핑 없음 |

### Utility (objective)

| 옵션 | 식별자 | 비고 |
|---|---|---|
| **exp2** | exponential ($\rho = (1/\lambda)\log\mathbb{E}[e^{-\lambda X}]$) | 디폴트 |
| **cvar** | CVaR$_\alpha$, $\alpha = \lambda/(1+\lambda)$ | 실무 표준 |
| | risk aversion $\lambda$ | 디폴트 1.0 |

## SimpleWorld_Spot_ATM 시뮬레이터 (README verbatim)

저자 README:
> "Asset dynamics: Black-Scholes or stochastic volatility with mean reversion"
> "Option pricing: ATM calls/puts with floating strike"
> "Realized vs. implied vol: Can differ, creating hedging opportunities"
> "Stochastic drift: Mean-reverting asset drift"
> "Correlations: Configurable spot-vol, spot-drift, implied-realized correlations"

즉 SimpleWorld_Spot_ATM 은 단순 BS 와 Heston-like stochastic vol 양쪽을 한 시뮬레이터에서 토글. spot-vol 상관 $\rho$, spot-drift 상관, implied-realized 상관까지 설정. 출력:
- per-step features: spot, delta, implied vol, time-to-maturity
- per-path features: payoff 특성
- TF tensor: payoff, hedge returns, transaction costs, action bounds

## 학습 루프 (gym.py 의 골격)

저자 README 의 추출:

```python
# Pseudocode (저자 README 기반 재구성)
def vanilla_deep_hedging_gym(world, agent, objective):
    paths = world.sample(N)            # Monte Carlo 경로
    actions = []
    pnl = -paths.payoff                 # 옵션 매도 (음수 부호)
    for t in range(M):
        s_t = paths.features[t]
        a_t = agent(s_t, prev_a, prev_h)   # 신경망 정책
        pnl += a_t * paths.dS[t]            # 헤지 수익
        pnl -= world.tc[t] * abs(a_t - prev_a) * s_t   # 거래비용
        actions.append(a_t)
    return objective.loss(pnl)         # OCE / CVaR / Entropy
```

핵심: (i) **단일 forward pass 가 전체 horizon** 을 펼침 (TF graph 안에서 M-step rollout). (ii) **backward 가 자동** — TF autograd 가 $\partial \text{Loss}/\partial \theta$ 계산. (iii) **batch = 전체 경로** — variance 의 noise 최소화.

## 6-panel 시각화 (plot_training.py)

학습 중 실시간 표시:
1. **Convergence** — loss, utility, memory
2. **Training results** — payoff vs spot, hedge vs spot, gains vs spot
3. **Confidence intervals** — terminal spot 별 std binning
4. **Utility percentiles** — CVaR 시각화
5. **Actions by time** — 시점별 spot/option 보유량
6. **Spot delta** — 누적 delta vs 가격

이 6 panel 은 deep hedging 학습 곡선의 표준 진단도구로 자리잡았다.

## 의존성

| 라이브러리 | 버전 |
|---|---|
| Python | 3.7+ |
| TensorFlow | 2.10+ |
| TensorFlow Probability | 0.14–0.15 |
| cdxbasics | 0.2.9+ (Buehler 의 config 라이브러리) |
| cvxpy | (옵션, convex 후처리) |
| GPU | CUDA 11.2 + cuDNN 8.1 (옵션) |

## 구현상 주목할 디테일

### Softclip 으로 action bounding

`softclip.py` — action 을 box constraint $[a_{\min}, a_{\max}]$ 안에 두는 부드러운 clipping. tanh-rescale 보다 0 부근에서 gradient flow 양호. 자본 한도·신용 한도 같은 제약을 직접 표현.

### Initial delta a^{init} 학습

기존 trader 가 시작 시 이미 보유 포지션이 있다면, $\delta_0$ 도 학습 변수. `agents.py` 에서 별도 layer.

### Caching

매 10 epoch 마다 모델 자동 cache. 본 환경 cdxbasics 의 `Cache` 클래스로 자동화. 학습 도중 중단되어도 resume 가능 — production 친화.

## 구현이 함축하는 것

저자 README:
> "Defensive programming, clear validation with actionable errors, production-ready approach, transparency, core loops kept to ~200 lines for readability."

즉 vanilla 구현은 **"교육적 참조"** + **"production 직전" 의 두 측면**. ~200 lines 의 gym.py 가 핵심 알고리즘을 모두 담는다는 점은 (a) 알고리즘이 단순함 자체를 강조, (b) 실무 도입 장벽이 낮음을 의미. 그래서 5년간 deep hedging 후속 연구가 폭증 (위 references list).

## 핵심 한 문장

> **"디폴트 depth=3 width=20 의 작은 네트워크 + 10-step horizon + Adam 100 epoch 의 단순한 학습 골격으로 closed-form BS-delta 를 무력화한다 — 알고리즘의 단순성이 분야의 표준화를 가속한 동력."**
