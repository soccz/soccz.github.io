# 13 Ablation Study — Table 4 (Section 5.2)

paper p.7 의 Section 5.2. 3 component 의 개별 기여 분석.

## Table 4 — Component Ablation (paper p.7)

paper Table 4 정확 인용. 4 datasets × 3 quantiles × 4 settings. **lower = better**.

### Electricity & Wind

| Setting | Elec 0.5 | 0.7 | 0.9 | Wind 0.5 | 0.7 | 0.9 |
|---------|----------|-----|-----|----------|-----|-----|
| w/o D-D Decomp. | 0.7629 | 0.8890 | 0.6738 | 1.0746 | 1.2476 | 1.7182 |
| w/o GMM Decomp. | 0.9890 | 0.9125 | 0.5570 | 0.9782 | 0.9575 | 0.4451 |
| w/o Fusion Transformer | 0.9389 | 0.9104 | 0.9885 | 0.8954 | 0.8861 | 1.0460 |
| **QuantileFormer (full)** | **0.7546** | **0.3330** | **0.5121** | **0.8403** | **0.7346** | **0.3369** |

### Solar & Traffic

| Setting | Solar 0.5 | 0.7 | 0.9 | Traffic 0.5 | 0.7 | 0.9 |
|---------|-----------|-----|-----|-------------|-----|-----|
| w/o D-D Decomp. | 1.3440 | 1.2463 | 0.6142 | 0.9626 | 1.3814 | 0.5497 |
| w/o GMM Decomp. | 1.0831 | 1.1991 | 0.7914 | 1.3995 | 0.8849 | 0.5837 |
| w/o Fusion Transformer | 1.0708 | 1.1930 | 0.7289 | 1.5161 | 1.1245 | 0.8275 |
| **QuantileFormer (full)** | **1.0641** | **1.1832** | **0.5883** | **0.8489** | **0.8489** | **0.4688** |

(paper Table 4, p.7)

---

## 핵심 발견

paper p.7:
> In the results, removing each component results in performance drop in different levels, showcasing the effectiveness of the proposed framework. We conduct experiments without the drift-divergence decomposition, the Gaussian mixture model decomposition and the fusion Transformer module respectively.

### 3 Component 의 기여도 분석

각 setting 의 q-risk 가 full QuantileFormer 보다 **얼마나 더 나쁜가**:

**Electricity (predict 0.5):**
- Full: 0.7546
- w/o D-D: 0.7629 (+1.1%)
- w/o GMM: 0.9890 (+31%)
- w/o Fusion: 0.9389 (+24%)

**Wind (predict 0.9):**
- Full: 0.3369
- w/o D-D: 1.7182 (+410%) ← 가장 큰 차이
- w/o GMM: 0.4451 (+32%)
- w/o Fusion: 1.0460 (+210%)

**Traffic (predict 0.5):**
- Full: 0.8489
- w/o D-D: 0.9626 (+13%)
- w/o GMM: 1.3995 (+65%)
- w/o Fusion: 1.5161 (+79%)

### 종합 — 어떤 component 가 가장 중요한가?

| Component | 평균 영향 |
|-----------|----------|
| **Fusion Transformer 제거** | 가장 큰 손실 (특히 Traffic, Wind 0.9) |
| **D-D Decomposition 제거** | Wind 0.9, Solar 0.5 에서 큰 손실 |
| **GMM Decomposition 제거** | Traffic, Electricity 0.5 에서 손실 |

→ **모든 component 가 contribution 있음** — paper 가 claim 한 대로. 단 dataset/quantile 에 따라 어떤 component 가 결정적인지 다름.

---

## 흥미로운 패턴

### Wind 0.9 의 극단적 차이

- Full: 0.3369 → w/o D-D: **1.7182 (×5 worse)**

→ Wind 의 90% upper bound 예측 시 **drift-divergence 분해가 거의 결정적**. 풍속 데이터의 extreme value 가 quantile drift 의 envelope 정보에 강하게 의존.

### Solar 0.5 의 작은 차이

- Full: 1.0641 → w/o D-D: 1.3440 (+26%) → w/o GMM: 1.0831 (+1.8%)

→ Solar 의 median 예측은 GMM 의 추가 정보 거의 없음. Solar 가 단순한 일/계절 cycle 로 충분히 예측 가능.

---

## "왜 Full model 만 best 인가?"

각 dataset/quantile 의 winner check:
- Electricity 0.5: Full 0.7546 < w/o D-D 0.7629 (작은 차이)
- Electricity 0.7: Full 0.3330 (가장 큰 격차)
- Wind 0.9: Full 0.3369 (가장 큰 격차)
- Traffic 0.5: Full 0.8489

→ Full model 이 **모든 12 cell 에서 best** (Table 4). 

→ **3 contribution 의 시너지가 명확** — 각각 독립적 효과 + 함께 쓰면 최고.

---

## Autoformer ablation (Table 3) 와의 비교

| 측면 | Autoformer Table 3 (decomp ablation) | QuantileFormer Table 4 |
|------|--------------------------------------|----------------------|
| 비교 대상 | Origin / Sep / Ours (3 settings) | Full vs w/o 3 components |
| Backbone variations | 4 (Transformer, Informer, LogTrans, Reformer) | 1 (QuantileFormer only) |
| Datasets | 1 (ETT) × 4 horizons | 4 datasets × 3 quantiles |
| Conclusion | progressive decomp 가 backbone-agnostic | 3 components 모두 individual 기여 |

→ Autoformer 는 **분해의 효과를 다른 backbone 에 transfer 가능** 입증. QuantileFormer 는 **자체 framework 의 internal component 검증**.

---

## 인터랙티브 시각화

```viz:qf-ablation-table4:title=paper Table 4 — Component Ablation (interactive),caption=Dataset 토글 (Electricity / Wind / Solar / Traffic) + Quantile 토글 (0.5 / 0.7 / 0.9). 4 settings 비교 — Full vs w/o D-D Decomp / w/o GMM Decomp / w/o Fusion Transformer. Wind 0.9 에서 D-D 제거 시 ×5 악화. 모든 cell 에서 Full 이 best.
```

---

## 의미 — 3 contribution 의 독립성

paper 의 ablation 설계는 정확:
1. **D-D Decomposition** 만 빼기 → quantile drift 없음, divergence 없음 → 원본 직접 사용
2. **GMM Decomposition** 만 빼기 → divergence 그대로 사용 (Gaussian 추정 없음)
3. **Fusion Transformer** 만 빼기 → 단순 concatenation 또는 sum 으로 두 path 결합

각 ablation 이 다른 component 를 정확히 isolate. Paper design 의 우수성.

다음 [14_hyperparam_viz.md](14_hyperparam_viz.md) 에서 hyperparameter $k$ 분석 + Figure 4 시각화 (Section 5.3–5.4).
