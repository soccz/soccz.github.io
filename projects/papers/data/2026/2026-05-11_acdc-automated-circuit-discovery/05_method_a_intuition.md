# 4. 방법론 해부 (a) — 큰 그림

## 배경 사다리

이 파일을 이해하려면 ① "computational graph" 를 *layer 별 활성 사이의 화살표 그림* 으로 본다는 것, ② "ablation" 이 *어떤 화살표가 가져오는 값을 다른 값으로 바꿔치기 하는 개입* 이라는 것, ③ Transformer 의 residual stream 이 *모든 head/MLP 의 출력이 더해져 흐르는 공유 wire* 라는 것, 이 셋만 알면 된다. 자세한 식·코드는 (b)–(e) 분할 파일에서 다룬다.

## 한 장 요약

ACDC 의 입력·출력은 다음 한 줄로 압축된다.

> 입력: (Transformer $M$, clean dataset $D_{\text{clean}}$, corrupted dataset $D_{\text{corr}}$, metric $H$, 임계값 $\tau$).
> 출력: $M$ 의 계산 그래프 $G = (V, E)$ 의 부분 그래프 $G' = (V, E') \subset G$ — *행동을 거의 보존하면서* 가능한 한 sparse 한 회로.

작동은 다음 4 단계.

### 단계 1 — 계산 그래프 정의

Transformer 를 *layer-wise sum* 이 아니라 *attention head + MLP 의 독립 노드* + residual stream 을 통한 *직접 edge* 그림으로 본다. node 는 {embedding, head $h_{l,i}$ for layer $l$ head $i$, MLP $m_l$ for layer $l$, output unembedding}, edge 는 "node $u$ 의 출력이 node $v$ 의 입력 residual 에 더해지는 직접 경로" 의 집합. (자세한 정의는 [05_method_b_computational_graph.md](05_method_b_computational_graph.md))

### 단계 2 — corrupted distribution 정의

같은 행동 도메인 안에서 *prompt 의 의미 핵심만 바뀐* dataset $D_{\text{corr}}$ 를 만든다. 예: IOI 의 clean "Mary and John went to the store. John gave Mary" 의 corrupted 짝은 *세 이름이 모두 random 으로 바뀐* "Tom and Lisa went..." . corrupted 의 activation 이 ablation 시 채워 넣는 *baseline value* 가 된다. 0 으로 채우는 옵션도 있지만 (zero ablation), 일반적으로 *random 또는 mean ablation* 이 더 sound — 0 은 모델이 자연스럽지 않은 input distribution 으로 들어가기 때문.
(자세한 절차 + 4 줄 수식 해설은 [05_method_c_ablation.md](05_method_c_ablation.md))

### 단계 3 — ACDC 본 알고리즘 (역위상정렬 + greedy edge prune)

전체 edge 가 켜진 상태에서 시작. 출력 (logit) 에서 입력 쪽으로 노드를 역위상순회. 각 노드의 들어오는 edge 를 하나씩 꺼 보고 (즉 그 edge 의 source node 출력을 corrupted 값으로 대체), metric $H$ 의 변화가 $\tau$ 보다 작으면 그 edge 를 영구히 제거. 모든 노드를 거치고 나면 남은 edge 들의 집합이 회로 $G'$.
(자세한 pseudocode + 4 줄 해설은 [05_method_d_algorithm.md](05_method_d_algorithm.md))

### 단계 4 — 메트릭 $H$ 와 임계값 $\tau$

$H$ 는 user-pluggable. default 는 KL divergence $D_{\text{KL}}(M \| M_{\text{ablated}})$. task-specific 으로는 logit difference, NLL, 또는 task metric (Greater-Than 의 정답 확률 마진).
$\tau$ 는 *유일한* 사용자 hyperparameter (ablation 방식 zero/random 의 binary 선택을 제외하면). $\tau$ 가 작으면 더 큰 회로 (보수적), 크면 더 작은 회로 (공격적). 동일 $\tau$ 로 모든 edge 를 평가하기 때문에 algorithm 은 sparsity 와 성능의 Pareto curve 를 $\tau$ scan 으로 자동 생성.
(자세한 해설은 [05_method_e_metric_threshold.md](05_method_e_metric_threshold.md))

## 핵심 직관 (왜 이 형태로 작동하는가)

세 가지 발상의 전환이 박혀 있다.

1. **node 단위에서 edge 단위로 내려간 결정**. 기존 활성 패칭은 node (head/MLP) 의 출력을 통째로 바꿨다. ACDC 는 *어떤 노드에서 어떤 노드로 가는 정보 흐름* 자체를 끊는다. residual stream 의 *linearity* (모든 컴포넌트 출력의 합) 가 이걸 가능케 한다 — head $h_{l,i}$ 가 layer $l'$ MLP 의 입력에 기여하는 부분만 빼고 나머지는 그대로 둘 수 있다.

2. **역위상정렬의 필요성**. 입력 쪽부터 처리하면, 이미 제거된 edge 가 *bottleneck* 이 돼서 그 위의 모든 edge 가 무의미해진다. 출력 쪽부터 처리하면 "이 edge 가 *지금 시점에서 얼마나 중요한가*" 를 안정적으로 평가할 수 있다.

3. **단일 hyperparameter τ 의 단순성**. mech interp 의 자동화 도구는 보통 (sparsity coefficient × learning rate × initialization × mask schedule) 의 다중 hyperparameter 를 갖는다. ACDC 는 이를 *오직 τ* 로 환원해 비교의 축을 단일화. 이 단순성이 *Pareto frontier* 라는 비교 언어를 가능케 한다.

## 작동의 *비대칭성* (논문이 명시 안 한 미묘함)

이 알고리즘은 **거짓 음성 (회로의 진짜 엣지를 잘못 제거)** 과 **거짓 양성 (불필요한 엣지를 회로로 유지)** 사이에 비대칭이다.

- 거짓 음성은 *되돌리지 못한다* — 한 번 제거된 edge 는 영구. greedy.
- 거짓 양성은 *후속에서 다시 평가될 수 있다* — 노드를 따라 내려가면서 그 위 노드의 출력 (현재 회로) 가 변하면 그 edge 의 중요도가 재평가될 수도 있음.

이 비대칭은 ACDC 가 **보수적** (큰 회로) 일 때는 안전하지만 **공격적** (작은 회로) 일 때는 *cooperative edge pair* 를 모두 잃을 위험을 키운다. 이게 후속 attribution patching 이 *한 번의 backward pass 로 모든 edge 의 점수를 동시에* 추정해 ACDC 를 추월한 이유 — 동시성이 cooperative effect 를 깨지 않는다.
