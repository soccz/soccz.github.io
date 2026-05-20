# 05-C. 방법론 (Part C) — IPCA 는 Conditional Autoencoder 의 특수 케이스

> Section 2.2.1 (journal p.434–435) — **Proposition 2** 와 그 의의.

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Proposition 2** — "1층 선형 conditional autoencoder = IPCA" 의 정확한 statement
- 이게 왜 본 논문의 **학술적 깨끗함** 의 핵심인지 (IPCA 를 죽이지 않고 자기 모델 안에 포함)
- CA0 와 IPCA 의 **수학적 동치 + 실증적 미세 차이** 가 어디서 오는지

---

## 5C.1 챕터 한 줄 요약

조건부 오토인코더 (CA) 의 **β 네트워크와 f 네트워크를 둘 다 1-layer 선형 (활성화 없음)** 으로 만들면, 그 모델은 **KPS (2019) 의 IPCA 추정량과 정확히 동일**해진다. 따라서 IPCA 는 CA 의 **선형 특수 케이스 = CA0** 이다.

→ "IPCA 는 죽은 게 아니라, **우리 모델 안에 한 케이스로 살아있다**" 라는 학술적 메시지.

---

## 5C.2 IPCA 의 추정 문제 다시 보기 (Eq. 17)

KPS (2019) 의 IPCA 는 paper Eq. (17) 의 최소화 문제를 푼다:

$$
\min_{\Gamma, F} \; \sum_{t=1}^{T} \big\| r_t - Z_{t-1}\, \Gamma'\, f_t \big\|^2 \tag{17}
$$

### 🔣 식이 말하는 것 한 줄

"모든 시점과 자산에 걸쳐, 실제 수익률과 모델 예측 (특성 × Γ × 요인) 의 오차 제곱합을 최소화" — 표준 least squares 의 conditional 버전.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $r_t$ | 시점 $t$ 의 N 개 주식 수익률 ($N \times 1$) | "오늘 모든 학생의 점수표" | 매월 6,200 개 정도 |
| $Z_{t-1}$ | 주식별 특성 행렬 ($N \times P$) | "모든 학생의 신상카드 모음" | 94 특성 |
| $\Gamma$ | 특성→요인 매핑 ($K \times P$ in proof) | "신상→약점" 전체 환산표 | **추정 대상**, 시간 불변 |
| $f_t$ | 잠재요인 ($K \times 1$) | "오늘의 시험별 난이도" | **추정 대상**, 매월 다름 |
| $Z_{t-1}\Gamma'$ | 베타 행렬 ($N \times K$) | "오늘 모든 학생의 약점 5 항" | 두 추정 대상의 곱 |

**해석**: 각 주식 $i$ 의 노출도는 $\beta_{i,t-1} = \Gamma\, z_{i,t-1}$ — **특성 $z$ 에 $\Gamma$ 를 적용한 선형 함수**. 그 노출도와 시점별 요인 $f_t$ 의 내적이 기대수익률.

$$
r_{i,t} = \beta_{i,t-1}' f_t + u_{i,t} = z_{i,t-1}' \Gamma' f_t + u_{i,t}.
$$

→ KPS 의 핵심 가정: **β 가 z 의 선형 함수**.

**Note on Γ 표기**: paper 본문 Eq. (2) 에서 $\beta'(z) = z'\Gamma$ 형태로 $\Gamma$ 가 $P \times K$. paper Appendix A.2 proof 에서는 $K \times P$ 로 표기. 본 챕터는 proof 의 convention 따름.

---

## 5C.3 Conditional Autoencoder 의 선형 특수 케이스 (Eq. 18)

CA 의 β 네트워크와 f 네트워크에서 **활성화 함수를 모두 항등 (identity)** 으로 두고 (즉 비선형 제거), **은닉층을 0개로** 두면 (즉 1-layer 선형 매핑):

- β 네트워크: $\beta_{i,t-1} = W_0\, z_{i,t-1}$ (절편 $b_0$ 도 단순화 위해 0)
  - $W_0$: $K \times P$ 행렬 (KPS 의 $\Gamma'$ 와 같은 역할)
- f 네트워크 (factor side): $f_t = W_1\, x_t$
  - $x_t = (Z_{t-1}'Z_{t-1})^{-1} Z_{t-1}' r_t$ : managed portfolio (Eq. 16)
  - $W_1$: $K \times P$ 행렬

이를 (17) 의 손실에 대입:

$$
\min_{W_0, W_1} \; \sum_{t=1}^{T} \big\| r_t - Z_{t-1}\, W_0'\, W_1\, x_t \big\|^2 \tag{18}
$$

### 🔣 식이 말하는 것 한 줄

IPCA Eq. 17 과 같은 손실인데, **$f_t$ 가 직접 추정 대상이 아니라 $W_1 x_t$ 로 자동 계산**됨. $x_t$ 는 관측 가능 (managed portfolio), $W_1$ 는 학습 가중치.

### 🔣 4-단 기호 풀이

| 기호 | 한국어 | 일상 비유 | 조심할 점 |
|------|--------|-----------|-----------|
| $W_0$ | β-network 가중치 ($K \times P$) | "신상→약점" 환산 신경망 가중치 | KPS 의 $\Gamma'$ 와 **같은 역할** |
| $W_1$ | f-network 가중치 ($K \times P$) | "관측 가능 portfolio → 잠재 요인" 변환 | 단일 선형 (CA0~CA3 모두 동일) |
| $x_t$ | managed portfolio ($P \times 1$) | "특성으로 만든 94 개 mini-펀드의 오늘 수익" | 데이터로 계산 (Eq 16) |
| $W_0' W_1$ | 두 가중치의 곱 | "약점 환산 × 요인 변환" 합성기 | **β 와 f 가 곱으로 결합되는 부분** |

**구조 비교**:

```
IPCA (Eq. 17):    r_t ≈ Z_{t-1} · Γ · f_t
                                  └──┘
                              자유 변수 (Γ, {f_t})

CA0 (Eq. 18):     r_t ≈ Z_{t-1} · W_0' · W_1 · x_t
                                  └──────────┘
                              구조화된 곱 (β·f 식 매개변수화)
                              x_t 는 데이터로 결정 (managed portfolio)
```

---

## 5C.4 Proposition 2 — 두 추정량의 동치성

**원문 (journal p.435, Proposition 2)**:

> "The solution to (18) is equivalent to the solution of (17) if $Z'_t Z_t = \Sigma$ for a constant matrix $\Sigma$."

paper 본문 추가 (412–413):
> "In the general case where $Z'_t Z_t$ is non-constant, the two estimators are similar but no longer equivalent (as we can see from the proof). We find that the empirical performance of (17) and (18) is similar in our data."

### 📖 무지식자용 — Prop 2 가 결국 뭘 말하는가

**한 줄로**: "1층 선형 conditional autoencoder = IPCA — 즉 두 모델은 사실 같은 일을 하는 다른 표기".

**가정 ($Z'Z$ 가 상수)** 이 뭐길래 이렇게 중요한가?
- 의미: 특성 행렬을 자기 자신과 곱한 결과 ($Z'_t Z_t$) 가 매월 똑같음.
- 일상 비유: "**매월 학생 신상의 '평균적 분포' 가 같음**" — 학생 인구의 통계적 성질이 시간 따라 안 변함.
- 실제로는: 매월 cross-sectional rank normalization 으로 특성을 $[-1, 1]$ 균등 분포 → $Z'Z$ 가 거의 일정 → 가정 거의 만족 → 두 추정량 거의 동일.

**왜 이게 본 논문의 핵심?**
- "신경망은 black box, 기존 모델과 단절" 비판에 대한 답:
- "우리 모델의 **가장 단순한 케이스 = 학계 표준 IPCA**" → 본 논문은 IPCA 의 **자연스러운 일반화**.
- CA0 = IPCA (학계 익숙) → CA1 (1층 NN) → CA2 (2층) → CA3 (3층) 의 **연속체**.
- 데이터가 비선형이면 → CA1+ 가 IPCA 보다 잘함. 선형이면 → CA0 ≈ IPCA.

**한국어 statement**: $Z_{t-1}'Z_{t-1}$ 이 시점에 따라 변하지 않는 (시간 불변) 가정 하에서 (18) 의 해 = (17) 의 해. 일반적 경우 두 추정량은 "유사하지만 동일하지 않음".

### Why "회전을 제외하고" 인가?

요인모델은 $r = \beta'f$ 형태에서 $\beta$ 와 $f$ 를 **임의 가역행렬 $A$** 로 동시 회전해도 적합치가 같다:
$$
r = \beta'f = (\beta A^{-1})'(A f).
$$

따라서 어느 추정량이든 **회전 동치류 (equivalence class)** 안에서만 유일하다. Identification 을 위해 보통 $\frac{1}{T}\sum f_t f_t' = I_K$ 같은 정규화 조건을 부과한다.

### 증명 스케치 (Appendix A.2 참조, Γ 는 K×P convention)

1. IPCA 의 1차 조건 (FOC) for $f_t$ (journal p.448):
   $$
   \hat f_t = (\Gamma\, Z_{t-1}'\, Z_{t-1}\, \Gamma')^{-1}\, \Gamma\, Z_{t-1}'\, r_t.
   $$
2. 가정 $Z_{t-1}'Z_{t-1} = \Sigma$ 상수에서:
   $$
   \hat f_t = (\Gamma\, \Sigma\, \Gamma')^{-1}\, \Gamma\, Z_{t-1}'\, r_t.
   $$
3. Managed portfolio 정의 $x_t = (Z_{t-1}'Z_{t-1})^{-1}Z_{t-1}'r_t = \Sigma^{-1} Z_{t-1}' r_t$ 즉 $Z_{t-1}' r_t = \Sigma\, x_t$ 와 연결:
   $$
   \hat f_t = (\Gamma\, \Sigma\, \Gamma')^{-1}\, \Gamma\, \Sigma\, x_t = W_1\, x_t,
   $$
   여기서 $W_1 := (\Gamma \Sigma \Gamma')^{-1} \Gamma \Sigma$ (journal p.448).
4. β 네트워크에서 **$\Gamma = W_0$** 면 IPCA 와 CA 두 추정량의 적합치가 정확히 일치 (journal p.449). □

### 의미

- **함수형이 같다**: $\beta_{i,t-1} = \Gamma\, z_{i,t-1}$ (K×P convention) 형태가 양쪽 다 등장.
- **요인의 정의가 같다**: 양쪽 다 $f_t$ 가 시점 $t$ 의 관측 수익률에서 추출되는 잠재변수.
- **차이는 표현 (parameterization) 뿐**: IPCA 는 $(\Gamma, \{f_t\})$ 를 직접 모수로 두고, CA0 는 $(W_0, W_1)$ 를 모수로 두어 $f_t = W_1 x_t$ 가 자동으로 계산되게 함.

---

## 5C.5 CA0 와 IPCA 의 실용적 차이

| 항목 | IPCA (KPS 2019) | CA0 (본 논문) |
|------|------------------|----------------|
| 함수형 | 선형 | 선형 (동일) |
| 모수 수 | $P \times K + T \times K$ | $P \times K + P \times K$ |
| 시간 의존 모수 | $\{f_t\}$ ($T \times K$ 자유 변수) | 없음 (요인은 $x_t$ 에서 자동) |
| 추정 방식 | Alternating least squares (Eq. 17) | SGD/Adam (Eq. 18) |
| 정규화 | (없거나 따로) | L1 (LASSO), early stopping, ensemble |
| OOS 예측 | $r_{i,t} = z_{i,t-1}' \Gamma'\, \hat f_t$ ($\hat f_t$ 필요, paper Eq 17) | $r_{i,t} = z_{i,t-1}' W_0'\, W_1\, x_t$ ($x_t$ 만 있으면 됨, paper Eq 18) |

→ **CA0 는 IPCA 와 함수형은 같지만 추정 절차가 더 통합적**. 따라서 IPCA 와 CA0 사이의 OOS 차이는 **regularization (LASSO, ensemble) 효과** 에서 온다.

---

## 5C.6 왜 이 Proposition 이 중요한가?

### (1) Embedding 논거 (continuum)

CA0 (선형) → CA1 (1-layer NN) → CA2 (2-layer NN) → CA3 (3-layer NN) 이 **하나의 연속체** 를 이룬다. CA0 가 IPCA 와 같다는 사실은 **이 연속체의 0번째 점이 KPS** 임을 보장.

따라서 만약 데이터가 정말 선형이면 CA0 ≈ CA1 ≈ CA2 ≈ CA3 일 것이고, 비선형이면 CA3 가 가장 좋을 것. → **CA1 vs CA0 의 격차 = 비선형성의 강도** 라는 진단 가능.

### (2) "ML 은 black box" 비판 방어

비판: "신경망은 해석 불가능, 기존 계량경제와 연결이 안 됨."

대응: "우리 모델의 가장 단순한 케이스는 **이미 학계에서 잘 알려진 IPCA 와 정확히 같다**. 우리는 IPCA 를 **확장 (generalize)** 했을 뿐. 따라서 (a) 비선형 효과가 없으면 CA0=IPCA 가 자동으로 작동, (b) 비선형 효과가 있으면 CA1+ 가 그 효과를 자연스럽게 잡아낸다." → 검증 가능한 **점진적 일반화**.

### (3) 학계 자기 비판 모범

본 논문 저자 Kelly 는 **KPS 의 동일 저자**. 따라서 자기 논문의 한계 (선형성 가정) 를 **자기가 일반화**한 형태. 학계에서 매우 깨끗한 후속 연구 패턴.

---

## 5C.7 CA0 vs CA1+ — 어떤 nonlinearity 가 잡히나?

본 논문이 강조하는 **선형성이 너무 강한 경우** 의 예 (Section 1):

1. **Size 와 momentum 의 교호작용**: 작은 주식의 모멘텀 효과는 큰 주식의 모멘텀 효과와 크기가 다르다 (Hong, Lim, Stein 2000). 선형 모델은 두 효과를 분리해서 합산만 함. NN 은 $z_{\text{size}} \times z_{\text{mom}}$ 형태의 곱을 자동 발견.
2. **Long-term reversal**: 5년 수익률이 작으면 그것의 음수 부호로 미래 수익이 + 가 됨 (DeBondt & Thaler 1985). 임계값 근처에서 비선형.
3. **Idiosyncratic volatility 의 negative pricing**: 변동성이 낮은 주식이 더 잘 가격결정됨 (Ang et al. 2006). 변동성이 매우 낮은 영역에서만 효과가 강함 (saturation).

→ 이런 효과들은 **선형 모델로는 잡기 힘들다**. CA1+ 는 NN 의 universal approximation 능력으로 자동 발견.

---

## 5C.8 그림으로

```
         [ KPS (2019) — IPCA ]
                    ▼
       β(z) = Γ z  (선형 매핑, Γ 는 K×P)
                    ▼
   minimize Σ ||r_t - Z_{t-1} Γ' f_t||²     (paper Eq 17)
                    ▼
                ┌───┴───┐
                │       │  (Proposition 2, Γ = W_0)
                │       │
                ▼       ▼
   minimize Σ ||r_t - Z_{t-1} W_0' W_1 x_t||²   (paper Eq 18)
                    │
                    │ ↑ β-network 에 hidden layer 추가
                    ▼
         [ CA1, CA2, CA3 — 비선형 NN ]
```

---

## 5C.9 두 가지 자주 묻는 질문

### Q1. "왜 $Z_{t-1}'Z_{t-1} = \Sigma$ 상수 가정이 필요?"

이 가정 없이도 두 추정량은 **거의** 같지만, 정확한 등식이 깨진다. 실제로는:

- 매월 데이터 표준화 (cross-sectional rank normalize, Section 3.1) → $Z'Z$ 가 거의 상수.
- 결측치 0 채우기 → 약간의 시간변동이 있지만 무시할 만큼 작음.

따라서 **실증적으로는 가정이 거의 만족**되고, CA0 와 IPCA 의 OOS 차이는 미미. 표 1, 2 에서 CA0 ≈ IPCA 인 이유.

### Q2. "그럼 CA0 를 굳이 학습할 필요 없이 IPCA 만 쓰면 되지 않나?"

수학적으로는 그렇지만, **본 논문의 학습 파이프라인 (Adam + LASSO + early stopping + ensemble) 을 일관되게 적용** 하려면 CA0 형태로 두는 게 자연스럽다. 즉 **모든 모델 (CA0–CA3) 이 같은 SGD 옵티마이저로 학습** 되어 비교가 깨끗.

또한 CA0 는 KPS 의 alternating least squares 가 풀지 못하는 경우 (예: 결측치, 잡음) 도 SGD 로 푸는 장점이 있음.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. Proposition 2 가 주장하는 것은?
2. "회전 동치" 가 의미하는 바는?
3. CA0 와 IPCA 의 OOS 차이가 작을 것으로 예상되는 이유는?

### 답변

1. **Proposition 2 의 정확한 주장**:
   - **주장**: β-network 와 f-network 를 모두 1-layer 선형 (활성화 없음, hidden 0) 으로 두면 (=CA0), 그 추정량은 IPCA 의 추정량과 **회전을 제외하고 동일**.
   - **가정**: $Z_{t-1}'Z_{t-1} = \Sigma$ — 즉 특성 행렬의 자기곱이 **시점에 따라 변하지 않음** (시간 불변).
   - **증명 도구**: FOC 로 변수 제거 (IPCA 는 $f_t$, CA0 는 $W_1$) → reduced objective 가 동일 → 같은 최적해.
   - **실증적 의미**: $Z'Z$ 가 매월 rank normalize 로 거의 상수 → 실제로도 CA0 ≈ IPCA (paper Table 1 의 K=6 에서 IPCA 14.5 vs CA0 12.4 미세 차이).
   - **함의**: CA0 = IPCA → CA1+ 가 IPCA 의 **자연스러운 비선형 확장**임을 수학적으로 보장.

2. **"회전 동치" 의 의미**:
   - 요인 모델 $r = \beta'f$ 는 임의의 가역 행렬 $A$ 에 대해 $\beta \to \beta A^{-1}$, $f \to A f$ 로 회전해도 **같은 적합값** ($r$) 을 줌:
     $$r = \beta' f = (\beta A^{-1})' (A f) = \beta' f$$
   - 따라서 잠재요인 추정량은 **회전 동치류 (equivalence class)** 안에서만 유일.
   - 일상 비유: "북동 방향 5km" 와 "회전한 좌표계의 동쪽 5km" — 같은 점, 다른 표현.
   - **해결**: KPS 는 $\Gamma'\Gamma = I_K$ + $FF'$ 대각 + $F\bar\iota \geq 0$ 의 3 조건 부과 → unique 식별 (paper footnote 11).

3. **CA0 와 IPCA 의 OOS 차이가 작은 이유**:
   - (a) **함수형 동일**: 둘 다 $\beta = \Gamma' z$ 선형 매핑. Proposition 2 보장.
   - (b) **데이터 처리 거의 동일**: 매월 rank normalize 로 $Z'Z \approx \Sigma$ 상수 → Prop 2 가정 거의 만족.
   - (c) **차이의 원천 — regularization 만**: CA0 는 SGD + LASSO + early stopping + ensemble, IPCA 는 ALS 없이.
   - 실증 결과 (paper Table 1, K=6): IPCA Total R² 14.5 vs CA0 12.4 → **2.1% 갭만**. 이게 regularization 효과 + finite-sample SGD 차이.
