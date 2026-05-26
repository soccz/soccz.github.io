# 09. 내 연구와의 연결

> **🧒 한 줄 요약**: 내 연구 (APF) 와 연결: TimesNet 의 *FFT period* + *2D reshape* 의 motif-level 적용.


> 이 섹션은 `_profile.md`의 두 active track — **APF (Attention Pattern Fields)**와 **Grokking in TS Transformers** — 에 TimesNet을 어떻게 연결할지를 구체적으로 다룬다. 일반론 금지. 수식/실험/인용 위치까지 구체화.

---

## APF 트랙과의 연결

### 핵심 교차점: "2D 공간에서의 패턴 학습"

APF 프레임워크는 "PE → 2D 어텐션 모티프 → CNN 프로브 → 인과 개입"이다. 어텐션 맵($L \times L$ 행렬)이 2D 공간에 펼쳐지고, CNN 프로브가 그 2D 패턴(대각선/스트라이프/블록/엣지/스파이크/체커)을 분류한다.

TimesNet의 핵심은 1D 시계열 → $\lceil L/p \rceil \times p$ 2D 텐서 변환 후 Inception Block (2D CNN)으로 처리다. **두 논문 모두 "의미 있는 2D 구조를 CNN으로 포착한다"는 동일한 가정 위에 서 있다.**

이 유사성에서 구체적 연결이 나온다:

**연결 1: CNN 프로브 설계에 대한 실증적 참조**

APF에서 CNN 프로브는 어텐션 맵을 분류한다. 어느 커널 크기가 어텐션 모티프를 가장 잘 포착하는지가 미결 질문이다. TimesNet의 Inception Block — $1\times1$, $3\times3$, $5\times5$ 병렬 커널 — 이 바로 멀티스케일 2D 패턴을 포착하는 실증적 선례다.

구체적 적용: APF의 CNN 프로브 구조를 단일 고정 커널 대신 Inception Block 형태로 바꾸면, "어텐션 모티프의 스케일 다양성"에 더 강건한 분류기를 얻을 수 있다. APF §3(CNN 프로브 설계) 개정 시 "우리의 멀티스케일 CNN 프로브는 TimesNet [Wu et al., ICLR 2023]의 Inception Block에서 영감을 받아, 어텐션 패턴의 서로 다른 공간 스케일을 동시에 포착한다"는 문장으로 인용 가능.

**연결 2: 2D 변환의 물리적 해석 가능성 vs 어텐션 맵의 해석 가능성**

TimesNet의 2D 변환은 물리적으로 해석 가능하다 — row는 주기 번호, column은 주기 내 위치. CNN이 학습하는 것이 "어떤 row-column 패턴"인지 직관적으로 볼 수 있다.

반면 APF의 CNN 프로브는 어텐션 맵($L \times L$)을 분류하는데, 어텐션 맵의 row/column 해석이 모티프 종류마다 다르다 (대각선 모티프: row $i$ - column $j$가 인접한 토큰 쌍; 블록 모티프: 구조적 클러스터). **TimesNet이 "물리적 의미 있는 2D 변환 + CNN"이 작동함을 보여주므로, APF의 "어텐션 맵 + CNN 프로브"에도 2D 변환의 물리적 의미 부여가 가능한지를 확인하는 것이 후속 실험 아이디어로 연결된다.**

APF 논문 §4(해석 분석) 또는 Appendix에 "어텐션 맵의 2D 구조와 TimesNet식 주기적 2D 구조의 비교"를 쓸 수 있다 — "어텐션 모티프가 단순한 패턴 분류 라벨이 아니라, 입력 TS의 주기 구조와 어떻게 연결되는가?"라는 open question으로.

---

## Grokking 트랙과의 연결

### 핵심 교차점: "FFT가 Grokking으로 학습되는가?"

Grokking 트랙의 핵심 질문: "TS Transformer가 훈련 중 주기성을 *grok*하는가?" — 즉 초기에는 단순 암기를 하다가 어느 순간 주기 기반 일반화를 학습하는가?

TimesNet은 이 질문의 **null hypothesis 참조점**이다:

TimesNet은 FFT를 통해 주기를 *명시적으로 계산*하고 hardcode한다. FFT_for_Period는 학습되지 않는다 — `top_list.detach().cpu().numpy()`로 gradient를 차단한다. 즉 TimesNet은 "주기 탐지를 grokking할 필요가 없는 시스템"이다.

반면 순수 TS Transformer (PatchTST, iTransformer)는 주기 탐지 없이 데이터에서 패턴을 학습한다. Grokking 가설은: "이 Transformer들은 충분한 데이터와 훈련 단계 후, 내부 circuit이 FFT_for_Period와 유사한 연산을 구현하게 된다 — 이것이 grokking 단계에서 일어나는 일이다."

**구체적 사용처 1: Baseline 및 Circuit Comparison**

Grokking 논문 §3(방법론)에서: "우리는 학습된 circuit이 *어떤 것*으로 수렴하는지를 묻는다. 우리의 가설은 TimesNet [Wu et al., ICLR 2023]의 FFT_for_Period — 즉 주파수 진폭 top-k 탐지 + 주기 기반 표현 — 가 TS Transformer circuit의 수렴 목표(attractor)라는 것이다."

이를 검증하는 실험: (a) 충분히 훈련된 TS Transformer에서 activation patching으로 주기 정보를 담은 circuit을 분리. (b) 그 circuit의 출력이 FFT_for_Period의 출력(top-k 주기 인덱스)과 얼마나 상관관계를 가지는지 측정. (c) Grokking 전후에 이 상관관계가 급격히 증가하면 가설 지지.

**구체적 사용처 2: Grokking 가속의 귀납 편향**

TimesNet의 결과가 Grokking 연구에 주는 또 다른 함의: "FFT 주기 구조를 inductive bias로 사전 주입하면 grokking이 발생하지 않거나 훨씬 빨라진다." 이를 ablation으로 설계할 수 있다:

- **조건 A**: 순수 TS Transformer (inductive bias 없음) → grokking 관찰
- **조건 B**: FFT period를 positional encoding에 추가 (soft inductive bias) → grokking 속도 변화 관찰  
- **조건 C**: TimesNet처럼 FFT period를 hardcode (hard inductive bias) → grokking 없음, 바로 일반화

이 설계는 Grokking §4(실험)의 "inductive bias × grokking 상호작용" 절로 바로 들어간다. TimesNet을 조건 C의 구현체로 사용하면 기존 코드베이스 재활용도 가능하다.

---

## P1 ProTran-TFA와의 연결 (Paused track)

P1 ProTran-TFA는 확률적 TS Transformer의 금융 적용 확장이다. TimesNet의 관련성:

TimesNet의 k-주기 가중합 구조 — $\hat{\mathbf{x}} = \sum_{i=1}^k w_i \hat{\mathbf{x}}^{(i)}$ — 는 *모델 앙상블*처럼 읽힌다. 각 주기 $p_i$에 대한 예측 $\hat{\mathbf{x}}^{(i)}$를 독립적인 "주기 전문가"로 보면, 가중치 $w_i = \text{softmax}(A_{b,f_i})$가 epistemic uncertainty를 암묵적으로 인코딩한다고 해석할 수 있다 — FFT 진폭이 작은(불확실한) 주기에 낮은 가중치를 부여하므로.

P1에서 TimesNet 인용 가능 위치: "우리의 확률적 앙상블 접근은 TimesNet [Wu et al., ICLR 2023]의 주기별 분기 처리(per-period branching)에서 영감을 받았다. 단, TimesNet의 가중치는 FFT 진폭으로 고정되는 반면, 우리는 이를 학습 가능한 확률 분포 매개변수로 대체한다."

---

## 충돌/경쟁 지점

### APF와의 충돌: "CNN이 2D TS 패턴을 학습할 수 있는가"라는 가정의 공유

APF와 TimesNet은 모두 "2D 공간에서의 패턴을 CNN이 포착한다"는 가정을 공유한다. 이 가정이 어텐션 맵(APF)에서 성립한다면 TimesNet의 2D TS 텐서에서도 성립해야 하고, 반대도 마찬가지다.

문제는 두 도메인에서 2D 구조의 *통계적 성질*이 다르다는 점이다. 어텐션 맵은 확률분포(각 행이 softmax 출력)이므로 항상 0~1 범위의 구조적으로 smooth한 2D 패턴을 가진다. 반면 TimesNet의 2D TS 텐서는 원시 시계열 값을 reshape한 것으로, 값 범위나 스케일이 다양하고 패턴이 훨씬 이질적이다. CNN이 두 도메인에서 모두 잘 작동한다는 주장을 이 통계적 차이에도 불구하고 유지하려면, 각 도메인별로 별도의 실증 검증이 필요하다.

APF 논문에서 이 점을 명시할 필요가 있다: "어텐션 맵의 2D CNN 프로브가 효과적임을 보이지만, 이것이 임의의 2D 표현에서 CNN이 효과적임을 의미하지 않는다. TimesNet [Wu et al., ICLR 2023]이 보인 TS 2D 텐서에서의 CNN 효과는 데이터 도메인별 별도 검증의 중요성을 시사한다."

### Grokking과의 충돌: TimesNet이 "정답"을 가르쳐주면 grokking 연구가 trivial해지는가

TimesNet을 Grokking 실험의 조건으로 넣으면 (FFT hardcode = grokking 없음), 이것이 Grokking 논문의 가치를 축소하는 것처럼 보일 수 있다 — "그냥 FFT 쓰면 되지, 왜 grokking을 연구하는가?"

이 충돌은 *연구 질문*의 차이로 해결된다. TimesNet은 "어떻게 좋은 성능을 내는가"를 목표로 한다. Grokking 연구는 "Transformer가 학습 중 어떤 내부 메커니즘을 형성하는가"를 목표로 한다. TimesNet이 FFT를 hardcode하면 좋은 성능이 나오는 것은 맞지만, 그것이 Transformer가 *왜* 주기적 데이터에서 grokking하는지를 설명하지 않는다. 두 논문은 목표 자체가 다르다.

Grokking 논문 §1(introduction)에서 이 구분을 명확히 써야 한다: "TimesNet [Wu et al., ICLR 2023]은 주기 탐지를 hardcode해 성능을 달성하지만, 이것은 학습 기반 방법의 메커니즘을 블랙박스로 남긴다. 우리는 이 블랙박스 안에서 무엇이 일어나는지를 묻는다."

---

## 반면교사: 이 논문이 못한 것을 내가 다룰 부분

| TimesNet의 한계 | 내 연구에서 다루는 방식 |
|----------------|----------------------|
| 공통 주기 가정 (채널 평균 FFT) | APF: 채널별로 다른 어텐션 모티프를 개별 분류하므로, 채널 이질성을 자연스럽게 다룸 |
| FFT가 hardcode — 학습 안 됨 | Grokking: 학습을 통해 주기가 내재화되는 과정 자체를 연구 대상으로 삼음 |
| 비정상 시계열 취약 | Grokking track의 non-stationarity × grokking 교차점이 바로 이 갭을 목표로 함 |
| 2D CNN의 비대칭성 미처리 (row≠col 의미) | APF: 어텐션 맵의 row/col 비대칭 의미(Query vs Key 방향)를 명시적으로 모티프 정의에 반영 |

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **APF motif + TimesNet period 의 *cross-pollination*?**
2. ***FFT-based motif detection* 가능성?**
3. **내 연구의 direct adoption 요소?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).
