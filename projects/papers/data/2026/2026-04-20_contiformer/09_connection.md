# 8. 내 연구와의 연결

이 섹션은 `_profile.md`의 Paper 1~4 각각에 대해 "이 논문이 무엇을 주는가 / 무엇을 막는가 / 어떻게 인용할 것인가"를 구체적으로 매핑한다. 일반론을 피하고 실제 드래프트 섹션과 문장 단위로 연결한다.

---

## 8.1 Paper 1 — *When Multiplicative Conditioning Fails* 와의 연결

### 포지셔닝

Paper 1의 축은 `concat_a` (input-space) vs `tau_rope` (coordinate-space) vs `static` 세 가지 conditioning space 비교. ContiFormer는 이 축에 **"dynamics-space conditioning"** 이라는 네 번째 점을 제공한다. 즉 "시장 상태"를 입력에 넣지도, 좌표에 넣지도 않고 **ODE vector field의 구동에** 넣는 셈.

### 흡수할 기법

- **OdeLinear의 projection 분할 패턴**: Query는 interpolation, Key/Value는 ODE. 이 비대칭은 Paper 1의 baseline에서 "어떤 path에 conditioning을 주입할 것인가"라는 질문의 **새로운 자유도**가 된다.
- **구간별 re-initialization 구조**: 각 관측 시점에서 Key·Value를 새로 초기화하는 "reset + flow" 구조는 regime switch를 반영하는 조건화에 응용 가능.

### 충돌/경쟁 지점

- ContiFormer는 "conditioning 없음 (unconditional)" baseline이다. Paper 1이 주장하는 "conditioning space의 trade-off"가 유효하려면, **ContiFormer + conditioning** 버전과 비교가 필요. Paper 1에 *conditional ContiFormer*를 간단 ablation으로 추가하는 것이 좋은 수비선.

### 인용 포인트

- **Related Work 섹션**: "Recent work (Chen et al., 2023) generalized Transformer attention to continuous time via Neural ODE, but did not address how exogenous market-state conditioning should be injected in this continuous-time setting. Our paper fills that gap ..."
- **Discussion**: "Unlike ContiFormer, which operates on a single clock time, our formulation explicitly isolates the conditioning channel, making the multiplicative-failure analysis tractable."

### 반면교사

- **Hyperparameter 의존성**: ContiFormer가 데이터셋별 조합을 크게 흔든다는 점은 Paper 1이 "동일 hyperparameter 예산"을 엄격히 유지해야 한다는 경고. 하지 않으면 reviewer로부터 "너도 cherry-pick 아니냐"는 공격을 받기 쉽다.

---

## 8.2 Paper 2 — *Representation Utility Gap* 와의 연결

### 포지셔닝

Paper 2는 "같은 representation이 ranking 지표(Spearman/IC)와 absolute 지표(MSE/MAE) 중 어디에 유리한가"라는 축에서 conditioning space의 trade-off를 진단. ContiFormer의 representation은 **연속 함수 공간**이라는 독특한 성질을 가지며, 이로 인해 ranking vs absolute의 gap이 이산 Transformer와 다르게 나타날 가능성 농후.

### 흡수할 기법

- **Latent path visualization 방법**: 함수 공간 representation의 구조를 시각화하는 방식(spiral reconstruction figure 스타일)을 Paper 2의 "ranking 우수하지만 absolute 나쁨"의 기전을 보여주는 시각화에 차용.
- **Interpolation 기반 평가 프로토콜**: 임의 시각에서 Key/Value를 평가하는 관점은 "test-time prediction horizon을 연속으로 이동시키며 ranking vs absolute curve"를 그리는 실험 디자인의 근거.

### 충돌/경쟁 지점

- 만약 ContiFormer가 **ranking 우수 / absolute 평범** 패턴을 보인다면 Paper 2의 "conditioning space가 원인" 주장이 혼동될 수 있음 (연속시간 자체가 원인일 수 있으므로). → Paper 2 실험에서 ContiFormer는 **대조군으로 반드시 포함**, conditioning space 축과 교차 분석 필요.

### 인용 포인트

- **Methodology**: "To isolate the conditioning-space effect from the continuous-time effect, we also evaluate a ContiFormer variant under matched conditioning."
- **Results discussion**: ContiFormer의 ranking-absolute profile을 표준 참조점으로.

### 반면교사

- ContiFormer의 평가가 "단일 지표에 편중" (accuracy 또는 log-likelihood)이라는 점. Paper 2는 두 지표를 의도적으로 분리 평가하는 설계 자체가 기여이므로 **이 단일지표 관행을 비판적으로 인용**.

---

## 8.3 Paper 3 — *TTPA* 와의 연결

### 포지셔닝

TTPA는 (이름에서 짐작하건대) Temporal/Time-aware point-process 또는 attention 기반 방법. ContiFormer §4.3이 TPP 응용이므로 **직접 베이스라인**.

### 흡수할 기법

- **Intensity 계산에서 구간별 ODE + attention 결합 구조**: TTPA가 기존 THP·SAHP 라인에서 새로 제공해야 하는 것이 무엇인지 selection의 기준선.
- **Neonate / BookOrder / StackOverflow 등 표준 TPP 벤치마크 세팅**: TTPA의 실험 테이블도 같은 데이터셋을 공유해야 비교 가능.

### 충돌/경쟁 지점

- 만약 TTPA가 "attention + time encoding"의 방향을 취한다면, ContiFormer와의 **차별화 포인트를 명시적으로 설계**해야 함. 예:
  - TTPA는 `tau_rope` 기반 time encoding으로 **좌표 공간 조건화 + 이산 attention** 선택 → "연속 latent가 필요 없는" 주장 가능.
  - 이 경우 Paper 3에서 "ContiFormer가 가진 연속 latent representation은 TPP의 intensity 모델링에서 실제로 marginal에 그친다"는 반론이 가능.

### 인용 포인트

- **Related Work / Baseline**: "We compare against ContiFormer (Chen et al., 2023), the current strongest continuous-time attention baseline for TPP."
- **Appendix ablation**: ContiFormer의 hyperparameter dataset-dependence를 교훈으로, TTPA는 단일 hyperparameter로도 안정적임을 강조.

### 반면교사

- TPP 평가에서 데이터셋별 hyperparameter tuning을 매번 새로 하는 관행 → TTPA는 이걸 하지 말고 robust baseline으로 자리 잡도록 설계.

---

## 8.4 Paper 4 — *Continuous Economic Time Attention* 와의 연결 (**최중요**)

### 포지셔닝

Paper 4는 **ContiFormer를 직접 대체·확장**하는 논문이 된다. 공격 각도는 두 가지:

1. **시간 변수 $t$의 의미 전환**: clock time → economic time $\tau$.
2. **ContiFormer의 암묵적 가정 (결정론적 연속 dynamics, 활동도 균일)이 금융에서 깨지는 구체 증거** 제공.

### 흡수할 기법

- **OdeLinear / InterpLinear 구조**: Paper 4의 base architecture를 그대로 차용하되, 모든 ODE integration을 $dt \to d\tau$로 치환. 구현상은 `torchdiffeq`의 시간 argument에 $\tau(t)$의 discrete sampling을 feed.
- **Theorem 4.1/4.2의 서술 패턴**: "subordinated ContiFormer는 ContiFormer를 $\tau = t$로 특수화할 때 복원된다"는 유사 정리를 한 줄로 세워 포함관계 증명. 이는 reviewer에게 "왜 새 모델이냐"를 방어하는 표준 수.
- **Spiral visualization**: 나의 Paper 4에서도 synthetic test로 "clock time spiral vs volume-clock spiral"을 만들어 ContiFormer(clock) vs Subordinated ContiFormer(volume clock) 대조 figure를 제작. reviewer에게 가장 쉽게 읽히는 증명.

### 충돌/경쟁 지점

- ContiFormer는 "시간 축이 무엇이어야 하는가"를 일절 문제 삼지 않는다. 이것이 Paper 4의 방어선이자 Paper 4가 정의되는 이유. 충돌은 없으며 **보완 관계**다.
- 다만 reviewer가 "그냥 $\tau$를 입력 feature로 넣으면 ContiFormer로 충분하지 않나?"라고 물을 위험 있음. 이에 대한 선제 방어:
  - Input feature로서의 $\tau$는 scalar feature. ODE의 **독립 변수**로서의 $\tau$는 전체 dynamics의 timekeeper. 두 역할은 **identifiability 관점에서 다르다** (같은 모델에 두 경로로 $\tau$가 들어가면 representation collapse 또는 redundancy).
  - 이 방어선을 Paper 4 §3에 명시적으로 배치.

### 인용 포인트 (문장 초안)

> "ContiFormer (Chen et al., 2023) demonstrated that continuous-time attention over ODE-driven Key/Value paths improves irregular time-series modeling. However, their framework treats the time variable as wall-clock time and is silent on the choice of time parameterization. In financial time series, where the information arrival rate is heterogeneous (Clark, 1973), clock time is known to be a suboptimal index for aggregating market dynamics. We extend ContiFormer by replacing the time variable with economic time $\tau(t)$, which induces a time-changed latent ODE ..."

> "Our architecture reduces to ContiFormer when $\tau(t) = t$, and reduces further to Transformer when the vector field vanishes (Chen et al., 2023, Theorem 4.1)."

### 반면교사

- ContiFormer가 **hyperparameter 민감성**을 반면교사로: Paper 4에서는 `tmax`, `step_size` 등이 $\tau$의 스케일과 혼동되지 않도록 **재정규화 프로토콜**을 명시. $\tau$가 학습 가능해지면 scale drift가 발생할 수 있으므로 normalization block 필요.
- ContiFormer의 **금융 데이터 부재**를 교훈으로: Paper 4는 최소 2개 금융 데이터셋 (tick-level + 분봉) + 최소 1개 non-financial (대조용)를 확보. 이 조합이 있어야 "경제시간의 효과가 특수하다"는 주장이 경험적으로 완결.
- ContiFormer의 **효율성 문제**를 교훈으로: Paper 4에서는 ODE solver step을 $\tau$ 스케일에 맞춰 **adaptive**로 돌려 실제 벽시계 시간 기준 비용 감소 가능성 시연.

### Paper 4 실험 설계 체크리스트 (이 논문을 참고해 바로 뽑아낼 수 있는 것)

- [ ] Spiral toy: "volume clock에서만 원형이 되는 궤적"을 합성, clock-time ContiFormer vs economic-time 버전 비교.
- [ ] Tick-level 금융 데이터: 다음 가격 이동 방향 분류 + 다음 이벤트 시각 회귀.
- [ ] Ablation: $\tau(t) = t$ (ContiFormer 복원) vs $\tau(t) = \int \sigma^2$ (volatility clock) vs $\tau(t) = N(t)$ (trade count) vs $\tau(t) = V(t)$ (volume).
- [ ] Robustness: mask_ratio 실험을 그대로 승계하여 irregular sampling 강건성이 subordination 하에서도 유지되는지.

---

## 8.5 통합 정리

ContiFormer는 내 연구의 **기준점이자 공격 대상**이다. Paper 1·2·3에서는 baseline으로, Paper 4에서는 **직접적 선행**으로 인용된다. 따라서 이 해체는 단발성이 아니라 **4편의 드래프트에 네 번 참조**될 기초 자산이다. 특히 Paper 4는 이 논문 없이는 동기 자체가 성립하지 않으므로, 오늘 이 해체를 먼저 끝내둔 것이 본 프로젝트의 논리적 선후 순서에 정확히 맞는다.
