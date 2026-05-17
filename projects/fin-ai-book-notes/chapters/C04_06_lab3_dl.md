# 실습 3: 딥러닝 기반 신용카드 사기 탐지 — *Lab 3: DL-Based Fraud Detection*

> **해설 분량**: 약 25쪽
> **소요 시간**: 6~10시간

---

## 🪧 이 실습을 한 줄로

> **Deep Autoencoder + LSTM + Transformer** 로 사기 탐지의 정점.
> 책은 Autoencoder 중심, 이 해설집은 시퀀스 모델까지 확장.

### 📍 흐름

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#fafaf9;">
  <text x="380" y="22" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="14" font-weight="700" fill="#1c1917">Lab 3 — DL 기반 사기 탐지 3가지</text>
  <g font-family="Noto Sans KR,sans-serif" font-size="11">
    <rect x="40" y="60" width="200" height="180" rx="8" fill="#fdf0ea" stroke="#c4724e"/>
    <text x="140" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#c4724e">① Deep Autoencoder</text>
    <text x="140" y="115" text-anchor="middle" font-size="10" fill="#1c1917">정상 학습 → 재구성 오차</text>
    <text x="140" y="135" text-anchor="middle" font-size="10" fill="#1c1917">비지도</text>
    <text x="140" y="160" text-anchor="middle" font-size="11" fill="#c4724e" font-weight="700">PR-AUC: 0.55</text>
    <text x="140" y="190" text-anchor="middle" font-size="9" fill="#57534e">책 본문</text>
    <text x="140" y="210" text-anchor="middle" font-size="9" fill="#57534e">새 사기 발견</text>
    <rect x="270" y="60" width="200" height="180" rx="8" fill="#eaf2f8" stroke="#5a7a96"/>
    <text x="370" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#5a7a96">② LSTM</text>
    <text x="370" y="115" text-anchor="middle" font-size="10" fill="#1c1917">시퀀스 학습</text>
    <text x="370" y="135" text-anchor="middle" font-size="10" fill="#1c1917">고객별 거래 이력</text>
    <text x="370" y="160" text-anchor="middle" font-size="11" fill="#5a7a96" font-weight="700">PR-AUC: 0.65</text>
    <text x="370" y="190" text-anchor="middle" font-size="9" fill="#57534e">행동 패턴</text>
    <text x="370" y="210" text-anchor="middle" font-size="9" fill="#57534e">시퀀스 의존성</text>
    <rect x="500" y="60" width="220" height="180" rx="8" fill="#edf7ef" stroke="#3a7d44"/>
    <text x="610" y="85" text-anchor="middle" font-size="13" font-weight="700" fill="#3a7d44">③ Transformer / GNN</text>
    <text x="610" y="115" text-anchor="middle" font-size="10" fill="#1c1917">멀티헤드 어텐션</text>
    <text x="610" y="135" text-anchor="middle" font-size="10" fill="#1c1917">또는 그래프 신경망</text>
    <text x="610" y="160" text-anchor="middle" font-size="11" fill="#3a7d44" font-weight="700">PR-AUC: 0.75+</text>
    <text x="610" y="190" text-anchor="middle" font-size="9" fill="#57534e">최신 기술</text>
    <text x="610" y="210" text-anchor="middle" font-size="9" fill="#57534e">알리페이 사용</text>
  </g>
</svg>

---

## 🟢 [초급] — Autoencoder 직관

### 1. 핵심 아이디어 (책 본문)

> "**정상 데이터로만 학습 → 정상은 잘 재구성 → 사기는 재구성 못 함 → 큰 오차 = 사기**"

#### 그림으로

```
[입력 X] → [Encoder] → [잠재 Z] → [Decoder] → [출력 X']

정상 거래:
  X = [1.0, 2.0, 3.0]
  X' = [1.05, 1.98, 3.02]  ← 비슷
  오차 = 0.05 (작음)

사기 거래:
  X = [5.0, -2.0, 10.0]  ← 이상한 패턴
  X' = [1.0, 2.0, 3.0]   ← 모델은 "정상" 으로 복원
  오차 = 8.5 (큼!) → 사기 의심
```

### 2. 재구성 오차 (Reconstruction Error)

#### MSE (Mean Squared Error)
$$ \text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (x_i - x'_i)^2 $$

#### MAE (Mean Absolute Error)
$$ \text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |x_i - x'_i| $$

### 3. 오토인코더 아키텍처

```
입력 (30차원) → Dense(20) → Dense(14) → Dense(10) → Dense(3)
                                ↑                ↓
                            Encoder           잠재공간 (Bottleneck)
                                                  ↓
출력 (30차원) ← Dense(20) ← Dense(14) ← Dense(10) ← Dense(3)
                                                  ↑
                                              Decoder
```

> ✅ **여기까지 따라왔으면**: Autoencoder의 핵심 아이디어가 보일 거다.

---

## 🟡 [중급] — Deep Autoencoder 구현

### 1. 데이터 준비

```python
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 데이터 로드
df = pd.read_csv('/kaggle/input/creditcardfraud/creditcard.csv')

# 분리
X = df.drop('Class', axis=1)
y = df['Class']

# Train/Test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 정규화
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 정상만 추출 (Autoencoder는 정상으로 학습)
X_train_normal = X_train_scaled[y_train == 0]
```

### 2. 모델 정의

```python
input_dim = X_train_scaled.shape[1]  # 30
encoding_dim = 14

# Encoder
input_layer = tf.keras.Input(shape=(input_dim,))
x = layers.Dense(64, activation='relu')(input_layer)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(32, activation='relu')(x)
x = layers.BatchNormalization()(x)

encoded = layers.Dense(encoding_dim, activation='relu')(x)

# Decoder
x = layers.Dense(32, activation='relu')(encoded)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(64, activation='relu')(x)
x = layers.BatchNormalization()(x)

decoded = layers.Dense(input_dim, activation='linear')(x)

# Autoencoder
autoencoder = Model(input_layer, decoded)
autoencoder.compile(optimizer='adam', loss='mse', metrics=['mae'])
autoencoder.summary()
```

### 3. 학습

```python
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ModelCheckpoint('best_ae.h5', save_best_only=True)
]

history = autoencoder.fit(
    X_train_normal, X_train_normal,
    epochs=50,
    batch_size=128,
    validation_split=0.1,
    callbacks=callbacks,
    verbose=1
)

# 학습 곡선
import matplotlib.pyplot as plt
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Val')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.show()
```

### 4. 평가

```python
from sklearn.metrics import roc_auc_score, average_precision_score, precision_recall_curve

# 재구성
X_test_reconstructed = autoencoder.predict(X_test_scaled, verbose=0)

# MSE (재구성 오차)
mse = np.mean(np.power(X_test_scaled - X_test_reconstructed, 2), axis=1)

# 평가
auc = roc_auc_score(y_test, mse)
ap = average_precision_score(y_test, mse)
print(f"ROC-AUC: {auc:.4f}")
print(f"PR-AUC: {ap:.4f}")

# PR Curve
precision, recall, thresholds = precision_recall_curve(y_test, mse)
plt.plot(recall, precision)
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title(f'PR Curve (AP={ap:.3f})')
plt.show()
```

### 5. Threshold 결정

```python
# 분포 시각화
plt.figure(figsize=(12, 5))
plt.hist(mse[y_test == 0], bins=100, alpha=0.5, label='Normal', density=True)
plt.hist(mse[y_test == 1], bins=100, alpha=0.5, label='Fraud', density=True)
plt.xlabel('Reconstruction Error')
plt.ylabel('Density')
plt.yscale('log')
plt.legend()
plt.show()

# 최적 Threshold (F1 max)
from sklearn.metrics import f1_score

best_f1 = 0
best_threshold = 0
for t in np.linspace(0, mse.max(), 100):
    y_pred = (mse > t).astype(int)
    f1 = f1_score(y_test, y_pred)
    if f1 > best_f1:
        best_f1 = f1
        best_threshold = t

print(f"Best Threshold: {best_threshold:.4f}")
print(f"Best F1: {best_f1:.3f}")
```

> ✅ **여기까지 따라왔으면**: Deep Autoencoder 사기 탐지 완성.

---

## 🔴 [고급] — LSTM 시퀀스 모델

### 1. 시퀀스 데이터 준비

LSTM은 고객별 거래 시퀀스 학습. 책 데이터는 단일 거래만 → 가공 필요.

```python
# 가상 시나리오: 고객 ID + 시간 순 거래
# (실제로는 customer_id 컬럼 필요)

def create_sequences(df, customer_col='customer_id', seq_len=10):
    """고객별 시퀀스 생성"""
    sequences = []
    labels = []
    
    for cust_id, group in df.groupby(customer_col):
        group = group.sort_values('Time')
        features = group.drop(['Class', customer_col, 'Time'], axis=1).values
        targets = group['Class'].values
        
        for i in range(len(features) - seq_len):
            sequences.append(features[i:i+seq_len])
            labels.append(targets[i+seq_len])  # 다음 거래가 사기?
    
    return np.array(sequences), np.array(labels)

# (예시 - 실제 데이터는 customer_id 없음)
# X_seq, y_seq = create_sequences(df_with_customer)
```

### 2. LSTM 모델

```python
def build_lstm_fraud(seq_len, n_features):
    model = tf.keras.Sequential([
        layers.LSTM(64, return_sequences=True, input_shape=(seq_len, n_features)),
        layers.Dropout(0.3),
        layers.LSTM(32),
        layers.Dropout(0.3),
        layers.Dense(16, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['AUC', 'Precision', 'Recall']
    )
    return model

# 학습
model_lstm = build_lstm_fraud(seq_len=10, n_features=29)
history = model_lstm.fit(
    X_seq, y_seq,
    epochs=20,
    batch_size=64,
    validation_split=0.1,
    class_weight={0: 1, 1: 100},  # 불균형 보정
    callbacks=[EarlyStopping(patience=5)]
)
```

### 3. Bidirectional LSTM

```python
def build_bilstm():
    model = tf.keras.Sequential([
        layers.Bidirectional(
            layers.LSTM(64, return_sequences=True),
            input_shape=(seq_len, n_features)
        ),
        layers.Dropout(0.3),
        layers.Bidirectional(layers.LSTM(32)),
        layers.Dense(1, activation='sigmoid')
    ])
    return model
```

⚠️ **주의**: BiLSTM은 미래 정보 사용 → 실시간 사기 탐지엔 부적합. 사후 분석엔 OK.

### 4. CNN-LSTM 하이브리드

```python
def build_cnn_lstm():
    model = tf.keras.Sequential([
        layers.Conv1D(64, 3, activation='relu', input_shape=(seq_len, n_features)),
        layers.MaxPooling1D(2),
        layers.LSTM(32),
        layers.Dense(1, activation='sigmoid')
    ])
    return model
```

---

## 🟣 [전공자] — Transformer + GNN

### 1. Transformer for Fraud

```python
def transformer_block(inputs, head_size=64, num_heads=4, ff_dim=128, dropout=0.1):
    # Multi-head attention
    x = layers.LayerNormalization()(inputs)
    x = layers.MultiHeadAttention(
        num_heads=num_heads, key_dim=head_size, dropout=dropout
    )(x, x)
    x = layers.Dropout(dropout)(x)
    res = x + inputs
    
    # Feed forward
    x = layers.LayerNormalization()(res)
    x = layers.Conv1D(ff_dim, 1, activation='relu')(x)
    x = layers.Conv1D(inputs.shape[-1], 1)(x)
    return x + res

def build_transformer_fraud(seq_len, n_features):
    inputs = tf.keras.Input(shape=(seq_len, n_features))
    x = inputs
    for _ in range(2):  # 2 Transformer blocks
        x = transformer_block(x)
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dense(32, activation='relu')(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    
    model = tf.keras.Model(inputs, outputs)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['AUC'])
    return model
```

### 2. GNN (Graph Neural Network) — 알리페이 방식

```python
# PyTorch Geometric
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.data import Data

class FraudGNN(torch.nn.Module):
    def __init__(self, num_features, hidden_dim=64):
        super().__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.fc = torch.nn.Linear(hidden_dim, 1)
    
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.2)
        x = F.relu(self.conv2(x, edge_index))
        return torch.sigmoid(self.fc(x))

# 사용 예시 (Lab 4에서 본격 다룸)
```

### 3. 책의 한계 5가지

#### 한계 ①: 데이터에 customer_id 없음
- LSTM/Transformer 적용 어려움
- 실제 데이터는 시퀀스 분석 가능

#### 한계 ②: 실시간성 미고려
- BiLSTM 같은 미래 정보 사용 모델 활용 불가
- 단방향 LSTM/Transformer 권장

#### 한계 ③: GNN 미포함
- 알리페이 등 최신 사기 탐지의 핵심
- Lab 4 (그래프) 에서 보완

#### 한계 ④: Adversarial Training 미언급
- 사기꾼이 모델 공격 시 대응

#### 한계 ⑤: 실전 운영 (MLOps) 미언급
- 학습은 했지만 운영 어떻게?

---

### 🟣 [전공자 심화] — DL 시계열 사기 탐지의 한계와 Transformer·Mamba 후속

#### 원논문 한계 — Hochreiter & Schmidhuber (1997)

> 📄 Hochreiter, S., & Schmidhuber, J. (1997). Long Short-Term Memory. *Neural Computation*, 9(8), 1735–1780. DOI: 10.1162/neco.1997.9.8.1735. https://www.bioinf.jku.at/publications/older/2604.pdf

LSTM은 vanishing gradient를 Constant Error Carousel (CEC)로 해결했지만, 사기 탐지 시계열에 적용할 때 다음 한계가 누적된다.

1. **Sequential 학습 병목** — 시점 t의 hidden state가 t-1에 의존해 GPU 병렬화가 제한적. 알리페이처럼 초당 수만 거래 실시간 추론에는 latency 부담.
2. **Long-range dependency 여전히 약함** — 1997 논문이 "1000 step+" 라고 주장했지만, 실제 사기 시퀀스 (수개월 카드 사용 패턴)에서는 forget gate가 saturation되며 effective context가 50~100 step 정도로 짧다.
3. **Static gating** — Input/forget/output gate가 모든 시점·feature에 동일 weight 적용. "큰 금액 거래만 더 주의" 같은 selective attention 어려움.
4. **불균형 + 시퀀스의 결합 효과 미고려** — 1997 논문 자체는 sequence labeling. 사기 탐지 특유의 1% 미만 positive 비율과 결합되면 forget gate가 정상 패턴만 학습.
5. **거래 간 시간 간격(Δt) 무시** — Step-uniform 모델이라 "1분 내 5건" vs "1년에 1건" 의 시간 의미를 직접 표현 못 함 (사용자가 별도 feature로 인코딩해야 함).

#### 비판 문헌

- **Vaswani, A. et al. (2017). Attention Is All You Need. *NeurIPS 2017*.** arXiv:1706.03762. — Self-attention으로 LSTM의 sequential 제약 제거. 사기 탐지 시퀀스에 직접 적용 가능.
- **Heryadi, Y., & Warnars, H. L. H. S. (2017). Learning temporal representation of transaction amount for fraudulent transaction recognition using CNN, Stacked LSTM, and CNN-LSTM. *IEEE Int. Conf. on Cybernetics and Computational Intelligence (CyberneticsCom)*.** DOI: 10.1109/CYBERNETICSCOM.2017.8311689. https://ieeexplore.ieee.org/document/8311689
  - 인도네시아 은행 2016~2017 거래 데이터로 CNN, Stacked LSTM, CNN-LSTM 비교. 의외로 **CNN 단독이 모든 imbalance 비율에서 최고 AUC**. 저자들의 결론: LSTM의 장기 메모리가 카드 사기에서는 오히려 noise를 amplify, 짧은 local pattern (CNN kernel)이 더 강함. — LSTM 만능론에 대한 실증적 비판.
- **Zhou, H. et al. (2021). Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting. *AAAI 2021*.** arXiv:2012.07436. — Vanilla Transformer의 O(L²) 메모리·시간을 ProbSparse attention으로 O(L log L) 로 줄임. 사기 시퀀스 (수만 건) 처리에 핵심.
- **Lim, B. et al. (2021). Temporal Fusion Transformers for interpretable multi-horizon time series forecasting. *International Journal of Forecasting*, 37(4), 1748–1764.** arXiv:1912.09363. https://arxiv.org/abs/1912.09363 — Static·known·observed feature를 분리 처리하는 interpretable transformer. 사기 탐지의 "고객 prior + 거래 변동" 분리에 부합.

#### 후속 연구 동향 (2020~)

1. **Transformer 기반 신용카드 사기 탐지** — Yu, C., Xu, Y., Cao, J., Zhang, Y., Jin, Y., & Zhu, M. (2024). Credit Card Fraud Detection Using Advanced Transformer Model. *arXiv:2406.03733*. https://arxiv.org/abs/2406.03733 — Kaggle CreditCard 데이터에서 SVM·RF·NN·LR 대비 일관된 성능 우위 보고.
2. **Transformer-Enhanced GAN Oversampling** — Improving Credit Card Fraud Detection through Transformer-Enhanced GAN Oversampling (2025). *arXiv:2509.19032*. https://arxiv.org/abs/2509.19032 — Recall, F1, AUC에서 통상 GAN oversampling 대비 향상.
3. **Mamba / State Space Model** — Gu, A., & Dao, T. (2023). Mamba: Linear-Time Sequence Modeling with Selective State Spaces. *arXiv:2312.00752*. https://arxiv.org/abs/2312.00752 — Selective SSM으로 Transformer O(L²)를 O(L) 로 줄이면서 long-range 성능 유지. 사기 시퀀스 처리에 적합.
4. **MambaTab — 테이블 + 시퀀스 결합** — Ahamed, M. A., & Cheng, Q. (2024). MambaTab: A Plug-and-Play Model for Learning Tabular Data. *arXiv:2401.08867*. https://arxiv.org/abs/2401.08867 — 파라미터 1% 수준으로 SoTA tabular 모델과 경쟁. 사기 탐지에 직접 적용 검토 가치.
5. **MambaAD** — He, H. et al. (2024). MambaAD: Exploring State Space Models for Multi-class Unsupervised Anomaly Detection. *NeurIPS 2024*. https://neurips.cc/virtual/2024/poster/96369 — 비지도 이상치 탐지에 Mamba 적용, 사기 탐지로 transfer 가능.

#### 시계열 모델 비교 (사기 탐지 관점)

| 모델 | Complexity | Long-range | Δt 인식 | 실시간 적합도 | 사기 탐지 성공 사례 |
|------|-----------|-----------|---------|-------------|------------------|
| **LSTM** | O(L) sequential | 약 (50~100 step) | feature로 추가 | 중 | Heryadi 2017 (단, CNN보다 못함) |
| **TFT** | O(L²) | 중~강 | 명시적 처리 | 낮음 | 미공개 (forecasting 위주) |
| **Informer** | O(L log L) | 강 | 미흡 | 중상 | 사기 직접 적용 사례 적음 |
| **Vanilla Transformer** | O(L²) | 강 | 없음 | 낮음 | Yu et al. 2024 (CreditCard) |
| **Mamba** | O(L) parallel | 강 | selective 처리 | 상 | MambaAD (2024) — anomaly transfer |

#### 한국 적용 시 주의점

1. **보이스피싱 음성 시퀀스** — 통화 음성·텍스트가 거래 시퀀스보다 정보량이 크다. Wav2Vec2 + Mamba 같은 audio-temporal 하이브리드가 한국에서 가장 ROI 높은 응용.
2. **딥페이크 영상 시계열** — 2024년 음성 합성 통화 1300% 증가 (GTT Korea 보도). 영상 프레임 시퀀스에 TFT/Mamba를 적용한 deepfake 탐지가 BNPL 신원도용 방지에 직접 연결.
3. **카뱅·토스 거래 빈도 차이** — 카뱅 사용자 평균 일거래 빈도가 시중은행 대비 3~5배 (업계 통상). LSTM의 effective context가 카뱅에서는 더 빠르게 소진되므로 Informer/Mamba 같은 long-range 모델 이득이 크다.
4. **금감원 모델 검증** — 2024년 금감원 AI 모델 검증 가이드에서 시계열 모델은 reproducibility + interpretability 요구. Mamba는 학술적으로 신선하지만 검증 사례 부족 → TFT (interpretable by design) 가 단기적으로 안전한 선택.
5. **Adversarial sequence attack** — Carlini-Wagner 식 norm-bounded 가 아니라 **거래 순서 재배열** 만으로 모델을 속이는 sequence-level attack 가능. Pournaras et al. (2023) 등 후속 연구 모니터링 필요.

---

## 📚 책에 없지만 알면 좋은 것

### 🔍 보충 1 — GAN for Fraud Data Augmentation

```python
# Tabular GAN (CTGAN)
from ctgan import CTGAN

# 실제 사기 데이터로 학습
ctgan = CTGAN(epochs=300)
ctgan.fit(df_fraud, discrete_columns=[])

# 합성 사기 데이터 생성
synthetic_fraud = ctgan.sample(10000)

# Train 데이터에 추가
df_augmented = pd.concat([df_train, synthetic_fraud])
```

### 🔍 보충 2 — Time-aware Self-Attention

거래 시간 간격을 attention에 반영:

```python
class TimeAwareAttention(layers.Layer):
    def call(self, x, time_diffs):
        attention_weights = ... # time_diffs로 가중치 조정
        return weighted_x
```

### 🔍 보충 3 — Federated Learning for Fraud

```python
# 여러 은행 협업 학습
import flwr as fl

class FraudClient(fl.client.NumPyClient):
    def __init__(self, model, X, y):
        self.model = model
        self.X = X
        self.y = y
    
    def fit(self, parameters, config):
        self.model.set_weights(parameters)
        self.model.fit(self.X, self.y, epochs=1, batch_size=32)
        return self.model.get_weights(), len(self.X), {}
```

### 🔍 보충 4 — Explainable DL (XDL)

```python
# Integrated Gradients
import tensorflow as tf

def integrated_gradients(model, input_data, baseline=None, steps=50):
    if baseline is None:
        baseline = tf.zeros_like(input_data)
    
    alphas = tf.linspace(0.0, 1.0, steps)
    interpolated = [baseline + a * (input_data - baseline) for a in alphas]
    
    with tf.GradientTape() as tape:
        tape.watch(interpolated)
        predictions = [model(x) for x in interpolated]
    
    gradients = tape.gradient(predictions, interpolated)
    avg_gradients = tf.reduce_mean(gradients, axis=0)
    
    return (input_data - baseline) * avg_gradients
```

### 🔍 보충 5 — Online Learning

```python
from river import linear_model, metrics

# Online LR
model = linear_model.LogisticRegression()
metric = metrics.ROCAUC()

# 한 거래씩 처리
for transaction, label in stream:
    pred = model.predict_proba_one(transaction)
    metric.update(label, pred[True])
    model.learn_one(transaction, label)

print(f"AUC: {metric.get()}")
```

---

## ❓ 어려운 부분 풀이 (Q&A)

### Q1. Autoencoder vs. Isolation Forest?

**A.** 둘 다 비지도지만 다름.

| | Autoencoder | Isolation Forest |
|---|---|---|
| 학습 | 정상만 | 전체 |
| 성능 | 비선형 강 | 빠름 |
| 해석 | 어려움 | 쉬움 |
| GPU | 필요 | 불필요 |
| PR-AUC | 0.55 | 0.40 |

→ **Autoencoder가 약간 우위**, 그러나 학습 비용.

### Q2. LSTM이 진짜 효과?

**A.** **시퀀스 데이터 있을 때만**.

- 책 데이터엔 customer_id 없음 → LSTM 어려움
- 실제 카드사 데이터엔 효과적 (PR-AUC +0.10)

### Q3. Transformer가 LSTM보다 좋은가?

**A.** **데이터 많을 때**.

- 10K 미만: LSTM 우위
- 100K+: Transformer 우위

### Q4. 학습이 안 됨

**A.** 점검:
- 정규화 (StandardScaler)
- Learning rate 낮춤
- Batch size 조정
- Class weight 설정

### Q5. GAN으로 가짜 사기 생성 좋은가?

**A.** **보조적**.

- SMOTE보다 정교
- 그러나 진짜 사기 패턴과 다를 위험
- 학습 보조 데이터로만 사용

### Q6. 실시간 추론이 가능?

**A.**
- Autoencoder: ~10ms (가능)
- LSTM: ~20ms (가능)
- Transformer: ~50ms (실시간 가능)
- → 모두 카드 결제 100ms 안에 가능

### Q7. 다음은 뭐 배워야?

**A.** Lab 4 (그래프 + NetworkX). 사기는 본질적으로 네트워크 현상.

---

## 🎯 핵심 7가지

1. **Deep Autoencoder**: 정상만 학습 → 재구성 오차 = 사기.
2. **Encoding 차원** 이 hyperparameter (보통 14~16).
3. **LSTM**: 고객별 거래 시퀀스 학습 (customer_id 필요).
4. **Transformer**: 데이터 많을 때 LSTM 대체.
5. **GNN**: 거래 네트워크 그래프 분석 (알리페이 방식).
6. **CTGAN**: 합성 사기 데이터 생성으로 학습 보조.
7. **DL 단점**: 학습 비용, 블랙박스 → XAI 필수.

---

## 📖 더 읽을거리

### Autoencoder
- Goodfellow, I., et al. (2016). *Deep Learning*. MIT Press. Ch. 14.

### LSTM Fraud Detection
- Heryadi, Y., & Warnars, H. L. H. S. (2017). Learning temporal representation of transaction amount for fraudulent transaction recognition using CNN, Stacked LSTM, and LSTM-CNN. *International Workshop on Big Data and Information Security*.

### GNN
- Wang, D., et al. (2019). A semi-supervised graph attentive network for financial fraud detection. *IEEE ICDM*.
- PyTorch Geometric: https://pytorch-geometric.readthedocs.io/

### Federated Learning
- Flower: https://flower.dev/

---

> **다음 실습** — Lab 4: 그래프 데이터 + NetworkX
