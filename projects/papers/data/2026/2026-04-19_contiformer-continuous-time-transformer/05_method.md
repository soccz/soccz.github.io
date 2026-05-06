## 4. 방법론 해부

### 4.1 입력과 표기

비정규 시계열을 $\mathcal{X} = \{(t_i, x_i)\}_{i=1}^N$ 로 둔다 ($t_i \in [0,T]$, $x_i \in \mathbb{R}^{d_x}$). 일반 Transformer라면 $X \in \mathbb{R}^{N \times d}$ 로 임베딩한 뒤 self-attention을 돌리지만, ContiFormer는 모든 잠재 표현을 **시각의 함수**로 만든다.

### 4.2 1단계 — 토큰별 ODE 임베딩 (continuous embedding)

각 관측 $x_i$를 시점 $t_i$에서 시작하는 잠재 trajectory로 lift한다:

$$z_i(t) = z_i(t_i) + \int_{t_i}^{t} f_\theta\!\left(z_i(s),\, s\right) ds, \qquad z_i(t_i) = W_e x_i + b_e.$$

- **기호**: $f_\theta : \mathbb{R}^{d_h} \times \mathbb{R} \to \mathbb{R}^{d_h}$ 는 MLP로 파라미터화한 vector field. $W_e, b_e$ 는 입력 임베딩.
- **직관**: "관측이 없는 시각에도 토큰이 어떤 상태였을지" 미분방정식으로 외삽한다. 이산 토큰 $i$가 $t_i$를 중심으로 양방향 확장된 부드러운 곡선 $z_i(\cdot)$이 된다.
- **왜 이 형태**: Picard–Lindelöf 정리에 의해 Lipschitz $f_\theta$ 면 해의 존재·유일성 보장 → trajectory가 잘 정의됨. autograd-friendly한 `torchdiffeq`로 backprop 가능 (adjoint method 옵션).
- **대안**: spline interpolation (Neural CDE 식), GP posterior, attention 자체로 보간 (mTAND). ODE는 *parametric*하고 데이터 효율적이지만 NFE 비용이 든다.

### 4.3 2단계 — Q, K, V를 시간의 함수로

각 head $h$에 대해

$$q_i(t) = W_Q^{(h)} z_i(t), \quad k_i(t) = W_K^{(h)} z_i(t), \quad v_i(t) = W_V^{(h)} z_i(t).$$

여기가 핵심 — $W_Q, W_K, W_V$ 자체는 상수이지만 $z_i(t)$ 가 시간함수이므로 Q/K/V도 시간함수다.

### 4.4 3단계 — 연속시간 Attention

query 시각 $t$에서, attention score:

$$\alpha_{ij}(t) = \frac{\langle q_i(t), k_j(t) \rangle}{\sqrt{d_k}}, \qquad \hat\alpha_{ij}(t) = \frac{\exp(\alpha_{ij}(t))}{\sum_l \exp(\alpha_{il}(t))}.$$

CT-ATTN의 출력:

$$\text{CT-ATTN}_i(t) = \sum_{j=1}^N \hat\alpha_{ij}(t)\, v_j(t).$$

다중 헤드:

$$\text{CT-MHA}_i(t) = \mathrm{Concat}\big(\text{head}_1(t), \dots, \text{head}_H(t)\big)\, W^O.$$

- **직관**: vanilla attention이 행렬 $A_{ij}$ 한 장을 학습한다면, ContiFormer는 함수 시트 $\{A_{ij}(t)\}_{t \in [0,T]}$ 한 다발을 학습한다.
- **왜 이 형태**: query 시각 $t$가 인덱스 $i$와 분리됨으로써, 추론 시 임의 시각에 대한 평가가 가능. Self-attention의 "전체-대-전체" 구조를 보존하면서 시간이 attention의 **일급 변수**가 됨.
- **대안**: query만 시간함수 (mTAND), 시간을 positional bias로 더하기 (Time2Vec, Informer), kernel attention으로 시간 거리 가중 (Set Transformer 변형).

### 4.5 4단계 — 시간 적분 (output)

token $i$의 최종 출력은 $z_i(t_i)$ 위치에서 평가하거나, 필요한 query 시각 $t^*$에서 평가:

$$h_i^{(\ell+1)} = \mathrm{LN}\Big(\text{CT-MHA}_i(t_i) + z_i(t_i)\Big) \xrightarrow{\text{FFN}} \cdots$$

층을 쌓을 때마다 $z_i^{(\ell)}(t)$ 의 vector field가 새로 학습된다.

### 4.6 구현 디테일 (숨은 트릭)

- **ODE solver**: `dopri5` (Runge-Kutta-Fehlberg 4(5)) + adjoint method로 메모리 절감. tolerance 1e-3 ~ 1e-5.
- **Quadrature**: $\sum_j \hat\alpha_{ij}(t)\,v_j(t)$ 자체는 닫힌 합이지만, query 시각이 *연속*이므로 loss가 적분 형태일 때 $\int_0^T \mathcal{L}(t)\, dt$ 를 수치적분 (Simpson, Gauss–Legendre 등). 학습 시 query 시각을 monte-carlo 샘플링하기도.
- **NFE 폭주 방지**: vector field에 $\tanh$ saturation, weight decay 강하게.
- **Hyperparameters**: $d_h = 64$~$128$, head $H = 4$~$8$, layer $L = 2$~$4$. PhysioNet 기준 작은 모델로도 SOTA.
- **숨은 트릭**: 첫 layer는 보통 vanilla attention으로 두고, 깊은 layer만 ODE 처리하는 *hybrid* 변형이 부록에 등장 — 학습 안정성과 NFE 절감의 trade-off.

### 4.7 의사코드 (요약)

```
for each token i:
    z_i(t_i) = embed(x_i)
    z_i(t)   = ODESolve(f_theta, z_i(t_i), [t_i, t_query])
for each layer l:
    Q(t), K(t), V(t) = z(t) @ {W_Q, W_K, W_V}
    A(t)   = softmax(Q(t) K(t)^T / sqrt(d_k))
    out(t) = A(t) @ V(t)
    z(t)   = LN(out(t) + z(t)); FFN; LN
```

ODE solve는 **outer loop마다** 새로 호출되므로, 깊이 $L$, 토큰 수 $N$, NFE $K$ 일 때 cost ≈ $O(L \cdot N \cdot K \cdot d_h^2)$.
