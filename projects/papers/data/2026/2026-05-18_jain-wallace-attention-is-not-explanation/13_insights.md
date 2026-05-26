# 13 메타 통찰 12개 — "이해를 넘어서"

이 챕터는 paper 의 *내용* 보다 *meta-방법론* 과 *의미* 에 대한 12 개 통찰. paper 가 발표 후 7년간 분야를 어떻게 바꿨는지의 종합.

---

## 13.1 챕터 한 줄 요약

> **"단 2 개 검증 (H1 correlation + H2 counterfactual) 으로 7년치 attention-as-explanation 관행을 *명시적으로* 반박. 그러나 핵심 통찰은 *결과 자체* 보다 *검증 protocol 의 도입* — interpretability 의 *empirical* 검증 가능성을 학계에 강제 입력시킨 paradigm event."**

---

## 13.2 통찰 12개 한 페이지 정리

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Method (방법론 ─ 어떻게 검증했나)                                          │
│  #1: 단 2 검증으로 충분 ─ "explanation" 의 minimal definition          │
│  #2: Kendall τ + JSD/TVD ─ scale-free, sample-size-robust metric        │
│  #3: 12 datasets × 3 encoders ─ grid 의 결과가 paper 의 power           │
│                                                                          │
│  Theory (이론 ─ 왜 이렇게 작동하나)                                       │
│  #4: BiLSTM 의 contextualization 이 attention 의 explanation 파괴       │
│  #5: Average encoder = causal isolation ─ attention 이 작동하는 조건    │
│  #6: Adversarial existence = identifiability 부재의 증거                │
│                                                                          │
│  Empirical (실증 결과의 deeper truths)                                   │
│  #7: τ_g 와 τ_loo 의 일치 vs attention 과의 불일치 ─ noise 가 아니다    │
│  #8: Medical (MIMIC) 의 예외 ─ "high-precision token" 이 핵심          │
│  #9: bAbI 의 reasoning task 에서도 fail ─ task complexity 무관           │
│                                                                          │
│  Lineage (계보와 영향)                                                   │
│  #10: Wiegreffe-Pinter rebuttal ─ "not not" 의 정밀화 가치               │
│  #11: 7년간 1,500+ citation ─ "Lipton mythos" 의 empirical 후속         │
│  #12: Mechanistic interpretability 의 ideological 토대                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 13.3 통찰 #1 — 단 2 검증으로 충분

paper 의 결정적 우아함: **단 두 가지 hypothesis** (H1, H2) 만 사용. 더 많은 검증을 안 하는 것이 정확.

```
잘못된 접근 (학계 일부):
  - 5+ metrics 동시 평가
  - Bayesian ranking
  - User study with humans
  → 어떤 metric 이 "맞는 explanation" 인지 합의 부재.

paper 의 접근:
  - H1 (correlation): "다른 importance metric 과 *불일치* 하는가?"
  - H2 (counterfactual): "*다른* attention 으로 *같은* prediction 가능한가?"
  → 두 가지 *necessary* condition. 둘 중 하나만 fail 해도 explanation 무너짐.
```

**의미**: explanation 의 **minimal sufficient** test 정의 — 누구도 이 두 가지 통과 못 하면 "explanation" 라 부를 수 없음. 후속 paper 들이 모두 이 protocol 을 baseline 으로 채택.

---

## 13.4 통찰 #2 — Kendall τ + JSD/TVD 의 metric 디자인

paper 의 metric 선택은 의도된 robustness.

```
Pearson correlation 대신 Kendall τ:
  - Pearson: outlier 에 민감, Gaussian 가정.
  - Kendall: ranking 만 — robust, non-parametric, tie 처리.
  - 12 datasets 의 다양한 length × distribution 에 universal.

L2 distance 대신 TVD/JSD:
  - L2: scale-dependent, dimension 다르면 비교 불가.
  - TVD: probability mass 의 ratio — scale-free.
  - JSD: information-theoretic, finite (max log 2), symmetric.
  - 다양한 |Y| size (binary, 3-class, multi-class) 에서 직접 비교 가능.
```

**의미**: "metric design 의 잘못이라 결과 wrong" 의 *모든 가능한 반론* 을 사전에 차단. 후속 7 년 동안 이 metric 선택을 challenge 한 paper 거의 없음.

---

## 13.5 통찰 #3 — Grid 의 power

```
12 datasets × 3 encoders × 2 attention types = 72 configurations
```

각 configuration 에서 H1 + H2 결과. paper 의 power 는 **결과의 *방향* 이 grid 전체에서 일관** 한다는 것:

| 결과 | 일관성 |
|------|--------|
| BiLSTM + Additive: low τ + small ∆ŷ | 12/12 datasets |
| Average + Additive: high τ + medium ∆ŷ | 12/12 datasets |
| BiLSTM + Scaled Dot-Product: 동일 패턴 | 12/12 |

**의미**: "cherry-picking dataset 이라 결과 우연" 의 반론 차단. 72 configuration 전체에서 같은 방향 → grid 의 statistical inference power.

---

## 13.6 통찰 #4 — BiLSTM 의 contextualization 이 attention 파괴

```
BiLSTM 의 hidden state:
  h_t = LSTM(x_1, ..., x_T 의 *모든* 정보)
  → h_t 는 token t 의 정보 + 다른 token 의 정보 mix.
  
Attention 의 명목:
  α_t 가 크다 = "token t 가 중요" — 그러나 실제로는 h_t 가 중요.
  h_t 안에 다른 token 의 정보도 있다면? → attention 이 *위치* 만 가리키지 *원인* 가리키지 않음.
```

**Average encoder 와 대비**:
```
Average encoder 의 hidden state:
  h_t = ReLU(W * x_t + b)
  → h_t 가 *token t 만* 의 함수. 다른 token 와 independent.
  
Attention 의 의미:
  α_t 크다 = "token t 의 정보가 중요" — *원인* 직결.
```

**의미**: paper 의 핵심 mechanism — encoder 의 *mixing* 정도가 attention 의 explanation 능력 결정. CNN 은 중간 (local mixing). Transformer 의 self-attention 은 BiLSTM 보다 더 강한 mixing.

---

## 13.7 통찰 #5 — Average encoder = causal isolation

paper 의 average encoder 결과가 hypothesis "attention explains when h_t 가 token t 의 함수" 의 **명시적 confirm**:

| Encoder | Mean τ_g (SST) | Median ∆ŷ permute |
|---------|----------------|-------------------|
| BiLSTM | 0.40 | < 0.01 (low) |
| Average | 0.69 | > 0.10 (high) |

→ Average 의 attention 은 well-behaved. **paper 의 contribution**: explanation 가능 조건 (causal isolation between $h_t$ and $x_t$) 제시.

**의미**: future architecture design 에 직접 적용 가능 — "interpretable attention model 만들려면 encoder 의 mixing 줄이기". Lei et al. 2016 (sparse rationalization) 이 이 길.

---

## 13.8 통찰 #6 — Adversarial existence = identifiability 부재

paper 의 H2 결과의 *strongest* 형식:
> "*Any* model output can be reached by *many* attention distributions."

→ **Identifiability 부재**. 같은 prediction → 무한 attention 가능 → unique explanation 불가능.

**Brunner et al. 2019 (이후)** 가 이를 transformer 에 일반화: "Multi-head attention has even worse identifiability."

**의미**: 단순 *"attention is one explanation"* 이 아닌 *"attention 은 *유일* explanation 이 *아니다*"* — 더 강한 negative claim.

---

## 13.9 통찰 #7 — τ_g 와 τ_loo 의 일치 vs attention 과의 불일치

paper Figure 3, 4 의 핵심 결과:

```
Correlation(gradient, LOO) ≈ 0.5 (높음)
Correlation(attention, LOO) ≈ 0.2 (낮음)
Correlation(attention, gradient) ≈ 0.3 (낮음)
```

→ gradient 와 LOO 는 *서로 동의*. Attention 만 *다른 방향*.

**의미**: "metric 다 wrong" 의 반론 차단. 두 independent measure 가 서로 일치하는데 attention 만 다르다면 → attention 이 *다른 것* 측정 (positional pointer? heuristic feature?).

---

## 13.10 통찰 #8 — Medical (MIMIC) 의 예외

paper 의 ablation 발견: MIMIC Diabetes 에서 H1, H2 결과가 다른 dataset 보다 강함:

| Metric | SST (sentiment) | Diabetes (medical) |
|--------|-----------------|-------------------|
| τ_g (BiLSTM) | 0.40 ± 0.21 | **0.47 ± 0.06** |
| Adversarial 어려움 | 쉬움 | **어려움** |

→ Medical 의 high-precision token (e.g., "glucose 250", "HbA1c 7.5") 가 attention 의 *원인 표지*.

**의미**: explanation 능력은 dataset-specific. **"이 dataset 의 task structure 가 attention 의 unique explanation 강제** 하는가" 의 진단 가능.

---

## 13.11 통찰 #9 — bAbI 의 reasoning 에서도 fail

bAbI Task 2/3 = 2-3 fact 의 chained reasoning. "Sandra went to garden. Then Mary went to kitchen. Where is Sandra?" → "garden".

**paper 결과**: bAbI 1 (single fact) 의 τ_g = 0.23 — 그러나 bAbI 2/3 의 chained reasoning 도 비슷한 τ. Adversarial 도 가능.

→ "reasoning 가 어려운 task 에서는 attention 이 explanation" 가설 *반박*. Task complexity 무관.

**의미**: attention 의 explanation 능력은 *encoder mixing strength* 의 함수, 아니라 task complexity 의 함수가 아님.

---

## 13.12 통찰 #10 — Wiegreffe-Pinter rebuttal 의 가치

**Wiegreffe & Pinter (2019, EMNLP)**: "Attention is not not Explanation."

```
본 paper 의 fail 의 의미:
  - "Faithful" 의 정의에서 fail.
  - 그러나 "Plausible" (사람이 보기 합리) 에서는 OK.

Rebuttal 의 추가 실험:
  - Adversarial attention 의 **trained model 에서 학습 가능성**: 어렵다.
  - 즉 "임의로 만들 수 있다" ≠ "자연 학습 가능"
  - → attention 의 explanation 가치 *부분 유지*.
```

**의미**: paper 와 rebuttal 의 *combined* 결론 = "attention 은 *strongly* explain 안 함, *weakly* explain 함 (plausible) ". 학계가 이 정밀화에 도달.

---

## 13.13 통찰 #11 — 1,500+ citation 의 의미

paper 의 NAACL 2019 발표 이후 (5 년):
- Google Scholar citation: 1,500+
- "attention interpretability" 의 standard reference.
- 모든 후속 attention-as-explanation paper 의 §1 reference.

**비교**:
- Lipton (2016) "mythos of interpretability": citation 4,000+. 그러나 *conceptual critique*.
- **Jain-Wallace**: *empirical critique* — 1,500+ citation 으로 *후속 empirical work 의 protocol baseline*.

**의미**: empirical critique 의 power. Conceptual critique 는 무시되기 쉬움 — empirical evidence 의 force 가 학계 행동 변화.

---

## 13.14 통찰 #12 — Mechanistic interpretability 의 ideological 토대

**Mechanistic Interpretability (2022+)**: Anthropic 의 Bricken et al., Nanda 의 modular arithmetic transformer 등.

```
ANIE (2019) 의 message:
  "Surface-level attention weight 는 explanation 이 아니다."
  
Mech Interp 의 reaction:
  "→ Surface 보다 깊이 봐야 한다."
  "→ Internal circuit, residual stream, attention head function 의 *역할 분석*."
  "→ Surface attention vs internal computation 의 distinction 명시."

ACDC (2023), Sparse Feature Circuits (2024) 의 protocol = ANIE 의 *intervention-based* 검증 정신.
```

**의미**: ANIE 가 만든 *paradigm shift* — "surface saliency 는 충분하지 않다" → mechanistic interpretability 의 모든 work 의 motivating context.

---

## 13.15 통찰 한 줄 요약 (12 단)

1. **단 2 검증의 minimal sufficient power** — necessary conditions on explanation.
2. **Kendall τ + TVD/JSD** — metric 의 universal scale-free choice.
3. **12×3×2 grid** — 결과의 *구조적 일관성* 통한 power.
4. **BiLSTM 의 contextualization** = attention explanation 의 *barrier*.
5. **Average encoder** = causal isolation = attention 작동 조건.
6. **Adversarial existence** = identifiability 부재의 증거.
7. **τ_g ↔ τ_loo 일치 ↔ attention 만 불일치** = noise 가 아닌 *다른 것* 측정.
8. **MIMIC 예외** = dataset-specific structure 의 진단 가능성.
9. **bAbI 실패** = task complexity 와 attention explanation 무관.
10. **Wiegreffe-Pinter rebuttal** = plausibility vs faithfulness 정밀화.
11. **1,500+ citation** = empirical critique 의 학계 변화 power.
12. **Mech Interp 의 ideological 토대** = surface → internal 의 paradigm shift.

---

## 13.16 자기점검 (이 챕터)

### 핵심 3 가지

1. **paper 의 *결과* 와 *protocol* 중 후속 영향력이 큰 것은?**
2. **통찰 #4 (BiLSTM mixing) 의 함의가 transformer 에 어떻게 일반화?**
3. **통찰 #10 (Wiegreffe-Pinter rebuttal) 의 *combined* 결론은?**

### 답변

1. **Protocol (검증 방법)**. *결과* 는 BiLSTM-specific — Transformer 시대에 직접 적용 어려움 (multi-head + multi-layer). 그러나 *protocol* (H1 correlation + H2 counterfactual + grid evaluation) 은 *universal* — ACDC, SFC, mechanistic interpretability 모두 이 protocol 을 transformer 에 일반화하여 사용. paper 의 가장 큰 contribution = methodology, not specific finding.

2. **Transformer 에서는 *더 심함*** (Brunner et al. 2019). Multi-head 의 redundancy + multi-layer 의 residual mixing → 단일 attention head 의 weight 가 explanation 더 어려움. ACDC (2023) 의 "circuit-level attention" 으로 multi-component grouping 후에야 explanation 가능. 또 "attention head 마다 다른 function (Voita et al. 2019, Clark et al. 2019)" → 평균화 의미 X.

3. **"Attention 은 *strongly faithful* 은 아니다 ($\to$ paper 인정), 그러나 *plausible* 은 가능 (Wiegreffe-Pinter 인정)"**. 두 paper 모두 강한 주장 (전혀 explanation X 또는 완전 explanation O) 보다 *neutral middle ground* 합의: attention 은 *limited, contextual* explanation. 이 distinction 이 후속 학계 (ERASER 2020 의 plausibility metrics, Sparse rationalization 의 strict faithful) 의 분기점.

---

---

## 13.X 인터랙티브 — Insight 종합 시각화

```viz:anie-datasets-summary:title=Insight #3 시각화 — 12 datasets × 5 metrics grid,caption=Metric 셀렉터로 5 metric 전환. Insight #3 ("Grid 의 power") 의 단일 view. 12 dataset 의 일관된 패턴 — 단일 case 의 우연이 아닌 *구조적 현상*. 모든 metric 에서 BiLSTM 의 attention 이 일관적으로 *fail*, Average 는 일관적으로 *success* (encoder mixing 의 핵심).
```

```viz:anie-encoder-comparison:title=Insight #4-5 시각화 — Encoder Mixing Continuum,caption=Highlight 셀렉터. Insight #4 ("BiLSTM contextualization 이 attention 파괴") + Insight #5 ("Average encoder = causal isolation = attention 작동 조건") 의 정량 시각. BiLSTM (high mixing) → CNN (mid) → Average (none) 의 단조 증가 패턴 — encoder mixing strength 의 continuum 가설 확정.
```

---

다음 [14_code.md](14_code.md) — PyTorch 재현 코드.
