# 04. KPS factor model — 출발점 (Eq. 1, 2)

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Eq. 1** ($r = \beta(z)' f + u$) 가 뭘 말하는지 — "주가 = 자산 노출도 × 시장 충격 + 잡음" 의 수학 표현
- **Eq. 2** ($\beta(z) = z'\Gamma$ 선형) 의 한계 — 왜 이게 본 논문의 공격 지점인지
- 본 논문이 **무엇을 일반화** 하고 **무엇을 그대로 두는지** — "선형 한 군데만 신경망으로"

---

이 챕터는 본 논문이 시작하는 **출발 모델**인 KPS (2019) 의 conditional factor model 을 정밀히 살펴본다. 본 논문이 어디서 이 모델을 일반화하는지를 보면 차이점이 명확해진다.

---

## 4.1 출발 — 개별 자산 conditional factor 모델

논문 page 1, 마지막 단락에 핵심 식이 있다:

$$
r_{i,t} = \beta(z_{i,t-1})' f_t + u_{i,t} \quad \text{(Eq. 1)}
$$

### 🔣 식이 말하는 것 한 줄

"애플의 2020년 3월 수익률 = (애플의 특성에서 계산한 위험 노출도) × (2020년 3월의 시장 충격) + 잡음".

### 🔣 4-단 기호 풀이 (수식 못 읽어도 따라가는 표)

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $r_{i,t}$ | 자산 $i$ 의 시점 $t$ 초과수익 (스칼라) | 학생 $i$ 의 시점 $t$ 시험 점수 | "초과" = T-bill (무위험) 뺀 후. 음수 가능 |
| $z_{i,t-1}$ | 자산 $i$ 의 시점 $t-1$ 특성 벡터 ($P \times 1$, P=94) | 학생 신상카드 (학습시간·성격·과외 등 94 항) | t-1 → 미래 정보 누설 방지 |
| $\beta(\cdot)$ | 특성 → 노출도 변환 **함수** | "신상 → 약점 진단" 변환기 | **이 함수의 형태가 모델 선택의 자유도** — 본 논문의 공격 지점 |
| $\beta(z_{i,t-1})$ | 자산 $i$ 의 노출도 ($K \times 1$, K=5) | 학생 $i$ 의 과목별 약점 (5 항) | K 가 작아야 의미 (K << N) |
| $f_t$ | 시점 $t$ 의 잠재요인 ($K \times 1$) | 시점 $t$ 의 시험별 난이도 (수학·영어 등) | **모든 자산 공유** — 시장 전체 충격 |
| $u_{i,t}$ | 잔차 (idiosyncratic) | 학생 컨디션·우연 | $f_t$ 와 무상관 가정 |

### 🌱 일상 비유로 한 번 더

"학생 점수 = (학생 약점) × (시험 어려움) + 컨디션"
- 학생 약점은 **학생 정보 (z) 에서 결정** ← 본 논문이 신경망으로 푸는 부분
- 시험 어려움은 **그날 한 시점 전체에 공통** ← f_t
- 컨디션은 학생마다 다른 우연 ← u

**왜 이 형태**:
- 곱셈 $\beta \cdot f$: "약점이 큰 학생이 어려운 시험에서 더 큰 영향". 시너지 효과 표현.
- 시간 인덱스 t-1 (z), t (f, r): "**과거 정보** 로 **현재** 예측" — 미래 정보 누설 차단.
- 함수 $\beta(\cdot)$ 의 형태가 **모델 선택의 자유도** — 본 논문이 이 자유도를 신경망으로 가져감.

**조심할 점**:
- 노출도 $\beta$ 가 **시간에 따라 변함** (인덱스 $t-1$). 정적 Fama-French 와 다름.
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

> **📍 paper 표기 주의**: $\Gamma$ 의 차원이 paper 본문 Eq. 2 ($P \times K$) 와 Appendix A.2 ($K \times P$) 에서 **서로 transpose 관계로 표기됨**. 본 챕터는 Eq. 2 표기 ($P \times K$) 따름. 상세 분석은 [11.5-1 paper 표기 이슈](11_appendix_proofs.md#11_5-1) 에서.

### 🔣 식이 말하는 것 한 줄

"학생 약점 = 학습시간 가중치 × 학습시간 + 성격 가중치 × 성격 + ... + 과외 가중치 × 과외 여부" — 약점이 신상의 **선형 결합** 으로 결정.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $\Gamma$ | 특성→노출도 매핑 행렬 ($P \times K$, 시간 무관) | "신상→약점" 환산표 (94 항 × 5 과목) | **모든 자산 공유 + 시간 무관** — 너무 강한 단순화 |
| $z_{i,t-1}'\Gamma$ | 자산 $i$ 의 노출도 ($1 \times K$ 행벡터) | "학생 $i$ 의 약점 5 항목" | 본 논문이 이 부분을 신경망으로 일반화 |

### 🌱 일상 비유로 한 번 더

"학생의 수학 약점" = $\gamma_{1, \text{수학}} \times (\text{학습 시간}) + \gamma_{2, \text{수학}} \times (\text{성격}) + \cdots + \gamma_{P, \text{수학}} \times (\text{과외 여부})$

→ **모든 학생이 같은 환산표** 로 약점이 결정. 단지 신상 (z) 만 다름.

→ "키 큰 학생일수록 약점이 줄어든다" 같은 **선형 관계만** 표현 가능. "키와 시력의 상호작용" 같은 **비선형** 은 못 잡음.

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

1. **각 객체의 정확한 차원과 의미**:
   - $r_{i,t}$ : 스칼라 (자산 $i$, 시점 $t$ 의 초과 수익률, % 단위)
   - $z_{i,t-1}$ : $P \times 1$ 벡터 ($P = 94$ firm characteristics, 시점 $t-1$ 의 값)
   - $\beta(z_{i,t-1})$ : $K \times 1$ 벡터 ($K \in \{1, \ldots, 6\}$ 잠재요인 노출도)
   - $f_t$ : $K \times 1$ 벡터 (시점 $t$ 의 잠재요인, **모든 자산 공유**)
   - $u_{i,t}$ : 스칼라 (idiosyncratic 잔차, 평균 0, $f_t$ 와 무상관)
   
   가장 결정적인 점: **$\beta(z)$ 가 함수** 라는 것. KPS 는 이걸 $z'\Gamma$ 선형으로 두지만 본 논문은 신경망 NN(z) 로 일반화. **이 함수 형태가 자산가격결정 모델 선택의 자유도**.

2. **KPS 의 선형성 가정 + 약점**:
   - 정확한 형태: $\beta(z_{i,t-1})' = z_{i,t-1}' \Gamma$ (Eq. 2). $\Gamma$ 는 $P \times K$ 매핑 행렬, 모든 자산 공유, 시간 무관.
   - **3 가지 약점**:
     - (a) **상호작용 무시**: size × momentum 같은 곱항 못 잡음 (Hong-Lim-Stein 2000 의 small-cap momentum 효과)
     - (b) **Threshold 효과 무시**: 어떤 값 이상에서만 효과 (DeBondt-Thaler 1985 의 reversal)
     - (c) **Saturation 무시**: 변동성이 매우 낮을 때만 강한 효과 (Ang et al. 2006 의 idiosyncratic vol)
   - 본 논문은 NN 의 universal approximation 으로 자동 발견.

3. **본 논문이 KPS 의 어디만 일반화하나**:
   **선형성 (Eq. 2) 단 한 군데만**. 다른 모든 것은 그대로:
   - ✅ Conditional 구조 Eq. 1 ($r = \beta(z)' f + u$)
   - ✅ No-arbitrage (α 없음)
   - ✅ K 차원 잠재요인 framework
   - ✅ 같은 CRSP 60년 데이터, 94 characteristics
   - ✅ Managed portfolio 사용 (Eq. 16)
   → **점진적 일반화의 모범**. KPS 를 죽이지 않고 자기 모델 안에 포함 (Prop 2).
