# 6. 가정·한계·반박

## 명시된 가정 (논문이 대놓고 말한 것 — cross-source 기준)

### 가정 1. 회로가 "head/MLP 단위" 의 부분그래프로 충분히 잘 표현된다

원문 abstract 와 후속 인용에서 일관되게 깔린 전제. 이건 mech interp 의 표준 input-layout 으로 굳어졌지만, *원자적 입도* 의 가정 자체는 회로마다 다를 수 있음. 예: Q/K/V 분리 vs head 통째 — Anthropic 의 mathematical framework 는 Q/K/V 를 분리해야 한다고 본다.

### 가정 2. 단일 metric 으로 회로의 "행동" 을 정의할 수 있다

위 (4) 메트릭 절의 KL/LD/NLL/task-metric 중 하나로 task 가 *충분히* 환원된다는 가정. multimodal 행동 (예: 동시에 두 가지 행동을 한 task) 은 single metric 으로 분리 불가.

### 가정 3. corrupted distribution 의 *quality* 가 회로 발견의 quality 를 결정한다

ACDC 는 corrupted prompt 의 *typically structured but task-irrelevant* 한 성질에 결정적으로 의존. 저자도 이를 명시했을 가능성이 높음 (원문 본문 미열람으로 정확한 인용 미확정).

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

### 암묵 가정 1. Greedy 순회의 *순서 불변성*

알고리즘은 노드를 역위상정렬로 순회하되, *같은 layer 내 노드들의 순서* 와 *한 노드의 부모 edges 의 순서* 가 결과에 영향을 안 줄 것이라는 가정. 실제로는 영향이 있다 — $m_{\text{old}}$ 가 누적 갱신되므로 같은 edge 의 평가 결과가 *그 시점 회로 상태* 에 의존. 코드의 `cache_keys.reverse()` 가 결정적 순서를 줘서 *재현성* 은 있지만 *순서 불변성* 은 보장 안 됨.

### 암묵 가정 2. cooperative edge pair 의 *희소성*

"두 edge 가 함께만 의미 있는" 회로 구조가 드물다는 가정. 실제로는 IOI 의 *backup name mover heads* 처럼 보상 회로가 흔하다. 하나를 끄면 metric 변화가 없으니 ACDC 가 prune, 그러나 둘 다 prune 하면 backup 이 없어 큰 성능 손실. greedy 의 본질적 약점.

### 암묵 가정 3. ROC AUC 가 *해석 가능 회로* 의 적절한 척도

ACDC 의 회로가 *손작업 회로와 일치* 하면 좋은 평가. 하지만 두 다른 회로가 모두 *같은 metric 손실* 을 만들 수 있다 — degenerate solution. 회로의 *해석 가능성* 은 인간 평가가 필요한데 ROC AUC 는 *과거 손작업과의 일치율* 만 본다.

### 암묵 가정 4. ablation 의 단위가 *전체 텐서*

한 edge 가 token-position 별로 ablate 되지 않고 전체 텐서로 ablate. *token-position 단위 회로* (예: IOI 의 *S2 위치의 K* 가 중요) 의 해상도를 잃음.

## 반박 가능한 지점

### 반박 1. "ACDC 는 자동화가 아니다 — 그것은 *task 정의의 자동화* 다"

ACDC 가 자동화한 것은 *edge prune* 만이다. (M1) 행동 정의·데이터·메트릭 선택, (M2) 그래프 입도 선택, ablation 분포 선택 — 모두 사람이 해야 함. 새 task 에 ACDC 를 적용하려면 여전히 박사과정 학생 한 명의 *주* 가 필요하다. *진정한 회로 발견* (모르는 행동 자동 발견) 과는 격차가 크다.

**어떻게 검증**: 알려지지 않은 task — 예를 들어 "GPT-2 가 unusual capitalization 에 어떻게 반응하는가" — 에 ACDC 를 *0 사전지식* 으로 적용해 본다. corrupted dataset 설계 부터 사람의 손 — 자동화 부재.

### 반박 2. "Greedy edge prune 은 cooperative effect 에 *체계적* 으로 취약하다"

backup mechanism 이 흔한 큰 모델 (GPT-2 medium 이상) 에서 ACDC 의 회로는 *실제 인과 회로 보다 작은 false-minimal* 회로를 줄 가능성이 높다. 평균 ROC AUC 가 SP 보다 낮은 이유의 일부일 수 있음.

**어떻게 검증**: 실험: ACDC 가 prune 한 edge 들의 *집합* 을 한꺼번에 prune 하고 metric 측정. 한꺼번에 prune 시 큰 loss 가 나면 cooperative effect 의 증거. IOI 의 backup name mover 사례에서는 이게 일어남.

### 반박 3. "$\tau$ 의 단일성은 표면적 — 실효 hyperparameter 는 3+ 차원"

(metric, ablation, τ) 의 *grid* 위에서 보고하면 SP 와의 평균 AUC 차이 (0.596 vs 0.692) 가 좁혀질 가능성. ACDC 우호자는 *task 별 best* 로 보고하면 더 좋게 나옴을 보일 수 있고, 반대자는 *fixed grid* 가 fair 라고 주장. 두 쪽 다 옷다.

**어떻게 검증**: 6 task × {KL, LD, NLL} × {zero, random} × τ scan 의 full grid 결과를 publish. 어떤 *셀* 에서 평균 AUC 가 가장 높은가? 그 셀이 *사전 선택 가능* 한가?

### 반박 4. "tracr 의 AUC 1.000 은 *모듈성이 강제된 모델* 에서의 특수 결과"

RASP 컴파일은 회로 모듈성이 *극단적으로 보장* 됨. 자연 학습된 모델은 *polysemantic* head + *distributed* representation — RASP 의 1.000 은 *상한* 일 뿐 *일반화* 보장 아님.

**어떻게 검증**: *학습된* toy transformer (예: Nanda 2023 의 modular arithmetic) 에서 ACDC 의 AUC 측정. 1.000 보다 한참 낮을 것이라는 예측. cross-source 에서는 induction (학습된 모델) 에서 AUC 가 낮다고 보고됨.

## 재현성 평가

### 코드·데이터 공개

- 코드: GitHub `ArthurConmy/Automatic-Circuit-Discovery` (Apache 2.0?). Poetry, Python 3.8+, TransformerLens 의존. **공개 충분**.
- 데이터: 6 task 의 prompt template + corrupted dataset 모두 코드 내 procedural generation.
- 모델: GPT-2 small (Hugging Face), Redwood 2-layer, tracr 컴파일. 모두 공개.

### 논문에 안 나온 디테일 (코드에서만 확인)

- `--threshold` 의 *task 별 best 값* 이 어디 표에 있는지: 원문 본문 미열람으로 미확정. 코드 데모 기본값 0.71 만 확인 가능.
- 같은 task 에서 *seed 변동성* — random ablation 의 corrupted prompt sampling 의 분산. cross-source 에서는 보고된 분산 미확인.

### 평균 vs 분산

cross-source 표에서 평균 AUC 만 보고. *분산* (multiple seed) 는 미보고 또는 미확인. ROC 곡선 자체는 시각화되었으리라 추정 (원문 figure 4 또는 5 즕음 — 원문 본문 미열람).

## 자기 비판 (저자가 직접 했을 가능성)

후속 비교 논문 (EAP, Hypothesis Testing) 의 인용 패턴 보면 저자가 명시한 것 같은 한계:
- **계산 비용**: 큰 모델에서 비현실적. attribution patching 추천.
- **메트릭 의존성**: KL 의 한계 명시.
- **ground-truth 의존**: tracr 외 task 의 평가는 *과거 손작업 vs ACDC* 의 일치율이라는 한계.

정확한 자기 비판 단락은 원문 본문 미열람으로 미확정.

## 가장 큰 한계 한 줄

> ACDC 는 *회로 발견* 의 알고리즘이 아니라 *회로 검증* 의 알고리즘이다. *de novo discovery* (모르는 회로 자동 발견) 의 한 걸음으로 박힌 가치는 *알고리즘 자체* 보다 *분야의 비교 인터페이스 정립* 에 있다.
