# 05 · 방법론 (c) — Subnetwork 탐색 (norm-ranked masking + binary search + arity)

> **배경 사다리**: ① "마스크 (mask)" = 0/1 벡터로 어떤 뉴런을 "꺼둔다" 는 신호, ② "faithfulness (충실도)" = 회로 일부만 켰을 때 원본 모델 예측이 *그대로* 보존되는 정도, ③ "binary search" = 정렬된 후보 위에서 절반씩 좁혀가며 최소값 찾기. 이 셋이 본 절의 분석 primitive 다.

---

## 1) 왜 별도의 subnetwork discovery 가 필요한가

학습이 끝난 모델 안에서 "어느 뉴런이 답을 책임지는가" 를 알려면 두 길이 있다:

(i) **weight magnitude pruning**: 작은 weight 부터 0 으로 만든 뒤 acc 변화 보기. 단순하지만 *상호작용* 을 고려 안 함.
(ii) **causal masking**: 마스크로 뉴런을 끄고 *예측이 원본과 같은가* 를 본다 — 본 논문의 선택. ACDC (Conmy 2023), IOI Circuit (Wang 2023) 와 같은 protocol 의 *FFN 뉴런 버전*.

본 논문은 (ii) 를 채택하되, (a) 마스킹 candidate 의 ranking 을 *뉴런 노름* 으로 정렬, (b) 최소 활성 뉴런 수를 binary search 로 탐색, (c) faithfulness 의 평가는 *원본 모델 sign 일치율* 로 정의 — 라는 세 결정으로 단순화한다. 코드의 `circuit_discovery_binary` 함수가 이 통합 procedure.

---

## 2) `circuit_discovery_binary` — verbatim 분석

저자 GitHub `utils.py` 의 함수 verbatim:

```python
def circuit_discovery_binary(epoch, saved_model, norms, dataloader, device='cuda', args=None):
    # Calculate least number of neurons that recovers original (train set)
    # performance with binary search (assuming that it increases monotonically)

    left, right = 1, args.width
    prev_k = -1
    min_k, min_idx = float('inf'), None

    values = np.array(norms['feats'][epoch]).argsort()
    while left < right:
        k = (left + right) // 2
        if (prev_k == k):
            break

        idx = values[-k:]
        masked_acc = acc_calc(dataloader, saved_model, idx, device=device, args=args)
        full_acc = acc_calc(dataloader, saved_model, device=device, args=args)

        if (masked_acc == full_acc) and (k < min_k):
            min_k = k
            min_idx = idx
        if (masked_acc < full_acc):
            left = k
        else:
            right = k + 1

        prev_k = k

    return min_k, min_idx
```

해부 (5 단계):

### (S1) 노름 ranking 으로 정렬
```python
values = np.array(norms['feats'][epoch]).argsort()
```
- `norms['feats'][epoch]` — epoch 시점의 1000 개 뉴런 각각의 노름.
- `argsort()` — 오름차순 인덱스 반환. `values[-k:]` 는 **노름 상위 $k$ 개** 의 뉴런 인덱스.
- 함의: subnetwork candidate 는 항상 "노름 큰 순" 으로만 선택. *임의의 부분집합* 을 탐색하지 않음. → 노름이 ranking key 라는 본 논문의 강한 가설.

### (S2) Binary search
```python
left, right = 1, args.width
...
k = (left + right) // 2
```
- $[1, 1000]$ 위에서 절반씩 좁히기.
- 함의: `masked_acc == full_acc` 인 *최소 $k^\star$* 를 단조성 가정 하에 $O(\log W)$ 시간에 찾음. 1000 뉴런이면 약 10 회의 evaluation.

### (S3) Faithfulness check (sign 일치율 기반 acc 등치)
```python
masked_acc = acc_calc(dataloader, saved_model, idx, device=device, args=args)
full_acc = acc_calc(dataloader, saved_model, device=device, args=args)

if (masked_acc == full_acc) and (k < min_k):
    min_k = k
    min_idx = idx
```
- `acc_calc` 의 `faithfulness=True` 모드에서는 `pred` 와 `fullmodel_pred` 의 *sign* 일치를 본다 — full model 의 *기능* 을 마스킹된 부분망이 **그대로** 재현하는지의 측정 (acc 의 dual interpretation).
- 함의: ground-truth label 이 아닌 *원본 모델의 행동* 을 기준으로 한다는 점이 핵심. ACDC 의 KL 또는 logit-diff metric 과 비교하면 sign-equality 는 더 *공격적* — 두 logit 이 sign 만 같으면 통과. 따라서 "soft" faithfulness 가 본 논문 protocol.

### (S4) 단조성 가정의 명시
```
# (assuming that it increases monotonically)
```
- 주석으로 본 논문이 *가정* 을 인정. 만약 $k=10$ 뉴런이면 faithful 한데 $k=11$ 이면 깨지는 비단조 경우는 무시됨 — 실제로 자연 학습된 FF1 에서 자주 발생하지 않지만 *원칙적으로* 가능.
- 함의: binary search 가 valid 하려면 "masked_acc 가 $k$ 에 대해 단조 증가" 해야 함. linear search 보조 함수 `circuit_discovery_linear` 가 같은 함수로 존재 — 단조성이 의심스러우면 그 변형 사용.

### (S5) 출력
- `min_k` (= $k^\star$): sparse subnetwork 의 **크기**.
- `min_idx`: 그 뉴런들의 인덱스 집합.

→ **이 두 출력의 epoch 시계열** 이 본 논문의 결정적 시각화. $k^\star(t)$ 가 high 에서 low 로 떨어지는 시점 = sparse subnetwork 가 등장한 시점 = grokking phase transition.

---

## 3) 4 줄 해석 (전체 procedure 를 한 함수로 정리)

수식적 표기:

$$
k^\star(t) := \min\bigl\{\, k \,:\, \mathrm{Faith}\bigl(\text{top-}k \text{ neurons by norm at } t\bigr) = 1 \,\bigr\}.
$$

1. **기호 뜻**: $t$ — epoch (학습 시간). $\mathrm{Faith}(\cdot)$ — 마스킹된 forward 가 full forward 와 sign 이 모든 sample 에서 일치하는 비율. $k^\star(t)$ — 그 일치를 보장하는 최소 뉴런 수.
2. **일상 비유**: "1000 명 패널에서 가장 시끄러운 (= 노름 큰) 사람 몇 명만 듣고 나머지를 음소거하면, 원본 회의의 결정을 똑같이 재현할 수 있는 *최소 시끄러운 사람 수* 가 $k^\star$." 학습이 진행될수록 이 수가 적어지면 = sparse 의 도래.
3. **왜 이 형태**: ACDC 같은 *edge-level* discovery 는 FFN 뉴런에는 과잉 (FFN 의 edge 가 dense 그래프) → *neuron-level* 마스킹이 자연 입자. norm-ranking 은 매우 cheap 한 prior — 다른 ranking (gradient × activation, Shapley) 으로 대체 가능하지만 sparse parity 에서는 norm 이 충분히 신호.
4. **조심할 점**:
   - "top-$k$ by norm" 의 prior 가 깨지는 task 가 있을 수 있음 — sparse activation 으로 큰 logit 을 내는 작은-노름 뉴런은 놓침.
   - sign-equality faithfulness 는 logit 의 *세기* 차이를 무시 — calibration 이 중요한 task 에선 KL/MSE faithfulness 가 더 적합.
   - $k^\star(t)$ 가 비단조면 binary search 가 stable 한 결과 보장 안 함 — `circuit_discovery_linear` 변형 또는 다중 starting point 필요.

---

## 4) `ArityFinder` — 회로 구조의 *너비* 측정

저자 GitHub `utils.py` 의 `ArityFinder` 클래스가 또 하나의 측정 primitive 다 — "각 뉴런이 입력 40 비트 중 *몇 비트에만* 의존하는가" (= arity).

핵심 procedure (verbatim 일부):

```python
@torch.no_grad()
def get_arities(self, key: str = "linear1") -> list:
    self.linear = self.model.get_submodule(key)
    arities = []
    for neuron, weights in enumerate(self.linear.weight):
        self.neuron = neuron
        self.old_weights = weights.data.clone()
        self.indices = weights.abs().argsort()
        n_pruned = self.get_n_pruned(0, len(weights))
        arities.append(len(weights) - n_pruned)
    return arities
```

- 각 뉴런에 대해, input weight 들을 **절댓값으로 정렬**.
- 작은 weight 부터 차례로 0 으로 만들면서 (binary search 로) "모델 예측 sign 이 동일" 한 *최대 prune 가능 weight 수* `n_pruned` 를 찾음.
- 뉴런의 arity := $40 - \text{n\_pruned}$ = 그 뉴런이 *진짜 필요로 하는* 입력 비트 수.

→ ground-truth $k=3$ 의 parity 라면, sparse subnetwork 의 모든 뉴런은 arity ≈ 3 일 것이라는 예측. dense subnetwork 의 뉴런들은 arity ≈ 40 (모든 비트에 weak 의존).

### 4 줄 해석 (arity 측정)

**수식**: $\text{arity}(j) := |W_1[j,:]| - \max\{\, p : \text{sign}\bigl(\hat{y}^{\text{prune-}p}(x)\bigr) = \text{sign}\bigl(\hat{y}(x)\bigr) \;\forall x \in D \,\}$

1. **기호 뜻**: $W_1[j,:]$ — $j$ 번째 뉴런의 input weight 벡터 (40 차원). $\hat{y}^{\text{prune-}p}$ — input weight 의 작은 $p$ 개를 0 으로 만든 모델. $D$ — 평가 데이터셋.
2. **일상 비유**: "뉴런 $j$ 의 의견이 정말로 의존하는 *최소 비트 수*. 나머지 비트는 잡음으로 들어도 의견이 안 변함."
3. **왜 이 형태**: weight magnitude 만 보면 false positive (큰 weight 인데 실제 의사결정에 영향 없는 weight) 가 있음. behavior-preserving binary search 로 *실질적* 의존성을 잡음.
4. **조심할 점**: 평가 데이터셋 $D$ 가 부족하면 false negative (실제로는 의존하지만 D 위에서 우연히 sign 보존) 발생. 또한 *동시* prune 의 nonlinear interaction (작은 weight 두 개를 *함께* 끄면 큰 영향) 을 binary search 가 놓칠 수 있음 — 본 논문의 가정.

---

## 5) 대안 — 만약 이렇게 했다면?

| 대안 | 무엇이 달라지나 |
|------|----------------|
| **ACDC (Conmy 2023) 식 edge-level discovery** | FFN 뉴런 안의 weight edge 각각을 ablate — 본 논문보다 fine-grained. 단 sparse parity 의 FFN 에선 over-engineered. ACDC 가 강점이 되는 곳은 transformer head 간 정보 흐름. |
| **Sparse Feature Circuits (Marks 2024) 식 SAE 분해** | hidden activation 을 SAE 로 분해 → feature 별 IE 측정. width 1000 의 FF1 에는 SAE 가 overkill 이지만, deep model 의 hidden state 에 적용 자연. |
| **Gradient × activation ranking** | "norm 큰 뉴런" 대신 "그 뉴런을 끄면 loss 가 얼마나 늘어나는가" 의 *first-order influence* 로 ranking. norm 과 다를 수 있는 경우: 큰 weight 인데 ReLU 가 항상 0 인 dead neuron. |
| **Shapley value 식 attribution** | 모든 부분집합을 sampling — 더 *정확* 하나 $O(2^W)$ 또는 sampling 으로 비용 폭증. binary search 의 $O(\log W)$ 보다 훨씬 비싸지만 단조성 가정 깨질 때 유용. |

---

## 6) 핵심 한 문장

> **이 절의 정수**: 회로 발견을 (a) 노름 ranking 의 strong prior + (b) sign-equality faithfulness 의 soft 기준 + (c) binary search 의 cheap 탐색 으로 단순화 — sparse parity FFN 에 *딱 맞는* primitive 를 만들어 회로의 *시간 진화* 를 $O(\log W)$ 마스킹 회로 평가로 추적 가능하게 한다.
