# 09. 내 연구와의 연결

> **🧒 한 줄 요약**: iTransformer 의 N×N attention 이 *APF 의 N×N motif typology 의 직접 base*. Vanilla 의 T×T motif 와 *대립 축*. Grokking 의 *FFN-only series learning* circuit 분석 출발점. 본 paper 가 *내 manuscript 의 §3 methodology baseline*.



> **이 섹션은 `_profile.md`의 §A~F와 보유 자산(APF, Grokking)을 기준으로 작성한다. 일반론 금지 — 구체적 mechanism/axis/수식 연결만.**

---

## §C + §D — APF (Attention Pattern Fields): 핵심 연결

### 연결 1: 2D 어텐션 모티프 분류 체계의 '역전 축' 비교군

APF 연구의 핵심 주장은 "TS 트랜스포머의 T×T 어텐션 맵에 대각선/블록/스트라이프/엣지/스파이크/체커 패턴 등의 2D 모티프가 존재하며, 이 모티프가 예측 성능에 인과적으로 기여한다"는 것이다.

iTransformer는 이 주장에 직접적 도전 질문을 제기한다:

> **"T×T 모티프를 완전히 포기하고 N×N 어텐션으로 대체했더니 SOTA를 달성했다 — 그렇다면 T×T 모티프의 예측 기여는 과대평가된 것인가?"**

APF 논문의 Discussion 또는 Related Work 섹션에서 iTransformer를 인용하며 이 질문에 답해야 한다. 가능한 두 가지 답:

- **답 A (APF 지지)**: iTransformer가 잘 작동하는 이유는 "변수 상관 포착"이지, T×T 모티프가 쓸모없기 때문이 아니다. 단변량 또는 저변수 TS에서는 T×T 모티프가 여전히 중요하다.
- **답 B (APF 수정)**: T×T 모티프의 기여가 실제로는 N×N 어텐션으로 대체 가능하다. 따라서 APF는 "T×T 모티프가 언제 필수이고 언제 부차적인가"를 조건부로 논의해야 한다.

**구체적 인용 초안**: APF 논문 §3(Motif Causality) 말미에:
> "이 분석은 T×T 어텐션 맵의 모티프가 예측에 인과적으로 기여함을 보인다. 단, Liu et al. [iTransformer, ICLR 2024]는 어텐션 축을 변수 방향(N×N)으로 전환함으로써 T×T 모티프 없이도 SOTA를 달성한다. 이는 T×T 모티프가 예측에 충분조건이 아님을 시사하며, 우리의 framework를 단변량·소변수 TS로 적용 범위를 명확히 한정하는 계기가 된다."

### 연결 2: PE 실험과의 관련성

APF에서 NoPE/Sinusoidal/RoPE/ALiBi에 따른 T×T 어텐션 모티프 차이를 분석한다. iTransformer는 위치 임베딩이 없다(불필요하다고 주장). 이는 "위치 임베딩이 T×T 모티프를 어떻게 형성하는가"라는 APF 질문의 대조군이 된다:

> APF 실험 확장 아이디어: "PE 없는 iTransformer의 N×N 어텐션 맵 모티프 분류" — 이것이 T×T 모티프 분류와 어떻게 다른가? 블록/클러스터 패턴이 N×N에서도 나타나는가, 아니면 전혀 다른 모티프 체계가 필요한가?

---

## §A + §B — Grokking 트랙: FFN 회로 분석

### 연결 3: FFN이 시간 패턴을 학습한다 — 어떤 회로로?

iTransformer Claim 2는 "FFN이 각 변수의 시간 패턴을 학습한다"고 주장한다. 그러나 이것이 어떤 내부 회로로 구현되는지 분석하지 않는다.

Grokking 연구에서 우리는 "FFN이 주기 패턴을 어떻게 암기→일반화하는가"를 추적한다 (Nanda 2023의 modular arithmetic에서 Fourier feature 형성과 유사). iTransformer에 Grokking 분석을 적용하면:

- 훈련 초기: FFN이 $T$개 시간 점의 단순 가중 평균을 학습? (암기 단계)
- Grokking 이후: 주기적 구조를 내재화한 회로가 형성? (일반화 단계)
- 테스트: iTransformer를 ETT(계절성 있는 TS)에서 훈련 시 Grokking이 나타나는가? 나타난다면 어느 레이어, 어느 헤드에서?

**보유 자산 활용**: Grokking 프로젝트의 synthetic periodic TS 데이터를 iTransformer에도 적용해 비교 실험. 표준 트랜스포머(T×T)와 iTransformer(N×N)에서 Grokking 발생 시점, 회로 형성 방식이 달라지는가?

---

## §E — P1 ProTran-TFA: 금융 응용 연결

iTransformer의 N×N 어텐션이 변수(자산) 간 상관을 학습한다는 것은 포트폴리오 맥락에서 직접적 응용이 가능하다:

- ProTran-TFA는 확률적 예측 Transformer를 금융 시계열에 적용. 현재 채널 독립(channel-independent) 방식.
- iTransformer의 N×N 어텐션을 ProTran에 통합하면 "자산 간 상관을 반영한 확률적 예측"이 가능해진다.
- 구체적: ProTran의 인코더를 iTransformer 블록으로 대체하되, 디코더(확률 분포 출력)는 그대로 유지하는 하이브리드.

**현실적 제약**: ProTran-TFA는 현재 ⏸️ Paused 상태. iTransformer와의 결합은 재개 시점의 첫 실험 방향으로 검토 가능.

---

## 연결이 약한 부분 — 솔직한 평가

§F(원거리: SAE, 점과정, 딥헤징) 와의 연결은 매우 약하다. iTransformer는 TS 예측 기법이며, 원거리 영역의 특수 문제(이벤트 시퀀스, 옵션 헤징)와 직접 연결되지 않는다. 전이 가능성: "희소 어텐션 → SAE(Sparse Autoencoder)와 희소 행렬 분해의 관계" 정도지만, 이것도 억지스럽다.

**종합 연결 강도**:
- APF (§C): ⬛⬛⬛⬛⬜ (매우 강)
- Grokking (§A/§B): ⬛⬛⬛⬜⬜ (강)
- ProTran-TFA (§E): ⬛⬛⬜⬜⬜ (중간, 재개 시 활용 가능)
- 원거리 §F: ⬛⬜⬜⬜⬜ (약)

---

## APF 의 *iTransformer 적용* 의 *5 axis*

### Axis 1: N×N attention map 의 *2D motif typology*

iTransformer 의 Fig 9 attention map = *learned multivariate correlation matrix*. APF 의 *T×T motif typology* (diagonal / stripe / block / spike / checker / edge) 를 *N×N* 에 *re-instantiation*:

```
APF T×T motif typology (vanilla Transformer 의 attention):
  - Diagonal: 인접 시점 강한 attention
  - Stripe: 시간 cycle pattern
  - Block: 시간 segment 의 강한 의존
  - Spike: 단일 시점 의 강한 의존
  - Checker: alternating pattern
  - Edge: 시퀀스 시작/끝의 강조

iTransformer N×N motif typology (variate-axis):
  - Block (∝ cluster): variate group 의 강한 mutual attention
  - Diagonal (self-attention): identity-like
  - Stripe: 한 variate 가 *다른 모든 variates* 에 강하게 영향
  - Spike: 특정 variate pair 의 *uniquely* 강한 correlation
  - Outlier (low-row): isolated variate
  - Hub-and-spoke: 한 hub variate + 다른 모든 variates
```

→ APF 의 *parallel framework* (T×T vs N×N) — *paper main contribution* 후보.

### Axis 2: Head-level analysis

paper Fig 9 는 *head-aggregated* attention map. APF 의 *head-by-head 분리* 분석:

```
APF Head Analysis:
  Head 1 = "regional cluster detector" (geographic)
  Head 2 = "temporal pattern detector" (cycle)
  Head 3 = "outlier identifier"
  Head 4-8 = other roles

iTransformer Specific to study:
  Q: 8 heads 가 *redundant* 인가, *distinct role* 인가?
  Q: Head pruning 시 *어떤 task* 가 *robust*?
```

→ Voita 2019 / Clark 2019 의 NLP head pruning 의 *시계열 instantiation*.

### Axis 3: Pre-grok vs Post-grok attention dynamics

Grokking 트랙: *modular arithmetic Transformer* 의 phase transition. iTransformer 에 적용:

```
Setup:
  - iTransformer 학습 on Solar-Energy
  - 매 epoch 의 attention map 저장
  - Phase 1 (epoch 1-5): random-like attention
  - Phase 2 (epoch 5-50): cluster emerge
  - Phase 3 (epoch 50+): stable cluster

Q: Cluster emergence epoch = *generalization onset*?
```

→ Nanda 2023 의 *progress measure* 의 *attention dynamics* version.

### Axis 4: Multivariate correlation faithfulness

Jain-Wallace 2019 의 *attention not explanation* 의 iTransformer 적용:

```
H1 (Correlation): iTransformer 의 attention vs gradient/LOO
  → Variate axis 라 *interpretation 자연*
  → Kendall τ 높을 가능성

H2 (Counterfactual): adversarial attention 가능?
  → variate token 의 *임의 분포* 가 prediction 보존?
  → 학습된 cluster 의 robustness 검증
```

→ ANIE 의 *NLP only* 결과를 *TS 도메인* 으로 확장. APF 의 *cross-domain faithfulness* 의 *bridge*.

### Axis 5: TSFM era 의 mech interp

Wilinski 2025 (ICML) 의 TSFM mech interp 의 *iTransformer instantiation*:

```
Probing:
  iTransformer 의 layer-wise variate token activation
  → "이 layer 가 어떤 future value 예측"

Ablation:
  Specific head 또는 layer 의 *role 분리*
  → "Trend head" / "Seasonal head" / "Regime shift head"

Causal intervention:
  Specific variate token 의 *값 강제 변경* → prediction 영향
  → variate cluster 의 *causal sufficiency*
```

→ APF 의 *mechanistic interpretability methodology* 의 *5 axis sequence*.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **iTransformer 의 *4 흡수 지점* 중 *APF manuscript main figure* 후보?**
2. **§A (Grokking) ↔ iTransformer 연결의 *구체 mechanism*?**
3. **§E (ProTran-TFA) 의 *iTransformer 결합* — *low-N 한계* 의 우회 가능?**

### 답변

1. **N×N attention motif typology** — 본 paper Fig 9 의 *interpretable multivariate correlation* 의 *2D motif 분류*. APF 의 T×T motif (vanilla Transformer) 와의 *대립 축* — same paper 의 N×N motif typology + comparison. *APF Figure 1 또는 2* 의 직접 candidate.

2. **FFN 의 *temporal pattern learning* circuit 분석**. iTransformer 의 FFN = *T-length input* → *D-dim output* — *시간 패턴 학습 의 explicit module*. Grokking 트랙: "FFN 의 *어느 neuron 이 어느 frequency / amplitude 패턴 학습* 의 circuit-level analysis". Nanda 2023 의 *Fourier circuit* 의 시계열 instantiation — iTransformer 의 FFN 이 *직접 분석 대상*.

3. ***부분 가능***. ProTran (Tang & Matteson 2022) = *probabilistic forecasting + Transformer*. *Low-N 금융* (S&P 500 의 ~10 sector) 에서 iTransformer 의 *direct multivariate* + ProTran 의 *probabilistic head* 결합. 그러나 N=10 의 limit (iTransformer 의 weakness) 가 *지속* — *full breakthrough* 어려움. **TFA (technical feature augmentation)** 추가 = *artificial N 증가* (e.g., RSI/MACD/Bollinger 의 *derived variates*) → *effective N* 50+ 도달 가능. *expanded multivariate* 에서 iTransformer 의 advantage 회복.
