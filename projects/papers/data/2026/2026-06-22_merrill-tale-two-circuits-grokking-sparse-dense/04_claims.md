# 04 · 핵심 Claim 해체

> **배경 사다리**: claim 마다 (a) 한 줄 주장, (b) 어디서 근거가 나오는가, (c) 어떤 전제가 깔려 있는가, (d) 고등학생도 이해할 수 있는 재진술의 4 요소 구조로 본다. 본 논문의 본문 PDF 는 본 환경에서 접근 불가 — claim 단정 시 *abstract verbatim 단편* 또는 *저자 GitHub 코드* 로 추적되는 부분만 단정하고, 그 외는 "원문 본문 미확인" 으로 표기.

---

## Claim 1 — Phase transition 은 sparse subnetwork 의 logit 인수 사건이다

- **주장**: sparse parity 에서 grokking 의 phase transition 은 모델 예측이 **소수 뉴런만으로 구성된 subnetwork** 에 의해 지배되는 시점과 일치한다. 이 sparse subnetwork 만 활성화하고 나머지 뉴런을 마스킹해도 원본 모델의 예측이 거의 그대로 재현된다 (faithfulness ≈ 1).
- **증거 위치**: abstract verbatim "*the grokking phase transition corresponds to the emergence of a sparse subnetwork that dominates model predictions*" + 저자 GitHub `parity.py` 의 `--subnetworks --faithfulness` CLI 플래그 + `utils.py` 의 `circuit_discovery_binary/linear` 함수 (`acc_calc` 의 `faithfulness=True` 분기) + `FF1.masked_forward(x, mask)` 메서드 (top-$k^\star$ 뉴런만 활성화). 정확한 faithfulness 곡선 수치 / phase transition 의 epoch 좌표는 **본문 PDF 미확인**.
- **숨은 전제**:
  1. "logit 지배 = 회로 책임" 의 등치. faithfulness 가 높다는 것은 marginal contribution 의 단조성과 비-상호작용을 암묵 가정. ReLU + 1-hidden 의 단순성 덕에 합리적이지만, deeper / attention 모델에선 깨질 수 있음.
  2. circuit discovery 의 ranking 기준이 **뉴런 노름** 이라는 선택. 만약 일반 sparse 뉴런이 큰 노름을 갖지 않거나 cancellation 으로 작은 노름으로 큰 logit 을 내는 구조라면 이 ranking 은 깨진다 (본 task 의 hinge + ReLU 조합에선 안정적).
  3. "지배" 의 metric 은 binary classification 에서 sign 일치 (`acc_calc` 의 `torch.sign(squeeze(pred)) == torch.sign(squeeze(fullmodel_pred))`). 다른 metric (KL, logit MSE) 으로 본 결과는 동일성 미확인.
- **쉬운 말 풀이**: "신경망 1000 개 뉴런 중 사실은 5~10 개 (또는 그 비슷한 작은 수) 만이 답을 결정하고 있더라. 그 작은 팀이 답을 인수하는 순간이 곧 grokking 의 폭발 순간이다."

---

## Claim 2 — Phase transition 직전에는 dense subnetwork 가 logit 을 지배하며 그것은 일반화하지 않는다

- **주장**: grokking 이전의 학습 구간에서는 **조밀한 (dense) 부분망** — 다수의 작은-노름 뉴런이 협력 — 이 예측을 책임지며, 이 dense subnetwork 는 train set 은 외우지만 **test set 에선 chance 수준** 으로 일반화하지 못한다.
- **증거 위치**: abstract verbatim "*competition of two largely distinct subnetworks: a dense one that dominates before the transition and generalizes poorly, and a sparse one that dominates afterwards*" + 저자 GitHub `parity.py` 의 `--global-sparsity` 플래그 (전체 sparsity 시계열 추적) + `circuit_discovery_*` 가 epoch 별로 호출되어 시간 축의 sparsity 진화를 그릴 수 있도록 설계. 정확한 dense subnetwork 의 뉴런 수, train/test acc 차이의 수치는 **본문 PDF 미확인**.
- **숨은 전제**:
  1. **양분 가정 (binary partition)**. 학습 도중 모든 뉴런이 dense 또는 sparse 둘 중 하나로 깔끔히 분류된다는 가정. 실제로는 spectrum 위에 있을 수 있으며, 중간 단계의 "회색 뉴런" 이 존재할 수 있음 — 본 논문이 그 spectrum 을 어떻게 처리하는지는 본문 미확인.
  2. **"같은 모델 안의 두 subnetwork"** 라는 표현은 동일 weight tensor 의 두 partition 이지 별도 모델이 아니다. dense subnetwork 의 뉴런들이 학습 후반에 sparse subnetwork 로 *변신* 하는지, 아니면 *떨궈지고* 새로운 뉴런이 등장하는지 (Lottery Ticket 식) 는 본 논문이 명확히 답해야 할 부분.
  3. dense subnetwork 가 일반화 못 한다는 측정은, dense subnetwork 만 활성화한 마스크 forward 의 test acc 가 chance 라는 형태일 가능성 — 정확한 실험 protocol 본문 미확인.
- **쉬운 말 풀이**: "학습 초반에는 시끄러운 다수의 뉴런이 답을 외우는 식으로 끌고 가는데, 외운 답이라 새 문제엔 무력하다. 후반에는 조용한 소수의 뉴런이 진짜 규칙을 찾아내 답을 가져간다."

---

## Claim 3 — 뉴런 노름의 양극화가 phase transition 의 *원인측* 신호다

- **주장**: 학습 도중 뉴런별 노름 시계열을 보면 두 집단이 분리된다 — 소수의 뉴런은 **빠르게 노름이 증가** 하고, 다수의 뉴런은 weight decay 에 의해 **완만하게 감쇠**. 이 두 집단의 노름 교차 (또는 sparse 집단의 노름이 threshold 를 넘는) 시점이 phase transition 의 시간 좌표와 일치한다.
- **증거 위치**: abstract verbatim "*this subnetwork arises when a small subset of neurons undergoes rapid norm growth, whereas the other neurons in the network decay slowly in norm*" + 저자 GitHub `parity.py` 의 `--ind-norms` 플래그 (individual neuron norms) + `circuit_discovery_*` 가 `np.array(norms['feats'][epoch]).argsort()` 로 노름 순으로 뉴런을 정렬 — 노름이 ranking primitive 임을 코드가 확정. 정확한 노름 시계열 그래프와 "rapid" vs "slowly" 의 폐쇄적 정의는 **본문 PDF 미확인**.
- **숨은 전제**:
  1. **weight_decay = 0.01** 의 hyperparameter 설정이 "완만한 감쇠 background" 를 만든다. weight decay = 0 이거나 너무 크면 이 두-population 분리는 깨질 수 있음 — 본 논문이 이 sensitivity 를 ablation 했는지는 본문 미확인.
  2. **"노름 = 영향력"** 의 등치. ReLU + linear readout 의 단순 구조에서는 합리적이지만, 일반 architecture 에선 노름이 큰 뉴런이 항상 logit 을 지배하는 것은 아님 (cancellation, sparse activation patterns).
  3. "교차 = phase transition" 의 인과 — 노름 동학이 phase transition 을 *야기* 하는지 *동반* 하는지의 인과적 분리는 노름을 인위적으로 개입 (예: 특정 뉴런 노름을 강제로 고정) 했을 때 grokking 시점이 어떻게 바뀌는지를 봐야 함. 본 논문이 이 개입을 했는지는 본문 미확인.
- **쉬운 말 풀이**: "신경망 안에서 어떤 뉴런들이 답을 안다 = 그 뉴런들의 가중치 크기가 빠르게 큰다. 답을 모르는 뉴런들은 weight decay 가 천천히 깎아낸다. 작아진 뉴런들 사이에서 갑자기 키 큰 소수가 등장하는 순간이 곧 그록킹."

---

## Claim 4 — Sparse subnetwork 의 표현은 DNF (또는 그 변형) 구조다

- **주장**: phase transition 후 학습된 sparse subnetwork 는 **Disjunctive Normal Form (DNF, 논리합 정규형)** 와 유사한 구조로 parity 를 계산한다. $k$-bit parity 의 표준 DNF 구성은 $2^k$ 뉴런 (예: $k=3$ → 8 뉴런), 변형 DNF 는 더 적은 뉴런 (예: $k=3$ → 6 뉴런) 으로 가능하다. 본 논문은 학습으로 도달한 sparse subnetwork 의 뉴런 수가 이 두 이론적 구성과 비교 가능함을 보인다.
- **증거 위치**: 다수 검색 인덱스 verbatim 단편 "*a standard DNF construction uses 8 neurons to compute the parity of 3 bits, or a modified DNF that uses only 6 neurons*" + 저자 GitHub `utils.py` 의 `ArityFinder` 클래스 — 각 뉴런이 입력 40 비트 중 몇 비트에만 의존하는지 (active inputs) 를 binary-search 로 prune 하여 측정. arity 가 $k=3$ 근처에 몰리면 DNF-스타일 구성을 시사. 8 vs 6 의 격차에 대한 본 논문의 정량 비교는 **본문 PDF 미확인**.
- **숨은 전제**:
  1. "DNF 와 닮음" 은 *근사적* 표현. 학습된 weight 가 정확한 ±1 격자 위에 있는 것은 아니므로, "DNF 구조" 라는 표현은 *기능 동치성 (functional equivalence)* 의 의미여야 함.
  2. ArityFinder 가 의존성을 검출하는 기준은 "그 비트들을 마스킹해도 sign 예측이 동일" 인 binary search — 정확한 weight magnitude 가 아니라 *행동의 보존* 으로 정의. 매우 작은 weight 가 우연히 sign 을 결정짓는 edge case 는 놓칠 수 있음.
  3. $k$ 값을 변화시켰을 때 sparse subnetwork 의 크기가 $\Theta(2^k)$ 로 비례하는지의 scaling 검증은 본문 미확인.
- **쉬운 말 풀이**: "신경망이 학습한 sparse 회로는 *논리합 표* 와 비슷한 구조다 — '비트 1=+1, 비트 2=+1, 비트 3=+1' 같은 8 가지 조합을 직접 외워서 계산한다. 표준 방식은 8 줄, 영리한 변형은 6 줄로 같은 일을 한다."

---

## Claim 5 (부수) — Grokking 은 회로 경쟁의 일반 패턴이지 algorithmic-task 한정 현상이 아닐 수 있다

- **주장**: sparse parity 는 모든 algorithmic task 의 대표가 아니지만, **"dense memorizing subnetwork → sparse generalizing subnetwork 의 교체"** 라는 회로 경쟁 패턴은 grokking 이 보고된 다른 task (modular addition, lottery-ticket retrain, double descent) 에도 적용 가능한 *기계론적 골격* 이다.
- **증거 위치**: 본문 PDF 미확인 (논문이 명시적 일반화를 주장했는지 확인 불가). 그러나 abstract verbatim 의 "*competition of two largely distinct subnetworks*" 라는 일반 형태로 진술된 점과, 후속 grokking 문헌이 본 논문을 "circuit-competition view" 의 일반 frame 으로 인용하는 사실 (e.g., arXiv:2310.19470, arXiv:2405.12755 검색 인덱스 참조) 로 정황 추정.
- **숨은 전제**:
  1. modular addition 의 Fourier circuit (Nanda 2023) 도 "dense → sparse 교체" 의 한 instance 라는 가정 — 검증 필요. Fourier circuit 은 frequency channel 의 *얇은* 구조이므로 sparse 회로의 정의를 어떻게 잡느냐가 관건.
  2. Lottery Ticket 의 sparse subnetwork 는 *프루닝 후 retrain* 의 결과, grokking 의 sparse subnetwork 는 *자연 학습* 의 결과 — 두 sparse 가 같은 구조라는 보장은 없음.
- **쉬운 말 풀이**: "다른 grokking 사례들 (예: modular 덧셈) 도 사실 비슷하게 'dense 외우기 회로' 와 'sparse 일반화 회로' 가 싸우고 있을 것이라는 가설 — 본 논문이 그 가설을 검증한 것은 아니지만, 그 가설을 *진지하게* 가능하게 만든다."

---

## Claim 우선순위 요약

| 우선순위 | Claim | 신뢰도 (Source Lock 기반) |
|----------|-------|---------------------------|
| 핵심 | Claim 1 (sparse subnetwork 가 예측 인수) | ★★★★ (abstract + 코드 직접) |
| 핵심 | Claim 2 (dense → sparse 교체) | ★★★★ (abstract verbatim) |
| 핵심 | Claim 3 (뉴런 노름 양극화) | ★★★★ (abstract + `--ind-norms` 코드) |
| 보조 | Claim 4 (DNF 구조 비교) | ★★★ (검색 인덱스 + ArityFinder 코드) |
| 추정 | Claim 5 (다른 task 로의 일반화) | ★★ (논문 본문 미확인, 정황 추정) |
