# 05 · 방법론 (d) — 뉴런 노름 동학 (SGD + weight decay + hinge 의 결합)

> **배경 사다리**: ① "weight decay" = 매 step 마다 weight 에 $1-\lambda \cdot \text{lr}$ 을 곱하는 정규화 = L2 페널티의 SGD 형태, ② "L2 norm" = 벡터의 길이 $\|v\|_2 = \sqrt{\sum v_i^2}$, ③ "hinge gradient" = margin > 1 이면 0, 아니면 -$y \cdot x$. 이 셋을 잡으면 본 절의 동학이 풀린다.

---

## 1) 왜 노름 동학이 1차 관측 대상인가

본 논문의 핵심 abstract verbatim: "*this subnetwork arises when **a small subset of neurons undergoes rapid norm growth**, whereas the other neurons in the network **decay slowly in norm***." 이 한 문장이 (a) 측정 변수 (norm), (b) 두 집단의 형태 (rapid growth vs slow decay), (c) sparse subnetwork 의 *기원* 을 한꺼번에 지정한다.

→ 측정 primitive 는 단순: 매 epoch 마다 hidden layer 각 뉴런 $j$ 에 대해

$$
\eta_j(t) := \bigl\|\, W_1^{(t)}[j,:] \,\bigr\|_2
$$

를 저장. 시계열 $\{\eta_j(t)\}_{j=1}^{1000}$ 의 분포 진화가 본 논문의 1차 그림.

저자 GitHub 코드의 `--ind-norms` 플래그가 이 측정 → `norms['feats'][epoch]` 딕셔너리 항목으로 저장 → `circuit_discovery_*` 와 `ArityFinder` 가 ranking key 로 사용.

---

## 2) Hinge + SGD + weight decay 의 분석적 형태

학습 update (sample 1 개, lr $\alpha$, weight decay $\lambda$):

$$
W_1^{(t+1)}[j,:] = (1 - \alpha \lambda)\, W_1^{(t)}[j,:] - \alpha \cdot \frac{\partial \ell}{\partial W_1[j,:]}.
$$

hinge loss $\ell = \max(0, 1 - y\hat{y})$ 와 $\hat{y} = w_2^\top \text{ReLU}(W_1 x + b_1)$ 에서, "margin $y\hat{y} \geq 1$" 인 sample 은 gradient = 0. "margin < 1" 인 sample 만 gradient signal 제공. 그 경우:

$$
\frac{\partial \ell}{\partial W_1[j,:]} = -\,y\, w_2[j]\, \mathbb{1}\!\left[\,(W_1 x + b_1)_j > 0\,\right]\, x^\top.
$$

(ReLU 의 derivative 가 indicator 로 등장.)

### 두 집단의 동학 (정성 분석)

#### 집단 A — sparse "성장" 뉴런

- 이 뉴런들은 **자주 ReLU 가 활성** ($(W_1 x + b_1)_j > 0$) 되며, **그 activation 이 logit 의 sign 과 일관** 되게 기여한다.
- 따라서 margin < 1 인 sample 마다 gradient $-y w_2[j] x^\top \cdot \mathbb{1}[\cdot]$ 이 *같은 방향* 으로 weight 를 끌어당김 (gradient signal 의 *coherent superposition*).
- 결과: weight decay 의 $(1-\alpha\lambda)$ 축소를 *압도* 하는 polynomial / exponential 노름 성장 — "rapid norm growth".

#### 집단 B — dense "감쇠" 뉴런

- 이 뉴런들의 ReLU 활성은 *입력 노이즈* 와 거의 비상관, 즉 gradient signal 이 sample 마다 *방향이 무작위*.
- random walk 식 cancellation 으로 net gradient ≈ 0 (긴 평균에서) — 진짜 task signal 을 거의 못 받음.
- 결과: weight decay 의 $(1-\alpha\lambda)^t \approx e^{-\alpha\lambda t}$ 의 거의 순수한 지수 감쇠 — "decay slowly in norm". (lr=0.1, wd=0.01 ⇒ 1 epoch 당 약 0.1% 의 감쇠, 300 epoch 이면 약 $e^{-3.0} \approx 0.05$.)

→ 두 동학의 **시간 척도가 분리** 된다: A 는 $\Theta(\sqrt{t})$ 또는 $\Theta(\exp(\gamma t))$ 식 성장 (gradient 의 coherent 누적), B 는 $\Theta(e^{-\alpha\lambda t})$ 감쇠.

(본 논문 본문 PDF 의 정확한 동학 증명 또는 수치 fit 은 미확인 — 위는 abstract verbatim + 코드 setup 으로부터의 *원리적 재구성*. 단정 안 함, 단 "rapid vs slow" 라는 *방향성* 만 단정.)

---

## 3) 4 줄 해석 (전체 동학)

**수식**: $\dot{\eta}_j(t) \approx -\,\alpha\lambda\, \eta_j(t) + \alpha\,g_j(t)$, where $g_j(t) := \mathbb{E}\!\left[\,\bigl|\,\partial_{W_1[j,:]}\,\ell\,\bigr|\,\right]$ 의 *coherent* 부분.

1. **기호 뜻**: $\eta_j(t)$ — 뉴런 $j$ 의 input-weight L2 노름의 epoch 시계열. $\alpha$ — lr (0.1). $\lambda$ — weight decay (0.01). $g_j(t)$ — gradient 의 *signal* 성분 (cancellation 후 남는 양).
2. **일상 비유**: "은행 계좌 — 매달 자동 이자 차감 (weight decay) + 직장에서 들어오는 월급 (gradient). 월급 = signal 이 *일관* 된 사람은 계좌가 자라고, 월급이 *무작위 +/-* 인 사람은 0 에 수렴."
3. **왜 이 형태**: gradient flow 의 *평균* 동학을 1 차원 ODE 로 환원. coherent signal 이 있으면 fixed point $\eta_j^\star = g_j / \lambda$ 로 수렴, 없으면 0 으로 감쇠. 두 집단의 분리는 $g_j$ 가 bimodal 분포라는 의미.
4. **조심할 점**: $g_j$ 자체가 *시간 의존적* — 다른 뉴런의 weight 가 바뀌면 forward 가 바뀌고, ReLU activation 패턴이 바뀌고, gradient 도 바뀜. 따라서 1 차원 ODE 분리는 진정한 진화의 *초기 근사* 일 뿐, phase transition 의 *sharpness* 는 이 1 차원 식에서 자동으로 나오지 않음 (positive feedback: sparse 뉴런이 자라면 $w_2$ 가 그쪽에 적응 → ReLU 패턴이 더 sparse 쪽 활성 → gradient signal 이 더 강화 — 본 논문의 mechanism 의 *진짜 sharpness 원천*).

---

## 4) Phase transition 의 *왜 sharp 한가* 의 직관

위 ODE 만 보면 노름 분리는 *연속적* 일 텐데 grokking 의 phase transition 은 *급격*. 그 sharpness 의 원천은 두 효과의 *positive feedback*:

1. **출력 layer 의 ranking 적응**: $w_2$ 는 $\text{ReLU}$ 출력 중 logit 에 가장 잘 기여하는 뉴런에 자동으로 가중치를 더 줌. sparse 뉴런이 자라면 $|w_2[j]|$ 도 자라고, 이는 sparse 뉴런의 gradient $-y w_2[j] x^\top \mathbb{1}$ 를 *더 크게* 만들어 다시 그 뉴런의 노름을 키움. *고리* (loop).
2. **margin saturation 의 효과**: hinge 가 margin > 1 인 sample 에서 gradient = 0 → sparse 뉴런이 *generalizing* 회로를 만드는 순간 test sample (학습 분포 밖) 의 margin 이 1 을 넘으면 그 sample 도 학습 신호에서 사라짐. *생산적 학습* 이 끝남. 이 끝나는 시점이 grokking 의 *plateau* 직후.

→ 두 효과의 결합으로 phase transition 은 *불연속* 에 가까운 sharpness 를 갖는다 — 비유: 작은 눈사람이 굴러내려가다 갑자기 가속하는 (positive feedback) 와 산기슭에 닿으면 멈추는 (margin saturation) 결합.

(본 논문이 이 sharpness 의 정량 분석을 했는지는 본문 PDF 미확인. abstract 단편은 "rapid growth" 라는 정성만 단정. 위 직관은 본 환경 합당 추론.)

---

## 5) 대안 — 만약 이렇게 했다면?

| 대안 | 무엇이 달라지나 |
|------|----------------|
| **weight decay = 0** | dense 집단의 감쇠가 사라져 두 집단 분리가 *흐려짐*. 모든 뉴런이 자라거나, gradient cancellation 없는 뉴런만 살아남는 식의 *단일* 동학으로 수렴 가능 — phase transition 의 sharpness 약화 (이는 Power 2022 의 4-phase diagram 에서 weight decay 가 작은 영역이 generalization 으로 안 가는 사실과 일관). |
| **lr 더 작음 (0.01)** | gradient signal 의 누적이 느려져 phase transition 의 *시점* 이 후방으로. 모양 자체는 보존되지만 epoch 수 더 필요. |
| **Adam 사용** | Adam 의 second-moment normalization 이 *모든* 뉴런의 effective gradient 를 비슷한 크기로 만들어 — coherent vs incoherent 의 분리 효과를 약화. 노름 동학의 양극화 흐려짐. |
| **L1 정규화 ($\|W_1\|_1$)** | L1 은 weight 자체를 0 으로 잘라냄 → sparsity 가 *외부 주입*. 본 논문의 의의 ("학습이 자연 sparse 발견") 가 *cheat* 가 됨. L2 weight decay 의 가치는 "dense background + signal-driven survival" 의 *선택압* 을 만든다는 점. |

---

## 6) 핵심 한 문장

> **이 절의 정수**: weight decay 는 dense subnetwork 의 *완만 감쇠 background* 를 만들고, hinge + SGD 는 *coherent gradient* 가 있는 뉴런만 *살아남게* 한다. 두 효과의 결합 + 출력 layer 의 ranking 적응으로 인한 positive feedback 이 grokking 의 sharp phase transition 의 동학 기저다.
