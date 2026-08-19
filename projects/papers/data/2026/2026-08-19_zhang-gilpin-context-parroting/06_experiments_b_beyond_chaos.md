# 5. 실험 해부 (b) — 난류·심전도·회로·Kuramoto

> **배경 사다리**: 이 절을 이해하려면 ① **폰 카르만 소용돌이 열**이 "물체 뒤에서 좌우로 번갈아 떨어져 나가는 소용돌이 행렬"이며 레이놀즈 수(Re)가 그 흐름의 난류성 정도를 재는 무차원 수라는 것, ② **Kuramoto 모형**이 "서로 밀고 당기며 박자를 맞추려는 진동자들의 표준 모형"이라는 것, ③ 표의 숫자는 **작을수록 좋다**(MAE·MSE·KL 모두 오차)는 것만 알면 된다.

---

## 5b.1 왜 이 네 과제인가

§5.3 원문 verbatim: *"So far we focused on low-dimensional chaotic systems from the dysts dataset, which enabled systematic comparison between different forecasting models with standardized benchmarks. Here, we show that parroting also outperforms foundation models on a broader class of SciML tasks, including real-world datasets of current scientific interest."*

그리고 설계 의도 verbatim: *"These are all high-dimensional systems, two generated from simulations and two measured in the real world."*

즉 두 축으로 확장한다 — **차원(저→고)** 과 **출처(시뮬레이션→실측)**.

| 과제 | 정체 | 출처 | 축 |
|---|---|---|---|
| **Turbulence** | 폰 카르만 소용돌이 열, **Re=900**, 상위 PCA 모드를 시계열화 (verbatim: *"a standard problem in fluid dynamics representing a flow exhibiting intermittency. We generated time series corresponding to the top PCA modes, in order to capture global structure"*) | 시뮬레이션 | 고차원·간헐성 |
| **ECG** | 심전도 기록, **PhysioNet QT Database** | 실측 | 실세계·생리 신호 |
| **Circuit** | **28개** 결합 전자회로 실측 (Vera-Ávila et al. 2020) | 실측 | 실세계·결합계 |
| **Kuramoto** | **23개** Kuramoto 진동자, 좌절(frustrated)·비상반(nonreciprocal) 결합 (León & Pazó 2025) | 시뮬레이션 | 고차원·동기화 |

**설계 비평.** 확장 축이 "차원"과 "실측 여부"로 잡혀 있는데, [04_claims_b](04_claims_b_induction_and_scaling.md) Claim 5 에서 지적했듯 **parroting 을 진짜로 위협하는 축은 그 둘이 아니라 "비반복성"** 이다. 네 과제 모두 주기 또는 준주기 구조가 강하다. 특히 ECG 는 **거의 정의상 반복 신호**다. 즉 이 확장은 "다양한 데이터에서 된다"를 보여주지만 **"복사가 통하지 않는 조건"을 탐색하지는 않는다.** 반증 시도가 아니라 범위 확인이다.

## 5b.2 Table 1 — MAE @ 50 steps (원문 수치 그대로)

캡션 verbatim: *"Performance comparison (MAE @ 50 steps, mean ± standard deviation) of forecasting models across SciML tasks. Bold = best, italic = second and third best."*

| Task | Parrot | DynaMix | Chronos | Chronos Bolt | TimesFM | TimeMoE | Moirai |
|---|---|---|---|---|---|---|---|
| Turbulence | 0.403±0.210 | 0.505±0.247 | 0.431±0.237 | 0.567±0.247 | 0.510±0.174 | 0.394±0.172 | **0.382±0.189** |
| ECG | **0.624±0.315** | 0.777±0.241 | 0.873±0.422 | 0.752±0.279 | 0.723±0.259 | 0.799±0.158 | 0.684±0.237 |
| Circuit | **0.083±0.050** | 0.425±0.172 | 0.111±0.065 | 0.349±0.120 | 0.196±0.090 | 0.206±0.102 | 0.213±0.093 |
| Kuramoto | **0.004±0.001** | 0.076±0.002 | 0.072±0.029 | 0.961±0.084 | 0.624±0.061 | 0.070±0.011 | **0.004±0.001** |

> **표기 주의 (§4-bis 준수)**: 위 **수치는 원문에서 두 차례 독립 추출해 전부 일치한 값**이다. 다만 원문의 굵게/기울임 표시(best / second·third best)는 추출마다 해석이 흔들려, 이 해체에서는 **원문의 강조 표시를 그대로 옮기지 않고 각 행에서 수치상 최소값에만 굵게** 표시했다. 즉 위 표의 굵게는 **내가 계산한 최솟값**이지 원문 서식이 아니다.

**행별 해석 (2~3문장씩):**

- **Turbulence**: Parrot 0.403 은 **3위**다. Moirai(0.382)와 TimeMoE(0.394)가 앞선다. 간헐성(intermittency)이 있는 흐름에서는 "같은 모티프의 재방문"이 덜 규칙적이므로 복사의 이점이 줄어든다고 읽는 것이 자연스럽다. **논문의 헤드라인이 모든 과제에서 성립하지 않는다는 가장 명확한 증거**이며, 저자들이 이 행을 표에서 빼지 않은 것은 성실하다.
- **ECG**: Parrot 0.624 로 1위, 2위 Moirai 0.684 와 약 9% 차이. 심박이 준주기적이므로 예상된 결과다. 다만 **바로 그 이유로 이 승리는 논증력이 약하다** — 반복 신호에서 복사가 이기는 건 거의 정의에 가깝다.
- **Circuit**: Parrot 0.083 vs 2위 Chronos 0.111 — **약 25% 낮다.** DynaMix(0.425)와 Chronos-Bolt(0.349)는 5배 차이로 뒤처진다. 실측 데이터에서 이 정도 격차가 나온 것이 §5.3 에서 가장 강한 결과다.
- **Kuramoto**: Parrot 0.004 와 Moirai 0.004 가 **동률 최저**, 나머지는 한 자릿수~두 자릿수 배 뒤진다. Chronos-Bolt 0.961 과 TimesFM 0.624 는 사실상 **실패**다. 동기화된 진동자계는 복사에게 최적 조건이므로 Parrot 의 성공은 예상대로지만, **일부 대형 TSFM 이 이렇게 쉬운 신호에서 무너진다**는 사실이 더 중요한 발견이다.

## 5b.3 Table 2 — MSE @ 50 steps

캡션 verbatim: *"Performance comparison (MSE @ 50 steps) of forecasting models across SciML tasks."*

| Task | Parrot | DynaMix | Chronos | Chronos Bolt | TimesFM | TimeMoE | Moirai |
|---|---|---|---|---|---|---|---|
| Turbulence | 0.322±0.333 | 0.490±0.4530 | 0.380±0.408 | 0.531±0.447 | 0.403±0.262 | 0.278±0.268 | 0.278±0.267 |
| ECG | 0.916±0.630 | 1.063±0.488 | 1.461±1.097 | 0.950±0.581 | 0.940±0.530 | 0.893±0.287 | 0.851±0.488 |
| Circuit | 0.012±0.016 | 0.297±0.294 | 0.024±0.030 | 0.181±0.122 | 0.065±0.056 | 0.076±0.080 | 0.075±0.060 |
| Kuramoto | 0.001±0.002 | 0.006±0.001 | 0.009±0.007 | 1.296±0.188 | 0.512±0.096 | 0.008±0.002 | 0.001±0.001 |

**MAE→MSE 로 바꾸면 순위가 뒤집히는 지점이 있다** — 이게 이 표의 핵심 정보다. **ECG 행에서 Parrot 0.916 은 Moirai 0.851 과 TimeMoE 0.893 에 밀린다.** MAE 에서는 Parrot 이 1위였는데 MSE 에서는 3위다. MSE 는 큰 오차를 제곱해 벌하므로, 이 역전은 **parroting 이 "대부분 잘 맞히지만 가끔 크게 틀린다"** 는 구조를 드러낸다. 복사한 모티프가 어긋나는 순간 오차가 통째로 크게 나는 것인데, 이는 [05_method_b](05_method_b_algorithm.md) 에서 지적한 "기권 임계값 부재"의 직접적 귀결이다.

**Turbulence 행도 같은 방향**이다: Parrot 0.322 vs TimeMoE/Moirai 0.278. 즉 **점별 정확도 축에서 parroting 의 우위는 지표 의존적이며, 꼬리 위험이 있다.** 논문을 인용할 때 이 사실을 함께 적지 않으면 부정확한 인용이 된다.

## 5b.4 Table 3 — 어트랙터 KL 발산

캡션 verbatim: *"Performance comparison (KL Divergence between predicted and true attractors) of forecasting models across SciML tasks."*

원문에서 확인한 주요 항목(낮을수록 좋음):

| Task | Parrot | 비교 대상 |
|---|---|---|
| Turbulence | 0.028±0.044 | DynaMix **0.005±0.008** (Parrot 보다 낮음) |
| ECG | 0.065±0.089 | DynaMix 0.099±0.104 |
| Circuit | 0.572±0.082 | Chronos 0.630±0.118 |
| Kuramoto | 0.001±0.001 | Moirai 0.010±0.011 |

**해석.** 점별 지표(Table 1·2)에서 밀렸던 난류 과제가 **분포 지표에서도** 밀린다 — DynaMix 가 0.005 로 Parrot 0.028 의 약 1/6 이다. DynaMix 는 동역학계 전용 설계 모델이므로, **"물리를 겨냥해 설계하면 실제로 어트랙터를 더 잘 재현한다"** 는 반대 증거가 된다. 이 논문은 "TSFM 이 물리를 못 배웠다"고 말하지만, 표는 더 정확히 **"범용 시계열 TSFM 이 못 배웠고, 동역학 전용 모델은 부분적으로 배웠다"** 고 말한다. 이 구분은 논문 서사에서 강조되지 않지만 **후속 연구 방향으로는 가장 유익한 신호**다.

## 5b.5 Table 4 — 장기 지평에서의 불변량

캡션 verbatim: *"KL Divergence and correlation of invariant properties between predicted and true attractors for different models for long forecast horizons. Error bars are standard deviation across all attractors for the KL Divergence, and uncertainty bounds based on the p-value for correlations."*

원문에서 확인한 주요 항목:

| 지표 | Parrot | 비교 |
|---|---|---|
| 어트랙터 KL 발산 (낮을수록 좋음) | 0.412±0.141 | Chronos 0.679±0.101 |
| 프랙탈 차원 상관 (높을수록 좋음) | **0.723±0.042** | Chronos 0.120±0.118 |
| 최대 Lyapunov 지수 상관 (높을수록 좋음) | 0.343±0.018 | DynaMix **0.466±0.071** |

**이 표가 가장 많은 것을 말한다.**

1. **프랙탈 차원 상관에서 Parrot 0.723 vs Chronos 0.120** — 6배 차이다. Chronos 의 예측은 실제 어트랙터의 기하학적 복잡도를 **거의 반영하지 못한다**. 이는 Appendix F.4 의 불변량 보존 명제가 실제로 작동함을 보여주는 가장 직접적인 실증이다.
2. **그런데 최대 Lyapunov 지수 상관에서는 DynaMix 0.466 이 Parrot 0.343 을 앞선다.** Lyapunov 지수는 "궤적이 얼마나 빨리 갈라지는가", 즉 **카오스성 자체**를 재는 양이다. parroting 의 예측은 주기적이므로 원리적으로 양의 Lyapunov 지수를 만들 수 없다 — **이 항목에서 parroting 이 지는 것은 우연이 아니라 구조적 필연**이다.
3. 따라서 정확한 결론은 이렇다: **parroting 은 "어트랙터가 어디에 있는가"(분포·차원)는 잘 재현하지만 "어트랙터가 어떻게 발산하는가"(카오스성)는 재현하지 못한다.** 그리고 후자야말로 "물리를 배웠는가"의 더 엄격한 시험이다. 저자들의 §6 문장(*"If a foundation model cannot beat context parroting, it arguably has failed to learn the underlying physics"*)은 필요조건을 말한 것이지 충분조건이 아니며, **Table 4 는 parroting 자신도 그 충분조건을 만족하지 못함**을 보여준다.

## 5b.6 이 파일의 핵심 한 문장

**§5.3 의 네 과제는 parroting 의 승리를 넓히기보다 그 경계를 그린다 — 반복 구조가 강할수록 이기고(Kuramoto·회로), 간헐성이 있으면 지고(난류), 지표를 MSE 로 바꾸면 꼬리 위험이 드러나며(ECG), 카오스성 자체를 재는 Lyapunov 상관에서는 구조적으로 질 수밖에 없다.**
