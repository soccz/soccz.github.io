# 11. 부록 — 두 Proposition 의 증명

> Appendix A (journal p.447–449) — Proposition 1, 2 의 수학적 증명.

## 📌 이 챕터를 어떻게 읽나 (수식 못 읽는 사람용 길잡이)

이 챕터는 본 논문의 **수학적 근거** 입니다. 다 이해 안 해도 되는 건 사실이지만, 두 가지만 잡으면 모두 따라올 수 있어요.

**증명이 말하는 것 두 줄로**:
- **Prop 1**: "1층짜리 선형 autoencoder 의 최적해는 PCA 와 똑같다" — 즉 신경망과 통계학의 다리.
- **Prop 2**: "1층짜리 선형 conditional autoencoder 의 최적해는 IPCA 와 똑같다" — 즉 본 논문이 기존 KPS 의 **자연스러운 일반화** 임을 증명.

**증명 안 읽고 싶으면 어디 가야 하나?**
- 두 결론 (위 두 줄) 만 받아들이면 본문 (07, 08, 09, 13) 으로 바로 가도 OK.
- 본 챕터는 "근거를 확인하고 싶은 사람용" 백업.

**아래 증명은 한 줄에 다 풀이가 붙어 있음**. 수식 못 읽어도 풀이만 따라가면 큰 그림 파악 가능.

---

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

### 📖 Prop 1 증명, 직관적으로는 무슨 일?

**증명의 전체 흐름 (수식 없이)**:

```
   [ 1층 선형 autoencoder 의 최적해 찾기 문제 ]
                    │
                    ▼
   Step 1: "bias b 가 답에 안 영향 → 빼자"  (변수 줄이기 #1)
                    │
                    ▼
   Step 2: "decoder W^(0) 가 encoder W^(1) 로 결정 → 빼자" (변수 줄이기 #2)
                    │
                    ▼
   Step 3: "이제 encoder W^(1) 한 변수의 문제만 남음" 
                    │
                    ▼
   Step 4: "이 문제는 'rank-K 로 가장 잘 근사하는 행렬 찾기'" 
                    │
                    │ Eckart-Young-Mirsky 정리 적용
                    ▼
   결론: "답은 PCA 의 top-K 특이벡터" → AE = PCA
```

**일상 비유**: 4 단계가 "**복잡한 문제 → 변수 하나씩 줄여서 → 결국 PCA 와 같다**" 의 패턴. 마치 4 개 미지수 연립방정식을 하나씩 풀어 마지막에 한 변수 식으로 만드는 것.

**핵심 도구 — Eckart-Young-Mirsky 정리란?**
- 일상 비유: "사진 (큰 행렬) 을 단순화 (rank K) 하면서 가장 안 찌그러지게 하려면, SVD 의 가장 큰 K 성분만 쓰면 된다." (jpg 압축 같음)
- 수학: 행렬을 rank K 로 근사하는 모든 방법 중, top-K SVD 성분이 Frobenius norm (제곱오차합) 최소.
- 자산가격에서 의미: "30,000 개 자산을 5 개 요인으로 가장 잘 압축하려면 → 공분산 행렬의 top-5 고유벡터" — 즉 PCA.

---

### 11.3.1 Step 1 — bias $b^{(1)}$ 제거

> **🔑 여기서 일어나는 일**: "bias (절편) 항 $b^{(1)}$ 을 손해 없이 빼버린다". 어떻게? bias 의 최적값을 다른 변수들로 표현 → 식에 다시 대입하면 bias 는 사라지고 **데이터를 평균 뺀 형태 ($R̄$, 'demeaned')** 만 남음. 변수 1 개 줄어든 더 깔끔한 문제로 바뀜.

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

> **🔑 여기서 일어나는 일**: "encoder ($W^{(1)}$) 만 정하면 decoder ($W^{(0)}$) 가 자동 결정됨" 을 보임. **두 변수 중 하나가 다른 하나의 함수** — 변수 1 개 더 줄어듦. 일상 비유: "압축기와 펼침기 둘 중 하나만 정하면 된다 — 다른 하나는 반드시 그 역연산". 결과: pseudo-inverse 형태.

$\partial / \partial W^{(0)} = 0$ 와 $R̄R̄'$, $W^{(1)'} W^{(1)}$ 가 full rank 가정 하에:
$$
\hat W^{(0)} = \big( W^{(1)'} W^{(1)} \big)^{-1} W^{(1)'}.
$$

→ Decoder $W^{(0)}$ 가 encoder $W^{(1)}$ 의 함수로 결정. **Pseudo-inverse 형태**.

### 11.3.3 Step 3 — Reduced Problem

> **🔑 여기서 일어나는 일**: Step 1 + Step 2 결과를 대입하면 **이제 변수는 $W^{(1)}$ 한 개만 남음**. 식 모양은 "**데이터 ($R̄$) 의 어떤 부분공간에 투영** (orthogonal projector $P_{W^{(1)}}$) 한 결과와의 차이를 최소화" — 즉 "**rank-K 부분공간으로 가장 잘 근사하는 문제**". 이게 PCA 가 푸는 문제와 정확히 같은 형태 → Step 4 의 EYM 정리 적용 가능.

(8) 에 대입:
$$
\min_{W^{(1)}} \big\| R̄ - P_{W^{(1)}} R̄ \big\|_F^2
$$
여기서 $P_{W^{(1)}} = W^{(1)} (W^{(1)'} W^{(1)})^{-1} W^{(1)'}$ 는 $W^{(1)}$ 의 column space 로의 orthogonal projector.

### 11.3.4 Step 4 — Eckart–Young–Mirsky

**🔑 Eckart–Young–Mirsky 정리 — 풀어 설명**:

- **무엇**: "행렬을 rank K (낮은 차원) 로 줄이는 모든 방법 중, **SVD top-K 가 가장 손실이 적다**" 라는 1930-1960년대 선형대수 정리.
- **일상 비유**: 1000 픽셀짜리 사진을 100 픽셀로 압축할 때 — 어떻게 압축해야 가장 안 찌그러지나? 답: "가장 강한 100 개 성분만 남기기" → JPG 압축의 수학적 기초.
- **본 증명에서**: 우리는 "수익률 행렬 $R̄$ 를 rank-K 로 압축" 하려고 함. → 최적 압축 = SVD top-K = PCA.

이 정리를 적용하면 ($\bar R$ 의 rank-K 근사 $P_{W^{(1)}} R̄$ 의 최선은):

$$
W^{(1)} = P̂ \, A
$$
where $A$ 는 임의 $K \times K$ 가역 행렬 (회전 자유도).

증명: $W^{(1)} = P̂$ 면 $P_{W^{(1)}} = P̂(P̂'P̂)^{-1}P̂' = P̂P̂'$ (직교 가정), $P̂P̂' R̄ = P̂P̂' (P̂\Lambda Q̂ + Û) = P̂\Lambda Q̂$. □

**한 줄 결론**: 1층 선형 autoencoder 의 최적 가중치 $\hat W^{(1)}$ 는 **PCA 의 top-K 좌특이벡터 $\hat P$ × 회전 $A$**. 회전은 식별 모호성. → **autoencoder = PCA**.

### 11.3.5 의의

- $\hat W^{(1)} = P̂ A$ ↔ **PCA 의 좌특이벡터의 회전**.
- $\hat W^{(0)} = (W^{(1)'} W^{(1)})^{-1} W^{(1)'}$ ↔ 그 pseudo-inverse.
- 잠재 요인 $\hat f_t = \hat W^{(0)} r_t$ ↔ **PCA 의 시계열 component**.

→ 1-layer 선형 AE 의 표현 능력 = PCA 의 표현 능력 (회전 무시).

---

## 11.4 Proposition 2 증명 (Appendix A.2, journal p.448–449)

### 📖 Prop 2 증명, 직관적으로는 무슨 일?

**증명의 전체 흐름 (수식 없이)**:

```
   [ IPCA 가 푸는 문제 (Eq. 17) ]
                    │
                    │ Step 1: f_t 변수 제거 → 한 변수 식으로 reduce
                    ▼
   [ Γ 만의 문제 (A.2) ]
   
   
   [ Conditional AE 가 푸는 문제 (Eq. 18) ]
                    │
                    │ Step 2: W_1 변수 제거 → 한 변수 식으로 reduce
                    │ (Kronecker product 라는 도구 사용)
                    ▼
   [ W_0 만의 문제 (A.4) ]
                    │
                    ▼ Step 3: 두 식이 같다 (Γ = W_0 으로 치환 가능)
   
   결론: IPCA 의 해 = CA0 의 해 → CA0 = IPCA
```

**일상 비유**: 두 명의 요리사 (IPCA, CA0) 가 같은 재료 (데이터) 로 다른 레시피 (Eq 17, Eq 18) 를 따른다고 주장. 증명은 "두 레시피를 단순화하면 똑같은 한 줄 레시피가 나온다" 를 보여줌 → 두 사람이 결국 같은 요리를 만듬.

**핵심 도구 — Kronecker product 이란?**
- 일상 비유: "행렬의 모든 원소를 다른 행렬과 곱한 큰 행렬" — 행렬 안의 행렬을 만드는 곱연산.
- 수학에서 쓰는 이유: $W_1 x_t$ 같은 식을 $\mathrm{vec}(W_1)$ (한 줄로 펴진 벡터) 로 다시 쓰면 표준 선형회귀처럼 풀 수 있음.
- 본 증명에서: $W_1$ 의 FOC 를 vec 형태로 바꿔 깔끔한 closed form 얻기.

**핵심 가정 — $Z'_t Z_t = \Sigma$ 상수**:
- 의미: "특성 행렬 $Z_t$ 의 자기곱이 시점에 따라 변하지 않음".
- 실제로는 거의 만족: 매월 cross-sectional rank normalization 으로 $Z$ 가 항상 $[-1, 1]$ 균등 분포 → $Z'Z$ 가 거의 일정.
- 이 가정이 없으면 두 추정량은 "유사하지만 동일하지 않음" (paper p.412).

---

### 11.4.1 가정

$Z'_{t-1} Z_{t-1} = \Sigma$ 가 **시점 $t$ 에 무관 (상수)**. 실증 데이터에서는 cross-sectional rank normalization 으로 거의 만족 (Section 6.2.3).

### 11.4.2 Step 1 — IPCA 의 $f_t$ FOC

> **🔑 여기서 일어나는 일**: IPCA (Eq. 17) 에서 **$f_t$ 변수를 손해 없이 빼버린다**. 어떻게? $f_t$ 의 최적값을 다른 변수 ($\Gamma$ 와 데이터) 로 표현 → 식에 대입하면 $f_t$ 사라짐. 남은 식은 "**$\Gamma$ 만의 한 변수 문제** (A.2)". 일상 비유: "약점 진단표 (Γ) 만 정하면 시험 난이도 (f) 는 자동 추정".

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

> **🔑 여기서 일어나는 일**: 반대쪽 — CA (Eq. 18) 에서 **$W_1$ 변수를 손해 없이 빼버린다**. 도구는 Kronecker product (행렬의 모든 원소를 다른 행렬과 곱한 큰 행렬) — $W_1 x_t$ 같은 식을 한 줄 벡터로 펴서 표준 선형회귀처럼 풀어 closed form 얻기. 일상 비유: "f-network 의 가중치 ($W_1$) 도 자동 결정 — β-network 의 가중치 ($W_0$) 만 정하면 됨".

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

> **🔑 여기서 일어나는 일**: Step 2 의 $W_1$ 표현을 식 (18) 에 대입 → **$W_0$ 만의 한 변수 문제 (A.4)** 가 됨. CA 의 한 변수 식.

대입:
$$
\min_{W_0} \sum_t \big\| r_t - Z_{t-1} W_0' (W_0 \Sigma W_0')^{-1} W_0\, \Sigma\, x_t \big\|^2. \tag{A.4}
$$

### 11.4.5 Step 4 — 두 식 비교

> **🔑 여기서 일어나는 일**: **결정타** — IPCA 의 한 변수 식 (A.2) 와 CA 의 한 변수 식 (A.4) 이 **같은지 비교**. 두 가지 치환 ($Z'r \leftrightarrow \Sigma x$ 와 $\Gamma \leftrightarrow W_0$) 으로 **완전히 동일** 한 식임을 확인. 결론: 같은 최적해 → CA0 = IPCA.

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

## 11.5-1 📍 본 해체에서 발견한 paper 표기 이슈

> **RPPCA 해체 [05_method_a_objective.md](../2026-05-17_lettau-pelger-rppca/05_method_a_objective.md) 가 paper p.5 의 차원 오류를 잡았듯이, 본 deep dive 도 AE paper 의 표기 불일치를 정직히 지적**.

### 이슈 1 — Γ 의 차원 표기 불일치 (Eq. 2 vs Appendix A.2)

**paper 본문 Eq. (2)** (journal p.430):
$$
\beta(z_{i,t-1})' = z_{i,t-1}' \Gamma
$$

- $\beta$ 가 $K \times 1$ 벡터 → $\beta'$ 는 $1 \times K$ 행벡터
- $z_{i,t-1}$ 가 $P \times 1$ → $z'$ 는 $1 \times P$
- 두 식 양변 같아지려면 $\Gamma$ 는 **$P \times K$**

**그런데 paper Appendix A.2** (journal p.448) 의 Proposition 2 증명에서는:
$$
\hat f_t = \big( \Gamma\, Z'_{t-1} Z_{t-1}\, \Gamma' \big)^{-1} \Gamma\, Z'_{t-1}\, r_t
$$

- $\Gamma\, Z'_{t-1}$ 이 K-차원으로 동작하려면 $\Gamma$ 가 **$K \times P$**
- 즉 Eq. 2 의 정의와 **transpose 관계**

### 본 해체의 처리

| 챕터 | Γ convention | 이유 |
|------|--------------|------|
| 04_factor_model.md (Eq 2 풀이) | **$P \times K$** | paper 본문 Eq. 2 표기 그대로 |
| 05_method_c_IPCA_special.md (Prop 2) | **$K \times P$** | paper Appendix proof convention |
| 11_appendix_proofs.md (이 챕터) | **$K \times P$** | proof 일관성 유지 |
| 12_glossary.md (Γ 항목) | 둘 다 명시 | 독자가 어느 챕터든 따라올 수 있게 |

→ **paper 의 표기를 변경하지 않고, 본 해체가 챕터마다 어느 convention 인지 명시** 하는 방식 선택.

### 이슈 2 — Total R² (Eq 20) 의 분모 정의 모호성

paper Eq. (20):
$$
R^2_{\text{tot}} = 1 - \frac{\sum_{(i,t)\in OOS}(r_{i,t} - \hat\beta'_{i,t-1}\hat f_t)^2}{\sum_{(i,t)\in OOS} r_{i,t}^2}
$$

분모가 **$r_{i,t}^2$** 인지 **$(r_{i,t} - \bar r)^2$** (demeaned) 인지 paper 본문에 명시 안 됨. 표준 R² 정의는 후자지만 paper 식은 전자.

**본 해체의 처리**: paper 원문 그대로 (분모 = $r^2$) 사용. 단 이 점이 R² 값이 약간 더 높아 보일 수 있음을 [07_empirical](07_empirical_R2_sharpe_alpha.md) 의 callout 에서 언급 안 함 — 향후 보강 필요.

### 이슈 3 — paper Algorithm 1 의 batch step h 와 patience p 미명시

[05D Algorithm 1](05_method_d_regularization.md) 의 정확한 $h$ (batch update count between val checks) 와 $p$ (patience) 값이 paper 본문 (Appendix B) 에 명시 안 됨. Online Appendix 또는 저자 코드 (미공개) 에 있을 가능성.

**본 해체의 합리적 추정 + 근거**:

| 모수 | 본 해체 값 | 근거 |
|------|-----------|------|
| $h$ (val check 빈도) | **1 epoch** | ML 표준 (Keras / PyTorch 기본). 자주 체크하면 학습 멈추는 시점 정확, 그러나 연산 비용 증가. 1 epoch 가 sweet spot. |
| $p$ (patience) | **5~10** | 본 코드 예시 = 5. 학계 ML 표준 ([Goodfellow et al. 2016 Deep Learning §7.8]) 권장 5~20. 본 논문 데이터 크기 (T=720 month 정도) 에서 5 가 적절. |
| Total epochs (max) | **200~500** | 보통 early stopping 으로 50~150 epoch 에서 종료. paper 가 명시 안 함. |
| Batch size | **256~1024** | Adam 표준. 본 논문 N≈6,200 cross-section + 18 년 train → 약 100 만 obs → batch 1024 가 합리적. |

→ 위 값들이 paper 와 정확히 일치하는지는 검증 불가지만, **합리적 ML 표준 안에 있음**. 본 논문 결과 재현 시 큰 차이 없을 것으로 추정.

### 이슈 4 — LASSO λ 의 정확한 grid 미공개

paper Section 2.3.2 — "Hyperparameter tuning" 만 언급, $\lambda$ 의 grid 값 미명시.

**본 해체의 합리적 추정 + 근거**:

| 모수 | 본 해체 값 | 근거 |
|------|-----------|------|
| $\lambda$ (LASSO 강도) 단일 추천 | **$10^{-4}$** | Gu-Kelly-Xiu (2019, RFS) 의 supervised ML 논문에서 사용한 비슷한 값. 본 논문이 같은 데이터셋이라 비슷한 scale 추정. |
| $\lambda$ grid (튜닝 시) | **$\{10^{-5}, 10^{-4.5}, 10^{-4}, 10^{-3.5}, 10^{-3}\}$** | 로그 스케일 5 점이 ML 표준. paper Section 2.3.2 의 "validation 으로 tuning" 언급에 부합. |
| 다른 hyperparameters (Adam α, batch size 등) | **표준 default 사용** | $\alpha = 10^{-3}$, batch=1024. paper Algorithm 2 의 명시 default. |

### 이슈 5 — Ensemble 의 정확한 N 미명시

paper 본문 (p.436): "we use multiple random seeds, **say, 10**, to initialize neural network estimation".

→ "**say, 10**" 표현은 권장값일 뿐, 실제 사용한 정확한 N 명시 안 함. 본 해체의 코드 예시는 $N = 10$ 사용.

**ML 표준**: 5~30. 10 이 bias-variance tradeoff 의 일반적 sweet spot.

---

→ **RPPCA 해체와 같이 — 원문을 변경하지 않고, 모호점/표기 차이를 정직히 표시** 하는 학술적 정직성 유지.

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

1. **Prop 1 의 Step 1 — b^{(1)} FOC 제거 후 단순화**:
   - **Step 1 결과**: $\hat b^{(1)} = \frac{1}{T}(R\iota - T W^{(1)} b^{(0)} - W^{(1)}W^{(0)} R\iota)$.
   - **(8) 에 대입**: bias 항이 사라지고 $\min_W \|R̄ - W^{(1)}W^{(0)} R̄\|_F^2$. 여기서 $R̄ = R - \bar r \iota'$ = **cross-time demeaned** 수익률.
   - **의미**: 절편이 자유로우면 데이터 평균을 자동 흡수 → 실제 학습 문제는 **편차** 만 다룸.
   - **다음 단계로의 효과**: 변수가 $W^{(0)}, W^{(1)}$ 둘로 줄어듦. 이후 Step 2 에서 $W^{(0)}$ 도 $W^{(1)}$ 의 함수로 제거 → 최종적 $W^{(1)}$ 한 변수 문제 (Step 3).

2. **Prop 2 가 $Z'Z = \Sigma$ 가정 없이 깨지는 정확한 단계**:
   - **Step 1 (IPCA FOC)**: $\hat f_t = (\Gamma Z'_{t-1}Z_{t-1}\Gamma')^{-1}\Gamma Z'_{t-1}r_t$.
   - **가정 없으면**: 첫 인자 $\Gamma Z'_{t-1}Z_{t-1}\Gamma'$ 가 시점 $t$ 에 따라 변함 → $\hat f_t$ 가 $r_t$ 의 단순한 linear function 아님.
   - **CA0 측 (Step 2-3)**: $W_1 x_t$ 형태 (시점 무관 $W_1$) — IPCA 의 시점 의존 매핑과 매칭 불가.
   - **결과**: 두 식 (A.2) 와 (A.4) 가 더 이상 동일 변환 가능하지 않음.
   - **실증 데이터에서**: cross-sectional rank normalize (Section 6.2.3) 로 $Z'Z$ 가 거의 상수 → 가정 거의 만족 → 두 추정량 거의 동일 (실증 Table 1 의 CA0 ≈ IPCA).

3. **두 증명의 공통 핵심 도구**:
   - **공통 패턴**: **FOC 로 한 변수 제거 → reduced problem 환원** (least squares 의 normal equation 반복).
   - **Prop 1 의 변수 제거 순서**:
     - Step 1: $b^{(1)}$ 제거 (bias 흡수)
     - Step 2: $W^{(0)}$ 제거 (pseudo-inverse)
     - Step 3: $W^{(1)}$ 만의 reduced problem
     - Step 4: Eckart-Young-Mirsky 정리로 풀이 → $W^{(1)} = \hat P A$ (PCA 좌특이벡터 × 회전)
   - **Prop 2 의 변수 제거 순서**:
     - Step 1: IPCA 측에서 $f_t$ 제거 → $\Gamma$ 만의 (A.2)
     - Step 2: CA 측에서 $W_1$ 제거 (Kronecker product 활용) → $W_0$ 만의 (A.4)
     - Step 3-4: 두 식 비교 → identical → $\Gamma = W_0$.
   - **공통 메타 도구**: (a) FOC, (b) Trace 성질, (c) Pseudo-inverse, (d) Kronecker product, (e) Eckart-Young-Mirsky (Prop 1 만), (f) Gauge fixing (식별 제약).
