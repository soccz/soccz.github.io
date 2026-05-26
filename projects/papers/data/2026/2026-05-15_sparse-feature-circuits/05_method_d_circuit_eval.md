# 05d 방법론 — 회로 평가: 충실도와 완전도

> **🧒 한 줄 요약**: 3-fold metric: Faithfulness × Completeness × Minimality. 단일 metric 보다 강한 *causal claim*.


**배경 사다리**: ① 앞 파일들에서 정의한 IE를 알고 있어야 한다; ② "집합의 여집합(complement)"은 "전체에서 해당 집합을 뺀 나머지"를 의미한다는 것; ③ 이상적인 회로는 "충분히 행동을 설명하면서 동시에 불필요한 것을 포함하지 않는다"는 두 가지 조건을 동시에 만족해야 한다는 것.

---

## 문제: 회로의 "좋음"을 어떻게 측정하는가

회로를 발견했으면 "이 회로가 정말로 그 행동을 설명하는가"를 검증해야 한다. 너무 작으면 행동을 설명 못하고(미충족), 너무 크면 의미없이 전체 모델을 포함한다(과잉).

---

## 충실도 (Faithfulness, F)

$$F(C) = \frac{\text{IE}(C)}{\text{IE}(\text{Full})}$$

**기호 뜻**:
- $C$: 발견된 회로 — IE가 높은 특징들의 집합 $\{f_{i_1}, f_{i_2}, ...\}$
- $\text{IE}(C)$: 회로 $C$에 속한 특징들만 패칭했을 때의 총 IE
- $\text{IE}(\text{Full})$: 모든 특징을 패칭했을 때의 총 IE (전체 모델 기준)
- $F(C)$: 회로만으로 전체 행동의 몇 분의 몇을 설명하는가

**이상값**: $F \to 1$. F = 1이면 회로가 행동을 완전히 설명. F = 0이면 회로가 행동에 전혀 기여하지 않음.

**일상 비유**: 교실에서 퀴즈 정답을 맞히는 학생 그룹을 찾는다고 하자. F는 "내가 고른 그룹이 반 전체 정답의 몇 %를 커버하는가"에 해당한다. F = 1이면 내 그룹이 모든 정답을 다 맞힌다.

**조심할 점**: F만 보면 회로를 너무 크게 잡는 것이 항상 유리하다 — 전체 모델을 회로로 설정하면 F = 1이 자명. 이 문제를 해결하는 것이 완전도(C).

---

## 완전도 (Completeness, C)

$$\text{Comp}(C) = \frac{\text{IE}(\bar{C})}{\text{IE}(\text{Full})}$$

**기호 뜻**:
- $\bar{C}$: 회로 $C$의 여집합 — 회로에 포함되지 않은 모든 특징들의 집합
- $\text{IE}(\bar{C})$: 여집합 특징들만 패칭했을 때의 총 IE
- $\text{Comp}(C)$: "회로 밖의 것들"도 행동을 얼마나 설명하는가

**이상값**: $\text{Comp} \to 0$. C = 0이면 회로 밖에 중요한 것이 없음 (회로가 배타적). C = 1이면 회로 밖도 행동을 완전히 설명할 수 있음 (회로가 불필요함).

**일상 비유**: 같은 퀴즈 예시에서. Comp는 "내가 뺀 학생들도 정답을 다 맞히는가"에 해당한다. Comp = 0이면 내 그룹을 제외하면 아무도 정답을 못 맞힌다 — 그룹이 필수적이라는 뜻.

---

## F와 C의 트레이드오프

완벽한 회로는 $F = 1$, $\text{Comp} = 0$을 동시에 달성한다. 실제로는:

| 상황 | F | Comp | 의미 |
|------|---|------|------|
| 회로가 너무 작음 | 낮음 | 높음 | 행동 설명 불충분, 밖에 중요한 것이 많음 |
| 회로가 너무 큼 | 높음 | 낮음 | 설명하긴 하지만 불필요한 노드 포함 |
| 이상적 회로 | $\to 1$ | $\to 0$ | 딱 맞게 중요한 것만 포함 |
| 전체 모델 | 1 (자명) | 1 (자명) | 아무 정보도 없음 |

$$F + \text{Comp} = ?$$

흥미롭게도 $F + \text{Comp}$가 반드시 1이 될 필요는 없다. 비선형 상호작용이 있으면 $F + \text{Comp} > 1$ 또는 $< 1$이 될 수 있다. 이 값이 1에서 크게 벗어나면 선형 IE 근사가 잘못되었다는 신호가 된다.

---

## 임계값(τ)과 회로 크기의 관계

회로는 IE > τ인 특징들로 구성된다. τ를 높이면 회로가 작아지고(F 낮아짐, Comp 낮아짐), τ를 낮추면 회로가 커진다(F 높아짐, Comp 높아짐). 좋은 τ는 F와 Comp 사이의 적절한 균형을 만드는 값이다.

논문에서는 다양한 τ에 대해 F-Comp 곡선을 그리고, 특징 기반 회로가 뉴런 기반 회로보다 이 곡선에서 더 우수한(더 적은 노드로 더 좋은 F와 Comp 달성) 성능을 보임을 보인다.

---

## 수치: 100 특징 노드 vs 1,500 뉴런 노드

검색 스니펫에서 확인된 주요 결과:
> "the majority of performance in Pythia-70M is explained by only 100 nodes [특징 기반], while around 1,500 neurons are required to explain half the performance."

이 수치가 의미하는 바:
1. **해석 가능성의 경제성**: 특징 기반 회로는 15배 적은 노드로 더 많은 행동을 설명.
2. **각 노드의 "순도"**: 특징 노드는 인간이 이름 붙일 수 있는 단의미 개념 → 회로 이해가 쉬움. 뉴런 노드는 다의미적 → 1,500개가 있어도 각각이 무엇을 하는지 불명확.

이 결과는 F-Comp 평가 실험 내 (또는 별도 SVA 케이스 스터디 내) 특정 표/그림에서 나온 것으로 추정되나, 원문 직접 확인 불가로 정확한 위치는 "원문에 수치 미보고".

---

## 이 지표 체계가 ACDC와 다른 점

2026-05-11에 해체한 ACDC(Conmy et al. 2023)는 단일 임계값 τ와 KL-divergence / logit-difference / NLL 기반 중요도 지표를 사용하여 엣지를 역방향 위상 순서로 pruning한다. 그 과정에서 충실도는 암묵적으로 유지하되, 완전도를 별도로 측정하지 않는다.

SFC는 F와 Comp를 명시적 이중 지표로 설정하여 회로 품질을 양방향으로 측정한다. 또한 ACDC는 어텐션 헤드 단위(coarse-grained)인 반면, SFC는 SAE 특징 단위(fine-grained)다. 동일한 행동에 대해 SFC의 회로는 ACDC의 회로보다 더 작지만 더 해석 가능하다.

**이 섹션 핵심 요약**: 충실도(F)와 완전도(C)는 각각 "회로가 행동을 잘 설명하는가"와 "회로 밖에 중요한 것이 없는가"를 측정한다. 이 이중 지표를 함께 쓰면 회로의 크기와 품질을 균형있게 평가할 수 있다. SFC의 특징 기반 회로는 이 지표에서 뉴런 기반 회로보다 더 경제적이고 해석 가능하다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Faithfulness vs Completeness 의 *complementary check*?**
2. **Minimality 의 *proper subset check* algorithm?**
3. **단일 metric 의 *false positive* 시나리오 2가지?**

### 답변

1. **Causal directionality 의 양방향**. Faithfulness = "circuit 충분" (ablate non-circuit → no effect). Completeness = "circuit 필요" (ablate circuit → big effect). 두 가지 *상보적 confirmation*.

2. **Leave-one-out check**. For each f in circuit: drop = perf(circuit - {f}). If drop ≈ 0 → f 제거 가능 (redundant). Else → f critical. Final circuit = {f : critical}. 효율: O(|circuit|) — 50 features 의 경우 50 forward (5min).

3. **False positive 1**: faithful but over-include — "circuit 충분" 인데 *외부도 충분* (parallel paths). False positive 2: complete but redundant — "circuit 영향 큼" 인데 *circuit 내부에 unnecessary parts*. 3-fold 가 둘 다 reject.


```viz:sfc-circuit-evaluation:title=3-fold metric sweep,caption=3-fold metric sweep.
```
