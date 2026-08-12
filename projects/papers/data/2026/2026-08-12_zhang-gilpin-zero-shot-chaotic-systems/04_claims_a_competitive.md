# 3-A. Claim 1 — 제로샷 예측이 전용 학습 모델과 대등하다

> **배경 사다리**: ① "제로샷"은 그 과제로 가중치를 한 번도 갱신하지 않은 채 예측한다는 뜻, ② "전용 학습 베이스라인"은 그 계의 데이터로 하이퍼파라미터까지 튜닝해 학습시킨 모델, ③ Friedman 검정은 여러 대상(여기선 135개 계) 위에서 여러 방법의 **순위**를 비교하는 비모수 검정 — 값의 크기가 아니라 "누가 더 자주 이기는가"를 본다.

---

## 주장 (한 문장)

**135개 카오스계 전체에서, 상위 3개 크기의 Chronos 는 가중치를 전혀 학습하지 않고도 NBEATS 를 제외한 모든 전용 학습 베이스라인(TiDE·NVAR·소형 Transformer·LSTM)을 능가하며, 도달 지평은 역사적으로 벽으로 여겨진 약 1 Lyapunov 시간이다.**

## 증거

- **§5.1 · Figure 3.** 캡션 verbatim: "Zero-shot models of chaotic systems are competitive with custom-trained models. Zero-shot forecasts from Chronos for five different model sizes (left), compared to other forecast models directly trained on the points given to Chronos as context (right). Inset plots show the valid prediction times (VPT), the first time each forecast exceeds an error limit. All error bars are over 135 chaotic systems, each with 20 distinct initial conditions."
- 본문 verbatim: "Compared to the fully-trained baseline models, the three largest zero-shot forecast models outperform all except for NBEATS (Friedman, $p<10^{-3}$, $N = 135$)."
- 모델 크기 효과 verbatim: "the median VPT of the three largest zero-shot Chronos models is statistically indistinguishable, while the smaller models exhibit significantly smaller VPT ($p < 10^{-3}$, non-parametric Friedman test, $N = 135$)."
- 도달 지평 verbatim: "The zero-shot models perform nearly as well as state-of-the-art, fully-trained models in this setting, reaching a VPT as high as 1 Lyapunov time." 그리고 그 의미 verbatim: "Historically a prediction time of 1 Lyapunov timescale has been considered prohibitive even for fully-trained forecast models."
- **대조군의 하한**: Appendix G **Figure 16** 캡션 verbatim "Naive forecasts underperform all models evaluated." — 마지막 관측값을 그대로 미래로 끌고 가는 상수 예측이 모든 모델보다 나쁘다는 것을 별도 그림으로 못박는다.

> **수치 투명성**: Figure 3 은 그림 내부 곡선으로만 제시되며 본문에 대응 표가 없다. 따라서 "Chronos-base 의 VPT = X, NBEATS = Y" 같은 **개별 수치는 원문에 표로 미보고**이며, 이 해체는 저자가 문장으로 확언한 순위 관계와 "as high as 1 Lyapunov time" 만 인용한다.

## 숨은 전제

1. **"공정한 비교"의 정의가 하이퍼파라미터 1개에 걸려 있다.** §4 verbatim: "for each model we select one hyperparameter to tune that corresponds to the lookback window". 베이스라인은 lookback 만 6개 후보($\{0.067, 0.167, 0.333, 0.5, 0.833, 1\}$ Lyapunov 시간, Appendix F.1)에서 튜닝되고 나머지는 Darts 기본값에 고정된다. Chronos 역시 문맥 외 하이퍼파라미터를 안 건드리므로 **대칭적**이긴 하나, 이는 "베이스라인이 최대로 튜닝됐다면"이 아니라 "동일하게 최소로 튜닝됐다면"의 비교다.
2. **512점이라는 데이터 예산이 결론의 방향을 정한다.** 저자 스스로 인정하듯(§5.1) 데이터가 충분하면 저장소 계열이 더 긴 지평을 얻는다. 즉 Claim 1 은 무조건적 우위가 아니라 **저데이터 레짐의 조건부 우위**다.
3. **채널 독립이 모두에게 강제된다.** Chronos 가 단변량 모델이라 베이스라인도 차원별로 따로 학습·평가된다(§4). 이는 베이스라인에게 불리한 조건이며 저자들도 "intrinsically harder"라고 명시한다. 다만 Appendix G Figure 13 에서 다변량 재학습 대조군을 제시해 이 선택의 효과를 따로 보여준다.

## 쉬운 말 풀이

시험 범위를 전혀 공부하지 않은 학생(Chronos)과, 그 범위만 며칠 공부한 학생들(NBEATS·TiDE 등)을 135개 과목에서 겨루게 했다. 공부 안 한 학생이 한 명(NBEATS)만 빼고 전부 이겼다. 단, 조건이 있다. 공부한 학생들에게 **교재를 512쪽만** 줬다는 것, 그리고 **모두에게 같은 종류의 힌트(직전 몇 쪽을 볼지)만** 조절하게 했다는 것. 교재를 훨씬 많이 줬다면 결과는 달라졌을 수 있고, 저자들도 그렇게 적어 두었다.

## 이 claim 의 핵심 한 문장

**"전용 학습 없이 대등하다"는 결과는 모델 자랑이 아니라 데이터 예산에 대한 진술이다 — 데이터가 적을 때 사전학습의 값어치가 최대가 된다.**
