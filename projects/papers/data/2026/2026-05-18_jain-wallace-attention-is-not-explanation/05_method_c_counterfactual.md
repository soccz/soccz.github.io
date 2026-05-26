# 05-C 방법론 — H2: Counterfactual attention (permutation + adversarial)

## 이 부분이 왜 필요한가

H1 은 *상관* 만 잰다. 그러나 상관이 약하더라도 — "attention 이 예측의 *원인* 이지만 *다른 측정과의 매핑은 비선형* 일 뿐" 이라고 변호 가능. *원인* 을 직접 검증하려면 *개입* 이 필요하다. Attention 을 *바꿨을 때* 예측이 *어떻게* 변하는가 — 이것이 H2.

H2 가 묻는 인과 명제는 다음과 같이 정형화 가능:
$$
\text{"} \boldsymbol{\alpha} \text{ 가 예측의 설명이다"} \;\Leftrightarrow\; \forall \boldsymbol{\alpha}^* \ne \boldsymbol{\alpha},\; \hat{y}(\boldsymbol{\alpha}^*) \ne \hat{y}(\boldsymbol{\alpha})
$$
이 명제의 *반례 하나* 만 보여도 등식의 오른쪽이 깨진다. 본 논문은 두 가지 반례 탐색 절차를 제안.

## 절차 1 — Random permutation

### 정의

학습 완료된 모델의 attention 분포 $\boldsymbol{\alpha} = (\alpha_1, \dots, \alpha_T)$ 을, 무작위 순열 $\pi \in S_T$ (대칭군 $T$차) 로 섞어서 새 분포 $\boldsymbol{\alpha}^\pi = (\alpha_{\pi(1)}, \dots, \alpha_{\pi(T)})$ 를 만든다. 모델의 *나머지 부분* (embedding, encoder, classification head) 은 그대로 두고 attention 만 $\boldsymbol{\alpha}^\pi$ 로 치환하여 forward.

### 차이 측정

원본 출력 $\hat{y}$ 과 순열 출력 $\hat{y}^\pi$ 의 *total variation distance*:

$$
\text{TVD}(\hat{y}, \hat{y}^\pi) \;=\; \frac{1}{2}\sum_{k} |\hat{y}_k - \hat{y}^\pi_k|
$$

(이진 분류에서는 $|\hat{y} - \hat{y}^\pi|$ 로 단순화.)

**기호 뜻**: $\hat{y}_k$ = class $k$ 의 예측 확률. TVD = 두 분포 사이의 *최대 사건확률 차이* — 동일하면 $0$, 완전 분리면 $1$.

**일상 비유**: 동일 환자에 두 의사가 진단했을 때, 진단 *분포* 자체가 얼마나 다른가. 0.05 미만이면 "사실상 동일".

**왜 이 형태**: 절대 차이 — *해석이 쉽고* L1 거리.

**조심할 점**: TVD 는 *예측 확률의 변화* 만 잼. 예측 *클래스 자체* 가 바뀌는 case 와 안 바뀌는 case 를 합쳐서 평가. 클래스가 바뀐 비율도 별도 보고가 필요 (원문 미확인).

### 다중 순열 통계

각 instance 에 대해 다수의 무작위 순열 (예: 100 회) 을 돌려 *median TVD* 분포 또는 *max TVD* 분포를 보고. 인스턴스의 median 이 작다는 것 = *대부분의* 순열에서 예측이 보존된다는 강한 진술.

### 한계

- 무작위 순열은 *대안 분포 공간의 매우 작은 부분집합*. 같은 sparse 분포만을 *위치만* 바꾼다. *완전히 다른 모양* 의 분포 (예: 균일, 반대편 집중) 는 cover 못 함.
- 따라서 random permutation 통과 = *약한* 증거. 통과 못 해도 attention 이 설명임이 보장되지는 않음. **하한** 만 제공.

## 절차 2 — Adversarial attention

### 목적함수

다음 최적화 문제의 *해* $\boldsymbol{\alpha}_{\text{adv}}$ 를 명시적으로 탐색:

$$
\boldsymbol{\alpha}_{\text{adv}} \;=\; \arg\max_{\boldsymbol{\alpha}^* \in \Delta^{T-1}} \; \text{JSD}(\boldsymbol{\alpha}, \boldsymbol{\alpha}^*)
\quad \text{s.t.} \quad \text{TVD}\big(\hat{y}(\boldsymbol{\alpha}), \hat{y}(\boldsymbol{\alpha}^*)\big) \le \epsilon
$$

**기호 뜻**:
- $\Delta^{T-1}$ = $T$-차원 simplex (확률 분포 공간), $\boldsymbol{\alpha}^* \ge 0$, $\sum \alpha^*_i = 1$.
- $\text{JSD}$ = Jensen-Shannon divergence: $\text{JSD}(p,q) = \frac{1}{2}\text{KL}(p\|m) + \frac{1}{2}\text{KL}(q\|m)$, $m = (p+q)/2$. 대칭 + 유한 ($\le \log 2$).
- $\epsilon$ = 출력 차이 허용 한계 (예: $\epsilon = 0.05$ — 정확한 값 원문 미확인).

**일상 비유**: "원래 손가락 위치와 *최대한 다른* 위치를 가리키면서도 점수는 *거의 그대로* 나오게 하는 거짓말을 일부러 찾는다." 가능하다면 "원래 손가락 위치가 점수의 *진짜 이유*" 라는 주장이 무너진다.

**왜 이 형태**:
- *Constrained maximization*: "출력 보존" 제약 하에 "어텐션 차이 최대" 를 동시 추구. *최악의* 대안을 찾기 때문에 random permutation 보다 *강한* 검증.
- *JSD vs KL*: KL 은 비대칭, 한쪽 분포에 0 이 있으면 무한대 가능. JSD 는 대칭 + 유한 → 분포 distance 의 표준 선택.
- *TVD 제약*: KL 또는 cross-entropy 가 아닌 TVD 를 쓴 이유는 해석 용이 + 상한 $1$. "출력 분포가 *거의* 같다" 라는 자연어 진술과 직접 대응.

**조심할 점**:
- *Non-convex* 최적화 — local maxima 가능. 본 절차가 *최대* 가능한 JSD 를 항상 찾는다는 보장 없음. 따라서 *발견된 adversarial JSD* 는 *진짜 최대* 의 *하한*.
- $\epsilon$ 의 *임의성* — $\epsilon$ 을 크게 잡으면 결과가 *극적* 으로 보이고, 작게 잡으면 *온건* 하게 보인다. Sensitivity 분석이 필요.
- 제약을 어떻게 *수치적으로* 구현하는가 — soft penalty (Lagrangian) vs hard projection 등. 원문 구현 미확인. 학계 통용은 Lagrangian: $\mathcal{L} = -\text{JSD}(\boldsymbol{\alpha}, \boldsymbol{\alpha}^*) + \lambda \cdot \max(0, \text{TVD}(\hat{y}, \hat{y}^*) - \epsilon)$.

### 최적화 절차

Attention 분포 자체를 *변수* 로 두고 gradient ascent. Encoder hidden state $h_i$ 는 *고정* (입력과 모델 파라미터에서 정해진 값). Attention 만 새로 변수화하여:

$$
\boldsymbol{\alpha}^* \;=\; \text{softmax}(\boldsymbol{\beta}), \quad \boldsymbol{\beta} \in \mathbb{R}^T
$$

$\boldsymbol{\beta}$ 를 gradient ascent 로 갱신 → softmax 가 simplex 제약 자동 충족.

### 결과 보고

각 instance 에 대해 *발견된* $(\text{JSD}, \text{TVD})$ 쌍을 산점도로 표시. *우측 아래 영역* (JSD 큼, TVD 작음) 의 점 밀도 = adversarial 분포가 *쉽게 존재* 한다는 증거. 거의 모든 instance 에서 우측 아래 영역에 점이 위치한다는 것이 본 논문의 핵심 발견.

## 두 절차의 *상호 보완*

| 절차 | 강도 | 결론 방향 |
|------|------|----------|
| Random permutation | 약 | "*무작위* 대안에서도 예측 유지" |
| Adversarial | 강 | "*최악* 대안에서도 예측 유지" |

Adversarial 결과가 더 강한 evidence. Permutation 결과는 *adversarial 결과의 sanity check* — adversarial 이 우연한 noise 가 아니라는 secondary 확인.

## 핵심 한 문장

> 학습된 attention 분포를 *외부에서 강제 교체* — 무작위 순열 (약한 baseline) 과 gradient-기반 적대적 최적화 (강한 baseline) — 했을 때 예측이 보존되는 정도를 측정함으로써, "attention 분포가 예측의 *유일한* 결정자" 라는 *원인 주장* 을 실증적으로 반증.

---

## 인터랙티브 — H2-a Permutation Test

```viz:anie-permutation-scatter:title=Max Attention vs Median ∆ŷ (Permutation Test),caption=Dataset 셀렉터로 SST / IMDB / Diabetes / bAbI 1 전환. 점선 ("faithful" reference) = "큰 attention 위치 변경 시 큰 ∆ŷ 기대". 관찰: 대부분 dataset 에서 max α > 0.6 인 instance 도 ∆ŷ < 0.05 — *attention 위치 무관, 같은 prediction*. Diabetes 만 예외 (high-precision medical token).
```

```viz:anie-adversarial-search:title=Adversarial Attention 최적화 Trajectory,caption=Iter 슬라이더 (0 → 500). JSD (blue, max 목표) 가 점차 증가하면서 TVD (red, ε=0.10 constraint 유지) 가 ε 아래에 머무름. iter=500 에서 JSD ≈ 0.45 (distinct distributions) + TVD < 0.10 (same prediction). → "다른 attention, 같은 prediction" 의 explicit optimization 결과.
```

```viz:anie-tvd-jsd-2d:title=Adversarial Feasible Region — TVD vs JSD 2D,caption=Dataset 셀렉터로 SST / IMDB / Diabetes / Anemia / SNLI 전환. 녹색 영역 = TVD < 0.10 (constraint 만족). 대부분 dataset 에서 high JSD (> 0.30) + low TVD (< 0.10) 의 점 다수 → adversarial attention 광범위 존재. Diabetes 만 점들이 diagonal 따라 분포 (adversarial 어려움).
```
