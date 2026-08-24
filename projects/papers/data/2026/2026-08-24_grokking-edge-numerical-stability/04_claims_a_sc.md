# 3. 핵심 Claim 해체 (a) — Softmax Collapse

> **배경 사다리**: ① 손실의 기울기(gradient)가 0 이면 그 샘플은 학습에 아무 기여도 하지 못한다. ② float32 는 유효숫자를 약 7자리만 저장하고, 두 수의 크기 차이가 $2^{-23}$ 배(머신 엡실론)보다 벌어지면 덧셈에서 작은 쪽이 통째로 사라진다. 이 두 사실이 만나는 지점이 이 절의 전부다.

---

## Claim 1 — 무정규화 그로킹 과제에서 학습이 멈추는 것은 부동소수점 흡수 오차(Softmax Collapse) 때문이다

**주장 (한 문장)**: 모델이 훈련 데이터를 충분히 자신 있게 맞히면 소프트맥스 분모가 정답 항 하나로 흡수되어 손실이 **정확히 0** 이 되고, 그 샘플의 기울기가 소멸해 학습이 정지한다.

**증거 (원문 위치)**:
- **§3.1 "Softmax Collapse"** — 조건식 **(2)**: $\sum_{k=1}^{n} e^{z_k} \doteq e^{z_y}$
- 결과식 **(3)**: $\mathcal{L}_{SCE}(f(x),y) \doteq -\log\left(e^{z_y}/e^{z_y}\right) = 0$
- 결과식 **(4)**: $\partial \mathcal{L}_{SCE}/\partial z_c = e^{z_c}/\sum_k e^{z_k} - \mathbb{1}\{c=y\} \doteq 1 - \mathbb{1}\{c=y\}$
- **§3.2 "Evidence of Softmax Collapse in grokking tasks"** — 저자 요지: 일반화는 SC 가 시작될 때 멈추고, 그 시점은 float64 보다 **float32 에서 더 이르다**.
- **Figure 2** 캡션 verbatim: "As dataset size increases (subplots a to c), MLPs trained on modular addition begin to generalize without regularization until this is stopped by SC making the gradient from a large fraction of the samples equal to zero. This stopping point comes earlier for $\mathrm{float32}$ than $\mathrm{float64}$ and with small enough datasets it comes before the model makes any progress on test accuracy."

**숨은 전제**:
1. **손실이 0 이면 곧 기울기가 0 이다**는 연결이 성립하려면, 문제의 흡수가 **정답 클래스 쪽**에서 일어나야 한다. 식 (4)의 $\doteq$ 는 정답 클래스에서 기여가 $1-1=0$ 이 되는 상황을 가리킨다. 오분류 샘플에서는 SC 가 다른 형태로 나타날 수 있는데 원문은 그 대칭적 경우를 주된 분석 대상으로 삼지 않는다.
2. **정밀도 대조(float32 vs float64)가 결정적 증거로 성립하려면** 두 실행이 정밀도 외 모든 조건에서 동일해야 한다. 실무적으로 정밀도 변경은 옵티마이저 내부 누적, 난수 소비 경로까지 바꿀 수 있다 — 원문이 이 통제를 어떻게 했는지는 본 실행에서 확인한 범위에 명시적으로 나오지 않는다(**원문 확인 범위 밖**).
3. 이 주장은 **분류(cross-entropy) 설정**에 매인다. 회귀 손실(MSE)에는 소프트맥스 분모가 없으므로 SC 라는 사건 자체가 없다 — 저자들도 §5.2 에서 이 점을 명시적으로 활용한다.

**쉬운 말 풀이**: 계산기로 `1000000 + 0.0001` 을 치면 유효숫자가 모자라 `1000000` 이 나온다. 모델이 정답에 아주 큰 점수를 주면, 나머지 클래스 점수들은 저 `0.0001` 신세가 되어 합계에서 사라진다. 그러면 컴퓨터가 보기에 "정답 확률 = 100.000%, 틀린 정도 = 0". 틀린 정도가 0 이면 고칠 방향도 0 이다. 모델은 멀쩡한데 **성적표가 만점으로 반올림돼서** 더 배울 수가 없는 것이다.

---

## Claim 2 — SC 를 막으면 정규화 없이도 그로킹이 일어난다

**주장 (한 문장)**: 소프트맥스의 지수함수를 흡수가 잘 일어나지 않는 함수로 교체(StableMax)하면, weight decay 를 전혀 걸지 않고도 modular arithmetic·sparse parity·MNIST 에서 그로킹이 나타난다.

**증거 (원문 위치)**:
- **§3.3 "Preventing Softmax Collapse leads to grokking"** — StableMax 를 쓰면 "commonly studied settings" 에서 정규화 없이 그로킹이 관찰된다는 진술.
- **Figure 4 (left)** 캡션 verbatim: "Grokking with StCE loss and no regularization on three common grokking datasets using an MLP with 2 hidden layers of width 200. We use 40% of all pairs modulo 113 which is the same setting as [fig. 2(a)] where regular SCE gets stuck at random level performance (random level is 50% for sparse parity)."
- **Figure 4 (middle)** 캡션 verbatim: "Evolution of model weight norms during training for the same models and tasks. This shows that grokking induced without weight decay does not follow the commonly observed trend of rapidly decreasing weight norm during generalization."
- **§2.2** — 모델 설정: width 200 의 2-hidden-layer MLP, 4-head 1층 트랜스포머, 기본 weight decay $\lambda=0$.

**왜 이게 강한 증거인가**: Figure 4(left)의 캡션은 **동일 설정에서의 대조**를 명시한다 — 같은 40% modulo 113 분할에서 일반 SCE 는 랜덤 수준에 갇히는데(Figure 2(a)), 손실 함수만 StCE 로 바꾸면 그로킹이 온다. 데이터·구조·정규화를 고정하고 **손실의 수치적 성질 하나만** 바꾼 개입이므로, "정규화가 없어서 실패했다"는 대안 설명이 배제된다.

**숨은 전제**:
1. **StableMax 교체가 SC 제거 외에 다른 것을 바꾸지 않는다**는 가정. 실제로는 손실 지형 자체가 달라진다 — Proposition 1 은 StableMax 가 $\mathrm{Softmax}(g(x))$ 와 같다고 하므로, 이는 로짓에 비선형 워핑 $g$ 를 씌운 **다른 모델**을 학습시키는 것과 같다. "수치만 고쳤다"와 "목적함수를 바꿨다"의 경계가 여기서 흐려진다. → 07 절의 반박 지점 1.
2. **세 과제(modular arithmetic / sparse parity / MNIST-200)가 그로킹 현상을 대표한다**는 가정. 모두 작고, 이산적이고, 완전 암기가 쉬운 과제다.

**쉬운 말 풀이**: 고장 난 채점기를 고쳤더니 학생이 스스로 깨달았다. 괴롭힐(정규화) 필요가 없었다. 다만 "채점기를 고쳤다"는 게 정확히는 "점수 매기는 규칙을 완만한 것으로 바꿨다"는 뜻이라, 순수한 버그 수정인지 규칙 변경인지는 따져볼 여지가 있다.

---

## Claim 1·2 를 합치면 무엇이 무너지나

이 레포가 이미 커버한 그로킹 논문들의 **무정규화 대조군**은 전부 재검토 대상이 된다. "정규화를 끄면 일반화가 안 온다 → 따라서 정규화가 일반화의 원인"이라는 추론에서, 전건이 관측 장비 결함으로 오염됐다면 후건도 흔들린다. 본 논문 §5.2 가 weight decay 를 **"NLM 방향으로 가중치를 되당기는 장치"** 로 재해석하는 것은, 정규화의 역할을 부정하는 게 아니라 **역할의 종류를 바꾸는 것**이다 — 일반화를 만드는 힘이 아니라, 자멸을 막는 브레이크.
