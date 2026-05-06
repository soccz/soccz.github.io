# 3. 핵심 Claim 해체 (b) — Progress measure & 3단계 동학

## Claim 2. 회로 진행도는 train/test loss 가 평탄한 plateau 구간에서도 *단조* 변화한다 — 적절한 척도로 보면 그로킹의 "지연" 은 환상이다

### 주장 (한 문장)

세 progress measure — restricted loss $\mathcal{L}_{\text{res}}$, excluded loss $\mathcal{L}_{\text{exc}}$, Fourier component 의 Gini 계수 $G$ — 이 *learning trajectory 전체에 걸쳐 단조 (또는 거의 단조) 변화* 하며, train/test loss 의 plateau 가 사실은 *active 한 회로 형성 시간* 임을 드러낸다.

### 세 progress measure 각각

#### (i) Restricted loss $\mathcal{L}_{\text{res}}$ — circuit completeness

**정의 발상**: 만약 모델이 진짜 5개 key frequency $K$ 만 쓴다면, 모델 logit 을 $K$ 에 대응하는 Fourier subspace 로 *projection* 한 것만 봐도 같은 정확도가 나와야 한다. 즉 *불필요한 다른 frequency 들을 제거해도* loss 가 변하지 않아야 한다.

**수식**:
$$\mathcal{L}_{\text{res}}(\theta) = \mathcal{L}\bigl(\Pi_K \cdot \text{logit}_\theta(a, b)\bigr)$$

여기서 $\Pi_K$ 는 5개 key frequency 의 Fourier basis 로의 직교 projection.

**기호 뜻**: $\theta$ 는 모델 파라미터, $\text{logit}_\theta(a,b) \in \mathbb{R}^p$ 는 입력 $(a, b)$ 에 대한 logit 벡터, $\Pi_K$ 는 frequency $k \in K$ 의 character $\chi_k(c) = e^{i\omega_k c}$ 들이 span 하는 부분공간으로의 projection. $\mathcal{L}$ 은 cross-entropy.

**일상 비유**: 5개 시계만 보고 답을 맞히려 했을 때 정답률. 모델이 정말 5개 시계만 쓴다면 *그것들만 봐도* 다 맞혀야 한다.

**왜 이 형태**: projection 후 loss 가 원래 loss 와 같다 ⟺ 모델이 사용하는 정보가 $\Pi_K$ subspace 안에 있다는 *충분조건* 의 측정. 학습 초기에는 모델이 dense memorization 을 하고 있어 $\mathcal{L}_{\text{res}}$ 가 매우 큼 (key frequency 만 보면 거의 random). 학습이 진행되면서 $\mathcal{L}_{\text{res}}$ 가 단조 감소 → cleanup phase 에서 원래 $\mathcal{L}_{\text{train}}$ 와 거의 같아짐.

**조심할 점**: $K$ 를 *학습 종료 후* 발견된 5개 frequency 로 정의해야 함. 학습 도중에 $K$ 를 매 step 다시 추정하면 measure 자체가 noisy 해짐. 즉 본 measure 는 *post-hoc 으로 회로를 알고 있는 상태에서* 학습 trajectory 를 재해석하는 척도. — 이게 **post-hoc 의심을 받기 쉬운 부분이고, §6 한계** 에 명시.

#### (ii) Excluded loss $\mathcal{L}_{\text{exc}}$ — circuit non-redundancy

**정의 발상**: 반대 측정. 만약 모델이 진짜 $K$ 에 의존한다면, $K$ 를 *제거* 했을 때 loss 가 *폭발* 해야 한다.

**수식**:
$$\mathcal{L}_{\text{exc}}(\theta) = \mathcal{L}\bigl((I - \Pi_K) \cdot \text{logit}_\theta(a, b)\bigr)$$

**기호 뜻**: $(I - \Pi_K)$ 는 $K$ 를 *제외한* 보집합 subspace 로의 projection.

**일상 비유**: 5개 시계를 *가린* 채로 답을 맞히려 할 때 정답률. 모델이 5개 시계에 의존한다면 — 가렸으니 못 맞혀야 한다.

**왜 이 형태**: Restricted loss 와 *상보적* — restricted 가 "충분성", excluded 가 "필요성" 측정. 회로의 *충분성+필요성* 양면 검증.

**조심할 점**: 학습 초기 (memorization phase) 에는 $\mathcal{L}_{\text{exc}}$ 도 작음 — 모델이 *전 frequency 에 걸쳐 dense 하게 외움* 으로 $K$ 를 빼도 다른 부분으로 정답을 만듬. 학습이 진행되며 $\mathcal{L}_{\text{exc}}$ 가 *증가* (더 의존적이 됨). 즉 train/test loss 와 다른 방향의 단조성을 보여줌. 이게 *plateau 에서도 학습이 진행 중* 의 강한 증거.

#### (iii) Gini coefficient of squared Fourier components $G$ — circuit cleanliness

**정의 발상**: 모델 weight matrix 들 (특히 embedding $W_E$, MLP 의 input projection $W_{\text{in}}$ 등) 의 *Fourier 분해* 를 했을 때, energy ($|\hat{W}_k|^2$, k 번째 frequency component 의 Frobenius norm 제곱) 가 얼마나 *소수 frequency 에 집중되는가*.

**수식**:
$$G(\theta) = \frac{\sum_{i=1}^{p} \sum_{j=1}^{p} \bigl| \, |\hat{W}_i|^2 - |\hat{W}_j|^2 \, \bigr|}{2 p \sum_{k=1}^{p} |\hat{W}_k|^2}$$

(표준 Gini 계수의 squared Fourier components 위 정의.)

**기호 뜻**: $\hat{W}_k$ 는 weight matrix 의 $k$-번째 frequency component, $G \in [0, 1]$ — 0 이면 완벽 균등 (모든 frequency 동일 energy), 1 에 가까우면 한 frequency 만 모든 energy 차지.

**일상 비유**: 한 사람이 100 명의 친구에게 돈을 분배한다. *모두에게 똑같이* 주면 Gini=0 (memorization), *5명에게 몰아주고 나머진 한 푼도 안 주면* Gini ≈ 0.95 (Fourier circuit). 학습 진행이 곧 자원 집중.

**왜 이 형태**: sparsity 의 단일 scalar 측정. L1/L2 ratio 같은 다른 sparsity 척도도 가능하지만, Gini 가 *경제학에서 검증된* 분포 집중도 척도이고 [0,1] 로 normalize 되어 있어 phase 들 간 비교가 쉬움.

**조심할 점**: Gini 는 "5개에 집중" 과 "10개에 집중" 을 잘 구분 못 함 (둘 다 G 큼). frequency 개수 자체를 알고 싶으면 별도로 thresholding 필요.

### 진행도들의 동시적 거동 (Claim 의 진짜 무게)

세 measure 가 *세 시점 모두* 단조 변화하면 — 학습이 plateau 에서도 active 하다는 강한 증거. 본 논문 Figure (보통 Figure 2 또는 3) 가 이걸 시각적으로 보여준다 — train/test loss 는 평탄한데 progress measure 들은 단조. 이게 이 논문의 *gestalt-shift* 발견.

---

## Claim 3. 학습은 3단계 — Memorization / Circuit formation / Cleanup — 으로 분해되며, "그로킹의 갑작스러움" 은 cleanup phase 의 표면적 발현이다

### 주장 (한 문장)

학습 곡선의 timeline 은 (i) train loss 급락기, (ii) 두 종류 가중치 (memorization + Fourier circuit) 가 *공존* 하는 plateau, (iii) weight decay 가 memorization 가중치를 우선 제거하는 cleanup 으로 분해된다.

### 세 phase 의 정량적 시그니처

| Phase | Train loss | Test loss | Restricted loss | Excluded loss | Gini |
|---|---|---|---|---|---|
| Memorization | ↓ (급락) | ↑ 또는 정체 (high) | high (~ random) | low (모델이 dense) | low (균등) |
| Circuit formation | flat near 0 | high but slowly ↓ | 단조 ↓ | 단조 ↑ | 단조 ↑ |
| Cleanup | flat near 0 | sudden ↓ | ≈ train loss | very high | 큰 값 saturate |

### 왜 plateau 가 "보이는" 것인가

Plateau 동안 train loss 는 0 에 가깝고 test loss 는 평탄. *외부 관찰자* 는 학습이 멈춘 줄 안다. 그러나 내부에서는:
1. **Memorization 가중치** (dense, 모든 frequency 에 분산) 는 weight decay 에 의해 천천히 줄어든다. norm 이 큰 가중치일수록 더 많이 줄어듦 — L2 weight decay 의 동학.
2. **Circuit 가중치** (sparse Fourier) 는 *동일 weight decay 압력 아래에서도* train loss 를 유지하는 *효율적 해* 라 상대적으로 천천히 줄어든다 (오히려 회로가 정렬되며 일부 amplitude 는 증가).

이 둘 사이의 *cleanup time scale 비대칭* 이 grokking 의 본질. 즉 "느린 generalization" 이 아니라 "느린 memorization 제거".

### 숨은 전제 

1. **Two-circuit superposition 가정** — phase 2 에 두 가중치가 공존한다는 모델은 *분해 가능* 함을 가정한다. 실제 모델 가중치는 둘이 *얽혀* 있을 수 있고, 그럼 cleanup 이 깔끔히 일어나지 않을 수도 있다.
2. **Weight decay 가 dominant 한 force** — Adam 같은 adaptive optimizer 는 effective learning rate 가 layer/parameter 별로 다르기에 cleanup 시간상수가 단순한 weight decay 율로 결정되지 않을 수 있다. 본 논문은 AdamW 를 사용 — decoupled weight decay — 라서 이 가정이 성립.
3. **Train data 가 회로의 *모든 frequency* 를 cover 함** — train fraction 이 너무 작으면 일부 frequency 가 학습되지 못해 회로가 형성될 수 없음. Power 2022 도 train fraction 이 critical threshold 아래면 grokking 이 안 일어남을 보임.

### 쉬운 말 풀이

학생이 시험 대비를 한다고 하자. 
- 1단계: 답을 통째로 외운다 (memorization). 외운 답은 시험에 나오면 맞히지만, 응용 문제는 못 푼다.
- 2단계: 외운 답이 머릿속에 남아 있는 *동시에*, 천천히 *원리* 를 깨닫기 시작한다 (circuit formation). 겉으로는 응용 문제도 여전히 못 풀지만 (외운 답이 너무 강하게 남아 있어 원리가 잘 안 동원됨), 머릿속에서는 원리가 자라고 있다.
- 3단계: 시간이 지나면서 외운 답이 자연스럽게 잊혀진다 (cleanup, weight decay 비유). 외운 답이 사라지면 *원리만 남고*, 그 순간 응용 문제도 다 풀린다.

→ 그로킹의 "갑작스러움" 은 *원리 깨달음* 이 갑작스러운 게 아니라, *외운 답이 사라지는 순간에야 원리가 표면에 드러나기 때문*.

---

## Claim 2-3 종합 함의

이 두 claim 으로 본 논문은 grokking 을 다음과 같이 *재정의* 한다:

> 그로킹 = (느린 회로 형성) + (그것보다 빠른 train loss 수렴) + (둘 사이의 weight cleanup 시간 비대칭)

이 정의는 *측정 가능* 하며 *반증 가능* 하다. progress measure 가 단조가 아니거나, weight decay 를 0 으로 두면 grokking 이 사라지거나 — 모두 실험적으로 검증 가능. 그래서 이 논문이 후속 연구의 *기본 frame* 이 됐다.
