# 17 Aftermath — Mech Interp 의 자동화 era (2023-2026)

> **🧒 본 챕터는 "그 후의 이야기"**: ACDC 발표 후 3 년간 *automated mechanistic interpretability* 의 진화. SFC / Patchscopes / SAE+circuit / LLM scale 까지.

## 17.1 챕터 한 줄 요약

> **"ACDC 2023 = manual mech interp 의 *industrialization trigger*. 2024-2026 의 SFC, Patchscopes, Anthropic SAE 모두 ACDC algorithm 위에 layer. LLM-scale interpretability 의 *technical foundation*."**

## 17.2 Timeline

```
2022.07: Olsson — Induction heads (manual)
2022.12: Elhage — Math framework

2023.04: Nanda — Progress Measures (Fourier circuit)
2023.07: Wang — IOI manual analysis
2023.11: ★ ACDC (Conmy, NeurIPS Spotlight)
2023.12: Anthropic SAE (Bricken)

2024.04: Chughtai — Activation Patching + Grokking
2024.05: Anthropic SAE scaling
2024.07: Patchscopes (LLM-scale)
2024.12: SFC — Sparse Feature Circuits

2025.05: Wilinski — TSFM mech interp (ICML)
2025+: Industry adoption (Anthropic Claude debugging, etc.)
2026.05: 본 deep dive
```

## 17.3 Phase 1 (2023-2024) — Direct Follow-ups

### 17.3.1 Anthropic SAE + ACDC 결합

```
2024 Q2: Anthropic 의 SAE feature analysis 가 ACDC algorithm 채택:
  - SAE features = "computational graph nodes"
  - Feature 간 edges = "feature dependencies"
  - ACDC algorithm 그대로 적용
  - 결과: 각 task 의 "responsible SAE features"
```

### 17.3.2 Patchscopes (Goldowsky-Dill 2024)

```
LLM-scale ACDC 의 approximation:
  - Block-level ablation (layer 단위)
  - Multi-token patching
  - Greedy search (vs exhaustive)
  - 7B / 13B LLM 의 1-2 hour analysis 가능

Trade-off:
  - 정밀도: full ACDC > Patchscopes
  - Scalability: Patchscopes >> full ACDC
```

### 17.3.3 Chughtai et al. 2024

```
ACDC 의 grokking 적용:
  - Nanda 2023 의 Fourier circuit 을 ACDC 로 자동 rediscover
  - Manual SVD analysis 가 *unnecessary*
  - Cross-validation: 두 paper 동일 결론
```

## 17.4 Phase 2 (2024-2025) — SAE + Circuit 통합

### 17.4.1 SFC (Marks et al. ICLR 2025)

```
ACDC + Anthropic SAE 의 *공식 결합*:
  1. Train SAE on transformer hidden states
  2. SAE features 로 computational graph 재정의
  3. ACDC algorithm 으로 feature graph 의 circuit 발견

Advantages:
  - More interpretable circuits (sparse features vs dense heads)
  - Cross-task feature reuse 식별
  - Concept-level mechanism understanding
```

### 17.4.2 Anthropic Production Scaling

```
2024-2025 의 Anthropic 의 production mech interp:
  - Claude-3 의 internal circuits 분석
  - Safety-critical behaviors 의 *mechanistic 검증*
  - Real-time monitoring (production deployment)

Tools:
  - ACDC algorithm (foundation)
  - SAE features (representation)
  - Custom dashboards (visualization)
```

## 17.5 Phase 3 (2025-2026) — Domain Expansion

### 17.5.1 Wilinski 2025 — TSFM Mech Interp (ICML)

```
ACDC 의 *시계열* 확장:
  - TSFM (Chronos, MOIRAI, TimesFM) 에 적용
  - Forecasting subtask 의 circuit 식별
  - "Seasonal head", "Trend head", "Regime detector head"

Wang 2024 (Grokked Transformers) 연결:
  - 두 paper 모두 ACDC algorithm 적용
  - 각자 다른 domain (TS vs reasoning) 의 circuit identification
```

### 17.5.2 Industry Adoption

```
Mech interp 의 industry use cases:
  - Anthropic: Constitutional AI 의 *circuit-level safety*
  - OpenAI: GPT-4 의 *hallucination circuit* 분석
  - DeepMind: Gemini 의 *reasoning step* 추적
  - Hugging Face: open-source interp 도구

→ ACDC 의 *industrial deployment* 확립.
```

## 17.6 4 Paradigm Shifts (ACDC trigger)

### Shift 1: "Manual → Automated"
- Pre-ACDC: 수주 - 수개월 manual analysis
- ACDC: 1 시간 자동
- Post: 모든 mech interp paper 가 ACDC-style algorithm

### Shift 2: "Node → Edge granularity"
- Pre-ACDC: head/layer ablation (coarse)
- ACDC: edge-level (fine-grained information flow)
- Post: edge-based 가 standard

### Shift 3: "Single-task → Multi-task"
- Pre-ACDC: 한 paper = 한 task 분석
- ACDC: 5 tasks parallel
- Post: cross-task circuit comparison standard

### Shift 4: "Researcher-bound → Reproducible"
- Pre-ACDC: 결과 reproducibility 의문
- ACDC: deterministic algorithm
- Post: 100% reproducibility 표준

## 17.7 Citation Trajectory (추정)

```
2023.11 (NeurIPS 발표):     0
2024.06:                ~250
2024.12:                ~480
2025.06:                ~720
2025.12:                ~900
2026.05:              ~1,000
```

> 합리적 estimate. NeurIPS 2023 Spotlight + mech interp era 의 핵심 paper.

## 17.8 자기점검

### 핵심 3 가지

1. **ACDC 의 *3 년 후 영향력* 의 *most critical*?**
2. **SFC 가 *ACDC 의 단순 extension* 인 이유?**
3. **Patchscopes 의 *approximation* 의 학술적 의의?**

### 답변

1. **"Mech interp 의 democratization"**. Pre-ACDC: *Anthropic-tier expert team* 의 *수개월* — 학계 진입 장벽 극도. ACDC: *학부생 + 1 day* — *수십 배 더 많은 연구자* 참여 가능. **결과**: 학계의 *circuit identification* 결과 폭증, *cross-replication* 가능, mech interp 가 *thriving field* 로 변모.

2. **ACDC algorithm 의 *direct inheritance***. SFC 의 *3 핵심 component*: (a) computational graph (ACDC: heads/MLPs, SFC: SAE features), (b) edge-by-edge ablation (ACDC 동일), (c) threshold pruning (ACDC 동일). **차이점**: 단지 "*graph nodes 가 무엇*" — heads vs features. → SFC = "ACDC on SAE graph".

3. **Scale-precision trade-off 의 *명시적 design***. Full ACDC: GPT-2 small 1.5h, LLaMA-7B 2 days. **Patchscopes** = "*partial ablation* + greedy + block-level" → LLaMA-7B 의 1-2h. *완전한 circuit* 못 찾지만 *high-recall coarse 식별* 가능. **학계 의의**: "*scale 시 어떤 precision 포기 가능*" 의 *engineering 정량화*.
