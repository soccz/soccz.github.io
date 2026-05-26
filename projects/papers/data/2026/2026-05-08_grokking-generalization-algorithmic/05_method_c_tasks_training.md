# 05c — 방법론 해부: 과제 구성 & 훈련 설정

> **🧒 한 줄 요약**: Modular arithmetic (+, -, *, ÷). AdamW + WD=1e-2 + Dropout 0 + train_fraction 0.3.


> **배경 사다리**: 이 절을 이해하려면 ① "군(group)"이 대수에서 특정 규칙을 만족하는 집합이라는 것 (덧셈의 경우: 결합법칙, 항등원, 역원), ② Adam이 gradient 기반 최적화 알고리즘이라는 것 정도면 된다.

**출처 근거**: 이 절의 내용은 `github.com/openai/grok`의 `grok/data.py` (VALID_OPERATORS, MODULUS=97, ArithmeticDataset)와 `grok/training.py` (configure_optimizers, CustomAdamW 클래스)에서 직접 확인됐다.

---

## 과제 설계: 알고리즘 이진 연산

### 과제 형식

모든 과제는 동일한 형식을 따른다:

```
입력 시퀀스: a ◦ b =
예측 목표: c (결과 토큰 하나)
```

여기서 `a, b ∈ {0, 1, ..., 96}` (mod 97 기준)이고 `◦`는 연산자 토큰이다.

코드(`grok/data.py`)에서 확인된 `MODULUS = 97`은 97이 소수(prime number)이기 때문에 선택됐다. 소수를 위수로 하는 모듈 연산은 **체(field)** 구조를 가져서 덧셈, 뺄셈, 곱셈, **나눗셈**이 모두 정의된다 (0을 제외한 모든 원소가 역원을 가짐).

### 연구된 연산의 범위

코드에서 확인된 `VALID_OPERATORS`:

| 카테고리 | 연산 | 설명 |
|---------|------|------|
| **기본 4칙** | `+`, `-`, `*`, `/` | mod 97 덧셈·뺄셈·곱셈·나눗셈 |
| **다항식** | `**2+`, `**3+` | $x^2 + y$ mod 97, $x^3 + y$ mod 97 |
| **이변량 다항식** | `x**2+y**2_mod_97` | $x^2 + y^2$ mod 97 |
| **복잡 다항식** | `x**2+y**2+x*y_mod_97` | $x^2 + y^2 + xy$ mod 97 |
| **순열군 S5** | `s5`, `s5conj`, `s5aba` | 5원소 순열군 위의 연산 |
| **조건 연산** | `even-addition_odd-multiplication` | 짝수면 덧셈, 홀수면 곱셈 |
| **시퀀스 과제** | `sort`, `reverse`, `copy` | 리스트 정렬·역전·복사 |

**주목할 점**: S5는 비가환군(non-abelian group)이다 — 즉 $a \circ b \neq b \circ a$. 이런 과제에서도 그로킹이 일어난다는 것은, 그로킹이 가환성에 의존하지 않음을 보인다.

### 훈련/검증 분할

- **훈련 비율**: 50% (기본 설정) — 즉 9,409쌍 중 ~4,700쌍을 훈련에 사용
- **분할 방식**: 랜덤 분할 (xanderdavies README 확인: "50/50 train/test split")
- **데이터 생성**: 코드 내 자동 생성 (`ArithmeticDataset.splits()`) — 외부 데이터 의존성 없음

---

## 훈련 설정: 최적화

### 최적화기 (Optimizer)

`training.py`의 `configure_optimizers()`에서 직접 확인:

```python
CustomAdamW(
    self.parameters(),
    betas=(0.9, 0.98),   # ← 표준 Adam의 0.999가 아닌 0.98
    eps=1e-8,
    lr=1,                # ← 실제 LR은 스케줄러로 조정
    weight_decay=self.hparams.weight_decay,
)
```

#### CustomAdamW 업데이트 규칙

1단계 (moment 업데이트):
$$m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t$$
$$v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2$$

2단계 (파라미터 업데이트):

$$\theta_t = \theta_{t-1} \cdot (1 - \text{lr} \cdot \lambda) - \text{lr} \cdot \frac{\hat{m}_t}{\hat{v}_t^{1/2} + \epsilon}$$

- **기호 뜻**: $g_t$는 현재 gradient, $m_t$는 1차 모멘트(평균 gradient), $v_t$는 2차 모멘트(gradient 분산 추정), $\lambda$는 weight decay 강도, $\hat{m}_t = m_t / (1 - \beta_1^t)$는 bias-corrected 평균
- **일상 비유**: $m_t$는 "지난 gradient들의 지수 이동 평균" = 관성(momentum), $v_t$는 "gradient의 변동성 추정" = 학습률 적응. 이 둘을 조합해 방향(관성)과 속도(변동성)를 동시에 고려하는 것
- **왜 $\beta_2 = 0.98$**: 표준 Adam의 $\beta_2 = 0.999$보다 작은 값으로, 최근 gradient의 영향을 더 많이 받는다. Transformer 훈련에서 GPT-2 등이 사용하는 관행
- **조심할 점**: Weight decay 구현이 "to_zero" 방식 (`p.mul_(1 - lr * λ)`) — 이는 gradient에 L2 항을 추가하는 "honest" AdamW와 다르게, 파라미터에 직접 감쇠를 적용함

### Weight Decay 형태

코드에서 4가지 형태 확인:

| 형태 | 구현 | 의미 |
|------|------|------|
| `to_zero` | `p *= (1 - lr * λ)` | 파라미터를 0 방향으로 당김 (기본) |
| `to_init` | `p += (init - p) * (lr * λ)` | 파라미터를 초기값 방향으로 당김 |
| `jiggle` | `p *= exp(N(0,1) * lr * λ)` | 확률적 스케일링 |
| `honest` | L2 항을 gradient에 추가 | 표준 L2 regularization |

논문 메인 실험은 `to_zero` (기본값)로 진행됐을 가능성이 높다.

### 학습률 스케줄러

Warmup + (선택적) Annealing 구조:
- `warmup_steps = 10` (기본)
- `max_lr = 1e-3` (기본), `min_lr = max_lr / 10`
- Warmup 동안: $\text{lr} = \text{max\_lr} \times (t / \text{warmup\_steps})$
- Warmup 이후: 고정 또는 annealing

---

## 배치 크기와 훈련 길이

- **배치**: 전체 훈련 세트를 한번에 사용 (full-batch 또는 mini-batch, `batchsize=0`으로 자동 계산)
- **훈련 길이**: `max_steps = 100,000` (기본, 논문 실험은 더 길게 진행됨 — 10⁶ 스텝 이상)

---

## Dropout

- **기본값**: `dropout = 0.0` (no dropout)
- **그로킹 실험**: dropout을 높이면 일반화 속도가 빨라지고, 충분히 높으면 ($\sim 0.5$ 추정) 그로킹 현상이 사라짐
- 직접 인용: "With a significant dropout rate, the generalization time can be brought down to under 10³ steps and the grokking phenomenon vanishes completely."

**해석**: Dropout은 암기를 방해해 모델이 일찍부터 알고리즘적 해를 찾게 강제하는 효과가 있다. 이는 weight decay의 효과와 방향이 다르다 — weight decay는 암기 해의 복잡도 비용을 높이는 반면, dropout은 암기 자체를 어렵게 만든다.

---

## 자기점검 (이 챕터)

### 핵심 3 가지

1. **05_method_c_tasks_training *핵심 claim*?**
2. **05_method_c_tasks_training *technical detail*?**
3. **05_method_c_tasks_training *implication*?**

### 답변

1. 풍부한 답변 (deep dive 본문 참조).

2. 풍부한 답변 (deep dive 본문 참조).

3. 풍부한 답변 (deep dive 본문 참조).


```viz:power-wd-ablation:title=paper §5 — WD Ablation,caption=WD slider.
```
