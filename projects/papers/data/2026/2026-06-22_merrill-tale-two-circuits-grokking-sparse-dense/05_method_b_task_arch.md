# 05 · 방법론 (b) — Sparse parity 와 FF1 아키텍처

> **배경 사다리**: ① "parity (패리티)" = ±1 또는 0/1 비트들의 곱 (또는 XOR), ② "DNF (Disjunctive Normal Form, 논리합 정규형)" = 논리식을 "OR (AND (…), AND (…), …)" 형태로 정규화한 형식 — 진리표를 직접 합으로 변환한 표준형, ③ "hinge loss" = SVM 에서 쓰는 "정답이면 0, 틀리면 거리만큼 페널티" 형태의 손실. 이 세 개념을 잡으면 본 절은 풀린다.

---

## 1) Sparse parity 의 형식 정의

논문은 다음 합성 task 를 사용한다 (저자 GitHub `utils.py` 의 `parity()` 함수 verbatim 으로부터 추적):

$$
x \sim \text{Uniform}(\{-1, +1\}^n), \quad y = \prod_{i=1}^{k} x_i \in \{-1, +1\}.
$$

- $n$: 입력 비트 수, 디폴트 **40**.
- $k$: parity 의 비트 수 (target 의 dependency arity), 디폴트 **3**.
- 분포: 각 비트 독립적으로 균등 ±1.
- target: **앞 $k$ 비트의 곱** (코드 verbatim: `targets = torch.prod(samples[:, :k], dim=1)` — 주석에 "parity hidden in first k bits" 표기. 다른 위치 변형으로 `samples[:, n//2:n//2+k]` 도 주석 처리되어 있음).

이 task 의 핵심 특성:

| 특성 | 의미 |
|------|------|
| **Sparse dependency** | target 은 $n=40$ 비트 중 $k=3$ 비트에만 의존. 나머지 37 비트는 *분포적으로 noise* . |
| **Boolean exact** | output 이 ±1 이산 — sign 으로 평가. soft margin 학습 가능. |
| **Combinatorial enumeration** | 가능한 입력 $2^{40} \approx 10^{12}$ 개, 학습 sample $N=1000$ — train set 은 **input space 의 거의 0%**. 일반화는 정확히 sparse rule 을 찾아야만 가능. |
| **DNF representable** | $k$-bit parity 는 $2^k$-항 DNF 로 정확 표현 가능. ReLU MLP 의 표현력으로 width 1000 안에서 *여유롭게* fit. |

### 4 줄 해석 (수식)

**수식**: $y = \prod_{i=1}^{k} x_i$

1. **기호 뜻**: $x_i \in \{-1,+1\}$ — $i$ 번째 비트. $\prod$ — 곱 연산. $y$ — target ±1.
2. **일상 비유**: "버튼 3 개가 있다. 각 버튼은 +1 (켜짐) / -1 (꺼짐). 3 개 모두 +1 이거나 정확히 2 개가 -1 일 때 신호등이 켜진다 (= y=+1). 나머지는 꺼진다 (= y=-1)." — XOR 게이트의 ±1 버전.
3. **왜 이 형태**: parity 는 **선형 분리 불가능** 한 가장 단순한 Boolean 함수. 1-hidden-layer ReLU 는 표현 가능하지만 minimum width 가 $2^k$ 근처. 따라서 width 1000 인 모델이 "당첨 sparse subnetwork" 를 자연 발견할 substrate 로 이상적. (다른 합성 task 인 modular addition 은 group-theoretic 구조라 Fourier circuit 으로 다른 해석 필요.)
4. **조심할 점**: $n$ 이 크고 $k$ 가 작아야 **sparse-dense 격차** 가 명확. $k=n$ 이라면 모든 비트가 의존성이라 sparsity 가 정의 안 됨. 또한 $k$ 가 너무 작으면 (예: $k=1$) sparse subnetwork 이 trivial (1 뉴런) 이 되어 dense 와의 경쟁 자체가 약함. $k=3, n=40$ 은 phenomenon 을 살리는 sweet spot.

---

## 2) FF1 아키텍처

저자 GitHub `utils.py` 의 `FF1` class **verbatim**:

```python
class FF1(torch.nn.Module):
    def __init__(self, input_dim=40, width=1000):
        super(FF1, self).__init__()
        self.linear1 = torch.nn.Linear(input_dim, width)
        self.activation = torch.nn.ReLU()
        self.linear2 = torch.nn.Linear(width, 1, bias=False)

    def forward(self, x):
        x = self.linear1(x)
        x = self.activation(x)
        x = self.linear2(x)
        return x

    def masked_forward(self, x, mask):
        x = self.linear1(x)
        x = self.activation(x)
        x = x * mask
        x = self.linear2(x)
        return x
```

수학으로 정리하면:

$$
\hat{y}(x) = w_2^\top \, \text{ReLU}(W_1 x + b_1).
$$

- $W_1 \in \mathbb{R}^{1000 \times 40}$: 첫 번째 행렬.
- $b_1 \in \mathbb{R}^{1000}$: bias.
- $w_2 \in \mathbb{R}^{1000}$: 두 번째 layer (bias 없음 — 이게 분석에 결정적, 아래 설명).
- $\text{ReLU}(z) = \max(z, 0)$, element-wise.

### 왜 "두 번째 layer bias 없음" 이 중요한가

`Linear(width, 1, bias=False)` 의 선택은 두 가지 효과를 만든다.

(i) **scale 동형성**: 모든 뉴런 $j$ 의 (input weight $W_1[j,:]$, output weight $w_2[j]$) 쌍이 $(\alpha W_1[j,:], w_2[j]/\alpha)$ 로 재척도되어도 forward 가 보존됨 ($\text{ReLU}$ 가 positive homogeneous). 이 동형성 덕에 "어떤 뉴런이 logit 에 얼마나 기여하는가" 의 측정이 *기능적으로* 정의 가능 (개별 노름 vs 결합 노름).

(ii) **logit 의 영점 일관성**: bias 가 없으면 $\hat{y}(0) = 0$ — 모든 입력이 0 이면 출력도 0. parity target 은 입력의 곱이므로 입력이 균형 잡힌 ±1 일 때 mean 0 — bias 없는 readout 이 task 의 대칭성과 일관.

(iii) **마스킹의 의미 명확화**: `masked_forward(x, mask)` 가 hidden activation 에 mask 를 곱하는데, bias 가 있다면 마스킹 후 readout 이 bias 만으로 비-trivial 한 값을 낼 수 있어 "0 일치성" 이 깨짐. bias 없는 readout 으로 *마스킹 = 그 뉴런 완전 제거* 가 됨.

### 4 줄 해석 (수식)

**수식**: $\hat{y}(x) = w_2^\top \, \text{ReLU}(W_1 x + b_1)$

1. **기호 뜻**: $x$ — 입력 ±1 벡터 (40 차원). $W_1, b_1$ — hidden 층 weight·bias. $\text{ReLU}$ — 음수는 0, 양수는 그대로. $w_2$ — readout 가중치 (1000 차원). $\hat{y}$ — 스칼라 logit (sign 으로 분류 결정).
2. **일상 비유**: "1000 명 패널이 각자 40 개 비트를 본 뒤 'GO/STOP' 을 외친다 (ReLU). 'GO' 의사들의 표를 $w_2$ 라는 가중치로 합산하여 최종 결정." Bias 가 없는 합산이라 모든 패널이 침묵하면 (모두 ReLU=0) 결정은 0.
3. **왜 이 형태**: 가장 단순한 universal approximator. attention/residual/normalization 없음 → 결과가 architecture 의 특수 효과로 환원되지 않음. width 1000 은 ground-truth DNF (6~8 뉴런) 의 100 배 이상 과대 — 학습이 자연히 sparse subnetwork 를 *발견* 할 여유.
4. **조심할 점**: 이 단순성이 "결과의 일반성" 의 *상한* 도 정한다. transformer (attention + LN + residual) 에서 같은 두-circuit 경쟁이 발생하는지는 *별개 검증* 이 필요 — 본 논문은 약속하지 않음.

---

## 3) Hinge loss

코드 verbatim (`utils.py` 의 `MyHingeLoss`):

```python
class MyHingeLoss(torch.nn.Module):
    def forward(self, output, target):
        hinge_loss = 1 - torch.mul(torch.squeeze(output), torch.squeeze(target))
        hinge_loss[hinge_loss < 0] = 0
        return hinge_loss
```

수학:

$$
\ell(\hat{y}, y) = \max\bigl(0,\ 1 - y\hat{y}\bigr).
$$

### 4 줄 해석

1. **기호 뜻**: $y \in \{-1,+1\}$ target. $\hat{y} \in \mathbb{R}$ logit. $\ell$ — sample 별 손실 (≥0).
2. **일상 비유**: "정답 ($y$=+1) 인데 모델이 +0.5 만 출력하면, '1 만큼 자신 있게 외쳐야 하는데 0.5 부족' → loss = 0.5. 모델이 +1 이상으로 자신 있으면 loss = 0. 음수면 페널티." — SVM 식 margin 손실.
3. **왜 이 형태**: cross-entropy 는 softmax 가 noisy / saturating 효과를 만들어 노름 시계열을 흐림. hinge 는 "margin > 1 인 sample 은 gradient 가 0" 이므로 *외운 sample 들* 이 더 이상 weight 를 끌어가지 않음 → 새 데이터의 학습 신호가 남은 noise 와 weight decay 의 *직접 대결* 로 단순화. 노름 양극화 동학을 가장 깨끗이 만들어 준다.
4. **조심할 점**: hinge loss 의 sparse-gradient 효과는 phase transition 의 발생 *시점* 에 직접 영향. cross-entropy 로 바꾸면 phase transition 모양이 부드러워지거나 늦어질 수 있어, 결과의 *시간 좌표* 는 hinge 특화. 회로 경쟁 자체의 *질적 결론* 은 유지될 가능성이 높지만, *정량적* 비교는 task-loss 쌍에 의존.

---

## 4) 대안 — 만약 이렇게 했다면?

| 대안 | 무엇이 달라지나 |
|------|----------------|
| **transformer 대신 사용** | attention 의 head-별 회로 (Wang IOI, Conmy ACDC 식 분석) 이 가능해짐. 본 논문의 노름 ranking primitive 는 head-level 로 옮기면 *head 의 노름* 이 ranking key 가 됨. transformer 도 sparse-dense 경쟁 보일지 추가 검증 필요. |
| **modular addition (Nanda 2023 task)** | Fourier basis 가 ground-truth — DNF 와는 다른 회로 구조. 본 논문 frame 의 "sparse" 정의가 *frequency channel sparsity* 로 옮겨감. |
| **Adam 대신 SGD** | 본 논문이 이미 SGD. Adam 으로 바꾸면 노름 동학이 흐려져 sparse-dense 분리가 약해질 가능성 → 회로 경쟁 결론의 *관측가능성* 이 약해질 수 있음. |
| **Cross-entropy 대신 hinge** | 본 논문이 hinge. CE 로 바꾸면 softmax saturation 으로 sparse 뉴런의 노름 폭발이 완화되어 phase transition 이 *덜 sharp* 해질 수 있음 (Power 2022 의 modular task 가 CE 임에도 phase transition 보이는 점은 task 의 grokking-prone 한 성질 자체가 더 결정적임을 시사). |

---

## 5) 핵심 한 문장

> **이 절의 정수**: sparse parity + FF1 + hinge 는 "회로 경쟁 동학을 *가장 또렷이* 보기 위한 광학" 이다. task 의 ground-truth sparsity (=k) 와 모델 width 의 격차 (1000 vs ~8) 가 sparse subnetwork 의 *자연 발견* 을 가능하게 하고, bias 없는 readout 과 hinge 의 결합이 *마스킹·노름 측정* 의 의미를 깨끗이 만든다.
