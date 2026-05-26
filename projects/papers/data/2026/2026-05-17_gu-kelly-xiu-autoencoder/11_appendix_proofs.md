# 11. 부록 — 두 Proposition 의 증명

> **🧒 한 줄 요약**: Mathematical proofs. AE generalization to IPCA. Identifiability conditions.


> Appendix A (journal p.447–449) — Proposition 1, 2 의 수학적 증명.

## 11.1 챕터 한 줄 요약

**Proposition 1**: 1-hidden-layer 선형 autoencoder 의 최적해 = PCA 의 좌특이벡터 (회전 동치). 핵심 도구는 Eckart–Young–Mirsky 정리.

**Proposition 2**: $Z'_{t-1} Z_{t-1} = \Sigma$ 가 시점 불변일 때, 1-layer 선형 conditional autoencoder = IPCA 추정량 (Eq. 17 ↔ Eq. 18 동등).

---

## 11.2 표기와 가정

paper 의 notation 따름:
- $R$: $N \times T$ 수익률 행렬, $\bar R = R - \bar r \iota'$ (cross-time demeaned).
- $R̄ = P̂ \Lambda Q̂$ (SVD; $P̂$: $N \times K$ 좌특이벡터, $Q̂$: $K \times T$ 우특이벡터).
- IPCA 에서 $\Gamma$ 는 $K \times P$ 행렬 (β = Γ z 형태에 맞춤; paper Eq. 2 의 표기 $\beta' = z'\Gamma$ 와 일관 — Γ 는 $P \times K$ in Eq 2 인데 proof 에서는 $K \times P$ 로 표기, paper Appendix A 의 convention 따름).
- $W_0, W_1$: 각각 $K \times P$ 행렬 (autoencoder 의 β-net, f-net 의 마지막 선형 변환).

---

## 11.3 Proposition 1 증명 (Appendix A.2, journal p.447–448)

### 11.3.1 Step 1 — bias $b^{(1)}$ 제거

(8) 의 1차 조건 $\partial / \partial b^{(1)} = 0$:
$$
\hat b^{(1)} = \frac{1}{T}\big( R\iota - T W^{(1)} b^{(0)} - W^{(1)} W^{(0)} R\iota \big).
$$

이를 (8) 에 대입하면 (paper 의 핵심 단순화):
$$
\min_W \big\| R̄ - W^{(1)} W^{(0)} R̄ \big\|_F^2
$$

즉 **bias 가 사라지고 demeaned 문제** 가 됨.

### 11.3.2 Step 2 — Optimal $W^{(0)}$ 

$\partial / \partial W^{(0)} = 0$ 와 $R̄R̄'$, $W^{(1)'} W^{(1)}$ 가 full rank 가정 하에:
$$
\hat W^{(0)} = \big( W^{(1)'} W^{(1)} \big)^{-1} W^{(1)'}.
$$

→ Decoder $W^{(0)}$ 가 encoder $W^{(1)}$ 의 함수로 결정. **Pseudo-inverse 형태**.

### 11.3.3 Step 3 — Reduced Problem

(8) 에 대입:
$$
\min_{W^{(1)}} \big\| R̄ - P_{W^{(1)}} R̄ \big\|_F^2
$$
여기서 $P_{W^{(1)}} = W^{(1)} (W^{(1)'} W^{(1)})^{-1} W^{(1)'}$ 는 $W^{(1)}$ 의 column space 로의 orthogonal projector.

### 11.3.4 Step 4 — Eckart–Young–Mirsky

**Eckart–Young–Mirsky 정리**: Frobenius norm 에서 행렬의 best rank-$K$ 근사는 SVD 의 top-$K$ 항.

→ $P_{W^{(1)}} R̄ = P̂ \Lambda Q̂$ 가 최적. 이는:
$$
W^{(1)} = P̂ \, A
$$
where $A$ 는 임의 $K \times K$ 가역 행렬 (회전 자유도).

증명: $W^{(1)} = P̂$ 면 $P_{W^{(1)}} = P̂(P̂'P̂)^{-1}P̂' = P̂P̂'$ (직교 가정), $P̂P̂' R̄ = P̂P̂' (P̂\Lambda Q̂ + Û) = P̂\Lambda Q̂$. □

### 11.3.5 의의

- $\hat W^{(1)} = P̂ A$ ↔ **PCA 의 좌특이벡터의 회전**.
- $\hat W^{(0)} = (W^{(1)'} W^{(1)})^{-1} W^{(1)'}$ ↔ 그 pseudo-inverse.
- 잠재 요인 $\hat f_t = \hat W^{(0)} r_t$ ↔ **PCA 의 시계열 component**.

→ 1-layer 선형 AE 의 표현 능력 = PCA 의 표현 능력 (회전 무시).

---

## 11.4 Proposition 2 증명 (Appendix A.2, journal p.448–449)

### 11.4.1 가정

$Z'_{t-1} Z_{t-1} = \Sigma$ 가 **시점 $t$ 에 무관 (상수)**. 실증 데이터에서는 cross-sectional rank normalization 으로 거의 만족 (Section 6.2.3).

### 11.4.2 Step 1 — IPCA 의 $f_t$ FOC

(17) 에서 $\partial / \partial f_t = 0$:
$$
\hat f_t = \big( \Gamma\, Z'_{t-1} Z_{t-1}\, \Gamma' \big)^{-1} \Gamma\, Z'_{t-1}\, r_t.
$$

$Z'Z = \Sigma$ 대입:
$$
\hat f_t = (\Gamma \Sigma \Gamma')^{-1} \Gamma\, Z'_{t-1}\, r_t.
$$

이를 (17) 에 plug-in 하면 reduced objective:
$$
\min_\Gamma \sum_t \big\| r_t - Z_{t-1} \Gamma' (\Gamma \Sigma \Gamma')^{-1} \Gamma\, Z'_{t-1}\, r_t \big\|^2. \tag{A.2}
$$

### 11.4.3 Step 2 — Conditional AE (18) 의 $W_1$ FOC

Conditional autoencoder Eq. (18) 의 인풋 $x_t = (Z'_{t-1} Z_{t-1})^{-1} Z'_{t-1} r_t = \Sigma^{-1} Z'_{t-1} r_t$.

Eq. (18) 을 Kronecker product 로 다시:
$$
\sum_t \| r_t - Z_{t-1} W_0' W_1 x_t \|^2 = \sum_t \| r_t - (x'_t \otimes Z_{t-1} W_0') \mathrm{vec}(W_1) \|^2.
$$

$\partial / \partial \mathrm{vec}(W_1) = 0$ 와 $Z'Z = \Sigma$ 대입 후 Kronecker product 의 곱셈성질 적용:
$$
W_1 = (W_0 \Sigma W_0')^{-1} W_0 \Sigma.
$$

### 11.4.4 Step 3 — Reduced Objective for $W_0$

대입:
$$
\min_{W_0} \sum_t \big\| r_t - Z_{t-1} W_0' (W_0 \Sigma W_0')^{-1} W_0\, \Sigma\, x_t \big\|^2. \tag{A.4}
$$

### 11.4.5 Step 4 — 두 식 비교

(A.2) 와 (A.4) 의 비교:
- (A.2) 의 $Z'_{t-1} r_t$ 를 $\Sigma x_t$ 로 치환 ($x_t = \Sigma^{-1} Z' r_t \Leftrightarrow Z' r_t = \Sigma x_t$).
- (A.2) 의 $\Gamma$ 를 $W_0$ 로 치환.

→ 두 objective 가 **identical**. 따라서 같은 최적해.

paper 결론 (journal p.449):
> "We see IPCA and the two-sided Autoencoder have the same objective functions (A.2) and (A.4). The Autoencoder solution and the IPCA solution are identical with Γ = W₀. They give us identical factor estimates $\hat f_t$ and factor loading estimates $\hat \beta_{i,t-1}$." □

### 11.4.6 가정 완화

paper 본문 (412–413):
> "In the general case where $Z'_t Z_t$ is non-constant, the two estimators are similar but no longer equivalent (as we can see from the proof). We find that the empirical performance of (17) and (18) is similar in our data."

→ **실증 데이터에서도 두 추정량의 결과 거의 일치** (Section 6.2.3 의 rank normalize 효과).

---

## 11.5 IPCA 의 식별 제약 (paper footnote 11)

요인 모델의 회전 자유도 해소 위해 KPS / IPCA 가 부과:
$$
\Gamma \Gamma' = I_K, \quad FF' \text{ diagonal with descending diagonal entries}, \quad F\iota \ge 0.
$$

paper 본문:
> "These restrictions place no economic restrictions on the model and solely serve to pin down a uniquely identified solution to the first-order conditions."

→ 세 조건이 합쳐져 **unique identification** 가능 (회전·permutation·sign 모두 고정).

---

## 11.6 두 Proposition 의 핵심 도구 정리

| 도구 | 사용처 |
|------|--------|
| **FOC (Normal equation)** | $\partial \mathcal{L} / \partial W = 0$ 풀어 한 변수 제거 |
| **Trace 성질** | $\mathrm{tr}(ABC) = \mathrm{tr}(BCA)$ |
| **Pseudo-inverse** | $W^{(0)} = (W^{(1)'} W^{(1)})^{-1} W^{(1)'}$ |
| **Eckart–Young–Mirsky** | Frobenius norm best rank-K approx = top-K SVD |
| **Kronecker product** | Conditional AE 의 vec(W₁) 정리 |
| **Gauge fixing** | $\Gamma\Gamma' = I_K$ 등 식별 제약 |

---

## 11.7 본 증명의 실용적 의의

### (1) Numerical 초기값
- $\hat W^{(1)} = P̂$ 형태 → SGD 학습의 좋은 warm start.
- IPCA 의 alternating least squares 의 출발점도 이로 잡을 수 있음.

### (2) 일반화의 base case
- CA0 = IPCA (선형) → CA1, CA2, CA3 의 자연스러운 일반화.
- "Wild ML extension" 이 아닌 "principled extension".

### (3) Cross-method translation
- ML 연구자: "PCA = AE" 로 신경망 도구를 자산가격 잠재 요인 추정에 적용.
- 계량경제학자: "IPCA = linear CA" 로 신경망 일반화를 친숙한 framework 로.

---

## 자기점검 (이 챕터)

### 핵심 3가지
1. Prop 1 증명에서 $b^{(1)}$ 의 FOC 제거 후 문제가 어떻게 단순화되나?
2. Prop 2 가 $Z'Z = \Sigma$ 상수 가정 없이 깨지는 정확한 단계는?
3. 두 증명에서 공통적으로 등장하는 핵심 보조정리는?

### 답변
1. $\hat b^{(1)}$ 의 FOC 를 (8) 에 대입하면 $R$ 대신 $\bar R = R - \bar r\iota'$ (cross-time demeaned) 의 문제가 됨. **bias 가 사라지고**, $W^{(0)}, W^{(1)}$ 만의 문제. 이후 $W^{(0)}$ 의 FOC 로 $W^{(1)}$ 만의 reduced problem 로 환원.
2. Step 1 (IPCA FOC). $Z'_{t-1} Z_{t-1}$ 이 시점에 따라 변하면 $\hat f_t = (\Gamma Z'Z \Gamma')^{-1} \Gamma Z' r_t$ 의 첫 인자가 시점 의존 → $x_t$ 와의 단순한 linear mapping 으로 표현 불가 → conditional AE 의 단일 $W_1$ 로 동일 reduce 불가.
3. **FOC 로 한 변수 제거 → reduced problem 환원**. Prop 1 은 $b^{(1)}, W^{(0)}$ 두 단계 제거 후 Eckart–Young–Mirsky. Prop 2 는 $f_t, W_1$ 제거 후 동일 objective 매핑 확인. 두 증명 모두 **least squares 의 normal equation 을 반복 적용** 하는 기본 패턴.
