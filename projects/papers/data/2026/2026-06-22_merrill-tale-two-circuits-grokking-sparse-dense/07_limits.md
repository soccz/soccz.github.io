# 07 · 가정·한계·반박

> **배경 사다리**: ① "명시 가정 (explicit assumption)" = 논문이 본문에 직접 말한 조건, ② "암묵 가정 (implicit assumption)" = 본문에 안 나오지만 결과가 성립하려면 필요한 조건, ③ "반박 가능 (falsifiable)" = 실험으로 깨질 수 있는 진술. 이 셋을 깔고 들어간다.

---

## 1) 명시된 가정 (논문이 직접 말한 것 — abstract verbatim + 코드로 확인)

| 가정 | 출처 | 근거 |
|------|------|------|
| 학습 task 는 sparse parity | abstract verbatim "sparse parity task" | utils.py parity() 코드 |
| 모델은 작은 MLP | 검색 인덱스 verbatim ("uses MLPs rather than transformers") | utils.py FF1 class |
| Weight decay 를 사용 | 코드 default `weight_decay=0.01` | parity.py argparse |
| "phase transition 직후 sparse subnetwork 가 예측을 인수" 함 | abstract verbatim "dominates model predictions" | - |

(본문 PDF 미확인이므로 *이론 가정* (예: 어떤 정리의 가정) 은 단정 안 함.)

---

## 2) 암묵 가정 (본문에 말 안 했지만 깔려 있는 것)

### 암묵 가정 1 — "노름이 회로 영향력의 충분 ranking" 이다
- circuit discovery 가 *노름 ranking* 을 prior 로 쓰는데, 이게 *충분* 한 ranking 이라는 가정은 본문에 명시되지 않음. ReLU + linear readout 의 단순 architecture 에선 합리적이지만 일반 architecture (attention, BatchNorm, residual) 에선 깨질 수 있음.
- **반박 가능성**: gradient × activation 또는 Shapley ranking 으로 ranking 을 교체했을 때 같은 sparse subnetwork 가 발견되는지 실험.

### 암묵 가정 2 — "Dense subnetwork 는 *일시적 외우기*" 다
- 본 논문은 dense → sparse 의 *교체* 를 묘사하지만, dense subnetwork 가 (a) 학습 후에 사라지는지 (b) sparse subnetwork 등장 후에도 *남아있지만 logit 에 기여 못 하는지* 의 미세 차이는 본문 PDF 미확인.
- **반박 가능성**: dense subnetwork 를 명시적으로 마스킹한 forward 의 acc 가 post-grokking 에서 chance 수준이면 (b), 0 이면 (a). 두 시나리오에서 lottery-ticket retrain 가능성이 달라짐.

### 암묵 가정 3 — Sparse parity 의 결과가 *grokking 일반* 의 representative
- 본 논문은 sparse parity 한 task 만 다룸. modular addition (Nanda 2023), 더 큰 algorithmic task, language 의 grokking (Liu 2022 Effective) 에서 같은 회로 경쟁이 일어나는지는 *암묵 일반화*.
- **반박 가능성**: modular addition 에서 Nanda 의 Fourier circuit 등장 *전* 의 dense 회로가 본 논문의 dense subnetwork 와 같은 *기능적 profile* (norm dynamics, faithfulness curve) 을 보이는지 측정.

### 암묵 가정 4 — Hinge loss + SGD + weight decay 의 *조합* 이 phenomenon 의 *원인* 이 아닌 *광학*
- 본 논문은 이 setup 을 "결과를 깨끗이 보이게" 한다는 의미로 (저자 설계 의도 추정) 채택. 하지만 이 setup 자체가 phenomenon 을 *유발* 한다면 다른 setup 에서는 결과가 다를 수 있음.
- **반박 가능성**: cross-entropy + Adam + weight_decay=0 의 setup 에서도 sparse subnetwork 가 자연 발생하는지 측정. 만약 안 된다면 본 논문의 결론은 *setup-conditional*.

### 암묵 가정 5 — Width 1000 의 over-parameterization 이 sparse 발견의 *전제*
- width 가 ground-truth ($\sim 6$ ~ $8$) 의 100 배 이상이므로 lottery-ticket 식 *winning subnetwork* 가 무수히 많은 random init 으로 존재 → 학습이 그 중 하나를 골라잡음. 만약 width = 10 (ground-truth 와 비슷) 이면 *모든* 뉴런이 필요하고 sparse-dense 분리 자체가 정의 안 됨.
- **반박 가능성**: width sweep 으로 phase transition 의 sharpness 와 sparse subnetwork 크기의 관계 측정.

---

## 3) 반박 가능한 지점 (각 한 단락)

### 반박 1 — "Sparse subnetwork 발견" 은 norm-ranking 의 artefact 일 수 있다

**주장**: 본 논문의 sparse subnetwork 가 정말로 *기능적 회로* 인지, 아니면 norm-ranking 이라는 *특정 lens* 가 만들어 낸 *artifact* 인지 불분명. 다른 ranking (예: gradient × activation, output Jacobian magnitude) 으로 보면 다른 subnetwork 가 등장할 수 있고, 그 둘이 *교집합* 인지 아닌지가 회로의 *robustness* 의 기준.

**실험 검증**: 같은 학습 끝 모델에 대해 5 종 ranking (norm, |grad|×|activation|, output Jacobian, Shapley sampling, NTK alignment) 을 적용하여 각 ranking 의 top-$k^\star$ 들의 *교집합 비율* 측정. 60% 이상 교집합이면 회로가 robust, 30% 이하면 artefact 우려.

### 반박 2 — Phase transition 의 *원인* 은 노름 동학 *밖* 일 수 있다

**주장**: 노름 양극화는 phase transition 의 *동반 현상* 이지 *원인* 이 아닐 수 있다. 진짜 원인은 input representation 의 implicit feature learning, 또는 hessian eigenvalue 의 정렬 (NTK→feature-learning 전환) 일 수 있고, 노름 동학은 그 결과의 한 그림자.

**실험 검증**: 노름을 인위적으로 개입 — phase transition 직전에 sparse 후보 뉴런의 노름을 강제로 고정 (또는 dense 뉴런의 노름을 강제로 유지) 하고 학습 계속. 만약 phase transition 이 *예정대로* 일어나면 노름 동학은 그림자. 만약 *시점이 이동* 하거나 *안 일어나면* 노름 동학이 원인.

### 반박 3 — DNF 구조의 "닮음" 이 misleading 할 수 있다

**주장**: 본 논문이 "sparse subnetwork ≈ DNF" 라고 묘사하는데, 학습된 weight 가 정확한 ±1 격자 위에 있지 않고 *근사* 인 경우 — DNF 가 아닌 다른 boolean circuit (예: linear threshold 의 합, polynomial threshold) 의 *기능 동치* 일 수 있음. "DNF 닮음" 은 *해석자* 의 lens 일 뿐 *모델 본래의 구조* 가 아닐 가능성.

**실험 검증**: 학습된 sparse subnetwork 의 hidden activation 을 *진리표 (truth table)* 의 8 패턴 (3-bit) 또는 32 패턴 (5-bit) 으로 enumerate 하여 *어떤 boolean function* 을 표현하는지 분석. DNF 라면 각 뉴런이 *정확한* AND-term 을 표현해야 함. 다른 구조라면 nuance.

### 반박 4 — Workshop 단편의 일반성 부족

**주장**: 본 논문은 4-page workshop paper 로 추정 (본문 PDF 미확인 — 워크샵 페이퍼는 통상 4 page). single task / single architecture / single loss / single optimizer 라는 *너무 좁은 substrate*. 다른 grokking task (modular addition, sparse mod-mul) 에 적용 시 결론이 보존되는지의 외부 검증 부재.

**실험 검증**: 같은 4 종 측정 (norm time series, sparsity, $k^\star$, faithfulness) 을 (a) modular addition + transformer (Nanda 2023 setup), (b) sparse parity + transformer (architecture 일반화), (c) sparse mod-mul + MLP (task 일반화) 에 각각 적용하여 두 회로 경쟁이 *질적으로* 보존되는지.

### 반박 5 — Lottery ticket 가설과의 차별성 입증 부족

**주장**: 본 논문의 sparse subnetwork 가 Frankle-Carbin 2019 의 lottery ticket 과 *어떻게 다른가* 의 정량 비교가 약함. 만약 본 논문의 sparse subnetwork 가 *학습 초기* 의 random init 으로부터 retrain 해도 grokking 까지 도달하는 *winning ticket* 과 같다면, 본 논문의 contribution 은 lottery ticket 의 *시간적 동학* 관찰일 뿐 새 mechanism 발견은 아닐 수 있음.

**실험 검증**: 학습 끝의 sparse subnetwork 인덱스를 추출 → 그 인덱스만 활성화한 새 모델을 *처음부터* train → phase transition 이 *더 빨리* 발생하면 lottery 가설 강화, *같은 epoch* 에 발생하면 본 논문의 mechanism 이 *시간적* 으로도 본질.

---

## 4) 재현성 평가

| 항목 | 상태 |
|------|------|
| **코드 공개** | ✅ `github.com/Tsili42/parity-nn` — minimal 3 file (parity.py / utils.py / README.md). MIT-스러운 minimal repo. |
| **단일 명령 재현** | ✅ `python parity.py --train --ind-norms --global-sparsity --subnetworks --faithfulness` |
| **하이퍼파라미터 명시** | ✅ argparse 디폴트 verbatim (`n=40, k=3, N=1000, B=32, epochs=300, lr=0.1, weight_decay=0.01, width=1000, n_seeds=5, sparsity_sampling=10`) |
| **랜덤 seed 통제** | ✅ `parity()` 함수에 `seed=42` default + `n_seeds=5` for 평균 |
| **데이터 공개** | ✅ 합성 데이터, 코드로 즉시 생성 |
| **수식 / 정리 명시** | ❌ 본문 PDF 미확인 → 정리·증명 단계의 정확성은 검증 불가 |
| **결과 절대 수치 명시** | ❌ 본문 표·그림의 절대 수치 본 환경에서 검증 불가 (phase transition epoch, faithfulness 곡선의 정확한 좌표, 최종 $k^\star$ 의 정확한 값 등) |
| **분산 보고** | ⚠️ 5-seed 평균/표준편차 utility 함수 (`mean_and_std_across_seeds`) 존재 → 보고했을 가능성 높으나 정확한 보고 형식은 본문 PDF 필요 |
| **Ablation 범위** | ⚠️ 코드는 다양한 ablation 가능하지만 본 논문이 본문에서 어디까지 보고했는지는 본문 PDF 필요 |

→ **결론**: code-level 재현은 *single-command level* 로 매우 쉬움. 단 본문 표의 *절대 수치* 와 *통계적 유의성* 은 본문 PDF 확보 후에만 정량 비교 가능. workshop paper 의 짧은 길이를 고려할 때, *질적 결론* 의 재현은 100% 보장.

---

## 5) 한계 요약 (한 단락)

본 논문은 **single task × single architecture × single loss × single optimizer** 의 *minimal substrate* 에서 *질적으로 명료한* 결과를 보고한다. 이 minimal 성이 결과의 *해석 명료성* 의 원천이자 *일반성 주장* 의 한계. 회로 경쟁 view 의 *수학적* 형식 (예: 일반 정리, scaling law) 은 본 논문이 약속하지 않음 — 후속 작업의 몫. 본 환경에서 본문 PDF 미확인이므로 본 논문의 절대 수치·정리 본문 진술·appendix 상세 실험은 단정 안 함 — 단정 가능한 것은 *질적 mechanism* (sparse vs dense 경쟁, norm bimodality, DNF 닮은 sparse subnetwork) 뿐.
