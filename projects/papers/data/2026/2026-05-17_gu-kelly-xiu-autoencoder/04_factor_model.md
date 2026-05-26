# 04. KPS factor model — 출발점 (Eq. 1, 2)

> **🧒 한 줄 요약**: Static linear factor (Fama-French) → conditional nonlinear autoencoder.


이 챕터는 본 논문이 시작하는 **출발 모델**인 KPS (2019) 의 conditional factor model 을 정밀히 살펴본다. 본 논문이 어디서 이 모델을 일반화하는지를 보면 차이점이 명확해진다.

---

## 4.1 출발 — 개별 자산 conditional factor 모델

논문 page 1, 마지막 단락에 핵심 식이 있다:

$$
r_{i,t} = \beta(z_{i,t-1})' f_t + u_{i,t} \quad \text{(Eq. 1)}
$$

**기호 뜻**:
- $r_{i,t}$ — 자산 $i$ (예: 애플 주식), 시점 $t$ (예: 2020년 3월) 의 초과수익 (스칼라, 월간 % 단위). "초과" 는 무위험 수익 (T-bill) 을 뺀 것.
- $z_{i,t-1}$ — 자산 $i$ 의 시점 $t-1$ 의 $P \times 1$ 특성 벡터. $P = 94$ (size, momentum, value, profitability, ...).
- $\beta(z_{i,t-1})$ — 특성 $z$ 를 $K \times 1$ 노출도 벡터로 변환하는 **함수**. $K \ll N$ (예: K=5).
- $f_t$ — 시점 $t$ 의 $K \times 1$ 잠재요인 벡터. **자산-비특정**, 모든 자산이 공유.
- $u_{i,t}$ — 잔차 (자산 $i$, 시점 $t$ 의 idiosyncratic 잡음).

**일상 비유**:
$r$ = 학생 시험 점수 변동
$f$ = 시험별 난이도 (수학·영어·과학)
$\beta(z)$ = 학생 특성 $z$ (학습 시간, 성격, 학원 종류, 과외 여부) 의 함수로 결정되는 학생의 과목별 약점

→ "학생마다 약점이 다른 이유" 가 학생 특성 $z$ 에 결정적으로 의존한다는 통찰.

**왜 이 형태**:
- 곱셈 $\beta · f$: 노출도 (학생 약점) × 충격 (시험 난이도) = 자산 수익에 기여
- 시간 인덱싱 $t-1$ on $z$ + $t$ on $f$, $r$: **look-ahead 방지**. $\beta$ 는 과거 시점에 알려진 특성, $f$ 는 현재 시점 충격.
- 함수 $\beta(\cdot)$ 의 형태가 모델 선택의 자유도. 본 논문이 이 자유도를 신경망으로 가져감.

**조심할 점**:
- 노출도 $\beta$ 가 **시간에 따라 변함** (인덱스 $t-1$). 정적 Fama-French 와 다름.
- 시점 $t-1$ 의 $z$ 와 시점 $t$ 의 $f$ → causal direction 정확.
- $u_{i,t}$ 가 $f_t$ 와 무상관 (가정).

---

## 4.2 차원 정리

| 객체 | 차원 | 의미 |
|------|------|------|
| $N$ | 정수 | 자산 수 (≈ 6,200, 매월 평균) |
| $T$ | 정수 | 시간 길이 (≈ 720 month, 60 year) |
| $P$ | 정수 | 자산 특성 수 (= 94) |
| $K$ | 정수 | 잠재요인 수 (= 1, 2, ..., 6 가변) |
| $r_{i,t}$ | 스칼라 | 자산 $i$, 시점 $t$ 수익률 |
| $z_{i,t-1}$ | $P \times 1$ | 자산 $i$, 시점 $t-1$ 특성 벡터 |
| $\beta(z_{i,t-1})$ | $K \times 1$ | 자산 $i$, 시점 $t-1$ 노출도 |
| $f_t$ | $K \times 1$ | 시점 $t$ 잠재요인 (모든 자산 공유) |
| $u_{i,t}$ | 스칼라 | 잔차 |

**행렬 형태**:
- 모든 $i, t$ 에 대한 수익률을 모으면 $R$ 은 $N \times T$ 행렬.
- 모든 $t$ 에 대한 요인을 모으면 $F$ 는 $K \times T$ 행렬.
- 모든 $i, t$ 에 대한 노출도를 모으면 $B$ 는 $N \times K \times T$ 텐서 (시간에 따라 변하니까).

---

## 4.3 KPS 의 **단순화 가정** — 선형 매핑

> **원문**: "KPS make the simplifying assumption that the map from $P$ characteristics to $K$ betas is linear:"

$$
\beta(z_{i,t-1})' = z_{i,t-1}' \Gamma \quad \text{(Eq. 2)}
$$

**기호 뜻**:
- $\Gamma$ — $P \times K$ 매핑 행렬. **모든 자산이 공유**. 시간 무관.
- $z_{i,t-1}' \Gamma$ — $(1 \times P) \times (P \times K) = 1 \times K$ 행벡터 = 자산 $i$ 의 노출도

**일상 비유**:
"학생의 수학 약점" = $\gamma_{1, \text{수학}} \times (\text{학습 시간}) + \gamma_{2, \text{수학}} \times (\text{성격}) + \cdots + \gamma_{P, \text{수학}} \times (\text{과외 여부})$

→ 학생 약점이 특성의 **선형 결합**.

**왜 이 형태**:
- 추정 효율: $\Gamma$ 는 $P \times K = 94 \times 5 = 470$ 파라미터. 작은 차원. ML 없이도 OLS-like 풀 수 있음.
- 해석성: $\Gamma$ 의 한 열 $\gamma_k$ = 요인 $k$ 의 portfolio 가중치.
- 단점: **선형성**. 특성 간 상호작용 ($z_1 \cdot z_2$), threshold 효과 ($z_1 > \text{cutoff}$ 일 때만 효과), saturation ($z$ 가 클 때 효과 정체) 등 못 잡음.

**조심할 점**:
- $\Gamma$ 의 식별: $\beta = z\Gamma$, $f$ 가 잠재요인이므로 회전 ($\Gamma G, G^{-1} f$) 까지만 식별. KPS 는 $\Gamma'\Gamma = I_K$ + $FF'$ diagonal 의 정규화로 해결.
- $\Gamma$ 시간 무관 → 한 매핑이 60년 동안 같다. 시변 매핑이 필요하면 정적 KPS 도 한계.

---

## 4.4 KPS 의 추정 — IPCA optimization

KPS 는 Eq. 1, 2 를 결합해 다음 problem 으로:

$$
\min_{\Gamma, F} \sum_{t=1}^{T} \sum_{i=1}^{N} \| r_{i,t} - z_{i,t-1}' \Gamma' f_t \|^2 = \min_{\Gamma, F} \sum_{t=1}^{T} \| r_t - Z_{t-1} \Gamma' f_t \|^2 \quad \text{(Eq. 17, 우리 챕터 05c 에서 다룸)}
$$

**기호 뜻**:
- $r_t$ — 시점 $t$ 의 $N \times 1$ 자산 수익률 벡터
- $Z_{t-1}$ — 시점 $t-1$ 의 $N \times P$ 특성 행렬 (모든 자산 모음)
- $\Gamma' f_t$ — $K \times 1$ 노출도와 $K \times 1$ 요인의 결합 (사실 $z'\Gamma' f$ 형태로 자산별로 작용)

**추정 절차** (반복 최적화):
1. $\Gamma$ 고정 → $F$ regression
2. $F$ 고정 → $\Gamma$ regression
3. 수렴까지 반복

→ 정확한 closed-form 아니지만 **선형 system** 의 반복.

---

## 4.5 KPS 가 가져온 효과 (왜 본 논문도 그 framework 채택)

KPS 가 정적 Fama-French 보다 좋은 이유:

### (a) Conditional 노출도 모델링
**Fama-French**: $\beta_i$ 는 상수. 1990년 애플과 2020년 애플의 시장 노출도가 같다고 강제 → 비현실적.

**KPS**: $\beta_{i,t-1} = z_{i,t-1}' \Gamma$. 회사 size·valuation·momentum 이 매월 변함에 따라 노출도도 변함.

→ 실증적으로 conditional 모델이 static 보다 OOS R² 와 Sharpe 모두 압도.

### (b) 특성 → 위험 노출의 인과 해석
"왜 small-cap stock 이 평균적으로 더 많이 벌까?" 의 두 해석:
- (anomaly): small-cap 이라는 자체가 mispricing. EM 위반.
- (risk factor — KPS view): small-cap 이라는 **특성** 이 어떤 위험요인 (예: 유동성 위험) 에 대한 노출 측정. 그 위험에 대한 보상.

KPS 의 정확한 framework 가 후자를 strongly 지지.

### (c) Characteristic-managed portfolio 라는 자연스러운 해석
$\Gamma$ 의 한 열 = 자산 특성 $z$ 의 선형결합으로 만든 포트폴리오. → **요인을 직접 만든 portfolio** 로 해석. KPS 정리의 핵심.

---

## 4.6 본 논문이 그 framework 의 어디를 일반화하나

> **원문 (Section 1, p.430)**: "Ultimately, ours is a nonlinear conditional asset pricing model, where the nonlinearities manifest through a flexible neural network mapping of covariates into betas."

**본 논문의 변경**:

$$
\text{KPS:} \quad \beta(z_{i,t-1})' = z_{i,t-1}' \Gamma
$$

$$
\text{본 논문:} \quad \beta(z_{i,t-1}) = \text{NeuralNetwork}(z_{i,t-1})
$$

**그 외 모든 것은 동일**:
- 같은 conditional 구조 Eq. 1
- 같은 $K$ 요인 잠재 모델
- 같은 No-arbitrage 부과 (절편 α 없음)
- 같은 데이터셋 (KPS 와 같은 CRSP 94 chars)

**유일한 변경**: $z \mapsto \beta$ 의 함수 형태.

---

## 4.7 행렬 표기 — 모든 시점 모음

$$
\text{Stacking time:} \quad R = B(Z) F + U
$$

**기호 뜻**:
- $R$ — $N \times T$ 자산 수익률 panel
- $Z$ — $N \times P \times T$ 특성 텐서 (또는 $(NP) \times T$ vec 형태)
- $B(Z)$ — $N \times K \times T$ 노출도 텐서 (각 $(t)$ slice 가 $N \times K$ 노출도 행렬)
- $F$ — $K \times T$ 요인
- $U$ — $N \times T$ 잔차

**일상 비유**: 행렬 곱 $R = B \cdot F$ 는 학생 약점 × 시험 난이도 = 점수 변동의 텐서 버전.

---

## 4.8 식별 (Identification) 이슈

요인 모델은 항상 회전 모호성:
$$
r = \beta' f = \beta' G^{-1} G f = \tilde\beta' \tilde f
$$
임의의 $K \times K$ 가역 행렬 $G$.

**KPS 의 정규화**:
- $\Gamma' \Gamma = I_K$ (orthonormal columns)
- $F F'$ diagonal (요인 uncorrelated)
- $F$ 평균 > 0 (factor sign 고정)

→ 이 3 조건이면 unique 식별.

**본 논문**: 신경망이라 회전 모호성 더 강함. $\Gamma$ 대신 신경망의 weights $W^{(l)}$ 가 회전 가능. → identification 문제 더 복잡하지만 OOS prediction 에는 영향 X.

---

## 4.9 KPS 의 핵심 발견 (배경)

KPS (2019, JFE) 의 실증적 핵심 발견:
- IPCA 의 framework 에서 특성을 위험 노출 측정도구로 간주하면, 학계의 "anomaly" 들이 잔차의 평균에서 거의 사라짐.
- → 특성이 추가 수익 예측력 (anomaly) 을 가진 게 아니라 **위험 노출** 의 측정도구.
- 본 논문은 KPS 의 이 framework 를 **선형성만 일반화**.

(주의: 위는 본 논문이 직접 인용하지 않은 배경 설명. 본 논문 본문 (Section 1) 은 이 framework 를 비선형으로 확장하는 동기만 명시.)

---

## 4.10 다음 단계 — 본 논문이 일반화하는 두 갈래

본 논문은 KPS framework 와 standard autoencoder 의 두 갈래를 통합:

| 갈래 | 어디서 다루나 | 핵심 변경 |
|------|------------|---------|
| **표준 autoencoder** | 챕터 05a | covariates 무사용 — $r → f → \hat r$ 의 unsupervised autoencoder. Proposition 1 에서 PCA 와 등가 증명. |
| **Conditional autoencoder (CA0–CA3)** | 챕터 05b (메인) | β-network: $\beta = \text{NN}(z)$ (CA1+ 비선형) / f-network: $f = W_1 x$ (모든 CA 에서 **단일 선형층**). dot product 결합. |

다음 [05_method_a_standard_AE.md](05_method_a_standard_AE.md) 에서 표준 autoencoder 부터.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. **Eq. (1) `r = β(z)' f + u` 의 각 객체 차원과 의미는?**
2. **KPS 가 (Eq. 2) 에서 한 선형성 가정의 정확한 형태와 그 약점은?**
3. **본 논문이 KPS framework 의 어디 한 군데만 일반화하는가?**

### 답변
1. $r_{i,t}$ 스칼라 (자산 $i$ 시점 $t$ 수익), $z_{i,t-1}$ $P\times1$ (특성), $\beta(z)$ $K\times1$ (노출도), $f_t$ $K\times1$ (잠재요인, 모든 자산 공유), $u$ 스칼라 (잡음). $\beta(z)$ 는 **함수**라는 점 — 본 논문이 그 함수를 신경망으로 일반화.
2. $\beta(z)' = z' \Gamma$, $\Gamma$ $P\times K$ 매핑 행렬. **약점**: 특성 간 상호작용·threshold 효과·saturation 등 비선형 모두 무시.
3. **선형성 (Eq. 2) 한 군데만**. 나머지 (conditional 구조 Eq. 1, no-arbitrage, 추정 framework) 는 그대로.


```viz:gu-factor-extraction:title=paper §3 — Latent Factors,caption=# factors slider.
```
