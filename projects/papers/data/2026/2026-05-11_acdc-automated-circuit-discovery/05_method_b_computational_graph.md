# 4. 방법론 해부 (b) — 계산 그래프 정의

> **🧒 한 줄 요약**: Computational graph 의 *정확 정의* — components + edges + topological order.


## 배경 사다리

이 파일은 Transformer 의 *forward pass* 가 어떻게 *DAG (directed acyclic graph)* 로 표현되는지를 정의한다. 이걸 이해하려면 ① Vaswani 2017 의 Transformer 블록 = "multi-head self-attention + MLP" 가 residual connection 으로 더해지는 구조, ② residual stream 의 *bandwidth* (그 안에서 head 들이 정보를 *읽고 쓰는* 공간이라는 Anthropic 2021 의 framework) 정도면 충분.

## 왜 이 정의가 필요한가

기존 *node-level* 활성 패칭은 "head 의 출력 전체" 를 한 단위로 본다. 이러면 head $h_{0,3}$ 이 head $h_{2,5}$ 에 주는 *직접 영향* 과 head $h_{0,3}$ 이 head $h_{1,7}$ 을 거쳐 head $h_{2,5}$ 에 주는 *간접 영향* 을 구분 못 한다. ACDC 는 회로의 본질이 *직접 영향들의 부분그래프* 라고 보고, 그래프 자체를 *edge 단위로* 재정의한다.

## 그래프 $G = (V, E)$ 의 구성

### 노드 집합 $V$

$$V = \{\text{embed}\} \cup \{h_{l,i} : 0 \le l < L,\ 0 \le i < H\} \cup \{m_l : 0 \le l < L\} \cup \{\text{logits}\}$$

- **기호 뜻**: $L$ = layer 수, $H$ = layer 당 head 수, $h_{l,i}$ = layer $l$ 의 head $i$ 의 출력 텐서, $m_l$ = layer $l$ 의 MLP 출력. GPT-2 small 은 $L = 12$, $H = 12$, 총 $|V| = 1 + 12 \cdot 12 + 12 + 1 = 158$ (token position 차원은 노드 정의에서 일단 묶음 — 실제 구현은 position 별로 더 잘게 쪼갠다).
- **일상 비유**: 큰 회의실의 좌석표. 각 좌석 = 한 노드. 회의 도중 누가 무슨 말을 했는지가 그 좌석의 *상태* (활성).
- **왜 이 형태**: head 와 MLP 를 분리해 *기능 단위* 의 입도를 보존. MLP 를 token-position 별로 더 쪼갤 수도 있지만 (token-MLP node), 보통 너무 많아져 비용 폭발.
- **조심할 점**: 노드의 입도 선택 자체가 *가정* 이다. SAE (Sparse Autoencoder) 시대에는 노드가 *feature* 단위로 더 잘게 쪼개진다 (Marks 2024 SFC). ACDC 의 입도는 head/MLP 라는 *고전 mech interp* 의 가정에 묶여 있다.

### 엣지 집합 $E$

$$E = \{(u, v) : u, v \in V,\ \text{$u$ 의 출력이 $v$ 의 residual stream 입력에 직접 더해짐}\}$$

- **기호 뜻**: $(u, v)$ 는 residual stream 의 *position-wise* addition 을 통해 $u$ 의 출력 텐서가 $v$ 의 입력에 들어가는 직접 경로. 예: layer 0 의 head $h_{0,3}$ 의 출력은 layer 1, 2, ..., L-1 의 모든 head 와 모든 MLP 의 입력에 직접 더해진다 — 즉 $h_{0,3}$ 는 그 모든 노드와 edge 로 이어진다. embed → 모든 layer 노드. 모든 layer 노드 → logits.
- **일상 비유**: 회의실의 *마이크 회로도*. 좌석 A 가 마이크를 통해 좌석 B 의 헤드폰에 직접 들리면 A→B 엣지. 좌석 A 가 좌석 C 의 헤드폰에 직접 들리고 C 가 다시 B 한테 말하면 A→C→B (간접). edge 는 *직접* 만 본다.
- **왜 이 형태**: Transformer 의 residual connection 이 *linear additive* — 모든 컴포넌트 출력의 합이 다음 컴포넌트의 입력. 이 linearity 가 *어떤 src → dst 의 직접 기여만 빼는* 개입을 가능케 한다. CNN/RNN 처럼 nonlinear gating 이 끼면 이 정의가 깨진다.
- **조심할 점**: edge 의 *방향* 은 forward pass 의 인과적 흐름. layer 가 같은 두 head 사이에는 edge 가 없다 (병렬). 또 edge 의 입도가 *전체 텐서* 라 — 한 edge 가 *모든 token position* 의 정보를 다 옮긴다. token-position 별 ablation 이 필요하면 ACDC 를 그 차원에서 더 잘게 돌려야 한다.

### 엣지 수 추정

GPT-2 small (12 layer × 12 head + 12 MLP) 에서 edge 수는 약 32,000. (cross-source: 논문 abstract 가 "ACDC selected 68 of the 32,000 edges in GPT-2 Small" 인용). 정확한 산식은 원문 본문 미열람으로 검증 불가하지만 대략:

- embed → 모든 노드: $12 \cdot 12 + 12 = 156$
- 각 layer $l$ 의 출력 → 그 위 모든 layer 의 노드: $\sum_{l=0}^{L-2} (H + 1) \cdot (L - 1 - l) \cdot (H + 1)$, position 차원 까지 곱하면 수 천에서 수 만 차수.

실제 구현은 *position 단위까지 쪼개지* 않고 *head/MLP 단위* 에서 멈추므로 32,000 이라는 수치가 plausible.

## 다른 접근으로 했다면

### 대안 1: node-level 그래프

$V$ 만 보고 $E$ 를 무시. 노드의 출력을 통째로 ablate. ROME / Activation Patching 의 원래 형태. **단점**: 직접 vs 간접 영향을 못 가른다.

### 대안 2: token-position 그래프

같은 head 라도 다른 token position 은 다른 노드. 회로의 해상도가 올라가지만 노드 수가 $L \cdot H \cdot T$ (T = 시퀀스 길이) 로 폭발. GPT-2 small × 시퀀스 50 = 7,200 노드 → 엣지 수백만. ACDC 가 처음 박은 *head/MLP 입도* 가 가장 비용-효과적이라는 점이 후속에서 표준이 됨.

### 대안 3: feature-level 그래프 (Sparse Feature Circuits, Marks 2024)

residual stream 을 SAE 로 분해해 학습된 feature 단위로 노드를 둠. 노드 수가 SAE feature 수 (수천-수만) 로 늘지만 *기능 단위* 가 명시적. ACDC 의 *head 단위* 보다 더 fine-grained, 그 대신 SAE 학습이라는 의존성 추가.

## 핵심 한 문장

> ACDC 의 그래프는 *head/MLP 단위* + *residual stream 의 linearity 가 만드는 직접 edge* 를 노드·엣지로 박은, mech interp 자동화의 *최소 단위 DAG* 다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Components 와 edges 분리?**
2. **Topological order 의 필요?**
3. **Edge count combinatorial?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
