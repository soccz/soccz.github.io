# 06. 실험 해부

## 배경 사다리

이 절을 이해하려면 두 가지: ① **Sharpe ratio** = (연 초과수익률) / (연 변동성). Fin ML 표준 성과 지표. ② **Sortino ratio** = (연 초과수익률) / (연 downside 변동성 만). Sharpe 가 up-move 도 벌하는 것 vs Sortino 는 손실만 벌함. Tail-aware 지표.

## 1. 데이터셋 구성

### 1.1 50 개 선물 상품

**WebSearch verbatim 확인**:
> *"50 futures contracts: 25 commodity contracts, 11 equity index contracts, 5 fixed income contracts, and 9 forex contracts."*

| 자산군 | 개수 | 예시 (표준 선물 유동성 최상위) |
|---|---|---|
| Commodities (원자재) | 25 | WTI 원유, Brent 원유, 천연가스, 금, 은, 구리, 옥수수, 밀, 대두, 커피, 코코아, 설탕, 알루미늄, 아연, 니켈, 백금, 팔라듐, 난방유, 가솔린, 소맥, 목재, 소, 돼지 등 (정확 리스트 본문 확인 필요) |
| Equity Indices (주가지수) | 11 | S&P500, Nasdaq100, Russell2000, FTSE100, DAX, CAC40, Nikkei225, Hang Seng, ASX200, TOPIX, KOSPI200 등 |
| Fixed Income (국채) | 5 | US 10Y (TY), US 30Y (US), Bund, JGB, Gilts 등 |
| FX (환율) | 9 | EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD, NZD/USD, EUR/JPY, EUR/GBP 등 |

**적합성**: 50 개 상품 다양성은 (i) asset class 커버리지 최대화, (ii) cross-asset 학습 정당화 (다양성 없으면 vol-scaling 이 무의미), (iii) TSMOM 원 논문 (Moskowitz 2012) 이 사용한 similar universe 와 비교 가능.

### 1.2 시간 범위

**2011 년 – 2019 년 (약 9 년)**.

- **Train**: 정확 split 미확인. 통상 초기 60-70 % 를 train 으로.
- **Val**: hyperparameter tuning 용, 몇 년 배분 미확인.
- **Test**: 최근 2-3 년 out-of-sample. 정확 미확인.

**숨은 편향**:
- **Survivorship bias**: "50 개 유동성 최상위" 는 사후 선정. 2010 년 이전에 사라진 illiquid 상품 제외.
- **Backfill bias**: 신규 상장 상품이 있으면 그 이전 데이터가 backfill 될 수 있음.
- **Post-crisis regime**: 2011-2019 는 대체로 low-vol regime + 지속적 금리 인하 시기. Regime dependence 강할 가능성.
- **2020 년 이후 미포함**: Covid 유동성 shock, 인플레 급등 시기 out-of-sample 미검증.

### 1.3 데이터 소스 (추정)

- **Pinnacle Data Corp** (표준 상용 futures database), CQG, Bloomberg 등 유료 상용 데이터. 저자 공개 미확인.
- Front-month contract, roll 처리는 표준 (Panama method or ratio-adjusted). 정확 방식 미확인.

## 2. 베이스라인

### 2.1 TSMOM (Time Series Momentum) — Moskowitz·Ooi·Pedersen 2012

**규칙**: 지난 12 개월 수익률 부호대로 포지션.

$$a_t^{\text{TSMOM}} = \text{sign}(r_{t-252, t}) \cdot \frac{\sigma_{\text{tgt}}}{\sigma_{t-1}}$$

여기서 $r_{t-252, t}$ = 지난 252 거래일 (약 12 개월) 수익률.

**공정성 검토**:
- TSMOM 도 vol-scaling 을 적용 → 본 논문 DRL 과 동등 조건 (WebSearch 로 정성 확인, 정확 정의 원문 확인 필요)
- Lookback = 12 개월은 원 저자 (Moskowitz 2012) 표준. 만약 3-6-12 개월 blended 로 튜닝하면 격차 축소 가능.

### 2.2 Long-only (Buy-and-hold) — 추정

각 자산 매수 유지. Directional 하지 않은 최소 baseline.

### 2.3 MACD signal-based — 추정

MACD signal 부호로 포지션. Rule-based 대안 baseline.

### 2.4 Sign(r_t) — 추정

전날 수익률 부호 → 오늘 포지션. 매우 단순 mean-reversion / momentum baseline.

**공정성 요구**: 모든 baseline 이 동일 (i) transaction cost, (ii) vol scaling, (iii) universe 로 백테스트되어야 함. 이 처리가 정확한지 본문 확인 필요.

## 3. 지표 선택

**WebSearch verbatim 확인**: Sharpe ratio, Sortino ratio 사용. 추정:
- **Annualized return** — 연 환산 수익률
- **Annualized volatility** — 연 환산 변동성
- **Sharpe** = ann return / ann vol
- **Sortino** = ann return / ann downside vol
- **Max Drawdown (MDD)** — 최대 낙폭
- **Calmar ratio** = ann return / |MDD|
- **Hit ratio** — 양수 return 일수 비율
- **P&L per position** — 포지션당 손익

**지표 편향**:
- Sharpe 만 보면 tail-heavy 자산 (원자재) 이 유리. Sortino 로 보완.
- MDD 는 최악의 순간을 보여줌 — long-tail regime 취약성 진단.
- 만약 metric 이 Sharpe 만 이었다면 **volatility scaling 이 자연 우세** (vol 을 상수화 → Sharpe 계산 시 분모 안정) → 어떤 metric 이 결과에 결정적인지 sensitivity 원문 확인 필요.

## 4. 주요 표·그림 해석 (추정)

**본문 PDF 차단**으로 정확한 Table/Figure 위치는 미확인. WebSearch 로부터 다음을 추론:

- **Table 3** (추정): 3-알고리즘 × 4-자산군 × 3-metric 결과 그리드. DQN 이 대부분 우세.
- **Figure 3** (추정): Cumulative P&L 곡선. DQN 이 가장 가파른 상승, TSMOM 이 완만.
- **Table 4** (추정): Per-asset-class breakdown. Commodities/Equity 우세, FX 열세 추정 (FX 는 mean-reverting 성분 강함 → momentum RL 상대적 취약).
- **Table 5** (추정): Transaction cost sweep. 1bp → 4bp 증가 시 성능 열화 정도. Discrete algorithms (DQN/PG) 이 continuous (A2C) 보다 열화 완만 예상.

## 5. Ablation (저자가 넣었을 것 vs 숨겼을 것)

**저자가 명시 넣었을 것 (추정)**:
- Vol-scaling on vs off (핵심 기여)
- Discrete vs continuous action
- Transaction cost sweep
- Baseline 비교 (TSMOM, MACD, long-only, sign)

**저자가 넣지 않았을 것 (숨겼을 것) 추정**:
- Random seed 통계 (평균만 보고, 분산 miss 가능성)
- Hyperparameter sensitivity (learning rate, γ, ε schedule)
- Lookback window sweep (60일이 optimal 인지)
- σ_tgt sweep
- Feature sweep (MACD vs RSI vs 둘 다 vs 추가 feature)
- LSTM 구조 sweep (layer 수, hidden units)
- Failure mode analysis (어떤 자산·기간에 실패했는가)

## 6. 부록에 숨은 신호 (추정)

Appendix 통상 담기는 것 (본 논문 확인 필요):
- Full asset list (50 개)
- Hyperparameter table
- Additional statistical tests
- Per-asset raw results

**본문 PDF 차단**으로 Appendix 세부 미확인.

## 7. 수치 투명성

**정확한 수치 원문에 있으나 본 환경 미확인**:
- 3-알고리즘 각각의 Sharpe/Sortino (Table 3 추정)
- TSMOM 대비 우수 폭 (몇 %)
- MDD, hit ratio
- P&L per asset class
- Transaction cost sweep 곡선

**정확한 수치 원문에도 없을 가능성 (통상 논문 sparsity)**:
- Seed 별 std
- Per-asset raw performance
- 실패 사례 breakdown

**본 해체에서는 이 모든 수치를 "본문 PDF 차단으로 단정 안 함" 처리**. 검증된 것만: DQN 1위, A2C 2위, PG 3위, 3-알고리즘 모두 TSMOM 상회, cost 반영 후 여전히 흑자 — 이 정성 결과만 확정.

## 8. 실험 설계의 강점

1. **50-scale asset diversity**: single-asset 실험 (Deng 2016 등) 대비 일반화 주장 근거 강함
2. **9-year time span**: 2011 유럽 debt crisis, 2015 중국, 2018 vol shock 포함 → 다양한 regime 통과
3. **다층 baseline**: TSMOM (강한 baseline) + long-only + MACD rule + Sign rule → algorithmic contribution 명확 격리
4. **Cost 명시 반영**: reward 안에 포함 → 실무 적용성 강조
5. **Cross-algorithm 비교**: DQN vs PG vs A2C 3-종 스윕 → single-algorithm cherry-picking 회피

## 9. 실험 설계의 약점

1. **Survivorship bias**: 사후 선정 universe (실무 배포 시 실제 universe 는 이보다 열등)
2. **Roll cost 미명확**: futures 롤오버 비용 반영 여부 확인 필요
3. **Slippage 미반영**: linear proportional cost 만
4. **Seed 통계 부재 (추정)**: 평균만 보고, 분산 미보고 가능성
5. **Regime dependence 미분석**: 2011-2019 는 대체로 low-vol → 2020 년 이후 out-of-sample 미검증
6. **Baseline 튜닝 정도**: TSMOM 을 "off-the-shelf" 로 둔 것 vs 튜닝한 것 이 차이 있을 수 있음

## 이 부분의 핵심 한 문장

**"50 futures (25 comm + 11 eq + 5 FI + 9 FX) × 2011-2019 × Sharpe/Sortino/cost-sweep 의 3-축 실험격자로 DRL 정책이 TSMOM 을 상회함을 실증하되, survivorship bias · seed 통계 부재 · post-2019 out-of-sample 미검증 등의 한계가 남는다."**
