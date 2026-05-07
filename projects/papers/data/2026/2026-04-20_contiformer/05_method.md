# 4. 방법론 해부

## 4.1 전체 블록 다이어그램

```
입력:  S = {(t_i, x_i)}_{i=1..N},  쿼리 시각 t ∈ [0, T]

(a) Interpolation:   X(t) = Interp({t_i, x_i})         # linear / cubic / rectilinear
(b) Query path:      q(t) = InterpLinear(X)(t)        # interpolation → linear proj
(c) Key path:        k_i(t) = ODESolve(k_0=W_K x_i, f_K, (t_{i-1}, t_i])
(d) Value path:      v_i(t) = ODESolve(v_0=W_V x_i, f_V, (t_{i-1}, t_i])
(e) Attention:       Attn(t) = softmax_i(⟨q(t), k_i(t_i)⟩/√d) · v_i(t_i)
                    (또는 쿼리 시각 t가 구간 (t_{i-1}, t_i] 사이면 k_i(t),v_i(t) 평가)
(f) FFN + residual + LN → encoder layer 출력 z(t)
```

저자 구현(`physiopro/network/contiformer.py`, `multiheadattention.py`)에 따르면:

- `InterpLinear`: `torchcde`의 linear interpolation 후 `nn.Linear` 통과. Query projection에 사용.
- `OdeLinear`: 초기값 $W_K x_i$ 또는 $W_V x_i$에서 출발해 torchdiffeq의 `odeint` (RK4 기본)로 구간 적분. Key·Value projection에 사용.
- `layer_type_ode`: `concat`, `concatnorm`, `add` 중 선택. vector field가 $(z, t)$를 concat하는지, norm을 끼는지.
- `actfn_ode`: `sigmoid` 또는 `tanh` — 저자는 **태스크별로 이 선택이 결과를 크게 바꾼다**고 어펜딕스에 명시 (`README.md`의 TPP 명령에서 데이터셋마다 다름이 그 증거).

## 4.2 핵심 수식 해부

### (1) 연속시간 Key·Value의 ODE 정의

구간 $[t_{i-1}, t_i]$에서:

$$
\frac{d \mathbf{k}_i(t)}{dt} = f_\theta^K\!\big(\mathbf{k}_i(t), t\big), \quad \mathbf{k}_i(t_{i-1}) = W_K \mathbf{x}_{i-1}
$$

- **기호**: $W_K \in \mathbb{R}^{d_k \times d}$, $f_\theta^K$는 MLP (hidden 차원 $d_{\text{hid}}$).
- **직관**: 이전 관측이 "초깃값"이 되어 ODE로 구간을 흐르다가 다음 관측 시점에서 새로운 초깃값으로 "리셋"되는 hybrid dynamical system. 피아노의 페달을 떼고 누르는 구조와 유사.
- **왜 이 형태**: 이산 관측 사이에서 "적절한 매끄러운 보간" 을 학습 가능한 형태로 제공하는 가장 간단한 선택. Neural ODE 문헌의 표준.
- **대안**: (i) Neural CDE처럼 입력 경로 $X(t)$를 driving path로 넣는 $d\mathbf{z} = f(\mathbf{z})\, dX(t)$ — 더 우아하지만 vector field 차원이 커짐. (ii) 전체 구간 하나로 통합된 Neural ODE — 각 관측에서 "reset"하는 구조를 잃음.

### (2) Query의 InterpLinear

$$
\mathbf{q}(t) = W_Q \cdot \text{Interp}\big(\{(t_i, \mathbf{x}_i)\}\big)(t)
$$

- **비대칭의 이유**: Query는 "임의 $t$에서의 질의"로서 *순간*을 표현한다. dynamics를 붙이면 "질의 자체가 과거를 얼마나 돌아보는지"를 학습해야 해서 identifiability 문제 발생 — 이 비대칭이 저자 설계 핵심.
- **비판적 시각**: 질의도 "관측 드문 구간"에서는 interpolation으로 정보 손실. 본질적으로 irregular sampling에 대한 robust 설계가 **Key·Value 쪽에만** 적용된다.

### (3) 연속시간 Scaled Dot-Product Attention

$$
\mathrm{Attn}(t;\mathcal{S}) = \sum_{i=1}^{N} \alpha_i(t)\, \mathbf{v}_i(\tilde t_i), \quad \alpha_i(t) = \frac{\exp\!\big(\langle \mathbf{q}(t), \mathbf{k}_i(\tilde t_i)\rangle/\sqrt{d_k}\big)}{\sum_{j} \exp\!\big(\langle \mathbf{q}(t), \mathbf{k}_j(\tilde t_j)\rangle/\sqrt{d_k}\big)}
$$

여기서 $\tilde t_i$는:
- causal 모드: $\tilde t_i = \min(t, t_i)$ (미래 누수 금지)
- full 모드: $\tilde t_i = t_i$ (bidirectional)

- **직관**: Key·Value를 "각 관측이 책임지는 구간"에서 평가하되, 그 구간이 쿼리 시각 $t$까지 "흘러온" 시점까지로 cutoff. softmax는 여전히 $i$에 대한 discrete sum — **연속적인 것은 값의 계산, 인덱싱은 이산**.
- **왜 이 형태**: 완전 연속 (double integral) 형태는 계산적으로 과해지고, pure discrete는 기존 Transformer와 동일해짐. 이 "semi-continuous" 절충이 실용적 중간점.
- **대안적 비판**: softmax 자체를 time-kernel로 바꾸는 선택도 가능했다 (e.g., $\alpha_i(t) \propto K_\sigma(t - t_i) \cdot \exp(\dots)$). 저자는 이 옵션을 논의하지 않는다. Paper 4의 경제시간 도입은 이 지점에서 $(t - t_i)$를 $(\tau(t) - \tau(t_i))$로 대체하는 것이 자연스러운 수술.

### (4) Theorem 4.1 (Transformer 포함)

$f_\theta^K, f_\theta^V$ 모두 0이면 각 구간에서 Key·Value가 상수. $\tilde t_i = t_i$로 두면

$$
\mathrm{Attn}(t) = \sum_i \mathrm{softmax}\!\Big(\frac{W_Q \mathbf{x}^*_t \cdot W_K \mathbf{x}_i}{\sqrt{d_k}}\Big) W_V \mathbf{x}_i
$$

where $\mathbf{x}^*_t$은 쿼리 시점의 interpolated 입력. 쿼리 시각들이 관측 시각과 일치하면 그대로 표준 self-attention.

### (5) Theorem 4.2 (Neural ODE 포함)

multi-head를 head 1개, softmax를 identity ($\alpha_i = 1/N$ 또는 one-hot)로 두고 단일 token만 propagate하면 Neural ODE forward와 동치.

> **비판 포인트**: 두 정리 모두 "특수 파라미터 설정에서 구조적으로 일치"를 말한다. 학습 가능성은 보장하지 않는다. Theorem이 정말 쓸모가 있으려면 "학습 후에 해당 특수해로 수렴 가능하다"는 **optimization statement**가 필요한데, 본 논문은 그 단계를 건너뛴다.

## 4.3 의사코드 (간소화)

```python
def contiformer_forward(t_query, t_obs, x_obs, theta):
    # t_obs: [N], x_obs: [N, d], t_query: scalar or [M]
    X = linear_interpolate(t_obs, x_obs)                # torchcde
    q = LinearQ(X(t_query))                             # [M, d_k]

    k_segments, v_segments = [], []
    for i in range(N):
        k0 = W_K @ x_obs[i]
        v0 = W_V @ x_obs[i]
        k_i_path = odeint(f_K_theta, k0, [t_obs[i-1], t_obs[i]])   # piece-wise
        v_i_path = odeint(f_V_theta, v0, [t_obs[i-1], t_obs[i]])
        k_segments.append(k_i_path[-1])                # endpoint 표본
        v_segments.append(v_i_path[-1])

    K = stack(k_segments)                               # [N, d_k]
    V = stack(v_segments)                               # [N, d_v]
    scores = q @ K.T / sqrt(d_k)                        # [M, N]
    if causal:
        scores = apply_causal_mask(scores, t_query, t_obs)
    alpha = softmax(scores, dim=-1)
    out = alpha @ V                                     # [M, d_v]
    return FFN(out) + residual
```

## 4.4 구현 디테일·숨은 트릭

- **Positional encoding 선택권**: `add_pe=true/false`가 데이터셋마다 다름. TPP 실험에서 synthetic·mimic·stackoverflow는 false, bookorder는 true. → **"시간을 dynamics에 넣었으니 PE는 불필요"라는 이론과, 실제로 PE를 켜야 더 잘 되는 현실 사이의 긴장**. 저자는 침묵.
- **Normalize before vs after**: pre-LN vs post-LN 선택도 태스크별. pre-LN이 deep stacking에 유리한 건 ViT·GPT와 동일.
- **`step_size`와 `tmax`**: ODE solver의 step 크기와 적분 상한. 데이터셋별로 `tmax ∈ {5,10,20,70}`, `step_size ∈ {20, 100}`. 이 조합이 **실제 성능의 상당 부분을 결정**한다. 튜닝 민감성 높음.
- **`actfn_ode` 선택**: `sigmoid` vs `tanh`. 이는 ODE vector field의 포화 성질 결정. `sigmoid`는 $\in (0,1)$이라 양의 drift 중심, `tanh`는 $\in (-1,1)$로 중심 대칭. 태스크 dynamics 대칭성에 따라 다름.
- **`adjoint=1`**: torchdiffeq의 adjoint backward 사용. 메모리 절약하지만 attention의 non-local gradient 때문에 일부 backward는 vanilla backprop.
- **Seed 3개 평균** (27, 42, 1024): 표준 관행. 분산 보고가 들쑥날쑥하다는 비판을 방어하는 최소 장치.

## 4.5 "논문이 한 줄로 말하면 되는데 안 한 것"

이 방법을 한 식으로 쓰면:

$$
\boxed{\;\mathrm{ContiFormer}(t) = \mathrm{Softmax}\!\Big(\frac{\mathbf{q}(t)\,\mathbf{K}(\cdot)^{\top}}{\sqrt{d_k}}\Big)\mathbf{V}(\cdot), \quad \mathbf{K}, \mathbf{V} \in C([0,T]; \mathbb{R}^d) \;\text{s.t.}\; d\mathbf{K}/dt = f_K, \;d\mathbf{V}/dt = f_V\;}
$$

이 한 식이 논문의 영혼이다. 단순 확장이지만, "Key·Value는 지금까지 이산 행렬이었다"는 통념을 **함수 공간**으로 올린 것이 본질적 전환. 이 전환을 **시간 $t$가 어떤 시계여야 하는지** 단계로 한 번 더 올리는 것이 Paper 4.
