# 실습 3: 딥러닝을 이용한 투자 전략 — *Lab 3: DL-Based Investment Strategy*

> **원서 위치**: 김태헌, 《금융 AI의 이해》(제이펍, 2024), 실습 3 (pp.98–113)
> **원서 분량**: 약 15쪽
> **해설 분량**: 약 35쪽
> **소요 시간**: 8~15시간

---

## 🪧 이 실습을 한 줄로

> **LSTM (RNN 계열) 으로 주가 시퀀스 학습 + Transformer 로 방향 예측 + Autoencoder 로 합성 데이터**.
> 책 Ch2 의 정점 — 가장 어렵지만 가장 강력한 도구.

책은 DL 이론 → FinGPT → Transformer/LSTM 실습 순으로 진행. 이 해설집은:
1. **시퀀스 모델 직관** 부터
2. **각 모델 한 줄씩 코드 풀이**
3. **GPU 환경 + 학습 시간** 안내
4. **실패 패턴** 정리

### 📍 실습 전체 흐름

<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">실습 3 — DL 투자 전략 흐름</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Theory part -->
    <text x="180" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">▼ 이론</text>
    <rect x="40" y="70" width="280" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="180" y="92" text-anchor="middle" font-weight="700" fill="#5a7a96">DL vs. ML 차이</text>
    <text x="180" y="112" text-anchor="middle" font-size="10" fill="#57534e">표현 학습 + End-to-End</text>
    <rect x="40" y="140" width="280" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="180" y="162" text-anchor="middle" font-weight="700" fill="#5a7a96">DL 모델 종류</text>
    <text x="180" y="182" text-anchor="middle" font-size="10" fill="#57534e">RNN/LSTM, CNN, Transformer</text>
    <rect x="40" y="210" width="280" height="60" rx="6" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="180" y="232" text-anchor="middle" font-weight="700" fill="#5a7a96">GenAI 미래</text>
    <text x="180" y="252" text-anchor="middle" font-size="10" fill="#57534e">FinGPT vs. BloombergGPT</text>
    <!-- Practice part -->
    <text x="540" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">▼ 실습</text>
    <rect x="400" y="70" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="540" y="92" text-anchor="middle" font-weight="700" fill="#3a7d44">실습 A: Transformer</text>
    <text x="540" y="112" text-anchor="middle" font-size="10" fill="#57534e">주가 방향 예측 (분류)</text>
    <rect x="400" y="140" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="540" y="162" text-anchor="middle" font-weight="700" fill="#3a7d44">실습 B: LSTM</text>
    <text x="540" y="182" text-anchor="middle" font-size="10" fill="#57534e">시계열 예측</text>
    <rect x="400" y="210" width="280" height="60" rx="6" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="540" y="232" text-anchor="middle" font-weight="700" fill="#3a7d44">실습 C: Autoencoder</text>
    <text x="540" y="252" text-anchor="middle" font-size="10" fill="#57534e">합성 주가 생성</text>
  </g>
  <text x="380" y="310" text-anchor="middle" font-size="11" font-weight="700" fill="#c4724e">⚠ 모두 GPU 필요 (없으면 매우 느림)</text>
  <text x="380" y="330" text-anchor="middle" font-size="10" font-style="italic" fill="#57534e">대안: Google Colab Free Tier 또는 Kaggle 노트북 (둘 다 무료 GPU)</text>
</svg>

---

## 🟢 [초급] — DL 이 ML과 어떻게 다른가

### 1. 표현 학습 (Representation Learning)

#### 1.1 ML
```
[원시 데이터] → [사람이 만든 피처] → [모델] → [결과]
   주가         (MA, RSI, MACD)
```

#### 1.2 DL
```
[원시 데이터] → [모델이 자동 학습한 표현] → [결과]
   주가              (숨겨진 패턴)
```

→ **DL은 피처 엔지니어링까지 자동화**.

### 2. 비유 — 개·고양이 분류

#### ML 방식
- "귀가 뾰족하면 +1, 둥글면 -1"
- "꼬리가 길면 +1, 짧으면 -1"
- "수염 있으면 +1, 없으면 0"
- → 사람이 특징 정의

#### DL 방식
- 사진 1000장 + 정답
- 모델이 알아서 "고양이는 이런 패턴" 학습
- → 자동

### 3. DL의 장단점

| | 장점 | 단점 |
|---|---|---|
| **데이터** | 비정형도 가능 | **대량 필요** |
| **피처** | 자동 학습 | 해석 어려움 |
| **성능** | 복잡 패턴 강함 | **계산 비쌈** |
| **활용** | 다용도 (전이학습) | 학습 시간 김 |

### 4. 왜 금융에 DL?

- **시계열 패턴**: RNN/LSTM이 시퀀스 학습 최적
- **이미지 패턴**: CNN이 차트 분석
- **자연어**: Transformer가 뉴스 분석
- **다중 소스 결합**: DL이 잘함

> ✅ **여기까지 따라왔으면**: DL이 ML보다 강한 이유와 한계가 보일 거다.

---

## 🟡 [중급] — DL 모델 4가지

### 1. RNN (Recurrent Neural Network)

#### 1.1 직관

시퀀스를 한 단계씩 처리:
```
t=1: 입력 → 은닉 상태 h₁
t=2: 입력 + h₁ → 은닉 상태 h₂
t=3: 입력 + h₂ → 은닉 상태 h₃
...
```

→ **과거 정보가 미래로 전달**.

#### 1.2 문제: Vanishing Gradient

긴 시퀀스에서 초기 정보가 사라짐. 100일 전 정보를 오늘에 못 전달.

### 2. LSTM (Long Short-Term Memory)

#### 2.1 해결책

RNN에 **게이트** 추가:
- **Forget Gate**: 무엇을 잊을까?
- **Input Gate**: 무엇을 새로 저장할까?
- **Output Gate**: 무엇을 출력할까?

→ **장기 의존성 학습 가능**.

#### 2.2 시각화

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="360" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">LSTM 셀 — 3가지 게이트</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <!-- Cell -->
    <rect x="200" y="60" width="320" height="130" rx="10" fill="#eaf2f8" stroke="#5a7a96" stroke-width="2"/>
    <text x="360" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">LSTM 셀</text>
    <!-- Gates -->
    <circle cx="250" cy="140" r="20" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="250" y="145" text-anchor="middle" font-size="10" font-weight="700" fill="#c4724e">Forget</text>
    <circle cx="360" cy="140" r="20" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="360" y="145" text-anchor="middle" font-size="10" font-weight="700" fill="#3a7d44">Input</text>
    <circle cx="470" cy="140" r="20" fill="#f5e6f0" stroke="#7a6a9a"/>
    <text x="470" y="145" text-anchor="middle" font-size="10" font-weight="700" fill="#7a6a9a">Output</text>
    <text x="250" y="180" text-anchor="middle" font-size="9" fill="#57534e">잊기</text>
    <text x="360" y="180" text-anchor="middle" font-size="9" fill="#57534e">저장</text>
    <text x="470" y="180" text-anchor="middle" font-size="9" fill="#57534e">출력</text>
    <!-- Arrows -->
    <text x="80" y="125" text-anchor="middle" font-size="12">x_t</text>
    <text x="640" y="125" text-anchor="middle" font-size="12">h_t</text>
    <line x1="100" y1="125" x2="195" y2="125" stroke="#1c1917" stroke-width="1.5"/>
    <line x1="525" y1="125" x2="620" y2="125" stroke="#1c1917" stroke-width="1.5"/>
  </g>
  <text x="360" y="220" text-anchor="middle" font-size="11" font-style="italic" fill="#57534e">3가지 게이트가 정보 흐름 제어 → 장기 의존성 학습</text>
</svg>

#### 2.3 Keras 코드

```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(seq_len, n_features)),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1)
```

### 3. GRU (Gated Recurrent Unit)

LSTM의 단순화 버전:
- Forget + Input → Update Gate
- 게이트 2개로 줄임 (LSTM은 3개)
- 더 빠르지만 성능 비슷

```python
model = tf.keras.Sequential([
    tf.keras.layers.GRU(64, input_shape=(seq_len, n_features)),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

### 4. Transformer

#### 4.1 핵심: Self-Attention

> "**모든 시점이 모든 시점과 직접 연결**"

RNN은 순차적 (t=1 → t=2 → t=3), Transformer는 동시 처리.

#### 4.2 장점
- 병렬화 가능 (RNN보다 빠름)
- 장거리 의존성 잘 학습
- LLM의 기반 (GPT, BERT, Claude)

#### 4.3 시계열 적용

```python
# 간단한 Transformer 블록 (Keras)
def transformer_block(inputs, head_size=64, num_heads=4, ff_dim=4, dropout=0.1):
    attention = tf.keras.layers.MultiHeadAttention(
        key_dim=head_size, num_heads=num_heads, dropout=dropout
    )(inputs, inputs)
    attention = tf.keras.layers.Dropout(dropout)(attention)
    res = inputs + attention
    
    ffn = tf.keras.layers.Dense(ff_dim, activation='relu')(res)
    ffn = tf.keras.layers.Dense(inputs.shape[-1])(ffn)
    return res + ffn

inputs = tf.keras.Input(shape=(seq_len, n_features))
x = transformer_block(inputs)
x = tf.keras.layers.GlobalAveragePooling1D()(x)
outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
model = tf.keras.Model(inputs, outputs)
```

### 5. 4가지 모델 비교

| 모델 | 강점 | 약점 | 금융 적합 |
|------|------|------|---------|
| **RNN** | 단순 | 장기 의존성 약함 | 짧은 시퀀스 |
| **LSTM** | 장기 의존성 강함 | 느림 | **표준 (가장 인기)** |
| **GRU** | 빠름 | LSTM보다 약간 약함 | 빠른 실험 |
| **Transformer** | 병렬, 장거리 | 데이터 많이 필요 | **최신 추천** |

> 💡 책의 통계: **LSTM이 금융 DL 연구의 60%+ 차지** (2021).

> ✅ **여기까지 따라왔으면**: 시퀀스 모델의 4가지 옵션과 차이를 알게 됐을 거다.

---

## 🔴 [고급] — 실습 A: LSTM 주가 예측

### 1. 데이터 준비

```python
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# 1. 데이터 수집
df = yf.download("AAPL", start="2015-01-01", end="2024-05-15")
prices = df['Close'].values.reshape(-1, 1)

# 2. 정규화 (DL은 정규화 필수)
scaler = MinMaxScaler(feature_range=(0, 1))
prices_scaled = scaler.fit_transform(prices)

# 3. 시퀀스 생성 (60일 → 다음날 예측)
def create_sequences(data, seq_len=60):
    X, y = [], []
    for i in range(seq_len, len(data)):
        X.append(data[i-seq_len:i])
        y.append(data[i])
    return np.array(X), np.array(y)

seq_len = 60
X, y = create_sequences(prices_scaled, seq_len)

# 4. Train/Test 분리 (시간 순서!)
split = int(len(X) * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

print(f"X_train shape: {X_train.shape}")  # (n, 60, 1)
print(f"X_test shape: {X_test.shape}")
```

### 2. LSTM 모델 구축

```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(seq_len, 1)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.summary()
```

### 3. 학습

```python
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.1,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(patience=5),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3)
    ]
)

# 학습 곡선
import matplotlib.pyplot as plt
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.legend()
plt.show()
```

### 4. 예측 및 시각화

```python
# 예측
y_pred_scaled = model.predict(X_test)

# 역정규화
y_pred = scaler.inverse_transform(y_pred_scaled)
y_test_actual = scaler.inverse_transform(y_test)

# 시각화
plt.figure(figsize=(12, 6))
plt.plot(y_test_actual, label='Actual')
plt.plot(y_pred, label='Predicted')
plt.legend()
plt.title('LSTM Stock Price Prediction')
plt.show()

# 성능
from sklearn.metrics import mean_squared_error, mean_absolute_error
rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))
mae = mean_absolute_error(y_test_actual, y_pred)
print(f"RMSE: ${rmse:.2f}")
print(f"MAE: ${mae:.2f}")
```

### 5. 다변수 LSTM (가격 + 거래량 + 지표)

```python
# 다변수 데이터
features = ['Close', 'Volume', 'High', 'Low']
data_multi = df[features].values

scaler_multi = MinMaxScaler()
data_scaled = scaler_multi.fit_transform(data_multi)

# 시퀀스
X_multi, y_multi = create_sequences(data_scaled, seq_len)

# 모델
model_multi = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(seq_len, len(features))),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dense(len(features))  # 모든 피처 예측
])
```

### 6. 양방향 LSTM (Bi-LSTM)

```python
model_bi = tf.keras.Sequential([
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True), 
                                   input_shape=(seq_len, 1)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(1)
])
```

⚠️ **주의**: Bi-LSTM 은 **미래 정보 사용** → 시계열 예측엔 부적합. 분류엔 OK.

---

### 🟣 [전공자 심화] — LSTM → Transformer 시계열 금융 적용의 한계와 후속 연구

#### 원논문 한계
- **LSTM (Hochreiter & Schmidhuber 1997)**: vanishing gradient를 일부 완화하지만 long-range dependency(수백~수천 step)에서 여전히 정보 손실. 병렬화 불가 → 학습 속도 한계.
- **Transformer (Vaswani et al. 2017, NIPS)**: 원래 기계번역용. 시계열에서는 (1) self-attention의 O(L²) 메모리·연산 비용, (2) positional encoding이 등간격 가정, (3) point-wise attention이 시계열의 **local trend/seasonality** 포착에 약함.
- **금융 시계열 특유 문제**:
  - **non-stationarity / regime shift**: 학습 분포와 테스트 분포가 다른 distribution shift (covariate shift).
  - **low signal-to-noise ratio**: 일일 수익률의 R²는 보통 1~2%. 큰 모델일수록 노이즈에 과적합.
  - **survivorship bias**: 폐지 종목 미포함 학습 데이터.
  - **look-ahead bias**: 미래 정보(분기 EPS 발표 전 EPS 활용 등) 누설.

#### 비판 문헌
- Zeng, A., Chen, M., Zhang, L., & Xu, Q. (2023). Are Transformers effective for time series forecasting? *AAAI 2023*, 37(9), 11121–11128. https://doi.org/10.1609/aaai.v37i9.26317 arXiv:2205.13504. **단순 선형 모델(DLinear, NLinear)이 Informer/Autoformer/FEDformer를 9개 벤치마크에서 압도**. Transformer 시계열 효용 자체에 의문 제기.
- Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2018). Statistical and machine learning forecasting methods: Concerns and ways forward. *PLOS ONE*, 13(3), e0194889. — M4 대회에서 단순 statistical 방법이 ML 방법을 평균적으로 능가.
- Lim, B., & Zohren, S. (2021). Time-series forecasting with deep learning: A survey. *Philosophical Transactions of the Royal Society A*, 379(2194). — 시계열 DL의 한계 종합 정리.

#### 후속 연구 동향 (2020~)
- Lim, B., Arık, S. Ö., Loeff, N., & Pfister, T. (2021). Temporal Fusion Transformers for interpretable multi-horizon time series forecasting. *International Journal of Forecasting*, 37(4), 1748–1764. https://doi.org/10.1016/j.ijforecast.2021.03.012 — TFT: variable selection + LSTM encoder + interpretable multi-head attention. 정적(static) 공변량 처리. arXiv:1912.09363.
- Zhou, H., Zhang, S., Peng, J., et al. (2021). Informer: Beyond efficient transformer for long sequence time-series forecasting. *AAAI 2021 (Best Paper)*, 35(12), 11106–11115. arXiv:2012.07436. — ProbSparse attention으로 O(L log L). 그러나 후속 비판(Zeng et al. 2023)으로 효과 의심.
- Wu, H., Xu, J., Wang, J., & Long, M. (2021). Autoformer: Decomposition transformers with auto-correlation for long-term series forecasting. *NeurIPS 2021*. arXiv:2106.13008.
- Zhou, T., Ma, Z., Wen, Q., et al. (2022). FEDformer: Frequency enhanced decomposed transformer for long-term series forecasting. *ICML 2022*. arXiv:2201.12740.
- Nie, Y., Nguyen, N. H., Sinthong, P., & Kalagnanam, J. (2023). A time series is worth 64 words: Long-term forecasting with transformers (PatchTST). *ICLR 2023*. arXiv:2211.14730. https://arxiv.org/abs/2211.14730 — 시계열을 patch 단위로 토큰화 + channel-independence. DLinear 비판 이후 transformer의 효용 재확인.
- Liu, Y., Hu, T., Zhang, H., et al. (2024). iTransformer: Inverted transformers are effective for time series forecasting. *ICLR 2024*. arXiv:2310.06625.

#### 금융 특화 후속 연구
- Wood, K., Giegerich, S., Roberts, S., & Zohren, S. (2022). Trading with the momentum transformer: An intelligent and interpretable architecture. *Quantitative Finance*. arXiv:2112.08534. — 모멘텀 전략에 attention을 적용, regime change 감지.
- Wood, K., Roberts, S., & Zohren, S. (2021). Slow momentum with fast reversion: A trading strategy using deep learning and changepoint detection. *Journal of Financial Data Science*. arXiv:2105.13727.

#### 실무 적용 시 주의점
- 한국 주식 시계열은 30년+ 가용하지만 1997 외환위기 전후, 2008 이전·이후, 2020 코로나 전후가 사실상 **다른 regime**. 단일 모델 학습 시 regime-conditional 평가 필수.
- KOSDAQ 종목은 가격제한(±30%), 거래정지가 빈번해 raw return을 그대로 입력 시 distribution이 왜곡. winsorization, robust scaling, returns volatility-targeting 권장.
- look-ahead bias 회피: 분기 재무 데이터는 "보고 시점 + 45일 lag" 적용(한국 GAAP/K-IFRS 공시 마감). pykrx/FDR 기본 데이터는 lag 적용 안 됨.
- 한국 시장의 일일 데이터로는 transformer의 학습 데이터가 부족. (1) 다중 종목 cross-section pooling, (2) 분 단위 데이터 활용, (3) self-supervised pretraining(예: PatchTST의 masked reconstruction) 권장.
- "predictive accuracy ≠ profitable strategy": MSE/MAE 개선이 Sharpe로 이어진다는 보장 없음. utility-based loss(예: −Sharpe) 또는 differentiable Sharpe 직접 최적화 고려.

---

## 🟣 [전공자] — 실습 B/C: Transformer + Autoencoder

### 1. Transformer 주가 방향 예측

#### 1.1 전체 코드

```python
import tensorflow as tf
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import StandardScaler

# 데이터
df = yf.download("AAPL", start="2015-01-01")
df['Return'] = df['Close'].pct_change()
df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
df = df.dropna()

# 피처
features = ['Open', 'High', 'Low', 'Close', 'Volume', 'Return']
X = df[features].values
y = df['Target'].values

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 시퀀스
seq_len = 30
X_seq, y_seq = [], []
for i in range(seq_len, len(X_scaled)):
    X_seq.append(X_scaled[i-seq_len:i])
    y_seq.append(y[i])
X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

# Train/Test
split = int(len(X_seq) * 0.8)
X_train, X_test = X_seq[:split], X_seq[split:]
y_train, y_test = y_seq[:split], y_seq[split:]

# Transformer 블록
def transformer_encoder(inputs, head_size, num_heads, ff_dim, dropout=0.1):
    # Multi-head attention
    x = tf.keras.layers.LayerNormalization(epsilon=1e-6)(inputs)
    x = tf.keras.layers.MultiHeadAttention(
        key_dim=head_size, num_heads=num_heads, dropout=dropout
    )(x, x)
    x = tf.keras.layers.Dropout(dropout)(x)
    res = x + inputs
    
    # Feed forward
    x = tf.keras.layers.LayerNormalization(epsilon=1e-6)(res)
    x = tf.keras.layers.Conv1D(filters=ff_dim, kernel_size=1, activation='relu')(x)
    x = tf.keras.layers.Dropout(dropout)(x)
    x = tf.keras.layers.Conv1D(filters=inputs.shape[-1], kernel_size=1)(x)
    return x + res

# 모델
inputs = tf.keras.Input(shape=(seq_len, len(features)))
x = inputs
for _ in range(4):  # 4개 블록
    x = transformer_encoder(x, head_size=64, num_heads=4, ff_dim=128)

x = tf.keras.layers.GlobalAveragePooling1D(data_format='channels_first')(x)
x = tf.keras.layers.Dense(64, activation='relu')(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)

model = tf.keras.Model(inputs, outputs)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 학습
history = model.fit(
    X_train, y_train,
    epochs=30, batch_size=64,
    validation_split=0.1,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=5)]
)

# 평가
loss, acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {acc:.3f}")
```

#### 1.2 GPU 가속

```python
# GPU 확인
print(tf.config.list_physical_devices('GPU'))

# 메모리 관리
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
```

### 2. Autoencoder로 합성 주가 생성

#### 2.1 목적
- 학습 데이터 부족 시 보완
- 개인정보 회피 (가공 데이터로 모델 학습)
- 백테스팅 시 시나리오 다양화

#### 2.2 구현

```python
# Vanilla Autoencoder
input_dim = 100  # 100일 시퀀스
encoding_dim = 16

encoder = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(encoding_dim, activation='relu'),
])

decoder = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(encoding_dim,)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(input_dim, activation='linear'),
])

autoencoder = tf.keras.Sequential([encoder, decoder])
autoencoder.compile(optimizer='adam', loss='mse')

# 학습
autoencoder.fit(X_train, X_train, epochs=100, batch_size=32)

# 인코딩
encoded = encoder.predict(X_test)

# 디코딩 → 재구성
reconstructed = autoencoder.predict(X_test)
```

#### 2.3 Variational Autoencoder (VAE) — 진정한 생성

```python
import tensorflow as tf
import tensorflow_probability as tfp

# Encoder
inputs = tf.keras.Input(shape=(input_dim,))
x = tf.keras.layers.Dense(64, activation='relu')(inputs)
z_mean = tf.keras.layers.Dense(encoding_dim)(x)
z_log_var = tf.keras.layers.Dense(encoding_dim)(x)

# Sampling
def sampling(args):
    z_mean, z_log_var = args
    epsilon = tf.random.normal(shape=tf.shape(z_mean))
    return z_mean + tf.exp(0.5 * z_log_var) * epsilon

z = tf.keras.layers.Lambda(sampling)([z_mean, z_log_var])

# Decoder
x = tf.keras.layers.Dense(64, activation='relu')(z)
outputs = tf.keras.layers.Dense(input_dim)(x)

vae = tf.keras.Model(inputs, outputs)
# Custom loss (Reconstruction + KL divergence)
```

### 3. FinGPT 활용 (책 본문)

#### 3.1 BloombergGPT vs. FinGPT

| | BloombergGPT | FinGPT |
|---|---|---|
| 비용 | $2.67M~$10M 추정 | $300 미만 |
| 시간 | 53일 (512 A100 GPU) | 빠름 |
| 접근 | 비공개 (블룸버그 고객) | **오픈소스** |
| 파라미터 | 500억 | 변동 (7B~70B) |
| 학습 | From scratch | Fine-tuning (Llama) |

#### 3.2 FinGPT 사용

```bash
# Install
pip install transformers torch peft

# Hugging Face에서 모델 로드
```

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# FinGPT (Llama 2 기반)
model_name = "FinGPT/fingpt-mt_llama2-7b_lora"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# 추론
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
result = pipe("Samsung's Q3 earnings beat expectations.")
print(result)
```

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — DL 학습 환경

#### GPU 옵션 (2024)

| 옵션 | 비용 | 속도 |
|------|------|------|
| Google Colab Free | 무료 | T4 GPU |
| Google Colab Pro | $10/월 | A100 일부 |
| Kaggle Notebook | 무료 | T4, P100 |
| AWS SageMaker | 시간당 $3+ | V100, A100 |
| GCP Vertex AI | 시간당 $2+ | A100 |
| Lambda Labs | 시간당 $1+ | A100, H100 |

#### 추천: **Kaggle 또는 Colab Pro** (입문자)

### 🔍 보충 2 — PyTorch 대안

책은 Keras/TensorFlow 사용. PyTorch도 인기:

```python
import torch
import torch.nn as nn

class LSTMModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])  # 마지막 timestep
        return out

model = LSTMModel(input_dim=1, hidden_dim=64, output_dim=1)
```

### 🔍 보충 3 — Time Series Foundation Models

2024 새 트렌드: **시계열 LLM**

- **TimeGPT** (Nixtla)
- **Chronos** (Amazon)
- **Lag-Llama**
- **Moirai** (Salesforce)

→ 사전학습된 모델로 Zero-shot 예측 가능.

```python
# TimeGPT 예시
from nixtla import NixtlaClient

client = NixtlaClient(api_key='your_key')
forecast = client.forecast(df, h=30)  # 30일 예측
```

### 🔍 보충 4 — DL 학습 디버깅 체크리스트

#### 학습 안 됨 (Loss 안 줄어듦)
- Learning rate 낮춤 (1e-4 → 1e-5)
- 데이터 정규화 확인
- 모델 크기 줄임 (작게 시작)

#### 학습 너무 좋음 (과적합)
- Dropout 추가 (0.2~0.5)
- L2 regularization
- 데이터 증강
- 모델 크기 줄임

#### 학습 진동 (Loss 안정 안 됨)
- Batch size 키움
- Learning rate scheduler
- Gradient clipping

### 🔍 보충 5 — Concept Drift 대응

시계열은 시간에 따라 분포가 변함. 대응:
- **주기적 재학습**: 매월/분기 재학습
- **Online Learning**: 새 데이터 들어올 때마다 업데이트
- **Adaptive Models**: 가중치 자동 조정

```python
# 주기적 재학습 예시
def retrain_periodically(model, new_data, frequency='monthly'):
    if frequency == 'monthly':
        # 매월 마지막 날 재학습
        model.fit(new_data, epochs=10, batch_size=32)
    return model
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. GPU 없으면 못 하나?

**A.** **가능하지만 매우 느림**.

| 모델 | CPU | GPU |
|------|-----|-----|
| LSTM 단순 | 30분 | 2분 |
| Transformer | 5시간+ | 15분 |
| BloombergGPT 학습 | **불가능** | 53일 |

→ **Kaggle/Colab 무료 GPU 활용** 권장.

### Q2. LSTM이 정말 주가 예측 잘 하나?

**A.** **약간 잘 하지만 만능 아님**.

- 다음날 방향 예측: 53~55% 정확도 (시장 50%)
- 정확한 가격 예측: 어려움
- 한국 학술 연구: LSTM이 ARIMA 약간 우위

### Q3. Transformer 가 LSTM보다 항상 좋은가?

**A.** **데이터 많을 때만**.

- 데이터 < 10K: LSTM 우위
- 데이터 > 100K: Transformer 우위
- 일반 주식: LSTM/GRU 추천

### Q4. Autoencoder로 진짜 가짜 주가 만들 수 있나?

**A.** **부분적으로 가능**.

- Vanilla AE: 노이즈 제거에 더 좋음
- VAE: 진짜 생성 가능
- GAN: 더 사실적이지만 학습 어려움
- **실제 트렌드/패턴 학습은 한계**

### Q5. FinGPT 어디서 받나?

**A.** Hugging Face 또는 GitHub:
- https://huggingface.co/FinGPT
- https://github.com/AI4Finance-Foundation/FinGPT

⚠️ **GPU 메모리 필요**: 7B 모델 → 16GB VRAM, 70B → A100×4.

### Q6. 책의 코드가 안 돌아감

**A.** 일반 원인:
1. **TensorFlow 버전 변경**: 책 코드는 2.x 기준
2. **pandas_datareader deprecated**: yfinance로 교체
3. **GPU 메모리 부족**: batch_size 줄임
4. **데이터 누락**: yfinance 일부 데이터 결측

### Q7. 다음은 뭘 배워야?

**A.** 4가지 경로:

1. **More DL**: PyTorch, Transformer 깊이
2. **MLOps**: Kubeflow, Vertex AI (Ch5)
3. **LLM 응용**: RAG, Agent (Ch6)
4. **실전**: 페이퍼 트레이딩 → 실거래

---

## 🎯 이 실습에서 가져갈 핵심 7가지

1. **DL = 자동 피처 학습**. 사람이 만든 피처 안 써도 됨.
2. **LSTM이 금융 DL 표준** (연구 60%+).
3. **Transformer** 가 LSTM 대체 추세 (데이터 많을 때).
4. **GPU 필수** — Kaggle/Colab 무료 GPU 활용.
5. **데이터 정규화** 필수 (MinMaxScaler 또는 StandardScaler).
6. **Autoencoder** 로 합성 데이터 생성 가능.
7. **FinGPT** = $300 로 만든 금융 LLM (BloombergGPT의 1/10,000).

---

## 📖 더 읽을거리

### DL 입문
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. — **무료 PDF**.
- Karpathy, A. *Neural Networks: Zero to Hero* (YouTube). — **최고 무료 강의**.

### 금융 DL
- Cao, L. (2022). AI in finance: A review. *ACM Computing Surveys*, 55(3).
- Sezer, O. B., et al. (2020). Financial time series forecasting with DL: A systematic literature review. *Applied Soft Computing*.

### LSTM
- Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. *Neural Computation*, 9(8).
- Chen, K., Zhou, Y., & Dai, F. (2015). A LSTM-based method for stock returns prediction. *IEEE Big Data*.

### Transformer
- Vaswani, A., et al. (2017). Attention is all you need. *NeurIPS*.
- Wen, Q., et al. (2023). Transformers in time series: A survey. *IJCAI*.

### GenAI in Finance
- Yang, H., Liu, X.-Y., & Wang, C. D. (2023). FinGPT: Open-source financial large language models. arXiv:2306.06031.
- Wu, S., et al. (2023). BloombergGPT. arXiv:2303.17564.

### 도구
- TensorFlow/Keras: https://www.tensorflow.org/
- PyTorch: https://pytorch.org/
- Hugging Face: https://huggingface.co/
- FinRL: https://github.com/AI4Finance-Foundation/FinRL

---

> **Ch2 끝**.
> 약 35시간 (이론 + 실습 3종) 분량을 완주했다면, 금융 투자에서 ML/DL의 큰 그림을 얻었을 것이다.
> 다음은 **Ch3 「AI 기반의 신용 리스크 모델링」** — 부도 예측, 신용평가 모델, OptBinning, Kaggle American Express 데이터.
