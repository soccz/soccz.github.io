# 05 · 방법 ① LU 메커니즘 큰 그림

## 배경 사다리

이 절을 이해하려면 ① **가중치 벡터 $w \in \mathbb{R}^d$** 가 $d$ 차원 공간의 점이라는 것 (예: 1000 만 개의 다이얼 = 1000 만 차원의 한 점), ② **$\|w\|_2 = \sqrt{\sum_i w_i^2}$** 가 그 점이 원점에서 얼마나 멀리 있는지 (반지름) 라는 것, ③ **train/test loss 가 $w$ 에 대해 정의된 함수** $L_{\text{train}}(w)$, $L_{\text{test}}(w)$ 라는 것만 알면 된다. 학습은 loss 가 작은 쪽으로 $w$ 를 옮긴다.

## 큰 그림 — 한 문장으로

Omnigrok 의 큰 그림은 *"$w$ 공간 전체의 복잡한 loss landscape 를, $\|w\|$ 한 축으로 압축해서 (= 반지름이 같은 모든 $w$ 의 최소 loss 를 같이 묶어서) 본다. 그 1D 곡선이 train 은 L 자, test 는 U 자가 되어 두 형태가 어긋난다 — 이 어긋남이 grokking 의 모든 현상을 설명한다."* 라는 한 문장이다.

이걸 그림으로 옮기면:

```
loss
  │
  │\          ┌──────────────  L_train (L 자: norm 작으면 못 외움, 임계 넘으면 갑자기 외움)
  │ \         │
  │  \________│
  │
  │       __
  │  \   /  \  
  │   \_/    \____  L_test (U 자: 너무 작아도 못 일반화, 너무 커도 외워서 못 일반화)
  │            │
  │   ↑ Goldilocks ↑ 
  │   zone (w ≈ w_c)
  │
  └────────────────────────→  ‖w‖₂
       작은 norm     큰 norm
```

학습은 (small weight decay 가 있다면) 출발점에서 시작해 — 보통 *큰* $\|w\|$ 쪽 (large init) — 빠르게 train loss 를 0 으로 만들고 (overfit 평지) 그 위에 머문 다음, weight decay 가 천천히 $\|w\|$ 를 줄여서 Goldilocks zone 으로 끌어내린다. Zone 안에 들어가는 순간 test loss 가 갑자기 떨어진다 — 이게 grokking 의 그 갑작스러운 점프.

## 왜 "$\|w\|$ 한 축" 으로 압축이 가능한가

직관: 신경망의 *해 공간* 은 사실 norm-방향 의 두 축으로 잘 분해된다. (a) **Direction** ($\hat{w} = w/\|w\|$): 데이터의 어떤 패턴을 잡을지를 결정. (b) **Magnitude** ($\|w\|$): 그 패턴을 얼마나 sharply 잡을지 (decision boundary 의 sharpness · activation 의 saturation 수준) 를 결정.

Generalize 하는 해는 *direction* 이 데이터 구조와 align 되어 있고, *magnitude* 가 너무 크지 않은 경우다. magnitude 가 너무 작으면 신호가 약해서 train 도 못 잡고, 너무 크면 activation 이 saturate 되어 효과적으로 step function 처럼 작동 (각 train 예시마다 도자 → overfit). 이 두 망가짐 사이의 좁은 띠가 Goldilocks zone.

저자들의 영리한 단순화: "direction 은 GD 가 빠르게 잡아 준다 (gradient 가 직접 보내 줌)". 그러면 *남는 자유도* 는 magnitude 한 개뿐이고, 그 1D dynamics 가 grokking 을 결정한다. 이게 reduced landscape 정당화의 핵심.

## 왜 train 이 L 자, test 가 U 자인가

### Train 이 L 자인 이유

Train loss 는 *외울 자유도* 만 충분하면 0 으로 만들 수 있다. magnitude 가 너무 작으면 ($\|w\| < w_c$) activation 이 거의 0 이라 어떤 데이터도 못 맞춘다 — loss 큼. magnitude 가 일정 임계를 넘으면 ($\|w\| > w_c$) 무수히 많은 *외운 해* 들이 존재한다 (overparameterization). 이 region 에서 GD 는 그 중 한 해로 빠지므로 train loss 거의 0. → 작은 쪽 매우 큼 + 큰 쪽 평평하게 0 = L 자.

### Test 가 U 자인 이유

Test loss 는 외운 해와 일반화 해를 구분한다. magnitude 가 너무 작으면 ($\|w\| < w_c$) train 도 못 맞추니 test 도 못 맞춘다 — loss 큼. magnitude 가 너무 크면 ($\|w\| \gg w_c$) train 은 외웠지만 sharp boundary 때문에 test 못 일반화 — loss 큼. magnitude 가 딱 $w_c$ 부근이면 train 을 맞출 수 있는 magnitude 중 가장 smooth 한 해를 잡게 되어 test 도 좋음 — loss 작음. → 양 끝 큼 + 가운데 작음 = U 자.

## "Loss landscape 의 모양" 한 줄 비유

산을 옆에서 본다 생각하자. *Train 산* 은 동쪽 (큰 norm) 으로 가면 평지가 끝없이 펼쳐지고 서쪽 (작은 norm) 은 절벽. *Test 산* 은 가운데 한 곳에 좁은 분지가 있고 그 양 옆은 다 봉우리. 두 산의 능선 모양이 다른 게 LU mismatch.

학습은 출발 위치 (큰 norm 쪽 평지 위) → 동쪽 평지 따라 train 산 골로 빠른 하강 (overfit 도달) → weight decay 라는 "서풍" 이 분 다음에야 천천히 서쪽으로 이동 → test 산의 분지 안에 들어가는 순간 generalize. 서풍이 약하면 (small $\gamma$) 이동에 한참 걸린다 — 이게 grokking delay 의 정성 그림.

## 한 문장 요약

Reduced landscape 의 1D 압축 (norm 축) + train · test 의 L · U mismatch → Goldilocks zone 정의 → radial drift 의 $\gamma^{-1}$ 시간 → grokking 의 모든 현상.
