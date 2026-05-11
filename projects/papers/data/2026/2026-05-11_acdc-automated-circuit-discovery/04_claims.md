# 3. 핵심 Claim 해체

논문의 주장은 (a) 방법론적 = "이게 회로 발견의 표준 절차다", (b) 알고리즘적 = "이렇게 자동화하면 작동한다", (c) 실험적 = "ground-truth 회로 를 재발견한다", (d) 비교적 = "기존 baseline 대비 어떤 위치인가" 의 4 갈래로 나뉘다. 5 개 Claim 으로 정리한다.

---

## Claim 1 — mech interp workflow 는 3 단계로 정형화된다

**주장**: 기존의 ad-hoc 한 회로 발견 작업들이 사실 (M1) 행동 정의 + 데이터·메트릭 → (M2) abstract unit (head/MLP) 단위 활성 패칭 → (M3) unit 사이 edge 단위 가지치기, 3 단계로 환원된다.

**증거**: 논문 본문이 IOI (Wang 2023), Greater-Than (Hanna 2023), Docstring (Heimersheim 2023) 등 기존 회로 발견 사례를 이 3 단계 frame 으로 재기술. 원문 본문 미열람으로 정확한 section 번호 인용 불가하지만, abstract 와 NeurIPS spotlight 소개 페이지의 "researchers choose a metric and dataset that elicit the desired model behavior, then apply activation patching to find which abstract neural network units are involved in the behavior, and the authors automate the step of finding the connections between the abstract neural network units that form a circuit" 문장이 이 3 단계의 공식 진술.

**숨은 전제**:
- 회로가 *additive* 라는 가정 — 즉 unit + edge 의 부분그래프로 행동이 설명된다는 것. 이게 작동하려면 모델이 "회로형" 모듈성을 갖춰야 함. SAE 흐름 (Bricken 2023) 은 이 가정이 head 단위에서 부분적으로만 맞다고 보고 feature 단위로 내려간다.
- 행동이 *동질적* (homogeneous) 인 데이터셋으로 좁혀진다는 가정. IOI 처럼 prompt template 이 강한 task 만 잘 작동.
- "abstract unit" 의 입도가 사전에 선택돼 있다 — 보통 attention head, MLP, 또는 한 token-position 까지. 이 입도는 자체 가설이다.

**쉬운 말 풀이**: "고장 난 가전제품 진단 매뉴얼" 의 표준 절차다. (1) 무슨 증상인지부터 정한다 ("토스트가 안 구워진다"), (2) 어느 부품이 의심되는지 골라낸다 (코일 / 타이머 / 스위치), (3) 부품들 사이의 어느 전선이 진짜 필요한지 끊어 가며 본다. 신경망 회로 발견도 똑같이 (1) - (2) - (3) 이라는 주장.

---

## Claim 2 — (M3) 단계는 단일 hyperparameter τ 의 알고리즘으로 환원된다

**주장**: edge 단위 가지치기는 *역위상정렬* + *edge-by-edge greedy ablation* + *metric 차이가 임계 τ 보다 작으면 제거* 라는 단순한 절차로 충분하다. 이 절차가 **ACDC** 다.

**증거**: 저자 GitHub `acdc/TLACDCExperiment.py` 의 `step()` 함수 — `for parent in node.parents: edge.present = False; result = update_cur_metric() - old_metric; if result < threshold: keep edge removed`. `reverse_topologically_sort_corr` 가 순회 순서 보장. `--threshold` 인자가 알고리즘의 유일한 결정적 hyperparameter (예외: ablation 방식 zero / random 선택).

**숨은 전제**:
- **Greedy 의 적정성**: edge 의 한계 효과가 *대체로 독립* 이라는 가정. cooperative effect (두 엣지가 함께만 의미 있는 경우) 가 적어야 함. 이 가정은 부분적으로만 옷다 — IOI 의 backup name mover heads 처럼 보상 회로가 있으면 한 엣지를 끊어도 metric 이 안 떨어지므로 ACDC 가 둘 다 버릴 수 있음. 논문도 부분적으로 인정.
- **역위상정렬의 적정성**: 출력에 가까운 노드부터 처리해야 "이 노드의 들어오는 엣지" 가 의미있게 평가됨. 순방향이면 *제거된 엣지를 통해* 들어온 값이 이후 평가에서 왜곡됨.
- **단일 τ 의 충분성**: 모든 엣지가 같은 scale 의 metric 변화를 일으킨다는 가정. 실제론 깊이별로 scale 이 다른데, 단일 τ 가 이를 무시.

**쉬운 말 풀이**: "전선 하나씩 끊어 보면서 토스트가 잘 안 구워지면 (변화량 ≥ τ) 다시 잇고, 별 차이 없으면 (변화량 < τ) 그대로 뺀 둔다. 끊는 순서는 *콘센트* 쪽이 아니라 *발열 코일* 쪽 (출력에 가까운 쪽) 부터." 끊는 순서가 중요한 이유는, 발열 코일 끊긴 상태에서 그 위로 가는 전선의 중요성을 측정하는 게 무의미하기 때문이다.

---

## Claim 3 — ACDC 가 손으로 발견된 회로를 재발견한다

**주장**: IOI / Greater-Than / Docstring 등 ground-truth 회로가 알려진 task 에서, ACDC 가 사람이 찾아낸 component 종류·연결을 (정량·정성적으로) 재발견한다.

**증거 (cross-source)**:
- Greater-Than: GPT-2 Small 의 32,000 edges 중 ACDC 가 선택한 68 edges 가 **5/5 component type** 을 모두 포함 (cross-source: NeurIPS abstract + 후속 비교 표).
- Docstring (KL 메트릭 + edge-level ROC): AUC = **0.982** (cross-source: Syed et al. 2024 BlackboxNLP 재측정 표).
- tracr-reverse / tracr-xproportion (zero-ablation): AUC = **1.000** — 컴파일된 ground-truth (각 18 / 14 edges) 와 완전 일치.
- IOI / Induction: 정성적으로 IOI 4 클래스 head + induction head 재발견 (수치는 cross-source 표에 일부 나오나 정확한 AUC 수치는 원문 본문 미열람으로 확정 미보고).

**숨은 전제**:
- "ground-truth" 의 신뢰. IOI 회로는 *Wang et al. 2023 이 발견한 것* 이지 모델 내부의 "참" 회로가 아니다. ACDC 의 ROC 는 결국 *과거 손작업과의 일치도* 이며, 그 손작업이 옷다는 가정에 기대다. tracr 만 진짜 ground-truth (컴파일된 회로) 가 있어 이 가정이 깨끗.
- 메트릭의 적합성. KL 은 logit 전체 분포를 본다 — IOI 처럼 *두 토큰 사이* 차이가 중요한 task 에서는 logit-diff 가 더 sharp.

**쉬운 말 풀이**: "사람이 한 달 걸려 찾은 답안과, 자동 채점기가 5 분 만에 매긴 답안이 비슷하더라" 의 증거. 단, "사람이 찾은 답안이 진짜 정답인가" 는 별개 질문 — tracr 만이 진짜 정답이 있고, 거기서는 ACDC 가 완벽 (AUC 1.000).

---

## Claim 4 — 단일 hyperparameter τ 가 정확도-희소도 Pareto frontier 를 직접 노출시킨다

**주장**: τ 를 바꾸면 회로의 크기 (남은 엣지 수) 와 회로의 정확도 (metric 보존) 사이의 trade-off 가 자연스럽게 그려진다. baseline (SP, HISP) 와 같은 축에 놓고 Pareto frontier 비교 가능.

**증거**: 저자 GitHub `experiments/launch_induction.py` 가 다수 τ 값으로 ACDC 를 돌려 Pareto frontier 를 그리는 스크립트. cross-source: ACDC 의 Pareto frontier 가 induction task 에서 SP / HISP 와 유사한 영역을 cover, 일부 영역에서 SP 가 약간 dominant.

**숨은 전제**:
- 회로의 "정확도" 가 metric 보존으로 환원된다는 가정. 사람이 보는 회로의 "해석 가능성" 은 KL 보존과 별개일 수 있음 — 같은 KL 을 만드는 회로가 둘 이상 존재하면 ACDC 는 *덜 해석 가능한* 회로를 줄 수 있다.
- "희소도" 의 정의가 엣지 수 ≠ 노드 수 ≠ 파라미터 수. 어느 것을 보느냐에 따라 Pareto frontier 모양이 달라짐.

**쉬운 말 풀이**: 자동차 다이어트 — 무게를 얼마나 줄였는가 vs 속도를 얼마나 잃었는가. ACDC 는 그 곡선 위의 점들을 τ 하나로 자동 생성한다.

---

## Claim 5 — Subnetwork Probing (SP) 가 평균 AUC 에선 약간 앞서지만, ACDC 는 *인과적 (causal)* 해석을 보장한다

**주장**: 학습 기반 SP 가 평균 ROC AUC 에서 ACDC 를 약간 (cross-source: 0.692 vs 0.596) 앞서지만, SP 가 학습한 mask 는 "최소 활성 부분" 이지 "인과적 회로" 가 아니다. ACDC 는 매 엣지를 **개입** 으로 검증하므로 *행동의 인과적 원인* 을 보장.

**증거**: 논문 본문에서 SP vs ACDC 정성 비교 (원문 본문 미열람으로 정확한 단락 미확정), 후속 비판 (Syed et al. 2024) 가 평균 AUC 수치를 명시. ACDC 의 인과성 보장은 *알고리즘 정의* 에서 도출 — 모든 edge 가 corrupted 분포 개입을 통해 검증된다.

**숨은 전제**:
- "인과성" 의 조작적 정의. ACDC 는 *do(edge = corrupted)* 개입 하의 metric 변화로 인과를 정의 — 이는 *interventional* 이지 *counterfactual* 은 아니다. counterfactual 한 인과성을 보장한다고 주장하면 과장.
- 정확도 비교가 노이즈 안에 있을 수 있음. ACDC 의 hyperparameter τ 와 SP 의 sparsity coefficient 가 서로 다른 축이라 같은 sparsity 에서 비교했는지 / 같은 정확도에서 비교했는지가 ROC 모양을 흔든다.

**쉬운 말 풀이**: "정답률은 SP 가 조금 높지만, ACDC 는 *왜 그게 정답인지 설명할 수 있다* 는 안전 장치를 갖는다." 두 알고리즘은 같은 게임을 하는 게 아니다 — SP 는 *학습된 mask*, ACDC 는 *개입 검증* 이라는 다른 보증 종류.
