# 3. 핵심 Claim 해체

논문의 주장은 4개로 압축된다. 각각 [주장 / 증거 / 전제] 형태로 해부하되, 전제가 흔들리는 지점을 끝에 표시한다.

---

## Claim 1 — "Attention은 연속시간에서 정의 가능하다"

- **주장**: 표준 scaled dot-product attention을 $t \in [0,T]$에 대한 함수 $\mathrm{Attn}(t)$로 일반화할 수 있다. 구체적으로:

$$
\mathrm{Attn}(t) \;=\; \sum_{i=1}^{N} \frac{\exp\!\big(\langle \mathbf{q}(t), \mathbf{k}(t_i)\rangle/\sqrt{d}\big)}{\sum_{j=1}^{N}\exp\!\big(\langle \mathbf{q}(t), \mathbf{k}(t_j)\rangle/\sqrt{d}\big)} \,\mathbf{v}(t_i)
$$

여기서 $\mathbf{k}(\cdot), \mathbf{v}(\cdot)$은 **ODE로 정의된 연속 함수**. 즉 임의 $t$에서 Key/Value를 "평가"할 수 있다.

- **증거**:
  1. §3.2 정의의 수학적 일관성 (적분·합 모두 유한).
  2. §4.1 spiral 실험에서 관측 시점 사이의 중간 시각에 대해 **smooth interpolation + extrapolation** 가능.
  3. Figure (spiral visualization): Neural ODE는 extrapolation이 붕괴하지만 ContiFormer는 회전 구조 유지.

- **전제**:
  - (a) ODE의 vector field $f_\theta$가 Lipschitz → 해의 유일성.
  - (b) latent dynamics가 **결정론적·연속**이다.
  - (c) 관측 노이즈가 independent · bounded.

- **흔들리는 지점**: 금융에서 (b) — 연속성 — 이 핵심 점프 위험으로 무너진다. Merton jump-diffusion이 서술하는 discontinuous path는 Neural SDE로 대체해야 한다.

---

## Claim 2 — "ContiFormer는 Transformer를 특수 경우로 포함한다"

- **주장**: Theorem 4.1 — Key·Value를 생성하는 ODE vector field를 $f_\theta \equiv 0$으로 두면, 각 구간의 Key·Value는 상수 함수가 되고, 정의식은 정확히 표준 Transformer self-attention과 일치한다.

- **증거**: 증명은 한 줄짜리. $f_\theta = 0 \Rightarrow \mathbf{k}(t) = \mathbf{k}(t_i)$ for $t \in (t_{i-1}, t_i]$, 즉 step 함수로 수렴 후 이산 attention과 동일.

- **전제**:
  - Query projection이 identity-equivalent로 환원 가능해야 함.
  - Positional encoding이 ContiFormer에도 동일하게 들어가야 함 (그렇지 않으면 Transformer의 위치 정보와 직접 비교 불가).

- **흔들리는 지점**:
  - "Transformer를 포함한다"는 주장은 **모델 표현력**의 초집합 관계를 의미하지만, **학습 가능성 관점**에서는 별 의미가 없다. $f_\theta \to 0$으로 학습되기 위한 gradient signal이 존재하는가? 실험적으로 이를 ablation하진 않는다.
  - RoPE·ALiBi·Relative PE 등 "이미 연속시간을 흉내내는" 변종 Transformer는 비교 대상에서 누락. 저자는 "표준" Transformer만 비교하므로, 이 claim의 스트레스 테스트가 약하다.

---

## Claim 3 — "ContiFormer는 Neural ODE도 특수 경우로 포함한다"

- **주장**: Theorem 4.2 — attention 연산을 bypass하고 Key·Value 경로 자체를 최종 representation으로 쓰면 Neural ODE의 forward와 구조적으로 동치.

- **증거**: 마찬가지로 한 줄 증명. multi-head를 head 1개로 축소하고 softmax를 identity로 바꾸면 ODE forward만 남음.

- **전제**:
  - "Neural ODE"의 정의가 단순 ODE forward라는 축소된 버전. 실제 Neural ODE 논문(Chen et al., 2018)의 adjoint backward도 포함한다고 볼지는 해석 여지.
  - encoder-decoder 대신 "latent propagation" 해석만 채택.

- **흔들리는 지점**:
  - 이 포함관계는 **구조적**이지 **기능적**이지 않다. Neural ODE의 강점 중 하나인 "memory-efficient adjoint backprop"은 ContiFormer에서 소실 (attention의 softmax가 non-local이라 adjoint 복원 난해).
  - 즉 "ContiFormer ⊃ NODE"는 학술적 그림은 깔끔하지만 실전에서는 **trade-off 없는 포함**이 아니다. 메모리·계산 비용이 두 자리 배수 증가.

---

## Claim 4 — "Irregular sampling 강건성과 extrapolation 우위"

- **주장**: 관측 드롭 비율(mask_ratio)을 증가시켜도 분류 정확도가 완만히 하락, extrapolation 오차가 baseline 대비 낮다. 태스크 3종 모두에서 best 또는 near-best.

- **증거**: §4.2 UEA 10+ 데이터셋 분류표 (mask_ratio=0.3,0.5,0.7), §4.3 TPP 6 데이터셋 log-likelihood/RMSE, §4.1 spiral MAE/RMSE 테이블.

- **전제**:
  - Baseline이 **같은 hyperparameter 탐색 예산**을 받았다. → README에 "all compared methods에 대해 hyperparameter search"라고만 적혀 있어 세부 파악 필요.
  - 모든 데이터셋에서 "연속 latent + Gaussian noise" 가정이 데이터 생성 과정에 가깝다.

- **흔들리는 지점**:
  - 데이터셋 선택 자체가 **confirmation bias** 가능: 연속 latent 가정이 맞는 도메인만 모아놓고 평가한 인상. 금융·jump-heavy 도메인 부재.
  - UEA 내부에서도 **EEG 계열이 과대표현** (Heartbeat, Neonate 등). 도메인 다양성 주장에 한계.

---

## Claim 간 상호 의존도

Claim 1이 무너지면 전부 무너진다. Claim 2·3은 "대표성·통합성" 서사에 기여하고 성능 주장의 **약속어음**이다. Claim 4가 실전 가치의 전부인데, 이 주장의 **적용 범위**가 논문 명시보다 더 좁다는 것이 내 결론: "연속 latent + 작은 irregular drop + 중간 길이(≤ 수백 step)" 범위에서는 강력. 이 범위 바깥(금융 jumps, 초장기, heavy tail)에서는 **경험적 확인이 없다**.

## 한 단계 더 — "이 논문이 주장하지 않은 것"

- 계산 비용 우위 주장 없음 (오히려 §D에서 Neural ODE보다 느림을 일부 인정).
- 이론적 convergence rate 주장 없음.
- Universal approximation 주장 없음 (Transformer·NODE 각각은 있지만 ContiFormer 고유의 정리는 없음).
- **시간 축 왜곡(time change)에 대한 고려 없음** — 이것이 Paper 4의 지렛대.
