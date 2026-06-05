# 05_method_e — 방법론 (5) 로그가능도와 적분

## 이 부분이 왜 필요한가

점과정의 **자연 학습 신호** 는 사건 시퀀스의 **로그가능도** 다. 즉 "이 사건 시퀀스가 모델 강도 함수 하에서 얼마나 likely 한가" 를 최대화하는 것이 목표. THP 의 강도 정의가 닫힌형으로 잡혔으니 이제 가능도를 평가해 gradient 를 흘려야 한다. 이 절은 **로그가능도의 두 항 (사건 항 + 적분 항)** 의 정의와 **적분의 두 평가 방식 (biased / unbiased)** 의 트레이드오프를 본다.

---

## 1) 로그가능도의 수학적 정의

시퀀스 $\{(t_i, k_i)\}_{i=1}^L$ 에 대한 marked TPP 의 로그가능도:

$$\log L = \underbrace{\sum_{i=1}^L \log \lambda_{k_i}(t_i)}_{\text{사건 항 (event term)}} - \underbrace{\int_{t_1}^{t_L} \lambda(t) \, dt}_{\text{적분 항 (non-event term)}}$$

- **사건 항**: 각 사건 시각에서 그 종류의 강도 값에 log. 강도가 클수록 그 사건이 그 시각에 발생할 likely 함이 큼.
- **적분 항**: 시퀀스의 시간 구간 전체에 걸친 전체 강도(모든 종류 합) 의 적분. **사건이 발생하지 않은 시간** 동안 "발생 안 함" 이 likely 하려면 강도가 그 시간 동안 작아야 함. 음의 부호 → 전체 적분이 작아야 우도 ↑.

### 직관

가능도는 **"사건이 있는 순간엔 강도가 높고, 사건이 없는 순간엔 강도가 낮아야 한다"** 는 압력을 강도함수에 동시에 가한다. 이 균형이 점과정 학습의 핵심.

---

## 2) 사건 항 계산

코드 `Utils.py::compute_event`:

```python
def compute_event(event, non_pad_mask):
    """ Log-likelihood of events. """
    event += math.pow(10, -9)  # numerical safety
    event.masked_fill_(~non_pad_mask.bool(), 1.0)  # padding → log(1)=0 contribution
    result = torch.log(event)
    return result
```

여기서 `event[i] = lambda_{k_i}(t_i)`. 즉 각 사건의 자기 종류 강도 평가값.

### 4줄 해석

1. **기호 뜻**: `event` 는 사건 $i$ 의 종류 $k_i$ 에 대한 강도 $\lambda_{k_i}(t_i)$ 의 텐서. 1e-9 더하기는 log(0) 방지.
2. **일상 비유**: 폭죽이 터진 순간마다 "그 폭죽 종류의 강도" 를 측정하고, 그 값들의 곱이 가능도. 곱을 log 로 바꾸면 합.
3. **왜 이 형태**: 정의 그대로. 가능도 함수의 product → log 의 sum.
4. **조심할 점**:
   - **Padding 처리**: 배치 내 짧은 시퀀스의 padding 위치는 `1.0` 으로 채워 `log(1) = 0` → 합산에 기여 안 함.
   - **1e-9 의 효과**: 강도가 매우 작은 경우 log 가 매우 음수 → gradient explode 가능. 1e-9 더하기로 cap.

---

## 3) 적분 항 (두 가지 평가)

전체 강도 $\lambda(t) = \sum_k \lambda_k(t)$ 의 시간 구간 적분이 필요. 이 적분은 **각 사건 사이 구간 $[t_j, t_{j+1}]$ 으로 분리**:

$$\int_{t_1}^{t_L} \lambda(t) dt = \sum_{j=1}^{L-1} \int_{t_j}^{t_{j+1}} \lambda(t) dt$$

각 구간 안에서 $\lambda(t)$ 의 정확한 평가가 필요. THP 는 두 방식 모두 제공.

### 방식 A — 사다리꼴 근사 (biased)

```python
# 의사코드 (Utils.py 의 상응 부분)
diff_time = (event_time[:, 1:] - event_time[:, :-1]) * non_pad_mask[:, 1:]
# at endpoints t_j, t_{j+1}: lambda(t_j) ≈ softplus(0 + w·h_j + b)
# trapezoidal: (lambda(t_j) + lambda(t_{j+1})) / 2 * (t_{j+1} - t_j)
lambda_left = compute_lambda_at(h_j, 0)         # t = t_j (relative time = 0)
lambda_right = compute_lambda_at(h_j, t_{j+1})  # t = t_{j+1} (relative time = full delta)
integral_biased = (lambda_left + lambda_right) / 2 * diff_time
```

#### 4줄 해석

1. **기호 뜻**: 사건 사이 구간 $[t_j, t_{j+1}]$ 에서 강도를 양 끝점만 평가하고 사다리꼴 면적으로 근사.
2. **일상 비유**: 그래프 아래 면적을 양 끝점만 알고 사다리꼴로 어림잡기. 그래프가 선이면 정확, 휘면 틀림.
3. **왜 이 형태**: 빠름 (구간당 2번 평가). 강도의 선형 변화 가정과 자연스럽게 일치.
4. **조심할 점**: **bias 양수 or 음수**: 강도가 구간 내 concave 면 underestimate, convex 면 overestimate. softplus 는 convex → trapezoidal 이 적분 overestimate (= 가능도 underestimate). 학습 시 일관된 방향 bias 라서 수렴엔 문제 적으나 likelihood 절대 수치는 부풀려 보고됨.

### 방식 B — Monte Carlo 적분 (unbiased)

```python
# 의사코드 (Utils.py 의 상응 부분)
num_samples = 100
# 각 구간 [t_j, t_{j+1}] 에서 num_samples 개 시각을 균일 sampling
sample_times = uniform_sample(t_j, t_{j+1}, num_samples)
lambda_at_samples = compute_lambda_at(h_j, sample_times)  # 100 evaluations per interval
integral_unbiased = lambda_at_samples.mean(dim=samples) * diff_time
```

#### 4줄 해석

1. **기호 뜻**: 각 사건 사이 구간에 100 개의 시각을 균일 무작위로 뽑아 강도 평가 → 평균 → 구간 길이로 가중.
2. **일상 비유**: 그래프 아래 면적을 무작위 100 점을 찍어 평균값 × 폭으로 계산. 점이 많을수록 정확.
3. **왜 이 형태**: MC 의 unbiased 성. $\mathbb{E}[\frac{1}{N}\sum \lambda(T_n) \cdot \Delta] = \int \lambda dt$ for $T_n \sim \text{Uniform}$.
4. **조심할 점**:
   - **분산**: 100 샘플의 분산이 학습 신호에 noise 추가. 강도가 spiky 하면 분산 큼 → 학습 불안정.
   - **계산 비용**: 100× 평가 → forward pass 비용 ↑. run.sh 의 작은 batch=4 이유.
   - **재현성**: 매 epoch sampling 다름 → 같은 시퀀스라도 loss 다름. seed 고정 필요.

### 코드 분기 (Main.py)

```python
parser.add_argument('-integration', type=str, default='biased',
                    choices=['biased', 'unbiased'])
```

사용자가 옵션으로 선택. default 는 biased (빠름).

---

## 4) 종합 손실 함수

`Main.py::train_epoch`:

```python
event_loss, non_event_loss = log_likelihood(model, output, event_type, event_time)
event_loss = event_loss / num_events  # normalize by total events
prediction_loss = type_loss + time_loss * 100  # main.py의 scaling

total_loss = -event_loss + non_event_loss + prediction_loss
```

- $-\log L = -\sum \log \lambda + \int \lambda dt$ : 음의 로그가능도 (최소화)
- $+ \text{type\_loss}$ : 다음 사건 종류 예측 cross-entropy (label smoothing 적용 가능)
- $+ 100 \cdot \text{time\_loss}$ : 다음 사건 시각 예측 MSE × 100 (RMSE 비교 가능한 scale)

### 세 손실의 트레이드오프

- **NLL** 은 점과정의 generative training 신호. 분포 자체 학습.
- **Type CE** 는 직접적 분류 정확도 신호.
- **Time MSE** 는 직접적 회귀 신호.

이 세 가지를 합산해서 학습. 가중치 (100) 은 RMSE 의 scale 을 NLL 과 비슷하게 맞추기 위한 heuristic. 데이터셋 단위에 의존.

---

## 5) Optimizer 및 학습 schedule

`Main.py`:

```python
optimizer = optim.Adam(model.parameters(), lr=1e-4)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)
```

- **Adam lr=1e-4**: transformer 표준 초기 학습률
- **Step decay**: 10 epoch 마다 lr × 0.5. 점진적 fine-tuning
- **Epoch 100** (run.sh default), **Batch 4** (run.sh — Monte Carlo unbiased 비용 때문)
- **Dropout 0.1, Label smoothing 0.1**: 정규화 표준값

---

## 다른 접근으로 했다면

### 대안 A — Variational lower bound

가능도 자체를 ELBO 로 대체 (VAE 풍). **장점**: latent 변수로 강도 unobserved factor 모델. **단점**: 학습 신호 noise 증가. 점과정의 직접 가능도가 잘 정의되어 있어 ELBO 의 이점 작음.

### 대안 B — Thinning algorithm 기반 loss

사건 도착을 thinning 으로 sampling 해 그 분포와 모델을 매칭. **장점**: 가능도 적분 불필요. **단점**: thinning 의 비효율.

### 대안 C — Score matching (SMURF-THP 2023)

가능도 대신 score 매칭. **장점**: 적분 회피. **단점**: 추가 noise scheduling. SMURF-THP 가 후속작으로 이 방향.

### THP 의 선택

**정통 NLL + 직접 prediction loss 합산**. 가장 단순. 후속작들이 이 base 위에 변형 추가.

---

## 핵심 한 문장 요약

> **THP 의 학습 신호는 표준 marked TPP 의 NLL — "사건 시각의 log-strength + 사건 사이 시간의 부정 적분" — 에 다음 사건 종류·시각의 직접 예측 loss 를 가산한 합성 손실이며, 적분 평가의 biased 사다리꼴과 unbiased 100-sample MC 옵션이 모두 코드로 제공되어 사용자 비용·정확도 트레이드오프를 직접 선택할 수 있다.**

다음 절(`06_experiments`) 에서 이 학습이 6 데이터셋에서 실제 어떻게 작동했는지 본다.
