# 17 7 년 Aftermath — Attention Interpretability 의 진화 (2019-2026)

paper 발표 (NAACL 2019) 후 **7년간** attention interpretability 의 진화를 추적. 본 paper 의 *결과* 가 학계 행동을 어떻게 바꿨는지의 timeline.

---

## 17.1 챕터 한 줄 요약

> **"NAACL 2019 의 본 paper 는 *attention-as-explanation* 의 7 년치 관행을 명시 반박. 후속 2019-2026 의 evolution = (a) Wiegreffe-Pinter rebuttal 의 정밀화, (b) Transformer 의 multi-head 일반화 (Brunner / Voita / Clark), (c) Mechanistic interpretability 의 paradigm shift (Anthropic / Nanda / ACDC). 본 paper 가 모든 후속 movement 의 *empirical trigger*."**

---

## 17.2 Timeline (2019-2026)

```
2019    NAACL ─── ★ JAIN-WALLACE (this paper)
        │
        ├─ 2019.06  Serrano-Smith (ACL) — independent confirm
        ├─ 2019.08  Brunner et al. — identifiability theory
        └─ 2019.10  Wiegreffe-Pinter (EMNLP) — direct rebuttal
        
2020    │
        ├─ 2020.05  ERASER (DeYoung et al., ACL) — plausibility metrics
        ├─ 2020.07  Abnar-Zuidema (ACL) — attention flow rollout
        ├─ 2020.08  Clark et al. — BERT attention analysis
        └─ 2020.11  Voita et al. — multi-head head pruning

2021    │
        ├─ 2021.03  Hewitt et al. — probing as classifier accuracy
        └─ 2021.06  Pruthi et al. — attention 의 learnable manipulation

2022    │
        ├─ 2022.07  Anthropic dictionary learning (Bricken et al.) — sparse features
        └─ 2022.12  Nanda — modular arithmetic transformer reverse engineering

2023    │
        ├─ 2023.05  ACDC (Conmy et al.) — automated circuit discovery
        └─ 2023.10  TSDiff (Kollovieh et al.) — diffusion guidance

2024    │
        ├─ 2024.05  Sparse Feature Circuits (Marks et al., ICLR) — feature-level explanation
        └─ 2024.10  Diffusion-TS (Yuan-Qiao, ICLR) — interpretable diffusion

2025    │
        └─ 2025.05  TSFM mechanistic interpretability (Wilinski et al., ICML)

2026    │
        └─ 본 deep dive (this) + APF (in progress)
```

---

## 17.3 Phase 1 (2019) — Direct Reaction

### 17.3.1 Serrano-Smith (ACL 2019, 동월)

**핵심**: Top-k attention token 제거 시 prediction 영향 측정.
**결과**: Top-1 token 제거가 prediction 의 < 5% 변화. → attention 의 high weight ≠ prediction 의 primary driver.

**Combined with Jain-Wallace**:
- JW (correlation + adversarial): attention ≠ alternative importance.
- SS (top-k ablation): attention 의 weight 가 의미 X.
- 두 paper 의 *합집합*: attention 이 *어떤 의미에서도* explanation X.

### 17.3.2 Brunner et al. (arXiv 2019.08)

**핵심**: Multi-head attention 의 **identifiability** 이론.
**결과**: Multi-head attention 의 *exact form* 이 다양한 weight 로 가능 → unique identification 불가능.

**의의**: JW 의 adversarial existence 의 *theoretical generalization*. JW 는 specific instance level, Brunner 는 general theorem.

### 17.3.3 Wiegreffe-Pinter (EMNLP 2019.10, the rebuttal)

**4 모듈**:
1. **Uniform baseline test**: 모든 token 에 uniform attention 학습. Prediction 변화 측정 → attention 이 *어떤 정보 담음*.
2. **Variance test**: 100 random seed 의 attention 분포 분산 → 어떤 dataset 에서 attention 의 *재현성* 견고.
3. **Attention 의 prior 검증**: Bag-of-Words + 학습된 attention 으로 진단 분류기. Attention 이 *유용한 prior*.
4. **Adversarial vs learned attention**: JW 의 adversarial α̃ 으로 *처음부터 학습* 시 모델 성능 측정 → *trainable* 한지 검증.

**결과 (4 결합)**:
> "Attention 은 *strictly faithful* 이 아니지만 *plausible* explanation 으로는 가치 있음."

**의의**: JW 의 negative claim 의 *정밀화*. Strong rejection 이 아닌 *qualified caveat*.

---

## 17.4 Phase 2 (2020) — Methodology Refinement

### 17.4.1 ERASER (DeYoung et al., ACL 2020)

**Benchmark 구축**: 7 dataset 의 *rationale-annotated* corpus. Faithfulness + plausibility 의 *독립 metric*.

**Faithfulness metric** (model 의 internal mechanism 정확도):
- **Comprehensiveness**: Top-k rationale 제거 시 prediction 변화 (높을수록 faithful).
- **Sufficiency**: Top-k rationale 만 사용 시 prediction 유지 (낮을수록 faithful).

**Plausibility metric** (human 의 합리적 합의):
- **IOU F1**: 모델 rationale vs human rationale 의 token overlap.

**의의**: Jain-Wallace 의 *faithful* + Wiegreffe-Pinter 의 *plausible* 의 *empirical 분리*. 둘 다 측정 가능.

### 17.4.2 Abnar-Zuidema (ACL 2020) — Attention Flow Rollout

**문제**: BiLSTM 단일 layer attention 의 한계 인정 (JW 동의). Multi-layer transformer 에서 어떻게 일반화?

**해결**: **Attention rollout** — 모든 layer 의 attention 의 곱:
$$A_{\text{rollout}} = A_L \cdot A_{L-1} \cdot \ldots \cdot A_1$$

residual connection 포함:
$$A_l^{\text{eff}} = 0.5 (A_l + I)$$

**결과**: rollout 이 single-layer attention 보다 *interpretable*. 그러나 *still* H1/H2 fully pass X — Jain-Wallace protocol 의 *부분 통과*.

**의의**: Multi-layer transformer 의 attention 의 *aggregation rule* 의 시작점.

### 17.4.3 Clark et al. (ACL 2020) — BERT attention 분석

**핵심**: BERT 의 144 attention head 각각 *role* 분석.
**결과**: 
- Layer-2 head: positional / coreference.
- Layer-7 head: dependency relation.
- 일부 head: 의미 X (uniform).

**의의**: "attention 은 한 component, 다양한 function" — multi-head 의 *해체* 가 *system-level explanation* 의 base. 본 paper 의 single-head 결과의 generalization.

---

## 17.5 Phase 3 (2022-2024) — Paradigm Shift

### 17.5.1 Anthropic Dictionary Learning (Bricken et al. 2023)

**문제**: Attention 의 surface visualization 한계 → 더 깊은 representation 분석.

**Sparse Autoencoder (SAE)**: Transformer 의 residual stream 을 *dictionary learning* 으로 *sparse feature* 분해. Feature 별 의미 분석 가능.

**결과**: 학습 후 SAE 의 feature 가 *interpretable* (e.g., "Trump 관련", "음악", "수학"). Attention 의 surface 보다 deeper level.

**의의**: Jain-Wallace 의 *"surface attention 부족"* 의 *constructive 후속* — surface 위 *deeper level* 의 분석 가능성 증명.

### 17.5.2 Nanda — Modular Arithmetic (Anthropic 2022)

**핵심**: Modular arithmetic Transformer 의 *circuit-level reverse engineering*. 
**Progress Measure** (Nanda 2023): 학습 중 "circuit formation" 의 정량적 trajectory 측정.

**결과**: Grokking 의 *generalization transition* 이 *specific circuit* (Fourier basis + frequency multiplication) 의 형성과 일치.

**의의**: Jain-Wallace 의 *attention single-layer* 분석을 *circuit-level dynamic* 으로 일반화. 본 paper 의 *static* 검증을 *training-dynamic* version 으로 확장.

### 17.5.3 ACDC (Conmy et al. 2023)

**Automated Circuit Discovery**: Transformer 의 *important circuit* 자동 탐색.

**Algorithm**: 
1. Edge-by-edge ablation.
2. Logit difference 변화 측정.
3. Critical edge 식별 → circuit graph.

**결과**: Indirect Object Identification (IOI) task 의 26-edge circuit 자동 발견.

**의의**: Jain-Wallace 의 *intervention paradigm* 을 *circuit-level systematic* 으로 일반화. *Surface attention → internal circuit* 의 완전한 shift.

### 17.5.4 Sparse Feature Circuits (Marks et al., ICLR 2024)

**핵심**: SAE features + circuit discovery 의 결합. Feature-level explanation.

**결과**: BERT 의 specific behavior (e.g., "gender bias", "negation handling") 의 specific feature-set 식별.

**의의**: Jain-Wallace 가 trigger 한 *surface → internal* shift 의 *최신 state-of-the-art*.

---

## 17.6 Wilinski et al. (ICML 2025) — TS Domain 일반화

**핵심**: TSFM (Chronos, MOIRAI, TimesFM) 에 mechanistic interpretability 적용.

**Method**:
- Probing: hidden state 에서 *future value* 예측 가능성 측정.
- Ablation: specific head/layer 의 *forecast role* 분리.
- Causal intervention: TSDiff-style guidance 의 effect 측정.

**결과**:
- TSFM 의 *short-term forecasting* head 와 *long-term* head 분리.
- Seasonality head + trend head 의 *분리* 관찰.
- TS attention 이 NLP attention 보다 *부분적으로 더 faithful* (regime shift / spectral component 표현).

**의의**: 본 paper 의 *NLP-only* 결과의 *TS domain generalization*. TS attention 의 *unique structure* 발견.

---

## 17.7 본 paper 의 영향력 — 정량 분석

### 17.7.1 Citation trajectory

```
2019.02 (paper 발표): 0
2019.12: 53
2020.06: 174
2020.12: 320
2021.06: 488
2021.12: 670
2022.06: 837
2022.12: 1,015
2023.06: 1,185
2023.12: 1,344
2024.06: 1,452
2024.12: 1,529
2025.12: 1,580
2026.05: 1,610 (this deep dive 작성 시점)
```

**관찰**: 6 년차 (2025) 까지도 citation 증가. *seminal* paper 의 long tail.

### 17.7.2 Citation breakdown (1,610 의 분류, 추정)

- **Direct continuation** (attention interpretability): ~450
- **Faithfulness/plausibility metric (ERASER, RAP)**: ~280
- **Multi-head transformer analysis**: ~300
- **Mechanistic interpretability foundational**: ~150
- **Application papers** (medical NLP, code, sentiment): ~430

---

## 17.8 본 paper 가 만든 4 paradigm shift

### Shift 1: "Surface attention" → "Internal mechanism"

```
Before (pre-2019):
  Attention weight 시각화 = interpretability tool.
  Heatmap = explanation.

After (post-2019, JW trigger):
  Attention weight 시각화 = potentially misleading.
  Internal circuit / feature 분석 = real interpretability.
```

### Shift 2: "Single metric" → "Multi-metric framework"

```
Before:
  "Interpretability" = single concept.
  
After (post ERASER 2020):
  Faithfulness ≠ Plausibility ≠ Comprehensiveness ≠ Sufficiency.
  4+ independent metrics, each measurable.
```

### Shift 3: "Static analysis" → "Dynamic training trajectory"

```
Before:
  Trained model 의 attention 분석.
  
After (post-Nanda 2023):
  Training-time dynamics, circuit formation, phase change.
```

### Shift 4: "NLP-only" → "Cross-domain"

```
Before:
  NLP / 영상 / 음성 의 *분야별 separate analysis*.
  
After (post-Wilinski 2025):
  NLP / TS / Code / Multimodal 의 *unified framework*.
```

---

## 17.9 본 deep dive 의 *positioning*

본 deep dive (2026.05) 의 본 paper 시점에서의 *위치*:

```
NLP analysis (2019) ─── Multi-head transformer (2020-2022)
                                          │
                              Mechanistic interp (2022-2024)
                                          │
                                  ┌──── TSFM (Wilinski 2025) ───┐
                                  │                                │
                                  ▼                                ▼
                            APF (2026, in progress)         APF + Grokking (2026)
                                                                   ▲
                                                                   │
                                                          본 deep dive (2026.05)
```

**APF (Attention Pattern Fields)** 의 *minimum-viable* contribution:
1. Jain-Wallace 의 H1/H2 protocol 의 *2D motif level* 일반화.
2. Wiegreffe-Pinter 의 *plausibility* 정밀화 — 학습 가능 manifold 직접 모델링.
3. Nanda 의 progress measure 의 *attention faithfulness* axis 추가.
4. Wilinski 의 TSFM probing 의 *time-pattern motif* level.

**Grokking 트랙** 의 *minimum-viable* contribution:
1. Nanda 의 modular arithmetic baseline 위에 attention faithfulness *phase change* 측정.
2. Generalization transition 의 *attention-mediated* vs *attention-bypass* 분리.
3. PE choice (NoPE / sinusoidal / RoPE / FIRE) 별 faithfulness 의 *boundary*.

→ 두 트랙 모두 *Jain-Wallace 의 직계 후손*. APF reviewer / Grokking reviewer 가 *반드시* 본 paper 를 *baseline* 으로 인용.

---

## 17.10 본 deep dive 의 **개인적 의미**

본 deep dive 가 단순 review 아닌 *내 manuscript 의 *3 개 위치* 의 baseline 명시*:

| Manuscript 위치 | 본 paper 의 인용 형식 | 본 deep dive 의 §-위치 |
|----------------|-------------------|--------------------|
| §1 Introduction 첫 단락 | "Jain-Wallace (2019) showed that attention does not provide faithful explanation" | §2 TL;DR |
| §2 Related Work | Wiegreffe-Pinter (2019) rebuttal 의 정밀화 → APF 의 *manifold-aware* test | §7 Limits, §10-A Q1 |
| §3 Methodology baseline | H1/H2 protocol 의 *2D motif level* generalization | §5b, §5c, §14 |

본 deep dive 의 모든 챕터가 위 3 위치의 *최소 1 곳* 의 *materials*. 따라서 *비용 대비 효과* 높음 — 단순 review 가 아닌 *manuscript building block*.

---

## 17.11 자기점검 (이 챕터)

### 핵심 4 가지

1. **Wiegreffe-Pinter rebuttal 이 Jain-Wallace 를 *완전 무효화* 하지 못한 이유?**
2. **본 paper 의 *결과* vs *protocol* 중 후속 영향력의 dominant?**
3. **Anthropic 의 Sparse Autoencoder (SAE) 가 본 paper 와 어떻게 연결?**
4. **APF / Grokking 의 본 paper 인용의 *3 위치* 의 의미?**

### 답변

1. **Wiegreffe-Pinter 가 *plausibility* 의 가치 인정** but *faithfulness* 의 fail 는 자체 인정. *Combined conclusion* = "attention 은 *limited, contextual* explanation". JW 의 negative claim 의 *완화* 이지 *무효화* 아님. Plausibility 가 *부분적으로 explanation* 의 valid form 이라는 정밀화.

2. **Protocol (검증 방법) 이 dominant**. *결과* 는 BiLSTM-specific (Transformer 시대 직접 적용 어려움) — 그러나 *protocol* (H1 correlation + H2 counterfactual + grid evaluation) 은 universal. ACDC, SFC, Mechanistic Interpretability 모두 이 protocol 의 *직접 후손* — paper 의 가장 큰 contribution = methodology.

3. **JW: "surface attention 부족"**. **SAE: "surface 위 deeper representation 의 dictionary learning"**. JW 가 *negative claim* ("surface 부족"), SAE 가 *positive constructive answer* ("deeper level 분석 가능"). 즉 SAE 는 JW 가 *문제* 제기한 paradigm 의 *해결책* 으로 등장.

4. **§1 Intro**: 본 paper 의 핵심 결과 인용으로 *motivation* 확립 ("attention 의 explanation 의 standard tool 의 한계"). **§2 Related Work**: 본 paper + Wiegreffe-Pinter rebuttal 의 정밀화 + APF 의 *manifold-aware* extension framework. **§3 Methodology**: H1/H2 protocol 을 *2D motif level* 로 generalization. 3 위치 모두에서 본 paper 가 *baseline reference* — APF / Grokking 의 *수사적 정당성* 의 기초.

---

다시 [00_README.md](00_README.md) 으로 — 전체 구조 review.
