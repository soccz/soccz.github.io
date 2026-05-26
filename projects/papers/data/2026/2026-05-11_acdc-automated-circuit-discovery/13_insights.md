# 13 메타 통찰 12개 — "이해를 넘어서"

> **🧒 본 챕터는 *paper 의 결과 너머의 의미***: ACDC (Conmy et al. NeurIPS 2023 Spotlight) 의 *meta-방법론* 과 *학계 영향* 의 12 가지.

## 13.1 챕터 한 줄 요약

> **"ACDC = mechanistic interpretability 의 *manual circuit identification* → *automated discovery* 의 paradigm shift. IOI task 의 26-edge circuit 자동 발견 + 일반화 가능한 algorithm = LLM scale interp 의 *technical enabler*."**

## 13.2 통찰 12 개

```
Method:
  #1 Manual → Automated paradigm shift
  #2 Edge-by-edge (vs node-by-node) granularity
  #3 Resampling ablation 의 distribution preservation

Theory:
  #4 Circuit = minimal sufficient subgraph notion
  #5 KL divergence metric 의 information-theoretic precision
  #6 Threshold-based pruning 의 binary decision

Empirical:
  #7 IOI 의 26-edge minimal circuit
  #8 GPT-2 small (124M) 의 scalable analysis
  #9 다양한 task 일반화 (greater-than, induction 등)

Lineage:
  #10 Olsson 2022 (induction heads manual) 의 automation
  #11 Wang 2022 (IOI task definition) 의 algorithm enabler
  #12 SFC 2024 (SAE + circuit) 의 direct precursor
```

## 13.3 통찰 #1 — Manual → Automated paradigm shift

```
2022-2023 Manual era:
  - Olsson 2022: Induction heads 수동 식별 (Anthropic team 수개월)
  - Wang 2022: IOI 의 *expert team* 의 1년 분석
  - Nanda 2023: modular arithmetic 의 *SVD + Fourier 수동*

2023 ACDC (★ this paper):
  - Algorithm: 1시간 자동 실행
  - 동일 결과 (induction heads, IOI circuit) 도출
  - Reproducibility 보장
```

**의의**: *mechanistic interp 의 industrialization*. *Researcher-bound* → *algorithmic*.

## 13.4 통찰 #2 — Edge-by-edge granularity

```
Node ablation (less precise):
  Remove entire attention head 7 → measure performance drop
  Issue: head 7 이 *여러 paths* 에 참여 — separation 불가

Edge ablation (ACDC):
  Remove specific edge (head 7 → head 12)
  → information path 의 *specific channel* 만 차단
  → multiple paths 의 *independent contribution* 측정
```

→ Information theory 의 *channel-level decomposition*.

## 13.5 통찰 #3 — Resampling distribution preservation

```
Random ablation (naive):
  Replace activation with random noise
  Issue: OOD activation → nonsense output → uninformative

Mean ablation:
  Replace with mean activation across dataset
  Issue: too aggressive (loses all signal)

★ Resampling (ACDC):
  Replace with activation from *different but similar* input
  → in-distribution baseline
  → meaningful causal effect measurement
```

## 13.6 통찰 #4 — Circuit = minimal sufficient subgraph

```
Definition (paper §3):
  Circuit C* = minimal subgraph of G such that:
    1. Sufficient: ablating non-C* edges → no performance loss
    2. Necessary: ablating any edge in C* → performance loss

Mathematical: C* = argmin_C |C| s.t. KL(y_full || y_C) < τ
```

→ *Occam's razor* + *causal sufficiency* combined.

## 13.7 통찰 #5 — KL divergence precision

```
Alternatives considered:
  - Accuracy drop: discrete, insensitive to confidence
  - L2 loss: scale-dependent
  - Cross-entropy: similar to KL

ACDC choice: KL(clean || ablated)
  - Bounded above by full divergence
  - Information-theoretic interpretation
  - Sensitive to confidence shifts
```

## 13.8 통찰 #6 — Threshold-based binary decision

```
For each edge e:
  If KL(clean || ablate(e)) < τ: edge unnecessary → remove
  Else: edge necessary → keep

τ tuning:
  Small τ: keep more edges (less aggressive pruning)
  Large τ: remove more edges (aggressive)
  
ACDC default: τ = 0.06 (empirically chosen for IOI)
```

## 13.9 통찰 #7 — IOI 26-edge minimal circuit

```
IOI task: "Then, Mary and John went to the store. John gave a drink to ___"
Answer: "Mary"

ACDC discovered circuit (26 edges):
  - Subject tracking heads: 4 attention heads
  - Object tracking heads: 6 heads
  - Indirect object identification: 3 heads
  - Name mover heads: 5 heads
  - S-Inhibition heads: 4 heads
  - Others: 4

Total GPT-2 small heads: 144 (12 layers × 12 heads)
Circuit ratio: 26 / 144 = 18% of heads involved (sparse)
```

## 13.10 통찰 #8 — GPT-2 small scalability

```
ACDC tested on GPT-2 small (124M params):
  - Total edges: ~10,000 (rough estimate)
  - Iterations to converge: ~50
  - Time: 1-2 hours on single GPU

Scalability:
  - GPT-2 medium (350M): 5-10 hours
  - LLaMA-7B (7B): 1-2 days
  - Larger models: need approximations (Patchscopes 2024)
```

## 13.11 통찰 #9 — Task generalization

```
ACDC validated on multiple tasks:
  - IOI (Indirect Object Identification)
  - Greater-than (numerical comparison)
  - Induction (sequence completion)
  - Subject-Verb Agreement
  - Docstring completion
  
All tasks: ACDC discovered minimal circuits within 1 hour.
```

→ *general-purpose* circuit discovery.

## 13.12 통찰 #10 — Olsson 2022 의 automation

```
Olsson 2022 (Induction heads):
  - Manual identification: weeks of researcher effort
  - 결과: "Layer 2, head 7" — specific heads identified

★ ACDC 2023:
  - Automated rediscovery of induction heads
  - Time: 1 hour
  - Bonus: 자동으로 *induction-supporting edges* identification
```

## 13.13 통찰 #11 — Wang 2022 IOI 의 enabler

```
Wang 2022:
  - IOI task 정의
  - Manual circuit analysis
  - 1년 expert team effort

★ ACDC 2023:
  - Wang의 task definition 사용
  - Algorithm 으로 *동일 circuit* 자동 발견
  - "task → circuit" pipeline automated
```

→ *Task-specific manual* → *task-general automated*.

## 13.14 통찰 #12 — SFC 2024 direct precursor

```
SFC (Sparse Feature Circuits, Marks 2024 ICLR 2025):
  - SAE (Bricken 2023) + ACDC 결합
  - SAE features 사이의 circuit 발견
  - ACDC algorithm 의 *SAE feature graph* 적용

ACDC role:
  - Computational graph definition (components + edges)
  - Edge-by-edge ablation algorithm
  - Threshold-based pruning
  → SFC 가 *모든 컴포넌트 inherit*
```

## 13.15 자기점검

### 핵심 3 가지

1. **ACDC 의 *automated* 의 *practical implications*?**
2. **IOI circuit 의 *18% sparsity* 의 의미?**
3. **SFC 2024 와의 *연속성*?**

### 답변

1. ***학계 진입 장벽 dramatically 낮춤***. Pre-ACDC: mechanistic interp = "Anthropic + DeepMind 의 PhD team 의 *수개월* 작업". Post-ACDC: *학부생 + 1 day 분석* 으로 *similar 깊이* circuit identification 가능. *학계 democratization* + *replication studies* 폭증.

2. **Circuit 의 *sparse nature* 의 *empirical evidence***. 144 heads 중 *26 (18%)* 만 IOI 에 contribute → "*specialized circuits* 의 sparse encoding". 같은 head 가 *다른 task* 에 다른 role — *multi-task circuit overlap* 추가 연구 자극. Mechanistic interp 의 *modular structure* hypothesis.

3. **Direct architectural inheritance**. SFC 가 ACDC algorithm 을 *SAE feature graph* 에 *그대로 적용*. ACDC 의 *edge-by-edge ablation*, *KL divergence metric*, *threshold pruning* 모두 inherit. → ACDC 가 *foundational algorithm*, SFC 가 *application layer*.

---

## 인터랙티브 시각화

```viz:acdc-algorithm-flow:title=Insight — Algorithm,caption=Step.
```

```viz:acdc-ioi-circuit:title=Insight — IOI circuit,caption=Highlight.
```

```viz:acdc-threshold-sweep:title=Insight — τ Goldilocks,caption=τ slider.
```

