# 04 · 핵심 Claim 해체

## 배경 사다리
"Claim 해체" 의 단위: ① 저자 본인이 abstract/intro 에서 명시한 주장, ② 그 주장의 근거가 본문/표/그림/코드 어디에 있는지, ③ 그 주장이 성립하려면 저자가 당연시한 전제는 무엇인지, ④ 같은 결론을 고등학생도 알아들을 수 있게 다시 말하면 어떻게 되는지. 본 절에서는 4 개 Claim 으로 정리.

---

## Claim 1 — "GPT-2 small 의 IOI 작업은 26 개 attention head 의 회로로 충분히 설명된다."

**주장 (한 문장)**: 12 layer × 12 head = 144 attention head 중 **26 개** 의 head 만 활성화된 상태로 나머지를 ablate 해도, 전체 모델이 IOI 작업에서 보이는 logit difference 의 거의 전부를 회로 단독으로 재현한다.

**증거**:
- 저자 GitHub `easy_transformer/ioi_circuit_extraction.py` 의 `CIRCUIT` dict — name mover 11 + negative 2 + s2 inhibition 4 + induction 4 + duplicate token 3 + previous token 2 = **26 head** verbatim 확인.
- `completeness.py` 의 `circuit_eval(model, nodes)` 가 회로 외부를 hook 으로 ablate 한 상태에서 logit difference 를 계산하는 코드 흐름 확인.
- 본문 PDF 의 정확한 faithfulness 수치 (% 회복) 는 본 환경에서 확인 불가 → **단정 안 함**.

**숨은 전제**:
- *Ablation 방식 선택의 적정성*. mean ablation (코퍼스 전체 평균으로 대체) vs zero ablation vs resample ablation 의 선택이 결론에 영향. 저자는 **mean ablation 을 default** 로 채택한 것으로 코드와 후속 ACDC 논문에서 정황 확인 — 다른 선택이면 회로가 더 크거나 작아질 수 있다.
- *IOI 데이터셋 분포에 한정*. 저자가 정의한 15 + 15 = 30 BABA/ABBA template × NAMES × PLACES × OBJECTS 의 절차적 생성 분포 안에서만 "충분" 이다.
- *Logit difference 만 측정*. 정답 토큰 확률 자체나 entropy 변화는 별도 검증 안 함.

**쉬운 말 풀이**: "이 144 명의 일꾼 중 26 명만 일을 시키고 나머지를 모두 잠재워도, 공장의 생산량은 거의 똑같다. 그러니까 이 작업은 그 26 명만 알면 다 안 거다."

---

## Claim 2 — "그 26 head 는 6 개 (혹은 7 개) 기능 클래스 + 계층적 정보 흐름으로 분해된다."

**주장 (한 문장)**: 회로 head 들은 임의 그룹이 아니라 **명확한 기능 분담** 으로 묶이며, 깊은 layer 의 head 가 얕은 layer 의 head 출력에 의존하는 **위계적 파이프라인** 을 이룬다.

**증거**:
- `CIRCUIT` dict 의 명명 자체가 기능 분류 (name mover, negative name mover, s2 inhibition, induction, duplicate token, previous token).
- Layer 분포 verbatim 확인:
  - **previous token**: (2,2), (4,11) — 얕은 layer
  - **duplicate token**: (0,1), (0,10), (3,0) — 매우 얕은 layer
  - **induction**: (5,5), (5,8), (5,9), (6,9) — 중간 layer
  - **s2 inhibition**: (7,3), (7,9), (8,6), (8,10) — 중상 layer
  - **negative name mover**: (10,7), (11,10) — 깊은 layer
  - **name mover**: 9·10·11 layer 의 11 head — 가장 깊은 layer
- Layer index 가 클래스 별로 계층화되는 사실 자체가 "정보 흐름이 얕은 → 깊은 layer 방향" 임의 강한 정황. Path patching (다음 절) 으로 sender-receiver 의 인과 의존이 확인되어야 진정한 회로 그래프 주장.
- 본 환경에서 본문 Fig 2 (circuit diagram) 의 화살표 verbatim 확인 불가 → **계층 구조의 정확한 edge 집합은 코드와 secondary 인덱스의 합의 부분만 단정**.

**숨은 전제**:
- *기능 명명이 객관적 발견인가 사후적 명명인가*. "name mover" 라는 이름은 그 head 의 OV circuit 이 name token 을 옮긴다는 사후 관찰에서 붙은 것이라 추정. 같은 head 가 다른 작업에서는 전혀 다른 기능을 가질 수 있다 (polysemanticity 문제).
- *6 vs 7 class 표기 불일치*. 본문은 7 클래스 (Name Mover 와 Backup Name Mover 분리) 로 자주 인용되지만, 코드 CIRCUIT dict 는 6 클래스 (둘이 합쳐짐). 본 해체는 코드 기준 6 클래스로 단정하고, "Backup Name Mover" 는 Name Mover 11 head 중 비주축 8 head 의 별칭으로 본다.

**쉬운 말 풀이**: "26 명 일꾼은 6 개 부서로 나뉜다. 0~4 층에는 '중복 감지' 와 '이전 토큰 기억' 부서가 있고, 5~6 층에 '복사 (induction)' 부서, 7~8 층에 '같은 이름 차단' 부서, 9~11 층에 '이름 옮기기 + 부정 옮기기' 부서. 위층 부서가 아래층 부서의 결과를 받아 일한다."

---

## Claim 3 — "회로의 진정성은 path patching + 3-축 메트릭으로 운영적으로 검증된다."

**주장 (한 문장)**: 회로 $C$ 가 "진짜 회로" 임을 보이려면 ① **Faithfulness**: $C$ 만 켜고 보낸 logit difference 가 원 모델과 유사, ② **Completeness**: 모든 부분집합 $K \subseteq C$ 에 대해 $C\setminus K$ 의 성능 vs $M\setminus K$ 의 성능이 일치, ③ **Minimality**: $C$ 의 각 head $v$ 에 대해 $C\setminus\{v\}$ 이 큰 성능 손실 — 세 축이 모두 만족.

**증거**:
- `completeness.py` 의 `difference_eval(model, nodes) = |circuit_eval(model, nodes) - cobble_eval(model, nodes)|` verbatim 코드. `circuit_eval` 은 $K$ 가 ablate 된 회로의 성능, `cobble_eval` 은 같은 $K$ 가 ablate 된 전체 모델의 성능 — 두 값의 차이가 completeness 위반 강도.
- `minimality.py` 의 head-wise 차이 계산 (`progress from {results[head][0]} to {results[head][1]}`).
- `circuit_discovery.py` + `utils_circuit_discovery.py` 의 `path_patching()` 함수 시그니처 (sender 노드 활성을 다른 prompt 에서 가져와 receiver hook 에 주입).
- 본문의 정확한 수치 표 (faithfulness 가 몇 %, completeness 위반 head 가 몇 개) 는 본 환경 확인 불가 → 단정 안 함.

**숨은 전제**:
- *$K$ 의 무한 부분집합을 검사할 수 없다*. `completeness.py` 는 **greedy search 10 runs × 10 iterations + random search 100 subsets** 정도의 sampling 으로 근사 — 즉 "모든 K" 가 아니라 "찾을 수 있는 worst-case K" 만 본다. False negative (놓친 $K$) 가능성 상존.
- *Minimality 의 임계값*. "큰 손실" 의 정량 기준이 임의적. 어떤 head 는 빼도 logit difference 가 0.05 만 줄지만 "회로에 포함" 되어야 하는가? 임계값 의존성이 결론을 바꿀 수 있다.
- *3 축이 독립적이지 않다*. Completeness 의 한 사례 ($K = \{v\}$) 가 곧 minimality 와 같지 않은가? 두 메트릭의 분리 정당성에 대한 본문 논변이 있어야 (확인 불가).

**쉬운 말 풀이**: "26 명만 일을 시켰을 때 잘 돌아가나? (faithfulness) 거기서 또 몇 명을 빼봤을 때, 회사 전체에서 그 사람들을 뺀 것과 같은 정도로 망가지나? (completeness) 한 명만 빠져도 망가지나? (minimality) 이 세 질문에 모두 '예' 라고 답해야 진짜 그 26 명이 회로다."

---

## Claim 4 — "발견된 회로는 fragile 하다 — adversarial prompt 와 분포 변화에 깨진다."

**주장 (한 문장)**: 위 절차로 발견된 회로는 in-distribution IOI 작업에서는 충분히 검증되지만, 약간의 prompt 변형에서 무너지며 — 이는 mech interp 의 일반화 가능성에 대한 강한 caveat.

**증거**:
- 저자 코드 `advex.py` (adversarial examples) 의 존재 자체가 저자들이 fragility 를 검증했음의 정황. 본문에 해당 절이 포함되어 있을 가능성 높음 (Section 7 또는 Appendix 추정).
- 본 환경에서 정확한 adversarial 패턴·실패 빈도 수치 확인 불가 → 단정 안 함. 단, 후속 연구가 IOI 회로의 "compositional gap" (Adaptive Circuit Behavior 등 후속 논문에서) 을 인용하는 패턴으로 그 존재만 정황 확정.

**숨은 전제**:
- *Adversarial 의 정의*. semantic 적으로 IOI 라고 부를 수 있는 범위 안에서의 변형만 본 것인가, 아니면 분포 외 prompt 까지 본 것인가. 후자라면 fragility 가 자연스럽다.
- *Fragility = 회로 정의의 실패인가, 회로의 실제 속성인가*. "정말로 그 회로만 쓴다면 fragile 해야 자연스럽다" — 즉 회로 정의가 옳을수록 fragility 가 보여야 한다는 반론도 가능.

**쉬운 말 풀이**: "정해진 문장 패턴에서는 26 명이 잘 일한다. 그런데 문장을 조금만 비틀면 (예: 이름을 외국어로, 동사를 바꾸기) 그 26 명만 가지고는 답을 못 맞춘다. 이게 그 회로의 한계 — 일반화가 좁다."

---

## 4 Claim 의 관계

- Claim 1·2 = **회로의 정의** (무엇을, 어떤 단위로)
- Claim 3 = **회로 정의의 검증** (어떻게 진정성을 보일 것인가)
- Claim 4 = **회로 정의의 한계** (어디서 깨지는가)

논문의 메타 구조는 "정의 → 검증 → 한계" 의 3 막. 4 번째 Claim 의 솔직함이 본 논문이 ACDC 같은 자동화 후속 연구에 의해 **반증 가능한 출발점** 으로 받아들여진 핵심 이유다.
