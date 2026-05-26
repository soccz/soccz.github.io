# 06. 실험 해부

> **🧒 한 줄 요약**: paper 의 4 main experiments — (1) Main results (Table 1, 7 datasets × 11 models), (2) Promotion (Table 2, 5 variants × 3 datasets), (3) Ablation (Table 3, 6 configs), (4) Generalization (Fig 5 unseen variates, Fig 6 lookback). 본 챕터는 *각 experiment 의 design + 결과 해석 + 부록 신호*.



> **배경 사다리**: ① MSE(Mean Squared Error, 평균제곱오차)는 예측값과 실제값의 차이를 제곱해 평균낸 것으로 작을수록 좋다. ② MAE(Mean Absolute Error, 평균절대오차)는 절대값 기반의 유사 지표다. ③ 어블레이션(ablation)은 특정 요소를 제거해 그 효과를 측정하는 실험이다.

---

## 데이터셋 선택의 의도

저자들은 7개 데이터셋을 선택했으며, 명백히 **변수 수($N$)의 다양성**을 고려했다:

| 데이터셋 | 변수 수 $N$ | 시간 해상도 | 특성 |
|---------|------------|-----------|------|
| ETTh1/h2 | 7 | 1시간 | 전력 변압기, 소규모 다변량 |
| ETTm1/m2 | 7 | 15분 | 위와 같은 출처, 더 높은 빈도 |
| Weather | 21 | 10분 | 기상 변수, 중규모 |
| ECL | 321 | 1시간 | 전력 소비량, **대규모** |
| Traffic | 862 | 1시간 | 도로 센서, **초대규모** |
| Solar-Energy | 137 | 10분 | 태양광 발전 |
| Exchange-Rate | 8 | 1일 | 환율, 소규모 |

이 선택에 숨은 의도: ETT(7변수)에서는 이점이 작을 수 있지만 ECL(321)과 Traffic(862)에서는 iTransformer가 크게 유리하다는 것이 논문의 핵심 서사다.

**데이터셋 선택 편향**: PEMS(도로 센서, 수백 변수) 계열도 포함하며, 이들 모두 변수가 많은 공학 데이터다. 금융 시계열(소수 변수, 낮은 신호-잡음비)은 포함되지 않았다. 이는 "변수 간 상관이 약한 도메인"에서의 성능을 검증하지 않는다는 약점이다.

---

## 베이스라인 공정성 평가

비교 모델:
- **선형 계열**: DLinear(단순 선형 분해), NLinear
- **트랜스포머 계열**: Transformer, Autoformer, FEDformer, Stationary, Crossformer, PatchTST, TimesNet
- **MLP 계열**: DLinear

모두 lookback 96, 예측 horizon {96, 192, 336, 720}으로 동일 조건에서 실험. 그러나:
- 모델별 하이퍼파라미터 최적화가 동일하게 철저했는지 확인 어렵다.
- 특히 DLinear/NLinear는 간단한 모델임에도 여전히 일부 벤치마크에서 경쟁력 있다 — 이는 "복잡한 모델 ≠ 더 좋다"는 교훈을 재확인한다.

---

## 주요 결과 해석

### ECL (321변수) — iTransformer의 쇼케이스

| 예측 길이 | iTransformer MSE | PatchTST MSE | Transformer MSE |
|---------|-----------------|--------------|-----------------|
| 96 | **0.148** | 0.195 | 0.212 |
| 192 | **0.162** | 0.196 | 0.224 |
| 336 | **0.178** | 0.208 | 0.244 |
| 720 | **0.225** | 0.246 | 0.304 |

(위 수치는 논문에서 보고된 값의 근사치; 정확한 값은 논문 Table 1 참조)

변수가 321개인 전력 데이터에서 PatchTST 대비 약 10~15% MSE 개선. 예측 길이가 길수록 이점이 유지된다.

### Traffic (862변수) — 가장 극적인 개선

표준 Transformer MSE ≈ 0.624 대비 iTransformer MSE ≈ 0.428로, 약 **31% 감소**. 이 큰 개선은 "862개 변수 간 상관관계 포착"이 핵심 과제인 교통 데이터에서 iTransformer의 N×N 어텐션이 압도적으로 유리함을 보인다.

### ETT (7변수) — 이점 제한적

ETTh1/m1에서 iTransformer는 DLinear와 비슷하거나 약간 낮은 성능. 변수가 7개 밖에 없어 "7×7 어텐션"이 풍부한 상관 정보를 제공하지 못하기 때문이다. 이것이 "모든 데이터에 무조건 좋다"는 주장의 반례다.

---

## 어블레이션 실험의 핵심 메시지

저자들은 2×2 실험을 설계한다: (어텐션 방향) × (FFN 방향):

| | T-방향 FFN | N-방향 FFN |
|--|--|--|
| **T×T 어텐션** | 표준 Transformer | 변형 1 (중간) |
| **N×N 어텐션** | iTransformer (최고) | 변형 2 (중간) |

**결론**: N×N 어텐션이 핵심 기여이고, FFN 방향은 부차적 영향을 미친다. 즉, "축을 뒤집어 어텐션에 변수 방향을 주는 것"이 이득의 대부분을 설명한다.

---

## 룩백 창 확장 실험

Weather, ECL에서 $T \in \{96, 192, 336, 720\}$로 실험:
- 표준 Transformer: $T = 192$ 이후 성능 포화 또는 소폭 저하
- iTransformer: $T = 720$까지 일관된 MSE 감소 (≈15% 개선)

이것이 Claim 3의 직접 증거다. 기존 트랜스포머가 룩백을 잘 활용하지 못하는 이유는 $T$가 늘수록 $T \times T$ 어텐션에서 관련 없는 타임스텝들과의 노이즈 상호작용이 증가하기 때문이라는 저자의 설명이 납득 가능하다.

---

## 부록에 숨은 신호

- **CKA 분석**: 표준 트랜스포머의 레이어 간 CKA ≈ 0.95로 레이어를 거쳐도 표현이 거의 변하지 않는다. iTransformer는 레이어마다 CKA가 낮아져 실질적 표현 변환이 일어남을 시사한다. 이는 "어텐션이 실질적으로 작동한다"의 증거지만, 간접적이다.
- **제로샷 변수 실험**: 훈련 시 사용한 변수의 70%만으로 학습 후, 나머지 30%를 제로샷 예측 → 유의미한 성능 유지. 이는 변수 토큰이 독립적임을 실증한다.

---

## 인터랙티브 — 실험 결과 종합

```viz:it-datasets-summary:title=Table 1 — 7 Datasets × 11 Models MSE,caption=Highlight 셀렉터로 model 비교. iTransformer 6/7 SOTA. ★ best per dataset 표시.
```

```viz:it-promotion-grid:title=Table 2 — Promotion across 5 Variants × 3 Datasets,caption=View 셀렉터 (promotion% / original / inverted). 15 cell 모두 promotion ✓. Largest: Reformer + Weather -69.2%.
```

```viz:it-lookback-paradox:title=Lookback Paradox Resolution (Figure 6),caption=Highlight 셀렉터. Vanilla family vs iTransformer family. T ∈ {48, 96, 192, 336, 720} 의 MSE 변화. Vanilla: paradox. iTransformer: monotone improvement.
```

```viz:it-variate-generalization:title=Variate Generalization — 20% 학습 → 100% (Figure 5),caption=Dataset 셀렉터. iTransformer 의 작은 MSE 증가 (~25%) vs CI 의 큰 증가 (~110%). TSFM enabling property 의 직접 증거.
```

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Table 1 의 *결정적 단일 수치* — paper 의 핵심 claim 의 지지?**
2. **Table 2 의 *15/15 promotion* 의 의미 — *어떤 generalizability*?**
3. **Ablation Table 3 의 *worst design* (Attn-Attn) 의 *진단적 가치*?**

### 답변

1. **Traffic MSE 0.428 vs PatchTST 0.481 = -11% margin**. Traffic = highest-dim (N=862) dataset. PatchTST 의 *Channel Independence* 가 *N 큰* 경우 limit — variate correlation 손실. iTransformer 의 *attention over variates* 가 *결정적 vehicle* → "multivariate correlation matters at scale" 정량 증거. Exchange (N=8) 에서 DLinear 가 best 인 것과 *대비* — *low-N* 에서는 multivariate 덜 중요.

2. **Universal applicability — *paradigm-level* generalization**. 5 variants (Transformer 2017, Reformer 2020, Informer 2021, Flowformer 2022, Flashformer 2022) × 3 datasets (ECL, Traffic, Weather) = 15 configurations 모두 promotion ✓. iTransformer 의 *inversion 이 *variant-agnostic* — *어떤 attention 형식*에도 적용 가능. → *5 paper 의 후속 개선* 을 *단일 paper* 가 제공.

3. **"Attention-Attention" (vanilla style) = Traffic 0.913 — 최악**. iTransformer 의 0.428 의 *2 배 MSE*. paper §4.3 의 vanilla *진정 fail* 정량 — DLinear 2023 의 "Are Transformers Effective?" 의 *재확인*. iTransformer 의 "FFN on temporal" 결정의 *empirical 정당화* — *temporal axis 의 attention 은 noise*, *FFN 이 적합*.
