# 실습 4: 그래프 데이터 + NetworkX 사기 탐지 — *Lab 4: Graph-Based Fraud Detection*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), 실습 4 (pp.259~) + Ch4 마무리
> **원서 분량**: 약 20쪽
> **해설 분량**: 약 25쪽
> **소요 시간**: 6~10시간

---

## 🪧 이 실습을 한 줄로

> **사기는 본질적으로 네트워크 현상** — 같은 카드/IP/디바이스가 여러 계정/거래에 연결.
> **NetworkX + GNN** 으로 그래프 패턴 분석.

책은 그래프 기본 개념 + NetworkX 실습. 이 해설집은:
1. **그래프 데이터 8가지 종류**
2. **NetworkX 핵심 함수**
3. **사기 탐지 그래프 알고리즘** (Community Detection, PageRank, GNN)

### 📍 흐름

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lab 4 — 그래프 기반 사기 탐지</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Simple graph viz -->
    <text x="380" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">사기 네트워크 예시</text>
    <!-- Nodes -->
    <circle cx="200" cy="150" r="20" fill="#fdf0ea" stroke="#c4724e" stroke-width="2"/>
    <text x="200" y="155" text-anchor="middle" font-weight="700" fill="#c4724e">카드1</text>
    <circle cx="350" cy="100" r="20" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="350" y="105" text-anchor="middle" fill="#5a7a96">계정A</text>
    <circle cx="350" cy="200" r="20" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="350" y="205" text-anchor="middle" fill="#5a7a96">계정B</text>
    <circle cx="500" cy="100" r="20" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="500" y="105" text-anchor="middle" fill="#3a7d44">거래1</text>
    <circle cx="500" cy="200" r="20" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="500" y="205" text-anchor="middle" fill="#3a7d44">거래2</text>
    <circle cx="650" cy="150" r="20" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="650" y="155" text-anchor="middle" fill="#7a6a9a">IP X</text>
    <!-- Edges -->
    <line x1="220" y1="150" x2="330" y2="105" stroke="#c4724e" stroke-width="1.5"/>
    <line x1="220" y1="150" x2="330" y2="195" stroke="#c4724e" stroke-width="1.5"/>
    <line x1="370" y1="100" x2="480" y2="100" stroke="#5a7a96" stroke-width="1.5"/>
    <line x1="370" y1="200" x2="480" y2="200" stroke="#5a7a96" stroke-width="1.5"/>
    <line x1="520" y1="100" x2="630" y2="150" stroke="#3a7d44" stroke-width="1.5"/>
    <line x1="520" y1="200" x2="630" y2="150" stroke="#3a7d44" stroke-width="1.5"/>
    <text x="380" y="240" text-anchor="middle" font-size="11" fill="#1c1917">하나의 카드 → 여러 계정 → 같은 IP에서 거래</text>
    <text x="380" y="260" text-anchor="middle" font-size="11" fill="#c4724e" font-weight="700">→ 사기 의심 (Star Pattern)</text>
  </g>
</svg>

---

## 🟢 [초급] — 그래프 데이터 직관

### 1. 사기 = 네트워크 현상

#### 사례
사기꾼이 도난 카드 한 장으로:
- 계정 5개 생성
- 각 계정에서 거래
- 같은 IP, 같은 디바이스

→ **단일 거래만 봐서는 못 잡음**. 네트워크 봐야 함.

### 2. 그래프 = 노드 + 엣지

```
[노드 (Node)]: 객체 (카드, 계정, 거래, IP, 디바이스)
[엣지 (Edge)]: 관계 (카드→계정, 계정→거래, 거래→IP)
```

### 3. 8가지 그래프 종류 (책 본문)

| 종류 | 영문 | 사기 활용 |
|------|------|---------|
| **무방향** | Undirected | 친구 관계 |
| **방향** | Directed | 송금 흐름 |
| **가중** | Weighted | 거래 금액 |
| **비가중** | Unweighted | 단순 연결 |
| **순환** | Cyclic | 자금세탁 (돈 회전) |
| **비순환** | Acyclic | 계층 관계 |
| **희소** | Sparse | 일반 네트워크 |
| **밀집** | Dense | 사기 조직 |

### 4. 사기 네트워크 패턴 4가지

#### 패턴 ①: Star (별)
한 노드 (사기범)에 여러 노드 (피해자) 연결.

#### 패턴 ②: Clique (군집)
사기 조직원들끼리 모두 연결.

#### 패턴 ③: Chain (체인)
A→B→C→D 순차 거래 (자금세탁 Layering).

#### 패턴 ④: Hub-and-Spoke
중앙 허브 + 주변 spoke (대포통장 패턴).

> ✅ **여기까지 따라왔으면**: 사기가 왜 그래프 분석인지 보일 거다.

---

## 🟡 [중급] — NetworkX 기초

### 1. 설치

```bash
pip install networkx
```

### 2. 그래프 생성

```python
import networkx as nx
import matplotlib.pyplot as plt

# 무방향 그래프
G = nx.Graph()

# 노드 추가
G.add_node("Alice")
G.add_node("Bob")
G.add_nodes_from(["Charlie", "David"])

# 엣지 추가
G.add_edge("Alice", "Bob", weight=100)
G.add_edges_from([("Bob", "Charlie", {'weight': 50}),
                  ("Alice", "Charlie", {'weight': 30})])

# 정보
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"Alice 이웃: {list(G.neighbors('Alice'))}")
```

### 3. 방향 그래프 (송금)

```python
# 송금 네트워크
DG = nx.DiGraph()
DG.add_edge("Alice", "Bob", amount=1000)
DG.add_edge("Bob", "Charlie", amount=500)
DG.add_edge("Charlie", "Alice", amount=100)  # 순환!

# In-degree (받은 횟수)
print(f"Bob 받은: {DG.in_degree('Bob')}")
# Out-degree (보낸 횟수)
print(f"Bob 보낸: {DG.out_degree('Bob')}")
```

### 4. 시각화

```python
import matplotlib.pyplot as plt

pos = nx.spring_layout(G, k=0.5, iterations=50)
nx.draw_networkx_nodes(G, pos, node_color='lightblue', node_size=500)
nx.draw_networkx_edges(G, pos, edge_color='gray', alpha=0.5)
nx.draw_networkx_labels(G, pos)

# 엣지 가중치
edge_labels = nx.get_edge_attributes(G, 'weight')
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)

plt.axis('off')
plt.show()
```

### 5. 사기 탐지용 그래프 메트릭

```python
# 1. Degree Centrality (연결 수)
degree_cent = nx.degree_centrality(G)
# 높음 = 허브 = 사기 의심

# 2. Betweenness Centrality (매개 중심성)
between_cent = nx.betweenness_centrality(G)
# 높음 = 자금세탁 중간 단계

# 3. Closeness Centrality (근접 중심성)
close_cent = nx.closeness_centrality(G)
# 높음 = 네트워크 가까이 위치

# 4. PageRank (구글 알고리즘)
pagerank = nx.pagerank(G, alpha=0.85)
# 높음 = 중요한 노드

# 5. Clustering Coefficient
clustering = nx.clustering(G)
# 높음 = 밀집 그룹 (사기 조직 가능성)
```

> ✅ **여기까지 따라왔으면**: NetworkX 기초로 그래프 만들고 분석 가능.

---

## 🔴 [고급] — Community Detection

### 1. 사기 조직 탐지

#### 1.1 Louvain Algorithm

```python
import community as community_louvain

# Louvain (모듈성 최대화)
partition = community_louvain.best_partition(G)

# 각 노드의 커뮤니티
for node, comm in partition.items():
    print(f"{node}: Community {comm}")

# 시각화
import matplotlib.cm as cm
import numpy as np

pos = nx.spring_layout(G)
cmap = cm.get_cmap('viridis', max(partition.values()) + 1)
nx.draw_networkx_nodes(G, pos, partition.keys(),
                       node_size=300,
                       cmap=cmap, node_color=list(partition.values()))
nx.draw_networkx_edges(G, pos, alpha=0.3)
plt.show()
```

#### 1.2 Girvan-Newman Algorithm

```python
from networkx.algorithms.community import girvan_newman

# 점진적 분할
comp = girvan_newman(G)
top_level = next(comp)
print(f"커뮤니티 수: {len(top_level)}")
```

#### 1.3 Label Propagation

```python
from networkx.algorithms.community import label_propagation_communities

communities = list(label_propagation_communities(G))
print(f"커뮤니티: {len(communities)}")
```

### 2. 사기 패턴 자동 탐지

```python
def detect_fraud_patterns(G):
    """그래프에서 사기 패턴 자동 탐지"""
    patterns = []
    
    # 1. Star Pattern (한 노드에 많은 연결)
    for node in G.nodes():
        if G.degree(node) > 20:  # 임계값
            patterns.append({
                'type': 'Star',
                'center': node,
                'neighbors': list(G.neighbors(node))
            })
    
    # 2. Clique Pattern (완전 연결 그룹)
    cliques = list(nx.find_cliques(G))
    for clique in cliques:
        if len(clique) >= 4:  # 4명+ 모두 연결
            patterns.append({
                'type': 'Clique',
                'members': clique
            })
    
    # 3. Cycle Pattern (자금세탁)
    cycles = list(nx.simple_cycles(G.to_directed()))
    for cycle in cycles:
        if len(cycle) >= 3:
            patterns.append({
                'type': 'Cycle',
                'path': cycle
            })
    
    return patterns
```

### 3. 거래 네트워크 사례

```python
import pandas as pd

# 가상 거래 데이터
transactions = pd.DataFrame({
    'sender': ['A', 'B', 'A', 'C', 'D', 'A'],
    'receiver': ['B', 'C', 'C', 'D', 'A', 'D'],
    'amount': [100, 50, 200, 30, 80, 150]
})

# 그래프 생성
G = nx.from_pandas_edgelist(
    transactions, 'sender', 'receiver',
    edge_attr='amount', create_using=nx.DiGraph()
)

# 분석
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"PageRank: {nx.pagerank(G)}")

# 의심 패턴 (자기 자신으로 돌아오는 경로)
print(f"Cycles: {list(nx.simple_cycles(G))}")
```

---

## 🟣 [전공자] — GNN (Graph Neural Network)

### 1. GNN 개요

#### 1.1 차이
- **NetworkX**: 통계적 분석 (degree, centrality)
- **GNN**: 학습 기반 (노드 → 벡터 → 분류)

#### 1.2 핵심 모델
- **GCN** (Graph Convolutional Network)
- **GraphSAGE** (Sample and Aggregate)
- **GAT** (Graph Attention Network)
- **알리페이**: Semi-supervised GAT

### 2. PyTorch Geometric 사용

```python
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.data import Data

# 데이터 구성
edge_index = torch.tensor([[0, 1, 1, 2], 
                            [1, 0, 2, 1]], dtype=torch.long)
x = torch.tensor([[1, 2], [3, 4], [5, 6]], dtype=torch.float)  # 노드 피처
y = torch.tensor([0, 1, 0], dtype=torch.long)  # 라벨 (사기/정상)

data = Data(x=x, edge_index=edge_index, y=y)

# GNN 모델
class FraudGNN(torch.nn.Module):
    def __init__(self, num_features, num_classes):
        super().__init__()
        self.conv1 = GCNConv(num_features, 16)
        self.conv2 = GCNConv(16, num_classes)
    
    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = F.dropout(x, training=self.training)
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

model = FraudGNN(num_features=2, num_classes=2)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# 학습
model.train()
for epoch in range(100):
    optimizer.zero_grad()
    out = model(data.x, data.edge_index)
    loss = F.nll_loss(out, data.y)
    loss.backward()
    optimizer.step()
```

### 3. GraphSAGE

```python
from torch_geometric.nn import SAGEConv

class FraudGraphSAGE(torch.nn.Module):
    def __init__(self, num_features, hidden_dim, num_classes):
        super().__init__()
        self.conv1 = SAGEConv(num_features, hidden_dim)
        self.conv2 = SAGEConv(hidden_dim, num_classes)
    
    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = F.dropout(x, p=0.5, training=self.training)
        x = self.conv2(x, edge_index)
        return x
```

### 4. GAT (Graph Attention)

```python
from torch_geometric.nn import GATConv

class FraudGAT(torch.nn.Module):
    def __init__(self, num_features, hidden_dim, num_classes, num_heads=8):
        super().__init__()
        self.conv1 = GATConv(num_features, hidden_dim, heads=num_heads)
        self.conv2 = GATConv(hidden_dim * num_heads, num_classes, heads=1)
    
    def forward(self, x, edge_index):
        x = F.dropout(x, p=0.6, training=self.training)
        x = F.elu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)
```

### 5. 알리페이 SemiGNN 방식

> 📄 Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.

핵심:
- **Semi-supervised**: 일부 라벨만 사용
- **Attention**: 중요 이웃에 가중치
- **Multi-view**: 카드/IP/디바이스 등 여러 그래프 결합

### 🟣 [전공자 심화] — GNN 기반 사기 탐지의 한계와 후속 연구

#### 원논문 한계

**Veličković et al. (2018) — GAT**
- 단일 타입 노드·엣지(homogeneous)만 가정 → 실 사기 그래프(계좌·카드·IP·디바이스 등)에는 부족.
- Attention 계수가 학습 데이터에 과적합되기 쉬워, 사기 패턴이 시간에 따라 바뀌는 도메인에서 generalization 저하.
- 깊은 layer 시 over-smoothing(노드 representation 동질화) 발생.

**Hamilton, Ying, & Leskovec (2017) — GraphSAGE**
- Neighbor sampling이 균일 random → 사기 탐지에서 중요한 *허브 노드*나 *희소 엣지*를 놓치기 쉽다.
- Inductive 학습이지만 학습 시점의 그래프 구조에 의존하여, 새로운 노드 타입 추가 시 재학습 필요.

**Wang et al. (2019) — SemiGNN**
- Multi-view를 단순 평균/attention으로 결합 → view 간 신뢰도 차이를 모델링하지 않음.
- 알리페이 내부 데이터로만 평가 → 공개 reproducibility 부족.

#### 비판 문헌

- **Dou, Y., Liu, Z., Sun, L., Deng, Y., Peng, H., & Yu, P. S. (2020). Enhancing graph neural network-based fraud detectors against camouflaged fraudsters. *CIKM 2020*.** arXiv:2008.08692 — 사기꾼이 정상 노드와의 *위장 엣지*를 추가하면 일반 GNN 성능이 급락. CARE-GNN 제안(label-aware similarity + RL 기반 neighbor selection).
- **Liu, Y., Ao, X., Qin, Z., Chi, J., Feng, J., Yang, H., & He, Q. (2021). Pick and Choose: A GNN-based imbalanced learning approach for fraud detection. *WWW 2021*.** — 사기 탐지의 class imbalance + 그래프 구조를 동시에 처리하는 PC-GNN 제안.
- **Tang, J., Li, J., Gao, Z., & Li, J. (2022). Rethinking graph neural networks for anomaly detection. *ICML 2022*.** arXiv:2205.15508 — 사기/이상 탐지에서 high-frequency spectral signal이 중요한데, 표준 GNN(GCN/GAT)은 low-pass filter라 본질적으로 부적합함을 이론적으로 보임. BWGNN 제안.
- **Liu, K., Dou, Y., Zhao, Y., et al. (2022). BOND: Benchmarking unsupervised outlier node detection on static attributed graphs. *NeurIPS 2022 Datasets and Benchmarks*.** — GNN 기반 이상 노드 탐지 14개 알고리즘 통합 벤치마크. 단순 비-GNN 기법(LOF 등)이 종종 deep GNN을 이기는 결과 보고.

#### 후속 연구 동향 (2020~)

- **Heterogeneous GNN**:
  - Wang, X., Ji, H., Shi, C., Wang, B., Cui, P., Yu, P. S., & Ye, Y. (2019). *Heterogeneous graph attention network (HAN).* WWW 2019. arXiv:1903.07293
  - Hu, Z., Dong, Y., Wang, K., & Sun, Y. (2020). *Heterogeneous Graph Transformer (HGT).* WWW 2020. arXiv:2003.01332 — 노드/엣지 타입별 transformer 구조.
- **FraudFraud / DGraph-Fin 벤치마크**:
  - Dou, Y. et al. (2020). CARE-GNN GitHub: https://github.com/YingtongDou/CARE-GNN — YelpChi, Amazon 사기 데이터 공개.
  - Huang, X., et al. (2022). *DGraph: A large-scale financial dataset for graph anomaly detection.* NeurIPS 2022. arXiv:2207.03579 — Finvolution(중국 P2P)의 370만 노드 실데이터.
- **Dynamic / Temporal GNN**: Rossi, E., Chamberlain, B., Frasca, F., et al. (2020). *Temporal Graph Networks for deep learning on dynamic graphs.* ICML 2020 GRL+ workshop. arXiv:2006.10637
- **Self-supervised graph AD**: Liu, Y., Li, Z., Pan, S., Gong, C., Zhou, C., & Karypis, G. (2021). *Anomaly detection on attributed networks via contrastive self-supervised learning.* IEEE TNNLS, 33(6).

#### 한국 적용 시 주의점

- 한국 금융권은 송금·계좌·디바이스가 모두 서로 다른 시스템에 저장됨 → 통합 그래프 구축 자체가 가장 큰 비용. Heterogeneous GNN을 적용하려면 데이터 거버넌스가 선행 조건.
- 보이스피싱 사기단은 위장 엣지를 만들기 쉬움(정상 결제·정상 송금 섞기) → 표준 GCN/GAT보다 CARE-GNN, PC-GNN, BWGNN처럼 *camouflage robust* 또는 *spectral* 접근이 적합.
- 카뱅/토스가 GNN을 사용한다고 *명시한 공식 자료는 확인되지 않음* — 강의·기술 블로그 기반 추정은 인용 시 주의 필요. 알리페이 SemiGNN, JD Finance 사례가 공개 학술 1차 자료의 거의 전부.
- 실시간 추론(<100ms)에는 full-graph GNN 부적합 → subgraph sampling 또는 사전 계산된 node embedding 활용이 표준.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 카뱅 AI FDS

#### 일반적인 그래프 기반 FDS 구조 (업계 표준 예시)
- 송금 네트워크 그래프
- 노드: 계좌
- 엣지: 송금
- GNN/Anomaly Detection 으로 학습

#### 카뱅 공식 발표 성과
- **카뱅 사기 예방 (시스템·집계 범위별)**: 2023년 87.7억(머신러닝, 카카오 금융안전보고서) / 123억(AI 시스템 전체, 전자신문) / 385억(FDS+보이스피싱, 아시아에이) / 2025년 358억(셀카 AI 인증 포함, 머니S)

> ⚠ 정정: 카뱅이 GNN을 명시적으로 사용한다는 출처는 확인 안 됨. "FDS 2세대" 라는 공식 명칭도 카뱅 자료에 없음. 위 그래프 구조는 일반적인 업계 표준 예시이며, 카뱅 구체 구현은 비공개.

### 🔍 보충 2 — Property Graph DB

#### Neo4j

```cypher
// 사기 의심 패턴 쿼리
MATCH (c:Card)-[:USED_BY]->(a:Account)-[:OWNS]->(d:Device)
WHERE c.fraud_score > 0.8
RETURN c, a, d
```

#### Apache TinkerPop (Gremlin)

```python
g.V().has('card_id', '1234').out('used_by').in('owns').path()
```

### 🔍 보충 3 — Community Detection 비교

| 알고리즘 | 특징 |
|---------|------|
| **Louvain** | 빠름, 모듈성 |
| **Leiden** | Louvain 개선 |
| **Girvan-Newman** | 계층적, 느림 |
| **Label Propagation** | 매우 빠름 |
| **InfoMap** | 정보이론 기반 |

### 🔍 보충 4 — Knowledge Graph for Fraud

```
[사람 A] --소유--> [전화번호 010-XXXX]
                       ↓
                      [기지국 위치]
                       ↓
[사람 B] --소유--> [전화번호 010-YYYY]

→ 같은 기지국 + 짧은 시간 = 의심
```

### 🔍 보충 5 — Real-Time Graph Processing

도구:
- **Apache Flink**: 실시간 스트림
- **Tigergraph**: 실시간 그래프 DB
- **JanusGraph**: 대규모 그래프
- **Amazon Neptune**: 클라우드

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 그래프 vs. 일반 ML?

**A.** **상황 따라 다름**.

- 일반 ML: 개별 거래 분석
- 그래프: 거래 간 관계 분석
- **사기는 본질적으로 관계적 → 그래프 유리**

### Q2. NetworkX vs. PyTorch Geometric?

**A.**

| | NetworkX | PyG |
|---|---|---|
| 용도 | 분석 | 학습 |
| 속도 | 느림 | 빠름 (GPU) |
| 학습 곡선 | 쉬움 | 어려움 |
| 추천 | 시작 | 본격 |

### Q3. 그래프가 너무 크면?

**A.**
- 샘플링 (GraphSAGE)
- 부분 그래프 분석
- 분산 처리 (Spark GraphX)

### Q4. Community Detection 어떤 알고리즘?

**A.** **Louvain이 표준**.
- 빠름
- 결과 안정
- 모듈성 최대화

### Q5. GNN이 진짜 좋은가?

**A.** **알려진 사기 + 관계 데이터** 있을 때.

- 카뱅 AI FDS: 시스템·집계 범위별 87.7~385억원 예방 (2023 카카오 금융안전보고서/전자신문/아시아에이; 2025년 358억) — 구체 알고리즘 비공개
- 알리페이: 사기 손실률 1천만 중 0.64건 (2020 발표)
- 단, 학습 비용 큼

### Q6. 그래프 데이터 어떻게 모음?

**A.**
- 거래 로그: 송금자 → 수취자
- 사용자 데이터: 친구 관계
- 기기 데이터: 디바이스 ID
- IP 데이터: IP 주소 공유

### Q7. 한국에서 그래프 사기 탐지 사례?

**A.**
- 카뱅: GNN (보이스피싱)
- 토스: 그래프 분석 (사기 계좌)
- 시중은행: AML 그래프

---

## 🎯 핵심 7가지

1. **사기 = 네트워크 현상**, 단일 거래만 봐선 못 잡음.
2. **그래프 8종**: 무방향/방향/가중/비가중/순환/비순환/희소/밀집.
3. **NetworkX** 가 Python 그래프 분석 표준.
4. **중심성 5종**: Degree, Betweenness, Closeness, PageRank, Clustering.
5. **Community Detection** (Louvain) 으로 사기 조직 탐지.
6. **GNN** (PyTorch Geometric) 이 최신 사기 탐지의 핵심.
7. **알리페이 SemiGAT** 가 학술 발표된 실전 사례 (카뱅 FDS의 구체 구현·세대 표기는 공개되지 않음).

---

## 📖 더 읽을거리

### 그래프
- NetworkX: https://networkx.org/
- PyTorch Geometric: https://pytorch-geometric.readthedocs.io/
- DGL: https://www.dgl.ai/

### 학술
- Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*. — **알리페이**.
- Hamilton, W. L., et al. (2017). Inductive representation learning on large graphs. *NeurIPS*. — **GraphSAGE**.
- Veličković, P., et al. (2018). Graph attention networks. *ICLR*. — **GAT**.

### 책
- Hamilton, W. L. (2020). *Graph Representation Learning*. — 무료.
- Easley, D., & Kleinberg, J. (2010). *Networks, Crowds, and Markets*. Cambridge UP.

### 도구
- Neo4j: https://neo4j.com/
- Gephi: https://gephi.org/ (시각화)

---

> **Ch4 끝**.
> 사기 탐지 = 규칙 + ML + DL + 그래프의 조합.
> 다음: **Ch5 「금융 AI 프로덕트 관리」** — MLOps, 파이프라인, 배포, 모니터링.
