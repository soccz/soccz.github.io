# 10a · 사고 확장: 자문 질문 5 개

## 배경 사다리
이 절은 본 논문에 대해 "내가 진짜 이해했는가" 를 시험하는 자문 질문들. 각 질문마다 ① 왜 이 질문이 중요한가 + ② 어떤 형태의 답이 만족스러운가 를 함께 기록.

---

## Q1. Mean ablation 대신 zero ablation 을 썼다면 회로가 어떻게 달라졌을까?

**왜 중요한가**: 본 논문의 모든 결과는 mean ablation 의 선택에 의존. 만약 zero ablation 으로 같은 절차를 거쳤을 때 회로가 크게 달라진다면, "이 회로가 진짜 회로다" 의 주장은 ablation choice 의 artifact 일 가능성. ACDC (Conmy 2023) 가 일부 답을 주지만 본 논문 자체는 이 비교를 충분히 다루지 않은 듯.

**만족스러운 답의 형태**:
- "Zero ablation 으로도 동일 26 head 가 추출되되 임계값이 다를 뿐" → 회로는 ablation-invariant.
- "Zero 와 mean 으로 다른 head 가 추출됨, 교집합이 X 개" → 회로 정의가 ablation 의존 → 보다 신중한 해석 필요.
- 본 환경에서는 이 비교가 직접 검증되지 않았으므로, 답은 **후속 연구 (ACDC) 에 의존** — open.

---

## Q2. 26 head 중 한 head 를 빼면 모델은 어떻게 작동하나? (Minimality 의 정성 결과)

**왜 중요한가**: Minimality 메트릭은 "$F(C) - F(C \setminus \{v\})$ 가 크다" 만 보고. 하지만 그 large drop 의 정성적 행동 — 모델이 어떤 잘못된 답을 내는지 — 이 중요. 예: name mover head 하나를 빼면 (a) 모델이 random 한 단어를 내나, (b) S 이름을 내나, (c) 빈 응답을 내나? 각 case 가 그 head 의 진짜 기능을 다르게 시사.

**만족스러운 답의 형태**:
- "Name mover 제거 시 → logit 이 IO 와 S 사이로 fall back → 모델이 S 를 출력" → name mover 가 IO direction 만 담당.
- "S2 inhibition 제거 시 → 모델이 S 를 더 많이 출력" → s2 inhibition 이 정확히 S 차단 담당.
- "Induction 제거 시 → 모델이 직전 token 의 일반 단어를 출력" → induction 이 sequence copy 의 backbone.
- 본 환경에서 본문 Fig 7 추정 위치의 정성 분석이 필요 — 단정 안 함.

---

## Q3. IOI 회로의 head 가 다른 작업에서도 같은 기능을 하는가? (Polysemanticity vs Reuse)

**왜 중요한가**: 본 논문의 명명 ("name mover 9.9") 이 IOI 만의 기능인지, 일반적 기능인지가 회로 발견의 일반화 가능성을 결정. 만약 head 9.9 가 IOI 가 아닌 task 에서 전혀 다른 일을 한다면 polysemanticity → 본 논문의 명명은 task-specific labeling. 반대로 같은 일을 한다면 reuse → 회로 부품이 task-invariant.

**만족스러운 답의 형태**:
- Multi-task evaluation: 다른 task (e.g., greater-than, factual recall) 에서 head 9.9 의 attention pattern 과 OV direction 을 본 IOI 사례와 비교.
- "9.9 가 모든 name-related task 에서 'name mover' 로 작동" → reuse.
- "9.9 가 factual recall 에서는 'fact relay' 로 작동" → polysemanticity, 본 논문의 명명은 task-specific.
- Anthropic 의 후속 연구 (특히 "Universality" 연구) 에서 부분적 답이 있을 듯.

---

## Q4. Path patching 의 freeze 정의가 정확히 무엇이며, 그게 왜 결정적인가?

**왜 중요한가**: Path patching 의 핵심 implementation 디테일이 "다른 head 의 활성을 freeze" 인데, 이 freeze 의 정확한 의미가 정의에 따라 다른 회로를 추출할 수 있음. 예:
- (a) 다른 head 의 출력을 clean prompt 의 캐싱된 값으로 고정.
- (b) 다른 head 가 받는 residual stream 만 clean stream 으로 고정 (head 는 자유 계산).
- (c) 다른 head 의 활성 자체를 layer-by-layer recursively clean 값으로 갈아끼움.

세 정의가 미묘하게 다른 회로를 만들 수 있음.

**만족스러운 답의 형태**:
- 코드 `utils_circuit_discovery.py` 의 `path_patching()` 의 정확한 구현 분석. 어떤 hook 이 어떤 layer 의 어떤 component 에 적용되는지.
- (a) 또는 (b) 또는 (c) 중 어느 정의가 사용되었는지 명시.
- ACDC 가 자동화 과정에서 어떤 정의를 채택했는지 비교.

본 환경에서는 코드 직접 분석 필요 (시그니처만 확인 가능).

---

## Q5. IOI 회로는 모델 architecture (12 layer × 12 head, residual + MLP) 에 얼마나 의존하나? GPT-2 medium (24 × 16) 에서도 같은 회로가 나오나?

**왜 중요한가**: 본 논문이 "scale generalization 은 별도 검증" 이라고 솔직히 말함. 만약 medium 에서 head 수가 26 이 아니라 30 또는 20 으로 바뀌면, 회로의 "head 수" 자체는 모델 의존 — 그러나 6 class 구조가 보존되면 **회로의 abstract structure** 는 universal. 이 둘이 다른 의미.

**만족스러운 답의 형태**:
- "Medium 에서도 동일 6 class 가 발견되며, 각 class 의 head 수만 layer 비례 증가" → abstract structure 의 universality.
- "Medium 에서는 class 가 6 → 7 또는 5 로 변함" → architecture-dependent.
- "Medium 에서는 일부 class (e.g., negative name mover) 가 사라짐" → small-specific phenomena.
- Anthropic Universality 또는 후속 scale-up 연구 의 답 필요.

---

## 자문 질문의 메타 정리

5 개 질문이 다루는 차원:
- **Q1**: 방법론의 sensitivity (ablation choice)
- **Q2**: 회로의 정성 의미 (semantics behind drops)
- **Q3**: 회로의 cross-task generality (polysemanticity vs reuse)
- **Q4**: 방법론의 implementation 의존성 (freeze semantics)
- **Q5**: 회로의 cross-architecture generality (scale)

이 5 차원에 대한 답이 본 논문 인용을 본격적으로 정당화하는 evidence base. APF / Grokking thesis 의 method section 에서 이 답들을 인용하며 framework 의 한계와 적용 범위를 명시.
