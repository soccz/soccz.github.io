# 4-C. 방법론 해부 — 해석가능성 평가 프로토콜 & 구현 세부

> **🧒 한 줄 요약**: Monosemanticity 의 *3-fold verification*: top-context inspection, auto-interpretation (LLM 라벨), activation distribution.


> **배경 사다리**: 이 절은 "특징이 해석 가능하다"는 주장을 어떻게 엄밀하게 검증하는지를 다룬다. 기본 전제: 해석가능성은 주관적이므로 여러 독립적 측정 방법으로 교차 검증해야 한다.

---

## 왜 해석가능성 평가가 어렵나?

"이 특징은 DNA 서열에 반응한다"는 주장이 맞는지 확인하려면:
1. 많은 입력 사례를 수집해서 패턴을 찾아야 한다.
2. 그 패턴 설명이 단지 training data 암기인지 진짜 의미론인지 구분해야 한다.
3. 인간 평가자의 주관이 개입하면 bias가 생긴다.
4. 수천 개의 특징을 모두 수동으로 평가하는 것은 비현실적이다.

저자들은 이 네 가지 문제를 각각 다른 평가 기법으로 해결한다.

---

## 평가 기법 1 — 최대 활성화 문맥 (Maximum Activation Contexts)

**절차**:
1. 특징 $i$에 대해, 훈련 데이터 전체에서 $f_i(x)$가 가장 높은 상위 K개 문맥을 수집.
2. 연구자(또는 평가자)가 그 문맥들을 보고 공통 패턴을 식별.
3. 패턴이 명확하면 "단의미(monosemantic)", 여러 무관한 패턴이 보이면 "다의미(polysemantic)"로 분류.

**장점**: 직관적이고 무엇이 특징을 활성화하는지 직접 확인 가능.

**한계**: (a) 상위 K개는 고활성 사례만 보여준다 — 중간 활성화 맥락을 놓칠 수 있다. (b) 연구자 기대 bias — 특징을 찾으려는 경향이 패턴을 "발견"하게 만들 수 있다.

---

## 평가 기법 2 — 인간 대규모 해석가능성 평가

**절차**:
1. 특징 K개를 랜덤 샘플링.
2. 각 특징에 대해 최대 활성화 문맥 목록을 인간 평가자에게 보여줌.
3. 평가자가 "이 특징의 의미가 명확한가?" 등을 5점 척도로 평가.
4. 동일한 과정을 뉴런에 대해서도 반복 (비교 대조군).

**결과**: 특징이 뉴런보다 더 높은 해석가능성 점수를 받음. [구체적 퍼센티지: 원문에 수치 미보고 — 이 환경에서 원문 직접 확인 불가]

**중요한 설계 결정**: 인간 평가자들은 이것이 특징인지 뉴런인지 모르게 "블라인드" 처리. 이는 평가자 기대 bias를 방지한다.

---

## 평가 기법 3 — 자동화 해석가능성 (AutoInterp)

이것이 가장 혁신적인 평가 방법이다. 사람 없이 기계적으로 해석가능성을 측정한다.

**절차**:
1. **설명 생성**: 특징 $i$의 최대 활성화 문맥 목록을 언어 모델(Claude)에게 보여주고 "이 문맥들의 공통점을 설명하라"고 요청. → 설명 $D_i$ 획득.
2. **예측 검증**: 새로운 데이터에서 임의의 문맥 집합을 언어 모델에게 보여주고, "설명 $D_i$와 일치하는 문맥의 번호를 맞춰라"고 요청. 설명이 정확하다면, 언어 모델이 $f_i(x) > 0$인 문맥을 옳게 식별해야 한다.
3. **점수 산출**: 예측 정확도를 "자동화 해석가능성 점수"로 사용.

**수식으로 표현**:
$$\text{AutoInterp}(i) = P(\text{LM이 } f_i(x) > 0 \text{인 문맥을 맞춤} \mid D_i)$$

**왜 이것이 강력한가**: 설명 $D_i$가 진짜로 특징을 설명한다면, 그 설명은 새 데이터에서도 예측력을 가져야 한다. 이것은 과학적 가설의 검증 방식과 동일하다.

**한계**: 언어 모델 자체의 편향이 개입할 수 있다 — 언어 모델이 특정 설명 스타일을 선호하거나 특정 패턴을 더 쉽게 인식할 수 있다. 또한 원형(prototype)이 아닌 경계 사례(edge cases)에서 오류가 날 수 있다.

---

## 평가 기법 4 — 로짓 가중치 분석 (Logit Weight Analysis)

**절차**: 특징 $i$의 방향 벡터 $\mathbf{d}_i \in \mathbb{R}^d$를 언어 모델의 임베딩 행렬 $E \in \mathbb{R}^{V \times d}$ (어휘 크기 $V$)에 투영:

$$\text{logit weights}_i = E \cdot \mathbf{d}_i \in \mathbb{R}^V$$

**수식 해석 (4줄)**:
1. **기호 뜻**: $E$는 출력 임베딩 행렬로, 각 행이 하나의 어휘 토큰에 대응. $\mathbf{d}_i$는 특징 $i$의 방향. 내적 $E \cdot \mathbf{d}_i$의 $k$번째 원소는 "특징 $i$가 활성화됐을 때 어휘 토큰 $k$가 얼마나 강하게 예측되는가"를 나타낸다.
2. **일상 비유**: "이 스위치를 켜면 어떤 전구들이 밝아지나?" — 로짓 가중치는 특징 스위치를 켰을 때 어떤 단어 출력이 높아지는지를 직접 보여준다.
3. **왜 이 형태**: 언어 모델의 최종 출력이 임베딩 행렬과의 내적으로 계산되므로, 특징 방향을 임베딩 공간에서 직접 볼 수 있다. 이것은 순방향(forward) 해석이라 할 수 있다 — 특징이 "무엇에 반응하는가" (입력 측)가 아니라 "무엇을 예측하는가" (출력 측)를 본다.
4. **조심할 점**: 최종 레이어의 임베딩과만 비교하므로, 중간 층의 특징들은 직접적으로 이 분석을 쓸 수 없다. 1-layer transformer이기 때문에 이 분석이 의미 있다.

---

## 구현 세부 사항

**훈련 데이터**: [정확한 코퍼스: 원문에 수치 미보고 — 훈련 지식으로는 OpenWebText 또는 The Pile의 부분 집합으로 알려져 있으나 원문 직접 확인 불가]

**SAE 훈련 설정**:
- Optimizer: Adam
- Learning rate scheduling: warm-up + decay
- Batch size: [원문에 수치 미보고]
- $\lambda$ 값: [원문에 수치 미보고 — 여러 값 시험]

**중요한 트릭 — 디코더 열 재정규화**:
매 gradient step 후 $W_\text{dec}$의 열들을 단위 노름으로 정규화:
$$\mathbf{d}_i \leftarrow \mathbf{d}_i / \|\mathbf{d}_i\|_2$$

이 재정규화 없이는 SAE가 큰 크기를 가진 소수의 특징에 의존하는 해로 수렴할 수 있다.

**죽은 특징 처리**: 학습 중 일부 특징 유닛이 항상 0 활성화를 보이는 "죽은 특징" 문제가 발생. 이를 해결하기 위해 주기적 재초기화 또는 auxiliary loss(죽은 유닛에 페널티 부여) 등의 기법을 사용한다 [구체 방법: 원문에 수치 미보고].

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **3-fold verification (context, auto-interp, distribution) 의 *complementary roles*?**
2. **Auto-interpretation 의 *87% rate* 의 *epistemic limitation*?**
3. **"Monosemanticity 는 binary 가 아닌 spectrum" 의 의미?**

### 답변

1. **Context = qualitative direct evidence**. Auto-interp = quantitative + scalable. Distribution = mathematical signature (sparse + heavy-tailed). Context: human reads top-K activating sentences → 직관적 judgement. Auto-interp: LLM 으로 자동 → 4096 features 모두 가능. Distribution: power-law tail = monosemantic signature. *3-fold cross-confirmation*.

2. **LLM ability + concept familiarity limit**. GPT-4 의 87% success = "GPT-4 가 alabel 가능한 features 의 87%". Rare concept, domain-specific (e.g., legal Latin), multi-lingual feature 등 *GPT-4 cover 부족* → "fail" — 하지만 *actually monosemantic* 가능. → 87% 가 *under-estimate* possible.

3. **Spectrum interpretation**. Bricken 의 87% = "*single dominant concept* 의 feature 비율". 13% polysemantic = "*2+ concepts of comparable weight*". 하지만 monosemantic 의 *내부* 도 *weak secondary concept* 가 있을 수 있음 (e.g., feature 12 가 "*he/his/him* (strong) + *boy/man* (weak)"). → *binary categorization* 보다 *purity spectrum* (0-1) 가 *more accurate*.


```viz:bricken-feature-activation:title=paper §4 — Feature Activation Distribution,caption=Mono/poly feature selector.
```
