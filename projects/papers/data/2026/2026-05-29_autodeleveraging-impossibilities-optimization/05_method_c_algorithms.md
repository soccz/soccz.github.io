# 05-C · 방법론 해부 — 알고리즘: 볼록 쌍대성과 미러 강하

> **배경 사다리**: (1) "볼록 함수"란 그래프가 아래로 불룩한 함수 — 기울기가 단조 증가한다. (2) "쌍대(dual)"란 최소화 문제와 최대화 문제 사이에 수학적 거울 관계가 있어 한쪽의 해가 다른 쪽의 해와 일치하는 것. (3) "후회(regret)"는 온라인 학습에서 최적 고정 전략과 현재까지 누적 손실의 차이를 뜻한다.

---

## 알고리즘 1: 최적 위험 가중 함수 $g^*$ 계산 (볼록 쌍대성)

### 왜 알고리즘이 필요한가

g*-가중 pro-rata는 반복 충격 하에서 기대 총 부족액을 최소화하는 최적 메커니즘이다(Theorem 4). 그러나 "최적 $g^*$가 존재한다"는 것만으로는 실제 계산 방법을 모른다. 이 알고리즘이 그것을 풀어낸다.

### 최적화 문제 설정

충격 과정 $(\delta_s)_{s=1}^T$ — 각 라운드 가격 변화 $\delta_s$가 i.i.d. 분포 $\mathcal{D}$에서 추출된다고 하자. 기대 총 부족액은:

$$\min_{g \in \mathcal{G}} \mathbb{E}_{\delta \sim \mathcal{D}} \left[ D(g, \mathcal{P}_n, \delta) \right]$$

여기서 $D(g, \mathcal{P}_n, \delta)$는 위험 가중 함수 $g$와 충격 $\delta$ 하에서의 총 부족액.

이 문제를 직접 풀기 어려운 이유: $D$가 $g$에 대해 비선형이고 stochastic하다.

### 볼록 쌍대성 적용

논문은 $\mathcal{G}$가 볼록 함수 클래스일 때 Lagrange 쌍대:

$$\max_{\lambda \geq 0} \min_{g \in \mathcal{G}} \left[ \mathbb{E}[D(g, \mathcal{P}_n, \delta)] + \lambda^\top (A g - b) \right]$$

여기서 $A, b$는 $g$에 대한 제약 조건(단조성, 규모 불변성 등).

**강쌍대성(Strong Duality)**: 이 문제에서 min-max 순서 교환이 성립하면(슬레이터 조건 만족), 외부 최대화의 최적해 $\lambda^*$로부터 내부 최소화의 최적해 $g^*$를 닫힌형으로 구할 수 있다.

결과: $g^*(\ell) = \phi(\ell)$ where $\phi$는 충격 분포와 트레이더 레버리지 분포에 의해 결정되는 함수.

### 선형 시간 알고리즘

$g^*$가 알려지면 haircut 계산은:

```
INPUT: D_t (총 부족액), {n_{i,t}, ℓ_{i,t}} for i ∈ W_t (승자 집합)
OUTPUT: {h_i} for i ∈ W_t

1. weights_i = g*(ℓ_{i,t}) for all i  [O(|W_t|)]
2. total_weight = Σ weights_i          [O(|W_t|)]
3. h_i = D_t × weights_i / total_weight [O(|W_t|)]
RETURN {h_i}
```

복잡도: $O(|W_t|)$ = $O(n)$. 실시간 계산 가능.

---

## 알고리즘 2: 동적 ADL — Mirror Descent

### 설정

다중 라운드 게임에서 거래소는 각 라운드 $t$에서:
1. ADL 정책 $\mathbf{h}_t$를 결정
2. 시장 충격이 실현되고 결과 $(D_t, \text{Revenue}_t)$ 관찰
3. 다음 라운드 정책 $\mathbf{h}_{t+1}$ 업데이트

### Mirror Descent 업데이트 규칙

$$\mathbf{h}_{t+1} = \arg\min_{\mathbf{h} \in \mathcal{H}} \left[ \langle \mathbf{g}_t, \mathbf{h} \rangle + \frac{1}{\eta} D_\psi(\mathbf{h}, \mathbf{h}_t) \right]$$

- **기호 뜻**: 
  - $\mathbf{g}_t = \nabla_\mathbf{h} L_t(\mathbf{h}_t)$ = 현재 손실의 기울기
  - $\eta > 0$ = 학습률 (스텝 크기)
  - $D_\psi(\mathbf{h}, \mathbf{h}_t) = \psi(\mathbf{h}) - \psi(\mathbf{h}_t) - \langle \nabla\psi(\mathbf{h}_t), \mathbf{h} - \mathbf{h}_t \rangle$ = Bregman divergence
  - $\psi$: 오목 포텐셜 함수 (예: 엔트로피 $\psi(\mathbf{h}) = -\sum_i h_i \log h_i$)

- **일상 비유**: GPS 내비게이션이 실시간 교통 정보를 반영해 경로를 업데이트하는 것 — 매 라운드 새 정보(시장 충격)를 보고 다음 결정(ADL 정책)을 미세 조정

- **왜 Bregman divergence**: 단순 Euclidean 거리 대신 Bregman divergence를 쓰는 이유는 $\mathcal{H}$의 기하학적 구조를 반영하기 때문이다. 특히 확률 심플렉스($\sum h_i = 1$) 위에서는 엔트로피 거리가 자연스럽다.

### 후회(Regret) 분석

$T$ 라운드 후 누적 후회:

$$\text{Regret}_T = \sum_{t=1}^T L_t(\mathbf{h}_t) - \min_{\mathbf{h}^* \in \mathcal{H}} \sum_{t=1}^T L_t(\mathbf{h}^*)$$

Mirror descent는 다음을 보장한다:

$$\text{Regret}_T \leq \frac{D_\psi(\mathbf{h}^*, \mathbf{h}_1)}{\eta} + \frac{\eta}{2} \sum_{t=1}^T \|\mathbf{g}_t\|^2_*$$

학습률 $\eta = \sqrt{D_\psi(\mathbf{h}^*, \mathbf{h}_1) / \sum \|\mathbf{g}_t\|^2_*}$ 로 설정하면:

$$\text{Regret}_T = O(\sqrt{T})$$

즉 **평균 후회** $\text{Regret}_T / T \to 0$ — 충분한 라운드 후 최적 고정 정책에 수렴한다.

- **조심할 점**: 이 수렴은 거래소가 최적 정적 정책을 따랐을 때와의 비교다. 진짜 최적 동적 정책과의 차이는 더 클 수 있다.

---

## 알고리즘 3: HyperReplay 재생 (실증 알고리즘)

### 목적

Hyperliquid 블록체인의 원시 기록(HyperReplay)에서 October 10 이벤트를 단계별로 재생해, 각 ADL 메커니즘 적용 시 결과를 시뮬레이션한다.

### 두 단계 재생 (Two-pass replay)

**1단계 (forward pass)**: 블록체인 이벤트를 시간순으로 처리하며 모든 포지션 상태를 계산
- 각 블록에서 거래·펀딩·청산 이벤트 처리
- 각 트레이더 지분 $e_i$ 추적

**2단계 (backward pass / counterfactual)**: 동일 이벤트 스트림에 대해 각 ADL 메커니즘을 counterfactual 적용
- 실제 큐 방식 vs. pro-rata vs. g*-가중 비교
- 각 시점에서 total haircut, 부족액 커버 여부 계산

### 왜 이 방법이 신뢰할 수 있는가

- 실제 블록체인 원시 데이터 사용 (조작 불가)
- 동일 데이터에 대해 메커니즘만 교체하므로 공정한 비교
- 해시 검증(hash verification)으로 데이터 무결성 확인

---

## 세 알고리즘의 통합 그림

```
실시간 시장 데이터
       ↓
레버리지 질량 계산 [O(n)]
       ↓
     최적 g* 적용
       ↓
haircut 배분 [O(n)]
       ↓
미러 강하로 정책 업데이트 [O(n log n)]
       ↓
다음 라운드
```

전체 알고리즘 복잡도: $O(n \log n)$ per round — 수만 명 트레이더 거래소에서도 밀리초 내 실행 가능.

---

## 이 절의 핵심 한 문장

**최적 g*는 볼록 쌍대성으로 닫힌형으로 계산되고, 동적 학습은 mirror descent로 $O(\sqrt{T})$ 후회 보장을 가지며, 전체 시스템은 $O(n)$ 시간으로 실시간 거래소에서 작동한다.**
