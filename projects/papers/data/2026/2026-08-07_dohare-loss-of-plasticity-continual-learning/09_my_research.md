# 8. 내 연구와의 연결

> **작성 규칙 (§9 봉인 준수)**: 내 프로젝트에 대해 단정하는 사실은 **`_profile.md` / `_index.md` 에 문자 그대로 적힌 것만**이다. 두 파일에 없는 아키텍처·수식·절 번호·인물은 "프로필 기준 미상"으로 표기했고 창작하지 않았다.

> **배경 사다리**: 내 두 active track 은 **APF**(`Attention Pattern Fields/`)와 **Grokking in TS Transformers**(`Grokking in Time Series Transformers/`)이며, 이 논문은 `_profile.md` §A(Grokking/Delayed Generalization) · §B(Mechanistic Interpretability) · §F(Continual learning)에 걸친다. 연결 강도는 축별로 솔직히 표기했다.

---

## 8.1 연결 강도 지도 (먼저 정직하게)

| 내 자산 | 연결 축 | 강도 | 이유 |
|---|---|---|---|
| **Grokking in TS Transformers** (🟢 active) | §A + §F | **강함 (직접)** | 프로필 명시 4-way 교차점 중 **non-stationarity** 축과 **training dynamics** 를 정면으로 다룸 |
| **APF** (🟢 active) | §B | **중간 (방법 전이)** | 이 논문의 "개입 단위 = 뉴런" 가정이 트랜스포머에서 깨지는 지점이 곧 APF 의 존재 이유 |
| **P1 ProTran-TFA** (⏸️ paused) | §E | **약함 (전이 가능성만)** | 금융 시계열의 비정상성이라는 주제적 인접성뿐, 이 논문의 mechanism 직접 적용 지점 없음 |
| **P2 Autonomous Research Loop** (⏸️ paused) | — | **약함** | 프로필 기준 "daemon 죽음, 403 hypothesis × 12k+ CSV" 외 세부 미상 |
| Shelved 자산 (EOA·F6/MCLT·RegFiLM·AETHER 등) | — | **연결 없음** | 억지 매칭하지 않음 |

**"Paper 1~3 drafts (multiplicative conditioning, representation utility, TTPA)"** 중 *representation utility* 라는 어구가 식 (1) 기여 효용(contribution utility)과 명칭상 공명하지만, **그 draft 의 실제 내용은 프로필 기준 미상**이므로 연결을 주장하지 않는다. 로컬에서 확인할 가치는 있다.

---

## 8.2 흡수할 기법 — Grokking track (강한 연결)

프로필이 명시하는 Grokking track 의 정의는 **"Grokking × TS forecasting × non-stationarity × circuit analysis" 4-way intersection (0 papers found)** 이다. 이 논문은 네 축 중 **non-stationarity** 와 **training dynamics** 를 정면으로 다루면서 TS forecasting 과 circuit analysis 는 비운다 — 즉 **내 교차점의 인접 셀을 채운 논문**이다.

### 흡수 1 — 세 진단 지표를 Grokking track 의 **표준 계측 세트**로 채택

세 지표는 그대로 이식 가능하고 비용이 사실상 0 이다: **죽은 유닛 비율**(verbatim 정의: ReLU 망에서 *"the output of the activations is zero for all examples of the task"*) / **평균 가중치 크기**(Fig. 4d 축) / **유효 랭크 식 (2)** $\text{erank}(\Phi)=\exp\{H(p_1,\dots,p_q)\}$, 보조로 stable rank.

**어디에 붙이나**: 프로필이 *"P2 logistic 4-layer 실험 background 진행 중"* 이라 적은 그 실행이다. 이미 돌고 있는 run 의 체크포인트에서 사후 계산하면 **추가 학습 비용 0** 으로 새 축의 데이터가 나온다. logistic map 은 프로필 Grokking 데이터 목록에 명시돼 있고 Tier 1 priority 항목 *"Grokking Applied to Chaotic Iterates of the Logistic Map"* 의 직접 비교 대상이다.

**왜 값진가**: grokking 문헌은 전통적으로 손실 곡선과 가중치 노름만 본다. **유효 랭크**를 더하면 "일반화가 오는 순간 표현의 실질 차원이 어떻게 움직이는가"가 열리고, 이는 내 track 의 네 번째 축(circuit analysis)으로 이어지는 관측량이다.

### 흡수 2 — 가중치 노름을 **두 현상의 공통 질서 변수(order parameter)** 로 정식화

이게 내 track 이 가져갈 **가장 큰 개념적 자산**이다. 이 논문은 가중치 크기 **증가** ↔ 가소성 상실을 보고하고(*"associated with an increase in the average magnitude of the weights"*, Fig. 4d), 내가 이미 커버한 **Omnigrok**(Liu·Michaud·Tegmark, arXiv:2210.01117, `_index.md` 2026-06-12 ✓)은 가중치 노름을 grokking 의 핵심 변수로 놓는다.

**같은 변수가 한쪽에선 "늦게 좋아짐"을, 다른 쪽에선 "천천히 나빠짐"을 지배한다면** 두 현상은 하나의 축 위 서로 다른 구간일 수 있다:

> "시계열 트랜스포머의 학습 동학에는 가중치 노름이 지배하는 하나의 축이 있고, 정상 데이터에서는 그 축 위에서 grokking 이, 비정상 데이터에서는 같은 축 위에서 가소성 상실이 나타난다."

프로필이 "0 papers found"라 적은 4-way 교차점에 **통합 가설**을 주는 프레이밍이다. **연결 다리는 이미 내 인덱스 안에 있다** — `_index.md` 2026-05-01 커버 항목 Lyle·Sokar·Pascanu·György (arXiv:2507.20057). Lyle 이 다리를 놓았고 Dohare 가 반대편 기둥이므로 **한 쌍으로 인용해야** 한다.

### 흡수 3 — 실험 프로토콜: "지평을 늘려야 보인다"

진짜 방법론적 교훈은 알고리즘이 아니라 **측정 설계**다(*"may not occur at all for small numbers of tasks"*). 내 자산 중 **regime-switching synthetic**(프로필 명시)이 여기 맞는다 — regime 전환을 **수백~수천 번** 반복하는 긴 지평으로 재구성하면 "TS 트랜스포머에서 가소성 상실이 일어나는가"에 처음으로 답할 수 있다. ETT-mini / Weather-mini / Traffic-mini 는 지평이 짧아 부적합하며, 합성 데이터라야 지평을 늘릴 수 있다 (Continual ImageNet 이 50만 과제를 확보한 것과 같은 논리).

---

## 8.3 흡수할 기법 — APF track (중간 연결, 방법 전이)

프로필이 명시하는 APF 프레임은 **"PE → 2D attention motif → CNN probe → causal intervention"**, PE 축은 NoPE/sinusoidal/learned/RoPE/ALiBi, motif 축은 diagonal/stripe/block/edge/spike/checker 다.

### 전이 1 — 유효 랭크를 **motif 다양성의 정량 지표**로

APF 의 motif taxonomy 는 현재 **범주형**(6종)인데, 식 (2)의 유효 랭크는 어텐션 패턴 행렬에 그대로 적용 가능한 **연속형 다양성 지표**를 준다 — PE 5종 각각의 $\text{erank}$ 궤적을 그리면 "어떤 PE 가 motif 다양성을 오래 유지하는가"라는 새 축이 생긴다. 프로필상 APF status 가 *"TMAO method falsified at n=12"* 인 지점에서 **범주형 → 연속형으로 갈아타는 것**은 자연스러운 복구 경로이고, erank 는 임계값이 없어 분류 경계 설정 문제를 우회한다.

### 전이 2 — 이 논문의 가장 큰 공백이 곧 APF 의 존재 이유

이 논문은 개입 단위를 **뉴런 하나**로 잡는다. 그런데 그 가정은 중첩(superposition) 앞에서 흔들리고 트랜스포머에서는 더 흔들린다 (`07_limits.md` 암묵 가정 ③, `05_method_b_utility.md` 조심할 점 3). **APF 의 "2D attention motif" 는 정확히 이 문제에 대한 대안 답** — 개입 단위를 뉴런도 헤드도 아닌 **패턴**으로 잡는 것이다. 위치 주장이 이렇게 선명해진다:

> "Dohare et al. (2024) 는 연속학습에서의 개입이 유닛 단위로 유효함을 보였다. 그러나 트랜스포머에서 유닛(또는 헤드)이 올바른 개입 단위인지는 검증되지 않았다. 우리는 어텐션 motif 를 개입 단위로 제안하고, PE × motif 격자에서 인과 개입으로 이를 검증한다."

억지 매칭이 아니라 **이 논문이 명시적으로 비워둔 슬롯**에 APF 를 꽂는 것이다.

### 전이 3 — 반면교사: 인과 분해를 내가 한다

이 논문은 세 진단 지표를 **상관으로만** 쓴다(§4-d-5). APF 프레임은 마지막 단계가 **causal intervention** 이므로 구조적으로 이 논문이 못 한 것을 할 수 있다 — "선행 연구는 진단 지표를 상관 수준에서 제시했고, 우리는 개입으로 분리한다."

---

## 8.4 충돌·경쟁 지점

**충돌 1 — "가소성 상실"과 "grokking"이 같은 데이터에서 동시에 일어나면?**
통합 가설(§8.2 흡수 2)의 최대 리스크다. logistic map 실험에서 grokking 중에 유효 랭크가 **감소**한다면, "다양성 감소 = 나쁨"(이 논문)과 "표현 구조화 = 일반화"(grokking)가 정면 충돌한다. 가능성이 낮지 않다 — grokking 은 흔히 "산만한 표현의 압축"으로 서술되고 압축은 랭크 감소로 보인다. **대응**: 위기가 아니라 **핵심 발견 후보**다. 같은 지표가 정상에서는 감소가 좋고 비정상에서는 나쁘다면, "다양성"이 아니라 **"과제 분포에 상대적인 적정 랭크"** 가 진짜 변수라는 더 정밀한 주장이 나온다.

**충돌 2 — Claim 4 를 그대로 인용하면 안 된다.** "무작위·비경사 성분이 필수"는 저자 자신의 L2 결과와 긴장한다(`07_limits.md` 반박 1). 사실로 인용하면 리뷰어에게 잡힌다 — **저자의 해석으로** 표기할 것.

---

## 8.5 인용 포인트 초안

> ⚠️ **내 원고의 절 번호는 쓰지 않았다** — 프로필 기준 미상이므로 창작하지 않는다. 배치는 원고에서 직접 확인할 것.

**(가) Grokking — 관련 연구, non-stationarity 축 소개부**
> "긴 지평의 연속학습에서 표준 딥러닝이 학습 능력 자체를 상실한다는 것은 Dohare et al. (2024, *Nature* 632:768–774) 이 ImageNet 규모에서 확립했다. 그들은 이 현상이 죽은 유닛 증가, 평균 가중치 크기 증가, 표현의 유효 랭크 감소와 동반됨을 보고했다(식 2). 우리는 같은 지표를 시계열 예측 트랜스포머에 적용하되, 그들이 다루지 않은 grokking 체제에서 이 지표들이 어떻게 움직이는지를 묻는다."

**(나) Grokking — 가설 제시부 (Lyle 2025 와 짝 인용)**
> "Lyle et al. (2025, arXiv:2507.20057) 은 grokking 과 비정상 환경 학습을 연결했고, Dohare et al. (2024) 는 비정상 환경에서의 능력 소실을 계량했다. 우리는 두 현상이 가중치 노름이라는 공통 질서 변수 위의 서로 다른 구간이라는 가설을 세우고 정상/비정상 시계열에서 검증한다."

**(다) Grokking — 실험 설계 정당화**
> "Dohare et al. (2024) 는 가소성 상실이 과제 수가 적을 때 나타나지 않을 수 있음을 명시한다. 이에 따라 우리는 regime 전환을 O(10³) 회 반복하는 긴 지평 프로토콜을 채택한다."

**(라) APF — 개입 단위 정당화**
> "선택적 재초기화 문헌(Dohare et al., 2024)은 개입 단위로 개별 유닛을 채택하며 그 효용을 활성 크기와 출력 가중치 크기의 곱으로 측정한다(식 1). 이 척도는 출력 크기가 기능적 중요도를 대리한다고 전제하는데, 어텐션 기반 모델에서 이 전제는 검증되지 않았다. 본 연구는 개입 단위를 어텐션 패턴 motif 수준에서 정의하고 인과 개입으로 검증한다."

**(마) APF — 진단 지표 도입부**
> "표현 다양성의 정량화를 위해 Dohare et al. (2024) 의 유효 랭크 $\text{erank}(\Phi)=\exp\{H(p_1,\dots,p_q)\}$ 를 어텐션 패턴 행렬에 적용한다. 이 지표는 임계값에 의존하지 않아 motif 분류 경계 설정 문제를 우회한다."

---

## 8.6 이 논문에서 배울 **논문 쓰기**

내 상황(석사, NeurIPS 2027 1순위 / TMLR backup)에서 이 논문은 형식도 교재다. ① **현상 → 범위 → 기전 → 개입**의 4단 구성 — 각 단계가 앞 단계에 대한 예상 반론을 하나씩 죽인다. ② **불리한 결과를 지우지 않고 나란히 그렸다** (Fig. 1c 의 L2). 다만 초록의 결론 문장은 그만큼 물러서지 않았고 그 간극이 `07_limits.md` 반박 1 이다 — **이 간극을 내 논문에서는 만들지 말 것.** ③ **부사로 과잉 주장을 방어한다**: *"apparently indefinitely"*, *"a preliminary comparison"*, *"associated with"*. 프로필의 *"TMAO method falsified at n=12"* 같은 음성 결과를 쓸 때 필요한 어휘 감각이 정확히 이것이다.
