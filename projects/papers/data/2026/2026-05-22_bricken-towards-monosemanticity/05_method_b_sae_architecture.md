# 4-B. 방법론 해부 — SAE 아키텍처 & 손실함수

> **🧒 한 줄 요약**: W_enc / W_dec / b_enc / b_dec 의 *4-parameter SAE*, decoder column normalization, L1 sparsity loss.


> **배경 사다리**: ① 행렬 곱셈 $Wx$는 입력 $x$를 선형 변환하는 연산. ② ReLU($z$) = $\max(0, z)$는 음수를 0으로 자르는 함수 — 비선형성의 역할은 "이 방향이 활성화됐나?" 판단. ③ L1 정규화는 벡터 원소들의 절댓값 합으로, 많은 원소를 0으로 만드는 희박성을 유도한다. L2(제곱합)와 달리 L1은 정확한 0을 선호한다.

---

## SAE 아키텍처 정의

스파스 오토인코더(SAE)는 두 개의 아핀 변환으로 구성된다.

### 인코더

$$f(x) = \text{ReLU}(W_\text{enc}(x - b_\text{dec}) + b_\text{enc})$$

**수식 해석 (4줄)**:

1. **기호 뜻**: $x \in \mathbb{R}^d$는 원본 MLP 활성화 ($d=512$). $b_\text{dec} \in \mathbb{R}^d$는 디코더 편향 — 인코딩 전에 데이터를 센터링한다. $W_\text{enc} \in \mathbb{R}^{n \times d}$는 인코더 가중치 행렬 ($n = 4096$ 등). $b_\text{enc} \in \mathbb{R}^n$은 인코더 편향. 최종 $f(x) \in \mathbb{R}^n$이 특징 활성화 벡터다.

2. **일상 비유**: 음악의 화음을 개별 악기 소리로 분리하는 것과 비슷하다. $W_\text{enc}$는 "이 음이 바이올린에서 나온 정도를 측정하는 마이크"이고, ReLU는 "측정치가 양수일 때만 켜지는 센서"다. $b_\text{dec}$로 먼저 배경 소음(평균)을 빼고 측정한다.

3. **왜 이 형태**: $(x - b_\text{dec})$로 먼저 센터링하는 이유는 SAE 재구성이 $W_\text{dec} f(x) + b_\text{dec}$ 형태이기 때문 — 디코더가 $b_\text{dec}$를 항상 더하므로, 인코더는 그것을 먼저 빼야 "초과분"만 인코딩할 수 있다. ReLU를 쓰는 이유는 특징 활성화가 음수가 될 수 없도록(개념의 "없음" = 0, "있음" = 양수) 제약하기 위해서다.

4. **조심할 점**: ReLU로 인한 "죽은 특징(dead features)" 문제가 있다 — 학습 초기에 특정 유닛이 항상 0 출력을 내면, gradient가 0이 되어 그 유닛은 영구히 활성화되지 않는다. 이를 막기 위해 저자들은 여러 re-initialization 기법을 사용한다.

---

### 디코더

$$\hat{x} = W_\text{dec} f(x) + b_\text{dec}$$

**수식 해석 (4줄)**:

1. **기호 뜻**: $W_\text{dec} \in \mathbb{R}^{d \times n}$는 디코더 가중치 행렬. 열 $\mathbf{d}_i$ (즉 $W_\text{dec}$의 $i$번째 열)가 특징 $i$의 **방향 벡터(feature direction)**다. $f(x)$는 희박 활성화 벡터. $b_\text{dec}$는 원본 활성화의 평균을 복원하는 편향.

2. **일상 비유**: 영화의 오디오 트랙을 마스터링할 때 "보컬 트랙 × 볼륨 + 베이스 트랙 × 볼륨 + ... + 오프셋"으로 최종 오디오를 만드는 것과 같다. $\mathbf{d}_i$가 트랙 파형이고 $f_i(x)$가 그 트랙의 볼륨이다.

3. **왜 이 형태**: 선형 디코더를 쓰는 이유는 "특징 $i$가 활성화 공간에 어떤 방향으로 기여하는가"를 명확히 정의하기 위해서다. 비선형 디코더를 쓰면 특징과 활성화 공간의 관계가 모호해진다. 또한 특징 방향 벡터 $\mathbf{d}_i$가 단위 노름이 되도록 제약($\|\mathbf{d}_i\|_2 = 1$)하여, 특징 크기가 $f_i(x)$에만 인코딩되도록 한다 — 이것이 없으면 큰 $\|\mathbf{d}_i\|$와 작은 $f_i$가 동등하게 되어 해석이 어렵다.

4. **조심할 점**: 단위 노름 제약은 학습 중 gradient를 복잡하게 만든다 — $W_\text{dec}$ 업데이트 후마다 열들을 재정규화해야 한다. 또한 이 선형 디코더 가정이 실제 활성화 공간의 비선형 구조를 완전히 포착하지 못할 수 있다.

---

## 손실 함수

$$\mathcal{L}(x) = \underbrace{\|x - \hat{x}(x)\|_2^2}_{\text{재구성 손실}} + \underbrace{\lambda \|f(x)\|_1}_{\text{희박성 페널티}}$$

**수식 해석 (4줄)**:

1. **기호 뜻**: $\|x - \hat{x}\|_2^2$는 원본 활성화와 재구성의 L2 제곱 거리 — "얼마나 잘 복원됐나?". $\|f(x)\|_1 = \sum_i |f_i(x)|$는 활성 특징들의 크기 합 — "총 희박성 비용". $\lambda > 0$는 두 목표의 균형을 맞추는 하이퍼파라미터.

2. **일상 비유**: 집 청소 비용(노력) 최소화 문제와 유사하다 — "모든 물건을 창고에 넣으면 집이 깨끗하지만(재구성 완벽), 창고에서 찾기 힘들다. 물건을 너무 많이 꺼내놓으면 찾기 쉽지만(특징 활성화), 집이 지저분하다." $\lambda$는 "어느 정도 지저분함을 허용할 것인가"를 결정한다.

3. **왜 이 형태**: L1 페널티를 쓰는 이유는 L2(제곱합)와 달리 L1은 정확한 0 해를 선호하기 때문이다 — L2는 모든 특징을 작게 만들지만 0을 잘 만들지 않는다. L1는 많은 특징을 정확히 0으로 만들어 진정한 희박성을 유도한다 (이것이 LASSO 회귀와 같은 원리다).

4. **조심할 점**: $\lambda$를 너무 크게 하면 희박성이 과도해져 재구성이 나빠진다 (65% 이하로 떨어질 수 있음). 너무 작으면 특징이 희박하지 않아 단의미성이 약해진다. $\lambda$ 선택이 결과에 민감하게 영향을 미친다.

---

## 딕셔너리 크기 $n$ 의 선택

저자들은 여러 $n$ 값을 시험했다: $n \in \{512, 1024, 2048, 4096, 8192\}$.

- **$n = d = 512$**: SAE가 뉴런과 같은 수의 특징만 사용 — 슈퍼포지션 해소 불가.
- **$n = 4d = 2048$**: 기본적인 분리 시작.
- **$n = 8d = 4096$**: 본 논문의 주요 실험 설정. 512 뉴런 → 4,096 특징.
- **$n = 16d = 8192$**: 더 많은 특징이 나오지만 계산 비용 증가.

주요 발견 (§Feature Properties): 딕셔너리가 클수록 (a) 더 많은 특징이 발견되고, (b) 개별 특징의 활성화 빈도가 낮아지며(더 희박), (c) 해석가능성이 대체로 유지된다. 이것은 슈퍼포지션이 실제로 존재하며, 더 큰 딕셔너리일수록 더 많은 개념을 분리할 수 있음을 시사한다.

→ [해석가능성 평가 프로토콜은 05_method_c_evaluation.md에서 계속]

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Encoder W_enc / Decoder W_dec 의 *4-param 구조*?**
2. **Decoder column normalization 의 *목적*?**
3. **b_enc / b_dec 의 *각각 역할*?**

### 답변

1. **Encoder + Decoder + 2 biases** (paper §2). W_enc ∈ R^{d×n}: residual → feature space. W_dec ∈ R^{n×d}: feature → residual. b_enc: encoder offset. b_dec: *pre-centering* of input (x - b_dec). 4-param 의 *minimal SAE*.

2. **L1 의 정상화**. Decoder column ||w_dec_i|| 이 *임의 scale* 이면 z 의 magnitude 도 *임의 scale* → L1 penalty 의 *effective strength* 가 *feature-dependent*. Normalization (||w_dec_i|| = 1) → z 의 *true magnitude* 만 penalize → *fair sparsity* across features.

3. **b_enc = bias 의 ReLU shift**. ReLU(x_centered @ W_enc + b_enc) 의 b_enc = *activation threshold*. b_enc > 0 → feature *easier to activate*. b_dec = decoder의 *additive offset* — residual 의 *baseline value*. 각각 *encode threshold* + *decode baseline*.


```viz:bricken-sae-training:title=paper §3 — SAE Training Dynamics,caption=Resample on/off toggle.
```
