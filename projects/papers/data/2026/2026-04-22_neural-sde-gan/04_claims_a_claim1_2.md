# 04a · 핵심 Claim 해체 (Claim 1–2)

> **배경 사다리**: Claim 1–2를 이해하려면 ① Wasserstein 거리가 "두 확률 분포 사이의 이동 비용"이라는 것, ② GAN의 판별자가 분포 간 거리를 측정하는 함수라는 것, ③ 보편 근사 정리(Universal Approximation Theorem, UAT)가 신경망이 임의의 연속 함수를 근사할 수 있다는 주장임을 알면 된다.

---

## Claim 1 — 경로 공간에서의 Wasserstein GAN 최적 판별자는 Neural CDE이다

### 주장

$$\max_{D \in \text{Lip}_1} \mathbb{E}_{X \sim \mathbb{P}}[D(X)] - \mathbb{E}_{Y \sim \mathbb{Q}}[D(Y)]$$

에서 Lip-1 함수 클래스를 Neural CDE로 근사하는 것이 원리적으로 정당하다.

더 구체적으로: 연속 시간 경로 $X \in C([0,T]; \mathbb{R}^d)$에 대해, 충분한 크기의 Neural CDE가 임의의 연속 경로 범함수(path functional)를 임의의 정밀도로 근사할 수 있다.

### 증거

- Theorem (Kidger et al. 2020, arXiv:2005.08926): Neural CDE는 $C([0,T]; \mathbb{R}^d) \to \mathbb{R}^e$의 연속 함수를 균등 근사한다.
- 이 정리를 판별자 클래스에 적용: $D: C([0,T]; \mathbb{R}^d) \to \mathbb{R}$ 형태의 임의 Lip-1 함수를 Neural CDE로 충분히 근사 가능.
- 논문의 Section 3에서 이 논증이 전개된다.

### 숨은 전제

1. **입력 경로가 충분히 매끄럽다**: Neural CDE 이론은 bounded variation(유한 변동) 경로를 요구한다. 거친 경로(예: 브라운 운동 자체)에는 추가 이론(rough path theory)이 필요하지만, 실용 상 자연 스플라인 보간이 이를 해결한다.
2. **망 크기가 충분히 크다**: 보편 근사 정리는 "충분히 큰 망"이라는 조건 하에서만 성립. 유한 크기에서는 근사 오차가 있다.
3. **Lip-1 제약의 실용적 강제**: WGAN-GP gradient penalty가 진짜 Lipschitz-1 제약이 아닌 "부드러운 정규화"임을 저자들이 인정한다.

### 쉬운 말 풀이

"두 집단의 경로 분포 차이를 측정하는 가장 좋은 도구는 무엇인가?" 를 수학적으로 묻는 것이다. 그 답이 바로 "경로 전체를 처음부터 끝까지 읽으면서 적분하는 CDE 형태"라는 것. 마치 영화 전체를 처음부터 끝까지 보고 나서 "이게 진짜 같은가 가짜 같은가"를 판단하는 것이 가장 정확한 것처럼.

---

## Claim 2 — Neural SDE가 경로 분포의 보편 생성자이다

### 주장

어떤 $\mathbb{R}^d$-값 확률과정의 분포도 적절한 Neural SDE

$$dY_t = \mu_\theta(t, Y_t)\,dt + \sigma_\theta(t, Y_t)\,dW_t, \quad Y_0 \sim p_0$$

로 표현할 수 있다.

더 강하게: 이토 공식(Itô's formula)에 의해, 확산 계수 $\sigma_\theta$가 완전 랭크(full rank)인 경우 Neural SDE는 $C([0,T]; \mathbb{R}^d)$ 위의 임의의 분포를 임의의 정밀도로 생성할 수 있다.

### 증거

- 확산 과정의 지지(support)에 관한 고전 결과 (Stroock & Varadhan, 1972): 드리프트와 확산이 충분히 비퇴화적(non-degenerate)이면 SDE의 경로 측도가 경로 공간 전체를 지지한다.
- 이 결과와 Neural ODE의 보편 근사성(다수의 선행 연구)을 결합: $\mu_\theta, \sigma_\theta$를 신경망으로 파라미터화하면 원하는 분포로 수렴 가능.

### 숨은 전제

1. **비퇴화 확산**: $\sigma_\theta(t, y) \sigma_\theta(t, y)^\top$가 양정치(positive definite)여야 한다. 실용에서 이를 강제하는 아키텍처적 보장이 없어서, 학습 중 확산이 퇴화할 수 있다.
2. **초기 분포 $p_0$ 고정**: 생성자의 표현력은 초기 분포 선택에 의존한다. $p_0 = \mathcal{N}(0, I)$로 고정하면 이것이 충분한지 논문에서 완전히 검증되지 않는다.
3. **연속 시간 경로의 이산화 오차**: 실용에서는 Euler-Maruyama 이산화를 쓰므로, 진짜 SDE 경로와 이산 근사 경로 사이에 차이가 있다. 이 오차가 생성 품질에 미치는 영향이 정량화되지 않는다.

### 쉬운 말 풀이

주식 가격 경로를 비유로 들면: "드리프트(평균적 방향)와 확산(랜덤 진동의 세기)만 잘 설계하면 어떤 경로 패턴도 만들 수 있다."는 주장. 신경망으로 이 두 함수를 유연하게 학습하니, 이론적으로 모든 현실 경로 분포를 흉내낼 수 있다. 단, 이 "이론적으로"가 "유한 망 크기·이산화·학습 수렴"의 세 가지 현실적 장벽에 막힌다는 점이 Claim 2의 약점이다.

> **[04b 파일로 계속]** → [04_claims_b_claim3_4.md](04_claims_b_claim3_4.md)
