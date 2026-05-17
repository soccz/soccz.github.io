# 실습 2: 머신러닝을 이용한 투자 전략 — *Lab 2: ML-Based Investment Strategy*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), 실습 2 (pp.75–97)
> **원서 분량**: 약 22쪽
> **해설 분량**: 약 35쪽
> **소요 시간**: 6~10시간

---

## 🪧 이 실습을 한 줄로

> **트리 기반 ML (XGBoost, Random Forest) 로 주가 방향 예측 + 클러스터링으로 종목 분류**.
> 시계열 ML 의 4가지 핵심 함정 (Concept Drift, 교차 검증, Embargo/Purging, 노이즈) 을 코드로 극복.

책은 ML 이론을 짧게 소개하고 ETF 예측 + 클러스터링 실습을 한다. 이 해설집은:
1. **각 ML 기법의 진짜 의미**
2. **시계열 ML 만의 특수 함정 4가지**
3. **한국 데이터로 변형**

### 📍 실습 전체 흐름

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">실습 2 — ML 투자 전략 전체 흐름</text>
  <defs>
    <marker id="ar02" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1c1917"/></marker>
  </defs>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="20" y="80" width="130" height="80" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="85" y="105" text-anchor="middle" font-weight="700" fill="#c4724e">① 데이터 준비</text>
    <text x="85" y="125" text-anchor="middle" font-size="10" fill="#1c1917">ETFs + 거시지표</text>
    <text x="85" y="143" text-anchor="middle" font-size="10" fill="#57534e">멀티 소스 결합</text>
    <line x1="150" y1="120" x2="180" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar02)"/>
    <rect x="180" y="80" width="130" height="80" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="245" y="105" text-anchor="middle" font-weight="700" fill="#5a7a96">② 피처 엔지니어링</text>
    <text x="245" y="125" text-anchor="middle" font-size="10" fill="#1c1917">기술지표 + 시차</text>
    <text x="245" y="143" text-anchor="middle" font-size="10" fill="#57534e">라벨링 (방향)</text>
    <line x1="310" y1="120" x2="340" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar02)"/>
    <rect x="340" y="80" width="130" height="80" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="405" y="105" text-anchor="middle" font-weight="700" fill="#3a7d44">③ ML 학습</text>
    <text x="405" y="125" text-anchor="middle" font-size="10" fill="#1c1917">XGBoost/RF/LR</text>
    <text x="405" y="143" text-anchor="middle" font-size="10" fill="#57534e">시계열 CV</text>
    <line x1="470" y1="120" x2="500" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar02)"/>
    <rect x="500" y="80" width="130" height="80" rx="8" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="565" y="105" text-anchor="middle" font-weight="700" fill="#7a6a9a">④ 백테스팅</text>
    <text x="565" y="125" text-anchor="middle" font-size="10" fill="#1c1917">신호 → 매매</text>
    <text x="565" y="143" text-anchor="middle" font-size="10" fill="#57534e">성과 평가</text>
    <line x1="630" y1="120" x2="660" y2="120" stroke="#1c1917" stroke-width="2" marker-end="url(#ar02)"/>
    <rect x="660" y="80" width="80" height="80" rx="8" fill="#fef9e7" stroke="#8a6d2c"/>
    <text x="700" y="105" text-anchor="middle" font-weight="700" fill="#8a6d2c">⑤ XAI</text>
    <text x="700" y="125" text-anchor="middle" font-size="10" fill="#1c1917">SHAP</text>
    <text x="700" y="143" text-anchor="middle" font-size="10" fill="#57534e">해석</text>
  </g>
  <text x="380" y="200" text-anchor="middle" font-size="12" font-weight="700" fill="#1c1917">⚠ 4가지 함정 항상 의식</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="10">
    <rect x="50" y="220" width="160" height="50" rx="6" fill="#fff" stroke="#c4724e"/>
    <text x="130" y="240" text-anchor="middle" font-weight="700" fill="#c4724e">Concept Drift</text>
    <text x="130" y="258" text-anchor="middle" fill="#57534e">시장 변화 대응</text>
    <rect x="220" y="220" width="160" height="50" rx="6" fill="#fff" stroke="#c4724e"/>
    <text x="300" y="240" text-anchor="middle" font-weight="700" fill="#c4724e">시계열 CV</text>
    <text x="300" y="258" text-anchor="middle" fill="#57534e">미래 정보 누설 방지</text>
    <rect x="390" y="220" width="160" height="50" rx="6" fill="#fff" stroke="#c4724e"/>
    <text x="470" y="240" text-anchor="middle" font-weight="700" fill="#c4724e">Embargo/Purging</text>
    <text x="470" y="258" text-anchor="middle" fill="#57534e">데이터 누설 차단</text>
    <rect x="560" y="220" width="160" height="50" rx="6" fill="#fff" stroke="#c4724e"/>
    <text x="640" y="240" text-anchor="middle" font-weight="700" fill="#c4724e">노이즈 제거</text>
    <text x="640" y="258" text-anchor="middle" fill="#57534e">SMA, Wavelet, PCA</text>
  </g>
</svg>

---

## 🟢 [초급] — 왜 금융인이 ML을 배워야 하나

### 1. 책의 메시지

> "데이터 과학" 이 향후 금융 분야 수요 1위 — Greenwich Associates 2023

순위 (현업 종사자 응답):
1. **데이터 과학**
2. CFA
3. 금융공학 박사
4. MBA

→ **CFA보다 ML이 우대받는 시대**.

### 2. ML 알고리즘 연구 동향 (책 그림 2-10)

2000~2019년 138편 논문 분석:
- **신경망 (ANN)**: 2000년부터 꾸준
- **SVM**: 2001년부터 인기
- **딥러닝**: 2015년 이후 폭증

> 💡 책은 학술 트렌드. 실제 헤지펀드는 **XGBoost, Random Forest** 같은 트리 모델 사용 비중 더 큼.

### 3. 트레이더 비유 — 책 본문

> A 트레이더: 기술 지표 (MA, RSI)
> B 트레이더: 거시경제 (소비자 물가, 금리)
> C 트레이더: 자산 상관 (금, 달러)
>
> → 셋의 의견을 종합 = ML이 하는 일

ML은 **여러 신호를 동시에 학습**해서 결합하는 것.

### 4. 4가지 ML 문제 유형 (금융)

```
주가 상승/하락 예측 → 분류 (Classification)
주가 정확한 값 예측 → 회귀 (Regression)
중요 변수 선택 → 변수 선택 (Feature Selection)
유사 종목 그룹화 → 클러스터링 (Clustering)
```

### 5. 책 실습 — 2가지 시나리오

| 시나리오 | 목표 | 모델 | 데이터 |
|---------|------|------|------|
| ETFs 방향 예측 | 분류 | XGBoost, RF | ETF + 거시 |
| 종목 클러스터링 | 비지도 | K-Means | 한국 주식 |

> ✅ **여기까지 따라왔으면**: 왜 금융에 ML이 들어왔는지, 무슨 문제를 푸는지 보일 거다.

---

## 🟡 [중급] — 시계열 ML 의 4가지 핵심 기법

### 1. 부스팅 vs. 배깅

#### 1.1 차이

| | 부스팅 (Boosting) | 배깅 (Bagging) |
|---|---|---|
| 학습 방식 | **순차적** | **병렬적** |
| 가중치 | 잘못 분류한 데이터 강화 | 동등 |
| 목표 | 편향 감소 | 분산 감소 |
| 과적합 | 위험 큼 | 강함 |
| 대표 | XGBoost, LightGBM, AdaBoost | Random Forest |
| 금융 적합 | ⚠ 과적합 주의 | ✓ 추천 |

#### 1.2 López de Prado의 조언 (책 본문)

> "*금융 데이터의 불규칙성과 예측의 어려움을 고려했을 때, 부스팅 기법이 과적합으로 이어질 위험이 크다.*"
> "*배깅은 모델의 분산을 감소시켜 과적합 문제를 완화하며, 금융 데이터의 낮은 신호 대 잡음 비율에 효과적이다.*"

→ **금융에선 Random Forest > XGBoost** 권장 (이론상).
→ 실전에선 둘 다 시도하고 비교.

#### 1.3 코드 예시

```python
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Bagging (Random Forest)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Boosting (XGBoost)
xgb = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5)
xgb.fit(X_train, y_train)

# 비교
from sklearn.metrics import accuracy_score, roc_auc_score
y_pred_rf = rf.predict(X_test)
y_pred_xgb = xgb.predict(X_test)
print(f"RF Accuracy: {accuracy_score(y_test, y_pred_rf):.3f}")
print(f"XGB Accuracy: {accuracy_score(y_test, y_pred_xgb):.3f}")
```

### 2. 시계열 교차 검증 (Time Series CV)

#### 2.1 왜 일반 K-Fold가 안 되나?

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">K-Fold (X) vs. TimeSeriesSplit (O)</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- K-Fold -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">❌ 일반 K-Fold (금융 시계열에 잘못된 방법)</text>
    <g>
      <rect x="40" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="90" y="70" width="50" height="20" fill="#fdf0ea"/>
      <rect x="140" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="190" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="240" y="70" width="50" height="20" fill="#eaf2f8"/>
      <text x="115" y="105" text-anchor="middle" font-size="9" fill="#c4724e">Test (미래!)</text>
    </g>
    <text x="180" y="130" font-size="10" fill="#c4724e">미래 데이터로 과거 예측 → 미래 정보 누설</text>
    <!-- TimeSeriesSplit -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">✓ TimeSeriesSplit (올바른 방법)</text>
    <g>
      <rect x="400" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="450" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="500" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="550" y="70" width="50" height="20" fill="#eaf2f8"/>
      <rect x="600" y="70" width="50" height="20" fill="#fdf0ea"/>
      <text x="625" y="105" text-anchor="middle" font-size="9" fill="#3a7d44">Test (미래)</text>
    </g>
    <text x="540" y="130" font-size="10" fill="#3a7d44">과거로 학습 → 미래 예측 (자연스러움)</text>
  </g>
  <text x="360" y="180" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">시계열은 시간 순서가 중요 → Train ≪ Test (시간상)</text>
</svg>

#### 2.2 sklearn TimeSeriesSplit

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)
for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
    X_train, X_val = X[train_idx], X[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]
    
    model = XGBClassifier()
    model.fit(X_train, y_train)
    score = model.score(X_val, y_val)
    print(f"Fold {fold+1}: {score:.3f}")
```

#### 2.3 Walk-Forward 변형

```python
# 점진적 확장 (expanding window)
for i in range(start, end):
    train = data[:i]
    test = data[i:i+horizon]
    # 학습 → 평가

# 슬라이딩 윈도우 (sliding window)
window = 252  # 1년
for i in range(window, len(data) - horizon):
    train = data[i-window:i]
    test = data[i:i+horizon]
```

### 3. 엠바고 (Embargo) 와 퍼징 (Purging)

#### 3.1 문제

시계열 라벨 (예: 다음 5일 수익률) 은 **미래 데이터** 사용. 학습/평가 분리 시 누설 위험.

```
Train: [Day 1] ... [Day 99]  ← 라벨이 Day 99 + 5 = Day 104까지 봄
Test:  [Day 100] ...           ← 누설!
```

#### 3.2 Purging

훈련 데이터의 라벨이 테스트 시작 시점을 침범하면 제거.

```
Train: [Day 1 ... Day 90]  ← Day 95+5=100까지 보는 라벨도 OK
[Gap]: [Day 91 ... Day 99]  ← 제거 (purged)
Test:  [Day 100 ...]
```

#### 3.3 Embargo

테스트 시작 후 일정 기간 추가 갭.

```
Train: [Day 1 ... Day 90]
Gap:   [Day 91 ... Day 99]   ← Purged
Test:  [Day 100 ...]
Embargo: [Day 100 ... Day 105]  ← 사용 안 함
```

#### 3.4 mlfinlab 라이브러리

```python
# pip install mlfinlab
from mlfinlab.cross_validation import PurgedKFold

cv = PurgedKFold(
    n_splits=5,
    samples_info_sets=t1,  # 각 데이터의 라벨 종료 시점
    pct_embargo=0.01
)
```

### 4. 노이즈 제거 — 6가지 방법

#### 4.1 이동평균 (MA)

```python
df['Close_Smooth'] = df['Close'].rolling(20).mean()
```

#### 4.2 지수 가중 (EMA)

```python
df['Close_EMA'] = df['Close'].ewm(span=20).mean()
```

#### 4.3 웨이블릿 변환 (Wavelet)

```python
import pywt

# Daubechies 4 wavelet
coeffs = pywt.wavedec(df['Close'].values, 'db4', level=3)

# 노이즈 제거 (threshold)
threshold = 0.04
coeffs_thresh = [pywt.threshold(c, threshold * np.max(c), mode='soft') for c in coeffs]

# 복원
smooth = pywt.waverec(coeffs_thresh, 'db4')
```

#### 4.4 PCA (주성분 분석)

```python
from sklearn.decomposition import PCA

# 여러 종목 데이터 (n_samples × n_stocks)
pca = PCA(n_components=5)
principal_components = pca.fit_transform(stock_returns)

print(f"설명 분산 비율: {pca.explained_variance_ratio_}")
# 상위 5개 주성분만 사용 → 노이즈 제거
```

#### 4.5 Autoencoder (딥러닝)

```python
import tensorflow as tf

# 간단한 Autoencoder
encoder = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(8, activation='relu'),  # 압축
])

decoder = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(input_dim),
])

autoencoder = tf.keras.Sequential([encoder, decoder])
autoencoder.compile(optimizer='adam', loss='mse')
autoencoder.fit(X, X, epochs=100)

# 잠재 표현 (노이즈 제거된 데이터)
X_clean = encoder.predict(X)
```

#### 4.6 가우시안 스무딩

```python
from scipy.ndimage import gaussian_filter1d

df['Close_Gaussian'] = gaussian_filter1d(df['Close'].values, sigma=2)
```

> ✅ **여기까지 따라왔으면**: 시계열 ML 의 4가지 핵심 기법 (Bagging/Boosting, TS-CV, Embargo/Purging, Denoising) 을 알게 됐을 거다.

---

## 🔴 [고급] — 실습 1: ETF 방향 예측 모델

### 1. 문제 정의

#### 1.1 목표
**ETF의 다음 N일 방향 (상승/하락) 예측**

#### 1.2 데이터
- **ETF 가격**: SPY (S&P 500), QQQ (NASDAQ), GLD (금), TLT (장기채)
- **거시 지표**: CPI, 금리, 실업률
- **기술 지표**: MA, RSI, MACD

### 2. 전체 코드 흐름

```python
import yfinance as yf
import pandas as pd
import numpy as np
import talib
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report

# 1. 데이터 수집
def get_etf_data(tickers, start='2010-01-01', end='2024-05-15'):
    data = {}
    for t in tickers:
        df = yf.download(t, start=start, end=end)
        data[t] = df
    return data

tickers = ['SPY', 'QQQ', 'GLD', 'TLT']
data = get_etf_data(tickers)
spy = data['SPY']

# 2. 피처 엔지니어링
def create_features(df):
    df = df.copy()
    
    # 기술 지표
    df['SMA20'] = talib.SMA(df['Close'], 20)
    df['SMA50'] = talib.SMA(df['Close'], 50)
    df['RSI'] = talib.RSI(df['Close'], 14)
    df['MACD'], df['MACD_Signal'], _ = talib.MACD(df['Close'])
    upper, middle, lower = talib.BBANDS(df['Close'], 20)
    df['BB_Position'] = (df['Close'] - lower) / (upper - lower)
    
    # 가격 변화율
    df['Return_1d'] = df['Close'].pct_change(1)
    df['Return_5d'] = df['Close'].pct_change(5)
    df['Return_20d'] = df['Close'].pct_change(20)
    
    # 변동성
    df['Volatility_20d'] = df['Return_1d'].rolling(20).std()
    
    # 거래량 변화
    df['Volume_Change'] = df['Volume'].pct_change(1)
    
    return df

spy_features = create_features(spy)

# 3. 라벨 생성 (다음 5일 방향)
horizon = 5
spy_features['Target'] = (spy_features['Close'].shift(-horizon) > spy_features['Close']).astype(int)

# 결측치 제거
spy_features = spy_features.dropna()

# 4. Train/Test 분리 (시간 순서 유지!)
X = spy_features.drop(['Target', 'Open', 'High', 'Low', 'Close', 'Adj Close'], axis=1)
y = spy_features['Target']

# 80% Train, 20% Test (시간 순서)
split = int(len(X) * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 5. 모델 학습
models = {
    'RF': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
    'XGB': XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print(f"\n=== {name} ===")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
    print(f"AUC: {roc_auc_score(y_test, y_pred_proba):.3f}")
    print(classification_report(y_test, y_pred))
```

### 3. 시계열 CV로 검증

```python
tscv = TimeSeriesSplit(n_splits=5)
cv_scores = []

for fold, (tr_idx, val_idx) in enumerate(tscv.split(X)):
    X_tr, X_val = X.iloc[tr_idx], X.iloc[val_idx]
    y_tr, y_val = y.iloc[tr_idx], y.iloc[val_idx]
    
    model = XGBClassifier(n_estimators=100, max_depth=5)
    model.fit(X_tr, y_tr)
    
    score = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    cv_scores.append(score)
    print(f"Fold {fold+1}: AUC = {score:.3f}")

print(f"\nMean AUC: {np.mean(cv_scores):.3f} ± {np.std(cv_scores):.3f}")
```

### 4. 백테스팅

```python
# 예측 신호 → 매매
spy_test = spy.iloc[split:].copy()
spy_test['Signal'] = models['XGB'].predict(X_test)
spy_test['Position'] = spy_test['Signal'].shift(1)  # 다음날 진입

# 수익률 계산
spy_test['Daily_Return'] = spy_test['Close'].pct_change()
spy_test['Strategy_Return'] = spy_test['Position'] * spy_test['Daily_Return']

# 누적 수익률
spy_test['Cum_Return'] = (1 + spy_test['Daily_Return']).cumprod()
spy_test['Cum_Strategy'] = (1 + spy_test['Strategy_Return']).cumprod()

# 시각화
import matplotlib.pyplot as plt
plt.figure(figsize=(12, 6))
plt.plot(spy_test.index, spy_test['Cum_Return'], label='Buy & Hold')
plt.plot(spy_test.index, spy_test['Cum_Strategy'], label='ML Strategy')
plt.legend()
plt.title('ML vs. Buy & Hold')
plt.show()
```

### 5. XAI — SHAP

```python
import shap

# SHAP 값 계산
explainer = shap.TreeExplainer(models['XGB'])
shap_values = explainer.shap_values(X_test)

# Summary plot (전역 중요도)
shap.summary_plot(shap_values, X_test)

# Force plot (개별 예측 설명)
shap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])

# Dependence plot
shap.dependence_plot('RSI', shap_values, X_test)
```

### 6. 한국 ETF로 변형

```python
import FinanceDataReader as fdr

# 한국 ETF
korea_etfs = ['069500', '229200', '114800']  # KODEX 200, KODEX 코스닥, KODEX 인버스
data_kr = {}
for code in korea_etfs:
    df = fdr.DataReader(code, '2010-01-01')
    data_kr[code] = df

# 거시 지표 추가
kospi = fdr.DataReader('KS11', '2010-01-01')  # KOSPI
kosdaq = fdr.DataReader('KQ11', '2010-01-01')  # KOSDAQ
usdkrw = fdr.DataReader('USD/KRW', '2010-01-01')  # 환율

# ... (위와 동일하게 피처/모델/백테스트)
```

---

## 🟣 [전공자] — 실습 2: 종목 클러스터링

### 1. 비지도 학습으로 종목 그룹화

#### 1.1 K-Means 클러스터링

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import FinanceDataReader as fdr

# 종목 리스트 (KOSPI 200)
tickers = fdr.StockListing('KOSPI200')['Code'].tolist()[:100]

# 수익률 데이터 수집
returns_data = pd.DataFrame()
for code in tickers:
    try:
        df = fdr.DataReader(code, '2023-01-01', '2024-05-15')
        returns_data[code] = df['Close'].pct_change()
    except:
        continue

returns_data = returns_data.dropna(axis=1)

# 종목별 통계 피처
stats = pd.DataFrame({
    'mean': returns_data.mean(),
    'std': returns_data.std(),
    'skew': returns_data.skew(),
    'kurt': returns_data.kurt(),
    'sharpe': returns_data.mean() / returns_data.std()
})

# 정규화
scaler = StandardScaler()
stats_scaled = scaler.fit_transform(stats)

# K-Means
kmeans = KMeans(n_clusters=5, random_state=42)
stats['Cluster'] = kmeans.fit_predict(stats_scaled)

# 클러스터별 종목 출력
for c in range(5):
    print(f"\nCluster {c}:")
    print(stats[stats['Cluster'] == c].head())
```

### 2. 최적 K 찾기 (Elbow Method)

```python
inertias = []
for k in range(2, 10):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(stats_scaled)
    inertias.append(kmeans.inertia_)

plt.plot(range(2, 10), inertias, 'bo-')
plt.xlabel('Number of clusters')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()
```

### 3. PCA + 시각화

```python
from sklearn.decomposition import PCA

# 2차원으로 축소
pca = PCA(n_components=2)
pca_result = pca.fit_transform(stats_scaled)

plt.figure(figsize=(10, 8))
for c in range(5):
    mask = stats['Cluster'] == c
    plt.scatter(pca_result[mask, 0], pca_result[mask, 1], label=f'Cluster {c}')

plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('Stock Clustering (PCA)')
plt.legend()
plt.show()
```

### 4. Hierarchical Clustering (계층적)

```python
from scipy.cluster.hierarchy import dendrogram, linkage

# Correlation 기반 거리
corr_matrix = returns_data.corr()
distance = 1 - corr_matrix
linkage_matrix = linkage(distance.values, method='ward')

plt.figure(figsize=(15, 8))
dendrogram(linkage_matrix, labels=corr_matrix.index, leaf_rotation=90)
plt.title('Hierarchical Clustering')
plt.show()
```

### 5. 클러스터링의 투자 활용

#### 5.1 페어 트레이딩 후보 발굴

같은 클러스터 + 높은 상관 + 일시 분리 → 페어 매매.

```python
# 같은 클러스터 내 페어
for c in range(5):
    cluster_stocks = stats[stats['Cluster'] == c].index
    cluster_corr = returns_data[cluster_stocks].corr()
    
    # 상관 > 0.8 인 페어
    for i, s1 in enumerate(cluster_stocks):
        for s2 in cluster_stocks[i+1:]:
            if cluster_corr.loc[s1, s2] > 0.8:
                print(f"Pair: {s1} - {s2}, Corr: {cluster_corr.loc[s1, s2]:.3f}")
```

#### 5.2 포트폴리오 분산

다른 클러스터에서 종목 선택 → 분산 효과.

```python
# 각 클러스터에서 1개씩 선택
portfolio = []
for c in range(5):
    cluster_stocks = stats[stats['Cluster'] == c]
    best_stock = cluster_stocks['sharpe'].idxmax()
    portfolio.append(best_stock)

print("Portfolio:", portfolio)
```

---

### 🟣 [전공자 심화] — 금융 ML 의 한계와 후속 연구

#### 원논문/실습의 한계

본 실습의 XGBoost·RandomForest 분류기 + TimeSeriesSplit 조합은 학술적으로 다음 4가지 가정에 의존한다.

1. **i.i.d. 가정 위반**: ML 표준 CV 는 i.i.d. 가정 하 일반화 오차를 추정. 금융 시계열은 **자기상관·이분산성·regime change** 로 i.i.d. 가정이 강하게 깨진다.
2. **라벨의 미래 누설(Label Leakage)**: 다음 5일 수익률 라벨은 t+1 ~ t+5 정보를 사용 → t 시점 학습 데이터가 t+1~t+5 정보를 간접적으로 보게 됨. 단순 TimeSeriesSplit 은 막지 못함.
3. **Feature Importance 의 인과 해석 오류**: SHAP·permutation importance 는 **상관관계 기반**, 인과(causal) 가 아님. 금융 의사결정에 인과 가정으로 사용 시 위험.
4. **OOS 표본 수 부족**: 한국 KOSPI 200 × 일별 데이터 5년 = 약 1,200 일 × 200 종목 = 240,000 샘플 — DNN 학습에는 부족.

#### 비판 문헌 (1차 자료 검증)

- **López de Prado (2018), *Advances in Financial Machine Learning*, Ch. 7** — *Cross-Validation in Finance* — 표준 k-Fold 와 TimeSeriesSplit 의 한계를 보이고 **Purged k-Fold + Embargo** 도입. 라벨 종료 시점(t1) 이 테스트 시작 시점을 침범하는 학습 샘플을 제거. ([Wiley book page](https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086))
- **Krauss, Do, Huck (2017), "Deep Neural Networks, Gradient-Boosted Trees, Random Forests: Statistical Arbitrage on the S&P 500," *European Journal of Operational Research* 259(2), 689–702. DOI: 10.1016/j.ejor.2016.10.031.** — S&P 500 long-short 통계적 차익거래에서 DNN+GBT+RF 앙상블이 **거래비용 차감 전 일 0.45% 알파**를 보였으나, **2008년 이후 알파가 빠르게 감소**해 2015년경에는 통계적 유의성 상실. 단일 모델로는 DNN ≈ GBT > RF 순. ([sciencedirect.com](https://www.sciencedirect.com/science/article/abs/pii/S0377221716308657))
- **Bryzgalova, Pelger, Zhu (2025), "Forest through the Trees: Building Cross-Sections of Stock Returns," *Journal of Finance* 80(5), 2447–2506.** — "예측 정확도 최대화" ML 이 아닌 **stochastic discount factor 를 직접 spanning 하는 decision tree 분할** 로 sort + ML 예측 기반 포트폴리오 대비 OOS Sharpe·알파 **최대 3배** 향상. ML 의 목적함수를 "수익률 예측" 에서 "경제적 의미" 로 전환할 것을 제안. ([wiley.com](https://onlinelibrary.wiley.com/doi/full/10.1111/jofi.13477))
- **Harvey, Liu, Zhu (2016), "…and the Cross-Section of Expected Returns," *Review of Financial Studies* 29(1), 5–68.** — 1976~2014년 발견된 316개 팩터 중 **다중검정 보정 후 유의한 것은 절반 이하** — ML 로 발견한 "신규 알파"의 대부분은 false discovery.

#### 후속 연구 동향 (2020~)

- **시계열 Transformer 의 금융 응용** — *PatchTST* (Nie et al., ICLR 2023, arXiv:2211.14730): patching + channel-independence 로 long-term forecasting MSE 21% 개선. 그러나 금융 시계열의 **SNR ≈ 0.05~0.1** 로 ETT/Weather (SNR ≈ 1+) 보다 1~2 자릿수 낮아 transformer 우위가 자동 보장되지 않는다. ([arxiv.org](https://arxiv.org/abs/2211.14730))
- **TimeMixer (ICLR 2024), iTransformer (ICLR 2024), TimesNet (ICLR 2023)** — 시계열 SOTA 경신 모델군. 금융 적용 시 보통 **단순 GBT 베이스라인 대비 마진 < 5%**.
- **Foundation Models for Time Series** — TimeGPT, Lag-Llama, Chronos (Amazon, 2024) 등 사전학습 시계열 모델. 금융 데이터의 비정상성·regime change 가 사전학습 효과를 크게 깎는다는 비판.
- **Causal ML for Finance** — Double ML (Chernozhukov et al., 2018, *Econometrics J.*) 을 활용한 알파 인과 추정. EconML, DoubleML 패키지.

#### 한국 적용 시 주의점

- **한국 헤지펀드 데이터 부재**: 미국 HFR·BarclayHedge 같은 헤지펀드 수익률 DB 가 한국엔 사실상 부재 — 한국형 헤지펀드(전문사모 집합투자기구)는 **2012년 본격 시작**으로 시계열 짧음.
- **KOSPI 200 vs. S&P 500 종목 수 차이**: S&P 500 = 500 종목, KOSPI 200 = 200 종목 — Krauss et al. (2017) 의 cross-sectional ranking 전략을 1:1 이식 시 표본 수가 60% 감소.
- **상장폐지·관리종목 데이터 누락**: pykrx 는 기본 현재 상장 종목 위주 → **생존편향**. KRX 의 상장폐지종목 DB (KIND) 별도 결합 필수.
- **Purged k-Fold 의 한국 데이터 적용**: 라벨 horizon 5일 + Embargo 2일 = 7일 갭 — 1년 250 거래일에서 약 3% 데이터 손실 — 표본 부족한 한국에선 부담.
- **외국인 매매 데이터 = 한국 고유 알파 원천**: pykrx 의 `get_market_trading_value_by_investor` 로 외국인·기관·개인 매매 동향 직접 피처화 — 미국에는 없는 한국 특수 데이터.
- **금융위 AI 가이드라인 (2021)** — 신용평가·자산운용 AI 모델의 **설명가능성·공정성·재현성** 요건 — 블랙박스 DNN 보다 GBT + SHAP 조합이 규제 친화적.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — Triple Barrier Method (López de Prado)

전통적 라벨링의 한계:
- "다음 5일 방향" → 단순
- 변동성 무시

#### Triple Barrier
```
3가지 장벽 설정:
- 상단 (Take Profit)
- 하단 (Stop Loss)
- 시간 (Holding Period)

먼저 닿는 장벽으로 라벨:
- 상단 먼저: +1 (Long)
- 하단 먼저: -1 (Short)
- 시간 먼저: 0 (Neutral)
```

#### 코드 (mlfinlab)

```python
from mlfinlab.labeling import add_vertical_barrier, get_events, get_bins

# 수직 장벽 (시간)
vertical_barriers = add_vertical_barrier(t_events=df.index, close=df['Close'], num_days=5)

# 이벤트 (수평 장벽)
events = get_events(close=df['Close'], t_events=df.index, 
                    pt_sl=[2, 2], target=df['Volatility'], 
                    min_ret=0.01, num_threads=4,
                    vertical_barrier_times=vertical_barriers)

# 라벨 추출
labels = get_bins(events, df['Close'])
```

### 🔍 보충 2 — Meta Labeling

기본 모델 (예측) + 메타 모델 (포지션 크기) 분리:
- 1차 모델: 매수/매도 신호
- 2차 모델: "이 신호 진짜 따라야 하나?" → 확률
- 확률 × 자본 = 포지션 크기

> 📄 López de Prado, M. (2018). Ch.3. *Advances in Financial ML*.

### 🔍 보충 3 — Hyperparameter Tuning 주의

```python
from sklearn.model_selection import GridSearchCV

# WRONG: 일반 GridSearchCV
grid = GridSearchCV(XGBClassifier(), param_grid, cv=5)  # ← 일반 CV

# CORRECT: TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
grid = GridSearchCV(XGBClassifier(), param_grid, cv=tscv)
```

### 🔍 보충 4 — Feature Importance vs. SHAP

```python
# Built-in importance (편향 있음)
xgb.feature_importances_

# Permutation importance (더 신뢰)
from sklearn.inspection import permutation_importance
perm = permutation_importance(xgb, X_test, y_test, n_repeats=10)

# SHAP (가장 정확)
shap_values = explainer.shap_values(X_test)
```

### 🔍 보충 5 — Optuna로 하이퍼파라미터 최적화

```python
import optuna

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_loguniform('learning_rate', 1e-3, 1e-1),
        'subsample': trial.suggest_float('subsample', 0.5, 1.0),
    }
    
    tscv = TimeSeriesSplit(n_splits=3)
    scores = []
    for tr_idx, val_idx in tscv.split(X):
        model = XGBClassifier(**params)
        model.fit(X.iloc[tr_idx], y.iloc[tr_idx])
        score = roc_auc_score(y.iloc[val_idx], 
                              model.predict_proba(X.iloc[val_idx])[:, 1])
        scores.append(score)
    return np.mean(scores)

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
print(f"Best params: {study.best_params}")
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. Random Forest vs. XGBoost - 어느 거?

**A.** 시도해보고 결정. 일반적으로:
- **시작**: Random Forest (안정적)
- **튜닝 후**: XGBoost가 약간 더 좋을 수도
- **금융 (López de Prado)**: RF 권장 (과적합 위험)
- **실전**: 둘 다 시도 + 앙상블

### Q2. 시계열 CV가 왜 그렇게 중요?

**A.** **미래 정보 누설 방지**가 핵심.

```
[일반 K-Fold]
Train: [Day 1, Day 3, Day 5, ...]
Test:  [Day 2, Day 4, ...]
   → Test 데이터 Day 4가 Train Day 5보다 빠름 = OK?
   → 실전엔 Day 5에 이미 Day 4 정보 → 누설!
```

### Q3. Embargo가 진짜 필요한가?

**A.** **HFT나 라벨이 미래 사용 시 필수**.

일반 일간 매매:
- 라벨 = 다음 5일 수익 → Embargo 5일 필요

장기 매매 (월 단위):
- Embargo 영향 작음

### Q4. 노이즈 제거가 항상 좋은가?

**A.** **신호도 같이 제거할 위험**.

- 너무 강한 스무딩 → 변동 신호 사라짐
- 적절한 균형 필요
- 검증: 스무딩 후 모델 성능 비교

### Q5. 이 모델로 진짜 돈 벌 수 있나?

**A.** **백테스트 결과 + 실전 결과 차이 큼**. 보통:
- 백테스트 AUC 0.55+ → 가능성
- 실전: 거래 비용 + 슬리피지 + Concept Drift
- 실제 알파: 0~3% 정도가 일반적

### Q6. PCA로 차원 축소가 도움?

**A.** **고차원에서 도움, 저차원 (피처 10개) 에선 별로**.

- 피처 100+ → PCA로 5~10개로
- 피처 10 → 그대로
- 해석성 떨어짐 (PC1이 뭔지 모름)

### Q7. 클러스터링이 투자에 어떻게 쓰이나?

**A.** 4가지:
1. **페어 트레이딩 후보**: 같은 클러스터 + 높은 상관
2. **포트폴리오 분산**: 다른 클러스터 종목 조합
3. **이상치 탐지**: 어떤 클러스터에도 속하지 않는 종목
4. **시장 체제 분류**: 시점별 클러스터 (bull, bear, sideways)

---

## 🎯 이 실습에서 가져갈 핵심 7가지

1. **금융 ML 표준 모델**: Random Forest, XGBoost (둘 다 시도).
2. **시계열 CV 필수**: 일반 K-Fold 절대 금지.
3. **Embargo + Purging**: 라벨이 미래 데이터 쓸 때 누설 방지.
4. **노이즈 제거 6법**: MA, EMA, Wavelet, PCA, Autoencoder, Gaussian.
5. **피처 엔지니어링**: 기술 지표 + 거시 + 시차 데이터 결합.
6. **SHAP**: 모델 해석의 표준 도구.
7. **클러스터링**: 페어 트레이딩 + 포트폴리오 분산에 활용.

---

## 📖 더 읽을거리

### 금융 ML
- López de Prado, M. (2018). *Advances in Financial Machine Learning*. Wiley. — **바이블**.
- López de Prado, M. (2020). *Machine Learning for Asset Managers*. CUP.

### 트리 모델
- Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *KDD*.
- Ke, G., et al. (2017). LightGBM: A highly efficient gradient boosting decision tree. *NeurIPS*.

### 시계열 + ML
- Krollner, B., Vanstone, B., & Finnie, G. (2010). Financial time series forecasting with ML: A literature review. *ESWA*.
- Bartram, S. M., et al. (2021). ML and finance: A bibliometric review. *Journal of Economic Surveys*.

### 라이브러리
- mlfinlab: https://mlfinlab.readthedocs.io/
- Optuna: https://optuna.org/
- SHAP: https://shap.readthedocs.io/

### Kaggle 학습
- "Stock Market Prediction" (수많은 노트북)
- "Two Sigma Financial News" (대회)
- "Jane Street Market Prediction" (대회)

---

> **다음 실습** — 실습 3: 딥러닝을 이용한 투자 전략
> LSTM, Transformer 로 시퀀스 데이터 학습.
