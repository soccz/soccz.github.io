# 07 · 가정·한계·반박

## 명시된 가정 (abstract / 검색 카드에서 직접 확인)

1. **Grokking 의 정의**: train 100% 도달 후 한참 뒤에 test 가 generalize 하는 phase transition. 약한 signal 도 포함 — IMDb 의 *"weak grokking signal"* 자가 명시.
2. **weight norm 이 의미 있는 reduction axis**: reduced landscape 가 1D $\|w\|$ 함수로 잘 정의되고 의미 있다는 가정.
3. **Goldilocks zone 의 존재**: 데이터·모델에 대해 $w_c$ 가 *single value (또는 좁은 띠)* 로 잘 정의된다는 가정.

## 암묵적 가정 (말 안 했지만 깔려 있는 것)

1. **Direction stationary 가정**: weight norm 축으로 압축이 정당하려면 angular dynamics 가 학습 초반에 빠르게 stationary 가 되어야 한다. Batch norm, layer norm, residual connection 같은 normalization 이 있는 modern transformer 에서는 angular dynamics 가 계속 활성일 수 있어 이 가정이 깨질 가능성. 본 논문은 MLP / LSTM / GCNN / small transformer 등 *상대적으로 plain* 한 architecture 위주라 이 한계가 드러나지 않을 수 있음.
2. **Scale invariance 가정**: reduced landscape $\tilde L(r)$ 의 모양 (L · U) 이 data size, model size, learning rate 의 변화에서 *질적으로 같은 형태로 유지* 된다는 가정. 단, *위치 ($w_c$) 와 폭* 은 변할 수 있다고 봄. 이 가정은 본 논문이 5 도메인에서 같은 모양을 본 사실로 뒷받침되지만, 더 큰 modern model (예: GPT-class) 에서 검증된 바 없음.
3. **Single $w_c$ 가정**: Goldilocks zone 이 하나뿐인 좁은 spherical shell 이라는 가정. 다중 modular task (예: $(a+b) \bmod p$ + $(a \times b) \bmod p$ 동시 학습) 같은 multi-task 에서는 zone 이 *복수의 띠* 일 수 있고, 그러면 LU 가 LULU 같은 다중 골짜기로 변할 수 있음.
4. **Optimizer 일반성**: 정성 관계 grokking time $\propto \gamma^{-1}$ 가 SGD, Adam, AdamW 등 모든 optimizer 에서 같은 형태로 유지된다는 묵시적 가정. Thilak et al. (2023) Slingshot 가설은 Adam-specific 한 second-moment 효과를 강조 — 본 논문은 이 optimizer-specific 효과를 weight decay 의 effective $\gamma$ 로 흡수한다고 본 셈인데, 둘이 *정확히 같은 메커니즘인지* 는 별도 검증 필요.

## 반박 가능한 지점

### 반박 1 — Direction dynamics 가 무시 안 되는 경우

**주장**: LU mechanism 은 $\hat w$ (방향) 이 빠르게 stationary 된 후의 1D radial dynamics 만 본다. 그러나 modern transformer 의 *RoPE / ALiBi / normalization* 같은 mechanism 은 학습 도중에도 angular 자유도가 계속 활성. 이 setting 에선 LU schematic 이 깨지거나, 더 복잡한 *2D landscape* (radial + 한 개 dominant angular mode) 로 보강되어야 한다.

**실험 검증 방법**: APF (Attention Pattern Fields) 의 PE 비교 — 같은 task 에 NoPE / sinusoidal / RoPE / ALiBi 를 갈아 끼웠을 때, RoPE 가 grokking 시점의 *방향 변화* 가 다른 PE 와 정성적으로 다른지 측정. 만약 RoPE 에서 angular 변화가 크면 LU mechanism 의 *1D 가정* 이 RoPE 특이성으로 깨지는 셈.

### 반박 2 — Goldilocks zone 의 *얇음* 이 task 의존적

**주장**: LU 의 U 자 골짜기가 *얇으면 얇을수록* grokking 의 *대표성* (다양한 hyperparam 에서도 안정적으로 일어남) 이 떨어진다. MNIST/QM9 처럼 데이터가 *내재적으로 단순한 구조* 인 task 에서는 zone 이 두꺼워 grokking induction 이 쉽지만, IMDb 처럼 더 복잡한 sequence task 에서는 zone 이 얇아 induce 가 어렵다 (실제로 IMDb 의 "weak" signal 이 이 hypothesis 와 일치).

**실험 검증 방법**: 다양한 task complexity 에서 zone 폭을 정량 측정 (예: test loss U 자에서 $L_{\text{test}} < 2 \min(L_{\text{test}})$ 인 $r$ 구간의 길이). 이 폭이 task complexity 와 어떤 관계를 갖는지 sweep. 폭이 좁아질수록 (예: 0.1 의 dynamic range) grokking 이 어려워지면 본 가설의 *induce 가능성* 이 task-specific 임이 정량화됨.

### 반박 3 — LU 가 *경로 (path-dependent)* 가 아니라 *정적 (static)* landscape 만 본다

**주장**: 본 논문의 reduced landscape 는 *임의의 $r$ 에서 가능한 최적 $\hat w$* 를 가정한 *정적* 그림. 실제 GD trajectory 는 그 정적 landscape 의 모든 $r$ 을 균등하게 탐험하지 않고, *특정 path* 만 따라간다. 즉, 정적 LU 가 옳아도 *trajectory dependence* 때문에 grokking 의 *정확한 시점* 은 LU 가 직접 예측 안 함.

**실험 검증 방법**: 같은 task / 같은 LU shape 에서 *다른 initialization 방향* ($\hat w_0$) 을 sweep. 만약 trajectory 가 LU 의 1D 정적 dynamics 로 잘 근사되면 모든 init 방향이 비슷한 grokking time 을 가질 것. 만약 trajectory 의존이 크면 init 방향에 따라 grokking time 이 크게 흩어질 것 — 후자가 LU mechanism 의 한계.

## 재현성 평가

### 공개 / 미공개

- ✅ **코드 공개**: `github.com/KindXiaoming/Omnigrok`, Jupyter notebook 6 도메인. 65 stars 시점 기준 (변동 가능).
- ✅ **데이터**: MNIST / IMDb / QM9 / modular arithmetic 모두 공개 standard. 추가 데이터 없음.
- ⚠️ **License**: 본 환경에서 license 파일 직접 확인 안 됨. 재사용 시 저자 contact 권장.
- ❓ **Hyperparameter sweep**: 코드 내 정확한 grid 명시 여부는 노트북 raw 접근으로 확인 필요. 본 해체에서는 추정 수준.

### 본문에 안 나온 디테일 (추정)

- Multi-seed 통계의 분산 — single run figure 위주 추정.
- Larger architecture (modern transformer, ViT 등) 에서의 LU 확장.
- IMDb 의 "weak" signal 의 *정량 기준* — 어느 정도 갭이 있어야 grokking 으로 칠지의 정의.
- mnist-repr 의 representation 측정 metric 의 정확한 형태.

### 평균만 vs 분산도

본 환경 미접근으로 단정 안 함. 단, 정성 가설 (LU shape, $\gamma^{-1}$ 정성 관계) 위주 논문이라 분산 자체가 가설의 critical evidence 는 아닐 수 있음.

## 한 줄 요약

LU mechanism 은 단순함과 우아함을 무기로 grokking 의 *universal cause hypothesis* 를 제시하지만, (a) direction stationary 가정, (b) Goldilocks zone 폭의 task 의존성, (c) trajectory 의존성 — 이 셋 모두 modern large-scale model 로 옮길 때 보강이 필요한 약한 지점이다.
