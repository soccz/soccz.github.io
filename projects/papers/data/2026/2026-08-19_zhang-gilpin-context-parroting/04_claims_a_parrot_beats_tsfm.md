# 3. 핵심 Claim 해체 (1) — 베끼기가 이긴다

> **배경 사다리**: 이 절을 이해하려면 ① MAE(평균절대오차, Mean Absolute Error)가 "예측과 정답의 차이 절댓값 평균"이라는 것, ② KL 발산(Kullback–Leibler divergence)이 "두 확률분포가 얼마나 다른가를 재는 비대칭 거리"라는 것, ③ 시계열 예측 평가에는 **점별 정확도**(몇 스텝 뒤 값을 맞혔나)와 **분포/기하 정확도**(전체 그림 모양을 맞혔나)라는 서로 다른 두 축이 있다는 것만 알면 된다.

---

## Claim 1 — 학습 파라미터 0개짜리 복사기가 선도 TSFM들을 카오스 제로샷 예측에서 앞선다

**주장 (한 문장).** 지연좌표 공간에서 가장 닮은 과거 모티프를 찾아 그 뒤를 그대로 복사하는 알고리즘이, 200M~500M 파라미터 시계열 파운데이션 모델들보다 **단기 점별 오차와 장기 어트랙터 재구성 양쪽에서** 더 낮은 오차를 낸다.

**증거 (원문 위치).**

- **Figure 2** — 좌: 예측 지평별 오차 곡선, 우: 예측 어트랙터와 실제 어트랙터 사이 KL 발산. 캡션 verbatim: *"Context parroting outperforms foundation models in zero-shot forecasting for both short-term point-wise accuracy and long-term attractor reconstruction."* 실험 규모도 캡션에 박혀 있다: *"All results are obtained from 135 chaotic systems in the dysts database, with 20 trajectories from random initial conditions for each system."* 문맥 길이는 *"The context length is set to 512 for all models."*
- **Figure 7** — 같은 설정을 MSE(좌)/MAE(우)로 다시 보고하며, 고전 방법 **simplex projection (Sugihara & May 1990)** 과 **AutoARIMA (Hyndman & Athanasopoulos 2018)** 를 비교군에 추가.
- **Figure 3** — 파워 스펙트럼 재구성. 캡션 verbatim: *"Context parroting best reconstructs the power spectra of chaotic systems despite its predictions being periodic."* ($L=2000$, 문맥 종료 후 10,000점 예측, 마지막 2,000점 표시, Welch 법으로 마지막 5,000점에서 스펙트럼 추정.)
- **비용**: §5.1 verbatim — *"a six orders of magnitude computational gap separates Chronos and context parroting for all context lengths."*

**숨은 전제 (저자가 당연시한 것).**

1. **평가 대상 시스템에는 잘 정의된 어트랙터가 있고, 문맥 512점이 그 어트랙터를 어느 정도 훑을 만큼 길다.** dysts 는 표준화된 샘플링(Lyapunov 시간당 점 수 기준)으로 궤적을 뽑으므로, 문맥 안에 "재방문"이 실제로 일어난다. 이 전제가 깨지는 데이터(추세가 계속 이동해 같은 상태를 두 번 방문하지 않는 시계열)에서는 Claim 1 이 성립할 이유가 없다.
2. **비교 대상 TSFM들이 "각자 최선의 사용법"으로 돌아갔다.** 각 모델의 정규화·패치 길이·양자화 설정이 카오스 데이터에 최적화됐는지는 별도 확인이 필요하다. 특히 Figure 4 는 *"The performance of Chronos saturates once the context length exceeds its designed upper limit of 512 data points"* 라고 적는데, 이는 **비교 조건 자체가 Chronos 의 설계 상한에 맞춰졌음**을 뜻한다.
3. **"어트랙터 KL 이 낮다 = 동역학을 더 잘 재현했다"** 라는 지표 해석. parroting 의 예측은 원문 스스로 *"despite its predictions being periodic"* 이라고 인정하듯 **주기적**이다. 주기 신호로 어트랙터의 점 분포를 잘 덮을 수는 있지만, 그것이 카오스의 비주기성까지 재현했다는 뜻은 아니다.

**쉬운 말 풀이.** 시험지 앞장에서 똑같이 생긴 문제를 찾아 답을 베끼는 학생이, 3년간 교과서를 외운 학생을 이겼다. 게다가 "정답을 몇 개 맞혔나"(점별 정확도)뿐 아니라 "답안지 전체 분위기가 얼마나 정답지와 닮았나"(어트랙터 재구성)에서도 이겼다. 다만 베끼기 학생의 답은 사실 **같은 답을 계속 반복**하는 형태라서, 정답의 "예측 불가능함" 자체는 흉내 내지 못한다.

**즉시 던져야 할 반론.** Table 1(MAE @ 50 steps)의 **난류(Turbulence) 행**을 보면 Parrot 은 **0.403±0.210**, Moirai 는 **0.382±0.189**, TimeMoE 는 **0.394±0.172** 다. 즉 **이 과제에서는 parroting 이 두 파운데이션 모델에 수치상 진다.** Claim 1 은 "항상 이긴다"가 아니라 "전반적으로 이기거나 최상위권에 붙는다"로 읽어야 정확하다. 원문 Appendix E 도 같은 톤이다: *"Parroting is either the best or the second best in all experiments."*

---

## Claim 2 — 파운데이션 모델들 자신이 parroting 을 하고 있으며, 하지 않을 때는 공통 실패 모드를 보인다

**주장 (한 문장).** TSFM 의 제로샷 성공은 별도의 물리 추론이 아니라 **모델 내부에서 일어나는 같은 종류의 문맥 복사**이며, 복사가 통하지 않는 구간에서 이들은 **진폭을 과소평가하고 평균으로 수렴하는** 공통 실패를 저지른다.

**증거 (원문 위치).**

- **Figure 1** — Chronos 가 Lorenz 계 $x$ 변수를 512점 문맥으로 예측하는 사례. 캡션 verbatim: *"Chronos produced an accurate prediction by simply looking for a motif in the context similar to the motif immediately preceding the prediction (highlighted in yellow) and copying the evolution following the matching motif (highlighted by pink boxes)."* — 즉 **문맥 안 매칭 모티프와 복사 구간이 그림에 직접 표시**된다.
- **Figure 6** — 같은 과제에 대한 모델별 실패 모드. 캡션 verbatim: *"Chronos does extremely well with a parroting strategy. The other models perform comparatively poorly and all exhibit a tendency to underestimate the oscillations (e.g., by quickly converging towards the mean)."*
- **아키텍처 논변** — 원문은 Chronos 의 복사 성향을 그 구조에서 끌어낸다: *"Chronos's tendency to context parrot arises from its distinct architecture as a language model operating on quantized time series."* 그리고 *"Chronos is trained using cross-entropy loss, which incentivizes preservation of k-gram frequencies."*
- **계보** — §1 이 이 관찰의 출처를 전작으로 명시: *"It was recently observed that one such foundation model, Chronos (Ansari et al. 2024), often employs an extremely simple strategy when forecasting chaotic systems (Zhang & Gilpin 2024)."*

**숨은 전제.**

1. **"결과가 닮았다 → 같은 전략을 쓴다"는 추론.** 이것이 이 논문에서 가장 약한 고리다. 원문에서 확인한 범위 내에서는 **모델 출력과 parroting 출력 사이의 정량적 유사도 지표(상관계수·일치율 등)가 보고되지 않는다.** 근거는 (i) Figure 1·6 의 사례 그림, (ii) 양자화+교차엔트로피가 $k$-gram 빈도를 보존한다는 아키텍처 논변, (iii) 성능표에서의 동반 상승/하락이다. 이는 정황으로는 강하지만 **인과적 국소화는 아니다.**
2. **"평균 수렴 = 실패"라는 규범적 판단.** 사실 MSE 를 최소화하는 예측기에게 **불확실할 때 조건부 평균을 내놓는 것은 최적 행동**이다. 카오스계에서 Lyapunov 시간을 넘긴 구간의 조건부 평균은 실제로 어트랙터 평균에 가깝다. 즉 TSFM 의 "평균 수렴"은 버그가 아니라 **손실함수에 충실한 결과**일 수 있고, 저자들이 쓰는 지표(점별 MAE + 어트랙터 KL)가 그 행동에 유독 가혹한 것일 수 있다.
3. **Chronos 를 대표로 삼는 일반화.** 아키텍처 논변은 **양자화된 토큰 + 교차엔트로피**를 쓰는 Chronos 에 특화돼 있다. TimesFM·Moirai 처럼 연속값 회귀 기반 모델이 같은 이유로 parroting 한다는 논증은 원문 §1~§2 범위에서 별도로 제시되지 않는다.

**쉬운 말 풀이.** 우등생 답안지를 들여다봤더니 앞장 베끼기 흔적이 있었다(그림 1). 그리고 베낄 게 없을 때는 대부분 "적당히 한가운데 값"으로 답을 뭉갰다(그림 6). 다만 "답안지가 비슷하니 같은 방법을 썼을 것"이라는 추론은 **답안지를 본 것**이지 **머릿속을 본 것**은 아니다. 머릿속을 보려면 회로를 직접 끊어보는 개입 실험이 필요한데, 그건 이 논문의 범위 밖이다.
