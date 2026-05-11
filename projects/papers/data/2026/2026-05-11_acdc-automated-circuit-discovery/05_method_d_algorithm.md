# 4. 방법론 해부 (d) — ACDC 알고리즘 본체

## 배경 사다리

이 파일은 ACDC 의 *유사 코드 (pseudocode)* 를 재구성한다. 이걸 이해하려면 ① "topological sort" 가 DAG 의 노드를 *모든 화살표가 한 방향* 으로 가도록 정렬하는 절차라는 것 — Transformer 의 forward pass 순서가 그대로 위상정렬임 ②, "역위상정렬" 이 그 순서를 뒤집은 것 — 즉 *출력에 가까운 노드부터* 처리하는 것, 이 둘만 알면 된다.

## Pseudocode (저자 GitHub `TLACDCExperiment.step()` 재구성)

원문 본문의 Algorithm 1 박스는 미열람이지만, 저자 코드에서 직접 추출한 본체는 다음과 같다.

```
Input:
  M         : Transformer model
  D_clean   : clean dataset
  D_corr    : corrupted dataset
  H         : metric (callable; e.g. KL divergence)
  tau       : threshold (float, > 0)
  ablation  : "random" | "zero"

Output:
  G' = (V, E')  : circuit subgraph

Procedure ACDC:
  1. Build computational graph G = (V, E) of M (head/MLP 단위 nodes,
     residual-stream direct edges)
  2. E' <- E                              # 모든 edge 를 켠 채 시작
  3. nodes <- ReverseTopologicalSort(V)   # 출력에서 입력 방향
  4. m_old <- H(M with all edges in E', D_clean)
  5. For node v in nodes:
       parents <- {u : (u, v) in E'}
       For u in parents:
         # u → v edge 를 끄고 corrupted 활성으로 대체
         set edge (u, v) to corrupted value from D_corr (or 0)
         m_new <- H(M with current E' \ {(u,v)}, D_clean)
         delta <- m_new - m_old
         if delta < tau:
           # edge 가 metric 에 큰 영향 없음 → 영구 제거
           E' <- E' \ {(u, v)}
           m_old <- m_new
         else:
           # edge 가 중요 → 복원
           restore edge (u, v) (turn back on)
  6. return G' = (V, E')
```

## 4 줄 해설

- **기호 뜻**: $E'$ = 현재까지 살아남은 엣지 집합. $m_{\text{old}}$ = 현재 회로의 metric 값 (낮을수록 좋은 metric 가정 — KL div). $\Delta = m_{\text{new}} - m_{\text{old}}$ = 한 edge 를 끄면 metric 이 얼마나 *올라가는가* (악화). $\Delta < \tau$ 면 그 edge 는 *중요하지 않음* — 영구 제거. $\Delta \ge \tau$ 면 그 edge 는 *중요* — 다시 켜고 다음 edge 로.
- **일상 비유**: 책장 정리. 책 한 권 빼 보고 책장이 무너지면 (Δ ≥ τ) 그 책은 *받침대* — 다시 넣어 둠. 무너지지 않으면 (Δ < τ) 그 책은 *불필요* — 영구 버림. 위에서부터 (천장 가까운 책장부터) 정리한다 (역위상정렬).
- **왜 이 형태**: (1) 역위상정렬이라 *그 시점에 살아남은 회로* 안에서 edge 의 중요도를 평가 — 입력 쪽부터 했으면 위쪽 edge 가 제거됐을 때 그 영향이 *bottleneck* 으로 누적돼 평가가 망가짐. (2) greedy 라 *동시 평가* 의 cooperative effect 를 못 잡지만 (한계 — 07_limits 참조), 그 대가로 single forward pass 당 하나의 결정 — 알고리즘이 *단순하고 디버깅 가능*. (3) $\tau$ 가 metric 차이의 직접 임계라 *해석 가능* — "이 회로는 KL 을 $\tau$ 이내로 잃지 않으면서 가능한 한 sparse 한 회로".
- **조심할 점**: (1) $m_{\text{old}}$ 가 *순회 중 누적적으로 갱신* 됨 — 즉 같은 edge 가 *다른 회로 상태* 에서 평가될 수 있어 평가 순서가 결과를 바꾼다. (2) $\tau$ 는 단일 scalar 라 *layer/edge type 별 scale 차이* 를 무시. 깊은 layer 의 edge 가 metric 에 큰 영향을 더 자주 미치면 깊은 쪽이 over-pruned. (3) ablation 의 선택 (zero vs random) 이 결과의 절반을 좌우 — 표면상 "단일 hyperparameter" 라는 주장은 ablation 선택을 고정해야만 성립.

## 시간 복잡도

각 edge 마다 1 회 forward pass. 총 edge 수 $|E| \approx 32{,}000$ (GPT-2 small). single GPU 의 forward pass 가 약 50 ms (batch 32, 시퀀스 64) 이면 약 $32{,}000 \times 50\text{ ms} = 1{,}600$ 초 ≈ 27 분. 더 큰 모델은 $|E| \propto L^2 H^2$ 로 폭증 — GPT-Neo 1.3B 정도면 $|E| \sim 10^6$, forward pass 도 더 느려 *시간 단위* 가 일 단위로.

후속 작업 (attribution patching) 은 이걸 *1 회 backward pass* 로 줄인다 — gradient 가 모든 edge 의 *1 차 영향* 을 동시에 추정. 이 cost 차이가 ACDC 의 실용성에 가장 큰 도전.

## 다른 접근으로 했다면

### 대안 1: simulated annealing / RL

edge 의 *집합 단위* 를 sampling 으로 평가. cooperative effect 잡을 가능성 ↑. 단점: hyperparam 폭증 (temperature schedule, exploration rate). 비용 증가.

### 대안 2: 1-step attribution patching (Syed et al. 2023)

clean 과 corrupted 의 *gradient* 차이로 edge 점수를 한 번에 추정. linearization 의 의미를 잃을 수 있지만 (큰 ablation 의 비선형 효과) 비용은 ACDC 의 1/|E| 수준. 후속 표준이 됨.

### 대안 3: subnetwork probing (SP, Cao 2021 / Davies 2023)

mask 를 SGD 로 학습. ACDC 의 직접 baseline. 비교 표 결과는 평균 AUC 에서 SP 약간 우위 (Syed et al. 2024 재측정). 단점: 학습 hyperparam, 인과성 보장 없음.

## 핵심 한 문장

> ACDC 의 알고리즘 본체는 *역위상정렬 + edge-by-edge greedy + 단일 τ* 의 19 줄 짜리 pseudocode 로 환원되며, 그 단순함이 비교 기준으로의 가치를 결정한다.
