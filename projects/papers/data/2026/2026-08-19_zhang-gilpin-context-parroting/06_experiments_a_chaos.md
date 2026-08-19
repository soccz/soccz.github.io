# 5. 실험 해부 (a) — dysts 135개 카오스계

> **배경 사다리**: 이 절을 이해하려면 ① "벤치마크"가 "모든 모델을 같은 조건에서 재는 표준 시험지"라는 것, ② 시계열 예측 평가에는 서로 다른 두 질문(**"몇 스텝 뒤 값을 맞혔나"** vs **"전체 궤적의 통계를 맞혔나"**)이 있다는 것, ③ 카오스계에서는 원리적으로 장기 점별 예측이 불가능하므로 후자가 더 의미 있는 질문이 된다는 것을 알면 된다.

---

## 5a.1 데이터: 왜 dysts 인가, 그리고 여기 숨은 편향

**어떤 데이터인가.** 원문 §5.1 verbatim: *"dysts dataset provides a standardized benchmark of 135 low-dimensional chaotic systems, each defined by a set of ordinary differential equations between dimensionality three and six"* (Gilpin 2021). 각 시스템에 대해 무작위 초기조건 **20개**, 총 2,700개 궤적.

**왜 이 데이터가 이 논문의 주장에 적합한가.** 세 가지 이유에서 잘 맞는다.

1. **정답이 존재한다.** 상미분방정식으로 정의되므로 참 궤적을 임의 정밀도로 생성할 수 있고, 어트랙터의 불변량(상관차원, Lyapunov 지수)도 계산 가능하다. §5.2 의 $\alpha$ vs $1/d_{\mathrm{cor}}$ 검증은 **이 데이터가 아니면 애초에 불가능**하다.
2. **시간 스케일이 표준화된다.** Lyapunov 시간 단위로 샘플링하므로 "느린 시스템에서 잘 맞혔다"는 착시가 제거된다.
3. **135개는 단일 사례 반박을 막는다.** "Lorenz 에서만 되는 트릭 아니냐"는 반론이 봉쇄된다.

**숨은 편향 — 반드시 짚어야 할 세 가지.**

- **저자 편향(구조적).** dysts 는 **본 논문 제2저자 Gilpin 이 만든 벤치마크**다. 이는 부정직함의 문제가 아니라 **선택 효과**의 문제다. 벤치마크 설계자가 세운 표준(어떤 시스템을 포함할지, 어떤 샘플링 밀도를 쓸지)이 우연히 parroting 에 유리할 가능성은 독립적으로 검증돼야 한다.
- **차원 편향(결정적).** 시스템 차원이 **3~6** 이다. §5.2 의 $\alpha = 1/d_{\mathrm{cor}}$ 에 따르면 **차원이 낮을수록 parroting 의 문맥 효율이 높다.** 즉 **이 벤치마크는 구조적으로 parroting 에 유리한 영역에 있다.** 저자들도 이를 알기에 §5.3 에서 고차원 과제로 확장하지만, 그쪽도 강한 준주기성을 갖는다([04_claims_b](04_claims_b_induction_and_scaling.md) Claim 5 참조).
- **정상성 편향(가장 중요).** dysts 궤적은 **고정된 파라미터의 자율 시스템**이다. 어트랙터가 시간에 따라 바뀌지 않는다. 실제 관심 대상(기후, 금융, 생리)의 상당수는 **어트랙터 자체가 이동**한다. 문맥 복사는 "과거가 미래와 같은 규칙을 따른다"에 전적으로 의존하므로, 이 편향은 결과의 외적 타당도를 직접 제한한다.

## 5a.2 베이스라인 공정성 심문

**질문 1: 6개 TSFM 이 동등하게 튜닝됐는가?**

제로샷 평가이므로 "튜닝"의 의미가 학습된 모델과 다르다. 문제는 **호출 조건**이다. Figure 2 는 모든 모델에 문맥 512 를 준다. 그런데 Figure 4 캡션 verbatim: *"The performance of Chronos saturates once the context length exceeds its designed upper limit of 512 data points."* 즉 **512 는 Chronos 의 설계 상한에 맞춰진 값**이다. TimesFM-2.0 이나 Moirai 처럼 더 긴 문맥을 지원하는 모델이 있다면 이 통일 조건은 **그들에게 불리**하다. 반대로 parroting 은 문맥이 길수록 계속 좋아지므로(Figure 4), **512 라는 선택은 오히려 parroting 의 승리 폭을 축소하는 방향**이다. 저자들에게 유리하게 조작된 조건이라고 보기는 어렵고, 오히려 보수적이다.

**질문 2: 고전 방법은 왜 부록으로 밀렸는가?**

Figure 7 이 simplex projection 과 AutoARIMA 를 포함하지만, 본문 Figure 2 에는 없다. 논문의 서사(파운데이션 모델 vs 무학습 베이스라인)에는 맞지만, **지적으로는 이 배치가 아쉽다.** simplex projection 은 parroting 과 거의 같은 계열이므로, 그 둘의 차이(1-NN 복사 vs 이웃 가중 외삽)를 본문에서 정면으로 다뤘다면 "무엇이 성능을 만드는가"가 훨씬 선명해졌을 것이다.

**질문 3: DynaMix 의 위치.** DynaMix 는 동역학계 전용으로 설계된 모델이며, Table 3(어트랙터 KL)의 난류 행에서 **0.005±0.008** 로 Parrot 의 **0.028±0.044** 보다 낮다. 즉 **동역학 전용 설계는 실제로 효과가 있다**는 반대 증거가 표 안에 이미 들어 있다.

## 5a.3 지표 선택 — 왜 이 조합인가

원문 §5.3 verbatim: *"For the metrics, we use MAE and MSE to measure pointwise forecast accuracy, and KL Divergence to measure the accuracy in attractor reconstruction."* 여기에 sMAPE 정의도 등장한다:

$$\mathrm{sMAPE}(\mathbf{x},\hat{\mathbf{x}}) \equiv \frac{2 \cdot 100}{T}\sum \frac{|\mathbf{x}_t - \hat{\mathbf{x}}_t|}{|\mathbf{x}_t| + |\hat{\mathbf{x}}_t|}$$

**4줄 해석**
- **기호**: $\mathbf{x}_t$ 참값, $\hat{\mathbf{x}}_t$ 예측값, $T$ 평가 시점 수. 단위는 **퍼센트**.
- **비유**: "틀린 정도를 값의 크기로 나눈 상대 오차"다. 큰 값에서 100 틀린 것과 작은 값에서 100 틀린 것을 같게 취급하지 않는다.
- **왜 이 형태**: 분모를 $|\mathbf{x}_t| + |\hat{\mathbf{x}}_t|$ 로 대칭화하면 참값이 0 에 가까울 때 폭발하는 MAPE 의 병을 완화한다. 서로 스케일이 다른 135개 시스템을 한 표에 모으려면 이런 무차원 지표가 필요하다.
- **조심할 점**: 진동하는 신호에서 $\mathbf{x}_t$ 가 0 을 통과할 때는 여전히 불안정하다. 그리고 sMAPE 는 과대예측과 과소예측을 비대칭적으로 벌준다.

**만약 지표가 달랐다면 결론이 바뀌었을까?** — 이것이 이 논문에서 가장 중요한 반사실 질문이다.

- **분포 지표(CRPS 등)로 갔다면**: 확률 예측을 내놓는 Chronos·MOIRAI 계열이 유리해졌을 가능성이 크다. parroting 은 **점 예측만** 내놓으므로 불확실성 정량화 축에서는 경쟁 자체가 안 된다. 원문 지표 목록에서 CRPS 는 확인되지 않는다.
- **평균 대신 중앙값을 봤다면**: Figure 2 캡션이 둘 다 그린다고 명시하므로 저자들이 이 축을 숨기지 않았다. 다만 본문 서술은 평균 기준이다.
- **"평균 수렴"을 벌하지 않는 지표였다면**: [04_claims_a](04_claims_a_parrot_beats_tsfm.md) 에서 지적했듯, MSE 최소화 관점에서 평균 수렴은 합리적 행동이다. 만약 지표가 **"진폭 재현"** 이 아니라 **"조건부 기댓값 정확도"** 였다면 TSFM 이 유리했을 것이다. 저자들이 고른 지표 조합(점별 MAE/MSE + 어트랙터 KL + 파워 스펙트럼)은 명백히 **"동역학적 실감(realism)"** 쪽에 무게를 둔 선택이며, 이건 논문의 주장(물리를 배웠는가?)과 정합적이지만 **중립적이지는 않다.**

## 5a.4 주요 그림 해석

**Figure 2 (본문의 심장).** 좌측 패널은 예측 지평이 길어질수록 모든 모델의 오차가 커지는 곡선을, 우측은 어트랙터 KL 을 보여준다. 캡션이 결론을 못박는다: *"Context parroting outperforms foundation models in zero-shot forecasting for both short-term point-wise accuracy and long-term attractor reconstruction."* **두 축 모두에서 이겼다는 것이 이 그림의 전부이자 논문의 근거 무게중심**이다. 다만 원문 §5.1 본문에서 "몇 %p 차이"라는 구체적 수치는 **확인되지 않았다** — 이 그림의 우위는 곡선의 분리로 제시되며, 수치는 §5.3 의 Table 1~3 에서만 표 형태로 나온다.

**Figure 3 (가장 흥미로운 그림).** 캡션 verbatim: *"Context parroting best reconstructs the power spectra of chaotic systems despite its predictions being periodic."* 이 문장은 **자기모순처럼 보이는데 사실 논문의 이론과 정확히 맞는다.** Appendix F.4 의 불변량 보존 명제가 말하는 바가 "개별 시점은 틀려도 통계는 맞는다"이기 때문이다. 주기적 신호라도 그 주기가 어트랙터의 특징적 시간 스케일을 담고 있으면 파워 스펙트럼은 잘 맞는다. **동시에 이건 지표의 한계 폭로이기도 하다** — 파워 스펙트럼과 어트랙터 KL 은 "이 예측이 주기적인가 카오스적인가"를 구분하지 못한다.

**Figure 4 (실무자용 그림).** 캡션 verbatim: *"Parroting can better utilize longer context data while Chronos does better for shorter contexts."* 두 방법의 교차점이 존재한다는 뜻이다. 짧은 문맥에서는 사전학습된 귀납 편향이 이기고, 긴 문맥에서는 순수 검색이 이긴다. **이건 "파운데이션 모델 무용론"이 아니라 "데이터가 적을 때 사전학습이 값어치를 한다"는 정직한 진술**이며, 이 논문에서 가장 균형 잡힌 한 줄이다.

**Figure 6 (실패 모드 카탈로그).** 캡션 verbatim: *"Chronos does extremely well with a parroting strategy. The other models perform comparatively poorly and all exhibit a tendency to underestimate the oscillations (e.g., by quickly converging towards the mean)."* Chronos 만 parroting 을 하고 나머지는 평균으로 뭉갠다는 대비가 그림 하나에 정리돼 있다. **아키텍처와 전략의 대응**(양자화+교차엔트로피 → 복사, 연속 회귀 → 평균)을 시각적으로 지지하는 가장 강한 증거다.

**Figure 7 (부록의 보강).** MSE/MAE 두 지표로 재확인 + 고전 방법 추가. 주 결론이 지표 선택의 산물이 아님을 방어한다.

## 5a.5 Ablation — 저자가 넣은 것과 넣지 않은 것

**넣은 것 (성실함의 증거):**
- **Appendix C**: 임베딩 차원 $D$ 민감도 — verbatim *"the valid prediction time stays consistent over a wide range of embedding dimension $D$."* 즉 **주 결과가 $D$ 튜닝의 산물이 아님**을 방어.
- **Appendix E**: 노이즈 — verbatim *"The results are consistent across different orders of magnitude in noise, and parroting is consistently the best or the second best in all experiments."* 그리고 샘플링 밀도(10/30/50 points per Lyapunov time) — verbatim *"Granularity does not strongly affect the results or relative model ranking."*
- **Appendix D**: 장기 지평에서의 불변량(Table 4).
- **Figure 2 의 평균+중앙값 동시 표기**: 분포 왜곡 가능성을 스스로 노출.

**넣지 않은 것 (가장 아쉬운 공백 3개):**

1. **모델 출력 vs parroting 출력의 정량 유사도.** Claim 2 의 핵심 증거가 될 수 있었던 실험 — "Chronos 예측과 parroting 예측의 상관/일치율이 시스템별로 얼마인가"를 재고, 그 유사도가 높은 시스템에서 Chronos 성능도 높은지 보였다면 Claim 2 는 정황에서 **통계적 증거**로 승격됐을 것이다. 원문에서 이런 지표는 확인되지 않는다.
2. **$k$-NN 앙상블 ablation.** $k=1$ 이 의도된 선택이라면($\sigma \to 0$), $k=3,5,10$ 에서 성능이 어떻게 떨어지는지 보여주는 것이 Appendix F 이론과 실험을 잇는 가장 자연스러운 다리였다. 원문에서 확인되지 않는다.
3. **Theiler window ablation.** 시간적으로 인접한 이웃을 배제했을 때와 안 했을 때의 차이. 동역학 문헌의 표준 통제인데 원문에서 확인되지 않는다. 이게 없으면 "복사가 통했다"의 일부가 **단순 자기상관 지속성**일 가능성을 배제할 수 없다.

## 5a.6 부록에 숨은 신호

Appendix E 의 문장 하나가 본문보다 정직하다: **"parroting is consistently the best or the second best in all experiments"** — 즉 **항상 1등은 아니다.** 본문 서사는 "outperforms"로 단정적이지만 부록의 실제 표현은 "1등 또는 2등"이다. 이 온도차는 Table 1 난류 행(Parrot 0.403 > Moirai 0.382)에서 확인되는 사실과 일치한다. **논문을 인용할 때는 부록의 온도를 따르는 것이 안전하다.**
