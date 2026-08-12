# 4-D. 메커니즘 프로브 — 문맥 중복도 측정, $k$-gram 셔플, 비정상성 변조

> **배경 사다리**: ① 여기까지가 "얼마나 잘하나"였다면 이 절은 "**왜** 잘하나"다. ② 메커니즘 주장을 검증하는 방법은 둘 — 상관을 재거나(관측), 입력을 조작하고 성능 변화를 보거나(개입). ③ 개입이 상관보다 강한 증거인 이유는, 조작된 변수 외 모든 것이 고정되기 때문이다.

---

## 왜 이 부분이 필요한가

Claim 1·2 만 있으면 이 논문은 "Chronos 대단하다"로 끝나는 벤치마크 논문이다. 저자들이 그 이상으로 간 지점이 여기다 — **성공의 원인을 하나 지목하고, 그 원인을 겨냥한 조작 실험 세 개를 설계했다.** 이 세 프로브가 이 논문을 `tsfm-interp` 문헌으로 만든다.

---

## 프로브 1 — 문맥 중복도 (관측 · §5.3, Figure 5)

**정의** verbatim: "we directly quantify the similarity between the timepoints immediately preceding a forecast and previous intervals seen in the context. We use the highest-correlating subsequence of duration greater than 30 timepoints (1 Lyapunov time in our units) as a measure of context overlap."

말로 풀면: 문맥 512점의 **마지막 구간**을 쿼리로 삼고, 그 앞쪽 문맥 전체를 훑어 **가장 상관이 높은 30점 이상 길이의 부분열**을 찾아 그 상관값을 "문맥 중복도"로 쓴다.

**설계의 미덕과 약점.**
- 미덕: 이 지표는 **모델과 무관하게 데이터에서만** 계산된다. 따라서 Chronos 와 NBEATS 에 동일하게 적용해 "누가 더 문맥에 의존하는가"를 대칭적으로 비교할 수 있다(Figure 5B, matched t-test $N=135$, $p<10^{-3}$).
- 약점: 이것은 **상관**이다. `04_claims_c_parroting.md` 에서 지적한 교란 — "반복 구조가 많은 계는 그냥 쉬운 계다" — 을 완전히 배제하려면 문맥에서 유사 구간만 지우는 개입이 필요한데, 그 실험은 없다.

**Figure 5A 의 역할** 캡션 verbatim: "(A) Better zero-shot forecasts often have initial stages that overlap with the context. The context overlap quantifies the similarity between the last 30 points of the context and the prior points." — 정량 비교(B) 앞에 사례 하나(A)를 놓아 독자가 현상을 눈으로 확인하게 하는 배치다.

---

## 프로브 2 — $k$-gram 셔플 (개입 · §5.4, Figure 6A)

**조작 정의** verbatim: "We test this hypothesis by randomly shuffling all length-$k$ sequences of successive timepoints in the model's context, and then repeating our zero-shot experiments as $k$ increases (Fig. 6A). For example, if the context is $x_1, x_2, x_3, x_4$, then a 1-gram shuffle would be $x_1, x_4, x_2, x_3$ while a 2-gram shuffle would be $x_3, x_4, x_1, x_2$."

**통제 조건** verbatim: "We keep the last $k$ context timepoints the same as the original training dataset, but we ensure that the penultimate $k$ sequence differ from the unshuffled context. As a baseline, we also directly perform zero-shot forecasts using only the last $k$ context timepoints."

**이 설계가 왜 영리한가 — 3줄 해설.**

1. **$k$ 가 곧 "보존된 지역 구조의 길이"** 다. $k=1$ 이면 시간 구조를 완전히 파괴하고 값들의 히스토그램만 남는다. $k$ 를 키우면 국소 동역학은 살고 전역 순서만 깨진다. 즉 $k$ 를 스캔하는 것은 "동역학의 어느 스케일이 필요한가"를 스캔하는 것이다.
2. **대조군이 정확히 옳게 잡혔다.** 셔플된 512점을 그냥 "온전한 512점"과 비교하면 당연히 성능이 떨어질 것이고, 그러면 "순서가 중요하다"는 시시한 결론만 나온다. 저자들은 대신 **"길이 $k$ 의 온전한 문맥"** 과 비교했다. 두 조건은 "온전한 연속 정보의 양"이 같고, 셔플 쪽만 **추가로 무순서 통계**를 더 갖는다. 이 비교에서 셔플이 이기면, 그 이득은 순서 없는 통계 정보에서 왔다고 귀속할 수 있다.
3. **마지막 $k$ 점을 원본으로 고정한 것**은 예측 시작점의 국소 상태를 통제하기 위한 조치다. 이게 없으면 성능 차이가 "출발점이 달라져서"와 뒤섞인다.

**결과** verbatim: "We find that the model's forecast accuracy increases with the context length, but that, for sufficiently long contexts, random shuffles provide better forecasts than shorter context baselines. Earlier context points thus provide statistical information about the distribution of single timepoint values, as well as conditional probabilities of certain pairs, triplets, et cetera".

**이론적 착지점** verbatim: "The ergodicity of chaotic attractors implies that they have a well-defined stationary distribution of expected states $p(x_t)$, known as the natural measure (Ott, 2002). Long contexts (even when shuffled), beyond the timescale over which the states of a system become decorrelated, facilitate in-context learning of this measure."

**남는 약점.** 이 프로브는 "무순서 통계도 쓰인다"를 보이지만, `04_claims_c_parroting.md` 에서 적었듯 **복사와 분포 학습을 분리하지 못한다** — 섞인 문맥에도 유사 토막은 그대로 남아 있기 때문이다.

---

## 프로브 3 — 비정상성 변조 (개입 · Appendix E, **식 (3)**, Figure 11)

이 논문에서 `non-stationarity-ts` 태그를 정당화하는 핵심 실험이며, 본문이 아니라 부록에 있다.

$$x_t \leftarrow x_t\, e^{\,t\,\frac{\log f_{\min}}{T-1}} \tag{3}$$

**① 기호 뜻.** $x_t$ = 시각 $t$ 의 원 신호, $T$ = 계열 길이, $f_{\min}$ = 계열 끝에서의 진폭 배율 [무차원, 0~1]. 지수부는 $t=0$ 에서 0, $t=T-1$ 에서 $\log f_{\min}$ 이 되므로 진폭이 1 에서 $f_{\min}$ 으로 **지수적으로 감쇠**한다.

**② 일상 비유.** 종을 친 뒤 소리가 서서히 작아지는 것. 종소리의 "가락"(동역학)은 그대로인데 크기만 계속 줄어든다. $f_{\min}=1$ 이면 아예 안 줄고, $f_{\min}\to 0$ 이면 결국 멎는다.

**③ 왜 이 형태인가.** 비정상성을 **하나의 스칼라로 연속 조절**하기 위해서다. 저자 서술 verbatim: "By decreasing $f_{\min}$ from 1 to 0, we increase the degree to which the dynamics appear non-stationary. When $f_{\min} = 1$, then the damping term becomes a constant and the dynamics are unaffected. However, when $f_{\min} \to 0$, the dynamics resemble damped oscillations that monotonically approach a fixed point." 지수형(곱셈형)을 고른 이유는 물리적 소산(dissipation)이 보통 곱셈적이고, 로그를 취하면 선형 추세가 되어 해석이 단순해지기 때문이다. 가법적 드리프트($x_t + ct$)를 썼다면 계의 스케일에 의존해 135계 간 비교가 깨졌을 것이다.
**의미 부여** verbatim: "We thus consider experiments forecasting time series with $f_{\min} < 1$ a quantitative probe of the degree to which zero-shot forecasts are applicable to real-world systems, in which the chaotic attractor irreversibly deforms due to processes like dissipation. In a machine learning context, this setting corresponds to out-of-distribution or out-of-domain generalization".

**④ 조심할 점.** 이 변조는 **진폭 비정상성 한 종류**일 뿐이다. 실세계 비정상성에는 평균 이동(레짐 전환), 분산 변화, 주기 변화, 구조적 단절이 있고, 이들은 문맥 복사에 서로 다른 방식으로 타격을 준다. 특히 이 지수 감쇠는 **단조 추세**라서, 추세를 명시적으로 모델링하는 계열에게 유리하다 — 저자들도 정확히 그렇게 인정한다 verbatim: "time series models like NBEATS, which can directly identify and model monotonic trends, have an advantage on simple out-of-distribution forecasting tasks like the one we consider here."

**결과** verbatim: "We find that, across all 135 systems, the performance of Chronos degrades as the degree of nonstationarity $1 - f_{\min}$ increases (Fig 11)." Figure 11 캡션 verbatim: "Zero-shot forecasts degrade with distribution shift. Forecast accuracy (VPT) of zero-shot forecasts with Chronos-base, as the degree of nonstationarity in the time series varies via Eq. 3. Curve and error bars are median and standard error over 20 initial conditions for each of $N = 135$ chaotic dynamical systems."

**왜 열화하는가 — 저자의 인과 설명** verbatim: "Because context-parroting is a particularly effective strategy for stationary systems like ergodic chaotic attractors ... Nonstationarity undermines all of these mechanisms, leading to the degradation in performance as the forecast regime more strongly differs from the context."

**저자가 제시한 처방 3개 (Appendix E, verbatim 요약)** — 이 목록은 후속 연구 설계에 그대로 쓸 수 있어 옮겨 둔다.
1. verbatim: "Using Chronos's tokenizer in tandem with a modern language model with an explicit positional encoding scheme, like rotary positional embedding, would provide the model with explicit time information that would allow it to capture longer-term trends in a time series Su et al. (2024)." — **RoPE 를 명시적으로 지목한다.**
2. verbatim: "Pretraining with short time series. While Chronos's original training dataset includes many nonstationary processes, shorter time series generally exhibit greater nonstationarity, and so their inclusion represents a simple mechanism to improve model robustness."
3. verbatim: "Biasing generative forecasting towards rarer states. ... Modifications of this scheme that encourage oversampling of rarer states could help the model better account for irreversible processes, though potentially at the expense of lower performance on ergodic processes."

---

## 이 절의 핵심 한 문장

**세 프로브는 "성능"이 아니라 "성능의 조건"을 측정한다 — 문맥에 반복이 있어야 하고(프로브 1), 문맥이 길어야 하며(프로브 2), 어트랙터가 변하지 않아야 한다(프로브 3). 이 세 조건이 깨지는 곳이 곧 TSFM 의 실무 실패 지점이다.**
