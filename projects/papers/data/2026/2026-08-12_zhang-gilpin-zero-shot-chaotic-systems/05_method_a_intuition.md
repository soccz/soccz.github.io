# 4-A. 방법론 큰 그림 — 모델을 만들지 않고 시험지를 만든다

> **배경 사다리**: 이 논문에는 **새로 제안된 모델이 없다.** 방법론의 전부는 (i) 어떤 데이터를 만들 것인가, (ii) 무엇을 대조군으로 세울 것인가, (iii) 무엇으로 채점할 것인가, (iv) 메커니즘 가설을 어떻게 조작 실험으로 시험할 것인가 — 이 네 가지 설계다. 그래서 방법 절이 짧고 부록이 길다.

---

## 전체 파이프라인 (Figure 1 의 지문)

Figure 1 캡션 verbatim: "Chaos as a benchmark for zero-shot forecasting of time series. We use 135 distinct chaotic systems to generate chaotic trajectories from 20 different initial conditions each. Each trajectory is used to train the baseline deep-learning models (NBEATS, TiDE, etc.) and also provided as context to the pre-trained LLM (we use Chronos, a best-in-class foundation model for time series). Both the trained baseline models and Chronos are then asked to predict the trajectory into the future. We measure the quality of the predictions in terms of both short-term accuracy and long-term attractor reconstruction. Across $10^4$ distinct trajectories and $10^8$ data points, we find that zero-shot forecasts can be competitive in both short-term predictions and in capturing the long-term 'climate' of the dynamics."

흐름을 말로 풀면 이렇다.

```
135개 카오스계 ODE
   └─ 각 계마다 어트랙터 위 임의 초기조건 20개 → 궤적 20개 (길이 812)
        ├─ 앞 512점 ──┬─→ [베이스라인] 이 512점으로 학습 (계별 하이퍼파라미터 튜닝)
        │             └─→ [Chronos]   이 512점을 문맥으로만 입력 (가중치 불변)
        └─ 뒤 300점 ────→ 채점용 정답 (≈10 Lyapunov 시간)
                             ├─ 단기: sMAPE → VPT
                             └─ 장기: 상관차원 RMSE, 상태공간 KL 발산 D_stsp
```

핵심 대비는 부록 **Figure 7** 의 도식이 가장 선명하다. 캡션 verbatim: "Classical deep-learning models (i.e., baseline models) forecast a chaotic system by learning the underlying vector field or flow map. To achieve this, the model adjusts its weights based on data from the same chaotic system. In contrast, foundation models (e.g., Chronos) do not train directly on the system they want to predict."

---

## 왜 이 설계여야 했나 — 세 개의 설계 결정과 그 대가

### 결정 1. 새 모델 대신 새 데이터

**왜 필요한가?** TSFM 논쟁의 교착은 "성능이 높다 vs 벤치마크가 오염됐다"였다. 이 교착은 모델을 하나 더 만들어서는 풀리지 않는다. 오염이 원리적으로 불가능한 데이터를 가져와야 풀린다.

**대안이었다면.** (a) 학습 코퍼스 공개 후 중복 제거 — Chronos 는 코퍼스를 공개했지만 "유사 계열"까지 배제하는 것은 사실상 불가능하다. (b) 시점 기준 홀드아웃(모델 출시 이후 데이터만 사용) — 도메인 분포는 여전히 겹친다. (c) 완전 합성 데이터 — 오염은 막지만 "쉬운 장난감"이라는 비판을 받는다. 카오스계는 (c)의 통제력을 가지면서도 **예측 난이도의 이론적 하한(Lyapunov 시간)** 이 있어 장난감이 아니라는 방어가 가능하다.

**대가.** 결론의 외부 타당도가 "저차원 결정론적 카오스"로 한정된다. 실세계 시계열의 관측 노이즈·측정 결측·고차원성은 이 벤치마크에 없다. 저자들은 Appendix D 에서 실제 카오스 진자 실험(Figure 10)을 하나 붙여 이 약점을 부분적으로 막는다.

### 결정 2. Chronos 를 대표 파운데이션 모델로 고정

§3 verbatim: "we chose Chronos (Ansari et al., 2024) to represent pre-trained models because it has been shown to outperform earlier foundation models for time series, such as TimeGPT and Moirai". Chronos 는 연속값을 스케일링·양자화해 토큰으로 바꾼 뒤 T5 인코더-디코더로 학습된 모델이며(§3), 학습 코퍼스는 42개 출처의 $\sim10^{11}$ 관측이되 **동역학계는 포함하지 않는다**.

**대가.** 결론이 "파운데이션 모델 일반"이 아니라 "Chronos 계열"에 묶인다. TimesFM(디코더 온리)·MOIRAI(다변량 네이티브)는 토크나이저와 문맥 처리 방식이 달라 문맥 복사 의존도가 다를 수 있다. 이 논문은 그 비교를 하지 않는다.

### 결정 3. 채널 독립(univariate) 조건으로 전부 통일

§4 verbatim: "To match the design of Chronos, for multivariate dynamical systems, each baseline model is separately trained and tested along each dimension, and the results are averaged. This channel-independent forecasting task is intrinsically harder than providing full state information, because the models cannot leverage the mutual information between different dimensions".

저자들은 이 선택이 베이스라인에 불리하다는 것을 알고, 두 가지로 방어한다. (i) 채널 독립이 오히려 강한 결과를 낸다는 선행 연구(PatchTST, Nie et al. 2023)를 인용하고, (ii) Appendix G **Figure 13** 에서 다변량 재학습 대조군을 실제로 돌려 보여준다 — §5.1 verbatim: "When the baseline models are instead given full state information (multivariate forecasting), the prediction task becomes easier, resulting in lower sMAPE and higher VPT across all systems (see Appendix)."

**이 대목은 이 논문의 방법론적 성실성이 가장 잘 드러나는 곳이다.** 자기 결론에 불리할 수 있는 대조군을 부록에 숨기지 않고 명시적으로 돌렸고, "그래서 우리 비교는 부분 관측 조건에서의 비교"라고 범위를 좁혀 말한다.

---

## 이 절의 핵심 한 문장

**방법론의 창의성은 모델이 아니라 시험 설계에 있다 — 오염 불가능한 데이터 · 이론적 시계로 정규화된 시간축 · 점 예측과 불변량이라는 두 채점표 · 그리고 메커니즘 가설을 겨눈 셔플 개입.**
