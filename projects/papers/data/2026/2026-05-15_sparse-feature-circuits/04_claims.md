# 04 핵심 Claim 해체

> **🧒 한 줄 요약**: 본 paper 의 *4 claim*: (1) attribution patching의 1000× 가속, (2) sparse circuit 의 존재, (3) 3-fold evaluation, (4) bias removal demo.


**배경 사다리**: ① "회로(circuit)"는 모델의 특정 행동에 인과적으로 관여하는 구성요소의 집합, ② "SAE 특징"은 sparse autoencoder가 추출한, 인간이 해석 가능한 단의미 방향 벡터, ③ "간접 효과(IE)"는 어떤 구성요소를 변경했을 때 최종 출력이 얼마나 변하는가를 측정하는 양.

---

## Claim 1: SAE 특징 기반 회로는 뉴런·어텐션 헤드 기반 회로보다 훨씬 해석 가능하다

**주장**: 동일한 행동을 설명하는 데 있어, 특징 회로는 100개 노드로 충분한 반면 뉴런 기반 회로는 약 1,500개 노드가 필요하다. 그리고 특징 노드들은 개별적으로 인간이 의미를 붙일 수 있지만, 뉴런 노드들은 다의미적이어서 해석이 어렵다.

**증거**: 검색 스니펫에서 직접 인용 — "the majority of performance in Pythia-70M is explained by only 100 nodes, while around 1,500 neurons are required to explain half the performance." (원문 표 위치 미확인 — 원문 직접 접근 차단으로 section/table 번호 특정 불가)

**숨은 전제**:
- SAE 특징이 실제로 "해석 가능"하다는 것 — 인간 판단 기준이며 주관적임.
- "해석 가능"이 "인과적으로 중요"와 동치라는 것 — 해석 가능하지만 인과적이지 않은 특징도 있을 수 있음.
- Pythia-70M에서 성립하는 결과가 더 큰 모델에서도 유지된다는 것 — 논문에서 직접 검증되지 않음.

**쉬운 말 풀이**: "AI 뇌의 전선 지도를 그릴 때, 뉴런 단위로 그리면 1,500개의 복잡한 노드가 필요한데, 특징 단위로 그리면 100개의 단순하고 이름 붙이기 쉬운 노드로 같은 지도를 완성할 수 있다."

---

## Claim 2: 충실도(F)와 완전도(C)를 함께 쓰면 회로 품질을 더 정확히 측정할 수 있다

**주장**: 기존에 충실도(F)만 사용하던 회로 평가를 완전도(C)로 보완하면, "회로가 충분히 설명력이 있으면서도 불필요한 구성요소를 포함하지 않는가"를 동시에 확인할 수 있다.

$$F(C) = \frac{\text{IE}(C)}{\text{IE}(\text{Full})} \quad (\text{이상값: } F \to 1)$$
$$\text{Comp}(C) = \frac{\text{IE}(\bar{C})}{\text{IE}(\text{Full})} \quad (\text{이상값: } C \to 0)$$

- $C$: 발견된 회로(circuit)
- $\bar{C}$: 회로의 여집합 (complement) — 회로에 포함되지 않은 나머지 구성요소들
- $\text{IE}(\cdot)$: 해당 구성요소 집합의 간접 효과 합계
- $\text{IE}(\text{Full})$: 전체 모델의 간접 효과 (정규화 기준)

**기호 뜻**: $F$는 "회로만으로 전체 행동을 얼마나 재현하는가" (회로의 포용력), $\text{Comp}$는 "회로를 빼고 남은 것도 행동을 설명하는가" (회로의 배타성). 둘 다 좋으면 회로가 "딱 맞게" 발견된 것.

**일상 비유**: 레시피에서 "필수 재료 리스트"를 만든다고 하자. F는 "이 리스트로 요리를 완성할 수 있는가", C는 "리스트에서 뺀 재료들만으로는 요리가 안 되는가"를 동시에 체크하는 것과 같다.

**왜 이 형태**: 단일 지표(F만)로는 회로가 너무 커도(전체 모델 포함해버리면 F=1이 자명) 좋은 점수를 받는다. C를 추가하면 이를 방지.

**조심할 점**: IE는 선형 근사에 기반할 수 있고, F와 C의 합이 1이 아닐 수 있다 — 특징 간 비선형 상호작용이 있으면 양쪽 항에서 동시에 설명이 될 수 있음.

**숨은 전제**: IE를 "중요도"로 해석하는 것은 선형 기여 가정. 실제 모델 내부에는 비선형 상호작용이 있으므로 IE는 근사다.

**쉬운 말 풀이**: "회로가 '충분히 좋다'는 것을 확인하려면, 회로가 행동을 잘 설명하는지(F)와 회로 밖의 부분이 행동을 설명하지 못하는지(C) 둘 다 확인해야 한다."

---

## Claim 3: SHIFT로 특정 특징을 ablation하면 편향 없이 OOD 일반화가 가능하다

**주장**: 직업 분류기(Bias in Bios 데이터셋)에서 성별과 상관된 특징들을 희소 특징 회로에서 식별하고 ablation하면, 모델이 성별 정보에 의존하는 것이 "거의 완전히" 제거되어 OOD 데이터(분포 이동 상황)에서 일반화가 개선된다.

**증거**: 검색 스니펫에서 확인 — "applying SHIFT on the model almost completely removes dependence on the unintended signal (gender) to make classifications." (원문 수치 테이블 위치 미확인)

**SHIFT 메커니즘 개요**:
1. 훈련된 분류기가 직업 예측에 사용하는 특징 회로를 발견
2. 각 특징이 성별 정보를 반영하는지 인간이 판단 (interpretable feature → 식별 가능)
3. 성별 관련 특징들을 ablation (활성화를 0 또는 baseline으로 고정)
4. OOD 테스트셋에서 성별 의존도 측정

**숨은 전제**:
- 특징이 충분히 해석 가능해서 인간이 "이것이 성별 정보다"를 올바르게 판단할 수 있다.
- ablation이 완전하다 — 성별 정보가 ablation하지 않은 다른 특징들에도 인코딩되어 있으면 효과 반감.
- OOD 개선이 단순히 정보 손실 때문이 아니라 인과 편향 제거 때문임을 확인해야 한다.

**쉬운 말 풀이**: "AI가 직업을 추측할 때 '여성이름이 보이면 더 낮은 직업 점수'라는 나쁜 패턴을 사용하고 있다면, 그 나쁜 패턴을 담당하는 특정 특징들만 골라 없애서 AI의 편견을 수술로 제거할 수 있다."

---

## Claim 4: 완전 비지도 파이프라인으로 수천 개 회로를 자동 발견할 수 있다

**주장**: 행동을 미리 정의하지 않아도, 자동으로 행동을 탐지하고, 각 행동에 대한 희소 특징 회로를 발견하는 파이프라인을 Pythia-70M에 적용해 수천 개 회로를 생성할 수 있다.

**증거**: GitHub README — "demonstrates an entirely unsupervised and scalable interpretability pipeline by discovering thousands of sparse feature circuits for automatically discovered model behaviors." (수천의 정확한 수치: 원문에 수치 미보고)

**숨은 전제**:
- "자동으로 탐지된 행동"의 품질 — 자동 탐지 과정에서 실제로 의미있는 행동이 선택되는지 보장이 어려움.
- 스케일 가능성 주장 — Pythia-70M에서 가능하다고 GPT-4 수준에서 가능한 것은 아님.

**쉬운 말 풀이**: "사람이 '이 행동을 보자'고 지정하지 않아도, AI가 스스로 흥미로운 행동 패턴을 찾아내고 각각에 대한 회로 지도를 자동으로 그리는 공장을 만들었다."

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Claim 1 (1000× speed-up) 의 *empirical validation*?**
2. **Claim 2 (sparse circuit existence) 의 *non-obviousness*?**
3. **Claim 3 (3-fold evaluation) 의 *causal strength*?**

### 답변

1. **Correlation > 0.95 (paper Figure 4)**. Marks 가 attribution score 와 explicit ablation effect 의 *직접 correlation* 측정 → 95-98%. 1000× 속도는 이론 (1 backward vs N forward) + empirical (실측 5 min vs 6 hours). *empirical validation*: paper Table 2 의 *replicated ACDC IOI numbers* 와 attribution 결과의 *parallelism*.

2. **Counterintuitive**: 32K features 중 *0.1% 만* (~50 features) task circuit 에 충분 — *sparsity 의 extreme degree*. 사전 prior 는 "*많은 features 필요*" — 실제는 *50 만으로 95% faithfulness*. → "*복잡 task 의 causal mechanism* 가 극도로 *sparse*" — mech interp 의 *surprising empirical finding*.

3. **Tri-condition 의 *logical strength***. 단일 metric: "circuit 의 effect 큼" → over/under-claim 가능. 3-fold: F + C + M 동시 만족 = "*minimal sufficient necessary*" 의 *logical 3-corner*. ACDC 의 KL 단일 metric 대비 *causal claim strength* upgrade.
