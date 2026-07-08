# 4. 방법론 F — Quantile 출력 + Pinball 손실

## 왜 이 부분이 필요한가

Point forecast (평균 하나) 는 리스크 결정에 부족하다. "내일 판매량 100 개" 는 창고에 100 개 준비하라는 뜻인가? 만약 실제로 200 개가 팔릴 확률이 20% 라면, 창고에 100 개만 준비하면 20% 확률로 매진. Point forecast 는 이 편차 정보를 담지 못한다.

Quantile forecast 는 각 지평에서 여러 quantile $\tau \in \{0.1, 0.5, 0.9, \ldots\}$ 을 예측: "10% 확률로 이하", "50% 확률로 이하 (중앙값)", "90% 확률로 이하". P90 예측이 200 개면 "판매량이 200 개를 넘을 확률은 10%" — 창고 예비 결정에 직접 사용 가능.

## 수식

TFT 는 각 지평 $\tau \in \{1, \ldots, \tau_{\max}\}$ 에서 여러 quantile $q \in \{0.1, 0.5, 0.9, \ldots\}$ 을 direct multi-quantile output 으로 뽑는다:
$$\hat{y}(q, t, \tau) = W_q \delta_t + b_q$$

- **기호 뜻**: $\hat{y}(q, t, \tau)$ = 시점 $t$ 에서 지평 $\tau$ 앞을 볼 때 quantile $q$ 예측치. $\delta_t$ = decoder 위치 $t + \tau$ 의 최종 표현 (attention + FFN + gate 통과 후). $W_q, b_q$ = quantile 별 output projection.
- **일상 비유**: 하나의 예측기가 여러 개의 눈금 (0.1, 0.5, 0.9) 을 동시에 읽어주는 것.
- **왜 이 형태**: quantile 별 독립 head 라서 학습·계산 단순. 하지만 quantile crossing (낮은 $q$ 의 예측이 높은 $q$ 예측을 초과) 이 발생할 수 있다.
- **조심할 점**: quantile crossing 을 저자가 명시적 제약으로 강제하지 않음. TimesFM v2.5 는 이후 이걸 `fix_quantile_crossing=True` 로 후처리하는데, 이는 TFT 시대에도 이미 알려진 issue 였음이 후향적으로 확인.

## Pinball Loss (Quantile Loss)

각 quantile $q$ 에 대해 asymmetric absolute error 인 pinball loss (또는 quantile loss):
$$QL(y, \hat{y}, q) = q \cdot \max(y - \hat{y}, 0) + (1-q) \cdot \max(\hat{y} - y, 0)$$

- **기호 뜻**: 실제값 $y$ 가 예측값 $\hat{y}$ 를 초과하면 (`y - ŷ > 0`) 편차에 $q$ 를 곱해서 벌점. 미달하면 (`ŷ - y > 0`) 편차에 $1-q$ 를 곱해서 벌점. $q = 0.5$ 이면 대칭 (= median 절대 오차의 1/2), $q = 0.9$ 이면 초과에 무거운 벌점.
- **일상 비유**: "학생이 시험을 통과 (pass) 하는데 얼마나 여유가 있는지" 를 재고자 할 때, 통과 못 한 학생 (부족) 에게는 부족분 × 0.9 만큼 벌점, 통과한 학생 (초과) 에게는 초과분 × 0.1 만큼 벌점 → 벌점 최소화하는 예측 = 90% 학생을 통과시키는 threshold.
- **왜 이 형태**: convex, subgradient 가 존재, SGD 로 학습 가능. 예측값이 진짜 $q$-quantile 일 때 기댓값이 최소가 됨 (증명: pinball loss 의 derivative 가 $q$-quantile 에서 0).
- **조심할 점**:
  - $q$-quantile 은 population 개념 — sample 에서 pinball loss 최소화는 empirical $q$-quantile 로 수렴, 그런데 sample 이 적으면 extreme quantile (P99) 은 신뢰도 낮음.
  - Loss 가 non-smooth (max 함수) 라 (subgradient 계산 가능) 하지만 어떤 학습기는 smoothing 이 필요.
  - Quantile crossing 제약 없음.

## 전체 학습 목적

모든 시점·지평·quantile 을 aggregate:
$$\mathcal{L}(\Omega, W) = \sum_{y_t \in \Omega} \sum_{q \in \mathcal{Q}} \sum_{\tau=1}^{\tau_{\max}} \frac{QL(y_t, \hat{y}(q, t-\tau, \tau), q)}{M \tau_{\max}}$$

- **기호 뜻**: $\Omega$ = 학습 셋, $M = |\Omega|$, $\mathcal{Q} = \{0.1, 0.5, 0.9\}$ (또는 $\{0.05, 0.10, \ldots, 0.95\}$; 논문은 여러 quantile set 을 실험).
- **왜 이 형태**: 모든 quantile head 를 동시 학습. 학습 시 gradient 가 모든 head 에 동시 흐름.

## 평가 metric: q-Risk

$$\rho_q = \frac{2 \sum_{y_t \in \tilde{\Omega}} \sum_\tau QL(y_t, \hat{y}(q, t-\tau, \tau), q)}{\sum_{y_t \in \tilde{\Omega}} \sum_\tau |y_t|}$$

- **기호 뜻**: $\tilde{\Omega}$ = test set. 분모의 $\sum |y_t|$ = target 총합. 2 를 곱하는 이유 = $q = 0.5$ 일 때 mean absolute error / target sum 과 스케일 맞춤.
- **일상 비유**: 모든 예측의 총 pinball loss 를 실제 판매량 총합으로 나눈 상대값. "판매액 1 달러 당 quantile 오차 몇 센트" 격.
- **왜 이 형태**: 데이터셋 간 스케일 차이를 정규화 (Electricity 소비량 vs Retail 판매량) → cross-dataset 비교 가능.
- **조심할 점**: 분모가 $|y_t|$ 라 $y_t$ 가 0 근처인 sample (드문 이벤트) 에서 metric 이 폭발. 저자는 실험에서 안정적인 데이터셋만 선택.

## 실험에서 사용된 quantile set

- Electricity, Traffic, Volatility, Retail 4 도메인 모두 $q \in \{0.1, 0.5, 0.9\}$ (P10, P50, P90) 을 주요 metric 으로 보고.
- 논문 어딘가에서 $q \in \{0.05, 0.1, \ldots, 0.95\}$ 도 언급 (WebSearch 인덱스 verbatim "TFT is trained to produce a set of conditional quantile forecasts for quantiles τ ∈ {0.05, 0.10, ..., 0.95}") — 즉 학습은 dense grid, 보고는 sparse (P10/P50/P90).

## 대안 접근

1. **Parametric 확률 예측 (DeepAR)**: Gaussian/NB 파라미터 (μ, σ) 예측. Quantile 은 파라미터 → 분포함수 → quantile 로 계산. 장점: quantile crossing 없음. 단점: 분포 형태 오지정 (misspecification) 위험.

2. **Non-parametric CDF prediction**: implicit quantile network (IQN, 강화학습 Dabney 2018) — quantile 을 랜덤 샘플로 뽑아 conditional. 장점: 어느 quantile 이든 뽑을 수 있음. 단점: 특정 quantile 정확도 관리 어려움.

3. **Conformal prediction**: 학습 후 calibration set 으로 residual 분포를 estimate 해 quantile 을 postprocess. Distribution-free coverage guarantee 확보. 후속 계보로 TFT + conformal 조합이 있다.

4. **Diffusion-based probabilistic (TimeGrad, ScoreGrad)**: DDPM 을 시계열에 이식. Chronos, TimesFM 같은 foundation model 이 아직 완전 도입 못 한 방향.

## 이 부분의 핵심 한 문장

**Multi-quantile head + pinball loss 는 forecasting 실무의 확률 예측 표준을 확립한 조율이지만, quantile crossing 을 architecture 로 강제 안 하는 것 (v2.5 TimesFM 이 fix_quantile_crossing 옵션으로 후처리) 이 TFT 이후 계보에서 반복되는 미해결 항목이다.**
