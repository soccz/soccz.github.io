# 05c 방법론 — 간접 효과(IE) & 어트리뷰션 패칭

> **🧒 한 줄 요약**: Attribution patching = ∇L · z (1 forward + 1 backward). ACDC 대비 1000× 빠름, correlation 0.95+.


**배경 사다리**: ① "반사실 개입(counterfactual intervention)"은 "만약 이 부분이 달랐다면 결과가 어떻게 달라졌을까"를 묻는 인과 추론 방법이라는 것; ② "Taylor 전개(Taylor expansion)"는 복잡한 함수를 근처에서 선형(직선)으로 근사하는 것이라는 것; ③ "gradient(기울기)"는 입력을 조금 바꿨을 때 출력이 얼마나 변하는가를 나타내는 벡터라는 것.

---

## 왜 IE가 중요한가: 인과성과 상관성의 차이

회로 발견의 목적은 특정 행동의 **인과적** 원인을 찾는 것이다. 단순히 "어떤 특징이 이 행동과 함께 활성화되는가"를 보는 것(상관성)은 위험하다 — 성별 특징이 직업 예측 시 함께 활성화되지만, 그것이 직업 예측을 유발하는 것인지, 아니면 맥락의 일부로 그냥 활성화된 것인지 구분이 안 된다.

**간접 효과(IE, Indirect Effect)**는 이 문제를 반사실 개입으로 해결한다: "이 특징의 활성화를 다른 값으로 강제로 바꾸면, 최종 출력이 얼마나 달라지는가?"

---

## 기본 설정: Clean과 Corrupted 쌍

IE 계산의 기본 구조:

- **$\mathbf{x}$**: "깨끗한(clean)" 입력 — 우리가 설명하려는 실제 입력
- **$\mathbf{x}^*$**: "오염된(corrupted)" 입력 — 다른 맥락의 입력 (같은 구조지만 정답이 다른 쌍)
- **$y$**: 모델 행동을 측정하는 스칼라 지표 (예: $\log p(\text{"are"}) - \log p(\text{"is"})$)

예시 (주어-동사 일치):
- Clean: "The cats that the dog ___ [VERB]" → 정답 "are"
- Corrupted: "The cat that the dogs ___ [VERB]" → 정답 "is"

---

## 간접 효과(IE) 정의

구성요소 $c$의 간접 효과:

$$\text{IE}(c) = y(\mathbf{x}^*_{c \leftarrow c_{\text{clean}}}) - y(\mathbf{x}^*)$$

**기호 뜻**:
- $\mathbf{x}^*_{c \leftarrow c_{\text{clean}}}$: corrupted 입력에서 구성요소 $c$의 활성화만 clean 입력의 활성화로 패칭(교체)한 것
- $y(\mathbf{x}^*)$: corrupted 입력의 기준 지표값
- $\text{IE}(c)$: 패칭으로 인한 지표 변화 — 클수록 $c$가 행동에 더 인과적으로 중요

**일상 비유**: 자동차 고장 진단과 같다. "원래 잘 달리던 부품(clean)을 고장난 차(corrupted)에 하나씩 이식해보면, 이식 후 차가 다시 달리기 시작하면 그 부품이 원인이다."

**왜 이 형태**: 단순히 "활성화 값이 크면 중요하다"는 것(순방향 기울기)은 인과성을 보장하지 않는다. IE는 실제 개입(patching)의 효과를 측정하므로, 상관이 아닌 인과를 포착한다.

**조심할 점**: 이 정의에서 IE는 단일 (clean, corrupted) 쌍에 대한 값이다. 실제로는 많은 쌍에 대해 평균을 취한다. 또한 corrupted 입력의 선택이 IE 값에 영향을 준다 — 어떤 corrupted를 고르느냐가 "무엇에 비해 인과적인가"의 의미를 결정.

---

## 문제: 계산 복잡도

$n$개의 특징에 대해 IE를 정확히 계산하려면 $n$번의 순방향 패스가 필요하다. Pythia-70M에서 모든 레이어의 모든 SAE 특징 수를 $m$이라 하면 $m$이 수만에 달할 수 있다. 매번 전체 순방향 패스를 돌리면 계산 비용이 너무 크다.

해결책: **IE의 근사 방법 두 가지**

---

## 근사 방법 1: 어트리뷰션 패칭(Attribute Patching, AP)

1차 Taylor 전개를 이용한 빠른 근사:

$$\text{AP}(c) \approx \nabla_c y(\mathbf{x}^*) \cdot (\mathbf{c}_{\text{clean}} - \mathbf{c}^*)$$

**기호 뜻**:
- $\nabla_c y(\mathbf{x}^*)$: corrupted 입력에서 구성요소 $c$에 대한 $y$의 기울기 (벡터)
- $\mathbf{c}_{\text{clean}}$: clean 입력에서 구성요소 $c$의 활성화 (벡터)
- $\mathbf{c}^*$: corrupted 입력에서 구성요소 $c$의 활성화 (벡터)
- $\cdot$: 내적(dot product)

**일상 비유**: 함수의 접선을 이용해 "조금 더 가면 함수값이 얼마가 될까"를 추정하는 것. 그래프에서 현재 위치의 기울기(미분값)에 이동거리를 곱해 변화량을 추정한다.

**왜 이 형태**: corrupted 상태에서의 기울기($\nabla_c y$)와 clean/corrupted 활성화 차이($\mathbf{c}_{\text{clean}} - \mathbf{c}^*$)만 알면 계산이 끝난다. 단 1~2번의 순방향/역방향 패스로 모든 특징의 AP를 동시에 계산할 수 있다.

**조심할 점**: 1차 근사이므로 활성화 차이가 클수록 오차가 커진다. 비선형 함수(ReLU, softmax 등)가 많은 신경망에서 선형 근사는 근본적으로 부정확할 수 있다. 특히 특징이 on/off로 급격히 변하는 경우 오차가 크다.

**계산 비용**: $O(1)$ 추가 역방향 패스. 매우 빠르다.

---

## 근사 방법 2: 통합 기울기(Integrated Gradients, IG)

선형 보간 경로를 따라 기울기를 적분하는 더 정확한 근사:

$$\text{IG}(c) \approx (\mathbf{c}_{\text{clean}} - \mathbf{c}^*) \cdot \int_0^1 \nabla_c y\left(\mathbf{x}^* + t(\mathbf{x} - \mathbf{x}^*)\right) dt$$

실제로는 이산 합으로 근사:

$$\text{IG}(c) \approx \frac{1}{K}(\mathbf{c}_{\text{clean}} - \mathbf{c}^*) \cdot \sum_{k=0}^{K-1} \nabla_c y\left(\mathbf{x}^* + \frac{k}{K}(\mathbf{x} - \mathbf{x}^*)\right)$$

**기호 뜻**:
- $K$: 적분 단계 수 (논문에서는 원문에 수치 미보고, 보통 10~50)
- $t \in [0, 1]$: corrupted에서 clean으로 선형 보간하는 비율
- 나머지는 AP와 동일

**일상 비유**: 같은 "이동거리에서 함수가 얼마나 변하는가" 추정이지만, 접선을 한 번만 쓰는 것(AP)이 아니라 출발점에서 도착점까지 여러 중간 지점의 기울기를 평균 내서 더 정확하게 추정하는 것.

**왜 더 정확한가**: IG는 Sundararajan et al. 2017에서 도입된 어트리뷰션 방법으로, 선형성(linearity)이나 더미(dummy) 공리 등을 만족하는 이론적 기반이 있다. 비선형 함수가 있어도 경로를 따라 여러 번 기울기를 평가하므로 AP보다 오차가 작다.

**조심할 점**: $K$번의 순방향/역방향 패스가 필요하므로 AP보다 $K$배 느리다. 또한 선형 보간 경로 자체가 신경망 내부에서 의미있는 경로인지 보장이 없다.

---

## 엣지 IE: 특징 간 연결 강도

회로의 엣지 (특징 $f_i \to$ 특징 $f_j$) 가중치도 IE로 정의한다. 이 경우 "$f_i$가 $f_j$에 미치는 직접 기여"를 측정하기 위해, $f_i$의 출력이 $f_j$의 입력에 미치는 경로의 IE를 계산한다. 구체적 계산은 실제 레이어 구조 (residual connections, MLP, attention)를 통한 선형 경로 분해에 의존한다.

이 엣지 IE 계산이 SFC를 단순한 "중요한 노드 목록"이 아닌 **인과 그래프**로 만드는 핵심이다.

---

## AP vs IG: 실제 선택 기준

| 기준 | 어트리뷰션 패칭(AP) | 통합 기울기(IG) |
|------|---------------------|-----------------|
| 계산 속도 | 매우 빠름 ($O(1)$ 패스) | 느림 ($O(K)$ 패스) |
| 정확도 | 낮음 (1차 근사) | 높음 |
| 대규모 탐색 | 적합 (1차 필터링) | 부적합 |
| 회로 정제 | 부적합 | 적합 |

논문에서는 두 방법의 효율성-정확도 트레이드오프를 실험으로 비교하여 AP가 대규모 초기 탐색에, IG가 최종 회로 정제에 적합함을 보인 것으로 추정된다 (원문 실험 결과 표 직접 확인 불가).

**이 섹션 핵심 요약**: IE는 반사실 패칭 실험으로 특징의 인과 기여를 측정한다. AP는 1차 Taylor 근사로 빠르게, IG는 경로 적분으로 정확하게 IE를 근사한다. 이 두 방법의 조합이 SFC의 대규모 회로 발견을 가능하게 한다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Attribution = gradient × activation 의 *Taylor 의미*?**
2. **1000× speed-up 의 *mathematical derivation*?**
3. **High-order interaction 의 *5% mismatch* 의 root cause?**

### 답변

1. **First-order Taylor approximation**. L(z + Δz) ≈ L(z) + ∇L · Δz. Full ablation: Δz = -z → effect ≈ -∇L · z. Single backward → 모든 features 의 effect *동시 추정*.

2. **N → 2 passes**. Explicit ablation: N feature * 1 forward = N passes. Attribution: 1 forward + 1 backward = 2 passes. N=32K → 16K× theoretical speed-up. 실측 1000× (overhead 포함).

3. **Multi-feature synergy**. First-order = independent feature 가정 — pair (f_i, f_j) 의 *synergistic effect* 미포착. e.g., XOR-like interaction. paper §3 의 5% mismatch 의 root cause 추정. Second-order Hessian → 잠재적 fix.


```viz:sfc-attribution-flow:title=Attribution patching pipeline,caption=Attribution patching pipeline.
```
