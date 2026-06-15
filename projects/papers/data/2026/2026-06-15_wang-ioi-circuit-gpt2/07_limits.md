# 07 · 가정·한계·반박

## 배경 사다리
이 절은 본 논문이 **명시한 한계**, **암묵적 가정**, **실험으로 반박 가능한 지점** 을 분리. 본 환경에서 원문 Limitations 절 직접 확인 불가 → secondary 인덱스 + 코드 정황 + 후속 연구가 명시적으로 비판한 지점만 단정.

---

## 1. 명시적 가정 (논문이 대놓고 말한 것, 정황 단정)

1. **Mean ablation as default**: head 의 활성을 데이터셋 평균으로 대체하는 게 모델 분포 내에서 가장 자연스러운 baseline. (코드 정황에서 mean 이 default 로 사용됨이 확인.)
2. **Logit difference as primary metric**: 두 토큰 사이의 logit 차이가 task performance 의 충분한 proxy.
3. **Path patching as ground truth intervention**: sender → receiver edge 의 인과 강도는 path patching 으로 측정 가능.
4. **단일 모델 (GPT-2 small)**: 본 회로는 GPT-2 small (124M) 한정. scale generalization 은 본 논문의 주장 범위 밖.
5. **단일 작업 (IOI)**: 본 회로는 IOI 작업 한정. 다른 작업으로의 transfer 는 별도 검증 필요.

---

## 2. 암묵적 가정 (말 안 했지만 깔려 있는 것)

### 가정 A — "Attention head 가 회로의 적정 단위"
저자는 head 를 1-차 단위로 본다. 하지만:
- 한 head 안에서도 **여러 기능** (polysemanticity) 이 공존 가능. 같은 head 가 IOI 에서는 name mover 지만 다른 task 에서는 다른 기능.
- 더 작은 단위 (head 안의 sparse feature, SAE direction) 가 진짜 단위일 수 있음 — SFC (Marks 2024) 의 격상.
- 더 큰 단위 (multiple head 의 superposition group) 가 진짜일 수도.

이 가정이 깨지면 본 논문의 26 head 추출이 다른 단위로 재구성됨.

### 가정 B — "회로 발견 = 표준 알고리즘적 절차"
"path patching + 임계값" 으로 회로가 deterministic 하게 도출된다는 가정. 하지만:
- 임계값 선택의 임의성.
- Top-down vs bottom-up search 순서가 결과에 영향.
- 코드의 `CIRCUIT` vs `NAIVE` 두 결과 자체가 절차의 임의성을 보여줌.

### 가정 C — "회로의 의미가 prompt 분포에 독립"
회로가 한번 발견되면 그 회로의 의미 (head 의 명명) 가 변하지 않는다는 암묵 가정. 하지만:
- ABBA vs BABA 에서 같은 회로가 작동한다고 보였지만, 다른 prompt 분포 (예: 더 긴 문맥) 에서는 head 의 기능이 shift 할 가능성.
- **회로 = 분포 의존 객체** 라는 견해 (후속 mech interp 의 거론).

### 가정 D — "Discrete head 집합으로의 분해 가능"
회로가 binary membership (head 가 회로 in/out) 의 이산 집합이라는 가정. 하지만:
- 어떤 head 는 부분 기여 (logit 의 5%) — 회로 안에 넣어야 하나 빼야 하나?
- **Fractional / weighted circuit** 정의가 더 자연스러울 수 있음.

---

## 3. 반박 가능한 지점 (최소 2 개, 각 한 단락)

### 반박 1 — "Faithfulness 95% 가 회로의 'closed' 를 증명하지 않는다"
**핵심 주장**: 회로 외부에 작은 기여가 분산되어 있어도 합계는 5% 정도일 수 있다. 5% 가 "의미 없다" 의 증거가 아니라 "분산된 backup" 의 증거일 가능성.

**검증 방법**:
- 회로 외부 118 head 를 임의로 group 으로 묶어 ablation 했을 때, 어떤 group 도 IncompletenessGap 을 크게 만들지 않으면 진짜 closed. 본 환경에서 정확 검증 미확인.
- 더 강한 검증: 회로 외부의 활성을 **고정** 하고 회로 내부의 다양한 prompt 변화에 대해 LD 가 변하는지. 변하면 backup 이 외부에 있다는 정황.

### 반박 2 — "Mean ablation 의 distribution 효과"
**핵심 주장**: mean ablation 도 head 출력 분포에서 보면 outlier 다. 평균값이 zero 가 아닌 한, mean 으로 대체하는 것 자체가 "이 head 가 평균만큼 출력하는 가짜 상태" 를 만들어내며, 그 가짜 상태가 회로 외부에 spurious 효과를 줄 수 있음.

**검증 방법**:
- resample ablation (다른 prompt 의 같은 head 활성으로 swap) 으로 같은 실험 재수행 → 회로가 같은 26 head 인지.
- Zero ablation (출력 = 0) 으로 비교 — 만약 회로가 크게 다르면 ablation choice 가 결론을 흔든다는 정황.
- ACDC (Conmy 2023) 가 이 비교를 일부 수행. KL/LD/NLL 의 세 메트릭 + zero/mean/random 의 ablation 변형이 모두 일관된 결과를 주는지 본다.

### 반박 3 — "26 vs 28 head, 6 vs 7 class 의 분류 불일치 자체가 회로 정의의 임의성"
**핵심 주장**: 코드 CIRCUIT 은 26 head 6 class, 본문은 흔히 28 head 7 class 로 인용. 이 미세한 차이는 "Backup Name Mover" 의 분류 임의성 — 진짜 회로 발견이 아니라 **사후적 명명** 의 산물일 가능성.

**검증 방법**:
- ACDC 처럼 자동화된 절차로 동일 데이터에서 회로를 추출했을 때 head 수가 26 인가 28 인가 비교.
- 다른 random seed (GPT-2 small 재학습) 의 모델에서 회로가 같은 head 수를 가지는지 — universality 검증.
- Mixed-precision 의 차이에 따라 head 수가 변하는지 — implementation sensitivity.

### 반박 4 — "IOI 의 정답 규칙이 task-specific 이라 일반화 미보장"
**핵심 주장**: "두 번 등장한 이름 vs 한 번 등장한 이름 중 후자 출력" 은 IOI 만의 특수 규칙. 자연어 의미론 (semantic role) 이 아니라 surface-level pattern matching.

**검증 방법**:
- IOI 의 의미를 살짝 비튼 변형 (e.g., 의미상 IO 가 두 번 등장하는 prompt) 에서 모델이 어떻게 동작하나. 회로가 의미가 아닌 surface count 만 보고 있다면 의미 변형에서도 같은 답.
- 영어가 아닌 다른 언어의 IOI 에서 같은 회로가 발견되나.

---

## 4. 재현성 평가

### 4.1 코드·데이터 공개
- **코드**: `redwoodresearch/Easy-Transformer` (저자 공식, 후일 TransformerLens 로 권장 이전).
  - `experiments.py`, `completeness.py`, `minimality.py`, `advex.py` 4 종 reproduction notebook.
  - `easy_transformer/ioi_dataset.py`, `ioi_circuit_extraction.py`, `ioi_utils.py` 의 데이터·회로 코어.
- **데이터**: 절차적 생성이라 외부 데이터 파일 없음 — 재현 시 항상 같은 분포 생성 가능 (seed 고정 시).

### 4.2 논문에 안 나온 디테일
- Path patching 의 정확한 freeze 정의 (코드를 봐야 함).
- Greedy/random search 의 정확한 hyperparam (코드 default).
- Head 분류의 정확한 OV-circuit 분석 절차 — appendix 의존.

### 4.3 평균만 vs 분산도 보고됐는지
본 환경에서 본문 표 미확인. 정황 (mech interp 분야 standard) 으로 분산이나 confidence interval 보고는 fragmentary 한 경우가 많음. 후속 연구가 multiple seed 의 회로 안정성을 평가하는 빈도가 낮음 — **재현성의 grey zone**.

### 4.4 후속 검증의 상태
- ACDC (2023) 의 자동 발견과 본 회로의 high agreement 정황.
- Sparse Feature Circuits (Marks 2024) 가 SAE feature 단위로 격상한 후에도 본 회로의 head 결과와 consistent.
- 즉 회로의 **존재** 는 후속 연구로 robust 하게 검증됨. 단 **head 수의 정확한 boundary** 는 여전히 grey zone.

---

## 5. 핵심 한 문장 요약

> **"가장 강한 가정 = (A) head 가 회로의 적정 단위, (B) 발견 절차가 표준 알고리즘. 가장 강한 반박 = ablation 방식 선택 + 임계값 임의성 + 26 vs 28 head 표기 불일치. 재현성은 코드 공개로 robust 하나, head 수의 정확한 경계는 분야 합의 미완."**
