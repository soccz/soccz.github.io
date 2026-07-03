# 05c. 방법론 (C) — Volatility-Scaled Reward

## 배경 사다리

이 절을 이해하려면 세 가지: ① **변동성** (volatility) = 자산 가격 로그수익률의 표준편차. 통상 연 환산해서 표현 (10%, 15% 등). ② **EWMA** (Exponentially Weighted Moving Average) = 과거 관측치에 지수적으로 감쇠하는 가중치를 부여해 최근 관측 중시. RiskMetrics · JP Morgan 리스크 관리 표준. ③ **Target-vol scaling** = 실무의 표준 리스크 관리 기법 — "이 전략의 실현 변동성이 목표 (예: 10%) 이 되도록 매일 leverage 조정". Bridgewater All Weather 등 헤지펀드 표준.

## 1. 왜 이 부분이 필요한가

**문제 1: Cross-asset scale 이질성**. 원유 (WTI) 는 하루 로그수익률 표준편차 약 0.02 (연 32%), 미국 10 년 국채 (TY) 는 약 0.003 (연 5%). Raw reward $R_t = a_t \cdot r_t$ 를 그대로 쓰면 원유 signal 이 국채 signal 보다 10 배 큰 학습 신호. 결과: **정책이 원유에 편향**, 국채는 학습 못 함.

**문제 2: 학습 신호 노이즈**. High-vol 구간 (2011 유럽 debt crisis, 2015 China 파장) 에서는 reward 변동이 크고 학습 signal 이 spurious 하게 커짐. 정책 update 이 noisy vol 에 의해 지배 → 잘못된 방향으로 학습.

**문제 3: 국면 전환 시 리스크**. Low-vol 국면에서 학습된 정책이 vol regime change 후에도 같은 크기 포지션 → 과도한 손실.

## 2. 저자의 답: Volatility Scaling

### 2.1 핵심 수식

**Position sizing** (본 논문 표기 재구성):

$$\tilde{a}_t = a_t \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}}$$

**Return 성분**:

$$R_t^{\text{return}} = \tilde{a}_{t-1} \cdot r_t = a_{t-1} \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}} \cdot r_t$$

**4줄 해석**:
- **기호 뜻**: $a_{t-1}$ = 정책이 정한 표준화된 target position (-1, 0, +1 or [-1,1]). $\sigma_{\text{tgt}}$ = 연 목표 변동성 (통상 10-15%). $\sigma_{t-1}$ = 시각 $t-1$ 까지 알려진 정보로 계산한 사전 변동성 추정 (일 단위, 아래 EWMA). $r_t$ = 시각 $t$ 실현 로그수익률.
- **일상 비유**: "이 상품이 요즘 얼마나 요동치나 (σ_{t-1}) 를 잰 후, 요동이 크면 포지션 작게 (÷ σ_{t-1} 로 축소), 요동이 작으면 크게. 결과적으로 어떤 상품이든 하루 리스크가 목표 수준 (σ_tgt) 이 되도록 자동 조정."
- **왜 이 형태**: (i) cross-asset scale 정규화 (원유·국채 같은 리스크 단위), (ii) 국면 전환 자동 대응 (high-vol → 축소), (iii) 실무 target-vol strategy 관행과 호환 → **domain-natural** 하이퍼파라미터.
- **조심할 점**: (a) low-vol 구간에서 leverage 폭증 위험 (leverage cap 필요할 수 있음, 본 논문 확인 필요), (b) $\sigma_{t-1}$ 는 사전 (ex-ante) 이지 사후 (ex-post) 아님 → look-ahead 방지, (c) vol 자체가 non-stationary → EWMA lookback 선택이 결과에 영향.

### 2.2 σ_{t-1} 계산 (60-day EWMA)

$$\sigma_{t-1}^2 = (1 - \lambda) \sum_{k=1}^{60} \lambda^{k-1} r_{t-k}^2$$

혹은 재귀 형태:
$$\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1 - \lambda) r_t^2$$

**4줄 해석**:
- **기호 뜻**: $\lambda \in (0, 1)$ = 감쇠 인자 (통상 0.94 or half-life 로 지정), lookback = 60 일. RiskMetrics 1996 표준값 $\lambda = 0.94$.
- **일상 비유**: "지난 60 일 동안 이 상품이 하루하루 얼마나 움직였는지 봐서 요즘 것 더 무겁게 (지수감쇠), 옛날 것 덜 무겁게 평균 내기."
- **왜 이 형태**: (i) EWMA 는 non-stationarity 대응이 rolling window 보다 부드럽고, (ii) 재귀 형태로 계산 효율, (iii) 60-일 lookback 은 3 개월 (실무 vol regime 감지 표준).
- **조심할 점**: (a) $\lambda$ 정확 값 본 논문 확인 필요, (b) 60 일이 optimal 인지 sensitivity 확인 필요, (c) intraday vol 무시 (daily bar 기반).

## 3. 전체 Reward 함수 조합

Return 성분 + Cost 성분을 결합:

$$R_t = a_{t-1} \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}} \cdot r_t - c \cdot |a_t - a_{t-1}| \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}}$$

**4줄 해석**:
- **기호 뜻**: $c$ = 거래비용 계수 (bp 단위, e.g. 1 bp = 0.0001). $|a_t - a_{t-1}|$ = 포지션 변화 절댓값 (turnover).
- **일상 비유**: "번 돈에서 매매 수수료 뺀 순이익. 포지션을 크게 바꿀수록 (turnover 큼) 수수료도 크게."
- **왜 이 형태**: (i) proportional cost model — 매매량에 비례 (표준), (ii) cost 도 vol-scaling → 같은 리스크 단위로 정규화, (iii) reward 안에 명시적 반영 → 정책 학습 시 자동 최적화.
- **조심할 점**: (a) slippage · market impact 미반영 (실무 규모에서 중요), (b) linear proportional 만, quadratic term 미반영 (Almgren-Chriss 모델 계열 유사 확장 가능), (c) roll cost (futures 만기 롤오버) 반영 여부 확인 필요.

## 4. 대안으로 했다면

- **Raw return reward** ($R_t = a_{t-1} \cdot r_t$): 가장 단순. Cross-asset scale 이질성 문제 그대로 노출. Fair baseline 조건에서 학습 불안정 예상.
- **Sharpe-based reward** ($R_t = \text{rolling Sharpe}$): 배치별 Sharpe 계산 후 reward. 저자들이 사용하지 않은 이유는 (i) episode 종료까지 기다려야 하는 delayed reward, (ii) rolling window 선택 hyperparameter 증가.
- **Sortino / CVaR reward**: downside risk 만 벌금. Deep Hedging (Bühler 2019) 의 OCE 정신에 근접. 본 논문 미채택 → 후속작에서 시도 가능성.
- **Differential Sharpe ratio** (Moody·Wu 1997 계승): incremental Sharpe 를 매시점 계산. Differentiable 하나 구현 복잡.

## 5. Volatility scaling 의 side effects

**긍정**:
- Learning stability 대폭 향상 (자산 간 loss scale 균일)
- Multi-asset 단일 모델 학습 가능 (transfer learning 자연스)
- Drawdown 완화 (vol spike 시 자동 축소)

**부정**:
- Low-vol 국면 leverage 폭증 (EMU crisis 직전 등 sudden regime change 취약)
- Cost 도 스케일링됨 → high-vol 자산의 cost 부담 감소 (vs low-vol 자산 상대적 페널티)
- σ_target 이 hyperparameter → sensitivity 확인 필요 (본 논문 미확인)

## 이 부분의 핵심 한 문장

**"σ_tgt / σ_{t-1} 곱셈 스케일링으로 raw return 을 target-vol 단위로 정규화, cross-asset 학습 안정성 + 국면 자동 대응 + 실무 리스크 관리 관행 호환 3 가지 이점을 한 번에 확보했다."**
