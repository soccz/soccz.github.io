# 05a. Section 2.1 — 표준 Autoencoder + PCA 등가성

> **🧒 한 줄 요약**: 표준 autoencoder. Latent factor extraction. Reconstruction loss.


이 챕터는 신경망 측면에서 가장 중요한 한 발견을 다룬다:
**"One-layer linear autoencoder = PCA"**.

이걸 알면 autoencoder 가 자산가격에 자연스럽게 fit 하는 이유가 명확해진다.

---

## 5a.1 Autoencoder 가 뭔가?

> **원문**: "An autoencoder is a special neural network in which the outputs attempt to approximate the input variables. The input variables pass through a small number of neurons in the hidden layer(s), forging a compressed representation of the input (encoding), which is then unpacked and mapped to the output layer (decoding)."

**한 줄**: **"입력 → 압축 → 복원"**.

```
       Input               Hidden (bottleneck)         Output
     (N차원)        →         (K차원, K << N)        →     (N차원)
       │                          │                         │
       r                       encoded                  r̂ ≈ r
                          (K차원 잠재요인)
```

**핵심 아이디어**:
- bottleneck layer 가 입력보다 **훨씬 작음** (K << N)
- 그래서 네트워크는 **입력의 가장 중요한 패턴만** 그 작은 차원에 압축할 수밖에 없음
- 그 압축된 표현으로 다시 복원하려고 학습 → 자연히 의미 있는 features 학습

**비유**:
- 한 권의 책 (N단어) → 짧은 요약 (K단어) → 그 요약으로 책 복원 시도
- 좋은 요약 = 핵심을 잘 담은 것
- 좋은 autoencoder = 입력의 핵심 패턴 잘 잡은 것

---

## 5a.2 Autoencoder 의 수학 — 일반적인 다층

> **원문**: "Neural network models (including autoencoders) with $L$ hidden layers can be written using the following recursive formula."

각 layer $l$ 에는 $K^{(l)}$ 개 뉴런. 다음 점화식:

$$
r^{(l)} = g\left(b^{(l-1)} + W^{(l-1)} r^{(l-1)}\right) \quad \text{(Eq. 3)}
$$

**기호 뜻**:
- $r^{(l)}$ — layer $l$ 의 출력 ($K^{(l)} \times 1$ 벡터)
- $r^{(l-1)}$ — 이전 layer 의 출력 (layer $l$ 의 입력)
- $W^{(l-1)}$ — $K^{(l)} \times K^{(l-1)}$ weight matrix
- $b^{(l-1)}$ — $K^{(l)} \times 1$ bias vector
- $g(\cdot)$ — **비선형 activation function** (본 논문은 **ReLU** 사용)

**활성함수 (ReLU)**:
$$
g(y) = \max(y, 0)
$$
양수면 그대로, 음수면 0. 신경망의 비선형성을 가능하게 함.

**비유**: 정보가 layer 를 거치면서:
1. 선형 변환 ($Wr + b$) — "정보를 섞기"
2. ReLU — "0 미만은 잘라내기" (sparse 한 표현)

**왜 비선형**:
- $g$ 없으면 그냥 행렬 곱의 연속 → 결국 한 행렬과 동치. 신경망 의미 사라짐.
- $g$ 가 있어야 "여러 층" 이 의미 있는 비선형 매핑.

---

## 5a.3 첫 layer 의 입력 + 마지막 layer 의 출력

**입력 layer ($l = 0$)**:
$$
r^{(0)} = r = (r_1, \ldots, r_N)'
$$
즉 자산 수익률 벡터 자체.

**최종 출력**:
$$
G(r, b, W) = b^{(L)} + W^{(L)} r^{(L)} \quad \text{(Eq. 4)}
$$
이 출력은 입력과 같은 차원 ($N \times 1$).

**비교**:
- 일반 신경망: 입력 → 다른 차원의 출력 (예: classification, regression)
- Autoencoder: 입력 → **같은 차원 (입력 자체 복원)**

→ **목적함수**: $\| r - G(r) \|^2$ 를 최소화하는 $W, b$ 찾기.

---

## 5a.4 Fig. 1 — 표준 Autoencoder 도식

![Fig. 1 — Standard autoencoder](figures/page4_Fig1_autoencoder.png)

*journal p.432 Fig. 1 발췌 — 한 hidden layer 의 autoencoder. 입력과 출력은 동일 차원 (N개 자산), 가운데 hidden layer 는 작은 차원 (K개 잠재요인).*

**구조 해석**:
- 빨간 dots (위·아래) = 입력 / 출력 layer (둘 다 N개 뉴런, 각각 자산 수익률)
- 파란 dots (가운데) = bottleneck (K개 뉴런, 잠재요인)
- 화살표 = weight connections

**Encoder**: 입력 (N차원) → bottleneck (K차원).
**Decoder**: bottleneck (K차원) → 출력 (N차원).
**둘 다 가중치 학습**으로 결정.

---

## 5a.5 정적 선형 요인 모델 — PCA 와 같은 출발

> **원문**: "In this section we explore the connection between autoencoders and PCA."

**정적 선형 요인 모델** (Section 2.1.1):
$$
r_t = \beta f_t + u_t \quad \text{(Eq. 5)}
$$

**기호 뜻**:
- $r_t$ — 자산 수익률 벡터 ($N \times 1$)
- $f_t$ — $K \times 1$ 요인 벡터
- $\beta$ — $N \times K$ 노출도 행렬 (시간 무관)
- $u_t$ — 잔차

행렬 형태 (모든 $t$ 모음):
$$
R = \beta F + U
$$
$R$ 은 $N \times T$, $F$ 는 $K \times T$.

---

## 5a.6 PCA 추정 — SVD

> **원문**: "Following Stock and Watson (2002) and Bai and Ng (2002), a factor model can be estimated with PCA on the covariance matrix of returns."

PCA 의 표준 SVD 분해 (paper Eq. 6):
$$
\bar R = \hat P \Lambda \hat Q + \hat U \quad \text{(Eq. 6)}
$$

**기호 뜻** (journal p.431):
- $\bar R$ — demeaned 수익률 행렬 ($N \times T$, 각 자산의 시간 평균을 뺀 것)
- $\hat P$ — $N \times K$ 좌특이벡터 (paper notation; cf. typical SVD U)
- $\Lambda$ — $K \times K$ 대각 특이값 행렬
- $\hat Q$ — **$K \times T$** 우특이벡터 (paper notation; 이미 transposed form)
- $\hat U$ — 잔차

**일상 비유**: SVD = 행렬을 가장 강한 "방향" 들로 분해.
- $\hat P$ = 자산 공간의 가장 강한 K 방향 (요인 노출도)
- $\hat Q$ = 시간 공간의 가장 강한 K 방향 (요인 시간 시리즈)

**왜 이 형태**:
- 잔차 제곱합 최소화 (Frobenius norm 최소)
- 최적 rank-K 근사 (Eckart-Young 정리)
- Bai-Ng 점근 이론으로 일관성 증명됨

**Centered vs Uncentered PCA** (paper footnote 7):
> "A subtle consideration in estimating asset pricing models with PCA is choosing whether to impose the zero intercept no-arbitrage restriction. Imposing the restriction amounts to applying PCA to the **uncentered second moment matrix** of excess returns, rather than to the (centered) covariance matrix."

→ Standard PCA: demean → covariance matrix → SVD. **No-arbitrage 강제**: demean 안 함 → uncentered second moment $RR'/T$ → SVD. 본 논문은 centered 버전을 baseline 으로 보고, Prop 1 도 centered case 증명 (uncentered case 도 paper footnote 9 에서 "similar" 라고 명시).

---

## 5a.7 핵심 발견 — One-layer linear autoencoder = PCA

> **원문**: "When the autoencoder has one hidden layer and a linear activation function, it is equivalent to the PCA estimator for linear factor models described above."

**One-layer linear autoencoder**:
$$
r_t = b^{(1)} + W^{(1)} \left(b^{(0)} + W^{(0)} r_t\right) + u_t \quad \text{(Eq. 7)}
$$

**기호 뜻**:
- $W^{(0)}$ — $K \times N$ encoder weight (수익률 → bottleneck)
- $W^{(1)}$ — $N \times K$ decoder weight (bottleneck → 수익률 복원)
- $b^{(0)}$, $b^{(1)}$ — bias vectors
- 활성함수 $g$ 가 **identity** (linear) — 비선형성 없음

**최적화 문제**:
$$
\min_{b, W} \sum_{t=1}^{T} \| r_t - (b^{(1)} + W^{(1)}(b^{(0)} + W^{(0)} r_t)) \|^2 \quad \text{(Eq. 8)}
$$

행렬 형태:
$$
\min_{b, W} \| R - (b^{(1)} \iota' + W^{(1)} (b^{(0)} \iota' + W^{(0)} R)) \|_F^2
$$
$\iota$ 는 $T \times 1$ 1-벡터, $\|\cdot\|_F$ 는 Frobenius norm.

---

## 5a.8 Proposition 1 — 등가성

> **원문 (Proposition 1)**: "The optimal solution to (8) is given by:
> $$\hat W^{(1)} = \hat P A, \quad \hat W^{(0)} = (\hat W^{(1)'} \hat W^{(1)})^{-1} \hat W^{(1)'}, \quad \hat b^{(1)} = \bar r - \hat W^{(1)} \hat b^{(0)} - \hat W^{(1)} \hat W^{(0)} \bar r, \quad \hat b^{(0)} = a$$
> where $A$ is any $K \times K$ non-singular matrix, $a$ is a constant scalar, $\bar r$ is the sample average of $r_t$, and $\hat P$ is from Eq. (6)."

**핵심 결론**: 최적 $\hat W^{(1)} = \hat P A$ ↔ PCA 의 좌특이벡터.

**3가지 함의**:
1. **추정된 노출도** = PCA 와 같은 공간 (회전 $A$ 까지)
2. **추정된 요인** $\hat W^{(0)} R$ = PCA 의 요인 같은 것 (회전까지)
3. **잠재요인 모델 추정의 새 framework**: PCA 가 아닌 신경망 최적화로 풀어도 같은 답

→ **증명은 11_appendix_proofs.md** 참조 (Eckart-Young-Mirsky 정리 활용).

---

## 5a.9 왜 이 등가성이 중요한가

> **원문**: "Needless to say, autoencoder models are more general than the linear factor model as they allow for dimension reduction via layers of nonlinear transformations of $r_t$."

**3가지 의미**:

### (a) 신경망 = 자산가격의 자연스러운 확장
PCA = 자산가격 잠재요인 추출의 표준이라면, autoencoder = 그 **자연스러운 비선형 확장**.

### (b) 신경망 도구 (Adam, regularization, batch norm) 적용 가능
PCA 는 closed-form SVD → 정규화·정지·앙상블 같은 ML 도구 적용 어려움.
Autoencoder = gradient descent 학습 → 모든 ML 정규화 도구 그대로.

### (c) 깊이 확장 가능
한 layer linear autoencoder = PCA.
다층 + 비선형 = nonlinear PCA. 더 풍부한 표현력.

**참고**: Hinton-Salakhutdinov (2006, Science) — "Reducing the dimensionality of data with neural networks" — 깊은 autoencoder 가 PCA 압도. 이 논문의 ML 영감.

---

## 5a.10 표준 autoencoder 의 한계

> **원문**: "While the standard autoencoder in (5) is a powerful tool for dimension reduction, it shares the same limitation as PCA that it does not leverage conditioning variables to identify the factor structure, and instead relies only on returns themselves."

**한계**:
- 표준 autoencoder 는 **수익률 $r$ 만** 입력. 자산 특성 $z$ 무시.
- → conditioning information 사용 못 함. KPS 의 강점 (특성 → 노출도) 빠짐.

**해결**: Section 2.2 에서 conditional autoencoder 도입 (chap 05b).

---

## 5a.11 표준 autoencoder vs IPCA — 정합 표

| 항목 | PCA | Standard AE | IPCA (KPS) | Conditional AE (본 논문) |
|------|-----|-------------|------------|---------|
| 차원 축소 | ✓ | ✓ | ✓ | ✓ |
| Covariates 활용 | ✗ | ✗ | ✓ | ✓ |
| 비선형 함수 | ✗ | ✓ | ✗ | ✓ |
| 신경망 학습 도구 | ✗ | ✓ | ✗ | ✓ |
| Closed-form | ✓ (SVD) | ✗ | ✗ (반복) | ✗ |

→ 본 논문 (마지막 열) 이 빈칸 메움.

---

## 5a.12 자기점검 (이 챕터)

### 핵심 3가지
1. **Autoencoder 의 기본 구조 (encoder/bottleneck/decoder)?**
2. **One-layer linear autoencoder 와 PCA 의 관계는?**
3. **표준 autoencoder 의 자산가격 한계는?**

### 답변
1. 입력 (N차원) → encoder → bottleneck (K차원, K<<N) → decoder → 출력 (N차원, 입력 복원). 가중치 학습으로 의미 있는 K 차원 표현 추출.
2. **One-layer linear AE = PCA**. Proposition 1 에서 증명. 최적 decoder weight $\hat W^{(1)} = \hat P A$ (PCA 의 좌특이벡터 × 회전).
3. 표준 AE 는 수익률 $r$ 만 사용, 자산 특성 $z$ 무시. → KPS 의 강점 (특성 → 노출도) 못 얻음. 본 논문 chap 05b 에서 conditional 로 확장.

다음 [05_method_b_conditional_AE.md](05_method_b_conditional_AE.md) — 메인 모델.
