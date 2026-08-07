# 8. 내 연구와의 연결

> **작성 규칙 (§9 봉인 준수)**: 아래에서 내 프로젝트에 대해 단정하는 사실은 **`_profile.md` / `_index.md` 에 문자 그대로 적힌 것만**이다. 두 파일에 없는 아키텍처·수식·절 번호·인물은 "프로필 기준 미상"으로 표기했고 창작하지 않았다. 원격 실행 환경은 로컬 원고 실물을 읽지 않는다.

> **배경 사다리**: ① 내 두 active track 은 **APF**(`Attention Pattern Fields/`)와 **Grokking in TS Transformers**(`Grokking in Time Series Transformers/`)다. ② 이 논문은 `_profile.md` §A(Grokking/Delayed Generalization), §B(Mechanistic Interpretability), §F(Continual learning — primacy bias, Lyle 2025)에 걸친다. ③ 연결 강도를 축별로 솔직히 표기했다.

---

## 8.1 연결 강도 지도 (먼저 정직하게)

| 내 자산 | 연결 축 | 강도 | 이유 |
|---|---|---|---|
| **Grokking in TS Transformers** (🟢 active) | §A + §F | **강함 (직접)** | 프로필 명시 4-way 교차점 중 **non-stationarity** 축과 **training dynamics** 를 정면으로 다룸 |
| **APF** (🟢 active) | §B | **중간 (방법 전이)** | 이 논문의 "개입 단위 = 뉴런" 가정이 트랜스포머에서 깨지는 지점이 곧 APF 의 존재 이유 |
| **P1 ProTran-TFA** (⏸️ paused) | §E | **약함 (전이 가능성만)** | 금융 시계열의 비정상성이라는 주제적 인접성뿐, 이 논문의 mechanism 직접 적용 지점 없음 |
| **P2 Autonomous Research Loop** (⏸️ paused) | — | **약함** | 프로필 기준 "daemon 죽음, 403 hypothesis × 12k+ CSV" 외 세부 미상 |
| Shelved 자산 (EOA·F6/MCLT·RegFiLM·AETHER 등) | — | **연결 없음** | 억지 매칭하지 않음 |

**"Paper 1~3 drafts (multiplicative conditioning, representation utility, TTPA)"** 중 *representation utility* 라는 어구가 이 논문의 식 (1) 기여 효용(contribution utility)과 명칭상 공명하지만, **그 draft 의 실제 내용은 프로필 기준 미상**이므로 연결을 주장하지 않는다. 로컬에서 확인할 가치는 있다.

---

## 8.2 흡수할 기법 — Grokking track (강한 연결)

프로필이 명시하는 Grokking track 의 정의는 **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection (0 papers found)** 이다. 이 논문은 그 네 축 중 **non-stationarity** 와 **training dynamics** 를 정면으로 다루면서 TS forecasting 과 circuit analysis 는 비운다. 즉 **내 교차점의 인접 셀을 채운 논문**이고, 그래서 흡수할 것이 구체적이다.

### 흡수 1 — 세 진단 지표를 Grokking track 의 **표준 계측 세트**로 채택

이 논문의 세 지표는 그대로 이식 가능하고, 비용이 사실상 0 이다.

- **죽은 유닛 비율** (정의 verbatim: ReLU 망에서 *"the output of the activations is zero for all examples of the task"*)
- **평균 가중치 크기** (Fig. 4d 가 RL 에서 재확인한 축)
- **유효 랭크, 식 (2)**: $\text{erank}(\Phi)=\exp\{H(p_1,\dots,p_q)\}$, $p_k=\sigma_k/\|\sigma\|_1$. 보조로 stable rank $\min\{k:\sum_i^k\sigma_i/\sum_j^q\sigma_j>0.99\}$.

**어디에 붙이나**: 프로필이 "Status: Day 1-5, Week 1 setup, **P2 logistic 4-layer 실험 background 진행 중**" 이라고 적은 그 실행이다. 이미 돌고 있는 run 의 체크포인트에서 세 지표를 사후 계산하면 **추가 학습 비용 0** 으로 새 축의 데이터가 나온다. logistic map 은 프로필의 Grokking 데이터 목록에도 명시돼 있고, Tier 1 priority 항목 *"Grokking Applied to Chaotic Iterates of the Logistic Map"* 과 직접 비교 대상이다.

**왜 이게 값진가**: grokking 문헌은 전통적으로 훈련/테스트 손실 곡선과 가중치 노름을 본다. 여기에 **유효 랭크**를 더하면 "일반화가 오는 순간 표현의 실질 차원이 어떻게 움직이는가"라는 질문이 열린다. 내 track 의 네 번째 축(circuit analysis)과 자연스럽게 이어지는 관측량이다.

### 흡수 2 — 가중치 노름을 **두 현상의 공통 질서 변수(order parameter)** 로 정식화

이게 이 논문에서 내 track 이 가져갈 **가장 큰 개념적 자산**이다.

- 이 논문: 가중치 크기 **증가** ↔ 가소성 상실 (*"associated with an increase in the average magnitude of the weights"*, Fig. 4d).
- Grokking 문헌: 내가 이미 커버한 **Omnigrok** (Liu·Michaud·Tegmark, arXiv:2210.01117, `_index.md` 2026-06-12 ✓)이 가중치 노름을 grokking 의 핵심 변수로 놓는다.

**같은 변수가 한쪽에서는 "늦게 좋아짐"을, 다른 쪽에서는 "천천히 나빠짐"을 지배한다면**, 두 현상은 하나의 축 위 서로 다른 구간일 가능성이 있다. 내 track 의 서사를 이렇게 세울 수 있다:

> "시계열 트랜스포머의 학습 동학에는 가중치 노름이 지배하는 하나의 축이 있고, 정상(stationary) 데이터에서는 그 축 위에서 grokking(지연된 일반화)이 나타나며, 비정상(non-stationary) 데이터에서는 같은 축 위에서 가소성 상실이 나타난다."

이건 프로필이 "0 papers found"라고 적은 4-way 교차점에 **하나의 통합 가설**을 주는 프레이밍이고, NeurIPS 급 서사에 필요한 종류의 주장이다.

**연결 다리는 이미 내 인덱스 안에 있다**: `_index.md` 2026-05-01 커버 항목 Lyle·Sokar·Pascanu·György, *"What Can Grokking Teach Us About Learning Under Nonstationarity?"* (arXiv:2507.20057). 오늘 논문과 그 논문은 **한 쌍으로 인용해야** 한다 — Lyle 이 다리를 놓았고, Dohare 가 반대편 기둥이다.

### 흡수 3 — 실험 프로토콜: "지평을 늘려야 보인다"

이 논문의 진짜 방법론적 교훈은 알고리즘이 아니라 **측정 설계**다. Discussion verbatim: *"Plasticity loss is often severe when learning continues for many tasks, but may not occur at all for small numbers of tasks."*

내 데이터 자산 중 **regime-switching synthetic** (프로필 명시)이 이 프로토콜에 정확히 맞는다. regime 전환을 수십 번이 아니라 **수백~수천 번** 반복하는 긴 지평 설정으로 재구성하면, "TS 트랜스포머에서 가소성 상실이 일어나는가"라는 질문에 처음으로 답할 수 있다. ETT-mini / Weather-mini / Traffic-mini 는 지평이 짧아 이 목적엔 부적합하고, 합성 데이터라야 지평을 무한히 늘릴 수 있다 — 이 논문이 Continual ImageNet 으로 50만 과제를 확보한 것과 같은 논리다.

---

## 8.3 흡수할 기법 — APF track (중간 연결, 방법 전이)

프로필이 명시하는 APF 프레임은 **"PE → 2D attention motif → CNN probe → causal intervention"** 이고, PE 축은 NoPE/sinusoidal/learned/RoPE/ALiBi, motif 축은 diagonal/stripe/block/edge/spike/checker 다.

### 전이 1 — 유효 랭크를 **motif 다양성의 정량 지표**로

APF 의 motif taxonomy 는 현재 **범주형**(6종)이다. 식 (2)의 유효 랭크는 어텐션 패턴 행렬 $\Phi$ 에 그대로 적용 가능한 **연속형 다양성 지표**를 준다. 구체적으로: PE 5종 각각에 대해 학습 진행에 따른 어텐션 패턴의 $\text{erank}$ 궤적을 그리면, "어떤 PE 가 motif 다양성을 오래 유지하는가"라는 새 축이 생긴다.

**왜 이게 APF 에 필요한가**: 프로필에 적힌 APF 의 현 status 는 *"TMAO method falsified at n=12, motif causality 실험 진행 중"* 이다. 범주형 motif 분류가 falsify 된 지점에서 **연속형 지표로 갈아타는 것**은 자연스러운 복구 경로다. erank 는 임계값이 없어(stable rank 와 달리) 분류 경계 설정 문제를 우회한다.

### 전이 2 — 이 논문의 가장 큰 공백이 곧 APF 의 존재 이유

이 논문은 개입 단위를 **뉴런 하나**로 잡는다(식 1이 유닛 단위 효용을 매기고, 재초기화도 유닛 단위). 그런데 `07_limits.md` 암묵 가정 ③ 에서 짚었듯, 이 가정은 **중첩(superposition)** 앞에서 흔들리고, 트랜스포머에서는 더 흔들린다 — 어텐션 헤드는 출력 크기와 기능적 중요도가 어긋나기로 유명하기 때문이다 (`05_method_b_utility.md` 조심할 점 3).

**APF 의 "2D attention motif" 는 정확히 이 문제에 대한 대안 답이다**: 개입 단위를 뉴런도 헤드도 아닌 **패턴(motif)** 으로 잡는 것. 그러면 APF 의 위치 주장이 이렇게 선명해진다 —

> "Dohare et al. (2024) 는 연속학습에서의 개입이 유닛 단위로 유효함을 보였다. 그러나 트랜스포머에서 유닛(또는 헤드)이 올바른 개입 단위인지는 검증되지 않았다. 우리는 어텐션 motif 를 개입 단위로 제안하고, PE × motif 격자에서 인과 개입으로 이를 검증한다."

이건 억지 매칭이 아니라 **이 논문이 명시적으로 비워둔 슬롯**(트랜스포머 부재)에 APF 를 꽂는 것이다.

### 전이 3 — 반면교사: 인과 분해를 내가 한다

이 논문의 가장 큰 방법론적 미완은 세 진단 지표를 **상관으로만** 쓴다는 것이다(`05_method_d_diagnostics.md` §4-d-5). 연속 역전파가 세 축을 동시에 건드리므로 어느 축이 병목인지 분리되지 않는다.

APF 의 프레임은 프로필상 마지막 단계가 **causal intervention** 이다. 즉 내 프레임은 구조적으로 이 논문이 못 한 것을 할 수 있게 돼 있다. 이건 논문에 쓸 수 있는 대비다 — "선행 연구는 진단 지표를 상관 수준에서 제시했고, 우리는 개입으로 분리한다."

---

## 8.4 충돌·경쟁 지점

**충돌 1 — "가소성 상실"과 "grokking"이 같은 데이터에서 동시에 일어나면?**
내 통합 가설(§8.2 흡수 2)의 가장 큰 리스크다. 만약 logistic map 실험에서 grokking 이 일어나는 동안 유효 랭크가 **감소**한다면, "다양성 감소 = 나쁨"이라는 이 논문의 프레임과 "표현 구조화 = 일반화"라는 grokking 문헌의 프레임이 정면 충돌한다. 실제로 그럴 가능성이 낮지 않다 — grokking 은 흔히 "산만한 표현이 구조화된 표현으로 압축되는 것"으로 서술되고, 압축은 랭크 감소로 보일 수 있다.

**대응**: 이건 위기가 아니라 **내 논문의 핵심 발견 후보**다. 같은 지표(erank)가 정상 데이터에서는 감소가 좋고 비정상 데이터에서는 감소가 나쁘다면, "다양성"이 아니라 **"과제 분포에 상대적인 적정 랭크"** 가 진짜 변수라는 더 정밀한 주장이 나온다. 이 논문의 프레임을 반박하면서 흡수하는 위치다.

**충돌 2 — 이 논문의 Claim 4 를 그대로 인용하면 안 된다.**
`07_limits.md` 반박 1 에서 정리했듯 "무작위·비경사 성분이 필수"는 저자 자신의 L2 결과와 긴장한다. 내 논문에서 이걸 사실로 인용하면 리뷰어에게 잡힌다. 인용한다면 **저자의 해석으로** 표기해야 한다.

---

## 8.5 인용 포인트 초안

> ⚠️ 아래 초안에서 **내 원고의 절 번호는 쓰지 않았다** — 프로필 기준 미상이므로 창작하지 않는다. 배치 위치는 원고에서 직접 확인해 결정할 것.

**(가) Grokking track — 관련 연구 절, non-stationarity 축 소개부**
> "긴 지평의 연속학습에서 표준 딥러닝이 학습 능력 자체를 상실한다는 것은 Dohare et al. (2024, *Nature* 632:768–774) 이 ImageNet 규모에서 확립했다. 그들은 이 현상이 죽은 유닛의 증가, 평균 가중치 크기의 증가, 표현의 유효 랭크 감소와 동반됨을 보고했다(식 2). 우리는 같은 진단 지표를 시계열 예측 트랜스포머에 적용하되, 그들이 다루지 않은 grokking 체제 — 즉 지연된 일반화가 발생하는 구간 — 에서 이 지표들이 어떻게 움직이는지를 묻는다."

**(나) Grokking track — 가설 제시부 (Lyle 2025 와 짝 인용)**
> "Lyle et al. (2025, arXiv:2507.20057) 은 grokking 과 비정상 환경 학습을 연결했고, Dohare et al. (2024) 는 비정상 환경에서의 능력 소실을 계량했다. 우리는 두 현상이 가중치 노름이라는 공통 질서 변수 위의 서로 다른 구간이라는 가설을 세우고, 정상/비정상 시계열에서 이를 검증한다."

**(다) Grokking track — 실험 설계 정당화**
> "Dohare et al. (2024) 는 가소성 상실이 과제 수가 적을 때는 나타나지 않을 수 있음을 명시한다. 이에 따라 우리는 regime 전환을 O(10³) 회 반복하는 긴 지평 프로토콜을 채택한다."

**(라) APF — 개입 단위 정당화**
> "선택적 재초기화 문헌(Dohare et al., 2024)은 개입 단위로 개별 유닛을 채택하며, 그 효용을 활성 크기와 출력 가중치 크기의 곱으로 측정한다(식 1). 이 척도는 출력 크기가 기능적 중요도를 대리한다고 전제하는데, 어텐션 기반 모델에서 이 전제는 검증되지 않았다. 본 연구는 개입 단위를 어텐션 패턴 motif 수준에서 정의하고 인과 개입으로 검증한다."

**(마) APF — 진단 지표 도입부**
> "표현 다양성의 정량화를 위해 우리는 Dohare et al. (2024) 의 유효 랭크 $\text{erank}(\Phi)=\exp\{H(p_1,\dots,p_q)\}$ 를 어텐션 패턴 행렬에 적용한다. 이 지표는 임계값에 의존하지 않아 motif 분류 경계 설정 문제를 우회한다."

---

## 8.6 이 논문에서 배울 **논문 쓰기**

내 상황(석사, 2026 석사과정생연구장려금 과제, NeurIPS 2027 1순위 / TMLR backup)에서 이 논문은 내용만큼이나 **형식**이 교재다.

1. **현상 → 범위 → 기전 → 개입**의 4단 구성. 각 단계가 앞 단계에 대한 예상 반론을 하나씩 죽인다. 내 두 track 모두 이 골격으로 재배치 가능하다.
2. **불리한 결과를 지운 게 아니라 나란히 그렸다.** L2 가 자기 알고리즘만큼 잘 듣는다는 걸 Fig. 1c 에 함께 그렸다. 그 정직함이 논문을 약하게 만든 게 아니라 신뢰를 만들었다 (다만 초록의 결론 문장은 그만큼 물러서지 않았고, 그 간극이 `07_limits.md` 반박 1 이다 — **이 간극을 내 논문에서는 만들지 말 것**).
3. **부사 하나로 과잉 주장을 방어한다.** *"apparently indefinitely"*, *"a preliminary comparison"*, *"associated with"*. 프로필에 적힌 APF 의 *"TMAO method falsified at n=12"* 같은 음성 결과를 다룰 때 필요한 어휘 감각이 정확히 이것이다 — 강한 주장은 강한 근거가 있는 층에만 걸고, 나머지는 부사로 물러선다.
