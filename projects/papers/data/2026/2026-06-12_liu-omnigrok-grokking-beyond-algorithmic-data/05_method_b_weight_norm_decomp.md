# 05 · 방법 ② weight norm 축 분해 — direction × magnitude

## 배경 사다리

이 절을 이해하려면 ① 벡터 $w$ 를 항상 $w = r\hat{w}$, $r = \|w\|$, $\hat{w} = w/\|w\|$ 로 *반지름 × 방향* 으로 쓸 수 있다는 것 (극좌표의 고차원판), ② Gradient descent 의 한 step $w \leftarrow w - \eta \nabla L(w) - \eta \gamma w$ 에서 마지막 항이 weight decay 라는 것 (norm 을 줄이는 방향으로 끌어당김), ③ $\nabla L(w)$ 는 일반적으로 *radial 성분* $\nabla_r L$ 과 *angular 성분* $\nabla_{\hat{w}} L$ 로 분해된다는 것만 알면 된다.

## 왜 이 분해가 필요한가

Claim 2 의 LU mechanism 은 *1D loss 곡선* — $\|w\|$ 한 축 — 위에서 정의된다. 그런데 실제 gradient descent 는 $d$ 차원 (수십만 ~ 수십억) 에서 일어난다. "1D 로 압축" 이라는 게 정당화되려면 *나머지 $d-1$ 차원* 의 자유도가 grokking dynamics 에 영향이 작음을 보여야 한다.

저자들의 정당화는 (본문 추정):

1. **방향 ($\hat{w}$) 은 빠르게 수렴**: GD 의 angular component $\nabla_{\hat{w}} L$ 는 data loss 의 gradient 그 자체이므로, 학습 초기 (수십 ~ 수백 step) 안에 train loss 를 0 으로 만드는 방향으로 빠르게 정렬된다. 이 phase 가 끝나면 $\hat{w}$ 는 *overfit-attainable* manifold 안의 한 점에 거의 stationary 하게 된다.
2. **이후 dynamics 는 norm $r$ 한 축으로 환원**: weight decay 가 $r$ 을 줄이고, gradient 의 radial component 가 $r$ 을 그 방향으로 끌어당기는 — 1D ODE 로 잘 근사된다.
3. 즉, grokking 의 long dynamics 는 1D 의 $r(t)$ 변화로 보면 충분하다.

## 수식 — radial / angular 분해

손실 $L(w)$ 를 극좌표로 다시 쓰면 $\tilde L(r, \hat w) := L(r\hat w)$. Gradient flow (연속 시간 GD):

$$\dot w = -\nabla L(w) - \gamma w$$

이를 radial · angular 로 분해하면:

$$\dot r = -\partial_r \tilde L(r, \hat w) - \gamma r, \qquad \dot{\hat w} = -\frac{1}{r}\, P_{\hat w^\perp} \nabla_{\hat w} \tilde L(r, \hat w)$$

여기서 $P_{\hat w^\perp}$ 는 $\hat w$ 와 수직인 부분공간으로의 사영. (방향은 단위 sphere 위에 머물러야 하므로 perpendicular 성분만 작용.)

**4 줄 해석**:

1. **기호 뜻**: $r = \|w\|$ 는 반지름 (≥ 0), $\hat w$ 는 단위 sphere $S^{d-1}$ 위의 한 점 (방향), $\gamma > 0$ 는 weight decay 계수, $\partial_r \tilde L$ 는 reduced loss 의 *radial gradient*, $\nabla_{\hat w}$ 는 angular gradient. 단위는 모두 loss / norm 의 비율.
2. **일상 비유**: 행성의 궤도와 같다. $\dot r$ 식은 "중심으로 끌어당기는 중력 (weight decay) + 표면 경사의 radial 성분" 이고, $\dot{\hat w}$ 식은 "표면 경사의 접선 성분" (= 표면 위 미끄러짐). Weight decay 는 행성을 중심으로 끌어당기는 약한 일정한 중력.
3. **왜 이 형태**: 이 분해는 $w = r\hat w$ 에 chain rule 을 적용한 결과로, *어떤 loss function 에도 자동으로 성립* 한다. 굳이 이 형태로 쓰는 이유는 "*$r$ 의 dynamics 가 $\hat w$ 의 dynamics 와 분리 (decouple) 되는가?*" 라는 질문을 명시적으로 던지기 위함. 일반적으로는 둘이 얽혀 있지만 (cross-term: $\partial_r \tilde L$ 가 $\hat w$ 에 의존), 저자들이 가정하는 학습 regime — $\hat w$ 가 빠르게 stationary 되는 — 에서는 두 번째 식이 거의 0 이 되어 첫 번째 식만 의미 있는 dynamics 를 갖는다.
4. **조심할 점**: (a) Angular gradient 가 *정말* 0 에 빠르게 도달한다는 가정은 일반 NN 에서 검증 안 됨 — depth 가 깊거나 batch norm 같은 normalization 이 있으면 angular 성분이 계속 활성. (b) $\partial_r \tilde L$ 자체가 $\hat w$ 의존이므로, 단순 1D ODE 로 잘 근사된다는 건 *현재 $\hat w$ 가 attainable manifold 위 한 점* 이라는 추가 조건 필요.

## Reduced landscape — radius 마다 "최선" 으로 정의

저자들이 본문에서 측정·시각화하는 reduced loss 는 다음과 같이 정의된다 (추정):

$$\tilde L_{\text{train}}(r) := \min_{\hat w \in S^{d-1}} L_{\text{train}}(r\hat w), \qquad \tilde L_{\text{test}}(r) := L_{\text{test}}(r\hat w^*(r))$$

즉, train loss 는 *각 반지름에서 train 을 가장 잘 맞추는 방향* 으로 최소화하고, test loss 는 그 방향에서 평가한다.

**4 줄 해석**:

1. **기호 뜻**: $\tilde L_{\text{train}}(r)$ 는 "norm 이 $r$ 인 모든 $w$ 중 train loss 가 최소인 값", $\hat w^*(r)$ 는 그 최소를 달성하는 방향. $\tilde L_{\text{test}}$ 는 그 방향에서의 test loss.
2. **일상 비유**: "반지름이 $r$ 인 구면 위에서 train 시험만 잘 본 학생 한 명을 뽑은 다음, 그 학생의 test 점수를 보는" 것. 각 구면 위의 *대표 학생* 만 그 반지름의 점수로 친다.
3. **왜 이 형태**: 1D 곡선으로 압축하려면 반지름 마다 한 점만 가져야 하고, 그 한 점은 *학습이 도달할 점* 의 대표여야 한다. Train loss 의 minimum 이 그 대표인 이유 — GD 가 train loss 를 줄이는 방향으로 움직이기 때문.
4. **조심할 점**: (a) 실제 $\hat w^*(r)$ 를 정확히 찾는 건 NP-hard 일 수 있지만, 실험적으로 weight projection (현재 $w$ 를 norm $r$ 으로 rescale) 으로 근사. (b) Test loss 의 U 자는 $\hat w^*(r)$ 의 *방향* 이 $r$ 에 따라 바뀜에 따른 효과인지, 단지 magnitude scale 효과인지 분리 안 됨 — 저자가 이걸 본문에서 distinguish 했는지는 원문 미접근.

## 다른 분해로 했다면

대안 1 — **Layer-wise norm**: 각 layer 별 weight matrix 의 norm $\|W^{(\ell)}\|$ 들을 따로 본다. 더 풍부한 정보지만 LU 단순화의 우아함을 잃음.

대안 2 — **Singular value spectrum**: weight matrix 의 SVD 로 spectral norm 과 nuclear norm 을 같이 본다. Rank-related grokking (Merrill 2023 의 sparse-dense competition 가설) 과 호환되지만 measure 가 복잡.

대안 3 — **Sharpness (Hessian eigenvalue) 축**: weight norm 대신 loss landscape 의 sharpness 를 축으로. SAM (Sharpness-Aware Minimization) 계열과 연결되지만 cost 비쌈.

저자가 *weight norm* 한 축을 고른 건: (a) 측정 단순 (1 줄 코드: `torch.norm(w)`), (b) weight decay 와 직접 연결 (weight decay 가 정확히 norm 을 줄임), (c) Liu et al. 2022 Effective Theory 에서 이미 norm 이 generalization 결정 인자로 식별됨 — 즉, 본 저자 라인의 *축 선택 일관성* 이 reduced landscape 의 정당화 일부.

## 한 문장 요약

$w = r\hat w$ 분해로 angular dynamics 를 빠르게 처리한 다음 radial 1D ODE 로 grokking 을 환원하는 것이 LU mechanism 의 수학적 토대. 이 환원의 정당성은 $\hat w$ stationary 가정에 달려 있다.
