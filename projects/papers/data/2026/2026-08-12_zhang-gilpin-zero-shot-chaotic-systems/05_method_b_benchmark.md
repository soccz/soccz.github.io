# 4-B. dysts 벤치마크와 Lyapunov 시간이라는 자

> **배경 사다리**: ① **상미분방정식(ODE)** 은 "지금 상태가 주어지면 다음 순간 어디로 움직일지"를 알려주는 규칙이다. ② 그 규칙이 정해져 있어도 초기값이 아주 조금 다르면 시간이 지날수록 궤적이 지수적으로 벌어질 수 있는데, 그 벌어지는 속도가 **최대 Lyapunov 지수 $\lambda$** 다. ③ 서로 다른 계는 "빠르기"가 다르므로, 초 단위로 비교하면 안 되고 각 계 고유의 시계로 환산해야 한다.

---

## 왜 이 부분이 필요한가

135개의 서로 다른 카오스계를 한 표에서 비교하려면 두 가지를 맞춰야 한다. **시간 단위**(어떤 계는 1초 만에 예측이 무너지고 어떤 계는 100초를 버틴다)와 **샘플링 밀도**(같은 계라도 촘촘히 뽑으면 다음 값 맞히기가 쉬워진다). 이 정규화를 하지 않으면 "제로샷이 잘한다"는 결론이 단순히 "쉬운 계가 많이 섞였다"로 붕괴한다.

---

## 벤치마크 정의 (§4, "A chaotic systems forecasting benchmark.")

원문 verbatim: "The dysts dataset represents a standardized benchmark of 135 low-dimensional chaotic systems, described by ordinary differential equations that have been aligned with respect to their dominant timescales and integration steps (Gilpin, 2021; 2023). Each system is annotated with its largest Lyapunov exponent $\lambda$, an invariant property associated with every set of differential equations that quantifies the rate at which small errors accumulate."

### 핵심 수식 — Lyapunov 시간

$$\tau \equiv \lambda^{-1}$$

원문 verbatim: "a small error will compound over a characteristic timescale, the Lyapunov time, $\tau \equiv \lambda^{-1}$, making highly-chaotic systems (those with small $\tau$) difficult to forecast."

**① 기호 뜻.** $\lambda$ 는 최대 Lyapunov 지수 [단위: 1/시간]. 두 이웃 궤적의 초기 간격 $\delta_0$ 가 시간 $t$ 후 대략 $\delta_0 e^{\lambda t}$ 로 벌어진다는 뜻이다. $\tau$ 는 그 역수 [단위: 시간] — 오차가 $e$ 배(약 2.718배)로 불어나는 데 걸리는 시간.

**② 일상 비유.** 복사기로 원본을 복사하고, 그 복사본을 다시 복사하는 일을 반복한다고 하자. 한 번 복사할 때마다 흐릿함이 일정 비율로 커진다. $\tau$ 는 "흐릿함이 눈에 띄게 커지는 데 필요한 복사 횟수"다. 흐릿함이 빨리 커지는 복사기($\tau$ 작음)일수록 원본을 오래 유지할 수 없다.

**③ 왜 이 형태인가.** 오차 증폭이 **곱셈적**(매 시간 일정 배율)이기 때문에 지수함수가 자연스럽고, 그 지수의 역수가 곧 시간 단위가 된다. 만약 오차가 덧셈적으로 늘어난다면(예: 매초 +0.01) 특성 시간은 초기 오차 크기에 의존하게 되어 계 고유의 상수가 되지 못한다. $\lambda$ 는 초기 오차 크기와 무관한 **불변량**이라 자로 쓸 수 있다.

**④ 조심할 점.** (i) $\lambda$ 는 어트랙터 **전체 평균**이다. 어트랙터의 어떤 영역은 국소적으로 훨씬 잘 예측되고 어떤 영역은 훨씬 빨리 발산한다 — 이 논문의 Appendix C(Figure 8·9)가 초기조건에 따라 성능이 크게 달라진다고 보고하는 이유가 바로 이것이다. (ii) $\tau$ 는 **예측 가능성의 상한을 주는 눈금**이지 "이 시간까지 반드시 맞힌다"는 보장이 아니다. (iii) 이산 시계열로 관측하는 순간 샘플링 간격이 유효 예측 가능성에 개입한다 — 그래서 다음 단계가 필요하다.

### 시간 granularity 정규화

원문 verbatim: "in order to match the typical granularity of the real-world time series used to train Chronos, we re-integrate all systems using an implicit Runge-Kutta integration scheme. We downsample the resulting time series to a uniform coarse granularity of **30 timepoints per Lyapunov time** $\tau$. We find that our forecast results depend only weakly on the data granularity (Appendix)."

이 "$\tau$당 30점"이 이 논문 전체의 숨은 상수다. 이 값 하나로 세 가지가 동시에 정해진다: (i) 문맥 512점 $\approx$ **17 Lyapunov 시간** (§5.5 의 "over 17 Lyapunov times"가 여기서 나온다), (ii) 테스트 300점 $\approx$ **10 Lyapunov 시간** (§4 verbatim "the next 300 timepoints (around 10 Lyapunov times)"), (iii) §5.3 문맥 중복도 정의의 최소 길이 "30 timepoints (1 Lyapunov time in our units)".

**조심할 점**: granularity 를 바꾸면 "제로샷이 1 Lyapunov 시간을 버틴다"는 헤드라인 수치의 의미도 바뀐다. 저자들은 결과가 granularity 에 약하게만 의존한다고 부록에서 밝히지만, 그 민감도 곡선의 구체적 수치는 그림에만 있으므로 **원문에 수치 미보고**로 둔다.

---

## 실험 데이터 생성 프로토콜 (§4, "Baseline experiments.")

verbatim: "For each of the 135 chaotic dynamical systems, 20 trajectories of length 812 are generated, each originating from a random initial condition on the attractor. This produces a set of 2700 ($135 \times 20$) multivariate time series, which have dimensionalities between 3 and 6 depending on the particular dynamical system. All time series are then split into training sets consisting of the first 512 points of each time series, with the last 300 timepoints set aside to determine final test scores. For experiments with varying context lengths, trajectories are extended backwards in time, so that the 300 test points remain the same."

세 가지를 눈여겨볼 만하다.

1. **"extended backwards in time"** — 문맥 길이를 늘릴 때 미래를 당겨오는 게 아니라 과거로 늘린다. 테스트 300점을 고정해 문맥 길이 실험(§5.5)의 비교 가능성을 지킨 설계다. 사소해 보이지만, 이걸 안 하면 "문맥이 길수록 좋다"가 "테스트 구간이 달라졌다"와 뒤섞인다.
2. **하이퍼파라미터 튜닝의 내부 분할** verbatim: "each of the 20 training trajectories is divided into a true training set comprising the first 435 timepoints, and a validation set of the last 77 timepoints. ... The validation scores are averaged over the 20 trajectories, and the hyperparameters from the best-performing model are selected. A model is then initialized with those hyperparameters, and it is trained on the full 512 timepoints."
3. **인과적 분리 선언** verbatim: "The testing dataset is therefore causally disconnected from the training data at all times." — 시계열 실험에서 가장 흔한 누수(leakage)를 명시적으로 차단했다는 진술이다.

**규모** verbatim: "Our large-scale experiments thus span $5.5 \times 10^7$ training points, $3.2 \times 10^7$ test points, and $3.2 \times 10^8$ generated forecasts across all models. The experiments require $10^4$ walltime compute hours on an Nvidia A100 GPU."

---

## 다른 접근으로 했다면

- **실세계 벤치마크(ETT·Traffic·Weather)만 썼다면**: 오염 배제 불가 + Lyapunov 시간 같은 이론적 눈금 부재 → "왜 여기까지만 맞는가"를 물을 수 없다.
- **단일 계(로렌츠)만 깊게 팠다면**: §3 의 동기 예시가 딱 그 형태다. 그런데 §3 말미에서 저자 스스로 "초기조건만 바꿔도 성능이 크게 나빠진다"고 밝힌다 — verbatim: "simply starting the context trajectory from a different initial condition on the attractor can significantly degrade the accuracy of Chronos's prediction". **단일 계·단일 궤적 결과는 신뢰할 수 없다는 것을 저자가 먼저 증명하고 들어가는 구조**이며, 이것이 135×20 규모를 정당화한다.
- **확률적 동역학계(마르코프 연쇄 등)를 썼다면**: §2 가 인용하는 Liu et al. (2024a) 가 그 방향인데, 결정론적 카오스가 주는 "불변량으로 채점 가능" 성질을 잃는다.

---

## 이 절의 핵심 한 문장

**$\tau$ 로 시간을 정규화하고 $\tau$당 30점으로 밀도를 고정한 순간, 135개의 서로 다른 물리계가 하나의 통계 검정 안으로 들어온다 — 이 정규화가 이 논문의 모든 수치를 비교 가능하게 만드는 숨은 축이다.**
