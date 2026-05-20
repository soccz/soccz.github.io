# 07. Section 4.2 (VAE-based Distribution Mixture Inference) — VAE 가 어떻게 분포를 학습하나

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **VAE 가 분포를 학습** 하는 메커니즘 — encoder → latent z → decoder
- **Eq 8-15** 의 단계별 의미 — target mixture / priors / component weight / ELBO / VAE 출력
- **ELBO 유도 Step 1-6** (paper 미명시, 본 해체가 추가)
- Beta-Bernoulli + Gaussian prior 의 의미 — divergence 의 두 가지 봉우리 잡기

---

논문 3쪽 ~ 4쪽 (Section 4.2) 을 풀어본다. GMM components $D$ 를 받아 **global distribution** 의 mixture parameter 를 VAE 로 추론.

이 chapter 의 핵심 수식: **Eq 8 (target mixture) → Eq 9 (priors) → Eq 10~11 (component weight) → Eq 12~14 (ELBO) → Eq 15 (VAE 출력)**.

이 chapter 는 본 paper 의 가장 어려운 부분. **VAE / KL divergence / ELBO** 를 처음부터 풀이.

---

## 7.1 시작하기 전 — VAE 가 정확히 뭔지 (밑바닥부터)

### 일반 AutoEncoder

**일상 비유**: 사진 압축기.

```
원본 사진 (1000×1000 pixel)
       │
       ↓ Encoder (인공신경망)
   잠재 vector z (예: 100차원)  ← "압축된 표현"
       │
       ↓ Decoder (인공신경망)
   복원 사진 (1000×1000 pixel)
```

학습 목표: **복원 사진이 원본과 비슷하게**. Loss = $\|$원본 - 복원$\|^2$.

이게 표준 AutoEncoder.

### VAE 의 핵심 차이

VAE = Variational AutoEncoder. 표준 AE 와 한 가지가 다름:

**잠재 vector $z$ 가 단일 값이 아니라 확률 분포**.
- Encoder 출력: $z$ 의 평균 $\mu$ + 분산 $\sigma^2$.
- $z \sim \mathcal{N}(\mu, \sigma^2)$ 에서 **sample** 한 후 decoder 로 보냄.

**일상 비유**: 일반 AE 는 "고양이 사진 → 잠재값 [0.3, 0.7]" 처럼 한 점에 mapping. VAE 는 "고양이 사진 → 잠재값이 평균 [0.3, 0.7], 분산 [0.05, 0.05] 인 가우시안" 처럼 영역에 mapping.

### 왜 VAE 가 필요한가?

- 일반 AE: 잠재 공간이 "이산적" — sample 하면 의미 없는 결과 나옴.
- VAE: 잠재 공간이 "structured probability" — 부드러운 sampling 가능 → **새로운 데이터 생성**.

**비유**: 미술관에서 "이 그림과 저 그림의 중간" 그림을 만들어낼 수 있는 능력.

### Encoder $\phi$ 와 Decoder $\theta$

- **Encoder parameters** $\phi$: 입력 $x$ → 잠재 분포 $q_\phi(z|x)$ 의 parameters (예: $\mu, \sigma$).
- **Decoder parameters** $\theta$: 잠재값 $z$ → 출력 $p_\theta(x|z)$ 의 분포.

학습 = $\phi, \theta$ 를 동시에 조정해서:
1. **Reconstruction** 이 잘 됨.
2. **Latent 분포가 prior 와 가까워짐** (regularization).

→ 이 2가지를 결합한 loss 가 **ELBO** (다음 section).

---

## 7.2 본 paper 에서 VAE 가 필요한 이유

### 원문 (paper p.3)

> "Due to the intricate nature of data distribution, the local distributions do not linearly constitute the global distribution in a straightforward manner, thereby complicating the derivation of the target distribution."

### 한국어 풀이

**의역**: "데이터 분포가 복잡해서 local 분포들이 단순히 합쳐져서 global 분포가 되지 않기 때문에, target distribution 을 직접 유도하기 어렵다."

### 무슨 의미인가?

- ch06 (Eq 7) 의 `GauDe` 결과 $D = \{(\mu_k, \Sigma_k)\}_{k=1}^{K}$ = **각 시점의 local distribution** 정보.
- 우리가 원하는 것 = 전체 데이터의 **global distribution** $\hat{D}$.
- **단순 합/평균은 global 이 아님** — 각 component 의 가중치 $\pi_k$ 가 데이터 시점에 따라 다름.

**비유**: 한 학교의 학년별 성적 분포 (1학년 분포, 2학년 분포, 3학년 분포) 가 따로 있을 때, "전 학년 평균" 을 단순 평균으로 구하면 **각 학년 인원수** 가 무시됨. 정확한 가중평균이 필요.

**답**: variational inference (VAE) 로 component weight $\pi_k$, allocation $c_t$, contribution $b_t$ 를 추론 → 정확한 global distribution 형성.

---

## 7.3 Target Global Distribution — Eq 8

paper Eq 8:

$$
\hat{D} = \sum_{k=1}^{K} \pi_k D_k
$$

### 🔣 식이 말하는 것 한 줄

"global distribution $\hat D$ = K 개 Gaussian component $D_k$ 를 weight $\pi_k$ 로 가중합". **mixture weight $\pi$ 가 추정 대상**.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $D_k$ | k-th Gaussian component | "k 번째 봉우리" | $D_k = N(\mu_k, \Sigma_k)$ |
| $\pi_k$ | k-th component 의 weight | "k 번째 봉우리의 무게" | 합 = 1 (확률) |
| $K$ | total components | "봉우리 수" | k=4 가 paper default |
| $\hat{D}$ | global mixture distribution | "K 개 봉우리의 가중합" | divergence 의 전체 분포 |
| $\sum_k \pi_k = 1$ | 정규화 조건 | "비중 합 = 100%" | 확률 의미 |

### 🌱 일상 비유 — "학생 그룹 분포"

학교 학생들의 시험 점수 분포가 4 개 그룹 (예: 학년별):
- $D_1$ = "1학년 학생들 점수 분포" (평균 60, 표준편차 10)
- $D_2$ = "2학년 학생들 점수 분포" (평균 70, 표준편차 12)
- $D_3$ = "3학년 학생들 점수 분포" (평균 80, 표준편차 8)
- $D_4$ = "4학년 학생들 점수 분포" (평균 85, 표준편차 6)

전체 학교 점수 분포 $\hat D$ = $\pi_1 D_1 + \pi_2 D_2 + \pi_3 D_3 + \pi_4 D_4$.
- $\pi_k$ = "k 학년 학생 비율" (예: $\pi_1 = 0.25$).

본 논문은 시계열의 divergence 패턴이 이런 mixture 구조를 가진다고 가정 + VAE 로 $\pi_k$ 학습.

### 제약

$\pi_k \geq 0$ 이고 $\sum_k \pi_k = 1$ (확률이므로 합 = 1).

### 제약

$\pi_k \geq 0$ 이고 $\sum_k \pi_k = 1$ (확률이므로 합 = 1).

### 우리가 추정할 것

= **mixture weight $\{\pi_k\}_{k=1}^K$**.

이를 위해 VAE 를 사용 — 이게 Eq 9~15 의 본질.

---

## 7.4 VAE 모델의 변수들

### 시작하기 전 — 비유로 설명

학교 예시: 학생들이 어느 동아리에 속하는가?

- $c_t \in \{0, 1\}^K$: "학생 $t$ 가 어느 동아리들에 속하는가" 의 **이진 표시**. 예: $c_t = [0, 1, 1, 0]$ → "동아리 2와 3에 속함".
- $b_t \in [0, 1]^K$: "학생 $t$ 가 그 동아리에 얼마나 기여하는가" 의 **연속 값**. 예: $b_t = [0, 0.6, 0.4, 0]$ → "동아리 2 에 60% 기여, 동아리 3 에 40% 기여".

→ allocation = "**어디** 속하는가" (binary), contribution = "**얼마나** 기여하는가" (continuous).

### Allocation $c_t$ (paper p.4)

> paper text: "$c_t \in \{0, 1\}^K$ is a binary vector representing the distribution allocation, where $c_{tk} = 1$ represents the distribution of the $t$-th time step is allocated to the $k$-th Gaussian component."

**의역**: "$c_t$ 는 K 차원 이진 vector. $c_{tk} = 1$ 이면 시점 $t$ 의 데이터가 $k$ 번째 Gaussian 에 속한다는 의미."

### Contribution $b_t$ (paper p.4)

> paper text: "$b_t = \{b_{tk} \in [0, 1] | k = 1, \ldots, K\}$, subject to $\sum_{k=1}^{K} b_{tk} c_{tk} = 1$, represents the contribution of the $t$-th time step which are hyperparameters in the proposed distribution inference network. Noted that the contribution $b_{tk} \neq 0$ only when the corresponding allocation component $c_{tk} = 1$."

**의역**: "$b_{tk}$ 는 시점 $t$ 가 component $k$ 에 기여하는 정도 (0~1, 활성화된 component 의 기여 합 = 1). $c_{tk} = 0$ 이면 $b_{tk} = 0$."

→ $c$ 와 $b$ 가 **함께** 작동: $c$ 가 활성화 mask, $b$ 가 비중.

---

## 7.5 Variational Prior — Eq 9

### 시작하기 전 — Indian Buffet Process (IBP) 와 Stick-Breaking

**Indian Buffet Process (IBP)**: 무한 개의 latent feature 중 일부만 "선택" 되는 nonparametric Bayesian process.

**비유**: 인도식 뷔페에서 손님이 무한히 많은 음식 중 자기 좋아하는 일부만 선택해서 먹는 모습.
- 인기 음식 (앞쪽) = 많은 손님이 선택.
- 비인기 음식 (뒤쪽) = 적은 손님이 선택.

수학적으로 component 의 활성화 확률이 **점점 작아지는** 구조.

**Stick-breaking construction**: 막대를 부러뜨려가며 각 component 의 확률 결정.
- 처음 막대 = 길이 1.
- $\lambda_1$ 만큼 떼어내서 component 1 의 확률.
- 남은 막대에서 $\lambda_2$ 만큼 떼어내서 component 2 의 확률.
- ... 반복.

각 $\lambda_k \sim \text{Beta}(\varsigma_k, \kappa_k)$.

### paper Eq 9 — Prior 정의

$$
b_t \sim \mathcal{N}(\nu_k, \zeta_k), \quad \lambda_t \sim \text{Beta}(\varsigma_k, \kappa_k), \quad c_t \sim \text{Bernoulli}\!\left(\prod_{k=1}^{K} \lambda_{tk}\right)
$$

### Eq 9 의 3 변수

| 변수 | Prior 분포 | 의미 |
|------|----------|------|
| $b_t$ (contribution) | Gaussian $\mathcal{N}(\nu_k, \zeta_k)$ | "기여도는 평균 $\nu_k$ 주변 분포" |
| $\lambda_t$ (Bernoulli prob) | Beta $\text{Beta}(\varsigma_k, \kappa_k)$ | "활성화 확률의 prior" |
| $c_t$ (allocation) | Bernoulli($\prod \lambda$) | "활성화 여부 (1/0)" |

### "Bernoulli($\prod \lambda$)" 의 의미

$c_{tk} = 1$ 일 확률 = $\lambda_{t1} \cdot \lambda_{t2} \cdots \lambda_{tk}$ (누적 곱).

→ **stick-breaking 의 cumulative product** = 인기 component (앞쪽) 가 활성화될 확률이 더 큼.

**비유**: 막대를 부러뜨릴 때 처음 몇 번은 큰 조각 → 앞쪽 component (인기) 가 활성화될 확률 ↑.

### 본 paper 에서 IBP 를 사용하는 이유

- K 가 fix 인 GMM 도 가능하지만, IBP-style prior 가 "각 component 의 활성화 확률에 자연스러운 ordering" 을 부여.
- 결과적으로 모델이 "중요한 component 만 살아남게" 유도 — overfit 방지.

(단, 본 paper 는 K 를 hyperparameter 로 fix — 진정한 nonparametric IBP 의 일부만 활용. 자세한 비판은 ch17 의 통찰 #9.)

---

## 7.6 Component Weight $\pi_k$ — Eq 10~11

### paper Eq 10

$$
\pi_k = \frac{\exp(\frac{1}{K} S_k)}{Z}, \quad \text{where} \quad S_k = \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}
$$

### paper Eq 11 (정규화)

$$
Z = \sum_{k=1}^{K} \exp\!\left(\frac{1}{K} \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}\right)
$$

### 한 줄씩 풀이

#### $S_k$ — component $k$ 의 누적 기여도

$$S_k = \sum_{t=1}^{T} q_\phi(c_{tk}) \cdot b_{tk}$$

- $q_\phi(c_{tk})$: VAE encoder 가 출력한 "시점 $t$ 가 component $k$ 에 속할 확률" (soft).
- $b_{tk}$: 시점 $t$ 가 component $k$ 에 기여하는 정도.
- 곱 후 모든 시점 $t$ 에 대해 합산.

**의미**: "component $k$ 가 전체 데이터에서 얼마나 활성화 됐는가" 의 합산.

#### $\pi_k$ — softmax 정규화

$$\pi_k = \frac{\exp(\frac{1}{K} S_k)}{\sum_j \exp(\frac{1}{K} S_j)}$$

- $\exp$ 의 softmax 형태.
- $\frac{1}{K}$ 는 temperature scaling.
- 결과: $\sum_k \pi_k = 1$ (확률 정규화).

**비유**: 동아리들의 "인기 점수" 를 softmax 로 정규화 → 각 동아리의 "비중".

---

## 7.7 Variational Posterior — Eq 12~13

### 시작하기 전 — Posterior 가 뭔지

**Bayes' theorem**: $p(z|D) = \frac{p(D|z) p(z)}{p(D)}$.

- $p(z)$: prior — "데이터 보기 전 $z$ 의 분포".
- $p(D|z)$: likelihood — "$z$ 가 주어졌을 때 데이터를 볼 확률".
- $p(z|D)$: posterior — "데이터를 본 후 $z$ 의 분포". **이걸 알고 싶음**.

**문제**: $p(D) = \int p(D|z) p(z) dz$ 가 보통 **계산 불가능** (intractable). 적분 차원이 큼.

**해결**: $p(z|D)$ 를 **다른 분포 $q_\phi(z|D)$** 로 근사 — 이게 "variational" 의 의미.

### paper Eq 12

$$
\phi^*, \theta^* = \arg\min_{\theta, \phi} D_{KL}(q_\phi(z_t | D) || p_\theta(z_t | D))
$$

### Eq 12 풀이

- $\phi$ = VAE encoder parameters, $\theta$ = decoder parameters.
- $q_\phi$ = variational approximation.
- $p_\theta$ = true posterior (alg 1 불가).
- $D_{KL}$ = **KL divergence** (두 분포의 거리 측도).

**의미**: $q_\phi$ 가 true posterior $p_\theta$ 와 **가장 가깝게** 되도록 $\phi, \theta$ 학습.

### paper Eq 13 — KL divergence 정의

$$
D_{KL}(q_\phi(z_t | D) || p_\theta(z_t | D)) = \int q_\phi(z_t | D) \log \frac{q_\phi(z_t | D)}{p_\theta(z_t | D)} dz_t
$$

### KL divergence 의 일상 비유

**두 분포 사이의 "거리"** (정확히는 거리는 아니고 발산):
- $D_{KL}(q || p) = 0$ 이면 $q$ 와 $p$ 가 동일.
- 클수록 두 분포가 다름.
- $\geq 0$ (음수 안 됨).
- **비대칭**: $D_{KL}(q || p) \neq D_{KL}(p || q)$.

**비유**: "내가 추측한 다른 사람의 의견 분포 $q$" 와 "실제 그 사람의 의견 분포 $p$" 사이의 차이.

### 문제

True posterior $p_\theta(z_t | D)$ 자체가 계산 불가 → $D_{KL}$ 을 직접 계산 못함.

**답**: ELBO (다음).

---

## 7.7-bis ★ ELBO 가 어떻게 KL minimize 를 가능하게 하나 — Step 1·2·3 유도

이 section 은 paper 가 명시 안 한 ELBO 유도. 영어 / 수식 못 읽어도 단계별로 따라올 수 있도록.

### Step 1: 시작 — log p(D) 의 분해

조건부 확률의 정의로부터:
$$
p(z|D) = \frac{p(z, D)}{p(D)} \quad \Rightarrow \quad p(D) = \frac{p(z, D)}{p(z|D)}
$$

양변에 log 를 취함:
$$
\log p(D) = \log p(z, D) - \log p(z|D)
$$

### Step 2: variational 분포 $q_\phi$ 도입

위 식의 양변에 $q_\phi(z|D)$ 의 기댓값을 취함:
$$
\log p(D) = \mathbb{E}_{q_\phi}[\log p(z, D)] - \mathbb{E}_{q_\phi}[\log p(z|D)]
$$

(왼쪽 $\log p(D)$ 는 $z$ 에 의존 안 하므로 기댓값을 취해도 변화 없음.)

### Step 3: KL divergence 끄집어내기

오른쪽 두 번째 항을 다음과 같이 분해 (분자/분모에 $q_\phi$ 곱하기):
$$
-\mathbb{E}_{q_\phi}[\log p(z|D)] = -\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z|D) \cdot q_\phi(z|D)}{q_\phi(z|D)}\right]
$$
$$
= -\mathbb{E}_{q_\phi}[\log p(z|D)] + \mathbb{E}_{q_\phi}[\log q_\phi(z|D)] - \mathbb{E}_{q_\phi}[\log q_\phi(z|D)]
$$

재정리:
$$
\log p(D) = \underbrace{\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z, D)}{q_\phi(z|D)}\right]}_{= \text{ELBO}} + \underbrace{\mathbb{E}_{q_\phi}\!\left[\log \frac{q_\phi(z|D)}{p(z|D)}\right]}_{= D_{KL}(q_\phi || p(z|D))}
$$

### 결과 — 핵심 항등식

$$
\boxed{\log p(D) = \text{ELBO} + D_{KL}(q_\phi || p(z|D))}
$$

### Step 4: KL ≥ 0 → ELBO 가 lower bound

KL divergence 의 성질: $D_{KL} \geq 0$ (Jensen 부등식).

→ $\text{ELBO} \leq \log p(D)$.

→ **ELBO 가 log evidence 의 lower bound** (= "Evidence Lower BOund" 의 이름 유래).

### Step 5: ELBO maximize 가 KL minimize 와 동치

데이터 $D$ 가 주어진 후 $\log p(D)$ 는 fixed 상수.

위 등식 $\log p(D) = \text{ELBO} + D_{KL}$ 에서:
- $\log p(D)$ = fixed.
- ELBO 를 maximize.
- → $D_{KL}$ 가 자동으로 **minimize**.

→ **계산 불가능한 $D_{KL}$ 을 계산 가능한 ELBO 로 우회**. 이게 variational inference 의 핵심 trick.

### Step 6: ELBO 를 두 항으로 분해 (Eq 14)

ELBO 안의 $p(z, D) = p(D|z) p(z)$ 로 분해:

$$
\text{ELBO} = \mathbb{E}_{q_\phi}\!\left[\log \frac{p(z) p(D|z)}{q_\phi(z|D)}\right]
$$
$$
= \mathbb{E}_{q_\phi}\!\left[\log \frac{p(z)}{q_\phi(z|D)}\right] + \mathbb{E}_{q_\phi}[\log p(D|z)]
$$

→ **paper Eq 14 의 두 항**:
- 첫 항: $-D_{KL}(q_\phi || p(z))$ = **regularization** (variational 분포가 prior 와 너무 다르지 않게).
- 두 항: $\log p(D|z)$ 의 기댓값 = **reconstruction** ("$z$ 에서 $D$ 복원 잘 됨").

### ★ 한 줄 정리

> **ELBO = reconstruction - KL(q || prior). Maximize ELBO ⇔ reconstruction 잘 + q 가 prior 와 가까움 ⇔ KL(q || true posterior) 자동 minimize.**

---

## 7.8 ELBO — Eq 14

### 시작하기 전 — ELBO 가 뭔지

**ELBO** = Evidence Lower BOund = "evidence (= $\log p_\theta(D)$) 의 하한".

수학적 증명 (생략) 으로 다음이 성립:
$$
\log p_\theta(D) = \text{ELBO} + D_{KL}(q_\phi || p_\theta(z|D))
$$

→ $D_{KL} \geq 0$ 이므로 **ELBO ≤ $\log p_\theta(D)$**. 즉 ELBO 가 evidence 의 lower bound.

**ELBO 를 maximize 하면**:
- $\log p_\theta(D)$ 가 fix (데이터는 주어진 것) 이므로.
- $D_{KL}$ 이 **자동으로 minimize**.
- → 우리가 풀려던 문제 (Eq 12) 해결.

→ **계산 가능한 ELBO 를 maximize 함으로써 계산 불가능한 $D_{KL}$ 을 minimize**. 이게 variational inference 의 정수.

### paper Eq 14

$$
\mathbb{E}_{q_\phi(z_t | D)}\!\left[\log \frac{p_\theta(z_t, D)}{q_\phi(z_t | D)}\right] = \underbrace{\mathbb{E}_{q_\phi}\!\left[\log \frac{p(z_t)}{q_\phi(z_t | D)}\right]}_{\text{negative KL}} + \underbrace{\mathbb{E}_{q_\phi}[\log p_\theta(D | z_t)]}_{\text{reconstruction}}
$$

### ELBO 의 두 항

| 항 | 의미 | 역할 |
|----|------|------|
| $\mathbb{E}_{q_\phi}[\log \frac{p(z_t)}{q_\phi(z_t|D)}]$ | -$D_{KL}(q_\phi || p(z_t))$ | **Regularization** — $q_\phi$ 가 prior 와 너무 다르지 않도록 |
| $\mathbb{E}_{q_\phi}[\log p_\theta(D | z_t)]$ | **Reconstruction likelihood** | "$z$ 에서 $D$ 를 잘 복원하는가" |

### ELBO 의 일상 비유

**그림 그리기 학습**:
- Reconstruction: "내가 그린 그림이 원본과 얼마나 비슷한가" (잘 그렸나).
- KL regularization: "내 그림 스타일이 평균적인 스타일과 너무 다르지 않은가" (정상 범주 안인가).
- 둘 다 좋아야 좋은 학생 — 잘 그렸으면서 스타일이 자연스러워야.

### SGD 학습 (Kingma 2013)

> paper text: "According to the theory of variational inference, the above problem can be solved with the SGD method using a nonlinear deep neural network to optimize the mean squared error loss function."

**한 줄 요약**: ELBO 를 maximize 하기 위해 일반 신경망처럼 SGD (Stochastic Gradient Descent) 사용. PyTorch 표준.

---

## 7.9 Variational Decoder Output — Eq 15

### paper Eq 15

paper text:
> "We summarize the above operation as $\text{VAE}(\cdot, \cdot)$. Thus, we can obtain indications of the global distribution by"

$$
\chi^d_{out} = \text{VAE}(\chi^d, D)
$$

### Eq 15 의 의미

| 입력 / 출력 | 의미 |
|-----------|------|
| 입력 1: $\chi^d$ | divergence pattern (median 기준 잔차) |
| 입력 2: $D$ | GMM components ($K$개 Gaussian 의 $\mu, \Sigma$) |
| 출력: $\chi^d_{out}$ | "distribution-enriched divergence" — 분포 정보가 들어간 divergence 표현 |

### "$\chi^d_{out}$ 가 무엇을 담고 있나"

paper text:
> "The output $\chi^d_{out}$ contains rich global distribution information providing insights into the shape, spread, and central tendency of the time series."

**의역**: "$\chi^d_{out}$ 은 시계열의 shape, spread, central tendency 에 대한 풍부한 global distribution 정보를 담는다."

3가지 정보:
- **Shape** (모양): skewness, kurtosis 등.
- **Spread** (퍼짐): 분산, IQR 등.
- **Central tendency** (중심 경향): 평균, median, mode.

→ 단순 divergence 가 아니라 **각 시점이 어떤 분포에서 sample 됐는지** 정보를 가진 vector.

---

## 7.10 VAE 변수 그래프 — 인터랙티브 시각화

```viz:qf-vae-graph:title=VAE Variable Dependency Graph (Eq 9-15),caption=K slider 로 component 수 조작. Beta-Bernoulli stick-breaking prior 의 λ → c 와 Gaussian prior 의 b → z. ϕ (encoder) 와 θ (decoder) 의 데이터 flow. paper Fig 2 의 우중간 VAE 블록의 수학적 해체.
```

---

## 7.11 통합 — VAE 의 역할

```
D = {(μ_k, Σ_k)}_{k=1}^K       ← GMM 결과 (각 시점의 local distribution)
        │
        ↓ ϕ (variational encoder)
{ν_k, ζ_k, ν'_k, ζ'_k, ς_k, κ_k}    ← prior parameters
        │
        ↓ sample (Eq 9): b_t ~ N, λ_t ~ Beta, c_t ~ Bernoulli
        │
z_t = Σ_k b_tk · ż_t            ← latent variable
        │
        ↓ θ (decoder)
χ^d_out                         ← divergence with distribution info
        │
        ↓
π_k from Eq 10 (component weights)
        │
        ↓
D̂ = Σ π_k D_k (Eq 8) — target global distribution
```

### 한 줄 요약

→ **VAE 가 GMM 의 local components 를 결합해 global distribution 을 추정**. 결과 $\chi^d_{out}$ 이 fusion Transformer (ch09) 의 입력 중 하나.

---

## 7.12 본 chapter 의 정신적 모델

복잡한 수식들을 한 그림으로:

```
[복잡한 시계열의 분포 이해]
           ↓
1. GMM 으로 각 시점의 local 분포 추출 (ch06, Eq 7)
           ↓
2. VAE 로 local 분포들을 global mixture 로 결합 (ch07, Eq 8-15)
           ↓
3. global mixture 정보가 들어간 divergence (= χ^d_out) 생성
           ↓
4. fusion Transformer 가 이걸 cross-attention 으로 결합 (ch09)
           ↓
5. quantile 예측 출력 (ch10)
```

→ VAE 는 **이 흐름의 핵심 중간 처리**.

---

## 7.13 Section 4.2 핵심 정리

| 항목 | 내용 |
|------|------|
| 입력 | $\chi^d$ (divergence) + $D$ (GMM components) |
| 출력 | $\chi^d_{out}$ (distribution-enriched divergence) |
| 새 변수 | $c_t$ (allocation), $b_t$ (contribution), $\lambda_t$ (Bernoulli prob), $z_t$ (latent), $\pi_k$ (mixture weight) |
| Prior (Eq 9) | $c \sim $ Bernoulli, $b \sim$ Gaussian, $\lambda \sim$ Beta |
| 추정 방법 | Variational inference (ELBO maximization) |
| Loss 항 | Reconstruction + KL divergence (Eq 14) |
| 학습 알고리즘 | SGD with reparameterization trick |
| 핵심 사상 | Local GMM → global mixture (via VAE) |

**한 줄 핵심**:
> **"GMM 으로 추출한 각 시점의 local 분포들을 VAE 의 variational inference 로 global mixture 로 결합. ELBO maximization 으로 학습. 결과가 fusion Transformer 의 한쪽 입력."**

다음 [08_quantile_drift_extraction.md](08_quantile_drift_extraction.md) 에서 다른 한쪽 입력 — quantile drift $\chi^Q$ 의 Transformer encoder 처리 (Section 4.3).

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **VAE 가 일반 AutoEncoder 와 다른 핵심 차이는?**
2. **ELBO 를 maximize 하면 왜 KL divergence 가 minimize 되는가?**
3. **본 paper 에서 VAE 의 입력·출력은 각각 무엇인가?**

### 답변

1. **VAE 와 일반 Autoencoder (AE) 의 차이**:
   - **일반 AE**: encoder → 단일 잠재 vector $z$ (deterministic) → decoder. $z$ 가 고정된 값.
   - **VAE**: encoder → 잠재 **분포** $q(z|x) = N(\mu, \sigma)$. $z$ 가 분포 (확률적).
   - **Reparameterization trick**: $z = \mu + \sigma \cdot \epsilon$ (where $\epsilon \sim N(0, 1)$) — 미분 가능한 형태로 sampling.
   - **Loss 차이**: AE = reconstruction loss 만. VAE = reconstruction + **KL regularization** ($D_{KL}(q || p(z))$).
   - **본 논문 사용 이유**: divergence pattern 의 분포 (multi-modal Gaussian mixture) 를 학습해야 → 잠재 공간이 **structured probability** 여야 → VAE 가 적합.
   - **부가 효과**: 잠재 공간에서 smooth sampling 가능 → 같은 input 에 대해 여러 다른 미래 시나리오 생성 가능.

2. **ELBO 가 lower bound 인 이유 — 수학적 핵심**:
   - **핵심 항등식**: $\log p(D) = \text{ELBO}(q) + D_{KL}(q(z) \| p(z|D))$
   - **$\log p(D)$**: 데이터 marginal log-likelihood, **데이터 주어지면 상수** (모델 학습 대상 아님).
   - **$D_{KL} \geq 0$**: KL divergence 의 정의상 음수 안 됨.
   - **결론**: $\log p(D) \geq \text{ELBO}(q)$. 즉 ELBO 가 $\log p(D)$ 의 **lower bound** (Evidence Lower BOund 의 이름 유래).
   - **왜 lower bound 최대화?**: $\log p(D) = \text{ELBO} + D_{KL}$, 양변 = 상수, $D_{KL} \geq 0$ 이므로:
     - ELBO ↑ → $D_{KL}$ ↓ (자동).
     - $D_{KL} = 0$ 이 되는 게 이상 → $q = p(z|D)$ (true posterior).
   - **계산 가능성**: $p(z|D)$ 는 직접 계산 불가능 (posterior, intractable). 그러나 ELBO 는 계산 가능 (Monte Carlo).
   - **함의**: **계산 불가능한 KL 을 계산 가능한 ELBO 로 우회** — variational inference 의 핵심 패러다임.

3. **VAE Inference module 의 입력·출력**:
   - **입력**:
     - $\chi^d$ — divergence pattern (Eq 4 결과, ch06)
     - $D = \{(\mu_k, \Sigma_k)\}_{k=1}^K$ — GMM components (Eq 7 결과, ch06)
   - **VAE 내부 처리**:
     - Encoder: $\chi^d$ + $D$ → $q(z|\chi^d, D) = N(\mu_z, \sigma_z)$
     - Sampling: $z \sim q$ (reparameterization)
     - Decoder: $z$ → mixture weights $\{\pi_k\}_{k=1}^K$ (Eq 8 의 $\pi$)
   - **출력**: **$\chi^d_{out}$** — divergence pattern + global distribution 정보 결합 vector.
     - 정보 내용: shape (mixture 의 모양), spread (variance), central tendency, mode 위치 등.
   - **다음 단계**: $\chi^d_{out}$ 가 fusion Transformer (ch09) 의 **query** 로 사용됨. drift 의 K, V 와 cross-attention.
   - **핵심 통찰**: VAE 가 단순히 분포만 학습하는 게 아니라 **분해된 input 두 가지를 결합한 enriched representation** 을 생성.
