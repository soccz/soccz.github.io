# 4. 방법론 해부 (c) — 부패(corruption)·ablation 분포

> **🧒 한 줄 요약**: Resampling ablation 의 *clean vs corrupt run* design.


## 배경 사다리

이 파일은 *어떤 값으로 edge 를 끄는가* 의 선택을 다룬다. 이걸 이해하려면 ① "ablation" 이 *어떤 활성을 *대체값* 으로 바꿔치기* 하는 개입이라는 점, ② 대체값으로 0, 평균, 또는 다른 prompt 의 같은 위치 활성을 쓸 수 있다는 점, ③ 대체값 선택이 *결과의 의미* 를 바꾼다는 점, 이 셋만 알면 된다.

## 왜 ablation 분포가 핵심인가

ACDC 의 결정 룰은 "edge 를 끄면 metric 이 얼마나 변하는가" 다. *얼마나* 변하느냐는 *무엇으로 바꿔치웠는가* 에 따라 다르다. 두 극단:

- **Zero ablation**: edge 의 src 출력을 0 벡터로 대체. 가장 단순하지만, *모델이 한 번도 본 적 없는* 입력 분포로 들어간다. residual stream 이 0 에 가까운 상황은 *out-of-distribution* — 모델의 반응이 사람 직관과 다를 수 있음.
- **Mean ablation**: 전체 corpus 의 평균 활성으로 대체. zero 보다는 자연스럽지만 "*평균 모델* 의 행동" 으로 회로 중요도를 평가하므로 task-specific 한 정보가 누락.
- **Random / Resampling ablation**: 같은 task 의 *다른 prompt* (corrupted prompt) 의 같은 위치 활성으로 대체. 가장 sound — 모델은 여전히 *유사한 분포* 의 입력 안에 있고, 다만 *task-relevant 한 정보만 다른* 값으로 바뀐다.

ACDC 의 기본은 **random / corrupted ablation**. 다만 zero 옵션도 코드상 (`zero_ablation=True`) 지원.

## 수식: corrupted ablation

$$\widetilde{x}_v = x_v - \sum_{(u,v) \in E_{\text{off}}} \big(o_u^{\text{clean}} - o_u^{\text{corr}}\big)$$

- **기호 뜻**: $x_v$ = node $v$ 의 *clean* residual stream 입력 (모든 src 출력의 합). $E_{\text{off}}$ = 현재 ablation 으로 *꺼진* (corrupted 값으로 대체된) edge 들의 집합. $o_u^{\text{clean}}$ = clean prompt 에서 node $u$ 의 출력. $o_u^{\text{corr}}$ = corrupted prompt 에서 node $u$ 의 출력. $\widetilde{x}_v$ = ablation 후 node $v$ 의 입력.
- **일상 비유**: 회의실에서 좌석 A → 좌석 B 의 마이크 라인을 끄고, 대신 *다른 회의* (corrupted) 의 같은 좌석 A 가 한 말을 송출. 좌석 B 의 헤드폰에는 이 회의의 다른 발언 + 다른 회의의 A 발언이 섞임.
- **왜 이 형태**: residual stream 의 linearity 덕분에 *전체 입력에서 한 edge 의 기여만 빼고 corrupted 의 기여를 더하는* 것이 가능. 즉 *edge 단위* 개입을 다른 edge 에 영향 없이 깨끗이 수행. CNN/RNN 의 nonlinear 합성에선 불가능.
- **조심할 점**: clean 과 corrupted 의 token 수가 같아야 한다. 또 corrupted 가 *task-relevant 한 정보만 다른* 양질의 데이터셋이어야 한다. random token 으로 채우면 모델이 *방향감을 잃은* 답을 내놓아 metric 변화가 무의미.

## clean / corrupted 의 task 별 짝짓기 (저자 GitHub 코드 기준)

| Task | clean 예시 | corrupted 예시 |
|---|---|---|
| IOI | "Mary and John ... John gave Mary" | "Tom and Lisa ... Tom gave Lisa" — 세 이름이 *동시에 다른 이름* 으로 바뀜 (`abc_dataset`) |
| Greater-Than | "The war lasted from 1740 to 17 __" | year prefix 가 *낮은 century* (예: 1140) 로 바뀐 prompt |
| Docstring | function + docstring 의 3 matching args | argument 순서가 *섞인* docstring |
| tracr-reverse | sequence `[BOS, 1, 2, 3]` | 다른 random sequence |
| tracr-xproportion | `[w, x, y, x]` 의 fraction-of-x | x 토큰 위치만 바뀐 sequence |
| Induction | repeated bigram `[a b ... a b]` 의 두 번째 b 예측 | 두 번째 b 의 prefix 가 깨진 sequence |

## zero ablation vs random ablation: 결과의 차이

저자가 두 ablation 을 모두 실험한 이유 — 어떤 선택을 했느냐에 따라 ROC 가 바뀐다. 알려진 패턴 (cross-source):

- **tracr 류** (컴파일된 RASP transformer): zero ablation 이 더 클린한 결과. RASP 회로는 *모듈성이 극단적으로 보장* 되므로 zero 가 OOD 가 아님. AUC 1.000.
- **자연 데이터 task** (IOI / Greater-Than / Docstring): random ablation 이 더 sound. zero 는 모델을 OOD 로 보내 spurious metric drop 을 만듦.
- **Induction**: 중간. 2-layer attention-only 모델이라 mean / random 차이가 크지 않음.

이 비대칭 자체가 *ablation 선택의 자유도* 를 별도 hyperparameter 로 만든다. 단일 τ 라는 표면적 단순함 뒤에는 "어느 ablation 으로 평가했느냐" 가 보고된 ROC AUC 의 0.05–0.30 차이를 만들 수 있다. ACDC 의 *실효 hyperparameter 수* 는 약 2 (τ + ablation 종류).

## 다른 접근으로 했다면

### 대안 1: counterfactual ablation

대체값을 *동일 task 의 정답이 뒤집힌* prompt 활성으로. 더 sharp 한 신호. 단점: counterfactual prompt 의 확보 자체가 task-specific.

### 대안 2: noise injection

대체값으로 *가우시안 노이즈* 더하기. 모델이 *얼마나 robust 한가* 를 같이 측정. ACDC 의 deterministic 평가와 결합되면 ROC 가 noisy 해짐.

### 대안 3: integrated gradients (path attribution)

ablation 없이 *0 활성 → clean 활성* 의 경로 integral 로 edge 기여 추정. attribution patching 의 한 형태. 후속 작업이 이 방향으로 ACDC 를 추월.

## 핵심 한 문장

> ACDC 의 정확도는 "edge 를 끈다" 의 의미를 *어떤 활성으로 대체했느냐* 가 결정하며, 자연 데이터 task 에선 *task-domain 안의 corrupted prompt* 가 zero 보다 sound 한 baseline 이다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **Resampling vs random?**
2. **Clean / Corrupt design?**
3. **In-distribution preservation?**

### 답변

1. paper §-references + 본 deep dive 의 cross-reference 기반.

2. ACDC (Conmy 2023) 의 핵심 mechanism (edge-by-edge ablation + KL metric) 의 통합 관점.

3. APF / Grokking 트랙의 baseline — manuscript §1-§6 + Appendix.
