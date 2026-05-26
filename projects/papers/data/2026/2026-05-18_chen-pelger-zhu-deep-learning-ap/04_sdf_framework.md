# 04. SDF Framework — Section I (Model)

> **🧒 한 줄 요약**: SDF framework. Stochastic discount factor 의 *neural network parameterization*.


> Section I (paper p.6–12) — No-arbitrage, SDF, adversarial GMM.

## 4.1 Section I.A — No-Arbitrage Asset Pricing

### 4.1.1 Fundamental no-arbitrage equation

paper p.7 본문:

$$
\mathbb{E}_t [M_{t+1} R^e_{t+1,i}] = 0
$$

⇔ (equivalently)

$$
\mathbb{E}_t [R^e_{t+1,i}] = \underbrace{\frac{\mathrm{Cov}_t(R^e_{t+1,i}, M_{t+1})}{-\mathrm{Var}_t(M_{t+1})}}_{\beta_{t,i}} \cdot \underbrace{\frac{\mathrm{Var}_t(M_{t+1})}{\mathbb{E}_t[M_{t+1}]}}_{\lambda_t}
$$

**기호 뜻**:
- $R^e_{t+1,i} = R_{t+1,i} - R^f_{t+1}$ — 자산 $i$ 의 excess return.
- $M_{t+1}$ — Stochastic Discount Factor (SDF).
- $\mathbb{E}_t[\cdot]$ — 시점 $t$ 정보 조건부 기댓값.
- $\beta_{t,i}$ — systematic risk exposure.
- $\lambda_t$ — price of risk.

### 4.1.2 SDF 의 affine 정규화

paper p.7 본문 (footnote 6 참조):
> "Without loss of generality we consider the SDF formulation"

$$
M_{t+1} = 1 - \sum_{i=1}^{N} \omega_{t,i} R^e_{t+1,i} = 1 - \omega_t^\top R^e_{t+1}
$$

→ SDF 는 자산 수익률의 **선형결합** + 상수 1.
- $\omega_t = (\omega_{t,1}, \ldots, \omega_{t,N})^\top$ — SDF portfolio weights.

### 4.1.3 Mean-variance efficient portfolio 와의 동등성

paper Eq (1):
$$
\omega_t = \mathbb{E}_t[R^e_{t+1} R^{e\top}_{t+1}]^{-1} \mathbb{E}_t[R^e_{t+1}] \tag{1}
$$

**의미**: $\omega_t$ = **conditional mean-variance efficient portfolio** 의 가중치. (Cochrane 2003)

→ SDF 추정 = **tangency portfolio 추정**. 두 문제가 동일.

### 4.1.4 Tangency Factor 와 One-Factor 표현

paper p.8:
$$
F_{t+1} = \omega_t^\top R^e_{t+1} \quad \text{(traded factor = tangency portfolio)}
$$

이로부터:
$$
R^e_{t+1,i} = \beta_{t,i} F_{t+1} + \epsilon_{t+1,i}
$$

with $\mathbb{E}_t[\epsilon_{t+1,i}] = 0$ 과 $\mathrm{Cov}_t(F_{t+1}, \epsilon_{t+1,i}) = 0$.

→ **No-arbitrage ⇔ one-factor model** (with traded factor $F$).

paper 인용:
> "Hence, no-arbitrage implies a one-factor model. ... Conversely, the factor model formulation implies the stochastic discount factor formulation above."

### 4.1.5 핵심 통찰 — β recovery

paper p.8:
$$
(\beta_t^\top \beta_t)^{-1} \beta_t^\top R^e_{t+1} = F_{t+1} + (\beta_t^\top \beta_t)^{-1} \beta_t^\top \epsilon_{t+1} = F_{t+1} + o_p(1)
$$

→ **β 만 알면 SDF factor $F$ 를 ($\epsilon$ 가 diversifiable 한 한) 재구성 가능**.

---

## 4.2 Section I.B — Adversarial GMM

### 4.2.1 Conditional moments 의 무한 family

paper Eq (2):
$$
\mathbb{E}[M_{t+1} R^e_{t+1,i} g(I_t, I_{t,i})] = 0 \tag{2}
$$

for **any** function $g : \mathbb{R}^p \times \mathbb{R}^q \to \mathbb{R}^D$.

**기호 뜻**:
- $I_t \in \mathbb{R}^p$ — macroeconomic conditioning variables (예: inflation, market return).
- $I_{t,i} \in \mathbb{R}^q$ — firm-specific characteristics (예: size, book-to-market).
- $g$ — conditioning function. $D$ = moment 개수.

### 4.2.2 특수 케이스들

paper p.8–9 본문:

**(a) 25 Fama-French portfolios**: $g$ = size × book-to-market 의 quantile indicator.

**(b) Unconditional moments**: $g = $ 상수. 개별 stock unconditional pricing error 최소화.

**(c) Fama-French 3 factor**: $\omega, \beta$ 가 size 와 book-to-market 의 2차원 kernel function.

### 4.2.3 Adversarial Selection (Eq 3)

paper Eq (3):
$$
\min_\omega \max_g \frac{1}{N} \sum_{j=1}^{N} \left| \mathbb{E}\left[ \left(1 - \sum_{i=1}^{N} \omega(I_t, I_{t,i}) R^e_{t+1,i} \right) R^e_{t+1,j}\, g(I_t, I_{t,j}) \right] \right|^2 \tag{3}
$$

### 수식 4줄 풀이 — Eq (3) Adversarial GMM

**기호 뜻**:
- $\omega(I_t, I_{t,i})$: SDF network — 자산 $i$ 의 SDF portfolio weight (입력: macro $I_t$ + firm chars $I_{t,i}$)
- $g(I_t, I_{t,j})$: Conditional network — adversary 의 instrument (test asset condition)
- $R^e_{t+1,i}$: 자산 $i$ 의 excess return
- $1 - \sum_i \omega R^e$ = $M_{t+1}$ — SDF
- Inner $|\mathbb{E}[\cdot]|^2$: portfolio $j$ 의 squared pricing error
- $\min_\omega \max_g$: SDF 가 worst case adversary 에 대해 최소화

**일상 비유**:
- **가격 책정자 vs 아비트라저 게임**:
  - 가격 책정자 (SDF $\omega$): "이 가격으로 책정하면 모두 만족할까?"
  - 아비트라저 ($g$): "가격이 틀린 곳 찾기!"
- 가격 책정자가 아비트라저의 worst attack 에서도 정확하면 → robust SDF.

**왜 이 형태인가**:
- **무한 GMM** (모든 함수 $g$ 에 대한 조건) → 직접 풀 수 없음.
- **Adversarial reformulation**: $g$ 도 신경망으로 학습 → "가장 informative 한 $g$ 자동 발견".
- $\min\max$: zero-sum game — Hansen-Jagannathan (1997) 의 minimax SDF 의 NN 일반화.
- 단순 $\min$ (no adversary) → SDF 가 특정 일부 asset 만 잘 가격결정.

**조심할 점**:
- Minimax 학습 불안정 — GAN 류와 같은 학습 어려움 (mode collapse, oscillation).
- $\omega$ 와 $g$ 의 capacity 균형 중요 — 한쪽이 너무 강하면 학습 발산.
- 본 paper: ensemble + 신중한 hyperparameter tuning (Appendix B-D).

**기호 뜻** (요약):
- $\omega, g$ — 둘 다 신경망으로 학습되는 함수.
- 외부 $\min_\omega$ — SDF 가 pricing error 최소화.
- 내부 $\max_g$ — adversary 가 가장 mispriced 한 test asset 선택.

paper 본문:
> "This is a minimax optimization problem. These types of problems can be modeled as a zero-sum game, where one player, the asset pricing modeler, wants to choose an asset pricing model, while the adversary wants to choose conditions under which the asset pricing model performs badly."

### 4.2.4 Hansen-Jagannathan (1997) 와의 연결

paper 인용:
> "Our adversarial estimation with a minimax objective function is economically motivated and based on the insights of Hansen and Jagannathan (1997). They show that if the SDF implied by an asset pricing model is only a proxy that does not price all possible assets in the economy, then minimizing the largest possible pricing error corresponds to estimating the SDF that is the closest to an admissible true SDF in a least square distance."

→ **HJ minimax SDF estimation 의 NN 일반화**.

### 4.2.5 Adversarial GMM 의 3가지 장점

paper p.11 (footnote 영역):
1. **Misspecification 에 robust** (Hansen-Jagannathan 1997)
2. **Weak factor 문제 해결** — adversary 가 약한 factor 의 mispricing 을 큰 portfolio 로 증폭
3. **Identification** — 모든 SDF 모수의 식별 보장

### 4.2.6 본 논문의 specific 구현

paper p.10:
> "In our benchmark model we consider N = 10,000 stocks and D = 8 instruments and therefore average in total over 80,000 instrumented assets."

→ N=10,000 stocks × D=8 instruments = **80,000 test assets**.

---

## 4.3 Section I.C — Alternative Models (Benchmarks)

본 논문이 비교하는 alternative 들:

### 4.3.1 Forecasting Approach (FFN)

paper p.12:
$$
\mu_{t,i} := \mathbb{E}_t[R^e_{t+1,i}] = \beta_{t,i}\, \mathbb{E}_t[F_{t+1}]
$$

→ 비례 관계. **conditional mean 직접 추정** 으로 SDF 우회.

Gu, Kelly, Xiu (2020) 의 best FFN model 채택.

**특징**: No-arbitrage 미사용. variance 설명 중심.

### 4.3.2 Linear Special Case (LS)

paper p.12:
- $\omega_{t,i} = \theta^\top I_{t,i}$ (선형 SDF weights)
- Conditioning $g$ 도 선형: $g_{t,j} = I_{t,j}$

이 경우 (3) 의 해:
$$
\theta = \mathbb{E}[\tilde F_{t+1} \tilde F^\top_{t+1}]^{-1} \mathbb{E}[\tilde F_{t+1}]
$$
where $\tilde F_{t+1} = \frac{1}{N}\sum_i I_{t,i} R^e_{t+1,i}$ — **characteristic managed factors**.

→ **mean-variance optimization on characteristic factors**.

### 4.3.3 Linear with Elastic Net (EN)

paper p.20–21:
$$
\hat\theta_{EN} = \arg\min_\theta \frac{1}{T}\sum_t \left( \tilde F_{t+1} - \frac{1}{T}\sum_t \tilde F_{t+1} \tilde F^\top_{t+1} \theta \right)^2 + \lambda_2 \|\theta\|_2^2 + \lambda_1 \|\theta\|_1
$$

→ **Kozak, Nagel, Santosh (2020) "Shrinking the Cross Section"** 와 거의 동일 (paper footnote 22 의 5가지 차이점).

---

## 4.4 모델 비교 정리

| 모델 | 함수형 | No-arbitrage | Macro 처리 |
|------|--------|--------------|-----------|
| **LS** | 선형 | ✓ | 단순 차분 |
| **EN** | 선형 + elastic net | ✓ | 단순 차분 |
| **FFN** | 비선형 NN | ✗ (mean 추정) | 단순 차분 |
| **GAN** (본 논문) | 비선형 NN | ✓ | **LSTM hidden states** |

→ **GAN 만 4가지 (비선형 + no-arb + LSTM + adversarial)** 모두 갖춤.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. SDF $M_{t+1} = 1 - \omega^\top R^e$ 정규화의 의미는?
2. Eq (2) 가 Eq (1) 의 무한 generalization 인 이유는?
3. Minimax 에서 SDF 와 adversary 의 게임이 zero-sum 인 이유는?

### 답변
1. SDF 가 자산 수익률의 **affine 함수** (상수 1 + 선형결합). $\omega$ 가 tangency portfolio weights 와 동일 (Eq 1). Cochrane (2003) 의 표준 normalization — risk-free rate 의 자유도 처리.
2. Eq (1) 은 unconditional moment ($g = $ 상수) 의 특수 케이스. 일반 conditional moment 는 임의 함수 $g$ 에 대해 $\mathbb{E}[M R^e g] = 0$. 무한 family — $g$ 의 선택에 따라 무한히 많은 모멘트 조건.
3. SDF 는 pricing error 최소화, adversary 는 최대화 — 한쪽이 이기면 다른 쪽이 짐 (정확히 반대). Hansen-Jagannathan (1997) 의 minimax: 가장 mispriced 한 portfolio 까지 잘 가격결정해야 robust SDF.


```viz:chen-sdf-framework:title=paper §3 — SDF+GAN Architecture,caption=Component selector.
```


```viz:dlap-no-arbitrage:title=paper Eq 1 — No-Arbitrage Pricing,caption=Asset count slider.
```
