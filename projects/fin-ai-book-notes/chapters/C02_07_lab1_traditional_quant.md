# 실습 1: 금융 시계열 및 파이썬을 활용한 전통 퀀트 방법 구현 — *Lab 1: Classical Quant in Python*

> **해설 분량**: 약 30쪽 (코드 + 설명 + 확장)
> **소요 시간**: 4~6시간

---

## 🪧 이 실습을 한 줄로

> **데이터 수집 → 기술적 지표 생성 → 백테스팅 → 성과 평가** 의 전통 퀀트 4단계를 코드로 구현.

책은 코드를 던지고 설명을 짧게 단다. 이 해설집은:
1. **각 코드 한 줄씩 풀이**
2. **흔한 에러 + 해결**
3. **한국 주식으로 변형**
4. **확장 과제**

### 📍 실습 전체 흐름

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">실습 1 전체 흐름 — 4단계</text>
  <defs>
    <marker id="ar01" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="40" y="80" width="150" height="100" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="115" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 데이터 수집</text>
    <text x="115" y="125" text-anchor="middle" font-size="10" fill="#1c1917">yfinance</text>
    <text x="115" y="140" text-anchor="middle" font-size="10" fill="#1c1917">FinanceDataReader</text>
    <text x="115" y="158" text-anchor="middle" font-size="10" fill="#1c1917">pykrx</text>
    <text x="115" y="174" text-anchor="middle" font-size="9" fill="#57534e">OHLCV 가져오기</text>
    <line x1="190" y1="130" x2="220" y2="130" stroke="#1c1917" stroke-width="2" marker-end="url(#ar01)"/>
    <rect x="230" y="80" width="150" height="100" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="305" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 기술적 지표</text>
    <text x="305" y="125" text-anchor="middle" font-size="10" fill="#1c1917">TA-Lib</text>
    <text x="305" y="140" text-anchor="middle" font-size="10" fill="#1c1917">SMA, RSI, MACD</text>
    <text x="305" y="158" text-anchor="middle" font-size="10" fill="#1c1917">Bollinger Band</text>
    <text x="305" y="174" text-anchor="middle" font-size="9" fill="#57534e">신호 생성</text>
    <line x1="380" y1="130" x2="410" y2="130" stroke="#1c1917" stroke-width="2" marker-end="url(#ar01)"/>
    <rect x="420" y="80" width="150" height="100" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="495" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ 백테스팅</text>
    <text x="495" y="125" text-anchor="middle" font-size="10" fill="#1c1917">backtrader</text>
    <text x="495" y="140" text-anchor="middle" font-size="10" fill="#1c1917">zipline / bt</text>
    <text x="495" y="158" text-anchor="middle" font-size="10" fill="#1c1917">매수/매도 시뮬레이션</text>
    <text x="495" y="174" text-anchor="middle" font-size="9" fill="#57534e">과거 데이터 검증</text>
    <line x1="570" y1="130" x2="600" y2="130" stroke="#1c1917" stroke-width="2" marker-end="url(#ar01)"/>
    <rect x="610" y="80" width="140" height="100" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="680" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 성과 평가</text>
    <text x="680" y="125" text-anchor="middle" font-size="10" fill="#1c1917">CAGR, MDD</text>
    <text x="680" y="140" text-anchor="middle" font-size="10" fill="#1c1917">Sharpe, Sortino</text>
    <text x="680" y="158" text-anchor="middle" font-size="10" fill="#1c1917">Alpha, Beta</text>
    <text x="680" y="174" text-anchor="middle" font-size="9" fill="#57534e">전략 평가</text>
  </g>
  <text x="380" y="230" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">실습 1의 모든 코드 = 위 4단계의 구현</text>
</svg>

---

## 🟢 [초급] — 환경 셋업과 데이터 수집

### 1. 사전 준비

#### 1.1 Python 환경

```bash
# Python 3.10+ 권장
python --version

# 가상환경 생성
python -m venv finai_env
source finai_env/bin/activate  # macOS/Linux
finai_env\Scripts\activate     # Windows
```

#### 1.2 필수 라이브러리 설치

```bash
pip install pandas numpy matplotlib seaborn
pip install yfinance FinanceDataReader pykrx
pip install scikit-learn
pip install ta-lib  # 어려울 수 있음 (아래 참고)
pip install backtrader
```

#### 1.3 TA-Lib 설치 문제 해결

**macOS**:
```bash
brew install ta-lib
pip install ta-lib
```

**Windows**:
```bash
# Anaconda 사용 권장
conda install -c conda-forge ta-lib
```

**리눅스/Ubuntu**:
```bash
sudo apt-get install build-essential
# 또는 conda install -c conda-forge ta-lib
```

**대안 — TA-Lib 없이도 가능**:
```bash
pip install pandas-ta  # 순수 Python 구현
```

#### 1.4 Kaggle 노트북 (저자 권장)

설치 문제 회피하려면 Kaggle 노트북 사용:
- https://www.kaggle.com/code
- New Notebook → Internet 켜기 → TA-Lib 이미 설치됨

### 2. 데이터 수집 — 4가지 방법

책 표 2-2의 4가지 방법:

| 방법 | 비용 | 품질 | 활용 |
|------|------|------|------|
| ① 데이터 구매 (Bloomberg, FnGuide) | ★★★★ | ★★★★★ | 기관 |
| ② 증권사 API (키움, 한투) | ★★ | ★★★★ | 실제 매매 |
| ③ 웹 크롤링 (네이버 금융) | ★ | ★★ | 학습 |
| ④ 오픈 API (yfinance) | ★ | ★★★ | **이 실습** |

### 3. yfinance 사용법

#### 3.1 기본 사용

```python
import yfinance as yf

# 애플 데이터 가져오기
aapl = yf.Ticker("AAPL")
df = aapl.history(start="2023-01-01", end="2024-05-15")
print(df.head())
```

출력:
```
            Open    High    Low     Close   Volume   Dividends  Stock Splits
Date
2023-01-03  130.28  130.90  124.17  125.07  112117500  0.0  0.0
2023-01-04  126.89  128.66  125.08  126.36  89113600   0.0  0.0
...
```

#### 3.2 한 줄로 여러 종목

```python
# 여러 종목 한번에
tickers = ["AAPL", "MSFT", "GOOGL", "AMZN"]
data = yf.download(tickers, start="2023-01-01", end="2024-05-15")
print(data['Close'].head())
```

#### 3.3 책 코드 — pandas_datareader 방식

> ⚠️ 책의 `from pandas_datareader import data as pdr` + `pdr.get_data_yahoo()` 는 **이미 deprecated**.
> 2024년 현재 작동 불안정. **yfinance 직접 사용 권장**.

### 4. FinanceDataReader — 한국 주식의 표준

#### 4.1 설치 및 기본 사용

```python
import FinanceDataReader as fdr

# 한국 거래소 종목 목록
df_krx = fdr.StockListing('KRX')
print(df_krx.head())
# Symbol, Name, Sector, Industry

# S&P 500 종목 목록
df_spx = fdr.StockListing('S&P500')
print(len(df_spx))  # 500
```

#### 4.2 종목별 데이터

```python
# 삼성전자 데이터
samsung = fdr.DataReader('005930', '2023-01-01', '2024-05-15')
print(samsung.head())

# Open, High, Low, Close, Volume, Change

# 미국 주식도 가능
aapl = fdr.DataReader('AAPL', '2023-01-01')
```

#### 4.3 ETF, 환율, 암호화폐도 가능

```python
# KODEX 200 ETF
etf = fdr.DataReader('069500', '2023-01-01')

# USD/KRW 환율
fx = fdr.DataReader('USD/KRW', '2023-01-01')

# 비트코인
btc = fdr.DataReader('BTC/USD', '2023-01-01')

# KOSPI 지수
kospi = fdr.DataReader('KS11', '2023-01-01')
```

### 5. pykrx — 한국 시장 깊이 보기

```python
from pykrx import stock

# 일봉
df = stock.get_market_ohlcv("20230101", "20240515", "005930")

# 펀더멘털 (PER, PBR 등)
fundamental = stock.get_market_fundamental("20230101", "20240515", "005930")

# 외국인 보유 비율
foreigner = stock.get_exhaustion_rates_of_foreign_investment("20240101", "20240515", "005930")
```

> ✅ **여기까지 따라왔으면**: 데이터 수집 환경이 완성됐다. 다음은 기술적 지표.

---

## 🟡 [중급] — 기술적 지표 생성

### 1. 기술적 분석 (Technical Analysis) 기초

#### 1.1 정의
> "가격·거래량 데이터의 패턴으로 미래 가격 예측"

#### 1.2 vs. 펀더멘털 분석

| | 기술적 분석 | 펀더멘털 분석 |
|---|---|---|
| 데이터 | 가격, 거래량 | 재무제표, 산업 |
| 시간 | 단기 (일~주) | 장기 (년) |
| 가정 | "가격이 모든 것 반영" | "내재가치 찾기" |
| 도구 | 차트, 지표 | DCF, P/E |

#### 1.3 기술적 분석의 한계 (책 본문)
- **자기충족적 예언**: 모두가 같은 지표 보면 그렇게 됨
- **시장 변화**: 과거 패턴이 미래에 안 통할 수도

### 2. 주요 기술적 지표 — TA-Lib 분류 (책 표 2-3)

| 분류 | 영문 | 예시 |
|------|------|------|
| **Overlap Studies** | 추세 표시 | MA, Bollinger Band, Parabolic SAR |
| **Momentum Indicator** | 모멘텀 | RSI, Stochastic, MACD |
| **Volume Indicator** | 거래량 | OBV, A/D Line |
| **Volatility Indicator** | 변동성 | ATR |
| **Price Transform** | 가격 변환 | Median Price |
| **Cycle Indicator** | 주기 | Hilbert Transform |
| **Pattern Recognition** | 패턴 | Candle Patterns |

### 3. 핵심 지표 코드로 구현

#### 3.1 SMA (단순 이동평균)

**공식**: $$ SMA_n = \frac{P_1 + P_2 + \dots + P_n}{n} $$

```python
import yfinance as yf
import pandas as pd
import numpy as np

# 애플 데이터
df = yf.download("AAPL", start="2023-01-01", end="2024-05-15")

# SMA 직접 계산
df['SMA20'] = df['Close'].rolling(window=20).mean()
df['SMA50'] = df['Close'].rolling(window=50).mean()

# TA-Lib 사용
import talib
df['SMA20_talib'] = talib.SMA(df['Close'], timeperiod=20)
```

#### 3.2 RSI (상대강도지수)

**공식**: $$ RSI = 100 - \frac{100}{1 + RS}, \quad RS = \frac{\text{평균 상승폭}}{\text{평균 하락폭}} $$

```python
# TA-Lib
df['RSI'] = talib.RSI(df['Close'], timeperiod=14)

# 해석
# RSI > 70: 과매수 (매도 신호)
# RSI < 30: 과매도 (매수 신호)
```

#### 3.3 MACD

**공식**:
- MACD Line = 12일 EMA - 26일 EMA
- Signal Line = MACD의 9일 EMA
- Histogram = MACD - Signal

```python
macd, signal, hist = talib.MACD(df['Close'], fastperiod=12, slowperiod=26, signalperiod=9)
df['MACD'] = macd
df['Signal'] = signal
df['Histogram'] = hist

# 해석
# MACD > Signal: 매수
# MACD < Signal: 매도
```

#### 3.4 Bollinger Band

**공식**:
- 중간 = 20일 SMA
- 상단 = 중간 + 2σ
- 하단 = 중간 - 2σ

```python
upper, middle, lower = talib.BBANDS(df['Close'], timeperiod=20, nbdevup=2, nbdevdn=2)
df['BB_Upper'] = upper
df['BB_Middle'] = middle
df['BB_Lower'] = lower

# 해석
# 가격 > 상단: 과매수
# 가격 < 하단: 과매도
```

#### 3.5 Stochastic Oscillator

**공식**:
- %K = (현재 종가 - n일 최저가) / (n일 최고가 - n일 최저가) × 100
- %D = %K의 3일 SMA

```python
slowk, slowd = talib.STOCH(df['High'], df['Low'], df['Close'],
                            fastk_period=14, slowk_period=3, slowd_period=3)
df['%K'] = slowk
df['%D'] = slowd

# 해석
# %K > 80: 과매수
# %K < 20: 과매도
```

### 4. 전체 지표 한 번에 계산하는 함수

```python
def add_technical_indicators(df):
    """주가 DataFrame에 모든 기술적 지표 추가"""
    df = df.copy()
    
    # 이동평균
    df['SMA20'] = talib.SMA(df['Close'], 20)
    df['SMA50'] = talib.SMA(df['Close'], 50)
    df['EMA20'] = talib.EMA(df['Close'], 20)
    
    # RSI
    df['RSI'] = talib.RSI(df['Close'], 14)
    
    # MACD
    macd, signal, hist = talib.MACD(df['Close'])
    df['MACD'] = macd
    df['MACD_Signal'] = signal
    df['MACD_Hist'] = hist
    
    # Bollinger Bands
    upper, middle, lower = talib.BBANDS(df['Close'], 20, 2, 2)
    df['BB_Upper'] = upper
    df['BB_Middle'] = middle
    df['BB_Lower'] = lower
    
    # Stochastic
    slowk, slowd = talib.STOCH(df['High'], df['Low'], df['Close'])
    df['%K'] = slowk
    df['%D'] = slowd
    
    # ATR (Volatility)
    df['ATR'] = talib.ATR(df['High'], df['Low'], df['Close'], 14)
    
    # OBV (Volume)
    df['OBV'] = talib.OBV(df['Close'], df['Volume'])
    
    return df

# 사용
df_with_indicators = add_technical_indicators(df)
```

### 5. 시각화

```python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(3, 1, figsize=(12, 10))

# 가격 + 볼린저 밴드
axes[0].plot(df.index, df['Close'], label='Close')
axes[0].plot(df.index, df['BB_Upper'], label='Upper', linestyle='--', color='red')
axes[0].plot(df.index, df['BB_Lower'], label='Lower', linestyle='--', color='green')
axes[0].set_title('Price + Bollinger Bands')
axes[0].legend()

# RSI
axes[1].plot(df.index, df['RSI'])
axes[1].axhline(70, color='red', linestyle='--')
axes[1].axhline(30, color='green', linestyle='--')
axes[1].set_title('RSI')

# MACD
axes[2].plot(df.index, df['MACD'], label='MACD')
axes[2].plot(df.index, df['MACD_Signal'], label='Signal')
axes[2].bar(df.index, df['MACD_Hist'], label='Histogram')
axes[2].set_title('MACD')
axes[2].legend()

plt.tight_layout()
plt.show()
```

> ✅ **여기까지 따라왔으면**: 기술적 지표 생성을 자유롭게 할 수 있게 됐다. 다음은 백테스팅.

---

## 🔴 [고급] — 백테스팅과 성과 평가

### 1. 백테스팅 개념

#### 1.1 정의
> "**과거 데이터에 전략을 적용해 가상 매매 → 성과 평가**"

#### 1.2 주의사항 (책 본문 요약)

| 함정 | 영향 | 회피 |
|------|------|------|
| **과적합** | 백테스트만 좋음 | 시계열 CV, OOS 검증 |
| **수수료 무시** | 실제 손실 과소평가 | 0.1~0.3% 가정 |
| **슬리피지 무시** | 체결 가격 차이 | 0.05~0.1% 가정 |
| **편향** | 결과 왜곡 | 점검 |
| **단일 종목 집중** | 우연 결과 | 다종목 |
| **단일 기간** | 시기 편향 | 여러 기간 검증 |

### 2. 백테스팅 라이브러리 비교 (책 표 2-4)

| 라이브러리 | 특징 | 추천 |
|----------|------|------|
| **Backtrader** | 유연, 실시간 매매 지원 | **★★★★** |
| **Zipline** | 강력하지만 설치 어려움 | ★★★ |
| **bt** | 간편, 벡터 연산 | ★★★ |
| **PyAlgoTrade** | 이벤트 드리븐 | ★★ |
| **Catalyst** | 암호화폐 특화 | ★★ |

### 3. Backtrader로 SMA Crossover 전략

#### 3.1 전략 정의

```python
import backtrader as bt

class SmaCross(bt.Strategy):
    params = (('fast', 20), ('slow', 50))
    
    def __init__(self):
        sma_fast = bt.ind.SMA(period=self.p.fast)
        sma_slow = bt.ind.SMA(period=self.p.slow)
        self.crossover = bt.ind.CrossOver(sma_fast, sma_slow)
    
    def next(self):
        if not self.position:  # 포지션 없으면
            if self.crossover > 0:  # Golden Cross
                self.buy()
        elif self.crossover < 0:  # Dead Cross
            self.close()
```

#### 3.2 백테스트 실행

```python
cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCross)

# 데이터 로드 (yfinance)
import yfinance as yf
df = yf.download("AAPL", start="2020-01-01", end="2024-05-15")

# Backtrader 형식으로 변환
data = bt.feeds.PandasData(dataname=df)
cerebro.adddata(data)

# 초기 자본
cerebro.broker.setcash(100000.0)

# 수수료
cerebro.broker.setcommission(commission=0.001)

# 실행
print(f'시작 자본: {cerebro.broker.getvalue():.2f}')
cerebro.run()
print(f'종료 자본: {cerebro.broker.getvalue():.2f}')

# 시각화
cerebro.plot()
```

### 4. 성과 측정 지표

#### 4.1 CAGR (연평균 복리 수익률)

$$ \text{CAGR} = \left(\frac{V_{\text{end}}}{V_{\text{begin}}}\right)^{1/n} - 1 $$

```python
def calculate_cagr(values, years):
    return (values[-1] / values[0]) ** (1/years) - 1

cagr = calculate_cagr(portfolio_values, n_years)
print(f"CAGR: {cagr*100:.2f}%")
```

#### 4.2 MDD (최대 낙폭)

$$ \text{MDD} = \min_t \frac{V_t - \max_{s \leq t} V_s}{\max_{s \leq t} V_s} $$

```python
def calculate_mdd(values):
    peak = np.maximum.accumulate(values)
    drawdown = (values - peak) / peak
    return drawdown.min()

mdd = calculate_mdd(np.array(portfolio_values))
print(f"MDD: {mdd*100:.2f}%")
```

#### 4.3 Sharpe Ratio

$$ \text{Sharpe} = \frac{R_p - R_f}{\sigma_p} $$

```python
def calculate_sharpe(returns, risk_free_rate=0.03):
    excess_return = returns.mean() * 252 - risk_free_rate
    volatility = returns.std() * np.sqrt(252)
    return excess_return / volatility

sharpe = calculate_sharpe(daily_returns)
print(f"Sharpe Ratio: {sharpe:.2f}")
```

#### 4.4 Sortino Ratio (다운사이드만)

$$ \text{Sortino} = \frac{R_p - R_f}{\sigma_{\text{downside}}} $$

```python
def calculate_sortino(returns, risk_free_rate=0.03, target=0):
    excess_return = returns.mean() * 252 - risk_free_rate
    downside_returns = returns[returns < target]
    downside_std = downside_returns.std() * np.sqrt(252)
    return excess_return / downside_std

sortino = calculate_sortino(daily_returns)
print(f"Sortino Ratio: {sortino:.2f}")
```

#### 4.5 Beta (시장 민감도)

$$ \beta = \frac{\text{Cov}(r_p, r_m)}{\text{Var}(r_m)} $$

```python
def calculate_beta(portfolio_returns, market_returns):
    covariance = np.cov(portfolio_returns, market_returns)[0][1]
    variance = np.var(market_returns)
    return covariance / variance

# 시장 데이터
spy = yf.download("SPY", start="2020-01-01")['Adj Close'].pct_change().dropna()
beta = calculate_beta(daily_returns, spy)
print(f"Beta: {beta:.2f}")
```

#### 4.6 Alpha (초과 수익)

$$ \alpha = R_p - [R_f + \beta(R_m - R_f)] $$

```python
def calculate_alpha(portfolio_returns, market_returns, risk_free_rate=0.03):
    beta = calculate_beta(portfolio_returns, market_returns)
    port_return = portfolio_returns.mean() * 252
    market_return = market_returns.mean() * 252
    return port_return - (risk_free_rate + beta * (market_return - risk_free_rate))

alpha = calculate_alpha(daily_returns, spy)
print(f"Alpha: {alpha*100:.2f}%")
```

### 5. 통합 성과 리포트 함수

```python
def performance_report(portfolio_values, returns, market_returns=None, n_years=None):
    """포트폴리오 성과 종합 리포트"""
    report = {}
    
    # 기본
    if n_years:
        report['CAGR'] = (portfolio_values[-1] / portfolio_values[0]) ** (1/n_years) - 1
    
    # 위험
    report['Volatility'] = returns.std() * np.sqrt(252)
    report['MDD'] = calculate_mdd(np.array(portfolio_values))
    
    # 위험 조정 수익
    report['Sharpe'] = calculate_sharpe(returns)
    report['Sortino'] = calculate_sortino(returns)
    
    # 시장 대비
    if market_returns is not None:
        report['Beta'] = calculate_beta(returns, market_returns)
        report['Alpha'] = calculate_alpha(returns, market_returns)
    
    # 출력
    print("=" * 40)
    print("Performance Report")
    print("=" * 40)
    for k, v in report.items():
        if k in ['CAGR', 'Volatility', 'MDD', 'Alpha']:
            print(f"{k:15s}: {v*100:7.2f}%")
        else:
            print(f"{k:15s}: {v:7.2f}")
    print("=" * 40)
    
    return report
```

---

## 🟣 [전공자] — 학술적 깊이와 확장

### 1. 전통 기술적 지표의 학술적 검증

#### 1.1 SMA Crossover의 효과
> 📄 Brock, W., Lakonishok, J., & LeBaron, B. (1992). Simple technical trading rules and the stochastic properties of stock returns. *Journal of Finance*, 47(5), 1731–1764.

- 1897-1986 다우지수에 SMA Crossover 적용
- 수수료 없을 때 알파 유의
- 그러나 수수료 후 알파 사라짐

#### 1.2 RSI의 효과성
> 📄 Wilder, J. W. (1978). *New Concepts in Technical Trading Systems*. Trend Research.

원래 책. RSI 14일이 표준이 됨.

### 2. 효율적 시장 가설 (EMH)

> 📄 Fama, E. F. (1970). Efficient capital markets. *Journal of Finance*, 25(2), 383–417.

3가지 형태:
- **Weak Form**: 가격에 과거 정보 반영 → 기술적 분석 무력
- **Semi-strong Form**: + 공개 정보 → 펀더멘털 무력
- **Strong Form**: + 비공개 정보 → 내부자 거래도 무력

→ **기술적 분석은 EMH Weak Form 부정**의 가정.

### 3. 백테스팅의 학술적 발전

#### 3.1 Walk-Forward Analysis
> 📄 Aronson, D. R. (2007). *Evidence-Based Technical Analysis*. Wiley.

#### 3.2 Combinatorial Purged CV
> 📄 López de Prado, M. (2018). Ch. 7. *Advances in Financial Machine Learning*.

### 4. Deflated Sharpe Ratio

여러 전략 시도 시 알파의 운(luck) 보정:

$$ \hat{SR}_{\text{Deflated}} = Z\left[\frac{(SR - E[SR^*])\sqrt{T-1}}{\sqrt{1 - \gamma SR + \frac{\gamma - 1}{4} SR^2}}\right] $$

> 📄 Bailey, D. H., & López de Prado, M. (2014). The deflated Sharpe ratio. *JPM*.

```python
# pyfolio 라이브러리 사용
import pyfolio as pf
pf.create_full_tear_sheet(returns)
```

### 5. 추가 도전 과제

#### 5.1 한국 주식으로 SMA Crossover 백테스트

```python
import FinanceDataReader as fdr
import backtrader as bt

# 삼성전자
df = fdr.DataReader('005930', '2020-01-01', '2024-05-15')

# Backtrader 형식
data = bt.feeds.PandasData(dataname=df)
# ... (위와 동일)
```

#### 5.2 다종목 포트폴리오 백테스트

```python
class MultiStrategy(bt.Strategy):
    def __init__(self):
        self.sma_fast = {}
        self.sma_slow = {}
        self.crossover = {}
        for d in self.datas:
            self.sma_fast[d._name] = bt.ind.SMA(d, period=20)
            self.sma_slow[d._name] = bt.ind.SMA(d, period=50)
            self.crossover[d._name] = bt.ind.CrossOver(self.sma_fast[d._name], self.sma_slow[d._name])
    
    def next(self):
        for d in self.datas:
            if not self.getposition(d):
                if self.crossover[d._name] > 0:
                    self.buy(data=d, size=100)
            elif self.crossover[d._name] < 0:
                self.close(data=d)

# 여러 종목 추가
for code in ['005930', '000660', '035420']:
    df = fdr.DataReader(code, '2020-01-01')
    data = bt.feeds.PandasData(dataname=df, name=code)
    cerebro.adddata(data)
```

#### 5.3 파라미터 최적화

```python
cerebro.optstrategy(
    SmaCross,
    fast=range(5, 30),
    slow=range(30, 100, 10)
)

results = cerebro.run(maxcpus=4)
# 결과 분석 → 최적 파라미터
```

⚠️ **주의**: 파라미터 최적화는 **과적합 위험 큼**. Walk-Forward 검증 필수.

---

### 🟣 [전공자 심화] — 백테스트 함정의 학술적 정밀 분석

#### 원논문(가이드라인)의 한계

전통 퀀트 백테스트의 표준 가이드는 **López de Prado (2018), *Advances in Financial Machine Learning*, Wiley** 가 Ch. 11–14 에서 제시한 7가지 함정 (Survivor bias, Look-ahead, Storytelling, Data mining, Transaction costs, Outliers, Shorting) 이다. 그러나 본 실습 같은 단일 종목 SMA Crossover 백테스트는 다음 가정에 의존한다.

1. **단일 자산·단일 전략**: 다중자산·다중전략 조합 시 backtest overfitting 확률이 지수적으로 증가. 실습 1의 단일 자산 평가는 lower bound.
2. **고정 수수료 0.1~0.3%**: 실제 슬리피지는 변동성·거래량·시장충격(market impact) 함수 — 정적 가정은 보수성 부족.
3. **수익률 정규성 가정**: Sharpe ratio 는 정규분포 가정. 실제 수익률은 fat tail, skewness — Bailey & López de Prado 의 **Probabilistic Sharpe Ratio (PSR), Deflated Sharpe Ratio (DSR)** 이 보정.
4. **종목 생존편향(Survivor Bias)**: yfinance 의 현재 상장 종목 데이터는 상장폐지 종목 제외 — 실제 알파 과대평가.
5. **시간 가변적 알파**: Brock, Lakonishok, LeBaron (1992, *JF*) 의 SMA 알파는 **1986년 이후 사라짐** — Sullivan, Timmermann, White (1999, *JF*) 가 White's Reality Check 으로 검증.

#### 비판 문헌 (1차 자료 검증)

- **Bailey, Borwein, López de Prado, Zhu (2014), "Pseudo-Mathematics and Financial Charlatanism: The Effects of Backtest Overfitting on Out-of-Sample Performance," *Notices of the AMS* 61(5), 458–471.** — 백테스트 후보 전략 수 N 이 증가할수록 **OOS 최선 전략의 PBO(Probability of Backtest Overfitting) 가 거의 1로 수렴**함을 수학적으로 증명. CSCV (Combinatorially Symmetric Cross-Validation) 도입. ([ssrn.com](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2308659))
- **Bailey & López de Prado (2014), "The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting and Non-Normality," *Journal of Portfolio Management* 40(5), 94–107.** — 시도한 전략 수, 표본 크기, 왜도·첨도를 보정한 DSR 공식. **시도 횟수를 보고하지 않은 백테스트의 Sharpe 는 신뢰할 수 없음**을 강조. ([papers.ssrn.com](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2460551))
- **Harvey & Liu (2014), "Evaluating Trading Strategies," *Journal of Portfolio Management* 40(5), 108–118.** — 다중 검정 보정 (Bonferroni, Holm, BHY) 을 백테스트에 적용해 Sharpe haircut 비율 제시 (예: 시도 횟수 200 → **현실적 Sharpe = 보고된 값의 약 절반**).
- **López de Prado (2018), Ch. 11 *Advances in Financial Machine Learning*** — *The Dangers of Backtesting* — "백테스트는 가설 검정 도구가 아니라 가설 생성 도구" 라는 패러다임 전환.

#### 후속 연구 동향 (2020~)

- **Combinatorially Purged Cross-Validation (CPCV)** — Purged k-Fold + Combinatorial 평가로 OOS 분포를 직접 추정. `mlfinlab.cross_validation.CombinatorialPurgedKFold` 구현체 제공.
- **Block Bootstrap, Stationary Bootstrap (Politis & Romano)** — 자기상관 시계열의 표본 분포 추정에 사용. `arch` 패키지 (`arch.bootstrap.StationaryBootstrap`).
- **HMM 기반 regime detection** — 백테스트를 regime별로 분할해 평가 (예: bull·bear·high-vol·low-vol 각각의 Sharpe).
- **AlphaShare, Quantopian-style ICR** — Information Coefficient Risk 로 알파 신호의 시간 안정성 직접 측정.

#### 한국 적용 시 주의점

- **공매도 금지 기간의 백테스트 무효화**: 2020.3~2021.5, 2023.11~ 현재 등 공매도 금지 기간 동안의 long-short 백테스트는 **실거래 불가능 영역**. 해당 기간 long-only 로 재구성하거나 제외 필요.
- **상장폐지·관리종목·거래정지의 누락**: pykrx·FinanceDataReader 는 기본적으로 **현재 상장 종목** 위주 → 생존편향. KRX 의 *상장폐지종목 정보* 별도 수집 필요 (https://kind.krx.co.kr/).
- **거래세 시점 변동**: 2024 0.18% → 2025 0.15% → 2026 0.20% — 정적 가정 시 2024년 데이터로 2026년 운용 시 손실 과소평가.
- **호가단위·거래량 제약**: 5천원 미만 1원, 5천~1만원 5원 등 — 백테스트의 연속 가격 가정과 충돌. 특히 우선주·소형주에서 영향 큼.
- **데이터 표본 길이**: 코스피 일별 데이터 ~1985년, KOSDAQ ~1996년 — Brock et al. (1992) 의 89년 vs. 한국 ~40년. **다중검정 보정 후 통계적 유의성 확보가 매우 어렵다**.
- **외국인 거래 시간차**: NYSE 종가(KST 5:30am) → 한국 개장(9:00am) 사이 3.5시간 정보 갭이 단기 신호 알파의 원천 — 그러나 갭 메우기 알파는 빠르게 소멸.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — 한국 주식 백테스팅 시 주의

#### 1.1 거래 시간
- 정규: 09:00~15:30 KST
- 시간외: 단일가 매매 (책에선 다루지 않음)

#### 1.2 거래 비용
- 수수료: 0.015~0.5% (증권사·계좌 유형별; 키움 등 기본 0.015%)
- 거래세 (매도 시; 농어촌특별세 0.15% 포함): 2024년 **0.18%** → 2025년 **0.15%** 인하 → 2026년 **0.20%** (2025.7 세제개편안: 금투세 폐지에 따른 조정)
- 슬리피지: 0.05~0.1%

> ⚠ 정정: 초기 작성본의 "수수료 0.015~0.015%"는 오타이고, "거래세 0.2%"는 시점 미반영. 2024-2025년은 0.18%/0.15%이며 2026년 0.20%는 "재인상"보다는 2025.7 세제개편안(금투세 폐지) 에 따른 조정으로 표현하는 게 정확하다.

#### 1.3 호가 단위
- 5천원 미만: 1원
- 5천~1만원: 5원
- ...

### 🔍 보충 2 — backtrader 외 대안: vectorbt

vectorbt는 **NumPy 기반 초고속** 백테스팅. 수백만 시뮬레이션 가능.

```python
import vectorbt as vbt

# 데이터
price = vbt.YFData.download('AAPL').get('Close')

# SMA Crossover
fast_ma = vbt.MA.run(price, 10)
slow_ma = vbt.MA.run(price, 50)
entries = fast_ma.ma_above(slow_ma, crossover=True)
exits = fast_ma.ma_below(slow_ma, crossover=True)

# 백테스트
pf = vbt.Portfolio.from_signals(price, entries, exits)
print(pf.stats())
```

### 🔍 보충 3 — pyfolio + empyrical 성과 분석

```python
import pyfolio as pf

# 한 줄로 전체 분석
pf.create_full_tear_sheet(returns)
# CAGR, Sharpe, Sortino, MDD, Beta, Alpha 등 자동 계산 + 시각화
```

### 🔍 보충 4 — 흔한 백테스팅 함정 예시

#### 함정 1: 미래 정보 누설

```python
# 잘못된 코드
df['Tomorrow_Return'] = df['Close'].shift(-1) / df['Close'] - 1
df['Signal'] = (df['Tomorrow_Return'] > 0).astype(int)
# → 내일 알고 오늘 매수?
```

#### 함정 2: 정렬되지 않은 데이터

```python
# 시간 순서 확인
df = df.sort_index()
```

#### 함정 3: 결측치 처리

```python
df = df.dropna()  # 또는 fillna
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. TA-Lib 설치가 안 됨!

**A.** 우선순위:
1. **Kaggle/Colab**: 이미 설치됨, 가장 쉬움
2. **Anaconda**: `conda install -c conda-forge ta-lib`
3. **brew/apt**: macOS/Linux 시스템 라이브러리 먼저 설치
4. **pandas-ta**: TA-Lib 대안 (순수 Python)

### Q2. 책의 pandas_datareader가 안 작동

**A.** **2024년 현재 deprecated**. 대안:
- `yfinance` 직접 사용
- `FinanceDataReader` (한국 데이터)

### Q3. 백테스팅 결과가 너무 좋음 - 의심?

**A.** 다음 확인:
1. **미래 정보 누설 (Look-ahead bias)** 체크
2. **수수료/슬리피지** 포함
3. **다른 기간** 으로 재실행
4. **Out-of-Sample** 검증

### Q4. 어떤 지표가 가장 좋은가?

**A.** **단일 지표로는 한계**. 조합이 더 강함:
- 추세: SMA + MACD
- 모멘텀: RSI + Stochastic
- 변동성: ATR + Bollinger
- 거래량: OBV

### Q5. Backtrader vs. Zipline vs. vectorbt - 어느 거?

**A.**

| 상황 | 추천 |
|------|------|
| 첫 시작 | **Backtrader** (튜토리얼 많음) |
| 대규모 데이터 | **Zipline** (단, 설치 복잡) |
| 수백만 시뮬레이션 | **vectorbt** (가장 빠름) |
| 간단한 포트폴리오 | **bt** |

### Q6. 백테스트와 실전 차이?

**A.** 주요 원인:
- 거래 비용 (수수료, 슬리피지)
- 시장 영향 (대규모 매매 시)
- 데이터 함정 (생존 편향 등)
- Concept Drift (시장 변화)

→ **백테스트 수익률은 실전의 약 50~70%** 로 추정.

### Q7. 다음 단계는?

**A.** 실습 1 → 실습 2 (ML) → 실습 3 (DL).
또한:
- Kaggle 대회 참가
- 한국 주식 데이터로 본인 전략
- 페이퍼 트레이딩

---

## 🎯 이 실습에서 가져갈 핵심 7가지

1. **데이터 수집**: yfinance, FinanceDataReader, pykrx 3개로 90% 커버.
2. **기술적 지표 표준**: SMA, RSI, MACD, Bollinger, Stochastic.
3. **TA-Lib**: 150+ 지표 한 줄 호출.
4. **백테스팅 표준**: Backtrader (실시간 매매도 가능).
5. **성과 지표 핵심 6개**: CAGR, MDD, Sharpe, Sortino, Alpha, Beta.
6. **백테스팅 함정**: 미래 정보, 수수료, 생존 편향 항상 의식.
7. **백테스트 ≠ 실전**: 실제 수익은 백테스트의 50~70% 예상.

---

## 📖 더 읽을거리

### 기술적 분석
- Murphy, J. J. (1999). *Technical Analysis of the Financial Markets*. NYIF. — 표준 교과서.
- Pring, M. J. (2014). *Technical Analysis Explained* (5th ed.). McGraw-Hill.

### Python 퀀트
- 강환국. (2017). *할 수 있다! 퀀트 투자*. 에프엔미디어.
- 신진오. (2023). *파이썬 증권 데이터 분석* (2판). 한빛미디어.

### 백테스팅
- Aronson, D. R. (2007). *Evidence-Based Technical Analysis*. Wiley.
- López de Prado, M. (2018). *Advances in Financial ML*. Wiley. — Ch.7 백테스팅 함정.

### 도구
- Backtrader 문서: https://www.backtrader.com/docu/
- vectorbt 문서: https://vectorbt.dev/
- TA-Lib: https://ta-lib.org/
- pandas-ta: https://github.com/twopirllc/pandas-ta

### Kaggle 자료
- "Stock Market Analysis & Prediction" 노트북
- "Technical Indicators in Python" 노트북

---

> **다음 실습** — 실습 2: 머신러닝을 이용한 투자 전략
> XGBoost, LightGBM으로 매수/매도 분류 + 백테스팅.
