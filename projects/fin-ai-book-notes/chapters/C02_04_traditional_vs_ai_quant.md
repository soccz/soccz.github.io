# 2.6 전통 퀀트 vs. AI 퀀트 — *Classical Quant vs. AI-based Quant*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), §2.6 (pp.52–56)
> **원서 분량**: 약 5쪽 (8가지 차이점 + 5대 전통 전략 + 6대 AI 영역)
> **해설 분량**: 약 28쪽
> **읽는 데 걸리는 시간**: 약 50분

---

## 🪧 이 절을 한 줄로

> 전통 퀀트는 **규칙·통계** 기반, AI 퀀트는 **데이터에서 학습**.
> 둘은 8가지 차원에서 다르고, **5대 전통 전략**과 **6대 AI 영역** 으로 구체화된다.

책은 8가지 차이점을 나열한 후 5대 전통 전략 (평균회귀·추세추종·페어·요인·이벤트) 과 6대 AI 영역 (포트폴리오·예측·신호·텍스트마이닝·시뮬레이션·리스크) 을 짧게 다룬다. 이 해설집은:
1. **8가지 차이를 표** 로 한눈에
2. **5대 전통 전략을 코드 + 백테스트** 결과로
3. **6대 AI 영역의 실제 모델 매핑**

### 📍 미리 그릴 큰 그림

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">전통 퀀트 vs. AI 퀀트 — 8개 차원의 차이</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Traditional -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">📊 전통 퀀트</text>
    <rect x="40" y="70" width="280" height="200" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="60" y="92" font-size="10" fill="#1c1917">① 통계 + 규칙 기반</text>
    <text x="60" y="112" font-size="10" fill="#1c1917">② 구조화된 데이터</text>
    <text x="60" y="132" font-size="10" fill="#1c1917">③ 사전 정의 규칙</text>
    <text x="60" y="152" font-size="10" fill="#1c1917">④ 선형/시계열 예측</text>
    <text x="60" y="172" font-size="10" fill="#1c1917">⑤ 해석 쉬움</text>
    <text x="60" y="192" font-size="10" fill="#1c1917">⑥ 복잡 패턴 한계</text>
    <text x="60" y="212" font-size="10" fill="#1c1917">⑦ 제한된 데이터 처리</text>
    <text x="60" y="232" font-size="10" fill="#1c1917">⑧ 시장 변동 적응 느림</text>
    <text x="180" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="#5a7a96">예: Fama-French 3 Factor</text>
    <!-- AI -->
    <text x="580" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">🤖 AI 퀀트</text>
    <rect x="440" y="70" width="280" height="200" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="460" y="92" font-size="10" fill="#1c1917">① 데이터로부터 학습</text>
    <text x="460" y="112" font-size="10" fill="#1c1917">② 구조 + 비정형 (텍스트/이미지)</text>
    <text x="460" y="132" font-size="10" fill="#1c1917">③ 자동 학습</text>
    <text x="460" y="152" font-size="10" fill="#1c1917">④ 비선형 패턴 모델</text>
    <text x="460" y="172" font-size="10" fill="#1c1917">⑤ 블랙박스 (해석 어려움)</text>
    <text x="460" y="192" font-size="10" fill="#1c1917">⑥ 복잡 패턴 강함</text>
    <text x="460" y="212" font-size="10" fill="#1c1917">⑦ 대규모 데이터 처리</text>
    <text x="460" y="232" font-size="10" fill="#1c1917">⑧ 시장 변동 빠른 적응</text>
    <text x="580" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="#3a7d44">예: XGBoost, LSTM, RL</text>
  </g>
</svg>

---

## 🟢 [초급] — 일상 비유로 잡는 감

### 1. 전통 vs. AI 퀀트 — 요리사 비유

#### 전통 퀀트 = 레시피대로 요리하는 셰프
```
1. 양파 1개 다지고
2. 기름 2T 두르고
3. 5분 볶고
4. 양념 추가
   → 항상 같은 맛
```

#### AI 퀀트 = 손님 반응 보며 배우는 셰프
```
1. 1000명 손님에게 요리 제공
2. "맛있다 / 별로" 피드백 수집
3. 패턴 학습: "단 거 좋아하는 사람엔 설탕 +"
4. 점점 더 잘 맞춤
   → 손님마다 다른 맛
```

### 2. 8가지 차이 한 줄 요약

| 차원 | 전통 퀀트 | AI 퀀트 |
|------|---------|---------|
| 1. 접근 | "규칙대로" | "데이터에서 학습" |
| 2. 데이터 | 표 (가격, 재무) | + 텍스트, 이미지 |
| 3. 모델 | 사람이 정함 | 자동 학습 |
| 4. 예측 | 선형 (직선) | 비선형 (곡선) |
| 5. 해석 | "왜 그랬는지" 명확 | 블랙박스 |
| 6. 복잡 패턴 | 한계 | 강함 |
| 7. 데이터 양 | 제한적 | 대규모 |
| 8. 시장 적응 | 느림 | 빠름 |

### 3. 5대 전통 퀀트 전략 — 한 줄 비유

| 전략 | 한 줄 비유 | 대표 인물 |
|------|----------|---------|
| **평균 회귀** | "고무줄은 늘어났다 줄어든다" | Larry Connors |
| **추세 추종** | "비 오는 날 우산 든다" | David Harding |
| **페어 트레이딩** | "삼성 vs. SK하이닉스" | David Shaw |
| **요인 모델** | "비싼 게 결국 떨어진다" | Cliff Asness |
| **이벤트 기반** | "M&A 발표 → 매수" | John Paulson (M&A arb), Paul Singer (Elliott) |

### 4. 6대 AI 퀀트 영역 — 한 줄 비유

| 영역 | 한 줄 비유 |
|------|----------|
| **포트폴리오 최적화** | AI가 자산 비중 자동 조정 |
| **시장 동향 예측** | AI가 내일 주가 추정 |
| **신호 기반 트레이딩** | AI가 매수/매도 자동 결정 |
| **텍스트 마이닝** | AI가 뉴스 읽고 시장 영향 분석 |
| **거래 전략 학습** | AI가 시뮬레이션으로 전략 진화 |
| **리스크 관리** | AI가 손실 미리 예측 |

> ✅ **여기까지 따라왔으면**: 두 접근법의 큰 차이와, 각각의 대표 전략이 보일 거다.

---

## 🟡 [중급] — 5대 전통 전략과 코드

### 1. 평균 회귀 (Mean Reversion)

#### 1.1 핵심 아이디어
> "가격은 평균으로 돌아가려는 경향이 있다."

수학적으로:
$$ \text{Z-Score} = \frac{P_t - \mu}{\sigma} $$

- $P_t$: 현재 가격
- $\mu$: 과거 N일 평균
- $\sigma$: 과거 N일 표준편차

**규칙**:
- Z > +2: 과매수 → 매도
- Z < -2: 과매도 → 매수

#### 1.2 볼린저 밴드 (Bollinger Bands)

평균 회귀 전략의 가장 유명한 도구:

```
상단 밴드 = 20일 평균 + 2σ
중간 밴드 = 20일 평균
하단 밴드 = 20일 평균 - 2σ
```

<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="400" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">볼린저 밴드 — 평균 회귀의 시각화</text>
  <line x1="60" y1="230" x2="700" y2="230" stroke="#1c1917" stroke-width="1.5"/>
  <line x1="60" y1="230" x2="60" y2="50" stroke="#1c1917" stroke-width="1.5"/>
  <!-- Upper band -->
  <path d="M 60 90 Q 200 80, 360 95 T 700 100" fill="none" stroke="#c4724e" stroke-width="2"/>
  <text x="710" y="95" font-size="10" fill="#c4724e">상단 (+2σ)</text>
  <!-- Mean -->
  <path d="M 60 140 Q 200 135, 360 145 T 700 150" fill="none" stroke="#5a7a96" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="710" y="145" font-size="10" fill="#5a7a96">평균 (μ)</text>
  <!-- Lower band -->
  <path d="M 60 190 Q 200 195, 360 195 T 700 200" fill="none" stroke="#c4724e" stroke-width="2"/>
  <text x="710" y="195" font-size="10" fill="#c4724e">하단 (-2σ)</text>
  <!-- Price -->
  <path d="M 60 150 Q 100 100, 150 130 Q 200 95, 250 110 Q 300 180, 350 175 Q 400 195, 450 200 Q 500 140, 550 100 Q 600 95, 650 130 Q 680 150, 700 145" fill="none" stroke="#1c1917" stroke-width="2.5"/>
  <text x="100" y="80" font-size="10" fill="#c4724e" font-weight="700">매도!</text>
  <text x="100" y="100" font-size="9" fill="#c4724e">(과매수)</text>
  <text x="450" y="220" font-size="10" fill="#3a7d44" font-weight="700">매수!</text>
  <text x="450" y="245" font-size="9" fill="#3a7d44">(과매도)</text>
</svg>

#### 1.3 Python 코드 예시

```python
import pandas as pd
import numpy as np
import FinanceDataReader as fdr

# 삼성전자 데이터
df = fdr.DataReader('005930', '2023-01-01', '2024-05-15')

# 볼린저 밴드 계산
window = 20
df['MA20'] = df['Close'].rolling(window).mean()
df['STD20'] = df['Close'].rolling(window).std()
df['Upper'] = df['MA20'] + 2 * df['STD20']
df['Lower'] = df['MA20'] - 2 * df['STD20']

# 신호 생성
df['Signal'] = 0
df.loc[df['Close'] < df['Lower'], 'Signal'] = 1   # 매수
df.loc[df['Close'] > df['Upper'], 'Signal'] = -1  # 매도

print(df[['Close', 'Upper', 'Lower', 'Signal']].tail(10))
```

### 2. 추세 추종 (Trend Following)

#### 2.1 핵심 아이디어
> "올라가는 건 더 올라가고, 내려가는 건 더 내려간다."

#### 2.2 이동평균 교차 (Moving Average Crossover)

```
단기 MA (5일) > 장기 MA (20일) → 매수 (Golden Cross)
단기 MA (5일) < 장기 MA (20일) → 매도 (Dead Cross)
```

#### 2.3 듀얼 모멘텀 (Dual Momentum) — Gary Antonacci

```
1. Relative Momentum: 자산들 중 상대적으로 강한 것 선택
2. Absolute Momentum: 절대적으로 양의 모멘텀 확인
3. 둘 다 만족 시 매수
```

#### 2.4 Python 코드

```python
# 듀얼 모멘텀 신호
df['MA5'] = df['Close'].rolling(5).mean()
df['MA20'] = df['Close'].rolling(20).mean()

# 12개월 모멘텀 (절대)
df['Returns_12M'] = df['Close'].pct_change(252)

# 신호
df['Signal'] = 0
df.loc[(df['MA5'] > df['MA20']) & (df['Returns_12M'] > 0), 'Signal'] = 1
```

### 3. 페어 트레이딩 (Pairs Trading)

#### 3.1 핵심 아이디어
> "비슷한 두 자산의 가격 차이가 벌어졌다 → 곧 좁혀진다."

#### 3.2 예시: 삼성전자 vs. SK하이닉스

두 종목이 반도체 산업 동조 → 일시적으로 차이 벌어지면 페어 매매.

```
삼성전자 가격 ↑ 5% / SK하이닉스 가격 ↓ 3%
   → 스프레드 +8% (비정상)
   → 삼성전자 매도 + SK하이닉스 매수
   → 스프레드 좁혀지면 청산 → 차익
```

#### 3.3 통계적 페어 (Statistical Arbitrage)

수학적으로 두 종목의 공적분 (Cointegration) 검증:
$$ P_A - \beta \cdot P_B = \text{stationary} $$

**Engle-Granger** 또는 **Johansen** 검정 사용.

#### 3.4 Python 코드

```python
from statsmodels.tsa.stattools import coint

# 두 종목 데이터
samsung = fdr.DataReader('005930', '2023-01-01')['Close']
hynix = fdr.DataReader('000660', '2023-01-01')['Close']

# 공적분 검정
score, p_value, _ = coint(samsung, hynix)
print(f"Cointegration p-value: {p_value}")  # <0.05면 페어 가능

# 스프레드 계산
ratio = samsung / hynix
z_score = (ratio - ratio.mean()) / ratio.std()

# 매매 신호
signal = np.where(z_score > 2, -1, np.where(z_score < -2, 1, 0))
```

### 4. 요인 모델 (Factor Model)

#### 4.1 핵심 아이디어
> "주가는 몇 가지 공통 요인 (가치, 크기, 모멘텀) 으로 설명된다."

#### 4.2 Fama-French 3 Factor

$$ r_i - r_f = \alpha + \beta_M (r_M - r_f) + \beta_{SMB} \text{SMB} + \beta_{HML} \text{HML} + \varepsilon $$

- **SMB** (Small Minus Big): 소형주 - 대형주 수익
- **HML** (High Minus Low): 가치주 (저 P/B) - 성장주 수익

#### 4.3 5 Factor (Fama-French 2015)

3 Factor + **RMW** (Robust Minus Weak, 수익성) + **CMA** (Conservative Minus Aggressive, 투자).

#### 4.4 한국에서의 검증

| 요인 | 한국 수익률 (연 평균, 2000-2020) |
|------|------------------------|
| Market (Mkt-RF) | +5.2% |
| Size (SMB) | +2.5% |
| Value (HML) | +3.1% |
| Momentum (UMD) | +1.8% |

### 5. 이벤트 기반 전략 (Event-Driven)

#### 5.1 종류

| 이벤트 | 매매 |
|--------|------|
| M&A 발표 | 대상 기업 매수 (인수 가격에 수렴) |
| 실적 발표 (Earnings) | 발표 전 매수, 후 매도 |
| IPO | 첫날 매수 |
| 분할 (Spin-off) | 신주 매수 |
| 배당락 | 배당락 후 매수 |

#### 5.2 M&A 차익 거래 (Merger Arbitrage)

```
A사가 B사를 주당 $50에 인수 발표
B사 현재 가격: $45
   → B사 매수, A사 매도
   → 인수 성공 시 $5 차익
   → 인수 실패 시 손실 큼
```

#### 5.3 어닝 서프라이즈 (Earnings Surprise)

```python
# 실적 발표 후 PEAD (Post-Earnings Announcement Drift)
# - 어닝 서프라이즈 (예상 > 실제) → 1~3개월간 추가 상승 경향

# 컨센서스 수집 (에프앤가이드, Refinitiv 등)
# 실적 발표 → Surprise 계산
# Surprise > 0 → 매수
```

### 6. 5대 전략 비교 표

| 전략 | 보유 기간 | 변동성 | 시장 환경 | 한국 적용 |
|------|--------|------|---------|---------|
| 평균 회귀 | 단기 (일~주) | 중간 | 안정 시장 | ★★★ |
| 추세 추종 | 중장기 (월~년) | 큼 | 트렌드 시장 | ★★ |
| 페어 트레이딩 | 단기 (일~월) | 작음 | 모든 시장 | ★★★★ |
| 요인 모델 | 장기 (년) | 작음 | 효율적 시장 | ★★★ |
| 이벤트 기반 | 단기 (일~월) | 큼 | 특정 상황 | ★★ |

---

## 🔴 [고급] — 6대 AI 영역 깊이 보기

### 1. 포트폴리오 최적화 (Portfolio Optimization)

#### 1.1 기존 vs. AI

**기존 (Markowitz)**:
- 평균-분산 최적화
- 한계: 정규분포 가정, 외삽 불가

**AI 기반**:
- ML로 수익률 예측 → 입력
- DL로 비선형 관계
- RL로 동적 리밸런싱

#### 1.2 알고리즘
- **Mean-Variance**: 전통
- **Risk Parity**: 위험 균등 (Bridgewater)
- **Black-Litterman**: 베이지안
- **Hierarchical Risk Parity** (López de Prado): 클러스터링 기반

### 2. 시장 동향 예측 (Price Prediction)

#### 2.1 모델 종류

| 모델 | 입력 | 출력 | 활용 |
|------|------|------|------|
| **ARIMA** | 가격 시계열 | 다음 가격 | Baseline |
| **GARCH** | 수익률 | 변동성 | 옵션 가격 |
| **LSTM** | 가격 + 거래량 | 다음 N일 | DL 표준 |
| **Transformer** | 멀티변수 | 시퀀스 | 최신 |
| **XGBoost** | 기술지표 | Up/Down | 분류 |

#### 2.2 시장 예측의 함정
- **Efficient Market Hypothesis**: 과거로 미래 예측 어려움
- **Random Walk**: 가격은 거의 무작위
- → 통계적 우위는 작음 (51~53%)

### 3. 신호 기반 트레이딩 (Signal-Based Trading)

#### 3.1 신호의 종류

| 신호 | 출처 | 빈도 |
|------|------|------|
| **가격 신호** | 기술적 지표 | 일~분 |
| **펀더멘털 신호** | 재무제표 | 분기 |
| **감정 신호** | 뉴스/SNS NLP | 실시간 |
| **거시 신호** | 금리, 환율 | 일 |

#### 3.2 신호 결합 (Signal Combination)

여러 신호를 ML로 결합:
```python
features = ['momentum', 'value', 'sentiment', 'volume']
X = df[features]
y = df['next_day_return']

from xgboost import XGBRegressor
model = XGBRegressor()
model.fit(X, y)
prediction = model.predict(X_new)  # 신호 강도
```

### 4. 텍스트 마이닝 (Text Mining)

#### 4.1 활용 사례
- 뉴스 감정 분석 → 가격 예측
- 트위터 분석 → 단기 변동
- 회의록 (Fed FOMC) → 금리 방향

#### 4.2 LLM 시대의 텍스트 마이닝
- BloombergGPT (2023)
- FinBERT (2019)
- ChatGPT API 활용

#### 4.3 코드 예시

```python
from transformers import pipeline

# FinBERT 감정 분석
classifier = pipeline('sentiment-analysis', model='ProsusAI/finbert')

news = "Samsung Electronics reported record quarterly profits."
result = classifier(news)
# [{'label': 'positive', 'score': 0.95}]
```

### 5. 거래 전략 학습 (Market Simulation / RL)

#### 5.1 강화학습 (RL) 접근

```
State: 가격, 거래량, 포트폴리오
Action: 매수/매도/보유
Reward: 다음 시점 수익률
   → Agent 학습
```

#### 5.2 주요 알고리즘
- **DQN** (Deep Q-Network): 이산 행동
- **PPO** (Proximal Policy Optimization): 연속
- **SAC** (Soft Actor-Critic): 안정성

#### 5.3 FinRL 라이브러리

```python
from finrl.agents.stablebaselines3.models import DRLAgent

agent = DRLAgent(env=trading_env)
model = agent.get_model("ppo")
trained = agent.train_model(model, total_timesteps=100000)
```

### 6. 리스크 관리 (Risk Management)

#### 6.1 AI 활용

| 기능 | 모델 |
|------|------|
| **VaR 예측** | Quantile Regression, Deep Learning |
| **시나리오 분석** | GAN으로 가상 시나리오 생성 |
| **헤지 최적화** | RL |
| **포지션 한도** | XGBoost로 위험도 예측 |

#### 6.2 시계열 변동성 예측

```python
# GARCH(1,1) 변동성 예측
from arch import arch_model

returns = df['Close'].pct_change().dropna()
model = arch_model(returns, vol='Garch', p=1, q=1)
fit = model.fit()
forecast = fit.forecast(horizon=5)
```

---

## 🟣 [전공자] — 학술적 비교와 1차 자료

### 1. 전통 vs. AI 퀀트 — 학술 비교 표

| 차원 | 전통 (Quant 1.0) | AI (Quant 2.0) |
|------|---------------|--------------|
| **이론 기반** | 효율적 시장 (Fama 1970) | 머신러닝 (Vapnik 1995) |
| **수학** | 선형대수, 시계열 | 신경망, 최적화 |
| **데이터 가정** | 정규분포, 정상성 | 분포 자유 |
| **추론** | 통계적 유의성 | 예측 정확도 |
| **알파 원천** | Risk Premia | Pattern Recognition |
| **대표 학자** | Markowitz, Sharpe, Fama | López de Prado, Kelly |

### 2. 5대 전통 전략의 학술 출처

#### 평균 회귀
- Bondt, W. F., & Thaler, R. (1985). Does the stock market overreact? *JoF*, 40(3).
- Lo, A. W., & MacKinlay, A. C. (1988). Stock market prices do not follow random walks. *RFS*, 1(1).

#### 추세 추종
- Jegadeesh, N., & Titman, S. (1993). Returns to buying winners and selling losers: Implications for stock market efficiency. *JoF*, 48(1).

#### 페어 트레이딩
- Gatev, E., Goetzmann, W. N., & Rouwenhorst, K. G. (2006). Pairs trading: Performance of a relative-value arbitrage rule. *RFS*, 19(3).

#### 요인 모델
- Fama, E. F., & French, K. R. (1993). Common risk factors. *JFE*, 33(1).
- Fama, E. F., & French, K. R. (2015). A five-factor asset pricing model. *JFE*, 116(1).

#### 이벤트 기반
- Jensen, M. C., & Ruback, R. S. (1983). The market for corporate control. *JFE*, 11(1).

### 3. AI 퀀트 핵심 학술 자료

#### Gu, Kelly, Xiu (2020)
> "Empirical asset pricing via machine learning"
- 60년 미국 주식 데이터
- **Neural Network이 OLS 대비 Sharpe 2배+**
- 모멘텀 + ML이 최고 성과

#### Kozak, Nagel, Santosh (2020)
> "Shrinking the cross-section"
- 수백 개 팩터 → 약 5개로 압축
- ML의 차원 축소가 성능 향상

### 4. RL in Finance 핵심 논문

> 📄 Deng, Y., Bao, F., Kong, Y., Ren, Z., & Dai, Q. (2016). Deep direct reinforcement learning for financial signal representation and trading. *IEEE Transactions on Neural Networks*, 28(3), 653–664.

> 📄 Théate, T., & Ernst, D. (2021). An application of deep reinforcement learning to algorithmic trading. *Expert Systems with Applications*, 173.

---

### 🟣 [전공자 심화] — AI 퀀트 핵심 논문들의 한계와 후속 연구

#### Gu-Kelly-Xiu(2020) 후속 연구의 핵심 흐름
- **no-arbitrage 제약 부과**: Chen, L., Pelger, M., & Zhu, J. (2024). Deep learning in asset pricing. *Management Science*, 70(2), 714–750. https://doi.org/10.1287/mnsc.2023.4695 — SDF를 GAN 구조로 직접 학습. arXiv:1904.00745.
- **factor zoo 압축**: Kozak, S., Nagel, S., & Santosh, S. (2020). Shrinking the cross-section. *JFE*, 135(2), 271–292. — 베이지안 shrinkage로 SDF를 소수 PC로 압축.
- **종합 서베이**: Kelly, B. T., & Xiu, D. (2023). Financial machine learning. *Foundations and Trends in Finance*, 13(3-4), 205–363. https://doi.org/10.1561/0500000064 — "virtue of complexity": 고차원 ML 모형이 경제적으로도 정당화됨을 정리.
- **복제 위기 검증**: Jensen, T. I., Kelly, B. T., & Pedersen, L. H. (2023). Is there a replication crisis in finance? *Journal of Finance*, 78(5), 2465–2518. — 153개 factor, 93개국 베이지안 검증. NBER WP: https://www.nber.org/papers/w28432.

#### ML 알파의 실질적 한계 — 비판 문헌
- Avramov, D., Cheng, S., & Metzker, L. (2023). Machine learning vs. economic restrictions: Evidence from stock return predictability. *Management Science*, 69(5), 2587–2619. — ML 알파의 큰 부분이 micro-cap·고변동성·무신용등급 종목에 집중. 경제적 제약(liquidity, short-sale) 부과 시 알파 절반 이상 소멸.
- López de Prado, M. (2018). The 10 reasons most machine learning funds fail. *Journal of Portfolio Management*, 44(6), 120–133. — backtest overfitting, 시계열 CV 오용, regime change 등 10가지 실패 원인.

#### Fama-French 모델의 후속 비판
- McLean, R. D., & Pontiff, J. (2016). Does academic research destroy stock return predictability? *Journal of Finance*, 71(1), 5–32. — out-of-sample 26%↓, post-publication 58%↓.
- Harvey, C. R., Liu, Y., & Zhu, H. (2016). … and the cross-section of expected returns. *RFS*, 29(1), 5–68. — 316개 팩터 카탈로그, t > 3.0 임계값 제안.
- Hou, K., Xue, C., & Zhang, L. (2020). Replicating anomalies. *RFS*, 33(5), 2019–2133. — 452개 anomaly의 64%가 NYSE 표준에서 재현 안 됨.

#### 실무 적용 시 주의점
- 한국 시장 ML 적용은 KOSDAQ small-cap에서 알파가 크게 나오는 패턴 — 이는 Avramov et al. 2023의 micro-cap 결과와 일관. 실거래 가능성·슬리피지 반영 시 알파 대부분 소멸 가능.
- 한국형 anomaly(외국인 수급, 기관 동시매수, 공시 후 drift)는 표본이 짧고 regime 의존성 강함. walk-forward CV 필수.
- 학계 백테스트는 NYSE 시총 분위 기준이지만 한국은 KOSPI vs KOSDAQ 이원 시장 — 시장 분리·통합 백테스트가 결과를 좌우.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 시장에서 5대 전략 백테스트 결과

(여러 학술 논문 참조)

| 전략 | KOSPI 백테스트 연수익 | Sharpe |
|------|---------------------|--------|
| 평균회귀 (Bollinger) | 8.5% | 0.45 |
| 추세추종 (Dual Mom) | 11.2% | 0.62 |
| 페어 (반도체) | 6.8% | 0.85 |
| 가치 팩터 (P/B 분위) | 9.5% | 0.55 |
| M&A 차익 | 5.2% | 0.40 |

(주: 거래비용 0.1% 가정, 1995-2024)

### 🔍 보충 2 — 모멘텀 효과의 글로벌 일관성

> Asness, Moskowitz, Pedersen (2013). "Value and momentum everywhere"

- 8개 자산군에서 모멘텀 효과 검증
- 한국에서도 유의
- "**전 세계 어디서나 통하는 알파**"

### 🔍 보충 3 — Smart Beta ETF 한국

- KODEX 모멘텀
- TIGER 모멘텀
- ARIRANG 고배당주
- KODEX MSCI 코리아 ESG

→ 팩터 투자를 ETF로 패시브화.

### 🔍 보충 4 — AI 퀀트의 한국 적용 어려움

- 데이터: 30년 한계
- 시장 변동성: 외환위기, 2008, 코로나 등 큰 충격
- 규제: 공매도 제한 (2024 부분 재개)
- 정책: 자본시장법 변동

### 🔍 보충 5 — Quant vs. ML Engineer 차이

| | Quant | ML Engineer |
|---|---|---|
| **수학** | 통계, 시계열 | 선형대수, 최적화 |
| **언어** | Python, MATLAB, C++ | Python, PyTorch |
| **모델** | GARCH, ARIMA | Neural Net |
| **목표** | 알파 | 정확도 |
| **회사** | 헤지펀드 | 빅테크 |
| **연봉** | $200K~$1M+ | $150K~$500K |

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. 전통 퀀트가 AI 퀀트에 의해 대체되나?

**A.** **부분적으로 대체, 통합이 더 일반적**.
- HFT: AI 우세
- 장기 가치: 전통 유효
- 대부분 펀드: **전통 + AI 혼합**

### Q2. 5대 전통 전략 중 한국에서 가장 잘 통하는 건?

**A.** **페어 트레이딩**. 이유:
- 한국 시장 산업별 동조 강함 (반도체, 자동차)
- 변동성 큰 시장에서 페어가 헤지
- KOSPI 200 등 인덱스 활용 가능

### Q3. 백테스트가 좋으면 실전도 좋은가?

**A.** **아니다**. 차이:
- 거래 비용 (수수료, 슬리피지)
- 시장 영향 (대규모 매매 시 가격 변화)
- 데이터 함정 (생존편향, 미래정보)
- Concept Drift

### Q4. 평균 회귀와 추세 추종이 모순 아닌가?

**A.** **시간 척도가 다름**.
- 평균 회귀: 단기 (일~주, 평균선 근처에서)
- 추세 추종: 중장기 (월~년, 큰 트렌드)
- 둘 다 가능 (시간 척도 분리)

### Q5. 강화학습이 진짜 트레이딩에 쓰이나?

**A.** **연구 단계, 실전 제한적**.
- JPMorgan LOXM: 주문 실행 최적화
- Renaissance: 비공개
- 일반 헤지펀드: 대부분 ML (XGBoost) 중심
- **RL은 환경 모델링이 어려움** (시장은 비정상)

### Q6. 텍스트 마이닝이 주가에 영향?

**A.** **단기적으로 영향, 장기적으로는 미미**.
- 일본 지진 → 토요타 주가 → 트위터에서 먼저 감지 가능
- 그러나 알파가 빠르게 사라짐 (HFT 경쟁)

### Q7. AI 퀀트 학습하려면 뭐부터?

**A.** 순서:
1. Python + pandas
2. 전통 퀀트 (이 책 실습 1)
3. XGBoost (실습 2)
4. LSTM (실습 3)
5. RL (별도 학습)
6. LLM in Finance (Ch6)

---

## 🎯 이 절에서 가져갈 핵심 7가지

1. **전통 vs. AI 퀀트 = 8개 차원의 차이**. 같은 목표, 다른 도구.
2. **5대 전통 전략**: 평균회귀·추세추종·페어·요인·이벤트.
3. **6대 AI 영역**: 포트폴리오·예측·신호·텍스트·시뮬레이션·리스크.
4. **페어 트레이딩이 한국에서 가장 잘 통함**.
5. **Fama-French 5 Factor**가 전통 요인 모델의 학술 표준.
6. **AI 퀀트의 학술 검증**: Gu-Kelly-Xiu (2020) — ML이 OLS 2배+.
7. **백테스트 ≠ 실전** — 거래비용, Concept Drift, 데이터 함정 주의.

---

## 📖 더 읽을거리

### 전통 퀀트
- 강환국. (2017). *할 수 있다! 퀀트 투자*. 에프엔미디어.
- 신진오. (2023). *파이썬 증권 데이터 분석*. 한빛미디어.

### AI 퀀트
- López de Prado, M. (2018). *Advances in Financial Machine Learning*.
- López de Prado, M. (2020). *Machine Learning for Asset Managers*.

### 1차 자료
- Fama, E. F., & French, K. R. (1993). Common risk factors. *JFE*.
- Jegadeesh, N., & Titman, S. (1993). Returns to buying winners. *JoF*.
- Gatev, E., et al. (2006). Pairs trading. *RFS*.
- Gu, S., Kelly, B., & Xiu, D. (2020). Empirical asset pricing via ML. *RFS*.

### RL in Finance
- Théate, T., & Ernst, D. (2021). An application of deep RL to algorithmic trading. *ESWA*.
- FinRL: https://github.com/AI4Finance-Foundation/FinRL

---

> **다음 절 예고** — §2.7 + §2.8 주의사항과 응용사례
> AI 투자의 4가지 함정 (생존편향, 미래참조, 과적합, 해석가능성) 과 위성 데이터·BloombergGPT 같은 실제 사례.
