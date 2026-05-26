# 8. 내 연구와의 연결

> **🧒 한 줄 요약**: 내 연구 (APF) 와 연결: phase diagram framework 의 *attention pattern emergence* 분석.


> **이 섹션의 규칙**: `_profile.md`의 관심 영역 §A~F 및 보유 자산(APF, Grokking track) 양쪽과 연결한다. 본 논문은 §A (Grokking/Delayed Generalization) 직격이므로 §A를 중심으로, §B (Mech interp)와의 교차, §C (Attention-PE)로의 전이 가능성 순서로 기술한다.

---

## §A 연결 — Grokking in TS Transformers (직접 인용, 핵심)

### 흡수할 기법: 4-위상 프레임워크를 TS 도메인으로 이식

Liu (2022)의 ($\alpha$, $\lambda$) 위상 다이어그램은 모듈러 연산과 MNIST에서 검증되었으나, **시계열 예측에서는 검증되지 않았다** — 이것이 Grokking track의 핵심 novelty 공간이다. 구체적으로:

1. **Grokking track Paper Plan의 §1 (Introduction/Motivation)**: "Why grokking matters for TS" 논증에서, Liu (2022)의 4-위상 프레임워크를 인용하며 "알고리즘적 과제에서의 grokking 이론이 존재하지만, TS 예측에서의 적용은 0편"이라는 gap statement를 구성. 인용 형태: "Liu et al. (2022) established a phase diagram framework identifying four learning phases (comprehension, grokking, memorization, confusion), but exclusively on algorithmic tasks (modular arithmetic, group composition) and image classification."

2. **Grokking track의 실험 설계**: Liu의 위상 다이어그램 구축 방법론을 직접 차용. (훈련 데이터 비율 $\alpha$, weight decay $\lambda$) 공간에서 TS transformer (PatchTST, iTransformer 등)의 학습 결과를 매핑. 다만, TS 도메인의 차별적 축을 추가해야 함:
   - **비정상성(non-stationarity) 축**: Lyle (2025)의 비정상 환경에서의 grokking과 연결. regime-switching synthetic에서 위상 경계가 정상 데이터 대비 어떻게 이동하는지.
   - **예측 수평선(forecast horizon) 축**: 짧은 horizon에서는 comprehension, 긴 horizon에서는 memorization/grokking 가능성.

3. **Grokking track의 핵심 실험 P2 (logistic 4-layer)**: Logistic map이라는 결정론적 카오스 시스템에서 grokking을 유도하는 실험. Liu (2022)의 유효 이론에서 "구조화 표현"은 군 구조(순환군 → 원)에 의존했지만, logistic map에는 군 구조가 없다. 대신 **어트랙터 구조**(attractor structure)가 존재 — logistic map의 bifurcation diagram이 "구조"의 역할을 하는지, 아니면 완전히 다른 메커니즘이 작동하는지가 핵심 질문. 이 질문은 Liu (2022)의 프레임워크로는 직접 답할 수 없으며, 확장이 필요.

### 충돌/경쟁 지점

Liu (2022)의 유효 이론은 **이산 과제(discrete task)** — 유한한 원소 집합의 연산 — 에 맞춰져 있다. TS 예측은 **연속 도메인** 위의 회귀(regression) 문제이므로:

- "구조화 임베딩"의 정의가 달라져야 한다. $\mathbb{Z}_{97}$에서 원 위 97개 점은 명확하지만, 연속 시계열의 "올바른 구조"는 무엇인가?
- 4-위상 중 "confusion"(학습 자체 실패)이 회귀에서는 다르게 발현. 분류에서 confusion = random 정확도이지만, 회귀에서는 예측이 상수(mean)에 수렴하는 것일 수 있음.
- 이 차이를 정리하고, TS 도메인에 맞는 위상 정의를 제안하는 것이 Grokking track의 이론적 기여 중 하나가 되어야 한다.

### 인용 포인트

- **논문 Introduction §1**: Gap statement에 핵심 인용. "Grokking has been characterized via phase diagrams in algorithmic and classification tasks [Power et al. 2022; Liu et al. 2022], but its manifestation in continuous-domain time series forecasting remains unexamined."
- **논문 Related Work §2.1**: "Theoretical Frameworks for Grokking" 소절에서 Liu (2022)의 유효 이론을 2–3문장으로 요약하고, "our work extends this framework to continuous forecasting tasks where algebraic group structure is absent."
- **논문 Experiment §4**: 위상 다이어그램 구축 시 Liu (2022)의 프로토콜($\alpha$-$\lambda$ sweep, 위상 분류 기준)을 명시적으로 참조.

---

## §B 연결 — Mechanistic Interpretability (교차)

Liu (2022)의 "구조화 표현의 출현"은 mechanistic interpretability의 질문과 직결:

- **ACDC (Conmy 2023, 이미 커버)**: 회로를 자동으로 발견하는 ACDC 방법론을 grokking 과정에 적용하면, "memorization 회로 → generalization 회로"의 전환을 회로 수준에서 관찰할 수 있을 것. Liu (2022)는 이 전환을 표현 수준에서만 관찰했으므로, 회로 수준과 표현 수준의 대응을 확인하는 실험이 가능.
- **Nanda (2023, 이미 커버)**: Nanda의 Fourier progress measures는 Liu의 "구조화 임베딩 출현"의 정량적 대리 지표(proxy)로 해석 가능. Grokking track의 TS 실험에서 Nanda의 progress measures를 Liu의 위상 다이어그램과 연결하면 — 예를 들어 위상 경계 부근에서 Fourier norm이 어떻게 변하는지 — 두 프레임워크의 통합적 분석이 가능.
- **Sparse Feature Circuits (Marks 2024, 이미 커버)**: SAE 특징 기반 회로 분석을 grokking 전/후에 적용. Grokking 전(memorization)에서 활성화되는 SAE 특징과 grokking 후(generalization)에서 활성화되는 SAE 특징을 비교하면, "구조화"의 SAE-level 대응물을 발견할 수 있을 것.

---

## §C 연결 — Attention-PE Geometry (전이 가능성)

연결은 간접적이지만 존재한다:

- **Liu (2022)의 "구조화 임베딩 = 원형 배치"와 APF track의 "attention motif"**: APF에서 분석하는 attention 패턴(diagonal, stripe, block, spike 등)은 입력 임베딩의 기하학에 의해 영향받는다. Liu (2022)가 보여준 것처럼 임베딩이 원형으로 구조화되면, self-attention의 내적 $\mathbf{q}^\top \mathbf{k}$가 cosine 유사도를 통해 **주기적 attention 패턴**(diagonal/stripe motif에 대응)을 생성할 수 있다. 이것은 Yang (TAPPA, ICLR 2026, 이미 커버)의 q-similarity 프레임워크와 연결.
- **PE의 역할**: Liu (2022)에서 위치 인코딩(PE)은 명시적으로 분석되지 않음(MLP 실험에서는 PE 불필요, transformer 실험에서는 Power 2022 세팅 그대로). 하지만 PE가 임베딩의 기하학적 구조화를 촉진하거나 방해하는지는 APF track의 핵심 질문 중 하나 — sinusoidal PE가 순환군의 원형 구조와 공명(resonance)할 가능성.

**연결 강도 평가**: 약함. Liu (2022)는 attention 메커니즘의 세부를 분석하지 않으며, PE에 대한 명시적 논의도 없다. APF track에 대한 기여는 "구조화 임베딩이 attention 패턴에 미치는 간접적 영향"이라는 아이디어 수준에 그침. 직접 인용보다는 "향후 방향"에서의 연결이 적절.

---

## 반면교사: Liu (2022)가 못한 것을 내가 어떻게 다루나

1. **연속 도메인 확장**: Liu는 이산 과제에 머물렀다. Grokking track은 연속 시계열로 확장하되, 위상 정의를 MSE/MAE 기반으로 재설계. "Grokking in forecasting"의 조작적 정의를 제안하는 것이 내 기여.

2. **Causal intervention 부재**: Liu는 "구조화 임베딩 → 일반화"의 인과 관계를 개입 실험으로 검증하지 않았다. Grokking track에서 APF의 motif intervention 방법론(학습된 attention 패턴을 인위적으로 변형)을 차용하여, 임베딩 구조화와 일반화 사이의 인과를 검증하는 실험을 설계할 수 있음.

3. **Progress measure의 범용화**: Liu의 "시각적 확인"(PCA 투영으로 원형 배치를 눈으로 확인)은 범용적이지 않다. Nanda의 Fourier progress measure도 모듈러 연산에 특화되어 있다. TS 예측에서의 progress measure — 예를 들어 임베딩의 시간적 부드러움(temporal smoothness), 주파수 스펙트럼 집중도, 또는 어트랙터 재구성 품질 — 를 제안하는 것이 필요.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **09_my_research *핵심 claim*?**
2. **09_my_research *technical detail*?**
3. **09_my_research *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
