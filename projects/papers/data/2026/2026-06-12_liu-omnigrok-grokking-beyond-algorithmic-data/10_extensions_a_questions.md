# 10 · 사고 확장 ① — 자문 질문 5개

## Q1 — Goldilocks zone 의 *폭* 은 무엇이 결정하는가?

본 논문은 zone 의 *중심 $w_c$* 와 *존재* 를 강조하지만, *폭 (width)* 의 결정 인자 — 데이터 복잡도, 모델 capacity, optimizer noise, 그리고 architecture 의 normalization 구조 — 에 대한 명시적 분석은 추정상 부족. 이 폭이 좁아질수록 grokking 의 induce 가 어렵고 (예: IMDb 의 weak signal), 넓어질수록 robust 한 generalization. *왜 이 질문이 중요한가*: 사용자의 TS track 에서 *regime shift 가 zone 폭을 좁히는가 늘리는가* 가 핵심 가설로 직결. 또 reviewer 가 "왜 IMDb 에서 약하냐" 를 물을 때 폭 가설로 답하는 게 가장 정직.

## Q2 — Direction stationary 가정이 modern transformer 에서 정확히 어떻게 깨지는가?

LU mechanism 의 1D 환원은 angular dynamics 의 fast convergence 에 의존. Layer norm + residual + RoPE 가 결합된 modern transformer 에서는 angular 자유도가 학습 후반까지 계속 활성. 이 setting 에서 LU 가 (a) 그대로 작동, (b) *복수의 1D dynamics* 로 분리 (layer-wise), (c) 2D landscape 로 보강 필요, (d) 완전히 깨짐 — 4 가지 시나리오 중 어떤 게 맞는지 정밀 측정 필요. *왜 중요한가*: 사용자의 TS Transformer track 의 model 이 modern transformer + RoPE 라면 본 논문의 직접 적용 가능성이 이 질문의 답에 달림.

## Q3 — Reduced landscape 의 *path-dependence* 가 grokking 시점을 얼마나 결정하는가?

Sphere-projected reduced landscape 는 *static* 그림. 실제 GD trajectory 는 그 정적 landscape 의 모든 $r$ 을 균등하게 안 본다 — *특정 path* 만. 같은 LU shape 이라도 init 방향에 따라 trajectory 가 zone 을 *지나치거나 진입하거나* 가 달라질 수 있다. *왜 중요한가*: 본 논문이 *정성 관계* ($\gamma^{-1}$) 만 단정하고 *정확한 시점 예측* 을 미루는 이유가 trajectory dependence 때문일 가능성. 이게 맞다면 후속 연구는 *trajectory-aware LU* 가 필요.

## Q4 — *Multi-task / continual* setting 에서 Goldilocks zone 이 어떻게 변하는가?

본 논문은 단일 task 의 단일 training 만 다룸. Continual learning (Lyle et al. 2025 의 영역) 에서는 task 가 바뀔 때마다 zone 위치가 바뀌고, 이전 task 의 weight 가 다음 zone 으로 옮겨지는 비용이 *catastrophic forgetting* 의 새로운 정의가 된다. *왜 중요한가*: Lyle 2025 (이미 본 레포 커버) 와 Omnigrok 을 한 줄로 통합하는 후속 작업이 자연스럽고, 사용자의 TS regime-shift 가설과도 직결.

## Q5 — *Inverse engineering 가능성* — $w_c$ 를 사전 예측할 수 있는가?

LU mechanism 의 *enabling claim* 은 "$w_c$ 가 데이터 + 모델로부터 정해진다". 정해지는 메커니즘이 명확하다면 *학습 전에 $w_c$ 를 계산* 해서 init 을 그 zone 안으로 직접 보낼 수 있다. 그러면 grokking delay 자체가 사라진다 (instant generalization). 이게 *실용적* 으로 가능한지 — Goldilocks zone 에 직접 init 하는 *grokking-free training* recipe — 가 본 가설의 가장 흥미로운 직접 결과. *왜 중요한가*: 만약 가능하다면 본 논문의 contribution 이 *이해* 에서 *실용* 으로 격상되고, 사용자가 TS forecasting 에서 *grokking-free init* 을 제안하면 NeurIPS-grade 별도 contribution.
