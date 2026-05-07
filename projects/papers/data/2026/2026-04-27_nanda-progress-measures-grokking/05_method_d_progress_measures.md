# 4. 방법론 ④ — 세 progress measure 의 정확한 정의와 implementation

> 회로를 알았다면, 이제 회로의 *진행도* 를 잰다. 본 절은 논문의 *방법론적 핵심*. 세 measure 가 각각 *무엇을* 재고 *어떻게 구현* 되는지를 분리.

## 배경 사다리

이 절은 ① **cross-entropy loss 가 logit 의 함수라는 것**, ② **벡터 공간에서 *직교 projection* 이 어떻게 정의되는지** ($\Pi_K v = \sum_{k \in K} \langle v, \chi_k\rangle \chi_k$), ③ **Gini 계수가 [0,1] 의 sparsity 척도** — 이 셋 위에서 작동.

---

## 4.D.1 사전 작업: key frequency 집합 $K$ 의 결정

세 measure 는 모두 $K$ — 회로가 사용하는 5 개 정도의 key frequency — 를 *입력* 으로 받는다. $K$ 결정은:

1. **학습 종료 후** (Fully-grokked 상태) 모델의 임베딩 행렬 $W_E$ 을 Fourier 분해.
2. 각 frequency $k$ 에 대해 *energy* $E_k = \|\hat{W}_{E,k}\|_F^2$ 측정 (Frobenius norm 제곱).
3. Energy 의 큰 순서로 정렬, *지배적인* (보통 5 개) frequency 를 $K$ 로 채택.

$K$ 의 *cardinality* 는 보통 5 개로 fix 되지만, 모델 / seed / hyperparameter 에 따라 달라질 수 있음. 본 논문은 안정적으로 4–6 개 사이 (대표적으로 5 개) 라고 보고.

### 한 가지 중요한 요점

$K$ 는 *학습 trajectory 동안 변하지 않는다고 가정* 됨 — 즉 학습 초기엔 회로가 형성되지 않았어도 $K$ 는 *최종* 회로의 frequency 로 고정. 이게 progress measure 를 학습 초기에도 의미 있게 만든다 (초기엔 모델이 $K$ 를 거의 안 쓰니까 restricted loss 가 random).

그러나 *모델이 학습 도중 다른 frequency 를 사용하다가 K 로 옮겨갔을* 가능성은 본 논문이 명시적으로 다루지 않음. 일부 후속 연구 (Doshi 2024) 에서는 *frequency hopping* 현상을 보고. — 본 해체 §6 한계.

---

## 4.D.2 Restricted loss $\mathcal{L}_{\text{res}}$ — circuit completeness

### 정의

각 학습 step $t$ 에서:

1. 모델 logit $\ell(a, b) \in \mathbb{R}^p$ (test set 의 모든 $(a, b)$ 에 대해) 계산.
2. 각 logit 벡터를 *후보 c 의 함수* 로 보고 $\mathbb{R}^p$ 의 character basis 로 분해:
   $$\ell(a, b) = \sum_{k=0}^{p-1} \hat{\ell}_k(a, b) \chi_k$$
   여기서 $\hat{\ell}_k(a, b) = \frac{1}{p}\sum_c \ell_c(a, b) \chi_k(c)^*$.
3. $K$ 에 속하는 component 만 남기고 나머지를 0 으로:
   $$\ell^{\text{res}}(a, b) = \sum_{k \in K} \hat{\ell}_k(a, b) \chi_k$$
4. 이 *restricted logit* 으로 cross-entropy 계산:
   $$\mathcal{L}_{\text{res}} = -\frac{1}{|D_{\text{test}}|} \sum_{(a,b) \in D_{\text{test}}} \log \mathrm{softmax}(\ell^{\text{res}})_{(a+b) \bmod p}$$

### 의미

만약 모델이 *완전히* $K$ 만 쓴다면 → $\hat{\ell}_k(a,b) = 0$ for $k \notin K$ → restricted logit = original logit → $\mathcal{L}_{\text{res}} = \mathcal{L}_{\text{test}}$.

학습 초기 (memorization phase) 에는 모델이 dense 하므로 $K$ 만 남기면 logit 이 거의 random → $\mathcal{L}_{\text{res}}$ 가 매우 큼 (chance $\log p \approx 4.7$).

학습이 진행되면서 $\mathcal{L}_{\text{res}}$ 는 *단조 감소*. 회로 형성 phase 동안 test loss 는 정체이지만 restricted loss 는 줄어든다 — 이게 *plateau 의 active 성* 입증.

### 구현 디테일

- 매 step 측정은 비용이 큼 (test set 전체 + Fourier 변환). 보통 $\sim 100$ step 마다 sampling.
- 복소수 Fourier 를 쓰지 않고 *실수* basis $\{\cos(\omega_k c), \sin(\omega_k c)\}$ 로 처리하면 efficient (real FFT).
- $K$ 는 학습 종료 후 *post-hoc* 으로 결정되지만, 같은 trajectory 에 대해 한 번만 결정하면 됨.

---

## 4.D.3 Excluded loss $\mathcal{L}_{\text{exc}}$ — circuit non-redundancy

### 정의

위의 절차에서 (3) 단계만 *반대* 로:

$$\ell^{\text{exc}}(a, b) = \sum_{k \notin K} \hat{\ell}_k(a, b) \chi_k = \ell(a, b) - \ell^{\text{res}}(a, b)$$

$$\mathcal{L}_{\text{exc}} = -\frac{1}{|D_{\text{test}}|} \sum \log \mathrm{softmax}(\ell^{\text{exc}})_{(a+b) \bmod p}$$

### 의미

모델이 $K$ 에 의존한다면 $K$ 를 제거했을 때 logit 이 random (또는 anti-correct) → $\mathcal{L}_{\text{exc}}$ 가 *매우 큼*.

학습 초기 모델은 dense 하므로 $K$ 를 제거해도 다른 부분으로 정답을 만들 수 있음 → $\mathcal{L}_{\text{exc}}$ 가 train loss 와 비슷.

학습이 진행되면서 $\mathcal{L}_{\text{exc}}$ 는 *단조 증가* → 회로가 점점 더 $K$ 에 의존.

### Restricted vs Excluded 의 비대칭성

직관적으로 두 measure 는 "거울 상" 이지만 실제로 정보 양이 다르다:

- $\mathcal{L}_{\text{res}}$ 는 회로의 *충분성* — "$K$ 만으로도 답을 낼 수 있는가?"
- $\mathcal{L}_{\text{exc}}$ 는 회로의 *필요성* — "$K$ 가 없으면 답을 낼 수 없는가?"

두 측정 모두 단조라야 회로가 *유일한 generalization 경로* 임이 입증된다. 만약 $\mathcal{L}_{\text{res}}$ 만 단조 감소하고 $\mathcal{L}_{\text{exc}}$ 가 불변 또는 감소하면, 모델이 $K$ + 다른 redundant 회로 *둘 다* 사용 — 회로의 "유일성" 약화.

---

## 4.D.4 Gini coefficient of squared Fourier components $G$ — circuit cleanliness

### 정의

매 학습 step $t$ 에서:

1. 핵심 weight matrix (보통 $W_E$ 또는 MLP 의 $W_{\text{in}}$, $W_{\text{out}}$) 를 Fourier basis 로 분해. 각 frequency $k$ 의 *energy* 측정:
   $$E_k(\theta) = \|\hat{W}_k\|_F^2$$
2. Gini coefficient:
   $$G(\theta) = \frac{\sum_{i,j} |E_i - E_j|}{2 p \sum_k E_k}$$

### 의미

$G \to 0$ — 모든 frequency 가 동일 energy (완전히 균등 dense 가중치). Memorization phase 시그니처.

$G \to 1$ — 한 frequency 만 모든 energy. Sparse Fourier circuit 시그니처. 본 모델은 보통 $G \approx 0.85$ saturated.

학습이 진행되면서 $G$ 는 *단조 증가* — 회로의 sparsification.

### 다른 sparsity 측정과 비교

- **L1/L2 ratio**: $\|E\|_1^2 / (p \|E\|_2^2)$. Gini 와 유사한 정보. Gini 가 [0,1] 로 normalize 되어 phase 비교가 쉬움.
- **Kurtosis**: 분포의 4-차 모멘트. outlier 에 더 민감 — 본 task 에선 5 개 frequency 가 *비슷한 amplitude* 라 kurtosis 가 *너무 일찍 saturate* 함. Gini 가 더 적합.
- **Entropy**: $-\sum p_k \log p_k$ where $p_k = E_k / \sum E$. 이건 Gini 와 거의 같은 정보. 다만 Gini 가 *경제학에서 distribution-free* 인 점에서 더 robust.

### 구현 디테일

- Fourier 분해는 *각 weight matrix 의 axis 하나* 위에서 (vocabulary axis). 즉 $W_E \in \mathbb{R}^{d \times p}$ 의 $p$-axis 에 대해 FFT.
- 매 step 측정 가능 (저렴).
- 학습 동안 *각 weight matrix 별로 다른 Gini* 가 측정됨. 보통 $W_E$ 의 Gini 가 가장 잘 trajectory 를 보여줌.

---

## 4.D.5 세 measure 의 관계

세 measure 는 *상호 보완* 적이며 *하나만으로는 부족*:

| Measure | 잰다 | 단조 방향 | 외부 데이터 의존 | 비용 |
|---|---|---|---|---|
| $\mathcal{L}_{\text{res}}$ | 회로 충분성 (output-side) | 감소 | test set 필요 | 비싸다 |
| $\mathcal{L}_{\text{exc}}$ | 회로 필요성 (output-side) | 증가 | test set 필요 | 비싸다 |
| $G$ | 회로 sparsity (weight-side) | 증가 | weight 만 있으면 OK | 싸다 |

두 loss measure 는 *모델 출력* 의 회로 정합도, Gini 는 *모델 가중치* 의 회로 정합도. 두 영역이 같은 방향으로 단조 변화함을 *교차 검증* 하는 게 본 논문의 핵심 evidence.

---

## 4.D.6 Causal intervention 으로의 확장

세 measure 는 *correlation* 만 측정 — 회로가 진짜 *인과적* 으로 generalization 을 만드는가는 따로 검증해야 한다. 본 논문은 다음 intervention:

1. **Frequency ablation**: 학습 후 모델에서 $k \notin K$ 의 Fourier component 를 0 으로 (즉 $\Pi_K W$ 만 남김). Test acc 가 *유지* 되는가 확인. 결과: 거의 변화 없음 → 회로 *충분성* 인과적 입증.

2. **Key frequency removal**: 반대로 $k \in K$ 의 component 를 0 으로. Test acc 가 *추락* 하는가. 결과: chance level 로 즉시 추락 → 회로 *필요성* 인과적 입증.

3. **Single frequency replacement**: 한 frequency $k$ 의 amplitude 를 0 으로 (다른 4개는 그대로). Test acc 의 *부분적* 추락. 회로의 *분해 가능성* 입증.

이 intervention 들이 progress measure 의 trajectory 가 단순한 *post-hoc artifact* 가 아님을 보장.

---

## 4.D.7 핵심 한 문장 요약

세 progress measure 는 (i) restricted loss 가 회로의 *output 측 충분성*, (ii) excluded loss 가 *output 측 필요성*, (iii) Gini 가 *weight 측 sparsity* 를 분리 측정하며, 셋이 동시에 단조 변화 + causal intervention 으로 검증되는 것이 본 논문의 *반증 가능* 한 epistemic claim 의 핵심.

→ 다음 파일 `05_method_e_implementation.md` 에서 hyperparameter, code, reproduction 디테일.
