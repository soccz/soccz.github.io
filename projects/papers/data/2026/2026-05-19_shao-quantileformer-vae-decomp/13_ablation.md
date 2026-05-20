# 13. Section 5.2 (Ablation) — Table 4 정밀 해석: 어떤 component 가 중요한가

## 📌 이 챕터 다 읽으면 알 수 있는 것

- **Ablation study** 가 뭔지 — 각 component 의 단독 기여도 측정 방법
- **Table 4** — 3 component (D-D Decomp / GMM Decomp / Fusion) 의 개별 효과
- 12 cells 전부 영향도 grid — 어느 component 가 어느 데이터셋에 결정적인지
- Wind 0.9 의 GMM 제거 시 ×5 악화의 일반 원칙

---

논문 7쪽 (Section 5.2) 을 풀어본다. **3 component 의 개별 기여 분석**.

이 chapter 는 **"전체 모델에서 각 부품을 빼면 얼마나 나빠지는가"** 를 셀별로 해석한다.

---

## 13.1 시작하기 전 — Ablation study 가 뭔지

### 일상 비유

자동차에 "터보 + 4WD + ABS" 가 있다. 진짜 빨라진 게 어느 부품 덕인지 알려면:
- "터보만 뺀 차" 와 비교 → 터보의 효과.
- "4WD만 뺀 차" 와 비교 → 4WD 의 효과.
- "ABS만 뺀 차" 와 비교 → ABS 의 효과.

이게 ablation study. **각 component 의 단독 기여도 측정**.

### 본 paper 의 3 component

QuantileFormer 의 3 핵심 component:
1. **D-D Decomp.** = Drift-Divergence Decomposition (Eq 4, ch06).
2. **GMM Decomp.** = Gaussian Mixture Decomposition (Eq 7, ch06).
3. **Fusion Transformer** = Cross-attention fusion module (Eq 16-18, ch09).

paper 는 각각 제거한 4가지 setting 비교:
- **w/o D-D Decomp.**: drift-divergence 분해 없이.
- **w/o GMM Decomp.**: GMM 분해 없이.
- **w/o Fusion Transformer**: fusion 모듈을 단순 concat/sum 으로 대체.
- **QuantileFormer (full)**: 모든 component 포함.

---

## 13.2 Table 4 — Component Ablation (paper p.7)

### 📖 처음 보는 사람을 위한 — Table 4 읽는 법

**이 표가 비교하는 것**: QuantileFormer 의 **3 component 를 하나씩 빼고** 성능이 얼마나 나빠지는지. **낮을수록 좋음** (q-risk).

**표 구조**:

| 행 (Setting) | 무엇 |
|---|------|
| **w/o D-D Decomp.** | Drift-Divergence 분해 모듈 제거 |
| **w/o GMM Decomp.** | Gaussian Mixture 모듈 제거 |
| **w/o Fusion Transformer** | Cross-attention fusion 제거 (단순 concat 대체) |
| **QuantileFormer (full)** | 모든 component 포함 (★ baseline) |

| 열 (Dataset × Quantile) | 무엇 |
|---|------|
| Elec 0.5 / 0.7 / 0.9 | Electricity 의 3 quantile 평가 |
| Wind 0.5 / 0.7 / 0.9 | Wind 의 3 quantile 평가 |
| (Table 4.b) Solar / Traffic | 동일 형식 |

**어떻게 읽나? — 3 단계**:
1. 마지막 행 (full) 값을 기준으로 잡는다.
2. 각 component 제거 행과 비교 — 얼마나 나빠졌나?
3. **나빠진 정도** = 그 component 의 contribution.

**3 개 결정적 발견**:
1. **D-D Decomp 가 가장 결정적**: 제거 시 Wind 0.9 가 0.34 → 1.72 (★ **5 배 악화**). 시계열 분해 자체가 본 논문의 핵심.
2. **GMM Decomp 도 중요**: Wind 0.5 제거 시 0.84 → 0.98 (17% 악화). 분포 modeling 의 기여.
3. **Fusion 도 의미 있음**: Elec 0.9 제거 시 0.51 → 0.99 (2 배 악화). 두 path 결합의 중요성.

**일상 비유**:
- D-D Decomp = "음식을 한 솥에 다 끓이지 않고 재료별로 분리" — 가장 큰 효과.
- GMM Decomp = "고기 양념도 한 가지가 아닌 여러 종류" — 추가 풍미.
- Fusion = "분리한 재료를 마지막에 잘 합치는 plating" — 마무리 효과.

**놓치기 쉬운 한 가지**: 한 component 만 빼도 여전히 baseline 8 개 보다 나을 수 있음. 하지만 full model 보다는 일관되게 나쁨 → **3 가지가 다 필요**.

**원문 위치**: paper Table 4, journal p.7.

### 🔍 Table 4 의 12 cells 정밀 영향도 grid

본 deep dive 추정 — paper Table 4.a + 4.b 의 정확한 셀별 악화 정도:

| Setting | Elec 0.5 | Elec 0.7 | Elec 0.9 | Wind 0.5 | Wind 0.7 | Wind 0.9 |
|---------|----------|----------|----------|----------|----------|----------|
| **full** | 0.75 | **0.33** | 0.51 | 0.84 | **0.73** | **0.34** |
| w/o D-D | 0.76 (+1%) | 0.89 (**+170%**) | 0.67 (+31%) | 1.07 (+27%) | 1.25 (+71%) | **1.72 (+412%)** ★ |
| w/o GMM | 0.99 (+32%) | 0.91 (+176%) | 0.56 (+10%) | 0.98 (+17%) | 0.96 (+31%) | 0.45 (+32%) |
| w/o Fusion | 0.94 (+25%) | 0.91 (+176%) | 0.99 (+93%) | 0.90 (+7%) | 0.89 (+22%) | 1.05 (+207%) |

**Wind 0.9 의 ★ ×5 악화** 가 본 ablation 의 가장 결정적 발견:
- D-D 제거 시 0.34 → 1.72 = **5배 악화**.
- 의미: Wind 의 0.9 quantile (극단 풍속) 예측에 **분해가 절대적으로 필요**.
- 직관: 평균은 한 모델로 잡을 수 있지만, 극단 분포는 분해 없이 못 잡음.

### 🌱 일반 원칙 (★ 본 해체 추가)

| Component 제거 영향 | 가장 큰 데이터셋 |
|---------------------|------------------|
| D-D Decomp 제거 | **Wind 0.9** (high quantile, multimodal) |
| GMM 제거 | Solar (계절 multimodal) |
| Fusion 제거 | Electricity 0.9 (peak 시간대) |

**원칙**: 극단 quantile (0.9) 일수록 분해의 효과 ↑. 평균 (0.5) 에서는 영향 작음.

---

paper Table 4 정확 인용. 4 datasets × 3 quantiles × 4 settings. **lower = better**.

### Table 4.a — Electricity & Wind

| Setting | Elec 0.5 | 0.7 | 0.9 | Wind 0.5 | 0.7 | 0.9 |
|---------|----------|-----|-----|----------|-----|-----|
| w/o D-D Decomp. | 0.7629 | 0.8890 | 0.6738 | 1.0746 | 1.2476 | 1.7182 |
| w/o GMM Decomp. | 0.9890 | 0.9125 | 0.5570 | 0.9782 | 0.9575 | 0.4451 |
| w/o Fusion Transformer | 0.9389 | 0.9104 | 0.9885 | 0.8954 | 0.8861 | 1.0460 |
| **QuantileFormer (full)** | **0.7546** | **0.3330** | **0.5121** | **0.8403** | **0.7346** | **0.3369** |

### Table 4.b — Solar & Traffic

| Setting | Solar 0.5 | 0.7 | 0.9 | Traffic 0.5 | 0.7 | 0.9 |
|---------|-----------|-----|-----|-------------|-----|-----|
| w/o D-D Decomp. | 1.3440 | 1.2463 | 0.6142 | 0.9626 | 1.3814 | 0.5497 |
| w/o GMM Decomp. | 1.0831 | 1.1991 | 0.7914 | 1.3995 | 0.8849 | 0.5837 |
| w/o Fusion Transformer | 1.0708 | 1.1930 | 0.7289 | 1.5161 | 1.1245 | 0.8275 |
| **QuantileFormer (full)** | **1.0641** | **1.1832** | **0.5883** | **0.8489** | **0.8489** | **0.4688** |

(paper Table 4, p.7)

---

## 13.3 paper 의 핵심 발견

paper p.7 원문:
> "In the results, removing each component results in performance drop in different levels, showcasing the effectiveness of the proposed framework. We conduct experiments without the drift-divergence decomposition, the Gaussian mixture model decomposition and the fusion Transformer module respectively."

### 한국어 풀이

"각 component 를 제거하면 다른 정도의 성능 저하가 발생 → framework 의 효과 입증".

→ 즉 **모든 component 가 기여 있음** 의 입증.

---

## 13.4 각 cell 의 정밀 해석 — Full 대비 % 악화

각 setting 의 q-risk 가 **full QuantileFormer 보다 얼마나 더 나쁜가** 를 계산.

### Electricity 의 모든 quantile

**0.5 quantile (median)**:
- Full: 0.7546 (best)
- w/o D-D: 0.7629 → **+1.1%** (거의 영향 없음)
- w/o GMM: 0.9890 → **+31%** ← GMM 이 가장 영향 큼
- w/o Fusion: 0.9389 → **+24%**

→ Electricity median 예측 시 **GMM** 이 가장 중요.

**0.7 quantile**:
- Full: 0.3330 (best)
- w/o D-D: 0.8890 → **+167%** ← D-D 가 가장 영향 큼
- w/o GMM: 0.9125 → **+174%**
- w/o Fusion: 0.9104 → **+173%**

→ Electricity 0.7 quantile 은 **모든 component 가 거의 동등하게 중요**. 전체 시스템의 시너지.

**0.9 quantile**:
- Full: 0.5121 (best)
- w/o D-D: 0.6738 → **+32%**
- w/o GMM: 0.5570 → **+9%** ← 가장 영향 작음
- w/o Fusion: 0.9885 → **+93%** ← Fusion 이 가장 영향 큼

→ Electricity 0.9 quantile 은 **Fusion** 이 가장 중요.

### Wind 의 모든 quantile

**0.5 quantile**:
- Full: 0.8403 (best)
- w/o D-D: 1.0746 → **+28%**
- w/o GMM: 0.9782 → **+16%**
- w/o Fusion: 0.8954 → **+7%** ← 가장 영향 작음

**0.7 quantile**:
- Full: 0.7346 (best)
- w/o D-D: 1.2476 → **+70%**
- w/o GMM: 0.9575 → **+30%**
- w/o Fusion: 0.8861 → **+21%**

**0.9 quantile** ← **극단적 결과**
- Full: 0.3369 (best)
- w/o D-D: 1.7182 → **+410%** ← **가장 큰 차이 (5배 악화)**
- w/o GMM: 0.4451 → **+32%**
- w/o Fusion: 1.0460 → **+210%**

→ **Wind 0.9 quantile (= worst case 풍속) 예측 시 D-D decomposition 이 거의 결정적**. 풍속 데이터의 extreme value 가 quantile drift 의 envelope 정보에 강하게 의존.

### Solar 의 모든 quantile

**0.5 quantile** ← Solar 가 분해 효과 작은 dataset
- Full: 1.0641
- w/o D-D: 1.3440 → **+26%**
- w/o GMM: 1.0831 → **+1.8%** ← 거의 영향 없음
- w/o Fusion: 1.0708 → **+0.6%** ← 거의 영향 없음

→ Solar median 예측은 단순한 일/계절 cycle 로 충분 → 분해의 추가 정보 거의 없음.

**0.9 quantile**:
- Full: 0.5883
- w/o D-D: 0.6142 → +4%
- w/o GMM: 0.7914 → +35%
- w/o Fusion: 0.7289 → +24%

### Traffic 의 모든 quantile

**0.5 quantile**:
- Full: 0.8489
- w/o D-D: 0.9626 → **+13%**
- w/o GMM: 1.3995 → **+65%** ← 가장 영향 큼
- w/o Fusion: 1.5161 → **+79%**

**0.7 quantile**:
- Full: 0.8489
- w/o D-D: 1.3814 → **+63%**
- w/o GMM: 0.8849 → **+4%**
- w/o Fusion: 1.1245 → **+32%**

**0.9 quantile**:
- Full: 0.4688
- w/o D-D: 0.5497 → +17%
- w/o GMM: 0.5837 → +25%
- w/o Fusion: 0.8275 → **+76%**

→ Traffic 의 median 과 0.9 에서 **Fusion** 이 가장 중요.

---

## 13.4-bis ★ Table 4 의 12 cells 전부 영향도 grid (정밀 매트릭스)

paper Table 4 의 12 cells 를 한 매트릭스로 정리. 각 cell 의 "Full 대비 % 악화" 를 계산.

### Full 대비 % 악화 매트릭스

| Dataset / Quantile | w/o D-D | w/o GMM | w/o Fusion | 가장 큰 영향 |
|--------------------|---------|---------|-----------|------------|
| **Electricity** 0.5 | +1% | **+31%** | +24% | GMM |
| **Electricity** 0.7 | +167% | **+174%** | +173% | GMM (모두 비슷) |
| **Electricity** 0.9 | +32% | +9% | **+93%** | Fusion |
| **Wind** 0.5 | +28% | +16% | +7% | D-D |
| **Wind** 0.7 | **+70%** | +30% | +21% | D-D |
| **Wind** 0.9 | **+410%** | +32% | +210% | **D-D (×5 악화)** |
| **Solar** 0.5 | **+26%** | +2% | +1% | D-D |
| **Solar** 0.7 | +5% | +1% | +1% | D-D |
| **Solar** 0.9 | +4% | **+35%** | +24% | GMM |
| **Traffic** 0.5 | +13% | +65% | **+79%** | Fusion |
| **Traffic** 0.7 | **+63%** | +4% | +32% | D-D |
| **Traffic** 0.9 | +17% | +25% | **+76%** | Fusion |

### Component 별 영향 분류 (12 cells 중)

| Component | 가장 결정적인 cells | 비율 |
|-----------|-----------------|------|
| **D-D Decomposition** | Wind 0.7, Wind 0.9, Solar 0.5, Solar 0.7, Traffic 0.7 | **5/12 (42%)** |
| **Fusion Transformer** | Electricity 0.9, Traffic 0.5, Traffic 0.9 | **3/12 (25%)** |
| **GMM Decomposition** | Electricity 0.5, Electricity 0.7, Solar 0.9 | **3/12 (25%)** |
| (모두 비슷) | Wind 0.5, ETT 미실험 | 1/12 (8%) |

### ★ 가장 큰 영향 패턴

1. **D-D Decomposition** 이 가장 자주 결정적 (5 cells) — 특히 Wind (storm 시점) + Solar (단순 cycle 의 trend 추출).
2. **Fusion Transformer** 가 Electricity 0.9 + Traffic 0.5/0.9 에서 결정적 — **median + extreme quantile** 에서 두 path 결합 중요.
3. **GMM** 이 Electricity 0.5/0.7 에서 결정적 — Electricity 의 multi-modal distribution 학습.

→ **Dataset 특성에 따라 다른 component 가 결정적**. 본 deep dive 의 dataset 분석 (ch11) 과 일치.

---

## 13.5 종합 — 어떤 component 가 가장 중요한가?

각 cell 의 "가장 큰 영향 component" 를 집계:

| Component | 가장 결정적인 cell |
|-----------|------------------|
| **D-D Decomposition** | Wind 0.9 (×5 악화), Solar 0.5, Wind 0.5, Traffic 0.7 |
| **GMM Decomposition** | Electricity 0.5, Traffic 0.5 |
| **Fusion Transformer** | Electricity 0.9, Traffic 0.5/0.9 |

### 평균 영향 표

각 component 제거 시 평균 악화율 (12 cells 평균):

| Component | 평균 q-risk 악화 |
|-----------|----------------|
| w/o D-D Decomp. | 약 **+82%** (Wind 0.9 의 극단치 포함) |
| w/o Fusion Transformer | 약 **+58%** |
| w/o GMM Decomp. | 약 **+34%** |

→ **D-D Decomposition 이 평균적으로 가장 중요** (특히 extreme quantile).

### 인사이트

- **D-D Decomposition** = 시계열의 quantile envelope 정보. extreme quantile (0.9) 예측에 결정적.
- **Fusion Transformer** = 두 path 의 결합. median (0.5) 예측에 중요.
- **GMM Decomposition** = 분포의 multi-modality. 특정 dataset (Electricity, Traffic) 의 median 에 중요.

→ **3 component 모두 dataset-specific 강점**. 함께 쓸 때 가장 robust.

---

## 13.5-bis ★ Wind 0.9 의 ×5 악화가 가르치는 것

**가장 극단적 cell**: Wind 0.9 quantile 에서 w/o D-D Decomp 0.3369 → 1.7182 = **5.1배 악화**.

### 일반 원칙

> **"Extreme quantile (0.9) + 변동성 큰 dataset (Wind) = drift envelope 정보가 거의 결정적"**.

이유:
- Wind 의 storm 시점 (extreme value) = **quantile drift 의 0.9 envelope** 에 강하게 표현됨.
- Drift 제거 → envelope 정보 손실 → extreme value 예측 불가.
- → 5배 악화는 우연이 아니라 **structural dependency**.

### 다른 dataset 으로의 추론

| Dataset | 0.9 quantile 에서 D-D 영향 (추정) | 이유 |
|---------|---------------------------------|------|
| Wind | **×5** (실측) | storm event 강함 |
| Solar | ×1.04 | 단순 cycle, extreme 적음 |
| Traffic | ×1.17 (Wind 의 0.9) | 출퇴근 peak 있지만 patterned |
| Electricity | ×1.32 (0.9) | 일/주 cycle + 일부 spike |
| ETT | 미실측 (ablation 제외) | simple, 추정 ×1.1 정도 |

→ **데이터의 extreme value 빈도와 D-D 분해의 중요도가 비례**.

### Practical takeaway

> ★ **새 dataset 적용 시 first sanity check**: "내 데이터에 extreme event 가 자주 있는가?" → 자주 있다면 (예: 풍속, 주식 변동성, 의료 emergency) QuantileFormer 의 D-D 분해가 결정적. 거의 없다면 (예: 단순 sensor) 더 간단한 모델로 충분.

---

## 13.6 흥미로운 패턴

### 패턴 1: Wind 0.9 의 극단적 차이

- Full: 0.3369
- w/o D-D: **1.7182 (×5 worse)**

→ Wind 의 90% upper bound 예측 시 **drift-divergence 분해가 거의 결정적**. 풍속 데이터의 extreme value (storm 시점) 가 quantile drift 의 envelope 정보에 강하게 의존.

### 패턴 2: Solar 0.5 의 작은 차이

- Full: 1.0641
- w/o D-D: 1.3440 (+26%)
- w/o GMM: 1.0831 (+1.8%)
- w/o Fusion: 1.0708 (+0.6%)

→ Solar median 예측은 단순. GMM, Fusion 의 추가 정보 거의 없음. **Solar 가 simple cycle dataset** 임을 시사.

### 패턴 3: ETT 가 ablation 에 빠진 이유

paper Table 4 는 4 datasets (Electricity, Wind, Solar, Traffic) 만 — ETTm1, ETTh1 제외.

본 deep dive 의 추론:
- ETT 는 cpaw 에서 약점 보였음 (ch12).
- Ablation 에 ETT 를 포함하면 약점이 더 드러남 → paper 가 의도적 제외 가능성.
- 또는 단순히 page limit 으로 제외.

---

## 13.7 Full model 이 모든 cell 에서 best 인가?

각 dataset/quantile 의 winner check:

| Dataset/Quantile | Best | Full 인가? |
|------------------|------|-----------|
| Elec 0.5 | Full 0.7546 < w/o D-D 0.7629 | Yes (작은 차이) |
| Elec 0.7 | Full 0.3330 | Yes (가장 큰 격차) |
| Elec 0.9 | Full 0.5121 | Yes |
| Wind 0.5 | Full 0.8403 | Yes |
| Wind 0.7 | Full 0.7346 | Yes |
| Wind 0.9 | Full 0.3369 | Yes (×5 격차) |
| Solar 0.5 | Full 1.0641 | Yes (작은 차이) |
| Solar 0.7 | Full 1.1832 | Yes |
| Solar 0.9 | Full 0.5883 | Yes |
| Traffic 0.5 | Full 0.8489 | Yes |
| Traffic 0.7 | Full 0.8489 | Yes |
| Traffic 0.9 | Full 0.4688 | Yes |

→ **Full model 이 모든 12 cell 에서 best**.

→ **3 contribution 의 시너지가 명확** — 각각 독립적 효과 + 함께 쓰면 최고.

---

## 13.8 paper 의 ablation 설계 비판적 평가

paper 의 ablation 설계는 정확:

| Ablation | 제거 항목 | 대체 |
|----------|---------|------|
| **w/o D-D Decomp.** | drift + divergence 모두 | 원본 시계열 직접 사용 |
| **w/o GMM Decomp.** | GMM 분해 | divergence 그대로 사용 (Gaussian 추정 없음) |
| **w/o Fusion Transformer** | fusion 모듈 | 단순 concatenation 또는 sum 으로 두 path 결합 |

각 ablation 이 다른 component 를 정확히 isolate. **Paper design 의 우수성** — clean ablation.

---

## 13.9 Autoformer ablation 과의 비교

| 측면 | Autoformer Table 3 (decomp ablation) | QuantileFormer Table 4 |
|------|--------------------------------------|----------------------|
| 비교 대상 | Origin / Sep / Ours (3 settings) | Full vs w/o 3 components |
| Backbone variations | 4 (Transformer, Informer, LogTrans, Reformer) | 1 (QuantileFormer only) |
| Datasets | 1 (ETT) × 4 horizons | 4 datasets × 3 quantiles |
| Conclusion | progressive decomp 가 backbone-agnostic | 3 components 모두 individual 기여 |

### 의미 차이

- **Autoformer ablation**: "분해의 효과를 **다른 backbone 에 transfer 가능**" 입증.
- **QuantileFormer ablation**: "**자체 framework 의 internal component**" 검증.

→ 같은 분해 정신이지만 다른 ablation 디자인.

---

## 13.10 인터랙티브 시각화

```viz:qf-ablation-table4:title=paper Table 4 — Component Ablation (interactive),caption=Dataset 토글 (Electricity / Wind / Solar / Traffic) + Quantile 토글 (0.5 / 0.7 / 0.9). 4 settings 비교 — Full vs w/o D-D Decomp / w/o GMM Decomp / w/o Fusion Transformer. Wind 0.9 에서 D-D 제거 시 ×5 악화. 모든 cell 에서 Full 이 best.
```

---

## 13.11 Section 5.2 핵심 정리

| 항목 | 내용 |
|------|------|
| Ablation 종류 | 3 (w/o D-D, w/o GMM, w/o Fusion) |
| Datasets | 4 (Electricity, Wind, Solar, Traffic) |
| Quantiles | 3 (0.5, 0.7, 0.9) |
| Total cells | 4 × 3 = 12 cells |
| Full best | 12/12 cells |
| 평균 가장 큰 영향 | D-D Decomposition (+82% 평균 악화) |
| 가장 극단적 cell | Wind 0.9, w/o D-D = **×5 악화** |
| 가장 작은 영향 | Solar 0.5 의 w/o GMM (+1.8%), w/o Fusion (+0.6%) |
| ETT 미포함 | paper 가 ablation 에서 제외 |

**한 줄 핵심**:
> **"3 component (D-D 분해 + GMM 분해 + Fusion Transformer) 모두 기여. 평균적으로 D-D 분해가 가장 중요 (특히 Wind 0.9 = ×5 영향). 모든 12 cell 에서 Full model 이 best — 시너지 입증."**

다음 [14_hyperparam_viz.md](14_hyperparam_viz.md) 에서 hyperparameter $k$ 분석 + Figure 3, 4 시각화.

---

## 자기점검 (이 챕터)

### 핵심 3가지

1. **Ablation 에서 가장 큰 q-risk 악화를 보인 cell 과 그 의미는?**
2. **Solar 0.5 quantile 의 ablation 이 작은 차이를 보이는 이유는?**
3. **Full QuantileFormer 가 12/12 cells 에서 best 인 사실의 의미는?**

### 답변

1. **Wind 0.9 의 ×5 악화 — 가장 큰 영향**:
   - **수치**: Full 0.3369 → w/o D-D Decomp 1.7182 = **×5 (410%) 악화**.
   - **무엇이 일어났나**: D-D 분해 (Eq 4) 를 제거하면 시계열을 drift + divergence 로 가르지 않음 → divergence pattern 의 multi-modal 분포 정보 손실.
   - **왜 Wind 의 0.9 quantile 가 가장 큰가**:
     - **Wind 의 특성**: 풍속의 갑작스러운 변화 (storm) → multi-modal distribution 의 대표적 사례.
     - **0.9 quantile**: storm 시점의 worst case 예측 = 풍속 가장 큰 시점.
     - 평소엔 5 m/s, storm 시 30 m/s → 두 봉우리 분포.
     - D-D 분해 없으면 두 봉우리 못 구분 → worst case 예측 실패.
   - **운용 함의**: 풍력 발전 운영자가 "내일 90% 확률 풍속" 알아야 발전기 보호 결정 가능. D-D 분해가 이걸 가능하게.
   - **일반화 원칙**: **극단 quantile (0.9) 예측에는 분해가 절대적으로 필요**. 평균 (0.5) 에서는 영향 작음.

2. **Solar 의 약한 ablation 효과 — 영향도 작은 이유**:
   - **수치**: w/o GMM (+1.8%), w/o Fusion (+0.6%) 으로 거의 영향 없음.
   - **Solar 의 특성**:
     - 매우 **규칙적 cycle**: 낮 = peak, 밤 = 0 의 단순 반복.
     - Multi-modal distribution 거의 없음 (단순 단일 분포 가까움).
     - Concept drift 도 작음 (계절성 정도).
   - **함의**: GMM 의 multi-modal 분해 의 추가 정보가 **noise 가 됨** (overfit 위험).
   - **Simple cycle dataset 은 simpler model 로 충분**:
     - Solar 에서는 deterministic Transformer 도 잘 함.
     - 본 논문 GMM/VAE 의 풍부함이 advantage 가 아닌 부담.
   - **일반 원칙 (★ 본 해체 강조)**: "**모델 복잡도 = 데이터 복잡도**" 가 sweet spot.
     - 데이터가 단순하면 simple model 이 효율.
     - 본 논문의 강점은 **complex multi-modal data** (Wind, Electricity) 에서.

3. **3 component 의 시너지**:
   - **각각의 단독 기여 (ablation 으로 입증)**:
     - D-D: extreme quantile 예측 (Wind 0.9 ×5).
     - GMM: multi-modal 분포 모델링.
     - Fusion: 두 path 정보 결합.
   - **함께 쓸 때 시너지**:
     - D-D 가 divergence 만들고 → GMM 이 그 분포 잡고 → Fusion 이 drift 와 결합.
     - 한 component 빠지면 다음 단계가 부실 정보로 작동.
   - **수치 증명**: full model (모두 포함) 이 어떤 single ablation 보다도 일관되게 우위.
   - **"1+1+1 = 3 이 아니라 1+1+1 = 4~5"**: paper 의 design choice 가 단순한 부품 합이 아닌 **architectural 통합** 의 의미.
   - **architectural 통합 의 핵심**: 각 component 가 **다음 component 의 input quality** 를 결정. 잘못된 분해 → 잘못된 분포 → 잘못된 fusion. **chain 효과**.
