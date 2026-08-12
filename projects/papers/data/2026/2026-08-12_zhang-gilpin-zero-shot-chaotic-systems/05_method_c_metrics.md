# 4-C. 네 개의 지표 — sMAPE · VPT · 상관차원 · KL 발산

> **배경 사다리**: ① 예측 오차 지표는 "얼마나 틀렸나"를 하나의 숫자로 압축하는 규칙이다. ② 카오스에서는 시간이 지나면 **모든** 모델이 반드시 틀리므로, "얼마나 틀렸나"보다 "**언제까지 맞았나**"가 더 정보량이 많다. ③ 그리고 다 틀린 뒤에도 "생성된 궤적 전체가 만드는 모양"은 채점할 수 있다.

---

## 왜 이 부분이 필요한가

카오스 예측의 채점은 일반 시계열과 근본적으로 다르다. 지평이 길어지면 오차가 지수적으로 커져 어떤 오차 지표든 포화한다. 포화한 뒤의 값은 모델을 구분하지 못한다 — 100% 틀린 모델과 300% 틀린 모델의 차이는 의미가 없다. 그래서 이 논문은 **오차 곡선 자체**(sMAPE vs 지평)를 그리고, 거기서 **문턱 통과 시각**(VPT)을 뽑고, 그와 **직교하는 축**으로 어트랙터 불변량 두 개를 세운다.

§4 verbatim: "we use four metrics to evaluate forecast quality, including Symmetric Mean Absolute Percentage Error (sMAPE)."

---

## 지표 1 — sMAPE (대칭 평균 절대 백분율 오차)

$$\mathrm{sMAPE}(x, \hat{x}) \equiv 2\,\frac{100}{T}\sum_{t=1}^{T}\frac{|x_t - \hat{x}_t|}{|x_t| + |\hat{x}_t|}$$

(§4 "Metrics." 문단 및 Appendix B.2 에 동일 식이 무번호로 두 번 제시된다.)

**① 기호 뜻.** $x_1,\dots,x_T$ = 참값 [계의 상태 변수 단위], $\hat{x}_1,\dots,\hat{x}_T$ = 같은 시각의 예측값, $T$ = 최대 예측 지평 [timepoint]. 결과 단위는 % 이고 이론적 범위는 0~200.

**② 일상 비유.** 두 사람이 각자 몸무게를 말했을 때 "몇 kg 차이"가 아니라 "둘의 평균 대비 몇 % 차이"로 재는 것이다. 절대 크기가 제각각인 135개 계를 한 표에 놓으려면 이런 상대 척도가 필요하다.

**③ 왜 이 형태인가.** 분모가 참값 $|x_t|$ 만이면(=일반 MAPE) 참값이 0 근처를 지날 때 값이 폭발한다. 카오스 궤적은 원점 근처를 자주 지나므로 이는 치명적이다. 분모를 $|x_t| + |\hat{x}_t|$ 로 두면 **상한이 200% 로 묶여** 몇몇 계의 발산이 평균을 지배하는 일을 막는다. 저자들의 근거 verbatim: "found that sMAPE strongly correlates with other metrics (e.g. RMSE, NRMSE, MASE, Spearman correlation) while exhibiting favorable properties like a bounded range" (Appendix B.2).

**④ 조심할 점.** sMAPE 는 여전히 비대칭적 편향(과소예측과 과대예측에 다른 벌점)이 있다고 알려진 지표다. 또한 유계라는 성질은 장점인 동시에 **포화** 를 뜻한다 — 완전히 틀린 두 모델이 똑같이 ~200% 로 붙어버려 구분되지 않는다. 바로 이 포화가 다음 지표를 필요하게 만든다.

---

## 지표 2 — VPT (유효 예측 시간), **식 (1)**

$$\mathrm{VPT} \equiv \arg\max_{t_f}\{\,t_f \mid \mathrm{sMAPE}(x_t, \hat{x}_t) < \epsilon,\ \forall t < t_f\,\}$$

§4 verbatim 정의문: "Valid Prediction Time (VPT). The first forecast horizon at which the sMAPE exceeds a fixed threshold $\epsilon$ (Vlachas et al., 2020)." 그리고 문턱값 verbatim: "We set $\epsilon = 30$, as in prior studies (Vlachas et al., 2020; Gilpin, 2023)."

**① 기호 뜻.** $t_f$ = 예측 지평 [Lyapunov 시간 단위로 보고됨], $\epsilon = 30$ [%]. VPT 는 "오차가 30% 를 처음 넘기 **직전**까지의 시간".

**② 일상 비유.** 자동차 연비를 "리터당 몇 km"가 아니라 "기름 한 통으로 고속도로에서 **몇 시간 달렸나**"로 재는 것. 결국 모두 멈추지만, 언제 멈췄는지가 차를 구분한다.

**③ 왜 이 형태인가.** $\forall t < t_f$ 라는 조건이 핵심이다. "한 번이라도 30% 를 넘으면 거기서 끝"이므로 VPT 는 **한 번 무너지면 회복을 인정하지 않는** 보수적 지표다. 카오스에서는 우연히 다시 맞는 구간이 생기는데, 그걸 성능으로 세면 안 되기 때문이다. 또 시간 단위를 $\tau$ 로 정규화하므로 135계의 VPT 를 그대로 평균·검정할 수 있다.

**④ 조심할 점.** (i) $\epsilon = 30$ 은 관례적 선택이며, 이 값을 바꾸면 모델 간 순위가 바뀔 여지가 있다 — 민감도 분석은 원문에 없다. (ii) VPT 는 **첫 붕괴 시각**만 보므로 붕괴 이후의 행동(어트랙터를 벗어나 발산하는지, 어트랙터 위에 남는지)을 전혀 구분하지 못한다. 이 맹점이 지표 3·4 를 요구한다. (iii) 문턱형 지표라 분포가 왜곡되기 쉬워 저자들이 평균 대신 **median VPT** 와 비모수 검정(Friedman)을 쓴 것은 적절한 선택이다.

---

## 지표 3 — 상관차원 $d_{\text{frac}}$

§4 verbatim: "For chaotic dynamical systems, the long-term distribution of observed data points approximates a fractal object known as the strange attractor. ... The correlation dimension non-parametrically estimates the fractal dimension from a time series, by calculating the scaling of the number of other attractor points that fall within a given radius of each point (Grassberger & Procaccia, 1983). We compute the correlation dimension using all data points from a model's forecasts and report the root mean square error between the inferred correlation dimension and the ground truth."

**직관.** 어트랙터 위의 한 점을 잡고 반지름 $r$ 짜리 공을 씌워 그 안에 들어오는 다른 점의 개수를 센다. $r$ 을 키우면 개수가 $r^{d}$ 처럼 자란다. 그 지수 $d$ 가 상관차원이다. 선이면 1, 면이면 2, 로렌츠 어트랙터처럼 "면보다 얇고 선보다 두꺼운" 프랙탈이면 2.05 같은 소수가 나온다.

**왜 이 지표인가.** 시점 정렬이 필요 없다. 예측 궤적이 참 궤적과 **언제 어디에 있었는지 전혀 안 맞아도**, 두 점구름의 모양이 같으면 같은 값이 나온다. "날씨는 틀리고 기후는 맞는" 상태를 정확히 포착한다.

**조심할 점.** 상관차원 추정은 표본 수와 스케일링 구간 선택에 민감하기로 악명 높다. 300점 예측(≈10 $\tau$)만으로 프랙탈 차원을 추정하는 것은 통상 권장 표본보다 적다. 다만 저자들은 이를 절대 정확도가 아니라 **모델 간 순위상관**(Figure 4B 의 Spearman)으로 쓰므로 편향이 공통으로 상쇄될 여지가 있다. 그럼에도 "추정기 편향이 모델 종류와 무관하다"는 것은 검증되지 않은 전제다.

---

## 지표 4 — 상태공간 KL 발산 $D_{stsp}$ (Appendix B.3, **식 (2)** 포함)

$$D_{stsp} \equiv D_{KL}(p(x)\,\|\,q(x)) = \int_{x\in\mathbb{R}^N} p(x)\log\!\left[\frac{p(x)}{q(x)}\right]dx$$

고차원에서 이 적분은 직접 못 구하므로 참·생성 궤적 각각에서 가우시안 혼합(GMM)으로 밀도를 근사한다 — **식 (2)**:

$$\hat{p}(x) = (1/T)\sum_{t=1}^{T}\mathcal{N}(x; x_t, \Sigma_t), \qquad \hat{q}(x) = (1/T)\sum_{t=1}^{T}\mathcal{N}(x; \hat{x}_t, \Sigma_t)$$

그리고 몬테카를로 추정:

$$D_{stsp} \approx \frac{1}{n}\sum_{i=1}^{n}\log\frac{\hat{p}(x^{(i)})}{\hat{q}(x^{(i)})},\quad x^{(i)} \sim \text{참 궤도}$$

**저자의 독자적 수정 (중요).** Appendix B.3 verbatim: "While prior works set the covariance matrix equal to the scaled identity matrix $\Sigma_t = \sigma_t^2 \mathbf{1}$ with $\sigma_t = 1$ for all $t$, we instead set $\sigma_t = \|x_t - x_{t-1}\|$ in order to adjust for uneven spacing among data points."

**① 기호 뜻.** $p, q$ = 참·예측 궤적이 상태공간에 남긴 점들의 분포, $\Sigma_t$ = 각 점에 씌우는 가우시안의 공분산, $\sigma_t$ = 그 폭. 저자들은 폭을 **직전 점과의 거리**로 잡았다.

**② 일상 비유.** 점들을 뿌려 놓고 그 위에 물감을 번지게 해서 "구름"을 만든 뒤, 두 구름이 얼마나 겹치는지 재는 것이다. 저자들의 수정은 "점들이 듬성듬성한 곳에서는 물감을 더 넓게 번지게 하라"는 뜻이다.

**③ 왜 이 형태인가.** 카오스 궤적은 어트랙터의 영역마다 속도가 다르다 — 빠르게 지나가는 구간은 점이 성기고, 느린 구간은 촘촘하다. 고정 폭을 쓰면 성긴 구간이 인위적으로 "밀도 0" 처럼 보여 KL 이 과대평가된다. $\sigma_t = \|x_t - x_{t-1}\|$ 는 국소 속도에 비례해 폭을 조절하는 자연스러운 보정이다.

**④ 조심할 점.** KL 은 비대칭이며, $q$ 가 0 인 영역에서 $p$ 가 양수면 발산한다. GMM 근사가 이를 완화하지만 폭 선택이 결과를 좌우한다 — 즉 이 지표에는 **저자 재량이 들어 있다.** 저자들이 상관차원과 KL 두 지표를 나란히 놓고 "같은 경향"을 확인한 것(§5.2 verbatim: "we found the same trends")은 이 재량 위험에 대한 적절한 방어다.

---

## 다른 접근으로 했다면

- **MSE 하나만 썼다면**: 지평 3~4 $\tau$ 이후 모든 모델이 포화해 구분이 사라지고, Claim 2 는 아예 관측 불가능했을 것이다.
- **최대 Lyapunov 지수 추정치를 예측 궤적에서 뽑아 비교했다면**: 더 물리적으로 엄격한 채점이지만, 300점 표본에서 $\lambda$ 추정은 상관차원보다도 불안정하다. 저자들은 Appendix G Figure 14 에서 $\lambda$ 를 **예측 대상이 아니라 계의 난이도 설명변수**로 쓰는 더 안전한 용법을 택했다.
- **분포 거리로 Wasserstein 을 썼다면**: 지지집합이 어긋날 때도 유한하다는 장점이 있고 KL 의 발산 문제를 피한다. 저자들이 선행 연구(Hess 2023, Göring 2024)와의 비교 가능성을 위해 KL 을 택한 것은 합리적이나, Wasserstein 대조는 없다.

---

## 이 절의 핵심 한 문장

**이 논문의 진짜 기여는 지표 두 축을 직교시킨 것이다 — 시간축 채점(VPT)은 "언제까지 맞았나"를, 상태공간 채점(상관차원·$D_{stsp}$)은 "다 틀린 뒤에도 무엇이 남았나"를 재며, 후자가 없으면 Claim 2 는 존재할 수 없다.**
