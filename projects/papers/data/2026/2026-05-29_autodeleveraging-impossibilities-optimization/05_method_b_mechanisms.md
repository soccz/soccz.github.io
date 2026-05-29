# 05-B · 방법론 해부 — ADL 메커니즘 클래스 비교 분석

> **배경 사다리**: 앞 절(05-A)에서 부족액 $D_t$가 정의됐다. 이 절은 그 $D_t$를 어떤 방식으로 승자들에게 분배할지를 다룬다. 메커니즘(mechanism)이란 "규칙의 집합"이다 — ADL 메커니즘은 어떤 트레이더에게 얼마를 haircut할지 결정하는 규칙이다.

---

## ADL 정책의 일반 정의 (§4)

ADL 정책은 두 가지를 결정한다:
1. **심각도(Severity)**: 총 얼마만큼의 명목을 사회화할 것인가 (일반적으로 $D_t$ 이상)
2. **Haircut 배분**: 어떤 승자에게 얼마씩 강제 손실을 부과할 것인가

Haircut 벡터 $\mathbf{h} = (h_1, h_2, \ldots, h_{|\mathcal{W}_t|})$가 만족해야 할 제약:
$$\sum_{i \in \mathcal{W}_t} h_i \geq D_t \quad \text{(부족액 커버)}$$
$$0 \leq h_i \leq e_i \quad \text{(지분 이내)}$$

---

## 메커니즘 1: 큐(Queue) 방식 — BitMEX/Binance/Hyperliquid 현행

### 작동 방식

트레이더를 어떤 메트릭 $m_i$로 내림차순 정렬하고, 가장 상위부터 포지션 전체를 닫는다. $D_t$가 충족될 때까지 계속.

BitMEX/Binance의 메트릭:
$$m_i = \text{PNL}_i \times \ell_i$$

"이익이 크고 레버리지가 높은" 트레이더부터 청산.

### 직관과 문제

**직관**: "가장 많이 번 동시에 가장 위험한 포지션을 가진 사람이 먼저 부담"

**실제 문제**:
1. **집중성(Concentration)**: 1위 트레이더가 모든 부담을 진다. 2위부터는 전혀 부담 없이 이익을 챙긴다. 극도의 PTSR 낮음.
2. **규모 의존**: 같은 비율 이익을 올렸어도 명목 규모가 크면 더 불리하다 — 규모를 키운 트레이더에게 페널티를 주는 역인센티브.
3. **Sybil 취약**: 포지션을 여러 계정으로 쪼개면 각 계정의 PNL×ℓ가 낮아져 큐 후반부로 밀린다.
4. **과잉 청산**: 1위 포지션 전체를 닫으면 $D_t$보다 훨씬 많은 명목이 사회화될 수 있다. 논문이 실증한 "28× 과잉"의 원인.

### 수식으로 본 과잉 사회화

큐 방식에서 트레이더 $i^* = \arg\max m_i$가 먼저 청산되면:
$$\text{(사회화된 명목)} = n_{i^*, t} \gg D_t \text{ (일반적으로)}$$

$n_{i^*,t}$가 $D_t$보다 훨씬 큰 경우 "불필요한 haircut"이 발생한다.

---

## 메커니즘 2: Pro-Rata — Drift/Paradex 방식

### 작동 방식

모든 승자의 명목 노출 비율로 $D_t$를 배분:

$$h_i^{\text{pro-rata}} = D_t \cdot \frac{n_{i,t}}{\sum_{j \in \mathcal{W}_t} n_{j,t}}$$

### 특성

**공정성**: 모든 승자가 "공평하게" 일부씩 부담. 아무도 0 haircut도, 전부 haircut도 받지 않는다.

**효율성**: 정확히 $D_t$만 사회화된다. 과잉 사회화가 없다.

**Theorem 2-3의 결론**: 세 공리(단조성·규모불변·Sybil저항)를 유일하게 만족하는 메커니즘.

**한계**: 레버리지 위험을 고려하지 않는다. 레버리지 100배 트레이더와 2배 트레이더에게 명목 노출이 같으면 같은 haircut을 부과한다 — 실질적 위험 기여는 다를 수 있다.

---

## 메커니즘 3: 위험 가중 Pro-Rata (Risk-Weighted) — 논문의 새 기여

### 작동 방식

위험 가중 함수 $g(\ell)$로 haircut을 조정:

$$h_i^{g} = D_t \cdot \frac{g(\ell_{i,t})}{\sum_{j \in \mathcal{W}_t} g(\ell_{j,t})}$$

### 최적 $g^*$ 도출

반복 충격 가정 하에서, $g^*$는 볼록 쌍대성으로:

$$g^*(\ell) = \text{arg min}_{g \in \mathcal{G}} \mathbb{E}_{\text{shocks}} \left[ D_t \left| \text{policy} = h^g \right. \right]$$

이 최적화 문제의 쌍대해가 closed-form으로 존재하며 레버리지 함수의 형태를 결정한다. 직관: 레버리지가 높을수록 $g^*(\ell)$가 크다 → 위험한 트레이더가 더 많이 부담.

### 세 메커니즘 비교

| 특성 | 큐(Queue) | Pro-Rata | g*-가중 Pro-Rata |
|------|-----------|----------|-----------------|
| 과잉 사회화 | ✗ 많음 | ✅ 없음 | ✅ 없음 |
| 공리적 공정성 | ✗ 실패 | ✅ 유일 | △ 근사 공정 |
| 레버리지 위험 반영 | △ 간접 | ✗ 없음 | ✅ 최적 |
| 실시간 계산 | ✅ 쉬움 | ✅ 쉬움 | ✅ O(n) |
| Sybil 저항 | ✗ 취약 | ✅ 저항 | ✅ 저항 |
| 현행 사용 | 95%+ | ~5% | 없음(이론) |

---

## 메커니즘 4: 동적 ADL (Stackelberg 게임 기반)

### 개요 (§5, Theorem 5)

다중 ADL 라운드에서 거래소가 각 라운드 결과를 보며 정책을 업데이트하는 설정. 이를 **Stackelberg 게임**으로 모델링한다:
- Leader: 거래소 (ADL 정책 결정)
- Follower: 트레이더 (포지션 크기와 방향 결정)

### 핵심 tradeoff

Theorem 5: "지급능력 회복을 빠르게 하는(ADL 집중 적용) 전략은 장기 거래소 수익을 훼손한다."

**메커니즘**: 공격적 ADL → 큰 포지션 보유자(whale)가 시장을 떠남 → 거래량·수수료 감소 → 장기 수익 감소. 반면 보수적 ADL → 지급능력 회복이 느림 → 단기 위험 증가.

### Mirror Descent 알고리즘

이 tradeoff를 다루기 위해 논문은 **mirror descent**(미러 강하)를 적용한다:

$$\mathbf{h}_{t+1} = \text{arg min}_{\mathbf{h} \in \mathcal{H}} \left[ \langle \nabla_t, \mathbf{h} \rangle + \frac{1}{\eta} D_{\psi}(\mathbf{h}, \mathbf{h}_t) \right]$$

- $D_\psi$: Bregman divergence (정보 기하학적 거리)
- $\nabla_t$: 현재 라운드에서 손실에 대한 기울기
- $\eta$: 학습률

Mirror descent는 지급능력과 수익을 joint 목적으로 하는 설정에서 **vanishing regret**을 달성한다 — 즉 충분히 많은 라운드 후에는 optimal static 정책과 거의 같은 누적 성과를 낸다.

### Online Learning 관점

이것은 ADL 문제를 **온라인 볼록 최적화(Online Convex Optimization)** 문제로 재해석하는 것이다:
- 매 라운드: 자연(시장 충격)이 결과를 공개
- 알고리즘(거래소): 다음 라운드 ADL 정책 업데이트
- 목표: 장기 지급능력과 수익의 합 최대화

---

## 이 절의 핵심 한 문장

**현행 큐 방식은 이론적·실증적으로 모든 면에서 열등하며, pro-rata는 공리적 유일성을 가지고, g*-가중 pro-rata는 반복 충격에 강건하고, 동적 ADL은 mirror descent로 장기 tradeoff를 해결한다.**
