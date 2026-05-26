# 05-B 방법론 — H1: 어텐션과 feature importance 의 상관 검증

## 이 부분이 왜 필요한가

만약 attention 이 *모델이 사용하는 단어 중요도* 를 가리킨다면, 다른 방식으로 잰 단어 중요도와 *대체로* 일치해야 한다. 이 명제를 통계적으로 검증하는 것이 H1. 일치가 약하면 — 적어도 두 측정 중 하나는 "단어 중요도" 의 *올바른* 측정이 아니므로 attention 을 *기본 설명* 으로 채택할 정당성이 약해진다.

## 두 가지 reference importance 측정

### (1) Gradient-based importance

$$
g_i \;=\; \left|\frac{\partial \hat{y}}{\partial e_i}\right|_1 \quad \text{또는} \quad g_i \;=\; \left\| e_i \odot \frac{\partial \hat{y}}{\partial e_i} \right\|_1
$$

**기호 뜻**: $e_i \in \mathbb{R}^d$ 는 token $i$ 의 embedding 벡터 ($d$ 는 embedding 차원), $\hat{y} \in [0,1]$ (또는 logit) 는 모델 출력 (이진 분류면 scalar, multi-class 면 softmax 출력), $\partial \hat{y}/\partial e_i$ 는 야코비안의 한 행, $\|\cdot\|_1$ 는 절댓값 합, $\odot$ 는 element-wise 곱.

**일상 비유**: "이 단어 임베딩의 한 좌표 ($e_{i,j}$) 를 살짝 흔들면 출력이 얼마나 흔들리는가?" 를 모든 좌표에 대해 더한 값. 흔들림 큰 단어 = "중요한" 단어.

**왜 이 형태**: Linear approximation. $\hat{y}(e_i + \delta) \approx \hat{y}(e_i) + \delta^\top \nabla_{e_i} \hat{y}$. 만약 $\delta$ 가 작은 noise 라고 가정하면 output 의 expected variation 이 $\|\nabla \hat{y}\|$ 에 비례. 따라서 gradient 크기 = 출력에 대한 *국소 민감도*.

**조심할 점**:
- *국소* 측정이라 거대 변화 (단어 완전 제거) 는 비선형 효과를 놓침.
- ReLU 류 비선형성에서 *gradient saturation* → 작은 값으로 collapse 가능 (saliency literature 의 잘 알려진 문제).
- 두 형태 ($|\partial \hat{y}/\partial e|$ vs $e \odot \partial \hat{y}/\partial e$) 가 다른 *해석* 을 제공 — 후자는 *baseline 0* 을 가정한 first-order Taylor 근사, 전자는 *국소 민감도*. 본 논문이 둘 다 보고하는지 한 쪽만 보고하는지 — 원문 §4 미확인. 학계 통용은 둘 다 보고하고 robust 한 형태를 강조.

### (2) Leave-one-out (LOO) importance

$$
\ell_i \;=\; \big| \hat{y}(x) \;-\; \hat{y}(x_{-i}) \big|
$$

**기호 뜻**: $x = (x_1, \dots, x_T)$ 원본 입력, $x_{-i}$ 는 $i$ 번째 token 을 *제거* 또는 *마스킹* (보통 `[PAD]` 또는 `[UNK]` 로 치환) 한 입력, $\hat{y}(\cdot)$ 는 동일 모델의 forward pass. 절댓값 1-norm.

**일상 비유**: "이 단어를 빼고 다시 채점하면 점수가 얼마나 바뀌나?" 직접 측정.

**왜 이 형태**: *반사실적* (counterfactual). Gradient 의 *국소* 한계를 피하고 *유한 차이* 로 importance 를 직접 측정.

**조심할 점**:
- $T$ 회의 forward pass 필요 — 계산 비용 큼.
- *Distribution shift* — `[PAD]` 치환 후의 입력은 *학습 분포 밖* 일 수 있어 모델이 *비정상 동작* 가능. 이 noise 가 importance 추정을 왜곡.
- *Compositional* 효과 무시 — 두 단어를 *함께* 제거할 때의 시너지 잡지 못함.

## 일치 측정 — Kendall τ

각 instance 에 대해 attention 순위 $r^\alpha = \text{rank}(\boldsymbol{\alpha})$ 와 importance 순위 $r^g = \text{rank}(\mathbf{g})$ 또는 $r^\ell = \text{rank}(\boldsymbol{\ell})$ 을 만든 뒤,

$$
\tau \;=\; \frac{\#\{\text{concordant pairs}\} - \#\{\text{discordant pairs}\}}{\binom{T}{2}}
$$

**기호 뜻**: *concordant pair* = $(i,j)$ 에서 두 순위가 같은 방향으로 정렬된 쌍, *discordant pair* = 반대 방향, $\binom{T}{2}$ = 가능한 쌍의 수.

**일상 비유**: 두 심사위원이 각각 매긴 순위가 얼마나 비슷한지의 척도. $+1$ 완전 일치, $0$ 무관, $-1$ 완전 반대.

**왜 이 형태**: Pearson 상관은 *값* 의 선형성을 잼. Attention 분포는 일반적으로 *sparse* (한두 위치에 집중) — Pearson 은 outlier 에 민감. Kendall τ 는 *순위* 만 보므로 분포 모양에 강건.

**조심할 점**:
- Attention 이 *완전히 균일* 하면 순위가 ill-defined. Tie 처리 (Kendall τ-b) 에 따라 값이 달라짐.
- Sparse 분포에서 *상위 몇 개* 만 의미 있고 나머지는 noise. Top-k 변형 (예: τ@5) 을 보지 않으면 *대다수 무관한 token* 의 순위 잡음이 평균을 깎음.

## 격자 sweep

위 측정을 **(데이터셋 12) × (인코더 3) × (attention 종류 2)** = **72 조건** 에 대해 instance-wise 로 모아 분포로 보고. 보고 형태는 violin / box plot 으로 추정 (원문 미확인). 각 조건의 *median Kendall τ* 또는 *Kendall τ < 0 인 instance 비율* 등이 핵심 수치.

## 대안 — 다른 접근으로 했다면?

- **Pearson / Spearman**: 단순. 그러나 sparse 분포에서 noise 민감. 본 논문이 Kendall 을 고른 이유.
- **Mutual Information**: 두 분포의 *비선형* 정보 공유. 그러나 추정에 큰 표본 필요, instance-wise 측정 불가.
- **Top-k overlap (Jaccard)**: "두 측정의 top-k 단어가 얼마나 겹치나" — 더 직관적이고 *해석적으로* 자연스러움. 하지만 *순서* 정보 버림.
- **Causal effect with proper baselines (e.g., integrated gradients, expected gradients)**: Gradient saturation 문제를 완화. 본 논문은 *vanilla gradient* + LOO 에 그침. 후속 작업의 보강 지점.

## 핵심 한 문장

> Attention 분포 와 *두 가지 독립* importance 측정 (gradient, LOO) 사이의 *순위 일치도* 를 Kendall τ 로 측정하여, "*같은 단어가 중요하다고 가리키는가*" 라는 질문을 정량적으로 답하는 모듈.

---

## 인터랙티브 — H1 결과 시각화

```viz:anie-correlation-hist:title=Kendall τ Histogram — H1 결과 (Dataset 별),caption=Dataset 셀렉터로 SST / IMDB / Diabetes / bAbI 2 / SNLI 등 전환. Metric 토글 (τ_g / τ_loo). 모든 dataset 에서 BiLSTM 의 τ 분포가 0.5 이하 centered → H1 (attention 이 importance 와 강한 상관) *실패*. Average encoder 의 τ 분포는 0.6+ 로 시프트 → encoder mixing 의 효과 시각.
```
