# 02 · 3층 TL;DR

---

## 🧒 초등학생 수준

주식 가격처럼 매일 오르내리는 숫자들의 흐름을 상상해 보자. 이 흐름을 "경로(path)"라고 부른다. 이 논문이 푸는 문제는 딱 하나다: **"진짜처럼 보이는 가짜 경로를 어떻게 만들까?"**

진짜 경로와 가짜 경로를 구분하는 방법은, 두 사람을 시켜서 하는 게임이다. 한 사람(위조꾼)은 최대한 그럴싸한 가짜 경로를 만들고, 다른 사람(감별사)은 진짜와 가짜를 맞춘다. 둘이 서로 경쟁하면서 위조꾼은 점점 더 진짜 같아지고, 감별사는 점점 더 눈이 밝아진다. 이 게임을 GAN(적대적 신경망)이라고 한다.

이 논문의 발견은 이렇다: **시간이 연속으로 흐르는 상황에서, 위조꾼에 가장 적합한 수학 도구는 '확률미분방정식(SDE)', 감별사에 가장 적합한 수학 도구는 '제어미분방정식(CDE)'이다.** 그리고 이 둘을 함께 학습시키면 실제 주식 가격과 구분하기 어려운 가짜 경로를 만들 수 있다.

---

## 🎓 학부생 수준

GAN(Generative Adversarial Network, 생성적 적대 신경망)은 생성자(Generator)와 판별자(Discriminator)가 서로 경쟁하면서 진짜 같은 데이터를 만드는 프레임워크다. 이미지 분야에서는 엄청난 성공을 거뒀지만, **시간이 연속으로 흐르는 경로(time series path)** 로 옮겨오면 무엇이 적절한 생성자인지, 무엇이 이론적으로 최적의 판별자인지 불명확했다.

이 논문의 핵심 아이디어는 두 연속-시간 미분방정식 클래스를 짝짓는 것이다:

- **생성자**: Neural SDE (신경 확률미분방정식)
  $$dY_t = \mu_\theta(t, Y_t)\,dt + \sigma_\theta(t, Y_t)\,dW_t$$
  — 여기서 $\mu_\theta$는 "평균적 방향(드리프트)", $\sigma_\theta$는 "무작위 흔들림의 세기(확산)", $W_t$는 브라운 운동(시간에 따라 무작위로 흔들리는 경로의 수학 모델)이다.

- **판별자**: Neural CDE (신경 제어미분방정식)
  $$dZ_t = f_\phi(Z_t)\,dX_t, \quad D(X) = \ell(Z_T)$$
  — 여기서 $X$는 판별할 경로 전체이고, $Z_T$는 그 경로를 처음부터 끝까지 다 읽은 후의 판별자 상태다.

**핵심 이론적 결과**: 경로 공간(무한 차원)에서의 WGAN(Wasserstein GAN) 최적 판별자가 Neural CDE 형태임을 증명한다. 즉, Neural SDE를 가르치는 가장 좋은 선생님은 Neural CDE다.

**실험 결과**: 주식 종가, Ornstein-Uhlenbeck 과정(금융에서 평균 회귀를 모델링하는 SDE) 등에서 기존의 TimeGAN(순환신경망 기반)을 통계적 유사도 지표에서 능가하거나 동등하다.

---

## 🔬 전문가 수준

**Contribution 1 — 이론적 동치**: 경로 공간 $\mathcal{X} = C([0,T]; \mathbb{R}^d)$에서의 WGAN 문제

$$\min_\theta \max_{D \in \text{Lip}_1} \mathbb{E}_{X \sim \mathbb{P}_\text{real}}[D(X)] - \mathbb{E}_{Y \sim \mathbb{P}_\theta}[D(Y)]$$

에서 판별자 $D: C([0,T]; \mathbb{R}^d) \to \mathbb{R}$의 최적 형태가 Neural CDE

$$Z_t = Z_0 + \int_0^t f_\phi(Z_s)\,dX_s$$

의 출력 $D(X) = \ell(Z_T)$로 표현됨을 제안한다 (Universal approximation of path functionals via CDEs, Kidger et al. 2020에 의존). Neural CDE 판별자 클래스가 Lip-1 함수의 합리적 근사 클래스임을 논증.

**Contribution 2 — 실용적 훈련 알고리즘**: Euler-Maruyama 이산화 + WGAN-GP(Gradient Penalty) 조합으로 안정적 학습 프레임워크 제공. 생성자에 Stratonovich SDE를 쓰고 Log-ODE 방법으로 판별자 CDE를 효율적으로 적분.

**Contribution 3 — 잠재 SDE vs. 관찰 조건 SDE 구분**: 불규칙 관측(irregular observations)을 처리하기 위해 자연 3차 스플라인으로 경로를 보간한 후 판별자에 입력하는 방식을 채택. 이 디자인 선택이 이후 모든 연속-시간 생성 모델 논문의 표준이 됨.

**Contribution 4 — 금융 시계열 생성 최초 연속-시간 GAN**: 기존의 TimeGAN, RCGAN는 이산 RNN 기반. 이 논문은 최초로 SDE를 경로 생성자로 사용해 시간 해상도 독립적(temporal resolution invariant) 생성을 가능하게 함.

**핵심 한계**: (1) SDE 수치 적분의 계산 비용이 단계수에 비례해 증가하므로 장기 경로에서 느림. (2) WGAN-GP의 gradient penalty가 경로 공간의 Lipschitz 제약을 완전히 보장하지 않음. (3) 모드 붕괴(mode collapse) 문제는 GAN 패밀리의 공통 약점으로 이 논문도 예외 없음. (4) 본문에서 다룬 실험 규모가 상대적으로 소규모(일변량~저차원 다변량).
